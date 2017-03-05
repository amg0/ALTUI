//# sourceURL=J_ALTUI_plugins.js
"use strict";

// This program is free software: you can redistribute it and/or modify
// it under the condition that it is for private or home useage and 
// this whole comment is reproduced in the source code file.
// Commercial utilisation is not authorized without the appropriate
// written agreement from amg0 / alexis . mermet @ gmail . com
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 


// job_None=-1, // no icon
// job_WaitingToStart=0, // gray icon
// job_InProgress=1, // blue icon
// job_Error=2, // red icon
// job_Aborted=3, // red icon
// job_Done=4, // green icon
// job_WaitingForCallback=5 // blue icon - Special case used in certain derived classes

var ALTUI_PluginDisplays= ( function( window, undefined ) {  

	// return styles needed by this plugin module
	function _getStyle() {
		var style="";
		style += ".altui-watts, .altui-volts, .altui-countdown  {font-size: 16px;}";
		style += ".altui-watts-unit {font-size: 12px;}";
		style += ".altui-temperature  {font-size: 16px;}";
		style += ".altui-temperature-heater  {font-size: 12px;}";
		style += ".altui-temperature-minor  {font-size: 8px;}";
		style += ".altui-humidity, .altui-light  {font-size: 18px;}";
		style += ".altui-motion {font-size: 22px;}";
		style += ".altui-keypad-status {font-size: 14px;}";
		style += ".altui-weather-text, .altui-lasttrip-text, .altui-vswitch-text {font-size: 11px;}";
		style += ".altui-red , .btn.altui-red { color:red;}";
		style += ".altui-blue, .btn.altui-blue { color:blue;}";
		style += ".altui-orange { color:darkorange;}";
		style += ".altui-magenta { color:magenta;}";
		style += ".altui-multiswitch-container { position:absolute; left:58px; right:16px; } .altui-multiswitch-container .row { padding-top:1px; padding-bottom:1px; margin-left:0px; margin-right:0px;} .altui-multiswitch-container .col-xs-3 { padding-left:1px; padding-right:1px; }  .altui-multiswitch-open { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-left:0px; padding-right:0px; margin-left:0px; margin-right:0px; width: 100%; max-width: 100% }";
		style += ".altui-heater-container { position:absolute; left:71px; right:16px; } .altui-heater-container .row { padding-top:1px; padding-bottom:1px; margin-left:0px; margin-right:0px;} .altui-heater-container .col-xs-3 { padding-left:1px; padding-right:1px; text-align:center;}  .altui-heater-btn { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-left:0px; padding-right:0px; margin-left:0px; margin-right:0px; width: 100%; max-width: 100% }";
		style += ".altui-heater-container select.input-sm { height:22px; padding:0;}"; 
		style += ".altui-weather1-day1 { position:absolute; bottom:0px; right:0px; transform: scale(0.5,0.5); }";
		style += ".altui-cyan { color:cyan;}";
		style += ".altui-countdown-btngrp,.altui-countdown-btngrp-mute  { margin-top:13px;}";
		style += ".altui-countdown-btngrp-fav-mute { position:absolute; bottom:0px; right:0px; }";
		style += ".altui-dimmable  {font-size: 14px; padding-left:16px;}";
		style += ".altui-dimmable-qubino-btngrp  { display:inline; left:5px;}";
		style += ".altui-dimmable-qubino-btn  { padding: 3px 0px 0px 0px; height:25px;}";
		style += ".altui-dimmable-qubino-btn-img  { width:100%; height:100% }";
		style += ".altui-dimmable-slider { margin-left: 60px; margin-right: 70px; margin-top:5px;}";	
		style += ".altui-colorpicker { margin-top: 2px; width:30px; margin-right: 15px; }";	
		style += ".altui-infoviewer-log-btn,.altui-infoviewer-btn,.altui-window-btn,.altui-datamine-open { margin-top: 10px; }";	
		style += ".altui-infoviewer-pattern { font-size: 14px; }";	
		style += "div.altui-windowcover button.btn-sm { width: 4em; }";
		style += ".altui-sonos-text, .altui-combsw-text, .altui-sysmon-text, .altui-veraalerts-text {font-size: 11px;}";
		style += ".altui-multistring-text-div { margin-top: 2px; height: 48px; overflow: hidden; }"
        style += ".altui-multistring-text-some { font-size: 11px; }";
        style += ".altui-multistring-text-all { font-size: 7px; }";
		style += ".altui-multistring-text-1, .altui-multistring-text-2 { }";
// Rene Boer start		
		style += ".altui-harmony-controlpanel { left:70px; right:16px; } .altui-harmony-container { position:absolute; left:70px; right:16px; } .altui-harmony-container .row { padding-top:1px; padding-bottom:1px; margin-left:0px; margin-right:0px;} .altui-harmony-col { padding-left:3px; padding-right:3px; }  .altui-harmony-open { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-left:0px; padding-right:0px; margin-left:0px; margin-right:0px; width: 100%; max-width: 100% }";
// Rene Boer end
		style += ".altui-upnpproxy-text { font-size: 11px; margin-left: 2px; margin-top: 22px; }";
		style += ".altui-plts-btn-div { margin-top: 4px; height: 48px; overflow:hidden; } .altui-plts-btn { width: 50px; font-size: 11px; line-height: 1.5; } .altui-plts-btn-on { color: white; background-color: #006C44; } .altui-plts-btn-on:hover, .altui-plts-btn-on:focus, .altui-plts-btn-on:active, .altui-plts-btn-on:active:focus, .altui-plts-btn-on.active:focus { color: white; background-color: #006C44; outline: 0 none; box-shadow: none; } .altui-plts-time-text-div { float: left; margin-left: 6px; margin-top: 5px; font-size: 9px; overflow: hidden; }";
		return style;
	};

	function _isBusyStatus(device)
	{
		return ( (device.status!=undefined) && (device.status!=-1) && (device.status!=4) && (device.status!=2) );
	};
	
	// onoff : 0, 1 or -1 for spinner
	// csvlabel = "OFF,ON"
	function _createOnOffButton( onoff , id , csvlabel, extracls)
	{
		var str=csvlabel.split(',');		
		if (true/*UIManager.UI7Check()*/ /*&& (window.location.origin.indexOf("mios.com")==-1)*/)
		{
			var onoffbuttonTemplate = "";
			onoffbuttonTemplate += "<div class='altui-button-onoff "+(extracls || '')+"'>";
				onoffbuttonTemplate += "<div id='{2}' class='onoffswitch'>";
				onoffbuttonTemplate += "    <input type='checkbox' name='onoffswitch' class='onoffswitch-checkbox'  {0}>";
				onoffbuttonTemplate += "    <label class='onoffswitch-label' for='myonoffswitch'>";
				onoffbuttonTemplate += "        <span class='onoffswitch-inner'></span>";
				onoffbuttonTemplate += "        <span class='onoffswitch-switch'></span>";
				onoffbuttonTemplate += "    </label>";
				onoffbuttonTemplate += "</div>";
				onoffbuttonTemplate += "<div class='altui-button-stateLabel'>{1}</div>";
			onoffbuttonTemplate += "</div>";
			
			// onoffbuttonTemplate += "<div class='altui-button-onoff "+(extracls || '')+"'>";
			// onoffbuttonTemplate += "<div id='{2}' class='" + (extracls || '') +" on-off-device {0}' ></div>";
			// onoffbuttonTemplate += "<div class='altui-button-stateLabel'>{1}</div>";
			// onoffbuttonTemplate += "</div>";
			var css="";
			onoff = onoff || 0;
			if (onoff>0)
				onoff=1;
			switch (onoff) {
				case null:
				case false:
				case "0":
				case 0:
					str=str[0];
					css="";
					break;
				case true:
				case "1":
				case 1:
					str=str[1];
					css="checked";
					break;
				default:
					str="";
					css="spinner";
			}
			return onoffbuttonTemplate.format(css,str,id);
		}
		else {
			var onoffbuttonTemplate = "<div id='"+id+"' class='" + (extracls || '') +" btn-group' data-toggle='buttons'>";
			$.each(str, function(idx,val) {
				onoffbuttonTemplate+=("<label class='btn btn-default btn-sm {0}'> <input type='radio' name='options' autocomplete='off'>{1}</label>").format((parseInt(onoff)==idx)?'active':'',val);
			});
			onoffbuttonTemplate+="</div>";
			return onoffbuttonTemplate;
		}
	}
	//---------------------------------------------------------
	// PRIVATE functions
	//---------------------------------------------------------
	function _toggleButton(altuiid, htmlselector, service, variable, cbfunc) {
		//'#altui-onoffbtn-'+devid
		var device = MultiBox.getDeviceByAltuiID(altuiid);
		var status = MultiBox.getStatus( device, service, variable );
		if ($.isNumeric(status))
		{
			status = parseInt( status );
			if (status>0)		// special case of dimmer
				status=1;
			// $(htmlselector).removeClass("on").addClass("spinner");
			// $(htmlselector).removeClass("on").removeClass("off").addClass("center-block").html(glyphTemplate.format( "refresh", _T("Refresh"), "text-warning glyphicon-spin big-glyph" ));
			$(htmlselector).find("input").prop('checked', (status==0)); // invert
			cbfunc(device, 1-status);
		}
	}
	
	// return the html string inside the .panel-body of the .altui-device#id panel
	function _drawCamera( device ) {
		var video = (MyLocalStorage.getSettings('ShowVideoThumbnail') || 0)==1;
		var urlHead = MultiBox.getUrlHead(device.altuiid) 
		if ( MultiBox.isRemoteAccess() || (video==false) ) {
			var img = $("<img class='altui-camera-picture'></img>")
				.attr('src',urlHead+"?id=request_image&res=low&cam="+device.id+"&t="+ new Date().getTime())
				.height(50)
				.width(66);

			return img.wrap( "<div></div>" ).parent().html();
		} else {
			var streamurl = "url(http://{0}{1})".format(
				device.ip,	//ip
				MultiBox.getStatus( device, "urn:upnp-org:serviceId:altui1", "DirectStreamingURL2" ) || MultiBox.getStatus( device, "urn:micasaverde-com:serviceId:Camera1", "DirectStreamingURL" )	//DirectStreamingURL
			);
			var div = $("<div class='altui-camera-picture'></div>")
				.css({
					"background-image": streamurl,
					"background-size": "cover",
					"margin-left": 55,
					"margin-top": 1
					})
				// .css("background-size","contain")
				.height(50)
				.width(50);
			return div.wrap( "<div></div>" ).parent().html();
		}
	}
	function _refreshCameraTile(id,device) {
		var urlHead = MultiBox.getUrlHead(device.altuiid) 
		var elem = $("img#{0}".format(device.altuiid))
		if (elem.length>0) {
			$(elem)
				.attr('src',urlHead+"?id=request_image&res=low&cam="+device.id+"&t="+ new Date().getTime())
				.css('width','100%')
			HTMLUtils.startTimer('altui-camera-tile-timer-'+device.altuiid,3000,_refreshCameraTile,device)
		}
	};
	function _drawCameraTile(device) {
		var html="";
		var video = (MyLocalStorage.getSettings('ShowVideoThumbnail') || 0)==1;
		var urlHead = MultiBox.getUrlHead(device.altuiid) 
		var devicedom = $(".altui-favorites-device-content[data-altuiid='{0}']".format(device.altuiid)).closest(".altui-favorites-device")
		if (devicedom.length>0) {
			devicedom.addClass("altui-norefresh");
			if ( MultiBox.isRemoteAccess() || (video==false) ) {
				var img = $("<img id='{0}' class='altui-camera-picture'></img>".format(device.altuiid))
					.attr('src',urlHead+"?id=request_image&res=low&cam="+device.id+"&t="+ new Date().getTime())
					.css('width','100%')
				html =  img.wrap( "<div></div>" ).parent().html();
				HTMLUtils.startTimer('altui-camera-tile-timer-'+device.altuiid,3000,_refreshCameraTile,device)
			} else {
				var streamurl = "url(http://{0}{1})".format(
					device.ip,	//ip
					MultiBox.getStatus( device, "urn:upnp-org:serviceId:altui1", "DirectStreamingURL2" ) || MultiBox.getStatus( device, "urn:micasaverde-com:serviceId:Camera1", "DirectStreamingURL" )	//DirectStreamingURL
				);
				var div = $("<div class='altui-camera-picture'></div>")
					.css({
						"background-image": streamurl,
						"background-size": "contain",
						"background-repeat": "no-repeat",
						position: 'absolute',
						top: '20px',
						bottom: '0px',
						left: '0px',
						right: '0px'
						})
					// .css("background-size","contain")
				html= div.wrap( "<div></div>" ).parent().html();
				html += "<script type='text/javascript'>";
				html += " $('.altui-favorites-device#d{0}').addClass('altui-norefresh')".format(device.altuiid);
				html += "</script>";
			}
		}
		return html;
	}
	
	function _drawVswitch( device ) {
		var html ="";
		var status = parseInt(MultiBox.getStatus( device, 'urn:upnp-org:serviceId:VSwitch1', 'Status' )); 
		html += ALTUI_PluginDisplays.createOnOffButton( status,"altui-vswitch-"+device.altuiid, _T("OFF,ON") , "pull-right");
		$.each( ['Text1','Text2'],function(i,v) {
			var dl1 = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:VSwitch1', v ); 
			if (dl1 != null) 
				html += $("<div class='altui-vswitch-text'></div>").text(dl1).wrap( "<div></div>" ).parent().html()
		});
		// on off 
		html += "<script type='text/javascript'>";
		html += "$('div#altui-vswitch-{0}').on('click', function() { ALTUI_PluginDisplays.toggleVswitch('{0}','div#altui-vswitch-{0}'); } );".format(device.altuiid);
		html += "</script>";
		return html;
	}
	
	// return the html string inside the .panel-body of the .altui-device#id panel
	function _drawTempSensor( device) {
		var html = "";
		var ws = MultiBox.getWeatherSettings();
		if (ws.tempFormat==undefined)
			ws.tempFormat="";
		
		var status = parseFloat(MultiBox.getStatus( device, 'urn:upnp-org:serviceId:TemperatureSensor1', 'CurrentTemperature' )); 
		html += ("<span class='altui-temperature' >"+status+"&deg;"+ws.tempFormat+"</span>");
		return html;
	}
		
	function _internaldrawZoneThermostat( device , userOperatingMode1Items,  userHVACFanOperatingMode1Items, isHeater) {
		function _button(altuiid, colorclass, glyph, service, action, name, value, incr) {
			return ("<button type='button' style='width:50%;' class='altui-heater-btn altui-setpointcontrol-{0} {7} btn btn-default btn-xs' data-service='{2}' data-action='{3}' data-name='{4}' data-value='{5}' data-incr='{6}'>{1}</button>".format( 
			altuiid,		// id
			glyph,	// label
			service,
			action,
			name,
			value,
			incr,
			colorclass
			));
		};
		var HVAC_INCREMENT = 0.5;	
		var controller = MultiBox.controllerOf(device.altuiid).controller;
		var isUI5 = MultiBox.isUI5(controller);
		var ws = MultiBox.getWeatherSettings();
		if (ws.tempFormat==undefined)
			ws.tempFormat="";
		
		var modeStatus = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:HVAC_UserOperatingMode1', 'ModeStatus' ); 
		var modeFan = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:HVAC_FanOperatingMode1', 'Mode' ); 
		var curTemp = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:TemperatureSensor1', 'CurrentTemperature' ); 
		var allsetpoints = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:TemperatureSetpoint1', 'AllSetpoints' );
		var heatsetpoint_current = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:TemperatureSetpoint1_Heat', 'CurrentSetpoint' ); 
		var heatsetpoint_target = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:TemperatureSetpoint1_Heat', 'SetpointTarget' ); 
		var coldsetpoint_current = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:TemperatureSetpoint1_Cool', 'CurrentSetpoint' ); 
		var coldsetpoint_target = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:TemperatureSetpoint1_Cool', 'SetpointTarget' ); 
		//debug
		// curTemp = 19;
		// heatsetpoint_current = 22;
		// heatsetpoint_target = 24;
		// coldsetpoint_current = 17;
		// coldsetpoint_target = 15;
		// autosetpoint = 21;		
		// currentmodesetpoint=12;
		// modeFan = "PeriodicOn";
		// modeStatus = "HeatOn";
		// allsetpoints = "3,4,5";
		
		var autosetpoint=null, currentmodesetpoint=null, currentmodesetpoint_target=null;
		var bNewControl = (isUI5==false ) && (  isNullOrEmpty(allsetpoints)==false );
		if (bNewControl==true)
			bNewControl = (MyLocalStorage.getSettings('UseUI7Heater')==1);
		
		if (bNewControl ==true) {
			AltuiDebug.debug("Using new form of heater as AllSetpoints is not empty: {0} )".format( allsetpoints));
			var splits = allsetpoints.split(",");
			heatsetpoint_current = splits[0] || "";
			coldsetpoint_current = splits[1] || "";
			autosetpoint = splits[2] || "";
			currentmodesetpoint = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:TemperatureSetpoint1', 'CurrentSetpoint' ); 
			currentmodesetpoint_target = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:TemperatureSetpoint1', 'SetpointTarget' ); 
		}

		var html = "";
		html += "<div class='altui-heater-container pull-right'>";
			html += "<div class='row'>";
				html += "<div class='col-xs-3'>";
					html += ("<span class='altui-temperature' >"+((curTemp!=null) ? (parseFloat(curTemp).toFixed(1)+"&deg;"+ws.tempFormat) : "--") +"</span>");
				html += "</div>";
//Rene Boer start better drawing of thermostat for me. Else on large it spills below drawing box fo device
//				html += "<div class='col-xs-3'>";
				html += "<div class='col-xs-3 col-lg-4'>";
// Rene Boer end				
					var heatsetpoint = heatsetpoint_target || parseFloat($("#altui-heatsetpoint-"+device.altuiid).text()) || heatsetpoint_current;
					if (heatsetpoint!=null) {
						var v = heatsetpoint_current ? parseFloat(heatsetpoint_current).toFixed(1)+"&deg;"+ws.tempFormat : "";
						html += ("<span class='altui-temperature-minor altui-red pull-left' id='altui-heatsetpoint-current-"+device.altuiid+"'>"+v+"</span>");
						v = heatsetpoint_target ? parseFloat(heatsetpoint_target).toFixed(1)+"&deg;"+ws.tempFormat : "";
						html += ("<span class='altui-temperature-minor altui-red pull-right' id='altui-heatsetpoint-target-"+device.altuiid+"'>"+v+"</span>");
						html += ("<span class='altui-temperature-heater altui-red' id='altui-heatsetpoint-"+device.altuiid+"'>"+parseFloat(heatsetpoint).toFixed(1)+"&deg;"+ws.tempFormat+"</span>");
					}
				html += "</div>";
//Rene Boer start
//				html += "<div class='col-xs-3'>";
				html += "<div class='col-xs-3 col-lg-4'>";
// Rene Boer end				
					var coldsetpoint = coldsetpoint_target || parseFloat($("#altui-coldsetpoint-"+device.altuiid).text()) || coldsetpoint_current
					if ((isHeater==false) && (coldsetpoint!=null)) {
						v = coldsetpoint_current ? parseFloat(coldsetpoint_current).toFixed(1)+"&deg;"+ws.tempFormat : "";
						html += ("<span class='altui-temperature-minor altui-blue pull-left' id='altui-coldsetpoint-current-"+device.altuiid+"'>"+v+"</span>");
						v = coldsetpoint_target ? parseFloat(coldsetpoint_target).toFixed(1)+"&deg;"+ws.tempFormat : "";
						html += ("<span class='altui-temperature-minor altui-blue pull-right' id='altui-coldsetpoint-target-"+device.altuiid+"'>"+v+"</span>");
						html += ("<span class='altui-temperature-heater altui-blue' id='altui-coldsetpoint-"+device.altuiid+"'>"+parseFloat(coldsetpoint).toFixed(1)+"&deg;"+ws.tempFormat+"</span>");
					}
				html += "</div>";
				html += "<div class='col-xs-3'>";
					if (autosetpoint!=null) {
						html += ("<span class='altui-temperature-heater' id='altui-autosetpoint-"+device.altuiid+"'>"+parseFloat(autosetpoint).toFixed(1)+"&deg;"+ws.tempFormat+"</span>");
					}
				html += "</div>";
			html += "</div>";
			html += "<div class='row'>";
				html += "<div class='col-xs-3'>";
					if (userOperatingMode1Items.length>0) {
						html +="<select id='altui-heater-select-{0}' class='altui-heater-select form-control input-sm'>".format(device.altuiid);
						$.each(userOperatingMode1Items, function(idx,item) {
							html += "<option data-service='{1}' data-action='{2}' data-name='{3}' data-value='{4}' {5}>{0}</option>".format(
								item.label,item.service,item.action,item.name,item.value,
								item.value==modeStatus ? 'selected' : '');
						});
						html +="</select>";
					}
				html += "</div>";
				html += "<div class='col-xs-3'>"; 
					if (bNewControl == false) {
						//UI5
						html += _button(device.altuiid, "altui-red", upGlyph, 
									"urn:upnp-org:serviceId:TemperatureSetpoint1_Heat",
									"SetCurrentSetpoint",
									"NewCurrentSetpoint",
									"altui-heatsetpoint-"+device.altuiid,
									HVAC_INCREMENT	
								);
						html += _button(device.altuiid, "altui-red", downGlyph, 
									"urn:upnp-org:serviceId:TemperatureSetpoint1_Heat",
									"SetCurrentSetpoint",
									"NewCurrentSetpoint",
									"altui-heatsetpoint-"+device.altuiid,
									-HVAC_INCREMENT
								);	
					} else {
						//currentmodesetpoint
						//UI7
						html += _button(device.altuiid, "", upGlyph, 
									"urn:upnp-org:serviceId:TemperatureSetpoint1",
									"SetCurrentSetpoint",
									"NewCurrentSetpoint",
									"altui-autosetpoint-"+device.altuiid,
									HVAC_INCREMENT	
								);						
					}
				html += "</div>";
				html += "<div class='col-xs-3'>";
					if (bNewControl == false) {
						//UI5
						if (isHeater==false) {
							html += _button(device.altuiid, "altui-blue", upGlyph, 
										"urn:upnp-org:serviceId:TemperatureSetpoint1_Cool",
										"SetCurrentSetpoint",
										"NewCurrentSetpoint",
										"altui-coldsetpoint-"+device.altuiid,
										HVAC_INCREMENT
									);
							html += _button(device.altuiid, "altui-blue", downGlyph, 
										"urn:upnp-org:serviceId:TemperatureSetpoint1_Cool",
										"SetCurrentSetpoint",
										"NewCurrentSetpoint",
										"altui-coldsetpoint-"+device.altuiid,
										-HVAC_INCREMENT
									);	
						}
					}
					else {
						html += _button(device.altuiid, "", downGlyph, 
									"urn:upnp-org:serviceId:TemperatureSetpoint1",
									"SetCurrentSetpoint",
									"NewCurrentSetpoint",
									"altui-autosetpoint-"+device.altuiid,
									-HVAC_INCREMENT	
								);						
					}				
				html += "</div>";
				html += "<div class='col-xs-3'>";
					if (userHVACFanOperatingMode1Items.length>0) {
						html +="<select id='altui-heater-select-{0}' class='altui-heater-select form-control input-sm'>".format(device.altuiid);
						$.each(userHVACFanOperatingMode1Items, function(idx,item) {
							html += "<option data-service='{1}' data-action='{2}' data-name='{3}' data-value='{4}' {5}>{0}</option>".format(
								item.label,item.service,item.action,item.name,item.value,
								item.value==modeFan ? 'selected' : '');
						});
						html +="</select>";
					}
				html += "</div>";
			html += "</div>";
		html += "</div>";

		var cls = 'button.altui-setpointcontrol-{0}'.format(device.altuiid);

		$(".altui-mainpanel").off('click',cls)
			.on('click',cls,device.altuiid,function(event) {
				var selected = $(this);
				var service = $(selected).data('service');
				var action = $(selected).data('action');
				var name = $(selected).data('name');
				var value = parseFloat($('#'+$(selected).data('value')).text());
				var incr = $(selected).data('incr');
				$('#'+$(selected).data('value')).html( (value+incr).toFixed(1)+'&deg;');
				function doItNow(obj) {
					var params = {}; params[obj.name]=obj.value;
					MultiBox.runActionByAltuiID(obj.altuiid, obj.service, obj.action, params);			
					// console.log("timer doItNow() :" + JSON.stringify(obj));
					$(obj.button).data("timer",null);
				};
				var timer = $(this).data("timer");
				if (timer!=undefined) {
					clearTimeout(timer);
					// console.log("clear Timeout({0})".format(timer));
				}
				timer = setTimeout(doItNow,1500,{
						button: $(this),
						altuiid: event.data,
						name: name,
						service: service,
						action: action,
						value : value+incr
				});
				// console.log("set Timeout({0})  params:{1}".format(timer,value+incr));
				$(this).data("timer",timer);
			}	
		);
		html += "<script type='text/javascript'>";
		html += " $('select#altui-heater-select-{0}').on('change', function() { 	".format(device.altuiid);
		html += " 	var selected = $(this).find(':selected');					";
		html += "   var service = $(selected).data('service');					";
		html += "   var action = $(selected).data('action');					";
		html += "   var name = $(selected).data('name');					";
		html += "   var value = $(selected).data('value');					";
		html += "   var params = {}; params[name]=value;				";
		html += "	MultiBox.runActionByAltuiID('{0}', service, action, params);".format(device.altuiid);
		html += "});"
		html += "</script>";

		return html;
	}

	function _drawZoneThermostat( device ) {
		var userOperatingMode1Items = [
			{label:"Off", value:"Off" , service:"urn:upnp-org:serviceId:HVAC_UserOperatingMode1", action:"SetModeTarget", name:"NewModeTarget" },
			{label:"Auto", value:"AutoChangeOver" , service:"urn:upnp-org:serviceId:HVAC_UserOperatingMode1", action:"SetModeTarget", name:"NewModeTarget"},
			{label:"Cool", value:"CoolOn" , service:"urn:upnp-org:serviceId:HVAC_UserOperatingMode1", action:"SetModeTarget", name:"NewModeTarget"},
			{label:"Heat", value:"HeatOn", service:"urn:upnp-org:serviceId:HVAC_UserOperatingMode1", action:"SetModeTarget", name:"NewModeTarget"}
		];
		var userHVACFanOperatingMode1Items = [
			{label:"Auto", value:"Auto", service:"urn:upnp-org:serviceId:HVAC_FanOperatingMode1", action:"SetMode" , name:"NewMode"},
			{label:"On", value:"ContinuousOn", service:"urn:upnp-org:serviceId:HVAC_FanOperatingMode1", action:"SetMode", name:"NewMode"},
			{label:"Cycle", value:"PeriodicOn", service:"urn:upnp-org:serviceId:HVAC_FanOperatingMode1", action:"SetMode", name:"NewMode"}
		];
		return  _internaldrawZoneThermostat( device , userOperatingMode1Items,  userHVACFanOperatingMode1Items, false );
	};
	
	function _drawHeater( device) {
		var userOperatingMode1Items = [
			{label:"Off", value:"Off" , service:"urn:upnp-org:serviceId:HVAC_UserOperatingMode1", action:"SetModeTarget", name:"NewMode" },
			{label:"Heat", value:"HeatOn", service:"urn:upnp-org:serviceId:HVAC_UserOperatingMode1", action:"SetModeTarget", name:"NewMode"}
		];
		var userHVACFanOperatingMode1Items = [];
		return  _internaldrawZoneThermostat( device , userOperatingMode1Items,  userHVACFanOperatingMode1Items, true );
	};
		
	// return the html string inside the .panel-body of the .altui-device#id panel
	function _drawHumidity( device) {
		var html = "";
		var status = parseInt(MultiBox.getStatus( device, 'urn:micasaverde-com:serviceId:HumiditySensor1', 'CurrentLevel' )); 
		html += ("<span class='altui-humidity' >"+status+" % </span>");
		return html;
	};
	
	function _drawLight( device) {
		var html = "";
		var status = parseInt(MultiBox.getStatus( device, 'urn:micasaverde-com:serviceId:LightSensor1', 'CurrentLevel' )); 
		var unit = "lux";	//(status>100) ? "lux" : "% or lux";
		html += ("<span class='altui-light' >{0} {1}</span>".format(status,unit));
		return html;
	};

	function _onClickWindowCoverButton(e)
	{
		// http://192.168.1.16/port_3480/data_request?id=action&DeviceNum=26&serviceId=urn:upnp-org:serviceId:WindowCovering1&action=Up
		// http://192.168.1.16/port_3480/data_request?id=action&DeviceNum=26&serviceId=urn:upnp-org:serviceId:WindowCovering1&action=Down
		// http://192.168.1.16/port_3480/data_request?id=action&DeviceNum=26&serviceId=urn:upnp-org:serviceId:WindowCovering1&action=Stop
		var altuiid = e.closest(".altui-device").data("altuiid");
		var actionname = e.prop('id').substr("altui-window-".length);
		if (actionname=="Stop") 
			MultiBox.runActionByAltuiID( altuiid, "urn:upnp-org:serviceId:WindowCovering1", "Stop", {} );
		else
			MultiBox.runActionByAltuiID( altuiid, "urn:upnp-org:serviceId:Dimming1", "SetLoadLevelTarget", {newLoadlevelTarget: ((actionname=="Up") ? 100 : 0) } );
	};

	function _drawWindowCover( device) {
		var status = MultiBox.getStatus(device,"urn:upnp-org:serviceId:Dimming1","LoadLevelStatus");	// 0 - 100

		var html = "";
		html += "<div class='pull-right'><div id='altui-wc-"+device.altuiid+"' class='btn-group altui-windowcover' role='group' aria-label='...'>";
		html += ("  <button id ='altui-window-Up' type='button' class='altui-window-btn btn btn-default btn-sm {0}'>"+_T("Up")+"</button>").format( (status==100) ? 'active' : '' );
		html += ("  <button id ='altui-window-Stop' type='button' class='altui-window-btn btn btn-default btn-sm'>"+_T("Stop")+"</button>");
		html += ("  <button id ='altui-window-Down' type='button' class='altui-window-btn btn btn-default btn-sm {0}'>"+_T("Down")+"</button>").format( (status==0) ? 'active' : '' );
		html += "</div>";
		html += "</div>";
		
		html += "<script type='text/javascript'>";
		html += " $('div#altui-wc-{0} button').on('click', function() { ALTUI_PluginDisplays.onClickWindowCoverButton($(this)); } );".format(device.altuiid);
		html += "</script>";
		
		return html;
	};

	function _onSliderChange(event,ui) {
		var altuiid = $(ui.handle).closest(".altui-device").data("altuiid");
		MultiBox.runActionByAltuiID ( altuiid, "urn:upnp-org:serviceId:Dimming1", "SetLoadLevelTarget", {newLoadlevelTarget:ui.value} );
	};

	// return the html string inside the .panel-body of the .altui-device#id panel
	function _onColorPicker(e,altuiid,color) {
		var device = MultiBox.getDeviceByAltuiID(altuiid);
		MultiBox.setColor(device,color.toHexString());		
		var currentColor = '0=0,1=0,2={0},3={1},4={2}'.format(parseInt(color._r),parseInt(color._g),parseInt(color._b));	
		MultiBox.setStatus(device,'urn:micasaverde-com:serviceId:Color1','CurrentColor',currentColor); 		
	};
	
// cybermag contributions for Hue2
// helper functions
	function _clamp( x, min, max ) {
		if(x<min){ return min; }
		if(x>max){ return max; }
		return Math.floor(x);
	};

	function _colorTemperatureToHex(kelvin){
		var temp = kelvin / 100;
		var red, green, blue;
		if( temp <= 66 ){
			red = 255;
			green = temp;
			green = 99.4708025861 * Math.log(green) - 161.1195681661;
			if( temp <= 19){
				blue = 0;
			} else {
				blue = temp-10;
				blue = 138.5177312231 * Math.log(blue) - 305.0447927307;
			}
		} else {
			red = temp - 60;
			red = 329.698727446 * Math.pow(red, -0.1332047592);
			green = temp - 60;
			green = 288.1221695283 * Math.pow(green, -0.0755148492 );
			blue = 255;
		}
		return rgbToHex(_clamp(red,0,255),_clamp(green,0, 255),_clamp(blue,0,255));
	}
	function _drawDimmable( device, colorpicker ) {

		var html = "";
		// if (colorpicker!=true)
			// html += UIManager.defaultDeviceDrawWatts(device);
		// load level
		var level = parseInt(MultiBox.getStatus( device, 'urn:upnp-org:serviceId:Dimming1', 'LoadLevelTarget' )); 
		if (isNaN(level)==true) 
			level = parseInt(MultiBox.getStatus( device, 'urn:upnp-org:serviceId:Dimming1', 'LoadLevelStatus' )); 
		
		html += ("<span id='slider-val-"+device.altuiid+"' class='altui-dimmable' >"+level+"% </span>");


		// var onebody = $(".altui-device-body:first");

		// on off button
		var status = parseInt(MultiBox.getStatus( device, 'urn:upnp-org:serviceId:SwitchPower1', 'Status' )); 
		if (_isBusyStatus(device))  {  
			status = -1;
		}
		html += _createOnOffButton( status,"altui-onoffbtn-"+device.altuiid , _T("OFF,ON") , "pull-right");
		var current = "#ffffff";
		if (colorpicker)// color picker 
		{
			// Cybermag's contribution 
			// UI7 implementation no longer seems to use the "x=" part and also uses:
			// "w,c"  - w = warm white value, c = cool white value
			// "r,g,b" - r,g,b = RGB color values
			// "w,c,r,g,b"  - w = warm white value, c = cool white value
			// "ct" - ct = color temperature value in Kelvin (integer between 2000 and 9000)

			// try Target then Current
			current = MultiBox.getStatus(device,'urn:micasaverde-com:serviceId:Color1','TargetColor') || MultiBox.getStatus(device,'urn:micasaverde-com:serviceId:Color1','CurrentColor');
			if (current!=null) {
				var parts = current.split(","); // 0=0,1=0,2=0,3=0,4=255
				// normalize the values
				for (var i = 0; i < parts.length; i = i + 1) {
					var part = (parts[i].split("=").length!==2)?parseInt(parts[i]):(parts[i].split("=")[1]!=="")?parseInt(parts[i].split("=")[1]):undefined;
					parts[i] = part;
				}
				if (parts[2] && parts[3] && parts[4] && (((parts[0] === 0) && (parts[1] === 0)) || ((parts[0] === undefined) && (parts[1] === undefined)))) {
					// all five parameters are specified - color temperature values are both zero
					current = rgbToHex(parts[2],parts[3],parts[4]);
				} else if (parts[0] && parts[1] && parts[2] && !parts[3] && !parts[4]) {
					current = rgbToHex(parts[0],parts[1],parts[2]);
				} else if (parts[0] || parts[1]) {
					// color temperature
					var Kelvin = 0;
					if ((parts[0] > 0) && ((parts[1] === 0)||(!parts[1]))) {
						Kelvin = 2000 + ((parts[0]/255) * 3500);
						current = _colorTemperatureToHex(Kelvin);
					} else if ((parts[1] > 0) && ((parts[0] === 0)||!parts[0])) {
						Kelvin = 5500 + ((parts[1]/255) * 3500);
						current = _colorTemperatureToHex(Kelvin);
					} else {
						// both cool and warm set is an error
						current = "#FFFFFF";
					}
				} else if (parts[0]) {
					current = _colorTemperatureToHex(parts[0]);
				} else {
				  current="#ffffff";
				}
			} else {
			  current="#ffffff";
			}
			// console.log("Current: "+current);

			// html+=("<input id='altui-colorpicker-{0}' class='altui-colorpicker pull-right' type='color' value='{1}'></input>".format(device.altuiid,current));
			html+=("<div class='altui-colorpicker pull-right'><input id='altui-colorpicker-{0}' value='{1}'></input></div>".format(device.altuiid,current));
		}
		
		// dimming
		html+=("<div id='slider-{0}' class='altui-dimmable-slider' ></div>").format(device.altuiid);
				
		// on off 
		$('#altui-colorpicker-{0}'.format(device.altuiid,current)).spectrum('destroy');
		html += "<script type='text/javascript'>";
		html +="$('#altui-colorpicker-{0}').spectrum({		\
			color: '{1}',							\
			preferredFormat: 'hex',				 \
			replacerClassName: 'altui-colorpicker-replacer',		 \
			show: function(color) {	\
				$(this).closest('.altui-device').toggleClass('altui-norefresh'); 	\
			},	\
			hide: function(color) {	\
				$(this).closest('.altui-device').toggleClass('altui-norefresh'); 	\
			}	\
		});".format(device.altuiid,current);
		html += "$('div#altui-onoffbtn-{0}').on('click', function() { ALTUI_PluginDisplays.toggleOnOffButton('{0}','div#altui-onoffbtn-{0}'); } );".format(device.altuiid);
		html += "$('div#slider-{0}.altui-dimmable-slider').slider({ max:100,min:0,value:{1},change:ALTUI_PluginDisplays.onSliderChange });".format(device.altuiid,level);
		if (colorpicker) { // color picker 
			html += "$('div#slider-{0}.altui-dimmable-slider').css('margin-right','120px');".format(device.altuiid)
			html += "$('input#altui-colorpicker-{0}').on('change', function(e,color) {  ALTUI_PluginDisplays.onColorPicker(e,'{0}',color); });".format(device.altuiid);
		}
		html += "</script>";
		$(".altui-mainpanel").off("slide","#slider-"+device.altuiid).on("slide","#slider-"+device.altuiid,function( event, ui ){ 
			$("#slider-val-"+device.altuiid).text( ui.value+'%');
		});
		return html;
	};
	
	var QuibinoLevels = [
		{cmd:"stop",value:0},
		{cmd:"frost",value:11},
		{cmd:"eco",value:21},
		{cmd:"confort2",value:31},
		{cmd:"confort1",value:41},
		{cmd:"confort",value:51}
	];
	function _onclickQubinoBtn( e ) {
		
	};
	
	function _drawDimmableQubinoFlushPilotWire(device) {
		var controller = MultiBox.controllerOf(device.altuiid).controller;
		var iconpath = MultiBox.getIconPath(controller,"../../other/");
		var status = parseInt(MultiBox.getStatus(device,"urn:upnp-org:serviceId:Dimming1","LoadLevelStatus"));
		var currentLevel = Math.floor( Math.max((status-1),0) /10 )
		var model= {
			cls:"altui-dimmable-qubino-btngrp",
			buttons: []
		};
		$.each(QuibinoLevels , function(i,level) {
			var extracls = "altui-dimmable-qubino-btn";
			if (i == currentLevel)
				extracls += " btn-success"
			model.buttons.push( 				
				{cls:extracls, id:"qubflw_"+device.altuiid+"_"+level.cmd+"_"+level.value , img:iconpath+"qubino-"+level.cmd+"-icon.png", label:level.cmd, imgcls:'altui-dimmable-qubino-btn-img'}
			);
		});
		var html = HTMLUtils.drawButtonGroup(device.altuiid,model)
		$(".altui-mainpanel")
			.off('click','.altui-dimmable-qubino-btn')
			.on('click','.altui-dimmable-qubino-btn', function(e) {
				var ids = $(this).prop('id').split("_");
				MultiBox.runActionByAltuiID ( ids[1], "urn:upnp-org:serviceId:Dimming1", 'SetLoadLevelTarget', {newLoadlevelTarget:ids[3]} );
			});
		return html;
	};
	function _drawDimmableRGB(device) {
		var html = "";
		html += _drawDimmable(device,true);
		return html;
	};
	// return the html string inside the .panel-body of the .altui-device#id panel
	function _drawDoorLock( device) { 
		var status = MultiBox.getStatus( device, 'urn:micasaverde-com:serviceId:DoorLock1', 'Status' );
		var html ="";
		html += ALTUI_PluginDisplays.createOnOffButton( status,"altui-onoffbtn-"+device.altuiid, _T("Unlock,Lock") , "pull-right");
		
		var lasttrip = MultiBox.getStatus( device, 'urn:micasaverde-com:serviceId:SecuritySensor1', 'LastTrip' );
		if (lasttrip != null) {
			var lasttripdate = _toIso(new Date(lasttrip*1000),' ');
			html+= "<div class='altui-lasttrip-text text-muted'>{0} {1}</div>".format( timeGlyph,lasttripdate );
		}
		html += "<script type='text/javascript'>";
		html += " $('div#altui-onoffbtn-{0}').on('click', function() { ALTUI_PluginDisplays.toggleDoorLock('{0}','div#altui-onoffbtn-{0}'); } );".format(device.altuiid);
		html += "</script>";
		return html;
	};
	function _drawPLEG(device) {
		var status = MultiBox.getStatus( device, 'urn:rts-services-com:serviceId:ProgramLogicEG', 'Armed' );
		var html ="";
		html += ALTUI_PluginDisplays.createOnOffButton( status,"altui-onoffbtn-"+device.altuiid, _T("Bypass,Arm") , "pull-right");
		
		html += "<script type='text/javascript'>";
		html += " $('div#altui-onoffbtn-{0}').on('click', function() { ALTUI_PluginDisplays.togglePLEG('{0}','div#altui-onoffbtn-{0}'); } );".format(device.altuiid);
		html += "</script>";
		return html;
	};
	
	// return the html string inside the .panel-body of the .altui-device#id panel
	function _drawDoorSensor( device) {
		return _drawMotion( device);
	};

	// return the html string inside the .panel-body of the .altui-device#id panel
	function _drawSmoke( device) {
		return _drawMotion( device);
	};

	function _drawFlood( device) {
		return _drawMotion( device);
	};
	
	function _drawGCal( device) {
		return _drawMotion( device);
	};
	
    function _drawCombinationSwitch( device ) {
        var html = "";
        
        html += ("<button id='altui-pokebtn-{0}' type='button' class='pull-right altui-window-btn btn btn-default btn-sm '>{1}</button>" .format( device.altuiid,_T("Poke") )) ;

        var label = MultiBox.getStatus( device, 'urn:futzle-com:serviceId:CombinationSwitch1', 'Label' );
        if (label != null) {
            html += "<div class='altui-combsw-text text-muted'><br>Watched Items: {0}</div>".format(label);
        }

        html += "<script type='text/javascript'>";
        html += " $('button#altui-pokebtn-{0}').on('click', function() { MultiBox.runActionByAltuiID('{0}', 'urn:futzle-com:serviceId:CombinationSwitch1', 'Trigger', {}); } );".format(device.altuiid);
        html += "</script>";

        return html;
    };
	function _drawHouseMode( device ) {
        var html = "";
        var mode = parseInt(MultiBox.getStatus( device, 'urn:micasaverde-com:serviceId:HouseModes1', 'HMode' ) || '');
		for (var i=0; i<_HouseModes.length; i++ ) {
			if (_HouseModes[i].id==mode)
				html +=_HouseModes[i].text;
		}
        return html;
	};
	function _drawDayTime( device ) {
		var html = "";
        
		var status = parseInt(MultiBox.getStatus( device, 'urn:rts-services-com:serviceId:DayTime', 'Status' )); 
		html += _createOnOffButton( status,"altui-onoffbtn-"+device.altuiid, _T("Night,Day") , "pull-right");
		
		html += "<script type='text/javascript'>";
		html += " $('div#altui-onoffbtn-{0}').on('click', function() { ALTUI_PluginDisplays.toggleDayTimeButton('{0}','div#altui-onoffbtn-{0}'); } );".format(device.altuiid);
		html += "</script>";
		return html;
    }

    function _drawSonos( device ) {
        var html = "";
        var status = MultiBox.getStatus(device, 'urn:upnp-org:serviceId:AVTransport', 'TransportState'); // may return: PLAYING, PAUSED_PLAYBACK, STOPPED
        var title = MultiBox.getStatus(device, 'urn:upnp-org:serviceId:AVTransport', 'CurrentTitle'); // could also get CurrentAlbum, CurrentArtist, CurrentStatus
        var playstatus = ""; var playtitle = ""; var playbtn = "Play"; var stopbtn = "Stop"; var playbtnstyle = ""; var stopbtnstyle = "";
        if (title != null) {
            if (status == "PLAYING") {
                playstatus = "Playing..."; playtitle = title; playbtn = "Pause";
            } else {
                if (status == "PAUSED_PLAYBACK") {
                    playstatus = "<br>Paused...<br>Press Play to continue";
                } else if (status == "STOPPED") {
                    playstatus = "<br>Stopped";
                } else {
                    playstatus = "";
                }
            }
        }        
        html += "<button id='altui-Stopbtn-{0}' type='button' class='pull-right altui-window-btn btn btn-default btn-sm {1}'>{2}</button>" .format(device.altuiid, stopbtnstyle, _T(stopbtn)) ;
        html += "<button id='altui-{2}btn-{0}' type='button' class='pull-right altui-window-btn btn btn-default btn-sm {1}'>{2}</button>" .format(device.altuiid, playbtnstyle, _T(playbtn)) ;
        if (title != null) {
            html += "<div class='altui-sonos-text text-muted' style='height: 48px; overflow: hidden'>{0}<br>{1}</div>".format(playstatus, playtitle);
        }
        html += "<script type='text/javascript'>";
        html += " $('button#altui-Playbtn-{0}').on('click', function() { MultiBox.runActionByAltuiID('{0}', 'urn:micasaverde-com:serviceId:MediaNavigation1', 'Play', {}); } );".format(device.altuiid);
        html += " $('button#altui-Pausebtn-{0}').on('click', function() { MultiBox.runActionByAltuiID('{0}', 'urn:micasaverde-com:serviceId:MediaNavigation1', 'Pause', {}); } );".format(device.altuiid);
        html += " $('button#altui-Stopbtn-{0}').on('click', function() { MultiBox.runActionByAltuiID('{0}', 'urn:micasaverde-com:serviceId:MediaNavigation1', 'Stop', {}); } );".format(device.altuiid);
        html += "</script>";
        return html;
    }
	
    function _drawSysMonitor( device ) {
        var html = "";
        var memoryavail = MultiBox.getStatus(device, 'urn:cd-jackson-com:serviceId:SystemMonitor', 'memoryAvailable');
        var cpuload = MultiBox.getStatus(device, 'urn:cd-jackson-com:serviceId:SystemMonitor', 'cpuLoad5');
        if (memoryavail != null && cpuload != null) {
            html += "<div class='altui-sysmon-text text-muted'><br>Memory Available: {0}<br>CPU Load (5 minute): {1}</div>".format(memoryavail, cpuload);
        }
        return html;
    }
	
    function _drawVeraAlerts( device ) {
        var html = "";
        var lastmsgsent = MultiBox.getStatus(device, 'urn:richardgreen:serviceId:VeraAlert1', 'LastMsgSent');
        var lastrecipient = MultiBox.getStatus(device, 'urn:richardgreen:serviceId:VeraAlert1', 'LastRecipient');
        if (lastmsgsent != null && lastrecipient != null) {
            html += "<div class='altui-sysmon-text text-muted' style='padding-left: 52px'><br>Last Msg Sent: {0}<br>Profile Used: {1}</div>".format(lastmsgsent, lastrecipient);
        }
        return html;
    }
	
    // return the html string inside the .panel-body of the .altui-device#id panel
    function _drawMultiString( device ) {
        var html = ""; var sAll = _T("All"); var sMore = _T("More"); var sLess = _T("Less");
        if ($('button#altui-morebtn-'+device.altuiid).html() == undefined) {
            var initstate = {}; initstate['devicestate'] = 0;
            MyLocalStorage.setSettings("MULTISTRINGUISTATE"+device.altuiid, initstate);
        }        
        var state = MyLocalStorage.getSettings("MULTISTRINGUISTATE"+device.altuiid);
        var display = state != null ? state['devicestate'] : 0;
        html += "<div class='btn-group pull-right'>";
        html += " <button id='altui-allbtn-{0}' type='button' class='altui-window-btn btn btn-default btn-xs'>{1}</button>".format( device.altuiid,sAll);
        html += " <button id='altui-morebtn-{0}' type='button' class='altui-window-btn btn btn-default btn-xs'>{1}</button>".format( device.altuiid,(display != 2 ? sMore : sLess));
        html += "</div>";
        html += "<div class='altui-multistring-text-div'>";
        for (var v = 1; v <= 5 ; v++) {
            var label = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:VContainer1', "VariableName" + v ); 
            var value = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:VContainer1', "Variable" + v );
            var style = "";
            if (v <= 3) { style = "class='" + (display != 2 ? "altui-multistring-text-some" : "altui-multistring-text-all") + " altui-multistring-text-1 text-muted'"; }
            else {
                style = "class='" + (display != 2 ? "altui-multistring-text-some" : "altui-multistring-text-all") + " altui-multistring-text-2 text-muted'";
                if (display != 2) { style += " style='display: none;'"; } 
            }            
            if (label != null && value != null) {
                html += $(" <div " + style + "></div>").text(label + ": " + value).wrap( "<div></div>" ).parent().html();
            }
        }
        html += "</div>";
        html += "<script type='text/javascript'>";
        html += " var state = MyLocalStorage.getSettings('MULTISTRINGUISTATE{0}');".format(device.altuiid);
        html += " if (state['devicestate'] == 1) { $('.altui-multistring-text-1').toggle(); $('.altui-multistring-text-2').toggle(); }";
        html += " $('button#altui-allbtn-{0}').on('click', function() { $('.altui-multistring-text-some').removeClass('altui-multistring-text-some').addClass('altui-multistring-text-all').show(); $('#altui-morebtn-{0}').html('{1}'); state['devicestate'] = 2; MyLocalStorage.setSettings('MULTISTRINGUISTATE{0}', state); });".format(device.altuiid,sLess);            
        html += " $('button#altui-morebtn-{0}').on('click', function() { if ($(this).html() == '{1}') { $('.altui-multistring-text-all').removeClass('altui-multistring-text-all').addClass('altui-multistring-text-some'); $('.altui-multistring-text-2').hide(); $('#altui-morebtn-{0}').html('{2}'); state['devicestate'] = 0; MyLocalStorage.setSettings('MULTISTRINGUISTATE{0}', state); } else { $('.altui-multistring-text-1').toggle(); $('.altui-multistring-text-2').toggle(); state['devicestate'] = state['devicestate'] == 0 ? 1 : 0; MyLocalStorage.setSettings('MULTISTRINGUISTATE{0}', state); } });".format(device.altuiid,sLess,sMore);            
        html += "</script>";
        return html;
    }
	
    // return the html string inside the .panel-body of the .altui-device#id panel
    function _drawPnPProxy( device ) {
        var html = "";
        var status = MultiBox.getStatus( device, 'urn:futzle-com:serviceId:UPnPProxy1', 'StatusText' );
        if (status != null) {
            html += "<div class='altui-upnpproxy-text text-muted'>Status: {0}</div>".format(status);
        }
        return html;
    }
    function _drawProgLogicTimerSwitch( device ) {
        var html = "";
        var onoff = MultiBox.getStatus(device, 'urn:rts-services-com:serviceId:ProgramLogicTS', 'Status');
        var armed = MultiBox.getStatus(device, 'urn:rts-services-com:serviceId:ProgramLogicTS', 'Armed');
        var state = MultiBox.getStatus(device, 'urn:rts-services-com:serviceId:ProgramLogicTS', 'State');
        var rtime = MultiBox.getStatus(device, 'urn:rts-services-com:serviceId:ProgramLogicTS', 'TimeRemaining');
        html += "<div class='pull-right altui-plts-btn-div'>";
        html += " <div class='btn-group'>";
        html += "  <button id='altui-armbtn-{0}' type='button' class='altui-plts-btn btn btn-default btn-xs {2}'>{1}</button>".format(device.altuiid, _T("Arm"), armed==1?'btn-info':'');
        html += "  <button id='altui-bypassbtn-{0}' type='button' class='altui-plts-btn btn btn-default btn-xs {2}'>{1}</button>".format(device.altuiid, _T("Bypass"), armed==0?'btn-info':'');
        html += "  <button id='altui-triggerbtn-{0}' type='button' class='altui-plts-btn btn btn-default btn-xs'>{1}</button>".format(device.altuiid, _T("Trigger"));
        html += "  <button id='altui-restartbtn-{0}' type='button' class='altui-plts-btn btn btn-default btn-xs'>{1}</button>".format(device.altuiid, _T("Restart"));
        html += " </div><br>";
        html += " <div class='btn-group'>";
        html += "  <button id='altui-onbtn-{0}' type='button' class='altui-plts-btn btn btn-default btn-xs {2}'>{1}</button>".format(device.altuiid, _T("On"), onoff==1?'btn-info':'');
        html += "  <button id='altui-offbtn-{0}' type='button' class='altui-plts-btn btn btn-default btn-xs {2}'>{1}</button>".format(device.altuiid, _T("Off"), onoff==0?'btn-info':'');
        html += "  <button id='altui-resetbtn-{0}' type='button' class='altui-plts-btn btn btn-default btn-xs {2}'>{1}</button>".format(device.altuiid, _T("Reset"), state==0?'btn-info':'');
        if (state == 3 && rtime != null) {
            var h = '00'; var m = '00'; var s = '00'; var hms = rtime.split(':');
            if ( hms.length == 3) { h = hms[0]; m = hms[1]; s = hms[2] } else if ( hms.length == 2) { m = hms[0]; s = hms[1] } else { s = hms[0] }
            html += "<div id='altui-plts-rtime' class='altui-plts-time-text-div text-muted'>" + "{0}:{1}:{2}".format(h,m,s) + "</div>";            
        }
        html += " </div>";
        html += "</div>";
        html += "<script type='text/javascript'>";
        html += " function resizepltbtn() { var w = $('div.altui-device-body').width(); w=w<250?(w-50)/4:50; $('button.altui-plts-btn').css('width', w); $('#altui-plts-rtime').css('width', w-8).css('overflow', 'hidden'); }; resizepltbtn();";
        html += " $(window).resize(function(){ resizepltbtn(); });"
        html += " $('button#altui-restartbtn-{0}').on('click', function() { var device = MultiBox.getDeviceByAltuiID('{0}'); var state = MultiBox.getStatus(device, 'urn:rts-services-com:serviceId:ProgramLogicTS', 'State'); if (state==3) { MultiBox.runActionByAltuiID('{0}','urn:rts-services-com:serviceId:ProgramLogicTS','SetState',{'newStateValue':'2'}); $('button#altui-restartbtn-{0}').addClass('btn-info'); } });".format(device.altuiid);
        html += " $('button#altui-triggerbtn-{0}').on('click', function() { MultiBox.runActionByAltuiID('{0}','urn:rts-services-com:serviceId:ProgramLogicTS','SetState',{'newStateValue':'1'}); $('button#altui-triggerbtn-{0}').addClass('btn-info'); });".format(device.altuiid);
        html += " $('button#altui-bypassbtn-{0}').on('click', function() { MultiBox.runActionByAltuiID('{0}','urn:rts-services-com:serviceId:ProgramLogicTS','SetArmed',{'newArmedValue':'0'}); $('button#altui-bypassbtn-{0}').addClass('btn-info'); $('button#altui-armbtn-{0}').removeClass('btn-info'); });".format(device.altuiid);
        html += " $('button#altui-armbtn-{0}').on('click', function() { MultiBox.runActionByAltuiID('{0}','urn:rts-services-com:serviceId:ProgramLogicTS','SetArmed',{'newArmedValue':'1'}); $('button#altui-armbtn-{0}').addClass('btn-info'); $('button#altui-bypassbtn-{0}').removeClass('btn-info'); });".format(device.altuiid);
        html += " $('button#altui-resetbtn-{0}').on('click', function() { MultiBox.runActionByAltuiID('{0}','urn:rts-services-com:serviceId:ProgramLogicTS','SetState',{'newStateValue':'0'}); $('button#altui-resetbtn-{0}').addClass('btn-info'); });".format(device.altuiid);
        html += " $('button#altui-offbtn-{0}').on('click', function() { MultiBox.runActionByAltuiID('{0}','urn:rts-services-com:serviceId:ProgramLogicTS','SetTarget',{'newTargetValue':'0'}); $('button#altui-offbtn-{0}').addClass('btn-info'); $('button#altui-onbtn-{0}').removeClass('btn-info'); });".format(device.altuiid);
        html += " $('button#altui-onbtn-{0}').on('click', function() { MultiBox.runActionByAltuiID('{0}','urn:rts-services-com:serviceId:ProgramLogicTS','SetTarget',{'newTargetValue':'1'}); $('button#altui-onbtn-{0}').addClass('btn-info'); $('button#altui-offbtn-{0}').removeClass('btn-info'); });".format(device.altuiid);
        html += "</script>";
        return html;
    };
	function _drawMySensors( device) {
        var including = MultiBox.getStatus(device, 'urn:upnp-arduino-cc:serviceId:arduino1', 'InclusionMode');

        var html = "";
        html += "<div class='text-muted'>Press Start to include"

        html += "<div class='pull-right'>";
        html += ("<button id ='altui-arduino-include-start-{0}' type='button' class='altui-window-btn btn btn-default btn-sm {1}'>"+_T("Start")+"</button>").format(device.altuiid, (including==1) ? 'active' : '' );
        html += ("<button id ='altui-arduino-include-stop-{0}'  type='button' class='altui-window-btn btn btn-default btn-sm {1}'>"+_T("Stop") +"</button>").format(device.altuiid, (including==0) ? 'active' : '' );
        html += "</div></div>";

        html += "<script type='text/javascript'>";
        html += "$('button#altui-arduino-include-start-{0}').on('click', function() { MultiBox.runActionByAltuiID('{0}', 'urn:upnp-arduino-cc:serviceId:arduino1', 'StartInclusion', {}); } );".format(device.altuiid);
        html += "$('button#altui-arduino-include-stop-{0}').on ('click', function() { MultiBox.runActionByAltuiID('{0}', 'urn:upnp-arduino-cc:serviceId:arduino1', 'StopInclusion',  {}); } );".format(device.altuiid);
        html += "</script>";

        return html;
    };
	function _drawTempLeak( device ) {
        var html = "";
        var armed = parseInt(MultiBox.getStatus( device, 'urn:micasaverde-com:serviceId:SecuritySensor1', 'Armed' )); 
		html += _createOnOffButton( armed,"altui-onoffbtn-"+device.altuiid, _T("Bypass,Arm"), "pull-right" );
        html += _drawTempSensor(device);
        var lasttrip = MultiBox.getStatus( device, 'urn:micasaverde-com:serviceId:SecuritySensor1', 'LastTrip' );
		if (lasttrip != null) {
			var lasttripdate = _toIso(new Date(lasttrip*1000),' ');
			html+= "<div class='altui-lasttrip-text text-muted'>{0} {1} </div>".format( timeGlyph,lasttripdate );
		}
		html += "<script type='text/javascript'>";
		html += " $('div#altui-onoffbtn-{0}').on('click', function() { ALTUI_PluginDisplays.toggleArmed('{0}','div#altui-onoffbtn-{0}'); } );".format(device.altuiid);
		html += "</script>";
        return html;
    }
	
	// return the html string inside the .panel-body of the .altui-device#id panel
	function _drawMotion( device) {
		var html = "";
		
		// armed button
		// var status = parseInt(MultiBox.oldgetStatus( devid, 'urn:upnp-org:serviceId:SwitchPower1', 'Status' )); 
		// if ( ( ( device.Jobs != null ) && ( device.Jobs.length>0) ) || (device.status==1) || (device.status==5) ) {  
			// status = -1;
		// }
		var armed = parseInt(MultiBox.getStatus( device, 'urn:micasaverde-com:serviceId:SecuritySensor1', 'Armed' )); 
		html += _createOnOffButton( armed,"altui-onoffbtn-"+device.altuiid, _T("Bypass,Arm"), "pull-right" );
		
		var lasttrip = MultiBox.getStatus( device, 'urn:micasaverde-com:serviceId:SecuritySensor1', 'LastTrip' );
		if (lasttrip != null) {
			var lasttripdate = _toIso(new Date(lasttrip*1000),' ');
			html+= "<div class='altui-lasttrip-text text-muted'>{0} {1}</div>".format( timeGlyph,lasttripdate );
		}

		// armed, tripped
		var tripped = parseInt(MultiBox.getStatus( device, 'urn:micasaverde-com:serviceId:SecuritySensor1', 'Tripped' )); 
		html += ("<span class='altui-motion' >{0}</span>".format( (tripped==true) ? "<span class='glyphicon glyphicon-flash text-danger' aria-hidden='true'></span>" : ""));

		// armed
		html += "<script type='text/javascript'>";
		html += " $('div#altui-onoffbtn-{0}').on('click', function() { ALTUI_PluginDisplays.toggleArmed('{0}','div#altui-onoffbtn-{0}'); } );".format(device.altuiid);
		html += "</script>";
		return html;
	};
	
	function _drawKeypad(device) {
		var html = "";
		
		var status = parseInt(MultiBox.getStatus( device, 'urn:schemas-micasaverde-com:device:Keypad:1', 'Status' )); 
		var sl_UserCode = MultiBox.getStatus( device, 'urn:schemas-micasaverde-com:device:Keypad:1', 'sl_UserCode' ); 
		var sl_PinFailed = MultiBox.getStatus( device, 'urn:schemas-micasaverde-com:device:Keypad:1', 'sl_PinFailed' ); 
		html += _createOnOffButton( status,"altui-onoffbtn-"+device.altuiid, _T("Unlock,Lock") , "pull-right");
		if (sl_PinFailed=="1") {
			html += "<div class='text-danger'><span class='glyphicon glyphicon-warning-sign' aria-hidden='true'></span> Invalid PIN Entered</div>";
		}
		if (sl_UserCode != null) {
			var re = /UserName="(.*)"/;
			var m;
			if ((m = re.exec(sl_UserCode)) !== null) {
				if (m.index === re.lastIndex) {
					re.lastIndex++;
				}
				// View your result using the m-variable.
				// eg m[0] etc.
				html+= "<div class='altui-keypad-status'>User {0} Entered</div>".format( m[1] );
			}
		}
		html += "<script type='text/javascript'>";
		html += " $('div#altui-onoffbtn-{0}').on('click', function() { ALTUI_PluginDisplays.toggleKeypad('{0}','div#altui-onoffbtn-{0}'); } );".format(device.altuiid);
		html += "</script>";
		return html;
	};
	function _drawKeypadControlPanel( device, domparent) {
		var html="";
		html +="<div class=''>";
		html += "<span class='text-warn'>this panel is <mark>not functional</mark>, it requires a brave developper to finish it to manage pin codes etc using device UPNP actions</span>";
		html += "<table id='altui-cplus-keytbl'>";
		html += "<tbody>";
		html+="<tr><td><button class='altui-cplus-button btn btn-default' id='1'>1</button></td><td><button class='altui-cplus-button btn btn-default' id='2'>2</button></td><td><button class='altui-cplus-button btn btn-default' id='3'>3</button></td></tr>";
		html+="<tr><td><button class='altui-cplus-button btn btn-default' id='4'>4</button></td><td><button class='altui-cplus-button btn btn-default' id='5'>5</button></td><td><button class='altui-cplus-button btn btn-default' id='6'>6</button></td></tr>";
		html+="<tr><td><button class='altui-cplus-button btn btn-default' id='7'>7</button></td><td><button class='altui-cplus-button btn btn-default' id='8'>8</button></td><td><button class='altui-cplus-button btn btn-default' id='9'>9</button></td></tr>";
		html+="<tr><td colspan='3'><button class='altui-cplus-button btn btn-default' id='0'>0</button></td></tr>";
		html += "</tbody>";
		html += "</table>";
		html +="</div>";
		// html +="<div id='altui-cplus-divcontainer' class='pull-left'>";
		// html +="</div>";
		$(domparent).append(html);
		
		// also display the default
		// UIManager.defaultDeviceDrawControlPanel(devid, device, domparent.find("div#altui-cplus-divcontainer").width(400));
		
		$(".altui-cplus-button").click( function() {
			var id = $(this).prop('id');
			// MultiBox.runAction( device, 'urn:upnp-org:serviceId:cplus1', 'SendKey', {keyStream:id} );
		});
	};	
	
	// return the html string inside the .panel-body of the .altui-device#id panel
	
	function _drawBinaryLight( device) {
		var html ="";

		var status = parseInt(MultiBox.getStatus( device, 'urn:upnp-org:serviceId:SwitchPower1', 'Status' )); 
		// if ( ( ( device.Jobs != null ) && ( device.Jobs.length>0) ) || (device.status==1) || (device.status==5) ) {  
		// if ( (device.status==1) || (device.status==5))  {  
		if ( _isBusyStatus(device) )  {  
			status = -1;
		}
		html += _createOnOffButton( status,"altui-onoffbtn-"+device.altuiid, _T("OFF,ON") , "pull-right");
		html += UIManager.defaultDeviceDrawWatts( device);
		
		html += "<script type='text/javascript'>";
		html += " $('div#altui-onoffbtn-{0}').on('click', function() { ALTUI_PluginDisplays.toggleOnOffButton('{0}','div#altui-onoffbtn-{0}'); } );".format(device.altuiid);
		html += "</script>";
		return html;
	};

	function _drawSceneController(device) {
		var html="";
		var map = MultiBox.getStatus( device, 'urn:micasaverde-com:serviceId:SceneController1', 'SceneShortcuts' );
		var last = MultiBox.getStatus( device, 'urn:micasaverde-com:serviceId:SceneController1', 'sl_CentralScene' );
		if (map && last) {
			$.each( map.split(",") , function(k,v) {
				var parts  = v.split("=");
				// found a match for last button id
				if ((parts.length>0) && (parts[0]==last)) {
					var scene_mode = parts[1].split("-");
					// was it a scene or a mode ? 
					if (scene_mode.length>1) {
						if (scene_mode[0]!="0")  {
							// scene
							var controller = MultiBox.controllerOf(device.altuiid).controller;
							var scene = MultiBox.getSceneByID(controller,scene_mode[0])
							if (scene!=null)
								html += "<div class='altui-lasttrip-text text-muted'>{0}:{1}</div>".format(_T("Last Scene"),scene.name)
						}	
						if (scene_mode[1]!="0") 	// mode
							html += "<div class='altui-lasttrip-text text-muted'>{0}:{1}</div>".format(_T("Last Mode"),_HouseModes[ parseInt(scene_mode[1])-1 ].text)
					}
				}
			});
		}
		return html;
	};
	
	function _drawPowerMeter( device) {
		var html ="";
		var watts = parseFloat(MultiBox.getStatus( device, 'urn:micasaverde-com:serviceId:EnergyMetering1', 'Watts' )); 
		if (isNaN(watts)==false) 
			html += ALTUI_Templates.wattTemplate.format(watts,"Watts");

		var volts = parseFloat(MultiBox.getStatus( device, 'urn:brultech-com:serviceId:PowerMeter1', 'Volts' ));
		if (isNaN(volts)==false) 
			html += ALTUI_Templates.wattTemplate.format(volts,"Volts");
		return html;
	};
	
	// some static variables
	var CD_start = glyphTemplate.format( "play", _T("Start") , "");
	var CD_restart = glyphTemplate.format( "fast-backward", _T("Restart") , "");
	var CD_cancel = glyphTemplate.format( "stop", _T("Cancel") , "");
	var CD_force = glyphTemplate.format( "bell", _T("Force") , "");
	var CD_mute = glyphTemplate.format( "ban-circle", _T("Muted") , "");
	var CD_unmute = glyphTemplate.format( "bullhorn", _T("Unmuted") , "");
	
	function _drawMuteButton(device,cls) {
		var model2 = {
			cls:'pull-right '+cls,
			buttons: [
				{ id:'altui-CDMute-'+device.altuiid,label:CD_mute, cls:'btn-sm' },
			]
		}
		var muted = MultiBox.getStatus(device,"urn:futzle-com:serviceId:CountdownTimer1","Muted");
		model2.buttons[0].label=(muted=="1") ? CD_mute : CD_unmute
		return HTMLUtils.drawButtonGroup("altui-CntDown-Mute-{0}".format(device.altuiid), model2 );
	};
	function _drawCountDownRemaining(device) {
		var remaining = parseInt(MultiBox.getStatus( device, 'urn:futzle-com:serviceId:CountdownTimer1', 'Remaining' ));
		var duration = parseInt(MultiBox.getStatus( device, 'urn:futzle-com:serviceId:CountdownTimer1', 'Duration' ));
		return "<div class='altui-countdown'>{0} / {1}</div>".format( remaining , duration );
	};
	function _drawCountDown( device) {
		var model = {
			cls:'pull-right altui-countdown-btngrp',
			buttons: [
				{ id:'StartTimer', label:CD_start, cls:'btn-sm' },
				{ id:'RestartTimer',label:CD_restart, cls:'btn-sm' },
				{ id:'CancelTimer',label:CD_cancel, cls:'btn-sm' },
				{ id:'ForceComplete',label:CD_force, cls:'btn-sm' },
			]
		}
		var html ="";
		var remaining = parseInt(MultiBox.getStatus( device, 'urn:futzle-com:serviceId:CountdownTimer1', 'Remaining' ));
		var duration = parseInt(MultiBox.getStatus( device, 'urn:futzle-com:serviceId:CountdownTimer1', 'Duration' ));

		html += _drawMuteButton(device,'altui-countdown-btngrp-mute');
		html += HTMLUtils.drawButtonGroup("altui-CntDown-{0}".format(device.altuiid), model );
		html+= _drawCountDownRemaining(device);
		
		$(".altui-mainpanel")
			.off('click','.altui-countdown-btngrp button')
			.on('click','.altui-countdown-btngrp button', function(e) {
				var action = $(this).prop('id');
				var altuiid = $(this).closest('.altui-device').data("altuiid")
				MultiBox.runActionByAltuiID( altuiid, "urn:futzle-com:serviceId:CountdownTimer1", action )
			})
			.off('click','.altui-countdown-btngrp-mute button')
			.on('click','.altui-countdown-btngrp-mute button',function(e) {
				var altuiid = $(this).closest('.altui-device').data("altuiid")
				var device = MultiBox.getDeviceByAltuiID(altuiid);
				var muted = 1-parseInt(MultiBox.getStatus(device,"urn:futzle-com:serviceId:CountdownTimer1","Muted"));
				var label = (muted==1) ? CD_mute : CD_unmute;
				$(this).html(label);
				MultiBox.runAction(device,"urn:futzle-com:serviceId:CountdownTimer1","SetMute",{'newStatus':muted});
			});

		return html;
	};
	
	function _drawCountDownTile(device) {
		var html =  UIManager.drawDefaultFavoriteDevice(device);
		html += _drawMuteButton(device,'altui-countdown-btngrp-fav-mute');
		html+= _drawCountDownRemaining(device);
		$(".altui-mainpanel")
		.off('click','#altui-CDMute-'+device.altuiid)
		.on('click','#altui-CDMute-'+device.altuiid, function(e) {
			e.stopPropagation();
			var altuiid = $(this).prop('id').substring("altui-CDMute-".length)
			var device = MultiBox.getDeviceByAltuiID(altuiid);
			var muted = 1-parseInt(MultiBox.getStatus(device,"urn:futzle-com:serviceId:CountdownTimer1","Muted"));
			var label = (muted==1) ? CD_mute : CD_unmute;
			$(this).html(label);
			MultiBox.runAction(device,"urn:futzle-com:serviceId:CountdownTimer1","SetMute",{'newStatus':muted});
			return false;
		});
		return html;
	};
	
	function _drawVacation( device) {
		var html ="";
		var status = parseInt( MultiBox.getStatus( device, 'urn:upnp-org:serviceId:SwitchPower1', 'Status') );
		var expiryDate =  MultiBox.getStatus( device, 'urn:futzle-com:serviceId:HolidayVirtualSwitch1', 'OverrideExpiryDate') || "";
		if (expiryDate.length>0)
			expiryDate = "("+expiryDate+")"
		var name =  MultiBox.getStatus( device, 'urn:futzle-com:serviceId:HolidayVirtualSwitch1', 'Name');
		html+= "<div class='altui-watts '>{0} <small> {1}</small></div>".format( (status==1) ? _T("Holiday") : _T("Working") , expiryDate );
		html+= "<div class='text-info'>{0}</div>".format( name || "");
		return html;
	};

	function _drawWeather( device) {
		var html ="";
		var condition = MultiBox.getStatus( device, 'urn:upnp-micasaverde-com:serviceId:Weather1', 'Condition');
		var wind = MultiBox.getStatus( device, 'urn:upnp-micasaverde-com:serviceId:Weather1', 'WindCondition');
		var ForecastConditionGroup = MultiBox.getStatus( device, 'urn:upnp-micasaverde-com:serviceId:Weather1', 'Forecastday1ConditionGroup');
		if (ForecastConditionGroup!=null) {
			var newsrc = (ForecastConditionGroup!=null) ? "http://icons.wxug.com/i/c/i/"+ForecastConditionGroup+".gif" : defaultIconSrc;
			html += "<img class='altui-device-icon pull-right img-rounded' src='"+newsrc+"' alt='"+ForecastConditionGroup+"' onerror='UIManager.onDeviceIconError(\""+device.altuiid+"\")' ></img>";
		}
		html+= "<div class='altui-weather-text'>{0}</div>".format( condition );
		html+= ("<div class='altui-weather-text'>"+_T("Wind")+": {0}</div>").format( wind );
		return html;
	};
	
	function _drawWeatherIcon( device) {
		var html ="";
		var conditionGroup = MultiBox.getStatus( device, 'urn:upnp-micasaverde-com:serviceId:Weather1', 'ConditionGroup');
		var newsrc = (conditionGroup!=null) ? "http://icons.wxug.com/i/c/i/"+conditionGroup+".gif" : defaultIconSrc;
		return "<img class='altui-device-icon pull-left img-rounded' src='"+newsrc+"' alt='"+conditionGroup+"' onerror='UIManager.onDeviceIconError(\""+device.altuiid+"\")' ></img>";
	};
	
	function _drawWeatherFavorite(device) {
		var html =  UIManager.drawDefaultFavoriteDevice(device);
		var ForecastConditionGroup = MultiBox.getStatus( device, 'urn:upnp-micasaverde-com:serviceId:Weather1', 'Forecastday1ConditionGroup');
		if (ForecastConditionGroup!=null) {
			var newsrc = (ForecastConditionGroup!=null) ? "http://icons.wxug.com/i/c/i/"+ForecastConditionGroup+".gif" : defaultIconSrc;
			html += "<img class='altui-device-icon altui-weather1-day1 img-rounded' src='"+newsrc+"' alt='"+ForecastConditionGroup+"' onerror='UIManager.onDeviceIconError(\""+device.altuiid+"\")' ></img>";
		}
		return html;
	};
	
	function _drawDataMine( device) {
		var html ="";
		var url = "";
		if (MultiBox.isRemoteAccess()==true) {
			var controller = MultiBox.controllerOf(device.altuiid).controller;
			var isUI5 = MultiBox.isUI5(controller);
			if (isUI5 == false) {
				var main_url = window.location.href;
				var url_parts = main_url.split("?");
				url = url_parts[0]+"?id=lr_dmPage"
			} else {
				url = 'https://'+hostname+"/port_3480/data_request?id=lr_dmPage";
			}
		} else {
			var ipaddr = MultiBox.getIpAddr(device.altuiid);
			var hostname = (ipaddr=='') ? window.location.hostname : ipaddr;
			url = 'http://'+hostname+"/dm/index.html";
		}
		html+= ("<button id='altui-datamine-{0}' type='button' class='pull-right altui-datamine-open btn btn-default btn-sm ' >{1}</button>" .format( device.altuiid,_T("Open") )) ;
		html += "<script type='text/javascript'>";
		html += " $('button#altui-datamine-{0}.altui-datamine-open').on('click', function() { window.open('{1}','_blank'); } );".format(device.altuiid,url);
		html += "</script>";
		return html;
	};	
	
	function _drawMultiswitch(device) {
		var btnid = 0;
		var html ="";

		var names = MultiBox.getStatus(device,"urn:dcineco-com:serviceId:MSwitch1","BtnNames") || "[]";
		names = JSON.parse(names);

		html += "<div class='altui-multiswitch-container pull-right'>";
		for (var line=0; line<2 ; line++) {
			html += "<div class='row'>";
			for (var col=0; col<4; col ++) {
				var name = names[btnid] ? names[btnid] : ("Btn_"+(btnid+1));
				var status = parseInt(MultiBox.getStatus(device,"urn:dcineco-com:serviceId:MSwitch1","Status"+(btnid+1)));

				html += "<div class='col-xs-3'>";
				html+= ("<button id='{0}' data-btnid='{0}' type='button' class='altui-multiswitch-open altui-multiswitch-open-{3} btn btn-default btn-xs {2}' >{1}</button>".format( 
					btnid ,
					name  ,
					(status==1) ? 'btn-info' : '',
					device.altuiid
					)) ;
				// html+= "x";
				html += "</div>";
				
				btnid ++;
			}
			html += "</div>";
		}
		html += "</div>";
		html += "<script type='text/javascript'>";
		html += " $('button.altui-multiswitch-open-{0}').on('click', function() { 	".format(device.altuiid);
		html += " 	var btnid = parseInt($(this).prop('id'))+1;					";
		html += "   var action = 'SetStatus'+btnid; 							";
		html += "   var params = {}; params['newStatus'+btnid]=-1;				";
		html += "	MultiBox.runActionByAltuiID('{0}', 'urn:dcineco-com:serviceId:MSwitch1', action, params);".format(device.altuiid);
		html += "});"
		html += "</script>";
		return html;
	};
	
	function _drawInfoViewer( device) {
		var html ="";
		var pattern = MultiBox.getStatus( device, 'urn:a-lurker-com:serviceId:InfoViewer1', 'LuaPattern');
		var urlhead = MultiBox.getUrlHead(device.altuiid);
		html += "<div class='btn-group pull-right'>";
		html+= ("<button id='altui-infoviewer-{0}' type='button' class='altui-infoviewer-btn btn btn-default btn-sm pull-right'>{1}</button>" .format( device.altuiid,_T("Open") )) ;
		html+= ("<button id='altui-infoviewer-log-{0}' type='button' class='altui-infoviewer-log-btn btn btn-default btn-sm pull-right'>{1}</button>" .format( device.altuiid,_T("Logs") )) ;
		html += "</div>";
		if (pattern!="") {
			html+= "<div class='altui-infoviewer-pattern'>Pattern:</div>";
			html+= "<div class='altui-infoviewer-pattern'>{0}</div>".format( pattern.htmlEncode() );
		}
		html += "<script type='text/javascript'>";
		html += " $('button.altui-infoviewer-btn').on('click', function() { window.open('{1}?id=lr_al_info','_blank'); } );".format(device.altuiid,urlhead);
		html += " $('button.altui-infoviewer-log-btn').on('click', function() { window.open('{1}?id=lr_al_info&fnc=getLog&app=localapp','_blank'); } );".format(device.altuiid,urlhead);
		html += "</script>";
		return html;
	};	
	
	function _drawBinLightControlPanel(device, domparent) {

		var html = "Any thing can go here<hr>";
		html += "<div class='btn-group btn-group-lg' role='group' aria-label='...'>";
		html += "  <button type='button' class='btn btn-default'>Left</button>";
		html += "  <button type='button' class='btn btn-default'>Middle</button>";
		html += "  <button type='button' class='btn btn-default'>Right</button>";
		html += "</div>";

		$(domparent).append(html);
	};
// Rene Boer start
	function _drawHarmony(device) {
		var html = "";
		try {
			var activity  = parseInt(MultiBox.getStatus(device, 'urn:rboer-com:serviceId:Harmony1', 'CurrentActivityID')); 
			var actBtns = [];
			for (var i=1; i<=25; i++) {
				var actID = parseInt(MultiBox.getStatus(device, 'urn:rboer-com:serviceId:Harmony1', 'ActivityID'+i));
				var actDesc = MultiBox.getStatus(device, 'urn:rboer-com:serviceId:Harmony1', 'ActivityDesc'+i);
				if (actID !== '' && actDesc !== '' && actID !== null && actDesc !== null) {
					actBtns.push({'value':actID,'label':actDesc});
				}
			}	
			if (actBtns.length === 0) {
				html += "<span>No activities defined yet.</span>";
			}	
			else {	if (actBtns.length <= 6) {
				var btnid = 0;
				var colCls = 'col-xs-4';
				var colMax = 3;
				if (actBtns.length <= 2) {
					colCls = 'col-xs-12';
					colMax = 1;
				} else if (actBtns.length <= 4) {
					colCls = 'col-xs-6';
					colMax = 2;
				}
				html += "<div class='altui-harmony-container pull-right'>";
				for (var line=0; line<2 ; line++) {
					html += "<div class='row'>";
					for (var col=0; col<colMax; col++) {
						if (actBtns[btnid] !== undefined) {
							html += "<div class='altui-harmony-col {0}'>".format(colCls);
							html+= "<button id='{0}' type='button' class='altui-harmony-open altui-harmony-act-{3} btn btn-default btn-xs {2}'>{1}</button>".format(actBtns[btnid].value, actBtns[btnid].label,(actBtns[btnid].value==activity) ? 'btn-info' : '',device.altuiid);
							html += "</div>";
							btnid ++;
						}	
					}
					html += "</div>";
				}
				html += "</div>";
				html += "<script type='text/javascript'>";
				html += " $('button.altui-harmony-act-{0}').on('click', function() {".format(device.altuiid);
				html += " var btnCmd = $(this).prop('id'); ";
				html += " var action = 'StartActivity'; ";
				html += " var params = {}; params['newActivityID']=btnCmd; ";
				html += " MultiBox.runActionByAltuiID('{0}', '{1}', action, params);".format(device.altuiid, 'urn:rboer-com:serviceId:Harmony1');
				html += "});";
				html += "</script>";
			} else {
				var status = parseInt(MultiBox.getStatus(device, 'urn:upnp-org:serviceId:SwitchPower1', 'Status')); 
				html += ALTUI_PluginDisplays.createOnOffButton(status,"altui-onoffbtn-"+device.altuiid, _T("OFF,ON") , "pull-right");
				for (i=0; i<actBtns.length; i++) {
					if (actBtns[i].value === activity) {
						html += "<div>Activity : "+actBtns[i].label+"</div>";
						break;
					}	
				}
				html += "<div class='altui-harmony-container pull-right'>";
				html += "<div id='altui-harmony-act-group-{0}' class='btn-group'>".format(device.altuiid);
				html += "<button aria-expanded='false' data-toggle='dropdown' type='button' class='btn btn-default btn-xs dropdown-toggle'>";
				html += "Select Activity <span class='caret'></span></button>";
				html += "<ul role='menu' class='dropdown-menu'>";
				for (i=0; i<actBtns.length; i++) {
					html += "<li><a href='#' class='' id='{0}'>{1}</a></li>".format(actBtns[i].value, actBtns[i].label);
				}
				html += "</ul></div>";
				html += "</div>";
				html += "<script type='text/javascript'>";
				html += " $('#altui-harmony-act-group-{0} a').click( function() {".format(device.altuiid);
				html += " var body = $('html, body');"
				html += " var scrPos = body.scrollTop();";
				html += " var btnCmd = $(this).prop('id'); ";
				html += " var action = 'StartActivity'; ";
				html += " var params = {}; params['newActivityID']=btnCmd; ";
				html += " MultiBox.runActionByAltuiID('{0}', '{1}', action, params);".format(device.altuiid, 'urn:rboer-com:serviceId:Harmony1');
				html += " body.animate({scrollTop:scrPos}, '1000', 'swing'); ";
				html += "});";
				html += " $('div#altui-onoffbtn-{0}').on('click touchend', function() { ALTUI_PluginDisplays.toggleOnOffButton('{0}','div#altui-onoffbtn-{0}'); } );".format(device.altuiid);
				html += "</script>";
			}
			}
		} catch (e) {
			html += "<span>Error, sorry</span>";
		}
		return html;
	};
	
	// Draw the Control panel buttons dynamically to eliminate dependency on static json as that will get out of sync for bridged devices.
	function _drawHarmonyControlPanel(device, domparent) {
		var html = "";
		try {
			var activity  = parseInt(MultiBox.getStatus(device, 'urn:rboer-com:serviceId:Harmony1', 'CurrentActivityID')); 
			var actBtns = [];
			for (var i=1; i<=25; i++) {
				var actID = parseInt(MultiBox.getStatus(device, 'urn:rboer-com:serviceId:Harmony1', 'ActivityID'+i));
				var actDesc = MultiBox.getStatus(device, 'urn:rboer-com:serviceId:Harmony1', 'ActivityDesc'+i);
				if (actID !== '' && actDesc !== '' && actID !== null && actDesc !== null) {
					actBtns.push({'value':actID,'label':actDesc});
				}
			}              
			if (actBtns.length === 0) {
				html += "<span>No activities defined yet.</span>";
			} else {     
				html += "<div class='altui-harmony-controlpanel'>"+  //  pull-right
					"<div style='height: 20px;'>&nbsp;</div>"+
					"<div class='container-fluid'>"+
					" <div class='row'>";
				for (var btnid=0; btnid<actBtns.length; btnid++) {
					if (actBtns[btnid] !== undefined) {
						html += "<div class='altui-harmony-col col-xs-6 col-sm-3 col-md-2 col-lg-1'>";
						html+= "<button id='{0}' type='button' class='altui-harmony-open altui-harmony-cp-act-{3} btn btn-{2} btn-xs'>{1}</button>".format(actBtns[btnid].value, actBtns[btnid].label,(actBtns[btnid].value==activity) ? 'primary' : 'default',device.altuiid);
						html += "</div>";
					}              
				}
				html += " </div>"+
					"</div>";
				html += "<div style='height: 20px;'>&nbsp;</div>"+
					"<div class='container-fluid'>"+
					" <div class='row' style='height: 20px;'>"+
					"  <div class='altui-harmony-col col-xs-6 col-sm-4 col-md-3 col-lg-2'>Link Status:</div>"+
					"  <div class='altui-harmony-col col-xs-6 col-sm-4 col-md-2 col-lg-2'>"+MultiBox.getStatus(device, 'urn:rboer-com:serviceId:Harmony1', 'LinkStatus')+"</div>"+
					" </div>"+
					" <div class='row' style='height: 20px;'>"+
					"  <div class='altui-harmony-col col-xs-6 col-sm-4 col-md-3 col-lg-2'>Current Activity ID:</div>"+
					"  <div class='altui-harmony-col col-xs-6 col-sm-4 col-md-2 col-lg-2'>"+MultiBox.getStatus(device, 'urn:rboer-com:serviceId:Harmony1', 'CurrentActivityID')+"</div>"+
					" </div>"+
					" <div class='row' style='height: 20px;'>"+
					"  <div class='altui-harmony-col col-xs-6 col-sm-4 col-md-3 col-lg-2'>Last command:</div>"+
					"  <div class='altui-harmony-col col-xs-6 col-sm-4 col-md-2 col-lg-2'>"+MultiBox.getStatus(device, 'urn:rboer-com:serviceId:Harmony1', 'LastCommand')+"</div>"+
					" </div>"+
					" <div class='row' style='height: 20px;'>"+
					"  <div class='altui-harmony-col col-xs-6 col-sm-4 col-md-3 col-lg-2'>Last command time:</div>"+
					"  <div class='altui-harmony-col col-xs-6 col-sm-4 col-md-2 col-lg-2'>"+MultiBox.getStatus(device, 'urn:rboer-com:serviceId:Harmony1', 'LastCommandTime')+"</div>"+
					" </div>"+
					"</div>";
				html += "</div>";
				html += "<script type='text/javascript'>";
				html += " $('button.altui-harmony-cp-act-{0}').on('click', function() {".format(device.altuiid);
				html += " var btnCmd = $(this).prop('id'); ";
				html += " var action = 'StartActivity'; ";
				html += " var params = {}; params['newActivityID']=btnCmd; ";
				html += " MultiBox.runActionByAltuiID('{0}', '{1}', action, params);".format(device.altuiid, 'urn:rboer-com:serviceId:Harmony1');
				html += "});";
				html += "</script>";
			}
		} catch (e) {
			html += "<span>Error, sorry</span><p>"+e;
		}
		$(domparent).append(html);
		$(domparent).height(255);
	};

	// return the html string inside the .panel-body of the .altui-device#id panel
	function _drawHarmonyDevice(device) {
		var html = "";
		try {
			var actBtns = [];
			for (var i=1; i<=25; i++) {
				var cmd = MultiBox.getStatus(device, 'urn:rboer-com:serviceId:HarmonyDevice1','Command'+i);
				var cmdDesc = MultiBox.getStatus(device, 'urn:rboer-com:serviceId:HarmonyDevice1','CommandDesc'+i);
				if (cmd !== '' && cmdDesc !== '' && cmd !== null && cmdDesc !== null) {
					actBtns.push({'value':cmd,'label':cmdDesc});
				}
			}
			if (actBtns.length === 0) {
				html += "<span>No commands defined yet.</span>";
			}	
			else { 
				html += "<div class='altui-harmony-container pull-right'>";
				if (actBtns.length <= 6) {
					var btnid = 0;
					var colCls = 'col-xs-4';
					var colMax = 3;
					if (actBtns.length <= 2) {
						colCls = 'col-xs-12';
						colMax = 1;
					} else if (actBtns.length <= 4) {
						colCls = 'col-xs-6';
						colMax = 2;
					}
					for (var line=0; line<2 ; line++) {
						html += "<div class='row'>";
						for (var col=0; col<colMax; col++) {
							if (actBtns[btnid] !== undefined) {
								html += "<div class='altui-harmony-col {0}'>".format(colCls);
								html+= "<button id='{0}' type='button' class='altui-harmony-open altui-harmonydevice-cmd-{2} btn btn-default btn-xs'>{1}</button>".format(actBtns[btnid].value, actBtns[btnid].label, device.altuiid);
								html += "</div>";
								btnid ++;
							}	
						}
						html += "</div>";
					}
					html += "</div>";
					html += "<script type='text/javascript'>";
					html += " $('button.altui-harmonydevice-cmd-{0}').on('click', function() {".format(device.altuiid);
					html += " var btnCmd = $(this).prop('id'); ";
					html += " var action = 'SendDeviceCommand'; ";
					html += " var params = {}; params['Command']=btnCmd; ";
					html += " MultiBox.runActionByAltuiID('{0}', '{1}', action, params);".format(device.altuiid, 'urn:rboer-com:serviceId:HarmonyDevice1');
					html += "});";
					html += "</script>";
				} else {
					html += "<div id='altui-harmonydevice-cmd-group-{0}' class='btn-group'>".format(device.altuiid);
					html += "<button aria-expanded='false' data-toggle='dropdown' type='button' class='btn btn-default btn-xs dropdown-toggle'>";
					html += "Select Command <span class='caret'></span></button>";
					html += "<ul role='menu' class='dropdown-menu'>";
					for (var i=0; i<actBtns.length; i++) {
						html += "<li><a href='#' class='' id='{0}'>{1}</a></li>".format(actBtns[i].value, actBtns[i].label);
					}
					html += "</ul></div>";
					html += "</div>";
					html += "<script type='text/javascript'>";
					html += " $('#altui-harmonydevice-cmd-group-{0} a').click( function() {".format(device.altuiid);
					html += " var body = $('html, body');"
					html += " var scrPos = body.scrollTop();";
					html += " var btnCmd = $(this).prop('id'); ";
					html += " var action = 'SendDeviceCommand'; ";
					html += " var params = {}; params['Command']=btnCmd; ";
					html += " MultiBox.runActionByAltuiID('{0}', '{1}', action, params);".format(device.altuiid, 'urn:rboer-com:serviceId:HarmonyDevice1');
					html += " body.animate({scrollTop:scrPos}, '1000', 'swing'); ";
					html += "});";
					html += "</script>";
				}
			}
		} catch (e) {
			html += "<span>Error, sorry</span>";
		}
		return html;
	};
	
	// Draw the Control panel buttons dynamically to eliminate dependency on static json as that will get out of sync for bridged devices.
	function _drawHarmonyDeviceControlPanel(device, domparent) {
		var html = "";
		try {
			var actBtns = [];
			for (var i=1; i<=25; i++) {
				var cmd = MultiBox.getStatus(device, 'urn:rboer-com:serviceId:HarmonyDevice1','Command'+i);
				var cmdDesc = MultiBox.getStatus(device, 'urn:rboer-com:serviceId:HarmonyDevice1','CommandDesc'+i);
				if (cmd !== '' && cmdDesc !== '' && cmd !== null && cmdDesc !== null) {
					actBtns.push({'value':cmd,'label':cmdDesc});
				}
			}
			if (actBtns.length === 0) {
				html += "<span>No commands defined yet.</span>";
			} else {  
				html += "<div class='altui-harmony-controlpanel'>"+  //  pull-right
					"<div style='height: 20px;'>&nbsp;</div>"+
					"<div class='container-fluid'>"+
					" <div class='row'>";
				for (var btnid=0; btnid<actBtns.length; btnid++) {
					if (actBtns[btnid] !== undefined) {
						html += "<div class='altui-harmony-col col-xs-6 col-sm-3 col-md-2 col-lg-1'>";
						html+= "<button id='{0}' type='button' class='altui-harmony-open altui-harmonydevice-cp-cmd-{2} btn btn-default btn-xs'>{1}</button>".format(actBtns[btnid].value, actBtns[btnid].label, device.altuiid);
						html += "</div>";
					}              
				}
				html += " </div>"+
					"</div>";
				html += "<div style='height: 20px;'>&nbsp;</div>"+
					"<div class='container-fluid'>"+
					" <div class='row' style='height: 20px;'>"+
					"  <div class='altui-harmony-col col-xs-6 col-sm-4 col-md-3 col-lg-2'>Controlling Hub:</div>"+
					"  <div class='altui-harmony-col col-xs-6 col-sm-4 col-md-2 col-lg-2'>"+MultiBox.getStatus(device, 'urn:rboer-com:serviceId:HarmonyDevice1', 'HubName')+"</div>"+
					" </div>"+
					" <div class='row' style='height: 20px;'>"+
					"  <div class='altui-harmony-col col-xs-6 col-sm-4 col-md-3 col-lg-2'>Last command:</div>"+
					"  <div class='altui-harmony-col col-xs-6 col-sm-4 col-md-2 col-lg-2'>"+MultiBox.getStatus(device, 'urn:rboer-com:serviceId:HarmonyDevice1', 'LastDeviceCommand')+"</div>"+
					" </div>"+
					"</div>";
				html += "</div>";
				html += "<script type='text/javascript'>";
				html += " $('button.altui-harmonydevice-cp-cmd-{0}').on('click', function() {".format(device.altuiid);
				html += " var btnCmd = $(this).prop('id'); ";
				html += " var action = 'SendDeviceCommand'; ";
				html += " var params = {}; params['Command']=btnCmd; ";
				html += " MultiBox.runActionByAltuiID('{0}', '{1}', action, params);".format(device.altuiid, 'urn:rboer-com:serviceId:HarmonyDevice1');
				html += "});";
				html += "</script>";
			}
		} catch (e) {
			html += "<span>Error, sorry</span>";
		}
		$(domparent).append(html);
		$(domparent).height(255);
	};
// Rene Boer end

  // explicitly return public methods when this object is instantiated
  return {
	//---------------------------------------------------------
	// PUBLIC  functions
	//---------------------------------------------------------
	getStyle : _getStyle,
	onClickWindowCoverButton : _onClickWindowCoverButton,
	createOnOffButton : _createOnOffButton,
	drawBinaryLight : _drawBinaryLight,
	drawBinLightControlPanel : _drawBinLightControlPanel,
	drawSceneController: _drawSceneController,
	drawTempSensor : _drawTempSensor,
	drawHeater	   : _drawHeater,
	drawZoneThermostat : _drawZoneThermostat,
	drawCamera     : _drawCamera,
	drawCameraTile     : _drawCameraTile,
	drawVswitch	   : _drawVswitch,
	onSliderChange : _onSliderChange,
	drawDoorSensor : _drawDoorSensor,
	drawDoorLock   : _drawDoorLock,
	drawPLEG 	   : _drawPLEG,
	drawDimmable   : _drawDimmable,
	drawDimmableQubinoFlushPilotWire : _drawDimmableQubinoFlushPilotWire,
	onclickQubinoBtn : _onclickQubinoBtn,
	onColorPicker  : _onColorPicker,
	drawDimmableRGB   : _drawDimmableRGB,
	drawKeypad		: _drawKeypad,
	drawKeypadControlPanel : _drawKeypadControlPanel,
	drawMotion 	   : _drawMotion,
	drawGCal       : _drawGCal,
	drawCombinationSwitch	: _drawCombinationSwitch,
	drawHouseMode: _drawHouseMode,
	drawDayTime		: _drawDayTime,
	drawSonos		: _drawSonos,
	drawTempLeak	: _drawTempLeak,
	drawSysMonitor : _drawSysMonitor,
	drawVeraAlerts  : _drawVeraAlerts,
	drawMultiString : _drawMultiString,
	drawPnPProxy	: _drawPnPProxy,
	drawProgLogicTimerSwitch: _drawProgLogicTimerSwitch,
	drawMySensors   : _drawMySensors,
	drawSmoke 	   	: _drawSmoke,
	drawFlood		: _drawFlood,
	drawHumidity   : _drawHumidity,
	drawLight   	: _drawLight,
	drawWindowCover : _drawWindowCover,
	drawPowerMeter  : _drawPowerMeter,
	drawVacation    : _drawVacation,
	drawCountDown    : _drawCountDown,
	drawCountDownTile : _drawCountDownTile,
	drawWeather     : _drawWeather,
	drawWeatherIcon : _drawWeatherIcon,
	drawWeatherFavorite : _drawWeatherFavorite,
	drawInfoViewer  : _drawInfoViewer,
	drawDataMine 	: _drawDataMine,
	drawMultiswitch : _drawMultiswitch,		// warning, hardcoded display direction from UIMANAGER on this one due to changing device type
// Rene Boer start
	drawHarmony     : _drawHarmony,			// warning, hardcoded display direction from UIMANAGER on this one due to changing device type
	drawHarmonyDevice : _drawHarmonyDevice,		// warning, hardcoded display direction from UIMANAGER on this one due to changing device type
	drawHarmonyControlPanel        : _drawHarmonyControlPanel,
	drawHarmonyDeviceControlPanel  : _drawHarmonyDeviceControlPanel,
// Rene Boer end
	toggleButton    : _toggleButton,
	toggleOnOffButton : function (altuiid,htmlid) {
		_toggleButton(altuiid, htmlid, 'urn:upnp-org:serviceId:SwitchPower1', 'Status', function(id,newval) {
			MultiBox.setOnOff( altuiid, newval);
		});
	},
	toggleKeypad: function (altuiid,htmlid) {
		ALTUI_PluginDisplays.toggleButton(altuiid, htmlid, 'urn:micasaverde-com:serviceId:DoorLock1', 'Status', function(id,newval) {
			MultiBox.runActionByAltuiID( altuiid, 'urn:micasaverde-com:serviceId:DoorLock1', 'SetTarget', {newTargetValue:newval} );
		});
	},
	toggleArmed : function (altuiid,htmlid) {
		_toggleButton(altuiid, htmlid,'urn:micasaverde-com:serviceId:SecuritySensor1', 'Armed', function(id,newval) {
			MultiBox.setArm( altuiid, newval);
		});
	},
	toggleDoorLock : function (altuiid, htmlid) {
		_toggleButton(altuiid, htmlid,'urn:micasaverde-com:serviceId:DoorLock1', 'Status', function(id,newval) {
			MultiBox.setDoorLock( altuiid, newval);
		});
	},
	togglePLEG: function (altuiid, htmlid) {
		_toggleButton(altuiid, htmlid,'urn:rts-services-com:serviceId:ProgramLogicEG', 'Armed', function(id,newval) {
			MultiBox.runActionByAltuiID( altuiid, 'urn:rts-services-com:serviceId:ProgramLogicEG', 'SetArmed', {'newArmedValue':newval} );
		});
	},
	toggleVswitch: function (altuiid, htmlid) {
		ALTUI_PluginDisplays.toggleButton(altuiid, htmlid, 'urn:upnp-org:serviceId:VSwitch1', 'Status', function(id,newval) {
			MultiBox.runActionByAltuiID( altuiid, 'urn:upnp-org:serviceId:VSwitch1', 'SetTarget', {newTargetValue:newval} );
		});
	},
	toggleDayTimeButton : function (altuiid,htmlid) {
		ALTUI_PluginDisplays.toggleButton(altuiid, htmlid, 'urn:rts-services-com:serviceId:DayTime', 'Status', function(id,newval) {
            MultiBox.runActionByAltuiID( altuiid, 'urn:rts-services-com:serviceId:DayTime', 'SetTarget', {newTargetValue:newval} );
        });
    },
  };
})( window );
