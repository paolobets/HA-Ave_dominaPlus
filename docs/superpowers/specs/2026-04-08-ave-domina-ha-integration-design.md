# AVE DOMINA Plus — Home Assistant Integration Design

## Overview

Custom component Home Assistant per il sistema domotico AVE DOMINA Plus (server 53AB-WBS), basato su connessione WebSocket nativa. Replica il protocollo dell'SDK JavaScript (`AVE_SDK.js`) in Python per offrire auto-discovery, controllo completo e aggiornamenti push real-time di tutti i dispositivi.

**Obiettivo**: sostituire l'integrazione Modbus manuale con un componente plug-and-play configurabile da UI, pubblicabile su HACS.

## Decisioni architetturali

| Decisione | Scelta | Motivazione |
|-----------|--------|-------------|
| Protocollo | WebSocket nativo | Push real-time, auto-discovery, nessuna configurazione manuale Modbus |
| Configurazione | Config Flow UI | Standard HA moderno, user-friendly |
| Distribuzione | HACS-ready | Repository GitHub pubblico |
| Dipendenze esterne | Nessuna | Solo `aiohttp` (già in HA) |
| IoT class | `local_push` | Dati arrivano via WS push dal server AVE |

## Struttura del componente

```
custom_components/ave_domina/
├── __init__.py              # Setup integrazione, gestione connessione WS
├── manifest.json            # Metadati HACS
├── config_flow.py           # Config Flow UI (inserimento IP, test connessione)
├── const.py                 # Costanti (tipi dispositivo, comandi, prefissi UPD)
├── coordinator.py           # DataUpdateCoordinator — cuore della logica
├── ave_client.py            # Client WebSocket Python (protocollo binario AVE)
├── entity.py                # Classe base AveEntity
├── light.py                 # Platform: luci on/off + dimmer
├── cover.py                 # Platform: tapparelle/shutter
├── climate.py               # Platform: termostati
├── button.py                # Platform: scenari (attivazione)
├── alarm_control_panel.py   # Platform: antifurto P3000
├── sensor.py                # Platform: sensori temperatura, umidita, energia
├── strings.json             # Traduzioni UI (en)
└── translations/
    └── it.json              # Traduzioni italiane
```

## Architettura

```
HA <-> Coordinator <-> AveClient <-> [WebSocket] <-> AVE Server 53AB-WBS
         |
   Entity platforms
   (light, climate, cover, ...)
```

- **AveClient** (`ave_client.py`): gestisce la connessione WebSocket, encoding/decoding binario (STX/ETX/CRC), invio comandi, parsing risposte UPD. Unico punto di contatto con il server.
- **Coordinator** (`coordinator.py`): mantiene lo stato di tutti i dispositivi in memoria. Si registra come listener sui messaggi UPD di AveClient. Quando riceve un aggiornamento, aggiorna lo stato interno e notifica le entita HA.
- **Entity platforms**: ogni piattaforma (light, climate, ecc.) legge dallo stato del Coordinator e invia comandi tramite Coordinator -> AveClient.

## Protocollo WebSocket AVE

### Connessione

- URL: `ws://<host>/` con sub-protocolli `['binary', 'base64']`
- Tipo binario: `arraybuffer`
- Libreria Python: `aiohttp` (async WebSocket client)
- Auto-reconnect con backoff esponenziale (2s, 4s, 8s... max 60s)
- Keepalive: risponde `PONG` ai `PING` del server

### Formato messaggi

**Invio:**
```
[0x02] + COMMAND + [0x1D] + PARAM1 + [0x1D] + PARAM2 + [0x03] + CRC_2bytes + [0x04]
```

**Ricezione:**
```
Split per 0x04 (EOT) -> per ogni frame:
  Split per 0x1E (RS) -> records
  Split primo record per 0x1D (GS) -> [comando, param1, param2, ...]
```

**CRC**: XOR di tutti i byte da 0x02 a 0x03, poi `0xFF - xor`, codificato come 2 char hex.

### Sequenza di inizializzazione

```
1. Connect WebSocket
2. LM                         -> lista mappe (aree)
3. LMC(id) + LML(id)          -> per ogni area, comandi e label
4. WSF(1,2,3,6,9,16,19,22)    -> stato dispositivi per famiglia
5. LDI                        -> lista completa dispositivi con tipo/nome
6. GTM, GMA, GNA, LI2         -> metadati aggiuntivi
7. WTS(id) per ogni termostato -> stato completo termostati
```

### Comandi di controllo

| Comando | Parametri | Azione |
|---------|-----------|--------|
| STS | `id, season,mode,setpoint*10` | Imposta termostato |
| SIL | `id, value` | Set intensita dimmer (0-254) |
| TOO | `id, state` | VMC Daikin on/off |
| VMC | `id, speed` | VMC velocita ventola |
| VMM | `id, mode` | VMC modalita |

### Messaggi UPD (aggiornamenti dal server)

| Prefisso | Significato | Parametri |
|----------|------------|-----------|
| D | Icona dispositivo | cmd_id, icon_id |
| WS | Stato generico | device_type, device_id, device_status |
| WT,T | Temperatura attuale | device_id, temp (valore / 10) |
| TP | Setpoint termostato | device_id, target (valore / 10) |
| TM | Modalita termostato | device_id, mode |
| WT,S | Stagione | device_id, 0=Estate 1=Inverno 2=Tutte |
| TR | Termo running | device_id, 0/1 |
| TW | Stato finestra | device_id, 0/1 |
| TK | Keyboard lock | device_id, lock_state |
| LL | Lettura sensore | param1, valore (es. "19.3C") |
| UMI | Umidita | id, valore, soglie, stati deumidificatore/valvola/pompa/allarme |
| SRE | Scenario eseguito | - |
| STO | Scenario stop | - |
| X+A | Stato area antifurto | area_id, stato |
| X+U | Stato unita antifurto | engaged_state |
| A,CS1,CS2,CS3 | Allarme sensore | device_id, state (1=allarme, 0=normale) |
| epv | Valori energia | device_id, val1, val2, val3 |
| GRP | Gruppo dimmer | map_id, indirizzi_valori |
| RGB | RGB wheel | parametri colore |

## Mapping dispositivi AVE -> Entita HA

### Luci (`light.py`) — Tipi AVE 1, 22

- On/off tramite comando WS con stato 0/1
- Tipo 22: supporto DALI
- Naming: `light.ave_<nome>`

### Dimmer (`light.py`) — Tipo AVE 2

- Stessa piattaforma light con `supported_features = BRIGHTNESS`
- `set_brightness` -> comando `SIL(device_id, value)`
- Valore 0 = off, 1-254 = livello
- RGBW se flaggato `isRGBW` -> comando RGB
- Mapping: 0-254 AVE -> 0-255 HA

### Tapparelle (`cover.py`) — Tipi AVE 3, 16, 19

- `open/close/stop/set_position`
- Posizione: 0-254 AVE -> 0-100% HA
- `device_class = SHUTTER`

### Termostati (`climate.py`) — Tipo AVE 4

- **HVAC modes**: OFF, HEAT, COOL, AUTO
  - Season AVE: 0=Estate->COOL, 1=Inverno->HEAT, 2=Tutte->AUTO
- **Temperature**: setpoint (valore / 10, es. 200 = 20.0C)
- **Current temperature**: da UPD WT,T
- **Preset modes**: basati sulle modalita AVE (da GTM)
- **Comando**: `STS(id, season, mode, setpoint*10)`
- **Attributi extra**: offset, stato finestra, keyboard lock, antifreeze
- **VMC Daikin** (id > 10000000): entita separata con fan speed e modalita via TOO, VMC, VMM

### Scenari (`button.py`) — Tipo AVE 6

- `button.press` -> attiva scenario
- Fire-and-forget, nessuno stato persistente

### Antifurto (`alarm_control_panel.py`) — Tipo AVE 12

- `arm_away / disarm`
- 8 aree indipendenti -> 8 entita alarm_control_panel
- Stato da UPD X+A e GSF
- Sensori area (tipo 13) -> `binary_sensor` con stato allarme da A, CS1, CS2, CS3

### Sensori (`sensor.py`)

- **Temperatura ambiente**: da LL (lettura diretta)
- **Umidita**: da UMI (sonda con soglie)
- **Energia**: da epv (tipo 5, potenza consumata)

## Config Flow

**Step 1**: inserimento IP/hostname del server AVE
**Step 2** (condizionale): username/password se il server richiede autenticazione
**Validazione**: connessione WebSocket + invio LM. Se risponde, configurazione OK.
**Unique ID**: basato sull'IP del server.

### Options Flow (post-configurazione)

- Intervallo refresh termostati (default 15s)
- Numero cicli refresh termostati (default 6)
- Abilitazione logging debug WebSocket

## Gestione errori e resilienza

| Scenario | Comportamento |
|----------|--------------|
| Connessione fallita | Entita marcate `unavailable`, auto-reconnect con backoff |
| CRC mismatch | Log warning, messaggio scartato |
| Comando senza ack | Retry 1 volta dopo 2s, poi log error |
| WS chiuso inaspettatamente | Auto-reconnect, riesecuzione sequenza init completa |
| Silence (90s senza messaggi) | Chiude e riconnette |
| Reconnessione stabile 60s | Reset backoff a 2s |

## Logging

- Logger: `custom_components.ave_domina`
- DEBUG: ogni messaggio WS inviato/ricevuto
- INFO: connessione, disconnessione, discovery dispositivi
- WARNING: CRC error, timeout, retry
- ERROR: connessione impossibile, errori fatali

## Testing

```
tests/
├── conftest.py              # Fixtures: mock WebSocket, fake AVE server
├── test_ave_client.py       # Protocollo: encoding, decoding, CRC, sequenza init
├── test_config_flow.py      # Config flow: validazione IP, errori connessione
├── test_coordinator.py      # Stato: parsing UPD, aggiornamento dispositivi
├── test_light.py            # On/off, dimmer, RGBW
├── test_climate.py          # Termostati: setpoint, season, mode, Daikin VMC
├── test_cover.py            # Tapparelle: posizione, open/close/stop
└── test_alarm.py            # Antifurto: arm/disarm, aree
```

- Mock WebSocket server con risposte pre-registrate
- Test protocollo binario: encoding/decoding frame, calcolo CRC
- Test integrazione HA: `pytest-homeassistant-custom-component`

## Distribuzione HACS

**`manifest.json`:**
```json
{
  "domain": "ave_domina",
  "name": "AVE DOMINA Plus",
  "config_flow": true,
  "dependencies": [],
  "iot_class": "local_push",
  "requirements": [],
  "version": "1.0.0"
}
```

**`hacs.json`:**
```json
{
  "name": "AVE DOMINA Plus",
  "render_readme": true,
  "homeassistant": "2024.1.0"
}
```

## Tipi dispositivo AVE — Riferimento

| Tipo ID | Dispositivo | Platform HA |
|---------|-------------|-------------|
| 1 | Luci on/off | light |
| 2 | Dimmer | light (brightness) |
| 3 | Tapparelle | cover |
| 4 | Termostati | climate |
| 5 | Economizzatore | sensor |
| 6 | Scenari | button |
| 9 | (Dispositivo generico) | light |
| 12 | Aree antifurto P3000 | alarm_control_panel |
| 13 | Sensori antifurto | binary_sensor |
| 14 | Zone audio | (fuori scope v1) |
| 16 | Tapparelle (alt) | cover |
| 17 | Abano (ventilazione) | sensor |
| 19 | Tapparelle (alt) | cover |
| 22 | Luci DALI | light |

## Punti aperti da investigare durante implementazione

- **Comando on/off luci e tapparelle**: l'SDK usa un generico `sendCommand` per luci (tipo 1) e cover (tipo 3). Il formato esatto del comando di controllo (non solo lettura stato WS) va estratto analizzando le funzioni `remote_v03.js` o testando direttamente sul server. I comandi per dimmer (`SIL`) e termostati (`STS`) sono gia documentati.
- **Autenticazione**: verificare se il server 53AB-WBS richiede credenziali HTTP prima della connessione WebSocket. Il config flow gestira entrambi i casi.

## Fuori scope v1

- Zone audio (tipo 14) — protocollo Tutondo/Vivaldi complesso, da valutare in v2
- Hotel system (htl) — non rilevante per uso residenziale
- Economizzatore IoT (abm) — da valutare in v2
