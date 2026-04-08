"""Stub for homeassistant.config_entries."""


class ConfigEntry:
    runtime_data = None

    def __init__(self, data=None):
        self.data = data or {}
        self.runtime_data = None
