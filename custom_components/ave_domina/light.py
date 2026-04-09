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

import logging
_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    coordinator: AveCoordinator = entry.runtime_data
    entities: list[LightEntity] = []
    for device in coordinator.get_devices_by_types(LIGHT_TYPES):
        # Skip outlets (isMA/isNA) — they go to switch platform
        if device.is_ma or device.is_na:
            continue
        if device.device_type == AVE_TYPE_DIMMER:
            entities.append(AveDimmer(coordinator, device))
        else:
            entities.append(AveLight(coordinator, device))
    _LOGGER.info("Setting up %d light entities", len(entities))
    async_add_entities(entities)


class AveLight(AveEntity, LightEntity):
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
    _attr_color_mode = ColorMode.BRIGHTNESS
    _attr_supported_color_modes = {ColorMode.BRIGHTNESS}

    def __init__(self, coordinator: AveCoordinator, device: AveDevice) -> None:
        super().__init__(coordinator, device)

    @property
    def is_on(self) -> bool:
        return self.ave_device.status != 0

    @property
    def brightness(self) -> int:
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
