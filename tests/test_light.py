"""Tests for AVE DOMINA Plus light platform."""
import pytest
from unittest.mock import AsyncMock, MagicMock
from custom_components.ave_domina.coordinator import AveCoordinator, AveDevice
from custom_components.ave_domina.light import AveLight, AveDimmer


@pytest.fixture
def mock_coordinator():
    coord = MagicMock(spec=AveCoordinator)
    coord.client = MagicMock()
    coord.client.host = "192.168.1.100"
    coord.client.connected = True
    coord.async_set_light = AsyncMock()
    coord.async_set_dimmer = AsyncMock()
    coord.register_listener = MagicMock()
    coord.remove_listener = MagicMock()
    return coord


class TestAveLight:
    def test_is_on_when_status_nonzero(self, mock_coordinator):
        device = AveDevice(id=1, name="Luce Sala", device_type=1, status=1)
        light = AveLight(mock_coordinator, device)
        assert light.is_on is True

    def test_is_off_when_status_zero(self, mock_coordinator):
        device = AveDevice(id=1, name="Luce Sala", device_type=1, status=0)
        light = AveLight(mock_coordinator, device)
        assert light.is_on is False

    @pytest.mark.asyncio
    async def test_turn_on(self, mock_coordinator):
        device = AveDevice(id=1, name="Luce Sala", device_type=1, status=0)
        light = AveLight(mock_coordinator, device)
        await light.async_turn_on()
        mock_coordinator.async_set_light.assert_awaited_once_with(1, True)

    @pytest.mark.asyncio
    async def test_turn_off(self, mock_coordinator):
        device = AveDevice(id=1, name="Luce Sala", device_type=1, status=1)
        light = AveLight(mock_coordinator, device)
        await light.async_turn_off()
        mock_coordinator.async_set_light.assert_awaited_once_with(1, False)


class TestAveDimmer:
    def test_brightness_maps_254_to_255(self, mock_coordinator):
        device = AveDevice(id=2, name="Dimmer", device_type=2, status=254)
        dimmer = AveDimmer(mock_coordinator, device)
        assert dimmer.brightness == 255

    def test_brightness_zero_when_off(self, mock_coordinator):
        device = AveDevice(id=2, name="Dimmer", device_type=2, status=0)
        dimmer = AveDimmer(mock_coordinator, device)
        assert dimmer.brightness == 0

    @pytest.mark.asyncio
    async def test_set_brightness(self, mock_coordinator):
        device = AveDevice(id=2, name="Dimmer", device_type=2, status=0)
        dimmer = AveDimmer(mock_coordinator, device)
        await dimmer.async_turn_on(brightness=128)
        mock_coordinator.async_set_dimmer.assert_awaited_once()
        call_args = mock_coordinator.async_set_dimmer.call_args[0]
        assert call_args[0] == 2
        assert 126 <= call_args[1] <= 128
