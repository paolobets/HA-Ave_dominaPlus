"""Alarm control panel platform for AVE DOMINA Plus — P3000 antitheft."""
from __future__ import annotations

from homeassistant.components.alarm_control_panel import (
    AlarmControlPanelEntity,
    AlarmControlPanelEntityFeature,
    AlarmControlPanelState,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import ALARM_TYPES
from .coordinator import AveCoordinator, AveDevice
from .entity import AveEntity

AVE_TO_ALARM_STATE = {
    0: AlarmControlPanelState.DISARMED,
    1: AlarmControlPanelState.ARMED_AWAY,
    2: AlarmControlPanelState.DISARMED,
    3: AlarmControlPanelState.TRIGGERED,
}


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    coordinator: AveCoordinator = entry.runtime_data
    entities = [
        AveAlarm(coordinator, device)
        for device in coordinator.get_devices_by_types(ALARM_TYPES)
    ]
    async_add_entities(entities)


class AveAlarm(AveEntity, AlarmControlPanelEntity):
    _attr_supported_features = AlarmControlPanelEntityFeature.ARM_AWAY

    def __init__(self, coordinator: AveCoordinator, device: AveDevice) -> None:
        super().__init__(coordinator, device)

    @property
    def alarm_state(self) -> AlarmControlPanelState:
        return AVE_TO_ALARM_STATE.get(self.ave_device.status, AlarmControlPanelState.DISARMED)

    async def async_alarm_arm_away(self, code=None) -> None:
        pass  # Read-only — controlled via physical keypad

    async def async_alarm_disarm(self, code=None) -> None:
        pass  # Read-only — controlled via physical keypad
