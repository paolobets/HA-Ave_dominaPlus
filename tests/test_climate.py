"""Tests for AVE DOMINA Plus climate platform."""
import pytest
from unittest.mock import AsyncMock, MagicMock
from custom_components.ave_domina.climate import AveClimate, HVACMode
from custom_components.ave_domina.coordinator import AveCoordinator, AveDevice
from custom_components.ave_domina.const import THERMO_SEASON_SUMMER, THERMO_SEASON_WINTER, THERMO_SEASON_ALL


@pytest.fixture
def mock_coordinator():
    coord = MagicMock(spec=AveCoordinator)
    coord.client = MagicMock()
    coord.client.host = "192.168.1.100"
    coord.client.connected = True
    coord.async_set_thermostat = AsyncMock()
    coord.register_listener = MagicMock()
    coord.remove_listener = MagicMock()
    return coord


class TestAveClimate:
    def test_current_temperature(self, mock_coordinator):
        device = AveDevice(id=40, name="Studio T", device_type=4, temperature=19.8)
        climate = AveClimate(mock_coordinator, device)
        assert climate.current_temperature == 19.8

    def test_target_temperature(self, mock_coordinator):
        device = AveDevice(id=40, name="Studio T", device_type=4, setpoint=17.5)
        climate = AveClimate(mock_coordinator, device)
        assert climate.target_temperature == 17.5

    def test_hvac_mode_heat_when_winter(self, mock_coordinator):
        device = AveDevice(id=40, name="Studio T", device_type=4, season=THERMO_SEASON_WINTER, mode=1)
        climate = AveClimate(mock_coordinator, device)
        assert climate.hvac_mode == HVACMode.HEAT

    def test_hvac_mode_cool_when_summer(self, mock_coordinator):
        device = AveDevice(id=40, name="Studio T", device_type=4, season=THERMO_SEASON_SUMMER, mode=1)
        climate = AveClimate(mock_coordinator, device)
        assert climate.hvac_mode == HVACMode.COOL

    def test_hvac_mode_auto_when_all_season(self, mock_coordinator):
        device = AveDevice(id=40, name="Studio T", device_type=4, season=THERMO_SEASON_ALL, mode=1)
        climate = AveClimate(mock_coordinator, device)
        assert climate.hvac_mode == HVACMode.AUTO

    def test_hvac_mode_heat_when_winter_inactive(self, mock_coordinator):
        """mode=0 (inactive) with winter season should show HEAT, not OFF."""
        device = AveDevice(id=40, name="Studio T", device_type=4, season=THERMO_SEASON_WINTER, mode=0)
        climate = AveClimate(mock_coordinator, device)
        assert climate.hvac_mode == HVACMode.HEAT

    @pytest.mark.asyncio
    async def test_set_temperature(self, mock_coordinator):
        device = AveDevice(id=40, name="Studio T", device_type=4, season=1, mode=1, setpoint=17.5)
        climate = AveClimate(mock_coordinator, device)
        await climate.async_set_temperature(temperature=20.0)
        mock_coordinator.async_set_thermostat.assert_awaited_once_with(40, 1, 1, 20.0)

    @pytest.mark.asyncio
    async def test_set_hvac_mode_heat(self, mock_coordinator):
        device = AveDevice(id=40, name="Studio T", device_type=4, season=0, mode=0, setpoint=17.5)
        climate = AveClimate(mock_coordinator, device)
        await climate.async_set_hvac_mode(HVACMode.HEAT)
        mock_coordinator.async_set_thermostat.assert_awaited_once_with(40, 1, 1, 17.5)

    @pytest.mark.asyncio
    async def test_set_hvac_mode_off(self, mock_coordinator):
        device = AveDevice(id=40, name="Studio T", device_type=4, season=1, mode=1, setpoint=17.5)
        climate = AveClimate(mock_coordinator, device)
        await climate.async_set_hvac_mode(HVACMode.OFF)
        mock_coordinator.async_set_thermostat.assert_awaited_once_with(40, 1, 0, 17.5)
