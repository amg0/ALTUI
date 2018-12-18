//# sourceURL=J_ALTUI_iphone.js
"use strict";
// This program is free software: you can redistribute it and/or modify
// it under the condition that it is for private or home useage and 
// this whole comment is reproduced in the source code file.
// Commercial utilisation is not authorized without the appropriate
// written agreement from amg0 / alexis . mermet @ gmail . com
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 

var ALTUI_IPhoneLocator= ( function( window, undefined ) {  
	
	// return styles needed by this plugin module
	function _getStyle() {
		var style="";
		style += ".altui-iphone-txt 	{	font-size: 16px;	}";
		style += ".altui-canalplus 	{	font-size: 12px;	}";
		style += ".altui-razb 		{	font-size: 12px;	}";
		style += "#altui-cplus-keytbl td {text-align:center;     vertical-align:middle;}";
		style += ".altui-cplus-button { width: 70px; font-size:12px;}";
		style += ".altui-ipx  { margin-top: 10px; margin-right: 10px; }";	
		style += ".altui-flipr-text	{	font-size: 12px;     margin-left:54px;}";
		style += ".altui-flipr-container {	margin-left:54px; margin-right:55px; }";
		style += ".altui-flipr-tbl	{	font-size: 0.8em;  width:100%}";
		style += ".altui-flipr-tbl	td {	padding:1px;}";
		style += ".altui-ksenia  { margin-top: 10px; margin-right: 10px; }";	
		style += ".altui-wes  { margin-top: 10px; margin-right: 10px; }";	
		style += ".altui-ksenia-info  { font-size: 12px; }";	
		style += ".altui-version  { font-size: 10px; padding-left:5px;	}";	
		style += "\
			.spin {\
				animation: spinAround 10s linear infinite;\
			}\
			@keyframes spinAround {\
				from {\
					transform: rotate(0deg)\
				}\
				to {\
					transform: rotate(360deg);\
				}\
			}\
		";
		return style;
	};

	function _drawNETMON( device) {
		var debug = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:netmon1', 'Debug' ); 
		var offline = parseInt(MultiBox.getStatus( device, 'urn:upnp-org:serviceId:netmon1', 'DevicesOfflineCount' ));
		var targets = JSON.parse( MultiBox.getStatus( device, 'urn:upnp-org:serviceId:netmon1', 'Targets' ) );
		var html ="";
		html += ALTUI_PluginDisplays.createOnOffButton( debug,"altui-onoffbtn-"+device.altuiid, _T("Normal,Debug") , "pull-right");
		html += "<span>{0} Devices</span>".format(targets.length)
		if (offline>0) {
			html += "<div><span class='text-danger altui-netmon-offline'>{0} Offline</span></div>".format(offline)
		}
		html += "<script type='text/javascript'>";
		html += " $('div#altui-onoffbtn-{0}').on('click', function() { ALTUI_IPhoneLocator.toggleDebug('urn:upnp-org:serviceId:netmon1','{0}','div#altui-onoffbtn-{0}'); } );".format(device.altuiid);
		html += "</script>";
		return html;
	};
	
	function _drawAltUI( device) {
		var debug = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:altui1', 'Debug' ); 
		var version =  MultiBox.getStatus( device, 'urn:upnp-org:serviceId:altui1', 'Version' ); 
		
		var html ="";
		html += ALTUI_PluginDisplays.createOnOffButton( debug,"altui-onoffbtn-"+device.altuiid, _T("Normal,Debug") , "pull-right");
		html += "<div class='altui-version pull-left'>{0}</div>".format(version);
		html += "<script type='text/javascript'>";
		html += " $('div#altui-onoffbtn-{0}').on('click', function() { ALTUI_IPhoneLocator.toggleDebug('urn:upnp-org:serviceId:altui1','{0}','div#altui-onoffbtn-{0}'); } );".format(device.altuiid);
		html += "</script>";
		return html;
	};
	
	function _drawAltUIFavorite( device) {
		var html = UIManager.deviceIcon(device)
					.replace('altui-device-icon','altui-device-icon altui-favorite-icon spin')
					.replace('pull-left','')
		// var html = "<span>ok</span>"
		html += "<script type='text/javascript'>";
		html += " $('.altui-favorites-device#d{0}').addClass('altui-norefresh')".format(device.altuiid);
		html += "</script>";
		return html;
	};
	
	function _drawAltUIControlPanel( device, domparent) {
		function _displayOneDevice( altuiid ) {
			var device = MultiBox.getDeviceByAltuiID(altuiid);
			$("#altui-display-box").html( ALTUI_Templates.deviceEmptyContainerTemplate.format(device.id,device.altuiid,'altui-norefresh col-12'));
			$('.altui-device[data-altuiid={0}]'.format(device.altuiid)).html( UIManager.deviceDraw(device) );
		}

		var devices = MultiBox.getDevicesSync();
		var device = MultiBox.getDeviceByID( 0, g_ALTUI.g_MyDeviceID );
		
		var html ="";
		html += "<div class='col-12'>";
			html += "<h3>Pick a device:</h3>"
			html += "<div class='row'>";
				html += "<div class='altui-panel-controls col-6 '>";			

					html += DialogManager.pickDevice(devices,device.altuiid,'altui-select-device')
					var _recordMode = MultiBox.isRecording();
					html += ALTUI_PluginDisplays.createOnOffButton( _recordMode==true ? 1 : 0,"altui-recordmode-"+device.altuiid, _T("Normal,Recorder") , "pull-left");
				html += "</div>"
				html += "<div class='col-6 '>";			
					html +="<div id='altui-display-box' class='row'>"
						html += ALTUI_Templates.deviceEmptyContainerTemplate.format(device.id,device.altuiid,'altui-norefresh col-12');	
					html += "</div>";
				html += "</div>";			
			html +="</div>";
		html +="</div>";
		html += "<pre id='altui-record-log'></pre>"			
		$(domparent).append(html);
		_displayOneDevice( device.altuiid );
		// interactions
		$("#altui-recordmode-"+device.altuiid).closest('.altui-panel-controls')
		.off()
		.on('click', "#altui-recordmode-"+device.altuiid, function() {
			var checked = $("#altui-recordmode-"+device.altuiid).find("input").prop('checked');
			_recordMode = !checked;
			if (_recordMode==true) {
				MultiBox.startRecorder( function( action ) {
					$("#altui-record-log").append( JSON.stringify(action)+'\n' )
				});
				$("#altui-record-log").text( "recording...\n" )
			} else {
				var log = MultiBox.stopRecorder();
				$("#altui-record-log").text( JSON.stringify(log,null,2) )
			}
			$(".altui-panel-controls .altui-button-onoff").replaceWith( ALTUI_PluginDisplays.createOnOffButton( _recordMode==true ? 1 : 0,"altui-recordmode-"+device.altuiid, _T("Normal,Recorder") , "pull-left") );
		});
		$('#altui-select-device').change(function(){
			var altuiid = $(this).val();
			_displayOneDevice( altuiid )
		});
	};

	function _drawALTHue(device) {
		var debug = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:althue1', 'Debug' ); 
		var version =  MultiBox.getStatus( device, 'urn:upnp-org:serviceId:althue1', 'Version' ); 
		var html ="";
		html += ALTUI_PluginDisplays.createOnOffButton( debug,"altui-onoffbtn-"+device.altuiid, _T("Normal,Debug") , "pull-right");
		var ip = device.ip;
		if (ip) {
			html+= ("<button id='altui-ipx-{0}' type='button' class='pull-right altui-wes btn btn-light btn-sm '>{1}</button>" .format( device.altuiid,_T("Open") )) ;
			html += "<script type='text/javascript'>";
			html += " $('button#altui-ipx-{0}').on('click', function() { window.open('http://{1}','_blank'); } );".format(device.altuiid,ip);
			html += "</script>";
		}
		html += "<div class='altui-version pull-left'>{0}</div>".format(version);
		html += "<script type='text/javascript'>";
		html += " $('div#altui-onoffbtn-{0}').on('click', function() { ALTUI_IPhoneLocator.toggleDebug('urn:upnp-org:serviceId:althue1','{0}','div#altui-onoffbtn-{0}'); } );".format(device.altuiid);
		html += "</script>";
		return html;
	};
	
	function _drawWES(device) {
		var debug = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:wes1', 'Debug' ); 
		var version =  MultiBox.getStatus( device, 'urn:upnp-org:serviceId:wes1', 'Version' ); 
		var html ="";
		html += ALTUI_PluginDisplays.createOnOffButton( debug,"altui-onoffbtn-"+device.altuiid, _T("Normal,Debug") , "pull-right");
		var ip = device.ip;
		if (ip) {
			html+= ("<button id='altui-ipx-{0}' type='button' class='pull-right altui-wes btn btn-light btn-sm '>{1}</button>" .format( device.altuiid,_T("Open") )) ;
			html += "<script type='text/javascript'>";
			html += " $('button#altui-ipx-{0}').on('click', function() { window.open('http://{1}','_blank'); } );".format(device.altuiid,ip);
			html += "</script>";
		}
		html += "<div class='altui-version pull-left'>{0}</div>".format(version);
		html += "<script type='text/javascript'>";
		html += " $('div#altui-onoffbtn-{0}').on('click', function() { ALTUI_IPhoneLocator.toggleDebug('urn:upnp-org:serviceId:wes1','{0}','div#altui-onoffbtn-{0}'); } );".format(device.altuiid);
		html += "</script>";
		return html;
	}
	function _drawAltSonos(device) {
		var debug = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:altsonos1', 'Debug' ); 
		var version =  MultiBox.getStatus( device, 'urn:upnp-org:serviceId:altsonos1', 'Version' ); 
		var html ="";
		html += ALTUI_PluginDisplays.createOnOffButton( debug,"altui-onoffbtn-"+device.altuiid, _T("Normal,Debug") , "pull-right");

		html += "<div class='altui-version pull-left'>{0}</div>".format(version);
		html += "<script type='text/javascript'>";
		html += " $('div#altui-onoffbtn-{0}').on('click', function() { ALTUI_IPhoneLocator.toggleDebug('urn:upnp-org:serviceId:altsonos1','{0}','div#altui-onoffbtn-{0}'); } );".format(device.altuiid);
		html += "</script>";
		return html;
	}
	function _drawIPX( device) {
		var debug = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:IPX8001', 'Debug' ); 
		var version =  MultiBox.getStatus( device, 'urn:upnp-org:serviceId:IPX8001', 'Version' ); 
		var html ="";
		html += ALTUI_PluginDisplays.createOnOffButton( debug,"altui-onoffbtn-"+device.altuiid, _T("Normal,Debug") , "pull-right");
		var ip = device.ip;
		if (ip) {
			html+= ("<button id='altui-ipx-{0}' type='button' class='pull-right altui-ipx btn btn-light btn-sm '>{1}</button>" .format( device.altuiid,_T("Open") )) ;
			html += "<script type='text/javascript'>";
			html += " $('button#altui-ipx-{0}').on('click', function() { window.open('http://{1}','_blank'); } );".format(device.altuiid,ip);
			html += "</script>";
		}
		html += "<div class='altui-version pull-left'>{0}</div>".format(version);
		html += "<script type='text/javascript'>";
		html += " $('div#altui-onoffbtn-{0}').on('click', function() { ALTUI_IPhoneLocator.toggleDebug('urn:upnp-org:serviceId:IPX8001','{0}','div#altui-onoffbtn-{0}'); } );".format(device.altuiid);
		html += "</script>";
		return html;
	};

	function _drawFLIPR(device) {
		var iconcode = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:flipr1', 'IconCode' ); 
		var debug = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:flipr1', 'Debug' ); 
		var version =  MultiBox.getStatus( device, 'urn:upnp-org:serviceId:flipr1', 'Version' ); 
		var ph =  parseFloat(MultiBox.getStatus( device, 'urn:upnp-org:serviceId:flipr1', 'PH' ) || ""); 
		var Desinfectant_Deviation = parseFloat(MultiBox.getStatus( device, 'urn:upnp-org:serviceId:flipr1', 'Desinfectant_Deviation' ) || ""); 
		var ox = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:flipr1', 'OxydoReduction' ) || ""; 
		var temp =  MultiBox.getStatus( device, 'urn:upnp-org:serviceId:TemperatureSensor1', 'CurrentTemperature' ) || ""; 
		temp = Math.round(temp*10)/10
		var html ="";
		html += ALTUI_PluginDisplays.createOnOffButton( debug,"altui-onoffbtn-"+device.altuiid, _T("Normal,Debug") , "pull-right");
		if (iconcode!="0") {
			var model = [
				[
					{label:"PH", value:ph, cls:(Math.abs( ph-7) >1) ? "text-danger" : ""},
					{label:"Temp", suffix:'&deg;', value:temp, cls:""},
				],
				[
					{label:"Cl-Br", suffix:'%', value:Math.floor( Desinfectant_Deviation*100 ), cls:(Math.abs( Desinfectant_Deviation ) >0.5) ? "text-danger" : ""},
					{label:"OxyRed", suffix:'mV', value:ox, cls:""},
				]
			]
			html += "<div class='altui-flipr-container'><table class='altui-flipr-tbl'>"
			html += "<tbody>"
			$.each(model, function(l,line) {
				html += '<tr>'
				$.each(line, function(c,cell) {
					cell = $.extend({label:"", value:0, cls:"", suffix:""}, cell)
					html += '<td>'
					html +='<span class="{0}" title="{1}"><b></b>{2}{3}</span>'.format(
						cell.cls,
						cell.label,
						cell.value,
						cell.suffix)
					html += '</td>'
				})
				html += '</tr>'
			})
			html += "</tbody>"
			html += "</table></div>"
		}
		html += "<div class='altui-version pull-left'>{0}</div>".format(version);

		html += "<script type='text/javascript'>";
		html += " $('div#altui-onoffbtn-{0}').on('click', function() { ALTUI_IPhoneLocator.toggleDebug('urn:upnp-org:serviceId:flipr1','{0}','div#altui-onoffbtn-{0}'); } );".format(device.altuiid);
		html += "</script>";
		return html;
	};

	function _drawRAZB(device) {
		var debug = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:razb1', 'Debug' ); 
		var version =  MultiBox.getStatus( device, 'urn:upnp-org:serviceId:razb1', 'Version' ); 
		var html ="";
		html += ALTUI_PluginDisplays.createOnOffButton( debug,"altui-onoffbtn-"+device.altuiid, _T("Normal,Debug") , "pull-right");
		html += "<div class='altui-'> </div>";
		html += "<div class='altui-razb'>{0}</div>".format(version);
		html += "<script type='text/javascript'>";
		html += " $('div#altui-onoffbtn-{0}').on('click', function() { ALTUI_IPhoneLocator.toggleDebug('urn:upnp-org:serviceId:razb1','{0}','div#altui-onoffbtn-{0}'); } );".format(device.altuiid);
		html += "</script>";
		return html;
	}

	function _drawKSENIA(device) {
		var debug = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:ksenia1', 'Debug' ); 
		var version =  MultiBox.getStatus( device, 'urn:upnp-org:serviceId:ksenia1', 'Version' ); 
		var partitions = JSON.parse( MultiBox.getStatus( device, 'urn:upnp-org:serviceId:ksenia1', 'Partitions' )); 
		var nActive = 0
		$.each(partitions, function(i,e) {
			if (e.status!="DISARMED")
				nActive++;
		});
		var ip = device.ip;
		var html ="";
		html += ALTUI_PluginDisplays.createOnOffButton( debug,"altui-onoffbtn-"+device.altuiid, _T("Normal,Debug") , "pull-right");
		if (ip) {
			html+= ("<button id='altui-ksenia-{0}' type='button' class='pull-right altui-ksenia btn btn-light btn-sm '>{1}</button>" .format( device.altuiid,_T("Open") )) ;
			html += "<script type='text/javascript'>";
			html += " $('button#altui-ksenia-{0}').on('click', function() { window.open('http://{1}','_blank'); } );".format(device.altuiid,ip);
			html += "</script>";
		}
		if (nActive>0) {
			html += "<div class='altui-ksenia-info' '><span class='glyphicon glyphicon-flash text-danger' aria-hidden='true'></span>{0}</div>".format((nActive>0) ? _T("{0} partition(s) active(s)").format(nActive) :  "" );
		}
		html += "<div class='altui-version pull-left'>{0}</div>".format(version);
		html += "<script type='text/javascript'>";
		html += " $('div#altui-onoffbtn-{0}').on('click', function() { ALTUI_IPhoneLocator.toggleDebug('urn:upnp-org:serviceId:ksenia1','{0}','div#altui-onoffbtn-{0}'); } );".format(device.altuiid);
		html += "</script>";
		return html;
	}
		
	// draw icon of unknown device based on zway icons...
	// cf doc in function device_icon(nodeId)  in z-way-demo.js 
	function _drawRAZBUNKIcon(device) {
		var html ="";
		var newsrc = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:razbunk1', 'IconCode' ); 
		return "<img class='altui-device-icon pull-left rounded' src='"+newsrc+"' alt='' onerror='UIManager.onDeviceIconError(\""+device.altuiid+"\")' ></img>";
	};

	// return the html string inside the .card-body of the .altui-device#id panel
	function _drawIPhone( device) {
		var dist = Math.round( parseFloat(MultiBox.getStatus( device, 'urn:upnp-org:serviceId:IPhoneLocator1', 'Distance' ) * 100) )/100; 
		var unit = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:IPhoneLocator1', 'Unit' ); 
		var mute = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:IPhoneLocator1', 'Muted' ); 
		
		var html ="";
		html+=("<span class='altui-iphone-txt' > "+dist+" </span>");
		html+=("<small > "+unit+" </small>");

		html += ALTUI_PluginDisplays.createOnOffButton( mute,"altui-onoffbtn-"+device.altuiid, _T("Unmuted,Muted") , "pull-right");
		html += "<script type='text/javascript'>";
		html += " $('div#altui-onoffbtn-{0}').on('click', function() { ALTUI_IPhoneLocator.toggleMute('{0}','div#altui-onoffbtn-{0}'); } );".format(device.altuiid);
		html += "</script>";
		
		return html;
	};
	function _drawIPhoneFavorite( device) {
		var html = UIManager.deviceIcon(device)
					.replace('altui-device-icon','altui-device-icon altui-favorite-icon')
					.replace('pull-left','')
		var dist = Math.round( parseFloat(MultiBox.getStatus( device, 'urn:upnp-org:serviceId:IPhoneLocator1', 'Distance' ) * 100) )/100; 
		var unit = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:IPhoneLocator1', 'Unit' ); 
		html+=("<div class='bg-light altui-iphone-txt' >{0} {1}</div>".format(dist,unit))
		return html;
	};
	function _drawCanalplus( device) {
		var channel = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:cplus1', 'CurrentChannel' ).split(','); 
		var present = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:cplus1', 'Present' );
		var html ="";
		html += ALTUI_PluginDisplays.createOnOffButton( present,"altui-onoffbtn-"+device.altuiid, _T("OFF,ON"), "pull-right" );
		if (channel.length>=2)
			html+=("<div class='altui-canalplus' >{0}<div><small>{1}</small></div></div>".format(channel[1],channel[0]));

		html += "<script type='text/javascript'>";
		html += " $('div#altui-onoffbtn-{0}').on('click', function() { ALTUI_IPhoneLocator.toggleCplusOnOff('{0}','div#altui-onoffbtn-{0}'); } );".format(device.altuiid);
		html += "</script>";
		return html;
	};
	
	// function _drawControlPanel(devid, device, domparent) {
		// $(domparent).append("Hello I am alive, and I am in a custom drawing function!");
	// };

	function _drawCanaplusControlPanel( device, domparent) {
		var html="";
		html +="<div class='bg-info'>";
		html += "<table id='altui-cplus-keytbl'>";
		html += "<tbody>";
		html+="<tr><td><button class='altui-cplus-button btn btn-light' id='1'>1</button></td><td><button class='altui-cplus-button btn btn-light' id='2'>2</button></td><td><button class='altui-cplus-button btn btn-light' id='3'>3</button></td></tr>";
		html+="<tr><td><button class='altui-cplus-button btn btn-light' id='4'>4</button></td><td><button class='altui-cplus-button btn btn-light' id='5'>5</button></td><td><button class='altui-cplus-button btn btn-light' id='6'>6</button></td></tr>";
		html+="<tr><td><button class='altui-cplus-button btn btn-light' id='7'>7</button></td><td><button class='altui-cplus-button btn btn-light' id='8'>8</button></td><td><button class='altui-cplus-button btn btn-light' id='9'>9</button></td></tr>";
		html+="<tr><td colspan='3'><button class='altui-cplus-button btn btn-light' id='0'>0</button></td></tr>";
		html+="<tr><td><button class='altui-cplus-button btn btn-light' id='Rewind'>Rewind</button></td><td><button class='altui-cplus-button btn btn-light' id='Play'>Play</button></td><td><button class='altui-cplus-button btn btn-light' id='Forward'>Forward</button></td></tr>";
		html+="<tr><td><button class='altui-cplus-button btn btn-light' id='Stop'>Stop</button></td><td><button class='altui-cplus-button btn btn-light' id='Pause'>Pause</button></td><td><button class='altui-cplus-button btn btn-light' id='Rec'>Rec</button></td></tr>";
		html+="<tr><td colspan='3'>-</td></tr>";
		html+="<tr><td><button class='altui-cplus-button btn btn-light' id='Menu'>Menu</button></td><td><button class='altui-cplus-button btn btn-light' id='Haut'>Haut</button></td><td><button class='altui-cplus-button btn btn-light' id='Guide'>Guide</button></td></tr>";
		html+="<tr><td><button class='altui-cplus-button btn btn-light' id='Gauche'>Gauche</button></td><td><button class='altui-cplus-button btn btn-light' id='Ok'>Ok</button></td><td><button class='altui-cplus-button btn btn-light' id='Droite'>Droite</button></td></tr>";
		html+="<tr><td><button class='altui-cplus-button btn btn-light' id='Retour'>Retour</button></td><td><button class='altui-cplus-button btn btn-light' id='Bas'>Bas</button></td><td><button class='altui-cplus-button btn btn-light' id='Sortie'>Sortie</button></td></tr>";
		html+="<tr><td colspan='3'>-</td></tr>";
		html+="<tr><td><button class='altui-cplus-button btn btn-light' id='VOL+'>VOL+</button></td><td><button class='altui-cplus-button btn btn-light' id='Mute'>Mute</button></td><td><button class='altui-cplus-button btn btn-light' id='P+'>P+</button></td></tr>";
		html+="<tr><td><button class='altui-cplus-button btn btn-light' id='VOL-'>VOL-</button></td><td><button class='altui-cplus-button btn btn-light' id='Info'>Info</button></td><td><button class='altui-cplus-button btn btn-light' id='P-'>P-</button></td></tr>";
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
			MultiBox.runAction( device, 'urn:upnp-org:serviceId:cplus1', 'SendKey', {keyStream:id} );
		});
	};	
	
  // explicitly return public methods when this object is instantiated
  return {
	//---------------------------------------------------------
	// PUBLIC  functions
	//---------------------------------------------------------
	getStyle 	: _getStyle,
	drawIPhone 	: _drawIPhone,
	drawIPhoneFavorite : _drawIPhoneFavorite,
	drawAltSonos : _drawAltSonos,
	drawIPX		: _drawIPX,
	drawFLIPR	: _drawFLIPR,
	drawKSENIA	: _drawKSENIA,
	drawRAZB	: _drawRAZB,
	drawRAZBUNKIcon : _drawRAZBUNKIcon,
	drawNETMON : _drawNETMON,
	drawAltUI : _drawAltUI,
	drawAltUIControlPanel:_drawAltUIControlPanel,
	drawAltUIFavorite:_drawAltUIFavorite,
	drawCanalplus : _drawCanalplus,
	drawCanaplusControlPanel : _drawCanaplusControlPanel,
	drawWES : _drawWES,
	drawALTHue : _drawALTHue,
	
	// drawControlPanel : _drawControlPanel,
	toggleDebug : function (service,devid,htmlid) {
		ALTUI_PluginDisplays.toggleButton(devid, htmlid, service, 'Debug', function(id,newval) {
			MultiBox.runActionByAltuiID ( devid, service, 'SetDebug', {newDebugMode:newval} );
		});
	},
	toggleMute : function (devid,htmlid) {
		ALTUI_PluginDisplays.toggleButton(devid, htmlid, 'urn:upnp-org:serviceId:IPhoneLocator1', 'Muted', function(id,newval) {
			MultiBox.runActionByAltuiID( devid, 'urn:upnp-org:serviceId:IPhoneLocator1', 'SetMute', {newMuteStatus:newval} );
		});
	},
	toggleCplusOnOff : function (devid,htmlid) {
		ALTUI_PluginDisplays.toggleButton(devid, htmlid, 'urn:upnp-org:serviceId:cplus1', 'Present', function(id,newval) {
			MultiBox.runActionByAltuiID( devid, 'urn:upnp-org:serviceId:cplus1', 'SetPower', {newPowerState:newval} );
		});
	},
	};
})( window );
