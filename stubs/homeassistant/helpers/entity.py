"""Stub for homeassistant.helpers.entity."""


class Entity:
    _attr_unique_id: str = ""
    _attr_name: str = ""
    _attr_has_entity_name: bool = False

    def async_write_ha_state(self) -> None:
        pass
