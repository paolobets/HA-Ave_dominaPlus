"""Tests for AVE protocol client — encoding and decoding."""
import pytest
from custom_components.ave_domina.ave_client import AveProtocol


def _build_frame(body: bytes) -> bytes:
    """Helper: compute CRC and build a complete AVE frame from body (STX...ETX)."""
    crc_val = 0
    for b in body:
        crc_val ^= b
    crc_str = f"{(0xFF - crc_val):02X}"
    return body + crc_str.encode("ascii") + b"\x04"


class TestCRC:
    def test_crc_simple_command(self):
        proto = AveProtocol()
        frame_body = b"\x02LM\x03"
        crc = proto.build_crc(frame_body)
        # 0x02 ^ 0x4C ^ 0x4D ^ 0x03 = 0x00; 0xFF - 0x00 = 0xFF -> "FF"
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
        # Frame: STX + "LM" + ETX + 2 CRC ASCII chars + EOT
        assert msg[0] == 0x02       # STX
        assert msg[-1] == 0x04      # EOT
        assert msg[-4] == 0x03      # ETX (before 2 CRC chars + EOT)
        assert bytes(msg[1:3]) == b"LM"
        assert len(msg) == 7        # STX(1) + LM(2) + ETX(1) + CRC(2) + EOT(1)

    def test_encode_command_with_parameters(self):
        proto = AveProtocol()
        msg = proto.encode("LMC", parameters=["5"])
        assert msg[0] == 0x02
        assert bytes(msg[1:4]) == b"LMC"
        assert msg[4] == 0x1D      # GS separator
        assert bytes(msg[5:6]) == b"5"
        assert msg[6] == 0x03      # ETX

    def test_encode_command_with_records(self):
        proto = AveProtocol()
        msg = proto.encode("STS", parameters=["42"], records=["0,1,200"])
        raw = bytes(msg)
        assert 0x1E in raw  # RS must be present for records

    def test_encode_decode_roundtrip(self):
        """Encode a command, then decode it — should get the same command back."""
        proto = AveProtocol()
        msg = proto.encode("WSF", parameters=["1"])
        decoded = proto.decode(msg)
        assert len(decoded) == 1
        assert decoded[0].command == "WSF"
        assert decoded[0].parameters == ["1"]


class TestDecode:
    def test_decode_simple_response(self):
        proto = AveProtocol()
        body = b"\x02lm\x1e1\x1dSoggiorno\x1d0\x03"
        raw = _build_frame(body)
        messages = proto.decode(raw)
        assert len(messages) == 1
        assert messages[0].command == "lm"
        assert len(messages[0].records) == 1
        assert messages[0].records[0][0] == "1"
        assert messages[0].records[0][1] == "Soggiorno"

    def test_decode_upd_message(self):
        proto = AveProtocol()
        body = b"\x02upd\x1dWS\x1d1\x1d5\x1d147\x03"
        raw = _build_frame(body)
        messages = proto.decode(raw)
        assert len(messages) == 1
        assert messages[0].command == "upd"
        assert messages[0].parameters == ["WS", "1", "5", "147"]

    def test_decode_multiple_messages(self):
        proto = AveProtocol()
        frame1 = _build_frame(b"\x02ping\x03")
        frame2 = _build_frame(b"\x02pong\x03")
        messages = proto.decode(frame1 + frame2)
        assert len(messages) == 2
        assert messages[0].command == "ping"
        assert messages[1].command == "pong"
