"""Base entity for AVE DOMINA Plus."""
from __future__ import annotations

import logging

from homeassistant.helpers.entity import Entity

try:
    from homeassistant.helpers.device_registry import DeviceInfo
except ImportError:
    DeviceInfo = dict  # Fallback for test environments

from .const import DOMAIN
from .coordinator import AveCoordinator, AveDevice

_LOGGER = logging.getLogger(__name__)


class AveEntity(Entity):
    """Base class for AVE DOMINA Plus entities."""

    _attr_has_entity_name = False  # Use full device name as entity name

    def __init__(self, coordinator: AveCoordinator, device: AveDevice) -> None:
        self.coordinator = coordinator
        self.ave_device = device
        self._attr_unique_id = f"ave_{coordinator.client.host}_{device.id}"
        self._attr_name = device.name

    @property
    def device_info(self) -> DeviceInfo:
        """Return device info for grouping in HA device registry."""
        return DeviceInfo(
            identifiers={(DOMAIN, f"{self.coordinator.client.host}_{self.ave_device.id}")},
            name=self.ave_device.name,
            manufacturer="AVE",
            model="DOMINA Plus",
        )

    @property
    def available(self) -> bool:
        """Return True if the AVE server is connected."""
        return self.coordinator.client.connected

    async def async_added_to_hass(self) -> None:
        """Register update listener when added to hass."""
        self.coordinator.register_listener(self._on_coordinator_update)

    async def async_will_remove_from_hass(self) -> None:
        """Remove update listener."""
        self.coordinator.remove_listener(self._on_coordinator_update)

    def _on_coordinator_update(self) -> None:
        """Handle coordinator state update."""
        self.async_write_ha_state()
