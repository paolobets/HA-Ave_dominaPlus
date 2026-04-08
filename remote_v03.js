window.isRgbwPageOpened 		  = false; // VER131 STEFANO
window.isOnThermoAdvancedPage = false;

// VARIABLES
// CONSOLE
var WEBAPP_PREFIX 			 = '[WEBAPP]: ';
var WEBAPP_CONSOLE_COLOR = '#a6a6a6'; // Gray
var WEBAPP_CONSOLE_ERROR = '#ff0000'; // Red

// CONST
var WEBAPP_resizeRatio 				= 0.887;
var WEBAPP_iconPositionAdjust = 1.07;

/* Variables used in consumi.htm */
var WEBAPP_maxConsumptionScale   = null;
var WEBAPP_consumptionAlertValue = null;
/* ----------------------------- */

var WEBAPP_actualDevice;
var WEBAPP_actualScenario;

var WEBAPP_cloudDateTimeConfigurationValue = null; // VER229 WANDA

var WEBAPP_singleSessionRandomNumber = Math.random();

// FLAGS
var WEBAPP_showEnergy 		   							 = true; // VER232 WANDA
var WEBAPP_showHistoryAccess 							 = true; // VER225 LORENZO
var WEBAPP_debugFlag 				 							 = true;
var WEBAPP_imgPaused   			         			 = false;
var WEBAPP_loadedClassicStart 						 = false;
var WEBAPP_isCustomIconInPopupEnabled 		 = true;
var WEBAPP_isAstronomicEnabled 						 = false; // VER104
var WEBAPP_callingSystem 									 = false; // VER127 STEFANO
var WEBAPP_windowMessageArrived 					 = false; // VER167 WANDA
var WEBAPP_scrollAreaMove 								 = false;
var WEBAPP_clickedOnConsumptionInBox1 		 = false; // VER211 WANDA
var WEBAPP_clickedOnEnergyChartsInBox2Box3 = false;
var WEBAPP_canShowNewFunctions             = false; // VER296 WANDA

var WEBAPP_imgSerialNumber     = 0; // Serial number of current image
var WEBAPP_economizzatore      = 0;
var WEBAPP_ecoType  			     = 0; // VER211 WANDA
var WEBAPP_fadeInSpeed         = 0; // VER82
var WEBAPP_fadeOutSpeed        = 0; // VER82
var WEBAPP_statusSTO       		 = 0; // VER78
var WEBAPP_numberOfThermostats = 0; // VER217 WANDA
var WEBAPP_numberOfEnergy      = 0; // VER272 WANDA

// STRINGS
var WEBAPP_backTitle             = '';
var WEBAPP_backButton            = '';
var WEBAPP_keypadMode 			     = '';
var WEBAPP_keypadCallback 	     = undefined; //VER254 LORENZO
var WEBAPP_antitheftStatusString = '';
var WEBAPP_antitheftActionString = '';

var WEBAPP_STOCommandToReachNextSTOStatus = 'STO'; // VER78

// LOGS 
/* VER75 */
var WEBAPP_logVMC 		   = false;
var WEBAPP_logPagination = false;
var WEBAPP_logAlarm      = false;
/* ----- */

// ARRAYS
var WEBAPP_propagationList 			= new Array(); // VER76
var WEBAPP_CS1_CS2_CS3_List 		= new Array(); // VER76
var WEBAPP_imgDownloadCompleted = new Array(); // References to img objects which have finished downloading
var WEBAPP_daysArray 						= sDays.split(',');
var WEBAPP_daysLongArray        = sDaysLong.split(','); // VER 254
var WEBAPP_monthsArray 					= sMonths.split(',');  
var WEBAPP_monthsLongArray 			= sMonthsLong.split(','); 

// TIMERS
var WEBAPP_timer1;
var WEBAPP_timer2;
var WEBAPP_buttonTimer;
var WEBAPP_consumptionTimer;
var WEBAPP_textTimer;

var WEBAPP_buttonPressTimer 						= 300;
var WEBAPP_updateStatusTimer 						= 1000;
var WEBAPP_checkIfSessionIsAliveTimeout = 5000;

// COUNTERS
var WEBAPP_buttonCounter 					 = 0;
var WEBAPP_pollingPause 					 = 0;
var WEBAPP_updateBox2StatusCounter = 1;

// URLs
var WEBAPP_imgURI  = '';
var WEBAPP_backURL = '';
// BRIDGE
var WEBAPP_deviceStatusURL 	     = 'bridge.php?command=GSI&';
var WEBAPP_deviceFamilyStatusURL = 'bridge.php?command=GSF';
var WEBAPP_binCommandURL 				 = 'bridge.php?command=EBI';
var WEBAPP_analogCommandURL      = 'bridge.php?command=EAI';
var WEBAPP_executeScenarioURL    = 'bridge.php?command=ESI';
var WEBAPP_ecoStatusURL          = 'bridge.php?command=GEC';
var WEBAPP_IPCamURL  						 = 'bridge.php?command=GCU';
var WEBAPP_getSchedulerTaskURL   = 'bridge.php?command=GST';
// HTM
var WEBAPP_settingsMenuURL = 'webapps/webapp_legacy/settings_menu.htm'; // VER218C WANDA
var WEBAPP_keypadURL 			 = 'webapps/webapp_legacy/tastiera.htm'; 		  // VER218C WANDA
// TXT
var WEBAPP_geolocalScenarioEnterURL = 'gpsscenariosenter.txt?rnd=' + Math.random(); // VER281 WANDA
var WEBAPP_geolocalScenarioExitURL 	= 'gpsscenariosexit.txt?rnd='  + Math.random(); // VER281 WANDA
// PHP
var WEBAPP_timeURL 			   = 'orologio.php';
var WEBAPP_astroEnabledURL = 'astroenabled.php';
var WEBAPP_checkSessionURL = 'checkSession.php';
/* VER105 */
var WEBAPP_changeParametersURL = '/changeparams.php';
if (location.pathname.startsWith != null) {
	/* VER90 STEFANO */
	if (location.pathname.startsWith('/access')) {
		WEBAPP_changeParametersURL = '/access/changeparams.php';
	}
	/* ------------- */
} else {
	if (location.pathname.indexOf('/access') == 0) {
		WEBAPP_changeParametersURL = '/access/changeparams.php';
	}
}
/* ------ */
/* VER229 WANDA */
var WEBAPP_unprivilegedURL                  = '/unprivilegedUsers.php';
var WEBAPP_getCloudDateTimeConfigurationURL = '/getCloudDateTimeRetrivealConfiguration.php';
var WEBAPP_setCloudDateTimeConfigurationURL = '/setCloudDateTimeRetrivealConfiguration.php';
// PHP with cloud
if (location.pathname.indexOf('/access') == 0) {
	WEBAPP_unprivilegedURL                  = '/access/unprivilegedUsers.php';
	WEBAPP_getCloudDateTimeConfigurationURL = '/access/getCloudDateTimeRetrivealConfiguration.php';
	WEBAPP_setCloudDateTimeConfigurationURL = '/access/setCloudDateTimeRetrivealConfiguration.php';
}
/* ------------ */
// XML
var WEBAPP_databaseURL = 'xml/tsconf.xml';
var WEBAPP_cloudURL 	 = 'xml/tsconf_cloud.xml';
var WEBAPP_webifyURL 	 = 'xml/tsconf_webify.xml'; // If the connection is remote then recover the alternative websocket port (only for test mode)

/* VER254 LORENZO */
var WEBAPP_LEVEL_VISIBILITY_0 = 0;
var WEBAPP_LEVEL_VISIBILITY_1 = 1;
var WEBAPP_LEVEL_VISIBILITY_2 = 2;
var WEBAPP_LEVEL_VISIBILITY_3 = 3;
var WEBAPP_levelVisibility = WEBAPP_LEVEL_VISIBILITY_0; // 0: MINIMA VISIBILITA'
/* ------------ */

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------ CALLBACKS ------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

// DOMINAPLUS_MANAGER - VER278 WANDA
DOMINAPLUS_MANAGER_setSingleCallbackForWebapp('commandLDIcompleted'       , WEBAPP_commandLDIcompleted);       // LDI (LIST DEVICES by ID) - DOMINAPLUS_MANAGER_deviceList has been filled
DOMINAPLUS_MANAGER_setSingleCallbackForWebapp('commandLMcompleted'        , WEBAPP_commandLMcompleted);        // LM  (LIST MAP) 					 - DOMINAPLUS_MANAGER_areaList has been filled
DOMINAPLUS_MANAGER_setSingleCallbackForWebapp('commandLMCcompleted'       , WEBAPP_commandLMCcompleted);       // LMC (LIST MAP COMMANDS)  - DOMINAPLUS_MANAGER_areaList[].mapcommands has been filled
DOMINAPLUS_MANAGER_setSingleCallbackForWebapp('commandLMLcompleted'       , WEBAPP_commandLMLcompleted);       // LML (LIST MAP LABELS)    - DOMINAPLUS_MANAGER_areaList[].maplabels has been filled
DOMINAPLUS_MANAGER_setSingleCallbackForWebapp('manageConnectionStatus'    , WEBAPP_manageConnectionStatus);    // MANAGING CONNECTION STATUS
DOMINAPLUS_MANAGER_setSingleCallbackForWebapp('manageValCallingSystemGAT' , WEBAPP_manageValCallingSystemGAT); // GAT 										 - managing valcallingsystem value
DOMINAPLUS_MANAGER_setSingleCallbackForWebapp('commandUPDWScompleted'     , WEBAPP_commandUPDWScompleted);     // UPD WS
DOMINAPLUS_MANAGER_setSingleCallbackForWebapp('manageCallingSystemUPD'    , WEBAPP_manageCallingSystemUPD);    // UPD A (ALARM), UPD CS1, UPD CS2, UPD CS3, ALP AND FALP
DOMINAPLUS_MANAGER_setSingleCallbackForWebapp('manageUPDD'                , WEBAPP_manageUPDD);							   // UPD D (DEVICE ICON)
DOMINAPLUS_MANAGER_setSingleCallbackForWebapp('manageCommandsSREandSTO'   , WEBAPP_manageCommandsSREandSTO);   // SRE AND STO,
DOMINAPLUS_MANAGER_setSingleCallbackForWebapp('commandGRPcompleted'       , WEBAPP_commandGRPcompleted);       // GRP
DOMINAPLUS_MANAGER_setSingleCallbackForWebapp('updateSchedulerTaskHTML'   , WEBAPP_updateSchedulerTaskHTML);	 // UPDATING SCHEDULER TASK
DOMINAPLUS_MANAGER_setSingleCallbackForWebapp('schedulerPagination'       , WEBAPP_schedulerPagination);	     // SETTINGS SCHEDULER PAGINATION
DOMINAPLUS_MANAGER_setSingleCallbackForWebapp('getDeviceStatus'           , WEBAPP_getDeviceStatus);	         // GETTING DEVICE STATUS
DOMINAPLUS_MANAGER_setSingleCallbackForWebapp('loadingGATcompleted'       , WEBAPP_loadingGATcompleted);       // GAT
DOMINAPLUS_MANAGER_setSingleCallbackForWebapp('manageCommandUPDLL'        , WEBAPP_manageCommandUPDLL);		     // UPD LL
DOMINAPLUS_MANAGER_setSingleCallbackForWebapp('setGeolocalScenarioURLs'   , WEBAPP_setGeolocalScenarioURLs);	 // SETTINGS GEOLOCAL SCENARIO URLs
DOMINAPLUS_MANAGER_setSingleCallbackForWebapp('LMCisLoaded'               , WEBAPP_LMCisLoaded);               // LMC (LIST MAP COMMANDS)  - DOMINAPLUS_MANAGER_areaList[].mapcommands has been filled for all areas
DOMINAPLUS_MANAGER_setSingleCallbackForWebapp('getDevice'                 , WEBAPP_getDevice);                 // GETTING DEVICE
DOMINAPLUS_MANAGER_setSingleCallbackForWebapp('getArea'                   , WEBAPP_getArea);                   // GETTING AREA
DOMINAPLUS_MANAGER_setSingleCallbackForWebapp('getMapCommand'             , WEBAPP_getMapCommand);             // GETTING MAPCOMMAND
DOMINAPLUS_MANAGER_setSingleCallbackForWebapp('manageCommandGEP'          , WEBAPP_manageCommandGEP);          // GEP (GET ECONOMIZER PARAMETERS) - getting economizer parameters
DOMINAPLUS_MANAGER_setSingleCallbackForWebapp('commandPWRcompleted'       , WEBAPP_commandPWRcompleted);       // PWR
DOMINAPLUS_MANAGER_setSingleCallbackForWebapp('manageCommandAMS'          , WEBAPP_manageCommandAMS);          // AMS

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
														
// THERMO - VER278 WANDA
THERMO_setSingleCallbackForWebapp('updateThermostatTemperatureHTML' , WEBAPP_updateThermostatTemperatureHTML);  // UPDATING TEMPERATURE
THERMO_setSingleCallbackForWebapp('updateThermostatSetPointHTML'    , WEBAPP_updateThermostatSetPointHTML);     // UPDATING SETPOINT
THERMO_setSingleCallbackForWebapp('updateThermostatOffSetHTML'      , WEBAPP_updateThermostatOffSetHTML);       // UPDATING OFFSET
THERMO_setSingleCallbackForWebapp('updateThermostatFanLevelHTML'    , WEBAPP_updateThermostatFanLevelHTML);     // UPDATING FANLEVEL
THERMO_setSingleCallbackForWebapp('updateThermostatSeasonHTML'      , WEBAPP_updateThermostatSeasonHTML);       // UPDATING SEASON
THERMO_setSingleCallbackForWebapp('updateThermostatModeHTML'        , WEBAPP_updateThermostatModeHTML);         // UPDATING MODE
THERMO_setSingleCallbackForWebapp('updateThermostatLocalOFFHTML'    , WEBAPP_updateThermostatLocalOFFHTML);     // UPDATING LOCALOFF
THERMO_setSingleCallbackForWebapp('updateThermostatWindowStateHTML' , WEBAPP_updateThermostatWindowStateHTML);  // UPDATING WINDOWSTATE
THERMO_setSingleCallbackForWebapp('updateThermostatKeyboardLockHTML', WEBAPP_updateThermostatKeyboardLockHTML); // UPDATING KEYBOARDLOCK
THERMO_setSingleCallbackForWebapp('updateHumidityProbeHTML'         , WEBAPP_updateHumidityProbeHTML);          // UPDATING HUMIDITY PROBE
THERMO_setSingleCallbackForWebapp('updateAbanoValueHTML'            , WEBAPP_updateAbanoValueHTML);             // UPDATING ABANO VALUE
THERMO_setSingleCallbackForWebapp('setPointIsBeingModified'         , WEBAPP_setPointIsBeingModified);          // SETPOINT IS BEING MODIFIED

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

// THERMO DAIKIN - VER196 WANDA
THERMO_DAIKIN_setCallbackForWebapp(WEBAPP_updateDaikinFanSpeedHTML, WEBAPP_updateDaikinIsOnHTML, WEBAPP_updateDaikinModeHTML);

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

// ANTITHEFT - VER198 WANDA
ANTITHEFT_setCallbackForWebapp(WEBAPP_antitheftValFound,
	WEBAPP_antitheftValNotFound,
	WEBAPP_antitheftManageGGS,
	null,
	null,
	WEBAPP_getPopupAlarm,
	WEBAPP_updateAntitheftStatusHTML,
	WEBAPP_updateAntitheftAreasHTML,
	WEBAPP_showAntitheftInBox2b);

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

// AUDIO_GEN - VER200 WANDA
AUDIO_GEN_setCallbackForWebapp(WEBAPP_hideAudioCommands,
	WEBAPP_toggleAudioOverlay,
	WEBAPP_setComandiSorgenti,
	WEBAPP_toggleAudioActiveClass,
	WEBAPP_clickOnComandiItemInBoxComandiExtra,
	WEBAPP_setAudioSliders,
	WEBAPP_checkIfAudioIsOn);

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

// VIVALDI - VER202 WANDA
VIVALDI_setCallbackForWebapp(WEBAPP_updateVivaldiHTMLonUPD,
	WEBAPP_loadVivaldiHTMLLocalDevice,
	null,
	WEBAPP_hideShowVivaldiPlayPause,
	null,
	WEBAPP_addVivaldiEventListeners);

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

// TUTONDO - VER205 WANDA
TUTONDO_setCallbackForWebapp(WEBAPP_manageTutondoSoundSource,
	WEBAPP_manageTutondoSoundZoneParameters,
	WEBAPP_manageTutondoSoundZoneSource,
	WEBAPP_loadTutondoAudioZones,
	WEBAPP_loadTutondoAudioSources,
	WEBAPP_loadTutondoAudioPreset,
	WEBAPP_comandiSuperSorgentiHandler);

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

// RGBWHEEL - VER177 WANDA
RGBWHEEL_setCallbackForWebapp(WEBAPP_updateRGBColorPreview,
	WEBAPP_updateWhiteIndicatorPosition,
	WEBAPP_addRGBWheels,
	WEBAPP_updateRGBONOFFbutton,
	WEBAPP_updateColorDescription,
	WEBAPP_showHideColorWheel,
	WEBAPP_setWhiteChannelPercentage,
	WEBAPP_checkIfRGBONOFFbuttonIsON,
	WEBAPP_updateRGBIcon);

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ---------------------------------------------------------------------------- FUNCTIONS --------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Listener of messages
 * @version VER199 - WANDA
 */
window.addEventListener('message', function (event) 
{
	WEBAPP_windowMessageArrived = true;
	console.log('%c' + WEBAPP_PREFIX + 'Received message: ' + event.data, 'color: ' + WEBAPP_CONSOLE_COLOR);
	if (typeof event.data === 'string') {
		var message = $.parseJSON(event.data);
		if (message.command === 'location') {
			WEBAPP_manageOnMessageFromIFrame(message);
		}
	}
});

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages incoming messages from an iframe
 * @param {string} message - Message from iframe
 * @version VER199 - WANDA
 */
function WEBAPP_manageOnMessageFromIFrame(message)
{
  if (message !== null) {
    if (message.value.substr(-7) === 'level=1') {
      document.getElementById('iframe1').src = ANTITHEFT_antiTheftURI + '/#command=back';
    } else {
      WEBAPP_closeBoxOverAndOpenSettings();
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Listeners of unload and blur
 * @version VER205B - WANDA
 */
window.addEventListener('unload', WEBAPP_economizerStopPolling);

window.addEventListener('blur',	WEBAPP_economizerStopPolling);

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Actions to perform when the browser page is closed
 * @version VER205B - WANDA
 */
function WEBAPP_economizerStopPolling()
{
	DOMINAPLUS_MANAGER_sendWSCommand('ESP');
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

// Once that the document is ready --- VER259 WANDA
$(document).ready(function () 
{
	var body = document.body; // VER261
	if (typeof body !== 'undefined') {
		var htmlToAdd = '';
		htmlToAdd += '<form id="form1">';
		htmlToAdd += '<div id="sf_body"></div>';
		htmlToAdd += '<div id="testata"></div>';
		htmlToAdd += '<div id="main">';
		htmlToAdd += '<div id="menu-v82">';
		htmlToAdd += '<a class="boxOver_btn bg-red" id="btn_home" title="Home" onclick="WEBAPP_clickOnHomeButton()">';
		htmlToAdd += '<span class="px-icon icon-elegant-house-alt"></span>';
		htmlToAdd += '</a>';
		htmlToAdd += '<a class="boxOver_btn bg-red" id="btn_settings2" title="' + lblConfigurazione + '">';
		htmlToAdd += '<span class="px-icon icon-elegant-cogs"></span>';
		htmlToAdd += '</a></div>';
		htmlToAdd += '<div id="menu">';
		htmlToAdd += '<li class="ico-antitheft-no ico-antitheft-stato" style="list-style-type: none;"></li>';
		htmlToAdd += '</div>';
		htmlToAdd += '<div id="stage">';
		htmlToAdd += '<div id="boxAree">';
		htmlToAdd += '<div id="boxAree_sx"></div>';
		htmlToAdd += '<div id="boxAree_dx">';
		htmlToAdd += '<div id="boxAree_dx_cont"></div>';
		htmlToAdd += '</div></div>';
		htmlToAdd += '<div id="box1"></div>';
		htmlToAdd += '<div id="box2b"></div>';
		htmlToAdd += '<div id="box2" class="box2"></div>';
		htmlToAdd += '<div id="box3" class="box3"></div>';
		htmlToAdd += '<div id="splash">';
		htmlToAdd += '<img src="/DPClientData/maps/b-1.png" />';
		htmlToAdd += '</div>';
		htmlToAdd += '<div id="notavailable"></div>';
		htmlToAdd += '<div id="boxOver"></div>';
		htmlToAdd += '</div></div></form>';
		body.innerHTML = htmlToAdd;
	}
	// PORTRAIT OR LANDSCAPE ADAPTATION
	DISPLAY_togglePortraitOrLandscapeClasses();
	// ADDING SPECIAL STYLE
	DISPLAY_WBS_applyDisplaySettingsBasedOnUserAgent(); // VER194 WANDA
	// CHECKING IF "OLD"
	DISPLAY_WBS_updateVariablesIfIsChrome44();
	// OPENING COMMUNICATION CHANNEL
	if (isClient === true) {
		var notAvailable = document.getElementById('notavailable');
		if (notAvailable !== null) {
			notAvailable.innerHTML = MainDeviceType + ' client<br>Server IP: ' + isClient_ServerIP;
			notAvailable.style.display = 'block';
		}
	} else {
		DOMINAPLUS_MANAGER_openCommunicationChannel(WEBAPP_onConnectionFailure, 3); // VER277
		// CHECKING IF TS ARE NO LONGER LOGGED
		if ((DISPLAY_isTSSMART || DISPLAY_isTSSMART7 || DISPLAY_isTSSMART18) && !WEBSOCKET_isRemoteIP(location.hostname)) {
			setInterval('WEBAPP_askIfIsCurrentDeviceIsNoLongerLogged()', 30000); // VER217B WANDA
		}
	}
	WEBAPP_getCloudDateTimeConfiguration();
	if (DISPLAY_isTSSMART || DISPLAY_isTSSMART7 || DISPLAY_isTSSMART18) { // VER270 WANDA & LORENZO
    document.body.onblur = function () { DOMINAPLUS_MANAGER_reconnectWithoutDelay = true; };
  }
});

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Gets cloud dateTime configuration
 * @version VER229 - WANDA
 */
function WEBAPP_getCloudDateTimeConfiguration()
{
	var request = new XMLHttpRequest();
	request.open('GET', WEBAPP_getCloudDateTimeConfigurationURL + '?rnd=' + Math.random(), true);
	request.onreadystatechange = function() {
		if (request.readyState === 4) {
			if (request.status === 200) {
				WEBAPP_cloudDateTimeConfigurationValue = request.responseText;
			} else {
				console.log('%c' + WEBAPP_PREFIX + 'getCloudDateTimeConfiguration() error! ', 'color: ' + WEBAPP_CONSOLE_ERROR);
			}
		}
	}
	request.send(null);
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Handler of the click on the home button
 * @version VER227 - WANDA
 */
function WEBAPP_clickOnHomeButton()
{
	// REMOVING CLASSES FROM POSSIBILY ACTIVE ELEMENTS
	var box1Elements = document.querySelectorAll('#box1 > li > a');
	if (box1Elements !== null) {
		for (var i = 0; i < box1Elements.length; i++) {
			box1Elements[i].className = '';
		}
	}
	var boxAreeElements = document.querySelectorAll('#boxAree_dx_cont li > a');
	if (boxAreeElements !== null) {
		for (var i = 0; i < boxAreeElements.length; i++) {
			boxAreeElements[i].className = '';
		}
	}
	// HIDING ELEMENTS
	var box2 = document.getElementById('box2');
	if (box2 !== null) {
		box2.style.display = 'none';
	}
	var box2b = document.getElementById('box2b');
	if (box2b !== null) {
		box2b.style.display = 'none';
	}
	var box3 = document.getElementById('box3');
	if (box3 !== null) {
		box3.style.display = 'none';
	}
	if (window.isRgbwPageOpened) {
		window.isRgbwPageOpened = false;
	}
	// DESELECTING PREVIOUS MAP
	var splash = document.getElementById('splash');
	if (splash !== null) {
		splash.innerHTML = '<img src="/DPClientData/maps/b-1.png" />';
	}
	var activeMode = document.querySelector('.btn_mapmode .active');
	if (activeMode !== null) {
		if (activeMode.classList.contains('devicemode')) {
			var area0 = document.getElementById('area_0');
			if (area0 !== null) {
				area0.click();
			}
		} else if (activeMode.classList.contains('mapmode')) {
			var dispositivi0 = document.getElementById('dispositivi_0');
			if (dispositivi0 !== null) {
				dispositivi0.click();
			}
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
	
/**
 * Checks if astronomic clock is enabled
 * @version VER209 - WANDA
 */
function WEBAPP_loadAstronomicEnabled()
{
	var request = new XMLHttpRequest();
	request.open('GET', WEBAPP_astroEnabledURL, false); // 'false' makes the request synchronous
	request.send(null);
	if (request.readyState === 4) {
		if (request.status === 200) {
			if (request.responseText.trim() === 'ENABLED') {
				WEBAPP_isAstronomicEnabled = true;
			} else {
				WEBAPP_isAstronomicEnabled = false;
			}
		} else {
			console.log('%c' + WEBAPP_PREFIX + 'loadAstronomicEnabled() error! ', 'color: ' + WEBAPP_CONSOLE_ERROR);
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Creates a custom alert
 * @param {string} message - the message inside the custom alert
 * @param {string} title - the title of the custom alert
 * @version VER204 - WANDA
 */
function WEBAPP_customAlert(message, title) 
{
	WEBAPP_closeCustomAlert(); // Close possible existing custom alert
	var htmlToAdd = '';
	var element   = document.createElement('div');
	element.setAttribute('id', 'singleCustomAlert');
	element.counter      = 0;
	element.style.top    = '70px';
	element.style.height = ((parseInt(window.innerHeight) - parseInt(element.style.top)) - 70) + 'px';
	if (parseInt(element.style.height) > 440) {
		element.style.height = '440px';
	}
	htmlToAdd = '<div id="customAlertTitleContainer">';
	htmlToAdd += '<div id="customAlertTitle">' + title + '</div>';
	htmlToAdd += '<div id="customAlertCloseButtonContainer">';
	htmlToAdd += '<button id="customAlertCloseButton" onclick="WEBAPP_closeCustomAlert()">X</button>';
	htmlToAdd += '</div></div>';
	htmlToAdd += '<div id="customAlertMessageBody">' + message + '</div>';
	element.innerHTML = htmlToAdd;
	var body = document.body; // VER261
	if (typeof body !== 'undefined') {
		body.appendChild(element);
	}
}	

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Closes a custom alert
 * @version VER204 - WANDA
 */
function WEBAPP_closeCustomAlert()
{
	var singleCustomAlert = document.getElementById('singleCustomAlert');
	if (singleCustomAlert != null) {
		singleCustomAlert.parentNode.removeChild(singleCustomAlert);
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Adds .. as time passes to a custom alert message
 * @version VER204 - WANDA
 */
function WEBAPP_progressContentCustomAlert()
{
	var secondsToWait = 10;
	if (parseInt(location.pathname.indexOf('/access')) === 0) { // Remote
		secondsToWait = 15;
	}
	var singleCustomAlert = document.getElementById('singleCustomAlert');
	if (singleCustomAlert !== null) {
		singleCustomAlert.counter++;
		if (singleCustomAlert.counter < (secondsToWait + 2)) { // +2 to avoid ugly count blocking GUI effect
			var customAlertMessageBody = document.getElementById('customAlertMessageBody');
			if (customAlertMessageBody !== null) {
				customAlertMessageBody.innerHTML += '..';
			}
			setTimeout('WEBAPP_progressContentCustomAlert()', 1000);
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

	/**
	 * @version VER178 WANDA
	 */
	 function WEBAPP_getBox1()
	 {
		 if ($('#box1').html() === '') {
			 WEBAPP_appendNavbar('box1', false, false, true);
			 $.ajax({
				 type: 'GET',
				 url: FamilyUrl + '?rnd=' + Math.random(),
				 dataType: 'xml',
				 success: function(xml) {
					 $(xml).find('menu').each(function()
					 {				
						 sId = $(this).find('id').text();
						 sText = $(this).find('text').text();
						 $('#box1').append('<li><a data-text="' + sText + '" id="menu_' + sId + '"><div class="ico ico' + sId + '"></div>' + sText + '</a></li>');
						 /* VER169 WANDA */
						 if (DISPLAY_WBS_canApplyFullscreenStyleBasedOnUserAgent()) { // VER194 WANDA
							 $('#box1 > li').css('width', '99%').css('height', '10%');
							 $('#box1 > li > a').css('position', 'relative').css('left', '50%').css('transform', 'translateX(-50%)').css('width', '95%').css('height', '80%').css('margin', '5px 0 0 0').css('padding', '0').css('border-bottom', 'none').css('line-height', '2.3');
							 $('#box1 > li > a > div').css('position', 'relative').css('top', '50%').css('transform', 'translateY(-50%) scale(0.8)').css('margin', '0 5%');
						 }
						 /* ------------ */
					 });														
										 
					 $('#box1 > li > a').click(function()
					 { 
						 var isMenuEnabled = true;
						 for (var i = 0; i < DISPLAY_notEnabledBox1Array.length; i++) {
							 if (DISPLAY_notEnabledBox1Array[i].getAttribute('id') === $(this).attr('id')) {
								 isMenuEnabled = false;
							 }
						 }
						 // Avoid opening link if disabled
						 if (!(WEBAPP_economizzatore === 0 && $(this).attr('id') === 'menu_5') && !(ANTITHEFT_antiTheftType === 0 && $(this).attr('id') === 'menu_11') && !(AUDIO_GEN_audioEnable === 0 && $(this).attr('id') === 'menu_14') && isMenuEnabled === true) {
							WEBAPP_pollingPause = 0;
							 $('#box1 > li > a').removeClass(); 
							 $(this).addClass('active');
							 iId = $(this).attr('id').replace('menu_', '');
							 var antifurto = 0;
							 if (iId == 11) {
								 antifurto = 1;
							 }
							 WEBAPP_getBox2(iId, antifurto); 
							 $(window).scrollTop(0);
							 if ($('#stage').hasClass('mapview')) {
								 $('.mapcommand[data-mapcommandDeviceFamily=' + iId + ']').fadeIn(500);
								 $('.maplabel[data-mapcommandDeviceFamily=' + iId + ']').fadeIn(500); // VER117
								 $('.mapcommand[data-mapcommandDeviceFamily!=' + iId + ']').fadeOut(500);
								 if (iId == 11) { // VER123
									 $('.mapcommand[data-mapcommandDeviceFamily=12]').fadeIn(500);
									 $('.maplabel[data-mapcommandDeviceFamily=12]').fadeIn(500);
									 $('.mapcommand[data-mapcommandDeviceFamily=13]').fadeIn(500);
									 $('.maplabel[data-mapcommandDeviceFamily=13]').fadeIn(500);
								 }
								 $('.maplabel[data-mapcommandDeviceFamily!=-1]').each(function()
								 {
									 if ($(this).attr('data-mapcommandDeviceFamily') != iId) {
										 $(this).fadeOut(500); // VER117
									 }
								 });
								 $('.tutti_dispositivi a').removeClass('active');
							 }
							/* VER207 WANDA */
							if (window.isRgbwPageOpened) {
								window.isRgbwPageOpened = false;
							}
							/* ------------ */
							 isMenuEnabled = true;
						 }
					 });
					 /* RIMOSSO IN VER121
					 if (WEBAPP_economizzatore == 0) {
						 $('#box1 #menu_5').css('color', 'rgba(255, 255, 255, 0.4)');
						 $('#box1 #menu_5 .ico').css('opacity', '0.4');	
					 }
					 if (ANTITHEFT_antiTheftType == 0) {
						 $('#box1 #menu_11').css('color', 'rgba(255, 255, 255, 0.22)');
						 $('#box1 #menu_11 .ico11').css('opacity', '0.22');						
					 }
					 if (AUDIO_GEN_audioEnable == 0) {
						 $('#box1 #menu_14').css('color', 'rgba(255, 255, 255, 0.22)');
						 $('#box1 #menu_14 .ico14').css('opacity', '0.22');
					 }
					 */
				 },
				 error: function() 
				 { 
					 if (WEBAPP_debugFlag) {
						 WEBAPP_debug('error: Loading family xml');
					 }
				 }
			 });
		 }
	 }

	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

	/**
	 * Updates the box areas
	 * @version VER210 - WANDA
	 */
	function WEBAPP_getBoxAreas()
	{
		var htmlToAdd = '';
		var boxAreeSx = document.getElementById('boxAree_sx');
		if (boxAreeSx !== null) {
			htmlToAdd += '<li class="tutte_mappe">';
			htmlToAdd += '<a class="active" id="area_0" data-id="-1">' + lblTutte + '</a>';
			htmlToAdd += '</li>';
			htmlToAdd += '<li class="tutti_dispositivi">';
			htmlToAdd += '<a class="active" id="dispositivi_0" data-id="-1">' + lblTuttiDispositivi + '</a>';
			htmlToAdd += '</li>';
			boxAreeSx.innerHTML = htmlToAdd;
		}
		htmlToAdd = '';
		var boxAreeDxCont = document.getElementById('boxAree_dx_cont');
		if (boxAreeDxCont !== null) {
			for (var i = 0; i < DOMINAPLUS_MANAGER_areaList.length; i++) {
				if (typeof DOMINAPLUS_MANAGER_areaList[i].id !== 'undefined' && typeof DOMINAPLUS_MANAGER_areaList[i].name !== 'undefined' && typeof DOMINAPLUS_MANAGER_areaList[i].isVisible !== 'undefined' && DOMINAPLUS_MANAGER_areaList[i].isVisible === true) {
					htmlToAdd += '<li>';
					htmlToAdd += '<a id="area_' + DOMINAPLUS_MANAGER_areaList[i].id  + '" data-id="' + DOMINAPLUS_MANAGER_areaList[i].id + '">' + DOMINAPLUS_MANAGER_areaList[i].name + '</a>';
					htmlToAdd += '</li>';
				}						
			}
			boxAreeDxCont.innerHTML = htmlToAdd;
		}
		WEBAPP_setAreasScroll();
		$('#boxAree li > a').click(function()
		{
			$('#box3').hide(); // VER156 WANDA	
			if ($(this).closest('li').hasClass('tutti_dispositivi')) {
				$('#box1 li > a').removeClass(); // VER155 WANDA
				$("#boxAree_dx_cont .active").click();
				$(this).addClass("active"); 								
			}	else {
				$('#boxAree li > a').removeClass(); 
				$(this).addClass('active'); 
				var iIdF = 0;
				if ($('#box1 .active').length > 0) {
					iIdF = $('#box1 .active').attr('id').replace('menu_', '');
				}
				var antifurto = 0;
				if (iIdF == 11) {
					antifurto = 1;
				}
				$('#splash').html('<img src="/DPClientData/maps/b' + $(this).data('id') + '.png?rnd=' + WEBAPP_singleSessionRandomNumber + '">').show();
				if ($('#stage').hasClass('mapview')) {
					WEBAPP_setMap($(this).data('id'));
					$('#box1 .active').removeClass('active');
				}	else {
					WEBAPP_getBox2(iIdF, antifurto);
				}
			}
			$(window).scrollTop(0);
			if ($('.MV #boxAree:visible').length > 0) {
				$('.MV #boxAree').hide();
				$('#box2').hide(); // VER155 WANDA
			}
			/* VER207 WANDA */
			if (window.isRgbwPageOpened) {
				window.isRgbwPageOpened = false;
			}
			/* ------------ */
		});
		/* VER169 WANDA */
		if (DISPLAY_WBS_canApplyFullscreenStyleBasedOnUserAgent()) { // VER194 WANDA
			$('#boxAree_sx > li').css('border', 'none');
			$('#boxAree_sx > li > a').css('background-color', 'rgba(255, 255, 255, 0.1)').css('box-shadow', '0 0 5px rgba(0, 0, 0, 0.5)').css('border-radius', '5px');
			$('#boxAree_dx #boxAree_dx_cont > li').css('border', 'none');
			$('#boxAree_dx #boxAree_dx_cont > li a').css('background-color', 'rgba(255, 255, 255, 0.1)').css('box-shadow', '0 0 5px rgba(0, 0, 0, 0.5)').css('border-radius', '5px');
		}
		/* ------------ */
	}	

	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

	function WEBAPP_setMap(MapId)
	{
		$("#stage").addClass('mapview');
		var oArea = WEBAPP_getArea(MapId);
		if (oArea.mapcommands != null) {			
			var str = '';
			for (var i = 0; i < oArea.mapcommands.length; i++) {
				MC = oArea.mapcommands[i];
				str += '<div style="display: none; left: ' + (MC.commandX * WEBAPP_resizeRatio) + 'px; top: ' + (MC.commandY * WEBAPP_resizeRatio * WEBAPP_iconPositionAdjust) + 'px; background-image: url(/DPClientData/icons/i' + MC.icoc + '.png?rnd=' + WEBAPP_singleSessionRandomNumber + ');" class="mapcommand" data-mapcommandId="' + MC.commandId + '" data-mapcommandType="' + MC.commandType + '" data-mapcommandDeviceFamily="' + MC.deviceFamilyApp + '" data-mapcommanddevice="' + MC.deviceId + '" data-uriforclient="' + MC.uriForClient + '" title="' + MC.commandName + '"></div>'; // VER100
			}					
			$("#splash").append(str);
			$("#splash .mapcommand").fadeIn(300);
			$(".mapcommand").unbind('click').click(function(event) {
				var commandID=$(this).data("mapcommandid");
				var commandType=$(this).data("mapcommandtype");
				var deviceID = $(this).data("mapcommanddevice");
				var commandName = $(this).attr("title");
				WEBAPP_pollingPause = 0;
				switch(commandType) //Tipo di map command
				{
			    	case 0:
							/* VER173 WANDA */
			    		DOMINAPLUS_MANAGER_sendWSCommand('GSF', '7');
			    		setTimeout('DOMINAPLUS_MANAGER_sendWSCommand("GSF", "12")', 500);
							/* ------------ */
						return;
					
					case 21:
					case 22:
					  	WEBAPP_actualDevice = deviceID;
							if (commandName.length > 16) {
								commandName = commandName.substr(0, 16) + '...';
							}
							WEBAPP_getOverHTML('webapps/webapp_legacy/abano.htm', commandName, 'close'); // VER218C WANDA
					  	break;
					case 1: //Apri dimmer
						WEBAPP_getBox2(1,0);
						WEBAPP_getBox3($(this), deviceID.toString(), true); // VER98
						/* VER170 WANDA */
						if (DISPLAY_isFirefox) {
							DISPLAY_resizeEventHandler();
						}
						/* ------------ */
						break;
					case 7: //Apri shutter	
						WEBAPP_getBox2(3,0);						
						WEBAPP_getBox3($(this), deviceID.toString(), true); // VER98
						break;
					case 14: //Apri termostato
						WEBAPP_getBox2(4, 0);
						WEBAPP_getBox3($(this), deviceID.toString(), true, 4); // VER153 WANDA
						break;

						// KEYPAD
			    	case 13:
							ANTITHEFT_getKeypad();
			      break;

					case 15:
						$("#area_"+deviceID).click();
			        	break;
					case 17:
						DOMINAPLUS_MANAGER_sendWSCommand('ES', commandID); // VER173 WANDA
						break;
					case 18: //ip camera
						WEBAPP_getBox2(8,0);
						deviceID=commandID % 1000 //trucco per ipcam
						WEBAPP_getBox3($(this), deviceID.toString(), true); // VER98
						break;
					case 20: // AUDIO AREA
						WEBAPP_getBox2(14, 0);
						WEBAPP_actualDevice = deviceID.toString();
						if (commandName.length > 16) {
							commandName = commandName.substr(0, 16) + '...';
						}
						WEBAPP_getOverHTML('webapps/webapp_legacy/settings_audio.htm', lblZonaAudio + ': ' + commandName, 'close'); // VER218C WANDA
						break;
					/*VER100*/
					case 0x17: //httpcommand
						console.log('%c' + WEBAPP_PREFIX + 'HTTP command', 'color: ' + WEBAPP_CONSOLE_COLOR);
						if(($(this).data("uriforclient"))!="")
						{
							window.open($(this).data("uriforclient"));
						}
						/********/
						else
						{
							DOMINAPLUS_MANAGER_sendWSCommand('EBC', commandID); // VER173 WANDA
						}
						break;
					default:
						DOMINAPLUS_MANAGER_sendWSCommand('EBC', commandID); // VER173 WANDA
				} 
				
			});
		}

		if (oArea.maplabels!=null)
		{
			for (var i=0; i<oArea.maplabels.length; i++)
			{
				ML=oArea.maplabels[i];
				// $('#splash').append('<div id="MapLable_' + ML.LabelId + '" data-maxchar="' + ML.LabelMaxChar + '" class="maplabel" style="display: none; left: ' + (ML.LabelX * WEBAPP_resizeRatio) + 'px; top: ' + (ML.LabelY * WEBAPP_resizeRatio * 1.05) + 'px; font-size: ' + ML.LabelFontSize + 'pt; color: #' + ML.LabelFontColor + '; font-weight:' + ML.LabelFontWeightCSS + '; text-align:center;">' + ML.LabelText + '</div>');
				//VER68B STEFANO
				var colorPart="color:#"+ML.LabelFontColor+";";
				if(ML.LabelText.substring(0,4)=="0000" && ML.LabelText.charAt(ML.LabelText.length-1)=="|")  //Etichetta speciale valorizzata
				{
					colorPart="background:#"+ML.LabelFontColor+";border: solid #DDDDDD 1px;";
				}
				/////////////////
				strMapCommandFamilyApp = (ML.LabelMapCommandFamilyApp==undefined) ? "" :  "data-mapcommandDeviceFamily=\""+ML.LabelMapCommandFamilyApp+"\" ";
				$('#splash').append('<div id="MapLable_' + ML.LabelId + '" ' + strMapCommandFamilyApp + ' data-maxchar="' + ML.LabelMaxChar + '" class="maplabel" style="display: none; left: ' + (ML.LabelX * WEBAPP_resizeRatio) + 'px; top: ' + (ML.LabelY * WEBAPP_resizeRatio * 1.05) + 'px; font-size: ' + ML.LabelFontSize + 'pt; ' + colorPart + ' font-weight: ' + ML.LabelFontWeightCSS + '; text-align: center;">' + ML.LabelText + '</div>');
				$("#splash #MapLable_"+ML.LabelId).width($("#splash #MapLable_"+ML.LabelId).width()+1);
				if (ML.currentText!=undefined) $("#splash #MapLable_"+ML.LabelId).html(ML.currentText);
			}
			
			$("#splash .maplabel").fadeIn(300);
		}

		/*VER116*/
		if (enableMapSlider){
			var str = '<div class="map-slider-btn map-slider-btn-prev"><span data-name="elegant-arrow-triangle-left" class="px-icon icon-elegant-arrow-triangle-left"></span></div>';
			str += '<div class="map-slider-btn map-slider-btn-next"><span data-name="elegant-arrow-triangle-right" class="px-icon icon-elegant-arrow-triangle-right"></span></div>'; 
			$("#splash").append(str).data("current-map-id",MapId);		

			$("#splash .map-slider-btn").click(function(){
				$('#box2').hide(); // VER154 WANDA --- To avoid showing #box2 when skipping between maps
				//debugger;
				var currentMapId = $("#splash").data("current-map-id");				
				var currentMapIndex = $("#area_"+currentMapId).closest("li").index();
				newMapIndex = ($(this).hasClass('map-slider-btn-prev')) ? currentMapIndex-1 : currentMapIndex+1;
				if (newMapIndex<0) newMapIndex = $("#boxAree_dx li").length-1;
				if (newMapIndex>=$("#boxAree_dx li").length) newMapIndex = 0;
				console.log('%c' + WEBAPP_PREFIX + 'currentMapId: ' + currentMapId + ' - currentMapIndex: ' + currentMapIndex + ' - newMapIndex: ' + newMapIndex, 'color: ' + WEBAPP_CONSOLE_COLOR);
				$("#boxAree_dx li:eq("+newMapIndex+") a").click();
				$('#dispositivi_0').click(); // VER155 WANDA
			});
		}
		/********/
	}

	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

	function WEBAPP_getBox2(deviceType, antifurto) // VER131 small code reordening
	{
		/* VER153 WANDA */ // antitheft_mode class once added remained, preventing other deviceType to open box3 and show command
		var box2 = document.getElementById('box2');
		if (box2 !== null) {
			if (box2.classList.contains('antitheft_mode')) {
				box2.classList.remove('antitheft_mode');
			}
		}
		/* ------------ */
		// NO DEVICE SELECTED
		if (parseInt(deviceType) === 0) {
			if (box2 !== null) {
				box2.innerHTML = '<span>' + lblNoDeviceSelected + '</span>';
				$('#box2').slideDown();
			}
		}
		// ECO
		else if (parseInt(deviceType) === 5) { 
			WEBAPP_clickedOnConsumptionInBox1 = true; // VER211 WANDA
			var labelToSee = lblContabilizzatoreConsumi;
			if (WEBAPP_ecoType === 1) {
				labelToSee = lblPlantManagement;
			}
			WEBAPP_getOverHTML('webapps/webapp_legacy/consumi.htm', labelToSee, 'close'); // VER218C WANDA
		}
		// OTHER
		else {
			var activeAreaID = 0;
			var boxAreeActive = document.querySelector('#boxAree .active');
			if (boxAreeActive !== null) {
				activeAreaID = boxAreeActive.getAttribute('id').split('_')[1];
			}
			var box3 = document.getElementById('box3');
			if (box3 !== null) {
				box3.innerHTML = '';
				$('#box3').fadeOut();
			}
			if (antifurto === 1) {
				ANTITHEFT_showAntitheftInBox2b(); // VER174 WANDA
			}	else {
				if (antifurto === 0) {
					var box2b = document.getElementById('box2b');
					if (box2b !== null) {
						box2b.innerHTML = '';
						$('#box2b').slideUp();
					}
				}
				$('#box2').slideUp(function() { WEBAPP_box2SlideUp(deviceType, activeAreaID); });
			}
		}
		var stage = document.getElementById('stage');
		if (stage !== null && box2 !== null) {
			if (stage.classList.contains('mapview')) {
				box2.style.display = 'none';
			}
		}
	}

	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

	function WEBAPP_box2SlideUp(deviceType, activeAreaID)
	{
		var htmlToAdd = '';
		var stage = document.getElementById('stage');
		var box2 = document.getElementById('box2');
		if (stage !== null && box2 !== null) {
			box2.innerHTML = '';
			WEBAPP_appendNavbar('box2', true, true, false);
			// ANTITHEFT
			if (parseInt(deviceType) === 12) {
				WEBAPP_addAntitheftAreasInBox2(); // VER199 WANDA
			}	else {
				if (parseInt(deviceType) === 13) {
					if (!box2.classList.contains('antitheft_mode')) {
						box2.classList.add('antitheft_mode');
					}
				}
				// TECH ALARMS
				if (parseInt(deviceType) === 7) {
					htmlToAdd = '';
					htmlToAdd += '<li>';
					htmlToAdd += '<a id="techalarm_log">';
					htmlToAdd += '<div class="ico ico_techlog"></div>' + lblCallingSystemLog;
					htmlToAdd += '</a></li>';
					box2.insertAdjacentHTML('beforeend', htmlToAdd);
				}
				htmlToAdd = '';
        var deviceCounter = 0;
				var commands = [];
				for (var i = 0; i < DOMINAPLUS_MANAGER_deviceList.length; i++) {
					if (typeof DOMINAPLUS_MANAGER_deviceList[i].typeApp !== 'undefined' && parseInt(DOMINAPLUS_MANAGER_deviceList[i].typeApp) === parseInt(deviceType)) {
						if (typeof DOMINAPLUS_MANAGER_deviceList[i].type !== 'undefined') {
							if (parseInt(DOMINAPLUS_MANAGER_deviceList[i].type) === 1 && typeof DOMINAPLUS_MANAGER_deviceList[i].avebus_address !== 'undefined' && parseInt(DOMINAPLUS_MANAGER_deviceList[i].avebus_address) >= 240) { // LIGHTING - MULTICAST or BROADCAST
								if (typeof DOMINAPLUS_MANAGER_deviceList[i].commands !== 'undefined') {
									commands = DOMINAPLUS_MANAGER_deviceList[i].commands;
									if (commands.length > 1) {
										if (commands.indexOf(19) >= 0) { // MARCIA + ARRESTO
											commands = [19];
										} else if (commands.indexOf(0) >= 0) { // NO ACTION
											commands = [0];
										} else if (commands.indexOf(11) >= 0 && commands.indexOf(12) >= 0) {
											commands = [];
										}	else if (commands.indexOf(11) >= 0 && commands.indexOf(10) >= 0) {
											commands = [11];
										} else if (commands.indexOf(12) >= 0 && commands.indexOf(10) >= 0) {
											commands = [12];
										}
									}
									if (typeof DOMINAPLUS_MANAGER_deviceList[i].id !== 'undefined' && typeof DOMINAPLUS_MANAGER_deviceList[i].name !== 'undefined') {
										if (commands.length === 0) { // Not present in any map -> Insert 2 buttons: ON and OFF
											htmlToAdd = '<li>';
											htmlToAdd += '<a id="menu_' + DOMINAPLUS_MANAGER_deviceList[i].id + '" style="width: 100%;">';
											htmlToAdd += '<div class="ico ico' + DOMINAPLUS_MANAGER_deviceList[i].type + '_0" id="menu_ico_' + DOMINAPLUS_MANAGER_deviceList[i].id + '" rel="' + DOMINAPLUS_MANAGER_deviceList[i].type + '" data-multicast_command="11"></div>' + DOMINAPLUS_MANAGER_deviceList[i].name;
											htmlToAdd += '</a></li>';
											htmlToAdd += '<li>';
											htmlToAdd += '<a id="menu_' + DOMINAPLUS_MANAGER_deviceList[i].id + '" style="width: 100%;">';
											htmlToAdd += '<div class="ico ico' + DOMINAPLUS_MANAGER_deviceList[i].type + '_0" id="menu_ico_' + DOMINAPLUS_MANAGER_deviceList[i].id + '" rel="' + DOMINAPLUS_MANAGER_deviceList[i].type + '" data-multicast_command="12"></div>' + DOMINAPLUS_MANAGER_deviceList[i].name;
											htmlToAdd += "</a></li>";
										} else if (commands.length === 1) {
											htmlToAdd = '<li>';
											htmlToAdd += '<a id="menu_' + DOMINAPLUS_MANAGER_deviceList[i].id + '" style="width: 100%;">';
											htmlToAdd += '<div class="ico ico' + DOMINAPLUS_MANAGER_deviceList[i].type + '_0" id="menu_ico_' + DOMINAPLUS_MANAGER_deviceList[i].id + '" rel="' + DOMINAPLUS_MANAGER_deviceList[i].type + '" data-multicast_command="' + commands[0] + '"></div>' + DOMINAPLUS_MANAGER_deviceList[i].name;
											htmlToAdd += '</a></li>';
										}
									}
								}
							}	else {
								var attributeToAdd = '';
								if (typeof DOMINAPLUS_MANAGER_deviceList[i].isMA !== 'undefined' && DOMINAPLUS_MANAGER_deviceList[i].isMA === true) {
									attributeToAdd = "isMA=1";
								}
								if (typeof DOMINAPLUS_MANAGER_deviceList[i].isNA !== 'undefined' && DOMINAPLUS_MANAGER_deviceList[i].isNA === true) { 
									attributeToAdd = "isNA=1";
								}
								/* VER125 */
								var currentValue = 0;
								if (typeof DOMINAPLUS_MANAGER_deviceList[i].currentVal !== 'undefined') {
									currentValue = DOMINAPLUS_MANAGER_deviceList[i].currentVal;
								}
								/* ------------- */
								/* VER172 WANDA */
								var deviceName = '';
								if (typeof DOMINAPLUS_MANAGER_deviceList[i].name !== 'undefined') {
									deviceName = DOMINAPLUS_MANAGER_deviceList[i].name;
									if (deviceName[0] === '$') {
										deviceName = deviceName.substr(1);
									}
									if (deviceName[deviceName.length - 1] === '$') {
										deviceName = deviceName.substr(0, deviceName.length - 1);
									}
								}
								/* ------------- */
								/* VER212 WANDA */
								if (typeof DOMINAPLUS_MANAGER_deviceList[i].id !== 'undefined') {
									var styleToAdd = 'style="width: 100%"';
									if (WEBAPP_showEnergy === true && !DISPLAY_isTS10 && typeof DOMINAPLUS_MANAGER_deviceList[i].powerValue !== 'undefined') {
										styleToAdd = 'style="width: calc(100% - 60px);"';
									}
									htmlToAdd = '<li>';
									htmlToAdd += '<a id="menu_' + DOMINAPLUS_MANAGER_deviceList[i].id + '" ' + styleToAdd + '>';
									htmlToAdd += '<div class="ico ico' + DOMINAPLUS_MANAGER_deviceList[i].type + '_' + currentValue + '" id="menu_ico_' + DOMINAPLUS_MANAGER_deviceList[i].id + '" rel="' + DOMINAPLUS_MANAGER_deviceList[i].type + '" ' + attributeToAdd + '></div>' + deviceName;
									htmlToAdd += '</a>';
									if (WEBAPP_showEnergy === true && !DISPLAY_isTS10 && typeof DOMINAPLUS_MANAGER_deviceList[i].powerValue !== 'undefined') {
										styleToAdd = 'style="position: relative; top: 50%; -webkit-transform: translateY(-50%); transform: translateY(-50%);"';
										if (parseInt(deviceType) === 9) {
											styleToAdd = '';
										}
										htmlToAdd += '<div class="powerContainer" id="box2PowerContainer_' + DOMINAPLUS_MANAGER_deviceList[i].id + '">';
										htmlToAdd += '<div class="powerElement" id="box2PowerElement_' + DOMINAPLUS_MANAGER_deviceList[i].id + '" ' + styleToAdd + '>' + DOMINAPLUS_MANAGER_deviceList[i].powerValue + ' W</div>';
										if (parseInt(deviceType) === 9) {
											htmlToAdd += '<div class="powerGraphElement" id="box2PowerGraphElement_' + DOMINAPLUS_MANAGER_deviceList[i].id + '" onclick="WEBAPP_clickOnEnergyGraph(' + DOMINAPLUS_MANAGER_deviceList[i].id + ')"></div>';
										}
										htmlToAdd += '</div>';
									}
									htmlToAdd += '</li>';
								}
								/* ------------- */
							}
						}
						// COUNTING HOW MANY DEVICES FOR THE ACTIVE MAP
						if (activeAreaID > 0 && !stage.classList.contains('mapview')) {
							if (typeof DOMINAPLUS_MANAGER_deviceList[i].maps !== 'undefined') {
								var smaps = ' ;' + DOMINAPLUS_MANAGER_deviceList[i].maps + ';';
								if (smaps.indexOf(';' + activeAreaID + ';') >= 0) {
									box2.insertAdjacentHTML('beforeend', htmlToAdd);
									deviceCounter++
								}
							}
						}
						// DEVICES IN "TUTTE LE MAPPE"
						else {
							box2.insertAdjacentHTML('beforeend', htmlToAdd);
							deviceCounter++
						}					
					}
				}
				// TECH ALARMS
				if (parseInt(deviceType) === 7) {
					DOMINAPLUS_MANAGER_sendWSCommand('GSF', '7'); // VER239 WANDA
					for (var i = 0; i < WEBAPP_CS1_CS2_CS3_List.length; i++) {
						WEBAPP_manageCallingSystem(WEBAPP_CS1_CS2_CS3_List[i].type, parseInt(WEBAPP_CS1_CS2_CS3_List[i].id) + 100000, 1, WEBAPP_CS1_CS2_CS3_List[i].datetime); // VER76 STEFANO BIS
					}
					for (var i = 0; i < WEBAPP_propagationList.length; i++) {
						/* VER87 STEFANO */
						if (WEBAPP_propagationList[i].alarmType === 'falp') {
							var params = new Array();
							params[0] = WEBAPP_propagationList[i].supervisor;
							params[1] = WEBAPP_propagationList[i].device;
							params[2] = WEBAPP_propagationList[i].extraDeviceInfo;
							params[3] = WEBAPP_propagationList[i].alarmCode;
							params[4] = WEBAPP_propagationList[i].datetime;
							WEBAPP_showPropagationAlarm(params, 'FALP');
						}	else if (parseInt(WEBAPP_propagationList[i].alarmCode) === 1) {
							WEBAPP_showPropagationAlarm([WEBAPP_propagationList[i].supervisor, WEBAPP_propagationList[i].device, WEBAPP_propagationList[i].alarmType, WEBAPP_propagationList[i].alarmCode, WEBAPP_propagationList[i].datetime]); // VER76 STEFANO
						}
						/* ------------- */
					}
				}
				// NO DEVICES
				if (deviceCounter === 0) {
					htmlToAdd = '';
					var box1Menu = document.querySelector('#box1 #menu_' + deviceType);
					var boxAreeArea = document.querySelector('#boxAree #area_' + activeAreaID);
					var box2bAntitheft = document.querySelector('#box2b #antifurto_' + deviceType);
					// IN MAP
					if (activeAreaID > 0) {
						htmlToAdd = lblNoDeviceInMap;
						if (boxAreeArea !== null) {
							if (!box2.classList.contains('antitheft_mode')) {
								if (box1Menu !== null) {
									htmlToAdd = htmlToAdd.replace('[tipo]', '<strong>' + box1Menu.getAttribute('data-text') + '</strong>');
									htmlToAdd = htmlToAdd.replace('[mappa]', '<strong>' + boxAreeArea.innerHTML + '</strong>');
								}
							} else {
								if (box2bAntitheft !== null) {
									htmlToAdd = htmlToAdd.replace('[tipo]', '<strong>' + box2bAntitheft.innerText + '</strong>');
									htmlToAdd = htmlToAdd.replace('[mappa]', '<strong>' + boxAreeArea.innerHTML + '</strong>');
								}
							}
						}
					}
					// IN "TUTTE LE MAPPE"
					else {
						htmlToAdd = lblNoDevicePresent;
						if (!box2.classList.contains('antitheft_mode')) {
							if (box1Menu !== null) {
								htmlToAdd = htmlToAdd.replace('[tipo]','<strong>' + box1Menu.getAttribute('data-text') + '</strong>');
							}
						} else {
							if (box2bAntitheft !== null) {
								htmlToAdd = htmlToAdd.replace('[tipo]','<strong>'+ box2bAntitheft.innerText + '</strong>');
							}
						}
					}
					htmlToAdd = '<span>' + htmlToAdd + '</span>';
					box2.insertAdjacentHTML('beforeend', htmlToAdd);
				}
			}
			WEBAPP_setBox2Scroll('#box2', 9);
			// TECH ALARM
			if (parseInt(deviceType) === 7) { // VER77
				var techAlarmLog = document.querySelector('#box2 #techalarm_log');
				if (techAlarmLog !== null) {
					if (WEBAPP_callingSystem === 0) {
						techAlarmLog.style.opacity = '0.3';
					} else {
						techAlarmLog.addEventListener('click', function() { WEBAPP_getOverHTML('webapps/webapp_legacy/callingsystem.htm', lblTitoloSistemaChiamata, 'close'); }); // VER218C WANDA
					}
				}
			}
			// AUDIO AREA	// VER164 WANDA
			if (parseInt(deviceType) === 14) { 
				$('#box2 li > a').click(function ()
				{
					/* VER95 */
					var device = WEBAPP_getDevice(parseInt($(this).attr('id').replace('menu_', '')));
					if (device !== false) {
						WEBAPP_actualDevice = device.indirizzoAudio;
					}
					/* ----- */
					var commandName = $(this).html();
					commandName = commandName.substr(commandName.lastIndexOf('</div>') + 6);
					if (commandName.length > 16) {
						commandName = commandName.substr(0, 16) + '...';
					}
					WEBAPP_getOverHTML('webapps/webapp_legacy/settings_audio.htm', lblZonaAudio + ': ' + commandName, 'close'); // VER218C WANDA
				});
			}
			else if (parseInt(deviceType) !== 12 && parseInt(deviceType) !== 13 && parseInt(deviceType) !== 7)	{
				// SCENARIO // VER79
				if (parseInt(deviceType) === 6) {
					WEBAPP_getGeolocalScenario();				
					DOMINAPLUS_MANAGER_deviceList.filter(function (x) { return parseInt(x.typeApp) === 6; }).forEach(function(obj) {
						console.log('%c' + WEBAPP_PREFIX + obj.id + ' - ' + obj.isGeoLocal, 'color: ' + WEBAPP_CONSOLE_COLOR);
						if (obj.isGeoLocal > 0) {
							var box2Menu = document.querySelector('#box2 #menu_' + obj.id);
							if (box2Menu !== null) {
								box2Menu.classList.add('isGeolocal', 'isGeolocal' + obj.isGeoLocal);
							}
						}
					});
				}
				$('#box2 li > a').click(function()
				{ 
					/* VER207 WANDA */
					if (window.isRgbwPageOpened) {
						window.isRgbwPageOpened = false;
					}
					/* ------------ */
					var box2LiA = document.querySelectorAll('#box2 li > a');
					if (box2LiA !== null) {
						for (var i = 0; i < box2LiA.length; i++) {
							if (box2LiA[i].classList.contains('active')) {
								box2LiA[i].classList.remove('active');
							}
						}
					}
					$(this).addClass('active');
					WEBAPP_pollingPause = 0;
					// VER77
					var body = document.body; // VER261
					if (typeof body !== 'undefined') {
						if (body.classList.contains('MV')) {
							var fam = $(this).find('.ico').attr('rel');
							var iId = $(this).attr('id').replace('menu_', '');
							var multicast_command = $(this).find('.ico').data('multicast_command'); // VER156 MAURO
							switch (fam) {
								case '1':
									var cd = WEBAPP_getDevice(iId);
									var commands = cd.commands; // VER267 WANDA
									// VER158 STEFANO (cambiato ordine priorità if originale)
									// START + STOP --- VER173 WANDA
									if (cd.isMA) {	
										DOMINAPLUS_MANAGER_sendWSCommand('EBI', iId + ',11');
										setTimeout('DOMINAPLUS_MANAGER_sendWSCommand("EBI", "' + iId + ',12");', 500);
									}
									// NO ACTION
									else if (cd.isNA) {
										console.log('%c' + WEBAPP_PREFIX + 'Nessuna azione', 'color: ' + WEBAPP_CONSOLE_COLOR);	
									}
									// ON ONLY --- VER267 WANDA
									else if (commands.length === 1 && parseInt(commands[0]) === 11) {
										DOMINAPLUS_MANAGER_sendWSCommand('EBI', iId + ',' + commands[0]);
									}
									// OFF ONLY --- VER267 WANDA
									else if (commands.length === 1 && parseInt(commands[0]) === 12) {
										DOMINAPLUS_MANAGER_sendWSCommand('EBI', iId + ',' + commands[0]);
									}
									// MULTICAST --- VER173 WANDA
									else if (multicast_command != undefined) {
										console.log('%c' + WEBAPP_PREFIX + 'DOMINAPLUS_MANAGER_sendWSCommand: EBI, ' + iId + ',' + multicast_command, 'color: ' + WEBAPP_CONSOLE_COLOR);
										DOMINAPLUS_MANAGER_sendWSCommand('EBI', iId + ',' + multicast_command);
									}
									// STEP --- VER173 WANDA
									else {
										DOMINAPLUS_MANAGER_sendWSCommand('EBI', iId + ',10');
									}
									break;

								case '6':
									DOMINAPLUS_MANAGER_sendWSCommand('ESI', iId); // VER173 WANDA
									break;

								case '9':
									DOMINAPLUS_MANAGER_sendWSCommand('EBI', iId + ',10'); // VER173 WANDA
									break;	

								case '13': // VER67
									break;

								default:								
									WEBAPP_getBox3($(this));
							}
						} else {
							WEBAPP_getBox3($(this));
						}
					}
				});
			}
			var body = document.body; // VER261
			if (typeof body !== 'undefined') {
				if (body.classList.contains('MV')) {
					var html = document.getElementsByTagName('html')[0];
					if (typeof html !== 'undefined') {
						box2.style.minHeight = html.style.clientHeight + 'px';
					}
				}
			}
			$('#box2').css('min-height', '0'); // VER212 WANDA
			$("body.MV #box2").css("min-height",$("html").height()); //VER137
			WEBAPP_updateBox2Status();			
			$('#box2').slideDown();
			if (window.innerWidth <= DISPLAY_widthOrientationChange) {
				var box3 = document.getElementById('box3');
				if (box3 !== null) {
					box3.style.height = box2.style.height;
				}
			}
			/* VER169 WANDA */
			if (DISPLAY_WBS_canApplyFullscreenStyleBasedOnUserAgent()) { // VER194 WANDA
				$('#box2 li').css('height', '46px').css('border', 'none');
				if (box2.classList.contains('antitheft_mode')) {
					$('#box2 > li > a div').css('margin-right', '10px');
				}
			}
			/* ------------ */		
		}
	}

	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
	
	function WEBAPP_getBox3(obj, iId, isByMapcommandPassed, deviceFamily /*VER105 removed default value*/ /*=false*/) // VER153 WANDA
	{
		/* VER154 WANDA */
		if($('#stage').hasClass('mapview')) {
			$('#box2').hide();
			$('.box3').css('height', '456px');
		} else {
			$('.box3').css('height', $('#box2').height());
		}
		/* ------------ */

		/*VER105*/
		var isByMapcommand=false;
		if(isByMapcommandPassed!=null)
		{
			isByMapcommand=isByMapcommandPassed;
		}
		/********/
		if (!iId)
		{
		 iId=$(obj).attr("id").replace("menu_","");
			var CurrentIndex=$( "#box2 li" ).index( $(obj).closest("li") );
		}

		/* VER205B WANDA */
		var box3 = document.getElementById('box3');
		if (box3 !== null) {
			box3.innerHTML = '';
		}
		/* ------------- */
		
		$("#box3").slideUp(function () {
		  $("#box3").html("").data("isByMapcommand",isByMapcommand);//VER 98
			WEBAPP_appendNavbar('box3', true, false, false);	
			WEBAPP_getBox3Content(obj, iId);
		    
		    //VER 98
		    if (WEBAPP_isCustomIconInPopupEnabled && isByMapcommand) {
					/* VER154 WANDA */ // To avoid #temp_ril_iId to change position when #stato_iId loads the background image
					if (typeof deviceFamily !== 'undefined' && deviceFamily === 4) {
						$('#box3 #temp_ril_' + iId).css('margin-left', '100px').css('height', '80px');
					} 
					$('#box3 #stato_' + iId).css('background-image', obj.css('background-image')).css('background-position','0 0');
				/* ------------ */
				}
				/*****************/

			$("#box3").append("<div id=\"btn_close\"><span title=\""+lblChiudi+"\" class=\"px-btn px-icon icon-close\"></span></div>"); /*VER75*/
			$("#box3 #btn_close").click(function () 
			{
				// clearInterval(WEBAPP_textTimer); VER177 WANDA
				/* VER153 --- VER160 WANDA */
				if (typeof deviceFamily !== 'undefined' && deviceFamily === 4 && (DISPLAY_isTS10 || DISPLAY_isTSSMART || DISPLAY_isTSSMART7 || DISPLAY_isTSSMART18)) { // VER254 WANDA
					$('#box3').hide();
				} else {
					$('#box3').fadeOut('slow');
				}
				/* ------------ */ 
				/* VER207 WANDA */
				if (window.isRgbwPageOpened) {
					window.isRgbwPageOpened = false;
				}
				/* ------------ */
			});
			$("body.MV #box3").css("min-height",$("html").height()); //VER137
			$(window).scrollTop(0);

			/* VER153 --- VER160 WANDA */
			if (typeof deviceFamily !== 'undefined' && deviceFamily === 4 && (DISPLAY_isTS10 || DISPLAY_isTSSMART || DISPLAY_isTSSMART7 || DISPLAY_isTSSMART18)) { // VER254 WANDA
				$('#box3').show();
			} else {
				$('#box3').slideDown();
			}
			/* ------------ */
		});
	}	

	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

	function WEBAPP_getBox3Content(obj, iId)
	{
		if (iId.indexOf('antifurto') == 0) {
		  WEBAPP_contentIsAntitheft(obj, iId); // QUANDO VIENE MOSTRATO?
		}	else {
		  Device = WEBAPP_getDevice(iId);
		  if (parseInt(Device.type) === 1) { 
				WEBAPP_lightingInBox3(obj, Device, iId);
		  } else if (Device.type == 2) { // FIX VER33
				WEBAPP_contentIsDimmer(iId);
		  } else if (Device.type == 3 || Device.type == 16 || Device.type == 19) {
				WEBAPP_contentIsShutter(iId);
		  }	else if (Device.type === '4' && typeof Device.isVMCDaikinModBus === 'undefined') {
				/* VER205B WANDA */
				if (typeof Device.isIoT !== 'undefined' && Device.isIoT === true && !DISPLAY_isTS10 && !DISPLAY_isTSSMART_OLD && !DISPLAY_isTSSMART7_OLD) {
					WEBAPP_contentIsThermoIoT(Device);
				} else {
					WEBAPP_contentIsThermo(Device);
				}
				/* ------------ */
		  } else if (Device.type === '4' && Device.isVMCDaikinModBus === true) {
				WEBAPP_contentIsThermoVMCDaikinModbus(Device); // VER195 WANDA
			} else if (Device.type == 6) {
		    WEBAPP_contentIsScenario(iId);
		  } else if (Device.type == 7) {
				// ALARMS --- NOP
		  } else if (Device.type == 8) { //IPCam
		    WEBAPP_contentIsIPCam(iId); // VER192B WANDA
		  } else if (Device.type == 9) {
				WEBAPP_socketInBox3(Device, iId);
		  }	else if (Device.type === '14') {
				WEBAPP_contentIsAudio();
			} else if (Device.type == 22) { //Luci con dimmer RGB - VER104
		    WEBAPP_contentIsRGB(Device);
		  } else {
				var htmlToAdd = '';
		    htmlToAdd = 'FamilyID not supported: ' + Device.id + ' - ' + Device.type;
		    $('#box3').append(htmlToAdd);
		  }
		}
		/* VER169 WANDA */
		if (DISPLAY_WBS_canApplyFullscreenStyleBasedOnUserAgent()) { // VER194 WANDA
			$('#box3 h1').css('border', 'none');
		}
		/* ------------ */
	}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

function WEBAPP_contentIsAntitheft(DOMElement, iId)
{
	var htmlToAdd = '';
	iId = $(DOMElement).attr('id').replace('antifurto_', '');
	if (iId === '11') {
		htmlToAdd = '<h1>' + lblTastiera + '</h1>';
	} else if (iId === '12') {
		htmlToAdd = '<h1>' + lblAree + '</h1>';
		$.each(DOMINAPLUS_MANAGER_deviceList, function (index, val) 
		{
			if (val.typeApp == iId) {
				htmlToAdd += '<li><a id="menu_' + val.id + '"><div rel="' + val.type + '" id="menu_ico_' + val.id + '" class="ico ico' + val.type + '_0"></div>' + val.name + '</a></li>';
			}         
		});
	} else if (iId === '13') {
		htmlToAdd = '<h1>' + lblSensori + '</h1>';
	}
	$('#box3').append(htmlToAdd);
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Adds lighting HTML elements to box3
 * @param {object} DOMElement - 
 * @param {object} device - the selected device
 * @param {string} deviceID - the ID of the selected device
 * @version VER212 - WANDA
 */
function WEBAPP_lightingInBox3(DOMElement, device, deviceID)
{
	var classToAdd = '';
	var box2MenuIco = document.querySelector('#box2 #menu_ico_' + deviceID);
	if (box2MenuIco !== null) {
		classToAdd = box2MenuIco.getAttribute('class');
	}
	var dataToAdd = '';
	if (DOMElement[0].children[0].getAttribute('data-multicast_command') !== null) {
		dataToAdd = 'data-multicast_command=' + DOMElement[0].children[0].getAttribute('data-multicast_command');
	}
	var attributeToAdd = '';
	if (typeof device.isMA !== 'undefined' && device.isMA === true) {
		attributeToAdd = 'isMA=1';
	}
	if (typeof device.isNA !== 'undefined' && device.isNA === true) {
		attributeToAdd = 'isNA=1';
	}
	var htmlToAdd = '';
	if (typeof device.name !== 'undefined') {
		htmlToAdd += '<h1>' + device.name + '</h1>';
		htmlToAdd += '<div style="width: 100px; margin: 30px auto;">';
		htmlToAdd += '<a class="' + classToAdd + '" id="stato_' + deviceID + '" ' + attributeToAdd + ' ' + dataToAdd + ' onclick="WEBAPP_clickedOnLightingInBox3(event.currentTarget, ' + deviceID + ')"></a>';
		htmlToAdd += '</div>';
		/* VER212 WANDA */
		if (WEBAPP_showEnergy === true && !DISPLAY_isTS10 && typeof device.powerValue !== 'undefined') {
			htmlToAdd += '<div class="powerContainer" id="box3PowerContainer_' + deviceID + '">';
			htmlToAdd += '<div class="powerElement" id="box3PowerElement_' + deviceID + '">' + device.powerValue + ' W</div>';
			htmlToAdd += '</div>';	
		}
		/* ------------ */
		htmlToAdd += '</div>';
	}
	var box3 = document.getElementById('box3');
	if (box3 !== null) {
		box3.insertAdjacentHTML('beforeend', htmlToAdd);
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Handler of the click on the lighting element in box3
 * @param {object} element - the clicked element
 * @param {number} deviceID - the ID of the clicked element
 * @version VER267 - WANDA
 */
function WEBAPP_clickedOnLightingInBox3(element, deviceID)
{
	var isMA             = element.getAttribute('isMA');
	var isNA             = element.getAttribute('isNA');
	var multicastCommand = element.getAttribute('data-multicast_command');
	var device           = WEBAPP_getDevice(deviceID);
	if (device !== false) {
		if (DOMINAPLUS_MANAGER_webSocketAvailable) { // VER173 WANDA
			var commands = device.commands;
			// VER158 STEFANO (cambiato ordine priorità if originale)
			// START + STOP
			if (isMA !== null && parseInt(isMA) === 1) {
				DOMINAPLUS_MANAGER_sendWSCommand('EBI', deviceID + ',11');
				setTimeout('DOMINAPLUS_MANAGER_sendWSCommand("EBI", "' + deviceID + ',12");', 500);
			}
			// NO ACTION
			else if (isNA !== null && parseInt(isNA) === 1) {
				console.log('%c' + WEBAPP_PREFIX + 'Nessuna azione', 'color: ' + WEBAPP_CONSOLE_COLOR);
			}
			// ON ONLY --- VER267 WANDA
			else if (commands.length === 1 && parseInt(commands[0]) === 11) {
				DOMINAPLUS_MANAGER_sendWSCommand('EBI', deviceID + ',' + commands[0]);
			}
			// OFF ONLY --- VER267 WANDA
			else if (commands.length === 1 && parseInt(commands[0]) === 12) {
				DOMINAPLUS_MANAGER_sendWSCommand('EBI', deviceID + ',' + commands[0]);
			}
			// MULTICAST --- VER156 WANDA
			else if (multicastCommand !== null) {
				DOMINAPLUS_MANAGER_sendWSCommand('EBI', deviceID + ',' + multicastCommand);
				console.log('%c' + WEBAPP_PREFIX + 'DOMINAPLUS_MANAGER_sendWSCommand: EBI, ' + deviceID + ', ' + multicastCommand, 'color: ' + WEBAPP_CONSOLE_COLOR);	
			}
			// STEP --- VER173 WANDA
			else {
				DOMINAPLUS_MANAGER_sendWSCommand('EBI', deviceID + ',10');
			}
		} else {
			if (device.type !== 'undefined') {
				DOMINAPLUS_MANAGER_sendCommand(deviceID, device.type, WEBAPP_binCommandURL, 10); // VER230 WANDA
			}
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

function WEBAPP_contentIsDimmer(iId)
{
	var CV = (Device.currentVal != undefined) ? Device.currentVal : 0;
	console.log('%c' + WEBAPP_PREFIX + Device.name + ' - CV: ' + CV, 'color: ' + WEBAPP_CONSOLE_COLOR);
	var htmlToAdd = '';
	htmlToAdd = '<h1>' + Device.name + '</h1>';
	htmlToAdd += '<div style="width: 200px; margin: 30px auto;">';
	htmlToAdd += '<span id="cmd_minus"></span>';
	htmlToAdd += '<a id="stato_' + iId + '" class="ico ico2_' + CV + '"></a>';
	htmlToAdd += '<span id="cmd_plus"></span>';
	htmlToAdd += '<div id="drimmer_bar_val_label"></div>';
	htmlToAdd += '<div id="drimmer_bar" class="drimmer_bar_' + iId + '">';
	htmlToAdd += '<div id="drimmer_bar_val"></div>';
	htmlToAdd += '</div></div>';
	/* VER164 WANDA */
	if ($('#stage').hasClass('mapview')) {
		htmlToAdd  += '<a class="ico_50 ico_rotateleft" onclick="WEBAPP_rotateDeviceFamily(' + Device.type + ', -1);">';
		htmlToAdd  += '<span class="px-icon icon-elegant-arrow-carrot-left"></span>';
		htmlToAdd  += '</a>';
		htmlToAdd  += '<a class="ico_50 ico_rotateright" onclick="WEBAPP_rotateDeviceFamily(' + Device.type + ', 1);">';
		htmlToAdd  += '<span class="px-icon icon-elegant-arrow-carrot-right"></span>';
		htmlToAdd  += '</a>';
	}
	/* ------------ */
	$('#box3').append(htmlToAdd);
	if (CV > 0) {
		$('#box3 #drimmer_bar_val_label').html(10 + ((CV - 1) * 3) + ' %');
		/* VER236 WANDA */
		var widthValue = CV * 6;
		if (widthValue < 0) {
			widthValue = 0;
		} else if (widthValue > 186) {
			widthValue = 186;
		}
		$('.drimmer_bar_' + iId + ' #drimmer_bar_val').css('width', widthValue + 'px');
		/* ------------ */
	}

	// STATUS
	$('#stato_' + iId).click(function () 
	{ 
		if (DOMINAPLUS_MANAGER_webSocketAvailable) { // VER173 WANDA
			DOMINAPLUS_MANAGER_sendWSCommand('EBI', [Device.id, 2]); // VER173 WANDA
		} else {
			DOMINAPLUS_MANAGER_sendCommand(Device.id, Device.type, WEBAPP_binCommandURL, 2); // VER230 WANDA
		}
	});

	// MINUS --- VER119 WILLIAM
	$('#cmd_minus').mousedown(function () 
	{
		if (!$('#stato_' + iId).hasClass('ico2_0')) {
			CV = parseInt($('#drimmer_bar_val').width() / 6);
		}
		WEBAPP_buttonCount(CV, 0);
	});

	$('#cmd_minus').mouseup(function () 
	{
		if (!$('#stato_' + iId).hasClass('ico2_0')) { // VER119 WILLIAM
			WEBAPP_pollingPause = 3;
			clearTimeout(WEBAPP_buttonTimer);
			CV = CV + WEBAPP_buttonCounter; 
			WEBAPP_buttonCounter = 0;
			if (CV < 1) { // VER74 STEFANO
				if (DOMINAPLUS_MANAGER_webSocketAvailable) { // VER173 WANDA
					DOMINAPLUS_MANAGER_sendWSCommand('SIL', Device.id, 1); // VER173 WANDA
				} else {
					DOMINAPLUS_MANAGER_sendCommand(Device.id, Device.type, DOMINAPLUS_MANAGER_dimmerLevelCommandURL, 1); // VER230 WANDA
				}
			}	else {
				if (DOMINAPLUS_MANAGER_webSocketAvailable) { // VER74 STEFANO --- VER173 WANDA
					DOMINAPLUS_MANAGER_sendWSCommand('SIL', Device.id, CV); // VER173 WANDA
				} else {
					DOMINAPLUS_MANAGER_sendCommand(Device.id, Device.type, DOMINAPLUS_MANAGER_dimmerLevelCommandURL, CV); // VER230 WANDA
				}
			}
		}	else { // VER119 WILLIAM
			clearTimeout(WEBAPP_buttonTimer);
			WEBAPP_buttonCounter = 0;
		}
	});

	$('#cmd_minus').bind('drag', function () 
	{ 
		$('#cmd_minus').trigger('mouseup'); 
	});

	$('#cmd_minus').bind('touchstart', function () 
	{ 
		$('#cmd_minus').trigger('mousedown'); 
	});

	$('#cmd_minus').bind('touchend', function () 
	{ 
		$('#cmd_minus').trigger('mouseup'); 
	});

	// PLUS --- VER119 WILLIAM
	$('#cmd_plus').mousedown(function () 
	{ 
		if (!$('#stato_' + iId).hasClass('ico2_0')) {
			CV = parseInt($('#drimmer_bar_val').width() / 6);
		}
		WEBAPP_buttonCount(CV, 1); 
	});
	
	$('#cmd_plus').mouseup(function () 
	{
		if ($('#stato_' + iId).hasClass('ico2_0')) { 
			if (DOMINAPLUS_MANAGER_webSocketAvailable) { // VER173 WANDA
				DOMINAPLUS_MANAGER_sendWSCommand('EBI', Device.id + ',' + 3); // VER173 WANDA
			} else {
				DOMINAPLUS_MANAGER_sendCommand(Device.id, Device.type, WEBAPP_binCommandURL, 3); // VER230 WANDA
			}
			clearTimeout(WEBAPP_buttonTimer);
			WEBAPP_buttonCounter = 0;			
		} else {
			WEBAPP_pollingPause = 3;
			clearTimeout(WEBAPP_buttonTimer);
			CV = CV + WEBAPP_buttonCounter; 
			WEBAPP_buttonCounter = 0;
			if (CV > 31) {
				CV = 31;
			}
			if (CV < 1) { // VER119 WILLIAM
				CV = 1;
			}
			if (DOMINAPLUS_MANAGER_webSocketAvailable) { // VER74 STEFANO --- VER173 WANDA
				DOMINAPLUS_MANAGER_sendWSCommand('SIL', Device.id, CV); // VER173 WANDA
			} else {
				DOMINAPLUS_MANAGER_sendCommand(Device.id, Device.type, DOMINAPLUS_MANAGER_dimmerLevelCommandURL, CV); // VER230 WANDA
			}
		}
	});
				
	$('#cmd_plus').bind('drag', function () 
	{ 
		$('#cmd_plus').trigger('mouseup'); 
	});

	$('#cmd_plus').bind('touchstart', function () 
	{ 
		$('#cmd_plus').trigger('mousedown'); 
	});

	$('#cmd_plus').bind('touchend', function () 
	{ 
		$('#cmd_plus').trigger('mouseup'); 
	});

	$('#drimmer_bar_val').css('width', (CV * 6) + 'px');
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

function WEBAPP_contentIsShutter(iId)
{
	var CVClass = $('#box2 #menu_ico_' + iId).attr('class'); // VER183 WANDA
	if (CVClass == undefined) {
		CVClass = '0';
	}
	var CV = CVClass.replace('ico ico' + Device.type + '_', '');
	var htmlToAdd = '';
	htmlToAdd = '<h1>' + Device.name + '</h1>';
	htmlToAdd += '<div class="shutterBox" style="width: 200px; margin: 30px auto; overflow: hidden; height: 100px; opacity: 0">';
	htmlToAdd += '<a id="cmd_down"></a>';
	htmlToAdd += '<div id="stato_' + iId + '" class="ico ico' + Device.type + '_' + CV + '"></div>';
	htmlToAdd += '<a id="cmd_up"></a>';
	htmlToAdd += '</div>';
	/* VER164 WANDA */
	if ($('#stage').hasClass('mapview')) {
		htmlToAdd  += '<a class="ico_50 ico_rotateleft" onclick="WEBAPP_rotateDeviceFamily(' + Device.type + ', -1);">';
		htmlToAdd  += '<span class="px-icon icon-elegant-arrow-carrot-left"></span>';
		htmlToAdd  += '</a>';
		htmlToAdd  += '<a class="ico_50 ico_rotateright" onclick="WEBAPP_rotateDeviceFamily(' + Device.type + ', 1);">';
		htmlToAdd  += '<span class="px-icon icon-elegant-arrow-carrot-right"></span>';
		htmlToAdd  += '</a>';
	}
	/* ------------ */
	$('#box3').append(htmlToAdd);
	$('#box3 .shutterBox').fadeTo(800, 1);

	$('#cmd_down').click(function () 
	{ 
		if (DOMINAPLUS_MANAGER_webSocketAvailable) { // VER173 WANDA
			DOMINAPLUS_MANAGER_sendWSCommand('EAI', Device.id + ',' + 9); // VER173 WANDA
		} else {
			DOMINAPLUS_MANAGER_sendCommand(Device.id, Device.type, WEBAPP_analogCommandURL, 9); // VER230 WANDA
		}
	});

	$('#cmd_up').click(function () 
	{ 
		if (DOMINAPLUS_MANAGER_webSocketAvailable) { // VER173 WANDA
			DOMINAPLUS_MANAGER_sendWSCommand('EAI', Device.id + ',' + 8); // VER173 WANDA
		} else {
			DOMINAPLUS_MANAGER_sendCommand(Device.id, Device.type, WEBAPP_analogCommandURL, 8); // VER230 WANDA
		}
	});        	
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

function WEBAPP_contentIsScenario(iId)
{
	var htmlToAdd = '';
	htmlToAdd = '<h1>' + Device.name + '</h1>';
	htmlToAdd += '<div class="scenario_ico" style="width: 57%; margin: 30px 0; display: inline-block; text-align: center;">';
	htmlToAdd += '<a style="float: none; margin: auto;" id="stato_' + iId + '" class="' + $('#box2 #menu_ico_' + iId).attr('class') + '"></a>'; // VER183 WANDA
	htmlToAdd += '</div>';
	$('#box3').append(htmlToAdd);

	$('#stato_' + iId).click(function () 
	{ 
		DOMINAPLUS_MANAGER_sendCommand(Device.id, Device.type, WEBAPP_executeScenarioURL, 0); // VER230 WANDA
	});

	// VER79
	$('.scenario_ico').after('<div class="scenario_geolocal"><a class="btn" id="geo-in"><i class="px-icon icon-elegant-arrow-right-up"></i>GEO IN</a><a class="btn" id="geo-out"><i class="px-icon icon-elegant-arrow-left-down"></i>GEO OUT</a></div>'); // VER88
	if (Device.isGeoLocal == 1 || Device.isGeoLocal == 3) {
		$('.scenario_geolocal #geo-in').addClass('active').data('startactive', '1');
	}
	if (Device.isGeoLocal == 2 || Device.isGeoLocal == 3) {
		$('.scenario_geolocal #geo-out').addClass('active').data('startactive', '1');
	}

	$('.scenario_geolocal .btn').click(function()
	{
		$(this).toggleClass('active');
		var isGeoLocalTmp = 0;
		if ($('.scenario_geolocal .btn.active').length == 2) {
			isGeoLocalTmp = 3;
		} else { 
			if ($('.scenario_geolocal .btn.active#geo-in').length == 1) {
				isGeoLocalTmp = 1;
			}
			if ($('.scenario_geolocal .btn.active#geo-out').length == 1) {
				isGeoLocalTmp = 2;
			}
		}
		console.log('%c' + WEBAPP_PREFIX + 'isGeoLocalTmp: ' + isGeoLocalTmp, 'color: ' + WEBAPP_CONSOLE_COLOR);
		Device.isGeoLocal = isGeoLocalTmp;
		var mode;
		if ($(this).attr('id') == 'geo-in') {	
			mode = 'enter';
			ascenariosid = DOMINAPLUS_MANAGER_deviceList.filter(function(x) { return x.isGeoLocal == 1 || x.isGeoLocal == 3 }).map(function(x) { return x.id });
		} else {
			mode = 'exit';
			ascenariosid = DOMINAPLUS_MANAGER_deviceList.filter(function(x) { return x.isGeoLocal == 2 || x.isGeoLocal == 3 }).map(function(x) { return x.id });
		}
		var savegeolocalscenariosURL = 'savegeolocalscenarios.php';

		$.ajax({
			type: 'GET',
			url: savegeolocalscenariosURL + '?mode=' + mode + '&scenariosid=' + ascenariosid.toString(),
			dataType: 'text',
			success: function() 
			{
				DOMINAPLUS_MANAGER_deviceList.filter(function(x) { return x.typeApp == '6' }).forEach(function(obj) 
				{
					$('#box2 #menu_' + obj.id).removeClass();
					if (obj.isGeoLocal > 0) {
						$('#box2 #menu_' + obj.id).removeClass('class name').addClass('isGeolocal isGeolocal' + obj.isGeoLocal);
					}
				});
			}
		});
	});
	/* VER210 WANDA */
	var classToAdd = '';
	if (userIsAdmin === '') {
		classToAdd = 'disabledButton';
	}
	$('#box3').append('<span style="margin: 5px 20px 0 0;" class="edit_scenario px-btn px-icon icon-pencil-2 ' + classToAdd + '" title="' + lblConfigScenari + ': ' + Device.name + '"></span>');
	/* ------------ */
	/* VER169 WANDA */
	if (DISPLAY_WBS_canApplyFullscreenStyleBasedOnUserAgent()) { // VER194 WANDA
		$('.edit_scenario').css('top', '16px').css('right', '8px');
	}
	/* ------------ */

	$('.edit_scenario').click(function() 
	{
		WEBAPP_actualDevice = Device.id;
		WEBAPP_getOverHTML('webapps/webapp_legacy/settings_scenario.htm', $(this).attr('title'), 'close'); // VER218C WANDA
	});									

	$('#box3').append('<h4>' + lblProgammOrario + '<span class="add_programmazione px-btn px-icon icon-plus ' + classToAdd + '" data-name="clock-2" title="Aggiungi programmazione"></span></h4>'); // VER210 WANDA
	
	$('#box3 .add_programmazione').click(function() 
	{
		WEBAPP_actualDevice =- 1;
		WEBAPP_actualScenario = iId;
		window.currentTaskId =- 1;
		WEBAPP_getOverHTML('webapps/webapp_legacy/settings_scheduler.htm', lblProgammOrario + ': ' + Device.name, 'close'); // VER218C WANDA
	});

	$("#box3").append('<div class="programmazione_items"></div>');

	var usaBridge = false;
	if (usaBridge) { // VER103
		$.ajax({
			type: 'GET',
			url: WEBAPP_getSchedulerTaskURL,
			dataType: 'xml',
			success: function(xml) 
			{	
				$(xml).find('record').each(function()
				{												
					if ($(this).find('dato1').text() == Device.id)
					{
						taskid = $(this).find('dato0').text();
						htmlToAdd = '<div class="scenario_programma">';
						ora = $(this).find('dato4').text(); 
						if (ora.length == 1) {
							ora = '0' + ora;
						}
						minuto = $(this).find('dato5').text();
						if (minuto.length == 1) {
							minuto = '0' + minuto;
						}
						htmlToAdd += '<div class="ora"><span class="px-icon icon-clock"></span>' + ora + ':' + minuto + '</div>';
						htmlToAdd += '<div class="giorni">';
						sGiorni = WEBAPP_getByteString($(this).find('dato3').text(),7).split('').reverse().join('');
						for (i = 0; i < 7; i++) {	
							sclass = 'inactive'; 
							if (sGiorni.substr(i,1) == '1') {
								sclass = 'active';
							}
							htmlToAdd += '<span class="' + sclass + '">' + WEBAPP_daysArray[i + 1] + '</span>';
						}
						htmlToAdd += '</div><span data-id="' + taskid + '" title="Modifica programmazione" class="edit_programmazione px-btn px-icon icon-pencil-2"></span><div class="mesi">'; // VER210 WANDA										
						sMesi = WEBAPP_getByteString($(this).find('dato2').text(),12).split('').reverse().join('');
						for (i = 0; i < 12; i++) {	
							sclass = 'inactive';
							if (sMesi.substr(i,1) == '1') {
								sclass = 'active';
							}	
							htmlToAdd += '<span class="' + sclass + '">' + WEBAPP_monthsArray[i + 1] + '</span>';
						}																								
						htmlToAdd += '</div></div>';
						$('#box3 .programmazione_items').append(htmlToAdd);

						$('#box3 .edit_programmazione').click(function() 
						{
							WEBAPP_actualDevice = $(this).data('id');
							WEBAPP_getOverHTML('webapps/webapp_legacy/settings_scheduler.htm', lblProgammOrario + ' ' + Device.name, 'close'); // VER218C WANDA
						});												
					}											
				});
				WEBAPP_setPagination($('#box3 .programmazione_items'), 3);
			},
			error: function() 
			{ 
				if (WEBAPP_debugFlag) {
					WEBAPP_debug('error: Loading device list');
				}
			}
		});
	} else { // VER103
		WEBAPP_actualDevice = Device.id;
		setTimeout('DOMINAPLUS_MANAGER_sendWSCommand("GST");', 300); // VER173 WANDA
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Adds socket HTML elements to box3
 * @param {object} device - the selected device
 * @param {string} deviceID - the ID of the selected device
 * @version VER230 - WANDA
 */
function WEBAPP_socketInBox3(device, deviceID)
{
	var classToAdd = '';
	var box2MenuIco = document.querySelector('#box2 #menu_ico_' + deviceID);
	if (box2MenuIco !== null) {
		classToAdd = box2MenuIco.getAttribute('class');
	}
	var htmlToAdd = '';
	if (typeof device.name !== 'undefined') {
		htmlToAdd += '<h1>' + device.name + '</h1>';
		htmlToAdd += '<div style="width: 100px; margin: 30px auto;">';
		htmlToAdd += '<a class="' + classToAdd + '" id="stato_' + deviceID + '" onclick="WEBAPP_clickedOnSocketInBox3(' + deviceID + ')"></a>';
		htmlToAdd += '</div>';
		/* VER212 WANDA */
		if (WEBAPP_showEnergy === true && !DISPLAY_isTS10 && typeof device.powerValue !== 'undefined') {
			htmlToAdd += '<div class="powerContainer" id="box3PowerContainer_' + deviceID + '">';
			htmlToAdd += '<div class="powerElement" id="box3PowerElement_' + deviceID + '">' + device.powerValue + ' W</div>';
			htmlToAdd += '<div class="powerGraphElement" id="box3PowerGraphElement_' + deviceID + '" onclick="WEBAPP_clickOnEnergyGraph(' + deviceID + ')"></div>';
			htmlToAdd += '</div>';
		}
		/* ------------ */
	}
	var box3 = document.getElementById('box3');
	if (box3 !== null) {
		box3.insertAdjacentHTML('beforeend', htmlToAdd);
	}           	
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Handler of the click on the socket element in box3
 * @param {number} deviceID - the ID of the clicked element
 * @version VER230 - WANDA
 */
function WEBAPP_clickedOnSocketInBox3(deviceID)
{
	if (DOMINAPLUS_MANAGER_webSocketAvailable) { // VER173 WANDA
		DOMINAPLUS_MANAGER_sendWSCommand('EBI', deviceID + ',' + 10); // VER61 (it was 11) --- VER173 WANDA
	} else {
		var device = WEBAPP_getDevice(deviceID);
		if (device !== false && typeof device.type !== 'undefined') {
			DOMINAPLUS_MANAGER_sendCommand(deviceID, device.type, WEBAPP_binCommandURL, 10) // VER61, prima era 11 - VER230 WANDA
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

function WEBAPP_contentIsAudio()
{
  /* VER164 WANDA */
	// Opening audio file config
	WEBAPP_actualDevice = CurrentIndex + 1;
	WEBAPP_getOverHTML('webapps/webapp_legacy/settings_audio.htm', 'Zona audio: ' + Device.name, 'close'); // VER218C WANDA
	/* ------------ */
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

function WEBAPP_contentIsIPCam(iId) // VER192B WANDA
{
	var htmlToAdd = '';
	// FF qui modifica per IE
	var iId_request = parseInt(iId);
	if (DOMINAPLUS_MANAGER_isRemoteChannel()) { // VER173 WANDA
		iId_request += 100000;
	} 

	$.ajax({
		ype: 'GET',
		url: WEBAPP_IPCamURL + '&parameter=' + iId_request,
		dataType: 'xml',
		success: function(xml) 
		{
			var uri = $(xml).find('dato0').text();
			if (uri.substr(0,9) == 'custom_no') {	// ipcam non valida
				uri = uri.replace('custom_no', '');
				if (uri != '') {
					window.open(uri);
				} else {
					htmlToAdd = '<h1>IPCAM: ' + Device.name + '</h1>';
					// htmlToAdd += '<iframe src="http://10.30.7.181\' id="frm_ipcam" scrolling="no" allowtransparency="true" frameborder="0" style="width: 94%; height: 400px; margin: 20px 0 0 3%;"></iframe>';
					htmlToAdd += '<div id="btn_close"><span title="' + lblChiudi + '" class="px-btn px-icon icon-close"></span></div>'; // VER75
					// htmlToAdd += '<a id="btn_close" class="boxOver_btn" href="javascript: void(0);" title="' + lblChiudi + '"></a>';								
					htmlToAdd += '<h2 class="camera_error">' + configurazioneTelecameraErrata + '</h2>';
					$('#boxOver').html(htmlToAdd);
					$('#boxOver').fadeIn('slow');
			
					$('#boxOver #btn_close').click(function()
					{ 
						$('#box3 #btn_close').click();
						$('#boxOver').fadeOut('slow')
					});
				}
			}	else {
				if ((navigator.appName == 'Microsoft Internet Explorer') && (navigator.platform != 'MacPPC') && (navigator.platform != 'Mac68k')) {
					(uri.indexOf('https://') == 0) ? type = 'https://' : type = 'http://';
					var plugin = uri.substr(uri.indexOf('/', type.length));
					var iPort = '';
					var ip = '';
					if (uri.indexOf('@') >=0 ) {
						var user = uri.substr(type.length, uri.indexOf('@') - type.length);
						var pass = user.substr(user.indexOf(':') + 1);
						user = user.substr(0, user.indexOf(':'));
						ip = uri.substr(uri.indexOf('@') + 1, uri.indexOf('/', type.length) - uri.indexOf('@') - 1);
					} else {	
						var user = '';
						var pass = '';
						ip = uri.substr(type.length, uri.indexOf('/', type.length) - type.length);
					}
					if (ip.indexOf(':') >=0 ) {
						iPort = ip.substr(ip.indexOf(':') + 1);
						ip = ip.substr(0, ip.indexOf(':'));
					}					
					htmlToAdd = '<h1>IPCAM: ' + Device.name + '</h1>';
					htmlToAdd += '<div style="display: none;">';
					htmlToAdd += '<div id="ipcam_uri">' + uri + '</div>';
					htmlToAdd += '<div id="ipcam_type">' + type + '</div>';
					htmlToAdd += '<div id="ipcam_ip">' + ip + '</div>';
					htmlToAdd += '<div id="ipcam_port">' + iPort + '</div>';
					htmlToAdd += '<div id="ipcam_user">' + user + '</div>';
					htmlToAdd += '<div id="ipcam_pass">' + pass + '</div>';
					htmlToAdd += '<div id="ipcam_plugin">' + plugin + '</div>';									
					htmlToAdd += '</div>';
					htmlToAdd += '<iframe src="ipcam.html" id="frm_ipcam" scrolling="no" allowtransparency="true" frameborder="0" style="width: 565px; height: 400px; margin: 20px 0 0 117px;"></iframe>';
					htmlToAdd += '<div id="btn_close"><span title="' + lblChiudi + '" class="px-btn px-icon icon-close"></span></div>'; // VER75
					// htmlToAdd += '<a id="btn_close" class="boxOver_btn" href="javascript: void(0);" title="' + lblChiudi + '"></a>';
					$('#boxOver').html(htmlToAdd);
					$('#boxOver').fadeIn('slow');

					$('#boxOver #btn_close').click(function()
					{
						$('#box3 #btn_close').click();
						$('#boxOver').fadeOut('slow')
					});									
				}	else {
					htmlToAdd = '<h1>IPCAM: ' + Device.name + '</h1>';
					// htmlToAdd += '<div id="box_IPCam_player"></div>';
					var uri = $(xml).find('dato0').text();
					if (iId_request > 100000) {	// CONNESSIONE DA REMOTO		
						uri = uri.replace('###***###', location.hostname);
					}
					htmlToAdd += '<div id="box_IPCam_player"><img src="' + uri + '"/></div>';
					htmlToAdd += '<div id="btn_close"><span title="' + lblChiudi + '" class="px-btn px-icon icon-close"></span></div>'; // VER75
					// htmlToAdd += '<a id="btn_close" class="boxOver_btn" href="javascript: void(0);" title="' + lblChiudi + '"></a>';
					$('#boxOver').html(htmlToAdd);
					$('#boxOver').fadeIn('slow');

					$('#boxOver #btn_close').click(function()
					{
						$('#box3 #btn_close').click();
						$('#boxOver').fadeOut('slow')
					});
				}
			}
		},
		error: function () 
		{ 
			if (WEBAPP_debugFlag) {
				WEBAPP_debug('error: Loading IPCAM');
			}
		}
	});
}

	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
	
	function WEBAPP_setBox2Scroll(obj, nrMax)
	{	
		/* VER212 WANDA */
		if (window.innerWidth <= DISPLAY_widthOrientationChange) {
			if (obj === '#box2') {
				$(obj).children().not('.box_navbar').wrapAll('<div id="box2InnerContainer"></div>');
				var box2InnerContainer = document.getElementById('box2InnerContainer');
				if (box2InnerContainer !== null) {
					box2InnerContainer.style.height = 'calc(' + window.innerHeight + 'px - 55px)';
				}
			}
			return;
		}
		/* ------------ */
		if (obj=="") obj="#box2";
		if (nrMax==0) nrMax=9;
		
		if ($(obj+" li>a").length>nrMax) 
			{
				if (WEBAPP_debugFlag) {
					WEBAPP_debug(obj + ' aggiungi scroll');
				}
			
			/*
			sTmp="<div id=\"box2cont\"><ul>"
			sTmp+=$(obj).html();
			sTmp+="</ul></div>"
			sTmp+="<a  id=\"box2_prev\"></a>"
			sTmp+="<a  id=\"box2_next\"></a>"			
			$(obj).html(sTmp)
			
			sTmp=$("<div id=\"box2cont\"><ul></ul></div>")
			$(sTmp).find("ul").append($(obj).clone());
			$(sTmp).append("<a  id=\"box2_prev\"></a>");
			$(sTmp).append("<a  id=\"box2_next\"></a>");
			$(obj).html("").append($(sTmp));
			*/

			$(obj).wrapInner("<div id=\"box2cont\"><ul></ul></div>"); //VER122
			$(obj).append("<a  id=\"box2_prev\"></a>");
			$(obj).append("<a  id=\"box2_next\"></a>");
			


			$(obj+"#box2_prev").css("opacity","0.5");
			var iM=$("#box2cont").height();

			$(obj+" #box2_prev").click(function() {
				var iT=0;	iT=parseInt($(obj+" #box2cont>ul").css("top").replace("px",""));			
				var iH=$(obj+" #box2cont>ul").height();
				$(obj+" #box2cont>ul").css("top", (iT+iM < 0) ? (iT+iM)+"px" : "0");
				//$("#box2cont>ul").animate({top: (iT+iM < 0) ? (iT+iM)+"px" : "0"},1000);
				$(obj+" #box2_prev").css("opacity" , ($(obj+" #box2cont>ul").css("top")=="0px") ? "0.5" : "1" );
				$(obj+" #box2_next").css("opacity" , "1" );				
				/* if (WEBAPP_debugFlag) {
						WEBAPP_debug($('#box2cont > ul').css('top') + ' - ' + iT + ' - ' + iM); 
					}
				*/
			});
			
			$(obj+" #box2_next").click(function() {
				var iT=$(obj+" #box2cont>ul").css("top").replace("px","");
				var iH=$(obj+" #box2cont>ul").height();
				$(obj+" #box2cont>ul").css("top", (iT-iM > -iH) ? iT-iM+"px" : iT+"px");
				//$("#box2cont>ul").animate({top: (iT-iM > -iH) ? iT-iM+"px" : iT+"px"},1000);	

				$(obj+" #box2_prev").css("opacity","1" );
				$(obj+" #box2_next").css("opacity" , (iT-iM-iM >= -iH) ? "1" : "0.5" );
				if (WEBAPP_debugFlag) {
					WEBAPP_debug(iH + ' - ' + iT + ' - ' + iM);
				}
			});
		} else {
			if (WEBAPP_debugFlag) {
				WEBAPP_debug(obj + ' rimuovi scroll');
			}
		}
	}

	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
	
	function WEBAPP_setPagination(obj, nrMax, nrCol, showInMobile)
	{	
		if (showInMobile==undefined) showInMobile=false;
		if (showInMobile==false) {
			if ($(window).width()<=DISPLAY_widthOrientationChange) return; // VER170 WANDA
		}
		if (obj=="") return;
		if (nrMax==0) return;
		nrCol = nrCol || 1;
		
		//VER76
		if ($(obj).find(" .paginazione_wrapper").length>0)
		{
			var tmp = $(obj).find(" .paginazione_cont").clone(true);
			$(obj).find(" .paginazione_wrapper").before(tmp.children());
			$(obj).find(" .paginazione_wrapper").remove();
			$(obj).find(" .paginazione_btn").remove();
		}

		if ($(obj).children().length > nrMax) {
			if (WEBAPP_debugFlag) {
				WEBAPP_debug('aggiungi paginazione');
			}
			
			sTmp="<div class=\"paginazione_wrapper\"><div class=\"paginazione_cont\">"
			sTmp+="</div></div>"
			sTmp+="<div class=\"paginazione_btn\">"
			sTmp+="<a class=\"paginazione_prev\"></a>"
			sTmp+="<a class=\" paginazione_next\"></a>"
			sTmp+="</div>"
			var clone=$(obj).children().clone(true);
			$(obj).html(sTmp)
			$(obj).find(".paginazione_cont").append(clone);
			var iM=$(obj).find(".paginazione_cont").height();//VER97

			$(obj).find(".paginazione_btn a.paginazione_prev").css("opacity","0.5");
			var itemH=$(obj).find(".paginazione_cont").children().outerHeight(true);
			if (WEBAPP_logPagination) {
				console.log('%c' + WEBAPP_PREFIX + itemH, 'color: ' + WEBAPP_CONSOLE_COLOR);
			}
			var ContH=(itemH*nrMax/nrCol);//+30;
			//var ContH=(itemH*nrMax)+30;
			$(obj).find(".paginazione_wrapper").height(ContH).css("overflow","hidden");
			
			if (WEBAPP_logPagination) {
				console.log('%c' + WEBAPP_PREFIX + 'altezzaOggetto: ' + iM, 'color: ' + WEBAPP_CONSOLE_COLOR);
			}
			
			$(obj).find(".paginazione_prev").click(function() {
				var iT=0;	iT=parseInt($(obj).find(".paginazione_cont").css("top").replace("px",""));			
				$(obj).find(".paginazione_cont").stop(true,false).animate({top: (iT+ContH < 0) ? (iT+ContH)+"px" : "0px"},800, 
					function(){
					//$(obj).find(".paginazione_cont").css("top", (iT+iM < 0) ? (iT+iM)+"px" : "0");
					$(obj).find(".paginazione_prev").css("opacity" , ($(obj).find(".paginazione_cont").css("top")=="0px") ? "0.5" : "1" );
					$(obj).find(".paginazione_next").css("opacity" , "1" );
				});
			});
			
			$(obj).find(".paginazione_next").click(function() {
				var iT=0;	iT=$(obj).find(".paginazione_cont").position().top; 
				console.log('%c' + WEBAPP_PREFIX + 'iT: ' + iT + ' - ContH: ' + ContH + ' - iM: ' + iM, 'color: ' + WEBAPP_CONSOLE_COLOR);
				$(obj).find(".paginazione_cont").stop(true,false).animate({top: (iT-ContH > -iM) ? (iT-ContH)+"px" : iT+"px"},800, 
					function(){
					//$(obj).find(".paginazione_cont").css("top", (iT-ContH > -iM) ? iT-ContH+"px" : iT+"px");
					$(obj).find(".paginazione_prev").css("opacity","1" );
					$(obj).find(".paginazione_next").css("opacity" , (iT-ContH-ContH >= -iM) ? "1" : "0.5" );
				});
			});
			}
		else
			{}
		
		/* VER92 */
		if (window.innerWidth > DISPLAY_widthOrientationChange && document.cookie.indexOf('viewmode=devicemode') >= 0) { // VER170 WANDA
			if (document.getElementsByClassName('edit_scenario')[0] !== undefined) { // VER172 WANDA
				document.getElementsByClassName('edit_scenario')[0].style.marginTop = '5px';
				document.getElementsByClassName('edit_scenario')[0].style.marginRight = '20px';
			}
			if (document.getElementsByClassName('paginazione_btn').length > 0)
				document.getElementsByClassName('paginazione_btn')[0].style.marginTop = '5px'; // VER104
		}
		/* ----- */
	}
	
	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

	function WEBAPP_setAreasScroll()
	{	
		if ($("#boxAree_dx_cont li>a").length>4) 
			{
			var sTmp;
			// WEBAPP_debug('aggiungi scroll');
			sTmp="<a  id=\"boxAree_prev\"><span class=\"px-icon icon-arrow-up-2\"></span></a>"
			sTmp+="<a  id=\"boxAree_next\"><span class=\"px-icon icon-arrow-down-2\"></span></a>"			
			$("#boxAree").append(sTmp);
			$("#boxAree_prev").css("opacity","0.5");
			var iM=40;

			$('#boxAree_prev').click(function() 
			{
				if (WEBAPP_scrollAreaMove == false) {
					WEBAPP_scrollAreaMove = true;
					var iT = 0;	
					iT = parseInt($('#boxAree_dx_cont').css('top').replace('px', ''));			
					var iH = $('#boxAree_dx_cont').height();
					$('#boxAree_dx_cont').animate({ top: (iT + iM < 0) ? (iT + iM) + 'px' : '0px' }, 600, function() 
					{
						$('#boxAree_prev').css('opacity', ($('#boxAree_dx_cont').css('top') == '0px') ? '0.5' : '1');
						$('#boxAree_next').css('opacity', '1');
						WEBAPP_scrollAreaMove = false;	
					});
				}
				/* if (WEBAPP_debugFlag) {
						WEBAPP_debug($('#boxAree_dx_cont').css('top') + ' - ' + iT + ' - ' + iM);
					}
				*/
			});
			
			$("#boxAree_next").click(function() 
			{
				if (WEBAPP_scrollAreaMove == false) {
					WEBAPP_scrollAreaMove = true;
					var iT = $('#boxAree_dx_cont').css('top').replace('px', '');
					var iH = $('#boxAree_dx_cont').height();
					$('#boxAree_dx_cont').animate({ top: (iT - iM > -iH) ? iT - iM + 'px' : iT + 'px' }, 600, function() 
					{
						$('#boxAree_prev').css('opacity', '1');
						$('#boxAree_next').css('opacity', (iT - iM - iM > -iH) ? '1' : '0.5');
						WEBAPP_scrollAreaMove = false;
					});
				}
				// WEBAPP_debug(iH + ' - ' + iT + ' - ' + iM);
			});	
			}
		else {
			/* if (WEBAPP_debugFlag) {
					WEBAPP_debug('rimuovi scroll');
				} 
			*/
		}
		/* VER169 WANDA */
		if (DISPLAY_WBS_canApplyFullscreenStyleBasedOnUserAgent()) { // VER194 WANDA
			$('#boxAree_prev').css('top', '3px');
			$('#boxAree_next').css('top', '3px');
		}
		/* ------------ */
	}

	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

	function WEBAPP_buttonCount(cv, move)
	{ 
		(move == 1) ? WEBAPP_buttonCounter++ : WEBAPP_buttonCounter--;
		cv = parseInt(cv);
		/* VER74 STEFANO */ // $('#drimmer_bar_val').css('width', ((cv + WEBAPP_buttonCounter) * 6) + 'px');
		if (cv + WEBAPP_buttonCounter < 31 && cv + WEBAPP_buttonCounter > 0) {
			WEBAPP_buttonTimer = setTimeout('WEBAPP_buttonCount(' + cv + ',' + move + ')', WEBAPP_buttonPressTimer);
		}
		/* ------------- */
	}

	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

	function WEBAPP_getDevicesByFamily(iID)
	{
		var DeviceListTmp = new Array();
		for (var i = 0; i < DOMINAPLUS_MANAGER_deviceList.length; i++) {
			if (DOMINAPLUS_MANAGER_deviceList[i].type == iID) {
				DeviceListTmp.push(DOMINAPLUS_MANAGER_deviceList[i]);
			}
		}
		return DeviceListTmp;
	}

	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

	function WEBAPP_updateBox2Status() 
	{		
		var iIdFamily = $("#box2 li>a>div").attr("rel");
		if (iIdFamily > 0) {		    
		  switch (iIdFamily)
			
			{ 
				case "12":
					if (DOMINAPLUS_MANAGER_webSocketAvailable) { // VER173 WANDA
						DOMINAPLUS_MANAGER_sendWSCommand('GSF', '12'); // VER173 WANDA
					} else {
						WEBAPP_getDeviceFamilyStatus(0, iIdFamily);
					}
					break;
				case "13":
					if (DOMINAPLUS_MANAGER_webSocketAvailable) { // VER173 WANDA
						DOMINAPLUS_MANAGER_sendWSCommand('WSF', '13'); // VER173 WANDA
					} else {
						WEBAPP_getDeviceFamilyStatus(0, iIdFamily);
					}
					break;
				case "1":
				case "2": //VER 108
				case "22": //VER 108
					// WEBAPP_updateBox2StatusCounter == 1 ? WEBAPP_updateBox2StatusCounter = 2 : WEBAPP_updateBox2StatusCounter = 1;		
					if (DOMINAPLUS_MANAGER_webSocketAvailable) // VER173 WANDA
					{	
						/****VER125*** REMOVED					
						DOMINAPLUS_MANAGER_sendWSCommand("WSF","1");
						setTimeout(DOMINAPLUS_MANAGER_sendWSCommand("WSF","2"),200);
						setTimeout(DOMINAPLUS_MANAGER_sendWSCommand("WSF","22"),400); //VER 108
						/****VER125***/
					}	else {
						WEBAPP_getDeviceFamilyStatus(0, 1);
						setTimeout(WEBAPP_getDeviceFamilyStatus(0, 2), 200);
					}
					break;
				case "3":			
					if (DOMINAPLUS_MANAGER_webSocketAvailable) // VER173 WANDA
					{	
						/* VER173 WANDA */
						DOMINAPLUS_MANAGER_sendWSCommand('WSF', '3');
						setTimeout('DOMINAPLUS_MANAGER_sendWSCommand("WSF", "16")', 200);
						setTimeout('DOMINAPLUS_MANAGER_sendWSCommand("WSF", "19")', 400);
						/* ------------ */
					} else {
						WEBAPP_getDeviceFamilyStatus(0, 3);
						setTimeout(WEBAPP_getDeviceFamilyStatus(0, 16), 200);
						setTimeout(WEBAPP_getDeviceFamilyStatus(0, 19), 400);
					}
					break;
				/*case "4":
					if (DOMINAPLUS_MANAGER_webSocketAvailable) { // VER173 WANDA
						DOMINAPLUS_MANAGER_sendWSCommand('GSF', '4');
					} else {
						WEBAPP_getDeviceFamilyStatus(0, iIdFamily);
					}
					break;
				*/
				default:
					WEBAPP_getDeviceFamilyStatus(0, iIdFamily);
			}	
		}
		clearTimeout(WEBAPP_timer1);
		/* if (iIdFamily > 0) {
				WEBAPP_timer1 = setTimeout('WEBAPP_updateBox2Status()', WEBAPP_updateStatusTimer); 
			}
		*/
	}

	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
	
	function WEBAPP_getDeviceFamilyStatus(iId, iIdFamily)
	{
		if ($('#boxOver:visible').length > 0) {
			return;
		}
		if (WEBAPP_pollingPause > 0) {
			WEBAPP_pollingPause--;
		} else {
			$.ajax({
				type: 'GET',
				url: WEBAPP_deviceFamilyStatusURL + '&parameter=' + iIdFamily + '&rnd=' + Math.random(),
				dataType: 'xml',
				success: function(xml) 
				{
					$(xml).find('record').each(function()
					{				
						sId = $(this).find('dato0').text();
						stato = $(this).find('dato1').text();
						$('#box2 #menu_ico_' + sId).removeClass().addClass('ico ico' + iIdFamily + '_' + stato); // VER183 WANDA
						$('#stato_' + sId).removeClass().addClass('ico ico' + iIdFamily + '_' + stato);
						if (iIdFamily == 2) {
							$('.drimmer_bar_' + sId + ' #drimmer_bar_val').css('width', (stato * 6) + 'px');
						}
					});
				},
				error: function() 
				{ 
					if (WEBAPP_debugFlag) {
						WEBAPP_debug('error: Loading device status (' + iId + ')');
					}
				}
			});	
		}
	}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
		
	function WEBAPP_debug(str)
	{ 
		var currentTime = new Date()
		var hours = currentTime.getHours()
		var minutes = currentTime.getMinutes()
		var seconds = currentTime.getSeconds()
		if (minutes < 10)	minutes = "0" + minutes;
		if (seconds < 10)	seconds = "0" + seconds;

		//$("#debug").html(hours + ":" + minutes + ":" + seconds+": "+str+"<br>"+$("#debug").html());
	}	

	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
		
	function WEBAPP_getOverHTML(url, title, btn)
	{	
		/* -------- VER254 LORENZO -------- */
		if (typeof WEBAPP_onBeforePageUnload === 'function')
		{
			WEBAPP_onBeforePageUnload();

			window.WEBAPP_onBeforePageUnload = null;
		}
		/* ------------------------------ */
		
		var boxOver = document.getElementById('boxOver');
		var boxOverTitle = document.querySelector('#boxOver h1');
		if (btn == 'back') {
			if (boxOver !== null) {
				WEBAPP_backURL = boxOver.getAttribute('data-url');
				WEBAPP_backButton = boxOver.getAttribute('data-btn');
			}
			if (boxOverTitle !== null) {
				WEBAPP_backTitle = boxOverTitle.innerHTML;
			}
		}
		var request = new XMLHttpRequest();
		request.open('GET', url, false); // 'false' makes the request synchronous
		request.send(null);
		if (request.readyState === 4) {
			if (request.status === 200) {
				var htmlToAdd = '';
				htmlToAdd += '<h1>' + title + '</h1>';
				if (btn === 'close') {
					htmlToAdd += '<div id="btn_close" onclick="WEBAPP_clickedOnCloseBoxOver()">';
					htmlToAdd += '<span class="px-btn px-icon icon-close" title="' + lblChiudi + '"></span>';
					htmlToAdd += '</div>';
				}
				if (btn === 'back') {
					htmlToAdd += '<div id="btn_back" onclick="WEBAPP_clickedOnBackBoxOver(\'' + url + '\')">';
					htmlToAdd += '<span class="px-btn px-icon icon-close" title="' + lblIndietro + '"></span>';
					htmlToAdd += '</div>';
				}
				htmlToAdd += request.responseText;
				if (boxOver !== null) {
					boxOver.setAttribute('data-url', url);
					boxOver.setAttribute('data-btn', btn);
					$('#boxOver').html(htmlToAdd);
					boxOver.style.display = 'block';
				}
			} else {
				console.log('%c' + WEBAPP_PREFIX + 'Error in loading ' + url + WEBAPP_CONSOLE_ERROR);
			}
		}	
  }

	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

	/**
	 * Closes the boxOver
	 * @version VER230 - WANDA
	 */
	function WEBAPP_clickedOnCloseBoxOver()
	{
		clearTimeout(WEBAPP_timer2);
		clearTimeout(WEBAPP_consumptionTimer);
		WEBAPP_backURL = '';
		WEBAPP_backTitle = '';
		WEBAPP_backButton = '';
		var boxOver = document.getElementById('boxOver');
		if (boxOver !== null) {
			boxOver.style.display = 'none';
		}
		/* VER170 WANDA */
		if (window.isOnThermoAdvancedPage === true) {
			window.isOnThermoAdvancedPage = false;
		}
		/* VER205B WANDA */
		if (window.isConsumptionPageOpen === true) {
			window.isConsumptionPageOpen = false;
			WEBAPP_economizerStopPolling();
			var menu5 = document.getElementById('menu_5');
			if (menu5 !== null) {
				menu5.className = '';
			}
		}
		/* ------------ */
		if (window.isSystemInfoPageOpen === true) {
			window.isSystemInfoPageOpen = false;
		}
		/* ------------ */
	}

	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

	function WEBAPP_clickedOnBackBoxOver(url) {
		clearTimeout(WEBAPP_timer2);
		clearTimeout(WEBAPP_consumptionTimer);
		if (url === 'webapps/webapp_legacy/settings_datetime.htm') { // VER218C WANDA
			WEBAPP_getCloudDateTimeConfiguration(); // VER229 WANDA
			WEBAPP_getOverHTML(WEBAPP_settingsMenuURL, lblSettingsMenu, 'close');
		} else {
			if (url === 'webapps/webapp_legacy/settings_webcontrol.htm' || url === 'webapps/webapp_legacy/settings_advanced.htm' || url === 'webapps/webapp_legacy/settings_external.htm') { // VER296 WANDA
				/* VER204 WANDA */
				if (url === 'webapps/webapp_legacy/settings_advanced.htm' || url === 'webapps/webapp_legacy/settings_external.htm') { // VER296 WANDA
					WEBAPP_backURL = WEBAPP_settingsMenuURL;
					WEBAPP_backTitle = lblSettingsMenu;
					WEBAPP_backButton = 'close';
				}
				/* ------------ */
				if (!DOMINAPLUS_MANAGER_isChannelActive()) { // VER173 WANDA
					WEBAPP_customAlert(lblCustomAlertText, lblCustomAlertTitle);
					WEBAPP_progressContentCustomAlert(); // Not blocking
					var waitTotalMilliseconds = 10000;
					if (parseInt(location.pathname.indexOf('/access')) === 0) { // Remote
						waitTotalMilliseconds = 15000;
					}
					setTimeout('WEBAPP_closeCustomAlert()', waitTotalMilliseconds); // Waiting server to relaunch
				}	else {
					WEBAPP_closeCustomAlert(); // It works even if customAlert is not effectively loaded
					WEBAPP_getOverHTML(WEBAPP_backURL, WEBAPP_backTitle, WEBAPP_backButton);
				}
			}
			/* VER211 WANDA */
			else if (url === 'webapps/webapp_legacy/consumi.htm') { // VER218C WANDA
				if (WEBAPP_clickedOnConsumptionInBox1 === true) {
					WEBAPP_clickedOnCloseBoxOver();
				} else {
					WEBAPP_backURL = WEBAPP_settingsMenuURL;
					WEBAPP_backTitle = lblSettingsMenu;
					WEBAPP_backButton = 'close';
					WEBAPP_getOverHTML(WEBAPP_backURL, WEBAPP_backTitle, WEBAPP_backButton);
				}
			} else if (url === 'webapps/webapp_legacy/settings_multiplier.htm') { // VER218C WANDA
				WEBAPP_backURL = 'webapps/webapp_legacy/consumi.htm'; // VER218C WANDA
				WEBAPP_backTitle = lblContabilizzatoreConsumi;
				WEBAPP_backButton = 'back';
				WEBAPP_getOverHTML(WEBAPP_backURL, WEBAPP_backTitle, WEBAPP_backButton);
			}
			/* ------------ */		
			else if (url === 'webapps/webapp_legacy/settings_charts.htm') { // VER218C WANDA
				if (typeof SETTINGS_CHARTS_chart !== 'undefined' && SETTINGS_CHARTS_chart !== null) { // VER192I WANDA
					SETTINGS_CHARTS_chart.destroy();
				}
				if (WEBAPP_clickedOnEnergyChartsInBox2Box3 === true) {
					WEBAPP_clickedOnCloseBoxOver();
				} else {
					WEBAPP_backURL = WEBAPP_settingsMenuURL;
					WEBAPP_backTitle = lblSettingsMenu;
					WEBAPP_backButton = 'close';
					WEBAPP_getOverHTML(WEBAPP_backURL, WEBAPP_backTitle, WEBAPP_backButton);
				}
			}
			/* -------- VER225 LORENZO -------- */
			else if (url === 'webapps/webapp_legacy/access_control/access_history.htm') {
				WEBAPP_backURL = WEBAPP_settingsMenuURL;
				WEBAPP_backTitle = lblSettingsMenu;
				WEBAPP_backButton = 'close';
				WEBAPP_getOverHTML(WEBAPP_backURL, WEBAPP_backTitle, WEBAPP_backButton);
			} else if (url === 'webapps/webapp_legacy/access_control/access_manager.htm') {

				/* -------- VER242 LS+WB -------- */
				if (typeof WEBAPP_onBeforePageUnload === 'function')
				{
					WEBAPP_onBeforePageUnload();

					window.WEBAPP_onBeforePageUnload = null;
				}
				/* ------------------------------ */
				
				WEBAPP_backURL = 'webapps/webapp_legacy/access_control/access_history.htm';
				WEBAPP_backTitle = lblAccessHistory;
				WEBAPP_backButton = 'back';
				WEBAPP_getOverHTML(WEBAPP_backURL, WEBAPP_backTitle, WEBAPP_backButton);
			}
			/* ------------ */		
			else {
				/* VER216 WANDA */
				if (typeof ECONOMIZERCHART_chart !== 'undefined' && ECONOMIZERCHART_chart !== null) {
					ECONOMIZERCHART_chart.destroy();
				}
				/* ------------ */
				WEBAPP_closeCustomAlert(); // VER285 WANDA
				WEBAPP_getOverHTML(WEBAPP_backURL, WEBAPP_backTitle, WEBAPP_backButton);
			}
		}
	}

	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages an iFrame
 * @param {string} url 	 - the src of the iFrame
 * @param {string} title - title to show
 * @version VER230 - WANDA
 */
function WEBAPP_getOveriFrame(url, title)
{
	if ($('#boxOver:visible #settings_menu').length > 0) {
		window.backto_settingsmenu = true;
	} 
	var htmlToAdd = '<h1>' + title + '</h1>';
	htmlToAdd += '<div id="btn_close"><span title="' + lblChiudi + '" class="px-btn px-icon icon-close"></span></div>';
	htmlToAdd += '<iframe id="iframe1" src="' + url + '"></iframe>';
	$('#boxOver').data('url', url).html(htmlToAdd);
	/* VER230 WANDA */
	var iframe1 = document.getElementById('iframe1');
	if (iframe1 !== null) {
		iframe1.addEventListener('load', function() {
			if (iframe1.contentDocument !== null) {
				var iframe1Title = iframe1.contentDocument.title;
				if (iframe1Title.indexOf('404') >= 0) {
					var iframe1Body = iframe1.contentDocument.body;
					iframe1Body.innerHTML = '<p id="iframe1AntitheftError" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); margin: 0; color: #FFF; text-align: center; font-size: 28px;">' + lblIFrameAntitheftError + '</p>';
				}
			}
		});
	}
	/* ------------ */
	$(window).scrollTop(0);
	$('#boxOver').fadeIn(WEBAPP_fadeInSpeed);
	$('#boxOver #btn_close').click(function() {
		window.frames[0].postMessage('getCurrentLocation', '*');
		// If antitheft central does not answer then close it
		setTimeout(function() {
			if (WEBAPP_windowMessageArrived === false) {
				WEBAPP_closeBoxOverAndOpenSettings();
			}
		}, 2000);
	});
	// COMANDO BACK
	// document.getElementById('iframe1').contentWindow.location.href="http://avecloudtest.ave.it/access2/#command=back" 
}
/* ------------ */

	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
   
function WEBAPP_closeBoxOverAndOpenSettings() 
{
	clearTimeout(WEBAPP_timer2);
	clearTimeout(WEBAPP_consumptionTimer);
	$('#boxOver').fadeOut(WEBAPP_fadeOutSpeed);
	if (window.backto_settingsmenu) {
		window.backto_settingsmenu = undefined;
		$('#box1 #btn_menu').click();
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Closes the boxOver
 * @version VER205C - WANDA
 */
function WEBAPP_closeBoxOver()
{
	var boxOver = document.getElementById('boxOver');
	if (boxOver !== null) {
		boxOver.style.display = 'none';
		boxOver.innerHTML = '';
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

	function WEBAPP_createImageLayer() 
	{			
		var img = new Image();
		img.style.position = 'absolute';
		img.style.zIndex = -1;
		img.style.top = 0;
		img.style.left = 0;
		img.onload = WEBAPP_imageOnLoad;
		img.src = WEBAPP_imgURI + '&n=' + (++WEBAPP_imgSerialNumber);
		if (WEBAPP_debugFlag) {
			WEBAPP_debug(WEBAPP_imgURI + '&n=' + WEBAPP_imgSerialNumber);
		}
		var webcam = document.getElementById('box_IPCam_player');
		webcam.insertBefore(img, webcam.firstChild);
	}

	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
		
	function WEBAPP_imageOnLoad() 
	{
		this.style.zIndex = WEBAPP_imgSerialNumber; // Image finished, bring to front!
		while (1 < WEBAPP_imgDownloadCompleted.length) {
			var del = WEBAPP_imgDownloadCompleted.shift(); // Delete old image(s) from document
			del.parentNode.removeChild(del);
		}
		WEBAPP_imgDownloadCompleted.push(this);
		if (!WEBAPP_imgPaused) {
			WEBAPP_createImageLayer();
		}
	}

	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
	
	/**
	 * @version VER3.0
	 */
	function WEBAPP_preloadImagesMM() 
	{
		var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
		var i,j=d.MM_p.length,a=WEBAPP_preloadImagesMM.arguments; for(i=0; i<a.length; i++)
		if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}
		}
	}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

function WEBAPP_manageCallingSystem(command, deviceID, deviceStatus, datetimePassed) // VER76 STEFANO BIS
{	
	if (WEBAPP_logAlarm) {
		console.log('%c' + WEBAPP_PREFIX + 'command: ' + command + ' - deviceID: ' + deviceID + ' - deviceStatus: ' + deviceStatus, 'color: ' + WEBAPP_CONSOLE_COLOR);
	}
	if (deviceID > 100000) {
		deviceID -= 100000;
	}
	/* VER76 STEFANO BIS */
	if (typeof datetimePassed === 'undefined' || datetimePassed === null) {
		datetimePassed = WEBAPP_getcurrentDateTimeString();
	}
	/* ----------------- */
	var device = WEBAPP_getDevice(deviceID);
	var htmlToAdd = '';
	if (device !== false && typeof device.id !== 'undefined' && typeof device.type !== 'undefined' && typeof device.name !== 'undefined') {
		if ($('#boxOver #menu_' + deviceID + ' .ico' + command + ':visible').length === 0) {
			htmlToAdd += '<li>';
			htmlToAdd += '<a id="menu_' + device.id + '">';
			htmlToAdd += '<div class="ico ico' + device.type + '_1 ico' + command + ' ico' + command + '_' + deviceStatus + '" id="menu_ico_si_' + device.id + '" rel="' + device.type + '"></div>' + device.name;
			htmlToAdd += '<span class="alarmdata">' + datetimePassed + '</span>'; // VER215 WANDA
			htmlToAdd += '</a></li>';
		} else {
			$('#boxOver #menu_' + deviceID + ' .ico' + command).removeClass().addClass('ico ico' + device.type + '_' + deviceStatus + ' ico' + command + ' ico' + command + '_' + deviceStatus);
			$('#boxOver #menu_' + deviceID + ' .ico' + command).closest('a').find('span').html(datetimePassed);
		}
	}
	if (htmlToAdd !== '') {
		WEBAPP_getPopupAlarm(); // VER76
		$('#boxOver #box_allarmi').prepend(htmlToAdd);
		if ($('body').hasClass('MV')) { // VER77 MODALITA MOBILE
			WEBAPP_setPagination($('.sistemachiamata'), 7, 1, true);
		} else {
			WEBAPP_setPagination($('.sistemachiamata'), 10, 2, false);
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

	function WEBAPP_getByteString(long, len)
	{
		if (long<0) long = parseInt(long)+4294967296;
		var s=parseInt(long).toString(2);
		for (i=s.length;i<len;i++) {s="0"+s;}
		return s;
	}

	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
	
	/**
	 * Append the navbar to some elements
	 * @param {string} element - element to append to the navbar
	 * @param {boolean} backButton - show the back button?
	 * @param {boolean} selectAreas - show the areas button?
	 * @param {boolean} menuButton - show the menu button?
	 * @version VER215 - WANDA
	 */
	function WEBAPP_appendNavbar(element, backButton, selectAreas, menuButton)
	{
		var htmlToAdd = '<div class="box_navbar">';
		if (element === 'box1') {
			htmlToAdd += '<span class="lbldevicemode">' + ModalitaDispositivo + '</span>';
		}
		htmlToAdd += '<a class="boxOver_btn" id="btn_home" title="Home" onclick="WEBAPP_clickOnHomeInNavbar(event.target)">';
		htmlToAdd += '<span class="px-icon icon-elegant-house-alt"></span>';
		htmlToAdd += '</a>';
		if (menuButton === true) {
			htmlToAdd += '<a class="boxOver_btn" id="btn_menu" title="Menu" onclick="WEBAPP_clickOnMenuInNavbar(event)">';
			htmlToAdd += '<span class="px-icon icon-elegant-cogs"></span>';
			htmlToAdd += '</a>';
		}
		if (backButton === true) {
			htmlToAdd += '<a class="boxOver_btn" id="btn_back" title="' + lblIndietro + '" onclick="WEBAPP_clickOnBackInNavbar(\'' + element + '\')">';
			htmlToAdd += '<span class="px-icon icon-close"></span>';
			htmlToAdd += '</a>';
		}
		if (selectAreas === true) {
			htmlToAdd += '<a class="boxOver_btn bg-red" id="btn_maps" onclick="WEBAPP_clickOnMapsInNavbar()">';
			htmlToAdd += '<span class="px-icon icon-elegant-image"></span>';
			htmlToAdd += '</a>';
		}
		htmlToAdd += '</div>';
		var element = document.getElementById(element);
		if (element !== null) {
			element.innerHTML = htmlToAdd;
		}
	}

	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

	function WEBAPP_clickOnBackInNavbar(element)
	{
		var element = document.getElementById(element);
		if (element !== null) {
			element.style.display = 'none'; 
		}
		var boxAree = document.querySelector('.MV #boxAree');
		if (boxAree !== null && boxAree.style.display !== 'none') {
			boxAree.style.display = 'none';
		}
		clearTimeout(WEBAPP_timer1);
		window.isRgbwPageOpened = false; // VER131
	}

	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

	function WEBAPP_clickOnHomeInNavbar()
	{
		var box2 = document.getElementById('box2');
		if (box2 !== null) {
			box2.style.display = 'none';
		}
		var box2b = document.getElementById('box2b');
		if (box2b !== null) {
			box2b.style.display = 'none';
		}
		var box3 = document.getElementById('box3');
		if (box3 !== null) {
			box3.style.display = 'none';
		}
		var boxAree = document.querySelector('.MV #boxAree');
		if (boxAree !== null && boxAree.style.display !== 'none') {
			boxAree.style.display = 'none';
		}
		window.isRgbwPageOpened = false; // VER132
		clearTimeout(WEBAPP_timer1);
	}

	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

	function WEBAPP_clickOnMenuInNavbar(event)
	{
		event.stopPropagation(); // VER77
		WEBAPP_clickedOnConsumptionInBox1 = false; // VER211 WANDA
		WEBAPP_getOverHTML(WEBAPP_settingsMenuURL, lblSettingsMenu, 'close');
	}

	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

	function WEBAPP_clickOnMapsInNavbar()
	{
		var boxAree = document.querySelector('.MV #boxAree');
		if (boxAree !== null) {
			if (boxAree.style.display === 'none' || boxAree.style.display === '') {
				boxAree.style.display = 'block';
			} else {
				boxAree.style.display = 'none';
			}
		}
	}

	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

	function WEBAPP_setCookie(cname, cvalue, exdays) {
	    var d = new Date();
	    d.setTime(d.getTime() + (exdays*24*60*60*1000));
	    var expires = "expires="+d.toUTCString();
	    document.cookie = cname + "=" + cvalue + "; " + expires;
	}

	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

	function WEBAPP_getCookie(cname) {
	    var name = cname + "=";
	    var ca = document.cookie.split(';');
	    for(var i=0; i<ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0)==' ') c = c.substring(1);
	        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
	    }
	    return "";
	}

	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

	function WEBAPP_rotateDeviceFamily(family, move, isSubFamily)
	{
		console.log('%c' + WEBAPP_PREFIX + 'Family: ' + family, 'color: ' + WEBAPP_CONSOLE_COLOR);
		/* VER207 WANDA */
		if (window.isRgbwPageOpened) {
			window.isRgbwPageOpened = false;
		}
		/* ------------ */
		var DeviceListTmp = WEBAPP_getDevicesByFamily(family);
		var DeviceListTmp2 = new Array();
		if (family==4)
		{
			for(var i=0; i<DeviceListTmp.length; i++) {
				if (isSubFamily=="isVMCDaikinModBus")
				{
					if (DeviceListTmp[i].isVMCDaikinModBus!=undefined && DeviceListTmp[i].isVMCDaikinModBus==1) DeviceListTmp2.push(DeviceListTmp[i]);
				}
				else
				{
					if (DeviceListTmp[i].isVMCDaikinModBus==undefined || DeviceListTmp[i].isVMCDaikinModBus==0) DeviceListTmp2.push(DeviceListTmp[i]);
				}
			}
			DeviceListTmp=DeviceListTmp2;  
		}

		if ($("#box3 [id^=stato_]").length>0)
			iID=$("#box3 [id^=stato_]").attr("id").replace("stato_","");
		else
			iID=$("#thermo").attr("rel");

		if (iID == undefined) { // VER 108 per DIMMER RGB
			iID = WEBAPP_actualDevice;
		}

		for(var i=0; i<DeviceListTmp.length; i++) {
			if (DeviceListTmp[i].id == iID) {    
				var newI = i+move;
				if (newI>=DeviceListTmp.length) newI=0;
				if (newI<0) newI=DeviceListTmp.length-1; 

				$("#box3").html("");
				WEBAPP_appendNavbar('box3', true, false, false);	
				// WEBAPP_getBox3($(this), DeviceListTmp[newI].id); //VER64
				WEBAPP_getBox3Content($(this), DeviceListTmp[newI].id);
			
				// VER99
				if (WEBAPP_isCustomIconInPopupEnabled && $('#box3').data('isByMapcommand')) {		    		
					for(var a=0; a<DOMINAPLUS_MANAGER_areaList.length; a++) 
					{
						if (DOMINAPLUS_MANAGER_areaList[a].mapcommands!=null)
						{	
							for (var ii=0; ii<DOMINAPLUS_MANAGER_areaList[a].mapcommands.length; ii++) /*VER106 ii*/
							{
								if (parseInt(DOMINAPLUS_MANAGER_areaList[a].mapcommands[ii].deviceFamily)==parseInt(family) && DOMINAPLUS_MANAGER_areaList[a].mapcommands[ii].deviceId == DeviceListTmp[newI].id) /*VER106 ii*/
								{
									var currentValIcon=DOMINAPLUS_MANAGER_areaList[a].mapcommands[ii].icoc; /*VER106 ii*/
									$("#box3 #stato_"+DeviceListTmp[newI].id).css("background-image","url(/DPClientData/icons/i"+currentValIcon+".png)").css("background-position","0 0");
									break;
								}
							}
						}				
					}					

				}
				$("#box3").append("<div id=\"btn_close\"><span title=\""+lblChiudi+"\" class=\"px-btn px-icon icon-close\"></span></div>"); /*VER75*/
				$("#box3 #btn_close").click(function () {
					/* VER207 WANDA */
					if (window.isRgbwPageOpened) {
						window.isRgbwPageOpened = false;
					}
					/* ------------ */
					// clearInterval(WEBAPP_textTimer); VER177 WANDA
					/* VER153 --- VER160 WANDA */
					if (family === 4 && (DISPLAY_isTS10 || DISPLAY_isTSSMART || DISPLAY_isTSSMART7 || DISPLAY_isTSSMART18)) { // VER254 WANDA
						$('#box3').hide(); 
					} else {
						$('#box3').fadeOut('slow'); 
					}
					/* ------------ */
				});
			}
		}
	}

	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */


//VER76
function WEBAPP_getcurrentDateTimeString()
{
	var tmpDate = new Date();
	var sData = tmpDate.getDate() + ' ' + WEBAPP_monthsArray[tmpDate.getMonth() + 1] + ' ';
	(tmpDate.getHours() < 10) ? sData += '0' + tmpDate.getHours() : sData += tmpDate.getHours();
	(tmpDate.getMinutes() < 10) ? sData += ':0' + tmpDate.getMinutes() : sData += ':' + tmpDate.getMinutes();
	return sData;
}

	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
	/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Sends STO command
 * @version VER198 - WANDA 
 */
function WEBAPP_sendSTOCommand()
{
	if (WEBAPP_statusSTO == 0) {
		console.log('%c' + WEBAPP_PREFIX + 'STO', 'color: ' + WEBAPP_CONSOLE_COLOR);
		WEBAPP_STOCommandToReachNextSTOStatus = 'STO';
		WEBAPP_statusSTO = 1;
	} else {
		console.log('%c' + WEBAPP_PREFIX + 'SRE', 'color: ' + WEBAPP_CONSOLE_COLOR);
		WEBAPP_STOCommandToReachNextSTOStatus = 'SRE';
		WEBAPP_statusSTO = 0;
	}
	DOMINAPLUS_MANAGER_sendWSCommand(WEBAPP_STOCommandToReachNextSTOStatus); // VER173 WANDA
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/******* VER109 ****/
function WEBAPP_popupConfirm(title,text, callback)
{
	var obj = $("<div class='popupConfirm'></div>");
	obj.append("<div class='popupConfirm-title'>"+title+"</div>");
	obj.append("<div class='popupConfirm-text'>"+text+"</div>");
	obj.append("<div class='popupConfirm-btn'><a class='btn btn-command action-ko'>"+lblAnnulla+"</a> <a class='btn btn-primary action-ok'>"+lblConferma+"</a></div>");
	obj.find(".action-ko").click(function(){$(".popupConfirm").remove();});
	obj.find(".action-ok").click(function(){eval(callback);$(".popupConfirm").remove();});
	$("#stage").append(obj);
}
/******* VER109 ****/

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Asks server if the current session is alive
 */
function WEBAPP_askServerIfSessionIsAlive()
{
	if (location.hostname !== '127.0.0.1') {
		var url = WEBAPP_checkSessionURL + '?rnd=' + Math.random();
		var request = new XMLHttpRequest();
		request.open('GET', url, false); // 'false' makes the request synchronous
		request.send(null);
		if (request.readyState === 4) {
			if (request.status === 200) {
				WEBAPP_checkSessionAndReloadIfNecessary(request.responseText);
			} else {
				console.log('%c' + WEBAPP_PREFIX + 'askServerIfSessionIsAlive error ' + WEBAPP_CONSOLE_ERROR);
			}
		}
	}
}

 /* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Checks session and reloads if necessary
 * @param {string} value - '0': session is not alive anymore - '1': session is still alive
 */
function WEBAPP_checkSessionAndReloadIfNecessary(value)
{
  if (value === '0') {
    window.location.href = 'http://' + location.hostname + '/_TS01/login.php';
  } else {
    setTimeout('WEBAPP_askServerIfSessionIsAlive()', WEBAPP_checkIfSessionIsAliveTimeout);
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Checks if device has Chrome ver44 installed (OLD TSSMART)
 * @returns true or false
 * @version VER200 - WANDA
 */
function WEBAPP_isChrome44()
{
  var test = navigator.userAgent.match(/chrom(?:e|ium)\/(\d+)\./i);
  if (test) {
    return (parseInt(test[1], 10) === 44);
  }
  return false;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Asks if current device is no longer logged
 * @version VER217B - WANDA & STEFANO
 */
function WEBAPP_askIfIsCurrentDeviceIsNoLongerLogged()
{
	$.ajax({
		type: 'GET',
		url: 'isTSSmartLogged.php?rnd=' + Math.random(),
		dataType: 'text',
		async: true,
		cache: false,
		success: function(text) 
		{
			var isAlreadyLogged = parseInt(text);
			if (DISPLAY_isTSSMART || DISPLAY_isTSSMART7 || DISPLAY_isTSSMART18) {
				if (parseInt(isAlreadyLogged) === 0) {
					window.location.href = 'login.php?rnd' + Math.random();
				}
			}
		},
		error: function() { isAlreadyLogged = 0; }
	});
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Handler of the click on the mapmode button
 * @param {object} - the clicked element
 * @version VER209 - WANDA
 */
function WEBAPP_clickOnMapmodeButton(element)
{
	var box3 = document.getElementById('box3');
	/* VER207 WANDA */
	if (window.isRgbwPageOpened) {
		window.isRgbwPageOpened = false;
	}
	/* ------------ */
	/* VER154 --- VER159 WANDA */ // To avoid showing #box2, #box2b and #box3 when changing between device mode and map mode
	if (element.classList.contains('mapmode')) {
		var box2 = document.getElementById('box2');
		if (box2 !== null) {
			box2.style.display = 'none';
		}
		var box2b = document.getElementById('box2b');
		if (box2b !== null) {
			box2b.style.display = 'none';
		}
		var box1Element = document.querySelectorAll('#box1 li > a');
		if (box1Element !== null) {
			for (var i = 0; i < box1Element.length; i++) {
				box1Element[i].className = '';
			}
		}
	}
	if (box3 !== null) {
		box3.style.display = 'none';
	}
	/* ----------------------- */
	var btnMapmodeElement = document.querySelectorAll('.btn_mapmode a');
	if (btnMapmodeElement !== null) {
		for (var i = 0; i < btnMapmodeElement.length; i++) {
			if (btnMapmodeElement[i].classList.contains('active')) {
				btnMapmodeElement[i].classList.remove('active');
			}
			if (btnMapmodeElement[i] === element) {
				if (!element.classList.contains('active')) {
					element.classList.add('active');
				}
			}
		}
	}
	var stage = document.getElementById('stage');
	if (stage !== null) {
		if (element.classList.contains('mapmode')) {
			if (!stage.classList.contains('mapview')) {
				stage.classList.add('mapview');
				/* VER127 STEFANO --- VER173 WANDA*/
				if (DISPLAY_isTS10) {
					DOMINAPLUS_MANAGER_counterGAT = 0;
					DOMINAPLUS_MANAGER_loadGAT();
				}
				/* ------------------------------ */
				WEBAPP_setCookie('viewmode', 'mapmode', 180);
				var boxAreeDxContActive = document.querySelector('#boxAree_dx_cont .active');
				if (boxAreeDxContActive !== null) {
					boxAreeDxContActive.click();
				}
			}
		} else {
			if (stage.classList.contains('mapview')) {
				stage.classList.remove('mapview');
				WEBAPP_setCookie('viewmode', 'devicemode', 180);
				var area0 = document.getElementById('area_0');
				if (area0 !== null) {
					area0.click();
				}
			}
		}
	}
	/* VER216 WANDA */
	var boxOver = document.getElementById('boxOver');
	if (boxOver !== null) {
		boxOver.style.display = 'none';
	}
	/* ------------ */
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Gets a mapcommand given its deviceID and familyID
 * @param {string} deviceID - the ID of the device
 * @param {number} familyID - the ID of the family
 * @returns mapcommand if found, false otherwise
 * @version VER230 - WANDA
 */
function WEBAPP_getMapCommand(deviceID, familyID)
{
	var mapCommand = false;
	for (var i = 0; i < DOMINAPLUS_MANAGER_areaList.length; i++) {
		if (typeof DOMINAPLUS_MANAGER_areaList[i].mapcommands !== 'undefined') {
			for (var j = 0; j < DOMINAPLUS_MANAGER_areaList[i].mapcommands.length; j++)	{
				if (typeof DOMINAPLUS_MANAGER_areaList[i].mapcommands[j].commandId !== 'undefined' && typeof DOMINAPLUS_MANAGER_areaList[i].mapcommands[j].deviceFamilyApp !== 'undefined' && parseInt(DOMINAPLUS_MANAGER_areaList[i].mapcommands[j].commandId) === parseInt(deviceID) && parseInt(DOMINAPLUS_MANAGER_areaList[i].mapcommands[j].deviceFamilyApp) === parseInt(familyID)) {
					mapCommand = DOMINAPLUS_MANAGER_areaList[i].mapcommands[j];
				}
			}
		}				
	}
	return mapCommand;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ---------------------------------------------------------------------- WEBSOCKET --------------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

function WEBAPP_classicStart() {
	/* VER170 WANDA */
	if (window.innerWidth < DISPLAY_widthOrientationChange) { // VER170 WANDA
		DISPLAY_WBS_changeOrientationMobile(); // VER194 WANDA
	}
	/* ------------ */
	if (!DOMINAPLUS_MANAGER_isLoadedLM) { // Check if Map List has been loaded
		DOMINAPLUS_MANAGER_sendWSCommand('LM'); // VER173 WANDA
	}	else { // VER173 WANDA
		if (!DOMINAPLUS_MANAGER_isLoadedLMC) {
			DOMINAPLUS_MANAGER_counterLMC = DOMINAPLUS_MANAGER_areaList.length;
			for (var area = 0; area < DOMINAPLUS_MANAGER_areaList.length; area++) {
				DOMINAPLUS_MANAGER_areaList[area].mapcommands = null;
				/* VER173 WANDA */
				DOMINAPLUS_MANAGER_sendWSCommand('LMC', DOMINAPLUS_MANAGER_areaList[area].id);
				DOMINAPLUS_MANAGER_sendWSCommand('LML', DOMINAPLUS_MANAGER_areaList[area].id);
				/* ------------ */
			}
		}	else {
			// Timeouts may be not needed
			/* VER173 WANDA */
			setTimeout('DOMINAPLUS_MANAGER_sendWSCommand("SU2")', 500);
			setTimeout('DOMINAPLUS_MANAGER_sendWSCommand("SU3")', 2000);
			setTimeout('DOMINAPLUS_MANAGER_sendWSCommand("GSF","12")', 3000);
			/* VER125 */
			setTimeout('DOMINAPLUS_MANAGER_sendWSCommand("WSF", "1")', 1000);
			setTimeout('DOMINAPLUS_MANAGER_sendWSCommand("WSF", "2")', 1500);
			setTimeout('DOMINAPLUS_MANAGER_sendWSCommand("WSF", "22")', 2000);
			/* ------ */
			/* ------------ */
		}
	}
	if (!DOMINAPLUS_MANAGER_isLoadedLDI) { // Check if Device List has been loaded
			DOMINAPLUS_MANAGER_sendWSCommand('LDI'); // VER173 WANDA
	}
	if (!WEBAPP_loadedClassicStart) {
		DISPLAY_init();
		$('#btn_settings, #btn_settings2').click(function() {
			WEBAPP_clickedOnConsumptionInBox1 = false; // VER211 WANDA
			WEBAPP_clickedOnEnergyChartsInBox2Box3 = false; // VER216 WANDA
			WEBAPP_getOverHTML(WEBAPP_settingsMenuURL, lblSettingsMenu, 'close');
		});
		WEBAPP_getBox1();
		if (isClient === false) {
			$('#stage #notavailable').html(lblServerIrraggiungibile); // VER113
		}
		WEBAPP_preloadImagesMM('webapps/webapp_legacy/public/images/ico_pack_big.png', 'webapps/webapp_legacy/public/images/ico_pack.png'); // VER218C WANDA
		WEBAPP_actualDevice = 1;
		WEBAPP_loadedClassicStart = true;
	}
	DOMINAPLUS_MANAGER_sendWSCommand('GEP'); // VER168 WANDA --- VER173 WANDA
	DISPLAY_WBS_showConnectionType(); // VER194 WANDA
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * callback in case of failure
 * @version VER277
 */
function WEBAPP_onConnectionFailure()
{
	if (window.innerWidth < DISPLAY_widthOrientationChange) {
		DISPLAY_WBS_changeOrientationMobile();
	}
	if (!WEBAPP_loadedClassicStart) {
		DISPLAY_init();
		$('#btn_settings, #btn_settings2').click(function() {
			WEBAPP_clickedOnConsumptionInBox1 = false;
			WEBAPP_clickedOnEnergyChartsInBox2Box3 = false;
			WEBAPP_getOverHTML(WEBAPP_settingsMenuURL, lblSettingsMenu, 'close');
		});
		WEBAPP_getBox1();
		if (isClient === false) {
			$('#stage #notavailable').html(lblServerIrraggiungibile);
			$('#stage #notavailable').show();
		}
		WEBAPP_preloadImagesMM('webapps/webapp_legacy/public/images/ico_pack_big.png', 'webapps/webapp_legacy/public/images/ico_pack.png');
		WEBAPP_actualDevice = 1;
		WEBAPP_loadedClassicStart = true;
	}
	DISPLAY_WBS_showConnectionType();
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* --------------------------------------------------------------------- DOMINAPLUS --------------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * LDI has been completed
 * @param {boolean} economizerFound - true if at least one device is an economizer, false otherwise
 * @version VER268 - WANDA
 */
function WEBAPP_commandLDIcompleted(economizerFound)
{
	console.log('%c' + WEBAPP_PREFIX + 'LDI completed', 'color: ' + WEBAPP_CONSOLE_COLOR);
	// SORTING ALPHABETICALLY BY NAMES --- changing the case (to upper or lower) ensures a case insensitive sort --- VER268 WANDA
	DOMINAPLUS_MANAGER_deviceList.sort(function(a, b) {
		var nameA = a.name.toUpperCase();
		var nameB = b.name.toUpperCase();
		return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
	});
	// ECONOMIZER
	if (economizerFound === true) {
    WEBAPP_economizzatore = 1;
  }
	for (var i = 0; i < DOMINAPLUS_MANAGER_deviceList.length; i++) {
		if (typeof DOMINAPLUS_MANAGER_deviceList[i].typeApp !== 'undefined') {
			// COUNTING HOW MANY ENERGY ARE THERE ON THE PLANT --- VER272 WANDA
			if (parseInt(DOMINAPLUS_MANAGER_deviceList[i].typeApp) === 9) {
				WEBAPP_numberOfEnergy++
			}
			// COUNTING HOW MANY THERMOSTATS ARE THERE ON THE PLANT --- VER217 WANDA
			else if (parseInt(DOMINAPLUS_MANAGER_deviceList[i].typeApp) === 4) {
				WEBAPP_numberOfThermostats++;
			}
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * LM has been completed
 * @version VER193 - WANDA
 */
function WEBAPP_commandLMcompleted()
{
	console.log('%c' + WEBAPP_PREFIX + 'LM complete', 'color: ' + WEBAPP_CONSOLE_COLOR);
	WEBAPP_getBoxAreas();
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * LMC has been completed
 * @param {string} areaID - the ID of the current map
 * @version VER192 - WANDA
 */
function WEBAPP_commandLMCcompleted(areaID)
{
	console.log('%c' + WEBAPP_PREFIX + 'LMC complete for mapID: ' + areaID, 'color: ' + WEBAPP_CONSOLE_COLOR);
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * LML has been completed
 * @param {string} areaID - the ID of the current map
 * @version VER192 - WANDA
 */
function WEBAPP_commandLMLcompleted(areaID)
{
	console.log('%c' + WEBAPP_PREFIX + 'LML complete for mapID: ' + areaID, 'color: ' + WEBAPP_CONSOLE_COLOR);
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Acts accordingly to the status of the websocket connection
 * @param {string} status - 'OPEN' if the connection has been opened, 'CLOSE' if the connection has been closed and 'ERROR' if there has been an error
 * @version VER209 - WANDA
 */
function WEBAPP_manageConnectionStatus(status)
{
  var notAvailable = document.getElementById('notavailable');
	switch (status) {
		case 'OPEN':
			if (notAvailable !== null) {
				notAvailable.style.display = 'none';
			}
			WEBAPP_economizerStopPolling();
			setTimeout('WEBAPP_classicStart();', 1000);
			if (!DISPLAY_isTS10) { // TS10 waits for implicit click on mapmode
				setTimeout('DOMINAPLUS_MANAGER_loadGAT(null);', 2000);
			}
			WEBAPP_loadAstronomicEnabled();
			break;

		case 'CLOSE':
			if (DOMINAPLUS_MANAGER_reconnectWithoutDelay === false) {
				if (notAvailable !== null) {
					notAvailable.style.display = 'block';
				}
			} else {
				setTimeout(function () {
					if (DOMINAPLUS_MANAGER_isChannelActive() === false) {  // VER277
						if (notAvailable !== null) {
							notAvailable.style.display = 'block';
						}
					}
				}, 2000);
			}
			break;

		case 'ERROR':
      /******** VER277 ********/
      //WEBAPP_classicStart();
      WEBAPP_onConnectionFailure();
      /************************/
      break;
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages the valcallingsystem value
 * @param {number} value - the value of valcallingsystem
 * @version VER230 - WANDA
 */
function WEBAPP_manageValCallingSystemGAT(value)
{
	if (value > 0) {
		WEBAPP_callingSystem = 1;
	} else {
		WEBAPP_callingSystem = 0;
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates the HTML accordingly to the response of the WS command
 * @param {object} parameters - array of string representing the updates
 * @version VER236 - WANDA
 */
function WEBAPP_commandUPDWScompleted(parameters)
{
	var deviceType = parseInt(parameters[1]);
	var deviceID = parseInt(parameters[2]);
	var deviceStatus = parseInt(parameters[3]);
	// UPDATING ICON IN BOX2
	var menuIco = document.querySelector('#box2 #menu_ico_' + deviceID + '[rel="' + deviceType + '"]');
	if (menuIco !== null) {
		menuIco.className = '';
		menuIco.classList.add('ico', 'ico' + deviceType + '_' + deviceStatus);
	}
	// UPDATING STATUS ICON IN BOX3
	var stato = document.getElementById('stato_' + deviceID);
	if (stato !== null) {
		stato.className = '';
		stato.classList.add('ico', 'ico' + deviceType + '_' + deviceStatus);
		// DIMMER
		if (deviceType === 2) {
			var dimmerBarVal = document.querySelector('.drimmer_bar_' + deviceID + ' #drimmer_bar_val');
			if (dimmerBarVal !== null) {
				/* VER236 WANDA */
				var widthValue = deviceStatus * 6;
				if (widthValue < 0) {
					widthValue = 0;
				} else if (widthValue > 186) {
					widthValue = 186;
				}
				dimmerBarVal.style.width = widthValue + 'px';
				/* ------------ */
			}
			/* VER119 MAURO */
			var dimmerBarValLabel = document.getElementById('drimmer_bar_val_label');
			if (dimmerBarValLabel !== null) {
				if (deviceStatus === 0) {
					dimmerBarValLabel.innerHTML = '';
				} else {
					dimmerBarValLabel.innerHTML = (10 + ((deviceStatus - 1) * 3)) + '%';
				}
			}
			/* ------------ */
		}
	}
	// UPDATING BOXOVER ICON (ENERGY CHARTS)
	var boxOverChartsList = document.querySelector('#boxOverChartsList #menu_ico_' + deviceID);
	if (boxOverChartsList !== null) {
		boxOverChartsList.className = '';
		boxOverChartsList.classList.add('ico', 'ico' + deviceType + '_' + deviceStatus);
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Adds or updates calling system boxOver
 * @param {object} parameters   - array of string representing the updates
 * @param {string} command 		  - command name
 * @param {number} deviceID 		- deviceID
 * @param {number} deviceStatus - status of the device
 * @version VER230 - WANDA
 */
function WEBAPP_manageCallingSystemUPD(parameters, command, deviceID, deviceStatus)
{
	if (command === 'falp') {
		WEBAPP_removeFireAlarmRectangleWrapper();
		if ((parseInt(parameters[3]) === 1 || parseInt(parameters[3]) === 2) || WEBAPP_checkIfBoxOverIsVisible()) {
			ANTITHEFT_TECHALARM_showPropagationAlarm(parameters, 'FALP');
		}
	} else {
		var isCallingSystemMenuVisible = false;
		var sistemaChiamata = document.querySelector('#boxOver .sistemachiamata');
		if (sistemaChiamata !== null) {
			if (sistemaChiamata.offsetWidth > 0 || sistemaChiamata.offsetHeight > 0) { // Calling system boxOver is visible
				var menu = sistemaChiamata.querySelector('#boxOver .sistemachiamata #menu_' + deviceID);
				if (menu !== null) {
					isCallingSystemMenuVisible = true;
				}
				var aWithDataReference = sistemaChiamata.querySelector('a[data-reference="' + command + '_' + deviceID + '"]');
				if (aWithDataReference !== null) {
					isCallingSystemMenuVisible = true;
				}
			}
		}
		if (deviceStatus === 1 || isCallingSystemMenuVisible === true) {
			if (command !== 'alp') {
				WEBAPP_manageCallingSystem(command.toLowerCase(), deviceID, deviceStatus);
				var alarmMenuIco = document.querySelector('.alarm #menu_ico_' + deviceID);
				if (alarmMenuIco !== null) {
					alarmMenuIco.className = '';
					alarmMenuIco.classList.add('ico', 'ico7_' + deviceStatus);
				}
			} else {
				WEBAPP_showPropagationAlarm(parameters);
			}
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates the device icon
 * @param {string} commandID 		 - command ID
 * @param {string} currentIconID - current icon ID
 * @version VER230 - WANDA
 */
function WEBAPP_manageUPDD(commandID, currentIconID)
{
	var mapCommand = document.querySelector('.mapcommand[data-mapcommandid="' + commandID + '"]');
	if (mapCommand !== null) {
		mapCommand.style.backgroundImage = 'url(/DPClientData/icons/i' + currentIconID + '.png)';
	}
  /* VER99 */
  if (WEBAPP_isCustomIconInPopupEnabled && $('#box3').data('isByMapcommand')) {
    var currentDeviceID = $('.mapcommand[data-mapcommandid=' + commandID + ']').data('mapcommanddevice');
    if (currentDeviceID !== null) {
			var box3Stato = document.querySelector('#box3 #stato_' + currentDeviceID);
			if (box3Stato !== null) {
				box3Stato.style.backgroundImage = 'url(/DPClientData/icons/i' + currentIconID + '.png)';
				box3Stato.style.backgroundPosition = '0 0';
			}
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Toggles 'stopped' class
 * @param {boolean} show - true if 'stopped' class has to be added, false if it has to be removed
 * @version VER230 - WANDA
 */
function WEBAPP_manageCommandsSREandSTO(show)
{
  var btnCallingSystemStop = document.getElementById('btn_callingsystem_stop');
  if (btnCallingSystemStop !== null) {
    if (show === false) {
			WEBAPP_statusSTO = 0;
      btnCallingSystemStop.classList.remove('stopped');
    } else {
			WEBAPP_statusSTO = 1;
      btnCallingSystemStop.classList.add('stopped');
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates the dimmer HTML
 * @param {string} deviceID - ID of the current device
 * @param {string} currentValue - current value
 * @version VER261 - WANDA
 */
function WEBAPP_commandGRPcompleted(deviceID, currentValue)
{
  if (deviceID > 0 && typeof Device !== 'undefined' && Device !== null && parseInt(Device.id) === parseInt(deviceID)) { // VER261 WANDA
		var menuIco = document.querySelector('#box2 #menu_ico_' + deviceID + '[rel="2"]');
		if (menuIco !== null) {
			menuIco.className = '';
			menuIco.classList.add('ico', 'ico2_' + parseInt(currentValue));
		}
		var stato = document.querySelector('#box3 #stato_' + deviceID);
		if (stato !== null) {
			stato.className = '';
			stato.classList.add('ico', 'ico2_' + parseInt(currentValue));
		}
    var dimmerBarVal = document.querySelector('.drimmer_bar_' + deviceID + ' #drimmer_bar_val');
		if (dimmerBarVal !== null) {
			/* VER236 WANDA */
			var widthValue = currentValue * 6;
			if (widthValue < 0) {
				widthValue = 0;
			} else if (widthValue > 186) {
				widthValue = 186;
			}
			dimmerBarVal.style.width = widthValue + 'px';
			/* ------------ */
		}
		var dimmerBarValLabel = document.getElementById('drimmer_bar_val_label');
		if (dimmerBarValLabel !== null) {
			if (parseInt(currentValue) === 0) {
				dimmerBarValLabel.innerHTML = '';
			} else {
				dimmerBarValLabel.innerHTML = (10 + ((currentValue - 1) * 3)) + ' %';
			}
		}
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Checks if boxOver is already open
 * @returns true or false
 * @version VER208 - WANDA
 */
function WEBAPP_checkIfBoxOverIsVisible()
{
  var boxOver = document.getElementById('boxOver');
  var isVisible = false;
  if (boxOver !== null && (boxOver.offsetWidth > 0 || boxOver.offsetHeight > 0)) {
    isVisible = true;
  }
  return isVisible;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Removes 'fireAlarmRectangleWrapper'
 * @version VER208 - WANDA
 */
function WEBAPP_removeFireAlarmRectangleWrapper()
{
  var boxOver = document.getElementById('boxOver');
	var isBoxOverVisible = WEBAPP_checkIfBoxOverIsVisible();
  if (boxOver === null || isBoxOverVisible === false) {
    var fireAlarmRectangleWrapper = document.getElementsByName('fireAlarmRectangleWrapper');
    if (fireAlarmRectangleWrapper !== null) {
      for (var i = 0; i < fireAlarmRectangleWrapper.length; i++) {
        fireAlarmRectangleWrapper[i].parentNode.removeChild(fireAlarmRectangleWrapper[i]);
      }
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updated the HTML for the current scheduled task
 * @param {object} schedulerTask - the current scheduled task
 * @param {object} record - Array containing the response data for every scheduled task
 * @version VER208 - WANDA
 */
function WEBAPP_updateSchedulerTaskHTML(schedulerTask, record)
{
  var htmlToAddAstronomic = '';
  if (WEBAPP_isAstronomicEnabled) {
    var astronomicHour = schedulerTask.AstronomicHour;
    var astronomicMinute = ('00' + Math.abs(schedulerTask.AstronomicMinute)).substr(-2);
    if (schedulerTask.bModifiedByType === 'sunSet') {
      if (parseInt(schedulerTask.AstronomicMinute) < 0 && parseInt(schedulerTask.AstronomicHour) === 0) {
        astronomicHour = '-' + astronomicHour;
      }
      htmlToAddAstronomic = '<div class="AstronimicIcon"><div class="AstronimicIconSunSet"></div>' + astronomicHour + ':' + astronomicMinute + '</div>';
    } else if (schedulerTask.bModifiedByType === 'sunRise') {
      if (parseInt(schedulerTask.AstronomicMinute) < 0 && parseInt(schedulerTask.AstronomicHour) === 0) {
        astronomicHour = '-' + astronomicHour;
      }
      htmlToAddAstronomic = '<div class="AstronimicIcon"><div class="AstronimicIconSunRise"></div>' + astronomicHour + ':' + astronomicMinute + '</div>';
    }
  } else {
    if (schedulerTask.AstronomicWrongData) {
      htmlToAddAstronomic = '<div class="AstronimicIcon"><div class="AstronimicIconSunRise"></div>' + lblDisabilitato + '</div>';
    }
  }
  var taskID = parseInt(record[0]);
  var htmlToAdd = '<div class="scenario_programma">';
  ora = ('0' + schedulerTask.taskHour).substr(-2);
  minuto = ('0' + schedulerTask.taskMinute).substr(-2);
  if (schedulerTask.AstronomicWrongData) {
    ora = '--';
    minuto = '--';
  }
  htmlToAdd += '<div class="ora"><span class="px-icon icon-clock"></span>' + ora + ':' + minuto + htmlToAddAstronomic + '</div>';
  htmlToAdd += '<div class="giorni">';
  sGiorni = WEBAPP_getByteString(schedulerTask.taskDays, 7).split('').reverse().join('');
  for (var i = 0; i < 7; i++) {
    sclass = 'inactive';
    if (sGiorni.substr(i, 1) === '1') {
      sclass = 'active';
    }
    htmlToAdd += '<span class="' + sclass + '">' + WEBAPP_daysArray[i + 1] + '</span>'; // VER177 WANDA
  }
  htmlToAdd += '</div>';
  if (!schedulerTask.AstronomicWrongData) {
		/* VER210 WANDA */
		var classToAdd = '';
		if (userIsAdmin === '') {
			classToAdd = 'disabledButton';
		}
    htmlToAdd += '<span data-id="' + taskID + '" title="Modifica programmazione" class="edit_programmazione px-btn px-icon icon-pencil-2 ' + classToAdd + '"></span>';
		/* ------------ */
  }
  htmlToAdd += '<div class="mesi">';
  sMesi = WEBAPP_getByteString(schedulerTask.taskMonths, 12).split('').reverse().join('');
  for (var i = 0; i < 12; i++) {
    sclass = 'inactive';
    if (sMesi.substr(i, 1) === '1') {
      sclass = 'active';
    }
    htmlToAdd += '<span class="' + sclass + '">' + WEBAPP_monthsArray[i + 1] + '</span>';
  }
  htmlToAdd += "</div></div>"
  $('#box3 .programmazione_items').append(htmlToAdd);
  $('#box3 .edit_programmazione').click(function ()
  {
    WEBAPP_actualDevice = $(this).data('id');
    window.currentTaskId = $(this).data('id');
		var box3Title = document.querySelector('#box3 h1');
		if (box3Title !== null) {
			WEBAPP_getOverHTML('webapps/webapp_legacy/settings_scheduler.htm', lblProgammOrario + ' ' + box3Title.innerHTML, 'close'); // VER218C WANDA
		}
  });
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Sets pagination in the scheduler page
 * @version VER208 - WANDA
 */
function WEBAPP_schedulerPagination()
{
	var programmazioneItems = document.getElementsByClassName('programmazione_items')[0];
	if (programmazioneItems !== null) {
		WEBAPP_setPagination(programmazioneItems, 2);
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Gets the status of a device
 * @param {string} deviceID - the ID of the current device
 * @param {string} deviceType - the type of the current device
 * @version VER209 - WANDA
 */
function WEBAPP_getDeviceStatus(deviceID, deviceType)
{
	var status = -1;
	var request = new XMLHttpRequest();
	request.open('GET', WEBAPP_deviceStatusURL + '&parameter=' + deviceID + '&rnd=' + Math.random(), false); // 'false' makes the request synchronous
	request.send(null);
	if (request.readyState === 4) {
		if (request.status === 200) {
			var posParametro1 = request.responseText.indexOf('<parametro1>');
			if (posParametro1 >= 0) {
				var strParametro1 = request.responseText.substring(posParametro1);
				var endParametro1 = strParametro1.indexOf('</parametro1>');
				if (endParametro1 >= 0) {
					strParametro1 = strParametro1.substring(0, endParametro1);
					strParametro1 = strParametro1.replace('<parametro1>', '');
					status = parseInt(strParametro1.trim());
					var menuIco = document.querySelector('#box2 #menu_ico_' + deviceID);
					if (menuIco !== null) {
						menuIco.className = '';
						menuIco.classList.add('ico', 'ico' + deviceType + '_' + status);
					}
					var stato = document.getElementById('stato_' + deviceID);
					if (stato !== null) {
						stato.className = '';
						stato.classList.add('ico', 'ico' + deviceType + '_' + status);
					}
					if (parseInt(deviceType) === 2) {
						var dimmerBarVal = document.getElementById('drimmer_bar_val');
						if (dimmerBarVal !== null) {
							dimmerBarVal.style.width = (status * 6) + 'px'
						}
					}
					if (WEBAPP_debugFlag) {
						WEBAPP_debug('rilevato stato id ' + deviceID + ': ' + status);
					}
				}
			}
		}	else {
			console.log('%c' + WEBAPP_PREFIX + 'getDeviceStatus() error! ', 'color: ' + WEBAPP_CONSOLE_ERROR);
			if (WEBAPP_debugFlag) {
				WEBAPP_debug('error: Loading device status (' + deviceID + ')');
			}
		}
	}	
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates box1 after its enabling
 * @version VER230 - WANDA
 */
function WEBAPP_loadingGATcompleted() {
	var box1Element = document.querySelectorAll('#box1 li a');
	if (box1Element !== null) {
		for (var i = 0; i < box1Element.length; i++) {
			if (typeof box1Element[i].getAttribute('id') !== 'undefined') {
				var type = box1Element[i].getAttribute('id').split('_')[1];
				if (DOMINAPLUS_MANAGER_deviceList.filter(function (element) { return parseInt(element.typeApp) === parseInt(type)}).length > 0) {
					DISPLAY_enabledBox1Array.push(box1Element[i]);
					box1Element[i].style.color = 'rgba(255, 255, 255, 1)';
					var box1ElementIco = box1Element[i].querySelector('.ico');
					if (box1ElementIco !== null) {
						box1ElementIco.style.opacity = '1';
					}
					if (DISPLAY_WBS_canApplyFullscreenStyleBasedOnUserAgent()) { // VER194 WANDA
						box1Element[i].style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
						box1Element[i].style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.5)';
						box1Element[i].style.borderRadius = '5px';
					}
				} else {
					if (i !== 5) { // Antitheft is different
						DISPLAY_notEnabledBox1Array.push(box1Element[i]);
						box1Element[i].style.color = 'rgba(255, 255, 255, 0.22)';
						var box1ElementIco = box1Element[i].querySelector('.ico');
						if (box1ElementIco !== null) {
							box1ElementIco.style.opacity = '0.22';
						}
						if (DISPLAY_WBS_canApplyFullscreenStyleBasedOnUserAgent()) { // VER194 WANDA
							box1Element[i].style.backgroundColor = 'transparent';
							box1Element[i].style.boxShadow = 'none';
							box1Element[i].style.borderRadius = '0';
						}
					}
				}
			}
		}
	}
	WEBAPP_updateBox1ForAntitheftMenu(); // VER199 WANDA
	WEBAPP_updateBox1ForAudioMenu(); // VER200 WANDA
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates the value of the label
 * @param {string} labelID - the ID of the label
 * @param {string} newValue - the new value
 * @version VER230 - WANDA
 */
function WEBAPP_manageCommandUPDLL(labelID, newValue)
{
	var canBreak = false;
	for (var i = 0; i < DOMINAPLUS_MANAGER_areaList.length; i++) {
		if (typeof DOMINAPLUS_MANAGER_areaList[i].maplabels !== 'undefined') {
			for (var j = 0; j < DOMINAPLUS_MANAGER_areaList[i].maplabels.length; j++) {
				if (typeof DOMINAPLUS_MANAGER_areaList[i].maplabels[j].LabelId !== 'undefined' && parseInt(DOMINAPLUS_MANAGER_areaList[i].maplabels[j].LabelId) === parseInt(labelID)) {
					if (typeof DOMINAPLUS_MANAGER_areaList[i].maplabels[j].LabelMaxChar !== 'undefined' && newValue.length <= DOMINAPLUS_MANAGER_areaList[i].maplabels[j].LabelMaxChar) {
						DOMINAPLUS_MANAGER_areaList[i].maplabels[j].currentText = newValue;
						var mapLabel = document.getElementById('MapLable_' + labelID);
						if (mapLabel !== null) {
							mapLabel.innerHTML = newValue;
							canBreak = true;
							break; // VER68B STEFANO
						}
					}
				}
			}
			if (canBreak === true) {
				break;
			}
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Sets geolocalScenarioURLs (no need to set them if not TS01)
 * @version VER230 - WANDA
 */
function WEBAPP_setGeolocalScenarioURLs()
{
	WEBAPP_getGeolocalScenario();
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Gets geolocal scenario
 * @version VER209 - WANDA
 */
function WEBAPP_getGeolocalScenario()
{
	DOMINAPLUS_MANAGER_deviceList.filter(function (element) { return parseInt(element.typeApp) === 6 }).forEach(function (obj) { obj.isGeoLocal = 0; });
	// GEOLOCAL ENTER
	var request = new XMLHttpRequest();
	request.open('GET', WEBAPP_geolocalScenarioEnterURL, false); // 'false' makes the request synchronous
	request.send(null);
	if (request.readyState === 4) {
		if (request.status === 200) {
			var arrayEnter = request.responseText.split('\n');
			for (var i = 0; i < arrayEnter.length; i++) {
				if (arrayEnter[i].trim() !== '') {
					var device = DOMINAPLUS_MANAGER_deviceList.filter(function (element) { return parseInt(element.id) === parseInt(arrayEnter[i].trim()); })[0]; // VER80
					if (typeof device !== 'undefined' && device !== null && typeof device.type !== 'undefined' && parseInt(device.type) === 6) {
						device.isGeoLocal = 1;
					}
				}
			}
		} else {
			console.log('%c' + WEBAPP_PREFIX + 'geolocalScenarioEnterURL: error', 'color: ' + WEBAPP_CONSOLE_ERROR);
		}
	}
	// GEOLOCAL EXIT
	var request = new XMLHttpRequest();
	request.open('GET', WEBAPP_geolocalScenarioExitURL, false); // 'false' makes the request synchronous
	request.send(null);
	if (request.readyState === 4) {
		if (request.status === 200) {
			var arrayExit = request.responseText.split('\n');
			for (var i = 0; i < arrayExit.length; i++) {
				if (arrayExit[i].trim() !== '') {
					var device = DOMINAPLUS_MANAGER_deviceList.filter(function (element) { return parseInt(element.id) === parseInt(arrayExit[i].trim()); })[0]; // VER80
					if (typeof device !== 'undefined' && device !== null && typeof device.type !== 'undefined' && parseInt(device.type) === 6) {
						if (typeof device.isGeoLocal !== 'undefined' && device.isGeoLocal === 0) {
							device.isGeoLocal = 2;
						} else {
							device.isGeoLocal = 3;
						}
					}
				}
			}
		} else {
			console.log('%c' + WEBAPP_PREFIX + 'geolocalScenarioExitURL: error', 'color: ' + WEBAPP_CONSOLE_ERROR);
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Adds device mode / map mode events
 * @version VER230 - WANDA
 */
function WEBAPP_LMCisLoaded()
{
	var menuV82 = document.getElementById('menu-v82');
	if (menuV82 !== null) {
		var htmlToAdd = '<div class="btn_mapmode">';
		htmlToAdd += '<a class="devicemode active" onclick="WEBAPP_clickOnMapmodeButton(event.currentTarget)">' + ModalitaDispositivo + '</a>';
		htmlToAdd += '<a class="mapmode" onclick="WEBAPP_clickOnMapmodeButton(event.currentTarget)">' + ModalitaMappa + '</a>';
		htmlToAdd += '</div>';
		menuV82.insertAdjacentHTML('beforeend', htmlToAdd);
	}
	if (window.innerWidth > DISPLAY_widthOrientationChange) { // VER170 WANDA --- Verifico la dimensione dello schermo per settare il mapmode
		if (WEBAPP_getCookie('viewmode') === 'mapmode' || WEBAPP_getCookie('viewmode') === '') {
			var mapmode = document.querySelector('.btn_mapmode a.mapmode');
			if (mapmode !== null) {
				setTimeout(WEBAPP_clickOnMapmodeButton(mapmode), 1000);
			}
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Gets a device given its ID
 * @param {number} deviceID - the ID of the device
 * @returns the device with the ID selected or false if none has been found
 * @version VER209 - WANDA
 */
function WEBAPP_getDevice(deviceID)
{
	for (var i = 0; i < DOMINAPLUS_MANAGER_deviceList.length; i++) {
		if (parseInt(DOMINAPLUS_MANAGER_deviceList[i].id) === parseInt(deviceID)) {
			return DOMINAPLUS_MANAGER_deviceList[i];
		}
	}
	return false;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Gets a map given its ID
 * @param {number} mapID - the ID of the map
 * @returns the map with the ID selected or false if none has been found
 * @version VER209 - WANDA
 */
function WEBAPP_getArea(mapID)
{
	for (var i = 0; i < DOMINAPLUS_MANAGER_areaList.length; i++) {
		if (parseInt(DOMINAPLUS_MANAGER_areaList[i].id) === parseInt(mapID)) {
			return DOMINAPLUS_MANAGER_areaList[i];
		}
	}
	return false;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages the response to the GEP command (GET ECONOMIZER PARAMETERS). It requests the functional parameters of the 53AB-ECO economizer
 * @param {object} record - array of arrays containing the response data
 * @version VER230 - WANDA
 */
function WEBAPP_manageCommandGEP(record)
{
	WEBAPP_maxConsumptionScale = record[0][12];
  WEBAPP_consumptionAlertValue = record[0][13];
  if (typeof SETTINGS_MULTIPLIER_manageGEP === 'function') {
    SETTINGS_MULTIPLIER_manageGEP(record);
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates the HTML element related to power
 * @param {string} deviceID - the ID of the device to update
 * @param {string} powerValue - the updated power value
 * @param {string} deviceType - the type of the device to update
 * @version VER216 - WANDA
 */
function WEBAPP_commandPWRcompleted(deviceID, powerValue, deviceType)
{
	var stage = document.getElementById('stage');
	if (WEBAPP_showEnergy === true && !DISPLAY_isTS10 && stage !== null && !stage.classList.contains('mapview')) {
		var htmlToAdd = '';
		var box2LiA = document.querySelectorAll('#box2 li > a');
		if (box2LiA !== null) {
			for (var i = 0; i < box2LiA.length; i++) {
				if (parseInt(box2LiA[i].getAttribute('id').split('_')[1]) === parseInt(deviceID)) {
					var box2PowerContainer = document.getElementById('box2PowerContainer_' + deviceID);
					if (box2PowerContainer !== null) {
						var box2PowerElement = document.getElementById('box2PowerElement_' + deviceID);
						if (box2PowerElement !== null) {
							box2PowerElement.innerHTML = powerValue + ' W';
						}
					} else {
						var styleToAdd = 'style="position: relative; top: 50%; -webkit-transform: translateY(-50%); transform: translateY(-50%);"';
						if (parseInt(deviceType) === 9) {
							styleToAdd = '';
						}
						htmlToAdd = '';
						htmlToAdd += '<div class="powerContainer" id="box2PowerContainer_' + deviceID + '">';
						htmlToAdd += '<div class="powerElement" id="box2PowerElement_' + deviceID + '" ' + styleToAdd + '>' + powerValue + ' W</div>';
						if (parseInt(deviceType) === 9) {
							htmlToAdd += '<div class="powerGraphElement" id="box2PowerGraphElement_' + deviceID + '" onclick="WEBAPP_clickOnEnergyGraph(' + deviceID + ')"></div>';
						}
						htmlToAdd += '</div>';
						box2LiA[i].style.width = 'calc(100% - 60px)';
						box2LiA[i].parentNode.insertAdjacentHTML('beforeend', htmlToAdd);
					}
				}
			}
		}
		var box3 = document.getElementById('box3');
		if (box3 !== null) {
			var box3PowerElement = document.getElementById('box3PowerElement_' + deviceID);
			if (box3PowerElement !== null) {
				box3PowerElement.innerHTML = powerValue + ' W';
			} else {
				var box3Ico = document.querySelector('#box3 .ico');
				if (box3Ico !== null) {
					if (box3Ico.getAttribute('id').split('_')[1] === deviceID) {
						htmlToAdd = '';
						htmlToAdd += '<div class="powerContainer" id="box3PowerContainer_' + deviceID + '">';
						htmlToAdd += '<div class="powerElement" id="box3PowerElement_' + deviceID + '">' + powerValue + ' W</div>';
						if (parseInt(deviceType) === 9) {
							htmlToAdd += '<div class="powerGraphElement" id="box3PowerGraphElement_' + deviceID + '" onclick="WEBAPP_clickOnEnergyGraph(' + deviceID + ')"></div>';
						}
						htmlToAdd += '</div>';
						box3.insertAdjacentHTML('beforeend', htmlToAdd); // VER236 WANDA
					}
				}
			}
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates the HTML based on the response to the AMS command
 * @param {number} slaveErrors - slaveError
 * @param {number} slaveID     - the ID of the slave
 * @version VER230 - WANDA
 */
function WEBAPP_manageCommandAMS(slaveErrors, slaveID)
{
	var warningIcon = document.getElementsByClassName('warning_icon_' + slaveID);
	if (warningIcon !== null) {
		if (slaveErrors > 10) {
			for (var i = 0; i < warningIcon.length; i++) {
				warningIcon[i].style.display = 'inline-block';
			}
		} else {
			for (var i = 0; i < warningIcon.length; i++) {
				warningIcon[i].style.display = 'none';
			}
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

function WEBAPP_clickOnEnergyGraph(deviceID)
{
	var classToAdd = '';
	WEBAPP_clickedOnEnergyChartsInBox2Box3 = true;
	WEBAPP_getOverHTML('webapps/webapp_legacy/settings_charts.htm', lblCharts, 'back'); // VER218C WANDA
	var box2ClickedElement = document.querySelector('#box2 #menu_ico_' + deviceID);
	if (box2ClickedElement !== null) {
		classToAdd = box2ClickedElement.classList;
	}
	var boxOverChartsList = document.querySelector('#boxOverChartsList #menu_ico_' + deviceID);
	if (boxOverChartsList !== null) {
		boxOverChartsList.className = '';
		boxOverChartsList.classList.add(classToAdd[0], classToAdd[1]);
	}
	if (typeof SETTINGS_CHARTS_showEnergyGraph !== 'undefined') {
		SETTINGS_CHARTS_showEnergyGraph(deviceID);
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------- THERMOSTAT GUI ------------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Creates the thermostat HTML in box3
 * @param {object} device - Object containing all the informations about the selected device
 * @version VER227 - WANDA
 */
function WEBAPP_contentIsThermo(device)
{
	var isMapview = false;
  var stage = document.getElementById('stage');
	if (stage !== null && stage.classList.contains('mapview')) {
		isMapview = true;
	}
	var htmlToAdd = '';
  var box3 = document.getElementById('box3');
  if (box3 !== null) {
    if (typeof device.id !== 'undefined' && typeof device.name !== 'undefined' && typeof device.type !== 'undefined' && typeof device.temperature !== 'undefined' && typeof device.setPoint !== 'undefined' && typeof device.offSet !== 'undefined' && typeof device.fanLevel !== 'undefined' && typeof device.localOFF !== 'undefined' && typeof device.season !== 'undefined' && typeof device.mode !== 'undefined' && typeof device.keyboardLock !== 'undefined' && typeof device.windowState !== 'undefined') {
			htmlToAdd += '<h1>' + device.name + '</h1>';
			var classToAddTS01 = '';
			var functionToAdd = 'onclick="WEBAPP_clickOnChangeKeyboardLock(' + device.id + ')"';
			if (typeof device.TS01 !== 'undefined' && device.TS01 === true) {
				classToAddTS01 = 'class="isTS01"';
				functionToAdd = '';
			}
      htmlToAdd += '<div ' + classToAddTS01 + ' id="thermo" rel="' + device.id + '" style="opacity: 0;">';
      // TEMPERATURE AND STATE ICON
      var stateClass = '';
      var stateElement = document.querySelector('#box2 #menu_ico_' + device.id);
      if (stateElement !== null) {
        stateClass = stateElement.getAttribute('class');
      }
      htmlToAdd += '<div id="temp_ril_div">';
      htmlToAdd += '<div class="' + stateClass + '" id="stato_' + device.id + '"></div>';
      htmlToAdd += '<div class="temp_ril" id="temp_ril_' + device.id + '">' + lbl_Temp_ril;
      htmlToAdd += '<br>';
      htmlToAdd += '<span>' + device.temperature + '&nbsp;&deg;C</span>';
      // ABANO
      if (typeof device.linkedid !== 'undefined' && typeof device.linkedid[0] !== 'undefined') {
        var abanoDevice = WEBAPP_getDevice(device.linkedid[0]);
        var abanoDeviceString = '- -';
        if (abanoDevice !== false && typeof abanoDevice.ValoreConvertito !== 'undefined' && typeof abanoDevice.UnitaMisura !== 'undefined') {
          abanoDeviceString = abanoDevice.ValoreConvertito + ' ' + abanoDevice.UnitaMisura;
        }
        htmlToAdd += '<i class="valore_abano" id="valore_abano_' + device.linkedid[0] + '">' + abanoDeviceString + '</i>';
      }
      // HUMIDITY VALUE
      if (typeof device.isHumidityProbe !== 'undefined' && typeof device.humidityValue !== 'undefined' && device.isHumidityProbe === true) {
				var humidityValue = '- -';
				if (parseInt(device.humidityValue) !== 255) {
					humidityValue = device.humidityValue;
				}
        htmlToAdd += '<div class="humidityValueDiv" id="humidityValue_' + device.id + '">' + humidityValue + ' %</div>';
      }
      htmlToAdd += '</div></div>';
      // HUMIDITY PROBE CONTAINER
      if (typeof device.isHumidityProbe !== 'undefined' && device.isHumidityProbe === true) {
        var classToAdd = 'isDeviceView';
        if (isMapview === true) {
          classToAdd = 'isMapView';
        }
        htmlToAdd += '<div class="humidityContainer ' + classToAdd + '" id="humidityContainer_' + device.id + '">';
        htmlToAdd += '<div class="humiditySemaphoreContainer" id="semaphoreContainer_' + device.id + '">';
        htmlToAdd += '<span class="humidityStatusDehumificator" id="humidityStatusDehumificator_' + device.id + '"></span>';
        htmlToAdd += '<span class="humidityStatusValve" id="humidityStatusValve_' + device.id + '"></span>';
        htmlToAdd += '<span class="humidityStatusGeneralPump" id="humidityStatusGeneralPump_' + device.id + '"></span>';
        htmlToAdd += '</div>';
        htmlToAdd += '<div class="humidityBarBackground" id="humidityBarBackground_' + device.id + '"></div>';
        htmlToAdd += '<div class="humidityBar" id="humidityBar_' + device.id + '"></div>';
        htmlToAdd += '<div class="humidityMore" id="humidityMore_' + device.id + '">...</div>';
        htmlToAdd += '<div class="humidityScale" id="humidityScale_' + device.id + '">';
        htmlToAdd += '<div class="scaleContainer0" id="scale0Container_' + device.id + '">';
        htmlToAdd += '<span class="verticalLine" id="verticalLine0_' + device.id + '"></span>';
        htmlToAdd += '<span class="humidityPercentage" id="percentage0_' + device.id + '">0%</span>';
        htmlToAdd += '</div>';
        htmlToAdd += '<div class="scaleContainerL" id="scaleLContainer_' + device.id + '">';
        htmlToAdd += '<span class="verticalLineThresholdL" id="verticalLineL_' + device.id + '"></span>';
        htmlToAdd += '<span class="humidityPercentageThresholdL" id="percentageL_' + device.id + '">L</span>';
        htmlToAdd += '</div>';
        htmlToAdd += '<div class="scaleContainerM" id="scaleMContainer_' + device.id + '">';
        htmlToAdd += '<span class="verticalLineThresholdM" id="verticalLineM_' + device.id + '"></span>';
        htmlToAdd += '<span class="humidityPercentageThresholdM" id="percentageM_' + device.id + '">M</span>';
        htmlToAdd += '</div>';
        htmlToAdd += '<div class="scaleContainerH" id="scaleHContainer_' + device.id + '">';
        htmlToAdd += '<span class="verticalLineThresholdH" id="verticalLineH_' + device.id + '"></span>';
        htmlToAdd += '<span class="humidityPercentageThresholdH" id="percentageH_' + device.id + '">H</span>';
        htmlToAdd += '</div>';
        htmlToAdd += '<div class="scaleContainer100" id="scale100Container_' + device.id + '">';
        htmlToAdd += '<span class="verticalLine" id="verticalLine100_' + device.id + '"></span>';
        htmlToAdd += '<span class="humidityPercentage" id="percentage100_' + device.id + '">100%</span>';
        htmlToAdd += '</div></div></div>';
      }
      // SETPOINT AND OFFSET
      htmlToAdd += '<div id="temp_imp_div">';
      htmlToAdd += '<span id="cmd_minus"></span>';
      htmlToAdd += '<div class="temp_imp" id="temp_imp">' + lbl_Temp_imp;
      htmlToAdd += '<br>';
      htmlToAdd += '<span>' + device.setPoint + '&nbsp;&deg;C</span>';
      htmlToAdd += '<br>';
      htmlToAdd += '<p id="offset">(offset ' + device.offSet + '&nbsp;&deg;C)</p>';
      htmlToAdd += '</div>';
      htmlToAdd += '<span id="cmd_plus"></span>';
      htmlToAdd += '</div>';
      // OFF DIV
      htmlToAdd += '<div id="off_div">' + lbl_Temp_imp;
      htmlToAdd += '<br>';
      htmlToAdd += '<span>OFF</span>';
      htmlToAdd += '</div>';
      // FAN LEVEL
      htmlToAdd += '<div id="fan_div">' + lbl_Fan;
      htmlToAdd += '<div class="fan_' + device.fanLevel + '" id="fan_' + device.id + '"></div>';
      htmlToAdd += '</div>';
      // BTNONOFF, SEASON AND MODE
      htmlToAdd += '<div id="mode_div">';
      htmlToAdd += '<a class="btnOnOff_' + device.localOFF + '" id="btnOnOff_' + device.id + '" onclick="WEBAPP_clickOnChangeLocalOFF(' + device.id + ')"></a>';
      htmlToAdd += '<a class="season_' + device.season + '" id="season_' + device.id + '" onclick="WEBAPP_clickOnChangeSeason(' + device.id + ')"></a>';
      htmlToAdd += '<a class="mode_' + device.mode + '" id="mode_' + device.id + '" onclick="WEBAPP_clickOnChangeMode(' + device.id + ')"></a>';
      htmlToAdd += '</div>';
      // KEYBOARDLOCK AND WINDOWSTATE
      htmlToAdd += '<div id="icone_div">';
      htmlToAdd += '<a class="statofinestra_' + device.windowState + '" id="btnStatoFinestra_' + device.id + '"></a>';
      htmlToAdd += '<a class="bloccotastiera_' + device.keyboardLock + '" id="btnBloccoTastiera_' + device.id + '" ' + functionToAdd + '></a>';
      htmlToAdd += '</div>';
      // SPLIT
      if (typeof device.stagionesplit !== 'undefined' && device.stagionesplit !== null) {
        htmlToAdd += '<div id="icone_split_div">';
        htmlToAdd += '<a rel="' + device.stagionesplit + '"></a>';
        htmlToAdd += '</div>';
      }
      htmlToAdd += '</div>';
      // ARROWS
      if (isMapview === true) {
        htmlToAdd += '<a class="ico_50 ico_rotateleft" onclick="WEBAPP_rotateDeviceFamily(' + device.type + ', -1);">';
        htmlToAdd += '<span class="px-icon icon-elegant-arrow-carrot-left"></span>';
        htmlToAdd += '</a>';
        htmlToAdd += '<a class="ico_50 ico_rotateright" onclick="WEBAPP_rotateDeviceFamily(' + device.type + ', 1);">';
        htmlToAdd += '<span class="px-icon icon-elegant-arrow-carrot-right"></span>';
        htmlToAdd += '</a>';
      }
      // EDIT CHRONO
      htmlToAdd += '<div class="edit_chrono_box edit_chrono_box_' + device.id + '" title="' + device.name + '" onclick="WEBAPP_clickOnEditChrono(\'' + device.name + '\', ' + device.id + ')">';
      htmlToAdd += '<span class="edit_chrono px-btn px-icon icon-pencil-2"></span>';
      htmlToAdd += '</div>';
			box3.insertAdjacentHTML('beforeend', htmlToAdd);
    }
    WEBAPP_manageThermoStyles();
    WEBAPP_addThermostatHTMLButtonsEventHandlers(device.id);
    /* VER157 WANDA */
    THERMO_storedSetPointValue = parseFloat(device.setPoint) * 10;
    WEBAPP_updateThermostatAllFieldsHTML(device);
    /* ------------ */
		/* Presenti nella funzione THERMO_getThermostatus -> riportati e modificati per sicurezza */
		if ($('.profilo-termico:visible').length <= 0) {
			if (WEBAPP_pollingPause > 0) {
				WEBAPP_pollingPause--;
			}
		}
		/* -------------------------------------------------------------------------------------- */
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Creates the thermostat HTML in box3 - IOT STYLE
 * @param {object} device - Object containing all the informations about the selected device
 * @version VER227 - WANDA
 */
function WEBAPP_contentIsThermoIoT(device)
{
	var isMapview = false;
  var stage = document.getElementById('stage');
	if (stage !== null && stage.classList.contains('mapview')) {
		isMapview = true;
	}
	var htmlToAdd = '';
  var box3 = document.getElementById('box3');
  if (box3 !== null) {
    if (typeof device.id !== 'undefined' && typeof device.name !== 'undefined' && typeof device.type !== 'undefined' && typeof device.temperature !== 'undefined' && typeof device.setPoint !== 'undefined' && typeof device.offSet !== 'undefined' && typeof device.fanLevel !== 'undefined' && typeof device.localOFF !== 'undefined' && typeof device.season !== 'undefined' && typeof device.mode !== 'undefined' && typeof device.keyboardLock !== 'undefined') {
      htmlToAdd += '<h1>' + device.name + '</h1>';
      htmlToAdd += '<div class="thermo_iotStyleContainer" id="thermo" rel="' + device.id + '">';

			htmlToAdd += '<div class="thermostatContainer" id="thermostatContainer_' + device.id + '">';
			htmlToAdd += '<div class="thermostatMainContainer" id="thermostatMainContainer_' + device.id + '">';

			htmlToAdd += '<div class="thermostatInnerMainLeft" id="thermostatInnerMainLeft_' + device.id + '">';
			htmlToAdd += '<div class="changeSeasonCommand" id="changeSeasonCommand_' + device.id + '" onclick="WEBAPP_clickOnChangeSeason(' + device.id + ')"></div>';
      htmlToAdd += '<div class="powerCommand" id="powerCommand_' + device.id + '" onclick="WEBAPP_clickOnChangeLocalOFF(' + device.id + ')"></div>';
    	htmlToAdd += '</div>';

			htmlToAdd += '<div class="thermostatInnerMainCenter" id="thermostatInnerMainCenter_' + device.id + '">';
    	htmlToAdd += '<div class="coloredCircle disabledCircle" id="coloredCircle_' + device.id + '">';
    	htmlToAdd += '<div class="radius" id="radius_' + device.id + '"></div>';
    	htmlToAdd += '</div>';
    	htmlToAdd += '<div class="innerCircle" id="innerCircle_' + device.id + '">';
			htmlToAdd += '<div class="centerInnerCircle" id="centerInnerCircle_' + device.id + '">';

			htmlToAdd += '<div class="firstRow" id="firstRow_' + device.id + '">';
			htmlToAdd += '<div class="fanSpeed fan_' + device.fanLevel + '" id="fanSpeed_' + device.id + '"></div>';
			htmlToAdd += '</div>';

			htmlToAdd += '<div class="secondRow" id="secondRow_' + device.id + '">';
			htmlToAdd += '<div class="season season_' + device.season + '" id="season_' + device.id + '"></div>';
			htmlToAdd += '<div class="mode mode_' + device.mode + '" id="mode_' + device.id + '"></div>';
			htmlToAdd += '<div class="keyboard bloccotastiera_' + device.keyboardLock + '" id="keyboard_' + device.id + '"></div>';
			htmlToAdd += '</div>';

			htmlToAdd += '<div class="detectedTemperature" id="detectedTemperature_' + device.id + '">';
			htmlToAdd += '<div class="detectedTemperatureLeft" id="detectedTemperatureLeft_' + device.id + '">';
			htmlToAdd += '<div class="integerTemperature" id="integerTemperature_' + device.id + '">' + Math.trunc(device.temperature) + '</div></div>';
			htmlToAdd += '<div class="detectedTemperatureRight" id="detectedTemperatureRight_' + device.id + '">';
			htmlToAdd += '<div class="unitTemperature" id="unitTemperature_' + device.id + '">&deg;C</div>';
			htmlToAdd += '<div class="decimalTemperature" id="decimalTemperature_' + device.id + '">.' + (device.temperature * 10) % 10 + '</div></div>';
			htmlToAdd += '</div>';

			htmlToAdd += '<div class="thirdRow" id="thirdRow_' + device.id + '">';
			htmlToAdd += '<div class="minusCommand" id="minusCommand_' + device.id + '"></div>';
			htmlToAdd += '<div class="setPointAndOffsetContainer" id="setPointAndOffsetContainer_' + device.id + '">'
			htmlToAdd += '<div class="setPointTemperature" id="setPointTemperature_' + device.id + '">' + device.setPoint + '&nbsp;&deg;C</div>';
			htmlToAdd += '</div>';
			htmlToAdd += '<div class="plusCommand" id="plusCommand_' + device.id + '"></div>';
			htmlToAdd += '</div>';

			htmlToAdd += '<div class="fourthRow" id="fourthRow_' + device.id + '">';
			var humidityValue = '- -';
			if (typeof device.humidityValue !== 'undefined' && parseInt(device.humidityValue) !== 255) {
				humidityValue = device.humidityValue + ' %';
			}
			htmlToAdd += '<div class="thermostatHumidityContainer" id="thermostatHumidityContainer_' + device.id + '">' + humidityValue + '</div>';
			htmlToAdd += '</div></div></div></div>';

			htmlToAdd += '<div class="thermostatInnerMainRight" id="thermostatInnerMainRight_' + device.id + '">';
    	if (device.name.substr(0, 9) !== 'TS1Server') {
      	htmlToAdd += '<div class="changeModeCommand mode_' + device.mode + '" id="changeModeCommand_' + device.id + '" onclick="WEBAPP_clickOnChangeMode(' + device.id + ')"></div>';
				htmlToAdd += '<div class="changeKeyboardLockCommand" id="changeKeyboardLockCommand_' + device.id + '" onclick="WEBAPP_clickOnChangeKeyboardLock(' + device.id + ')"></div>';
    	}
    	htmlToAdd += '</div></div>';
			// EDIT CHRONO
      htmlToAdd += '<div class="edit_chrono_box edit_chrono_box_' + device.id + '" title="' + device.name + '" onclick="WEBAPP_clickOnEditChrono(\'' + device.name + '\', ' + device.id + ')">';
      htmlToAdd += '<span class="edit_chrono px-btn px-icon icon-pencil-2"></span>';
      htmlToAdd += '</div>';
			// ARROWS
			if (isMapview === true) {
        htmlToAdd += '<a class="ico_50 ico_rotateleft" onclick="WEBAPP_rotateDeviceFamily(' + device.type + ', -1);">';
        htmlToAdd += '<span class="px-icon icon-elegant-arrow-carrot-left"></span>';
        htmlToAdd += '</a>';
        htmlToAdd += '<a class="ico_50 ico_rotateright" onclick="WEBAPP_rotateDeviceFamily(' + device.type + ', 1);">';
        htmlToAdd += '<span class="px-icon icon-elegant-arrow-carrot-right"></span>';
        htmlToAdd += '</a>';
      }
			htmlToAdd += '</div>';
			box3.insertAdjacentHTML('beforeend', htmlToAdd);
		}
		// WINDOWSTATE --- FLASH ANIMATION
    if (typeof device.windowVisibility !== 'undefined' && parseInt(device.windowVisibility) === 1) {
      var detectedTemperature = document.getElementById('detectedTemperature_' + device.id);
      if (detectedTemperature !== null) {
        if (parseInt(device.windowState) === 0) {
          if (detectedTemperature.classList.contains('flashAnimation')) {
            detectedTemperature.classList.remove('flashAnimation');
          }
        } else {
          if (!detectedTemperature.classList.contains('flashAnimation')) {
            detectedTemperature.classList.add('flashAnimation');
          }
        }
      }
    }
		THERMO_storedSetPointValue = parseFloat(device.setPoint) * 10;
		WEBAPP_addThermostatHTMLButtonsEventHandlers(device.id);
    WEBAPP_updateThermostatAllFieldsHTML(device);
		WEBAPP_moveRadiusBasedOnSetPoint(parseInt(device.id), parseFloat(device.setPoint) * 10); // VER217 WANDA
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Changes thermostat appearance based on device
 * @version VER203 - WANDA
 */
function WEBAPP_manageThermoStyles()
{
	var thermo = document.getElementById('thermo');
	if (thermo !== null) {
		thermo.style.opacity = '1';
	}
	if (DISPLAY_WBS_canApplyFullscreenStyleBasedOnUserAgent()) { // VER170 WANDA
		var editChronoBox = document.getElementsByClassName('edit_chrono_box')[0];
		if (editChronoBox !== null) {
			var stage = document.getElementById('stage');
			if (stage !== null) {
				editChronoBox.style.position = 'absolute';
				if (stage.classList.contains('mapview')) {
					editChronoBox.style.top = '55px';
					editChronoBox.style.right = '10px';
				} else {
					editChronoBox.style.top = '16px';
					editChronoBox.style.right = '8px';
				}
			}
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates the HTML concerning the TEMPERATURE
 * @param {string} id 				 - ID of the device to be updated
 * @param {string} temperature - New temperature value
 * @version VER203 - WANDA
 */
function WEBAPP_updateThermostatTemperatureHTML(id, temperature)
{
	var thermo = document.getElementById('thermo');
  if (thermo !== null && thermo.getAttribute('rel') === id) {
    var tempRilSpan = document.querySelector('#temp_ril_' + id + ' span');
    if (tempRilSpan !== null) {
      tempRilSpan.innerHTML = (parseInt(temperature) / 10).toFixed(1) + '&nbsp;&deg;C';
    }
		// IOT STYLE
		var integerTemperature = document.getElementById('integerTemperature_' + id);
		if (integerTemperature !== null) {
			integerTemperature.innerHTML = Math.trunc(parseInt(temperature) / 10);
		}
		var decimalTemperature = document.getElementById('decimalTemperature_' + id);
  	if (decimalTemperature !== null) {
    	decimalTemperature.innerHTML = '.' + parseInt(temperature) % 10;
  	}
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
* Updates the HTML concerning the SETPOINT
* @param {string} id 			 - ID of the device to be updated 
* @param {string} setPoint - New setPoint value
* @version VER203 - WANDA
*/
function WEBAPP_updateThermostatSetPointHTML(id, setPoint)
{
  var thermo = document.getElementById('thermo');
  if (thermo !== null && thermo.getAttribute('rel') === id) {
		var tempImpSpan = document.querySelector('#temp_imp span');
		if (tempImpSpan !== null) {
			tempImpSpan.innerHTML = (parseInt(setPoint) / 10).toFixed(1) + '&nbsp;&deg;C';
		}
		// IOT STYLE
		var setPointTemperature = document.getElementById('setPointTemperature_' + id);
		if (setPointTemperature !== null) {
			setPointTemperature.innerHTML = (parseInt(setPoint) / 10).toFixed(1) + '&nbsp;&deg;C';
			WEBAPP_moveRadiusBasedOnSetPoint(parseInt(id), parseInt(setPoint));
		}
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates the HTML concerning the OFFSET
 * @param {string} id 		- ID of the device to be updated
 * @param {string} offSet - New offSet value
 * @version VER205B - WANDA
 */
function WEBAPP_updateThermostatOffSetHTML(id, offSet)
{
  var offSetToUpdate = parseInt(offSet) / 10;
  var offSetToString = '';
  if (offSetToUpdate > 0) {
    offSetToString = '+' + offSetToUpdate.toString();
  } else {
    offSetToString = offSetToUpdate.toString();
  }
  var thermo = document.getElementById('thermo');
  if (thermo !== null && thermo.getAttribute('rel') === id) {
    var offsetElement = document.getElementById('offset');
    if (offsetElement !== null) {
      offsetElement.innerHTML = '(offset ' + offSetToString + '&nbsp;&deg;C)';
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
* Updates the HTML concerning the FANLEVEL
* @param {string} id 			 			- ID of the device to be updated
* @param {string} fanLevel 			- New fanLevel value
* @param {boolean} isMapCommand - Is it fired by a mapCommand?
* @version VER205B - WANDA
*/
function WEBAPP_updateThermostatFanLevelHTML(id, fanLevel, isMapCommand)
{
	var device = WEBAPP_getDevice(id);
	if (device !== false && typeof device.season !== 'undefined') {
		// UPDATING BOX3
		var thermo = document.getElementById('thermo');
		if (thermo !== null && thermo.getAttribute('rel') === id) {
			// UPDATING FAN LEVEL ICON
			var fanElement = document.getElementById('fan_' + id);
			if (fanElement !== null) {
				fanElement.className = '';
				fanElement.classList.add('fan_' + fanLevel);
			}
			// IOT STYLE
			var fanSpeed = document.getElementById('fanSpeed_' + id);
			if (fanSpeed !== null) {
				fanSpeed.className = '';
				fanSpeed.classList.add('fanSpeed', 'fan_' + fanLevel);
			}
    	// UPDATING STATE ICON AND SPLIT ICON
      var thermoIcon = document.getElementById('stato_' + id);
      if (thermoIcon !== null) {
        WEBAPP_updateStateIconBasedOnFanLevel(device.season, parseInt(fanLevel), thermoIcon);
        if (isMapCommand === true) {
          WEBAPP_updateSplit(device.season, parseInt(fanLevel), device);
        }
      }
    }
		// UPDATING BOX2
		var box2MenuIco = document.querySelector('#box2 #menu_ico_' + id);
		if (box2MenuIco !== null) {
			WEBAPP_updateStateIconBasedOnFanLevel(device.season, parseInt(fanLevel), box2MenuIco);
		}
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates the HTML concerning the SEASON
 * @param {string} id 					 - ID of the device to be updated
 * @param {string} season 			 - New season value
 * @param {boolean} isMapCommand - Is it fired by a mapCommand?
 * @version VER205B - WANDA
 */
function WEBAPP_updateThermostatSeasonHTML(id, season, isMapCommand)
{
  // UPDATING BOX3
  var thermo = document.getElementById('thermo');
  if (thermo !== null && thermo.getAttribute('rel') === id) {
    // UPDATING SEASON ICON
    var seasonElement = document.getElementById('season_' + id);
    if (seasonElement !== null) {
      seasonElement.className = '';
      seasonElement.classList.add('season', 'season_' + (parseInt(season) & 0x01));
    }
    // UPDATING STATE ICON
    if (isMapCommand === false) {
      var thermoIcon = document.getElementById('stato_' + id);
      if (thermoIcon !== null) {
        thermoIcon.className = '';
        if (parseInt(season) === 0) {
          thermoIcon.classList.add('ico', 'ico4_0');
        } else {
          thermoIcon.classList.add('ico', 'ico4_128');
        }
      }
    }
		// ENABLING / DISABLING HUMIDITY PROBE
		if (!thermo.classList.contains('thermo_iotStyleContainer')) {
			var device = WEBAPP_getDevice(id);
			if (device !== false) {
				if (typeof device.humidityEnabled !== 'undefined' && device.humidityEnabled === 1 && parseInt(season) === 0) { // ENABLED and SUMMER
					setTimeout(function() { WEBAPP_enableHumidityProbe(id); }, 100);
				} else {
					WEBAPP_disableHumidityProbe(id);
				}
			}
		}
	}
	// UPDATING BOX2
	var box2MenuIco = document.querySelector('#box2 #menu_ico_' + id);
	if (box2MenuIco !== null) {
		WEBAPP_updateStateIconBasedOnSeason(parseInt(season), box2MenuIco);
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
* Updates the HTML concerning the MODE
* @param {string} id 	 - ID of the device to be updated 
* @param {string} mode - New mode value
* @version VER215 - WANDA
*/
function WEBAPP_updateThermostatModeHTML(id, mode)
{
	var thermo = document.getElementById('thermo');
	if (thermo !== null && thermo.getAttribute('rel') === id) {
		var modeElement = document.getElementById('mode_' + id);
		if (modeElement !== null) {
			modeElement.className = '';
			if (mode === 'M' || parseInt(mode) === 1) {
				modeElement.classList.add('mode', 'mode_1');
			} else {
				modeElement.classList.add('mode', 'mode_0');
			}
		}
		// IOT STYLE
		var changeModeCommand = document.getElementById('changeModeCommand_' + id);
		if (changeModeCommand !== null) {
			var isPowerBlocked = changeModeCommand.classList.contains('powerBlocked');
			changeModeCommand.className = '';
			if (mode === 'M' || parseInt(mode) === 1) {
				changeModeCommand.classList.add('changeModeCommand', 'mode_1');
			} else {
				changeModeCommand.classList.add('changeModeCommand', 'mode_0');
			}
			if (isPowerBlocked === true) {
				changeModeCommand.classList.add('powerBlocked');
			}
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates the HTML concerning the LOCALOFF
 * @param {string} id 					 - ID of the device to be updated
 * @param {string} localOFF 		 - New localOFF value
 * @param {boolean} isMapCommand - Is it fired by a mapCommand?
 * @version VER195 - WANDA
 */
function WEBAPP_updateThermostatLocalOFFHTML(id, localOFF, isMapCommand)
{
  var thermo = document.getElementById('thermo');
  if (thermo !== null && thermo.getAttribute('rel') === id) {
		var device = WEBAPP_getDevice(id);
  	if (device !== false) {
      if (parseInt(localOFF) === 1) { // TLO arrived with value of 1 (1 = OFF => Needs to be switched OFF)
        WEBAPP_switchingOFFThermostatHTML(device);
      } else { // Needs to be switched ON
        WEBAPP_switchingONThermostatHTML(device, isMapCommand);
      }
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
* Updates the HTML concerning the WINDOWSTATE
* @param {string} id 					- ID of the device to be updated
* @param {string} windowState - New windowState value
* @version VER203 - WANDA
*/
function WEBAPP_updateThermostatWindowStateHTML(id, windowState)
{
  var thermo = document.getElementById('thermo');
  if (thermo !== null && thermo.getAttribute('rel') === id) {
    var btnStatoFinestra = document.getElementById('btnStatoFinestra_' + id);
    if (btnStatoFinestra !== null) {
      btnStatoFinestra.className = '';
      btnStatoFinestra.classList.add('statofinestra_' + windowState);
    }
		// IOT STYLE
		var device = WEBAPP_getDevice(id);
    if (device !== false) {
      if (typeof device.windowVisibility !== 'undefined' && parseInt(device.windowVisibility) === 1) {
        var detectedTemperature = document.getElementById('detectedTemperature_' + id);
        if (detectedTemperature !== null) {
          if (parseInt(windowState) === 0) {
            if (detectedTemperature.classList.contains('flashAnimation')) {
              detectedTemperature.classList.remove('flashAnimation');
            }
          } else {
            if (!detectedTemperature.classList.contains('flashAnimation')) {
              detectedTemperature.classList.add('flashAnimation');
            }
          }
        }
      }
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates the HTML concerning the KEYBOARDLOCK
 * @param {string} id 					- ID of the device to be updated 
 * @param {string} keyboardLock - New keyboard lock value
 * @version VER203 - WANDA
 */
function WEBAPP_updateThermostatKeyboardLockHTML(id, keyboardLock)
{
	var device = WEBAPP_getDevice(id);
  var thermo = document.getElementById('thermo');
  if (thermo !== null && thermo.getAttribute('rel') === id) {
    var btnBloccoTastiera = document.getElementById('btnBloccoTastiera_' + id);
    if (btnBloccoTastiera !== null) {
      // HUMIDITY PROBE
			if (device !== false) {
      	if (typeof device.isHumidityProbe !== 'undefined' && device.isHumidityProbe === true) {
        	btnBloccoTastiera.style.display = 'none';
      	} else {
        	btnBloccoTastiera.className = '';
        	btnBloccoTastiera.classList.add('bloccotastiera_' + keyboardLock);
      	}
    	}
    }
		// IOT STYLE
		if (device !== false) {
			var keyboardElement = document.getElementById('keyboard_' + id);
    	if (keyboardElement !== null) {
				keyboardElement.className = '';
				keyboardElement.classList.add('keyboard', 'bloccotastiera_' + keyboardLock);
			}
		}
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates the HTML concerning the HUMIDITYPROBE
 * @param {string} id 												 - The ID of the device to update
 * @param {number} humidityValue 							 - New humidityValue value
 * @param {number} humidityThresholdL 				 - New humidityThresholdL value
 * @param {number} humidityThresholdM 				 - New humidityThresholdM value
 * @param {number} humidityThresholdH 				 - New humidityThresholdH value
 * @param {number} humidityStatusDehumificator - New humidityStatusDehumificator value
 * @param {number} humidityStatusValve 				 - New humidityStatusValve status
 * @param {number} humidityStatusGeneralPump 	 - New humidityStatusGeneralPump value
 * @version VER239 - WANDA
 */
function WEBAPP_updateHumidityProbeHTML(id, humidityValue, humidityThresholdL, humidityThresholdM, humidityThresholdH, humidityStatusDehumificator, humidityStatusValve, humidityStatusGeneralPump)
{
	// UPDATING BOX3
	var thermo = document.getElementById('thermo');
	if (thermo !== null && thermo.getAttribute('rel') === id) {
		var humidityValueElement = document.getElementById('humidityValue_' + id);
		if (humidityValueElement !== null && parseInt(humidityValue) !== 255) {
			humidityValueElement.innerHTML = humidityValue + ' %';
		}
		var thermostatHumidityContainer = document.getElementById('thermostatHumidityContainer_' + id);
		if (thermostatHumidityContainer !== null && parseInt(humidityValue) !== 255) {
			thermostatHumidityContainer.innerHTML = humidityValue + ' %';
		}
	}
	var device = WEBAPP_getDevice(id);
	if (device !== false) {
		if (typeof device.humidityEnabled !== 'undefined' && typeof device.season !== 'undefined' && parseInt(device.humidityEnabled) === 1 && parseInt(device.season) === 0) { // ENABLED and SUMMER
			setTimeout(function() { WEBAPP_enableHumidityProbe(id); }, 100);
		} else {
			WEBAPP_disableHumidityProbe(id);
		}
	}
	// UPDATING BOXOVER
	var boxOver = document.getElementById('boxOver');
	if (boxOver !== null && typeof Device !== 'undefined' && parseInt(id) === parseInt(Device.id)) { // VER239 WANDA
		// VALUE
		var humidityBoxOverPercentageValue = document.getElementById('humidityBoxOverPercentageValue');
		if (humidityBoxOverPercentageValue !== null) {
			humidityBoxOverPercentageValue.innerHTML = lblDetectedValue + humidityValue + '%';
		}
		// SEMAPHORES
		var humidityStatusDehumificatorElement = document.getElementById('humidityStatusDehumificator');
		if (humidityStatusDehumificatorElement !== null) {
			if (humidityStatusDehumificator === 1) {
				humidityStatusDehumificatorElement.style.backgroundColor = '#03ff00';
			} else {
				humidityStatusDehumificatorElement.style.backgroundColor = '#7f7f7f';
			}
		}
		var humidityStatusValveElement = document.getElementById('humidityStatusValve');
		if (humidityStatusValveElement !== null) {
			if (humidityStatusValve === 1) {
				humidityStatusValveElement.style.backgroundColor = '#ffff00';
			} else {
				humidityStatusValveElement.style.backgroundColor = '#7f7f7f';
			}
		}
		var humidityStatusGeneralPumpElement = document.getElementById('humidityStatusGeneralPump');
		if (humidityStatusGeneralPumpElement !== null) {
			if (humidityStatusGeneralPump === 1) {
				humidityStatusGeneralPumpElement.style.backgroundColor = '#ff0000';
			} else {
				humidityStatusGeneralPumpElement.style.backgroundColor = '#7f7f7f';
			}
		}
		// BAR
		var humidityBoxOverBarBackground = document.getElementById('humidityBoxOverBarBackground');
		if (humidityBoxOverBarBackground !== null) {
			var humidityBoxOverBarBackgroundWidth = (humidityBoxOverBarBackground.clientWidth / humidityBoxOverBarBackground.parentElement.clientWidth) * 100;
			var humidityBoxOverBarWidth = (humidityBoxOverBarBackgroundWidth * humidityValue) / 100;
			var humidityBoxOverBar = document.getElementById('humidityBoxOverBar');
			if (humidityBoxOverBar !== null) {
				humidityBoxOverBar.style.width = humidityBoxOverBarWidth + '%';
			}
		}
		// THRESHOLD L
		var humidityBoxOverScaleLContainer = document.getElementById('humidityBoxOverScaleLContainer');
		if (humidityBoxOverScaleLContainer !== null) {
			humidityBoxOverScaleLContainer.style.left = 'calc(' + humidityThresholdL + '% - 2.5px)';
		}
		var humidityBoxOverPercentageL = document.getElementById('humidityBoxOverPercentageL');
		if (humidityBoxOverPercentageL !== null) {
			humidityBoxOverPercentageL.innerHTML = 'L ' + humidityThresholdL + '%';
		}
		var LThresholdInput = document.getElementById('LThresholdInput');
		if (LThresholdInput !== null) {
			LThresholdInput.value = humidityThresholdL;
		}
		var LThresholdInputValue = document.getElementById('LThresholdInputValue');
		if (LThresholdInputValue !== null) {
			LThresholdInputValue.innerHTML = humidityThresholdL;
		}
		// THRESHOLD M
		var humidityBoxOverScaleMContainer = document.getElementById('humidityBoxOverScaleMContainer');
		if (humidityBoxOverScaleMContainer !== null) {
			humidityBoxOverScaleMContainer.style.left = 'calc(' + humidityThresholdM + '% - 2.5px)';
		}
		var humidityBoxOverPercentageM = document.getElementById('humidityBoxOverPercentageM');
		if (humidityBoxOverPercentageM !== null) {
			humidityBoxOverPercentageM.innerHTML = 'M ' + humidityThresholdM + '%';
		}
		var MThresholdInput = document.getElementById('MThresholdInput');
		if (MThresholdInput !== null) {
			MThresholdInput.value = humidityThresholdM;
		}
		var MThresholdInputValue = document.getElementById('MThresholdInputValue');
		if (MThresholdInputValue !== null) {
			MThresholdInputValue.innerHTML = humidityThresholdM;
		}
		// THRESHOLD H
		var humidityBoxOverScaleHContainer = document.getElementById('humidityBoxOverScaleHContainer');
		if (humidityBoxOverScaleHContainer !== null) {
			humidityBoxOverScaleHContainer.style.left = 'calc(' + humidityThresholdH + '% - 2.5px)';
		}
		var humidityBoxOverPercentageH = document.getElementById('humidityBoxOverPercentageH');
		if (humidityBoxOverPercentageH !== null) {
			humidityBoxOverPercentageH.innerHTML = 'H ' + humidityThresholdH + '%';
		}
		var HThresholdInput = document.getElementById('HThresholdInput');
		if (HThresholdInput !== null) {
			HThresholdInput.value = humidityThresholdH;
		}
		var HThresholdInputValue = document.getElementById('HThresholdInputValue');
		if (HThresholdInputValue !== null) {
			HThresholdInputValue.innerHTML = humidityThresholdH;
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates the HTML concerning the ABANOVALUE
 * @param {string} id 							- The ID of the device to update
 * @param {string} valoreConvertito - The new ValoreConvertito value
 * @param {string} unitaMisura 			- The new unitaMisura value
 * @version VER203 - WANDA
 */
function WEBAPP_updateAbanoValueHTML(id, valoreConvertito, unitaMisura)
{
	var abanoValueElement = document.getElementById('valore_abano_' + id);
	if (abanoValueElement !== null) {
		abanoValueElement.innerHTML = valoreConvertito + ' ' + unitaMisura;
	}
	// IOT STYLE
	var thermostatHumidityContainer = document.getElementById('thermostatHumidityContainer_' + id);
  if (thermostatHumidityContainer !== null) {
    thermostatHumidityContainer.innerHTML = valoreConvertito + ' ' + unitaMisura;
  }
	var VMCDaikinModbusAbanoValue = document.getElementsByClassName('VMCDaikinModbus_abano_value');
	if (VMCDaikinModbusAbanoValue !== null) {
		for (var i = 0; i < VMCDaikinModbusAbanoValue.length; i++) {
			if (parseInt(VMCDaikinModbusAbanoValue[i].getAttribute('data-abanoid')) === parseInt(id)) {
				VMCDaikinModbusAbanoValue[i].innerHTML = valoreConvertito;
			}
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
* Updates the HTML concerning all the selected thermostat fields
* @param {object} device - Object containing all the informations about the selected device
* @version VER195 - WANDA
*/
function WEBAPP_updateThermostatAllFieldsHTML(device)
{
  if (typeof device.id !== 'undefined' && typeof device.localOFF !== 'undefined') {
    var thermo = document.getElementById('thermo');
    if (thermo !== null && thermo.getAttribute('rel') === device.id) {
      if (parseInt(device.localOFF) === 1) {
        WEBAPP_switchingOFFThermostatHTML(device);
      } else {
        WEBAPP_switchingONThermostatHTML(device, null);
      }
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates the thermostat state icon based on fanLevel
 * @param {number} season 				 - The season value
 * @param {number} fanLevel 			 - The fanLevel value
 * @param {object} elementToUpdate - The element to update
 * @version VER195 - WANDA
 */
function WEBAPP_updateStateIconBasedOnFanLevel(season, fanLevel, elementToUpdate)
{
  var newIcon = fanLevel;
  if (season === 1) {
    newIcon += 128;
  }
  elementToUpdate.className = '';
  elementToUpdate.classList.add('ico', 'ico4_' + newIcon);
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates the thermostat state icon based on season
 * @param {number} season 				 - The season value
 * @param {object} elementToUpdate - The element to update
 * @version VER195 - WANDA
 */
function WEBAPP_updateStateIconBasedOnSeason(season, elementToUpdate)
{
  var newIcon = season & 0x01;
  if (newIcon === 1) {
    newIcon = 128;
  }
  elementToUpdate.className = '';
  elementToUpdate.classList.add('ico', 'ico4_' + newIcon);
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Modifies HTML in order to show the proper content when the thermostat is OFF
 * @param {object} device - Object containing all the informations about the selected device
 * @version VER203 - WANDA
 */
function WEBAPP_switchingOFFThermostatHTML(device)
{
  if (typeof device.id !== 'undefined' && typeof device.localOFF !== 'undefined' && typeof device.name !== 'undefined') {
		var thermo = document.getElementById('thermo');
		if (thermo !== null && !thermo.classList.contains('thermo_iotStyleContainer')) {
			// HIDING ELEMENTS
			var tempImpDiv = document.getElementById('temp_imp_div');
			if (tempImpDiv !== null) {
				tempImpDiv.style.display = 'none';
			}
			var fanDiv = document.getElementById('fan_div');
			if (fanDiv !== null) {
				fanDiv.style.display = 'none';
			}
			var season = document.getElementById('season_' + device.id);
			if (season !== null) {
				season.style.display = 'none';
			}
			var mode = document.getElementById('mode_' + device.id);
			if (mode !== null) {
				mode.style.display = 'none';
			}
			var iconeSplitDiv = document.getElementById('icone_split_div');
			if (iconeSplitDiv !== null) {
				iconeSplitDiv.style.display = 'none';
			}
			var iconeDiv = document.getElementById('icone_div');
			if (iconeDiv !== null) {
				iconeDiv.style.display = 'none';
			}
			// CHANGING BTNONOFF
			var btnOnOff = document.getElementById('btnOnOff_' + device.id);
			if (btnOnOff !== null) {
				btnOnOff.className = '';
				btnOnOff.classList.add('btnOnOff_' + device.localOFF);
			}
			// SHOWING ELEMENTS
			var offDivSpan = document.querySelector('#off_div span');
			if (offDivSpan !== null) {
				offDivSpan.innerHTML = 'OFF';
			}
			var offDiv = document.getElementById('off_div');
			if (offDiv !== null) {
				offDiv.style.display = 'block';
			}
			// DIFFERENCES BETWEEN NEW AND OLD THERMOSTATS
			var modeDiv = document.getElementById('mode_div');
			if (modeDiv !== null) {
				if (device.name.substr(device.name.length - 1, 1) === '*') { // NEW
					modeDiv.style.width = '80px';
					// HUMIDITY PROBE
					if (typeof device.isHumidityProbe !== 'undefined' && device.isHumidityProbe === true) {
						var humidityContainer = document.getElementById('humidityContainer_' + device.id);
						if (humidityContainer !== null) {
							humidityContainer.style.display = 'none';
							var offDiv = document.getElementById('off_div');
							if (typeof offDiv !== 'undefined' && offDiv !== null) {
								offDiv.style.marginTop = '40px';
							}
							var humidityValue = document.getElementById('humidityValue_' + device.id);
							if (humidityValue !== null) {
								humidityValue.style.top = '25%';
							}
						}
					}
				} else { // OLD
					modeDiv.style.display = 'none';
				}
			}
		}
		// IOT STYLE
		if (thermo !== null && thermo.classList.contains('thermo_iotStyleContainer')) {
			var coloredCircle = document.getElementById('coloredCircle_' + device.id);
			if (coloredCircle !== null) {
				coloredCircle.style.background = 'conic-gradient(from 180deg, #000 11%, rgb(47, 47, 55) 11%, rgb(47, 47, 55) 89%, #000 89%)';
				if (!coloredCircle.classList.contains('disabledCircle')) {
					coloredCircle.classList.add('disabledCircle');
				}
			}
			var firstRow = document.getElementById('firstRow_' + device.id);
			if (firstRow !== null) {
				firstRow.style.visibility = 'hidden';
			}
			var secondRow = document.getElementById('secondRow_' + device.id);
			if (secondRow !== null) {
				secondRow.style.visibility = 'hidden';
			}
			var thirdRow = document.getElementById('thirdRow_' + device.id);
			if (thirdRow !== null) {
				thirdRow.style.visibility = 'hidden';
			}
			var fourthRow = document.getElementById('fourthRow_' + device.id);
			if (fourthRow !== null) {
				fourthRow.style.visibility = 'hidden';
			}
			var changeSeasonCommand = document.getElementById('changeSeasonCommand_' + device.id);
			if (changeSeasonCommand !== null) {
				if (!changeSeasonCommand.classList.contains('powerBlocked')) {
					changeSeasonCommand.classList.add('powerBlocked');
				}
			}
			var changeModeCommand = document.getElementById('changeModeCommand_' + device.id);
			if (changeModeCommand !== null) {
				if (!changeModeCommand.classList.contains('powerBlocked')) {
					changeModeCommand.classList.add('powerBlocked');
				}
			}
			var changeKeyboardLockCommand = document.getElementById('changeKeyboardLockCommand_' + device.id);
			if (changeKeyboardLockCommand !== null) {
				if (!changeKeyboardLockCommand.classList.contains('powerBlocked')) {
					changeKeyboardLockCommand.classList.add('powerBlocked');
				}
			}
		}
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Modifies HTML in order to show the proper content when the thermostat is ON
 * @param {object} device 			 - Object containing all the informations about the selected device
 * @param {boolean} isMapCommand - Is it fired by a mapCommand?
 * @version VER217D - WANDA
 */
function WEBAPP_switchingONThermostatHTML(device, isMapCommand)
{
  if (typeof device.id !== 'undefined' && typeof device.localOFF !== 'undefined' && typeof device.name !== 'undefined' && typeof device.season !== 'undefined' && typeof device.fanLevel !== 'undefined' && typeof device.windowVisibility !== 'undefined') {
    var thermo = document.getElementById('thermo');
		if (thermo !== null && !thermo.classList.contains('thermo_iotStyleContainer')) {
			// SHOWING ELEMENTS
			var thermoAllDivs = document.querySelectorAll('#thermo > div');
			if (thermoAllDivs !== null) {
				for (var i = 0; i < thermoAllDivs.length; i++) {
					thermoAllDivs[i].style.display = 'block';
				}
			}
			var season = document.getElementById('season_' + device.id);
			if (season !== null) {
				season.style.display = 'inline-block';
			}
			var mode = document.getElementById('mode_' + device.id);
			if (mode !== null) {
				mode.style.display = 'inline-block';
			}
			// CHANGING BTNONOFF
			var btnOnOff = document.getElementById('btnOnOff_' + device.id);
			if (btnOnOff !== null) {
				btnOnOff.className = '';
				btnOnOff.classList.add('btnOnOff_' + device.localOFF);
			}
			// HIDING ELEMENTS
			var offDiv = document.getElementById('off_div');
			if (offDiv !== null) {
				offDiv.style.display = 'none';
			}
			// DIFFERENCES BETWEEN NEW AND OLD THERMOSTATS
			var modeDiv = document.getElementById('mode_div');
			if (modeDiv !== null) {
				if (device.name.substr(device.name.length - 1, 1) === '*') { // NEW
					modeDiv.style.width = '240px';
					// WINDOW ICON
					if (device.windowVisibility === 0) {
						var btnStatoFinestra = document.getElementById('btnStatoFinestra_' + device.id);
						if (btnStatoFinestra !== null) {
							btnStatoFinestra.style.display = 'none';
						}
					}
					// HUMIDITY PROBE
					if (typeof device.isHumidityProbe !== 'undefined' && device.isHumidityProbe === true) {
						var btnBloccoTastiera = document.getElementById('btnBloccoTastiera_' + device.id);
						if (btnBloccoTastiera !== null) {
							btnBloccoTastiera.style.display = 'none';
						}
						var humidityContainer = document.getElementById('humidityContainer_' + device.id);
						if (humidityContainer !== null) {
							humidityContainer.style.display = 'block';
						}
						var humidityValue = document.getElementById('humidityValue_' + device.id);
						if (humidityValue !== null) {
							humidityValue.style.top = '13%';
						}
						var tempRilDiv = document.getElementById('temp_ril_div');
						if (tempRilDiv !== null) {
							tempRilDiv.style.marginTop = '15px';
							tempRilDiv.style.marginBottom = '0';
						}
						var tempImpDiv = document.getElementById('temp_imp_div');
						if (tempImpDiv !== null) {
							tempImpDiv.style.marginTop = '20px';
						}
						var fanDiv = document.getElementById('fan_div');
						if (fanDiv !== null) {
							fanDiv.style.margin = '14px auto';
						}
						var mapViewIconeDiv = document.querySelector('.mapview #thermo #icone_div');
						if (mapViewIconeDiv !== null) {
							mapViewIconeDiv.style.top = '300px';
						}
						/* VER217D WANDA */
						var mapViewIconeSplitDiv = document.querySelector('#thermo #icone_split_div');
						if (mapViewIconeSplitDiv !== null) {
							mapViewIconeSplitDiv.style.top = '276px';
						}
						/* ------------ */
						var mapViewIconeSplitDiv = document.querySelector('.mapview #thermo #icone_split_div');
						if (mapViewIconeSplitDiv !== null) {
							mapViewIconeSplitDiv.style.top = '300px';
						}
						if (typeof device.humidityEnabled !== 'undefined' && device.humidityEnabled === 1 && device.season === 0) { // ENABLED and SUMMER
							setTimeout(function() { WEBAPP_enableHumidityProbe(device.id); }, 100);
						} else {
							WEBAPP_disableHumidityProbe(device.id);
						}
					}
					// SPLIT
					if (isMapCommand === null || isMapCommand === true) {
						WEBAPP_updateSplit(device.season, device.fanLevel, device);
					}
				} else { // OLD
					modeDiv.style.width = '160px';
					// HIDING ELEMENTS
					var btnBloccoTastiera = document.getElementById('btnBloccoTastiera_' + device.id);
					if (btnBloccoTastiera !== null) {
						btnBloccoTastiera.style.display = 'none';
					}
					var btnStatoFinestra = document.getElementById('btnStatoFinestra_' + device.id);
					if (btnStatoFinestra !== null) {
						btnStatoFinestra.style.display = 'none';
					}
					var btnOnOff = document.getElementById('btnOnOff_' + device.id);
					if (btnOnOff !== null) {
						btnOnOff.style.display = 'none';
					}
				}
			}
		}
		// IOT STYLE
		if (thermo !== null && thermo.classList.contains('thermo_iotStyleContainer')) {
			var coloredCircle = document.getElementById('coloredCircle_' + device.id);
			if (coloredCircle !== null) {
				coloredCircle.style.background = 'conic-gradient(from 180deg, #000 11%, blue 11%, green 30%, yellow 50%, red 89%, #000 89%)';
				if (coloredCircle.classList.contains('disabledCircle')) {
					coloredCircle.classList.remove('disabledCircle');
				}
			}
			var firstRow = document.getElementById('firstRow_' + device.id);
			if (firstRow !== null) {
				firstRow.style.visibility = 'visible';
			}
			var secondRow = document.getElementById('secondRow_' + device.id);
			if (secondRow !== null) {
				secondRow.style.visibility = 'visible';
			}
			var thirdRow = document.getElementById('thirdRow_' + device.id);
			if (thirdRow !== null) {
				thirdRow.style.visibility = 'visible';
			}
			var fourthRow = document.getElementById('fourthRow_' + device.id);
			if (fourthRow !== null) {
				fourthRow.style.visibility = 'visible';
			}
			var changeSeasonCommand = document.getElementById('changeSeasonCommand_' + device.id);
			if (changeSeasonCommand !== null) {
				if (changeSeasonCommand.classList.contains('powerBlocked')) {
					changeSeasonCommand.classList.remove('powerBlocked');
				}
			}
			var changeModeCommand = document.getElementById('changeModeCommand_' + device.id);
			if (changeModeCommand !== null) {
				if (changeModeCommand.classList.contains('powerBlocked')) {
					changeModeCommand.classList.remove('powerBlocked');
				}
			}
			var changeKeyboardLockCommand = document.getElementById('changeKeyboardLockCommand_' + device.id);
			if (changeKeyboardLockCommand !== null) {
				if (changeKeyboardLockCommand.classList.contains('powerBlocked')) {
					changeKeyboardLockCommand.classList.remove('powerBlocked');
				}
			}
			WEBAPP_moveRadiusBasedOnSetPoint(parseInt(device.id), parseFloat(device.setPoint) * 10);
		}
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates the split icon based on season and fanLevel
 * @param {number} season - The new season value
 * @param {number} fan 		- The new fan value
 * @param {object} device - Object containing all the informations about the selected device
 * @version VER217D - WANDA
 */
function WEBAPP_updateSplit(season, fan, device)
{
	var iconeSplitDiv = document.getElementById('icone_split_div');
	var iconeSplitDivAnchorElement = document.querySelector('#icone_split_div a');
	if (iconeSplitDiv !== null && iconeSplitDivAnchorElement !== null) {
		if (typeof device.localOFF !== 'undefined' && parseInt(device.localOFF) === 0 && (parseInt(iconeSplitDivAnchorElement.getAttribute('rel')) === 2) || parseInt(iconeSplitDivAnchorElement.getAttribute('rel')) === parseInt(season)) {
			iconeSplitDivAnchorElement.className = '';
			if (parseInt(fan) === 0 || parseInt(fan) === 128) {
				iconeSplitDivAnchorElement.classList.add('stagionesplit_off');
			} else {
				if (parseInt(season) === 0) {
					iconeSplitDivAnchorElement.classList.add('stagionesplit_on_estate');
				} else {
					iconeSplitDivAnchorElement.classList.add('stagionesplit_on_inverno');
				}
			}
			iconeSplitDiv.style.display = 'block';
		} else {
			iconeSplitDiv.style.display = 'none';
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Disables the humidity probe
 * @param {string} id - ID of the device to be updated
 * @version VER197 - WANDA
 */
function WEBAPP_disableHumidityProbe(id)
{
	var humidityBar = document.getElementById('humidityBar_' + id);
	if (humidityBar !== null) {
		humidityBar.style.width = '0';
	}
	var humidityContainer = document.getElementById('humidityContainer_' + id);
	if (humidityContainer !== null) {
		humidityContainer.style.webkitFilter = 'grayscale(1) opacity(0.3)';
		humidityContainer.style.filter = 'grayscale(1) opacity(0.3)';
	}
	var humidityMore = document.getElementById('humidityMore_' + id);
	if (humidityMore !== null) {
		humidityMore.style.cursor = 'default';
		humidityMore.removeEventListener('click', WEBAPP_getOverHTML);
	}
	var scaleLContainer = document.getElementById('scaleLContainer_' + id);
	if (scaleLContainer !== null) {
		scaleLContainer.style.display = 'none';
	}
	var scaleMContainer = document.getElementById('scaleMContainer_' + id);
	if (scaleMContainer !== null) {
		scaleMContainer.style.display = 'none';
	}
	var scaleHContainer = document.getElementById('scaleHContainer_' + id);
	if (scaleHContainer !== null) {
		scaleHContainer.style.display = 'none';
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Enables the humidity probe
 * @param {string} id - ID of the device to be updated
 * @version VER197 - WANDA
 */
function WEBAPP_enableHumidityProbe(id)
{
  var device = WEBAPP_getDevice(id);
  if (device !== false) {
		var humidityContainer = document.getElementById('humidityContainer_' + id);
		if (humidityContainer !== null) {
			humidityContainer.style.webkitFilter = 'none';
			humidityContainer.style.filter = 'none';
		}
		var humidityMore = document.getElementById('humidityMore_' + id);
		if (humidityMore !== null) {
			humidityMore.style.cursor = 'pointer';
			humidityMore.addEventListener('click', function () { WEBAPP_getOverHTML('webapps/webapp_legacy/humidityProbe.htm', device.name, 'close'); }); // VER218C WANDA
		}
		// SEMAPHORES
		var humidityStatusDehumificator = document.getElementById('humidityStatusDehumificator_' + id);
		if (humidityStatusDehumificator !== null) {
			if (device.humidityStatusDehumificator === 1) {
				humidityStatusDehumificator.style.backgroundColor = '#03ff00';
			} else {
				humidityStatusDehumificator.style.backgroundColor = '#7f7f7f';
			}
		}
		var humidityStatusValve = document.getElementById('humidityStatusValve_' + id);
		if (humidityStatusValve !== null) {
			if (device.humidityStatusValve === 1) {
				humidityStatusValve.style.backgroundColor = '#ffff00';
			} else {
				humidityStatusValve.style.backgroundColor = '#7f7f7f';
			}
		}
    var humidityStatusGeneralPump = document.getElementById('humidityStatusGeneralPump_' + id);
		if (humidityStatusGeneralPump !== null) {
			if (device.humidityStatusGeneralPump === 1) {
				humidityStatusGeneralPump.style.backgroundColor = '#ff0000';
			} else {
				humidityStatusGeneralPump.style.backgroundColor = '#7f7f7f';
			}
		}
		// BAR
		var humidityBarBackground = document.getElementById('humidityBarBackground_' + id);
		if (humidityBarBackground !== null) {
			var humidityBarBackgroundWidth = (humidityBarBackground.clientWidth / humidityBarBackground.parentElement.clientWidth) * 100;
			var humidityBarWidth = (humidityBarBackgroundWidth * device.humidityValue) / 100;
			var humidityBar = document.getElementById('humidityBar_' + id);
			if (humidityBar !== null) {
				humidityBar.style.width = humidityBarWidth + '%';
				humidityBar.style.maxWidth = humidityBarBackgroundWidth + '%';
			}
		}
		var scaleLContainer = document.getElementById('scaleLContainer_' + id);
		if (scaleLContainer !== null) {
			scaleLContainer.style.left = 'calc(' + device.humidityThresholdL + '% - 1.5px)';
			scaleLContainer.style.display = 'block';
		}
    var scaleMContainer = document.getElementById('scaleMContainer_' + id);
		if (scaleMContainer !== null) {
			scaleMContainer.style.left = 'calc(' + device.humidityThresholdM + '% - 1.5px)';
			scaleMContainer.style.display = 'block';
		}
    var scaleHContainer = document.getElementById('scaleHContainer_' + id);
		if (scaleHContainer !== null) {
			scaleHContainer.style.left = 'calc(' + device.humidityThresholdH + '% - 1.5px)';
			scaleHContainer.style.display = 'block';
		}
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Adds event listeners to DOM elements
 * @param {string} deviceID - The ID of the current device
 * @version VER203 - WANDA
 */
function WEBAPP_addThermostatHTMLButtonsEventHandlers(deviceID)
{
  // CMD_MINUS
  var cmdMinus = document.getElementById('cmd_minus');
  if (cmdMinus !== null) {
    cmdMinus.addEventListener('contextmenu', function (event) { event.preventDefault(); return false; });
    cmdMinus.addEventListener('mousedown', function (event) { WEBAPP_cmdMinusOnMouseDown(event, deviceID); });
    cmdMinus.addEventListener('mouseup', function () { WEBAPP_cmdMinusOnMouseUp(deviceID); });
    cmdMinus.addEventListener('mouseout', function () { WEBAPP_cmdMinusOnMouseUp(deviceID); });
    // To be able to use long press on mobile
    cmdMinus.addEventListener('touchstart', function (event) { WEBAPP_cmdMinusOnTouchStart(event, deviceID); });
    cmdMinus.addEventListener('touchend', function () { WEBAPP_cmdMinusOnMouseUp(deviceID); });
    cmdMinus.addEventListener('touchmove', function (event) { WEBAPP_cmdMinusOnTouchMove(event, deviceID); }); // User finger moves away from the minus button (but is still touching the screen)
		if (WEBAPP_pollingPause > 0) {
    	cmdMinus.addEventListener('drag', function () { WEBAPP_cmdMinusOnMouseUp(deviceID); });
		}
  }
  // CMD_PLUS
  var cmdPlus = document.getElementById('cmd_plus');
  if (cmdPlus !== null) {
    cmdPlus.addEventListener('contextmenu', function (event) { event.preventDefault(); return false; });
    cmdPlus.addEventListener('mousedown', function (event) { WEBAPP_cmdPlusOnMouseDown(event, deviceID); });
    cmdPlus.addEventListener('mouseup', function () { WEBAPP_cmdPlusOnMouseUp(deviceID); });
    cmdPlus.addEventListener('mouseout', function () { WEBAPP_cmdPlusOnMouseUp(deviceID); });
    // To be able to use long press on mobile
    cmdPlus.addEventListener('touchstart', function (event) { WEBAPP_cmdPlusOnTouchStart(event, deviceID); });
    cmdPlus.addEventListener('touchend', function () { WEBAPP_cmdPlusOnMouseUp(deviceID); });
    cmdPlus.addEventListener('touchmove', function (event) { WEBAPP_cmdPlusOnTouchMove(event, deviceID); }); // User finger moves away from the plud button (but is still touching the screen)
		if (WEBAPP_pollingPause > 0) {
    	cmdPlus.addEventListener('drag', function () { WEBAPP_cmdPlusOnMouseUp(deviceID); });
		}
  }
	// IOT STYLE
	var coloredCircle = document.getElementById('coloredCircle_' + deviceID);
	if (coloredCircle !== null) {
		coloredCircle.addEventListener('pointerdown', function (event) { WEBAPP_manageOnPointerDownColoredCircle(event, deviceID); });
		coloredCircle.addEventListener('pointerup', function (event) { WEBAPP_manageOnPointerUpColoredCircle(event, deviceID); });
		coloredCircle.addEventListener('pointermove', function (event) { WEBAPP_manageOnPointerMoveColoredCircle(event, deviceID); });
	}
	var minusCommand = document.getElementById('minusCommand_' + deviceID);
	if (minusCommand !== null) {
		minusCommand.addEventListener('contextmenu', function (event) { event.preventDefault(); return false; });
		minusCommand.addEventListener('pointerdown', function (event) { WEBAPP_cmdMinusOnMouseDown(event, deviceID); });
		minusCommand.addEventListener('pointerup', function () { WEBAPP_cmdMinusOnMouseUp(deviceID); });
		minusCommand.addEventListener('pointerleave', function () { WEBAPP_cmdMinusOnMouseUp(deviceID); });
		minusCommand.addEventListener('pointercancel', function () { WEBAPP_cmdMinusOnMouseUp(deviceID); });
	}
	var plusCommand = document.getElementById('plusCommand_' + deviceID);
	if (plusCommand !== null) {
		plusCommand.addEventListener('contextmenu', function (event) { event.preventDefault(); return false; });
		plusCommand.addEventListener('pointerdown', function (event) { WEBAPP_cmdPlusOnMouseDown(event, deviceID); });
		plusCommand.addEventListener('pointerup', function () { WEBAPP_cmdPlusOnMouseUp(deviceID); });
		plusCommand.addEventListener('pointerleave', function () { WEBAPP_cmdPlusOnMouseUp(deviceID); });
		plusCommand.addEventListener('pointercancel', function () { WEBAPP_cmdPlusOnMouseUp(deviceID); });
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Retrieves the value of the setpoint from the HTML
 * @returns setPointRetrievedFromHTML
 * @version VER196 - WANDA
 */
function WEBAPP_retrieveSetPointFromHTML()
{
	var setPointRetrievedFromHTML = null;
	var tempImpSpan = document.querySelector('#temp_imp span');
  if (tempImpSpan !== null) {
    setPointRetrievedFromHTML = parseFloat(tempImpSpan.innerHTML.split('&')[0]) * 10;
  }
	// IOT STYLE
	var setPointTemperature = document.querySelector('.setPointTemperature');
	if (setPointTemperature !== null) {
		setPointRetrievedFromHTML = parseFloat(setPointTemperature.innerHTML.split('&')[0]) * 10;
	}
	return setPointRetrievedFromHTML;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Adds or remove "edit" from the setpoint element
 * @param {string} action - 'START' if the setpoint is being modified (is yellow), 'END' if the setpoint has been modified
 * @version VER227 - WANDA
 */
function WEBAPP_setPointIsBeingModified(action)
{
	var tempImpSpan = document.querySelector('#temp_imp span');
	var setPointTemperature = document.querySelector('.setPointTemperature');
	if (action === 'START') {
		if (tempImpSpan !== null) {
			if (tempImpSpan.getAttribute('id') === null) {
				tempImpSpan.setAttribute('id', 'edit');
			}
		}
		// IOT STYLE
		if (setPointTemperature !== null) {
			if (!setPointTemperature.classList.contains('edit')) {
				setPointTemperature.classList.add('edit');
			}
		}
	} else if (action === 'END') {
		if (tempImpSpan !== null) {
			if (tempImpSpan.getAttribute('id') !== null) {
				tempImpSpan.removeAttribute('id');
			}
		}
		// IOT STYLE
		if (setPointTemperature !== null) {
			if (setPointTemperature.classList.contains('edit')) {
				setPointTemperature.classList.remove('edit');
			}
		}
		WEBAPP_pollingPause = 0;
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Actions to perform when the colored circle is pressed down
 * @param {object} event 		- The current event
 * @param {number} deviceID - The ID of the current device
 * @version VER205B - WANDA
 */
function WEBAPP_manageOnPointerDownColoredCircle(event, deviceID)
{
	clearTimeout(THERMO_calculateNewSetPointTimeout);
  clearTimeout(THERMO_sendNewSetPointTimeout);
	var device = WEBAPP_getDevice(deviceID);
	if (device !== false) {
		if (typeof device.localOFF !== 'undefined' && parseInt(device.localOFF) === 0) {
			THERMO_canDragRadius = true;
			var radius = document.getElementById('radius_' + deviceID);
			if (radius !== null) {
				radius.style.transition = '0s';
			}
			var coloredCircle = document.getElementById('coloredCircle_' + deviceID);
			if (coloredCircle !== null) {
				coloredCircle.setPointerCapture(event.pointerId);
			}
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Actions to perform when the colored circle is not pressed down anymore
 * @param {object} event 		- The current event
 * @param {number} deviceID - The ID of the current device
 * @version VER238 - WANDA
 */
function WEBAPP_manageOnPointerUpColoredCircle(event, deviceID)
{
	if (THERMO_canDragRadius === true) {
		var radius = document.getElementById('radius_' + deviceID);
		if (radius !== null) {
			radius.style.transition = '1s';
		}
		var coloredCircle = document.getElementById('coloredCircle_' + deviceID);
		if (coloredCircle !== null) {
			coloredCircle.releasePointerCapture(event.pointerId);
		}
		var setPointToSend = THERMO_draggedSetPoint;
		if (THERMO_isDragged === false) {
			setPointToSend = WEBAPP_calculateNewColoredCircleSetPoint(event);
			WEBAPP_moveRadiusBasedOnSetPoint(parseInt(deviceID), parseInt(setPointToSend));
		}
		THERMO_sendNewSetPoint(deviceID, setPointToSend);
		THERMO_storedSetPointValue = setPointToSend; // VER238 WANDA
		THERMO_canDragRadius = false;
		THERMO_isDragged = false;
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Actions to perform when the pointer is moved across the colored circle
 * @param {object} event 		- The current event
 * @param {number} deviceID - The ID of the current device
 * @version VER203 - WANDA
 */
function WEBAPP_manageOnPointerMoveColoredCircle(event, deviceID)
{
  var coloredCircle = document.getElementById('coloredCircle_' + deviceID);
  if (coloredCircle !== null && THERMO_canDragRadius === true) {
    THERMO_isDragged = true;
    THERMO_draggedSetPoint = WEBAPP_calculateNewColoredCircleSetPoint(event);
    WEBAPP_moveRadiusBasedOnSetPoint(parseInt(deviceID), parseInt(THERMO_draggedSetPoint));
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Calculates the new setPoint when the colored circle is pressed
 * @param {object} event - The current event
 * @returns the new setPoint
 * @version VER276 - WANDA
 */
function WEBAPP_calculateNewColoredCircleSetPoint(event)
{
  // Colored circle coordinates
  var coloredCircleRect = event.target.getBoundingClientRect();
  var centerX = ((coloredCircleRect.left + (coloredCircleRect.width / 2))) / (DISPLAY_pageZoom / 100); // VER276 WANDA
  var centerY = ((coloredCircleRect.top + (coloredCircleRect.height / 2))) / (DISPLAY_pageZoom / 100); // VER276 WANDA
  // Pointer position coordinates
  var x = (event.clientX / (DISPLAY_pageZoom / 100)) - centerX;
  var y = ((event.clientY / (DISPLAY_pageZoom / 100)) - centerY) * -1;
  var newAngle = (Math.atan2(x, y) * 180 / Math.PI) - 90;
  var newSetPoint = null;
  if (newAngle < -225) {
    newSetPoint = 50;
  } else if (newAngle > 45) {
    newSetPoint = 350;
  } else {
    newSetPoint = parseInt(((newAngle + 270) / 9) * 10);
  }
  return newSetPoint;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Moves the radius element accordingly to the current setPoint
 * @param {number} deviceID - The ID of the current device
 * @param {number} setPoint - The current setPoint
 * @version VER203 - WANDA
 */
function WEBAPP_moveRadiusBasedOnSetPoint(deviceID, setPoint)
{
  var thermostatSetPoint = document.getElementById('setPointTemperature_' + deviceID);
	if (thermostatSetPoint !== null) {
		thermostatSetPoint.innerHTML = (setPoint / 10).toFixed(1) + '&nbsp;&deg;C';
	}
	var radius = document.getElementById('radius_' + deviceID);
	if (radius !== null) {
    if ((setPoint / 10) >= 5 && (setPoint / 10) <= 35) {
      var deg = (Math.trunc(setPoint / 10) * 9) + ((setPoint % 10) * 0.9);
      var rotationValue = -270 + deg;
      radius.style.transform = 'rotate(' + rotationValue + 'deg)';
    } else if ((setPoint / 10) < 5) {
      radius.style.transform = 'rotate(-270deg)';
    } else if ((setPoint / 10) > 35) {
      radius.style.transform = 'rotate(45deg)';
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Actions to perform when the change season button is pressed
 * @param {string} deviceID - The ID of the current device
 * @version VER227 - WANDA
 */
function WEBAPP_clickOnChangeSeason(deviceID)
{
  var device = WEBAPP_getDevice(deviceID);
  if (device !== false) {
    var canUpdate = false;
    if (typeof device.localOFF !== 'undefined' && parseInt(device.localOFF) !== 1) {
			canUpdate = true;
			var tempImpEdit = document.querySelector('#temp_imp #edit');
			var setPointTemperatureEdit = document.querySelector('.setPointTemperature.edit');
			if (tempImpEdit !== null || setPointTemperatureEdit !== null) {
				canUpdate = false;
			}
    }
    if (canUpdate === true) {
      WEBAPP_actualDevice = deviceID;
      WEBAPP_getOverHTML('webapps/webapp_legacy/settings_updateseason.htm', lblThermostatChangeSeasonTit, 'close'); // VER218C WANDA
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Actions to perform when the change mode button is pressed
 * @param {string} deviceID - The ID of the current device
 * @version VER227 - WANDA
 */
function WEBAPP_clickOnChangeMode(deviceID)
{
  var device = WEBAPP_getDevice(deviceID);
  if (device !== false) {
    var canUpdate = false;
    if (typeof device.localOFF !== 'undefined' && parseInt(device.localOFF) !== 1) {
			canUpdate = true;
			var tempImpEdit = document.querySelector('#temp_imp #edit');
			var setPointTemperatureEdit = document.querySelector('.setPointTemperature.edit');
			if (tempImpEdit !== null || setPointTemperatureEdit !== null) {
				canUpdate = false;
			}
    }
    if (canUpdate === true && parseInt(deviceID) !== 9999) {
      WEBAPP_pollingPause = 0;
      var mode = 1;
      if (typeof device.season !== 'undefined' && typeof device.mode !== 'undefined') {
        if (parseInt(device.mode) === 1) {
          mode = 0;
        }
        if (DOMINAPLUS_MANAGER_webSocketAvailable) {
          DOMINAPLUS_MANAGER_sendWSCommand('STS', deviceID.toString(), [device.season + ',' + mode + ',' + THERMO_storedSetPointValue]);
        }
      }
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Actions to perform when the power button is pressed
 * @param {string} deviceID - The ID of the current device
 * @version VER227 - WANDA
 */
function WEBAPP_clickOnChangeLocalOFF(deviceID)
{
	var canUpdate = true;
	var tempImpEdit = document.querySelector('#temp_imp #edit');
	var setPointTemperatureEdit = document.querySelector('.setPointTemperature.edit');
  if (tempImpEdit !== null || setPointTemperatureEdit !== null) {
    canUpdate = false;
  }
  if (canUpdate === true) {
    WEBAPP_pollingPause = 0;
    var device = WEBAPP_getDevice(deviceID);
    if (device !== false && typeof device.localOFF !== 'undefined') {
			if ((typeof device.name !== 'undefined' && device.name.substr(0, 9) === 'TS1Server') || (typeof device.TS01 !== 'undefined' && device.TS01 === true)) {
				DOMINAPLUS_MANAGER_sendWSCommand('TUU', deviceID + ',' + device.localOFF);
			} else {
				DOMINAPLUS_MANAGER_sendWSCommand('TOO', deviceID + ',' + device.localOFF);
			}
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Actions to perform when the keyboardLock is clicked
 * @param {string} deviceID - The ID of the current device
 * @version VER227 - WANDA
 */
function WEBAPP_clickOnChangeKeyboardLock(deviceID)
{
  var device = WEBAPP_getDevice(deviceID);
  if (device !== false) {
    var canUpdate = false;
    if (typeof device.localOFF !== 'undefined' && parseInt(device.localOFF) !== 1) {
			canUpdate = true;
			var tempImpEdit = document.querySelector('#temp_imp #edit');
			var setPointTemperatureEdit = document.querySelector('.setPointTemperature.edit');
  		if (tempImpEdit !== null || setPointTemperatureEdit !== null) {
    		canUpdate = false;
  		}
    }
    if (canUpdate === true) {
      DOMINAPLUS_MANAGER_sendWSCommand('TTK', deviceID);
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Actions to perform when the editChrono button is clicked
 * @param {string} title 		- The editChrono title
 * @param {number} deviceID - The ID of the current device
 * @version VER227 - WANDA
 */
function WEBAPP_clickOnEditChrono(title, deviceID)
{
  if (parseInt(deviceID) !== 9999) {
    WEBAPP_actualDevice = deviceID;
    WEBAPP_getOverHTML('webapps/webapp_legacy/settings_chronotherm.htm', title, 'close'); // VER218C WANDA
    window.isOnThermoAdvancedPage = true;
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Actions to perform when the minus button is pressed down
 * @param {object} event 		- The current event
 * @param {string} deviceID - The ID of the current device
 * @version VER227 - WANDA
 */
function WEBAPP_cmdMinusOnMouseDown(event, deviceID)
{
  if (parseInt(event.which) === 1) {
    WEBAPP_cmdMinusOrcmdPlusIsPressedDown(deviceID, 0);
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Actions to perform when the minus button is not longer pressed down anymore
 * @param {string} deviceID - The ID of the current device
 * @version VER227 - WANDA
 */
function WEBAPP_cmdMinusOnMouseUp(deviceID)
{
  if (THERMO_commandToChangeSetPointHasBeenPressed === true) { // FIX 57
    WEBAPP_cmdMinusOrcmdPlusIsReleased(deviceID);
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Actions to perform when the minus button is pressed down in touchscreens
 * @param {object} event 		- The current event
 * @param {string} deviceID - The ID of the current device
 * @version VER227 - WANDA
 */
function WEBAPP_cmdMinusOnTouchStart(event, deviceID)
{
  event.preventDefault();
  THERMO_touchedElement = document.elementFromPoint(event.touches[0].pageX, event.touches[0].pageY);
  WEBAPP_cmdMinusOrcmdPlusIsPressedDown(deviceID, 0);
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Actions to perform when the user finger moves away from the minus button but is still touching the screen
 * @param {object} event 		- The current event
 * @param {string} deviceID - The ID of the current device
 * @version VER227 - WANDA
 */
function WEBAPP_cmdMinusOnTouchMove(event, deviceID)
{
  event.preventDefault();
  if (THERMO_touchedElement !== document.elementFromPoint(event.touches[0].pageX, event.touches[0].pageY)) {
    WEBAPP_cmdMinusOnMouseUp(deviceID);
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Actions to perform when the plus button is pressed down
 * @param {object} event 		- The current event
 * @param {string} deviceID - The ID of the current device
 * @version VER227 - WANDA
 */
function WEBAPP_cmdPlusOnMouseDown(event, deviceID)
{
  if (parseInt(event.which) === 1) {
    WEBAPP_cmdMinusOrcmdPlusIsPressedDown(deviceID, 1);
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Actions to perform when the plus button is not longer pressed down anymore
 * @param {string} deviceID - The ID of the current device
 * @version VER227 - WANDA
 */
function WEBAPP_cmdPlusOnMouseUp(deviceID)
{
  if (THERMO_commandToChangeSetPointHasBeenPressed === true) { // FIX 57
    WEBAPP_cmdMinusOrcmdPlusIsReleased(deviceID);
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Actions to perform when the plus button is pressed down in touchscreens
 * @param {object} event 		- The current event
 * @param {string} deviceID - The ID of the current device
 * @version VER227 - WANDA
 */
function WEBAPP_cmdPlusOnTouchStart(event, deviceID)
{
  event.preventDefault();
  THERMO_touchedElement = document.elementFromPoint(event.touches[0].pageX, event.touches[0].pageY);
  WEBAPP_cmdMinusOrcmdPlusIsPressedDown(deviceID, 1);
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Actions to perform when the user finger moves away from the plus button but is still touching the screen
 * @param {object} event 		- The current event
 * @param {string} deviceID - The ID of the current device
 * @version VER227 - WANDA
 */
function WEBAPP_cmdPlusOnTouchMove(event, deviceID)
{
  event.preventDefault();
  if (THERMO_touchedElement !== document.elementFromPoint(event.touches[0].pageX, event.touches[0].pageY)) {
    WEBAPP_cmdPlusOnMouseUp(deviceID);
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Actions to perform when cmd_minus or cmd_plus is pressed down
 * @param {string} deviceID - The ID of the current device
 * @param {number} step 		- 0 for cmd_minus and 1 for cmd_plus
 * @version VER227 - WANDA
 */
function WEBAPP_cmdMinusOrcmdPlusIsPressedDown(deviceID, step)
{
  THERMO_commandToChangeSetPointHasBeenPressed = true;
  THERMO_commandToChangeSetPointCounter = 0;
	var offset = 0;
  var device = WEBAPP_getDevice(deviceID);
  if (device !== false) {
		if (typeof device.offSet !== 'undefined') {
			offset = parseInt(parseFloat(device.offSet) * 10);
		}
		var mode = THERMO_updateStructuresOnMinusAndPlusClick(device);
		WEBAPP_updateThermostatModeHTML(deviceID, mode);
  }
  WEBAPP_pollingPause = 60;
  var initialSetPointRetrievedFromHTML = WEBAPP_retrieveSetPointFromHTML();
  if (initialSetPointRetrievedFromHTML !== null) {
    THERMO_calculateNewSetPointOnMinusAndPlusClick(deviceID, initialSetPointRetrievedFromHTML, offset, step);
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Action to perform when cmd_minus or cmd_plus is not longer pressed down anymore
 * @param {string} deviceID - The ID of the current device
 * @version VER227 - WANDA
 */
function WEBAPP_cmdMinusOrcmdPlusIsReleased(deviceID)
{
  THERMO_commandToChangeSetPointHasBeenPressed = false;
  THERMO_commandToChangeSetPointCounter = 0;
  WEBAPP_pollingPause = 8;
  clearTimeout(THERMO_calculateNewSetPointTimeout);
  clearTimeout(THERMO_sendNewSetPointTimeout);
  var newSetPointRetrievedFromHTML = WEBAPP_retrieveSetPointFromHTML();
  if (newSetPointRetrievedFromHTML !== null) {
    THERMO_sendNewSetPointTimeout = setTimeout('THERMO_sendNewSetPoint(' + deviceID + ', ' + newSetPointRetrievedFromHTML + ');', THERMO_sendNewSetPointTimer);
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* -------------------------------------------------------------------- VMC DAIKIN MODBUS GUI ----------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Creates VMC Daikin Modbus HTML in box3
 * @param {object} device - Object containing all the informations about the selected device
 * @version VER197 - WANDA
 */
function WEBAPP_contentIsThermoVMCDaikinModbus(device)
{
	var htmlToAdd = '';
	var stage = document.getElementById('stage');
  var box3 = document.getElementById('box3');
  if (box3 !== null) {
    if (typeof device.id !== 'undefined' && typeof device.name !== 'undefined' && typeof device.type !== 'undefined') {
      htmlToAdd += '<h1>' + device.name + '</h1>';
			var classToAddTS01 = '';
      if (typeof device.TS01 !== 'undefined' && device.TS01 === true) {
        classToAddTS01 = 'class="isTS01"';
      }
      htmlToAdd += '<div ' + classToAddTS01 + ' id="thermo" rel="' + device.id + '" style="opacity: 0;"></div>';
			if (stage !== null && stage.classList.contains('mapview')) {
				htmlToAdd += '<a class="ico_50 ico_rotateleft" onclick="WEBAPP_rotateDeviceFamily(' + device.type + ', -1, \'isVMCDaikinModBus\');">';
				htmlToAdd += '<span class="px-icon icon-elegant-arrow-carrot-left"></span>';
				htmlToAdd += '</a>';
				htmlToAdd += '<a class="ico_50 ico_rotateright" onclick="WEBAPP_rotateDeviceFamily(' + device.type + ', 1, \'isVMCDaikinModBus\');">';
				htmlToAdd += '<span class="px-icon icon-elegant-arrow-carrot-right"></span>';
				htmlToAdd += '</a>';
			}
      box3.insertAdjacentHTML('beforeend', htmlToAdd);
      WEBAPP_getVMCDaikinModbus(device);
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Adds HTML to the VMC Daikin Modbus container
 * @param {object} device - Object containing all the informations about the selected device
 * @version VER196 - WANDA
 */
function WEBAPP_getVMCDaikinModbus(device)
{
  var id1 = '';
  var value1 = '- -';
  var label1 = '- -';
  var id2 = '';
  var value2 = '- -';
  var label2 = '- -';
	if (typeof device.id !== 'undefined') {
		if (typeof device.linkedid !== 'undefined' && typeof device.linkedid[0] !== 'undefined') {
			var abanoDevice = WEBAPP_getDevice(device.linkedid[0]);
			if (abanoDevice !== false) {
				if (typeof abanoDevice.id !== 'undefined' && typeof abanoDevice.ValoreConvertito !== 'undefined' && typeof abanoDevice.UnitaMisura !== 'undefined') {
					id1 = abanoDevice.id;
					value1 = abanoDevice.ValoreConvertito;
					label1 = abanoDevice.UnitaMisura;
				}
			}
			if (device.linkedid.length > 1) {
				if (typeof device.linkedid[1] !== 'undefined') {
					var abanoDevice = WEBAPP_getDevice(device.linkedid[1]);
					if (abanoDevice !== false) {
						if (typeof abanoDevice.id !== 'undefined' && typeof abanoDevice.ValoreConvertito !== 'undefined' && typeof abanoDevice.UnitaMisura !== 'undefined') {
							id2 = abanoDevice.id;
							value2 = abanoDevice.ValoreConvertito
							label2 = abanoDevice.UnitaMisura;
						}
					}
				}
			}
		}
		var htmlToAdd = '<div class="VMCDaikinModbus">';
		htmlToAdd += '<div class="VMCDaikinModbus_abanovalues">';
	
		htmlToAdd += '<div id="VMCDaikinModbus_AbanoValues1">';
		htmlToAdd += '<div class="VMCDaikinModbus_abano_value" data-abanoid="' + id1 + '">' + value1 + '</div>';
		htmlToAdd += '<div class="VMCDaikinModbus_abano_value_label">' + label1 + '</div>';
		htmlToAdd += '</div>';
	
		htmlToAdd += '<div id="VMCDaikinModbus_AbanoValues2">';
		htmlToAdd += '<div class="VMCDaikinModbus_abano_value" data-abanoid="' + id2 + '">' + value2 + '</div>';
		htmlToAdd += '<div class="VMCDaikinModbus_abano_value_label">' + label2 + '</div>';
		htmlToAdd += '</div></div>';
	
		htmlToAdd += '<div class="VMCDaikinModbus_abanobuttons">';
	
		htmlToAdd += '<div class="VMCDaikinModbus_speed">';
		htmlToAdd += '<div class="VMCDaikinModbus_speed1" data-speed="1" onclick="THERMO_DAIKIN_VMCDaikinModbusSendSpeed(' + device.id + ', event.currentTarget.getAttribute(\'data-speed\'))">';
		htmlToAdd += '<div class="ico"></div>';
		htmlToAdd += '</div>';
		htmlToAdd += '<div class="VMCDaikinModbus_speed2" data-speed="2" onclick="THERMO_DAIKIN_VMCDaikinModbusSendSpeed(' + device.id + ', event.currentTarget.getAttribute(\'data-speed\'))">';
		htmlToAdd += '<div class="ico"></div>';
		htmlToAdd += '</div>';
		htmlToAdd += '<div class="VMCDaikinModbus_speed3" data-speed="3" onclick="THERMO_DAIKIN_VMCDaikinModbusSendSpeed(' + device.id + ', event.currentTarget.getAttribute(\'data-speed\'))">';
		htmlToAdd += '<div class="ico"></div>';
		htmlToAdd += '</div></div>';
	
		htmlToAdd += '<div class="VMCDaikinModbus_command">';
		htmlToAdd += '<div class="VMCDaikinModbus_command1" data-cmd="1" onclick="THERMO_DAIKIN_VMCDaikinModbusSendCommand(' + device.id + ', event.currentTarget.getAttribute(\'data-cmd\'))">';
		htmlToAdd += '<div class="ico"></div>';
		htmlToAdd += '</div>';
		htmlToAdd += '<div class="VMCDaikinModbus_command2" data-cmd="2" onclick="THERMO_DAIKIN_VMCDaikinModbusSendCommand(' + device.id + ', event.currentTarget.getAttribute(\'data-cmd\'))">';
		htmlToAdd += '<div class="ico"></div>';
		htmlToAdd += '</div>';
		htmlToAdd += '<div class="VMCDaikinModbus_command3" data-cmd="3" onclick="THERMO_DAIKIN_VMCDaikinModbusSendCommand(' + device.id + ', event.currentTarget.getAttribute(\'data-cmd\'))">';
		htmlToAdd += '<div class="ico"></div>';
		htmlToAdd += '</div></div>';
	
		htmlToAdd += '<div class="VMCDaikinModbus_onoff">';
		htmlToAdd += '<div class="VMCDaikinModbus_btn btnOnOff_0" onclick="THERMO_DAIKIN_VMCDaikinModbusSendONOFF(' + device.id + ', parseInt(event.currentTarget.classList[1].split(\'_\')[1]))"></div>';
		htmlToAdd += '</div>';
	
		htmlToAdd += '</div></div>';
		var thermo = document.getElementById('thermo');
		if (thermo !== null) {
			thermo.innerHTML = htmlToAdd;
			thermo.style.opacity = '1';
			if (typeof device.isOn !== 'undefined') {
				WEBAPP_updateDaikinIsOnHTML(device.id, device.isOn);
			}
			if (typeof device.fanspeed !== 'undefined') {
				WEBAPP_updateDaikinFanSpeedHTML(device.id, device.fanspeed);
			}
			if (typeof device.mode !== 'undefined') {
				WEBAPP_updateDaikinModeHTML(device.id, device.mode);
			}
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates the HTML concerning the Daikin fanspeed
 * @param {string} id 			- The ID of the device to be updated
 * @param {string} fanSpeed - New fanspeed value
 * @version VER196 - WANDA
 */
function WEBAPP_updateDaikinFanSpeedHTML(id, fanSpeed)
{
  var thermo = document.getElementById('thermo');
  if (thermo !== null && parseInt(thermo.getAttribute('rel')) === parseInt(id)) {
    var VMCDaikinModbusSpeed = document.getElementsByClassName('VMCDaikinModbus_speed')[0];
		if (VMCDaikinModbusSpeed !== null) {
			if (!VMCDaikinModbusSpeed.classList.contains('disabled')) {
				var speedIcon = document.querySelectorAll('.VMCDaikinModbus_speed .ico');
				if (speedIcon !== null) {
					for (var i = 0; i < speedIcon.length; i++) {
						if (speedIcon[i].classList.contains('active')) {
							speedIcon[i].classList.remove('active');
						}
					}
				}
				var speedIconToUpdate = document.querySelector('.VMCDaikinModbus_speed' + fanSpeed + ' .ico');
				if (speedIconToUpdate !== null) {
					if (!speedIconToUpdate.classList.contains('active')) {
						speedIconToUpdate.classList.add('active');
					}
				}
			}
		}
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates the HTML concerning the Daikin isOn
 * @param {string} id 	- The ID of the device to be updated
 * @param {string} isOn - New isOn value
 * @version VER196 - WANDA
 */
function WEBAPP_updateDaikinIsOnHTML(id, isOn)
{
  var thermo = document.getElementById('thermo');
  if (thermo !== null && parseInt(thermo.getAttribute('rel')) === parseInt(id)) {
		// SWITCHING ON
    if (parseInt(isOn) === 0) {
			var VMCDaikinModbusSpeed = document.getElementsByClassName('VMCDaikinModbus_speed')[0];
			if (VMCDaikinModbusSpeed !== null) {
				if (VMCDaikinModbusSpeed.classList.contains('disabled')) {
					VMCDaikinModbusSpeed.classList.remove('disabled');
				}
			}
			var VMCDaikinModbusCommand = document.getElementsByClassName('VMCDaikinModbus_command')[0];
			if (VMCDaikinModbusCommand !== null) {
				if (VMCDaikinModbusCommand.classList.contains('disabled')) {
					VMCDaikinModbusCommand.classList.remove('disabled');
				}
			}
			var VMCDaikinModbusButton = document.getElementsByClassName('VMCDaikinModbus_btn')[0];
			if (VMCDaikinModbusButton !== null) {
				if (VMCDaikinModbusButton.classList.contains('btnOnOff_1')) {
					VMCDaikinModbusButton.classList.remove('btnOnOff_1');
					VMCDaikinModbusButton.classList.add('btnOnOff_0');
				}
			}
    }
		// SWITCHING OFF
		else {
			var VMCDaikinModbusSpeed = document.getElementsByClassName('VMCDaikinModbus_speed')[0];
			if (VMCDaikinModbusSpeed !== null) {
				if (!VMCDaikinModbusSpeed.classList.contains('disabled')) {
					VMCDaikinModbusSpeed.classList.add('disabled');
				}
			}
			var VMCDaikinModbusCommand = document.getElementsByClassName('VMCDaikinModbus_command')[0];
			if (VMCDaikinModbusCommand !== null) {
				if (!VMCDaikinModbusCommand.classList.contains('disabled')) {
					VMCDaikinModbusCommand.classList.add('disabled');
				}
			}
			var VMCDaikinModbusButton = document.getElementsByClassName('VMCDaikinModbus_btn')[0];
			if (VMCDaikinModbusButton !== null) {
				if (VMCDaikinModbusButton.classList.contains('btnOnOff_0')) {
					VMCDaikinModbusButton.classList.remove('btnOnOff_0');
					VMCDaikinModbusButton.classList.add('btnOnOff_1');
				}
			}
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates the HTML concerning the Daikin mode
 * @param {string} id 	- The ID of the device to be updated
 * @param {string} mode - New mode value
 * @version VER196 - WANDA
 */
function WEBAPP_updateDaikinModeHTML(id, mode)
{
  var thermo = document.getElementById('thermo');
  if (thermo !== null && parseInt(thermo.getAttribute('rel')) === parseInt(id)) {
    var VMCDaikinModbusCommand = document.getElementsByClassName('VMCDaikinModbus_command')[0];
		if (VMCDaikinModbusCommand !== null) {
			if (!VMCDaikinModbusCommand.classList.contains('disabled')) {
				var commandIcon = document.querySelectorAll('.VMCDaikinModbus_command .ico');
				if (commandIcon !== null) {
					for (var i = 0; i < commandIcon.length; i++) {
						if (commandIcon[i].classList.contains('active')) {
							commandIcon[i].classList.remove('active');
						}
					}
				}
				var commandIconToUpdate = document.querySelector('.VMCDaikinModbus_command' + mode + ' .ico');
				if (commandIconToUpdate !== null) {
					if (!commandIconToUpdate.classList.contains('active')) {
						commandIconToUpdate.classList.add('active');
					}
				}
			}
		}
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------- ANTITHEFT GUI -------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * An antitheft central has been found on the plant so the policeman icon has to be updated
 * @version VER198 - WANDA
 */
function WEBAPP_antitheftValFound()
{
	var menuIcoAntitheft = document.querySelector('#menu .ico-antitheft-no');
	if (menuIcoAntitheft !== null) {
		if (menuIcoAntitheft.classList.contains('ico-antitheft-no')) {
			menuIcoAntitheft.classList.remove('ico-antitheft-no');
		}
		menuIcoAntitheft.classList.add('ico-antitheft', 'ico-antitheft-stato0');
		menuIcoAntitheft.addEventListener('click', ANTITHEFT_getKeypad);
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * An antitheft central has not been found on the plant so the policeman icon has to be updated
 * @version VER198 - WANDA
 */
function WEBAPP_antitheftValNotFound()
{
	var menuIcoAntitheft = document.querySelector('#menu .ico-antitheft');
	if (menuIcoAntitheft !== null) {
		if (menuIcoAntitheft.classList.contains('ico-antitheft')) {
			menuIcoAntitheft.classList.remove('ico-antitheft');
		}
		menuIcoAntitheft.classList.add('ico-antitheft-no');
		menuIcoAntitheft.removeEventListener('click', ANTITHEFT_getKeypad);
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Creates a list of antitheft area icons in the antitheft_box which is placed in box1 (portrait mode only)
 * @version VER198 - WANDA
 */
function WEBAPP_getAntiTheftWidget()
{
	var htmlToAdd = '';
	var box1 = document.getElementById('box1');
	if (box1 !== null) {
		htmlToAdd += '<div class="antitheft_box antitheft-stato0">';
		for (var i = 1; i <= ANTITHEFT_areasAmount; i++) { // VER169 WANDA
			var areaName = ANTITHEFT_retrieveAreaName(i); // VER174 WANDA
			htmlToAdd += '<li>';
			htmlToAdd += '<div class="ico ico12_0" id="menu_ico_' + i + '" title="' + areaName + '" rel="12"></div>';
			htmlToAdd += '</li>';
		}
		htmlToAdd += '</div>';
		box1.insertAdjacentHTML('beforeend', htmlToAdd);
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates the policeman icon and the icons in the antitheft_box accordingly to the response of the GGS command
 * @param {string} antitheftStatus - the antitheft status
 * @version VER198 - WANDA
 */
function WEBAPP_antitheftManageGGS(antitheftStatus)
{
	var menuIcoAntitheft = document.querySelector('#menu .ico-antitheft');
	var antitheftBox = document.querySelector('.antitheft_box');
	if (menuIcoAntitheft !== null && antitheftBox !== null) {
		if (antitheftStatus === '0') {
			menuIcoAntitheft.style.webkitFilter = 'saturate(0)';
			menuIcoAntitheft.style.filter = 'saturate(0)';
			if (!antitheftBox.classList.contains('antitheft-stato0')) {
				antitheftBox.classList.add('antitheft-stato0')
			}
		} else {
			menuIcoAntitheft.style.webkitFilter = 'saturate(1)';
			menuIcoAntitheft.style.filter = 'saturate(1)';
			if (antitheftBox.classList.contains('antitheft-stato0')) {
				antitheftBox.classList.remove('antitheft-stato0')
			}
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

function WEBAPP_getPopupAlarm()
{
	if ($("#boxOver .sistemachiamata:visible").length==0) {
		var boxOver = document.getElementById('boxOver');
		if (boxOver !== null) {
			boxOver.innerHTML = '';
			var htmlToAdd = '<h1>' + lblTitoloSistemaChiamata + '</h1>';
			htmlToAdd += '<div class="sistemachiamata" id="box_allarmi"></div>';
			htmlToAdd += '<div id="btn_close" onclick="WEBAPP_closeBoxOver()">';
			htmlToAdd += '<span class="px-btn px-icon icon-close" title="' + lblChiudi + '"></span>';
			htmlToAdd += '</div>';
			htmlToAdd += '<a id="btn_callingsystem_stop" href="javascript:void(0);" onclick="WEBAPP_sendSTOCommand();">';
			htmlToAdd += '<span class="px-icon icon-bell"></span>';
			htmlToAdd += '</a>';
			boxOver.innerHTML = htmlToAdd;
			boxOver.style.display = 'block';
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Gets the alarm popup
 * @param {object} parameters - array containing falp informations
 * @param {string} alarmType - type of alarm
 * @version VER215 - WANDA
 */
function WEBAPP_showPropagationAlarm(parameters, alarmType)
{
	WEBAPP_getPopupAlarm();
	/* VER76 STEFANO BIS */
	var datetime = null;
	if (parameters.length > 6) { // VER89 STEFANO
		datetime = parameters[6];
	} else {
		datetime = WEBAPP_getcurrentDateTimeString();
	}
	/* ----------------- */
	/* VER87 STEFANO */
	htmlToAdd = '';
	if (alarmType === 'FALP') {
		var classToAdd = '';
		var falpElement = document.getElementById('falp' + parameters[0] + '_' + parameters[1] + '_' + parameters[2]);
		/* VER89 STEFANO */
		var sensorName = '';
		var sensorNameBase64 = parameters[5];
		var sensorNameBase64Part1 = sensorNameBase64.split('|')[0];
		var sensorNameBase64Part2 = sensorNameBase64.split('|')[1];
		var sensorNameClearPart1 = '';
		var sensorNameClearPart2 = '';
		try {
			sensorNameClearPart1 = atob(sensorNameBase64Part1);
			sensorNameClearPart2 = atob(sensorNameBase64Part2);
			sensorName = sensorNameClearPart1.trim() + '-' + sensorNameClearPart2.trim();
			sensorName = sensorName.substring(0, 18);
			sensorName = '[' + sensorName + ']';
		}
		catch (error) {
			sensorName = '[NameError]';
		}
		// YELLOW AND RED ICON
		if (parseInt(parameters[3]) === 1 || parseInt(parameters[3]) === 2) {
			if (parseInt(parameters[3]) === 1) {
				classToAdd = 'icona_antincendio_gialla';
			} else if (parseInt(parameters[3]) === 2) {
				classToAdd = 'icona_antincendio_rossa';
			}
			if (falpElement === null) {
				htmlToAdd += '<li id="falp' + parameters[0] + '_' + parameters[1] + '_' + parameters[2] + '" name="fireAlarmRectangleWrapper">';
				htmlToAdd += '<a class="' + parameters[2].toLowerCase() + ' isPropagated" rel="7" data-reference="' + parameters[0] + '_' + parameters[1] + '">';
				htmlToAdd += '<div class="ico ' + classToAdd + '" name="fireAlarmRectangle"></div>';
				htmlToAdd += '<span style="color: yellow;">' + parameters[0] + '-' + parameters[1] + '-' + parameters[2] + '</span>';
				htmlToAdd += '<span> | ' + sensorName + '</span>';
				htmlToAdd += '<span class="alarmdata">' + datetime + '</span>';
				htmlToAdd += '</a></li>';
				sistemaChiamata.innerHTML = htmlToAdd + sistemaChiamata.innerHTML;
			} else {
				htmlToAdd += '<a class="' + parameters[2].toLowerCase() + ' isPropagated" rel="7" data-reference="' + parameters[0] + '_' + parameters[1] + '">';
				htmlToAdd += '<div class="ico ' + classToAdd + '" name="fireAlarmRectangle"></div>';
				htmlToAdd += '<span style="color: yellow;">' + parameters[0] + '-' + parameters[1] + '-' + parameters[2] + '</span>';
				htmlToAdd += '<span> | ' + sensorName + '</span>';
				htmlToAdd += '<span class="alarmdata">' + datetime + '</span>';
				htmlToAdd += '</a>';
				falpElement.innerHTML = htmlToAdd;
			}
		}
		// GREEN ICON
		else if (parseInt(parameters[3]) === 0) {
			classToAdd = 'icona_antincendio_verde';
			var fireAlarmElements = document.getElementsByName('fireAlarmRectangle');
			for (var i = 0; i < fireAlarmElements.length; i++) {
				fireAlarmElements[i].setAttribute('class', 'ico ' + classToAdd);
			}
		}
	}
	// CALLING SYSTEM
	else {
		var sistemachiamataElement = document.querySelector('.sistemachiamata a.' + parameters[2].toLowerCase() + '[data-reference="' + parameters[0] + '_' + parameters[1] + '"]');
		if (sistemachiamataElement !== null) {
			var sistemachiamataIco = sistemachiamataElement.querySelectorAll('div.ico');
			if (sistemachiamataIco !== null) {
				for (var i = 0; i < sistemachiamataIco.length; i++) {
					sistemachiamataIco[i].className = '';
					sistemachiamataIco[i].classList.add('ico', 'ico7_' + parameters[3], 'ico' + parameters[2], 'ico' + parameters[2] + '_' + parameters[3]);
				}
			}
			var sistemachiamataSpan = sistemachiamataElement.querySelectorAll('span')[2];
			if (sistemachiamataSpan !== null) {
				sistemachiamataSpan.innerHTML = datetime;
			}
		} else {
			htmlToAdd += '<li>';
			htmlToAdd += '<a class="' + parameters[2].toLowerCase() + ' isPropagated" rel="7" data-reference="' + parameters[0] + '_' + parameters[1] + '">';
			htmlToAdd += '<div class="ico ico7_' + parameters[3] + ' ico' + parameters[2] + ' ico' + parameters[2] + '_' + parameters[3] + '"></div>';
			htmlToAdd += '<span style="color: yellow;">' + parameters[0] + '</span>';
			htmlToAdd += '<span>' + parameters[1] + '</span>';
			htmlToAdd += '<span class="alarmdata">' + datetime + '</span>';
			htmlToAdd += '</a></li>';
			sistemaChiamata.innerHTML = htmlToAdd + sistemaChiamata.innerHTML;
			var body = document.body; // VER261
			if (typeof body !== 'undefined') {
				if (body.classList.contains('MV')) {
					WEBAPP_setPagination($('.sistemachiamata'), 7, 1, true);
				} else {
					WEBAPP_setPagination($('.sistemachiamata'), 10, 2);
				}
			}
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates HTML antitheft related element based on the GSF response
 * @param {string} deviceFamily - the family type of the device
 * @param {object} records - array of arrays containing the response data for every device
 * @param {string} htmlToAdd - an empty string
 * @version VER198 - WANDA
 */
function WEBAPP_updateAntitheftStatusHTML(deviceFamily, records, htmlToAdd)
{
	// UPDATING POLICEMAN and PADLOCKS (in box1 portrait mode) ICONS
	var icoAntitheft = document.querySelector('#menu .ico-antitheft');
	if (icoAntitheft !== null) {
		if (!(icoAntitheft.classList.contains('ico-antitheft-stato5') && ANTITHEFT_antiTheftGlobalState === 2)) { // Do not update if policeman is fuchsia and central is non engaged and not clear
			icoAntitheft.className = '';
			icoAntitheft.classList.add('ico-antitheft', 'ico-antitheft-stato' + ANTITHEFT_antiTheftGlobalState);
			var antitheftBox = document.querySelector('.antitheft_box');
			if (antitheftBox !== null) {
				if (ANTITHEFT_antiTheftGlobalState === 0) {
					if (!antitheftBox.classList.contains('antitheft-stato0')) {
						antitheftBox.classList.add('antitheft-stato0');
					}
				} else {
					if (antitheftBox.classList.contains('antitheft-stato0')) {
						antitheftBox.classList.remove('antitheft-stato0');
					}
				}
			}
		}
  }
	for (var i = 0; i < records.length; i++) {
    var deviceID = records[i][0];
    var deviceStatus = records[i][1];
		// TECH ALARM --- VER239 WANDA
    if (deviceFamily === '7') {
			var device = WEBAPP_getDevice(deviceID);
			if (device !== false) {
				var menuIcoElement = document.getElementById('menu_ico_' + deviceID);
				if (menuIcoElement !== null) {
					menuIcoElement.className = '';
					menuIcoElement.classList.add('ico', 'ico7_' + deviceStatus);
				}
				if (parseInt(deviceStatus) === 1) {
					if (typeof device.name !== 'undefined' && typeof device.type !== 'undefined') {
						var menuElement = document.querySelector('#boxOver #menu_' + deviceID);
						if (menuElement === null) {
							htmlToAdd += '<li>';
							htmlToAdd += '<a id="menu_' + deviceID + '">';
							htmlToAdd += '<div class="ico ico' + device.type + '_1" id="menu_ico_' + deviceID + '" rel="' + device.type + '"></div>' + device.name;
							htmlToAdd += '</a></li>';
						}
					}
				}
			}
    }
		// P3000_AREA
		else if (deviceFamily === '12') {
			if (deviceStatus === '3') {
				var areaName = ANTITHEFT_retrieveAreaName(parseInt(deviceID)); // VER174 WANDA
				var menuElement = document.querySelector('#boxOver #menu_' + deviceID);
				if (menuElement === null) {
					htmlToAdd += '<li>';
					htmlToAdd += '<a id="menu_' + deviceID + '">';
					htmlToAdd += '<div class="ico ico12_3" id="menu_ico_' + deviceID + '" rel="12"></div>' + areaName;
					htmlToAdd += '</a></li>';
				}
			}
			// UPDATING SINGLE PADLOCK ICON (box1 portrait mode & box2)
			var antitheftBoxIcon = document.querySelector('.antitheft_box #menu_ico_' + deviceID);
			if (antitheftBoxIcon !== null) {
				antitheftBoxIcon.className = '';
				antitheftBoxIcon.classList.add('ico', 'ico12_' + deviceStatus);
			}
			var box2Icon = document.querySelector('#box2 #menu_ico_' + deviceID);
			if (box2Icon !== null && box2Icon.getAttribute('rel') === '12') {
				box2Icon.className = '';
				box2Icon.classList.add('ico', 'ico12_' + deviceStatus);
			}
			// UPDATING SINGLE ELEMENT IN BOX_AA
			var boxAA = document.getElementById('box_AA');
			if (boxAA !== null) {
				if (deviceStatus === '0' || deviceStatus === '1') {
					WEBAPP_antitheftStatusString = lblAreaLibera;
				} else if (deviceStatus === '2') {
					WEBAPP_antitheftStatusString = lblAreaImpegnata;
				} else if (deviceStatus === '3') {
					WEBAPP_antitheftStatusString = lblAreaInAllarme;
				}
				var boxAAIco = document.querySelector('#box_AA #menu_ico_' + deviceID);
				if (boxAAIco !== null) {
					if (!(boxAAIco.classList.contains('ico12_3') && ANTITHEFT_antiTheftType !== 4)) {
						if (deviceStatus === '0' || deviceStatus === '2') {
							var boxAAArea = document.querySelector('#box_AA #area_' + deviceID);
							if (boxAAArea !== null) {
								if (boxAAArea.classList.contains('active')) {
									boxAAIco.className = '';
									boxAAIco.classList.add('ico', 'ico12_' + deviceStatus + 'lock');
									WEBAPP_antitheftActionString = lblAreaInInserimento;
								} else {
									boxAAIco.className = '';
									boxAAIco.classList.add('ico', 'ico12_' + deviceStatus + 'unlock');
									WEBAPP_antitheftActionString = lblAreaNonInInserimento;
								}
							}
						} else {
							boxAAIco.className = '';
							boxAAIco.classList.add('ico', 'ico12_' + deviceStatus);
							WEBAPP_antitheftActionString = lblAreaInserita;
							var boxAMessage = document.getElementById('box_AMessage');
							if (boxAMessage !== null) {
								boxAMessage.parentNode.removeChild(boxAMessage);
							}
							boxAA.style.display = 'block';
						}
					}
					var boxAAAreaSpan = document.querySelector('#box_AA #area_' + deviceID + ' span');
					if (boxAAAreaSpan !== null) {
						boxAAAreaSpan.innerHTML = WEBAPP_antitheftActionString;
					}
				}
			}
    }
  }
	// IN ALARM
	if (htmlToAdd !== '') {
		var boxOver = document.getElementById('boxOver');
		if (boxOver !== null) {
			if (boxOver.style.display === 'none' || boxOver.style.display === '') {
				var htmlToAdd2 = '';
				boxOver.innerHTML = '';
				htmlToAdd2 += '<h1>' + lblTitoloAllarmi + '</h1>';
				htmlToAdd2 += '<div id="box_allarmi">' + htmlToAdd + '</div>';
				htmlToAdd2 += '<div id="btn_close">';
				htmlToAdd2 += '<span class="px-btn px-icon icon-close" title="' + lblChiudi + '" onclick="WEBAPP_closeBoxOver()"></span>';
				htmlToAdd2 += '</div>';
				boxOver.innerHTML = htmlToAdd2;
				boxOver.style.display = 'block';
			}	else {
				var boxAllarmi = document.getElementById('box_allarmi');
				if (boxAllarmi !== null) {
					// TECH ALARM
					if (deviceFamily === '7') {
						boxAllarmi.innerHTML = htmlToAdd + boxAllarmi.innerHTML;
						WEBAPP_setPagination($('.sistemachiamata'), 4);
					}
					// P3000_AREA
					else {
						boxAllarmi.innerHTML += htmlToAdd;
					}
				}
			}
			var tastieraAntifurtoAllarmiBox = document.getElementById('tastiera_antifurto_allarmibox');
			if (tastieraAntifurtoAllarmiBox !== null) {
				tastieraAntifurtoAllarmiBox.parentNode.removeChild(tastieraAntifurtoAllarmiBox);
			}
			var boxAllarmi = document.getElementById('box_allarmi');
			if (boxAllarmi !== null) {
				var boxOverIco = document.querySelector('#boxOver .ico12_3');
				if (boxOverIco !== null) {
					var htmlToAdd2 = '';
					htmlToAdd2 += '<a id="tastiera_antifurto_allarmibox" onclick="ANTITHEFT_getKeypad()">';
					htmlToAdd2 += '<div class="ico ico11_0"></div>';
					htmlToAdd2 += '</a>';
					boxAllarmi.innerHTML += htmlToAdd2;
				}
			}
		}
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates antitheft areas HTML
 * @param {number} areaProgressive - the progressive of the area
 * @param {number} areaEngaged - 0: not engaged - 1: engaged
 * @param {number} areaInAlarm -0: not in alarm - 1: in alarm
 * @param {number} areaClear - 0: not clear - 1: clear
 * @version VER198 - WANDA
 */
function WEBAPP_updateAntitheftAreasHTML(areaProgressive, areaEngaged, areaInAlarm, areaClear)
{
	var isInAlarm = false;
	var box2MenuIco = document.querySelector('#box2 #menu_ico_' + areaProgressive);
	if (box2MenuIco !== null && box2MenuIco.getAttribute('rel') === '12') {
		box2MenuIco.className = '';
		box2MenuIco.classList.add('ico');
	}
	var menuIco = document.getElementById('menu_ico_' + areaProgressive);
	if (menuIco !== null && menuIco.getAttribute('rel') === '12') {
		if (menuIco.classList.contains('ico12_3')) {
			isInAlarm = true;
		}
		menuIco.className = '';
		menuIco.classList.add('ico');
		if (areaEngaged === 0) {
			if (areaClear === 0) {
				menuIco.classList.add('ico12_2'); // VER113 (it was ico12_4)
			} else {
				menuIco.classList.add('ico12_0');
			}
		} else if (areaEngaged === 1) {
			if (areaClear === 0 || areaInAlarm === 1) {
				menuIco.classList.add('ico12_3');
			} else {
				if (isInAlarm === false) {
					menuIco.classList.add('ico12_1');
				} else {
					menuIco.classList.add('ico12_3');
				}
			}
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates antitheft menu in box1 accordingly to the presence or absence of the antitheft central
 * @version VER199 - WANDA
 */
function WEBAPP_updateBox1ForAntitheftMenu()
{
	var menu11 = document.getElementById('menu_11');
	var menu11Ico = document.querySelector('#box1 #menu_11 .ico11');
  if (ANTITHEFT_antiTheftType === 0) {
		if (menu11 !== null) {
			DISPLAY_notEnabledBox1Array.push(menu11);
			menu11.style.color = 'rgba(255, 255, 255, 0.22)';
			if (DISPLAY_WBS_canApplyFullscreenStyleBasedOnUserAgent()) {
				menu11.style.backgroundColor = 'transparent';
				menu11.style.boxShadow = 'none';
				menu11.style.borderRadius = '0';
			}
		}
		if (menu11Ico !== null) {
			menu11Ico.style.opacity = '0.22';
		}
  } else {
		if (menu11 !== null) {
			DISPLAY_enabledBox1Array.push(menu11);
			menu11.style.color = 'rgba(255, 255, 255, 1)';
			if (DISPLAY_WBS_canApplyFullscreenStyleBasedOnUserAgent()) {
				menu11.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
				menu11.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.5)';
				menu11.style.borderRadius = '5px';
			}
		}
		if (menu11Ico !== null) {
			menu11Ico.style.opacity = '1';
		}
    WEBAPP_getAntiTheftWidget();
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates the HTML relative to box2b
 * @version VER199 - WANDA
 */
function WEBAPP_showAntitheftInBox2b()
{
	var htmlToAdd = '';
	$('#box2').slideUp();
	var box2 = document.getElementById('box2');
	if (box2 !== null) {
		box2.innerHTML = '';
	}
	$('#box2b').slideUp();
	var box2b = document.getElementById('box2b');
	if (box2b !== null) {
		box2b.innerHTML = '';
		WEBAPP_appendNavbar('box2b', true, false, false);
		// AREAS
		htmlToAdd += '<li>';
		htmlToAdd += '<a id="antifurto_12" onclick="WEBAPP_clickOnAntitheftInBox2b(event.currentTarget)">';
		htmlToAdd += '<div class="ico ico12_0"></div>' + lblAree;
		htmlToAdd += '</a></li>';
		// SENSORS
		htmlToAdd += '<li>';
		htmlToAdd += '<a id="antifurto_13" onclick="WEBAPP_clickOnAntitheftInBox2b(event.currentTarget)">';
		htmlToAdd += '<div class="ico ico13_0"></div>' + lblSensori;
		htmlToAdd += '</a></li>';
		// KEYPAD
		htmlToAdd += '<li>';
		htmlToAdd += '<a id="antifurto_11" onclick="ANTITHEFT_getKeypad()">';
		htmlToAdd += '<div class="ico ico11_0"></div>' + lblTastiera;
		htmlToAdd += '</a></li>';
		// LOG
		htmlToAdd += '<li>';
		htmlToAdd += '<a id="antitheft_log" onclick="ANTITHEFT_clickOnAntitheftLogInBox2b()">';
		htmlToAdd += '<div class="ico ico_antitheftlog"></div>' + lblLog;
		htmlToAdd += '</a></li>';
		box2b.insertAdjacentHTML('beforeend', htmlToAdd);
	}
	WEBAPP_manageBox2bStyle();
	$('#box2b').slideDown();
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Changes box2b appearance based on device
 * @version VER199 - WANDA
 */
function WEBAPP_manageBox2bStyle()
{
	if (ANTITHEFT_antiTheftType !== 2 && ANTITHEFT_antiTheftType !== 4) {
		var antitheftLog = document.getElementById('antitheft_log');
		if (antitheftLog !== null) {
			antitheftLog.style.opacity = '0.3';
		}
	}
	if (DISPLAY_WBS_canApplyFullscreenStyleBasedOnUserAgent()) {
		var box2bListItem = document.querySelectorAll('#box2b > li');
		if (box2bListItem !== null) {
			for (var i = 0; i < box2bListItem.length; i++) {
				box2bListItem[i].style.width = '100%';
				box2bListItem[i].style.height = '46px';
			}
		}
		var box2bAnchorElement = document.querySelectorAll('#box2b > li > a');
		if (box2bAnchorElement !== null) {
			for (var i = 0; i < box2bAnchorElement.length; i++) {
				box2bAnchorElement[i].style.width = '100%';
				box2bAnchorElement[i].style.height = '100%';
				box2bAnchorElement[i].style.margin = '5px 0';
				box2bAnchorElement[i].style.padding = '0';
				box2bAnchorElement[i].style.borderBottom = 'none';
				box2bAnchorElement[i].style.lineHeight = '2';
			}
		}
		var box2bDiv = document.querySelectorAll('#box2b > li > a div');
		if (box2bDiv !== null) {
			for (var i = 0; i < box2bDiv.length; i++) {
				box2bDiv[i].style.transform = 'scale(0.9)';
			}
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Handler of the click on a box2b element (areas and sensors)
 * @param {object} element - the clicked element
 * @version VER199 - WANDA
 */
function WEBAPP_clickOnAntitheftInBox2b(element)
{
	var box2bAnchorElement = document.querySelectorAll('#box2b > li > a');
	if (box2bAnchorElement !== null) {
		for (var i = 0; i < box2bAnchorElement.length; i++) {
			box2bAnchorElement[i].className = '';
		}
	}
	element.classList.add('active');
	WEBAPP_getBox2(element.getAttribute('id').split('_')[1], 3);
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Adds antitheft areas to box2
 * @version VER199 - WANDA
 */
function WEBAPP_addAntitheftAreasInBox2()
{
	var htmlToAdd = '';
	var box2 = document.getElementById('box2');
	if (box2 !== null) {
		if (!box2.classList.contains('antitheft_mode')) {
			box2.classList.add('antitheft_mode');
		}
		for (var i = 1; i <= ANTITHEFT_areasAmount; i++) { // VER169 WANDA
			var areaName = ANTITHEFT_retrieveAreaName(i); // VER174 WANDA
			htmlToAdd += '<li>';
			htmlToAdd += '<a id="menu_' + i + '">';
			htmlToAdd += '<div class="ico ico12_0" id="menu_ico_' + i + '" rel="12"></div>' + areaName;
			htmlToAdd += '</a></li>';
		}
		box2.insertAdjacentHTML('beforeend', htmlToAdd);
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------- AUDIO_GEN GUI -------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Hides audio commands accordingly to AUDIO_GEN_audioType
 * @version VER200 - WANDA
 */
function WEBAPP_hideAudioCommands()
{
	if (AUDIO_GEN_audioType === 2 || AUDIO_GEN_audioType === 3) {
		var boxPreset = document.getElementById('boxPreset');
		if (boxPreset !== null) {
			boxPreset.style.display = 'none';
		}
	}
	if (AUDIO_GEN_audioType === 2) {
		var balanceContainer = document.getElementById('balanceContainer');
		if (balanceContainer !== null) {
			balanceContainer.style.display = 'none';
		}
		var comandiItem = document.getElementsByClassName('comandi_item');
		if (comandiItem !== null) {
			var dataCmd = '';
			for (var i = 0; i < comandiItem.length; i++) {
				dataCmd = comandiItem[i].getAttribute('data-cmd');
				if (dataCmd === '46' || dataCmd === '81') {
					comandiItem[i].style.display = 'none';
				}
			}
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates audio menu in box1 accordingly to the presence or absence of the audio central
 * @version VER200 - WANDA
 */
function WEBAPP_updateBox1ForAudioMenu()
{
	var menu14 = document.getElementById('menu_14');
	var menu14Ico = document.querySelector('#menu_14 .ico14');
	if (AUDIO_GEN_audioEnable === 0) {
		if (menu14 !== null) {
			menu14.style.color = 'rgba(255, 255, 255, 0.22)';
		}
		if (menu14Ico !== null) {
			menu14Ico.style.opacity = '0.22';
		}
	} else {
		if (menu14 !== null) {
			menu14.style.color = 'rgba(255, 255, 255, 1)';
		}
		if (menu14Ico !== null) {
			menu14Ico.style.opacity = '1';
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Adds or removes the overlay on the audio page
 * @version VER200 - WANDA
 */
function WEBAPP_toggleAudioOverlay()
{
	var boxOverlay = document.getElementById('boxOverlay');
	var comandiItem = document.querySelectorAll('.box_comandi_extra .comandi_item');
	if (comandiItem !== null) {
		for (var i = 0; i < comandiItem.length; i++) {
			if (comandiItem[i].getAttribute('data-cmd') === 'on') {
				if (boxOverlay !== null) {
					if (comandiItem[i].classList.contains('active')) {
						if (boxOverlay.classList.contains('dis')) {
							boxOverlay.classList.remove('dis');
						}
					} else {
						if (!boxOverlay.classList.contains('dis')) {
							boxOverlay.classList.add('dis');
						}
					}
				}
			}
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Hides/shows element based on the active source
 * @param {object} activeSource - the clicked source element
 * @version VER200 - WANDA
 */
function WEBAPP_setComandiSorgenti(activeSource)
{
	var boxComandiSuperSorgenti = document.getElementsByClassName('box_comandi_supersorgenti');
	if (boxComandiSuperSorgenti !== null) {
		for (var i = 0; i < boxComandiSuperSorgenti.length; i++) {
			boxComandiSuperSorgenti[i].style.display = 'none';
		}
	}
	var comandiItem = document.querySelectorAll('.box_comandi_extra .comandi_item');
	if (comandiItem !== null) {
		for (var i = 0; i < comandiItem.length; i++) {
			if (comandiItem[i].getAttribute('data-cmd') === 'on') {
				if (comandiItem[i].classList.contains('active')) {
					// TUTONDO: TUNER - CD
					if (activeSource.classList.contains('ico_source_1')) {
						var boxComandi1 = document.getElementById('boxComandi1');
						if (boxComandi1 !== null) {
							boxComandi1.style.display = 'block';
						}
					}
					// TUTONDO: DVD - SAT
					if (activeSource.classList.contains('ico_source_2')) {
						var boxComandi2 = document.getElementById('boxComandi2');
						if (boxComandi2 !== null) {
							boxComandi2.style.display = 'block';
						}
					}
					// VIVALDI: RADIO
					if (activeSource.classList.contains('ico_source_vivaldi_1')) {
						var boxComandiVivaldi1 = document.getElementById('boxComandiVivaldi1');
						if (boxComandiVivaldi1 !== null) {
							boxComandiVivaldi1.style.display = 'block';
						}
					}
					// VIVALDI: USB
					if (activeSource.classList.contains('ico_source_vivaldi_11')) {
						var boxComandiVivaldi11 = document.getElementById('boxComandiVivaldi11');
						if (boxComandiVivaldi11 !== null) {
							boxComandiVivaldi11.style.display = 'block';
						}
					}
				}
			}
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Toggles the active class
 * @param {object} element - the clicked source element
 * @version VER200 - WANDA
 */
function WEBAPP_toggleAudioActiveClass(element)
{
	var sourcesItem = document.getElementsByClassName('sources_item');
	if (sourcesItem !== null) {
		for (var i = 0; i < sourcesItem.length; i++) {
			if (sourcesItem[i].classList.contains('active')) {
				sourcesItem[i].classList.remove('active');
			}
		}
	}
	if (!element.classList.contains('active')) {
		element.classList.add('active');
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Handler of the click on "comandi_item" in "box_comandi_extra"
 * @param {object} element - the clicked element 
 * @param {string} type - the type of the command
 * @returns it may returns a value based on the type
 * @version VER200 - WANDA
 */
function WEBAPP_clickOnComandiItemInBoxComandiExtra(element, type)
{
	element.classList.toggle('active');
	switch (type) {
		case 'ON':
			var isActive = element.classList.contains('active');
			if (isActive === true) {
				var activeSource = document.querySelector('.sources_item.active');
        if (activeSource !== null) {
          AUDIO_GEN_setComandiSorgenti(activeSource);
        }
			} else {
				var boxComandiSuperSorgenti = document.getElementsByClassName('box_comandi_supersorgenti');
				if (boxComandiSuperSorgenti !== null) {
					for (var i = 0; i < boxComandiSuperSorgenti.length; i++) {
						boxComandiSuperSorgenti[i].style.display = 'none';
					}
				}
			}
			return isActive;

		case 'MUTE':
			var isActive = element.classList.contains('active');
			return isActive;
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Sets audio sliders min, max and current values
 * @param {string} volumeMinValue - supported sound central volume min value
 * @param {string} volumeMaxValue - supported sound central volume max value
 * @param {string} bassMinValue - supported sound central bass min value 
 * @param {string} bassMaxValue - supported sound central bass max value
 * @param {string} highMinValue - supported sound central high min value
 * @param {string} highMaxValue - supported sound central high max value
 * @param {string} balanceMinValue - supported sound central balance min value (all on left channel);
 * @param {string} balanceMaxValue - supported sound central balance max value (all on right channel)
 * @version VER200 - WANDA
 */
function WEBAPP_setAudioSliders(volumeMinValue, volumeMaxValue, bassMinValue, bassMaxValue, highMinValue, highMaxValue, balanceMinValue, balanceMaxValue)
{
	// VOLUME
	var volumeSliderInput = document.getElementById('volumeSliderInput');
	if (volumeSliderInput !== null) {
		volumeSliderInput.value = (parseInt(volumeMaxValue) / 2).toString();
		volumeSliderInput.setAttribute('min', volumeMinValue);
		volumeSliderInput.setAttribute('max', volumeMaxValue);
	}
	// BASS
	var bassSliderInput = document.getElementById('bassSliderInput');
	if (bassSliderInput !== null) {
		bassSliderInput.value = (parseInt(bassMaxValue) / 2).toString();
		bassSliderInput.setAttribute('min', bassMinValue);
		bassSliderInput.setAttribute('max', bassMaxValue);
	}
	// HIGH
	var hiSliderInput = document.getElementById('hiSliderInput');
	if (hiSliderInput !== null) {
		hiSliderInput.value = (parseInt(highMaxValue) / 2).toString();
		hiSliderInput.setAttribute('min', highMinValue);
		hiSliderInput.setAttribute('max', highMaxValue);
	}
	// BALANCE
	var balanceSliderInput = document.getElementById('balanceSliderInput');
	if (balanceSliderInput !== null) {
		balanceSliderInput.value = (parseInt(balanceMaxValue) / 2).toString();
		balanceSliderInput.setAttribute('min', balanceMinValue);
		balanceSliderInput.setAttribute('max', balanceMaxValue);
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

function WEBAPP_checkIfAudioIsOn()
{
	var isOn = false;
	var comandiItem = document.querySelectorAll('.box_comandi_extra .comandi_item');
	if (comandiItem !== null) {
		for (var i = 0; i < comandiItem.length; i++) {
			if (comandiItem[i].getAttribute('data-cmd') === 'on') {
				if (comandiItem[i].classList.contains('active')) {
					isOn = true;
				}
				break;
			}
		}
	}
	return isOn;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* --------------------------------------------------------------------------- VIVALDI GUI -------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates the HTML based on oncoming UPDs
 * @param {object} device - the relevant device
 * @param {string} mute - mute
 * @param {number} volume - volume
 * @param {string} commandName - command
 * @param {string} updatedValue - description string
 * @version VER217 - WANDA
 */
function WEBAPP_updateVivaldiHTMLonUPD(device, mute, volume, commandName, updatedValue)
{
  var settingsAudio = document.getElementById('settings_audio');	
  if (settingsAudio !== null) {
		if (typeof device.vivaldiID !== 'undefined' && device.vivaldiID === WEBAPP_actualDevice) { // VER205C WANDA
      AUDIO_GEN_audioUPDclick = false;
			WEBAPP_updateVivaldiUSBandTunerData(AUDIO_GEN_currentDevice); // VER217 WANDA
      // VOLUME and MUTE
			var comandiItemMute = document.getElementById('comandiItemMute');
      if (commandName === 'VOLUME_MUTE') {
				/* VER200 WANDA */
				var volumeSliderInput = document.getElementById('volumeSliderInput');
				if (volumeSliderInput !== null) {
					volumeSliderInput.value = volume.toString();
				}
				var volumeCurrentValue = document.getElementById('volumeCurrentValue');
				if (volumeCurrentValue !== null) {
					volumeCurrentValue.innerHTML = volume;
				}
				/* ------------ */
				if (comandiItemMute !== null) {
					if ((mute === '1' && comandiItemMute.classList.contains('active')) || (mute === '0' && !comandiItemMute.classList.contains('active'))) {
						comandiItemMute.click();
					}
				}
      }
      // DESCRIPTION
			var descriptionAudio = document.getElementById('descriptionAudio');
      if (commandName === 'USB_PREV_DIR' || commandName === 'USB_PREV_TRACK' || commandName === 'USB_NEXT_TRACK' || commandName === 'USB_NEXT_DIR') {
				if (descriptionAudio !== null) {
					if (typeof device.USB_DIR !== 'undefined') {
						if (typeof device.USB_TRACK !== 'undefined') {
							descriptionAudio.innerHTML = device.USB_DIR + '\\' + device.USB_TRACK;
						} else {
							descriptionAudio.innerHTML = device.USB_DIR + '\\' + 'No file'
						}
					} else {
						if (typeof device.USB_TRACK !== 'undefined') {
							descriptionAudio.innerHTML = device.USB_TRACK;
						} else {
							descriptionAudio.innerHTML = 'No file';
						}
					}
				}
      }
      if (commandName === 'RDS_TEXT') {
				if (descriptionAudio !== null) {
					if (typeof device.RDS_TEXT !== 'undefined') {
						if (typeof device.FM_FREQ !== 'undefined') {
							descriptionAudio.innerHTML = device.FM_FREQ + ' MHz - ' + device.RDS_TEXT;
						} else {
							descriptionAudio.innerHTML = device.RDS_TEXT;
						}
					}
				}
      }
      if (commandName === 'FM_FREQ') {
        device.RDS_TEXT = '';
				if (descriptionAudio !== null) {
					if (typeof device.FM_FREQ !== 'undefined') {
						descriptionAudio.innerHTML = device.FM_FREQ + ' MHz';
					}
				}
        VIVALDI_currentFrequency = parseInt(updatedValue.replace('.', ''));
      }
      // USB PLAY and PAUSE
			var comandiItemUSBPlay = document.getElementById('comandiItemUSBPlay');
			var comandiItemUSBPause = document.getElementById('comandiItemUSBPause');
      if (commandName === 'USB_PAUSE' && updatedValue === '1') {
				if (comandiItemUSBPause !== null) {
					comandiItemUSBPause.style.display = 'none';
				}
				if (comandiItemUSBPlay !== null) {
					comandiItemUSBPlay.style.display = 'inline-block';
				}
      }
      if (commandName === 'USB_PLAY' && updatedValue === '0') {
				if (comandiItemUSBPlay !== null) {
					comandiItemUSBPlay.style.display = 'none';
				}
				if (comandiItemUSBPause !== null) {
					comandiItemUSBPause.style.display = 'inline-block';
				}
      }
      // SOURCE
      if (commandName === 'SOURCE') {
				var boxComandiSuperSorgenti = document.querySelectorAll('.settings_audio_box.box_comandi .box_comandi_supersorgenti');
				if (boxComandiSuperSorgenti !== null) {
					for (var i = 0; i < boxComandiSuperSorgenti.length; i++) {
						boxComandiSuperSorgenti[i].style.display = 'none';
					}
				}
        var sourcesItem = document.querySelectorAll('.box_sorgenti .sources_item');
				if (sourcesItem !== null) {
					for (var i = 0; i < sourcesItem.length; i++) {
						if (sourcesItem[i].classList.contains('active')) {
							sourcesItem[i].classList.remove('active');
						}
						if (sourcesItem[i].getAttribute('data-id') === updatedValue) {
							if (!sourcesItem[i].classList.contains('active')) {
								sourcesItem[i].classList.add('active');
							}
						}
					}
				}
				var boxComandiVivaldi = document.querySelector('.box_comandi_supersorgenti.box_comandi_vivaldi_' + updatedValue);
				if (boxComandiVivaldi !== null) {
					boxComandiVivaldi.style.display = 'block';
				}
      }
      // BASS
      if (commandName === 'BASS') {
				/* VER200 WANDA */
				var bassSliderInput = document.getElementById('bassSliderInput');
				if (bassSliderInput !== null) {
					bassSliderInput.value = updatedValue.toString();
				}
				var bassCurrentValue = document.getElementById('bassCurrentValue');
				if (bassCurrentValue !== null) {
					bassCurrentValue.innerHTML = updatedValue;
				}
				/* ------------ */
      }
      // TREBLE
      if (commandName === 'TREBLE') {
				/* VER200 WANDA */
				var hiSliderInput = document.getElementById('hiSliderInput');
				if (hiSliderInput !== null) {
					hiSliderInput.value = updatedValue.toString();
				}
				var hiCurrentValue = document.getElementById('hiCurrentValue');
				if (hiCurrentValue !== null) {
					hiCurrentValue.innerHTML = updatedValue;
				}
				/* ------------ */
      }
      // ON and OFF
			if (commandName === 'ONOFF') {
				var commandItemOn = document.getElementById('commandItemOn');
				if (commandItemOn !== null) {
					if ((updatedValue === '0' && commandItemOn.classList.contains('active')) || (updatedValue === '1' && !commandItemOn.classList.contains('active'))) {
						commandItemOn.click();
					}
				}
			}
      AUDIO_GEN_audioUPDclick = true;
    }
  }
}


/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Modifies the informations based on what is loaded from the local device
 * @version VER217 - WANDA
 */
function WEBAPP_loadVivaldiHTMLLocalDevice()
{
	// MUTE
	var comandiItemMute = document.getElementById('comandiItemMute');
	if (comandiItemMute !== null) {
		if (comandiItemMute.classList.contains('active')) {
			comandiItemMute.classList.remove('active');
		}
		if (typeof AUDIO_GEN_currentDevice.MUTE !== 'undefined' && AUDIO_GEN_currentDevice.MUTE === '0') {
			if (!comandiItemMute.classList.contains('active')) {
				comandiItemMute.classList.add('active');
			}
		}
	}
	// ON
	var commandItemOn = document.getElementById('commandItemOn');
	if (commandItemOn !== null) {
		if (commandItemOn.classList.contains('active')) {
			commandItemOn.classList.remove('active');
		}
		if (typeof AUDIO_GEN_currentDevice.ONOFF !== 'undefined' && AUDIO_GEN_currentDevice.ONOFF === '1') {
			if (!commandItemOn.classList.contains('active')) {
				commandItemOn.classList.add('active');
			}
		}
	}
	// VOLUME
	if (typeof AUDIO_GEN_currentDevice.VOLUME !== 'undefined') {
		var volumeSliderInput = document.getElementById('volumeSliderInput');
		if (volumeSliderInput !== null) {
			volumeSliderInput.value = AUDIO_GEN_currentDevice.VOLUME;
		}
		var volumeCurrentValue = document.getElementById('volumeCurrentValue');
		if (volumeCurrentValue !== null) {
			volumeCurrentValue.innerHTML = AUDIO_GEN_currentDevice.VOLUME;
		}
		var boxVolumeItemVolume = document.getElementById('boxVolumeItemVolume');
		if (boxVolumeItemVolume !== null) {
			boxVolumeItemVolume.style.display = 'block';
		}
	}
	// TREBLE
	if (typeof AUDIO_GEN_currentDevice.TREBLE !== 'undefined') {
		var hiSliderInput = document.getElementById('hiSliderInput');
		if (hiSliderInput !== null) {
			hiSliderInput.value = AUDIO_GEN_currentDevice.TREBLE;
		}
		var hiCurrentValue = document.getElementById('hiCurrentValue');
		if (hiCurrentValue !== null) {
			hiCurrentValue.innerHTML = AUDIO_GEN_currentDevice.TREBLE;
		}
		var boxVolumeItemHi = document.getElementById('boxVolumeItemHi');
		if (boxVolumeItemHi !== null) {
			boxVolumeItemHi.style.display = 'block';
		}
	}
	// BASS
	if (typeof AUDIO_GEN_currentDevice.BASS !== 'undefined') {
		var bassSliderInput = document.getElementById('bassSliderInput');
		if (bassSliderInput !== null) {
			bassSliderInput.value = AUDIO_GEN_currentDevice.BASS;
		}
		var bassCurrentValue = document.getElementById('bassCurrentValue');
		if (bassCurrentValue !== null) {
			bassCurrentValue.innerHTML = AUDIO_GEN_currentDevice.BASS;
		}
		var boxVolumeItemBass = document.getElementById('boxVolumeItemBass');
		if (boxVolumeItemBass !== null) {
			boxVolumeItemBass.style.display = 'block';
		}
	}
	// SOURCE
	AUDIO_GEN_audioUPDclick = false;
	var sourcesItem = document.getElementsByClassName('sources_item');
	if (sourcesItem !== null) {
		for (var i = 0; i < sourcesItem.length; i++) {
			sourcesItem[i].style.display = 'block';
			if (sourcesItem[i].getAttribute('data-id') === AUDIO_GEN_currentDevice.SOURCE) {
				AUDIO_GEN_setSourcesClick(sourcesItem[i]);
			}
		}
	}
	AUDIO_GEN_audioUPDclick = true;
	WEBAPP_updateVivaldiUSBandTunerData(AUDIO_GEN_currentDevice); // VER217 WANDA
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates USB and Tuner data
 * @param {object} device - the current device
 * @version VER217 - WANDA
 */
function WEBAPP_updateVivaldiUSBandTunerData(device)
{
	// DESCRIPTION
	var descriptionAudio = document.getElementById('descriptionAudio');
	if (descriptionAudio !== null) {
		descriptionAudio.innerHTML = '';
		if (parseInt(device.ONOFF) === 1) {
			// USB
			if (parseInt(device.SOURCE) === 11) {
				if (typeof device.USB_DIR !== 'undefined') {
					if (typeof device.USB_TRACK !== 'undefined') {
						descriptionAudio.innerHTML = device.USB_DIR + '\\' + device.USB_TRACK;
					} else {
						descriptionAudio.innerHTML = device.USB_DIR + '\\' + 'No file'
					}
				} else {
					if (typeof device.USB_TRACK !== 'undefined') {
						descriptionAudio.innerHTML = device.USB_TRACK;
					} else {
						descriptionAudio.innerHTML = 'No file';
					}
				}
			}
			// RADIO
			else if (parseInt(device.SOURCE) === 1) {
				if (typeof device.RDS_TEXT !== 'undefined') {
					if (typeof device.FM_FREQ !== 'undefined') {
						descriptionAudio.innerHTML = device.FM_FREQ + ' MHz - ' + device.RDS_TEXT;
					} else {
						descriptionAudio.innerHTML = device.RDS_TEXT;
					}
				}
			}
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Shows/hides the USBPlay/USBPause button
 * @param {object} element - the clicked element
 * @param {string} dataType - the data-type of the clicked element
 * @version VER202 - WANDA
 */
function WEBAPP_hideShowVivaldiPlayPause(element, dataType)
{
	if (dataType === 'USBPlay') {
		element.style.display = 'none';
		var comandiItemUSBPause = document.getElementById('comandiItemUSBPause');
		if (comandiItemUSBPause !== null) {}
		comandiItemUSBPause.style.display = 'inline-block';
	}
	if (dataType === 'USBPause') {
		element.style.display = 'none';
		var comandiItemUSBPlay = document.getElementById('comandiItemUSBPlay');
		if (comandiItemUSBPlay !== null) {
			comandiItemUSBPlay.style.display = 'inline-block';
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Adds eventListeners to VIVALDI audio elements
 * @version VER202 - WANDA
 */
function WEBAPP_addVivaldiEventListeners()
{
	// RADIO FREQUENCY
	var boxComandiVivaldi1ComandiItem = document.querySelectorAll('#boxComandiVivaldi1 .comandi_item');
	if (boxComandiVivaldi1ComandiItem !== null) {
		for (var i = 0; i < boxComandiVivaldi1ComandiItem.length; i++) {
			boxComandiVivaldi1ComandiItem[i].addEventListener('click', function (event) { VIVALDI_onClickRadioFrequency(event.currentTarget.getAttribute('data-cmd')); });
			if (!DISPLAY_isTS10 && !DISPLAY_isTSSMART_OLD && !DISPLAY_isTSSMART7_OLD) {
				boxComandiVivaldi1ComandiItem[i].addEventListener('pointerdown', function (event) { VIVALDI_handlePointerOrMouseDownOnRadioFrequency(event.currentTarget.getAttribute('data-cmd')); });
				boxComandiVivaldi1ComandiItem[i].addEventListener('pointerup', VIVALDI_handlePointerOrMouseUpOnRadioFrequency);
				boxComandiVivaldi1ComandiItem[i].addEventListener('pointerleave', VIVALDI_handlePointerleaveOrMousemoveOnRadioFrequency);
				boxComandiVivaldi1ComandiItem[i].addEventListener('pointercancel', VIVALDI_handlePointerleaveOrMousemoveOnRadioFrequency);
			} else if (DISPLAY_isTSSMART_OLD || DISPLAY_isTSSMART7_OLD) {
				boxComandiVivaldi1ComandiItem[i].addEventListener('touchstart', function (event) { VIVALDI_onTouchstartRadioFrequency(event, event.currentTarget.getAttribute('data-cmd')); });
				boxComandiVivaldi1ComandiItem[i].addEventListener('touchend', VIVALDI_onTouchendRadioFrequency);
				boxComandiVivaldi1ComandiItem[i].addEventListener('touchmove', function (event) { VIVALDI_onTouchmoveRadioFrequency(event); });
			} else if (DISPLAY_isTS10) {
				boxComandiVivaldi1ComandiItem[i].addEventListener('mousedown', function (event) { VIVALDI_handlePointerOrMouseDownOnRadioFrequency(event.currentTarget.getAttribute('data-cmd')); });
				boxComandiVivaldi1ComandiItem[i].addEventListener('mouseup', VIVALDI_handlePointerOrMouseUpOnRadioFrequency);
				boxComandiVivaldi1ComandiItem[i].addEventListener('mousemove', VIVALDI_handlePointerleaveOrMousemoveOnRadioFrequency);
			}
		}
	}
	// USB
	var boxComandiVivaldi11ComandiItem = document.querySelectorAll('#boxComandiVivaldi11 .comandi_item');
	if (boxComandiVivaldi11ComandiItem !== null) {
		for (var i = 0; i < boxComandiVivaldi11ComandiItem.length; i++) {
			boxComandiVivaldi11ComandiItem[i].addEventListener('click', function (event) { VIVALDI_USBCommandsHandler(event.currentTarget, event.currentTarget.getAttribute('data-type')); });
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* --------------------------------------------------------------------------- TUTONDO GUI -------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages sound source
 * @param {string} progressiveSource - progressive of the relevant source
 * @param {string} update - if the update is relative to the source status bitmap or it is relative to the text to visualize
 * @version VER217 - WANDA
 */
function WEBAPP_manageTutondoSoundSource(progressiveSource, update)
{
  var canUpdateText = false;
  // TUTONDO
  if (AUDIO_GEN_audioType === 1) {
		var sourcesItemActive = document.querySelector('.sources_item.active');
		if (sourcesItemActive !== null) {
			if (parseInt(progressiveSource) === parseInt(sourcesItemActive.getAttribute('data-index')) + 1) { // VER217 STEFANO & WANDA
				canUpdateText = true;
			}
		}
  }
  // BACKAUDIO
  else if (AUDIO_GEN_audioType === 2) {
    if (WEBAPP_actualDevice === update.substr(0, 1)) {  // VER166 WANDA
      canUpdateText = true;
    }
  }
  if (canUpdateText) {
		var descriptionAudio = document.getElementById('descriptionAudio');
    // TUTONDO
    if (AUDIO_GEN_audioType === 1) {
			if (descriptionAudio !== null) {
				descriptionAudio.innerHTML = update.trim();
			}
    }
    // BACKAUDIO
    else if (AUDIO_GEN_audioType === 2) {
      var text = new TextDecoder('gbk', { NONSTANDARD_allowLegacyEncoding: true }).decode(original_bytearray); // GBK is better than GB2312	
      text = text.substr(text.indexOf('#') + 1);
      text = text.substr(0, text.length - 4);
			if (descriptionAudio !== null) {
				descriptionAudio.innerHTML = text;
			}
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages the sound zone parameters
 * @param {string} state - status of the zone (0 = switched off, 1 = switched on)
 * @param {string} volumeValue - volume value
 * @param {string} bassValue - bass value
 * @param {string} highValue - high value
 * @param {string} balanceValue - balance value
 * @param {string} muteValue - status of mute (0 = not active, 1 = active)
 * @version VER205 - WANDA
 */
function WEBAPP_manageTutondoSoundZoneParameters(state, volumeValue, bassValue, highValue, balanceValue, muteValue)
{
	// ON and OFF and MUTE
	var comandiItem = document.querySelectorAll('.box_comandi_extra .comandi_item');
	if (comandiItem !== null) {
		for (var i = 0; i < comandiItem.length; i++) {
			// ON and OFF
			if (comandiItem[i].getAttribute('data-cmd') === 'on') {
				if ((state === '0' && comandiItem[i].classList.contains('active')) || (state === '1' && !comandiItem[i].classList.contains('active'))) {
					comandiItem[i].click();
				}
			}
			// MUTE
			if (comandiItem[i].getAttribute('data-cmd') === 'mute') {
				if ((muteValue === '1' && comandiItem[i].classList.contains('active')) || (muteValue === '0' && !comandiItem[i].classList.contains('active'))) {
					comandiItem[i].click();
				}
			}
		}
	}
	/* VER200 WANDA */
	// VOLUME
	var volumeSliderInput = document.getElementById('volumeSliderInput');
	if (volumeSliderInput !== null) {
		volumeSliderInput.value = volumeValue.toString();
	}
	// BASS
	var bassSliderInput = document.getElementById('bassSliderInput');
	if (bassSliderInput !== null) {
		bassSliderInput.value = bassValue.toString();
	}
	// TREBLE
	var hiSliderInput = document.getElementById('hiSliderInput');
	if (hiSliderInput !== null) {
		hiSliderInput.value = highValue.toString();
	}
	// BALANCE
	var balanceSliderInput = document.getElementById('balanceSliderInput');
  if (balanceSliderInput !== null) {
    balanceSliderInput.value = balanceValue.toString();
  }
	/* ------------ */
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Manages sound zone source
 * @param {string} sourceIndex - new source index associated to the zone
 * @version VER217 - WANDA
 */
function WEBAPP_manageTutondoSoundZoneSource(sourceIndex)
{
	var sourceItem = document.querySelector('.sources_item[data-index="' + (parseInt(sourceIndex) - 1) + '"]');
	sourceItem.click();
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates TUTONDO audio zones HTML
 * @param {string} zoneStatus - zone status (0 = switched off, 1 = switched on)
 * @param {string} zoneValue - zone current value 
 * @param {string} zoneBalanceValue - zone current balance
 * @param {string} zoneBassValue - zone current bass
 * @param {string} zoneHighValue - zone current high
 * @param {string} muteStatus - mute status (0 = switched off, 1 = switched on)
 * @version VER205 - WANDA
 */
function WEBAPP_loadTutondoAudioZones(zoneStatus, zoneValue, zoneBalanceValue, zoneBassValue, zoneHighValue, muteStatus)
{
	// ON and OFF and MUTE
	var comandiItem = document.querySelectorAll('.box_comandi_extra .comandi_item');
	if (comandiItem !== null) {
		for (var i = 0; i < comandiItem.length; i++) {
			if (comandiItem[i].getAttribute('data-cmd') === 'on' || comandiItem[i].getAttribute('data-cmd') === 'mute') {
				if (comandiItem[i].classList.contains('active')) {
					comandiItem[i].classList.remove('active');
				}
			}
			if ((comandiItem[i].getAttribute('data-cmd') === 'on' && zoneStatus === '1') || (comandiItem[i].getAttribute('data-cmd') === 'mute' && muteStatus === '0')) {
				comandiItem[i].classList.add('active');
			}
		}
	}
	// VOLUME
	var volumeSliderInput = document.getElementById('volumeSliderInput');
	if (volumeSliderInput !== null) {
		volumeSliderInput.value = zoneValue.toString();
	}
	var boxVolumeItemVolume = document.getElementById('boxVolumeItemVolume');
	if (boxVolumeItemVolume !== null) {
		boxVolumeItemVolume.style.display = 'block';
	}
	// TREBLE
	var hiSliderInput = document.getElementById('hiSliderInput');
	if (hiSliderInput !== null) {
		hiSliderInput.value = zoneHighValue.toString();
	}
	var boxVolumeItemHi = document.getElementById('boxVolumeItemHi');
	if (boxVolumeItemHi !== null) {
		boxVolumeItemHi.style.display = 'block';
	}
	// BASS
	var bassSliderInput = document.getElementById('bassSliderInput');
	if (bassSliderInput !== null) {
		bassSliderInput.value = zoneBassValue.toString();
	}
	var boxVolumeItemBass = document.getElementById('boxVolumeItemBass');
	if (boxVolumeItemBass !== null) {
		boxVolumeItemBass.style.display = 'block';
	}
	// BALANCE
	var balanceSliderInput = document.getElementById('balanceSliderInput');
	if (balanceSliderInput !== null) {
		balanceSliderInput.value = zoneBalanceValue.toString();
	}
	var balanceContainer = document.getElementById('balanceContainer');
	if (balanceContainer !== null) {
		balanceContainer.style.display = 'block';
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Loads TUTONDO audio source HTML
 * @param {object} record - XMLHTTP response tag element
 * @param {number} sourceActive - the active source
 * @version VER217 - WANDA
 */
function WEBAPP_loadTutondoAudioSources(record, sourceActive)
{
	var sourcesItem = document.getElementsByClassName('sources_item');
  if (sourcesItem !== null) {
    for (var i = 0; i < sourcesItem.length; i++) {
			sourcesItem[i].parentNode.removeChild(sourcesItem[i]);
    }
  }
	if (record !== null) {
		var htmlToAdd = '';
		for (var i = 0; i < record.length; i++) {
			// SOURCE PROGRESSIVE
			var sourceProgressive = '';
			if (typeof record[i].getElementsByTagName('dato0')[0] !== 'undefined') {
				sourceProgressive = record[i].getElementsByTagName('dato0')[0].innerHTML;
			}
			// SOURCE NAME
			var sourceName = '';
			if (typeof record[i].getElementsByTagName('dato1')[0] !== 'undefined') {
				sourceName = record[i].getElementsByTagName('dato1')[0].innerHTML;
			}
			// SOURCE TYPE
			var sourceType = '';
			if (typeof record[i].getElementsByTagName('dato2')[0] !== 'undefined') {
				sourceType = record[i].getElementsByTagName('dato2')[0].innerHTML;
			}
			htmlToAdd += '<div class="sources_item ico_source_' + sourceType + '" data-index="' + i + '" data-id="' + sourceProgressive + '" onclick="AUDIO_GEN_setSourcesClick(event.currentTarget)">'; // VER217 WANDA
			htmlToAdd += '<span>' + sourceName + '</span>';
			htmlToAdd += '</div>';
		}
		var boxSorgentiContainer = document.getElementById('boxSorgentiContainer');
		if (boxSorgentiContainer !== null) {
			boxSorgentiContainer.innerHTML = htmlToAdd;
		}
	}
	sourcesItem = document.getElementsByClassName('sources_item');
  if (sourcesItem !== null) {
    for (var i = 0; i < sourcesItem.length; i++) {
			sourcesItem[i].style.display = 'block';
			if (sourceActive === i) {
				if (!sourcesItem[i].classList.contains('active')) {
					sourcesItem[i].classList.add('active');
				}
				AUDIO_GEN_setComandiSorgenti(sourcesItem[i]);
			}
    }
  }
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Loads TUTONDO audio preset HTML
 * @version VER205 - WANDA
 */
function WEBAPP_loadTutondoAudioPreset()
{
	var boxPreset = document.getElementById('boxPreset');
	var htmlToAdd = '';
	if (boxPreset !== null) {
		for (var i = 0; i < 10; i++) {
			htmlToAdd += '<div class="presets_item ico_50" data-cmd="' + i + '">';
			htmlToAdd += '<span>' + i + '</span>';
			htmlToAdd += '</div>';
		}
		boxPreset.innerHTML += htmlToAdd;
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Adds event listeners to comandi_item elements
 * @version VER205 - WANDA
 */
function WEBAPP_comandiSuperSorgentiHandler()
{
	var boxComandiSuperSorgentiComandiItem = document.querySelectorAll('.box_comandi_supersorgenti .comandi_item');
	if (boxComandiSuperSorgentiComandiItem !== null) {
		for (var i = 0; i < boxComandiSuperSorgentiComandiItem.length; i++) {
			boxComandiSuperSorgentiComandiItem[i].addEventListener('click', function (event) { WEBAPP_clickOnTutondoComandiItemPresets(event.currentTarget); });
		}
	}
	var boxComandiSuperSorgentiPresetsItem = document.querySelectorAll('.box_comandi_supersorgenti .presets_item');
	if (boxComandiSuperSorgentiPresetsItem !== null) {
		for (var i = 0; i < boxComandiSuperSorgentiPresetsItem.length; i++) {
			boxComandiSuperSorgentiPresetsItem[i].addEventListener('click', function (event) { WEBAPP_clickOnTutondoComandiItemPresets(event.currentTarget); });
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Handler of the click event on comandi_item
 * @param {object} element - the clicked element
 * @version VER205 - WANDA
 */
function WEBAPP_clickOnTutondoComandiItemPresets(element)
{
	if (AUDIO_GEN_audioType !== 3) {
		var commandTemp = '';
		var sourceActive = document.querySelector('.sources_item.active');
		if (sourceActive !== null) {
			// AZIONE CORRETTIVA SEGNALAZIONE 21/35 ---> var tmpcmd = SendSourcesCommand + '&parameter=' + actual_device + ',';  // Veniva passato il numero di zona al posto della sorgente attiva
			commandTemp = AUDIO_GEN_sendSourcesCommand + '&parameter=' + (parseInt(sourceActive.getAttribute('data-index')) + 1) + ','; // VER217 WANDA
			var boxComandi2ComandiItem = document.querySelectorAll('#boxComandi2 .comandi_item');
			// PLAY - hide play and show pause
			if (element.getAttribute('data-cmd') === '45') {
				element.style.display = 'none';
				if (boxComandi2ComandiItem !== null) {
					for (var i = 0; i < boxComandi2ComandiItem.length; i++) {
						if (boxComandi2ComandiItem[i].getAttribute('data-cmd') === '44') {
							boxComandi2ComandiItem[i].style.display = 'inline-block';
						}
					}
				}
			}
			// PAUSE - hide pause and show play
			if (element.getAttribute('data-cmd') === '44') {
				element.style.display = 'none';
				if (boxComandi2ComandiItem !== null) {
					for (var i = 0; i < boxComandi2ComandiItem.length; i++) {
						if (boxComandi2ComandiItem[i].getAttribute('data-cmd') === '45') {
							boxComandi2ComandiItem[i].style.display = 'inline-block';
						}
					}
				}
			}
			// SHUFFLE
			if (element.getAttribute('data-cmd') === '46') {
				element.classList.toggle('active');
			}
			commandTemp += element.getAttribute('data-cmd');
			AUDIO_GEN_sendAudioCommand(commandTemp);
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* -------------------------------------------------------------------------- RGB WHEEL GUI ------------------------------------------------------------------------- */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Creates the RGBWHEEL HTML in box3
 * @param {object} device - object containing all the informations about the selected device
 * @version VER207 - WANDA
 */
function WEBAPP_contentIsRGB(device)
{
	var htmlToAdd = '';
	if (typeof device.id !== 'undefined' && typeof device.name !== 'undefined') {
		WEBAPP_actualDevice = device.id; // VER104 Stefano						  
		/* VER172 WANDA */
		var deviceName = device.name;
		if (deviceName[0] === '$') {
			deviceName = deviceName.substr(1);
		}
		if (deviceName[deviceName.length - 1] === '$') {
			deviceName = deviceName.substr(0, deviceName.length - 1);
		}
		/* ------------ */
		/* VER131 */
		var isRGBW = 0;
		if (typeof device.isRGBW !== 'undefined' && device.isRGBW === true) { // VER172 WANDA
			isRGBW = 1;
		}
		/* ------ */
		htmlToAdd = '<h1 class="isRGBW">' + deviceName + '</h1>'; // VER172 WANDA
		var request = new XMLHttpRequest;
		request.open('GET', 'webapps/webapp_legacy/rgb-dimmer.php?isRGBW=' + isRGBW + '&rnd=' + Math.random(), false); // 'false' makes the request synchronous --- VER218C WANDA
		request.send(null);
		if (request.readyState === 4) {
			if (request.status === 200) {
				window.isRgbwPageOpened = true;
				htmlToAdd += request.responseText;
				WEBAPP_initRGBWheel(); // VER207 WANDA
				var stage = document.getElementById('stage');
				if (stage !== null && stage.classList.contains('mapview') && typeof device.type !== 'undefined') {
					htmlToAdd += '<a class="ico_50 ico_rotateleft" onclick="WEBAPP_rotateDeviceFamily(' + device.type + ', -1, \'isVMCDaikinModBus\');">';
					htmlToAdd += '<span class="px-icon icon-elegant-arrow-carrot-left"></span>';
					htmlToAdd += '</a>';
					htmlToAdd += '<a class="ico_50 ico_rotateright" onclick="WEBAPP_rotateDeviceFamily(' + device.type + ', 1, \'isVMCDaikinModBus\');">';
					htmlToAdd += '<span class="px-icon icon-elegant-arrow-carrot-right"></span>';
					htmlToAdd += '</a>';
				}
				var box3 = document.getElementById('box3');
				if (box3 !== null) {
					box3.insertAdjacentHTML('beforeend', htmlToAdd);
				}
				/* VER172 WANDA */
				if (typeof device.isDALI !== 'undefined' && device.isDALI === true) {
					var isRGBWElement = document.querySelector('.isRGBW');
					if (isRGBWElement !== null) {
						isRGBWElement.style.color = '#3366ff';
					}
				}
				/* ------------ */
				if (DISPLAY_isTS10) {
					setTimeout('RGBWHEEL_addColorWheel();', 900);
				} else {
					setTimeout('RGBWHEEL_addColorWheel();', 300);
				}
				/* VER169 WANDA */
				if (DISPLAY_WBS_canApplyFullscreenStyleBasedOnUserAgent()) { // VER194 WANDA
				var box3h1 = document.querySelector('#box3 h1');
				if (box3h1 !== null) {
					box3h1.style.border = 'none';
				}
			}
			/* ------------ */
			} else {
				console.log('%c' + WEBAPP_PREFIX + 'contentIsRGB error ' + WEBAPP_CONSOLE_ERROR);
			}
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Creates RGBWHEEL HTML elements
 * @version VER207 - WANDA
 */
function WEBAPP_initRGBWheel()
{
	// CANVAS 1
	RGBWHEEL_hiddenCanvas = document.createElement('canvas');
	RGBWHEEL_hiddenCanvas.setAttribute('id', 'hiddenCanvas');
	RGBWHEEL_hiddenCanvas.setAttribute('width', '270');
	RGBWHEEL_hiddenCanvas.setAttribute('height', '200');
	RGBWHEEL_hiddenCanvas.addEventListener('click', function (event) { RGBWHEEL_clickOnHiddenCanvas(event); })
	// CANVAS 2
	RGBWHEEL_hiddenGrayScaleCanvas = document.createElement('canvas');
	RGBWHEEL_hiddenGrayScaleCanvas.setAttribute('id', 'hiddenGrayCanvas');
	RGBWHEEL_hiddenGrayScaleCanvas.setAttribute('width', '270');
	RGBWHEEL_hiddenGrayScaleCanvas.setAttribute('height', '200');
	RGBWHEEL_hiddenGrayScaleCanvas.style.position = 'absolute';
	// LOADS CANVAS IMAGES
	RGBWHEEL_imageToLoadColor = new Image();
	RGBWHEEL_imageToLoadColor.src = 'downloadedRgbWheelColor.png';
	RGBWHEEL_imageToLoadColor.onload = function ()
	{
		RGBWHEEL_imageToLoadGray = new Image();
		RGBWHEEL_imageToLoadGray.src = 'downloadedRgbWheelGray.png';
		RGBWHEEL_imageToLoadGray.onload = function () { RGBWHEEL_drawRGBWheels(); };
	};
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates the RGBWHEEL color preview
 * @param {string} rgbColorString - rgb value
 * @version VER207 - WANDA
 */
function WEBAPP_updateRGBColorPreview(rgbColorString)
{
	var colorPreview = document.getElementById('colorPreview');
	if (colorPreview !== null) {
		colorPreview.style.backgroundColor = rgbColorString;
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates the white indicator position
 * @param {number} percentage - the percentage value
 * @version VER207 - WANDA
 */
function WEBAPP_updateWhiteIndicatorPosition(percentage)
{
	var rgbwWhiteIndicator = document.getElementById('rgbwWhiteIndicator');
	if (rgbwWhiteIndicator !== null) {
		rgbwWhiteIndicator.style.left = parseInt((percentage * 200) / 100) - 100 + 'px';
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Adds wheels to canvas
 * @param {object} hiddenCanvas - colored wheel
 * @param {object} hiddenGrayScaleCanvas - gray wheel
 * @version VER207 - WANDA
 */
function WEBAPP_addRGBWheels(hiddenCanvas, hiddenGrayScaleCanvas)
{
	var colorWheelContainer = document.getElementById('colorWheelContainer');
	if (colorWheelContainer !== null) {
		var canvas = colorWheelContainer.getElementsByTagName('canvas');
		var wheelCanvasContainer = document.getElementById('wheelCanvasContainer');
		if (wheelCanvasContainer !== null && canvas !== null && canvas.length === 0) {
			wheelCanvasContainer.appendChild(hiddenCanvas);
			wheelCanvasContainer.appendChild(hiddenGrayScaleCanvas);
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Updates the RGB on off button
 * @param {string} text - text to write inside the RGB on off button
 * @version VER207 - WANDA
 */
function WEBAPP_updateRGBONOFFbutton(text)
{
	var rgbwOnOffButton = document.getElementById('rgbwOnOffButton');
	if (rgbwOnOffButton !== null) {
		rgbwOnOffButton.innerHTML = text;
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Writes the colour description
 * @param {string} rgbColorString - rgb value
 * @param {object} hsb - array containing hsb values 
 * @version VER207 - WANDA
 */
function WEBAPP_updateColorDescription(rgbColorString, hsb)
{
	var colorDescription = document.getElementById('colorDescription');
	if (colorDescription !== null) {
		colorDescription.innerHTML = 'RGB: ' + rgbColorString.toUpperCase() + '</br> H: ' + parseInt(hsb[0]) + ', S: ' + parseInt(hsb[1] * 100) + ', B: ' + parseInt(hsb[2] * 100);
		if (window.innerWidth <= window.innerHeight) {
			colorDescription.innerHTML = 'RGB: ' + rgbColorString.toUpperCase() + '&nbsp;&nbsp;&nbsp;H: ' + parseInt(hsb[0]) + ', S: ' + parseInt(hsb[1] * 100) + ', B: ' + parseInt(hsb[2] * 100);
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Shows or hides the color wheels
 * @param {object} hiddenCanvas - colored wheel
 * @param {object} hiddenGrayScaleCanvas - gray wheel
 * @param {string} text - 'ON' or 'OFF
 * @version VER207 - WANDA
 */
function WEBAPP_showHideColorWheel(hiddenCanvas, hiddenGrayScaleCanvas, text)
{
	if (text === 'ON') {
		hiddenCanvas.style.visibility = 'visible';
		hiddenGrayScaleCanvas.style.visibility = 'hidden';
	} else {
		hiddenCanvas.style.visibility = 'hidden';
		hiddenGrayScaleCanvas.style.visibility = 'visible';
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Sets the white percentage
 * @param {number} percentage - percentage value
 * @version VER207 - WANDA
 */
function WEBAPP_setWhiteChannelPercentage(percentage)
{
	var wChannelLabel = document.getElementById('wChannelLabel')
	if (wChannelLabel !== null) {
		wChannelLabel.innerHTML = 'Canale White (' + percentage + '%)';
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Checks if the innerHTML of rgbwOnOffButton is 'ON'
 * @returns true if the rgbwOnOffButton innerHTML is 'ON', false otherwise
 * @version VER207 - WANDA
 */
function WEBAPP_checkIfRGBONOFFbuttonIsON()
{
	var buttonIsON = false;
	var rgbwOnOffButton = document.getElementById('rgbwOnOffButton');
	if (rgbwOnOffButton !== null) {
		if (rgbwOnOffButton.innerHTML === 'ON') {
			buttonIsON = true;
		}
	}
	return buttonIsON;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Switches ON OFF the RGBW icon
 * @param {number} deviceID - the id of the device
 * @param {number} newStatus - the new status
 * @version VER207 - WANDA
 */
function WEBAPP_updateRGBIcon(deviceID, newStatus)
{
	// UPDATING ICON
	var menuIco = document.getElementById('menu_ico_' + deviceID);
	if (menuIco !== null && menuIco.getAttribute('rel') === '22') {
		menuIco.className = '';
		menuIco.classList.add('ico', 'ico22_' + newStatus);
	}
	// UPDATING STATUS
	for (var i = 0; i < DOMINAPLUS_MANAGER_deviceList.length; i++) {
		if (typeof DOMINAPLUS_MANAGER_deviceList[i].id !== 'undefined' && parseInt(DOMINAPLUS_MANAGER_deviceList[i].id) === parseInt(deviceID) && typeof DOMINAPLUS_MANAGER_deviceList[i].type !== 'undefined' && parseInt(DOMINAPLUS_MANAGER_deviceList[i].type) === 22) {
			DOMINAPLUS_MANAGER_deviceList[i].currentVal = newStatus;
		}
	}
	/* This part is useful only for mapmode */
	for (var i = 0; i < DOMINAPLUS_MANAGER_areaList.length; i++) { // VER132
		var mapCommand = null;
		if (typeof DOMINAPLUS_MANAGER_areaList[i].mapcommands !== 'undefined') {
			for (var j = 0; j < DOMINAPLUS_MANAGER_areaList[i].mapcommands.length; j++) { // VER134
				if (typeof DOMINAPLUS_MANAGER_areaList[i].mapcommands[j].deviceId !== 'undefined' && parseInt(DOMINAPLUS_MANAGER_areaList[i].mapcommands[j].deviceId) === parseInt(deviceID)) {
					mapCommand = DOMINAPLUS_MANAGER_areaList[i].mapcommands[j];
					break;
				}
			}
			if (mapCommand !== null && typeof mapCommand.commandId !== 'undefined' && typeof mapCommand.icoc !== 'undefined') {
				var mapCommandElement = document.querySelector('.mapcommand[data-mapcommandid="' + mapCommand.commandId + '"]');
				if (parseInt(newStatus) === 1) {
					if (typeof mapCommand.ico1 !== 'undefined') {
						mapCommand.icoc = mapCommand.ico1;
						if (mapCommandElement !== null) {
							mapCommandElement.style.backgroundImage = 'url(/DPClientData/icons/i' + mapCommand.ico1 + '.png)';
						}
					}
				}	else if (parseInt(newStatus) === 0) {
					if (typeof mapCommand.ico2 !== 'undefined') {
						mapCommand.icoc = mapCommand.ico2;
						if (mapCommandElement !== null) {
							mapCommandElement.style.backgroundImage = 'url(/DPClientData/icons/i' + mapCommand.ico2 + '.png)';
						}
					}
				}
			}
		}
	}
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Get current level visibility
 * @version VER254 - LORENZO
 */
function WEBAPP_getCurrentLevelVisibility()
{
	return WEBAPP_levelVisibility;
}

/**
 * Set the level visibility
 * @param {number} newLevel - the new level
 * @version VER254 - LORENZO
 */
function WEBAPP_setCurrentLevelVisibility(newLevel)
{
	WEBAPP_levelVisibility = newLevel;
}

/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */