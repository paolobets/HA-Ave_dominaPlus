"""Constants for the AVE DOMINA Plus integration."""

DOMAIN = "ave_domina"

# Connection
DEFAULT_WS_PORT = 14001
DEFAULT_HTTP_PORT = 80
WS_SUBPROTOCOLS = ["binary", "base64"]
RECONNECT_INTERVAL_BASE = 2
RECONNECT_INTERVAL_MAX = 60
SILENCE_TIMEOUT = 90
STABLE_CONNECTION_RESET = 60

# Frame bytes
STX = 0x02
ETX = 0x03
EOT = 0x04
GS = 0x1D   # Group Separator — parameter delimiter
RS = 0x1E   # Record Separator — record delimiter

# WebSocket commands (sent)
CMD_LM = "LM"
CMD_LMC = "LMC"
CMD_LML = "LML"
CMD_LDI = "LDI"
CMD_LI2 = "LI2"
CMD_WSF = "WSF"
CMD_WTS = "WTS"
CMD_GTM = "GTM"
CMD_GMA = "GMA"
CMD_GNA = "GNA"
CMD_GSF = "GSF"
CMD_STS = "STS"
CMD_SU2 = "SU2"
CMD_SU3 = "SU3"
CMD_PONG = "PONG"
CMD_TOO = "TOO"
CMD_VMC = "VMC"
CMD_VMM = "VMM"

# HTTP bridge commands (fallback only)
BRIDGE_URL = "bridge.php"
BRIDGE_CMD_SIL = "SIL"

# WebSocket device control commands
CMD_EBI = "EBI"   # Execute Binary Input — lights on/off/toggle
CMD_EAI = "EAI"   # Execute Analog Input — shutters up/down
CMD_EBC = "EBC"   # Execute By Command — map command execution
CMD_ESI = "ESI"   # Execute Scenario Input

# EBI values (lights)
EBI_TOGGLE = 10
EBI_OFF = 2
EBI_ON = 3

# EAI values (shutters)
EAI_UP = 8
EAI_DOWN = 9

# UPD prefixes (received)
UPD_D = "D"
UPD_WS = "WS"
UPD_WT = "WT"
UPD_TT = "TT"
UPD_TP = "TP"
UPD_TM = "TM"
UPD_TR = "TR"
UPD_TW = "TW"
UPD_TK = "TK"
UPD_LL = "LL"
UPD_UMI = "UMI"
UPD_SRE = "SRE"
UPD_STO = "STO"
UPD_EPV = "epv"

# AVE device type IDs
AVE_TYPE_LIGHT = 1
AVE_TYPE_DIMMER = 2
AVE_TYPE_SHUTTER = 3
AVE_TYPE_THERMOSTAT = 4
AVE_TYPE_ECONOMIZER = 5
AVE_TYPE_SCENARIO = 6
AVE_TYPE_GENERIC = 9
AVE_TYPE_ANTITHEFT_AREA = 12
AVE_TYPE_ANTITHEFT_SENSOR = 13
AVE_TYPE_AUDIO = 14
AVE_TYPE_SHUTTER_ALT1 = 16
AVE_TYPE_ABANO = 17
AVE_TYPE_SHUTTER_ALT2 = 19
AVE_TYPE_LIGHT_DALI = 22

# Device type groupings
LIGHT_TYPES = {AVE_TYPE_LIGHT, AVE_TYPE_DIMMER, AVE_TYPE_GENERIC, AVE_TYPE_LIGHT_DALI}
COVER_TYPES = {AVE_TYPE_SHUTTER, AVE_TYPE_SHUTTER_ALT1, AVE_TYPE_SHUTTER_ALT2}
CLIMATE_TYPES = {AVE_TYPE_THERMOSTAT}
SCENARIO_TYPES = {AVE_TYPE_SCENARIO}
ALARM_TYPES = {AVE_TYPE_ANTITHEFT_AREA}

# WSF family IDs to query at init
WSF_FAMILIES = ["1", "2", "22", "9", "3", "16", "19", "6"]

# Thermostat
THERMO_REFRESH_INTERVAL = 15
THERMO_REFRESH_CYCLES = 6
THERMO_SEASON_SUMMER = 0
THERMO_SEASON_WINTER = 1
THERMO_SEASON_ALL = 2
THERMO_VMC_DAIKIN_THRESHOLD = 10000000

# Config flow
CONF_HOST = "host"
CONF_PORT = "port"

# Security
MAX_DEVICES = 500
MAX_AREAS = 100
MAX_POWER_VALUES = 10
MAX_MESSAGE_RATE = 100  # max messages per second before throttling

# Private network ranges (RFC 1918 + link-local)
PRIVATE_NETWORK_PREFIXES = (
    "10.",
    "172.16.", "172.17.", "172.18.", "172.19.",
    "172.20.", "172.21.", "172.22.", "172.23.",
    "172.24.", "172.25.", "172.26.", "172.27.",
    "172.28.", "172.29.", "172.30.", "172.31.",
    "192.168.",
    "169.254.",
    "127.",
    "fd",  # IPv6 ULA
    "fe80",  # IPv6 link-local
)

# Platforms
PLATFORMS = ["light", "switch", "cover", "climate", "button", "alarm_control_panel", "sensor"]

# EBI values for Marcia/Arresto (start/stop outlets)
EBI_START = 11
EBI_STOP = 12
