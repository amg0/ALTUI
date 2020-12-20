//# sourceURL=J_ALTUI_multibox.js
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


var MultiBox = ( function( window, undefined ) {
	var _recorder = null;
	var _devicetypesDB = {};
	_devicetypesDB[0] = {};

	var _controllers = [
		// { ip:''			  ,	 controller:null },		// no IP = primary box on which we opened the web page
		// { ip:'192.168.1.5',	controller:null }		// no IP = primary box on which we opened the web page
	];

	function _controllerOf(altuiid) {
		var elems = altuiid.split("-");
		return { controller:parseInt(elems[0]) , id:elems[1] };
	};
	function _isAltuiid(devid) {
		if (typeof (devid) == "number")
			return false;
		var elems = devid.split("-");
		return (elems.length>1);
	};
	function _makeAltuiid(ctrlid, devid) {
		return "{0}-{1}".format(ctrlid,devid);
	};
	function _isControllerFeature(altuiid,required_feature) {
		var info = MultiBox.controllerOf(altuiid)
		var c = _controllers[ info.controller ]
		return (required_feature==null ) || ( $.isFunction(c.controller[required_feature])==true )
	};
	function _getControllers(required_feature) {
		var arr = _controllers.filter( function(c) {
			return (required_feature==null ) || ( $.isFunction(c.controller[required_feature])==true )
		})
		return arr; //$.map(arr,function(c) { return {	ip:c.ip , name:c.name, box_info:c.controller.getBoxFullInfo(), controller: c.controller } });
	};
	function _initDB(devicetypes) {
		$.extend(true,_devicetypesDB[0],devicetypes);	// data received initially comes from ctrl 0
		return this;
	};
	function _getALTUITypesDB() {
		return _devicetypesDB[0];
	}
	function _getDeviceTypesDB(controllerid) {
		var id = controllerid || 0;
		return _devicetypesDB[controllerid];
	}
	function _addDeviceType(controllerid,devtype, obj) {
		var id = controllerid || 0;
		if (_devicetypesDB[id][devtype]==null) {
			_devicetypesDB[id][devtype]={};
		};
		return $.extend(true,_devicetypesDB[id][devtype],obj);
	};
	function _updateDeviceTypeUPnpDB( controllerid, devtype, Dfilename )	{
		var dfd = $.Deferred();
		var id = controllerid || 0;
		if (_devicetypesDB[id][devtype]==null)
			_devicetypesDB[id][devtype]={};

		// only try to load if not loaded or in the process of loading it
		if (_devicetypesDB[id][devtype].Dfilename == undefined) {
			_devicetypesDB[id][devtype].Dfilename = Dfilename;

			// get it into the cache ( or get it from the cache )
			FileDB.getFileContent(id, Dfilename , function( xmlstr , jqXHR ) {
				try {
					var doc = jqXHR ? ((jqXHR.responseXML != undefined) ? jqXHR.responseXML : $.parseXML( xmlstr )) : $.parseXML( xmlstr );

					var xml = $( doc );
					var imp = xml.find("implementationFile");
					_devicetypesDB[id][devtype].Ifilename= imp.text();
					_devicetypesDB[id][devtype].Services = [];
					var serviceIDs = xml.find("serviceId");
					var Sfilenames = xml.find("SCPDURL");
					xml.find("serviceId").each( function (index,value) {
						// get all services files name, but do not get content, will be fetched on demand
						_devicetypesDB[id][devtype].Services.push({
							ServiceId : $(value).text(),
							SFilename : $(Sfilenames[index]).text(),
							Actions : []
						});
					});
					dfd.resolve(true);
				}
				catch(e) {
					console.log("error in xml parsing, Dfile:"+Dfilename);
					console.log("xmlstr"+xmlstr);
					dfd.reject()
				}
			});
		} else {
			dfd.resolve(true);	
		}
		return dfd.promise()
	};
	function _updateDeviceTypeUIDB(controllerid, devtype, ui_definitions)	{
		if (_devicetypesDB[controllerid]==null) {
			_devicetypesDB[controllerid]={};
		}
		if (_devicetypesDB[controllerid]['json']==null) {
			_devicetypesDB[controllerid]['json']={};
		}
		if (_devicetypesDB[controllerid][devtype]==null) {
			_devicetypesDB[controllerid][devtype]={};
		};
		if (ui_definitions.device_json && (_devicetypesDB[controllerid]['json'][ui_definitions.device_json]==undefined)) {
			_devicetypesDB[controllerid]['json'][ui_definitions.device_json]= { ui_static_data : ui_definitions }
		}
		_devicetypesDB[controllerid][devtype].ui_static_data = ui_definitions;
	};
	function _getDeviceStaticData(device) {
		var elems = device.altuiid.split("-");

		function _getDeviceStaticDataByType(device) {
			if (_devicetypesDB[elems[0]][device.device_type] == undefined) {
				AltuiDebug.debug("_getDeviceStaticData({0}) does not find static data".format(device.altuiid));
				return null;
			}
			return _devicetypesDB[elems[0]][device.device_type].ui_static_data
		}

		if ((device==null)||(device.device_type==null))
			return null;

		if (device.device_json) {
			if (_devicetypesDB[elems[0]]['json'] && _devicetypesDB[elems[0]]['json'][device.device_json]!=undefined) {
				// AltuiDebug.debug("_getDeviceStaticData({0}) found static data by json:{1}".format(device.altuiid,device.device_json));
				return _devicetypesDB[elems[0]]['json'][device.device_json].ui_static_data;
			}
		}
		return _getDeviceStaticDataByType(device)
	}
	function  _getAllEvents(name) {
		return $.map( _controllers , function(o,i) {return name+"_"+i } );
	};

	function _initEngine(extraController,firstuserdata, maincontrollertype) {
		var dfd = $.Deferred();

		// initialize controller 0 right away, no need to wait
		maincontrollertype = maincontrollertype || "V";
		var newcontroller = {
			ip:'',
			type:maincontrollertype,
			name:'Main',
			controller:null
		};
		switch(newcontroller.type) {
			// case "A":
			// 	newcontroller.controller = new AltuiBox(0,'');		// create the main controller
			// 	break;
			case "V":
			default:
				newcontroller.controller = new VeraBox(0,'');		// create the main controller
		}

		_controllers.push(newcontroller);		// default controller

		// add the extra controllers
		if (extraController.trim().length>0) {
			$.each(extraController.split(','), function(idx,ctrlinfo) {
				var splits = ctrlinfo.trim().split("-");
				var newcontroller = {
					ip:splits[0],
					name:splits[0],
					type:splits[1] || 'V',
					controller:null
				}
				switch (newcontroller.type) {
					// case 'A':
					// 	newcontroller.controller = new AltuiBox(1+idx,newcontroller.ip);
					// 	break;
					case 'V':
					default:
						newcontroller.controller = new VeraBox(1+idx,newcontroller.ip);
				}
				_controllers.push(newcontroller);

				// init device type DB for that controller
				if (_devicetypesDB[idx]==null)
					_devicetypesDB[idx]={};
			});
		}

		// prepare to wait for proper initialization
		EventBus.waitForAll("on_ui_userDataLoaded", _getAllEvents("on_ui_userDataLoaded"), this, null , g_ALTUI.g_CtrlTimeout )
		.always( function(data) {
			// check data , if a controller is missing, disable it
			var todel=[]
			$.each(data, function(key,elem) {
				if (elem==false) {
					todel.push(key.substring("on_ui_userDataLoaded_".length))
				}
			})
			$.each(todel.reverse(), function(idx,val) {
				// delete controller val
				var msg = _T("controller {0} did not respond.").format(_controllers[val].name)
				console.log(msg)
				if (val!=0) {
					console.log(_T("disabling this secondary controller now"))
					MultiBox.stopEngine(val)
					_controllers.splice(val, 1)
					setTimeout(function(msg){
						PageMessage.message( msg, "warning");
					}, 1000, msg)
				} else {
					console.log("Cannot disable main controller, trying to continue...")
				}
			})
			EventBus.publishEvent("on_ui_userDataLoaded");
			dfd.resolve(true)
		})

		// now start the engine
		$.each(_controllers, function(idx,box) {
			box.controller.initEngine( (idx==0) ? firstuserdata : null );		// will raise("on_ui_userDataFirstLoaded_"+_uniqID) ("on_ui_userDataLoaded_"+_uniqID)
		});

		return dfd.promise();
	};
	
	function _stopEngine(controller) {
		return _controllers[controller].controller.stopEngine();
	};

	function _initializeJsonp(controller) {
		return _controllers[controller].controller.initializeJsonp();
	};

	function _saveEngine() {
		$.each(_controllers, function(idx,box) {
			box.controller.saveEngine();
		});
		return;
	};
	function _clearEngine() {
		$.each(_controllers, function(idx,box) {
			box.controller.clearEngine();
		});
		return;
	};
	function _getUrlHead(altuiid) {
		var elems = altuiid.split("-");
		return _controllers[elems[0]].controller.getUrlHead();
	};
	function _getIpAddr(altuiid) {
		var elems = altuiid.split("-");
		return (_controllers[elems[0]]==undefined)	? null : _controllers[elems[0]].controller.getIpAddr();
	};
	function _isUI5(controller) {
		if (controller==0)
			return (_devicetypesDB[0]["info"].ui7Check == "false" );	// we were told by Lua plugin
		return _controllers[controller].controller.isUI5();
	};
	function _getDataProviders(cbfunc) {
		return _controllers[0].controller.getDataProviders(cbfunc);
	};
	function _initializeJsonp(controller) {
		return _controllers[controller].controller.initializeJsonp();
	};
	function _RequestBackup(controller, cbfunc) {
		return _controllers[controller].controller.RequestBackup(cbfunc);
	}
	function _initializeSysinfo(controller) {
		return _controllers[controller].controller.initializeSysinfo();
	}
	function _setHouseMode(newmode,cbfunc) {
		return _controllers[0].controller.setHouseMode(newmode,cbfunc);
	};
	function _getHouseModeSwitchDelay() {
		return _controllers[0].controller.getHouseModeSwitchDelay();
	};
	function _getRooms( func , filterfunc, endfunc) {
		var dfd = $.Deferred();
		var arr=[];
		var answers=0;
		$.each(_controllers, function( i,c) {
			c.controller.getRooms(
				function( idx, room) {
					var index = arr.length;
					arr.push(room);
					if ($.isFunction(func))
						(func)(index,room);
				} ,
				filterfunc,
				function(rooms) {
					answers++;
					if (answers == _controllers.length) {
						var result = arr.sort(altuiSortByName);
						if ($.isFunction(endfunc))
							(endfunc)(result);
						dfd.resolve(result);
					}
				}
			);
		});
		return dfd.promise();
	};
	function _getRoomsSync() {
		var arr=[];
		$.each(_controllers, function( i,c) {
			arr = arr.concat(c.controller.getRoomsSync( ));
		});
		return arr.sort(altuiSortByName);
	};
	function _getRoomByID( controllerid, roomid ) {
		return _controllers[controllerid].controller.getRoomByID( roomid );
	};
	function _getRoomByAltuiID( altuiid ) {
		var elems = altuiid.split("-");
		return (_controllers[elems[0]]==undefined)	? null : _controllers[ elems[0] ].controller.getRoomByID( elems[1] );
	};
	function _getUsers(func , filterfunc, endfunc) {
		var arr=[];
		var answers=0;
		$.each(_controllers, function( i,c) {
			c.controller.getUsers(
				function( idx, user) {
					var index = arr.length;
					arr.push(user);
					if ($.isFunction(func))
						(func)(index,user);
				} ,
				filterfunc,
				function(users) {
					answers++;
					if (answers == _controllers.length) {
						if ($.isFunction(endfunc))
							(endfunc)(arr.sort(altuiSortByName2));
					}
				}
			);
		});
		return _getUsersSync();
	};
	function _getUsersSync(controllerid) {
		var arr=[];
		if (controllerid!=null)
			arr = arr.concat(_controllers[controllerid].controller.getUsersSync( ));
		else
			$.each(_controllers, function( i,c) {
				arr = arr.concat(c.controller.getUsersSync( ));
			});
		return arr.sort(altuiSortByName2);
	};
	function _getUserByID(controllerid, userid) {
		return _controllers[controllerid].controller.getUserByID( userid );
	};
	function _getMainUser() {
		var usrs = _controllers[0].controller.getUsersSync();
		if ( (usrs!=null) && (usrs.length>=1) )
			return usrs[0];

		var user = MyLocalStorage.getSettings('MainUser')
		if (user==null) {
			user=  uuidv4();	//joint.util.uuid();
			MyLocalStorage.setSettings('MainUser',user);
		}
		return {Name:user};
	};

	function _deleteRoom(room) {
		var elems = room.altuiid.split("-");
		return (_controllers[elems[0]]==undefined)	? null : _controllers[elems[0]].controller.deleteRoom(elems[1]);
	};
	function _createRoom(controllerid, name, cbfunc ) {
		return _controllers[controllerid].controller.createRoom(name, cbfunc);
	};
	function _renameRoom(room, name) {
		var elems = room.altuiid.split("-");
		return (_controllers[elems[0]]==undefined)	? null : _controllers[elems[0]].controller.renameRoom(elems[1],name);
	};
	function _createDevice( controllerid, param , cbfunc ) {
		var id = controllerid || 0;
		return _controllers[id].controller.createDevice( param , function(newid) {
			(cbfunc)("{0}-{1}".format(id,newid));
		});
	};
	function _renameDevice( device, newname, roomid ) {
		var elems = device.altuiid.split("-");
		return (_controllers[elems[0]]==undefined)	? null : _controllers[elems[0]].controller.renameDevice( device, newname, roomid);
	};
	function _deleteDevice(device) {
		// delete watches
		$.each(["VariablesToSend","VariablesToWatch"], function(idx,whichwatch) {
			$.each( MultiBox.getWatches(whichwatch,function(w) { return (w.deviceid == device.altuiid) }), function(i,watch) {
				MultiBox.delWatch(watch);
			});
		});
		var elems = device.altuiid.split("-");
		return (_controllers[elems[0]]==undefined)	? null : _controllers[elems[0]].controller.deleteDevice(elems[1]);
	};
	function _getDevices( func , filterfunc, endfunc, required_feature ) {
		var arr=[];
		var answers = 0;
		var ctrls = (required_feature==null) ?  _controllers : _getControllers(required_feature)		// only controllers which can create devices		
		$.each(ctrls, function( i,c) {
			c.controller.getDevices( func , filterfunc, function(devices){
				arr = arr.concat(devices);
				answers++;
				if ((answers == ctrls.length) && ($.isFunction(endfunc)) ){
					(endfunc)( arr );
				};
			});
		});
		return arr;
	};
	function _getDevicesSync() {
		var arr=[];
		$.each(_controllers, function( i,c) {
			arr = arr.concat(c.controller.getDevicesSync());
		});
		return arr;
	};
	function _getDeviceBatteryLevel(device) {
		var elems = device.altuiid.split("-");
		return (_controllers[elems[0]]==undefined)	? null : _controllers[elems[0]].controller.getDeviceBatteryLevel(device);
	};
	function _getDeviceByAltuiID( devid ) {
		var elems = devid.split("-");
		return (_controllers[elems[0]]==undefined)	? null :_controllers[ elems[0] ].controller.getDeviceByID( elems[1] );
	};
	function _getDeviceByID( controllerid , devid ) {
		return (_controllers[controllerid]==undefined)	? null : _controllers[controllerid].controller.getDeviceByID( devid );
	};
	function _getDeviceByAltID( controllerid, parentdevid , altid ) {
		var id = controllerid || 0;
		return _controllers[id].controller.getDeviceByAltID( parentdevid , altid );
	};
	function _getDeviceByType(controllerid,str,opt_parents_arr) {
		var id = controllerid || 0;
		return _controllers[id].controller.getDeviceByType(str,opt_parents_arr);
	};
	function _getDeviceActions(device,cbfunc) {
		if (device==null) {
			cbfunc([]);
			return [];
		}
		var elems = device.altuiid.split("-");
		return (_controllers[elems[0]]==undefined)	? null : _controllers[elems[0]].controller.getDeviceActions(device,cbfunc);
	};
	function _getDeviceService(device,ServiceId,cbfunc) {
		var dfd = $.Deferred();
		MultiBox.getDeviceActions(device,function( services ) {
			var found = null;
			$.each(services, function(idx,service) {
				if (service.ServiceId == ServiceId) {
					found = service;
					return false;
				}
			})
			if ($.isFunction(cbfunc))
				(cbfunc)(found);
			dfd.resolve( { device:device, service:found } );
		})
		return dfd.promise();
	};
	function _getDeviceEvents(device) {
		if (device==null) return [];
		var elems = device.altuiid.split("-");
		return (_controllers[elems[0]]==undefined)	? null : _controllers[elems[0]].controller.getDeviceEvents(device);
	};
	function _getDeviceDependants(device) {
		var elems = device.altuiid.split("-");
		return (_controllers[elems[0]]==undefined)	? null : _controllers[elems[0]].controller.getDeviceDependants(device);
	};
	function _getDeviceVariableHistory( device, varidx, cbfunc) {
		var elems = device.altuiid.split("-");
		return (_controllers[elems[0]]==undefined)	? null : _controllers[elems[0]].controller.getDeviceVariableHistory( device, varidx, cbfunc);
	};
	function _delWatch( w ) {
		w = $.extend({sceneid:-1, luaexpr:'true', xml:'', provider:''},w);
		return _controllers['0'].controller.delWatch( w	 )
	};
	function _addWatch( w ) {
		w = $.extend({sceneid:-1, luaexpr:'true', xml:'', provider:''},w);
		return _controllers['0'].controller.addWatch( w	 )
	};
	function _getWatches(whichwatches,filterfunc) {
		if ((whichwatches!="VariablesToWatch") && (whichwatches!="VariablesToSend"))
			return null;
		return _controllers['0'].controller.getWatches( whichwatches,filterfunc );
	};
	function _getWatchesHistory(cbfunc) {
		return _controllers['0'].controller.getWatchesHistory( cbfunc );
	};
	function _getStatesByAltuiID(altuiid) {
		var elems = altuiid.split("-");
		return (_controllers[elems[0]]==undefined)	? null : _controllers[elems[0]].controller.getStates( elems[1]	);
	};
	function _getStateByID( altuiid, id ) {
		id = parseInt(id);
		var found = null;
		var states = _getStatesByAltuiID(altuiid)
		$.each(states, function( idx, state) {
			if (state.id==id) {
				found = state;
				return false;
			}
		})
		return found;
	}
	function _getStates( device ) {
		if (device==null) return null;
		var elems = device.altuiid.split("-");
		return (_controllers[elems[0]]==undefined)	? null : _controllers[elems[0]].controller.getStates( elems[1]	);
	};
	function _getStatus( device, service, variable ) {
		if (device==null) return null;
		var elems = device.altuiid.split("-");
		return (_controllers[elems[0]]==undefined)	? null : _controllers[elems[0]].controller.getStatus( elems[1], service, variable );
	};
	function _setStatus( device, service, variable, value, dynamic ) {
		if (_recorder!=null ) {
			_recorder.record( {type:'variable_set', device:device.altuiid, service:service, value:value } );
			return;
		}
		var elems = device.altuiid.split("-");
		return (_controllers[elems[0]]==undefined)	? null : _controllers[elems[0]].controller.setStatus( elems[1], service, variable, value, dynamic );
	};
	function _getJobStatus( controllerid, jobid , cbfunc )
	{
		return (_controllers[controllerid]==undefined)	? null : _controllers[controllerid].controller.getJobStatus( jobid, cbfunc );
	};
	function _runAction(device, service, action, params,cbfunc) {
		if (_recorder!=null ) {
			_recorder.record( {type:'action', device:device.altuiid, service:service, action:action, params:params } );
			return;
		}
		var elems = device.altuiid.split("-");
		EventBus.publishEvent("on_deviceAction",device.altuiid, service, action, params)
		return (_controllers[elems[0]]==undefined)	? null : _controllers[elems[0]].controller.runAction( elems[1], service, action, params, cbfunc )
	};
	function _runActionByAltuiID(altuiid, service, action, params,cbfunc) {
		if (_recorder!=null ) {
			_recorder.record( {type:'action', device:altuiid, service:service, action:action, params:params } );
			return;
		}
		var elems = altuiid.split("-");
		EventBus.publishEvent("on_deviceAction",altuiid, service, action, params)
		return (_controllers[elems[0]]==undefined)	? null : _controllers[elems[0]].controller.runAction(elems[1], service, action, params,cbfunc);
		// return (_controllers[elems[0]]==undefined)  ? null : _controllers[elems[0]].controller.getUPnPHelper().UPnPAction(elems[1], service, action, params,cbfunc);
	};
	// function _getAttr(device, attribute) {
		// var elems = device.altuiid.split("-");
		// return (_controllers[elems[0]]==undefined)	? null : _controllers[elems[0]].controller.getAttr(elems[1], attribute);
	// };
	function _setAttr(device, attribute, value,cbfunc) {
		var elems = device.altuiid.split("-");
		return (_controllers[elems[0]]==undefined)	? null : _controllers[elems[0]].controller.setAttr(elems[1], attribute, value,cbfunc);
	};
	function _isDeviceZwave(device) {
		var elems = device.altuiid.split("-");
		return (_controllers[elems[0]]==undefined)	? null : _controllers[elems[0]].controller.isDeviceZwave(device);
	};
	function _isDeviceZigbee(device) {
		var elems = device.altuiid.split("-");
		return (_controllers[elems[0]]==undefined)	? null : _controllers[elems[0]].controller.isDeviceZigbee(device);
	};
	function _isDeviceBT(device) {
		var elems = device.altuiid.split("-");
		return (_controllers[elems[0]]==undefined)	? null : _controllers[elems[0]].controller.isDeviceBT(device);
	};
	function _isDeviceBattery(device) {
		var level = MultiBox.getDeviceBatteryLevel(device)
		return (level!=null)
	};
	function _updateNeighbors(device) {
		var elems = device.altuiid.split("-");
		return (_controllers[elems[0]]==undefined)	? null : _controllers[elems[0]].controller.updateNeighbors(elems[1]);
	};
	function _modifyDevice(device,cb) {
		var elems = device.altuiid.split("-");
		return (_controllers[elems[0]]==undefined)	? null : _controllers[elems[0]].controller.modifyDevice(elems[1]);
	}
	function _setColor(device,hex) {
		var elems = device.altuiid.split("-");
		return (_controllers[elems[0]]==undefined)	? null : _controllers[elems[0]].controller.setColor(elems[1],hex);
	}
	function _getCategories( cbfunc, filterfunc, endfunc ) {
		var dfd = $.Deferred();
		var arr=[];
		var answers = 0;
		$.each(_controllers, function( idx,c) {
			var index = idx;
			c.controller.getCategories(
				function (idx,cat) {
					var index = arr.length;
					if ($.inArray(cat.name,$.map(arr,function(e){ return e.name }))==-1)
						arr.push(cat);
				},
				filterfunc,
				function (categories) {
					answers++;
					if (answers == _controllers.length) {
						var arr2 = arr.sort(altuiSortByName);
						if ($.isFunction(cbfunc))
							$.each(arr2, cbfunc);

						if ($.isFunction(endfunc))
							(endfunc)(arr2);

						dfd.resolve(categories);
					}
				}
			);
		});
		return dfd.promise();
	};
	function _getCategoryTitle(catnum) {
		return _controllers[0].controller.getCategoryTitle(catnum);	//returns (found !=undefined) ? found : '';
	};
	function _evaluateConditions(device,conditions) {
		var elems = device.altuiid.split("-");
		var cat = device.category_num || 0
		var subcat = device.subcategory_num || 0
		return (_controllers[elems[0]]==undefined)	? null : _controllers[elems[0]].controller.evaluateConditions(elems[1],cat,subcat,conditions);
	};
	function _getWeatherSettings() {
		return _controllers[0].controller.getWeatherSettings();
	};
	function _reloadEngine(controllerid) {
		var id = controllerid || 0;
		return _controllers[id].controller.reloadEngine();
	};
	function _reboot(controllerid) {
		var id = controllerid || 0;
		return _controllers[id].controller.reboot();
	};
	function _deleteScene(scene) {
		var elems = scene.altuiid.split("-");
		// delete watches
		$.each( MultiBox.getWatches( "VariablesToWatch",
					function(w) { return (elems[0]==0) && (w.sceneid == elems[1]) }
				),
				function(i,watch) {
					MultiBox.delWatch(watch);
				}
		);
		return (_controllers[elems[0]]==undefined)	? null : _controllers[elems[0]].controller.deleteScene(elems[1]);
	};
	function _getNewSceneID(controllerid) {
		var id = controllerid || 0;
		var newid= _controllers[id].controller.getNewSceneID();
		return {
			id:			newid,
			altuiid:	"{0}-{1}".format(controllerid,newid)
		};
	};
	function _getScenes( func , filterfunc, endfunc ) {
		var arr=[];
		var answers = 0;
		$.each(_controllers, function( i,c) {
			c.controller.getScenes( func , filterfunc, function(scenes) {
				arr = arr.concat(scenes);
				answers++
				if ((answers==_controllers.length) && ($.isFunction(endfunc))) {
					(endfunc)(arr);
				}
			});
		});
		return arr;
	};
	function _getScenesSync() {
		var arr=[];
		$.each(_controllers, function( i,c) {
			arr = arr.concat(c.controller.getScenesSync());
		});
		return arr;
	};
	function _getSceneByID(controllerid,sceneid) {
		return (_controllers[controllerid]==undefined)	? null : _controllers[controllerid].controller.getSceneByID(sceneid)
	};
	function _getSceneByAltuiID(altuiid) {
		var elems = altuiid.split("-");
		return (_controllers[elems[0]]==undefined)	? null : _controllers[elems[0]].controller.getSceneByID(elems[1])
	};
	function _getSceneHistory( scene, cbfunc) {
		var elems = scene.altuiid.split("-");
		return (_controllers[elems[0]]==undefined)	? null : _controllers[elems[0]].controller.getSceneHistory( elems[1], cbfunc);
	};
	function _editScene(altuiid,scenejson,cbfunc) {
		var elems = altuiid.split("-");
		return (_controllers[elems[0]]==undefined)	? null : _controllers[elems[0]].controller.editScene(elems[1],scenejson,cbfunc);
	};
	function _renameScene(scene,newname) {
		var elems = scene.altuiid.split("-");
		return (_controllers[elems[0]]==undefined)	? null : _controllers[elems[0]].controller.renameScene(elems[1],newname);
	};
	function _runScene(scene) {
		if (_recorder!=null ) {
			_recorder.record( {type:'scene', altuiid:scene.altuiid } );
			return;
		}
		var elems = scene.altuiid.split("-");
		EventBus.publishEvent("on_sceneRun",scene.altuiid)
		return (_controllers[elems[0]]==undefined)	? null : _controllers[elems[0]].controller.runScene(elems[1]);
	};
	function _runSceneByAltuiID(altuiid) {
		if (_recorder!=null ) {
			_recorder.record( {type:'scene', altuiid:altuiid } );
			return;
		}
		var elems = altuiid.split("-");
		EventBus.publishEvent("on_sceneRun",altuiid)
		return (_controllers[elems[0]]==undefined)	? null : _controllers[elems[0]].controller.runScene(elems[1]);
	};
	function _setSceneMonitorMode(scene,mode,cbfunc) {
		var elems = scene.altuiid.split("-");
		return (_controllers[elems[0]]==undefined)	? null : _controllers[elems[0]].controller.setSceneMonitorMode( elems[1], mode, cbfunc);
	};
	function _getWorkflowStatus(cbfunc) {
		return _controllers[0].controller.getWorkflowStatus(cbfunc);
	};
	function _getWorkflowHistory(altuiid, cbfunc) {
		return _controllers[0].controller.getWorkflowHistory(altuiid, cbfunc);
	};
	function _getWorkflows(cbfunc) {
		return _controllers[0].controller.getWorkflows(cbfunc);
	};
	function _forceRefreshWorkflows(cbfunc) {
		return _controllers[0].controller.forceRefreshWorkflows(cbfunc);
	};
	function _getCustomPages(cbfunc) {
		return _controllers[0].controller.getCustomPages(cbfunc);
	}
	function _isWorkflowEnabled() {
		return _controllers[0].controller.isWorkflowEnabled();
	};
	function _runLua(controllerid, code, cbfunc) {
		var id = controllerid || 0;
		return _controllers[id].controller.runLua(code, cbfunc);
	};
	function _getLuaStartup(controllerid) {
		var id = controllerid || 0;
		return _controllers[id].controller.getLuaStartup();
	};
	function _setStartupCode(controllerid,code) {
		var id = controllerid || 0;
		if (id==0)
			return _controllers[id].controller.setStartupCode(code);
		else {
			var dfd = $.Deferred();
			dfd.reject();
			return dfd.promise();
		}
	};
	function _saveChangeCaches( controllerid,msgidx ) {
		var id = controllerid || 0;
		return _controllers[id].controller.saveChangeCaches( msgidx );
	};
	function _updateChangeCache( controllerid,target ) {
		var id = controllerid || 0;
		return _controllers[id].controller.updateChangeCache( target );
	};
	function _saveData( key, name, data , cbfunc) {
		return _controllers[0].controller.saveData( key, name, data , cbfunc );
	};
	function _getPlugins( func , endfunc ) {
		var arr=[];
		$.each(_getControllers("getPlugins"), function( i,c) {
			arr = arr.concat(c.controller.getPlugins( func , null ));
		});
		if ($.isFunction(endfunc))
			(endfunc)( arr );
		return arr;
	};
	function _deletePlugin( altuiid, pluginid, cbfunc) {
		var elems = altuiid.split("-");
		return (_controllers[elems[0]]==undefined)	? null : _controllers[elems[0]].controller.getUPnPHelper().UPnPDeletePlugin(pluginid,cbfunc);
	};
	function _updatePluginFromStore(plugin, cbfunc) {
		return _controllers[0].controller.getUPnPHelper().UPnPUpdatePlugin2(plugin,cbfunc);
	};
	function _updatePlugin( altuiid, pluginid, cbfunc) {
		var elems = altuiid.split("-");
		return (_controllers[elems[0]]==undefined)	? null : _controllers[elems[0]].controller.getUPnPHelper().UPnPUpdatePlugin(pluginid,cbfunc);
	};
	function _updatePluginVersion( altuiid, pluginid, ver, cbfunc) {
		var elems = altuiid.split("-");
		return (_controllers[elems[0]]==undefined)	? null : _controllers[elems[0]].controller.getUPnPHelper().UPnPUpdatePluginVersion(pluginid,ver,cbfunc);
	};
	function _modifyPlugin(altuiid,pluginid,changes,cbfunc) {
		var elems = altuiid.split("-");
		return (_controllers[elems[0]]==undefined)	? null : _controllers[elems[0]].controller.modifyPlugin(pluginid,changes,cbfunc);
	};
	function _getFileUrl(controllerid, filename ) {
		var id = controllerid || 0;
		return _controllers[id].controller.getFileUrl( filename);
	};
	function _getFileContent(controllerid, filename , cbfunc) {
		var id = controllerid || 0;
		return _controllers[id].controller.getFileContent( filename, cbfunc);
	};
	function _osCommand(controllerid, cmd, bSilent, cbfunc) {
		var id = controllerid || 0;
		return _controllers[id].controller.osCommand(cmd,bSilent,cbfunc);
	};
	function _getPower(cbfunc) {
		var lines=[];
		var ctrls = _getControllers("getPower");
		var todo = ctrls.length;
		$.each(ctrls, function( idx,c) {
			var idx = idx;
			c.controller.getPower(function(data) {
				if (data != "No devices")
					$.each(data.split('\n'), function(i,line) {
						if (line.length>0)
							lines.push( idx+"-"+line );
					});
				todo--;
				if ((todo==0) && ($.isFunction(cbfunc)))
					(cbfunc)(lines.join('\n'));
			});
		});
	};
	function _resetPollCounters() {
		var dfd = $.Deferred();
		var ctrls = _getControllers("resetPollCounters");
		var todo  = ctrls.length;
		$.each(ctrls, function(i,c) {
			c.controller.resetPollCounters(function() {
				todo--;
				if (todo==0)
					dfd.resolve();
			});
		});
		return dfd.promise();
	};
	function _enableCORS(controller, bEnable, cbfunc) {
		return _controllers[controller].controller.enableCORS(bEnable,cbfunc);
	}
	function _enableNightlyHeal(controller, bEnableOrNull,  cbfunc) {
		return _controllers[controller].controller.enableNightlyHeal(bEnableOrNull, cbfunc);
	}
	function _candoCORS(controller) {
		return _controllers[controller].controller.candoCORS();
	}
	function _isUserDataCached(controllerid) {
		var id = controllerid || 0;
		return _controllers[id].controller.isUserDataCached();
	};
	function _getIconPath( controllerid, iconname ) {
		var id = controllerid || 0;
		return _controllers[id].controller.getIconPath( iconname );
	};
	function _getIconContent( controllerid, imgpath , cbfunc ) {
		var id = controllerid || 0;
		return _controllers[id].controller.getIconContent( imgpath , cbfunc );
	};
	function _loadIcon( controllerid, imgpath , cbfunc ) {
		var id = controllerid || 0;
		return _controllers[id].controller.loadIcon( imgpath , cbfunc );
	};
	function _triggerAltUIUpgrade(newversion,newtracnum) {
		return _controllers[0].controller.triggerAltUIUpgrade(newversion,newtracnum);
	};

	function Recorder( callback ) {
		this._log = [ ];
		this._callback = callback;
		this.getLog = function() {
			return this._log;
		}
		this.record = function( action ) {
			this._log.push(action);
			if ($.isFunction(this._callback))
				(this._callback)(action)
		}
	};

	function _isRecording() {
		return _recorder != null;
	};
	function _startRecorder( callback ) {
		if (_recorder == null )
			_recorder  = new Recorder( callback );
	};
	function _stopRecorder() {
		if (_recorder == null )
			return;
		var log=_recorder.getLog();
		_recorder = null;
		return log;
	};

  return {
	//---------------------------------------------------------
	// PUBLIC  functions
	//---------------------------------------------------------

	//static info per device type
	initDB					: _initDB,	// (devicetypes)
	initEngine				: _initEngine,
	stopEngine				: _stopEngine,
	reloadEngine			: _reloadEngine,
	reboot					: _reboot,
	saveEngine				: _saveEngine,	//()
	clearEngine				: _clearEngine,	//()

	// controller selection
	controllerOf : _controllerOf,	//(deviceid)
	makeAltuiid	 : _makeAltuiid,
	isAltuiid	 : _isAltuiid,
	getControllers : _getControllers,
	isControllerFeature: _isControllerFeature,

	// Device Type DB
	getALTUITypesDB			: _getALTUITypesDB,			// no param
	getDeviceTypesDB		: _getDeviceTypesDB,		// ( controllerid )
	addDeviceType			: _addDeviceType,			// (devtype, obj)				update devitetype plugin function calls ( from Lua )
	updateDeviceTypeUPnpDB	: _updateDeviceTypeUPnpDB,	//( controllerid, devtype, Dfilename )		update devicetype UPNP information ( from D_xx S_xx files )
	updateDeviceTypeUIDB	: _updateDeviceTypeUIDB,	//( controllerid, devtype, ui_definitions)		update devicetype UI static infos ( from user_data )
	getDeviceStaticData		: _getDeviceStaticData,		//(device)
	// Access & Modes
	isRemoteAccess	: function()	{	return window.location.href.indexOf("mios.com")!=-1; /*return true;*/ },
	getBoxInfo		: function( ctrlid )	{	return _controllers[ctrlid || 0].controller.getBoxInfo(); },
	getBoxFullInfo	: function( ctrlid )	{	return _controllers[ctrlid || 0].controller.getBoxFullInfo(); },
	getMajorMinor	: function( ctrlid )	{	return _controllers[ctrlid || 0].controller.getMajorMinor(); },
	getHouseMode	: function(cb)	{	return _controllers[0].controller.getHouseMode(cb); },		// (cbfunc)
	setHouseMode	: _setHouseMode,		// (newmode,cbfunc)
	getHouseModeSwitchDelay : _getHouseModeSwitchDelay,
	RequestBackup: _RequestBackup,

	// Rooms
	getRooms		: _getRooms,		// in the future getRooms could cache the information and only call _getRooms when needed
	getRoomsSync	: _getRoomsSync,	//()
	deleteRoom		: _deleteRoom,		//(room)
	createRoom		: _createRoom,		//(controllerid, name, cbfunc )
	renameRoom		: _renameRoom,		//(controllerid, room, name)  returns a promise
	getRoomByID		: _getRoomByID,		//( roomid )
	getRoomByAltuiID:_getRoomByAltuiID,	//(altuiid)

	// Users
	getUsers		: _getUsers,
	getUsersSync	: _getUsersSync,
	getUserByID		: _getUserByID,
	getMainUser		: _getMainUser,

	// Devices
	createDevice			: _createDevice,			// ( param , cbfunc )
	deleteDevice			: _deleteDevice,			// id
	renameDevice			: _renameDevice,			// (device, newname )
	getDevices				: _getDevices,				// ( func , filterfunc, endfunc )
	getDevicesSync			: _getDevicesSync,			// ()
	getDeviceByAltuiID		: _getDeviceByAltuiID,		// ( devid )
	getDeviceByType			: _getDeviceByType,			// ( str )
	getDeviceByID			: _getDeviceByID,			// ( controller, devid )
	getDeviceByAltID		: _getDeviceByAltID,		// ( parentdevid , altid )
	getDeviceActions		: _getDeviceActions,		// (device,cbfunc)
	getDeviceEvents			: _getDeviceEvents,			// (device)
	getDeviceDependants		: _getDeviceDependants,		// (device)
	getDeviceBatteryLevel	: _getDeviceBatteryLevel,	// ( device )
	getDeviceVariableHistory : _getDeviceVariableHistory,//( device, varidx, cbfunc)
	getDeviceService		: _getDeviceService,		// device, serviceId
	addWatch				: _addWatch,				// (  service, variable, deviceid, sceneid, expression, xml, provider, params)
	delWatch				: _delWatch,				// (  service, variable, deviceid, sceneid, expression, xml, provider, params )getWatches(whichwatches)
	getWatches				: _getWatches,				// (whichwatches,filterfunc)
	getWatchesHistory		: _getWatchesHistory,		// (cbfunc)
	evaluateConditions		: _evaluateConditions,		// ( device,devsubcat,conditions ) evaluate a device condition table ( AND between conditions )
	getStates				: _getStates,				// ( device )
	getStatesByAltuiID		: _getStatesByAltuiID,		// (altuiid)
	getStateByID			: _getStateByID,				// ( device, id )		// return idx of state object in states array , by ID
	getStatus				: _getStatus,				// ( device, service, variable )
	setStatus				: _setStatus,				// ( device, service, variable, value, dynamic )
	getJobStatus			: _getJobStatus,			// (  jobid , cbfunc )
	// getAttr					: _getAttr,					// device , attribute
	setAttr					: _setAttr,					// ( device, attribute, value,function(result) )
	runAction				: _runAction,				// (device, service, action, params,cbfunc);
	runActionByAltuiID		: _runActionByAltuiID,		// (altuiid, service, action, params,cbfunc)
	isDeviceZwave			: _isDeviceZwave,			// (device)
	isDeviceZigbee			: _isDeviceZigbee,			// (device)
	isDeviceBT				: _isDeviceBT,				// (device)
	isDeviceBattery			: _isDeviceBattery,			// (device)
	updateNeighbors			: _updateNeighbors,			// (device)
	modifyDevice		: _modifyDevice,

	//Alias
	setOnOff				: function ( altuiid, onoff) {
								MultiBox.runActionByAltuiID( altuiid, 'urn:upnp-org:serviceId:SwitchPower1', 'SetTarget', {'newTargetValue':onoff} );
							},
	setArm					: function ( altuiid, armed) {
								this.runActionByAltuiID( altuiid, 'urn:micasaverde-com:serviceId:SecuritySensor1', 'SetArmed', {'newArmedValue':armed} );
							},
	setDoorLock				: function ( altuiid, armed) {
								this.runActionByAltuiID( altuiid, 'urn:micasaverde-com:serviceId:DoorLock1', 'SetTarget', {'newTargetValue':armed} );
							},
	setColor		: _setColor,

	// Categories
	getCategoryTitle : _getCategoryTitle,		// ( catnum )
	getCategories	 : _getCategories,			// ( cbfunc, filterfunc, endfunc )

	// Scenes
	deleteScene			: _deleteScene,		//id
	getNewSceneID		: _getNewSceneID,	//()
	getScenes			: _getScenes,		//( func , filterfunc, endfunc ) {
	getSceneByID		: _getSceneByID,	//(sceneid) {
	getSceneByAltuiID	: _getSceneByAltuiID, // (altuiid)
	getSceneHistory		: _getSceneHistory,	//( id, cbfunc) {
	getScenesSync		: _getScenesSync,	//()
	editScene			: _editScene,		//(altuiid,scenejson, function(result)
	renameScene			: _renameScene,		// (scene, newname)
	runScene			: _runScene,		//(id)
	runSceneByAltuiID	: _runSceneByAltuiID,
	setSceneMonitorMode : _setSceneMonitorMode,

	// workflows
	getWorkflows		: _getWorkflows,
	getWorkflowStatus	: _getWorkflowStatus,
	getWorkflowHistory	: _getWorkflowHistory,
	forceRefreshWorkflows: _forceRefreshWorkflows,
	isWorkflowEnabled	: _isWorkflowEnabled,

	// pages
	getCustomPages : _getCustomPages,

	// Plugins
	getPlugins			: _getPlugins,			//( func , endfunc )
	deletePlugin		: _deletePlugin,		//(id,function(result)
	updatePluginFromStore : _updatePluginFromStore,
	updatePlugin		: _updatePlugin,		//(id,function(result)
	updatePluginVersion	: _updatePluginVersion,	//(id,ver,function(result)
	modifyPlugin		: _modifyPlugin,

	// Misc
	getUrlHead			: _getUrlHead,			// ()
	getIpAddr			: _getIpAddr,			// ()
	isUI5				: _isUI5,				// (controller)
	initializeJsonp		: _initializeJsonp,		// (controller)
	initializeSysinfo	: _initializeSysinfo,	// (controller)
	getDataProviders	: _getDataProviders,	// (controller)
	getWeatherSettings	: _getWeatherSettings,	// ()
	runLua				: _runLua,				//(code, cbfunc)
	getLuaStartup		: _getLuaStartup,		//()
	setStartupCode		: _setStartupCode,		//(code)
	saveChangeCaches	: _saveChangeCaches,	//( msgidx )
	updateChangeCache	: _updateChangeCache,	//( target )
	saveData			: _saveData,			//( name, data , cbfunc)
	getFileUrl			: _getFileUrl,			//(filename)
	getFileContent		: _getFileContent,		//(Dfilename , function( xmlstr , jqXHR )
	osCommand			: _osCommand,			//(cmd,cbfunc)
	getPower			: _getPower,			//(cbfunc)
	resetPollCounters	: _resetPollCounters,	//()	!  promise API
	isUserDataCached	: _isUserDataCached,	//()
	enableNightlyHeal	: _enableNightlyHeal,	//(controller, bEnableOrNull)
	enableCORS			: _enableCORS,			//(controller, bEnable, cbfunc)
	candoCORS			: _candoCORS,			//(controller)
	getIconPath			: _getIconPath,			// (device,str)
	getIconContent		: _getIconContent,				// ( controllerid, imgpath , cbfunc )
	loadIcon			: _loadIcon,			//
	// buildUPnPGetFileUrl : _buildUPnPGetFileUrl,	// (name)

	// Upgrade
	triggerAltUIUpgrade : _triggerAltUIUpgrade,	// (newversion,newtracnum)	: newrev number in TRAC

	// Recorder
	isRecording		: _isRecording,
	startRecorder	: _startRecorder,
	stopRecorder	: _stopRecorder,
	// DEBUG

  };
} )( window );
