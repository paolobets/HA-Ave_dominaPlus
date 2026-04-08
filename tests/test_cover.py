"""Tests for AVE DOMINA Plus cover platform."""
import pytest
from unittest.mock import AsyncMock, MagicMock
from custom_components.ave_domina.coordinator import AveCoordinator, AveDevice
from custom_components.ave_domina.cover import AveCover


@pytest.fixture
def mock_coordinator():
    coord = MagicMock(spec=AveCoordinator)
    coord.client = MagicMock()
    coord.client.host = "192.168.1.100"
    coord.client.connected = True
    coord.async_set_cover_up = AsyncMock()
    coord.async_set_cover_down = AsyncMock()
    coord.register_listener = MagicMock()
    coord.remove_listener = MagicMock()
    return coord


class TestAveCover:
    def test_position_maps_254_to_100(self, mock_coordinator):
        device = AveDevice(id=10, name="Tapparella", device_type=3, status=254)
        cover = AveCover(mock_coordinator, device)
        assert cover.current_cover_position == 100

    def test_position_zero(self, mock_coordinator):
        device = AveDevice(id=10, name="Tapparella", device_type=3, status=0)
        cover = AveCover(mock_coordinator, device)
        assert cover.current_cover_position == 0

    def test_is_closed_when_position_zero(self, mock_coordinator):
        device = AveDevice(id=10, name="Tapparella", device_type=3, status=0)
        cover = AveCover(mock_coordinator, device)
        assert cover.is_closed is True

    @pytest.mark.asyncio
    async def test_open_cover(self, mock_coordinator):
        device = AveDevice(id=10, name="Tapparella", device_type=3, status=0)
        cover = AveCover(mock_coordinator, device)
        await cover.async_open_cover()
        mock_coordinator.async_set_cover_up.assert_awaited_once_with(10)

    @pytest.mark.asyncio
    async def test_close_cover(self, mock_coordinator):
        device = AveDevice(id=10, name="Tapparella", device_type=3, status=254)
        cover = AveCover(mock_coordinator, device)
        await cover.async_close_cover()
        mock_coordinator.async_set_cover_down.assert_awaited_once_with(10)
