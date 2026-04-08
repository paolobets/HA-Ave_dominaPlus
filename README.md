# AVE DOMINA Plus — Home Assistant Integration

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)

Custom component for [Home Assistant](https://www.home-assistant.io/) that integrates with the **AVE DOMINA Plus** home automation system (Web Server 53AB-WBS).

## Features

- **Auto-discovery** of all configured devices via WebSocket
- **Real-time updates** — push-based, no polling
- **Full device support:**
  - Lights (on/off, dimmer, DALI)
  - Covers / Shutters (up/down)
  - Thermostats (temperature, setpoint, season, mode)
  - Scenarios (activation buttons)
  - Alarm / Antitheft P3000 (area status)
  - Sensors (temperature, humidity, energy)
  - VMC Daikin (on/off, speed, mode)
- **Config Flow UI** — easy setup from the HA integrations page
- **Local-only** — connections restricted to private networks for security
- **Italian and English** translations

## Requirements

- Home Assistant 2024.1 or newer
- AVE Web Server 53AB-WBS on your local network
- HACS installed (for easy installation)

## Installation via HACS

1. Open HACS in Home Assistant
2. Go to **Integrations** → three dots menu → **Custom repositories**
3. Add this repository URL: `https://github.com/paolobets/ha-ave-domina`
4. Category: **Integration**
5. Click **Add** → then install **AVE DOMINA Plus**
6. Restart Home Assistant

## Configuration

1. Go to **Settings** → **Devices & Services** → **Add Integration**
2. Search for **AVE DOMINA Plus**
3. Enter the IP address of your AVE Web Server (e.g., `192.168.1.10`)
4. Port defaults to `14001` (WebSocket)

## Supported Device Types

| AVE Type | HA Platform | Description |
|----------|-------------|-------------|
| 1, 22 | `light` | Lights (on/off, DALI) |
| 2 | `light` | Dimmers (brightness) |
| 3, 16, 19 | `cover` | Shutters |
| 4 | `climate` | Thermostats |
| 5 | `sensor` | Energy meters |
| 6 | `button` | Scenarios |
| 12 | `alarm_control_panel` | Antitheft areas |

## Security

- **Local network only** — the integration rejects public IP addresses
- **CRC verification** on all incoming WebSocket messages
- **No credentials stored** — the AVE protocol does not support authentication

> **Note:** The AVE Web Server communicates via unencrypted WebSocket (ws://) and HTTP. This is a hardware limitation. It is recommended to place the AVE server on a dedicated VLAN if possible.

## Protocol

This integration communicates with the AVE server using:
- **WebSocket** (port 14001) for real-time state updates and device control (EBI, EAI, STS commands)
- **HTTP** (`bridge.php`) for dimmer levels (SIL) and scenario execution (ESI)

## License

MIT
