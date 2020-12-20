//# sourceURL=J_ALTUI_verabox.js
// "use strict";
// http://192.168.1.16:3480/data_request?id=lr_ALTUI_Handler&command=home
// This program is free software: you can redistribute it and/or modify
// it under the condition that it is for private or home useage and
// this whole comment is reproduced in the source code file.
// Commercial utilisation is not authorized without the appropriate
// written agreement from amg0 / alexis . mermet @ gmail . com
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

var ALTUI_NEW_SCENE_ID = -1;
var ALTUI_NEW_SCENE_ALTUIID = "0--1"

//http://zwavepublic.com/sites/default/files/command_class_specs_2017A/SDS13782-4%20Z-Wave%20Management%20Command%20Class%20Specification.pdf
var ALTUI_zWaveLibraryType = {
	"1": "CONTROLLER_STATIC",
	"2": "CONTROLLER",
	"3": "SLAVE_ENHANCED",
	"4": "SLAVE",
	"5": "INSTALLER",
	"6": "SLAVE_ROUTING",
	"7": "CONTROLLER_BRIDGE",
	"8": "DUT",
	"9": "N/A",
	"0a": "AV Remote",
	"0b": "AV Device",
	}

var ALTUI_BasicType = {
	"01":"BASIC_TYPE_CONTROLLER",
	"04":"BASIC_TYPE_ROUTING_SLAVE",
	"03":"BASIC_TYPE_SLAVE",
	"02":"BASIC_TYPE_STATIC_CONTROLLER",
	}

var ALTUI_GenericSpecificType = {
	"03":{gt:"GENERIC_TYPE_AV_CONTROL_POINT", st:{
		"00":"SPECIFIC_TYPE_NOT_USED",
		"12":"SPECIFIC_TYPE_DOORBELL",
		"04":"SPECIFIC_TYPE_SATELLITE_RECEIVER",
		"11":"SPECIFIC_TYPE_SATELLITE_RECEIVER_V2",
	}},
	"04":{gt:"GENERIC_TYPE_DISPLAY", st:{
		"00":"SPECIFIC_TYPE_NOT_USED",
		"01":"SPECIFIC_TYPE_SIMPLE_DISPLAY",
	}},
	"40":{gt:"GENERIC_TYPE_ENTRY_CONTROL", st:{
		"00":"SPECIFIC_TYPE_NOT_USED",
		"01":"SPECIFIC_TYPE_DOOR_LOCK",
		"02":"SPECIFIC_TYPE_ADVANCED_DOOR_LOCK",
		"03":"SPECIFIC_TYPE_SECURE_KEYPAD_DOOR_LOCK",
		"04":"SPECIFIC_TYPE_SECURE_KEYPAD_DOOR_LOCK_DEADBOLT",
		"05":"SPECIFIC_TYPE_SECURE_DOOR",
		"06":"SPECIFIC_TYPE_SECURE_GATE",
		"07":"SPECIFIC_TYPE_SECURE_BARRIER_ADDON",
		"08":"SPECIFIC_TYPE_SECURE_BARRIER_OPEN_ONLY",
		"09":"SPECIFIC_TYPE_SECURE_BARRIER_CLOSE_ONLY",
		"0A":"SPECIFIC_TYPE_SECURE_LOCKBOX",
		"0B":"SPECIFIC_TYPE_SECURE_KEYPAD",
	}},
	"01":{gt:"GENERIC_TYPE_GENERIC_CONTROLLER", st:{
		"00":"SPECIFIC_TYPE_NOT_USED",
		"01":"SPECIFIC_TYPE_PORTABLE_REMOTE_CONTROLLER",
		"02":"SPECIFIC_TYPE_PORTABLE_SCENE_CONTROLLER",
		"03":"SPECIFIC_TYPE_PORTABLE_INSTALLER_TOOL",
		"04":"SPECIFIC_TYPE_REMOTE_CONTROL_AV",
		"06":"SPECIFIC_TYPE_REMOTE_CONTROL_SIMPLE",
	}},
	"31":{gt:"GENERIC_TYPE_METER", st:{
		"00":"SPECIFIC_TYPE_NOT_USED",
		"01":"SPECIFIC_TYPE_SIMPLE_METER",
		"02":"SPECIFIC_TYPE_ADV_ENERGY_CONTROL",
		"03":"SPECIFIC_TYPE_WHOLE_HOME_METER_SIMPLE",
	}},
	"30":{gt:"GENERIC_TYPE_METER_PULSE", st:{
		"00":"SPECIFIC_TYPE_NOT_USED",
	}},
	"FF":{gt:"GENERIC_TYPE_NON_INTEROPERABLE", st:{
		"00":"SPECIFIC_TYPE_NOT_USED",
	}},
	"0F":{gt:"GENERIC_TYPE_REPEATER_SLAVE", st:{
		"00":"SPECIFIC_TYPE_NOT_USED",
		"01":"SPECIFIC_TYPE_REPEATER_SLAVE",
		"02":"SPECIFIC_TYPE_VIRTUAL_NODE",
	}},
	"17":{gt:"GENERIC_TYPE_SECURITY_PANEL", st:{
		"00":"SPECIFIC_TYPE_NOT_USED",
		"01":"SPECIFIC_TYPE_ZONED_SECURITY_PANEL",
	}},
	"50":{gt:"GENERIC_TYPE_SEMI_INTEROPERABLE", st:{
		"00":"SPECIFIC_TYPE_NOT_USED",
		"01":"SPECIFIC_TYPE_ENERGY_PRODUCTION",
	}},
	"A1":{gt:"GENERIC_TYPE_SENSOR_ALARM", st:{
		"00":"SPECIFIC_TYPE_NOT_USED",
		"05":"SPECIFIC_TYPE_ADV_ZENSOR_NET_ALARM_SENSOR",
		"0A":"SPECIFIC_TYPE_ADV_ZENSOR_NET_SMOKE_SENSOR",
		"01":"SPECIFIC_TYPE_BASIC_ROUTING_ALARM_SENSOR",
		"06":"SPECIFIC_TYPE_BASIC_ROUTING_SMOKE_SENSOR",
		"03":"SPECIFIC_TYPE_BASIC_ZENSOR_NET_ALARM_SENSOR",
		"08":"SPECIFIC_TYPE_BASIC_ZENSOR_NET_SMOKE_SENSOR",
		"02":"SPECIFIC_TYPE_ROUTING_ALARM_SENSOR",
		"07":"SPECIFIC_TYPE_ROUTING_SMOKE_SENSOR",
		"04":"SPECIFIC_TYPE_ZENSOR_NET_ALARM_SENSOR",
		"09":"SPECIFIC_TYPE_ZENSOR_NET_SMOKE_SENSOR",
		"0B":"SPECIFIC_TYPE_ALARM_SENSOR",
	}},
	"20":{gt:"GENERIC_TYPE_SENSOR_BINARY", st:{
		"00":"SPECIFIC_TYPE_NOT_USED",
		"01":"SPECIFIC_TYPE_ROUTING_SENSOR_BINARY",
	}},
	"21":{gt:"GENERIC_TYPE_SENSOR_MULTILEVEL", st:{
		"00":"SPECIFIC_TYPE_NOT_USED",
		"01":"SPECIFIC_TYPE_ROUTING_SENSOR_MULTILEVEL",
		"02":"SPECIFIC_TYPE_CHIMNEY_FAN",
	}},
	"02":{gt:"GENERIC_TYPE_STATIC_CONTROLLER", st:{
		"00":"SPECIFIC_TYPE_NOT_USED",
		"01":"SPECIFIC_TYPE_PC_CONTROLLER",
		"02":"SPECIFIC_TYPE_SCENE_CONTROLLER",
		"03":"SPECIFIC_TYPE_STATIC_INSTALLER_TOOL",
		"04":"SPECIFIC_TYPE_SET_TOP_BOX",
		"05":"SPECIFIC_TYPE_SUB_SYSTEM_CONTROLLER",
		"06":"SPECIFIC_TYPE_TV",
		"07":"SPECIFIC_TYPE_GATEWAY",
	}},
	"10":{gt:"GENERIC_TYPE_SWITCH_BINARY", st:{
		"00":"SPECIFIC_TYPE_NOT_USED",
		"01":"SPECIFIC_TYPE_POWER_SWITCH_BINARY",
		"03":"SPECIFIC_TYPE_SCENE_SWITCH_BINARY",
		"04":"SPECIFIC_TYPE_POWER_STRIP",
		"05":"SPECIFIC_TYPE_SIREN",
		"06":"SPECIFIC_TYPE_VALVE_OPEN_CLOSE",
		"02":"SPECIFIC_TYPE_COLOR_TUNABLE_BINARY",
		"07":"SPECIFIC_TYPE_IRRIGATION_CONTROLLER",
	}},
	"11":{gt:"GENERIC_TYPE_SWITCH_MULTILEVEL", st:{
		"00":"SPECIFIC_TYPE_NOT_USED",
		"05":"SPECIFIC_TYPE_CLASS_A_MOTOR_CONTROL",
		"06":"SPECIFIC_TYPE_CLASS_B_MOTOR_CONTROL",
		"07":"SPECIFIC_TYPE_CLASS_C_MOTOR_CONTROL",
		"03":"SPECIFIC_TYPE_MOTOR_MULTIPOSITION",
		"01":"SPECIFIC_TYPE_POWER_SWITCH_MULTILEVEL",
		"04":"SPECIFIC_TYPE_SCENE_SWITCH_MULTILEVEL",
		"08":"SPECIFIC_TYPE_FAN_SWITCH",
		"02":"SPECIFIC_TYPE_COLOR_TUNABLE_MULTILEVEL",
	}},
	"12":{gt:"GENERIC_TYPE_SWITCH_REMOTE", st:{
		"00":"SPECIFIC_TYPE_NOT_USED",
		"01":"SPECIFIC_TYPE_SWITCH_REMOTE_BINARY",
		"02":"SPECIFIC_TYPE_SWITCH_REMOTE_MULTILEVEL",
		"03":"SPECIFIC_TYPE_SWITCH_REMOTE_TOGGLE_BINARY",
		"04":"SPECIFIC_TYPE_SWITCH_REMOTE_TOGGLE_MULTILEVEL",
	}},
	"13":{gt:"GENERIC_TYPE_SWITCH_TOGGLE", st:{
		"00":"SPECIFIC_TYPE_NOT_USED",
		"01":"SPECIFIC_TYPE_SWITCH_TOGGLE_BINARY",
		"02":"SPECIFIC_TYPE_SWITCH_TOGGLE_MULTILEVEL",
	}},
	"08":{gt:"GENERIC_TYPE_THERMOSTAT", st:{
		"00":"SPECIFIC_TYPE_NOT_USED",
		"03":"SPECIFIC_TYPE_SETBACK_SCHEDULE_THERMOSTAT",
		"05":"SPECIFIC_TYPE_SETBACK_THERMOSTAT",
		"04":"SPECIFIC_TYPE_SETPOINT_THERMOSTAT",
		"02":"SPECIFIC_TYPE_THERMOSTAT_GENERAL",
		"06":"SPECIFIC_TYPE_THERMOSTAT_GENERAL_V2",
		"01":"SPECIFIC_TYPE_THERMOSTAT_HEATING",
	}},
	"16":{gt:"GENERIC_TYPE_VENTILATION", st:{
		"00":"SPECIFIC_TYPE_NOT_USED",
		"01":"SPECIFIC_TYPE_RESIDENTIAL_HRV",
	}},
	"09":{gt:"GENERIC_TYPE_WINDOW_COVERING", st:{
		"00":"SPECIFIC_TYPE_NOT_USED",
		"01":"SPECIFIC_TYPE_SIMPLE_WINDOW_COVERING",
	}},
	"15":{gt:"GENERIC_TYPE_ZIP_NODE", st:{
		"00":"SPECIFIC_TYPE_NOT_USED",
		"02":"SPECIFIC_TYPE_ZIP_ADV_NODE",
		"01":"SPECIFIC_TYPE_ZIP_TUN_NODE",
	}},
	"18":{gt:"GENERIC_TYPE_WALL_CONTROLLER", st:{
		"00":"SPECIFIC_TYPE_NOT_USED",
		"01":"SPECIFIC_TYPE_BASIC_WALL_CONTROLLER",
	}},
	"05":{gt:"GENERIC_TYPE_NETWORK_EXTENDER", st:{
		"00":"SPECIFIC_TYPE_NOT_USED",
		"01":"SPECIFIC_TYPE_SECURE_EXTENDER",
	}},
	"06":{gt:"GENERIC_TYPE_APPLIANCE", st:{
		"00":"SPECIFIC_TYPE_NOT_USED",
		"01":"SPECIFIC_TYPE_GENERAL_APPLIANCE",
		"02":"SPECIFIC_TYPE_KITCHEN_APPLIANCE",
		"03":"SPECIFIC_TYPE_LAUNDRY_APPLIANCE",
	}},
	"07":{gt:"GENERIC_TYPE_SENSOR_NOTIFICATION", st:{
		"00":"SPECIFIC_TYPE_NOT_USED",
		"01":"SPECIFIC_TYPE_NOTIFICATION_SENSOR",
	}},
}

var ALTUI_Manufacturor = {
	"FFFF":"MFG_ID_NOT_DEFINED",
	"0028":"MFG_ID_2B_ELECTRONICS",
	"009B":"MFG_ID_2GIG_TECHNOLOGIES_INC",
	"002A":"MFG_ID_3E_TECHNOLOGIES",
	"0022":"MFG_ID_A1_COMPONENTS",
	"0117":"MFG_ID_ABILIA",
	"0001":"MFG_ID_ACT_ADVANCED_CONTROL_TECHNOLOGIES",
	"0101":"MFG_ID_ADOX_INC",
	"016C":"MFG_ID_ADVANCED_OPTRONIC_DEVICES_CO_LTD",
	"009E":"MFG_ID_ADVENTURE_INTERACTIVE",
	"0086":"MFG_ID_AEON_LABS",
	"0111":"MFG_ID_AIRLINE_MECHANICAL_CO_LTD",
	"0088":"MFG_ID_AIRVENT_SAM_SPA",
	"0094":"MFG_ID_ALARMCOM",
	"0126":"MFG_ID_ALERTME",
	"003B":"MFG_ID_ALLEGION",
	"0230":"MFG_ID_ALPHONSUS_TECH",
	"019C":"MFG_ID_AMDOCS",
	"005A":"MFG_ID_AMERICAN_GRID_INC",
	"0078":"MFG_ID_ANYCOMM_CORPORATION",
	"0144":"MFG_ID_APPLIED_MICRO_ELECTRONICS_AME_BV",
	"0029":"MFG_ID_ASIA_HEADING",
	"0231":"MFG_ID_ASITEQ",
	"0129":"MFG_ID_ASSA_ABLOY",
	"013B":"MFG_ID_ASTRALINK",
	"0134":"MFG_ID_ATT",
	"002B":"MFG_ID_ATECH",
	"0244":"MFG_ID_ATHOM_BV",
	"0155":"MFG_ID_AVADESIGN_TECHNOLOGY_CO_LTD",
	"0146":"MFG_ID_AXESSTEL_INC",
	"0018":"MFG_ID_BALBOA_INSTRUMENTS",
	"0236":"MFG_ID_BANDI_COMM_TECH_INC",
	"0204":"MFG_ID_BEIJING_SINOAMERICAN_BOYI_SOFTWARE_DEVELOPMENT_CO_L",
	"0251":"MFG_ID_BEIJING_UNIVERSAL_ENERGY_HUAXIA_TECHNOLOGY_CO_LTD",
	"0196":"MFG_ID_BELLATRIX_SYSTEMS_INC",
	"008A":"MFG_ID_BENEXT",
	"002C":"MFG_ID_BESAFER",
	"014B":"MFG_ID_BFT_SPA",
	"0052":"MFG_ID_BIT7_INC",
	"0090":"MFG_ID_BLACK_DECKER",
	"0213":"MFG_ID_BMS_EVLER_LTD",
	"0023":"MFG_ID_BOCA_DEVICES",
	"015C":"MFG_ID_BOSCH_SECURITY_SYSTEMS_INC",
	"0138":"MFG_ID_BRK_BRANDS_INC",
	"002D":"MFG_ID_BROADBAND_ENERGY_NETWORKS_INC",
	"024A":"MFG_ID_BTSTAR_HK_TECHNOLOGY_COMPANY_LIMITED",
	"0145":"MFG_ID_BUFFALO_INC",
	"0190":"MFG_ID_BUILDING_36_TECHNOLOGIES",
	"0026":"MFG_ID_BULOGICS",
	"0169":"MFG_ID_BONIG_UND_KALLENBACH_OHG",
	"009C":"MFG_ID_CAMEO_COMMUNICATIONS_INC",
	"002E":"MFG_ID_CARRIER",
	"000B":"MFG_ID_CASAWORKS",
	"0243":"MFG_ID_CASENIO_AG",
	"0166":"MFG_ID_CBCC_DOMOTIQUE_SAS",
	"0246":"MFG_ID_CENTRALITE_SYSTEMS_INC",
	"014E":"MFG_ID_CHECKIT_SOLUTIONS_INC",
	"0116":"MFG_ID_CHROMAGIC_TECHNOLOGIES_CORPORATION",
	"0082":"MFG_ID_CISCO_CONSUMER_BUSINESS_GROUP",
	"018E":"MFG_ID_CLIMAX_TECHNOLOGY_LTD",
	"0200":"MFG_ID_CLOUD_MEDIA",
	"002F":"MFG_ID_COLOR_KINETICS_INCORPORATED",
	"0140":"MFG_ID_COMPUTIME",
	"011B":"MFG_ID_CONNECTED_OBJECT",
	"0179":"MFG_ID_CONNECTHOME",
	"0019":"MFG_ID_CONTROLTHINK_LC",
	"000F":"MFG_ID_CONVERGEX_LTD",
	"007D":"MFG_ID_COOLGUARD",
	"0079":"MFG_ID_COOPER_LIGHTING",
	"001A":"MFG_ID_COOPER_WIRING_DEVICES",
	"009D":"MFG_ID_COVENTIVE_TECHNOLOGIES_INC",
	"0014":"MFG_ID_CYBERHOUSE",
	"0067":"MFG_ID_CYBERTAN_TECHNOLOGY_INC",
	"0030":"MFG_ID_CYTECH_TECHNOLOGY_PRE_LTD",
	"0002":"MFG_ID_DANFOSS",
	"018C":"MFG_ID_DAWON_DNS",
	"020A":"MFG_ID_DECORIS_INTELLIGENT_SYSTEM_LIMITED",
	"013F":"MFG_ID_DEFACONTROLS_BV",
	"0031":"MFG_ID_DESTINY_NETWORKS",
	"0175":"MFG_ID_DEVOLO",
	"0103":"MFG_ID_DIEHL_AKO",
	"0032":"MFG_ID_DIGITAL_5_INC",
	"024E":"MFG_ID_DIGITAL_HOME_SYSTEMS_PTY_LTD_",
	"0228":"MFG_ID_DIGITALZONE",
	"0108":"MFG_ID_DLINK",
	"0127":"MFG_ID_DMP_DIGITAL_MONITORING_PRODUCTS",
	"0177":"MFG_ID_DOMINO_SISTEMI_DOO",
	"020E":"MFG_ID_DOMITECH_PRODUCTS_LLC",
	"020C":"MFG_ID_DONGGUAN_ZHOU_DA_ELECTRONICS_CO_LTD",
	"017D":"MFG_ID_DRACOR_INC",
	"0184":"MFG_ID_DRAGON_TECH_INDUSTRIAL_LTD",
	"0223":"MFG_ID_DTV_RESEARCH_UNIPESSOAL_LDA",
	"0132":"MFG_ID_DYNAQUIP_CONTROLS",
	"0247":"MFG_ID_EASY_SAVER_CO_INC",
	"017C":"MFG_ID_EBV",
	"016B":"MFG_ID_ECHOSTAR",
	"014A":"MFG_ID_ECOLINK",
	"0157":"MFG_ID_ECONET_CONTROLS",
	"010D":"MFG_ID_EHOME_AUTOMATION",
	"0087":"MFG_ID_EKA_SYSTEMS",
	"0033":"MFG_ID_ELECTRONIC_SOLUTIONS",
	"021F":"MFG_ID_ELEXA_CONSUMER_PRODUCTS_INC",
	"0034":"MFG_ID_ELGEV_ELECTRONICS_LTD",
	"001B":"MFG_ID_ELK_PRODUCTS_INC",
	"020B":"MFG_ID_EMBEDDED_SYSTEM_DESIGN_LIMITED",
	"0035":"MFG_ID_EMBEDIT_AS",
	"014D":"MFG_ID_ENBLINK_CO_LTD",
	"0219":"MFG_ID_ENWOX_TECHNOLOGIES_SRO",
	"006F":"MFG_ID_ERONE",
	"0160":"MFG_ID_ESSENCE_SECURITY",
	"0148":"MFG_ID_EUROTRONICS",
	"0060":"MFG_ID_EVERSPRING",
	"0113":"MFG_ID_EVOLVE",
	"0036":"MFG_ID_EXCEPTIONAL_INNOVATIONS",
	"0004":"MFG_ID_EXHAUSTO",
	"009F":"MFG_ID_EXIGENT_SENSORS",
	"001E":"MFG_ID_EXPRESS_CONTROLS",
	"0233":"MFG_ID_EZEX_CORPORATION",
	"0085":"MFG_ID_FAKRO",
	"016A":"MFG_ID_FANTEM",
	"010F":"MFG_ID_FIBARGROUP",
	"018D":"MFG_ID_FLEXTRONICS",
	"0024":"MFG_ID_FLUE_SENTINEL",
	"0037":"MFG_ID_FOARD_SYSTEMS",
	"018F":"MFG_ID_FOCAL_POINT_LIMITED",
	"0137":"MFG_ID_FOLLOWGOOD_TECHNOLOGY_COMPANY_LTD",
	"0207":"MFG_ID_FOREST_GROUP_NEDERLAND_BV",
	"0084":"MFG_ID_FORTREZZ_LLC",
	"011D":"MFG_ID_FOXCONN",
	"0110":"MFG_ID_FROSTDALE",
	"025A":"MFG_ID_GES",
	"022B":"MFG_ID_GKB_SECURITY_CORPORATION",
	"018A":"MFG_ID_GLOBALCHINATECH",
	"0159":"MFG_ID_GOAP",
	"0076":"MFG_ID_GOGGIN_RESEARCH",
	"0068":"MFG_ID_GOOD_WAY_TECHNOLOGY_CO_LTD",
	"0099":"MFG_ID_GREENWAVE_REALITY_INC",
	"018B":"MFG_ID_GRIB",
	"016D":"MFG_ID_GUANGZHOU_RUIXIANG_ME_CO_LTD",
	"0158":"MFG_ID_GUANGZHOU_ZEEWAVE_INFORMATION_TECHNOLOGY_CO_LTD",
	"024C":"MFG_ID_HANKOOK_GAS_KIKI_CO_LTD",
	"025C":"MFG_ID_HAUPPAUGE",
	"0073":"MFG_ID_HAWKING_TECHNOLOGIES_INC",
	"020F":"MFG_ID_HERALD_DATANETICS_LIMITED",
	"0017":"MFG_ID_HITECH_AUTOMATION",
	"0181":"MFG_ID_HOLION_ELECTRONIC_ENGINEERING_CO_LTD",
	"013E":"MFG_ID_HOLTEC_ELECTRONICS_BV",
	"000D":"MFG_ID_HOME_AUTOMATED_LIVING",
	"009A":"MFG_ID_HOME_AUTOMATION_EUROPE",
	"005B":"MFG_ID_HOME_AUTOMATION_INC",
	"0038":"MFG_ID_HOME_DIRECTOR",
	"0070":"MFG_ID_HOMEMANAGEABLES_INC",
	"0050":"MFG_ID_HOMEPRO",
	"0162":"MFG_ID_HOMESCENARIO",
	"000C":"MFG_ID_HOMESEER_TECHNOLOGIES",
	"023D":"MFG_ID_HONEST_TECHNOLOGY_CO_LTD",
	"0039":"MFG_ID_HONEYWELL",
	"0059":"MFG_ID_HORSTMANN_CONTROLS_LIMITED",
	"0221":"MFG_ID_HOSEOTELNET",
	"0180":"MFG_ID_HUAPIN_INFORMATION_TECHNOLOGY_CO_LTD",
	"024B":"MFG_ID_HUAWEI_TECHNOLOGIES_CO_LTD",
	"007C":"MFG_ID_HUNTER_DOUGLAS",
	"0218":"MFG_ID_IAUTOMADE_PTE_LTD",
	"0011":"MFG_ID_ICOM_TECHNOLOGY_BV",
	"0106":"MFG_ID_ICONTROL",
	"0106":"MFG_ID_ICONTROL_NETWORKS",
	"0165":"MFG_ID_IDRF",
	"019E":"MFG_ID_IEXERGY_GMBH",
	"0056":"MFG_ID_IMPACT_TECHNOLOGIES_AND_PRODUCTS",
	"0061":"MFG_ID_IMPACT_TECHNOLOGIES_BV",
	"012B":"MFG_ID_INFUSION_DEVELOPMENT",
	"006C":"MFG_ID_INGERSOLL_RAND_SCHLAGE",
	"011F":"MFG_ID_INGERSOLL_RAND_ECOLINK",
	"0256":"MFG_ID_INKEL_CORP",
	"003A":"MFG_ID_INLON_SRL",
	"0141":"MFG_ID_INNOBAND_TECHNOLOGIES_INC",
	"0077":"MFG_ID_INNOVUS",
	"0100":"MFG_ID_INSIGNIA",
	"0006":"MFG_ID_INTEL",
	"001C":"MFG_ID_INTELLICON",
	"0072":"MFG_ID_INTERACTIVE_ELECTRONICS_SYSTEMS_IES",
	"0005":"MFG_ID_INTERMATIC",
	"0013":"MFG_ID_INTERNET_DOM",
	"005F":"MFG_ID_IQGROUP",
	"0212":"MFG_ID_IREVO",
	"0253":"MFG_ID_IUNGONL_BV",
	"0123":"MFG_ID_IWATSU",
	"0063":"MFG_ID_JASCO_PRODUCTS",
	"015A":"MFG_ID_JIN_TAO_BAO",
	"0164":"MFG_ID_JSW_PACIFIC_CORPORATION",
	"0214":"MFG_ID_KAIPULE_TECHNOLOGY_CO_LTD",
	"0091":"MFG_ID_KAMSTRUP_AS",
	"006A":"MFG_ID_KELLENDONK_ELEKTRONIK",
	"0114":"MFG_ID_KICHLER",
	"0174":"MFG_ID_KOPERA_DEVELOPMENT_INC",
	"023A":"MFG_ID_KUMHO_ELECTRIC_INC",
	"0051":"MFG_ID_LAGOTEK_CORPORATION",
	"0173":"MFG_ID_LEAK_INTELLIGENCE_LLC",
	"0187":"MFG_ID_LEVION_TECHNOLOGIES_GMBH",
	"001D":"MFG_ID_LEVITON",
	"0015":"MFG_ID_LEXEL",
	"015B":"MFG_ID_LG_ELECTRONICS",
	"0224":"MFG_ID_LIFESHIELD_LLC",
	"003C":"MFG_ID_LIFESTYLE_NETWORKS",
	"0210":"MFG_ID_LIGHT_ENGINE_LIMITED",
	"014F":"MFG_ID_LINEAR_CORP",
	"017A":"MFG_ID_LIVEGUARD_LTD",
	"013A":"MFG_ID_LIVING_STYLE_ENTERPRISES_LTD",
	"015E":"MFG_ID_LOCSTAR_TECHNOLOGY_CO_LTD",
	"007F":"MFG_ID_LOGITECH",
	"0025":"MFG_ID_LOUDWATER_TECHNOLOGIES_LLC",
	"0071":"MFG_ID_LS_CONTROL",
	"0062":"MFG_ID_LVI_PRODUKTER_AB",
	"0195":"MFG_ID_M2M_SOLUTION",
	"006E":"MFG_ID_MANODO_KTC",
	"003D":"MFG_ID_MARMITEK_BV",
	"003E":"MFG_ID_MARTEC_ACCESS_PRODUCTS",
	"0092":"MFG_ID_MARTIN_RENZ_GMBH",
	"008F":"MFG_ID_MB_TURN_KEY_DESIGN",
	"015F":"MFG_ID_MCOHOME_TECHNOLOGY_CO_LTD",
	"0222":"MFG_ID_MCT_CO_LTD",
	"0027":"MFG_ID_MEEDIO_LLC",
	"0107":"MFG_ID_MEGACHIPS",
	"022D":"MFG_ID_MERCURY_CORPORATION",
	"007A":"MFG_ID_MERTEN",
	"0238":"MFG_ID_MILANITY_INC",
	"0112":"MFG_ID_MITSUMI",
	"019D":"MFG_ID_MOBILUS_MOTOR_SPOLKA_Z_OO",
	"0232":"MFG_ID_MODACOM_CO_LTD",
	"008D":"MFG_ID_MODSTROM",
	"000E":"MFG_ID_MOHITO_NETWORKS",
	"0202":"MFG_ID_MONOPRICE",
	"007E":"MFG_ID_MONSTER_CABLE",
	"0125":"MFG_ID_MOTION_CONTROL_SYSTEMS",
	"003F":"MFG_ID_MOTOROLA",
	"0122":"MFG_ID_MSK_MIYAKAWA_SEISAKUSHO",
	"0083":"MFG_ID_MTC_MAINTRONIC_GERMANY",
	"0143":"MFG_ID_MYSTROM",
	"016E":"MFG_ID_NANJING_EASTHOUSE_ELECTRICAL_CO_LTD",
	"0121":"MFG_ID_NAPCO_SECURITY_TECHNOLOGIES_INC",
	"006D":"MFG_ID_NEFIT",
	"0189":"MFG_ID_NESS_CORPORATION_PTY_LTD",
	"0133":"MFG_ID_NETGEAR",
	"0203":"MFG_ID_NEWLAND_COMMUNICATION_SCIENCE_TECHNOLOGY_CO_LTD",
	"0178":"MFG_ID_NEXIA_HOME_INTELLIGENCE",
	"0075":"MFG_ID_NEXTENERGY",
	"0185":"MFG_ID_NINGBO_SENTEK_ELECTRONICS_CO_LTD",
	"0252":"MFG_ID_NORTH_CHINA_UNIVERSITY_OF_TECHNOLOGY",
	"0096":"MFG_ID_NORTHQ",
	"0040":"MFG_ID_NOVAR_ELECTRICAL_DEVICES_AND_SYSTEMS_EDS",
	"020D":"MFG_ID_NOVATEQNI_HK_LTD",
	"0119":"MFG_ID_OMNIMA_LIMITED",
	"014C":"MFG_ID_ONSITE_PRO",
	"0041":"MFG_ID_OPENPEAK_INC",
	"0104":"MFG_ID_PANASONIC_ELECTRIC_WORKS_CO_LTD",
	"0257":"MFG_ID_PARATECH",
	"0172":"MFG_ID_PASSIVSYSTEMS_LIMITED",
	"013D":"MFG_ID_PELLA",
	"0245":"MFG_ID_PERMUNDO_GMBH",
	"013C":"MFG_ID_PHILIO_TECHNOLOGY_CORP",
	"0150":"MFG_ID_PHYSICAL_GRAPH_CORPORATION",
	"007B":"MFG_ID_PITECH",
	"010E":"MFG_ID_POLYCONTROL",
	"0154":"MFG_ID_POPP_CO",
	"0170":"MFG_ID_POWERHOUSE_DYNAMICS",
	"0074":"MFG_ID_POWERLINX",
	"0016":"MFG_ID_POWERLYNX",
	"0042":"MFG_ID_PRAGMATIC_CONSULTING_INC",
	"0128":"MFG_ID_PRODRIVE_TECHNOLOGIES",
	"0161":"MFG_ID_PROMIXIS_LLC",
	"005D":"MFG_ID_PULSE_TECHNOLOGIES_ASPALIS",
	"0095":"MFG_ID_QEES",
	"012A":"MFG_ID_QOLSYS",
	"0130":"MFG_ID_QUBY",
	"0163":"MFG_ID_QUEENLOCK_IND_CO_LTD",
	"0142":"MFG_ID_RADEMACHER_GERATEELEKTRONIK_GMBH_CO_KG",
	"0098":"MFG_ID_RADIO_THERMOSTAT_COMPANY_OF_AMERICA_RTC",
	"008E":"MFG_ID_RARITAN",
	"021E":"MFG_ID_RED_BEE_CO_LTD",
	"0064":"MFG_ID_REITZGROUPDE",
	"022C":"MFG_ID_REMOTE_SOLUTION",
	"5254":"MFG_ID_REMOTEC",
	"0010":"MFG_ID_RESIDENTIAL_CONTROL_SYSTEMS_INC_RCS",
	"0216":"MFG_ID_RET_NANJING_INTELLIGENCE_SYSTEM_CO_LTD",
	"0153":"MFG_ID_REVOLV_INC",
	"0147":"MFG_ID_RIMPORT_LTD",
	"023B":"MFG_ID_ROCCONNECT_INC",
	"0197":"MFG_ID_RPE_AJAX_LLC_DBS_SECUR_LTD",
	"0065":"MFG_ID_RS_SCENE_AUTOMATION",
	"023C":"MFG_ID_SAFETECH_PRODUCTS",
	"0201":"MFG_ID_SAMSUNG_ELECTRONICS_CO_LTD",
	"022E":"MFG_ID_SAMSUNG_SDS",
	"0093":"MFG_ID_SAN_SHIH_ELECTRICAL_ENTERPRISE_CO_LTD",
	"012C":"MFG_ID_SANAV",
	"001F":"MFG_ID_SCIENTIA_TECHNOLOGIES_INC",
	"011E":"MFG_ID_SECURE_WIRELESS",
	"0167":"MFG_ID_SECURENET_TECHNOLOGIES",
	"0182":"MFG_ID_SECURIFI_LTD",
	"0069":"MFG_ID_SELUXIT",
	"0043":"MFG_ID_SENMATIC_AS",
	"019A":"MFG_ID_SENSATIVE_AB",
	"0044":"MFG_ID_SEQUOIA_TECHNOLOGY_LTD",
	"0151":"MFG_ID_SERCOMM_CORP",
	"0215":"MFG_ID_SHANGDONG_SMART_LIFE_DATA_SYSTEM_CO_LTD",
	"023E":"MFG_ID_SHANGHAI_DORLINK_INTELLIGENT_TECHNOLOGIES_CO_LTD",
	"0205":"MFG_ID_SHANGHAI_LONGCHUANG_ECOENERGY_SYSTEMS_CO_LTD",
	"010B":"MFG_ID_SHARP",
	"021A":"MFG_ID_SHENZHEN_AOYA_INDUSTRY_CO_LTD",
	"021C":"MFG_ID_SHENZHEN_ISURPASS_TECHNOLOGY_CO_LTD",
	"021D":"MFG_ID_SHENZHEN_KAADAS_INTELLIGENT_TECHNOLOGY_CO_LTD",
	"0211":"MFG_ID_SHENZHEN_LIAO_WANG_TONG_DA_TECHNOLOGY_LTD",
	"0258":"MFG_ID_SHENZHEN_NEO_ELECTRONICS_CO_LTD",
	"0250":"MFG_ID_SHENZHEN_TRIPATH_DIGITAL_AUDIO_EQUIPMENT_CO_LTD",
	"0081":"MFG_ID_SIEGENIAAUBI_KG",
	"0000":"MFG_ID_SIGMA_DESIGNS",
	"0045":"MFG_ID_SINE_WIRELESS",
	"0046":"MFG_ID_SMART_PRODUCTS_INC",
	"024F":"MFG_ID_SMARTLY_AS",
	"0102":"MFG_ID_SMK_MANUFACTURING_INC",
	"0047":"MFG_ID_SOMFY",
	"0254":"MFG_ID_SPECTRUM_BRANDS",
	"0124":"MFG_ID_SQUARE_CONNECT",
	"021B":"MFG_ID_STT_ELECTRIC_CORPORATION",
	"0259":"MFG_ID_STARKOFF",
	"0239":"MFG_ID_STELPRO",
	"0217":"MFG_ID_STRATTEC_ADVANCED_LOGIC_LLC",
	"0168":"MFG_ID_STRATTEC_SECURITY_CORPORATION",
	"0105":"MFG_ID_SUMITOMO",
	"0054":"MFG_ID_SUPERNA",
	"0191":"MFG_ID_SWANN_COMMUNICATIONS_PTY_LTD",
	"0009":"MFG_ID_SYLVANIA",
	"0136":"MFG_ID_SYSTECH_CORPORATION",
	"0235":"MFG_ID_TAEWON_LIGHTING_CO_LTD",
	"0186":"MFG_ID_TEAM_DIGITAL_LIMITED",
	"0089":"MFG_ID_TEAM_PRECISION_PCL",
	"0240":"MFG_ID_TECHNICOLOR",
	"000A":"MFG_ID_TECHNIKU",
	"012F":"MFG_ID_TECOM_CO_LTD",
	"0012":"MFG_ID_TELL_IT_ONLINE",
	"0176":"MFG_ID_TELLDUS_TECHNOLOGIES_AB",
	"0048":"MFG_ID_TELSEY",
	"017E":"MFG_ID_TELULAR",
	"005C":"MFG_ID_TERRA_OPTIMA_BV_PRIMAIR_SERVICES",
	"010C":"MFG_ID_THERE_CORPORATION",
	"019B":"MFG_ID_THERMOFLOOR",
	"022A":"MFG_ID_TIMEVALVE_INC",
	"0118":"MFG_ID_TKB_HOME",
	"011C":"MFG_ID_TKH_GROUP_EMINENT",
	"008B":"MFG_ID_TRANE_CORPORATION",
	"0066":"MFG_ID_TRICKLESTAR",
	"006B":"MFG_ID_TRICKLESTAR_LTD_EMPOWER_CONTROLS_LTD",
	"0055":"MFG_ID_TRIDIUM",
	"0049":"MFG_ID_TWISTHINK",
	"0152":"MFG_ID_UFAIRY_GR_TECH",
	"0193":"MFG_ID_UNIVERSAL_DEVICES_INC",
	"0020":"MFG_ID_UNIVERSAL_ELECTRONICS_INC",
	"0183":"MFG_ID_UNIVERSE_FUTURE",
	"0209":"MFG_ID_UTC_FIRE_AND_SECURITY_AMERICAS_CORP",
	"010A":"MFG_ID_VDA",
	"0198":"MFG_ID_VENSTAR_INC",
	"008C":"MFG_ID_VERA_CONTROL",
	"0080":"MFG_ID_VERO_DUCO",
	"0237":"MFG_ID_VESTEL_ELEKTRONIK_TICARET_VE_SANAYI_AS",
	"0053":"MFG_ID_VIEWSONIC",
	"005E":"MFG_ID_VIEWSONIC_CORPORATION",
	"0007":"MFG_ID_VIMAR_CRS",
	"0188":"MFG_ID_VIPASTAR",
	"0109":"MFG_ID_VISION_SECURITY",
	"004A":"MFG_ID_VISUALIZE",
	"0058":"MFG_ID_VITELEC",
	"0156":"MFG_ID_VIVINT",
	"017B":"MFG_ID_VSSAFETY_AS",
	"004B":"MFG_ID_WATT_STOPPER",
	"0008":"MFG_ID_WAYNE_DALTON",
	"019F":"MFG_ID_WEBEE_LIFE",
	"0171":"MFG_ID_WEBEHOME_AB",
	"011A":"MFG_ID_WENZHOU_MTLC_ELECTRIC_APPLIANCES_CO_LTD",
	"0057":"MFG_ID_WHIRLPOOL",
	"0149":"MFG_ID_WIDOM",
	"015D":"MFG_ID_WILLIS_ELECTRIC_CO_LTD",
	"012D":"MFG_ID_WILSHINE_HOLDING_CO_LTD",
	"017F":"MFG_ID_WINK_INC",
	"0097":"MFG_ID_WINTOP",
	"0242":"MFG_ID_WINYTECHNOLOGY",
	"0199":"MFG_ID_WIRELESS_MAINGATE_AB",
	"004C":"MFG_ID_WOODWARD_LABS",
	"0003":"MFG_ID_WRAP",
	"022F":"MFG_ID_WRT_INTELLIGENT_TECHNOLOGY_CO_LTD",
	"012E":"MFG_ID_WUHAN_NWD_TECHNOLOGY_CO_LTD",
	"004D":"MFG_ID_XANBOO",
	"004E":"MFG_ID_ZDATA_LLC",
	"016F":"MFG_ID_ZHEJIANG_JIUXING_ELECTRIC_CO_LTD",
	"0139":"MFG_ID_ZHOME",
	"0131":"MFG_ID_ZIPATO",
	"0120":"MFG_ID_ZONOFF",
	"004F":"MFG_ID_ZWAVE_TECHNOLOGIA",
	"0115":"MFG_ID_ZWAVEME",
	"024D":"MFG_ID_ZWORKS_INC",
	"0021":"MFG_ID_ZYKRONIX",
	"0135":"MFG_ID_ZYXEL",
}

var ALTUI_zWaveCommandClass = {
	"00":"COMMAND_CLASS_NO_OPERATION",
	"71":"COMMAND_CLASS_ALARM",
	"71_V2":"COMMAND_CLASS_ALARM_V2",
	"71_V3":"COMMAND_CLASS_NOTIFICATION_V3",
	"71_V4":"COMMAND_CLASS_NOTIFICATION_V4",
	"71_V5":"COMMAND_CLASS_NOTIFICATION_V5",
	"71_V6":"COMMAND_CLASS_NOTIFICATION_V6",
	"71_V7":"COMMAND_CLASS_NOTIFICATION_V7",
	"71_V8":"COMMAND_CLASS_NOTIFICATION_V8",
	"22":"COMMAND_CLASS_APPLICATION_STATUS",
	"9B":"COMMAND_CLASS_ASSOCIATION_COMMAND_CONFIGURATION",
	"85":"COMMAND_CLASS_ASSOCIATION",
	"85_V2":"COMMAND_CLASS_ASSOCIATION_V2",
	"95":"COMMAND_CLASS_AV_CONTENT_DIRECTORY_MD",
	"97":"COMMAND_CLASS_AV_CONTENT_SEARCH_MD",
	"96":"COMMAND_CLASS_AV_RENDERER_STATUS",
	"99":"COMMAND_CLASS_AV_TAGGING_MD",
	"36":"COMMAND_CLASS_BASIC_TARIFF_INFO",
	"50":"COMMAND_CLASS_BASIC_WINDOW_COVERING",
	"20":"COMMAND_CLASS_BASIC",
	"20_V2":"COMMAND_CLASS_BASIC_V2",
	"80":"COMMAND_CLASS_BATTERY",
	"2A":"COMMAND_CLASS_CHIMNEY_FAN",
	"46":"COMMAND_CLASS_CLIMATE_CONTROL_SCHEDULE",
	"81":"COMMAND_CLASS_CLOCK",
	"70":"COMMAND_CLASS_CONFIGURATION",
	"70_V2":"COMMAND_CLASS_CONFIGURATION_V2",
	"70_V3":"COMMAND_CLASS_CONFIGURATION_V3",
	"70_V4":"COMMAND_CLASS_CONFIGURATION_V4",
	"21":"COMMAND_CLASS_CONTROLLER_REPLICATION",
	"56":"COMMAND_CLASS_CRC_16_ENCAP",
	"3A":"COMMAND_CLASS_DCP_CONFIG",
	"3B":"COMMAND_CLASS_DCP_MONITOR",
	"4C":"COMMAND_CLASS_DOOR_LOCK_LOGGING",
	"62":"COMMAND_CLASS_DOOR_LOCK",
	"62_V2":"COMMAND_CLASS_DOOR_LOCK_V2",
	"62_V3":"COMMAND_CLASS_DOOR_LOCK_V3",
	"90":"COMMAND_CLASS_ENERGY_PRODUCTION",
	"7A":"COMMAND_CLASS_FIRMWARE_UPDATE_MD",
	"7A_V2":"COMMAND_CLASS_FIRMWARE_UPDATE_MD_V2",
	"7A_V3":"COMMAND_CLASS_FIRMWARE_UPDATE_MD_V3",
	"7A_V4":"COMMAND_CLASS_FIRMWARE_UPDATE_MD_V4",
	"7A_V5":"COMMAND_CLASS_FIRMWARE_UPDATE_MD_V5",
	"8C":"COMMAND_CLASS_GEOGRAPHIC_LOCATION",
	"7B":"COMMAND_CLASS_GROUPING_NAME",
	"82":"COMMAND_CLASS_HAIL",
	"39":"COMMAND_CLASS_HRV_CONTROL",
	"37":"COMMAND_CLASS_HRV_STATUS",
	"87":"COMMAND_CLASS_INDICATOR",
	"87":"COMMAND_CLASS_INDICATOR_V2",
	"9A":"COMMAND_CLASS_IP_CONFIGURATION",
	"89":"COMMAND_CLASS_LANGUAGE",
	"76":"COMMAND_CLASS_LOCK",
	"91":"COMMAND_CLASS_MANUFACTURER_PROPRIETARY",
	"72":"COMMAND_CLASS_MANUFACTURER_SPECIFIC",
	"72_V2":"COMMAND_CLASS_MANUFACTURER_SPECIFIC_V2",
	"EF":"COMMAND_CLASS_MARK",
	"35":"COMMAND_CLASS_METER_PULSE",
	"3C":"COMMAND_CLASS_METER_TBL_CONFIG",
	"3D":"COMMAND_CLASS_METER_TBL_MONITOR",
	"3D_V2":"COMMAND_CLASS_METER_TBL_MONITOR_V2",
	"3E":"COMMAND_CLASS_METER_TBL_PUSH",
	"32":"COMMAND_CLASS_METER",
	"32_V2":"COMMAND_CLASS_METER_V2",
	"32_V3":"COMMAND_CLASS_METER_V3",
	"32_V4":"COMMAND_CLASS_METER_V4",
	"51":"COMMAND_CLASS_MTP_WINDOW_COVERING",
	"8E_V2":"COMMAND_CLASS_MULTI_CHANNEL_ASSOCIATION_V2",
	"8E_V3":"COMMAND_CLASS_MULTI_CHANNEL_ASSOCIATION_V3",
	"60_V2":"COMMAND_CLASS_MULTI_CHANNEL_V2",
	"60_V3":"COMMAND_CLASS_MULTI_CHANNEL_V3",
	"60_V4":"COMMAND_CLASS_MULTI_CHANNEL_V4",
	"8F":"COMMAND_CLASS_MULTI_CMD",
	"8E":"COMMAND_CLASS_MULTI_INSTANCE_ASSOCIATION",
	"60":"COMMAND_CLASS_MULTI_INSTANCE",
	"52":"COMMAND_CLASS_NETWORK_MANAGEMENT_PROXY",
	"52_V2":"COMMAND_CLASS_NETWORK_MANAGEMENT_PROXY_V2",
	"4D":"COMMAND_CLASS_NETWORK_MANAGEMENT_BASIC",
	"4D_V2":"COMMAND_CLASS_NETWORK_MANAGEMENT_BASIC_V2",
	"34":"COMMAND_CLASS_NETWORK_MANAGEMENT_INCLUSION",
	"34_V2":"COMMAND_CLASS_NETWORK_MANAGEMENT_INCLUSION_V2",
	"00":"COMMAND_CLASS_NO_OPERATION",
	"77":"COMMAND_CLASS_NODE_NAMING",
	"F0":"COMMAND_CLASS_NON_INTEROPERABLE",
	"73":"COMMAND_CLASS_POWERLEVEL",
	"41":"COMMAND_CLASS_PREPAYMENT_ENCAPSULATION",
	"3F":"COMMAND_CLASS_PREPAYMENT",
	"88":"COMMAND_CLASS_PROPRIETARY",
	"75":"COMMAND_CLASS_PROTECTION",
	"75_V2":"COMMAND_CLASS_PROTECTION_V2",
	"48":"COMMAND_CLASS_RATE_TBL_CONFIG",
	"49":"COMMAND_CLASS_RATE_TBL_MONITOR",
	"7C":"COMMAND_CLASS_REMOTE_ASSOCIATION_ACTIVATE",
	"7D":"COMMAND_CLASS_REMOTE_ASSOCIATION",
	"2B":"COMMAND_CLASS_SCENE_ACTIVATION",
	"2C":"COMMAND_CLASS_SCENE_ACTUATOR_CONF",
	"2D":"COMMAND_CLASS_SCENE_CONTROLLER_CONF",
	"4E":"COMMAND_CLASS_SCHEDULE_ENTRY_LOCK",
	"4E_V2":"COMMAND_CLASS_SCHEDULE_ENTRY_LOCK_V2",
	"4E_V3":"COMMAND_CLASS_SCHEDULE_ENTRY_LOCK_V3",
	"93":"COMMAND_CLASS_SCREEN_ATTRIBUTES",
	"93_V2":"COMMAND_CLASS_SCREEN_ATTRIBUTES_V2",
	"92":"COMMAND_CLASS_SCREEN_MD",
	"92_V2":"COMMAND_CLASS_SCREEN_MD_V2",
	"24":"COMMAND_CLASS_SECURITY_PANEL_MODE",
	"2F":"COMMAND_CLASS_SECURITY_PANEL_ZONE_SENSOR",
	"2E":"COMMAND_CLASS_SECURITY_PANEL_ZONE",
	"98":"COMMAND_CLASS_SECURITY",
	"9C":"COMMAND_CLASS_SENSOR_ALARM",
	"30":"COMMAND_CLASS_SENSOR_BINARY",
	"30_V2":"COMMAND_CLASS_SENSOR_BINARY_V2",
	"9E":"COMMAND_CLASS_SENSOR_CONFIGURATION",
	"9D":"COMMAND_CLASS_SILENCE_ALARM",
	"94":"COMMAND_CLASS_SIMPLE_AV_CONTROL",
	"27":"COMMAND_CLASS_SWITCH_ALL",
	"25":"COMMAND_CLASS_SWITCH_BINARY",
	"25_V2":"COMMAND_CLASS_SWITCH_BINARY_V2",
	"26":"COMMAND_CLASS_SWITCH_MULTILEVEL",
	"26_V2":"COMMAND_CLASS_SWITCH_MULTILEVEL_V2",
	"26_V3":"COMMAND_CLASS_SWITCH_MULTILEVEL_V3",
	"26_V4":"COMMAND_CLASS_SWITCH_MULTILEVEL_V4",
	"28":"COMMAND_CLASS_SWITCH_TOGGLE_BINARY",
	"29":"COMMAND_CLASS_SWITCH_TOGGLE_MULTILEVEL",
	"4A":"COMMAND_CLASS_TARIFF_CONFIG",
	"4B":"COMMAND_CLASS_TARIFF_TBL_MONITOR",
	"44":"COMMAND_CLASS_THERMOSTAT_FAN_MODE",
	"44_V2":"COMMAND_CLASS_THERMOSTAT_FAN_MODE_V2",
	"44_V3":"COMMAND_CLASS_THERMOSTAT_FAN_MODE_V3",
	"44_V4":"COMMAND_CLASS_THERMOSTAT_FAN_MODE_V4",
	"45":"COMMAND_CLASS_THERMOSTAT_FAN_STATE",
	"45_V2":"COMMAND_CLASS_THERMOSTAT_FAN_STATE_V2",
	"38":"COMMAND_CLASS_THERMOSTAT_HEATING",
	"40":"COMMAND_CLASS_THERMOSTAT_MODE",
	"40_V2":"COMMAND_CLASS_THERMOSTAT_MODE_V2",
	"40_V3":"COMMAND_CLASS_THERMOSTAT_MODE_V3",
	"42":"COMMAND_CLASS_THERMOSTAT_OPERATING_STATE",
	"42_V2":"COMMAND_CLASS_THERMOSTAT_OPERATING_STATE_V2",
	"47":"COMMAND_CLASS_THERMOSTAT_SETBACK",
	"43":"COMMAND_CLASS_THERMOSTAT_SETPOINT",
	"43_V2":"COMMAND_CLASS_THERMOSTAT_SETPOINT_V2",
	"43_V3":"COMMAND_CLASS_THERMOSTAT_SETPOINT_V3",
	"8B":"COMMAND_CLASS_TIME_PARAMETERS",
	"8A":"COMMAND_CLASS_TIME",
	"8A_V2":"COMMAND_CLASS_TIME_V2",
	"55_V2":"COMMAND_CLASS_TRANSPORT_SERVICE_V2",
	"55":"COMMAND_CLASS_TRANSPORT_SERVICE",
	"63":"COMMAND_CLASS_USER_CODE",
	"86":"COMMAND_CLASS_VERSION",
	"86_V2":"COMMAND_CLASS_VERSION_V2",
	"84":"COMMAND_CLASS_WAKE_UP",
	"84_V2":"COMMAND_CLASS_WAKE_UP_V2",
	"4F":"COMMAND_CLASS_ZIP_6LOWPAN",
	"23":"COMMAND_CLASS_ZIP",
	"23_V2":"COMMAND_CLASS_ZIP_V2",
	"23_V3":"COMMAND_CLASS_ZIP_V3",
	"57":"COMMAND_CLASS_APPLICATION_CAPABILITY",
	"33":"COMMAND_CLASS_SWITCH_COLOR",
	"33_V2":"COMMAND_CLASS_SWITCH_COLOR_V2",
	"33_V3":"COMMAND_CLASS_SWITCH_COLOR_V3",
	"53":"COMMAND_CLASS_SCHEDULE",
	"53_V2":"COMMAND_CLASS_SCHEDULE_V2",
	"53_V3":"COMMAND_CLASS_SCHEDULE_V3",
	"54":"COMMAND_CLASS_NETWORK_MANAGEMENT_PRIMARY",
	"58":"COMMAND_CLASS_ZIP_ND",
	"59":"COMMAND_CLASS_ASSOCIATION_GRP_INFO",
	"59_V2":"COMMAND_CLASS_ASSOCIATION_GRP_INFO_V2",
	"59_V3":"COMMAND_CLASS_ASSOCIATION_GRP_INFO_V3",
	"5A":"COMMAND_CLASS_DEVICE_RESET_LOCALLY",
	"5B":"COMMAND_CLASS_CENTRAL_SCENE",
	"5B_V2":"COMMAND_CLASS_CENTRAL_SCENE_V2",
	"5B_V3":"COMMAND_CLASS_CENTRAL_SCENE_V3",
	"5C":"COMMAND_CLASS_IP_ASSOCIATION",
	"5D":"COMMAND_CLASS_ANTITHEFT",
	"5D_V2":"COMMAND_CLASS_ANTITHEFT_V2",
	"5E":"COMMAND_CLASS_ZWAVEPLUS_INFO",
	"5E_V2":"COMMAND_CLASS_ZWAVEPLUS_INFO_V2",
	"5F":"COMMAND_CLASS_ZIP_GATEWAY",
	"61":"COMMAND_CLASS_ZIP_PORTAL",
	"65":"COMMAND_CLASS_DMX",
	"66":"COMMAND_CLASS_BARRIER_OPERATOR",
	"67":"COMMAND_CLASS_NETWORK_MANAGEMENT_INSTALLATION_MAINTENANCE",
	"68":"COMMAND_CLASS_ZIP_NAMING",
	"69":"COMMAND_CLASS_MAILBOX",
	"6A":"COMMAND_CLASS_WINDOW_COVERING",
	"9F":"COMMAND_CLASS_SECURITY_2",
	"6B":"COMMAND_CLASS_IRRIGATION",
	"6C":"COMMAND_CLASS_SUPERVISION",
	"64":"COMMAND_CLASS_HUMIDITY_CONTROL_SETPOINT",
	"6D":"COMMAND_CLASS_HUMIDITY_CONTROL_MODE",
	"6E":"COMMAND_CLASS_HUMIDITY_CONTROL_OPERATING_STATE",
	"6F":"COMMAND_CLASS_ENTRY_CONTROL",
	"74":"COMMAND_CLASS_INCLUSION_CONTROLLER",
};

var UserDataHelper = (function(user_data) {
	var _user_data = user_data;
	return {
		findSceneIdxByID : function(scid) {
			for (var i=0; i<_user_data.scenes.length; i++ ) {
				if (_user_data.scenes[i].id==scid)
					return i;
			}
			return -1;
		},
		findDeviceIdxByID : function (devid) {
			for (var i=0; i<_user_data.devices.length; i++ ) {
				if (_user_data.devices[i].id==devid)
					return i;
			}
			return -1;
		},
		getDeviceByID : function ( devid ) {
			var idx = this.findDeviceIdxByID(devid);
			if (idx!=-1) {
				return _user_data.devices[idx];
			}
			return null;
		},
		isDeviceZwave : function (device) {
			if (device && device.id_parent) {
				var parent = this.getDeviceByID( device.id_parent );
				if (parent) {
					if (parent.device_type == "urn:schemas-micasaverde-com:device:ZWaveNetwork:1")
						return true;
					if (parent.device_type == "urn:schemas-upnp-org:device:razb:1")
						return true;
				}
			}
			return false;
		},
		isDeviceZigbee : function (device) {
			if (device && device.id_parent) {
				var parent = this.getDeviceByID( device.id_parent );
				if (parent) {
					if (parent.device_type == "urn:schemas-micasaverde-com:device:ZigbeeNetwork:1")
						return true;
				}
			}
			return false;
		},
		isDeviceBT : function (device) {
			if (device && device.id_parent) {
				var parent = this.getDeviceByID( device.id_parent );
				if (parent) {
					if (parent.device_type == "urn:schemas-micasaverde-com:device:BluetoothNetwork:1")
						return true;
				}
			}
			return false;
		},
		getStatus : function( deviceid, service, variable ) {
			for ( var idx=0; idx<_user_data.devices.length; idx++) {
				var device = _user_data.devices[idx];
				if (device.id==deviceid) {
					for (var stateidx=0; stateidx<device.states.length; stateidx++) {
						var state = device.states[stateidx];
						if ((state.service==service) && (state.variable==variable)) {
							return state.value;
						}
					}
				}
			}
			return null;
		},
		getCategoryTitle : function(catnum) {
			if (catnum==undefined)
				return '';

			var found=undefined;
			$.each(_user_data.category_filter, function(idx,catline) {
				if ($.inArray(catnum.toString() , catline.categories) !=-1)
				{
					found = catline.Label.text;
					return false; //break the loop
				}
			});
			return (found !=undefined) ? found : '';
		},
		evaluateConditions : function(deviceid,devcat,devsubcat,conditions) {
			var bResult = false;
			var expressions=[];
			var that = this;
			var cache = {}
			
			function _matchCondition( condition, devcat, devsubcat ) {
				function _matchCat( condition, devcat ) {
					return  (condition.category_num==undefined) || 
							// (condition.category_num==0) ||
							// (devcat==0) ||
							(condition.category_num==devcat)
				}
				function _matchSubCat( condition, devsubcat ) {
					return  (condition.subcategory_num==undefined) || 
							// (condition.subcategory_num==0) ||
							// (devsubcat==0) ||
							(condition.subcategory_num==devsubcat)
				}
				if (condition.service==null || condition.variable==null) 
					return false;
				if (condition.subcategory_num==undefined && condition.category_num==undefined )
					return true;
				if (_matchCat( condition, devcat ))
					return _matchSubCat( condition, devsubcat )
				return false;
			}
			
			function _getStatus(deviceid,service,variable) {
				if (cache[service] == undefined)
					cache[service]={}

				if (cache[service] [variable]  !=  undefined)
					return cache[service] [variable] ;

				cache[service] [variable] = that.getStatus( deviceid, service,variable )
				return cache[service] [variable] ;
			}
			
			for (var i=0; i<conditions.length; i++) {
				var condition = conditions[i];
				// strange device JSON sometime ... ex zWave repeater, condition is not defined
				if ( _matchCondition(condition,devcat,devsubcat) )
				{
					var str = "";
					if (isInteger( condition.value )) {
						var val = _getStatus( deviceid, condition.service, condition.variable );
						if (val=="")
							AltuiDebug.debug( "devid:{0} service:{1} variable:{2} devsubcat:{3} value:'{4}' should not be null".format(
								deviceid,
								condition.service,
								condition.variable,
								devsubcat,
								val));
						str = "({0} {1} {2})".format(
							val || 0,
							condition.operator,
							condition.value
						);
					}
					else {
						str = "('{0}' {1} '{2}')".format(
							that.getStatus( deviceid, condition.service, condition.variable ),
							condition.operator,
							condition.value
						);
					}
					expressions.push(str);
				}
				else {
					AltuiDebug.debug("Invalid State Icon condition definition for deviceid:{0} devsubcat:{1} condition:{2}".format(deviceid,devsubcat,JSON.stringify(condition)) );
				}
			}
			var str = expressions.join(" && ");
			var bResult = eval(str) ;
			return (bResult==undefined) ? false : bResult ;
		},
		// load actions from S files
		_loadDeviceActions : function (controller,dt,cbfunc) {
			function __findAction(actions,name) {
				var bfound = null;
				$.each(actions,function(i,o) {
					if (o.name==name) {
						bfound = o;
						return false;
					}
				});
				return bfound;
			}
			if (dt && dt.Services) {
				var todo = dt.Services.length;
				if (todo==0)
					cbfunc(dt.Services);
				$.each(dt.Services, function (idx,service) {
					// warning, async call, so result comes later. we need to wait until completion
					var that = service.Actions;
					// if (that.length==0)	// if actions are not already loaded
					// {
						FileDB.getFileContent(controller,service.SFilename , function( xmlstr ) {
							var xml = $( $.parseXML( xmlstr ) );
							$.each(xml.find("action"), function( idx,action) {
								// var name = $(action).find("name").first().text();	// action name is the first one
								var name = $(action).find(">name").text();	// action name is the first one
								if (__findAction(that,name)==null)
								{
									var input=[];
									var output=[];
									$.each( $(action).find("argument"), function( idx,argument) {
										var direction = $(argument).find("direction").text();
										var name = $(argument).find("name").text();
										if (direction == "in")
											input.push( name );
										else
											output.push( name );
									});
									that.push( {
										name : name,
										input : input,
										output : output
									} );
								}
							});
							todo--;
							if (todo==0)
								cbfunc(dt.Services);
						});
					// }
					// else		// actions were already loaded
					// {
						// cbfunc(dt.Services);
					// }
				});
				return;
			} else
				cbfunc([]);
			//AltuiDebug.debug("_loadDeviceActions() : no services");
			return;
		},
		getDeviceActions : function (device,cbfunc) {
			if (device && device.id!=0) {
				var controller = MultiBox.controllerOf(device.altuiid).controller;
				var _devicetypesDB = MultiBox.getDeviceTypesDB(controller);
				var dt = _devicetypesDB[device.device_type];
				this._loadDeviceActions(controller,dt,cbfunc);
			}
			else {
				//AltuiDebug.debug("_getDeviceActions(null) : null device");
				cbfunc([]);
			}
		},
	};
});

var VeraBox = ( function( uniq_id, ip_addr ) {

  //---------------------------------------------------------
  // private functions
  //---------------------------------------------------------
	var ctrlOptions = g_ALTUI.g_CtrlOptions.split(",");
	var LU_STATUS_MINDELAY=	 parseInt(ctrlOptions[0]) || 1500;
	var LU_STATUS_TIMEOUT= parseInt(ctrlOptions[1]) || 60;

	var _uniqID = uniq_id;								// assigned by Multibox, unique, can be used for Settings & other things
	var _bStopEngine = true;
	var _hagdevice = { id: 0, altuiid:"{0}-0".format(_uniqID) };							// special device for HAG, service=S_HomeAutomationGateway1.xml
	var _upnpHelper = new UPnPHelper(ip_addr,uniq_id);			// for common UPNP ajax
	var _dataEngine = null;
	var _sysinfo = null;
	var _rooms = null;
	var _scenes = null;
	var _devices = null;
	var _categories = null;
	var _sceneActiveStatus = {};		// indexed by scid , gives the latest active status
	var _devicetypes = {};
	var _user_data = {};
	var _change_cached_user_data = {};
	var _user_data_DataVersion = 1;
	var _user_data_LoadTime = null;
	var _status_data_DataVersion = 1;
	var _status_data_LoadTime = null;

	// setters to set the data in the cache, cb functions because asynchronous
	function _setRooms(arr)			{	_rooms = arr ? arr.sort(altuiSortByName) : arr;		};
	function _setScenes(arr)		{	_scenes = arr ? arr.sort(altuiSortByName) : arr;		};
	function _setCategories(arr)	{	_categories = arr ? arr.sort(altuiSortByName) : arr;	};
	function _setDevices(arr)		{	_devices = arr ? arr.sort(altuiSortByName) : arr;		};

	function _saveChangeCaches( msgidx ) {
		var promise = _upnpHelper.ModifyUserData( _change_cached_user_data, function() {
			PageMessage.message("ModifyUserData called & returned, a restart will occur now","success");
			PageMessage.clearMessage(msgidx);
		});
		_change_cached_user_data={};
		user_changes=0;	//UI5 compat
		return promise;
	};

	function _updateChangeCache( target ) {
		$.extend(true, _change_cached_user_data, target);
		PageMessage.message("You need to save your changes","info", true );
		user_changes=1; //UI5 compat
	};

	function _initializeSysinfo() {
		if (_sysinfo!=null)
			return _sysinfo;
		var url = _upnpHelper.getUrlHead().replace('/port_3480','').replace('/data_request','/cgi-bin/cmh/sysinfo.sh');
		url = _upnpHelper.proxify( url );
		var jqxhr = $.ajax( {
			url: url,
			type: "GET",
			async:false,
			//dataType: "text",
		})
		.done(function(data, textStatus, jqXHR) {
			_upnpHelper.unproxifyResult.apply(this,[data, textStatus, jqXHR, function(data,textStatus,jqXHR) {
				if (isNullOrEmpty(data))
					_sysinfo=={};
				else if ($.isPlainObject( data ))
					_sysinfo = data;
				else
					_sysinfo = JSON.parse(data);
			}]);
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			PageMessage.message( _T("Controller {0} did not respond").format(_upnpHelper.getIpAddr()) , "warning");
			_sysinfo = {};
		});
		return _sysinfo;
	};

	function _initializeJsonp() {
		jsonp={};
		jsonp.ud =_user_data;
		return jsonp;
	};

	function _httpGet(url,opts,cbfunc) {
		var options = $.extend( true,
			{
				url:	_upnpHelper.proxify( _upnpHelper.getUrlHead()+url ),
				method:	"GET",
				type: "GET",
				dataType: "text",
				cache:	false
			} , opts);

		var jqxhr = $.ajax( options)
				.done(function(data, textStatus, jqXHR) {
					_upnpHelper.unproxifyResult.apply(this,[data, textStatus, jqXHR, function(data,textStatus,jqXHR) {
						if ($.isFunction(cbfunc))
							(cbfunc)(data, textStatus, jqXHR);
					}]);
				})
				.fail(function(jqXHR, textStatus, errorThrown) {
					PageMessage.message( _T("Controller {0} did not respond").format(_upnpHelper.getIpAddr()) , "warning");
					if ($.isFunction(cbfunc))
						(cbfunc)(null, textStatus, jqXHR);
				});
		return jqxhr;
	};

	function _triggerAltUIUpgrade(newversion,newtracnum) {
		var url = '?id=action&serviceId=urn:micasaverde-com:serviceId:HomeAutomationGateway1&action=CreatePlugin&PluginNum=8246&Version={1}&TracRev={0}'.format(newversion,newtracnum);
		return _httpGet(url,{}).always( function() {
			PageMessage.message(_T("Upgrade Request succeeded, a Luup reload will happen"),"success");
		});
	};

	function _reboot()
	{
		return this.runLua("os.execute('reboot')", function(res) {
			res = $.extend({success:false, result:"",output:""},res);
			if ( res.success ==true )
				PageMessage.message( "Reboot request succeeded", "success");
			else
				PageMessage.message( "Reboot request failed", "danger");
		});
	};
	function _modifyDevice(deviceid,cbfunc) {
		var device = _getDeviceByID( deviceid );
		if (device==null)
			return null;
		return _upnpHelper.modifyDevice(device,cbfunc);
	};
	function _modifyPlugin(id,changes,cb) {
		var plugin = _getPluginByID( id );
		if (plugin==null)
			return null;
		return _upnpHelper.modifyPlugin(plugin,changes,cb);
	};
	function _reloadEngine()
	{
		return _upnpHelper.reloadEngine( function(data) {
			if (data!=null) {
				// reload worked,  reset all cache
				_rooms = null;
				_devices = null;
				_scenes = null;
				_devicetypes = [];
				_change_cached_user_data={};
				user_changes=0;	//UI5 compat
			}
		});
	};

	function _getFileUrl( filename ) {
		return _upnpHelper.buildUPnPGetFileUrl(filename)
	};

	function _getFileContent( filename , cbfunc) {
		return _upnpHelper.UPnPGetFile( filename, cbfunc);
	};

	// process the async response function
	function _asyncResponse( arr, func , filterfunc, endfunc ) {
		arr = arr || [];
		if (arr!=null) {
			if ($.isFunction(filterfunc))
				arr = $.grep( arr, filterfunc );
			if ($.isFunction( func )) {
				for (var idx=0; idx<arr.length; idx++) {
					func(idx+1,arr[idx]);	// device id in Lua is idx+1
				}
			}
		};
		if ( $.isFunction( endfunc ) )	{
			endfunc(arr);
		}
		return arr;
	};

	function _getPower(cbfunc) {
		var jqxhr = _httpGet("?id=live_energy_usage",{dataType: "text"},cbfunc);
		// jqxhr= jqxhr.fail(function(jqXHR, textStatus) {
				// PageMessage.message( _T("Controller {0} is busy, be patient.").format(_upnpHelper.getIpAddr()) , "warning");
			// });
		return jqxhr;
	};

	function _setColor(deviceid, hex) {
		var rgb = hexToRgb(hex)
		_upnpHelper.UPnPAction(deviceid,'urn:micasaverde-com:serviceId:Color1','SetColorRGB', {
			newColorRGBTarget: "{0},{1},{2}".format(rgb.r,rgb.g,rgb.b)
		})
		// http://192.168.1.16/port_3480/data_request?id=lu_action&output_format=json&DeviceNum=231&serviceId=urn:micasaverde-com:serviceId:Color1&action=SetColorRGB&newColorRGBTarget=15,1,249&rand=0.740677387919277

		// var data = '51 5 10 0 0 1 0 2 {0} 3 {1} 4 {2}'.format(rgb.r,rgb.g,rgb.b);
		// _upnpHelper.UPnPAction( 1, 'urn:micasaverde-com:serviceId:ZWaveNetwork1', 'SendData', {
			// Node:device.altid,
			// Data:data
		// });

		// 51 = Color Control Command Class (0x33)
		// 5 = Color Set Command
		// 10 = Size of following data
		// 0 = Warm White colour channel
		// 0 = OFF @ 0
		// 1 = Cool White colour channel
		// 0 = OFF @ 0
		// 2 = Red colour channel
		// 50 = ON @ 50
		// 3 = Green colour channel
		// 75 = ON @ 75
		// 4 = Blue colour channel
		// 125 = ON @ 125
	};

	function _getWeatherSettings()
	{
		var target = {tempFormat: "", weatherCountry: "", weatherCity: ""};
		$.extend(target, _user_data.weatherSettings);
		return target;
	}

	// Get Rooms  , call a callback function asynchronously, or return array of rooms
	function _getRooms( func , filterfunc, endfunc) {
		if (_rooms != null ) {
			return _asyncResponse( _rooms, func , filterfunc, endfunc)
		}
		else
			setTimeout(function(){
				_getRooms( func , filterfunc, endfunc);
			}, 500);
		return _rooms;
	};

	function _getRoomByID( roomid ) {
		var room=null;
		if ( _rooms ) {
			$.each(_rooms, function( idx,r) {
				if (r.id==roomid) {
					room = r;
					return false;
				}
			});
		}
		return room;
	};

	// Get Rooms  , call a callback function asynchronously, or return array of rooms
	function _getScenes( func , filterfunc, endfunc ) {
		if (_scenes != null )
			return _asyncResponse( _scenes, func , filterfunc, endfunc);
		return _asyncResponse( [], func , filterfunc, endfunc);;
	};

	function _getUsers(func , filterfunc, endfunc ) {
		if (_user_data.users !=null )
			return _asyncResponse( _user_data.users.sort(altuiSortByName2), func , filterfunc, endfunc);
		return _user_data.users;
	};
	function _getUsersSync() {
		return _user_data.users;
	};
	function _getUserByID(userid) {
		var user=null;
		if ( _user_data.users ) {
			$.each(_user_data.users, function( idx,usr) {
				if (usr.id==userid) {
					user = usr;
					return false;
				}
			});
		}
		return user;
	};
	function _getPlugins( func , endfunc ) {
		if (_user_data.InstalledPlugins2)
			return _asyncResponse( _user_data.InstalledPlugins2, func , null, endfunc);
		return _user_data.InstalledPlugins2;
	};

	function _getPluginByID	(id) {
		var plugin = null;
		$.each(_user_data.InstalledPlugins2,function(idx,p) {
			if (p.id==id) {
				plugin = p;
				return false;
			}
		});
		return plugin;
	};

	function _getDevices( func , filterfunc, endfunc) {
		if (_devices !=null)
			return _asyncResponse( _devices, func, filterfunc, endfunc )
		return _asyncResponse( [], func, filterfunc, endfunc );
	};
	function _getCategories( cbfunc, filterfunc, endfunc )
	{
		//http://192.168.1.16:3480/data_request?id=sdata&output_format=json
		if (_categories==null) {
			var jqxhr = _httpGet("?id=sdata&output_format=json",{},function(data, textStatus, jqXHR) {
				if (data) {
					var arr = JSON.parse(data);
					_setCategories(arr.categories)
					if ( $.isFunction( cbfunc ) )  {
						_asyncResponse( _categories, cbfunc, filterfunc, endfunc );
					}
				} else {
					_setCategories(null);
					_asyncResponse( [], cbfunc, filterfunc, endfunc );
					// PageMessage.message( _T("Controller {0} is busy, be patient.").format(_upnpHelper.getIpAddr()) , "warning");
				}
			});
			return [];
		}
		return _asyncResponse( _categories, cbfunc, filterfunc, endfunc );
	};

	function _getIconPath(name) {
		if (_uniqID==0) {
			return "../cmh/skins/default/img/devices/device_states/{0}".format( name);
		}
		return "//{0}/cmh/skins/default/img/devices/device_states/{1}".format( _upnpHelper.getIpAddr(), name);
	};

	function _getIconContent( imgpath , cbfunc ) {
		var jqxhr = _httpGet("?id=lr_ALTUI_Handler&command=image",{ data: { path: imgpath } },cbfunc);
		return jqxhr;
	};

	function _loadIcon( imgpath , cbfunc ) {
		var options = {
			url:	_upnpHelper.proxify( imgpath ),
			dataType: "text",
			crossDomain: true,
			cache:false,
			//async:false			CORS does not support async
		}
		var jqxhr = _httpGet("",options, function(data) {
			(cbfunc)(data)
		})
		return jqxhr;
	};

	function _isWorkflowEnabled() {
		var altuidevice = MultiBox.getDeviceByID( 0, g_ALTUI.g_MyDeviceID );
		var variable = MultiBox.getStatus( altuidevice, "urn:upnp-org:serviceId:altui1", "EnableWorkflows" ) || "0";
		return (parseInt(variable)==1)
	};

	function _getCustomPages(cbfunc) {
		var jqxhr = _httpGet("?id=lr_ALTUI_Handler&command=getCustomPages",{dataType: "json",},cbfunc);
		return jqxhr;
	};

	function _getWorkflowStatus(cbfunc) {
		var jqxhr = _httpGet("?id=lr_ALTUI_Handler&command=getWorkflowsStatus",{dataType: "json",},cbfunc);
		return jqxhr;
	};

	function _getWorkflows(cbfunc) {
		var jqxhr = _httpGet("?id=lr_ALTUI_Handler&command=getWorkflows",{dataType: "json",},cbfunc);
		return jqxhr;
	};

	function _forceRefreshWorkflows(cbfunc) {
		var jqxhr = _httpGet("?id=lr_ALTUI_Handler&command=refreshWorkflows",{dataType: "json",},cbfunc);
		return jqxhr;
	}
	
	function _getWorkflowHistory(altuiid,cbfunc) {
		// var cmd = "cat /var/log/cmh/LuaUPnP.log | grep 'Wkflow - nextWorkflowState('".format(altuiid);
		// var cmd = "tail -n 2000 /var/log/cmh/LuaUPnP.log | grep '[0123456789]: ALTUI: Wkflow - nextWorkflowState(.*, {0},.*==>'".format(altuiid);
		// Wkflow - Workflow:'Workflow 0-2' nextWorkflowState(0-2, Thingspeak ==> Idle, Timer:Retour)

		var str = (altuiid) ? altuiid : "[0123456789]{1,}-[0123456789]{1,}"
		var cmd = "cat /var/log/cmh/LuaUPnP.log | grep -E '[0123456789]: ALTUI: Wkflow - Workflow: {0}, Valid Transition found'".format(str);
		return _osCommand(cmd,true,function(str) {
			if (str.success==true) {
				var lines = [];
				var re = /\d*\t(\d*)\/(\d*)\/(\d*)\s(\d*):(\d*):(\d*).(\d*).*Wkflow - Workflow: (.*), Valid Transition found:(.*), Active State:(.*)=>(.*) /g;
				var m;
				while ((m = re.exec(str.result)) !== null) {
					if (m.index === re.lastIndex) {
						re.lastIndex++;
					}
					// View your result using the m-variable.
					// eg m[0] etc.
					lines.push({
						date:new Date(2000+parseInt(m[3]),parseInt(m[1])-1,m[2],m[4],m[5],m[6],m[7]),
						altuiid:m[8],
						firing_link:m[9],
						old_state:m[10],
						new_state:m[11]
						});
				}
				if ($.isFunction(cbfunc)) {
						cbfunc(lines)
				}
			}
		});
	};
	function _getHouseMode(cbfunc) {
		var jqxhr = _httpGet("?id=variableget&DeviceNum=0&serviceId=urn:micasaverde-com:serviceId:HomeAutomationGateway1&Variable=Mode",{},cbfunc);
		return jqxhr;
	};

	function _setHouseMode(newmode,cbfunc) {
		var promise = null;
		if ((newmode<=4) && (newmode>=1)) {
			promise = _upnpHelper.UPnPAction( 0, 'urn:micasaverde-com:serviceId:HomeAutomationGateway1', 'SetHouseMode', { Mode:newmode },cbfunc );
		}
		return promise;
	};
	function _getHouseModeSwitchDelay() {
		if ( _isUI5() == true )	// UI5 or not ready
			return 12;
		return ( parseInt(_user_data.mode_change_delay || 9) +3);
	};

	function _getMajorMinor() {
		var bi = _getBoxFullInfo()
		if (bi.ShortVersion) {
			var results = bi.ShortVersion.match(/(\d+)\.(\d+)/)
			if ( results.length >2 )
				return {
					major: parseInt(results[1]),
					minor: parseInt(results[2])
				}
		}
		return null 	// UNKNOWN
	};

	function _candoCORS(user_data) {
		return (_user_data.AllowCORS == "1")
	};
	
	function _enableNightlyHeal(bEnableOrNull, cbfunc) {
		var value = _user_data.EnableNightlyHeal
		if (bEnableOrNull != null) {
			var value = bEnableOrNull ? 1 : 0 
			var jqxhr = _httpGet("?id=variableset&Variable=EnableNightlyHeal&Value="+value,{},function(){
				_user_data.EnableNightlyHeal = value.toString();
				if ($.isFunction(cbfunc)) { 
				    (cbfunc)();
			    }
			});
			return jqxhr
		}
		return (value=="0") ? false : true  
	};

	function _enableCORS( bEnable , cbfunc ) {
		//Example request:
		// http://IP:3480/data_request?id=variableset&Variable=AllowCORS&Value=1 //enable
		// http://IP:3480/data_request?id=variableset&Variable=AllowCORS&Value=0 //disable
		var value = (bEnable==true) ? 1 : 0
		var jqxhr = _httpGet("?id=variableset&Variable=AllowCORS&Value="+value,{},function(){
			_user_data.AllowCORS = value.toString();
			if ($.isFunction(cbfunc)) {
				(cbfunc)();
			}
		});
		return jqxhr;
	};

	function _getDeviceByType( device_type , opt_parents_arr) {
		for (var i=0; i<_user_data.devices.length; i++ ) {
			if	( (_user_data.devices[i].device_type==device_type) && (opt_parents_arr==undefined || opt_parents_arr.indexOf(_user_data.devices[i].id_parent)!=-1) )
				return _user_data.devices[i]
		}
		return null;
	};

	function _getDeviceByAltID( parentdevid , altid ) {
		for (var i=0; i<_user_data.devices.length; i++) {
			var device = _user_data.devices[i];
			if ( (device.id_parent==parentdevid) && (device.altid==altid) )
				return _user_data.devices[i];
		}
		return null;
	};

	function _getDeviceByID( devid ) {
		if (devid==0)
			return _hagdevice;
		return UserDataHelper(_user_data).getDeviceByID(devid);
	};

	function _getSceneByID(sceneid) {
		for (var i=0;i<_user_data.scenes.length;i++) {
			if (_user_data.scenes[i].id == sceneid)
				return _user_data.scenes[i];
		}
		return null;
	};
	function  _getPluginByID( id ) {
		for (var i=0;i<_user_data.InstalledPlugins2.length;i++) {
			if (_user_data.InstalledPlugins2[i].id == id)
				return _user_data.InstalledPlugins2[i];
		}
		return null;
	};
	function _getNewSceneID() {
		return ALTUI_NEW_SCENE_ID;
	};

	function _getStates( deviceid  )
	{
		for (var i=0; i<_user_data.devices.length; i++) {
			var device = _user_data.devices[i];
			if (device.id == deviceid)
				return _user_data.devices[i].states;
		}
		return null;
	};

	function _getStatusObject( deviceid, service, variable, bCreate ) {
		var foundState = null;
		var device = _getDeviceByID( deviceid );
		if (device==null)
			return null;

		if (device.states) {
			for (var i=0; i<device.states.length ; i++ ) {
				var state = device.states[i];
				if (( state.service == service ) && (state.variable == variable)) {
					foundState = state;
					break;
				}
			}
		}
		if ((foundState==null) && (bCreate==true)) {
			var newstate = {
				service: service,
				variable: variable,
				value: null
			};
			device.states.push(newstate);
			return newstate;
		}
		return foundState;
	};

	function _getStatus( deviceid, service, variable )
	{
		return UserDataHelper(_user_data).getStatus(deviceid, service, variable);
	};

	function _getJobStatus( jobid , cbfunc )
	{
		return _upnpHelper.UPnPGetJobStatus(jobid, cbfunc );
	};
	
	function _setAttr(deviceid, attribute, value,cbfunc) {
		if ( isNullOrEmpty(value) )
			value = ""

		if (_isUI5() == true) {
			return _upnpHelper.UPnPSetAttr(deviceid, attribute, value,cbfunc);
		} else {
			return _upnpHelper.UPnPSetAttrUI7(deviceid, attribute, value,cbfunc);
		}
	}

	// dynamic
	// undefined or -1 : ALTUI mode , triggers a UPNP http save
	// 0 : means not dynamic, will require a save
	// 1 : means dynamic, lost at the next restart if not save
	function _setStatus( deviceid, service, variable, value, dynamic ) {
		// update local cache
		var promise = null;
		var statusobj= _getStatusObject( deviceid, service, variable , true ) //bCreate==true

		if (dynamic >= 0 )	{
			statusobj.value=value;	// in memory but lost at next restart

			// if dynamic ==0 permits the user to save
			if (dynamic==0) {
				if (_isUI5() ) {
					// on UI5 cache until the user presses SAVE button
					var target = {};
					target.devices={};
					target.devices["devices_"+deviceid]={};
					target.devices["devices_"+deviceid].states = {};
					target.devices["devices_"+deviceid].states["states_"+statusobj.id] = {
						"value": value
					};
					_updateChangeCache( target );
				} else {
					// on UI7, do it asynchronously
					promise =  _upnpHelper.UPnPSet( deviceid, service, variable, value );
				}
			}
		}
		else {
			// update vera
			promise =  _upnpHelper.UPnPSet( deviceid, service, variable, value );
		}
		return promise;
	};

	function _evaluateConditions(deviceid,cat,subcat,conditions) {
		return UserDataHelper(_user_data).evaluateConditions(deviceid,cat,subcat,conditions);
	};

/*
function testcors() {
	var url = "http://192.168.1.16/port_3480/data_request?id=variableset&Variable=AllowCORS&Value=1"
	$.get(url)		
	.done( function (data, textStatus, jqXHR) {
		console.log("enable cors:",data)
		//url="http://192.168.1.16/port_3480/data_request?id=lu_status2&output_format=json&DataVersion=1&Timeout=5&MinimumDelay=1500"
		url="http://192.168.1.16/port_3480/data_request?id=user_data"
		$.ajax({
				// url:'https://script.google.com/macros/s/AKfycbyu0Xc8Hd3ruJolJGUsi5Chbq4GUnAl89LeDpky-1_nQA23kHs/exec',	// test
				url: url,
				method:	"GET",
				cache:false,
				//dataType: "json",
				crossDomain:true
				// processData: false			// prevent jquery to process data to receive it as pure TEXT
			})
		.done( function (data, textStatus, jqXHR) {
			console.log("test user data",data)
		})
		.fail( function( jqXHR, textStatus, errorThrown ) {
			console.log(textStatus)
		})
	})
	.fail( function( jqXHR, textStatus, errorThrown ) {
		console.log(textStatus)
	})
}
*/

	function _refreshEngine() {
		// console.log("controller #%s refreshEngine %s",_uniqID, "?id=lu_status2&output_format=json&DataVersion="+_status_data_DataVersion)
		//testcors()
		var jqxhr = _httpGet("?id=lu_status2&output_format=json&DataVersion="+_status_data_DataVersion+"&Timeout={0}&MinimumDelay={1}".format(
				(_uniqID==0 ? LU_STATUS_TIMEOUT : 5 ),			// cannot afford to wait 60 sec in the Lua handler for Proxied units
				LU_STATUS_MINDELAY
			),
			{beforeSend: function(xhr) { xhr.overrideMimeType('text/plain'); }},
			function(data, textStatus, jqXHR)
			{
				if ((data) && (data != "") && (data != "NO_CHANGES") && (data != "Exiting") )
				{
					if ($.isPlainObject( data ) ==false)
						data=JSON.parse(data);
					_status_data_DataVersion = data.DataVersion;
					_status_data_LoadTime = data.LoadTime;
					// console.log("controller #{0} received lu_status2 with data.UserData_DataVersion={1} ".format(_uniqID,data.UserData_DataVersion));
					if (data.devices != undefined)
					{
						$.each(data.devices, function( idx, device) {
							var userdata_device_idx = UserDataHelper(_user_data).findDeviceIdxByID(device.id);
							if (userdata_device_idx!=-1) {
								_user_data.devices[userdata_device_idx].status = device.status;
								_user_data.devices[userdata_device_idx].Jobs = device.Jobs;
								_user_data.devices[userdata_device_idx].dirty = true;
								_user_data.devices[userdata_device_idx].tooltip = device.tooltip;

								if (device.states !=null) {
									for (var j=0; j<device.states.length; j++) {
										var state = device.states[j];
										for (var idx = 0; idx< _user_data.devices[userdata_device_idx].states.length; idx++) {
											var userdata_state =  _user_data.devices[userdata_device_idx].states[idx]
											if ((userdata_state.service == state.service) && (userdata_state.variable == state.variable))
											{
												_user_data.devices[userdata_device_idx].states[idx].value = state.value;
												break;
											}
										}
									}
									EventBus.publishEvent("on_ui_deviceStatusChanged",_user_data.devices[userdata_device_idx]);
								}
							}
						});
					}
					if (data.scenes != undefined) {
						$.each(data.scenes, function(idx,scene) {
							_sceneActiveStatus[ scene.id ] = scene.active;
							var userdata_scene_idx = UserDataHelper(_user_data).findSceneIdxByID(scene.id);
							if (userdata_scene_idx!=-1) {
								_user_data.scenes[userdata_scene_idx].active = scene.active;
							}
						})
					}
					UIManager.refreshUI( false );	// partial and not first time
					EventBus.publishEvent("on_startup_luStatusLoaded_"+_uniqID,data);

					// if user_data has changed, reload it
					if (_user_data_DataVersion != data.UserData_DataVersion) {
						 // console.log("controller #{0} received  lu_status2 with data.UserData_DataVersion={1} =>requesting new user data".format(_uniqID,data.UserData_DataVersion));
						_initDataEngine();
					}
					else {
						setTimeout( _refreshEngine, (_uniqID==0 ? 100 : 300 ) );
					}
				}
				else {
					// console.log( _T("Controller {0} is busy, be patient.").format(_upnpHelper.getIpAddr()) , "warning");
					setTimeout( _refreshEngine, 1000 );
				}
			}
		);
		return jqxhr;
	}

	function _sanityCheck(udata) {
		$.each(udata.devices, function(i,device) {
			var states = {}
			$.each(device.states, function(j,state) {
				if (states[ state.id ] == null )
					states[ state.id ] = { variable: state.variable, value: state.value }
				else {
					var str = "warning device:{0} has duplicate state id {1} for variables: {2} , {3}".format(
						device.id,
						state.id,
						state.variable,
						states[ state.id ].variable
						);
					console.log(str);
					PageMessage.message(str, "warning");
				}
			})
		})
	}

	function _loadUserData(data) {
		var result = false;
		if ((data) && (data != "NO_CHANGES") && (data != "Exiting") )
		{
			var bFirst = (_user_data_DataVersion==1);
			if ($.isPlainObject( data )==false)
				data = JSON.parse(data);
			// console.log("controller #{0} is loading user_data with New DataVersion={1}".format(_uniqID,data.DataVersion));
			// if (bFirst==true) {
				// console.log("controller %s bfirst==true",_uniqID)
			// }
			$.extend(_user_data, data);
			// _user_data = cloneObject(data);
			_user_data_DataVersion = data.DataVersion;
			_user_data_LoadTime = data.LoadTime;
			_user_data.BuildVersion = data.BuildVersion;
			_user_data.SvnVersion = data.SvnVersion;
			_setRooms(data.rooms);
			_setScenes(data.scenes);
			_setDevices(data.devices);

			_sanityCheck(data);

			if (data.devices)
				$.each(data.devices, function(idx,device) {
					device.altuiid = "{0}-{1}".format(_uniqID,device.id);
					device.favorite=Favorites.get('device',device.altuiid);
					//urn:micasaverde-com:serviceId:HaDevice1, HideDeleteButton
					if (parseInt(_getStatus( device.id, "urn:micasaverde-com:serviceId:HaDevice1", "HideDeleteButton" ))==1)
						device.donotdelete = true;
					// jsonp.ud.devices.push(device);
				});
			if (data.scenes)
				$.each(data.scenes, function(idx,scene) {
					scene.altuiid = "{0}-{1}".format(_uniqID,scene.id);
					scene.favorite=Favorites.get('scene',scene.altuiid);
					scene.active = _sceneActiveStatus[ scene.id ];
					if (scene.encoded_lua==1) {
						try {
							scene.lua = atob(scene.lua);
						}
						catch (e){
							// do not decode
							AltuiDebug.warning("The scene {0} has the encoded_lua flag but the scene.lua fails to decode. {1}".format(scene.id, scene.lua))
						}
						delete scene.encoded_lua;
					}
					if (scene.triggers) {
						$.each(scene.triggers, function(idx,trigger) {
							if (trigger.encoded_lua==1) {
								try {
									trigger.lua = atob(trigger.lua)
								}
								catch (e) {
									// do not decode
									AltuiDebug.warning("The scene {0} has a trigger with the encoded_lua flag but the trigger.lua fails to decode. {1}".format(scene.id, trigger.lua))
								}
								delete trigger.encoded_lua;
							}
						});
					}
					// jsonp.ud.scenes.push(scene);
				});
			if (data.rooms)
				$.each(data.rooms, function(idx,room) {
					room.altuiid = "{0}-{1}".format(_uniqID,room.id);
					// jsonp.ud.rooms.push(room);
				});
			if (data.InstalledPlugins2)
				var pluginSettings = data.PluginSettings;	// specific for UI5 user data
				$.each(data.InstalledPlugins2, function(idx,plugin) {
					plugin.altuiid = "{0}-{1}".format(_uniqID,idx);
					if(pluginSettings) {
						for (var j=0;j<pluginSettings.length;j++) {
							if (pluginSettings[j].plugin_id == plugin.id) {
								plugin.AltuiSettings = pluginSettings[j];
							}
						}
					}
				});
			// update the static ui information for the future displays
			$.each(_user_data.static_data || [], function(idx,ui_static_data) {
				var dt = ui_static_data.device_type == undefined ? ui_static_data.DeviceType : ui_static_data.device_type;
				if (dt!=undefined) {
					MultiBox.updateDeviceTypeUIDB( _uniqID, dt, ui_static_data);
				}
			});

			// update upnp information
			var promises = []
			$.each(_user_data.devices || [], function(idx,device) {
				var dt = device.device_type;
				var df = device.device_file;
				if (dt && (dt!="") && df && (df!="") )
					promises.push( MultiBox.updateDeviceTypeUPnpDB( _uniqID, dt, device.device_file) ) ;	// pass device file so UPNP data can be read
				if (device!=null) {
					device.dirty=true;
					EventBus.publishEvent("on_ui_deviceStatusChanged",device);
				}
			});
			$.when.apply($,promises)
			.then(function(){
				_upnpHelper.setConfig( {
					isOpenLuup: _isOpenLuup(_user_data),
					candoPost: _candoPost(_user_data),
					candoCORS: _candoCORS(_user_data),
				});
			})
			result = (data.devices != null);
		} 
		return result
		// else {
			// console.log("controller #{0} wrong data : {1}".format(_uniqID,data || ""));
		// }
	};

	function _isUserDataCached() {	return MyLocalStorage.get("VeraBox"+_uniqID)!=null; }

	function _stopEngine() {
		_bStopEngine = true
	};
	
	function _saveEngine() {
		//AltuiDebug.debug("_saveEngine()");
		var verabox = {
			_user_data : _user_data,
		};
		return MyLocalStorage.set("VeraBox"+_uniqID,verabox);
	};
	function _clearEngine() {
		return MyLocalStorage.clear("VeraBox"+_uniqID);
	};

	function _loadEngine( /*user_data*/ ) {
		_user_data_DataVersion	= 1;
		_user_data_LoadTime		= null;
		_user_data.BuildVersion = undefined;		// to keep the "waiting" message for the user
		_loadUserData(_user_data);
	};

	// start the polling loop to get user_data
	function _initDataEngine() {
		_dataEngine = null;
		//AltuiDebug.debug("_initDataEngine()");
		// console.log("controller #{0} is requesting user_data with _DataVersion={1}".format(_uniqID,_user_data_DataVersion));
		var jqxhr = _httpGet( "?id=user_data&output_format=json&DataVersion="+_user_data_DataVersion,
			{beforeSend: function(xhr) { xhr.overrideMimeType('text/plain'); }},
			function(data, textStatus, jqXHR) {
				// console.log("controller #{0} received old _DataVersion={1}".format(_uniqID,_user_data_DataVersion));
				if (data!=null) {
					_dataEngine = null;
					if (_loadUserData(data) == true ) {
						// if (bFirst)
						// EventBus.publishEvent("on_ui_userDataFirstLoaded_"+_uniqID);
						EventBus.publishEvent("on_ui_userDataLoaded_"+_uniqID);
					}
					UIManager.refreshUI( true );	// full but not first time
					if (_bStopEngine==false)
						_dataEngine = setTimeout( _refreshEngine, 2000 );
				}
				else {
					console.log( _T("Controller {0} did not respond").format(_upnpHelper.getIpAddr() ))
					if (_bStopEngine==false)
						_dataEngine = setTimeout( _initDataEngine, 2000 );
				}
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				// alert("fail 2");
			})
			.always(function() {
				//AltuiDebug.debug("_initDataEngine() (user_data) returned.");
			});
		return jqxhr;
	};

	function _getBoxFullInfo() {
		var ordered = {};
		$.each( Object.keys(_user_data).sort(), function(i,key) {
			var val = _user_data[key];
			if (!$.isArray(val) && !$.isPlainObject(val))
				ordered[key]=val;
		});
		return ordered;
	};
	function _getBoxInfo() {
		return {
			PK_AccessPoint: _user_data.PK_AccessPoint,
			BuildVersion: _user_data.BuildVersion,
			City_description: _user_data.City_description,
			Region_description: _user_data.Region_description,
			Country_description: _user_data.Country_description
		};
	};
	function _isUI5() {
		if (_uniqID==0)
			return (UIManager.UI7Check()==false);

		var bi = _getBoxInfo()
		return (bi.BuildVersion==undefined) || (bi.BuildVersion.startsWith("*1.5."));
	};
	function _candoPost(user_data) {
		if (_user_data.BuildVersion == undefined)
			return false;
		var versioninfo = $.map( _user_data.BuildVersion.match(/\*(\d+)\.(\d+)\.(\d+)\\*/),
			function(e,i) {
				return parseInt(e)
			}
		);
		return _isOpenLuup(user_data) ||  (( _uniqID==0) && ( versioninfo.length>=4 ) && (versioninfo[1] >=1 ) && (versioninfo[2] >=7 ) && (versioninfo[3] >= 2138 ));
	};

	function _isOpenLuup(user_data) {
		if ( (user_data.BuildVersion==undefined) || (user_data.BuildVersion.startsWith("*1.5")==true) )
			return false;
		return (user_data.SvnVersion==undefined)
	};
	function _getLuaStartup() {
		if (_user_data.encoded_lua==1) {
			try {
				_user_data.StartupCode = atob(_user_data.StartupCode)
			}
			catch (e) {
				// do not decode
				AltuiDebug.warning("The StartupCode has the encoded_lua flag but fails to decode properly. {0}".format(_user_data.StartupCode))
			}
		}
		return _user_data.StartupCode || ""
	};

	function _createDevice( param , cbfunc ) {
		var target = $.extend( {descr:'default title', dfile:'', ifile:'', roomnum:0 } , param );
		return _upnpHelper.createDevice( target.descr, target.dfile, target.ifile, target.roomnum , cbfunc );
	};

	function _createRoom(name,cbfunc)
	{
		var jqxhr =null;
		if (name && (name.length>0)) {
			jqxhr = _httpGet( "?id=room&action=create&name="+name, {}, function(data, textStatus, jqXHR) {
				if ((data!=null) && (data!="ERROR"))
					PageMessage.message(_T("Create Room succeeded for")+": "+name, "success", _isUI5() );	// need user_data reload on UI5
				else
					PageMessage.message(_T("Could not create Room")+": "+name, "warning");
				if ($.isFunction(cbfunc)){
					(cbfunc)(data);
				};
			});
		}
		return jqxhr;
	};

	function _deleteRoom(id)
	{
		var jqxhr = _httpGet( "?id=room&action=delete&room="+id, {}, function(data, textStatus, jqXHR) {
			if ((data!=null) && (data!="ERROR"))
				PageMessage.message(_T("Deleted Room")+" "+id, "success", _isUI5());	// need user_data reload on UI5
			else
				PageMessage.message(_T("Could not delete Room")+" "+id, "warning");
		});
		return jqxhr;
	};

	function _renameRoom(id,name) {
		//http://ip_address:3480/data_request?id=room&action=rename&room=5&name=Garage
		var jqxhr = _httpGet( "?id=room&action=rename&name="+name+"&room="+id, {}, function(data, textStatus, jqXHR) {
			if ((data!=null) && (data!="ERROR"))
				PageMessage.message(_T("Renamed Room")+" "+id, "success", _isUI5());	// need user_data reload on UI5
			else
				PageMessage.message(_T("Could not rename Room")+" "+id, "warning");
		});
		return jqxhr;
	};

	function _runScene(id)
	{
		if ( (id<=0) || ((this.getSceneByID(id) == null)) )
			return null;

		var jqxhr = _httpGet( "?id=action&serviceId=urn:micasaverde-com:serviceId:HomeAutomationGateway1&action=RunScene&SceneNum="+id, {}, function(data, textStatus, jqXHR) {
			if ((data!=null) && (data!="ERROR"))
				PageMessage.message(_T("Ran Scene #{0} successfully").format(id), "success");
			else
				PageMessage.message(_T("Could not run Scene #{0}").format(id), "warning");
		});
		return jqxhr;
	};

	function _osCommand(cmd,bSilent,cbfunc) {
		var jqxhr = _httpGet( "?id=lr_ALTUI_Handler&command=oscommand&oscommand={0}".format( encodeURIComponent(cmd) ), {}, function(data, textStatus, jqXHR) {
			if (data!=null) {
				var success = (data[0]=="1");
				if (success)
					if (bSilent!=true) PageMessage.message(_T("Os Command execution succeeded"), "success");
				else
					if (bSilent!=true) PageMessage.message( _T("Os Command execution on vera failed.")+"({0})".format(data) , "danger");
				if ($.isFunction( cbfunc ))
					cbfunc({success:success, result:data.substr(2)},jqXHR);
			}
			else {
				PageMessage.message( _T("Os Command execution request failed. (returned {0})").format(textStatus) , "danger");
				if ($.isFunction( cbfunc ))
					cbfunc({success:false, result:null},jqXHR);
			}
		});
		return jqxhr;
	};

	function _runLua(code, cbfunc) {
		if (1) {
			var doPost = _candoPost(_user_data)
			var url = "data_request?id=lr_ALTUI_LuaRunHandler";
			var jqxhr = $.ajax( {
				url: url,
				type: (doPost==true) ? "POST" : "GET",
				data: {
					command:'run_lua',
					lua:code
				}
			})
			.done(function(data, textStatus, jqXHR) {
				if (data!=null) {
					var lines = data.split('||');
					var success = (lines[0]=="1");
					if (success)
						PageMessage.message(_T("Lua execution succeeded"), "success");
					else
						PageMessage.message( _T("Lua Command execution on vera failed.")+"({0})".format(data) , "danger");
					if ($.isFunction( cbfunc ))
						cbfunc({success:success, result:lines[1], output:lines[2]},jqXHR);
				}
				else {
					PageMessage.message( _T("Lua Command execution request failed. (returned {0})").format(textStatus) , "danger");
					if ($.isFunction( cbfunc ))
						cbfunc({success:false, result:"", output:""},jqXHR);
				}
			})
			.fail(function(jqXHR, textStatus) {
				PageMessage.message( _T("Lua Command execution on vera failed.")+"({0})".format(data) , "danger");
			})
			.always(function() {
			});
			return jqxhr;
		} else {
			var jqxhr = _httpGet( "?id=lr_ALTUI_LuaRunHandler&command=run_lua&lua={0}".format( encodeURIComponent(code) ), {}, function(data, textStatus, jqXHR) {
				if (data!=null) {
					var lines = data.split('||');
					var success = (lines[0]=="1");
					if (success)
						PageMessage.message(_T("Lua execution succeeded"), "success");
					else
						PageMessage.message( _T("Lua Command execution on vera failed.")+"({0})".format(data) , "danger");
					if ($.isFunction( cbfunc ))
						cbfunc({success:success, result:lines[1], output:lines[2]},jqXHR);
				}
				else {
					PageMessage.message( _T("Lua Command execution request failed. (returned {0})").format(textStatus) , "danger");
					if ($.isFunction( cbfunc ))
						cbfunc({success:false, result:"", output:""},jqXHR);
				}
			});
			return jqxhr;
		}
	};

	function _renameDevice(device, newname, roomid)
	{
		return _upnpHelper.renameDevice(device, newname, roomid);
	};

	function _deleteDevice(id)
	{
		var jqxhr = _httpGet( "?id=device&action=delete&device="+id, {}, function(data, textStatus, jqXHR) {
			if ( (data!=null) && (data!="ERROR") ) {
				PageMessage.message(_T("Deleted Device {0} successfully").format(id), "success");
				MultiBox.reloadEngine( _uniqID );
			}
			else {
				PageMessage.message(_T("Could not delete Device {0}").format(id), "warning");
			}
		});
		return jqxhr;
	};

	function _updateNeighbors(deviceid) {
		var zwavenet = this.getDeviceByType("urn:schemas-micasaverde-com:device:ZWaveNetwork:1");
		if (zwavenet==null)
			return;

		var params={};
		params[ "Device" ] = deviceid;
		return upnpHelper.UPnPAction( zwavenet.id, "urn:micasaverde-com:serviceId:ZWaveNetwork1", "UpdateNeighbors", params, function(data) {
			if (data!=null) {
				PageMessage.message(_T("Update Neighbors succeeded"));
			}
			else {
				PageMessage.message(_T("Update Neighbors failed"));
			}
		});
	};

	function _deleteSceneUserData(id)
	{
		if (_user_data.scenes) {
			var _index = null;
			$.each(_user_data.scenes, function(index,s) {
				if (s.id == id) {
					_index = index;
					return false;
				}
			})
			if (_index!=null )
				_user_data.scenes.splice(_index, 1);
		}
	}

	function _deleteScene(id)
	{
		_deleteSceneUserData(id);
		var jqxhr = _httpGet( "?id=scene&action=delete&scene="+id, {}, function(data, textStatus, jqXHR) {
			if ( (data!=null) && (data!="ERROR") ) {
				PageMessage.message(_T("Deleted Scene {0} successfully").format(id), "success");
			}
			else {
				PageMessage.message(_T("Could not delete Scene {0}").format(id), "warning");
			}
		});
		return jqxhr;
	};

	function _setStartupCode(newlua)
	{
		if (_user_data.encoded_lua==1) {
			newlua = btoa(newlua)
		}
		return (newlua != undefined) ? _upnpHelper.ModifyUserData( { "StartupCode":newlua } ) : null;
	};

	function _getCategoryTitle(catnum)
	{
		return UserDataHelper(_user_data).getCategoryTitle(_user_data,catnum);
	};

	function _updateSceneUserData(scene)
	{
		if (_user_data.scenes) {
			var bFound = false;
			$.each(_user_data.scenes, function(i,s) {
				if (s.id == scene.id) {
					_user_data.scenes[i] = scene;
					bFound = true;
					return false;
				}
			})
			if (bFound==false) {
				_user_data.scenes.push(scene);
			}
		}
	}
	function _editScene(sceneid,scene,cbfunc)
	{
		// show_loading();
		_updateSceneUserData( scene );
		return _upnpHelper.sceneAction(scene,function(data) {
			// hide_loading();
			if ($.isFunction(cbfunc))
				(cbfunc)(data);
			else {
				if ( (data!=null) && (data!="ERROR") ) {
					PageMessage.message(_T("Edited Scene {0} successfully").format(sceneid), "success");
				}
				else {
					PageMessage.message(_T("Could not edit Scene {0}").format(sceneid), "warning");
				}
			}
		});
	};
	function _renameSceneUserData(sceneid,name)
	{
		if (_user_data.scenes) {
			var bFound = false;
			$.each(_user_data.scenes, function(i,s) {
				if (s.id == sceneid) {
					_user_data.scenes[i].name=name;
					bFound = true;
					return false;
				}
			})
		}
	};
	function _renameScene(sceneid,newname)
	{
		//http://ip_address:3480/data_request?id=scene&action=rename&scene=5&name=Chandalier&room=Garage
		var jqxhr = _httpGet( "?id=scene&action=rename&name="+newname+"&scene="+sceneid, {}, function(data, textStatus, jqXHR) {
			if ((data!=null) && (data!="ERROR")) {
				_renameSceneUserData(sceneid,newname)
				PageMessage.message(_T("Renamed Scene")+" "+sceneid, "success", _isUI5());	// need user_data reload on UI5
			}
			else
				PageMessage.message(_T("Could not rename Scene")+" "+sceneid, "warning");
		});
		return jqxhr;
	};

	function _getDeviceStaticUI(device) {
		var staticroot=null;
		if (device!=null) {
			var devicetype = device.device_type;
			$.each(_user_data.static_data, function(idx,value) {
				if ((value.device_type==devicetype) || (value.DeviceType==devicetype)) {
					staticroot=value;
					return false;
				}
			});
		}
		return staticroot;
	};

	function _getDeviceBatteryLevel(device) {
		var batteryLevel= _getStatus( device.id, "urn:micasaverde-com:serviceId:HaDevice1", "BatteryLevel" );
		if (batteryLevel==null) {
			var max = _getStatus( device.id, "urn:micasaverde-com:serviceId:ZigbeeDevice1", "BatteryPower" );
			var level = _getStatus( device.id, "urn:micasaverde-com:serviceId:ZigbeeDevice1", "VoltageLevel" );
			if (max && level) {
				max = parseInt(max*1000 || 0)
				level = parseInt(level*100 || 0)
				batteryLevel = (max==0) ? null : Math.min( 100,Math.floor(level/max*100) )
			}
		}
		return batteryLevel; // Math.floor((Math.random() * 100) + 1);
	};

	function _clearData(doPost, handle, key, name, npage, cbfunc) {
		if (_uniqID!=0)	// only supported on master controller
			return;

		//AltuiDebug.debug("_clearData( {2}, {0}, page:{1} )".format(name,npage,handle));
		var result = "";
		var url = "data_request?id=lr_ALTUI_Handler&command=clear_data";//&pages="+encodeURIComponent(JSON.stringify(pages));
		var jqxhr = $.ajax( {
			url: url,
			type: (doPost==true) ? "POST" : "GET",
			//dataType: "text",
			data: {
				prefix: key,
				name: name,
				npage: npage,
				handle: handle,
				dummy:'x'
			}
		})
		.done(function(data) {
			if ( $.isFunction( cbfunc ) )  {
				cbfunc(data);
			}
		})
		.fail(function(jqXHR, textStatus) {
			if ( $.isFunction( cbfunc ) )  {
				cbfunc("");
			}
		})
		.always(function() {
		});
	};

	function _saveDataChunk(doPost, handle, key, name, npage, data, cbfunc) {
		if (_uniqID!=0)	// only supported on master controller
			return;

		//AltuiDebug.debug("_saveDataChunk( {4},{3}, {0}, page:{1}, data:{2} chars	)".format(name,npage,data.length,key,handle));
		var result = "";
		var url = "data_request?id=lr_ALTUI_Handler&command=save_data";//&pages="+encodeURIComponent(JSON.stringify(pages));
		var jqxhr = $.ajax( {
			url: url,
			type: (doPost==true) ? "POST" : "GET",
			//dataType: "text",
			data: {
				prefix: key,
				name: name,
				npage: npage,
				handle: handle,
				mydata: (doPost==true) ? data : encodeURIComponent(data),
				dummy:'x'
			}
		})
		.done(function(data, textStatus, jqXHR) {
			//AltuiDebug.debug("_saveDataChunk( {5}, {4}, {0}, page:{1}, data:{2} chars	 ) => Res:{3}".format(name,npage,data.length,JSON.stringify(data),key,handle));
			if ( $.isFunction( cbfunc ) )  {
				cbfunc(data);
			}
		})
		.fail(function(jqXHR, textStatus) {
			AltuiDebug.debug("_saveDataChunk() failed. textStatus:{0}".format(textStatus))
			if ( $.isFunction( cbfunc ) )  {
				cbfunc("");
			}
		})
		.always(function() {
		});
	};

	function _saveData( key, name, data , cbfunc) {
		if (_uniqID!=0)	{
			// only supported on master controller
			AltuiDebug.debug("_saveData must only be called on master controller #0");
			return;
		}
		//AltuiDebug.debug("_saveData( {0}, {1} chars )".format(name,data.length));

		var bPost = _candoPost(_user_data)

		// we need a workaround to pass data via a POST but for now, all we have is a Get
		// we know that 5400 char is ok, above it fails
		var context = {
			doPost: bPost,
			key: key,
			name: name,
			data: data,
			handle: "",
			maxchar: (bPost==true) ? 100000 : 2000,
			done: 0,
			npage: 0
		};

		// var result="ok";
		// var todo = data.length;
		// var maxchar = 2000;
		// var done = 0;
		// var npage = 0;

		function _doPart(context) {
			var len = Math.min( context.maxchar , context.data.length - context.done ) ;
			if (len>0) {
				data = context.data;
				var part = data.substring( context.done, context.done+len);
				// console.log("doPart() %o from:%d len:%d",context,context.done,len)
				_saveDataChunk(context.doPost, context.handle, context.key, context.name, context.npage, part,	function(data) {
					if ((data=="") || (data=="-1") || (data=="handler failed"))
						cbfunc("");	// error
					else {
						context.done += len;
						context.npage++;
						context.handle = data;
						// setTimeout(_doPart, 400, context )
						_doPart(context);
					}
				});
			}
			else {
				// console.log("doPart() - clearData %o",context)
				// no more data to send but we need to clean up Vera to remove extra variable
				_clearData(context.doPost, context.handle, context.key, context.name, context.npage, function(data) {
					// vera specific logic: if saveData was for "Wflow", "Workflows"  we force a workflow refresh of the lua driver cache )
					if ((context.key=="Wflow") && (context.name=="Workflows")) {
						_forceRefreshWorkflows( function(data) {
							cbfunc("ok");	// callback when the refresh was done
						})
						return // we will call back later
					}
					// now it is finished
					cbfunc("ok");
				});
			}
		};

		// start and result is asynchronous
		_doPart(context);
	};

	function _getSceneHistory( id, cbfunc) {
		// var cmd = "cat /var/log/cmh/LuaUPnP.log | grep \"Device_Variable::m_szValue_set device: {0}.*;1m{1}\"".format(device.id,state.variable);
		var cmd = "cat /var/log/cmh/LuaUPnP.log | grep '"+'\t'+"Scene::RunScene running {0} '".format(id);
		return _osCommand(cmd, false, function(str) {
			var result = {
				lines:[],
				result:str
			};
			var re = /\d*\t(\d*\/\d*\/\d*\s\d*:\d*:\d*.\d*).*Scene::RunScene running \d+ (.*) <.*/g;
			var m;
			while ((m = re.exec(str.result)) !== null) {
				if (m.index === re.lastIndex) {
					re.lastIndex++;
				}
				// View your result using the m-variable.
				// eg m[0] etc.
				result.lines.push({date:m[1], name:m[2]});
			}
			if ($.isFunction(cbfunc))
				(cbfunc)(result);
		});
	};
	function _setSceneMonitorMode(id,mode, cbfunc) {
		var jqxhr = _httpGet( "?id=change_scene_mode&SceneID={0}&ModeName={1}".format(id,mode), {},
			function(data, textStatus, jqXHR) {
				if ((data!=null) && (data!="ERROR")) {
					if ($.isFunction(cbfunc))
						(cbfunc)(data);
				}
				else
					PageMessage.message(_T("Could not change scene monitor mode")+" "+sceneid, "warning");
			}
		);
		return jqxhr;
	};
	function _getDeviceVariableHistory( device, varid, cbfunc) {
		var id = device.id;
		var state = MultiBox.getStateByID(device.altuiid,varid);
		var cmd = "cat /var/log/cmh/LuaUPnP.log | grep 'Device_Variable::m_szValue_set device: {0}.*;1m{1}\x1B'".format(device.id,state.variable);

		return _osCommand(cmd,false,function(str) {
			var result = {
				lines:[],
				result:str
			};
			var re = /\d*\t(\d*\/\d*\/\d*\s\d*:\d*:\d*.\d*).*was: (.*) now: (.*) #.*/g;
			var m;
			while ((m = re.exec(str.result)) !== null) {
				if (m.index === re.lastIndex) {
					re.lastIndex++;
				}
				// View your result using the m-variable.
				// eg m[0] etc.
				result.lines.push({
					date:m[1],
					oldv:m[2],
					newv:m[3]
					});
			}
			if ($.isFunction(cbfunc))
				(cbfunc)(result);
		})
	};

	function _getDeviceActions(device,cbfunc) {
		return UserDataHelper(_user_data).getDeviceActions(device,cbfunc);
	};
	function _runAction( deviceID, service, action, params, cbfunc ) {
		return _upnpHelper.UPnPAction(	deviceID, service, action, params, cbfunc );
	};
	function _xxxWatch( cmd, w ) {
		// for thingspeak = a table of channelid, readkey, writekey, field, graphicurl
		var url = "?id=lr_ALTUI_Handler&command={8}&service={0}&variable={1}&device={2}&scene={3}&expression={4}&xml={5}&provider={6}&providerparams={7}".format(
			w.service, w.variable, w.deviceid, w.sceneid,
			encodeURIComponent(w.luaexpr || ''),
			encodeURIComponent(w.xml || '' ),
			w.provider,
			encodeURIComponent( JSON.stringify(w.params || [] ) ),
			cmd
		);
		var jqxhr = _httpGet( url, {}, function(data, textStatus, jqXHR) {
			if ((data!=null) && (data!="ERROR")) {
				// PageMessage.message(_T("Success"), "success");	// need user_data reload on UI5
			}
			else
				PageMessage.message(_T("Failure"), "warning");
		});
		return jqxhr;
	};

	function _delWatch( w ) {
		return _xxxWatch( 'delWatch', w	 );
	};
	function _addWatch( w ) {
		// http://192.168.1.5/port_3480/data_request?id=lr_ALTUI_Handler&command=addRemoteWatch&device=42&variable=Status&service=urn:upnp-org:serviceId:SwitchPower1&data=192.168.1.16
		return _xxxWatch( 'addWatch', w );
	};
	function _getPushLineParams(pushLine) {
		var key="";
		var fieldnum=0;
		var params = pushLine.split('#');
		var wparams=[];
		for (var i=4; i< params.length; i++ ) {
			wparams.push(params[i]);
		}
		return {
			service : params[0] || "",
			variable : params[1] || "",
			deviceid : params[2] || "",
			provider : params[3] || "",
			params	 : wparams
		};
	};
	function _getWatchLineParams(watchLine) {
		var params = watchLine.split('#');
		//service,variable,deviceid,sceneid,lua_expr
		return {
			service : params[0],
			variable : params[1],
			deviceid : params[2],
			sceneid : params[3],
			luaexpr : params[4],
			xml		: params[5] || ''
		};
	};
	function _setWatchLineParams(watch) {
		return "{0}#{1}#{2}#{3}#{4}#{5}".format( watch.service, watch.variable, watch.deviceid, watch.sceneid, watch.luaexpr, watch.xml || "");
	};
	function _getWatchesHistory(cbfunc) {
		if (_uniqID!=0)	// only supported on master controller
			return null;

		var dfd = $.Deferred();
		var bPost = _candoPost(_user_data);
		var result = "";
		var url = "data_request?id=lr_ALTUI_Handler&command=getWatchDB";
		var jqxhr = $.ajax( {
			url: url,
			type: (bPost==true) ? "POST" : "GET",
			//dataType: "text",
			data: {
				dummy:'x'
			}
		})
		.done(function(data) {
			var result=[];
			$.each(data, function(devid,devvalue) {
				$.each( devvalue , function (service, servvalue) {
					$.each( servvalue, function( variable, varvalue) {
						if (varvalue.LastUpdate) {
							result.push({
								altuiid: devid,
								service: service,
								variable: variable,
								lastUpdate: varvalue.LastUpdate,
								lastNew: varvalue.LastNew
							})
						}
					});
				});
			});
			if ( $.isFunction( cbfunc ) )  {
				cbfunc(result);
			}
			dfd.resolve(result)
		})
		.fail(function(jqXHR, textStatus) {
			if ( $.isFunction( cbfunc ) )  {
				cbfunc("");
			}
			dfd.resolve("")
		})
		return dfd.promise()
	};
	function _getWatches(whichwatches , filterfunc) {
		if ((whichwatches!="VariablesToWatch") && (whichwatches!="VariablesToSend"))
			return null;
		var linefunc = (whichwatches=="VariablesToWatch") ? _getWatchLineParams : _getPushLineParams
		var altuidevice = MultiBox.getDeviceByID( 0, g_ALTUI.g_MyDeviceID );
		var variable = MultiBox.getStatus( altuidevice, "urn:upnp-org:serviceId:altui1", whichwatches ) || "";
		var result=[];
		if (isNullOrEmpty(variable)!=true) {
			$.each(variable.split(';'), function(i,line) {
				if (line!="") {
					var w = (linefunc)(line);
					if ($.isFunction(filterfunc)) {
						if ( (filterfunc)(w,i) )
							result.push(w);
					} else {
						result.push(w);
					}
				}
			});
		}
		return result;
	};
	function _getDeviceDependants(device) {
		var usedin_objects =[];
		var scenes = this.getScenesSync();
		$.each(scenes,function( idx,scene) {
			if (scene.triggers)
				$.each(scene.triggers, function(idx,trigger) {
					if (trigger.device == device.id) {
						usedin_objects.push({type:'trigger', scene:scene.altuiid, name:scene.name, trigger:trigger});
					}
				});
			if (scene.groups)
				$.each(scene.groups, function(idx,group) {
					$.each(group.actions, function(idx,action) {
						if (action.device==device.id) {
							usedin_objects.push({type:'action', scene:scene.altuiid, name:scene.name, action:action});
						}
					});
				});
		});
		var altuiid = ""+_uniqID+"-";
		var workflows = WorkflowManager.getWorkflows()
		$.each(workflows, function(i,workflow) {
			var descr = WorkflowManager.getWorkflowDescr(workflow.altuiid)
			$.each(descr.states, function(j,state) {
				$.each(['onEnter','onExit'], function(k,type) {
					$.each(state[type], function(l,action){
						if (action.device==(altuiid+device.id)) {
							usedin_objects.push({type:'actionworkflow', subtype:type, workflow: workflow, state:state.name, action:action});
						}
					})
				})
				$.each(state['conditions'], function(l,cond){
					if (cond.device==(altuiid+device.id)) {
						usedin_objects.push({type:'triggerworkflow', workflow: workflow, state:state.name, cond:cond });
					}
				})
				$.each(state.transitions, function(t,transition) {
					$.each(transition.conditions, function(c,cond) {
						if (cond.device == (altuiid+device.id) ) {
							usedin_objects.push({type:'triggerworkflow', workflow: workflow, state:state.name, transition:transition.name, cond:cond });
						}
						// console.log(condition)
					});
				});
			})
		})
		return usedin_objects;
	};

	function _getDeviceEvents(device) {
		if (device && device.id!=0) {
			var ui_static_data = MultiBox.getDeviceStaticData(device);
			if	((ui_static_data == undefined) || (ui_static_data.eventList2==undefined))
				return [];
			return ui_static_data.eventList2;
		}
		return [];
	};

	function _resetPollCounters( cbfunc ) {
		return this.getDevices(
			function(luaid,device) {
				var id = device.id;
				var service="urn:micasaverde-com:serviceId:ZWaveDevice1"
				var PollNoReply = parseInt(_getStatus(id,service,"PollNoReply"));
				var PollOk = parseInt(_getStatus(id,service,"PollOk"));
				if (! isNaN(PollNoReply) ) {
					_setStatus( id, service, "PollNoReply", 0	);
				}
				if (! isNaN(PollOk) ) {
					_setStatus( id, service, "PollOk", 0   );
				}
			},
			function(device) {
				return (device.id_parent==1);
			},
			function(devices) {
				if ($.isFunction(cbfunc))
					(cbfunc)();
			}
		);
	};
	function _getUPnPHelper()	{
		return _upnpHelper;
	};
	function _getUrlHead() {
		return _upnpHelper.getUrlHead();
	};
	function _getIpAddr() {
		return _upnpHelper.getIpAddr();
	};
	function _getDataProviders(cbfunc) {
		// for thingspeak = a table of channelid, readkey, writekey, field, graphicurl
		var url = "?id=lr_ALTUI_Handler&command=getDataProviders";
		var jqxhr = _httpGet( url, {}, function(data, textStatus, jqXHR) {
			if ((data!=null) && (data!="ERROR")) {
				(cbfunc)(JSON.parse(data));
			}
			else {
				PageMessage.message(_T("Failure"), "warning");
				(cbfunc)(null);
			}
		});
		return jqxhr;
	};
	function _RequestBackup( cbfunc ) {
		var ip = _getIpAddr();
		var url = "http://{0}/cgi-bin/cmh/backup.sh?external=1".format(ip=="" ? window.location.host : ip);
		var res = window.open( url, '_blank');
		if ($.isFunction(cbfunc)) {
			(cbfunc)(res);
		}
		// window.open
		// var jqxhr = _httpGet( url, {}, function(data, textStatus, jqXHR) {
			// if ((data!=null) && (data!="ERROR")) {
				// if ($.isFunction(cbfunc)) {
					// (cbfunc)(data);
				// }
			// }
			// else {
				// PageMessage.message(_T("Failure"), "warning");
				// if ($.isFunction(cbfunc)) {
					// (cbfunc)(null);
				// }
			// }
		// });
		// return jqxhr;
	}

  // explicitly return public methods when this object is instantiated
  return {
	//---------------------------------------------------------
	// PUBLIC  functions
	//---------------------------------------------------------
	getUPnPHelper	: _getUPnPHelper,
	getIpAddr		: _getIpAddr,
	getUrlHead		: _getUrlHead,
	getDataProviders	: _getDataProviders,	// (cbfunc)
	getFileUrl			: _getFileUrl,			//(filename)
	getFileContent :  _getFileContent,			//( filename , cbfunc)
	triggerAltUIUpgrade : _triggerAltUIUpgrade,	// (newversion,newtracnum)	: newrev number in TRAC
	getIconPath		: _getIconPath,		// ( src )
	getIconContent		: _getIconContent,			// workaround to get image from vera box
	loadIcon		: _loadIcon,
	getWeatherSettings : _getWeatherSettings,
	isUI5			: _isUI5,
	isOpenLuup		: function() { return _isOpenLuup(_user_data) },
	candoPost		: function() { return _candoPost(_user_data) },
	candoCORS		: function() { return _candoCORS(_user_data) }, 
	getMajorMinor	: _getMajorMinor,
	enableNightlyHeal : _enableNightlyHeal, //(bEnableOrNull) 
	enableCORS		: _enableCORS,		// (bEnable, cbfunc )
	getBoxInfo		: _getBoxInfo,		//()
	getBoxFullInfo	: _getBoxFullInfo,		//()
	getLuaStartup	: _getLuaStartup,
	getRooms		: _getRooms,		// in the future getRooms could cache the information and only call _getRooms when needed
	getRoomsSync	: function()		{ return _rooms; },
	getRoomByID		: _getRoomByID,		// roomid
	getDevices		: _getDevices,
	getDevicesSync	: function()		{ return _devices; },
	getDeviceByType : _getDeviceByType,
	getDeviceByAltID : _getDeviceByAltID,
	getDeviceByID	: _getDeviceByID,
	getDeviceBatteryLevel : _getDeviceBatteryLevel,
	getDeviceStaticUI : _getDeviceStaticUI,
	getDeviceVariableHistory : _getDeviceVariableHistory,
	getDeviceActions: _getDeviceActions,
	getDeviceEvents : _getDeviceEvents,
	getDeviceDependants : _getDeviceDependants,
	runAction		: _runAction,
	addWatch		: _addWatch,				// ( lul_device, service, variable, deviceid, sceneid, expression, xml, provider, params)
	delWatch		: _delWatch,				// ( lul_device, service, variable, deviceid, sceneid, expression, xml, provider, params)
	getWatches		: _getWatches,				// (whichwatches,filterfunc)
	getWatchesHistory	: _getWatchesHistory,	// (cbfunc)
	isDeviceZwave	: function(device) { return UserDataHelper(_user_data).isDeviceZwave(device) },
	isDeviceZigbee	: function(device) { return UserDataHelper(_user_data).isDeviceZigbee(device) },
	isDeviceBT		: function(device) { return UserDataHelper(_user_data).isDeviceBT(device) },
	getScenes		: _getScenes,
	getSceneHistory : _getSceneHistory,
	getScenesSync	: function()		{ return _scenes; },
	getSceneByID	: _getSceneByID,
	getNewSceneID	: _getNewSceneID,
	setSceneMonitorMode : _setSceneMonitorMode,

	// pages
	getCustomPages : _getCustomPages,

	// worklflows
	getWorkflows	: _getWorkflows,
	getWorkflowStatus : _getWorkflowStatus,
	getWorkflowHistory: _getWorkflowHistory,
	forceRefreshWorkflows: _forceRefreshWorkflows,
	isWorkflowEnabled : _isWorkflowEnabled,
	getPlugins		: _getPlugins,
	getPluginByID	: _getPluginByID,
	getUsers		: _getUsers,
	getUsersSync	: _getUsersSync,
	getUserByID		: _getUserByID,
	getHouseMode	: _getHouseMode,
	setHouseMode	: _setHouseMode,
	getHouseModeSwitchDelay : _getHouseModeSwitchDelay,
	setAttr			: _setAttr, //function _setAttr(device, attribute, value,cbfunc) {
	setStatus		: _setStatus,
	getStatus		: _getStatus,
	getJobStatus	: _getJobStatus,	//(jobid, cbfunc)
	getStates		: _getStates,
	evaluateConditions : _evaluateConditions,		// evaluate a device condition table ( AND between conditions )

	createDevice	: _createDevice,
	deleteDevice	: _deleteDevice,
	renameDevice	: _renameDevice,	// ( device, newname )
	updateNeighbors	: _updateNeighbors, // id=lu_action&action=UpdateNeighbors&Device=3&DeviceNum=1
	createRoom		: _createRoom,
	deleteRoom		: _deleteRoom,
	renameRoom		: _renameRoom,		// _renameRoom(id,name)
	runScene		: _runScene,
	editScene		: _editScene,			//(sceneid,scene);
	renameScene		: _renameScene,			//(sceneid,scene);
	deleteScene		: _deleteScene,
	modifyDevice		: _modifyDevice,
	modifyPlugin		: _modifyPlugin,
	reloadEngine	: _reloadEngine,
	reboot			: _reboot,
	setStartupCode	: _setStartupCode,

	getCategoryTitle : _getCategoryTitle,
	getCategories	 : _getCategories,
	getDeviceTypes	: function()		{	return _devicetypes; },
	// isRemoteAccess	: function()	{	return window.location.origin.indexOf("mios.com")!=-1; /*return true;*/ },

	// energy
	getPower		: _getPower,

	// color
	setColor		: _setColor,

	// stats
	resetPollCounters : _resetPollCounters,

	// oscommand http://192.168.1.16/port_3480/data_request?id=lr_ALTUI_Handler&command=oscommand&oscommand=df
	osCommand		: _osCommand,	//(cmd,bSilent, cbfunc)
	runLua			: _runLua,

	// UI5 Compatibility mode: caching user data changes and saving them at user request
	updateChangeCache : _updateChangeCache,
	saveChangeCaches  : _saveChangeCaches,
	initializeJsonp	  : _initializeJsonp,
	initializeSysinfo : _initializeSysinfo,

	// save page data into altui plugin device
	saveData		: _saveData,		//	name, data , cbfunc
	stopEngine		: _stopEngine,
	saveEngine		: _saveEngine,
	clearEngine		: _clearEngine,
	loadEngine		: _loadEngine,		// optional user_data
	initDataEngine : _initDataEngine,
	isUserDataCached	: _isUserDataCached,
	RequestBackup : _RequestBackup,
	initEngine		: function( firstuserdata )		{
		_bStopEngine = false;
		_loadEngine( firstuserdata );
		return _initDataEngine();				// init the data collection engine
	},
  };
});	// not invoked, object does not exists

function _todo() {
	console.log("TODO called , Call Stack=");
	var stack = new Error().stack;
	console.log( stack );
	return null;
};
