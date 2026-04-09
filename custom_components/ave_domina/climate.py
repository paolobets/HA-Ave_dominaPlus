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
    coordinator: AveCoordinator = entry.runtime_data
    entities = [
        AveClimate(coordinator, device)
        for device in coordinator.get_devices_by_types(CLIMATE_TYPES)
        if not device.is_vmc_daikin
    ]
    async_add_entities(entities)


class AveClimate(AveEntity, ClimateEntity):
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
        """Map AVE season to HA HVAC mode.

        AVE season determines the operating mode (heat/cool/auto).
        AVE mode (0=inactive, 1=manual) determines if actively working.
        We map season→hvac_mode and use hvac_action for active/idle.
        """
        return SEASON_TO_HVAC.get(self.ave_device.season, HVACMode.AUTO)

    @property
    def hvac_action(self):
        """Return current HVAC action based on temperature vs setpoint.

        AVE mode field means manual(1)/auto(0), NOT heating/idle.
        Actual heating state is determined by comparing temp and setpoint.
        """
        from homeassistant.components.climate import HVACAction
        temp = self.ave_device.temperature
        sp = self.ave_device.setpoint
        if temp == 0 or sp == 0:
            return HVACAction.IDLE
        if self.ave_device.season == THERMO_SEASON_WINTER:
            return HVACAction.HEATING if temp < sp else HVACAction.IDLE
        elif self.ave_device.season == THERMO_SEASON_SUMMER:
            return HVACAction.COOLING if temp > sp else HVACAction.IDLE
        return HVACAction.IDLE

    @property
    def extra_state_attributes(self) -> dict:
        return {
            "ave_season": self.ave_device.season,
            "ave_mode": self.ave_device.mode,
            "ave_offset": self.ave_device.offset,
            "ave_window_state": self.ave_device.window_state,
            "ave_keyboard_lock": self.ave_device.keyboard_lock,
            "ave_antifreeze": self.ave_device.antifreeze,
            "ave_fan_level": self.ave_device.fan_level,
            "ave_local_off": self.ave_device.local_off,
        }

    async def async_set_temperature(self, **kwargs) -> None:
        import logging
        _LOGGER = logging.getLogger(__name__)
        temperature = kwargs.get(ATTR_TEMPERATURE)
        if temperature is not None:
            _LOGGER.info(
                "Setting thermostat %s (%s): temp=%.1f season=%d mode=%d",
                self.ave_device.id, self.ave_device.name,
                temperature, self.ave_device.season, self.ave_device.mode or 1,
            )
            await self.coordinator.async_set_thermostat(
                self.ave_device.id,
                self.ave_device.season,
                1,  # mode=1 (manual) when setting temp from client, as per SDK
                temperature,
            )

    async def async_set_hvac_mode(self, hvac_mode: HVACMode) -> None:
        if hvac_mode == HVACMode.OFF:
            await self.coordinator.async_set_thermostat(
                self.ave_device.id, self.ave_device.season, 0, self.ave_device.setpoint,
            )
        else:
            season = HVAC_TO_SEASON.get(hvac_mode, self.ave_device.season)
            await self.coordinator.async_set_thermostat(
                self.ave_device.id, season, 1, self.ave_device.setpoint,
            )
