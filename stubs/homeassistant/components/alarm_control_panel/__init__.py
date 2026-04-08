"""Stub for homeassistant.components.alarm_control_panel."""
from enum import Enum


class AlarmControlPanelState(str, Enum):
    DISARMED = "disarmed"
    ARMED_HOME = "armed_home"
    ARMED_AWAY = "armed_away"
    ARMED_NIGHT = "armed_night"
    ARMED_VACATION = "armed_vacation"
    ARMED_CUSTOM_BYPASS = "armed_custom_bypass"
    PENDING = "pending"
    ARMING = "arming"
    DISARMING = "disarming"
    TRIGGERED = "triggered"


class AlarmControlPanelEntityFeature(int, Enum):
    ARM_HOME = 1
    ARM_AWAY = 2
    ARM_NIGHT = 4
    TRIGGER = 8
    ARM_CUSTOM_BYPASS = 16
    ARM_VACATION = 32


class AlarmControlPanelEntity:
    _attr_supported_features = 0
    _attr_unique_id: str = ""
    _attr_name: str = ""

    @property
    def alarm_state(self) -> AlarmControlPanelState:
        return AlarmControlPanelState.DISARMED

    async def async_alarm_arm_away(self, code=None) -> None:
        pass

    async def async_alarm_disarm(self, code=None) -> None:
        pass
