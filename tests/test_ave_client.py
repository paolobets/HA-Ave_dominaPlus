"""Tests for AVE protocol client — encoding and decoding."""
import pytest
from custom_components.ave_domina.ave_client import AveProtocol


class TestCRC:
    def test_crc_simple_command(self):
        proto = AveProtocol()
        frame_body = b"\x02LM\x03"
        crc = proto.build_crc(frame_body)
        assert crc == "FF"

    def test_crc_with_parameters(self):
        proto = AveProtocol()
        frame_body = b"\x02STS\x1d42\x03"
        crc = proto.build_crc(frame_body)
        expected_xor = 0
        for b in frame_body:
            expected_xor ^= b
        expected_crc = f"{(0xFF - expected_xor):02X}"
        assert crc == expected_crc


class TestEncode:
    def test_encode_simple_command(self):
        proto = AveProtocol()
        msg = proto.encode("LM")
        assert msg[0] == 0x02
        assert msg[-1] == 0x04
        assert msg[-3] == 0x03
        assert bytes(msg[1:3]) == b"LM"

    def test_encode_command_with_parameters(self):
        proto = AveProtocol()
        msg = proto.encode("LMC", parameters=["5"])
        assert msg[0] == 0x02
        assert bytes(msg[1:4]) == b"LMC"
        assert msg[4] == 0x1D
        assert bytes(msg[5:6]) == b"5"
        assert msg[6] == 0x03

    def test_encode_command_with_records(self):
        proto = AveProtocol()
        msg = proto.encode("STS", parameters=["42"], records=["0,1,200"])
        raw = bytes(msg)
        assert 0x1E in raw

    def test_encode_command_multiple_parameters(self):
        proto = AveProtocol()
        msg = proto.encode("WSF", parameters=["1"])
        raw = bytes(msg)
        assert raw[0] == 0x02
        assert raw[-1] == 0x04


class TestDecode:
    def test_decode_simple_response(self):
        proto = AveProtocol()
        body = b"\x02lm\x1e1\x1dSoggiorno\x1d0\x03"
        crc_val = 0
        for b in body:
            crc_val ^= b
        crc_byte = 0xFF - crc_val
        raw = body + bytes([crc_byte]) + b"\x04"
        messages = proto.decode(raw)
        assert len(messages) == 1
        assert messages[0].command == "lm"
        assert len(messages[0].records) == 1
        assert messages[0].records[0][0] == "1"
        assert messages[0].records[0][1] == "Soggiorno"

    def test_decode_upd_message(self):
        proto = AveProtocol()
        body = b"\x02upd\x1dWS\x1d1\x1d5\x1d147\x03"
        crc_val = 0
        for b in body:
            crc_val ^= b
        crc_byte = 0xFF - crc_val
        raw = body + bytes([crc_byte]) + b"\x04"
        messages = proto.decode(raw)
        assert len(messages) == 1
        assert messages[0].command == "upd"
        assert messages[0].parameters == ["WS", "1", "5", "147"]

    def test_decode_multiple_messages(self):
        proto = AveProtocol()
        body1 = b"\x02ping\x03"
        crc1 = 0
        for b in body1:
            crc1 ^= b
        frame1 = body1 + bytes([0xFF - crc1]) + b"\x04"
        body2 = b"\x02pong\x03"
        crc2 = 0
        for b in body2:
            crc2 ^= b
        frame2 = body2 + bytes([0xFF - crc2]) + b"\x04"
        messages = proto.decode(frame1 + frame2)
        assert len(messages) == 2
        assert messages[0].command == "ping"
        assert messages[1].command == "pong"
