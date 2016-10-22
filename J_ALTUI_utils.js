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
function getQueryStringValue (key) {  
  return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
} 
	
function isIE11() {
	var ie11andabove = navigator.userAgent.indexOf('Trident') != -1 && navigator.userAgent.indexOf('MSIE') == -1 // IE11 or above Boolean
	return ie11andabove;
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
	var css = Altui_ExecuteFunctionByName(styleFunctionName, window);
	style.appendChild(document.createTextNode(css));
	title.parentNode.insertBefore(style,title);	
};
	
function Altui_ExecuteFunctionByName(functionName, context , device, extraparam) {
	var namespaces = functionName.split(".");
	var func = namespaces.pop();
	for (var i = 0; i < namespaces.length; i++) {
		context = context[namespaces[i]];
	}
	return context[func].call(context, device, extraparam);
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
		setBrandingCallback : function(cb) { _brandingCallback =  $.isFunction(cb) ? cb : null  },	// func
		doBranding : function() { if ($.isFunction(_brandingCallback)) { (_brandingCallback)() } } 
	}
})();

var _T = Localization._T;

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
				$("#altui-speech-button").addClass('btn-danger').removeClass('btn-default');
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
				$("#altui-speech-button").removeClass('btn-danger').addClass('btn-default');
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
			"device":$.map( MultiBox.getDevicesSync(), function( device, idx) { return {name:_spochen(device.name), altuiid:device.altuiid} } ),
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
			return "<span class='glyphicon glyphicon-volume-up' title='speech'></span>";		
		},
		getHtml: function() {
			if (recognition==null) return "";
			Html="";
			Html+="	<button id='altui-speech-button' class='btn btn-default {1}' type='button'>{0}</button>".format(
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
	luaEditorModalTemplate += "  <div class='modal-dialog modal-lg'>";
	luaEditorModalTemplate += "    <div class='modal-content'>";
	luaEditorModalTemplate += "      <div class='modal-header'>";
	luaEditorModalTemplate += "        <button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>";
	luaEditorModalTemplate += "        <h4 class='modal-title'>{0}</h4>";
	luaEditorModalTemplate += "      </div>";
	luaEditorModalTemplate += "      <div class='modal-body'>";
	luaEditorModalTemplate += "      	<div class='form-group'>";
	luaEditorModalTemplate += "      		<label for='altui-editor-text'>{0}</label>";
	// luaEditorModalTemplate += "      		<textarea id='altui-luacode-text' rows='10' class='form-control' placeholder='enter code here'>{0}</textarea>";
	luaEditorModalTemplate += "      		<div id='altui-editor-text'>{1}</div>";
	luaEditorModalTemplate += "      	</div>";
	luaEditorModalTemplate += "      </div>";
	luaEditorModalTemplate += "      <div class='modal-footer'>";
	// luaEditorModalTemplate += "        <button type='button' class='btn btn-default' data-dismiss='modal'>"+_T("Close")+"</button>";
	// luaEditorModalTemplate += "        <button type='button' class='btn btn-default altui-luacode-test' >"+_T("Test Code")+"</button>";
	// luaEditorModalTemplate += "        <button type='button' class='btn btn-primary altui-luacode-save' data-dismiss='modal'>"+_T("Save Changes")+"</button>";
	luaEditorModalTemplate += "      </div>";
	luaEditorModalTemplate += "    </div><!-- /.modal-content -->";
	luaEditorModalTemplate += "  </div><!-- /.modal-dialog -->";
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
	var helpGlyph = "<span class='glyphicon glyphicon-question-sign ' aria-hidden='true'></span>"
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
		return  dialog;
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
		var glyph2 = glyph || glyphTemplate.format( "refresh", _T("Refresh"), "text-warning glyphicon-spin big-glyph" );
		
		var defaultSpinDialogModalTemplate="";
		defaultSpinDialogModalTemplate = "<div id='dialogModal' class='modal' data-backdrop='static' data-keyboard='false'>";
		defaultSpinDialogModalTemplate += "  <div class='modal-dialog modal-sm'>";
		defaultSpinDialogModalTemplate += "    <div class='modal-content'>";
		defaultSpinDialogModalTemplate += "      <div class='modal-body'>";
		defaultSpinDialogModalTemplate += "      <div class='row-fluid'>";
		defaultSpinDialogModalTemplate += "      {0} {1}";
		defaultSpinDialogModalTemplate += "      </div>";
		defaultSpinDialogModalTemplate += "      </div>";
		defaultSpinDialogModalTemplate += "    </div><!-- /.modal-content -->";
		defaultSpinDialogModalTemplate += "  </div><!-- /.modal-dialog -->";
		defaultSpinDialogModalTemplate += "</div><!-- /.modal -->";
		return DialogManager.registerDialog('dialogModal',defaultSpinDialogModalTemplate.format( 
			glyph2,
			message || "")
		);
	};
	function _genericDialog(message,title,buttons,cbfunc) {
		var result = false;
		var dialog = DialogManager.registerDialog('dialogModal',
						defaultDialogModalTemplate.format( 'dialogModal',
								title, 	// title
								message,							// body
								""));								// size
		$.each(buttons,function(i,button) {
			DialogManager.dlgAddDialogButton(dialog, button.isdefault, button.label, '', button.id , { 'data-dismiss':'modal'} );
		});
		
		// buttons
		$('div#dialogs')		
			.off('click',"div#dialogModal button.btn-primary")
			.on( 'click',"div#dialogModal button.btn-primary", function() {
				result = true;
				// dialog.modal('hide');
			})
			.off('hidden.bs.modal',"div#dialogModal")
			.on( 'hidden.bs.modal',"div#dialogModal", function() {
				if ($.isFunction(cbfunc))
					(cbfunc)(result);
			});

		dialog.modal({                    // wire up the actual modal functionality and show the dialog
		  "backdrop"  : "static",
		  "keyboard"  : true,
		  "show"      : true                     // ensure the modal is shown immediately
		});
		return result;
	}
	function _confirmDialog(message,cbfunc,buttons) {
		var buttons = buttons || [{isdefault:true, label:_T("Yes")}];
		var warningpic = "<div class='altui-warningicon pull-left'>{0}</div>".format(questionGlyph);
		return _genericDialog(message,warningpic+_T("Are you Sure ?"),buttons,cbfunc)
	};
	function _quickDialog(type,title,message,cbfunc) {
		var glyph = glyphTemplate.format( type+"-sign", _T(type) , "text-"+type);
		var header= "<div class='altui-{2}icon pull-left'>{0}</div> {1}".format(glyph,title,type);
		return _genericDialog(message,header,[],cbfunc);
	};
	function _infoDialog(title,message,cbfunc) {
		return _quickDialog("info",title,message,cbfunc);
	};
	function _warningDialog(title,message,cbfunc) {
		return _quickDialog("warning",title,message,cbfunc);
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
			var inarray  = $.inArray(user.id.toString(),selectedusers);
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
								title, 			// title
								"",				// body
								"modal-lg"
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
		$(dialog).find(".row-fluid").append(propertyline);
	};

	function _dlgAddDayOfWeek(dialog,name, label, value, _timerDOW)
	{
		//0:sunday
		var selected_days = value.split(',');
		var propertyline = "";
		propertyline += "<div class='form-group' id='altui-widget-"+name+"'>";
		propertyline += "	<label  title='"+name+"'>"+label+": </label>";
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
		$(dialog).find(".row-fluid").append(propertyline);
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
			propertyline += "	<button data-toggle='tooltip' data-placement='top' title='{0}' type='button' class='btn btn-default btn-xs altui-help-button' data-text='{0}'>{1}</button>".format(help||'' , helpGlyph);
		propertyline += "<input id='altui-widget-"+name+"' name='{0}' value='{1}' {2}></input>"
			.format(name,value,optstr);
		propertyline += "</div>";
		$(dialog).find(".row-fluid").append(propertyline);
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
			propertyline += "	<button data-toggle='tooltip' data-placement='top' title='{0}' type='button' class='btn btn-default btn-xs altui-help-button' data-text='{0}'>{1}</button>".format(help||'' , helpGlyph);
		
		propertyline += "<div class='input-group'>";
			propertyline += "<input id='altui-widget-"+name+"' class='form-control' "+optstr+" value='"+value.escapeXml()+"' "+placeholder+" ></input>";
			propertyline += "<span class='input-group-btn'>";
				propertyline += buttonTemplate.format( "altui-edit-"+name, 'btn-default', "Blockly "+editGlyph,'default',_T('Edit Watch Expression'));
			propertyline += "</span>";
			propertyline += "<input type='hidden' id='altui-xml-"+name+"' class='form-control' value='"+xml.escapeXml()+"' ></input>";
		propertyline += "</div>";
		propertyline += "</div>";
		$(dialog).find(".row-fluid").append(propertyline);
		
		$("#altui-widget-LuaExpression").on("change",function() {
			$("#altui-xml-LuaExpression").val( "" );
		});
	}
	function _dlgAddHtml(dialog,html) 
	{
		$(dialog).find(".row-fluid").append(html);
	}
	function _dlgAddLine(dialog, name, label, value,help, options, col_css)
	{
		var col_css = col_css || ''; //|| 'col-xs-12';
		var optstr = HTMLUtils.optionsToString($.extend( {type:'text'},options));
		value = (value==undefined) ? '' : value.toString() ;
		var placeholder = ((options !=undefined) && (options.placeholder==undefined)) ? "placeholder='enter "+name+"'" : "";
		var propertyline = "";
		propertyline += "<div class='form-group {0}'>".format(col_css);
		propertyline += "	<label for='altui-widget-"+name+"' title='"+(help || '')+"'>"+label+"</label>";
		if (help)
			propertyline += "	<button data-toggle='tooltip' data-placement='top' title='{0}' type='button' class='btn btn-default btn-xs altui-help-button' data-text='{0}'>{1}</button>".format(help||'' , helpGlyph);
		propertyline += "	<input id='altui-widget-"+name+"' class='form-control' "+optstr+" value='"+value.escapeXml()+"' "+placeholder+" ></input>";
		propertyline += "</div>";
		$(dialog).find(".row-fluid").append(propertyline);
	};
	function _dlgAddUrl(dialog, name, label, value,help, options) {
		var optstr = HTMLUtils.optionsToString($.extend( {type:'text'},options));
		value = (value==undefined) ? '' : value ;
		var placeholder = ((options !=undefined) && (options.placeholder==undefined)) ? "placeholder='enter "+name+"'" : "";
		var propertyline = "";
		propertyline += "<div class='form-group'>";
		propertyline += "	<label for='altui-widget-"+name+"' title='"+(help || '')+"'>"+label+"</label>";
		if (help)
			propertyline += "	<button data-toggle='tooltip' data-placement='top' title='{0}' type='button' class='btn btn-default btn-xs altui-help-button' data-text='{0}'>{1}</button>".format(help||'' , helpGlyph);
		// propertyline += "	<input type='url' id='altui-widget-"+name+"' class='form-control' "+optstr+" value='"+value+"' "+placeholder+" ></input>";
		propertyline += "<div class='input-group'>";
		  propertyline += "<input type='text' id='altui-widget-"+name+"' class='form-control' "+optstr+" value='"+value+"' "+placeholder+" placeholder='Url...'>";
		  propertyline += "<span class='input-group-btn'>";
			propertyline += "<button data-forinput='altui-widget-"+name+"' class='btn btn-default altui-url-test' type='button'>"+_T("Test")+"!</button>";
		  propertyline += "</span>";
		propertyline += "</div>"; // <!-- /input-group -->
	propertyline += "</div>";
		$(dialog).find(".row-fluid").append(propertyline);
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
		$(dialog).find(".row-fluid").append(propertyline);
	};	
	function _dlgAddSelectGlyph(dialog, name, label, value, lines, htmloptions) {
		var optstr = HTMLUtils.optionsToString(htmloptions);
		value = (value==undefined) ? '' : value ;
		var propertyline = "";
		propertyline += "<div class='form-group'>";
		propertyline += "	<label for='altui-widget-"+name+"' title='"+name+"'>"+label+"</label>";
			propertyline += "<div class='input-group'>"
			propertyline += "<span class='input-group-addon glyphicon glyphicon-"+value+"'></span>"
			propertyline += "	<select id='altui-widget-"+name+"' class='form-control' "+optstr+">";
			$.each(lines, function(idx,line){
				propertyline += "<option value='{0}' {2}>{1}</option>".format(line.value, line.text, (value==line.value)?'selected':'');
			})
			propertyline += "</select>";
			propertyline += "</div>";
		propertyline += "</div>";
		$(dialog).find(".row-fluid").append(propertyline);
		$(dialog)
			.off("change","select#altui-widget-"+name)
			.on('change', "select#altui-widget-"+name,function(ui,event) {
				$(this).prev("span.input-group-addon").attr("class","input-group-addon glyphicon glyphicon-"+$(this).val())
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
		$(dialog).find(".row-fluid").append(propertyline);
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
			return 	{ value: newvalue, iKind: iKind };
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
		$(dialog).find(".row-fluid").append(propertyline);
	};
	
	function _dlgAddTimer(dialog, name, label, value, htmloptions )
	{
		var optstr = HTMLUtils.optionsToString(htmloptions);
		var propertyline = "";
		propertyline += "<div class='form-group'>";
		propertyline += "	<label for='altui-widget-"+name+"' title='Date Time'>"+(label ? label : name)+"</label>";
		propertyline += "	<input required id='altui-widget-"+name+"' class='form-control' type='text' pattern='^[0-2][0-9]:[0-5][0-9]:[0-5][0-9]$' step='1' value='"+value+"' placeholder='hh:mm:ss' "+optstr+"></input>";
		propertyline += "</div>";
		$(dialog).find(".row-fluid").append(propertyline);
	};
	
	function _dlgAddDateTime(dialog, name, value )
	{
		var propertyline = "";
		propertyline += "<div class='form-group'>";
		propertyline += "	<label for='altui-widget-"+name+"' title='Date Time'>"+name+"</label>";
		propertyline += "	<input id='altui-widget-"+name+"' class='form-control' type='datetime-local' value='"+value+"' placeholder='absolute time' ></input>";
		propertyline += "</div>";
		$(dialog).find(".row-fluid").append(propertyline);
	};
	
	function _dlgAddHouseMode(dialog, name, label, modes ) {
		var propertyline = "";
		propertyline += "<div class='form-group'>";
		propertyline += "	<label for='altui-widget-"+name+"' title='House Modes'>"+label+"</label>";
		propertyline += HouseModeEditor.displayModes( 'altui-widget-'+name , '', modes );
		propertyline += "</div>";
		$(dialog).find(".row-fluid").append(propertyline);
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
		propertyline +=     _getDeviceServiceVariableSelect( device , widget.properties.service, widget.properties.variable, serviceId );
		propertyline += "</div>";
		$(dialog).find(".row-fluid").append(propertyline);
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
		propertyline +=     _pickDevice(devices,deviceid,name);
		propertyline += "</div>";
		
		$(dialog).find(".row-fluid").append(propertyline);
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
				propertyline +=     _pickDevice(devices,deviceid,name);
				propertyline += "</div>";
				
				$(dialog).find(".row-fluid").append(propertyline);
				cbfunc(devices);
			}
		);
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
				propertyline += "      	<div class='form-group'>";
				propertyline += "      		<label for='altui-widget-sceneid'>Scene to Run</label>";
				propertyline += 			select.wrap( "<div></div>" ).parent().html();
				propertyline += "      	</div>";
				$(dialog).find(".row-fluid").append(propertyline);
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
		propertyline +=     _getSelectForEvents(events);
		propertyline += "</div>";
		
		propertyline += "<div class='altui-arguments'>";
		propertyline += _getEventArguments( selected_event , args );
		propertyline += "</div>";
		
		$(dialog).find(".row-fluid").append(propertyline);
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
			propertyline +=     result;
			propertyline += "</div>";
			
			$(dialog).find(".row-fluid").append(propertyline);
			
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
		var hours   = Math.floor(sec_num / 3600);
		var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
		var seconds = sec_num - (hours * 3600) - (minutes * 60);

		if (hours   < 10) {hours   = "0"+hours;}
		if (minutes < 10) {minutes = "0"+minutes;}
		if (seconds < 10) {seconds = "0"+seconds;}
		var time    = hours+':'+minutes+':'+seconds;
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
  String.prototype.startsWith = function (str){
    return this.indexOf(str) == 0;
  };
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
	function _array2Table(arr,idcolumn,viscols,caption,cls,htmlid) {
		var html="";
		var idcolumn = idcolumn || 'id';
		var viscols = viscols || [idcolumn];
		// html+="<div class='col-xs-12'>";
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
			html+="<table id='{1}' class='table table-condensed table-hover table-striped {0}'>".format(cls || '', htmlid || 'altui-grid' );
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
		// html+="</div>";
		return html;
	};
	
	// var panels = [
	// {id:'Header', title:_T("Header"), html:_displayHeader()},
	// {id:'Triggers', title:_T("Triggers"), html:_displayTriggersAndWatches()},
	// {id:'Timers', title:_T("Timers"), html:_displayTimers()},
	// {id:'Lua', title:_T("Lua"), html:_displayLua()},
	// {id:'Actions', title:_T("Actions"), html:_displayActions()},
	// ];
	function _createAccordeon(cls,panels,button) {
		var bFirst = true;
		var html="";
		html += "<div class='{0}'>".format(cls);
		html += "    <div class='panel-group' id='accordion'>";
		$.each( panels, function (idx,panel){
			html += "        <div class='panel panel-default' id='"+panel.id+"'>";
			html += "            <div class='panel-heading'>";
			if (button) {
				html += xsbuttonTemplate.format(button.id, button.class, button.label, button.title);
			}
			html += "                <h4 class='panel-title'>";
			html += "                    <a data-toggle='collapse' data-parent='#accordion' href='#collapse"+panel.id+"'>"+panel.title+"</a><span class='altui-hint' id='altui-hint-"+panel.id+"'></span><span id='altui-caret' class='caret'></span>";
			html += "                </h4>";
			html += "            </div>";
			html += "            <div id='collapse"+panel.id+"' class='panel-collapse collapse {0}'>".format(bFirst ? 'in':'');
			html += "                <div class='panel-body'>";
			html += 					panel.html || _T(' ');
			html += "                </div>";
			html += "            </div>";
			html += "        </div>";
			bFirst = false;
		})
		html += "    </div>";
		html += "</div>";
		return html
	};	
	function _drawButtonGroup(htmlid,model) {
		var html="";
		html += "<div class='btn-group {0}' role='group' aria-label='...'>".format(model.cls ||'');
		$.each(model.buttons, function(i,btn) {
				var label = (btn.img) ? "<img class='{2}' src='{0}' alt='{1}'></img>".format(btn.img,btn.label||'',btn.imgcls||'' ) : (btn.label||'')
				html += "<button id='{1}' type='button' class='btn btn-default {0}'>{2}</button>".format(btn.cls||'',btn.id||'',label)
		})
		// <button type='button' class='btn btn-default'>Left</button>
		// <button type='button' class='btn btn-default'>Middle</button>
		// <button type='button' class='btn btn-default'>Right</button>
		html += "</div>";
		return html;
	};
	function _drawToolbar(htmlid,tools) {
		var toolbarHtml="<div>";	
		var preareas=[];
		$.each(tools, function(idx,tool) {
			var collapsecss = "";
			if (tool.collapsetarget) {
				collapsecss="data-toggle='collapse' data-target='{0}'".format(tool.collapsetarget);
				preareas.push(tool.collapsetarget)
			}
			toolbarHtml+="  <button type='button' class='btn btn-default'  {1} id='{0}' >".format(tool.id,collapsecss);
			var glyph = "<span class='glyphicon {0}' aria-hidden='true' data-toggle='tooltip' data-placement='bottom' title='{1}'></span>".format(tool.glyph,tool.label || '');
			toolbarHtml += glyph;
			if (tool.label)
				toolbarHtml+=("&nbsp;" + tool.label);
			toolbarHtml+="  </button>";			
		});
		toolbarHtml+="</div>";			
		toolbarHtml+="<div>";	
		$.each(preareas, function(idx,idPre) {
			if (idPre.startsWith('#'))
				idPre = idPre.substr(1)
			toolbarHtml+="<div class='collapse' id='{0}'></div>".format(idPre);
		});
		toolbarHtml+="</div>";	
		return "<div class='{0}'>{1}</div>" .format(htmlid,toolbarHtml);
	};
	function _drawFormFields( model  ) {
		var html ="";
		$.each(model, function(idx,line) {
			html += "<div class='form-group'>"
			switch(line.type) {
				case "select": 
					html += "<label for='{0}'>{1}</label>".format(line.id,line.label);
					html += "<select class='form-control' id='{0}'>".format(line.id)
					$.each( line.options, function(i,opt) {
						html += "<option {2} value='{0}'>{1}</option>".format(opt.value, opt.text,(i==line.selected_idx) ? 'selected':'')	
					});
					html += "</select>"
					break;
				case "p":
				case "span":
				case "pre":
				case "div":
					// no form control for text display
					html += "<label for='{0}'>{1}</label>".format(line.id,line.label);
					html +="<{0}  id='{1}' class='' {3}>{2}</{0}>".format(
						line.type,
						line.id,
						_enhanceValue(line.value),
						HTMLUtils.optionsToString(line.opt)
						);
					break;
				case "buttonbar":
					$.each(line.value, function(idx,btn) {
						var cls = (btn.type=="submit") ? "primary" : "default"  
						html += "<button id='{3}' type='{0}' class='btn btn-{1}'>{2}</button>".format(btn.type,cls,btn.label,btn.id);
					});
					break;
				case "input":
					html += "<label for='{0}'>{1}</label>".format(line.id,line.label);
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
					break;
				case "accordeon":
					html += "<label for='{0}'>{1}</label>".format(line.id,line.label);
					html += HTMLUtils.createAccordeon(line.id,line.value);
					break;
				default:
					html += "<span class='text-danger'>Not Implemented:{0}</span>".format(line.type)
					break;
			}
			html += "</div>"
		});
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
			return "<a href='{0}'>{0}</a>".format(value);
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
		array2Table 	: _array2Table,			// (arr,idcolumn,viscols)
		createAccordeon : _createAccordeon,		// (panels)
		drawButtonGroup : _drawButtonGroup,
		drawToolbar 	: _drawToolbar,
		drawFormFields	: _drawFormFields,		
		drawForm		: _drawForm,
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
					_favorites[type][id] = (device.onDashboard==1);
					break;
				case "scene":
					var scene = MultiBox.getSceneByAltuiID( id );
					_favorites[type][id] = ( scene.onDashboard==1);
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
		"on_ui_userDataFirstLoaded" : [],
		"on_ui_userDataLoaded" : [],
		"on_startup_luStatusLoaded" : [],
		
		// ctrl specific ones , 0 is the master then other are going to be added dynamically
		"on_ui_userDataFirstLoaded_0" : [],
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
	
	function _waitForAll(event, eventtbl, object, funcname ) {
		var _state = {};
		function _signal(eventname/*, args */) {
			var theArgs = arguments;
			_state[eventname] = true;
			// if all are true, call the object,funcname
			if (_allSet(_state)) {
				theArgs[0] = event;
				if ($.isFunction(funcname)) {
					(funcname).apply(object,theArgs);
				} else {
					// theArgs.unshift(eventname);
					var func = object[funcname];
					func.apply( object , theArgs );
				}
			}
		};
		$.each(eventtbl , function( idx, event) {
			_state[event] = false;
			_registerEventHandler(event, this, _signal );
		})
	};

	function _publishEvent(eventname/*, args */) {
		// console.log(eventname);
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
		registerEventHandler 	: _registerEventHandler,	//(eventname, object, funcname ) 
		waitForAll 				: _waitForAll,			//(events, object, funcname )
		publishEvent 			: _publishEvent,			//(eventname, args)
		
		getEventSupported : function() {
			return Object.keys(_subscriptions);
		},
	}
})();
// function myFunc(device) {
	// console.log("Device {0} state changed".format(device.id));
// }
//on_ui_initFinished
// EventBus.registerEventHandler("on_ui_deviceStatusChanged",window,"myFunc");

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
		$.each(_pages, func);
	};
	
	return {
		debugReset : _debugReset,
		init :_init,
		recoverFromStorage : _recoverFromStorage,
		clearStorage : _clearStorage,
		forEachPage: _forEachPage,
		getPageFromName: _getPageFromName,
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
		get id()			{ return _cell.id },
		get name() 			{ return _cell.labels[0].attrs.text.text; },
		get conditions() 	{ return _cell.prop.conditions || [] },
		get schedule() 		{ return _cell.prop.schedule  },
		get timer() 		{ return (_cell.prop.timer!="") ? { name: _cell.prop.timer , duration: _cell.prop.duration } : null },
		get source()		{ return new WorkflowState(graph,_stateFromID(_cell.source.id)) },
		get target()		{ return new WorkflowState(graph,_stateFromID(_cell.target.id)) },
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
		get conditions() 	{ return _cell.prop.conditions || [] },
		get onEnter() 		{ return _cell.prop.onEnter || [] },
		get onEnterScenes() { return _cell.prop.onEnterScenes || [] },
		get onEnterLua()	{ return _cell.prop.onEnterLua || "" },
		get onExit() 		{ return _cell.prop.onExit || [] },
		get onExitScenes() 	{ return _cell.prop.onExitScenes || [] },
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
	};
	var _def_linkprops = {
		conditions: [],			// table of device,service,variable, expression with new
		schedule: null,			// schedule ( timer of scene )
		timer: "",					// timer name
		smooth: true,				// smooth link
		duration: ""				// duration ms
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
	
	function _init(workflows) {
		_workflows = workflows;
		// fix old data model
		$.each(workflows,  function(i,w) {
			w = $.extend( {}, _def_workflow, w);
			delete w.active_states;
			
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
						node.prop(  {prop: cell.prop}  )
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
		if (_workflows[idx] !=null) {
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
						if (conditions)  // only start state has conditions
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
			bSaveNeeded = _upgradeWorkflowToFsa(workflow);
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
	
	function _addWorkflow() {
		var altuiid="";
		if (_workflows.length==0)
			altuiid="0-1";
		else {
			var last = _workflows[_workflows.length-1].altuiid;
			var splits = last.split("-");
			altuiid = "0-"+(parseInt(splits[1])+1)
		}
		_workflows.push( $.extend(true,{},_def_workflow,{ altuiid:altuiid, name:'Workflow '+altuiid }) );		
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
			} else  {
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
		var m1 = new joint.shapes.fsa.StartState({
			position: { x: 5, y: 5 },
			attrs: {
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
		saveNeeded : function() 	{ return _saveNeeded; },
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
					} else  if ( n<10 ) {
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
								setTimeout( function() { _tryAuthToken( 0 , data.interval )  } , data.interval*1000 ) 
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
			html += "<div class='panel panel-default'>";
			html += "  <div class='panel-heading'>";
			html += "    <h3 class='panel-title'>Watch Expression</h3>";
			html += "  </div>";
			html += "  <div class='panel-body'>";
				html+="<xml id='toolbox' style='display: none'>";
				html+="    <category name='Watch Types'>";
				html+="      <block type='when'></block>";
				html+="      <block type='whensince'></block>";
				html+="    </category>";
				html+="    <category name='Variable'>";
					html+="  <block type='new_value'></block>";
					html+="  <block type='old_value'></block>";
					// html+="  <block type='variables_get'>";
					// html+="    <field name='VAR'>new</field>";
					// html+="  </block>";
					// html+="  <block type='variables_get'>";
					// html+="    <field name='VAR'>old</field>";
					// html+="  </block>";
				html+="    </category>";
				html+="    <category name='Time'>";
					html+="  <block type='now_value'></block>";
					html+="  <block type='lastupdate_value'></block>";
					html+="  <block type='duration'></block>";
					html+="  <block type='duration_value'></block>";
				html+="    </category>";
				html+="    <category name='Luup'>";
					html+="  <block type='device'></block>";
				html+="    </category>";
				html+="    <category name='Logic'>";
				// html+="      <block type='controls_if'></block>";
				html+="      <block type='logic_compare'></block>";
				html+="      <block type='logic_operation'></block>";
				html+="      <block type='logic_negate'></block>";
				html+="      <block type='logic_boolean'></block>";
				html+="      <block type='logic_null'></block>";
				html+="      <block type='logic_ternary'></block>";
				html+="    </category>";
				// html+="    <category id='catLoops'>";
				// html+="      <block type='controls_repeat_ext'>";
				// html+="        <value name='TIMES'>";
				// html+="          <block type='math_number'>";
				// html+="            <field name='NUM'>10</field>";
				// html+="          </block>";
				// html+="        </value>";
				// html+="      </block>";
				// html+="      <block type='controls_whileUntil'></block>";
				// html+="      <block type='controls_for'>";
				// html+="        <value name='FROM'>";
				// html+="          <block type='math_number'>";
				// html+="            <field name='NUM'>1</field>";
				// html+="          </block>";
				// html+="        </value>";
				// html+="        <value name='TO'>";
				// html+="          <block type='math_number'>";
				// html+="            <field name='NUM'>10</field>";
				// html+="          </block>";
				// html+="        </value>";
				// html+="        <value name='BY'>";
				// html+="          <block type='math_number'>";
				// html+="            <field name='NUM'>1</field>";
				// html+="          </block>";
				// html+="        </value>";
				// html+="      </block>";
				// html+="      <block type='controls_forEach'></block>";
				// html+="      <block type='controls_flow_statements'></block>";
				// html+="    </category>";
				html+="    <category name='Math'>";
				html+="      <block type='math_number'></block>";
				html+="      <block type='math_arithmetic'></block>";
				html+="      <block type='math_single'></block>";
				html+="      <block type='math_trig'></block>";
				html+="      <block type='math_constant'></block>";
				html+="      <block type='math_number_property'></block>";
				// html+="      <block type='math_change'>";
				// html+="        <value name='DELTA'>";
				// html+="          <block type='math_number'>";
				// html+="            <field name='NUM'>1</field>";
				// html+="          </block>";
				// html+="        </value>";
				// html+="      </block>";
				html+="      <block type='math_round'></block>";
				// html+="      <block type='math_on_list'></block>";
				html+="      <block type='math_modulo'></block>";
				// html+="      <block type='math_constrain'>";
				// html+="        <value name='LOW'>";
				// html+="          <block type='math_number'>";
				// html+="            <field name='NUM'>1</field>";
				// html+="          </block>";
				// html+="        </value>";
				// html+="        <value name='HIGH'>";
				// html+="          <block type='math_number'>";
				// html+="            <field name='NUM'>100</field>";
				// html+="          </block>";
				// html+="        </value>";
				// html+="      </block>";
				// html+="      <block type='math_random_int'>";
				// html+="        <value name='FROM'>";
				// html+="          <block type='math_number'>";
				// html+="            <field name='NUM'>1</field>";
				// html+="          </block>";
				// html+="        </value>";
				// html+="        <value name='TO'>";
				// html+="          <block type='math_number'>";
				// html+="            <field name='NUM'>100</field>";
				// html+="          </block>";
				// html+="        </value>";
				// html+="      </block>";
				// html+="      <block type='math_random_float'></block>";
				html+="    </category>";
				html+="    <category name='Text'>";
				html+="      <block type='text'></block>";
				html+="      <block type='text_join'></block>";
				html+="      <block type='text_append'>";
				html+="        <value name='TEXT'>";
				html+="          <block type='text'></block>";
				html+="        </value>";
				html+="      </block>";
				html+="      <block type='text_length'></block>";
				html+="      <block type='text_tonumber'></block>";
				html+="      <block type='text_isEmpty'></block>";
				html+="      <block type='text_indexOf'>";
				html+="        <value name='VALUE'>";
				html+="          <block type='variables_get'>";
				html+="            <field name='VAR' class='textVar'>...</field>";
				html+="          </block>";
				html+="        </value>";
				html+="      </block>";
				html+="      <block type='text_charAt'>";
				html+="        <value name='VALUE'>";
				html+="          <block type='variables_get'>";
				html+="            <field name='VAR' class='textVar'>...</field>";
				html+="          </block>";
				html+="        </value>";
				html+="      </block>";
				html+="      <block type='text_getSubstring'>";
				html+="        <value name='STRING'>";
				html+="          <block type='variables_get'>";
				html+="            <field name='VAR' class='textVar'>...</field>";
				html+="          </block>";
				html+="        </value>";
				html+="      </block>";
				html+="      <block type='text_changeCase'></block>";
				html+="      <block type='text_trim'></block>";
				// html+="      <block type='text_print'></block>";
				// html+="      <block type='text_prompt_ext'>";
				// html+="        <value name='TEXT'>";
				// html+="          <block type='text'></block>";
				// html+="        </value>";
				// html+="      </block>";
				html+="    </category>";
				// html+="    <category id='catLists'>";
				// html+="      <block type='lists_create_empty'></block>";
				// html+="      <block type='lists_create_with'></block>";
				// html+="      <block type='lists_repeat'>";
				// html+="        <value name='NUM'>";
				// html+="          <block type='math_number'>";
				// html+="            <field name='NUM'>5</field>";
				// html+="          </block>";
				// html+="        </value>";
				// html+="      </block>";
				// html+="      <block type='lists_length'></block>";
				// html+="      <block type='lists_isEmpty'></block>";
				// html+="      <block type='lists_indexOf'>";
				// html+="        <value name='VALUE'>";
				// html+="          <block type='variables_get'>";
				// html+="            <field name='VAR' class='listVar'>...</field>";
				// html+="          </block>";
				// html+="        </value>";
				// html+="      </block>";
				// html+="      <block type='lists_getIndex'>";
				// html+="        <value name='VALUE'>";
				// html+="          <block type='variables_get'>";
				// html+="            <field name='VAR' class='listVar'>...</field>";
				// html+="          </block>";
				// html+="        </value>";
				// html+="      </block>";
				// html+="      <block type='lists_setIndex'>";
				// html+="        <value name='LIST'>";
				// html+="          <block type='variables_get'>";
				// html+="            <field name='VAR' class='listVar'>...</field>";
				// html+="          </block>";
				// html+="        </value>";
				// html+="      </block>";
				// html+="      <block type='lists_getSublist'>";
				// html+="        <value name='LIST'>";
				// html+="          <block type='variables_get'>";
				// html+="            <field name='VAR' class='listVar'>...</field>";
				// html+="          </block>";
				// html+="        </value>";
				// html+="      </block>";
				// html+="      <block type='lists_split'>";
				// html+="        <value name='DELIM'>";
				// html+="          <block type='text'>";
				// html+="            <field name='TEXT'>,</field>";
				// html+="          </block>";
				// html+="        </value>";
				// html+="      </block>";
				// html+="    </category>";
				// html+="    <category id='catColour'>";
				// html+="      <block type='colour_picker'></block>";
				// html+="      <block type='colour_random'></block>";
				// html+="      <block type='colour_rgb'>";
				// html+="        <value name='RED'>";
				// html+="          <block type='math_number'>";
				// html+="            <field name='NUM'>100</field>";
				// html+="          </block>";
				// html+="        </value>";
				// html+="        <value name='GREEN'>";
				// html+="          <block type='math_number'>";
				// html+="            <field name='NUM'>50</field>";
				// html+="          </block>";
				// html+="        </value>";
				// html+="        <value name='BLUE'>";
				// html+="          <block type='math_number'>";
				// html+="            <field name='NUM'>0</field>";
				// html+="          </block>";
				// html+="        </value>";
				// html+="      </block>";
				// html+="      <block type='colour_blend'>";
				// html+="        <value name='COLOUR1'>";
				// html+="          <block type='colour_picker'>";
				// html+="            <field name='COLOUR'>#ff0000</field>";
				// html+="          </block>";
				// html+="        </value>";
				// html+="        <value name='COLOUR2'>";
				// html+="          <block type='colour_picker'>";
				// html+="            <field name='COLOUR'>#3333ff</field>";
				// html+="          </block>";
				// html+="        </value>";
				// html+="        <value name='RATIO'>";
				// html+="          <block type='math_number'>";
				// html+="            <field name='NUM'>0.5</field>";
				// html+="          </block>";
				// html+="        </value>";
				// html+="      </block>";
				// html+="    </category
				// html+="    <sep></sep>";
				// html+="    <category id='catVariables' custom='VARIABLE'></category>";
				// html+="    <category id='catFunctions' custom='PROCEDURE'></category>";
				html+="  </xml>";
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
			$.ajax({
				url:  MultiBox.getIconPath(controllerid, name ),
				dataType: "xml",
				cache:false,
				async:false,
				success: function (data) {
					_dbIcon[name] = data;
				}
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
			MultiBox.getIcon(controllerid,  name, function(data) {
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
		getDynamicIcon  : _getDynamicIcon,	// ( controllerid, name , cbfunc ) 
		getIconContent  : _getIconContent,	// ( controllerid, name , cbfunc ) 
		isDB			: function()	{ 	return MyLocalStorage.get("IconDB")!=null;			},
		saveDB			: function() 	{	MyLocalStorage.set("IconDB", _dbIcon);	  	},
		resetDB			: function() 	{	MyLocalStorage.clear("IconDB"); _dbIcon = {}; }
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
			.fail( function( jqxhr, textStatus, errorThrown  ) {
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
		getFileContent  : _getFileContent,		// ( controllerid, name, cbfunc )
		isDB			: function()	{ 	return MyLocalStorage.get("FileDB")!=null;			},
		saveDB			: function(db) 	{	MyLocalStorage.set("FileDB", _dbFile);	  	},
		resetDB			: function(db) 	{	MyLocalStorage.clear("FileDB"); _dbFile = {}; }
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
	
