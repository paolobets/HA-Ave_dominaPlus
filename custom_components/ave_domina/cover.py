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
    coordinator: AveCoordinator = entry.runtime_data
    entities = [
        AveCover(coordinator, device)
        for device in coordinator.get_devices_by_types(COVER_TYPES)
    ]
    async_add_entities(entities)


class AveCover(AveEntity, CoverEntity):
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
