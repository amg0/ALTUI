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
			var val = null;
			for ( var idx=0; idx<_user_data.devices.length; idx++) {
				var device = _user_data.devices[idx];
				if (device.id==deviceid) {
					for (var stateidx=0; stateidx<device.states.length; stateidx++) {
						var state = device.states[stateidx];
						if ((state.service==service) && (state.variable==variable)) {
							val= state.value;
							return val;
						}
					}
				}
			}
			return val;
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
		evaluateConditions : function(deviceid,devsubcat,conditions) {
			var bResult = false;
			var expressions=[];
			var that = this;
			var cache = {}
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
				if ( (condition.service!=undefined) && (condition.variable!=undefined) &&
					 ( (condition.subcategory_num==undefined) || (condition.subcategory_num==0) || (devsubcat==-1) || (condition.subcategory_num==devsubcat) ) )
				{
					var str = "";
					if (isInteger( condition.value )) {
						// var val = that.getStatus( deviceid, condition.service, condition.variable );
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
					AltuiDebug.debug("Invalid State Icon condition definition for deviceid:"+deviceid);
				}
			}
			var str = expressions.join(" && ");
			AltuiDebug.debug("_evaluateConditions(deviceid:{0} devsubcat:{1} str:{2} conditions:{3})".format(deviceid,devsubcat,str,JSON.stringify(conditions)));
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
			if (dt.Services) {
				var todo = dt.Services.length;
				if (todo==0)
					cbfunc(dt.Services);
				$.each(dt.Services, function (idx,service) {
					// warning, async call, so result comes later. we need to wait until completion
					var that = service.Actions;
					// if (that.length==0) 	// if actions are not already loaded
					// {
						FileDB.getFileContent(controller,service.SFilename , function( xmlstr ) {
							var xml = $( $.parseXML( xmlstr ) );
							$.each(xml.find("action"), function( idx,action) {
								var name = $(action).find("name").first().text();	// action name is the first one
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
			AltuiDebug.debug("_loadDeviceActions() : no services");	
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
				AltuiDebug.debug("_getDeviceActions(null) : null device");
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
	var LU_STATUS_MINDELAY=  parseInt(ctrlOptions[0]) || 1500;
	var LU_STATUS_TIMEOUT= parseInt(ctrlOptions[1]) || 60;

	var _uniqID = uniq_id;								// assigned by Multibox, unique, can be used for Settings & other things
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
	function _setRooms(arr) 		{	_rooms = arr;		};
	function _setScenes(arr) 		{	_scenes = arr;		};
	function _setCategories(arr)	{	_categories = arr;	};
	function _setDevices(arr) 		{	_devices = arr;		};
	
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
			_upnpHelper.unproxifyResult(data, textStatus, jqXHR, function(data,textStatus,jqXHR) {
				if (isNullOrEmpty(data))
					_sysinfo=={};
				else if ($.isPlainObject( data ))
					_sysinfo = data;
				else 
					_sysinfo = JSON.parse(data);
			});
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
				cache: 	false
			} , opts);

		var jqxhr = $.ajax( options)
				.done(function(data, textStatus, jqXHR) {
					_upnpHelper.unproxifyResult(data, textStatus, jqXHR, function(data,textStatus,jqXHR) {
						if ($.isFunction(cbfunc))
							(cbfunc)(data, textStatus, jqXHR);
					});
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
		if ( $.isFunction( endfunc ) )  {
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
			return _asyncResponse( _rooms.sort(altuiSortByName), func , filterfunc, endfunc)
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
			return _asyncResponse( _scenes.sort(altuiSortByName), func , filterfunc, endfunc);
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
	
	function _getDevices( func , filterfunc, endfunc ) {
		if (_devices !=null)
			return _asyncResponse( _devices.sort(altuiSortByName), func, filterfunc, endfunc )
		return _asyncResponse( [], func, filterfunc, endfunc );
	};
	function _getCategories( cbfunc, filterfunc, endfunc )
	{
		//http://192.168.1.16:3480/data_request?id=sdata&output_format=json
		if (_categories==null) {
			var jqxhr = _httpGet("?id=sdata&output_format=json",{},function(data, textStatus, jqXHR) {
				if (data) {
					var arr = JSON.parse(data);
					_categories = arr.categories;
					if ( $.isFunction( cbfunc ) )  {
						_asyncResponse( _categories.sort(altuiSortByName), cbfunc, filterfunc, endfunc );
					}
				} else {
					_categories = null;
					_asyncResponse( [], cbfunc, filterfunc, endfunc );
					// PageMessage.message( _T("Controller {0} is busy, be patient.").format(_upnpHelper.getIpAddr()) , "warning");
				}
			});
			return [];
		} 
		return _asyncResponse( _categories.sort(altuiSortByName), cbfunc, filterfunc, endfunc );
	};
	
	function _getIconPath(name) {
		if (_uniqID==0)
			return "/cmh/skins/default/img/devices/device_states/{0}".format( name);
		return "//{0}/cmh/skins/default/img/devices/device_states/{1}".format( _upnpHelper.getIpAddr(), name);	
	};
	
	function _getIcon( imgpath , cbfunc ) {
		var jqxhr = _httpGet("?id=lr_ALTUI_Handler&command=image",{ data: { path: imgpath } },cbfunc);
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

	function _getWorkflowHistory(altuiid,cbfunc) {
		// var cmd = "cat /var/log/cmh/LuaUPnP.log | grep 'Wkflow - nextWorkflowState('".format(altuiid);
		// var cmd = "tail -n 2000 /var/log/cmh/LuaUPnP.log | grep '[0123456789]: ALTUI: Wkflow - nextWorkflowState(.*, {0},.*==>'".format(altuiid);
		// Wkflow - Workflow:'Workflow 0-2' nextWorkflowState(0-2, Thingspeak ==> Idle, Timer:Retour)
		
		var str = (altuiid) ? altuiid : "[0123456789]{1,}-[0123456789]{1,}"
		var cmd = "cat /var/log/cmh/LuaUPnP.log | grep -E '[0123456789]: ALTUI: Wkflow - Workflow: {0}, Valid Transition found'".format(str);
		return _osCommand(cmd,true,function(str) {
			if (str.success==true) {
				var lines = [];
				var re = /\d*\t(\d*\/\d*\/\d*\s\d*:\d*:\d*.\d*).*Wkflow - Workflow: (.*), Valid Transition found:(.*), Active State:(.*)=>(.*) /g; 
				var m;
				while ((m = re.exec(str.result)) !== null) {
					if (m.index === re.lastIndex) {
						re.lastIndex++;
					}
					// View your result using the m-variable.
					// eg m[0] etc.
					lines.push({
						date:m[1], 
						altuiid:m[2],
						firing_link:m[3],
						old_state:m[4], 
						new_state:m[5]
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
	function _getDeviceByType( device_type ) {
		for (var i=0; i<_user_data.devices.length; i++ ) {
			if (_user_data.devices[i].device_type==device_type)
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
			value = " "

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

		if (dynamic >= 0 )  {
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
	
	function _evaluateConditions(deviceid,devsubcat,conditions) {
		return UserDataHelper(_user_data).evaluateConditions(deviceid,devsubcat,conditions);
	};

	function _refreshEngine() {
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
					// console.log("controller #{0} received  lu_status2 with data.UserData_DataVersion={1} ".format(_uniqID,data.UserData_DataVersion));
					if (data.devices != undefined)
					{
						$.each(data.devices, function( idx, device) {
							var userdata_device_idx = UserDataHelper(_user_data).findDeviceIdxByID(device.id);
							if (userdata_device_idx!=-1) {								
								_user_data.devices[userdata_device_idx].status = device.status;
								_user_data.devices[userdata_device_idx].Jobs = device.Jobs;
								_user_data.devices[userdata_device_idx].dirty = true;

								if (device.states !=null) {
									$.each(device.states, function( idx, state) {
										$.each( _user_data.devices[userdata_device_idx].states , function( idx, userdata_state)
										{
											if ((userdata_state.service == state.service) && (userdata_state.variable == state.variable))
											{
												_user_data.devices[userdata_device_idx].states[idx].value = state.value;
												return false; // break from the $.each()
											}
										});
									});
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
					UIManager.refreshUI( false , false );	// partial and not first time
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
						// PageMessage.message( _T("Controller {0} is busy, be patient.").format(_upnpHelper.getIpAddr()) , "warning");
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
		if ((data) && (data != "NO_CHANGES") && (data != "Exiting") )
		{
			var bFirst = (_user_data_DataVersion==1);
			if ($.isPlainObject( data )==false)
				data = JSON.parse(data);
			$.extend(_user_data, data);
			// _user_data = cloneObject(data);	
			_user_data_DataVersion = data.DataVersion;
			_user_data_LoadTime = data.LoadTime;
			_rooms = data.rooms;
			_scenes = data.scenes;
			_devices = data.devices;
			
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
			$.each(_user_data.devices || [], function(idx,device) {
				var dt = device.device_type;
				var df = device.device_file;
				if (dt && (dt!="") && df && (df!="") )
					MultiBox.updateDeviceTypeUPnpDB( _uniqID, dt, device.device_file);	// pass device file so UPNP data can be read
				if (device!=null) {	
					device.dirty=true; 
					EventBus.publishEvent("on_ui_deviceStatusChanged",device);
				}
			});		
			if (data.devices) {
				if (bFirst)
					EventBus.publishEvent("on_ui_userDataFirstLoaded_"+_uniqID);
				EventBus.publishEvent("on_ui_userDataLoaded_"+_uniqID);				
			}
			
			_upnpHelper.setConfig( {
				isOpenLuup: _isOpenLuup(_user_data),
				candoPost: _candoPost(_user_data)
			});
		}
	};

	function _isUserDataCached() {	return MyLocalStorage.get("VeraBox"+_uniqID)!=null; }
	
	function _saveEngine() {
		AltuiDebug.debug("_saveEngine()");
		var verabox = {
			_user_data : _user_data,
		};
		return MyLocalStorage.set("VeraBox"+_uniqID,verabox);
	};
	function _clearEngine() {
		return MyLocalStorage.clear("VeraBox"+_uniqID);
	};

	function _loadEngine( user_data ) {
		AltuiDebug.debug("_loadEngine()");
		if (user_data) {	// if received in parameter ( like pre-prepared by Lua module )
			_user_data	= user_data;
		} else {	// or try to get from cache
			var verabox = MyLocalStorage.get("VeraBox"+_uniqID);
			if (verabox) {
				_user_data				= verabox._user_data || {};
			}
		}
		_user_data_DataVersion 	= 1;
		_user_data_LoadTime 	= null;
		_user_data.BuildVersion = undefined;		// to keep the "waiting" message for the user			
		_loadUserData(_user_data);
	};
	
	// start the polling loop to get user_data
	function _initDataEngine() {
		_dataEngine = null;
		AltuiDebug.debug("_initDataEngine()");
		// console.log("controller #{0} is requesting user_data with _user_data_DataVersion={1}".format(_uniqID,_user_data_DataVersion));
		var jqxhr = _httpGet( "?id=user_data&output_format=json&DataVersion="+_user_data_DataVersion,
			{beforeSend: function(xhr) { xhr.overrideMimeType('text/plain'); }},
			function(data, textStatus, jqXHR) {
				// console.log("controller #{0} received user_data _user_data_DataVersion={1}".format(_uniqID,_user_data_DataVersion));
				if (data!=null) {
					_dataEngine = null;
					_loadUserData(data);
					UIManager.refreshUI( true ,false  );	// full but not first time
					_dataEngine = setTimeout( _refreshEngine, 2000 );				
				}
				else {
					_dataEngine = setTimeout( _initDataEngine, 2000 );
					// PageMessage.message( _T("Controller {0} did not respond").format(_upnpHelper.getIpAddr() ) + ", textStatus: " + textStatus , "danger");
				}
			})
			.always(function() {
				AltuiDebug.debug("_initDataEngine() (user_data) returned.");
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
		// if (( _veraidx==0) && (_cfg.isOpenLuup!=true) && ( versioninfo.length>=4 ) && (versioninfo[1] >=1 ) && (versioninfo[2] >=7 ) && (versioninfo[3] >= 2138 )) {
		return ( _uniqID==0) && ( versioninfo.length>=4 ) && (versioninfo[1] >=1 ) && (versioninfo[2] >=7 ) && (versioninfo[3] >= 2138 );
	};
	function _isOpenLuup(user_data) {
		if ( (user_data.BuildVersion==undefined) || (user_data.BuildVersion.startsWith("*1.5")==true) )
			return false;
		return (user_data.SvnVersion==undefined)
	}
	function _getLuaStartup() {
		return _user_data.StartupCode || "";
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
		// used to be MCV facility , now replaced with ALTUI facility
		// return _upnpHelper.UPnPRunLua(code, function(result) {
			// var res = "Fail";
			// if ((result!=null ) && (result.indexOf("<OK>OK</OK>") !=-1))
				// res ="Passed";
			// if ($.isFunction( cbfunc )) 
				// cbfunc(res);
		// });
		// var jqxhr = _httpGet( "?id=lr_ALTUI_Handler&command=run_lua&lua={0}".format( encodeURIComponent(code) ), {}, function(data, textStatus, jqXHR) {
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
			
		AltuiDebug.debug("_clearData( {2}, {0}, page:{1} )".format(name,npage,handle));
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

		AltuiDebug.debug("_saveDataChunk( {4},{3}, {0}, page:{1}, data:{2} chars  )".format(name,npage,data.length,key,handle));
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
				data: (doPost==true) ? data : encodeURIComponent(data),
				dummy:'x'
			}
		})
		.done(function(data, textStatus, jqXHR) {
			AltuiDebug.debug("_saveDataChunk( {5}, {4}, {0}, page:{1}, data:{2} chars  ) => Res:{3}".format(name,npage,data.length,JSON.stringify(data),key,handle));
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

	function _saveData( key, name, data , cbfunc) {
		if (_uniqID!=0)	{
			// only supported on master controller
			AltuiDebug.debug("_saveData must only be called on master controller #0");
			return;
		}	
		AltuiDebug.debug("_saveData( {0}, {1} chars )".format(name,data.length));

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
				_saveDataChunk(context.doPost, context.handle, context.key, context.name, context.npage, part,  function(data) {
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
		return _xxxWatch( 'delWatch', w  );
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
								lastUpdate: varvalue.LastUpdate
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
		$.each(variable.split(';'), function(i,line) {
			var w = (linefunc)(line);
			if ($.isFunction(filterfunc)) {
				if ( (filterfunc)(w,i) )
					result.push(w);
			} else {
				result.push(w);
			}
		});
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
			if  ((ui_static_data == undefined) || (ui_static_data.eventList2==undefined))
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
					_setStatus( id, service, "PollNoReply", 0   );
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
	getDataProviders    : _getDataProviders,	// (cbfunc)
	getFileUrl			: _getFileUrl,			//(filename)
	getFileContent :  _getFileContent,			//( filename , cbfunc)
	triggerAltUIUpgrade : _triggerAltUIUpgrade,	// (newversion,newtracnum)  : newrev number in TRAC
	getIconPath		: _getIconPath,		// ( src )
	getIcon			: _getIcon, 		// workaround to get image from vera box
	getWeatherSettings : _getWeatherSettings,
	isUI5			: _isUI5,				
	isOpenLuup : _isOpenLuup,
	getBoxInfo		: _getBoxInfo,		//()
	getBoxFullInfo	: _getBoxFullInfo,		//()
	getLuaStartup 	: _getLuaStartup,
    getRooms		: _getRooms,		// in the future getRooms could cache the information and only call _getRooms when needed
    getRoomsSync	: function() 		{ return _rooms; },
	getRoomByID		: _getRoomByID,		// roomid
	getDevices		: _getDevices,
    getDevicesSync	: function() 		{ return _devices; },
	getDeviceByType : _getDeviceByType,
	getDeviceByAltID : _getDeviceByAltID,
	getDeviceByID 	: _getDeviceByID, 
	getDeviceBatteryLevel : _getDeviceBatteryLevel,
	getDeviceStaticUI : _getDeviceStaticUI,
	getDeviceVariableHistory : _getDeviceVariableHistory,
	getDeviceActions: _getDeviceActions,
	getDeviceEvents : _getDeviceEvents,
	getDeviceDependants : _getDeviceDependants,
	runAction 		: _runAction,
	addWatch		: _addWatch,				// ( lul_device, service, variable, deviceid, sceneid, expression, xml, provider, params)
	delWatch		: _delWatch,				// ( lul_device, service, variable, deviceid, sceneid, expression, xml, provider, params)
	getWatches		: _getWatches,				// (whichwatches,filterfunc)
	getWatchesHistory	: _getWatchesHistory,	// (cbfunc)
	isDeviceZwave	: function(device) { return UserDataHelper(_user_data).isDeviceZwave(device) },
	isDeviceZigbee	: function(device) { return UserDataHelper(_user_data).isDeviceZigbee(device) },
	isDeviceBT		: function(device) { return UserDataHelper(_user_data).isDeviceBT(device) },
	getScenes		: _getScenes,
	getSceneHistory : _getSceneHistory,
	getScenesSync	: function() 		{ return _scenes; },
	getSceneByID 	: _getSceneByID,
	getNewSceneID	: _getNewSceneID,

	// pages
	getCustomPages : _getCustomPages,
	
	// worklflows
	getWorkflows 	: _getWorkflows,
	getWorkflowStatus : _getWorkflowStatus,
	getWorkflowHistory: _getWorkflowHistory,
	isWorkflowEnabled : _isWorkflowEnabled,
	getPlugins		: _getPlugins,
	getPluginByID 	: _getPluginByID, 
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
	getDeviceTypes 	: function() 		{	return _devicetypes; },
	// isRemoteAccess	: function() 	{ 	return window.location.origin.indexOf("mios.com")!=-1; /*return true;*/ },

	// energy
	getPower		: _getPower,
	
	// color
	setColor		: _setColor,
	
	// stats
	resetPollCounters : _resetPollCounters,
	
	// oscommand http://192.168.1.16/port_3480/data_request?id=lr_ALTUI_Handler&command=oscommand&oscommand=df
	osCommand 		: _osCommand,	//(cmd,bSilent, cbfunc)		
	runLua			: _runLua,
	
	// UI5 Compatibility mode: caching user data changes and saving them at user request
	updateChangeCache : _updateChangeCache,
	saveChangeCaches  : _saveChangeCaches,
	initializeJsonp	  : _initializeJsonp,
	initializeSysinfo : _initializeSysinfo,

	// save page data into altui plugin device
	saveData		: _saveData,		//  name, data , cbfunc
	saveEngine 		: _saveEngine, 
	clearEngine		: _clearEngine,
	loadEngine 		: _loadEngine, 		// optional user_data
	isUserDataCached	: _isUserDataCached,
	RequestBackup : _RequestBackup,

	initEngine		: function( firstuserdata ) 	{
						_loadEngine( firstuserdata );
						_initDataEngine();				// init the data collection engine
					},		
  };
});	// not invoked, object does not exists

var AltuiBox = ( function( uniq_id, ip_addr ) {
	var _uniqID = uniq_id;		// assigned by Multibox, unique, can be used for Settings & other things
	var _ip_addr = (ip_addr=="") ? window.location.host : ip_addr;
	var _altuibox_url = "//{0}".format(_ip_addr);
	var _user_data = {};
	var _dataEngine = null;

	function _todo() { 
		console.log("TODO called , Call Stack=");
		var stack = new Error().stack;
		console.log( stack );
		return null;  
	};

	function _refreshEngine() {
		// start the polling loop to get user_data
		var jqxhr = $.ajax( {
			url: _altuibox_url+"/api/engine_data",
			type: "GET",
			cache: false,
			dataType : 'json'
		})
		.done(function(data) {
			var bFirst = ( _user_data=={} );
			_user_data = $.extend(true,{},data);
			//assigns altuiids
			$.each(_user_data.devices, function(idx,device) {
				device.altuiid = "{0}-{1}".format(_uniqID,device.id);
				device.favorite=Favorites.get('device',device.altuiid);
			});
			$.each(_user_data.scenes, function(idx,scene) {
				scene.altuiid = "{0}-{1}".format(_uniqID,scene.id);
				scene.favorite=Favorites.get('scene',scene.altuiid);
			});
			_asyncResponse(_user_data.rooms);
			_user_data.static_data=[];
			// update upnp information
			$.each(_user_data.devices || [], function(idx,device) {
				var json = device.device_json;
				var dt = device.device_type;
				if (dt && json)
					FileDB.getFileContent(_uniqID, json , function( jsonstr ) {
						if (jsonstr) {
							try {
								// if file found and content != null
								var json = JSON.parse(jsonstr)
								_user_data.static_data.push(  json );
								MultiBox.updateDeviceTypeUIDB( _uniqID, dt, json );				
								if (dt!=undefined)
									MultiBox.updateDeviceTypeUPnpDB( _uniqID, dt, device.device_file);	// pass device file so UPNP data can be read
							} catch (e) {
								console.error("Parsing error:", e); 
							}
						}
					});
				if (device!=null) {	
					device.dirty=true; 
					EventBus.publishEvent("on_ui_deviceStatusChanged",device);
				}
			});	
			
			_dataEngine = setTimeout( _refreshEngine, 3000 );
			if (bFirst)
				EventBus.publishEvent("on_ui_userDataFirstLoaded_"+_uniqID);
			EventBus.publishEvent("on_ui_userDataLoaded_"+_uniqID);
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			if (_user_data == {})
				EventBus.publishEvent("on_ui_userDataFirstLoaded_"+_uniqID);
			_user_data = {};
			_dataEngine = setTimeout( _refreshEngine, 2000 );
		})
		.always(function() {
		});
	};
	
	function _initEngine() {
		_dataEngine = null;
		_refreshEngine()
	};
	
	function _asyncResponse(arr, func , filterfunc, endfunc) {
		var res=[];
		if (!arr)
			return null;
		
		$.each(arr, function(idx,elem) {
			if (arr[idx].altuiid==undefined)
				arr[idx].altuiid="{0}-{1}".format(_uniqID,elem.id);
			if ( ($.isFunction(filterfunc)==false) || (filterfunc(elem)==true) ) {
				res.push(elem);
				if ($.isFunction( func ))
					func(idx+1,elem);	// device id in Lua is idx+1
			}
		});
	
		if ( $.isFunction( endfunc ) )  {
			endfunc(res);			
		}
		return res;
	};
	
	function _getDevices( func , filterfunc, endfunc ) {
		if (_user_data.devices!=null) {
			return _asyncResponse(_user_data.devices, func , filterfunc, endfunc)
		};
		return _asyncResponse([], func , filterfunc, endfunc);
	};
	function _getWatches(whichwatches , filterfunc) {
		if ((whichwatches!="VariablesToWatch") && (whichwatches!="VariablesToSend")) 
			return null;
		return [];
	};
	function _getScenes( func , filterfunc, endfunc ) {
		if (_user_data.scenes!=null) {
			return _asyncResponse(_user_data.scenes, func , filterfunc, endfunc)
		};
		return _asyncResponse([], func , filterfunc, endfunc);
	};
	function _getRooms( func , filterfunc, endfunc ) {
		if (_user_data.rooms!=null) {
			return _asyncResponse(_user_data.rooms, func , filterfunc, endfunc)
		};
		return _asyncResponse([], func , filterfunc, endfunc);
	};
	function _getRoomsSync() { return _user_data.rooms };
	
	function _getCategories( func, filterfunc, endfunc )
	{
		if (_user_data.categories!=null) {
			return _asyncResponse(_user_data.categories, func , filterfunc, endfunc)
		};
		return _asyncResponse([], func , filterfunc, endfunc);
	};
	function _getStatus( deviceid, service, variable ) {
		return UserDataHelper(_user_data).getStatus( deviceid, service, variable );
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
	function _getDeviceBatteryLevel(device) {
		var batteryLevel=_getStatus( device.id, "urn:micasaverde-com:serviceId:HaDevice1", "BatteryLevel" );
		return batteryLevel; // Math.floor((Math.random() * 100) + 1);
	};
	
	function _getDeviceByID( devid ) {
		for (var i=0; i<_user_data.devices.length; i++) {
			if (_user_data.devices[i].id==devid)
				return _user_data.devices[i];
		}
		return null;
	};	
	function _runAction( deviceID, service, action, params, cbfunc ) {
		var jqxhr = $.ajax( {
			url: _altuibox_url+"/api/devices/{0}/action/{1}/{2}".format(deviceID,service,action),
			type: "PUT",
			cache: false,
			data: {
				params:JSON.stringify(params)
			},
		})
		.done(function(data, textStatus, jqXHR) {
			if ($.isFunction(cbfunc))
				(cbfunc)(data);
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			if ($.isFunction(cbfunc))
				(cbfunc)(null);
		})
		.always(function() {
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
	function _getRoomByID( roomid ) {
		for (var i=0; i<_user_data.rooms.length; i++) {
			if (_user_data.rooms[i].id == roomid)
				return _user_data.rooms[i];
		}
		return null;
	};
	function _getSceneByID(sceneid) {
		for (var i=0;i<_user_data.scenes.length;i++) {
			if (_user_data.scenes[i].id == sceneid)
				return _user_data.scenes[i];
		}
		return null;
	};
	function _getNewSceneID() {
		return ALTUI_NEW_SCENE_ID;
	};
	function _getScenesSync() { 
		return _user_data.scenes || [];
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
	
	function _getWeatherSettings()
	{
		var target = {tempFormat: "", weatherCountry: "", weatherCity: ""};
		$.extend(target, _user_data.weatherSettings);
		return target;
	};
	function _getVariable(variable, cbfunc)
	{
		var jqxhr = $.ajax( {
			url: _altuibox_url+"/api/variables/"+variable,
			type: "GET",
			cache: false,
			dataType : 'json'
		})
		.done(function(data, textStatus, jqXHR) {
			if ($.isFunction(cbfunc))
				(cbfunc)(data.value || "1");
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			if ($.isFunction(cbfunc))
				(cbfunc)(null);
		})
		.always(function() {
		});		
		return jqxhr;
	};
	function _setVariable(variable, value, cbfunc) {
		var jqxhr = $.ajax( {
			url: _altuibox_url+"/api/variables/"+variable,
			type: "PUT",
			cache: false,
			data: {
				json:JSON.stringify( { value:value } )
			},
		})
		.done(function(data, textStatus, jqXHR) {
			if ($.isFunction(cbfunc))
				(cbfunc)(data);
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			if ($.isFunction(cbfunc))
				(cbfunc)(null);
		})
		.always(function() {
		});		
		return jqxhr;
	};
	function _getHouseMode(cbfunc) {
		return _getVariable('Mode',cbfunc);
	};
	function _getHouseModeSwitchDelay() {
		return ( parseInt(_user_data.mode_change_delay || 9) +3);
	};
	function _setHouseMode(newmode,cbfunc) {
		if ((newmode<=4) && (newmode>=1)) {
			return _setVariable('Mode',newmode,cbfunc);
		}
		return null;
	};
	function _isUserDataCached() {	
		return MyLocalStorage.get("AltuiBox"+_uniqID)!=null; 
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
		return usedin_objects;
	};
	function _getCategoryTitle(catnum)
	{
		return UserDataHelper(_user_data).getCategoryTitle(_user_data,catnum);

	};
	function _getFileUrl( filename) {
		return _altuibox_url+"/files/"+filename;
	};
	function _getFileContent( filename , cbfunc) {
		// http://192.168.1.114:3000/files/D_ALTUI.xml
		var jqxhr = $.ajax( {
			url: _getFileUrl(filename),
			type: "GET",
			cache: false,
			dataType: "text",
			processData: false			// prevent jquery to process data to receive it as pure TEXT
		})
		.done(function(data, textStatus, jqXHR) {
			if ($.isFunction(cbfunc))
				(cbfunc)(data);
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			AltuiDebug.debug( "http Get for file {0} failed".format( filename ));
			if ($.isFunction(cbfunc))
				(cbfunc)(null);
		})
		.always(function() {
		});		
		return jqxhr;
	};
	function _getIconPath(iconname) {
		return "//{0}/images/{1}".format(_ip_addr, iconname);
	};
	function _getDeviceActions(device,cbfunc) {
		return UserDataHelper(_user_data).getDeviceActions(device,cbfunc);
	};
	
	function _initializeSysinfo() {
		return {
			"installation_number" : "12345678",
			"firmware_version": "0.1",
			// "zwave_version" : "4.5",
			// "zwave_homeid" : "016B4491",
			// "zwave_locale" : "eu",
			// "hwaddr": "",
			// "ergykey": "",
			// "timezone": "Europe|Brussels|CET-1CEST,M3.5.0,M10.5.0/3",
			// "Server_Device": "vera-us-oem-device11.mios.com",
			// "Server_Event": "vera-us-oem-event11.mios.com",
			// "Server_Relay": "vera-eu-oem-relay12.mios.com",
			// "Server_Storage": "vera-us-oem-storage11.mios.com",
			// "Server_Support": "vera-us-oem-ts11.mios.com",
			// "Server_Log": "vera-us-oem-log11.mios.com",
			// "Server_Firmware": "vera-us-oem-firmware11.mios.com",
			// "Server_Event": "vera-us-oem-event11.mios.com",
			// "Server_Account": "vera-us-oem-account11.mios.com",
			// "Server_Autha": "vera-us-oem-autha11.mios.com",
			// "Server_Authd": "vera-us-oem-authd11.mios.com",
			// "rauser": "",
			// "rapass": "",
			// "radisabled": "",
			// "raemail": "",
			// "raport": "35837",
			// "auth_user": "",
			// "remote_only": "1",
			// "terminal_disabled": "0",
			// "failsafe_tunnels": "0",
			// "3g_wan_failover": "0",
			// "secure_unit": "0",
			// "manual_version": "1",
			"platform": "Altuibox",
			"full_platform": "Altuibox",
			"skin": "altui",
			"language": "1",
			"ui_language": "en",
			// "account": ""
		}
	};
	
  // explicitly return public methods when this object is instantiated
  return {
	//---------------------------------------------------------
	// PUBLIC  functions
	//---------------------------------------------------------
	getFileUrl		: _getFileUrl,			//(filename)
	getFileContent  : _getFileContent,
	getUPnPHelper	: function ()   { console.assert(false,"Altuibox controller %s does not have a UPNP interface",_ip_addr); return null; } ,
	getIpAddr		: function () 	{ return _ip_addr; },
	getUrlHead		: function ()   { return (_ipaddr=='') ? window.location.pathname : ("http://{0}".format(_ip_addr)); },
	getDataProviders    : _todo,	// (cbfunc)
	triggerAltUIUpgrade : _todo,	// (newversion,newtracnum)  : newrev number in TRAC
	getIconPath		: _getIconPath,		// ( src )
	getIcon			: _todo, 		// workaround to get image from vera box
	getWeatherSettings : _getWeatherSettings,
	isUI5			: function() 	{return false},				
	isOpenLuup : function() 	{return false},
	getBoxInfo		: _getBoxInfo,				//()
	getBoxFullInfo	: _getBoxFullInfo,		//()
	getLuaStartup 	: _todo,
    getRooms		: _getRooms,	// in the future getRooms could cache the information and only call _getRooms when needed
    getRoomsSync	: _getRoomsSync,
	getRoomByID		:  _getRoomByID,
	getDevices		:  _getDevices,
    getDevicesSync	: function() 	{ return _user_data.devices || []; },
	getDeviceByType : _todo,
	getDeviceByAltID : _todo,
	getDeviceByID 	: _getDeviceByID,	// devid
	getDeviceBatteryLevel : _getDeviceBatteryLevel,
	getDeviceStaticUI : _todo,
	getDeviceVariableHistory : _todo,
	getDeviceActions: _getDeviceActions,
	getDeviceEvents : _todo,
	getDeviceDependants: _getDeviceDependants,
	runAction : _runAction,
	addWatch			: _todo,
	delWatch			: _todo,
	getWatches			: _getWatches,
	isDeviceZwave	: function(device) { return UserDataHelper(_user_data).isDeviceZwave(device) },
	isDeviceZigbee	: function(device) { return UserDataHelper(_user_data).isDeviceZigbee(device) },
	isDeviceBT		: function(device) { return UserDataHelper(_user_data).isDeviceBT(device) },
	getScenes		: _getScenes,
	getSceneHistory : _todo,
	getScenesSync	: _getScenesSync,
	getSceneByID 	: _getSceneByID,
	getNewSceneID	: _getNewSceneID,

	// pages
	getCustomPages : _todo,
	
	// worklflows
	getWorkflows 	: _todo,
	getWorkflowStatus : _todo,
	getWorkflowHistory: _todo,
	isWorkflowEnabled : function() {return false},
	getPlugins		: _todo,
	getPluginByID 	: _todo,
	getUsers		: _getUsers,
	getUsersSync	: _getUsersSync,
	getUserByID		: _getUserByID,
	getHouseMode	: _getHouseMode,
	setHouseMode	: _setHouseMode,
	getHouseModeSwitchDelay : _getHouseModeSwitchDelay,
	setAttr			: _todo,
	setStatus		: _todo,
	getStatus		: _getStatus, //	( deviceid, service, variable )
	getJobStatus	: _todo,
	getStates		: _getStates,
	evaluateConditions : 	function (deviceid,devsubcat,conditions) {
		return UserDataHelper(_user_data).evaluateConditions(deviceid,devsubcat,conditions);
	},
	
	createDevice	: _todo,
	deleteDevice	: _todo,
	renameDevice	: _todo,
	updateNeighbors	: _todo,
	createRoom		: _todo,
	deleteRoom		: _todo,
	renameRoom		: _todo,
	runScene		: _todo,
	editScene		: _todo,
	renameScene	: _todo,
	deleteScene		: _todo,
	modifyDevice	: _todo,
	modifyPlugin		: _todo,
	reloadEngine	: _todo,
	reboot			: _todo,
	setStartupCode	: _todo,
	
	getCategoryTitle : _getCategoryTitle,
	getCategories	 : _getCategories,	//( cbfunc, filterfunc, endfunc ),
	getDeviceTypes 	: _todo,

	// energy
	getPower		: function (cbfunc) { (cbfunc)("No devices") },
	
	// color
	setColor		: _todo,
	
	// stats
	resetPollCounters : _todo,
	
	// oscommand http://192.168.1.16/port_3480/data_request?id=lr_ALTUI_Handler&command=oscommand&oscommand=df
	osCommand 		: _todo,
	runLua			: _todo,
	
	// UI5 Compatibility mode: caching user data changes and saving them at user request
	updateChangeCache : _todo,
	saveChangeCaches  : _todo,
	initializeJsonp	  : function () {
		jsonp={};
		jsonp.ud =_user_data;
		return jsonp;
	},
	initializeSysinfo : _initializeSysinfo,

	// save page data into altui plugin device
	saveData		: _todo,
	saveEngine 		: _todo,
	clearEngine		: _todo,
	loadEngine 		: _todo,
	isUserDataCached	: _isUserDataCached,
	initEngine		: 	_initEngine,
	RequestBackup : _todo
  };
});	// not invoked, object does not exists
