"""Stub for homeassistant.components.sensor."""
from enum import Enum


class SensorDeviceClass(str, Enum):
    TEMPERATURE = "temperature"
    HUMIDITY = "humidity"
    POWER = "power"
    ENERGY = "energy"
    VOLTAGE = "voltage"
    CURRENT = "current"


class SensorStateClass(str, Enum):
    MEASUREMENT = "measurement"
    TOTAL = "total"
    TOTAL_INCREASING = "total_increasing"


class SensorEntity:
    _attr_device_class = None
    _attr_state_class = None
    _attr_native_unit_of_measurement: str = ""
    _attr_unique_id: str = ""
    _attr_name: str = ""

    @property
    def native_value(self):
        return None
