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
		Localization.setTitle("Vera ALTUI")
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
	return {
		_T : __T,
		init : _initTerms,
		dump : _dumpTerms,
		setTitle : _setTitle,											// str
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
			var editor = ace.edit( "altui-editor-text" );
			editor.setTheme( "ace/theme/"+ (MyLocalStorage.getSettings("EditorTheme") || "monokai") );
			var lang = 
			editor.getSession().setMode( "ace/mode/"+options.language);
			editor.setFontSize( MyLocalStorage.getSettings("EditorFontSize") );
			// resize
			dialog.modal()
				.on('shown.bs.modal', function () {
					var widthparent = $("div#altui-editor-text").closest(".form-group").innerWidth();
					$("div#altui-editor-text").resizable({
						// containment: "parent",
						maxWidth:widthparent,
						stop: function( event, ui ) {
							editor.resize();
						}
					});
					if (options && $.isFunction(options.onDisplay)) {
						(options.onDisplay)(editor);
					}
				})
				.on("click touchend",".altui-luacode-test",function(){ 
					var lua = editor.getValue();
					MultiBox.runLua(0,lua, function(result) {
						alert(JSON.stringify(result));
					});
				})
				.on("click touchend",".altui-luacode-save",function(){ 
					// Save Callback
					var code = editor.getValue();
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
			// [{isdefault:true, label:_T("Yes")}]
			DialogManager.dlgAddDialogButton(dialog, button.isdefault, button.label);
		});
		// buttons
		$('div#dialogs')		
			.off('submit',"div#dialogModal form")
			.on( 'submit',"div#dialogModal form", function() {
				result = true;
				dialog.modal('hide');
			})
			.off('hide.bs.modal',"div#dialogModal")
			.on( 'hide.bs.modal',"div#dialogModal", function() {
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
			$(".altui-arguments input").each( function(idx,elem)
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
					event.label.text,
					selected));
			});
			return select.wrap( "<div></div>" ).parent().html();
		};

		function _getEventArguments( selected_event, args ) {
			var propertyline="";
			if ((selected_event!=null) && (selected_event.argumentList)) 
			{
				$.each(selected_event.argumentList, function(idx,eventarg) {
					propertyline += "<div class='form-group'>";
					propertyline += "	<label for='altui-event-param{0}'>{1} {2}</label>".format(idx,eventarg.name,eventarg.comparisson);
					propertyline += "	<input required id='altui-event-param{0}' type='text' class='form-control' value='{1}' placeholder='default to {2}'></input>"
						.format(eventarg.id, _findArgumentValue(args,eventarg.id,eventarg.defaultValue), eventarg.defaultValue );
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
			var bFirst=true;
			html+="<table id='{1}' class='table table-condensed table-hover table-striped {0}'>".format(cls || '', htmlid || 'altui-grid' );
			if (caption)
				html += "<caption>{0}</caption>".format(caption)
			$.each(arr, function(idx,obj) {
				if (bFirst) {
					html+="<thead>"
					html+="<tr>"
					$.each(obj, function(k,v) {
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
				$.each(obj, function(k,v) {
					html+="<td>"
					html+=v;
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
			html += "                    <a data-toggle='collapse' data-parent='#accordion' href='#collapse"+panel.id+"'>"+panel.title+"</a><span class='altui-hint' id='altui-hint-"+panel.id+"'></span><span id='trigger' class='caret'></span>";
			html += "                </h4>";
			html += "            </div>";
			html += "            <div id='collapse"+panel.id+"' class='panel-collapse collapse {0}'>".format(bFirst ? 'in':'');
			html += "                <div class='panel-body'>";
			html += 					panel.html || _T('Empty');
			html += "                </div>";
			html += "            </div>";
			html += "        </div>";
			bFirst = false;
		})
		html += "    </div>";
		html += "</div>";
		return html
	};	
	
	function _drawToolbar(_tools) {
		var toolbarHtml="<div>";	
		var preareas=[];
		$.each(_tools, function(idx,tool) {
			var collapsecss = "";
			if (tool.collapsetarget) {
				collapsecss="data-toggle='collapse' data-target='{0}'".format(tool.collapsetarget);
				preareas.push(tool.collapsetarget)
			}
			toolbarHtml+="  <button type='button' class='btn btn-default'  {1} id='{0}' >".format(tool.id,collapsecss);
			var glyph = "<span class='glyphicon {0}' aria-hidden='true' data-toggle='tooltip' data-placement='bottom' title='{1}'></span>".format(tool.glyph,tool.label);
			toolbarHtml+=(glyph+ "&nbsp;" + tool.label);
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
		return "<div class='altui-workflow-toolbar'>"+toolbarHtml+"</div>" ;
	};
	function _drawFormFields( model  ) {
		var html ="";
		$.each(model, function(idx,line) {
			html += "<div class='form-group'>"
			switch(line.type) {
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
					html +="<input id='{0}' class='form-control' value='{1}' {2} {3}></input>".format(
						line.id,
						line.value,
						HTMLUtils.optionsToString(line.opt),
						type);
					break;
				case "accordeon":
					html += "<label for='{0}'>{1}</label>".format(line.id,line.label);
					html += HTMLUtils.createAccordeon(line.id,line.value);
					break;
			}
			html += "</div>"
		});
		return html;
	};
	
	function _drawForm( htmlid, title, model ) {
		var html ="";
		if (isNullOrEmpty(title) == false)
			html += "<h3>{0}</h3>".format(title);
		html += "<form id='{0}' name='{0}'>".format(htmlid)
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
			AltuiDebug.warning("Cannot schedule twice the same timer %s",id);
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
			console.log(new Date().toISOString()+": ALTUI "+g_DeviceTypes.info["PluginVersion"]+":"+str);
	};
	function _warning(str) {
			console.log(new Date().toISOString()+": ALTUI "+g_DeviceTypes.info["PluginVersion"]+":"+str);
	}
	
	return {
		SetDebug: function(bDebug)	{ g_debug=bDebug; },
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
				MultiBox.saveData( "Data", page.name, JSON.stringify(page), function(data) {
					if (data!="")
						PageMessage.message("Save for "+page.name+" succeeded.", "success");
					else
						PageMessage.message( "Save for "+page.name+" did not succeed." , "danger");
					(callback)();
				});
			} else {
				var names = $.map( _pages, function(page,idx) {	return page.name;	} );
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
		get id()				{ return _cell.id },
		get name() 		{ return _cell.labels[0].attrs.text.text; },
		get conditions() 	{ return _cell.prop.conditions || [] },
		get schedule() 	{ return _cell.prop.schedule  },
		get timer() 			{ return (_cell.prop.timer!="") ? { name: _cell.prop.timer , duration: _cell.prop.duration } : null },
		get source()		{ return new WorkflowState(graph,_stateFromID(_cell.source.id)) },
		get target()		{ return new WorkflowState(graph,_stateFromID(_cell.target.id)) },
	}
};

var WorkflowState = function(graph,cell) {
	var _cell = cell;
	var _graph = graph;
	return {
		isStart: function() { return _cell.prop.stateinfo ? _cell.prop.stateinfo.bStart : false },
		get name() { return _cell.attrs[".label"].text; },
		get transitions() { 
			return $.map( $.grep(_graph.cells, function(e) { return (e.type == "link") && (e.source.id == _cell.id) }) , function(l) {
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
			return $.map( $.grep(_graph.cells, function(e) { return e.type != "link" }) , function(s) {
				return new WorkflowState(_graph,s);
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
		timer: "",				// timer name
		duration: ""				// duration ms
	};
		
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
		})
	};
	
	function _sanitizeWorkflow(altuiid) {
		var bSaveNeeded = false;
		var idx = _findWorkflowIdxByAltuiid(altuiid);
		if (idx!=null) {
			var descr = WorkflowManager.getWorkflowDescr(altuiid)
			$.each(descr.states, function(j,state) {
				$.each(['onEnter','onExit'], function(k,type) {
					for (var i=state[type].length-1; i>=0; i-- ) {
						var device = MultiBox.getDeviceByAltuiID(state[type][i].device)
						if (device==null) {
							state[type].splice(i,1)
							bSaveNeeded=true;
						}
					}
				})
				$.each(['onEnterScenes','onExitScenes'], function(k,type) {
					for (var i=state[type].length-1; i>=0; i-- ) {
						var scene = MultiBox.getSceneByAltuiID(state[type][i].altuiid)
						if (scene==null) {
							state[type].splice(i,1)
							bSaveNeeded=true;
						}
					}
				})
				for (var i=state['conditions'].length-1; i>=0; i-- ) {
					var device = MultiBox.getDeviceByAltuiID(state['conditions'][i].device)
					if (device==null) {
						state['conditions'].splice(i,1)
						bSaveNeeded=true;
					}
				}
			});
			if (bSaveNeeded==true) {
				descr.updateGraph();
				_saveWorkflow(altuiid);
			}
		}
	};

	function _forceReloadWorkflows() {
		var altuidevice = MultiBox.getDeviceByID( 0, g_MyDeviceID );
		var names = $.map( _workflows, function(workflow,idx) {	return workflow.name;	} );
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
			
			MultiBox.saveData( "Wflow", workflow.name, JSON.stringify(workflow), function(data) {
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
		var altuidevice = MultiBox.getDeviceByID( 0, g_MyDeviceID );
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
		var states = $.map($.grep(graph.cells, function(e) { return e.type != "link" }),function(e) {
			return e.attrs[".label"].text;
		});
		var links = $.map($.grep(graph.cells, function(e) { return e.type == "link" }),function(e) {
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
					if ( (action.device == g_MyDeviceID) 
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
								"device": g_MyDeviceID ,
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
	function _resyncScenes(workflow_altuiid) {
		// find workflow
		var workflow = _getWorkflow(workflow_altuiid)
		if (!workflow)
			return;
		
		var graph = JSON.parse(workflow.graph_json);
		var links = $.grep(graph.cells, function(e) { return e.type == "link" });
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
					if ( (action.device == g_MyDeviceID) 
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
	return {
		init: _init,
		saveNeeded : function() 	{ return _saveNeeded; },
		getNodeProperties: function( obj )	{ return $.extend(true,{},_def_nodeprops, obj) },	// insure the defaults evolves
		getLinkProperties: function( obj )	{ return $.extend(true,{},_def_linkprops, obj) },
		getWorkflows : function()	{ return _workflows; },
		getWorkflow: _getWorkflow,
		setWorkflow: _setWorkflow,									// workflow
		getWorkflowStats : _getWorkflowStats,					// (altuiid)
		getWorkflowDescr : _getWorkflowDescr,					// (altuiid)
		clearLinkScheduleScene : _clearLinkScheduleScene,	// workflow_altuiid, link
		resyncScenes : _resyncScenes ,								// workflow_altuiid
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
	
/* ========================================================================
 * Bootstrap (plugin): validator.js v0.8.0
 * ========================================================================
 * The MIT License (MIT)
 *
 * Copyright (c) 2013 Cina Saffary.
 * Made by @1000hz in the style of Bootstrap 3 era @fat
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * ======================================================================== */


+function ($) {
  'use strict';

  // VALIDATOR CLASS DEFINITION
  // ==========================

  var Validator = function (element, options) {
    this.$element = $(element)
    this.options  = options

    options.errors = $.extend({}, Validator.DEFAULTS.errors, options.errors)

    for (var custom in options.custom) {
      if (!options.errors[custom]) throw new Error('Missing default error message for custom validator: ' + custom)
    }

    $.extend(Validator.VALIDATORS, options.custom)

    this.$element.attr('novalidate', true) // disable automatic native validation
    this.toggleSubmit()

    this.$element.on('input.bs.validator change.bs.validator focusout.bs.validator', $.proxy(this.validateInput, this))
    this.$element.on('submit.bs.validator', $.proxy(this.onSubmit, this))

    this.$element.find('[data-match]').each(function () {
      var $this  = $(this)
      var target = $this.data('match')

      $(target).on('input.bs.validator', function (e) {
        $this.val() && $this.trigger('input.bs.validator')
      })
    })
  }

  Validator.DEFAULTS = {
    delay: 500,
    html: false,
    disable: true,
    custom: {},
    errors: {
      match: 'Does not match',
      minlength: 'Not long enough'
    }
  }

  Validator.VALIDATORS = {
    native: function ($el) {
      var el = $el[0]
      return el.checkValidity ? el.checkValidity() : true
    },
    match: function ($el) {
      var target = $el.data('match')
      return !$el.val() || $el.val() === $(target).val()
    },
    minlength: function ($el) {
      var minlength = $el.data('minlength')
      return !$el.val() || $el.val().length >= minlength
    }
  }

  Validator.prototype.validateInput = function (e) {
    var $el        = $(e.target)
    var prevErrors = $el.data('bs.validator.errors')
    var errors

    if ($el.is('[type="radio"]')) $el = this.$element.find('input[name="' + $el.attr('name') + '"]')

    this.$element.trigger(e = $.Event('validate.bs.validator', {relatedTarget: $el[0]}))

    if (e.isDefaultPrevented()) return

    var self = this

    this.runValidators($el).done(function (errors) {
      $el.data('bs.validator.errors', errors)

      errors.length ? self.showErrors($el) : self.clearErrors($el)

      if (!prevErrors || errors.toString() !== prevErrors.toString()) {
        e = errors.length
          ? $.Event('invalid.bs.validator', {relatedTarget: $el[0], detail: errors})
          : $.Event('valid.bs.validator', {relatedTarget: $el[0], detail: prevErrors})

        self.$element.trigger(e)
      }

      self.toggleSubmit()

      self.$element.trigger($.Event('validated.bs.validator', {relatedTarget: $el[0]}))
    })
  }


  Validator.prototype.runValidators = function ($el) {
    var errors   = []
    var deferred = $.Deferred()
    var options  = this.options

    $el.data('bs.validator.deferred') && $el.data('bs.validator.deferred').reject()
    $el.data('bs.validator.deferred', deferred)

    function getErrorMessage(key) {
      return $el.data(key + '-error')
        || $el.data('error')
        || key == 'native' && $el[0].validationMessage
        || options.errors[key]
    }

    $.each(Validator.VALIDATORS, $.proxy(function (key, validator) {
      if (($el.data(key) || key == 'native') && !validator.call(this, $el)) {
        var error = getErrorMessage(key)
        !~errors.indexOf(error) && errors.push(error)
      }
    }, this))

    if (!errors.length && $el.val() && $el.data('remote')) {
      this.defer($el, function () {
        var data = {}
        data[$el.attr('name')] = $el.val()
        $.get($el.data('remote'), data)
          .fail(function (jqXHR, textStatus, error) { errors.push(getErrorMessage('remote') || error) })
          .always(function () { deferred.resolve(errors)})
      })
    } else deferred.resolve(errors)

    return deferred.promise()
  }

  Validator.prototype.validate = function () {
    var delay = this.options.delay

    this.options.delay = 0
    this.$element.find(':input:not([type="hidden"])').trigger('input.bs.validator')
    this.options.delay = delay

    return this
  }

  Validator.prototype.showErrors = function ($el) {
    var method = this.options.html ? 'html' : 'text'

    this.defer($el, function () {
      var $group = $el.closest('.form-group')
      var $block = $group.find('.help-block.with-errors')
      var $feedback = $group.find('.form-control-feedback')
      var errors = $el.data('bs.validator.errors')

      if (!errors.length) return

      errors = $('<ul/>')
        .addClass('list-unstyled')
        .append($.map(errors, function (error) { return $('<li/>')[method](error) }))

      $block.data('bs.validator.originalContent') === undefined && $block.data('bs.validator.originalContent', $block.html())
      $block.empty().append(errors)
      $group.addClass('has-error')

      $feedback.length
        && $feedback.removeClass('glyphicon-ok')
        && $feedback.addClass('glyphicon-warning-sign')
        && $group.removeClass('has-success')
    })
  }

  Validator.prototype.clearErrors = function ($el) {
    var $group = $el.closest('.form-group')
    var $block = $group.find('.help-block.with-errors')
    var $feedback = $group.find('.form-control-feedback')

    $block.html($block.data('bs.validator.originalContent'))
    $group.removeClass('has-error')

    $feedback.length
      && $feedback.removeClass('glyphicon-warning-sign')
      && $feedback.addClass('glyphicon-ok')
      && $group.addClass('has-success')
  }

  Validator.prototype.hasErrors = function () {
    function fieldErrors() {
      return !!($(this).data('bs.validator.errors') || []).length
    }

    return !!this.$element.find(':input:enabled').filter(fieldErrors).length
  }

  Validator.prototype.isIncomplete = function () {
    function fieldIncomplete() {
      return this.type === 'checkbox' ? !this.checked                                   :
             this.type === 'radio'    ? !$('[name="' + this.name + '"]:checked').length :
                                        $.trim(this.value) === ''
    }

    return !!this.$element.find(':input[required]:enabled').filter(fieldIncomplete).length
  }

  Validator.prototype.onSubmit = function (e) {
    this.validate()
    if (this.isIncomplete() || this.hasErrors()) e.preventDefault()
  }

  Validator.prototype.toggleSubmit = function () {
    if(!this.options.disable) return
    var $btn = this.$element.find('input[type="submit"], button[type="submit"]')
    $btn.toggleClass('disabled', this.isIncomplete() || this.hasErrors())
      .css({'pointer-events': 'all', 'cursor': 'pointer'})
  }

  Validator.prototype.defer = function ($el, callback) {
    if (!this.options.delay) return callback()
    window.clearTimeout($el.data('bs.validator.timeout'))
    $el.data('bs.validator.timeout', window.setTimeout(callback, this.options.delay))
  }

  Validator.prototype.destroy = function () {
    this.$element
      .removeAttr('novalidate')
      .removeData('bs.validator')
      .off('.bs.validator')

    this.$element.find(':input')
      .off('.bs.validator')
      .removeData(['bs.validator.errors', 'bs.validator.deferred'])
      .each(function () {
        var $this = $(this)
        var timeout = $this.data('bs.validator.timeout')
        window.clearTimeout(timeout) && $this.removeData('bs.validator.timeout')
      })

    this.$element.find('.help-block.with-errors').each(function () {
      var $this = $(this)
      var originalContent = $this.data('bs.validator.originalContent')

      $this
        .removeData('bs.validator.originalContent')
        .html(originalContent)
    })

    this.$element.find('input[type="submit"], button[type="submit"]').removeClass('disabled')

    this.$element.find('.has-error').removeClass('has-error')

    return this
  }

  // VALIDATOR PLUGIN DEFINITION
  // ===========================


  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var options = $.extend({}, Validator.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var data    = $this.data('bs.validator')

      if (!data && option == 'destroy') return
      if (!data) $this.data('bs.validator', (data = new Validator(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.validator

  $.fn.validator             = Plugin
  $.fn.validator.Constructor = Validator


  // VALIDATOR NO CONFLICT
  // =====================

  $.fn.validator.noConflict = function () {
    $.fn.validator = old
    return this
  }


  // VALIDATOR DATA-API
  // ==================

  $(window).on('load', function () {
    $('form[data-toggle="validator"]').each(function () {
      var $form = $(this)
      Plugin.call($form, $form.data())
    })
  })

}(jQuery);

/* ========================================================================
 * http://www.kunalbabre.com/projects/table2CSV.php
 * ======================================================================== */
 jQuery.fn.table2CSV = function(options) {
    var options = jQuery.extend({
        separator: ',',
        header: [],
        delivery: 'popup' // popup, value
    },
    options);

    var csvData = [];
    var headerArr = [];
    var el = this;

    //header
    var numCols = options.header.length;
    var tmpRow = []; // construct header avalible array

    if (numCols > 0) {
        for (var i = 0; i < numCols; i++) {
            tmpRow[tmpRow.length] = formatData(options.header[i]);
        }
    } else {
        $(el).filter(':visible').find('th').each(function() {
            if ($(this).css('display') != 'none') tmpRow[tmpRow.length] = formatData($(this).html());
        });
    }

    row2CSV(tmpRow);

    // actual data
    $(el).find('tr').each(function() {
        var tmpRow = [];
        $(this).filter(':visible').find('td').each(function() {
            if ($(this).css('display') != 'none') tmpRow[tmpRow.length] = formatData($(this).html());
        });
        row2CSV(tmpRow);
    });
    if (options.delivery == 'popup') {
        var mydata = csvData.join('\n');
        return popup(mydata);
    } else {
        var mydata = csvData.join('\n');
		if ($.isFunction(options.delivery)) {
			(options.delivery)(mydata);
		}
        return mydata;
    }

    function row2CSV(tmpRow) {
        var tmp = tmpRow.join('') // to remove any blank rows
        // alert(tmp);
        if (tmpRow.length > 0 && tmp != '') {
            var mystr = tmpRow.join(options.separator);
            csvData[csvData.length] = mystr;
        }
    }
    function formatData(input) {
        // replace " with â€œ
        var regexp = new RegExp(/["]/g);
        var output = input.replace(regexp, "â€œ");
        //HTML
        var regexp = new RegExp(/\<[^\<]+\>/g);
        var output = output.replace(regexp, "");
        if (output == "") return '';
        return '"' + output + '"';
    }
    function popup(data) {
		
		// $("<textarea id='altui-divtemp'></textarea>").appendTo("body");
		// $("textarea#altui-divtemp").focus();
		// $("textarea#altui-divtemp").text(data)
		// $("textarea#altui-divtemp").select();
		// document.execCommand('copy');
		// $("textarea#altui-divtemp").remove();
		// alert(_T("Data copied in clipboard"));

        var generator = window.open('', 'csv', 'height=400,width=600');
        generator.document.write('<html><head><title>CSV</title>');
        generator.document.write('</head><body >');
        generator.document.write('<textArea cols=70 rows=15 wrap="off" >');
        generator.document.write(data);
        generator.document.write('</textArea>');
        generator.document.write('</body></html>');
        generator.document.close();
        return true;
    }
};

/**
 * Bootstrap Multiselect (https://github.com/davidstutz/bootstrap-multiselect)
 * 
 * Apache License, Version 2.0:
 * Copyright (c) 2012 - 2015 David Stutz
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a
 * copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 * 
 * BSD 3-Clause License:
 * Copyright (c) 2012 - 2015 David Stutz
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *    - Redistributions of source code must retain the above copyright notice,
 *      this list of conditions and the following disclaimer.
 *    - Redistributions in binary form must reproduce the above copyright notice,
 *      this list of conditions and the following disclaimer in the documentation
 *      and/or other materials provided with the distribution.
 *    - Neither the name of David Stutz nor the names of its contributors may be
 *      used to endorse or promote products derived from this software without
 *      specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
 * OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
 var bootstrap_multiselect_css = ".multiselect-container{position:absolute;list-style-type:none;margin:0;padding:0}.multiselect-container .input-group{margin:5px}.multiselect-container>li{padding:0}.multiselect-container>li>a.multiselect-all label{font-weight:700}.multiselect-container>li.multiselect-group label{margin:0;padding:3px 20px 3px 20px;height:100%;font-weight:700}.multiselect-container>li.multiselect-group-clickable label{cursor:pointer}.multiselect-container>li>a{padding:0}.multiselect-container>li>a>label{margin:0;height:100%;cursor:pointer;font-weight:400;padding:3px 10px 3px 25px}.multiselect-container>li>a>label.radio,.multiselect-container>li>a>label.checkbox{margin:0}.multiselect-container>li>a>label>input[type=checkbox]{margin-bottom:5px}.btn-group>.btn-group:nth-child(2)>.multiselect.btn{border-top-left-radius:4px;border-bottom-left-radius:4px}.form-inline .multiselect-container label.checkbox,.form-inline .multiselect-container label.radio{padding:3px 10px 3px 25px}.form-inline .multiselect-container li a label.checkbox input[type=checkbox],.form-inline .multiselect-container li a label.radio input[type=radio]{margin-left:-20px;margin-right:0}";
!function ($) {
    "use strict";// jshint ;_;

    if (typeof ko !== 'undefined' && ko.bindingHandlers && !ko.bindingHandlers.multiselect) {
        ko.bindingHandlers.multiselect = {
            after: ['options', 'value', 'selectedOptions', 'enable', 'disable'],

            init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
                var $element = $(element);
                var config = ko.toJS(valueAccessor());

                $element.multiselect(config);

                if (allBindings.has('options')) {
                    var options = allBindings.get('options');
                    if (ko.isObservable(options)) {
                        ko.computed({
                            read: function() {
                                options();
                                setTimeout(function() {
                                    var ms = $element.data('multiselect');
                                    if (ms)
                                        ms.updateOriginalOptions();//Not sure how beneficial this is.
                                    $element.multiselect('rebuild');
                                }, 1);
                            },
                            disposeWhenNodeIsRemoved: element
                        });
                    }
                }

                //value and selectedOptions are two-way, so these will be triggered even by our own actions.
                //It needs some way to tell if they are triggered because of us or because of outside change.
                //It doesn't loop but it's a waste of processing.
                if (allBindings.has('value')) {
                    var value = allBindings.get('value');
                    if (ko.isObservable(value)) {
                        ko.computed({
                            read: function() {
                                value();
                                setTimeout(function() {
                                    $element.multiselect('refresh');
                                }, 1);
                            },
                            disposeWhenNodeIsRemoved: element
                        }).extend({ rateLimit: 100, notifyWhenChangesStop: true });
                    }
                }

                //Switched from arrayChange subscription to general subscription using 'refresh'.
                //Not sure performance is any better using 'select' and 'deselect'.
                if (allBindings.has('selectedOptions')) {
                    var selectedOptions = allBindings.get('selectedOptions');
                    if (ko.isObservable(selectedOptions)) {
                        ko.computed({
                            read: function() {
                                selectedOptions();
                                setTimeout(function() {
                                    $element.multiselect('refresh');
                                }, 1);
                            },
                            disposeWhenNodeIsRemoved: element
                        }).extend({ rateLimit: 100, notifyWhenChangesStop: true });
                    }
                }

                var setEnabled = function (enable) {
                    setTimeout(function () {
                        if (enable)
                            $element.multiselect('enable');
                        else
                            $element.multiselect('disable');
                    });
                };

                if (allBindings.has('enable')) {
                    var enable = allBindings.get('enable');
                    if (ko.isObservable(enable)) {
                        ko.computed({
                            read: function () {
                                setEnabled(enable());
                            },
                            disposeWhenNodeIsRemoved: element
                        }).extend({ rateLimit: 100, notifyWhenChangesStop: true });
                    } else {
                        setEnabled(enable);
                    }
                }

                if (allBindings.has('disable')) {
                    var disable = allBindings.get('disable');
                    if (ko.isObservable(disable)) {
                        ko.computed({
                            read: function () {
                                setEnabled(!disable());
                            },
                            disposeWhenNodeIsRemoved: element
                        }).extend({ rateLimit: 100, notifyWhenChangesStop: true });
                    } else {
                        setEnabled(!disable);
                    }
                }

                ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                    $element.multiselect('destroy');
                });
            },

            update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
                var $element = $(element);
                var config = ko.toJS(valueAccessor());

                $element.multiselect('setOptions', config);
                $element.multiselect('rebuild');
            }
        };
    }

    function forEach(array, callback) {
        for (var index = 0; index < array.length; ++index) {
            callback(array[index], index);
        }
    }

    /**
     * Constructor to create a new multiselect using the given select.
     *
     * @param {jQuery} select
     * @param {Object} options
     * @returns {Multiselect}
     */
    function Multiselect(select, options) {

        this.$select = $(select);
        
        // Placeholder via data attributes
        if (this.$select.attr("data-placeholder")) {
            options.nonSelectedText = this.$select.data("placeholder");
        }
        
        this.options = this.mergeOptions($.extend({}, options, this.$select.data()));

        // Initialization.
        // We have to clone to create a new reference.
        this.originalOptions = this.$select.clone()[0].options;
        this.query = '';
        this.searchTimeout = null;
        this.lastToggledInput = null;

        this.options.multiple = this.$select.attr('multiple') === "multiple";
        this.options.onChange = $.proxy(this.options.onChange, this);
        this.options.onDropdownShow = $.proxy(this.options.onDropdownShow, this);
        this.options.onDropdownHide = $.proxy(this.options.onDropdownHide, this);
        this.options.onDropdownShown = $.proxy(this.options.onDropdownShown, this);
        this.options.onDropdownHidden = $.proxy(this.options.onDropdownHidden, this);
        this.options.onInitialized = $.proxy(this.options.onInitialized, this);
        
        // Build select all if enabled.
        this.buildContainer();
        this.buildButton();
        this.buildDropdown();
        this.buildSelectAll();
        this.buildDropdownOptions();
        this.buildFilter();

        this.updateButtonText();
        this.updateSelectAll(true);

        if (this.options.disableIfEmpty && $('option', this.$select).length <= 0) {
            this.disable();
        }
        
        this.$select.hide().after(this.$container);
        this.options.onInitialized(this.$select, this.$container);
    }

    Multiselect.prototype = {

        defaults: {
            /**
             * Default text function will either print 'None selected' in case no
             * option is selected or a list of the selected options up to a length
             * of 3 selected options.
             * 
             * @param {jQuery} options
             * @param {jQuery} select
             * @returns {String}
             */
            buttonText: function(options, select) {
                if (this.disabledText.length > 0 
                        && (this.disableIfEmpty || select.prop('disabled')) 
                        && options.length == 0) {
                    
                    return this.disabledText;
                }
                else if (options.length === 0) {
                    return this.nonSelectedText;
                }
                else if (this.allSelectedText 
                        && options.length === $('option', $(select)).length 
                        && $('option', $(select)).length !== 1 
                        && this.multiple) {

                    if (this.selectAllNumber) {
                        return this.allSelectedText + ' (' + options.length + ')';
                    }
                    else {
                        return this.allSelectedText;
                    }
                }
                else if (options.length > this.numberDisplayed) {
                    return options.length + ' ' + this.nSelectedText;
                }
                else {
                    var selected = '';
                    var delimiter = this.delimiterText;
                    
                    options.each(function() {
                        var label = ($(this).attr('label') !== undefined) ? $(this).attr('label') : $(this).text();
                        selected += label + delimiter;
                    });
                    
                    return selected.substr(0, selected.length - 2);
                }
            },
            /**
             * Updates the title of the button similar to the buttonText function.
             * 
             * @param {jQuery} options
             * @param {jQuery} select
             * @returns {@exp;selected@call;substr}
             */
            buttonTitle: function(options, select) {
                if (options.length === 0) {
                    return this.nonSelectedText;
                }
                else {
                    var selected = '';
                    var delimiter = this.delimiterText;
                    
                    options.each(function () {
                        var label = ($(this).attr('label') !== undefined) ? $(this).attr('label') : $(this).text();
                        selected += label + delimiter;
                    });
                    return selected.substr(0, selected.length - 2);
                }
            },
            /**
             * Create a label.
             *
             * @param {jQuery} element
             * @returns {String}
             */
            optionLabel: function(element){
                return $(element).attr('label') || $(element).text();
            },
            /**
             * Create a class.
             *
             * @param {jQuery} element
             * @returns {String}
             */
            optionClass: function(element) {
                return $(element).attr('class') || '';
            },
            /**
             * Triggered on change of the multiselect.
             * 
             * Not triggered when selecting/deselecting options manually.
             * 
             * @param {jQuery} option
             * @param {Boolean} checked
             */
            onChange : function(option, checked) {

            },
            /**
             * Triggered when the dropdown is shown.
             *
             * @param {jQuery} event
             */
            onDropdownShow: function(event) {

            },
            /**
             * Triggered when the dropdown is hidden.
             *
             * @param {jQuery} event
             */
            onDropdownHide: function(event) {

            },
            /**
             * Triggered after the dropdown is shown.
             * 
             * @param {jQuery} event
             */
            onDropdownShown: function(event) {
                
            },
            /**
             * Triggered after the dropdown is hidden.
             * 
             * @param {jQuery} event
             */
            onDropdownHidden: function(event) {
                
            },
            /**
             * Triggered on select all.
             */
            onSelectAll: function(checked) {
                
            },
            /**
             * Triggered after initializing.
             *
             * @param {jQuery} $select
             * @param {jQuery} $container
             */
            onInitialized: function($select, $container) {

            },
            enableHTML: false,
            buttonClass: 'btn btn-default',
            inheritClass: false,
            buttonWidth: 'auto',
            buttonContainer: '<div class="btn-group" />',
            dropRight: false,
            dropUp: false,
            selectedClass: 'active',
            // Maximum height of the dropdown menu.
            // If maximum height is exceeded a scrollbar will be displayed.
            maxHeight: false,
            checkboxName: false,
            includeSelectAllOption: false,
            includeSelectAllIfMoreThan: 0,
            selectAllText: ' Select all',
            selectAllValue: 'multiselect-all',
            selectAllName: false,
            selectAllNumber: true,
            selectAllJustVisible: true,
            enableFiltering: false,
            enableCaseInsensitiveFiltering: false,
            enableFullValueFiltering: false,
            enableClickableOptGroups: false,
            enableCollapsibelOptGroups: false,
            filterPlaceholder: 'Search',
            // possible options: 'text', 'value', 'both'
            filterBehavior: 'text',
            includeFilterClearBtn: true,
            preventInputChangeEvent: false,
            nonSelectedText: 'None selected',
            nSelectedText: 'selected',
            allSelectedText: 'All selected',
            numberDisplayed: 3,
            disableIfEmpty: false,
            disabledText: '',
            delimiterText: ', ',
            templates: {
                button: '<button type="button" class="multiselect dropdown-toggle" data-toggle="dropdown"><span class="multiselect-selected-text"></span> <b class="caret"></b></button>',
                ul: '<ul class="multiselect-container dropdown-menu"></ul>',
                filter: '<li class="multiselect-item filter"><div class="input-group"><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span><input class="form-control multiselect-search" type="text"></div></li>',
                filterClearBtn: '<span class="input-group-btn"><button class="btn btn-default multiselect-clear-filter" type="button"><i class="glyphicon glyphicon-remove-circle"></i></button></span>',
                li: '<li><a tabindex="0"><label></label></a></li>',
                divider: '<li class="multiselect-item divider"></li>',
                liGroup: '<li class="multiselect-item multiselect-group"><label></label></li>'
            }
        },

        constructor: Multiselect,

        /**
         * Builds the container of the multiselect.
         */
        buildContainer: function() {
            this.$container = $(this.options.buttonContainer);
            this.$container.on('show.bs.dropdown', this.options.onDropdownShow);
            this.$container.on('hide.bs.dropdown', this.options.onDropdownHide);
            this.$container.on('shown.bs.dropdown', this.options.onDropdownShown);
            this.$container.on('hidden.bs.dropdown', this.options.onDropdownHidden);
        },

        /**
         * Builds the button of the multiselect.
         */
        buildButton: function() {
            this.$button = $(this.options.templates.button).addClass(this.options.buttonClass);
            if (this.$select.attr('class') && this.options.inheritClass) {
                this.$button.addClass(this.$select.attr('class'));
            }
            // Adopt active state.
            if (this.$select.prop('disabled')) {
                this.disable();
            }
            else {
                this.enable();
            }

            // Manually add button width if set.
            if (this.options.buttonWidth && this.options.buttonWidth !== 'auto') {
                this.$button.css({
                    'width' : this.options.buttonWidth,
                    'overflow' : 'hidden',
                    'text-overflow' : 'ellipsis'
                });
                this.$container.css({
                    'width': this.options.buttonWidth
                });
            }

            // Keep the tab index from the select.
            var tabindex = this.$select.attr('tabindex');
            if (tabindex) {
                this.$button.attr('tabindex', tabindex);
            }

            this.$container.prepend(this.$button);
        },

        /**
         * Builds the ul representing the dropdown menu.
         */
        buildDropdown: function() {

            // Build ul.
            this.$ul = $(this.options.templates.ul);

            if (this.options.dropRight) {
                this.$ul.addClass('pull-right');
            }

            // Set max height of dropdown menu to activate auto scrollbar.
            if (this.options.maxHeight) {
                // TODO: Add a class for this option to move the css declarations.
                this.$ul.css({
                    'max-height': this.options.maxHeight + 'px',
                    'overflow-y': 'auto',
                    'overflow-x': 'hidden'
                });
            }
            
            if (this.options.dropUp) {
                
                var height = Math.min(this.options.maxHeight, $('option[data-role!="divider"]', this.$select).length*26 + $('option[data-role="divider"]', this.$select).length*19 + (this.options.includeSelectAllOption ? 26 : 0) + (this.options.enableFiltering || this.options.enableCaseInsensitiveFiltering ? 44 : 0));
                var moveCalc = height + 34;
                
                this.$ul.css({
                    'max-height': height + 'px',
                    'overflow-y': 'auto',
                    'overflow-x': 'hidden',
                    'margin-top': "-" + moveCalc + 'px'
                });
            }
            
            this.$container.append(this.$ul);
        },

        /**
         * Build the dropdown options and binds all nessecary events.
         * 
         * Uses createDivider and createOptionValue to create the necessary options.
         */
        buildDropdownOptions: function() {

            this.$select.children().each($.proxy(function(index, element) {

                var $element = $(element);
                // Support optgroups and options without a group simultaneously.
                var tag = $element.prop('tagName')
                    .toLowerCase();
            
                if ($element.prop('value') === this.options.selectAllValue) {
                    return;
                }

                if (tag === 'optgroup') {
                    this.createOptgroup(element);
                }
                else if (tag === 'option') {

                    if ($element.data('role') === 'divider') {
                        this.createDivider();
                    }
                    else {
                        this.createOptionValue(element);
                    }

                }

                // Other illegal tags will be ignored.
            }, this));

            // Bind the change event on the dropdown elements.
            $('li input', this.$ul).on('change', $.proxy(function(event) {
                var $target = $(event.target);

                var checked = $target.prop('checked') || false;
                var isSelectAllOption = $target.val() === this.options.selectAllValue;

                // Apply or unapply the configured selected class.
                if (this.options.selectedClass) {
                    if (checked) {
                        $target.closest('li')
                            .addClass(this.options.selectedClass);
                    }
                    else {
                        $target.closest('li')
                            .removeClass(this.options.selectedClass);
                    }
                }

                // Get the corresponding option.
                var value = $target.val();
                var $option = this.getOptionByValue(value);

                var $optionsNotThis = $('option', this.$select).not($option);
                var $checkboxesNotThis = $('input', this.$container).not($target);

                if (isSelectAllOption) {
                    if (checked) {
                        this.selectAll(this.options.selectAllJustVisible);
                    }
                    else {
                        this.deselectAll(this.options.selectAllJustVisible);
                    }
                }
                else {
                    if (checked) {
                        $option.prop('selected', true);

                        if (this.options.multiple) {
                            // Simply select additional option.
                            $option.prop('selected', true);
                        }
                        else {
                            // Unselect all other options and corresponding checkboxes.
                            if (this.options.selectedClass) {
                                $($checkboxesNotThis).closest('li').removeClass(this.options.selectedClass);
                            }

                            $($checkboxesNotThis).prop('checked', false);
                            $optionsNotThis.prop('selected', false);

                            // It's a single selection, so close.
                            this.$button.click();
                        }

                        if (this.options.selectedClass === "active") {
                            $optionsNotThis.closest("a").css("outline", "");
                        }
                    }
                    else {
                        // Unselect option.
                        $option.prop('selected', false);
                    }
                    
                    // To prevent select all from firing onChange: #575
                    this.options.onChange($option, checked);
                }

                this.$select.change();

                this.updateButtonText();
                this.updateSelectAll();

                if(this.options.preventInputChangeEvent) {
                    return false;
                }
            }, this));

            $('li a', this.$ul).on('mousedown', function(e) {
                if (e.shiftKey) {
                    // Prevent selecting text by Shift+click
                    return false;
                }
            });
        
            $('li a', this.$ul).on('touchstart click', $.proxy(function(event) {
                event.stopPropagation();

                var $target = $(event.target);
                
                if (event.shiftKey && this.options.multiple) {
                    if($target.is("label")){ // Handles checkbox selection manually (see https://github.com/davidstutz/bootstrap-multiselect/issues/431)
                        event.preventDefault();
                        $target = $target.find("input");
                        $target.prop("checked", !$target.prop("checked"));
                    }
                    var checked = $target.prop('checked') || false;

                    if (this.lastToggledInput !== null && this.lastToggledInput !== $target) { // Make sure we actually have a range
                        var from = $target.closest("li").index();
                        var to = this.lastToggledInput.closest("li").index();
                        
                        if (from > to) { // Swap the indices
                            var tmp = to;
                            to = from;
                            from = tmp;
                        }
                        
                        // Make sure we grab all elements since slice excludes the last index
                        ++to;
                        
                        // Change the checkboxes and underlying options
                        var range = this.$ul.find("li").slice(from, to).find("input");
                        
                        range.prop('checked', checked);
                        
                        if (this.options.selectedClass) {
                            range.closest('li')
                                .toggleClass(this.options.selectedClass, checked);
                        }
                        
                        for (var i = 0, j = range.length; i < j; i++) {
                            var $checkbox = $(range[i]);

                            var $option = this.getOptionByValue($checkbox.val());

                            $option.prop('selected', checked);
                        }                   
                    }
                    
                    // Trigger the select "change" event
                    $target.trigger("change");
                }
                
                // Remembers last clicked option
                if($target.is("input") && !$target.closest("li").is(".multiselect-item")){
                    this.lastToggledInput = $target;
                }

                $target.blur();
            }, this));

            // Keyboard support.
            this.$container.off('keydown.multiselect').on('keydown.multiselect', $.proxy(function(event) {
                if ($('input[type="text"]', this.$container).is(':focus')) {
                    return;
                }

                if (event.keyCode === 9 && this.$container.hasClass('open')) {
                    this.$button.click();
                }
                else {
                    var $items = $(this.$container).find("li:not(.divider):not(.disabled) a").filter(":visible");

                    if (!$items.length) {
                        return;
                    }

                    var index = $items.index($items.filter(':focus'));

                    // Navigation up.
                    if (event.keyCode === 38 && index > 0) {
                        index--;
                    }
                    // Navigate down.
                    else if (event.keyCode === 40 && index < $items.length - 1) {
                        index++;
                    }
                    else if (!~index) {
                        index = 0;
                    }

                    var $current = $items.eq(index);
                    $current.focus();

                    if (event.keyCode === 32 || event.keyCode === 13) {
                        var $checkbox = $current.find('input');

                        $checkbox.prop("checked", !$checkbox.prop("checked"));
                        $checkbox.change();
                    }

                    event.stopPropagation();
                    event.preventDefault();
                }
            }, this));

            if(this.options.enableClickableOptGroups && this.options.multiple) {
                $('li.multiselect-group', this.$ul).on('click', $.proxy(function(event) {
                    event.stopPropagation();
                    var group = $(event.target).parent();

                    // Search all option in optgroup
                    var $options = group.nextUntil('li.multiselect-group');
                    var $visibleOptions = $options.filter(":visible:not(.disabled)");

                    // check or uncheck items
                    var allChecked = true;
                    var optionInputs = $visibleOptions.find('input');
                    var values = [];
                    
                    optionInputs.each(function() {
                        allChecked = allChecked && $(this).prop('checked');
                        values.push($(this).val());
                    });

                    if (!allChecked) {
                        this.select(values, false);
                    }
                    else {
                        this.deselect(values, false);
                    }
                    
                    this.options.onChange(optionInputs, !allChecked);
               }, this));
            }

            if (this.options.enableCollapsibleOptGroups && this.options.multiple) {
                $("li.multiselect-group input", this.$ul).off();
                $("li.multiselect-group", this.$ul).siblings().not("li.multiselect-group, li.multiselect-all", this.$ul).each( function () {
                    $(this).toggleClass('hidden', true);
                });
                
                $("li.multiselect-group", this.$ul).on("click", $.proxy(function(group) {
                    group.stopPropagation();
                }, this));
                
                $("li.multiselect-group > a > b", this.$ul).on("click", $.proxy(function(t) {
                    t.stopPropagation();
                    var n = $(t.target).closest('li');
                    var r = n.nextUntil("li.multiselect-group");
                    var i = true;
                    
                    r.each(function() {
                        i = i && $(this).hasClass('hidden');
                    });
                    
                    r.toggleClass('hidden', !i);
                }, this));
                
                $("li.multiselect-group > a > input", this.$ul).on("change", $.proxy(function(t) {
                    t.stopPropagation();
                    var n = $(t.target).closest('li');
                    var r = n.nextUntil("li.multiselect-group", ':not(.disabled)');
                    var s = r.find("input");
                    
                    var i = true;
                    s.each(function() {
                        i = i && $(this).prop("checked");
                    });
                    
                    s.prop("checked", !i).trigger("change");
                }, this));
                
                // Set the initial selection state of the groups.
                $('li.multiselect-group', this.$ul).each(function() {
                    var r = $(this).nextUntil("li.multiselect-group", ':not(.disabled)');
                    var s = r.find("input");
                    
                    var i = true;
                    s.each(function() {
                        i = i && $(this).prop("checked");
                    });
                    
                    $(this).find('input').prop("checked", i);
                });
                
                // Update the group checkbox based on new selections among the
                // corresponding children.
                $("li input", this.$ul).on("change", $.proxy(function(t) {
                    t.stopPropagation();
                    var n = $(t.target).closest('li');
                    var r1 = n.prevUntil("li.multiselect-group", ':not(.disabled)');
                    var r2 = n.nextUntil("li.multiselect-group", ':not(.disabled)');
                    var s1 = r1.find("input");
                    var s2 = r2.find("input");
                    
                    var i = $(t.target).prop('checked');
                    s1.each(function() {
                        i = i && $(this).prop("checked");
                    });
                    
                    s2.each(function() {
                        i = i && $(this).prop("checked");
                    });
                    
                    n.prevAll('.multiselect-group').find('input').prop('checked', i);
                }, this));
                
                $("li.multiselect-all", this.$ul).css('background', '#f3f3f3').css('border-bottom', '1px solid #eaeaea');
                $("li.multiselect-group > a, li.multiselect-all > a > label.checkbox", this.$ul).css('padding', '3px 20px 3px 35px');
                $("li.multiselect-group > a > input", this.$ul).css('margin', '4px 0px 5px -20px');
            }
        },

        /**
         * Create an option using the given select option.
         *
         * @param {jQuery} element
         */
        createOptionValue: function(element) {
            var $element = $(element);
            if ($element.is(':selected')) {
                $element.prop('selected', true);
            }

            // Support the label attribute on options.
            var label = this.options.optionLabel(element);
            var classes = this.options.optionClass(element);
            var value = $element.val();
            var inputType = this.options.multiple ? "checkbox" : "radio";

            var $li = $(this.options.templates.li);
            var $label = $('label', $li);
            $label.addClass(inputType);
            $li.addClass(classes);

            if (this.options.enableHTML) {
                $label.html(" " + label);
            }
            else {
                $label.text(" " + label);
            }
        
            var $checkbox = $('<input/>').attr('type', inputType);

            if (this.options.checkboxName) {
                $checkbox.attr('name', this.options.checkboxName);
            }
            $label.prepend($checkbox);

            var selected = $element.prop('selected') || false;
            $checkbox.val(value);

            if (value === this.options.selectAllValue) {
                $li.addClass("multiselect-item multiselect-all");
                $checkbox.parent().parent()
                    .addClass('multiselect-all');
            }

            $label.attr('title', $element.attr('title'));

            this.$ul.append($li);

            if ($element.is(':disabled')) {
                $checkbox.attr('disabled', 'disabled')
                    .prop('disabled', true)
                    .closest('a')
                    .attr("tabindex", "-1")
                    .closest('li')
                    .addClass('disabled');
            }

            $checkbox.prop('checked', selected);

            if (selected && this.options.selectedClass) {
                $checkbox.closest('li')
                    .addClass(this.options.selectedClass);
            }
        },

        /**
         * Creates a divider using the given select option.
         *
         * @param {jQuery} element
         */
        createDivider: function(element) {
            var $divider = $(this.options.templates.divider);
            this.$ul.append($divider);
        },

        /**
         * Creates an optgroup.
         *
         * @param {jQuery} group
         */
        createOptgroup: function(group) {            
            if (this.options.enableCollapsibleOptGroups && this.options.multiple) {
                var label = $(group).attr("label");
                var value = $(group).attr("value");
                var r = $('<li class="multiselect-item multiselect-group"><a href="javascript:void(0);"><input type="checkbox" value="' + value + '"/><b> ' + label + '<b class="caret"></b></b></a></li>');

                if (this.options.enableClickableOptGroups) {
                    r.addClass("multiselect-group-clickable")
                }
                this.$ul.append(r);
                if ($(group).is(":disabled")) {
                    r.addClass("disabled")
                }
                $("option", group).each($.proxy(function($, group) {
                    this.createOptionValue(group)
                }, this))
            }
            else {
                var groupName = $(group).prop('label');

                // Add a header for the group.
                var $li = $(this.options.templates.liGroup);

                if (this.options.enableHTML) {
                    $('label', $li).html(groupName);
                }
                else {
                    $('label', $li).text(groupName);
                }

                if (this.options.enableClickableOptGroups) {
                    $li.addClass('multiselect-group-clickable');
                }

                this.$ul.append($li);

                if ($(group).is(':disabled')) {
                    $li.addClass('disabled');
                }

                // Add the options of the group.
                $('option', group).each($.proxy(function(index, element) {
                    this.createOptionValue(element);
                }, this));
            }
        },

        /**
         * Build the select all.
         * 
         * Checks if a select all has already been created.
         */
        buildSelectAll: function() {
            if (typeof this.options.selectAllValue === 'number') {
                this.options.selectAllValue = this.options.selectAllValue.toString();
            }
            
            var alreadyHasSelectAll = this.hasSelectAll();

            if (!alreadyHasSelectAll && this.options.includeSelectAllOption && this.options.multiple
                    && $('option', this.$select).length > this.options.includeSelectAllIfMoreThan) {

                // Check whether to add a divider after the select all.
                if (this.options.includeSelectAllDivider) {
                    this.$ul.prepend($(this.options.templates.divider));
                }

                var $li = $(this.options.templates.li);
                $('label', $li).addClass("checkbox");
                
                if (this.options.enableHTML) {
                    $('label', $li).html(" " + this.options.selectAllText);
                }
                else {
                    $('label', $li).text(" " + this.options.selectAllText);
                }
                
                if (this.options.selectAllName) {
                    $('label', $li).prepend('<input type="checkbox" name="' + this.options.selectAllName + '" />');
                }
                else {
                    $('label', $li).prepend('<input type="checkbox" />');
                }
                
                var $checkbox = $('input', $li);
                $checkbox.val(this.options.selectAllValue);

                $li.addClass("multiselect-item multiselect-all");
                $checkbox.parent().parent()
                    .addClass('multiselect-all');

                this.$ul.prepend($li);

                $checkbox.prop('checked', false);
            }
        },

        /**
         * Builds the filter.
         */
        buildFilter: function() {

            // Build filter if filtering OR case insensitive filtering is enabled and the number of options exceeds (or equals) enableFilterLength.
            if (this.options.enableFiltering || this.options.enableCaseInsensitiveFiltering) {
                var enableFilterLength = Math.max(this.options.enableFiltering, this.options.enableCaseInsensitiveFiltering);

                if (this.$select.find('option').length >= enableFilterLength) {

                    this.$filter = $(this.options.templates.filter);
                    $('input', this.$filter).attr('placeholder', this.options.filterPlaceholder);
                    
                    // Adds optional filter clear button
                    if(this.options.includeFilterClearBtn){
                        var clearBtn = $(this.options.templates.filterClearBtn);
                        clearBtn.on('click', $.proxy(function(event){
                            clearTimeout(this.searchTimeout);
                            this.$filter.find('.multiselect-search').val('');
                            $('li', this.$ul).show().removeClass("filter-hidden");
                            this.updateSelectAll();
                        }, this));
                        this.$filter.find('.input-group').append(clearBtn);
                    }
                    
                    this.$ul.prepend(this.$filter);

                    this.$filter.val(this.query).on('click', function(event) {
                        event.stopPropagation();
                    }).on('input keydown', $.proxy(function(event) {
                        // Cancel enter key default behaviour
                        if (event.which === 13) {
                          event.preventDefault();
                        }
                        
                        // This is useful to catch "keydown" events after the browser has updated the control.
                        clearTimeout(this.searchTimeout);

                        this.searchTimeout = this.asyncFunction($.proxy(function() {

                            if (this.query !== event.target.value) {
                                this.query = event.target.value;

                                var currentGroup, currentGroupVisible;
                                $.each($('li', this.$ul), $.proxy(function(index, element) {
                                    var value = $('input', element).length > 0 ? $('input', element).val() : "";
                                    var text = $('label', element).text();

                                    var filterCandidate = '';
                                    if ((this.options.filterBehavior === 'text')) {
                                        filterCandidate = text;
                                    }
                                    else if ((this.options.filterBehavior === 'value')) {
                                        filterCandidate = value;
                                    }
                                    else if (this.options.filterBehavior === 'both') {
                                        filterCandidate = text + '\n' + value;
                                    }

                                    if (value !== this.options.selectAllValue && text) {

                                        // By default lets assume that element is not
                                        // interesting for this search.
                                        var showElement = false;

                                        if (this.options.enableCaseInsensitiveFiltering) {
                                            filterCandidate = filterCandidate.toLowerCase();
                                            this.query = this.query.toLowerCase();
                                        }

                                        if (this.options.enableFullValueFiltering && this.options.filterBehavior !== 'both') {
                                            var valueToMatch = filterCandidate.trim().substring(0, this.query.length);
                                            if (this.query.indexOf(valueToMatch) > -1) {
                                                showElement = true;
                                            }
                                        }
                                        else if (filterCandidate.indexOf(this.query) > -1) {
                                            showElement = true;
                                        }

                                        // Toggle current element (group or group item) according to showElement boolean.
                                        $(element).toggle(showElement).toggleClass('filter-hidden', !showElement);
                                        
                                        // Differentiate groups and group items.
                                        if ($(element).hasClass('multiselect-group')) {
                                            // Remember group status.
                                            currentGroup = element;
                                            currentGroupVisible = showElement;
                                        }
                                        else {
                                            // Show group name when at least one of its items is visible.
                                            if (showElement) {
                                                $(currentGroup).show().removeClass('filter-hidden');
                                            }
                                            
                                            // Show all group items when group name satisfies filter.
                                            if (!showElement && currentGroupVisible) {
                                                $(element).show().removeClass('filter-hidden');
                                            }
                                        }
                                    }
                                }, this));
                            }

                            this.updateSelectAll();
                        }, this), 300, this);
                    }, this));
                }
            }
        },

        /**
         * Unbinds the whole plugin.
         */
        destroy: function() {
            this.$container.remove();
            this.$select.show();
            this.$select.data('multiselect', null);
        },

        /**
         * Refreshs the multiselect based on the selected options of the select.
         */
        refresh: function () {
            var inputs = $.map($('li input', this.$ul), $);
            
            $('option', this.$select).each($.proxy(function (index, element) {
                var $elem = $(element);
                var value = $elem.val();
                var $input;
                for (var i = inputs.length; 0 < i--; /**/) {
                    if (value !== ($input = inputs[i]).val())
                        continue; // wrong li

                    if ($elem.is(':selected')) {
                        $input.prop('checked', true);

                        if (this.options.selectedClass) {
                            $input.closest('li')
                                .addClass(this.options.selectedClass);
                        }
                    }
                    else {
                        $input.prop('checked', false);

                        if (this.options.selectedClass) {
                            $input.closest('li')
                                .removeClass(this.options.selectedClass);
                        }
                    }

                    if ($elem.is(":disabled")) {
                        $input.attr('disabled', 'disabled')
                            .prop('disabled', true)
                            .closest('li')
                            .addClass('disabled');
                    }
                    else {
                        $input.prop('disabled', false)
                            .closest('li')
                            .removeClass('disabled');
                    }
                    break; // assumes unique values
                }
            }, this));

            this.updateButtonText();
            this.updateSelectAll();
        },

        /**
         * Select all options of the given values.
         * 
         * If triggerOnChange is set to true, the on change event is triggered if
         * and only if one value is passed.
         * 
         * @param {Array} selectValues
         * @param {Boolean} triggerOnChange
         */
        select: function(selectValues, triggerOnChange) {
            if(!$.isArray(selectValues)) {
                selectValues = [selectValues];
            }

            for (var i = 0; i < selectValues.length; i++) {
                var value = selectValues[i];

                if (value === null || value === undefined) {
                    continue;
                }

                var $option = this.getOptionByValue(value);
                var $checkbox = this.getInputByValue(value);

                if($option === undefined || $checkbox === undefined) {
                    continue;
                }
                
                if (!this.options.multiple) {
                    this.deselectAll(false);
                }
                
                if (this.options.selectedClass) {
                    $checkbox.closest('li')
                        .addClass(this.options.selectedClass);
                }

                $checkbox.prop('checked', true);
                $option.prop('selected', true);
                
                if (triggerOnChange) {
                    this.options.onChange($option, true);
                }
            }

            this.updateButtonText();
            this.updateSelectAll();
        },

        /**
         * Clears all selected items.
         */
        clearSelection: function () {
            this.deselectAll(false);
            this.updateButtonText();
            this.updateSelectAll();
        },

        /**
         * Deselects all options of the given values.
         * 
         * If triggerOnChange is set to true, the on change event is triggered, if
         * and only if one value is passed.
         * 
         * @param {Array} deselectValues
         * @param {Boolean} triggerOnChange
         */
        deselect: function(deselectValues, triggerOnChange) {
            if(!$.isArray(deselectValues)) {
                deselectValues = [deselectValues];
            }

            for (var i = 0; i < deselectValues.length; i++) {
                var value = deselectValues[i];

                if (value === null || value === undefined) {
                    continue;
                }

                var $option = this.getOptionByValue(value);
                var $checkbox = this.getInputByValue(value);

                if($option === undefined || $checkbox === undefined) {
                    continue;
                }

                if (this.options.selectedClass) {
                    $checkbox.closest('li')
                        .removeClass(this.options.selectedClass);
                }

                $checkbox.prop('checked', false);
                $option.prop('selected', false);
                
                if (triggerOnChange) {
                    this.options.onChange($option, false);
                }
            }

            this.updateButtonText();
            this.updateSelectAll();
        },
        
        /**
         * Selects all enabled & visible options.
         *
         * If justVisible is true or not specified, only visible options are selected.
         *
         * @param {Boolean} justVisible
         * @param {Boolean} triggerOnSelectAll
         */
        selectAll: function (justVisible, triggerOnSelectAll) {
            justVisible = (this.options.enableCollapsibleOptGroups && this.options.multiple) ? false : justVisible;
            
            var justVisible = typeof justVisible === 'undefined' ? true : justVisible;
            var allCheckboxes = $("li input[type='checkbox']:enabled", this.$ul);
            var visibleCheckboxes = allCheckboxes.filter(":visible");
            var allCheckboxesCount = allCheckboxes.length;
            var visibleCheckboxesCount = visibleCheckboxes.length;
            
            if(justVisible) {
                visibleCheckboxes.prop('checked', true);
                $("li:not(.divider):not(.disabled)", this.$ul).filter(":visible").addClass(this.options.selectedClass);
            }
            else {
                allCheckboxes.prop('checked', true);
                $("li:not(.divider):not(.disabled)", this.$ul).addClass(this.options.selectedClass);
            }
                
            if (allCheckboxesCount === visibleCheckboxesCount || justVisible === false) {
                $("option:not([data-role='divider']):enabled", this.$select).prop('selected', true);
            }
            else {
                var values = visibleCheckboxes.map(function() {
                    return $(this).val();
                }).get();
                
                $("option:enabled", this.$select).filter(function(index) {
                    return $.inArray($(this).val(), values) !== -1;
                }).prop('selected', true);
            }
            
            if (triggerOnSelectAll) {
                this.options.onSelectAll();
            }
        },

        /**
         * Deselects all options.
         * 
         * If justVisible is true or not specified, only visible options are deselected.
         * 
         * @param {Boolean} justVisible
         */
        deselectAll: function (justVisible) {
            justVisible = (this.options.enableCollapsibleOptGroups && this.options.multiple) ? false : justVisible;
            justVisible = typeof justVisible === 'undefined' ? true : justVisible;
            
            if(justVisible) {              
                var visibleCheckboxes = $("li input[type='checkbox']:not(:disabled)", this.$ul).filter(":visible");
                visibleCheckboxes.prop('checked', false);
                
                var values = visibleCheckboxes.map(function() {
                    return $(this).val();
                }).get();
                
                $("option:enabled", this.$select).filter(function(index) {
                    return $.inArray($(this).val(), values) !== -1;
                }).prop('selected', false);
                
                if (this.options.selectedClass) {
                    $("li:not(.divider):not(.disabled)", this.$ul).filter(":visible").removeClass(this.options.selectedClass);
                }
            }
            else {
                $("li input[type='checkbox']:enabled", this.$ul).prop('checked', false);
                $("option:enabled", this.$select).prop('selected', false);
                
                if (this.options.selectedClass) {
                    $("li:not(.divider):not(.disabled)", this.$ul).removeClass(this.options.selectedClass);
                }
            }
        },

        /**
         * Rebuild the plugin.
         * 
         * Rebuilds the dropdown, the filter and the select all option.
         */
        rebuild: function() {
            this.$ul.html('');

            // Important to distinguish between radios and checkboxes.
            this.options.multiple = this.$select.attr('multiple') === "multiple";

            this.buildSelectAll();
            this.buildDropdownOptions();
            this.buildFilter();

            this.updateButtonText();
            this.updateSelectAll(true);
            
            if (this.options.disableIfEmpty && $('option', this.$select).length <= 0) {
                this.disable();
            }
            else {
                this.enable();
            }
            
            if (this.options.dropRight) {
                this.$ul.addClass('pull-right');
            }
        },

        /**
         * The provided data will be used to build the dropdown.
         */
        dataprovider: function(dataprovider) {
            
            var groupCounter = 0;
            var $select = this.$select.empty();
            
            $.each(dataprovider, function (index, option) {
                var $tag;
                
                if ($.isArray(option.children)) { // create optiongroup tag
                    groupCounter++;
                    
                    $tag = $('<optgroup/>').attr({
                        label: option.label || 'Group ' + groupCounter,
                        disabled: !!option.disabled
                    });
                    
                    forEach(option.children, function(subOption) { // add children option tags
                        $tag.append($('<option/>').attr({
                            value: subOption.value,
                            label: subOption.label || subOption.value,
                            title: subOption.title,
                            selected: !!subOption.selected,
                            disabled: !!subOption.disabled
                        }));
                    });
                }
                else {
                    $tag = $('<option/>').attr({
                        value: option.value,
                        label: option.label || option.value,
                        title: option.title,
                        class: option.class,
                        selected: !!option.selected,
                        disabled: !!option.disabled
                    });
                    $tag.text(option.label || option.value);
                }
                
                $select.append($tag);
            });
            
            this.rebuild();
        },

        /**
         * Enable the multiselect.
         */
        enable: function() {
            this.$select.prop('disabled', false);
            this.$button.prop('disabled', false)
                .removeClass('disabled');
        },

        /**
         * Disable the multiselect.
         */
        disable: function() {
            this.$select.prop('disabled', true);
            this.$button.prop('disabled', true)
                .addClass('disabled');
        },

        /**
         * Set the options.
         *
         * @param {Array} options
         */
        setOptions: function(options) {
            this.options = this.mergeOptions(options);
        },

        /**
         * Merges the given options with the default options.
         *
         * @param {Array} options
         * @returns {Array}
         */
        mergeOptions: function(options) {
            return $.extend(true, {}, this.defaults, this.options, options);
        },

        /**
         * Checks whether a select all checkbox is present.
         *
         * @returns {Boolean}
         */
        hasSelectAll: function() {
            return $('li.multiselect-all', this.$ul).length > 0;
        },

        /**
         * Updates the select all checkbox based on the currently displayed and selected checkboxes.
         */
        updateSelectAll: function(notTriggerOnSelectAll) {
            if (this.hasSelectAll()) {
                var allBoxes = $("li:not(.multiselect-item):not(.filter-hidden) input:enabled", this.$ul);
                var allBoxesLength = allBoxes.length;
                var checkedBoxesLength = allBoxes.filter(":checked").length;
                var selectAllLi  = $("li.multiselect-all", this.$ul);
                var selectAllInput = selectAllLi.find("input");
                
                if (checkedBoxesLength > 0 && checkedBoxesLength === allBoxesLength) {
                    selectAllInput.prop("checked", true);
                    selectAllLi.addClass(this.options.selectedClass);
                    this.options.onSelectAll(true);
                }
                else {
                    selectAllInput.prop("checked", false);
                    selectAllLi.removeClass(this.options.selectedClass);
                    if (checkedBoxesLength === 0) {
                        if (!notTriggerOnSelectAll) {
                            this.options.onSelectAll(false);
                        }
                    }
                }
            }
        },

        /**
         * Update the button text and its title based on the currently selected options.
         */
        updateButtonText: function() {
            var options = this.getSelected();
            
            // First update the displayed button text.
            if (this.options.enableHTML) {
                $('.multiselect .multiselect-selected-text', this.$container).html(this.options.buttonText(options, this.$select));
            }
            else {
                $('.multiselect .multiselect-selected-text', this.$container).text(this.options.buttonText(options, this.$select));
            }
            
            // Now update the title attribute of the button.
            $('.multiselect', this.$container).attr('title', this.options.buttonTitle(options, this.$select));
        },

        /**
         * Get all selected options.
         *
         * @returns {jQUery}
         */
        getSelected: function() {
            return $('option', this.$select).filter(":selected");
        },

        /**
         * Gets a select option by its value.
         *
         * @param {String} value
         * @returns {jQuery}
         */
        getOptionByValue: function (value) {

            var options = $('option', this.$select);
            var valueToCompare = value.toString();

            for (var i = 0; i < options.length; i = i + 1) {
                var option = options[i];
                if (option.value === valueToCompare) {
                    return $(option);
                }
            }
        },

        /**
         * Get the input (radio/checkbox) by its value.
         *
         * @param {String} value
         * @returns {jQuery}
         */
        getInputByValue: function (value) {

            var checkboxes = $('li input', this.$ul);
            var valueToCompare = value.toString();

            for (var i = 0; i < checkboxes.length; i = i + 1) {
                var checkbox = checkboxes[i];
                if (checkbox.value === valueToCompare) {
                    return $(checkbox);
                }
            }
        },

        /**
         * Used for knockout integration.
         */
        updateOriginalOptions: function() {
            this.originalOptions = this.$select.clone()[0].options;
        },

        asyncFunction: function(callback, timeout, self) {
            var args = Array.prototype.slice.call(arguments, 3);
            return setTimeout(function() {
                callback.apply(self || window, args);
            }, timeout);
        },

        setAllSelectedText: function(allSelectedText) {
            this.options.allSelectedText = allSelectedText;
            this.updateButtonText();
        }
    };

    $.fn.multiselect = function(option, parameter, extraOptions) {
        return this.each(function() {
            var data = $(this).data('multiselect');
            var options = typeof option === 'object' && option;

            // Initialize the multiselect.
            if (!data) {
                data = new Multiselect(this, options);
                $(this).data('multiselect', data);
            }

            // Call multiselect method.
            if (typeof option === 'string') {
                data[option](parameter, extraOptions);
                
                if (option === 'destroy') {
                    $(this).data('multiselect', false);
                }
            }
        });
    };

    $.fn.multiselect.Constructor = Multiselect;

    $(function() {
        $("select[data-role=multiselect]").multiselect();
    });

}(window.jQuery);

