"""The AVE DOMINA Plus integration."""
from __future__ import annotations

import logging

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .ave_client import AveClient
from .const import DOMAIN, CONF_HOST, CONF_PORT, DEFAULT_WS_PORT, PLATFORMS
from .coordinator import AveCoordinator

_LOGGER = logging.getLogger(__name__)

type AveConfigEntry = ConfigEntry[AveCoordinator]


async def async_setup_entry(hass: HomeAssistant, entry: AveConfigEntry) -> bool:
    """Set up AVE DOMINA Plus from a config entry."""
    host = entry.data[CONF_HOST]
    port = entry.data.get(CONF_PORT, DEFAULT_WS_PORT)

    client = AveClient(host, port)
    coordinator = AveCoordinator(client)

    if not await client.connect():
        _LOGGER.error("Failed to connect to AVE server at %s:%s", host, port)
        return False

    await coordinator.async_send_init_sequence()

    entry.runtime_data = coordinator

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    return True


async def async_unload_entry(hass: HomeAssistant, entry: AveConfigEntry) -> bool:
    """Unload a config entry."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unload_ok:
        coordinator: AveCoordinator = entry.runtime_data
        await coordinator.async_shutdown()
    return unload_ok
