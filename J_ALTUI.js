//# sourceURL=J_ALTUI.js
// This program is free software: you can redistribute it and/or modify
// it under the condition that it is for private or home useage and 
// this whole comment is reproduced in the source code file.
// Commercial utilisation is not authorized without the appropriate
// written agreement from amg0 / alexis . mermet @ gmail . com
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 

//-------------------------------------------------------------
// ALTUI  Plugin javascript Tabs
//-------------------------------------------------------------
var altui_Svs = 'urn:upnp-org:serviceId:altui1';
var ip_address = data_request_url;
var altui_api = (typeof api === 'undefined') ? null :  api;

//-------------------------------------------------------------
// Utilities Javascript
// Utilities for searching Vera devices
//-------------------------------------------------------------
var ALTUI_VeraUtils = (function(){
	function beautify(str) {
		var val = JSON.stringify(JSON.parse(str),null,2)
		return val
	};
	
	function altui_format(str)
	{
	   var content = str;
	   for (var i=1; i < arguments.length; i++)
	   {
			var replacement = new RegExp('\\{' + (i-1) + '\\}', 'g');	// regex requires \ and assignment into string requires \\,
			// if ($.type(arguments[i]) === "string")
				// arguments[i] = arguments[i].replace(/\$/g,'$');
			content = content.replace(replacement, arguments[i]);  
	   }
	   return content;
	};
	
	function findDeviceIdx(deviceID) 
	{
		//jsonp.ud.devices
		for(var i=0; i<jsonp.ud.devices.length; i++) {
			if (jsonp.ud.devices[i].id == deviceID) 
				return i;
		}
		return null;
	};

	function findRootDeviceIdx(deviceID) 
	{
		var idx = ALTUI_VeraUtils.findDeviceIdx(deviceID);
		while (jsonp.ud.devices[idx].id_parent != 0)
		{
			idx = ALTUI_VeraUtils.findDeviceIdx(jsonp.ud.devices[idx].id_parent);
		}
		return idx;
	};

	function findRootDevice(deviceID)
	{
		var idx = ALTUI_VeraUtils.findRootDeviceIdx(deviceID) ;
		return jsonp.ud.devices[idx].id;
	};

	function findDeviceIP(deviceID)
	{
		var idx = ALTUI_VeraUtils.findRootDeviceIdx(deviceID) ;
		return jsonp.ud.devices[idx].ip;
	};
	
	function buildUPnPActionUrl(deviceID,service,action,params)
	{
		var urlHead = ip_address +'id=action&output_format=json&DeviceNum='+deviceID+'&serviceId='+service+'&action='+action;//'&newTargetValue=1';
		if (params != undefined) {
			jQuery.each(params, function(index,value) {
				urlHead = urlHead+"&"+index+"="+value;
			});
		}
		return urlHead;
	};
	
	return {
		beautify:beautify,
		altui_format:altui_format,
		findDeviceIdx:findDeviceIdx,
		findRootDeviceIdx:findRootDeviceIdx,
		findRootDevice:findRootDevice,
		findDeviceIP:findDeviceIP,
		buildUPnPActionUrl:buildUPnPActionUrl
	}
})()

//-------------------------------------------------------------
// Device TAB : Donate
//-------------------------------------------------------------	
function altui_License(deviceID) {
	var htmlDonate='ALTUI is a sofrware as a service model, it can be used freely for non commercial useage but some features are limited to the licensed user. once ALTUI is installed you can go to ALTUI License page for subscribing to ALTUI';
	var html = '<div>'+htmlDonate+'</div>';
	set_panel_html(html);
}

//-------------------------------------------------------------
// Device TAB : Settings
//-------------------------------------------------------------	

function altui_onOpenLocalButton(deviceId) {
	// var url = window.location.origin + "/port_3480/data_request?id=lr_ALTUI_Handler&command=home&" + jQuery( "#altui-home" ).val()
	// var url = data_command_url + get_device_state(deviceId, altui_Svs, "LocalHome", 0).replace('/data_request?','')
	var url = get_device_state(deviceId, altui_Svs, "LocalHome", 0)
	window.open( url, '_blank');
}

function altui_buildUrlOptions(deviceID) {
	function _buildSelect(name,options,init) {
		var html ="";
		html += ALTUI_VeraUtils.altui_format("<label for='{0}'>{1}</label><select class='form-control' id='{0}'>",'altui_'+name,name+":");
		jQuery.each( options, function(i,opt) {
			html +=  ALTUI_VeraUtils.altui_format('<option {1}>{0}</option>',opt,(opt==init) ? 'selected' : '')
		});
		html += "</select>"
		return html;
	}
		// jQuery( "#altui_Home,#altui_Lang,#altui_Layout,#altui_nPage" ).each( function(item) {
	var layout=["","lean"];
	var home=["","pageHome","pageMyHome","pageRooms","pageDevices","pageScenes","pageSceneEdit","pagePlugins","pageUsePages","pageEditPages","pageCredits","pageLuaTest","pageLuaStart","pageOptions","pageEditor","pageZwave","pageLocalization","pagePower","pageChildren","pageRoutes","pageQuality","pageTblDevices","pageOsCommand"];
	var lang=["","en","fr","it"];
	var prefix = "/port_3480/data_request?id=lr_ALTUI_Handler&command=home&";
	
	var LocalHome = get_device_state(deviceID,  altui_Svs, 'LocalHome',1);
	if (LocalHome.startsWith(prefix) != true )
		LocalHome=prefix;

	var inits = {};
	jQuery.each(LocalHome.substr(prefix.length,99).split('&'), function(i,opt) {
		var splits = opt.split('=');
		inits[splits[0]]=splits[1]
	});
	
	return "<div class='form-inline' id='altui_urloptions'>"+_buildSelect("home",home,inits.home)
	+_buildSelect("lang",lang,inits.lang)
	+_buildSelect("layout",layout,inits.layout)
	+ALTUI_VeraUtils.altui_format('<label for="altui_nPage">Page Number:</label><input class="form-control" type="number" id="altui_nPage" min="0" max="15" value="{0}"></input>',inits.nPage||"")
	+"</div>";
}

function altui_Settings(deviceID) {
	// first determine if it is a child device or not
	//var device = findDeviceIdx(deviceID);
	//var debug  = get_device_state(deviceID,  altui_Svs, 'Debug',1);
	//var root = (device!=null) && (jsonp.ud.devices[device].id_parent==0);
  var present  = get_device_state(deviceID,  altui_Svs, 'Present',1);
	var ipaddr = ALTUI_VeraUtils.findDeviceIP(deviceID);
	var config = get_device_state(deviceID,  altui_Svs, 'PluginConfig',1);
	var themecss = get_device_state(deviceID,  altui_Svs, 'ThemeCSS',1);
	var background = get_device_state(deviceID,  altui_Svs, 'BackgroundImg',1);
	var imgpath = get_device_state(deviceID,  altui_Svs, 'ImagePath',1);
	var localhome = get_device_state(deviceID,  altui_Svs, 'LocalHome',1);
	var localcdn = get_device_state(deviceID,  altui_Svs, 'LocalCDN',1);
	var localbootstrap = get_device_state(deviceID,  altui_Svs, 'LocalBootstrap',1);
	var extraCtrl = get_device_state(deviceID,  altui_Svs, 'ExtraController',1);
	var remoteUrl = get_device_state(deviceID,  altui_Svs, 'RemoteAccess',1);
	var apiKey = get_device_state(deviceID,  altui_Svs, 'VoiceRSS_KEY',1);
	var apiLang = get_device_state(deviceID,  altui_Svs, 'VoiceRSS_lang',1);
	var emonCMS = get_device_state(deviceID,  altui_Svs, 'EmonCmsUrl',1);
	var style='	<style>\
	  table.altui_table td:first-child {\
		width: 140px;\
	  }\
	  input.altui-ui-input {\
		width: 440px;\
	  }\
	  hr.altui_hr {\
		border: 0;\
		color: grey;\
		margin-top: 5px;\
		margin-bottom: 5px;\
		background-color: grey;\
		height: 1px;\
	  }\
	  </style>';

	var htmlOpenLocal= '<button class="btn btn-secondary btn-sm" id="altui-open-local">Local</button>';
	var htmlHome = '<span id="altui-home" class="altui-ui-input" ></span>';
	var htmlRemote= '<button class="btn btn-secondary btn-sm" id="altui-open-remote">Remote</button>';
	var htmlConfig = '<textarea id="altui-config" rows="6" cols="70"></textarea>';
	var htmlTheme = '<input id="altui-theme" class="altui-ui-input form-control" placeholder="Url to download a theme css"></input>';
	var htmlBackground = '<input id="altui-background-js" class="altui-ui-input form-control" placeholder="Url to download a background image"></input>';
	var htmlImagePath = '<input id="altui-imgpath" class="altui-ui-input form-control" placeholder="Relative Url to MyHome Images"></input>';
	var htmlCDN = '<input id="altui-cdn" class="altui-ui-input form-control" placeholder="optional localcdn pathname, uses internet otherwise"></input>';
	var htmlBootstrap = '<input id="altui-localbootstrap" class="altui-ui-input form-control" placeholder="optional local bootstrap relative url, use internet otherwise"></input>';
	var htmlCTRL = '<input id="altui-ctrl" class="altui-ui-input form-control" placeholder="Comma separated list of ip_addr for extra controllers"></input>';
	var htmlApiKey = '<input id="altui-apikey" class="altui-ui-input form-control" placeholder="Your VoiceRSS API Key"></input>';
	var htmlApiLang = '<input id="altui-apilang" class="altui-ui-input form-control" placeholder="Your VoiceRSS Lang selection"></input>';
	var htmlEmonCMS = '<input id="altui-emoncms" class="altui-ui-input form-control" placeholder="default url : emoncms.org"></input>'
	var htmlSetConfig= '<button class="btn btn-secondary btn-sm" id="altui-setconfig">Set Configuration</button>';
	var htmlResetConfig= '<button class="btn btn-secondary btn-sm" id="altui-resetconfig">Default Configuration</button>';
	var htmlUrlOptions = altui_buildUrlOptions(deviceID)
	var html =
		style+
		'<div class="pane" id="pane"> '+ 
		'<table class="altui_table" id="altui_table">'+
		'<tr><td>Open</td><td> <div class="btn-group">'+htmlOpenLocal+htmlRemote+'</div> </td></tr>' +
		'<tr><td>Home Page Controls</td><td>'+htmlUrlOptions+'</td></tr>' +
		//'<tr><td>url options</td><td><ul><li><b>home</b>=(pageHome , pageRooms , pageDevices , pageScenes , pageSceneEdit , pagePlugins , pageUsePages , pageEditPages , pageCredits , pageLuaTest , pageLuaStart , pageOptions , pageEditor , pageZwave , pageLocalization , pagePower , pageChildren , pageRoutes , pageQuality , pageTblDevices , pageOsCommand)</li><li><b>lang</b>=(en , fr , it)</li><li><b>Layout</b>=lean</li><li><b>nPage</b>=nnn</li></ul></td></tr>' +
		'<tr><td>Home Page Url</td><td> '+htmlHome+' </td></tr>' +
		'<tr><td>Extra Controllers</td><td> '+htmlCTRL+' </td></tr>' +
		'<tr><td>Voice RSS API Key for TTS support</td><td> '+htmlApiKey+' </td></tr>' +
		'<tr><td>Voice RSS <a href="http://www.voicerss.org/api/documentation.aspx" target="_blank">Language code</a></td><td> '+htmlApiLang+' </td></tr>' +
		'<tr><td>MyHome Image Path</td><td> '+htmlImagePath+' </td></tr>' +		
		'<tr><td>Background Image</td><td> '+htmlBackground+' </td></tr>' +
		'<tr><td>Theme</td><td> '+htmlTheme+' </td></tr>' +
		'<tr><td>Local Bootstrap ?</td><td> '+htmlBootstrap+' </td></tr>' +
		'<tr><td>Local CDN ?</td><td> '+htmlCDN+' </td></tr>' +
		'<tr><td>EmonCMS Url</td><td> '+htmlEmonCMS+' </td></tr>' +
		'<tr><td>Config</td><td> '+htmlConfig+' </td></tr>' +
		'<tr><td>Actions</td><td> '+htmlSetConfig+htmlResetConfig+' </td></tr>' +
		'</table>'+
		'</div>' ;

	//html = html + '<button id="button_save" type="button">Save</button>'
	set_panel_html(html);
	jQuery( "#altui-theme" ).val(themecss);
	jQuery( "#altui-background-js" ).val(background);	
	jQuery( "#altui-imgpath" ).val(imgpath);	
	jQuery( "#altui-home" ).text(localhome);
	jQuery( "#altui-cdn" ).val(localcdn);
	jQuery( "#altui-localbootstrap" ).val(localbootstrap);
	jQuery( "#altui-ctrl" ).val(extraCtrl);
	jQuery( "#altui-apikey" ).val(apiKey);
	jQuery( "#altui-apilang" ).val(apiLang);
	jQuery( "#altui-emoncms" ).val(emonCMS);
	//
	// test isregistered
	//
	jQuery( "#altui-config" ).text( ALTUI_VeraUtils.beautify(config) );
	jQuery( "#altui-theme" ).text( themecss ).change( function() {
		var themecss = jQuery(this).val()+' ';
		saveVar(deviceID,  altui_Svs, "ThemeCSS", themecss, true);
	});
	jQuery( "#altui-background-js" ).text( background ).change( function() {
		var background = jQuery(this).val()+' ';
		saveVar(deviceID,  altui_Svs, "BackgroundImg", background, true);
	});
	jQuery( "#altui-imgpath" ).text( imgpath ).change( function() {
		var imgpath = jQuery(this).val()+' ';
		saveVar(deviceID,  altui_Svs, "ImagePath", imgpath, true);
	});
	jQuery( "#altui_home,#altui_lang,#altui_layout,#altui_nPage" ).change( function() {
		var options=[]
		jQuery.each( jQuery("#altui_urloptions").children(), function(i, item) {
			var id = $(item).prop('id').substr("altui_".length,99);
			if (id) {
				var val = $(item).val();
				if (val !="")
					options.push(ALTUI_VeraUtils.altui_format("{0}={1}",id,val));
			}
		});
		var url = data_command_url + "id=lr_ALTUI_Handler&command=home&"+options.join('&')
		saveVar(deviceID,  altui_Svs, "LocalHome", url, true)
		jQuery("#altui-home").text(url)
	});
	jQuery( "#altui-cdn" ).change( function() {
		var cdn = jQuery(this).val();
		saveVar(deviceID,  altui_Svs, "LocalCDN", cdn, true);
	});
	jQuery( "#altui-localbootstrap" ).change( function() {
		var bootstrap = jQuery(this).val();
		saveVar(deviceID,  altui_Svs, "LocalBootstrap", bootstrap, true);
	});
	jQuery( "#altui-ctrl" ).change( function() {
		var ctrl = jQuery(this).val();
		saveVar(deviceID,  altui_Svs, "ExtraController", ctrl, true);
	});
	jQuery( "#altui-apikey" ).change( function() {
		var apikey = jQuery(this).val();
		saveVar(deviceID,  altui_Svs, "VoiceRSS_KEY", apikey, true);
	});
	jQuery( "#altui-apilang" ).change( function() {
		var apikey = jQuery(this).val();
		saveVar(deviceID,  altui_Svs, "VoiceRSS_lang", apikey, true);
	});
	jQuery( "#altui-open-remote" ).click(function() {
		window.open( remoteUrl, '_blank');
	});
	if (window.location.hostname.indexOf("relay")!=-1) {
		jQuery( "#altui-open-local" ).remove();
	} else {
		jQuery( "#altui-open-local" ).click(function() { return altui_onOpenLocalButton(deviceID) });	
	}
	jQuery( "#altui-setconfig" ).click(function() {
		var varVal = jQuery( "#altui-config" ).val();
		saveVar(deviceID,  altui_Svs, 'PluginConfig', varVal, true)
	});
	jQuery( "#altui-emoncms" ).change(function() {
		var varVal = jQuery( this ).val();
		saveVar(deviceID,  altui_Svs, 'EmonCmsUrl', varVal, true)
	});

	jQuery( "#altui-resetconfig" ).click(function() {
		var url = ALTUI_VeraUtils.buildUPnPActionUrl(deviceID,altui_Svs,'Reset');
		jQuery.ajax({
			type: "GET",
			url: url,
			cache: false,
		}).done(function(data) {
			jQuery( "#altui-config" ).val( ALTUI_VeraUtils.beautify( data["u:ResetResponse"].PluginConfig ) )
		}).fail(function() {
			alert('Reset Failed!');
		});
	});
}

function altui_AfterInit(deviceID) {
	var i=0;
	var htmlOpenLocal= '<h3>ALTUI Home Page</h3><button class="btn btn-secondary btn-sm" id="altui-open-local">Open</button><h3>Settings</h3>';
	if (altui_api)
		altui_api.setCpanelContent("<div>"+htmlOpenLocal+"</div>");	
	else
		set_panel_html("<div>"+htmlOpenLocal+"</div>")
	jQuery( "#altui-open-local" ).click(function() { return altui_onOpenLocalButton(deviceID) });	
}

//-------------------------------------------------------------
// Save functions
//-------------------------------------------------------------	


//-------------------------------------------------------------
// Pattern Matching functions
//-------------------------------------------------------------	

//-------------------------------------------------------------
// Variable saving ( log , then full save )
//-------------------------------------------------------------
function saveVar(deviceID,  service, varName, varVal, reload)
{
	//set_device_state (deviceID, service, varName, varVal, 0);	// only updated at time of luup restart
	set_device_state (deviceID, altui_Svs, varName, varVal, (reload==true) ? 0 : 1);	// lost in case of luup restart
}





