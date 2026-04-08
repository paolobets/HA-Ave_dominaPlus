"""Config flow for AVE DOMINA Plus."""
from __future__ import annotations

import ipaddress
import socket

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.data_entry_flow import FlowResult

from .ave_client import AveClient
from .const import DOMAIN, CONF_HOST, CONF_PORT, DEFAULT_WS_PORT, PRIVATE_NETWORK_PREFIXES


def is_private_address(host: str) -> bool:
    """Check if a host resolves to a private/local network address."""
    try:
        # Resolve hostname to IP
        ip_str = socket.gethostbyname(host)
        ip = ipaddress.ip_address(ip_str)
        return ip.is_private or ip.is_loopback or ip.is_link_local
    except (socket.gaierror, ValueError):
        # If resolution fails, check string prefixes as fallback
        return host.startswith(PRIVATE_NETWORK_PREFIXES)


async def test_connection(host: str, port: int) -> bool:
    """Test if we can connect to the AVE server."""
    client = AveClient(host, port)
    try:
        if await client.connect():
            await client.disconnect()
            return True
        return False
    except Exception:
        return False


class AveConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for AVE DOMINA Plus."""

    VERSION = 1

    async def async_step_user(self, user_input: dict | None = None) -> FlowResult:
        """Handle the initial step."""
        errors = {}

        if user_input is not None:
            host = user_input[CONF_HOST].strip()
            port = user_input.get(CONF_PORT, DEFAULT_WS_PORT)

            # Security: only allow local network connections
            if not is_private_address(host):
                errors["base"] = "not_local_network"
            elif await test_connection(host, port):
                # Normalize IP for unique_id
                try:
                    resolved_ip = socket.gethostbyname(host)
                except socket.gaierror:
                    resolved_ip = host
                await self.async_set_unique_id(resolved_ip)
                self._abort_if_unique_id_configured()
                return self.async_create_entry(
                    title=f"AVE DOMINA Plus ({host})",
                    data={CONF_HOST: host, CONF_PORT: port},
                )
            else:
                errors["base"] = "cannot_connect"

        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_HOST): str,
                    vol.Optional(CONF_PORT, default=DEFAULT_WS_PORT): int,
                }
            ),
            errors=errors,
        )
