//# sourceURL=J_ALTUI_utils.js
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

//
// jQuery plugin amg0: dynamic pagination
//
(function ( $ ) {
	$.fn.Pager = function( options )
	{
		// options.
		$.fn.Pager.settings = $.extend( {}, $.fn.Pager.defaults, options );

		// Go through the matched elements and return the jQuery object.
		return this.each( function() {
			var id = $(this).prop('id')
			var items =""
			var cur = $.fn.Pager.settings.curpage;
			var max = Math.min( $.fn.Pager.settings.maxpages , cur+Math.floor($.fn.Pager.settings.batchpages/2));
			var min = Math.max( 1, cur-Math.floor($.fn.Pager.settings.batchpages/2))
			for( var i=min; i<=max; i++ ) {
				items += '<li class="'+id+'page page-item '+((i==cur) ? 'active' : '' ) +'"><a class="page-link" href="javascript:return false">'+i+'</a></li>'
			}
			var html = `
				<nav aria-label="Page navigation">
				  <ul class="pagination `+(($.fn.Pager.settings.large==true) ? 'pagination-lg' : '' )+`">
					<li class="page-item `+((cur<=1) ? 'disabled' : '' )+`">
					  <a id='`+id+`start' class="page-link" href="javascript:return false" aria-label="Previous">
						<span aria-hidden="true">&laquo;</span>
						<span class="sr-only">Start</span>
					  </a>
					</li>
					<li class="page-item `+((cur<=1) ? 'disabled' : '' )+`">
					  <a id='`+id+`prev' class="page-link" href="javascript:return false" aria-label="Previous">
						<span aria-hidden="true">&lt;</span>
						<span class="sr-only">Previous</span>
					  </a>
					</li>` + items + `
					<li class="page-item `+((cur>=max) ? 'disabled' : '') +`">
					  <a id='`+id+`next' class="page-link" href="javascript:return false" aria-label="Next">
						<span aria-hidden="true">&gt;</span>
						<span class="sr-only">Next</span>
					  </a>
					</li>
					<li class="page-item `+((cur>=max) ? 'disabled' : '') +`">
					  <a id='`+id+`end' class="page-link" href="javascript:return false" aria-label="Next">
						<span aria-hidden="true">&raquo;</span>
						<span class="sr-only">End</span>
					  </a>
					</li>
				  </ul>
				</nav>`
			$(this).html(html);
			$(this)
			.on('click','#'+id+'start',function(e) {
				if ($.isFunction($.fn.Pager.settings.onprev)) {
					($.fn.Pager.settings.onstart)(e)
				}
				return false;
			})
			.on('click','#'+id+'end',function(e) {
				if ($.isFunction($.fn.Pager.settings.onnext)) {
					($.fn.Pager.settings.onend)(e)
				}
				return false;
			})
			.on('click','#'+id+'prev',function(e) {
				if ($.isFunction($.fn.Pager.settings.onprev)) {
					($.fn.Pager.settings.onprev)(e)
				}
				return false;
			})
			.on('click','#'+id+'next',function(e) {
				if ($.isFunction($.fn.Pager.settings.onnext)) {
					($.fn.Pager.settings.onnext)(e)
				}
				return false;
			})
			.on('click','.'+id+'page',function(e) {
				if ($.isFunction($.fn.Pager.settings.onpage)) {
					var str = $(this).find("a").text();
					($.fn.Pager.settings.onpage)(e,str);
				}
				return false;
			})
		});
	};
	// Public defaults and settings.
	$.fn.Pager.defaults = {
		large: false,
		maxpages: 1,
		curpage: 1,
		batchpages: 5,
		onstart: null,
		onnext: null,
		onprev: null,
		onend: null,
		onpage: null
	};
	$.fn.Pager.settings = { };


	// Private functions.
	function myFunc()
	{
		return;
	};
	// Public functions.
	$.fn.Pager.func = function()
	{
		return;
	};
})(jQuery);


function getQueryStringValue (key) {
  return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

function isIE11() {
	var ie11andabove = navigator.userAgent.indexOf('Trident') != -1 && navigator.userAgent.indexOf('MSIE') == -1 // IE11 or above Boolean
	return ie11andabove;
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
	return v.toString(16);
  });
}

function toHex2(d) {
	return	("000"+(parseInt(d).toString(16))).slice(-4).toUpperCase()
}
function toHex(d) {
	return	("0"+(parseInt(d).toString(16))).slice(-2).toUpperCase()
}
function fromHex(v) {
	return parseInt(v, 16).toString(10)
}

function Altui_SelectText(element) {
	var doc = document;
	var text = doc.getElementById(element);
	if (doc.body.createTextRange) { // ms
		var range = doc.body.createTextRange();
		range.moveToElementText(text);
		range.select();
	} else if (window.getSelection) {
		var selection = window.getSelection();
		var range = doc.createRange();
		range.selectNodeContents(text);
		selection.removeAllRanges();
		selection.addRange(range);

	}
};

function Altui_LoadStyle(styleFunctionName) {
	// var head = document.getElementsByTagName('head')[0];
	// var style = document.createElement('style');
	// style.type = 'text/css';
	// var css = Altui_ExecuteFunctionByName(styleFunctionName, window);
	// style.appendChild(document.createTextNode(css));
	// head.appendChild(style);

	var title = document.getElementsByTagName('title')[0];
	var style = document.createElement('style');
	style.type = 'text/css';
	// var css = $.isFunction(styleFunctionNameOrCss) ?	 Altui_ExecuteFunctionByName(styleFunctionName, window) : styleFunctionNameOrCss;
	var css =  Altui_ExecuteFunctionByName(styleFunctionName, window)
	style.appendChild(document.createTextNode(css));
	title.parentNode.insertBefore(style,title);
};

function Altui_ExecuteFunctionByName(functionName, context , device, extraparam) {
	var namespaces = functionName.split(".");
	var func = namespaces.pop();
	for (var i = 0; i < namespaces.length; i++) {
		context = context[namespaces[i]];
		if ( context == undefined ) {
			var str = "the module or function "+functionName+" does not exist, check your configuration"
			console.warn(str)
			setTimeout( function() {
				PageMessage.message(str,"warning");
			},3000);
		}
	}
	return context ? context[func].call(context, device, extraparam) : null
};

// 0:modeid 1:modetext 2:modeclss for bitmap 3:preset_unselected or preset_selected
var houseModeButtonTemplate = "	 <button type='button' class='btn btn-light altui-housemode'><div>{1}</div><div id='altui-mode{0}' class='{2} {3} housemode'></div></button>";
var leftNavButtonTemplate = "<button id='{0}' data-altuiid='{1}' type='button' class='altui-leftbutton btn btn-light'>{2}</button>";
var glyphTemplate = '<i class="fa fa-{0} {2}" aria-hidden="true" title="{1}"></i>'

var ALTUI_Templates = null;
var ALTUI_Templates_Factory= function() {
	var _dropdownTemplate =	 "";
	_dropdownTemplate +=  "<div class='btn-group pull-right'>";
	_dropdownTemplate += "<button class='btn btn-light btn-sm dropdown-toggle altui-device-command' type='button' data-toggle='dropdown' aria-expanded='false'>";
	_dropdownTemplate += "</button>";
	_dropdownTemplate += "<div class='dropdown-menu dropdown-menu-right' role='menu'>";
	_dropdownTemplate += "<a id='altui-device-variables' class='dropdown-item' data-altuiid='{0}' href='#' role='menuitem'>Variables</a>";
	_dropdownTemplate += "<a id='altui-device-actions' class='dropdown-item ' data-altuiid='{0}' href='#' role='menuitem'>Actions</a>";
	_dropdownTemplate += "<a id='{0}' class='dropdown-item altui-device-controlpanelitem' href='#' role='menuitem'>Control Panel</a>";
	_dropdownTemplate += "<a id='{0}' class='dropdown-item altui-device-hideshowtoggle' href='#' role='menuitem'>{1}</a>";
	_dropdownTemplate += "</div></div>";
	_dropdownTemplate += "<div class='pull-right text-muted'><small>#{0} </small></div>";

	var _batteryHtmlTemplate="";
	_batteryHtmlTemplate+="<div class='altui-battery progress pull-right' style='width: 35px; height: 15px;'>";
	_batteryHtmlTemplate+="	 <div class='progress-bar {1}' role='progressbar' aria-valuenow='60' aria-valuemin='0' aria-valuemax='100' style='min-width: 0.1em; width: {0}%;'>";
	_batteryHtmlTemplate+="	   {0}%";
	_batteryHtmlTemplate+="	 </div>";
	_batteryHtmlTemplate+="</div>";

	var _devicecontainerTemplate	= "<div class='card altui-device' data-altuiid='{5}' id='{0}'>"
		_devicecontainerTemplate	+=		"<div class='card-header bg-{4} altui-device-heading'>{6} {7}<div class='card-title altui-device-title' data-toggle='tooltip' data-placement='left' title='{2}'>{1}</div></div>";
		_devicecontainerTemplate	+=		"<div class='card-body altui-device-body'>";
		_devicecontainerTemplate	+=		"{8}{3}";
		_devicecontainerTemplate	+=		"</div>";
		_devicecontainerTemplate	+=		"<div class='card-footer altui-device-message bg-{4} {9}'>{10}</div>";
	_devicecontainerTemplate	+=	  "</div>";

	var _deviceEmptyContainerTemplate="<div class=' {2} '>";
		_deviceEmptyContainerTemplate	+=		"<div class='card xxx altui-device' data-altuiid='{1}' id='{0}'>"
		_deviceEmptyContainerTemplate	+=		"</div>";
		_deviceEmptyContainerTemplate	+=	"</div>";

	// 0: variable , 1: value , 2: service , 3: id, 4: push btn color class, 5: watch provider name
	var _deviceVariableLineTemplate = "	 <tr>";
		// deviceVariableLineTemplate += "		   <th scope='row'>1</th>";
		_deviceVariableLineTemplate += "		 <td class='altui-variable-title'><span title='{2}'>{0}</span></td>";
		_deviceVariableLineTemplate +=	("<td class='altui-variable-buttons'>"+
			'<div class="btn-group" role="group" aria-label="variable commands">' +
			smallbuttonTemplate.format( '{3}', 'altui-variable-history', glyphTemplate.format( "calendar", _T("History"), "" ),_T('History'))+
			smallbuttonTemplate.replace('btn-light','').format( '{3}', 'altui-variable-push {4}', glyphTemplate.format( "signal", _T("Push to {5}"), "" ),_T("Push to {5}"))+
			smallbuttonTemplate.format( '{3}', 'altui-variable-delete', deleteGlyph,_T('Delete'))+
			"</div></td>");
		_deviceVariableLineTemplate += "		 <td id='{3}' class='altui-variable-value' >{1}</td>";
		_deviceVariableLineTemplate += "	 </tr>";

	// 0:bootgrid classes 1:altuiid 2:htmlid 3: name 4:right header buttons 5:panel body 6:left header buttons
	var _workflowContainerTemplate=		"<div class='{0} '>";
		_workflowContainerTemplate	+=		"<div class='card xxx altui-workflow' data-altuiid='{1}' id='{2}'>"
		_workflowContainerTemplate	+=		"<div class='card-header altui-workflow-heading'>{4}<div class='text-muted pull-right'> <small>#{1}</small></div><div>{6} <span class='altui-workflow-title-name'><small>{3}</small></span></div>  "
		_workflowContainerTemplate	+=		"</div>";
		_workflowContainerTemplate	+=		"<div class='card-body altui-workflow-body'>{5}"
		_workflowContainerTemplate	+=		"<div class='altui-active-state-name'></div>";
		_workflowContainerTemplate	+=		"</div>";
		_workflowContainerTemplate	+=		"</div>";
		_workflowContainerTemplate	+=	"</div>";

	var _wattTemplate="<div class='altui-watts '>{0} <span class='altui-watts-unit'>{1}</span></div>";
	return {
		wattTemplate : _wattTemplate,
		deviceVariableLineTemplate : _deviceVariableLineTemplate,
		dropdownTemplate : _dropdownTemplate,
		batteryHtmlTemplate : _batteryHtmlTemplate,
		devicecontainerTemplate : _devicecontainerTemplate,
		deviceEmptyContainerTemplate : _deviceEmptyContainerTemplate,
		workflowContainerTemplate: _workflowContainerTemplate,
	};
};

var Localization = ( function (undefined) {
	var _brandingCallback = null;
	var _unknown_terms = {};
	var _terms = {};

	var __T =  function(t) {
		var v =_terms[t]
		if (v)
			return v;
		_unknown_terms[t] = t;
		return t;
	};

	var _initTerms = function(terms) {
		_terms = $.extend(_terms,terms);
		_unknown_terms = {};
	};

	var _dumpTerms = function() {
		var text = "browser query:{3} userlanguage:{0} language:{1}\n Unknown terms:{2}".format(
			window.navigator.userLanguage || "",
			window.navigator.language || "",
			JSON.stringify(_unknown_terms),
			getQueryStringValue("lang")
		);
		UIManager.pageEditorForm($(".altui-mainpanel"),'altui-page-editor',_T("Localization information"),text,null,_T("Close"),function() {
			UIManager.pageHome();
		});
	};
	function _setTitle(title) {
		$("title").text(title);
	};
	function _forceOption(name,value) {
		UIManager.forceOption(name,value);
	};
	return {
		_T : __T,
		init : _initTerms,
		dump : _dumpTerms,
		setTitle : _setTitle,	// (str)
		forceOption : _forceOption,	// (name, value)
		setBrandingCallback : function(cb) { _brandingCallback =  $.isFunction(cb) ? cb : null	},	// func
		setRegistration : function(b) { ALTUI_registered = b;	},
		doBranding : function() {
			if ($.isFunction(_brandingCallback)) { (_brandingCallback)() }
		}
	}
})();

var _T = Localization._T;

//=====================================================================
// Scene Editor
//=====================================================================
//action "{"device":4,"service":"urn:upnp-org:serviceId:altui1","action":"SetDebug","arguments":[{"name":"newDebugMode","value":"1"}]}"
//helper formatting functions
function _displayDeviceName(controller,deviceid) {
	var device = MultiBox.isAltuiid(deviceid) ? MultiBox.getDeviceByAltuiID(deviceid) : MultiBox.getDeviceByID(controller,deviceid);
	return (device==null) ? 'invalid device' : (device.name + "<small class='text-muted'> (#"+device.altuiid+")</small>");
};

function _formatAction(controller,action) {
	function _displayArguments(Thearguments) {
		var html=[];
		$.each(Thearguments, function(idx,arg) {
			html.push("{0}: {1}".format( arg.name, arg.value));
		});
		return html.join(',');
	};
	return {
		device:_displayDeviceName(controller,action.device),
		action:action.action,
		arguments:_displayArguments(action.arguments)
	}
};

function _findEventFromTriggerTemplate(device,template)
{
	var static_data = MultiBox.getDeviceStaticData(device);
	var event = null;
	if (static_data)
		$.each(static_data.eventList2, function( idx,e) {
			if (e.id == template) {
				event = e;
				return false;
			}
		});
	return event;
};

function _formatTrigger(controller,trigger)
{
	var line = {};
	var deviceid = trigger.device;
	var device = MultiBox.getDeviceByID(controller,deviceid);
	var event = _findEventFromTriggerTemplate( device, trigger.template );
	line.name = trigger.name;
	line.device = device.name + "<small class='text-muted'> (#"+device.altuiid+")</small>";
	line.descr = event.label.text.replace("_DEVICE_NAME_","<b>"+device.name+"</b>");
	line.condition = "";
	line.lastrun = trigger.last_run ? _toIso(new Date(trigger.last_run*1000)," ") : "";

	if (trigger.arguments && event.argumentList)  {
		var condarr = []
		$.each(trigger.arguments, function( idx,argument) {
			var id = argument.id;
			var eventargtemplate = null;
			$.each(event.argumentList, function(idx,eventarg) {
				if (eventarg.id==id)
				{
					var value = (argument.value !=undefined) ? argument.value : eventarg.defaultValue;
					if (eventarg.allowedValueList) {
						$.each(eventarg.allowedValueList,function(j,possiblevalue) {
							$.each(possiblevalue,function(k,v) {
								if (k != "HumanFriendlyText") {
									if	( (v == value) && (possiblevalue.HumanFriendlyText!=undefined) ) {
										value = possiblevalue.HumanFriendlyText.text.replace("_DEVICE_NAME_","<b>"+device.name+"</b>").replace("_ARGUMENT_VALUE_",value)
									}
								}
							});
						});
					} else if (eventarg.HumanFriendlyText && eventarg.HumanFriendlyText.text)
						line.descr = eventarg.HumanFriendlyText.text.replace("_DEVICE_NAME_","<b>"+device.name+"</b>").replace("_ARGUMENT_VALUE_",value)
						condarr.push( "{0} {1} {2}".format(
							eventarg.name,
							eventarg.comparisson,
							value )
						);
					return false;	// we had a match
				}
			});
		});
		line.condition = condarr.join(", ")
	} else {
		var lines = [];
		if (event.serviceStateTable)
			$.each(event.serviceStateTable, function(key,serviceState){
				lines.push("{0} {1} {2}".format( key, serviceState.comparisson, serviceState.value));
			});
		line.condition += lines.join(" AND ");
	}

	return line;
};


var HouseModeEditor = (function() {
	function _displayModes3(htmlid,cls,modes) {
		var html="";
		var template = `<div id='altui-mode\${id}' class='altui-housemode3'>
							<div class='altui-favorites-title text-truncate'><small class='text-info'>\${text}</small></div>
							<div class='altui-housemodeglyph'>
								<i class='fa \${glyph}' aria-hidden='true'></i>
							</div>
						</div>`;
		var _tmpFunc = _.template(template)
		$.each(_HouseModes, function(idx,mode) {
			html += (_tmpFunc)(mode)
		});
		return html;
	};
	// function _displayModes2(htmlid,cls,modes) {
	// 	var tmpl = "<button type='button' class='btn btn-light altui-housemode2'><div>{1}</div><div id='altui-mode{0}' class='{2} {3} housemode'></div></button>"
	// 	var html ="<div class='housemode2'>";
	// 			$.each(_HouseModes, function(idx,mode) {
	// 				var select = ($.inArray( mode.id.toString(), modes) == -1) ? "housemode2_unselected" : "housemode2_selected";
	// 				html += "<div id='altui-mode{3}' class='altui-housemode2 pull-left {1} {2}'><div class='altui-housemode2-content'><small class='text-muted'>{0}</small><div class='altui-housemode-countdown'></div></div></div>".format( mode.text, mode.cls, select, mode.id);
	// 			});
	// 	html+="</div>";
	// 	return html;
	// };
	function _displayModes(htmlid,cls,modes) {
		var html ="";
		html += "<div class='btn-group {1}' id='{0}'>".format(htmlid,cls);
		$.each(_HouseModes, function(idx,mode) {
			var select = ($.inArray( mode.id.toString(), modes) == -1) ? "preset_unselected" : "preset_selected";
			html += (houseModeButtonTemplate.format(mode.id, mode.text, mode.cls, select));
		});
		html+="</div>";
		return html;
	};
	function _runActions( domroot, onclickCB ) {
		$(domroot)
			.off("click",".altui-housemode")
			.on("click",".altui-housemode",function(){
				var div = $(this).find("div.housemode");
				if (div.hasClass("preset_selected"))
					div.removeClass("preset_selected").addClass("preset_unselected");
				else
					div.removeClass("preset_unselected").addClass("preset_selected");
				if ($.isFunction(onclickCB))
					(onclickCB)($(this) )		// showsaveneeded() for instance
			})
	};
	function _getSelectedLabels() {
		var html = $.map( $("div.housemode.preset_selected") , function(elem,idx) {
			var id = parseInt( $(elem).prop('id').substring("altui-mode".length) ) - 1;
			return _HouseModes[ id ].text;
		}).join(",");
		return html;
	};
	function _getSelectedModes() {
		var selectedmode = $(".altui-housemode div.preset_selected");
		if (selectedmode.length==0)
			return "0";
		return $.map( selectedmode, function(elem,idx) {
					return $(elem).prop('id').substring("altui-mode".length);
				}).join(",");
	};
	return {
		displayModes : _displayModes,
		// displayModes2 : _displayModes2,
		displayModes3 : _displayModes3,
		runActions : _runActions,					// ( domroot, onclickCB )
		getSelectedLabels : _getSelectedLabels,
		getSelectedModes : _getSelectedModes
	}
})();

var SpeechManager = (function() {
	var recognition = null;
	var final_transcript = [];
	var started = false;
	var _execute_callback = null;
	var _rules = null;
	var timer = null;
	var timer_duration = 3000;

	function _clearTimer() {
		if (timer) {
			clearTimeout(timer)
			timer=false
		}
	}
	function _setTimer() {
		_clearTimer();
		timer = setTimeout(function() {
			if (started==true)
				recognition.stop();
		},timer_duration);
	}

	if (typeof(webkitSpeechRecognition) !=undefined ) {
		// Save a reference to the global object (window in the browser)
		var root = this;

		// Get the SpeechRecognition object, while handling browser prefixes
		var SpeechRecognition = root.SpeechRecognition ||
			root.webkitSpeechRecognition ||
			root.mozSpeechRecognition ||
			root.msSpeechRecognition ||
			root.oSpeechRecognition;

		// Check browser support
		// This is done as early as possible, to make it as fast as possible for unsupported browsers
		if (SpeechRecognition!=null) {
			recognition = new SpeechRecognition();
			recognition.continuous = true;
			recognition.interimResults = true;

			recognition.onstart = function() {
				$("#altui-speech-button").addClass('btn-danger').removeClass('btn-light');
				started = true;
				_setTimer();
			}
			recognition.onerror = function(event) {
				PageMessage.message(_T("HTML5 Speech Recognition reported an error: "+event.error),"info");
				started = false;
				_clearTimer();
			}
			recognition.onend = function() {
				started = false;
				_clearTimer();
				$("#altui-speech-button").removeClass('btn-danger').addClass('btn-light');
				$("#altui-speech-text").html("");
				//onExecuteResults();
				final_transcript = [];
			}
			recognition.onresult = function(event) {
				_clearTimer();
				var interim_transcript = '';
				for (var i = event.resultIndex; i < event.results.length; ++i) {
				  if (event.results[i].isFinal) {
					  var cmd = event.results[i][0].transcript.trim();
					final_transcript.push( cmd );
					onExecuteResults(cmd);
				  } else {
					interim_transcript += event.results[i][0].transcript;
				  }
				}
				$("#altui-speech-text").html("{0},<span class='text-muted'>{1}</span>".format(final_transcript.join(","),interim_transcript));
				_setTimer();
			}
		} else {
			console.log("ALTUI:HTML5 Speech Recognition (xxxSpeechRecognition) not supported in this browser");
		}
	} else {
			console.log("ALTUI:HTML5 Speech Recognition (webkitSpeechRecognition) not supported in this browser");
	};

	function onExecuteResults(cmd) {

		var name2AltuiID = {
			"device":$.map( MultiBox.getDevicesSync().filter( function(d) { return isNullOrEmpty(d.name) == false } ), function( device, idx) { return {name:_spochen(device.name), altuiid:device.altuiid} } ),
			"scene":$.map( MultiBox.getScenesSync(), function( scene, idx) { return {name:_spochen(scene.name), altuiid:scene.altuiid} } ),
			"room":$.map( MultiBox.getRoomsSync(), function( room, idx) { return {name:_spochen(room.name), altuiid:room.altuiid, orgname:room.name} } ),
			"altui":[
					{ name:_T("Device"), page:"pageDevices" },
					{ name:_T("Scene"), page:"pageScenes" },
					{ name:_T("Room"), page:"pageRooms" },
					{ name:_T("Custom Pages"), page:"pageUsePages" },
				]
		};

		function _spochen(stringToReplace) {
			stringToReplace = stringToReplace.toLowerCase();
			stringToReplace = stringToReplace.replace(/[_-]/g, ' ');
			stringToReplace = stringToReplace.replace(/[-[\]{}()*+?.,\\/^$|#]/g, '')
			// stringToReplace = stringToReplace.replace(/[^\w\s]/gi, '');
			return stringToReplace;
		}

		function _onExecuteCommand(command) {
			var execution_done = false;
			// search for a rule that matches
			$.each(_rules, function(idx,rule) {
				var rulestr = rule.r;
				var re = null;
				var namelist = name2AltuiID[ rule.t ];
				$.each(namelist, function (idx,possible) {
					re = new RegExp(rulestr.replace("%name%",possible.name), 'i');
					// console.log(re);
					// console.log(possible);
					if ((m = re.exec(command)) !== null) {
						if (m.index === re.lastIndex) {
							re.lastIndex++;
						}
						// View your result using the m-variable.
						// eg m[0] etc.
						switch(rule.t) {
							case "device":
								var device = MultiBox.getDeviceByAltuiID( possible.altuiid );
								MultiBox.runAction(device, rule.a.service, rule.a.action, JSON.parse(rule.a.params),function(result) {
									if (isNullOrEmpty(result))
										PageMessage.message(_T("the execution of the UPNP command failed"),"warning");
								});
								break;
							case "scene":
								MultiBox.runSceneByAltuiID(possible.altuiid);
								break;
							case "altui":
								window["UIManager"][possible.page]();	// call function by its name
								break;
							case "room":
								var id = possible.altuiid;
								UIManager.pageDevices({ room:[possible.orgname] });	// call function by its name
								break;
							default:
								AltuiDebug.warning("Invalid rule type %s",JSON.stringify(rule));
						}
						// execution was done, stop the loop
						execution_done = true;
						return false;
					}
				});
				return (execution_done != true)
			});
			if (execution_done==false)
				PageMessage.message(_T("could not find a match for voice command:{0}").format(command),"warning");
		}

		if (cmd==undefined )
			$.each(final_transcript,function(ifx,command) {
				_onExecuteCommand(command);
			});
		else
			_onExecuteCommand(cmd);
	};
	return {
		initRules : function( rules ) {
			_rules = $.extend( [] , rules );
		},
		init : function( lang, execute_callback ) {
			if (recognition==null) return;
			recognition.lang = lang;
			_execute_callback = execute_callback;
		},
		getGlyph: function() {
			return '<i class="fa fa-volume-up" aria-hidden="true"></i>';
		},
		getHtml: function() {
			if (recognition==null) return "";
			Html="";
			Html+="	<button id='altui-speech-button' class='btn btn-light {1}' type='button'>{0}</button>".format(
				SpeechManager.getGlyph(),
				(started==true) ? 'btn-danger' : ''
				);
			Html+="	<span id='altui-speech-text'></span>";
			return Html;
		},
		toggle: function() {
			if (recognition==null) return;
			try {
				if (started==true)
					recognition.stop();
				else
					recognition.start();
			} catch ( e ) {
				PageMessage.message(_T("HTML5 Speech Recognition raised an exception"),"warning");
			}
		}
	}
})();

var LuaEditor = (function () {
	//0: title // 1: Lua code to edit
	var luaEditorModalTemplate = "<div id='luaEditorModal' class='modal fade'>";
	luaEditorModalTemplate += "	 <div class='modal-dialog modal-lg'>";
	luaEditorModalTemplate += "	   <div class='modal-content'>";
	luaEditorModalTemplate += "		 <div class='modal-header'>";
	luaEditorModalTemplate += "		   <h5 class='modal-title'>{0}</h5>";
	luaEditorModalTemplate += "		   <button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>";
	luaEditorModalTemplate += "		 </div>";
	luaEditorModalTemplate += "		 <div class='modal-body'>";
	luaEditorModalTemplate += "			<div class='form-group'>";
	luaEditorModalTemplate += "				<label for='altui-editor-text'>{0}</label>";
	// luaEditorModalTemplate += "				<textarea id='altui-luacode-text' rows='10' class='form-control' placeholder='enter code here'>{0}</textarea>";
	luaEditorModalTemplate += "				<div id='altui-editor-text'>{1}</div>";
	luaEditorModalTemplate += "			</div>";
	luaEditorModalTemplate += "		 </div>";
	luaEditorModalTemplate += "		 <div class='modal-footer'>";
	// luaEditorModalTemplate += "		  <button type='button' class='btn btn-light' data-dismiss='modal'>"+_T("Close")+"</button>";
	// luaEditorModalTemplate += "		  <button type='button' class='btn btn-light altui-luacode-test' >"+_T("Test Code")+"</button>";
	// luaEditorModalTemplate += "		  <button type='button' class='btn btn-primary altui-luacode-save' data-dismiss='modal'>"+_T("Save Changes")+"</button>";
	luaEditorModalTemplate += "		 </div>";
	luaEditorModalTemplate += "	   </div><!-- /.modal-content -->";
	luaEditorModalTemplate += "	 </div><!-- /.modal-dialog -->";
	luaEditorModalTemplate += "</div><!-- /.modal -->";

	// $(".altui-mainpanel").append(luaEditorModalTemplate);

	return {
		openDialog: function(luacode, onSaveCB, language, options ) {
			// Set Proper defaults
			if (options==null) {
				options = { buttons:[ {label:_T("Test Code"), extraclass:'altui-luacode-test'} ]}
			}
			options = $.extend( true, { language: language || 'lua', title:_T("Lua Editor"), buttons:[] }, options);

			var dialog =  DialogManager.registerDialog( 'luaEditorModal', luaEditorModalTemplate.format( options.title, luacode ) )
			DialogManager.dlgAddDialogButton(dialog, false, _T("Close"), '', '',{ 'data-dismiss':'modal'} );
			$.each(options.buttons, function(idx,btn) {
				DialogManager.dlgAddDialogButton(dialog, btn.type=="submit", btn.label, btn.extraclass, btn.id, btn.extraattrs)
			});
			DialogManager.dlgAddDialogButton(dialog, true, _T("Save Changes"),'altui-luacode-save','',{ 'data-dismiss':'modal'});

			// ACE
			var editor = null;
			if (options.language != 'raw') {
				editor = ace.edit( "altui-editor-text" );
				editor.setTheme( "ace/theme/"+ (MyLocalStorage.getSettings("EditorTheme") || "monokai") );
				editor.getSession().setMode( "ace/mode/"+options.language);
				editor.setFontSize( MyLocalStorage.getSettings("EditorFontSize") );
			} else {
				var str = $("#altui-editor-text").text();
				$("#altui-editor-text").html("");
				$("#altui-editor-text").append("<textarea class='altui-editor-area'>{0}</textarea>".format(str.htmlEncode()))
			}
			// resize
			dialog.modal()
				.on('shown.bs.modal', function () {
					var widthparent = $("div#altui-editor-text").closest(".form-group").innerWidth();
					if (editor) {
						$("div#altui-editor-text").resizable({
							// containment: "parent",
							maxWidth:widthparent,
							stop: function( event, ui ) {
								if (editor)
									editor.resize();
							}
						});
					}
					if (options && $.isFunction(options.onDisplay)) {
						(options.onDisplay)(editor);
					}
				})
				.on("click touchend",".altui-luacode-test",function(){
					var lua = (editor) ? editor.getValue() : $("#altui-editor-text textarea").text();
					MultiBox.runLua(0,lua, function(result) {
						alert(JSON.stringify(result));
					});
				})
				.on("click touchend",".altui-luacode-save",function(){
					// Save Callback
					var code = (editor) ? editor.getValue() : $("#altui-editor-text textarea").val();
					onSaveCB(code);
				});

		}
	};
})();

var DialogManager = ( function() {
	var helpGlyph = '<i class="fa fa-question text-primary" aria-hidden="true" title="Help"></i>'
	// this method assumes htmlDialog id property is equal to 'name'
	function _registerDialog( name, htmlDialog ) {
		var dialog = $("div#dialogs div#"+name);
		if (dialog.length ==0)
			$("div#dialogs").append(htmlDialog);
		else
			$(dialog).replaceWith(htmlDialog);
		dialog = $("div#dialogs div#"+name);
		// remove all callbacks for now
		$(dialog).off();
		$("div#dialogs").off();
		return	dialog;
	};
	function _clearDialog( name ) {
		$("div#dialogs div#"+name).remove();
	}
	function _getActionParameterHtml( id, device, actionname, actiondescriptor, cbfunc )
	{
		if ($.isFunction( cbfunc )) {
			var Html="";
			var bFound = false;
			MultiBox.getDeviceActions(device,function( services ) {
				$.each(services, function(idx,service) {
					$.each(service.Actions, function(idx2,action) {
						if (action.name == actionname) {
							bFound = true;
							$.each(action.input, function(idx,param){
								var curvalue = actiondescriptor.params[param] || '';
								Html += ("	<label for='"+id+"-"+param+"'>"+param+"</label>");
								Html += ("	<input id='"+id+"-"+param+"' class='form-control' type='text' value='"+curvalue+"' placeholder='enter parameter value'></input>");
								// Html += ("	<input id='"+id+"-"+param+"' class='form-control' type='text' required value='"+curvalue+"' placeholder='enter parameter value'></input>");
							});
						}
						return !bFound;
					});
					return !bFound;
				});
				cbfunc("<div class='"+id+"'>"+Html+"</div>");
			});
		}
	};

	function _getDeviceServiceVariableSelect(device, service, variable, filterByServiceID) {
		// var device = MultiBox.getDeviceByID( deviceid );
		var select = $("<select id='altui-select-variable' class='form-control'></select>");
		if ((device!=null) && (device.altuiid!=NULL_DEVICE)) {
			$.each(device.states.sort(_sortByVariableName), function(idx,state) {
				if ((filterByServiceID==null) || (filterByServiceID==state.service)) {
					select.append("<option value='{0}' {2}>{1}</option>".format(
						state.id,
						state.variable + " : ("+state.service+")",
						(service==state.service) && (variable==state.variable)? 'selected' : ''));
				}
			});
		}
		return select.wrap( "<div></div>" ).parent().html();
	};

	function _getDeviceActionSelect(id, device, actiondescriptor, filterByServiceID, cbfunc) {
		MultiBox.getDeviceActions(device,function( services ) {
			var select = $("<select required id='"+id+"' class='form-control'></select>");
			select.append("<option value='0' {0}>Select ...</option>".format( actiondescriptor.action==''? 'selected' : ''));
			$.each(services, function(idx,service) {
				if ((filterByServiceID==null) || (filterByServiceID==service.ServiceId)) {
					var group = $("<optgroup label='"+service.ServiceId+"'></optgroup>");
					$.each(service.Actions, function(idx2,action) {
						var selected = "";
						if ((actiondescriptor.action==action.name) && (actiondescriptor.service==service.ServiceId))
							selected = 'selected';

						group.append("<option value='{0}' {2}>{1}</option>".format(
							service.ServiceId+"."+action.name,
							action.name,
							selected));
					});
					select.append(group);
				}
			});

			_getActionParameterHtml( id+"-parameters",device, actiondescriptor.action, actiondescriptor, function(parameters){
				cbfunc( select.wrap( "<div></div>" ).parent().html() + parameters );
			});
		});
	};

	function _createSpinningDialog(message,glyph) {
				// 0: title, 1: body
		var glyph2 = glyph || '<i class="fa fa-spinner fa-pulse fa-3x fa-fw text-warning"></i><span class="sr-only">Loading...</span>'

		var defaultSpinDialogModalTemplate="";
		defaultSpinDialogModalTemplate = "<div id='dialogModal' class='modal' data-backdrop='static' data-keyboard='false'>";
		defaultSpinDialogModalTemplate += "	 <div class='modal-dialog modal-sm'>";
		defaultSpinDialogModalTemplate += "	   <div class='modal-content'>";
		defaultSpinDialogModalTemplate += "		 <div class='modal-body'>";
		defaultSpinDialogModalTemplate += "		 <div class='row justify-content-between'>";
		defaultSpinDialogModalTemplate += "		 <div class='col-2'>{0}</div> <div class='col-9'>{1}</div>";
		defaultSpinDialogModalTemplate += "		 </div>";
		defaultSpinDialogModalTemplate += "		 </div>";
		defaultSpinDialogModalTemplate += "	   </div><!-- /.modal-content -->";
		defaultSpinDialogModalTemplate += "	 </div><!-- /.modal-dialog -->";
		defaultSpinDialogModalTemplate += "</div><!-- /.modal -->";
		return DialogManager.registerDialog('dialogModal',defaultSpinDialogModalTemplate.format(
			glyph2,
			message || "")
		);
	};
	
	function _genericDialog(message,glyph,title,size,buttons,cbfunc) {
		var result = false;
		var dialog = DialogManager.registerDialog('dialogModal',
						defaultDialogModalTemplate.format( 'dialogModal',
								title,		// title
								message,	// body
								size,		// size
								glyph));		// icon
		$.each(buttons,function(i,button) {
			DialogManager.dlgAddDialogButton(dialog, button.isdefault, button.label, '', button.id , {  } );
		});

		$('div#dialogModal').modal({				// wire up the actual modal functionality and show the dialog
		  // "backdrop"  : "static",
		  "keyboard"  : true,
		  "focus"	: true,
		  "show"	: true		// ensure the modal is shown immediately
		});

		// buttons
		$('form#form_dialogModal')
			.off('submit')
			.on( 'submit', function() {
				result = true;
				dialog.modal('hide');
				// return false;
			});
			
		$('div#dialogModal')
			.off('hidden.bs.modal')
			.on( 'hidden.bs.modal', function() {
				if ($.isFunction(cbfunc))
					(cbfunc)(result);
			});

		return result;
	}
	function _confirmDialog(message,cbfunc,buttons) {
		var buttons = buttons || [{isdefault:true, label:_T("Yes")}];
		// var warningpic = "<div class='altui-exclamation-triangle-icon pull-left'>{0}</div>".format(questionGlyph);
		return _genericDialog(message,questionGlyph,_T("Are you Sure ?"),"",buttons,cbfunc)
	};
	function _quickDialog(type,cls,title,size,message,cbfunc) {
		var glyph = glyphTemplate.format( type, _T(type) , "text-"+type);
		// var pic= "<div class='altui-dialog-icon {1} pull-left'>{0}</div>".format(glyph,cls);
		return _genericDialog(message,glyph,title,size,[],cbfunc);
	};
	function _infoDialog(title,message,cbfunc) {
		return _quickDialog("info-circle", "text-primary", title,"modal-lg",message,cbfunc);
	};
	function _warningDialog(title,message,cbfunc) {
		return _quickDialog("exclamation-triangle", "text-warning", title,"",message,cbfunc);
	};
	function _triggerDialog( trigger, controller, cbfunc ) {
		var dialog = DialogManager.createPropertyDialog(_T('Trigger'));
		var device = MultiBox.getDeviceByID( controller ,trigger.device);
		var event = _findEventFromTriggerTemplate( device, trigger.template );
		DialogManager.dlgAddLine( dialog , "TriggerName", _T("TriggerName"), trigger.name, "", {required:''} );
		DialogManager.dlgAddDevices( dialog , '', device ? device.altuiid : NULL_DEVICE,
			function() {			// callback
				DialogManager.dlgAddEvents( dialog, "Events", "altui-select-events",device ? device.altuiid : NULL_DEVICE , trigger.template, trigger.arguments );
				$('div#dialogModal').modal();
			},
			function( device ) {	// filter
				return (MultiBox.controllerOf(device.altuiid).controller == controller);
			}
		);
		$('div#dialogs').on( 'submit',"div#dialogModal form",  function( event ) {
			trigger.name = $("#altui-widget-TriggerName").val();
			trigger.enabled = 1;
			trigger.device = parseInt(MultiBox.controllerOf( $("#altui-select-device").val() ).id) ;
			trigger.template = $("#altui-select-events").val();
			trigger.arguments = [];
			$(".altui-arguments input,.altui-arguments select").each( function(idx,elem)
			{
				var id = $(elem).prop('id').substring("altui-event-param".length);
				trigger.arguments.push( {id:id, value: $(elem).val() } );
			});
			// on UI7 10, for motion sensor which have no argument list in their  eventlist definition
			// it seems that passing at least {id:1} is mandatory
			if (trigger.arguments.length==0)
				trigger.arguments.push( {id:1} );

			if ((trigger.device>0) && (trigger.template>0))
			{
				$('div#dialogModal').modal('hide');
				$(".modal-backdrop").remove();	// hack as it is too fast
				if ($.isFunction(cbfunc))
					(cbfunc)(trigger);
			}
		});
	}

	function _triggerUsersDialog(trigger,controller,cbfunc) {
		var dialog = DialogManager.createPropertyDialog(_T('Notify Users'));
		var users = MultiBox.getUsersSync(controller);
		var selectedusers = (trigger.users || "").toString().split(",");
		$.each(users, function(idx,user){
			var inarray	 = $.inArray(user.id.toString(),selectedusers);
			DialogManager.dlgAddCheck(dialog,'user-'+user.id,(inarray!=-1),user.Name,'altui-notify-user');
		});
		$('div#dialogModal').modal();
		$('div#dialogs')
			.off('submit',"div#dialogModal form")
			.on( 'submit',"div#dialogModal form", function(event) {
				var lines=[];
				$(".altui-notify-user").each(function(idx,check) {
					if ($(check).prop('checked')==true) {
						var id = $(check).prop('id').substring("altui-widget-user-".length)
						lines.push(id);
					}
				});
				if (lines.length>0)
					trigger.users = lines.join(",");
				else
					delete trigger.users;	// warning : in UI7 setting a empty string is not sufficient
				$('div#dialogModal').modal('hide');
				$(".modal-backdrop").remove();	// hack as it is too fast
				if ($.isFunction(cbfunc))
					(cbfunc)(event);
			});
	};

	function _createPropertyDialog(title)
	{
		var dialog =  DialogManager.registerDialog('dialogModal',
						defaultDialogModalTemplate.format( 'dialogModal',
								title,			// title
								"",				// body
								"modal-lg",	// size
								""	// glyph icon
							));
		DialogManager.dlgAddDialogButton(dialog, true, _T("Save Changes"));
		$("div#dialogModal").off('click', '.altui-help-button')
			.on('click', '.altui-help-button', function(e) {
				e.stopPropagation();
				e.preventDefault();
				var text = $(this).data("text");
				alert(text);
				return false;
			});
		return dialog;
	};

	function _dlgAddDialogButton(dialog, bSubmit, label, extraclass, id, extraattrs) {
		var html = "<button type='{0}' class='btn {2} {3}' {4} id='{5}'>{1}</button>".format(
			(bSubmit ? 'submit' : 'button'),
			label,
			'btn-'+(bSubmit ? 'primary' : 'default'),
			(extraclass) ? extraclass : '',
			(extraattrs) ? HTMLUtils.optionsToString(extraattrs) : '',
			id || ''
			)
		$(dialog).find(".modal-footer").append(html);
	};

	function _dlgAddCheck(dialog, name, value, label, extraclass)
	{
		var propertyline = "";
		// propertyline += "<div class='checkbox'>";
		propertyline +="<label class='checkbox-inline'>";
		propertyline +=("  <input type='checkbox' class='"+(extraclass || '')+"' id='altui-widget-"+name+"' " + ( (value==true) ? 'checked' : '') +" value='"+value+"' title='check to invert status value'>"+(label ? label : name));
		propertyline +="</label>";
		// propertyline += "</div>";
		$(dialog).find(".altui-dialog-row").append(propertyline);
	};

	function _dlgAddDayOfWeek(dialog,name, label, value, _timerDOW)
	{
		//0:sunday
		var selected_days = value.split(',');
		var propertyline = "";
		propertyline += "<div class='form-group' id='altui-widget-"+name+"'>";
		propertyline += "	<label	title='"+name+"'>"+label+": </label>";
		$.each(_timerDOW, function(idx,element) {
			// propertyline += "<div class='checkbox'>";
			propertyline +="<label class='checkbox-inline'>";
			propertyline +=( "<input type='checkbox' class='altui-widget-TimerDayOfWeek' id='altui-widget-"+name+element.value+"' " + ( ($.inArray(element.value.toString(),selected_days)!=-1) ? 'checked' : '') +" value='"+element.value+"' />"+element.text);
			propertyline +="</label>";
		});
		propertyline += " ";
		propertyline += xsbuttonTemplate.format('altui-TimerDayOfWeek-setAll','',okGlyph,_T("All"));
		propertyline += xsbuttonTemplate.format('altui-TimerDayOfWeek-clearAll','',removeGlyph,_T("None"));
		propertyline += "</div>";
		$(dialog).find(".altui-dialog-row").append(propertyline);
		$("#altui-TimerDayOfWeek-setAll").click(function(){
			$(".altui-widget-TimerDayOfWeek").each( function(i,e) {
				var id = parseInt($(e).prop('id').substring( ("altui-widget-"+name).length ));
				if (id<8)
					$(e).prop('checked', true);
			});
		});
		$("#altui-TimerDayOfWeek-clearAll").click(function(){
			$(".altui-widget-TimerDayOfWeek").each( function(i,e) {
				var id = parseInt($(e).prop('id').substring( ("altui-widget-"+name).length ));
				if (id<8)
					$(e).prop('checked', false);
			});
		});
	};

	function _dlgAddColorPicker(dialog, name, label, help, value, options)
	{
		var optstr = HTMLUtils.optionsToString(options);
		value = (value==undefined) ? '' : value ;
		var propertyline = "";
		propertyline += "<div class='form-group'>";
		propertyline += "	<label for='altui-widget-"+name+"' title='"+(help || '')+"'>"+label+"</label>";
		if (help)
			propertyline += "	<button data-toggle='tooltip' data-placement='top' title='{0}' type='button' class='btn btn-light btn-sm altui-help-button' data-text='{0}'>{1}</button>".format(help||'' , helpGlyph);
		propertyline += "<input id='altui-widget-"+name+"' name='{0}' value='{1}' {2}></input>"
			.format(name,value,optstr);
		propertyline += "</div>";
		$(dialog).find(".altui-dialog-row").append(propertyline);
		$("#altui-widget-{0}".format(name)).spectrum({
			preferredFormat: 'hex',
			replacerClassName: 'altui-colorpicker-replacer',
		});
	};

	function _dlgAddBlockly(dialog, name, label, value, xml, help, options)
	{
		var optstr = HTMLUtils.optionsToString($.extend( {type:'text'},options));
		xml = xml || "";
		value = (value==undefined) ? '' : value ;
		var placeholder = ((options !=undefined) && (options.placeholder==undefined)) ? "placeholder:'enter "+name+"'" : "";
		var propertyline = "";
		propertyline += "<div class='form-group'>";
		propertyline += "	<label for='altui-widget-"+name+"' title='"+(help || '')+"'>"+label+"</label>";
		if (help)
			propertyline += "	<button data-toggle='tooltip' data-placement='top' title='{0}' type='button' class='btn btn-light btn-sm altui-help-button' data-text='{0}'>{1}</button>".format(help||'' , helpGlyph);

		propertyline += "<div class='input-group'>";
			propertyline += "<textarea rows='1' cols='50' id='altui-widget-"+name+"' class='form-control' "+optstr+"  "+placeholder+" >"+value.escapeXml()+"</textarea>";
			propertyline += "<input type='hidden' id='altui-xml-"+name+"' class='form-control' value='"+xml.escapeXml()+"' ></input>";
			propertyline += "<div class='input-group-append'>{0}</div>".format(buttonTemplate.format( "altui-edit-"+name, 'btn-secondary ', "Blockly "+editGlyph,'default',_T('Edit Watch Expression')));
		propertyline += "</div>";
		propertyline += "</div>";
		$(dialog).find(".altui-dialog-row").append(propertyline);

		// init Ace editor
		// var id = 'altui-widget-'+name
		// var init =	MyLocalStorage.getSettings("EditorTheme") || "monokai";
		// var editor = ace.edit( id );
		// editor.getSession().setMode( "ace/mode/lua" );
		// editor.setTheme( "ace/theme/"+init );
		// editor.setFontSize( MyLocalStorage.getSettings("EditorFontSize") );
		// resize
		// setTimeout( function() {
			// $('#'+id).resizable({
				// containment: "parent",
				// maxWidth:$(elem).closest(".card").innerWidth()-30, // ugly but easier, padding 15 on
				// stop: function( event, ui ) {
					// editor.resize();
				// }
			// });
		// },500);

		$("#altui-widget-LuaExpression").on("change",function() {
			$("#altui-xml-LuaExpression").val( "" );
		});
	}
	function _dlgAddHtml(dialog,html)
	{
		$(dialog).find(".altui-dialog-row").append(html);
	}
	function _dlgAddLine(dialog, name, label, value,help, options, col_css)
	{
		var col_css = col_css || ''; //|| 'col-12';
		var optstr = HTMLUtils.optionsToString($.extend( {type:'text'},options));
		value = (value==undefined) ? '' : value.toString() ;
		var placeholder = ((options !=undefined) && (options.placeholder==undefined)) ? "placeholder='enter "+name+"'" : "";
		var propertyline = "";
		propertyline += "<div class='form-group {0}'>".format(col_css);
		propertyline += "	<label for='altui-widget-"+name+"' title='"+(help || '')+"'>"+label+"</label>";
		if (help)
			propertyline += "	<button data-toggle='tooltip' data-placement='top' title='{0}' type='button' class='btn btn-light btn-sm altui-help-button' data-text='{0}'>{1}</button>".format(help||'' , helpGlyph);
		propertyline += "	<input id='altui-widget-"+name+"' class='form-control' "+optstr+" value='"+value.escapeXml()+"' "+placeholder+" ></input>";
		propertyline += "</div>";
		$(dialog).find(".altui-dialog-row").append(propertyline);
	};
	function _dlgAddEditor(dialog,name,label,value,help,language)
	{
		var language = language || 'lua';
		value = (value==undefined) ? '' : value.toString() ;
		var propertyline = "";
		propertyline += "<div class='form-group'>"
		propertyline += "	<label for='altui-widget-"+name+"' title='"+(help || '')+"'>"+label+"</label>";
		if (help)
			propertyline += "<button data-toggle='tooltip' data-placement='top' title='{0}' type='button' class='btn btn-light btn-sm altui-help-button' data-text='{0}'>{1}</button>".format(help||'' , helpGlyph);

		propertyline += "<div class='row'><div class='col-sm-9 col-12'>{0}</div><div class='col-sm-3 d-none d-sm-block'><small>{1}</small></div></div>".format(
			"<div class='form-control altui-dialog-ace' id='altui-editor-text-{1}'>{0}</div>".format(value.escapeXml(),name),
			help || ''
		)
		propertyline += "</div>";
		$(dialog).find(".altui-dialog-row").append(propertyline);

		// init ACE editor
		var editor = null;
		editor = ace.edit( "altui-editor-text-"+name );
		editor.setTheme( "ace/theme/"+ (MyLocalStorage.getSettings("EditorTheme") || "monokai") );
		editor.getSession().setMode( "ace/mode/"+language);
		editor.setFontSize( MyLocalStorage.getSettings("EditorFontSize") );

		setTimeout(function() {
			var parentwidth = $("#altui-editor-text-"+name).parent().width()
			$("#altui-editor-text-"+name).resizable({
				// containment: "parent",
				maxWidth:parentwidth,
				stop: function( event, ui ) {
					if (editor)
						editor.resize();
				}
			});
		},500);
	};
	function _dlgAddUrl(dialog, name, label, value,help, options) {
		var optstr = HTMLUtils.optionsToString($.extend( {type:'text'},options));
		value = (value==undefined) ? '' : value ;
		var placeholder = ((options !=undefined) && (options.placeholder==undefined)) ? "placeholder='enter "+name+"'" : "";
		var propertyline = "";
		propertyline += "<div class='form-group'>";
		propertyline += "	<label for='altui-widget-"+name+"' title='"+(help || '')+"'>"+label+"</label>";
		if (help)
			propertyline += "	<button data-toggle='tooltip' data-placement='top' title='{0}' type='button' class='btn btn-light btn-sm altui-help-button' data-text='{0}'>{1}</button>".format(help||'' , helpGlyph);
		// propertyline += "	<input type='url' id='altui-widget-"+name+"' class='form-control' "+optstr+" value='"+value+"' "+placeholder+" ></input>";
		propertyline += "<div class='input-group'>";
		  propertyline += "<input type='text' id='altui-widget-"+name+"' class='form-control' "+optstr+" value='"+value+"' "+placeholder+" placeholder='Url...'>";
		  propertyline += "<span class='input-group-btn'>";
			propertyline += "<button data-forinput='altui-widget-"+name+"' class='btn btn-light altui-url-test' type='button'>"+_T("Test")+"!</button>";
		  propertyline += "</span>";
		propertyline += "</div>"; // <!-- /input-group -->
	propertyline += "</div>";
		$(dialog).find(".altui-dialog-row").append(propertyline);
	};
	function _dlgAddSelect(dialog, name, label, value, lines, htmloptions)
	{
		var optstr = HTMLUtils.optionsToString(htmloptions);
		value = (value==undefined) ? '' : value ;
		var propertyline = "";
		propertyline += "<div class='form-group'>";
		propertyline += "	<label for='altui-widget-"+name+"' title='"+name+"'>"+label+"</label>";
		propertyline += "	<select id='altui-widget-"+name+"' class='form-control' "+optstr+">";
		$.each(lines, function(idx,line){
			propertyline += "<option value='{0}' {2}>{1}</option>".format(line.value, line.text, (value==line.value)?'selected':'');
		})
		propertyline += "</select>";
		propertyline += "</div>";
		$(dialog).find(".altui-dialog-row").append(propertyline);
	};
	function _dlgAddSelectGlyph(dialog, name, label, value, lines, htmloptions) {
		var optstr = HTMLUtils.optionsToString(htmloptions);
		value = (value==undefined) ? '' : value ;
		var propertyline = "";
		propertyline += "<div class='form-group'>";
		propertyline += "	<label for='altui-widget-"+name+"' title='"+name+"'>"+label+"</label>";
			propertyline += "<div class='input-group'>"
			propertyline += "<div class='input-group-prepend'>{0}</div>".format(glyphTemplate.format(value,value,'input-group-text'))
			propertyline += "	<select id='altui-widget-"+name+"' class='form-control' "+optstr+">";
			$.each(lines, function(idx,line){
				propertyline += "<option value='{0}' {2}>{1}</option>".format(line.value, line.text, (value==line.value)?'selected':'');
			})
			propertyline += "</select>";
			propertyline += "</div>";
		propertyline += "</div>";
		$(dialog).find(".altui-dialog-row").append(propertyline);
		$(dialog)
			.off("change","select#altui-widget-"+name)
			.on('change', "select#altui-widget-"+name,function(ui,event) {
				var v= $(this).val()
				$(this).prev(".input-group-prepend").find(".input-group-text").attr("title",v).attr("class","input-group-text fa fa-"+v)
			})
	}

	function _dlgAddTimeInterval(dialog, name, label, value, lines)
	{
		var unit = (value||' ').slice(-1);
		var value = parseInt(value);
		var propertyline = "";
		propertyline += "<div class='form-group'>";
		propertyline += "	<label for='altui-widget-"+name+"' title=''>"+label+"</label>";
		propertyline += "	<div class='form-inline'>";
		propertyline += "	<input id='altui-widget-"+name+"' class='form-control' type='number' value='"+value+"' placeholder='enter "+name+"' ></input>";
		propertyline += "	<select id='altui-widget-"+name+"Unit' class='form-control' >";
		$.each(lines, function(idx,line){
			propertyline += "<option value='{0}' {2}>{1}</option>".format(line.value, line.text, (unit==line.value)?'selected':'');
		})
		propertyline += "</select>";
		propertyline += "</div>";	// form inline
		propertyline += "</div>";
		$(dialog).find(".altui-dialog-row").append(propertyline);
	};

	function _dlgAddTime(dialog, name, value, _timerRelative)
	{
		function _decomposeTimer( value ) {
			var iKind = 0;
			var newvalue = '';
			if (value.substring(0,8)=="00:00:00") {
				newvalue = "00:00:00";
				if (value.slice(-1)=="R") {
					iKind=1;
				}
				else if (value.slice(-1)=="T")
					iKind=4;
				else
					iKind=0;
			} else {
				if (value.substring(0,1)=="-") {
					if (value.slice(-1)=="R") {
						iKind=2;
						newvalue = value.substr(1,value.length-2);
					}
					else if (value.slice(-1)=="T") {
						iKind=5;
						newvalue = value.substr(1,value.length-2);
					}
					else {
						iKind=0;
						newvalue = value.substr(1,value.length-1);
					}
				}
				else {
					if (value.slice(-1)=="R") {
						iKind=3;
						newvalue = value.substr(0,value.length-1);
					}
					else if (value.slice(-1)=="T") {
						iKind=6;
						newvalue = value.substr(0,value.length-1);
					}
					else {
						iKind=0;
						newvalue = value;
					}
				}
			}
			return	{ value: newvalue, iKind: iKind };
		};

		var pattern = "^[0-2][0-9][:]{1}[0-5][0-9][:][0-5][0-9]$";
		var res = _decomposeTimer((value==undefined) ? '00:00:00' : value );
		var propertyline = "";
		propertyline += "<div class='form-group'>";
		propertyline += "	<label for='altui-widget-"+name+"' title='hh:mm:ss'>"+name+"</label>";
		propertyline += "	<span title='hh:mm:ss'>"+helpGlyph+"</span>";
		propertyline += "	<div class='form-inline'>";
		propertyline += "	<input id='altui-widget-"+name+"' class='form-control' pattern='"+pattern+"' value='"+res.value+"' placeholder='hh:mm:ss' ></input>";
		propertyline += "	<select id='altui-widget-type-"+name+"' class='form-control' >";
		$.each(_timerRelative, function(idx,line){
			propertyline += "<option value='{0}' {2}>{1}</option>".format(line.value, line.text, (idx==res.iKind)?'selected':'');
		})
		propertyline += "</select>";
		propertyline += "</div>";	// form inline
		propertyline += "</div>";	// form group
		$(dialog).find(".altui-dialog-row").append(propertyline);
	};

	function _dlgAddTimer(dialog, name, label, value, htmloptions )
	{
		var optstr = HTMLUtils.optionsToString(htmloptions);
		var propertyline = "";
		propertyline += "<div class='form-group'>";
		propertyline += "	<label for='altui-widget-"+name+"' title='Date Time'>"+(label ? label : name)+"</label>";
		propertyline += "	<input required id='altui-widget-"+name+"' class='form-control' type='text' pattern='^[0-2][0-9]:[0-5][0-9]:[0-5][0-9]$' step='1' value='"+value+"' placeholder='hh:mm:ss' "+optstr+"></input>";
		propertyline += "</div>";
		$(dialog).find(".altui-dialog-row").append(propertyline);
	};

	function _dlgAddDateTime(dialog, name, value )
	{
		var propertyline = "";
		propertyline += "<div class='form-group'>";
		propertyline += "	<label for='altui-widget-"+name+"' title='Date Time'>"+name+"</label>";
		propertyline += "	<input id='altui-widget-"+name+"' class='form-control' type='datetime-local' value='"+value+"' placeholder='absolute time' ></input>";
		propertyline += "</div>";
		$(dialog).find(".altui-dialog-row").append(propertyline);
	};

	function _dlgAddHouseMode(dialog, name, label, modes ) {
		var propertyline = "";
		propertyline += "<div class='form-group'>";
		propertyline += "	<label for='altui-widget-"+name+"' title='House Modes'>"+label+"</label>";
		propertyline += HouseModeEditor.displayModes( 'altui-widget-'+name , '', modes );
		propertyline += "</div>";
		$(dialog).find(".altui-dialog-row").append(propertyline);
	};

	function _dlgAddVariables(dialog, forDeviceName, widget, cbfunc, serviceId)
	{
		forDeviceName = forDeviceName || "altui-select-device";
		var htmlDeviceName = ("#"+forDeviceName);
		$(htmlDeviceName).on("change",function() {
			widget.properties.deviceid = $(htmlDeviceName).val();
			var device = MultiBox.getDeviceByAltuiID(widget.properties.deviceid);
			$("#altui-select-variable").replaceWith( _getDeviceServiceVariableSelect( device , widget.properties.service, widget.properties.variable, serviceId ) );
		});

		//service & variables
		widget.properties.deviceid = $(htmlDeviceName).val();
		var device = MultiBox.getDeviceByAltuiID(widget.properties.deviceid);
		var propertyline = "";
		propertyline += "<div class='form-group'>";
		propertyline += "	<label for='altui-widget-servicevariable'>Variable</label>";
		propertyline +=		_getDeviceServiceVariableSelect( device , widget.properties.service, widget.properties.variable, serviceId );
		propertyline += "</div>";
		$(dialog).find(".altui-dialog-row").append(propertyline);
		cbfunc();
	};

	function _pickDevice(devices,deviceid,name) {
		var select = $("<select id='{0}' class='form-control'></select>".format(name));
		select.append("<option value='0' {0}>Select ...</option>".format( deviceid==NULL_DEVICE ? 'selected' : ''));
		var rooms = {};
		$.each(devices, function(idx,device) {
			var devicecontroller = MultiBox.controllerOf(device.altuiid).controller;
			var deviceroom = MultiBox.getRoomByID(devicecontroller,device.room) || {name:_T('No Room')};
			if (rooms[deviceroom.name]==undefined)
				rooms[deviceroom.name]=[];
			rooms[deviceroom.name].push(device);
		})
		$.each(Object.keys(rooms).sort(), function(i,name) {
			select.append("<optgroup label='"+name+"'>");
			$.each(rooms[name], function(idx,device) {
				select.append('<option value={0} {3}>&nbsp;&nbsp;&nbsp;&nbsp;#{2} {1}</option>'.format( device.altuiid, device.name, device.altuiid, deviceid==device.altuiid ? 'selected' : ''));
			});
		});
		return select.wrap( "<div></div>" ).parent().html();
	};

	function _dlgAddDevices2(dialog, name, deviceid, title, devices) {
		// all devices are enumarated
		var name = name || 'altui-select-device';
		var propertyline = "";
		propertyline += "<div class='form-group'>";
		propertyline += "	<label for='altui-widget-device'>"+title+"</label>";
		propertyline +=		_pickDevice(devices,deviceid,name);
		propertyline += "</div>";

		$(dialog).find(".altui-dialog-row").append(propertyline);
};

	function _dlgAddDevices(dialog, name, deviceid, cbfunc, filterfunc)
	{
		var name = name || 'altui-select-device';
		MultiBox.getDevices(
			null,
			$.isFunction(filterfunc) ? filterfunc : null,
			function (devices) {
				// all devices are enumarated
				var propertyline = "";
				propertyline += "<div class='form-group'>";
				propertyline += "	<label for='altui-select-device'>"+_T("Device")+"</label>";
				propertyline +=		_pickDevice(devices,deviceid,name);
				propertyline += "</div>";

				$(dialog).find(".altui-dialog-row").append(propertyline);
				cbfunc(devices);
			},
			"createDevice"		// request only from controller managing real devices
		);
	};

	function _dlgAddWorkflowStates(dialog,name,label,exclusion_altuiid,waitforState) {
		var name = name || 'altui-select-workflowstate';
		var workflows = WorkflowManager.getWorkflows()
		var propertyline = "";
		propertyline += " <div class='form-group'>";
		propertyline += "	<label	for='{0}' title='{0}'>{1}: </label>".format(name,label);

		propertyline += "<select required id='"+name+"' class='form-control'>"
		$.each(workflows, function(i,workflow) {
			if ( (exclusion_altuiid==null) || (workflow.altuiid!=exclusion_altuiid)) {
				propertyline += ("<optgroup label='"+workflow.name+"'>");
				var wdescr = WorkflowManager.getWorkflowDescr(workflow.altuiid);
				$.each(wdescr.states || [], function(i,state) {
					if (state.isStart() == false) {
						propertyline += "<option value='{0}_{1}' {3}>{2}</option>".format(workflow.altuiid,state.id,state.name, (waitforState && (waitforState.state == state.id)) ?  "selected" : "")
					}
				});
				propertyline += "</optgroup>";
			}
		});
		propertyline += "</select>"
		$(dialog).find(".altui-dialog-row").append(propertyline);
	};

	function _dlgAddScenes(dialog, widget, cbfunc)
	{
		var select = $("<select id='altui-widget-sceneid' class='form-control'></select>");
		select.append("<option value='0' {0}>Select ...</option>".format( widget.properties.sceneid==NULL_SCENE ? 'selected' : ''));
		MultiBox.getScenes(
			function(idx, scene) {
				select.append('<option value={0} {2}>{1}</option>'.format( scene.altuiid, scene.name, widget.properties.sceneid==scene.altuiid ? 'selected' : ''));
			},
			null,
			function(scenes) {
				var propertyline = "";
				propertyline += "		<div class='form-group'>";
				propertyline += "			<label for='altui-widget-sceneid'>Scene to Run</label>";
				propertyline +=				select.wrap( "<div></div>" ).parent().html();
				propertyline += "		</div>";
				$(dialog).find(".altui-dialog-row").append(propertyline);
				cbfunc();
			}
		);
	};

	function _getDialogActionValue(id)
	{
		var val = $("#"+id).val().split('.');
		return (val.length<2) ? {
			service: "0",
			action: "0"
		} : {
			service: val[0],
			action: val[1]
		};
	};

	function _dlgAddEvents(dialog, label, htmlid, deviceid, eventid, args)
	{
		var selected_event = null;

		function _findArgumentValue(args,id,defaultValue) {
			var value='';
			$.each(args,function(idx,arg) {
				if (arg.id==id) {
					value = (arg.value!=undefined) ? arg.value : defaultValue;
					return false;
				}
			});
			return value;
		};

		function _getSelectForEvents( events ) {
			var select = $("<select required id='"+htmlid+"' class='form-control'></select>");
			select.append("<option value='0' {0}>Select ...</option>".format( eventid==0 ? 'selected' : ''));
			selected_event = null;
			$.each(events, function(idx,event){
				var selected = '';
				if (eventid==event.id) {
					selected_event = event;
					selected = 'selected';
				}
				select.append("<option value='{0}' {2}>{1}</option>".format(
					event.id,
					event.label.text.replace("_DEVICE_NAME_","device"),
					selected));
			});
			return select.wrap( "<div></div>" ).parent().html();
		};

		function _getEventArguments( selected_event, args ) {
			function _findValue(arg) {
				var ret = {key:null,value:null};
				$.each(arg, function(k,v) {
					if (k!="HumanFriendlyText")
					{
						ret = {key:k,value:v};
						return false;
					}
				});
				return ret;
			};
			var propertyline="";
			if ((selected_event!=null) && (selected_event.argumentList))
			{
				$.each(selected_event.argumentList, function(idx,eventarg) {
					propertyline += "<div class='form-group'>";
					propertyline += "	<label for='altui-event-param{0}'>{1} {2}</label>".format(idx,eventarg.name,eventarg.comparisson);
					var selectedvalue = _findArgumentValue(args,eventarg.id,eventarg.defaultValue);
					if (eventarg.allowedValueList && $.isArray(eventarg.allowedValueList)) {
						propertyline += "<select id='altui-event-param{0}' class='form-control'>".format(eventarg.id);
						$.each(eventarg.allowedValueList,function(k,v) {
							var val = _findValue(v);
							var text = v.HumanFriendlyText.text.replace("_DEVICE_NAME_","device").replace("_ARGUMENT_VALUE_",val)
							propertyline += "<option {2} value='{0}'>{1}</option>".format(val.value,text, (val.value==selectedvalue) ? 'selected' : '' );
						});
						propertyline += "</select>"
					} else {
						propertyline += "	<input required id='altui-event-param{0}' type='text' class='form-control' value='{1}' placeholder='default to {2}'></input>"
							.format(eventarg.id, selectedvalue, eventarg.defaultValue || '' );
					}

					propertyline += "</div>";
					// (argument.value !=undefined) ? argument.value : eventarg.defaultValue );
				});
			}
			return propertyline;
		}

		//callback, if select device changes, we need to update actions
		$("#altui-select-device").on("change",function() {
			deviceid = $(this).val();
			args=[];
			eventid=0;
			selected_event = null;
			var device = MultiBox.getDeviceByAltuiID( deviceid );
			var events = MultiBox.getDeviceEvents(device);
			$("select#"+htmlid).replaceWith( _getSelectForEvents( events ) );
			$(".altui-arguments").html( _getEventArguments(selected_event, args) );
		});

		$('div#dialogModal').on("change","#"+htmlid,function() {
			args=[];
			eventid=$(this).val();
			selected_event = null;
			var device = MultiBox.getDeviceByAltuiID( deviceid );
			var events = MultiBox.getDeviceEvents(device);
			$.each(events, function(idx,event){
				if (eventid==event.id) {
					selected_event = event;
				}
			});
			$(".altui-arguments").html( _getEventArguments(selected_event, args) );
		});

		var device = MultiBox.getDeviceByAltuiID( deviceid );
		var events = MultiBox.getDeviceEvents(device);
		var propertyline = "";
		propertyline += "<div class='form-group'>";
		propertyline += "	<label for='"+htmlid+"'>"+label+"</label>";
		propertyline +=		_getSelectForEvents(events);
		propertyline += "</div>";

		propertyline += "<div class='altui-arguments'>";
		propertyline += _getEventArguments( selected_event , args );
		propertyline += "</div>";

		$(dialog).find(".altui-dialog-row").append(propertyline);
	};

	function _dlgAddActions(id, dialog,widget,actiondescriptor,label, cbfunc, filterByServiceID)
	{
		// callback when select of actions is changed
		function _onChangeAction(event)
		{
			var id = $(this).prop('id');
			$.extend( actiondescriptor , _getDialogActionValue(id) );
			widget.properties.deviceid = $("#altui-select-device").val();
			_getActionParameterHtml(
				id+"-parameters",
				MultiBox.getDeviceByAltuiID(widget.properties.deviceid),
				actiondescriptor.action,
				actiondescriptor,
				function(html) {
					$("."+id+"-parameters").replaceWith(html);
				}
			);
		};

		//callback, if select device changes, we need to update actions
		$("#altui-select-device").on("change",function() {
			widget.properties.deviceid = $("#altui-select-device").val();
			actiondescriptor.service = '';
			actiondescriptor.action = '';
			$("."+id+"-parameters").remove();
			var device = MultiBox.getDeviceByAltuiID(widget.properties.deviceid);
			_getDeviceActionSelect( id, device , actiondescriptor, filterByServiceID, function (result) {
				$("#"+id).replaceWith( result );
				$("#"+id).on("change", _onChangeAction );
			});
		});

		// get actions for the selected device
		var device = MultiBox.getDeviceByAltuiID(widget.properties.deviceid);
		_getDeviceActionSelect( id, device , actiondescriptor, filterByServiceID, function (result) {
			//result is a select with all the actions
			var propertyline = "";
			propertyline += "<div class='form-group'>";
			propertyline += "	<label for='"+id+"'>"+label+"</label>";
			propertyline +=		result;
			propertyline += "</div>";

			$(dialog).find(".altui-dialog-row").append(propertyline);

			//callback, if select action changes, we need to update parameters
			$("#"+id).on("change", _onChangeAction );
			cbfunc();
		});
	};


	return {
		registerDialog : _registerDialog,		// name, html
		clearDialog : _clearDialog,				// name
		createSpinningDialog: _createSpinningDialog,
		infoDialog: _infoDialog,
		warningDialog : _warningDialog,
		confirmDialog: _confirmDialog,
		triggerDialog: _triggerDialog,
		triggerUsersDialog: _triggerUsersDialog,
		createPropertyDialog:_createPropertyDialog,
		dlgAddHtml : _dlgAddHtml,
		dlgAddDialogButton: _dlgAddDialogButton,	// (dialog, bSubmit, label)
		dlgAddCheck:_dlgAddCheck,
		dlgAddColorPicker : _dlgAddColorPicker,	//(dialog, name, label, help, value, options)
		dlgAddLine:_dlgAddLine,
		dlgAddEditor:_dlgAddEditor,
		dlgAddUrl:_dlgAddUrl,
		dlgAddBlockly: _dlgAddBlockly,	//(dialog, name, label, value )
		dlgAddSelect: _dlgAddSelect,
		dlgAddSelectGlyph: _dlgAddSelectGlyph,
		dlgAddVariables:_dlgAddVariables,
		pickDevice : _pickDevice,					//(devices,devideid,name)
		dlgAddDevices:_dlgAddDevices,
		dlgAddDevices2: _dlgAddDevices2,	// (dialog, deviceid, devices)
		dlgAddScenes:_dlgAddScenes,
		dlgAddActions:_dlgAddActions,
		dlgAddEvents:_dlgAddEvents,
		dlgAddDayOfWeek:_dlgAddDayOfWeek,
		dlgAddTimer: _dlgAddTimer,
		dlgAddTimeInterval: _dlgAddTimeInterval,
		dlgAddDateTime:_dlgAddDateTime,
		dlgAddTime:_dlgAddTime,
		dlgAddHouseMode: _dlgAddHouseMode,		// (dialog, id, _housemodes)
		dlgAddWorkflowStates : _dlgAddWorkflowStates,
		getDialogActionValue: _getDialogActionValue
	};
})();

if (typeof RegExp.escape == 'undefined') {
	RegExp.escape = function(string) {
	  return string.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, '\\$&')
	  // return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
	};
};

if (typeof Array.prototype.in_array != 'function') {
	Array.prototype.in_array = function ( obj ) {
		var len = this.length;
		for ( var x = 0 ; x < len ; x++ ) {
			if ( this[x] == obj ) return true;
		}
		return false;
	}
};

if (typeof Number.prototype.toPaddedString != 'function') {
	function toPaddedString(number, length, radix) {
		var string = number.toString(radix || 10),
			slength = string.length;
		for (var i=0; i<(length - slength); i++) string = '0' + string;
		return string;
	}

	Number.prototype.toPaddedString = function(length, radix) {
		var number = this;
		return toPaddedString(number, length, radix);
	}
};

if (typeof String.prototype.toHHMMSS != 'function') {
	String.prototype.toHHMMSS = function () {
		var sec_num = parseInt(this, 10); // don't forget the second param
		if ( isNaN(sec_num) )
			sec_num=0;
		var hours	= Math.floor(sec_num / 3600);
		var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
		var seconds = sec_num - (hours * 3600) - (minutes * 60);

		if (hours	< 10) {hours   = "0"+hours;}
		if (minutes < 10) {minutes = "0"+minutes;}
		if (seconds < 10) {seconds = "0"+seconds;}
		var time	= hours+':'+minutes+':'+seconds;
		return time;
	}
	String.prototype.fromHHMMSS = function () {
		var hms = this;
		var a = hms.split(':'); // split it at the colons

		// minutes are worth 60 seconds. Hours are worth 60 minutes.
		var seconds = (+a[0] || 0) * 60 * 60 + (+a[1] || 0) * 60 + (+a[2] || 0 );
		return seconds;
	}
};

if (typeof String.prototype.withoutAccent != 'function') {
	String.prototype.withoutAccent = ( function() {
		var diacritics = [
			{char: 'A', base: /[\300-\306]/g},
			{char: 'a', base: /[\340-\346]/g},
			{char: 'E', base: /[\310-\313]/g},
			{char: 'e', base: /[\350-\353]/g},
			{char: 'I', base: /[\314-\317]/g},
			{char: 'i', base: /[\354-\357]/g},
			{char: 'O', base: /[\322-\330]/g},
			{char: 'o', base: /[\362-\370]/g},
			{char: 'U', base: /[\331-\334]/g},
			{char: 'u', base: /[\371-\374]/g},
			{char: 'N', base: /[\321]/g},
			{char: 'n', base: /[\361]/g},
			{char: 'C', base: /[\307]/g},
			{char: 'c', base: /[\347]/g}
		];
	return function() {
				var content = this;
				diacritics.forEach(function(letter){
					content = content.replace(letter.base, letter.char);
				});
				return content
	}
	})();
}

if (typeof String.prototype.escapeQuotes != 'function') {
  // see below for better implementation!
  String.prototype.escapeQuotes = function (){
	var content = this;
	return content.replace(/'/g, "\\'");
  };
  String.prototype.escapeDoubleQuotes = function (){
	var content = this;
	return content.replace(/"/g, "\\\"");
  };
};

if (typeof String.prototype.escapeXml != 'function') {
  // see below for better implementation!
  String.prototype.escapeXml = function (){
	var XML_CHAR_MAP = {
		'<': '&lt;',
		'>': '&gt;',
		'&': '&amp;',
		'"': '&quot;',
		"'": '&apos;'
	};
	var content = this;
	return content.replace(/[<>&"']/g, function (ch) {
		return XML_CHAR_MAP[ch];
	});
  };
};

if (typeof String.prototype.format == 'undefined') {
	String.prototype.format = function()
	{
		var args = new Array(arguments.length);

		for (var i = 0; i < args.length; ++i) {
			// `i` is always valid index in the arguments object
			// so we merely retrieve the value
			args[i] = arguments[i];
		}

		return this.replace(/{(\d+)}/g, function(match, number) {
			return typeof args[number] != 'undefined' ? args[number] : match;
		});
	   // var content = this;
	   // for (var i=0; i < arguments.length; i++)
	   // {
			// var replacement = new RegExp('\\{' + i + '\\}', 'g');	// regex requires \ and assignment into string requires \\,
			// content = content.replace(replacement, arguments[i]);
	   // }
	   // return content;
	};
};

if (typeof String.prototype.startsWith != 'function') {
  // see below for better implementation!
  String.prototype.startsWith = function (str){	return this.indexOf(str) == 0; };
};

if (typeof String.prototype.contains != 'function') {
	String.prototype.contains = function(it) { return this.indexOf(it) != -1; };
};

if (typeof String.prototype.htmlEncode == 'undefined') {
	String.prototype.htmlEncode = function()
	{
	   var value = this;
	   return $('<div/>').text(value).html();
	}

	String.prototype.htmlDecode= function()
	{
		var value = this;
		return $('<div/>').html(value).text();
	}
};

if (typeof String.prototype.evalJSON != 'function') {
  // see below for better implementation!
  String.prototype.evalJSON = function (){
	var content = this;
	return JSON.parse(content);
  }
};

function _format2Digits(d) {
	return ("0"+d).substr(-2);
};

function _toIso(date,sep) {
	sep = sep || 'T';
	var iso = "{0}-{1}-{2}{6}{3}:{4}:{5}".format(
		date.getFullYear(),
		_format2Digits(date.getMonth()+1),
		_format2Digits(date.getDate()),
		_format2Digits(date.getHours()),
		_format2Digits(date.getMinutes()),
		_format2Digits(date.getSeconds()),
		sep		);
	return iso;
};

var HTMLUtils = (function() {
	function _optionsToString(options)
	{
		var tbl=[];
		options = $.extend( { },options);

		$.each( options, function(key,val) {
			var typ = Object.prototype.toString.call(val);
			if ((typ!="[object Object]") && (typ!="[object Array]")){
				tbl.push("{0}='{1}'".format(key,val));
			}
		});
		return tbl.join(' ');
	};
	function _array2Table(arr,idcolumn,viscols,caption,cls,htmlid,bResponsive) {
		var html="";
		var idcolumn = idcolumn || 'id';
		var viscols = viscols || [idcolumn];
		var responsive = ((bResponsive==null) || (bResponsive==true)) ? 'table-responsive-OFF' : ''

		if ( (arr) && ($.isArray(arr) && (arr.length>0)) ) {
			var display_order = [];
			var keys= Object.keys(arr[0]);
			$.each(viscols,function(k,v) {
				if ($.inArray(v,keys)!=-1) {
					display_order.push(v);
				}
			});
			$.each(keys,function(k,v) {
				if ($.inArray(v,viscols)==-1) {
					display_order.push(v);
				}
			});

			var bFirst=true;
			html+="<table id='{1}' class='table {2} table-sm table-hover table-striped {0}'>".format(cls || '', htmlid || 'altui-grid' , responsive );
			if (caption)
				html += "<caption>{0}</caption>".format(caption)
			$.each(arr, function(idx,obj) {
				if (bFirst) {
					html+="<thead>"
					html+="<tr>"
					$.each(display_order,function(_k,k) {
						html+="<th style='text-transform: capitalize;' data-column-id='{0}' {1} {2}>".format(
							k,
							(k==idcolumn) ? "data-identifier='true'" : "",
							"data-visible='{0}'".format( $.inArray(k,viscols)!=-1 )
						)
						html+=k;
						html+="</th>"
					});
					html+="</tr>"
					html+="</thead>"
					html+="<tbody>"
					bFirst=false;
				}
				html+="<tr>"
				$.each(display_order,function(_k,k) {
					html+="<td>"
					html+=(obj[k]!=undefined) ? obj[k] : '';
					html+="</td>"
				});
				html+="</tr>"
			});
			html+="</tbody>"
			html+="</table>";
		}
		else
			html +="<div>{0}</div>".format(_T("No data to display"))

		return html;
	};

	// var panels = [
	// {id:'Header', title:_T("Header"), html:_displayHeader()},
	// {id:'Triggers', title:_T("Triggers"), html:_displayTriggersAndWatches()},
	// {id:'Timers', title:_T("Timers"), html:_displayTimers()},
	// {id:'Lua', title:_T("Lua"), html:_displayLua()},
	// {id:'Actions', title:_T("Actions"), html:_displayActions()},
	// ];
	function _createAccordeon(cls,panels,buttons,id) {
		var bFirst = true;
		var html="";
		var id = id||""
		html += "<div class='{0}' id='accordeon{1}' role='tablist'>".format(cls,id);
		$.each( panels, function (idx,panel){
			html += "		 <div class='card' id='"+panel.id+"'>";
			html += "			 <div class='card-header p-1' role='tab'>";
			if (buttons) {
        $(buttons).each( function(idb,button) {
              html += xsbuttonTemplate.format(button.id, button.class, button.label, button.title);
        })
			}
			html += "				 <h5 class='mb-0'>";
			html += "					 <a data-toggle='collapse' href='#collapse"+panel.id+"'>"+panel.title+"</a><span class='altui-hint' id='altui-hint-"+panel.id+"'></span>"
			+ glyphTemplate.format("caret-down");
			html += "				 </h5>";
			html += "			 </div>";
			html += "			 <div id='collapse"+panel.id+"' data-parent='#accordeon"+id+"' class='panel-collapse collapse {0}' role='tabpanel'>".format(bFirst ? 'show':'');
			html += "				 <div class='card-body'>";
			html +=						panel.html || _T(' ');
			html += "				 </div>";
			html += "			 </div>";
			html += "		 </div>";
			bFirst = false;
		})
		html += "</div>";
		return html
	};
	function _drawTags(htmlid,model) {
		var db = MyLocalStorage.getSettings('DeviceTags');
		var template='<span id="${id}" class="altui-device-tag badge badge-pill badge-${cls}">${label}</span>'
		var htmlTemplate = _.template( template )
		var html='<span class="altui-tags" id="{0}">{1}{2}</span>'
		var plusGlyph = glyphTemplate.format("plus",_T("Add Tag"),"")
		var tagGlyph= glyphTemplate.format( "tags", _T("Tag") , "");
		var tags = []
		$.each(model, function(idx,tag) {
			var model = { cls:tag , label:db.names[tag]||tag , id:'altui-tag-'+tag}
			tags.push( (htmlTemplate)(model) )
		})
		var addBtn = HTMLUtils.drawDropDown({
			id:'altui-tag-add-dd', 
			label:plusGlyph+' '+tagGlyph, 
			cls:'altui-tag-addcls d-inline',
			btncls:'btn-sm',
			options: $.map(tagModel, function(tag,key){
				return { id:'altui-tag-add-'+tag, cls:'altui-tag-add', label:db.names[tag]||tag , glyph:'fa-tags', glyphcls:'text-'+tag}
			})
		})
		// tags.push( (htmlTemplate)({ id:'altui-tag-add', cls:'secondary' , label:plusGlyph }) )
		return html.format( htmlid, tags.join("") , addBtn);
	};
	function _drawButtonGroup(htmlid,model) {
		var html="";
		model = $.extend( true, {cls:'', attr:'', buttons:[] }, model)
		html += "<div id='{2}' class='btn-group {0}' {1} role='group' aria-label='group'>".format(model.cls, model.attr,htmlid);
		$.each(model.buttons, function(i,btn) {
			var label = (btn.img) ? "<img class='{2}' src='{0}' alt='{1}'></img>".format(btn.img,btn.label||'',btn.imgcls||'' ) : (btn.label||'')
			html += "<button id='{2}' type='button' class='btn {0} {1}'>{3}</button>".format(btn.background || '',btn.cls||'',btn.id||'',label)
		})
		html += "</div>";
		return html;
	};
                 
    function _drawButton(htmlid,html_attributes,title,cls,label,glyphname) {
        var glyph = glyphTemplate.format(glyphname,label || title || '');
        return "<button type='button' class='btn {3} ' title='{2}' {1} id='{0}'>{4}&nbsp;{5}</button>"
           .format(
                   htmlid||'',
                   html_attributes||'',
                   title||'',
                   cls||'btn-light',
                   glyph,
                   label||'');
    };
                 
	function _drawToolbar(htmlid,tools,cls) {
		cls = cls||"";
		var toolbarHtml="<div>"
		var preareas=[];
		$.each(tools, function(idx,tool) {
			var collapsecss = "";
			if (tool.collapsetarget) {
				collapsecss="data-toggle='collapse' data-target='{0}'".format(tool.collapsetarget);
				preareas.push(tool.collapsetarget)
			}
			var tooltype = tool.type || 'button'
			switch( tooltype ) {
				case 'select':
					toolbarHtml+='<select id="{0}" class="{1}" multiple="multiple">'.format(tool.id,tool.cls||'');
					toolbarHtml+='</select>'
					break;
				case 'a':
					var glyph = glyphTemplate.format(tool.glyph,tool.label || tool.title || '');
					toolbarHtml+="	<a class='btn {2} ' href='#' role='button' title='{1}' id='{0}' >{3}{4}</a>".format(tool.id||'',tool.title||'',tool.cls||'btn-light',glyph,tool.label || '');
					break;
				case 'button':
				default:
                    toolbarHtml+= (" "+_drawButton(tool.id,collapsecss,tool.title,tool.cls,tool.label,tool.glyph))
                    break;
			}
		});
		toolbarHtml+="</div>";
		if (preareas.length>0) {
			toolbarHtml+="<div>";
			$.each(preareas, function(idx,idPre) {
				if (idPre.startsWith('#'))
					idPre = idPre.substr(1)
				toolbarHtml+="<div class='collapse' id='{0}'></div>".format(idPre);
			});
			toolbarHtml+="</div>";
		}
		return "<div class='{0} {1}'>{2}</div>" .format(htmlid,cls,toolbarHtml);
	};
		
	function _drawDropDown( model ) {
		model = $.extend( true, {id:'', label:'', cls:'' , btncls:'', selected:[] }, model )

		var htmlBtns = []
		var btnTemplate = _.template( '<button type="button" id="${id}" class="btn dropdown-item ${cls}" ><i class="fa ${glyph} ${glyphcls}" aria-hidden="true"></i> ${label}</button>' )
		$.each(model.options, function(idx,opt) {
			opt = $.extend( {id:'', cls:'', glyph:'', glyphcls:'', label:'' }, opt )
			opt.cls +=  ( (model.selected.indexOf( opt.id ) !== -1) ? " active" : " " )
			htmlBtns.push( (btnTemplate)(opt) )
		})
		
		var template = _.template( '<div id="${id}" class="dropdown ${cls}">	\
		  <button class="btn btn-light ${btncls} dropdown-toggle " type="button" " data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> \
			${label} \
		  </button> \
		  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">' + htmlBtns.join("") + '</div></div>')
		return (template)( model )
	};
	function _drawSelect( model ) {
		model = $.extend( {id:'', class:'', options:[], selected_idx:null },model )
		var html ="<select class='form-control {1}' id='{0}'>".format(model.id,model.class)
		$.each( model.options, function(i,opt) {
			html += "<option {2} value='{0}'>{1}</option>".format(opt.value, opt.text,((opt.selected==true) || (i==model.selected_idx)) ? 'selected':'')
		});
		html += "</select>"
		return html;
	};
	function _drawFormFields( model	 ) {
		var html ="";
		$.each(model, function(idx,line) {
			switch(line.type) {
				case "select":
					html += "<div class='form-group'>"
					html += "<label for='{0}'>{1}</label>".format(line.id,line.label || "");
					html += _drawSelect( {id:line.id, options:line.options, selected_idx:line.selected_idx} );
					html += "</div>"
					break;
				case "p":
				case "span":
				case "pre":
				case "div":
					// no form control for text display
					html += "<div class='form-group'>"
					html += "<label for='{0}'>{1}</label>".format(line.id,line.label);
					html +="<{0}  id='{1}' class='' {3}>{2}</{0}>".format(
						line.type,
						line.id,
						_enhanceValue(line.value),
						HTMLUtils.optionsToString(line.opt)
						);
					html += "</div>"
					break;
				case "buttonbar":
					html += "<div class='form-group'>"
					$.each(line.value, function(idx,btn) {
						var cls = (btn.type=="submit") ? "primary" : "default"
						html += "<button id='{3}' type='{0}' class='btn btn-{1}'>{2}</button>".format(btn.type,cls,btn.label,btn.id);
					});
					html += "</div>"
					break;
				case "input":
					if (line.inputtype=="checkbox") {
						var checked = (line.value==true)? "checked" : "";
                        //html += "<div class='form-group'>"
                        html += "<div class='form-group'>"
                        html += "<div class='form-check'>"
						html += "<input id='{0}' type='checkbox' class='form-check-input' value='{2}' {3} {4}></input><label for='{0}' class='form-check-label'> {1} </label>".format(
							line.id,
							line.label,
							line.value,
							HTMLUtils.optionsToString(line.opt),
							checked
							);
                        html += '</div>'
                        html += '</div>'
                        //html += '</div>'
					} else {
						html += "<div class='form-group'>"
						html += "<label for='{0}' '>{1}</label>".format(line.id,line.label);
						var type = (line.inputtype!=undefined) ? "type='{0}'".format(line.inputtype) : "";
						var pattern = (line.pattern != undefined ) ? "pattern='{0}'".format(line.pattern) : "";
						var checked = ((line.inputtype=="checkbox") && (line.value==true))? "checked" : "";
						html +="<input id='{0}' class='form-control' value='{1}' {2} {3} {4} {5}></input>".format(
							line.id,
							line.value,
							HTMLUtils.optionsToString(line.opt),
							type,
							pattern,
							checked);
						html += "</div>"
					}
					html += '<div class="invalid-feedback">{0}</div>'.format(line.invalidfeedback || _T("Please enter a valid element"))
					if (line.helptext) {
						html +='<small id="passwordHelpBlock" class="form-text text-muted">{0}</small>'.format( line.helptext )
					}
					break;
				case "accordeon":
					html += "<div class='form-group'>"
					html += "<label for='{0}'>{1}</label>".format(line.id,line.label);
					html += HTMLUtils.createAccordeon(line.id,line.value);
					html += "</div>"
					break;
				default:
					html += "<div class='form-group'>"
					html += "<span class='text-danger'>Not Implemented:{0}</span>".format(line.type)
					html += "</div>"
					break;
			}
		});
		return html;
	};

	/*
	_drawTabs('id', [ 
		{ iditem: 'zwconfig', label: 'Config' , html: 'xxx' },
		{ iditem: 'options', label: 'Options' , html: 'xxx' }
	])
	*/
	function _drawTabs(htmlid, model) {
		var html = '<ul class="nav nav-tabs" id="myTab" role="tablist">'
		var active = true;
		$.each(model, function(idx,item) {
			html += '<li class="nav-item">'
			html += '<a class="nav-link {2}" id="{0}-tab" data-toggle="tab" href="#{0}" role="tab" aria-controls="home" aria-selected="true">{1}</a>'
				.format( item.iditem, item.label, (active) ? "active" : "");
			active=false;
			html += '</li>'
		})
		html += '</ul>'
		html += '<div class="tab-content" id="myTabContent">'
		active = true;
		$.each(model, function(idx,item) {
			html += '<div class="tab-pane fade show {2}" id="{0}" role="tabpanel" aria-labelledby="{0}-tab">{3}</div>'
				.format( item.iditem, item.label, (active) ? "active" : "" , item.html );
			active=false;
		})
		html += '</div>'
		return html;
	};

	function _drawForm( htmlid, title, model, extraattrs ) {
		var html ="";
		if (isNullOrEmpty(title) == false)
			html += "<h3>{0}</h3>".format(title);
		html += "<form id='{0}' name='{0}' {1}>".format(htmlid,extraattrs ? extraattrs : '' )
		html += _drawFormFields(model);
		html += "</form>"
		return html;
	}

	function _enhanceValue(value)
	{
		//try to guess what is the value
		if (value==null)
			return "";
		var valuetype = $.type(value);
		if ($.isNumeric(value)) {
			if ( value>=900000000 && value <= 4035615941) {
				var date = new Date(value*1000);
				return date.toLocaleString();
			}
			return value;
		} else if ( (valuetype==='string') && ( (value.indexOf("http") === 0) || (value.indexOf("https") === 0) || (value.indexOf("ftp") === 0) ) ) {
			return "<a href='{0}' target='_blank'>{0}</a>".format(value);
		}
		return value.toString().htmlEncode();
	};

	function _startTimer(id,ms,callback,data) {
		if ($(".altui-timers #"+id).length>0) {
			AltuiDebug.warning("Cannot schedule twice the same timer "+id);
			return;
		}
		var timerdiv = $(".altui-timers");
		if (timerdiv.length ==0) {
			$(".altui-mainpanel").after("<div class='altui-timers'></div>");
			timerdiv = $(".altui-timers");
		}

		function _timerfunc (id,callback,data) {
			var timer = $(".altui-timers #"+id);
			if (timer.length==0) return;
			_stopTimer(id);
			if ($.isFunction(callback))
				(callback)(id,data);
		}

		$(timerdiv).append("<div id='{0}' class='altui-timer-instance'></div>".format(id));
		var timer = $(".altui-timers #"+id);
		$(timer).data('timerid', setTimeout(_timerfunc,ms,id,callback,data));
	};

	function _stopTimer(id) {
		var timer = $(".altui-timers #"+id);
		if (timer.length==0)
			return;
		var jstimer = $(timer).data('timerid');
		clearTimeout(jstimer);
		$(timer).remove();
	};

	function _stopAllTimers() {
		var timers = $(".altui-timer-instance");
		$.each(timers, function(idx,timer) {
			_stopTimer($(timer).prop("id"));
		})
		$(timers).remove();
	};

	function _displayRECButton( htmlid ) {
		var html ="";
		var bRec = MultiBox.isRecording();
		var text = (bRec==true) ? _T("Recording...") : _T("Record")
		html += buttonTemplate.format( htmlid, 'altui-button-record btn-sm'+ (bRec==true ? ' active': ''), "{0} {1}".format(recordGlyph,text),'default',_T("Record"));
		return html;
	};
	return {
		enhanceValue	: _enhanceValue,
		optionsToString : _optionsToString,
		array2Table		: _array2Table,			// (arr,idcolumn,viscols)
		createAccordeon : _createAccordeon,		// (panels)
		drawTags 		: _drawTags,
		drawButtonGroup : _drawButtonGroup,
        drawButton      : _drawButton,          //(htmlid,html_attributes,title,cls,label,glyphname)
		drawToolbar		: _drawToolbar,
		drawSelect		: _drawSelect,
		drawDropDown	: _drawDropDown,
		drawFormFields	: _drawFormFields,
		drawForm		: _drawForm,
		drawTabs		: _drawTabs,
		startTimer		: _startTimer,
		stopTimer		: _stopTimer,
		stopAllTimers	: _stopAllTimers,
		displayRECButton: _displayRECButton,	// ( htmlid, bRec )
	}
})();

function isObject(obj)
{
	return (Object.prototype.toString.call(obj)== "[object Object]");
};

function isInteger(data) {
	return (data === parseInt(data, 10));
};

function isNullOrEmpty(value) {
	return (value == null || value.length === 0);	// undefined == null also
};

function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
};

function rgbToHex(r, g, b) {
	return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

var getCSS = function (prop, fromClass) {
	var $inspector = $("<div>").css('display', 'none').addClass(fromClass);
	$("body").append($inspector); // add to DOM, in order to read the CSS property
	try {
		return $inspector.css(prop);
	} finally {
		$inspector.remove(); // and remove from DOM
	}
};

var AltuiDebug = ( function (undefined) {
	var g_debug = false;

	function _debug(str) {
		if (g_debug==true)
			console.log(new Date().toISOString()+": ALTUI "+g_ALTUI.g_DeviceTypes.info["PluginVersion"]+":"+str);
	};
	function _warning(str) {
			console.log(new Date().toISOString()+": ALTUI "+g_ALTUI.g_DeviceTypes.info["PluginVersion"]+":"+str);
	};
	function _setDebug(bDebug)	{
		g_debug=bDebug;
		if (g_debug==true) {
			setTimeout(function() {
				PageMessage.message( "ALTUI in debug mode", "warning");
			}, 10000)
		}
	}
	return {
		SetDebug: _setDebug,
		IsDebug : function()		{ return g_debug; },
		debug: _debug,
		warning: _warning,
	}
})();

function formatAjaxErrorMessage(jqXHR, exception) {

	if (jqXHR.status === 0) {
		return ('Not connected. Please verify your network connection.');
	} else if (jqXHR.status == 404) {
		return ('The requested page not found. [404]');
	} else if (jqXHR.status == 500) {
		return ('Internal Server Error [500].');
	} else if (exception === 'parsererror') {
		return ('Requested JSON parse failed.');
	} else if (exception === 'timeout') {
		return ('Time out error.');
	} else if (exception === 'abort') {
		return ('Ajax request aborted.');
	} else {
		return ('Uncaught Error.\n' + jqXHR.responseText);
	}
};

var MyLocalStorage = ( function (undefined) {
		function _set(key, item) {
			if (key==undefined)
				return null;

			localStorage.setItem( key, JSON.stringify(item) );
			return item;
		};

		function _get(key) {
			if (key==undefined)
				return null;
			var json = localStorage.getItem( key );
			return json != undefined ? JSON.parse(json) : null;
		};

		function _clear(key) {
			if (key==undefined)
				return null;
			return localStorage.removeItem(key);
		};

		function _setSettings(key, val) {
			var settings = _get("ALTUI_Settings");
			if (settings==null) {
				settings = {};
			}
			settings[key] = val;
			return _set("ALTUI_Settings",settings);
		};

		function _getSettings(key) {
			var settings = _get("ALTUI_Settings");
			return (settings) ? settings[key] : null;
		};

	return {
		set: _set,
		get: _get,
		setSettings: _setSettings,
		getSettings: _getSettings,
		clear: _clear,
	}
})( );

var Favorites = ( function (undefined) {
	var _favorites = $.extend( {'device':{}, 'scene':{} }, MyLocalStorage.getSettings("Favorites") );
	MyLocalStorage.setSettings("Favorites",_favorites);

	function _save() {
		MyLocalStorage.setSettings("Favorites",_favorites);
	};

	function _set(type, id, bFavorite) {
		_favorites[type][id]=bFavorite;
		if (MyLocalStorage.getSettings('UseVeraFavorites')==1) {
			switch(type) {
				case "device":
					var device = MultiBox.getDeviceByAltuiID( id );
					MultiBox.setAttr(device, "onDashboard", bFavorite ? 1 : 0 );
					break;
				case "scene":
					var scene = MultiBox.getSceneByAltuiID( id );
					scene.onDashboard = (bFavorite ? 1 : 0);
					MultiBox.editScene(scene.altuiid,scene);
					break;
			}
		}
		_save();
	};

	function _get(type, id) {
		if (MyLocalStorage.getSettings('UseVeraFavorites')==1) {
			switch(type) {
				case "device":
					var device = MultiBox.getDeviceByAltuiID( id );
					if (device && device.onDashboard) {
						_favorites[type][id] = (device.onDashboard==1);
					} 
					else {
						delete _favorites[type][id] 
						_save();
					}
					break;
				case "scene":
					var scene = MultiBox.getSceneByAltuiID( id );
					if (scene && scene.onDashboard) {
						_favorites[type][id] = ( scene.onDashboard==1);
					} else {
						delete _favorites[type][id]
						_save();
					}
			}
		}
		return _favorites[type][id] || false;
	};

	return {
		set: _set,
		get: _get,
		save: _save
	}
})( );

var EventBus = ( function (undefined) {
	var _subscriptions = {
		// altui specific ones				// parameters
		"on_altui_deviceTypeLoaded" : [],	// table of { func, object }

		// global ones
		"on_ui_deviceStatusChanged" : [],	// table of { func, object }
		"on_ui_initFinished": [],
		// "on_ui_userDataFirstLoaded" : [],
		"on_ui_userDataLoaded" : [],
		"on_startup_luStatusLoaded" : [],

		// ctrl specific ones , 0 is the master then other are going to be added dynamically
		// "on_ui_userDataFirstLoaded_0" : [],
		"on_ui_userDataLoaded_0" : [],
		"on_startup_luStatusLoaded_0" : [],
	};
	function _allSet(tbl) {
		var bResult = true;
		$.each(tbl, function(k,v) {
			if (v==false)
				bResult = false;
			return bResult;
		});
		return bResult;
	};
	function _registerEventHandler(eventname, object, funcname ) {
		if (_subscriptions[eventname] == undefined)
			_subscriptions[eventname] = [];
		var bFound = false;
		$.each(_subscriptions[eventname], function (idx,sub) {
			if ((sub.object==object) && (sub.funcname==funcname)) {
				bFound = true;
				return false;
			}
		});
		if (bFound==false)
			_subscriptions[eventname].push( {object: object , funcname: funcname} );
	};

	// event/null/null or just first param, removes all the subscriptions for that event
	function _unregisterEventHandler(eventname, object, funcname) {
		if (_subscriptions[eventname] == undefined)
			return;

		if ((object==null) && (funcname==null)) {
			_subscriptions[eventname] = null;
			return;
		}

		var iFound=-1;
		$.each(_subscriptions[eventname], function (idx,sub) {
			if ((sub.object==object) && (sub.funcname==funcname)) {
				iFound = idx;
				return false;
			}
		});
		if (iFound!=-1) {
				_subscriptions[eventname].splice(iFound , 1);
		}
	};
	function _waitForAll(event, eventtbl, object, funcname , maxwaitms) {
		var defered = $.Deferred();
		var _state = {};
		var timeout = (maxwaitms==undefined ) 
			? null 
			: setTimeout(function() {  
				timeout=null;
				defered.resolve(_state);
			} , maxwaitms );
		
		function _signal(eventname/*, args */) {
			var theArgs = arguments;
			_state[eventname] = true;
			// if all are true, call the object,funcname
			if (_allSet(_state)) {
				theArgs[0] = event;
				if (funcname) {
					if ($.isFunction(funcname)) {
						(funcname).apply(object,theArgs);
					} else {
						// theArgs.unshift(eventname);
						var func = object[funcname];
						func.apply( object , theArgs );
					}
				}
				if (timeout) clearTimeout(timeout); 
				timeout=null;
				defered.resolve(_state)
			}
		};
		$.each(eventtbl , function( idx, event) {
			_state[event] = false;
			_registerEventHandler(event, this, _signal );
		})
		return defered;
	};

	function _publishEvent(eventname/*, args */) {
		// if (eventname != "on_ui_deviceStatusChanged")
			// console.log("publish event:",eventname);
		if (_subscriptions[eventname]) {
			// var theArgs = [].slice.call(arguments, 1);	// remove first argument
			var theArgs = arguments;
			$.each(_subscriptions[eventname], function (idx,sub) {
				if ($.isFunction(sub.funcname)) {
					(sub.funcname).apply(sub.object,theArgs);
				} else {
					// theArgs.unshift(eventname);
					var func = sub.object[sub.funcname];
					func.apply( sub.object , theArgs );
				}
			});
		} else {
			_subscriptions[eventname] = [];
		}
	};
	return {
		registerEventHandler	: _registerEventHandler,	//(eventname, object, funcname )
		unregisterEventHandler	: _unregisterEventHandler,	//(eventname, object, funcname )
		waitForAll				: _waitForAll,			//(events, object, funcname )
		publishEvent			: _publishEvent,			//(eventname, args)

		getEventSupported : function() {
			return Object.keys(_subscriptions);
		},
	}
})();

var PageManager = (function() {
	var _pages = null;
			// var pages = [
			// { id:1, name:'test' },
			// { id:2, name:'page2' },
		// ];

	function _fixMyPage(page) {
		if (page.children)
			$.each(page.children, function(idx,child) {
				if (child.properties.deviceid) {
					if (child.properties.deviceid.indexOf('-') == -1) {
						child.properties.deviceid = "0-"+child.properties.deviceid;
					}
				}
				if (child.properties.sceneid) {
					if (child.properties.sceneid.indexOf('-') == -1) {
						child.properties.sceneid = "0-"+child.properties.sceneid;
					}
				}
				if (child.zindex == undefined )
					child.zindex = 0;
				if (child.cls == "altui-widget-2statebtn") {
					if (child.size && child.size.height<60)
						child.size.height=60
				}
			});
	};

	function _debugReset(pages)
	{
		_pages = [];
		$.each( pages, function(idx,page) {
			_fixMyPage(page);	// temporary code to fix the page definition
			_pages.push( $.extend( true, {id:0, name:'', background:''}, page) );
		});
	};

	function _init(pages) {
		if (_pages==null)	// otherwise, already initialized
		{
			AltuiDebug.debug("PageManager.init(), pages="+JSON.stringify(pages));
			_debugReset(pages);
		}
	};

	function _recoverFromStorage() {
		_pages = MyLocalStorage.get("Pages");
	};
	function _clearStorage() {
		MyLocalStorage.clear("Pages");
	};

	function _savePages() {

		function _savePage(idx,callback) {
			if (idx<_pages.length) {
				var page = _pages[idx];
				MultiBox.saveData( "Data", page.id.toString(), JSON.stringify(page), function(data) {
					if (data!="")
						PageMessage.message("Save for "+page.name+" succeeded.", "success");
					else
						PageMessage.message( "Save for "+page.name+" did not succeed." , "danger");
					(callback)();
				});
			} else {
				var names = $.map( _pages, function(page,idx) {	return page.id;	} );
				MultiBox.saveData( "Data", "CustomPages", JSON.stringify(names), function(data) {
					if (data!="")
						PageMessage.message("Save Pages success", "success");
					else
						PageMessage.message("Save Pages failure", "danger");
				});
			}
		}

		function _save(i) {
			_savePage(i, function() {
				_save(i+1);
			});
		}

		AltuiDebug.debug("PageManager.savePages(), pages="+JSON.stringify(_pages));
		MyLocalStorage.set("Pages",_pages);
		var i=0;
		_save(0);
	};

	function _addPage() {
		var id = 0;
		$.each(_pages, function(idx,page) {
			id = Math.max(id, page.id );
		});
		id++;
		_pages.push({
			id:id,
			name:'page'+id,
			background: 'rgb(232, 231, 231)'
		});
		return _pages;
	};

	function _deletePage(name) {
		$.each( _pages, function( idx,page) {
			if ( page.name==name) {
				_pages.splice(idx,1);
				return false;
			}
		});
		return _pages;
	};

	function _getPageFromName( name ) {
		var result = null;
		if (name)
			$.each( _pages, function( idx,page) {
				if ( page.name==name) {
					result = page;
					return false;
				}
			});
		return result;
	};
	function _getPageByIdx(idx) {
		var i = Math.max(idx,0)	// in case it is -1
		return ( _pages ? _pages[i] : null )
	};
	function _getPages() {
		return _pages;
	};
	function _updateChildrenInPage( page, widgetid, position , size, zindex )
	{
		if (page.children)
			$.each(page.children, function(idx,child) {
				if (child.id == widgetid) {
					if (position)
						child.position = jQuery.extend(true, {}, position);
					if (size)
						child.size = jQuery.extend(true, {}, size);
					if (zindex)
						child.zindex = zindex;
				}
			});
	};

	function _insertChildrenInPage( page, tool, position, zindex )
	{
		var id = 0;
		if (page !=null) {
			if (page.children == undefined)
				page.children = new Array();
			$.each(page.children, function(idx,child) {
				id = Math.max(id, child.id );
			});
			id++;
			page.children.push( {
					id: id,
					cls: tool.cls,
					position: jQuery.extend(true, {}, position),
					properties : jQuery.extend(true, {}, tool.properties),	// default values
					size: jQuery.extend(true, { }, tool.defaultSize),
					zindex : (zindex || tool.zindex || 0),
			});
		}
		return id;	//0 if error
	};

	function _removeChildrenInPage( page, widgetid )
	{
		var widget = null;
		$.each(page.children, function(idx,child) {
			if (child.id==widgetid)
			{
				widget = child;
				page.children.splice(idx,1);
				return false;	// break loop
			}
		});
		return widget;
	};

	function _getWidgetByID( page, widgetid ) {
		var widget=null;
		$.each(page.children, function(idx,child) {
			if (child.id == widgetid) {
				widget = child;
				return false;
			}
		});
		return widget;
	};

	function _forEachPage( func ) {
		if (_pages.length==0)
			this.addPage()
		$.each(_pages, func);
	};

	return {
		debugReset : _debugReset,
		init :_init,
		recoverFromStorage : _recoverFromStorage,
		clearStorage : _clearStorage,
		forEachPage: _forEachPage,
		getPageFromName: _getPageFromName,
		getPageByIdx: _getPageByIdx,
		getPages: _getPages,
		savePages: _savePages,
		addPage: _addPage,
		deletePage: _deletePage,
		updateChildrenInPage: _updateChildrenInPage,
		insertChildrenInPage: _insertChildrenInPage,
		removeChildrenInPage: _removeChildrenInPage,
		getWidgetByID: _getWidgetByID
	};
})();

var WorkflowLink = function(graph,cell) {
	var _cell = cell;
	var _graph = graph;
	function _stateFromID(id) {
		for (var i=0; i<_graph.cells.length; i++) {
			if (_graph.cells[i].id == id )
				return _graph.cells[i];
		}
		return null;
	};
	return {
		get id()					{ return _cell.id },
		get name()				{ return _cell.labels[0].attrs.text.text; },
		get comment()			{ return _cell.prop.comment || "" },
		get conditions()	{ return _cell.prop.conditions || [] },
		get waitFors()		{ return _cell.prop.workflows || [] },
		get schedule()		{ return _cell.prop.schedule  },
		get timer()				{ return (_cell.prop.timer!="") ? { name: _cell.prop.timer , duration: _cell.prop.duration } : null },
		get source()			{ return new WorkflowState(graph,_stateFromID(_cell.source.id)) },
		get target()			{ return new WorkflowState(graph,_stateFromID(_cell.target.id)) },
	}
};

var WorkflowState = function(graph,cell) {
	var _cell = cell;
	var _graph = graph;
	return {
		isStart: function() { return _cell.prop.stateinfo ? _cell.prop.stateinfo.bStart : false },
		get name() {
			return _cell.attrs.text ? _cell.attrs.text.text : 'Start'
			},
		get transitions() {
			return $.map( $.grep(_graph.cells, function(e) { return (e.type == "fsa.Arrow") && (e.source.id == _cell.id) }) , function(l) {
				return new WorkflowLink(_graph,l)
			});
		},
		get id()			{ return _cell.id },
		get comment()			{ return _cell.prop.comment || "" },
		get conditions()	{ return _cell.prop.conditions || [] },
		get onEnter()		{ return _cell.prop.onEnter || [] },
		get onEnterScenes() { return _cell.prop.onEnterScenes || [] },
		get onEnterLua()	{ return _cell.prop.onEnterLua || "" },
		get onExit()		{ return _cell.prop.onExit || [] },
		get onExitScenes()	{ return _cell.prop.onExitScenes || [] },
		get onExitLua()		{ return _cell.prop.onExitLua || "" }
	}
};

var Workflow = function (altuiid) {
	var _workflow = WorkflowManager.getWorkflow(altuiid);
	var _graph = JSON.parse(_workflow.graph_json);

	return {
		updateGraph: function() {
			_workflow.graph_json = JSON.stringify(_graph)
		},
		get name() {		return _workflow.name },
		get states() {
			if (_graph==null)
				return []
			return $.map( $.grep(_graph.cells, function(e) { return e.type != "fsa.Arrow" }) , function(s) {
				return new WorkflowState(_graph,s);
			})
		},
		get transitions() {
			if (_graph==null)
				return []
			return $.map( $.grep(_graph.cells, function(e) { return e.type == "fsa.Arrow" }) , function(s) {
				return new WorkflowLink(_graph,s);
			})
		}
	}
};

var WorkflowManager = (function() {
	var _def_workflow = {
		altuiid:'',
		name:'',
		paused:false,
		active_state:null,
		graph_json: null		// json serialized object for the JOINTJS graph.   cellsview.model.attributes.props contains the other info
	};
	var _def_nodeprops = {
		stateinfo : { bStart:false, timer:null },
		onEnter: [],			// table of device,service,action,arguments,
		onEnterScenes: [],		// table of sceneID,
		onEnterLua: '',
		onExit: [],
		onExitScenes: [],
		onExitLua: '',
		comment:""					// user comment
	};
	var _def_linkprops = {
		conditions: [],			// table of device,service,variable, expression with new
		workflows: [],			// table of workflows,state
		schedule: null,			// schedule ( timer of scene )
		timer: "",					// timer name
		smooth: true,				// smooth link
		duration: "",				// duration ms
		comment:""					// user comment
	};

	var _def_TimerLabelAttrs = {
		position: 0.8,
		attrs: {
			rect:{ fill:'white'},
			text: { text: '' , 'font-weight': '100', 'font-size':'0.6em', 'fill':'red' }
		}
	}

	var _workflows = null;
	var _saveNeeded = false;

	function _findWorkflowIdxByAltuiid(altuiid) {
		for( var i=0; i<_workflows.length; i++)
			if (_workflows[i].altuiid==altuiid)
				return i;
		return null;
	};

	function _IDToName(id) {
		for( var idx=0; idx<_workflows.length; idx++) {
			var workflow = _workflows[idx];
			if (workflow.graph_json) {
				var graph = JSON.parse(workflow.graph_json)
				for (var i = 0 ; i<graph.cells.length ; i++ ) {
					var cell = graph.cells[i];
					if (cell.id==id) {
						switch( cell.type ) {
							case "fsa.State":
							case "devs.Model":
								return cell.attrs.text ? cell.attrs.text.text : 'Start'
							case "fsa.Arrow":
							case "link":
								return cell.labels[0].attrs.text.text;
						}
					}
				}
			}
		}
		return null;
	};

	function _init(workflows) {
		_workflows = workflows;
		// fix old data model
		$.each(workflows,  function(i,w) {
			w = $.extend( {}, _def_workflow, w);
			delete w.active_states;
			$.each(w.graph_json.cells.filter( function(c) { return c.type == "fsa.Arrow" } ), function(idx,l) {
				// selector field seems useless and sometime corrupted ( &gt; instead of > ) so we remove it
				if (l.source.selector)
					delete l.source.selector
			})
			// if not compacted, compact it
			// if already string, do not touch it
			if ($.isPlainObject(_workflows[i].graph_json))
				_workflows[i].graph_json = JSON.stringify(w.graph_json)
		})
	};

	function _upgradeWorkflowToFsa(workflow) {
		var bSaveNeeded = false
		var graph2 =  new joint.dia.Graph();
		var mapIDtoID = {}
		if (workflow.graph_json) {
			var graph = JSON.parse(workflow.graph_json)
			for (var i = 0 ; i<graph.cells.length ; i++ ) {
				var cell = graph.cells[i];
				switch( cell.type ) {
					case "devs.Model":
						var node = (cell.prop.stateinfo.bStart == true )
											? WorkflowManager.Start()
											: WorkflowManager.Node( cell.attrs[".label"].text, cell.position.x, cell.position.y )
						mapIDtoID[ cell.id ] = node;
						node.prop(	{prop: cell.prop}  )
						// node.prop = cloneObject( cell.prop );
						node.addTo(graph2);
						bSaveNeeded=true
						break;
					default:
						break;
				}
			}
			for (var i = 0 ; i<graph.cells.length ; i++ ) {
				var cell = graph.cells[i];
				switch( cell.type ) {

					case "link":
						var link = WorkflowManager.Link(mapIDtoID[cell.source.id], mapIDtoID[cell.target.id], cell.labels[0].attrs.text.text, [])
						mapIDtoID[ cell.id ] = link;
						link.prop( {prop: cell.prop} )
						// link.prop = cloneObject( cell.prop );
						link.addTo(graph2);
						bSaveNeeded=true
						break;
					default:
						break;
				}
			}
		}
		if (bSaveNeeded==true) {
				workflow.graph_json = JSON.stringify(graph2)
		}
		return bSaveNeeded;
	}

	function _sanitizeWorkflow(altuiid) {
		var bSaveNeeded = false;
		var idx = _findWorkflowIdxByAltuiid(altuiid);
		if (idx!=null) {
			var workflow = _workflows[idx];
			if (workflow.graph_json) {
				var graph = JSON.parse(workflow.graph_json)

				for (var i = 0 ; i<graph.cells.length ; i++ ) {
					var cell = graph.cells[i];
					if ( (cell.type=="link") || (cell.type=="fsa.Arrow") ) {
						var conditions = cell.prop.conditions;
						if (conditions)
							for (var j=conditions.length-1; j>=0; j--) {
								var cond = conditions[j]
								var device = MultiBox.getDeviceByAltuiID(cond.device);
								if (device==null) {
									conditions.splice(j,1)
									bSaveNeeded=true;
								}
							}
						if (cell.prop.workflows) {
							for (var j=cell.prop.workflows.length-1; j>=0; j--) {
								var waitfor = cell.prop.workflows[j];
								var zz = _findWorkflowIdxByAltuiid(waitfor.altuiid)
								if (zz ==null) {
									cell.prop.workflows.splice(j,1)
									bSaveNeeded=true;
								} else {
									// workflow exists but we need to find the state now.
									var name = WorkflowManager.IDToName(waitfor.state)
									if (name==null) {
										cell.prop.workflows.splice(j,1)
										bSaveNeeded=true;
									}
								}
							}
						}
						if (cell.prop.schedule && (cell.prop.schedule.length==0)) {
							cell.prop.schedule =null;
							bSaveNeeded=true;
						}
						if (cell.prop.timer && cell.prop.duration && (cell.labels.length<2)) {
							cell.labels.push( _def_TimerLabelAttrs )
							bSaveNeeded=true;
						}
					} else {	 // type is dev.Models
						$.each(['onEnter','onExit'], function(k,type) {
							var actions = cell.prop[type];
							if (actions)
								for (var j=actions.length-1; j>=0; j--) {
									var device = MultiBox.getDeviceByAltuiID(actions[j].device)
									if (device==null) {
										actions.splice(j,1)
										bSaveNeeded=true;
									}
								}
						})
						$.each(['onEnterScenes','onExitScenes'], function(k,type) {
							var scenes = cell.prop[type];
							if (scenes)
								for (var j=scenes.length-1; j>=0; j--) {
									var scene = MultiBox.getSceneByAltuiID(scenes[j].altuiid)
									if (scene==null) {
										scenes.splice(j,1)
										bSaveNeeded=true;
									}
								}
						})
						var conditions = cell.prop.conditions;
						if (conditions)	 // only start state has conditions
						{
							for (var j=conditions.length-1; j>=0; j--) {
								var cond = conditions[j]
								var device = MultiBox.getDeviceByAltuiID(cond.device);
								if (device==null) {
									conditions.splice(j,1)
									bSaveNeeded=true;
								}
							}
						}
					}
				}
			}
			if (bSaveNeeded) {
				workflow.graph_json = JSON.stringify(graph)
			}
			var bSaveNeeded2 =_upgradeWorkflowToFsa(workflow);
			bSaveNeeded = bSaveNeeded || bSaveNeeded2
		}
		return bSaveNeeded
	};

	function _forceReloadWorkflows() {
		var altuidevice = MultiBox.getDeviceByID( 0, g_ALTUI.g_MyDeviceID );
		var names = $.map( _workflows, function(workflow,idx) {	return workflow.altuiid;	} );
		MultiBox.saveData( "Wflow", "Workflows", JSON.stringify(names), function(data) {
			if (data!="") {
				PageMessage.message("Save Workflows success", "success");
				var status = parseInt(MultiBox.getStatus(altuidevice, "urn:upnp-org:serviceId:altui1", "EnableWorkflows")||'');
				// only force reload if status was not disabled
				if(status==1)
					MultiBox.runAction(altuidevice, "urn:upnp-org:serviceId:altui1", "EnableWorkflows", {newWorkflowMode:1})
			}
			else
				PageMessage.message("Save Workflows failure", "danger");
		});
	};

	function _saveWorkflow(altuiid,bReload) {
		var dfd = $.Deferred();
		if (bReload==undefined)
			bReload = true;

		var idx = _findWorkflowIdxByAltuiid(altuiid);
		if (_workflows[idx] !=null) {
			var workflow = _workflows[idx];

			MultiBox.saveData( "Wflow", workflow.altuiid, JSON.stringify(workflow), function(data) {
			if (data!="") {
				PageMessage.message("Save for "+workflow.name+" succeeded.", "success");
				MyLocalStorage.set("Workflows",_workflows);

				// forces ALTUI device to reload workflows
				if (bReload==true) {
					_forceReloadWorkflows();
				}
				dfd.resolve();
			}
			else
				PageMessage.message( "Save for "+workflow.name+" did not succeed." , "danger");
				dfd.resolve();
			});
		} else
			dfd.resolve();
		return dfd.promise()
	};

	function _saveWorkflows(callback) {
		AltuiDebug.debug("WorkflowManager.saveWorkflows(), workflows="+JSON.stringify(_workflows));
		// MyLocalStorage.set("Workflows",_workflows);

		function _saveW(i) {
			if (i>=_workflows.length) {
				// this is the end !
				_saveNeeded = false;
				_forceReloadWorkflows();
				if ($.isFunction(callback)) {
					(callback)()
				}
				return;
			}
			var workflow = _workflows[i];
			WorkflowManager.resyncScenes(workflow.altuiid);
			WorkflowManager.sanitizeWorkflow(workflow.altuiid);
			$.when( _saveWorkflow(workflow.altuiid,false) )
			.then( function() {
				_saveW(i+1)
			})
		}

		_saveW(0);
	};

	function _addWorkflow(workflow) {
		var altuiid="";
		if (_workflows.length==0)
			altuiid="0-1";
		else {
			// find next altuiid
			var ids = $.map(_workflows, function(w) {
				return( parseInt(w.altuiid.split("-")[1]) )
			})
			var max = ids.reduce(function(a, b) {
				return Math.max(a, b);
			});
			altuiid = "0-"+(max+1)
		}
		if (workflow)
			delete workflow.altuiid	// make sure we use the new ALTUIID
		_workflows.push( $.extend(true, {}, _def_workflow, { altuiid:altuiid, name:'Workflow '+altuiid } , workflow || {}) );
		_saveNeeded = true;
	};

	function _deleteWorkflow(altuiid) {
		var idx = _findWorkflowIdxByAltuiid(altuiid);
		if (idx!=null) {
			// delete scenes for this workflow
			WorkflowManager.deleteScenes(altuiid);
			_workflows.splice(idx,1);
			_saveNeeded = true;
			return true;
		}
		return false;
	};

	function _renameWorkflow(altuiid,name) {
		var idx = _findWorkflowIdxByAltuiid(altuiid);
		if (idx!=null) {
			if (_workflows[idx].name == name)	return;		// cannot rename with same name
			var names = $.map(_workflows, function(w) { return w.name } );
			if ($.inArray(name, names) == -1) {
				_workflows[idx].name = name;
				_saveNeeded = true;
				return true;
			}
			DialogManager.warningDialog(_T("Workflow Name"),_T("Workflow names must be unique"));
		}
		return false;
	};
	function _resetWorkflow(altuiid) {
		var altuidevice = MultiBox.getDeviceByID( 0, g_ALTUI.g_MyDeviceID );
		MultiBox.runAction( altuidevice, "urn:upnp-org:serviceId:altui1", "ResetWorkflow", {workflowAltuiid:altuiid} );
	};
	function _pauseWorkflow(altuiid, bPause) {
		var idx = _findWorkflowIdxByAltuiid(altuiid);
		if (idx==null)
			return null;
		_workflows[idx].paused = bPause;
		return _saveWorkflow(altuiid,true);	// force backend to reload
	};
	function _getWorkflow(altuiid) {
		for (var i=0; i<_workflows.length; i++) {
			if (_workflows[i].altuiid == altuiid)
				return _workflows[i];
		}
		return null;
	};
	function _setWorkflow(wkflow) {
		_saveNeeded = true;
		for (var i=0; i<_workflows.length; i++) {
			if (_workflows[i].altuiid == wkflow.altuiid) {
				_workflows[i] = cloneObject(wkflow);
				return;
			}
		}
		_workflows.push( cloneObject(wkflow) );
	};
	function _getWorkflowStats(altuiid) {
		var workflow = _getWorkflow(altuiid)
		var graph = JSON.parse(workflow.graph_json);
		var states = $.map($.grep(graph.cells, function(e) { return e.type != "fsa.Arrow" }),function(e) {
			return (e.attrs.text) ? e.attrs.text.text : 'Start' //e.attr('text/text'); // e.attrs[".label"].text;
		});
		var links = $.map($.grep(graph.cells, function(e) { return e.type == "fsa.Arrow" }),function(e) {
			return e.labels[0].attrs.text.text;
		});
		if (workflow) {
			return {
				nStates: states.length,
				States: states,
				nLinks: links.length,
				Links: links,
			}
		}
		return {
			nStates: 0,
			nLinks: 0,
		}
	};
	function _getWorkflowDescr(altuiid) {
		return new Workflow(altuiid);
	};
	function _getLinkScheduleScene(workflow_altuiid, linkid) {
		var scheduled_scene = null
		var scenes = MultiBox.getScenesSync();
		$.each(scenes, function(i,scene) {
			if ( (scene.groups) && (scene.groups.length>0) ) {
				if ( (scene.groups[0].actions) && (scene.groups[0].actions.length>0) ) {
					var action = scene.groups[0].actions[0];
					if ( (action.device == g_ALTUI.g_MyDeviceID)
						&& (action.service == "urn:upnp-org:serviceId:altui1")
						&& (action.action == "TriggerTransition")
						&& (action.arguments.length>0)
						&& (action.arguments[0].value == workflow_altuiid)
						&& (action.arguments[1].value == linkid) )
					{
							scheduled_scene = scene;
							return false;
					}
				}
			}
		})
		return scheduled_scene;
	};
	function _setLinkScheduleScene(workflow_altuiid, link) {
		// search for scene
		var scheduled_scene = _getLinkScheduleScene(workflow_altuiid, link.id)

		// create if it does not exists yet
		if (scheduled_scene==null) {
			var newid = MultiBox.getNewSceneID( MultiBox.controllerOf(workflow_altuiid).controller );
			var name = "Workflow {0}".format(workflow_altuiid);
			scheduled_scene = {
				"timers":[ link.prop.schedule ],
				"triggers":[],
				"groups":[
					{"delay":0,"actions":[
						{
								"device": g_ALTUI.g_MyDeviceID ,
								"service":"urn:upnp-org:serviceId:altui1",
								"action":"TriggerTransition",
								"arguments":[
									{"name":"workflowAltuiid","value":workflow_altuiid},
									{"name":"transitionId","value":link.id}
								]
						}
					]}
				],
				"name":name,
				"lua":"",
				"modeStatus": link.prop.schedule.modeStatus || "0",
				"paused":0,
				"id":newid.id,
				"Timestamp":0,
				"favorite":false,
				"last_run":0,
				"room":0,
				"altuiid":newid.altuiid
			}
		} else {
			scheduled_scene.timers=[ link.prop.schedule ]
			scheduled_scene.modeStatus = link.prop.schedule.modeStatus || "0"
		}
		MultiBox.editScene(scheduled_scene.altuiid , scheduled_scene);
	}
	function _clearLinkScheduleScene(workflow_altuiid, link) {
		// search for scene
		var scheduled_scene = _getLinkScheduleScene(workflow_altuiid, link.id)
		if (scheduled_scene) {
			MultiBox.deleteScene(scheduled_scene)
		}
	};
	function _deleteScenes(workflow_altuiid) {
		// for all the other scenes for this workflow which try to trigger an existant link or a link which does not have a schedule, delete the scene
		var todel=[];
		$.each(MultiBox.getScenesSync(), function(i,scene) {
			if ( (scene.groups) && (scene.groups.length>0) ) {
				if ( (scene.groups[0].actions) && (scene.groups[0].actions.length>0) ) {
					var action = scene.groups[0].actions[0];
					if ( (action.device == g_ALTUI.g_MyDeviceID)
						&& (action.service == "urn:upnp-org:serviceId:altui1")
						&& (action.action == "TriggerTransition")
						&& (action.arguments.length>0)
						&& (action.arguments[0].value == workflow_altuiid))
					{
						// scene for this workflow but link is not valid
						todel.push(scene);
					}
				}
			}
		})
		$.each(todel, function(idx,scene) {
			MultiBox.deleteScene(scene)
		})
	}
	function _resyncScenes(workflow_altuiid) {
		// find workflow
		var workflow = _getWorkflow(workflow_altuiid)
		if (!workflow)
			return;

		var graph = JSON.parse(workflow.graph_json);
		var links = (graph==null) ? [] : $.grep(graph.cells, function(e) { return e.type == "fsa.Arrow" });
		var maplinks = {}
		// for all link conditions which contains a schedule
		// find the corresponding scene, if found edit , otherwise create
		// for all link conditions which do not a schedule
		// remove the eventual corresponding scene if it exists
		$.each(links, function(idx,link) {
			maplinks[ link.id ] = link;
			if (link.prop.schedule) {
				//Search Create or Edit scene
				_setLinkScheduleScene(workflow_altuiid, link)
			} else	{
				_clearLinkScheduleScene(workflow_altuiid, link)
			}
		})

		// for all the other scenes for this workflow which try to trigger an existant link or a link which does not have a schedule, delete the scene
		var todel=[];
		$.each(MultiBox.getScenesSync(), function(i,scene) {
			if ( (scene.groups) && (scene.groups.length>0) ) {
				if ( (scene.groups[0].actions) && (scene.groups[0].actions.length>0) ) {
					var action = scene.groups[0].actions[0];
					if ( (action.device == g_ALTUI.g_MyDeviceID)
						&& (action.service == "urn:upnp-org:serviceId:altui1")
						&& (action.action == "TriggerTransition")
						&& (action.arguments.length>0)
						&& (action.arguments[0].value == workflow_altuiid)
						&& (maplinks[ action.arguments[1].value ] == undefined) )
					{
						// scene for this workflow but link is not valid
						todel.push(scene);
					}
				}
			}
		})
		$.each(todel, function(idx,scene) {
			MultiBox.deleteScene(scene)
		})
	};
	function _setGraph(altuiid,jsonstr) {
		var idx = _findWorkflowIdxByAltuiid(altuiid);
		if (idx!=null) {
			_workflows[idx].graph_json = jsonstr;
			return true;
		}
		return false;
	};
	function _Start() {
		// joint.shapes.fsa.myStartState = joint.shapes.fsa.StartState.extend({
			// markup: '<g class="rotatable"><g class="scalable"><circle/></g><text/></g>',
			// defaults: _.defaultsDeep({
				// type: 'fsa.myStartState',
				// size: { width: 20, height: 20 },
				// attrs: {
					// circle: {
					// transform: 'translate(10, 10)',
					// r: 10,
					// fill: '#000000'
					// }
				// }
			// },
			// joint.shapes.fsa.StartState.prototype.defaults)
		// });
		var m1 = new joint.shapes.fsa.StartState({
			position: { x: 5, y: 5 },
			attrs: {
				// text : { "text": "ST" , 'font-weight': '200' , 'font-size':'.8em'},
				'circle': { magnet: true , fill: '#2ECC71' }
			},
			// custom attributes
			prop: WorkflowManager.getNodeProperties( {
				stateinfo : {bStart:true},
			}),
		});
		m1.attr( {
				circle: { magnet: true , fill: '#2ECC71' }
			}
		);
		return m1;
	}
	function _Node(label,x,y) {
		var m1 = new joint.shapes.fsa.State({
			position: { x: x, y: y },
			size: { width: 65, height: 65 },
			attrs: {
				text : { text: label , 'font-weight': '200' , 'font-size':'.8em'},
				'circle': { magnet: true, 'stroke-width': 2 }
			},
			// custom attributes
			prop:WorkflowManager.getNodeProperties( {} ),
		})
		return m1;
	}
	function _Link(source, target, label, vertices) {
		var opt = {
				labels: [
					{ position: 0.4, attrs: { text: { text: label || '' , 'font-weight': '200', 'font-size':'0.8em' } } },
					_def_TimerLabelAttrs
				],
				prop:WorkflowManager.getLinkProperties( {} ),
				vertices: vertices || []
		};
		if (source) {
			opt.source = { id: source.id }
		}
		if (target) {
			opt.target = { id: target.id }
		}
		var cell = new joint.shapes.fsa.Arrow( opt );
		return cell;
	}
	function _updateLinkTimerLabel(view,link,val) {
		if (link.attributes.labels.length>=2) {
			if (val==null) {
				view.model.label(1,{ attrs: { text: { text: '' } }})
			} else {
					var txt = ''
					if ( val <60 )
						txt = val.toString()
					else {
						var date = new Date(null); date.setSeconds(val);
						txt = date.toISOString().substr(11, 8)
					}
					// if (ALTUI_registered!=true)
						// txt=''
					view.model.label(1,{ attrs: { text: { text: txt } }})
			}
		}
	}
	return {
		init: _init,
		Start: _Start,
		Node: _Node,
		Link: _Link,
		updateLinkTimerLabel: _updateLinkTimerLabel,
		IDToName: _IDToName,
		saveNeeded : function()		{ return _saveNeeded; },
		getNodeProperties: function( obj )	{ return $.extend(true,{},_def_nodeprops, obj) },	// insure the defaults evolves
		getLinkProperties: function( obj )	{ return $.extend(true,{},_def_linkprops, obj) },
		getWorkflows : function()	{ return _workflows; },
		getWorkflow: _getWorkflow,
		setWorkflow: _setWorkflow,	// workflow
		getWorkflowStats : _getWorkflowStats,		// (altuiid)
		getWorkflowDescr : _getWorkflowDescr,	// (altuiid)
		clearLinkScheduleScene : _clearLinkScheduleScene,	// workflow_altuiid, link
		deleteScenes : _deleteScenes,	// workflow_altuiid
		resyncScenes : _resyncScenes,	// workflow_altuiid
		setGraph: _setGraph,
		saveWorkflows : _saveWorkflows,
		saveWorkflow : _saveWorkflow,				// (altuiid)
		addWorkflow : _addWorkflow,
		deleteWorkflow: _deleteWorkflow,
		renameWorkflow: _renameWorkflow,
		resetWorkflow: _resetWorkflow,			//(altuiid)
		pauseWorkflow: _pauseWorkflow,			//(altuiid)
		sanitizeWorkflow: _sanitizeWorkflow
	}
})();

var OAuth = (function() {
	function _getDeviceCode() {
		var url = "data_request?id=lr_ALTUI_Handler&command=get_device_code";
		return $.ajax({
			url:url,
			type: "GET",
			data: {
				client_id: "115256773336-e8qdncs5ac5cfmodhltsh2cgvk6jdr65.apps.googleusercontent.com",
				scope: "email profile"
			}
		});
	};

	function _getAuthToken() {
		var url = "data_request?id=lr_ALTUI_Handler&command=get_auth_token";
		return $.ajax({
			url:url,
			type: "GET",
		});
	};

	function _refreshAuthToken() {
		var url = "data_request?id=lr_ALTUI_Handler&command=refresh_auth_token";
		return $.ajax({
			url:url,
			type: "GET",
		});
	};

	function _OAuthCall( execFunc , param, notifCB , dataCB , failureCB ) {
		var notifCB = notifCB;
		var dataCB = dataCB;
		var failureCB = failureCB;
		function _tryAuthToken(n, interval) {
			(notifCB)(2,_T("{0} Tentative #{1}/10").format(glyphTemplate.format( "refresh", _T("Refresh"), "text-warning glyphicon-spin" ),n))
			_getAuthToken()
				.done( function(data, textStatus, jqXHR) {
					data = JSON.parse(data)
					if (data.access_token != undefined ) {
						(execFunc)(param).done( function(data) {
							var result = null;
							if ( typeof data === "string" ) {
								try {result = JSON.parse( data ) }
								catch(e) {result={result:false}}
							} else {
								result = data;
							}
							(dataCB)( result );
						});
					} else	if ( n<10 ) {
						setTimeout( function() { _tryAuthToken(n+1,interval)  } , interval*1000 )
					} else {
						(notifCB)(1,_T("Failure after 10 tentatives, try again..."));
						(failureCB)("");
					}
				})
				.fail( function(jqXHR, textStatus, errorThrown) {
					(failureCB)(textStatus)
				})
		}

		(execFunc)(param)
		.done( function(data) {
			var result = null;
			if ( typeof data === "string" ) {
				try {result = JSON.parse( data ) }
				catch(e) {result={result:false}}
			} else {
				result = data;
			}
			//{"error":{"code":400,"message":"Token has been revoked. - invalid_grant","step":"Get access token from refresh token"}}
			if ((result.result==false) || (result.error && result.error.code==400)){
				(notifCB)(1, _T("Refreshing Token...") )
				_refreshAuthToken() .done( function(data) {
					var tokens;
					try { tokens = JSON.parse(data) }
					catch (e) { tokens = {result:false} }
					if (tokens.result == false) {
						// if refresh failed, try the whole process from the start
						(notifCB)(1,_T("Authenticating client device..."))
						_getDeviceCode().done( function(data, textStatus, jqXHR) {
								data = JSON.parse(data);
								(notifCB)( 1,_T("Please go to this page <a href='{1}' target='_blank'>{1}</a> and enter this code : <mark>{0}</mark>").format(data.user_code,data.verification_url) )
								setTimeout( function() { _tryAuthToken( 0 , data.interval )	 } , data.interval*1000 )
							})
							.fail( function(jqXHR, textStatus, errorThrown) {
								(notifCB)( 1,_T("General Failure") )
								(failureCB)(textStatus)
							})
					} else {
						// retry from the begining
						(notifCB)( 1,_T("Token Refreshed") )
						_OAuthCall( execFunc , param, notifCB , dataCB, failureCB )
					}
				})
			} else {
					// got proper list of plugins
				(dataCB)(result)
			}
		})
		.fail( function(jqXHR, textStatus, errorThrown) {
			(failureCB)(textStatus)
		})
	}

	return {
		Call : _OAuthCall		// execFunc , param, notifCB , dataCB, failureCB
	}
})();


var BlocklyArea = (function(htmlid){
	var _htmlid = htmlid;
	var _blocklyDiv = null;
	var _workspace = null;
	function _createBlocklyArea() {
		var html="";
		html += "<div class='altui-blockly-editor' style='display: none;' >";
			html += "<div class='card xxx'>";
			html += "  <div class='card-header'>";
			html += "	 <h3 class='card-title'>Watch Expression</h3>";
			html += "  </div>";
			html += "  <div class='card-body'>";
				html+="<xml id='toolbox' style='display: none'>";
				html+="	   <category name='Watch Types'>";
				html+="		 <block type='when'></block>";
				html+="		 <block type='whensince'></block>";
				html+="	   </category>";
				html+="	   <category name='Variable'>";
					html+="	 <block type='new_value'></block>";
					html+="	 <block type='old_value'></block>";
					// html+="	<block type='variables_get'>";
					// html+="	  <field name='VAR'>new</field>";
					// html+="	</block>";
					// html+="	<block type='variables_get'>";
					// html+="	  <field name='VAR'>old</field>";
					// html+="	</block>";
				html+="	   </category>";
				html+="	   <category name='Time'>";
					html+="	 <block type='now_value'></block>";
					html+="	 <block type='lastupdate_value'></block>";
					html+="	 <block type='duration'></block>";
					html+="	 <block type='duration_value'></block>";
				html+="	   </category>";
				html+="	   <category name='Luup'>";
					html+="	 <block type='device'></block>";
				html+="	   </category>";
				html+="	   <category name='Logic'>";
				// html+="		<block type='controls_if'></block>";
				html+="		 <block type='logic_compare'></block>";
				html+="		 <block type='logic_operation'></block>";
				html+="		 <block type='logic_negate'></block>";
				html+="		 <block type='logic_boolean'></block>";
				html+="		 <block type='logic_null'></block>";
				html+="		 <block type='logic_ternary'></block>";
				html+="	   </category>";
				// html+="	  <category id='catLoops'>";
				// html+="		<block type='controls_repeat_ext'>";
				// html+="		  <value name='TIMES'>";
				// html+="			<block type='math_number'>";
				// html+="			  <field name='NUM'>10</field>";
				// html+="			</block>";
				// html+="		  </value>";
				// html+="		</block>";
				// html+="		<block type='controls_whileUntil'></block>";
				// html+="		<block type='controls_for'>";
				// html+="		  <value name='FROM'>";
				// html+="			<block type='math_number'>";
				// html+="			  <field name='NUM'>1</field>";
				// html+="			</block>";
				// html+="		  </value>";
				// html+="		  <value name='TO'>";
				// html+="			<block type='math_number'>";
				// html+="			  <field name='NUM'>10</field>";
				// html+="			</block>";
				// html+="		  </value>";
				// html+="		  <value name='BY'>";
				// html+="			<block type='math_number'>";
				// html+="			  <field name='NUM'>1</field>";
				// html+="			</block>";
				// html+="		  </value>";
				// html+="		</block>";
				// html+="		<block type='controls_forEach'></block>";
				// html+="		<block type='controls_flow_statements'></block>";
				// html+="	  </category>";
				html+="	   <category name='Math'>";
				html+="		 <block type='math_number'></block>";
				html+="		 <block type='math_arithmetic'></block>";
				html+="		 <block type='math_single'></block>";
				html+="		 <block type='math_trig'></block>";
				html+="		 <block type='math_constant'></block>";
				html+="		 <block type='math_number_property'></block>";
				// html+="		<block type='math_change'>";
				// html+="		  <value name='DELTA'>";
				// html+="			<block type='math_number'>";
				// html+="			  <field name='NUM'>1</field>";
				// html+="			</block>";
				// html+="		  </value>";
				// html+="		</block>";
				html+="		 <block type='math_round'></block>";
				// html+="		<block type='math_on_list'></block>";
				html+="		 <block type='math_modulo'></block>";
				// html+="		<block type='math_constrain'>";
				// html+="		  <value name='LOW'>";
				// html+="			<block type='math_number'>";
				// html+="			  <field name='NUM'>1</field>";
				// html+="			</block>";
				// html+="		  </value>";
				// html+="		  <value name='HIGH'>";
				// html+="			<block type='math_number'>";
				// html+="			  <field name='NUM'>100</field>";
				// html+="			</block>";
				// html+="		  </value>";
				// html+="		</block>";
				// html+="		<block type='math_random_int'>";
				// html+="		  <value name='FROM'>";
				// html+="			<block type='math_number'>";
				// html+="			  <field name='NUM'>1</field>";
				// html+="			</block>";
				// html+="		  </value>";
				// html+="		  <value name='TO'>";
				// html+="			<block type='math_number'>";
				// html+="			  <field name='NUM'>100</field>";
				// html+="			</block>";
				// html+="		  </value>";
				// html+="		</block>";
				// html+="		<block type='math_random_float'></block>";
				html+="	   </category>";
				html+="	   <category name='Text'>";
				html+="		 <block type='text'></block>";
				html+="		 <block type='text_join'></block>";
				html+="		 <block type='text_append'>";
				html+="		   <value name='TEXT'>";
				html+="			 <block type='text'></block>";
				html+="		   </value>";
				html+="		 </block>";
				html+="		 <block type='text_length'></block>";
				html+="		 <block type='text_tonumber'></block>";
				html+="		 <block type='text_isEmpty'></block>";
				html+="		 <block type='text_indexOf'>";
				html+="		   <value name='VALUE'>";
				html+="			 <block type='variables_get'>";
				html+="			   <field name='VAR' class='textVar'>...</field>";
				html+="			 </block>";
				html+="		   </value>";
				html+="		 </block>";
				html+="		 <block type='text_charAt'>";
				html+="		   <value name='VALUE'>";
				html+="			 <block type='variables_get'>";
				html+="			   <field name='VAR' class='textVar'>...</field>";
				html+="			 </block>";
				html+="		   </value>";
				html+="		 </block>";
				html+="		 <block type='text_getSubstring'>";
				html+="		   <value name='STRING'>";
				html+="			 <block type='variables_get'>";
				html+="			   <field name='VAR' class='textVar'>...</field>";
				html+="			 </block>";
				html+="		   </value>";
				html+="		 </block>";
				html+="		 <block type='text_changeCase'></block>";
				html+="		 <block type='text_trim'></block>";
				// html+="		<block type='text_print'></block>";
				// html+="		<block type='text_prompt_ext'>";
				// html+="		  <value name='TEXT'>";
				// html+="			<block type='text'></block>";
				// html+="		  </value>";
				// html+="		</block>";
				html+="	   </category>";
				// html+="	  <category id='catLists'>";
				// html+="		<block type='lists_create_empty'></block>";
				// html+="		<block type='lists_create_with'></block>";
				// html+="		<block type='lists_repeat'>";
				// html+="		  <value name='NUM'>";
				// html+="			<block type='math_number'>";
				// html+="			  <field name='NUM'>5</field>";
				// html+="			</block>";
				// html+="		  </value>";
				// html+="		</block>";
				// html+="		<block type='lists_length'></block>";
				// html+="		<block type='lists_isEmpty'></block>";
				// html+="		<block type='lists_indexOf'>";
				// html+="		  <value name='VALUE'>";
				// html+="			<block type='variables_get'>";
				// html+="			  <field name='VAR' class='listVar'>...</field>";
				// html+="			</block>";
				// html+="		  </value>";
				// html+="		</block>";
				// html+="		<block type='lists_getIndex'>";
				// html+="		  <value name='VALUE'>";
				// html+="			<block type='variables_get'>";
				// html+="			  <field name='VAR' class='listVar'>...</field>";
				// html+="			</block>";
				// html+="		  </value>";
				// html+="		</block>";
				// html+="		<block type='lists_setIndex'>";
				// html+="		  <value name='LIST'>";
				// html+="			<block type='variables_get'>";
				// html+="			  <field name='VAR' class='listVar'>...</field>";
				// html+="			</block>";
				// html+="		  </value>";
				// html+="		</block>";
				// html+="		<block type='lists_getSublist'>";
				// html+="		  <value name='LIST'>";
				// html+="			<block type='variables_get'>";
				// html+="			  <field name='VAR' class='listVar'>...</field>";
				// html+="			</block>";
				// html+="		  </value>";
				// html+="		</block>";
				// html+="		<block type='lists_split'>";
				// html+="		  <value name='DELIM'>";
				// html+="			<block type='text'>";
				// html+="			  <field name='TEXT'>,</field>";
				// html+="			</block>";
				// html+="		  </value>";
				// html+="		</block>";
				// html+="	  </category>";
				// html+="	  <category id='catColour'>";
				// html+="		<block type='colour_picker'></block>";
				// html+="		<block type='colour_random'></block>";
				// html+="		<block type='colour_rgb'>";
				// html+="		  <value name='RED'>";
				// html+="			<block type='math_number'>";
				// html+="			  <field name='NUM'>100</field>";
				// html+="			</block>";
				// html+="		  </value>";
				// html+="		  <value name='GREEN'>";
				// html+="			<block type='math_number'>";
				// html+="			  <field name='NUM'>50</field>";
				// html+="			</block>";
				// html+="		  </value>";
				// html+="		  <value name='BLUE'>";
				// html+="			<block type='math_number'>";
				// html+="			  <field name='NUM'>0</field>";
				// html+="			</block>";
				// html+="		  </value>";
				// html+="		</block>";
				// html+="		<block type='colour_blend'>";
				// html+="		  <value name='COLOUR1'>";
				// html+="			<block type='colour_picker'>";
				// html+="			  <field name='COLOUR'>#ff0000</field>";
				// html+="			</block>";
				// html+="		  </value>";
				// html+="		  <value name='COLOUR2'>";
				// html+="			<block type='colour_picker'>";
				// html+="			  <field name='COLOUR'>#3333ff</field>";
				// html+="			</block>";
				// html+="		  </value>";
				// html+="		  <value name='RATIO'>";
				// html+="			<block type='math_number'>";
				// html+="			  <field name='NUM'>0.5</field>";
				// html+="			</block>";
				// html+="		  </value>";
				// html+="		</block>";
				// html+="	  </category
				// html+="	  <sep></sep>";
				// html+="	  <category id='catVariables' custom='VARIABLE'></category>";
				// html+="	  <category id='catFunctions' custom='PROCEDURE'></category>";
				html+="	 </xml>";
				html += _T("Watch Formula");
				html += "<div id='blocklyDiv' style='height: 280px; width: 100%;'></div>";
				// html += "<div id='blocklyDiv' style='height: 480px; width: 600px;'></div>";
				html += _T("Generated code");
				html += "<pre id='blocklyDivCode'></pre>";
				html += buttonTemplate.format( 'altui-close-blockly', '', _T('Close'),'default',_T('Close'));
				html += buttonTemplate.format( 'altui-save-blockly', '', _T('Submit'),'primary',_T('Save'));
			html += "  </div>";
			html += "</div>";
		html += "</div>";
		return html
	};

	function _myUpdateFunction() {
		var code = Blockly.Lua.workspaceToCode(_workspace);
		$("#blocklyDivCode").text(code);
	}
	function _initBlocklyEditor(blocklyDiv,toolboxid,initxml,callback) {
		_blocklyDiv= blocklyDiv;
		// create if needed, just show otherwise
		if ((_workspace==null) || ($("#"+blocklyDiv+" SVG").length==0) ){
			_workspace = Blockly.inject(blocklyDiv,{toolbox: document.getElementById(toolboxid)});
			_workspace.addChangeListener(_myUpdateFunction);
			$(".altui-blockly-editor").data('workspace',_workspace);
		}
		else {
			$(".altui-blockly-editor #"+_blocklyDiv).toggle(true);
			$(".altui-blockly-editor").toggle(true);
			$(".blocklyToolboxDiv").toggle(true);
		}

		// init content
		if (initxml !="") {
			var xml = Blockly.Xml.textToDom(initxml || "");
			Blockly.Xml.domToWorkspace(_workspace, xml);
		}
		else {
			Blockly.mainWorkspace.clear();
		}

		// init callback
		$("#altui-close-blockly").off('click').click( function() {
			if ($.isFunction(callback)) {
				(callback)(null,null);
			}
		});
		$("#altui-save-blockly").off('click').click( function() {
			if ($.isFunction(callback)) {
				var txt = trim($("#blocklyDivCode").text());
				var xmlstr = Blockly.Xml.domToText( Blockly.Xml.workspaceToDom(_workspace) );
				(callback)(txt,xmlstr);
			}
		});
	};
	function _hideEditor() {
		_workspace.removeChangeListener(_myUpdateFunction);
		// $(".altui-blockly-editor").data('workspace',null);
		$("#blocklyDivCode").text("");
		$(".altui-blockly-editor #"+_blocklyDiv).toggle(false);
		$(".altui-blockly-editor").toggle(false);
		$(".blocklyToolboxDiv").toggle(false);
		$(".blocklyWidgetDiv").empty();
	};
	return {
		createBlocklyArea: _createBlocklyArea,
		initBlocklyEditor: _initBlocklyEditor,
		hideEditor: _hideEditor,
	};
})();

var IconDB = ( function (window, undefined) {
	var _dbIcon = null;

	function _getDynamicIcon( controllerid, name , cbfunc ) {
		if (_dbIcon == null) {
			_dbIcon = MyLocalStorage.get("IconDB");
			if (_dbIcon==null)
				_dbIcon={}
		}

		// do not load http based sources from the VERA itself
		if (name.startsWith("http"))
			return name;

		// if undefined and not yet started to fetch, then go fetch it
		if (_dbIcon[name]==undefined) {
			_dbIcon[name]="pending"
			/*$.ajax({
				url:  MultiBox.getIconPath(controllerid, name ),
				dataType: "xml",
				crossDomain: true,
				cache:false,
				async:false,
				success: function (data) {
					_dbIcon[name] = data;
				}
			});
			*/
			MultiBox.loadIcon(controllerid,	MultiBox.getIconPath(controllerid, name ), function(data) {
				// store in cache and call callback
				_dbIcon[name]=$.parseXML(data);
				if ($.isFunction(cbfunc))
					cbfunc(data);
			});
		}

		// if not yet there, or still pending , return nothing - it will arrive later in a callback
		return ((_dbIcon[name]!=undefined) && (_dbIcon[name]!="pending"))  ? _dbIcon[name] : "" ;
	};

	function _getIconContent( controllerid, name , cbfunc ) {
		if (_dbIcon == null) {
			_dbIcon = MyLocalStorage.get("IconDB");
			if (_dbIcon==null)
				_dbIcon={}
		}

		// do not load http based sources from the VERA itself
		if (name.startsWith("http"))
			return name;
		else if (name.startsWith("data:")) {
			_dbIcon[name] = name;
			return name;
		}

		// if undefined and not yet started to fetch, then go fetch it
		if (_dbIcon[name]==undefined) {
			_dbIcon[name]="pending"
			MultiBox.getIconContent(controllerid,	name, function(data) {
				// store in cache and call callback
				_dbIcon[name]=data;
				if ($.isFunction(cbfunc))
					cbfunc(data);
			});
		}

		// if not yet there, or still pending , return nothing - it will arrive later in a callback
		return ((_dbIcon[name]!=undefined) && (_dbIcon[name]!="pending"))  ? _dbIcon[name] : "" ;
	};

	return {
		getDynamicIcon	: _getDynamicIcon,	// ( controllerid, name , cbfunc )
		getIconContent	: _getIconContent,	// ( controllerid, name , cbfunc )
		isDB			: function()	{	return MyLocalStorage.get("IconDB")!=null;			},
		saveDB			: function()	{	MyLocalStorage.set("IconDB", _dbIcon);		},
		resetDB			: function()	{	MyLocalStorage.clear("IconDB"); _dbIcon = {}; }
	}
} )( window );

var HtmlResourcesDB = (function (window,undefined) {
	var _resourceLoaded=[]
	$.each( document.scripts, function(idx,s) { _resourceLoaded[$(s).attr("src")] = true  });

	var _location = document.location.pathname.replace( "/data_request", "" ) + "/";
	function _loadResourcesAsync( fileNames ) {
		var d = $.Deferred();
		// Prepare loaders
		var loaders = [];
		$.each( fileNames, function( index, fileName ) {
			if ( !_resourceLoaded[ fileName ] ) {
				loaders.push(
					$.ajax( {
						url: (fileName.indexOf( "http" ) === 0 ? fileName: _location + fileName),
						dataType: "script",
						beforeSend: function( jqXHR, settings ) {
							jqXHR.fileName = fileName;
						}
					} )
				);
			}
		} );
		// Execute loaders
		$.when.apply( $, loaders )
			.done( function( xml, textStatus, jqxhr ) {
				if (loaders.length === 1) {
					_resourceLoaded[ jqxhr.fileName ] = true;
				} else if (loaders.length > 1) {
					// arguments : [ [ xml, textStatus, jqxhr ], ... ]
					// clone to avoid loosing the jqxhr as it sees jquery recycles it
					var args = new Array(arguments.length);
					for (var i = 0; i < args.length; ++i) {
						args[i] = cloneObject(arguments[i]);
					}
					for (var i = 0; i < args.length; i++) {
						jqxhr = args[ i ][ 2 ];
						_resourceLoaded[ jqxhr.fileName ] = true;
					}
				}
				d.resolve();
			} )
			.fail( function( jqxhr, textStatus, errorThrown	 ) {
				PageMessage.message( "Load \"" + jqxhr.fileName + "\" : " + textStatus + " - " + errorThrown, "danger");
				d.reject();
			} );
		return d.promise();
	}
	return {
		loadResourcesAsync: _loadResourcesAsync	// return a promise
	}
})();

var FileDB = ( function (window, undefined) {
	var _dbFile = null;

	function _getFileContent( controllerid, name, cbfunc ) {
		if (isNullOrEmpty(name))
			return
		AltuiDebug.debug("_getFileContent( {0},{1} )".format(controllerid,name));
		if (_dbFile == null) {
			_dbFile = MyLocalStorage.get("FileDB");
			if (_dbFile==null)
				_dbFile={}
		}

		if ($.isFunction(cbfunc)==false)
			return null;

		if (_dbFile[name]!=undefined)
			if (_dbFile[name]=="pending")
			{
				AltuiDebug.debug("_getFileContent( {0} ) ==> not yet here, defered in 200ms".format(name));
				setTimeout( FileDB.getFileContent, 200, controllerid,name,cbfunc );
			}
			else {
				AltuiDebug.debug("_getFileContent( {0} ) ==> returning content from cache".format(name));
				cbfunc(_dbFile[name]);
			}
		else {
			_dbFile[name]="pending";
			// console.log("getting file "+name);
			AltuiDebug.debug("_getFileContent( {0} ) ==> asking content to Vera".format(name));
			MultiBox.getFileContent( controllerid, name, function(data,jqXHR) {
				AltuiDebug.debug("_getFileContent( {0} ) ==> returning async content from Controller #{1}".format(name,controllerid));
				_dbFile[name] = data;
				cbfunc(data,jqXHR);
			});
		}
		return 0;
	};

	return {
		getFileContent	: _getFileContent,		// ( controllerid, name, cbfunc )
		isDB			: function()	{	return MyLocalStorage.get("FileDB")!=null;			},
		saveDB			: function(db)	{	MyLocalStorage.set("FileDB", _dbFile);		},
		resetDB			: function(db)	{	MyLocalStorage.clear("FileDB"); _dbFile = {}; }
	}
} )( window );

function _sortByVariableName(a,b)
{
	if (a.variable > b.variable)
		return 1;
	if (a.variable < b.variable)
		return -1;
	// a doit être égale à b
	return 0;
};

var WatchManager = (function() {
	function _sameWatch(watcha,watchb) {
		return	watcha.service == watchb.service &&
				watcha.variable == watchb.variable &&
				watcha.deviceid == watchb.deviceid &&
				watcha.sceneid == watchb.sceneid &&
				watcha.luaexpr == watchb.luaexpr &&
				watcha.xml == watchb.xml ;
	};

	function _getSceneWatches(scene) {
		var scenecontroller = MultiBox.controllerOf(scene.altuiid).controller;
		var sceneWatches = MultiBox.getWatches("VariablesToWatch",function(watch) { return (watch.sceneid == scene.id) && (scenecontroller==0) } );
		return sceneWatches;
	};
	function _countWatchForScene(scene) {
		var sceneWatches = _getSceneWatches(scene);
		return sceneWatches ? sceneWatches.length : 0;
	};
	return {
		// getWatchLineParams: _getWatchLineParams,
		// setWatchLineParams: _setWatchLineParams,
		sameWatch: _sameWatch,
		countWatchForScene: _countWatchForScene,
		getSceneWatches : _getSceneWatches
	};
})();

var TimerEditor = (function() {
	var timer = null;
	var _domparent = null;
	function _formatRFC3339Date(str) {	//2011-12-21T11:33:23Z
		if (str && str!='')
		{
			var datetime = str.split(' ');
			var ymd = datetime[0].split('-');
			var hms = datetime[1].split(':');
			hms[2] = hms[2] || "00";
			str = ymd[0] + '-'
				+ ('00'+ymd[1]).slice(-2) + '-'
				+ ('00'+ymd[2]).slice(-2)
				+ 'T'
				+ ('00'+hms[0]).slice(-2) + ':'
				+ ('00'+hms[1]).slice(-2) + ':'
				+ ('00'+hms[2]).slice(-2);
		}
		return str;
	};
	function _getTimerTime() {
		var template = $("#altui-widget-type-TimerTime").val();
		var val = $("#altui-widget-TimerTime").val();
		if (val=='')
			val = "00:00:00";
		return template.format( val );
	};
	function _showHideItems( timertype ) {
		switch (parseInt(timertype)) {
			case 1:	// interval
				$(_domparent).find("#altui-widget-TimerInterval,#altui-widget-TimerIntervalUnit")
					.closest("div.form-group").show();
				$(_domparent).find("#altui-widget-TimerDayOfWeek, #altui-widget-TimerDayOfMonth, #altui-widget-TimerTime, #altui-widget-TimerDateTime")
					.closest("div.form-group").hide();
				$(_domparent).find("#altui-widget-TimerDateTime").val("");
				break;
			case 2: // day of week
				$(_domparent).find("#altui-widget-TimerDayOfWeek,#altui-widget-TimerTime")
					.closest("div.form-group").show();
				$(_domparent).find("#altui-widget-TimerInterval,#altui-widget-TimerIntervalUnit, #altui-widget-TimerDayOfMonth, #altui-widget-TimerDateTime")
					.closest("div.form-group").hide();
				$(_domparent).find("#altui-widget-TimerDateTime").val("");
				break;
			case 3:	// day of month
				$(_domparent).find("#altui-widget-TimerDayOfMonth, #altui-widget-TimerTime")
					.closest("div.form-group").show();
				$(_domparent).find("#altui-widget-TimerInterval,#altui-widget-TimerIntervalUnit, #altui-widget-TimerDayOfWeek, #altui-widget-TimerDateTime")
					.closest("div.form-group").hide();
				$(_domparent).find("#altui-widget-TimerDateTime").val("");
				break;
			case 4:
				$(_domparent).find("#altui-widget-TimerDateTime")
					.closest("div.form-group").show();
				$(_domparent).find("#altui-widget-TimerInterval,#altui-widget-TimerIntervalUnit,#altui-widget-TimerDayOfWeek, #altui-widget-TimerDayOfMonth, #altui-widget-TimerTime")
					.closest("div.form-group").hide();
				break;
			case 0:
			default:
				$(_domparent).find("#altui-widget-TimerInterval,#altui-widget-TimerIntervalUnit,#altui-widget-TimerDayOfWeek, #altui-widget-TimerDayOfMonth, #altui-widget-TimerTime, #altui-widget-TimerDateTime")
					.closest("div.form-group").hide();
				$(_domparent).find("#altui-widget-TimerDateTime").val("");
		}
	};
	return {
		init: function( _timer ) {
			timer = cloneObject(_timer);
			var dialog = DialogManager.createPropertyDialog(_T('Timer'));
			DialogManager.dlgAddLine( dialog , "TimerName", _T("TimerName"), timer.name , "", {required:''} );
			DialogManager.dlgAddSelect(dialog, "TimerType", _T("TimerType"), timer.type, _timerTypes, {required:''});
			DialogManager.dlgAddTimeInterval(dialog, "TimerInterval",_T("TimerInterval"),timer.interval, _timerUnits);
			DialogManager.dlgAddDayOfWeek(dialog, "TimerDayOfWeek", _T("TimerDayOfWeek"), timer.days_of_week || '' , _timerDOW);
			DialogManager.dlgAddLine(dialog, "TimerDayOfMonth", _T("TimerDayOfMonth"), timer.days_of_month || '' ,"nn,nn,nn", {
				pattern:'^[0-9]+(,[0-9]+)*$',
				placeholder:'Enter comma separated numbers: nn,nn,nn'
			});
			DialogManager.dlgAddTime(dialog, "TimerTime", timer.time  ,_timerRelative);
			DialogManager.dlgAddDateTime(dialog, "TimerDateTime", _formatRFC3339Date(timer.abstime || ''));
			if ( _timer.modeStatus && (UIManager.UI7Check()==true))
				DialogManager.dlgAddHouseMode(dialog, "Modes", _T("Only in the following mode(s)")+" : ", _timer.modeStatus);
			return dialog;
		},
		HtmlContent: function() {
			var html = $('div#dialogModal').html();
			$('div#dialogModal').html("")
			return $( html ).find(".row").html();
		},
		getResult: function() {
			// save for real this time
			timer.name = $(_domparent+" #altui-widget-TimerName").val();
			timer.type = parseInt($(_domparent+" #altui-widget-TimerType").val());
			switch( timer.type ) {
				case 1:	// interval
					var val = $(_domparent+" #altui-widget-TimerInterval").val();
					if (val=='')
						return null;
					timer.interval = $(_domparent+" #altui-widget-TimerInterval").val()+$(_domparent+" #altui-widget-TimerIntervalUnit").val();
					break;
				case 2:	// day of week
					var tmp = $(_domparent+" #altui-widget-TimerDayOfWeek input:checked").map( function(idx,elem){ return $(elem).val() });
					timer.days_of_week = $.makeArray(tmp).join(",");
					timer.time = _getTimerTime();
					break;
				case 3:	// day of month
					timer.days_of_month = $(_domparent+" #altui-widget-TimerDayOfMonth").val();
					if (timer.days_of_month=='')
						return null;
					timer.time = _getTimerTime();
					break;
				case 4:
					timer.abstime = $(_domparent+" #altui-widget-TimerDateTime").val().replace('T',' ');
					if (timer.abstime=='')
						return null;
					break;
				case 0:
				default:
					return null;
			}
			if ( $("#altui-widget-Modes").length>0 ) {
				timer.modeStatus = HouseModeEditor.getSelectedModes();
			}
			return timer
		},
		runActionEmbedded: function(root, domparent, callback) {
			_domparent = domparent;
			_showHideItems( timer.type );
			var that = this;
			HouseModeEditor.runActions( 'div#dialogModal', function() {
			});
			$(root).off()
				.on( 'change',_domparent+" #altui-widget-TimerType", function() {
					_showHideItems( $(this).val() );
				})
				.on( 'submit',_domparent+" form", function( event ) {
					var result = that.getResult()
					if (result==null)
						return;
					if ($.isFunction(callback)) {
						(callback)(result)
					}
				});
		},
		runActions: function( callback ) {
			$('div#dialogModal').modal();
			this.runActionEmbedded('div#dialogs','div#dialogModal',function(timer) {
				$('div#dialogModal').modal('hide');
				if ($.isFunction(callback)) {
					(callback)(timer)
				}
			});
		}
	}
})();

var SceneEditor = function (scene) {
	var xsbuttonTemplate = "<button id='{0}' type='button' class='{1} btn btn-light btn-sm' aria-label='tbd' title='{3}'>{2}</button>";
	var sortable_options = {
		axis: "y",
		// containment: ".card-body",
		// handle: ".altui-scene-action",
		items: "tr.altui-scene-action",		// prevent selection of last line which is not an action
		connectWith: ".altui-scene-group tbody",		// allow to drop in other action groups
		placeholder: "altui-sortable-placeholder",
		forcePlaceholderSize : true,
		// opacity: 1,
		cursor: "move",
		delay: 150,
		disabled: (ALTUI_registered==false),
		distance: 5,
		tolerance: "pointer",
		revert: true,
		stop: function(event, ui) {
			var ids = ui.item.prop("id").split(".");
			var org_group = scene.groups[ ids[0] ];
			var action = org_group.actions[ ids[1] ];
			var new_groupid = ui.item.parent().closest(".altui-scene-group").data("group-idx");

			org_group.actions.splice( ids[1], 1 );
			var arr = $(this).parents("tbody").find("tr[data-group-idx={0}]".format(new_groupid)).find(".altui-scene-group tbody").sortable( "toArray" );
			// insert new elem at the right position
			var index = $.inArray(ui.item.prop("id"),arr);
			scene.groups[ new_groupid ].actions.splice(index, 0, action)
			_showSaveNeeded();

			// now update the UI
			var tbody = $(this).parents("tbody");
			_.defer( function() {
				if (ids[0]	!= new_groupid ) {
					$(tbody).find("tr[data-group-idx={0}]".format(new_groupid)).replaceWith( _displayGroup(scene.groups[ new_groupid ],new_groupid) );
					$(tbody).find("tr[data-group-idx={0}]".format(new_groupid)).find(".altui-scene-group tbody").sortable(sortable_options);
				}
				$(tbody).find("tr[data-group-idx={0}]".format(ids[0])).replaceWith( _displayGroup(org_group,ids[0] ) );
				$(tbody).find("tr[data-group-idx={0}]".format(ids[0])).find(".altui-scene-group tbody").sortable(sortable_options);
			});

		}
	};

	// var scenealtuiid = scene.altuiid;
	var _roomIDToName={
		"0-0":_T("No Room")
	};
	var scenecontroller = MultiBox.controllerOf(scene.altuiid).controller;
	var altuidevice = MultiBox.getDeviceByID( 0, g_ALTUI.g_MyDeviceID );
	var scenewatches = MultiBox.getWatches("VariablesToWatch",function(watch) { return (watch.sceneid == scene.id) && (scenecontroller==0) });

	function _makeAltuiid(controllerid,id) {
		return controllerid+"-"+id;
	}
	// trigger do not have IDs so use array index
	function _displayTrigger(trigger,idx) {
		function _displayTriggerUsers(trigger) {
			var lines=[];
			if (trigger.users)
				$.each(trigger.users.toString().split(","), function(idx,userid) {
					var user  =	 MultiBox.getUserByID(scenecontroller,userid);
					lines.push(user.Name);
				});
			var html ="";
			html += lines.join(", ");
			return html;
		}
		function _displayTriggerRestrictions(trigger) {
			var html ="";
			if (trigger.days_of_week) {
				var res = $.map( trigger.days_of_week.split(','), function (day) { return _timerDOW[parseInt(day)-1].text; });
				html += res.join(',');
			}
			if (trigger.start_time && trigger.stop_time)
				html += ("[{0}-{1}]".format(trigger.start_time,trigger.stop_time));
			return html;
		};

		var html="";
		var triggerinfo = _formatTrigger(scenecontroller,trigger);
		html +="<tr data-trigger-idx='"+idx+"'>";
		html +="<td>";
		html +="<input type='checkbox' {0} class='altui-enable-trigger' id='{1}'></input>".format( trigger.enabled==true ? 'checked' : '',idx);
		html +="</td>";

		html +="<td>";
		html +="<b>{0}</b>".format(triggerinfo.name);
		html +="</td>";

		html +="<td>{0}</td><td>{1}</td>".format(
			triggerinfo.device,
			triggerinfo.descr);
		html +="<td><small>";
		html += triggerinfo.condition;
		html +="</small></td>";

		html +="<td>";
		html += smallbuttonTemplate.format( idx, 'altui-triggertimerestrict', glyphTemplate.format("clock-o",_T("Timers"),(trigger.days_of_week ? 'text-success' : '' )),_displayTriggerRestrictions(trigger));
		html += smallbuttonTemplate.format( idx, 'altui-trigger-users', glyphTemplate.format("user",_T("Users"),(trigger.users ? 'text-success' : '' )),_displayTriggerUsers(trigger));
		html +="</td>";

		html +="<td>";
		html += smallbuttonTemplate.format( idx, 'altui-luatrigger', "<i class='fa fa-file-text-o' aria-hidden='true'></i><span> Lua</span>",trigger.lua);
		html +="</td>";

		html +="<td>";
		html += smallbuttonTemplate.format( idx, 'altui-deltrigger', deleteGlyph,'Delete trigger');
		html += smallbuttonTemplate.format( idx, 'altui-edittrigger', editGlyph, 'Edit trigger');
		html +="</td>";
		html +="</tr>";
		return html;
	};

	function _editTrigger( triggeridx , jqButton) {
		//Object {name: "blw 2", enabled: 1, template: 2, device: 5, arguments: Array[1]…}LastEval: 0arguments: Array[1]device: 5enabled: 1last_run: 1424626243lua: "return false"name: "blw 2"template: 2
		var trigger = (triggeridx!=-1)
		? scene.triggers[ triggeridx ]
		: {
			name:'',
			enabled:1,
			template:'',
			device:0,
			arguments:[],
			lua:''
		};

		DialogManager.triggerDialog( trigger, scenecontroller, function() {
			// now update the UI
			if (triggeridx>=0) {
				$("tr[data-trigger-idx="+triggeridx+"]").replaceWith( _displayTrigger(trigger,triggeridx) );
			} else {
				scene.triggers.push( trigger );
				var parent = $(jqButton).closest("tr")
				parent.before(	_displayTrigger(trigger,scene.triggers.length-1) );
			}
			_showSaveNeeded();
		} );
	};

	function _editLuaExpression(idxwatch) {
		var watch = scenewatches[idxwatch];
		// hide scene & scene editor accordeon
		// $(".altui-scene").toggle(false);
		$(".altui-scene-editor").toggle(false);
		$(".altui-scene-editbutton").toggle(false);

		// show blockly editor
		$(".altui-blockly-editor").toggle(true);

		// inject Blockly if needed
		 if ($(".altui-blockly-editor svg").length == 0)  {
			BlocklyArea.initBlocklyEditor('blocklyDiv','toolbox',watch.xml);
		 }
		$(".altui-blockly-editor").data('idxwatch',idxwatch);
	};

	function _editWatch( idx, jqButton) {
		var watch =	 (idx!=-1) ? scenewatches[idx] : "";
		var dialog = DialogManager.createPropertyDialog(_T('Watch'));
		var device = NULL_DEVICE;
		if (idx!=-1)
			device = MultiBox.getDeviceByAltuiID(watch.deviceid) || NULL_DEVICE;

		DialogManager.dlgAddDevices( dialog , '', device ? device.altuiid : NULL_DEVICE,
			function() {			// callback
				var widget = {};
				widget.properties ={
					deviceid:	device.altuiid,
					service:	watch.service,
					variable:	watch.variable
				}
				DialogManager.dlgAddVariables(dialog, null, widget, function() {
					DialogManager.dlgAddBlockly( dialog , "LuaExpression", _T("Lua Expression with new=newvalue and old=oldvalue"), watch.luaexpr, watch.xml, _T("Expression with old new as variables and lua operators like <	 >	<= >= == ~="), {required:''} );
					$('div#dialogModal').modal();
				});
			},
			function( device ) {	// filter
				return true;	 //(MultiBox.controllerOf(device.altuiid).controller == scenecontroller);
			}
		);

		function _getWatchDialogValues() {
			// get new values
			var altuiid = $("#altui-select-device").val();
			var state = MultiBox.getStateByID( altuiid,$("#altui-select-variable").val() );
			var newwatch = {
				//watch.service, watch.variable, watch.deviceid, watch.sceneid, watch.luaexpr
				service:state.service,
				variable:state.variable,
				deviceid:altuiid,
				sceneid:scene.id,
				luaexpr:$("#altui-widget-LuaExpression").val(),
				xml:$("#altui-xml-LuaExpression").val()
			};
			$('div#dialogModal').modal('hide');

			// now update the UI in the scene editor
			if (idx!=-1) {
				scenewatches[idx] = newwatch;
				$(jqButton).closest("tr[data-watch-idx='"+idx+"']").replaceWith( _displayWatch(idx,newwatch) );
			}
			else {
				idx = scenewatches.length;
				scenewatches.push( newwatch );
				var parent = $(jqButton).closest("tr")
				parent.before(	_displayWatch(idx , newwatch) );
			}
			return idx;
		};

		$('div#dialogs')
			.on('click',"#altui-edit-LuaExpression", function(event) {
				var idxwatch = _getWatchDialogValues();
				setTimeout( function(idxwatch) {
					UIManager.initBlockly( function() {
						if ((typeof Blockly == "undefined") || ($("#altui-select-device").val()==0))
							return;
						_editLuaExpression( idxwatch );
					})
				}, 500, idxwatch );
				return false;
			})
			.on( 'submit',"div#dialogModal form",  function( event ) {
				_getWatchDialogValues();
				_showSaveNeeded();
				PageMessage.message( "Change in Watches will require a LUUP reload after you save the scene", "info", true);
			});
	}

	function _displayWatch(idx,watch) {
		var device = MultiBox.getDeviceByAltuiID(watch.deviceid);
		if (device==null)
			device = {name:"<span class='text-danger'>Invalid</span>"};

		var html ="";
		html +="<tr data-watch-idx='{0}'>".format(idx);
		html +="<td>";
		html += device.name;
		html +="</td>";
		html +="<td>";
		html += watch.service;
		html +="</td>";
		html +="<td>";
		html += watch.variable;
		html +="</td>";
		html +="<td><small>";
		html += watch.luaexpr;
		html +="</small></td>";
		html +="<td>";
		html += smallbuttonTemplate.format( idx, 'altui-delwatch', deleteGlyph,'Delete watch');
		html += smallbuttonTemplate.format( idx, 'altui-editwatch', editGlyph, 'Edit watch');
		html +="</td>";
		html +="</tr>";
		return html;
	};

	function _findTimerIdxById( scene, timerid ) {
		var timer = null;
		if (scene.timers) {
			$.each(scene.timers, function( idx,_timer) {
				if (_timer.id == timerid) {
					timer = idx;
					return false;
				}
			});
		}
		return timer;
	};

	function _editTriggerUsers( triggeridx, jqButton ) {
		var trigger = scene.triggers[ triggeridx ];
		DialogManager.triggerUsersDialog(trigger,scenecontroller,function() {
			$(".altui-trigger-users").find(".fa").toggleClass("text-success",(trigger.users!=undefined));
			_showSaveNeeded();
		});
	};

	function _editTriggerRestrict( triggeridx, jqButton ) {
		function _hideShowControls(	 ) {
			var bViewOthers = $("#altui-widget-RestrictTrigger").prop('checked');
			$("#altui-widget-StartTime").closest(".form-group").toggle(bViewOthers);
			$("#altui-widget-StopTime").closest(".form-group").toggle(bViewOthers);
			$("#altui-widget-TimerDayOfWeek").closest(".form-group").toggle(bViewOthers);
		};

		var trigger = scene.triggers[ triggeridx ];
		if (trigger.start_time)
			trigger.start_time = trigger.start_time.fromHHMMSS().toString().toHHMMSS();
		if (trigger.stop_time)
			trigger.stop_time = trigger.stop_time.fromHHMMSS().toString().toHHMMSS();

		var dialog = DialogManager.createPropertyDialog(_T('Trigger Restriction'));
		DialogManager.dlgAddCheck(dialog,'RestrictTrigger',(trigger.days_of_week !=undefined),_T('Restrict trigger based on certain times'));
		DialogManager.dlgAddDayOfWeek(dialog, "TimerDayOfWeek", _T("TimerDayOfWeek"), trigger.days_of_week || '' , _timerDOW);
		DialogManager.dlgAddTimer(dialog, "StartTime", _T("Start Time"), trigger.start_time);
		DialogManager.dlgAddTimer(dialog, "StopTime", _T("Stop Time"),trigger.stop_time);
		$('div#dialogModal').modal();
		_hideShowControls();

		$('div#dialogs')
			.off( 'change',"input#altui-widget-RestrictTrigger")
			.on( 'change',"input#altui-widget-RestrictTrigger", function() {
				_hideShowControls();
			})
			.off('submit',"div#dialogModal form")
			.on( 'submit',"div#dialogModal form", function() {
				if ($("#altui-widget-RestrictTrigger").prop('checked')==false) {
					trigger.start_time=undefined;
					trigger.stop_time=undefined;
					trigger.days_of_week=undefined;
				} else
				{
					var tmp = $("#altui-widget-TimerDayOfWeek input:checked").map( function(idx,elem){ return $(elem).val() });
					trigger.days_of_week = $.makeArray(tmp).join(",");
					if (trigger.days_of_week =="") {
						trigger.start_time=undefined;
						trigger.stop_time=undefined;
						trigger.days_of_week=undefined;
					} else {
						trigger.start_time	=$("#altui-widget-StartTime").val();
						trigger.stop_time  =$("#altui-widget-StopTime").val();
					}
				}
				$(".altui-triggertimerestrict").find(".fa").toggleClass("text-success",(trigger.days_of_week!=undefined));
				$('div#dialogModal').modal('hide');
				_showSaveNeeded();
			});
	};

	function _editTimer( timerid, jqButton )	{
		function _getNewTimerID() {
			var max = 0;
			if (scene.timers) {
				$.each(scene.timers, function (idx,timer) {
					max = Math.max(max, timer.id);
				})
			}
			return ++max;
		};

		//{"id":1,"name":"Interval","type":1,"enabled":1,"interval":"3h","last_run":1427346180,"next_run":1427363702}
		var timer = null;
		var idx = _findTimerIdxById(scene, timerid)
		if (idx!=null) {
			timer = scene.timers[idx];
		} else {
			timer = {
				id: _getNewTimerID(),
				enabled: 1,
				name: 'new timer',
				type: 1
			}
		}
		var dialog = TimerEditor.init(timer)
		TimerEditor.runActions( function( timer ) {
			var parent = $(jqButton).closest("tr");
			if (idx!=null) {
				// edit
				scene.timers[idx] = cloneObject(timer);
				parent.replaceWith( UIManager.displayTimer(scene.timers[idx]) );
			} else {
				// addition
				scene.timers.push( timer );
				parent.before( UIManager.displayTimer(timer) );
			}
			_showSaveNeeded();
		});
	};

	function _displayAction(action,ida,idg) {
		var actioninfo = _formatAction(scenecontroller,action);
		var html="";
		html +="<tr class='altui-scene-action' id='{0}.{1}'>".format(idg,ida);
		html += "<td>{0}</td><td>{1} (<small class='text-muted'>{2}</small>)</td>".format(
			actioninfo.device,			// _displayDevice(action.device),
			actioninfo.action,			// action.action,
			actioninfo.arguments		//_displayArguments(action.arguments)
		);
		html +="<td>";
		html += smallbuttonTemplate.format( "{0}.{1}".format(idg,ida), 'altui-delaction', deleteGlyph, 'Delete Action');
		html += smallbuttonTemplate.format( "{0}.{1}".format(idg,ida), 'altui-editaction', editGlyph, 'Edit Action');
		html +="</td>";
		html +="</tr>";
		return html;
	};

	function _editAction(scene, action, ida, idg, jqButton) {
		var dialog = DialogManager.createPropertyDialog(_T('Action'));
		var device = MultiBox.getDeviceByID(scenecontroller,action.device);
		DialogManager.dlgAddDevices( dialog , '', device ? device.altuiid : NULL_DEVICE ,
			function() {		// callback
				var widget = {
					properties: {
						deviceid: device ? device.altuiid : NULL_DEVICE,
						action: {
							service:action.service,
							action:action.action,
							params:UIManager.buildParamsFromArray(action.arguments)
						}
					}
				};
				DialogManager.dlgAddActions("altui-select-action",dialog, widget, widget.properties.action, _T('Action'), function() {
					$('div#dialogModal').modal();
				});
			},
			function( device ) {		// filter
				return (MultiBox.controllerOf(device.altuiid).controller == scenecontroller);
			}
		);

		$('div#dialogs')
			.on( 'submit',"div#dialogModal form",
			{ scene: scene, button: jqButton },
			function( event ) {
				// save for real this time
				// action.device = parseInt(MultiBox.controllerOf( $("#altui-select-device").val() ).id );
				action.device = (MultiBox.controllerOf( $("#altui-select-device").val() ).id ).toString();
				action = $.extend(action , DialogManager.getDialogActionValue("altui-select-action") );
				action.arguments = [];
				// read params
				$(".altui-select-action-parameters input").each( function(idx,elem) {
					action.arguments.push({
						name: $(elem).prop('id').substring( "altui-widget-action-parameters-".length ),
						value: $(elem).val()
					});
				} );
				if ((action.device>0) && (action.action!=""))
				{
					$('div#dialogModal').modal('hide');

					// now update UI
					// var ids = $(event.data.button).prop("id").split(".");	// groupidx.actionidx
					var parent = $(event.data.button).closest("tr");
					if (ida>=0) {
						//edit
						parent.replaceWith( _displayAction(action,ida,idg) );
					}
					else {
						//add
						scene.groups[ idg ].actions.push( action );
						parent.before( _displayAction(action,scene.groups[ idg ].actions.length - 1 ,idg) );
					}
					_showSaveNeeded();
				}
			}
		);
	};

	function _displayGroup(group,idx) {
		var hours = parseInt( group.delay / 3600 ) % 24;
		var minutes = parseInt( group.delay / 60 ) % 60;
		var seconds = group.delay % 60;
		var result = "";
		if (group.delay>=3600)
			result += hours + "h ";
		if (group.delay>=60)
			result +=  minutes + "m ";
		result += seconds +"s ";
		var html="";
		html += "<tr data-group-idx='"+idx+"'>";
		html += "<td>";
		html +="<h5>{0}</h5>".format(result);
		// html += "</td>";
		// html +="<td>";
		if (idx>0) {
			// Group IDX 0 : is the "Immediate" group, it cannot be deleted
			html += smallbuttonTemplate.format( idx, 'altui-delgroup', deleteGlyph, 'Delete group');
		}
		html += smallbuttonTemplate.format( idx, 'altui-editgroup', editGlyph, 'Edit group');
		html +="</td>";
		html += "<td>";
		html +="<table class='table table-responsive-OFF table-sm altui-scene-group' data-group-idx='"+idx+"'>";
		html +="<tbody>";
		$.each(group.actions, function(ida,action) {
			html += _displayAction(action,ida,idx);
		});
		html +=("<tr><td colspan='3'>"
			+smallbuttonTemplate.format(idx, 'altui-addaction', plusGlyph,_T('Action'))+" "+_T('Action')
			+HTMLUtils.displayRECButton(idx)
			+"</td></tr>");
		html +="</tbody>";
		html +="</table>";
		html += "</td>";

		html += "</tr>";
		return html;
	};

	function _editGroup( idx,  group , _button ) {
		var dialog = DialogManager.createPropertyDialog(_T('Scene Action Group'));
		// DialogManager.dlgAddLine(dialog, "Delay", _T("Delay"),group.delay ,"delay in seconds",{
			// type:'number',
			// min:1,
			// required:''
		// });
		DialogManager.dlgAddTimer(dialog, "Delay", _T("Delay"), group.delay.toString().toHHMMSS(), {
			step: 1
		});
		$('div#dialogs')
			.on( 'submit',"div#dialogModal form",
				{ scene: scene, group:group, button:_button },
				function( event ) {
					// save for real this time
					var duration = $("#altui-widget-Delay").val().fromHHMMSS();
					var bOK = true;
					$.each(scene.groups, function(idxgrp,grp) {
						if ((idx!=idxgrp) && (grp.delay == duration))	// cannot have twice the same duration
						{
							bOK = false;
							return false;
						}
					});
					if (bOK==false) {
						alert("cannot have twice the same duration");
						return ;
					}
					$('div#dialogModal').modal('hide');
					var group  = event.data.group;
					group.delay = duration;

					// now update UI
					var parent = event.data.button.closest("tr");
					if ($(event.data.button).hasClass("altui-editgroup")) {
						var root = parent.parent();
						parent.replaceWith( _displayGroup(group,idx) );
						root.find("tr[data-group-idx={0}]".format(idx)).find(".altui-scene-group tbody").sortable(sortable_options);
					} else {
						// Add
						scene.groups.push( group );
						var newid = scene.groups.length-1
						parent.before( _displayGroup(group, newid) );
						parent.parent().find("tr[data-group-idx={0}]".format(newid)).find(".altui-scene-group tbody").sortable(sortable_options);
					}

					// make it sortable.
					//$(tbody).find("tr[data-group-idx={0}]".format(ids[0])).find(".altui-scene-group tbody").sortable(sortable_options);
					_showSaveNeeded();
				});
		$('div#dialogModal').modal();
	};

	function _showSaveNeeded( bSaveNeeded ) { // defaults to "save needed"
		if (bSaveNeeded == false)
			$(".altui-scene-editbutton").removeClass("btn-danger").addClass("btn-light");
		else
			$(".altui-scene-editbutton").removeClass("btn-light").addClass("btn-danger");
		_updateAccordeonHeaders();
	};

	function _displayActions() {
		var controller = MultiBox.controllerOf(scene.altuiid).controller
		var html="";
		html += UIManager.displayJson( 'json-Actions', scene.groups );
		html += UIManager.displayLua( 'lua-Actions', scene.groups, controller );
		try {
			html +="<table class='table table-responsive-OFF table-sm'>";
			html +="<tbody>";
			if (scene.groups)
			{
				$.each(scene.groups, function(idx,group){
					html += _displayGroup(group,idx);
				});
			}
			html +=("<tr><td colspan='3'>"+smallbuttonTemplate.format( -1 , 'altui-addgroup', plusGlyph,_T('Delay'))+" "+_T('Delay')+"</td></tr>");
			html +="</tbody>";
			html +="</table>";
		}
		catch(err) {
			var str = _T("error happened during decoding actions, probable duplicate ID or invalid format");
			html +="</tbody>";
			html +="</table>";
			html +="<span class='text-danger'>"+str+"</span>";
			PageMessage.message( str, "danger");
		}
		return html;
	};

	function _sceneEditDraw() {
		// var htmlSceneAddButtonTmpl = "  <button type='submit' class='btn btn-light {0}'>"+plusGlyph+"</button>";
		var rooms = $.grep( MultiBox.getRoomsSync(), function(room,idx) {
			_roomIDToName[room.altuiid]=room.name;
			return ( MultiBox.controllerOf(room.altuiid).controller == scenecontroller );
		});

		//scene options room, name, modes
		var panels = [
			{id:'Header', title:_T("Header"), html:_displayHeader()},
			{id:'Triggers', title:_T("Triggers"), html:_displayTriggersAndWatches()},
			{id:'Timers', title:_T("Timers"), html:UIManager.displayTimers(scene.timers)},
			{id:'Lua', title:_T("Lua"), html:_displayLua()},
			{id:'Actions', title:_T("Actions"), html:_displayActions()},
		];

		function _displayHeader() {
			var htmlRoomSelect = "<select id='altui-room-list' class='form-control'>";
			var htmlRoomName = "<input id='altui-scene-name-input' type='text' class='form-control' value='"+scene.name+"'></input>";
			if (rooms) {
					htmlRoomSelect	  += "<option value='{1}' {2}>{0}</option>".format(_T("No Room"),0,'');
					$.each(rooms, function(idx,room) {
						var selected = (room.id.toString() == scene.room);
						htmlRoomSelect	  += "<option value='{1}' {2}>{0}</option>".format(room.name,room.id,selected ? 'selected' : '');
					});
			}
			htmlRoomSelect += "</select>";
			var html="";
			html += "<div class='form form-inline'><label for='altui-room-list'>"+_T("Room")+" :</Label>"+htmlRoomSelect+"<label for='altui-scene-name-input'>"+_T("Name")+" :</Label>"+htmlRoomName;
			html+="</div>";
			if (UIManager.UI7Check()==true) {
				if (scene.modeStatus == undefined)
					scene.modeStatus="0";
				html += "<label for='altui-scene-mode-input'>"+_T("Runs in all modes, or in selected mode")+" :</Label>";
				html += HouseModeEditor.displayModes( 'altui-scene-mode-input' , '', scene.modeStatus.split(',') );
			}
			return html;
		}

		function _displayWatches(scenewatches) {
			html = "";
			if (scenecontroller==0) {
				html +="<table class='table table-responsive-OFF table-sm'>";
				html +="<caption>{0}</caption>".format(_T("Device Variable Watches"));
				html +="<tbody>";
				$.each( scenewatches, function (idx,watch) {
					html += _displayWatch(idx,watch);
				});
				html +=("<tr><td colspan='4'>"
					+smallbuttonTemplate.format( -1, 'altui-addwatch', plusGlyph,_T('Watch'))+" "+_T('Watch')
					+"</td></tr>");
				html +="</tbody>";
				html +="</table>";
			}
			return html;
		}
		function _displayTriggersAndWatches() {
			var html="";
			try {
				var opmode = scene.triggers_operator || "OR"
				html += UIManager.displayJson( 'json-Triggers', scene.triggers);
				if (UIManager.UI7Check()==true) {
					html += _T("Scene Trigger Evaluation mode") + ": "+ HTMLUtils.drawButtonGroup('altui-trigger-mode-grp', {
						attr:"data-toggle='buttons'",
						buttons: [
							{id:"altui-trigger-or", label:"OR" , cls: "altui-trigger-mode " + ((opmode=="OR") ? "active btn-primary " : "") },
							{id:"altui-trigger-and",label:"AND", cls: "altui-trigger-mode " + ((opmode=="AND") ? "active btn-primary " : "") },
						]
					});
				}
				html +="<table class='table table-responsive-OFF table-sm'>";
				html +="<caption>{0}</caption>".format(_T("Device Triggers"));
				html +="<tbody>";
				if (scene.triggers) {
					$.each( scene.triggers, function(idx,trigger) {
						html += _displayTrigger(trigger,idx);	// trigger do not have IDs so use array index
					});
				}
				html +=("<tr><td colspan='7'>"
					+smallbuttonTemplate.format( -1, 'altui-addtrigger', plusGlyph,_T('Trigger'))+" "+_T('Trigger')
					+"</td></tr>");
				html +="</tbody>";
				html +="</table>";
			}
			catch(err) {
				var str = _T("error happened during decoding triggers, probable duplicate ID or invalid format");
				html +="</tbody>";
				html +="</table>";
				html +="<span class='text-danger'>"+str+"</span>";
				PageMessage.message( str, "danger");
			}

			html += _displayWatches(scenewatches);
			return html;
		}
		function _displayLua() {
			var html="";
			var lua = (scene.lua!=undefined) ? scene.lua : "";
			// html +="<form class='col-sm-11' role='form' action='javascript:void(0);'>";
			html +="  <div class='form-group'>";
			html += ("	  <label for='altui-luascene'>Lua scene code:</label>");
			html +="	<div id='altui-luascene'>"+lua.htmlEncode()+"</div>";
			html +="  </div>";
			// html +="</form>";
			return html;
		}

		var jsonbutton = {id:'altui-json', class:'altui-toggle-code pull-right', label:'json', title:'json' };
		var luabutton = {id:'altui-lua', class:'altui-toggle-code pull-right', label:'lua', title:'lua' };
		var htmlSceneEditButton = "	 <button type='submit' class='btn btn-primary pull-right altui-scene-editbutton'>"+_T("Submit")+"</button>";
		var html="";
		html += HTMLUtils.createAccordeon('altui-scene-editor',panels,[luabutton,jsonbutton],scene.altuiid );
		html += BlocklyArea.createBlocklyArea();
		html += htmlSceneEditButton;
		return html;
	};

	function _updateAccordeonHeaders() {
		function _countActions(scene) {
			var n=0;
			$.each(scene.groups, function(i,g) {
				n+=g.actions.length;
			})
			return n;
		};
		var editor = ace.edit( "altui-luascene" );
		var luacode = editor.getValue();
		$("#altui-hint-Lua").html( (luacode=="") ? "" : glyphTemplate.format("file-text-o","Lua") );
		$("#altui-hint-Triggers").html( '<span class="badge badge-secondary">{0}</span>'.format( scene.triggers.length + scenewatches.length));
		$("#altui-hint-Timers").html( '<span class="badge badge-secondary">{0}</span>'.format( scene.timers.length));
		$("#altui-hint-Actions").html( '<span class="badge badge-secondary">{0}</span>'.format( _countActions(scene)) );
		var header = "{0} in {1}".format(scene.name,_roomIDToName["{0}-{1}".format(scenecontroller,scene.room)]);
		if (UIManager.UI7Check())
		{
			html = HouseModeEditor.getSelectedLabels();
			header += (" ({0})".format(html));
		}
		$("#altui-hint-Header").html( '<span class="text-muted"><small>{0}</small></span>'.format( header ) );
	};

	function _runActions(  ) {
		//http://stackoverflow.com/questions/15416275/why-does-the-update-event-in-jquery-sortable-seem-to-run-twice-when-testing-for
		// $(".altui-scene-action").draggable(draggable_options);
		$(".altui-scene-group tbody").sortable(sortable_options);
		// $(".altui-scene-group").droppable(droppable_options);

		var editor = ace.edit( "altui-luascene" );
		editor.setTheme( "ace/theme/"+ (MyLocalStorage.getSettings("EditorTheme") || "monokai") );
		editor.getSession().setMode( "ace/mode/lua" )
		editor.setFontSize( MyLocalStorage.getSettings("EditorFontSize") )
		editor.on("change",function(event) {
				var lua = editor.getValue();
				if ( lua != scene.lua ) {
					_showSaveNeeded();
				}
			});

		$("div#altui-luascene").resizable({
			// containment: "parent",
			maxWidth:$("div#altui-luascene").closest(".card").innerWidth()-30, // ugly but easier, padding 15 on each size
			stop: function( event, ui ) {
				if (editor)
					editor.resize();
			}
		});
		_updateAccordeonHeaders();
		$('#blocklyDiv').data("scenecontroller",scenecontroller);	// indicates to Blockly which scene controller to filter on

		$(".altui-code").hide();
		$(".altui-mainpanel")
			.off("click")
			.on("click",".altui-delscene",function() {
				var altuiid = $(this).closest(".altui-scene").data('altuiid');
				var scene = MultiBox.getSceneByAltuiID(altuiid);
				DialogManager.confirmDialog(_T("Are you sure you want to delete scene ({0})").format(altuiid),function(result) {
					if (result==true) {
						MultiBox.deleteScene( scene );
						window.history.go(-1)
					}
				});
			})
			.on("click",".altui-trigger-mode",function(e) {
				$(".altui-trigger-mode").removeClass("active btn-primary");
				$(this).addClass("active btn-primary");
			})
			.on("click",".altui-luatrigger",function() {
				var id = parseInt($(this).prop('id'));
				LuaEditor.openDialog( scene.triggers[id].lua !=undefined ? scene.triggers[id].lua : "" , function(code){
					scene.triggers[id].lua = code;
					_showSaveNeeded();
					PageMessage.message( "Event Lua code edited, remember to save your changes", "info");
					});
			})
			.on("click",".altui-trigger-users",function() {
				var id = parseInt($(this).prop('id'));
				_editTriggerUsers( id , $(this) );
			})
			.on("click",".altui-triggertimerestrict",function() {
				var id = parseInt($(this).prop('id'));
				_editTriggerRestrict( id , $(this) );
			})
			.on("click","#altui-close-blockly",function() {
				$(".altui-scene").toggle(true);
				$(".altui-scene-editor").toggle(true);
				$(".altui-scene-editbutton").toggle(true);
				$(".altui-blockly-editor #blocklyDiv").empty();
				$(".altui-blockly-editor").data('workspace',null);
				$("#blocklyDivCode").text("");
				$(".altui-blockly-editor").toggle(false);
				$(".blocklyToolboxDiv").remove();
			})
			.on("click","#altui-save-blockly",function() {
				$(".altui-scene").toggle(true);
				var idxwatch = $(".altui-blockly-editor ").data('idxwatch');
				var workspace = $(".altui-blockly-editor ").data('workspace');
				scenewatches[idxwatch].luaexpr = trim($("#blocklyDivCode").text());	// remove \n at the end
				scenewatches[idxwatch].xml = Blockly.Xml.domToText( Blockly.Xml.workspaceToDom(workspace) );

				$(".altui-scene-editor").toggle(true);
				$(".altui-scene-editbutton").toggle(true);
				$("tr[data-watch-idx='"+idxwatch+"']").replaceWith( _displayWatch(idxwatch,scenewatches[idxwatch]) );
				_showSaveNeeded();

				$(".altui-blockly-editor #blocklyDiv").empty();
				$(".altui-blockly-editor").data('workspace',null);
				$("#blocklyDivCode").text("");
				$(".altui-blockly-editor").toggle(false);
				$(".blocklyToolboxDiv").remove();
			})
			.on("click",".altui-runscene",function() {
				var altuiid = $(this).prop('id');
				var scene = MultiBox.getSceneByAltuiID(altuiid);
				MultiBox.runScene( scene );
			})
			.on("click",".altui-scene-editbutton",function(){
				scene.lua =	 editor.getValue();
				scene.name = $("#altui-scene-name-input").val();
				if (scene.paused==undefined)
					scene.paused=0;

				//UI7 only features
				if (UIManager.UI7Check()==true) {
					//trigger mode
					if ( $("#altui-trigger-and").hasClass("btn-primary") ) {
						scene.triggers_operator = "AND"
					} else {
						scene.triggers_operator = "OR"
					}
					// house more
					scene.modeStatus = HouseModeEditor.getSelectedModes();
				}

				// prepare table of old and new watches
				var previousWatches = MultiBox.getWatches("VariablesToWatch" ,function(watch) { return (watch.sceneid == scene.id) && (scenecontroller==0) });

				var onlyInPrevious = previousWatches.filter(function(current){
					return scenewatches.filter(function(current_b){
						return WatchManager.sameWatch(current,current_b);
					}).length == 0
				});

				var onlyInNew = scenewatches.filter(function(current){
					return previousWatches.filter(function(current_a){
						return WatchManager.sameWatch(current,current_a);
					}).length == 0
				});

				// delete all watches that are in the VERA variable and not any more in the scenewatches
				$.each(onlyInPrevious , function(i,w) {
					MultiBox.delWatch( w )
				});
				// add all the watches that are in the scenewatches and not in the VERA variable
				$.each(onlyInNew , function(i,w) {
					MultiBox.addWatch( w )
				});

				// save the scene
				show_loading();
				$.when(MultiBox.editScene(scene.altuiid,scene)).done( hide_loading );
				_showSaveNeeded(false);
			})
			.on("click",".altui-deltrigger",function(){
				scene.triggers.splice( $(this).prop('id') , 1 );
				$(this).parents("tr").remove();
				_showSaveNeeded();
				PageMessage.message( "Trigger deleted, remember to save your changes", "info");
				// MultiBox.setScene(sceneid,scene);
			})
			.on("click",".altui-delwatch",function(){
				var idx = $(this).prop('id');
				scenewatches.splice( $(this).prop('id') , 1 );
				$(this).parents("tr").remove();
				_showSaveNeeded();
				PageMessage.message( "Watch deleted, remember to save your changes", "info");
				PageMessage.message( "Change in Watches will require a LUUP reload after you save the scene", "info");
			})
			.on("click",".altui-deltimer",function(){
				var id = parseInt($(this).prop('id'));
				$.each(scene.timers , function (idx,timer) {
					if (timer.id ==id) {
						scene.timers.splice( idx , 1 );
						// now rename IDs !
						var newid=1;
						$.each(scene.timers, function( idx,timer) {
							timer.id = newid++;
						});
						_showSaveNeeded();
						return false; // we found it, stop the iteration
					}
				});
				$(this).parents("tr").remove();
				PageMessage.message( "Timer deleted, remember to save your changes", "info");
				// MultiBox.setScene(sceneid,scene);
			})
			.on("click",".altui-edittimer",function(){
				var id = parseInt($(this).prop('id'));
				_editTimer( id , $(this) );
			})
			.on("click",".altui-addtimer",function(){
				_editTimer( -1 , $(this) );
			})
			.on("click",".altui-delaction",function(){
				// groupid . actionid
				var ids = $(this).prop('id').split('.');
				var group = scene.groups[ ids[0] ];
				group.actions.splice( ids[1], 1 );
				$(this).parents("tr [data-group-idx={0}]".format(ids[0])).parent().parent().replaceWith( _displayGroup(group,ids[0] ) );
				// $(this).parents("tr").first().remove();
				_showSaveNeeded();
				PageMessage.message( "Action deleted, remember to save your changes", "info");
				// MultiBox.setScene(sceneid,scene);
			})
			.on("click",".altui-editaction",function(){
				var ids = $(this).prop('id').split('.');
				var group = scene.groups[ ids[0] ];
				var action = group.actions[ ids[1] ];
				_editAction(scene,action,ids[1],ids[0],$(this));
			})
			.on("click",".altui-button-record",function(){
				var idg = $(this).parents("table[data-group-idx]").data("group-idx");
				if (MultiBox.isRecording()) {
					$(".altui-record-indicator").remove();
					var log = MultiBox.stopRecorder()
					$.each(log, function(idx,item) {
						switch(item.type) {
							case 'action':
								//Format needs to be:
								//"{"device":"0-6","service":"urn:upnp-org:serviceId:SwitchPower1","action":"SetTarget","arguments":[{"name":"newTargetValue","value":"0"}]}"
								//Recorder format is :
								//{"type":"action","device":"0-216","service":"urn:upnp-org:serviceId:altui1","action":"SetDebug","params":{"newDebugMode":1}}
								delete item.type;
								item.arguments=UIManager.buildArrayFromParams(item.params);
								delete item.params;
								// fix the item device number to remove the ALTUIID format
								var info = MultiBox.controllerOf(item.device);
								if (info.controller==scenecontroller) {
									item.device = info.id;
									scene.groups[idg].actions.push(item);
								} else {
									PageMessage.message(_T("Unsupported function to use a device on a different box than the scene"),"warning")
								}
								break;
							case 'variable_set':
							case 'scene':
								break;
						}
					});
					var dom = $(this).closest("tr[data-group-idx='{0}']".format(idg));
					$(dom).replaceWith( _displayGroup(scene.groups[idg],idg) );
				} else {
					$("#navbar").append("<span class='altui-record-indicator'>REC</span>")
					MultiBox.startRecorder();
				}
				$('.altui-button-record').replaceWith( HTMLUtils.displayRECButton( idg ) )
			})
			.on("click",".altui-addaction",function(){
				var newaction = {
					device:'',
					service:'',
					action:'',
					arguments:[]
				};
				var idg = $(this).parents("table[data-group-idx]").data("group-idx");
				_editAction(scene,newaction,-1,idg,$(this));
			})
			.on("click",".altui-delgroup",function(){
				var id = parseInt($(this).prop('id'));
				$(this).parents("tr").remove();
				scene.groups.splice( id , 1 );
				_showSaveNeeded();
				PageMessage.message( "Group of actions deleted, remember to save your changes", "info");
			})
			.on("click",".altui-editgroup",function(){
				var groupidx = parseInt($(this).prop('id'));
				_editGroup( groupidx, scene.groups[ groupidx ] , $(this) );
			})
			.on("click",".altui-addgroup",function(){
				var group = {"delay":'',"actions":[]};
				_editGroup( -1 , group , $(this) );
			})
			.on("click",".altui-edittrigger",function(){
				var triggeridx = $(this).parents("tr[data-trigger-idx]").data("trigger-idx");
				_editTrigger( triggeridx , $(this) );
			})
			.on("click",".altui-addtrigger",function(){
				_editTrigger( -1 , $(this) );
			})
			.on("click",".altui-editwatch",function(){
				var idx = $(this).prop('id');
				_editWatch( idx, $(this) );
			})
			.on("click",".altui-addwatch",function(){
				if ($(this).closest(".altui-scene-editor").prop('id') != ALTUI_NEW_SCENE_ALTUIID) {
					_editWatch( -1 , $(this) );
				} else {
					DialogManager.warningDialog(_T("Scene"),_T("Save the scene at least once before creating device watches"));
				}
			})
			.on("click",".altui-pausescene",function(){
				scene.paused = (scene.paused==1) ? 0 : 1;
				$(this).toggleClass("activated paused");
				_showSaveNeeded();
			});


		$(".altui-toggle-code").click( function() {
			// trick to show the accordeon pannel corresponding to the code button that was pressed
			$(this).parent().parent().find(".panel-collapse").collapse('show');
			
			// hide all codes and display just the one wanted
			$(".altui-code").hide();
			var btnid = $(this).prop("id").substring('altui-'.length)
			var id = $(this).closest('.card').prop('id');
			var type = "#altui-" + btnid + "-" + id;
			$(type).toggle();
		});

		$(".altui-mainpanel")
			.off("change")
			.on("change","#altui-scene-name-input",function() {
				if ( $("#altui-scene-name-input").val() != scene.name ) {
					scene.name = $("#altui-scene-name-input").val();
					_showSaveNeeded();
					_updateAccordeonHeaders();
				}
			})

		HouseModeEditor.runActions( '.altui-mainpanel', function() {
			_showSaveNeeded();
		});

		$("#altui-room-list").change( function() {
			scene.room = $(this).val();
			_showSaveNeeded();
		});

		$(".altui-enable-trigger").click( function() {
			var checked = $(this).is(':checked');
			var id = $(this).prop('id');
			_showSaveNeeded();
			scene.triggers[ id ].enabled = (checked == true) ? 1 : 0;
		});

		$(".altui-enable-timer").click( function() {
			var checked = $(this).is(':checked');
			var id = $(this).prop('id');
			$.each(scene.timers, function(idx,timer) {
				if (timer.id == id) {
					timer.enabled = (checked == true) ? 1 : 0;
					_showSaveNeeded();
					return false; // break the loop
				}
			});
		});
	}

	return {
		sceneEditDraw	: _sceneEditDraw,
		runActions		: _runActions,
		// displayActions  : _displayActions
	}
};

// ===========================
//	Page UI pieces helpers
// ===========================

var PageMessage = (function(window, undefined ) {
	var _badgeTemplate = '<span class="badge badge-secondary">{0}</span>&nbsp;';
	var _msgTemplate = '<span class="altui-pagemessage-txt" >{0}</span>';
	var _pageMessageIdx = 0;

	function _toDataset(dataset) {
		if (dataset == undefined)
			return '';
		var lines=[];
		$.each( dataset, function(key,val) {
			lines.push( "data-{0}='{1}'".format(key,val));
		});
		return lines.join(' ');
	};

	// dataset enables to mark messages and find them back later, it is a {} object translated into data-* attributes
	function _messageRow(_pageMessageIdx, badge, now,txt,html,level,dataset)
	{
		var close = "<button class='close altui-pagemessage-close' type='button' aria-label='Close'><span aria-hidden='true'>&times;</span></button>";
		var badgehtml = (badge>1) ? _badgeTemplate.format(badge) : "";
		var htmlmsg = ("<tr data-idx='{0}' {4} class='table-{3}'><td>"+close+"</td><td>"+badgehtml+"</td><td>{1}</td><td class='altui-pagemessage-txt'>{2}</td><td>{5}</td></tr>")
		.format(
			_pageMessageIdx,
			now.toLocaleString(),
			txt.htmlEncode(),
			level,
			_toDataset(dataset),
			html || "");
		return htmlmsg;
	};

	function _updateMessageButtonColor() {
		var button =$("#altui-toggle-messages");
		function _setColor(cls) {
			button.attr("class","btn btn-"+cls);
		};
		var divs = $("div#altui-pagemessage");
		if (divs.has("tr.table-danger").length>0)
			_setColor('danger');
		else if (divs.has("tr.table-warning").length>0)
			_setColor('warning');
		else if (divs.has("tr.table-info").length>0)
		// else if ($("div#altui-pagemessage  tr.info").length>0)
			_setColor('info');
		else if (divs.has("tr.table-success").length>0)
		// else if ($("div#altui-pagemessage  tr.success").length>0)
			_setColor('success');
		else {
			_setColor('light');
			// button.next(".collapse").removeClass("in");
			// button.filter("span").removeClass( "caret-reversed" );
		}
	};

	function _clearMessage( msgidx ) {
		$("div#altui-pagemessage  tr[data-idx='" + msgidx + "']").remove();
		_updateMessageButtonColor();
	};

	function _message(txt,level,bReload,dataset)
	{
		var html="";

		// level =success, info, warning, danger
		if ((level!="success") &&  (level!="info" ) &&	(level!="warning") &&  (level!="danger"))	{
			level = "info";
		}
		if (bReload==true) {
			if (level=="success")
				level="info";
			html += "<button class='btn btn-light btn-sm altui-savechanges-button' onclick='MultiBox.saveChangeCaches(0,\"{0}\")'>Save Changes</button>";
		}

		//
		// if same message already exists, simply increase the badge count
		//
		var now = new Date();
		var found = null;
		$("div#altui-pagemessage td.altui-pagemessage-txt").each( function(idx,obj) {
			if (txt == $(obj).html()) {
				found = $(obj);
				return false;
			}
		});
		var idx = _pageMessageIdx;
		if (found != null)
		{
			var tr = $(found).parent();
			idx = $(tr).data('idx');
			var badge = $(tr).find("span.badge");
			var n = 2;
			if (badge.length>0)
			{
				n = 1+parseInt(badge.html());
			}
			$(tr).replaceWith( _messageRow(idx, n, now.toLocaleString(),txt,html.format(idx),level,dataset) );
			if (level== "success")
				setTimeout( function () { PageMessage.clearMessage( idx ) ; }, 5000 );
		}
		else {
			var htmlmsg = _messageRow(idx, 1, now.toLocaleString(),txt,html.format(idx),level,dataset);
			$("div#altui-pagemessage tbody").prepend( htmlmsg );
			$("div#altui-pagemessage  tr.table-success[data-idx='" + idx + "']").each( function(idx,elem) {
				var that = $(elem);
				setTimeout( function() { $(that).remove();_updateMessageButtonColor(); } , 5000 );
			});
			_pageMessageIdx++;
		}
		_updateMessageButtonColor();
		return idx;
	};

	function _jobMessage(device,job)
	{
		var now = new Date();
		var txt = "#{0}:{1}:{2}".format(job.id,device.name,job.comments);
		if (job.id!=0) {
			// seems createdevice generate a job ID 0 on zWave device. let's avoid that message to the user
			var tr = $("div#altui-pagemessage tr[data-jobid='"+job.id+"']");
			if (tr.length>0) {
				var idx = $(tr).data('idx');
				var badge = $(tr).find("span.badge");
				$(tr).replaceWith(
					_messageRow(idx, 1, now.toLocaleString(),txt, "", UIManager.jobStatusToColor( job.status ), {
						devid : device.id,	//device concerned
						jobid : job.id		//message for this job, will replace old one
					})
				);
				if (job.status==4)
					setTimeout( function () { _clearMessage( idx ) }, 5000 );
			}
			else
			{
				// new message
				_message(
					txt,
					UIManager.jobStatusToColor( job.status ),
					false,
					{
						devid : device.id,	//device concerned
						jobid : job.id		//message for this job, will replace old one
					}
				);
			}
		}
	};

	function _clearJobMessage(device)
	{
		var devicemessages = $(".altui-pagemessage[data-devid='"+device.id+"']");
		setTimeout( function() {
			$(devicemessages).remove();
			_updateMessageButtonColor();
		}, 5000 );
	};

	function _init(breadcrumb,cls) {
		// hidden on xs
		var clock = Clock ? Clock.getClockHtml() : ""
		var Html=`
		<div id='altui-pagemessage' class='{3}'>
			<form class='form-inline'>
			{0}
			<button id="altui-toggle-messages" class="btn btn-light" type="button" data-toggle="collapse" data-target="#altui-pagemessage-panel" aria-expanded="false" aria-controls="collapseExample">
			{1} <i class="fa fa-caret-down" aria-hidden="true"></i>
			</button>
			{2}
			{4}
			</form>
			<div class="collapse" id="altui-pagemessage-panel">
				<div class="card card-body">
				<table class='table table-sm '>
				<tbody></tbody>
				</table>
				</div>
			</div>
		</div>`.format(UIManager.breadCrumb( breadcrumb ),_T("Messages"),SpeechManager.getHtml(),cls||"",clock)

		$("#altui-pagemessage-span").html(	Html );
		// close button for pageMessages
		$( document )
			.off( "click", ".altui-pagemessage-close")
			.on( "click", ".altui-pagemessage-close", function() {
				// $(this).closest("tr").remove();
				PageMessage.clearMessage( $(this).closest("tr").data('idx') );
			})
			.off( "click", "#altui-toggle-messages")
			.on( "click", "#altui-toggle-messages", function() {
				// $(this).find("span").toggleClass( "caret-reversed" );
			})
			.off( "click", "#altui-speech-button")
			.on( "click", "#altui-speech-button", function() {
				SpeechManager.toggle();
			})
	};

	function _clear() {
		$("#altui-pagemessage tbody").empty();
		_updateMessageButtonColor();
	};

	return {
		init			: _init,
		clear			: _clear,
		clearMessage	: _clearMessage,
		message			: _message, // (txt,level,bReload,dataset)
		jobMessage		: _jobMessage,
		clearJobMessage	: _clearJobMessage,
	};
})(window);


var HistoryManager = ( function(win) {
	var _history = []
	win.onpopstate = function(event) {
		// console.log("POP history location: " + document.location + ", state: " + JSON.stringify(event.state))

		if (event.state!=null) {
			var idx = parseInt(event.state);
			// browser removed latest history entry, so we align our internal history stack
			if (_history.length>1) {
				_history.pop();				// remove current element as the user just dropped it
				var state = _history.pop();
				// console.log("After POP history length ",_history.length)
				var caller = state.caller;
				var args = state.args;
				var method = state.method || null;
				var context = state.context || null;
				if ( (context!=null) && ($.isFunction(method)==true) ) {
					method.apply(context, args )
				} else {
					window["UIManager"][caller].apply( UIManager, args)
				}
			} else
			{
				// AltuiDebug.warning("inconsistent History or empty state stack");
				window.history.go( -window.history.length );
			}
		}
	};
	return {
		pushState: function( id, caller, args, method, context ) {
			var state = {
				context:context,
				method:method,
				caller: caller,
				args: $.grep(args || [], function(arg) {
					// prevent event object from being part of argument array
					// prevent callback function also, that means some pages (few) will not support BACK feature
					return (arg==null) || ((arg.cancelable==undefined)	&& ($.isFunction(arg)==false))
				})
			};
			_history.push(state);
			win.history.pushState( _history.length , id, null);
		}
	}
})( window );

if ((MyLocalStorage.getSettings('ShowClock') || 0)==1) {
	var Clock = (function(window) {
		function _updateClock() {
			$(".altui-clock").replaceWith( Clock.getClockHtml() )
		}
		var _timer = setInterval(_updateClock, 1000)
		return {
			getClockHtml: function() {
				var glyph = (typeof(timeGlyph)!="undefined") ? timeGlyph : ""
				return "<span class='altui-clock d-none d-sm-block shadow-sm m-0 p-1 bg-light rounded'>{0}{1}</span>".format(glyph , new Date().toLocaleString())
			}
		}
	})(window);
}
