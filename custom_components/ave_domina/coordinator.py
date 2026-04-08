"""AVE DOMINA Plus coordinator — device registry and state management."""
from __future__ import annotations

import asyncio
import logging
from dataclasses import dataclass, field
from typing import Callable

from .const import (
    CMD_LM, CMD_LMC, CMD_LML, CMD_LDI, CMD_LI2,
    CMD_WSF, CMD_WTS, CMD_GTM, CMD_GMA, CMD_GNA, CMD_GSF,
    CMD_STS, CMD_EBI, CMD_EAI, CMD_ESI,
    CMD_TOO, CMD_VMC, CMD_VMM,
    EBI_ON, EBI_OFF, EAI_UP, EAI_DOWN,
    UPD_D, UPD_WS, UPD_WT, UPD_TP, UPD_TM, UPD_TR, UPD_TW, UPD_TK,
    UPD_LL, UPD_UMI, UPD_EPV,
    AVE_TYPE_THERMOSTAT,
    WSF_FAMILIES,
    THERMO_REFRESH_INTERVAL, THERMO_REFRESH_CYCLES,
    THERMO_VMC_DAIKIN_THRESHOLD,
    BRIDGE_CMD_SIL,
    MAX_DEVICES, MAX_AREAS, MAX_POWER_VALUES,
)
from .ave_client import AveMessage

_LOGGER = logging.getLogger(__name__)


@dataclass
class AveDevice:
    """Represents a single AVE DOMINA device."""
    id: int
    name: str
    device_type: int
    maps: str = ""
    status: int = 0

    # Thermostat fields
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

    # Dimmer / lighting flags
    is_rgbw: bool = False
    is_dali: bool = False

    # Sensors
    humidity: float = 0.0
    power_values: list = field(default_factory=list)


@dataclass
class AveArea:
    """Represents an AVE DOMINA area/room."""
    id: int
    name: str
    order: int = 0


class AveCoordinator:
    """Manages device registry, state updates, and control commands."""

    def __init__(self, client) -> None:
        self._client = client
        self.devices: dict[int, AveDevice] = {}
        self.areas: dict[int, AveArea] = {}
        self._listeners: list[Callable[[], None]] = []
        self._thermo_refresh_task: asyncio.Task | None = None

        # Events to synchronize init sequence with async responses
        self._lm_received = asyncio.Event()
        self._ldi_received = asyncio.Event()

        # Register ourselves as a message handler on the client
        client.register_callback(self.handle_message)

    # ------------------------------------------------------------------
    # Listener pattern
    # ------------------------------------------------------------------

    @property
    def client(self):
        """Expose the underlying AVE client."""
        return self._client

    def register_listener(self, callback: Callable[[], None]) -> None:
        """Register a callback to be called on state changes."""
        self._listeners.append(callback)

    def remove_listener(self, callback: Callable[[], None]) -> None:
        """Remove a previously registered callback."""
        try:
            self._listeners.remove(callback)
        except ValueError:
            pass

    def _notify_listeners(self) -> None:
        for cb in self._listeners:
            try:
                cb()
            except Exception:
                _LOGGER.exception("Error in coordinator listener")

    # ------------------------------------------------------------------
    # Message routing
    # ------------------------------------------------------------------

    def handle_message(self, msg: AveMessage) -> None:
        """Route an incoming AveMessage to the appropriate handler."""
        cmd = msg.command.lower()
        handler = {
            "lm": self._handle_lm,
            "ldi": self._handle_ldi,
            "lmc": self._handle_lmc,
            "lml": self._handle_lml,
            "wts": self._handle_wts,
            "upd": self._handle_upd,
            "gsf": self._handle_gsf,
            "gtm": self._handle_gtm,
        }.get(cmd)
        if handler:
            try:
                handler(msg)
            except Exception:
                _LOGGER.exception("Error handling message %s", msg.command)

    # ------------------------------------------------------------------
    # Handlers
    # ------------------------------------------------------------------

    def _handle_lm(self, msg: AveMessage) -> None:
        """Handle LM response — area list."""
        for record in msg.records:
            if len(self.areas) >= MAX_AREAS:
                _LOGGER.warning("Area limit reached (%s), ignoring further areas", MAX_AREAS)
                break
            if len(record) < 2:
                continue
            try:
                area_id = int(record[0])
                name = record[1]
                order = int(record[2]) if len(record) > 2 else 0
                self.areas[area_id] = AveArea(id=area_id, name=name, order=order)
            except (ValueError, IndexError):
                _LOGGER.warning("Malformed LM record: %s", record)
        _LOGGER.info("Discovered %d areas", len(self.areas))
        self._lm_received.set()
        self._notify_listeners()

    def _handle_ldi(self, msg: AveMessage) -> None:
        """Handle LDI response — device list."""
        for record in msg.records:
            if len(self.devices) >= MAX_DEVICES:
                _LOGGER.warning("Device limit reached (%s), ignoring further devices", MAX_DEVICES)
                break
            if len(record) < 3:
                continue
            try:
                raw_id = int(record[0])
                name = record[1]
                device_type = int(record[2])
                maps_str = record[3] if len(record) > 3 else ""
                maps = maps_str  # Keep as string — may contain "1;2;3" or be empty

                # VMC Daikin devices have IDs > 10_000_000
                is_vmc_daikin = raw_id > THERMO_VMC_DAIKIN_THRESHOLD
                device_id = raw_id - THERMO_VMC_DAIKIN_THRESHOLD if is_vmc_daikin else raw_id

                # Detect RGBW (name starts with "$") and DALI (name ends with "$")
                is_rgbw = name.startswith("$")
                is_dali = name.endswith("$")

                dev = AveDevice(
                    id=device_id,
                    name=name,
                    device_type=device_type,
                    maps=maps,
                    is_vmc_daikin=is_vmc_daikin,
                    is_rgbw=is_rgbw,
                    is_dali=is_dali,
                )
                self.devices[device_id] = dev
            except (ValueError, IndexError):
                _LOGGER.warning("Malformed LDI record: %s", record)
        _LOGGER.info("Discovered %d devices", len(self.devices))
        self._ldi_received.set()
        self._notify_listeners()

    def _handle_lmc(self, msg: AveMessage) -> None:
        """Handle LMC response — area device count (informational)."""

    def _handle_lml(self, msg: AveMessage) -> None:
        """Handle LML response — area device list (informational)."""

    def _handle_wts(self, msg: AveMessage) -> None:
        """Handle WTS response — thermostat status."""
        # WTS records: [id, season, mode, setpoint*10, ...]
        for record in msg.records:
            if len(record) < 2:
                continue
            try:
                device_id = int(record[0])
                dev = self.devices.get(device_id)
                if dev is None:
                    continue
                if len(record) > 1:
                    dev.season = int(record[1])
                if len(record) > 2:
                    dev.mode = int(record[2])
                if len(record) > 3:
                    dev.setpoint = int(record[3]) / 10.0
            except (ValueError, IndexError):
                _LOGGER.warning("Malformed WTS record: %s", record)
        self._notify_listeners()

    def _handle_upd(self, msg: AveMessage) -> None:
        """Handle UPD message — state update for a device."""
        params = msg.parameters
        if not params:
            return
        sub = params[0].upper()

        try:
            if sub == UPD_WS:
                self._upd_ws(params)
            elif sub == UPD_WT:
                self._upd_wt(params)
            elif sub == UPD_TP:
                self._upd_tp(params)
            elif sub == UPD_TM:
                self._upd_tm(params)
            elif sub == UPD_TR:
                self._upd_tr(params)
            elif sub == UPD_TW:
                self._upd_tw(params)
            elif sub == UPD_TK:
                self._upd_tk(params)
            elif sub == UPD_D:
                self._upd_d(params)
            elif sub == UPD_LL:
                self._upd_ll(params)
            elif sub == UPD_UMI:
                self._upd_umi(params)
            elif sub in ("A", "CS1", "CS2", "CS3"):
                self._upd_power(sub, params)
            elif sub == UPD_EPV:
                self._upd_epv(params)
        except Exception:
            _LOGGER.exception("Error in UPD handler for sub=%s params=%s", sub, params)

        self._notify_listeners()

    def _handle_gsf(self, msg: AveMessage) -> None:
        """Handle GSF response (informational — server features)."""

    def _handle_gtm(self, msg: AveMessage) -> None:
        """Handle GTM response (server time, informational)."""

    # ------------------------------------------------------------------
    # UPD sub-handlers
    # ------------------------------------------------------------------

    def _upd_ws(self, params: list[str]) -> None:
        """WS: device status update. params = [WS, family, id, value]"""
        if len(params) < 4:
            return
        device_id = int(params[2])
        value = int(params[3])
        dev = self.devices.get(device_id)
        if dev:
            dev.status = value

    def _upd_wt(self, params: list[str]) -> None:
        """WT: thermostat sub-update. params = [WT, subtype, id, value]"""
        if len(params) < 4:
            return
        subtype = params[1].upper()
        device_id = int(params[2])
        raw = params[3]
        dev = self.devices.get(device_id)
        if dev is None:
            return
        if subtype == "T":
            dev.temperature = int(raw) / 10.0
        elif subtype == "S":
            dev.setpoint = int(raw) / 10.0
        elif subtype == "O":
            dev.offset = int(raw) / 10.0
        elif subtype == "L":
            dev.local_off = int(raw)
        elif subtype == "Z":
            dev.window_state = int(raw)

    def _upd_tp(self, params: list[str]) -> None:
        """TP: thermostat setpoint. params = [TP, id, value*10]"""
        if len(params) < 3:
            return
        device_id = int(params[1])
        dev = self.devices.get(device_id)
        if dev:
            dev.setpoint = int(params[2]) / 10.0

    def _upd_tm(self, params: list[str]) -> None:
        """TM: thermostat mode. params = [TM, id, mode]"""
        if len(params) < 3:
            return
        device_id = int(params[1])
        dev = self.devices.get(device_id)
        if dev:
            dev.mode = int(params[2])

    def _upd_tr(self, params: list[str]) -> None:
        """TR: thermostat season/mode. params = [TR, id, season]"""
        if len(params) < 3:
            return
        device_id = int(params[1])
        dev = self.devices.get(device_id)
        if dev:
            dev.season = int(params[2])

    def _upd_tw(self, params: list[str]) -> None:
        """TW: thermostat window state. params = [TW, id, state]"""
        if len(params) < 3:
            return
        device_id = int(params[1])
        dev = self.devices.get(device_id)
        if dev:
            dev.window_state = int(params[2])

    def _upd_tk(self, params: list[str]) -> None:
        """TK: thermostat keyboard lock. params = [TK, id, lock]"""
        if len(params) < 3:
            return
        device_id = int(params[1])
        dev = self.devices.get(device_id)
        if dev:
            dev.keyboard_lock = int(params[2])

    def _upd_d(self, params: list[str]) -> None:
        """D: dimmer level. params = [D, id, level]"""
        if len(params) < 3:
            return
        device_id = int(params[1])
        dev = self.devices.get(device_id)
        if dev:
            dev.status = int(params[2])

    def _upd_ll(self, params: list[str]) -> None:
        """LL: DALI level. params = [LL, id, level]"""
        if len(params) < 3:
            return
        device_id = int(params[1])
        dev = self.devices.get(device_id)
        if dev:
            dev.status = int(params[2])

    def _upd_umi(self, params: list[str]) -> None:
        """UMI: humidity. params = [UMI, id, value]"""
        if len(params) < 3:
            return
        device_id = int(params[1])
        dev = self.devices.get(device_id)
        if dev:
            dev.humidity = float(params[2])

    def _upd_power(self, sub: str, params: list[str]) -> None:
        """A/CS1/CS2/CS3: power values. params = [sub, id, value]"""
        if len(params) < 3:
            return
        device_id = int(params[1])
        dev = self.devices.get(device_id)
        if dev:
            if len(dev.power_values) < MAX_POWER_VALUES:
                dev.power_values.append((sub, params[2]))

    def _upd_epv(self, params: list[str]) -> None:
        """epv: energy/power value. params = [epv, id, value]"""
        if len(params) < 3:
            return
        device_id = int(params[1])
        dev = self.devices.get(device_id)
        if dev:
            dev.power_values.append(("epv", params[2]))

    # ------------------------------------------------------------------
    # Init sequence
    # ------------------------------------------------------------------

    async def async_send_init_sequence(self) -> None:
        """Send the full initialisation sequence to the AVE server.

        Waits for LM and LDI responses before returning, so that
        self.areas and self.devices are populated when platforms set up.
        """
        # Reset events for fresh init (e.g. reconnect)
        self._lm_received.clear()
        self._ldi_received.clear()

        # Step 1: Request area list and wait for response
        _LOGGER.debug("Init: sending LM")
        await self._client.send_command(CMD_LM)
        try:
            await asyncio.wait_for(self._lm_received.wait(), timeout=10.0)
        except asyncio.TimeoutError:
            _LOGGER.warning("Timeout waiting for LM response — continuing with empty areas")

        # Step 2: Request map commands/labels per area
        for area_id in self.areas:
            await self._client.send_command(CMD_LMC, [str(area_id)])
            await self._client.send_command(CMD_LML, [str(area_id)])
        # Small delay for LMC/LML responses to arrive
        await asyncio.sleep(2.0)

        # Step 3: Request device status by family
        for family in WSF_FAMILIES:
            await self._client.send_command(CMD_WSF, [family])
            await asyncio.sleep(0.3)

        await self._client.send_command(CMD_GSF, ["12"])

        # Step 4: Request device list and wait for response
        _LOGGER.debug("Init: sending LDI")
        await self._client.send_command(CMD_LDI)
        try:
            await asyncio.wait_for(self._ldi_received.wait(), timeout=10.0)
        except asyncio.TimeoutError:
            _LOGGER.error("Timeout waiting for LDI response — no devices discovered")

        # Step 5: Request metadata
        await self._client.send_command(CMD_GTM)
        await self._client.send_command(CMD_GMA)
        await self._client.send_command(CMD_GNA)
        await self._client.send_command(CMD_LI2)

        _LOGGER.info(
            "Init complete: %d areas, %d devices",
            len(self.areas), len(self.devices),
        )

        # Step 6: Kick off periodic thermostat refresh
        if self._thermo_refresh_task:
            self._thermo_refresh_task.cancel()
        self._thermo_refresh_task = asyncio.create_task(self._thermo_refresh_loop())

    async def _thermo_refresh_loop(self) -> None:
        """Refresh thermostat state every THERMO_REFRESH_INTERVAL seconds for THERMO_REFRESH_CYCLES cycles."""
        for _ in range(THERMO_REFRESH_CYCLES):
            await asyncio.sleep(THERMO_REFRESH_INTERVAL)
            for dev in list(self.devices.values()):
                if dev.device_type == AVE_TYPE_THERMOSTAT:
                    await self._client.send_command(CMD_WTS, [str(dev.id)])

    # ------------------------------------------------------------------
    # Control helpers
    # ------------------------------------------------------------------

    async def async_set_light(self, device_id: int, on: bool) -> bool:
        """Turn a light on or off via WebSocket EBI command."""
        value = EBI_ON if on else EBI_OFF
        return await self._client.send_command(CMD_EBI, [f"{device_id},{value}"])

    async def async_set_dimmer(self, device_id: int, level: int) -> bool:
        """Set dimmer level via HTTP SIL command (no WS equivalent for analog level)."""
        return await self._client.send_http_command(BRIDGE_CMD_SIL, device_id, level, is_dimmer_level=True)

    async def async_set_cover_up(self, device_id: int) -> bool:
        """Open a cover via WebSocket EAI command."""
        return await self._client.send_command(CMD_EAI, [f"{device_id},{EAI_UP}"])

    async def async_set_cover_down(self, device_id: int) -> bool:
        """Close a cover via WebSocket EAI command."""
        return await self._client.send_command(CMD_EAI, [f"{device_id},{EAI_DOWN}"])

    async def async_set_thermostat(
        self,
        device_id: int,
        season: int,
        mode: int,
        setpoint: float,
    ) -> bool:
        """Send thermostat STS command."""
        setpoint_raw = int(round(setpoint * 10))
        payload = f"{season},{mode},{setpoint_raw}"
        return await self._client.send_command(CMD_STS, [str(device_id), payload])

    async def async_activate_scenario(self, device_id: int) -> bool:
        """Activate a scenario via HTTP ESI command."""
        return await self._client.send_http_command(CMD_ESI, device_id, 0)

    async def async_set_vmc_daikin_mode(self, device_id: int, mode: int) -> bool:
        """Set VMC Daikin operating mode."""
        from .const import CMD_VMC
        return await self._client.send_command(CMD_VMC, [str(device_id), str(mode)])

    async def async_set_vmc_daikin_fan(self, device_id: int, fan_level: int) -> bool:
        """Set VMC Daikin fan level."""
        from .const import CMD_VMM
        return await self._client.send_command(CMD_VMM, [str(device_id), str(fan_level)])

    # ------------------------------------------------------------------
    # Utility
    # ------------------------------------------------------------------

    def get_devices_by_types(self, types: set[int]) -> list[AveDevice]:
        """Return all devices whose device_type is in *types*."""
        return [d for d in self.devices.values() if d.device_type in types]

    async def async_shutdown(self) -> None:
        """Clean up background tasks."""
        if self._thermo_refresh_task:
            self._thermo_refresh_task.cancel()
            try:
                await self._thermo_refresh_task
            except asyncio.CancelledError:
                pass
        await self._client.disconnect()
