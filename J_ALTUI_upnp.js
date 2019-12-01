//# sourceURL=J_ALTUI_upnp.js
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
var UPnPHelper = (function(ip_addr,veraidx) {
	//---------------------------------------------------------
	// private functions
	//---------------------------------------------------------	
	var _cfg = {
		isOpenLuup: false,
		candoPost: false,
		candoCORS: false
	};
	var _veraidx = veraidx || 0;
	var _ipaddr = (ip_addr.trim()) || '';
	var _directCallPossible = function(url) {
		//url.includes("command=proxyget")
		var bResult = false;
		if ((_ipaddr=='') || (_ipaddr.indexOf(":3480")!=-1)) {
			bResult = true
		}
		if ((_cfg.candoCORS==true) && (url.includes("data_request")) ) {
			bResult = true
		}
		//console.log( (bResult ? "DIRECT" : "Indirect") , "-",url )
		return bResult
	}
	var _urlhead = (_ipaddr=='') ? window.location.pathname : ("http://{0}/port_3480/data_request".format(_ipaddr));
	var _proxyhead = "?id=lr_ALTUI_Handler&command=proxyget&resultName=none&newUrl=";

	function _proxify(url) {
		//console.log("ipaddr:%s  _cfg:%s _directCallPossible:%s, url:%s",_ipaddr,JSON.stringify(_cfg),_directCallPossible(),url)
		if (_directCallPossible(url))
			return url;
		if (url.substr(0,4) != "http")
			url = "http:"+url
		return (_proxyhead + encodeURIComponent( url ))
	}
	
	function _proxifySoap(url) {
		var url = _directCallPossible(url) ? url : "?id=lr_ALTUI_Handler&command=proxysoap&action={0}&newUrl={1}&envelop={2}&body={3}";
		return url;
	}
	
	// note must be called with this parapeter being the XHR - so called with apply(this,... )
	function _unproxifyResult(data, textStatus, jqXHR, cbfunc) {
		if ( _directCallPossible( this.url ) ) {
			if ($.isFunction( cbfunc ))
				(cbfunc)(data,  textStatus, jqXHR );
		}
		else {
			var success = (data[0]=="1");
			if ($.isFunction( cbfunc )) {
				cbfunc(success ? data.substr(2) : null ,textStatus,jqXHR);
			}
		}
	};

	function _getUrlHead() {
		return _urlhead;	// ALTUI device for proxy if needed (secondary vera)
	}
	
	function _buildAttributeSetUrl( deviceID, attribute, value) {
		// TODO: investigate if we can use : http://192.168.1.16/port_3480/data_request?id=lu_variableset&DeviceNum=58&Variable=onDashboard&Value=0
		// var url = _getUrlHead()+"?id=lr_ALTUI_Handler&command=set_attribute&devid="+deviceID+"&attr="+attribute+"&value="+encodeURIComponent(value);
		var url = _getUrlHead()+"?id=lu_variableset&DeviceNum="+deviceID+"&Variable="+attribute+"&Value="+encodeURIComponent(value || "");
		return _proxify(url);
	}
	
	//http://192.168.1.16/port_3480/data_request?id=lu_variableset&DeviceNum=208&serviceId=urn%3Amicasaverde-com%3AserviceId%3AZWaveDevice1&Variable=VariablesSet&Value=3%2Cm%2C&rand=0.6049749343656003
	function _buildVariableSetUrl( deviceID, service, varName, varValue)
	{
		var url = _getUrlHead()+'?id=variableset&DeviceNum='+deviceID+'&serviceId='+service+'&Variable='+varName+'&Value='+encodeURIComponent(varValue);
		return _proxify(url);
	}
	function _buildVariableGetUrl( deviceID, service, varName)
	{
		var url = _getUrlHead()+'?id=variableget&DeviceNum='+deviceID+'&serviceId='+service+'&Variable='+varName;
		return _proxify(url);
	}
	function _buildUPnPGetJobStatusUrl(jobID)
	{
		var url = _getUrlHead()+'?id=jobstatus&job='+jobID;
		return _proxify(url);
	}
	function _buildSceneCreateUrl(scenejson)
	{
		var url = _getUrlHead()+'?id=scene&action=create&json='+encodeURIComponent(scenejson);
		return _proxify(url);
	}	
	function _buildUPnPGetFileUrl( file )
	{
		var url = _getUrlHead().replace("data_request","luvd/")+file;
		return _proxify(url);
	}
	
	function _buildUPnPDeletePlugin( pluginid  )
	{
		var url = _getUrlHead()+'?id=action&serviceId=urn:micasaverde-com:serviceId:HomeAutomationGateway1&action=DeletePlugin&PluginNum={0}'.format(pluginid);
		return _proxify(url);
	}

	function _buildUPnPUpdatePluginVersion( pluginid ,version )
	{
		var url = _getUrlHead()+'?id=action&serviceId=urn:micasaverde-com:serviceId:HomeAutomationGateway1&action=CreatePlugin&PluginNum={0}&Version={1}'.format(pluginid ,version);
		return _proxify(url);
	}		
	function _buildUPnPUpdatePlugin( pluginid , plugin )
	{
		var url = _getUrlHead()+'?id=update_plugin&Plugin='+pluginid;
		if (plugin!=undefined) {
			url += ("&metadata="+ encodeURIComponent( JSON.stringify(plugin)) );
		}
		return _proxify(url);
	}		
	function _buildUPnPActionUrl(deviceID,service,action,params)
	{
		var url = _getUrlHead()+'?id=action&output_format=json&DeviceNum='+deviceID+'&serviceId='+service+'&action='+action;//'&newTargetValue=1';
		if (params != undefined) {
			$.each(params, function(index,value) {
				url = url+"&"+index+"="+encodeURIComponent(value);
			});
		};
		return _proxify(url);
	};
	//http://192.168.1.5/port_3480/data_request?id=lu_action&serviceId=urn:micasaverde-com:serviceId:HomeAutomationGateway1&action=RunLua&DeviceNum=81&Code=getMapUrl(81)
	// function _buildUPnPRunLua(code) {
		// var url = _getUrlHead()+'?id=lu_action&serviceId=urn:micasaverde-com:serviceId:HomeAutomationGateway1&action=RunLua&Code='+encodeURIComponent(code);
		// return _proxify(url);	
	// };
	
	function _buildHAGSoapUrl()
	{
		var url ='';
		if (_cfg.isOpenLuup==true)
			url = _getUrlHead().replace('/data_request','/upnp/control/hag');
		else
			// url = _getUrlHead().replace('/port_3480/data_request','/port_3480/upnp/control/hag');
			url = _getUrlHead().replace('/port_3480/data_request','/port_49451/upnp/control/hag');
		return url;
	}
	
	function _exec(url,cbfunc,mimetype) {
		var options = {
			url: url,
			type: "GET",
			crossDomain:true
		};
		if (mimetype != undefined) {
			// options.dataType = "xml text";		NOTHING works in FF
			options.beforeSend = function(xhr) { xhr.overrideMimeType(mimetype); };
		}
		else {
			options.dataType = "text";
			options.beforeSend = function(xhr) { xhr.overrideMimeType("text/plain"); }
		}
		var jqxhr = $.ajax( options )
			.done(function(data, textStatus, jqXHR) {
				_unproxifyResult.apply(this,[data,textStatus, jqXHR, function(data,textStatus,jqXHR) {
					if ($.isFunction( cbfunc )) {
						cbfunc(data, textStatus, jqXHR);
					}
				}])
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				if ($.isFunction( cbfunc )) {
					cbfunc(null,textStatus, jqXHR);
				}
				else
					PageMessage.message( formatAjaxErrorMessage(jqXHR, textStatus), "warning" ) ;				
			});
		return jqxhr;
	};

	function _UPnPSetAttr( deviceID, attribute, value, cbfunc)
	{
		// _exec( _buildAttributeSetUrl( deviceID, attribute, value) );
		var target = {};
		target.devices={};
		target.devices["devices_"+deviceID]={};
		target.devices["devices_"+deviceID][attribute]=value;
		// var target = {
			// "devices":{
				// "devices_5": {
					// "states": {},
					// "model": "test"
				// }
			// }
		// };
		return _ModifyUserData( target, cbfunc );
	};
	
	function _UPnPSetAttrUI7( deviceID, attribute, value, cbfunc)
	{
		return _exec( _buildAttributeSetUrl( deviceID, attribute, value) , cbfunc);
	};
	
	function _UPnPSet( deviceID, service, varName, varValue )
	{
		if ((_cfg.candoPost==true) && (_cfg.isOpenLuup==false) ) {
		// if (( _veraidx==0) && (_cfg.isOpenLuup!=true) && ( versioninfo.length>=4 ) && (versioninfo[1] >=1 ) && (versioninfo[2] >=7 ) && (versioninfo[3] >= 2138 )) {
				//  use POST instead of GET if possible
				var url = _getUrlHead()+'?'
                var data = {
                    id: "variableset",
                    DeviceNum: deviceID,
                    Variable: varName,
                    Value: varValue.toString(),
                    serviceId: service,
                    dummy: 'x'	// bug in VERA which destroys the last argument
                };
				return $.ajax({
						type: "POST",
						url: url,
						data: data
				})
				.done(function(data, textStatus, jqXHR) {
					// alert('saved');
				})
				.fail(function(jqXHR, textStatus, errorThrown) {
					// alert("Error Saving:" + Variable + " Error:" + errorThrown);
				})
		}
		return _exec( _buildVariableSetUrl( deviceID, service, varName, varValue) );
	};

	function _UPnPAction( deviceID, service, action, params, cbfunc )
	{
		return _exec( _buildUPnPActionUrl(deviceID,service,action,params) , cbfunc);
	};
	function _UPnPGetJobStatus( jobID , cbfunc )
	{
		return _exec( _buildUPnPGetJobStatusUrl(jobID) , cbfunc);
	};
	function _UPnPGetFile( devicefile, cbfunc )
	{
		var mimetype = "text/plain" ;
		var lastfour = devicefile.slice(-4);
		if ( (lastfour==".xml") && (_veraidx==0) )
			mimetype = "text/xml";
		
		return _exec( _buildUPnPGetFileUrl( devicefile), function(data, textStatus, jqXHR) {
			if (jqXHR.responseXML) {
				data = new XMLSerializer().serializeToString(jqXHR.responseXML);
				jqXHR.responseText=data;
			}
			(cbfunc)(data,jqXHR);
		}, mimetype);	
	};
	
	function _UPnPDeletePlugin( pluginid, cbfunc )
	{
		AltuiDebug.debug("_UPnPDeletePlugin( {0} )".format( pluginid));
		return _exec( _buildUPnPDeletePlugin( pluginid ), cbfunc );
	};

	function _UPnPUpdatePluginVersion( pluginid, version, cbfunc )
	{
		return _exec( _buildUPnPUpdatePluginVersion( pluginid,version), cbfunc );
	};
	
	function _UPnPUpdatePlugin2( plugin, cbfunc) 
	{
		return _exec( _buildUPnPUpdatePlugin( plugin.id, plugin ), cbfunc );
	};
	
	function _UPnPUpdatePlugin( pluginid, cbfunc )
	{
		return _exec( _buildUPnPUpdatePlugin( pluginid), cbfunc );
	};

	// function _UPnPRunLua( code, cbfunc )
	// {
		// return _exec( _buildUPnPRunLua( code), cbfunc );
	// };

	function _reloadEngine(cbfunc)
	{
		// Resets the Luup engine with any new configuration settings.
		// Example: http://ip_address:3480/data_request?id=reload
		var url = _getUrlHead()+'?id=reload';
		return _exec( _proxify(url) , cbfunc);
	};
	
	function _renameDevice( device, newname, roomid )
	{
		var oldname = device.name;
		device.name = newname;
		device.dirty = true;
		var url = _getUrlHead()+"?id=device&action=rename&device="+device.id+"&name="+encodeURIComponent(newname);
		if (roomid !=undefined)
			url = url+"&room="+roomid;
		return _exec( _proxify(url), function(result) {	
			if (result!="OK") 
				PageMessage.message( _T("Device modify failed!"), "warning" );
			else
				PageMessage.message( _T("Device modified!"), "success" );
		} );
	};
	
	function _createDevice( descr, dfile, ifile, roomnum, cbfunc )
	{
		AltuiDebug.debug("_createDevice( {0},{1},{2},{3} )".format( descr, dfile, ifile,roomnum));
		if (0) {
			var xml = "";
			xml +="<s:Envelope xmlns:s='http://schemas.xmlsoap.org/soap/envelope/' s:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'>";
			xml +="   <s:Body>";
				xml +="<u:CreateDevice xmlns:u='urn:schemas-micasaverde-org:service:HomeAutomationGateway:1'>";
					xml +="<deviceType></deviceType>";
					xml +="<internalID></internalID>";
					xml +="<Description>{0}</Description>";
					xml +="<UpnpDevFilename>{1}</UpnpDevFilename>";
					xml +="<UpnpImplFilename>{2}</UpnpImplFilename>";
					xml +="<IpAddress></IpAddress>";
					xml +="<MacAddress></MacAddress>";
					xml +="<DeviceNumParent>0</DeviceNumParent>";
					xml +="<RoomNum>{3}</RoomNum>";
				xml +="</u:CreateDevice>";
			xml +="   </s:Body>";
			xml +="</s:Envelope>";

			var url = _buildHAGSoapUrl();
			return $.ajax({
				url: url,
				type: "POST",
				dataType: "text",
				contentType: "text/xml;charset=UTF-8",
				processData: false,
				data:  xml.format( descr,dfile, ifile, roomnum  ),
				headers: {
					"SOAPACTION":'"urn:schemas-micasaverde-org:service:HomeAutomationGateway:1#CreateDevice"'
				},
			})
			.done(function(data, textStatus, jqXHR) {
				_unproxifyResult.apply(this,[data, textStatus, jqXHR, function(data,textStatus,jqXHR) {
					if ($.isFunction( cbfunc ))
					{
						var re = /<DeviceNum>(\d+)<\/DeviceNum>/; 
						var result = data.match(re);
						cbfunc( ( result != null) && (result.length>=2) ? result[1] : null );		// device ID in call back
					}
				}]);
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				if ($.isFunction( cbfunc ))
					cbfunc(null);
			});			
		}
		else {
			//descr, dfile, ifile, roomnum
			var params={};
			params["Description"]=descr;
			params["UpnpDevFilename"]=dfile;
			params["UpnpImplFilename"]=ifile;
			params["RoomNum"]=roomnum;
			params["Reload"]=1;
			return this.UPnPAction( 0, "urn:micasaverde-com:serviceId:HomeAutomationGateway1", "CreateDevice", params, function(data, textStatus, jqXHR){
				if (data!=null) {
					PageMessage.message(_T("Create Device succeeded"),"success");
					if ($.isFunction( cbfunc ))
					{
						// typical result { "u:CreateDeviceResponse": { "DeviceNum": "224" } }
						var obj = JSON.parse(data);
						cbfunc( obj["u:CreateDeviceResponse"]["DeviceNum"] );		// device ID in call back
					}
				}
				else {
					PageMessage.message(_T("Create Device failed"), "danger");
					if ($.isFunction( cbfunc ))
						cbfunc(null);
				}
			});
		}
	}
	
// http://192.168.1.5/port_49451/upnp/control/hag
// POST /port_49451/upnp/control/hag HTTP/1.1
// Host: 192.168.1.16
// Connection: keep-alive
// Content-Length: 17389
// Origin: http://192.168.1.16
// User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.93 Safari/537.36
// Content-Type: text/xml;charset=UTF-8
// Accept: */*
// X-Requested-With: XMLHttpRequest
// SOAPACTION: "urn:schemas-micasaverde-org:service:HomeAutomationGateway:1#ModifyUserData"
// MIME-Version: 1.0
// Referer: http://192.168.1.16/cmh/
// Accept-Encoding: gzip, deflate
// Accept-Language: fr,fr-FR;q=0.8,en;q=0.6,en-US;q=0.4
// <?xml version="1.0" encoding="UTF-8"?>
// <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
   // <s:Body>
      // <u:ModifyUserData xmlns:u="urn:schemas-micasaverde-org:service:HomeAutomationGateway:1">
         // <inUserData>
		 // {"devices":{},"scenes":{},"sections":{},"rooms":{},"StartupCode":"","InstalledPlugins":[],"PluginSettings":[{"plugin_id":1408,"AutoUpdate":1}],"users":{}}
		 // </inUserData>
         // <DataFormat>json</DataFormat>
      // </u:ModifyUserData>
   // </s:Body>
// </s:Envelope>	
	function _ModifyUserData( user_data, cbfunc )
	{
		var target = {
			"devices":{},
			"scenes":{},
			"sections":{},
			"rooms":{},
			"installedPlugins2":{},
			"InstalledPlugins":[],
			"PluginSettings":[],
			"users":{}
		};
		
		$.extend( target, user_data );
		var xml = "";
		xml +="<s:Envelope xmlns:s='http://schemas.xmlsoap.org/soap/envelope/' s:encodingStyle='http://schemas.xmlsoap.org/soap/encoding/'>";
		xml +="   <s:Body>";
		xml +="      <u:ModifyUserData xmlns:u='urn:schemas-micasaverde-org:service:HomeAutomationGateway:1'>";
		xml +="         <inUserData>";
		xml +=				JSON.stringify(target).escapeXml();
		xml +="		 	</inUserData>";
		xml +="         <DataFormat>json</DataFormat>";
		xml +="      </u:ModifyUserData>";
		xml +="   </s:Body>";
		xml +="</s:Envelope>";

		var url = _buildHAGSoapUrl();
		if (_ipaddr=='') {
			// local mode
			if (0) {
				//old firmware mode based on SOAP message / XML
				return $.ajax({
					url: url,
					type: "POST",
					dataType: "text",
					contentType: "text/xml;charset=UTF-8",
					processData: false,
					data:  xml,
					headers: {
						"SOAPACTION":'"urn:schemas-micasaverde-org:service:HomeAutomationGateway:1#ModifyUserData"'
					},
				})
				.done(function(data, textStatus, jqXHR) {
					_unproxifyResult.apply(this,[data, textStatus, jqXHR, function(data,textStatus,jqXHR) {
						if ($.isFunction( cbfunc ))
							cbfunc(data, jqXHR);
					}]);
				})
				.fail(function(jqXHR, textStatus, errorThrown) {
					if ($.isFunction( cbfunc ))
						cbfunc(null, jqXHR);
				});
			} else {
				// JSON like recent UI7 are doing
				// override url to use ModifyUserData action
				url = _getUrlHead()
				return $.ajax({
					url: url,
					type: "POST",
					contentType: "application/x-www-form-urlencoded; charset=UTF-8",
					data:  {
						id:'lu_action',
						serviceId:'urn:micasaverde-com:serviceId:HomeAutomationGateway1',
						action:'ModifyUserData',
						DataFormat:'json',
						inUserData: JSON.stringify(target)
					}
				})
				.done(function(data, textStatus, jqXHR) {
					_unproxifyResult.apply(this,[data, textStatus, jqXHR, function(data,textStatus,jqXHR) {
						if ($.isFunction( cbfunc ))
							cbfunc(data, jqXHR);
					}]);
				})
				.fail(function(jqXHR, textStatus, errorThrown) {
					if ($.isFunction( cbfunc ))
						cbfunc(null, jqXHR);
				});
			}
		} else {
			// proxy mode
			var url2 = _proxifySoap(url).format(
				"ModifyUserData",								// action
				encodeURIComponent(url),						// url
				encodeURIComponent(xml.format("%s")),			// envelop with a %s
				encodeURIComponent( JSON.stringify(target) )  	// body , just uri encoded for now,  Lua will xml encode
				);
				
			return $.ajax({
				url: url2,
				type: "GET",
				dataType: "text",
				contentType: "text/xml;charset=UTF-8",
				processData: false,
			})
			.done(function(data, textStatus, jqXHR) {
				_unproxifyResult.apply(this,[data, textStatus, jqXHR, function(data,textStatus,jqXHR) {
					if ($.isFunction( cbfunc ))
						cbfunc(data, jqXHR);
				}]);
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				if ($.isFunction( cbfunc ))
					cbfunc(null,jqXHR);
			});
		}
	};
	
	function _sceneAction( sceneobj, cbfunc ) {
		// prevent VERA from storing this
		var newscene = $.extend(true,{},sceneobj);

		// remove things added by ALTUI to avoid messing up VERA
		delete newscene['altuiid'];
		delete newscene['active'];
		
		// check the length of the scene to choose between GET or POST method
		var json = JSON.stringify(newscene)
		if (json.length >= 3000) {
			// Local mode
			var id = newscene.id;	
			if (id == ALTUI_NEW_SCENE_ID) {
				id = 1000000;
				newscene.id = id;
			}
			var target = {
				"devices":{},
				"scenes":{},
				"sections":{},
				"rooms":{},
				"InstalledPlugins":[],
				"PluginSettings":[],
				"users":{}
			};
			target.scenes["scenes_"+id]=newscene;
			// console.log( JSON.stringify(target));
			_ModifyUserData( target, function(result,jqXHR) {
				if ($.isFunction(cbfunc))
					(cbfunc)(result,jqXHR);
			});		
		} else {
			if (newscene.id==ALTUI_NEW_SCENE_ID)
				delete newscene.id;
			var jq = _exec( _buildSceneCreateUrl(JSON.stringify(newscene)), function(data, textStatus, jqXHR) {
				if ($.isFunction(cbfunc))
					(cbfunc)(data,jqXHR);
			});
			return jq;
		}
	};

	//exemple of debug use : MultiBox.modifyDevice( MultiBox.getDeviceByAltuiID("0-148") )  	
	function _modifyDevice( device, cbfunc)
	{
		var target = {};
		target.devices={};
		target.devices["devices_"+device.id]={
			states:[]
		};

		// build state map with unique ID for states
		var states_arr = target.devices["devices_"+device.id].states;	
		var n=0;
		$.each(device.states, function(idx,state) {
			if ( state.value.toString()!="") {
				state.id = n++;
				states_arr.push(state)
			}
		});

		return _ModifyUserData( target, function(result) {
			if (result==null) {
				PageMessage.message( "Modify Device action failed!", "warning" );				
			}
			else {
				PageMessage.message( "Modify Device succeeded! a LUUP reload will happen now, be patient", "success" );			
			}
			if ($.isFunction(cbfunc))
				(cbfunc)(result);
		});		
	};

	function _modifyPlugin( plugin, changes, cbfunc)
	{
		// update plugin settings
		var myplugin = cloneObject(plugin);
		// var pluginSettings = myplugin.AltuiSettings ? $.extend( myplugin.AltuiSettings, changes ) : null;

		// remove unwanted fields
		delete myplugin.altuiid;
		delete myplugin.AltuiSettings;

		var target = {};
		target.devices={};
		target.scenes={};
		target.sections={};
		target.InstalledPlugins2={};
		target.InstalledPlugins2["InstalledPlugins2_"+plugin.id]= $.extend( true, { Files:[], Devices:[] }, myplugin, changes );
			
		return _ModifyUserData( target, function(result) {
			if (result==null) {
				PageMessage.message( "Modify Plugin action failed!", "warning" );				
			}
			else {
				PageMessage.message( "Modify Plugin succeeded! a LUUP reload will happen now, be patient", "success" );			
			}
			if ($.isFunction(cbfunc))
				(cbfunc)(result);
		});		
	};
	
	return {
		//---------------------------------------------------------
		// Public  functions
		//---------------------------------------------------------
		setConfig	: function(cfg) 		{ 
			_cfg = $.extend( _cfg,cfg ) ;
		},
		getConfig	: function() { return _cfg },
		getIpAddr			: function () 		{ return _ipaddr; },
		reloadEngine	: _reloadEngine,
		getUrlHead		: _getUrlHead,
		proxify				: _proxify,			// ( url )
		unproxifyResult	: _unproxifyResult,	// data, textStatus, jqXHR, function(data,textStatus,jqXHR)
		buildUPnPGetFileUrl : _buildUPnPGetFileUrl,
		UPnPSetAttrUI7  : _UPnPSetAttrUI7,	//( deviceID, attribute, value, cbfunc)
		UPnPSetAttr		: _UPnPSetAttr,		// ( deviceID, attribute, value, cbfunc)
		UPnPSet				: _UPnPSet,			// ( deviceID, service, varName, varValue )
		UPnPAction		: _UPnPAction,		// ( deviceID, service, action, params, cbfunc )
		UPnPGetFile		: _UPnPGetFile,
		UPnPUpdatePluginVersion : _UPnPUpdatePluginVersion,
		UPnPUpdatePlugin: _UPnPUpdatePlugin,
		UPnPUpdatePlugin2: _UPnPUpdatePlugin2,
		UPnPDeletePlugin: _UPnPDeletePlugin,
		// UPnPRunLua 		: _UPnPRunLua,
		UPnPGetJobStatus: _UPnPGetJobStatus,
		ModifyUserData	: _ModifyUserData,
		renameDevice 	: _renameDevice,		// ( device, newname, roomid )
		createDevice	: _createDevice,
		modifyDevice	: _modifyDevice,		// (device) , to updates states, potentially can delete a state
		modifyPlugin	: _modifyPlugin,		// (plugin, changes, cb )
		sceneAction 	: _sceneAction,			// (scene,cbfunc) 
	};
});	// not invoked, the object does not exist
