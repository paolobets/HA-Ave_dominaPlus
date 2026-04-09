"""Switch platform for AVE DOMINA Plus — controlled outlets (Marcia/Arresto) and monitored outlets (No Action)."""
from __future__ import annotations

import logging

from homeassistant.components.switch import SwitchEntity, SwitchDeviceClass
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import LIGHT_TYPES, OUTLET_TYPES, EBI_START, EBI_STOP, EBI_TOGGLE, CMD_EBI
from .coordinator import AveCoordinator, AveDevice
from .entity import AveEntity

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up AVE switch entities for outlets."""
    coordinator: AveCoordinator = entry.runtime_data
    entities: list[SwitchEntity] = []

    # Type 9 devices (OUTLET_TYPES) are always switches — energy monitored outlets
    for device in coordinator.get_devices_by_types(OUTLET_TYPES):
        entities.append(AveMonitoredOutlet(coordinator, device))

    # Type 1 devices with GMA/GNA flags also go to switch
    for device in coordinator.get_devices_by_types(LIGHT_TYPES):
        if device.is_ma:
            entities.append(AveMarciaArrestoSwitch(coordinator, device))
        elif device.is_na:
            entities.append(AveMonitoredOutlet(coordinator, device))

    _LOGGER.info("Setting up %d switch entities", len(entities))
    async_add_entities(entities)


class AveMarciaArrestoSwitch(AveEntity, SwitchEntity):
    """AVE Marcia/Arresto outlet — controllable with start/stop commands."""

    _attr_device_class = SwitchDeviceClass.OUTLET
    _attr_icon = "mdi:power-plug"

    def __init__(self, coordinator: AveCoordinator, device: AveDevice) -> None:
        super().__init__(coordinator, device)

    @property
    def is_on(self) -> bool:
        return self.ave_device.status != 0

    async def async_turn_on(self, **kwargs) -> None:
        """Send EBI start (11) command."""
        await self.coordinator.client.send_command(CMD_EBI, [str(self.ave_device.id), str(EBI_START)])

    async def async_turn_off(self, **kwargs) -> None:
        """Send EBI stop (12) command."""
        await self.coordinator.client.send_command(CMD_EBI, [str(self.ave_device.id), str(EBI_STOP)])


class AveMonitoredOutlet(AveEntity, SwitchEntity):
    """AVE No Action outlet — read-only, shows on/off status but cannot be controlled."""

    _attr_device_class = SwitchDeviceClass.OUTLET
    _attr_icon = "mdi:power-plug-outline"

    def __init__(self, coordinator: AveCoordinator, device: AveDevice) -> None:
        super().__init__(coordinator, device)

    @property
    def is_on(self) -> bool:
        return self.ave_device.status != 0

    async def async_turn_on(self, **kwargs) -> None:
        """No action — this outlet is read-only."""
        _LOGGER.warning("Cannot control outlet '%s' (No Action device)", self.ave_device.name)

    async def async_turn_off(self, **kwargs) -> None:
        """No action — this outlet is read-only."""
        _LOGGER.warning("Cannot control outlet '%s' (No Action device)", self.ave_device.name)
