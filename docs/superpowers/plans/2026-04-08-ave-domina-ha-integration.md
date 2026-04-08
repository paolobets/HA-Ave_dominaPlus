# AVE DOMINA Plus HA Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Home Assistant custom component that connects to the AVE DOMINA Plus 53AB-WBS server via WebSocket and HTTP, auto-discovers all devices, and provides real-time control.

**Architecture:** A single custom component (`ave_domina`) with an async WebSocket client for real-time state updates and an HTTP client for device commands. A coordinator bridges the protocol layer to HA entity platforms (light, cover, climate, button, alarm, sensor).

**Tech Stack:** Python 3.12+, aiohttp (WebSocket + HTTP client), Home Assistant 2024.1+, pytest + pytest-homeassistant-custom-component

---

## File Structure

```
custom_components/ave_domina/
  __init__.py              — Integration setup: config entry, coordinator lifecycle
  manifest.json            — HACS metadata, domain, iot_class
  const.py                 — All constants: device types, commands, ports, defaults
  ave_client.py            — Protocol layer: WS connection, HTTP commands, message encode/decode
  coordinator.py           — State management: device registry, UPD dispatch, entity notifications
  config_flow.py           — UI config: host input, connection test, options flow
  entity.py                — Base entity class shared by all platforms
  light.py                 — Light + dimmer entities (AVE types 1, 2, 9, 22)
  cover.py                 — Cover/shutter entities (AVE types 3, 16, 19)
  climate.py               — Thermostat entities (AVE type 4)
  button.py                — Scenario entities (AVE type 6)
  alarm_control_panel.py   — Antitheft area entities (AVE type 12)
  sensor.py                — Temperature, humidity, energy sensors
  strings.json             — English UI strings
  translations/it.json     — Italian UI strings

tests/
  conftest.py              — Shared fixtures: mock WS server, fake AVE responses
  test_ave_client.py       — Protocol tests: encode, decode, CRC, init sequence
  test_config_flow.py      — Config flow tests
  test_coordinator.py      — State management tests
  test_light.py            — Light platform tests
  test_cover.py            — Cover platform tests
  test_climate.py          — Climate platform tests

hacs.json                  — HACS repository metadata
```

---

### Task 1: Project scaffolding and constants

**Files:**
- Create: `custom_components/ave_domina/manifest.json`
- Create: `custom_components/ave_domina/const.py`
- Create: `custom_components/ave_domina/__init__.py` (stub)
- Create: `hacs.json`

- [ ] **Step 1: Create manifest.json**

```json
{
  "domain": "ave_domina",
  "name": "AVE DOMINA Plus",
  "codeowners": [],
  "config_flow": true,
  "dependencies": [],
  "documentation": "https://github.com/",
  "iot_class": "local_push",
  "requirements": [],
  "version": "1.0.0"
}
```

- [ ] **Step 2: Create hacs.json**

```json
{
  "name": "AVE DOMINA Plus",
  "render_readme": true,
  "homeassistant": "2024.1.0"
}
```

- [ ] **Step 3: Create const.py with all protocol constants**

```python
"""Constants for the AVE DOMINA Plus integration."""

DOMAIN = "ave_domina"

# Connection
DEFAULT_WS_PORT = 14001
DEFAULT_HTTP_PORT = 80
WS_SUBPROTOCOLS = ["binary", "base64"]
RECONNECT_INTERVAL_BASE = 2
RECONNECT_INTERVAL_MAX = 60
SILENCE_TIMEOUT = 90
STABLE_CONNECTION_RESET = 60

# Frame bytes
STX = 0x02
ETX = 0x03
EOT = 0x04
GS = 0x1D   # Group Separator — parameter delimiter
RS = 0x1E   # Record Separator — record delimiter

# WebSocket commands (sent)
CMD_LM = "LM"      # List maps/areas
CMD_LMC = "LMC"    # List map commands (per area)
CMD_LML = "LML"    # List map labels (per area)
CMD_LDI = "LDI"    # List devices by ID
CMD_LI2 = "LI2"    # List addresses
CMD_WSF = "WSF"    # Get status by family
CMD_WTS = "WTS"    # Get thermostat status
CMD_GTM = "GTM"    # Get thermostat modes (IR)
CMD_GMA = "GMA"    # Get Marcia/Arresto devices
CMD_GNA = "GNA"    # Get No Action devices
CMD_GSF = "GSF"    # Get status by family (detailed)
CMD_STS = "STS"    # Set thermostat state
CMD_SU2 = "SU2"    # Setup command 2
CMD_SU3 = "SU3"    # Setup command 3
CMD_PONG = "PONG"  # Keepalive response
CMD_TOO = "TOO"    # VMC Daikin on/off
CMD_VMC = "VMC"    # VMC Daikin speed
CMD_VMM = "VMM"    # VMC Daikin mode

# HTTP bridge commands
BRIDGE_URL = "bridge.php"
BRIDGE_CMD_SIL = "SIL"  # Set intensity level (dimmer)

# UPD prefixes (received)
UPD_D = "D"       # Device icon
UPD_WS = "WS"     # Widget status (type, id, status)
UPD_WT = "WT"     # Thermo data (subtype: T=temp, S=season, O=offset, L=fan, Z=localoff)
UPD_TT = "TT"     # Thermo temp (from map cmd)
UPD_TP = "TP"     # Thermo setpoint
UPD_TM = "TM"     # Thermo mode
UPD_TR = "TR"     # Thermo running
UPD_TW = "TW"     # Thermo window state
UPD_TK = "TK"     # Thermo keyboard lock
UPD_LL = "LL"     # Level/sensor reading
UPD_UMI = "UMI"   # Humidity probe
UPD_SRE = "SRE"   # Scenario executed
UPD_STO = "STO"   # Scenario stop
UPD_EPV = "epv"   # Economizer power values

# AVE device type IDs
AVE_TYPE_LIGHT = 1
AVE_TYPE_DIMMER = 2
AVE_TYPE_SHUTTER = 3
AVE_TYPE_THERMOSTAT = 4
AVE_TYPE_ECONOMIZER = 5
AVE_TYPE_SCENARIO = 6
AVE_TYPE_GENERIC = 9
AVE_TYPE_ANTITHEFT_AREA = 12
AVE_TYPE_ANTITHEFT_SENSOR = 13
AVE_TYPE_AUDIO = 14
AVE_TYPE_SHUTTER_ALT1 = 16
AVE_TYPE_ABANO = 17
AVE_TYPE_SHUTTER_ALT2 = 19
AVE_TYPE_LIGHT_DALI = 22

# Device type groupings for platform mapping
LIGHT_TYPES = {AVE_TYPE_LIGHT, AVE_TYPE_DIMMER, AVE_TYPE_GENERIC, AVE_TYPE_LIGHT_DALI}
COVER_TYPES = {AVE_TYPE_SHUTTER, AVE_TYPE_SHUTTER_ALT1, AVE_TYPE_SHUTTER_ALT2}
CLIMATE_TYPES = {AVE_TYPE_THERMOSTAT}
SCENARIO_TYPES = {AVE_TYPE_SCENARIO}
ALARM_TYPES = {AVE_TYPE_ANTITHEFT_AREA}

# WSF family IDs to query at init
WSF_FAMILIES = ["1", "2", "22", "9", "3", "16", "19", "6"]

# Thermostat
THERMO_REFRESH_INTERVAL = 15  # seconds
THERMO_REFRESH_CYCLES = 6
THERMO_SEASON_SUMMER = 0
THERMO_SEASON_WINTER = 1
THERMO_SEASON_ALL = 2
THERMO_VMC_DAIKIN_THRESHOLD = 10000000

# Config flow
CONF_HOST = "host"
CONF_PORT = "port"
CONF_USERNAME = "username"
CONF_PASSWORD = "password"

# Platforms
PLATFORMS = ["light", "cover", "climate", "button", "alarm_control_panel", "sensor"]
```

- [ ] **Step 4: Create stub __init__.py**

```python
"""The AVE DOMINA Plus integration."""
```

- [ ] **Step 5: Commit**

```bash
git add custom_components/ave_domina/manifest.json custom_components/ave_domina/const.py custom_components/ave_domina/__init__.py hacs.json
git commit -m "feat: scaffold AVE DOMINA Plus integration with constants"
```

---

### Task 2: AVE protocol client — message encoding/decoding

**Files:**
- Create: `tests/conftest.py`
- Create: `tests/test_ave_client.py`
- Create: `custom_components/ave_domina/ave_client.py`

- [ ] **Step 1: Create test fixtures in conftest.py**

```python
"""Shared test fixtures for AVE DOMINA Plus tests."""
import pytest


@pytest.fixture
def ave_host():
    """Return a test AVE server host."""
    return "192.168.1.100"


@pytest.fixture
def ave_port():
    """Return a test AVE server port."""
    return 14001
```

- [ ] **Step 2: Write failing tests for message encoding and CRC**

```python
"""Tests for AVE protocol client — encoding and decoding."""
import pytest
from custom_components.ave_domina.ave_client import AveProtocol


class TestCRC:
    """Test CRC calculation."""

    def test_crc_simple_command(self):
        # CRC is XOR of all bytes from STX to ETX, then 0xFF - xor, as 2-char uppercase hex
        proto = AveProtocol()
        frame_body = b"\x02LM\x03"
        crc = proto.build_crc(frame_body)
        # Manual calc: 0x02 ^ 0x4C ^ 0x4D ^ 0x03 = 0x02^0x4C=0x4E, 0x4E^0x4D=0x03, 0x03^0x03=0x00
        # 0xFF - 0x00 = 0xFF -> "FF"
        assert crc == "FF"

    def test_crc_with_parameters(self):
        proto = AveProtocol()
        # STS command with param separator
        frame_body = b"\x02STS\x1d42\x03"
        crc = proto.build_crc(frame_body)
        expected_xor = 0
        for b in frame_body:
            expected_xor ^= b
        expected_crc = f"{(0xFF - expected_xor):02X}"
        assert crc == expected_crc


class TestEncode:
    """Test message encoding."""

    def test_encode_simple_command(self):
        proto = AveProtocol()
        msg = proto.encode("LM")
        # Should be: STX + "LM" + ETX + CRC(2 chars) + EOT
        assert msg[0] == 0x02  # STX
        assert msg[-1] == 0x04  # EOT
        assert msg[-3] == 0x03  # ETX
        # Command bytes
        assert bytes(msg[1:3]) == b"LM"

    def test_encode_command_with_parameters(self):
        proto = AveProtocol()
        msg = proto.encode("LMC", parameters=["5"])
        assert msg[0] == 0x02
        # STX + "LMC" + GS + "5" + ETX + CRC + EOT
        assert bytes(msg[1:4]) == b"LMC"
        assert msg[4] == 0x1D  # GS separator
        assert bytes(msg[5:6]) == b"5"
        assert msg[6] == 0x03  # ETX

    def test_encode_command_with_records(self):
        proto = AveProtocol()
        msg = proto.encode("STS", parameters=["42"], records=["0,1,200"])
        # STX + "STS" + GS + "42" + RS + "0" + GS + "1" + GS + "200" + ETX + CRC + EOT
        raw = bytes(msg)
        assert 0x1E in raw  # RS must be present for records

    def test_encode_command_multiple_parameters(self):
        proto = AveProtocol()
        msg = proto.encode("WSF", parameters=["1"])
        raw = bytes(msg)
        assert raw[0] == 0x02
        assert raw[-1] == 0x04


class TestDecode:
    """Test message decoding."""

    def test_decode_simple_response(self):
        proto = AveProtocol()
        # Build a fake response: STX + "lm" + RS + record1 + ETX + CRC + EOT
        body = b"\x02lm\x1e1\x1dSoggiorno\x1d0\x03"
        crc_val = 0
        for b in body:
            crc_val ^= b
        crc_str = f"{(0xFF - crc_val):02X}"
        raw = body + crc_str.encode("ascii") + b"\x04"
        messages = proto.decode(raw)
        assert len(messages) == 1
        assert messages[0].command == "lm"
        assert len(messages[0].records) == 1
        assert messages[0].records[0][0] == "1"
        assert messages[0].records[0][1] == "Soggiorno"

    def test_decode_upd_message(self):
        proto = AveProtocol()
        # UPD with parameters: upd + GS + "WS" + GS + "1" + GS + "5" + GS + "147"
        body = b"\x02upd\x1dWS\x1d1\x1d5\x1d147\x03"
        crc_val = 0
        for b in body:
            crc_val ^= b
        crc_str = f"{(0xFF - crc_val):02X}"
        raw = body + crc_str.encode("ascii") + b"\x04"
        messages = proto.decode(raw)
        assert len(messages) == 1
        assert messages[0].command == "upd"
        assert messages[0].parameters == ["WS", "1", "5", "147"]

    def test_decode_multiple_messages(self):
        proto = AveProtocol()
        # Two messages concatenated
        body1 = b"\x02ping\x03"
        crc1 = 0
        for b in body1:
            crc1 ^= b
        crc1_str = f"{(0xFF - crc1):02X}"
        frame1 = body1 + crc1_str.encode("ascii") + b"\x04"

        body2 = b"\x02pong\x03"
        crc2 = 0
        for b in body2:
            crc2 ^= b
        crc2_str = f"{(0xFF - crc2):02X}"
        frame2 = body2 + crc2_str.encode("ascii") + b"\x04"

        messages = proto.decode(frame1 + frame2)
        assert len(messages) == 2
        assert messages[0].command == "ping"
        assert messages[1].command == "pong"
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `cd "C:/sviluppo/integrazione AVE" && python -m pytest tests/test_ave_client.py -v`
Expected: FAIL with `ModuleNotFoundError: No module named 'custom_components.ave_domina.ave_client'`

- [ ] **Step 4: Implement AveProtocol class**

```python
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
        body.extend(crc.encode("ascii"))
        body.append(EOT)
        return bytes(body)

    def decode(self, data: bytes) -> list[AveMessage]:
        """Decode raw bytes into a list of AveMessage objects."""
        try:
            text = data.decode("utf-8")
        except UnicodeDecodeError:
            text = "".join(chr(b) for b in data)

        frames = text.split(chr(EOT))
        messages = []

        for frame in frames:
            if len(frame) < 4:
                continue
            # Strip STX (first char) and CRC (last 2 chars before we split)
            inner = frame[1:-2]  # skip STX, strip 2-char CRC after ETX
            # Remove ETX
            if inner and inner[-1] == chr(ETX):
                inner = inner[:-1]

            # Split records from parameters
            pieces = inner.split(chr(RS))
            # First piece: command + parameters (separated by GS)
            fields = pieces[0].split(chr(GS))
            msg = AveMessage()
            msg.command = fields[0] if fields else ""
            msg.parameters = fields[1:] if len(fields) > 1 else []

            # Remaining pieces are records
            for i in range(1, len(pieces)):
                record_fields = pieces[i].split(chr(GS))
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
        """Return True if WebSocket is connected."""
        return self._connected

    def register_callback(self, callback: Callable[[AveMessage], None]) -> None:
        """Register a callback for incoming messages."""
        self._callbacks.append(callback)

    def remove_callback(self, callback: Callable[[AveMessage], None]) -> None:
        """Remove a previously registered callback."""
        self._callbacks.remove(callback)

    async def connect(self) -> bool:
        """Connect to the AVE server via WebSocket."""
        url = f"ws://{self.host}:{self.port}"
        try:
            self._session = aiohttp.ClientSession()
            self._ws = await self._session.ws_connect(
                url,
                protocols=WS_SUBPROTOCOLS,
            )
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
        """Disconnect from the AVE server."""
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
        _LOGGER.info("Disconnected from AVE server")

    async def send_command(
        self,
        command: str,
        parameters: list[str] | None = None,
        records: list[str] | None = None,
    ) -> bool:
        """Send a WebSocket command to the AVE server."""
        if not self._ws or self._ws.closed:
            _LOGGER.warning("Cannot send command %s: not connected", command)
            return False
        frame = self._protocol.encode(command, parameters, records)
        try:
            await self._ws.send_bytes(frame)
            _LOGGER.debug("Sent WS command: %s params=%s records=%s", command, parameters, records)
            return True
        except (aiohttp.ClientError, ConnectionError) as err:
            _LOGGER.error("Failed to send command %s: %s", command, err)
            return False

    async def send_http_command(
        self,
        command: str,
        device_id: int,
        value: int,
        is_dimmer_level: bool = False,
    ) -> bool:
        """Send an HTTP bridge command for device control (lights, shutters, scenarios)."""
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
                    if resp.status == 200:
                        _LOGGER.debug("HTTP command OK: %s", url)
                        return True
                    _LOGGER.error("HTTP command failed with status %s: %s", resp.status, url)
                    return False
            finally:
                if close_session:
                    await session.close()
        except (aiohttp.ClientError, OSError) as err:
            _LOGGER.error("HTTP command error: %s", err)
            return False

    async def _listen(self) -> None:
        """Listen for incoming WebSocket messages."""
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
        """Parse raw data and dispatch to callbacks."""
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
        """Attempt to reconnect with exponential backoff."""
        delay = 2
        while self._should_reconnect:
            _LOGGER.info("Reconnecting in %s seconds...", delay)
            await asyncio.sleep(delay)
            if await self.connect():
                return
            delay = min(delay * 2, 60)
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `cd "C:/sviluppo/integrazione AVE" && python -m pytest tests/test_ave_client.py -v`
Expected: All tests PASS

- [ ] **Step 6: Commit**

```bash
git add custom_components/ave_domina/ave_client.py tests/conftest.py tests/test_ave_client.py
git commit -m "feat: implement AVE protocol encoding/decoding and async client"
```

---

### Task 3: Coordinator — device registry and state management

**Files:**
- Create: `tests/test_coordinator.py`
- Create: `custom_components/ave_domina/coordinator.py`

- [ ] **Step 1: Write failing tests for coordinator**

```python
"""Tests for AVE DOMINA Plus coordinator."""
import pytest
from unittest.mock import AsyncMock, MagicMock
from custom_components.ave_domina.ave_client import AveMessage
from custom_components.ave_domina.coordinator import AveCoordinator


@pytest.fixture
def mock_client():
    client = MagicMock()
    client.connected = True
    client.connect = AsyncMock(return_value=True)
    client.disconnect = AsyncMock()
    client.send_command = AsyncMock(return_value=True)
    client.send_http_command = AsyncMock(return_value=True)
    client.register_callback = MagicMock()
    return client


@pytest.fixture
def coordinator(mock_client):
    return AveCoordinator(mock_client)


class TestDeviceRegistration:
    """Test device discovery from LDI response."""

    def test_handle_ldi_creates_devices(self, coordinator):
        msg = AveMessage(
            command="ldi",
            parameters=[],
            records=[
                ["1", "Luce Soggiorno", "1", "1"],
                ["2", "Dimmer Camera", "2", "2"],
                ["3", "Tapparella", "3", "1"],
                ["40", "Studio T", "4", "1"],
                ["10", "Scenario Notte", "6", "1"],
            ],
        )
        coordinator.handle_message(msg)
        assert len(coordinator.devices) == 5
        assert coordinator.devices[1].name == "Luce Soggiorno"
        assert coordinator.devices[1].device_type == 1
        assert coordinator.devices[40].device_type == 4
        assert coordinator.devices[40].temperature == 0.0
        assert coordinator.devices[40].setpoint == 0.0

    def test_handle_ldi_detects_dimmer(self, coordinator):
        msg = AveMessage(command="ldi", parameters=[], records=[
            ["5", "Dimmer Sala", "2", "1"],
        ])
        coordinator.handle_message(msg)
        assert coordinator.devices[5].device_type == 2

    def test_handle_ldi_detects_vmc_daikin(self, coordinator):
        msg = AveMessage(command="ldi", parameters=[], records=[
            ["10000050", "VMC Sala", "4", "1"],
        ])
        coordinator.handle_message(msg)
        assert coordinator.devices[50].is_vmc_daikin is True


class TestUPDHandling:
    """Test UPD message processing."""

    def test_upd_ws_updates_device_status(self, coordinator):
        # First register a device
        coordinator.handle_message(AveMessage(command="ldi", parameters=[], records=[
            ["5", "Luce", "1", "1"],
        ]))
        # Then send status update: WS, type=1, id=5, status=1
        upd = AveMessage(command="upd", parameters=["WS", "1", "5", "1"])
        coordinator.handle_message(upd)
        assert coordinator.devices[5].status == 1

    def test_upd_wt_t_updates_thermo_temperature(self, coordinator):
        coordinator.handle_message(AveMessage(command="ldi", parameters=[], records=[
            ["40", "Studio T", "4", "1"],
        ]))
        upd = AveMessage(command="upd", parameters=["WT", "T", "40", "198"])
        coordinator.handle_message(upd)
        assert coordinator.devices[40].temperature == 19.8

    def test_upd_tp_updates_thermo_setpoint(self, coordinator):
        coordinator.handle_message(AveMessage(command="ldi", parameters=[], records=[
            ["40", "Studio T", "4", "1"],
        ]))
        upd = AveMessage(command="upd", parameters=["TP", "40", "175"])
        coordinator.handle_message(upd)
        assert coordinator.devices[40].setpoint == 17.5

    def test_upd_tm_updates_thermo_mode(self, coordinator):
        coordinator.handle_message(AveMessage(command="ldi", parameters=[], records=[
            ["40", "Studio T", "4", "1"],
        ]))
        upd = AveMessage(command="upd", parameters=["TM", "40", "1"])
        coordinator.handle_message(upd)
        assert coordinator.devices[40].mode == 1

    def test_upd_ws_cover_status(self, coordinator):
        coordinator.handle_message(AveMessage(command="ldi", parameters=[], records=[
            ["10", "Tapparella", "3", "1"],
        ]))
        upd = AveMessage(command="upd", parameters=["WS", "3", "10", "127"])
        coordinator.handle_message(upd)
        assert coordinator.devices[10].status == 127


class TestAreaRegistration:
    """Test area/map discovery from LM response."""

    def test_handle_lm_creates_areas(self, coordinator):
        msg = AveMessage(
            command="lm",
            parameters=[],
            records=[
                ["1", "Piano Terra", "0"],
                ["2", "Primo Piano", "1"],
            ],
        )
        coordinator.handle_message(msg)
        assert len(coordinator.areas) == 2
        assert coordinator.areas[1].name == "Piano Terra"
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd "C:/sviluppo/integrazione AVE" && python -m pytest tests/test_coordinator.py -v`
Expected: FAIL with `ModuleNotFoundError`

- [ ] **Step 3: Implement coordinator**

```python
"""Coordinator for AVE DOMINA Plus integration."""
from __future__ import annotations

import asyncio
import logging
from dataclasses import dataclass, field
from typing import Callable

from .ave_client import AveClient, AveMessage
from .const import (
    AVE_TYPE_THERMOSTAT,
    AVE_TYPE_DIMMER,
    AVE_TYPE_ECONOMIZER,
    THERMO_VMC_DAIKIN_THRESHOLD,
    CMD_LM, CMD_LMC, CMD_LML, CMD_LDI, CMD_LI2,
    CMD_WSF, CMD_WTS, CMD_GTM, CMD_GMA, CMD_GNA, CMD_GSF,
    CMD_STS, CMD_SU2, CMD_SU3,
    WSF_FAMILIES,
    THERMO_REFRESH_INTERVAL, THERMO_REFRESH_CYCLES,
    LIGHT_TYPES, COVER_TYPES, CLIMATE_TYPES, SCENARIO_TYPES, ALARM_TYPES,
)

_LOGGER = logging.getLogger(__name__)


@dataclass
class AveDevice:
    """Represents an AVE device."""
    id: int = 0
    name: str = ""
    device_type: int = 0
    maps: str = ""
    status: int = 0
    # Thermostat-specific
    temperature: float = 0.0
    setpoint: float = 0.0
    offset: float = 0.0
    season: int = 0
    mode: int = 0
    fan_level: int = 0
    local_off: int = 0
    window_state: int = 0
    keyboard_lock: int = 0
    antifreeze: int = 0
    is_vmc_daikin: bool = False
    # Dimmer-specific
    is_rgbw: bool = False
    is_dali: bool = False
    # Humidity
    humidity: float | None = None
    # Energy
    power_values: list[float] = field(default_factory=list)


@dataclass
class AveArea:
    """Represents an AVE map/area."""
    id: int = 0
    name: str = ""
    order: int = 0


class AveCoordinator:
    """Manages device state and bridges AveClient to HA entities."""

    def __init__(self, client: AveClient) -> None:
        self.client = client
        self.devices: dict[int, AveDevice] = {}
        self.areas: dict[int, AveArea] = {}
        self._listeners: list[Callable[[], None]] = []
        self._init_complete = False
        self._thermo_refresh_task: asyncio.Task | None = None
        client.register_callback(self.handle_message)

    def register_listener(self, listener: Callable[[], None]) -> None:
        """Register a listener to be notified on state changes."""
        self._listeners.append(listener)

    def remove_listener(self, listener: Callable[[], None]) -> None:
        """Remove a listener."""
        self._listeners.remove(listener)

    def _notify_listeners(self) -> None:
        """Notify all registered listeners of a state change."""
        for listener in self._listeners:
            try:
                listener()
            except Exception:
                _LOGGER.exception("Error notifying listener")

    def handle_message(self, msg: AveMessage) -> None:
        """Route incoming messages to the appropriate handler."""
        handler = {
            "lm": self._handle_lm,
            "ldi": self._handle_ldi,
            "lmc": self._handle_lmc,
            "lml": self._handle_lml,
            "wts": self._handle_wts,
            "upd": self._handle_upd,
            "gsf": self._handle_gsf,
            "gtm": self._handle_gtm,
        }.get(msg.command)
        if handler:
            handler(msg)

    # --- Init sequence handlers ---

    def _handle_lm(self, msg: AveMessage) -> None:
        """Handle LM (list maps) response."""
        for record in msg.records:
            area_id = int(record[0])
            self.areas[area_id] = AveArea(
                id=area_id,
                name=record[1] if len(record) > 1 else "",
                order=int(record[2]) if len(record) > 2 else 0,
            )

    def _handle_ldi(self, msg: AveMessage) -> None:
        """Handle LDI (list devices) response — populates device registry."""
        for record in msg.records:
            raw_id = int(record[0])
            name = record[1] if len(record) > 1 else ""
            device_type = int(record[2]) if len(record) > 2 else 0
            maps = record[3] if len(record) > 3 else ""

            device = AveDevice(
                id=raw_id,
                name=name,
                device_type=device_type,
                maps=maps,
            )

            # RGBW detection
            if name.startswith("$"):
                device.is_rgbw = True
            if name.endswith("$"):
                device.is_dali = True

            # VMC Daikin detection
            if device_type == AVE_TYPE_THERMOSTAT and raw_id > THERMO_VMC_DAIKIN_THRESHOLD:
                device.is_vmc_daikin = True
                device.id = raw_id - THERMO_VMC_DAIKIN_THRESHOLD

            self.devices[device.id] = device

        self._notify_listeners()

    def _handle_lmc(self, msg: AveMessage) -> None:
        """Handle LMC (list map commands) response."""
        # Map commands are used for UI layout; we extract deviceId linkages
        pass

    def _handle_lml(self, msg: AveMessage) -> None:
        """Handle LML (list map labels) response."""
        pass

    def _handle_wts(self, msg: AveMessage) -> None:
        """Handle WTS (thermostat status) response."""
        # Delegated to thermo event handler via callback
        pass

    def _handle_gsf(self, msg: AveMessage) -> None:
        """Handle GSF (get status by family) for antitheft areas."""
        if msg.parameters and msg.parameters[0] == "12":
            for record in msg.records:
                area_id = int(record[0])
                status = int(record[1]) if len(record) > 1 else 0
                if area_id in self.devices:
                    self.devices[area_id].status = status
            self._notify_listeners()

    def _handle_gtm(self, msg: AveMessage) -> None:
        """Handle GTM (get thermostat modes) — IR thermostat season split."""
        for param in msg.parameters:
            val = int(param)
            device_id = val % 10000
            if val > 30000:
                season_split = 0  # Summer
            elif val > 20000:
                season_split = 1  # Winter
            else:
                season_split = 2  # All season
            if device_id in self.devices:
                self.devices[device_id].season = season_split

    # --- UPD handlers ---

    def _handle_upd(self, msg: AveMessage) -> None:
        """Dispatch UPD sub-commands."""
        if not msg.parameters:
            return
        prefix = msg.parameters[0]

        if prefix == "WS" and len(msg.parameters) >= 4:
            device_type = int(msg.parameters[1])
            device_id = int(msg.parameters[2])
            device_status = int(msg.parameters[3])
            if device_id in self.devices:
                self.devices[device_id].status = device_status
                self._notify_listeners()

        elif prefix == "WT" and len(msg.parameters) >= 4:
            subtype = msg.parameters[1]
            device_id = int(msg.parameters[2])
            value = msg.parameters[3]
            if device_id in self.devices:
                dev = self.devices[device_id]
                if subtype == "T":
                    dev.temperature = int(value) / 10.0
                elif subtype == "S":
                    dev.season = int(value)
                elif subtype == "O":
                    dev.offset = int(value) / 10.0
                elif subtype == "L":
                    dev.fan_level = int(value)
                elif subtype == "Z":
                    dev.local_off = int(value)
                self._notify_listeners()

        elif prefix == "TP" and len(msg.parameters) >= 3:
            device_id = int(msg.parameters[1])
            setpoint = int(msg.parameters[2])
            if device_id in self.devices:
                self.devices[device_id].setpoint = setpoint / 10.0
                self._notify_listeners()

        elif prefix == "TM" and len(msg.parameters) >= 3:
            device_id = int(msg.parameters[1])
            mode = int(msg.parameters[2])
            if device_id in self.devices:
                self.devices[device_id].mode = mode
                self._notify_listeners()

        elif prefix == "TR" and len(msg.parameters) >= 3:
            # Thermo running — informational, update status
            pass

        elif prefix == "TW" and len(msg.parameters) >= 3:
            device_id = int(msg.parameters[1])
            state = int(msg.parameters[2])
            if device_id in self.devices:
                self.devices[device_id].window_state = state
                self._notify_listeners()

        elif prefix == "TK" and len(msg.parameters) >= 3:
            device_id = int(msg.parameters[1])
            lock = int(msg.parameters[2])
            if device_id in self.devices:
                self.devices[device_id].keyboard_lock = lock

        elif prefix == "D" and len(msg.parameters) >= 3:
            # Device icon update — informational
            pass

        elif prefix == "LL" and len(msg.parameters) >= 3:
            # Sensor reading — e.g., "19.3°C"
            pass

        elif prefix == "UMI" and len(msg.parameters) >= 3:
            device_id = int(msg.parameters[1])
            if device_id in self.devices and len(msg.parameters) >= 3:
                try:
                    self.devices[device_id].humidity = float(msg.parameters[2])
                except ValueError:
                    pass
                self._notify_listeners()

        elif prefix in ("A", "CS1", "CS2", "CS3") and len(msg.parameters) >= 3:
            device_id = int(msg.parameters[1])
            alarm_state = int(msg.parameters[2])
            if device_id in self.devices:
                self.devices[device_id].status = alarm_state
                self._notify_listeners()

        elif prefix == "epv" and len(msg.parameters) >= 5:
            device_id = int(msg.parameters[1])
            if device_id in self.devices:
                self.devices[device_id].power_values = [
                    float(msg.parameters[2]),
                    float(msg.parameters[3]),
                    float(msg.parameters[4]),
                ]
                self._notify_listeners()

    # --- Init sequence ---

    async def async_init(self) -> None:
        """Run the AVE initialization sequence after connection."""
        await self.client.send_command(CMD_LM)
        # The rest of the sequence is triggered by responses:
        # LM -> sends LMC/LML per area
        # LMC completed -> sends WSF per family, GSF, SU2, SU3
        # LDI -> sends WTS per thermostat, GTM, GMA, GNA, LI2

    async def async_send_init_sequence(self) -> None:
        """Send the full initialization sequence with delays (for reconnect)."""
        await self.client.send_command(CMD_LM)
        await asyncio.sleep(0.5)
        # Send LMC/LML for known areas
        for area_id in self.areas:
            await self.client.send_command(CMD_LMC, [str(area_id)])
            await self.client.send_command(CMD_LML, [str(area_id)])
        await asyncio.sleep(1.0)
        # WSF for all families
        for family in WSF_FAMILIES:
            await self.client.send_command(CMD_WSF, [family])
            await asyncio.sleep(0.3)
        await self.client.send_command(CMD_GSF, ["12"])
        await asyncio.sleep(0.5)
        await self.client.send_command(CMD_LDI)
        await asyncio.sleep(1.0)
        await self.client.send_command(CMD_GTM)
        await self.client.send_command(CMD_GMA)
        await self.client.send_command(CMD_GNA)
        await self.client.send_command(CMD_LI2)
        # Start thermostat refresh
        self._start_thermo_refresh()

    def _start_thermo_refresh(self) -> None:
        """Start periodic thermostat status refresh."""
        if self._thermo_refresh_task:
            self._thermo_refresh_task.cancel()
        self._thermo_refresh_task = asyncio.create_task(self._thermo_refresh_loop())

    async def _thermo_refresh_loop(self) -> None:
        """Refresh thermostat statuses periodically."""
        for cycle in range(THERMO_REFRESH_CYCLES):
            thermo_ids = [
                d.id for d in self.devices.values()
                if d.device_type == AVE_TYPE_THERMOSTAT and not d.is_vmc_daikin
            ]
            for tid in thermo_ids:
                await self.client.send_command(CMD_WTS, [str(tid)], [""])
                await asyncio.sleep(0.25)
            await self.client.send_command(CMD_GTM)
            if cycle < THERMO_REFRESH_CYCLES - 1:
                await asyncio.sleep(THERMO_REFRESH_INTERVAL)

    # --- Device control ---

    async def async_set_light(self, device_id: int, on: bool) -> None:
        """Turn a light on or off via HTTP bridge."""
        value = 1 if on else 0
        await self.client.send_http_command("", device_id, value)

    async def async_set_dimmer(self, device_id: int, level: int) -> None:
        """Set dimmer level (0-254) via HTTP bridge."""
        from .const import BRIDGE_CMD_SIL
        await self.client.send_http_command(BRIDGE_CMD_SIL, device_id, level, is_dimmer_level=True)

    async def async_set_cover(self, device_id: int, position: int) -> None:
        """Set cover position (0-254) via HTTP bridge."""
        await self.client.send_http_command("", device_id, position)

    async def async_set_thermostat(
        self, device_id: int, season: int, mode: int, setpoint: float
    ) -> None:
        """Set thermostat state via WebSocket."""
        setpoint_raw = str(int(setpoint * 10))
        await self.client.send_command(
            CMD_STS, [str(device_id)], [f"{season},{mode},{setpoint_raw}"]
        )

    async def async_activate_scenario(self, device_id: int) -> None:
        """Activate a scenario via HTTP bridge."""
        await self.client.send_http_command("", device_id, 1)

    async def async_set_vmc_daikin_onoff(self, device_id: int, on: bool) -> None:
        """Turn VMC Daikin on/off via WebSocket."""
        from .const import CMD_TOO
        await self.client.send_command(CMD_TOO, [f"{device_id},{1 if on else 0}"])

    async def async_set_vmc_daikin_speed(self, device_id: int, speed: int) -> None:
        """Set VMC Daikin speed via WebSocket."""
        from .const import CMD_VMC
        await self.client.send_command(CMD_VMC, [f"{device_id},{speed}"])

    async def async_set_vmc_daikin_mode(self, device_id: int, mode: int) -> None:
        """Set VMC Daikin mode via WebSocket."""
        from .const import CMD_VMM
        await self.client.send_command(CMD_VMM, [f"{device_id},{mode}"])

    def get_devices_by_types(self, types: set[int]) -> list[AveDevice]:
        """Return all devices matching the given type set."""
        return [d for d in self.devices.values() if d.device_type in types]

    async def async_shutdown(self) -> None:
        """Clean up resources."""
        if self._thermo_refresh_task:
            self._thermo_refresh_task.cancel()
        await self.client.disconnect()
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd "C:/sviluppo/integrazione AVE" && python -m pytest tests/test_coordinator.py -v`
Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add custom_components/ave_domina/coordinator.py tests/test_coordinator.py
git commit -m "feat: implement coordinator with device registry and UPD handling"
```

---

### Task 4: Config flow

**Files:**
- Create: `tests/test_config_flow.py`
- Create: `custom_components/ave_domina/config_flow.py`
- Create: `custom_components/ave_domina/strings.json`
- Create: `custom_components/ave_domina/translations/it.json`

- [ ] **Step 1: Write failing config flow tests**

```python
"""Tests for AVE DOMINA Plus config flow."""
import pytest
from unittest.mock import patch, AsyncMock
from custom_components.ave_domina.const import DOMAIN, CONF_HOST, CONF_PORT, DEFAULT_WS_PORT


async def test_form_shows_host_input(hass):
    """Test that the config flow shows a form with host input."""
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": "user"}
    )
    assert result["type"] == "form"
    assert result["step_id"] == "user"
    assert "host" in result["data_schema"].schema


async def test_form_creates_entry_on_success(hass):
    """Test successful config flow creates an entry."""
    with patch(
        "custom_components.ave_domina.config_flow.test_connection",
        new_callable=AsyncMock,
        return_value=True,
    ):
        result = await hass.config_entries.flow.async_init(
            DOMAIN, context={"source": "user"}
        )
        result = await hass.config_entries.flow.async_configure(
            result["flow_id"],
            user_input={CONF_HOST: "192.168.1.100", CONF_PORT: DEFAULT_WS_PORT},
        )
        assert result["type"] == "create_entry"
        assert result["title"] == "AVE DOMINA Plus (192.168.1.100)"
        assert result["data"][CONF_HOST] == "192.168.1.100"


async def test_form_shows_error_on_connection_fail(hass):
    """Test that connection failure shows an error."""
    with patch(
        "custom_components.ave_domina.config_flow.test_connection",
        new_callable=AsyncMock,
        return_value=False,
    ):
        result = await hass.config_entries.flow.async_init(
            DOMAIN, context={"source": "user"}
        )
        result = await hass.config_entries.flow.async_configure(
            result["flow_id"],
            user_input={CONF_HOST: "192.168.1.100", CONF_PORT: DEFAULT_WS_PORT},
        )
        assert result["type"] == "form"
        assert result["errors"]["base"] == "cannot_connect"
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd "C:/sviluppo/integrazione AVE" && python -m pytest tests/test_config_flow.py -v`
Expected: FAIL

- [ ] **Step 3: Create strings.json**

```json
{
  "config": {
    "step": {
      "user": {
        "title": "AVE DOMINA Plus",
        "description": "Enter the IP address of your AVE Web Server 53AB-WBS",
        "data": {
          "host": "Host",
          "port": "WebSocket Port"
        }
      }
    },
    "error": {
      "cannot_connect": "Cannot connect to AVE server. Check the IP and port."
    }
  }
}
```

- [ ] **Step 4: Create translations/it.json**

```json
{
  "config": {
    "step": {
      "user": {
        "title": "AVE DOMINA Plus",
        "description": "Inserisci l'indirizzo IP del tuo AVE Web Server 53AB-WBS",
        "data": {
          "host": "Host",
          "port": "Porta WebSocket"
        }
      }
    },
    "error": {
      "cannot_connect": "Impossibile connettersi al server AVE. Controlla IP e porta."
    }
  }
}
```

- [ ] **Step 5: Implement config_flow.py**

```python
"""Config flow for AVE DOMINA Plus."""
from __future__ import annotations

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.data_entry_flow import FlowResult

from .ave_client import AveClient
from .const import DOMAIN, CONF_HOST, CONF_PORT, DEFAULT_WS_PORT


async def test_connection(host: str, port: int) -> bool:
    """Test if we can connect to the AVE server."""
    client = AveClient(host, port)
    try:
        if await client.connect():
            await client.disconnect()
            return True
        return False
    except Exception:
        return False


class AveConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for AVE DOMINA Plus."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict | None = None
    ) -> FlowResult:
        """Handle the initial step."""
        errors = {}

        if user_input is not None:
            host = user_input[CONF_HOST]
            port = user_input.get(CONF_PORT, DEFAULT_WS_PORT)

            if await test_connection(host, port):
                await self.async_set_unique_id(host)
                self._abort_if_unique_id_configured()
                return self.async_create_entry(
                    title=f"AVE DOMINA Plus ({host})",
                    data={CONF_HOST: host, CONF_PORT: port},
                )
            errors["base"] = "cannot_connect"

        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_HOST): str,
                    vol.Optional(CONF_PORT, default=DEFAULT_WS_PORT): int,
                }
            ),
            errors=errors,
        )
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `cd "C:/sviluppo/integrazione AVE" && python -m pytest tests/test_config_flow.py -v`
Expected: All tests PASS

- [ ] **Step 7: Commit**

```bash
git add custom_components/ave_domina/config_flow.py custom_components/ave_domina/strings.json custom_components/ave_domina/translations/it.json tests/test_config_flow.py
git commit -m "feat: implement config flow with connection test"
```

---

### Task 5: Integration setup (__init__.py) and base entity

**Files:**
- Modify: `custom_components/ave_domina/__init__.py`
- Create: `custom_components/ave_domina/entity.py`

- [ ] **Step 1: Implement __init__.py with full setup/teardown**

```python
"""The AVE DOMINA Plus integration."""
from __future__ import annotations

import logging

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .ave_client import AveClient
from .const import DOMAIN, CONF_HOST, CONF_PORT, DEFAULT_WS_PORT, PLATFORMS
from .coordinator import AveCoordinator

_LOGGER = logging.getLogger(__name__)

type AveConfigEntry = ConfigEntry[AveCoordinator]


async def async_setup_entry(hass: HomeAssistant, entry: AveConfigEntry) -> bool:
    """Set up AVE DOMINA Plus from a config entry."""
    host = entry.data[CONF_HOST]
    port = entry.data.get(CONF_PORT, DEFAULT_WS_PORT)

    client = AveClient(host, port)
    coordinator = AveCoordinator(client)

    if not await client.connect():
        _LOGGER.error("Failed to connect to AVE server at %s:%s", host, port)
        return False

    await coordinator.async_send_init_sequence()

    entry.runtime_data = coordinator

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    return True


async def async_unload_entry(hass: HomeAssistant, entry: AveConfigEntry) -> bool:
    """Unload a config entry."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unload_ok:
        coordinator: AveCoordinator = entry.runtime_data
        await coordinator.async_shutdown()
    return unload_ok
```

- [ ] **Step 2: Implement base entity class**

```python
"""Base entity for AVE DOMINA Plus."""
from __future__ import annotations

from homeassistant.helpers.entity import Entity

from .const import DOMAIN
from .coordinator import AveCoordinator, AveDevice


class AveEntity(Entity):
    """Base class for AVE DOMINA Plus entities."""

    _attr_has_entity_name = True

    def __init__(self, coordinator: AveCoordinator, device: AveDevice) -> None:
        self.coordinator = coordinator
        self.ave_device = device
        self._attr_unique_id = f"ave_{coordinator.client.host}_{device.id}"
        self._attr_name = device.name

    @property
    def device_info(self):
        """Return device info for grouping in HA."""
        return {
            "identifiers": {(DOMAIN, f"{self.coordinator.client.host}_{self.ave_device.id}")},
            "name": self.ave_device.name,
            "manufacturer": "AVE",
            "model": "DOMINA Plus",
        }

    @property
    def available(self) -> bool:
        """Return True if the AVE server is connected."""
        return self.coordinator.client.connected

    async def async_added_to_hass(self) -> None:
        """Register update listener when added to hass."""
        self.coordinator.register_listener(self._on_coordinator_update)

    async def async_will_remove_from_hass(self) -> None:
        """Remove update listener."""
        self.coordinator.remove_listener(self._on_coordinator_update)

    def _on_coordinator_update(self) -> None:
        """Handle coordinator state update."""
        self.async_write_ha_state()
```

- [ ] **Step 3: Commit**

```bash
git add custom_components/ave_domina/__init__.py custom_components/ave_domina/entity.py
git commit -m "feat: implement integration setup and base entity class"
```

---

### Task 6: Light platform

**Files:**
- Create: `tests/test_light.py`
- Create: `custom_components/ave_domina/light.py`

- [ ] **Step 1: Write failing light tests**

```python
"""Tests for AVE DOMINA Plus light platform."""
import pytest
from unittest.mock import AsyncMock, MagicMock
from custom_components.ave_domina.coordinator import AveCoordinator, AveDevice
from custom_components.ave_domina.light import AveLight, AveDimmer


@pytest.fixture
def mock_coordinator():
    coord = MagicMock(spec=AveCoordinator)
    coord.client = MagicMock()
    coord.client.host = "192.168.1.100"
    coord.client.connected = True
    coord.async_set_light = AsyncMock()
    coord.async_set_dimmer = AsyncMock()
    coord.register_listener = MagicMock()
    coord.remove_listener = MagicMock()
    return coord


class TestAveLight:
    def test_is_on_when_status_nonzero(self, mock_coordinator):
        device = AveDevice(id=1, name="Luce Sala", device_type=1, status=1)
        light = AveLight(mock_coordinator, device)
        assert light.is_on is True

    def test_is_off_when_status_zero(self, mock_coordinator):
        device = AveDevice(id=1, name="Luce Sala", device_type=1, status=0)
        light = AveLight(mock_coordinator, device)
        assert light.is_on is False

    @pytest.mark.asyncio
    async def test_turn_on(self, mock_coordinator):
        device = AveDevice(id=1, name="Luce Sala", device_type=1, status=0)
        light = AveLight(mock_coordinator, device)
        await light.async_turn_on()
        mock_coordinator.async_set_light.assert_awaited_once_with(1, True)

    @pytest.mark.asyncio
    async def test_turn_off(self, mock_coordinator):
        device = AveDevice(id=1, name="Luce Sala", device_type=1, status=1)
        light = AveLight(mock_coordinator, device)
        await light.async_turn_off()
        mock_coordinator.async_set_light.assert_awaited_once_with(1, False)


class TestAveDimmer:
    def test_brightness_maps_254_to_255(self, mock_coordinator):
        device = AveDevice(id=2, name="Dimmer", device_type=2, status=254)
        dimmer = AveDimmer(mock_coordinator, device)
        assert dimmer.brightness == 255

    def test_brightness_zero_when_off(self, mock_coordinator):
        device = AveDevice(id=2, name="Dimmer", device_type=2, status=0)
        dimmer = AveDimmer(mock_coordinator, device)
        assert dimmer.brightness == 0

    @pytest.mark.asyncio
    async def test_set_brightness(self, mock_coordinator):
        device = AveDevice(id=2, name="Dimmer", device_type=2, status=0)
        dimmer = AveDimmer(mock_coordinator, device)
        await dimmer.async_turn_on(brightness=128)
        # 128/255 * 254 = ~127
        mock_coordinator.async_set_dimmer.assert_awaited_once()
        call_args = mock_coordinator.async_set_dimmer.call_args[0]
        assert call_args[0] == 2  # device_id
        assert 126 <= call_args[1] <= 128  # mapped level
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd "C:/sviluppo/integrazione AVE" && python -m pytest tests/test_light.py -v`
Expected: FAIL

- [ ] **Step 3: Implement light.py**

```python
"""Light platform for AVE DOMINA Plus."""
from __future__ import annotations

from homeassistant.components.light import (
    LightEntity,
    ColorMode,
    ATTR_BRIGHTNESS,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import AVE_TYPE_DIMMER, LIGHT_TYPES
from .coordinator import AveCoordinator, AveDevice
from .entity import AveEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up AVE light entities."""
    coordinator: AveCoordinator = entry.runtime_data
    entities: list[LightEntity] = []
    for device in coordinator.get_devices_by_types(LIGHT_TYPES):
        if device.device_type == AVE_TYPE_DIMMER:
            entities.append(AveDimmer(coordinator, device))
        else:
            entities.append(AveLight(coordinator, device))
    async_add_entities(entities)


class AveLight(AveEntity, LightEntity):
    """AVE on/off light."""

    _attr_color_mode = ColorMode.ONOFF
    _attr_supported_color_modes = {ColorMode.ONOFF}

    def __init__(self, coordinator: AveCoordinator, device: AveDevice) -> None:
        super().__init__(coordinator, device)

    @property
    def is_on(self) -> bool:
        return self.ave_device.status != 0

    async def async_turn_on(self, **kwargs) -> None:
        await self.coordinator.async_set_light(self.ave_device.id, True)

    async def async_turn_off(self, **kwargs) -> None:
        await self.coordinator.async_set_light(self.ave_device.id, False)


class AveDimmer(AveEntity, LightEntity):
    """AVE dimmer light."""

    _attr_color_mode = ColorMode.BRIGHTNESS
    _attr_supported_color_modes = {ColorMode.BRIGHTNESS}

    def __init__(self, coordinator: AveCoordinator, device: AveDevice) -> None:
        super().__init__(coordinator, device)

    @property
    def is_on(self) -> bool:
        return self.ave_device.status != 0

    @property
    def brightness(self) -> int:
        """Map AVE 0-254 to HA 0-255."""
        if self.ave_device.status == 0:
            return 0
        return round(self.ave_device.status / 254 * 255)

    async def async_turn_on(self, **kwargs) -> None:
        if ATTR_BRIGHTNESS in kwargs:
            level = round(kwargs[ATTR_BRIGHTNESS] / 255 * 254)
            await self.coordinator.async_set_dimmer(self.ave_device.id, level)
        else:
            await self.coordinator.async_set_dimmer(self.ave_device.id, 254)

    async def async_turn_off(self, **kwargs) -> None:
        await self.coordinator.async_set_dimmer(self.ave_device.id, 0)
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd "C:/sviluppo/integrazione AVE" && python -m pytest tests/test_light.py -v`
Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add custom_components/ave_domina/light.py tests/test_light.py
git commit -m "feat: implement light and dimmer platform"
```

---

### Task 7: Cover platform

**Files:**
- Create: `tests/test_cover.py`
- Create: `custom_components/ave_domina/cover.py`

- [ ] **Step 1: Write failing cover tests**

```python
"""Tests for AVE DOMINA Plus cover platform."""
import pytest
from unittest.mock import AsyncMock, MagicMock
from custom_components.ave_domina.coordinator import AveCoordinator, AveDevice
from custom_components.ave_domina.cover import AveCover


@pytest.fixture
def mock_coordinator():
    coord = MagicMock(spec=AveCoordinator)
    coord.client = MagicMock()
    coord.client.host = "192.168.1.100"
    coord.client.connected = True
    coord.async_set_cover = AsyncMock()
    coord.register_listener = MagicMock()
    coord.remove_listener = MagicMock()
    return coord


class TestAveCover:
    def test_position_maps_254_to_100(self, mock_coordinator):
        device = AveDevice(id=10, name="Tapparella", device_type=3, status=254)
        cover = AveCover(mock_coordinator, device)
        assert cover.current_cover_position == 100

    def test_position_zero(self, mock_coordinator):
        device = AveDevice(id=10, name="Tapparella", device_type=3, status=0)
        cover = AveCover(mock_coordinator, device)
        assert cover.current_cover_position == 0

    def test_is_closed_when_position_zero(self, mock_coordinator):
        device = AveDevice(id=10, name="Tapparella", device_type=3, status=0)
        cover = AveCover(mock_coordinator, device)
        assert cover.is_closed is True

    @pytest.mark.asyncio
    async def test_set_position(self, mock_coordinator):
        device = AveDevice(id=10, name="Tapparella", device_type=3, status=0)
        cover = AveCover(mock_coordinator, device)
        await cover.async_set_cover_position(position=50)
        # 50% of 254 = 127
        mock_coordinator.async_set_cover.assert_awaited_once_with(10, 127)

    @pytest.mark.asyncio
    async def test_open_cover(self, mock_coordinator):
        device = AveDevice(id=10, name="Tapparella", device_type=3, status=0)
        cover = AveCover(mock_coordinator, device)
        await cover.async_open_cover()
        mock_coordinator.async_set_cover.assert_awaited_once_with(10, 254)

    @pytest.mark.asyncio
    async def test_close_cover(self, mock_coordinator):
        device = AveDevice(id=10, name="Tapparella", device_type=3, status=254)
        cover = AveCover(mock_coordinator, device)
        await cover.async_close_cover()
        mock_coordinator.async_set_cover.assert_awaited_once_with(10, 0)
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd "C:/sviluppo/integrazione AVE" && python -m pytest tests/test_cover.py -v`
Expected: FAIL

- [ ] **Step 3: Implement cover.py**

```python
"""Cover platform for AVE DOMINA Plus."""
from __future__ import annotations

from homeassistant.components.cover import (
    CoverEntity,
    CoverDeviceClass,
    CoverEntityFeature,
    ATTR_POSITION,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import COVER_TYPES
from .coordinator import AveCoordinator, AveDevice
from .entity import AveEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up AVE cover entities."""
    coordinator: AveCoordinator = entry.runtime_data
    entities = [
        AveCover(coordinator, device)
        for device in coordinator.get_devices_by_types(COVER_TYPES)
    ]
    async_add_entities(entities)


class AveCover(AveEntity, CoverEntity):
    """AVE shutter/cover."""

    _attr_device_class = CoverDeviceClass.SHUTTER
    _attr_supported_features = (
        CoverEntityFeature.OPEN
        | CoverEntityFeature.CLOSE
        | CoverEntityFeature.SET_POSITION
    )

    def __init__(self, coordinator: AveCoordinator, device: AveDevice) -> None:
        super().__init__(coordinator, device)

    @property
    def current_cover_position(self) -> int:
        """Map AVE 0-254 to HA 0-100."""
        return round(self.ave_device.status / 254 * 100)

    @property
    def is_closed(self) -> bool:
        return self.ave_device.status == 0

    async def async_open_cover(self, **kwargs) -> None:
        await self.coordinator.async_set_cover(self.ave_device.id, 254)

    async def async_close_cover(self, **kwargs) -> None:
        await self.coordinator.async_set_cover(self.ave_device.id, 0)

    async def async_set_cover_position(self, **kwargs) -> None:
        position = kwargs.get(ATTR_POSITION, 0)
        ave_position = round(position / 100 * 254)
        await self.coordinator.async_set_cover(self.ave_device.id, ave_position)
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd "C:/sviluppo/integrazione AVE" && python -m pytest tests/test_cover.py -v`
Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add custom_components/ave_domina/cover.py tests/test_cover.py
git commit -m "feat: implement cover/shutter platform"
```

---

### Task 8: Climate platform (thermostats)

**Files:**
- Create: `tests/test_climate.py`
- Create: `custom_components/ave_domina/climate.py`

- [ ] **Step 1: Write failing climate tests**

```python
"""Tests for AVE DOMINA Plus climate platform."""
import pytest
from unittest.mock import AsyncMock, MagicMock
from homeassistant.components.climate import HVACMode
from custom_components.ave_domina.coordinator import AveCoordinator, AveDevice
from custom_components.ave_domina.climate import AveClimate
from custom_components.ave_domina.const import (
    THERMO_SEASON_SUMMER, THERMO_SEASON_WINTER, THERMO_SEASON_ALL,
)


@pytest.fixture
def mock_coordinator():
    coord = MagicMock(spec=AveCoordinator)
    coord.client = MagicMock()
    coord.client.host = "192.168.1.100"
    coord.client.connected = True
    coord.async_set_thermostat = AsyncMock()
    coord.register_listener = MagicMock()
    coord.remove_listener = MagicMock()
    return coord


class TestAveClimate:
    def test_current_temperature(self, mock_coordinator):
        device = AveDevice(id=40, name="Studio T", device_type=4, temperature=19.8)
        climate = AveClimate(mock_coordinator, device)
        assert climate.current_temperature == 19.8

    def test_target_temperature(self, mock_coordinator):
        device = AveDevice(id=40, name="Studio T", device_type=4, setpoint=17.5)
        climate = AveClimate(mock_coordinator, device)
        assert climate.target_temperature == 17.5

    def test_hvac_mode_heat_when_winter(self, mock_coordinator):
        device = AveDevice(id=40, name="Studio T", device_type=4, season=THERMO_SEASON_WINTER, mode=1)
        climate = AveClimate(mock_coordinator, device)
        assert climate.hvac_mode == HVACMode.HEAT

    def test_hvac_mode_cool_when_summer(self, mock_coordinator):
        device = AveDevice(id=40, name="Studio T", device_type=4, season=THERMO_SEASON_SUMMER, mode=1)
        climate = AveClimate(mock_coordinator, device)
        assert climate.hvac_mode == HVACMode.COOL

    def test_hvac_mode_auto_when_all_season(self, mock_coordinator):
        device = AveDevice(id=40, name="Studio T", device_type=4, season=THERMO_SEASON_ALL, mode=1)
        climate = AveClimate(mock_coordinator, device)
        assert climate.hvac_mode == HVACMode.AUTO

    def test_hvac_mode_off_when_mode_zero(self, mock_coordinator):
        device = AveDevice(id=40, name="Studio T", device_type=4, season=THERMO_SEASON_WINTER, mode=0)
        climate = AveClimate(mock_coordinator, device)
        assert climate.hvac_mode == HVACMode.OFF

    @pytest.mark.asyncio
    async def test_set_temperature(self, mock_coordinator):
        device = AveDevice(id=40, name="Studio T", device_type=4, season=1, mode=1, setpoint=17.5)
        climate = AveClimate(mock_coordinator, device)
        await climate.async_set_temperature(temperature=20.0)
        mock_coordinator.async_set_thermostat.assert_awaited_once_with(40, 1, 1, 20.0)

    @pytest.mark.asyncio
    async def test_set_hvac_mode_heat(self, mock_coordinator):
        device = AveDevice(id=40, name="Studio T", device_type=4, season=0, mode=0, setpoint=17.5)
        climate = AveClimate(mock_coordinator, device)
        await climate.async_set_hvac_mode(HVACMode.HEAT)
        mock_coordinator.async_set_thermostat.assert_awaited_once_with(40, 1, 1, 17.5)

    @pytest.mark.asyncio
    async def test_set_hvac_mode_off(self, mock_coordinator):
        device = AveDevice(id=40, name="Studio T", device_type=4, season=1, mode=1, setpoint=17.5)
        climate = AveClimate(mock_coordinator, device)
        await climate.async_set_hvac_mode(HVACMode.OFF)
        mock_coordinator.async_set_thermostat.assert_awaited_once_with(40, 1, 0, 17.5)
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd "C:/sviluppo/integrazione AVE" && python -m pytest tests/test_climate.py -v`
Expected: FAIL

- [ ] **Step 3: Implement climate.py**

```python
"""Climate platform for AVE DOMINA Plus."""
from __future__ import annotations

from homeassistant.components.climate import (
    ClimateEntity,
    ClimateEntityFeature,
    HVACMode,
)
from homeassistant.const import UnitOfTemperature, ATTR_TEMPERATURE
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import (
    CLIMATE_TYPES,
    THERMO_SEASON_SUMMER,
    THERMO_SEASON_WINTER,
    THERMO_SEASON_ALL,
)
from .coordinator import AveCoordinator, AveDevice
from .entity import AveEntity

SEASON_TO_HVAC = {
    THERMO_SEASON_SUMMER: HVACMode.COOL,
    THERMO_SEASON_WINTER: HVACMode.HEAT,
    THERMO_SEASON_ALL: HVACMode.AUTO,
}

HVAC_TO_SEASON = {
    HVACMode.COOL: THERMO_SEASON_SUMMER,
    HVACMode.HEAT: THERMO_SEASON_WINTER,
    HVACMode.AUTO: THERMO_SEASON_ALL,
}


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up AVE climate entities."""
    coordinator: AveCoordinator = entry.runtime_data
    entities = [
        AveClimate(coordinator, device)
        for device in coordinator.get_devices_by_types(CLIMATE_TYPES)
        if not device.is_vmc_daikin
    ]
    async_add_entities(entities)


class AveClimate(AveEntity, ClimateEntity):
    """AVE thermostat."""

    _attr_temperature_unit = UnitOfTemperature.CELSIUS
    _attr_supported_features = ClimateEntityFeature.TARGET_TEMPERATURE
    _attr_hvac_modes = [HVACMode.OFF, HVACMode.HEAT, HVACMode.COOL, HVACMode.AUTO]
    _attr_min_temp = 5.0
    _attr_max_temp = 40.0
    _attr_target_temperature_step = 0.5

    def __init__(self, coordinator: AveCoordinator, device: AveDevice) -> None:
        super().__init__(coordinator, device)

    @property
    def current_temperature(self) -> float | None:
        return self.ave_device.temperature if self.ave_device.temperature != 0 else None

    @property
    def target_temperature(self) -> float | None:
        return self.ave_device.setpoint if self.ave_device.setpoint != 0 else None

    @property
    def hvac_mode(self) -> HVACMode:
        if self.ave_device.mode == 0:
            return HVACMode.OFF
        return SEASON_TO_HVAC.get(self.ave_device.season, HVACMode.AUTO)

    @property
    def extra_state_attributes(self) -> dict:
        return {
            "ave_offset": self.ave_device.offset,
            "ave_window_state": self.ave_device.window_state,
            "ave_keyboard_lock": self.ave_device.keyboard_lock,
            "ave_antifreeze": self.ave_device.antifreeze,
            "ave_fan_level": self.ave_device.fan_level,
        }

    async def async_set_temperature(self, **kwargs) -> None:
        temperature = kwargs.get(ATTR_TEMPERATURE)
        if temperature is not None:
            await self.coordinator.async_set_thermostat(
                self.ave_device.id,
                self.ave_device.season,
                self.ave_device.mode or 1,
                temperature,
            )

    async def async_set_hvac_mode(self, hvac_mode: HVACMode) -> None:
        if hvac_mode == HVACMode.OFF:
            await self.coordinator.async_set_thermostat(
                self.ave_device.id,
                self.ave_device.season,
                0,
                self.ave_device.setpoint,
            )
        else:
            season = HVAC_TO_SEASON.get(hvac_mode, self.ave_device.season)
            await self.coordinator.async_set_thermostat(
                self.ave_device.id,
                season,
                1,
                self.ave_device.setpoint,
            )
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd "C:/sviluppo/integrazione AVE" && python -m pytest tests/test_climate.py -v`
Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add custom_components/ave_domina/climate.py tests/test_climate.py
git commit -m "feat: implement climate/thermostat platform"
```

---

### Task 9: Button, alarm, and sensor platforms

**Files:**
- Create: `custom_components/ave_domina/button.py`
- Create: `custom_components/ave_domina/alarm_control_panel.py`
- Create: `custom_components/ave_domina/sensor.py`

- [ ] **Step 1: Implement button.py (scenarios)**

```python
"""Button platform for AVE DOMINA Plus — scenarios."""
from __future__ import annotations

from homeassistant.components.button import ButtonEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import SCENARIO_TYPES
from .coordinator import AveCoordinator, AveDevice
from .entity import AveEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up AVE button entities."""
    coordinator: AveCoordinator = entry.runtime_data
    entities = [
        AveScenarioButton(coordinator, device)
        for device in coordinator.get_devices_by_types(SCENARIO_TYPES)
    ]
    async_add_entities(entities)


class AveScenarioButton(AveEntity, ButtonEntity):
    """AVE scenario activation button."""

    def __init__(self, coordinator: AveCoordinator, device: AveDevice) -> None:
        super().__init__(coordinator, device)

    async def async_press(self) -> None:
        await self.coordinator.async_activate_scenario(self.ave_device.id)
```

- [ ] **Step 2: Implement alarm_control_panel.py**

```python
"""Alarm control panel platform for AVE DOMINA Plus — P3000 antitheft."""
from __future__ import annotations

from homeassistant.components.alarm_control_panel import (
    AlarmControlPanelEntity,
    AlarmControlPanelEntityFeature,
    AlarmControlPanelState,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import ALARM_TYPES
from .coordinator import AveCoordinator, AveDevice
from .entity import AveEntity

# AVE status: 0=disarmed free, 1=armed free, 2=disarmed occupied, 3=armed occupied (alarm)
AVE_TO_ALARM_STATE = {
    0: AlarmControlPanelState.DISARMED,
    1: AlarmControlPanelState.ARMED_AWAY,
    2: AlarmControlPanelState.DISARMED,
    3: AlarmControlPanelState.TRIGGERED,
}


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up AVE alarm control panel entities."""
    coordinator: AveCoordinator = entry.runtime_data
    entities = [
        AveAlarm(coordinator, device)
        for device in coordinator.get_devices_by_types(ALARM_TYPES)
    ]
    async_add_entities(entities)


class AveAlarm(AveEntity, AlarmControlPanelEntity):
    """AVE P3000 antitheft area."""

    _attr_supported_features = (
        AlarmControlPanelEntityFeature.ARM_AWAY
    )

    def __init__(self, coordinator: AveCoordinator, device: AveDevice) -> None:
        super().__init__(coordinator, device)

    @property
    def alarm_state(self) -> AlarmControlPanelState:
        return AVE_TO_ALARM_STATE.get(
            self.ave_device.status, AlarmControlPanelState.DISARMED
        )

    async def async_alarm_arm_away(self, code=None) -> None:
        """Arm is handled via keypad on physical device — status is read-only for now."""
        pass

    async def async_alarm_disarm(self, code=None) -> None:
        """Disarm is handled via keypad on physical device — status is read-only for now."""
        pass
```

- [ ] **Step 3: Implement sensor.py**

```python
"""Sensor platform for AVE DOMINA Plus — temperature, humidity, energy."""
from __future__ import annotations

from homeassistant.components.sensor import (
    SensorEntity,
    SensorDeviceClass,
    SensorStateClass,
)
from homeassistant.const import UnitOfTemperature, PERCENTAGE, UnitOfPower
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import AVE_TYPE_THERMOSTAT, AVE_TYPE_ECONOMIZER
from .coordinator import AveCoordinator, AveDevice
from .entity import AveEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up AVE sensor entities."""
    coordinator: AveCoordinator = entry.runtime_data
    entities: list[SensorEntity] = []

    for device in coordinator.devices.values():
        # Temperature sensor for each thermostat
        if device.device_type == AVE_TYPE_THERMOSTAT and not device.is_vmc_daikin:
            entities.append(AveTemperatureSensor(coordinator, device))
            if device.humidity is not None:
                entities.append(AveHumiditySensor(coordinator, device))

        # Energy sensor for economizers
        if device.device_type == AVE_TYPE_ECONOMIZER:
            entities.append(AveEnergySensor(coordinator, device))

    async_add_entities(entities)


class AveTemperatureSensor(AveEntity, SensorEntity):
    """AVE temperature sensor (from thermostat probe)."""

    _attr_device_class = SensorDeviceClass.TEMPERATURE
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_native_unit_of_measurement = UnitOfTemperature.CELSIUS

    def __init__(self, coordinator: AveCoordinator, device: AveDevice) -> None:
        super().__init__(coordinator, device)
        self._attr_unique_id = f"ave_{coordinator.client.host}_{device.id}_temp"
        self._attr_name = f"{device.name} Temperature"

    @property
    def native_value(self) -> float | None:
        return self.ave_device.temperature if self.ave_device.temperature != 0 else None


class AveHumiditySensor(AveEntity, SensorEntity):
    """AVE humidity sensor."""

    _attr_device_class = SensorDeviceClass.HUMIDITY
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_native_unit_of_measurement = PERCENTAGE

    def __init__(self, coordinator: AveCoordinator, device: AveDevice) -> None:
        super().__init__(coordinator, device)
        self._attr_unique_id = f"ave_{coordinator.client.host}_{device.id}_humidity"
        self._attr_name = f"{device.name} Humidity"

    @property
    def native_value(self) -> float | None:
        return self.ave_device.humidity


class AveEnergySensor(AveEntity, SensorEntity):
    """AVE energy/power sensor."""

    _attr_device_class = SensorDeviceClass.POWER
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_native_unit_of_measurement = UnitOfPower.WATT

    def __init__(self, coordinator: AveCoordinator, device: AveDevice) -> None:
        super().__init__(coordinator, device)
        self._attr_unique_id = f"ave_{coordinator.client.host}_{device.id}_power"
        self._attr_name = f"{device.name} Power"

    @property
    def native_value(self) -> float | None:
        if self.ave_device.power_values:
            return self.ave_device.power_values[0]
        return None
```

- [ ] **Step 4: Commit**

```bash
git add custom_components/ave_domina/button.py custom_components/ave_domina/alarm_control_panel.py custom_components/ave_domina/sensor.py
git commit -m "feat: implement button, alarm, and sensor platforms"
```

---

### Task 10: End-to-end integration test and final polish

**Files:**
- Verify: all files compile and integrate correctly
- Verify: manifest.json, hacs.json, translations

- [ ] **Step 1: Run all tests together**

Run: `cd "C:/sviluppo/integrazione AVE" && python -m pytest tests/ -v`
Expected: All tests PASS

- [ ] **Step 2: Verify all imports and module structure**

Run: `cd "C:/sviluppo/integrazione AVE" && python -c "from custom_components.ave_domina.const import DOMAIN; from custom_components.ave_domina.ave_client import AveClient, AveProtocol; from custom_components.ave_domina.coordinator import AveCoordinator; print('All imports OK')"`
Expected: "All imports OK"

- [ ] **Step 3: Verify file structure is complete**

Run: `find custom_components/ave_domina -type f | sort`
Expected output:
```
custom_components/ave_domina/__init__.py
custom_components/ave_domina/alarm_control_panel.py
custom_components/ave_domina/ave_client.py
custom_components/ave_domina/button.py
custom_components/ave_domina/climate.py
custom_components/ave_domina/config_flow.py
custom_components/ave_domina/const.py
custom_components/ave_domina/coordinator.py
custom_components/ave_domina/cover.py
custom_components/ave_domina/entity.py
custom_components/ave_domina/light.py
custom_components/ave_domina/manifest.json
custom_components/ave_domina/sensor.py
custom_components/ave_domina/strings.json
custom_components/ave_domina/translations/it.json
```

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete AVE DOMINA Plus integration v1.0.0"
```
