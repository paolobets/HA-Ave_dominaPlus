"""Stub for homeassistant.components.climate."""
from enum import Enum


class HVACMode(str, Enum):
    OFF = "off"
    HEAT = "heat"
    COOL = "cool"
    HEAT_COOL = "heat_cool"
    AUTO = "auto"
    DRY = "dry"
    FAN_ONLY = "fan_only"


class ClimateEntityFeature(int, Enum):
    TARGET_TEMPERATURE = 1
    TARGET_TEMPERATURE_RANGE = 2
    TARGET_HUMIDITY = 4
    FAN_MODE = 8
    PRESET_MODE = 16
    SWING_MODE = 32
    AUX_HEAT = 64


class ClimateEntity:
    _attr_temperature_unit = "°C"
    _attr_supported_features = 0
    _attr_hvac_modes: list = []
    _attr_min_temp: float = 7.0
    _attr_max_temp: float = 35.0
    _attr_target_temperature_step: float = 1.0
    _attr_unique_id: str = ""
    _attr_name: str = ""

    @property
    def current_temperature(self) -> float | None:
        return None

    @property
    def target_temperature(self) -> float | None:
        return None

    @property
    def hvac_mode(self) -> HVACMode:
        return HVACMode.OFF

    async def async_set_temperature(self, **kwargs) -> None:
        pass

    async def async_set_hvac_mode(self, hvac_mode: HVACMode) -> None:
        pass
