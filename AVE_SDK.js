/***************************************************************************************************************************************/
/*                                                 WEBSOCKET_module version 3.0 WBS 277                                                */
/***************************************************************************************************************************************/

var WEBSOCKET_PREFIX        = '[WEB_SOCKET]: ';
var WEBSOCKET_CONSOLE_COLOR = '#00b300'; // Light green
var WEBSOCKET_CONSOLE_ERROR = '#ff0000'; // Red

var WEBSOCKET_RESULT_CODE = {
                              RESULT_OK : 0,
                              ERROR_WEBSOCKET_CLOSED : 1,
                              ERROR_WEBSOCKET_ALREADY_OPENED : 2,
                              ERROR_WEBSOCKET_ALREADY_CLOSED : 3,
                              ERROR_INVALID_ARGUMENTS : 4
                            };

var WEBSOCKET_prototype = {

  // VARIABLES
  WEBSOCKET_webSocket : null,
  WEBSOCKET_name : "<NO-NAME>",
  
  // URLs
  WEBSOCKET_url : null,

  // Timeouts
  WEBSOCKET_wsInConnectingStateTimeout : 0,
  WEBSOCKET_wsSilenceTimeout : 0,

  // Pointers - events callback
  WEBSOCKET_PTR_onConnectionOpen : null,
  WEBSOCKET_PTR_onMessageArrived : null,
  WEBSOCKET_PTR_onConnectionError : null,
  WEBSOCKET_PTR_onConnectionClose : null,
  WEBSOCKET_PTR_onConnectingTimeout : null,

  // Timer objects
  WEBSOCKET_silenceTimeoutObject : null, // di servizio

  /* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
  /* ------------------------------------------------------------------------------ CALLBACKS ------------------------------------------------------------------------- */
  /* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

  /**
   * Module initialization --- Callback to websocket events
   * @param {function} ptr_onConnectionOpen
   */
  WEBSOCKET_setConnectionOpenCallback : function(ptr_onConnectionOpen)
  {
    this.WEBSOCKET_PTR_onConnectionOpen    = ptr_onConnectionOpen;
    
    return WEBSOCKET_RESULT_CODE.RESULT_OK;
  },

  /* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
  /* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

  /**
   * Module initialization --- Callback to websocket events
   * @param {function} ptr_onMessageArrived
   */
  WEBSOCKET_setMessageArrivedCallback : function(ptr_onMessageArrived)
  {
    this.WEBSOCKET_PTR_onMessageArrived    = ptr_onMessageArrived;
    
    return WEBSOCKET_RESULT_CODE.RESULT_OK;
  },

  /* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
  /* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

  /**
   * Module initialization --- Callback to websocket events
   * @param {function} ptr_onConnectionError
   */
  WEBSOCKET_setConnectionErrorCallback : function(ptr_onConnectionError)
  {
    this.WEBSOCKET_PTR_onConnectionError   = ptr_onConnectionError;
    
    return WEBSOCKET_RESULT_CODE.RESULT_OK;
  },

  /* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
  /* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

  /**
   * Module initialization --- Callback to websocket events
   * @param {function} ptr_onConnectionClose
   */
  WEBSOCKET_setConnectionCloseCallback : function(ptr_onConnectionClose)
  {
    this.WEBSOCKET_PTR_onConnectionClose   = ptr_onConnectionClose;

    return WEBSOCKET_RESULT_CODE.RESULT_OK;
  },

  /* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
  /* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

  /**
   * Module initialization --- Callback to websocket events
   * @param {function} ptr_onConnectingTimeout
   * @param {function} tim_connectionTimeout
   */
  WEBSOCKET_setConnectionTimeoutCallback : function(ptr_onConnectingTimeout, tim_connectionTimeout)
  {
    this.WEBSOCKET_PTR_onConnectingTimeout    = ptr_onConnectingTimeout;
    this.WEBSOCKET_wsInConnectingStateTimeout = tim_connectionTimeout;

    return WEBSOCKET_RESULT_CODE.RESULT_OK;
  },

  /* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
  /* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

  /**
   * Module initialization --- Callback to websocket events
   * @param {function} ptr_onSilenceDetected
   * @param {function} tim_silenceTimeout
   */
  WEBSOCKET_setSilenceDetectedCallback : function(ptr_onSilenceDetected, tim_silenceTimeout)
  {
    this.WEBSOCKET_PTR_onSilenceDetected = ptr_onSilenceDetected;
    this.WEBSOCKET_wsSilenceTimeout      = tim_silenceTimeout;

    return WEBSOCKET_RESULT_CODE.RESULT_OK;
  },

  /* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
  /* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

  /**
   * Actually connects to WebSocket
   * @param {number} connectionType 0: standard connection - 1: resume connection
   */
  WEBSOCKET_doConnect : function(connectionType)
  {
    if (connectionType == 0)
    {
      console.log('%c' + WEBSOCKET_PREFIX + this.WEBSOCKET_name, 'color: ' + WEBSOCKET_CONSOLE_COLOR);
    }
    else
    {
      console.log('%c' + WEBSOCKET_PREFIX + 'Resume ' + this.WEBSOCKET_name, 'color: ' + WEBSOCKET_CONSOLE_COLOR);
    }

    this.WEBSOCKET_connect();
  },

  /* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
  /* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

  /**
   * Actually connects to WebSocket
   */
  WEBSOCKET_connect : function()
  {
    if (this.WEBSOCKET_webSocket === undefined || this.WEBSOCKET_webSocket === null || this.WEBSOCKET_webSocket.readyState === WebSocket.CLOSED)
    {
      console.log('%c' + WEBSOCKET_PREFIX + this.WEBSOCKET_name, 'color: ' + WEBSOCKET_CONSOLE_COLOR);
      
      this.WEBSOCKET_webSocket            = new WebSocket(this.WEBSOCKET_url, ['binary', 'base64']);
      this.WEBSOCKET_webSocket.binaryType = 'arraybuffer';
      
      var websocketInstance = this;

      this.WEBSOCKET_webSocket.onopen     = function()
        {
          if (typeof websocketInstance.WEBSOCKET_PTR_onConnectionOpen !== "undefined" && websocketInstance.WEBSOCKET_PTR_onConnectionOpen !== null)
          {
            websocketInstance.WEBSOCKET_PTR_onConnectionOpen();
          }

          if (typeof websocketInstance.WEBSOCKET_PTR_onSilenceDetected !== "undefined" && websocketInstance.WEBSOCKET_PTR_onSilenceDetected != null)
          {
            if (typeof websocketInstance.WEBSOCKET_silenceTimeoutObject !== "undefined" && websocketInstance.WEBSOCKET_silenceTimeoutObject != null)
            {
              clearTimeout(websocketInstance.WEBSOCKET_silenceTimeoutObject);
            }
            websocketInstance.WEBSOCKET_silenceTimeoutObject = setTimeout(function()
                    {
                      if (websocketInstance.WEBSOCKET_isWebSocketReadyToTransmit())
                      {
                        websocketInstance.WEBSOCKET_PTR_onSilenceDetected();
                      }
                    }, websocketInstance.WEBSOCKET_wsSilenceTimeout);
          }
        };
      this.WEBSOCKET_webSocket.onmessage  = function(msg)
        {
          if (typeof websocketInstance.WEBSOCKET_PTR_onMessageArrived !== "undefined" && websocketInstance.WEBSOCKET_PTR_onMessageArrived !== null)
          {
            websocketInstance.WEBSOCKET_PTR_onMessageArrived(msg);
          }

          if (typeof websocketInstance.WEBSOCKET_PTR_onSilenceDetected !== "undefined" && websocketInstance.WEBSOCKET_PTR_onSilenceDetected != null)
          {
            if (typeof websocketInstance.WEBSOCKET_silenceTimeoutObject !== "undefined" && websocketInstance.WEBSOCKET_silenceTimeoutObject != null)
            {
              clearTimeout(websocketInstance.WEBSOCKET_silenceTimeoutObject);
            }
            websocketInstance.WEBSOCKET_silenceTimeoutObject = setTimeout(function()
                    {
                      if (websocketInstance.WEBSOCKET_isWebSocketReadyToTransmit())
                      {
                        websocketInstance.WEBSOCKET_PTR_onSilenceDetected();
                      }
                    }, websocketInstance.WEBSOCKET_wsSilenceTimeout);
          }
        };
      this.WEBSOCKET_webSocket.onerror    = this.WEBSOCKET_PTR_onConnectionError;
      this.WEBSOCKET_webSocket.onclose    = this.WEBSOCKET_PTR_onConnectionClose;

      if (typeof this.WEBSOCKET_PTR_onConnectingTimeout !== "undefined" && this.WEBSOCKET_PTR_onConnectingTimeout !== null)
      {
        if (this.WEBSOCKET_wsInConnectingStateTimeout > 0)
        {
          setTimeout(function () {
            if (websocketInstance.WEBSOCKET_webSocket.readyState === WebSocket.CONNECTING) {
              websocketInstance.WEBSOCKET_PTR_onConnectingTimeout();
            }
          }, this.WEBSOCKET_wsInConnectingStateTimeout);
        }
      }

      return WEBSOCKET_RESULT_CODE.RESULT_OK;
    }
    else
    {
      console.log('%c' + WEBSOCKET_PREFIX + "WEBSOCKET_connect socket already opened - aborting (" + this.WEBSOCKET_name + ")", 'color: ' + WEBSOCKET_CONSOLE_ERROR);

      return WEBSOCKET_RESULT_CODE.ERROR_WEBSOCKET_ALREADY_OPENED;
    }
  },

  /* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
  /* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

  /**
   * Disconnect WebSocket
   */
  WEBSOCKET_disconnect : function()
  {
    if (this.WEBSOCKET_webSocket !== undefined && this.WEBSOCKET_webSocket !== null && this.WEBSOCKET_webSocket.readyState === WebSocket.OPEN)
    {
      console.log('%c' + WEBSOCKET_PREFIX + "WEBSOCKET_disconnect - Closing socket (" + this.WEBSOCKET_name + ")", 'color: ' + WEBSOCKET_CONSOLE_COLOR);
      this.WEBSOCKET_webSocket.close();

      return WEBSOCKET_RESULT_CODE.RESULT_OK;
    }
    else
    {
      console.log('%c' + WEBSOCKET_PREFIX + "WEBSOCKET_disconnect socket already closed (" + this.WEBSOCKET_name + ")", 'color: ' + WEBSOCKET_CONSOLE_ERROR);

      return WEBSOCKET_RESULT_CODE.ERROR_WEBSOCKET_ALREADY_CLOSED;
    }
  },

  /* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
  /* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

  /**
   * Send message via WebSocket
   * @param {msg} the message to send
   */
  WEBSOCKET_send : function(msg)
  {
    if (this.WEBSOCKET_webSocket !== null && typeof this.WEBSOCKET_webSocket.readyState !== 'undefined' && this.WEBSOCKET_webSocket.readyState === WebSocket.OPEN)
    {
      this.WEBSOCKET_webSocket.send(msg);

      return WEBSOCKET_RESULT_CODE.RESULT_OK;
    }

    return WEBSOCKET_RESULT_CODE.ERROR_WEBSOCKET_CLOSED;
  },

  /* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
  /* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

  /**
   * Check if web socket is ready to transmit
   */
  WEBSOCKET_isWebSocketReadyToTransmit : function()
  {
    if (this.WEBSOCKET_webSocket !== null && typeof this.WEBSOCKET_webSocket.readyState !== 'undefined' && this.WEBSOCKET_webSocket.readyState === WebSocket.OPEN)
    {
      return true;
    }

    return false;
  }
};



function WEBSOCKET_CLASS(url, name)
{
  this.WEBSOCKET_webSocket = null;
  this.WEBSOCKET_url       = url;
  if (name !== undefined)
  {
    this.WEBSOCKET_name      = name;
  }

  // Timeouts
  this.WEBSOCKET_wsInConnectingStateTimeout = 0;
  this.WEBSOCKET_wsSilenceTimeout = 0;

  // Pointers - events callback
  this.WEBSOCKET_PTR_onConnectionOpen  = null;
  this.WEBSOCKET_PTR_onMessageArrived  = null;
  this.WEBSOCKET_PTR_onConnectionError = null;
  this.WEBSOCKET_PTR_onConnectionClose = null;
  this.WEBSOCKET_PTR_onConnectingTimeout = null;
  this.WEBSOCKET_PTR_onSilenceDetected  = null;

  // Timer objects
  this.WEBSOCKET_silenceTimeoutObject = null;
}

WEBSOCKET_CLASS.prototype = Object.create(WEBSOCKET_prototype);



/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* -------------------------------------------------------------------------- UTILITY FUNCTIONS --------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

function WEBSOCKET_isRemoteIP(IP)
{
  var isRemoteIP = true;
  if (IP.substr(0, 3) === '10.') {
    isRemoteIP = false;
  } else if (IP.substr(0, 4) === '172.') { // FIX luxdomo
    var secondIPNumber = IP.substr(4, IP.substr(4).indexOf('.'));
    if (parseInt(secondIPNumber) >= 16 && parseInt(secondIPNumber) <= 31) {
      isRemoteIP = false;
    }
  } else if (IP.substr(0, 4) === '127.') {
    isRemoteIP = false;
  } else if (IP.substr(0, 8) === '192.168.') {
    isRemoteIP = false;
  }
  return isRemoteIP;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

function WEBSOCKET_getURLVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) { vars[key] = value; });
  return vars;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Checks if connection is a wifi one or a data one
 * @returns connectionType
 */
function WEBSOCKET_getConnectionType()
{
  var connectionType = '';
  if (!WEBSOCKET_isRemoteIP(location.hostname)) {
    connectionType = 'wifi';
  } else {
    connectionType = 'data';
  }
  return connectionType;
}
/***************************************************************************************************************************************/
/*                                          DOMINAPLUS_MANAGER_module version 4.1 WBS 278                                              */
/***************************************************************************************************************************************/

// VARIABLES
var DOMINAPLUS_MANAGER_PREFIX        = '[DOMINAPLUS]: ';
var DOMINAPLUS_MANAGER_CONSOLE_COLOR = '#006622'; // Dark green
var DOMINAPLUS_MANAGER_CONSOLE_ERROR = '#ff0000'; // Red

/* VER192G WANDA */
var DOMINAPLUS_MANAGER_thermoStatusRetrievesCounter = 0;
var DOMINAPLUS_MANAGER_numberOfInitialThermoRefresh = 6;
/* ------------- */

/* VER180 WANDA */
var DOMINAPLUS_MANAGER_aveCloudTestModeEnabled = 0;
var DOMINAPLUS_MANAGER_mqttEnabled             = 0;
/* ------------ */

// FLAGS
var DOMINAPLUS_MANAGER_webSocketAvailable    = false;
var DOMINAPLUS_MANAGER_isLoadedLM            = false;
var DOMINAPLUS_MANAGER_isLoadedLDI           = false;
var DOMINAPLUS_MANAGER_isLoadedLMC           = false;
var DOMINAPLUS_MANAGER_UPD_UMI_ACK           = false;
var DOMINAPLUS_MANAGER_reconnectWithoutDelay = false; // VER266 WANDA

// COUNTERS
var DOMINAPLUS_MANAGER_counterGAT = 0;
var DOMINAPLUS_MANAGER_counterLMC = 0;

// ARRAYS
var DOMINAPLUS_MANAGER_deviceList          = new Array();
var DOMINAPLUS_MANAGER_areaList            = new Array();
var DOMINAPLUS_MANAGER_schedulerTaskList   = new Array();
var DOMINAPLUS_MANAGER_wsEventCallbackList = new Array(); // VER242 LORENZO
var DOMINAPLUS_MANAGER_economizerValues    = [0, 0, 0];   // VER252 WANDA

// URLs
// PHP
var DOMINAPLUS_MANAGER_GATURL = 'gat.php';
var DOMINAPLUS_MANAGER_GSTURL = 'gst.php';
// BRIDGE
var DOMINAPLUS_MANAGER_deviceListURL         = 'bridge.php?command=LDI';
var DOMINAPLUS_MANAGER_areaListURL           = 'bridge.php?command=LM';
var DOMINAPLUS_MANAGER_dimmerLevelCommandURL = 'bridge.php?command=SIL';

// STRINGS
var DOMINAPLUS_MANAGER_GSTxml = '';

var DOMINAPLUS_MANAGER_webSocketInstance = null; // VER277

// POINTERS - ANTITHEFT // VER216 WANDA
var DOMINAPLUS_MANAGER_PTR_antitheftConfigurationValueEventHandler  = null;
var DOMINAPLUS_MANAGER_PTR_antitheftAreasStatusEventHandler         = null;
var DOMINAPLUS_MANAGER_PTR_antitheftUPDAreasEventHandler            = null;
var DOMINAPLUS_MANAGER_PTR_antitheftManageGGS                       = null;
var DOMINAPLUS_MANAGER_PTR_asynchronousAntitheftStatusChangeArrived = null;
var DOMINAPLUS_MANAGER_PTR_getPopUpAlarm                            = null;
var DOMINAPLUS_MANAGER_PTR_manageUPD_XU                             = null;

// POINTERS - ANTITHEFT_TECHALARM // VER216 WANDA
var DOMINAPLUS_MANAGER_PTR_manageCS1CS2CS3       = null;
var DOMINAPLUS_MANAGER_PTR_managePropagationList = null;
var DOMINAPLUS_MANAGER_PTR_showPropagationAlarm  = null;

// POINTERS - AUDIO_GEN
var DOMINAPLUS_MANAGER_PTR_audioConfigurationValueEventHandler = null;
var DOMINAPLUS_MANAGER_PTR_audioAreaZonesStatusEventHandler    = null;

// POINTERS - RGBWHEEL
var DOMINAPLUS_MANAGER_PTR_rgbWheelStatusEventHandler = null;

// POINTERS - THERMO
var DOMINAPLUS_MANAGER_PTR_thermoStatusEventHandler = null;

// POINTERS - WEBAPP // VER237 WANDA
var DOMINAPLUS_MANAGER_PTR_commandLDIcompleted                    = null;
var DOMINAPLUS_MANAGER_PTR_commandLMcompleted                     = null;
var DOMINAPLUS_MANAGER_PTR_commandLMCcompleted                    = null;
var DOMINAPLUS_MANAGER_PTR_commandLMLcompleted                    = null;
var DOMINAPLUS_MANAGER_PTR_manageConnectionStatus                 = null;
var DOMINAPLUS_MANAGER_PTR_manageAddressThermoGAT                 = null;
var DOMINAPLUS_MANAGER_PTR_manageValCallingSystemGAT              = null;
var DOMINAPLUS_MANAGER_PTR_commandUPDWScompleted                  = null;
var DOMINAPLUS_MANAGER_PTR_manageCallingSystemUPD                 = null;
var DOMINAPLUS_MANAGER_PTR_manageUPDD                             = null;
var DOMINAPLUS_MANAGER_PTR_manageCommandsSREandSTO                = null;
var DOMINAPLUS_MANAGER_PTR_commandGRPcompleted                    = null;
var DOMINAPLUS_MANAGER_PTR_addHTMLtoDeviceType                    = null;
var DOMINAPLUS_MANAGER_PTR_manageCommandGMA                       = null;
var DOMINAPLUS_MANAGER_PTR_manageCommandGNA                       = null;
var DOMINAPLUS_MANAGER_PTR_updateSchedulerTaskHTML                = null;
var DOMINAPLUS_MANAGER_PTR_schedulerPagination                    = null;
var DOMINAPLUS_MANAGER_PTR_getDeviceStatus                        = null;
var DOMINAPLUS_MANAGER_PTR_loadingGATcompleted                    = null;
var DOMINAPLUS_MANAGER_PTR_manageCommandUPDLL                     = null;
var DOMINAPLUS_MANAGER_PTR_addDoorOpeningButton                   = null;
var DOMINAPLUS_MANAGER_PTR_setGeolocalScenarioURLs                = null;
var DOMINAPLUS_MANAGER_PTR_LMCisLoaded                            = null;
var DOMINAPLUS_MANAGER_PTR_updateDeviceType1_HTMLcodeForMulticast = null;
var DOMINAPLUS_MANAGER_PTR_getDevice                              = null;
var DOMINAPLUS_MANAGER_PTR_getArea                                = null;
var DOMINAPLUS_MANAGER_PTR_getMapCommand                          = null;
var DOMINAPLUS_MANAGER_PTR_manageCommandGEP                       = null;
var DOMINAPLUS_MANAGER_PTR_commandPWRcompleted                    = null;
var DOMINAPLUS_MANAGER_PTR_manageCommandHO                        = null;
var DOMINAPLUS_MANAGER_PTR_manageCommandAMS                       = null;
var DOMINAPLUS_MANAGER_PTR_manageCommandNET                       = null; // VER237 WANDA
var DOMINAPLUS_MANAGER_PTR_manageCommandCLD                       = null; // VER237 WANDA
var DOMINAPLUS_MANAGER_PTR_manageCommandUPDHTL                    = null; // VER274 WANDA + LORENZO

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Module initialization --- Callback ANTITHEFT
 * @param {function} ptr_manageConfigurationValue                 - pointer to ANTITHEFT_manageConfigurationValue
 * @param {function} ptr_manageAlarms                             - pointer to ANTITHEFT_manageAlarms
 * @param {function} ptr_manageUPDForAreas                        - pointer to ANTITHEFT_manageUPDForAreas
 * @param {function} ptr_manageGGS                                - pointer to ANTITHEFT_manageGGS
 * @param {function} ptr_asynchronousAntitheftStatusChangeArrived - pointer to ANTITHEFT_asynchronousAntitheftStatusChangeArrived
 * @param {function} ptr_getPopUpAlarm                            - pointer to ANTITHEFT_getPopUpAlarm
 * @param {function} ptr_manageUPD_XU                             - pointer to ANTITHEFT_manageUPD_XU
 * @version VER216 - WANDA
 */
function DOMINAPLUS_MANAGER_setCallbackForAntitheftConfigurationValue(ptr_manageConfigurationValue,
  ptr_manageAlarms,
  ptr_manageUPDForAreas,
  ptr_manageGGS,
  ptr_asynchronousAntitheftStatusChangeArrived,
  ptr_getPopUpAlarm,
  ptr_manageUPD_XU)
{
  DOMINAPLUS_MANAGER_PTR_antitheftConfigurationValueEventHandler  = ptr_manageConfigurationValue;
  DOMINAPLUS_MANAGER_PTR_antitheftAreasStatusEventHandler         = ptr_manageAlarms;
  DOMINAPLUS_MANAGER_PTR_antitheftUPDAreasEventHandler            = ptr_manageUPDForAreas;
  DOMINAPLUS_MANAGER_PTR_antitheftManageGGS                       = ptr_manageGGS;
  DOMINAPLUS_MANAGER_PTR_asynchronousAntitheftStatusChangeArrived = ptr_asynchronousAntitheftStatusChangeArrived;
  DOMINAPLUS_MANAGER_PTR_getPopUpAlarm                            = ptr_getPopUpAlarm;
  DOMINAPLUS_MANAGER_PTR_manageUPD_XU                             = ptr_manageUPD_XU;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Module initialization --- Callback ANTITHEFT_TECHALARM
 * @param {function} ptr_manageCS1CS2CS3       - pointer to ANTITHEFT_TECHALARM_manageCS1CS2CS3
 * @param {function} ptr_managePropagationList - pointer to ANTITHEFT_TECHALARM_managePropagationList
 * @param {function} ptr_showPropagationAlarm  - pointer to ANTITHEFT_TECHALARM_showPropagationAlarm
 * @version VER216 - WANDA
 */
function DOMINAPLUS_MANAGER_setCallbackForAntitheftTechAlarms(ptr_manageCS1CS2CS3, ptr_managePropagationList, ptr_showPropagationAlarm)
{
  DOMINAPLUS_MANAGER_PTR_manageCS1CS2CS3       = ptr_manageCS1CS2CS3;
  DOMINAPLUS_MANAGER_PTR_managePropagationList = ptr_managePropagationList;
  DOMINAPLUS_MANAGER_PTR_showPropagationAlarm  = ptr_showPropagationAlarm;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Module initialization --- Callback AUDIO_GEN
 * @param {function} ptr_manageConfigurationValue - pointer to AUDIO_GEN_manageConfigurationValue
 * @param {function} ptr_manageUPD                - pointer to AUDIO_GEN_manageUPD
 */
function DOMINAPLUS_MANAGER_setCallbackForAudioConfigurationValue(ptr_manageConfigurationValue, ptr_manageUPD)
{
  DOMINAPLUS_MANAGER_PTR_audioConfigurationValueEventHandler = ptr_manageConfigurationValue;
  DOMINAPLUS_MANAGER_PTR_audioAreaZonesStatusEventHandler    = ptr_manageUPD;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Module initialization --- Callback RGBWHEEL
 * @param {function} ptr_manageUPD - pointer to RGBWHEEL_manageUPD
 */
function DOMINAPLUS_MANAGER_setCallbackForRgbWheel(ptr_manageUPD)
{
  DOMINAPLUS_MANAGER_PTR_rgbWheelStatusEventHandler = ptr_manageUPD;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Module initialization --- Callback THERMO
 * @param {function} ptr_manageUPD - pointer to THERMO_manageUPD
 * @version VER197 - WANDA
 */
function DOMINAPLUS_MANAGER_setCallbackForThermo(ptr_manageUPD)
{
  DOMINAPLUS_MANAGER_PTR_thermoStatusEventHandler = ptr_manageUPD;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Managing DOMINAPLUS_MANAGER/WEBAPP callbacks
 * @param {string}   type_callback - type of the callback to be called
 * @param {function} ptr_callback  - callback function
 * @version VER274 - WANDA + LORENZO
 */
function DOMINAPLUS_MANAGER_setSingleCallbackForWebapp(type_callback, ptr_callback) 
{
  switch(type_callback)
  {
    case 'commandLDIcompleted':
      DOMINAPLUS_MANAGER_PTR_commandLDIcompleted = ptr_callback;
      break;

    case 'commandLMcompleted':
      DOMINAPLUS_MANAGER_PTR_commandLMcompleted = ptr_callback;
      break;

    case 'commandLMCcompleted':
      DOMINAPLUS_MANAGER_PTR_commandLMCcompleted = ptr_callback;
      break;

    case 'commandLMLcompleted':
      DOMINAPLUS_MANAGER_PTR_commandLMLcompleted = ptr_callback;
      break;

    case 'manageConnectionStatus':
      DOMINAPLUS_MANAGER_PTR_manageConnectionStatus = ptr_callback;
      break;

    case 'manageAddressThermoGAT':
      DOMINAPLUS_MANAGER_PTR_manageAddressThermoGAT = ptr_callback;
      break;

    case 'manageValCallingSystemGAT':
      DOMINAPLUS_MANAGER_PTR_manageValCallingSystemGAT = ptr_callback;
      break;

    case 'commandUPDWScompleted':
      DOMINAPLUS_MANAGER_PTR_commandUPDWScompleted = ptr_callback;
      break;

    case 'manageCallingSystemUPD':
      DOMINAPLUS_MANAGER_PTR_manageCallingSystemUPD = ptr_callback;
      break;

    case 'manageUPDD':
      DOMINAPLUS_MANAGER_PTR_manageUPDD = ptr_callback;
      break;

    case 'manageCommandsSREandSTO':
      DOMINAPLUS_MANAGER_PTR_manageCommandsSREandSTO = ptr_callback;
      break;

    case 'commandGRPcompleted':
      DOMINAPLUS_MANAGER_PTR_commandGRPcompleted = ptr_callback;
      break;

    case 'addHTMLtoDeviceType':
      DOMINAPLUS_MANAGER_PTR_addHTMLtoDeviceType = ptr_callback;
      break;

    case 'manageCommandGMA':
      DOMINAPLUS_MANAGER_PTR_manageCommandGMA = ptr_callback;
      break;

    case 'manageCommandGNA':
      DOMINAPLUS_MANAGER_PTR_manageCommandGNA = ptr_callback;
      break;

    case 'updateSchedulerTaskHTML':
      DOMINAPLUS_MANAGER_PTR_updateSchedulerTaskHTML = ptr_callback;
      break;

    case 'schedulerPagination':
      DOMINAPLUS_MANAGER_PTR_schedulerPagination = ptr_callback;
      break;

    case 'getDeviceStatus':
      DOMINAPLUS_MANAGER_PTR_getDeviceStatus = ptr_callback;
      break;

    case 'loadingGATcompleted':
      DOMINAPLUS_MANAGER_PTR_loadingGATcompleted = ptr_callback;
      break;

    case 'manageCommandUPDLL':
      DOMINAPLUS_MANAGER_PTR_manageCommandUPDLL = ptr_callback;
      break;

    case 'addDoorOpeningButton':
      DOMINAPLUS_MANAGER_PTR_addDoorOpeningButton = ptr_callback;
      break;

    case 'setGeolocalScenarioURLs':
      DOMINAPLUS_MANAGER_PTR_setGeolocalScenarioURLs = ptr_callback;
      break;

    case 'LMCisLoaded':
      DOMINAPLUS_MANAGER_PTR_LMCisLoaded = ptr_callback;
      break;

    case 'updateDeviceType1_HTMLcodeForMulticast':
      DOMINAPLUS_MANAGER_PTR_updateDeviceType1_HTMLcodeForMulticast = ptr_callback;
      break;

    case 'getDevice':
      DOMINAPLUS_MANAGER_PTR_getDevice = ptr_callback;
      break;

    case 'getArea':
      DOMINAPLUS_MANAGER_PTR_getArea = ptr_callback;
      break;

    case 'getMapCommand':
      DOMINAPLUS_MANAGER_PTR_getMapCommand = ptr_callback;
      break;

    case 'manageCommandGEP':
      DOMINAPLUS_MANAGER_PTR_manageCommandGEP = ptr_callback;
      break;

    case 'commandPWRcompleted':
      DOMINAPLUS_MANAGER_PTR_commandPWRcompleted = ptr_callback;
      break;

    case 'manageCommandHO':
      DOMINAPLUS_MANAGER_PTR_manageCommandHO = ptr_callback;
      break;

    case 'manageCommandAMS':
      DOMINAPLUS_MANAGER_PTR_manageCommandAMS = ptr_callback;
      break;

    case 'manageCommandNET':
      DOMINAPLUS_MANAGER_PTR_manageCommandNET = ptr_callback;
      break;

    case 'manageCommandCLD':
      DOMINAPLUS_MANAGER_PTR_manageCommandCLD = ptr_callback;
      break;

    case 'manageCommandUPDHTL':
      DOMINAPLUS_MANAGER_PTR_manageCommandUPDHTL = ptr_callback;
      break;
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Module initialization --- Callback WEBAPP
 * @param {function} ptr_commandLDIcompleted                    - pointer to WEBAPP_commandLDIcompleted
 * @param {function} ptr_commandLMcompleted                     - pointer to WEBAPP_commandLMcompleted
 * @param {function} ptr_commandLMCcompleted                    - pointer to WEBAPP_commandLMCCompleted
 * @param {function} ptr_commandLMLcompleted                    - pointer to WEBAPP_commandLMLcompleted
 * @param {function} ptr_manageConnectionStatus                 - pointer to WEBAPP_manageConnectionStatus
 * @param {function} ptr_manageAddressThermoGAT                 - pointer to WEBAPP_manageAddressThermoGAT
 * @param {function} ptr_manageValCallingSystemGAT              - pointer to WEBAPP_manageValCallingSystemGAT
 * @param {function} ptr_commandUPDWScompleted                  - pointer to WEBAPP_commandUPDWScompleted
 * @param {function} ptr_manageCallingSystemUPD                 - pointer to WEBAPP_manageCallingSystemUPD
 * @param {function} ptr_manageUPDD                             - pointer to WEBAPP_manageUPDD
 * @param {function} ptr_manageCommandsSREandSTO                - pointer to WEBAPP_manageCommandsSREandSTO
 * @param {function} ptr_commandGRPcompleted                    - pointer to WEBAPP_commandGRPcompleted
 * @param {function} ptr_addHTMLtoDeviceType                    - pointer to WEBAPP_addHTMLtoDeviceType
 * @param {function} ptr_manageCommandGMA                       - pointer to WEBAPP_manageCommandGMA
 * @param {function} ptr_manageCommandGNA                       - pointer to WEBAPP_manageCommandGNA
 * @param {function} ptr_updateSchedulerTaskHTML                - pointer to WEBAPP_updateSchedulerTaskHTML
 * @param {function} ptr_schedulerPagination                    - pointer to WEBAPP_schedulerPagination
 * @param {function} ptr_getDeviceStatus                        - pointer to WEBAPP_getDeviceStatus
 * @param {function} ptr_loadingGATcompleted                    - pointer to WEBAPP_loadingGATcompleted
 * @param {function} ptr_manageCommandUPDLL                     - pointer to WEBAPP_manageCommandUPDLL
 * @param {function} ptr_addDoorOpeningButton                   - pointer to WEBAPP_addDoorOpeningButton
 * @param {function} ptr_setGeolocalScenarioURLs                - pointer to WEBAPP_setGeolocalScenarioURLs
 * @param {function} ptr_LMCisLoaded                            - pointer to WEBAPP_LMCisLoaded
 * @param {function} ptr_updateDeviceType1_HTMLcodeForMulticast - pointer to WEBAPP_updateDeviceType1_HTMLcodeForMulticast
 * @param {function} ptr_getDevice                              - pointer to WEBAPP_getDevice
 * @param {function} ptr_getArea                                - pointer to WEBAPP_getArea
 * @param {function} ptr_getMapCommand                          - pointer to WEBAPP_getMapCommand
 * @param {function} ptr_manageCommandGEP                       - pointer to WEBAPP_manageCommandGEP
 * @param {function} ptr_commandPWRcompleted                    - pointer to WEBAPP_commandPWRcompleted
 * @param {function} ptr_manageCommandHO                        - pointer to WEBAPP_manageCommandHO
 * @param {function} ptr_manageCommandAMS                       - pointer to WEBAPP_manageCommandAMS
 * @param {function} ptr_manageCommandNET                       - pointer to WEBAPP_manageCommandNET
 * @param {function} ptr_manageCommandCLD                       - pointer to WEBAPP_manageCommandCLD
 * @version VER274 - WANDA
 */
function DOMINAPLUS_MANAGER_setCallbackForWebapp(ptr_commandLDIcompleted,
  ptr_commandLMcompleted,
  ptr_commandLMCcompleted,
  ptr_commandLMLcompleted,
  ptr_manageConnectionStatus,
  ptr_manageAddressThermoGAT,
  ptr_manageValCallingSystemGAT,
  ptr_commandUPDWScompleted,
  ptr_manageCallingSystemUPD,
  ptr_manageUPDD,
  ptr_manageCommandsSREandSTO,
  ptr_commandGRPcompleted,
  ptr_addHTMLtoDeviceType,
  ptr_manageCommandGMA,
  ptr_manageCommandGNA,
  ptr_updateSchedulerTaskHTML,
  ptr_schedulerPagination,
  ptr_getDeviceStatus,
  ptr_loadingGATcompleted,
  ptr_manageCommandUPDLL,
  ptr_addDoorOpeningButton,
  ptr_setGeolocalScenarioURLs,
  ptr_LMCisLoaded,
  ptr_updateDeviceType1_HTMLcodeForMulticast,
  ptr_getDevice,
  ptr_getArea,
  ptr_getMapCommand,
  ptr_manageCommandGEP,
  ptr_commandPWRcompleted,
  ptr_manageCommandHO,
  ptr_manageCommandAMS,
  ptr_manageCommandNET,
  ptr_manageCommandCLD)
{
  DOMINAPLUS_MANAGER_PTR_commandLDIcompleted                    = ptr_commandLDIcompleted;
  DOMINAPLUS_MANAGER_PTR_commandLMcompleted                     = ptr_commandLMcompleted;
  DOMINAPLUS_MANAGER_PTR_commandLMCcompleted                    = ptr_commandLMCcompleted;
  DOMINAPLUS_MANAGER_PTR_commandLMLcompleted                    = ptr_commandLMLcompleted;
  DOMINAPLUS_MANAGER_PTR_manageConnectionStatus                 = ptr_manageConnectionStatus;
  DOMINAPLUS_MANAGER_PTR_manageAddressThermoGAT                 = ptr_manageAddressThermoGAT;
  DOMINAPLUS_MANAGER_PTR_manageValCallingSystemGAT              = ptr_manageValCallingSystemGAT;
  DOMINAPLUS_MANAGER_PTR_commandUPDWScompleted                  = ptr_commandUPDWScompleted;
  DOMINAPLUS_MANAGER_PTR_manageCallingSystemUPD                 = ptr_manageCallingSystemUPD;
  DOMINAPLUS_MANAGER_PTR_manageUPDD                             = ptr_manageUPDD;
  DOMINAPLUS_MANAGER_PTR_manageCommandsSREandSTO                = ptr_manageCommandsSREandSTO;
  DOMINAPLUS_MANAGER_PTR_commandGRPcompleted                    = ptr_commandGRPcompleted;
  DOMINAPLUS_MANAGER_PTR_addHTMLtoDeviceType                    = ptr_addHTMLtoDeviceType;
  DOMINAPLUS_MANAGER_PTR_manageCommandGMA                       = ptr_manageCommandGMA;
  DOMINAPLUS_MANAGER_PTR_manageCommandGNA                       = ptr_manageCommandGNA;
  DOMINAPLUS_MANAGER_PTR_updateSchedulerTaskHTML                = ptr_updateSchedulerTaskHTML;
  DOMINAPLUS_MANAGER_PTR_schedulerPagination                    = ptr_schedulerPagination;
  DOMINAPLUS_MANAGER_PTR_getDeviceStatus                        = ptr_getDeviceStatus;
  DOMINAPLUS_MANAGER_PTR_loadingGATcompleted                    = ptr_loadingGATcompleted;
  DOMINAPLUS_MANAGER_PTR_manageCommandUPDLL                     = ptr_manageCommandUPDLL;
  DOMINAPLUS_MANAGER_PTR_addDoorOpeningButton                   = ptr_addDoorOpeningButton;
  DOMINAPLUS_MANAGER_PTR_setGeolocalScenarioURLs                = ptr_setGeolocalScenarioURLs;
  DOMINAPLUS_MANAGER_PTR_LMCisLoaded                            = ptr_LMCisLoaded;
  DOMINAPLUS_MANAGER_PTR_updateDeviceType1_HTMLcodeForMulticast = ptr_updateDeviceType1_HTMLcodeForMulticast;
  DOMINAPLUS_MANAGER_PTR_getDevice                              = ptr_getDevice;
  DOMINAPLUS_MANAGER_PTR_getArea                                = ptr_getArea;
  DOMINAPLUS_MANAGER_PTR_getMapCommand                          = ptr_getMapCommand;
  DOMINAPLUS_MANAGER_PTR_manageCommandGEP                       = ptr_manageCommandGEP;
  DOMINAPLUS_MANAGER_PTR_commandPWRcompleted                    = ptr_commandPWRcompleted;
  DOMINAPLUS_MANAGER_PTR_manageCommandHO                        = ptr_manageCommandHO;
  DOMINAPLUS_MANAGER_PTR_manageCommandAMS                       = ptr_manageCommandAMS;
  DOMINAPLUS_MANAGER_PTR_manageCommandNET                       = ptr_manageCommandNET;
  DOMINAPLUS_MANAGER_PTR_manageCommandCLD                       = ptr_manageCommandCLD;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ----------------------------------------------------------------------- CONNECTION RELATED ----------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages the websocket onOpen event
 * @version VER209 - WANDA
 */
function DOMINAPLUS_MANAGER_onConnectionOpen()
{
  DOMINAPLUS_MANAGER_webSocketAvailable = true;
  if ((!isTS01 && isClient === false) || isTS01) { // VER184 WANDA
    if (DOMINAPLUS_MANAGER_PTR_manageConnectionStatus !== null) {
      DOMINAPLUS_MANAGER_PTR_manageConnectionStatus('OPEN');
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages the websocket onSilenceDetected event
 * @version VER277
 */
function DOMINAPLUS_MANAGER_onSilenceDetected()
{
  DOMINAPLUS_MANAGER_webSocketInstance.WEBSOCKET_disconnect();
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages the websocket onMessage event
 * @param {object} response - MessageEvent object containing the oncoming messages from the websocket
 */
function DOMINAPLUS_MANAGER_onMessageArrived(response)
{
  var byteArray = new Uint8Array(response.data);
  var globalStr = '';
  if (byteArray[1] === 102 && byteArray[2] === 97 && byteArray[3] === 108 && byteArray[4] === 112) { // FIX FALP NAME BASE64 --- Analysis starts at position 1 to avoid first char 0x02
    console.log('%c' + DOMINAPLUS_MANAGER_PREFIX + 'FALP SPECIAL CASE', 'color: ' + DOMINAPLUS_MANAGER_CONSOLE_COLOR);
    for (var i = 0; i < byteArray.length; i++) {
      globalStr += String.fromCharCode(byteArray[i]);
    }
  } else {
    for (var i = 0; i < byteArray.length; i++) {
      globalStr += '%' + ('0' + byteArray[i].toString(16)).slice(-2); // FIX for UTF8 decoding
    }
    try {
      globalStr = decodeURIComponent(globalStr);
    }
    catch (err) {
      globalStr = '';
      for (var i = 0; i < byteArray.length; i++) {
        globalStr += String.fromCharCode(byteArray[i]);
      }
      console.log('%c' + DOMINAPLUS_MANAGER_PREFIX + 'Error: ' + err, 'color: ' + DOMINAPLUS_MANAGER_CONSOLE_ERROR);
      console.log('%c' + DOMINAPLUS_MANAGER_PREFIX + 'Exception: ' + globalStr, 'color: ' + DOMINAPLUS_MANAGER_CONSOLE_ERROR);
    }
  }
  var message = globalStr.split(String.fromCharCode(0x04));
  for (var m = 0; m < message.length; m++) {
    var str = message[m].substr(1, message[m].length - 4);
    var pieces = str.split(String.fromCharCode(0x1e)); // Separating cmd + parameters from records
    var records0Fields = pieces[0].split(String.fromCharCode(0x1d));
    var command = records0Fields[0];
    var parameters = new Array();
    var records = new Array();
    if (records0Fields.length > 1) { // if records0Fields.length <= 1 then there aren't any parameters
      for (var i = 1; i < records0Fields.length; i++) {
        parameters.push(records0Fields[i]);
      }
    }
    if (pieces.length > 1) { // if pieces.length <= 1 then there aren't any records
      for (var i = 1; i < pieces.length; i++) {
        var recordFields = pieces[i].split(String.fromCharCode(0x1d));
        records.push(recordFields);
      }
    }
    DOMINAPLUS_MANAGER_manageCommands(command, parameters, records);
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages the websocket onError event
 * @version VER209 - WANDA
 */
function DOMINAPLUS_MANAGER_onConnectionError()
{
  if (DOMINAPLUS_MANAGER_webSocketAvailable === false) {
    if (DOMINAPLUS_MANAGER_PTR_manageConnectionStatus !== null) {
      DOMINAPLUS_MANAGER_PTR_manageConnectionStatus('ERROR');
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages the websocket onConnectionClose event
 * @version VER277
 */
function DOMINAPLUS_MANAGER_onConnectionClose()
{
  if (DOMINAPLUS_MANAGER_PTR_manageConnectionStatus !== null) {
    DOMINAPLUS_MANAGER_PTR_manageConnectionStatus('CLOSE');
  }
  if (DOMINAPLUS_MANAGER_reconnectWithoutDelay === true) {
    DOMINAPLUS_MANAGER_reconnectWithoutDelay = false;
    DOMINAPLUS_MANAGER_webSocketInstance.WEBSOCKET_doConnect('1');  // VER277
  } else {
    setTimeout('DOMINAPLUS_MANAGER_webSocketInstance.WEBSOCKET_doConnect("1");', 2000);  // VER277
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ---------------------------------------------------------------------------- COMMANDS ---------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages different kind of commands
 * @param {string} command    - Command code
 * @param {object} parameters - Array of string representing parameters
 * @param {object} records    - Array of arrays of string representing records
 * @version VER256 - WANDA
 */
function DOMINAPLUS_MANAGER_manageCommands(command, parameters, records)
{
  switch (command) {
    case 'abm': // VER256 WANDA
      var stringToUpper = parameters[1].toUpperCase();
      if (typeof ECO_isAPrivateMailMessageForIotEconomizer === 'function' && typeof ECO_parseRXMessage === 'function') {
        if (ECO_isAPrivateMailMessageForIotEconomizer(stringToUpper)) {
          ECO_parseRXMessage(stringToUpper);
        }
      }
      break;

    case 'ack':
      DOMINAPLUS_MANAGER_manageACK();
      break;

    case 'pong':
      break;

    case 'ping':
      DOMINAPLUS_MANAGER_sendWSCommand('PONG');
      break;

    case 'lm':
      DOMINAPLUS_MANAGER_manageLM(records);
      break;

    case 'upd':
      DOMINAPLUS_MANAGER_manageUPD(parameters);
      break;

    case 'ldi':
      DOMINAPLUS_MANAGER_manageLDI(records);
      break;

    case 'li2':
      DOMINAPLUS_MANAGER_manageLI2(records);
      break;

    case 'lmc':
      DOMINAPLUS_MANAGER_manageLMC(parameters, records);
      break;

    case 'lml':
      if (!isTS01) {
        DOMINAPLUS_MANAGER_manageLML(parameters, records);
      }
      break;

    case 'gas':
      break;

    case 'wts': // Old modified GTS
      DOMINAPLUS_MANAGER_manageWTS(parameters, records);
      break;

    case 'gtm':
      DOMINAPLUS_MANAGER_manageGTM(parameters);
      break;

    case 'ggs':
      DOMINAPLUS_MANAGER_manageGGS(parameters);
      break;

    case 'gsf':
      DOMINAPLUS_MANAGER_manageGSF(parameters, records);
      break;

    case 'gsi':
      if (!isTS01) {
        DOMINAPLUS_MANAGER_manageGSI();
      }
      break;

    case 'gav':
      if (typeof ABANO_gestioneGAV === 'function') {
        ABANO_gestioneGAV(parameters, records);
      }
      break;

    case 'gma':
      DOMINAPLUS_MANAGER_manageGMA(parameters);
      break;

    case 'gna':
      DOMINAPLUS_MANAGER_manageGNA(parameters);
      break;

    case 'gep':
      if (!isTS01) {
        DOMINAPLUS_MANAGER_manageGEP(records);
      }
      break;

    case 'gec':
      if (isTS01) {
        DOMINAPLUS_MANAGER_manageGEC(records);
      }
      break;

    case 'gtp':
      if (typeof gestioneGTP === 'function') {
        gestioneGTP(parameters, records);
      }
      break;

    case 'ttp':
      break;

    case 'ame':	// Antitheft Memory Events
      if (typeof gestioneUPD_AME === 'function') {
        gestioneUPD_AME(parameters, records);
      }
      break;

    case 'alp':
      DOMINAPLUS_MANAGER_manageALP(command, parameters);
      break;

    case 'falp':
      DOMINAPLUS_MANAGER_manageFALP(parameters);
      break;

    case 'gst':
      DOMINAPLUS_MANAGER_manageGST(records);
      break;

    case 'pwr':
      DOMINAPLUS_MANAGER_managePWR(parameters);
      break;

	  /* VER225 LORENZO */
    case 'ams':
      DOMINAPLUS_MANAGER_manageAMS(parameters);
      break;
    /* ------------- */
    /* VER237 WANDA */
    case 'net':
      if (DOMINAPLUS_MANAGER_PTR_manageCommandNET !== null) {
        DOMINAPLUS_MANAGER_PTR_manageCommandNET(parameters);
      }
      break;

    case 'cld':
      if (DOMINAPLUS_MANAGER_PTR_manageCommandCLD !== null) {
        DOMINAPLUS_MANAGER_PTR_manageCommandCLD(parameters);
      }
      break;

    /* ------------- */
    default: // NOP
  }
	
	/* VER242 LORENZO */
	for (var i = DOMINAPLUS_MANAGER_wsEventCallbackList.length-1; i >= 0; i--)
	{
    var currItem = DOMINAPLUS_MANAGER_wsEventCallbackList[i];
    if (currItem != undefined)
    {
      var currFunction = currItem.websocketMsgCallback;
      var result = currFunction(command, parameters, records);
      if (result != undefined && result === true)
      {
        break;
      }
    }
	}
	/* ------------- */
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Composes a command and sends it through the websocket
 * @param {string} command    - Command code
 * @param {object} parameters - Array of strings representing parameters
 * @param {object} records    - Array of arrays of strings representing records
 * @version VER277
 */
function DOMINAPLUS_MANAGER_sendWSCommand(command, parameters, records)
{
  var str = String.fromCharCode(0x02) + command;
  var message = '';
  if (parameters != null) { // VER220 WANDA
    message += String.fromCharCode(0x1d);
    var pieces = parameters.toString().split(',');
    for (var i = 0; i < pieces.length; i++) {
      message += pieces[i];
      if (i < (pieces.length - 1)) {
        message += String.fromCharCode(0x1d); // It is needed to add one byte (0x1D) as separator for each parameter sent by the user
      }
    }
  }
  if (records != null) { // VER220 WANDA
    if (!Array.isArray(records)) {
      records = ('' + records).split(',');
    }
    for (var record = 0; record < records.length; record++) {
      message += String.fromCharCode(0x1e);
      var pieces = records[record].toString().split(',');
      for (var i = 0; i < pieces.length; i++) {
        message += pieces[i];
        if (i < (pieces.length - 1)) {
          message += String.fromCharCode(0x1d); // It is needed to add one byte (0x1D) as separator for each record sent by the user
        }
      }
    }
  }
  str += message;
  str += String.fromCharCode(0x03);
  var crc = DOMINAPLUS_MANAGER_buildCRC(str);

  if (DOMINAPLUS_MANAGER_webSocketInstance.WEBSOCKET_send(str + crc + String.fromCharCode(0x04)) != WEBSOCKET_RESULT_CODE.RESULT_OK)  // VER277
  {
    if (!isTS01) {
      switch (command) {
        case 'LM':
          DOMINAPLUS_MANAGER_manageLM_Bridge();
          break;

        case 'LDI':
          DOMINAPLUS_MANAGER_manageLDI_Bridge();
          break;
      }
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Composes a DOMINAplus message and return it
 * @param {string} command    - Command code
 * @param {object} parameters - Array of strings representing parameters
 * @param {object} records    - Array of arrays of strings representing records
 * @returns the DOMINAplus message
 * @version VER280
 */
function DOMINAPLUS_MANAGER_composeMessage(command, parameters, records)
{
  var str = String.fromCharCode(0x02) + command;
  var message = '';
  if (parameters != null) {
    message += String.fromCharCode(0x1d);
    var pieces = parameters.toString().split(',');
    for (var i = 0; i < pieces.length; i++) {
      message += pieces[i];
      if (i < (pieces.length - 1)) {
        message += String.fromCharCode(0x1d); // It is needed to add one byte (0x1D) as separator for each parameter sent by the user
      }
    }
  }
  if (records != null) {
    if (!Array.isArray(records)) {
      records = ('' + records).split(',');
    }
    for (var record = 0; record < records.length; record++) {
      message += String.fromCharCode(0x1e);
      var pieces = records[record].toString().split(',');
      for (var i = 0; i < pieces.length; i++) {
        message += pieces[i];
        if (i < (pieces.length - 1)) {
          message += String.fromCharCode(0x1d); // It is needed to add one byte (0x1D) as separator for each record sent by the user
        }
      }
    }
  }
  str += message;
  str += String.fromCharCode(0x03);
  var crc = DOMINAPLUS_MANAGER_buildCRC(str);

  return str + crc + String.fromCharCode(0x04);
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Send a generic message to websocket
 * @param {string} message    - Message to send
 * @version VER277
 */
function DOMINAPLUS_MANAGER_sendGenericMessage(msg)
{
  if (DOMINAPLUS_MANAGER_webSocketInstance.WEBSOCKET_send(msg) === WEBSOCKET_RESULT_CODE.RESULT_OK)  // VER277
  {
    return true;
  }
  return false;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Sends a command
 * @param {string} deviceID   - the ID of the selected device
 * @param {string} deviceType - the type of the selected device
 * @param {string} command    - command to send 
 * @param {number} value      - data to send
 * @version VER230 - WANDA
 */
function DOMINAPLUS_MANAGER_sendCommand(deviceID, deviceType, command, value)
{
  var str = '';
  // LIGHTING - SHUTTER - SCENARIO - ENERGY
  if (parseInt(deviceType) === 1 || parseInt(deviceType) === 2 || parseInt(deviceType) === 3 || parseInt(deviceType) === 6 || parseInt(deviceType) === 9 || parseInt(deviceType) === 16 || parseInt(deviceType) === 19) {
    str = '&parameter=' + deviceID + ',' + value;
    if (parseInt(deviceType) === 2 && command === DOMINAPLUS_MANAGER_dimmerLevelCommandURL) {
      str = '&parameter=' + deviceID + '&dati=' + value;
    }
  } else {
    console.log('%c' + DOMINAPLUS_MANAGER_PREFIX + 'FamilyID not supported! id: ' + deviceID + ' - type: ' + deviceType, 'color: ' + DOMINAPLUS_MANAGER_CONSOLE_COLOR);
  }
  var request = new XMLHttpRequest();
  request.open('GET', command + str + '?rnd=' + Math.random(), false); // 'false' makes the request synchronous
  request.send(null);
  if (request.readyState === 4) {
    if (request.status === 200) {
      // SLEEPING
      var start = new Date().getTime();
      for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > 200) {
          break;
        }
      }
      if (WEBAPP_pollingPause === 0 && DOMINAPLUS_MANAGER_PTR_getDeviceStatus !== null) {
        DOMINAPLUS_MANAGER_PTR_getDeviceStatus(deviceID, deviceType);
      }
    } else {
      console.log('%c' + DOMINAPLUS_MANAGER_PREFIX + 'sendCommand error', 'color: ' + DOMINAPLUS_MANAGER_CONSOLE_ERROR);
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Calculates the CRC
 * @param {string} globalString - part of the message needed to calculate the correct CRC
 * @returns the CRC
 */
function DOMINAPLUS_MANAGER_buildCRC(globalString)
{
  var crc = 0;
  for (var i = 0; i < globalString.length; i++) {
    crc = crc ^ globalString.charCodeAt(i);
  }
  crc = 0xFF - crc;
  var msb = DOMINAPLUS_MANAGER_valueToHex(parseInt(crc / 16));
  var lsb = DOMINAPLUS_MANAGER_valueToHex(parseInt(crc % 16));
  crc = msb + lsb;
  return crc;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Does a decimal-to-hexadecimal conversion
 * @param {number} value - the decimal number to be converted
 * @returns string representing the hexadecimal value 
 */
function DOMINAPLUS_MANAGER_valueToHex(value)
{
  var valueHex = 0;
  if (value > 9) {
    switch (value) {
      case 10:
        valueHex = 'A';
        break;

      case 11:
        valueHex = 'B';
        break;

      case 12:
        valueHex = 'C';
        break;

      case 13:
        valueHex = 'D';
        break;

      case 14:
        valueHex = 'E';
        break;

      case 15:
        valueHex = 'F';
        break;
    }
  } else {
    valueHex = '' + value;
  }
  return valueHex;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Does a decimal-to-hexadecimal string conversion
 * @param {number} number - the decimal number to be converted
 * @returns the hex string
 * @version VER209 - WANDA
 */
function DOMINAPLUS_MANAGER_decimalToHexString(number)
{
  if (number < 0) {
    number = 0xFFFFFFFF + number + 1;
  }
  return number.toString(16).toUpperCase();
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Loads GAT
 * @param {} nr
 * @version VER230 - WANDA
 */
function DOMINAPLUS_MANAGER_loadGAT(nr)
{
  if (typeof nr === 'undefined' || nr === null) { // VER198 WANDA
    nr = 1;
  }
  if (nr > 0) {
    nr--;
    var request = new XMLHttpRequest();
    request.open('GET', DOMINAPLUS_MANAGER_GATURL + '?rnd=' + Math.random(), false); // 'false' makes the request synchronous
    request.send(null);
    if (request.readyState === 4) {
      if (request.status === 200) {
        DOMINAPLUS_MANAGER_loadGAT_antitheft(request.responseText);
        DOMINAPLUS_MANAGER_loadGAT_audio(request.responseText);
        DOMINAPLUS_MANAGER_loadGAT_callingSystem(request.responseText);
        if (isTS01) {
          if (DOMINAPLUS_MANAGER_PTR_manageAddressThermoGAT !== null) {
            DOMINAPLUS_MANAGER_PTR_manageAddressThermoGAT(request.responseText);
          }
          if (isClient) {
            var clientRequest = new XMLHttpRequest();
            clientRequest.open('GET', 'http://' + isClient_ServerIP + '/gat.php?rnd=' + Math.random(), false); // Removed /_TS01 to ask gat.php to WBS
            clientRequest.send(null);
            if (clientRequest.readyState === 4) {
              if (clientRequest.status === 200) {
                DOMINAPLUS_MANAGER_loadGAT_antitheft(clientRequest.responseText);
                DOMINAPLUS_MANAGER_loadGAT_audio(clientRequest.responseText);
                DOMINAPLUS_MANAGER_loadGAT_callingSystem(clientRequest.responseText);
              } else {
                if (DOMINAPLUS_MANAGER_PTR_antitheftConfigurationValueEventHandler !== null) {
                  DOMINAPLUS_MANAGER_PTR_antitheftConfigurationValueEventHandler(-1);
                }
                setTimeout('DOMINAPLUS_MANAGER_loadGAT(' + nr + ');', 5000);
              }
            }
          }
        }
        if (DOMINAPLUS_MANAGER_PTR_loadingGATcompleted !== null) {
          DOMINAPLUS_MANAGER_PTR_loadingGATcompleted();
        }
      } else {
        if (isTS01) {
          if (DOMINAPLUS_MANAGER_PTR_antitheftConfigurationValueEventHandler !== null) {
            DOMINAPLUS_MANAGER_PTR_antitheftConfigurationValueEventHandler(-2);
          }
          setTimeout('DOMINAPLUS_MANAGER_loadGAT(' + nr + ');', 5000);
        } else {
          console.log('%c' + DOMINAPLUS_MANAGER_PREFIX + 'Loading GAT error', 'color: ' + DOMINAPLUS_MANAGER_CONSOLE_ERROR);
          if (DOMINAPLUS_MANAGER_counterGAT < 10) {
            setTimeout('DOMINAPLUS_MANAGER_loadGAT()', 5000);
          }
          DOMINAPLUS_MANAGER_counterGAT++;
        }
      }
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Response to load GAT - antitheft part
 * @param {object} responseText - request.responseText
 * @version VER230 - WANDA
 */
function DOMINAPLUS_MANAGER_loadGAT_antitheft(responseText)
{
  var responseDiv = document.createElement('div');
	responseDiv.innerHTML = responseText;
	var val = responseDiv.getElementsByTagName('val')[0];
	if (typeof val !== 'undefined') {
		var valText = parseInt(val.innerText.trim());
    if (DOMINAPLUS_MANAGER_PTR_antitheftConfigurationValueEventHandler !== null) {
      DOMINAPLUS_MANAGER_PTR_antitheftConfigurationValueEventHandler(valText);
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Response to load GAT - audio part
 * @param {object} responseText - request.responseText
 * @version VER230 - WANDA
 */
function DOMINAPLUS_MANAGER_loadGAT_audio(responseText)
{
  var responseDiv = document.createElement('div');
	responseDiv.innerHTML = responseText;
	var valaudio = responseDiv.getElementsByTagName('valaudio')[0];
	if (typeof valaudio !== 'undefined') {
    var valaudioText = parseInt(valaudio.innerText.trim());
    if (DOMINAPLUS_MANAGER_PTR_audioConfigurationValueEventHandler !== null) {
      DOMINAPLUS_MANAGER_PTR_audioConfigurationValueEventHandler(valaudioText);
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Response to load GAT - calling system part
 * @param {object} responseText - request.responseText
 * @version VER230 - WANDA
 */
function DOMINAPLUS_MANAGER_loadGAT_callingSystem(responseText)
{
  var responseDiv = document.createElement('div');
	responseDiv.innerHTML = responseText;
	var valcallingsystem = responseDiv.getElementsByTagName('valcallingsystem')[0];
	if (typeof valcallingsystem !== 'undefined') {
    var valcallingsystemText = parseInt(valcallingsystem.innerText.trim());
    if (DOMINAPLUS_MANAGER_PTR_manageValCallingSystemGAT !== null) {
      DOMINAPLUS_MANAGER_PTR_manageValCallingSystemGAT(valcallingsystemText);
    }
    if (!isTS01) {
      DOMINAPLUS_MANAGER_counterGAT++;
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages the response to the ACK command
 * @param {object} parameters - array of strings representing the aknowledged command code
 */
function DOMINAPLUS_MANAGER_manageACK()
{
  // NOP
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages the response to the LM command (LIST MAPS). It requests a list of every map in the plant
 * @param {object} records - array of arrays of strings containing the response data for every device
 ** [0][0]: the ID of the map;
 ** [0][1]: the name of the map;
 ** [0][2]: the order in which the map should be displayed
 * @version VER210 - WANDA
 */
function DOMINAPLUS_MANAGER_manageLM(records)
{
  if (!DOMINAPLUS_MANAGER_isLoadedLM) {
    DOMINAPLUS_MANAGER_areaList = [];
    DOMINAPLUS_MANAGER_counterLMC = records.length;
    for (var i = 0; i < DOMINAPLUS_MANAGER_counterLMC; i++) {
      var area = new Object();
      area.id          = records[i][0];
      area.name        = records[i][1];
      area.order       = records[i][2];
      area.mapcommands = null;
      if (!isTS01 && visibleAreas === '') {
        area.isVisible = true;
      }
      if ((!isTS01 && visibleAreas !== '') || (isTS01 && isTS01CustomMode)) { // VER210 WANDA
        if (visibleAreas.indexOf(',' + area.id + ',') > -1) {
          area.isVisible = true;
        } else {
          area.isVisible = false;
        }
      }
      DOMINAPLUS_MANAGER_areaList.push(area);
      DOMINAPLUS_MANAGER_sendWSCommand('LMC', area.id);
      if (!isTS01) {
        DOMINAPLUS_MANAGER_sendWSCommand('LML', area.id);
      }
    }
    DOMINAPLUS_MANAGER_isLoadedLM = true;
    if (isTS01) {
      setTimeout('DOMINAPLUS_MANAGER_sendWSCommand("SU2")', 500);
      setTimeout('DOMINAPLUS_MANAGER_sendWSCommand("SU3")', 2000);
    }
    /* VER192 WANDA */
    if (DOMINAPLUS_MANAGER_PTR_commandLMcompleted !== null) {
      DOMINAPLUS_MANAGER_PTR_commandLMcompleted();
    }
    /* ------------ */
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages the plan updates. It has been created to keep states and data aligned in realtime
 * @param {object} parameters - Array of strings containing plan updates
 * @version VER252 - WANDA
 */
function DOMINAPLUS_MANAGER_manageUPD(parameters)
{
  console.log('%c' + DOMINAPLUS_MANAGER_PREFIX + 'UPD - ' + parameters, 'color: ' + DOMINAPLUS_MANAGER_CONSOLE_COLOR);

  if (parameters[0] === 'GUI' && isTS01) {
    console.log('%c' + DOMINAPLUS_MANAGER_PREFIX + 'Received reload command', 'color: ' + DOMINAPLUS_MANAGER_CONSOLE_COLOR);
    location.reload();
  }

  else if (parameters[0] === 'HO' && isTS01) {
    if (DOMINAPLUS_MANAGER_PTR_manageCommandHO !== null) {
      DOMINAPLUS_MANAGER_PTR_manageCommandHO(parseInt(parameters[1]), parseInt(parameters[2]));
    }
  }

  else if (parameters[0] === 'WT') {
    switch (parameters[1]) {

      case 'O': // THERMOSTAT OFFSET
        if (DOMINAPLUS_MANAGER_PTR_thermoStatusEventHandler !== null) {
          var eventInfo = {};
          eventInfo.eventType  = 'thermostatoffset';
          eventInfo.id         = parameters[2];
          eventInfo.offSet     = parameters[3];
          eventInfo.deviceList = DOMINAPLUS_MANAGER_deviceList;
          DOMINAPLUS_MANAGER_PTR_thermoStatusEventHandler(eventInfo);
        }
        break;

      case 'S': // THERMOSTAT SEASON
        if (DOMINAPLUS_MANAGER_PTR_thermoStatusEventHandler !== null) {
          var eventInfo = {};
          eventInfo.eventType            = 'thermostatseason';
          eventInfo.id                   = parameters[2];
          eventInfo.season               = parameters[3];
          eventInfo.isGeneratedByMapMode = false;
          eventInfo.deviceList           = DOMINAPLUS_MANAGER_deviceList;
          DOMINAPLUS_MANAGER_PTR_thermoStatusEventHandler(eventInfo);
        }
        break;

      case 'T':  // THERMOSTAT TEMPERATURE
        if (DOMINAPLUS_MANAGER_PTR_thermoStatusEventHandler !== null) {
          var eventInfo = {};
          eventInfo.eventType   = 'thermostattemperature';
          eventInfo.id          = parameters[2];
          eventInfo.temperature = parameters[3];
          eventInfo.deviceList  = DOMINAPLUS_MANAGER_deviceList;
          DOMINAPLUS_MANAGER_PTR_thermoStatusEventHandler(eventInfo);
        }
        break;

      case 'L': // DAIKIN FAN LEVEL
        var device = false;
        if (DOMINAPLUS_MANAGER_PTR_getDevice !== null) {
          device = DOMINAPLUS_MANAGER_PTR_getDevice(parseInt(parameters[2]));
        }
        if (device !== false) {
          if (typeof device.isVMCDaikinModBus !== 'undefined' && device.isVMCDaikinModBus === true) {
            if (DOMINAPLUS_MANAGER_PTR_thermoStatusEventHandler !== null) {
              var eventInfo = {};
              eventInfo.eventType = 'daikinfanspeed';
              eventInfo.id        = parameters[2];
              eventInfo.fanSpeed  = parameters[3];
              eventInfo.device    = device;
              DOMINAPLUS_MANAGER_PTR_thermoStatusEventHandler(eventInfo);
            }
          } else { // Update as thermo if VMC not found
            if (DOMINAPLUS_MANAGER_PTR_thermoStatusEventHandler !== null) {
              var eventInfo = {};
              eventInfo.eventType            = 'thermostatfanlevel';
              eventInfo.id                   = parameters[2];
              eventInfo.fanLevel             = parameters[3];
              eventInfo.isGeneratedByMapMode = false;
              eventInfo.deviceList           = DOMINAPLUS_MANAGER_deviceList;
              DOMINAPLUS_MANAGER_PTR_thermoStatusEventHandler(eventInfo);
            }
          }
        }
        break;

      case 'Z': // DAIKIN LOCALOFF
        var device = false;
        if (DOMINAPLUS_MANAGER_PTR_getDevice !== null) {
          device = DOMINAPLUS_MANAGER_PTR_getDevice(parseInt(parameters[2]));
        }
        if (device !== false) {
          if (typeof device.isVMCDaikinModBus !== 'undefined' && device.isVMCDaikinModBus === true) {
            if (DOMINAPLUS_MANAGER_PTR_thermoStatusEventHandler !== null) {
              var eventInfo = {};
              eventInfo.eventType = 'daikinison';
              eventInfo.id        = parameters[2];
              eventInfo.isOn      = parameters[3];
              eventInfo.device    = device;
              DOMINAPLUS_MANAGER_PTR_thermoStatusEventHandler(eventInfo);
            }
          } else { // Update as thermo if VMC not found
            if (DOMINAPLUS_MANAGER_PTR_thermoStatusEventHandler !== null) {
              var eventInfo = {};
              eventInfo.eventType            = 'thermostatlocaloff';
              eventInfo.id                   = parameters[2];
              eventInfo.localOFF             = parameters[3];
              eventInfo.isGeneratedByMapMode = false;
              eventInfo.deviceList           = DOMINAPLUS_MANAGER_deviceList;
              DOMINAPLUS_MANAGER_PTR_thermoStatusEventHandler(eventInfo);
            }
          }
        }
        break;

      default: // NOP
    }
  }

  else if (parameters[0] === 'VMM') { // DAIKIN MODE
    var device = false;
    if (DOMINAPLUS_MANAGER_PTR_getDevice !== null) {
      device = DOMINAPLUS_MANAGER_PTR_getDevice(parseInt(parameters[1]));
    }
    if (device !== false) {
      if (typeof device.isVMCDaikinModBus !== 'undefined' && device.isVMCDaikinModBus === true) {
        if (DOMINAPLUS_MANAGER_PTR_thermoStatusEventHandler !== null) {
          var eventInfo = {};
          eventInfo.eventType = 'daikinmode';
          eventInfo.id        = parameters[1];
          eventInfo.mode      = parameters[2];
          eventInfo.device    = device;
          DOMINAPLUS_MANAGER_PTR_thermoStatusEventHandler(eventInfo);
        }
      }
    }
  }

  else if (parameters[0] === 'TAF') { // THERMOSTAT ANTI FREEZING	
    // NOP				
  }

  else if (parameters[0] === 'TK') { // THERMOSTAT KEYBOARD LOCK
    if (DOMINAPLUS_MANAGER_PTR_thermoStatusEventHandler !== null) {
      var eventInfo = {};
      eventInfo.eventType    = 'thermostatkeyboardlock';
      eventInfo.id           = parameters[1];
      eventInfo.keyboardLock = parameters[2];
      eventInfo.deviceList   = DOMINAPLUS_MANAGER_deviceList;
      DOMINAPLUS_MANAGER_PTR_thermoStatusEventHandler(eventInfo);
    }
  }

  else if (parameters[0] === 'TL' && !isTS01) { // THERMOSTAT FAN LEVEL
    var mapCommand = false;
    if (DOMINAPLUS_MANAGER_PTR_getMapCommand !== null) {
      mapCommand = DOMINAPLUS_MANAGER_PTR_getMapCommand(parameters[1], 4);
    }
    if (mapCommand !== false) {
      if (DOMINAPLUS_MANAGER_PTR_thermoStatusEventHandler !== null) {
        var eventInfo = {};
        eventInfo.eventType            = 'thermostatfanlevel';
        eventInfo.id                   = mapCommand.deviceId;
        eventInfo.fanLevel             = parameters[2];
        eventInfo.isGeneratedByMapMode = true;
        eventInfo.deviceList           = DOMINAPLUS_MANAGER_deviceList;
        DOMINAPLUS_MANAGER_PTR_thermoStatusEventHandler(eventInfo);
      }
    }
  }

  else if (parameters[0] === 'TLO' && !isTS01) { // THERMOSTAT LOCAL OFF
    var mapCommand = false;
    if (DOMINAPLUS_MANAGER_PTR_getMapCommand !== null) {
      mapCommand = DOMINAPLUS_MANAGER_PTR_getMapCommand(parameters[1], 4);
    }
    if (mapCommand !== false) {
      if (DOMINAPLUS_MANAGER_PTR_thermoStatusEventHandler !== null) {
        var eventInfo = {};
        eventInfo.eventType            = 'thermostatlocaloff';
        eventInfo.id                   = mapCommand.deviceId;
        eventInfo.localOFF             = parseInt(parameters[2]) === 0 ? 1 : 0;
        eventInfo.isGeneratedByMapMode = true;
        eventInfo.deviceList           = DOMINAPLUS_MANAGER_deviceList;
        DOMINAPLUS_MANAGER_PTR_thermoStatusEventHandler(eventInfo);
      }
    }
  }

  else if (parameters[0] === 'TM') { // THERMOSTAT MODE
    if (DOMINAPLUS_MANAGER_PTR_thermoStatusEventHandler !== null) {
      var eventInfo = {};
      eventInfo.eventType  = 'thermostatmode';
      eventInfo.id         = parameters[1];
      eventInfo.mode       = parameters[2];
      eventInfo.deviceList = DOMINAPLUS_MANAGER_deviceList;
      DOMINAPLUS_MANAGER_PTR_thermoStatusEventHandler(eventInfo);
    }
  }

  else if (parameters[0] === 'TO' && !isTS01) { // THERMOSTAT OFFSET
    var mapCommand = false;
    if (DOMINAPLUS_MANAGER_PTR_getMapCommand !== null) {
      mapCommand = DOMINAPLUS_MANAGER_PTR_getMapCommand(parameters[1], 4);
    }
    if (mapCommand !== false) {
      if (DOMINAPLUS_MANAGER_PTR_thermoStatusEventHandler !== null) {
        var eventInfo = {};
        eventInfo.eventType  = 'thermostatoffset';
        eventInfo.id         = mapCommand.deviceId;
        eventInfo.offSet     = parameters[2];
        eventInfo.deviceList = DOMINAPLUS_MANAGER_deviceList;
        DOMINAPLUS_MANAGER_PTR_thermoStatusEventHandler(eventInfo);
      }
    }
  }

  else if (parameters[0] === 'TP') { // THERMOSTAT SET POINT
    if (DOMINAPLUS_MANAGER_PTR_thermoStatusEventHandler !== null) {
      var eventInfo = {};
      eventInfo.eventType  = 'thermostatsetpoint';
      eventInfo.id         = parameters[1];
      eventInfo.setPoint   = parameters[2];
      eventInfo.deviceList = DOMINAPLUS_MANAGER_deviceList;
      DOMINAPLUS_MANAGER_PTR_thermoStatusEventHandler(eventInfo);
    }
  }

  else if (parameters[0] === 'TS' && !isTS01) { // THERMOSTAT SEASON
    var mapCommand = false;
    if (DOMINAPLUS_MANAGER_PTR_getMapCommand !== null) {
      mapCommand = DOMINAPLUS_MANAGER_PTR_getMapCommand(parameters[1], 4);
    }
    if (mapCommand !== false) {
      if (DOMINAPLUS_MANAGER_PTR_thermoStatusEventHandler !== null) {
        var eventInfo = {};
        eventInfo.eventType            = 'thermostatseason';
        eventInfo.id                   = mapCommand.deviceId;
        eventInfo.season               = parameters[2];
        eventInfo.isGeneratedByMapMode = true;
        eventInfo.deviceList           = DOMINAPLUS_MANAGER_deviceList;
        DOMINAPLUS_MANAGER_PTR_thermoStatusEventHandler(eventInfo);
      }
    }
  }

  else if (parameters[0] === 'TT' && !isTS01) { // THERMOSTAT TEMPERATURE
    var mapCommand = false;
    if (DOMINAPLUS_MANAGER_PTR_getMapCommand !== null) {
      mapCommand = DOMINAPLUS_MANAGER_PTR_getMapCommand(parameters[1], 4);
    }
    if (mapCommand !== false) {
      if (DOMINAPLUS_MANAGER_PTR_thermoStatusEventHandler !== null) {
        var eventInfo = {};
        eventInfo.eventType   = 'thermostattemperature';
        eventInfo.id          = mapCommand.deviceId;
        eventInfo.temperature = parameters[2];
        eventInfo.deviceList  = DOMINAPLUS_MANAGER_deviceList;
        DOMINAPLUS_MANAGER_PTR_thermoStatusEventHandler(eventInfo);
      }
    }
  }

  else if (parameters[0] === 'TW') { // THERMOSTAT WINDOW STATE
    if (DOMINAPLUS_MANAGER_PTR_thermoStatusEventHandler !== null) {
      var eventInfo = {};
      eventInfo.eventType   = 'thermostatwindowstate';
      eventInfo.id          = parameters[1];
      eventInfo.windowState = parameters[2];
      eventInfo.deviceList  = DOMINAPLUS_MANAGER_deviceList;
      DOMINAPLUS_MANAGER_PTR_thermoStatusEventHandler(eventInfo);
    }
  }

  else if (parameters[0] === 'UMI') { // HUMIDITY PROBE
    if (DOMINAPLUS_MANAGER_PTR_thermoStatusEventHandler !== null) {
      DOMINAPLUS_MANAGER_UPD_UMI_ACK = true;
      var eventInfo = {};
      eventInfo.eventType                   = 'humidityprobe';
      eventInfo.id                          = parameters[1];
      eventInfo.humidityValue               = parseInt(parameters[2]);
      eventInfo.humidityThresholdL          = parseInt(parameters[3]);
      eventInfo.humidityThresholdM          = parseInt(parameters[4]);
      eventInfo.humidityThresholdH          = parseInt(parameters[5]);
      eventInfo.humidityHysteresis          = parseInt(parameters[6]);
      eventInfo.humidityStatusDehumificator = parseInt(parameters[7]);
      eventInfo.humidityStatusValve         = parseInt(parameters[8]);
      eventInfo.humidityStatusGeneralPump   = parseInt(parameters[9]);
      eventInfo.humidityAlarm               = parseInt(parameters[10]);
      eventInfo.deviceList                  = DOMINAPLUS_MANAGER_deviceList;
      DOMINAPLUS_MANAGER_PTR_thermoStatusEventHandler(eventInfo);
      if (typeof humidityWaitForUPD_UMI_ACK === 'function') {
        humidityWaitForUPD_UMI_ACK(parameters[1], parameters[3], parameters[4], parameters[5]);
      }
    }
  }

  else if (parameters[0] === 'S') { // TUTONDO
    if (DOMINAPLUS_MANAGER_PTR_audioAreaZonesStatusEventHandler !== null) {
      DOMINAPLUS_MANAGER_PTR_audioAreaZonesStatusEventHandler(parameters, 'tutondo', null);
    }
  }

  else if (parameters[0] === 'VI') { // VIVALDI
    for (var i = 0; i < DOMINAPLUS_MANAGER_deviceList.length; i++) {
      if (typeof DOMINAPLUS_MANAGER_deviceList[i].vivaldiID !== 'undefined' && parseInt(DOMINAPLUS_MANAGER_deviceList[i].vivaldiID) === parseInt(parameters[1])) {
        if (DOMINAPLUS_MANAGER_PTR_audioAreaZonesStatusEventHandler !== null) {
          DOMINAPLUS_MANAGER_PTR_audioAreaZonesStatusEventHandler(parameters, 'vivaldi', DOMINAPLUS_MANAGER_deviceList[i]);
        }
      }
    }
  }

  else if (parameters[0] === 'WS') { // VER209 WANDA
    var deviceType   = parseInt(parameters[1]);
    var deviceID     = parseInt(parameters[2]);
    var deviceStatus = parseInt(parameters[3]);
    if (isTS01) {
      if (deviceType === 12) {
        if (DOMINAPLUS_MANAGER_PTR_asynchronousAntitheftStatusChangeArrived !== null) {
          DOMINAPLUS_MANAGER_PTR_asynchronousAntitheftStatusChangeArrived(2, parameters);
        }
      } else if (deviceType === 13) {
        if (DOMINAPLUS_MANAGER_PTR_asynchronousAntitheftStatusChangeArrived !== null) {
          DOMINAPLUS_MANAGER_PTR_asynchronousAntitheftStatusChangeArrived(1, parameters);
        }
      }
    } else {
      if (deviceType === 1 || deviceType === 2 || deviceType === 22 || deviceType === 9 || deviceType === 3 || deviceType === 16 || deviceType === 19 || deviceType === 6) { // Limited to [Lighting / Energy / Shutters / Scenarios] for security reasons --- VER228 WANDA
        for (var i = 0; i < DOMINAPLUS_MANAGER_deviceList.length; i++) {
          if (typeof DOMINAPLUS_MANAGER_deviceList[i].id !== 'undefined' && typeof DOMINAPLUS_MANAGER_deviceList[i].type !== 'undefined' && parseInt(DOMINAPLUS_MANAGER_deviceList[i].id) === deviceID && parseInt(DOMINAPLUS_MANAGER_deviceList[i].type) === deviceType) {
            DOMINAPLUS_MANAGER_deviceList[i].currentVal = deviceStatus;
          }
        }
      }
    }
    if (DOMINAPLUS_MANAGER_PTR_commandUPDWScompleted !== null) {
      DOMINAPLUS_MANAGER_PTR_commandUPDWScompleted(parameters);
    }
  }

  else if (parameters[0] === 'A' || parameters[0] === 'CS1' || parameters[0] === 'CS2' || parameters[0] === 'CS3') { // ALARM
    var command      = parameters[0];
    var deviceID     = parseInt(parameters[1]);
    var deviceStatus = parseInt(parameters[2]);
    if (isTS01 && (command === 'CS2' || command === 'CS3')) {
      deviceID = deviceID + 100000;
    }
    if (deviceStatus === 1) { // In alarm
      if (DOMINAPLUS_MANAGER_PTR_manageCS1CS2CS3 !== null) {
        DOMINAPLUS_MANAGER_PTR_manageCS1CS2CS3(command.toLowerCase(), deviceID, 'ADD');
      }
      if (isTS01) {
        if (DOMINAPLUS_MANAGER_PTR_getPopUpAlarm !== null) {
          DOMINAPLUS_MANAGER_PTR_getPopUpAlarm(null, deviceID, command.toLowerCase()); // VER198 WANDA
        }
      }
    } else {
      if (DOMINAPLUS_MANAGER_PTR_manageCS1CS2CS3 !== null) {
        DOMINAPLUS_MANAGER_PTR_manageCS1CS2CS3(command.toLowerCase(), deviceID, 'REMOVE');
      }
    }
    if (DOMINAPLUS_MANAGER_PTR_manageCallingSystemUPD !== null) {
      DOMINAPLUS_MANAGER_PTR_manageCallingSystemUPD(parameters, command.toLowerCase(), deviceID, deviceStatus);
    }
  }

  else if (parameters[0] === 'X' && parameters[1] === 'A') { // ANTITHEFT AREA
    if (DOMINAPLUS_MANAGER_PTR_antitheftUPDAreasEventHandler !== null) {
      DOMINAPLUS_MANAGER_PTR_antitheftUPDAreasEventHandler(parameters);
    }
  }

  else if (parameters[0] === 'X' && parameters[1] === 'S') { // ANTITHEFT SENSOR
    // NOP --- DANGEROUS since it floods the websocket
  }

  else if (parameters[0] === 'X' && parameters[1] === 'U') { // ANTITHEFT UNIT
    console.log('%c' + DOMINAPLUS_MANAGER_PREFIX + 'XU - engaged: ' + parameters[2], 'color: ' + DOMINAPLUS_MANAGER_CONSOLE_COLOR);
    if (isTS01) {
      if (DOMINAPLUS_MANAGER_PTR_manageUPD_XU !== null) {
        DOMINAPLUS_MANAGER_PTR_manageUPD_XU();
      }
    }
  }

  else if (parameters[0] === 'D' && !isTS01) { // DEVICE ICON
    var commandID     = parameters[1];
    var currentIconID = parameters[2];
    if (DOMINAPLUS_MANAGER_PTR_manageUPDD !== null) {
      DOMINAPLUS_MANAGER_PTR_manageUPDD(commandID, currentIconID);
    }
    for (var i = 0; i < DOMINAPLUS_MANAGER_areaList.length; i++) {
      if (typeof DOMINAPLUS_MANAGER_areaList[i].mapcommands !== 'undefined') {
        for (var j = 0; j < DOMINAPLUS_MANAGER_areaList[i].mapcommands.length; j++) {
          if (typeof DOMINAPLUS_MANAGER_areaList[i].mapcommands[j].commandId !== 'undefined' && parseInt(DOMINAPLUS_MANAGER_areaList[i].mapcommands[j].commandId) === parseInt(commandID)) {
            if (typeof DOMINAPLUS_MANAGER_areaList[i].mapcommands[j].icoc !== 'undefined') {
              if (parseInt(currentIconID) === 0) {
                if (typeof DOMINAPLUS_MANAGER_areaList[i].mapcommands[j].icod !== 'undefined') {
                  DOMINAPLUS_MANAGER_areaList[i].mapcommands[j].icoc = DOMINAPLUS_MANAGER_areaList[i].mapcommands[j].icod;
                }
              } else {
                DOMINAPLUS_MANAGER_areaList[i].mapcommands[j].icoc = currentIconID;
              }
            }
          }
        }
      }
    }
  }

  else if (parameters[0] === 'abl') { // ABANO --- VER192 WANDA
    if (DOMINAPLUS_MANAGER_PTR_thermoStatusEventHandler !== null) {
      var eventInfo = {};
      eventInfo.eventType        = 'abanovalue';
      eventInfo.id               = parameters[1];
      eventInfo.ValoreConvertito = parameters[3];
      eventInfo.UnitaMisura      = parameters[5].trim();
      eventInfo.deviceList       = DOMINAPLUS_MANAGER_deviceList;
      DOMINAPLUS_MANAGER_PTR_thermoStatusEventHandler(eventInfo);
      if (typeof gestioneUPD_ABL === 'function') {
        gestioneUPD_ABL(parameters);
      }
    }
  }

  else if (parameters[0] == 'LL' && !isTS01) {
    if (DOMINAPLUS_MANAGER_PTR_manageCommandUPDLL !== null) {
      DOMINAPLUS_MANAGER_PTR_manageCommandUPDLL(parameters[1], parameters[2]);
    }
  }

  else if (parameters[0] === 'SRE') {
    if (DOMINAPLUS_MANAGER_PTR_manageCommandsSREandSTO !== null) {
      DOMINAPLUS_MANAGER_PTR_manageCommandsSREandSTO(false);
    }
  }

  else if (parameters[0] === 'STO') {
    if (DOMINAPLUS_MANAGER_PTR_manageCommandsSREandSTO !== null) {
      DOMINAPLUS_MANAGER_PTR_manageCommandsSREandSTO(true);
    }
  }

  else if (parameters[0] === 'RGB') {
    if (DOMINAPLUS_MANAGER_PTR_rgbWheelStatusEventHandler !== null) {
      DOMINAPLUS_MANAGER_PTR_rgbWheelStatusEventHandler(parameters);
    }
  }

  else if (parameters[0] == 'GRP') { // VER208 WANDA
    if (parameters.length >= 3) {
      var dimmerAddressesAndValues = parameters[2].split('|');
      for (var i = 0; i < dimmerAddressesAndValues.length; i++) {
        var deviceID       = 0;
        var currentAddress = dimmerAddressesAndValues[i].split('_')[0];
        var currentValue   = dimmerAddressesAndValues[i].split('_')[1];
        for (var j = 0; j < DOMINAPLUS_MANAGER_deviceList.length; j++) {
          if (typeof DOMINAPLUS_MANAGER_deviceList[j].avebus_address !== 'undefined' && parseInt(DOMINAPLUS_MANAGER_deviceList[j].avebus_address, 10) === parseInt(currentAddress, 10)) {
            if (typeof DOMINAPLUS_MANAGER_deviceList[j].id !== 'undefined') {
              deviceID = DOMINAPLUS_MANAGER_deviceList[j].id;
            }
            DOMINAPLUS_MANAGER_deviceList[j].currentVal = currentValue;
            break;
          }
        }
        if (DOMINAPLUS_MANAGER_PTR_commandGRPcompleted !== null) {
          DOMINAPLUS_MANAGER_PTR_commandGRPcompleted(deviceID, currentValue);
        }
      }
    }
  }

  else if (parameters[0] === 'epv') { // VER252 WANDA
    DOMINAPLUS_MANAGER_economizerValues[0] = parseInt(parameters[2]);
    DOMINAPLUS_MANAGER_economizerValues[1] = parseInt(parameters[3]);
    DOMINAPLUS_MANAGER_economizerValues[2] = parseInt(parameters[4]);
    if (typeof SETTINGS_CONSUMPTIONS_manageEPV === 'function') {
      SETTINGS_CONSUMPTIONS_manageEPV();
    }
  }

  // HOTEL
  else if (parameters[0] === 'htl') { // VER274 WANDA + LORENZO
    if (parameters.length >= 4) {
      var infoEvent         = parseInt(parameters[1]);
      var infoFamilyAddress = parseInt(parameters[2]);
      var argLen            = parseInt(parameters[3]);
      var envIndex          = -1;
      for (var i = 0; i < DOMINAPLUS_MANAGER_areaList.length; i++) {
        if (typeof DOMINAPLUS_MANAGER_areaList[i].id !== 'undefined' && typeof DOMINAPLUS_MANAGER_areaList[i].hotelConfiguration !== 'undefined' && typeof DOMINAPLUS_MANAGER_areaList[i].hotelConfiguration.avebus_addr !== 'undefined' && typeof DOMINAPLUS_MANAGER_areaList[i].hotelRooms !== 'undefined') {
          if (DOMINAPLUS_MANAGER_areaList[i].hotelConfiguration.avebus_addr !== 0 && DOMINAPLUS_MANAGER_areaList[i].hotelConfiguration.avebus_addr === infoFamilyAddress) {
            envIndex = i;
            break;
          }
        }
      }
      if (infoEvent == 40) {
        if (argLen > 0 && parameters.length === 5) {
          var args      = parameters[4];
          var argsArray = args.split('|');
          if (argsArray.length === 6) {
            if (envIndex !== -1) {
              var event       = parseInt(argsArray[0]);
              var UABC        = argsArray[1];
              var cardType    = parseInt(argsArray[2]);
              var cardPresent = argsArray[3] === '1';
              var dnd         = argsArray[4] === '1';
              var mkr         = argsArray[5] === '1';
              switch (event) {
                case 1: // READER_AVE_CARD_LOCALLY_ACCEPTED_EVENT
                  if (UABC.toUpperCase() === '002C') {
                    DOMINAPLUS_MANAGER_areaList[envIndex].hotelRooms.room_cards_present = true;
                    DOMINAPLUS_MANAGER_areaList[envIndex].hotelRooms.room_last_card_type = cardType;
                    DOMINAPLUS_MANAGER_areaList[envIndex].hotelRooms.room_guest_present = (cardType === 1 || cardType === 5); // cliente o supercliente
                  }
                  break;
  
                case 2:   // READER_AVE_CARD_LOCALLY_REFUSED_DUE_WRONG_DATA_EVENT
                case 3:   // READER_AVE_CARD_EXTRACTED_EVENT
                case 5:   // READER_NOT_AVE_CARD_REFUSED_EVENT
                case 6:   // READER_NOT_AVE_CARD_EXTRACTED_EVENT
                case 50:  // READER_AVE_CARD_LOCALLY_REFUSED_DUE_OUT_OF_TIME_EVENT
                case 51:  // READER_AVE_CARD_LOCALLY_REFUSED_DUE_CLIENT_PRESENCE_EVENT
                case 52:  // READER_AVE_CARD_LOCALLY_REFUSED_DUE_CREDIT_EXHAUSTED_EVENT
                case 53:  // READER_AVE_CARD_LOCALLY_REFUSED_DUE_FAILURE_WRITING_EVENT
                case 54:  // READER_AVE_CARD_LOCALLY_REFUSED_DUE_TIME_OUT_SUPERVISOR_RESP_EVENT
                case 55:  // READER_AVE_CARD_LOCALLY_REFUSED_DUE_BLACKLIST_EVENT
                case 102: // READER_AVE_CARD_SUPERVISOR_REFUSED_DUE_WRONG_DATA_EVENT
                case 103: // READER_AVE_CARD_SUPERVISOR_REFUSED_DUE_BLACKLIST_EVENT
                case 104: // READER_AVE_CARD_SUPERVISOR_REFUSED_DUE_OUT_OF_TIME_EVENT_EVENT
                case 105: // READER_AVE_CARD_SUPERVISOR_REFUSED_DUE_OUT_OF_TIME_SLOT_EVENT
                case 106: // READER_AVE_CARD_SUPERVISOR_REFUSED_DUE_CREDIT_EXHAUSTED_EVENT
                  if (cardPresent) {
                    DOMINAPLUS_MANAGER_areaList[envIndex].hotelRooms.room_cards_present = true;
                    DOMINAPLUS_MANAGER_areaList[envIndex].hotelRooms.room_guest_present = (cardType === 1 || cardType === 5); // cliente o supercliente
                    DOMINAPLUS_MANAGER_areaList[envIndex].hotelRooms.room_dnd = dnd;
                  } else {
                    DOMINAPLUS_MANAGER_areaList[envIndex].hotelRooms.room_cards_present = false;
                    DOMINAPLUS_MANAGER_areaList[envIndex].hotelRooms.room_last_card_type = 0;
                    DOMINAPLUS_MANAGER_areaList[envIndex].hotelRooms.room_guest_present = false;
                    DOMINAPLUS_MANAGER_areaList[envIndex].hotelRooms.room_dnd = false;
                  }
                  break;
  
                case 7: // READER_DO_NOT_DISTURB_ON_EVENT
                  DOMINAPLUS_MANAGER_areaList[envIndex].hotelRooms.room_dnd = true;
                  DOMINAPLUS_MANAGER_areaList[envIndex].hotelRooms.room_mkr = false;
                  break;
  
                case 8: // READER_DO_NOT_DISTURB_OFF_EVENT
                  DOMINAPLUS_MANAGER_areaList[envIndex].hotelRooms.room_dnd = false;
                  DOMINAPLUS_MANAGER_areaList[envIndex].hotelRooms.room_mkr = false;
                  break;
  
                case 9: // READER_MAKE_UP_ROOM_ON_EVENT
                  DOMINAPLUS_MANAGER_areaList[envIndex].hotelRooms.room_dnd = false;
                  DOMINAPLUS_MANAGER_areaList[envIndex].hotelRooms.room_mkr = true;
                  break;
  
                case 10: // READER_MAKE_UP_ROOM_OFF_EVENT
                  DOMINAPLUS_MANAGER_areaList[envIndex].hotelRooms.room_dnd = false;
                  DOMINAPLUS_MANAGER_areaList[envIndex].hotelRooms.room_mkr = false;
                  break;
              }
            }
          }
        }
      }
      // PRE-CHECKIN
      else if (infoEvent == 41) {
        if (envIndex !== -1) {
          DOMINAPLUS_MANAGER_areaList[envIndex].hotelRooms.room_state = 10;
        }
      }
      // CHECKOUT
      else if (infoEvent == 42) {
        if (envIndex !== -1) {
          DOMINAPLUS_MANAGER_areaList[envIndex].hotelRooms.room_state = 0;
        }
      }
      // CARD CREATED
      else if (infoEvent == 43) {
        if (envIndex !== -1) {
          DOMINAPLUS_MANAGER_areaList[envIndex].hotelRooms.room_state = 20;
        }
      }
      // KEYCODE CREATED
      else if (infoEvent == 44) {
        if (envIndex !== -1) {
          DOMINAPLUS_MANAGER_areaList[envIndex].hotelRooms.room_state = 20;
        }
      }
      if (DOMINAPLUS_MANAGER_PTR_manageCommandUPDHTL !== null) {
        DOMINAPLUS_MANAGER_PTR_manageCommandUPDHTL(infoEvent, infoFamilyAddress);
      }
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages the response to the LDI command (LIST DEVICES BY ID). It requests a list of every device in the plant
 * @param {object} records - array of arrays containing the response data for every device
 ** [0][0]: the id of the device;
 ** [0][1]: the name of the device;
 ** [0][2]: the family of the device;
 ** [0][3]: maps in which the map command relative to the device is present
 * @version VER250 - WANDA
 */
function DOMINAPLUS_MANAGER_manageLDI(records)
{
  if (!DOMINAPLUS_MANAGER_isLoadedLDI) {
    var insertInDB      = null;
    var requestLI2      = false;
    var requestWS13     = false;
    var economizerFound = false;
    for (var i = 0; i < records.length; i++) {
      var deviceID     = records[i][0];
      var deviceName   = records[i][1];
      var deviceFamily = records[i][2];
      var deviceMaps   = records[i][3];
      // CHECKING WHEN TO ADD IN DATABASE - VER210 WANDA
      if ((!isTS01 && visibleAreas === '') || isTS01) {
        insertInDB = true;
      }
      if ((!isTS01 && visibleAreas !== '') || (isTS01 && isTS01CustomMode)) {
        insertInDB = false;
        if (deviceMaps !== '') {
          var deviceMapsArray = deviceMaps.split(';');
          for (var j = 0; j < deviceMapsArray.length; j++) {
            if (visibleAreas.indexOf(',' + deviceMapsArray[j] + ',') > -1) {
              insertInDB = true;
            }
          }
        }
      }
      if (isTS01 && isTS01Alb) {
        if (parseInt(deviceID) === 1007 || parseInt(deviceID) === 1009 || parseInt(deviceID) === 1010 || parseInt(deviceID) === 1011) {
          insertInDB = false;
        }
      }
      // CREATING DEVICE OBJECT
      if (insertInDB === true) {
        var device = new Object();
        device.id      = deviceID;
        device.name    = deviceName;
        device.type    = deviceFamily;
        device.typeApp = device.type;
        device.maps    = deviceMaps;
        // RGBW & DALI CASE
        if (device.name[0] === '$') {
          device.isRGBW = true;
        }
        if (device.name[device.name.length - 1] === '$') {
          device.isDALI = true;
        }
        // LIGHTING
        if (device.typeApp === '2' || device.typeApp === '22') {
          device.typeApp = '1';
        }
        if (device.typeApp === '1' && isTS01 && isTS01Alb && (device.id >= 400 && device.id < 500)) {
          if (DOMINAPLUS_MANAGER_PTR_addDoorOpeningButton !== null) {
            DOMINAPLUS_MANAGER_PTR_addDoorOpeningButton();
          }
        }
        // SHUTTER
        if (device.typeApp == '16' || device.typeApp == '19') {
          device.typeApp = '3';
        }
        // LIGHTING & DIMMER & P3000_AREA & AUDIO AREA
        if (device.type === '1' || device.type === '2' || device.type === '12' || (!isTS01 && device.type === '14') || device.type === '5') { // VER289 WANDA
          requestLI2 = true;
        }
        // THERMOSTAT
        if (device.type === '4') {
          device.temperature      = 0;
          device.setPoint         = 0;
          device.offSet           = 0;
          device.fanLevel         = 0;
          device.season           = 0;
          device.mode             = 0;
          device.localOFF         = 0;
          device.windowVisibility = 0;
          device.windowState      = 0;
          device.keyboardLock     = 0;
          device.configuration    = 0;
          device.antifreeze       = 0;
          DOMINAPLUS_MANAGER_sendWSCommand('WTS', device.id, '');
          if (!isTS01) {
            DOMINAPLUS_MANAGER_fixToIdentifyTS01VirtualThermostats(device);
          }
        }
        // DIMMER
        if (device.type === '2') {
          device.touchByUser = false;
        }
        // VMCDAIKINMODBUS
        if (device.type === '4' && parseInt(device.id) > 10000000) {
          device.isVMCDaikinModBus = true;
          device.id                = '' + (parseInt(device.id) - 10000000);
          device.isOn              = 0; // VER196 WANDA
          device.fanspeed          = 0; // VER196 WANDA
        }
        // ECO
        if (device.type === '5') {
          economizerFound = true;
        }
        // P3000_SENSOR
        if (isTS01 && device.type === '13') {
          requestWS13 = true;
        }
        // ABANO
        if (device.type === '17' && parseInt(device.id) > 10000) {
          device.linkedid         = parseInt(device.id) % 10000;
          device.id               = parseInt(parseInt(device.id) / 10000);
          device.ValoreConvertito = '- -'; // VER196 WANDA
          device.UnitaMisura      = '';    // VER196 WANDA
        }
        // VIVALDI
        if (device.name.length > 5) {
          if (device.type === '14' && device.name.substr(0, 5) === '_VIV_') {
            var temporaryName = device.name.substr(5);
            device.vivaldiID = temporaryName.substr(0, temporaryName.indexOf('_'));
            device.name      = temporaryName.substr(temporaryName.indexOf('_') + 1);
          }
        }
        DOMINAPLUS_MANAGER_deviceList.push(device);
        if (DOMINAPLUS_MANAGER_PTR_addHTMLtoDeviceType !== null) {
          DOMINAPLUS_MANAGER_PTR_addHTMLtoDeviceType(device);
        }
      }
    }
    // LINKEDID
    for (var i = 0; i < DOMINAPLUS_MANAGER_deviceList.length; i++) {
      if (typeof DOMINAPLUS_MANAGER_deviceList[i].type !== 'undefined' && DOMINAPLUS_MANAGER_deviceList[i].type === '17') {
        if (typeof DOMINAPLUS_MANAGER_deviceList[i].id !== 'undefined' && typeof DOMINAPLUS_MANAGER_deviceList[i].linkedid !== 'undefined') {
          var temporaryDevice = false;
          if (DOMINAPLUS_MANAGER_PTR_getDevice !== null) {
            temporaryDevice = DOMINAPLUS_MANAGER_PTR_getDevice(parseInt(DOMINAPLUS_MANAGER_deviceList[i].linkedid));
          }
          if (temporaryDevice !== false) {
            if (typeof temporaryDevice.linkedid === 'undefined' || temporaryDevice.linkedid === null) {
              temporaryDevice.linkedid = [parseInt(DOMINAPLUS_MANAGER_deviceList[i].id)];
            } else {
              temporaryDevice.linkedid.push(DOMINAPLUS_MANAGER_deviceList[i].id);
            }
          }
        }
      }
    }
    // SCENARIOS
    if (DOMINAPLUS_MANAGER_deviceList.filter(function (element) { return (typeof element.typeApp !== 'undefined' && parseInt(element.typeApp) === 6); }).length > 0) {
      if (DOMINAPLUS_MANAGER_PTR_setGeolocalScenarioURLs !== null) {
        DOMINAPLUS_MANAGER_PTR_setGeolocalScenarioURLs();
      }
    }
    DOMINAPLUS_MANAGER_sendWSCommand('GTM'); // Richiede l'elenco dei termostati con infrarossi associati con il trucco 10/20/30000
    DOMINAPLUS_MANAGER_sendWSCommand('GMA'); // Richiede l'elenco dei dispositivi Marcia + Arresto
    DOMINAPLUS_MANAGER_sendWSCommand('GNA'); // Richiede l'elenco dei dispositivi con 'Nessuna Azione' (Luci + Prese comandate)
    DOMINAPLUS_MANAGER_isLoadedLDI = true;
    if (isTS01 && !isTS01CustomMode4) {
      if (requestWS13 === true) {
        DOMINAPLUS_MANAGER_sendWSCommand('WSF', '13');
      }
    }
		if (requestLI2 === true && (typeof isTS01CustomMode4 == 'undefined' || isTS01CustomMode4 == false)) {
			DOMINAPLUS_MANAGER_sendWSCommand('LI2');
		}
    DOMINAPLUS_MANAGER_refreshThermostatsStatuses(); // VER192G WANDA
    /* VER192 WANDA */
    if (DOMINAPLUS_MANAGER_PTR_commandLDIcompleted !== null) {
      DOMINAPLUS_MANAGER_PTR_commandLDIcompleted(economizerFound);
    }
    /* ----------- */
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Refreshes thermostats statuses
 * @version VER277 - WANDA
 */
function DOMINAPLUS_MANAGER_refreshThermostatsStatuses()
{
  console.log('%c' + DOMINAPLUS_MANAGER_PREFIX + '--- THERMO REFRESH PROCEDURE (LAP ' + (DOMINAPLUS_MANAGER_thermoStatusRetrievesCounter + 1) + '/' + DOMINAPLUS_MANAGER_numberOfInitialThermoRefresh + ') ---', 'color: ' + DOMINAPLUS_MANAGER_CONSOLE_COLOR);
  var bNeedRefresh = false;
  for (var i = 0; i < DOMINAPLUS_MANAGER_deviceList.length; i++) {
    if (typeof DOMINAPLUS_MANAGER_deviceList[i].type !== 'undefined' && parseInt(DOMINAPLUS_MANAGER_deviceList[i].type) === 4) {
      if (typeof DOMINAPLUS_MANAGER_deviceList[i].name !== 'undefined' && DOMINAPLUS_MANAGER_deviceList[i].name[DOMINAPLUS_MANAGER_deviceList[i].name.length - 1] !== '*') {
        bNeedRefresh = true;
        break;
      }
    }
  }
  if (bNeedRefresh) {
    var thermoCounter = 0;
    for (var i = 0; i < DOMINAPLUS_MANAGER_deviceList.length; i++) {
      if (typeof DOMINAPLUS_MANAGER_deviceList[i].type !== 'undefined' && parseInt(DOMINAPLUS_MANAGER_deviceList[i].type) === 4) {
        if (DOMINAPLUS_MANAGER_webSocketInstance.WEBSOCKET_isWebSocketReadyToTransmit()) { // VER277
          if (typeof DOMINAPLUS_MANAGER_deviceList[i].id !== 'undefined' && typeof DOMINAPLUS_MANAGER_deviceList[i].name !== 'undefined') {
            if (DOMINAPLUS_MANAGER_deviceList[i].name[DOMINAPLUS_MANAGER_deviceList[i].name.length - 1] !== '*') {
              thermoCounter++;
              var retrieveCommandString = 'console.log("%c' + DOMINAPLUS_MANAGER_PREFIX + 'Refresh thermo ' + thermoCounter + ' [id=' + DOMINAPLUS_MANAGER_deviceList[i].id + ']: ' + DOMINAPLUS_MANAGER_deviceList[i].name + '", "color: ' + DOMINAPLUS_MANAGER_CONSOLE_COLOR + '");';
              retrieveCommandString += 'DOMINAPLUS_MANAGER_sendWSCommand("WTS", ' + DOMINAPLUS_MANAGER_deviceList[i].id + ', "")';
              setTimeout(retrieveCommandString, thermoCounter * 250);
            }
          }
        }
      }
    }
    DOMINAPLUS_MANAGER_thermoStatusRetrievesCounter++;
    if (DOMINAPLUS_MANAGER_thermoStatusRetrievesCounter < DOMINAPLUS_MANAGER_numberOfInitialThermoRefresh) {
      DOMINAPLUS_MANAGER_sendWSCommand('GTM'); // VER230 WANDA
      setTimeout(function () { DOMINAPLUS_MANAGER_refreshThermostatsStatuses(); }, 15000);
    } else {
      console.log('%c' + DOMINAPLUS_MANAGER_PREFIX + '--- THERMO REFRESH PROCEDURE REACHED MAX REFRESH ATTEMPTS COUNTER (' + DOMINAPLUS_MANAGER_numberOfInitialThermoRefresh + ') ---', 'color: ' + DOMINAPLUS_MANAGER_CONSOLE_COLOR);
    }
  } else {
    console.log('%c' + DOMINAPLUS_MANAGER_PREFIX + '--- THERMO REFRESH PROCEDURE NO LONGER NEEDED (ALL THERMOSTATS RECOGNIZED) ---', 'color: ' + DOMINAPLUS_MANAGER_CONSOLE_COLOR);
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Fix to identify TS01 virtual thermostats
 * @param {object} device - the current device
 * @version VER193 - WANDA
 */
function DOMINAPLUS_MANAGER_fixToIdentifyTS01VirtualThermostats(device)
{
  if (typeof device !== 'undefined' && device !== null) {
    if (typeof device.name !== 'undefined') {
      device.TS01 = false;
      if (device.name.substr(0, 1) === '$' || device.name.substr(0, 9) === 'TS1Server') {
        device.TS01 = true;
      }
      if (device.name.substr(0, 1) === '$') {
        device.name = device.name.substr(1);
      }
      if (device.name.substr(0, 9) === 'TS1Server' && device.name !== 'TS1Server') {
        device.name = device.name.substr(9);
      }
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages the response to the LI2 command
 * @param {object} records - array of arrays containing the response data
 * @version VER256 - WANDA
 */
function DOMINAPLUS_MANAGER_manageLI2(records)
{
  for (var i = 0; i < records.length; i++) {
    var device = false;
    if (DOMINAPLUS_MANAGER_PTR_getDevice !== null) {
      device = DOMINAPLUS_MANAGER_PTR_getDevice(parseInt(records[i][0]));
    }
    if (device !== false) {
      // P3000_AREA
      if (records[i][2] === '12') {
        device.ProgressivoArea = records[i][3];
      }
      // AUDIO AREA
      else if (records[i][2] === '14') {
        console.log('%c' + DOMINAPLUS_MANAGER_PREFIX + records[i][0] + ' - ' + records[i][1] + ' - ' + records[i][2] + ' - ' + records[i][3] + ' - ' + records[i][4], 'color: ' + DOMINAPLUS_MANAGER_CONSOLE_COLOR);
        device.indirizzoAudio = records[i][3];
      }
      // RETRIEVING ALL ADDRESSES
      else {
        device.avebus_address = parseInt(records[i][3]);
        /* VER256 WANDA */ // ECONOMIZER
        if (parseInt(device.type) === 5 && typeof device.avebus_address !== 'undefined') {
          var strEcoAddress = '0' + device.avebus_address.toString('16');
          strEcoAddress = strEcoAddress.substring(strEcoAddress.length - 2);
          var avebusPeripheralType = 8;
          var strUID  = '0000'; // PLACEHOLDER
          var strUABC = '0033';
          if (typeof ECO_setDevice === 'function') {
            ECO_setDevice(strEcoAddress, avebusPeripheralType, strUID, strUABC);
          }
        }
        /* ------------ */
      }
    }
  }
  DOMINAPLUS_MANAGER_updateDeviceCommands();
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages the response to the LMC command (LIST MAP COMMANDS). It requests a list of every map command in a specific map
 * @param {object} parameters - array containing map ID string
 * @param {object} records    - array of arrays containing the response data for every device
 ** [0][0]: the id of the mapcommand;
 ** [0][1]: the name of the mapcommand;
 ** [0][2]: the type of the mapcommand;
 ** [0][3]: the X coordinate of the mapcommand;
 ** [0][4]: the Y coordinate of the mapcommand;
 ** [0][5]: the id of the mapcommand default icon;
 ** [0][6]: the id of the mapcommand icon 1;
 ** [0][7]: the id of the mapcommand icon 2;
 ** [0][8]: the id of the mapcommand icon 3;
 ** [0][9]: the id of the mapcommand icon 4;
 ** [0][10]: the id of the mapcommand icon 5;
 ** [0][11]: the id of the mapcommand icon 6;
 ** [0][12]: the id of the mapcommand icon 7;
 ** [0][13]: the id of the mapcommand current icon;
 ** [0][14]: the commanded device data;
 ** [0][15]: the commanded device family;
 * @version VER230 - WANDA
 */
function DOMINAPLUS_MANAGER_manageLMC(parameters, records)
{
  var area = false;
  if (DOMINAPLUS_MANAGER_PTR_getArea !== null) {
    area = DOMINAPLUS_MANAGER_PTR_getArea(parseInt(parameters));
  }
  if (area !== false) {
    if (typeof area.mapcommands === 'undefined' || area.mapcommands === null) {
      var MCList = new Array();
      for (var i = 0; i < records.length; i++) {
        var MC = new Object();
        MC.commandId    = records[i][0];
        MC.commandName  = records[i][1];
        MC.commandType  = records[i][2];
        MC.commandX     = records[i][3];
        MC.commandY     = records[i][4];
        MC.icod         = records[i][5];
        MC.ico1         = records[i][6];
        MC.ico2         = records[i][7];
        MC.ico3         = records[i][8];
        MC.ico4         = records[i][9];
        MC.ico5         = records[i][10];
        MC.ico6         = records[i][11];
        MC.ico7         = records[i][12];
        MC.icoc         = records[i][13];
        MC.deviceFamily = records[i][15];
        if (MC.deviceFamily === '2') {
          MC.deviceFamilyApp = 1
        } else if (MC.deviceFamily === '16' || MC.deviceFamily === '19') {
          MC.deviceFamilyApp = 3
        } else {
          MC.deviceFamilyApp = parseInt(MC.deviceFamily);
        }
        if (parseInt(MC.commandType) === 0x17) { // 0x17 means LOGIC_COMMAND_HTTP_COMMAND_TYPE (not 0x15 that is FAMILY_HTTP_COMMAND)
          var originalField = MC.commandId;
          MC.commandId = parseInt(parseInt(MC.commandId) / 1000);
          MC.deviceId  = 0;
          if (parseInt((parseInt(originalField) % 1000)) === 1) {
            MC.uriForClient = records[i][14];
          } else {
            MC.uriForClient = '';
          }
        } else {
          MC.deviceId = records[i][14];
        }
        MCList.push(MC);
      }
      area.mapcommands = MCList;
      /* VER192 WANDA */
      if (DOMINAPLUS_MANAGER_PTR_commandLMCcompleted !== null && typeof area.id !== 'undefined' && typeof area.mapcommands !== 'undefined') {
        DOMINAPLUS_MANAGER_PTR_commandLMCcompleted(area.id, area.mapcommands); // VER221 WANDA
      }
      /* ----------- */
    }
  }
  DOMINAPLUS_MANAGER_counterLMC--
  if (DOMINAPLUS_MANAGER_counterLMC === 0) {
    DOMINAPLUS_MANAGER_isLoadedLMC = true;
    if (!isTS01) {
      // Timeouts might not be necessary
      setTimeout('DOMINAPLUS_MANAGER_sendWSCommand("SU2")', 500);
      setTimeout('DOMINAPLUS_MANAGER_sendWSCommand("SU3")', 2000);
      setTimeout('DOMINAPLUS_MANAGER_sendWSCommand("GSF", "12")', 3000);
      setTimeout('DOMINAPLUS_MANAGER_sendWSCommand("WSF", "1")', 1000);
      setTimeout('DOMINAPLUS_MANAGER_sendWSCommand("WSF", "2")', 1500);
      setTimeout('DOMINAPLUS_MANAGER_sendWSCommand("WSF", "22")', 2000);
      setTimeout('DOMINAPLUS_MANAGER_sendWSCommand("WSF", "9")', 2000); // VER220 WANDA
      /* VER228 WANDA */
      setTimeout('DOMINAPLUS_MANAGER_sendWSCommand("WSF", "3")',  2300);
      setTimeout('DOMINAPLUS_MANAGER_sendWSCommand("WSF", "16")', 2600);
      setTimeout('DOMINAPLUS_MANAGER_sendWSCommand("WSF", "19")', 2900);
      setTimeout('DOMINAPLUS_MANAGER_sendWSCommand("WSF", "6")',  3200);
      /* ------------ */
      if (DOMINAPLUS_MANAGER_PTR_LMCisLoaded !== null) {
        DOMINAPLUS_MANAGER_PTR_LMCisLoaded();
      }
    }
  }
  DOMINAPLUS_MANAGER_updateDeviceCommands();
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages the response to the LML command (LIST MAP LABELS). It requests a list of every label in a specific map
 * @param {object} parameters - array containing map ID string
 * @param {object} records    - array of arrays containing the response data for every device
 ** [0][0]: the id of the label;
 ** [0][1]: the color of the label;
 ** [0][2]: the X coordinate of the label;
 ** [0][3]: the Y coordinate of the label;
 ** [0][4]: the font size of the label;
 ** [0][5]: the font weight of the label;
 ** [0][6]: the text of the label;
 * @version VER209 - WANDA
 */
function DOMINAPLUS_MANAGER_manageLML(parameters, records)
{
  var area = false;
  if (DOMINAPLUS_MANAGER_PTR_getArea !== null) {
    area = DOMINAPLUS_MANAGER_PTR_getArea(parseInt(parameters));
  }
  if (area !== false) {
    if (typeof area.maplabels === 'undefined' || area.maplabels === null) {
      var MLList = new Array();
      for (var i = 0; i < records.length; i++) {
        var ML = new Object();
        ML.LabelId                  = records[i][0];
        ML.LabelFontColor           = DOMINAPLUS_MANAGER_decimalToHexString(parseInt(records[i][1])).substr(2);
        ML.LabelX                   = records[i][2];
        ML.LabelY                   = records[i][3];
        ML.LabelFontSize            = records[i][4];
        ML.LabelFontWeight          = records[i][5];
        ML.LabelText                = records[i][6];
        ML.LabelMaxChar             = ML.LabelText.length;
        ML.LabelMapCommandFamilyApp = -1;
        if (parseInt(ML.LabelFontWeight) === 0) {
          ML.LabelFontWeightCSS = 'Normal';
        } else {
          ML.LabelFontWeightCSS = 'Bold';
        }
        if (ML.LabelText.substring(0, 5) === '0001_') { // Label linked to icon (mapcommand)
          var temporaryLabelTextArray = ML.LabelText.split('_');
          ML.LabelMapCommandId = temporaryLabelTextArray[1];
          if (typeof area.mapcommands !== 'undefined') {
            var currentMapCommand = area.mapcommands.filter(function (element) { return (typeof element.commandId !== 'undefined' && parseInt(element.commandId) === parseInt(ML.LabelMapCommandId)); });
            if (currentMapCommand.length > 0) {
              ML.LabelMapCommandFamilyApp = currentMapCommand[0].deviceFamilyApp;
            }
          }
          ML.LabelText = temporaryLabelTextArray.slice(2).join('_');
        } else if (ML.LabelText.substring(0, 5) == '0000_') { // Special labels (thermostat / abano)
          ML.LabelMapCommandFamilyApp = 4;
        }
        MLList.push(ML);
      }
      area.maplabels = MLList;
      /* VER192 WANDA */
      if (DOMINAPLUS_MANAGER_PTR_commandLMLcompleted !== null && typeof area.id !== 'undefined') {
        DOMINAPLUS_MANAGER_PTR_commandLMLcompleted(area.id);
      }
      /* ------------ */
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages the response to the WTS command. It requests a thermostat status
 * @param {object} parameters - array containing thermostat ID string
 * @param {object} records    - array of arrays containing the response data for every device
 */
function DOMINAPLUS_MANAGER_manageWTS(parameters, records)
{
  if (DOMINAPLUS_MANAGER_PTR_thermoStatusEventHandler !== null) {
    var eventInfo = {};
    eventInfo.eventType  = 'allthermostatsstatus';
    eventInfo.parameters = parameters;
    eventInfo.records    = records;
    eventInfo.deviceList = DOMINAPLUS_MANAGER_deviceList;
    DOMINAPLUS_MANAGER_PTR_thermoStatusEventHandler(eventInfo);
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages the response to the GTM command
 * @param {object} parameters - Array of string representing parameters
 * @version VER209 - WANDA
 */
function DOMINAPLUS_MANAGER_manageGTM(parameters)
{
  for (var i = 0; i < parameters.length; i++) {
    var id            = parseInt(parameters[i]) % 10000;
    var stagioneSplit = 0;
    if (parseInt(parameters[i]) > 30000) {
      stagioneSplit = 0; // SUMMER
    } else if (parseInt(parameters[i]) > 20000) {
      stagioneSplit = 1; // WINTER
    } else {
      stagioneSplit = 2; // ALL SEASON
    }
    for (var j = 0; j < DOMINAPLUS_MANAGER_deviceList.length; j++) {
      if (typeof DOMINAPLUS_MANAGER_deviceList[j].id !== 'undefined' && typeof DOMINAPLUS_MANAGER_deviceList[j].type !== 'undefined' && parseInt(DOMINAPLUS_MANAGER_deviceList[j].id) === id && parseInt(DOMINAPLUS_MANAGER_deviceList[j].type) === 4) {
        DOMINAPLUS_MANAGER_deviceList[j].stagionesplit = stagioneSplit;
      }
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages the response to the GGS command
 * @param {object} parameters - Array of string representing parameters
 */
function DOMINAPLUS_MANAGER_manageGGS(parameters)
{
  console.log('%c' + DOMINAPLUS_MANAGER_PREFIX + 'Managing GGS | ' + parameters + ' | ' + (new Date), 'color: ' + DOMINAPLUS_MANAGER_CONSOLE_COLOR);
  var antitheftStatus = parameters[0].split('-')[1];
  if (DOMINAPLUS_MANAGER_PTR_antitheftManageGGS !== null) {
    DOMINAPLUS_MANAGER_PTR_antitheftManageGGS(antitheftStatus);
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages the response to the GSF (GET STATUS BY FAMILY) command. It requests the current status of every device of a specified family
 * @param {object} parameters - device family ID
 * @param {object} records    - array of arrays containing the response data for every device.
 ** [0][0]: device id;
 ** [0][1]: device status; 
 * @version VER198 - WANDA
 */
function DOMINAPLUS_MANAGER_manageGSF(parameters, records)
{
  // TECHNICAL ALARM or P3000_AREA
  if (parameters[0] === '7' || parameters[0] === '12') {
    if (DOMINAPLUS_MANAGER_PTR_antitheftAreasStatusEventHandler !== null) {
      DOMINAPLUS_MANAGER_PTR_antitheftAreasStatusEventHandler(parameters, records);
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages the response to the GSI command (GET STATUS BY ID). It requests the current status of a device
 */
function DOMINAPLUS_MANAGER_manageGSI()
{
  // NOP
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages the response to the GMA command
 * @param {object} parameters - Array of string representing parameters
 * @version VER230 - WANDA
 */
function DOMINAPLUS_MANAGER_manageGMA(parameters)
{
  for (var i = 0; i < parameters.length; i++) {
    for (var j = 0; j < DOMINAPLUS_MANAGER_deviceList.length; j++) {
      if (typeof DOMINAPLUS_MANAGER_deviceList[j].id !== 'undefined' && parseInt(DOMINAPLUS_MANAGER_deviceList[j].id) === parseInt(parameters[i])) {
        DOMINAPLUS_MANAGER_deviceList[j].isMA = true;
      }
    }
  }
  if (DOMINAPLUS_MANAGER_PTR_manageCommandGMA !== null) {
    DOMINAPLUS_MANAGER_PTR_manageCommandGMA(parameters, DOMINAPLUS_MANAGER_deviceList);
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages the response to the GNA command
 * @param {object} parameters - Array of string representing parameters
 * @version VER230 - WANDA
 */
function DOMINAPLUS_MANAGER_manageGNA(parameters)
{
  for (var i = 0; i < parameters.length; i++) {
    for (var j = 0; j < DOMINAPLUS_MANAGER_deviceList.length; j++) {
      if (typeof DOMINAPLUS_MANAGER_deviceList[j].id !== 'undefined' && parseInt(DOMINAPLUS_MANAGER_deviceList[j].id) === parseInt(parameters[i])) {
        DOMINAPLUS_MANAGER_deviceList[j].isNA = true;
      }
    }
  }
  if (DOMINAPLUS_MANAGER_PTR_manageCommandGNA !== null) {
    DOMINAPLUS_MANAGER_PTR_manageCommandGNA(parameters, DOMINAPLUS_MANAGER_deviceList);
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages the response to the GEP command (GET ECONOMIZER PARAMETERS). It requests the functional parameters of the 53AB-ECO economizer
 * @param {object} record - array of arrays containing the response data
 ** [0][0]: presence or absence of the economizer;
 ** [0][1]: multiplier counter 1;
 ** [0][2]: multiplier counter 2;
 ** [0][3]: multiplier counter 3;
 ** [0][4]: multiplier counter 4;
 ** [0][5]: multiplier energy;
 ** [0][6]: multiplier power;
 ** [0][7]: energy unity cost;
 ** [0][8]: counter 1 unity cost;
 ** [0][9]: counter 2 unity cost;
 ** [0][10]: counter 3 unity cost;
 ** [0][11]: counter 4 unity cost;
 ** [0][12]: max consumption scale;
 ** [0][13]: consumption alert value;
 * @version VER211 - WANDA
 */
function DOMINAPLUS_MANAGER_manageGEP(record)
{
  if (DOMINAPLUS_MANAGER_PTR_manageCommandGEP !== null) {
    DOMINAPLUS_MANAGER_PTR_manageCommandGEP(record);
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages the response to the GEC command (GET ECONOMIZER COUNTERS). It requests the values detected by 53AB-ECO economizer
 * @param {object} records - array of arrays containing the response data
 ** [0][0]: the value of the energy counter
 ** [0][1]: the value of the power counter
 ** [0][2]: the value of the counter 1
 ** [0][3]: the value of the counter 2
 ** [0][4]: the value of the counter 3
 ** [0][5]: the value of the counter 4
 ** [0][6]: the cost of the energy
 ** [0][7]: the cost of the counter 1
 ** [0][8]: the cost of the counter 2
 ** [0][9]: the cost of the counter 3
 ** [0][10]: the cost of the counter 4
 * @version VER193 - WANDA
 */
function DOMINAPLUS_MANAGER_manageGEC(records)
{
  CONSUMPTION_energyValue = records[0][0];
  CONSUMPTION_powerValue  = records[0][1];
  CONSUMPTION_h2oValue    = records[0][2];
  CONSUMPTION_gasValue    = records[0][3];
  CONSUMPTION_energyCost  = records[0][6];
  CONSUMPTION_h2oCost     = records[0][7];
  CONSUMPTION_gasCost     = records[0][8];
  if (typeof CONSUMPTION_endGEC === 'function') {
    CONSUMPTION_endGEC();
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages ALP
 * @param {string} command    - Command code
 * @param {object} parameters - Array of string representing parameters
 * @version VER255B - LS
 */
function DOMINAPLUS_MANAGER_manageALP(command, parameters)
{
  parameters[0] = parameters[0].replace(/\s/g, '');
  parameters[1] = parameters[1].replace(/\s/g, '');
  if (isTS01) { // VER255B
    if (parseInt(parameters[3]) === 1 || (document.getElementById('boxOver') != null && parseInt(document.getElementById('boxOver').style.left) >= 0)) { // GESTISCO POPUP SE E' UN ALP 1 OPPURE SE E' GIA' APERTO
      if (DOMINAPLUS_MANAGER_PTR_getPopUpAlarm !== null) {
        DOMINAPLUS_MANAGER_PTR_getPopUpAlarm(null, null, parameters[2], parameters);
      }
    }
  } else {
    if (DOMINAPLUS_MANAGER_PTR_manageCallingSystemUPD !== null) {
      DOMINAPLUS_MANAGER_PTR_manageCallingSystemUPD(parameters, parameters[0].toLowerCase(), parameters[1], parseInt(parameters[3]));
    }
    if (parseInt(parameters[3]) === 1) {
      if (DOMINAPLUS_MANAGER_PTR_managePropagationList !== null) {
        DOMINAPLUS_MANAGER_PTR_managePropagationList(parameters, false, 'ADD');
      }
    } else {
      if (DOMINAPLUS_MANAGER_PTR_managePropagationList !== null) {
        DOMINAPLUS_MANAGER_PTR_managePropagationList(parameters, false, 'REMOVE');
      }
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages FALP
 * @param {string} command    - Command code
 * @param {object} parameters - Array of string representing parameters
 * @version VER230 - WANDA
 */
function DOMINAPLUS_MANAGER_manageFALP(parameters)
{
  parameters[0] = parameters[0].replace(/\s/g, '');
  parameters[1] = parameters[1].replace(/\s/g, '');
  if (DOMINAPLUS_MANAGER_PTR_manageCallingSystemUPD !== null) {
    DOMINAPLUS_MANAGER_PTR_manageCallingSystemUPD(parameters, parameters[0].toLowerCase(), parameters[1], parseInt(parameters[3]));
  }
  if (parseInt(parameters[3]) === 1 || parseInt(parameters[3]) === 2) {
    if (DOMINAPLUS_MANAGER_PTR_managePropagationList !== null) {
      DOMINAPLUS_MANAGER_PTR_managePropagationList(parameters, true, 'ADD');
    }
  } else {
    if (DOMINAPLUS_MANAGER_PTR_managePropagationList !== null) {
      DOMINAPLUS_MANAGER_PTR_managePropagationList(parameters, true, 'REMOVE');
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages the response to the GST command (GET SCHEDULER TASKS). It requests a list of every scheduled task
 * @param {object} records - array of arrays containing the response data for every scheduled task
 ** [0][0]: the id of the scheduled task;
 ** [0][1]: the id of the scenario;
 ** [0][2]: months in which the task should be executed;
 ** [0][3]: day of the week in which the task should be executed;
 ** [0][4]: hour in which the task should be executed;
 ** [0][5]: minute in which the task should be executed;
 * @version VER218C - WANDA
 */
function DOMINAPLUS_MANAGER_manageGST(records)
{
  if (WEBAPP_isAstronomicEnabled) {
    var taskSchedulerURL = '';
    if (isTS01) {
      taskSchedulerURL = (isClient) ? '//' + isClient_ServerIP + '/gst.php' : '../../gst.php'; // VER218C WANDA
    } else {
      taskSchedulerURL = DOMINAPLUS_MANAGER_GSTURL;
    }
    var request = new XMLHttpRequest();
    request.open('GET', taskSchedulerURL, false); // 'false' makes the request synchronous
    request.send(null);
    if (request.readyState === 4) {
      if (request.status === 200) {
        var requestResponseDiv = document.createElement('div');
        requestResponseDiv.innerHTML = request.responseText;
        DOMINAPLUS_MANAGER_GSTxml = requestResponseDiv;
      } else {
        console.log('%c' + DOMINAPLUS_MANAGER_PREFIX + 'manageGST error', 'color: ' + DOMINAPLUS_MANAGER_CONSOLE_ERROR);
      }
    }
  }
  var index = 0;
  DOMINAPLUS_MANAGER_schedulerTaskList = new Array();
  /* VER192C WANDA */
  for (var i = 0; i < records.length; i++) {
    console.log('%c' + DOMINAPLUS_MANAGER_PREFIX + records[i], 'color: ' + DOMINAPLUS_MANAGER_CONSOLE_COLOR);
    var MAX_HOUR_OFFSET = 23;
    /* VER181 WANDA */
    var taskXML = null;
    if (DOMINAPLUS_MANAGER_GSTxml !== '') {
      taskXML = DOMINAPLUS_MANAGER_GSTxml.getElementsByTagName('schedulertask')[index]; // VER175 WANDA
    }
    /* ------------ */
    var schedulerTask = new Object();
    schedulerTask.taskId                = parseInt(records[i][0]);
    schedulerTask.scenarioId            = parseInt(records[i][1]);
    schedulerTask.taskMonths            = records[i][2];
    schedulerTask.taskDays              = records[i][3];
    schedulerTask.taskHour              = parseInt(records[i][4]);
    schedulerTask.taskMinute            = parseInt(records[i][5]);
    schedulerTask.bModifiedByAstronomic = false;
    if (typeof taskXML !== 'undefined' && WEBAPP_isAstronomicEnabled) {
      var hourXML   = taskXML.getElementsByTagName('hour')[0];
      var minuteXML = taskXML.getElementsByTagName('minute')[0];
      if (typeof hourXML !== 'undefined' && typeof minuteXML !== 'undefined') {
        if (parseInt(hourXML.innerHTML) >= (200 - MAX_HOUR_OFFSET)) {
          schedulerTask.AstronomicHour        = parseInt(hourXML.innerHTML) - 200;
          schedulerTask.AstronomicMinute      = parseInt(minuteXML.innerHTML);
          schedulerTask.bModifiedByAstronomic = true;
          schedulerTask.bModifiedByType       = 'sunSet';
        }
        else if (parseInt(hourXML.innerHTML) >= (100 - MAX_HOUR_OFFSET)) {
          schedulerTask.AstronomicHour        = parseInt(hourXML.innerHTML) - 100;
          schedulerTask.AstronomicMinute      = parseInt(minuteXML.innerHTML);
          schedulerTask.bModifiedByAstronomic = true;
          schedulerTask.bModifiedByType       = 'sunRise';
        }
      }
    } else {
      schedulerTask.AstronomicWrongData = (schedulerTask.taskHour > 23) ? true : false;
    }
    DOMINAPLUS_MANAGER_schedulerTaskList.push(schedulerTask);
    if (parseInt(records[i][1]) === parseInt(WEBAPP_actualDevice)) { // VER181 WANDA
      if (DOMINAPLUS_MANAGER_PTR_updateSchedulerTaskHTML !== null) {
        DOMINAPLUS_MANAGER_PTR_updateSchedulerTaskHTML(schedulerTask, records[i]);
      }
    }
    index++;
  }
  /* ------------- */
  if (DOMINAPLUS_MANAGER_PTR_schedulerPagination !== null) {
    DOMINAPLUS_MANAGER_PTR_schedulerPagination();
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages the response to the PWR command
 * @param {object} parameters - Array of string representing parameters
 * @version VER230 - WANDA
 */
function DOMINAPLUS_MANAGER_managePWR(parameters)
{
  var deviceType = null;
  for (var i = 0; i < DOMINAPLUS_MANAGER_deviceList.length; i++) {
    if (typeof DOMINAPLUS_MANAGER_deviceList[i].id !== 'undefined' && parseInt(DOMINAPLUS_MANAGER_deviceList[i].id) === parseInt(parameters[0])) {
      DOMINAPLUS_MANAGER_deviceList[i].powerValue = parseInt(parameters[1]);
      if (typeof DOMINAPLUS_MANAGER_deviceList[i].type !== 'undefined') {
        deviceType = DOMINAPLUS_MANAGER_deviceList[i].type;
      }
    }
  }
  if (DOMINAPLUS_MANAGER_PTR_commandPWRcompleted !== null) {
    DOMINAPLUS_MANAGER_PTR_commandPWRcompleted(parameters[0], parameters[1], deviceType);
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages the response to the AMS command
 * @param {object} parameters - Array of string representing parameters
 * @version VER230 - WANDA
 */
function DOMINAPLUS_MANAGER_manageAMS(parameters)
{
  console.log('%c' + DOMINAPLUS_MANAGER_PREFIX + 'Managing AMS: ' + parameters, 'color: ' + DOMINAPLUS_MANAGER_CONSOLE_COLOR);
  if (parameters.length >= 6) {
    var slaveConsecutiveErrorsString = parameters[5];
    var slaveConsecutiveErrors       = slaveConsecutiveErrorsString.split(';');
    for (var i = 0; i < slaveConsecutiveErrors.length; i++) {
      if (slaveConsecutiveErrors[i].length === 7) {
        var singleSlave = slaveConsecutiveErrors[i].split(':');
        var slaveID     = singleSlave[0];
        var slaveErrors = singleSlave[1];
        console.log('%c' + DOMINAPLUS_MANAGER_PREFIX + 'slaveID: ' + parseInt(slaveID), 'color: ' + DOMINAPLUS_MANAGER_CONSOLE_COLOR);
        console.log('%c' + DOMINAPLUS_MANAGER_PREFIX + 'slaveErrors: ' + parseInt(slaveErrors), 'color: ' + DOMINAPLUS_MANAGER_CONSOLE_COLOR);
        if (DOMINAPLUS_MANAGER_PTR_manageCommandAMS !== null) {
          DOMINAPLUS_MANAGER_PTR_manageCommandAMS(parseInt(slaveErrors), parseInt(slaveID));
        }
      }
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages the response to the LM_bridge command. Requests a list of every map in the plant
 * @version VER209 - WANDA
 */
function DOMINAPLUS_MANAGER_manageLM_Bridge()
{
  var request = new XMLHttpRequest();
  request.open('GET', DOMINAPLUS_MANAGER_areaListURL, false); // 'false' makes the request synchronous
  request.send(null);
  if (request.readyState === 4) {
    if (request.status === 200) {
      var requestResponseDiv = document.createElement('div');
      requestResponseDiv.innerHTML = request.responseText;
      var record = requestResponseDiv.querySelectorAll('record');
      if (record !== null) {
        DOMINAPLUS_MANAGER_counterLMC = record.length;
        DOMINAPLUS_MANAGER_areaList = [];
        for (var i = 0; i < record.length; i++) {
          var area = new Object();
          var id      = record[i].getElementsByTagName('dato0')[0];
          var mapName = record[i].getElementsByTagName('dato1')[0];
          var order   = record[i].getElementsByTagName('dato2')[0];
          if (typeof id !== 'undefined' && typeof mapName !== 'undefined' && typeof order !== 'undefined') {
            area.id          = id.innerHTML;
            area.name        = mapName.innerHTML;
            area.order       = order.innerHTML;
            area.mapcommands = null;
            DOMINAPLUS_MANAGER_areaList.push(area);
            DOMINAPLUS_MANAGER_sendWSCommand('LMC', area.id);
            DOMINAPLUS_MANAGER_sendWSCommand('LML', area.id);
          }
        }
        DOMINAPLUS_MANAGER_isLoadedLM = true;
        /* VER192 WANDA */
        if (DOMINAPLUS_MANAGER_PTR_commandLMcompleted !== null) {
          DOMINAPLUS_MANAGER_PTR_commandLMcompleted();
        }
        /* ------------ */
      }
    } else {
      console.log('%c' + DOMINAPLUS_MANAGER_PREFIX + 'Loading area list error', 'color: ' + DOMINAPLUS_MANAGER_CONSOLE_ERROR);
    }
  }
}


/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Requests device list via AJAX call
 * @version VER230 - WANDA
 */
function DOMINAPLUS_MANAGER_manageLDI_Bridge()
{
  if (!DOMINAPLUS_MANAGER_isLoadedLDI) {
    var request = new XMLHttpRequest();
    request.open('GET', DOMINAPLUS_MANAGER_deviceListURL, false); // 'false' makes the request synchronous
    request.send(null);
    if (request.readyState === 4) {
      if (request.status === 200) {
        var requestResponseDiv = document.createElement('div');
        requestResponseDiv.innerHTML = request.responseText;
        var record = requestResponseDiv.querySelectorAll('record');
        if (record !== null) {
          for (var i = 0; i < record.length; i++) {
            var device = new Object();
            var id         = record[i].getElementsByTagName('dato0')[0];
            var deviceName = record[i].getElementsByTagName('dato1')[0];
            var type       = record[i].getElementsByTagName('dato2')[0];
            var maps       = record[i].getElementsByTagName('dato3')[0];
            if (typeof id !== 'undefined' && typeof deviceName !== 'undefined' && typeof type !== 'undefined' && typeof maps !== 'undefined') {
              device.id      = id.innerHTML;
              device.name    = deviceName.innerHTML;
              device.type    = type.innerHTML;
              device.maps    = maps.innerHTML;
              device.typeApp = device.type;
              if (device.type === '5') {
                WEBAPP_economizzatore = 1;
              }
              if (device.typeApp === '2') {
                device.typeApp = '1';
              }
              if (device.typeApp === '16' || device.typeApp === '19') {
                device.typeApp = '3';
              }
              if (device.type === '4') {
                DOMINAPLUS_MANAGER_fixToIdentifyTS01VirtualThermostats(device); // VER193 WANDA
              }
              DOMINAPLUS_MANAGER_deviceList.push(device);
            }
          }
          DOMINAPLUS_MANAGER_sendWSCommand('GTM');
        }
      } else {
        console.log('%c' + DOMINAPLUS_MANAGER_PREFIX + 'Loading device list error', 'color: ' + DOMINAPLUS_MANAGER_CONSOLE_ERROR);
      }
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates device commands
 * @version VER209 - WANDA
 */
function DOMINAPLUS_MANAGER_updateDeviceCommands()
{
  if (typeof DOMINAPLUS_MANAGER_deviceList !== 'undefined' && DOMINAPLUS_MANAGER_deviceList !== null) {
    for (var i = 0; i < DOMINAPLUS_MANAGER_deviceList.length; i++) {
      if (typeof DOMINAPLUS_MANAGER_deviceList[i].id !== 'undefined') {
        var commands = [];
        if (typeof DOMINAPLUS_MANAGER_areaList !== 'undefined' && DOMINAPLUS_MANAGER_areaList !== null) {
          for (var j = 0; j < DOMINAPLUS_MANAGER_areaList.length; j++) {
            if (typeof DOMINAPLUS_MANAGER_areaList[j].mapcommands !== 'undefined' && DOMINAPLUS_MANAGER_areaList[j].mapcommands !== null) {
              for (var k = 0; k < DOMINAPLUS_MANAGER_areaList[j].mapcommands.length; k++) {
                if (typeof DOMINAPLUS_MANAGER_areaList[j].mapcommands[k].deviceId !== 'undefined' && typeof DOMINAPLUS_MANAGER_areaList[j].mapcommands[k].commandType !== 'undefined' && parseInt(DOMINAPLUS_MANAGER_areaList[j].mapcommands[k].deviceId) === parseInt(DOMINAPLUS_MANAGER_deviceList[i].id) && commands.indexOf(parseInt(DOMINAPLUS_MANAGER_areaList[j].mapcommands[k].commandType)) === -1) {
                  commands.push(parseInt(DOMINAPLUS_MANAGER_areaList[j].mapcommands[k].commandType));
                }
              }
            }
          }
        }
        DOMINAPLUS_MANAGER_deviceList[i].commands = commands;
        if (DOMINAPLUS_MANAGER_PTR_updateDeviceType1_HTMLcodeForMulticast !== null) {
          DOMINAPLUS_MANAGER_PTR_updateDeviceType1_HTMLcodeForMulticast(DOMINAPLUS_MANAGER_deviceList[i]);
        }
      }
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------- COMMUNICATION -------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Identifies standard websocket URL
 * @param {string} customWSPort - Custom websocket port
 * @version VER277
 */
function DOMINAPLUS_MANAGER_identifyEffectiveURL(customWSPort)
{
  // Ports
  if (typeof wsPort === 'undefined' || wsPort === null) {
    wsPort = '14001';
  }
  if (typeof customWSPort !== 'undefined' && customWSPort !== null) {
    wsPort = customWSPort;
  }

  var WEBSOCKET_currentHTTPPort = location.port;
  if (WEBSOCKET_currentHTTPPort === '') {
    WEBSOCKET_currentHTTPPort = '80';
  }

  // URLs
  var WEBSOCKET_webSocketURL       = 'ws://'  + location.hostname + ':' + wsPort;
  var WEBSOCKET_webSocketPragmaURL = 'wss://' + location.hostname + '/WebSocketService'; // PRAGMA
  var WEBSOCKET_currentHTTPPortURL = 'ws://'  + location.hostname + ':' + (parseInt(WEBSOCKET_currentHTTPPort) + 10000);
  var WEBSOCKET_portForwardingURL  = 'ws://'  + location.hostname + ':14001';
  
  var WEBSOCKET_webSocketEffectiveURL = "";
  var WEBSOCKET_name = "";

  if (!WEBSOCKET_isRemoteIP(location.hostname)) { // Local
    WEBSOCKET_webSocketEffectiveURL = WEBSOCKET_webSocketURL;
    WEBSOCKET_name = 'Local connection';
  } else {
    if (location.href.indexOf('/access/') >= 0) {
      WEBSOCKET_webSocketEffectiveURL = WEBSOCKET_webSocketPragmaURL;
      WEBSOCKET_name = 'Pragma connection';
    } else {
      if (location.hostname.indexOf('monitoraggio.ave.it') >= 0) { // AVE remote support
        WEBSOCKET_webSocketEffectiveURL = WEBSOCKET_currentHTTPPortURL;
        WEBSOCKET_name = 'Remote support connection';
      } else { // Remote open ports on router
        WEBSOCKET_webSocketEffectiveURL = WEBSOCKET_portForwardingURL;
        WEBSOCKET_name = 'Port forwarding through private router connection';
      }
    }
  }

  return {"url": WEBSOCKET_webSocketEffectiveURL, "name": WEBSOCKET_name};
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Wrapper function to establish a websocket connection
 * @param {function} ptr_onConnectionTimeout
 * @param {number} tim_connectionTimeoutInSeconds
 * @version VER277
 */
function DOMINAPLUS_MANAGER_openCommunicationChannel(ptr_onConnectionTimeout, tim_connectionTimeoutInSeconds)  // VER277
{
  var customWSPort = undefined;
  if (WEBSOCKET_isRemoteIP(location.hostname)) {
    var customWSPortToVerify = DOMINAPLUS_MANAGER_askCustomPortByHTTP();
    if (customWSPortToVerify != null && parseInt(customWSPortToVerify) !== -1) {
      customWSPort = customWSPortToVerify;  // VER277
    }
  }
  DOMINAPLUS_MANAGER_getCloudSettingsByHTTP();
  /****************** VER277 ******************/
  //if (DOMINAPLUS_MANAGER_aveCloudTestModeEnabled !== 0) {
  //  WEBSOCKET_setCustomTestMode(DOMINAPLUS_MANAGER_aveCloudTestModeEnabled);
  //}
  //WEBSOCKET_WSConnection();
  /********************************************/
  
  /****************** VER277 ******************/
  var urlObject = DOMINAPLUS_MANAGER_identifyEffectiveURL(customWSPort);
  DOMINAPLUS_MANAGER_webSocketInstance = new WEBSOCKET_CLASS(urlObject.url, urlObject.name);

  DOMINAPLUS_MANAGER_webSocketInstance.WEBSOCKET_setConnectionOpenCallback(DOMINAPLUS_MANAGER_onConnectionOpen);
  DOMINAPLUS_MANAGER_webSocketInstance.WEBSOCKET_setMessageArrivedCallback(DOMINAPLUS_MANAGER_onMessageArrived);
  DOMINAPLUS_MANAGER_webSocketInstance.WEBSOCKET_setConnectionErrorCallback(DOMINAPLUS_MANAGER_onConnectionError);
  DOMINAPLUS_MANAGER_webSocketInstance.WEBSOCKET_setConnectionCloseCallback(DOMINAPLUS_MANAGER_onConnectionClose);
  DOMINAPLUS_MANAGER_webSocketInstance.WEBSOCKET_setConnectionTimeoutCallback(ptr_onConnectionTimeout, tim_connectionTimeoutInSeconds * 1000);
  DOMINAPLUS_MANAGER_webSocketInstance.WEBSOCKET_setSilenceDetectedCallback(DOMINAPLUS_MANAGER_onSilenceDetected, 60000);

  if (DOMINAPLUS_MANAGER_webSocketInstance.WEBSOCKET_connect() == WEBSOCKET_RESULT_CODE.RESULT_OK)
  {
    console.log('%c' + DOMINAPLUS_MANAGER_PREFIX + 'DOMINAPLUS_MANAGER_WSConnection CONNECTION WS OK!', 'color: ' + DOMINAPLUS_MANAGER_CONSOLE_COLOR);
  }
  else
  {
    console.log('%c' + DOMINAPLUS_MANAGER_PREFIX + 'DOMINAPLUS_MANAGER_WSConnection ERROR CONNECTING WS!', 'color: ' + DOMINAPLUS_MANAGER_CONSOLE_ERROR);
  }
  /********************************************/
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Wrapper function to check if channel is remote or not
 * @returns true or false
 */
function DOMINAPLUS_MANAGER_isRemoteChannel()
{
  return WEBSOCKET_isRemoteIP(location.hostname);
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Wrapper function the check if channel is active or not
 * @returns true or false
 * @version VER277
 */
function DOMINAPLUS_MANAGER_isChannelActive()
{
  return DOMINAPLUS_MANAGER_webSocketInstance.WEBSOCKET_isWebSocketReadyToTransmit();  //VER277
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

function DOMINAPLUS_MANAGER_askCustomPortByHTTP()
{
  var customWebSocketPort = -1;
  var request = new XMLHttpRequest();
  request.open('GET', WEBAPP_webifyURL, false); // 'false' makes the request synchronous
  request.send(null);
  if (request.status === 200) {
    var posExternalSocketPort = request.responseText.indexOf('<externalwebsocketport>');
    if (posExternalSocketPort >= 0) {
      var strExternalWebSocketPort = request.responseText.substring(posExternalSocketPort);
      var endTagPos = strExternalWebSocketPort.indexOf('</externalwebsocketport>');
      if (endTagPos >= 0) {
        strExternalWebSocketPort = strExternalWebSocketPort.substring(0, endTagPos);
        strExternalWebSocketPort = strExternalWebSocketPort.replace('<externalwebsocketport>', '');
        customWebSocketPort = parseInt(strExternalWebSocketPort.trim());
      }
    }
  }
  return customWebSocketPort;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

function DOMINAPLUS_MANAGER_getCloudSettingsByHTTP()
{
  var request = new XMLHttpRequest();
  request.open('GET', WEBAPP_cloudURL, false); // 'false' makes the request synchronous
  request.send(null);
  if (request.status === 200) {
    var posAvecloudTestModeEnabled = request.responseText.indexOf('<avecloudtestmodeenabled>');
    if (posAvecloudTestModeEnabled >= 0) {
      var strAveCloudTestModeEnabled = request.responseText.substring(posAvecloudTestModeEnabled);
      var endAveCloudTestModeEnabled = strAveCloudTestModeEnabled.indexOf('</avecloudtestmodeenabled>');
      if (endAveCloudTestModeEnabled >= 0) {
        strAveCloudTestModeEnabled = strAveCloudTestModeEnabled.substring(0, endAveCloudTestModeEnabled);
        strAveCloudTestModeEnabled = strAveCloudTestModeEnabled.replace('<avecloudtestmodeenabled>', '');
        DOMINAPLUS_MANAGER_aveCloudTestModeEnabled = parseInt(strAveCloudTestModeEnabled.trim());
      }
    }
    var posmqttEnabled = request.responseText.indexOf('<mqttenabled>');
    if (posmqttEnabled >= 0) {
      var strmqttEnabled = request.responseText.substring(posmqttEnabled);
      var endmqttEnabled = strmqttEnabled.indexOf('</mqttenabled>');
      if (endmqttEnabled >= 0) {
        strmqttEnabled = strmqttEnabled.substring(0, endmqttEnabled);
        strmqttEnabled = strmqttEnabled.replace('<mqttenabled>', '');
        DOMINAPLUS_MANAGER_mqttEnabled = parseInt(strmqttEnabled.trim());
      }
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Function to register a callback in response to a websocket event
 * @returns true if ok or false if ko
 * @version VER242 - LORENZO
 */
function DOMINAPLUS_MANAGER_registerWebsocketEventHandler(callerId, websocketMsgCallback) // o bind o subscribe...
{
	if (typeof callerId === 'undefined' || callerId === null)
	{
		return false;
	}
	
	if (typeof websocketMsgCallback === 'undefined' || websocketMsgCallback === null)
	{
		return false;
	}
	
	if (typeof websocketMsgCallback === 'function' && (typeof callerId === 'string' || callerId instanceof String))
	{	
		DOMINAPLUS_MANAGER_wsEventCallbackList.push({"callerId" : callerId, "websocketMsgCallback" : websocketMsgCallback});
		return true;
	}
	
	return false;
}

/**
 * Function to unregister a callback in response to a websocket event
 * @returns true if ok or false if ko
 * @version VER242 - LORENZO
 */
function DOMINAPLUS_MANAGER_unregisterWebsocketEventHandler(callerId) // o unbind o unsubscribe...
{
	if (typeof callerId === 'undefined' || callerId === null)
	{
		return false;
	}
	
	if (typeof callerId === 'string' || callerId instanceof String)
	{
    for (var i = 0; i < DOMINAPLUS_MANAGER_wsEventCallbackList.length; i++)
    {
      var currElement = DOMINAPLUS_MANAGER_wsEventCallbackList[i];
      if (currElement != undefined && currElement.callerId == callerId)
      {
        if (currElement.websocketMsgCallback !== undefined)
        {
          var functionName = currElement.websocketMsgCallback.name;
          if (functionName != "") {
            Object.keys(window).filter(function(x)
            {
                if (window[x] instanceof Function)
                {
                  if (window[x].name.toString() == functionName)
                  {
                    window[x] = null;
                  }
                }
            });
            delete DOMINAPLUS_MANAGER_wsEventCallbackList[i];
          }
          return true;
        }
      }
		}
	}
	
	return false;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ *//***************************************************************************************************************************************/
/*                                                AUDIO_GEN_module version 3 WBS 265                                                   */
/***************************************************************************************************************************************/

// VARIABLES
var AUDIO_GEN_PREFIX = '[AUDIO_GEN]: ';
var AUDIO_GEN_CONSOLE_COLOR = '#9933ff'; // Violet
var AUDIO_GEN_CONSOLE_ERROR = '#ff0000'; // Red

var AUDIO_GEN_audioType; // 1 TUTONDO - 2 BACKAUDIO - 3 VIVALDI - 4 MK2 VIVALDI - 5 MK3 VIVALDI
var AUDIO_GEN_currentDevice;

var AUDIO_GEN_audioEnable = 0;
var AUDIO_GEN_btnPressRepeatStatus = 0;

var AUDIO_GEN_updateVivaldiInterface;
var AUDIO_GEN_audioUPDclick = true;
var AUDIO_GEN_volumeIsClicked = false;

// Timeouts
var AUDIO_GEN_btnPressRepeatTimeout;

// Timers
var AUDIO_GEN_btnPressRepeatTimer = 500;

// URLs
var AUDIO_GEN_getAudioParameter = 'bridge.php?command=GAP';
var AUDIO_GEN_sendSourcesCommand = 'bridge.php?command=ASC';
var AUDIO_GEN_sendZoneCommand = 'bridge.php?command=AZC';

// Pointers - VIVALDI
var AUDIO_GEN_PTR_manageVivaldiUPD = null;
var AUDIO_GEN_PTR_loadVivaldiLocalDevice = null;
var AUDIO_GEN_PTR_vivaldiCommandsHandler = null;
var AUDIO_GEN_PTR_vivaldiAddEventHandlers = null;
var AUDIO_GEN_PTR_vivaldiUpdateUSBandTunerData = null;

// Pointers - TUTONDO
var AUDIO_GEN_PTR_manageTutondoUPD = null;
var AUDIO_GEN_PTR_loadTutondoAudioZones = null;

// Pointers - WEBAPP // VER200 WANDA
var AUDIO_GEN_PTR_hideAudioCommands = null;
var AUDIO_GEN_PTR_toggleAudioOverlay = null;
var AUDIO_GEN_PTR_setComandiSorgenti = null;
var AUDIO_GEN_PTR_toggleAudioActiveClass = null;
var AUDIO_GEN_PTR_clickOnComandiItemInBoxComandiExtra = null;
var AUDIO_GEN_PTR_setAudioSliders = null;
var AUDIO_GEN_PTR_checkIfAudioIsOn = null;

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------ CALLBACKS ------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Module initialization --- Callback VIVALDI
 * @param {function} ptr_VIVALDI_manageUPD - pointer to VIVALDI_manageUPD
 * @param {function} ptr_VIVALDI_loadLocalDevice - pointer to VIVALDI_loadLocalDevice
 * @param {function} ptr_VIVALDI_commandsHandler - pointer to VIVALDI_commandsHandler
 * @param {function} ptr_VIVALDI_addEventHandlers - pointer to VIVALDI_addEventHandlers
 * @param {function} ptr_VIVALDI_updateUSBandTunerData - pointer to VIVALDI_updateUSBandTunerData
 */
function AUDIO_GEN_setVivaldiCallback(ptr_VIVALDI_manageUPD,
  ptr_VIVALDI_loadLocalDevice,
  ptr_VIVALDI_commandsHandler,
  ptr_VIVALDI_addEventHandlers,
  ptr_VIVALDI_updateUSBandTunerData) 
{
  AUDIO_GEN_PTR_manageVivaldiUPD = ptr_VIVALDI_manageUPD;
  AUDIO_GEN_PTR_loadVivaldiLocalDevice = ptr_VIVALDI_loadLocalDevice;
  AUDIO_GEN_PTR_vivaldiCommandsHandler = ptr_VIVALDI_commandsHandler;
  AUDIO_GEN_PTR_vivaldiAddEventHandlers = ptr_VIVALDI_addEventHandlers;
  AUDIO_GEN_PTR_vivaldiUpdateUSBandTunerData = ptr_VIVALDI_updateUSBandTunerData;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Module initialization --- Callback TUTONDO
 * @param {function} ptr_TUTONDO_manageUPD - pointer to TUTONDO_manageUPD
 * @param {function} ptr_TUTONDO_loadAudioZones - pointer to TUTONDO_loadAudioZones
 */
function AUDIO_GEN_setTutondoCallback(ptr_TUTONDO_manageUPD, ptr_TUTONDO_loadAudioZones)
{
  AUDIO_GEN_PTR_manageTutondoUPD = ptr_TUTONDO_manageUPD;
  AUDIO_GEN_PTR_loadTutondoAudioZones = ptr_TUTONDO_loadAudioZones;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Module initialization --- Callback WEBAPP
 * @param {function} ptr_hideAudioCommands - pointer to WEBAPP_hideAudioCommands
 * @param {function} ptr_toggleAudioOverlay - pointer to WEBAPP_toggleAudioOverlay
 * @param {function} ptr_setComandiSorgenti - pointer to WEBAPP_setComandiSorgenti
 * @param {function} ptr_toggleAudioActiveClass - pointer to WEBAPP_toggleAudioActiveClass
 * @param {function} ptr_clickOnComandiItemInBoxComandiExtra - pointer to WEBAPP_clickOnComandiItemInBoxComandiExtra
 * @param {function} ptr_setAudioSliders - pointer to WEBAPP_setAudioSliders
 * @param {function} ptr_checkIfAudioIsOn - pointer to WEBAPP_checkIfAudioIsOn
 * @version VER200 - WANDA
 */
function AUDIO_GEN_setCallbackForWebapp(ptr_hideAudioCommands,
  ptr_toggleAudioOverlay,
  ptr_setComandiSorgenti,
  ptr_toggleAudioActiveClass,
  ptr_clickOnComandiItemInBoxComandiExtra,
  ptr_setAudioSliders,
  ptr_checkIfAudioIsOn)
{
  AUDIO_GEN_PTR_hideAudioCommands = ptr_hideAudioCommands;
  AUDIO_GEN_PTR_toggleAudioOverlay = ptr_toggleAudioOverlay;
  AUDIO_GEN_PTR_setComandiSorgenti = ptr_setComandiSorgenti;
  AUDIO_GEN_PTR_toggleAudioActiveClass = ptr_toggleAudioActiveClass;
  AUDIO_GEN_PTR_clickOnComandiItemInBoxComandiExtra = ptr_clickOnComandiItemInBoxComandiExtra;
  AUDIO_GEN_PTR_setAudioSliders = ptr_setAudioSliders;
  AUDIO_GEN_PTR_checkIfAudioIsOn = ptr_checkIfAudioIsOn;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ---------------------------------------------------------------------- EVENT LISTENERS --------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Handler of the click on a source element (!TS01)
 * @param {object} - the clicked source
 * @version VER217 - WANDA
 */
function AUDIO_GEN_setSourcesClick(element)
{
  if (AUDIO_GEN_PTR_toggleAudioActiveClass !== null) {
    AUDIO_GEN_PTR_toggleAudioActiveClass(element);
  }
  AUDIO_GEN_setComandiSorgenti(element);
  var commandTemp = AUDIO_GEN_sendZoneCommand + '&parameter=' + WEBAPP_actualDevice + ',16,' + (parseInt(element.getAttribute('data-index')) + 1);
  if (AUDIO_GEN_audioUPDclick) {
    AUDIO_GEN_sendAudioCommand(commandTemp);
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Handler of the click on "comandi item" in "comandi extra" box
 * @param {object} element - the clicked element
 * @param {string} dataCmd - the data-cmd attribute of the element
 * @param {boolean} sendCommand - true if a command needs to be sent, false otherwise
 * @version VER202 - WANDA
 */
function AUDIO_GEN_handleClickOnComandiItemInBoxComandiExtra(element, dataCmd, sendCommand)
{
  if (isTS01) {
    if (AUDIO_GEN_audioType === 3 && typeof AUDIO_GEN_currentDevice.vivaldiID !== 'undefined') {
      var isOn = false;
      if (AUDIO_GEN_PTR_checkIfAudioIsOn !== null) {
        isOn = AUDIO_GEN_PTR_checkIfAudioIsOn();
      }
      // ON and OFF
      if (dataCmd === 'on') {
        if (sendCommand) {
          if (isOn === false) {
            console.log('%c' + AUDIO_GEN_PREFIX + 'Switching ON', 'color: ' + AUDIO_GEN_CONSOLE_COLOR);
            if (AUDIO_GEN_PTR_clickOnComandiItemInBoxComandiExtra !== null) {
              AUDIO_GEN_PTR_clickOnComandiItemInBoxComandiExtra(element, 'ON');
            }
            if (AUDIO_GEN_PTR_vivaldiCommandsHandler !== null) {
              AUDIO_GEN_PTR_vivaldiCommandsHandler(AUDIO_GEN_currentDevice.vivaldiID, 'deviceON');
            }
          } else {
            console.log('%c' + AUDIO_GEN_PREFIX + 'Switching OFF', 'color: ' + AUDIO_GEN_CONSOLE_COLOR);
            if (AUDIO_GEN_PTR_clickOnComandiItemInBoxComandiExtra !== null) {
              AUDIO_GEN_PTR_clickOnComandiItemInBoxComandiExtra(element, 'OFF');
            }
            if (AUDIO_GEN_PTR_vivaldiCommandsHandler !== null) {
              AUDIO_GEN_PTR_vivaldiCommandsHandler(AUDIO_GEN_currentDevice.vivaldiID, 'deviceOFF');
            }
          }
        }
      }
      if (isOn === true) {
        // MUTE
        if (dataCmd === 'mute') {
          var isActive = false;
          if (AUDIO_GEN_PTR_clickOnComandiItemInBoxComandiExtra !== null) {
            isActive = AUDIO_GEN_PTR_clickOnComandiItemInBoxComandiExtra(element, 'MUTE');
          }
          if (isActive === true) {
            if (AUDIO_GEN_PTR_vivaldiCommandsHandler !== null) {
              AUDIO_GEN_PTR_vivaldiCommandsHandler(AUDIO_GEN_currentDevice.vivaldiID, 'muteOFF');
            }
          } else {
            if (AUDIO_GEN_PTR_vivaldiCommandsHandler !== null) {
              AUDIO_GEN_PTR_vivaldiCommandsHandler(AUDIO_GEN_currentDevice.vivaldiID, 'muteON');
            }
          }
        }
        // CHANGE AUDIO SOURCE
        if (dataCmd === '81') {
          var dataSource = '';
          if (AUDIO_GEN_PTR_clickOnComandiItemInBoxComandiExtra !== null) {
            dataSource = AUDIO_GEN_PTR_clickOnComandiItemInBoxComandiExtra(element, 'CHANGESOURCE');
          }
          if (AUDIO_GEN_PTR_vivaldiUpdateUSBandTunerData !== null) {
            AUDIO_GEN_PTR_vivaldiUpdateUSBandTunerData(); // Updating data which might not be aligned
          }
          if (AUDIO_GEN_PTR_vivaldiCommandsHandler !== null) {
            AUDIO_GEN_PTR_vivaldiCommandsHandler(AUDIO_GEN_currentDevice.vivaldiID, 'setSource', dataSource)
          }
        }
        // AUDIO SETTINGS
        if (dataCmd === 'audio-settings') {
          if (AUDIO_GEN_PTR_clickOnComandiItemInBoxComandiExtra !== null) {
            AUDIO_GEN_PTR_clickOnComandiItemInBoxComandiExtra(element, 'SETTINGS');
          }
        }
        // VOLUME
        if (dataCmd === 'volume-up') {
          clearTimeout(AUDIO_GEN_btnPressRepeatTimeout);
          if (AUDIO_GEN_PTR_vivaldiCommandsHandler !== null) {
            AUDIO_GEN_PTR_vivaldiCommandsHandler(AUDIO_GEN_currentDevice.vivaldiID, 'volumeUp');
          }
        }
        if (dataCmd === 'volume-down') {
          clearTimeout(AUDIO_GEN_btnPressRepeatTimeout);
          if (AUDIO_GEN_PTR_vivaldiCommandsHandler !== null) {
            AUDIO_GEN_PTR_vivaldiCommandsHandler(AUDIO_GEN_currentDevice.vivaldiID, 'volumeDown');
          }
        }
      }
    }
  } else {
    var commandTemp = AUDIO_GEN_sendZoneCommand + '&parameter=' + WEBAPP_actualDevice + ',';
    var isActive = false;
    // ON and OFF
    if (dataCmd === 'on') {
      if (AUDIO_GEN_PTR_clickOnComandiItemInBoxComandiExtra !== null) {
        isActive = AUDIO_GEN_PTR_clickOnComandiItemInBoxComandiExtra(element, 'ON');
      }
      if (isActive === true) {
        console.log('%c' + AUDIO_GEN_PREFIX + 'SWITCHING ON', 'color: ' + AUDIO_GEN_CONSOLE_COLOR);
        commandTemp += '17,0';
      } else {
        console.log('%c' + AUDIO_GEN_PREFIX + 'SWITCHING OFF', 'color: ' + AUDIO_GEN_CONSOLE_COLOR);
        commandTemp += '18,0';
      }
    }
    // MUTE
    if (dataCmd === 'mute') {
      if (AUDIO_GEN_PTR_clickOnComandiItemInBoxComandiExtra !== null) {
        isActive = AUDIO_GEN_PTR_clickOnComandiItemInBoxComandiExtra(element, 'MUTE');
      }
      if (isActive === true) {
        commandTemp += '11,0';
      } else {
        commandTemp += '10,0';
      }
    }
    AUDIO_GEN_setOverlay();
    if (AUDIO_GEN_audioUPDclick) {
      AUDIO_GEN_sendAudioCommand(commandTemp);
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Handler of the mousedown event on the volume button (TS01)
 * @param {string} dataCmd - the data-cmd attribute of the element
 * @version VER200 - WANDA
 */
function AUDIO_GEN_onMousedownVolume(dataCmd)
{
  if (AUDIO_GEN_audioType === 3) {
    clearTimeout(AUDIO_GEN_btnPressRepeatTimeout);
    AUDIO_GEN_volumeIsClicked = true;
    if (dataCmd === 'volume-down') {
      AUDIO_GEN_volumeRepeatCommand(-1);
    } else if (dataCmd === 'volume-up') {
      AUDIO_GEN_volumeRepeatCommand(1);
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Handler of the mouseup event on the volume button (TS01)
 * @version VER200 - WANDA
 */
function AUDIO_GEN_onMouseupVolume()
{
  if (AUDIO_GEN_volumeIsClicked === true) {
    clearTimeout(AUDIO_GEN_btnPressRepeatTimeout);
    console.log('%c' + AUDIO_GEN_PREFIX + 'Change volume button released - AUDIO_GEN_btnPressRepeatStatus: ' + AUDIO_GEN_btnPressRepeatStatus, 'color: ' + AUDIO_GEN_CONSOLE_COLOR);
    AUDIO_GEN_btnPressRepeatStatus = 0;
    AUDIO_GEN_volumeIsClicked = false;
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Handler of the change event on the slider input (!TS01)
 * @param {object} element - the changing element
 * @param {string} dataCmd - the data-cmd attribute of the changing element
 * @version VER200 - WANDA
 */
function AUDIO_GEN_inputOnChange(element, dataCmd)
{
  var commandTemp = AUDIO_GEN_sendZoneCommand + '&parameter=' + WEBAPP_actualDevice + ', ' + dataCmd + ',' + element.value;
  AUDIO_GEN_sendAudioCommand(commandTemp);
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ---------------------------------------------------------------------- GENERAL FUNCTIONS ------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Once that settings_audio.htm page is ready, do these actions
 * @version VER200 - WANDA
 */
function AUDIO_GEN_onDocumentReady()
{
  console.log('%c' + AUDIO_GEN_PREFIX + 'WEBAPP_actualDevice: ' + WEBAPP_actualDevice, 'color: ' + AUDIO_GEN_CONSOLE_COLOR);
  if (AUDIO_GEN_audioType === 3) { // VIVALDI
    for (var i = 0; i < DOMINAPLUS_MANAGER_deviceList.length; i++) {
      if (DOMINAPLUS_MANAGER_deviceList[i].vivaldiID === WEBAPP_actualDevice) {
        AUDIO_GEN_currentDevice = DOMINAPLUS_MANAGER_deviceList[i];
        break;
      }
    }
    if (AUDIO_GEN_PTR_vivaldiAddEventHandlers !== null) {
      AUDIO_GEN_PTR_vivaldiAddEventHandlers();
    }
  }
  AUDIO_GEN_loadAudioParameters();
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * GAP - GET AUDIO PARAMETERS
 ** [dato0]: existence of a sound central on the plant;
 ** [dato1]: supported sound central volume min value;
 ** [dato2]: supported sound central volume max value;
 ** [dato3]: supported sound central bass min value; 
 ** [dato4]: supported sound central bass max value;
 ** [dato5]: supported sound central high min value; 
 ** [dato6]: supported sound central high max value;
 ** [dato7]: supported sound central balance min value (all on left channel); 
 ** [dato8]: supported sound central balance max value (all on right channel);
 ** [dato9]: type of sound central on the plant;
 * @version VER200 - WANDA
 */
function AUDIO_GEN_loadAudioParameters()
{
  if (isTS01) {
    if (AUDIO_GEN_audioType === 3) { // VIVALDI
      if (AUDIO_GEN_PTR_loadVivaldiLocalDevice !== null) {
        setTimeout('AUDIO_GEN_PTR_loadVivaldiLocalDevice()', 1200);
      }
    }
  } else {
    var request = new XMLHttpRequest();
    request.open('GET', AUDIO_GEN_getAudioParameter, false); // 'false' makes the request synchronous
    request.send(null);
    if (request.readyState === 4) {
      if (request.status === 200) {
        // VOLUME MIN VALUE
        var volumeMinValue = '';
        var posVolumeMinValue = request.responseText.indexOf('<dato1>');
        if (posVolumeMinValue >= 0) {
          var strVolumeMinValue = request.responseText.substring(posVolumeMinValue);
          var endTagVolumeMinValue = strVolumeMinValue.indexOf('</dato1>');
          if (endTagVolumeMinValue >= 0) {
            strVolumeMinValue = strVolumeMinValue.substring(0, endTagVolumeMinValue);
            strVolumeMinValue = strVolumeMinValue.replace('<dato1>', '');
            volumeMinValue = strVolumeMinValue.trim();
          }
        }
        // VOLUME MAX VALUE
        var volumeMaxValue = '';
        var posVolumeMaxValue = request.responseText.indexOf('<dato2>');
        if (posVolumeMaxValue >= 0) {
          var strVolumeMaxValue = request.responseText.substring(posVolumeMaxValue);
          var endTagVolumeMaxValue = strVolumeMaxValue.indexOf('</dato2>');
          if (endTagVolumeMaxValue >= 0) {
            strVolumeMaxValue = strVolumeMaxValue.substring(0, endTagVolumeMaxValue);
            strVolumeMaxValue = strVolumeMaxValue.replace('<dato2>', '');
            volumeMaxValue = strVolumeMaxValue.trim();
          }
        }
        // BASS MIN VALUE
        var bassMinValue = '';
        var posBassMinValue = request.responseText.indexOf('<dato3>');
        if (posBassMinValue >= 0) {
          var strBassMinValue = request.responseText.substring(posBassMinValue);
          var endTagBassMinValue = strBassMinValue.indexOf('</dato3>');
          if (endTagBassMinValue >= 0) {
            strBassMinValue = strBassMinValue.substring(0, endTagBassMinValue);
            strBassMinValue = strBassMinValue.replace('<dato3>', '');
            bassMinValue = strBassMinValue.trim();
          }
        }
        // BASS MAX VALUE
        var bassMaxValue = '';
        var posBassMaxValue = request.responseText.indexOf('<dato4>');
        if (posBassMaxValue >= 0) {
          var strBassMaxValue = request.responseText.substring(posBassMaxValue);
          var endTagBassMaxValue = strBassMaxValue.indexOf('</dato4>');
          if (endTagBassMaxValue >= 0) {
            strBassMaxValue = strBassMaxValue.substring(0, endTagBassMaxValue);
            strBassMaxValue = strBassMaxValue.replace('<dato4>', '');
            bassMaxValue = strBassMaxValue.trim();
          }
        }
        // HIGH MIN VALUE
        var highMinValue = '';
        var posHighMinValue = request.responseText.indexOf('<dato5>');
        if (posHighMinValue >= 0) {
          var strHighMinValue = request.responseText.substring(posHighMinValue);
          var endTagHighMinValue = strHighMinValue.indexOf('</dato5>');
          if (endTagHighMinValue >= 0) {
            strHighMinValue = strHighMinValue.substring(0, endTagHighMinValue);
            strHighMinValue = strHighMinValue.replace('<dato5>', '');
            highMinValue = strHighMinValue.trim();
          }
        }
        // HIGH MAX VALUE
        var highMaxValue = '';
        var posHighMaxValue = request.responseText.indexOf('<dato6>');
        if (posHighMaxValue >= 0) {
          var strHighMaxValue = request.responseText.substring(posHighMaxValue);
          var endTagHighMaxValue = strHighMaxValue.indexOf('</dato6>');
          if (endTagHighMaxValue >= 0) {
            strHighMaxValue = strHighMaxValue.substring(0, endTagHighMaxValue);
            strHighMaxValue = strHighMaxValue.replace('<dato6>', '');
            highMaxValue = strHighMaxValue.trim();
          }
        }
        // BALANCE MIN VALUE
        var balanceMinValue = '';
        var posBalanceMinValue = request.responseText.indexOf('<dato7>');
        if (posBalanceMinValue >= 0) {
          var strBalanceMinValue = request.responseText.substring(posBalanceMinValue);
          var endTagBalanceMinValue = strBalanceMinValue.indexOf('</dato7>');
          if (endTagBalanceMinValue >= 0) {
            strBalanceMinValue = strBalanceMinValue.substring(0, endTagBalanceMinValue);
            strBalanceMinValue = strBalanceMinValue.replace('<dato7>', '');
            balanceMinValue = strBalanceMinValue.trim();
          }
        }
        // BALANCE MAX VALUE
        var balanceMaxValue = '';
        var posBalanceMaxValue = request.responseText.indexOf('<dato8>');
        if (posBalanceMaxValue >= 0) {
          var strBalanceMaxValue = request.responseText.substring(posBalanceMaxValue);
          var endTagBalanceMaxValue = strBalanceMaxValue.indexOf('</dato8>');
          if (endTagBalanceMaxValue >= 0) {
            strBalanceMaxValue = strBalanceMaxValue.substring(0, endTagBalanceMaxValue);
            strBalanceMaxValue = strBalanceMaxValue.replace('<dato8>', '');
            balanceMaxValue = strBalanceMaxValue.trim();
          }
        }
        if (AUDIO_GEN_PTR_setAudioSliders !== null) {
          AUDIO_GEN_PTR_setAudioSliders(volumeMinValue, volumeMaxValue, bassMinValue, bassMaxValue, highMinValue, highMaxValue, balanceMinValue, balanceMaxValue);
        }
        if (volumeMaxValue === '31') {
          AUDIO_GEN_audioType = 2;
        }
        if (AUDIO_GEN_audioType === 3) { // VIVALDI
          if (AUDIO_GEN_PTR_loadVivaldiLocalDevice !== null) {
            AUDIO_GEN_PTR_loadVivaldiLocalDevice();
          }
        } else {
          if (AUDIO_GEN_PTR_loadTutondoAudioZones !== null) {
            AUDIO_GEN_PTR_loadTutondoAudioZones();
          }
        }
        if (AUDIO_GEN_PTR_hideAudioCommands !== null) {
          AUDIO_GEN_PTR_hideAudioCommands();
        }
      } else {
        console.log('%c' + AUDIO_GEN_PREFIX + 'loadAudioParameters error', 'color: ' + AUDIO_GEN_CONSOLE_ERROR);
      }
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages configuration value
 * @param {number} valAudio - valAudio found or not found
 * @version VER175 - WANDA
 */
function AUDIO_GEN_manageConfigurationValue(valAudio)
{
  if (valAudio > 0) {
    AUDIO_GEN_audioEnable = 1;
    AUDIO_GEN_audioType = valAudio;
    if (AUDIO_GEN_audioType === 4 || AUDIO_GEN_audioType === 5) { // VER128
      AUDIO_GEN_audioType = 3;
    }
  } else {
    AUDIO_GEN_audioEnable = 0;
    AUDIO_GEN_audioType = null;
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages the response to the UPD command
 * @param {object} parameters - array containing parameters received from the UPD message
 * @param {string} module - which module should be called (vivaldi or tutondo)
 * @param {object} device - the relevant device
 * @version VER175 - WANDA
 */
function AUDIO_GEN_manageUPD(parameters, module, device) 
{
  if (module === 'vivaldi') {
    if (AUDIO_GEN_PTR_manageVivaldiUPD !== null) {
      AUDIO_GEN_PTR_manageVivaldiUPD(parameters, device);
    }
  }
  if (module === 'tutondo') {
    if (AUDIO_GEN_PTR_manageTutondoUPD !== null) {
      AUDIO_GEN_PTR_manageTutondoUPD(parameters);
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Adds/removes an overlay to the boxOver
 * @version VER200 - WANDA
 */
function AUDIO_GEN_setOverlay()
{
  if (AUDIO_GEN_PTR_toggleAudioOverlay !== null) {
    AUDIO_GEN_PTR_toggleAudioOverlay();
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Shows the commands based on the selected source (!TS01)
 * @param {object} activeSource - the active source
 * @version VER200 - WANDA
 */
function AUDIO_GEN_setComandiSorgenti(activeSource)
{
  if (AUDIO_GEN_PTR_setComandiSorgenti !== null) {
    AUDIO_GEN_PTR_setComandiSorgenti(activeSource);
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Sends an audio command (!TS01)
 * @param {string} command - command to send
 * @version VER200 - WANDA
 */
function AUDIO_GEN_sendAudioCommand(command)
{
  WEBAPP_debug('cmd: ' + command); // VER153 WANDA
  var request = new XMLHttpRequest();
  request.open('GET', command, false); // 'false' makes the request synchronous
  request.send(null);
  if (request.readyState === 4) {
    if (request.status !== 200) {
      console.log('%c' + AUDIO_GEN_PREFIX + 'sendAudioCommand error', 'color: ' + AUDIO_GEN_CONSOLE_ERROR);
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Passes a message to the relevant DOMINAPLUS_MANAGER function
 * @param {string} cmd - command code
 * @param {string} message - message to be sent
 */
function AUDIO_GEN_passCommand(cmd, message)
{
  DOMINAPLUS_MANAGER_sendWSCommand(cmd, message);
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Repeats click on the volume element (TS01)
 * @param {number} step - volume step value
 */
function AUDIO_GEN_volumeRepeatCommand(step)
{
  AUDIO_GEN_btnPressRepeatTimeout = setInterval(function ()
  {
    AUDIO_GEN_btnPressRepeatStatus += step;
    console.log('%c' + AUDIO_GEN_PREFIX + 'Change volume button pressed - AUDIO_GEN_btnPressRepeatStatus: ' + AUDIO_GEN_btnPressRepeatStatus, 'color: ' + AUDIO_GEN_CONSOLE_COLOR);
    if (step === 1) {
      if (AUDIO_GEN_PTR_vivaldiCommandsHandler !== null) {
        AUDIO_GEN_PTR_vivaldiCommandsHandler(AUDIO_GEN_currentDevice.vivaldiID, 'volumeUp');
      }
    } else {
      if (AUDIO_GEN_PTR_vivaldiCommandsHandler !== null) {
        AUDIO_GEN_PTR_vivaldiCommandsHandler(AUDIO_GEN_currentDevice.vivaldiID, 'volumeDown');
      }
    }
  }, AUDIO_GEN_btnPressRepeatTimer);
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ *//***************************************************************************************************************************************/
/*                                                   VIVALDI_module version 3 WBS 265                                                  */
/***************************************************************************************************************************************/

// VARIABLES
var VIVALDI_PREFIX = '[VIVALDI]: ';
var VIVALDI_CONSOLE_COLOR = '#bf80ff'; // Lilla
var VIVALDI_CONSOLE_ERROR = '#ff0000'; // Red

var VIVALDI_LOW_FREQUENCY = 880;
var VIVALDI_HIGH_FREQUENCY = 1080;

var VIVALDI_btnPressRepeatStatus = 0;
var VIVALDI_currentFrequency = 0;

var VIVALDI_touchedElement = null;

// Timeouts
var VIVALDI_btnPressRepeatTimeout;

// Timers
var VIVALDI_btnPressRepeatTimer = 500;

// Flags
var VIVALDI_logVivaldi = false;
var VIVALDI_frequencyIsPressedDown = false;

// Pointers - WEBAPP // VER202 WANDA
var VIVALDI_PTR_updateVivaldiHTMLonUPD = null;
var VIVALDI_PTR_loadVivaldiHTMLLocalDevice = null;
var VIVALDI_PTR_updateVivaldiFrequencyHTML = null;
var VIVALDI_PTR_hideShowVivaldiPlayPause = null;
var VIVALDI_PTR_updateVivaldiUSBandTunerData = null;
var VIVALDI_PTR_addVivaldiEventListeners = null;

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------ CALLBACKS ------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Module initialization --- Callback WEBAPP
 * @param {function} ptr_updateVivaldiHTMLonUPD - pointer to WEBAPP_updateVivaldiHTMLonUPD
 * @param {function} ptr_loadVivaldiHTMLLocalDevice - pointer to WEBAPP_loadVivaldiHTMLLocalDevice
 * @param {function} ptr_updateVivaldiFrequencyHTML - pointer to WEBAPP_updateVivaldiFrequencyHTML
 * @param {function} ptr_hideShowVivaldiPlayPause - pointer to WEBAPP_hideShowVivaldiPlayPause
 * @param {function} ptr_updateVivaldiUSBandTunerData - pointer to WEBAPP_updateVivaldiUSBandTunerData
 * @param {function} ptr_addVivaldiEventListeners - pointer to WEBAPP_addVivaldiEventListeners
 * @version VER202 - WANDA
 */
function VIVALDI_setCallbackForWebapp(ptr_updateVivaldiHTMLonUPD,
  ptr_loadVivaldiHTMLLocalDevice,
  ptr_updateVivaldiFrequencyHTML,
  ptr_hideShowVivaldiPlayPause,
  ptr_updateVivaldiUSBandTunerData,
  ptr_addVivaldiEventListeners)
{
  VIVALDI_PTR_updateVivaldiHTMLonUPD = ptr_updateVivaldiHTMLonUPD;
  VIVALDI_PTR_loadVivaldiHTMLLocalDevice = ptr_loadVivaldiHTMLLocalDevice;
  VIVALDI_PTR_updateVivaldiFrequencyHTML = ptr_updateVivaldiFrequencyHTML;
  VIVALDI_PTR_hideShowVivaldiPlayPause = ptr_hideShowVivaldiPlayPause;
  VIVALDI_PTR_updateVivaldiUSBandTunerData = ptr_updateVivaldiUSBandTunerData;
  VIVALDI_PTR_addVivaldiEventListeners = ptr_addVivaldiEventListeners;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ---------------------------------------------------------------------- EVENT LISTENERS --------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Adds some event handlers
 * @version VER202 - WANDA
 */
function VIVALDI_addEventHandlers()
{
  if (VIVALDI_PTR_addVivaldiEventListeners !== null) {
    VIVALDI_PTR_addVivaldiEventListeners();
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Handler of the click on radio frequency element
 * @param {string} dataCmd - the data-cmd attribute of the clicked element
 * @version VER202 - WANDA
 */
function VIVALDI_onClickRadioFrequency(dataCmd)
{
  if (dataCmd === '38') {
    VIVALDI_radioFrequency(-1);
  } else if (dataCmd === '39') {
    VIVALDI_radioFrequency(1);
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Handler of the pointerdown/mousedown event on a radio frequency button
 * @param {string} dataCmd - the data-cmd attribute of the relevant element
 * @version VER202 - WANDA
 */
function VIVALDI_handlePointerOrMouseDownOnRadioFrequency(dataCmd)
{
  VIVALDI_frequencyIsPressedDown = true;
  VIVALDI_frequencyCommandLongPressStartHandler(dataCmd);
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Handler of the pointerup/mouseup event on a radio frequency button
 * @version VER202 - WANDA
 */
function VIVALDI_handlePointerOrMouseUpOnRadioFrequency()
{
  VIVALDI_frequencyCommandLongPressEndHandler();
  VIVALDI_frequencyIsPressedDown = false;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Handler of the pointerleave/mousemove event on a radio frequency button
 * @version VER202 - WANDA
 */
function VIVALDI_handlePointerleaveOrMousemoveOnRadioFrequency()
{
  if (VIVALDI_frequencyIsPressedDown === true) {
    VIVALDI_handlePointerOrMouseUpOnRadioFrequency();
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Handler of the touchstart event on a radio frequency button
 * @param {object} event - the occurring event
 * @param {string} dataCmd - the data-cmd attribute of the relevant element
 * @version VER202 - WANDA
 */
function VIVALDI_onTouchstartRadioFrequency(event, dataCmd)
{
  VIVALDI_touchedElement = document.elementFromPoint(event.touches[0].pageX, event.touches[0].pageY);
  VIVALDI_frequencyCommandLongPressStartHandler(dataCmd);
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Handler of the touchend event on a radio frequency button
 * @version VER202 - WANDA
 */
function VIVALDI_onTouchendRadioFrequency()
{
  VIVALDI_frequencyCommandLongPressEndHandler();
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Handler of the touchmove event on a radio frequency button
 * @param {object} event - the occurring event
 * @version VER202 - WANDA
 */
function VIVALDI_onTouchmoveRadioFrequency(event)
{
  if (VIVALDI_touchedElement !== document.elementFromPoint(event.touches[0].pageX, event.touches[0].pageY)) {
    VIVALDI_onTouchendRadioFrequency();
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Handler of the USB click event
 * @param {object} element - the clicked element
 * @param {string} dataType - the data-type of the clicked element
 * @version VER202 - WANDA
 */
function VIVALDI_USBCommandsHandler(element, dataType)
{
  if (AUDIO_GEN_audioType === 3 && typeof AUDIO_GEN_currentDevice.vivaldiID !== 'undefined') {
    switch (dataType) {
      case 'USBPreviousTrack':
        VIVALDI_commandsHandler(AUDIO_GEN_currentDevice.vivaldiID, 'previousTrack');
        break;

      case 'USBNextTrack':
        VIVALDI_commandsHandler(AUDIO_GEN_currentDevice.vivaldiID, 'nextTrack');
        break;

      case 'USBPreviousDirectory':
        VIVALDI_commandsHandler(AUDIO_GEN_currentDevice.vivaldiID, 'previousDirectory');
        break;

      case 'USBNextDirectory':
        VIVALDI_commandsHandler(AUDIO_GEN_currentDevice.vivaldiID, 'nextDirectory');
        break;

      case 'USBPlay':
        VIVALDI_commandsHandler(AUDIO_GEN_currentDevice.vivaldiID, 'USBPlay');
        if (VIVALDI_PTR_hideShowVivaldiPlayPause !== null) {
          VIVALDI_PTR_hideShowVivaldiPlayPause(element, dataType);
        }
        break;

      case 'USBPause':
        VIVALDI_commandsHandler(AUDIO_GEN_currentDevice.vivaldiID, 'USBPause');
        if (VIVALDI_PTR_hideShowVivaldiPlayPause !== null) {
          VIVALDI_PTR_hideShowVivaldiPlayPause(element, dataType);
        }
        break;

      default: // NOP
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ---------------------------------------------------------------------- GENERAL FUNCTIONS ------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Modifies the informations shown based on what is loaded from the local device
 * @version VER202 - WANDA
 */
function VIVALDI_loadLocalDevice()
{
  if (VIVALDI_PTR_loadVivaldiHTMLLocalDevice !== null) {
    VIVALDI_PTR_loadVivaldiHTMLLocalDevice();
  }
  if (isTS01) {
    if (typeof AUDIO_GEN_currentDevice.ONOFF !== 'undefined' && AUDIO_GEN_currentDevice.ONOFF === '1') {
      VIVALDI_updateUSBandTunerData();
    }
  } else {
    AUDIO_GEN_setOverlay();
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages the content of the upcoming UPDs messages
 ** [0][1]: id of the device to be updated;
 ** [0][2]: command name;
 ** [0][3]: updated value;
 * @param {object} parameters - an array containing the parameters of the upcoming UPDs messages
 * @param {object} device - the relevant device
 * @version VER205C - WANDA
 */
function VIVALDI_manageUPD(parameters, device)
{
  var muteTemp = '';
  var volumeTemp = 0;
  var deviceID = parameters[1];
  var commandName = parameters[2];
  var updatedValue = parameters[3];
  updatedValue = updatedValue.replace(/["'"]/g, ''); // replaceAll() is not supported on TSSMART, TSSMART7'' and TS10
  if (updatedValue.trim() !== '') {
    if (isTS01) {
      eval('device.' + commandName + "='" + updatedValue.replace("'", "\\'") + "'");
    } else {
      eval('device.' + commandName + "='" + updatedValue + "'");
    }
    // VOLUME and MUTE
    if (commandName === 'VOLUME_MUTE') {
      if (parseInt(updatedValue) >= 1000) {
        muteTemp = '1';
        volumeTemp = parseInt(updatedValue) - 1000;
      } else {
        muteTemp = '0';
        volumeTemp = parseInt(updatedValue);
      }
      device.MUTE = muteTemp;
      device.VOLUME = volumeTemp.toString();
    }
  }
  if (VIVALDI_PTR_updateVivaldiHTMLonUPD !== null) {
    VIVALDI_PTR_updateVivaldiHTMLonUPD(device, muteTemp, volumeTemp, commandName, updatedValue);
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * RADIO: sets the radio frequency
 * @param {number} step - frequency step value
 * @version VER202 - WANDA
 */
function VIVALDI_radioFrequency(step)
{
  if (VIVALDI_currentFrequency === 0) {
    if (typeof AUDIO_GEN_currentDevice.FM_FREQ !== 'undefined') {
      VIVALDI_currentFrequency = parseFloat(AUDIO_GEN_currentDevice.FM_FREQ) * 10;
    }
  }
  VIVALDI_currentFrequency += step;
  if (VIVALDI_currentFrequency < VIVALDI_LOW_FREQUENCY) {
    VIVALDI_currentFrequency = VIVALDI_HIGH_FREQUENCY;
  }
  if (VIVALDI_currentFrequency > VIVALDI_HIGH_FREQUENCY) {
    VIVALDI_currentFrequency = VIVALDI_LOW_FREQUENCY;
  }
  if (VIVALDI_PTR_updateVivaldiFrequencyHTML !== null) {
    VIVALDI_PTR_updateVivaldiFrequencyHTML(VIVALDI_currentFrequency);
  }
  if (typeof AUDIO_GEN_currentDevice.vivaldiID !== 'undefined') {
    VIVALDI_commandsHandler(AUDIO_GEN_currentDevice.vivaldiID, 'radioFrequency', VIVALDI_currentFrequency);
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Handler of the frequency long press start event
 * @param {string} dataCmd - the data-cmd attribute of the clicked element
 * @version VER202 - WANDA
 */
function VIVALDI_frequencyCommandLongPressStartHandler(dataCmd)
{
  if (dataCmd === '38') {
    VIVALDI_frequencyRepeatCommand(-1);
  } else if (dataCmd === '39') {
    VIVALDI_frequencyRepeatCommand(1);
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Handler of the frequency long press end event
 */
function VIVALDI_frequencyCommandLongPressEndHandler()
{
  clearTimeout(VIVALDI_btnPressRepeatTimeout);
  console.log('%c' + VIVALDI_PREFIX + 'Change frequency button released - VIVALDI_btnPressRepeatStatus: ' + VIVALDI_btnPressRepeatStatus, 'color: ' + VIVALDI_CONSOLE_COLOR);
  VIVALDI_btnPressRepeatStatus = 0;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Repeats click on frequency element
 * @param {number} step - frequency step value
 */
function VIVALDI_frequencyRepeatCommand(step)
{
  VIVALDI_btnPressRepeatTimeout = setInterval(function ()
  {
    VIVALDI_btnPressRepeatStatus += step;
    console.log('%c' + VIVALDI_PREFIX + 'Change frequency button pressed - VIVALDI_btnPressRepeatStatus: ' + VIVALDI_btnPressRepeatStatus, 'color: ' + VIVALDI_CONSOLE_COLOR);
    VIVALDI_radioFrequency(step);
  }, VIVALDI_btnPressRepeatTimer);
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Handler of the commands
 * @param {string} id - device ID
 * @param {string} command - command
 * @param {string} value - extra information
 */
function VIVALDI_commandsHandler(id, command, value)
{
  var message = id + ',';
  var cmd = '';
  switch (command) {
    case 'volumeUp':
      message += '0,0';
      cmd = 'AZC';
      break;

    case 'volumeDown':
      message += '1,0';
      cmd = 'AZC';
      break;

    case 'bassUp':
      message += '2,0';
      cmd = 'AZC';
      break;

    case 'bassDown':
      message += '3,0';
      cmd = 'AZC';
      break;

    case 'trebleUp':
      message += '4,0';
      cmd = 'AZC';
      break;

    case 'trebleDown':
      message += '5,0';
      cmd = 'AZC';
      break;

    case 'muteON':
      message += '10,0';
      cmd = 'AZC';
      break;

    case 'muteOFF':
      message += '11,0';
      cmd = 'AZC';
      break;

    case 'deviceON':
      message += '17,0';
      cmd = 'AZC';
      break;

    case 'setSource':
      var convertedValue = VIVALDI_setSource(value);
      message += '16,' + convertedValue;
      cmd = 'AZC';
      break;

    case 'deviceOFF':
      message += '18,0';
      cmd = 'AZC';
      break;

    case 'radioFrequency':
      message += '1,' + value;
      cmd = 'VSC';
      break;

    case 'previousTrack':
      message += '2,0';
      cmd = 'VSC';
      break;

    case 'nextTrack':
      message += '3,0';
      cmd = 'VSC';
      break;

    case 'previousDirectory':
      message += '4,0';
      cmd = 'VSC';
      break;

    case 'nextDirectory':
      message += '5,0';
      cmd = 'VSC';
      break;

    case 'USBPlay':
      message += '6,0';
      cmd = 'VSC';
      break;

    case 'USBPause':
      message += '7,0';
      cmd = 'VSC';
      break;

    default: // NOP
  }
  AUDIO_GEN_passCommand(cmd, message);
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Sets the new source
 * @param {string} value - value of the source
 * @returns 
 */
function VIVALDI_setSource(value)
{
  var convertedValue = -1;
  switch (value) {
    case 'FM':
    case 'fm':
      convertedValue = 1;
      break;
    case 'AUX':
    case 'aux':
      convertedValue = 9;
      break;
    case 'USB':
    case 'usb':
      convertedValue = 11;
      break;
    case 'MI':
    case 'mi':
      convertedValue = 12;
      break;
    case 'BT':
    case 'bt':
      convertedValue = 14;
      break;
  }
  return convertedValue;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates USB and tuner data
 */
function VIVALDI_updateUSBandTunerData()
{
  if (VIVALDI_PTR_updateVivaldiUSBandTunerData !== null) {
    VIVALDI_PTR_updateVivaldiUSBandTunerData();
  }
  if (typeof AUDIO_GEN_currentDevice.FM_FREQ !== 'undefined') {
    VIVALDI_currentFrequency = parseInt(AUDIO_GEN_currentDevice.FM_FREQ.replace('.', ''));
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */// VARIABLES
var TUTONDO_PREFIX = '[TUTONDO]: ';
var TUTONDO_CONSOLE_COLOR = '#bf80ff'; // Lilla
var TUTONDO_CONSOLE_ERROR = '#ff0000'; // Red

// URLs
var TUTONDO_getAudioZoneURL = 'bridge.php?command=GAZ';
var TUTONDO_getAudioSources = 'bridge.php?command=GAS';

// Pointers - WEBAPP
var TUTONDO_PTR_manageTutondoSoundSource = null;
var TUTONDO_PTR_manageTutondoSoundZoneParameters = null;
var TUTONDO_PTR_manageTutondoSoundZoneSource = null;
var TUTONDO_PTR_loadTutondoAudioZones = null;
var TUTONDO_PTR_loadTutondoAudioSources = null;
var TUTONDO_PTR_loadTutondoAudioPreset = null;
var TUTONDO_PTR_comandiSuperSorgentiHandler = null;

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------ CALLBACKS ------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Module initialization --- Callback WEBAPP
 * @param {function} ptr_manageTutondoSoundSource - pointer to WEBAPP_manageTutondoSoundSource
 * @param {function} ptr_manageTutondoSoundZoneParameters - pointer to WEBAPP_manageTutondoSoundZoneParameters
 * @param {function} ptr_manageTutondoSoundZoneSource - pointer to WEBAPP_manageTutondoSoundZoneSource
 * @param {function} ptr_loadTutondoAudioZones - pointer to WEBAPP_loadTutondoAudioZones
 * @param {function} ptr_loadTutondoAudioSources - pointer to WEBAPP_loadTutondoAudioSources
 * @param {function} ptr_loadTutondoAudioPreset - pointer to WEBAPP_loadTutondoAudioPreset
 * @param {function} ptr_comandiSuperSorgentiHandler - pointer to WEBAPP_comandiSuperSorgentiHandler
 * @version VER205 - WANDA
 */
function TUTONDO_setCallbackForWebapp(ptr_manageTutondoSoundSource,
  ptr_manageTutondoSoundZoneParameters,
  ptr_manageTutondoSoundZoneSource,
  ptr_loadTutondoAudioZones,
  ptr_loadTutondoAudioSources,
  ptr_loadTutondoAudioPreset,
  ptr_comandiSuperSorgentiHandler) 
{
  TUTONDO_PTR_manageTutondoSoundSource = ptr_manageTutondoSoundSource;
  TUTONDO_PTR_manageTutondoSoundZoneParameters = ptr_manageTutondoSoundZoneParameters;
  TUTONDO_PTR_manageTutondoSoundZoneSource = ptr_manageTutondoSoundZoneSource;
  TUTONDO_PTR_loadTutondoAudioZones = ptr_loadTutondoAudioZones;
  TUTONDO_PTR_loadTutondoAudioSources = ptr_loadTutondoAudioSources;
  TUTONDO_PTR_loadTutondoAudioPreset = ptr_loadTutondoAudioPreset;
  TUTONDO_PTR_comandiSuperSorgentiHandler = ptr_comandiSuperSorgentiHandler;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages the content of the upcoming UPDs messages
 * @param {object} parameters - an array containing the parameters of the upcoming UPDs messages
 * @version VER205 - WANDA
 */
function TUTONDO_manageUPD(parameters)
{
  if (parameters[1] === 'S' && parameters[2] === 'T') {	// VER96
    /* VER166 WANDA */
    var progressiveSource = parameters[3];
    var update = parameters[4];
    /* ------------ */
    AUDIO_GEN_audioUPDclick = false; // VER176 WANDA
    if (TUTONDO_PTR_manageTutondoSoundSource !== null) {
      TUTONDO_PTR_manageTutondoSoundSource(progressiveSource, update);
    }
    AUDIO_GEN_audioUPDclick = true; // VER176 WANDA
  }
  else if (parameters[1] === 'Z' && parameters[2] === 'P') {
    /* VER166 WANDA */
    var progressiveZone = parameters[3];
    var state = parameters[4];
    var volumeValue = parameters[5];
    var bassValue = parameters[6];
    var highValue = parameters[7];
    var balanceValue = parameters[8];
    var muteValue = parameters[9];
    /* ------------ */
    if (GUI === 'legacy' || typeof GUI === 'undefined' || GUI === null) { // VER255 WANDA
      if (WEBAPP_actualDevice === progressiveZone) {
        AUDIO_GEN_audioUPDclick = false;
        if (TUTONDO_PTR_manageTutondoSoundZoneParameters !== null) {
          TUTONDO_PTR_manageTutondoSoundZoneParameters(state, volumeValue, bassValue, highValue, balanceValue, muteValue);
        }
        AUDIO_GEN_audioUPDclick = true;
      }
    } else if (GUI === 'akomi') { // VER255 WANDA
      AUDIO_GEN_audioUPDclick = false;
      if (TUTONDO_PTR_manageTutondoSoundZoneParameters !== null) {
        TUTONDO_PTR_manageTutondoSoundZoneParameters(progressiveZone, state, volumeValue, bassValue, highValue, balanceValue, muteValue);
      }
      AUDIO_GEN_audioUPDclick = true;
    }
  }
  else if (parameters[1] === 'Z' && parameters[2] === 'S') {
    /* VER166 WANDA */
    var progressiveZone = parameters[3];
    var sourceIndex = parameters[4];
    /* ------------ */
    if (GUI === 'legacy' || typeof GUI === 'undefined' || GUI === null) { // VER255 WANDA
      if (WEBAPP_actualDevice === progressiveZone) { // VER166 WANDA
        AUDIO_GEN_audioUPDclick = false;
        if (TUTONDO_PTR_manageTutondoSoundZoneSource !== null) {
          TUTONDO_PTR_manageTutondoSoundZoneSource(sourceIndex);
        }
        AUDIO_GEN_audioUPDclick = true;
      }
    } else if (GUI === 'akomi') { // VER255 WANDA
      AUDIO_GEN_audioUPDclick = false;
      if (TUTONDO_PTR_manageTutondoSoundZoneSource !== null) {
        TUTONDO_PTR_manageTutondoSoundZoneSource(sourceIndex);
      }
      AUDIO_GEN_audioUPDclick = true;
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * GAZ - GET AUDIO ZONES
 ** [dato0]: zone progressive;
 ** [dato1]: zone name;
 ** [dato2]: zone status (0 = switched off, 1 = switched on);
 ** [dato3]: zone current value;
 ** [dato4]: zone current balance;
 ** [dato5]: zone current bass;
 ** [dato6]: zone current high;
 ** [dato7]: progressive of the source currently associated with the zone;
 ** [dato8]: mute status (0 = switched off, 1 = switched on);
 * @version VER217 - WANDA
 */
function TUTONDO_loadAudioZones()
{
  var request = new XMLHttpRequest();
  request.open('GET', TUTONDO_getAudioZoneURL, false); // 'false' makes the request synchronous
  request.send(null);
  if (request.readyState === 4) {
    if (request.status === 200) {
      var requestResponseDiv = document.createElement('div');
      requestResponseDiv.innerHTML = request.responseText;
      var record = requestResponseDiv.querySelectorAll('record');
      var index = 0;
      if (GUI === 'legacy' || typeof GUI === 'undefined' || GUI === null) { // VER255 WANDA
        index = parseInt(WEBAPP_actualDevice) - 1;
      } else if (GUI === 'akomi') { // VER255 WANDA
        var device = WEBAPP_getDevice(WEBAPP_actualDevice);
        if (device !== false && typeof device.indirizzoAudio !== 'undefined') {
          index = parseInt(device.indirizzoAudio) - 1;
        }
      }
      if (record !== null && typeof record[index] !== 'undefined') {
        // ZONE STATUS
        var zoneStatus = '';
        if (typeof record[index].getElementsByTagName('dato2')[0] !== 'undefined') {
          zoneStatus = record[index].getElementsByTagName('dato2')[0].innerHTML
        }
        // ZONE VALUE
        var zoneValue = '';
        if (typeof record[index].getElementsByTagName('dato3')[0] !== 'undefined'); {
          zoneValue = record[index].getElementsByTagName('dato3')[0].innerHTML
        }
        // BALANCE
        var zoneBalanceValue = '';
        if (typeof record[index].getElementsByTagName('dato4')[0] !== 'undefined') {
          zoneBalanceValue = record[index].getElementsByTagName('dato4')[0].innerHTML;
        }
        // BASS
        var zoneBassValue = '';
        if (typeof record[index].getElementsByTagName('dato5')[0] !== 'undefined') {
          zoneBassValue = record[index].getElementsByTagName('dato5')[0].innerHTML;
        }
        // HI
        var zoneHighValue = '';
        if (typeof record[index].getElementsByTagName('dato6')[0] !== 'undefined') {
          zoneHighValue = record[index].getElementsByTagName('dato6')[0].innerHTML;
        }
        // SOURCE PROGRESSIVE
        var sourceProgressiveActive = '';
        if (typeof record[index].getElementsByTagName('dato7')[0] !== 'undefined') {
          sourceProgressiveActive = record[index].getElementsByTagName('dato7')[0].innerHTML; // VER217 WANDA
        }
        // MUTE STATUS
        var muteStatus = '';
        if (typeof record[index].getElementsByTagName('dato8')[0] !== 'undefined') {
          muteStatus = record[index].getElementsByTagName('dato8')[0].innerHTML;
        }
        if (TUTONDO_PTR_loadTutondoAudioZones !== null) {
          TUTONDO_PTR_loadTutondoAudioZones(zoneStatus, zoneValue, zoneBalanceValue, zoneBassValue, zoneHighValue, muteStatus);
        }
        AUDIO_GEN_setOverlay();
        TUTONDO_loadAudioSources(parseInt(sourceProgressiveActive) - 1);
        if (TUTONDO_PTR_loadTutondoAudioPreset !== null) {
          TUTONDO_PTR_loadTutondoAudioPreset();
        }
        if (TUTONDO_PTR_comandiSuperSorgentiHandler !== null) {
          TUTONDO_PTR_comandiSuperSorgentiHandler();
        }
      }
    } else {
      console.log('%c' + TUTONDO_PREFIX + 'TUTONDO_loadAudioZones()', 'color: ' + TUTONDO_CONSOLE_ERROR);
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * GAS - GET AUDIO SOURCES
 ** [dato0]: source progressive;
 ** [dato1]: source name;
 ** [dato2]: source type;
 ** [dato3]: current text. This field has value only if the source is a SUPERSOURCE_RADIO or a SUPERSOURCE_MP3. In the first case it will contain the RDS of the radio (if present) or the frequency of the station currently tuned. In the latter case, it will contain the name of the song currently playing;
 ** [dato4]: source status. This field has value only if the source is a SUPERSOURCE_MP3;
 * @param {number} sourceActive - progressive of the source currently associated with the zone
 * @version VER205 - WANDA
 */
function TUTONDO_loadAudioSources(sourceActive)
{
  var request = new XMLHttpRequest;
  request.open('GET', TUTONDO_getAudioSources, false); // 'false' makes the request synchronous
  request.send(null);
  if (request.readyState === 4) {
    if (request.status === 200) {
      var requestResponseDiv = document.createElement('div');
      requestResponseDiv.innerHTML = request.responseText;
      var record = requestResponseDiv.querySelectorAll('record');
      if (TUTONDO_PTR_loadTutondoAudioSources !== null) {
        TUTONDO_PTR_loadTutondoAudioSources(record, sourceActive);
      }
    } else {
      console.log('%c' + TUTONDO_PREFIX + 'TUTONDO_loadAudioSources()', 'color: ' + TUTONDO_CONSOLE_ERROR);
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ *//***************************************************************************************************************************************/
/*                                               THERMO_module version 3.1 WBS 278                                                     */
/***************************************************************************************************************************************/

// VARIABLES
// CONSOLE
var THERMO_PREFIX        = '[THERMO]: ';
var THERMO_CONSOLE_COLOR = '#004de6'; // Blue
var THERMO_CONSOLE_ERROR = '#ff0000'; // Red

// TRESHOLD CONSTS
var THERMO_HUMIDITY_TRESHOLD_L_MIN = 20;
var THERMO_HUMIDITY_TRESHOLD_L_MAX = 60;
var THERMO_HUMIDITY_TRESHOLD_M_MIN = 50;
var THERMO_HUMIDITY_TRESHOLD_M_MAX = 80;
var THERMO_HUMIDITY_TRESHOLD_H_MIN = 70;
var THERMO_HUMIDITY_TRESHOLD_H_MAX = 99;

// SETPOINT CONSTS
var THERMO_SETPOINTVALUE_MIN = 50;
var THERMO_SETPOINTVALUE_MAX = 350;

var THERMO_touchedElement      = null; // VER195 WANDA
var THERMO_draggedSetPoint     = null;
var THERMO_storedSetPointValue = 0;

// Flags
var THERMO_canDragRadius                         = false;
var THERMO_isDragged                             = false;
var THERMO_commandToChangeSetPointHasBeenPressed = false;

// Counters
var THERMO_commandToChangeSetPointCounter = 0;

// Timeouts
var THERMO_sendNewSetPointTimeout      = null;
var THERMO_calculateNewSetPointTimeout = 0;

// Timers
var THERMO_calculateNewSetPointTimer = 300;
var THERMO_sendNewSetPointTimer      = 3000;

/* used in settings_updateseason.htm */ // VER217 WANDA
var THERMO_executeChangeSeasons            = false;
var THERMO_pendingExecuteChangeSeasonIndex = 0;
/* --------------------------------- */

// Pointers - WEBAPP // VER227 WANDA
var THERMO_PTR_updateThermostatTemperatureHTML  = null;
var THERMO_PTR_updateThermostatSetPointHTML     = null;
var THERMO_PTR_updateThermostatOffSetHTML       = null;
var THERMO_PTR_updateThermostatFanLevelHTML     = null;
var THERMO_PTR_updateThermostatSeasonHTML       = null;
var THERMO_PTR_updateThermostatModeHTML         = null;
var THERMO_PTR_updateThermostatLocalOFFHTML     = null;
var THERMO_PTR_updateThermostatWindowStateHTML  = null;
var THERMO_PTR_updateThermostatKeyboardLockHTML = null;
var THERMO_PTR_updateHumidityProbeHTML          = null;
var THERMO_PTR_updateAbanoValueHTML             = null;
var THERMO_PTR_setPointIsBeingModified          = null;
var THERMO_PTR_commandWTSCompleted              = null;

// Pointers DAIKIN - WEBAPP // VER196 WANDA
var THERMO_DAIKIN_PTR_updateDaikinFanSpeedHTML = null;
var THERMO_DAIKIN_PTR_updateDaikinIsOnHTML     = null;
var THERMO_DAIKIN_PTR_updateDaikinModeHTML     = null;

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------ CALLBACKS ------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Managing THERMO/WEBAPP callbacks
 * @param {string}   type_callback - type of the callback to be called
 * @param {function} ptr_callback  - callback function
 * @version VER278 - WANDA
 */
function THERMO_setSingleCallbackForWebapp(type_callback, ptr_callback)
{
  switch(type_callback) {
    case 'updateThermostatTemperatureHTML':
      THERMO_PTR_updateThermostatTemperatureHTML = ptr_callback;
      break;

    case 'updateThermostatSetPointHTML':
      THERMO_PTR_updateThermostatSetPointHTML = ptr_callback;
      break;

    case 'updateThermostatOffSetHTML':
      THERMO_PTR_updateThermostatOffSetHTML = ptr_callback;
      break;

    case 'updateThermostatFanLevelHTML':
      THERMO_PTR_updateThermostatFanLevelHTML = ptr_callback;
      break;

    case 'updateThermostatSeasonHTML':
      THERMO_PTR_updateThermostatSeasonHTML = ptr_callback;
      break;

    case 'updateThermostatModeHTML':
      THERMO_PTR_updateThermostatModeHTML = ptr_callback;
      break;

    case 'updateThermostatLocalOFFHTML':
      THERMO_PTR_updateThermostatLocalOFFHTML = ptr_callback;
      break;

    case 'updateThermostatWindowStateHTML':
      THERMO_PTR_updateThermostatWindowStateHTML = ptr_callback;
      break;

    case 'updateThermostatKeyboardLockHTML':
      THERMO_PTR_updateThermostatKeyboardLockHTML = ptr_callback;
      break;

    case 'updateHumidityProbeHTML':
      THERMO_PTR_updateHumidityProbeHTML = ptr_callback;
      break;

    case 'updateAbanoValueHTML':
      THERMO_PTR_updateAbanoValueHTML = ptr_callback;
      break;

    case 'setPointIsBeingModified':
      THERMO_PTR_setPointIsBeingModified = ptr_callback;
      break;

    case 'commandWTSCompleted':
      THERMO_PTR_commandWTSCompleted = ptr_callback;
      break;
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Module initialization --- Callback WEBAPP
 * @param {function} ptr_updateThermostatTemperatureHTML  - pointer to WEBAPP_updateThermostatTemperatureHTML
 * @param {function} ptr_updateThermostatSetPointHTML     - pointer to WEBAPP_updateThermostatSetPointHTML
 * @param {function} ptr_updateThermostatOffSetHTML       - pointer to WEBAPP_updateThermostatOffSetHTML
 * @param {function} ptr_updateThermostatFanLevelHTML     - pointer to WEBAPP_updateThermostatFanLevelHTML
 * @param {function} ptr_updateThermostatSeasonHTML       - pointer to WEBAPP_updateThermostatSeasonHTML
 * @param {function} ptr_updateThermostatModeHTML         - pointer to WEBAPP_updateThermostatModeHTML
 * @param {function} ptr_updateThermostatLocalOFFHTML     - pointer to WEBAPP_updateThermostatLocalOFFHTML
 * @param {function} ptr_updateThermostatWindowStateHTML  - pointer to WEBAPP_updateThermostatWindowStateHTML
 * @param {function} ptr_updateThermostatKeyboardLockHTML - pointer to WEBAPP_updateThermostatKeyboardLockHTML
 * @param {function} ptr_updateHumidityProbeHTML          - pointer to WEBAPP_updateHumidityProbeHTML
 * @param {function} ptr_updateAbanoValueHTML             - pointer to WEBAPP_updateAbanoValueHTML
 * @param {function} ptr_setPointIsBeingModified          - pointer to WEBAPP_setPointIsBeingModified
 * @param {function} ptr_commandWTSCompleted              - pointer to WEBAPP_commandWTSCompleted
 * @version VER227 - WANDA
 */
function THERMO_setCallbackForWebapp(ptr_updateThermostatTemperatureHTML,
  ptr_updateThermostatSetPointHTML,
  ptr_updateThermostatOffSetHTML,
  ptr_updateThermostatFanLevelHTML,
  ptr_updateThermostatSeasonHTML,
  ptr_updateThermostatModeHTML,
  ptr_updateThermostatLocalOFFHTML,
  ptr_updateThermostatWindowStateHTML,
  ptr_updateThermostatKeyboardLockHTML,
  ptr_updateHumidityProbeHTML,
  ptr_updateAbanoValueHTML,
  ptr_setPointIsBeingModified,
  ptr_commandWTSCompleted)
{
  THERMO_PTR_updateThermostatTemperatureHTML  = ptr_updateThermostatTemperatureHTML;
  THERMO_PTR_updateThermostatSetPointHTML     = ptr_updateThermostatSetPointHTML;
  THERMO_PTR_updateThermostatOffSetHTML       = ptr_updateThermostatOffSetHTML;
  THERMO_PTR_updateThermostatFanLevelHTML     = ptr_updateThermostatFanLevelHTML;
  THERMO_PTR_updateThermostatSeasonHTML       = ptr_updateThermostatSeasonHTML;
  THERMO_PTR_updateThermostatModeHTML         = ptr_updateThermostatModeHTML;
  THERMO_PTR_updateThermostatLocalOFFHTML     = ptr_updateThermostatLocalOFFHTML;
  THERMO_PTR_updateThermostatWindowStateHTML  = ptr_updateThermostatWindowStateHTML;
  THERMO_PTR_updateThermostatKeyboardLockHTML = ptr_updateThermostatKeyboardLockHTML;
  THERMO_PTR_updateHumidityProbeHTML          = ptr_updateHumidityProbeHTML;
  THERMO_PTR_updateAbanoValueHTML             = ptr_updateAbanoValueHTML;
  THERMO_PTR_setPointIsBeingModified          = ptr_setPointIsBeingModified;
  THERMO_PTR_commandWTSCompleted              = ptr_commandWTSCompleted;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Module initialization --- Callback WEBAPP
 * @param {function} ptr_updateDaikinFanSpeedHTML - pointer to WEBAPP_updateDaikinFanSpeedHTML
 * @param {function} ptr_updateDaikinIsOnHTML     - pointer to WEBAPP_updateDaikinIsOnHTML
 * @param {function} ptr_updateDaikinModeHTML     - pointer to WEBAPP_updateDaikinModeHTML
 * @version VER196 - WANDA
 */
function THERMO_DAIKIN_setCallbackForWebapp(ptr_updateDaikinFanSpeedHTML, ptr_updateDaikinIsOnHTML, ptr_updateDaikinModeHTML)
{
  THERMO_DAIKIN_PTR_updateDaikinFanSpeedHTML = ptr_updateDaikinFanSpeedHTML;
  THERMO_DAIKIN_PTR_updateDaikinIsOnHTML     = ptr_updateDaikinIsOnHTML;
  THERMO_DAIKIN_PTR_updateDaikinModeHTML     = ptr_updateDaikinModeHTML;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages the thermostat status updates
 * @param {object} eventInfo - object containing update infomation
 * @version VER196 - WANDA
 */
function THERMO_manageStatusUpdates(eventInfo)
{
  if (typeof eventInfo !== 'undefined' && eventInfo !== null) {
    if (typeof eventInfo.eventType !== 'undefined') {
      switch (eventInfo.eventType.toLowerCase().trim()) {
        // TEMPERATURE
        case 'thermostattemperature':
          if (typeof eventInfo.deviceList !== 'undefined' && typeof eventInfo.id !== 'undefined' && typeof eventInfo.temperature !== 'undefined') {
            THERMO_updateThermostatTemperatureStructure(eventInfo.deviceList, eventInfo.id, eventInfo.temperature);
            if (THERMO_PTR_updateThermostatTemperatureHTML !== null) {
              THERMO_PTR_updateThermostatTemperatureHTML(eventInfo.id, eventInfo.temperature);
            }
          }
          break;

        // SETPOINT  
        case 'thermostatsetpoint':
          if (typeof eventInfo.deviceList !== 'undefined' && typeof eventInfo.id !== 'undefined' && typeof eventInfo.setPoint !== 'undefined') {
            THERMO_updateThermostatSetPointStructure(eventInfo.deviceList, eventInfo.id, eventInfo.setPoint);
            if (THERMO_PTR_updateThermostatSetPointHTML !== null) {
              THERMO_PTR_updateThermostatSetPointHTML(eventInfo.id, eventInfo.setPoint);
            }
          }
          break;

        // OFFSET  
        case 'thermostatoffset':
          if (typeof eventInfo.deviceList !== 'undefined' && typeof eventInfo.id !== 'undefined' && typeof eventInfo.offSet !== 'undefined') {
            THERMO_updateThermostatOffSetStructure(eventInfo.deviceList, eventInfo.id, eventInfo.offSet);
            if (THERMO_PTR_updateThermostatOffSetHTML !== null) {
              THERMO_PTR_updateThermostatOffSetHTML(eventInfo.id, eventInfo.offSet);
            }
          }
          break;

        // FAN LEVEL
        case 'thermostatfanlevel':
          if (typeof eventInfo.deviceList !== 'undefined' && typeof eventInfo.id !== 'undefined' && typeof eventInfo.fanLevel !== 'undefined' && typeof eventInfo.isGeneratedByMapMode !== 'undefined') {
            THERMO_updateThermostatFanLevelStructure(eventInfo.deviceList, eventInfo.id, eventInfo.fanLevel);
            if (THERMO_PTR_updateThermostatFanLevelHTML !== null) {
              THERMO_PTR_updateThermostatFanLevelHTML(eventInfo.id, eventInfo.fanLevel, eventInfo.isGeneratedByMapMode);
            }
          }
          break;

        // SEASON
        case 'thermostatseason':
          if (typeof eventInfo.deviceList !== 'undefined' && typeof eventInfo.id !== 'undefined' && typeof eventInfo.season !== 'undefined' && typeof eventInfo.isGeneratedByMapMode !== 'undefined') {
            THERMO_updateThermostatSeasonStructure(eventInfo.deviceList, eventInfo.id, eventInfo.season);
            if (THERMO_PTR_updateThermostatSeasonHTML !== null) {
              THERMO_PTR_updateThermostatSeasonHTML(eventInfo.id, eventInfo.season, eventInfo.isGeneratedByMapMode);
            }
          }
          break;

        // MODE
        case 'thermostatmode':
          if (typeof eventInfo.deviceList !== 'undefined' && typeof eventInfo.id !== 'undefined' && typeof eventInfo.mode !== 'undefined') {
            THERMO_updateThermostatModeStructure(eventInfo.deviceList, eventInfo.id, eventInfo.mode);
            if (THERMO_PTR_updateThermostatModeHTML !== null) {
              THERMO_PTR_updateThermostatModeHTML(eventInfo.id, eventInfo.mode);
            }
          }
          break;

        // LOCALOFF
        case 'thermostatlocaloff':
          if (typeof eventInfo.deviceList !== 'undefined' && typeof eventInfo.id !== 'undefined' && typeof eventInfo.localOFF !== 'undefined' && typeof eventInfo.isGeneratedByMapMode !== 'undefined') {
            THERMO_updateThermostatLocalOFFStructure(eventInfo.deviceList, eventInfo.id, eventInfo.localOFF);
            if (THERMO_PTR_updateThermostatLocalOFFHTML !== null) {
              THERMO_PTR_updateThermostatLocalOFFHTML(eventInfo.id, eventInfo.localOFF, eventInfo.isGeneratedByMapMode)
            }
          }
          break;

        // WINDOW STATE
        case 'thermostatwindowstate':
          if (typeof eventInfo.deviceList !== 'undefined' && typeof eventInfo.id !== 'undefined' && typeof eventInfo.windowState !== 'undefined') {
            THERMO_updateThermostatWindowStateStructure(eventInfo.deviceList, eventInfo.id, eventInfo.windowState);
            if (THERMO_PTR_updateThermostatWindowStateHTML !== null) {
              THERMO_PTR_updateThermostatWindowStateHTML(eventInfo.id, eventInfo.windowState);
            }
          }
          break;

        // KEYBOARD LOCK
        case 'thermostatkeyboardlock':
          if (typeof eventInfo.deviceList !== 'undefined' && typeof eventInfo.id !== 'undefined' && typeof eventInfo.keyboardLock !== 'undefined') {
            THERMO_updateThermostatKeyboardLockStructure(eventInfo.deviceList, eventInfo.id, eventInfo.keyboardLock);
            if (THERMO_PTR_updateThermostatKeyboardLockHTML !== null) {
              THERMO_PTR_updateThermostatKeyboardLockHTML(eventInfo.id, eventInfo.keyboardLock);
            }
          }
          break;

        // ALL FIELDS
        case 'allthermostatsstatus':
          if (typeof eventInfo.deviceList !== 'undefined' && typeof eventInfo.parameters !== 'undefined' && typeof eventInfo.records !== 'undefined') {
            THERMO_updateAllFieldsStructure(eventInfo.deviceList, eventInfo.parameters, eventInfo.records);
          }
          break;

        // DAIKIN - FAN LEVEL
        case 'daikinfanspeed': // VER175 WANDA
          if (typeof eventInfo.device !== 'undefined' && typeof eventInfo.fanSpeed !== 'undefined' && typeof eventInfo.id !== 'undefined') {
            THERMO_DAIKIN_updateDaikinFanSpeedStructure(eventInfo.device, eventInfo.fanSpeed);
            if (THERMO_DAIKIN_PTR_updateDaikinFanSpeedHTML !== null) {
              THERMO_DAIKIN_PTR_updateDaikinFanSpeedHTML(eventInfo.id, eventInfo.fanSpeed);
            }
          }
          break;

        // DAIKIN - LOCALOFF
        case 'daikinison': // VER175 WANDA
          if (typeof eventInfo.device !== 'undefined' && typeof eventInfo.isOn !== 'undefined' && typeof eventInfo.id !== 'undefined') {
            THERMO_DAIKIN_updateDaikinIsOnStructure(eventInfo.device, eventInfo.isOn);
            if (THERMO_DAIKIN_PTR_updateDaikinIsOnHTML !== null) {
              THERMO_DAIKIN_PTR_updateDaikinIsOnHTML(eventInfo.id, eventInfo.isOn);
            }
          }
          break;

        // DAIKIN - MODE
        case 'daikinmode': // VER175 WANDA
          if (typeof eventInfo.device !== 'undefined' && typeof eventInfo.mode !== 'undefined' && typeof eventInfo.id !== 'undefined') {
            THERMO_DAIKIN_updateDaikinModeStructure(eventInfo.device, eventInfo.mode);
            if (THERMO_DAIKIN_PTR_updateDaikinModeHTML !== null) {
              THERMO_DAIKIN_PTR_updateDaikinModeHTML(eventInfo.id, eventInfo.mode);
            }
          }
          break;

        // HUMIDITY PROBE
        case 'humidityprobe': // VER177 WANDA
          if (typeof eventInfo.deviceList !== 'undefined' && typeof eventInfo.id !== 'undefined' && typeof eventInfo.humidityValue !== 'undefined' && typeof eventInfo.humidityThresholdL !== 'undefined' && typeof eventInfo.humidityThresholdM !== 'undefined' && typeof eventInfo.humidityThresholdH !== 'undefined' && typeof eventInfo.humidityHysteresis !== 'undefined' && typeof eventInfo.humidityStatusDehumificator !== 'undefined' && typeof eventInfo.humidityStatusValve !== 'undefined' && typeof eventInfo.humidityStatusGeneralPump !== 'undefined' && typeof eventInfo.humidityAlarm !== 'undefined') {
            THERMO_updateHumidityProbeStructure(eventInfo.deviceList, eventInfo.id, eventInfo.humidityValue, eventInfo.humidityThresholdL, eventInfo.humidityThresholdM, eventInfo.humidityThresholdH, eventInfo.humidityHysteresis, eventInfo.humidityStatusDehumificator, eventInfo.humidityStatusValve, eventInfo.humidityStatusGeneralPump, eventInfo.humidityAlarm);
            if (THERMO_PTR_updateHumidityProbeHTML !== null) {
              THERMO_PTR_updateHumidityProbeHTML(eventInfo.id, eventInfo.humidityValue, eventInfo.humidityThresholdL, eventInfo.humidityThresholdM, eventInfo.humidityThresholdH, eventInfo.humidityStatusDehumificator, eventInfo.humidityStatusValve, eventInfo.humidityStatusGeneralPump);
            }
          }
          break;

        // ABANO
        case 'abanovalue': // VER192 WANDA
          if (typeof eventInfo.deviceList !== 'undefined' && typeof eventInfo.id !== 'undefined' && typeof eventInfo.ValoreConvertito !== 'undefined' && typeof eventInfo.UnitaMisura !== 'undefined') {
            THERMO_updateAbanoValue(eventInfo.deviceList, eventInfo.id, eventInfo.ValoreConvertito, eventInfo.UnitaMisura);
            if (THERMO_PTR_updateAbanoValueHTML !== null) {
              THERMO_PTR_updateAbanoValueHTML(eventInfo.id, eventInfo.ValoreConvertito, eventInfo.UnitaMisura);
            }
          }
          break;

        default:
      }
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* -------------------------------------------------------------------------- STRUCTURES ---------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates the TEMPERATURE field of a specific device object
 * @param {object} deviceList  - Array of objects containing devices informations
 * @param {string} id          - ID of the device to be updated
 * @param {string} temperature - New temperature value
 * @version VER195 - WANDA
 */
function THERMO_updateThermostatTemperatureStructure(deviceList, id, temperature)
{
  for (var i = 0; i < deviceList.length; i++) {
    if (typeof deviceList[i].id !== 'undefined' && deviceList[i].id === id) {
      if (typeof deviceList[i].temperature !== 'undefined') {
        deviceList[i].temperature = (parseInt(temperature) / 10).toFixed(1);
        break; // Once found and updated there is no need to continue
      }
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates the SETPOINT field of a specific device object
 * @param {object} deviceList - Array of objects containing devices informations
 * @param {string} id         - iD of the device to be updated 
 * @param {string} setPoint   - New setPoint value
 * @version VER195 - WANDA
 */
function THERMO_updateThermostatSetPointStructure(deviceList, id, setPoint)
{
  for (var i = 0; i < deviceList.length; i++) {
    if (typeof deviceList[i].id !== 'undefined' && deviceList[i].id === id) {
      if (typeof deviceList[i].setPoint !== 'undefined') {
        deviceList[i].setPoint = (parseInt(setPoint) / 10).toFixed(1);
        break; // Once found and updated there is no need to continue
      }
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates the OFFSET field of a specific device object
 * @param {object} deviceList - Array of objects containing devices informations
 * @param {string} id         - ID of the device to be updated
 * @param {string} offSet     - New offSet value
 * @version VER195 - WANDA
 */
function THERMO_updateThermostatOffSetStructure(deviceList, id, offSet)
{
  for (var i = 0; i < deviceList.length; i++) {
    if (typeof deviceList[i].id !== 'undefined' && deviceList[i].id === id) {
      if (typeof deviceList[i].offSet !== 'undefined') {
        var offSetToUpdate = parseInt(offSet) / 10;
        if (offSetToUpdate > 0) {
          deviceList[i].offSet = '+' + offSetToUpdate.toString();
        } else {
          deviceList[i].offSet = offSetToUpdate.toString();
        }
        break; // Once found and updated there is no need to continue
      }
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates the FANLEVEL field of a specific device object
 * @param {object} deviceList - Array of objects containing devices informations
 * @param {string} id         - ID of the device to be updated 
 * @param {string} fanLevel   - New fanLevel value
 * @version VER195 - WANDA
 */
function THERMO_updateThermostatFanLevelStructure(deviceList, id, fanLevel)
{
  for (var i = 0; i < deviceList.length; i++) {
    if (typeof deviceList[i].id !== 'undefined' && deviceList[i].id === id) {
      if (typeof deviceList[i].fanLevel !== 'undefined' && typeof deviceList[i].season !== 'undefined') {
        deviceList[i].fanLevel = parseInt(fanLevel);
        if (parseInt(deviceList[i].season) === 1) {
          deviceList[i].fanLevel = deviceList[i].fanLevel + 128;
        }
        break; // Once found and updated there is no need to continue
      }
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
* Updates the SEASON field of a specific device object
* @param {object} deviceList - Array of objects containing devices informations
* @param {string} id         - ID of the device to be updated 
* @param {string} season     - New season value
* @version VER195 - WANDA
*/
function THERMO_updateThermostatSeasonStructure(deviceList, id, season)
{
  for (var i = 0; i < deviceList.length; i++) {
    if (typeof deviceList[i].id !== 'undefined' && deviceList[i].id === id) {
      if (typeof deviceList[i].season !== 'undefined') {
        deviceList[i].season = parseInt(season) & 0x01;
        break; // Once found and updated there is no need to continue
      }
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates the MODE field of a specific device object
 * @param {object} deviceList - Array of objects containing devices informations
 * @param {string} id         - ID of the device to be updated 
 * @param {string} mode       - New mode value
 * @version VER195 - WANDA
 */
function THERMO_updateThermostatModeStructure(deviceList, id, mode)
{
  for (var i = 0; i < deviceList.length; i++) {
    if (typeof deviceList[i].id !== 'undefined' && deviceList[i].id === id) {
      if (typeof deviceList[i].mode !== 'undefined') {
        if (mode === 'M') {
          deviceList[i].mode = 1;
        } else {
          deviceList[i].mode = 0;
        }
        break; // Once found and updated there is no need to continue
      }
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates the LOCALOFF field of a specific device object
 * @param {object} deviceList - Array of objects containing devices informations
 * @param {string} id         - ID of the device to be updated 
 * @param {string} localOFF   - New localOFF value
 * @version VER195 - WANDA
 */
function THERMO_updateThermostatLocalOFFStructure(deviceList, id, localOFF)
{
  for (var i = 0; i < deviceList.length; i++) {
    if (typeof deviceList[i].id !== 'undefined' && deviceList[i].id === id) {
      if (typeof deviceList[i].localOFF !== 'undefined') {
        deviceList[i].localOFF = parseInt(localOFF);
        break; // Once found and updated there is no need to continue
      }
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates the WINDOWSTATE field of a specific device object
 * @param {object} deviceList  - Array of objects containing devices informations
 * @param {string} id          - ID of the device to be updated 
 * @param {string} windowState - New windowState value
 * @version VER195 - WANDA
 */
function THERMO_updateThermostatWindowStateStructure(deviceList, id, windowState)
{
  for (var i = 0; i < deviceList.length; i++) {
    if (typeof deviceList[i].id !== 'undefined' && deviceList[i].id === id) {
      if (typeof deviceList[i].windowState !== 'undefined') {
        deviceList[i].windowState = parseInt(windowState);
        break; // Once found and updated there is no need to continue
      }
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates the KEYBOARDLOCK field of a specific device object
 * @param {object} deviceList   - Array of objects containing devices informations
 * @param {string} id           - ID of the device to be updated 
 * @param {string} keyboardLock - New keyboard lock value
 * @version VER195 - WANDA
 */
function THERMO_updateThermostatKeyboardLockStructure(deviceList, id, keyboardLock)
{
  for (var i = 0; i < deviceList.length; i++) {
    if (typeof deviceList[i].id !== 'undefined' && deviceList[i].id === id) {
      if (typeof deviceList[i].keyboardLock !== 'undefined') {
        deviceList[i].keyboardLock = parseInt(keyboardLock);
        break; // Once found and updated there is no need to continue
      }
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates ALL the fields of a specific device object
 * @param {object} deviceList - Array of objects containing device informations
 * @param {object} parameters - Array containing the id (string) of the device to update
 * @param {object} records    - Array of strings containing updated values:
 ** [0][0]: device response;
 ** [0][1]: device fanLevel;
 ** [0][2]: device configuration;
 ** [0][3]: device offSet;
 ** [0][4]: device season;
 ** [0][5]: device temperature;
 ** [0][6]: device mode;
 ** [0][7]: device setPoint;
 ** [0][8]: device forced mode;
 ** [0][9]: device localOFF;
 * @version VER217D - WANDA
 */
function THERMO_updateAllFieldsStructure(deviceList, parameters, records)
{
  for (var i = 0; i < deviceList.length; i++) {
    if (typeof deviceList[i].id !== 'undefined' && deviceList[i].id === parameters[0]) {
      // UPDATING TEMPERATURE
      if (typeof deviceList[i].temperature !== 'undefined') {
        deviceList[i].temperature = ((parseInt(records[0][5])) / 10).toFixed(1);
      }
      // UPDATING SETPOINT
      if (typeof deviceList[i].setPoint !== 'undefined') {
        deviceList[i].setPoint = ((parseInt(records[0][7])) / 10).toFixed(1);
      }
      // UPDATING OFFSET
      if (typeof deviceList[i].offSet !== 'undefined') {
        var offset = parseInt(records[0][3]) / 10;
        if (offset > 0) {
          deviceList[i].offSet = '+' + offset.toString();
        } else {
          deviceList[i].offSet = offset.toString();
        }
      }
      // UPDATING FANLEVEL AND SEASON
      if (typeof deviceList[i].fanLevel !== 'undefined' && typeof deviceList[i].season !== 'undefined') {
        deviceList[i].fanLevel = parseInt(records[0][1]);
        if (parseInt(records[0][0]) === 0) {
          deviceList[i].fanLevel = 0;
        }
        deviceList[i].season = parseInt(records[0][4]) & 0x01;
        if (deviceList[i].season === 1) {
          deviceList[i].fanLevel = deviceList[i].fanLevel + 128;
        }
      }
      // UPDATING MODE
      if (typeof deviceList[i].mode !== 'undefined') {
        deviceList[i].mode = parseInt(records[0][6]);
        if (parseInt(records[0][8]) === 1) {
          deviceList[i].mode = '1F';
        }
      }
      // UPDATING LOCALOFF
      if (typeof deviceList[i].localOFF !== 'undefined') {
        deviceList[i].localOFF = parseInt(records[0][9]);
      }
      // UPDATING CONFIGURATION
      if (typeof deviceList[i].configuration !== 'undefined') {
        deviceList[i].configuration = parseInt(records[0][2]);
        // UPDATING ANTIFREEZE
        if (typeof deviceList[i].antifreeze !== 'undefined') {
          deviceList[i].antifreeze = deviceList[i].configuration % 2;
        }
        if (typeof deviceList[i].name !== 'undefined') {
          if (DOMINAPLUS_MANAGER_webSocketAvailable && (deviceList[i].configuration > 1 || deviceList[i].name.substr(0, 9) === 'TS1Server' || (typeof deviceList[i].TS01 !== 'undefined' && deviceList[i].TS01 === true))) { // VER217D WANDA
            if (deviceList[i].name.indexOf('*') === -1) {
              deviceList[i].name = deviceList[i].name + '*';
              // UPDATING HUMIDITY PROBE
              var bIsHumidityProbe = ((deviceList[i].configuration >> 1) & 0x03) === 2;
              if (bIsHumidityProbe === true) {
                // VER192E WANDA - humidity structures are created here!
                deviceList[i].isHumidityProbe = true;
                deviceList[i].humidityEnabled = (parseInt(records[0][4]) & 0x10) >> 4;
                deviceList[i].humidityValue = 0;
                deviceList[i].humidityThresholdL = 0;
                deviceList[i].humidityThresholdM = 0;
                deviceList[i].humidityThresholdH = 0;
                deviceList[i].humidityHysteresis = 1;
                deviceList[i].humidityStatusDehumificator = 0;
                deviceList[i].humidityStatusValve = 0;
                deviceList[i].humidityStatusGeneralPump = 0;
                deviceList[i].humidityAlarm = 0;
              }
              // IOT STYLE - VER205B WANDA
              var bIsIoTStyle = ((parseInt(records[0][4]) >> 5) & 0x01) === 1;
              if (bIsIoTStyle === true) {
                deviceList[i].isIoT = true;
                deviceList[i].humidityValue = 0; // VER212 WANDA
              }
            }
            // UPDATING KEYBOARD LOCK
            if (typeof deviceList[i].keyboardLock !== 'undefined') {
              deviceList[i].keyboardLock = (deviceList[i].configuration & 0x40) >> 6;
            }
            // UPDATING WINDOW VISIBILITY
            if (typeof deviceList[i].windowVisibility !== 'undefined') {
              deviceList[i].windowVisibility = (deviceList[i].configuration & 0x80) >> 7;
            }
          }
        }
      }
      if (THERMO_PTR_commandWTSCompleted !== null) {
        THERMO_PTR_commandWTSCompleted(deviceList[i].id);
      }
      break; // Once found and updated there is no need to continue
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates the FANSPEED field of a specific DAIKIN device object
 * @param {object} device   - Object containing all the informations about the selected device
 * @param {string} fanSpeed - The new fanSpeed value
 * @version VER196 - WANDA
 */
function THERMO_DAIKIN_updateDaikinFanSpeedStructure(device, fanSpeed)
{
  if (typeof device.fanspeed !== 'undefined') {
    device.fanspeed = parseInt(fanSpeed);
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates the ISON field of a specific DAIKIN device object
 * @param {object} device - Object containing all the informations about the selected device
 * @param {string} isOn   - The new isOn value
 * @version VER196 - WANDA
 */
function THERMO_DAIKIN_updateDaikinIsOnStructure(device, isOn)
{
  if (typeof device.isOn !== 'undefined') {
    device.isOn = parseInt(isOn);
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates the MODE field of a specific DAIKIN device object
 * @param {object} device - object containing all the informations about the selected device
 * @param {string} mode   - the new mode value
 * @version VER196 - WANDA
 */
function THERMO_DAIKIN_updateDaikinModeStructure(device, mode)
{
  if (typeof device.mode !== 'undefined') {
    device.mode = parseInt(mode);
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates the HUMIDITYPROBE fields of a specific device object
 * @param {object} deviceList                  - Array of objects containing devices informations
 * @param {string} id                          - ID of the device to be updated
 * @param {number} humidityValue               - New humidityValue value
 * @param {number} humidityThresholdL          - New humidityThresholdL value
 * @param {number} humidityThresholdM          - New humidityThresholdM value
 * @param {number} humidityThresholdH          - New humidityThresholdH value
 * @param {number} humidityHysteresis          - New humidityHysteresis value
 * @param {number} humidityStatusDehumificator - New humidityStatusDehumificator value
 * @param {number} humidityStatusValve         - New humidityStatusValve value
 * @param {number} humidityStatusGeneralPump   - New humidityStatusGeneralPump value
 * @param {number} humidityAlarm               - New humidityAlarm value
 * @version VER195 - WANDA
 */
function THERMO_updateHumidityProbeStructure(deviceList, id, humidityValue, humidityThresholdL, humidityThresholdM, humidityThresholdH, humidityHysteresis, humidityStatusDehumificator, humidityStatusValve, humidityStatusGeneralPump, humidityAlarm)
{
  for (var i = 0; i < deviceList.length; i++) {
    if (typeof deviceList[i].id !== 'undefined' && deviceList[i].id === id) {
      // UPDATING HUMIDITY VALUE
      if (typeof deviceList[i].humidityValue !== 'undefined') {
        deviceList[i].humidityValue = humidityValue;
      }
      // UPDATING HUMIDITY THRESHOLD L
      if (typeof deviceList[i].humidityThresholdL !== 'undefined') {
        if (humidityThresholdL < THERMO_HUMIDITY_TRESHOLD_L_MIN) {
          deviceList[i].humidityThresholdL = THERMO_HUMIDITY_TRESHOLD_L_MIN;
        } else if (humidityThresholdL > THERMO_HUMIDITY_TRESHOLD_L_MAX) {
          deviceList[i].humidityThresholdL = THERMO_HUMIDITY_TRESHOLD_L_MAX;
        } else {
          deviceList[i].humidityThresholdL = humidityThresholdL;
        }
      }
      // UPDATING HIMIDITY THRESHOLD M
      if (typeof deviceList[i].humidityThresholdM !== 'undefined') {
        if (humidityThresholdM < THERMO_HUMIDITY_TRESHOLD_M_MIN) {
          deviceList[i].humidityThresholdM = THERMO_HUMIDITY_TRESHOLD_M_MIN;
        } else if (humidityThresholdM > THERMO_HUMIDITY_TRESHOLD_M_MAX) {
          deviceList[i].humidityThresholdM = THERMO_HUMIDITY_TRESHOLD_M_MAX;
        } else {
          deviceList[i].humidityThresholdM = humidityThresholdM;
        }
      }
      // UPDATING HUMIDITY THRESHOLD H
      if (typeof deviceList[i].humidityThresholdH !== 'undefined') {
        if (humidityThresholdH < THERMO_HUMIDITY_TRESHOLD_H_MIN) {
          deviceList[i].humidityThresholdH = THERMO_HUMIDITY_TRESHOLD_H_MIN;
        } else if (humidityThresholdH > THERMO_HUMIDITY_TRESHOLD_H_MAX) {
          deviceList[i].humidityThresholdH = THERMO_HUMIDITY_TRESHOLD_H_MAX;
        } else {
          deviceList[i].humidityThresholdH = humidityThresholdH;
        }
      }
      // UPDATING HUMIDITY HYSTERESIS
      if (typeof deviceList[i].humidityHysteresis !== 'undefined') {
        deviceList[i].humidityHysteresis = humidityHysteresis;
      }
      // UPDATING HUMIDITY DEHUMIFICATOR
      if (typeof deviceList[i].humidityStatusDehumificator !== 'undefined') {
        deviceList[i].humidityStatusDehumificator = humidityStatusDehumificator;
      }
      // UPDATING HUMIDITY STATUS VALUE
      if (typeof deviceList[i].humidityStatusValve !== 'undefined') {
        deviceList[i].humidityStatusValve = humidityStatusValve;
      }
      // UPDATING HUMIDITY STATUS GENERAL PUMP
      if (typeof deviceList[i].humidityStatusGeneralPump !== 'undefined') {
        deviceList[i].humidityStatusGeneralPump = humidityStatusGeneralPump;
      }
      // UPDATING HUMIDITY ALARM
      if (typeof deviceList[i].humidityAlarm !== 'undefined') {
        deviceList[i].humidityAlarm = humidityAlarm;
      }
      break; // Once found and updated there is no need to continue
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates the ABANOVALUE fields of a specific device object
 * @param {object} deviceList       - Array of objects containing devices informations
 * @param {string} id               - ID of the device to be updated
 * @param {string} valoreConvertito - New ValoreConvertito value
 * @param {string} unitaMisura      - New UnitaMisura value
 * @version VER195 - WANDA
 */
function THERMO_updateAbanoValue(deviceList, id, valoreConvertito, unitaMisura)
{
  for (var i = 0; i < deviceList.length; i++) {
    if (typeof deviceList[i].id !== 'undefined' && deviceList[i].id === id) {
      // CONVERTED VALUE
      if (typeof deviceList[i].ValoreConvertito !== 'undefined') {
        deviceList[i].ValoreConvertito = valoreConvertito;
      }
      // UNIT OF MEASURE
      if (typeof deviceList[i].UnitaMisura !== 'undefined') {
        deviceList[i].UnitaMisura = unitaMisura;
      }
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ---------------------------------------------------------------------- GENERAL FUNCTIONS ------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Sends the new setPoint value (eventually also the season value and the mode value) of the current device
 * @param {number} deviceID - ID of the current device
 * @param {number} setPoint - The new setPoint value to send
 * @version VER227 - WANDA
 */
function THERMO_sendNewSetPoint(deviceID, setPoint)
{
  var unalteredSeason = null;
  var manualModeBecauseNewSetPointIsSetFromClient = 1; // VER189 STEFANO
  for (var i = 0; i < DOMINAPLUS_MANAGER_deviceList.length; i++) {
    if (typeof DOMINAPLUS_MANAGER_deviceList[i].id !== 'undefined' && parseInt(DOMINAPLUS_MANAGER_deviceList[i].id) === parseInt(deviceID)) {
      if (typeof DOMINAPLUS_MANAGER_deviceList[i].season !== 'undefined') {
        unalteredSeason = DOMINAPLUS_MANAGER_deviceList[i].season;
        break; // Once found and updated there is no need to continue
      }
    }
  }
  if (unalteredSeason !== null) { // VER189 STEFANO
    if (DOMINAPLUS_MANAGER_webSocketAvailable) {
      DOMINAPLUS_MANAGER_sendWSCommand('STS', deviceID.toString(), [unalteredSeason + ',' + manualModeBecauseNewSetPointIsSetFromClient + ',' + setPoint]);
    }
    if (THERMO_PTR_setPointIsBeingModified !== null) {
      THERMO_PTR_setPointIsBeingModified('END');
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Calculates the new setPoint value when cmd_minus or cmd_plus is pressed
 * @param {string} deviceID     - The id of the current device
 * @param {number} currentValue - The current value of the setPoint
 * @param {number} offset       - The current value of the offset
 * @param {number} move         - +1 or -1
 * @version VER197 - WANDA
 */
function THERMO_calculateNewSetPointOnMinusAndPlusClick(deviceID, currentValue, offset, move)
{
  if (THERMO_commandToChangeSetPointHasBeenPressed === true) {
    if (THERMO_PTR_setPointIsBeingModified !== null) {
      THERMO_PTR_setPointIsBeingModified('START');
    }
    if (move === 1) {
      THERMO_commandToChangeSetPointCounter++;
    } else {
      THERMO_commandToChangeSetPointCounter--;
    }
    if ((currentValue + THERMO_commandToChangeSetPointCounter + offset) >= THERMO_SETPOINTVALUE_MAX) {
      THERMO_commandToChangeSetPointCounter = THERMO_SETPOINTVALUE_MAX - currentValue - offset;
    } else if ((currentValue + THERMO_commandToChangeSetPointCounter + offset) <= THERMO_SETPOINTVALUE_MIN) {
      THERMO_commandToChangeSetPointCounter = THERMO_SETPOINTVALUE_MIN - currentValue - offset;
    }
    var newSetPoint = currentValue + THERMO_commandToChangeSetPointCounter;
    if (THERMO_PTR_updateThermostatSetPointHTML !== null) {
      THERMO_PTR_updateThermostatSetPointHTML(deviceID.toString(), newSetPoint);
    }
    THERMO_storedSetPointValue = newSetPoint;
    THERMO_calculateNewSetPointTimeout = setTimeout('THERMO_calculateNewSetPointOnMinusAndPlusClick(' + deviceID + ', ' + currentValue + ',' + offset + ', ' + move + ')', THERMO_calculateNewSetPointTimer);
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Sends the new season value of the current device --- used in settings_updateseason.htm
 * @param {number} season   - The season value to send
 * @param {number} deviceID - ID of the current device
 * @version VER217 - WANDA
 */
function THERMO_sendNewSeason(season, deviceID)
{
  var unalteredSetPoint = null;
  var unalteredMode = null;
  for (var i = 0; i < DOMINAPLUS_MANAGER_deviceList.length; i++) {
    if (typeof DOMINAPLUS_MANAGER_deviceList[i].id !== 'undefined' && parseInt(DOMINAPLUS_MANAGER_deviceList[i].id) === parseInt(deviceID)) {
      if (typeof DOMINAPLUS_MANAGER_deviceList[i].setPoint !== 'undefined') {
        unalteredSetPoint = DOMINAPLUS_MANAGER_deviceList[i].setPoint * 10; // VER191 WANDA
      }
      if (typeof DOMINAPLUS_MANAGER_deviceList[i].mode !== 'undefined') {
        unalteredMode = DOMINAPLUS_MANAGER_deviceList[i].mode;
      }
      break; // Once found and updated there is no need to continue
    }
  }
  if (unalteredSetPoint !== null && unalteredMode !== null) {
    if (DOMINAPLUS_MANAGER_webSocketAvailable) { // VER193 WANDA
      DOMINAPLUS_MANAGER_sendWSCommand('STS', deviceID.toString(), [season + ',' + unalteredMode + ',' + unalteredSetPoint]); // VER197 WANDA
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updated the structures of a device when clicking cmd_minus or cmd_plus
 * @param {object} device - object containing all the informations about the selected device
 * @returns device mode
 * @version VER227 - WANDA
 */
function THERMO_updateStructuresOnMinusAndPlusClick(device)
{
  if (typeof device.mode !== 'undefined' && parseInt(device.mode) === 0) {
    device.mode = 1;
  }
  return device.mode;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ---------------------------------------------------------------------- VMC DAIKIN MODBUS ------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Sends the new on/off value
 * @param {number} id       - The id of the device
 * @param {number} newState - The new state
 * @version VER196 - WANDA
 */
function THERMO_DAIKIN_VMCDaikinModbusSendONOFF(id, newState)
{
  DOMINAPLUS_MANAGER_sendWSCommand('TOO', id + ',' + newState);
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Sends the new speed value
 * @param {number} id       - The id of the device
 * @param {string} newState - The new state
 * @version VER196 - WANDA
 */
function THERMO_DAIKIN_VMCDaikinModbusSendSpeed(id, newState)
{
  DOMINAPLUS_MANAGER_sendWSCommand('VMC', id + ',' + newState);
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Sends the new mode value
 * @param {number} id       - The id of the device
 * @param {string} newState - The new state
 * @version VER196 - WANDA
 */
function THERMO_DAIKIN_VMCDaikinModbusSendCommand(id, newState)
{
  DOMINAPLUS_MANAGER_sendWSCommand('VMM', id + ',' + newState);
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ *//***************************************************************************************************************************************/
/*                                                    ANTITHEFT_module version 3 WBS 265                                               */
/***************************************************************************************************************************************/

// STATE --- 0: non inserita e libera - 1: inserita e libera - 2: non inserita e occupata - 3: inserita e occupata (ossia in allarme)

// VARIABLES
var ANTITHEFT_PREFIX = '[ANTI_THEFT]: ';
var ANTITHEFT_CONSOLE_COLOR = '#fd9a68'; // Light orange
var ANTITHEFT_CONSOLE_ERROR = '#ff0000'; // Red

var ANTITHEFT_antiTheftArray = sAntifurtoNome.split(',');
var ANTITHEFT_antitheftAreasList = [0, 0, 0, 0, 0, 0, 0, 0];
var ANTITHEFT_antitheftAreasAlreadyInAlarmEmptiedIfForciblyEnterInMenu = new Array();

var ANTITHEFT_antiTheftURL = 'bridge.php?command=GAT';
var ANTITHEFT_antiTheftURI = '';

var ANTITHEFT_antiTheftRetrieveIP = '';
if (isTS01) {
  ANTITHEFT_antiTheftRetrieveIP = '../../get_af_ip.php'; // VER218C WANDA
} else {
  ANTITHEFT_antiTheftRetrieveIP = 'get_af_ip.php';
}

var ANTITHEFT_antiTheftType = 0;
var ANTITHEFT_antiTheftGlobalState = 0; // VER111
var ANTITHEFT_antiTheftGlobalStateAtClick = 0; // VER116
var ANTITHEFT_antitheftSensorGlobalState = 0;

var ANTITHEFT_codeLength = null;
if (isTS01) {
  ANTITHEFT_codeLength = 5;
} else {
  ANTITHEFT_codeLength = 6;
}

var ANTITHEFT_areasAmount = null;
if (isTS01) {
  ANTITHEFT_areasAmount = 6;
} else {
  ANTITHEFT_areasAmount = 8;
}

var ANTITHEFT_areaType = '';
if (isTS01) {
  ANTITHEFT_areaType = 'char';
} else {
  ANTITHEFT_areaType = 'int';
}

var ANTITHEFT_antiTheftRequestLogConfirm = false; // VER111
var ANTITHEFT_flagGGS = false; // VER126
var ANTITHEFT_forceGoToKeypadAfterAntitheftGlobalIconClick = false;

// Timeouts
var ANTITHEFT_GGSTimeout = null;
var ANTITHEFT_sendGSFTimer = '';

// Timers
var ANTITHEFT_pollGlobalStatusTimer = 5000;
var ANTITHEFT_loadGATTimer = 5000;

// Pointers - WEBAPP // VER198 WANDA
var ANTITHEFT_PTR_antitheftValFound = null;
var ANTITHEFT_PTR_antitheftValNotFound = null;
var ANTITHEFT_PTR_antitheftManageGGS = null;
var ANTITHEFT_PTR_updateAntitheftGlobalStatus = null;
var ANTITHEFT_PTR_updateSensorGlobalStatus = null;
var ANTITHEFT_PTR_getPopUpAlarm = null;
var ANTITHEFT_PTR_updateAntitheftStatusHTML = null;
var ANTITHEFT_PTR_updateAntitheftAreasHTML = null;
/* VER199 WANDA */
var ANTITHEFT_PTR_showAntitheftInBox2b = null;
/* ------------ */

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------ CALLBACKS ------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Module initialization --- Callback WEBAPP
 * @param {function} ptr_antitheftValFound - pointer to WEBAPP_antitheftValFound
 * @param {function} ptr_antitheftValNotFound - pointer to WEBAPP_antitheftValNotFound
 * @param {function} ptr_antitheftManageGGS - pointer to WEBAPP_antitheftManageGGS
 * @param {function} ptr_updateAntitheftGlobalStatus - pointer to WEBAPP_updateAntitheftGlobalStatus
 * @param {function} ptr_updateSensorGlobalStatus - pointer to WEBAPP_updateSensorGlobalStatus
 * @param {function} ptr_getPopUpAlarm - pointer to WEBAPP_getPopUpAlarm
 * @param {function} ptr_updateAntitheftStatusHTML - pointer to WEBAPP_updateAntitheftStatusHTML
 * @param {function} ptr_updateAntitheftAreasHTML - pointer to WEBAPP_updateAntitheftAreasHTML
 * @param {function} ptr_showAntitheftInBox2b - pointer to WEBAPP_showAntitheftInBox2b
 * @version VER199 - WANDA
 */
function ANTITHEFT_setCallbackForWebapp(ptr_antitheftValFound,
  ptr_antitheftValNotFound,
  ptr_antitheftManageGGS,
  ptr_updateAntitheftGlobalStatus,
  ptr_updateSensorGlobalStatus,
  ptr_getPopUpAlarm,
  ptr_updateAntitheftStatusHTML,
  ptr_updateAntitheftAreasHTML,
  ptr_showAntitheftInBox2b)
{
  ANTITHEFT_PTR_antitheftValFound = ptr_antitheftValFound;
  ANTITHEFT_PTR_antitheftValNotFound = ptr_antitheftValNotFound;
  ANTITHEFT_PTR_antitheftManageGGS = ptr_antitheftManageGGS;
  ANTITHEFT_PTR_updateAntitheftGlobalStatus = ptr_updateAntitheftGlobalStatus;
  ANTITHEFT_PTR_updateSensorGlobalStatus = ptr_updateSensorGlobalStatus;
  ANTITHEFT_PTR_getPopUpAlarm = ptr_getPopUpAlarm;
  ANTITHEFT_PTR_updateAntitheftStatusHTML = ptr_updateAntitheftStatusHTML;
  ANTITHEFT_PTR_updateAntitheftAreasHTML = ptr_updateAntitheftAreasHTML;
  ANTITHEFT_PTR_showAntitheftInBox2b = ptr_showAntitheftInBox2b;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ---------------------------------------------------------------------- EVENT LISTENERS --------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Handler of the click event on policeman icon
 * @param {boolean} hasStatus3 - true if policeman icon classList contains 'ico-antitheft-stato3', false otherwise
 * @version VER198 - WANDA
 */
function ANTITHEFT_clickOnPolicemanIcon(hasStatus3)
{
  if (hasStatus3 === true) {
    ANTITHEFT_antitheftAreasAlreadyInAlarmEmptiedIfForciblyEnterInMenu = []; // Forcibly emptied due to user request
    ANTITHEFT_updateAntitheftGlobalStatus();
    ANTITHEFT_forceGoToKeypadAfterAntitheftGlobalIconClick = true;
  } else {
    ANTITHEFT_getKeypad();
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Actions to perform when the antitheft menu in box1 is clicked and an antitheft central is present
 * @version VER199 - WANDA
 */
function ANTITHEFT_showAntitheftInBox2b()
{
  if (ANTITHEFT_PTR_showAntitheftInBox2b !== null) {
    ANTITHEFT_PTR_showAntitheftInBox2b();
  }
  if (isTS01) {
    ANTITHEFT_updateAntitheftGlobalStatus();
    ANTITHEFT_updateSensorsGlobalState();
  } else {
    DOMINAPLUS_MANAGER_sendWSCommand('GSF', '12');
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Opens the keypad boxOver
 * @version VER198 - WANDA
 */
function ANTITHEFT_getKeypad()
{
  WEBAPP_keypadMode = '';
  ANTITHEFT_antiTheftGlobalStateAtClick = ANTITHEFT_antiTheftGlobalState;
  if (isTS01) {
    WEBAPP_getOverHTML(WEBAPP_keypadURL, lblTastieraAntifurto + ' - ' + ANTITHEFT_antiTheftArray[ANTITHEFT_antiTheftType], 'close');
  } else {
    WEBAPP_getOverHTML(WEBAPP_keypadURL, lblTastieraAntifurto, 'close');
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Handler of the click on antitheft_log in box2b
 * @version VER218C - WANDA
 */
function ANTITHEFT_clickOnAntitheftLogInBox2b()
{
  if (isTS01) {
    if (isTS01_WebClient && ANTITHEFT_antiTheftType === 4) {
      WEBAPP_getOveriFrame(ANTITHEFT_antiTheftURI + '/#command=events', lblLog);
      window.backto_settingsmenu = undefined;
    } else {
      WEBAPP_getOverHTML('webapps/webapp_legacy/antitheft_log.htm', lblLog, 'close', null); // VER218C WANDA
    }
  } else {
    if (ANTITHEFT_antiTheftType === 2) {
      WEBAPP_getOverHTML('webapps/webapp_legacy/antitheft_log.htm', lblLog, 'close'); // VER218C WANDA
    } else {
      WEBAPP_getOveriFrame(ANTITHEFT_antiTheftURI + '/#command=events', lblLog);
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ---------------------------------------------------------------------- GENERAL FUNCTIONS ------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages the response to the GSF command (!TS01)
 * @param {object} parameters - device family ID
 * @param {object} records - array of arrays containing the response data for every device
 ** [0][0]: device ID;
 ** [0][1]: device state;
 * @version VER198 - WANDA
 */
function ANTITHEFT_manageAlarms(parameters, records)
{
  var deviceFamily = parameters[0];
  if (deviceFamily === '12') {
    ANTITHEFT_antiTheftGlobalState = 0;
  }
  for (var i = 0; i < records.length; i++) {
    var deviceID = records[i][0];
    var deviceStatus = records[i][1];
    // P3000_AREA
    if (deviceFamily === '12') {
      ANTITHEFT_updateAntitheftGlobalState(deviceID, deviceStatus);
    }
  }
  if (ANTITHEFT_PTR_updateAntitheftStatusHTML !== null) {
    ANTITHEFT_PTR_updateAntitheftStatusHTML(deviceFamily, records, '');
  }
  if (ANTITHEFT_antiTheftGlobalState === 3) {
    ANTITHEFT_antiTheftRequestLogConfirm = true;
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates the ANTITHEFT_updateAntitheftGlobalState variable accordingly to the result of the GSF response (!TS01)
 * @param {string} deviceID - the ID of the device
 * @param {string} deviceStatus - the status of the device
 * @version VER198 - WANDA
 */
function ANTITHEFT_updateAntitheftGlobalState(deviceID, deviceStatus)
{
  if (deviceStatus === '2' && ANTITHEFT_antiTheftGlobalState === 0) {
    ANTITHEFT_antiTheftGlobalState = 2;
  }
  if (deviceStatus === '1' && (ANTITHEFT_antiTheftGlobalState === 0 || ANTITHEFT_antiTheftGlobalState === 2)) {
    ANTITHEFT_antiTheftGlobalState = 1;
  }
  if (deviceStatus === '3') {
    ANTITHEFT_antiTheftGlobalState = 3;
  }
  console.log('%c' + ANTITHEFT_PREFIX + 'Managing GSF | Area ID: ' + deviceID + ' - Status: ' + deviceStatus + ' - ANTITHEFT_antiTheftGlobalState: ' + ANTITHEFT_antiTheftGlobalState, 'color: ' + ANTITHEFT_CONSOLE_COLOR);
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Retrieves the name of an antitheft area
 * @param {number} id - the id of the selected device 
 * @returns areaName - the name of an antitheft area
 * @version VER198 - WANDA
 */
function ANTITHEFT_retrieveAreaName(id)
{
  var areaName = 'Area ' + id;
  if (ANTITHEFT_areaType === 'char') { // VER169 WANDA
    areaName = 'Area ' + String.fromCharCode(64 + parseInt(id));
  }
  DOMINAPLUS_MANAGER_deviceList.filter(function (device) { return device.typeApp === '12' && parseInt(device.ProgressivoArea) === parseInt(id) }).forEach(function (obj) { areaName = obj.name; });
  return areaName;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages the configuration value
 * @param {number} val - the configuration value
 * @version VER187 - WANDA
 */
function ANTITHEFT_manageConfigurationValue(val)
{
  if (val > 0) {
    ANTITHEFT_valFound(val);
  } else {
    if (isTS01) {
      if (val === -1) {
        ANTITHEFT_antiTheftType = 1;
      } else if (val === -2) {
        ANTITHEFT_antiTheftType = 2;
      }
    }
    ANTITHEFT_valNotFound();
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Actions to perform if an antitheft central has been found
 * @param {number} val - antitheft type value
 * @version VER198 - WANDA
 */
function ANTITHEFT_valFound(val)
{
  ANTITHEFT_antiTheftType = val;
  if (ANTITHEFT_flagGGS === false) {
    ANTITHEFT_flagGGS = true;
    ANTITHEFT_pollGlobalStatus();
  } else {
    DOMINAPLUS_MANAGER_sendWSCommand('GGS');
  }
  // AVE AF998EXP
  if (isTS01 && ANTITHEFT_antiTheftType === 1) {
    ANTITHEFT_codeLength = 6;
    ANTITHEFT_areasAmount = 8;
    ANTITHEFT_areaType = 'int';
  }
  // AVE AF949 / AF999EXP
  else if (!isTS01 && ANTITHEFT_antiTheftType === 2) { // VER109
    /* VER169 WANDA */
    ANTITHEFT_codeLength = 5;
    ANTITHEFT_areasAmount = 6;
    ANTITHEFT_areaType = 'char';
    /* ------------ */
  }
  // RISCO LIGHTSYS 
  else if (ANTITHEFT_antiTheftType === 3) {
    /* VER169 WANDA */
    ANTITHEFT_codeLength = 4;
    ANTITHEFT_areasAmount = 4;
    ANTITHEFT_areaType = 'int';
    /* ------------ */
  }
  // AF927
  else if (ANTITHEFT_antiTheftType === 4) { // VER109 AF927
    /* VER169 WANDA */
    ANTITHEFT_codeLength = 6;
    ANTITHEFT_areasAmount = 6;
    ANTITHEFT_areaType = 'char';
    /* ------------ */
    lblAntifurto = lblAntifurtoAF927; // VER124
    if (window.location.href.indexOf('/access/') >= 0) {
      ANTITHEFT_antiTheftURI = window.location.origin + '/access2';
    }
    // RETRIEVING ANTITHEFT CENTRAL IP
    else {
      var request = new XMLHttpRequest();
      request.open('GET', ANTITHEFT_antiTheftRetrieveIP + '?rnd=' + Math.random(), false); // 'false' makes the request synchronous
      request.send(null);
      if (request.readyState === 4) {
        if (request.status === 200) {
          var posIP = request.responseText.indexOf('<ip>');
          if (posIP >= 0) {
            var strIP = request.responseText.substring(posIP);
            var endTagIP = strIP.indexOf('</ip>');
            if (endTagIP >= 0) {
              strIP = strIP.substring(0, endTagIP);
              strIP = strIP.replace('<ip>', '');
              ANTITHEFT_antiTheftURI = '//' + strIP.trim();
            }
          }
        } else {
          console.log('%c' + ANTITHEFT_PREFIX + 'valFound error', 'color: ' + ANTITHEFT_CONSOLE_ERROR);
        }
      }
    }
  }
  if (ANTITHEFT_PTR_antitheftValFound !== null) {
    ANTITHEFT_PTR_antitheftValFound();
  }
  if (isTS01) {
    DOMINAPLUS_MANAGER_sendWSCommand('WSF', '12');
    DOMINAPLUS_MANAGER_sendWSCommand('WSF', '13');
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Action to perform if an antitheft central has not been found
 * @version VER198 - WANDA
 */
function ANTITHEFT_valNotFound()
{
  if (DISPLAY_isTS10) {
    if (DOMINAPLUS_MANAGER_counterGAT < 10) {
      setTimeout('DOMINAPLUS_MANAGER_loadGAT()', ANTITHEFT_loadGATTimer);
    }
  } else {
    clearTimeout(ANTITHEFT_GGSTimeout);
    if (ANTITHEFT_PTR_antitheftValNotFound !== null) {
      ANTITHEFT_PTR_antitheftValNotFound();
    }
    if (!isTS01) {
      if (DOMINAPLUS_MANAGER_counterGAT < 3) {
        setTimeout('DOMINAPLUS_MANAGER_loadGAT()', ANTITHEFT_loadGATTimer);
      }
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Polls global status
 * @version VER198 - WANDA
 */
function ANTITHEFT_pollGlobalStatus()
{
  console.log('%c' + ANTITHEFT_PREFIX + 'Sending GGS | ' + (new Date), 'color: ' + ANTITHEFT_CONSOLE_COLOR);
  DOMINAPLUS_MANAGER_sendWSCommand('GGS');
  ANTITHEFT_GGSTimeout = setTimeout('ANTITHEFT_pollGlobalStatus()', ANTITHEFT_pollGlobalStatusTimer);

}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates antitheft areas accordingly to the response of the UPD-X-A command (there has been a status change in one of the areas)
 * @param {object} parameters - Array of strings containing antitheft informations
 ** [0][2]: area progressive;
 ** [0][3]: area engaged;
 ** [0][4]: exit time active;
 ** [0][5]: area in alarm;
 ** [0][6]: area clear;
 * @version VER198 - WANDA
 */
function ANTITHEFT_manageUPDForAreas(parameters)
{
  var areaProgressive = parseInt(parameters[2]);
  var areaEngaged = parseInt(parameters[3]);
  var areaInAlarm = parseInt(parameters[5]);
  var areaClear = parseInt(parameters[6]);
  console.log('%c' + ANTITHEFT_PREFIX + 'XA - areaProgressive: ' + areaProgressive + ' - engaged: ' + areaEngaged + ' - clear: ' + areaClear + ' - alarm: ' + areaInAlarm, 'color: ' + ANTITHEFT_CONSOLE_COLOR);
  if (isTS01) {
    if (ANTITHEFT_antiTheftType !== 0) {
      if (areaEngaged === 1 && (ANTITHEFT_antiTheftType === 4 || ANTITHEFT_antiTheftType === 2)) {
        console.log('%c' + ANTITHEFT_PREFIX + 'Skip deduzione allarme 927/949 | inAlarm: ' + areaInAlarm, 'color: ' + ANTITHEFT_CONSOLE_COLOR);
      }
      ANTITHEFT_updateAntitheftAreaStatus(areaProgressive, areaClear, areaEngaged, areaInAlarm);
      ANTITHEFT_updateAntitheftGlobalStatus();
      if (ANTITHEFT_PTR_updateAntitheftAreasHTML !== null) {
        ANTITHEFT_PTR_updateAntitheftAreasHTML(areaProgressive, areaEngaged, areaInAlarm, areaClear);
      }
    }
  } else {
    if (ANTITHEFT_PTR_updateAntitheftAreasHTML !== null) {
      ANTITHEFT_PTR_updateAntitheftAreasHTML(areaProgressive, areaEngaged, areaInAlarm, areaClear);
    }
    clearTimeout(ANTITHEFT_sendGSFTimer); // VER69
    ANTITHEFT_sendGSFTimer = setTimeout('DOMINAPLUS_MANAGER_sendWSCommand("GSF", "12");', 1500); // VER173 WANDA
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages the response to the GGS command
 * @param {string} antitheftStatus - the antitheft status
 * @version VER198 - WANDA
 */
function ANTITHEFT_manageGGS(antitheftStatus)
{
  if (ANTITHEFT_PTR_antitheftManageGGS !== null) {
    ANTITHEFT_PTR_antitheftManageGGS(antitheftStatus);
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages the response to the UPD WS command 
 * @param {number} UPDType - type of UPD received
 * @param {object} parameters - Array of strings containing antitheft updates
 * @version VER209 - WANDA
 */
function ANTITHEFT_asynchronousAntitheftStatusChangeArrived(UPDType, parameters)
{
  if (UPDType === 1) {
    var currentSensor = WEBAPP_getDevice(parseInt(parameters[2]));
    if (currentSensor !== false) {
      currentSensor.currentStatus = parseInt(parameters[3]);
    }
    ANTITHEFT_updateSensorsGlobalState();
  } else if (UPDType === 2) {
    ANTITHEFT_antitheftAreasList[parseInt(parameters[2]) - 1] = parseInt(parameters[3]);
    ANTITHEFT_updateAntitheftGlobalStatus(parameters);
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Opens the alarm popup (TS01 only)
 * @param {number} areaID - the ID of the area in alarm
 * @param {number} techAlarmID - the ID of the technical element in alarm
 * @param {string} alarmType - the type of the alarm
 * @param {object} alarmPropagation - array containing informations about the alarm
 * @version VER198 - WANDA
 */
function ANTITHEFT_getPopUpAlarm(areaID, techAlarmID, alarmType, alarmPropagation)
{
  if (ANTITHEFT_PTR_getPopUpAlarm !== null) {
    ANTITHEFT_PTR_getPopUpAlarm(areaID, techAlarmID, alarmType, alarmPropagation);
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

function ANTITHEFT_manageUPD_XU()
{
  if (isTS01 && (ANTITHEFT_antiTheftType === 4 || ANTITHEFT_antiTheftType === 2)) {
    setTimeout('DOMINAPLUS_MANAGER_sendWSCommand("WSF", "12");', 2000);
  } else if (!isTS01) {
    ANTITHEFT_sendGSFTimer = setTimeout('DOMINAPLUS_MANAGER_sendWSCommand("GSF", "12");', 2000);
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates antitheft areas global state (TS01 only)
 * @param {object} parameters - Array of strings containing antitheft updates
 * @version VER198 - WANDA
 */
function ANTITHEFT_updateAntitheftGlobalStatus(parameters)
{
  if (ANTITHEFT_antiTheftType !== 0) { // MAURO
    ANTITHEFT_antiTheftGlobalState = 0;
    for (var i = 0; i < ANTITHEFT_antitheftAreasList.length; i++) {
      if (ANTITHEFT_antitheftAreasList[i] === 2 && ANTITHEFT_antiTheftGlobalState === 0) {
        ANTITHEFT_antiTheftGlobalState = 2;
      }
      if (ANTITHEFT_antitheftAreasList[i] === 1 && (ANTITHEFT_antiTheftGlobalState === 0 || ANTITHEFT_antiTheftGlobalState === 2)) {
        ANTITHEFT_antiTheftGlobalState = 1;
      }
      if (ANTITHEFT_antitheftAreasList[i] === 3) { // STEFANO (added if)
        ANTITHEFT_antiTheftGlobalState = 3;
        if (!ANTITHEFT_isAreaAlreadyInAlarmState(i + 1)) {
          ANTITHEFT_getPopUpAlarm(i + 1);
        }
      }
      console.log('%c' + ANTITHEFT_PREFIX + 'Updating antitheft global status | Area ID: ' + (i + 1) + ' - Status: ' + ANTITHEFT_antiTheftGlobalState, 'color: ' + ANTITHEFT_CONSOLE_COLOR);
      if (ANTITHEFT_antitheftAreasList[i] === 3) {
        ANTITHEFT_insertAreaInAntitheftAreasAlreadyInAlarmIfNotAlreadyPresent(i + 1);
      } else {
        if (ANTITHEFT_antitheftAreasList[i] === 0 || ANTITHEFT_antitheftAreasList[i] === 2) { // if it comes back to 1 after having passed through 3 correctly it mantains its memory to avoid new popup --- STEFANO
          ANTITHEFT_removeAreaFromAntitheftAlreadyInAlarm(i + 1);
        }
      }
    }
    if (ANTITHEFT_antiTheftGlobalState === 3) {
      ANTITHEFT_antiTheftRequestLogConfirm = true;
    }
    if (ANTITHEFT_PTR_updateAntitheftGlobalStatus !== null) {
      ANTITHEFT_PTR_updateAntitheftGlobalStatus(parameters);
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates sensor global state (TS01 only)
 * @version VER198 - WANDA
 */
function ANTITHEFT_updateSensorsGlobalState()
{
  ANTITHEFT_antitheftSensorGlobalState = 0;
  DOMINAPLUS_MANAGER_deviceList.filter(function (element) { return element.typeApp === '13' }).forEach(function (obj)
  {
    if (obj.currentStatus === 1 || obj.currentStatus === 3) {
      ANTITHEFT_antitheftSensorGlobalState = 3;
    }
  });
  if (ANTITHEFT_PTR_updateSensorGlobalStatus !== null) {
    ANTITHEFT_PTR_updateSensorGlobalStatus();
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Checks if an area is already in alarm state (TS01 only)
 * @param {number} index - the index of the selected device
 * @returns true or false
 * @version STEFANO (segnalazione verbale Butturi)
 */
function ANTITHEFT_isAreaAlreadyInAlarmState(index)
{
  var isPresent = false;
  for (var i = 0; i < ANTITHEFT_antitheftAreasAlreadyInAlarmEmptiedIfForciblyEnterInMenu.length; i++) {
    if (ANTITHEFT_antitheftAreasAlreadyInAlarmEmptiedIfForciblyEnterInMenu[i].areaIndex === index) {
      isPresent = true;
      break; // Once found there is no need to continue
    }
  }
  return isPresent;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Inserts an area in the ANTITHEFT_antitheftAreasAlreadyInAlarmEmptiedIfForciblyEnterInMenu array if it is not already present
 * @param {number} index - the index of the selected device
 * @version STEFANO (segnalazione verbale Butturi)
 */
function ANTITHEFT_insertAreaInAntitheftAreasAlreadyInAlarmIfNotAlreadyPresent(index)
{
  if (!ANTITHEFT_isAreaAlreadyInAlarmState(index)) {
    var areaInfoObject = new Object();
    areaInfoObject.areaIndex = index;
    ANTITHEFT_antitheftAreasAlreadyInAlarmEmptiedIfForciblyEnterInMenu.push(areaInfoObject);
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Removes an area from the ANTITHEFT_antitheftAreasAlreadyInAlarmEmptiedIfForciblyEnterInMenu array if it is present
 * @param {number} index - the index of the selected device
 * @version STEFANO (segnalazione verbale Butturi)
 */
function ANTITHEFT_removeAreaFromAntitheftAlreadyInAlarm(index)
{
  for (var i = 0; i < ANTITHEFT_antitheftAreasAlreadyInAlarmEmptiedIfForciblyEnterInMenu.length; i++) {
    if (ANTITHEFT_antitheftAreasAlreadyInAlarmEmptiedIfForciblyEnterInMenu[i].areaIndex === index) {
      ANTITHEFT_antitheftAreasAlreadyInAlarmEmptiedIfForciblyEnterInMenu.splice(i, 1);
      break; // Once found there is no need to continue
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates the antitheft status (TS01 only)
 * @param {number} areaProgressive 
 * @param {number} areaClear 
 * @param {number} areaEngaged 
 * @param {number} areaInAlarm 
 * @version VER198 - WANDA
 */
function ANTITHEFT_updateAntitheftAreaStatus(areaProgressive, areaClear, areaEngaged, areaInAlarm)
{
  // CLEAR AND NOT ENGAGED
  if (areaClear === 1 && areaEngaged === 0) {
    console.log('%c' + ANTITHEFT_PREFIX + 'Area: ' + areaProgressive + ' - STATUS CHANGE: clear and not engaged', 'color: ' + ANTITHEFT_CONSOLE_COLOR);
    ANTITHEFT_antitheftAreasList[areaProgressive - 1] = 0;
  } else if (ANTITHEFT_antitheftAreasList[areaProgressive - 1] !== 3) {
    // NOT CLEAR AND NOT ENGAGED
    if (areaClear === 0 && areaEngaged === 0) {
      console.log('%c' + ANTITHEFT_PREFIX + 'Area: ' + areaProgressive + ' - STATUS CHANGE: not clear and not engaged', 'color: ' + ANTITHEFT_CONSOLE_COLOR);
      ANTITHEFT_antitheftAreasList[areaProgressive - 1] = 2;
    }
    // CLEAR AND ENGAGED
    else if (areaClear === 1 && areaEngaged === 1) {
      console.log('%c' + ANTITHEFT_PREFIX + 'Area: ' + areaProgressive + ' - STATUS CHANGE: clear and engaged', 'color: ' + ANTITHEFT_CONSOLE_COLOR);
      ANTITHEFT_antitheftAreasList[areaProgressive - 1] = 1;
    }
    // NOT CLEAR AND ENGAGED
    else if (areaClear === 0 && areaEngaged === 1) {
      if (ANTITHEFT_antiTheftType === 4 || ANTITHEFT_antiTheftType === 2) {
        if (areaInAlarm === 1) {
          console.log('%c' + ANTITHEFT_PREFIX + 'Area: ' + areaProgressive + ' - STATUS CHANGE: not clear and engaged and in alarm', 'color: ' + ANTITHEFT_CONSOLE_COLOR);
          ANTITHEFT_antitheftAreasList[areaProgressive - 1] = 3;
        } else {
          console.log('%c' + ANTITHEFT_PREFIX + 'Area: ' + areaProgressive + ' - STATUS CHANGE: not clear and engaged but not in alarm', 'color: ' + ANTITHEFT_CONSOLE_COLOR);
          ANTITHEFT_antitheftAreasList[areaProgressive - 1] = 1;
        }
      } else {
        console.log('%c' + ANTITHEFT_PREFIX + 'Area: ' + areaProgressive + ' - STATUS CHANGE: not clear and engaged (probably in alarm)', 'color: ' + ANTITHEFT_CONSOLE_COLOR);
        ANTITHEFT_antitheftAreasList[areaProgressive - 1] = 3;
      }
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* --------------------------------------------------------------------------- TECH ALARMS -------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Adds or remove element from a list
 * @param {string} type - command type
 * @param {number} deviceID - the id of the device
 * @param {string} action - 'ADD' or 'REMOVE'
 * @version VER259 - WANDA
 */
function ANTITHEFT_TECHALARM_manageCS1CS2CS3(type, deviceID, action)
{
  if (action === 'ADD') {
    var insertInList = true;
    for (var i = 0; i < WEBAPP_CS1_CS2_CS3_List.length; i++) {
      if (parseInt(WEBAPP_CS1_CS2_CS3_List[i].id) === parseInt(deviceID) && WEBAPP_CS1_CS2_CS3_List.type === type) {
        insertInList = false;
        break;
      }
    }
    if (insertInList) {
      var A_CS1_CS2_CS3      = new Object();
      A_CS1_CS2_CS3.id       = deviceID;
      A_CS1_CS2_CS3.type     = type;
      A_CS1_CS2_CS3.datetime = WEBAPP_getcurrentDateTimeString(); // VER76 STEFANO BIS
      /* VER259 WANDA */
      var device = WEBAPP_getDevice(deviceID);
      if (device !== false && typeof device.maps !== 'undefined') {
        A_CS1_CS2_CS3.maps = device.maps;
      }
      /* ------------ */
      WEBAPP_CS1_CS2_CS3_List.push(A_CS1_CS2_CS3);
    }
  } else if (action === 'REMOVE') {
    for (var i = 0; i < WEBAPP_CS1_CS2_CS3_List.length; i++) {
      if (parseInt(WEBAPP_CS1_CS2_CS3_List[i].id) === parseInt(deviceID) && WEBAPP_CS1_CS2_CS3_List[i].type === type) {
        WEBAPP_CS1_CS2_CS3_List.splice(i, 1);
        break;
      }
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Adds to a list or remove from a list the alarms
 * @param {object} parameters - array containing alp/falp informations
 * @param {boolean} isFalp - is Falp?
 * @param {string} action - 'ADD' if needs to be added, 'REMOVE' if it nees to be removed
 * @version VER209 - WANDA
 */
function ANTITHEFT_TECHALARM_managePropagationList(parameters, isFalp, action)
{
  if (action === 'ADD') {
    var insertInList = true;
    for (var i = 0; i < WEBAPP_propagationList.length; i++) {
      if (typeof WEBAPP_propagationList[i].supervisor !== 'undefined' && typeof WEBAPP_propagationList[i].device !== 'undefined' && typeof WEBAPP_propagationList[i].alarmType !== 'undefined' && parseInt(WEBAPP_propagationList[i].supervisor) === parseInt(parameters[0]) && parseInt(WEBAPP_propagationList[i].device) === parseInt(parameters[1]) && WEBAPP_propagationList[i].alarmType.toLowerCase() === parameters[2].toLowerCase()) {
        insertInList = false;
        /* VER87 STEFANO */
        if (isFalp === false) {
          WEBAPP_propagationList[i].alarmType = parameters[2].toLowerCase();
        } else {
          WEBAPP_propagationList[i].alarmType = 'falp';
        }
        WEBAPP_propagationList[i].alarmCode = parseInt(parameters[3]);
        break;
        /* ------------- */
      }
    }
    if (insertInList) {
      var propagation = new Object();
      propagation.supervisor = parameters[0];
      propagation.device = parameters[1];
      propagation.extraDeviceInfo = parameters[2];
      /* VER87 STEFANO */
      if (isFalp === false) {
        propagation.alarmType = parameters[2].toLowerCase();
      } else {
        propagation.alarmType = 'falp';
      }
      /* ------------- */
      propagation.alarmCode = parseInt(parameters[3]);
      propagation.datetime = WEBAPP_getcurrentDateTimeString();
      WEBAPP_propagationList.push(propagation);
    }
  } else if (action === 'REMOVE') {
    if (isFalp === false) {
      for (var i = 0; i < WEBAPP_propagationList.length; i++) {
        if (typeof WEBAPP_propagationList[i].supervisor !== 'undefined' && typeof WEBAPP_propagationList[i].device !== 'undefined' && typeof WEBAPP_propagationList[i].alarmType !== 'undefined' && parseInt(WEBAPP_propagationList[i].supervisor) === parseInt(parameters[0]) && parseInt(WEBAPP_propagationList[i].device) === parseInt(parameters[1]) && WEBAPP_propagationList[i].alarmType.toLowerCase() === parameters[2].toLowerCase()) {
          WEBAPP_propagationList.splice(i, 1);
          break;
        }
      }
    } else { // If one falp has to be removed, all falps must be removed
      for (var i = 0; i < WEBAPP_propagationList.length; i++) {
        if (typeof WEBAPP_propagationList[i].alarmType !== 'undefined' && WEBAPP_propagationList[i].alarmType.toLowerCase() === 'falp') {
          WEBAPP_propagationList.splice(i, 1);
        }
      }
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Adds to a list or remove from a list the alarms (!TS01)
 * @param {object} parameters - array containing falp informations
 * @param {string} alarmType - type of alarm
 * @version VER209 - WANDA
 */
function ANTITHEFT_TECHALARM_showPropagationAlarm(parameters, alarmType)
{
  if (ANTITHEFT_PTR_getPopUpAlarm !== null) {
    ANTITHEFT_PTR_getPopUpAlarm(parameters, alarmType);
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ *//***************************************************************************************************************************************/
/*                                                   RGBWHEEL_module version 4 WBS 265                                                 */
/***************************************************************************************************************************************/

// VARIABLES
var RGBWHEEL_PREFIX = '[RGB_WHEEL]: ';
var RGBWHEEL_CONSOLE_COLOR = '#33ccff'; // Light blue

// Log
var RGBWHEEL_enableLog = true; // VER161 STEFANO

// Arrays
var RGBWHEEL_currentHSBValue = new Array();
var RGBWHEEL_allColorWheels_IDs_AndRGBValues_ReceivedFromServer = new Array();

var RGBWHEEL_bNumberOfRGBUpdatesToSkip = 0;

var RGBWHEEL_detailFactor = 2;

/* VER207 WANDA */
var RGBWHEEL_rectPointerWidth = 5;
var RGBWHEEL_rectPointerHeight = 5;
/* ------------ */

var RGBWHEEL_previousXPointer = -1;
var RGBWHEEL_previousYPointer = -1;
var RGBWHEEL_previousYBrightness = -1;

var RGBWHEEL_currentWhitePercentage = 0; // VER173 WANDA
var RGBWHEEL_lastClientChosenRGBValueString = '';
var RGBWHEEL_lastClientChosenWhiteValue = 0; // VER162 STEFANO 

var RGBWHEEL_hiddenCanvas = null;
var RGBWHEEL_hiddenGrayScaleCanvas = null;
var RGBWHEEL_previousCanvasData = null; // 25 elements
var RGBWHEEL_previousYBrightnessColor = null;

var RGBWHEEL_imageToLoadColor = null;
var RGBWHEEL_imageToLoadGray = null;

/* VER161 --- VER162 STEFANO */
var RGBWHEEL_DEVICEID_NOT_FOUND = 0;
var RGBWHEEL_DEVICEID_FOUND_BUT_NOT_RGBW = 1;
var RGBWHEEL_DEVICEID_FOUND_AND_IT_IS_RGBW_MANAGED_BY_ABLIGHT = 2;
var RGBWHEEL_DEVICEID_FOUND_BUT_IT_IS_RGBW_NOT_MANAGED_BY_ABLIGHT = 3;
/* ------------------------- */

// Pointers - WEBAPP
var RGBWHEEL_PTR_updateRGBColorPreview = null;
var RGBWHEEL_PTR_updateWhiteIndicatorPosition = null;
var RGBWHEEL_PTR_addRGBWheels = null;
var RGBWHEEL_PTR_updateRGBONOFFbutton = null;
var RGBWHEEL_PTR_updateColorDescription = null;
var RGBWHEEL_PTR_showHideColorWheel = null;
var RGBWHEEL_PTR_setWhiteChannelPercentage = null;
var RGBWHEEL_PTR_checkIfRGBONOFFbuttonIsON = null;
var RGBWHEEL_PTR_updateRGBIcon = null;

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------ CALLBACKS ------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Module initialization --- Callback WEBAPP
 * @param {function} ptr_updateRGBColorPreview - pointer to WEBAPP_updateRGBColorPreview
 * @param {function} ptr_updateWhiteIndicatorPosition - pointer to WEBAPP_updateWhiteIndicatorPosition
 * @param {function} ptr_addRGBWheels - pointer to WEBAPP_addRGBWheels
 * @param {function} ptr_updateRGBONOFFbutton - pointer to WEBAPP_updateRGBONOFFbutton
 * @param {function} ptr_updateColorDescription - pointer to WEBAPP_updateColorDescription
 * @param {function} ptr_showHideColorWheel - pointer to WEBAPP_showHideColorWheel
 * @param {function} ptr_setWhiteChannelPercentage - pointer to WEBAPP_setWhiteChannelPercentage
 * @param {function} ptr_checkIfRGBONOFFbuttonIsON - pointer to WEBAPP_checkIfRGBONOFFbuttonIsON
 * @param {function} ptr_updateRGBIcon - pointer to WEBAPP_updateRGBIcon
 * @version VER207 - WANDA
 */
function RGBWHEEL_setCallbackForWebapp(ptr_updateRGBColorPreview,
	ptr_updateWhiteIndicatorPosition,
	ptr_addRGBWheels,
	ptr_updateRGBONOFFbutton,
	ptr_updateColorDescription,
	ptr_showHideColorWheel,
	ptr_setWhiteChannelPercentage,
	ptr_checkIfRGBONOFFbuttonIsON,
	ptr_updateRGBIcon) 
{
	RGBWHEEL_PTR_updateRGBColorPreview = ptr_updateRGBColorPreview;
	RGBWHEEL_PTR_updateWhiteIndicatorPosition = ptr_updateWhiteIndicatorPosition;
	RGBWHEEL_PTR_addRGBWheels = ptr_addRGBWheels;
	RGBWHEEL_PTR_updateRGBONOFFbutton = ptr_updateRGBONOFFbutton;
	RGBWHEEL_PTR_updateColorDescription = ptr_updateColorDescription;
	RGBWHEEL_PTR_showHideColorWheel = ptr_showHideColorWheel;
	RGBWHEEL_PTR_setWhiteChannelPercentage = ptr_setWhiteChannelPercentage;
	RGBWHEEL_PTR_checkIfRGBONOFFbuttonIsON = ptr_checkIfRGBONOFFbuttonIsON;
	RGBWHEEL_PTR_updateRGBIcon = ptr_updateRGBIcon;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------ EVENT LISTENERS ------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Handler of the click event on the hidden canvas
 * @param {object} event - the click event
 * @version VER207 - WANDA
 */
function RGBWHEEL_clickOnHiddenCanvas(event)
{
	var relativeX = 0;
	var relativeY = 0;
	relativeX = parseInt(event.offsetX / (DISPLAY_pageZoom / 100));
	relativeY = parseInt(event.offsetY / (DISPLAY_pageZoom / 100));
	// CIRCLE
	if (RGBWHEEL_isClickInsideCircle(RGBWHEEL_hiddenCanvas, relativeX, relativeY)) {
		var rgba = RGBWHEEL_hiddenCanvas.getContext('2d', { willReadFrequently: true }).getImageData(relativeX, relativeY, 1, 1).data;
		if (rgba[0] === 0 && rgba[1] === 0 && rgba[2] === 0) {
			if (RGBWHEEL_enableLog) { // VER161 STEFANO
				console.log('%c' + RGBWHEEL_PREFIX + 'Black skipped', 'color: ' + RGBWHEEL_CONSOLE_COLOR); // VER157 WANDA
			}
		} else {
			RGBWHEEL_bNumberOfRGBUpdatesToSkip = 1; // rgb rebound + white
			RGBWHEEL_manageClickOnWheel(RGBWHEEL_hiddenCanvas, relativeX, relativeY, rgba);
			if (DOMINAPLUS_MANAGER_sendWSCommand !== null && typeof WEBAPP_actualDevice !== 'undefined' && WEBAPP_actualDevice !== null && parseInt(WEBAPP_actualDevice) > 0) {
				/* VER140 */
				var strRgba0 = '00' + rgba[0];
				var strRgba1 = '00' + rgba[1];
				var strRgba2 = '00' + rgba[2];
				strRgba0 = strRgba0.substr(strRgba0.length - 3);
				strRgba1 = strRgba1.substr(strRgba1.length - 3);
				strRgba2 = strRgba2.substr(strRgba2.length - 3);
				/* ------ */
				if (RGBWHEEL_enableLog) { // VER161 STEFANO 
					console.log('%c' + RGBWHEEL_PREFIX + 'Wheel sending RGB command: ID = ' + WEBAPP_actualDevice + ', RGBW = ' + rgba[0] + ', ' + rgba[1] + ', ' + rgba[2] + ', ' + RGBWHEEL_allColorWheels_IDs_AndRGBValues_ReceivedFromServer['id_' + WEBAPP_actualDevice][3], 'color: ' + RGBWHEEL_CONSOLE_COLOR); // VER157 WANDA
				}
				DOMINAPLUS_MANAGER_sendWSCommand('RGB', WEBAPP_actualDevice + ',' + strRgba0 + ',' + strRgba1 + ',' + strRgba2 + ',' + RGBWHEEL_allColorWheels_IDs_AndRGBValues_ReceivedFromServer['id_' + WEBAPP_actualDevice][3]); // VER173 WANDA
			}
		}
	} else {
		// BRIGHTNESS BAR
		if (RGBWHEEL_isClickInsideBrightnessBar(RGBWHEEL_hiddenCanvas, relativeX)) {
			RGBWHEEL_drawBrightnessIndicator(RGBWHEEL_hiddenCanvas, relativeY);
			var strR = ('00' + (RGBWHEEL_previousYBrightnessColor[0].toString(16)));
			var strG = ('00' + (RGBWHEEL_previousYBrightnessColor[1].toString(16)));
			var strB = ('00' + (RGBWHEEL_previousYBrightnessColor[2].toString(16)));
			strR = strR.substr(strR.length - 2);
			strG = strG.substr(strG.length - 2);
			strB = strB.substr(strB.length - 2);
			/* VER141 */
			var strRDecimal = ('00' + (RGBWHEEL_previousYBrightnessColor[0].toString(10)));
			var strGDecimal = ('00' + (RGBWHEEL_previousYBrightnessColor[1].toString(10)));
			var strBDecimal = ('00' + (RGBWHEEL_previousYBrightnessColor[2].toString(10)));
			/* ------ */
			var rgbColorString = '#' + strR + strG + strB;
			if (RGBWHEEL_PTR_updateRGBColorPreview !== null) {
				RGBWHEEL_PTR_updateRGBColorPreview(rgbColorString);
			}
			var hsb = RGBWHEEL_rgb2hsb(RGBWHEEL_previousYBrightnessColor[0], RGBWHEEL_previousYBrightnessColor[1], RGBWHEEL_previousYBrightnessColor[2]);
			if (RGBWHEEL_PTR_updateColorDescription !== null) {
				RGBWHEEL_PTR_updateColorDescription(rgbColorString, hsb);
			}
			RGBWHEEL_lastClientChosenRGBValueString = rgbColorString;
			RGBWHEEL_currentHSBValue = hsb;
			RGBWHEEL_bNumberOfRGBUpdatesToSkip = 1; // rgb rebound + white
			if (DOMINAPLUS_MANAGER_sendWSCommand !== null && typeof WEBAPP_actualDevice !== 'undefined' && WEBAPP_actualDevice !== null && parseInt(WEBAPP_actualDevice) > 0) {
				if (RGBWHEEL_enableLog) { // VER161 STEFANO
					console.log('%c' + RGBWHEEL_PREFIX + 'Brightness sending RGB command : ID = ' + WEBAPP_actualDevice + ', RGBW = ' + strRDecimal + ', ' + strGDecimal + ', ' + strBDecimal + ', ' + RGBWHEEL_allColorWheels_IDs_AndRGBValues_ReceivedFromServer['id_' + WEBAPP_actualDevice][3], 'color: ' + RGBWHEEL_CONSOLE_COLOR); // VER157 WANDA
				}
				DOMINAPLUS_MANAGER_sendWSCommand('RGB', WEBAPP_actualDevice + ',' + strRDecimal + ',' + strGDecimal + ',' + strBDecimal + ',' + RGBWHEEL_allColorWheels_IDs_AndRGBValues_ReceivedFromServer['id_' + WEBAPP_actualDevice][3]); // VER173 WANDA
			}
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages the click on the wheel
 * @param {object} RGBWHEEL_hiddenCanvas - the current canvas
 * @param {number} relativeX - x coordinate
 * @param {number} relativeY - y coordinate
 * @param {object} rgba - array containing rgba values
 * @param {boolean} bSkipRGBValueUpdate - update rgb value?
 * @version VER210B - WANDA
 */
function RGBWHEEL_manageClickOnWheel(RGBWHEEL_hiddenCanvas, relativeX, relativeY, rgba, bSkipRGBValueUpdate)
{
	var hsb = RGBWHEEL_rgb2hsb(rgba[0], rgba[1], rgba[2]);
	RGBWHEEL_drawRectPointer(RGBWHEEL_hiddenCanvas, relativeX, relativeY);
	RGBWHEEL_drawBrightnessSlider(RGBWHEEL_hiddenCanvas, hsb[0], parseInt(hsb[1] * 100));
	RGBWHEEL_drawBrightnessIndicator(RGBWHEEL_hiddenCanvas, (RGBWHEEL_hiddenCanvas.height * (100 - parseInt(hsb[2] * 100))) / 100);
	var strR = ('00' + (rgba[0].toString(16)));
	var strG = ('00' + (rgba[1].toString(16)));
	var strB = ('00' + (rgba[2].toString(16)));
	strR = strR.substr(strR.length - 2);
	strG = strG.substr(strG.length - 2);
	strB = strB.substr(strB.length - 2);
	var rgbColorString = '#' + strR + strG + strB;
	if (RGBWHEEL_PTR_updateRGBColorPreview !== null) {
		RGBWHEEL_PTR_updateRGBColorPreview(rgbColorString);
	}
	if (RGBWHEEL_PTR_updateColorDescription !== null) {
		RGBWHEEL_PTR_updateColorDescription(rgbColorString, hsb);
	}
	if (typeof bSkipRGBValueUpdate === 'undefined' || bSkipRGBValueUpdate === null || bSkipRGBValueUpdate === false) {
		RGBWHEEL_lastClientChosenRGBValueString = rgbColorString;
		RGBWHEEL_currentHSBValue = hsb;
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Click on ON/OFF button
 * @param {object} event - the occurring event
 * @version VER207 - WANDA
 */
function RGBWHEEL_onOffRgbw(text)
{
	if (text === 'OFF') {
		if (RGBWHEEL_PTR_updateRGBONOFFbutton !== null) {
			RGBWHEEL_PTR_updateRGBONOFFbutton('ON');
		}
		RGBWHEEL_onOffWheel('off');
		if (RGBWHEEL_PTR_updateRGBIcon !== null) {
			RGBWHEEL_PTR_updateRGBIcon(WEBAPP_actualDevice, 0); // status forced to avoid upd skipping problem
		}
	} else {
		if (RGBWHEEL_PTR_updateRGBONOFFbutton !== null) {
			RGBWHEEL_PTR_updateRGBONOFFbutton('OFF');
		}
		RGBWHEEL_onOffWheel('on');
		if (RGBWHEEL_PTR_updateRGBIcon !== null) {
			RGBWHEEL_PTR_updateRGBIcon(WEBAPP_actualDevice, 1); // status forced to avoid upd skipping problem
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages the click on the white channel
 * @param {object} event - the occurring event
 * @version VER207 - WANDA
 */
function RGBWHEEL_manageClickOnWhiteChannel(event)
{
	var relativeX = event.offsetX;
	var percentageX = 0;
	percentageX = parseInt((relativeX * 100) / (parseInt(event.currentTarget.clientWidth) * (DISPLAY_pageZoom / 100)));
	if (RGBWHEEL_PTR_setWhiteChannelPercentage !== null) {
		RGBWHEEL_PTR_setWhiteChannelPercentage(percentageX);
	}
	RGBWHEEL_currentWhitePercentage = percentageX;
	if (RGBWHEEL_PTR_updateWhiteIndicatorPosition !== null) {
		RGBWHEEL_PTR_updateWhiteIndicatorPosition(percentageX);
	}
	RGBWHEEL_bNumberOfRGBUpdatesToSkip = 0;
	var levelIn254esimi = RGBWHEEL_checkRGBWDeviceType_AndConvertPercentage2LevelIn254esimi_WithCorrectMethod(WEBAPP_actualDevice, percentageX);
	RGBWHEEL_allColorWheels_IDs_AndRGBValues_ReceivedFromServer['id_' + WEBAPP_actualDevice][3] = levelIn254esimi;
	RGBWHEEL_lastClientChosenWhiteValue = levelIn254esimi; // VER162 STEFANO
	RGBWHEEL_sendStoredRGBWValueToServer('WhiteChannel');
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages the click on the white channel indicator
 * @param {object} event - the occurring event
 * @version VER207 - WANDA
 */
function RGBWHEEL_manageClickOnRgbwWhiteIndicator(event)
{
	event.stopPropagation();
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ---------------------------------------------------------------------- GENERAL FUNCTIONS ------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Checks device type and converts percentage to level in 254 accordingly
 * @param {string} deviceID - the id of the device
 * @param {number} percentage - percentage value
 * @returns level in 254
 * @version VER207 - WANDA
 */
function RGBWHEEL_checkRGBWDeviceType_AndConvertPercentage2LevelIn254esimi_WithCorrectMethod(deviceID, percentage)
{
	var levelIn254esimi = 0;
	if (RGBWHEEL_checkRGBWDeviceType(parseInt(deviceID)) === RGBWHEEL_DEVICEID_FOUND_AND_IT_IS_RGBW_MANAGED_BY_ABLIGHT) {
		levelIn254esimi = parseInt(RGBWHEEL_logarithmicConversion_dimmerPercentage_2_LevelIn254esimi(percentage));
	} else {
		levelIn254esimi = parseInt(percentage * 255) / 100;
	}
	return levelIn254esimi;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Checks device type and converts level in 254 to percentage accordingly
 * @param {string} deviceID - the id of the device
 * @param {number} levelIn254esimi - level in 254 value
 * @returns percentage
 * @version VER162 - STEFANO
 */
function RGBWHEEL_checkRGBWDeviceType_AndConvertLevelIn254esimi2Percentage_WithCorrectMethod(deviceID, levelIn254esimi)
{
	var percentage = 0;
	if (RGBWHEEL_checkRGBWDeviceType(parseInt(deviceID)) === RGBWHEEL_DEVICEID_FOUND_AND_IT_IS_RGBW_MANAGED_BY_ABLIGHT) {
		percentage = RGBWHEEL_exponentialConversion_dimmerLevelIn254esimi_2_Percentage(levelIn254esimi);
	} else {
		percentage = (levelIn254esimi * 100) / 255;
	}
	return percentage;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Converts percentage to level in 254
 * @param {number} percentage - percentage value
 * @returns level in 254
 * @version VER161 - STEFANO
 */
function RGBWHEEL_logarithmicConversion_dimmerPercentage_2_LevelIn254esimi(percentage)
{
	if (percentage === 0) {
		return 0;
	} else if (percentage >= 100) {
		return 254;
	}
	var levelIn254esimi = 0;
	/* VER172 WANDA & STEFANO */
	if (DISPLAY_isTS10 || isTS01) { // TS10 and TS01 browser does not recognize log10, only natural log --- VER185 WANDA
		levelIn254esimi = (((Math.log(percentage) / Math.log(10)) + 1.0) * (253.0 / 3.0)) + 1.0;
	} else {
		levelIn254esimi = (((Math.log10(percentage)) + 1.0) * (253.0 / 3.0)) + 1.0;
	}
	/* ---------------------- */
	var integerPartLevelIn254esimi = parseInt(levelIn254esimi);
	if ((levelIn254esimi - integerPartLevelIn254esimi) >= 0.5) {
		levelIn254esimi = integerPartLevelIn254esimi + 1;
	}
	if (levelIn254esimi >= 254) {
		return 254;
	} else {
		return levelIn254esimi;
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Converts level in 254 to percentage
 * @param {number} levelIn254esimi - level 254 value
 * @returns percentage
 * @version VER161 - STEFANO
 */
function RGBWHEEL_exponentialConversion_dimmerLevelIn254esimi_2_Percentage(levelIn254esimi)
{
	if ((levelIn254esimi === 0) || (levelIn254esimi === 0xFF)) {
		return 0;
	}
	var percentage = Math.pow(10, (((levelIn254esimi - 1.0) / (253.0 / 3.0)) - 1.0));
	var integerPartPercentage = parseInt(percentage);
	if ((percentage - integerPartPercentage) >= 0.5) {
		percentage = integerPartPercentage + 1;
	} else {
		percentage = integerPartPercentage; // VER162 STEFANO
	}
	if (percentage >= 100) {
		return 100;
	} else {
		return percentage;
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Checks the device type
 * @param {string} deviceID - the id of the device
 * @returns the device type
 * @version VER206 - WANDA
 */
function RGBWHEEL_checkRGBWDeviceType(deviceID)
{
	var result = RGBWHEEL_DEVICEID_NOT_FOUND;
	for (var i = 0; i < DOMINAPLUS_MANAGER_deviceList.length; i++) {
		if (typeof DOMINAPLUS_MANAGER_deviceList[i].id !== 'undefined' && parseInt(DOMINAPLUS_MANAGER_deviceList[i].id) === parseInt(deviceID)) {
			if (typeof DOMINAPLUS_MANAGER_deviceList[i].type !== 'undefined' && parseInt(DOMINAPLUS_MANAGER_deviceList[i].type) === 22) {
				if (typeof DOMINAPLUS_MANAGER_deviceList[i].name !== 'undefined' && DOMINAPLUS_MANAGER_deviceList[i].name[DOMINAPLUS_MANAGER_deviceList[i].name.length - 1] === '$') {
					result = RGBWHEEL_DEVICEID_FOUND_AND_IT_IS_RGBW_MANAGED_BY_ABLIGHT;
				} else {
					result = RGBWHEEL_DEVICEID_FOUND_BUT_IT_IS_RGBW_NOT_MANAGED_BY_ABLIGHT;
				}
			} else {
				result = RGBWHEEL_DEVICEID_FOUND_BUT_NOT_RGBW;
			}
		}
	}
	return result;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Converts hsb to rgb
 * @param {number} hValue - h value
 * @param {number} sValue - s value
 * @param {number} bValue - b value
 * @returns rgb value
 * @version VER206 - WANDA
 */
function RGBWHEEL_hsb2rgb(hValue, sValue, bValue)
{
	var rgb = {};
	var h = Math.round(hValue);
	var s = Math.round(sValue * 255 / 100);
	var v = Math.round(bValue * 255 / 100);
	if (s === 0) {
		rgb.r = v;
		rgb.g = v;
		rgb.b = v;
	} else {
		var t1 = v;
		var t2 = (255 - s) * v / 255;
		var t3 = (t1 - t2) * (h % 60) / 60;
		if (h === 360) {
			h = 0;
		}
		if (h < 60) {
			rgb.r = t1;
			rgb.b = t2;
			rgb.g = t2 + t3;
		} else if (h < 120) {
			rgb.g = t1;
			rgb.b = t2;
			rgb.r = t1 - t3;
		} else if (h < 180) {
			rgb.g = t1;
			rgb.r = t2;
			rgb.b = t2 + t3;
		} else if (h < 240) {
			rgb.b = t1;
			rgb.r = t2;
			rgb.g = t1 - t3;
		} else if (h < 300) {
			rgb.b = t1;
			rgb.g = t2;
			rgb.r = t2 + t3;
		} else if (h < 360) {
			rgb.r = t1;
			rgb.g = t2;
			rgb.b = t1 - t3;
		} else {
			rgb.r = 0;
			rgb.g = 0;
			rgb.b = 0;
		}
	}
	var strR = ('00' + (Math.round(rgb.r).toString(16)));
	var strG = ('00' + (Math.round(rgb.g).toString(16)));
	var strB = ('00' + (Math.round(rgb.b).toString(16)));
	strR = strR.substr(strR.length - 2);
	strG = strG.substr(strG.length - 2);
	strB = strB.substr(strB.length - 2);
	return '' + strR + strG + strB;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Converts rgb to hsb
 * @param {number} rValue - r value
 * @param {number} gValue - g value
 * @param {number} bValue - b value
 * @returns hsb value
 * @version VER206 - WANDA
 */
function RGBWHEEL_rgb2hsb(rValue, gValue, bValue) 
{
	var computedH = 0;
	var computedS = 0;
	var computedV = 0;
	// Remove spaces from input RGB values, convert to int
	var r = parseInt(('' + rValue).replace(/\s/g, ''), 10);
	var g = parseInt(('' + gValue).replace(/\s/g, ''), 10);
	var b = parseInt(('' + bValue).replace(/\s/g, ''), 10);
	if (r === null || g === null || b === null || isNaN(r) || isNaN(g) || isNaN(b)) {
		alert('Please enter numeric RGB values!');
		return;
	}
	if (r < 0 || g < 0 || b < 0 || r > 255 || g > 255 || b > 255) {
		alert('RGB values must be in the range 0 to 255.');
		return;
	}
	r = r / 255;
	g = g / 255;
	b = b / 255;
	var minRGB = Math.min(r, Math.min(g, b));
	var maxRGB = Math.max(r, Math.max(g, b));
	// Black-gray-white
	if (minRGB === maxRGB) {
		computedV = minRGB;
		return [0, 0, computedV];
	}
	// Colors other than black-gray-white:
	var d = (r === minRGB) ? g - b : ((b === minRGB) ? r - g : b - r);
	var h = (r === minRGB) ? 3 : ((b === minRGB) ? 1 : 5);
	computedH = 60 * (h - d / (maxRGB - minRGB));
	computedS = (maxRGB - minRGB) / maxRGB;
	computedV = maxRGB;
	return [computedH, computedS, computedV];
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages the drawing of elements on canvas
 * @version VER206 - WANDA
 */
function RGBWHEEL_drawRGBWheels()
{
	RGBWHEEL_drawWheelOnCanvas(RGBWHEEL_hiddenCanvas);
	RGBWHEEL_drawWheelOnCanvas(RGBWHEEL_hiddenGrayScaleCanvas, true);
	RGBWHEEL_drawBrightnessSlider(RGBWHEEL_hiddenCanvas, 0, 0);
	RGBWHEEL_drawBrightnessSlider(RGBWHEEL_hiddenGrayScaleCanvas, 0, 0);
	RGBWHEEL_drawRectPointer(RGBWHEEL_hiddenCanvas, 100, 100);
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Draws wheel on canvas
 * @param {object} canvas - the canvas to draw on
 * @param {boolean} grayScale - is the canvas the gray one?
 * @version VER206 - WANDA
 */
function RGBWHEEL_drawWheelOnCanvas(canvas, grayScale)
{
	if (typeof grayScale === 'undefined' || grayScale === null) {
		var ctx1 = canvas.getContext('2d', { willReadFrequently: true });
		ctx1.drawImage(RGBWHEEL_imageToLoadColor, 0, 0);
	} else {
		var ctx2 = canvas.getContext('2d', { willReadFrequently: true });
		ctx2.drawImage(RGBWHEEL_imageToLoadGray, 0, 0);
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Draws brightness bar on canvas
 * @param {object} canvas - the canvas to draw on
 * @param {number} h - the h value
 * @param {number} s - the s value
 * @version VER206 - WANDA
 */
function RGBWHEEL_drawBrightnessSlider(canvas, h, s)
{
	var centerY = parseInt(canvas.height / 2);
	var ctx = canvas.getContext('2d', { willReadFrequently: true });
	for (var y = 0; y < centerY * 2; y++) {
		ctx.fillStyle = '#' + RGBWHEEL_hsb2rgb(h, s, 100 - parseInt((y * 100) / (centerY * 2)));
		ctx.fillRect(centerY * 2 + 30, y, 30, 1);
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Draws rect pointer to circle
 * @param {object} canvas - the canvas to draw on
 * @param {number} x - x coordinate
 * @param {number} y - y coordinate
 * @version VER207 - WANDA
 */
function RGBWHEEL_drawRectPointer(canvas, x, y)
{
	var ctx = canvas.getContext('2d', { willReadFrequently: true });
	if (RGBWHEEL_previousXPointer !== -1 && RGBWHEEL_previousYPointer !== -1) {
		ctx.putImageData(RGBWHEEL_previousCanvasData, RGBWHEEL_previousXPointer - RGBWHEEL_rectPointerWidth, RGBWHEEL_previousYPointer - RGBWHEEL_rectPointerHeight);
	}
	RGBWHEEL_previousCanvasData = RGBWHEEL_hiddenCanvas.getContext('2d', { willReadFrequently: true }).getImageData(x - RGBWHEEL_rectPointerWidth, y - RGBWHEEL_rectPointerHeight, RGBWHEEL_rectPointerWidth * 2, RGBWHEEL_rectPointerHeight * 2);
	ctx.fillStyle = '#000000';
	ctx.fillRect(x - parseInt(RGBWHEEL_rectPointerWidth / 2), y - parseInt(RGBWHEEL_rectPointerHeight / 2), RGBWHEEL_rectPointerWidth, RGBWHEEL_rectPointerHeight);
	RGBWHEEL_previousXPointer = x;
	RGBWHEEL_previousYPointer = y;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Checks if the click is inside the circle
 * @param {object} canvas - the current canvas
 * @param {number} relativeX - x coordinate
 * @param {number} relativeY - y coordinate
 * @returns true if click is inside the circle, false otherwise
 * @version VER206 - WANDA
 */
function RGBWHEEL_isClickInsideCircle(canvas, relativeX, relativeY)
{
	var returnValue = false;
	var centerY = parseInt(canvas.height / 2);
	var centerX = centerY;
	var distance = Math.pow((relativeX - centerX) * (relativeX - centerX) + (relativeY - centerY) * (relativeY - centerY), 0.5);
	if (distance < centerY) {
		returnValue = true;
	}
	return returnValue;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Checks if the click is inside the brightness bar
 * @param {object} canvas - the current canvas
 * @param {number} relativeX - x coordinate
 * @returns true if click is inside the brightness bar, false otherwise
 * @version VER206 - WANDA
 */
function RGBWHEEL_isClickInsideBrightnessBar(canvas, relativeX)
{
	var returnValue = false;
	var centerY = parseInt(canvas.height / 2);
	if (relativeX >= (centerY * 2 + 30) && relativeX <= (centerY * 2 + 30 + 30)) {
		returnValue = true;
	}
	return returnValue;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Draws the brightness indicator
 * @param {object} canvas - the current canvas 
 * @param {number} relativeY - y coordinate
 * @version VER206 - WANDA
 */
function RGBWHEEL_drawBrightnessIndicator(canvas, relativeY)
{
	var centerY = parseInt(canvas.height / 2);
	var ctx = canvas.getContext('2d', { willReadFrequently: true });
	if (RGBWHEEL_previousYBrightnessColor !== null) {
		var strR = ('00' + (RGBWHEEL_previousYBrightnessColor[0].toString(16)));
		var strG = ('00' + (RGBWHEEL_previousYBrightnessColor[1].toString(16)));
		var strB = ('00' + (RGBWHEEL_previousYBrightnessColor[2].toString(16)));
		strR = strR.substr(strR.length - 2);
		strG = strG.substr(strG.length - 2);
		strB = strB.substr(strB.length - 2);
		ctx.fillStyle = '#' + strR + strG + strB;
		ctx.fillRect(centerY * 2 + 30, RGBWHEEL_previousYBrightness, 30, 1);
	}
	ctx.fillStyle = '#000000';
	RGBWHEEL_previousYBrightnessColor = RGBWHEEL_hiddenCanvas.getContext('2d', { willReadFrequently: true }).getImageData(centerY * 2 + 30, relativeY, 1, 1).data;
	ctx.fillRect(centerY * 2 + 30, relativeY, 30, 1);
	RGBWHEEL_previousYBrightness = relativeY;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Calculates the relative (X, Y) from RGB value
 * @param {object} canvas - the current canvas 
 * @param {object} rgba - array containing rgba values
 * @returns the relative (X, Y) coordinates
 * @version VER161 - STEFANO
 */
function RGBWHEEL_calculateRelativeXYFromRGBValue(canvas, rgba)
{
	var centerY = parseInt(canvas.height / 2);
	var centerX = centerY;
	var xy = new Array();
	var hsb = RGBWHEEL_rgb2hsb(rgba[0], rgba[1], rgba[2]);
	var angle = parseInt(hsb[0]);
	var radius = parseInt(hsb[1] * 100 * RGBWHEEL_detailFactor);
	/* VER131 */
	if (RGBWHEEL_enableLog) { // VER161 STEFANO
		console.log('%c' + RGBWHEEL_PREFIX + 'radius_a = ' + radius + ' threshold = ' + (parseInt(canvas.height / 2) * RGBWHEEL_detailFactor), 'color: ' + RGBWHEEL_CONSOLE_COLOR); // VER157 WANDA
	}
	if (radius >= (parseInt(canvas.height / 2) * RGBWHEEL_detailFactor)) {
		radius = parseInt(canvas.height / 2) * RGBWHEEL_detailFactor - 1;
		if (RGBWHEEL_enableLog) { // VER161 STEFANO
			console.log('%c' + RGBWHEEL_PREFIX + 'radius_b = ' + radius, 'color: ' + RGBWHEEL_CONSOLE_COLOR); // VER157 WANDA
		}
	}
	/* ------ */
	/* VER148 WANDA E STEFANO */
	var x = centerX + radius / RGBWHEEL_detailFactor * Math.cos((2 * Math.PI * angle) / (360));
	var y = centerY - radius / RGBWHEEL_detailFactor * Math.sin((2 * Math.PI * angle) / (360));
	/* ---------------------- */
	xy = [x, y];
	return xy;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Adds rgbwheel to the page
 * @version VER207 - WANDA
 */
function RGBWHEEL_addColorWheel()
{
	if (RGBWHEEL_PTR_addRGBWheels !== null) {
		RGBWHEEL_PTR_addRGBWheels(RGBWHEEL_hiddenCanvas, RGBWHEEL_hiddenGrayScaleCanvas);
	}
	if (RGBWHEEL_PTR_updateRGBColorPreview !== null) {
		RGBWHEEL_PTR_updateRGBColorPreview('#FFF');
	}
	if (RGBWHEEL_allColorWheels_IDs_AndRGBValues_ReceivedFromServer['id_' + WEBAPP_actualDevice] !== null) {
		var xy = RGBWHEEL_calculateRelativeXYFromRGBValue(RGBWHEEL_hiddenCanvas, RGBWHEEL_allColorWheels_IDs_AndRGBValues_ReceivedFromServer['id_' + WEBAPP_actualDevice]);
		RGBWHEEL_manageClickOnWheel(RGBWHEEL_hiddenCanvas, xy[0], xy[1], RGBWHEEL_allColorWheels_IDs_AndRGBValues_ReceivedFromServer['id_' + WEBAPP_actualDevice]);
		RGBWHEEL_lastClientChosenWhiteValue = RGBWHEEL_allColorWheels_IDs_AndRGBValues_ReceivedFromServer['id_' + WEBAPP_actualDevice][3]; // VER162 STEFANO (at beginning chosen white value is forced equal to the received value from server)
	} else {
		var xy = RGBWHEEL_calculateRelativeXYFromRGBValue(RGBWHEEL_hiddenCanvas, [255, 255, 255]);
		RGBWHEEL_manageClickOnWheel(RGBWHEEL_hiddenCanvas, xy[0], xy[1], [255, 255, 255]);
	}
	var whitePercentage = RGBWHEEL_checkRGBWDeviceType_AndConvertLevelIn254esimi2Percentage_WithCorrectMethod(WEBAPP_actualDevice, RGBWHEEL_allColorWheels_IDs_AndRGBValues_ReceivedFromServer['id_' + WEBAPP_actualDevice][3]); //VER162 STEFANO 
	if (RGBWHEEL_PTR_setWhiteChannelPercentage !== null) {
		RGBWHEEL_PTR_setWhiteChannelPercentage(parseInt(whitePercentage));
	}
	RGBWHEEL_currentWhitePercentage = parseInt(whitePercentage);
	if (RGBWHEEL_PTR_updateWhiteIndicatorPosition !== null) {
		RGBWHEEL_PTR_updateWhiteIndicatorPosition(parseInt(whitePercentage));
	}
	/* VER131 STEFANO */
	for (var i = 0; i < DOMINAPLUS_MANAGER_deviceList.length; i++) {
		if (typeof DOMINAPLUS_MANAGER_deviceList[i].id !== 'undefined' && parseInt(DOMINAPLUS_MANAGER_deviceList[i].id) === parseInt(WEBAPP_actualDevice) && typeof DOMINAPLUS_MANAGER_deviceList[i].type !== 'undefined' && parseInt(DOMINAPLUS_MANAGER_deviceList[i].type) === 22) {
			if (typeof DOMINAPLUS_MANAGER_deviceList[i].currentVal !== 'undefined' && parseInt(DOMINAPLUS_MANAGER_deviceList[i].currentVal) === 0) {
				RGBWHEEL_onOffWheel('off', 'block'); // VER161 STEFANO
				if (RGBWHEEL_PTR_updateRGBONOFFbutton !== null) {
					RGBWHEEL_PTR_updateRGBONOFFbutton('ON');
				}
			} else {
				RGBWHEEL_onOffWheel('on', 'block'); // VER161 STEFANO
				if (RGBWHEEL_PTR_updateRGBONOFFbutton !== null) {
					RGBWHEEL_PTR_updateRGBONOFFbutton('OFF');
				}
			}
			break; // VER162 STEFANO
		}
	}
	/* -------------- */
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Sends restore previous color value command
 * @version VER158 - STEFANO
 */
function RGBWHEEL_sendRestorePreviousColorValueCommand()
{
	DOMINAPLUS_MANAGER_sendWSCommand('RPV', WEBAPP_actualDevice); // VER173 WANDA
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages ON/OFF
 * @param {string} status - 'on' or 'off'
 * @param {string} blockString - 'block' or undefined
 * @version VER210B - WANDA
 */
function RGBWHEEL_onOffWheel(status, blockString)
{
	// ON
	if (status == 'on') {
		if (RGBWHEEL_PTR_showHideColorWheel !== null) {
			RGBWHEEL_PTR_showHideColorWheel(RGBWHEEL_hiddenCanvas, RGBWHEEL_hiddenGrayScaleCanvas, 'ON');
		}
		if (typeof blockString === 'undefined' || blockString === null || blockString !== 'block') {
			// VER161 STEFANO
			if (RGBWHEEL_lastClientChosenRGBValueString == '#000000') {
				RGBWHEEL_bNumberOfRGBUpdatesToSkip = 0;
				RGBWHEEL_sendRestorePreviousColorValueCommand();
			} else {
				if (RGBWHEEL_PTR_updateRGBColorPreview !== null) {
					RGBWHEEL_PTR_updateRGBColorPreview(RGBWHEEL_lastClientChosenRGBValueString);
				}
				var whitePercentage = RGBWHEEL_checkRGBWDeviceType_AndConvertLevelIn254esimi2Percentage_WithCorrectMethod(WEBAPP_actualDevice, RGBWHEEL_lastClientChosenWhiteValue); // VER162 STEFANO
				if (RGBWHEEL_PTR_setWhiteChannelPercentage !== null) {
					RGBWHEEL_PTR_setWhiteChannelPercentage(parseInt(whitePercentage));
				}
				RGBWHEEL_currentWhitePercentage = parseInt(whitePercentage);
				if (RGBWHEEL_PTR_updateWhiteIndicatorPosition !== null) {
					RGBWHEEL_PTR_updateWhiteIndicatorPosition(parseInt(whitePercentage));
				}
				RGBWHEEL_bNumberOfRGBUpdatesToSkip = 0; // VER161 STEFANO VERIFICARE CON ABDI
				RGBWHEEL_updateGUIWithLocalClientLastChosenValues();
				RGBWHEEL_sendStoredRGBWValueToServer('GlobalON');
			}
		}
	}
	// OFF
	else if (status == 'off') {
		if (RGBWHEEL_PTR_showHideColorWheel !== null) {
			RGBWHEEL_PTR_showHideColorWheel(RGBWHEEL_hiddenCanvas, RGBWHEEL_hiddenGrayScaleCanvas, 'OFF');
		}
		if (RGBWHEEL_PTR_updateRGBColorPreview !== null) {
			RGBWHEEL_PTR_updateRGBColorPreview('#888');
		}
		if (RGBWHEEL_PTR_setWhiteChannelPercentage !== null) {
			RGBWHEEL_PTR_setWhiteChannelPercentage(0);
		}
		RGBWHEEL_currentWhitePercentage = 0;
		if (RGBWHEEL_PTR_updateWhiteIndicatorPosition !== null) {
			RGBWHEEL_PTR_updateWhiteIndicatorPosition(0);
		}
		if (typeof blockString === 'undefined' || blockString === null || blockString !== 'block') {
			RGBWHEEL_bNumberOfRGBUpdatesToSkip = 1; // VER161 STEFANO
			RGBWHEEL_sendCustomRGBWValueToServer(0, 0, 0, 0, 'GlobalOFF');
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates the HTML with the local client last chosen values
 */
function RGBWHEEL_updateGUIWithLocalClientLastChosenValues()
{
	var rgbw = new Array(4);
	rgbw[0] = parseInt(RGBWHEEL_lastClientChosenRGBValueString.substr(1, 2), 16);
	rgbw[1] = parseInt(RGBWHEEL_lastClientChosenRGBValueString.substr(3, 2), 16);
	rgbw[2] = parseInt(RGBWHEEL_lastClientChosenRGBValueString.substr(5, 2), 16);
	rgbw[3] = RGBWHEEL_lastClientChosenWhiteValue; // VER162 STEFANO
	var xy = RGBWHEEL_calculateRelativeXYFromRGBValue(RGBWHEEL_hiddenCanvas, rgbw);
	RGBWHEEL_manageClickOnWheel(RGBWHEEL_hiddenCanvas, xy[0], xy[1], rgbw, true);
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Sends custom RGBW value to server
 * @param {number} r - r value
 * @param {number} g - g value
 * @param {number} b - b value
 * @param {number} w - w value
 * @param {string} caller - 'GlobalOFF', 'GlobalON', 'WhiteChannel'
 * @version VER161 - STEFANO
 */
function RGBWHEEL_sendCustomRGBWValueToServer(r, g, b, w, caller)
{
	if (RGBWHEEL_enableLog) { // VER161 STEFANO
		console.log('%c' + RGBWHEEL_PREFIX + caller + ' Sending RGB command : ID = ' + WEBAPP_actualDevice + ', RGBW = ' + r + ', ' + g + ', ' + b + ', ' + w, 'color: ' + RGBWHEEL_CONSOLE_COLOR); // VER157 WANDA
	}
	/* VER141 */
	var strRDecimal = ('00' + (r.toString(10)));
	var strGDecimal = ('00' + (g.toString(10)));
	var strBDecimal = ('00' + (b.toString(10)));
	/* ------ */
	DOMINAPLUS_MANAGER_sendWSCommand('RGB', WEBAPP_actualDevice + ',' + strRDecimal + ',' + strGDecimal + ',' + strBDecimal + ',' + w); // VER173 WANDA
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Sends stored RGBW values to server
 * @param {string} caller - 'GlobalON', 'WhiteChannel'
 * @version VER207 - WANDA
 */
function RGBWHEEL_sendStoredRGBWValueToServer(caller)
{
	var r = parseInt(RGBWHEEL_lastClientChosenRGBValueString.substr(1, 2), 16);
	var g = parseInt(RGBWHEEL_lastClientChosenRGBValueString.substr(3, 2), 16);
	var b = parseInt(RGBWHEEL_lastClientChosenRGBValueString.substr(5, 2), 16);
	var w = RGBWHEEL_lastClientChosenWhiteValue; // VER162 STEFANO
	/* VER161 STEFANO */
	var buttonIsON = false;
	if (RGBWHEEL_PTR_checkIfRGBONOFFbuttonIsON !== null) {
		buttonIsON = RGBWHEEL_PTR_checkIfRGBONOFFbuttonIsON();
	}
	if (buttonIsON === true) { // If the button is 'ON' it means that the wheel is off ('ON' is the next operation)
		r = 0;
		g = 0;
		b = 0;
	}
	/* -------------- */
	RGBWHEEL_sendCustomRGBWValueToServer(r, g, b, w, caller);
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages UPDs
 * @param {object} parameters - array containing rgbw informations
 * @version VER210B - WANDA
 */
function RGBWHEEL_manageUPD(parameters)
{
	if (RGBWHEEL_bNumberOfRGBUpdatesToSkip <= 0) {
		if (RGBWHEEL_enableLog) {
			console.log('%c' + RGBWHEEL_PREFIX + 'UPD RGB NOT SKIPPED: ' + parameters, 'color: ' + RGBWHEEL_CONSOLE_COLOR);
		}
		var rgbw = new Array();
		rgbw[0] = parseInt(parameters[2]);
		rgbw[1] = parseInt(parameters[3]);
		rgbw[2] = parseInt(parameters[4]);
		rgbw[3] = parseInt(parameters[5]);
		/* VER131 */
		var deviceID = parseInt(parameters[1]);
		var rgbwStatus = 0;
		var bSkipRGBValueUpdate = false; // VER161 STEFANO
		if (rgbw[0] < 10 && rgbw[1] < 10 && rgbw[2] < 10 && rgbw[3] < 10) {
			bSkipRGBValueUpdate = true; // VER161 STEFANO
			rgbwStatus = 0;
		} else {
			rgbwStatus = 1;
		}
		if (RGBWHEEL_PTR_updateRGBIcon !== null) {
			RGBWHEEL_PTR_updateRGBIcon(deviceID, rgbwStatus);
		}
		if (parseInt(WEBAPP_actualDevice) === deviceID && RGBWHEEL_hiddenCanvas !== null && RGBWHEEL_hiddenGrayScaleCanvas !== null) { // VER210B WANDA
			if (rgbwStatus === 0) {
				RGBWHEEL_onOffWheel('off', 'block');
				if (RGBWHEEL_PTR_updateRGBONOFFbutton !== null) {
					RGBWHEEL_PTR_updateRGBONOFFbutton('ON');
				}
			} else {
				RGBWHEEL_onOffWheel('on', 'block');
				if (RGBWHEEL_PTR_updateRGBONOFFbutton !== null) {
					RGBWHEEL_PTR_updateRGBONOFFbutton('OFF');
				}
			}
		}
		RGBWHEEL_allColorWheels_IDs_AndRGBValues_ReceivedFromServer['id_' + deviceID] = rgbw;
		if (parseInt(WEBAPP_actualDevice) === deviceID && RGBWHEEL_hiddenCanvas !== null && RGBWHEEL_hiddenGrayScaleCanvas !== null) { // VER210B WANDA
			var xy = RGBWHEEL_calculateRelativeXYFromRGBValue(RGBWHEEL_hiddenCanvas, rgbw);
			if (RGBWHEEL_enableLog) {
				console.log('%c' + RGBWHEEL_PREFIX + 'RECV rgbw =' + rgbw[0] + ', ' + rgbw[1] + ', ' + rgbw[2] + ', ' + rgbw[3] + ', Equivalent xy = ' + xy[0] + ', ' + xy[1], 'color: ' + RGBWHEEL_CONSOLE_COLOR);
			}
			RGBWHEEL_manageClickOnWheel(RGBWHEEL_hiddenCanvas, xy[0], xy[1], rgbw, bSkipRGBValueUpdate); // VER161 STEFANO
			/* VER131 */
			var whitePercentage = RGBWHEEL_checkRGBWDeviceType_AndConvertLevelIn254esimi2Percentage_WithCorrectMethod(WEBAPP_actualDevice, RGBWHEEL_allColorWheels_IDs_AndRGBValues_ReceivedFromServer['id_' + WEBAPP_actualDevice][3]); // VER162 STEFANO
			if (RGBWHEEL_PTR_setWhiteChannelPercentage !== null) {
				RGBWHEEL_PTR_setWhiteChannelPercentage(parseInt(whitePercentage));
			}
			RGBWHEEL_currentWhitePercentage = parseInt(whitePercentage);
			if (RGBWHEEL_PTR_updateWhiteIndicatorPosition !== null) {
				RGBWHEEL_PTR_updateWhiteIndicatorPosition(parseInt(whitePercentage));
			}
			/* ------ */
		}
	} else {
		if (RGBWHEEL_enableLog) {
			console.log('%c' + RGBWHEEL_PREFIX + 'UPD RGB SKIPPED (RGBWHEEL_bNumberOfRGBUpdatesToSkip = ' + RGBWHEEL_bNumberOfRGBUpdatesToSkip + '): ' + parameters, 'color: ' + RGBWHEEL_CONSOLE_COLOR);
		}
		RGBWHEEL_bNumberOfRGBUpdatesToSkip--;
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ *///++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
// "EcoIoTUserPriorityPage.js V16.0" -> "ECO_module.js VER 17.0 WANDA + WILLIAM"
//  
// Author Saimon Vallio - William Rabak
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

var ECO_PREFIX        = '[ECO]: ';
var ECO_CONSOLE_COLOR = '#ff00ff'; // Fuchsia
var ECO_CONSOLE_ERROR = '#ff0000'; // Red

var ECO_SINGLE_PHASE_LOADS_NUM = 12;    // Numero massimo di carichi per controllo carichi MONOFASE
var ECO_THREE_PHASE_LOADS_NUM  = 15;    // Numero massimo di carichi per controllo carichi TRIFASE
var ECO_SELFCONS_LOADS_NUM     = 6;     // Numero massimo di carichi per autoconsumo

/******************************************************************/
/* TX FRAME
/******************************************************************/
// 'ECO Loads Addresses Data Request' frame
var ECO_adrDataRequest              = 'LR';

// 'ECO Loads Powers Data Request' frame
var ECO_nominalPowerDataRequest     = 'PR';

// 'ECO Loads Priorities Change' frame
var ECO_loadPriority                = 'YC';

// 'ECO Config Data Request' frame
var ECO_configurationDataRequest    = 'ER';

// 'ECO Self-consumption Loads Data Request' frame
var ECO_selfConsLoadsDataRequest    = 'AR';

// 'ECO Self-consumption Loads Priorities Change' frame
var ECO_selfConsLoadPriority        = 'YP';

/******************************************************************/
/* RX FRAME
/******************************************************************/
// 'ECO Loads Addresses Data Response' frame
var ECO_adrDataResponse             = 'LD';

// 'ECO Loads Powers Data Response' frame
var ECO_nominalPowerDataResponse    = 'PD';

// 'ECO Loads Priorities Acknowledge' frame
var ECO_loadPriorityAck             = 'YA';

// 'ECO Config Data Response' frame
var ECO_configurationDataResponse   = 'EC';

/******************************************************************/
/* Global Variables
/******************************************************************/
var ECO_callerTypeEnum  = { WEBSERVER: 0, IOT: 1 };
var ECO_callerType      = ECO_callerTypeEnum.WEBSERVER;
var ECO_callerPhaseEnum = { UNDEFINED: 0, SINGLE_PHASE: 1, THREE_PHASE: 2, SINGLE_PHASE_IOT: 3 };
var ECO_callerPhase     = ECO_callerPhaseEnum.UNDEFINED;

// ENUM PAGE OPERATIONS STATUS
var ECO_operationsStusEnum = { NOTHING_TO_DO: 0, PRG_RESULT_OK: 1, PRG_RESULT_TIME_OUT: 2, NO_LOADS_CONFIGURED: 3 };

// ENUM LOAD BLOCK / UNBLOCK STATUS
var ECO_blockedUnblockedStusEnum = { UNBLOCKED_LOAD: 0, BLOCKED_LOAD: 1, FUTURE_BLOCKED_LOAD: 2, FUTURE_UNBLOCKED_LOAD: 3 };

// ENUM THREE-PHASE LINE TYPE
// Associazione del carico trifase (RST, R, S, T)
var ECO_3PhaseLineTypeEnum = { ALL_LINES: 0, LINE1_R: 1, LINE2_S: 2, LINE3_T: 3 };

// Device parameters
var ECO_currentAvebusAddress;
var ECO_currentAvebusType;
var ECO_currentUID;
var ECO_currentUABC;

// Data arrays
var ECO_addrValues                          = [];
var ECO_addrValuesAtFirstEntry              = [];
var ECO_typeValues                          = [];
var ECO_typeValuesAtFirstEntry              = [];
var ECO_nominalPowerValues                  = [];
var ECO_actualPowerValues                   = [];
var ECO_loadStatusValues                    = [];
var ECO_sortedLoadLogicalStatusValuesArray  = [];
var ECO_blockUnblockLoadArrayAtFirstEntry   = [];
var ECO_managedBlockUnblockLoadArray        = [];
var ECO_loadsPowerValuesArray               = [];
var ECO_loadsPowerFlagsArray                = [];
var ECO_firstRXAddrValues                   = [];
var ECO_firstRXPowerValues                  = [];
var ECO_firstRXFlags                        = [];
var ECO_firstRXNominalPowerValues           = [];

// Misure di potenza sull'impianto
var ECO_powerDrawnMeasurements              = [];   // [0]=Impianto | [1]=L1 | [2]=L2 | [3]=L3
var ECO_powerInjectedMeasurements           = [];   // [0]=Impianto | [1]=L1 | [2]=L2 | [3]=L3
var ECO_powerProducedMeasurements           = [];   // [0]=Impianto | [1]=L1 | [2]=L2 | [3]=L3
var ECO_powerUsedMeasurements               = [];   // [0]=Impianto | [1]=L1 | [2]=L2 | [3]=L3
var ECO_synopticInfoArray                   = [];

var ECO_selfConsAddrValues                          = [];   // ECO_addrValues
var ECO_selfConsAddrValuesAtFirstEntry              = [];   // ECO_addrValuesAtFirstEntry
var ECO_selfConsTypeValues                          = [];   // ECO_typeValues
var ECO_selfConsTypeValuesAtFirstEntry              = [];   // ECO_typeValuesAtFirstEntry
var ECO_selfConsNominalPowerValues                  = [];   // ECO_nominalPowerValues
var ECO_selfConsActualPowerValues                   = [];   // ECO_actualPowerValues
var ECO_selfConsLoadsStatusValues                   = [];   // ECO_loadStatusValues
var ECO_selfConsSortedLoadLogicalStatusValuesArray  = [];   // ECO_sortedLoadLogicalStatusValuesArray
var ECO_selfConsBlockUnblockLoadArrayAtFirstEntry   = [];   // ECO_blockUnblockLoadArrayAtFirstEntry  
var ECO_selfConsManagedBlockUnblockLoadArray        = [];   // ECO_managedBlockUnblockLoadArray
var ECO_selfConsLoadsPowerValuesArray               = [];   // ECO_loadsPowerValuesArray
var ECO_selfConsLoadsPowerFlagsArray                = [];   // ECO_loadsPowerFlagsArray
var ECO_selfConsFirstRXAddrValues                   = [];   // ECO_firstRXAddrValues
var ECO_selfConsFirstRXPowerValues                  = [];   // ECO_firstRXPowerValues
var ECO_selfConsFirstRXFlags                        = [];   // ECO_firstRXFlags
var ECO_selfConsFirstRXNominalPowerValues           = [];   // ECO_firstRXNominalPowerValues
var ECO_selfConsLoadsTimerValues                    = [];

var ECO_ProgramToolsAvebusAddress                   = '01';
var ECO_WaitedMessageName                           = '';

var ECO_plantDetachedThreshold                      = null;

var ECO_AddrDataRequestInProgress                   = false;
var ECO_SelfConsAddrDataRequestInProgress           = false;
var ECO_NominalPowerDataRequestInProgress           = false;
var ECO_loadPriorityChangeInProgress                = false;
var ECO_ConfigDataRequestInProgress                 = false;
var ECO_selfConsLoadPriorityChangeInProgress        = false;

var ECO_AssociatedIndexes                           = [];
var ECO_selfConsAssociatedIndexes                   = [];
var ECO_idxChangeInProgress                         = false;

var ECO_adrDataResponseMessageFirstEntryFlag           = true; // Flag for first entry for memo
var ECO_selfConsAdrDataResponseMessageFirstEntryFlag   = true; // Flag for first entry for memo
var ECO_nominalPowerDataResponseFirstEntryFlag         = true;
var ECO_selfConsNominalPowerDataResponseFirstEntryFlag = true;

/******************************************************************/
/* Function pointers
/******************************************************************/
var ECO_PTR_disable_GUI_UpDownBottons               = null;
var ECO_PTR_enable_GUI_UpDownButtons                = null;
var ECO_PTR_disable_GUI_writeValuesButton           = null;
var ECO_PTR_enable_GUI_writeValuesButton            = null;
var ECO_PTR_fillGUIWithRXConfigurationValues        = null;
var ECO_PTR_fillGUIWithLoadStatusValues             = null;
var ECO_PTR_fillGUIWithOperationsStatus             = null;
var ECO_PTR_changeLoadBlockUnblockStatus            = null;
var ECO_PTR_fillGUIWithRXPowerSettingsValues        = null;
var ECO_PTR_fillGUIWithLoadsPowerValues             = null;
var ECO_PTR_fillGUIWithProtectionsStatus            = null;
var ECO_PTR_ecoTypeWiredUABCIdentified              = null;
var ECO_PTR_fillGUIwithPlantPowerValues             = null;
var ECO_PTR_fillGUIWithSelfConsLoadsPowerValues     = null;
var ECO_PTR_fillGUIWithSelfConsLoadStatusValues     = null;
var ECO_PTR_changeSelfConsLoadBlockUnblockStatus    = null;
var ECO_PTR_wsSendMessage                           = null;

/******************************************************************/
// Build CRC DominaPlus
/******************************************************************/
function ECO_buildCRCDominaPlus(buffer)
{
    var crc = 0;
    for (var i = 0; i < buffer.length; i++) {
        crc = crc ^ buffer.charCodeAt(i);
    }
    crc = 0xFF - crc;
    var MSB = parseInt(crc / 16).toString(16);
    var LSB = parseInt(parseInt(crc % 16)).toString(16);
    crc = MSB + LSB;
    crc = crc.toUpperCase();
    return crc;
}

/******************************************************************/
// Build CRC Avebus
/******************************************************************/
function ECO_buildCRCAveBus(str) 
{
    var crc = 0;
    for (var i = 0; i < (str.length); i = i + 2) {
        var subStr = str.substring(i, i + 2);
        crc += (255 - ECO_hexStringToInt(subStr));
    }
    crc = 65535 - crc;
    crc = crc.toString(16);
    crc = crc.toUpperCase();
    return crc;
}

/******************************************************************/
// Convert hexadecimal to string
/******************************************************************/
function ECO_hexStringToInt(str)
{
    var iValA;
    var iValB;
    iValA = str.charCodeAt(0) - 48;
    if (iValA > 9) {
        iValA -= 7;
    }
    iValB = str.charCodeAt(1) - 48;
    if (iValB > 9) {
        iValB -= 7;
    }
    iValA *= 16;
    iValA += iValB;
    return iValA;
}

/******************************************************************/
// Module Initialization
/******************************************************************/
function ECO_setCallBackForGUI(ptr_disable_GUI_UpDownBottons,
                               ptr_enable_GUI_UpDownBottons,
                               ptr_disable_GUI_writeValuesButton,
                               ptr_enable_GUI_writeValuesButton,
                               ptr_fillGUIWithRXConfigurationValues,
                               ptr_fillGUIWithLoadStatusValues,
                               ptr_fillGUIWithOperationsStatus,
                               ptr_changeLoadBlockUnblockStatus,
                               ptr_fillGUIWithRXPowerSettingsValues,
                               ptr_fillGUIWithLoadsPowerValues,
                               ptr_fillGUIWithProtectionsStatus,
                               ptr_ecoTypeWiredUABCIdentified,
                               ptr_fillGUIwithPlantPowerValues,
                               ptr_fillGUIWithSelfConsLoadsPowerValues,
                               ptr_fillGUIWithSelfConsLoadStatusValues,
                               ptr_changeSelfConsLoadBlockUnblockStatus)
{
    ECO_PTR_disable_GUI_UpDownBottons               = ptr_disable_GUI_UpDownBottons;
    ECO_PTR_enable_GUI_UpDownButtons                = ptr_enable_GUI_UpDownBottons;
    ECO_PTR_disable_GUI_writeValuesButton           = ptr_disable_GUI_writeValuesButton;
    ECO_PTR_enable_GUI_writeValuesButton            = ptr_enable_GUI_writeValuesButton;
    ECO_PTR_fillGUIWithRXConfigurationValues        = ptr_fillGUIWithRXConfigurationValues;
    ECO_PTR_fillGUIWithLoadStatusValues             = ptr_fillGUIWithLoadStatusValues;
    ECO_PTR_fillGUIWithOperationsStatus             = ptr_fillGUIWithOperationsStatus;
    ECO_PTR_changeLoadBlockUnblockStatus            = ptr_changeLoadBlockUnblockStatus;
    ECO_PTR_fillGUIWithRXPowerSettingsValues        = ptr_fillGUIWithRXPowerSettingsValues;
    ECO_PTR_fillGUIWithLoadsPowerValues             = ptr_fillGUIWithLoadsPowerValues;
    ECO_PTR_fillGUIWithProtectionsStatus            = ptr_fillGUIWithProtectionsStatus;
    ECO_PTR_ecoTypeWiredUABCIdentified              = ptr_ecoTypeWiredUABCIdentified;
    ECO_PTR_fillGUIwithPlantPowerValues             = ptr_fillGUIwithPlantPowerValues;
    ECO_PTR_fillGUIWithSelfConsLoadsPowerValues     = ptr_fillGUIWithSelfConsLoadsPowerValues;
    ECO_PTR_fillGUIWithSelfConsLoadStatusValues     = ptr_fillGUIWithSelfConsLoadStatusValues;
    ECO_PTR_changeSelfConsLoadBlockUnblockStatus    = ptr_changeSelfConsLoadBlockUnblockStatus;

    ECO_selfConsNominalPowerDataResponseFirstEntryFlag = true;
    console.log('%c' + ECO_PREFIX + 'ECO_callerPhase: ' + ECO_callerPhase, 'color: ' + ECO_CONSOLE_COLOR);
}

/******************************************************************/
// Set callback to send message to server via websocket
/******************************************************************/

function ECO_setCallBackToSendMessage(ptr_wsSendMessage)  // VER277
{
    ECO_PTR_wsSendMessage = ptr_wsSendMessage;
}

/******************************************************************/
function ECO_unsetAllCallBacks()
{
    ECO_PTR_disable_GUI_UpDownBottons               = null;
    ECO_PTR_enable_GUI_UpDownButtons                = null;
    ECO_PTR_disable_GUI_writeValuesButton           = null;
    ECO_PTR_enable_GUI_writeValuesButton            = null;
    ECO_PTR_fillGUIWithRXConfigurationValues        = null;
    ECO_PTR_fillGUIWithLoadStatusValues             = null;
    ECO_PTR_fillGUIWithOperationsStatus             = null;
    ECO_PTR_changeLoadBlockUnblockStatus            = null;
    ECO_PTR_fillGUIWithRXPowerSettingsValues        = null;
    ECO_PTR_fillGUIWithLoadsPowerValues             = null;
    ECO_PTR_ecoTypeWiredUABCIdentified              = null;
    ECO_PTR_fillGUIwithPlantPowerValues             = null;
    ECO_PTR_fillGUIWithSelfConsLoadsPowerValues     = null;
    ECO_PTR_fillGUIWithSelfConsLoadStatusValues     = null;
    ECO_PTR_changeSelfConsLoadBlockUnblockStatus    = null;
}

/******************************************************************/
function ECO_cleanFirstValues()
{
    ECO_firstRXAddrValues                   = [];
    ECO_firstRXPowerValues                  = [];
    ECO_firstRXFlags                        = [];
    ECO_firstRXNominalPowerValues           = [];
    ECO_selfConsFirstRXAddrValues           = [];
    ECO_selfConsFirstRXPowerValues          = [];
    ECO_selfConsFirstRXFlags                = [];
    ECO_selfConsFirstRXNominalPowerValues   = [];
}

/******************************************************************/
// Set Data of device 
/******************************************************************/
function ECO_setDevice(avebusAddress, avebusType, UID, UABC)
{
    ECO_currentAvebusAddress = avebusAddress;
    ECO_currentAvebusType    = avebusType;     // Must be a single character
    ECO_currentUID           = UID;
    ECO_currentUABC          = UABC;
}

/******************************************************************/
// Create and send change priority message to Economizer
/******************************************************************/
function ECO_changeLoadsPriority()
{
    var changePriorityBuffer = [];
    // Create change priority buffer
    console.log('%c' + ECO_PREFIX + changePriorityBuffer.toString(), 'color: ' + ECO_CONSOLE_COLOR);
}

/******************************************************************/
// Send message and start timeout for response
/******************************************************************/
function ECO_sendMessage(subType)
{   
    ECO_WaitedMessageName = '';

    var prgValues   = '';
    var sendMessage = '';
    
    if (subType == ECO_adrDataRequest) {
        // Reset buffer 
        ECO_addrValues.length         = 0;
        ECO_typeValues.length         = 0;
        ECO_nominalPowerValues.length = 0;
        ECO_AddrDataRequestInProgress = true; // Flag
        sendMessage           = 'ECO LOADS ADDRESSES DATA REQUEST...';
        ECO_WaitedMessageName = 'ECO LOADS ADDRESSES DATA RESPONSE';
    }
    else if (subType == ECO_nominalPowerDataRequest) {
        ECO_NominalPowerDataRequestInProgress = true; // Flag
        sendMessage           = 'ECO LOADS POWERS DATA REQUEST...';
        ECO_WaitedMessageName = 'ECO LOADS POWERS DATA RESPONSE';
    }
    else if (subType == ECO_loadPriority) {
        ECO_cleanFirstValues();
        prgValues = ECO_addrValues.join('') + ECO_getBlockUnblockLoadStatusPayload(false); // VER288 WANDA
        if ((ECO_callerType === ECO_callerTypeEnum.WEBSERVER) && (ECO_callerPhase === ECO_callerPhaseEnum.THREE_PHASE))
            prgValues += '0000'; 
        ECO_loadPriorityChangeInProgress = true;
        sendMessage           = 'ECO LOADS PRIORITIES CHANGE...';
        ECO_WaitedMessageName = 'ECO LOADS PRIORITIES ACKNOWLEDGE';
    }
    else if (subType == ECO_configurationDataRequest) {
        ECO_ConfigDataRequestInProgress = true;
        sendMessage           = 'ECO CONFIGURATION DATA REQUEST...';
        ECO_WaitedMessageName = 'ECO CONFIGURATION DATA RESPONSE';
    }
    else if (subType == ECO_selfConsLoadsDataRequest) {
        // Reset buffer 
        ECO_selfConsAddrValues.length = 0;
        ECO_selfConsTypeValues.length = 0;
        ECO_selfConsNominalPowerValues.length = 0;
        ECO_SelfConsAddrDataRequestInProgress = true; // Flag
        sendMessage           = 'ECO SELF-CONS LOADS DATA REQUEST...';
        ECO_WaitedMessageName = 'ECO SELF-CONS LOADS DATA RESPONSE';
    }
    else if (subType == ECO_selfConsLoadPriority) {
        ECO_cleanFirstValues();
        prgValues = ECO_selfConsAddrValues.join('') + ECO_getBlockUnblockLoadStatusPayload(true);
        ECO_selfConsLoadPriorityChangeInProgress = true;
        sendMessage           = 'ECO SELF-CONS LOADS PRIORITIES CHANGE...';
        ECO_WaitedMessageName = 'ECO SELF-CONS LOADS PRIORITIES ACKNOWLEDGE';
    } else {
        return;
    }
    var avebusMsg = ECO_prepareAvebusMessage(subType, ECO_currentAvebusAddress, ECO_currentAvebusType, ECO_currentUID, ECO_currentUABC, prgValues);
    var dominaMsg = ECO_prepareDominaPlusMessage(avebusMsg);
    if (typeof ECO_PTR_wsSendMessage !== 'undefined' && ECO_PTR_wsSendMessage !== null)
    {
        if (ECO_PTR_wsSendMessage(dominaMsg) === true) // sending OK
        {
            console.log('%c' + ECO_PREFIX + 'Sending ' + sendMessage + dominaMsg, 'color: ' + ECO_CONSOLE_COLOR);
            // Disable GUI objects 
            if (ECO_PTR_disable_GUI_UpDownBottons !== null) {
                ECO_PTR_disable_GUI_UpDownBottons();
            }
            if (ECO_PTR_disable_GUI_writeValuesButton !== null) {
                ECO_PTR_disable_GUI_writeValuesButton();
            }
            // Set 5 sec timeout on waited response
            ECO_responseTimeOutStatus = setTimeout(ECO_responseTimeOut, 5000, ECO_WaitedMessageName);
        }
    }
}

/******************************************************************/
// Set Timeout off 5 sec on waited response 
/******************************************************************/
function ECO_responseTimeOut(ECO_WaitedMessageName)
{
    console.log('%c' + ECO_PREFIX + 'TIMEOUT on ' + ECO_WaitedMessageName + ' message!', 'color: ' + ECO_CONSOLE_COLOR);
    clearTimeout(ECO_responseTimeOutStatus); // Clear time out ricezione
    ECO_AddrDataRequestInProgress               = false;
    ECO_SelfConsAddrDataRequestInProgress       = false;
    ECO_NominalPowerDataRequestInProgress       = false;
    ECO_loadPriorityChangeInProgress            = false;
    ECO_ConfigDataRequestInProgress             = false;
    ECO_selfConsLoadPriorityChangeInProgress    = false;
    // Enable GUI objects on timeOut
    if (ECO_PTR_enable_GUI_UpDownButtons !== null) {
        ECO_PTR_enable_GUI_UpDownButtons();
    }
    if (ECO_WaitedMessageName == 'ECO LOADS PRIORITIES ACKNOWLEDGE') {
        // GUI refresh operations status: time out error on priority programming
        if (ECO_PTR_fillGUIWithOperationsStatus !== null) {
            ECO_PTR_fillGUIWithOperationsStatus(ECO_operationsStusEnum.PRG_RESULT_TIME_OUT);
            if (ECO_PTR_fillGUIWithOperationsStatus !== null) {
                setTimeout(ECO_PTR_fillGUIWithOperationsStatus, 3000, ECO_operationsStusEnum.NOTHING_TO_DO);
            }
        }
        // If programming fail enable save button for retry
        if (ECO_PTR_enable_GUI_writeValuesButton !== null) {
            ECO_PTR_enable_GUI_writeValuesButton();
        }
    }
}

/******************************************************************/    
// Prepare Avebus Message
/******************************************************************/
function ECO_prepareAvebusMessage(subType, dstAddr, dstType, uid, uabc, prgValues)
{           
    // Inner avebus message
    var avebusHeader  = '';
    var avebusPayload = '';
    var strSubType    = '4C52'; // 'LR'

    switch(subType) {
        case ECO_adrDataRequest:
            strSubType    = '4C52'; // 'LR'
            avebusHeader  = '780C' + dstAddr + ECO_ProgramToolsAvebusAddress + dstType + '0';
            avebusPayload = strSubType + uid + uabc; 
            break;
        
        case ECO_nominalPowerDataRequest:
            strSubType    = '5052'; // 'PR'
            avebusHeader  = '780C' + dstAddr + ECO_ProgramToolsAvebusAddress + dstType + '0';
            avebusPayload = strSubType + uid + uabc; 
            break;
        
        case ECO_loadPriority:
            strSubType    = '5943'; // 'YC'
            if ((ECO_callerType === ECO_callerTypeEnum.IOT) || ((ECO_callerType === ECO_callerTypeEnum.WEBSERVER) && 
                ((ECO_callerPhase === ECO_callerPhaseEnum.SINGLE_PHASE) || (ECO_callerPhase === ECO_callerPhaseEnum.SINGLE_PHASE_IOT))))
                avebusHeader  = '781A' + dstAddr + ECO_ProgramToolsAvebusAddress + dstType + '0';
            else if ((ECO_callerType === ECO_callerTypeEnum.WEBSERVER) && (ECO_callerPhase === ECO_callerPhaseEnum.THREE_PHASE))
                avebusHeader  = '781F' + dstAddr + ECO_ProgramToolsAvebusAddress + dstType + '0';
            avebusPayload = strSubType + uid + uabc + prgValues; 
            break;
            
        case ECO_configurationDataRequest:
            strSubType    = '4552'; // 'ER'
            avebusHeader  = '780C' + dstAddr + ECO_ProgramToolsAvebusAddress + dstType + '0'; // MOD WILLIAM
            avebusPayload = strSubType + uid + uabc + prgValues; 
            break;

        case ECO_selfConsLoadsDataRequest:
            strSubType    = '4152'; // 'AR'
            avebusHeader  = '780C' + dstAddr + ECO_ProgramToolsAvebusAddress + dstType + '0';
            avebusPayload = strSubType + uid + uabc; 
            break;

        case ECO_selfConsLoadPriority:
            strSubType    = '5950'; // 'YP'
            avebusHeader  = '7813' + dstAddr + ECO_ProgramToolsAvebusAddress + dstType + '0';
            avebusPayload = strSubType + uid + uabc + prgValues; 
            break;
    }
    
    var avebusCRC = ECO_buildCRCAveBus(avebusHeader + avebusPayload);
    var msg       = avebusHeader + avebusPayload + avebusCRC;
    return msg;
}

/******************************************************************/
// Prepare DominaPlus Message
/******************************************************************/
function ECO_prepareDominaPlusMessage(msg)
{
    // First part of string
    var str = String.fromCharCode(0x02) + 'ABM' + String.fromCharCode(0x1d) + msg + String.fromCharCode(0x03);
    // crc and eot
    var dominaplusCRC = ECO_buildCRCDominaPlus(str);            
    str += dominaplusCRC + String.fromCharCode(0x04);
    return str;
}

/******************************************************************/
// Detect if message received is a Private Mail Message for Economizer
/******************************************************************/
function ECO_isAPrivateMailMessageForIotEconomizer(str)
{
    return (str.substr(0, 2) == '78' && ((str.substr(10, 4) == '4C44') ||       // 'LD'
                                         (str.substr(10, 4) == '5044') ||       // 'PD'
                                         (str.substr(10, 4) == '4543') ||       // 'EC'
                                         (str.substr(10, 4) == '4550') ||       // 'EP'
                                         (str.substr(10, 4) == '5941') ||       // 'YA'
                                         (str.substr(10, 4) == '454C') ||       // 'EL'
                                         (str.substr(10, 4) == '4551') ||       // 'EQ'
                                         (str.substr(10, 4) == '4541') ||       // 'EA'
                                         (str.substr(10, 4) == '4144') ||       // 'AD'
                                         (str.substr(10, 4) == '594E')          // 'YN'    
                                        ));
}

/******************************************************************/
// Parse RX Message
/******************************************************************/
function ECO_parseRXMessage(str)
{           
    var loadsNum = ECO_SINGLE_PHASE_LOADS_NUM;
    var receivedUABC = str.substr(18, 4);
    var receivedUID  = str.substr(14, 4);
    var ifCondition  = ((str.substr(6, 2) == ECO_currentAvebusAddress) && (receivedUABC == '0033') && (receivedUID == ECO_currentUID));

    if (ECO_callerType === ECO_callerTypeEnum.WEBSERVER) {
        ifCondition = ((str.substr(6, 2).toLowerCase() == ECO_currentAvebusAddress.toLowerCase()) && (receivedUABC.toLowerCase() == ECO_currentUABC.toLowerCase()));
        if ((receivedUABC != ECO_currentUABC) && ((receivedUABC == '0040') || (receivedUABC == '0041'))) { // Default UABC is 0x0033, check potential overwrite
            ECO_currentUABC = receivedUABC;
            console.log('%c' + ECO_PREFIX + 'ECO_MODULE detects wired economizer. UABC: ' + ECO_currentUABC, 'color: ' + ECO_CONSOLE_COLOR);
            if (ECO_PTR_ecoTypeWiredUABCIdentified != null) {
                ECO_PTR_ecoTypeWiredUABCIdentified();
            }
            // SINGLE PHASE
            if (ECO_currentUABC == '0040') {
                console.log('%c' + ECO_PREFIX + 'Single-phase load control', 'color: ' + ECO_CONSOLE_COLOR);    
                ECO_callerPhase = ECO_callerPhaseEnum.SINGLE_PHASE;     
            }
            // THREE PHASE
            else if (ECO_currentUABC == '0041') {
                console.log('%c' + ECO_PREFIX + 'Three-phase load control', 'color: ' + ECO_CONSOLE_COLOR);
                ECO_callerPhase = ECO_callerPhaseEnum.THREE_PHASE;
            }
        }
        else if (receivedUABC == '0033')
        {
            // Economizzatore IoT collegato ad un webserver
            ECO_callerPhase = ECO_callerPhaseEnum.SINGLE_PHASE_IOT;
        }
    } else if (ECO_callerType === ECO_callerTypeEnum.IOT) { // VER288 WANDA
        ECO_callerPhase = ECO_callerPhaseEnum.SINGLE_PHASE;
    }

    if (ifCondition) { // Message from target device
        if (str.substr(0, 2) == '78') // PRIVATE MAIL
        { 
            if ((ECO_callerType === ECO_callerTypeEnum.IOT) ||
                ((ECO_callerType === ECO_callerTypeEnum.WEBSERVER) && 
                ((ECO_callerPhase === ECO_callerPhaseEnum.SINGLE_PHASE) || (ECO_callerPhase === ECO_callerPhaseEnum.SINGLE_PHASE_IOT))))
                loadsNum = ECO_SINGLE_PHASE_LOADS_NUM;
            else if ((ECO_callerType === ECO_callerTypeEnum.WEBSERVER) && (ECO_callerPhase === ECO_callerPhaseEnum.THREE_PHASE))
                loadsNum = ECO_THREE_PHASE_LOADS_NUM;

            // 'ECO Loads Addresses Data Response' Frame
            if ((str.substr(10, 4) == '4C44') && (ECO_AddrDataRequestInProgress == true)) { 
                console.log('%c' + ECO_PREFIX + 'RX ECO LOADS ADDRESSES DATA RESPONSE: ' + str, 'color: ' + ECO_CONSOLE_COLOR);
                ECO_AddrDataRequestInProgress = false;
                clearTimeout(ECO_responseTimeOutStatus); // Clear time out ricezione
                if ((ECO_callerType === ECO_callerTypeEnum.IOT) || 
                    ((ECO_callerType === ECO_callerTypeEnum.WEBSERVER) && 
                    ((ECO_callerPhase === ECO_callerPhaseEnum.SINGLE_PHASE) || (ECO_callerPhase === ECO_callerPhaseEnum.SINGLE_PHASE_IOT))))
                {
                    // IOT e FILARE MONOFASE
                    // Get ECO_addrValues from frame
                    for (var j = 0; j < ECO_SINGLE_PHASE_LOADS_NUM; j++) {
                        ECO_addrValues[j] = str.substr(22 + (j * 2), 2).toString(16);
                    }
                    if (ECO_firstRXAddrValues.length == 0) {
                        for (var j = 0; j < ECO_SINGLE_PHASE_LOADS_NUM; j++) {
                            ECO_firstRXAddrValues[j] = str.substr(22 + (j * 2), 2).toString(16);
                        }
                    }
                    if (ECO_adrDataResponseMessageFirstEntryFlag == true) {
                        ECO_adrDataResponseMessageFirstEntryFlag = false;
                        // Copy values at first entry in a copy Array 
                        ECO_addrValuesAtFirstEntry = [].concat(ECO_addrValues); 
                    }
                    // Get ECO_AssociatedIndexes
                    for (var j = 0; j < ECO_SINGLE_PHASE_LOADS_NUM; j++) {
                        var associatedIndexesDescription = ECO_getAssociatedIndexesDescription(j, loadsNum, false); // VER288 WANDA
                        ECO_AssociatedIndexes[j] = JSON.parse(associatedIndexesDescription);
                    }
                    // Get ECO_typeValues from frame for first 8 devices
                    for (var j = 0; j < 8; j++) {       
                        if ((ECO_hexStringToInt(str.substr(46, 2)) & (1 << (7 - j))) == 0) {
                            ECO_typeValues[j] = 0; // IoT type
                        } else if ((ECO_hexStringToInt(str.substr(46, 2)) & (1 << (7 - j))) > 0) {
                            ECO_typeValues[j] = 1; // Avebus Filare Type
                        }
                    }
                    // Get ECO_typeValues from frame for devices from 9 to 12
                    for (var j = 0; j < 4; j++) {
                        if ((ECO_hexStringToInt(str.substr(48, 2)) & (1 << (7 - j))) == 0) {
                            ECO_typeValues[8 + j] = 0; // IoT type
                        } else if ((ECO_hexStringToInt(str.substr(48, 2)) & (1 << (7 - j))) > 0) {
                            ECO_typeValues[8 + j] = 1; // Avebus Filare Type
                        }
                    }
                }
                else if ((ECO_callerType === ECO_callerTypeEnum.WEBSERVER) && (ECO_callerPhase === ECO_callerPhaseEnum.THREE_PHASE))
                {
                    // FILARE TRIFASE
                    // Get ECO_addrValues from frame
                    for (var j = 0; j < ECO_THREE_PHASE_LOADS_NUM; j++) {
                        ECO_addrValues[j] = str.substr(22 + (j * 2), 2).toString(16);
                    }
                    if (ECO_firstRXAddrValues.length == 0) {
                        for (var j = 0; j < ECO_THREE_PHASE_LOADS_NUM; j++) {
                            ECO_firstRXAddrValues[j] = str.substr(22 + (j * 2), 2).toString(16);
                        }
                    }
                    if (ECO_adrDataResponseMessageFirstEntryFlag == true) {
                        ECO_adrDataResponseMessageFirstEntryFlag = false;
                        // Copy values at first entry in a copy Array 
                        ECO_addrValuesAtFirstEntry = [].concat(ECO_addrValues); 
                    }
                    // Get ECO_AssociatedIndexes
                    for (var j = 0; j < ECO_THREE_PHASE_LOADS_NUM; j++) {
                        var associatedIndexesDescription = ECO_getAssociatedIndexesDescription(j, loadsNum, false); // VER288 WANDA
                        ECO_AssociatedIndexes[j] = JSON.parse(associatedIndexesDescription);
                    }
                    // Get ECO_typeValues from frame for first 4 devices
                    // Configurazione delle fasi
                    for (var j = 0; j < 4; j++) {
                        ECO_typeValues[j] = (ECO_hexStringToInt(str.substr(52,2)) >> (6 - (j * 2))) & 0x03;
                        //console.log('ooo = ' + parseInt(str.substr(52, 2).toString(16), 16));
                        //ECO_typeValues[j] = parseInt(str.substr(52, 2).toString(16), 16) >> (6 - (j * 2)) & 0x03;
                    }
                    // Get ECO_typeValues from frame for devices from 5 to 8
                    for (var j = 0; j < 4; j++) {
                        ECO_typeValues[j + 4] = (ECO_hexStringToInt(str.substr(54, 2)) >> (6 - (j * 2))) & 0x03;
                    }
                    // Get ECO_typeValues from frame for devices from 9 to 12
                    for (var j = 0; j < 4; j++) {
                        ECO_typeValues[j + 8] = (ECO_hexStringToInt(str.substr(56, 2)) >> (6 - (j * 2))) & 0x03;
                    }
                    // Get ECO_typeValues from frame for devices from 13 to 15
                    for (var j = 0; j < 3; j++) {
                        ECO_typeValues[j + 12] = (ECO_hexStringToInt(str.substr(58, 2)) >> (6 - (j * 2))) & 0x03;
                    }
                }
                // Copy type values at first entry in a copy Array 
                ECO_typeValuesAtFirstEntry = [].concat(ECO_typeValues);
                // Request devices nominal power data
                ECO_sendMessage(ECO_nominalPowerDataRequest);
            }

            // 'ECO Loads Powers Data Response' Frame
            else if ((str.substr(10, 4) == '5044') && (ECO_NominalPowerDataRequestInProgress == true)) {
                console.log('%c' + ECO_PREFIX + 'RX ECO LOADS POWERS DATA RESPONSE: ' + str, 'color: ' + ECO_CONSOLE_COLOR);
                ECO_NominalPowerDataRequestInProgress = false;
                clearTimeout(ECO_responseTimeOutStatus); // Clear time out ricezione
                // IOT e FILARE MONOFASE
                // Get ECO_nominalPowerValues from frame
                for (var j = 0; j < loadsNum; j++) {
                    ECO_nominalPowerValues[j] = parseInt(str.substr(22 + (j * 2), 2).toString(16), 16);
                }
                if (ECO_firstRXNominalPowerValues.length === 0) {
                    for (var j = 0; j < loadsNum; j++) {
                        ECO_firstRXNominalPowerValues[j] = parseInt(str.substr(22 + (j * 2), 2).toString(16), 16);
                    }
                }
                // GUI refresh value
                if (ECO_PTR_fillGUIWithRXConfigurationValues !== null) {
                    ECO_PTR_fillGUIWithRXConfigurationValues(ECO_addrValues, ECO_typeValues, ECO_nominalPowerValues);
                }
                // Request configuration data
                ECO_sendMessage(ECO_configurationDataRequest);
            }

            // 'ECO Configuration Data Response' Frame
            else if ((str.substr(10,4) == '4543') && (ECO_ConfigDataRequestInProgress == true)) {
                console.log('%c' + ECO_PREFIX + 'RX ECO CONFIGURATION DATA RESPONSE: ' + str, 'color: ' + ECO_CONSOLE_COLOR);
                ECO_ConfigDataRequestInProgress = false;
                clearTimeout(ECO_responseTimeOutStatus); // Clear time out ricezione
                // Enable GUI Up-Down buttons
                if (ECO_PTR_enable_GUI_UpDownButtons !== null) {
                    ECO_PTR_enable_GUI_UpDownButtons();
                }
                if ((ECO_callerType === ECO_callerTypeEnum.IOT) || 
                    ((ECO_callerType === ECO_callerTypeEnum.WEBSERVER) && 
                    ((ECO_callerPhase === ECO_callerPhaseEnum.SINGLE_PHASE) || (ECO_callerPhase === ECO_callerPhaseEnum.SINGLE_PHASE_IOT))))
                {
                    // IOT e FILARE MONOFASE
                    ECO_plantDetachedThreshold    = [];
                    ECO_plantDetachedThreshold[0] = parseInt(str.substr(22, 4).toString(16), 16);       //Soglia di distacco (potenza impianto rete)
    
                }
                else if ((ECO_callerType === ECO_callerTypeEnum.WEBSERVER) && (ECO_callerPhase === ECO_callerPhaseEnum.THREE_PHASE))
                {
                    // FILARE TRIFASE
                    ECO_plantDetachedThreshold    = [];
                    ECO_plantDetachedThreshold[0] = parseInt(str.substr(22, 4).toString(16), 16) * 10;  //Soglia di distacco (potenza impianto rete)
                    ECO_plantDetachedThreshold[1] = parseInt(str.substr(26, 4).toString(16), 16) * 10;  //Soglia di protezione L1
                    ECO_plantDetachedThreshold[2] = parseInt(str.substr(30, 4).toString(16), 16) * 10;  //Soglia di protezione L2
                    ECO_plantDetachedThreshold[3] = parseInt(str.substr(34, 4).toString(16), 16) * 10;  //Soglia di protezione L3
                }
                // GUI refresh value
                if (ECO_PTR_fillGUIWithRXPowerSettingsValues !== null) {
                    ECO_PTR_fillGUIWithRXPowerSettingsValues(ECO_plantDetachedThreshold);
                }
            }

            // 'ECO Power Measurement' Frame (ricevuto ogni 5 secondi) 
            else if (str.substr(10, 4) == '4550') {
                console.log('%c' + ECO_PREFIX + 'RX ECO POWER MEASUREMENT: ' + str, 'color: ' + ECO_CONSOLE_COLOR);
                if ((ECO_callerType === ECO_callerTypeEnum.IOT) || 
                    ((ECO_callerType === ECO_callerTypeEnum.WEBSERVER) && 
                    ((ECO_callerPhase === ECO_callerPhaseEnum.SINGLE_PHASE) || (ECO_callerPhase === ECO_callerPhaseEnum.SINGLE_PHASE_IOT))))
                {
                    // IOT e FILARE MONOFASE
                    ECO_powerDrawnMeasurements[0]    = parseInt(str.substr(22, 4).toString(16), 16);
                    ECO_powerInjectedMeasurements[0] = parseInt(str.substr(26, 4).toString(16), 16);
                    ECO_powerProducedMeasurements[0] = parseInt(str.substr(30, 4).toString(16), 16);
                    ECO_powerUsedMeasurements[0]     = parseInt(str.substr(34, 4).toString(16), 16);
                    console.log('%c' + ECO_PREFIX + 'POWER DRAWN FROM GRID: ' + ECO_powerDrawnMeasurements[0] + 'W ', 'color: ' + ECO_CONSOLE_COLOR);
                    console.log('%c' + ECO_PREFIX + 'POWER INJECTED TO GRID: ' + ECO_powerInjectedMeasurements[0] + 'W ', 'color: ' + ECO_CONSOLE_COLOR);
                    console.log('%c' + ECO_PREFIX + 'POWER PRODUCED: ' + ECO_powerProducedMeasurements[0] + 'W ', 'color: ' + ECO_CONSOLE_COLOR);
                    console.log('%c' + ECO_PREFIX + 'POWER USED BY PLANT: ' + ECO_powerUsedMeasurements[0] + 'W ', 'color: ' + ECO_CONSOLE_COLOR);

                    // Get status values from frame
                    for (var j = 0; j < ECO_SINGLE_PHASE_LOADS_NUM; j = j + 2) {
                        ECO_loadStatusValues[j]     = (parseInt(str.substr(38 + j, 2).toString(16), 16) & 0xF0) >> 4;
                        ECO_loadStatusValues[j + 1] =  parseInt(str.substr(38 + j, 2).toString(16), 16) & 0x0F;
                    }
                    for (var j = 0; j < ECO_SINGLE_PHASE_LOADS_NUM; j++)
                    {
                        console.log('%c' + ECO_PREFIX + 'LOAD ' + j + ' STATUS : '+ ECO_loadStatusValues[j], 'color: ' + ECO_CONSOLE_COLOR);
                    }

                    // Derive forced load array from status array (only at first status values message received)
                    if (ECO_nominalPowerDataResponseFirstEntryFlag == true) {   
                        ECO_nominalPowerDataResponseFirstEntryFlag = false;
                        for (var j = 0; j < ECO_SINGLE_PHASE_LOADS_NUM; j++) {
                            if ((ECO_loadStatusValues[j] & 0x07) == 6)   { // WANDA & WILLIAM
                                ECO_blockUnblockLoadArrayAtFirstEntry[j] = 1 // Blocked
                                if (ECO_PTR_changeLoadBlockUnblockStatus !== null) {
                                    ECO_PTR_changeLoadBlockUnblockStatus(j, ECO_blockedUnblockedStusEnum.BLOCKED_LOAD);
                                }
                            } else {
                                ECO_blockUnblockLoadArrayAtFirstEntry[j] = 0 // Not blocked. Other status...
                                if (ECO_PTR_changeLoadBlockUnblockStatus !== null) {
                                    ECO_PTR_changeLoadBlockUnblockStatus(j, ECO_blockedUnblockedStusEnum.UNBLOCKED_LOAD);
                                }
                            }
                        }
                        ECO_managedBlockUnblockLoadArray = [].concat(ECO_blockUnblockLoadArrayAtFirstEntry);
                    }

                    // Sorting RX status values array if there is an index change in progress
                    ECO_sortedLoadLogicalStatusValuesArray = ECO_sortLoadStatusValues(ECO_SINGLE_PHASE_LOADS_NUM, false); // VER288 WANDA
                    
                    if ((ECO_callerType === ECO_callerTypeEnum.WEBSERVER) && (ECO_callerPhase === ECO_callerPhaseEnum.SINGLE_PHASE))
                    {
                        // FILARE MONOFASE
                        // Stato carichi per autoconsumo
                        for (var j = 0; j < ECO_SELFCONS_LOADS_NUM; j = j + 2) {
                            ECO_selfConsLoadsStatusValues[j]     = (parseInt(str.substr(50 + j, 2).toString(16), 16) & 0xF0) >> 4;
                            ECO_selfConsLoadsStatusValues[j + 1] =  parseInt(str.substr(50 + j, 2).toString(16), 16) & 0x0F;
                        }
                        for (var j = 0; j < ECO_SELFCONS_LOADS_NUM; j++)
                        {
                            console.log('%c' + ECO_PREFIX + 'SELF-CONS LOAD ' + j + ' STATUS : '+ ECO_selfConsLoadsStatusValues[j], 'color: ' + ECO_CONSOLE_COLOR);
                        }

                        // Derive forced load array from status array (only at first status values message received)
                        if (ECO_selfConsNominalPowerDataResponseFirstEntryFlag == true) {   
                            ECO_selfConsNominalPowerDataResponseFirstEntryFlag = false;
                            for (var j = 0; j < ECO_SELFCONS_LOADS_NUM; j++) {
                                if ((ECO_selfConsLoadsStatusValues[j] & 0x07) == 6) { 
                                    ECO_selfConsBlockUnblockLoadArrayAtFirstEntry[j] = 1 // Blocked
                                    if (ECO_PTR_changeSelfConsLoadBlockUnblockStatus !== null) {
                                        ECO_PTR_changeSelfConsLoadBlockUnblockStatus(j, ECO_blockedUnblockedStusEnum.BLOCKED_LOAD);
                                    }
                                } else {
                                    ECO_selfConsBlockUnblockLoadArrayAtFirstEntry[j] = 0 // Not blocked. Other status...
                                    if (ECO_PTR_changeSelfConsLoadBlockUnblockStatus !== null) {
                                        ECO_PTR_changeSelfConsLoadBlockUnblockStatus(j, ECO_blockedUnblockedStusEnum.UNBLOCKED_LOAD);
                                    }
                                }
                            }
                            ECO_selfConsManagedBlockUnblockLoadArray = [].concat(ECO_selfConsBlockUnblockLoadArrayAtFirstEntry);
                        }
                        // Sorting RX status values array if there is an index change in progress
                        ECO_selfConsSortedLoadLogicalStatusValuesArray = ECO_sortLoadStatusValues(ECO_SELFCONS_LOADS_NUM, true);

                        // Info sinottico
                        var info = parseInt(str.substr(56, 2).toString(16), 16);
                        ECO_synopticInfoArray[0] = (info >> 7) & 0x01;      // Synoptic Info Enable
                        ECO_synopticInfoArray[1] = info & 0x01;             // Autoconsumo attivo
                        ECO_synopticInfoArray[2] = (info >> 1) & 0x01;      // Posizione TA
                        ECO_synopticInfoArray[3] = (info >> 2) & 0x01;      // Controllo bloccato
                        ECO_synopticInfoArray[4] = (info >> 3) & 0x01;      // Anomalia produzione
                        ECO_synopticInfoArray[5] = (info >> 4) & 0x03;      // Configurazione produzione                        
                    }
                    else if ((ECO_callerType === ECO_callerTypeEnum.WEBSERVER) && (ECO_callerPhase === ECO_callerPhaseEnum.SINGLE_PHASE_IOT))
                    {
                        // IoT con SUPERVISORE
                        // Info sinottico
                        var info = parseInt(str.substr(52, 2).toString(16), 16);
                        ECO_synopticInfoArray[0] = 1;                       // Synoptic Info Enable
                        ECO_synopticInfoArray[1] = (info >> 2) & 0x01;      // Autoconsumo attivo
                    }
                }
                else if ((ECO_callerType === ECO_callerTypeEnum.WEBSERVER) && (ECO_callerPhase === ECO_callerPhaseEnum.THREE_PHASE))
                {
                    // FILARE TRIFASE
                    ECO_powerDrawnMeasurements[1]    = (parseInt(str.substr(22, 4).toString(16), 16) >> 4) * 10;
                    ECO_powerDrawnMeasurements[2]    = (parseInt(str.substr(24, 4).toString(16), 16) & 0x0FFF) * 10;
                    ECO_powerDrawnMeasurements[3]    = (parseInt(str.substr(28, 4).toString(16), 16) >> 4) * 10;
                    ECO_powerInjectedMeasurements[1] = (parseInt(str.substr(30, 4).toString(16), 16) & 0x0FFF) * 10;
                    ECO_powerInjectedMeasurements[2] = (parseInt(str.substr(34, 4).toString(16), 16) >> 4) * 10;
                    ECO_powerInjectedMeasurements[3] = (parseInt(str.substr(36, 4).toString(16), 16) & 0x0FFF) * 10;
                    ECO_powerProducedMeasurements[1] = (parseInt(str.substr(40, 4).toString(16), 16) >> 4) * 10;
                    ECO_powerProducedMeasurements[2] = (parseInt(str.substr(42, 4).toString(16), 16) & 0x0FFF) * 10;
                    ECO_powerProducedMeasurements[3] = (parseInt(str.substr(46, 4).toString(16), 16) >> 4) * 10;
                    ECO_powerUsedMeasurements[1]     = (parseInt(str.substr(48, 4).toString(16), 16) & 0x0FFF) * 10;
                    ECO_powerUsedMeasurements[2]     = (parseInt(str.substr(52, 4).toString(16), 16) >> 4) * 10;
                    ECO_powerUsedMeasurements[3]     = (parseInt(str.substr(54, 4).toString(16), 16) & 0x0FFF) * 10;

                    ECO_powerDrawnMeasurements[0]    = ECO_powerDrawnMeasurements[1] + ECO_powerDrawnMeasurements[2] + ECO_powerDrawnMeasurements[3];
                    ECO_powerInjectedMeasurements[0] = ECO_powerInjectedMeasurements[1] + ECO_powerInjectedMeasurements[2] + ECO_powerInjectedMeasurements[3];
                    ECO_powerProducedMeasurements[0] = ECO_powerProducedMeasurements[1] + ECO_powerProducedMeasurements[2] + ECO_powerProducedMeasurements[3];
                    ECO_powerUsedMeasurements[0]     = ECO_powerUsedMeasurements[1] + ECO_powerUsedMeasurements[2] + ECO_powerUsedMeasurements[3];

                    console.log('%c' + ECO_PREFIX + 'POWER DRAWN FROM GRID: ' + ECO_powerDrawnMeasurements[0] + 'W - ' + 
                                'L1=' + ECO_powerDrawnMeasurements[1] + 'W ' +
                                'L2=' + ECO_powerDrawnMeasurements[2] + 'W ' +
                                'L3=' + ECO_powerDrawnMeasurements[3] + 'W ',
                                'color: ' + ECO_CONSOLE_COLOR);
                    console.log('%c' + ECO_PREFIX + 'POWER INJECTED TO GRID: ' + ECO_powerInjectedMeasurements[0] + 'W - ' +
                                'L1=' + ECO_powerInjectedMeasurements[1] + 'W ' +
                                'L2=' + ECO_powerInjectedMeasurements[2] + 'W ' +
                                'L3=' + ECO_powerInjectedMeasurements[3] + 'W ',
                                'color: ' + ECO_CONSOLE_COLOR);
                    console.log('%c' + ECO_PREFIX + 'POWER PRODUCED: ' + ECO_powerProducedMeasurements[0] + 'W - ' +
                                'L1=' + ECO_powerProducedMeasurements[1] + 'W ' +
                                'L2=' + ECO_powerProducedMeasurements[2] + 'W ' +
                                'L3=' + ECO_powerProducedMeasurements[3] + 'W ',
                                'color: ' + ECO_CONSOLE_COLOR);
                    console.log('%c' + ECO_PREFIX + 'POWER USED BY PLANT: ' + ECO_powerUsedMeasurements[0] + 'W - ' +
                                'L1=' + ECO_powerUsedMeasurements[1] + 'W ' +
                                'L2=' + ECO_powerUsedMeasurements[2] + 'W ' +
                                'L3=' + ECO_powerUsedMeasurements[3] + 'W ',
                                'color: ' + ECO_CONSOLE_COLOR);

                    // Info sinottico
                    var info = parseInt(str.substr(58, 2).toString(16), 16);
                    ECO_synopticInfoArray[0] = 1;                       // Synoptic Info Enable
                    ECO_synopticInfoArray[1] = info & 0x01;             // Autoconsumo attivo
                    ECO_synopticInfoArray[2] = (info >> 1) & 0x01;      // Posizione TA
                    ECO_synopticInfoArray[3] = (info >> 2) & 0x01;      // Controllo bloccato
                    ECO_synopticInfoArray[4] = (info >> 3) & 0x01;      // Anomalia produzione trifase
                    ECO_synopticInfoArray[5] = (info >> 4) & 0x01;      // Anomalia produzione L3
                    ECO_synopticInfoArray[6] = (info >> 5) & 0x01;      // Anomalia produzione L2
                    ECO_synopticInfoArray[7] = (info >> 6) & 0x01;      // Anomalia produzione L1
                    ECO_synopticInfoArray[8] = (info >> 7) & 0x01;      // Configurazione produzione
                }
                // GUI refresh value
                if (ECO_PTR_fillGUIwithPlantPowerValues !== null) {
                    ECO_PTR_fillGUIwithPlantPowerValues(ECO_powerDrawnMeasurements, 
                                                        ECO_powerInjectedMeasurements,
                                                        ECO_powerProducedMeasurements,
                                                        ECO_powerUsedMeasurements,
                                                        ECO_synopticInfoArray);
                }
                // VER291 WILLIAM
                if ((ECO_callerType === ECO_callerTypeEnum.WEBSERVER) && (ECO_callerPhase === ECO_callerPhaseEnum.THREE_PHASE))
                {
                    ;
                }
                else
                {
                    if (ECO_PTR_fillGUIWithLoadStatusValues !== null) {
                        ECO_PTR_fillGUIWithLoadStatusValues(ECO_sortedLoadLogicalStatusValuesArray);
                    }                            
                    if (ECO_PTR_fillGUIWithSelfConsLoadStatusValues !== null) {
                        ECO_PTR_fillGUIWithSelfConsLoadStatusValues(ECO_selfConsSortedLoadLogicalStatusValuesArray, ECO_selfConsLoadsTimerValues);
                    }
                } //
            }

            // 'ECO Loads Priorities Acknowledge' frame
            else if ((str.substr(10, 4) == '5941') && (ECO_loadPriorityChangeInProgress == true))
            {
                console.log('%c' + ECO_PREFIX + 'RX ECO LOADS PRIORITIES ACK: ' + str, 'color: ' + ECO_CONSOLE_COLOR);
                ECO_loadPriorityChangeInProgress = false;
                clearTimeout(ECO_responseTimeOutStatus); // Clear time out ricezione
                // Refresh ECO_addrValuesAtFirstEntry after saving 
                ECO_addrValuesAtFirstEntry = [].concat(ECO_addrValues);
                // Refresh ECO_loadStatusValues after saving 
                ECO_loadStatusValues = [].concat(ECO_sortedLoadLogicalStatusValuesArray);
                // Refresh ECO_typeValuesAtFirstEntry after saving 
                ECO_typeValuesAtFirstEntry = [].concat(ECO_typeValues);

                for (var i = 0; i < ECO_managedBlockUnblockLoadArray.length; i++) {
                    switch (ECO_managedBlockUnblockLoadArray[i]) {
                        case 0:
                        case 3:
                            ECO_blockUnblockLoadArrayAtFirstEntry[i] = 0;
                            ECO_managedBlockUnblockLoadArray[i]      = 0;
                            break;

                        case 1:
                        case 2:
                            ECO_blockUnblockLoadArrayAtFirstEntry[i] = 1;
                            ECO_managedBlockUnblockLoadArray[i]      = 1;
                            break;
                    }
                }
                // GUI refresh value with block/unblock status values after saving 
                for (var j = 0; j < loadsNum; j++) {
                    if (ECO_PTR_changeLoadBlockUnblockStatus !== null) {
                        ECO_PTR_changeLoadBlockUnblockStatus(j, ECO_blockUnblockLoadArrayAtFirstEntry[j]);
                    }
                }
                ECO_adrDataResponseMessageFirstEntryFlag = true; // Flag for first entry reset
                ECO_idxChangeInProgress                  = false;
                // Enable GUI Up-Down buttons
                if (ECO_PTR_enable_GUI_UpDownButtons !== null) {
                    ECO_PTR_enable_GUI_UpDownButtons();
                }
                // GUI refresh operations status 
                if (ECO_PTR_fillGUIWithOperationsStatus !== null) {
                    ECO_PTR_fillGUIWithOperationsStatus(ECO_operationsStusEnum.PRG_RESULT_OK);
                    if (ECO_PTR_fillGUIWithOperationsStatus !== null) {
                        setTimeout(ECO_PTR_fillGUIWithOperationsStatus, 3000, ECO_operationsStusEnum.NOTHING_TO_DO);
                    }
                }
            }

            // 'ECO Loads Power Measurements' frame (ricevuto ogni 5 secondi) 
            else if (str.substr(10, 4) == '454C')
            {
                console.log('%c' + ECO_PREFIX + 'RX ECO LOADS POWER MEASUREMENTS: ' + str, 'color: ' + ECO_CONSOLE_COLOR);
                for (var j = 0; j < loadsNum; j++) {
                    ECO_loadsPowerValuesArray[j] = parseInt(str.substr(22 + (j * 2), 2).toString(16), 16);
                    var flags = parseInt(str.substr((22 + (loadsNum*2)), 4).toString(16), 16);
                    ECO_loadsPowerFlagsArray[j] = (flags >> (16 - 1 - j)) & 0x01;
                    console.log('%c' + ECO_PREFIX + 'Load: ' + (j + 1) + ' - Power: ' + ECO_loadsPowerValuesArray[j] + ' - Flag: ' + ECO_loadsPowerFlagsArray[j], 'color: ' + ECO_CONSOLE_COLOR);
                    ECO_firstRXPowerValues[j] = ECO_loadsPowerValuesArray[j]; // Only with no interaction they are the same, field changes overwrite stable values
                }
                if (ECO_firstRXPowerValues.length == 0) {
                    for (var j = 0; j < loadsNum; j++) {
                        ECO_firstRXPowerValues[j] = ECO_loadsPowerValuesArray[j];
                    }
                }
                if (ECO_firstRXFlags.length == 0) {
                    for (var j = 0; j < loadsNum; j++) {
                        ECO_firstRXFlags[j] = ECO_loadsPowerFlagsArray[j];
                    }
                }
                // GUI refresh value
                if (ECO_PTR_fillGUIWithLoadsPowerValues !== null) {
                    ECO_PTR_fillGUIWithLoadsPowerValues(ECO_loadsPowerValuesArray, ECO_loadsPowerFlagsArray);
                }
            } 

            // 'ECO Three-Phase Power Measurements' frame (ricevuto ogni 5 secondi) 
            else if (str.substr(10, 4) == '4551')
            {
                console.log('%c' + ECO_PREFIX + 'RX THREE-PHASE ECO LOADS STATUS: ' + str, 'color: ' + ECO_CONSOLE_COLOR);
                // Get status values from frame
                for (var j = 0; j < ECO_THREE_PHASE_LOADS_NUM; j = j + 2) {
                    ECO_loadStatusValues[j]     = (parseInt(str.substr(22 + j, 2).toString(16), 16) & 0xF0) >> 4;
                    ECO_loadStatusValues[j + 1] =  parseInt(str.substr(22 + j, 2).toString(16), 16) & 0x0F;
                }
                // Derive forced load array from stutus array (only at first status values message received)
                if (ECO_nominalPowerDataResponseFirstEntryFlag == true) {   
                    ECO_nominalPowerDataResponseFirstEntryFlag = false;
                    for (var j = 0; j < ECO_THREE_PHASE_LOADS_NUM; j++) {
                        if ((ECO_loadStatusValues[j] & 0x07) == 6)   { // WANDA & WILLIAM
                            ECO_blockUnblockLoadArrayAtFirstEntry[j] = 1 // Blocked
                            if (ECO_PTR_changeLoadBlockUnblockStatus !== null) {
                                ECO_PTR_changeLoadBlockUnblockStatus(j, ECO_blockedUnblockedStusEnum.BLOCKED_LOAD);
                            }
                        } else {
                            ECO_blockUnblockLoadArrayAtFirstEntry[j] = 0 // Not blocked. Other status...
                            if (ECO_PTR_changeLoadBlockUnblockStatus !== null) {
                                ECO_PTR_changeLoadBlockUnblockStatus(j, ECO_blockedUnblockedStusEnum.UNBLOCKED_LOAD);
                            }
                        }
                    }
                    ECO_managedBlockUnblockLoadArray = [].concat(ECO_blockUnblockLoadArrayAtFirstEntry);
                }
                // Sorting RX status values array  if there is an index change in progress
                ECO_sortedLoadLogicalStatusValuesArray = ECO_sortLoadStatusValues(ECO_THREE_PHASE_LOADS_NUM, false); // VER288 WANDA
               
                // Stato carichi per autoconsumo
                for (var j = 0; j < ECO_SELFCONS_LOADS_NUM; j = j + 2) {
                    ECO_selfConsLoadsStatusValues[j]     = (parseInt(str.substr(38 + j, 2).toString(16), 16) & 0xF0) >> 4;
                    ECO_selfConsLoadsStatusValues[j + 1] =  parseInt(str.substr(38 + j, 2).toString(16), 16) & 0x0F;
                    console.log('%c' + ECO_PREFIX + 'Self-Load: ' + j + ' - Status: ' + ECO_selfConsLoadsStatusValues[j], 'color: ' + ECO_CONSOLE_COLOR);
                    console.log('%c' + ECO_PREFIX + 'Self-Load: ' + (j + 1) + ' - Status: ' + ECO_selfConsLoadsStatusValues[j+1], 'color: ' + ECO_CONSOLE_COLOR);
                }

                // Derive forced load array from status array (only at first status values message received)
                if (ECO_selfConsNominalPowerDataResponseFirstEntryFlag == true) {   
                    ECO_selfConsNominalPowerDataResponseFirstEntryFlag = false;
                    for (var j = 0; j < ECO_SELFCONS_LOADS_NUM; j++) {
                        if ((ECO_selfConsLoadsStatusValues[j] & 0x07) == 6) { 
                            ECO_selfConsBlockUnblockLoadArrayAtFirstEntry[j] = 1 // Blocked
                            if (ECO_PTR_changeSelfConsLoadBlockUnblockStatus !== null) {
                                ECO_PTR_changeSelfConsLoadBlockUnblockStatus(j, ECO_blockedUnblockedStusEnum.BLOCKED_LOAD);
                            }
                        } else {
                            ECO_selfConsBlockUnblockLoadArrayAtFirstEntry[j] = 0 // Not blocked. Other status...
                            if (ECO_PTR_changeSelfConsLoadBlockUnblockStatus !== null) {
                                ECO_PTR_changeSelfConsLoadBlockUnblockStatus(j, ECO_blockedUnblockedStusEnum.UNBLOCKED_LOAD);
                            }
                        }
                    }
                    ECO_selfConsManagedBlockUnblockLoadArray = [].concat(ECO_selfConsBlockUnblockLoadArrayAtFirstEntry);
                }
                // Sorting RX status values array if there is an index change in progress
                ECO_selfConsSortedLoadLogicalStatusValuesArray = ECO_sortLoadStatusValues(ECO_SELFCONS_LOADS_NUM, true);

                //INFO CARICHI
                var infoLoads = parseInt(str.substr(44, 2).toString(16), 16);
                console.log('%c' + ECO_PREFIX + 'INFO LOADS: ' + infoLoads, 'color: ' + ECO_CONSOLE_COLOR);
                ECO_protectionStatus = [];
                ECO_protectionStatus[0] = (infoLoads & 0x03);           // Stato protezione impianto trifase
                ECO_protectionStatus[1] = ((infoLoads >> 6) & 0x03)     // Stato protezione L1 
                ECO_protectionStatus[2] = ((infoLoads >> 4) & 0x03);    // Stato protezione L2
                ECO_protectionStatus[3] = ((infoLoads >> 2) & 0x03);    // Stato protezione L3
                console.log('%c' + ECO_PREFIX + 'PROTECTION Status:  3-Phase = ' + ECO_protectionStatus[0] +
                            ' | L1 = ' + ECO_protectionStatus[1] + ' | L2 = ' + ECO_protectionStatus[2] + ' | L3 = ' + ECO_protectionStatus[3], 
                            'color: ' + ECO_CONSOLE_COLOR);

                //VER292 WILLIAM
                //INFO CARICHI AUTOCONSUMO
                var infoLoadsAutoconsumption = parseInt(str.substr(46, 2).toString(16), 16);
                console.log('%c' + ECO_PREFIX + 'INFO AUTO LOADS: ' + infoLoadsAutoconsumption, 'color: ' + ECO_CONSOLE_COLOR);
                ECO_autoLoadsActivationStatus = []; 
                ECO_protectionStatus[4] = ((infoLoadsAutoconsumption >> 6) & 0x03)     // Stato attivazione carichi su L1 
                ECO_protectionStatus[5] = ((infoLoadsAutoconsumption >> 4) & 0x03);    // Stato attivazione carichi su L2
                ECO_protectionStatus[6] = ((infoLoadsAutoconsumption >> 2) & 0x03);    // Stato attivazione carichi su L3
                console.log('%c' + ECO_PREFIX + 'ACTIVATION Status: | L1 = ' + ECO_protectionStatus[4] +
                            ' | L2 = ' + ECO_protectionStatus[5] + ' | L3 = ' + ECO_protectionStatus[6], 
                            'color: ' + ECO_CONSOLE_COLOR);
                //

                // GUI refresh value
                if (ECO_PTR_fillGUIWithProtectionsStatus !== null) {
                    ECO_PTR_fillGUIWithProtectionsStatus(ECO_protectionStatus);
                }
                
                //VER291 WILLIAM
                if (ECO_PTR_fillGUIWithLoadStatusValues !== null) {
                    ECO_PTR_fillGUIWithLoadStatusValues(ECO_sortedLoadLogicalStatusValuesArray);
                }
                //
                if (ECO_PTR_fillGUIWithSelfConsLoadStatusValues !== null) {
                    ECO_PTR_fillGUIWithSelfConsLoadStatusValues(ECO_selfConsSortedLoadLogicalStatusValuesArray, ECO_selfConsLoadsTimerValues);
                }
            }

            // 'ECO Self-consumption Loads Power Measurements' frame (ricevuto ogni 5 secondi) 
            else if (str.substr(10, 4) == '4541')
            {
                console.log('%c' + ECO_PREFIX + 'RX ECO SELF-CONS LOADS POWER MEASUREMENTS: ' + str, 'color: ' + ECO_CONSOLE_COLOR);
                for (var j = 0; j < ECO_SELFCONS_LOADS_NUM; j++) {
                    ECO_selfConsLoadsPowerValuesArray[j] = parseInt(str.substr(22 + (j * 2), 2).toString(16), 16);
                    var flags = parseInt(str.substr(34, 4).toString(16), 16);
                    ECO_selfConsLoadsPowerFlagsArray[j] = (flags >> (16 - 1 - j)) & 0x01;
                    console.log('%c' + ECO_PREFIX + 'Load: ' + (j + 1) + ' - Power: ' + ECO_selfConsLoadsPowerValuesArray[j] + ' - Flag: ' + ECO_selfConsLoadsPowerFlagsArray[j], 'color: ' + ECO_CONSOLE_COLOR);
                    ECO_selfConsFirstRXPowerValues[j] = ECO_selfConsLoadsPowerValuesArray[j]; // Only with no interaction they are the same, field changes overwrite stable values
                }
                if (ECO_selfConsFirstRXPowerValues.length == 0) {
                    for (var j = 0; j < ECO_SELFCONS_LOADS_NUM; j++) {
                        ECO_selfConsFirstRXPowerValues[j] = ECO_selfConsLoadsPowerValuesArray[j];
                    }
                }
                if (ECO_selfConsFirstRXFlags.length == 0) {
                    for (var j = 0; j < ECO_SELFCONS_LOADS_NUM; j++) {
                        ECO_selfConsFirstRXFlags[j] = ECO_selfConsLoadsPowerFlagsArray[j];
                    }
                }
                // GUI refresh value
                if (ECO_PTR_fillGUIWithSelfConsLoadsPowerValues !== null) {
                    ECO_PTR_fillGUIWithSelfConsLoadsPowerValues(ECO_selfConsLoadsPowerValuesArray, ECO_selfConsLoadsPowerFlagsArray);
                }
            }

            // 'ECO Self-consumption Loads Data Response' Frame
            else if ((str.substr(10, 4) == '4144') && (ECO_SelfConsAddrDataRequestInProgress == true)) { 
                console.log('%c' + ECO_PREFIX + 'RX ECO SELF-CONS LOADS DATA RESPONSE: ' + str, 'color: ' + ECO_CONSOLE_COLOR);
                ECO_SelfConsAddrDataRequestInProgress = false;
                clearTimeout(ECO_responseTimeOutStatus); // Clear time out ricezione

                // Get ECO_selfConsAddrValues from frame
                for (var j = 0; j < ECO_SELFCONS_LOADS_NUM; j++) {
                    ECO_selfConsAddrValues[j] = str.substr(22 + (j * 2), 2).toString(16);
                }
                if (ECO_selfConsFirstRXAddrValues.length == 0) {
                    for (var j = 0; j < ECO_SELFCONS_LOADS_NUM; j++) {
                        ECO_selfConsFirstRXAddrValues[j] = str.substr(22 + (j * 2), 2).toString(16);
                    }
                }
                
                if (ECO_selfConsAdrDataResponseMessageFirstEntryFlag == true) {
                    ECO_selfConsAdrDataResponseMessageFirstEntryFlag = false;
                    // Copy values at first entry in a copy Array 
                    ECO_selfConsAddrValuesAtFirstEntry = [].concat(ECO_selfConsAddrValues); 
                }
                // Get ECO_AssociatedIndexes
                for (var j = 0; j < ECO_SELFCONS_LOADS_NUM; j++) {
                    var associatedIndexesDescription = ECO_getAssociatedIndexesDescription(j, loadsNum, true);
                    ECO_selfConsAssociatedIndexes[j] = JSON.parse(associatedIndexesDescription);
                }
                            
                // Get ECO_selfConsNominalPowerValues from frame
                for (var j = 0; j < ECO_SELFCONS_LOADS_NUM; j++) {
                    ECO_selfConsNominalPowerValues[j] = parseInt(str.substr(34 + (j * 2), 2).toString(16), 16);
                }
                if (ECO_selfConsFirstRXNominalPowerValues.length === 0) {
                    for (var j = 0; j < ECO_SELFCONS_LOADS_NUM; j++) {
                        ECO_selfConsFirstRXNominalPowerValues[j] = parseInt(str.substr(34 + (j * 2), 2).toString(16), 16);
                    }
                }
                
                //Timer
                var timers = (ECO_hexStringToInt(str.substr(46, 2).toString(16)) << 16) + 
                             (ECO_hexStringToInt(str.substr(48, 2).toString(16)) << 8) +
                             (ECO_hexStringToInt(str.substr(50, 2).toString(16)));
                for (var j = 0; j < ECO_SELFCONS_LOADS_NUM; j++) { 
                    ECO_selfConsLoadsTimerValues[j] = (timers >> 20 - (j * 4)) & 0x0F; 
                }

                if ((ECO_callerType === ECO_callerTypeEnum.WEBSERVER) && (ECO_callerPhase === ECO_callerPhaseEnum.SINGLE_PHASE))
                {
                    // Get ECO_selfConsTypeValues from frame for first 8 devices
                    for (var j = 0; j < ECO_SELFCONS_LOADS_NUM; j++) {       
                        if ((ECO_hexStringToInt(str.substr(52, 2)) & (1 << (7 - j))) == 0) {
                            ECO_selfConsTypeValues[j] = 0; // IoT type
                        } else if ((ECO_hexStringToInt(str.substr(52, 2)) & (1 << (7 - j))) > 0) {
                            ECO_selfConsTypeValues[j] = 1; // Avebus Filare Type
                        }
                    }
                }
                else if ((ECO_callerType === ECO_callerTypeEnum.WEBSERVER) && (ECO_callerPhase === ECO_callerPhaseEnum.THREE_PHASE))
                {
                    // Configurazione delle fasi
                    for (var j = 0; j < 4; j++) {
                        ECO_selfConsTypeValues[j] = (ECO_hexStringToInt(str.substr(52,2)) >> (6 - (j * 2))) & 0x03; 
                    }
                    for (var j = 0; j < 2; j++) {
                        ECO_selfConsTypeValues[j + 4] = (ECO_hexStringToInt(str.substr(54,2)) >> (6 - (j * 2))) & 0x03; 
                    }
                }
                
                // Copy type values at first entry in a copy Array 
                ECO_selfConsTypeValuesAtFirstEntry = [].concat(ECO_selfConsTypeValues);
                
                // GUI refresh value
                if (ECO_PTR_fillGUIWithRXConfigurationValues !== null) {
                    ECO_PTR_fillGUIWithRXConfigurationValues(ECO_selfConsAddrValues, ECO_selfConsTypeValues,
                                                             ECO_selfConsNominalPowerValues, ECO_selfConsLoadsTimerValues);
                }
            }
            
            // 'ECO Self Consumptions Loads Priorities Acknowledge' frame
            else if ((str.substr(10, 4) == '594E') && (ECO_selfConsLoadPriorityChangeInProgress == true))
            {
                console.log('%c' + ECO_PREFIX + 'RX ECO SELF CONS LOADS PRIORITIES ACK: ' + str, 'color: ' + ECO_CONSOLE_COLOR);
                ECO_selfConsLoadPriorityChangeInProgress = false;
                clearTimeout(ECO_responseTimeOutStatus); // Clear time out ricezione

                // Refresh ECO_selfConsAddrValuesAtFirstEntry after saving 
                ECO_selfConsAddrValuesAtFirstEntry = [].concat(ECO_selfConsAddrValues);
                // Refresh ECO_selfConsLoadsStatusValues after saving 
                ECO_selfConsLoadsStatusValues = [].concat(ECO_selfConsSortedLoadLogicalStatusValuesArray);
                // Refresh ECO_selfConsTypeValuesAtFirstEntry after saving 
                ECO_selfConsTypeValuesAtFirstEntry = [].concat(ECO_selfConsTypeValues);

                for (var i = 0; i < ECO_selfConsManagedBlockUnblockLoadArray.length; i++) {
                    switch (ECO_selfConsManagedBlockUnblockLoadArray[i]) {
                        case 0:
                        case 3:
                            ECO_selfConsBlockUnblockLoadArrayAtFirstEntry [i] = 0;
                            ECO_selfConsManagedBlockUnblockLoadArray[i]       = 0;
                            break;

                        case 1:
                        case 2:
                            ECO_selfConsBlockUnblockLoadArrayAtFirstEntry [i] = 1;
                            ECO_selfConsManagedBlockUnblockLoadArray[i]       = 1;
                            break;
                    }
                }
                // GUI refresh value with block/unblock status values after saving 
                for (var j = 0; j < ECO_SELFCONS_LOADS_NUM; j++) {
                    if (ECO_PTR_changeSelfConsLoadBlockUnblockStatus !== null) {
                        ECO_PTR_changeSelfConsLoadBlockUnblockStatus(j, ECO_selfConsBlockUnblockLoadArrayAtFirstEntry[j]);
                    }
                }
                ECO_selfConsAdrDataResponseMessageFirstEntryFlag = true; // Flag for first entry reset
                ECO_idxChangeInProgress = false;
                // Enable GUI Up-Down buttons
                if (ECO_PTR_enable_GUI_UpDownButtons !== null) {
                    ECO_PTR_enable_GUI_UpDownButtons();
                }
                // GUI refresh operations status 
                if (ECO_PTR_fillGUIWithOperationsStatus !== null) {
                    ECO_PTR_fillGUIWithOperationsStatus(ECO_operationsStusEnum.PRG_RESULT_OK);
                    if (ECO_PTR_fillGUIWithOperationsStatus !== null) {
                        setTimeout(ECO_PTR_fillGUIWithOperationsStatus, 3000, ECO_operationsStusEnum.NOTHING_TO_DO);
                    }
                }
            }
            else if ((str.substr(4, 2) == ECO_currentAvebusAddress) && (str.substr(6, 2) == ECO_ProgramToolsAvebusAddress)) { // Message sent to target device
                console.log('%c' + ECO_PREFIX + 'RX ECHO message: ' + str, 'color: ' + ECO_CONSOLE_COLOR);
            }
            else {
                console.log('%c' + ECO_PREFIX + 'UNKNOWN message: ' + str, 'color: ' + ECO_CONSOLE_COLOR);
            }
        }
    }
    else { // Message from other device 
        // console.log('%c' + ECO_PREFIX + 'RX message for other device: ' + str, 'color: ' + ECO_CONSOLE_COLOR); // Only for DEBUG
    }
}

/******************************************************************/
// Create Associated Indexes (previous valid index and next valid index)
/******************************************************************/
/*function ECO_getAssociatedIndexesDescription(currentElementIndex, loadsNum)
{   
    var previousIndex = -1; // -1 means no index
    var nextIndex     = -1; // -1 means no index
    if (ECO_addrValues[currentElementIndex] != 0) {
        // Search previousIndex
        for (var i = (currentElementIndex - 1); i >= 0; i--) {
            if (ECO_addrValues[i] != 0) {
                previousIndex = i;
                break;
            }
        }
        // Search nextIndex
        for (var i = (currentElementIndex + 1); i < loadsNum; i++) {
            if (ECO_addrValues[i] != 0) {
                nextIndex = i;
                break;
            }
        }
    }
    var jsonAssociationDescription = '{"beforeIndex": "' + previousIndex + '", "nextIndex": "' + nextIndex + '"}';
    return jsonAssociationDescription;
}*/

/******************************************************************/
// Create Associated Indexes (previous valid index and next valid index)
/******************************************************************/
function ECO_getAssociatedIndexesDescription(currentElementIndex, loadsNum, selfCons) // VER288 WANDA
{   
    var previousIndex = -1; // -1 means no index
    var nextIndex     = -1; // -1 means no index
    var addrValues = [];

    addrValues = selfCons ? ECO_selfConsAddrValues : ECO_addrValues;

    if (addrValues[currentElementIndex] != 0) {
        // Search previousIndex
        for (var i = (currentElementIndex - 1); i >= 0; i--) {
            if (addrValues[i] != 0) {
                previousIndex = i;
                break;
            }
        }
        // Search nextIndex
        for (var i = (currentElementIndex + 1); i < loadsNum; i++) {
            if (addrValues[i] != 0) {
                nextIndex = i;
                break;
            }
        }
    }
    var jsonAssociationDescription = '{"beforeIndex": "' + previousIndex + '", "nextIndex": "' + nextIndex + '"}';
    return jsonAssociationDescription;
}

/******************************************************************/
// Change two elements on up/down btn pression
/******************************************************************/
function ECO_ChangeTwoElements(initialPosition, newPosition, selfCons) // VER288 WANDA
{
    var loadsNum = ECO_SINGLE_PHASE_LOADS_NUM;
    if ((ECO_callerType === ECO_callerTypeEnum.IOT) ||
        ((ECO_callerType === ECO_callerTypeEnum.WEBSERVER) && 
        ((ECO_callerPhase === ECO_callerPhaseEnum.SINGLE_PHASE) || (ECO_callerPhase === ECO_callerPhaseEnum.SINGLE_PHASE_IOT))))
        loadsNum = ECO_SINGLE_PHASE_LOADS_NUM;
    else if ((ECO_callerType === ECO_callerTypeEnum.WEBSERVER) && (ECO_callerPhase === ECO_callerPhaseEnum.THREE_PHASE))
        loadsNum = ECO_THREE_PHASE_LOADS_NUM;

    var appo = null;
    if (ECO_idxChangeInProgress == false) {
        ECO_idxChangeInProgress = true;
    }
    if (parseInt(newPosition) != -1) {
        if (selfCons)
        {
            // CARICHI AUTOCONSUMO
            appo = ECO_selfConsAddrValues[initialPosition];
            ECO_selfConsAddrValues[initialPosition] = ECO_selfConsAddrValues[newPosition];
            ECO_selfConsAddrValues[newPosition] = appo;
            
            appo = ECO_selfConsTypeValues[initialPosition];
            ECO_selfConsTypeValues[initialPosition] = ECO_selfConsTypeValues[newPosition];
            ECO_selfConsTypeValues[newPosition] = appo;
            
            appo = ECO_selfConsNominalPowerValues[initialPosition];
            ECO_selfConsNominalPowerValues[initialPosition] = ECO_selfConsNominalPowerValues[newPosition];
            ECO_selfConsNominalPowerValues[newPosition] = appo;
            
            appo = ECO_selfConsActualPowerValues[initialPosition];
            ECO_selfConsActualPowerValues[initialPosition] = ECO_selfConsActualPowerValues[newPosition];
            ECO_selfConsActualPowerValues[newPosition] = appo;
            
            appo = ECO_selfConsSortedLoadLogicalStatusValuesArray[initialPosition];
            ECO_selfConsSortedLoadLogicalStatusValuesArray[initialPosition] = ECO_selfConsSortedLoadLogicalStatusValuesArray[newPosition];
            ECO_selfConsSortedLoadLogicalStatusValuesArray[newPosition] = appo;
            
            appo = ECO_selfConsLoadsStatusValues[initialPosition];
            ECO_selfConsLoadsStatusValues[initialPosition] = ECO_selfConsLoadsStatusValues[newPosition];
            ECO_selfConsLoadsStatusValues[newPosition] = appo;
            
            appo = ECO_selfConsManagedBlockUnblockLoadArray[initialPosition];
            ECO_selfConsManagedBlockUnblockLoadArray[initialPosition] = ECO_selfConsManagedBlockUnblockLoadArray[newPosition];
            ECO_selfConsManagedBlockUnblockLoadArray[newPosition] = appo;
            
            appo = ECO_selfConsLoadsPowerValuesArray[initialPosition];
            ECO_selfConsLoadsPowerValuesArray[initialPosition] = ECO_selfConsLoadsPowerValuesArray[newPosition];
            ECO_selfConsLoadsPowerValuesArray[newPosition] = appo;
            
            appo = ECO_selfConsLoadsPowerFlagsArray[initialPosition];
            ECO_selfConsLoadsPowerFlagsArray[initialPosition] = ECO_selfConsLoadsPowerFlagsArray[newPosition];
            ECO_selfConsLoadsPowerFlagsArray[newPosition] = appo;

            appo = ECO_selfConsLoadsTimerValues[initialPosition];
            ECO_selfConsLoadsTimerValues[initialPosition] = ECO_selfConsLoadsTimerValues[newPosition];
            ECO_selfConsLoadsTimerValues[newPosition] = appo;

            // GUI refresh value with load RX configuration values
            if (ECO_PTR_fillGUIWithRXConfigurationValues !== null) {
                ECO_PTR_fillGUIWithRXConfigurationValues(ECO_selfConsAddrValues, ECO_selfConsTypeValues, ECO_selfConsNominalPowerValues, ECO_selfConsLoadsTimerValues);
            }
            // GUI refresh value with load powers new order
            if (ECO_PTR_fillGUIWithSelfConsLoadsPowerValues !== null) {
                ECO_PTR_fillGUIWithSelfConsLoadsPowerValues(ECO_selfConsLoadsPowerValuesArray, ECO_selfConsLoadsPowerFlagsArray);
            }
            // GUI refresh value with block/unblock status values new order
            for (var j = 0; j < ECO_SELFCONS_LOADS_NUM; j++) {
                if (ECO_PTR_changeSelfConsLoadBlockUnblockStatus !== null) {
                    ECO_PTR_changeSelfConsLoadBlockUnblockStatus(j, ECO_selfConsManagedBlockUnblockLoadArray[j]);
                }
            }
            // Enable Save button on change
            if (ECO_PTR_enable_GUI_writeValuesButton !== null) {
                ECO_PTR_enable_GUI_writeValuesButton();
            }
        }
        else
        {
            // CARICHI CONTROLLATI
            appo = ECO_addrValues[initialPosition];
            ECO_addrValues[initialPosition] = ECO_addrValues[newPosition];
            ECO_addrValues[newPosition] = appo;
            
            appo = ECO_typeValues[initialPosition];
            ECO_typeValues[initialPosition] = ECO_typeValues[newPosition];
            ECO_typeValues[newPosition] = appo;
            
            appo = ECO_nominalPowerValues[initialPosition];
            ECO_nominalPowerValues[initialPosition] = ECO_nominalPowerValues[newPosition];
            ECO_nominalPowerValues[newPosition] = appo;
            
            appo = ECO_actualPowerValues[initialPosition];
            ECO_actualPowerValues[initialPosition] = ECO_actualPowerValues[newPosition];
            ECO_actualPowerValues[newPosition] = appo;
            
            appo = ECO_sortedLoadLogicalStatusValuesArray[initialPosition];
            ECO_sortedLoadLogicalStatusValuesArray[initialPosition] = ECO_sortedLoadLogicalStatusValuesArray[newPosition];
            ECO_sortedLoadLogicalStatusValuesArray[newPosition] = appo;
            
            appo = ECO_loadStatusValues[initialPosition];
            ECO_loadStatusValues[initialPosition] = ECO_loadStatusValues[newPosition];
            ECO_loadStatusValues[newPosition] = appo;
            
            appo = ECO_managedBlockUnblockLoadArray[initialPosition];
            ECO_managedBlockUnblockLoadArray[initialPosition] = ECO_managedBlockUnblockLoadArray[newPosition];
            ECO_managedBlockUnblockLoadArray[newPosition] = appo;
            
            appo = ECO_loadsPowerValuesArray[initialPosition];
            ECO_loadsPowerValuesArray[initialPosition] = ECO_loadsPowerValuesArray[newPosition];
            ECO_loadsPowerValuesArray[newPosition] = appo;
            
            appo = ECO_loadsPowerFlagsArray[initialPosition];
            ECO_loadsPowerFlagsArray[initialPosition] = ECO_loadsPowerFlagsArray[newPosition];
            ECO_loadsPowerFlagsArray[newPosition] = appo;
            
            // GUI refresh value with load RX configuration values
            if (ECO_PTR_fillGUIWithRXConfigurationValues !== null) {
                ECO_PTR_fillGUIWithRXConfigurationValues(ECO_addrValues, ECO_typeValues, ECO_nominalPowerValues);
            }
            // GUI refresh value with loads status values new order
            if (ECO_PTR_fillGUIWithLoadStatusValues !== null) {
                ECO_PTR_fillGUIWithLoadStatusValues(ECO_sortedLoadLogicalStatusValuesArray);
            }
            // GUI refresh value with block/unblock status values new order
            for (var j = 0; j < loadsNum; j++) {
                if (ECO_PTR_changeLoadBlockUnblockStatus !== null) {
                    ECO_PTR_changeLoadBlockUnblockStatus(j, ECO_managedBlockUnblockLoadArray[j]);
                }
            }
            // Enable Save button on change
            if (ECO_PTR_enable_GUI_writeValuesButton !== null) {
                ECO_PTR_enable_GUI_writeValuesButton();
            }
        }
    }
}

/******************************************************************/
// Change two elements on up/down btn pression
/******************************************************************/
/*function ECO_getArrayIndexByAddress(addressToSearch)
{
    var indexToReturn = 0;
    for (var i = 0; i < ECO_addrValues.length; i++) {
        var currentAddress = parseInt(ECO_addrValues[i], 16);
        if (currentAddress == parseInt(addressToSearch)) {
            indexToReturn = i + 1;
        }
    }
    return indexToReturn;
}*/

/******************************************************************/
// Change two elements on up/down btn pression
/******************************************************************/
function ECO_getArrayIndexByAddress(addressToSearch, selfCons) // VER288 WANDA
{
    var indexToReturn = 0;
    var addrValues = selfCons ? ECO_selfConsAddrValues : ECO_addrValues;
    for (var i = 0; i < addrValues.length; i++) {
        var currentAddress = parseInt(addrValues[i], 16);
        if (currentAddress == parseInt(addressToSearch)) {
            indexToReturn = i + 1;
        }
    }
    return indexToReturn;
}

/******************************************************************/
/*function ECO_getArrayIndexByAddress_SearchingInsideFirstRXData(addressToSearch)
{
    var indexToReturn = 0;
    if (ECO_firstRXAddrValues.length == 0 && ECO_addrValues.length > 0) {
        for (var j = 0; j < ECO_addrValues.length; j++) {
            ECO_firstRXAddrValues[j] = ECO_addrValues[j];
        }
    }
    for (var i = 0; i < ECO_firstRXAddrValues.length; i++) {
        var currentAddress = parseInt(ECO_firstRXAddrValues[i], 16);
        if (currentAddress == parseInt(addressToSearch)) {
            indexToReturn = i + 1;
        }
    }
    return indexToReturn;
}*/

/******************************************************************/
function ECO_getArrayIndexByAddress_SearchingInsideFirstRXData(addressToSearch, selfCons) // VER288 WANDA
{
    var indexToReturn     = 0;
    var firstRXAddrValues = selfCons ? ECO_selfConsFirstRXAddrValues : ECO_firstRXAddrValues;
    var addrValues        = selfCons ? ECO_selfConsAddrValues : ECO_addrValues;

    if (firstRXAddrValues.length == 0 && addrValues.length > 0) {
        for (var j = 0; j < addrValues.length; j++) {
            firstRXAddrValues[j] = addrValues[j];
        }
    }
    for (var i = 0; i < firstRXAddrValues.length; i++) {
        var currentAddress = parseInt(firstRXAddrValues[i], 16);
        if (currentAddress == parseInt(addressToSearch)) {
            indexToReturn = i + 1;
        }
    }

    return indexToReturn;
}

/******************************************************************/
/*function ECO_getAddressByIndex_SearchingInsideFirstRXData(indexToSearch)
{
    var addressToReturn = 0;
    if (ECO_firstRXAddrValues.length == 0 && ECO_addrValues.length > 0) {
        for (var j = 0; j < ECO_addrValues.length; j++) {
            ECO_firstRXAddrValues[j] = ECO_addrValues[j];
        }
    }
    if (ECO_firstRXAddrValues.length > indexToSearch) {
        addressToReturn = parseInt(ECO_firstRXAddrValues[indexToSearch], 16);
    }
    return addressToReturn;
}*/

/******************************************************************/
function ECO_getAddressByIndex_SearchingInsideFirstRXData(indexToSearch, selfCons) // VER288 WANDA
{
    var addressToReturn    = 0;
    var firstRXAddrValues  = selfCons ? ECO_selfConsFirstRXAddrValues : ECO_firstRXAddrValues;
    var addrValues         = selfCons ? ECO_selfConsAddrValues : ECO_addrValues;

    if (firstRXAddrValues.length == 0 && addrValues.length > 0) {
        for (var j = 0; j < addrValues.length; j++) {
            firstRXAddrValues[j] = addrValues[j];
        }
    }
    if (firstRXAddrValues.length > indexToSearch) {
        addressToReturn = parseInt(firstRXAddrValues[indexToSearch], 16);
    }
    return addressToReturn;
}

/******************************************************************/
/*function ECO_getAddressByIndex_SearchingInsideCurrentData(indexToSearch)
{
    var addressToReturn = 0;
    if (ECO_addrValues.length > indexToSearch) {
        addressToReturn = parseInt(ECO_addrValues[indexToSearch], 16);
    }       
    return addressToReturn;
}*/

/******************************************************************/
function ECO_getAddressByIndex_SearchingInsideCurrentData(indexToSearch, selfCons) // VER288 WANDA
{
    var addressToReturn = 0;
    var addrValues = selfCons ? ECO_selfConsAddrValues : ECO_addrValues;

    if (addrValues.length > indexToSearch) {
        addressToReturn = parseInt(addrValues[indexToSearch], 16);
    }       
    return addressToReturn;
}

/******************************************************************/
/*function ECO_getLoadTypeByAddress(addressToSearch)
{
    var typeToReturn      = 0;
    var typeIndexToSearch = ECO_getArrayIndexByAddress_SearchingInsideFirstRXData(addressToSearch); // 1 based
    if (typeIndexToSearch > 0) {
        if (ECO_firstRXFlags.length > typeIndexToSearch) {
            typeToReturn = parseInt(ECO_firstRXFlags[typeIndexToSearch - 1]);
        }   
    }   
    return typeToReturn;
}*/

/******************************************************************/
function ECO_getLoadTypeByAddress(addressToSearch, selfCons) // VER288 WANDA
{
    var typeToReturn      = 0;
    var firstRXFlags      = selfCons ? ECO_selfConsFirstRXFlags : ECO_firstRXFlags;
    var typeIndexToSearch = ECO_getArrayIndexByAddress_SearchingInsideFirstRXData(addressToSearch, selfCons); // 1 based
    if (typeIndexToSearch > 0) {
        if (firstRXFlags.length > typeIndexToSearch) {
            typeToReturn = parseInt(firstRXFlags[typeIndexToSearch - 1]);
        }   
    }   
    return typeToReturn;
}

/******************************************************************/
/******************************************************************/
/*                   MEASURES POWER SECTION                       */
/******************************************************************/
/*function ECO_getMeasuredPowerByAddress_SearchingInsideFirstRXData(addressToSearch)
{
    var powerToReturn      = 0;
    var powerIndexToSearch = ECO_getArrayIndexByAddress_SearchingInsideFirstRXData(addressToSearch); // 1 based
    if (ECO_firstRXPowerValues.length == 0 && ECO_loadsPowerValuesArray.length > 0) {
        for (var j = 0; j < ECO_loadsPowerValuesArray.length; j++) {
            ECO_firstRXPowerValues[j] = ECO_loadsPowerValuesArray[j];
        }
    }
    if (powerIndexToSearch > 0) {
        if (ECO_firstRXPowerValues.length > powerIndexToSearch) {
            if (parseInt(ECO_firstRXPowerValues[powerIndexToSearch - 1], 16) == 0xFE) {
                powerToReturn = 0xFE;
            }   else if (parseInt(ECO_firstRXPowerValues[powerIndexToSearch - 1], 10) != -1) {
                powerToReturn = parseInt(ECO_firstRXPowerValues[powerIndexToSearch - 1], 10) * 50;
            }
        }
    }
    return powerToReturn;
}*/

function ECO_getMeasuredPowerByAddress_SearchingInsideFirstRXData(addressToSearch, selfCons) // VER288 WANDA
{
    var powerToReturn      = 0;
    var powerIndexToSearch = ECO_getArrayIndexByAddress_SearchingInsideFirstRXData(addressToSearch, selfCons); // 1 based
    var firstRXPowerValues = selfCons ? ECO_selfConsFirstRXPowerValues : ECO_firstRXPowerValues;
    var loadsPowerValuesArray = selfCons ? ECO_selfConsLoadsPowerValuesArray : ECO_loadsPowerValuesArray;

    if (firstRXPowerValues.length == 0 && loadsPowerValuesArray.length > 0) {
        for (var j = 0; j < loadsPowerValuesArray.length; j++) {
            firstRXPowerValues[j] = loadsPowerValuesArray[j];
        }
    }
    if (powerIndexToSearch > 0) {
        if (firstRXPowerValues.length > powerIndexToSearch) {
            if (parseInt(firstRXPowerValues[powerIndexToSearch - 1], 16) == 0xFE) {
                powerToReturn = 0xFE;
            }   else if (parseInt(firstRXPowerValues[powerIndexToSearch - 1], 10) != -1) {
                powerToReturn = parseInt(firstRXPowerValues[powerIndexToSearch - 1], 10) * 50;
            }
        }
    }
    return powerToReturn;
}

/******************************************************************/
/******************************************************************/
/*                      NOMINAL POWER SECTION                     */
/******************************************************************/
/******************************************************************/
/*function ECO_getNominalPowerByIndex_SearchingInsideFirstRXData(index)
{
    var powerToReturn;
    if (ECO_firstRXNominalPowerValues.length == 0 && ECO_nominalPowerValues.length > 0) {
        for (var j = 0; j < ECO_nominalPowerValues.length; j++) {
            ECO_firstRXNominalPowerValues[j] = ECO_nominalPowerValues[j];
        }
    }
    if (ECO_firstRXNominalPowerValues.length > index) {
        powerToReturn = parseInt(ECO_firstRXNominalPowerValues[index], 10) * 100;
    }
    return powerToReturn;
}*/

function ECO_getNominalPowerByIndex_SearchingInsideFirstRXData(index, selfCons) // VER288 WANDA
{
    var powerToReturn;
    var firstRXNominalPowerValues = selfCons ? ECO_selfConsFirstRXNominalPowerValues : ECO_firstRXNominalPowerValues;
    var nominalPowerValues = selfCons ? ECO_selfConsNominalPowerValues : ECO_nominalPowerValues;

    if (firstRXNominalPowerValues.length == 0 && nominalPowerValues.length > 0) {
        for (var j = 0; j < nominalPowerValues.length; j++) {
            firstRXNominalPowerValues[j] = nominalPowerValues[j];
        }
    }
    if (firstRXNominalPowerValues.length > index) {
        powerToReturn = parseInt(firstRXNominalPowerValues[index], 10) * 100;
    }
    return powerToReturn;
}

/******************************************************************/
/*function ECO_getNominalPowerByAddress_SearchingInsideFirstRXData(addressToSearch)
{
    var powerToReturn      = 0;
    var powerIndexToSearch = ECO_getArrayIndexByAddress_SearchingInsideFirstRXData(addressToSearch); // 1 based
    if (ECO_firstRXNominalPowerValues.length == 0 && ECO_nominalPowerValues.length > 0) {
        for (var j = 0; j < ECO_nominalPowerValues.length; j++) {
            ECO_firstRXNominalPowerValues[j] = ECO_nominalPowerValues[j];
        }
    }
    if (powerIndexToSearch > 0) {
        if (ECO_firstRXNominalPowerValues.length > powerIndexToSearch) {
            if (parseInt(ECO_firstRXNominalPowerValues[powerIndexToSearch - 1], 16) != 0xFF) {
                powerToReturn = parseInt(ECO_firstRXNominalPowerValues[powerIndexToSearch - 1], 10) * 100;
            }
        }
    }   
    return powerToReturn;
}*/

/******************************************************************/
function ECO_getNominalPowerByAddress_SearchingInsideFirstRXData(addressToSearch, selfCons) // VER288 WANDA
{
    var powerToReturn             = 0;
    var firstRXNominalPowerValues = selfCons ? ECO_selfConsFirstRXNominalPowerValues : ECO_firstRXNominalPowerValues;
    var nominalPowerValues        = selfCons ? ECO_selfConsNominalPowerValues : ECO_nominalPowerValues;

    var powerIndexToSearch = ECO_getArrayIndexByAddress_SearchingInsideFirstRXData(addressToSearch, selfCons); // 1 based
    if (firstRXNominalPowerValues.length == 0 && nominalPowerValues.length > 0) {
        for (var j = 0; j < nominalPowerValues.length; j++) {
            firstRXNominalPowerValues[j] = nominalPowerValues[j];
        }
    }
    if (powerIndexToSearch > 0) {
        if (firstRXNominalPowerValues.length > powerIndexToSearch) {
            if (parseInt(firstRXNominalPowerValues[powerIndexToSearch - 1], 16) != 0xFF) {
                powerToReturn = parseInt(firstRXNominalPowerValues[powerIndexToSearch - 1], 10) * 100;
            }
        }
    }   
    return powerToReturn;
}

/******************************************************************/
// Sorting load status values Array by address
/******************************************************************/
/*function ECO_sortLoadStatusValues(loadsNum)
{
    var sortedLoadLogicalStatusValuesArray = [];
    for (var i = 0; i < loadsNum; i++) {
        var originalPos = -1;
        for (var j = 0; j < loadsNum; j++) {
            if (ECO_addrValues[i] == ECO_addrValuesAtFirstEntry[j]) {
                originalPos = j;
            }
        }
        if (originalPos != -1) {
            sortedLoadLogicalStatusValuesArray[i] = ECO_loadStatusValues[originalPos];
        }
    }
    return sortedLoadLogicalStatusValuesArray;
}*/

function ECO_sortLoadStatusValues(loadsNum, selfCons) // VER288 WANDA
{
    var sortedLoadLogicalStatusValuesArray = [];
    var addrValues                      = selfCons ? ECO_selfConsAddrValues             : ECO_addrValues;
    var addrValuesAtFirstEntry          = selfCons ? ECO_selfConsAddrValuesAtFirstEntry : ECO_addrValuesAtFirstEntry;
    var receivedLoadLogicalStatusValues = selfCons ? ECO_selfConsLoadsStatusValues      : ECO_loadStatusValues;

    for (var i = 0; i < loadsNum; i++) {
        var originalPos = -1;
        for (var j = 0; j < loadsNum; j++) {
            if (addrValues[i] == addrValuesAtFirstEntry[j]) {
                originalPos = j;
            }
        }
        if (originalPos != -1) {
            sortedLoadLogicalStatusValuesArray[i] = receivedLoadLogicalStatusValues[originalPos];
        }
    }
    return sortedLoadLogicalStatusValuesArray;
}

/******************************************************************/
// Block/UnBlock Status from GUI
/******************************************************************/
/*function ECO_blockUnblockLoad(loadIdx)
{
    if ((ECO_managedBlockUnblockLoadArray[loadIdx] == 0) || (ECO_managedBlockUnblockLoadArray[loadIdx] == 3)) {
        ECO_managedBlockUnblockLoadArray[loadIdx] = 2; // SET FUTURE BLOCKED STATUS    
        if (ECO_PTR_changeLoadBlockUnblockStatus !== null) {
            ECO_PTR_changeLoadBlockUnblockStatus(loadIdx, ECO_blockedUnblockedStusEnum.FUTURE_BLOCKED_LOAD);
            // ENABLE BTN SAVE VALUES 
          if (ECO_PTR_enable_GUI_writeValuesButton !== null) {
                ECO_PTR_enable_GUI_writeValuesButton();
            }
        }
    }
    else if ((ECO_managedBlockUnblockLoadArray[loadIdx] == 1) || (ECO_managedBlockUnblockLoadArray[loadIdx] == 2)) {
        ECO_managedBlockUnblockLoadArray[loadIdx] = 3;  // SET FUTURE UNBLOCKED STATUS  
        if (ECO_PTR_changeLoadBlockUnblockStatus !== null) {
            ECO_PTR_changeLoadBlockUnblockStatus(loadIdx, ECO_blockedUnblockedStusEnum.FUTURE_UNBLOCKED_LOAD);
            // ENABLE BTN SAVE VALUES
          if (ECO_PTR_enable_GUI_writeValuesButton !== null) {
                ECO_PTR_enable_GUI_writeValuesButton();
            }
        }
    }
}*/

function ECO_blockUnblockLoad(loadIdx, selfCons) // VER288 WANDA
{
    if (selfCons)
    {
        if ((ECO_selfConsManagedBlockUnblockLoadArray[loadIdx] == 0) || (ECO_selfConsManagedBlockUnblockLoadArray[loadIdx] == 3)) {
            ECO_selfConsManagedBlockUnblockLoadArray[loadIdx] = 2; // SET FUTURE BLOCKED STATUS    
            if (ECO_PTR_changeSelfConsLoadBlockUnblockStatus !== null) {
                ECO_PTR_changeSelfConsLoadBlockUnblockStatus(loadIdx, ECO_blockedUnblockedStusEnum.FUTURE_BLOCKED_LOAD);
                // ENABLE BTN SAVE VALUES 
                if (ECO_PTR_enable_GUI_writeValuesButton !== null) {
                    ECO_PTR_enable_GUI_writeValuesButton();
                }
            }
        }
        else if ((ECO_selfConsManagedBlockUnblockLoadArray[loadIdx] == 1) || (ECO_selfConsManagedBlockUnblockLoadArray[loadIdx] == 2)) {
            ECO_selfConsManagedBlockUnblockLoadArray[loadIdx] = 3;  // SET FUTURE UNBLOCKED STATUS  
            if (ECO_PTR_changeSelfConsLoadBlockUnblockStatus !== null) {
                ECO_PTR_changeSelfConsLoadBlockUnblockStatus(loadIdx, ECO_blockedUnblockedStusEnum.FUTURE_UNBLOCKED_LOAD);
                // ENABLE BTN SAVE VALUES
                if (ECO_PTR_enable_GUI_writeValuesButton !== null) {
                    ECO_PTR_enable_GUI_writeValuesButton();
                }
            }
        }
    }
    else
    {
        if ((ECO_managedBlockUnblockLoadArray[loadIdx] == 0) || (ECO_managedBlockUnblockLoadArray[loadIdx] == 3)) {
            ECO_managedBlockUnblockLoadArray[loadIdx] = 2; // SET FUTURE BLOCKED STATUS    
            if (ECO_PTR_changeLoadBlockUnblockStatus !== null) {
                ECO_PTR_changeLoadBlockUnblockStatus(loadIdx, ECO_blockedUnblockedStusEnum.FUTURE_BLOCKED_LOAD);
                // ENABLE BTN SAVE VALUES 
              if (ECO_PTR_enable_GUI_writeValuesButton !== null) {
                    ECO_PTR_enable_GUI_writeValuesButton();
                }
            }
        }
        else if ((ECO_managedBlockUnblockLoadArray[loadIdx] == 1) || (ECO_managedBlockUnblockLoadArray[loadIdx] == 2)) {
            ECO_managedBlockUnblockLoadArray[loadIdx] = 3;  // SET FUTURE UNBLOCKED STATUS  
            if (ECO_PTR_changeLoadBlockUnblockStatus !== null) {
                ECO_PTR_changeLoadBlockUnblockStatus(loadIdx, ECO_blockedUnblockedStusEnum.FUTURE_UNBLOCKED_LOAD);
                // ENABLE BTN SAVE VALUES
              if (ECO_PTR_enable_GUI_writeValuesButton !== null) {
                    ECO_PTR_enable_GUI_writeValuesButton();
                }
            }
        }
    }
}

/******************************************************************/
// Get Block/UnBlock Status payload
/******************************************************************/
/*function ECO_getBlockUnblockLoadStatusPayload() 
{
    var statusPayloadByte1 = 0;
    var statusPayloadByte2 = 0;
    var workArray          = [];
    // Create Block/UnBlock Status payload from GUI status 
    for (var i = 0; i < ECO_managedBlockUnblockLoadArray.length; i++) {
        switch (ECO_managedBlockUnblockLoadArray[i]) {
            case 0:
            case 3:
                workArray [i] = 0;
                break;
            
            case 1:
            case 2:
                workArray [i] = 1;
                break;
        }
    }
    for (var i = 0; i <= 7; i++) { // 1st byte
        statusPayloadByte1 = (workArray[i] << (7 - i)) + statusPayloadByte1;
    }
    for (var i = 0; i <= 11; i++) { // 2nd byte
        statusPayloadByte2 = (workArray[8 + i] << (7 - i)) + statusPayloadByte2;
    }
    // MOD WILLIAM 
    return statusPayloadByte1.toString(16).padStart(2,0).toUpperCase() + statusPayloadByte2.toString(16).padStart(2,0).toUpperCase();
}*/

function ECO_getBlockUnblockLoadStatusPayload(selfCons) // VER288 WANDA
{
    var statusPayloadByte1 = 0;
    var statusPayloadByte2 = 0;
    var workArray          = [];
    var managedBlockUnblockLoadArray = selfCons ? ECO_selfConsManagedBlockUnblockLoadArray : ECO_managedBlockUnblockLoadArray;

    // Create Block/UnBlock Status payload from GUI status 
    for (var i = 0; i < managedBlockUnblockLoadArray.length; i++) {
        switch (managedBlockUnblockLoadArray[i]) {
            case 0:
            case 3:
                workArray [i] = 0;
                break;
            
            case 1:
            case 2:
                workArray [i] = 1;
                break;
        }
    }
    if (selfCons)
    {
        for (var i = 0; i <= 7; i++) { // 1st byte
            statusPayloadByte1 = (workArray[i] << (7 - i)) + statusPayloadByte1;
        }
        return ECO_addPadding('00', statusPayloadByte1.toString(16), true, true); // VER288 WANDA
    }
    else
    {
        for (var i = 0; i <= 7; i++) { // 1st byte
            statusPayloadByte1 = (workArray[i] << (7 - i)) + statusPayloadByte1;
        }
        for (var i = 0; i <= 11; i++) { // 2nd byte
            statusPayloadByte2 = (workArray[8 + i] << (7 - i)) + statusPayloadByte2;
        }     
        return ECO_addPadding('00', statusPayloadByte1.toString(16), true, true) + ECO_addPadding('00', statusPayloadByte2.toString(16), true, true); // VER288 WANDA
    }
}

/******************************************************************/
function ECO_updateDefaultCallerType(callerType)
{
    ECO_callerType = callerType;
}

/******************************************************************/
function ECO_updateDefaultCallerPhase(callerPhase)
{
    ECO_callerPhase = callerPhase;
}

/* ---------------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------------- */

/**
 * Adds pad
 * @param {string} pad          - padding element
 * @param {string} str          - string to pad
 * @param {boolean} padLeft     - pad to the left?
 * @param {boolean} toUpperCase - to uppercase?
 * @returns padded string
 * @version VER288 - WANDA
 */
function ECO_addPadding(pad, str, padLeft, toUpperCase)
{
  var stringToReturn = '';
  if (typeof str === 'undefined') {
    return pad;
  }
  if (padLeft) {
    stringToReturn = (pad + str).slice(-pad.length)
  } else {
    stringToReturn = (str + pad).substring(0, pad.length)
  }
  if (toUpperCase === true) {
    stringToReturn = stringToReturn.toUpperCase();
  }
  return stringToReturn;
}

/* ---------------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------------- *//***************************************************************************************************************************************/
/*                                                   HOTEL_module version 1.1 WBS 282                                                  */
/***************************************************************************************************************************************/

var HOTEL_PREFIX        = '[HOTEL]: ';
var HOTEL_CONSOLE_COLOR = '#00b300'; // Light green
var HOTEL_CONSOLE_ERROR = '#ff0000'; // Red

var HOTEL_SCRALB_webSocketInstance = null;

var HOTEL_OPERATIONS = {
                          HOTEL_OPERATION_NONE     : 0,
                          HOTEL_OPERATION_CHECKIN  : 1,
                          HOTEL_OPERATION_CHECKOUT : 2,
                          HOTEL_OPERATION_STAFF    : 3,
                          HOTEL_OPERATION_DETAILS  : 4
                        };
var HOTEL_ROOM_STATES = {
                          HOTEL_ROOM_STATE_CHECKOUT    : 0,
                          HOTEL_ROOM_STATE_PRECHECKIN  : 10,
                          HOTEL_ROOM_STATE_CHECKIN     : 20
                        };
var HOTEL_SCRALB_STATES = {
                          HOTEL_SCRALB_STATE_UNKNOWN            : 0,
                          HOTEL_SCRALB_STATE_LOCAL_NOT_ALLOWED  : 1,
                          HOTEL_SCRALB_STATE_LOCAL_CONNECTED    : 2,
                          HOTEL_SCRALB_STATE_LOCAL_DISCONNECTED : 3
                        };

var HOTEL_SCRALB_EVENT_CALLBACK = {
                          CARD_PRESENT : "cardPresent",
                          CARD_READCOMPLETED : "cardReadCompleted",
                          CARD_WRITECOMPLETED  : "cardWriteCompleted",
                          CARD_REMOVED : "cardRemoved",
                          CARD_READCMDRECEIVED : "cardReadCmdReceived",
                          CARD_WRITECMDRECEIVED  : "cardWriteCmdReceived",
                          CARD_LOCKCOMPLETED : "cardLockCompleted",
                          CARD_UNLOCKCOMPLETED : "cardUnlockCompleted"
                        };

var HOTEL_module_initialized = false;
var HOTEL_currentRoom = -1;
var HOTEL_currentUserID = -1;
var HOTEL_currentUsername = "";
var HOTEL_selectedOperation = HOTEL_OPERATIONS.HOTEL_OPERATION_NONE;
var HOTEL_currentScralbStatus = HOTEL_OPERATIONS.HOTEL_SCRALB_STATE_UNKNOWN;
var HOTEL_PTR_scralbStatusChanged = null;

var HOTEL_WS_PTR_onScralbCardPresent = new Array();
var HOTEL_WS_PTR_onScralbCardReadCompleted = new Array();
var HOTEL_WS_PTR_onScralbCardWriteCompleted = new Array();
var HOTEL_WS_PTR_onScralbCardRemoved = new Array();
var HOTEL_WS_PTR_onScralbCardReadCmdReceived = new Array();
var HOTEL_WS_PTR_onScralbCardWriteCmdReceived = new Array();
var HOTEL_WS_PTR_onScralbCardLockCompleted = new Array();
var HOTEL_WS_PTR_onScralbCardUnlockCompleted  = new Array();
var HOTEL_WS_eventCallbackLevelCounter = 0;

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------- SCR-ALB -------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * SCR-ALB onConnectionOpen --- Callback to websocket events
 */
function HOTEL_SCRALB_onConnectionOpen()
{
  console.log('%c' + HOTEL_PREFIX + "Connessione a SCR-ALB OK", 'color: ' + HOTEL_CONSOLE_COLOR);

  HOTEL_currentScralbStatus = HOTEL_SCRALB_STATES.HOTEL_SCRALB_STATE_LOCAL_CONNECTED;

  if (HOTEL_PTR_scralbStatusChanged != null && typeof HOTEL_PTR_scralbStatusChanged === 'function')
  {
    HOTEL_PTR_scralbStatusChanged(HOTEL_SCRALB_STATES.HOTEL_SCRALB_STATE_LOCAL_CONNECTED);
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * SCR-ALB onConnectionError --- Callback to websocket events
 */
function HOTEL_SCRALB_onConnectionError()
{
  console.log('%c' + HOTEL_PREFIX + "Errore sul socket", 'color: ' + HOTEL_CONSOLE_ERROR);

  HOTEL_currentScralbStatus = HOTEL_SCRALB_STATES.HOTEL_SCRALB_STATE_LOCAL_DISCONNECTED;

  if (HOTEL_PTR_scralbStatusChanged != null && typeof HOTEL_PTR_scralbStatusChanged === 'function')
  {
    HOTEL_PTR_scralbStatusChanged(HOTEL_SCRALB_STATES.HOTEL_SCRALB_STATE_LOCAL_DISCONNECTED);
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * SCR-ALB onConnectionClose --- Callback to websocket events
 */
function HOTEL_SCRALB_onConnectionClose()
{
  console.log('%c' + HOTEL_PREFIX + "Connessione al socket chiusa", 'color: ' + HOTEL_CONSOLE_ERROR);

  HOTEL_currentScralbStatus = HOTEL_SCRALB_STATES.HOTEL_SCRALB_STATE_LOCAL_DISCONNECTED;

  if (HOTEL_PTR_scralbStatusChanged != null && typeof HOTEL_PTR_scralbStatusChanged === 'function')
  {
    HOTEL_PTR_scralbStatusChanged(HOTEL_SCRALB_STATES.HOTEL_SCRALB_STATE_LOCAL_DISCONNECTED);
  }
  
  setTimeout(function() { HOTEL_SCRALB_webSocketInstance.WEBSOCKET_doConnect("1"); }, 5000);
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Check if SCR-ALB can be open locally
 */
function HOTEL_SCRALB_canOpenLocally()
{
  if (location.pathname.indexOf('/access') === 0) {
    return false;
  }

  // TS
  var isTS10      = (navigator.userAgent.indexOf('Unknown') >= 0 && navigator.userAgent.indexOf('Linux') >= 0 && navigator.userAgent.indexOf('EHLX-IS-TS10') >= 0);
  var isTSSMART   = (navigator.userAgent.indexOf('Linux') >= 0 && navigator.userAgent.indexOf('MOB30J') >= 0 && screen.width === 1280);
  var isTSSMART7  = (navigator.userAgent.indexOf('Linux') >= 0 && navigator.userAgent.indexOf('MOB30J') >= 0 && screen.width === 1024);
  var isTSSMART18 = (navigator.userAgent.indexOf('Linux') >= 0 && navigator.userAgent.indexOf('RQ3A') >= 0 && screen.width === 1280); // VER254 WANDA
  // iOS
  var isIpad   = (navigator.userAgent.indexOf('iPad') >= 0 || navigator.userAgent.indexOf('Macintosh') >= 0);
  var isIphone = navigator.userAgent.indexOf('iPhone') >= 0;

  var isMobile = (isIpad || isIphone) || (navigator.userAgent.indexOf('Android') >= 0 && !(isTSSMART || isTSSMART7 || isTSSMART18));

  if (isTS10 || isTSSMART || isTSSMART7 || isTSSMART18 || isIpad || isIphone || isMobile)
  {
    return false;
  }

  return true;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * CARD lock SCR-ALB
 */
function HOTEL_SCRALB_lock(address)
{
  console.log('%c' + HOTEL_PREFIX + "Provo a richiedere la risorsa SCR-ALB in maniera esclusiva...", 'color: ' + HOTEL_CONSOLE_COLOR);

  var msgToSend = DOMINAPLUS_MANAGER_composeMessage("HTL", ["LK", "00"]);
  if (HOTEL_SCRALB_webSocketInstance != null)
  {
    HOTEL_SCRALB_webSocketInstance.WEBSOCKET_send(msgToSend);
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * CARD unlock SCR-ALB
 */
function HOTEL_SCRALB_unlock(address)
{
  console.log('%c' + HOTEL_PREFIX + "Provo a rilasciare la risorsa SCR-ALB...", 'color: ' + HOTEL_CONSOLE_COLOR);

  var msgToSend = DOMINAPLUS_MANAGER_composeMessage("HTL", ["UK", "00"]);
  if (HOTEL_SCRALB_webSocketInstance != null)
  {
    HOTEL_SCRALB_webSocketInstance.WEBSOCKET_send(msgToSend);
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * CARD force read
 */
function HOTEL_SCRALB_read(address)
{
  console.log('%c' + HOTEL_PREFIX + "Tento di leggere la CARD...", 'color: ' + HOTEL_CONSOLE_COLOR);

  var msgToSend = DOMINAPLUS_MANAGER_composeMessage("HTL", ["RC", "00"]);
  if (HOTEL_SCRALB_webSocketInstance != null)
  {
    HOTEL_SCRALB_webSocketInstance.WEBSOCKET_send(msgToSend);
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * CARD write data
 */
function HOTEL_SCRALB_write(address, cardInstance)
{
  console.log('%c' + HOTEL_PREFIX + "Tento di scrivere la CARD...", 'color: ' + HOTEL_CONSOLE_COLOR);

  var records = [cardInstance.HOTELCARD_toDominaplusRecordFields()];

  var msgToSend = DOMINAPLUS_MANAGER_composeMessage("HTL", ["WC", "00"], records);
  if (HOTEL_SCRALB_webSocketInstance != null)
  {
    HOTEL_SCRALB_webSocketInstance.WEBSOCKET_send(msgToSend);
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Check if SCR-ALB is present
 */
function HOTEL_SCRALB_isPresent(address)
{
  if (HOTEL_SCRALB_webSocketInstance == null)
  {
    return false;
  }
  return HOTEL_SCRALB_webSocketInstance.WEBSOCKET_isWebSocketReadyToTransmit();
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Get the SCR-ALB status
 */
function HOTEL_SCRALB_getCurrentStatus()
{
  return HOTEL_currentScralbStatus;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Function to register a callback in response to a SCR-ALB event
 * @returns true if ok or false if ko
 */
function HOTEL_SCRALB_registerWebsocketEventHandler(pageIdentifier, websocketMultipleCallbackCfg)
{
  if (typeof pageIdentifier === 'undefined' || pageIdentifier === null)
  {
    return false;
  }

  if (typeof websocketMultipleCallbackCfg === 'undefined' || websocketMultipleCallbackCfg === null)
  {
    return false;
  }
  
  if (typeof websocketMultipleCallbackCfg === 'object')
  {
    HOTEL_SCRALB_unregisterWebsocketEventHandler(pageIdentifier);

    if (websocketMultipleCallbackCfg.hasOwnProperty(HOTEL_SCRALB_EVENT_CALLBACK.CARD_PRESENT) && typeof websocketMultipleCallbackCfg.cardPresent === 'function') {
      HOTEL_WS_PTR_onScralbCardPresent.push({pageId: pageIdentifier, callback: websocketMultipleCallbackCfg.cardPresent});
    }
    else {
      HOTEL_WS_PTR_onScralbCardPresent.push({pageId: pageIdentifier, callback: HOTEL_SCRALB_stopEvent});
    }

    if (websocketMultipleCallbackCfg.hasOwnProperty(HOTEL_SCRALB_EVENT_CALLBACK.CARD_READCOMPLETED) && typeof websocketMultipleCallbackCfg.cardReadCompleted === 'function') {
      HOTEL_WS_PTR_onScralbCardReadCompleted.push({pageId: pageIdentifier, callback: websocketMultipleCallbackCfg.cardReadCompleted});
    }
    else {
      HOTEL_WS_PTR_onScralbCardReadCompleted.push({pageId: pageIdentifier, callback: HOTEL_SCRALB_stopEvent});
    }

    if (websocketMultipleCallbackCfg.hasOwnProperty(HOTEL_SCRALB_EVENT_CALLBACK.CARD_WRITECOMPLETED) && typeof websocketMultipleCallbackCfg.cardWriteCompleted === 'function') {
      HOTEL_WS_PTR_onScralbCardWriteCompleted.push({pageId: pageIdentifier, callback: websocketMultipleCallbackCfg.cardWriteCompleted});
    }
    else {
      HOTEL_WS_PTR_onScralbCardWriteCompleted.push({pageId: pageIdentifier, callback: HOTEL_SCRALB_stopEvent});
    }

    if (websocketMultipleCallbackCfg.hasOwnProperty(HOTEL_SCRALB_EVENT_CALLBACK.CARD_REMOVED) && typeof websocketMultipleCallbackCfg.cardRemoved === 'function') {
      HOTEL_WS_PTR_onScralbCardRemoved.push({pageId: pageIdentifier, callback: websocketMultipleCallbackCfg.cardRemoved});
    }
    else {
      HOTEL_WS_PTR_onScralbCardRemoved.push({pageId: pageIdentifier, callback: HOTEL_SCRALB_stopEvent});
    }

    if (websocketMultipleCallbackCfg.hasOwnProperty(HOTEL_SCRALB_EVENT_CALLBACK.CARD_READCMDRECEIVED) && typeof websocketMultipleCallbackCfg.cardReadCmdReceived === 'function') {
      HOTEL_WS_PTR_onScralbCardReadCmdReceived.push({pageId: pageIdentifier, callback: websocketMultipleCallbackCfg.cardReadCmdReceived});
    }
    else {
      HOTEL_WS_PTR_onScralbCardReadCmdReceived.push({pageId: pageIdentifier, callback: HOTEL_SCRALB_stopEvent});
    }

    if (websocketMultipleCallbackCfg.hasOwnProperty(HOTEL_SCRALB_EVENT_CALLBACK.CARD_WRITECMDRECEIVED) && typeof websocketMultipleCallbackCfg.cardWriteCmdReceived === 'function') {
      HOTEL_WS_PTR_onScralbCardWriteCmdReceived.push({pageId: pageIdentifier, callback: websocketMultipleCallbackCfg.cardWriteCmdReceived});
    }
    else {
      HOTEL_WS_PTR_onScralbCardWriteCmdReceived.push({pageId: pageIdentifier, callback: HOTEL_SCRALB_stopEvent});
    }

    if (websocketMultipleCallbackCfg.hasOwnProperty(HOTEL_SCRALB_EVENT_CALLBACK.CARD_LOCKCOMPLETED) && typeof websocketMultipleCallbackCfg.cardLockCompleted === 'function') {
      HOTEL_WS_PTR_onScralbCardLockCompleted.push({pageId: pageIdentifier, callback: websocketMultipleCallbackCfg.cardLockCompleted});
    }
    else {
      HOTEL_WS_PTR_onScralbCardLockCompleted.push({pageId: pageIdentifier, callback: HOTEL_SCRALB_stopEvent});
    }

    if (websocketMultipleCallbackCfg.hasOwnProperty(HOTEL_SCRALB_EVENT_CALLBACK.CARD_UNLOCKCOMPLETED) && typeof websocketMultipleCallbackCfg.cardUnlockCompleted === 'function') {
      HOTEL_WS_PTR_onScralbCardUnlockCompleted.push({pageId: pageIdentifier, callback: websocketMultipleCallbackCfg.cardUnlockCompleted});
    }
    else {
      HOTEL_WS_PTR_onScralbCardUnlockCompleted.push({pageId: pageIdentifier, callback: HOTEL_SCRALB_stopEvent});
    }

    HOTEL_WS_eventCallbackLevelCounter++;
    return true;
  }
  
  return false;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Function to unregister a callback in response to a websocket event
 * @returns true if ok or false if ko
 */
function HOTEL_SCRALB_unregisterWebsocketEventHandler(pageIdentifier) 
{
  var collection = [HOTEL_WS_PTR_onScralbCardPresent,
                    HOTEL_WS_PTR_onScralbCardReadCompleted,
                    HOTEL_WS_PTR_onScralbCardWriteCompleted,
                    HOTEL_WS_PTR_onScralbCardRemoved,
                    HOTEL_WS_PTR_onScralbCardReadCmdReceived,
                    HOTEL_WS_PTR_onScralbCardWriteCmdReceived,
                    HOTEL_WS_PTR_onScralbCardLockCompleted,
                    HOTEL_WS_PTR_onScralbCardUnlockCompleted
                  ];
  var found = false;
  for (var i = 0; i < HOTEL_WS_eventCallbackLevelCounter; i++)
  {
    for (var c = 0; c < collection.length; c++)
    {
      var currElement = collection[c][i];
      if (currElement != undefined && currElement.pageId == pageIdentifier)
      {
        //delete collection[c][i];
        collection[c].splice(i, 1);
        found = true;
      }
    }
  }
  if (found)
  {
    HOTEL_WS_eventCallbackLevelCounter--;
    return true;
  }
  return false;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

function HOTEL_SCRALB_propagateEvent()
{
  return false;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

function HOTEL_SCRALB_stopEvent()
{
  return true;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * HOTEL_manageCommandHTL --- Callback to dominaplus messages
 */
function HOTEL_SCRALB_manageCommandHTL(command, parameters, records)
{
  switch(command)
  {
    case 'htl':
      switch(parameters[0])
      {
        case "ECP":
          console.log('%c' + HOTEL_PREFIX + "Carta presente. Lettura in corso...", 'color: ' + HOTEL_CONSOLE_COLOR);

          if (HOTEL_WS_eventCallbackLevelCounter > 0)
          {
            for (var i = HOTEL_WS_eventCallbackLevelCounter-1; i >= 0; i--)
            {
              var currItem = HOTEL_WS_PTR_onScralbCardPresent[i];
              if (currItem != undefined)
              {
                var currFunction = currItem.callback;
                if (currFunction != undefined)
                {
                  var result = currFunction(parameters[1]);
                  if (result != undefined && result === true)
                  {
                    break;
                  }
                }
              }
            }
          }
        break;

        case "ECR":
          console.log('%c' + HOTEL_PREFIX + "Carta letta correttamente", 'color: ' + HOTEL_CONSOLE_COLOR);

          if (HOTEL_WS_eventCallbackLevelCounter > 0)
          {
            for (var i = HOTEL_WS_eventCallbackLevelCounter-1; i >= 0; i--)
            {
              var currItem = HOTEL_WS_PTR_onScralbCardReadCompleted[i];
              if (currItem != undefined)
              {
                var currFunction = currItem.callback;
                if (currFunction != undefined)
                {
                  var hotelCardInstance = new HOTELCARD_CLASS();
                  if (hotelCardInstance.HOTELCARD_createFromDominaplus(records[0]) == HOTELCARD_RESULT_CODE.RESULT_OK)
                  {
                    var result = currFunction(parameters[1], hotelCardInstance);
                    if (result != undefined && result === true)
                    {
                      break;
                    }
                  }
                }
              }
            }
          }
        break;

        case "ECW":
          if (records[0][0] == "1")
          {
            console.log('%c' + HOTEL_PREFIX + "Carta scritta correttamente", 'color: ' + HOTEL_CONSOLE_COLOR);
          }
          else
          {
            console.log('%c' + HOTEL_PREFIX + "Errore durante la scrittura della card", 'color: ' + HOTEL_CONSOLE_ERROR);
          }

          if (HOTEL_WS_eventCallbackLevelCounter > 0)
          {
            for (var i = HOTEL_WS_eventCallbackLevelCounter-1; i >= 0; i--)
            {
              var currItem = HOTEL_WS_PTR_onScralbCardWriteCompleted[i];
              if (currItem != undefined)
              {
                var currFunction = currItem.callback;
                if (currFunction != undefined)
                {
                  var result = currFunction(parameters[1], (records[0][0] == "1"));
                  if (result != undefined && result === true)
                  {
                    break;
                  }
                }
              }
            }
          }
        break;
        
        case "ERM":
          console.log('%c' + HOTEL_PREFIX + "Carta rimossa", 'color: ' + HOTEL_CONSOLE_COLOR);

          if (HOTEL_WS_eventCallbackLevelCounter > 0)
          {
            for (var i = HOTEL_WS_eventCallbackLevelCounter-1; i >= 0; i--)
            {
              var currItem = HOTEL_WS_PTR_onScralbCardRemoved[i];
              if (currItem != undefined)
              {
                var currFunction = currItem.callback;
                if (currFunction != undefined)
                {
                  var result = currFunction();
                  if (result != undefined && result === true)
                  {
                    break;
                  }
                }
              }
            }
          }
        break;

        case "RC":
          if (records[0] == 'OK')
          {
            console.log('%c' + HOTEL_PREFIX + "Comando ricevuto dallo SCR-ALB. Lettura in corso...", 'color: ' + HOTEL_CONSOLE_COLOR);
          }
          else
          {
            console.log('%c' + HOTEL_PREFIX + "Esito scrittura: " + records[0], 'color: ' + HOTEL_CONSOLE_ERROR);
          }

          if (HOTEL_WS_eventCallbackLevelCounter > 0)
          {
            for (var i = HOTEL_WS_eventCallbackLevelCounter-1; i >= 0; i--)
            {
              var currItem = HOTEL_WS_PTR_onScralbCardReadCmdReceived[i];
              if (currItem != undefined)
              {
                var currFunction = currItem.callback;
                if (currFunction != undefined)
                {
                  var result = currFunction(parameters[1], (records[0] == 'OK'));
                  if (result != undefined && result === true)
                  {
                    break;
                  }
                }
              }
            }
          }
        break;

        case "WC":
          if (records[0] == 'OK')
          {
            console.log('%c' + HOTEL_PREFIX + "Comando ricevuto dallo SCR-ALB. Scrittura in corso...", 'color: ' + HOTEL_CONSOLE_COLOR);
          }
          else
          {
            console.log('%c' + HOTEL_PREFIX + "Esito scrittura: " + records[0], 'color: ' + HOTEL_CONSOLE_ERROR);
          }

          if (HOTEL_WS_eventCallbackLevelCounter > 0)
          {
            for (var i = HOTEL_WS_eventCallbackLevelCounter-1; i >= 0; i--)
            {
              var currItem = HOTEL_WS_PTR_onScralbCardWriteCmdReceived[i];
              if (currItem != undefined)
              {
                var currFunction = currItem.callback;
                if (currFunction != undefined)
                {
                  var result = currFunction(parameters[1], (records[0] == 'OK'));
                  if (result != undefined && result === true)
                  {
                    break;
                  }
                }
              }
            }
          }
        break;

        case "LK":
          if (records[0] == 'OK')
          {
            console.log('%c' + HOTEL_PREFIX + "Lock OK", 'color: ' + HOTEL_CONSOLE_COLOR);
          }
          else
          {
            console.log('%c' + HOTEL_PREFIX + "Esito lock: " + records[0], 'color: ' + HOTEL_CONSOLE_ERROR);
          }

          if (HOTEL_WS_eventCallbackLevelCounter > 0)
          {
            for (var i = HOTEL_WS_eventCallbackLevelCounter-1; i >= 0; i--)
            {
              var currItem = HOTEL_WS_PTR_onScralbCardLockCompleted[i];
              if (currItem != undefined)
              {
                var currFunction = currItem.callback;
                if (currFunction != undefined)
                {
                  var result = currFunction(parameters[1], (records[0] == 'OK'));
                  if (result != undefined && result === true)
                  {
                    break;
                  }
                }
              }
            }
          }
        break;

        case "UK":
          if (records[0] == 'OK')
          {
            console.log('%c' + HOTEL_PREFIX + "Unlock OK", 'color: ' + HOTEL_CONSOLE_COLOR);
          }
          else
          {
            console.log('%c' + HOTEL_PREFIX + "Esito unlock: " + records[0], 'color: ' + HOTEL_CONSOLE_ERROR);
          }

          if (HOTEL_WS_eventCallbackLevelCounter > 0)
          {
            for (var i = HOTEL_WS_eventCallbackLevelCounter-1; i >= 0; i--)
            {
              var currItem = HOTEL_WS_PTR_onScralbCardUnlockCompleted[i];
              if (currItem != undefined)
              {
                var currFunction = currItem.callback;
                if (currFunction != undefined)
                {
                  var result = currFunction(parameters[1], (records[0] == 'OK'));
                  if (result != undefined && result === true)
                  {
                    break;
                  }
                }
              }
            }
          }
        break;
      }
    break;
  }
}


/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ---------------------------------------------------------------------- GENERAL FUNCTIONS ------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Module initialization
 */
function HOTEL_init()
{
  if (HOTEL_module_initialized === false)
  {
    HOTEL_module_initialized = true;

    console.log('%c' + HOTEL_PREFIX + "HOTEL_init", 'color: ' + HOTEL_CONSOLE_COLOR);

    if (HOTEL_SCRALB_canOpenLocally()) {
      HOTEL_currentScralbStatus = HOTEL_SCRALB_STATES.HOTEL_SCRALB_STATE_UNKNOWN;

      HOTEL_SCRALB_webSocketInstance = new WEBSOCKET_CLASS("ws://127.0.0.1:14001", "SCR-ALB connection");
      HOTEL_SCRALB_webSocketInstance.WEBSOCKET_setConnectionOpenCallback(HOTEL_SCRALB_onConnectionOpen);
      HOTEL_SCRALB_webSocketInstance.WEBSOCKET_setMessageArrivedCallback(DOMINAPLUS_MANAGER_onMessageArrived);
      HOTEL_SCRALB_webSocketInstance.WEBSOCKET_setConnectionErrorCallback(HOTEL_SCRALB_onConnectionError);
      HOTEL_SCRALB_webSocketInstance.WEBSOCKET_setConnectionCloseCallback(HOTEL_SCRALB_onConnectionClose);
      //HOTEL_SCRALB_webSocketInstance.WEBSOCKET_setConnectionTimeoutCallback(ptr_onConnectionTimeout, tim_connectionTimeoutInSeconds * 1000);
      //HOTEL_SCRALB_webSocketInstance.WEBSOCKET_setSilenceDetectedCallback(DOMINAPLUS_MANAGER_onSilenceDetected, 60000);
      HOTEL_SCRALB_webSocketInstance.WEBSOCKET_connect();
    }
    else {
      HOTEL_currentScralbStatus = HOTEL_SCRALB_STATES.HOTEL_SCRALB_STATE_LOCAL_NOT_ALLOWED;
    }

    DOMINAPLUS_MANAGER_registerWebsocketEventHandler("HOTEL_SCRALB_manageCommandHTL", HOTEL_SCRALB_manageCommandHTL);
  }
  else
  {
    console.log('%c' + HOTEL_PREFIX + "HOTEL_init already initialized", 'color: ' + HOTEL_CONSOLE_ERROR);
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Set current room
 */
function HOTEL_setRoom(areaId)
{
  HOTEL_currentRoom = areaId;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Get current room
 */
function HOTEL_getRoom()
{
  return HOTEL_currentRoom;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Set current user
 */
function HOTEL_setUserID(userId)
{
  HOTEL_currentUserID = userId;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Get current user
 */
function HOTEL_getUserID()
{
  return HOTEL_currentUserID;
}
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Set current username
 */
function HOTEL_setUsername(username)
{
  HOTEL_currentUsername = username;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Get current username
 */
function HOTEL_getUsername()
{
  return HOTEL_currentUsername;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Set current operation
 */
function HOTEL_setOperation(operation)
{
  switch (operation)
  {
    case HOTEL_OPERATIONS.HOTEL_OPERATION_NONE     :
    case HOTEL_OPERATIONS.HOTEL_OPERATION_CHECKIN  :
    case HOTEL_OPERATIONS.HOTEL_OPERATION_CHECKOUT :
    case HOTEL_OPERATIONS.HOTEL_OPERATION_STAFF    :
    case HOTEL_OPERATIONS.HOTEL_OPERATION_DETAILS  :
      HOTEL_selectedOperation = operation;
      return true;

    default:
      HOTEL_selectedOperation = -1;
  }

  return false;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Get current operation
 */
function HOTEL_getSelectedOperation()
{
  return HOTEL_selectedOperation;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Managing HOTEL callbacks
 * @param {string}   type_callback - type of the callback to be called
 * @param {function} ptr_callback  - callback function
 * @version VER282 - WANDA + LORENZO
 */
function HOTEL_setEventCallback(type_callback, ptr_callback) 
{
  switch(type_callback)
  {
    case 'scralbStatusChanged':
      HOTEL_PTR_scralbStatusChanged = ptr_callback;
      break;
  }
}


/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------ CARD CLASS ------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

var HOTELCARD_RESULT_CODE = {
                              RESULT_OK : 0,
                              ERROR_GENERIC : 1,
                              ERROR_PARSE_DOMINAPLUS : 2
                            };

var HOTELCARD_prototype = {

  // VARIABLES
  HOTELCARD_card : null,
  
  /**
   * CARD initialization
   */
  HOTELCARD_initStructure : function()
  {
    this.HOTELCARD_card = {};

    this.HOTELCARD_card.UID = "";  // UID
    this.HOTELCARD_card.plant_code = 0;  // Codice impianto
    this.HOTELCARD_card.subplant_code = 0; // Sub-codice impianto
    this.HOTELCARD_card.zone_floor = 0;  // Piano/zona
    this.HOTELCARD_card.room_nr = 0; // Numero stanza
    this.HOTELCARD_card.guest_number = 0;  // Codice cliente
    this.HOTELCARD_card.subplant_bitmap = 0; // Subcodice impianto (bitmap)
    this.HOTELCARD_card.type = 0;  // Tipo CARD
    this.HOTELCARD_card.date_begin_dd = 0xFF;  // Data inizio (giorno)
    this.HOTELCARD_card.date_begin_mm = 0xFF;  // Data inizio (mese)
    this.HOTELCARD_card.date_begin_yy = 0xFF;  // Data inizio (anno)
    this.HOTELCARD_card.date_end_hh = 0xFF;  // Data fine (ora)
    this.HOTELCARD_card.date_end_dd = 0xFF;  // Data fine (giorno)
    this.HOTELCARD_card.date_end_mm = 0xFF;  // Data fine (mese)
    this.HOTELCARD_card.date_end_yy = 0xFF;  // Data fine (anno)
    this.HOTELCARD_card.zone_floor_bitmap = 0x01;  // Bitmask delle zone (piani) per staff
    this.HOTELCARD_card.common_area_bitmap = 0; // Bitmap delle aree comuni per clienti (1-64)
    this.HOTELCARD_card.pay_area_1_credit = 0; // Crediti area a pagamento 1
    this.HOTELCARD_card.pay_area_1_date_end_dd = 0; // Giorno fine area a pagamento 1
    this.HOTELCARD_card.pay_area_1_date_end_mm = 0; // Mese fine area a pagamento 1
    this.HOTELCARD_card.pay_area_1_date_end_yy = 0; // Anno fine area a pagamento 1
    this.HOTELCARD_card.pay_area_2_credit = 0; // Crediti area a pagamento 2
    this.HOTELCARD_card.pay_area_2_date_end_dd = 0; // Giorno fine area a pagamento 2
    this.HOTELCARD_card.pay_area_2_date_end_mm = 0; // Mese fine area a pagamento 2
    this.HOTELCARD_card.pay_area_2_date_end_yy = 0; // Anno fine area a pagamento 2
    this.HOTELCARD_card.pay_area_3_credit = 0; // Crediti area a pagamento 3
    this.HOTELCARD_card.pay_area_3_date_end_dd = 0; // Giorno fine area a pagamento 3
    this.HOTELCARD_card.pay_area_3_date_end_mm = 0; // Mese fine area a pagamento 3
    this.HOTELCARD_card.pay_area_3_date_end_yy = 0; // Anno fine area a pagamento 3
    this.HOTELCARD_card.pay_area_4_credit = 0; // Crediti area a pagamento 4
    this.HOTELCARD_card.pay_area_4_date_end_dd = 0; // Giorno fine area a pagamento 4
    this.HOTELCARD_card.pay_area_4_date_end_mm = 0; // Mese fine area a pagamento 4
    this.HOTELCARD_card.pay_area_4_date_end_yy = 0; // Anno fine area a pagamento 4
    this.HOTELCARD_card.pay_area_5_credit = 0; // Crediti area a pagamento 5
    this.HOTELCARD_card.pay_area_5_date_end_dd = 0; // Giorno fine area a pagamento 5
    this.HOTELCARD_card.pay_area_5_date_end_mm = 0; // Mese fine area a pagamento 5
    this.HOTELCARD_card.pay_area_5_date_end_yy = 0; // Anno fine area a pagamento 5
    this.HOTELCARD_card.pay_area_6_credit = 0; // Crediti area a pagamento 6
    this.HOTELCARD_card.pay_area_6_date_end_dd = 0; // Giorno fine area a pagamento 6
    this.HOTELCARD_card.pay_area_6_date_end_mm = 0; // Mese fine area a pagamento 6
    this.HOTELCARD_card.pay_area_6_date_end_yy = 0; // Anno fine area a pagamento 6
    this.HOTELCARD_card.pay_area_7_credit = 0; // Crediti area a pagamento 7
    this.HOTELCARD_card.pay_area_7_date_end_dd = 0; // Giorno fine area a pagamento 7
    this.HOTELCARD_card.pay_area_7_date_end_mm = 0; // Mese fine area a pagamento 7
    this.HOTELCARD_card.pay_area_7_date_end_yy = 0; // Anno fine area a pagamento 7
    this.HOTELCARD_card.pay_area_8_credit = 0; // Crediti area a pagamento 8
    this.HOTELCARD_card.pay_area_8_date_end_dd = 0; // Giorno fine area a pagamento 8
    this.HOTELCARD_card.pay_area_8_date_end_mm = 0; // Mese fine area a pagamento 8
    this.HOTELCARD_card.pay_area_8_date_end_yy = 0; // Anno fine area a pagamento 8
  },

  /* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
  /* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

  /**
   * CARD parse from dominaplus fields record
   * @param {string} fields
   */
  HOTELCARD_createFromDominaplus : function(fields)
  {
    this.HOTELCARD_initStructure();

    if (fields.length >= 28)
    {
      this.HOTELCARD_card.UID = fields[0];  // UID
      this.HOTELCARD_card.plant_code = fields[1];  // Codice impianto
      this.HOTELCARD_card.subplant_code = fields[2]; // Sub-codice impianto
      this.HOTELCARD_card.zone_floor = fields[3];  // Piano/zona
      this.HOTELCARD_card.room_nr = fields[4]; // Numero stanza
      this.HOTELCARD_card.guest_number = fields[5];  // Codice cliente
      this.HOTELCARD_card.subplant_bitmap = fields[6]; // Subcodice impianto (bitmap)
      this.HOTELCARD_card.type = fields[7];  // Tipo CARD
      if (fields[8] != 'null')
      {
        this.HOTELCARD_card.date_begin_dd = fields[8][0] + fields[8][1];  // Data inizio (giorno)
        this.HOTELCARD_card.date_begin_mm = fields[8][3] + fields[8][4];  // Data inizio (mese)
        this.HOTELCARD_card.date_begin_yy = fields[8][6] + fields[8][7] + fields[8][8] + fields[8][9];  // Data inizio (anno)
      }
      else
      {
        this.HOTELCARD_card.date_begin_dd = 0xFF;  // Data inizio (giorno)
        this.HOTELCARD_card.date_begin_mm = 0xFF;  // Data inizio (mese)
        this.HOTELCARD_card.date_begin_yy = 0xFF;  // Data inizio (anno)
      }
      if (fields[9] != 'null')
      {
        this.HOTELCARD_card.date_end_hh = fields[9][0] + fields[9][1];  // Data fine (ora)
        this.HOTELCARD_card.date_end_dd = fields[9][3] + fields[9][4];  // Data fine (giorno)
        this.HOTELCARD_card.date_end_mm = fields[9][6] + fields[9][7];  // Data fine (mese)
        this.HOTELCARD_card.date_end_yy = fields[9][9] + fields[9][10] + fields[9][11] + fields[9][12];  // Data fine (anno)
      }
      else
      {
        this.HOTELCARD_card.date_end_hh = 0xFF;  // Data fine (ora)
        this.HOTELCARD_card.date_end_dd = 0xFF;  // Data fine (giorno)
        this.HOTELCARD_card.date_end_mm = 0xFF;  // Data fine (mese)
        this.HOTELCARD_card.date_end_yy = 0xFF;  // Data fine (anno)
      }
      this.HOTELCARD_card.zone_floor_bitmap = fields[10];  // Bitmask delle zone (piani) per staff
      this.HOTELCARD_card.common_area_bitmap = fields[11]; // Bitmap delle aree comuni per clienti (1-64)
      this.HOTELCARD_card.pay_area_1_credit = fields[12]; // Crediti area a pagamento 1
      if (fields[13] != 'null')
      {
        this.HOTELCARD_card.pay_area_1_date_end_dd = fields[13][0] + fields[13][1]; // Giorno fine area a pagamento 1
        this.HOTELCARD_card.pay_area_1_date_end_mm = fields[13][3] + fields[13][4]; // Mese fine area a pagamento 1
        this.HOTELCARD_card.pay_area_1_date_end_yy = fields[13][6] + fields[13][7] + fields[13][8] + fields[13][9]; // Anno fine area a pagamento 1
      }
      else
      {
        this.HOTELCARD_card.pay_area_1_date_end_dd = 0; // Giorno fine area a pagamento 1
        this.HOTELCARD_card.pay_area_1_date_end_mm = 0; // Mese fine area a pagamento 1
        this.HOTELCARD_card.pay_area_1_date_end_yy = 0; // Anno fine area a pagamento 1
      }
      this.HOTELCARD_card.pay_area_2_credit = fields[14]; // Crediti area a pagamento 2
      if (fields[15] != 'null')
      {
        this.HOTELCARD_card.pay_area_2_date_end_dd = fields[15][0] + fields[15][1]; // Giorno fine area a pagamento 2
        this.HOTELCARD_card.pay_area_2_date_end_mm = fields[15][3] + fields[15][4]; // Mese fine area a pagamento 2
        this.HOTELCARD_card.pay_area_2_date_end_yy = fields[15][6] + fields[15][7] + fields[15][8] + fields[15][9]; // Anno fine area a pagamento 2
      }
      else
      {
        this.HOTELCARD_card.pay_area_2_date_end_dd = 0; // Giorno fine area a pagamento 2
        this.HOTELCARD_card.pay_area_2_date_end_mm = 0; // Mese fine area a pagamento 2
        this.HOTELCARD_card.pay_area_2_date_end_yy = 0; // Anno fine area a pagamento 2
      }
      this.HOTELCARD_card.pay_area_3_credit = fields[16]; // Crediti area a pagamento 3
      if (fields[17] != 'null')
      {
        this.HOTELCARD_card.pay_area_3_date_end_dd = fields[17][0] + fields[17][1]; // Giorno fine area a pagamento 3
        this.HOTELCARD_card.pay_area_3_date_end_mm = fields[17][3] + fields[17][4]; // Mese fine area a pagamento 3
        this.HOTELCARD_card.pay_area_3_date_end_yy = fields[17][6] + fields[17][7] + fields[17][8] + fields[17][9]; // Anno fine area a pagamento 3
      }
      else
      {
        this.HOTELCARD_card.pay_area_3_date_end_dd = 0; // Giorno fine area a pagamento 3
        this.HOTELCARD_card.pay_area_3_date_end_mm = 0; // Mese fine area a pagamento 3
        this.HOTELCARD_card.pay_area_3_date_end_yy = 0; // Anno fine area a pagamento 3
      }
      this.HOTELCARD_card.pay_area_4_credit = fields[18]; // Crediti area a pagamento 4
      if (fields[19] != 'null')
      {
        this.HOTELCARD_card.pay_area_4_date_end_dd = fields[19][0] + fields[19][1]; // Giorno fine area a pagamento 4
        this.HOTELCARD_card.pay_area_4_date_end_mm = fields[19][3] + fields[19][4]; // Mese fine area a pagamento 4
        this.HOTELCARD_card.pay_area_4_date_end_yy = fields[19][6] + fields[19][7] + fields[19][8] + fields[19][9]; // Anno fine area a pagamento 4
      }
      else
      {
        this.HOTELCARD_card.pay_area_4_date_end_dd = 0; // Giorno fine area a pagamento 4
        this.HOTELCARD_card.pay_area_4_date_end_mm = 0; // Mese fine area a pagamento 4
        this.HOTELCARD_card.pay_area_4_date_end_yy = 0; // Anno fine area a pagamento 4
      }
      this.HOTELCARD_card.pay_area_5_credit = fields[20]; // Crediti area a pagamento 5
      if (fields[21] != 'null')
      {
        this.HOTELCARD_card.pay_area_5_date_end_dd = fields[21][0] + fields[21][1]; // Giorno fine area a pagamento 5
        this.HOTELCARD_card.pay_area_5_date_end_mm = fields[21][3] + fields[21][4]; // Mese fine area a pagamento 5
        this.HOTELCARD_card.pay_area_5_date_end_yy = fields[21][6] + fields[21][7] + fields[21][8] + fields[21][9]; // Anno fine area a pagamento 5
      }
      else
      {
        this.HOTELCARD_card.pay_area_5_date_end_dd = 0; // Giorno fine area a pagamento 5
        this.HOTELCARD_card.pay_area_5_date_end_mm = 0; // Mese fine area a pagamento 5
        this.HOTELCARD_card.pay_area_5_date_end_yy = 0; // Anno fine area a pagamento 5
      }
      this.HOTELCARD_card.pay_area_6_credit = fields[22]; // Crediti area a pagamento 6
      if (fields[23] != 'null')
      {
        this.HOTELCARD_card.pay_area_6_date_end_dd = fields[23][0] + fields[23][1]; // Giorno fine area a pagamento 6
        this.HOTELCARD_card.pay_area_6_date_end_mm = fields[23][3] + fields[23][4]; // Mese fine area a pagamento 6
        this.HOTELCARD_card.pay_area_6_date_end_yy = fields[23][6] + fields[23][7] + fields[23][8] + fields[23][9]; // Anno fine area a pagamento 6
      }
      else
      {
        this.HOTELCARD_card.pay_area_6_date_end_dd = 0; // Giorno fine area a pagamento 6
        this.HOTELCARD_card.pay_area_6_date_end_mm = 0; // Mese fine area a pagamento 6
        this.HOTELCARD_card.pay_area_6_date_end_yy = 0; // Anno fine area a pagamento 6
      }
      this.HOTELCARD_card.pay_area_7_credit = fields[24]; // Crediti area a pagamento 7
      if (fields[25] != 'null')
      {
        this.HOTELCARD_card.pay_area_7_date_end_dd = fields[25][0] + fields[25][1]; // Giorno fine area a pagamento 7
        this.HOTELCARD_card.pay_area_7_date_end_mm = fields[25][3] + fields[25][4]; // Mese fine area a pagamento 7
        this.HOTELCARD_card.pay_area_7_date_end_yy = fields[25][6] + fields[25][7] + fields[25][8] + fields[25][9]; // Anno fine area a pagamento 7
      }
      else
      {
        this.HOTELCARD_card.pay_area_7_date_end_dd = 0; // Giorno fine area a pagamento 7
        this.HOTELCARD_card.pay_area_7_date_end_mm = 0; // Mese fine area a pagamento 7
        this.HOTELCARD_card.pay_area_7_date_end_yy = 0; // Anno fine area a pagamento 7
      }
      this.HOTELCARD_card.pay_area_8_credit = fields[26]; // Crediti area a pagamento 8
      if (fields[27] != 'null')
      {
        this.HOTELCARD_card.pay_area_8_date_end_dd = fields[27][0] + fields[27][1]; // Giorno fine area a pagamento 8
        this.HOTELCARD_card.pay_area_8_date_end_mm = fields[27][3] + fields[27][4]; // Mese fine area a pagamento 8
        this.HOTELCARD_card.pay_area_8_date_end_yy = fields[27][6] + fields[27][7] + fields[27][8] + fields[27][9]; // Anno fine area a pagamento 8
      }
      else
      {
        this.HOTELCARD_card.pay_area_8_date_end_dd = 0; // Giorno fine area a pagamento 8
        this.HOTELCARD_card.pay_area_8_date_end_mm = 0; // Mese fine area a pagamento 8
        this.HOTELCARD_card.pay_area_8_date_end_yy = 0; // Anno fine area a pagamento 8
      }

      return HOTELCARD_RESULT_CODE.RESULT_OK;
    }

    return HOTELCARD_RESULT_CODE.ERROR_PARSE_DOMINAPLUS;
  },

  /* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
  /* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

  /**
   * CARD structure to dominaplus record fields
   */
  HOTELCARD_toDominaplusRecordFields : function()
  {
    var result = "";
    
    result += this.HOTELCARD_card.plant_code.toString(16).padStart(4, '0') + ',';
    result += this.HOTELCARD_card.subplant_code + ',';
    result += this.HOTELCARD_card.zone_floor + ',';
    result += this.HOTELCARD_card.room_nr + ',';
    result += this.HOTELCARD_card.guest_number.toString(16).padStart(4, '0') + ',';
    result += this.HOTELCARD_card.subplant_bitmap + ',';
    result += this.HOTELCARD_card.type + ',';
    if (this.HOTELCARD_card.date_begin_dd == 0xFF || this.HOTELCARD_card.date_begin_mm == 0xFF || this.HOTELCARD_card.date_begin_yy == 0xFF)
    {
      result += "null";
      result += ',';
    }
    else
    {
      result += this.HOTELCARD_card.date_begin_dd + '-' + this.HOTELCARD_card.date_begin_mm + '-' + this.HOTELCARD_card.date_begin_yy;
      result += ',';
    }
    if (this.HOTELCARD_card.date_end_hh == 0xFF || this.HOTELCARD_card.date_end_dd == 0xFF || this.HOTELCARD_card.date_end_mm == 0xFF || this.HOTELCARD_card.date_end_yy == 0xFF)
    {
      result += "null";
      result += ',';
    }
    else
    {
      result += this.HOTELCARD_card.date_end_hh + ' ' + this.HOTELCARD_card.date_end_dd + '-' + this.HOTELCARD_card.date_end_mm + '-' + this.HOTELCARD_card.date_end_yy;
      result += ',';
    }
    result += this.HOTELCARD_card.zone_floor_bitmap + ',';
    result += this.HOTELCARD_card.common_area_bitmap + ',';
    result += this.HOTELCARD_card.pay_area_1_credit + ',';
    if (this.HOTELCARD_card.pay_area_1_date_end_dd == 0 || this.HOTELCARD_card.pay_area_1_date_end_mm == 0 || this.HOTELCARD_card.pay_area_1_date_end_yy == 0)
    {
      result += "null";
      result += ',';
    }
    else
    {
      result += this.HOTELCARD_card.pay_area_1_date_end_dd + '-' + this.HOTELCARD_card.pay_area_1_date_end_mm + '-' + this.HOTELCARD_card.pay_area_1_date_end_yy;
      result += ',';
    }
    result += this.HOTELCARD_card.pay_area_2_credit + ',';
    if (this.HOTELCARD_card.pay_area_2_date_end_dd == 0 || this.HOTELCARD_card.pay_area_2_date_end_mm == 0 || this.HOTELCARD_card.pay_area_2_date_end_yy == 0)
    {
      result += "null";
      result += ',';
    }
    else
    {
      result += this.HOTELCARD_card.pay_area_2_date_end_dd + '-' + this.HOTELCARD_card.pay_area_2_date_end_mm + '-' + this.HOTELCARD_card.pay_area_2_date_end_yy;
      result += ',';
    }
    result += this.HOTELCARD_card.pay_area_3_credit + ',';
    if (this.HOTELCARD_card.pay_area_3_date_end_dd == 0 || this.HOTELCARD_card.pay_area_3_date_end_mm == 0 || this.HOTELCARD_card.pay_area_3_date_end_yy == 0)
    {
      result += "null";
      result += ',';
    }
    else
    {
      result += this.HOTELCARD_card.pay_area_3_date_end_dd + '-' + this.HOTELCARD_card.pay_area_3_date_end_mm + '-' + this.HOTELCARD_card.pay_area_3_date_end_yy;
      result += ',';
    }
    result += this.HOTELCARD_card.pay_area_4_credit + ',';
    if (this.HOTELCARD_card.pay_area_4_date_end_dd == 0 || this.HOTELCARD_card.pay_area_4_date_end_mm == 0 || this.HOTELCARD_card.pay_area_4_date_end_yy == 0)
    {
      result += "null";
      result += ',';
    }
    else
    {
      result += this.HOTELCARD_card.pay_area_4_date_end_dd + '-' + this.HOTELCARD_card.pay_area_4_date_end_mm + '-' + this.HOTELCARD_card.pay_area_4_date_end_yy;
      result += ',';
    }
    result += this.HOTELCARD_card.pay_area_5_credit + ',';
    if (this.HOTELCARD_card.pay_area_5_date_end_dd == 0 || this.HOTELCARD_card.pay_area_5_date_end_mm == 0 || this.HOTELCARD_card.pay_area_5_date_end_yy == 0)
    {
      result += "null";
      result += ',';
    }
    else
    {
      result += this.HOTELCARD_card.pay_area_5_date_end_dd + '-' + this.HOTELCARD_card.pay_area_5_date_end_mm + '-' + this.HOTELCARD_card.pay_area_5_date_end_yy;
      result += ',';
    }
    result += this.HOTELCARD_card.pay_area_6_credit + ',';
    if (this.HOTELCARD_card.pay_area_6_date_end_dd == 0 || this.HOTELCARD_card.pay_area_6_date_end_mm == 0 || this.HOTELCARD_card.pay_area_6_date_end_yy == 0)
    {
      result += "null";
      result += ',';
    }
    else
    {
      result += this.HOTELCARD_card.pay_area_6_date_end_dd + '-' + this.HOTELCARD_card.pay_area_6_date_end_mm + '-' + this.HOTELCARD_card.pay_area_6_date_end_yy;
      result += ',';
    }
    result += this.HOTELCARD_card.pay_area_7_credit + ',';
    if (this.HOTELCARD_card.pay_area_7_date_end_dd == 0 || this.HOTELCARD_card.pay_area_7_date_end_mm == 0 || this.HOTELCARD_card.pay_area_7_date_end_yy == 0)
    {
      result += "null";
      result += ',';
    }
    else
    {
      result += this.HOTELCARD_card.pay_area_7_date_end_dd + '-' + this.HOTELCARD_card.pay_area_7_date_end_mm + '-' + this.HOTELCARD_card.pay_area_7_date_end_yy;
      result += ',';
    }
    result += this.HOTELCARD_card.pay_area_8_credit + ',';
    if (this.HOTELCARD_card.pay_area_8_date_end_dd == 0 || this.HOTELCARD_card.pay_area_8_date_end_mm == 0 || this.HOTELCARD_card.pay_area_8_date_end_yy == 0)
    {
      result += "null";
    }
    else
    {
      result += this.HOTELCARD_card.pay_area_8_date_end_dd + '-' + this.HOTELCARD_card.pay_area_8_date_end_mm + '-' + this.HOTELCARD_card.pay_area_8_date_end_yy;
    }
    
    return result;
  },

  HOTELCARD_getUID : function()
  {
    return this.HOTELCARD_card.UID;
  },
  HOTELCARD_getCardType : function()
  {
    return this.HOTELCARD_card.type;
  },
  HOTELCARD_getPlantCode : function()
  {
    return this.HOTELCARD_card.plant_code;
  },
  HOTELCARD_getRoomNr : function()
  {
    return this.HOTELCARD_card.room_nr;
  },

  HOTELCARD_setPlantCode : function(value)
  {
    this.HOTELCARD_card.plant_code = value;  // Codice impianto
  },
  HOTELCARD_setSubplantCode : function(value)
  {
    this.HOTELCARD_card.subplant_code = value; // Sub-codice impianto
  },
  HOTELCARD_setZoneFloor : function(value)
  {
    this.HOTELCARD_card.zone_floor = value;  // Piano/zona
  },
  HOTELCARD_setRoomNr : function(value)
  {
    this.HOTELCARD_card.room_nr = value; // Numero stanza
  },
  HOTELCARD_setGuestNumber : function(value)
  {
    this.HOTELCARD_card.guest_number = value;  // Codice cliente
  },
  HOTELCARD_setSubplantBitmap : function(value)
  {
    this.HOTELCARD_card.subplant_bitmap = value; // Subcodice impianto (bitmap)
  },
  HOTELCARD_setCardType : function(value)
  {
    this.HOTELCARD_card.type = value;  // Tipo CARD
  },
  HOTELCARD_setDateBegin : function(dd, mm, yy)
  {
    this.HOTELCARD_card.date_begin_dd = dd;  // Data inizio (giorno)
    this.HOTELCARD_card.date_begin_mm = mm;  // Data inizio (mese)
    this.HOTELCARD_card.date_begin_yy = yy;  // Data inizio (anno)
  },
  HOTELCARD_setDateEnd : function(hh, dd, mm, yy)
  {
    this.HOTELCARD_card.date_end_hh = hh;  // Data fine (ora)
    this.HOTELCARD_card.date_end_dd = dd;  // Data fine (giorno)
    this.HOTELCARD_card.date_end_mm = mm;  // Data fine (mese)
    this.HOTELCARD_card.date_end_yy = yy;  // Data fine (anno)
  },
  HOTELCARD_setZoneFloorBitmap : function(value)
  {
    this.HOTELCARD_card.zone_floor_bitmap = value;  // Bitmask delle zone (piani) per staff
  },
  HOTELCARD_setCommonAreaBitmap : function(value)
  {
    this.HOTELCARD_card.common_area_bitmap = value; // Bitmap delle aree comuni per clienti (1-64)
  },
  HOTELCARD_setPayArea1 : function(credit, date_end_dd, date_end_mm, date_end_yy)
  {
    this.HOTELCARD_card.pay_area_1_credit = credit; // Crediti area a pagamento 1
    this.HOTELCARD_card.pay_area_1_date_end_dd = date_end_dd; // Giorno fine area a pagamento 1
    this.HOTELCARD_card.pay_area_1_date_end_mm = date_end_mm; // Mese fine area a pagamento 1
    this.HOTELCARD_card.pay_area_1_date_end_yy = date_end_yy; // Anno fine area a pagamento 1
  },
  HOTELCARD_setPayArea2 : function(credit, date_end_dd, date_end_mm, date_end_yy)
  {
    this.HOTELCARD_card.pay_area_2_credit = credit; // Crediti area a pagamento 2
    this.HOTELCARD_card.pay_area_2_date_end_dd = date_end_dd; // Giorno fine area a pagamento 2
    this.HOTELCARD_card.pay_area_2_date_end_mm = date_end_mm; // Mese fine area a pagamento 2
    this.HOTELCARD_card.pay_area_2_date_end_yy = date_end_yy; // Anno fine area a pagamento 2
  },
  HOTELCARD_setPayArea3 : function(credit, date_end_dd, date_end_mm, date_end_yy)
  {
    this.HOTELCARD_card.pay_area_3_credit = credit; // Crediti area a pagamento 3
    this.HOTELCARD_card.pay_area_3_date_end_dd = date_end_dd; // Giorno fine area a pagamento 3
    this.HOTELCARD_card.pay_area_3_date_end_mm = date_end_mm; // Mese fine area a pagamento 3
    this.HOTELCARD_card.pay_area_3_date_end_yy = date_end_yy; // Anno fine area a pagamento 3
  },
  HOTELCARD_setPayArea4 : function(credit, date_end_dd, date_end_mm, date_end_yy)
  {
    this.HOTELCARD_card.pay_area_4_credit = credit; // Crediti area a pagamento 4
    this.HOTELCARD_card.pay_area_4_date_end_dd = date_end_dd; // Giorno fine area a pagamento 4
    this.HOTELCARD_card.pay_area_4_date_end_mm = date_end_mm; // Mese fine area a pagamento 4
    this.HOTELCARD_card.pay_area_4_date_end_yy = date_end_yy; // Anno fine area a pagamento 4
  },
  HOTELCARD_setPayArea5 : function(credit, date_end_dd, date_end_mm, date_end_yy)
  {
    this.HOTELCARD_card.pay_area_5_credit = credit; // Crediti area a pagamento 5
    this.HOTELCARD_card.pay_area_5_date_end_dd = date_end_dd; // Giorno fine area a pagamento 5
    this.HOTELCARD_card.pay_area_5_date_end_mm = date_end_mm; // Mese fine area a pagamento 5
    this.HOTELCARD_card.pay_area_5_date_end_yy = date_end_yy; // Anno fine area a pagamento 5
  },
  HOTELCARD_setPayArea6 : function(credit, date_end_dd, date_end_mm, date_end_yy)
  {
    this.HOTELCARD_card.pay_area_6_credit = credit; // Crediti area a pagamento 6
    this.HOTELCARD_card.pay_area_6_date_end_dd = date_end_dd; // Giorno fine area a pagamento 6
    this.HOTELCARD_card.pay_area_6_date_end_mm = date_end_mm; // Mese fine area a pagamento 6
    this.HOTELCARD_card.pay_area_6_date_end_yy = date_end_yy; // Anno fine area a pagamento 6
  },
  HOTELCARD_setPayArea7 : function(credit, date_end_dd, date_end_mm, date_end_yy)
  {
    this.HOTELCARD_card.pay_area_7_credit = credit; // Crediti area a pagamento 7
    this.HOTELCARD_card.pay_area_7_date_end_dd = date_end_dd; // Giorno fine area a pagamento 7
    this.HOTELCARD_card.pay_area_7_date_end_mm = date_end_mm; // Mese fine area a pagamento 7
    this.HOTELCARD_card.pay_area_7_date_end_yy = date_end_yy; // Anno fine area a pagamento 7
  },
  HOTELCARD_setPayArea8 : function(credit, date_end_dd, date_end_mm, date_end_yy)
  {
    this.HOTELCARD_card.pay_area_8_credit = credit; // Crediti area a pagamento 8
    this.HOTELCARD_card.pay_area_8_date_end_dd = date_end_dd; // Giorno fine area a pagamento 8
    this.HOTELCARD_card.pay_area_8_date_end_mm = date_end_mm; // Mese fine area a pagamento 8
    this.HOTELCARD_card.pay_area_8_date_end_yy = date_end_yy; // Anno fine area a pagamento 8
  }
};

function HOTELCARD_CLASS()
{
  this.HOTELCARD_initStructure();
}

HOTELCARD_CLASS.prototype = Object.create(HOTELCARD_prototype);

var AVESDK_fullLoaded = true;
