"""Stub for homeassistant.components.light."""
from enum import Enum

ATTR_BRIGHTNESS = "brightness"


class ColorMode(str, Enum):
    ONOFF = "onoff"
    BRIGHTNESS = "brightness"
    COLOR_TEMP = "color_temp"
    HS = "hs"
    RGB = "rgb"
    RGBW = "rgbw"
    UNKNOWN = "unknown"


class LightEntity:
    _attr_color_mode = ColorMode.ONOFF
    _attr_supported_color_modes: set = set()
    _attr_unique_id: str = ""
    _attr_name: str = ""

    @property
    def is_on(self) -> bool:
        return False

    @property
    def brightness(self) -> int | None:
        return None

    async def async_turn_on(self, **kwargs) -> None:
        pass

    async def async_turn_off(self, **kwargs) -> None:
        pass
