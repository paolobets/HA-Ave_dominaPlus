"""Config flow for AVE DOMINA Plus."""
from __future__ import annotations

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.data_entry_flow import FlowResult

from .ave_client import AveClient
from .const import DOMAIN, CONF_HOST, CONF_PORT, DEFAULT_WS_PORT


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
            host = user_input[CONF_HOST]
            port = user_input.get(CONF_PORT, DEFAULT_WS_PORT)

            if await test_connection(host, port):
                await self.async_set_unique_id(host)
                self._abort_if_unique_id_configured()
                return self.async_create_entry(
                    title=f"AVE DOMINA Plus ({host})",
                    data={CONF_HOST: host, CONF_PORT: port},
                )
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
