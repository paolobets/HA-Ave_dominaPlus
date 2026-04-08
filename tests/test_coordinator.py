"""Tests for AVE DOMINA Plus coordinator."""
import pytest
from unittest.mock import AsyncMock, MagicMock
from custom_components.ave_domina.ave_client import AveMessage
from custom_components.ave_domina.coordinator import AveCoordinator


@pytest.fixture
def mock_client():
    client = MagicMock()
    client.connected = True
    client.connect = AsyncMock(return_value=True)
    client.disconnect = AsyncMock()
    client.send_command = AsyncMock(return_value=True)
    client.send_http_command = AsyncMock(return_value=True)
    client.register_callback = MagicMock()
    return client


@pytest.fixture
def coordinator(mock_client):
    return AveCoordinator(mock_client)


class TestDeviceRegistration:
    def test_handle_ldi_creates_devices(self, coordinator):
        msg = AveMessage(
            command="ldi",
            parameters=[],
            records=[
                ["1", "Luce Soggiorno", "1", "1"],
                ["2", "Dimmer Camera", "2", "2"],
                ["3", "Tapparella", "3", "1"],
                ["40", "Studio T", "4", "1"],
                ["10", "Scenario Notte", "6", "1"],
            ],
        )
        coordinator.handle_message(msg)
        assert len(coordinator.devices) == 5
        assert coordinator.devices[1].name == "Luce Soggiorno"
        assert coordinator.devices[1].device_type == 1
        assert coordinator.devices[40].device_type == 4
        assert coordinator.devices[40].temperature == 0.0
        assert coordinator.devices[40].setpoint == 0.0

    def test_handle_ldi_detects_dimmer(self, coordinator):
        msg = AveMessage(command="ldi", parameters=[], records=[
            ["5", "Dimmer Sala", "2", "1"],
        ])
        coordinator.handle_message(msg)
        assert coordinator.devices[5].device_type == 2

    def test_handle_ldi_detects_vmc_daikin(self, coordinator):
        msg = AveMessage(command="ldi", parameters=[], records=[
            ["10000050", "VMC Sala", "4", "1"],
        ])
        coordinator.handle_message(msg)
        assert coordinator.devices[50].is_vmc_daikin is True


class TestUPDHandling:
    def test_upd_ws_updates_device_status(self, coordinator):
        coordinator.handle_message(AveMessage(command="ldi", parameters=[], records=[
            ["5", "Luce", "1", "1"],
        ]))
        upd = AveMessage(command="upd", parameters=["WS", "1", "5", "1"])
        coordinator.handle_message(upd)
        assert coordinator.devices[5].status == 1

    def test_upd_wt_t_updates_thermo_temperature(self, coordinator):
        coordinator.handle_message(AveMessage(command="ldi", parameters=[], records=[
            ["40", "Studio T", "4", "1"],
        ]))
        upd = AveMessage(command="upd", parameters=["WT", "T", "40", "198"])
        coordinator.handle_message(upd)
        assert coordinator.devices[40].temperature == 19.8

    def test_upd_tp_updates_thermo_setpoint(self, coordinator):
        coordinator.handle_message(AveMessage(command="ldi", parameters=[], records=[
            ["40", "Studio T", "4", "1"],
        ]))
        upd = AveMessage(command="upd", parameters=["TP", "40", "175"])
        coordinator.handle_message(upd)
        assert coordinator.devices[40].setpoint == 17.5

    def test_upd_tm_updates_thermo_mode(self, coordinator):
        coordinator.handle_message(AveMessage(command="ldi", parameters=[], records=[
            ["40", "Studio T", "4", "1"],
        ]))
        upd = AveMessage(command="upd", parameters=["TM", "40", "1"])
        coordinator.handle_message(upd)
        assert coordinator.devices[40].mode == 1

    def test_upd_ws_cover_status(self, coordinator):
        coordinator.handle_message(AveMessage(command="ldi", parameters=[], records=[
            ["10", "Tapparella", "3", "1"],
        ]))
        upd = AveMessage(command="upd", parameters=["WS", "3", "10", "127"])
        coordinator.handle_message(upd)
        assert coordinator.devices[10].status == 127


class TestAreaRegistration:
    def test_handle_lm_creates_areas(self, coordinator):
        msg = AveMessage(
            command="lm",
            parameters=[],
            records=[
                ["1", "Piano Terra", "0"],
                ["2", "Primo Piano", "1"],
            ],
        )
        coordinator.handle_message(msg)
        assert len(coordinator.areas) == 2
        assert coordinator.areas[1].name == "Piano Terra"
