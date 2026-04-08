"""Stub for homeassistant.components.button."""


class ButtonEntity:
    _attr_unique_id: str = ""
    _attr_name: str = ""

    async def async_press(self) -> None:
        pass
