/* ------------------------------------------------------------- LINGUA ------------------------------------------------------------- */
var lang              = "eng";
var langCode          = "en_US";
var lblLingue         = "Languages";
var lblChangeLanguage = "Change language";

/* ------------------------------------------------------------- DATA ------------------------------------------------------------- */
var sDays       				 = ",Mon,Tue,Wed,Thu,Fri,Sat,Sun";
var sDaysLong   				 = ",Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday";
var sMonths     				 = ",Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec";
var sMonthsLong 				 = ",January,February,March,April,May,June,July,August,September,October,November,December";
var lblData     				 = "Date";
var lblOra      				 = "Hour";
var lblChartsOrario      = "Hourly";
var lblOrario            = "Time";
var lbldaily    				 = "Daily";
var lblChartsGiornaliero = "Daily";
var lblweekly   				 = "Weekly";
var lblmonthly  				 = "Monthly";
var lblChartsMensile     = "Monthly";
var lblyearly   				 = "Yearly";
var lblChartsAnnuale     = "Annual";
var lblSecondi           = "seconds";
var lblSavingData        = "Saving new date...";
var lblSavedData         = "Date saved successfully";

/* ------------------------------------------------------------- VARIO ------------------------------------------------------------- */
var FamilyUrl   				 								= "xml/famiglie_en.xml";
var lblsi       				 								= "Yes";
var lblno       				 								= "No";
var lblTutte    				 								= "All maps";
var ModalitaMappa                       = "Map mode";
var lblEnvironmentsMode                 = "environments";
var lblAbilitaScorrimentoMappe          = "Maps Slider Enabled"; // VER116
var lblTuttiDispositivi  								= "All devices";
var lblDevice                           = "Device";
var lblDeviceMode                       = "devices";
var dispositivi_impianto 								= "Plant devices";
var ModalitaDispositivo                 = "Device mode";
var lblSelectDevice                     = "Select device";
var lblDevicesCategory                  = "Devices categories";
var lblNoDeviceSelected                 = "Select a device type from the left menu";
var lblNoDevicePresent                  = "No [tipo] device found";
var lblNoDeviceInMap                    = "No [tipo] device found in [mappa]";
var nussun_dispositivo_generico_inmappa = "No device found in [mappa]";
var lblNoDevicesPresent                 = "There are no devices for the selected map";
var lblDeviceIsOFF                      = "The device is turned off";
var lblFilterByEnvironment              = "filter by environment";
var lblFilterByDevice                   = "filter by device";
var lblApplyFilters                     = "apply filter";
var lblChiudi            								= "Close";
var lblIndietro          								= "Back";
var lblSalva             								= "Save";
var lblSalvato           								= "Saved";
var lblSaving                           = "Saving...";
var SalvataggioInCorso                  = "Change in progress";
var lblSavedSuccessfully                = "saved successfully";
var lblSalvatoError      								= "Saving error";
var lblConferma          								= "Confirm";
var lblScartareModifiche 								= "Changes have not been saved, proceed anyway?";
var lblAddress           								= "ADDRESS: ";
var lblAbilitato         								= "Enabled";
var lblDisabilitato      								= "Disabled";
var lblEsci             								= "Exit";
var servernonraggiungibile              = "Server unreachable";
var lblElimina                          = "Delete";
var lblServerIrraggiungibile            = "Connecting to server..."; // VER229 WANDA
var lblModalita                         = "Desktop View Mode";
var lblModalitaFrame                    = "With Frame";
var lblModalitaFull                     = "Without Frame";
var lblWebControlTestMode               = "Use HTTP instead of HTTPS"; // VER89 STEFANO --- VER91 added semicolon
var lblAnnulla                          = "Cancel";
var lblAccettaEProcedi                  = "ACCEPT AND PROCEED"; // VER111
var lblGoBackToLogin                    = "Go back to Login"; // VER201 WANDA
var lblCustomAlertText                  = "It is necessary to wait a few seconds before closing the page to make the new settings operational ...";
var lblCustomAlertTitle                 = "Please wait ...";
var lblLogout                           = "Logout";
var lblLoginInProgress                  = "Login in progress...";
var lblLogoutInProgress                 = "Logging out...";
var lblUsernameHouse                    = "House of";
var lblSwitchedON                       = "switched on";
var lblDoSwitchOFF                      = "switch off";
var lblDoSwitchON                       = "switch on";
var lblWaitingForInformations           = "Waiting for information";
var lblLoading                          = "Loading...";
var lblSetPercentage                    = "Percentage set: ";
var lblReadOnly                         = "Read only";
var lblAttention                        = "Attention";
var lblTotals                           = "totals";
var lblAvailable                        = "available";
var lblCopy                             = "copy";
var lblPaste                            = "paste";
var lblSettingsSystem                   = "Settings";
var lblEvent                            = "Event";
var lblNoEvents                         = "No events present";
var lblSetColor                         = "set color";

/* ------------------------------------------------------------- ILLUMINAZIONE ------------------------------------------------------------- */
var lblAllLighting  = "All the lights";
var lblLighting     = "Lighting";
var lblCurrentColor = "Current colour:";
var lblWhiteChannel = "White channel: ";

/* ------------------------------------------------------------- PRESE ------------------------------------------------------------- */
var lblAllEnergy       = "All the sockets";
var lblEnergy          = "Energy";
var lblNoEnergyPresent = "No power outlet type devices present";

/* ------------------------------------------------------------- INGRESSI ANALOGICI ------------------------------------------------------------- */
var lblAnalogInputs = "Analog inputs";

/* ------------------------------------------------------------- TASTIERA ------------------------------------------------------------- */
var lblTastiera 			 = "Keyboard";
var codiceUtenteErrato = "Wrong user code";
var assistenzaincorso  = "Support in progres...";

/* ------------------------------------------------------------- ANTIFURTO & ALLARMI ------------------------------------------------------------- */
var sAntifurtoNome                 = "Disabled,AVE AF998EXP,AVE AF949/AF999EXP,RISCO LIGHTSYS,AF927"; // VER99
var lblAree                        = "Areas";
var lblArea                        = "Area ";
var lblSensori                     = "Sensors";
var lblSensore                     = "Sensor";
var lblTastieraAntifurto           = "Insert Code";
var lblGestioneAree                = "Areas Management";
var lblTitoloAllarmi               = "Current alarm...";
var lblAntifurtoSelezionaAree      = "Selecte areas to insert/exclude";
var lblAntifurtoCodice             = "Insert User or Power User Code";
var btnAntifurtoAttiva             = "OK Proceed";
var lblAntifurtoInInserimento      = "Activation in progress...";
var lblAlarms                      = "Alarms";
var lblAntifurtoInserimentoOK      = "The alarm is armed...";
var lblAntifurtoInserimentoKO      = "Antitheft activation failure ... try again";
var lblAntifurto                   = "Antitheft Settings";
var lblSelezionaAree               = "Select area to engage:";
var lblAreaLibera                  = "Free";
var lblAreaImpegnata               = "Occupied";
var lblAreaInAllarme               = "Alarm";
var lblInAlarm                     = "in alarm";
var lblAreaInInserimento           = "Selected";
var lblAreaNonInInserimento        = "Not selected";
var lblAreaInserita                = "Engaged";
var lblTitoloSistemaChiamata       = "Tech alarms - Calls";
var lblLog                         = "Event Log";
var lblCallingSystemLog            = "Calling System Log";
var lblAntifurtoAF927              = "Antitheft AF927 Settings"; // VER124
var lblAntifurtoErroreCollegamento = "Connection Error";
var lblAntifurtoCodiceErrato       = "Wrong code";
var lblAntitheft                   = "Antitheft";
var lblAlternativeAntitheft        = "antitheft";
var lblAntitheftNotFound           = "Antitheft central not configured";
var lblAntitheftNoCommunication    = "Failure to communicate";
var lblGreenSensor                 = "Free sensor";
var lblRedSensor                   = "Unbalanced sensor";
var lblRedSensorWithMemory         = "Sensor in alarm memory";
var lblAlarmAndCallingSystem       = "Alarms / Calls";
var lblIFrameAntitheftError        = "You are accessing the burglar alarm control unit via cloud, but the system code of this home automation supervisor is not set as the main system for the connected burglar alarm control unit" // VER230 WANDA
var lblSilenceAlarm                = "silence";

// ANTITHEFT EVENTS - VER97
var descrizioniEventi = [
	"Vox OK",        			    // 0
	"Vox KO",                    // 1
	"In SMS OK",                 // 2
	"Out SMS OK",                // 3
	"Out SMS KO",                // 4
	"Out SMT OK",                // 5
	"Out SMT KO",                // 6
	"Out SMP OK",                // 7
	"Out SMP KO",                // 8
	"Out SMC OK",                // 9
	"Out SMC KO",                // 10
	"Out VIG OK",                // 11
	"Out VIG KO",                // 12
	"Out VIG TOUT",              // 13
	"Out VIG BUSY",              // 14
	"Out VOX OK",                // 15
	"Out VOX KO",                // 16
	"Out VOX TOUT",              // 17
	"Out VOX BUSY",              // 18
	"RUB UPD",                   // 19
	"PGM",                       // 20
	"DEL",                       // 21
	"Engagement",                // 22
	"Disengagement",             // 23
	"Alarm",                     // 24
	"Bat KO",                    // 25
	"Tamper",                    // 26
	"Spv KO",                    // 27
	"Alarm end",                 // 28
	"Door",                      // 29
	"Serv",                      // 30
	"FServ",                     // 31
	"TouchScreen Connection",    // 32
	"TouchScreen Disconnection", // 33
	"Power KO",                  // 34
	"Power OK",                  // 35
	"Antimask",                  // 36
	"DateTime",                  // 37
	"Anom",                      // 38
	"Telegest",                  // 39
	"Access",                    // 40
	"Various",                   // 41
	"PreAlarm",                  // 42
	"DoorClose",                 // 43
	"Out MMS OK",                // 44
	"Out MMS KO",                // 45
	"N"                          // 46
];

/* ------------------------------------------------------------- TERMOREGOLAZIONE ------------------------------------------------------------- */
var lbl_Temp_ril                   = "Current temperature";
var lblSetTemperature              = "Set temperature";
var lbl_Temp_imp                   = "Set temperature";
var lbl_Fan                        = "Fan speed";
var lblThermostatChangeSeasonTit   = "Season change";
var lblThermostatChangeSeason      = "Swiching all zones?";
var lblThermostatAll               = "YES, all";
var lblThermostatCurrent           = "Only current";
var lblMinMaxNonValido             = "The values entered are not valid.";  // VER71
var lblIsteresi                    = "Hysteresis";
var lblDeltaVelocita               = "Delta Speed";
var lblAntigelo                    = "Antifrost";
var lblCorrezioneTemperatura       = "Temp. Correction";
var lblThermoregulation            = "Thermoregulation";
var lblActive                      = "Active";
var lblInactive                    = "Idle";
var lblSummer                      = "Summer";
var lblWinter                      = "Winter";
var lblSeason                      = "season";
var lblMode                        = "mode";
var lblPowerONOFF                  = "on/off";
var lblKeyboardLock                = "lock";
var lblAutomatic                   = "automatic";
var lblManual                      = "manual";
var lblRelativeHumidityValue       = "Relative humidity: ";
var lblHumidityValue               = "Humidity value: ";
var lblThresholds                  = "thresholds";
var lblSoglia                      = "Threshold enabled";
var lblSogliaValore                = "Value";
var lblSogliaNonValida             = "Highlighted threshold values are not allowed";
var lblDetectedValue               = "Detected value: ";
var lblThresholdSettings           = "Threshold setting";
var lblThresholdNotValid           = "Invalid threshold values";
var lblThermalProfileSaved         = "Thermal profile saved successfully";
var lblThermostatInManual          = "in manual";
var lblThermostatInAutomatic       = "in automatic";
var lblThermostatCooling           = "in cooling";
var lblThermostatHeating           = "in heating";
var lblThermostatBlocked           = "in block";
var lblThermostatUnblocked         = "not blocked";
var lblThermalProfileAdvancedSaved = "Advanced settings saved successfully";

/* ------------------------------------------------------------- CONSUMI & GRAFICI ------------------------------------------------------------- */
var lblContabilizzatoreConsumi 					 = "Consumption counter";
var lblConsumoAttuale          					 = "Current consumption";
var lblContatoreContatori      					 = "Consumption counters";
var lblImpostazMoltiplicatori  					 = "Multipliers Settings";
var settings_lblCounter1M      					 = "Counter 1 Multiplier";
var settings_lblCounter2M      					 = "Counter 2 Multiplier";
var settings_lblEnergyC        					 = "Energy Cost";
var settings_lblCounter1C      					 = "Counter 1 Cost";
var settings_lblCounter2C      					 = "Counter 2 Cost";
var lblCharts                  					 = "Charts";
var lblChart                   					 = "Graphic";
var lblPowerAverageW           					 = "Power average [W]";
var lblConsumedEnergyW         					 = "Consumed energy [KWh]";
var lblConsumedEnergy          					 = "Consumed energy";
var lblEnergyChart             					 = "Energy";
var lblPowerChart              					 = "Power";
var lblRete                    					 = "Network";
var lblProduzione              					 = "Production";
var lblConsumo                 					 = "Consumption";
var lblEcoUnreachable          					 = "The economizer could not be reached.<br>Please try again later.";
var lblConsumption             					 = "Consumption";
var lblLoads                   					 = "Loads";
var lblPlantManagement         					 = "Plant management";
var lblEconomizerChart         					 = "Economizer performance";
var lblConsumptionTrend        					 = "Consumption trend";
var lblEcoPowerTitle           					 = "Power average (Watts) [W]";
var lblEcoEnergyTitle          					 = "Energy [KWh]";
var lblEcoDrawn                					 = "Drawn";
var lblEcoInjected             					 = "Injected";
var lblEcoProduced             					 = "Produced";
var lblEcoUsed                 					 = "Used";
var lblEcoDrawnTitle           					 = "Energy drawn";
var lblEcoInjectedTitle        					 = "Energy injected";
var lblEcoProducedTitle        					 = "Energy produced";
var lblEcoUsedTitle            					 = "Energy used";
var lblControlledLoadStatus    					 = "Controlled load status";
var lblDetachmentThreshold     					 = "Detachment threshold: ";
var lblEconomizer              					 = "Economizer";
var lblNoLoads                 					 = "No load configured";
var lblFailedLoadingLoads      					 = "The load configuration data associated with the economizer could not be retrieved";
var lblSavedLoads              					 = "Load settings saved correctly";
var lblLoadsTooQuick                     = "It is necessary to wait a few seconds for the economizer type identification to be completed.<br>Please try again in a few seconds.";
var lblLoadsProtectionThreshold          = "Protection threshold: ";
var lblLoadsAllLoads                     = "All loads";
var lblEcoLoadStatusDisabled             = "DISABLED";
var lblEcoLoadStatusEnabled              = "ENABLED";
var lblEcoLoadStatusDetached             = "DETACHED";
var lblEcoLoadStatusForced               = "FORCED";
var lblEcoLoadStatusBlocked              = "BLOCKED";
var lblEcoLoadStatusAutoblocked          = "AUTO-BLOCKED";
var lblEcoLoadStatusAttachedWithTimer    = "ATTACHED WITH TIMER";
var lblEcoLoadStatusAttachedWithoutTimer = "ATTACHED";
var lblEcoLoadStatusProtected            = "PROTECTED";
var lblNoLoadOnLine                      = "No load present on the line ";
var lblDrawnPower                        = "Power drawn";
var lblInjectedPower                     = "Power injected";
var lblWithdrawal                        = "Withdrawal";
var lblPhaseThreshold                    = "Phase threshold";
var lblPlantThreshold                    = "Plant threshold";
var lblAutoconsumption                   = "Self-consumption load status";
var lblAttachmentThreshold               = "Attack threshold";

/* ------------------------------------------------------------- SERRAMENTI ------------------------------------------------------------- */
var lblChiuduraSerramenti 	= "Wait for the update of the status icon to verify the correct execution of the command";
var lblAllShutter         	= "All the shutters";
var lblShutters           	= "Windows and doors";
var lblCloseShutter       	= "close";
var lblOpenShutter        	= "open";
var lblON                   = "open";
var lblOpen               	= "Open";
var lblInMovementUP         = "Opening";
var lblClosed               = "Closed";
var lblInMovementDOWN       = "Closing";
var lblIntermediatePosition = "Intermediate position";
var lblShutterDown          = "lower";
var lblShutterUp            = "raise";

/* ------------------------------------------------------------- SETTINGS ------------------------------------------------------------- */
var lblSettingsMenu          		 = "Settings Menu";
var lblImpostazioniDataOra   		 = "General Settings";
var lblConfigScenari         		 = "Scenario Configuration";
var lblProgammOrario         		 = "Scheduled Task";
var lblCalibrazione          		 = "Calibration";
var lblRiavvia               		 = "Restart device";
var lblVideoCitofonia        		 = "Intercom";
var lblAssistenza            		 = "Support";
var lblchangepass            		 = "Change Password";
var lblMenu                  		 = "Menu";
var lblMqtt                  		 = "Voice commands";
var lblConfigurazione        		 = "Settings";
var lblParametersTest        		 = "Parameter test";
var lblAdvancedInfo          		 = "Advanced information";
var lblSupervisorStatus      		 = "Supervisor status";
var lblSoftwareVersions      		 = "Software versions";
var lblPlantStatus           		 = "Plant status";
var lblSoftwareProcessStatus 		 = "Software process status";
var lblAdvancedSettings      		 = "Advanced settings";
var lblSettingsSavedSuccessfully = "Settings saved successfully";
var lblInstallerMode             = "Installer mode";
var lblTestingInProgress         = "Testing in progress...";
var lblExternal                  = "Installer Settings";
var lblUpdateWBS								 = "Software update";
var lblUpdateWBStext             = "Upload the update UPD file to your device";
var lblUpdating                  = "File transfer in progress...";
var lblErrorUploading            = "Error loading update file.";
var lblUnzipUpgradeWrong         = "UPD file not compatible with current device";
var lblUpgradeWBSsuccess         = "Update successful";
var lblErrorUnzippingWBS         = "Update file unzip error.";
var lblApplyingUpdate            = "Applying update... (may take about a minute)";
var lblReload                    = "Reload page";
var lblUpdateDB                  = "Database update";
var lblUpdateDBtext              = "Upload the ZIP file to your device";
var lblDownloadDB                = "Download database";

/* ------------------------------------------------------------- AVECLOUD ------------------------------------------------------------- */
var lblremote             	  = "AVE Cloud";
var lblWebControl         	  = "AVECloud enable";
var lblWebControlCode     	  = "Plant code";
var lblWebControlPassword 	  = "Plant password";
var lblRemotePort         	  = "Websocket port for remote connection";
var WebControlEmptyError  	  = "Plant code and password must be at list 1 character";
var WebControlCharError   	  = "Plant code and password can't contain \"?\" e \"&\"";
var lblCloudDateTimeInput 	  = "Enable automatic alignment function with AVECloud";
var lblCloudDateTimeInputNP   = "The automatic alignment function to AVECloud is only available for timezone Europe/Rome";
var lblSavedCloudSuccessfully = "Cloud settings saved successfully";

/* ------------------------------------------------------------- AUDIO ------------------------------------------------------------- */
var lblPause     = "Pause";
var lblZonaAudio = "Audio zone";
var lblSorgenti  = "Sources";
var lblAllAudio  = "All the audio zones";
var lblAudio     = "Audio";

/* ------------------------------------------------------------- SCENARI ------------------------------------------------------------- */
var comandi_scenario     		 		 = "Scenario commands";
var txtNonDisponibile    		 		 = "Scenario settings functionality is available only on Desktop and Landscape Tablet layout.";
var lblOrarioAvvio       		 		 = "Start time";
var lblSalvaScenario     		 		 = "Save scenario";
var lblSalvaComando      		 		 = "Save command";
var lblSelezionaComando  		 		 = "Select command to execute:";
var lblRitardaEsecuzione 		 		 = "Execution delay: ";
var lblEseguiScenario    		 		 = "Execute scenario:";
var lblModalitaEsecuzione    		 = "Execution mode";
var lblPrima                 		 = "Before";
var lblDopo                  		 = "After";
var lblAlba                  		 = "Sunrise";
var lblTramonto              		 = "Sunset";
var lblSchedulerErrorMessage 		 = "You must select at least one day of the week and one month of the year!";
var lblEliminaProgrammazioneTit  = "Delete Scheduled Task";
var lblEliminaProgrammazioneText = "Confirm the deletion of the current schedule";
var lblScenariosMode             = "scenarios";
var lblScenarios                 = "Scenarios";
var lblStop                      = "stop";
var lblRun                       = "run";
var lblNotRunning                = "Not running";
var lblRunning                   = "Running...";
var lblScenesAndScenarios        = "Scenarios";
var lblScenariosAvailable        = "Available scenarios";
var lblSelectScenario            = "Select scenario";
var lblNoScenarioPresent         = "No scenarios present";
var lblNoProgramScenarioPresent  = "No programming present";
var lblSchedulerSaved            = "Scheduler saved!<br />Loading scenarios...";
var lblNoCommandSet              = "No action set";
var lblAction                    = "action";
var lblScenarioActions           = "Scenario actions";
var lblSelectScenarioAction      = "Select the command to execute for the current action";
var lblSaveAction                = "Save action";
var lblActionSavedSuccessfully   = "Action saved successfully";
var lblScenario                  = "Scenario";

/* ------------------------------------------------------------- TELECAMERE ------------------------------------------------------------- */
var configurazioneTelecameraErrata = "Missing or wrong camera settings";

/* ------------------------------------------------------------- GESTIONE UTENTI ------------------------------------------------------------- */
var lblPasswordUser           = "Username";
var lblPasswordCurrent        = "Current password";
var lblPasswordNew            = "New password";
var lblPasswordConfirm        = "Confirm password";
var PasswordEmptyError        = "Username and password must be at list 1 character";
var PasswordConfirmError      = "Confirm password does not match";
var PasswordCharError         = "Username and password can't contain \"?\" e \"&\"";
var lblManageUser             = "Manage user";
var lblManageUsers            = "Manage users";
var lblVisibleMapsNumber      = "Total visible maps:";
var lblVisibleMaps            = "Map list";
var lblActiveUsers            = "Active:";
var lblRemoveUser             = "User deletion";
var lblRemoveUserMessage      = "Are you sure you want to delete the user?";
var lblUserAlreadyExisting    = "Username already in use";
var lblEmptyUsername          = "Usernames must be at least one character";
var lblEmptyPassword          = "Passwords must be at least one character";
var lblUsernameNotValid       = "Username cannot contain the characters '?' and '&'";
var lblPasswordNotValid       = "Password cannot contain the characters '?' and '&'";
var lblVisibleMapsEmpty       = "Please select at least one map per user";
var lblUserRemoved            = "User removed";
var lblVisibleMapsPointerOver = "Last viewed map";
var lblClearFile              = "TSSMART management";
var lblClearFileTitle         = "Connected TSSMART devices";
var lblClearFileMessage       = "Do you want to clean the TSSMART access file?";
var lblClearFileButton        = "Disconnect all TSSMART";
var lblFileCleared            = "TSSMART users have been deleted";
var lblUsersCorrectlySaved    = "User settings saved successfully";

/* ------------------------------------------------------------- INFORMAZIONI SISTEMA ------------------------------------------------------------- */
var lblInformazSistema 			 = "System Information";
var lblAdvanced        			 = "Device information";
var lblBasic           			 = "Network information";
var lblDhcp            			 = "DHCP";
var lblIndirizzoIP     			 = "IP address";
var lblSubnetMask      			 = "Subnet mask";
var lblGateway         			 = "Gateway";
var lblDnsPrim         			 = "Primary DNS";
var lblMonitoring      			 = "Diagnostics";
var MonitoringDisclaimerText = "By enabling the \"diagnostics service\" I hereby authorize AVE S.P.A. to perform remote control services on the WebServer unit installed in my system. AVE s.p.a. will only monitor the correct functioning of the software installed on the WebServer unit without collecting any sensitive data nor interact with other devices that may be connected on the customer's network. AVE s.p.a. will not disclose any information collected by the monitoring to third parties. The remote control service does not obligate AVE s.p.a. to intervene on the system in any way. Any action considered necessary for the good functioning of the system or finalized to the update of the software or to add new functions, will be previously communicated to the customer and performed only after your acceptance.";
var MonitoringAccept         = "Accept";
var MonitoringRefuse         = "Refuse";
var lblUptime              	 = "Uptime";
var lblMemoria             	 = "Memory";
var lblCF                  	 = "CF";
var lblTemperatura         	 = "Temperature";
var lblSistemaOperativo    	 = "Operating System";
var lblVersioniApp         	 = "App Versions";
var lblAveBus              	 = "AveBus";
var lblCentraleAntif       	 = "Antitheft Central";
var lblCentraleAudio       	 = "Audio Central";
var lblLAN                 	 = "LAN";
var lblRemotizzazione      	 = "Web control";
var lblH264                	 = "H264";
var lblLauncher            	 = "Launcher";
var lblDpServer            	 = "DPServer";
var lblDpClient            	 = "DPClient";
var lblResetServer         	 = "Reset Server";
var lblmodbastcp           	 = "ModBus TCP";
var lblverfirmware         	 = "AVEBus Firmware";
var lblClientVersion         = "Client version";

/* ------------------------------------------------------------- EASYCONFIG ------------------------------------------------------------- */
var lblInstallaEasyconfig        = "Easyconfig Installation";
var lblInstallaEasyconfigText    = "Upload on device the UPD installation file";
var lblSelezionaFile             = "Choose file";
var lblInstallatoIncorso         = "Easyconfig installation in progress...";
var lblInstallatoCorrettamente   = "Easyconfig installed succesfully.";
var lblInstallazioneErroreUpload = "Error uploading installation file.";
var lblInstallazioneErroreFile   = "Invalid Easyconfig installation file.";
var lblInstallazioneExtNotValid  = "Invalid file extension.";
var lblInstallazioneUploadAFile  = "Allowed file extension";
var lblEnterEasyconfig           = "EasyConfig";
var lblInstallEasyconfig         = "EasyConfig";
var lblEasyConfigOldChrome       = "Not compatible with the operating system version of this TS-SMART touchscreen device";

/* ------------------------------------------------------------- AVANZATE ------------------------------------------------------------- */
var lblAdvancedGeneralSettings = "Advanced";
var lblAdvancedPollingSpeed    = "AF927 burglar alarm central polling rate";
var lblAdvancedProtocolVersion = "Voice command protocol version";
var lblAdvancedABLightMode     = "Forcing ABLight mode";
var lblAdvancedABDimTime       = "Ramp time customized for ABDim";
var lblAdvancedABLightTime     = "Custom ramp time for ABLight managed devices";

/* ------------------------------------------------------------- CONTROLLO ACCESSI ------------------------------------------------------------- */
var lblAccessManagement               			     			 = "Access management" // VER272 WANDA
var lblAccessHistory                  			     			 = "Access control"; // VER225 LORENZO
var lblAccessHistoryLast50            			     			 = "Access history (last 50)";
var lblAccessManagerGestioneTastiere  			     			 = "Keypad manager";
var lblAccessManagerColumnDateTime    			     			 = "Date and time";
var lblAccessManagerColumnCodeUID     			     			 = "Code/UID";
var lblAccessManagerColumnDesc        			     			 = "Description";
var lblAccessManagerColumnWhere       			     			 = "Where";
var lblAccessManagerTastiereApriporta 			     			 = "Opener keypads";
var lblAccessManagerCodiciAbilitati   			     			 = "Enabled codes and cards";
var lblAccessManagerTastiereAssociate 			     			 = "Associated keypads";
var lblAccessManagerCodiciAssociati   			     			 = "Associated codes and cards";
var lblAccessManagerChiaveNumerica    			     			 = "Numeric keycode";
var lblAccessManagerNuovoCodice       			     			 = "New keycode";
var lblAccessManagerEliminaCodice     			     			 = "Delete keycode";
var lblAccessManagerDisassociaCodice  			     			 = "Remove code association";
var lblAccessManagerCifre             			     			 = "digits";
var lblAccessManagerWrongCode         			     			 = "The code entered is not valid!";
var lblAccessManagerNessunaSelezione  			     			 = "No keypad selected!";
var lblAccessManagerCodiceEsistente   			     			 = "The code entered is already present!";
var lblAccessManagerConfirmDelete     			     			 = "Are you sure you want to permanently delete the code?";
var lblAccessManagerConfirmDeleteAssociation     			 = "This operation will not erase the code but will simply remove the association between the code and the keypad. Proceed?";
var lblAccessHistoryConfirmDeleteAllLogs         			 = "All access logs will be deleted. Continue?";
var lblAccessHistoryNoKeypad                     			 = "<br>No keypad configured.<br><br>Adding new keypads is available in the EasyConfig section<br><br>";
var lblAccessHistoryConflictHVAC                 			 = "<br>In the database there is an integration with Modbus HVAC air conditioners on RS485.<br><br>It is not possible to use Modbus keyboards and Modbus RS485 air conditioners at the same time.<br><br>";
var lblAccessManagerInizioValidita               			 = "Validity start date";
var lblAccessManagerFineValidita                 			 = "Validity end date";
var lblAccessManagerFasceOrarie                  			 = "Time slots";
var lblAccessManagerDurataEFasceOrarie           			 = "Duration and time slots";
var lblAccessManagerErroreRangeDate              			 = "Error entering dates or time slots!";
var lblAccessManagerMaxShots                     			 = "Number of entrances";
var lblAccessManagerChooseNew                    			 = "Choose what you want to add";
var lblAccessManagerConfirmDeleteCard            			 = "Are you sure you want to permanently delete the CARD?";
var lblAccessManagerConfirmDeleteAssociationCard 			 = "This operation will not delete the CARD but will simply remove the association between the CARD and the keypad. Proceed?";
var lblAccessManagerCardAcquireSelect            			 = "Select the keypad for acquiring";
var lblAccessManagerCardAcquireWait4card         			 = "Waiting for CARD...";
var lblAccessManagerCardAcquireError             			 = "An error occurred during acquisition";
var lblAccessManagerConfirmOpenDoorTitle         			 = "Open the door?";
var lblAccessManagerCleanUpConfirm               			 = "Remove the following numeric codes and cards?";
var lblAccessManagerCleanUpExpiredCodeValidTo    			 = "Codes expired due to end of validity";
var lblAccessManagerCleanUpExpiredCardValidTo    			 = "Cards expired due to end of validity";
var lblAccessManagerCleanUpCodeNoCredit          			 = "Codes with access number exhausted";
var lblAccessManagerCleanUpCardNoCredit          			 = "Cards with access number exhausted";
var lblAccessManagerModificaCodice               			 = "Edit keycode";
var lblAccessManagerNuovaCard                    			 = "Add new CARD";
var lblAccessManagerModificaCard                 			 = "Edit CARD";
var lblAccessManagerEliminaCard                  			 = "Delete CARD";
var lblAccessManagerDisassociaCard               			 = "Unlink CARD";
var lblAccessManagerKeypadInAcquireModeAlert     			 = "A keypad is in acquiring mode!";
var lblAccessManagerEliminaLog                   			 = "LOG remove";
var lblAccessManagerVisualizzaPwd                			 = "Show sensitive data";
var lblAccessManagerStanza                       			 = "Room";
var lblAccessManagerPiano                        			 = "Floor";
var lblAccessManagerLocaleServizio               			 = "Reserved area";
var lblAccessManagerAreaComune                   			 = "Common area";
var lblAccessManagerAreaPagamento                			 = "Payment area";
var lblAccessManagerControlloAccessi             			 = "Access control";
var lblAccessManagerTipoCliente                  			 = "CLIENT";
var lblAccessManagerTipoCameriera                			 = "CHAMBERMAID";
var lblAccessManagerTipoManutentore              			 = "MAINTENANCE";
var lblAccessManagerTipoSicurezza                			 = "SECURITY";
var lblAccessManagerTipoSuperCliente             			 = "SUPER CLIENT";
var lblAccessManagerTipoMaster                   			 = "MASTER";
var lblAccessManagerTipoSubMaster                			 = "SUBMASTER";
var lblAccessManagerTipoEraser                   			 = "ERASER";
var lblAccessManagerAperturaPortaDaPaginaWeb     			 = "Door opened from WEB/APP";
var lblAccessManagerLogMaxLimit                  			 = "Warning: storage space running out.<br>The system will continue to function but the oldest logs will be gradually deleted.<br />Download and then delete the logs to no longer display this message.";
var lblTuttiGiorni                               			 = "Everyday";
var lblAccessManagerLocalCheck                   			 = "LOCAL DEVICE CHECKS";
var lblAccessManagerRemoteCheck                  			 = "REMOTE CHECKS";
var lblAccessManagerLocalCheckBlacklist          			 = "1. Check Blacklist";
var lblAccessManagerLocalCheckClientePresente    			 = "2. Check Guest present";
var lblAccessManagerLocalCheckAccessData         			 = "3. Check Access data";
var lblAccessManagerLocalCheckScadenza           			 = "4. Check Expiring date";
var lblAccessManagerLocalCheckFasceOrarie        			 = "5. Check Time slots";
var lblAccessManagerLocalCheckCrediti            			 = "6. Check Shots";
var lblAccessManagerLocalCheckWriteOperation     			 = "7. Check Data writing";
var lblAccessManagerLocalCheckTimeoutSupervisorRequest = "8. Supervisor validation request";
var lblAccessManagerRemoteCheckBlacklist               = "9. Check Blacklist";
var lblAccessManagerRemoteCheckClientePresente                  = "10. Check Guest present";
var lblAccessManagerRemoteCheckAccessData              = "11. Check Access data";
var lblAccessManagerRemoteCheckScadenza                = "12. Check Expiring date";
var lblAccessManagerRemoteCheckFasceOrarie             = "13. Check Time slots";
var lblAccessManagerRemoteCheckCrediti                 = "14. Check Shots";
var lblAccessManagerConfirmOverwriteCard               = "CARD already present in the system.<br>If you choose to overwrite it, the contents of the CARD will be lost.";
var lblAccessManagerOverwrite                          = "Overwrite";

/* ------------------------------------------------------------- GUI ------------------------------------------------------------- */
var lblGoToNewGUI              = "View new interface"; // VER236 WANDA
var lblGUI                     = "Graphical Interface";
var lblGUI_interfaceAndTheme   = "Graphic style and theme";
var lblGUI_portraitStyle       = "Preview style";
var lblGUI_environmentStyle    = "Environment style";
var lblGUI_extra               = "Advanced options";
var lblGUI_legacy              = "CLASSIC";
var lblGUI_light               = "LIGHT";
var lblGUI_teal                = "TEAL";
var lblGUI_dark                = "DARK";
var lblGUI_portraitDefault     = "ADAPTIVE";
var lblGUI_portraitSingle      = "SINGLE COLUMN";
var lblGUI_portraitDouble      = "DOUBLE COLUMN";
var lblGUI_images              = "WITH BACKGROUND";
var lblGUI_minimal             = "MINIMAL";
var lblGUI_thermostats         = "Style of thermostats";
var lblGUI_thermostatsAdaptive = "ADAPTIVE";
var lblGUI_thermostatsSquare   = "SQUARES";
var lblGUI_thermostatsRound    = "ROUNDS";
var lblGUI_sameHeight          = "uniform device size";
var lblGUI_clickOnDevice       = "click on entire device area";
var lblGUI_grouping            = "device grouping";
var lblGUI_legacyMapView       = "map display";
var lblGUI_shadow              = "shading";
var lblGUI_iot                 = "developer details";
var lblGUI_loading             = "Application in progress...";
var lblGUI_TSSMARTmessage      = "To change the graphics settings on this TS-SMART device you need to go to the appropriate 'Display' menu in the settings of the device's home page.";
var lblGUI_appMessage          = "To change the graphics settings on this device you need to go to the appropriate 'Home Automation Options' menu in the settings of the device's home page.";
var lblLightTheme              = "Light Theme";
var lblTealTheme               = "Teal theme";
var lblDarkTheme               = "Dark theme";
var lblLegacyTheme             = "Legacy theme";
var lblOldChromeMessage        = "The operating system version of this TS-SMART touchscreen device does not support LIGHT, TEAL and DARK themes.<br><br>To continue browsing you need to set the 'CLASSIC' theme.";

/* ------------------------------------------------------------- HOTEL - CHECKIN - CHECKOUT ------------------------------------------------------------- */
var lblCheckInManagement                     				 		 	 = "Attendance Management";
var lblSettingsHotelRoom                     				 		 	 = "Room";
var lblSettingsHotelRooms                    				 		 	 = "Rooms";
var lblSettingsHotelCommonArea               				 		 	 = "Common area";
var lblSettingsHotelCommonAreas              				 		 	 = "Common areas";
var lblSettingsHotelPaidArea                 				 		 	 = "Paid area";
var lblSettingsHotelPaidAreas                				 		 	 = "Paid areas";
var lblSettingsHotelFreeTypology             				 		 	 = "No access control";
var lblSettingsHotelServiceArea              				 		 	 = "Service room";
var lblSettingsHotelServiceAreas             				 		 	 = "Service rooms";
var lblSettingsHotelEnvironment              				 		 	 = "Environment";
var lblSettingsHotelType                     				 		 	 = "Type";
var lblSettingsHotelLogicalAddress           				 		 	 = "AVEbus address";
var lblSettingsHotelProgressive              				 		 	 = "Progressive hotel";
var lblSettingsHotelPlantInfo                				 		 	 = "System configuration";
var lblSettingsHotelEnvironmentConfiguration 				 		 	 = "Environment configuration";
var lblSettingsHotelMasterCardCode           				 		 	 = "Master Card Code";
var lblSettingsHotelMasterCardCodeHelp       				 		 	 = "Field modifiable only with MASTER type AVE cards";
var lblSettingsHotelSubPlant                         		 	 = "Sub-Plant";
var lblSettingsHotelFloor                            		 	 = "Floor/zone supervisor";
var lblSettingsHotelMasterCardError                  		 	 = "The master card code cannot be empty";
var lblSettingsHotelErrorGET                         		 	 = "Unable to recover data";
var lblSettingsHotelLogicalAddressError              		 	 = "There are rooms with the same AVEbus address or progressive number";
var lblSettingsHotelStats                            		 	 = "Summary";
var lblSettingsHotelDatabaseInconsistencyText        		 	 = "In the environments configuration there are references to maps no longer present in the database, probably due to previous configurations.<br><br>At the next save these references will be removed.";
var lblSettingsHotelDatabaseInconsistencyTextConfirm 		 	 = "By continuing to save, references to previous configuration maps will be permanently removed.<br><br> Continue?";
var lblSettingsHotelEmpty                            		 	 = "The plant parameters have not been defined.<br><br>Before you can make changes to the room configuration, you must provide the missing information.";
var lblSettingsHotelIntegrityFailed                  		 	 = "Warning: database potentially not compatible with hotel configuration.";
var lblSettingsHotelIntegrityFailedMissingMap        		 	 = "Attention: a map configured as a hotel system environment has been removed.<br /><br />Please go to the 'Environment Configuration' menu to verify the configuration";
var lblSettingsHotelIntegrityFailedModifiedMap       		 	 = "Attention: a change has been detected to the maps configured as hotel system environments.<br /><br />Please go to the 'Environment configuration' menu to verify the configuration";
var lblSettingsHotelWaitingForCARD                   		 	 = "Waiting for CARD...";
var lblSettingsHotelNoCardProgrammer                 		 	 = "No card programmer found!"
var lblSettingsHotelNoCardProgrammerNotInLocalCheckout          = "Deleting CARDS with the programmer is only permitted by connecting to the local LAN network of the facility.<br /><br />Should I still proceed with check-out without a card, possibly using the blacklist section?";
var lblSettingsHotelNoCardProgrammerBeforeCheckout              = "No CARD programmer was found.<br /><br />Should I still proceed with check-out without a card, possibly using the blacklist section?";
var lblSettingsHotelNoCardProgrammerNotInLocalCheckin           = "Writing the CARD with the programmer is only permitted by connecting to the local LAN network of the facility.<br /><br />Impossible to proceed with room check-in";
var lblSettingsHotelNoCardProgrammerBeforeCheckin               = "In the absence of the CARD programmer it is not possible to proceed with the check-in of the room.<br /><br />Please check the connection with the programmer.";
var lblSettingsHotelOverwriteCardData                		 	 = "Card detected. Overwrite it?";
var lblSettingsHotelCardWriting                      		 	 = "Writing card...";
var lblSettingsHotelCardWroteCorrectly               		 	 = "Card written correctly.<br />Do you want to proceed to erase another card?";
var lblSettingsHotelErrorWritingCard                 		 	 = "Error writing card!<br />Retry?";
var lblSettingsHotelCheckoutConfirm                  		 	 = "Are you sure you want to check-out the room?<br >Any cards linked to the room will no longer be able to access the room.";
var lblSettingsHotelCheckoutEraseCardData            		 	 = "Card detected. Erase all contents?";
var lblSettingsHotelCheckoutCardErased               		 	 = "Card erased correctly.<br />Do you want to proceed to erase another card?";
var lblSettingsHotelCheckoutWaitingForCard           		 	 = "The room was checked out without the guest card.<br /><br />If you want to erase it, bring it to the programmer now.";
var lblSettingsHotelCheckoutEraseFailure             		 	 = "Error while erasing card.<br />Retry?";
var lblSettingsHotelGenericError                     		 	 = "An error occurred.<br />Please try again.";
var lblSettingsHotelCardErasing                      		 	 = "Card erasing...";
var lblSettingsHotelCheckinCardNotCompatible         		 	 = "Attention: the card is already associated with the room:<br /><br /><b>[room]</b><br /><br />Continue?";
var lblSettingsHotelCheckinCardNotCompatible2              = "Warning: the card is already associated with the room:<br /><br /><b>[room]</b><br /><br />Try another card.";
var lblSettingsHotelCheckoutCardNotCompatible        		 	 = "The card belongs to the room:<br /><br /><b>[room]</b><br /><br />Retry with another card?";
var lblSettingsHotelCheckoutCardNotCompatibleNotExisting 	 = "The card does not belong to this room.<br /><br />Retry with another card?";
var lblSettingsHotelKeycodeAlreadyPresent                	 = "The keycode entered is already associated with another room or common area!";
var lblSettingsHotelCreateCard                           	 = "Create both keycode and card";
var lblSettingsHotelDetailError                          	 = "It was not possible to retrieve informations about the selected room";
var lblSettingsHotelCommunicationError                   	 = "An error has occurred. Please retry.";
var lblSettingsHotelRoomConfiguration                    	 = "Room configuration";
var lblSettingsHotelCheckinCardInBlacklist               	 = "Card present in the blacklist.<br /><br />If you proceed with writing, the card will be removed from the blacklist. Continue?";
var lblSettingsHotelCheckinDeferred                      	 = "Enable \"CHECK-IN\" function with card creation on internal AVEbus reader (available starting from FW version 37 of the readers)";
var lblSettingsHotelConfigurationMKRParameters               = "Enable automatic insertion of \"Make Up Room\" when CHECK-OUT a room";
var lblSettingsHotelNoCardMaster                         	 = "The card type is not MASTER";
var lblSettingsHotelMasterOK                             	 = "It has been detected a MASTER card with code<br /><br /><b>[code]</b><br /><br />Do you want to set this code?";
var lblSettingsHotelCreateCardDeferred                   	 = "Creates card upon first insertion into the internal reader";
var lblSettingsHotelConfigurationReset                   	 = "RESET";
var lblSettingsHotelConfigurationSettingsResetPopupMessage = "Attention! All settings relating to hotel mode will be deleted (room configuration, users, cards and codes) <b>restoring domotic mode</b>.<br /><br />Do you want to continue?";
var lblSettingsManageCheckinsTotFreeRooms                  = "Free rooms";
var lblSettingsManageCheckinsTotPreCheckinRooms            = "Reserved rooms";
var lblSettingsManageCheckinsTotBookedRooms                = "Rooms in check-in";
var lblSettingsManageCheckinsGuestCode                     = "Customer code";
var lblSettingsManageCheckinsNextGuestCodePrediction       = "Next customer code prediction";
var lblSettingsManageCheckinsSurname                       = "Surname";
var lblSettingsManageCheckinsName                          = "Name";
var lblSettingsManageCheckinsCardType                      = "Card type";
var lblSettingsManageCheckinsGoToRegistry                  = "Go to registry";
var lblSettingsManageCheckinsStayDuration                  = "Stay duration";
var lblSettingsManageCheckinsCardExpiration                = "Expiration";
var lblSettingsManageCheckinsStartTime                     = "Start date and time";
var lblSettingsManageCheckinsEndTime                       = "End date and time";
var lblSettingsManageCheckinsNights                        = "Nights";
var lblSettingsManageCheckinsCredits                       = "Credits";
var lblSettingsManageCheckinsUnlimitedCredits              = "Unlimited";
var lblSettingsManageCheckinsPaidAreaDate                  = "Expiration date";
var lblSettingsManageCheckinsDateError                     = "The start date and end date are not compatible";
var lblSettingsManageCheckinsKeycode                       = "Numerical code";
var lblSettingsManageCheckinsDetails                       = "DETAIL";
var lblSettingsManageCheckinsGoTo                          = "GO TO";
var lblMasterCardNotWrite                                  = "Warning: A system management card has been detected. Cannot overwrite.<br /><br />Try another card?";
var lblNoWriteCardUnknown																	 = "Unable to write card because it is already used for keyboard management (without a specific user associated).<br /><br />Please try again with another card.";
var lblCheckinWithNoCardsYesCodeOnRoom                     = "Attention! The room has been correctly CHECK-IN with <b>only the numeric code as the access method</b>.<br /><br />To add a card it is necessary to CHECK-OUT the room and repeat the operation.";
var lblCheckinWithNoCardsYesCodeOnCommonArea               = "Attention! The room was reserved without a card and the numerical code created <b>only opens common areas</b>.<br /><br />It is possible to add a card at any time through the \"COMPLETE CHECK-IN\" function or to CHECK-OUT the room.";
var lblCheckinWithNoCardsNoCode                            = "Attention! The room has been reserved <b>without card and without code</b>.<br /><br />It is possible to add a card at any time through the \"COMPLETE CHECK-IN\" function or to CHECK-OUT the room.";
var lblCompletaCheckin                                     = "COMPLETE CHECK-IN";
var lblReadingCard                                              = "Card reading in progress...";
var lblHotelCardRecognitionGuest                                = "A <b>CUSTOMER</b> type CARD associated with the room has been detected:";
var lblHotelCardRecognitionGuestName                            = "and belongs to the user";
var lblHotelCardRecognitionStaff                                = "A CARD of type <b>[card_type]</b> belonging to the user has been detected:";
var lblHotelCardRecognitionGenericType                          = "A CARD type has been detected";
var lblHotelCardRecognitionReadonly                             = "It is not possible to overwrite this CARD.";
var lblAccessManagerTipoVergine                                 = "NOT ASSIGNED";
var lblHotelCardRecognitionBlacklist                            = "which is present in <b>BLACKLIST</b>";
var lblHotelCardRecognitionNoRoom                               = "not associated with any room.";
var lblHotelCardRecognitionNoUser                               = "which does not appear to be associated with any user.";
var lblHotelCardRecognitionUnknownType                          = "CARD type not recognized by the system";
var lblHotelCardReutilizeForCheckin                             = "Reuse the CARD to check-in again:";
var lblHotelCardSelectRoom                                      = "Select a room";
var lblHotelRoomAlreadyCheckedIn                                = "Error: the selected room is already checked in";
var lblHotelRoomAlreadyCheckedOut                               = "Error: the selected room is already checked out";
var lblSettingsHotelKeycodeAlreadyPresentForRoom                = "The code entered is already associated with the room:<br /><br /><b>[room]</b>";
var lblSettingsHotelKeycodeAlreadyPresentForUser                = "The code entered is already associated with the user:<br /><br /><b>[user]</b>";
var lblSettingsHotelKeycodeAlreadyPresentNoRoomNoUser           = "The code entered appears to be already used in the \"Keyboard management\" section (without a specific user associated).";

/* ------------------------------------------------------------- CARTE STAFF ------------------------------------------------------------- */
var lblManageStaffCards                          = "Staff Management";
var lblNameSurname                               = "Name and surname";
var lblSettingsStaffCardsUserType                = "User type";
var lblNumberOfCodes                             = "Number of codes";
var lblNumberOfCards                             = "Number of cards";
var lblAddStaff                                  = "Add";
var lblRemoveAll                                 = "Remove all";
var lblRemoveStaffUserTitle                      = "DELETING STAFF USER";
var lblRemoveStaffUserMessage                    = "Warning: the user and all codes and cards associated with them will be deleted. Continue?";
var lblRemoveAllStaffUserMessage                 = "Warning: all staff users and their codes and cards will be removed. Continue?";
var lblRemoveStaffCardChoice                     = "Before completing the deletion, it is necessary to bring the user's cards close to the programmer to delete them.<br />Do you own them?";
var lblSettingsStaffCardsUserNameError           = "The user name data cannot be empty.";
var lblSettingsStaffCardNotCompatibleNotExisting = "It is not possible to delete this card since it does not belong to this user.<br /><br />Retry with another card?";
var lblSettingsStaffCardsCardNotCompatible       = "It is not possible to delete this card since it belongs to:<br /><br /><b>[user]</b><br /><br />Retry with another card?";
var lblSettingsCardsErasedOK                     = "Staff user erased successfully!";
var lblSettingsStaffCardsNoUsers                 = "There aren't any staff users";
var lblSettingsStaffCardsNewUser                 = "New STAFF user";
var lblSettingsStaffCardsProceedWithoutCard      = "Proceed without card";
var lblSettingsStaffCardsCurrentWBS              = "(current supervisor)";
var lblSettingsStaffCardsCardAlreadyUsed         = "The card could not be written because it belongs to the user:<br /><br /><b>[user]</b><br /><br />Please try again with another card.";
var lblSettingsStaffCardsBlackListMessage        = "For security reasons, the user's card identifiers have been entered into the lost card archive.<br /><br / >These lost cards can be placed in BLACKLIST via the appropriate section.";
var lblSettingsStaffCardsUserErrorMessage        = "The information for the selected user could not be retrieved";
var lblSettingsStaffCardsTimeoutError            = "An error occurred communicating with the server (request in TIMEOUT).<br /><br />Please repeat the operation";
var lblSettingsStaffCardsServerError             = "The information request to the server returned an error code ([code]).<br /><br />Please repeat the operation";
var lblSettingsStaffCardsCardInBlacklist         = "Card present in blacklist.<br /><br />Try with another card?";
var lblSettingsStaffCardsGoToBlacklist           = "Go to blacklist";
var lblSettingsHotelNoCardProgrammerNotInLocalStaff             = "Writing the CARD with the programmer is only allowed by connecting to the local LAN network of the structure.<br /><br />Impossible to proceed with the creation of the user.";
var lblSettingsHotelNoCardProgrammerBeforeStaff                 = "In the absence of the CARD programmer it is not possible to proceed with the creation of the user.<br /><br />Please check the connection with the programmer.";

/* ------------------------------------------------------------- BLACKLIST ------------------------------------------------------------- */
var lblBlacklist                              = "Blacklist";
var lblBlacklistSync                          = "Sync";
var lblBlacklistSyncMessage                   = "Normally the addition or removal of a card in the blacklist is immediately acknowledged by the readers. However, system synchronization can be forced in the event of replacement of a reader or suspected misalignments. This procedure will take a few minutes, without there is no disruption to the normal functioning of the readers.<br /><br />Do you want to continue?";
var lblBlacklistSyncOK                        = "The synchronization process started successfully.";
var lblBlacklistSyncKO                        = "An error occurred during the synchronization process.<br /><br />Please try again.";
var lblRemoveAllBlacklist                     = "Warning: all blocked cards in the blacklist will be eliminated. This operation is irreversible.<br /><br />Do you want to continue?";
var lblBlacklistRemoveAll                     = "Remove blocked";
var lblBlacklistRemoveAllOK                   = "All the blocked cards in the blacklist have been removed correctly.";
var lblBlacklistRemoveAllKO                   = "An error occurred while deleting.<br /><br />Please try again.";
var lblBlacklistRemoveSingleCard              = "Warning: it will be deleted the card with identifier<br /><br /><b>[card]</b><br /><br /><br /><br />Do you want to continue?";
var lblBlacklistRemoveOK                      = "The card has been removed successfully.";
var lblBlacklistRemoveSingleTitle             = "REMOVING CARD IN BLACKLIST";
var lblSettingsBlacklistInfoTitle             = "Card Information";
var lblSettingsBlacklistNotesAndAddIdentifier = "Card identifier";
var lblSettingsBlacklistNotesAndAddNotes      = "Notes";
var lblSettingsBlacklistModifyTitle           = "Modify card";
var lblBlacklistCheckbox                      = "Add in blacklist (block it)";
var lblBlacklistPotentialMessage              = "The card can still be used to open some reader-protected gates";
var lblBlacklistEffectiveMessage              = "The card can no longer be used to open any reader-protected gates";
var lblBlacklistNoCards                       = "There aren't any card in blacklist";
var lblBlacklistPotential                     = "Lost";
var lblBlacklistEffective                     = "Blocked";
var lblBlacklistMaxReached                    = "Reached max number of blocked cards (50)";