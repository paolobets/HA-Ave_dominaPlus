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
    coordinator: AveCoordinator = entry.runtime_data
    entities = [
        AveScenarioButton(coordinator, device)
        for device in coordinator.get_devices_by_types(SCENARIO_TYPES)
    ]
    async_add_entities(entities)


class AveScenarioButton(AveEntity, ButtonEntity):
    _attr_icon = "mdi:play-circle-outline"

    def __init__(self, coordinator: AveCoordinator, device: AveDevice) -> None:
        super().__init__(coordinator, device)

    async def async_press(self) -> None:
        await self.coordinator.async_activate_scenario(self.ave_device.id)
