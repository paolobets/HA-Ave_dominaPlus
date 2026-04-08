"""Stub for homeassistant.components.cover."""
from enum import Enum

ATTR_POSITION = "position"


class CoverDeviceClass(str, Enum):
    SHUTTER = "shutter"
    BLIND = "blind"
    CURTAIN = "curtain"
    DOOR = "door"
    GARAGE = "garage"
    GATE = "gate"
    WINDOW = "window"


class CoverEntityFeature(int, Enum):
    OPEN = 1
    CLOSE = 2
    SET_POSITION = 4
    STOP = 8
    OPEN_TILT = 16
    CLOSE_TILT = 32
    STOP_TILT = 64
    SET_TILT_POSITION = 128

    def __or__(self, other):
        return int(self) | int(other)


class CoverEntity:
    _attr_device_class = None
    _attr_supported_features = 0
    _attr_unique_id: str = ""
    _attr_name: str = ""

    @property
    def current_cover_position(self) -> int | None:
        return None

    @property
    def is_closed(self) -> bool:
        return False

    async def async_open_cover(self, **kwargs) -> None:
        pass

    async def async_close_cover(self, **kwargs) -> None:
        pass

    async def async_set_cover_position(self, **kwargs) -> None:
        pass
