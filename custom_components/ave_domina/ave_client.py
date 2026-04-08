"""AVE DOMINA Plus protocol client — WebSocket and HTTP communication."""
from __future__ import annotations

import asyncio
import logging
from dataclasses import dataclass, field
from typing import Callable

import aiohttp

from .const import (
    STX, ETX, EOT, GS, RS,
    DEFAULT_WS_PORT, DEFAULT_HTTP_PORT,
    WS_SUBPROTOCOLS,
    CMD_PONG,
)

_LOGGER = logging.getLogger(__name__)


@dataclass
class AveMessage:
    """Parsed AVE protocol message."""
    command: str = ""
    parameters: list[str] = field(default_factory=list)
    records: list[list[str]] = field(default_factory=list)


class AveProtocol:
    """Encodes and decodes AVE DOMINA Plus binary protocol frames."""

    def build_crc(self, frame_body: bytes) -> str:
        """Calculate CRC: XOR all bytes, invert, return as 2-char uppercase hex."""
        crc = 0
        for b in frame_body:
            crc ^= b
        crc = 0xFF - crc
        return f"{crc:02X}"

    def encode(
        self,
        command: str,
        parameters: list[str] | None = None,
        records: list[str] | None = None,
    ) -> bytes:
        """Encode a command into an AVE binary frame."""
        body = bytearray()
        body.append(STX)
        body.extend(command.encode("utf-8"))

        if parameters is not None:
            for param in parameters:
                body.append(GS)
                body.extend(param.encode("utf-8"))

        if records is not None:
            for record in records:
                body.append(RS)
                parts = record.split(",")
                for i, part in enumerate(parts):
                    body.extend(part.encode("utf-8"))
                    if i < len(parts) - 1:
                        body.append(GS)

        body.append(ETX)
        crc = self.build_crc(bytes(body))
        body.extend(crc.encode("ascii"))  # 2 ASCII hex chars, as per AVE SDK
        body.append(EOT)
        return bytes(body)

    def decode(self, data: bytes) -> list[AveMessage]:
        """Decode raw bytes into a list of AveMessage objects."""
        # Split on EOT byte to get individual frames
        raw_frames = data.split(bytes([EOT]))
        messages = []

        for raw_frame in raw_frames:
            # Minimum valid frame: STX + cmd + ETX + 2 CRC ASCII chars
            if len(raw_frame) < 5:
                continue
            # Frame format: STX + PAYLOAD + ETX + CRC_CHAR1 + CRC_CHAR2
            # Strip STX (first byte) and last 3 bytes (ETX + 2 CRC ASCII chars)
            inner_bytes = raw_frame[1:-3]

            # Split on RS to get records
            pieces = inner_bytes.split(bytes([RS]))

            def _decode_field(b: bytes) -> str:
                try:
                    return b.decode("utf-8")
                except UnicodeDecodeError:
                    return b.decode("latin-1")

            # Split first piece on GS to get command + parameters
            fields = pieces[0].split(bytes([GS]))
            msg = AveMessage()
            msg.command = _decode_field(fields[0]) if fields else ""
            msg.parameters = [_decode_field(f) for f in fields[1:]] if len(fields) > 1 else []

            for i in range(1, len(pieces)):
                record_fields = [_decode_field(f) for f in pieces[i].split(bytes([GS]))]
                msg.records.append(record_fields)

            messages.append(msg)

        return messages


class AveClient:
    """Async client for AVE DOMINA Plus server communication."""

    def __init__(self, host: str, port: int = DEFAULT_WS_PORT) -> None:
        self.host = host
        self.port = port
        self._protocol = AveProtocol()
        self._ws: aiohttp.ClientWebSocketResponse | None = None
        self._session: aiohttp.ClientSession | None = None
        self._listener_task: asyncio.Task | None = None
        self._callbacks: list[Callable[[AveMessage], None]] = []
        self._connected = False
        self._reconnect_task: asyncio.Task | None = None
        self._should_reconnect = True

    @property
    def connected(self) -> bool:
        return self._connected

    def register_callback(self, callback: Callable[[AveMessage], None]) -> None:
        self._callbacks.append(callback)

    def remove_callback(self, callback: Callable[[AveMessage], None]) -> None:
        self._callbacks.remove(callback)

    async def connect(self) -> bool:
        url = f"ws://{self.host}:{self.port}"
        try:
            self._session = aiohttp.ClientSession()
            self._ws = await self._session.ws_connect(url, protocols=WS_SUBPROTOCOLS)
            self._connected = True
            self._listener_task = asyncio.create_task(self._listen())
            _LOGGER.info("Connected to AVE server at %s:%s", self.host, self.port)
            return True
        except (aiohttp.ClientError, OSError) as err:
            _LOGGER.error("Failed to connect to AVE server: %s", err)
            self._connected = False
            if self._session:
                await self._session.close()
                self._session = None
            return False

    async def disconnect(self) -> None:
        self._should_reconnect = False
        if self._reconnect_task:
            self._reconnect_task.cancel()
        if self._listener_task:
            self._listener_task.cancel()
        if self._ws and not self._ws.closed:
            await self._ws.close()
        if self._session and not self._session.closed:
            await self._session.close()
        self._connected = False

    async def send_command(self, command: str, parameters: list[str] | None = None, records: list[str] | None = None) -> bool:
        if not self._ws or self._ws.closed:
            return False
        frame = self._protocol.encode(command, parameters, records)
        try:
            await self._ws.send_bytes(frame)
            return True
        except (aiohttp.ClientError, ConnectionError):
            return False

    async def send_http_command(self, command: str, device_id: int, value: int, is_dimmer_level: bool = False) -> bool:
        base_url = f"http://{self.host}:{DEFAULT_HTTP_PORT}/bridge.php"
        if is_dimmer_level:
            url = f"{base_url}?command={command}&parameter={device_id}&dati={value}"
        else:
            url = f"{base_url}?command={command}&parameter={device_id},{value}"
        try:
            session = self._session or aiohttp.ClientSession()
            close_session = self._session is None
            try:
                async with session.get(url) as resp:
                    return resp.status == 200
            finally:
                if close_session:
                    await session.close()
        except (aiohttp.ClientError, OSError):
            return False

    async def _listen(self) -> None:
        try:
            async for msg in self._ws:
                if msg.type == aiohttp.WSMsgType.BINARY:
                    self._handle_raw_message(msg.data)
                elif msg.type == aiohttp.WSMsgType.TEXT:
                    self._handle_raw_message(msg.data.encode("utf-8"))
                elif msg.type in (aiohttp.WSMsgType.CLOSED, aiohttp.WSMsgType.ERROR):
                    break
        except asyncio.CancelledError:
            return
        except Exception:
            _LOGGER.exception("Error in WebSocket listener")
        finally:
            self._connected = False
            if self._should_reconnect:
                self._reconnect_task = asyncio.create_task(self._reconnect())

    def _handle_raw_message(self, data: bytes) -> None:
        messages = self._protocol.decode(data)
        for message in messages:
            if message.command == "ping":
                asyncio.create_task(self.send_command(CMD_PONG))
                continue
            for callback in self._callbacks:
                try:
                    callback(message)
                except Exception:
                    _LOGGER.exception("Error in message callback")

    async def _reconnect(self) -> None:
        delay = 2
        while self._should_reconnect:
            await asyncio.sleep(delay)
            if await self.connect():
                return
            delay = min(delay * 2, 60)
