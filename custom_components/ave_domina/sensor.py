"""Sensor platform for AVE DOMINA Plus — temperature, humidity, energy."""
from __future__ import annotations

from homeassistant.components.sensor import (
    SensorEntity,
    SensorDeviceClass,
    SensorStateClass,
)
from homeassistant.const import UnitOfTemperature, PERCENTAGE, UnitOfPower
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import AVE_TYPE_THERMOSTAT, AVE_TYPE_ECONOMIZER
from .coordinator import AveCoordinator, AveDevice
from .entity import AveEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    coordinator: AveCoordinator = entry.runtime_data
    entities: list[SensorEntity] = []

    for device in coordinator.devices.values():
        if device.device_type == AVE_TYPE_THERMOSTAT and not device.is_vmc_daikin:
            entities.append(AveTemperatureSensor(coordinator, device))
            if device.humidity is not None:
                entities.append(AveHumiditySensor(coordinator, device))
        if device.device_type == AVE_TYPE_ECONOMIZER:
            entities.append(AveEnergySensor(coordinator, device))

    async_add_entities(entities)


class AveTemperatureSensor(AveEntity, SensorEntity):
    _attr_device_class = SensorDeviceClass.TEMPERATURE
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_native_unit_of_measurement = UnitOfTemperature.CELSIUS

    def __init__(self, coordinator: AveCoordinator, device: AveDevice) -> None:
        super().__init__(coordinator, device)
        self._attr_unique_id = f"ave_{coordinator.client.host}_{device.id}_temp"
        self._attr_name = f"{device.name} Temperature"

    @property
    def native_value(self) -> float | None:
        return self.ave_device.temperature if self.ave_device.temperature != 0 else None


class AveHumiditySensor(AveEntity, SensorEntity):
    _attr_device_class = SensorDeviceClass.HUMIDITY
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_native_unit_of_measurement = PERCENTAGE

    def __init__(self, coordinator: AveCoordinator, device: AveDevice) -> None:
        super().__init__(coordinator, device)
        self._attr_unique_id = f"ave_{coordinator.client.host}_{device.id}_humidity"
        self._attr_name = f"{device.name} Humidity"

    @property
    def native_value(self) -> float | None:
        return self.ave_device.humidity


class AveEnergySensor(AveEntity, SensorEntity):
    _attr_device_class = SensorDeviceClass.POWER
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_native_unit_of_measurement = UnitOfPower.WATT

    def __init__(self, coordinator: AveCoordinator, device: AveDevice) -> None:
        super().__init__(coordinator, device)
        self._attr_unique_id = f"ave_{coordinator.client.host}_{device.id}_power"
        self._attr_name = f"{device.name} Power"

    @property
    def native_value(self) -> float | None:
        if self.ave_device.power_values:
            return self.ave_device.power_values[0]
        return None
