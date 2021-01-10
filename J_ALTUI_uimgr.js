//#	 sourceURL=J_ALTUI_uimgr.js
// "use strict";
// http://192.168.0.17:3480/data_request?id=lr_ALTUI_Handler&command=home
// ALTUI: This program is free software: you can redistribute it and/or modify
// it under the condition that it is for private or home useage and
// this whole comment is reproduced in the source code file
// Commercial utilisation is not authorized without the appropriate
// written devagreement from amg0 / alexis . mermet @ gmail . com
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE.

/*The MIT License (MIT)
BOOTGRID: Copyright (c) 2014-2015 Rafael J. Staib

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

//
// Blakc iphone6 //drive.google.com/uc?id=0B6TVdm2A9rnNakxEdDdYVWVxMnM&authuser=0&export=download
// Black : //docs.google.com/uc?authuser=0&id=0B6TVdm2A9rnNLWlIeEZDN1ZGU0k&export=download
// Transparent : //drive.google.com/uc?id=0B6TVdm2A9rnNMkx5M0FsLWk2djg&authuser=0&export=download

// UIManager.loadScript('https://www.google.com/jsapi?autoload={"modules":[{"name":"visualization","version":"1","packages":["corechart","table","gauge"]}]}');
var ALTUI_revision = "$MyRevision: 2552 $";
var ALTUI_registered = null;
var NULL_DEVICE = "0-0";
var NULL_SCENE = "0-0";
var NULL_ROOM = "0-0";
var NO_URL = 'no url';
var tagModel = ['primary','success','danger','warning','info','dark']
var _HouseModes = [];
var deviceModalTemplate = "";
var deviceActionModalTemplate = "";
var defaultDialogModalTemplate = "";
var categoryFilters = {
	'power':  {label:"Power", glyph:"fa-power-off", types:[
		"urn:schemas-upnp-org:device:BinaryLight:1",
		"urn:schemas-upnp-org:device:DimmableLight:1",
		"urn:schemas-upnp-org:device:DimmableRGBLight:1",
		"urn:schemas-upnp-org:device:DimmableRGBLight:2",
		"urn:schemas-micasaverde-com:device:PhilipsHueLuxLamp:1",
		"urn:schemas-micasaverde-com:device:PhilipsHueLamp:1",
		"urn:schemas-upnp-org:device:VSwitch:1",
		"urn:schemas-futzle-com:device:holidayvirtualswitch:1"
	]},
	'sensor': {label:"Sensor", glyph:"fa-thermometer-three-quarters", types:[
		"urn:schemas-micasaverde-com:device:SmokeSensor:1",
		"urn:schemas-micasaverde-com:device:DoorSensor:1",
		"urn:schemas-micasaverde-com:device:LightSensor:1",
		"urn:schemas-micasaverde-com:device:VOTS:1",
		"urn:schemas-micasaverde-com:device:TemperatureSensor:1",
		"urn:schemas-micasaverde-com:device:MotionSensor:1",
		"urn:schemas-micasaverde-com:device:HumiditySensor:1",
		"urn:schemas-micasaverde-com:device:FloodSensor:1",
		"urn:schemas-micasaverde-com:device:TempLeakSensor:1",
		"urn:schemas-micasaverde-com:device:GenericSensor:1",
		"urn:schemas-futzle-com:device:WeMoSensor:1",
		"urn:schemas-micasaverde-com:device:VOTS:1"
	]},
	'covers': {label:"Covers", glyph:"fa-align-justify", types:[
		"urn:schemas-micasaverde-com:device:WindowCovering:1"
	]},
}
var simul = null;	// global D3 forceSimulations


var deleteGlyph = glyphTemplate.format("trash-o",_T("Delete"),"text-danger")
var copyGlyph = glyphTemplate.format("clone",_T("Clone"))
var hiddenGlyph = glyphTemplate.format("eye-slash",_T("Hidden"))
var invisibleGlyph = glyphTemplate.format("ban",_T("Invisible"))
var timeGlyph= glyphTemplate.format("clock-o",_T("Time"))
var okGlyph=glyphTemplate.format("check",_T("OK"))
var plusGlyph=glyphTemplate.format("plus",_T("Create"))
var saveGlyph=glyphTemplate.format("floppy-o",_T("Save"))
var labelGlyph=glyphTemplate.format("font",_T("Text"))
var wrenchGlyph="";
var optHorGlyph="";
var refreshGlyph="";
var removeGlyph="";
var calendarGlyph="";
var signalGlyph="";
var searchGlyph = "";
var questionGlyph = "";
var staremtpyGlyph = "";
var starGlyph = "";
var loadGlyph = "";
var infoGlyph = "";
var picGlyph = "";
var upGlyph = "";
var downGlyph = "";
var uncheckedGlyph ="";
var runGlyph = "";
var editGlyph = "";
var eyeOpenGlyph = "";
var cameraGlyph = "";
var onoffGlyph = "";
var scaleGlyph = "";
var helpGlyph = "";
var homeGlyph = "";
var tagsGlyph = "";
var glyphList = []

//https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/less/variables.less
// new 4.7.0 location "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/a8386aae19e200ddb0f6845b5feeee5eb7013687/less/variables.less"
// new 5.0 location "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/web-fonts-with-css/less/_variables.less"
var tmp = ""
// $.ajax({
	// crossDomain :true,
	// url:"https://github.com/FortAwesome/Font-Awesome/blob/master/web-fonts-with-css/less/_variables.less",	// prod
	// dataType: "jsonp",
// }).done( function (data, textStatus, jqXHR) {
	// glyphList = $.map( data.split('\n').filter( function(line) {return line.substr(0,7)=="@fa-var"} ), function(line,idx) { return line.split(':')[0].substr(8) } )
// })

$.get("https://raw.githubusercontent.com/FortAwesome/Font-Awesome/a8386aae19e200ddb0f6845b5feeee5eb7013687/less/variables.less",function(data) {
	glyphList = $.map( data.split('\n').filter( function(line) {return line.substr(0,7)=="@fa-var"} ), function(line,idx) { return line.split(':')[0].substr(8) } )
})

var xsbuttonTemplate = "<button id='{0}' type='button' class='{1} btn btn-light btn-sm' aria-label='tbd' title='{3}' {4}>{2}</button>";
var smallbuttonTemplate = "<button id='{0}' type='button' class='{1} btn btn-light btn-sm' aria-label='tbd' title='{3}' {4}>{2}</button>";
var buttonTemplate		= "<button id='{0}' type='button' class='{1} btn btn-{3}' aria-label='tbd' title='{4}'>{2}</button>";
var buttonDebugHtml = "<button type='button' class='btn btn-light' id='altui-debug-btn' >Debug<span class='caret'></span></button>";
var cameraURI="data:image/png;base64,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";
var defaultIconSrc="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAASJSURBVHja7Jp7aI5RHMff123CMOYyMmFY5LZYI5umFmHhD2pyyYzYkju5hCWX0jZKM9rEkCy5tJostxWRIteZe5FLyW2Y68z35Pfq9Os8z573eT3vu9fOr76d5zzn8jyf59x+57yvu6amxlWfrIGrnpkG1sAaWANrYA2sgTWwBnbKGnmT2e12/7MHb8vOaYhgEJQA9YN6Qj2g5lCoSFu4eNF1K3V5sx9o5M+vC0jxvCRoKjQOalmnW9gH0BYI5kKLoE5B06Vttug8KBMKqyX7S+g+9Ab6SGHwAAN2MIICqL9BlifQMegcdAHj9X1QtjBAxcy2BNoENWbJ1VARtAO6BMiaoO7SgG2C4AA0SZF8CFoDyMf/xRgGbCsExVA8S3oEzQJomUG5AQgSoSFQNNSZlqZ4q8uS34Hx0s0MYA+KSQsv/pHlD0eQQctTVFC1MDkQRQrYtQDdoOgFa6F0qGmwdun10Fh2Lx2wOxnseAS7ofZGDhP0DHoAVUJvnQB2e+OWcdcSEKMRnGTZlgN2K+sBWdACRZXfoBPQYeg8ytmC9IrBLjB5T+VQFynLXrz0TDZrC5gJrKrv0HYoG/lf+dpq/vKlMxnsbRqbcsuqYC9B0wH6MGi2h4CJRDCfjT+x9HyR7mUpYIXDkRAoWF9aeBXzovIAcUX6IBMVYzYTedZb+JghCCIo+gFl3gV00sILtcalGHchdPsr1B0v9lJaeiqgjlLRXKRnmED2QpAGjYH6iEdJyeJZp6FCEarcUW8Y7HTpKRKssD0eWLLVDPYqbQtVoGFQAX2gZVBfBuuiuoSDUgpdRv4Yf4/haSxewDyodLZZSMUH+a6AFXDCdUxVQBpZrJj0UHamX4DxoDb0UI/dAsw1KZ5KfrDH9iP9pqKe3mLdhSJtvLNY6vbYhfa2hRNZmRKWPoPFtxhMSkehcJb0ArpRi2THJA91DXR6lo5j8dMSSFeacDx2Ea17T1HHQpbPRSccscj/3KR3tUVwl7V0LjTMyRaOZnG5O49gacUGrbtUUe8KM1iyHKgduzcUdSY62cK9pOvXzPftx/JeUJRPUnRl8dEO03L3t8VRd7X0oUYpJkuPpdAxkSPAHaTrpyytG4uXK8onKO7FsAM74YWJQ4EqyWffZfJO8U526VA27mRrK13/NPCQult4xmyUrZLiG6GuJvmjnOzS8oa+QnG6USZ5XyprVkv9wiM7L3XlOOaz+8zgVWYzXxhp+Raq+GSSJjb/K9kEl2/BKfkRkEM8i3bfJC0NH61SioufYdawPJsVK0V5XQY+S742t32ALWU95jWC4+yIKFpRtszx/bAPVqaY3V+RM2Lm0rYkJ0NlhX4707J5eDCHLTPF1PJmNhJKVtwvQU8YW2d/LiXLJydiOMWTDWBqs0oLM3jAu7QYm78QTHb9+UXCromZOcXOzzYB+csDHRiMoMMBb004NMmoo8RfBwD/Cvo57XTWQZ8tFjsi3E6UPeW3My0njDYOU+hMS/jWEZL7egc6Q4cJqu2mcwfx/4Pp/2lpYA2sgTWwBtbAGlgDO2W/BRgADRV6RjlErQoAAAAASUVORK5CYII="
var _timerTypes = [];
var _timerDOW = [];
var _timerRelative = [];
var _timerUnits = [
	{value:'d',text:'days'},
	{value:'h',text:'hours'},
	{value:'m',text:'minutes'},
	{value:'s',text:'seconds'}
];

var styles =`
	html {
		position: relative;
		min-height: 100%;
	}
	body {
	  /* Margin bottom by footer height */
	  /* margin-bottom: 140px;	*/
	}
	.btn-xs {
		font-size: .700rem;
	}
	.navbar {
		position: sticky;
		top: 0px;
		z-index: 999;
		padding-bottom:1px;
		padding-top:1px;
	}
	.navbar-brand {
		margin-right:0px;
	}
	.nav-link {
		white-space: nowrap;
	}
	@media (max-width: 991.98px) {
	  .offcanvas-collapse {
		position: fixed;
		top: 56px; /* Height of navbar */
		bottom: 0;
		left: 100%;
		width: 100%;
		padding-right: 1rem;
		padding-left: 1rem;
		overflow-y: auto;
		visibility: hidden;
		transition-timing-function: ease-in-out;
		transition-duration: .3s;
		transition-property: left, visibility;
	  }
	  .offcanvas-collapse.open {
		left: 0;
		visibility: visible;
	  }
	}
	.blur {
		opacity:0.3;
	}
	.altui-clock {
		font-size: 12px;
	}
	.multiselect-container>li>a>label {
		padding: 3px 3px 3px 3px !important;
	}
	.multiselect-container.dropdown-menu{
		white-space: nowrap;
	}
	.dropdown-toggle::after {
		margin-left:0px;
	}
	footer {
		position: absolute;
		bottom: 0px;
		left : 0px;
		right: 0px;
	}
	#wrap {
	}
	#filler {
		height: 140px;
	}
	@-webkit-keyframes blinker {
	  50% { opacity: 0.0; }
	}
	@keyframes blinker {
	  50% { opacity: 0.0; }
	}
	@-webkit-keyframes horiz_rotate {
		0% {
			-webkit-transform: translateX(10px) rotateX(0deg);
			transform: translateX(10px) rotateX(0deg);
		}
		50% {
			-webkit-transform: translateX(10px) rotateX(180deg);
			transform: translateX(10px) rotateX(180deg);
		}
		100% {
			-webkit-transform: translateX(10px) rotateX(0deg);
			transform: translateX(10px) rotateX(0deg);
		}
	}
	@keyframes horiz_rotate	{
		0% {
			-webkit-transform: translateX(10px) rotateX(0deg);
			transform: translateX(10px) rotateX(0deg);
		}
		50% {
			-webkit-transform: translateX(10px) rotateX(180deg);
			transform: translateX(10px) rotateX(180deg);
		}
		100% {
			-webkit-transform: translateX(10px) rotateX(0deg);
			transform: translateX(10px) rotateX(0deg);
		}
	}
	@-webkit-keyframes spin {
		0% {
			-webkit-transform: rotate(0deg);
			transform: rotate(0deg);
		}
		100% {
			-webkit-transform: rotate(359deg);
			transform: rotate(359deg);
		}
	}
	@keyframes spin {
		0% {
			-webkit-transform: rotate(0deg);
			transform: rotate(0deg);
		}
		100% {
			-webkit-transform: rotate(359deg);
			transform: rotate(359deg);
		}
	}
	#altui-license {
	}
	#altui-license.license-rotated {
		-webkit-animation: horiz_rotate 3s ease-in-out 0s 5 normal;
		animation: horiz_rotate 3s ease-in-out 0s 5 normal;
	}
	.big-glyph	{
		font-size: 22px;
		margin: 5px;
	}
	.glyphicon-spin {
		-webkit-animation: spin 1000ms infinite linear;
		animation: spin 1000ms infinite linear;
	}
	.onoffswitch {
		position: relative; width: 55px;
		-webkit-user-select:none; -moz-user-select:none; -ms-user-select: none;
	}
	.onoffswitch-checkbox {
		display: none;
	}
	.onoffswitch-label {
		display: block; overflow: hidden; cursor: pointer;
		border: 2px solid #ADAAAA; border-radius: 20px;
		margin-top: 3px;
	}
	.onoffswitch-inner {
		display: block; width: 200%; margin-left: -100%;
		height: 20px;
		transition: margin 0.3s ease-in 0s;
	}
	.onoffswitch-inner:before, .onoffswitch-inner:after {
		display: block; float: left; width: 50%; padding: 0; line-height: 20px;
		font-size: 14px; color: white; font-family: Trebuchet, Arial, sans-serif; font-weight: bold;
		box-sizing: border-box;
	}
	.onoffswitch-inner:before {
		content: '\\00a0';
		padding-left: 9px;
		background-color: #34A7C1; color: #FFFFFF;
	}
	.onoffswitch-inner:after {
		content: '\\00a0';
		padding-right: 9px;
		background-color: #D4D4D4; color: #999999;
		text-align: right;
	}
	.onoffswitch-switch {
		display: block; width: 28px; margin: 0px; margin-top: -1px; margin-bottom: -1px;
		background: #FFFFFF;
		position: absolute; top: 0; bottom: 0;
		right: 27px;
		border: 2px solid #ADAAAA; border-radius: 20px;
		transition: all 0.3s ease-in 0s;
	}
	.onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-inner {
		margin-left: 0;
	}
	.onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-switch {
		right: 0px;
	}
	.on-off-device .glyphicon-spin {
		top: 9px;
		left: 24px;
	}
	.blocklyTreeLabel {
		color: black;
	}
	@media (min-width: 10px) {
		.card-columns {
			column-count: 1;
		}
	}
	@media (min-width: 736px) {
		.card-columns, .altui-zwavecfg-card.card-columns {
			column-count: 2;
		}
	}
	@media (min-width: 1230px) {
		.card-columns {
			column-count: 3;
		}
	}
	@media (min-width: 1480px) {
		.card-columns {
			column-count: 4;
		}
		.altui-zwavecfg-card.card-columns{
			column-count: 3;
		}
	}
	@media (min-width: 1840px) {
		.card-columns {
			column-count: 5;
		}
	}
	.altui-myhome-title{
		cursor: pointer;
	}
	.altui-myhome-roomimg {
		height:200px;
		width:100%;
		background-size: 100% 100%;
		background-repeat: no-repeat;
	}
	.altui-myhome-card	 {
		padding: 1px 1px 1px 1px;
	}
	.altui-myhome-card .card-body {
		padding: 1px 1px 1px 1px;
	}
	.altui-back-top:hover {
		color:blue;
		cursor:pointer;
	}
	.altui-myhome-devices tr td:first-of-type, .altui-myhome-scenes tr td:first-of-type {
		white-space: nowrap;
	}
	.altui-myhome-devices tr td:nth-child(2), .altui-myhome-scenes tr td:nth-child(2) {
		font-size:0.9rem;
	}
	.altui-theme-label {
		font-size: 12px;
	}
	.altui-theme-thumbnail{
		padding-bottom: 5px;
		padding-top: 5px;
	}
	.altui-theme-thumbnail:hover {
		cursor: pointer;
		border-width:2px;
		border-color: green;
	}
	#altui-background {
		position:absolute;
		top:0;
		left:0;
		width:100%;
		height:100%;
		z-index: -1;
	}
	.altui-store-carousel { margin-bottom:10px; }
	.altui-store-categories { width: 100%; overflow: hidden; }
	.altui-features-box { height:200px; width: 100%; background:grey; opacity:0.4; }
	.altui-store-install-btn , .altui-store-mcvinstall-btn {  margin-left:1px; margin-right:1px; }
	button.altui-plugin-category-btn {	padding-left:4px; padding-right:4px; }
	.altui-plugin-publish-btn { width: 100%;  }
	.altui-pluginbox , .altui-pageswitchbox, #altui-plugin-name-filter { padding:4px; }
	.altui-pluginbox .card-body { padding-left:5px; padding-right:5px; padding-top:5px; padding-bottom:5px;}
	.form-control.altui-version-selector { padding:0px; border:0px; background:darkgrey; }
	.altui-plugin-title { height: 21px;	 overflow:hidden; }
	.altui-plugin-version { font-size:1em;	}
	.altui-plugin-version .form-control-sm { height: 20px;	 line-height: 20px; }
	.altui-plugin-help { font-size:18px; }
	.altui-plugin-help:hover { cursor:pointer; }
	a.altui-goto-scene, a.altui-goto-device, a.altui-goto-workflow { color:black; cursor:pointer; }
	.altui-sortable-placeholder { border: 2px solid blue; background-color: blue;  opacity: 0.5; }
	.altui-ace-editor .ui-resizable-helper { border: 2px dotted #00F; }
	.altui-ace-editor .ui-resizable-handle { background-color: white; }
	#altui-editor-text .ui-resizable-helper { border: 2px dotted #00F; }
	#altui-editor-text .ui-resizable-handle { background-color: white; }
	#altui-editor-text-LuaExpression .ui-resizable-helper { border: 2px dotted #00F; }
	#altui-editor-text-LuaExpression .ui-resizable-handle { background-color: white; }
	.altui-editor-area { width:100%; height:100% }
	div.altui-timeline-item-tripped { background-color:#f2dede; }
	div.altui-timeline-item-untripped { background-color:#dff0d8; }
	.altui-variable-title {
	}
	.altui-variable-buttons {
	}
	.altui-variable-value {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.altui-variable-value-history td:first-child {
		width:170px;
	}
	button.altui-variable-history,button.altui-variable-push,button.altui-variable-delete {
		padding-top:	1px;
		padding-bottom: 1px;
	}
	.altui-dialog-icon {
		font-size: 37px;
		padding-left: 5px;
		padding-right: 5px;
		margin-top: -17px;
	}
	.altui-widget-frame-div , .solid-border {
		border:1px solid;
	}
	.altui-widget-iframe {
		width:100%;
		height:100%;
		margin: 0;
		padding-top: 10px;
		padding-left: 0px;
		padding-right: 10px;
		padding-bottom: 10px;
		border: 0;
	}
	.altui-colorpicker-replacer {
	}
	.sp-dd {
	}
	.fill {
		min-height:100%;
		max-height:100%;
		height:100%;
	}
	#altui-toggle-messages {
	}
	div#altui-pagemessage-panel {
		max-height:100px;
		height:100px;
		overflow-y: auto;
	}
	div#altui-pagemessage-panel.collapsing {
		-webkit-transition: none;
		transition: none;
		display: none;
	}
	div#altui-pagemessage-panel td {
		color:black;
	}
	.altui-leftnav .altui-edittoolbox {
		border:1px solid;
		margin-top: -1px;
		padding-top: 4px;
		padding-bottom: 4px;
		padding-left: 4px;
		padding-right: 4px;
		font-size: 16px;
	}
	.altui-leftnav div.altui-widget {
		border:1px solid;
		margin-top: -1px;
		padding-top: 4px;
		padding-bottom: 4px;
	}
	.altui-leftnav div.altui-edittools {
		margin-top: -1px;
		display: inline;
		padding: 4px;
	}
	.altui-custompage-canvas div.altui-widget:hover {
		cursor: move;
	}
	.altui-custompage-canvas *[disabled] {
		cursor: move;
	}
	.altui-custompage-canvas div.altui-widget.ui-selecting {
		outline-style: solid;
		outline-color: red;
		outline-width: 2px;
	}
	.altui-custompage-canvas div.altui-widget.ui-selected {
		outline-style: solid;
		outline-color: green;
		outline-width: 2px;
	}
	div.altui-gauge-div table {
	  background-color: transparent;
	}
	.altui-widget-delete {
		margin-top: -1px;
		font-size:16px;
		border:1px solid;
		padding-top: 4px;
		padding-bottom: 4px;
		text-align: center;
	}
	.altui-debug {
		border:1px solid;
		height:100px;
	}
	.altui-custompage-canvas {
		position: relative;
	}
	.altui-tabcontent-fix	{
	  padding-top: 15px;
	  padding-left: 15px;
	  padding-bottom: 15px;
	  padding-right: 15px;
	}
	.altui-DisplayLine1,.altui-DisplayLine2 {
		font-size:14px;
	}
	.altui-device-keyvariables {
	}
	.altui-device-controlpanel .card-body {
		padding-top: 0px;
		padding-bottom: 0px;
	}
	.altui-devtab-content {
		font-size:12px;
		font-family:Arial;
	}
	body.withBackground .altui-device , body.withBackground .altui-scene , body.withBackground .altui-workflow , body.withBackground .altui-pluginbox-panel , body.withBackground footer p {
		background-color: rgba(255,255,255,0.5)
	}
	.altui-device-container, .altui-scene-container, .altui-workflow-container {
		padding-left: 3px;
		padding-right: 3px;
	}
	.altui-device-message {
		font-size: .8em;
		padding: 0px;
	}
	.altui-device-title , .altui-workflow-heading {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		height: 28px;
	}
	.altui-scene-eyemonitor {
		font-size:19px;
		display: none;
	}
	.altui-scene-title {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.altui-device-title-input , .altui-workflow-title-input{
		width: 70%;
		height: 20px;
	}
	.altui-scene-title-input {
		width: 60%;
		height: 20px;
	}
	.altui-mainpanel , .altui-device-toolbar{
		margin-top: 2px;
		margin-bottom: 2px;
	}
	.altui-device-toolbar .btn-group{
		margin-left: 2px;
		margin-right: 2px;
	}
	div.altui-scene, div.altui-device, div.altui-workflow {
		margin-bottom:6px;
	}
	div.altui-device-heading, div.altui-scene-heading, div.altui-workflow-heading {
		height:32px;
		padding-top: 0px;
		padding-right: 0px;
		padding-bottom: 0px;
		padding-left: 2px;
	}
	div.altui-device-body {
		padding-top: 0px;
		padding-right: 0px;
		padding-bottom: 0px;
		padding-left: 0px;
	}
	div.altui-scene-body {
		padding-top: 3px;
		padding-right: 5px;
		padding-bottom: 3px;
		padding-left: 5px;
	}
	div.altui-workflow-body {
		padding-top: 3px;
		padding-right: 5px;
		padding-bottom: 3px;
		padding-left: 5px;
	}
	#altui-device-filter-form {
		margin-top:5px;
	}
	div.altui-battery {
		margin-top:5px;
		margin-right:2px;
		margin-bottom:0px;
		overflow: visible;
		word-wrap: normal;
	}
	div.altui-battery .progress-bar {
		color: black;
		border-radius: .25rem;
	}
	.caret.caret-reversed {
		border-top-width: 0;
		border-bottom: 4px solid ;
	}
	.form-inline > * {
		margin:5px 3px;
	}
	div.altui-scene-body button, div.altui-workflow-body button {
		margin-left:1px;
		margin-right:1px;
		margin-top:1px;
		margin-bottom:1px;
	}
	.altui-scene-history {
		clear: left;
	}
	.altui-editscene {
		clear: left;
	}
	.altui-runscene {
	}
	.altui-hint {
		padding-left:10px;
		padding-right:10px;
	}
	.altui-scene-date{
		clear: right;
		text-align: right;
	}
	.altui-scene-btnarea{
		margin-top:5px;
	}
	.altui-pausescene {
		padding-right: 3px;
		cursor: pointer;
	}
	.altui-pauseworkflow {
		padding-right: 3px;
		cursor: pointer;
	}
	img.altui-plugin-icon {
		font-size: 1.5em;
		height: 35px;
	}
	div#altui-editor-text, div#altui-luascene {
		height:300px;
	}
	div.altui-ace-editor, div#altui-editor-sample {
		height:100px;
	}
	.altui-dialog-ace	{ height:4em; }
	.altui-myhome-favorite { font-size:1.3em; }
	div.altui-favorites-container	{

	}
	div.altui-favorites-housemode, div.altui-favorites-device, div.altui-favorites-scene {
		position:relative;			/* so child are positioned relatve to it */
		overflow:hidden;
		border: 1px solid black;
	}
	div.altui-favorites-weather {
		position:relative;			/* so child are positioned relatve to it */
		margin:0%;
		overflow:hidden;
		border: 1px solid black;
	}
	div.altui-favorites-device-container {
		text-align:center;
		height:100%; /* = 100% - 2*0% padding */
		width:100%; /* = 100% - 2*0% padding */
	}
	.altui-favorites-title {
	}
	.altui-favorites-smalltext {
		font-size:0.3em;
	}
	div.altui-favorites-table {
		position:absolute;
		top: 0px;
		display:table;
		width:100%;
		height:100%;
	}
	div.altui-favorites-table-cell {
		display:table-cell;
		vertical-align:middle;
	}
	.altui-sonos-tile-img {
		width:100%;
	}
	div.altui-favorites-housemode:hover, div.altui-favorites-weather:hover, div.altui-favorites-device:hover, div.altui-favorites-scene:hover {
		cursor: pointer;
		border-color: green;
	}
	.altui-favorites-lasttrip-text {
	}
	.altui-favorites-info {
		font-size:14px;
	}
	.altui-favorites-watts {
	}
	.altui-favorites-kwh  {
	}
	.altui-favorites-netmontxt {
	}
	.btn.altui-housemode{
		padding-left: 0px;
		padding-right: 0px;
	}
	.altui-housemode3 {
		width: 50%;
	}
	.altui-housemode2 {
		width: 50%;
		padding-bottom: 50%;
		position:relative;			/* so child are positioned relatve to it */
		margin:0%;
		overflow:hidden;
	}
	.altui-housemode2:after	 {
		content: '';
		position: absolute;
		top: 0;
		left: 50%;			/* centers the left edge of the sprite */
		margin-left: -35px; /* this centers the actual sprite--this is half the sprite-window width. if you don't do this, the left edge will be centered instead of the center of the sprite.	*/
		width: 70px;		/* set window to see sprite through */
		height: 70px;		/* set window to see sprite through */
		background-image: url('data:image/png;base64,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');
		background-repeat: no-repeat ;
	}
	.altui-housemode2-content {
		position:absolute;
		width: 100%;
		height: 100%;
		padding: 0%
	}
	.preset_home.housemode2_unselected:after {
		background-position: -18px 0px;
	}
	.preset_away.housemode2_unselected:after {
		background-position: -217px 2px;
	}
	.preset_vacation.housemode2_unselected:after {
		background-position: -315px 5px;
	}
	.preset_night.housemode2_unselected:after {
		background-position: -115px 5px;
	}
	.preset_home.housemode2_selected:after {
		background-position: -16px -113px
	}
	.preset_away.housemode2_selected:after {
		background-position: -215px -115px;
	}
	.preset_vacation.housemode2_selected:after {
		background-position: -315px -109px;
	}
	.preset_night.housemode2_selected:after {
		background-position: -115px -112px;
	}
	.altui-housemode-countdown {
		font-size: 40px;
		z-index: 99;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}
	.altui-housemodeglyph {
		font-size: 25px;
	}
	.housemode {
		text-align: center;
		cursor: pointer;
		width:80px;
		height: 60px;
		font-size: 40px;
		background: url('data:image/png;base64,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') no-repeat;
	}
	.preset_home.preset_unselected {
		background-position: -17px -5px;
	}
	.preset_home.preset_selected {
		background-position: -17px -120px;
	}
	.preset_away.preset_unselected {
		background-position: -213px -5px;
	}
	.preset_away.preset_selected {
		background-position: -213px -120px;
	}
	.preset_night.preset_unselected {
		background-position: -115px -5px;
	}
	.preset_night.preset_selected {
		background-position: -115px -120px;
	}
	.preset_vacation.preset_unselected {
		background-position: -315px -5px;
	}
	.preset_vacation.preset_selected {
		background-position: -315px -120px;
	}
	.preset_home {
	  margin: auto;
	}
	.preset_away {
	  margin: auto;
	}
	.preset_night {
	  margin: auto;
	}
	.preset_vacation {
	  margin: auto;
	}
	.imgLogo {
		display: none;
		max-width: 150px;
		margin-left: auto;
		margin-right: auto;
		height: 50px;
		width: 50px;
		background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAACHDwAAjA8AAP1SAACBQAAAfXkAAOmLAAA85QAAGcxzPIV3AAAACXBIWXMAAA7BAAAOwQG4kWvtAAAAB3RJTUUH3AEJETEi55mf3wAAABh0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC45bDN+TgAAAWFJREFUaEPtmT1uwkAQRt0HKWXKSKRKQVoaCjpIDwdImY4zpEtDlRukyEGoOARnWfazNNZ4veuNZWF9i2akJ+/v7DxjywWVhcVU8eNcEWQjtomRbMQ2MZINvfjXcyYBtejasqEXI4EjAbXo2rKhF5vIDTARUPrLPjs69/rFCWr7twg27A6coDYTYcJE2DARNkyEjdEiD48vbvtx6Yw/PW9qwjGfKcn87bNeh5zS1mAMc9LXZ4wSWe9PdQGL1XdrHMRENLIX13BuchEk9jOt5EJRIn40WVAxIsv3vyYJruHB+pAYNCJIABm0cfUrmjmZpxeRIiQhQF/EQBEiSOhHOujCixDxvdbdB1KYfFPGiKT2huO6P1gk9j4IuFvyTQkPDekTkTP09wltjKUe38EiqZ8dyGFo4wC0Q+TR6BPR85pw7SgRnYgJE2HDRNgwETZMhA0TYWOQyN38P1IEFhYWA6KqrtanevVJxLYxAAAAAElFTkSuQmCC') no-repeat;
	}
	.altui-leftnav {
		width: 100%;
	}
	.altui-breadcrumb {
		margin-right: 10px;
		padding-top: 6px;
		padding-bottom: 6px;
	}
	.altui-controlpanel-button	{
		padding: 0px;
		font-size: 13px;
		cursor: pointer;
		text-align: center;
	}
	.altui-button-onoff		{
		margin-top: 2px;
	}
	.altui-button-stateLabel {
	  color: #918f8f;
	  text-align: center;
	  text-transform: uppercase;
	  font-size: 11px;
	}
	.altui-favorite	 {
		padding-right: 3px;
		cursor: pointer;
	}
	.paused {
	  color: red
	}
	.activated {
	  color: green
	}
	#altui-grid, .altui-grid {
		font-size: 14px;
	}
	#altui-grid th , .altui-grid th {
		font-size: 12px;
		text-transform: capitalize;
	}
	input.altui-plugin-version {
		display: inline;
		width: 64px;
		padding-left: 3px;
		padding-right: 3px;
	}
	img.altui-favorite-icon {
		width:60%;
		height:60%;
	}
	.altui-device-icon, .altui-myhomedevice-icon {
		cursor: pointer;
		margin-left: 1px;
		margin-right: 0px;
		margin-top: 2px;
		margin-bottom: 2px;
		height: 50px;
		width: 50px;
	}
	.altui-myhomedevice-icon {
		height: 30px;
		width: 30px;
	}
	.altui-oscommand-configtbl th {
		text-transform: capitalize;
	}
	.altui-room-name  {
		cursor: pointer;
	}
	#altui-workflow-canvas {
		background: lightgrey;
		overflow: auto;
	}
	.altui-help-button	{
		margin-left: 5px;
	}
	.altui-quality-color  {
		height: 15px;
		width: 30px;
		background: linear-gradient(to right, red , green);
	}
	.altui-quality-grey {
		height: 15px;
		width: 30px;
		background: grey;
	}
	.table .table {
	background-color:transparent;
	}
	/* JOINTJS port styling */
	.available-magnet {
		fill: yellow;
	}

	/* element styling */
	.available-cell rect {
		stroke-dasharray: 5, 2;
	}
	.altui-timers , .altui-timer-instance {
	}
	.altui-active-state-name {
		padding-left: 90px;
		font-size: 0.9rem;
	}
	.altui-state-name {
		font-size: 20px;
	}
	.altui-action-kind {
		font-size: 16px;
	}
	.altui-action-details {
		font-size: 12px;
	}
	.altui-transition-name {
		font-size: 15px;
	}
	table.altui-workflow-schedule > tbody > tr > td {
		border-top: 0px;
	}
	.altui-workflow-transitiondetails {
		font-size: 12px;
	}
	.altui-transition-subtitle {
		font-size: 14px;
		font-weight: bold;
	}
	.altui-slider-widgetui {
		border-style: solid;
		border-width: 1px;
		border-color: green;
	}
	.altui-slider-widgetui .ui-slider .ui-slider-handle {
	}
	.altui-record-indicator {
		color: red;
		float: left;
		font-size: 32px;
		animation: blinker 2s linear infinite;
	}
	.altui-plugin-reviews {
		cursor: pointer;
	}
	.altui-graph-content {
		margin-left: -15px;
		margin-right: -15px;
		overflow: hidden;
	}
	.altui-graph-card {
		background: lightcyan;
		padding:0px;
	}
	.altui-graph-card .card-title {
		cursor:move;
	}
	.iframe-wrapper {
		-webkit-overflow-scrolling: touch;
	}
	.iframe-wrapper iframe {
	}
	#altui-WeatherWidgetCode {
		font-family:Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New, monospace;
		font-size: .8em;
	}
	.altui-tags {
	}
	.altui-device-tag {
		cursor: pointer;
	}
	.bd-highlight {
		background-color: rgba(86,61,124,.15);
		border: 1px solid rgba(86,61,124,.15);
	}
	.altui-experimental div.card {
		font-size:8px;
		transition: font-size .3s linear 0s, background-color 3s linear 0s;
	}
	.altui-experimental div.card.disabled {
		opacity:0.3;
		background-color:"lightred";
	}
	.altui-experimental div.card.zoomed {
		font-size:20px;
		width:auto;
		border-width: 1px;
		border-color: black;
	}
	.altui-experimental div.card:hover {
	}
	.altui-experimental div.card .card-body {
		margin:0px;
		padding:0px;
	}
	.altui-experimental div.card .card-header {
		cursor: zoom-in;
		text-align: center;
		margin:0px;
		padding:0px;
	}
	.altui-experimental div.card.zoomed .card-header {
		cursor: zoom-out;
	}
	.altui-experimental div.card .card-header .altui-experimental-extrainfo {
		display:none;
	}
	.altui-experimental div.card.zoomed .card-header .altui-experimental-extrainfo {
		display:inline;
	}
	.altui-experimental-device-content {
		width:100%;
	}
	.altui-experimental-device-content .altui-device-icon {
		width:50px;
		height:50px;
	}
	.altui-experimental-device-content-box {
		text-align: center;
	}
	.altui-experimental-device-content-box .altui-device-icon.altui-svg-marker {
	}
	.altui-experimental-device-content-box .fa-bolt {
		display: none;
	}
	.altui-experimental-device-content-box .altui-iphone-txt {
		font-size:10px;
	}
	.altui-experimental-mediumtext,.altui-experimental-smalltext {
		font-size:7px;
	}
	.altui-experimental-netmontxts, .altui-experimental-watts {
	}
	.altui-experimental-info {
		font-size: 13px;
	}
	.altui-experimental-info.altui-experimental-lasttrip-text {
		display: none;
	}
	.altui-experimental-scene-content {
		width: 50px;
		height: 50px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 15px;
	}
	.altui-experimental-scene-content-box {
		text-align: center;
	}

`;

var UIManager  = ( function( window, undefined ) {
	// there scripts cannot be loaded by ALTUI and cannot be executed, so if a device uses them, we do not load/use it
	// meaning we lose functionality
	var _forbiddenScripts=["shared.js","interface.js"];
	var _safeScripts=["J_PLC.js","J_VeraAlerts.js"];

	// App Store URLs
	var getlist_url = 'https://script.google.com/macros/s/AKfycbwaJ9s6TyXJimpx09VBkFInO_rTjSfKXdPhZS_1FWdBL8AOmo4/exec'; // PROD
	// var getlist_url = 'https://script.google.com/macros/s/AKfycbz0YqgQ-gxY3YjrxuaLeQKDrLdTT7Ibbs6GAiv8wss/dev'; // DEV

	// in English, we will apply the _T() later, at display time
	var _userOptions = [
		{ id:'ShowMyHomeImages', type:'checkbox', label:"Show Images in MyHome page", _default:1, help:'Show Images headers in MyHome page cards' },
		{ id:'UseMasonryInMyHome', type:'checkbox', label:"Use Masonry layout in MyHome page", _default:0, help:'Use Masonry layout for cards in MyHome page' },
		{ id:'ShowVideoThumbnail', type:'checkbox', label:"Show Video Thumbnail in Local mode", _default:1, help:'In Local access mode, show camera in video stream mode' },
		{ id:'ShowClock', type:'checkbox', label:"Show Clock in Message bar", _default:1, help:'The local clock time is displayed in the message bar' },
		//{ id:'FixedLeftButtonBar', type:'checkbox', label:"Left Buttons are fixed on the page", _default:1, help:'choose whether or not the selection Buttons on the left are scrolling with the page' },
		{ id:'ShowWeather', type:'checkbox', label:"Show Weather on home page", _default:1, help:'display or not the weather widget on home page' },
		{ id:'ShowHouseMode', type:'checkbox', label:"Show House Mode on home page", _default:1, help:'display or not the House mode widget on home page' },
		{ id:'ServerSideOptions', type:'checkbox', label:"Share options on all ALTUI clients", _default:0, help:'use option choices from the vera to share the same options across several ALTUI clients' },
		{ id:'UseVeraFavorites', type:'checkbox', label:"Use Vera Favorites", _default:0, help:'use the same favorites as set on your VERA box but prevent to have different favorites per client device' },
		{ id:'SyncLastRoom', type:'checkbox', label:"Same Room for Devices/Scenes", _default:1, help:'keep the same last selected room between the device and the scene pages'},
		{ id:'StickyFooter', type:'checkbox', label:"Sticky Footer to bottom", _default:0, help:'Fixes the footer at the bottom of the page but could have performance issues on mobile browsers'},
		{ id:'UseUI7Heater', type:'checkbox', label:"Use new UI7 behavior for Heater devices", _default:0, help:'technical option to trigger the UI7 behavior for heater'},
		{ id:'ShowAllRows', type:'checkbox', label:"Show all rows in grid tables", _default:0, help:'allways show all the lines in the grid tables, or have a row count selector instead'},
		{ id:'LockFavoritePosition', type:'checkbox', label:"Lock favorites position", _default:0, help:'Prevent drag and drop of favorites to reorder them'},
		{ id:'TopStats', type:'checkbox', label:"Show OS Statistics", _default:0, help:'Show OS statistics in the footer'},
		{ id:'BirdViewItemWidth', type:'number', label:"Size of Bird view items", _default:0, help:'Size of Bird view items in pixel, 0 for flex' },
		{ id:'Menu2ColumnLimit', type:'number', label:"2-columns Menu's limit", _default:15, min:2, max:30, help:'if a menu has more entries than this number then show the menu entries in 2 columns'	},
		{ id:'TempUnitOverride', type:'select', label:"Weather Temp Unit (UI5)", _default:'c', choices:'c|f', help:'Unit for temperature'  }
	];

	var _editorOptions = [
		{ id:'EditorFontSize', type:'number', label:"Editor Font Size", _default:12, min:8, max:30, help:'Editor font size in pixels'  },
	];

	var meteoDefault = `
	<a class="weatherwidget-io" href="https://forecast7.com/fr/48d862d35/paris/" data-label_1="PARIS" data-label_2="Météo" data-theme="weather_one" >PARIS Météo</a>
	<script>
	!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src='https://weatherwidget.io/js/widget.min.js';fjs.parentNode.insertBefore(js,fjs);}}(document,'script','weatherwidget-io-js');
	</script>
	`

	var _meteoOptions = [
		{ id:'WeatherWidgetButton', type:'button', label:"Configure", url:"https://weatherwidget.io/", help:'open weatherwidget.io to configure widget'  },
		{ id:'WeatherWidgetCode', type:'multiline', rows:'5', label:_T("Weather Widget HTML Code"), _default:meteoDefault, help:'Copy Paste the Widget code here'  },
	];

	var edittools = [];
	var tools = [];

	function _initLocalizedGlobals() {
		_timerTypes = [
			{value:0,text:_T('None')},
			{value:1,text:_T('interval')},
			{value:2,text:_T('day of week')},
			{value:3,text:_T('day of month')},
			{value:4,text:_T('absolute')}
		];
		_timerDOW = [
			{value:1,text:_T('Mo')},
			{value:2,text:_T('Tu')},
			{value:3,text:_T('We')},
			{value:4,text:_T('Th')},
			{value:5,text:_T('Fr')},
			{value:6,text:_T('Sa')},
			{value:7,text:_T('Su')}
		];
		_timerRelative = [
			{value:"{0}",text:_T('At a certain time of day')},
			{value:"00:00:00R",text:_T('At sunrise')},
			{value:"-{0}R",text:_T('Before sunrise')},
			{value:"{0}R",text:_T('After sunrise')},
			{value:"00:00:00T",text:_T('At sunset')},
			{value:"-{0}T",text:_T('Before sunset')},
			{value:"{0}T",text:_T('After sunset')}
		];

		edittools = [
			{id:1000, glyph:'arrow-up' , onclick: onAlignTop},
			{id:1010, glyph:'arrows', onclick: onAlignHorizontal },
			{id:1020, glyph:'arrow-down' , onclick: onAlignBottom },
			{id:1030, glyph:'align-left' , onclick: onAlignLeft },
			{id:1040, glyph:'align-center' , onclick: onAlignVertical},
			{id:1050, glyph:'align-right' , onclick: onAlignRight},
			{id:1060, glyph:'arrows-h' , onclick: onDistribHorizontal, label:_T("Distribute Horizontally")},
			{id:1070, glyph:'arrows-v' , onclick: onDistribVertical, label:_T("Distribute Vertically")},
		];
		tools = [
			{	id:10,
				cls:'altui-widget-label',
				no_refresh:true,
				html: _toolHtml(labelGlyph,_T("Label")),
				property: _onPropertyLabel,
				widgetdisplay: function(widget,bEdit)	{ return "<p style='color:{1}; '>{0}</p>".format(widget.properties.label,widget.properties.color); },
				properties: {
					label:'Default Label',
					color:$(".altui-mainpanel").css("color")
				}
			},
			{	id:20,
				cls:'altui-widget-variable',
				html: _toolHtml(infoGlyph,_T("Variable")),
				property: _onPropertyVariable,
				onWidgetResize: _onResizeStub,
				widgetdisplay: function(widget,bEdit)	{
					var device = MultiBox.getDeviceByAltuiID(widget.properties.deviceid);
					if (device==null)
						return "";
					if ( isNullOrEmpty(widget.properties.template) )
						widget.properties.template = '{0}';
					var value='not defined';
					if (widget.properties.deviceid!=NULL_DEVICE)
						value = widget.properties.template.format( HTMLUtils.enhanceValue((MultiBox.getStatus( device, widget.properties.service, widget.properties.variable ) || '')) );
					return "<p style='color:{1};'>{0}</p>".format( value,widget.properties.color );
				},
				properties: {
					deviceid:NULL_DEVICE,
					service:'',
					variable:'',
					template:'{0}',
					color:$(".altui-mainpanel").css("color")
				}
			},
			{	id:30,
				cls:'altui-widget-image',
				no_refresh:true,
				html: _toolHtml(picGlyph,_T("Image")),
				property: _onPropertyImage,
				onWidgetResize: _onResizeStub,
				aspectRatio: true,
				widgetdisplay: function(widget,bEdit)	{
					return "<img src='{0}' style='max-height:100%; max-width:100%; height:100%; width:100%; '></img>".format( widget.properties.url);
				},
				properties: {
					url:'data:image/png;base64,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'
				}
			},
			{	id:35,
				cls:'altui-widget-frame',
				no_refresh:true,
				aspectRatio: false,
				html: _toolHtml(uncheckedGlyph,_T("Frame")),
				property: _onPropertyFrame,
				onWidgetResize: _onResizeStub,
				widgetdisplay: function(widget,bEdit)	{
					var content = (widget.properties.url=='') ? widget.properties.label : "<iframe class='altui-widget-iframe' src='{0}'></iframe>".format(widget.properties.url);
					return "<div class='altui-widget-frame-div' style='max-height:100%; max-width:100%; height:100%; width:100%; background:{1}; '>{0}</div>".format( content,widget.properties.css );
				},
				defaultSize: { width:50, height:50 },
				zindex: -1,
				properties: {
					label:'',
					css:'',
					url:'',
				}
			},
			{	id:40,
				cls:'altui-widget-icon',
				html: _toolHtml(picGlyph,_T("Device Icon")),
				property: _onPropertyIcon,
				widgetdisplay: function(widget,bEdit)	{
					var device = MultiBox.getDeviceByAltuiID(widget.properties.deviceid);
					if (device==null)
						return "";
					var onclickstr = "";
					if (bEdit!=true) {
						if (widget.properties.sceneid != NULL_SCENE) {
							onclickstr = 'MultiBox.runSceneByAltuiID("{0}")'.format(widget.properties.sceneid);
						}
						else if (widget.properties.action && widget.properties.service) {
							onclickstr = 'MultiBox.runActionByAltuiID("{0}", "{1}", "{2}", {3} )'.format(
								device ? device.altuiid : NULL_DEVICE,
								widget.properties.service,
								widget.properties.action,
								JSON.stringify(widget.properties.params));
						}
					}
					return (widget.properties.deviceid==NULL_DEVICE)
						? ("<p>"+picGlyph+"</p>")
						: _deviceIconHtml( device ,0 , (bEdit==true) ? '' : onclickstr);
				},
				properties: {
					deviceid:NULL_DEVICE,
					sceneid:NULL_SCENE,	// optional scene  to run when clicked
					service:'',			// optional UPNP action to run when clicked
					action:'',
					params:{},
				}
			},
			{	id:50,
				cls:'altui-widget-runscene',
				no_refresh:true,
				html: _toolHtml(glyphTemplate.format( "play", _T("Run Scene") , ""),_T("Scene")),
				property: _onPropertyRunscene,
				onWidgetResize: _onResizeStub,
				widgetdisplay: function(widget,bEdit)	{
					var scene = MultiBox.getSceneByAltuiID(widget.properties.sceneid);
					return "<button type='button' class='{1} btn btn-light' aria-label='Run Scene' onclick='{3}' style='{5}'>{4} {2}</button>".format(
							scene ? scene.altuiid : NULL_DEVICE,
							'altui-widget-runscene-button',
							(widget.properties.glyph.length>0) ? glyphTemplate.format( widget.properties.glyph, _T("Run Scene") , "") : '',
							(bEdit==true)?'':'MultiBox.runSceneByAltuiID("{0}")'.format(scene ? scene.altuiid : NULL_DEVICE),
							widget.properties.label,
							"height: 100%; width: 100%;"
							);
				},
				properties: {
					sceneid:NULL_SCENE,
					label:'',
					glyph:'play'
				}
			},
			{	id:60,
				cls:'altui-widget-upnpaction',
				no_refresh:true,
				html: _toolHtml(glyphTemplate.format( "play", _T("Execute Action") , ""),_T("Action")),
				property: _onPropertyUpnpAction,
				onWidgetResize: _onResizeStub,
				widgetdisplay: function(widget,bEdit)	{
					var device = MultiBox.getDeviceByAltuiID(widget.properties.deviceid);
					if (device==null)
						return "";
					return "<button type='button' class='{1} btn btn-light' aria-label='Run Action' onclick='{3}' style='{5}' >{4}{2}</button>".format(
						device ? device.altuiid : NULL_DEVICE,
						'altui-widget-upnpaction-button',
						(widget.properties.glyph.length>0) ? glyphTemplate.format( widget.properties.glyph, _T("Execute Action") , "pull-right") : '',
						(bEdit==true)?'':'MultiBox.runActionByAltuiID("{0}", "{1}", "{2}", {3} )'.format(
							device ? device.altuiid : NULL_DEVICE,
							widget.properties.service,
							widget.properties.action,
							JSON.stringify(widget.properties.params)
						),
						widget.properties.label,
						"height: 100%; width: 100%;"
						);
				},
				properties: {	//( deviceID, service, action, params, cbfunc )
					deviceid:NULL_DEVICE,
					label:'',
					service:'',
					action:'',
					params:{},
					glyph:'play'
				}
			},
			{	id:65,
				cls:'altui-widget-2statebtn',
				html: _toolHtml(onoffGlyph,_T("Multi State")),
				property: _onPropertyOnOffButton,
				widgetdisplay: function(widget,bEdit)	{
					var status=0;
					var device = MultiBox.getDeviceByAltuiID(widget.properties.deviceid);
					if (device==null)
						return "";
					if (widget.properties.deviceid!= NULL_DEVICE)
					{
						status = _onoffStatus(device,widget);
					}
					var htmlLabels=$("<div class='altui-widget-2statebtn-labels'></div>");
					if ( (status==0) && (widget.properties.labels[0]!=undefined) )
						htmlLabels.append( $("<small class='pull-right'></small>").text(widget.properties.labels[0]));
					if ( (status==1) && (widget.properties.labels[1]!=undefined) )
						htmlLabels.append( $("<small class='pull-left'></small>").text(widget.properties.labels[1]));
					htmlLabels = htmlLabels.wrap( "<div></div>" ).parent().html();

					var html = "";
					if (widget.properties.displayicon==0) {
						html = "<button	 type='button' style='color:{4};' class='{1} btn btn-light' aria-label='Run Scene' onclick='{3}' >{2}</button>".format(
						widget.properties.deviceid,					// id
						'altui-widget-2statebtn',					// class
						onoffGlyph,									// content
						(bEdit==true)? '' : 'UIManager.onoffOnClick( {0})'.format(widget.id),				// editmode
						// widget.properties.service,					// action service
						// widget.properties.action,					// action name
						// JSON.stringify(widget.properties.params),	// action parameter
						(status==0) ? 'red' : 'green'				// status & color of button
						)+htmlLabels;
					}
					else {
						html = "<div class='{0}'>{1}</div>".format(
							'altui-widget-2statebtn',
							_deviceIconHtml( device, 0 , (bEdit==true)? '' : 'UIManager.onoffOnClick( {0})'.format(widget.id))
							)+htmlLabels;
					}
					return html;
				},
				properties: {	//( deviceID, service, action, params, cbfunc )
					deviceid:NULL_DEVICE,
					displayicon:0,
					service:'',		// display state service
					variable:'',	// display state variable
					onvalue:'',
					offvalue:'',
					inverted:0,	// inverted to that onstate is value 0
					labels: [],		// 0:onlabel , 1:offlabel
					action_off: {
						service:'',
						action:'',
						params:{}
					},
					action_on: {
						service:'',
						action:'',
						params:{}
					}
				}
			},
			{	id:70,
				cls:'altui-widget-camera',
				no_refresh:true,
				html: _toolHtml(cameraGlyph,_T("Camera")),
				onWidgetResize: _onResizeCamera,
				aspectRatio: true,
				property: _onPropertyCamera,
				widgetdisplay: function(widget,bEdit)	{
					var device = MultiBox.getDeviceByAltuiID(widget.properties.deviceid);
					if (device==null)
						return "";
					var size = cloneObject(widget.size);
					if (widget.properties.triggerdeviceid && widget.properties.triggerdeviceid!=NULL_DEVICE) {
						var trig = MultiBox.getDeviceByAltuiID(widget.properties.triggerdeviceid );
						var stat = MultiBox.getStatus(trig, widget.properties.triggerservice, widget.properties.triggervariable )
						if ((bEdit==false) && (stat!=null) && (stat==widget.properties.triggervalue.toString()) && (stat!=widget.properties.triggerlastvalue)) {
							// need to display in highlighted mode
							widget.properties.triggerlastvalue = stat;
							size.width *= widget.properties.multiplyfactor;
							size.height *= widget.properties.multiplyfactor;
							var dialog = DialogManager.registerDialog('dialogModal-'+widget.id,
								defaultDialogModalTemplate.format( 'dialogModal-'+widget.id,
								_T('Alert - Camera'),					// title
								"<div>"+_cameraDraw(device,size)+"</div>",	// body
								"modal-lg",	// size
								""	// glyph icon
							));
							dialog.modal("show");
							dialog.off('hidden.bs.modal')
								.on( 'hidden.bs.modal', function() {
									// if the user closes the modal manually ( instead of trigger becoming false )
									$(".altui-widget#"+widget.id).replaceWith(_getWidgetHtml( widget, bEdit ));
								});
							return "";
						}
						else {
							widget.properties.triggerlastvalue = stat;
							$("#dialogModal-"+widget.id).modal("hide");
							return ((device!=null) && (device.altuiid!=NULL_DEVICE)) ? _cameraDraw(device,widget.size) : "<img src='{0}' style='max-height:100%; max-width:100%;'></img>".format(cameraURI);	//"<div class='altui-camera-div'>xxx</div>";
						}
					}
					return ((device!=null) && (device.altuiid!=NULL_DEVICE)) ? _cameraDraw(device,widget.size) : "<img src='{0}' style='max-height:100%; max-width:100%;'></img>".format(cameraURI);	//"<div class='altui-camera-div'>xxx</div>";
				},
				properties: {	//( deviceID, service, action, params, cbfunc )
					deviceid:NULL_DEVICE,
					triggerdeviceid:NULL_DEVICE,
					triggerservice:'',
					triggervariable:'',
					triggervalue:'',
					triggerlastvalue:'',
					multiplyfactor:1
				}
			},
			{	id:80,
				cls:'altui-widget-gauge',
				html: _toolHtml(scaleGlyph,_T("Gauge")),
				property: _onPropertyGauge,
				onWidgetResize: _onResizeGauge,
				widgetdisplay: function(widget,bEdit,page)	{
					if (page==undefined)
						page = PageManager.getPageFromName( _getActivePageName() );
					return "<div class='altui-gauge-div' id='altui-gauge-{0}-{1}' ></div>".format( page.id, widget.id );
				},
				onWidgetDisplay: _onDisplayGauge,
				properties: {	//( deviceID, service, action, params, cbfunc )
					label:'',
					deviceid:NULL_DEVICE,
					min:0,
					max:100,
					greenfrom:'',
					orangefrom:'',
					redfrom:'',
					inverted:false,
					majorTicks:[],
					service:'',
					variable:''
				}
			},
			{	id:90,
				cls:'altui-widget-slider',
				defaultSize: { width:50, height:100 },
				html: _toolHtml(glyphTemplate.format( "sliders", _T("Slider") , ""),_T("Slider")),
				property: _onPropertySlider,
				onWidgetResize: _onResizeSlider,	// same as camera
				widgetdisplay: function(widget,bEdit)	{
					var device = MultiBox.getDeviceByAltuiID(widget.properties.deviceid);
					if (device==null)
						return "";
					return "<span>{0}</span><div class='altui-slider-widgetui' id='altui-slider-{1}'></div>".format(widget.properties.label,widget.id)
				},
				onWidgetDisplay: function(page,widgetid,bEdit) {
					var widget = PageManager.getWidgetByID( page, widgetid );
					var device = MultiBox.getDeviceByAltuiID(widget.properties.deviceid);
					var value = MultiBox.getStatus(device,widget.properties.service,widget.properties.variable ) || 0;
					var slider = $("#altui-slider-{0}".format(widgetid))
					.slider({
						orientation: widget.properties.horizontal ? "horizontal": "vertical",
						disabled: (bEdit==true),
						range: "min",
						min:0,
						max:100,
						value: value ,
						start: function( event, ui ) {
							$(this).closest(".altui-page-contents").addClass("altui-norefresh");
						},
						change: function(event,ui) {
							$(this).closest(".altui-page-contents").removeClass("altui-norefresh");
							if (bEdit==false) {
								var widget = $(this).data('widget')
								widget.properties.params["newLoadlevelTarget"]=ui.value;
								MultiBox.runActionByAltuiID( widget.properties.deviceid, widget.properties.service, widget.properties.action, widget.properties.params );
							}
						}
					})
					.data('widget',widget);
					if (widget.properties.horizontal==true) {
						slider.css("top",5)
					}
					else {
						slider.css("left",Math.max(0,widget.size.width - 20))
					}
					_onAdjustSliderSize(widget);
				},
				properties: {	//( deviceID, service, action, params, cbfunc )
					deviceid:NULL_DEVICE,
					label:'',
					horizontal:false,
					service:'',
					action:'',
					params:{}
				}
			}
		];
	};

	function _generateNavBarHTML() {
		var html = `
		<nav id="navbar" class="navbar navbar-expand-lg navbar-dark bg-primary">
		  <a class="navbar-brand" href="#"><div class='imgLogo'></div></a>
		  <button class="navbar-toggler p-0 border-0" type="button" data-toggle="offcanvas" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
			<span class="navbar-toggler-icon"></span>
		  </button>
		  <div class="navbar-collapse offcanvas-collapse bg-primary" id="navbarSupportedContent">
			<ul class="navbar-nav mr-auto">
			{0}
			</ul>
			<form class="form-inline m-0">
			  <input id="altui-search-text" class="form-control col-6 p-1 " type="text" placeholder="{1}" aria-label="{1}">
			  <button id="altui-search" class="btn btn-outline-success col-4 p-1" type="submit">{1}</button>
			</form>
		  </div>
		</nav>
		`
		return html.format( UIControler.generateMenu(),_T("Search") );
	};

	//---------------------------------------------------------
	// private functions
	//---------------------------------------------------------

	// var _uiengine = null;		// setTimeout timer object for ui refresh
	// var _devicetypesDB = {};
	var _ui7Check = true;
	var _version = "";
	var _remoteAccessUrl = "";

	//actiondescriptor.params[param]
	function _buildParamsFromArray(args) {
		var params={};
		$.each(args,function(idx,arg) {
			params[arg.name]=arg.value;
		})
		return params;
	};
	function _buildArrayFromParams(args) {
		var arr=[];
		$.each(args, function(k,v) {
			arr.push({name:k, value:v})
		});
		return arr;
	};

	function _createScript(scriptName ) {
		var container = $(".altui-scripts")[0];			// js object
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.setAttribute("data-src", scriptName);
		container.appendChild(script);
	};

	function _loadCSS(cls,csslink, cbfunc) {
		var ncls = cls.replace(/\./g,"_")
		$("title").before("<link class='"+ncls+"' rel='stylesheet' href='"+csslink+"'>");
		$("link."+ncls).on("load",cbfunc)
	}

	function _loadCSSText(csstext) {
		$("title").before("<style type='text/css'>{0}</style>".format(csstext));
	}

	function _loadScript(scriptLocationAndName, cbfunc) {
		var head = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = g_ALTUI.g_jspath + scriptLocationAndName;
		script.setAttribute("data-src", scriptLocationAndName);

		// once script is loaded, we can call style function in it
		// $(script).load( cbfunc );
		$(script).on("load", cbfunc );
		head.appendChild(script);
	};

	function _loadCssIfNeeded( scriptname, path, drawfunc ) {
		var altuidevice = MultiBox.getDeviceByID( 0, g_ALTUI.g_MyDeviceID );
		var localcdn = ( MultiBox.getStatus( altuidevice, "urn:upnp-org:serviceId:altui1", "LocalCDN" ).trim() || "");
		if (localcdn=="~")
			localcdn=""
		var fullscriptname = (localcdn=="") ? (path+scriptname) : (localcdn+"/"+scriptname);	//supports https
		var len = $('link.'+scriptname.replace(/\./g,"_")).length;
		if (len==0) {				// not loaded yet
			UIManager.loadCSS(scriptname,fullscriptname,function() {
				if ($.isFunction(drawfunc)) { (drawfunc)(); }
			});
			return;
		}
		if ($.isFunction(drawfunc)) { (drawfunc)(); }
	};

	function _loadScriptIfNeeded( scriptname, path, drawfunc ) {
		var altuidevice = MultiBox.getDeviceByID( 0, g_ALTUI.g_MyDeviceID );
		var localcdn = ( MultiBox.getStatus( altuidevice, "urn:upnp-org:serviceId:altui1", "LocalCDN" ).trim() || "");
		if (localcdn=="~")
			localcdn=""
		var fullscriptname = (localcdn=="") ? (path+scriptname) : (localcdn+"/"+scriptname);	//supports https
		var len = $('script[src="'+fullscriptname+'"]').length;
		if (len==0) {				// not loaded yet
			UIManager.loadScript(fullscriptname,function() {
				if ($.isFunction(drawfunc)) { (drawfunc)(); }
			});
			return;
		}
		if ($.isFunction(drawfunc)) { (drawfunc)(); }
	};

	function _loadD3Script( drawfunc ) {
		_loadScriptIfNeeded('d3.min.js','//cdnjs.cloudflare.com/ajax/libs/d3/4.12.0/',drawfunc);
		// _loadScriptIfNeeded('d3.min.js','//cdnjs.cloudflare.com/ajax/libs/d3/3.5.17/',drawfunc);
	};

	function _loadJointJSScript( drawfunc ) {
		//https://cdnjs.cloudflare.com/ajax/libs/jointjs/2.0.1/joint.min.js
		//https://cdnjs.cloudflare.com/ajax/libs/jointjs/3.1.1/joint.min.js
		var ver = "3.2.0/" //"3.1.1/" //"2.2.1/" //"2.1.4/" //"2.0.1/";	// "1.1.0/"; // "1.0.3"
		_loadCssIfNeeded( "joint.css", "//cdnjs.cloudflare.com/ajax/libs/jointjs/"+ver)
		_loadScriptIfNeeded('joint.min.js','//cdnjs.cloudflare.com/ajax/libs/jointjs/'+ver,function() {
			_loadScriptIfNeeded('joint.shapes.fsa.min.js','//cdnjs.cloudflare.com/ajax/libs/jointjs/'+ver,function() {
				_loadScriptIfNeeded('joint.shapes.devs.min.js','//cdnjs.cloudflare.com/ajax/libs/jointjs/'+ver,drawfunc);
			});
		});
	};

	// func is the function to call, if it contains module.funcname it is a UI7 style. otherwise it is assumed UI5 style
	// UI7 style already uses jquery normally
	function _fixScriptPostLoad( name, code, ui7style ) {
		if (!ui7style)
		{
		// if (name=="J_WakeUpLight.js") {
			// https://regex101.com/
			var re = /\$\((.*?)\).value\s*=(.*);/g;
			var subst = '$(\'#\'+$1).val($2);';
			code = code.replace(re, subst);

			re = /\$\((.*?)\).value/g;
			var subst = '$(\'#\'+$1).val()';
			code = code.replace(re, subst);

			re = /\$\((.*?)\).innerHTML\s*?=\s*?(.*);/g;
			var subst = '$(\'#\'+$1).html($2)';
			code = code.replace(re, subst);

			re = /\$\((.*?)\).innerHTML/g;
			var subst = '$(\'#\'+$1).html()';
			code = code.replace(re, subst);

			re = /\$\((.*?)\).checked/g;
			subst = '$(\'#\'+$1).is(\':checked\')';
			code = code.replace(re, subst);

			re = /\(\$\(([^#]*?)\)\)?/g;
			subst = '($(\'#\'+$1).length>0)';
			code = code.replace(re, subst);
		// }
			if (name=="J_ProgramLogicC.js") {
				re = /!\$\((selectedEventObj)\)/g;
				subst = '($("#"+selectedEventObj).length==0)';
				code = code.replace(re, subst);

				re = /\$\$\((.*?)\)/g;
				subst = '$($1)';
				code = code.replace(re, subst);
			}
			if (name=="J_OWServer.js") {
				// J_OWServer.js & others
				re = /=\s*new\s+Hash\(\);/g;
				subst = '= {};';
				code = code.replace(re, subst);
				re = /.set\((.*),(.*)\)/g;
				subst = '[$1]=$2';
				code = code.replace(re, subst);
			}
		}
		if (name=="J_RGBController1.js") {
			re = /#RGBController_red .ui-slider-range, #RGBController_red .ui-slider-handle { background-color: (#(\d|[a-f]|[A-F]){6}) !important; }/;
			subst = '#RGBController_red .ui-slider-range, #RGBController_red .ui-slider-handle,#RGBController_red .ui-widget-header, #RGBController_red .ui-state-default { background-image:url(\'\'); background-color: $1 !important; }';
			code = code.replace(re, subst);
			re = /#RGBController_green .ui-slider-range, #RGBController_green .ui-slider-handle { background-color: (#(\d|[a-f]|[A-F]){6}) !important; }/;
			subst = '#RGBController_green .ui-slider-range, #RGBController_green .ui-slider-handle,#RGBController_green .ui-widget-header, #RGBController_green .ui-state-default { background-image:url(\'\'); background-color: $1 !important; }';
			code = code.replace(re, subst);
			re = /#RGBController_blue .ui-slider-range, #RGBController_blue .ui-slider-handle { background-color: (#(\d|[a-f]|[A-F]){6}) !important; }/;
			subst = '#RGBController_blue .ui-slider-range, #RGBController_blue .ui-slider-handle,#RGBController_blue .ui-widget-header, #RGBController_blue .ui-state-default { background-image:url(\'\'); background-color: $1 !important; }';
			code = code.replace(re, subst);
			re = /#RGBController_white .ui-slider-range, #RGBController_white .ui-slider-handle { background-color: (#(\d|[a-f]|[A-F]){6}) !important; }/;
			subst = '#RGBController_white .ui-slider-range, #RGBController_white .ui-slider-handle,#RGBController_white .ui-widget-header, #RGBController_white .ui-state-default { background-image:url(\'\'); background-color: $1 !important; }';
			code = code.replace(re, subst);
			}
		// bootstrap 4 fixes
		re = /btn-default/g;
		var subst = 'btn-secondary';
		code = code.replace(re, subst);
		// UI7 classes - some plugin uses them
		if ((name=="J_PhilipsHue2.js") || (name=="J_PhilipsHueLamp2.js")) {
			re = /setup_wizard_button/g;
			subst = 'btn btn-primary setup_wizard_button'
			code = code.replace(re, subst);
			re = /vBtn/g;
			subst = 'vBtn btn btn-secondary'
			code = code.replace(re, subst);
			re = /scenes_button_cancel/g;
			subst = 'scenes_button_cancel btn btn-secondary'
			code = code.replace(re, subst);
			re = /bridgeNotConnected/g;
			subst = 'bridgeNotConnected text-danger'
			code = code.replace(re, subst);
			re = /devices_add_device_control_container/g;
			subst = 'devices_add_device_control_container btn btn-secondary'
			code = code.replace(re, subst);
			re = /console\.log/g;
			subst = '\/\/console.log'
			code = code.replace(re, subst);
		}


		return code;
	};

	function _initDB(devicetypes,cbfunc) {
		EventBus.registerEventHandler("on_altui_deviceTypeLoaded",UIManager,function() {
			(cbfunc)();
		});

		var _devicetypesDB = MultiBox.initDB(devicetypes).getALTUITypesDB();
		_ui7Check = (_devicetypesDB["info"].ui7Check == "true" );
		_version = _devicetypesDB["info"].PluginVersion;
		_remoteAccessUrl =_devicetypesDB["info"].RemoteAccess;

		// foreach load the module if needed
		// AltuiDebug.SetDebug( _devicetypesDB["info"].debug ) ;

		var _toload=0;
		$.each(_devicetypesDB, function(devtype,obj) {
			if (obj!=null && obj.ScriptFile!=null) {
				var len = $('script[data-src="'+obj.ScriptFile+'"]').length;
				if (len==0) {
					// not loaded yet
					_toload++;
					_loadScript(obj.ScriptFile, function(e) {
						// script has been loaded , check if style needs to be loaded and if so, load them
						$.each(_devicetypesDB,function(idx,dt) {
							if ( (dt.ScriptFile == obj.ScriptFile) && (dt.StyleFunc != undefined) ) {
								Altui_LoadStyle(dt.StyleFunc);
								return false;	// exit the loop
							}
						});
						_toload--;
					});	// load script & styles once script is loaded
				}
				// else loaded
			}
		});
		if ($.isFunction(cbfunc)) {
			function notifyTermination() {
				if (_toload==0)
					EventBus.publishEvent("on_altui_deviceTypeLoaded");
				else
					setTimeout( notifyTermination, 500 );
			};
			notifyTermination();
		}
	};

	function _enhanceEditorValue(id,value,altuiid)
	{
		var extradata = altuiid ? ("data-altuiid='"+altuiid+"'") : "";
		if ($.isNumeric(value) && value>=900000000 && value <= 4035615941) {
			var field = "<input {2} type='datetime-local' class='form-control' id='{0}' name='{0}' value='{1}'>";
			var date = new Date(value*1000);
			// var offset = date.getTimezoneOffset();
			// offset = ((offset<0? '+':'-')+ _format(parseInt(Math.abs(offset/60)))+ ":"+_format(Math.abs(offset%60)));
			return field.format(id, _toIso(date),extradata);
		}
		var str = value.toString().escapeXml();
		return "<input {2} id='{0}' class='form-control' type='text' value='{1}'></input>".format(id,str,extradata);
	};

	// -- urn:micasaverde-com:serviceId:SceneController1#LastSceneID#208#thingspeak#61666#U1F7T31MH#key=U1F7T31MHB5O8HZI&field1=%s#graphicurl
	function _differentWatch(watch,push) {
		if ((watch.service != push.service)
		||	(watch.variable != push.variable)
		||	(watch.deviceid != push.deviceid)
		||	(watch.provider != push.provider) )
			return true;
		// otherwise compare params
		if (watch.params.length != push.params.length)
			return true;
		for (var i=0; i<watch.params.length ; i++) {
			if ( (watch.params[i]==undefined) || (push.params[i]==undefined) || (watch.params[i] != push.params[i]) )
				return true;
		}
		return false;
	};

	function _displayJson(type,obj) {
		return "<pre id='altui-"+type+"' class='altui-code'>"+JSON.stringify( obj )+"</pre>";
	};

  function _displayLua(type,obj,controller) {
    function paramsFromArray(args) {
      var str=[]
      $.each(args, function(idx,arg) {
        str.push('["{0}"]="{1}"'.format(arg.name, arg.value))
      })
      return "{"+ str.join(",") +"}"
    }

    var lua = ""

    $.each(obj, function(idx,group) {
      lua += "function delay_{0}()\n".format(group.delay)
      $.each(group.actions, function(idx2,action) {
				var device = MultiBox.getDeviceByID(controller,action.device)
        lua+='\t-- #{0} {1} ({2} {3})\n'.format(device.altuiid, device.name || "", device.manufacturer || "", device.model || "")
        lua+='\tluup.call_action("{0}", "{1}", {3}, {2})\n'.format(
          action.service,
          action.action,
          action.device,
          paramsFromArray(action.arguments)
        )
      })
      lua += "end\n"
    })
    $.each(obj, function(idx,group) {
      lua += 'luup.call_delay("delay_{0}", {0}, "")\n'.format(group.delay)
    })
		return "<pre id='altui-"+type+"' class='altui-code'>"+lua+"</pre>";
	};

	function _displayTimer(timer,options) {
		options = $.extend({ only_text:false, add_button:true , add_json:true },options);	// set defaults
		var html="";
		html +="<tr>";
		html +="<td>";
		if (options.only_text != true)
			html +="<input type='checkbox' {0} class='altui-enable-timer' id='{1}'></input>".format( timer.enabled==true ? 'checked' : '', timer.id);
		html +="</td>";
		html +="<td>";
		html +="<b>{0}</b>".format(timer.name || "");
		html +="</td>";
		html +="<td>";
		switch( parseInt(timer.type) ) {
			case 1:
				// h for hour m for minutes
				html += "{0}: {1}".format( _timerTypes[timer.type].text, timer.interval);
				break;
			case 2:
				// T sunset , R sunrise ,  <0 before , >0 after
				// day of week : sunday = 0
				html += "{0}: {1} h:m:s= [{2}]".format( _timerTypes[timer.type].text, timer.days_of_week, timer.time );
				break;
			case 3:
				// T sunset , R sunrise ,  <0 before , >0 after
				// days of month is a csv list
				html += "{0}: {1} h:m:s= [{2}]".format( _timerTypes[timer.type].text, timer.days_of_month, timer.time);
				break;
			case 4:
				html += "{0}: {1} ".format( _timerTypes[timer.type].text, timer.abstime);
				break;
			default:
				html+= JSON.stringify(timer);
		}
		if (timer.modeStatus) {
			html += "<span> @ mode:{0}</span>".format(
				(timer.modeStatus == "0")
				? _T("All")
				: ($.map(timer.modeStatus.split(","),function(m) { return _HouseModes[ parseInt(m)-1 ].text})).join(", ")
				)
		}
		html +="</td>";
		html +="<td>";
		if (options.only_text != true) {
			html += smallbuttonTemplate.format( timer.id, 'altui-deltimer', deleteGlyph,'Delete timer');
			html += smallbuttonTemplate.format( timer.id, 'altui-edittimer', editGlyph,'Edit timer');
		}
		html +="</td>";
		html +="</tr>";
		//todo enabled , last_run , next_run
		return html;
	};

	function _displayTimers(timers,options) {
		var html = "";
		options = $.extend({ only_text:false, add_button:true , add_json:true },options);	// set defaults
		if (options.add_json==true)
			html += _displayJson( 'json-Timers', timers);
		try {
			html +="<table class='table table-responsive-OFF table-sm'>";
			html +="<tbody>";
			if (timers) {
				$.each( timers, function(idx,timer) {
					html += _displayTimer(timer,options);
				});
			}
			if (options.add_button==true)
				html +=("<tr><td colspan='4'>"+smallbuttonTemplate.format( -1 , 'altui-addtimer', plusGlyph,_T('Timer'))+" "+_T('Timer')+"</td></tr>");
			html +="</tbody>";
			html +="</table>";
		}
		catch(err) {
			var str = _T("error happened during decoding timers, probable duplicate ID or invalid format");
			html +="</tbody>";
			html +="</table>";
			html +="<span class='text-danger'>"+str+"</span>";
			PageMessage.message( str, "danger");
		}
		return html;
	};

	function _deviceDrawVariables(device) {
		var dfd = $.Deferred();

		function _clickOnValue() {
			var id = $(this).prop('id');	// idx in variable state array
			var state =	 MultiBox.getStateByID( device.altuiid, id );
			var tbl = [state.service , state.variable]//atob(id).split('.');
			var value = MultiBox.getStatus(device,tbl[0],tbl[1]);
			$(this).off( "click");
			$(this).html( _enhanceEditorValue(id,value) );
			$(this).find("input#"+id)
				.focus()
				.focusout( function() {
					var id = $(this).prop('id');
					var state =	 MultiBox.getStateByID( device.altuiid, id );
					var tbl = [state.service , state.variable]//atob(id).split('.');
					var oldval = state.value;
					var val = $(this).val();	// but this is in UTC so we need to convert back to locale timezone
					if (oldval != val) {
						if ($(this).attr('type')=='datetime-local') {
							var d = new Date(val);	// input returns in UTC but we want in locale
							var locale = d.getTime() + (d.getTimezoneOffset()*60000);	// add offset so that it is locale
							val = locale/1000;
						}
						MultiBox.setStatus( device, tbl[0],tbl[1], val );
					}
					$(this).parent().click(_clickOnValue);
					$(this).replaceWith(HTMLUtils.enhanceValue(val));
				});
		};
		function _pushFormFields(parameters, provider, varid, pushData) {
			var tempPushData = (pushData) ? cloneObject(pushData) : [];
			var template = `
				<div class="altui-provider-card card mt-2" data-altuiprovider="{0}">
				  <div class="card-body">
					<h4 class="card-title text-capitalize">{0}</h4>
					{1}
				  </div>
				</div>`
			var html ="";

			for (var i=0 ; i<parameters.length ; i++) {
				var defvalue = parameters[i].default || "";
				var value = (pushData!=null) ? (pushData.params[i] || defvalue) : '';
				tempPushData.params[i]=value;
				html += "<div class='form-group col-12'>";
					html += "<label for='datapush-{0}-{1}'>{2}-{3}</label>".format(parameters[i].key, varid, i,parameters[i].label);
					html += "<input type='{2}' class='form-control form-control-sm' id='datapush-{0}-{1}' placeholder='{2}' value='{3}'></input>".format(
						parameters[i].key,
						varid,
						parameters[i].type,
						value
					)
				html += "</div>"
				if (parameters[i].key=="graphicurl") {
					var height = parameters[i].ifheight || 260;
					var url = String.prototype.format.apply(value,tempPushData.params);
					if (url && url!=NO_URL) {
						html += "<iframe id='altui-iframe-chart-{2}' class='altui-thingspeak-chart' data-idx='{1}' width='100%' height='{3}' style='border: 1px solid #cccccc;' src='{0}' ></iframe>".format(url,i,varid,height);
					} else {
						html +=_T("No Graphic available for this data storage provider")
					}
				}

			}
			return template.format(provider,html);
		};
		function buildPushForm(providers,pushData,device,varid) {
			var altuidevice = MultiBox.getDeviceByID( 0, g_ALTUI.g_MyDeviceID );
			var state = MultiBox.getStateByID( device.altuiid, varid );
			var html = "";
					selectedProviders = $.map(pushData,function(pd,idx) {return pd.provider})
					htmlProviders = []
					$.each(providers,function(key,provider) {
						htmlProviders.push('<option {1}>{0}</option>'.format(
							key,
							($.inArray(key,selectedProviders)!=-1) ? 'selected' : ''
						));
					});

					html = `
						<label for="altui-provider-{0}" class="align-middle d-inline w-25">Enable Push to :</label>
						<select multiple id="altui-provider-{0}" class="align-middle form-control d-inline w-75" >
							{1}
						</select>`.format( varid, htmlProviders.join("\n") )
				html += "</div>"	//row

				html += "<form id='form-{0}' class='form mt-2'>".format(varid);
				$.each(pushData, function(idx,pushDataOneProvider) {
                    // prevent crash if provider does not exist
                       if (providers[ pushDataOneProvider.provider ] != null ) {
                           html += _pushFormFields( providers[ pushDataOneProvider.provider ].parameters, pushDataOneProvider.provider, varid, pushDataOneProvider );
                       }
				});
				html += "</form>"
			return html;
		};

		function buildDeviceVariableBody(deviceVariableLineTemplate,model) {
			/*
				model[state.id] = {
					val:HTMLUtils.enhanceValue(state.value),
					sendWatches: sendWatches
				}
			*/
			var lines = [];
			var states = MultiBox.getStates( device )
			$.each(states.sort(_sortByVariableName), function(idx,state) {
				var row = model[state.id];
				var str = deviceVariableLineTemplate.format(
						state.variable,
						row.val,
						state.service,
						state.id,
						(row.sendWatch!=null) ? 'btn-info' : 'btn-light',
						(row.sendWatch!=null) ? row.sendWatch.provider : ''
					);
				lines.push(	 str );
			});
			return lines.join('');
		};

		// 0: variable , 1: value , 2: service
		if (device!=null) {

			// Get Saved Watches
			var model = {};
			var watches = {};
			var altuidevice = MultiBox.getDeviceByID( 0, g_ALTUI.g_MyDeviceID );
			$.each(MultiBox.getWatches("VariablesToSend",function(watch) { return (watch.deviceid == device.altuiid); }), function(i,watch) {
				watches[watch.service+'_'+watch.variable] = watch;
			});
			var states = MultiBox.getStates( device )
			$.each(states.sort(_sortByVariableName), function(idx,state) {
				model[state.id] = {
					val:HTMLUtils.enhanceValue(state.value),
					sendWatch: watches[state.service+'_'+state.variable]
				}
			});

			// Generate the device variable dialog
			var deviceVariableLineTemplate = ALTUI_Templates.deviceVariableLineTemplate;
			var body = buildDeviceVariableBody(deviceVariableLineTemplate,model);
			DialogManager.registerDialog('deviceModal',deviceModalTemplate.format( body, device.name, device.altuiid ));

			// Manages the interactivity
			$("button.altui-variable-push").click( function() {
				function _getPushFromDialog(frm) {
					var pushes = []
					$(".altui-provider-card").each( function(idx,card) {
						var push = {
							service : state.service,
							variable : state.variable,
							deviceid : device.altuiid,
							provider : $(card).data("altuiprovider"),
							params : []
						};
						$(card).find("input").each(function(idx,elem) {
							push.params.push($(elem).val());
						});
						pushes.push(push)
					});
					return pushes;
				}

				var tr = $(this).closest("tr");
				var varid = tr.find("td.altui-variable-value").prop('id');
				var state = MultiBox.getStateByID( device.altuiid, varid );
				var form = $(this).closest("tbody").find("form#form-"+varid);
				if (form.length==0) {
					var that = $(this);
					// change color
					that.removeClass("btn-light btn-info").addClass("btn-danger");
					MultiBox.getDataProviders(function(providers) {
						//
						// get this push parameters if they exist
						//
						var pushData = MultiBox.getWatches("VariablesToSend",function(push) { return ((device.altuiid == push.deviceid) && (state.variable==push.variable) && (state.service==push.service)) });
						var html = buildPushForm(providers,pushData,device,varid);
						tr.after("<tr><td colspan='3'>"+html+"</td></tr>");

						$("#altui-provider-"+varid).change(function() {
							function _searchPushForProvider(provider) {
								for(var i=0; i<pushData.length; i++) {
									if (pushData[i].provider == provider)
										return pushData[i]
								}
								return {
									provider:provider,
									params:[]
								}
							}
							var selected_providers = $('select#altui-provider-{0}'.format(varid)).val()
							var html = ""
							$.each(selected_providers, function(idx,provider) {
								var pushData = _searchPushForProvider(provider)
								html += _pushFormFields( providers[ provider ].parameters, provider, varid, pushData);
							});
							$("#form-"+varid).html( html  ) ;
						});

						$("#form-"+varid+" input").change( function() {
							var pushes = _getPushFromDialog( $("#form-"+varid) );
							var cardbody = $(this).closest(".altui-provider-card")
							var provider = $(cardbody).data("altuiprovider")
							for (var i=0; i<pushes.length; i++) {
								if( pushes[i].provider == provider) {
									var url = $(cardbody).find("#datapush-graphicurl-"+varid).val();
									url = String.prototype.format.apply(url,pushes[i].params);
									if (url.indexOf("{")==-1)
										$(cardbody).find(".altui-thingspeak-chart").attr("src",url);
								}
							}
						});
					});
				} else {
					// CLOSING the form : change color
					var nexttr = tr.next("tr");
					var pushEnabled = ( $("#altui-provider-"+varid).val().length > 0 )
					var cls = (pushEnabled==true) ? "btn-info" : "btn-light"
					$(this).addClass(cls).removeClass("btn-danger");
					var push = null;
					var differentWatches=null;
					// find all watches for this device
					var previousWatches = MultiBox.getWatches("VariablesToSend",function(watch) { return (watch.service == state.service) && (watch.variable == state.variable)	 && (watch.deviceid == device.altuiid) });

					// add a new one unless it is already there
					var pushes = _getPushFromDialog(form);
					var todelete = _.differenceWith(previousWatches, pushes, function(a,b) { return _differentWatch(a,b)==false });
					var toadd = _.differenceWith(pushes, previousWatches, function(a,b) { return _differentWatch(a,b)==false });

					// delete all old ones
					$.each(todelete , function(i,w) {
						MultiBox.delWatch( w )
					});
					$.each(toadd , function(i,w) {
						MultiBox.addWatch( w )
					});
					form.closest("tr").remove();
				}
			});
			$("button.altui-variable-history").click( function() {
				var tr = $(this).closest("tr");
				var varid = tr.find("td.altui-variable-value").prop('id');
				var historypre = $(this).closest("tbody").find("table#"+varid);
				var width = tr.width();
				if (historypre.length==0) {
					MultiBox.getDeviceVariableHistory( device, varid, function(history) {
						//AltuiDebug.debug("getDeviceVariableHistory returned :"+history.result);
						var html = "<tr><td colspan='3'>";
						html += "<div class='card xxx'> <div class='card-body'>";
						// html += "<div class='table-responsive-OFF'>";
						html +="<table id='{0}' class='table table-responsive-OFF table-sm table-responsive-OFF altui-variable-value-history'>".format(varid);
						html +="<thead>";
						html += ("<tr><th>{0}</th><th>{1}</th><th>{2}</th></tr>".format(_T("Date"),_T("Old"),_T("New")));
						html +="</thead>";
						html +="<tbody>";
						history.lines.reverse();
						$.each(history.lines, function(i,e) {
							html += ("<tr><td>{0}</td><td>{1}</td><td>{2}</td></tr>".format(e.date,HTMLUtils.enhanceValue(e.oldv),HTMLUtils.enhanceValue(e.newv)));
						});
						html +="</tbody>";
						html +="</table>";
						html += "</div></div>";
						html += "</td></tr>";
						tr.after(html);

					});
				}
				else
					historypre.closest("tr").remove();
			});
			$("button.altui-variable-delete").click( function() {
				var tr = $(this).closest("tr");
				var varid = tr.find("td.altui-variable-value").prop('id');
				var state = MultiBox.getStateByID( device.altuiid, varid );
				MultiBox.setStatus( device, state.service, state.variable, "");
				var cell = tr.find(".altui-variable-value")
				$(cell).text("");
				DialogManager.confirmDialog(_T("Do you also want to delete this variable definitively ? ({0})").format(state.variable),function(result) {
					if (result==true) {
						MultiBox.modifyDevice(device , function( result ) {
							$("#altui-oscommand-result").text(JSON.stringify(result,null,2));	// pretty print				} )
						});
					}
				});
			});
			$(".altui-variable-value").click( _clickOnValue );

			// show the modal
			$('#deviceModal button.btn-primary')
			.off('click')
			.on('click', function(e) {
				// force the closure of Push Parameter dialogs
				// $(".altui-variable-push.btn-danger").click()
				if ($(".altui-variable-push.btn-danger").length>0) {
					alert(_T("Please close the watch information first"))
					e.preventDefault();
					e.stopPropagation()
					return false;
				}
			})
			$('#deviceModal').modal();
			$('#deviceModal').on('hidden.bs.modal', function (e) {
			  // do something...
			  dfd.resolve("hidden.bs.modal")
			})
		} else {
			dfd.reject()
		}
		return dfd.promise();
	};

	function _deviceCreate() {
		// prepare modal
		// show
		$('#deviceCreateModal button.btn-primary')
			.off('click')
			.on('click', function(e) {
				var form = $(this).closest(".modal-content").find("form")[0]
				if (form.checkValidity() === false) {
					event.preventDefault();
					event.stopPropagation();
				} else {
					if (confirm("Are you sure you want to create this device")) {
						MultiBox.createDevice(
							0,	// only on main controller for now
							{
								dfile: $("#altui-input-dfile").val(),
								ifile: $("#altui-input-ifile").val(),
								descr: $("#altui-input-dtitle").val()
							},
							function ( newid ) {
								$('#deviceCreateModal').modal('hide');
								if (newid !=null)
									PageMessage.message( _T("Device {0} created successfully").format(newid), "info");
								else
									PageMessage.message( _T("Device creation failed"), "danger");
							}
						);
					}
				}
				form.classList.add('was-validated');
			});
		$('#deviceCreateModal').modal();
	};

	// Find the correct device type for devices suppoting multiple JSON files.
	function _getDeviceDrawMapping(device) {
		if (device.device_type.startsWith('urn:schemas-dcineco-com:device:MSwitch')) {
			// replace MSwitchxxxxx by MSwitch
			var elems = device.device_type.split(':');
			elems[3] = "MSwitch";
			devicetype = elems.join(':');
		} else if (device.device_type.startsWith('urn:schemas-rboer-com:device:HarmonyDevice')) {
			// replace HarmonyDevicexxxxx by HarmonyDevice
			var elems = device.device_type.split(':');
			elems[3] = "HarmonyDevice";
			devicetype = elems.join(':');
		} else if (device.device_type.startsWith('urn:schemas-rboer-com:device:Harmony')) {
			// replace Harmonyxxxxx by Harmony
			var elems = device.device_type.split(':');
			elems[3] = "Harmony";
			devicetype = elems.join(':');
		} else {
			devicetype = device.device_type;
		}
		return devicetype;
	};

	function _deviceDrawActions(device) {

		// 0:name 1:name
		var deviceActionParamTemplate = "<div class='input-group input-group-sm'>";
		deviceActionParamTemplate +=	"  <div class='input-group-prepend'><span class='input-group-text' id='sizing-addon3'>{0}</span></div>";
		deviceActionParamTemplate +=	"  <input type='text' class='form-control' placeholder='{1}' aria-describedby='sizing-addon3'>";
		deviceActionParamTemplate +=	"</div>";

		// 0: action , 1: value , 2: service, 3: devid
		var deviceActionLineTemplate = "  <tr>";
		deviceActionLineTemplate += "		  <td><span title='{2}'><button class='btn btn-primary btn-sm altui-run-action' data-altuiid='{3}' data-service='{2}' >{0}</button></span></td>";
		deviceActionLineTemplate += "		  <td>{1}</td>";
		deviceActionLineTemplate += "	  </tr>";

		// for each services for that device type
		// enumerate actions name & parameters
		// var device = MultiBox.getDeviceByID( devid );

		MultiBox.getDeviceActions(device, function( services ) {
			//AltuiDebug.debug("MultiBox.getDeviceActions => returns services:{0}".format( JSON.stringify(services)));
			var lines = [];
			$.each( services, function( idx,service) {
				$.each( service.Actions, function (key1,action) {
					var params = [];
					$.each(action.input, function (key2,param) {
						params.push( deviceActionParamTemplate.format(param,param) );
					});
					lines.push( deviceActionLineTemplate.format(action.name,params.join(''),service.ServiceId,device.altuiid) );
				});
			});

			// update modal with new text
			var extrabuttons = MultiBox.isDeviceZwave(device) ? buttonTemplate.format( device.altuii, "altui-update-neighbors", _T("Update Neighbors"),"default",_T("Update Neighbors")) : "";
			DialogManager.registerDialog('deviceActionModal',deviceActionModalTemplate.format( lines.join(''), device.name, device.altuiid, extrabuttons ));

			$('div#deviceActionModal button.altui-run-action').click( function() {
				var service = $(this).data().service;	// better than this.dataset.service in case of old browsers
				var altuiid = $(this).data().altuiid;
				var device = MultiBox.getDeviceByAltuiID(altuiid);
				var action = $(this).text();
				// search parameters
				var inputs= $(this).parents("tr").find("td:nth-child(2) div.input-group");
				var parameters = {};
				$.each( inputs, function( i, param) {
					var paramname = $(param).find("input").prop("placeholder");
					var paramvalue = $(param).find("input").val();
					if (paramname != undefined)
						parameters[paramname]=paramvalue;
				});

				MultiBox.runAction( device, service, action, parameters, function(result) {
					alert(result);
				});
			});
			$('div#deviceActionModal button.altui-update-neighbors').click( function() {
				var altuiid = $(this).prop('id');
				var device = MultiBox.getDeviceByAltuiID(altuiid);
				MultiBox.updateNeighbors( device );
			});

			// show the modal
			$('#deviceActionModal').modal();
		});
	};

	// This is the list with all job statuses and their meaning:
// -1: No job, i.e. job doesn't exist.
// 0: Job waiting to start.
// 1: Job in progress.
// 2: Job error.
// 3: Job aborted.
// 4: Job done.
// 5: Job waiting for callback. Used in special cases.
// 6: Job requeue. If the job was aborted and needs to be started, use this special value.
// 7: Job in progress with pending data. This means the job is waiting for data, but can't take it now.
// job_None=-1, // no icon
// job_WaitingToStart=0, // gray icon
// job_InProgress=1, // blue icon
// job_Error=2, // red icon
// job_Aborted=3, // red icon
// job_Done=4, // green icon
// job_WaitingForCallback=5 // blue icon - Special case used in certain derived classes
	function _jobStatusToColor( status ) {
		status = parseInt(status);
		switch(status) {
			case 1:
			case 5:
			case 6:
			case 7:
				return "info";
			case 0:
				return "primary";
			case 2:
			case 3:
				return "danger";
			case 4:
				return "success";
			case -1:
			default:
				return "";
		}
	};

	function _enhancedDeviceTitle(device) {
		var glyphs=[];
		glyphs.push((device.favorite==true) ? starGlyph : staremtpyGlyph);

		if (device.hidden==true)
			glyphs.push(hiddenGlyph);
		if (device.invisible==true)
			glyphs.push(invisibleGlyph);

		var template="{0} <small class='altui-device-title-name'>{1}</small>";
		return template.format(glyphs.join(' '), device.name);
	}

	function _defaultDeviceDrawWatts( device ) {
		var strings = []
		var services = [
			"urn:micasaverde-com:serviceId:LightSensor1",
			"urn:micasaverde-com:serviceId:HumiditySensor1",
			"urn:micasaverde-com:serviceId:GenericSensor1"
		]
		var watts = parseFloat(MultiBox.getStatus( device, 'urn:micasaverde-com:serviceId:EnergyMetering1', 'Watts' ));
		var kwh = parseFloat(MultiBox.getStatus( device, 'urn:micasaverde-com:serviceId:EnergyMetering1', 'KWH' ));
		if (isNaN(watts)==false)
			strings.push(  ALTUI_Templates.wattTemplate.format(watts,"W") )
		else {
			watts = parseFloat(MultiBox.getStatus( device, 'urn:micasaverde-com:serviceId:EnergyMetering1', 'UserSuppliedWattage' ));
			if (isNaN(watts)==false)
				strings.push( ALTUI_Templates.wattTemplate.format(watts,"W") )
		}
		if (isNaN(kwh)==false)
			strings.push( ALTUI_Templates.wattTemplate.format(Math.round(kwh)," kWh") )

		if (strings.length==0) {
			$.each(services, function(i,s) {
				var val = parseFloat(MultiBox.getStatus( device, s, 'CurrentLevel' ));
				if (isNaN(val)==false) {
					strings.push( ALTUI_Templates.wattTemplate.format(val," ") )
					return false;
				}
			})
		}
		return strings.join(" ");
	};

	function _defaultDeviceDrawAltuiStrings(device) {
		var html ="";
		$.each( ['DisplayLine1','DisplayLine2'],function(i,v) {
			var dl1 = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:altui1', v );
			if (dl1 != null)
				html += $("<div class='altui-"+v+"'></div>").text(dl1).wrap( "<div></div>" ).parent().html()
		});
		return html
	};

	function _defaultDeviceDraw( device ) {
		var html = _defaultDeviceDrawAltuiStrings(device);
		if (html=="")
			html = _defaultDeviceDrawWatts(device);
		return html!="" ? html : optHorGlyph;
	};

	function _hasObjectProperty( obj )
	{
		var bFound = false;
		$.each( obj, function(key,val) {
			if ( isObject(val) )
			{
				bFound=true;
				return false;
			}
		});
		return bFound;
	};

// icons http://192.168.1.16/cmh/skins/default/img/devices/device_states/binary_light_default.png
//_devicetypesDB[ device.device_type ][json].ui_static_data.flashicon
//_devicetypesDB[ device.device_type ][json].ui_static_data.default_icon
//
//192.168.1.5/cmh/skins/default/img/devices/device_states/../../../icons/intro.png
//192.168.1.16/cmh/skins/default/img/devices/device_states/../../../icons/intro.png
//192.168.1.16/cmh/skins/default/img/icons/intro.png
	function _getDeviceIconPath(device) {
		var id = device.altuiid;
		var controller = MultiBox.controllerOf(id).controller;
		var ui5 = MultiBox.isUI5( controller );
		var icon='';
		switch( device.device_type ) {
			case 'urn:schemas-futzle-com:device:CountdownTimer:1':
				icon = '//apps.mios.com/plugins/icons/1588.png';
				break;
			default:
				var src = defaultIconSrc;
				var ui_static_data = MultiBox.getDeviceStaticData(device);
				var str = (ui_static_data && ui_static_data.default_icon ) ? ui_static_data.default_icon : "" ;
				if (ui_static_data!=null)
				{
					//dt.ui_static_data.DisplayStatus
					//dt.ui_static_data.state_icons

					// check if there are objects in dt.ui_static_data.state_icons
					if (ui_static_data.state_icons !=undefined)	//	some state icons found
					{
						var si = ui_static_data.state_icons;
						if (_hasObjectProperty(si) == true )	// UI7 style
						{
							// enumerate each object until a condition is met true
							var bFound = false;
							$.each( si , function(key,obj) {
								if (isObject(obj) && (obj.img!=undefined) ) {
									// obj.conditions is an array, obj.img s the icon
									if (MultiBox.evaluateConditions(device, obj.conditions))
									{
										bFound = true;
										str = obj.img;
									}
								}
								return (bFound==false);
							});
							// in UI7 if icon path starts with .. it is relative to skins/default/img/devices/device_states/
						}
						else	// UI5 style
							if (ui_static_data.flashicon != undefined)
							{
								//The filename in flashicon undergoes a special transformation for variable icons.
								//The extension ".png" is changed to "_0.png", "_25.png", "_50.png", "_75.png" or "_100.png"
								//depending on the value of the service variable, linearly scaled from its range of 0:(MaxValue-MinValue) to 0:100.
								//Values round up; 1-25 produces the "_25" image; 26-50 produces the "_50" image, and so on.
								// For images which are not found (for instance, if the web server returns 404 Not Found) the default image is used.

								// mostlikely in UI5 icons are not located in devicestates folder, so let's fix it
								var baseIconName = ui_static_data.flashicon;
								//AltuiDebug.debug("UI5 style static baseIconName:"+baseIconName);
								var dot = baseIconName.lastIndexOf('.');
								if (dot >=0)
									baseIconName=baseIconName.substr(0,dot);
								if (baseIconName.substring(0,4)!="http")
								{
									baseIconName = "../../../"+baseIconName;
								}
								//AltuiDebug.debug("UI5 style static baseIconName modified :"+baseIconName);
								var ds = ui_static_data.DisplayStatus;
								if ((ds != undefined) && (ds.Service != undefined) && (ds.Variable != undefined))
								{
									var variable = MultiBox.getStatus( device, ds.Service, ds.Variable );
									if (variable==null)
										variable=0;
									var status = variable / (ds.MaxValue - ds.MinValue);
									var val = Math.ceil( status * 4 );
									str = baseIconName + "_" + (isNaN( val * 25 ) ? 0 : (val * 25)) + ".png";
								}
								else
									str = baseIconName + ".png";
							}
							else
								str = si[0] || ui_static_data.default_icon || defaultIconSrc;	// incase si is an empty [}
							//AltuiDebug.debug("Icon for device id:"+id+"  str :"+str);
					}
					else if (ui_static_data.dynamic_icons !=undefined)	//	some dynamic icons found
					{
						var di = ui_static_data.dynamic_icons;
						if (_hasObjectProperty(di) == true )	// UI7 style
						{
							// enumerate each object until a condition is met true
							var bFound = false;
							$.each( di , function(key,obj) {
								if (isObject(obj) && (obj.img!=undefined) ) {
									// obj.parameters is an array (id,arguement,value) of values to change in the svg
									// obj.conditions is an array
									// obj.img s the icon
									if (MultiBox.evaluateConditions(device, obj.conditions))
									{
										bFound = true;
										str = obj.img;
										var iconData = IconDB.getDynamicIcon(controller, str, null);
										var svgParameters = obj.parameters;
										var xml = $(iconData);
										if (isObject(xml) && (xml.get(0)!=undefined) ) {
											for ( i = 0; i < svgParameters.length; i++ ) {
												var parameter = svgParameters[i],
												value = isObject(parameter.value) ? MultiBox.getStatus(device, parameter.value.service, parameter.value.variable)  : parameter.value.toString();
												if ('opacity' === parameter.argument) {
													var opacity = (parseInt(value) / 100).toFixed(1);
													value = value > 0 && 5 > value ? '0.1' : opacity
												}
												xml.find('#' + parameter.id).css(parameter.argument, value)
											}
											var serializer = new XMLSerializer();
											var xmlStr = serializer.serializeToString(xml.get(0));
											str = "data:image/svg+xml," + encodeURIComponent(xmlStr);
										} else {
											str = ui_static_data.default_dynamic_icon!=undefined?ui_static_data.default_dynamic_icon:"";
										}
									} else {
										str = ui_static_data.default_dynamic_icon!=undefined?ui_static_data.default_dynamic_icon:"";
									}
								}
								return (bFound==false);
							});
							// in UI7 if icon path starts with .. it is relative to skins/default/img/devices/device_states/
						}
					}
					else {
						// no state icons found
						//str = (dt.ui_static_data.default_icon != undefined) ? dt.ui_static_data.default_icon : dt.ui_static_data.flashicon;
						if (ui5==true)
							str = (ui_static_data.flashicon != undefined) ? ui_static_data.flashicon : ui_static_data.default_icon;
						else
							str = (ui_static_data.default_icon != undefined) ? ui_static_data.default_icon : ui_static_data.flashicon;
						//AltuiDebug.debug("Icon for device id:"+id+"  string from json:"+str);
						if (str == undefined) {
							AltuiDebug.debug("Undefined icon in ui_static_data, device.type:"+device.device_type);
							AltuiDebug.debug("ui_static_data:"+JSON.stringify(ui_static_data));
							AltuiDebug.debug("Setting default icon");
							str = "icons/generic_sensor.png";
						}
						str = str.replace(".swf",".png");
						if ( (str == "icons/generic_sensor.png") /*|| (str == "icons/Light_Sensor.png")*/)
							str = defaultIconSrc;
						else if (str == "icons/Light_Sensor.png")
							str = "light_sensor_default.png"
						else if (str == "icons/Window_Covering.png")
							str = (MultiBox.isUI5( controller ) ? "../../../icons/Window_Covering.png" : "../../icons/Window_Covering.png");
						// //192.168.1.16/cmh/skins/default/img/devices/device_states/../../icons/Window_Covering.png
						else if (str.substr(0,6) == "icons/")
							str = "../../../" +str;
						//AltuiDebug.debug("Icon for device id:"+id+"  string after correction:"+str);
					}
				}
				else {
					//AltuiDebug.debug("Icon for device id:"+id+"  DeviceType unknown or not static data");
					str = defaultIconSrc;
				}

				//console.log("type:{0} icon:{1}".format(device.device_type,str));
				if( str.substring(0,4)=="http") {
					//AltuiDebug.debug("Icon for device id:"+id+"  IconPath:"+str);
					return str;
				}

				if (str.substring(0,11)=="data:image/")
					icon = str;
				else
					icon = MultiBox.getIconPath(controller, str );

				//AltuiDebug.debug("Icon for device id:"+id+"  IconPath:"+icon);
				break;
		};
		return icon;
	};

	function _deviceIconHtml( device, zindex, onclick )	// deviceid if device is null
	{
		var controller = MultiBox.controllerOf(device.altuiid).controller;
		//
		// get ALTUI plugin definition to see if we have a custom icon drawing , so allways on master controller => 0!
		//
		var _devicetypesDB = MultiBox.getALTUITypesDB();	// master controller

		if (device==null)
			return "<img class='altui-device-icon pull-left rounded' data-org-src='/err' src='{0}' alt='_todo_' onerror='UIManager.onDeviceIconError(\"{1}\")' {2} ></img>".format(
				defaultIconSrc,
				device.altuiid,
				(zindex ? " style='z-index:{0};' ".format(zindex) : "" )
				);
			// return "<img class='altui-device-icon pull-left rounded' data-org-src='/err' src='"+defaultIconSrc+"' alt='_todo_' "+(zindex ? "style='z-index:{0}'" : "")+" onerror='UIManager.onDeviceIconError(\""+device.altuiid+"\")' ></img>";
		// if there is a custom function, use it

// Rene Boer start
//		if (_devicetypesDB[ device.device_type ]!=null && _devicetypesDB[ device.device_type ].DeviceIconFunc!=null) {
//			return	Altui_ExecuteFunctionByName(_devicetypesDB[ device.device_type ].DeviceIconFunc, window, device);
		var dt = _devicetypesDB[_getDeviceDrawMapping(device)];
		if (dt!=null && dt.DeviceIconFunc!=null) {
			return	Altui_ExecuteFunctionByName(dt.DeviceIconFunc, window, device);
		}
// Rene Boer start

		//otherwise
		var iconPath = _getDeviceIconPath( device );
		var iconDataSrc = "";
		if (MultiBox.isRemoteAccess()) {
			iconDataSrc = IconDB.getIconContent( controller, iconPath, function(data) {
				$("img[data-org-src='"+iconPath+"']").attr('src',data);
			});
		}
		else
			iconDataSrc = iconPath;

		return "<img class='altui-device-icon pull-left rounded {4}' data-org-src='{0}' src='{1}' {3} alt='_todo_' onerror='UIManager.onDeviceIconError(\"{2}\")' ></img>".format(
			iconPath,
			iconDataSrc,
			device.altuiid,
			(isNullOrEmpty(onclick)) ? "" : "onclick='{0}'".format(onclick),
			(iconPath.substr(0,18)=="data:image/svg+xml") ? "altui-svg-marker" : ""
		);
		// return "<img class='altui-device-icon pull-left rounded' data-org-src='"+iconPath+"' src='"+iconDataSrc+"' alt='_todo_' onerror='UIManager.onDeviceIconError(\""+device.altuiid+"\")' ></img>";
	}

	function _deviceDraw(device) {
		var deviceHtml ="";

		// Perf optimization, get the function outside of the try
		function _internalDeviceDraw() {
			var id = device.altuiid;
			var iconHtml = _deviceIconHtml( device );
			var batteryHtml ="";
			var batteryLevel = MultiBox.getDeviceBatteryLevel(device);
			if (batteryLevel != null)
			{
				var color="danger";
				if (batteryLevel>=80)
					color = "success";
				else if (batteryLevel>=30)
					color = "info";
				else if (batteryLevel>=10)
					color = "warning";
				color = "bg-"+color;
				batteryHtml = ALTUI_Templates.batteryHtmlTemplate.format(batteryLevel,color);
			}

			if ( id /*&& ( (device.invisible == undefined) || (device.invisible ==false) )*/ )
			{
				var tooltip=[];
				$.each( device, function(key,val) {
					var typ = Object.prototype.toString.call(val);
					if ((typ!="[object Object]") && (typ!="[object Array]")){
						tooltip.push("{0}: {1}".format(key,val));
					}
				});
				tooltip = tooltip.join('\n');

				//
				// get ALTUI plugins definition,
				//
				var _devicetypesDB = MultiBox.getALTUITypesDB();	// master controller / Plugin information
				var devicetype = _getDeviceDrawMapping(device);
				var devicejson = device.device_json || ""

				var devicebodyHtml = "";
				var bFound = false
				$.each( [ devicetype+","+devicejson, devicetype], function(i,_devtype) {
					if (_devicetypesDB[ _devtype ]!=null && _devicetypesDB[ _devtype ].DeviceDrawFunc!=null) {
						devicebodyHtml+= Altui_ExecuteFunctionByName(_devicetypesDB[ _devtype ].DeviceDrawFunc, window, device);
						bFound = true;
						return false;
					}
				})
				if (bFound==false) {
					devicebodyHtml+= _defaultDeviceDraw(device);
				}

				// $("div.altui-device#"+id+" div.card-body" ).append(deviceHtml);
				var visibility = (device.tooltip && device.tooltip.display !=0 && device.status!=4)
				deviceHtml = ALTUI_Templates.devicecontainerTemplate.format(
					id,
					_enhancedDeviceTitle(device),
					tooltip,
					devicebodyHtml,
					UIManager.jobStatusToColor(device.status),
					device.altuiid,
					ALTUI_Templates.dropdownTemplate.format(
						device.altuiid,
						(device.invisible=="1") ? _T("Show") : _T("Hide")
					),
					batteryHtml,
					iconHtml,
					(visibility ? "d-block" : "d-none"),
					(visibility ? device.tooltip.tag2 : "")
					);
			}
		}
		function  _internalCatch(e) {
			deviceHtml += "<p>Error displaying device {0} - {1}</p>".format(device.altuiid, device.device_type);
			deviceHtml += "<p class='text-danger'>{0}</p>".format(e.message);
			if (e.stack) {
				$("footer").before("<pre>{0}</pre>".format(e.stack));
			}
		}
		try {
			_internalDeviceDraw(device)
		}
		catch (e) {
			_internalCatch(e)
		}
		return deviceHtml;
	};

	function _findSceneNextRun(scene) {
		var nextrun=0;
		if (scene.timers != undefined) {
			$.each( scene.timers , function(idx, timer) {
				nextrun = (nextrun==0) ? timer.next_run : Math.min(nextrun,timer.next_run);
			});
		}
		return isNaN(nextrun) ? 0 : nextrun;
	};

	function _sceneDraw(scene,norefresh) {

		var delButtonHtml = buttonTemplate.format( scene.altuiid, 'btn-sm altui-delscene pull-right', deleteGlyph,'default',_T("Delete"));
		var pauseButtonHtml = glyphTemplate.format( "power-off", _T("Pause Scene") , 'altui-pausescene ' + ((scene.paused>0) ? 'paused':'activated'));
		var favoriteHtml = (scene.favorite==true) ? starGlyph : staremtpyGlyph;
		var label = ((scene.hidden==true) ? hiddenGlyph+' ' : '') + scene.name;
		var modeStatusHtml =
			((scene.modeStatus == null) || (scene.modeStatus == "0"))
			? ""
			: $.map( scene.modeStatus.split(","),function(m) {
				var mode = _HouseModes[ parseInt(m)-1 ]
				return '<i class="fa {0}" aria-hidden="true" title="{1}"></i>'.format(mode.glyph,mode.text)
			} ).join(" ")


		var lastrun = (scene.last_run != undefined) ? okGlyph+" "+_toIso(new Date(scene.last_run*1000)).replace('T',' ') : '';
		var nextrun = _findSceneNextRun(scene);
		if (scene.paused && scene.paused==1) {
			nextrun = timeGlyph+" "+_T("Paused")
		} else {
			nextrun = (nextrun==0) ? '' : timeGlyph+" "+_toIso(new Date(nextrun*1000)).replace('T',' ');
		}

		var idDisplay = "<div class='pull-right text-muted'><small>#"+scene.altuiid+" </small></div>";
		var eyeMonitorHtml = ""	//custom ctrlable
			// (scene.status_mode=="continuous")
			// ? glyphTemplate.format( "eye", _T("Monitor Scene") ,"altui-scene-eyemonitor text-success" )
			// : glyphTemplate.format( "eye-slash", _T("Monitor Scene") ,"altui-scene-eyemonitor text-muted" )

		var scenecontainerTemplate = "";
		scenecontainerTemplate	+=	"<div class='card xxx altui-scene "+((norefresh==true) ? 'altui-norefresh': '') +"' id='{0}' data-altuiid='{0}'>"
		scenecontainerTemplate	+=	"<div class='card-header altui-scene-heading'>"+delButtonHtml +idDisplay+" <div class='card-title altui-scene-title' data-toggle='tooltip' data-placement='left' title='{1}'>"+pauseButtonHtml+favoriteHtml+eyeMonitorHtml+" <small class='altui-scene-title-name'>{1}</small> {3}</div></div>";
		scenecontainerTemplate	+=	"<div class='card-body altui-scene-body'>";
		scenecontainerTemplate	+= `
			<div class='d-flex'>
				<div class=' '>
					<div>{0}<span class='text-nowrap'> {4}</span></div>
					<div class='altui-scene-btnarea text-nowrap'>{1}{2}{3}</div>
				</div>
				<div class='ml-auto '>
					<div class='altui-scene-date text-muted text-wrap pull-right'><small>{5}</small></div>
					<div class='altui-scene-date text-info text-wrap pull-right'><small>{6}</small></div>
				</div>
			</div>
			`.format(
				buttonTemplate.format( scene.altuiid, 'btn-sm altui-runscene', _T("Run")+"&nbsp;"+runGlyph,'primary',_T("Run")),
				buttonTemplate.format( scene.altuiid, 'btn-sm altui-editscene ', wrenchGlyph,'light',_T("Settings")),
				buttonTemplate.format( scene.altuiid, 'btn-sm altui-clonescene', copyGlyph,'light',_T("Copy")),
				buttonTemplate.format( scene.altuiid, 'btn-sm altui-scene-history ', calendarGlyph,'light',_T("History")),
				modeStatusHtml,
				lastrun,
				nextrun)

		var tooltip = "";
		// var runButtonHtml = buttonTemplate.format( scene.altuiid, 'btn-sm altui-runscene', _T("Run")+"&nbsp;"+runGlyph,'primary',_T("Run"));
		// var editButtonHtml = buttonTemplate.format( scene.altuiid, 'btn-sm altui-editscene ', wrenchGlyph,'light',_T("Settings"));
		// var calendarHtml = buttonTemplate.format( scene.altuiid, 'btn-sm altui-scene-history ', calendarGlyph,'light',_T("History"));
		// var cloneButtonHtml = buttonTemplate.format( scene.altuiid, 'btn-sm altui-clonescene', copyGlyph,'light',_T("Copy"));
		var active = (scene.active==true) ? glyphTemplate.format( "check", _T("active") , 'text-success') : '';
		return scenecontainerTemplate.format(
			scene.altuiid, label, tooltip, active);
	};

	function _cameraDraw(device,size,zindex) // size:1,2,3,... 1=220px
	{
		var obj = null;
		// if (size==undefined)
			// size={
				// width: 220,
				// height:265
			// };

		if (device) {
			var directstreaming = MultiBox.getStatus( device, "urn:upnp-org:serviceId:altui1", "DirectStreamingURL2" ) || MultiBox.getStatus( device, "urn:micasaverde-com:serviceId:Camera1", "DirectStreamingURL" );
			var user = MultiBox.getStatus( device, "urn:micasaverde-com:serviceId:Camera1", "Username");
			var passwd = MultiBox.getStatus( device, "urn:micasaverde-com:serviceId:Camera1", "Password");
			var video = (MyLocalStorage.getSettings('ShowVideoThumbnail') || 0)==1;
			if (MultiBox.isRemoteAccess() || isNullOrEmpty(directstreaming) || isIE11() || (video==false) )
			{
				obj = $("<img></img>")
					.attr('src',"data_request?id=request_image&res=low&cam="+device.id+"&t="+ new Date().getTime())
					.css("max-width","100%")
					.css("max-width","100%")
					.css("width","100%")
					.css("height","100%")
					.css("z-index",(zindex ? zindex : 0))
					.attr("data-camera",device.altuiid);
				var timeout = null;
				function _resfreshIt(id) {
					var cam = $("img[data-camera='"+id+"']");
					if ($(cam).length>=1) {
						$(cam).attr('src',"data_request?id=request_image&res=low&cam="+device.id+"&t="+ new Date().getTime());
						timeout = setTimeout(function() { _resfreshIt(id); } , 1500 );
					}
				};
				timeout = setTimeout(function() { _resfreshIt(device.altuiid); } , 1500 );
			}
			else
			{
					var streamurl = "url(http://"+user+":"+passwd+"@"+device.ip+directstreaming+")";

				obj = $("<div ></div>") .css({
								"background-image": streamurl,
								"background-size": "contain",
								"background-repeat": "no-repeat"
							})
					.css("max-width","100%")
					.css("max-width","100%")
					.css("z-index",(zindex ? zindex : 0))
					// .css("width","100%")
					// .css("height","100%")
					.height((size!=undefined)&&(size.height!=undefined) ? size.height : 300)
					.width((size!=undefined)&&(size.width!=undefined)? size.width : Math.floor(300*640/480))
			}
		} else
			obj = $("<div >"+_T("Unknown Device")+"</div>");
		return obj.wrap( "<div></div>" ).parent().html();
	};

	function _fixHeight( domparent ) {
		// Because when you give absolute position to something, you take it out of the layout flow.
		// This means that its dimensions are no longer used to calculate its parent's height, among everything else
		var parentHeight = $(domparent).height();
		var maxHeight = 0;
		$(domparent).children().each( function(idx,elem) {
			// var p = $(elem).position();
			var height = $(elem).outerHeight();
			var top = parseInt($(elem).css('top'));
			if ($.isNumeric(top)==false)
				top=0;
			maxHeight = Math.max(maxHeight, top + height);
		});
		maxHeight+=15;	// bottom padding

		// Reposition error msg at the bottom
		$(domparent).find("pre.altui-err-msg").each( function(idx) {
			$(this).css( {top: maxHeight, position:'absolute'} );
			maxHeight += ($(this).outerHeight());	// this = PRE
		});
		$(domparent).height(maxHeight);
	};

	function _codifyName(name)
	{
		return name.replace(/:/g,"_").replace(/-/g,"_");
	};

	function  _deviceDrawControlPanelJSTab( device, tab, domparent ) {
		var devid = device.altuiid;

		$(domparent).addClass("altui-norefresh");	// javascript tabs are not refreshed

		var script = tab.ScriptName;
		if ( $.inArray( script, _forbiddenScripts) != -1)
			return;	// do not want UI5 tool pages !
		var func = tab.Function;
		set_JSAPI_context( {
			set_panel_html_callback: function(html) {
				$(domparent).html(html);
			},
			deviceid: device.id,
			altuiid: device.altuiid,
			controllerid: MultiBox.controllerOf(device.altuiid).controller,
		});

		try {
			var result = eval( func+"("+device.id+")" );	// we need the real VERA box ID here
		}
		catch(err) {
			set_panel_html("an error occurred while displaying the javascript tab. devid: "+devid+" err:"+err.message+" <pre>stack:"+err.stack+"</pre>");
		}
		// _fixHeight(domparent);
	};

	function  _deviceDrawControlPanelTab( device, tab, domparent ) {
		var devid = device.altuiid;
		function _prepareSceneGroupOffset( tab, control ) {
			var h = $("#cpanel_after_init_container").height() || 0;
			var offset={top:h, left:0 };
			return offset;
		};

		function _displayControl( domparent, device, control, idx, groupoffset ) {
			var paddingleft = parseInt($("#altui-device-controlpanel-"+devid).css("padding-left")) + (groupoffset.left || 0);
			var paddingtop = parseInt($("#altui-device-controlpanel-"+devid+" .card-body ").css("padding-top")) + (groupoffset.top || 0);
			switch(control.ControlType) {
				case "line_break":
				case "spacer":
					// no action to do for control panel, only for UI7 dashboard
					break;
				case 'color_temperature_picker':

					function _clamp( x, min, max ) {
						if(x<min){ return min; }
						if(x>max){ return max; }
						return Math.floor(x);
					};

					function _colorTemperatureToHex(kelvin){
						if (kelvin == 0) return null;
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

					function CT(kelvin){
						return _colorTemperatureToHex(kelvin);
					}

					function _getWDfromRGB(color) {
						var kelvin = 0;
						var selected = color;
						for (i=2000; i < 6550; i+=100) {
							if (CT(i) == selected) {
								kelvin = i;
								break;
							}
						}
						if (kelvin > 0) {
							var w = (kelvin < 5450)?Math.floor((kelvin-2000)/13.72):0;
							var d = (5450 < kelvin)?Math.floor((kelvin-5500)/13.72):0;
							var tgt = (w>0)? ("W"+w) : ( (d>0) ? ("D"+d) : "W0");
							return {kelvin: kelvin, target: tgt, W: w, D: d};
						}
						return {target: 0, W: 0, D: 0};
					}

					if (control.ControlCode == "color_warm") break;

					var current = MultiBox.getStatus(device,'urn:micasaverde-com:serviceId:Color1','TargetColor') || MultiBox.getStatus(device,'urn:micasaverde-com:serviceId:Color1','CurrentColor');
					if (current!=null) {
						var parts = current.split(",");	// 0=0,1=0,2=0,3=0,4=255
						var p0 = parseInt(parts[0].substring(2))||0;
						var p1 = parseInt(parts[1].substring(2))||0;
						if (p0>0) {
							current = Math.floor((((2000 + (13.5 * p0)) / 100) + 0.5)) * 100;
						} else if (p1>0) {
							current = Math.floor((((5500 + (13.5 * p1)) / 100) + 0.5)) * 100;
							if (current > 6500) current = 6500;
						} else
							current = 0;
					} else
						current=0;

					var top = paddingtop + (control.Display.Top || 0);
					var left = paddingleft	+ (control.Display.Left || 0);
					var domobj = $("<div class='' style='top:{2}px; left:{3}px;' ><input title='{4}' id='altui-colorpicker-{0}'	 value='{1}'></input></div>"
						.format(device.altuiid,current,top,left,control.Label && control.Label.text || ""))
						.appendTo( $(domparent) );

					$(domobj).find("input").spectrum({
						showPaletteOnly: true,
						showPalette:true,
						hideAfterPaletteSelect:true,
						color: CT(current),
						palette: [
							[CT(2000), CT(2100), CT(2200),CT(2300), CT(2400),
							CT(2500), CT(2600), CT(2700),CT(2800), CT(2900),
							CT(3000), CT(3100), CT(3200),CT(3300), CT(3400),
							CT(3500), CT(3600), CT(3700),CT(3800), CT(3900),
							CT(4000), CT(4100), CT(4200),CT(4300), CT(4400),
							CT(4500), CT(4600), CT(4700),CT(4800), CT(4900),
							CT(5000), CT(5100), CT(5200),CT(5300), CT(5400),
							CT(5500), CT(5600), CT(5700),CT(5800), CT(5900),
							CT(6000), CT(6100), CT(6200),CT(6300), CT(6400),
							CT(6500)]
						],
						preferredFormat: 'hex',
						replacerClassName: 'altui-colorpicker-replacer',
					});
					$(domobj).css({
							top: top,
							left: left,
							position:'absolute'})
						// .width(control.Display.Width)
						// .height(control.Display.Height);
					$(domobj).on('change',"input", function(e,color) {
						var params={};
						var CT = _getWDfromRGB(color.toHexString());
						params[control.Command.ActionArgumentName]="{0}".format(CT.target)
						MultiBox.runAction( device, control.Command.Service, control.Command.Action, params, null );
						// MultiBox.setColor(device,val);
						var currentColor = '0={0},1={1},2=0,3=0,4=0'.format(CT.W,CT.D);
						MultiBox.setStatus(device,'urn:micasaverde-com:serviceId:Color1','CurrentColor',currentColor);
					});
					break;
				case 'color_picker': {
					var current = MultiBox.getStatus(device,'urn:micasaverde-com:serviceId:Color1','TargetColor') || MultiBox.getStatus(device,'urn:micasaverde-com:serviceId:Color1','CurrentColor');
					if (current!=null) {
						var parts = current.split(",");	// 0=0,1=0,2=0,3=0,4=255
						var p2 = parseInt(parts[2].substring(2))||0;
						var p3 = parseInt(parts[3].substring(2))||0;
						var p4 = parseInt(parts[4].substring(2))||0;
						current = rgbToHex(
							parseInt(p2),
							parseInt(p3),
							parseInt(p4)
							);
					} else
						current="#ffffff";
					var top = paddingtop + (control.Display.Top || 0);
					var left = paddingleft	+ (control.Display.Left || 0);
					var domobj = $("<div class='' style='top:{2}px; left:{3}px;' ><input title='{4}' id='altui-colorpicker-{0}'	 value='{1}'></input></div>"
						.format(device.altuiid,current,top,left,control.Label && control.Label.text || ""))
						.appendTo( $(domparent) );

					$(domobj).find("input").spectrum({
						preferredFormat: 'hex',
						replacerClassName: 'altui-colorpicker-replacer',
					});
					$(domobj).css({
							top: top,
							left: left,
							position:'absolute'})
						// .width(control.Display.Width)
						// .height(control.Display.Height);
					$(domobj).on('change',"input", function(e,color) {
						var params={};
						params[control.Command.ActionArgumentName]="{0},{1},{2}".format(parseInt(color._r),parseInt(color._g),parseInt(color._b))
						MultiBox.runAction( device, control.Command.Service, control.Command.Action, params, null );
						// MultiBox.setColor(device,val);
						var currentColor = '0=0,1=0,2={0},3={1},4={2}'.format(parseInt(color._r),parseInt(color._g),parseInt(color._b));
						MultiBox.setStatus(device,'urn:micasaverde-com:serviceId:Color1','CurrentColor',currentColor);
					});
					break;
				};
				case "label": {
					$( "<p>"+control.Label.text+"</p>" )
						.appendTo( $(domparent) )
						.css({
							top: paddingtop + (control.Display.Top || 0),
							left: paddingleft  + (control.Display.Left || 0),
							position:'absolute'})
						// .width(control.Display.Width)
						.height(control.Display.Height);
					break;
				};
				case "input": {
					$( "<input id='{0}'></input>".format(control.ID))
						.appendTo( $(domparent) )
						.css({
							top: paddingtop + (control.Display.Top || 0),
							left: paddingleft  + (control.Display.Left || 0),
							position:'absolute'})
						.width(control.Display.Width)
						.height(control.Display.Height);
					break;
				};
				case "variable": {
					// Width is ignored on UI5
					$( "<p>{0}</p>".format( MultiBox.getStatus( device, control.Display.Service, control.Display.Variable ) || "" ))
						.appendTo( $(domparent) )
						.css({
							top: paddingtop + (control.Display.Top || 0),
							left: paddingleft  + (control.Display.Left || 0),
							position:'absolute'})
						// .width(control.Display.Width)
						.height(control.Display.Height);
					break;
				};
				case "multi_state_button": {
					var value1 = MultiBox.getStatus( device, control.states[0].Display.Service, control.states[0].Display.Variable );
					var value2 = MultiBox.getStatus( device, control.states[1].Display.Service, control.states[1].Display.Variable );
					var armedValue1 = control.states[0].Display.Value;
					var armedValue2 = control.states[1].Display.Value;
					var bInverted = false; //(armedValue2>armedValue1);
					var csvlabel = (bInverted ? "{1},{0}" : "{0},{1}").format( control.states[1].Label.text,control.states[0].Label.text);
					var onoff = (bInverted ? (value2==armedValue2): (value1==armedValue1) );
					if (device.device_type == "urn:schemas-upnp-org:device:DimmableLight:1")		// special case ! VERA is not following the JSON file here
						onoff = parseInt(MultiBox.getStatus( device, 'urn:upnp-org:serviceId:SwitchPower1', 'Status' ));
					var uniqid = devid+"-"+idx;
					var html=ALTUI_PluginDisplays.createOnOffButton(onoff , "altui-device-msb-"+uniqid , csvlabel);
					var obj = $(html);
					obj .appendTo( $(domparent) )
						.css({ position:'absolute' });
					if (control.Display) {
						if (control.Display.Height)
							obj.height(control.Display.Height);
						if (control.Display.Width)
							obj.width(control.Display.Width);
						obj.css( { top: paddingtop + (control.Display.Top || 0) } );
						obj.css( { left: paddingleft + (control.Display.Left || 0) } );
					}
					$("div#altui-device-msb-"+uniqid).off('click touchend');
					$("div#altui-device-msb-"+uniqid).on('click touchend',function() {
						var state = (bInverted) ? control.states[1] : control.states[0];
						ALTUI_PluginDisplays.toggleButton(devid, "div#altui-device-msb-"+uniqid, state.Display.Service, state.Display.Variable, function(id,newval) {
							var parameters = {};
							var whichone = (bInverted) ? newval : 1-newval;
							// parameters[ control.states[whichone].Command.Parameters[0].Name ] = control.states[whichone].Command.Parameters[0].Value;
							$.each( control.states[whichone].Command.Parameters || [], function( idx, param ) {
								parameters[ param.Name ] = param.Value;
							});
							MultiBox.runAction( device,
								control.states[whichone].Command.Service, control.states[whichone].Command.Action,
								parameters );
						});
					});

					break;
				};
				case "button": {
					if (control.Display)
					{
						var bActif = false;
						if (control.Display.Service && control.Display.Variable) {
							var valueToMatch = control.Display.Value || 1 ;
							var valueNow = MultiBox.getStatus( device, control.Display.Service, control.Display.Variable )
							bActif = (valueToMatch==valueNow);
						}
						var button = $( "<button type='button' class='btn btn-sm btn-{1} altui-controlpanel-button'>{0}</button>".format(control.Label.text, bActif ? 'primary' : 'secondary'))
							.appendTo( $(domparent) );

						control.Display.Width = Math.max( control.Display.Width || 10 , $(button).outerWidth() );
						if ((control.Display.Top!=undefined && control.Display.Left!=undefined) /*|| (groupoffset.top && groupoffset.left)*/){
							button.css({
									top: paddingtop + (control.Display.Top	|| 0),
									left: paddingleft  + (control.Display.Left	|| 0),
									"min-width": control.Display.Width+"px",	// forcing bootstrap
									"max-width": control.Display.Width+"px",	// forcing bootstrap
									"z-index" : "10",
									position:'absolute'
									});
						}
						else {
							button.css({
									top: paddingtop ,
									left: paddingleft ,
									"min-width": control.Display.Width+"px",	// forcing bootstrap
									"max-width": control.Display.Width+"px",	// forcing bootstrap
									"margin-top": "5px",
									"margin-left": "10px",
									"margin-right": "10px",
									"margin-bottom": "5px",
									"z-index" : "10",
									position:'relative'
									})

									.addClass('pull-left');
						}
						button
							.width(control.Display.Width)
							// .height(control.Display.Height)
							.click( function() {
								//"Command":{"Service":"urn:a-lurker-com:serviceId:InfoViewer1","Action":"SetParameters","Parameters":[{"Name":"newLuaPattern","ID":"thePattern"}]}}
								var parameters = {};
								$.each(control.Command.Parameters || [], function(idx,param) {
									if (param.Value )
										parameters[ param.Name ] = param.Value;
									if (param.ID)
										parameters[ param.Name ] = $(domparent).find("#"+param.ID).val();
								});
								MultiBox.runAction( device, control.Command.Service, control.Command.Action, parameters, null );
							});
					}
					else {
						//UI5 does not display button
					}
					break;
				};
				case "slider": {
					var val = MultiBox.getStatus( device, control.Display.Service, control.Display.Variable ) || 0;
					var uniqid = devid+"-"+idx;
					var symbol = control.LabelSymbol ? control.LabelSymbol.text : '';
					$("<div id='altui-slider-horizontal-value-"+uniqid+"' class=''></div>")
						.html( val+symbol )
						.appendTo( $(domparent) )
						.css({
							top: paddingtop + control.Display.Top,
							left:  paddingleft + control.Display.Left,
							position:'absolute'})
						// .width(control.Display.Width)
						.height(30 /*control.Display.Height*/ );

					var obj = $("<div id='altui-slider-horizontal-"+uniqid+"'></div>")
						.appendTo( $(domparent) )
						.css({
							top: paddingtop + control.Display.Top+30,
							left: paddingleft + control.Display.Left,
							position:'absolute'})
						.width(control.Display.Width)
						// .height(control.Display.Height );

						obj.slider( {
						  // range: "min",
						  min: parseFloat(control.Display.MinValue || 0 ),
						  max: parseFloat(control.Display.MaxValue || 100),
						  value: val ,
						  step: 0.1,
						  slide: function( event, ui ) {
							$("#altui-slider-horizontal-value-"+uniqid).html(ui.value+symbol);
						  },
						  change: function( event, ui ) {
							var params={};
							// OLD code
							// params[ control.Command.Parameters[0].Name ] = ui.value;
							// NEW code
							$.each( control.Command.Parameters || [], function( idx, param ) {
								if (param.Value)
									params[ param.Name ] = param.Value
								if (param.ID)
									params[ param.Name ] = ui.value
							});
							MultiBox.runAction( device, control.Command.Service, control.Command.Action, params, null );
						  }
						});
					break;
				};
				case "slider_vertical": {
					function _onClickSlider(event) {
						$(this).closest(".altui-device-controlpanel").addClass("altui-norefresh");
						var uniqid = event.data.uniqid;
						var control = event.data.control;
						var htmlid = "altui-slider-vertical-value-"+uniqid;
						var val = $(this).text();	// it is a div
						var cls = $(this).attr('class');
						var style = $(this).attr('style') + ' width:50px; ';
						$(this).hide();
						$("input#"+htmlid).val( val).show().focus();
					};
					function _displaySliderValue(uniqid,control,val) {
						var color = control.ControlCode == "heating_setpoint" ? "text-danger" : "text-primary";
						var htmlid = "altui-slider-vertical-value-"+uniqid;
						$("<div id='"+htmlid+"' class='"+color+"'>"+val+"</div>")
							.appendTo( $(domparent) )
							.css({
								top: paddingtop + control.Display.Top,
								left: paddingleft + control.Display.Left,
								position:'absolute'})
							// .width(control.Display.Width)
							.height(20 /*control.Display.Height*/ )		// height given by class on UI5
							.click( {uniqid:uniqid, control:control},_onClickSlider);
						$("<input required id='"+htmlid+"' type='number' step='"+1/10+"' value='' />")
							.appendTo( $(domparent) )
							.css({
								top: paddingtop + control.Display.Top,
								left: paddingleft + control.Display.Left,
								position:'absolute'})
							// .width(control.Display.Width)
							.height(25 /*control.Display.Height*/ )		// height given by class on UI5
							.width(50)
							.hide()
							.change( function() {
								var val = $(this).val();
								var htmlid = $(this).prop('id');
								$("div#"+htmlid).text(val).show();
								$("div#altui-slider-vertical-"+uniqid).slider("value", val*10 );
								$("input#"+htmlid).hide();	// toggle both DIV and INPUT
								$(this).closest(".altui-device-controlpanel").removeClass("altui-norefresh");
							});
					};

					// {"ControlGroup":"6","ControlType":"slider_vertical","top":"0","left":"3.5","ControlPair":"1","ID":"NewCurrentSetpointCool","Style":"numeric","Display":{"Service":"urn:upnp-org:serviceId:TemperatureSetpoint1_Cool","Variable":"CurrentSetpoint","Top":30,"Left":570,"Width":100,"Height":20},"Command":{"Service":"urn:upnp-org:serviceId:TemperatureSetpoint1_Cool","Action":"SetCurrentSetpoint","Parameters":[{"Name":"NewCurrentSetpoint","ID":"NewCurrentSetpointCool"}]},"ControlCode":"cooling_setpoint"}
					var val = MultiBox.getStatus( device, control.Display.Service, control.Display.Variable );
					var uniqid = devid+"-"+idx;
					_displaySliderValue(uniqid,control,val)


					$("<div id='altui-slider-vertical-"+uniqid+"'></div>")
						.appendTo( $(domparent) )
						.css({
							top: paddingtop + control.Display.Top+30,
							left: paddingleft + control.Display.Left,
							position:'absolute'})
						// .width(control.Display.Width)
						.height(65 /*control.Display.Height*/ )		// height given by class on UI5
						.slider( {
						  orientation: "vertical",
						  range: "min",
						  min: parseFloat(control.Display.MinValue*10 || 0 ),
						  max: parseFloat(control.Display.MaxValue*10 || 1000),
						  step: parseFloat(control.Display.Step*10 || 1),
						  value: val*10 ,
						  slide: function( event, ui ) {
							$("#altui-slider-vertical-value-"+uniqid).text(ui.value/10);
							// $( "#amount" ).val( ui.value );
						  },
						  change: function( event, ui ) {
							var params={};
							// OLD code : params[ control.Command.Parameters[0].Name ] = ui.value/10;
							$.each( control.Command.Parameters || [], function(idx,param) {
								if (param.Value )
									params[ param.Name ] = param.Value;
								if (param.ID ) // imperfect, but generally works
									params[ param.Name ] = ui.value/10;
							});
							MultiBox.runAction( device, control.Command.Service, control.Command.Action, params, null );
						  }
						});
					break;
				};
				case "image_player": {
					var label = ""
					switch( control.ControlCode ) {
						case "camera_up":
							label = glyphTemplate.format( "triangle-top", _T(control.Label.text) , 'text-default')
							break;
						case "camera_down":
							label = glyphTemplate.format( "triangle-bottom", _T(control.Label.text) , 'text-default')
							break;
						case "camera_left":
							label = glyphTemplate.format( "triangle-left", _T(control.Label.text) , 'text-default')
							break;
						case "camera_right":
							label = glyphTemplate.format( "triangle-right", _T(control.Label.text) , 'text-default')
							break;
						case "camera_zoom_in":
							label = glyphTemplate.format( "zoom-in", _T(control.Label.text) , 'text-default')
							break;
						case "camera_zoom_out":
							label = glyphTemplate.format( "zoom-out", _T(control.Label.text) , 'text-default')
							break;
						default:
							label = control.Label.text;
					}

					var button = $( "<button type='button' class='btn btn-sm btn-{1} altui-controlpanel-button'>{0}</button>".format(label, 'light'))
						.appendTo( $(domparent) );

					// control.Display.Width = $(button).outerWidth();
					control.Display.Width = Math.max( 20 , $(button).outerWidth() );
					if ((control.Display.Top!=undefined && control.Display.Left!=undefined) /*|| (groupoffset.top && groupoffset.left)*/){
						button.css({
								top: paddingtop + (control.Display.Top	|| 0),
								left: paddingleft  + (control.Display.Left	|| 0),
								// "min-width": control.Display.Width+"px",	// forcing bootstrap
								// "max-width": control.Display.Width+"px",	// forcing bootstrap
								"z-index" : "10",
								position:'absolute'
								});
					}
					else {
						button.css({
								top: paddingtop ,
								left: paddingleft ,
								// "min-width": control.Display.Width+"px",	// forcing bootstrap
								// "max-width": control.Display.Width+"px",	// forcing bootstrap
								"margin-top": "5px",
								"margin-left": "10px",
								"margin-right": "10px",
								"margin-bottom": "5px",
								"z-index" : "10",
								position:'relative'
								})
								.addClass('pull-left');
					}
					button.width(control.Display.Width)
							.click( function() {
								//"Command":{"Service":"urn:a-lurker-com:serviceId:InfoViewer1","Action":"SetParameters","Parameters":[{"Name":"newLuaPattern","ID":"thePattern"}]}}
								var parameters = {};
								$.each(control.Command.Parameters || [], function(idx,param) {
									if (param.Value )
										parameters[ param.Name ] = param.Value;
									if (param.ID)
										parameters[ param.Name ] = $(domparent).find("#"+param.ID).val();
								});
								MultiBox.runAction( device, control.Command.Service, control.Command.Action, parameters, null );
							});
					break;
				};
				case "image": {
					//{"ControlGroup":"3","ControlType":"image","top":"0","left":"0","Display":{"url":"?id=request_image&cam=","Top":0,"Left":0,"Width":320,"Height":240}}
					var container = $(domparent).parents(".altui-device-controlpanel-container").addClass("altui-norefresh");
					var user = MultiBox.getStatus( device, "urn:micasaverde-com:serviceId:Camera1", "Username");
					var passwd = MultiBox.getStatus( device, "urn:micasaverde-com:serviceId:Camera1", "Password");
					var directstreaming = MultiBox.getStatus( device, "urn:upnp-org:serviceId:altui1", "DirectStreamingURL2" ) || MultiBox.getStatus( device, "urn:micasaverde-com:serviceId:Camera1", "DirectStreamingURL" );
					if (MultiBox.isRemoteAccess() || isNullOrEmpty(directstreaming) || isIE11() ) {
						var img = $("<img></img>")
							.appendTo($(domparent))
							.css({
								top: paddingtop + (control.Display.Top || 0),
								left: paddingleft + (control.Display.Left || 0),
								position:'absolute'})
							// .attr('src',control.Display.url+device.id+"'&t="+ new Date().getTime())
							.attr('src',control.Display.url+device.id)
							.attr('data-camera',device.altuiid)
							.height(280)
							.width(370);
							// .height(control.Display.Height)
							// .width(control.Display.Width);
						var timeout = null;
						function _refreshIt(id) {
							var cam = $("img[data-camera='"+id+"']");
							if ( $(cam).length>=1 ) {
								img.attr('src',control.Display.url+device.id+"&t="+ new Date().getTime());
								setTimeout( function() { _refreshIt(id); }, 1500 );
							}
						};
						timeout = setTimeout( function() { _refreshIt(device.altuiid); }, 1500 );
					} else {
						var streamurl = "url(http://"+user+":"+passwd+"@"+device.ip+directstreaming+")";
						var div = $("<div></div>")
							.appendTo($(domparent))
							.css({
								top: paddingtop + control.Display.Top,
								left: paddingleft + control.Display.Left,
								"background-image": streamurl,
								"background-size": "contain",
								"background-repeat": "no-repeat",
								position:'absolute'})
							.height(280)
							.width(370);
							// .height(control.Display.Height)
							// .width(control.Display.Width);
					}
					break;
				};
				case 'spinner_horizontal':

					var val = MultiBox.getStatus( device, control.Display.Service, control.Display.Variable );
					var symbol=''
					var current = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:TemperatureSensor1', 'CurrentTemperature');
					if (isNullOrEmpty(current)==false) {
						symbol = (' / ' + current )
					}
					var uniqid = devid+"-"+idx;
					//var symbol = control.LabelSymbol ? control.LabelSymbol.text : '';

					$.extend( true, control.Display, {MinValue:-10, MaxValue:100, Step:0.5}, control.Display )	// ensure defaults
					var html = `
					<div id='altui-spinner_horizontal-{0}' class=''>
						<div id='altui-spinner_horizontal-val-{0}'>{1}</div>
						<div class="btn-group btn-group-sm" role="group" aria-label="Set Buttons">
						  <button type="button" class="btn btn-outline-secondary" id='altui-spinner_horizontal-down-{0}'>{2}</button>
						  <button type="button" class="btn btn-outline-secondary" id='altui-spinner_horizontal-up-{0}'>{3}</button>
						</div>
					</div>`.format(uniqid, val+symbol, downGlyph, upGlyph)
					$(html)
						.appendTo( $(domparent) )
						.css({
							top: paddingtop + control.Display.Top,
							left:  paddingleft + control.Display.Left,
							position:'absolute'})
						.width(control.Display.Width)
						.height(control.Display.Height);
					$("#altui-spinner_horizontal-"+uniqid).off()
					.on("click", 'div#altui-spinner_horizontal-val-'+uniqid, function() {
						var txt = parseFloat($(this).text())
						$(this).replaceWith("<input id='altui-spinner_horizontal-val-{0}' class='form-control form-control-sm' value='{1}' type='number' pattern='[0-9]+([\.,][0-9]+)?' step='{2}' min='{3}' max='{4}'></input>"
							.format(uniqid,txt,control.Display.Step,control.Display.MinValue ,control.Display.MaxValue)
						)
						$("#altui-spinner_horizontal-val-"+uniqid).focus()
					})
					.on('focusout',"input#altui-spinner_horizontal-val-"+uniqid, function() {
						var val = parseFloat($(this).val())
						$(this).replaceWith("<div id='altui-spinner_horizontal-val-{0}'>{1}</div>".format(uniqid,val+symbol))
						var parameters = {}
						parameters[ control.Command.ActionArgumentName ] = val;
						MultiBox.runAction( device, control.Command.Service, control.Command.Action, parameters, null );
					});
					$("#altui-spinner_horizontal-down-"+uniqid).click( function() {
						var val = parseFloat(MultiBox.getStatus( device, control.Display.Service, control.Display.Variable ));
						val = Math.max(control.Display.MinValue, val-control.Display.Step);
						var parameters = {}
						parameters[ control.Command.ActionArgumentName ] = val;
						MultiBox.runAction( device, control.Command.Service, control.Command.Action, parameters, null );
						$('#altui-spinner_horizontal-val-'+uniqid).html(val+symbol);
						// alert('down');
					});
					$("#altui-spinner_horizontal-up-"+uniqid).click( function() {
						var val = parseFloat(MultiBox.getStatus( device, control.Display.Service, control.Display.Variable ));
						val = Math.min(control.Display.MaxValue,val+control.Display.Step);
						var parameters = {}
						parameters[ control.Command.ActionArgumentName ] = val;
						MultiBox.runAction( device, control.Command.Service, control.Command.Action, parameters, null );
						$('#altui-spinner_horizontal-val-'+uniqid).html(val+symbol);
						// alert('up');
					});
					break;
				default: {
					if (AltuiDebug.IsDebug())
						$(domparent).append("<pre class='altui-err-msg'>Unknown control type:"+control.ControlType+". See Debug</pre>");
				};
			};
		};

		$(domparent).css({position: 'relative'});
		if (tab.TabType=="flash") {
			if (tab.AfterInit && tab.AfterInit.Function) {
				$(domparent).prepend('<div id="cpanel_after_init_container" class="col-12"><div>')

				var script = tab.AfterInit.ScriptName;
				// only if script is not forbidden
				if ( $.inArray( script, _forbiddenScripts) == -1) {
					var func = tab.AfterInit.Function;

					set_JSAPI_context( {
						set_panel_html_callback: function(html) {
							$(domparent).find('#cpanel_after_init_container').html(html);
						},
						deviceid: device.id,
						altuiid: device.altuiid,
						controllerid: MultiBox.controllerOf(device.altuiid).controller,
					});

					try {
						// this will call the set_panel_html_callback() callback
						var result = eval( func+"("+device.id+")" );	// we need the real VERA box ID here
					}
					catch(err) {
						set_panel_html("an error occurred while displaying the javascript tab. devid: "+devid+" err:"+err.message+" <pre>stack:"+err.stack+"</pre>");
					}
				}
			}
			$(domparent).append('<div id="cpanel_controls_container" class="col-12"><div>')
			var newparent = $(domparent).find("#cpanel_controls_container")

			$.each( tab.Control, function (idx,control) {
				var offset = _prepareSceneGroupOffset( tab, control );
				_displayControl( newparent, device, control, idx, offset );
			});
			// fix height because absolute positioning removes element from the DOM calculations
			_fixHeight( newparent );
		}

		// fix height because absolute positioning removes element from the DOM calculations
		// _fixHeight( domparent );

	};

	function _deviceDrawControlPanelOneTabContent(device, parent, tabidx ) {
		// Allways master controller for customer javascript functions, so 0!
		var _altuitypesDB = MultiBox.getALTUITypesDB();		// Master controller number 0
		var dt = _altuitypesDB[_getDeviceDrawMapping(device)];

		var funcnames = null;
		if (dt && dt.ControlPanelFunc!=null) {
			funcnames = dt.ControlPanelFunc.split(",")	// csv string, per each tab idx ( from 0 (altui) to n (vera)
		}
		if ( funcnames && funcnames[tabidx] && funcnames[tabidx].length>0 ) {
			// for ANY tab, if the function name is specified in ControlPanelFunc as csv like func_for_tab0,func_for_tab1,func_for_tab2,...
			Altui_ExecuteFunctionByName(funcnames[tabidx], window, device, parent);
			// _fixHeight( parent );
		} else {
			// only if it is a VERA tab	 (tabidx>0) then fallback plan is to use JSON definition
			if (tabidx>0) {
				var ui_static_data = MultiBox.getDeviceStaticData(device);
				if (ui_static_data!=null) {
					var tab = ui_static_data.Tabs[tabidx-1];
					if ((tab.TabType!="javascript") || ( $.inArray( tab.ScriptName, _forbiddenScripts) == -1))	{
						if ( tab.TabType=="flash") {
							_deviceDrawControlPanelTab( device, tab, parent );		// row for Flash Panel
						} else {
							_deviceDrawControlPanelJSTab( device, tab, parent );
						}
					}
				}
			}
		}
	};

	function _setActiveDeviceTabIdx( idx) {
		$("#altui-devtab-tabs li").removeClass('active');
		if (idx!=null)
			$("li#altui-devtab-"+idx).find("a").tab('show');
		else
			$("li#altui-devtab-0").find("a").tab('show');
	};

	function _getActiveDeviceTabIdx() {
		var obj = $("#altui-devtab-tabs a.active");
		if (obj.length ==0)
			return null;
		var pagename = obj.parent().prop('id');
		return pagename.substring( "altui-devtab-".length);
	};

	function _displayActiveDeviceTab(activeTabIdx, device, domparent) {
		if ($(domparent).hasClass("altui-norefresh")==false) {
			$(domparent).html("");
			_deviceDrawControlPanelOneTabContent(device, domparent, activeTabIdx );
		}
	};

	function _findCurrentValue(getelemstbl,varnum) {
		var number = varnum.split("-")[0]
		for (var i=0;i<getelemstbl.length;i+=2) {
			if (getelemstbl[i]==number)
				return getelemstbl[i+1];
		};
		return null;
	};
	function _displayConfigVariable( device,varnum,lengthtype,value, current ) {
		var options = [
			{val : 'm', text: 'monitor only'},
			{val : 'd', text: 'default'},
			{val : '1h', text: '1 byte hex'},
			{val : '1d', text: '1 byte dec'},
			{val : '2h', text: '2 byte hex'},
			{val : '2d', text: '2 byte dec'},
			{val : '4h', text: '4 byte hex'},
			{val : '4d', text: '4 byte dec'},
		];
		var sel = $("<select id='altui-deviceconfig-select-{0}' class='form-control form-control-sm'></select>".format(varnum));
		$(options).each(function(idx) {
			var opt = $("<option>").attr('value',this.val).text(this.text);
			if (this.val == lengthtype)
				opt.attr('selected','selected');
			var tmp = sel.append(opt);
		});
		var html ="";
		var re = /(\d*)-(.*)/;
		var str = varnum.toString();
		var m;

		if ((m = re.exec(str)) !== null) {
			if (m.index === re.lastIndex) {
				re.lastIndex++;
			}
			// View your result using the m-variable.
			// eg m[0] etc.
		}
		else {
			m = ["",varnum];
		}
		html += "<tr>";
		html += "<td>";
		html += "<div class=''><small>{0}</small></span></div>".format( m[2] || "" )
		html += "</td>";
		html += "<td>";
		html += "<div class='form-row'><input required type='number' min='1' class='col-4 form-control form-control-sm' value='{0}'></input>".format( m[1] || "" );
		html += smallbuttonTemplate.format( 'altui-deletevar-'+varnum, 'altui-delete-variable', deleteGlyph ,'Delete');
		html += '<div class="invalid-feedback">{0}</div>'.format(_T("Enter a valid variable number"))
		html += "</div></td>";
		html += "<td>";
		html += $("<div></div>").append(sel).html();
		html += "</td>";
		html += "<td>";
		html += "<div class='col-6'><input type='number' class='form-control form-control-sm' value='{0}'></input></div>".format(value || "");
		html += "</td>";
		html += "<td>";
		html += "<div class='col-6'>{0}</div>".format(current || "");
		html += "</td>";
		html += "</tr>";
		return html;
	};
	function _deviceDrawControlPanel( device, container ) {
		var controller = MultiBox.controllerOf(device.altuiid).controller;
		function _decodeVersion(s) {
			//There are 5 values: Z-Wave Library Type, Z-Wave Protocol Version, Z-Wave Protocol Sub Version, Application Version, Application Sub Version
			var splits = s.split(",")
			var strings=[]
			strings.push("Library Type:"+ALTUI_zWaveLibraryType[splits[0]])
			strings.push("zWave Protocol Major,Minor: {0},{1}".format( splits[1],splits[2] ))
			strings.push("Application Major,Minor: {0},{1}".format( splits[3],splits[4] ))
			return "<ul><li>"+strings.join("</li><li>")+"</li></ul>"
		}
		function _decodeNodeInfo(value,device) {
			var capabilities = MultiBox.getStatus( device, "urn:micasaverde-com:serviceId:ZWaveDevice1", "Capabilities");
			capabilities = capabilities.split("|")[1]
			var strings=[]
			$.each(capabilities.split(","), function(i,v) {
				if (v!="") {
					var cap_ver = v.split(':')
					var key = toHex(cap_ver[0])
					if ( (cap_ver.length>1) && (cap_ver[1]!="0") && (cap_ver[1]!="1") )
						key += ("_V"+cap_ver[1])
					strings.push("<li>0x{1}-{0}</li>".format(ALTUI_zWaveCommandClass[key] || _T("Unknown Class") , key))
				}
			});
			return "<ul>{0}</ul>".format(strings.join(""));
		}
		function _decodeCapabilities(value) {
			var parts = value.split("|")
			var splits = parts[0].split(",")
			var strings=[]
			//The first six numbers in capabilities are reported by the ZWave ZW_GetNodeProtocolInfo function (0x41):
			var str = []
			var labels = [
				"Capability",
				"Security",
				"Reserved",
				"Basic Device Class",
				"Generic Device Class",
				"Specific Device Class"
			]
			if (parseInt(splits[0])<128)
				strings.push("Battery Operated, wakes up occasionally")
			var i=0
			for (i=0; i<3; i++) {
				str.push("{0} ({1})".format(labels[i],splits[i]))
			}
			str.push("{0}: {1}".format(labels[3],"{0} ({1})".format(ALTUI_BasicType[ toHex(splits[3]) ],splits[3])) )
			var zwtype = ALTUI_GenericSpecificType[toHex(splits[4])]
			str.push( "{0}: {1}".format(labels[4], "{0} ({1})".format(zwtype.gt,splits[4])) )
			str.push( "{0}: {1}".format(labels[5], "{0} ({1})".format(zwtype.st[toHex(splits[5])],splits[5])) )
			for (i=6; i<splits.length; i++ ) {
				if (splits[i]!="") {
					switch(splits[i]) {
						case "L":
							str.push("Listens");break;
						case "R":
							str.push("Routes");break;
						case "B":
							str.push("Beams");break;
						case "RS":
							str.push("Routing Slave");break;
						case "W1":
							str.push("Requires beaming");break;
						default: {
							str.push("Unk flag:{0}".format(splits[i]));break;
						}
					}
				}
			}
			strings.push("ZW_GetNodeProtocolInfo: {0}<ul><li>".format(parts[0])+str.join("</li><li>")+"</li></ul>")
			strings.push("Extra:"+parts[1])
			return "<ul><li>"+strings.join("</li><li>")+"</li></ul>"
		}
		function _decodeManufacturor(value) {
			var splits = value.split(",")
			var str=[]
			var manuf = toHex2(splits[0])
			var ptype = toHex2(splits[1])
			var pid = toHex2(splits[2])
			str.push("{0}: {1} - 0x{2}".format(ALTUI_Manufacturor[ manuf  ] || "Unknown",splits[0],manuf ))
			str.push("Product Type: {0} - 0x{1}".format(splits[1] , ptype ))
			str.push("Product ID: {0} - 0x{1}".format(splits[2] , pid ))
			return "<ul><li>"+str.join("</li><li>")+"</li></ul>"
		}
		function _decodeZWDB(device,zwdbdata) {
			var devid = device.altuiid;
			var html = "";
			html += "<form class='form form-row' id='altui-zwdb-form'>";
			var longfields = ["decription","overview","inclusion","exclusion"]
			$.each( zwdbdata, function(key,val) {
				if ((val!=undefined) && ($.inArray(key,longfields)==-1)) {
					var typ = Object.prototype.toString.call(val);
					if ((typ!="[object Object]") && (typ!="[object Array]")){
						html += "<div class='col-sm-6 col-md-4 col-lg-3 col-xl-2'>";
						html += "<div class='form-group'>";
						html += "<label class='font-weight-bold' for='"+key+"'>"+key+"</label>";
						html += _enhanceEditorValue(key,val,devid)
						// html += "<input id='"+key+"' data-altuiid='"+devid+"' class='form-control' value='"+val+"'></input>";
						html += "</div>"
						html += "</div>"
					}
				}
			});
			$.each(longfields, function(key,val) {
				if (zwdbdata[val]!=undefined) {
					html += "<div class='col-12'>";
					html += `
					<div class="card">
					  <div class="card-body">
						<h4 class="card-title">{0}</h4>
						<p class="card-text">{1}</p>
					  </div>
					</div>`.format(val,zwdbdata[val])
					html += "</div>"
				}
			})
			$.each(zwdbdata.parameters,function(key,param) {
				html += "<div class='col-12'>";
				html += `
				<div class="card">
				  <div class="card-body">
					<h4 class="card-title">Param #{0} - {1}</h4>
					<p class="card-text">`.format( param.id, param.label )
				$.each(param, function(key,val) {
					if ($.inArray(key,["id","label"])==-1) {
						var typ = Object.prototype.toString.call(val);
						if ((typ!="[object Object]") && (typ!="[object Array]")){
							html += "<div><b>{0}</b>: {1}</div>".format( key,val)
						}
					}
				});
				if (param.options) {
					html += "<b>Allowed Values:</b>"
					$.each(param.options, function(key,val) {
						html += "<li>{0} - {1}</li>".format(val.value, val.label)
					});
				}
				html += `</p>
				  </div>
				</div>`
				html += "</div>"
			});
			html += `
					<div class='col-12'>
					<div class="card">
					  <div class="card-body">
						<h4 class="card-title">{0}</h4>
						<p class="card-text"><pre>{1}</pre></p>
					  </div>
					</div>
					</div>`.format("DB raw data",JSON.stringify(zwdbdata,null,2))
			html += "</form>";
			$("#zwdb").html( html )
		}
		function _drawDeviceZWConfiguration( device ) {
			var variables = [
				{ name:"manufacturer" }, { name:"model" }, { name:"name" },
				{ service:"urn:micasaverde-com:serviceId:HaDevice1", name:"FirstConfigured" },
				{ service:"urn:micasaverde-com:serviceId:HaDevice1", name:"LastUpdate" },
				{ service:"urn:micasaverde-com:serviceId:HaDevice1", name:"BatteryDate" },
				{ service:"urn:micasaverde-com:serviceId:ZWaveDevice1", name:"LastWakeup" },
				{ service:"urn:micasaverde-com:serviceId:ZWaveDevice1", name:"LastRouteUpdate" },
				{ service:"urn:micasaverde-com:serviceId:SecuritySensor1", name:"LastTrip" },
				{ service:"urn:micasaverde-com:serviceId:ZWaveDevice1", name:"ManufacturerInfo", decode:_decodeManufacturor, help:"http://z-wave.sigmadesigns.com/wp-content/uploads/2016/08/SDS13740-1-Z-Wave-Plus-Device-and-Command-Class-Types-and-Defines-Specification.pdf" },
				{ service:"urn:micasaverde-com:serviceId:ZWaveDevice1", name:"VersionInfo", decode:_decodeVersion, help:"http://wiki.micasaverde.com/index.php/ZWave_Protocol_Version" },
				{ service:"urn:micasaverde-com:serviceId:ZWaveDevice1", name:"Capabilities", decode:_decodeCapabilities, help:"http://wiki.micasaverde.com/index.php/ZWave_Command_Classes" },
				{ service:"urn:micasaverde-com:serviceId:ZWaveDevice1", name:"NodeInfo", decode:_decodeNodeInfo},
				// { service:"urn:micasaverde-com:serviceId:ZWaveDevice1", name:"ManufacturerInfo", decode:_decodeZWDB, help:"http://www.cd-jackson.com/index.php/zwave/zwave-device-database"}
			];
			var html = "";
			html += "<div class='card'><div class='card-body altui-device-keyvariables'>";
				html += "<div class='card-columns altui-zwavecfg-card'>";
				$.each(variables, function(idx,variable) {
					var value = null
					if (variable.service)
						value = MultiBox.getStatus( device, variable.service, variable.name);
					else
						value = device[variable.name] || "";

					if ((value !=null) && (value !="")) {
						html += "<div class='card'><div class='card-body'>"
						if ($.isFunction(variable.decode)) {
							var help = (variable.help) ? "<a href='{0}' target='_blank'>{1}</a>".format(variable.help,_T("Help")) : ""
							html += "<div ><b>{0}</b>:{2} {1}</div>".format(variable.name,(variable.decode)(value,device),help)
						}
						else
							html += "<div ><b>{0}</b>: {1}</div>".format(variable.name,HTMLUtils.enhanceValue(value));
						html += "</div></div>"
					}
				});
				html += "</div>";
			html +="</div></div>";		// panel
			return html;
		};
		function _deviceDrawDeviceConfig( device ) {
			function _getReportHtml(device) {
				var html ="";
				html +="<div class='row altui-device-config '>";
				html += "<div id='altui-device-config-"+device.altuiid+"' class='col-12 '>"
				html += _drawDeviceZWConfiguration( device );
				// if (isNullOrEmpty(setvariables) == false) {
				// }
				html += "</div>";	// device-config
				html += "</div>";	// row
				return html;
			};
			function _getConfigHtml(device) {
				var model = [];
				var info = MultiBox.controllerOf(device.altuiid)
				if (MultiBox.isDeviceZwave(device) && MultiBox.isDeviceBattery(device)) {
					var majorminor = MultiBox.getMajorMinor(info.controller)
					if (majorminor) {
						if ( (majorminor.major>7) ||
							 ((majorminor.major==7) && (majorminor.minor>=30)) ) {
								model.push( { id:"altui-disableNNU", label:_T("Disable Wakeup AAR_NNU"), type:"input", inputtype:"checkbox", value: false, opt:{required:'','data-altuiid':device.altuiid } } );
						}
					}
				}
				return HTMLUtils.drawForm( 'altui-ctrlconfig-form', null, model, "novalidate" );
			};
			function _getParamsHtml(device) {
				var curvariables = MultiBox.getStatus(device, "urn:micasaverde-com:serviceId:ZWaveDevice1", "ConfiguredVariable") || "";
				var setvariables = MultiBox.getStatus(device, "urn:micasaverde-com:serviceId:ZWaveDevice1", "VariablesSet");
				if (isNullOrEmpty(setvariables))
					setvariables = curvariables || "";
				var getvariables = MultiBox.getStatus(device, "urn:micasaverde-com:serviceId:ZWaveDevice1", "VariablesGet") || "";
				var html = "";
				html += "<form id='myform' role='form' action='javascript:void(0);' novalidate >";
				html += "<table class='table table-responsive-OFF table-sm altui-config-variables' data-altuiid='{0}'>".format(device.altuiid);
				html +=("<caption><button id='{0}' type='submit' class='btn btn-sm btn-primary altui-device-config-save'>{1}</button></caption>").format(device.altuiid,_T('Save Changes'));
				html += "<thead>";
				html += "<tr>";
				html += "<th>";
				html += "</th>";
				html += "<th>";
				html += "Var</th>";
				html += "<th>";
				html += "Length Type</th>";
				html += "<th>";
				html += "Desired</th>";
				html += "<th>";
				html += "Current</th>";
				html += "</tr>";
				html += "</thead>";
				html += "<tbody>";
				var curelems = curvariables.split(',');
				var elems = setvariables.split(',');
				var getelems = getvariables.split(',');
				if (elems.length>=3) {
					for (var i=0;i<elems.length;i+=3) {
						html += _displayConfigVariable( device,elems[i],elems[i+1],elems[i+2],_findCurrentValue(getelems,elems[i]) );
					}
				}
				html += "<tr>";
				html += "<td colspan='5'>";
				html += smallbuttonTemplate.format( 'altui-addvar', 'altui-add-variable', plusGlyph ,'Add');
				html += "</td>";
				html += "</tr>";
				html += "</tbody>";
				html += "</table>";
				html += "</form>";
				return html;
			};

			if (MultiBox.isDeviceZwave(device)) {
				var info = MultiBox.controllerOf(device.altuiid)
				var bi = MultiBox.getControllers()[info.controller].box_info
				var html = HTMLUtils.drawTabs('altui-id-tabs',[
					{ iditem: 'altui-zwave', label: _T("ZWave") , html: _getReportHtml(device) },
					{ iditem: 'altui-options', label: _T("Options") , html: _getParamsHtml(device) },
					{ iditem: 'altui-controller', label: _T("Controller") , html: _getConfigHtml(device) },
				]);
				return html
			}
			return ""
		};
		function _deviceDrawDeviceUsedIn( device ) {
			var usedin_objects = MultiBox.getDeviceDependants(device);
			var html ="";
			html +="<div class='row altui-device-usedin '>";
			html += "<div id='altui-device-usedin-"+device.altuiid+"' class='col-12'><div class='card'><div class='card-body'>"
			html += "<ul>";
			var smallbuttonTemplate ="<button id='{0}' type='button' class='{1} btn btn-light btn-sm' aria-label='tbd' title='{3}'>{2}</button>";;
			if (usedin_objects.length>0)
				$.each(usedin_objects, function(idx,obj) {
					var info=null;
					switch(obj.type) {
						case "action":
							info = _formatAction(controller,obj.action) ;
							html += "<li id='{0}'>Scene #{0} <span class='text-info'>'{1}'</span>, {2} <span class='text-info'>'{3}'</span>	 &nbsp;".format(
								obj.scene,
								obj.name,
								obj.type,
								"{0} (<small class='text-muted'>{1}</small>)".format(obj.action.action,info.arguments)
								);
							html += smallbuttonTemplate.format(obj.scene,"btn btn-light btn-sm altui-scene-goto",searchGlyph,_T("See")); // searchGlyph
							html += "</li>";
							break;
						case "trigger":
							info = _formatTrigger(controller,obj.trigger);
							html += "<li id='{0}'>Scene #{0} <span class='text-info'>'{1}'</span>, {2} <span class='text-info'>'{3}'</span>	 &nbsp;".format(
								obj.scene,
								obj.name,
								obj.type,
								"{0} {1} (<small class='text-muted'>{2}</small>)".format(info.name, info.descr,info.condition)
								);
							html += smallbuttonTemplate.format(obj.scene,"btn btn-light btn-sm altui-scene-goto",searchGlyph,_T("See")); // searchGlyph
							html += "</li>";
							break;
						case "actionworkflow":
							info = _formatAction(controller,obj.action) ;
							html +="<li>Workflow #{0} <span class='text-info'>'{1}'</span> in state <span class='text-info'>'{2}'</span> action:{3} {4}</li>".format(
								obj.workflow.altuiid,
								obj.workflow.name,
								obj.state,
								"{0} (<small class='text-muted'>{1}</small>)".format(obj.action.action,info.arguments),
								smallbuttonTemplate.format(obj.workflow.altuiid,"btn btn-light btn-sm altui-wflow-goto",searchGlyph,_T("See"))
							);
							break;
						case "triggerworkflow":
							html +="<li>Workflow #{0} <span class='text-info'>'{1}'</span> in state <span class='text-info'>'{2}'</span> when:<span class='text-info'>{3}</span> {4} (<small class='text-muted'>{5}</small>)  {6}</li>".format(
								obj.workflow.altuiid,
								obj.workflow.name,
								obj.state,
								obj.transition || "",
								obj.cond.variable,
								obj.cond.luaexpr,
								smallbuttonTemplate.format(obj.workflow.altuiid,"btn btn-light btn-sm altui-wflow-goto",searchGlyph,_T("See"))
							);
							break;
					}
				});
			else
				html += "<li>{0}</li>".format(_T("Not used in scenes or workflows"));
			html += "</ul>";
			// html +=	"<span><pre>{0}</pre></span>".format( JSON.stringify(usedin_objects) );
			html += "</div></div></div>";
			html += "</div>";	// row
			return html
		};
		function _deviceDrawDeviceTriggers( device ) {
			var devicecontroller = MultiBox.controllerOf(device.altuiid).controller;
			var users = MultiBox.getUsersSync(devicecontroller);
			var html ="";
			html +="<div class='row altui-device-triggers'>";
			html += "<div id='altui-device-triggers-"+device.altuiid+"' class='col-12'><div class='card'><div class='card-body'>"
			html += "<ul>";
			var scenes = $.grep(MultiBox.getScenesSync(), function(scene) {
				var scenecontroller = MultiBox.controllerOf(scene.altuiid).controller;
				return (scenecontroller==devicecontroller)&&(scene.notification_only == device.id)
			});
			if (scenes) {
				$.each(scenes, function(idx,scene) {
					var selectedusers = [];
					if (scene.triggers && scene.triggers.length>0) {
						selectedusers = (scene.triggers[0].users || "").toString().split(",");
					}
					var names=[];
					$.each(users, function(idx,user){
						var inarray	 = $.inArray(user.id.toString(),selectedusers);
						if (inarray!=-1)
							names.push(user.Name);
					});
					html += "<li>{0}:({1}) {2} {3}</li>".format(
						scene.name,
						names.join(","),
						buttonTemplate.format( scene.altuiid, 'btn-sm altui-scene-goto',searchGlyph,'light',_T("See")),
						buttonTemplate.format( scene.altuiid, 'btn-sm altui-device-deltrigger text-danger', deleteGlyph,'default',_T("Delete"))
						);
				});
			}
			html += "<li>{0}</li>".format(buttonTemplate.format( 'altui-device-createtrigger', 'altui-device-createtrigger', plusGlyph+_T("Create"),'secondary',_T("Create") ));
			html += "</ul>";
			html += "</div></div></div>";
			html += "</div>";	// row
			return html
		}
		function _deviceDrawZWDB(device) {
			var devid = device.altuiid;
			var value = MultiBox.getStatus( device, "urn:micasaverde-com:serviceId:ZWaveDevice1", "ManufacturerInfo");
			var html ="";
			html+="<div class='row'>";
			html += "<div id='altui-device-zwdb-"+devid+"' class='col-12 altui-device-zwdb '>"
			html += "<div class='card'><div class='card-body'>"
			html += "<div id='zwdb'>{0}</div>".format(_T("Loading..."))
			html += "</div></div>"
			html += "</div>"
			html += "</div>"
			return html;
		}
		function _deviceDrawControlPanelAttributes(device) {
			var devid = device.altuiid;
			// Draw hidding attribute panel
			var html ="";
			html+="<div class='row'>";
			html += "<div id='altui-device-attributes-"+devid+"' class='col-12 altui-device-attributes '><div class='card'><div class='card-body'>"
			html += "<form class='form form-row'>";
			$.each( device, function(key,val) {
				if (val!=undefined) {
					var typ = Object.prototype.toString.call(val);
					if ((typ!="[object Object]") && (typ!="[object Array]")){
						html += "<div class='col-sm-6 col-md-4 col-lg-3 col-xl-2'>";
						html += "<div class='form-group'>";
						html += "<label class='font-weight-bold' for='"+key+"'>"+key+"</label>";
						html += _enhanceEditorValue(key,val,devid)
						// html += "<input id='"+key+"' data-altuiid='"+devid+"' class='form-control' value='"+val+"'></input>";
						html += "</div>"
						html += "</div>"
					}
				}
			});
			html += "</form>";
			html += "</div>";
			html += "</div></div></div>";	// row
			return html;

		};
		function _deviceDrawWireFrame( device ) {
			var devicecontroller = MultiBox.controllerOf(device.altuiid).controller;
			var rooms = $.grep(MultiBox.getRoomsSync() , function(room) {return ( MultiBox.controllerOf(room.altuiid).controller == devicecontroller )} )
			var htmlRoomSelect = "<select id='altui-room-list' class='form-control form-control-sm'>";
			if (rooms)
					htmlRoomSelect	  += "<option value='{1}' {2}>{0}</option>".format(_T("No Room"),0,'');
					$.each(rooms, function(idx,room) {
						var selected = (room.id.toString() == device.room);
						htmlRoomSelect	  += "<option value='{1}' {2}>{0}</option>".format(room.name,room.id,selected ? 'selected' : '');
					});
			htmlRoomSelect += "</select>";
			var tags = MyLocalStorage.getSettings('DeviceTags')
			var key = '_'+device.altuiid
			tags = tags.devicemap[key]
			var htmlTags = HTMLUtils.drawTags('altui-devicetags',tags);
			var htmlDeleteButton= (device.donotdelete==true) ? '' : buttonTemplate.format( device.altuiid, 'btn-sm altui-deldevice ml-auto', deleteGlyph,'default',_T("Delete"));
			var html ="";
			html+="<div class='row'>";
				html +="<div id='altui-device-controlpanel-"+device.altuiid+"' class='col-12 altui-device-controlpanel' data-altuiid='"+device.altuiid+"'>";
				html +="	<div class='card '>";
				html +="		<div class='card-header form-inline'>";
				html +="			<h4 class='card-title'>{0} {1} {2} (#{3}) "+htmlRoomSelect+"</h4>";
				html +=				htmlTags;
				html +=				htmlDeleteButton;
				html +="		</div>";
				html +="		<div class='card-body'>";
				html +="		</div>";
				html +="	</div>";
				html +="</div>";
			html += "</div>";	// row
			return html.format(device.manufacturer || '', device.model || '', device.name || '', device.id)
		};
		function _defereddisplay(bAsync) {
			function _createDeviceTabs( device, bExtraTab, tabs ) {
				var lines= [];
				lines.push("<ul class='nav nav-tabs' id='altui-devtab-tabs' role='tablist'>");
				if (bExtraTab) {
					lines.push( "<li class='nav-item' id='altui-devtab-0' role='presentation' ><a class='nav-link' href='#altui-devtab-content-0' aria-controls='{0}' role='tab' data-toggle='tab'>{0}</a></li>".format("AltUI") );
				}
				if (tabs!=undefined)
					$.each( tabs, function( idx,tab) {
						if ((tab.TabType!="javascript") || ( $.inArray( tab.ScriptName, _forbiddenScripts) == -1)) {
							lines.push( "<li class='nav-item' id='altui-devtab-{1}' role='presentation' ><a class='nav-link' href='#altui-devtab-content-{1}' aria-controls='{0}' role='tab' data-toggle='tab'>{0}</a></li>".format(tab.Label.text,idx+1) );
						}
					});
				lines.push("</ul>");
				var html = "<div class='tab-content {0}'>".format( (UIManager.UI7Check()==true) ? '' : 'altui-tabcontent-fix');
				if (bExtraTab) {
					html += "<div id='altui-devtab-content-0' class='tab-pane bg-light altui-devtab-content'>";
					html += "</div>";
				}
				if (tabs!=undefined)
					$.each( tabs, function( idx,tab) {
						if ((tab.TabType!="javascript") || ( $.inArray( tab.ScriptName, _forbiddenScripts) == -1)) {
							html += "<div id='altui-devtab-content-{0}' class='tab-pane fade bg-light altui-devtab-content'>".format(idx+1);
							html += "</div>";
						}
					});
				html += "</div>";
				return lines.join('')+html;
			};

			if (_toLoad==0) {
				$(container).append( "<div class='row'><div class='altui-debug-div'></div></div>" );	// Draw hidden debug panel

				var panel_body = container.find(".altui-device-controlpanel .card-body");
				var _altuitypesDB = MultiBox.getALTUITypesDB();					// for ALTUI plugin info
				var ui_static_data = MultiBox.getDeviceStaticData(device);
				var dt = _altuitypesDB[_getDeviceDrawMapping(device)];

				if (ui_static_data!=null) {
					var funcnames = null;
					var bExtraTab = false;
					if (dt && dt.ControlPanelFunc!=null) {
						funcnames = dt.ControlPanelFunc.split(",")
						bExtraTab = ( funcnames[0].length>0 )
					}
					$(panel_body).append( "<div class='row'><div class='col-12'>" + _createDeviceTabs( device, bExtraTab, ui_static_data.Tabs ) + "</div></div>" );
				}

				$(panel_body).find("li a").first().tab('show');	// activate first tab
				var activeTabIdx = _getActiveDeviceTabIdx();
				var domparent  =  $('div#altui-devtab-content-'+activeTabIdx);
				_displayActiveDeviceTab(activeTabIdx, device, domparent);

				if (bAsync) {
					$(".altui-debug-div").toggle(false);					// hide
				}

				if (ui_static_data && AltuiDebug.IsDebug()) {
					$("div.altui-debug-div").append( "<pre>"+JSON.stringify(ui_static_data.Tabs)+"</pre>" );
				}

			}
		};

		var html = `<div class="col-12">{0}</div>`
		var altuiid = device.altuiid
		var buttons = [
			{id:'altui-toggle-control-panel', label:_T("Control Panel"), href:'altui-device-attributes' , tab:_deviceDrawWireFrame },
			{id:'altui-toggle-attributes', label:_T("Attributes"), href:'altui-device-attributes' , tab:_deviceDrawControlPanelAttributes},
			{id:'altui-device-variables', label:_T("Variables") },
			{id:'altui-device-actions', label:_T("Actions"), }
		]
		if (MultiBox.isControllerFeature(device.altuiid,"createDevice")==true) {
			buttons = buttons.concat( [
				{id:'altui-device-usedin', label:_T("Used in"), href:'altui-device-usedin', tab: _deviceDrawDeviceUsedIn },
				{id:'altui-device-triggers', label:_T("Notification"), href:'altui-device-triggers', tab: _deviceDrawDeviceTriggers}
			])
		}
		if (MultiBox.isDeviceZwave(device)) {
			buttons = buttons.concat([
				{id:'altui-device-config', label:_T("Configuration"), href:'altui-device-config', tab: _deviceDrawDeviceConfig},
				{id:'altui-device-zwdb', label:_T("zWave DB"), href:'altui-device-zwdb', tab: _deviceDrawZWDB},
			])
		}
		var str = []
		str.push('<ul class="nav nav-pills mb-2" id="altui-control-panel-tabs" role="tablist">')
			$.each(buttons, function(idx,model) {
				str.push('<li class="nav-item">')
				if (model.href) {
					str.push('<a class="nav-link" id="pill-{0}" data-toggle="pill" href="#{1}" role="tab" aria-controls="home" aria-selected="true">{2}</a>'.format(
						model.id,
						model.id,
						model.label))
				} else {
					str.push('<a class="nav-link" id="{0}" href="#" data-altuiid="{2}" >{1}</a>'.format(model.id, model.label,altuiid))
				}
				str.push('</li>')
			});
			if (AltuiDebug.IsDebug())	str.push(buttonDebugHtml);
		str.push('</ul>')
		str.push('<div class="tab-content" id="pills-tabContent">')
			$.each(buttons, function(idx,model) {
				if ($.isFunction(model.tab)) {
					str.push('<div class="tab-pane fade" id="{0}" role="tabpanel" aria-labelledby="pills-profile-tab">{1}</div>'.format(
						model.id,
						(model.tab)(device)
					))
				}
			})
		str.push('</div>')
		html = html.format(str.join("\n"))
		$(container).html(html)
		$('#altui-control-panel-tabs a:first').tab('show') // Select first tab

		var _toLoad = 0;

		// last child is the ZWDB tab
		$('#altui-control-panel-tabs li:last-child').on("shown.bs.tab", function(e) {
			if (MultiBox.isDeviceZwave(device) && ($("#altui-zwdb-form").length==0) ) {
				var value = MultiBox.getStatus( device, "urn:micasaverde-com:serviceId:ZWaveDevice1", "ManufacturerInfo");
				var splits = value.split(",")
				var manuf = toHex2(splits[0])
				var ptype = toHex2(splits[1])
				var pid = toHex2(splits[2])
				$.ajax( {
					cache:false,
					crossDomain: true,
					method:'POST', url:"https://europe-west1-altui-cloud-function.cloudfunctions.net/helloHttp",
					data: {
						manufacturer: manuf,
						type: ptype,
						id: pid
					}
				})
				.done(function(data) {
					_decodeZWDB( device,cloneObject(data) )
				})
			}
		});

		// CONTROL PANEL WIRE FRAME
		$("#altui-room-list").change( function() {
			MultiBox.renameDevice(device, device.name, $(this).val() );
		});
		$(".altui-device-controlpanel")
			.off('click','.altui-tag-add')
			.on('click','.altui-tag-add', function() {
				var tag = $(this).prop('id').substr("altui-tag-add-".length)
				var altuiid = $(this).closest(".altui-device-controlpanel").data("altuiid")
				var db = MyLocalStorage.getSettings('DeviceTags')
				var key = '_'+altuiid
				db.devicemap[key] = db.devicemap[key] || []
				var index = db.devicemap[key].indexOf(tag);
				if (index <= -1) {
					db.devicemap[key].push(tag)
					MyLocalStorage.setSettings('DeviceTags',db)
					var htmlTags = HTMLUtils.drawTags('altui-devicetags',db.devicemap[key]);
					$(".altui-tags").replaceWith( htmlTags );
				}
			})
			.off('click','.altui-device-tag')
			.on('click','.altui-device-tag',function() {
				var tag = $(this).prop('id').substr("altui-tag-".length)
				var db = MyLocalStorage.getSettings('DeviceTags')
				var key = '_'+altuiid
				if (db.devicemap[key]) {
					var index = db.devicemap[key].indexOf(tag);
					if (index > -1) {
						db.devicemap[key].splice(index, 1);
					}
					MyLocalStorage.setSettings('DeviceTags',db)
					var htmlTags = HTMLUtils.drawTags('altui-devicetags',db.devicemap[key]);
					$(".altui-tags").replaceWith( htmlTags );
				}
			})
		// ZWCONFIG PAGE
		$(".altui-config-variables")
			.on('click',".altui-add-variable", function() {
				var tr = $(this).closest('tr');	// remove the line purely
				$(tr).before( _displayConfigVariable( device,'0','m','','' ) );
			})
			.on('click',".altui-delete-variable",function(){
				var id = $(this).prop('id');
				var tr = $(this).closest('tr').remove();	// remove the line purely
			});

		$("#myform").on('submit', function(e) {
			var form = $("#myform")[0]
			if (form.checkValidity() === false) {
				// handle the invalid form...
				e.preventDefault();
				e.stopPropagation();
				form.classList.add('was-validated');
			}
			else {
				// everything looks good!
				form.classList.add('was-validated');
				var altuiid = $('#myform .altui-device-config-save').prop('id');
				var controllerid = MultiBox.controllerOf(altuiid).controller;
				var device = MultiBox.getDeviceByAltuiID(altuiid);
				var rows = $(this).find("table").find("tbody tr").not(":last-child")
				var variables = [];
				$(rows).each(function(idx,row) {
					var tds = $(row).find("td");
					variables.push("{0},{1},{2}".format(
						$(tds[1]).find("input").val(),
						$(tds[2]).find("select :selected").val(),
						$(tds[3]).find("input").val() )
					);
				});
				MultiBox.setStatus( device, "urn:micasaverde-com:serviceId:ZWaveDevice1", "VariablesSet", variables.join(",") );
				MultiBox.reloadEngine( controllerid );
				PageMessage.message( "Device zWave parameter saved, a reload will now happen", "info");
			}
			return false;
		});

		// CONTROLLER BEHAVIORS
		$("#altui-disableNNU").click(function(e){
			var altuiid = $(this).data('altuiid');
			var device = MultiBox.getDeviceByAltuiID(altuiid)
			if (device) {
				var status = MultiBox.getStatus(device, "urn:micasaverde-com:serviceId:ZWaveDevice1", "DisableWakeupARR_NNU" )
				if (status==null)
					status = false
				MultiBox.setStatus(
					device,
					"urn:micasaverde-com:serviceId:ZWaveDevice1", "DisableWakeupARR_NNU",
					(status) ? "0" : "1" );
			}
		})

		//ATTRIBUTE PAGE
		$(".altui-device-attributes input").focusout( function( event ) {
			var altuiid = $(this).data('altuiid');
			var device = MultiBox.getDeviceByAltuiID(altuiid);
			var attribute = $(this).prop('id');
			var oldval = $(this).attr('value');	// this is HTML value so old value
			var value = $(this).val();			// this is jq dynamic value so new value
			var input = $(this);
			if (value!=oldval) {
				DialogManager.confirmDialog(_T("Are you sure you want to modify this attribute"),function(result) {
					if (result==true) {
						MultiBox.setAttr(device, attribute, value,function(result) {
							if (result==null) {
								PageMessage.message( "Set Attribute action failed!", "warning" );
							}
							else {
								$(input).attr('value',value)
								PageMessage.message( "Set Attribute succeeded! a LUUP reload may happen now, be patient", "success" );
							}
						});
					}
					else {
						$(input).val(oldval);
					}
				});
			}
		});

		$(".altui-device-controlpanel-container")
			.on('click',".altui-wflow-goto",function(){
				var altuiid = $(this).prop("id");
				UIControler.changePage("Workflow",[altuiid])
			})
			.on('click',".altui-scene-goto",function(){
				var altuiid = $(this).prop("id");
				UIControler.changePage('Scene Edit',[altuiid])
			})
			.on('click',".altui-device-deltrigger",function(){
				var altuiid = $(this).prop("id");
				var scene = MultiBox.getSceneByAltuiID(altuiid);
				MultiBox.deleteScene(scene);
				// _deviceRefreshDevicePanel(device, container)
				$(this).closest("li").remove();
			})
			.on('click',".altui-device-createtrigger",function(){
				var info = MultiBox.controllerOf(device.altuiid);
				var trigger = {
								name: _T("Notification from {0}").format(device.name),
								enabled:1,
								template:'',
								device:info.id,
								arguments:[],
								lua:''
							};
				DialogManager.triggerDialog( trigger, info.controller, function( trigger ) {
					var newid = MultiBox.getNewSceneID( info.controller );
					var scenetemplate = {
							notification_only: parseInt(device.id),
							name:_T("Notification from {0}").format(device.name),
							id: newid.id,
							altuiid: newid.altuiid,
							triggers: [trigger],
							groups: [{"delay":0,"actions":[]}],
							timers: [],
							lua:"",
							room:0
					};

					// clear page
					UIControler.changePage('Scene Edit',[NULL_SCENE,scenetemplate])
				});
			});

		var ui_static_data = MultiBox.getDeviceStaticData(device);
		if (ui_static_data!=null) {
			// load scripts
			var scripts = {};
			if (ui_static_data.Tabs != undefined)
				$.each( ui_static_data.Tabs, function( idx,tab) {
					var script = null, func = null;
					if (tab.TabType=="javascript" && ( $.inArray( tab.ScriptName, _forbiddenScripts) == -1))
					{
						script = tab.ScriptName;
						func = tab.Function;
					} else if (tab.TabType=="flash" && tab.AfterInit && ( $.inArray( tab.AfterInit.ScriptName, _forbiddenScripts) == -1)) {
						script = tab.AfterInit.ScriptName;
						func = tab.AfterInit.Function;
					}
					if ( script && func ) {
						if (scripts[script] == undefined)
							scripts[script]=[];
						scripts[script].push( func );
					}
				});

			if (Object.keys(scripts).length==0)
				_defereddisplay(true);
			else
			{
				$.each( scripts , function (scriptname,func){
					var len = $('script[data-src="'+scriptname+'"]').length;
					if (len==0) {				// not loaded yet
						_toLoad ++;
					}
				});
				if (_toLoad==0) {
					// if nothing to load
					_defereddisplay(true);
				} else {
					$.each( scripts , function (scriptname,func){
						var len = $('script[data-src="'+scriptname+'"]').length;
						if (len==0) {				// not loaded yet
							_createScript( scriptname );
							FileDB.getFileContent( controller, scriptname, function(data) {
								_toLoad --;
								// vague tentative to fix the code of loaded script !!!
								var ui7style = false;
								$.each(func, function(i,f) {
									if (f.indexOf('.')!=-1) {
										ui7style=true;
										return false;
									}
								});

								// do not touch _safeScripts contents
								if ( $.inArray( scriptname, _safeScripts) == -1) {
									data = _fixScriptPostLoad( scriptname , data, ui7style );
									// commeting out as it creates a one line offset in debugger, but could be needed for some scripts...
									// data = "//# sourceURL="+scriptname+"\n"+data;
								}

								$('script[data-src="'+scriptname+'"]').text(data);
								_defereddisplay(true);
							})
						}
					})
				}
			}
		}
	};

	function _googleScript(str) {
		var res = JSON.parse(str);

		if (res.license && res.license.valid==true) {
			// license valid
			$("footer #registration").html("<span class='text-success'>, {0} / {1}</span>".format(_T("Registered Version"),(res.license.date!=null) ? res.license.date : ''));
			$("footer #altui-license-page").remove();
			ALTUI_registered = true;
			// ALTUI_registered = false;
		} else
		{
			ALTUI_registered = false;
			if ($("#wrap #altui-license").length==0) {
				// rotating license message
				var close = "<button class='close altui-pagemessage-close' type='button' aria-label='Close'><span aria-hidden='true'>&times;</span></button>";
				$("#navbar").after("<blockquote id='altui-license' class='w-75 blockquote'><p class='text-warning'>{0}.({1}){2}</p></blockquote>".format(
					_T("Unregistered version for {0}").format(res.license.name),
					(res.license.date!=null) ? res.license.date : '',
					close
				));
				$("#altui-license").toggleClass("license-rotated").one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(){
					$("footer #registration").html(", <span class='text-danger'>{0} / {1}</span>".format(_T("Unregistered Version"),(res.license.date!=null) ? res.license.date : ''));
					$("#altui-license .close").click(function(){
						$("#altui-license").remove();
					})
				});
			}
			EventBus.publishEvent("on_altui_notRegistered");
		}
		_refreshFooterSize();

		if (res.update && res.update.valid) {
			var bUpdate = ( (res.license && res.license.valid==true) || (res.update.forced==true) )
			var buttons = bUpdate ? [
				{isdefault:false, label:_T("Close for 24h"), id:'altui-close-24h' },
				{isdefault:true, label:_T("Yes")}
			] : [];
			var dialogText = bUpdate ? _T("a newer version #{0} of ALTUI is available, do you want to upgrade ?").format(res.update.newVersion)
									 : _T("a newer version #{0} of ALTUI is available, auto upgrade requires a registered version").format(res.update.newVersion)

			var now = new Date();
			var date = MyLocalStorage.getSettings("PostPoneUpdate");
			if ( ( date == null ) || ( new Date(date) < now) ) {
				DialogManager.confirmDialog(dialogText , function(result) {
					if (result==true)
						MultiBox.triggerAltUIUpgrade(res.update.newVersion,res.update.newTrac);
					},
					buttons
				);
				$('div#dialogs')
					.off('click',"#altui-close-24h")
					.on('click',"#altui-close-24h",function() {
						var date = new Date();
						date.setDate(date.getDate() + 1);
						MyLocalStorage.setSettings("PostPoneUpdate",date)
					});
				var html ="<ul>";
				html += $.map(res.update.newFeatures,function(e) { return "<li>"+e+"</li>"} ).join('');
				html +="</ul>"
				$("div#dialogModal .altui-dialog-row").append(html);
			}
		}
		return (res.update && res.update.valid)
	};

	function _refreshFooterSize() {
		if ( MyLocalStorage.getSettings('StickyFooter')==1 ) {
			//$("footer").css("position","sticky").css("bottom",0).css("z-index",99)
			$("footer").addClass("fixed-bottom")
			// $("#wrap")
					// .css("width","100%")
					// .css("overflow-y","auto")
					// .css("overflow-x","hidden")
					// .css("position","absolute")
					// .css("top","0")
					//.css("top",$("#navbar").outerHeight(true))
					// .css("padding-top",$(".navbar-fixed-top").outerHeight(true)) //$(".navbar-fixed-top").outerHeight(true))
					// .css("bottom",$("footer").outerHeight(true))
					// .css("max-height",window.innerHeight-$("footer").height() - $(".navbar-fixed-top").outerHeight(true));
		} else {
			$("body").css("margin-bottom",$("footer").outerHeight(true));
		}
	};

	function _refreshTopStats(data) {
		MultiBox.osCommand( parseInt($("#altui-controller-select").val()), "top -n 1", true, function(res) {
			var lines = res.result.split("\n")
			var html = "<div>{0}</div><div>{1}</div><div>{2}</div>".format(lines[0].substring(6),lines[1],lines[2])
			$("#altui-osstats").html( html );
		});
	};

	function _refreshFooter( bManual ) {
		// refresh footer if needed
		if ( ($("small#altui-footer span.bg-danger").length == 1)  || (bManual==true) ){
			var footerMap={
				appname:'AltUI',
				luaversion:'',
				jsrevision:'',
				copyright:'&copy;',
				boxinfo:'',
				curusername:'',
				paypal:''
			};
			var re = /\$MyRevision:\s*(\d*).*\$/;
			var m;
			if ((m = re.exec(ALTUI_revision)) !== null) {

				function _unregisteredFooter(footerstr) {
					$("small#altui-footer").html( footerstr );
				}
				// prepare data
				footerMap.luaversion = _version;
				footerMap.jsrevision = m[1];
				var info = MultiBox.getBoxInfo(0);
				var infotbl=[];
				for( var key in info) { infotbl.push( info[key] || "") };
				footerMap.boxinfo = infotbl.join(", ").replace('\n','');
				var curuser = MultiBox.getMainUser();
				footerMap.curusername = curuser ? curuser.Name : '';

				usdGlyph = glyphTemplate.format( "usd", _T("License") , 'text-warning');
				footerMap.paypal = buttonTemplate.format( "altui-license-page", 'btn-sm btn-light', "{0} {1}".format(usdGlyph,_T("License")),'secondary',_T("License"));

				// get template
				var altuidevice = MultiBox.getDeviceByID( 0, g_ALTUI.g_MyDeviceID );
				var footerTemplate =  MultiBox.getStatus( altuidevice, "urn:upnp-org:serviceId:altui1", "FooterBranding" )
					|| "<span>${appname} ${luaversion}.${jsrevision}, ${copyright} 2019 amg0,${boxinfo} User: ${curusername} <span id='registration'></span></span><span>${paypal}</span><span id='altui-osstats'></span>";
				var tmpl = _.template(footerTemplate.trim());
				var footerstr =tmpl( footerMap )

				// if the footer template do not include the #registration SPAN do not check it
				if ((bManual!=true) && ((ALTUI_registered==true) || (footerTemplate.indexOf("<span id='registration'>")==-1))) {
					// Footer does not have the registration tag
					$("small#altui-footer").html( footerstr );
					ALTUI_registered = true;
				} else {
					// Footer is standard , process the registration check with Google

					// if not confirmed back in 10 sec, consider the user as non registered
					var timer = setTimeout( function() {
						_unregisteredFooter(footerstr);
						UIManager.googleScript('{"license":{"name":"'+footerMap.curusername+'","valid":false,"date":""},"update":{"valid":false,"forced":false,"newVersion":0,"newTrac":0,"newFeatures":[]}}');
					}, 20000 );

					// prepare extra info, remove undeeded info
					footerMap.footerstr = footerstr.replace("<span>"+footerMap.paypal+"</span>",'').replace("<span id='registration'></span>",'')
					delete footerMap.paypal

					// JSONP call that will trigger a response with a call to UIManager.googleScript
					$.ajax({
						// crossDomain :true,
						// url:'https://script.google.com/macros/s/AKfycbyu0Xc8Hd3ruJolJGUsi5Chbq4GUnAl89LeDpky-1_nQA23kHs/exec',	// test
						url:'https://script.google.com/macros/s/AKfycbwWlgs1x0u1OpKKvaVFywb7XY_FfZ2dGcasvnD576RUbBP1OQc/exec',	// prod
						dataType: "jsonp",
						data: $.extend( { command:'registration' /*prefix:'UIManager.googleScript'*/ }, footerMap),
						cache:false
					})
					.done( function (data, textStatus, jqXHR) {
						// cancel timer if it exists
						if (timer) clearTimeout( timer );
						// display and update immediately
						_unregisteredFooter(footerstr);
						var bUpgrade = UIManager.googleScript(data);
						if ((bManual==true) && (bUpgrade==false)) {
							DialogManager.infoDialog(_T("Check for Updates"),_T("You already have the latest version"));
						}
					})
					.fail( function (data, textStatus, jqXHR) {
						alert("fail")
					})
					.always( function() {
						if (MyLocalStorage.getSettings('TopStats')==1) {
							setInterval(_refreshTopStats,3000)
						}
					});
				}
			}
		}
		_refreshFooterSize();
	};
	function _drawRoomFilterButtonAsync( selectedrooms ) {
		var dfd = $.Deferred();
		var toolbarHtml="";
		var rooms = $.when(MultiBox.getRooms()).then(function(rooms) {

			var namearray = $.map(rooms, function(r) { return r.name;} );
			var filteredrooms = $.grep(rooms, function(room,idx) {
				return $.inArray(room.name ,namearray) == idx;
			});

			toolbarHtml+='<select id="altui-device-room-filter" multiple="multiple">';
			toolbarHtml+='<option value="{0}" {2}>{1}</option>'.format( 0 ,_T("No Room"), ($.inArray("0",selectedrooms)!=-1) ? 'selected':'' );
			$.each(filteredrooms , function(i,room){
				toolbarHtml+='<option value="{0}" {2}>{1}</option>'.format( room.name,room.name, ($.inArray(room.name,selectedrooms)!=-1) ? 'selected':'' );
			});
			toolbarHtml+='</select>';
			dfd.resolve(toolbarHtml);
		});
		return dfd.promise();
	};

	function _refreshUIPerDevice(eventname,device) {
		// refresh device panels
		$(".altui-device-controlpanel[data-altuiid='"+device.altuiid+"']").not(".altui-norefresh").each( function(index,element) {
			// force a refresh/drawing if needed.
			// the event handler for the tab SHOW event will take care of the display of the tab
			var activeTabIdx = _getActiveDeviceTabIdx();
			_setActiveDeviceTabIdx(activeTabIdx);
		});
	};

	function _resizeFavorites() {
		// check is of row
		var width = $(".altui-favorites").width();
		if (width<400) {
			$(".altui-favorites-device , .altui-favorites-housemode").css({width:'33%',"xpadding-bottom":'33%'});
			$(".altui-favorites-weather").css({width:'66%',"xpadding-bottom":'33%'});
		} else if ( width <500 ) {
			$(".altui-favorites-device , .altui-favorites-housemode").css({width:'25%',"xpadding-bottom":'25%'});
			$(".altui-favorites-weather").css({width:'50%',"xpadding-bottom":'25%'});
		} else if ( width <800 ) {
			$(".altui-favorites-device , .altui-favorites-housemode").css({width:'20%',"xpadding-bottom":'20%'});
			$(".altui-favorites-weather").css({width:'40%',"xpadding-bottom":'20%'});
		} else if ( width <1200 ){
			$(".altui-favorites-device , .altui-favorites-housemode").css({width:'20%',"xpadding-bottom":'20%'});
			$(".altui-favorites-weather").css({width:'40%',"xpadding-bottom":'20%'});
		} else {
			$(".altui-favorites-device , .altui-favorites-housemode").css({width:'10%',"xpadding-bottom":'10%'});
			$(".altui-favorites-weather").css({width:'20%',"xpadding-bottom":'10%'});
		}

		// console.log(".altui-favorites-device.length="+$(".altui-favorites-device").length);
		if ($(".altui-favorites-device-container").length>0) {
			var width = $(".altui-favorites-device-container").innerWidth();
			$(".altui-favorites-scene-content")
				.css("font-size",Math.floor(width/6))
			$(".altui-favorites-device-content")
				.css("font-size",Math.floor(width/6))
			$(".altui-favorites-mediumtext")
				.css("font-size",Math.floor(width/12))
			$(".altui-favorites-smalltext")
				.css("font-size",Math.floor(width/24))
		}
	};

	function _deviceDrawFavoriteDefault(device) {
		return UIManager.deviceIcon(device).replace('altui-device-icon','altui-device-icon altui-favorite-icon').replace('pull-left','');
	}

	const DEVICEDRAW_DEFAULT = 1
	const DEVICEDRAW_CONCISE = 2
	// mode = null or DEVICEDRAW_DEFAULT ; or DEVICEDRAW_CONCISE
	function _deviceDrawFavorite(device,cls,mode) {
		var html="";
		var posthtml="";
		mode = mode || DEVICEDRAW_DEFAULT
		cls = cls || 'altui-favorites-device-content'
		html += "<div class='{1}' data-altuiid='{0}'><div class='altui-favorites-device-content-box'>".format(device.altuiid,cls);
		var watts = parseFloat(MultiBox.getStatus( device, 'urn:micasaverde-com:serviceId:EnergyMetering1', 'Watts' ));
		if (isNaN(watts)==false) {
			// Envoy has positive power, but it's really "green" since it is a generator (normally negative), not a consumer
			var cls =  (watts > 0 && device.device_type != "urn:schemas-rboer-com:device:Envoy:1") ? 'bg-success' : 'bg-light'
			posthtml += "<div class='{1} altui-favorites-info altui-favorites-watts'>{0} W</div>".format( Math.round(watts*10)/10 , cls );
		}
		switch(device.device_type) {
			case "urn:schemas-micasaverde-com:device:BarometerSensor:1":
			case "urn:schemas-micasaverde-com:device:WindSensor:1":
			case "urn:schemas-micasaverde-com:device:ScaleSensor:1":
			case "urn:schemas-micasaverde-com:device:DistanceSensor:1":
				html += ALTUI_PluginDisplays.drawMySensorsExt( device ).replace('altui-mysensorsext','altui-favorites-mysensorsext')
				break;
			case "urn:schemas-micasaverde-com:device:Sonos:1":
				var src = MultiBox.getStatus(device, 'urn:upnp-org:serviceId:AVTransport', 'CurrentAlbumArt');
				html += "<img class='altui-sonos-tile-img' src='{0}' ></img>".format(src)
				break;
			case "urn:schemas-micasaverde-com:device:LightSensor:1":
				html += _deviceDrawFavoriteDefault(device);
				var level = MultiBox.getStatus( device, 'urn:micasaverde-com:serviceId:LightSensor1', 'CurrentLevel' );
				posthtml += "<div class='bg-light altui-favorites-info altui-favorites-mediumtext'>{0} lux</div>".format(level/*+ws.tempFormat*/);
				break;
			// case "urn:schemas-upnp-org:device:BinaryLight:1":
			// 	var status = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:SwitchPower1', 'Status' );
			// 	status = parseInt(status);
			// 	html += "<span class='{1}'>{0}</span>".format(
			// 		status==1 ? "On" : "Off",
			// 		status==1 ? "text-success" : "text-danger"
			// 	);
			// 	break;
			case "urn:schemas-upnp-org:device:cplus:1":
				var status = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:cplus1', 'Present' );
				status = parseInt(status);
				html += "<span class='{1}'>{0}</span>".format(
					status==1 ? "On" : "Off",
					status==1 ? "text-success" : "text-danger"
				);
				break;
			case "urn:schemas-micasaverde-com:device:WindowCovering:1"	:
			case "urn:schemas-upnp-org:device:DimmableLight:1":
				html += _deviceDrawFavoriteDefault(device);
				var loadLevelStatus = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:Dimming1', 'LoadLevelStatus' );
				posthtml += "<div class='bg-light altui-favorites-info'>{0}%</div>".format(loadLevelStatus);
				break;
			case "urn:schemas-micasaverde-com:device:HumiditySensor:1":
				html += _deviceDrawFavoriteDefault(device);
				var level = MultiBox.getStatus( device, 'urn:micasaverde-com:serviceId:HumiditySensor1', 'CurrentLevel' );
				posthtml += "<div class='bg-light altui-favorites-info'>{0}</span> <span class='altui-favorites-mediumtext'>%</div>".format(level);
				break;
			case "urn:schemas-micasaverde-com:device:VOTS:1":
			case "urn:schemas-micasaverde-com:device:TemperatureSensor:1":
			case "urn:schemas-upnp-org:device:HVAC_ZoneThermostat:1":
			case "urn:schemas-upnp-org:device:Heater:1":
				var temp = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:TemperatureSensor1', 'CurrentTemperature' );
				if (mode==DEVICEDRAW_CONCISE) {
					html += _deviceDrawFavoriteDefault(device);
					posthtml += ("<div class='bg-light altui-favorites-info'>{0}</div>".format((temp || "") +"&deg;"))
				} else
					html +=  _drawFavoriteGauge(device,temp)
				break;
			case "urn:schemas-micasaverde-com:device:MotionSensor:1":
			case "urn:schemas-micasaverde-com:device:DoorSensor:1":
				var tripped = parseInt(MultiBox.getStatus( device, 'urn:micasaverde-com:serviceId:SecuritySensor1', 'Tripped' ));
				html += ("<span>{0}</span>".format( (tripped==true) ? glyphTemplate.format('bolt','trigger','text-danger') : " "));
				html += _deviceDrawFavoriteDefault(device);
				var lasttrip = MultiBox.getStatus( device, 'urn:micasaverde-com:serviceId:SecuritySensor1', 'LastTrip' );
				if (lasttrip != null) {
					var lasttripdate = _toIso(new Date(lasttrip*1000),' ');
					posthtml+= "<div class='bg-light altui-favorites-info altui-favorites-lasttrip-text altui-favorites-mediumtext'>{0} {1}</div>".format( timeGlyph,lasttripdate );
				}
				break;
			case "urn:schemas-upnp-org:device:VSwitch:1":
				html += _deviceDrawFavoriteDefault(device);
				var status = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:VSwitch1', 'Status' );
				status = parseInt(status);
				posthtml += "<div class='{1} altui-favorites-info'>{0}</div>".format(
					status==1 ? "On" : "Off",
					status==1 ? "text-success" : "text-danger"
				);
				break;
			// case "urn:schemas-micasaverde-com:device:PowerMeter:1":
			// 	html += _deviceDrawFavoriteDefault(device);
			// 	var watts = MultiBox.getStatus( device, 'urn:micasaverde-com:serviceId:EnergyMetering1', 'Watts' );
			// 	watts = Math.round(parseFloat(watts)*10)/10
			// 	posthtml += "<div class='bg-light altui-favorites-mediumtext'>{0}W</div>".format(watts || "-");
			// 	break;
			case "urn:schemas-smartmeter-han:device:SmartMeterHAN1:1":
				var kwh = parseFloat(MultiBox.getStatus( device, 'urn:micasaverde-com:serviceId:EnergyMetering1', 'KWH' ));
				if (isNaN(kwh)==false)
					if (kwh > 0) {
						posthtml += "<div class='bg-danger altui-favorites-info altui-favorites-kwh'>{0} kWh</div>".format( Math.round(kwh*10)/10 );
					} else {
						posthtml += "<div class='bg-success altui-favorites-info altui-favorites-kwh'>{0} kWh</div>".format( Math.round(kwh*10)/10 );
					}
				html += _deviceDrawFavoriteDefault(device);
				break;
			case "urn:schemas-rboer-com:device:Envoy:1":
				var kwh = parseFloat(MultiBox.getStatus( device, 'urn:micasaverde-com:serviceId:EnergyMetering1', 'KWH' ));
				if (isNaN(kwh)==false)
					posthtml += "<div class='bg-success altui-favorites-info altui-favorites-kwh'>{0} kWh</div>".format( Math.round(kwh*10)/10 );
				html += _deviceDrawFavoriteDefault(device);
				break;
			case "urn:schemas-upnp-org:device:netmon:1":
				var targets = JSON.parse( MultiBox.getStatus( device, 'urn:upnp-org:serviceId:netmon1', 'Targets' ) );
				var offline = parseInt(MultiBox.getStatus( device, 'urn:upnp-org:serviceId:netmon1', 'DevicesOfflineCount' ));
				posthtml += "<div class='bg-light altui-favorites-info altui-favorites-netmontxt'><span class='text-danger' id='netmon-{0}'>{2}</span> / <span>{1}</span></div>".format( device.altuiid,targets.length,offline)
				html += _deviceDrawFavoriteDefault(device);
				break;
			default:
				var _altuitypesDB = MultiBox.getALTUITypesDB();	// Master controller
				var dt = _altuitypesDB[_getDeviceDrawMapping(device)];
				if (dt!=null && dt.FavoriteFunc!=null ) {
					html += Altui_ExecuteFunctionByName(dt.FavoriteFunc, window, device);
				}
				else
					html += _deviceDrawFavoriteDefault(device);
				break;
		}
		html += (posthtml+"</div></div>");
		return html;
	};

	function _drawFavoriteGauge(device,temp) {
		return '<div class="altui-gauge-favorite" id="altui-gauge-favorite-{0}" data-altuiid="{0}" data-name="{1}" data-temp="{2}"></div>'.format(device.altuiid,device.name,temp);
	};

	function _sceneDrawFavorite(scene,cls,mode) {
		// todo : change altui-favorites-scene-content-box
		return "<div data-altuiid='{1}' class='altui-favorites-scene-content d-flex justify-content-center'><div class='altui-favorites-scene-content-box'>{0}</div></div>".format(runGlyph,scene.altuiid);
	};

	function _registerFavoriteClickHandlers(cls_devices,cls_scenes) {
		cls_devices = '.' + (cls_devices || "altui-favorites-device-content")
		cls_scenes = '.' + (cls_scenes || "altui-favorites-scene-content")
		$(".altui-mainpanel")
			.off("click",cls_scenes)
			.on("click",cls_scenes,function() {
				var altuiid = $(this).data("altuiid");
				$(this).addClass("btn-success").removeClass("btn-light");
				var that = $(this);
				setTimeout( function() { that.removeClass("btn-success").addClass("btn-light") }, 2000 )
				MultiBox.runSceneByAltuiID(altuiid);
				return false;
			})
			.off("click",cls_devices)
			.on("click",cls_devices,function() {
				var altuiid = $(this).data("altuiid");
				var device = MultiBox.getDeviceByAltuiID(altuiid);
				switch( device.device_type) {
					case "urn:schemas-upnp-org:device:BinaryLight:1":
						var status = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:SwitchPower1', 'Status' );
						MultiBox.runAction(device,"urn:upnp-org:serviceId:SwitchPower1","SetTarget", {newTargetValue:1-parseInt(status||1)});
						break;
					case "urn:schemas-micasaverde-com:device:DoorLock:1":
						var status = MultiBox.getStatus( device, 'urn:micasaverde-com:serviceId:DoorLock1', 'Status' );
						MultiBox.runAction(device,"urn:micasaverde-com:serviceId:DoorLock1","SetTarget", {newTargetValue:1-parseInt(status||1)});
						break;
					case "urn:schemas-micasaverde-com:device:WindowCovering:1"	:
					case "urn:schemas-upnp-org:device:DimmableLight:1":
					case "urn:schemas-upnp-org:device:DimmableRGBLight:1":
						var status = parseInt(MultiBox.getStatus(device,"urn:upnp-org:serviceId:Dimming1","LoadLevelStatus") || 1);
						MultiBox.runAction( device , "urn:upnp-org:serviceId:Dimming1", "SetLoadLevelTarget", {newLoadlevelTarget: ((status>0) ? 0 : 100) } );
						break;
					case "urn:schemas-upnp-org:device:VSwitch:1":
						MultiBox.runAction( device, "urn:upnp-org:serviceId:VSwitch1","ToggleState", {} );
						break;
					case "urn:schemas-upnp-org:device:cplus:1":;
					default:
						UIControler.changePage('Control Panel',[altuiid])
						break;
				}
				return false;
			});
	}

	function _udpateFavoriteDevice(jqelem,device,cls) {
		switch (device.device_type) {
			case "urn:schemas-micasaverde-com:device:VOTS:1":
			case "urn:schemas-micasaverde-com:device:TemperatureSensor:1":
			case "urn:schemas-upnp-org:device:HVAC_ZoneThermostat:1":
			case "urn:schemas-upnp-org:device:Heater:1":
				var temp = parseFloat(MultiBox.getStatus( device, 'urn:upnp-org:serviceId:TemperatureSensor1', 'CurrentTemperature' ));
				var jg = $(jqelem).find(".altui-gauge-favorite").data("justgage");
				jg.refresh(temp,Math.max( jg.config.max, temp));
				break;
			default:
				$(jqelem).replaceWith( _deviceDrawFavorite(device,cls) );
		}
	};

	function _redrawFavorites( bFirst) {
		if ( $(".altui-favorites").length==0 )
			return;

		if (bFirst==true) {
			var favoritesToDraw=[];	// will then be sorted according to last saved preference

			// draw Housemode
			if ((MyLocalStorage.getSettings('ShowHouseMode')==1) && (UIManager.UI7Check()==true) )
				favoritesToDraw.push({name:"housemode"});

			MultiBox.getDevices(null , function(device) { return device.favorite; }, function(devices) {
				$.each(devices, function(idx,device) {
					favoritesToDraw.push({name:"d"+device.altuiid, device:device});
				})

				MultiBox.getScenes(null, function(scene) { return scene.favorite; }, function (scenes) {
					$.each(scenes, function(idx,scene) {
						favoritesToDraw.push({name:"s"+scene.altuiid, scene:scene});
					})
				})
			});

			// reorder favorites
			//["housemode", "meteo", "d0-178", "d0-65", "d0-63", "d0-137", "d0-138", "d0-112", "d0-191", "d0-188", "d0-147", "s0-43", "s0-44"]
			var favoritesOrder = MyLocalStorage.getSettings('FavoritesOrder');
			if (favoritesOrder!=null) {
				function findIndexByName(name) {
					for (var k=0; k<favoritesToDraw.length; k++ ) {
						if ( favoritesToDraw[k].name == name )
							return k;
					}
					return -1;
				}
				var posToInsert = 0;
				for(var i=0; i<favoritesOrder.length; i++) {
					var j = findIndexByName( favoritesOrder[i] )
					if (j!=-1) {
						var temp =	favoritesToDraw[posToInsert ];
						favoritesToDraw[posToInsert ] = favoritesToDraw[j];
						favoritesToDraw[j] = temp;
						posToInsert ++;
					}
				}
			}
			// draw them
			// CSS technique of http://stackoverflow.com/questions/20456694/grid-of-responsive-squares
			var favoriteTemplate = "<div id='{0}' class=' altui-favorites-device ' >";
				favoriteTemplate += "<div class='altui-favorites-device-container' >";
						favoriteTemplate += "<div class='altui-favorites-title text-truncate'>";
							favoriteTemplate += "<small class='text-info'>";
							favoriteTemplate += "{1}";
							favoriteTemplate += "</small>";
						favoriteTemplate += "</div>";
					// favoriteTemplate += "<div class='altui-favorites-table'><div class='altui-favorites-table-cell'>";
						favoriteTemplate += "{2}";
					// favoriteTemplate += "</div></div>";
				favoriteTemplate += "</div>";
			favoriteTemplate += "</div>";

			var html = "";

			if ( MyLocalStorage.getSettings('ShowWeather')==1 ) {
				html += "<div class='altui-favorites d-flex flex-wrap align-content-start'>"
				html += '<div class="flex-fill">'+MyLocalStorage.getSettings('WeatherWidgetCode')+'</div>'
				html += "</div>";
			}

			html += "<div class='altui-favorites altui-favorites-sortable d-flex flex-wrap align-content-start'>";

			$.each(favoritesToDraw,function(idx,fav) {
				if (fav.name == "housemode" ) {
					var housemodeTemplate = "";
					housemodeTemplate += "<div id='{0}' class=' altui-favorites-housemode' >";
						housemodeTemplate += "<div class='altui-favorites-device-container d-flex flex-row flex-wrap' >";
						housemodeTemplate += "{1}";
						housemodeTemplate += "</div>";
					housemodeTemplate += "</div>";
					html +=(housemodeTemplate.format("housemode", HouseModeEditor.displayModes3('altui-housemode-group','',[]) ))

				} else if (fav.name[0]=="d") {
					html +=favoriteTemplate.format(fav.name,fav.device.name,_deviceDrawFavorite(fav.device,'altui-favorites-device-content'));

				} else if (fav.name[0]=="s") {
					html +=favoriteTemplate.format(fav.name,fav.scene.name,_sceneDrawFavorite(fav.scene))

				}
			});

			// close col & row

			html += "</div>";

			$(".altui-favorites").replaceWith(html);

			// do JS run actions, after DOM is in place
			var ws = MultiBox.getWeatherSettings();
			if ((ws.tempFormat==undefined) || (ws.tempFormat==""))
				ws.tempFormat=MyLocalStorage.getSettings('TempUnitOverride');

			var valueFontColor = getCSS('color','text-info');
			$(".altui-gauge-favorite").each(function(idx,elem) {
				var altuiid = $(elem).data('altuiid');
				var temp = $(elem).data("temp");
				var gageCfg = $.extend(
					{
						min:0,
						max: (ws.tempFormat.toLowerCase() == 'c') ? 40 : 110
					} ,
					$(elem).data("altuiconfig")
					);
				gageCfg.max = Math.max(5*Math.ceil(temp/5), gageCfg.max);
				gageCfg.min = Math.min(5*Math.floor(temp/5), gageCfg.min);
				var g = new JustGage({
					id: "altui-gauge-favorite-"+altuiid,
					value: temp,
					min: gageCfg.min,
					max: gageCfg.max,
					relativeGaugeSize: true,
					formatNumber: true,
					minLabelMinFontSize:17,
					maxLabelMinFontSize:17,
					decimals:1,
					valueFontColor: valueFontColor,
					customSectors: {
						percents: false,
						ranges: [{
							color : "#0000ff",
							lo : -99,
							hi : 0
							},{
							color : "#00ff00",
							lo : 1,
							hi : 20
							},{
							color : "#ff0000",
							lo : 21,
							hi : 999
						}]
					}
				});
				$(elem).data("justgage",  g).data("altuiconfig",gageCfg);
				return true;
			});
			// resize favorite
			_resizeFavorites();

			// make them sortable
			$( ".altui-favorites-sortable" ).sortable({
				disabled: (MyLocalStorage.getSettings('LockFavoritePosition')==1) ,
				containment:".altui-mainpanel",
				tolerance: "pointer",
				cursor: "move",
				delay: 200,
				distance: 10,
				// placeholder: "altui-favorites-device",
				revert: true,
				// start: function (ui,event) {
					// if (MyLocalStorage.getSettings('LockFavoritePosition')==1) {
						// $( ".altui-favorites-sortable" ).sortable( "option", "disabled", true ).sortable("refresh");
					// }
				// },
				stop: function( ui,event) {
					var sortedFavorites = $( ".altui-favorites-sortable" ).sortable( "toArray" );
					MyLocalStorage.setSettings('FavoritesOrder',sortedFavorites);
				}
				// scroll: false
			});

			// update order
			var sortedFavorites = $( ".altui-favorites-sortable" ).sortable( "toArray" );
			MyLocalStorage.setSettings('FavoritesOrder',sortedFavorites);

			// start the housemode refresh sequence
			UIManager.drawHouseMode();

		} else {
			// refresh all existing favorites
			$(".altui-favorites-device").not(".altui-norefresh").each( function(idx,elem) {
				var content = $(elem).find(".altui-favorites-device-content");
				if (content.length>0) {
					var altuiid = content.data("altuiid");
					var device = MultiBox.getDeviceByAltuiID(altuiid);
					_udpateFavoriteDevice(content,device,"altui-favorites-device-content");
					return true;
				}
				var content = $(elem).find(".altui-favorites-scene-content");
				if (content.length>0) {
					var altuiid = content.data("altuiid");
					var scene = MultiBox.getSceneByAltuiID(altuiid)
					$(content).replaceWith( _sceneDrawFavorite(scene) );
				}
			});
			// resize favorite
			_resizeFavorites();
		}
	};

	function sanitizePageName(name)
	{
		return name.replace(' ','_').replace('\'','')
	};
	function _refreshUI( bFull ) {
		// refresh rooms
		// refresh devices
		//AltuiDebug.debug("_refreshUI( {0}, {1} )".format(bFull,bFirstTime));

		// $(".altui-device") which do not have a btngroup in open state
		// to avoid a refresh to erase an opened popup menu
		$(".altui-device:not(.altui-norefresh)").not(":has(div.btn-group.open)").each( function( index, element) {
		// $(".altui-device:not(:has(div.btn-group.open))").not(".altui-norefresh").each( function( index, element) {
			var devid = $(this).data("altuiid");
			var device = MultiBox.getDeviceByAltuiID( devid );
			if ( (device!=null) && (bFull==true || device.dirty==true) ) {

				// get HTML for device and draw it
				var Html = _deviceDraw(device);
				device.dirty=false;
				$(this).replaceWith(  Html );

				// draw job information.
				if (device.Jobs != undefined) {
					$.each( device.Jobs, function( idx, job ) {
						PageMessage.jobMessage( device,job );
					});
				}
				else
				{
					PageMessage.clearJobMessage( device );
				}
			}
		});

		// refresh scenes
		$(".altui-scene").not(".altui-norefresh").each( function(index,element) {
			var altuiid = $(element).data("altuiid");
			var scene = MultiBox.getSceneByAltuiID( altuiid );
			// get HTML for scene and draw it
			if (scene) {
				var html = _sceneDraw( scene);
				$(element).replaceWith(	 html );
			}
			else {
				$(element).parent().remove();
			}
		});

		// refresh custom pages
		if ($(".altui-page-contents").not(".altui-norefresh").length>0)
		{
			var pagename = _getActivePageName();
			var page = PageManager.getPageFromName( pagename );
			// for all widget present which need refresh
			var selector = "#altui-page-content-{0} .altui-widget".format( sanitizePageName(pagename) );
			$(selector).each( function (idx,elem) {
				var widgetid = $(elem).prop('id');
				var widget = PageManager.getWidgetByID( page, widgetid );
				var tool = _getToolByClass( widget.cls );
				if (tool.no_refresh !=true) {
					var html = _getWidgetHtml( widget, false, page );	// not edit mode
					$(elem).replaceWith( html );
				} else {
					// even for no refresh we may be forced to refresh due to a trigger
					if (widget.properties.triggerdeviceid && widget.properties.triggerdeviceid!=NULL_DEVICE) {
						var trig = MultiBox.getDeviceByAltuiID(widget.properties.triggerdeviceid );
						var stat = MultiBox.getStatus(trig, widget.properties.triggerservice, widget.properties.triggervariable )
						if ((stat!=null) && (stat!=widget.properties.triggerlastvalue)) {
							var html = _getWidgetHtml( widget, false, page );	// not edit mode
							$(elem).replaceWith( html );
						}
					}
				}
			});
			_updateDynamicDisplayTools( false );
		}

		// refresh favorites
		_redrawFavorites(false);
	};

	var ALTUI_hometimer=null;
	function _stoprefreshModes() {
		// console.log("stop refresh");
		if (ALTUI_hometimer!=null)
			clearTimeout(ALTUI_hometimer);
	};

	function _refreshModes() {
		// console.log("refresh");
		_stoprefreshModes();
		if (UIManager.UI7Check()==true) {
			MultiBox.getHouseMode( function (mode) {
				// console.log("mode="+mode);
				if (mode) {
					$("div.altui-housemode3 .altui-housemodeglyph").removeClass("text-success text-info")
					$("#altui-mode"+mode+" .altui-housemodeglyph").addClass("text-success");
				}
				ALTUI_hometimer=setTimeout( _refreshModes, 10000 );
			});
		};
	};

	function _initOptions(serveroptions) {
		if (isNullOrEmpty(serveroptions)) {
			serveroptions="{}";
		}
		var options = JSON.parse(serveroptions);
		var serversideOptions = MyLocalStorage.getSettings("ServerSideOptions")

		// init all options
		var options = [_userOptions,_editorOptions,_meteoOptions]
		$.each(options, function(i,optarr) {
			$.each(optarr, function(idx,opt) {
				// if null, set the default
				if (MyLocalStorage.getSettings(opt.id) == null)
					MyLocalStorage.setSettings(opt.id, opt._default);
				// if serverside is selected
				if ( (serversideOptions==true) && (options[opt.id] != undefined ) ) {
					var v= atob(options[opt.id])
					if (isInteger(v)) v= parseInt(v);
					MyLocalStorage.setSettings(opt.id, v );
				}
			})
		});

		var dbtags = $.extend( true, { names:{}, devicemap:{} } , MyLocalStorage.getSettings('DeviceTags') )
		MyLocalStorage.setSettings('DeviceTags', dbtags);
	};
	function _forceOptions(name,value) {
		$.each( _userOptions, function(idx,opt) {
			if (opt.id == name ) {
				MyLocalStorage.setSettings(opt.id, value);
				opt.hidden = true;
				return;
			}
		});
		AltuiDebug.debug("_forceOptions() : Undefined option name:%s",name);
	};
	function _initBlockly(callback) {
		var language = getQueryStringValue("lang") || window.navigator.userLanguage || window.navigator.language;
		language = language.substring(0, 2);
		var len = $('script[src="J_ALTUI_b_lua_compressed.js"]').length;
		if (len==0) {
			show_loading(_T("Loading...") )
			_loadScript("J_ALTUI_b_blockly_compressed.js",function() {
				_loadScript("J_ALTUI_b_blocks_compressed.js",function() {
					_loadScript("J_ALTUI_b_"+language+".js",function() {
						_loadScript("J_ALTUI_b_javascript_compressed.js",function() {
							_loadScript("J_ALTUI_b_lua_compressed.js",function() {
								hide_loading()
								if ($.isFunction(callback))
									(callback)();
							});
						});
					});
				});
			});
		}
		else {
			if ($.isFunction(callback))
				(callback)();
		}
	}
	/*
	function _initACEandJoint() {
		// $("title").before("<link rel='stylesheet' type='text/css' href='//cdnjs.cloudflare.com/ajax/libs/jointjs/0.9.7/joint.css'>");
		$.when( HtmlResourcesDB.loadResourcesAsync([
				"https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.5/ace.js",
				"https://cdnjs.cloudflare.com/ajax/libs/jointjs/0.9.7/joint.shapes.devs.min.js"
				// "http://www.jointjs.com/js/vendor/lodash/lodash.min.js",
				// "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.6.1/lodash.min.js",
				]) )
			.done(function(){
			})
	};
	*/
	function _initMultiSelect() {
		$("title").before("<style type='text/css'>{0}</style>".format(bootstrap_multiselect_css));
	};

	function _initUIStyles(css) {
		$("title").before("<style type='text/css'>{0}</style>".format(css));
	};

	function _setTitle(title) {
		$("title").text(title);
	};

	function _setTheme(themecss) {
		if (themecss==null) {
			$("link.altui-theme").remove();
			g_ALTUI.g_CustomTheme = "";
			MyLocalStorage.setSettings("Theme","");
		} else {
			var org_theme = g_ALTUI.g_OrgTheme;
			// console.log("org theme ='%s'",org_theme)
			if (isNullOrEmpty(themecss)) {
				themecss = trim(MyLocalStorage.getSettings("Theme")	 || '' );
				// console.log("org theme null, taking LocalStorage value ='%s'",themecss)
				if (isNullOrEmpty(themecss)) {
					themecss = g_ALTUI.g_OrgTheme;
					// console.log("LocalStorage theme null, taking g_OrgTheme %s",themecss)
				}
			}

			// console.log("saving LocalStorage value '%s'",themecss)
			g_ALTUI.g_CustomTheme = themecss;
			MyLocalStorage.setSettings("Theme",themecss);

			var link = $("link.altui-theme");
			if (link.length==0) {
				// console.log("Adding new <link>",themecss)
				// alert('insert '+themecss)
				$("title").after("<link class='altui-theme' rel='stylesheet' href='"+themecss+"'>");
				link = $("link.altui-theme");
			} else {
				// console.log("Updating <link>",themecss)
				// alert('update '+themecss)
				if ( $(link).attr('href') != themecss )
					$(link).attr('href',themecss);
			}
		}
	};

	function _initUI(styles, devicetypes, themecss, serveroptions, cbfunc) {
		var dfd = $.Deferred()
		_initOptions(serveroptions);
		_initUIStyles(styles);
		_setTheme(themecss);
		_initMultiSelect();
		_initDB(devicetypes,function() {
			if ($.isFunction(cbfunc)) {
				(cbfunc)();
			}
			dfd.resolve(true)
		});
		// _initACEandJoint();
		// _initBlockly();
		return dfd.promise();
	};

	function _clearScripts() {
	};

	//------------------------------------------------------------
	//	CUSTOM PAGE MENU
	//------------------------------------------------------------

	var startpos = null;
	var _widgetOnCanvasResizableOptions = function(tool) {
		return {
			aspectRatio: tool.aspectRatio || false,		// no aspect ratio by default
			grid: [ 5,5 ],
			containment: "parent",
			// resize: function( event, ui ) {
				// var pagename = _getActivePageName();
				// var page = PageManager.getPageFromName( pagename );
				// var widgetid = $(ui.helper).prop('id');
				// (tool.onWidgetResize)(page,widgetid,ui.position,ui.size);
			// },
			stop: function( event, ui ) {
				var pagename = _getActivePageName();
				var page = PageManager.getPageFromName( pagename );
				var widgetid = $(ui.helper).prop('id');
				(tool.onWidgetResize)(page,widgetid,ui.position,ui.size);
				PageManager.updateChildrenInPage( page, widgetid, ui.position, ui.size );
				_showSavePageNeeded(true);
			}
		}
	};

	// one page if specified, all pages otherwise
	var _widgetOnCanvasDraggableOptions = function() {
		return {
			grid: [ 5,5 ],
			cancel: false,	// prevent draggable to be cancelled on disabled buttons
			// helper: "clone",
			revert: "invalid",
			// snap: true,
			// snapMode: "inner",
			// snapTolerance: 20,
			start: function(event, ui) {
				startpos = ui.position;
				$(this).toggleClass("ui-selected");
			},
			drag: function(event, ui) {
				// take all selected elements except me and fix their position to make them move.
				var page = PageManager.getPageFromName( _getActivePageName() );
				var canvas = $( _getPageSelector( page ) );
				var selected = canvas.find(".altui-widget.ui-selected").not("#"+ui.helper.prop('id'));
				selected.each( function(index,elem) {
					var elempos = $(elem).position();
					$(elem).css ({
						top: elempos.top + (ui.position.top-startpos.top),
						left: elempos.left + (ui.position.left-startpos.left)
					})
				});
				startpos = ui.position;
				// console.log( "selected:"+selected.length+", "+JSON.stringify(startpos) + ":" + JSON.stringify(ui.position) );
			},
			stop: function(event, ui) {
				var page = PageManager.getPageFromName( _getActivePageName() );
				var canvas = $( _getPageSelector( page ) );
				startpos = null;
				var selected = canvas.find(".altui-widget.ui-selected").not("#"+ui.helper.prop('id'));
				var maxwidth = canvas.width();
				var maxheight = canvas.height();
				selected.each( function(index,elem) {
					var elempos = $(elem).position();
					if (elempos.top <= 0)
						$(elem).css ('top',0);
					if (elempos.top + $(elem).height() >= maxheight)
						$(elem).css ('top',maxheight - $(elem).height() );
					if (elempos.left <= 0)
						$(elem).css ('left',0);
					if (elempos.left+$(elem).width() >= maxwidth)
						$(elem).css ('left',maxwidth - $(elem).width() );
				});
			}
		};
	};

	// ------------------------------------------
	// Property dialog box for toolbox widgets
	// ------------------------------------------
	function _replaceElementKeepAttributes( selector, html ) {
		var oldobject = $(selector);
		var cls = oldobject.attr('class');
		var style = oldobject.attr('style');
		var newobject = $(html).attr('class',cls).attr('style',style);
		oldobject.replaceWith(newobject);
		return $(selector);
	};

	function _replaceWidget(widget) {
		var tool = _getToolByClass( widget.cls );
		var html = _getWidgetHtml(widget,true);
		var page = PageManager.getPageFromName( _getActivePageName() );
		var selector = _getWidgetSelector(page,widget);
		$(selector).draggable("disable");
		_replaceElementKeepAttributes( selector, html );
		$(selector).draggable(_widgetOnCanvasDraggableOptions());
		if ($.isFunction( tool.onWidgetResize) ) {
			$(selector).resizable( _widgetOnCanvasResizableOptions(tool) );
		}
		if ($.isFunction( tool.onWidgetDisplay ) ) {
			(tool.onWidgetDisplay)(page,widget.id, true);
		}
	};
	function _showSavePageNeeded(bNeeded) {
		$("#altui-page-action-save")
			.toggleClass("btn-danger",bNeeded)
	};

	function _onPropertyImage(real_widget) {
		// clone for temporary storage
		var widget = $.extend( true, {}, real_widget );
		var pagename = _getActivePageName();
		var page = PageManager.getPageFromName( pagename );

		var properties = widget.properties;
		var propertyline = "";
		propertyline += "		<div class='form-group'>";
		propertyline += "			<label for='altui-widget-imgsource'>Image Source</label>";
		propertyline += "			<input id='altui-widget-imgsource' class='form-control' type='url' value='{0}' placeholder='enter url or data URI here'></input>";
		propertyline += "		</div>";
		var dialog = DialogManager.registerDialog('dialogModal',
						defaultDialogModalTemplate.format( 'dialogModal',
						'Image Properties',																// title
						propertyline.format( widget.properties.url.htmlEncode() ),	// body
						"modal-lg",	// size
						""	// glyph icon
					));

		DialogManager.dlgAddDialogButton($('div#dialogModal'), true, _T("Save Changes"));
		// buttons
		$('div#dialogModal form').off('submit');
		$('div#dialogModal form').on( 'submit', function() {
			var newurl = $('#altui-widget-imgsource').val();
			if (newurl != real_widget.properties.url) {
				real_widget.properties.url = $('#altui-widget-imgsource').val();
				_showSavePageNeeded(true);
				var obj = $( _getWidgetSelector(page,real_widget) )
				obj.resizable( "option", "aspectRatio", false );
				obj.css( { width:'auto', height:'auto' } );
				obj.find("img").attr("src",real_widget.properties.url);
				obj.resizable( "option", "aspectRatio", true );
			}
			$('div#dialogModal').modal('hide');
		});

		$('div#dialogModal').modal();
	};

	function _onPropertyVariable(real_widget) {

		// clone for temporary storage
		var widget = $.extend( true, {}, real_widget );
		var dialog = DialogManager.createPropertyDialog(_T('Device Variable Properties'));
		DialogManager.dlgAddDevices( dialog , '', widget.properties.deviceid, function() {
			DialogManager.dlgAddLine( dialog, "Template", _T("Template"), widget.properties.template, "Template where {0} is the variable value" );
			DialogManager.dlgAddVariables(dialog, null, widget, function() {
				DialogManager.dlgAddColorPicker(dialog, "Color", _T("Color"), "", widget.properties.color);
				// run the show
				$('div#dialogModal').modal();
			});
		});

		// buttons
		$('div#dialogs')
		.off('submit',"div#dialogModal form")
		.on( 'submit',"div#dialogModal form", function() {
			// save for real this time
			real_widget.properties.deviceid = widget.properties.deviceid;
			real_widget.properties.template = $('#altui-widget-Template').val();
			real_widget.properties.color = $('#altui-widget-Color').val();
			var selected = MultiBox.getStateByID( real_widget.properties.deviceid,$("#altui-select-variable").val() );
			real_widget.properties.service = selected.service;
			real_widget.properties.variable = selected.variable;
			$('div#dialogModal').modal('hide');
			_showSavePageNeeded(true);
			_replaceWidget(real_widget);
		});
	};

	function _onPropertyLabel(widget) {
		var dialog = DialogManager.createPropertyDialog('Label Properties');
		DialogManager.dlgAddLine(dialog, "Label", _T("Button Label"), widget.properties.label, "");
		DialogManager.dlgAddColorPicker(dialog, "Color", _T("Color"), "", widget.properties.color);

		// buttons
		$('div#dialogs')
		.off('submit',"div#dialogModal form")
		.on( 'submit',"div#dialogModal form", function() {
			widget.properties.label = $('#altui-widget-Label').val();
			widget.properties.color = $('#altui-widget-Color').val();
			$('div#dialogModal button.btn-primary').off('click');
			$('div#dialogModal').modal('hide');
			_showSavePageNeeded(true);
			_replaceWidget(widget);
		});

		$('div#dialogModal').modal();
	};

	function _onPropertyRunscene(real_widget)
	{
		var lines = $.map( glyphList, function(g) {
			// var str = "{0} {1}".format( glyphTemplate.format( g, g , '') , g )
			return { value: g, text:g }
		} )
		lines.unshift( { value: '', text:_T("None" ) } )
		// clone for temporary storage
		var widget = $.extend( true, {}, real_widget );
		var dialog = DialogManager.createPropertyDialog('Run Scene Properties');
		DialogManager.dlgAddScenes( dialog , widget, function() {
			DialogManager.dlgAddLine(dialog, "Label", _T("Button Label"), widget.properties.label, "");
			DialogManager.dlgAddSelectGlyph(dialog, "Glyph", _T("Button Glyph or empty"), widget.properties.glyph, lines, null )
			// run the show
			$('div#dialogModal').modal();
		});

		// buttons
		$('div#dialogs')
		.off('submit',"div#dialogModal form")
		.on( 'submit',"div#dialogModal form", function() {
			$('div#dialogModal button.btn-primary').off('click');
			real_widget.properties.sceneid = $('#altui-widget-sceneid').val();
			real_widget.properties.label = $("#altui-widget-Label").val();
			real_widget.properties.glyph = $("#altui-widget-Glyph").val();
			$('div#dialogModal').modal('hide');
			_showSavePageNeeded(true);
			_replaceWidget(real_widget);
		});
	};

	function _onPropertyUpnpAction(real_widget)
	{
		var lines = $.map( glyphList, function(g) {
			// var str = "{0} {1}".format( glyphTemplate.format( g, g , '') , g )
			return { value: g, text:g }
		} )
		lines.unshift( { value: '', text:_T("None" ) } )

		// clone for temporary storage
		var widget = $.extend( true, {}, real_widget );
		var dialog = DialogManager.createPropertyDialog('UPnP Action Properties');
		DialogManager.dlgAddDevices( dialog , '', widget.properties.deviceid, function() {
			DialogManager.dlgAddActions("altui-widget-action",dialog, widget, widget.properties, _T('Action'), function() {
				DialogManager.dlgAddLine(dialog, "Label", _T("Button Label"), widget.properties.label, "");
				DialogManager.dlgAddSelectGlyph(dialog, "Glyph", _T("Button Glyph or empty"), widget.properties.glyph, lines, null )
				// run the show
				$('div#dialogModal').modal();
			});
		});

		// dialog Save Button
		$('div#dialogs')
		.off('submit',"div#dialogModal form")
		.on( 'submit',"div#dialogModal form", function() {
			// save for real this time
			real_widget.properties.deviceid = widget.properties.deviceid;
			real_widget.properties.service = widget.properties.service;
			real_widget.properties.action = widget.properties.action;
			real_widget.properties.label = $("#altui-widget-Label").val();
			real_widget.properties.glyph = $("#altui-widget-Glyph").val();

			// read params
			real_widget.properties.params={};
			$("div.altui-widget-action-parameters input").each( function(idx,elem)
			{
				var value = $(elem).val();
				var name = $(elem).prop('id').substring( "altui-widget-action-parameters-".length );
				real_widget.properties.params[name]=value;
			});
			$('div#dialogModal').modal('hide');
			_showSavePageNeeded(true);
			_replaceWidget(real_widget);
		});
	};

	function _onPropertyOnOffButton(real_widget)
	{
		// clone for temporary storage
		var widget = $.extend( true, {}, real_widget );
		var dialog = DialogManager.createPropertyDialog('OnOff Button Properties');

		DialogManager.dlgAddDevices( dialog , '', widget.properties.deviceid, function() {
			DialogManager.dlgAddCheck(dialog,'DisplayIcon',widget.properties.displayicon,_T("Display with device Icon"));
			DialogManager.dlgAddVariables(dialog, null, widget, function() {
				DialogManager.dlgAddLine(dialog,'ValueON', _T('Value ON'),widget.properties.onvalue,"",{placeholder:"Leave empty for 1 or true"},"col-6");
				DialogManager.dlgAddLine(dialog,'ValueOFF', _T('Value OFF'),widget.properties.offvalue,"",{placeholder:"Leave empty for 0 or false or null"},"col-6");
				DialogManager.dlgAddLine(dialog,'OnLabel', _T('OnLabel'), widget.properties.labels[1],"",null,"col-6");
				DialogManager.dlgAddLine(dialog,'OffLabel', _T('OffLabel'),widget.properties.labels[0],"",null,"col-6");
				DialogManager.dlgAddCheck(dialog,'Inverted',widget.properties.inverted);
				DialogManager.dlgAddActions("altui-widget-action-off",dialog, widget, widget.properties.action_off, _T('Action to switch OFF'), function() {
					DialogManager.dlgAddActions("altui-widget-action-on",dialog, widget, widget.properties.action_on, _T('Action to switch ON'), function() {
						// run the show
						$('div#dialogModal').modal();
					});
				});
			});
		});

		// dialog Save Button
		$('div#dialogs')
			.off('submit',"div#dialogModal form")
			.on( 'submit',"div#dialogModal form", function() {
			// save for real this time
			if (widget.properties.deviceid==0)
				return;	// mandatory data
			real_widget.properties.deviceid = widget.properties.deviceid;
			real_widget.properties.inverted = $("#altui-widget-Inverted").is(':checked');
			real_widget.properties.displayicon = $("#altui-widget-DisplayIcon").is(':checked');
			var selected = MultiBox.getStateByID( real_widget.properties.deviceid,$("#altui-select-variable").val() );
			real_widget.properties.variable = selected.variable;
			real_widget.properties.service = selected.service;
			real_widget.properties.onvalue = trim($("#altui-widget-ValueON").val().toString());
			real_widget.properties.offvalue = trim($("#altui-widget-ValueOFF").val().toString());
			real_widget.properties.action_off = DialogManager.getDialogActionValue("altui-widget-action-off");
			real_widget.properties.labels[0] = $("#altui-widget-OffLabel").val();
			real_widget.properties.action_on = DialogManager.getDialogActionValue("altui-widget-action-on");
			real_widget.properties.labels[1] = $("#altui-widget-OnLabel").val();
			// read params
			real_widget.properties.action_on.params={};
			$("div.altui-widget-action-on-parameters input").each( function(idx,elem)
			{
				var value = $(elem).val();
				var name = $(elem).prop('id').substring( "altui-widget-action-on-parameters-".length );
				real_widget.properties.action_on.params[name]=value;
			});
			// read params
			real_widget.properties.action_off.params={};
			$("div.altui-widget-action-off-parameters input").each( function(idx,elem)
			{
				var value = $(elem).val();
				var name = $(elem).prop('id').substring( "altui-widget-action-off-parameters-".length );
				real_widget.properties.action_off.params[name]=value;
			});
			$('div#dialogModal').modal('hide');
			_showSavePageNeeded(true);
			_replaceWidget(real_widget);
		});
	};

	function _onPropertyFrame(real_widget)
	{
		// clone for temporary storage
		var widget = $.extend( true, {}, real_widget );
		var tool = _getToolByClass( widget.cls );
		var dialog = DialogManager.createPropertyDialog(_T('Frame Properties'));
		DialogManager.dlgAddLine(dialog, "Label", _T("Frame Label"), widget.properties.label, "");
		DialogManager.dlgAddLine(dialog, "CSS", _T("background CSS"), widget.properties.css, "");
		DialogManager.dlgAddUrl(dialog, "Url", _T("IFrame Url"), widget.properties.url, _T("Optional, if specified frame will be filled in with this url"), {});
		$('div#dialogModal').modal();
		// buttons
		$('div#dialogs')
			.off('click')
			.on('click','.altui-url-test',function() {
				var id = $(this).data("forinput");
				var url = $("input#"+id).val();
				window.open( url, '_blank');
			})
			.off('submit',"div#dialogModal form")
			.on( 'submit',"div#dialogModal form", function() {
				real_widget.properties.label = $("#altui-widget-Label").val();
				real_widget.properties.css = $("#altui-widget-CSS").val();
				real_widget.properties.url = $("#altui-widget-Url").val();
				$('div#dialogModal').modal('hide');
				_showSavePageNeeded(true);
				_replaceWidget(real_widget);
			});
	};

	function _onPropertyIcon(real_widget)
	{
		// clone for temporary storage
		var widget = $.extend( true, {}, real_widget );
		var dialog = DialogManager.createPropertyDialog('Device Icon Properties');

		DialogManager.dlgAddDevices( dialog , '', widget.properties.deviceid, function() {
			DialogManager.dlgAddScenes( dialog , widget, function() {
				DialogManager.dlgAddActions("altui-widget-action",dialog, widget, widget.properties, _T('Or Action to Run'), function() {
					// run the show
					$('div#dialogModal').modal();
				});
			});
		});

		// buttons
		$('div#dialogs')
			.off('submit',"div#dialogModal form")
			.on( 'submit',"div#dialogModal form", function() {
			// save for real this time
			real_widget.properties.deviceid = $("#altui-select-device").val();
			real_widget.properties.sceneid = $('#altui-widget-sceneid').val();
			if (real_widget.properties.sceneid==0)
				real_widget.properties.sceneid = NULL_SCENE;
			real_widget.properties.service = widget.properties.service;
			real_widget.properties.action = widget.properties.action;
			// read params
			real_widget.properties.params={};
			$("div.altui-widget-action-parameters input").each( function(idx,elem)
			{
				var value = $(elem).val();
				var name = $(elem).prop('id').substring( "altui-widget-action-parameters-".length );
				real_widget.properties.params[name]=value;
			});
			$('div#dialogModal').modal('hide');
			$('div#dialogModal button.btn-primary').off('click');
			$('div#dialogModal').modal('hide');
			_showSavePageNeeded(true);
			_replaceWidget(real_widget);
		});
	};

	function _onResizeStub(page, widgetid, position, size)
	{
	};

	function _onAdjustSliderSize(widget) {
		var slider = $("#altui-slider-{0}".format(widget.id)) //.height(widget.size.height/2).width(widget.size.width/2)
		if (widget.properties.horizontal == true )
			slider.width(widget.size.width-20).css({left:10})
		else
			slider.height(widget.size.height - $("#altui-slider-{0}".format(widget.id)).siblings("span").height()-20 ).css({top:10})
	}
	function _onResizeSlider(page, widgetid, position, size)
	{
		var widget = PageManager.getWidgetByID( page, widgetid );
		// var tool = _getToolByClass( widget.cls );
		widget.size = size;
		_replaceWidget(widget);
		_onAdjustSliderSize(widget);
	};

	function _onResizeCamera(page, widgetid, position, size)
	{
		var widget = PageManager.getWidgetByID( page, widgetid );
		// var tool = _getToolByClass( widget.cls );
		widget.size = size;
		_replaceWidget(widget);
	};

	function _onResizeGauge(page, widgetid, position, size)
	{
		var widget = PageManager.getWidgetByID( page, widgetid );
		// var tool = _getToolByClass( widget.cls );
		widget.size = size;
		_onDisplayGauge(page,widgetid,true);
	};

	function _onPropertyCamera(real_widget)
	{
		// clone for temporary storage
		var widget = $.extend( true, {}, real_widget );
		var dialog = DialogManager.createPropertyDialog('Camera Properties');

		MultiBox.getDevices(null, null,
			function(devices) {
				DialogManager.dlgAddDevices2(dialog, 'altui-select-device', widget.properties.deviceid, _T("Device"), devices.filter(
					function(device) {		// filter function
						return (device.device_type=="urn:schemas-upnp-org:device:DigitalSecurityCamera:2") || (device.device_type=="urn:schemas-upnp-org:device:DigitalSecurityCamera:1");
					})
				);
				DialogManager.dlgAddDevices2(dialog, 'altui-device-trigger', widget.properties.triggerdeviceid, _T("Trigger"), devices);
				var triggerwidget = {properties: {}};
				triggerwidget.properties.deviceid=widget.properties.triggerdeviceid;
				triggerwidget.properties.service=widget.properties.triggerservice;
				triggerwidget.properties.variable=widget.properties.triggervariable;
				DialogManager.dlgAddVariables(dialog, 'altui-device-trigger', triggerwidget, function() {
					DialogManager.dlgAddLine(dialog,'Value', _T('Value'), widget.properties.triggervalue);
					DialogManager.dlgAddLine(dialog,'Multiply', _T('Size Factor'), widget.properties.multiplyfactor);
					// run the show
					$('div#dialogModal').modal();
				});
			}
		);

		// buttons
		$('div#dialogs')
			.off('submit',"div#dialogModal form")
			.on( 'submit',"div#dialogModal form", function() {
			// save for real this time
			real_widget.properties.deviceid = $("#altui-select-device").val();
			real_widget.properties.triggerdeviceid = $("#altui-device-trigger").val();
			var variable = $('#altui-select-variable').val();
			if (real_widget.properties.triggerdeviceid && variable) {
				var selected = MultiBox.getStateByID( real_widget.properties.triggerdeviceid ,variable );
				real_widget.properties.triggerservice = selected.service;
				real_widget.properties.triggervariable =selected.variable;
				real_widget.properties.triggervalue =$('#altui-widget-Value').val();
				real_widget.properties.multiplyfactor =$('#altui-widget-Multiply').val();
				real_widget.size = $.extend({ width:Math.floor(300*640/480), height:300},widget.size);
				$('div#dialogModal button.btn-primary').off('click');
				_showSavePageNeeded(true);
				var tool = _getToolByClass( real_widget.cls );
				_replaceWidget(real_widget);
			}
			$('div#dialogModal').modal('hide');
		});
	};

	function _onPropertySlider(real_widget) {
		// clone for temporary storage
		var widget = $.extend( true, {}, real_widget );

		var dfds = [];
		$.each(MultiBox.getDevicesSync(), function(idx,device) {
			dfds.push( MultiBox.getDeviceService(device,"urn:upnp-org:serviceId:Dimming1") );
		});
		$.when.apply($, dfds).then(function() {
			// arguments : [ [ xml, textStatus, jqxhr ], ... ]
			// clone to avoid loosing the jqxhr as it sees jquery recycles it
			var devices = [];
			var args = new Array(arguments.length);
			for (var i = 0; i < args.length; ++i) {
				if (arguments[i].service!=null)
					devices.push( arguments[i].device )
			}

			var dialog = DialogManager.createPropertyDialog('Slider Properties');
			DialogManager.dlgAddLine(dialog, "Label", _T("Label"), widget.properties.label, "");
			DialogManager.dlgAddCheck(dialog,'Horizontal',widget.properties.horizontal,_T('Horizontal Slider'));
			DialogManager.dlgAddDevices2( dialog , 'altui-select-device', widget.properties.deviceid, _T("Device"), devices );
			DialogManager.dlgAddVariables(dialog, null, widget, function() {
				DialogManager.dlgAddActions("altui-widget-action",dialog, widget, widget.properties, _T('Action'), function() {
					// run the show
					$('div#dialogModal').modal();
				}, "urn:upnp-org:serviceId:Dimming1");	// filter on this service
			} , "urn:upnp-org:serviceId:Dimming1" )	// filter on this service

			// dialog Save Button
			$('div#dialogs')
			.off('submit',"div#dialogModal form")
			.on( 'submit',"div#dialogModal form", function() {
				// save for real this time
				real_widget.properties.deviceid = widget.properties.deviceid;
				real_widget.properties.horizontal = $("#altui-widget-Horizontal").prop('checked');

				var selected = MultiBox.getStateByID( real_widget.properties.deviceid,$("#altui-select-variable").val() );
				real_widget.properties.service = selected.service;
				real_widget.properties.variable = selected.variable;

				real_widget.properties.action = widget.properties.action;
				real_widget.properties.label = $("#altui-widget-Label").val();

				// read params
				real_widget.properties.params={};
				$("div.altui-widget-action-parameters input").each( function(idx,elem)
				{
					var value = $(elem).val();
					var name = $(elem).prop('id').substring( "altui-widget-action-parameters-".length );
					real_widget.properties.params[name]=value;
				});
				$('div#dialogModal').modal('hide');
				_showSavePageNeeded(true);
				_replaceWidget(real_widget);
			});
		})
	};

	function _onPropertyGauge(real_widget) {
		// clone for temporary storage
		var widget = $.extend( true, {}, real_widget );
		var dialog = DialogManager.createPropertyDialog('Gauge Properties');
		DialogManager.dlgAddDevices( dialog , '', widget.properties.deviceid, function() {
			DialogManager.dlgAddVariables(dialog, null, widget, function() {
				DialogManager.dlgAddLine(dialog,'Label', _T('Label'), widget.properties.label);
				DialogManager.dlgAddCheck(dialog,'RedFirst',widget.properties.inverted,_T('Red First'));
				DialogManager.dlgAddLine(dialog,'Min', _T('Min'), widget.properties.min);
				DialogManager.dlgAddLine(dialog,'Zone1', _T('Zone 1'), widget.properties.greenfrom);
				DialogManager.dlgAddLine(dialog,'Zone2', _T('Zone 2'), widget.properties.orangefrom);
				DialogManager.dlgAddLine(dialog,'Zone3', _T('Zone 3'), widget.properties.redfrom);
				DialogManager.dlgAddLine(dialog,'Max', _T('Max'), widget.properties.max);
				DialogManager.dlgAddLine(dialog,'Ticks', _T('Ticks'), widget.properties.majorTicks.join(','),'nn,nn,nn');
				// run the show
				$('div#dialogModal').modal();
			});
		});

		// buttons
		$('div#dialogs')
			.off('submit',"div#dialogModal form")
			.on( 'submit',"div#dialogModal form", function() {
			// save for real this time
			if (widget.properties.deviceid==0)
				return;	// mandatory data
			real_widget.properties.deviceid = widget.properties.deviceid;
			real_widget.size = $.extend({ width:120, height:120},widget.size);
			var states = MultiBox.getStatesByAltuiID( widget.properties.deviceid );
			var variable = $("#altui-select-variable").val();
			if (variable!=null) {
				var selected = MultiBox.getStateByID( real_widget.properties.deviceid,variable );
				real_widget.properties.variable = selected.variable;
				real_widget.properties.service = selected.service;
				real_widget.properties.inverted = $("#altui-widget-RedFirst").prop('checked');
				real_widget.properties.label = $("#altui-widget-Label").val();
				real_widget.properties.min = $("#altui-widget-Min").val();
				real_widget.properties.max = $("#altui-widget-Max").val();
				real_widget.properties.greenfrom = $("#altui-widget-Zone1").val();
				real_widget.properties.orangefrom = $("#altui-widget-Zone2").val();
				real_widget.properties.redfrom = $("#altui-widget-Zone3").val();
				var ticks = $("#altui-widget-Ticks").val();
				real_widget.properties.majorTicks = ticks.split(',');
				_showSavePageNeeded(true);

				// refresh widget
				var pagename = _getActivePageName();
				var page = PageManager.getPageFromName( pagename );
				_onDisplayGauge(page,real_widget.id,true);
			}
			$('div#dialogModal').modal('hide');
		});
	}

	function _onDisplayGauge(page,widgetid,bEdit)
	{
		var widget=PageManager.getWidgetByID( page, widgetid );
		var device = MultiBox.getDeviceByAltuiID(widget.properties.deviceid);
		if (device==null)
			return "";
		var value = parseFloat( MultiBox.getStatus(device, widget.properties.service, widget.properties.variable) || 0 );
		var data = google.visualization.arrayToDataTable([
		  ['Label', 'Value'],
		  [widget.properties.label || '', value],
		]);
		if (value > widget.properties.max)
			widget.properties.max = value;
		if (value < widget.properties.min)
			widget.properties.min = value;
		widget.size = $.extend({ width:120, height:120},widget.size);
		var options = {
		  width: widget.size.width,
		  height: widget.size.height,
		  minorTicks: 5,
		  min: widget.properties.min,
		  max: widget.properties.max
		};

		if (widget.properties.majorTicks.length>0)
			options = $.extend(options, {
				majorTicks:	widget.properties.majorTicks
			});

		if ($.isNumeric(widget.properties.greenfrom))
			options = $.extend(options, {
				greenFrom:	widget.properties.greenfrom,
				greenTo:	$.isNumeric(widget.properties.orangefrom) ? widget.properties.orangefrom : widget.properties.max
			});
		if ($.isNumeric(widget.properties.orangefrom))
			options = $.extend(options, {
				yellowFrom:	widget.properties.orangefrom,
				yellowTo:	$.isNumeric(widget.properties.redfrom) ? widget.properties.redfrom : widget.properties.max
			});
		if ($.isNumeric(widget.properties.redfrom))
			options = $.extend(options, {
				redFrom:	widget.properties.redfrom,
				redTo:		widget.properties.max
			});

		if (widget.properties.inverted) {
			function _swap(a,b) { var z=options[a];	 options[a]=options[b]; options[b]=z; }
			_swap("redFrom","greenFrom");
			_swap("redTo","greenTo");
		}
		var chart = new google.visualization.Gauge(document.getElementById("altui-gauge-{0}-{1}".format(page.id,widgetid)));
		chart.draw(data, options);
	};

	// ------------------------------------------
	// Edit Tools
	// ------------------------------------------
	function onAlignTop(selected)
	{
		var min = Math.min.apply(null, $.map( $(selected) , function(elem)	{return $(elem).position().top;}) );
		$(selected).each( function(idx,elem) {
			$(elem).css('top',min);
		});
		_showSavePageNeeded(true);
	};
	function onAlignHorizontal(selected)
	{
		var max = Math.max.apply(null, $.map( $(selected) , function(elem)	{return $(elem).position().top+$(elem).height()/2;}) );
		$(selected).each( function(idx,elem) {
			$(elem).css('top',max-$(elem).height()/2);
		});
		_showSavePageNeeded(true);
	};
	function onAlignBottom(selected)
	{
		var max = Math.max.apply(null, $.map( $(selected) , function(elem)	{return $(elem).position().top+$(elem).height();}) );
		$(selected).each( function(idx,elem) {
			$(elem).css('top',max-$(elem).height());
		});
		_showSavePageNeeded(true);
	};
	function onAlignLeft(selected)
	{
		var min = Math.min.apply(null, $.map( $(selected) , function(elem)	{return $(elem).position().left;}) );
		$(selected).each( function(idx,elem) {
			$(elem).css('left',min);
		});
		_showSavePageNeeded(true);
	};
	function onAlignVertical(selected)
	{
		var max = Math.max.apply(null, $.map( $(selected) , function(elem)	{return $(elem).position().left+$(elem).width()/2;}) );
		$(selected).each( function(idx,elem) {
			$(elem).css('left',max-$(elem).width()/2);
		});
		_showSavePageNeeded(true);
	};
	function onAlignRight(selected)
	{
		var max = Math.max.apply(null, $.map( $(selected) , function(elem)	{return $(elem).position().left+$(elem).width();}) );
		$(selected).each( function(idx,elem) {
			$(elem).css('left',max-$(elem).width());
		});
		_showSavePageNeeded(true);
	};
	function onDistribHorizontal(selected)
	{
		// select all left position
		var positions = $(selected).sort( function(a,b) {
			var l1 = $(a).position().left;
			var l2 = $(b).position().left
			if (l1<l2)
				return -1
			if (l1>l2)
				return 1
			return 0;
		})

		// calculate the regular distribution for all elements
		var length = positions.length;
		if (length<=1)
			return;
		var interval = ( $(positions[length-1]).position().left - $(positions[0]).position().left)/ (length-1)

		// set new position for elements
		var leftpos = $(positions[0]).position().left;
		$.each(positions, function(idx,elem) {
			$(elem).css('left',leftpos);
			leftpos += interval;
		});
		_showSavePageNeeded(true);
	};
	function onDistribVertical(selected)
	{
		// select all top position
		var positions = $(selected).sort( function(a,b) {
			var l1 = $(a).position().top;
			var l2 = $(b).position().top
			if (l1<l2)
				return -1
			if (l1>l2)
				return 1
			return 0;
		})

		// calculate the regular distribution for all elements
		var length = positions.length;
		if (length<=1)
			return;
		var interval = ( $(positions[length-1]).position().top - $(positions[0]).position().top)/ (length-1)

		// set new position for elements
		var pos = $(positions[0]).position().top;
		$.each(positions, function(idx,elem) {
			$(elem).css('top',pos);
			pos += interval;
		});
		_showSavePageNeeded(true);
	};

	// ------------------------------------------
	// public Callback
	// ------------------------------------------
	function _onoffStatus(device,widget) {
		var status = MultiBox.getStatus(device, widget.properties.service, widget.properties.variable);
		if	( ( (widget.properties.offvalue=='') && ((status==undefined) || (status==null) ||(status==false) || (status=='0')) ) ||	 (status==widget.properties.offvalue) )
			status = 0;
		else if ( ((widget.properties.onvalue=='') && ((status=='true') || (status=='1') || (status>=1))) || (status==widget.properties.onvalue) )
			status = 1;
		if (widget.properties.inverted==true)
			status = 1-status;
		return status
	};

	function _onoffOnClick(widgetid) {
		// find the widget
		var pagename = _getActivePageName();
		var page = PageManager.getPageFromName( pagename );
		var widget=PageManager.getWidgetByID( page, widgetid );
		// find the device
		var device= MultiBox.getDeviceByAltuiID(widget.properties.deviceid);
		// trigger the right action
		var status = _onoffStatus(device,widget);
		if (widget.properties.inverted)
			status = 1-status;
		var actiondescriptor = (status==1) ? widget.properties.action_off : widget.properties.action_on;
		MultiBox.runAction( device, actiondescriptor.service, actiondescriptor.action, actiondescriptor.params);
	};

	// ------------------------------------------
	// Master table for toolbox configuration
	// ------------------------------------------
	function _toolHtml(glyph,label) {
		return "<span class='pull-left'>{0}</span><small class='pull-right'>{1}</small>".format(glyph,label);
	};

	function _getToolByClass( cls )
	{
		var result = null;
		$.each(tools, function(idx,tool) {
			if (tool.cls == cls)
			{
				result = tool;
				return false;
			}
		});
		return result;
	};

	function _getActivePageName() {
		var str = $("#altui-page-tabs li .active").text();
		if (str.length != 0)
			return str
		str = $(".altui-page-content-one.active").prop("id");
		return str.substr("altui-page-content-".length).replace('_',' ');
		// return $("#altui-page-tabs li.active").text();
		// return pagename != undefined ? pagename.substring( "altui-page-".length) : '';
	};

	// one page if specified, all pages otherwise
	function _getPageSelector( page ) {
		if (page == undefined)
				return ".altui-page-content-one";
		return "#altui-page-content-{0}".format( sanitizePageName(page.name) );
	};
	function _getWidgetSelector(page,widget) {
		if ((page==undefined) || (widget==undefined))
			return "";
		return _getPageSelector(page)+" .altui-widget#"+widget.id
	};

	function _createPageTabsHtml( bEditMode , idxPage ) {
		if (idxPage ==null)
			idxPage = -1;

		var actions = "";
		var lines = new Array();
		PageManager.forEachPage( function( idx, page) {
			// if ((idxPage==-1) || (idx==idxPage)) {
				lines.push( "<li class='nav-item' id='altui-page-{1}' role='presentation' ><a class='nav-link' href='#altui-page-content-{1}' aria-controls='{1}' role='tab' data-toggle='tab'>{0}</a></li>".format(page.name,sanitizePageName(page.name)) ); // no white space in ID
			// }
		});

		if (bEditMode==true) {
			actions+="<li class='nav-item dropdown' role='presentation' >";
			actions+="<a class='nav-link dropdown-toggle' data-toggle='dropdown' href='#' role='button' aria-expanded='false'>";
			actions+="Actions</a>";
			actions+="<div class='dropdown-menu' role='menu'>";
			actions+="<a class='dropdown-item' id='altui-page-action-new' href='#'>"+_T("New Page")+"</a>";
			actions+="<a class='dropdown-item' id='altui-page-action-properties' href='#'>"+_T("Page Properties")+"</a>";
			actions+="<a class='dropdown-item' id='altui-page-action-delete' href='#'>"+_T("Delete this Page")+"</a>";
			actions+="</div>";
			actions+="</li>";
			actions+="<li class='nav-item'><a class='nav-link' id='altui-page-action-save' href='#'>"+_T("Save All Pages")+"</a></li>";
		}
		return "<ul class='nav nav-tabs {2}' id='altui-page-tabs' role='tablist'>{0}{1}</ul>".format(
			lines.join(''),actions, /*(idxPage==-1) ? '' : "hidden"*/ '');
	};

	function _getWidgetHtml( widget , bEditMode, page )
	{
		var html="";
		if (widget!=null)
		{
			var tool = _getToolByClass( widget.cls )
			widget.properties = $.extend(true,{}, tool.properties, widget.properties);
			var style = (widget.size!=undefined)
				? 'style="width:{0}px; height:{1}px; z-index:{2};"'.format(widget.size.width, widget.size.height,widget.zindex)
				: 'style="z-index:{0};"'.format(widget.zindex);
			html += ("<div class='altui-widget {0} ' id='{1}' data-type='{0}' {2}>").format(widget.cls,widget.id,style);
			html += (tool.widgetdisplay)(widget,bEditMode,page );
			html +="</div>";

			var temp = $(html)
				.css({
					position:'absolute',
					overflow: 'hidden',
					top: widget.position.top,
					left: widget.position.left
				});
			html = $(temp).wrap( "<div></div>" ).parent().html();
		}
		return html;
	};

	function _getPageHtml(page,bEditMode) {
		var height = 0;
		var pageHtml = "<div class='altui-custompage-canvas' style='z-index:0;'>";
		if (page.children)
			$.each(page.children, function(idx,child) {
				pageHtml += _getWidgetHtml( child, bEditMode , page );
				height = Math.max( (child.position.top || 0)  + (child.size.height || 20), height);
			});
		pageHtml += "</div>";
		height = Math.max( 500 , height);
		var pageelem = $(pageHtml).height(height);
		var pageelemhtml = pageelem.wrap( "<div></div>" ).parent().html();
		var str = "<div role='tabpanel' class='tab-pane altui-page-content-one' id='altui-page-content-{0}' >{1}</div>".format(sanitizePageName(page.name),pageelemhtml); // no white space in IDs
		var elem = $(str).css('background',page.background).height(height+1);
		return elem.wrap( "<div></div>" ).parent().html();
	};

	function _updateDynamicDisplayTools( bEdit )
	{
		var pagename = _getActivePageName();
		var page = PageManager.getPageFromName( pagename );
		if (page==null)
			return;
		// var pagename = _getActivePageName();
		// PageManager.forEachPage( function( idx, page) {
		$.each(tools, function(idx,tool) {
			if ($.isFunction( tool.onWidgetDisplay) )
			{
				var selector = "#altui-page-content-{0} .{1}".format(sanitizePageName(page.name),tool.cls);
				$(selector).each( function(idx,elem) {
					var widgetid = $(elem).prop('id');
					(tool.onWidgetDisplay)(page,widgetid, bEdit);		// edit mode
				})
			}
		});
		// });
	};

	function _createControllerSelect(htmlid,cls,required_feature) {
		var html = "";
		// html += "<form class='form-inline col-12 mb-2'>";
			html += "<div class='form-group {0}'>".format(cls||'');
				html += "<label class='col-form-label ' for='altui-controller-select' >"+_T("Controller")+":</label>";
				html += "<select id='"+htmlid+"' class='form-control'>";
				$.each(MultiBox.getControllers(required_feature), function( idx, controller) {
					// var name = controller.ip=='' ? window.location.hostname : controller.ip
					html += "<option value='{0}'>{1}</option>".format( idx , controller.name);
				});
				html += "</select>";
			html += "</div>";
		// html += "</form>";
		return html;
	};

	function _drawCategoryFilter(model) {
		return HTMLUtils.drawDropDown({
			id:'altui-dropdown-category',
			label:tagsGlyph+" "+_T("Category"),
			cls:'altui-dropdown-category',
			options: $.map(model, function(opt,key){
				return { id:key, cls:'altui-quick-jump-type', label:opt.label, glyph:opt.glyph, href:"#"+key }
			})
		})
	}

	function _drawTagFilter(model,deviceTags) {
		return HTMLUtils.drawDropDown({
			id:'altui-dropdown-tags',
			label:tagsGlyph+"<span class='d-none d-sm-inline'> {0}</span>".format(_T("Tags")),
			cls:'d-inline altui-dropdown-tags-cls',
			options: $.map( model, function(tag,idx) {
				// var glyph = glyphTemplate.format( "tags", _T("Category") , 'text-'+tag);
				return { id:'altui-filter-'+tag, cls:'altui-filter-tag', label:deviceTags.names[tag] || tag, glyph:'fa-tags', glyphcls:'text-'+tag}
			})
		});
	};

	var bUIReady = false;
	var bEngineReady = false;

	// explicitly return public methods when this object is instantiated
  return {

	//---------------------------------------------------------
	// UIMANAGER PUBLIC functions
	//---------------------------------------------------------
	initUI			: _initUI,
	initBlockly		: _initBlockly,
	initLocalizedGlobals : _initLocalizedGlobals,
	generateNavBarHTML : _generateNavBarHTML,
	forceOptions	: _forceOptions,	// (name,value)
	loadCSS : _loadCSS,							// (cssLocationAndName)
	loadScript		: _loadScript,		//(scriptLocationAndName)
	loadD3Script	: _loadD3Script,
	loadJointJSScript	: _loadJointJSScript,
	clearScripts	: _clearScripts,
	setTheme		: _setTheme,	//(themecss)
	setTitle		: _setTitle,	// str

	// Action Parameters Helpers
	buildParamsFromArray: _buildParamsFromArray,	//(args)
	buildArrayFromParams: _buildArrayFromParams,	//(args)

	// UI helpers
	// checkAltuiUpdate	: _checkAltuiUpdate,
	googleScript : _googleScript,
	UI7Check			: function() { return _ui7Check; },
	RemoteAccessUrl		: function() { return _remoteAccessUrl; },
	stoprefreshModes	: _stoprefreshModes,
	refreshModes		: _refreshModes,

	// custom panel widget callbacks
	onoffOnClick		: _onoffOnClick,

	//drawing functions
	displayJson			: _displayJson,
	displayLua			: _displayLua,
	displayTimer		: _displayTimer,
	displayTimers		: _displayTimers,
	jobStatusToColor	: _jobStatusToColor,
	defaultDeviceDrawWatts: _defaultDeviceDrawWatts,	// default HTML for Watts & UserSuppliedWattage variable
	defaultDeviceDrawAltuiStrings : _defaultDeviceDrawAltuiStrings,
	drawDefaultFavoriteDevice : _deviceDrawFavoriteDefault,
	deviceIcon			: _deviceIconHtml,				//( device, zindex, onclick )
	deviceDraw			: _deviceDraw,					// draw the mini device on device page; can be customized by a plugin by ["DeviceDrawFunc"]
	deviceDrawVariables : _deviceDrawVariables,			// draw the device variables
	deviceDrawActions	: _deviceDrawActions,			// draw the device Upnp Actions
	deviceDrawControlPanel	: _deviceDrawControlPanel,	// draw the full device control panel page; can be customized by a plugin ["ControlPanelFunc"]
	deviceDrawFavorite  : _deviceDrawFavorite,
	deviceCreate		: _deviceCreate,
	cameraDraw			: _cameraDraw,
	sceneDraw			: _sceneDraw,
	sceneDrawFavorite   : _sceneDrawFavorite,
	refreshUI			: _refreshUI,					//
	refreshUIPerDevice	: _refreshUIPerDevice,
	refreshFooter		: _refreshFooter,

	// breadcumb
	breadCrumb: function( pagecode , title ) {
		function _parentsOf(page) {
			if (page==null)
				return ''

			var onclick_prop = (page.htmlid) ? ("onclick='UIControler.onClickHtml(\"{0}\");return false;'".format(page.htmlid)) : ''
			var thisline = "<li class='breadcrumb-item'><a class='altui-breadcrumd-item' id='altui-breadcrumb-{0}' href='javascript:void(0);' {1} >{2}</a></li>".format(page.id,onclick_prop,_T(page.title));
			var parent = UIControler.getParentPage(page);
			return ( (parent) ? _parentsOf(parent) : '' ) + thisline
		};

		var html = "";
		//html += buttonTemplate.format( -1, 'altui-back',glyphTemplate.format( "backward", _T("Back"), "" ),'default',_T("Back")),
		html +="<ol class='breadcrumb altui-breadcrumb'>";
		html += "<li class='breadcrumb-item'><a class='altui-back' href='javascript:void(0);'>{0}</a></li>".format(glyphTemplate.format( "arrow-left", _T("Back"), "" ));
		var page = UIControler.getPage(pagecode);
		var parent = UIControler.getParentPage(page);
		if (page) {
			html += _parentsOf(parent);
			html += "<li class='breadcrumb-item active'>{0}<span class='altui-page-title'>{1}</span></li>".format(_T(page.title), title ? (": "+title) : '' );
		}
		html+="</ol>";
		return html;
	},
	setCrumbTitle: function(title) {
		$(".altui-page-title").text(title ? (": "+title) : '')
	},

	// pages
	fullColumnLayout: function(title)
	{
		var body="";
		body+="	<div class='altui-layout row'>";
		body+="		<div class='col-12 altui-mainpanel'>";
		body+="		</div>";
		body+="	</div>";
		return body;
	},
	oneColumnLayout: function(title)
	{
		var body="";
		body+="	<div class='altui-layout row'>";
		body+="		<div class='col-12'>";
		body+="			<div class='row'><span class='col-12' id='altui-pagemessage-span'></span><h4 id='altui-pagetitle' class='col-12'>"+title+"</h4></div>";
		body+="			<div class='row altui-mainpanel'></div>";
		body+="		</div>";
		body+="	</div>";
		return body;
	},
	twoColumnLayout: function(title)
	{
		var body="";
		body+="	<div class='altui-layout row'>";
		body+="		<div class='col-sm-2 d-none d-sm-block {0}'>".format( (MyLocalStorage.getSettings('FixedLeftButtonBar') || "")==1 ? 'affix' : '' );
		body+="			<div class='altui-leftnav btn-group-vertical' role='group' aria-label='...'>";
		body+="			</div>";
		body+="		</div>";
		body+="		<div class='col-sm-10'>";
		body+="			<div class='row'><span class='col-12' id='altui-pagemessage-span'></span><h3 class='col-12' id='altui-pagetitle' >"+title+"</h3></div>";
		body+="			<div class='altui-mainpanel row'></div>";
		body+="			</div>";
		body+="		</div>";
		body+="	</div>";
		return body;
	},

	clearPage : function(breadcrumb,title,layout,args,method,context_obj)
	{
		var layoutfunc = layout || UIManager.twoColumnLayout;

		// if it is a UIManager function
		if (arguments.callee.caller && $.isFunction(window["UIManager"][arguments.callee.caller.name]) )
			HistoryManager.pushState( breadcrumb, arguments.callee.caller.name, args ? args : arguments.callee.caller.arguments);
		else
			HistoryManager.pushState( breadcrumb, null, args, method,context_obj);

		// EventBus.unregisterEventHandler("on_ui_deviceStatusChanged");
		UIManager.stoprefreshModes();
		HTMLUtils.stopAllTimers();
		$(".navbar-collapse").removeClass('open');
		$(".altui-layout").remove();
		$("#navbar").off("keyup", "#altui-search-text")
		$("#altui-search-text").val("")

		// do the layout
		var body = (layoutfunc)(title || '' );
		$("div[role=main]").append(body);
		if ( MyLocalStorage.getSettings('StickyFooter')==1 ) {
			$(".altui-layout").addClass("mb-5")
		}

		PageMessage.init(breadcrumb);

		// elements outside of the layout
		$("#dialogs").off().empty();
		$(".altui-scripts").remove();

		// remove Blockly
		$(".blocklyToolboxDiv").remove();
		$("body").append("<div class='altui-scripts'></div>");

		// remove meteo widget script
		$("script#weatherwidget-io-js").remove()

		// install breadCrumb callbacks
		$(".altui-breadcrumd-item").off().on('click',function(e) {
			var id = $(this).prop('id');
		});
		$(".altui-back").off().on('click',function(e) {
			window.history.go(-1)
		});
		$(".altui-mainpanel").off()

		// kill D3 forceSimulation if it exists
		if (simul != null) {
			simul.stop()
			simul=null
		}
	},

	//window.open("data_request?id=lr_ALTUI_Handler&command=home","_self");
	pageDefault : function() {
		var altuidevice = MultiBox.getDeviceByID( 0, g_ALTUI.g_MyDeviceID );
		var defurl = MultiBox.getStatus( altuidevice, "urn:upnp-org:serviceId:altui1", "LocalHome" )
		if ( (defurl=="") || (defurl=="/port_3480/data_request?id=lr_ALTUI_Handler&command=home") )
			UIManager.pageHome()
		else
			window.open(defurl,"_self");
	},

	pageHome : function()
	{
		UIManager.clearPage('Home',_T("Welcome to ALTUI"),UIManager.oneColumnLayout);
		$("#altui-pagetitle").remove();
		$(".altui-mainpanel").append("<div class='col-12'><div class='altui-favorites'></div></div>");
		_registerFavoriteClickHandlers();	// all default classes
		_redrawFavorites( true );
	},

	pageRemoteAccess : function ()
	{
		window.open( _remoteAccessUrl, '_blank');
	},

	// ===========================
	//	Page UI pieces helpers
	// ===========================


	setLeftnavRoomsActive : function ( selectedRoom ) {
		var button = null;
		$(".altui-leftbutton").toggleClass("active",false);
		if ($.isArray(selectedRoom)) {
			$.each(selectedRoom, function(i,room) {
				if (room=="0") {
					button = $(".altui-leftbutton#0");
				} else {
					button = $(".altui-leftbutton:contains('"+room+"')");
				}
				button.toggleClass("active",true);
			});
		} else {
			button = $(".altui-leftbutton[id="+selectedRoom+"]")
			button.toggleClass("active",true);
		}
	},

	leftnavRooms : function ( clickFunction , roomLoadedFunction)
	{
		var leftnav = $(".altui-leftnav");
		$("body").off("click",".altui-leftbutton");
		leftnav.empty()
			.append( leftNavButtonTemplate.format( -1, "", _T("All")) )
			.append( leftNavButtonTemplate.format( -2, "", starGlyph+' '+_T("Favorites")) )
			.append( leftNavButtonTemplate.format( 0, "", _T("No Room")) );

		// install a click handler on button
		if ($.isFunction( clickFunction ))	{
			$("body").on("click",".altui-leftbutton",function() {
				$(this).parent().children().removeClass("active")
				$(this).addClass("active");
				clickFunction.apply($(this), [$(this).prop('id'), $(this).data('altuiid')]);
			});
		}

		MultiBox.getRooms( null,null,function( rooms ) {
			// calculate unique rooms by name
			var namearray = $.map(rooms, function(r) { return r.name;} );
			var filteredrooms = $.grep(rooms, function(room,idx) {
				return $.inArray(room.name ,namearray) == idx;
			});

			$.each(filteredrooms, function(i,room) {
				leftnav.append( leftNavButtonTemplate.format( room.id, room.altuiid, (room!=null) ? room.name : _T("No Room")) );
			})
			if ($.isFunction(roomLoadedFunction))
				(roomLoadedFunction)(rooms);
		});
	},

	// ===========================
	//	Full Pages update Methods
	// ===========================
	pageRooms : function ()
	{
		var _AllDevices = MultiBox.getDevicesSync();
		var _AllScenes= MultiBox.getScenesSync();

		function _roomScenes(room) {
			// devices of the room
			var rcontroller = MultiBox.controllerOf(room.altuiid).controller;
			var selectedscenes=[];
			var possiblescenes = $.grep(_AllScenes,function(s) {
				var scontroller = MultiBox.controllerOf(s.altuiid).controller;
				return (scontroller==rcontroller)
			});
			var scenes =$.grep(possiblescenes,function(s) {
				var scontroller = MultiBox.controllerOf(s.altuiid).controller;
				if ( (scontroller==rcontroller ) && (s.room == room.id) ) {
					selectedscenes.push(s.altuiid);	// is in this room
					return true;	// same controller room
				}
				return false;
			});

			var Html="";
			Html+='<select class="altui-scenes-room" id="{0}" multiple="multiple">'.format(room.altuiid);
			$.each(possiblescenes , function(i,scene){
				Html+='<option value="{0}" {2}>{1}</option>'.format( scene.altuiid,scene.name, ($.inArray(scene.altuiid,selectedscenes)!=-1) ? 'selected':'' );
			});
			Html+='</select>';
			return Html;
		}
		function _roomDevices(room) {
			// devices of the room
			var rcontroller = MultiBox.controllerOf(room.altuiid).controller;
			var selecteddevices=[];
			var possibledevices = $.grep(_AllDevices,function(d) {
				var dcontroller = MultiBox.controllerOf(d.altuiid).controller;
				return (dcontroller==rcontroller)
			});
			var devices =$.grep(possibledevices,function(d) {
				var dcontroller = MultiBox.controllerOf(d.altuiid).controller;
				if (( dcontroller==rcontroller ) && (d.room == room.id)) {
					selecteddevices.push(d.altuiid);	// is in this room
					return true;	// same controller device
				}
				return false;
			});

			var Html="";
			Html+='<select class="altui-devices-room" id="{0}" multiple="multiple">'.format(room.altuiid);
			$.each(possibledevices , function(i,device){
				Html+='<option value="{0}" {2}>{1}</option>'.format( device.altuiid,device.name || "*no name*", ($.inArray(device.altuiid,selecteddevices)!=-1) ? 'selected':'' );
			});
			Html+='</select>';
			return Html;
		};

		UIManager.clearPage('Rooms',_T("Rooms"),UIManager.oneColumnLayout);
		var formHtml="";
		formHtml+=" <form class='col-12'>";
			formHtml+=" <div class='form-row'>";
				formHtml+= _createControllerSelect('altui-controller-select','col-sm-4', "createRoom");
				formHtml+=" <div class='form-group col-sm-8'>";
					formHtml+=' <label class="col-form-label " for="altui-create-room-name">'+_T("Room")+'</label>'
					formHtml+=" <div class='input-group'>";
					formHtml+="		<input id='altui-create-room-name' type='text' class='form-control' placeholder='Room name...'>";
					formHtml+="		<div class='input-group-append'><button id='altui-create-room' class='btn btn-primary' type='button'>"+plusGlyph+"&nbsp;"+_T("Create")+"</button></div>";
					formHtml+="	</div><!-- /input-group -->";
				formHtml+=" </div>";
			formHtml+=" </div>";
		formHtml+="	</div>";

		$(".altui-mainpanel")
			.append( formHtml )
			.append($("<div class='col-12'><table id='table' class='table table-responsive-OFF table-sm'><thead><tr><th>ID</th><th>Name</th><th>Devices</th><th>Scenes</th><th>Actions</th></tr></thead><tbody></tbody></table></div>"));

		var roomListTemplate = "<tr data-altuiid='{0}'><td style='white-space: nowrap'>{0}</td><td style='white-space: nowrap'><span class='altui-room-name' id='{0}'>{1}</span></td><td>{2}</td><td>{3}</td><td style='white-space: nowrap'>{4}</td></tr>";
		MultiBox.getRooms( null,null,function( rooms) {
			if (rooms) {
				$.each(rooms.sort(altuiSortByName), function(idx,room) {
					var id = room.altuiid;
					var delButtonHtml = smallbuttonTemplate.format( id, 'altui-delroom', deleteGlyph);
					var viewButtonHtml = smallbuttonTemplate.format( id, 'altui-viewroom', searchGlyph);
					$(".altui-mainpanel tbody").append( roomListTemplate.format(id,(room!=null) ? room.name : _T("No Room"),_roomDevices(room),_roomScenes(room),viewButtonHtml+delButtonHtml) );
				});

				// display multiselects
				$(".altui-scenes-room").multiselect({
					disableIfEmpty: true,
					enableHTML : true,
					includeSelectAllOption: true,
					maxHeight: 300,
					buttonClass: 'btn btn-light btn-sm',
					onChange: function(element, checked) {
						var scenealtuiid = $(element).val();
						 var scene= MultiBox.getSceneByAltuiID( scenealtuiid );
						 if (checked==false) {
							 scene.room = 0;
						 } else {
							 // put the scene in that room
							 var room_altuiid = $(element).closest(".altui-scenes-room").prop("id")
							 var roominfo = MultiBox.controllerOf(room_altuiid);
							 scene.room = roominfo.id;
						 }
						 MultiBox.editScene(scenealtuiid,scene,function(data) {
								if ( (data!=null) && (data!="ERROR") ) {
									PageMessage.message(_T("Scene {0} edited successfully").format(scene.name), "success");
								}
								else {
									PageMessage.message(_T("Scene {0} could be edited successfully").format(scene.name), "error");
								}
						 });

						 // unselect from other rooms
						 $("tr").each(function(i,tr) {
							 var altuiid = $(tr).data("altuiid")
							 if ( (altuiid!="") && (altuiid != room_altuiid) ) {
								 // deselect the selected device from other menu
								 var multiselect = $(tr).find(".altui-scenes-room");
								 $(multiselect).multiselect('deselect',scenealtuiid);
							 }
						 });
					}
				});

				$(".altui-devices-room").multiselect({
					disableIfEmpty: true,
					enableHTML : true,
					includeSelectAllOption: true,
					maxHeight: 300,
					buttonClass: 'btn btn-light btn-sm',
					onChange: function(element, checked) {
						 // $("#altui-save-rooms").addClass("btn-danger");

						 // if this is a new selection, we need to remove it from other places
						 var device = MultiBox.getDeviceByAltuiID($(element).val());
						 if (checked==false) {
							 // put the device in NO room
							 MultiBox.renameDevice(device, device.name, 0);
						 } else {
							 // put the device in that room if the ctrl of the device and the ctrl of the room matches
							 var room_altuiid = $(element).closest(".altui-devices-room").prop("id")
							 var roominfo = MultiBox.controllerOf(room_altuiid);
							 var deviceinfo = MultiBox.controllerOf(device.altuiid);
							 if (deviceinfo.controller == roominfo.controller) {
								 MultiBox.renameDevice(device, device.name, roominfo.id );

								 // unselect from other rooms
								 $("tr").each(function(i,tr) {
									 var altuiid = $(tr).data("altuiid")
									 if ( (altuiid!="") && (altuiid != room_altuiid) ) {
										 // deselect the selected device from other menu
										 var multiselect = $(tr).find(".altui-devices-room");
										 $(multiselect).multiselect('deselect',device.altuiid);
									 }
								 })
							 } else {
								 alert('mismatch')
							 }
						 }
					},
				});
				// install click handler for buttons
				$("table#table")
					.off("click",".altui-room-name")
					.on("click",".altui-room-name",function(event) {
						var width = $(this).width();
						var id = $(this).prop('id');
						var room = MultiBox.getRoomByAltuiID(id);
						$(this).replaceWith("<input class='altui-room-name-inp form-control form-control-sm' id='{0}' value='{1}'></input>".format(room.altuiid, room.name.escapeXml()));
						$("input#{0}".format(room.altuiid)).width(width);
					})
					.off("focusout",".altui-room-name-inp")
					.on("focusout",".altui-room-name-inp",function(event) {
						var id = $(this).prop('id');
						var room = MultiBox.getRoomByAltuiID(id);
						var oldname = room.name
						var value = $(this).val();
						if (value!=oldname) {
							room.name = value;
							MultiBox.renameRoom(room, room.name );
						}
						$(this).replaceWith("<span class='altui-room-name' id='{0}'>{1}</span>".format(room.altuiid,room.name));
					});
				$("button.altui-viewroom").click( function(event) {
					var id = $(this).prop('id');
					var room = MultiBox.getRoomByAltuiID(id);
					UIControler.changePage('Devices',[{ room:[room.name] }])
				});
				$("button.altui-delroom").click( function(event) {
					var id = $(this).prop('id');
					var room = MultiBox.getRoomByAltuiID(id);
					var tr = $(this).closest("tr");
					DialogManager.confirmDialog(_T("Are you sure you want to delete room")+" ("+id+")",function(result) {
						if (result==true) {
							$(tr).remove();
							MultiBox.deleteRoom( room );
						}
					})
				});
			}
		});

		$(".altui-mainpanel").off('click')
		.on("click","button#altui-create-room",function()
		{
			MultiBox.createRoom(parseInt($("#altui-controller-select").val()),$("#altui-create-room-name").val() );
		})

	},

	pageControlPanel: function( altuiid )
	{
		// var rooms = MultiBox.getRoomsSync();
		var device = MultiBox.getDeviceByAltuiID( altuiid );
		// var controllerid = MultiBox.controllerOf(altuiid).controller;
		var category = MultiBox.getCategoryTitle( device.category_num );

		UIManager.clearPage('Control Panel',"{0} {1} <small>#{2}</small>".format( device.name , category ,altuiid),UIManager.oneColumnLayout);

		//
		// Draw device control panel (attributes+panel+debug)
		//
		$(".altui-mainpanel").append( "<div id='altui-device-controlpanel-container-"+altuiid+"' class='col-12 altui-device-controlpanel-container'></div>" );
		var container = $("#altui-device-controlpanel-container-"+altuiid);
		UIManager.deviceDrawControlPanel( device, container );	//altuiid, device, domparent
		EventBus.registerEventHandler("on_ui_deviceStatusChanged",null,function (eventname,device) {
			$(".altui-device-controlpanel[data-altuiid='"+device.altuiid+"']").not(".altui-norefresh").each( function(index,element) {
				// force a refresh/drawing if needed.
				// the event handler for the tab SHOW event will take care of the display of the tab
				var activeTabIdx = _getActiveDeviceTabIdx();
				var domparent  =  $('div#altui-devtab-content-'+activeTabIdx);
				_displayActiveDeviceTab(activeTabIdx, device, domparent);
			});
		})

		//
		// Manage interactions
		//
		// $(".altui-mainpanel")
			// .off('click','#altui-toggle-attributes,#altui-device-config,#altui-device-usedin,#altui-device-triggers,#altui-device-zwdb')
			// .on('click','#altui-toggle-attributes,#altui-device-config,#altui-device-usedin,#altui-device-triggers,#altui-device-zwdb',function() {
				// $(this).toggleClass("btn-light btn-info")
			// })
		$(".altui-debug-div").toggle(false);						// hide
		$(container).off('click','.altui-deldevice')
					.on('click','.altui-deldevice',	 function(e) {
						var id = $(this).prop('id');
						DialogManager.confirmDialog(_T("Are you sure you want to delete device ({0})").format(id),function(result) {
							if (result==true) {
								MultiBox.deleteDevice(device);
							}
						});
					});

		// resgister a handler on tab click to force a disaply & reload of JS tab , even if already loaded
		$(container).off('click','.altui-device-controlpanel ul#altui-devtab-tabs a')
					.on('click','.altui-device-controlpanel ul#altui-devtab-tabs a',  function(e) {
						// remove the no refresh class so we force a full redisplay of the
						// tab with the latest var values
						var targettab = $(e.target).attr("href").slice("#altui-devtab-content-".length);
						var domparent  =  $('div#altui-devtab-content-'+targettab);
						$(domparent).toggleClass('altui-norefresh',false);
					});

		// register a handler on tab changes to update height of domparent ( usefulk when child are in absolute positioning )
		var container2 = $("#altui-device-controlpanel-"+altuiid);
		$(container2).off('shown.bs.tab', 'a[data-toggle="tab"]');
		$(container2).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
			var controlpanel = $(e.target).closest(".altui-device-controlpanel");
			var altuiid = $(controlpanel).data("altuiid")
			var device = MultiBox.getDeviceByAltuiID( altuiid );
			var activeTabIdx = _getActiveDeviceTabIdx();
			var domparent  =  $('div#altui-devtab-content-'+activeTabIdx);
			_displayActiveDeviceTab(activeTabIdx, device, domparent);
		});
	},

	onDeviceIconError : function( altuiid ) {
		$("div.altui-device[data-altuiid="+altuiid+"] img").attr('src',defaultIconSrc);
		$("img.altui-myhomedevice-icon[data-altuiid="+altuiid+"]").attr('src',defaultIconSrc);
	},

	pageBirdEye: function ( ) {
		var deviceTags = MyLocalStorage.getSettings('DeviceTags')
		var optionalWidth = MyLocalStorage.getSettings('BirdViewItemWidth');
		$('style#BirdEye').remove()
		if (optionalWidth && optionalWidth>0)
			$('head').append('<style id="BirdEye">.altui-custom-width { width:'+optionalWidth+'px; }</style>');

		var roomfilter =  MyLocalStorage.getSettings("DeviceRoomFilter")
		var _deviceDisplayFilter={
			tags:[] ,
			rooms: ((roomfilter =="-1") ? [] : roomfilter) || [],
			categories: MyLocalStorage.getSettings("CategoryFilter")  || [] ,
			sort: MyLocalStorage.getSettings("LastBirdSort") || 'name'
		}
		var _roomIDtoName = {}
		var _roomNametoID = {}
		var deviceTemplate = `
			<div class="card flex-fill altui-custom-width" >
				<div class="card-header text-truncate">
					<span class="altui-experimental-extrainfo">\${roomname} - </span>
					<span title="\${name}-\${altuiid}">\${name}</span>
					<span class="altui-experimental-extrainfo">#\${altuiid}</span>
				</div>
				<div class="card-body d-flex justify-content-center">
					\${icon}
				</div>
			</div>`;

		function _initRoomNameMap() {
			return MultiBox.getRooms(
				function( idx, room) {
					_roomIDtoName[ room.altuiid ] = room.name
					_roomNametoID[ room.name ] = _roomNametoID[ room.name ] || []
					_roomNametoID[ room.name ].push(room.id)
				} ,
				null,
				function() {
					_roomNametoID[_T("No Room")]=[ 0 ]
					for (var i = 0; i<MultiBox.getControllers().length; i++) {
						_roomIDtoName[ "{0}-0".format(i) ] = "0"
					}
				}
			);
		};
		function isTagFilterValid() {
			return _deviceDisplayFilter.tags.length>0
		};
		function isRoomFilterValid() {
			return _deviceDisplayFilter.rooms.length>0
		};
		function isCategoryFilterValid() {
			return _deviceDisplayFilter.categories.length>0
		};
		function _drawRoomFilter() {
			var options = $.map( _roomNametoID, function(idtbl,name) {
				return { id:(name==_T("No Room") ? "0" : name), cls:'altui-quick-jump', label:name, glyph:'fa-home' }
			})
			return HTMLUtils.drawDropDown({
				id:'altui-dropdown-rooms',
				label:eyeOpenGlyph+"<span class='d-none d-sm-inline'> {0}</span>".format(_T("Rooms")),
				cls:'altui-dropdown-rooms',
				options: options,
				selected: _deviceDisplayFilter.rooms
			});
		};
		function _drawSortSelect() {
			var optionGlyph = glyphTemplate.format("cogs",_T("Options"))
			var selected = []
			selected.push(_deviceDisplayFilter.sort)
			return HTMLUtils.drawDropDown({
				id:'altui-dropdown-sort',
				label:optionGlyph+"<span class='d-none d-sm-inline'> {0}</span>".format(_T("Sort")),
				cls:'altui-dropdown-sort',
				options: [
					{ id:'altuiid', cls:'altui-option-sort', label:_T("ID"), glyph:'fa-sort-numeric-asc' },
					{ id:'name', cls:'altui-option-sort', label:_T("Name"), glyph:'fa-sort-alpha-asc' },
					{ id:'type', cls:'altui-option-sort', label:_T("Type"), glyph:'fa-plug' },
					{ id:'room', cls:'altui-option-sort', label:_T("Room"), glyph:'fa-home' },
				],
				selected: selected
			});
		};
		function _generateToolBar() {
			var html =_drawCategoryFilter(categoryFilters);
			html += _drawTagFilter(tagModel, deviceTags)
			html += _drawRoomFilter()
			html += _drawSortSelect()
			return html
		};
		function _onClickHeader(e) {
			var card = $(this).closest(".card")
			$(card).toggleClass("zoomed")
		};
		function _onChangeSortOption(e) {
			$("#altui-dropdown-sort .altui-option-sort").removeClass("active btn-light btn-info")
			$(this).toggleClass("active")
			var active = $("#altui-dropdown-sort .altui-option-sort.active")[0]
			_deviceDisplayFilter.sort = $(active).prop('id')
			MyLocalStorage.setSettings("LastBirdSort",_deviceDisplayFilter.sort)
			_draw();
		};
		function _onChangeRoomFilter(e) {
			$(this).toggleClass("active")
			var roominfo = MultiBox.controllerOf($(this).prop('id'))
			var active = $(this).hasClass("active")
			_deviceDisplayFilter.rooms = $.map( $("#altui-dropdown-rooms .altui-quick-jump.active"), function(elem,idx) {
				return $(elem).prop('id')
			})
			MyLocalStorage.setSettings("DeviceRoomFilter",_deviceDisplayFilter.rooms);
			if ( MyLocalStorage.getSettings('SyncLastRoom')==1 )
				MyLocalStorage.setSettings("SceneRoomFilter",_deviceDisplayFilter.rooms);
			_draw();
		};
		function _onChangeTagFilter(e) {
			$(this).toggleClass("active")
			_deviceDisplayFilter.tags = $.map( $("#altui-dropdown-tags .altui-filter-tag.active"), function(elem,idx) {
				return $(elem).prop('id').substr("altui-filter-".length)
			})
			_draw();
		};
		function _onChangeCategoryFilter(e) {
			$(this).toggleClass("active")
			_deviceDisplayFilter.categories = $.map( $("#altui-dropdown-category .altui-quick-jump-type.active"), function(elem,idx) {
				return $(elem).prop('id')
			})
			MyLocalStorage.setSettings("CategoryFilter",_deviceDisplayFilter.categories);
			_draw();
		};
		function _getDeviceModel(device) {
			var info = MultiBox.controllerOf(device.altuiid)
			var room = MultiBox.getRoomByAltuiID( MultiBox.makeAltuiid(info.controller,device.room))
			return {
				name: device.name,
				roomname : room ? room.name : '',
				altuiid: device.altuiid,
				icon: UIManager.deviceDrawFavorite(device,null,DEVICEDRAW_CONCISE).replace(/altui-favorites-/g,'altui-experimental-')
			}
		};
		function _getSceneModel(scene) {
			var info = MultiBox.controllerOf(scene.altuiid)
			var room = MultiBox.getRoomByAltuiID( MultiBox.makeAltuiid(info.controller,scene.room))
			return {
				name: scene.name,
				roomname : room ? room.name : '',
				altuiid: scene.altuiid,
				icon: UIManager.sceneDrawFavorite(scene,null,DEVICEDRAW_CONCISE).replace(/altui-favorites-/g,'altui-experimental-')
			}
		};
		function onUpdateDeviceFlex(eventname,device) {
			var jqelem = $(".altui-experimental-device-content[data-altuiid={0}]".format(device.altuiid))
			var zoomed = $(jqelem).closest(".card").hasClass("zoomed")
			var disabled = $(jqelem).closest(".card").hasClass("disabled")
			if ((jqelem.length>0) && (disabled==false)) {
				$(jqelem).closest(".card").replaceWith( (_tplFunc)(_getDeviceModel(device)) )
				var jqelem = $(".altui-experimental-device-content[data-altuiid={0}]".format(device.altuiid))
				$(jqelem).closest(".card").toggleClass("zoomed",zoomed).css("background-color","lightblue")
				setTimeout( ()=>{$(jqelem).closest(".card").css("background-color","")} , 0 )
			}
		};
		function _sortFunction(a,b) {
			switch( _deviceDisplayFilter.sort ) {
				case 'name':
					a= a.device ? a.device.name : 'zzz' + a.scene.name
					b= b.device ? b.device.name : 'zzz' + b.scene.name
					break;
				case 'type':
					a= a.device ? a.device.device_type  : 'zzz' + a.scene.name
					b= b.device ? b.device.device_type  : 'zzz' + b.scene.name
					break;
				case 'altuiid':
					var ainfo = MultiBox.controllerOf(a.device ? a.device.altuiid : '999-'+a.scene.name)
					var binfo = MultiBox.controllerOf(b.device ? b.device.altuiid : '999-'+b.scene.name)
					a= ainfo.controller*10000000 + parseInt(ainfo.id)
					b= binfo.controller*10000000 + parseInt(binfo.id)
					break
				case 'room':
					var aobj = a.device ? a.device : a.scene
					var bobj = b.device ? b.device : b.scene
					var ainfo = MultiBox.controllerOf(aobj.altuiid)
					var binfo = MultiBox.controllerOf(bobj.altuiid)
					a= _roomIDtoName[  MultiBox.makeAltuiid(ainfo.controller,aobj.room)  ] || 'undef'
					b= _roomIDtoName[  MultiBox.makeAltuiid(binfo.controller,bobj.room)  ] || 'undef'
					break;
				default:
					a=1;b=1;
					break
			}
			if (a==b)
				return 0
			return (a<b) ? -1 : 1
		};
		var elements=[];
		function _drawDevices() {
			function _drawDeviceFlex(idx, device) {
				elements.push({ device:device, html:(_tplFunc)(_getDeviceModel(device)) })
			}
			function _filterfunc(device) {
				var curdevicetags =  deviceTags.devicemap['_'+device.altuiid] || []
				var intersect = curdevicetags.filter(value => -1 !== _deviceDisplayFilter.tags.indexOf(value));
				var deviceinfo = MultiBox.controllerOf(device.altuiid)
				var deviceroomaltuiid = MultiBox.makeAltuiid(deviceinfo.controller, device.room)
				var deviceroomname = _roomIDtoName[ deviceroomaltuiid ]

				function _devicetypeIsListed( devtype, catlist) {
					var bFound=false;
					$.each(catlist, function(idx,aCat) {
						if (-1 !==  categoryFilters[aCat].types.indexOf(devtype) ) {
							bFound=true
							return false;
						}
					})
					return bFound
				}
				return 		( (device.invisible==undefined) || ( device.invisible!="1") )
						&& 	( ( isTagFilterValid()==false ) || (intersect.length!=0) )
						&&  ( ( isRoomFilterValid()==false ) || ( -1 !==_deviceDisplayFilter.rooms.indexOf(deviceroomname) ) )
						&&  ( ( isCategoryFilterValid()==false ) || (_devicetypeIsListed( device.device_type,_deviceDisplayFilter.categories )))
			}

			return MultiBox.getDevices( _drawDeviceFlex , _filterfunc, null);
		};
		function _drawScenes() {
			function _drawSceneFlex(idx,scene) {
				elements.push({ scene:scene, html:(_tplFunc)(_getSceneModel(scene)) })
			}
			function _filterfunc(scene) {
				var sceneinfo = MultiBox.controllerOf(scene.altuiid)
				var sceneroomaltuiid = MultiBox.makeAltuiid(sceneinfo.controller, scene.room)
				var sceneroomname =  _roomIDtoName[ sceneroomaltuiid ]
				return ( ( isRoomFilterValid()==false ) || ( -1 !==_deviceDisplayFilter.rooms.indexOf(sceneroomname) ) );
			}

			return 	MultiBox.getScenes( _drawSceneFlex , _filterfunc, null);
		};
		function _draw()
		{
			elements=[];
			var dfd = $.Deferred();
			$(".altui-mainpanel").html("")
			$("#altui-dropdown-rooms .dropdown-toggle").toggleClass("btn-info",isRoomFilterValid()).toggleClass("btn-light",isRoomFilterValid()==false)
			$("#altui-dropdown-tags .dropdown-toggle").toggleClass("btn-info",isTagFilterValid()).toggleClass("btn-light",isTagFilterValid()==false)
			$("#altui-dropdown-category .dropdown-toggle").toggleClass("btn-info",isCategoryFilterValid()).toggleClass("btn-light",isCategoryFilterValid()==false)
			// prepared defered calls
			var toload = [
				_drawDevices(),
				_drawScenes()
			];
			// when all is done, signal we are ready
			$.when.apply( $, toload)
			.done( function(  ) {
				// sort
				elements.sort( _sortFunction )
				// display
				$(".altui-mainpanel").append( '<div class="altui-experimental d-flex flex-wrap align-content-start">'+elements.map( (e)=>e.html ).join("")+'</div>' )
				if (ALTUI_registered === false) {
					setTimeout( function() {
						PageMessage.message( _T("Note: Bird Eye view is limited to 20 items for non registered users"), "danger");
						$(".altui-experimental > .card:gt(20)").addClass("disabled")
					},500 )
				}
				dfd.resolve();
			} )
			.fail( function(  ) {
				dfd.reject();
			} );
			return dfd.promise();
		};
		function _registerInteractivity() {
			$(".altui-filter-tag").click(_onChangeTagFilter)
			$(".altui-quick-jump").click(_onChangeRoomFilter)
			$(".altui-quick-jump-type").click(_onChangeCategoryFilter)
			$(".altui-option-sort").click(_onChangeSortOption)
			$(".altui-mainpanel").off('click', '.altui-experimental .card-header')
				.on('click', '.altui-experimental .card-header', _onClickHeader)
			_registerFavoriteClickHandlers("altui-experimental-device-content","altui-experimental-scene-content")
			// if ($.support.touch!=true) {
			// 	$(".altui-experimental")
			// 		.off('mouseenter mousleave')
			// 		.on('mouseenter', '.card', function() {
			// 			$(this).addClass("zoomed")
			// 		})
			// 		.on('mouseleave', '.card', function() {
			// 			$(this).removeClass("zoomed")
			// 		})
			// }
			EventBus.registerEventHandler("on_ui_deviceStatusChanged",null,onUpdateDeviceFlex)
		};

		UIManager.clearPage('BirdEye',_T("Bird Eye"),UIManager.oneColumnLayout);
		$("#altui-pagetitle").remove();
		var _tplFunc = _.template(deviceTemplate)

		$.when( _initRoomNameMap() )
		.then( function() {
			var html = _generateToolBar()
			$("#altui-toggle-messages").after( html );
			$.when( _draw() )
			.then(  _registerInteractivity() )
		})
	},

	pageMyHome: function ( key, args )
	{
		var staremtpyGlyph =glyphTemplate.format( "star-o", _T("Favorite"), "altui-favorite text-muted" );
		var starGlyph = glyphTemplate.format( "star", _T("Favorite"), "altui-favorite text-warning" );
		var deviceTags = MyLocalStorage.getSettings('DeviceTags');

		var _roomsNameToID = {};
		var limit = (ALTUI_registered===false) ? 5 : null;

		function _deviceIcon(device) {
			return UIManager.deviceIcon(device)
				.replace('altui-device-icon','altui-myhomedevice-icon')
				.replace('alt=\'','data-altuiid="{0}" alt=\''.format(device.altuiid))
		}

		function _deviceInfo(device) {
			function _armed(str) { return (str==1) ? 'Armed' : '' }
			function _locked(str) { return (str==1) ? 'Locked' : '' }
			function _firstelem(str) { return (str || "").split(",")[0] }
			function _daynight(str) { return (str==1) ? 'Day' : 'Night' }
			function _netmonstats(str) {
				var arr = JSON.parse(str)
				var offline = $.grep(arr, function(item) {return item.tripped=="1"} ).length
				return "<span class='text-danger'>{0}</span>/{1}".format(offline, Object.keys(arr).length );
			}
			var arr= [
				{service:'urn:toggledbits-com:serviceId:AutoVirtualThermostat1', variable:'DisplayTemperature'},
				{service:'urn:upnp-org:serviceId:DistanceSensor1', variable:'CurrentDistance'},
				{service:'urn:micasaverde-com:serviceId:ScaleSensor1', variable:'Weight'},
				{service:'urn:upnp-org:serviceId:WindSensor1', variable:'AvgSpeed,Direction', format:'{0}km/h {1}&deg;'},
				{service:'urn:upnp-org:serviceId:BarometerSensor1', variable:'CurrentPressure', format:'{0} hPa'},
				{service:'urn:upnp-org:serviceId:IPhoneLocator1', variable:'Distance,Unit', format:'{0} {1}' },
				{service:'urn:upnp-org:serviceId:Dimming1', variable:'LoadLevelStatus', format:'{0}%' },
				{service:'urn:upnp-org:serviceId:TemperatureSensor1', variable:'CurrentTemperature', format:'{0}&deg;' },
				{service:'urn:micasaverde-com:serviceId:EnergyMetering1', variable:'Watts', format:'{0} W' },
				{service:'urn:micasaverde-com:serviceId:EnergyMetering1', variable:'KWH', format:'{0} kWh' },
				{service:'urn:micasaverde-com:serviceId:EnergyMetering1', variable:'Daily', format:'{0}' },
				{service:'urn:micasaverde-com:serviceId:SecuritySensor1', variable:'LastTrip', format:'<small>{0}</small>', translate:HTMLUtils.enhanceValue },
				{service:'urn:micasaverde-com:serviceId:LightSensor1', variable:'CurrentLevel', format:'{0}' },
				{service:'urn:micasaverde-com:serviceId:HumiditySensor1', variable:'CurrentLevel', format:'{0}%' },
				{service:'urn:micasaverde-com:serviceId:PowerMeter1', variable:'Volts', format:'{0} V' },
				{service:'urn:micasaverde-com:serviceId:SecuritySensor1', variable:'Armed', format:'{0}', translate:_armed },
				{service:'urn:micasaverde-com:serviceId:DoorLock1', variable:'Status', format:'{0}', translate:_locked },
				{service:'urn:upnp-org:serviceId:cplus1', variable:'CurrentChannel', format:'{0}', translate:_firstelem},
				{service:'urn:upnp-org:serviceId:VSwitch1', variable:'Text1,Text2', format:'<small>{0} {1}</small>'},
				{service:'urn:dcineco-com:serviceId:MSwitch1', variable:'Text1,Text2', format:'<small>{0} {1}</small>'},
				{service:'urn:a-lurker-com:serviceId:InfoViewer1', variable:'LuaPattern' },
				{service:'urn:rts-services-com:serviceId:DayTime', variable:'Status', translate:_daynight },
				{service:'urn:upnp-org:serviceId:AVTransport', variable:'CurrentStatus', format:'<small>{0}</small>'},
				{service:'urn:micasaverde-com:serviceId:GenericSensor1', variable:'CurrentLevel', format:'{0}' },
				{service:'urn:upnp-org:serviceId:netmon1', variable:'DevicesStatus', format:'{0}', translate:_netmonstats },
			]
			var tpl = "<span class='altui-device-info'>{0}</span>"
			for (var i=0 ; i<arr.length ; i++) {
				var vars = arr[i].variable.split(",")
				if (MultiBox.getStatus( device, arr[i].service, vars[0] ) != null) {
					var strings = []
					for (var j=0; j<vars.length; j++) {
						var val = MultiBox.getStatus( device, arr[i].service, vars[j] ) || ""
						if ($.isFunction(arr[i].translate)) {
							val = arr[i].translate(val)
						}
						strings.push(  val )
					}
					var template = arr[i].format || '{0}'
					var result = String.prototype.format.apply(template,strings)
					return tpl.format( result )
				}
			}
			return tpl.format(" ")
		}

		function _tableScenes(roomname) {
			var search = $("#altui-search-text").val().toUpperCase();
			var scenes = MultiBox.getScenesSync().filter( function(scene) {
				var found = false;
				var sceneinfo = MultiBox.controllerOf(scene.altuiid)
				var sceneroom = scene.room
				$.each(_roomsNameToID[roomname], function(idx,roominfo) {
					if	( ( (roominfo.controller==sceneinfo.controller) && (roominfo.id==sceneroom) ) ||
						  ( (roominfo.id==0) && (0==sceneroom) ) )
					{
						found = true;
						return false;
					}
				})
				return ( found==true ) && ( (search.length==0) || (roomname.toUpperCase().contains(search)==true) || (scene.name.toUpperCase().contains(search)==true) )
			});
			var arr = $.map( scenes, function(s,i) {
				return {
					id:s.altuiid,
					name:((s.favorite==true) ? starGlyph : staremtpyGlyph) + s.name,
					run: smallbuttonTemplate.format( s.altuiid, 'altui-favorites-scene-content', runGlyph, _T("Run"), 'data-altuiid="{0}"'.format(s.altuiid) )
				}
			})
			return (arr.length>0) ? HTMLUtils.array2Table(arr,'id',[],null,'altui-myhome-scenes','htmlid',false) : null
		}

		function _tableDevices(roomname,filteredDeviceTypes,filteredTags) {
			var search = $("#altui-search-text").val().toUpperCase();
			var devices = MultiBox.getDevicesSync().filter( function(device) {
				var found = false
				var deviceinfo = MultiBox.controllerOf(device.altuiid)
				var deviceroom = device.room
				$.each(_roomsNameToID[roomname], function(idx,roominfo) {
					if ( ((roominfo.controller==deviceinfo.controller) && (roominfo.id==deviceroom)) ||
						 ((roominfo.id==0) && (deviceroom==0)) )
					{
						found = true;
						return false;
					}
				})
				var key = '_'+device.altuiid;
				// var intersect = curdevicetags.filter(value => -1 !== _deviceDisplayFilter.tags.indexOf(value));
				return (found==true)
						&& (device.invisible != true)
						&& ( (search.length==0) || (roomname.toUpperCase().contains(search)==true) || (device.name.toUpperCase().contains(search)==true) )
						&& ( (filteredDeviceTypes.length==0) || ($.inArray(device.device_type , filteredDeviceTypes)!=-1) )
						&& ( (filteredTags.length==0) || ( deviceTags.devicemap[key]  && ( deviceTags.devicemap[key].filter( value => -1!==filteredTags.indexOf(value) ).length>0 ) ) )
			});
			var arr = $.map( devices, function(d,i) {
				return {id:d.altuiid, name:"<span class='altui-myhome-favorite'>{0}</span>".format((d.favorite==true) ? starGlyph : staremtpyGlyph)+d.name, action:_deviceIcon(d), val:_deviceInfo(d)}
			})
			return (arr.length>0) ? HTMLUtils.array2Table(arr,'id',[],null,'altui-myhome-devices','htmlid',false) : null
		}

		function _generateNavTabs(name, tbldevice, tblscene) {
			var altuiid = $.map(_roomsNameToID[name] , function(o) {return MultiBox.makeAltuiid(o.controller,o.id)}).join("_")
			var html = '<nav class="nav nav-tabs" id="myTab" role="tablist">'
			if (tbldevice)
				html += '<a class="nav-item nav-link active" id="nav-device-tab" data-toggle="tab" href="#nav-device-{0}" role="tab" aria-controls="nav-device" aria-expanded="true">Devices</a>'.format(altuiid)
			if (tblscene)
				html += '<a class="nav-item nav-link" id="nav-scene-tab" data-toggle="tab" href="#nav-scene-{0}" role="tab" aria-controls="nav-scene">Scenes</a>'.format(altuiid)
			html += '</nav>'
			html += '<div class="tab-content" id="nav-tabContent">'
			if (tbldevice)
				html += '<div class="tab-pane fade show active" id="nav-device-{1}" role="tabpanel" aria-labelledby="nav-home-tab">{0}</div>'.format(tbldevice,altuiid)
			if (tblscene)
				html += '<div class="tab-pane fade" id="nav-scene-{1}" role="tabpanel" aria-labelledby="nav-profile-tab">{0}</div>'.format(tblscene,altuiid)
			html += '</div>'
			return html
		}

		// $("#altui-toggle-messages").after("<a class='btn btn-light' role='button' href='#{0}'>{0}</a>".format(model.name))
		function _updateQuickJumpBar() {
			function _updateDropdown(cls) {
				if ( $(cls + ' button.dropdown-item.active').length >0 )
					$(cls + ' .dropdown-toggle').removeClass("btn-light").addClass("btn-info")
				else
					$(cls + ' .dropdown-toggle').addClass("btn-light").removeClass("btn-info")
			}

			if ( $(".altui-quick-jump-type").length==0 ) {
				var html = _drawCategoryFilter(categoryFilters)
				$("#altui-toggle-messages").after( html );

				var deviceTags = MyLocalStorage.getSettings('DeviceTags')
				html = _drawTagFilter(tagModel, deviceTags)

				html += HTMLUtils.drawDropDown({
					id:'altui-dropdown-rooms',
					label:eyeOpenGlyph+" "+_T("Rooms"),
					cls:'altui-dropdown-rooms',
					options: $(".altui-myhome-card").map( function(idx,jq) {
						var name = this.id.substring('altui-roomid-'.length).replace(/_/g," ")
						return { id:this.id, cls:'altui-quick-jump', label:name, glyph:'', href:"#"+name }
					})
				});
				$("#altui-dropdown-category").after( html )
			}
			// update button background if an active selection is made
			_updateDropdown('.altui-dropdown-category')
			_updateDropdown('.altui-dropdown-tags-cls')
		}

		function _drawRooms() {
			MultiBox.getRooms( null,null,function( rooms ) {
				var backgroundSettings = MyLocalStorage.getSettings('MyHomeBackgrounds') || {}
				var colwidths = "col-12 col-md-6 col-lg-4 col-xl-3"
				var defaulturi = 'data:image/jpeg;base64,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'
				var htmlTemplate = '<div id="${id}" class="altui-myhome-card card '+colwidths+'">'
				if (MyLocalStorage.getSettings('ShowMyHomeImages')==1)
					htmlTemplate += '<div class="card-img-top altui-myhome-roomimg" style="background-image: ${bkgd}"></div>'

				htmlTemplate += `
					<div class="card-body">
						<h4 class="card-title">\${name}
							<span class="float-right">
							<i class="fa fa-arrow-circle-up altui-back-top" aria-hidden="true"></i>
							</span>
						</h4>
						<h6 class="card-subtitle mb-2 text-muted">\${altuiid}</h6>
						\${navtabs}
						</div>
					</div>`
				htmlTemplate = _.template( htmlTemplate )
				var html="";

				var n=0;
				var filteredDeviceTypes = []
				var filteredTags = []
				$(".altui-quick-jump-type.active").each( function(i) { filteredDeviceTypes = $.merge(filteredDeviceTypes,categoryFilters[$(this).prop('id')].types) } )
				$(".altui-filter-tag.active").each( function(i) { filteredTags.push( $(this).prop('id').substr('altui-filter-'.length) ) } )
				$.each(_roomsNameToID, function(name,roomarr) {
					var tbldevice = _tableDevices(name,filteredDeviceTypes,filteredTags)
					var tblscene = (filteredDeviceTypes.length>0) ? null : _tableScenes(name)
					var navtabs = _generateNavTabs(name,tbldevice,tblscene)
					var defaultaltuiid = MultiBox.makeAltuiid(roomarr[0].controller,roomarr[0].id)
					var bkgd = "url("+g_ALTUI.g_CustomImagePath+"/R_"+defaultaltuiid+".jpg),url("+defaulturi+")"
					if (backgroundSettings[name] != undefined)
						bkgd = "url("+backgroundSettings[name].url+")"
					var model = {
						id: 'altui-roomid-'+name.replace(/\s/g,"_"),
						name: name,
						altuiid: $.map(roomarr ,function(i) { return MultiBox.makeAltuiid(i.controller,i.id)} ).join(", "),
						bkgd : bkgd,
						navtabs: navtabs
					}
					n++
					if ((tblscene || tbldevice) && ((limit==null) || (n<=limit))) {
						html += htmlTemplate(model)
					}
				})
				// html += "</div>"

				if (MyLocalStorage.getSettings('UseMasonryInMyHome')==1) {
					var re = new RegExp(colwidths,"g")
					html = '<div class="card-columns col-12">' + html.replace(re,"") + '</div>'
				} else {
					// html = '<div class="col-12"><div class="row">' + html + '</div></div>'
				}
				$(".altui-mainpanel").html(html)

				// now update the quick jump bar
				_updateQuickJumpBar()
			})
		}

		function _setInteractivity() {
			// register action click
			_registerFavoriteClickHandlers("altui-myhomedevice-icon")	// scene cls is default
			// then register icon replacement by a spinner
			$(".altui-mainpanel").on("click",".altui-myhomedevice-icon",function(e) {
				var altuiid = $(this).data("altuiid")
				$(this).replaceWith('<i data-altuiid="{0}" class="altui-myhomedevice-icon fa fa-spinner fa-2x fa-spin" aria-hidden="true"></i>'.format(altuiid ))
			});
			$(".altui-mainpanel")
				.off("click",".altui-myhome-devices tr")
				.on("click",".altui-myhome-devices tr",function(d) {
					var altuiid = $(this).find("td:first-child").html()
					UIControler.changePage('Control Panel',[ altuiid ])
					return false;
				})
				.off("click",".altui-myhome-scenes tr")
				.on("click",".altui-myhome-scenes tr",function(d) {
					var altuiid = $(this).find("td:first-child").html()
					UIControler.changePage('Scene Edit',[altuiid])
					return false;
				})
				.off("click",".altui-back-top")
				.on("click",".altui-back-top",function(d) {
					window.scrollTo(0, 0);
				})
				.off("click",".altui-favorite")
				.on("click",".altui-favorite",function(e) {
					e.stopPropagation();
					//$(this).closest("tr").closest("table").hasClass("altui-myhome-devices")
					var tr = $(this).closest("tr")
					var altuiid =$(tr).find("td:first-child").html()
					var bFavorite = false
					if ( $(tr).closest("table").hasClass("altui-myhome-devices") == true ) {
						var device = MultiBox.getDeviceByAltuiID(altuiid);
						device.favorite = !device.favorite;
						Favorites.set('device', altuiid, device.favorite);
						bFavorite = device.favorite
					} else {
						var scene = MultiBox.getSceneByAltuiID(altuiid);
						scene.favorite = !scene.favorite;
						Favorites.set('scene', altuiid, scene.favorite);
						bFavorite = scene.favorite
					}
					$(this).replaceWith( bFavorite ? starGlyph : staremtpyGlyph );
				})

			$("#altui-pagemessage")
				.off("click",".altui-quick-jump-type")
				.on("click",".altui-quick-jump-type",function(d) {
					$(this).toggleClass("active")
					_drawRooms()
				})
				.off("click",".altui-filter-tag")
				.on("click",".altui-filter-tag",function(d) {
					$(this).toggleClass("active")
					_drawRooms()
				})
				.off("click",".altui-quick-jump")
				.on("click",".altui-quick-jump",function(d) {
					document.querySelector("div#"+this.id).scrollIntoView()
					// $( "html" ).scrollTop( $("#"+this.id).offset().top + 300 );	// 200 is the height of room bitmap
				})

			$("#navbar")
				.off("keyup", "#altui-search-text")
				.on("keyup", "#altui-search-text", function(e) {  _drawRooms()	})

			EventBus.registerEventHandler("on_ui_deviceStatusChanged",null,function (eventname,device) {
				var jqelem = $(".altui-myhomedevice-icon[data-altuiid={0}]".format(device.altuiid))
				if (jqelem.length>0) {
					$(jqelem).parents("tr").find(".altui-device-info").parent().html(_deviceInfo(device))
					$(jqelem).replaceWith(_deviceIcon(device))
				}
			})
			if (limit != null ) {
				PageMessage.message( _T("Note: MyHome page is limited to 5 items per page for non registered users"), "danger");
			}
		}

		UIManager.clearPage('My Home',_T("My Home"),UIManager.oneColumnLayout);
		MultiBox.getRooms( null,null,function( rooms ) {
			$.each(rooms, function(k,r) {
				var parts = MultiBox.controllerOf(r.altuiid)
				_roomsNameToID[r.name] = _roomsNameToID[r.name] || [];
				_roomsNameToID[r.name].push( parts )
			})
			_roomsNameToID[_T("No Room")]=[ {controller:0, id:0} ]
			$.when( _drawRooms() ).then( _setInteractivity )
			EventBus.registerEventHandler("on_altui_notRegistered",UIManager,function() {
				PageMessage.message( _T("Note: MyHome page is limited to 5 items per page for non registered users"), "danger");
				$(".altui-mainpanel .altui-myhome-card:gt(4)").remove()
			});
		})
	},

	pageDevices : function ( filter )
	{
		var _domMainPanel = null;
		var _roomID2Name = {};
		var _deviceID2RoomName = {};

		UIManager.clearPage('Devices',_T("Devices"),UIManager.twoColumnLayout);

		var searchText = $("#altui-search-text").val().toUpperCase();
		var deviceTags = MyLocalStorage.getSettings('DeviceTags')
		if (filter && (filter.cancelable !=undefined) ) {
			// this is a event, so direct callback from an onClickAllDevices
			filter = null;
		}
		var _deviceDisplayFilter = $.extend( {
			filterformvisible	: false,
			sort			: MyLocalStorage.getSettings("DeviceSortField") || "name",
			room			: MyLocalStorage.getSettings("DeviceRoomFilter") || -1,
			favorites		: (MyLocalStorage.getSettings("ShowFavoriteDevice")==true),
			invisible		: (MyLocalStorage.getSettings("ShowInvisibleDevice")==true),
			batterydevice	: (MyLocalStorage.getSettings("ShowBatteryDevice")==true),
			zwavedevice		: (MyLocalStorage.getSettings("ShowZWaveDevice")==true),
			zigbee_device	: (MyLocalStorage.getSettings("ShowZigbeeDevice")==true),
			bt_device		: (MyLocalStorage.getSettings("ShowBTDevice")==true),
			category		: MyLocalStorage.getSettings("CategoryFilter") || 0,
			filtername		: MyLocalStorage.getSettings("DeviceFilterName") || "",
			tags			: []
		}, filter );
		var isCategoryFilterValid = (function() { return this.category!=0}).bind(_deviceDisplayFilter);
		var isRoomFilterValid		= (function() {
			return ($.isArray(this.room)) ? (this.room.length>0) : (this.room!=-1);
		}).bind(_deviceDisplayFilter);
		var isDeviceFilterValid = (function() {
			return ( ( this.favorites || this.invisible || this.batterydevice || this.zwavedevice || this.zigbee_device || this.bt_device || (this.filtername && this.filtername.length>0) )!=false )
		}).bind(_deviceDisplayFilter);
		var isTagFilterValid = (function() {
			return this.tags.length>0
		}).bind(_deviceDisplayFilter);

		// filter function
		function deviceFilter(device) {
			var batteryLevel = MultiBox.getDeviceBatteryLevel(device);
			// var regexp = new RegExp(RegExp.escape(_deviceDisplayFilter.filtername),"i")
			var regexp = new RegExp(_deviceDisplayFilter.filtername,"i")

			if ((device.invisible == "1") && (_deviceDisplayFilter.invisible != true))
				return false;

			if ( (_deviceDisplayFilter.category!= 0) && ( device.category_num==undefined || _deviceDisplayFilter.category.in_array(device.category_num)==false) )
				return false;

			if ( (_deviceDisplayFilter.favorites != false) && (device.favorite != true) )
				return false;

			if ((_deviceDisplayFilter.filtername.length != 0) && (device.name.search( regexp )==-1)	 )
				return false;

			var key = '_' + device.altuiid
			var curdevicetags = deviceTags.devicemap[key] || []
			if (searchText.length!=0) {
				var pattern = new RegExp(searchText,"i");
				var tagnames = $.map(curdevicetags, (tag) => (deviceTags.names[tag] || tag))
				for(var i=0; i<tagnames.length; i++) {
					if (pattern.test(tagnames[i])==true)
						return true;
				}
				if ( device.name.toUpperCase().contains( searchText ) !=true )
					return false;
			}

			if ( (_deviceDisplayFilter.batterydevice==true) && (batteryLevel == null) )
				return false;

			if (_deviceDisplayFilter.zwavedevice||_deviceDisplayFilter.zigbee_device||_deviceDisplayFilter.bt_device)
				if ( ( _deviceDisplayFilter.zwavedevice && MultiBox.isDeviceZwave(device) == false) ||
					 (_deviceDisplayFilter.zigbee_device && MultiBox.isDeviceZigbee(device) == false) ||
					 (_deviceDisplayFilter.bt_device && MultiBox.isDeviceBT(device) == false) )
					 return false;

			if (_deviceDisplayFilter.tags.length>0) {
				// current device's tags are deviceTags.devicemap[_ + device.altuiid]
				// filtered tags are _deviceDisplayFilter.tags
				// must return false if there are no intersects
				var intersect = curdevicetags.filter(value => -1 !== _deviceDisplayFilter.tags.indexOf(value));
				if (intersect.length==0)
					return false;
			}
			switch( parseInt(_deviceDisplayFilter.room) ) {
					case -1:
						return true;
					case -2:
						return (device.favorite == true)
					default:
						if ($.isArray(_deviceDisplayFilter.room)) {
							if (_deviceDisplayFilter.room.length==0)
								return true;

							if ((_deviceID2RoomName[ device.altuiid ]==null) && (parseInt(device.room)!=0)) {
								var controller = MultiBox.controllerOf(device.altuiid).controller;
								_deviceID2RoomName[ device.altuiid ] = _roomID2Name["{0}-{1}".format(controller,device.room)];
							}
							return ( (_deviceDisplayFilter.room.in_array("0")) && (device.room==0) ) || _deviceDisplayFilter.room.in_array(_deviceID2RoomName[device.altuiid])
						}
						return false;
			}
			return false;
		}

		function _deviceCreateModalHtml() {
			var deviceCreateModalTemplate = "<div id='deviceCreateModal' class='modal fade'>";
			deviceCreateModalTemplate += "	<div class='modal-dialog modal-lg'>";
			deviceCreateModalTemplate += "	  <div class='modal-content'>";
			deviceCreateModalTemplate += "		<div class='modal-header'>";
			deviceCreateModalTemplate += "		  <h5 class='modal-title'>Create Device</h5>";
			deviceCreateModalTemplate += "		  <button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>";
			deviceCreateModalTemplate += "		</div>";
			deviceCreateModalTemplate += "		<div class='modal-body'>";
				deviceCreateModalTemplate += "		<div class='container-fluid'><div class='row'>";
						deviceCreateModalTemplate += "<form class='col' novalidate>";
							deviceCreateModalTemplate += "<div class='form-group'>";
								deviceCreateModalTemplate += "<label for='altui-input-dtitle'>Device Name</label>";
								deviceCreateModalTemplate += "<input required type='text' class='form-control' id='altui-input-dtitle' placeholder='Enter the name'>";
								deviceCreateModalTemplate += "<div class='invalid-feedback'>{0}</div>".format(_T("Enter a valid device name"))
							deviceCreateModalTemplate += "</div>";
							deviceCreateModalTemplate += "<div class='form-group'>";
								deviceCreateModalTemplate += "<label for='altui-input-dfile'>D_xxx.xml filename</label>";
								deviceCreateModalTemplate += "<input required pattern='D.+\.xml' type='text' class='form-control' id='altui-input-dfile' placeholder='Enter the filename'>";
								deviceCreateModalTemplate += "<div class='invalid-feedback'>{0}</div>".format(_T("Enter a valid Dxxx.xml file name"))
								deviceCreateModalTemplate += "<small class='form-text text-muted'>{0}</small>".format(_T("Enter the device Definition file name"));
							deviceCreateModalTemplate += "</div>";
							deviceCreateModalTemplate += "<div class='form-group'>";
								deviceCreateModalTemplate += "<label for='altui-input-ifile'>I_xxx.xml filename</label>";
								deviceCreateModalTemplate += "<input required pattern='I.+\.xml' type='text' class='form-control' id='altui-input-ifile' placeholder='Enter the filename'>";
								deviceCreateModalTemplate += "<div class='invalid-feedback'>{0}</div>".format(_T("Enter a valid Ixxx.xml file name"))
								deviceCreateModalTemplate += "<small class='form-text text-muted'>{0}</small>".format(_T("Enter the device Implementation file name"));
							deviceCreateModalTemplate += "</div>";
						deviceCreateModalTemplate += "</form>";
				deviceCreateModalTemplate += "		</div></div>";
			deviceCreateModalTemplate += "		</div>";
			deviceCreateModalTemplate += "		<div class='modal-footer'>";
			deviceCreateModalTemplate += "		  <button type='button' class='btn btn-light' data-dismiss='modal'>"+_T("Close")+"</button>";
			deviceCreateModalTemplate += "		  <button type='button' class='btn btn-primary'>"+_T("Save Changes")+"</button>";
			deviceCreateModalTemplate += "		</div>";
			deviceCreateModalTemplate += "	  </div><!-- /.modal-content -->";
			deviceCreateModalTemplate += "	</div><!-- /.modal-dialog -->";
			deviceCreateModalTemplate += "</div><!-- /.modal -->";
			return deviceCreateModalTemplate;
		}

		function endDrawDevice(devices) {
			// display sort == 'name" means do nothing as it is the default
			if (_deviceDisplayFilter.sort == "altuiid") {
				devices=devices.sort(altuiSortByAltuiID)
			}
			$.each(devices, function(idx,device) {
					drawDeviceEmptyContainer( idx, device )
			})
			UIManager.refreshUI(true);
		};

		function drawDeviceEmptyContainer(idx, device) {
			_domMainPanel.append(ALTUI_Templates.deviceEmptyContainerTemplate.format(device.id,device.altuiid,'altui-device-container col-sm-6 col-md-4 col-lg-3'));
		};

		function _drawSortSelect() {
			var optionGlyph = glyphTemplate.format("cogs",_T("Options"))
			var selected = [ _deviceDisplayFilter.sort ]
			//selected.push(_deviceDisplayFilter.sort)
			return HTMLUtils.drawDropDown({
				id:'altui-dropdown-sort',
				label:optionGlyph+"<span class='d-inline'> {0}</span>".format(_T("Sort")),
				cls:'altui-dropdown-sort d-inline',
				options: [
					{ id:'name', cls:'altui-option-sort', label:_T("Name"), glyph:'fa-sort-alpha-asc' },
					{ id:'altuiid', cls:'altui-option-sort', label:_T("ID"), glyph:'fa-sort-numeric-asc' }
				],
				selected: selected
			});
		};

		function _drawDeviceToolbar() {
			var _checks = [
				{ id:'altui-show-favorites' , filterprop:'favorites', Save:'ShowFavoriteDevice', label:'Favorites' },
				{ id:'altui-show-invisible' , filterprop:'invisible', Save:'ShowInvisibleDevice', label:'Invisible' },
				{ id:'altui-show-battery'	, filterprop:'batterydevice', Save:'ShowBatteryDevice', label:'Battery' },
				{ id:'altui-show-zwave'		, filterprop:'zwavedevice', Save:'ShowZWaveDevice', label:'ZWave' },
				{ id:'altui-show-zigbee'	, filterprop:'zigbee_device', Save:'ShowZigbeeDevice', label:'Zigbee' },
				{ id:'altui-show-bt'		, filterprop:'bt_device', Save:'ShowBTDevice', label:'Bluetooth' },
			];
			var filterHtml="";
			// filterHtml+="<div class='btn-group'>";
			filterHtml+="<div class='altui-pagefilter'>";
			filterHtml+="<div class='card xxx' id='altui-device-filter-form'>";
			filterHtml+="  <div class='card-body'>";
				filterHtml+="<form class='form-inline'>";
					$.each(_checks, function(idx,check) {
						filterHtml+="<div class='form-check'>";
							filterHtml+="<input type='checkbox' class='form-check-input' value='' id='{0}'><label class='form-check-label'>{1}</label>".format(check.id,_T(check.label));
						filterHtml+="</div>";
					});
				filterHtml+="</form>";

				filterHtml+="<div id='altui-device-name-filter' class='input-group'>";
				filterHtml+="<div class='input-group-prepend'>"
				filterHtml+="<span class='input-group-text' id='altui-device-search-btn'>"+searchGlyph+"</span>";
				filterHtml+="<span class='input-group-text' id='altui-device-remove-btn'>"+removeGlyph+"</span>";
				filterHtml+="</div>"
				filterHtml+="<input type='text' class='form-control' placeholder='Device Name' aria-describedby='sizing-addon2'>";
				filterHtml+="</div>";

			filterHtml+="  </div>";
			filterHtml+="</div>";
			filterHtml+="</div>";

			var toolbarHtml="";
			var roomfilterHtml="";
			var categoryfilterHtml="";
			var tagfilterHtml="";
			var sortHtml="";
			var dfd = $.Deferred();
			$.when( _drawRoomFilterButtonAsync(_deviceDisplayFilter.room) )
			.then( function(html) {
				roomfilterHtml = html;
				tagfilterHtml = _drawTagFilter(tagModel, deviceTags)
				sortHtml = _drawSortSelect()
				categoryfilterHtml+='<select id="altui-device-category-filter" multiple="multiple">';
				createHtml= " <button type='button' class='btn btn-light' id='altui-device-create' >" +(plusGlyph + "&nbsp;" + _T("Create")) + "</button> "
				$.when( MultiBox.getCategories(
					function(idx,category) {
						categoryfilterHtml+='<option value="{0}" {2}>{1}</option>'.format(
							category.id,category.name,
							((_deviceDisplayFilter.category!=0) && (_deviceDisplayFilter.category.in_array(category.id))) ? 'selected' : ''
							);
					},
					null,
					function(categories) {
						categoryfilterHtml+='</select>';
						categoryfilterHtml+="  <button type='button' class='btn btn-light' id='altui-device-filter' >";
						categoryfilterHtml+=  (searchGlyph + '&nbsp;' +_T('Filter') + "<span class='caret'></span>");
						categoryfilterHtml+="  </button>";
					}
				))
				.then ( function(categories) {
					function _onChangeRoomFilter() {
						//_roomID2Name[_deviceDisplayFilter.room]
						_deviceDisplayFilter.room =	 $.map($('#altui-device-room-filter :selected'),function(e)	 { return (e.value); })		// array of room names
						UIManager.setLeftnavRoomsActive( _deviceDisplayFilter.room );
						MyLocalStorage.setSettings("DeviceRoomFilter",_deviceDisplayFilter.room);
						if ( MyLocalStorage.getSettings('SyncLastRoom')==1 )
							MyLocalStorage.setSettings("SceneRoomFilter",_deviceDisplayFilter.room);
						$("#altui-device-room-filter").next(".btn-group").children("button").toggleClass("btn-info",isRoomFilterValid()).toggleClass("btn-light",isRoomFilterValid()==false);
						_drawDevices(deviceFilter,false);	// do not redraw toolbar
					};
					function _onChangeCategoryFilter() {
						// Get selected options.
						_deviceDisplayFilter.category = $.map($('#altui-device-category-filter :selected'),function(e)	{ return parseInt(e.value); })	// array of ints
						if (_deviceDisplayFilter.category.length==0)
							_deviceDisplayFilter.category=0;
						MyLocalStorage.setSettings("CategoryFilter",_deviceDisplayFilter.category);
						$("#altui-device-category-filter").next(".btn-group").children("button").toggleClass("btn-info",isCategoryFilterValid()).toggleClass("btn-light",isCategoryFilterValid()==false);
						_drawDevices(deviceFilter,false);	// do not redraw toolbar
					};
					function _onChangeTagFilter(e) {
						$(this).toggleClass("active btn-light btn-info")
						_deviceDisplayFilter.tags = $.map( $("#altui-dropdown-tags .altui-filter-tag.active"), function(elem,idx) {
							return $(elem).prop('id').substr("altui-filter-".length)
						})
						$("#altui-dropdown-tags .dropdown-toggle").toggleClass("btn-info",isTagFilterValid()).toggleClass("btn-light",isTagFilterValid()==false)
						_drawDevices(deviceFilter,false);	// do not redraw toolbar
					};

					// Display
					$(".altui-device-toolbar").replaceWith( "<div class='col-12 altui-device-toolbar'>"+roomfilterHtml+tagfilterHtml+categoryfilterHtml+sortHtml+createHtml+filterHtml+"</div>" );
					$(".altui-pagefilter").css("display","inline");
					$('#altui-device-room-filter').multiselect({
						disableIfEmpty: true,
						enableHTML : true,
						includeSelectAllOption: true,
						nonSelectedText: homeGlyph + '&nbsp;' +_T('Room'),		// non selected text on the button
						onSelectAll: function() {
							 _onChangeRoomFilter();
						},
						onChange: function(element, checked) {
							 _onChangeRoomFilter();
						},
						onDropdownShown: function(event) {
							$("#altui-device-room-filter").next(".btn-group").find(".caret").toggleClass( "caret-reversed" );
						},
						onDropdownHidden: function(event) {
							$("#altui-device-room-filter").next(".btn-group").find(".caret").toggleClass( "caret-reversed" );
						}
					});
					var nRooms = $('#altui-device-room-filter').next(".btn-group").find("li").length;
					if (nRooms+1>=parseInt(MyLocalStorage.getSettings('Menu2ColumnLimit')))
						$('#altui-device-room-filter').next(".btn-group").children("ul").attr('style','columns: 2; -webkit-columns: 2; -moz-columns: 2;');

					if (categories.length+1>=parseInt(MyLocalStorage.getSettings('Menu2ColumnLimit')))
						$('#altui-device-category-filter').next(".btn-group").children("ul").attr('style','columns: 2; -webkit-columns: 2; -moz-columns: 2;');

					// interactivity
					$(".altui-filter-tag").click( _onChangeTagFilter );
					$(".altui-option-sort").click( function(e) {
							_deviceDisplayFilter.sort = $(this).prop("id")
							MyLocalStorage.setSettings("DeviceSortField",_deviceDisplayFilter.sort );
							_drawDevices(deviceFilter)
					});

					$('#altui-device-category-filter').multiselect({
						disableIfEmpty: true,
						enableHTML : true,
						includeSelectAllOption: true,
						nonSelectedText: tagsGlyph + '&nbsp;' +_T('Category'),		// non selected text on the button
						onSelectAll: function() {
							 _onChangeCategoryFilter();
						},
						onChange: function(element, checked) {
							 _onChangeCategoryFilter();
						},
						onDropdownShown: function(event) {
							$("#altui-device-category-filter").next(".btn-group").find(".caret").toggleClass( "caret-reversed" );
						},
						onDropdownHidden: function(event) {
							$("#altui-device-category-filter").next(".btn-group").find(".caret").toggleClass( "caret-reversed" );
						}
					});

					$("#altui-device-remove-btn").off("click touchend").on("click touchend",function() {
						$(this).parent().find("input").val("");
						_deviceDisplayFilter.filtername = "";
						MyLocalStorage.setSettings("DeviceFilterName",_deviceDisplayFilter.filtername);
						_drawDevices(deviceFilter);
					});

					$("#altui-device-search-btn").off("click touchend").on("click touchend",function() { $(this).focus(); });

					$("#altui-device-name-filter input").autocomplete({
						source: $.map( MultiBox.getDevicesSync() , function( device, i ) { return device.name; }  ),
						appendTo: "#altui-device-name-filter",
						delay: 500,
						// minLength: 3,
						change: function(event, ui ) {
							var v= $(this).val();
							_deviceDisplayFilter.filtername = v;
							MyLocalStorage.setSettings("DeviceFilterName",_deviceDisplayFilter.filtername);
							_drawDevices(deviceFilter);
						},
						select: function( event, ui ) {
							var v= ui.item.label;
							_deviceDisplayFilter.filtername = v;
							MyLocalStorage.setSettings("DeviceFilterName",_deviceDisplayFilter.filtername);
							_drawDevices(deviceFilter);
						},
						response: function( event, ui ) {
							if (ui.content.length>0) {
								$("#altui-device-name-filter").removeClass("has-danger");
								return;
							}
							$("#altui-device-name-filter").addClass("has-danger");
							ui.content.push( { label:_T('No Match'), value:'' } );
						},
					});
					$("#altui-device-name-filter input").val(_deviceDisplayFilter.filtername);
					var v=$("#altui-device-name-filter input").val();
					if (v && v.length>0)
						$("#altui-device-name-filter input").focus();

					$("#altui-device-filter-form").toggle(_deviceDisplayFilter.filterformvisible);
					$("#altui-device-filter").click( function() {
						_deviceDisplayFilter.filterformvisible = !_deviceDisplayFilter.filterformvisible;
						$("#altui-device-filter-form").toggle();
						// $("#altui-device-filter span.caret").toggleClass( "caret-reversed" );
					});

					$.each(_checks, function(idx,check) {
						$("#"+check.id).prop('checked',_deviceDisplayFilter[check.filterprop]);
						$("#"+check.id).click( function() {
							_deviceDisplayFilter[check.filterprop] = $(this).prop('checked');
							MyLocalStorage.setSettings(check.Save,_deviceDisplayFilter[check.filterprop]);
							_drawDevices(deviceFilter);
						});
					});

					$("#altui-device-create").click( UIManager.deviceCreate );
					$("#altui-device-room-filter a").click( function() {
						$(this).closest(".dropdown-menu").find("li.active").removeClass("active");
						$(this).parent().addClass("active");
						_onClickRoomButton( $(this).prop('id') , $(this).data('altuiid') );
					});

					$("#altui-device-room-filter").next(".btn-group").children("button").toggleClass("btn-info",isRoomFilterValid()).toggleClass("btn-light",isRoomFilterValid()==false);
					$("#altui-device-category-filter").next(".btn-group").children("button").toggleClass("btn-info",isCategoryFilterValid()).toggleClass("btn-light",isCategoryFilterValid()==false)
					$("#altui-device-filter").toggleClass("btn-info",isDeviceFilterValid()).toggleClass("btn-light",isDeviceFilterValid()==false)
					$("#altui-dropdown-tags .dropdown-toggle").toggleClass("btn-info",isTagFilterValid()).toggleClass("btn-light",isTagFilterValid()==false)
					dfd.resolve();
				});
			});
			return dfd.promise();
		};

		function _drawDevices(filterfunc,bToolbar)
		{
			if (bToolbar != false ) {
				_drawDeviceToolbar();  /*.done( function() {}); */
			}

			// Category & Form filter
			_domMainPanel = $(".altui-mainpanel").empty();
			//MultiBox.getDevices( drawDeviceEmptyContainer , filterfunc, endDrawDevice);
			MultiBox.getDevices( null , filterfunc, endDrawDevice);
		};

		function _onClickRoomButton(htmlid,altuiid)
		{
			// var roomid = $(this).prop('id');
			_deviceDisplayFilter.room = (altuiid !="") ? [ _roomID2Name[ altuiid ]	] : htmlid;
			if (_deviceDisplayFilter.room == "0" )
				_deviceDisplayFilter.room = ["0"]
			UIManager.setLeftnavRoomsActive(_deviceDisplayFilter.room);
			MyLocalStorage.setSettings("DeviceRoomFilter",_deviceDisplayFilter.room);
			if ( MyLocalStorage.getSettings('SyncLastRoom')==1 )
				MyLocalStorage.setSettings("SceneRoomFilter",_deviceDisplayFilter.room);

			HistoryManager.pushState(_T('Devices'),"pageDevices",[_deviceDisplayFilter]);
			_drawDevices(deviceFilter);
		};

		// Page Preparation
		$("#altui-pagetitle").css("display","inline").after("<div class='col-12 altui-device-toolbar'></div>");

		// Dialogs
		DialogManager.registerDialog('deviceCreateModal', _deviceCreateModalHtml() );

		// on the left, get the rooms
		$(".altui-leftnav").empty();
		UIManager.leftnavRooms(
			_onClickRoomButton,		// click button callback
			function(rooms) {		// all rooms loaded callback
				$.each(rooms, function(idx,room) {
					_roomID2Name[ room.altuiid ] = room.name;
				});
				UIManager.setLeftnavRoomsActive(_deviceDisplayFilter.room);
			}
		);

		_drawDevices(deviceFilter);

		// interactivity controls
		$("#navbar")
			.off("keyup", "#altui-search-text")
			.on("keyup", "#altui-search-text", function(e) {
				searchText = $("#altui-search-text").val().toUpperCase();
				_drawDevices(deviceFilter);
			})

		$(".altui-mainpanel")
			// .on("click",".altui-camera-picture", _onClickCamera )
			.on("click",".altui-device-title-name",function() {
				if ($(this).find("input.altui-device-title-input").length>=1)
					return;
				var text = $(this).text();
				var altuiid = $(this).parents(".altui-device").data('altuiid');
				$(this).closest(".altui-device").addClass("altui-norefresh");
				$(this).html("<input id='"+altuiid+"' class='altui-device-title-input' value='"+text+"'></input>");

				$("input#"+altuiid+".altui-device-title-input").focusout({altuiid:altuiid},function(event){
					var device = MultiBox.getDeviceByAltuiID(event.data.altuiid);
					var newname = $(this).val();
					DialogManager.confirmDialog(_T("Are you sure you want to modify this device to:")+newname,function(result) {
						if (result==true)
							MultiBox.renameDevice(device, newname );
					});
					$(this).closest(".altui-device").removeClass("altui-norefresh");
					$(this).parent().text(device.name);
				});
			})
			// .off("click",".altui-favorite")
			.on("click",".altui-favorite",function(event) {
				var altuiid = $(this).parents(".altui-device").data('altuiid');
				var device = MultiBox.getDeviceByAltuiID(altuiid);
				device.favorite = !device.favorite;
				$(this).parents(".altui-device-title").html(_enhancedDeviceTitle(device));
				Favorites.set('device', altuiid, device.favorite);
			})
			// .off("click",".altui-device-controlpanelitem")
			.on("click",".altui-device-controlpanelitem",function(){
				var altuiid = $(this).parents(".altui-device").data('altuiid');
				UIControler.changePage('Control Panel',[altuiid])
			})
			.on("click",".altui-device-hideshowtoggle",function(){
				var altuiid = $(this).parents(".altui-device").data('altuiid');
				var device = MultiBox.getDeviceByAltuiID(altuiid);
				device.invisible = (device.invisible!="1") ? "1" : ""
				MultiBox.setAttr(device, "invisible", device.invisible ,function(result) {
					if (result==null) {
						PageMessage.message( "Set Attribute action failed!", "warning" );
					}
					else {
						PageMessage.message( "Set Attribute succeeded! a LUUP reload will happen now, be patient", "success" );
						_drawDevices(deviceFilter);
					}
				});
			})
			// .off("click",".altui-device-icon")
			.on("click",".altui-device-icon",function(){
				var altuiid = $(this).parents(".altui-device").data('altuiid');
				UIControler.changePage('Control Panel',[altuiid])
			});
	},

	pageScenes: function ()
	{
		UIManager.clearPage('Scenes',_T("Scenes"));
		var _roomID2Name={};
		var _sceneID2RoomName={};
		var _sceneFilter={
			name: $("#altui-search-text").val().toUpperCase(),
			room: MyLocalStorage.getSettings("SceneRoomFilter") || -1,
			hidenotif: ($('#altui-shownotifications').prop('checked')!=true),
			isValid: function() { return ($.isArray(this.room)) ? (this.room.length>0) : (this.room!=-1); }
		};
		function _sceneInThisRoom(scene) {
			if ((_sceneID2RoomName[scene.altuiid]==null)&&(scene.room>0)) {
				var controller = MultiBox.controllerOf(scene.altuiid).controller;
				_sceneID2RoomName[scene.altuiid] = _roomID2Name["{0}-{1}".format(controller,scene.room)];
			}
			if (_sceneFilter.hidenotif && scene.notification_only && scene.notification_only!=0)
				return false;
			if ((_sceneFilter.name.length>0) && (scene.name.toUpperCase().contains( _sceneFilter.name ) != true))
				return false;

			switch(parseInt(_sceneFilter.room)) {
				case -1:
					return true;
				case -2:
					return (scene.favorite==true);
				default:
					if ($.isArray(_sceneFilter.room)) {
						if (_sceneFilter.room.length==0)
							return true;
						if ( (_sceneFilter.room.in_array("0")) && (scene.room==0) )
							return true;
						if (_sceneFilter.room.in_array(_sceneID2RoomName[scene.altuiid]))
							return true;
					}
					return false;
			}
			return false;
		}
		function _onClickRoomButton(htmlid,altuiid) {
			_sceneFilter.room = (altuiid !="") ? [ _roomID2Name[ altuiid ]	] : htmlid;
			if (_sceneFilter.room=="0")
				_sceneFilter.room=["0"]
			UIManager.setLeftnavRoomsActive( _sceneFilter.room );
			MyLocalStorage.setSettings("SceneRoomFilter",_sceneFilter.room);
			if ( MyLocalStorage.getSettings('SyncLastRoom')==1 )
				MyLocalStorage.setSettings("DeviceRoomFilter",_sceneFilter.room);
			_drawScenes( _sceneInThisRoom );
		};

		function sceneDraw(idx, scene) {
			var html = UIManager.sceneDraw(scene);
			var tpl="<div class='altui-scene-container col-sm-6 col-md-4 col-xl-3 '>";
			tpl	+=	html;
			tpl	+=	"</div>";
			var domPanel = $(".altui-mainpanel");
			domPanel.append(tpl.format(scene.id));
		};

		function _onChangeRoomFilter() {
			//_roomID2Name[_deviceDisplayFilter.room]
			_sceneFilter.room =	 $.map($('#altui-device-room-filter :selected'),function(e)	 { return (e.value); })		// array of room names
			_sceneFilter.hidenotif = ($('#altui-shownotifications').prop('checked')!=true);
			UIManager.setLeftnavRoomsActive( _sceneFilter.room );
			MyLocalStorage.setSettings("SceneRoomFilter",_sceneFilter.room);
			if ( MyLocalStorage.getSettings('SyncLastRoom')==1 )
				MyLocalStorage.setSettings("DeviceRoomFilter",_sceneFilter.room);
			$("#altui-device-room-filter").next(".btn-group").children("button").toggleClass("btn-info",_sceneFilter.isValid());
			_drawScenes(_sceneInThisRoom,false);	// do not redraw toolbar
		};

		function _getActionsFromState() {
			var actions = []
			var map = {
				"urn:schemas-upnp-org:device:BinaryLight:1": {
					state:"Status",
					service:"urn:upnp-org:serviceId:SwitchPower1",
					action: "SetTarget",
					action_argument:"newTargetValue"
				},
				"urn:schemas-upnp-org:device:DimmableLight:1": {
					state:"LoadLevelStatus",
					service:"urn:upnp-org:serviceId:Dimming1",
					action: "SetLoadLevelTarget",
					action_argument:"newLoadlevelTarget"
				},
				"urn:schemas-micasaverde-com:device:MotionSensor:1": {
					state:"Armed",
					service:"urn:micasaverde-com:serviceId:SecuritySensor1",
					action: "SetArmed",
					action_argument:"newArmedValue"
				},
				"urn:schemas-micasaverde-com:device:DoorSensor:1": {
					state:"Armed",
					service:"urn:micasaverde-com:serviceId:SecuritySensor1",
					action: "SetArmed",
					action_argument:"newArmedValue"
				},
				"urn:schemas-micasaverde-com:device:WindowCovering:1": {
					state:"LoadLevelStatus",
					service:"urn:upnp-org:serviceId:Dimming1",
					action: "SetLoadLevelTarget",
					action_argument:"newLoadlevelTarget"
				}
			}
			$.each( MultiBox.getDevicesSync().filter( function(d) { return MultiBox.controllerOf(d.altuiid).controller == 0 } ), function( idx,dev ) {
				if (map[dev.device_type || "x"] != null) {
					var state = MultiBox.getStatus( dev, map[dev.device_type].service, map[dev.device_type].state)
					actions.push({
						"device": dev.id,
						"service": map[dev.device_type].service,
						"action": map[dev.device_type].action,
						"arguments": [
						  {
							"name": map[dev.device_type].action_argument,
							"value": state
						  }
						]
					})
				}
			});
			return actions
		};

		function _drawSceneToolbar() {
			var toolbarHtml="";
			$.when( _drawRoomFilterButtonAsync( _sceneFilter.room ) )
			.then(function( html) {
				toolbarHtml+= html;	// room filter
				toolbarHtml+=`
					<button class="btn btn-light" type="button">
						<input class="" type="checkbox" value="" id="altui-shownotifications">
						<label class="form-check-label" for="defaultCheck1">Notifications</label>
					</button>`;
				toolbarHtml+="	<button type='button' class='btn btn-light' id='altui-scene-create' >";
				toolbarHtml+=(plusGlyph + "&nbsp;" + _T("Create"));
				toolbarHtml+="	</button>";
				toolbarHtml+="	<button type='button' class='btn btn-light' id='altui-scene-create-fromstate' >";
				toolbarHtml+=(plusGlyph + "&nbsp;" + _T("Create From State"));
				toolbarHtml+="	</button>";


				$(".altui-scene-toolbar").replaceWith( "<div class='col-12 altui-scene-toolbar'>"+toolbarHtml+"</div>" );

				$("#altui-shownotifications").change( function() {
					_onChangeRoomFilter();	
				});

				$("#altui-scene-create").click( function() {
					UIControler.changePage('Scene Edit',[NULL_SCENE])
				});

				$("#altui-scene-create-fromstate").click( function() {
					var actions = _getActionsFromState()
					var scenetemplate = {
							groups: [{"delay":0,"actions":actions}]
					};
					// clear page
					UIControler.changePage('Scene Edit',[NULL_SCENE,scenetemplate])
				});
				// multiselect
				$('#altui-device-room-filter').multiselect({
					disableIfEmpty: true,
					enableHTML : true,
					includeSelectAllOption: true,
					nonSelectedText: homeGlyph + '&nbsp;' +_T('Room'),		// non selected text on the button
					onSelectAll: function() {
						 _onChangeRoomFilter();
					},
					onChange: function(element, checked) {
						 _onChangeRoomFilter();
					},
					onDropdownShown: function(event) {
						$("#altui-device-room-filter").next(".btn-group").find(".caret").toggleClass( "caret-reversed" );
					},
					onDropdownHidden: function(event) {
						$("#altui-device-room-filter").next(".btn-group").find(".caret").toggleClass( "caret-reversed" );
					}
				});
				var nRooms = $('#altui-device-room-filter').next(".btn-group").find("li").length;
				if (nRooms+1>=parseInt(MyLocalStorage.getSettings('Menu2ColumnLimit')))
					$('#altui-device-room-filter').next(".btn-group").children("ul").attr('style','columns: 2; -webkit-columns: 2; -moz-columns: 2;');

				$("#altui-device-room-filter").next(".btn-group").children("button").toggleClass("btn-info",_sceneFilter.isValid());
				// $("#altui-device-room-filter a").click( function() {
					// $(this).closest(".dropdown-menu").find("li.active").removeClass("active");
					// $(this).parent().addClass("active");
					// _onClickRoomButton( $(this).prop('id'), $(this).data("altuiid") );
				// });
			});
		};
		function afterSceneListDraw(scenes) {
			$(".altui-mainpanel")
				.off('click')
				// .off("click",".altui-delscene")
				.on("click",".altui-delscene",function() {
					var altuiid = $(this).closest(".altui-scene").data('altuiid');
					var scene = MultiBox.getSceneByAltuiID(altuiid);
					DialogManager.confirmDialog(_T("Are you sure you want to delete scene ({0})").format(altuiid),function(result) {
						if (result==true) {
							MultiBox.deleteScene( scene );
						}
					});
				})
				// .off("click",".altui-pausescene")
				.on("click",".altui-pausescene",function() {
					var altuiid = $(this).closest(".altui-scene").data('altuiid');
					var scene = MultiBox.getSceneByAltuiID(altuiid);
					scene.paused = (scene.paused==1) ? 0 : 1;
					show_loading();
					$.when(MultiBox.editScene( altuiid , scene )).done( hide_loading);
				})
				// .off("click",".altui-runscene")
				.on("click",".altui-runscene",function() {
					var altuiid = $(this).closest(".altui-scene").data('altuiid');
					var scene = MultiBox.getSceneByAltuiID(altuiid);
					$(this).removeClass("btn-primary").addClass("btn-success");
					MultiBox.runScene( scene );
				})
				// .off("click",".altui-editscene")
				.on("click",".altui-editscene",function() {
					var altuiid = $(this).closest(".altui-scene").data('altuiid');
					UIControler.changePage('Scene Edit',[altuiid])
				})
				.on("click",".altui-clonescene",function() {
					var altuiid = $(this).closest(".altui-scene").data('altuiid');
					DialogManager.confirmDialog(_T("Are you sure you want to clone scene ({0})").format(altuiid),function(result) {
						if (result==true) {
							var scene = MultiBox.getSceneByAltuiID( altuiid );
							var clone = $.extend(true,{
									name:"",
									id: 0,
									altuiid: "",
									triggers: [],
									groups: [],
									timers: [],
									lua:"",
									room:0
									}, scene );
							// clone scene
							var newid = MultiBox.getNewSceneID( MultiBox.controllerOf(altuiid).controller );
							clone.id = newid.id;
							clone.altuiid = newid.altuiid;
							clone.name = _T("Clone of {0}").format(scene.name);

							// get old watches
							var sceneWatches = WatchManager.getSceneWatches(scene);
							MultiBox.editScene( newid.altuiid , clone, function(data) {
								if ( (data!=null) && (data!="ERROR") ) {
									PageMessage.message(_T("Cloned Scene {0} successfully").format(scene.name), "success");
									_.delay(function() {
												// try to find the new scene by its name to clone watches
												var scenes = MultiBox.getScenesSync();
												$.each(scenes, function(idx,sc) {
													if (sc.name == clone.name) {
														var newsceneid = sc.id
														$.each(sceneWatches,function(j,watch) {
															watch.sceneid = newsceneid
															MultiBox.addWatch(watch)
														});
													}
												});
												UIControler.changePage('Scenes');
											},2500);
								}
								else {
									PageMessage.message(_T("Could not edit Scene {0}").format(clone.name), "warning");
								}
							} );
						}
					});
				})
				.on("click",".altui-scene-history",function() {
					var altuiid = $(this).closest(".altui-scene").data('altuiid');
					var scene = MultiBox.getSceneByAltuiID(altuiid);
					var dialog =  DialogManager.registerDialog('dialogModal',
						defaultDialogModalTemplate.format( 'dialogModal',
						_T("Scene History"),			// title
						"",				// body
						"modal-lg",	// size
						""	// glyph icon
						));
					MultiBox.getSceneHistory( scene, function(history) {
						var html="";
						html += "<div class='card xxx'> <div class='card-body'>";
						html +="<table id='{0}' class='table table-responsive-OFF table-sm altui-variable-value-history'>".format(altuiid);
						html +="<thead>";
						html += ("<tr><th>{0}</th><th>{1}</th></tr>".format(_T("Date"),_T("Name")));
						html +="</thead>";
						html +="<tbody>";
						history.lines.reverse();
						$.each(history.lines, function(i,e) {
							html += ("<tr><td>{0}</td><td>{1}</td></tr>".format( e.date, e.name) );
						});
						html +="</tbody>";
						html +="</table>";
						html += "  </div></div>";
						$(dialog).find(".altui-dialog-row").append(html);
						$('div#dialogModal').modal();
					});
				})
				.on("click",".altui-favorite",function(event) {
					var altuiid = $(this).closest(".altui-scene").data('altuiid');
					var scene = MultiBox.getSceneByAltuiID(altuiid);
					scene.favorite = !scene.favorite;
					Favorites.set('scene', altuiid, scene.favorite );
					$(this).replaceWith( (scene.favorite==true) ? starGlyph : staremtpyGlyph );
					UIControler.updateFavoriteScene()
				})
				.on("click",".altui-scene-eyemonitor",function(event) {
					var scenedom = $(this).closest(".altui-scene");
					var altuiid = scenedom.data('altuiid');
					var scene = MultiBox.getSceneByAltuiID(altuiid);
					var cmd = (scene.status_mode=="continuous")	 ? "normal" : "continuous"
					var that = $(this)
					MultiBox.setSceneMonitorMode(scene,cmd, function(result) {
						that.toggleClass("text-muted text-success")
					});
				})
				.on("click",".altui-scene-title-name",function(event) {
					if ( $(this).find("input").length>=1 )
						return;
					var scenedom = $(this).closest(".altui-scene");
					var altuiid = scenedom.data('altuiid');
					var scene = MultiBox.getSceneByAltuiID(altuiid);
					scenedom.addClass("altui-norefresh");
					$(this).html("<input id='{0}' class='altui-scene-title-input' value='{1}'></input>".format(altuiid,scene.name.escapeXml()));
				})
				.off("focusout")
				.on("focusout",".altui-scene-title-input",function(event) {
					var newname = $(this).val();
					var namedom = $(this).parent();
					var scenedom = $(this).closest(".altui-scene");
					var altuiid = scenedom.data('altuiid');
					var scene = MultiBox.getSceneByAltuiID(altuiid);
					namedom.text(newname);
					MultiBox.renameScene(scene,newname);
					scenedom.removeClass("altui-norefresh");
				});

			$("#navbar")
				.off("keyup", "#altui-search-text")
				.on("keyup", "#altui-search-text", function(e) {
					_sceneFilter.name= $("#altui-search-text").val().toUpperCase();
					_drawScenes( _sceneInThisRoom,false );
				})
		};

		function _drawScenes( filterfunc,bToolbar )
		{
			$(".altui-mainpanel").empty();
			if (bToolbar != false ) {
				_drawSceneToolbar();  /*.done( function() {}); */
			}
			MultiBox.getScenes( sceneDraw , filterfunc, afterSceneListDraw )
		}

		$("#altui-pagetitle").css("display","inline").after("<div class='col-12 altui-scene-toolbar'></div>");

		// on the left, get the rooms
		UIManager.leftnavRooms(
			_onClickRoomButton,		// click button callback
			function(rooms) {		// all rooms loaded callback
				$.each(rooms, function(idx,room) {
					_roomID2Name[ room.altuiid ] = room.name;
				});
				UIManager.setLeftnavRoomsActive( _sceneFilter.room );
			}
		);

		_drawScenes( _sceneInThisRoom );
	},

	pageSceneEdit: function (altuiid,newscene_template)
	{
		// Deep copy so we can edit it
		var newid = MultiBox.getNewSceneID( MultiBox.controllerOf(altuiid).controller );
		var roomname = MyLocalStorage.getSettings("SceneRoomFilter") || "0";
		var room = 0
		if ((roomname[0]!="-") && (roomname!="0")) {
			var tbl = $.grep(MultiBox.getRoomsSync(), function(r) { return r.name==roomname } );
			room  = (tbl.length>0) ? tbl[0].id : 0
		}
		var orgscene = (altuiid!=NULL_SCENE) ? MultiBox.getSceneByAltuiID( altuiid ) : {
				name:"New Scene",
				id: newid.id,
				altuiid: newid.altuiid,
				triggers: [],
				groups: [{"delay":0,"actions":[]}],
				timers: [],
				lua:"",
				room:room
		};
		var scene = $.extend(true, {modeStatus:"0", timers:[], triggers:[], groups:[] }, orgscene, newscene_template );

		// clear page
		UIManager.clearPage('Scene Edit',altuiid!=NULL_SCENE ? "Edit Scene #"+scene.altuiid : "Create Scene",UIManager.oneColumnLayout);
		var editor = SceneEditor( scene );
		var html = "<div class='col-12'>" ;
			html += UIManager.sceneDraw( scene, true);	// draw scene
			html += editor.sceneEditDraw();					// draw editor
		html += "</div>";

		$(".altui-mainpanel").append(  html );
		editor.runActions(	);
	},
	pageWorkflowReport: function ( altuiid ) {
		function _displayWorkflowHeader(workflow) {
			return "{0} - <small>({1})</small>".format(workflow.name,workflow.altuiid)
		}
		function _displayWorkflowStats(stats) {
			return "<ul><li>{0} States: {1}</li><li>{2} Transitions: {3}</li></ul>".format(
				stats.nStates, stats.States.join(", "),
				stats.nLinks, stats.Links.join(", ")
				);
		}
		function _displayWorkflowActions(arr) {
			var html="";
			$.each(arr, function(j,action) {
				var device = MultiBox.getDeviceByAltuiID(action.device)
				var name = (device==null) ? '' : device.name
				html += "<li class='altui-action-details'>on {0} <span class='text-muted'>({1})</span> {2}-{3} <span class='text-muted'>{4}</span></li>".format(name,action.device, action.service, action.action, JSON.stringify(action.arguments))
			})
			return html;
		}
		function _displayWorkflowScenes(arr) {
			var html="";
			$.each(arr, function(j,scene) {
				var obj = MultiBox.getSceneByAltuiID(scene.altuiid)
				if (!obj) return;
				html += "<li class='altui-action-details'>run {0} <span class='text-muted'>({1})</span></li>".format(obj.name,scene.altuiid)
			})
			return html;
		}
		function _displayConditions(arr) {
			var html="";
			$.each(arr, function(k,cond) {
				var device = MultiBox.getDeviceByAltuiID(cond.device);
				if (!device)	return;
				html += "<li class='altui-action-details'> ";
				html += "{5} device:'<strong>{0}</strong>' ({1}) when {2}-{3} <br><span class='text-info'>{4}</span>".format(
					device.name,
					cond.device, cond.service, cond.variable, cond.luaexpr.replace('\n','<br>'),
					cond.triggeronly ? ("<mark>{0}</mark> <span class='text-danger'>Trigger</span>, ".format(glyphTemplate.format('bolt','trigger','text-danger'))) : ''
					);
				html += "</li>";
			});
			return html;
		}
		function _displayWaitForState(arr) {
			var html = "";
			$.each(arr, function(k,wf) {
				var workflow = WorkflowManager.getWorkflowDescr(wf.altuiid)
				html += "<li>Workflow '{0}' reaches State:{1}</li>".format(workflow.name, WorkflowManager.IDToName(wf.state))
			})
			return html;
		}

		function _displayWorkflowLua( lua ) {
			var html="";
			if (lua && (lua.length>0)) {
				html = "<li class='altui-action-details'>Lua<pre>{0}</pre></li>".format(lua.replace(/^[\s\n]+|[\s\n]+$/gm,''));
			}
			return html;
		}
		function _displayWorkflowDetails(workflow) {
			var workflowDescr = WorkflowManager.getWorkflowDescr(workflow.altuiid);
			var html ="<h3>Details</h3>";
			html += "<ul>";
			$.each(workflowDescr.states, function(i,state) {
				html += "<li>";
				html += "<div class='text-warning altui-state-name'>{0} - <small><span class='text-muted altui-workflow-id'>{1}</span></small></div>".format(state.name,state.id);
				html += "<ul>";
					if (isNullOrEmpty(state.comment) != true) {
						html += "<li class='text-muted'><em>{0}</em></li>".format(state.comment)
					}
					if (state.isStart() && state.conditions.length>0) {
						html += "<li class='altui-action-kind'>Global Conditions</li>"
						html += "<ul>";
						html += _displayConditions(state.conditions)
						html += "</ul>";
					}
					if ( state.onEnter.length + state.onEnterScenes.length + state.onEnterLua.length > 0) {
						html += "<li class='altui-action-kind'>OnEnter</li>"
						html += "<ul>";
							html += _displayWorkflowActions(state.onEnter)
							html += _displayWorkflowScenes(state.onEnterScenes)
							html += _displayWorkflowLua(state.onEnterLua)
						html += "</ul>";
					}
					if (state.onExit.length + state.onExitScenes.length + state.onExitLua.length > 0) {
						html += "<li class='altui-action-kind'>OnExit</li>"
						html += "<ul>";
							html += _displayWorkflowActions(state.onExit)
							html += _displayWorkflowScenes(state.onExitScenes)
							html += _displayWorkflowLua(state.onExitLua)
						html += "</ul>";
					}
					if (state.transitions.length>0) {
						html += "<li class='altui-action-kind'>Transitions</li>"
						$.each(state.transitions, function(j,link) {
							html += "<ul>";
								html += "<li>";
									html += "<div class='text-info altui-transition-name'>'{0}' - <small><span class='text-muted altui-workflow-id'>{1}</span></small></div>".format(link.name,link.id);
								html += "</li>";
								html += "<ul>";
									if (isNullOrEmpty(link.comment)!=true)
											html += "<li  class='text-muted'><em>{0}</em></li>".format(link.comment);
									html += "<blockquote class='altui-workflow-transitiondetails'>";
										html += "<li class='altui-transition-subtitle'>When</li>";
										html += "<ul>";
											if (link.schedule )
												html += "<li>Schedule: {0}</li>".format(UIManager.displayTimers( [ link.schedule ] , { only_text:true, add_button:false, add_json:false }).replace('table table-responsive-OFF table-sm','table altui-workflow-schedule'));
											if (link.timer)
												html += "<li>Timer: '{0}' Duration: {1} seconds</li>".format(link.timer.name,link.timer.duration);
											html += _displayConditions(link.conditions)
											html += _displayWaitForState(link.waitFors)
										html += "</ul>";
										html += "<li class='altui-transition-subtitle'>Moves To</li>";
										html += "<ul>";
											html += "<li>State: <span class='text-warning' >{0}</span></li>".format( link.target.name );
										html += "</ul>";
									html += "</blockquote>";
								html += "</ul>";
							html += "</ul>";
						});
					}
				html += "</ul>";
				html += "</li>";
			});
			html +="</ul>";
			return html;
		}

		var _toolsWorkflow = [
			{id:"altui-workflow-edit", glyph:"pencil", label:_T("Edit")},
		];

		var workflow = WorkflowManager.getWorkflow(altuiid);
		if (workflow==null)
			return;

		UIManager.clearPage('Workflow Report',_T("Workflow Report"),UIManager.oneColumnLayout);
		var html = "";
		html += "<div class='col-12'><div id='altui-workflow-report'>";
		html += HTMLUtils.drawToolbar( 'altui-workflow-toolbar', _toolsWorkflow, 'col-12' )
		html += "<div class='card xxx'>"
			html += "<div class='card-body'>"
				html += _displayWorkflowHeader(workflow)
				html += _displayWorkflowStats(WorkflowManager.getWorkflowStats(altuiid))
			html += "</div>"
		html += "</div>"
		html += _displayWorkflowDetails(workflow)
		html += "</div></div>";
		$(".altui-mainpanel").append(html);

		// interactivity
		$("#altui-workflow-edit").click( function() {
			_.defer(UIControler.changePage,"Workflow",[altuiid])
		})
	},

	pageCloneWorkflow: function ( altuiid ) {
		var IDmap = {};
		var allDevices = MultiBox.getDevicesSync();
		function _fixID(oldid) {
			var v = IDmap[ oldid ]
			if (v==undefined) {
				v = joint.util.uuid();
				IDmap[ oldid ] = v;
			}
			return v;
		};

		function _createCloneWorkflowModel(workflow) {
			var model = {
				workflow:cloneObject(workflow),
				devices:{}
			}
			model.workflow.name = _T("Clone of {0}").format(workflow.name);
			// first, fix the jointjs ID of all states, source and target ids.
			// for each device in conditions or in actions, prepare a substitution entry.
			var graph = JSON.parse(model.workflow.graph_json)
			if ( graph==null )
				return null;
			graph.active_state = _fixID( graph.active_state );
			$.each(graph.cells, function(idx,cell) {
				cell.id = _fixID(cell.id)
				if (cell.source && cell.source.id)
					cell.source.id = _fixID(cell.source.id)
				if (cell.target && cell.target.id)
					cell.target.id = _fixID(cell.target.id)
				$.each( cell.prop.onEnter ||[] , function(idx,onenter) {
					model.devices[onenter.device]={}
				});
				$.each( cell.prop.onExit ||[] , function(idx,onexit) {
					model.devices[onexit.device]={}
				});
				$.each( cell.prop.conditions ||[] , function(idx,cond) {
					model.devices[cond.device]={}
				});
			});
			model.workflow.graph_json = JSON.stringify(graph)

			return model
		};

		function _changeWorkflowDevices(model) {
			var graph = JSON.parse(model.workflow.graph_json)
			$.each(graph.cells, function(idx,cell) {
				$.each( cell.prop.onEnter ||[] , function(idx,onenter) {
					onenter.device = model.devices[ onenter.device ] || onenter.device
				});
				$.each( cell.prop.onExit ||[] , function(idx,onexit) {
					onexit.device = model.devices[ onexit.device ] || onexit.device
				});
				$.each( cell.prop.conditions ||[] , function(idx,cond) {
					cond.device = model.devices[cond.device] || cond.device
				});
			})
			model.workflow.graph_json = JSON.stringify(graph);
			return model.workflow;
		};

		function _displayCloneWorkflow(model) {
			// WorkflowManager.addWorkflow( model.workflow );
			// var graph =	JSON.parse(model.workflow.graph_json)
			// return '<pre>{0}</pre>'.format(JSON.stringify(graph,null,2))
			var html = "<div class='col-12'>"
			html +="<table class='table'>";
			html += "<caption>Device Substitution Table</caption>";
			html += "<thead>";
			html += "<tr>";
			html += "<th>";
			html += "ID</th>";
			html += "<th>";
			html += "Device</th>";
			html += "<th>";
			html += "Type</th>";
			html += "<th>";
			html += "Replaced By</th>";
			html += "</tr>";
			html += "</thead>";
			html += "<tbody>";
			$.each(model.devices, function(prop,value) {
				var device = MultiBox.getDeviceByAltuiID(prop);
				if (device) {
					var samedevices = allDevices.filter( function(d) { return d.device_type == device.device_type} )
					var select = HTMLUtils.drawSelect({
						id:prop ,
						class:'altui-select-version',
						options: $.map(samedevices, function(d) { return {text: "{0} (#{1})".format(d.name,d.altuiid), value: d.altuiid, selected:(d.altuiid==prop)} }),
						// selected_idx:index+1	// no +1 because Create as the added at the end for this one
					});
					html += "<tr><td>{0}</td><td>{1}</td><td>{2}</td><td>{3}</td></tr>".format(prop,device.name || "",device.device_type,select)
				}
			});
			html += "</tbody>";
			html +="</table>"
			html +="<button id='altui-workflow-clonebutton' type='submit' class='btn btn-primary pull-right'>"+_T("Submit")+"</button>";
			html +="</div>"
			return html;
		};

		var workflow = WorkflowManager.getWorkflow(altuiid);
		if (workflow==null)
			return;

		UIManager.clearPage('Clone Workflow',_T("Clone Workflow"),UIManager.oneColumnLayout);
		var model = _createCloneWorkflowModel(workflow);
		if (model==null) {
			UIControler.changePage("Workflow Pages");
			return
		}
		var html = _displayCloneWorkflow(model);
		$(".altui-mainpanel").append(html);
		$("#altui-workflow-clonebutton").off().on('click',model,function(event){
			var model = event.data
			// collect all replacement devices
			$(".altui-select-version").each(function(){ model.devices[$(this).prop('id')]=$(this).val() })
			// fix the workflow
			var workflow = _changeWorkflowDevices( model );
			// add the workflow
			WorkflowManager.addWorkflow(workflow);
			UIControler.changePage("Workflow Pages")
		});
	},

	pageWorkflow: function ( altuiid ) {
		var workflow = WorkflowManager.getWorkflow(altuiid);
		if (workflow==null) return;
		var bSaveNeeded = false;
		var plusButton = xsbuttonTemplate.format("{0}","altui-add-item",plusGlyph,"Add");
		var delButton = xsbuttonTemplate.format("{0}","altui-delete-item-{1}",deleteGlyph,"Del");
		var editButton = xsbuttonTemplate.format("{0}","altui-edit-item-{1}",editGlyph,"Edit");
		var blocklyButton = xsbuttonTemplate.format("{0}","altui-blockly-item-{1}",wrenchGlyph.replace( _T("Settings") , "Blockly") ,"Blockly");
		var _toolsWorkflow = [
			{id:"altui-workflow-save", glyph:"floppy-o", label:_T("Save")},
			{id:"altui-workflow-reset", glyph:"refresh", label:_T("Reset")},
			{id:"altui-workflow-newstate", glyph:"square-o", label:_T("State")},
			{id:"altui-workflow-edit", glyph:"pencil", label:_T("Edit")},
			{id:"altui-workflow-delete", glyph:"trash-o", label:_T("Delete")},
			{id:"altui-workflow-report", glyph:"list", label:_T("Report")},
			{id:"altui-workflow-history", collapsetarget:"#altui-workflow-history-text", glyph:"history", label:_T("History")},
			{id:"altui-workflow-bag", collapsetarget:"#altui-workflow-bag-text", glyph:"shopping-basket", label:_T("Bag")},
			{id:"altui-workflow-export", glyph:"shopping-bag", label:_T("Import/Export")},
			{id:"altui-workflow-zoomin", glyph:"search-plus" },
			{id:"altui-workflow-zoomout", glyph:"search-minus" },
			// {id:"altui-workflow-rotate", glyph:"glyphicon-repeat" },
		];
		var selected = [];
		var graph = null;	// will be init later once the scripts are loaded
		var paper = null;
		function _clearPage() {
			$(".altui-workflow-toolbar").remove();
			$(".altui-mainpanel").empty();
		}
		function onPropertyState(workflow,Model,callback) {
			function PickScene( callback ) {
				var dialog = DialogManager.createPropertyDialog('Scene');
				DialogManager.dlgAddScenes( dialog , {properties:{sceneid:NULL_SCENE}}, function() {
					$('div#dialogModal').modal();
					$('div#dialogs')
						.off('click')
						.on( 'click','.modal-footer .btn-light', function(e) {
							e.stopPropagation();
							$('div#dialogModal').modal('hide');
							(callback)(null);
							return false;
						})
						.off('submit',"div#dialogModal")
						.on( 'submit',"div#dialogModal", function() {
							var scene = {};
							scene.altuiid = $("#altui-widget-sceneid").val();
							$('div#dialogModal').modal('hide');
							(callback)(scene);
						})
				});
			}
			function PickAction( action, callback ) {
				var dialog = DialogManager.createPropertyDialog('Action');
				var widget ={}
				if (action) {
					widget = {
						properties: {
							deviceid: action.device,
							action: {
								service:action.service,
								action:action.action,
								params: UIManager.buildParamsFromArray(action.arguments)
							}
						}
					};
				} else {
					widget = {
						properties: {
							deviceid: NULL_DEVICE,
							action: {
								service:"",
								action:"",
								params:[]
							}
						}
					};
				}
				DialogManager.dlgAddDevices( dialog , '', widget.properties.deviceid ,
					function() {		// callback
						DialogManager.dlgAddActions("altui-select-action",dialog, widget, widget.properties.action, _T('Action'), function() {
							$('div#dialogModal').modal();
							$('div#dialogs')
								.off('click')
								.on( 'click','.modal-footer .btn-light', function(e) {
									e.stopPropagation();
									$('div#dialogModal').modal('hide');
									(callback)(null);
									return false;
								})
								.off('submit',"div#dialogModal")
								.on( 'submit',"div#dialogModal", function() {
									var action = {};
									action.device = $("#altui-select-device").val();
									action = $.extend(action , DialogManager.getDialogActionValue("altui-select-action") );
									action.arguments = [];
									// read params
									$(".altui-select-action-parameters input").each( function(idx,elem) {
										action.arguments.push({
											name: $(elem).prop('id').substring( "altui-widget-action-parameters-".length ),
											value: $(elem).val()
										});
									} );
									$('div#dialogModal').modal('hide');
									if ((action.device!="0") && (action.action!="")) {
										(callback)(action);
									} else
										(callback)(null);
								})
						});
					},
					null	// no filter
				);
			};

			function _displayActions( htmlid,actions ) {
				var arr =[];
				$.each(actions, function(idx,action) {
					var controller = MultiBox.controllerOf(action.device).controller;
					arr.push( $.extend( {}, _formatAction(controller,action) , { "-":editButton.format(idx,htmlid)+delButton.format(idx,htmlid) } ));
				});
				arr.push({
					device:plusButton.format(htmlid),
					action:"",
					arguments:"",
					"-":""
				});
				return HTMLUtils.array2Table(arr,null,[],null,null,htmlid)
			}
			function _formatWorkflowScene(workflowscene) {
				var scene =MultiBox.getSceneByAltuiID(workflowscene.altuiid)
				return {
					scene: scene ? scene.name +" <small class='text-muted'>({0})</small>".format(scene.altuiid):"invalid scene"
				}
			}
			function _displayScenes(htmlid,scenes ) {
				var arr =[];
				$.each(scenes, function(idx,workflowscene) {
					arr.push( $.extend( {}, _formatWorkflowScene(workflowscene) , { "-":delButton.format(idx,htmlid) } ));
				});
				arr.push({
					scene:plusButton.format(htmlid),
					"-":""
				});
				return HTMLUtils.array2Table(arr,null,[],null,null,htmlid)
			}
			function _displayLua(htmlid,lua) {
				var html = ""
				lua = lua || ""
				html +="<h5>Lua</h5>"
				html +="<div class='altui-ace-editor' id='{0}'>{1}</div>".format(htmlid,lua)
				return html;
			}
			_clearPage();
			var html = "<div class='col-12'>";
			html += HTMLUtils.drawForm( 'altui-state-form', _T("State Properties"),
				[
					{ id:"altui-form-StateName", label:_T("State Name"), type:"input", value: Model.name, opt:{required:''} },
					{ id:"altui-form-StateComment", label:_T("Comment"), type:"input", value: Model.prop.comment },
					{ id:"altui-form-Actions", label:_T("State Actions"), type:"accordeon", value: [
						{id:'OnEnter', title:_T("On Enter"), html:
							HTMLUtils.displayRECButton( 'altui-record-onEnter') +
							_displayActions( 'altui-onEnter',Model.prop.onEnter ) +
							_displayScenes( 'altui-onEnterScenes',Model.prop.onEnterScenes ) + _displayLua('altui-onEnterLua',Model.prop.onEnterLua)
						},
						{id:'OnExit', title:_T("On Exit"), html:
							HTMLUtils.displayRECButton( 'altui-record-onExit') +
							_displayActions( 'altui-onExit',Model.prop.onExit ) +
							_displayScenes( 'altui-onExitScenes',Model.prop.onExitScenes ) + _displayLua('altui-onExitLua',Model.prop.onExitLua) },
					]},
					{ id:"altui-btn-bar", type:"buttonbar", value:[
						{ id:"altui-btn-close", label:_T("Close"), type:"button",  },
						{ id:"altui-btn-submit", label:_T("Submit"), type:"submit",	 },
					]}
				],
				'novalidate'
			);
			html += "</div>"
			$(".altui-mainpanel").html ( html );

			// ACE editors
			var init =	MyLocalStorage.getSettings("EditorTheme") || "monokai";
			$(".altui-ace-editor").each( function(idx,elem) {
				var editor = ace.edit( $(elem).prop('id') );
				editor.session.setMode("ace/mode/lua");
				// editor.getSession().setMode( "ace/mode/lua" );
				editor.setTheme( "ace/theme/"+init );
				editor.setFontSize( MyLocalStorage.getSettings("EditorFontSize") );
				// resize
				$(elem).resizable({
					// containment: "parent",
					maxWidth:$(elem).closest(".card").innerWidth()-30, // ugly but easier, padding 15 on
					stop: function( event, ui ) {
						editor.resize();
					}
				});
			});

			// auto complete
			var w = WorkflowManager.getWorkflowDescr( workflow.altuiid );
			var states = $.map( w.states.filter( function(s) { return (s.isStart()==false) && (s.name != Model.name) }) , function(s) { return s.name } );
			$('#altui-form-StateName').autocomplete({
				source: states,
				// appendTo: "#altui-device-name-filter",
				delay: 200,
				select: function( event, ui ) {
					var selected = ui.item.value;
					ui.item.value = _T("Clone of {0}").format(ui.item.value);
					$.each( w.states, function(i,s) {
						if (s.name == selected) {
							var srccell = graph.getCell(s.id);
							Model.prop = WorkflowManager.getNodeProperties( srccell.attributes.prop ),
							$("#altui-onEnter").replaceWith( _displayActions( "altui-onEnter",srccell.attributes.prop.onEnter) )
							$("#altui-onExit").replaceWith( _displayActions( "altui-onExit",srccell.attributes.prop.onExit) )
							$("#altui-onEnterScenes").replaceWith( _displayScenes( "altui-onEnterScenes",srccell.attributes.prop.onEnterScenes) )
							$("#altui-onExitScenes").replaceWith( _displayScenes( "altui-onExitScenes",srccell.attributes.prop.onExitScenes) )
							ace.edit( "altui-onEnterLua" ).setValue(srccell.attributes.prop.onEnterLua,-1);
							ace.edit( "altui-onExitLua" ).setValue(srccell.attributes.prop.onExitLua,-1);
						}
					})
				},
				// change: function(event, ui ) {
				// },
			});
			$('#altui-state-form')
			.off()
			.on( 'submit', function(e) {
				var form = $(this)[0]
				if (form.checkValidity() === false) {
					// handle the invalid form...
					e.preventDefault();
					e.stopPropagation();
				}
				else {
					e.preventDefault();
					var name = $("#altui-form-StateName").val();
					Model.prop.comment = $("#altui-form-StateComment").val();
					Model.prop.onEnterLua = ace.edit( "altui-onEnterLua" ).getValue();
					Model.prop.onExitLua = ace.edit( "altui-onExitLua" ).getValue();
					if ($.isFunction(callback))
						(callback)({
							name:name,
							prop:Model.prop
						});
				}
				form.classList.add('was-validated');
				return false;
			})
			.on( 'click', '.altui-button-record', function() {
				var id = $(this).prop('id');
				var table = (id=='altui-record-onExit') ? Model.prop.onExit : Model.prop.onEnter;
				var tablescn = (id=='altui-record-onExit') ? Model.prop.onExitScenes : Model.prop.onEnterScenes;
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
								item.arguments=_buildArrayFromParams(item.params);
								delete item.params;
								table.push(item);
								break;
							case 'variable_set':
								break;
							case 'scene':
								// Format needs to be: { "altuiid": "0-57"	}
								// Recorder format: { "type": "scene", "altuiid": "0-57"  }
								delete item.type
								tablescn.push(item)
								break;
						}
					});
					$("#altui-onEnter").replaceWith( _displayActions( "altui-onEnter",Model.prop.onEnter) )
					$("#altui-onExit").replaceWith( _displayActions( "altui-onExit",Model.prop.onExit) )
					$("#altui-onEnterScenes").replaceWith( _displayScenes( "altui-onEnterScenes",Model.prop.onEnterScenes) )
					$("#altui-onExitScenes").replaceWith( _displayScenes( "altui-onExitScenes",Model.prop.onExitScenes) )
				} else {
					$("#navbar").append("<span class='altui-record-indicator'>REC</span>")
					MultiBox.startRecorder();
				}
				$('.altui-button-record').replaceWith( HTMLUtils.displayRECButton( id ) )
			})
			.on( 'click','#altui-btn-close',function() {
				if ($.isFunction(callback))
					(callback)();
			})
			.on( 'click','.altui-edit-item-altui-onExit',function() {
				var idx = $(this).prop('id');
				PickAction( Model.prop.onExit[idx],function(action) {
					if (action) {
						Model.prop.onExit[idx] = cloneObject(action)
						$("#altui-onExit").replaceWith( _displayActions( "altui-onExit",Model.prop.onExit) )
					}
				});
			})
			.on( 'click','.altui-delete-item-altui-onExit',function() {
				var idx = $(this).prop('id');
				Model.prop.onExit.splice(idx,1);
				$("#altui-onExit").replaceWith( _displayActions( "altui-onExit",Model.prop.onExit) )
			})
			.on( 'click','.altui-edit-item-altui-onEnter',function() {
				var idx = $(this).prop('id');
				PickAction( Model.prop.onEnter[idx],function(action) {
					if (action) {
						Model.prop.onEnter[idx] = cloneObject(action)
						$("#altui-onEnter").replaceWith( _displayActions( "altui-onEnter",Model.prop.onEnter) )
					}
				});
			})
			.on( 'click','.altui-delete-item-altui-onEnter',function() {
				var idx = $(this).prop('id');
				Model.prop.onEnter.splice(idx,1);
				$("#altui-onEnter").replaceWith( _displayActions( "altui-onEnter",Model.prop.onEnter) )
			})
			.on( 'click','.altui-delete-item-altui-onEnterScenes',function() {
				var idx = $(this).prop('id');
				Model.prop.onEnterScenes.splice(idx,1);
				$("#altui-onEnterScenes").replaceWith( _displayScenes( "altui-onEnterScenes",Model.prop.onEnterScenes) )
			})
			.on( 'click','.altui-delete-item-altui-onExitScenes',function() {
				var idx = $(this).prop('id');
				Model.prop.onExitScenes.splice(idx,1);
				$("#altui-onExitScenes").replaceWith( _displayScenes( "altui-onExitScenes",Model.prop.onExitScenes) )
			})
			.on('click','.altui-add-item', function(evt) {
				var table_to_update = $(this).closest("table").prop('id');
				var id = $(this).prop('id');
				switch(id) {
					case "altui-onEnter":
					case "altui-onExit": {
						PickAction( null,function(action) {
							if (action) {
								var data_to_update=null;
								switch(table_to_update) {
									case "altui-onEnter":
										data_to_update = Model.prop.onEnter;
										break;
									case "altui-onExit":
										data_to_update = Model.prop.onExit;
										break;
								}
								data_to_update.push(action);
								$("#"+table_to_update).replaceWith( _displayActions( table_to_update,data_to_update) )
							}
						});
						break;
					}
					case "altui-onEnterScenes":
					case "altui-onExitScenes": {
						PickScene( function(scene) {
							if (scene) {
								var data_to_update=null;
								switch(table_to_update) {
									case "altui-onEnterScenes":
										data_to_update = Model.prop.onEnterScenes;
										break;
									case "altui-onExitScenes":
										data_to_update = Model.prop.onExitScenes;
										break;
								}
								data_to_update.push(scene);
								$("#"+table_to_update).replaceWith( _displayScenes( table_to_update,data_to_update) )
							}
						});
						break;
					}
				}
			})
		};
		function onPropertyLink(workflow,Model,callback) {
			function PickCondition( condition, callback ) {
				var dialog = DialogManager.createPropertyDialog('Condition');
				DialogManager.dlgAddDevices( dialog , '', condition ? condition.device : NULL_DEVICE,
					function() {			// callback
						var widget = {};
						if (condition==null) {
							widget.properties ={
								deviceid:	NULL_DEVICE,
								service:	"",
								variable:	"",
							}
						} else {
							widget.properties ={
								deviceid:	condition.device,
								service:	condition.service,
								variable:	condition.variable,
							}
						}
						DialogManager.dlgAddVariables(dialog, null, widget, function() {
							var helptext = _T("Lua Expression with new being newvalue and old being oldvalue of type string. Ignore errors about undefined variables");

							DialogManager.dlgAddEditor(
								dialog,
								"LuaExpression",
								_T("Lua Expression"),
								condition ? condition.luaexpr : "",
								_T("Expression with old new as variables and lua operators like <  >  <= >= == ~="),
								"lua")
							DialogManager.dlgAddCheck(dialog,'Trigger', condition ? condition.triggeronly : false, _T("Only when triggered"));
							$('div#dialogModal').modal();
							$('div#dialogs')
								.off('click')
								.on( 'click','.modal-footer .btn-light', function(e) {
									e.stopPropagation();
									$('div#dialogModal').modal('hide');
									(callback)(null);
									return false;
								})
								.on( 'click','#altui-edit-LuaExpression',function(e) {
								})
								.off('submit',"div#dialogModal")
								.on( 'submit',"div#dialogModal", function() {
									var editor = ace.edit( "altui-editor-text-LuaExpression" );
									var altuiid = $("#altui-select-device").val();
									var state = MultiBox.getStateByID( altuiid,$("#altui-select-variable").val() );
									var condition={
										device:altuiid,
										service:state.service,
										variable:state.variable,
										luaexpr:editor.getValue(), /*$("#altui-widget-LuaExpression").val(),*/
										triggeronly:$("#altui-widget-Trigger").prop('checked')
									};
									$('div#dialogModal').modal('hide');
									(callback)(condition);
									return false;
								});
						});
					},
					null // no filter
				);
			};
			function _displayConditions( htmlid,conditions ) {
				var arr =[];
				$.each(conditions,function(idx,cond) {
					var ui = cloneObject(cond);
					ui.device = _displayDeviceName("",cond.device)
					ui.luaexpr = ui.luaexpr.replace("\n","<br>")
					ui.triggeronly = (cond.triggeronly ? "<mark>{0}</span></mark>".format(glyphTemplate.format('bolt','trigger','text-danger')) : '' )
					arr.push($.extend({},ui,{ "-":editButton.format(idx,htmlid)+blocklyButton.format(idx,htmlid)+delButton.format(idx,htmlid) }));
				});
				arr.push({
					device:plusButton.format(htmlid+"-add"),
				});
				return HTMLUtils.array2Table(arr,null,['device','service','triggeronly','variable','luaexpr','-'],_T("All conditions must match ( logical AND ) for the transition to happen"),null,htmlid);
			};
			function PickWorkflowState( exclusion_altuiid, waitForState, callback ) {
				var dialog = DialogManager.createPropertyDialog('Workflow');
				DialogManager.dlgAddWorkflowStates(dialog,'altui-select-workflowstate', _T("States") , exclusion_altuiid, waitForState);
				$('div#dialogModal').modal();
				$('div#dialogs')
					.off('click').on( 'click','.modal-footer .btn-light', function(e) {
						e.stopPropagation();
						$('div#dialogModal').modal('hide');
						(callback)(null);
						return false;
					})
					.off('submit',"div#dialogModal").on( 'submit',"div#dialogModal", function() {
						$('div#dialogModal').modal('hide');
						var val = $("#altui-select-workflowstate").val();
						var ids = val.split("_");
						var waitForState = {
							altuiid: ids[0],
							state: ids[1]
						};
						(callback)(waitForState);
						return false;
					});
			};

			function _displayWorkflows( htmlid, waitFors ) {
				var arr =[];
				$.each(waitFors,function(idx,wait) {
					var ui = {
						name: WorkflowManager.getWorkflow( wait.altuiid ).name,
						state: WorkflowManager.IDToName(wait.state)
					}
					arr.push($.extend({},ui,{ "-":editButton.format(idx,htmlid)+delButton.format(idx,htmlid) }));
				});
				arr.push({
					'name':plusButton.format(htmlid+"-add"),
				});
				return HTMLUtils.array2Table(arr,null,['name','state','-'],_T("will trigger when one workflow enters any one of these states"),null,htmlid);
			};

			function _displaySchedule(htmlid,schedule) {
				var html = "<div id='{0}'>".format(htmlid);
				if (schedule!=null)
					html += UIManager.displayTimers( [ schedule ] , { add_button:false, add_json:false });
				else
					html += plusButton.format(htmlid+"-add")
				html += "</div>";
				// var dialog = TimerEditor.init(schedule);
				// html += TimerEditor.HtmlContent();
				return html;
			};
			// UIManager.initBlockly( function() {
				_clearPage();
				var html = "<div class='col-12'>";
				html += HTMLUtils.drawForm( 'altui-link-form', _T("Link Properties"),
					[
						{ id:"altui-form-LinkName", label:_T("Link Name"), type:"input", value: Model.name, opt:{required:''} },
						{ id:"altui-form-LinkComment", label:_T("Comment"), type:"input", value: Model.prop.comment },
						{ id:"altui-LinkSmooth", label:_T("Smooth Link"), type:"input", inputtype:"checkbox", value: Model.prop.smooth	},
						{ id:"altui-form-Conditions", label:_T("Link Conditions"), type:"accordeon", value: [
							{id:'Conditions', title:_T("Conditions"), html:_displayConditions( 'altui-conditions',Model.prop.conditions )+BlocklyArea.createBlocklyArea() },
							{id:'Workflows', title:_T("Workflows"), html:_displayWorkflows( 'altui-workflows',Model.prop.workflows ) },
							{id:'Schedules', title:_T("Schedules"), html: _displaySchedule( 'altui-schedule', Model.prop.schedule ) },
							{id:'Timers', title:_T("Timers"), html:HTMLUtils.drawFormFields( [
								{ id:"altui-timername", label:_T("Timer Name"), type:"input", value: Model.prop.timer, opt:null },
								{ id:"altui-duration", label:_T("Duration (sec or min-max)"), type:"input",	 pattern:"(^\\d+(-\\d+)?|^Bag\\[\"\\S+\"\\])$", value: Model.prop.duration, opt:{placeholder:'duration, or min-max, or Bag["varname"]'} },
							])},
						]},
						{ id:"altui-btn-bar", type:"buttonbar", value:[
							{ id:"altui-btn-close", label:_T("Close"), type:"button",  },
							{ id:"altui-btn-submit", label:_T("Submit"), type:"submit",	 },
						]}
					],
					'novalidate'
				);
				html += "</div>"

				$(".altui-mainpanel").html ( html );

				// remove unsupported block WhenSince
				$("#toolbox block[type='whensince']").remove();

				var luaexpr_col =$("table#altui-conditions th[data-column-id='luaexpr']").index();
				// auto complete
				var w = WorkflowManager.getWorkflowDescr( workflow.altuiid );
				var transitions= $.map( w.transitions.filter( function(s) { return (s.name != Model.name) }) , function(s) { return s.name } );
				$('#altui-form-LinkName').autocomplete({
					source: transitions,
					// appendTo: "#altui-device-name-filter",
					delay: 200,
					select: function( event, ui ) {
						var selected = ui.item.value;
						ui.item.value = _T("Clone of {0}").format(ui.item.value);
						$.each( w.transitions, function(i,s) {
							if (s.name == selected) {
								var srccell = graph.getCell(s.id);
								$("#altui-conditions").html( _displayConditions( 'altui-conditions',srccell.attributes.prop.conditions) );
								$("#altui-schedule").html( _displaySchedule( 'altui-schedule', srccell.attributes.prop.schedule )  );
								$("#altui-timername").val( srccell.attributes.prop.timer );
								$("#altui-duration").val( srccell.attributes.prop.duration );
								Model.prop.schedule = cloneObject(srccell.attributes.prop.schedule);
								Model.prop.conditions = cloneObject(srccell.attributes.prop.conditions);
								Model.prop.timer = cloneObject(srccell.attributes.prop.timer);
								Model.prop.duration = cloneObject(srccell.attributes.prop.duration);
							}
						})
					}
				});

				$('#altui-link-form')
				.off()
				.on( 'submit', function(e) {
					var form = $('#altui-link-form')[0]
					if (form.checkValidity() === false) {
						// handle the invalid form...
						e.preventDefault();
						e.stopPropagation();
					} else {
						e.preventDefault();
						Model.name = $("#altui-form-LinkName").val()
						Model.prop.comment = $("#altui-form-LinkComment").val();
						Model.prop.timer = $("#altui-timername").val();
						Model.prop.duration = $("#altui-duration").val();
						Model.prop.smooth = $("#altui-LinkSmooth").is(':checked');
						// Model.prop.schedule already set

						if ( isNullOrEmpty(Model.prop.duration) != isNullOrEmpty(Model.prop.timer)) {
							DialogManager.warningDialog(_T("Invalid Timer"),_T("Timer name and duration must not be empty"));
							return false;
						}
						// if it is empty and it is not the start state
						if ( Model.prop.stateinfo && (Model.prop.stateinfo.bStart!=true) && (Model.prop.conditions.length==0) && (isNullOrEmpty(Model.prop.duration)) && (isNullOrEmpty(Model.prop.schedule))) {
							DialogManager.warningDialog(_T("Invalid Transition"),_T("Transition appears to be empty, you need at least a condition , a schedule or a timer"));
							return false;
						}
						if ($.isFunction(callback))
							(callback)(Model);
					}
					form.classList.add('was-validated');
					return false;
				})
				.on( 'click','#altui-btn-close',function() {
					if ($.isFunction(callback))
						(callback)();
				})

				//
				// Conditions
				//
				.on( 'click','.altui-edit-item-altui-conditions',function() {
					var idx = $(this).prop('id');
					PickCondition( Model.prop.conditions[idx],function(condition) {
						if (condition) {
							Model.prop.conditions[idx] = cloneObject(condition);
							$("#altui-conditions").html( _displayConditions( 'altui-conditions',Model.prop.conditions) );
						}
					})
				})
				.on( 'click','.altui-blockly-item-altui-conditions',function() {
					// inject Blockly if needed
					var that = $(this);
					UIManager.initBlockly( function() {
						// show blockly editor
						$(".altui-blockly-editor").toggle(true);

						BlocklyArea.initBlocklyEditor('blocklyDiv','toolbox',"", function(txt,xml) {
							// hide blockly editor
							BlocklyArea.hideEditor();
							if (txt) {
								var line = $(that).closest("tr").index();
								var cond = Model.prop.conditions[line]
								cond.luaexpr = txt;
								$("#altui-conditions").html( _displayConditions( 'altui-conditions',Model.prop.conditions) );
							}
						});
					})
				})
				.on( 'click','.altui-delete-item-altui-conditions',function() {
					var idx = $(this).prop('id');
					Model.prop.conditions.splice(idx,1);
					$("#altui-conditions").html( _displayConditions( 'altui-conditions',Model.prop.conditions) );
				})
				.on('click','#altui-conditions-add', function(evt) {
					PickCondition(null,function(condition) {
						if (condition) {
							Model.prop.conditions.push(condition);
							$("#altui-conditions").html( _displayConditions( 'altui-conditions',Model.prop.conditions ) );
						}
					});
				})
				.on('click','#altui-conditions tr td:nth-child({0})'.format(luaexpr_col+1), function(evt) {
					if ( $(this).find("input").length>0)
						return;
					var value = $(this).html();
					if ( value.indexOf("<br>")!=-1)
						// do not accept inline editing if multi line value is found
						return
					var line = $(this).closest("tr").index();
					var cond = Model.prop.conditions[line]
					$(this).html( "<input class='altui-edit-conditionexpr' data-cond='{1}' value='{0}'></input>".format(value.escapeXml(),line) );
				})
				.on('focusout','.altui-edit-conditionexpr', function() {
					var line = $(this).data('cond')
					cond = Model.prop.conditions[line]
					cond.luaexpr = $(this).val();
					$("#altui-conditions").html( _displayConditions( 'altui-conditions',Model.prop.conditions) );
				})

				//
				// Workflows
				//
					.on('click','#altui-workflows-add', function(evt) {
						PickWorkflowState(workflow.altuiid,null,function(waitForState) {
							if (waitForState) {
								Model.prop.workflows.push(waitForState);
								$("#altui-workflows").html( _displayWorkflows( 'altui-workflows',Model.prop.workflows ) );
							}
						});
					})
				.on( 'click','.altui-delete-item-altui-workflows',function() {
					var idx = $(this).prop('id');
					Model.prop.workflows.splice(idx,1);
					$("#altui-workflows").html( _displayWorkflows( 'altui-workflows',Model.prop.workflows ) );
				})
				.on( 'click','.altui-edit-item-altui-workflows',function() {
					var idx = $(this).prop('id');
					PickWorkflowState( workflow.altuiid,Model.prop.workflows[idx],function(waitForState) {
						if (waitForState) {
							Model.prop.workflows[idx] = cloneObject(waitForState);
							$("#altui-workflows").html( _displayWorkflows( 'altui-workflows',Model.prop.workflows ) );
						}
					})
				})

				//
				// Schedules
				//
				.on('click','#altui-schedule-add', function(evt) {
					var schedule = {"id":0,"name":"","enabled":1,"type":2,"days_of_week":"1"};
					if (UIManager.UI7Check()==true)
						schedule.modeStatus="0";
					TimerEditor.init(schedule);
					TimerEditor.runActions( function( schedule ) {
						Model.prop.schedule = cloneObject(schedule);
						$("#altui-schedule").html( _displaySchedule( 'altui-schedule', Model.prop.schedule )  );
					});
				})
				.on( 'click','.altui-deltimer',function() {
					Model.prop.schedule = null;
					$("#altui-schedule").html( _displaySchedule( 'altui-schedule', Model.prop.schedule )  );
				})
				.on( 'click','.altui-edittimer',function() {
					TimerEditor.init(cloneObject(Model.prop.schedule));
					TimerEditor.runActions( function( schedule ) {
						Model.prop.schedule = cloneObject(schedule);
						$("#altui-schedule").html( _displaySchedule( 'altui-schedule', Model.prop.schedule )  );
					});
				})
			// });
		};
		function _showSaveNeeded(b) {
			bSaveNeeded = b;
			$("#altui-workflow-save").toggleClass("btn-danger", !(b==false))
		}
		function _saveGraph(bPersist) {
			WorkflowManager.setGraph(workflow.altuiid,JSON.stringify( graph.toJSON() ));
			if (bPersist==true) {
				show_loading( _T("Saving workflow") );
				WorkflowManager.resyncScenes(workflow.altuiid);
				WorkflowManager.sanitizeWorkflow(workflow.altuiid);
				$.when( WorkflowManager.saveWorkflow(workflow.altuiid) )
				.done( function() {
					hide_loading();
				} )
				_showSaveNeeded(false);
			}
		}
		function _getSaveNeeded() {
			return bSaveNeeded
		}
		function isStartNode(node) {
			var model = node.attributes;
			return model.prop && model.prop.stateinfo && model.prop.stateinfo.bStart && (model.prop.stateinfo.bStart==true)
		}

		workflow = WorkflowManager.getWorkflow(altuiid);
		if (workflow==null) return;

		UIManager.clearPage('Workflow',_T("Workflow Editor")+ (": <span class='text-info'>{0}</span> <small>({1})</small>").format(workflow.name,workflow.altuiid),UIManager.oneColumnLayout);
		$("#altui-pagetitle").css("display","inline").after("<div class='altui-workflow-toolbar'></div>");
		if (MultiBox.isWorkflowEnabled() == false) {
			PageMessage.message( "Workflow mode is not enabled on your ALTUI device", "warning");
		}

		$(".altui-workflow-toolbar").replaceWith( HTMLUtils.drawToolbar( 'altui-workflow-toolbar', _toolsWorkflow,' col-12' ) );


		$(".altui-mainpanel").append("<div class='col-12'><div id='altui-workflow-canvas'></div></div>");
		UIManager.loadJointJSScript( function() {
			var bSanitized = WorkflowManager.sanitizeWorkflow(workflow.altuiid);
			if ( bSanitized == true) {
				PageMessage.message( "Workflow had to be adjusted to your vera, save is needed", "info");
			}
			graph = new joint.dia.Graph();
			//
			// Set up Jointjs things
			//
			paper = new joint.dia.Paper({
				el: $('#altui-workflow-canvas'),
				width: $('#altui-workflow-canvas').parent().innerWidth()-30, height: 600, gridSize: 1,
				model: graph,
				// interactive: { labelMove: true },
				defaultLink: WorkflowManager.Link(null, null, '??', null),
				validateConnection: function(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
					// Prevent linking to links
					if (cellViewT.model.isLink()) return false;
					// Prevent linking from output ports to input ports within one element.
					if (cellViewS === cellViewT) return false;
					// Prevent linking to start
					if (cellViewT.model.attributes.prop.stateinfo.bStart==true) return false;
					return magnetT != null
					//return magnetT && magnetT.getAttribute('type') === 'input';
				},
				// Enable link snapping within 75px lookup radius
				// snapLinks: { radius: 75 },
				// Enable marking available cells & magnets
				markAvailable: true,
				// prevent dropping link on the paper
				linkPinning: false,
				// Allowed number of mousemove events after which the pointerclick event will be still triggered.
				//or any number > 0 if you have more specific events there
				// cf http://stackoverflow.com/questions/35443524/jointjs-why-pointerclick-event-doesnt-work-only-pointerdown-gets-fired
				clickThreshold: 1,
			});

			//
			// Callbacks / Interactivity
			//

			function handleDblClick(cellView, evt, x, y) {
				var id = cellView.model.id;
				var cell = graph.getCell(id);
				if (cell==null) {
					// in this situation, jointjs started to create a new link, we are interested by the source state
					cell = graph.getCell( cellView.model.attributes.source.id )
				}
				var json = graph.toJSON();
				WorkflowManager.setGraph(workflow.altuiid,JSON.stringify(json));
				var bSave = _getSaveNeeded();
				if (cell.isLink()) {
					var Model = {
						name: cellView.model.attributes.labels[0].attrs.text.text,
						prop: WorkflowManager.getLinkProperties( cellView.model.attributes.prop )
					};
					onPropertyLink(workflow,Model,function(Model){
						if (Model) {
							cellView.model.label(0,{ position: 0.5, attrs: { text: { text: Model.name } }});
							cellView.model.attributes.prop = Model.prop;
							cellView.model.attributes.smooth = Model.prop.smooth;
							// update the graph
							_saveGraph();
						}
						_.defer(UIControler.changePage,"Workflow",[workflow.altuiid])
						_.defer(_showSaveNeeded, (Model) ? true : bSave );
					});
				} else {
					//
					// start node is like a global transition
					// any matched transition will reset the workflow to the start state
					//
					if (isStartNode(cell)) {
						var Model = {
							name: "Start",
							prop: WorkflowManager.getLinkProperties( cell.attributes.prop ),
							smooth:false
						}
						onPropertyLink(workflow,Model,function(Model){
							if (Model) {
								// cannot change name of start state
								// cellView.model.label(0,{ position: 0.5, attrs: { text: { text: Model.name } }});
								cell.attributes.prop = Model.prop;
								_saveGraph();
							}
							_.defer(UIControler.changePage,"Workflow",[workflow.altuiid])
							_.defer(_showSaveNeeded, (Model) ? true : bSave );
						});
					} else {
						var Model = {
							name: cell.attr('text/text'),
							prop: WorkflowManager.getNodeProperties( cellView.model.attributes.prop ),
						}
						onPropertyState(workflow,Model,function(Model){
							if (Model) {
								// cellView.model.attr(".label/text",Model.name);
								cell.attr('text/text',Model.name)
								cellView.model.attributes.prop = Model.prop;
								_saveGraph();
							}
							_.defer(UIControler.changePage,"Workflow",[workflow.altuiid])
							_.defer(_showSaveNeeded, (Model) ? true : bSave );
						});
					}
				}
			}

			paper.on('cell:pointerdown', function(cellView, evt, x, y) {
				var toolRemove = $(evt.target).parents('.tool-remove')[0];
				// If `.tool-remove` was clicked.
				if (toolRemove) {
					// DialogManager.confirmDialog(_T("Are you sure you want to delete this transition"),function(result) {
						// if (result == true ) {
						// }
					// });
					if (!confirm(_T("Are you sure you want to delete this transition"))) {
							// `interactive === false` prevents any action inside joint.dia.Link>>pointerdown().
							cellView.options.interactive = false;
							// Put `interactive === true` back in the next turn to make the link interactive again
							// after the user releases the mouse.
							_.defer(function() { cellView.options.interactive = true; });
							// evt.stopPropagation();
							// evt.preventDefault();
					} else {
						_showSaveNeeded();
						_.defer(_saveGraph);
					}
				}
			});

			paper.on('cell:pointerup', function(cellView, evt, x, y) {
				if ($("#altui-workflow-edit").hasClass("active")) {
					$("#altui-workflow-edit").toggleClass("active",false);
					handleDblClick(cellView, evt, x, y);
					return;
				}
				if (cellView.model.isLink()) {
					cellView.model.toFront()
					return;
				}
				if (evt.ctrlKey==false) {
					$.each(selected, function(k,s) {
						var cell = graph.getCell( s );
						var view = cell.findView(paper);
						view.unhighlight(cell);
					});
					selected=[ cellView.model.id ];
				} else {
					if ($.inArray(cellView.model.id,selected)==-1) {
						selected.push(cellView.model.id);
					}
				}
				cellView.highlight(cellView.model);
			});

			paper.on('cell:pointermove', function(event, x, y) {
				if (event.model.isLink()) {
					var clickPoint	= { x: event._dx, y: event._dy },
						length1		= event.sourcePoint.distance(clickPoint),
						length2		= event.targetPoint.distance(clickPoint),
						lengthTotal = length1 + length2, //event.sourcePoint.manhattanDistance(event.targetPoint),
						position	= _.round( length1 / lengthTotal, 2);

					event.model.label(0, { position: position });
				}
			});
			paper.on('cell:pointerdblclick', function(cellView, evt, x, y) {
				handleDblClick(cellView, evt, x, y);
			});
			paper.on('blank:pointerclick', function(cellView, evt, x, y) {
				$.each(selected, function(k,s) {
					var cell = graph.getCell( s );
					var view = cell.findView(paper);
					view.unhighlight(cell);
				});
				selected=[ ];
			});
			graph.on('change:position change:position change:source change:target change:vertices', function(cell) {
				paper.fitToContent({ padding:2 })
				// _.defer(_saveGraph);
				_showSaveNeeded();
			});
			graph.on('remove',function(cell)	{
				// return cell.isLink() ? onDeleteLink(cell) : onDeleteNode(cell) ;
				_showSaveNeeded();
			})

			//
			// draw the graph
			//
			if (workflow.graph_json) {
				graph.fromJSON( JSON.parse(workflow.graph_json) )
				$.each( graph.getElements() , function(idx,cell) {
					cell.attr({
						circle: { fill: isStartNode(cell) ? '#2ECC71' : 'lightblue'},
					});
				})

				// strange bug, arrows head are not visible without a first change or a reload of the graph
				graph.fromJSON( graph.toJSON() )
				_showSaveNeeded(bSanitized);
			}
			else {
				var s = WorkflowManager.Start();
				var m2 = WorkflowManager.Node("S1",100,200);
				var m3 = WorkflowManager.Node("S2",100,100);
				s.addTo(graph)
				m2.addTo(graph)
				m3.addTo(graph)
				WorkflowManager.Link(s,m2,'test').addTo(graph);
			}

			// size the paper properly and make the canvas resizable
			// paper.fitToContent({ padding:2 });
			paper.scaleContentToFit({ padding:5, preserveAspectRatio:true });
			//
			// refresh the graph
			//
			var previous_active = null;
			function _refreshLocalTimer(id,link) {
					if (link.attributes.labels.length<2)	// old links without 2 labels
						return;
					var txt = link.attributes.labels[1].attrs.text.text;
					var val = 0
					if (txt.indexOf(':')!=-1) {
						var date = new Date("1970-01-01T{0}Z".format(txt))
						val = date.getTime()/1000
					} else {
						val = parseInt(txt)
					}
					if (val>0) {
						val--;
						WorkflowManager.updateLinkTimerLabel(link.findView(paper),link,val);
						HTMLUtils.startTimer('altui-workflow-local-timer',1000,_refreshLocalTimer,link)
					}
			}
			function _refreshFromRemote(id,data) {
				HTMLUtils.stopTimer('altui-workflow-local-timer')
				if (id!='altui-workflow-timer')	return;
				MultiBox.getWorkflowStatus( function(data) {
					if (!data) {
						HTMLUtils.startTimer('altui-workflow-timer',5000,_refreshFromRemote,null);
						return;
					}
					// workflows states
					if ( data.states[workflow.altuiid] && graph) {
						var cell = graph.getCell( data.states[workflow.altuiid] );
						if (previous_active !=null) {
							previous_active.attr({
								circle: { fill: isStartNode(previous_active) ? '#2ECC71' : 'lightblue'},
							});
						}
						if (cell) {
							previous_active = cell;
							cell.attr({
								circle: { fill: '#F78181' },
							});
						}
						// Link Timers -- only if registered
							var linkWithTimer={};
							$.each(data.timers, function(i,timer) {
								// local lul_device,workflow_idx,timerstateid,targetstateid,linkid = parts[1],tonumber(parts[2]),parts[3],parts[4],parts[5]
								var parts = timer.data.split("#");
								if (data.states[workflow.altuiid] == parts[2]) {
									var link = graph.getCell( parts[4] )
									if (link) {	// the user may have deleted it
										var remaining_sec= Math.floor(timer.expireson - Date.now()/1000);
										linkWithTimer[parts[4]] = {
											remaining_sec: remaining_sec,
											text : "{0} @{1}s".format( link.attributes.prop.timer , remaining_sec )
											}
									}
								}
							});
							$.each( graph.getLinks(), function( i, link ) {
								if (linkWithTimer[link.id]) {
									WorkflowManager.updateLinkTimerLabel(link.findView(paper),link,linkWithTimer[link.id].remaining_sec);
									HTMLUtils.startTimer('altui-workflow-local-timer',1000,_refreshLocalTimer,link)
								} else {
									if (link.attributes.prop.timer) {
										WorkflowManager.updateLinkTimerLabel(link.findView(paper),link,null);
									}
								}
							});
					}
					// workflows Bag
					var arr=[];
					$.each(data.bags[workflow.altuiid], function(key,val) {
						arr.push({ 'variable':key, 'value':val});
					});
					$("#altui-workflow-bag-text").html( HTMLUtils.array2Table(arr,null,[],_T("Variables Bag"),"","") )
					MultiBox.getWorkflowHistory( workflow.altuiid, function(lines) {
						if ($("#altui-workflow-history-text").length>0)
							$.each(lines, function(i,line) { delete line.altuiid });
							$("#altui-workflow-history-text").html( HTMLUtils.array2Table(lines.reverse().slice(0,20),null,[],_T("History")) )
						HTMLUtils.startTimer('altui-workflow-timer',3000,_refreshFromRemote,null)
					});
				})
			}
			_refreshFromRemote('altui-workflow-timer',null);
		})
		$("#altui-workflow-zoomin").click(function() {
			var scale = paper.scale() // V(paper.viewport).scale();
			paper.scale(1.20*scale.sx, 1.20*scale.sy);
			paper.fitToContent({ padding:2 })
		});
		$("#altui-workflow-zoomout").click(function() {
			var scale = paper.scale() // V(paper.viewport).scale();
			paper.scale(0.80*scale.sx, 0.80*scale.sy)
			paper.fitToContent({ padding:2 })
		});

		$("#altui-workflow-newstate").click(function() {
			//var elements = workflow.graph.getElements();
			WorkflowManager.Node("New",0,0).addTo(graph);
			_showSaveNeeded();
			_saveGraph();
		});
		$("#altui-workflow-delete").click(function() {
			//var elements = workflow.graph.getElements();
			if (selected.length>0) {
				DialogManager.confirmDialog(_T("Are you sure you want to delete this element"),function(result) {
					if (result==true) {
						$.each(selected, function(k,s) {
							var cell = graph.getCell( s );
							if (isStartNode(cell)==false)
								cell.remove();
						});
						selected = [];
						_showSaveNeeded();
						_saveGraph();
					}
				});
			}
		});
		$("#altui-workflow-save").click( function() {
			// remove any active state fill color before saving
			$.each( graph.getElements() , function(idx,cell) {
				cell.attr({
					circle: { fill: isStartNode(cell) ? '#2ECC71' : 'lightblue' },
				});
			});
			if (AltuiDebug.IsDebug()) {
				LuaEditor.openDialog( JSON.stringify(graph.toJSON(),null,2) , function(code){
					_saveGraph(true)
				},"json",{buttons:[]});
				return;
			}
			_saveGraph(true);
		});

		$("#altui-workflow-reset").click( function() {
			WorkflowManager.resetWorkflow(workflow.altuiid);
		});

		$("#altui-workflow-edit").click( function() {
			$(this).toggleClass("active");
		});
		$("#altui-workflow-report").click( function() {
			UIControler.changePage('Workflow Report',[workflow.altuiid])
		});
		$("#altui-workflow-export").click( function() {
			// recup current one ( not necessarly yet saved, so get it from graph )
			var tmp = cloneObject(workflow);
			tmp.graph_json = JSON.stringify( graph.toJSON() )
			LuaEditor.openDialog(  JSON.stringify(tmp,null,2), function(code){
				var newwkflow = JSON.parse(code)
				WorkflowManager.setWorkflow( newwkflow );
				graph.fromJSON( JSON.parse(newwkflow.graph_json) )
				$.each( graph.getElements() , function(idx,cell) {
					cell.attr({
						circle: { fill: isStartNode(cell) ? '#2ECC71' : 'lightblue'},
					});
				})
				_showSaveNeeded(true);
			},"raw",{
					title: _T("Workflow Editor"),
					language:"raw",
					buttons:[ {id:'altui-copy-clipboard', label:_T("Copy")} ] ,
					onDisplay:function(editor) {
						$("#altui-copy-clipboard").off()
						.on('click',function(e) {
							var alltext = ""
							if (editor) {
								editor.selectAll();
								alltext = editor.getCopyText()
							} else {
								alltext = $("#altui-editor-text textarea").text();
							}
							$(this).after("<pre id='toto'></pre>")
							$("#toto").text( alltext  )
							Altui_SelectText('toto')
							document.execCommand('copy');
							$("#toto").remove()
						})
					}
			});
		});
	},

	pageWorkflows: function ()
	{
		var _toolsMain = [
			{id:"altui-workflow-create", glyph:"plus", label:_T("Create")},
			{id:"altui-workflow-save", glyph:"floppy-o", label:_T("Save")}
		];

		function _drawWorkflows(workflows) {
			var html = "";
			$("#altui-workflow-save").toggleClass("btn-danger",WorkflowManager.saveNeeded());
			$.each(workflows.sort(altuiSortByName), function(idx,workflow) {
				// 0:bootgrid classes 1:altuiid 2:htmlid 3: heading 4:panel body
				var body =
					buttonTemplate.format( workflow.altuiid, 'altui-editworkflow pull-left', wrenchGlyph,'light',_T("Settings")) +
					buttonTemplate.format( workflow.altuiid, 'altui-cloneworkflow pull-left', copyGlyph,'light',_T("Clone"));
				var pauseButtonHtml = glyphTemplate.format( "power-off", _T("Pause Workflow") , 'altui-pauseworkflow ' + ((workflow.paused>0) ? 'paused':'activated'));
				html += ALTUI_Templates.workflowContainerTemplate.format(
					"altui-workflow-container col-sm-6 col-md-4 col-lg-3 col-xl-2",
					workflow.altuiid,
					workflow.altuiid,
					workflow.name,
					buttonTemplate.format( workflow.altuiid, 'btn-sm altui-delworkflow pull-right', deleteGlyph,'default',_T("Delete")),
					body,
					pauseButtonHtml
					);
			});
			return html;
		}

		UIManager.clearPage('Workflow Pages',_T("Workflow Pages"),UIManager.oneColumnLayout);
		if (MultiBox.isWorkflowEnabled() == false) {
			PageMessage.message( "Workflow mode is not enabled on your ALTUI device", "warning");
		}
		$(".altui-mainpanel").append(HTMLUtils.drawToolbar( 'altui-workflow-toolbar', _toolsMain, 'my-2 col-12' ))
		.append("<div class='col-12'><div class='altui-workflows-pane row'></div></div>")

		UIManager.loadJointJSScript( function() {
			// do the drawing now that scripts are loaded
			$(".altui-workflows-pane").html( _drawWorkflows( WorkflowManager.getWorkflows() ) )
			// now do the refresh loop
			MultiBox.getWorkflowStatus( function(data) {
				if (data) {
					var StateToName={}
					// prepare necessary data
					$.each(data.states, function(altuiid,state) {
						var workflow = WorkflowManager.getWorkflow( altuiid );
						if (workflow && workflow.graph_json) {
							var arr = JSON.parse(workflow.graph_json).cells
							$.each(arr, function(i,cell) {
								if (cell.type != "fsa.Arrow") {
									StateToName[cell.id] = ( cell.attrs.text ? cell.attrs.text.text : 'Start' )
								}
							});
						}
					});
					// then program regular refresh
					function _refresh() {
						MultiBox.getWorkflowStatus( function(data) {
							if (!data) {
								HTMLUtils.startTimer('altui-workflow-page-timer',5000,_refresh,null)
								return;
							}
							$(".altui-workflow").each( function(idx, obj) {
								var altuiid = $(obj).data("altuiid");
								var activestate = data.states[altuiid];
								var name = StateToName[activestate]
								$(obj).find(".altui-active-state-name").text( name )
							});
							HTMLUtils.startTimer('altui-workflow-page-timer',3000,_refresh,null)
						});
					}
					_refresh();
				}
			});
		});

		// callbacks
		$("#altui-workflow-create")
			.on('click',function() {
				WorkflowManager.addWorkflow();
				$(".altui-workflows-pane").html( _drawWorkflows( WorkflowManager.getWorkflows() ) );
			});
		$("#altui-workflow-save")
			.on('click',function() {
				show_loading( _T("Saving workflows") );
				_.defer( setTimeout,function() {
								WorkflowManager.saveWorkflows(function() {
									_.defer( setTimeout,hide_loading,1000)
									$("#altui-workflow-save").toggleClass("btn-danger",WorkflowManager.saveNeeded());
								});
							},1000)
			});
		$(".altui-mainpanel")
			.off()
			.on('click',".altui-pauseworkflow",function() {
				var altuiid = $(this).closest(".altui-workflow").data("altuiid");
				var bActive = $(this).hasClass("activated")
				$(this).toggleClass("activated paused");
				WorkflowManager.pauseWorkflow(altuiid , bActive )	// if bActive, then pause
			})
			.on('click',".altui-delworkflow",function() {
				var altuiid = $(this).prop('id');
				DialogManager.confirmDialog(_T("Are you sure you want to delete workflow ({0})").format(altuiid),function(result) {
					if (result==true) {
						WorkflowManager.deleteWorkflow(altuiid);
						$(".altui-workflows-pane").html( _drawWorkflows( WorkflowManager.getWorkflows() ) );
					}
				});
			})
			.on('click',".altui-editworkflow",function() {
				var altuiid = $(this).prop('id');
				UIControler.changePage("Workflow",[altuiid])
			})
			.on('click',".altui-cloneworkflow",function() {
				if (ALTUI_registered!=true) {
					$(".altui-mainpanel").prepend( "<div class='alert alert-warning alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><p class='bg-danger'>{0}</p></div>".format(_T("Clone Workflow feature is only available for registered users") ))
				} else {
					var altuiid = $(this).prop('id');
					UIControler.changePage("Clone Workflow",[altuiid])
				}
			})
			.on('click',".altui-workflow-title-name",function(event) {
				if ( $(this).find("input").length>=1 )
					return;
				var dom = $(this).closest(".altui-workflow").addClass("altui-norefresh");	// prevent refresh while editing
				var altuiid = dom.data('altuiid');
				$(this).html("<input id='{0}' class='altui-workflow-title-input' value='{1}' data-altuiid='{2}'></input>".format(altuiid,$(this).text(),altuiid));
			})
			.off("focusout","input.altui-workflow-title-input")
			.on("focusout","input.altui-workflow-title-input",function(event) {
				var newname=$(this).val();
				var dom =$(this).closest(".altui-workflow").removeClass("altui-norefresh");
				$(this).parent().text(newname);
				WorkflowManager.renameWorkflow($(this).data("altuiid"), newname);
				$(".altui-workflows-pane").html( _drawWorkflows( WorkflowManager.getWorkflows() ) );
			})
	},

	_findPlugin: function (plugins,pluginid){
		for( var i=0; i<plugins.length; i++) {
			if (plugins[i].id == pluginid)
				return plugins[i]
		}
		return null;
	},
	_findVersionId: function (plugin,vkey){
		var result = null
		if (plugin!=null)
			$.each( plugin.Versions, function(k,v) {
				if (vkey == '{0}.{1}'.format(v.major,v.minor)) {
					result= k;
					return false;
				}
			});
		return result;
	},
	_findRepositories : function (plugin,versionid) {
		var result = [];
		var repos = plugin.Repositories
		if (versionid) {
			for( var i=0; i<repos.length; i++) {
				if (repos[i].versions[versionid]!=undefined) {
					result.push( repos[i] )
				}
			}
		} else {
			// noversion, so all possible repositories are fine
			return plugin.Repositories
		}
		return result;
	},

	pageAppPublish: function(params)
	{
		UIManager.loadJointJSScript( function() {
			var _plugins_data="";

			function _updatePlugin( plugin , cmd ) {
				if (cmd==undefined)
					cmd="update"
				if (cmd=="create") {
					if ( isNullOrEmpty(plugin.id) || (parseInt(plugin.id)==0))
						plugin.id = joint.util.uuid();
				}
				// var cmd = ""
				// if (plugin.id && ( plugin.id.toString().length>0)) {
					// cmd = 'update'
				// } else {
					// cmd = 'create'
					// plugin.id = joint.util.uuid();
				// }
				var url = "data_request?id=lr_ALTUI_Handler&command={0}_plugin".format(cmd);
				return $.ajax({
					url:url+"&plugin="+encodeURIComponent(JSON.stringify(plugin)),
					type: "GET"
				});
			}

			function _getPluginList() {
				// TODO : change to take the authorized version to restrict list to only what the user is supposed to see
				var url = "data_request?id=lr_ALTUI_Handler&command=get_authorized_plugins";
				return $.ajax({
					url:url,
					type: "GET",
				});
			}
			function _drawVeraRepository(model,vkey) {
				var vid = UIManager._findVersionId(model,vkey);
				var repositories = UIManager._findRepositories(model, vid).filter( function(repo) { return repo.type=="Vera" });
				var repo =	(repositories.length>0) ? repositories[0] : { }
				repo = $.extend({type:"Vera" , versions:{} },repo)

				var formfields=[];
				$.each( repo , function(k,v) {
					if ((k!="type") && (k!="versions")){
						formfields.push( {
								id:"altui-form-Vera-"+k,
								label:_T(k),
								type:'input',
								inputtype:"number",
								value:v,
								// opt:{required:''}
								})
					}
				})
				var verproperties = $.extend( { release:'' } , (vid) ? repo.versions[vid] : {} );
				$.each(verproperties, function(k,v) {
					formfields.push( {
							id:"altui-form-Vera-Version-"+k,
							label:_T(k),
							type:'input',
							inputtype:"number",
							value:v,
							// opt:{required:''}
							})
				});
				return HTMLUtils.drawFormFields( formfields );
			}
			function _getVeraRepository() {
				model = {type:"Vera", }
				$.each( model , function(k,v) {
					if (k!="type")
						model[k] = $("#altui-form-Vera-"+k).val();
				})
				//TODO get back version parameters
				return model;
			}
			function _drawGitHubDevice(model) {
				/*
				"[{
				  ""DeviceFileName"":""D_AltAppStore.xml"",
				  ""DeviceType"":""urn:schemas-upnp-org:device:AltAppStore:1"",
				  ""ImplFile"":""I_AltAppStore.xml"",
				  ""Invisible"":""0""
				}]"
				*/
					model = $.extend({DeviceFileName:'', DeviceType:'', ImplFile:"",Invisible:"0"},model)
					var formfields=[];
					$.each( model , function(k,v) {
						formfields.push( {
								id:"altui-form-GHDevice-"+k,
								label:_T(k),
								type:'input',
								value:v,
								// opt:{required:''}
						})
					})
					return HTMLUtils.drawFormFields( formfields );
			}
			function _getGitHubDevice() {
				model = {DeviceFileName:'', DeviceType:'', ImplFile:"",Invisible:"0"}
				$.each( model , function(k,v) {
					model[k] = $("#altui-form-GHDevice-"+k).val();
				})
				return model;
			}
			function _drawGitHubRepository(model,vkey) {
				/*
				"backup":"plugins\/backup\/DataYours\/",
				"default":"development",
				"downloads":"plugins\/downloads\/DataYours\/",
				"pattern":"[DILS]_Data%w+%.%w+",
				"source":"akbooer\/Datayours",
				"type":"GitHub"
				*/
				var vid = UIManager._findVersionId(model,vkey);
				var repositories = UIManager._findRepositories(model, vid).filter( function(repo) { return repo.type=="GitHub" });
				var repo =	(repositories.length>0) ? repositories[0] : {}
				repo = $.extend({type:"GitHub", pattern:"",source:"",folders:[], versions:{} },repo)
				var formfields=[];
				$.each( repo , function(k,v) {
					if (k=="folders") {
						v = v.join(",")
					}
					if ((k!="type") && (k!="versions")){
						formfields.push( {
								id:"altui-form-GitHub-"+k,
								label:_T(k),
								type:'input',
								value:v,
								// opt:{required:''}
								})
					}
				})
				var verproperties = $.extend( { release:'' } , (vid) ? repo.versions[vid] : {} );
				$.each(verproperties, function(k,v) {
					formfields.push( {
							id:"altui-form-GitHub-Version-"+k,
							label:_T(k),
							type:'input',
							// inputtype:"number",
							value:v,
							// opt:{required:''}
							})
				});
				return HTMLUtils.drawFormFields( formfields );
			}
			function _getGitHubRepository() {
				model = {type:"GitHub", pattern:"",source:"", folders:[]}
				$.each( model , function(k,v) {
					if (k=="type")
						return true;
					if (k!="folders")
						model[k] = $("#altui-form-GitHub-"+k).val();
					else
						model[k] = $("#altui-form-GitHub-"+k).val().split(",");
				});
				return model;
			}

			function _drawVersionSelect(array,plugin,vkey) {
				if (plugin == undefined)
					return "";

				var index=-1;
				var options = $.map(plugin.Versions, function(v,i) {
					var key = "{0}.{1}".format(v.major, v.minor);
					if (key==vkey)
						index= parseInt(i)-1
					return { value: key, text: key }
				});
				options.unshift( {value:'', text:_T("Create")} )
				return HTMLUtils.drawFormFields([
				{
					type:'select',
					id:'altui-select-version' ,
					label:_T("Select a Version"),
					options: options,
					selected_idx:index+1	// no +1 because Create as the added at the end for this one
				}
				])
			}

			function _drawPluginSelect(array,selected) {
				var index=-1;
				if (selected != undefined ) {
					$.each(array, function(i,e) {
						if (e.id==selected.id)
							index=i;
					});
				}
				var options =[];
				options.push( {value:-1, text:_T("Create")} )
				$.each( array, function(idx,plugin) {
					options.push({
						value:plugin.id,
						text:plugin.Title
						})
				});
				return HTMLUtils.drawFormFields([
				{
					type:'select',
					id:'altui-select-plugin' ,
					label:_T("Select an App"),
					options: options,
					selected_idx:index+1	// +1 because of the "Create" entry
				}
				])
			}

			function _drawPublishForm( model , vkey ) {
				model = $.extend( { id:0, Title:"",	 Description:"", Icon:"", Instructions:"", AllowMultiple:0, AutoUpdate:0, Devices:[], Versions:{}, Repositories:[] } , model );
				var html="";
				html += "<div id='altui-plugin-div' class='col-12' data-pluginid='{0}'>".format(model.id);
					html += "<div class='row'>"
						html += "<div class='col-6'>"
							html += "<div class='altui-select-app'>"
							html += _drawPluginSelect( _plugins_data, model	 )
							html += "</div>"
						html += "</div>"
						html += "<div class='col-6'>"
							html += "<div class='altui-select-version'>"
							if (model) {
								if ( (vkey == undefined) && (Object.keys(model.Versions).length>0))
								{
									var v  =model.Versions["1"]
									vkey = "{0}.{1}".format(v.major, v.minor);
								}
								html += _drawVersionSelect( _plugins_data, model , vkey )
							}
							html += "</div>"
						html += "</div>"
					html += "</div>"
					html += "<div class='row'>"
						html += "<div class='col-12'>"
							var verparts = (vkey || "").split(/\.(.+)?/)
							html += HTMLUtils.drawForm( 'altui-publish-form', _T("Edit Application Properties"),
								[
									{ id:"altui-form-Repository", label:_T("Application"), type:"accordeon", value: [
										{id:'Head', title:_T("Application"), html: HTMLUtils.drawFormFields([
											{ id:"altui-form-id", label:_T("App ID"), type:"input", value: model.id, opt:{required:''} },
											{ id:"altui-form-Title", label:_T("App Title"), type:"input", value: model.Title, opt:{required:''} },
											{ id:"altui-form-Description", label:_T("Description"), type:"input", value: model.Description, opt:{required:''} },
											{ id:"altui-form-Instructions", label:_T("Instructions"), type:"input", value: model.Instructions, },
											{ id:"altui-form-AllowMultiple", label:_T("AllowMultiple"), type:"input", inputtype:"number", value: model.AllowMultiple, opt:{required:''} },
											{ id:"altui-form-AutoUpdate", label:_T("AutoUpdate"), type:"input", inputtype:"number", value: model.AutoUpdate, opt:{required:''} },
											{ id:"altui-form-Icon", label:_T("Icon"), type:"input", value: model.Icon, opt:{placeholder:'https://xxx or relative to http://apps.mios.com'} },
											{ id:"altui-form-Major", label:_T("Version Major"), type:"input",  value: verparts[0] || "", opt:{required:''} },
											{ id:"altui-form-Minor", label:_T("Version Minor"), type:"input", value: verparts[1] || "", opt:{required:''} },
										])},
										{id:'Device', title:_T("Device"), html: _drawGitHubDevice( (model.Devices) ?  model.Devices[0] : {} ) },
										{id:'GitHub', title:_T("GitHub"), html: _drawGitHubRepository(model , vkey) },
										{id:'Vera', title:_T("Vera Store"), html: _drawVeraRepository(model , vkey)	 }
									]},
									{ id:"altui-btn-bar", type:"buttonbar", value:[
										{ id:"altui-btn-close", label:_T("Close"), type:"button",  },
										{ id:"altui-btn-create", label:_T("Create"), type:"button",	 },
										{ id:"altui-btn-submit", label:_T("Modify"), type:"submit",	 },
									]}
								],
								"novalidate" //"data-toggle='validator'"
							);
						html += "</div>"
					html += "</div>"
				html += "</div>"
				$(".altui-plugin-msg").html("");
				$(".altui-plugin-msg2").html("");
				$('#altui-plugin-div').replaceWith( html );
			}

			function _getPluginFromForm() {
				var selected = $("#altui-select-plugin").val();
				var vkey= $("#altui-select-version").val();
				var plugin = UIManager._findPlugin(_plugins_data, selected);
				var vid = UIManager._findVersionId( plugin, vkey );
				plugin= $.extend( true, plugin, {
					id:$("#altui-form-id").val(),
					Title:$("#altui-form-Title").val(),
					Description:$("#altui-form-Description").val(),
					Instructions:$("#altui-form-Instructions").val(),
					Icon:$("#altui-form-Icon").val(),
					AllowMultiple:$("#altui-form-AllowMultiple").val(),
					AutoUpdate:$("#altui-form-AutoUpdate").val(),
					Versions:{},
					Devices:[],
					Repositories:[]
				});

				// vid is either the existing one , or a new one, if it is a new one, we need to take the next free entry
				if (vid == null) {
					vid = (Object.keys(plugin.Versions).length + 1).toString()
				}
				plugin.Versions[ vid || 1 ] = {
					major:$("#altui-form-Major").val(),
					minor:$("#altui-form-Minor").val()
				}
				plugin.Devices=[];
				var devices = _getGitHubDevice()
				if (  isNullOrEmpty(devices.DeviceType)!=true )
					plugin.Devices.push(devices);

				var repo = _getGitHubRepository();
				repo.versions = {}
				repo.versions[vid || 1 ] = { release: $("#altui-form-GitHub-Version-release").val() }
				if ( plugin.Repositories.filter( function(r) {return r.type=="GitHub" }).length ==0)
					plugin.Repositories.push(repo);

				for ( var i =0 ; i<plugin.Repositories.length ; i++) {
					if (plugin.Repositories[i].type == "GitHub") {
						// not null, so add or update
						if (  isNullOrEmpty(repo.source)==true ) {
							// null , so delete repo i
							if ( Object.keys(plugin.Repositories[i].versions).length==0 )
								plugin.Repositories.splice(i,1)
						} else {
							if (  isNullOrEmpty(repo.versions[vid || 1 ].release)==true ) {
								delete plugin.Repositories[i].versions[vid || 1 ]
								if ( Object.keys(plugin.Repositories[i].versions).length==0 )
									plugin.Repositories.splice(i,1)
							} else {
								plugin.Repositories[i] = $.extend(true, plugin.Repositories[i], repo )
							}
						}
					}
				}

				var repo2 = _getVeraRepository();
				repo2.versions = {}
				repo2.versions[vid || 1 ] = { release: $("#altui-form-Vera-Version-release").val() }
				if ( plugin.Repositories.filter( function(r) {return r.type=="Vera" }).length ==0)
					plugin.Repositories.push(repo2);

				for ( var i =0 ; i<plugin.Repositories.length ; i++) {
					if (plugin.Repositories[i].type == "Vera") {
						// not null, so add or update
						if (  isNullOrEmpty(repo2.versions[vid || 1 ].release )!=true ) {
							plugin.Repositories[i] = $.extend(true, plugin.Repositories[i], repo2 )
						} else {
							// null , so delete version from repo
							delete plugin.Repositories[i].versions[vid || 1 ]
							if ( Object.keys(plugin.Repositories[i].versions).length==0 )
								plugin.Repositories.splice(i,1)
						}
					}
				}
				return plugin;
			}
			function _runActions() {
				$(".altui-mainpanel")
					.off("change")
					.on("change","#altui-select-plugin", function() {
						var selected = $(this).val();
						_drawPublishForm(  UIManager._findPlugin(_plugins_data, selected ) );
					})
					.on("change","#altui-select-version", function() {
						var selected = $("#altui-select-plugin").val();
						var vkey = $(this).val();
						_drawPublishForm(  UIManager._findPlugin(_plugins_data, selected ) , vkey);
					})
					.off("click")
					.on("click","#altui-btn-close", function() {
						_.defer(  UIManager.pageAppStore)
					})
					.on("click","#altui-btn-create", function(event) {
						var plugin = _getPluginFromForm();
						var form = $("#altui-btn-create").closest("form")[0]
						if (form.checkValidity() === false) {
							event.preventDefault();
							event.stopPropagation();
						} else {
							_updatePlugin( plugin ,"create" ) .done( function(data) {
								PageMessage.message( data, "success");
							})
						}
						form.classList.add('was-validated');
					})
					.on("submit","#altui-publish-form", function(event) {
						var form = $("#altui-publish-form")[0]
						if (form.checkValidity() === false) {
							event.preventDefault();
							event.stopPropagation();
						} else {
							var plugin = _getPluginFromForm();
							if ( isNullOrEmpty(plugin.Title) )
								return false;
							_updatePlugin( plugin ) .done( function(data) {
								PageMessage.message( data, "success");
							})
						}
						form.classList.add('was-validated');
						return false;
					})
			}

			function _displayPublishPage() {
				// prepare the callbacks
				function onMessage(line,str) {
					if (line==1)
						$(".altui-plugin-msg").html(str)
					else if (line==2)
						$(".altui-plugin-msg2").html(str)
				}
				function onData(data) {
					// got proper list of plugins
					_plugins_data = data.data
					_drawPublishForm()
					_runActions()
				}
				function onFailure(jqx) {
					$(".altui-plugin-msg2").html("")
				}

				// make the protected call
				$(".altui-plugin-msg").html(_T("Contacting Server..."))
				OAuth.Call( _getPluginList , null, onMessage , onData , onFailure);
			}
			var publish_url = 'https://script.google.com/macros/s/AKfycbw7ZFJM0EWhYtc1aEm4fWxk2vC6gwO4S4ly6y3g0xCqE_5cRHkO/exec';
			UIManager.clearPage('Publish App',_T("Publish Application"),UIManager.oneColumnLayout);
			$(".altui-mainpanel").append("<div class='altui-plugin-msg col-12'></div><div class='altui-plugin-msg2 col-12'></div><div id='altui-plugin-div'></div>");
			_displayPublishPage();
		});
	},

	pageAppStore: function(params)
	{
		var defaultPlugin = {
			id:0,
			Title:'',
			Description:'',
			Icon:'',
			Versions:{},
			Repositories:[],
			Devices:[],
		};
		var nMaxPerPage = 20;
		var nPage = 1;
		var arr = ["abc","def","ghi","jkl","mno","pqr","stu","vwx","yz "];
		var installglyph = glyphTemplate.format( "cloud-download", "", "" );
		var pageGlyphs = {
			// "forward" : glyphTemplate.format( "forward", _T("Next Page"), "" ),
			// "backward" : glyphTemplate.format( "backward", _T("Prev Page"), "" ),
			"spinner" : glyphTemplate.format( "spinner", _T("Refresh"), "text-warning fa-pulse fa-3x fa-fw" )
		};
		var pluginsFilter = {
			filterbtn:null,
			filtername:null
		}
		var _plugins_data = null;
		var _counts=[];

		function _getPlugins( params ) {
			return $.ajax({
				url:getlist_url,
				dataType: "jsonp",
				data: $.extend( { }, params ),
				cache:false
			})
		}
		function _getReviews( pluginid ) {
			return $.ajax({
				url:getlist_url,
				dataType: "jsonp",
				data: { command:'get_reviews' , id: pluginid  },
				cache:false
			})
		}
		function _updatePluginReview( data	) {
			var url = "data_request?id=lr_ALTUI_Handler&command=update_plugin_review";
			return $.ajax({
				url:url,
				type: "GET",
				data:data,
				cache:false
			});
		}

		function _computeCounts() {
			$.each(arr,function(k,v) { _counts[v]=0 } );
			$.each(_plugins_data.plugins,function(idx,plugin) {
				var index = Math.floor((plugin.Title.toLowerCase().charCodeAt(0) - "a".charCodeAt(0))/3)
				var c = arr[index];
				_counts[c] = (_counts[c]  || 0)+1;
			});
		}
		function _displayCategories() {
			var html = "";
			html += "<div class='altui-store-categories btn-group-vertical'>"  /*data-toggle='buttons'*/

			html += "<button id='*' type='button' class='altui-plugin-category-btn btn btn-light'>{0}</button>".format(_T("All"))
				$.each(arr, function(i,entry) {
					html += "<button id='{0}' type='button' class='altui-plugin-category-btn btn btn-light'>{0} <span class='pull-right d-none d-sm-block badge badge-secondary'>{1}</span></button>"
					.format(entry,_counts[entry] || 0 )
				});
			html += "</div>"
			html += "<button id='altui-publish' type='button' class='altui-plugin-publish-btn btn btn-light'>{0}</button>".format(_T("Publish"))
			return html;
		}
		function _displayCarousel( ) {
			var nMax = 15;
			function getRandomInt(min, max) {
				return Math.floor(Math.random() * (max+1 - min)) + min;
			}
			var pluginIDs = $.map( _plugins_data.plugins, function(elem,i) {
				return elem.id;
			});
			var bFirst = true;
			var nentries = Math.min(nMax,pluginIDs.length);
			var html = "";
			html += "<div id='carousel-example-generic' class='carousel slide altui-store-carousel' data-ride='carousel'>"
			html += "  <ol class='carousel-indicators'>"
			for( var i=0;i<nentries;i++) {
				html += "<li data-target='#carousel-example-generic' data-slide-to='{1}' class='{0}'></li>".format( ((bFirst) ? 'active':'' ),i )
				bFirst = false;
			}
			html += "  </ol>"
			bFirst = true;
			html += "  <div class='carousel-inner'>"
			for (i=0; i<nentries ; i++) {
				var index = (nentries <=nMax) ? i : getRandomInt(0,_plugins_data.plugins.length);
				var plugin = $.extend( {}, defaultPlugin, _plugins_data.plugins[index.toString()] );
					html += "	 <div class='carousel-item {0}'>".format( (bFirst) ? 'active':'')
					html += "	   <div class='altui-features-box'></div>"
					html += "	   <div class='carousel-caption'>"
					html += ( plugin.Icon.startsWith('https') ? "<img src='{0}'></img>"	 : "<img class='pull-left' src='//apps.mios.com/{0}'></img>" ) .format(plugin.Icon);
					html += "		<h3>{0}</h3><p>{1}</p>".format(plugin.Title.htmlEncode(),plugin.Description.htmlEncode() || "")
					html += "	   </div>"
					html += "	 </div>"
				bFirst = false;
			}
			html += "  </div>"
			html += "  <!-- Controls -->"
			html += "  <a class='carousel-control-prev' href='#carousel-example-generic' role='button' data-slide='prev'>"
				html +='<span class="carousel-control-prev-icon" aria-hidden="true"></span>'
				html +='<span class="sr-only">Previous</span>'
			html += "  </a>"

			html += "  <a class='carousel-control-next' href='#carousel-example-generic' role='button' data-slide='next'>"
				html +='<span class="carousel-control-next-icon" aria-hidden="true"></span>'
				html +='<span class="sr-only">Next</span>'
			html += "  </a>"
			html += "</div> <!-- Carousel -->"
			return html;
		}
		function _orderVersions(pluginapp) {
			var arr = $.map( Object.keys(pluginapp.Versions), function(key,i) {
					var v = pluginapp.Versions[key]
					var str = "{0}.{1}".format(v.major||'0',v.minor||'0')
					return { id:i+1, label: str, major:parseInt(v.major), minor:parseFloat(v.minor) }
			} );
			return arr.sort( function(a,b) {
					// reverse order
					if (b.major>a.major)
						return 1
					if (b.major<a.major)
						return -1
					return b.minor-a.minor
				});
		}
		function _drawVersionSelect(pluginapp,arr) {
			var html = "<select class='form-control-sm form-control altui-version-selector'>"
			// var arr = _orderVersions(pluginapp);
			$.each(arr, function(key,version) {
					html += "<option value='{0}'>{1}</option>".format(version.label,version.label.substring(0,13))
				})
			html +="</select>"
			return html;
		}
		function _displayInstallButtons(plugin,versionid) {
			var html = "";
			html += "<div class='altui-install-buttons'>"
			var repositories = (versionid != undefined) ? UIManager._findRepositories(plugin,versionid) : plugin.Repositories
			$.each(repositories,function(i,repo) {
				if (repo.type=="GitHub")
					html += "<button title='{2}' class='pull-left altui-store-install-btn btn btn-sm btn-info'>{0} {1}</button>".format(installglyph,_T("ALT"),_T("Install from Github with Alt App Store"))
				if (repo.type=="Vera")
					html += "<button title='{2}' class='pull-left altui-store-mcvinstall-btn btn btn-sm btn-info'>{0} {1}</button>".format(installglyph,_T("Vera"),_T("Install from the Vera App Store"))
			});
			html += "</div>"
			return html;
		}
		function _displayPluginReviews(cls,plugin) {
			var reviews = $.extend({average_rating:0,nb:0},plugin.reviews)
			var html ="";
			var stars = "";
			var title = (_T("Review this plugin!")+" ({0})").format(reviews.average_rating)
			for( var i=1 ; i<= Math.round(reviews.average_rating); i++) {
				stars += glyphTemplate.format("star",title,"text-warning")
			}
			for( var i=1+Math.round(reviews.average_rating); i<=5; i++) {
				stars += glyphTemplate.format("star-o",title,"")
			}
			html +="<div class='{2}'>{0} <span class='badge badge-secondary'>{1}</span></div>".format(stars, reviews.nb,cls)
			return html;
		}
		function _displayOnePlugin(plugin) {
			var arr = _orderVersions(plugin);
			var firstversionid = arr[0].id;
			var html = "";
				html += "<div id='{0}' class='col-6 col-sm-4 col-lg-3 altui-pluginbox' data-pluginid='{0}'>".format(plugin.id)
					html += "<div class='card xxx altui-pluginbox-panel'>"
						html += "<div class='card-body'>"
							html += "<div class='altui-plugin-version pull-right'>{0}</div>".format(_drawVersionSelect(plugin,arr))
							html += ( plugin.Icon && plugin.Icon.startsWith('https') ? "<img {1} class='altui-plugin-icon' src='{0}'></img>"  : "<img {1} class='altui-plugin-icon' src='//apps.mios.com/{0}'></img>" ) .format(plugin.Icon,"onerror='this.src=defaultIconSrc'");
							html += "<div class='altui-plugin-title'>{0}<span class='pull-right altui-plugin-help' title='{2}'>{1}</span></div>".format(
								plugin.Title.htmlEncode(),
								glyphTemplate.format("info-circle",plugin.Description,"text-info"),
								plugin.Description
								)
							// if ($.isArray(plugin.Repository) == false) {
								// plugin.Repository = [plugin.Repository]
							// }
							html += _displayPluginReviews('altui-plugin-reviews',plugin);
							html += _displayInstallButtons(plugin , firstversionid)
						html += "</div>"
					html += "</div>"
				html += "</div>"
			return html;
		}
		function _displayPageSwitch(direction) {
			var html = "";
				html += "<div class='altui-pageswitchbox col-2'>"
				// html += buttonTemplate.format(direction,'altui-plugin-pageswitch',pageGlyphs[direction]+" "+direction,'secondary',direction)
				html += "</div>"
				return html;
		}
		function _displayPlugins( filter ) {
			filter = $.extend({},filter)
			$(".altui-store-items").html("<div class='col-12'><div class='jumbotron'><p>{0}</p></div></div>".format(pageGlyphs["spinner"]));
			$(".altui-store-paging").html( "" );
			var filterbtn = filter.filterbtn
			var filtername = filter.filtername
			// get the detailled data
			var params = {
				versions:true ,
				reviews:true,
				page: nPage,
				per_page: nMaxPerPage
			}

			if (filtername)
				params.filter_Title=filtername+"*"

			if (filterbtn) {
				var str =[]
				for ( var i=0; i<filterbtn.length; i++)
					str.push(filterbtn[i]+"*")
				params.filter_Title=str.join(",")
			}

			_getPlugins(params)
			.done( function (data, textStatus, jqXHR) {

				// decode
				if ( typeof data === "string" ) {
					try {_plugins_data.details= JSON.parse( data ) } catch(e) {_plugins_data.details ={ plugins:[] }}
				} else {
					_plugins_data.details = data;
				};

				// sort
				_plugins_data.details.plugins.sort( function(a,b) {return a.Title.localeCompare(b.Title); } )

				// display
				var html = "";
				$.each(_plugins_data.details.plugins,function(idx,plugin) {
					html += _displayOnePlugin(plugin)
				});

				$(".altui-store-items").html(html);
				$(".altui-store-paging").html( "<div id='altui-pager'></div>" );

				$("#altui-pager").Pager({
					// large: true,
					maxpages: _plugins_data.details.pagination.nbPage,
					curpage: _plugins_data.details.pagination.page,
					batchpages: 5,
					onstart: function(e) { nPage=1 ; _displayPlugins( pluginsFilter ); },
					onend:	 function(e) { nPage=_plugins_data.details.pagination.nbPage; _displayPlugins( pluginsFilter ); },
					onprev:	 function(e) { nPage-- ; _displayPlugins( pluginsFilter ); },
					onnext:	 function(e) { nPage++ ; _displayPlugins( pluginsFilter ); },
					onpage:	 function(e,n) { nPage = parseInt(n) ; _displayPlugins( pluginsFilter ); }
				})
			});
		}
		function _displayStore(	 ) {
			var html = "";
			_computeCounts();
			// carousel
			html += "<div class='row'>";
				html += "<div class='col-12'>";
					html += _displayCarousel()
				html += "</div>";
			html += "</div>";


			html += "<div class='row'>";
				// categories
				html += "<div class='col-2'>{0}</div>".format( _displayCategories() )
				// plugins
				html += "<div class='col-10'>"
					html += "<div class='row'>";
						html+="<div id='altui-plugin-name-filter' class='col-12 input-group'>";
							html+="<div class='input-group-prepend'><span class='input-group-text' id='altui-plugin-search-btn'>"+searchGlyph+"</span></div>";
							html+="<input id='altui-plugin-name-filter-input' type='text' class='form-control' placeholder='Plugin Name' aria-describedby='name' value=''>";
						html += "</div>";
					html += "</div>";
				html += "<div class='altui-store-items row'>";
				html += "</div>";
				html += "<div class='altui-store-paging row'>";
				html += "</div>";
				html += "</div>"
			html += "</div>";
			return html;
		}

		UIManager.clearPage('App Store',_T("Application Store"),UIManager.fullColumnLayout);
		$("#altui-pagemessage").remove();

		_getPlugins({ versions:false })
		.done( function (data, textStatus, jqXHR) {
			if ( typeof data === "string" ) {
				try {_plugins_data= JSON.parse( data ) } catch(e) {_plugins_data={ plugins:[] }}
			} else {
				_plugins_data = data;
			};
			_plugins_data.plugins.sort( function(a,b) {return a.Title.localeCompare(b.Title); } )
			$(".altui-mainpanel").html(_displayStore());

			pluginsFilter = { }
			_displayPlugins( pluginsFilter );

			// interactivity
			$('#altui-plugin-name-filter-input').autocomplete({
				source: $.map(_plugins_data.plugins, function(p) { return p.Title } ),
				select: function( event, ui ) {
					pluginsFilter = { filtername:ui.item.value }
					_displayPlugins( pluginsFilter );
				}
			});
			$(".altui-mainpanel").off()
			.on("change","#altui-plugin-name-filter-input",function() {
				var filter = $(this).val();
				pluginsFilter = { filtername:filter}
				_displayPlugins( pluginsFilter );
			})
			.on ('change',".altui-version-selector",function() {
				var dom = $(this).closest(".altui-pluginbox")
				var vernum= $(this).val();
				var installbuttons = $(dom).find(".altui-install-buttons");
				var pluginid= $(dom).data("pluginid");
				var plugin = UIManager._findPlugin(_plugins_data.details.plugins,pluginid)
				var versionid = UIManager._findVersionId(plugin,vernum)
				// var repositories = UIManager._findRepositories(plugin,versionid)
				$(installbuttons).replaceWith( _displayInstallButtons(plugin,versionid) );
			})
			.on("click",".altui-plugin-help",function() {
				var pluginid= $(this).closest(".altui-pluginbox").data("pluginid");
				var plugin = UIManager._findPlugin(_plugins_data.details.plugins,pluginid)
				if (plugin.Instructions)
					window.open( plugin.Instructions, '_blank');
			})
			.on("click",".altui-plugin-reviews",function() {
				var pluginid= $(this).closest(".altui-pluginbox").data("pluginid");
				var plugin = UIManager._findPlugin(_plugins_data.details.plugins,pluginid)
				var dialog = DialogManager.registerDialog('dialogModal',
									defaultDialogModalTemplate.format( 'dialogModal',
										_T('Plugin Rating for {0}'.format(plugin.Title)),	// title
										_displayPluginReviews("altui-reviews-graph",plugin) ,	// body
										"modal-lg",	// size
										""	// glyph icon
									));
				var choices = $.map( [ "1-poor","2-below avg","3-average","4-above avg","5-excellent" ] , function(e,i) {return { value:i+1,text:_T(e) } } );
				DialogManager.dlgAddHtml(dialog, "<div class='altui-plugin-review-tbl'></div>")
				DialogManager.dlgAddSelect(dialog, "Rating", _T("Rating"), 3, choices, null)
				DialogManager.dlgAddLine( dialog , "Comment", _T("Comment"), "", "", null );
				DialogManager.dlgAddLine( dialog , "UserName", _T("User Name"), MultiBox.getMainUser().Name, "", null );
				DialogManager.dlgAddDialogButton($('div#dialogModal'), true, _T("Save Changes"));
				$('div#dialogModal').modal();

				function onMessage(line,str) {
					// whatever line
					$(".altui-plugin-review-tbl").html(str)
				}
				function onFailure(textStatus) {
				}
				function onData(data) {
					data = $.map(data.reviews, function(e,i) {
						return {User:e.user_name, Rate:e.rate, Comment:e.comment}
					})
					if (data.length>0) {
						var html = HTMLUtils.array2Table(data,'',null,_T("Reviews"),"","altui-reviews-text")
						$(".altui-plugin-review-tbl").html("<div>{0}</div>".format(html))
					}
				}
				OAuth.Call( _getReviews , pluginid, onMessage , onData , onFailure);

				$('div#dialogs')
					.off('submit',"div#dialogModal")
					.on( 'submit',"div#dialogModal", function() {
						OAuth.Call (
							_updatePluginReview ,
							{
								plugin_id : pluginid,
								comment : $("#altui-widget-Comment").val(),
								rate : $("#altui-widget-Rating").val(),
								user_name : $("#altui-widget-UserName").val()
							},
							onMessage,
							function(data) {
								$('div#dialogModal').modal('hide');
								PageMessage.message( _T("Success")+":"+data, "success");
							},
							function (textStatus) {
								onMessage(textStatus)
							}
						);
					})
			})
			.on("click",".altui-plugin-pageswitch",function() {
				var direction = $(this).prop("id")
				if (direction=="forward")
					nPage++;
				else
					nPage--;
				_displayPlugins( pluginsFilter );
			})
			.on("click",".altui-plugin-category-btn",function() {
				var filter = $(this).prop("id");
				nPage = 1;
				pluginsFilter = { filterbtn:filter }
				_displayPlugins( pluginsFilter );
			})
			.on("click",".altui-plugin-publish-btn",function() {
				UIControler.changePage('Publish App')
			})
			.on("click",".altui-store-mcvinstall-btn",function() {
				var that = this;
				// search version info
				var pluginid = $(this).closest(".altui-pluginbox").data("pluginid");
				var plugin = UIManager._findPlugin(_plugins_data.details.plugins,pluginid)
				var vernum= $(this).closest(".altui-pluginbox").find(".altui-version-selector").val();
				var versionid = UIManager._findVersionId(plugin,vernum)
				var repositories = UIManager._findRepositories(plugin,versionid)
				$.each( repositories, function( i, repo ) {
					if (repo.type == "Vera") {
						var version_in_repo = repo.versions[ versionid ];
						MultiBox.updatePluginVersion("0-0", pluginid, version_in_repo.release, function(result) {
							$(that).text(_T("Success")).removeClass("btn-info").addClass("btn-success disabled");
						})
						return false;
					}
				});
			})
			.on("click",".altui-store-install-btn",function() {
				var that = this;
				var altuiapp_device = MultiBox.getDeviceByType(0,"urn:schemas-upnp-org:device:AltAppStore:1",[0,2])		// make sure to only search for openluup altappstore even if several instances exist
				if (altuiapp_device != null) {
					var pluginid = $(this).closest(".altui-pluginbox").data("pluginid");
					var plugin = UIManager._findPlugin(_plugins_data.details.plugins,pluginid)
					var vernum= $(this).closest(".altui-pluginbox").find(".altui-version-selector").val();
					var versionid = UIManager._findVersionId(plugin,vernum)
					var repositories = UIManager._findRepositories(plugin,versionid)

					$.each( repositories, function( i, repo ) {
						if (repo.type == "GitHub") {
							MultiBox.runAction(altuiapp_device, "urn:upnp-org:serviceId:AltAppStore1", "update_plugin",
								{
									metadata: JSON.stringify({
										plugin: {
											id: plugin.id,
											Title: plugin.Title,
											Description: plugin.Description,
											Icon: plugin.Icon,
											Instructions: plugin.Instructions,
											AllowMultiple: plugin.AllowMultiple,
											AutoUpdate: plugin.AutoUpdate
										},
										repository: repo,							// [{"type":"GitHub","source":"amg0/IPhoneLocator","pattern":"IPhone","versions":{"2":{"release":"master"}}},{"type":"Vera","versions":{"1":{"release":"31718"}}}]
										devices: plugin.Devices,					// [{  "DeviceFileName":"D_Netatmo.xml",  "DeviceType":"urn:akbooer-com:device:Netatmo:1",	"ImplFile":"I_Netatmo.xml",	 "Invisible":"0"}]
										version: plugin.Versions[ versionid ]	,	//	{"major":15,"minor":"0130"}
										versionid: versionid
									})
								},function(result) {
									$(that).text(_T("Success")).removeClass("btn-info").addClass("btn-success disabled");
									alert(result);
								}
							);
							return false;
						}
					});
				} else {
					$(that).text(_T("Failure")).removeClass("btn-info").addClass("btn-danger disabled");
				}
			});
		})
	},

	pageTimeline: function ()
	{
		var removeGlyph = "<small>{0}</small>".format( glyphTemplate.format( "remove", _T("Remove"), "altui-timeline-blacklist" ) );
		var workflows = null;			// Create a DataSet (allows two way data-binding)
		var groups = null;				// create a data set with groups
		var groupsview = null;		// create a data view with groups
		var items = null;
		var itemsview = null;			// create a data view with items
		var _blacklist = [];
		var id = 0;
		var filters = {
			scenes:		{ name:'Scenes' , bEnabled:true , update: updateScenes },
			triggers: { name:'Triggers', bEnabled:true },
			security: { name:'Security', bEnabled:true, update: updateDevices },
			securityArmed: { name:'SecurityArmed', bEnabled:false, update: updateDevicesArmed },
			watches:	{ name:'Watches' , bEnabled:true, update: updateWatches },
			workflows:{ name:'Workflows', bEnabled:true, update: updateWorkflows },
		}
		var _toolsTimeline = [
			{id:"altui-zoomIn", glyph:"search-plus", label:_T("Zoom In")},
			{id:"altui-zoomOut", glyph:"search-minus", label:_T("Zoom Out")},
			{id:"altui-moveLeft", glyph:"hand-o-left", label:_T("Move Left")},
			{id:"altui-moveRight", glyph:"hand-o-right", label:_T("Move Right")},
			{id:"altui-moveNow", glyph:"clock-o", label:_T("Track Now")},
			{id:"altui-timeline-filter", cls:"ml-2", type:"select", multiple:"true" },
		];

		/**
		 * Move the timeline a given percentage to left or right
		 * @param {Number} percentage	For example 0.1 (left) or -0.1 (right)
		 */
		function move (percentage) {
					var timeline = $('#visualization').data('timeline');
					if (percentage==0) {
							timeline.moveTo( new Date() )
					} else {
						var range = timeline.getWindow();
						var interval = range.end - range.start;

						timeline.setWindow({
								start: range.start.valueOf() - interval * percentage,
								end:   range.end.valueOf()	 - interval * percentage
						});
					}
		}

		/**
		 * Zoom the timeline a given percentage in or out
		 * @param {Number} percentage	For example 0.1 (zoom out) or -0.1 (zoom in)
		 */
		function zoom (percentage) {
			var timeline = $('#visualization').data('timeline');
			var range = timeline.getWindow();
			var interval = range.end - range.start;

			timeline.setWindow({
				start: range.start.valueOf() - interval * percentage,
				end:   range.end.valueOf()	 + interval * percentage
			});
		}
		function customOrder(a, b) {
			// order by id
			return a.id - b.id;
		}

		function timelineAddDevice(device, idprefix, group, bAddAllways, bArmedOnly) {
			var lasttrip = MultiBox.getStatus(device,"urn:micasaverde-com:serviceId:SecuritySensor1","LastTrip")
			var tripped = MultiBox.getStatus(device,"urn:micasaverde-com:serviceId:SecuritySensor1","Tripped")
			var armed = MultiBox.getStatus(device,"urn:micasaverde-com:serviceId:SecuritySensor1","Armed")
			// var lastuntrip = MultiBox.getStatus(device,"urn:micasaverde-com:serviceId:SecuritySensor1","LastUntrip")
			// if (lastuntrip)
					// lastuntrip = lasttrip+5000
			// var end = ( lastuntrip && (lastuntrip>lasttrip)) ? new Date(lastuntrip*1000) : null
			if (lasttrip && ((bAddAllways==true) || (tripped=="1")) ) {
				if ( (!is_blacklisted("DLT_"+device.altuiid)) && ( (bArmedOnly==false) || (armed==true)) ) {

					items.update({
						id: '{2}_{0}_{1}'.format(device.altuiid,lasttrip,idprefix),
						group:group,	//security
						start: new Date(lasttrip*1000),
						// end:end,
						content: '<span title="{2}">{0} (<a class="altui-goto-device" data-altuiid="{1}">{1}</a>)</span>{3}'.format(device.name,device.altuiid,HTMLUtils.enhanceValue(lasttrip),removeGlyph),
						// className: (tripped=="1") ? "altui-timeline-item-tripped" : "altui-timeline-item-untripped"
					})
				}
			}
		}

		function updateDevices() {
			MultiBox.getDevices(
				function(idx,device) {
					timelineAddDevice(device, "DLT", 'security',true,false)	// all devices
				},
				null,
				function(alldevices) {
					// updateWatches()
					// updateWorkflows()
					// updateTimeline(groups,items)
				}
			)
		}

		function updateDevicesArmed() {
			MultiBox.getDevices(
				function(idx,device) {
					timelineAddDevice(device,"ADLT", 'securityArmed', true,true) // armed only devices
				},
				null,
				function(alldevices) {
					// updateWatches()
					// updateWorkflows()
					// updateTimeline(groups,items)
				}
			)
		}

		function updateWorkflows() {
				MultiBox.getWorkflowHistory( null, function(lines) {
					$.each(lines.slice(-100),function(i,line) {
						if (!is_blacklisted("WFT_"+line.altuiid)) {
							items.update({
								id: 'WFT_{0}_{1}'.format(line.altuiid,line.date.getTime()),
								group:'workflows',	// workflow,
								start: line.date,
								content:'<span title="{2}">{0} (<a class="altui-goto-workflow" data-altuiid="{1}">{1}</a>)</span>{3}'.format(line.firing_link,line.altuiid,HTMLUtils.enhanceValue(line.date),removeGlyph)
							})
						}
					});
				})
		}

		function updateWatches() {
			MultiBox.getWatchesHistory(function(data) {
				$.each(data, function(idx,item) {
					var device = MultiBox.getDeviceByAltuiID(item.altuiid)
					if (!is_blacklisted("WLU_"+item.altuiid)) {
						items.update({
							id: 'WLU_{0}_{1}'.format(item.altuiid,item.lastUpdate),
							group:'watches',	//watch
							start: new Date(item.lastUpdate*1000),
							// end:end,
							content: '<span title="{3}">{0}:{1}(<a class="altui-goto-device" data-altuiid="{2}">{2}</a>):<small class="text-info">{4}</small></span>{5}'.format(device.name,item.variable,item.altuiid,HTMLUtils.enhanceValue(item.lastUpdate),item.lastNew,removeGlyph)
						})
					}
				})
			});
		}

		function updateScenes() {
			MultiBox.getScenes(
				function(idx,scene) {
					if (scene.last_run != undefined) {
						if (!is_blacklisted('SLR_'+scene.altuiid))
							items.update({
								id: 'SLR_'+scene.altuiid,
								group:'scenes',	//scenes
								start: new Date(scene.last_run*1000),
								content: '<span title="{2}">{0} (<a class="altui-goto-scene" data-altuiid="{1}">{1}</a>)</span>{3}'.format(scene.name,scene.altuiid,HTMLUtils.enhanceValue(scene.last_run),removeGlyph)
							})
					}
					var nextrun = _findSceneNextRun(scene);
					if (nextrun>0) {
						if (!is_blacklisted('SNR_'+scene.altuiid))
							items.update({
								id: 'SNR_'+scene.altuiid,
								group:'scenes',	//scenes
								start: new Date(nextrun*1000),
								content: '<span title="{2}">{0} (<a class="altui-goto-scene" data-altuiid="{1}">{1}</a>)</span>{3}'.format(scene.name,scene.altuiid,HTMLUtils.enhanceValue(nextrun),removeGlyph)
							})
					}
					$.each(scene.triggers || [] , function(idx,trigger) {
						if (trigger.last_run) {
							if (!is_blacklisted('STLR_'+scene.altuiid))
								items.update({
									id: 'STLR_{0}_{1}'.format(scene.altuiid,idx),
									group:'triggers',	//triggers
									start: new Date(trigger.last_run*1000),
									content: '<span title="{3}">{0}:{1} (<a class="altui-goto-scene" data-altuiid="{2}">{2}</a>)</span>{4}'.format(scene.name,trigger.name||'',scene.altuiid,HTMLUtils.enhanceValue(trigger.last_run),removeGlyph)
								})
						}
					});
				},
				function(scene) { return (scene.paused!=1) },
				function(allscenes) {
				}
			);
		}

		function is_blacklisted(id) {
			return ($.inArray(id,_blacklist) != -1)
		}

		function blacklist(id) {
			var parts = id.split("_")
			var ids = items.getIds( {
				filter: function (item) {
					var itemparts = item.id.split("_")
					return (itemparts[0] == parts[0]) && (itemparts[1] == parts[1]);
				}
			})
			_blacklist.push(parts[0]+'_'+parts[1])
			$.each(ids, function(idx,id) {
				items.remove(id)
			});
		}

		function updateTimeline(groups,items) {
			// Create a Timeline
			var timeline = $('#visualization').data('timeline')

			if (timeline==null) {
				// Configuration for the Timeline
				var options = {
					groupOrder: 'content',
					orientation: {axis: 'both', item:'top'},
					order: customOrder,
					dataAttributes: ['id']
				};
				var container = document.getElementById('visualization');
				var timeline = new vis.Timeline(container);
				$('#visualization').data('timeline',timeline);
				timeline.setOptions(options);
				timeline.setGroups(groups);
				timeline.setItems(items);
			}
			if (ALTUI_registered==true) {
					var timeline = $('#visualization').data('timeline');
					var props = MyLocalStorage.getSettings("TimelineRange");
					if (props!=null) {
						setTimeout( function() {
							var range = new Date(props.end)-new Date(props.start);
							var today = Date.now();
							var yesterday = new Date(today-range/2);
							today = new Date(today+range/2)
							timeline.setWindow(
								yesterday,
								today
							)
						},1000);
					} else {
						var today = new Date();
						var yesterday = new Date();
						yesterday.setDate(today.getDate() - 1);
						today.setDate(today.getDate() + 1);
						timeline.setWindow(
							yesterday,
							today
						)
					}
					timeline.on("rangechanged",function(properties) {
						MyLocalStorage.setSettings("TimelineRange",properties)
					})

					function _refreshItems(id,data) {
						$.each(filters, function(k,v) {
								if (v.update)
									(v.update)();
						});
						if ( $("#altui-moveNow").hasClass("active") ) {
							move(0);
						}
						HTMLUtils.startTimer('altui-timeline-update-timer',10000,_refreshItems,null)
					}
					_refreshItems('altui-timeline-update-timer',null)
			} else {
				$(".altui-mainpanel").append("<span>This feature is only available to registered users</span>")
			}
		}

		// https://cdnjs.cloudflare.com/ajax/libs/vis/4.16.1/vis.min.css
		UIManager.clearPage('Timeline',_T("Timeline"),UIManager.oneColumnLayout);
		_loadCssIfNeeded('vis.min.css','//cdnjs.cloudflare.com/ajax/libs/vis/4.21.0/', function() {
			_loadScriptIfNeeded('vis.min.js','//cdnjs.cloudflare.com/ajax/libs/vis/4.21.0/',function() {
				_loadCSSText("div.vis-label , div.vis-text { color: "+getCSS('color','text-primary')+" !important;	}")
				items = new vis.DataSet();			// Create a DataSet (allows two way data-binding)
				// itemsview = new vis.DataView( items , {
					// filter: function(item) {
						// return filters[ item.group ].bEnabled==true;
					// }
				// });
				groups = new vis.DataSet();			// create a data set with groups
				groupsview = new vis.DataView( groups, {
					filter: function(item) {
						return filters[ item.id ].bEnabled==true;
					}
				});
				$.each(filters, function(k,v) {
						groups.add({id: k, content: v.name});
				});
				var html = "<div class='col-12' id='visualization'>"
					html += HTMLUtils.drawToolbar( 'altui-timeline-toolbar', _toolsTimeline,' col-12' )
				html +="</div>";

				$(".altui-mainpanel").append(html)
				$("#altui-zoomIn").click(function () { zoom(-0.2); });
				$("#altui-zoomOut").click(function () { zoom(0.2); });
				$("#altui-moveRight").click(function () { move(-0.2); });
				$("#altui-moveLeft").click(function () { move(0.2); });
				$("#altui-moveNow").click(function () {
					$(this).toggleClass("active btn-light btn-info");
					move(0);
				});

				$.each(filters, function(k,v) {
					$("#altui-timeline-filter").append( '<option value="{0}" {2}>{1}</option>'.format(
						k,
						v.name,
						(v.bEnabled==true) ? 'selected':'' ) )
				});
				$("#altui-timeline-filter").multiselect({
						disableIfEmpty: true,
						enableHTML : true,
						includeSelectAllOption: true,
						maxHeight: 300,
						buttonClass: 'btn btn-light ml-1',
						onChange: function(element, checked) {
							// Get selected options.
							var toShow = $.map($('#altui-timeline-filter :selected'),function(e)  { return e.value; })
							$.each(filters, function(k,v) {
								filters[k].bEnabled = ( $.inArray(k,toShow) != -1)
							});
							groupsview.refresh()
						},
						onSelectAll: function() {
							this.onChange();
						},
						onDropdownShown: function(event) {
						},
						onDropdownHidden: function(event) {
						}
				});
				updateTimeline(groupsview,items)
			});
		});

		// set interactivity callbacks
		$(".altui-mainpanel")
		.off("click",".altui-goto-scene")
		.off("click",".altui-goto-device")
		.off("click",".altui-goto-workflow")
		.off("click",".altui-timeline-blacklist")
		.on("click",".altui-goto-scene",function (e) {
			e.stopPropagation();
			UIControler.changePage('Scene Edit',[ $(this).data("altuiid")])
		})
		.on("click",".altui-goto-device",function (e) {
			e.stopPropagation();
			UIControler.changePage('Control Panel',[$(this).data("altuiid")])
		})
		.on("click",".altui-goto-workflow",function(e) {
			e.stopPropagation();
			_.defer(UIControler.changePage,"Workflow",[$(this).data("altuiid") ])
		})
		.on("click",".altui-timeline-blacklist",function() {
			var that = $(this)
			blacklist($(this).closest(".vis-item").data('id'))
		})
	},

	pagePlugins: function ()
	{
		var defIcon = "images/plugin.png";
		function _sortBySourceName(a,b)
		{
			if (a.SourceName < b.SourceName)
				return -1;
			if (a.SourceName > b.SourceName)
				return 1;
			return 0;
		};

		UIManager.clearPage('Plugins',_T("Plugins"),UIManager.oneColumnLayout);

		function _getScriptFileList(controller,devicetype) {
			var dtdb = MultiBox.getDeviceTypesDB(controller);
			var dt = dtdb[devicetype];
			var scripts = {};
			$.each(dt,function(idx,ui_static_data){
				if ( ui_static_data && ui_static_data.Tabs )
				{
					$.each( ui_static_data.Tabs, function( idx,tab) {
						if (tab.TabType=="javascript" && ( $.inArray( tab.ScriptName, _forbiddenScripts) == -1))
						{
							var script = tab.ScriptName;
							var func = tab.Function;
							if (scripts[script] == undefined)
								scripts[script]=[];
							scripts[script].push( func );
						}
					});
				}
			});
			return scripts;
		};

		function _getFileButton(plugin) {
			var html = "";
			html +="<div class='dropdown'>";
			html +="  <button id='{0}' type='button' class='btn btn-light btn-sm dropdown-toggle altui-plugin-files' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>".format(plugin.id);
			html +=	 _T("Files"); //+" <span class='caret'></span>");
			html +="  </button>";
			html +="  <div class='dropdown-menu' aria-labelledby='{0}'>";
			if (plugin.Files)
				$.each(plugin.Files.sort(_sortBySourceName), function(idx,file) {
					html +="<a class='dropdown-item altui-plugin-file' href='#' data-plugin='{1}'>{0}</a>".format(file.SourceName,plugin.altuiid);
				});
			html +="  </div>";
			html +="</div>";
			// var filebutton = smallbuttonTemplate.format( plugin.id, 'altui-plugin-icon altui-plugin-files',	glyphTemplate.format("file","Files",""));
			return html;
		};

		var pluginTemplate = "<tr data-altuiid='{9}'><td>{6}</td><td style='white-space: nowrap'>{0}<small> #{9}</small></td><td>{1}.{2}</td><td>{10}</td><td>{7}</td><td><div class='btn-group'>{3}{4}</div></td><td>{5}</td><td>{8}</td></tr>";
		function drawPlugin(idx, plugin) {
			plugin.Icon = plugin.Icon || defIcon;
			var iconTemplate = ( plugin.Icon.startsWith('https') ? "<img class='altui-plugin-icon' src='{0}'></img>"  : "<img class='altui-plugin-icon' src='//apps.mios.com/{0}'></img>" ).format(plugin.Icon);
			var filebutton = _getFileButton(plugin);
			var helpbutton = smallbuttonTemplate.format( plugin.id, 'altui-plugin-icon altui-plugin-question-sign',	 glyphTemplate.format("question-circle","Help",""), "Help");
			var infobutton = smallbuttonTemplate.format( plugin.id, 'altui-plugin-icon altui-plugin-info-sign',	 glyphTemplate.format("info-circle","Information",""), "Info");
			var updatebutton = smallbuttonTemplate.format( plugin.id, 'altui-plugin-icon altui-plugin-update',	glyphTemplate.format("retweet","Update Now",""), "Update");
			var deletebutton = smallbuttonTemplate.format( plugin.id, 'altui-plugin-icon altui-plugin-uninstall',  glyphTemplate.format("remove","Uninstall",""), "Uninstall");
			var inputbox = "<input class='form-control form-control-sm altui-plugin-version' id='altui-plugin-version-{0}' title='{1}'></input>".format( plugin.altuiid,_T("Version number or empty for latest official version"));

			var autoupdate = plugin.AltuiSettings ? (plugin.AltuiSettings.AutoUpdate==1) : (parseInt(plugin.AutoUpdate)==1);
			var pluginTxt = pluginTemplate.format(
				plugin.Title,
				plugin.VersionMajor,
				plugin.VersionMinor,
				helpbutton,
				infobutton,
				'<div class="input-group">'+inputbox+updatebutton+'</div>',
				iconTemplate,
				filebutton,
				deletebutton,
				plugin.altuiid,
				"<input class='altui-plugin-autoupdate' id='{0}' type='checkbox'  {1} {2} ></input>".format(
					plugin.id,
					autoupdate	? 'checked' : '',
					UIManager.UI7Check() ? '' : 'disabled'
					// plugin.AutoUpdate=="0" ? 'disabled' : ''
					)
				);
			$(".altui-mainpanel tbody").append(pluginTxt);
			$("button#"+plugin.id+".altui-plugin-question-sign").data("url",plugin.Instructions);
		};

		function endDrawPlugin() {
			// adding manually installed plugin
			var devices = MultiBox.getDevicesSync();
			var manual_plugins={};

			// first aggregate to find manually installed plugin
			$.each( $.grep(devices,function(d){ return d.id_parent==0  && d.plugin==undefined}) , function(i,d) {
				var controller = MultiBox.controllerOf(d.altuiid).controller;
				manual_plugins[d.device_file] = {
					devtype : d.device_type,
					files	: [],
					devaltuiid : d.altuiid
				};
				$.each( [d.device_file,d.device_json,d.impl_file], function(i,filename) {
					if (filename && filename !="")
						manual_plugins[d.device_file].files.push( {SourceName:filename} );
				});
				if (!d.device_json) {
					// try to get it from the .xml file
					FileDB.getFileContent(controller,d.device_file , function( str ) {
						var re = /<staticJson>(.*)<\/staticJson>/;
						var m;
						if ((m = re.exec(str)) !== null) {
							if (m.index === re.lastIndex) {
								re.lastIndex++;
							}
							manual_plugins[d.device_file].files.push( {SourceName:m[1]} );
						}
					});
				}
			});

			// for each, create a virtual plugin structure so we can display
			$.each(manual_plugins, function( key,value) {
				// add also the JS files used for the tabs for such device type
				var controller = MultiBox.controllerOf(value.devaltuiid).controller;
				var scripts = _getScriptFileList( controller,value.devtype );
				$.each(scripts, function(key,script) {
					value.files.push({SourceName:key});
				});
				var plugin = {
					id:-1,
					altuiid: "{0}-x".format(controller),		// put the id of the device requesting this file, so that we know the "controller"
					Files: value.files
				};
				var pluginTxt = pluginTemplate.format(
					key,
					"?",
					"",
					"",
					"",
					"",
					 "<img class='altui-plugin-icon' src='//apps.mios.com/{0}'></img>".format(defIcon),
					_getFileButton(plugin),
					"",
					plugin.altuiid,
					"" //autoupdate
					);
				$(".altui-mainpanel tbody").append(pluginTxt);
			});
			$(".altui-plugin-autoupdate").change( function() {
				var checked = $(this).is(':checked');
				var pluginid = $(this).prop("id");
				var altuiid = $(this).closest("tr").data("altuiid");
				MultiBox.modifyPlugin( altuiid, pluginid, { AutoUpdate: checked ? 1 : 0 } );
			});
			$(".altui-plugin-question-sign").click(function() {
				var url = $(this).data("url");
				window.open( url, '_blank');
			});
			$(".altui-plugin-info-sign").click(function() {
				// var altuiid = $(this).prop("id");
				// var pluginid = altuiid.split("-")[1];
				var pluginid = $(this).prop("id");
				window.open("http://apps.mios.com/plugin.php?id="+pluginid, '_blank');
			});
			$(".altui-plugin-file").click(function() {
				var altuiid = $(this).data("plugin");
				var info = MultiBox.controllerOf(altuiid);
				var name = $(this).text();
				FileDB.getFileContent(info.controller,name , function( txt ) {
					var url = MultiBox.getFileUrl(info.controller,name);
					UIControler.changePage('Editor',[name,txt,"Download",function(txt) {
						$(".altui-mainpanel a[download]")[0].click();
					}])
					$(".altui-mainpanel").prepend("<div class='d-none' >Download: <a href='"+url+"' download>"+name+"</a></div>");
				});
			});
			$(".altui-plugin-update").click(function() {
				var id = $(this).prop("id");
				var altuiid = $(this).closest("tr").data("altuiid");
				if (id==undefined)	return;
				DialogManager.confirmDialog(_T("are you sure you want to update plugin #{0}").format(id),function(result) {
					if (result==true) {
						var val = $("#altui-plugin-version-"+altuiid).val();
						if ( isNullOrEmpty(val)	 == false ) {
						// if ($.isNumeric(val)==true) {
							MultiBox.updatePluginVersion(altuiid,id,val,function(result) {
								PageMessage.message( _T("Update Plugin succeeded, be patient Luup will reload"), "success");
							});
						}
						else
							MultiBox.updatePlugin(altuiid,id,function(result) {
								PageMessage.message( _T("Update Plugin succeeded, be patient Luup will reload"), "success");
							});
					}
				});
			});
			$(".altui-plugin-uninstall").click(function() {
				var id = $(this).prop("id");
				var altuiid = $(this).closest("tr").data("altuiid");
				if (id==undefined)	return;
				DialogManager.confirmDialog(_T("Are you sure you want to uninstall this plugin #{0} and all its created devices").format(id),function(result) {
					if (result==true) {
						MultiBox.deletePlugin(altuiid,id,function(result) {
							alert(result);
						});
					}
				});
			});
		};

		$(".altui-mainpanel").append($("<div class='col-12'><table id='table' class='table table-responsive-OFF table-sm'><thead><tr><th></th><th>"+_T("Name")+"</th><th>"+_T("Version")+"</th><th>"+_T("Auto")+"</th><th>"+_T("Files")+"</th><th>Actions</th><th>"+_T("Update")+"</th><th>"+_T("Uninstall")+"</th></tr></thead><tbody></tbody></table></div>"));
		MultiBox.getPlugins( drawPlugin , endDrawPlugin);
	},

	pageUsePages: function ( nPage )
	{
		nPage = nPage || (parseInt(getQueryStringValue("nPage") || -1)) ;	// either passed in , or from query string, or defaults to -1
		UIManager.clearPage('Custom Pages',"",UIManager.oneColumnLayout);

		var page = PageManager.getPageByIdx(nPage);
		if (page)
				UIManager.setCrumbTitle(page.name);

		var pageTabs = _createPageTabsHtml( false, nPage ) ;
		var Html = "<div class='tab-content altui-page-contents'>";
		PageManager.forEachPage( function( idx, page) {
				Html += _getPageHtml(page,false)	;// no edit mode
		});
		Html += "</div>";

		$(".altui-mainpanel").html( "<div class='col-12'>"+pageTabs + Html +"</div>");
		$('#altui-page-tabs li:eq({0}) a'.format((nPage==-1) ? 0 : nPage)).tab('show');

		// lean layout if requested
		// if ( getQueryStringValue("Layout") == 'lean') {
			// $("ul.nav-tabs").remove();
		// }
		_updateDynamicDisplayTools( false );
		$('a[data-toggle="tab"]').off('shown.bs.tab').on('shown.bs.tab', function (e) {
			// $(e.target) = newly activated tab. its parent is the LI, parent of parent is collection of LIs
			// nPage is the index
			var nPage = $(e.target).parent().parent().children().index( $(e.target).parent() )
			var page = PageManager.getPageByIdx(nPage);
			UIManager.setCrumbTitle(page.name);
			// now artificially pushing a UIControler state to be able to go back
			HistoryManager.pushState( 'Custom Pages', "", [nPage], UIManager.pageUsePages,UIManager);
		})
	},

	pageEditPages: function ()
	{
		function _pagePageProperty(pagename) {
			var page = PageManager.getPageFromName(pagename);
			//var pattern = (line.pattern != undefined ) ? "pattern='{0}'".format(line.pattern) : "";
			var model = [
				{ id:'name',		label:_T('Name'),			type:"input",	value:page['name'], pattern:"[^_]+", placeholder:'enter name' , opt:{required:true}, invalidfeedback:_T('Please provide a name without a _ character') },
				{ id:'background',	label:'CSS Background',		type:"input",	value:page['background'], placeholder:'enter css string' , helptext:'any css3 valid background property'},
			];
			var html = HTMLUtils.drawFormFields(  model );
			var dialog = DialogManager.registerDialog('dialogModal', defaultDialogModalTemplate.format( 'dialogModal', 'Page Properties', html, 'modal-lg',''))
			DialogManager.dlgAddDialogButton($('div#dialogModal'), true, _T("Save Changes"));

			// buttons
			$('div#dialogModal .btn-primary').off('click');
			$('div#dialogModal .btn-primary').on( 'click', function(event) {
				var form = $('div#dialogModal form')[0]
				if (form.checkValidity() === false) {
					event.preventDefault();
					event.stopPropagation();
				} else {
					// everything looks good!
					page[ 'name' ] = sanitizePageName( $("#name").val() );
					page[ 'background' ] = $("#background").val();
					$('div#dialogModal').modal('hide');
					_displayPages();
				}
				form.classList.add('was-validated');
			});
			$('div#dialogModal').modal();
		};

		// var pages = g_ALTUI.g_CustomPages;
		// PageManager.init(g_ALTUI.g_CustomPages);

		function _createPageEditorHtml() {
			var pageTabs = _createPageTabsHtml( true );		// edit mode

			var Html = "<div class='tab-content altui-page-contents altui-norefresh'>";
			PageManager.forEachPage( function( idx, page) {
				Html += _getPageHtml(page, true)	// edit mode
			});
			Html += "</div>";
			return "<div class='col-12'>"+pageTabs + Html+"</div>";
		};

		function _createToolboxHtml() {
			function _createToolHtml(tool) {
				var html="";
				html += ("<div class='altui-widget {0} col-12' id='{1}' data-type='{0}' >{2}</div>").format(tool.cls,tool.id,tool.html);
				return html;
			};

			var lines = new Array();
			$.each(tools , function(idx,tool) {
				lines.push( _createToolHtml(tool) );
			});

			var editBoxTemplate = "<div class='altui-edittoolbox col-12' aria-label=''>{0}</div>";
			var editBoxLines = new Array();
			$.each(edittools , function(idx,tool) {
				var glyph = glyphTemplate.format( tool.glyph, tool.glyph,"" );
				editBoxLines.push("<div id='{0}' class='altui-edittools' title='{2}'>{1}</div>".format(tool.glyph,glyph,tool.label || ''));
			});
			lines.push(editBoxTemplate.format( editBoxLines.join('') ) );

			lines.push( "<div class='altui-widget-delete col-12'>"+deleteGlyph+"</div>"	 );
			var html = `<div class="mt-2 ml-1 row">{0}</div>`.format( lines.join('') )
			return html
		};

		function _displayPages() {
			var pageEditorHtml = _createPageEditorHtml();
			$(".altui-mainpanel").html( pageEditorHtml );
			$('#altui-page-tabs a:first').tab('show');
			_updateDynamicDisplayTools( true );	//edit mode

			// make all reloaded children draggable
			$(".altui-mainpanel .altui-widget")
				.draggable( _widgetOnCanvasDraggableOptions() )	// for all pages

			// add resizable & gauges
			$.each(tools, function(idx,tool){
				if ($.isFunction( tool.onWidgetResize) ) {
				// if (tool.resizable==true) {
					$(".altui-custompage-canvas ."+tool.cls).resizable(
						_widgetOnCanvasResizableOptions(tool)
					);
				}
			});

			// make all pages droppable
			$(".altui-custompage-canvas")
			.selectable()
			.droppable({
				accept: ".altui-widget",
				tolerance: "fit",
				drop: function(event, ui) {
					var pagename = _getActivePageName();
					var page = PageManager.getPageFromName( pagename );
					var parent = $(this);
					var dropped = ui.helper;				// clone
					var type = ui.helper.data( "type" );	// data-type attr
					var tool = _getToolByClass( type );

					var position = ui.helper.position();
					var size = { width:ui.helper.width(),  height:ui.helper.height() };
					var widgetid = 0;
					if ( $(parent)[0] === $(ui.helper.parent())[0] )
					{
						// internal drag and drop on the page canvas
						widgetid = $(ui.helper).prop('id');
						if ($.isFunction( tool.onWidgetResize) ) {
							(tool.onWidgetResize)(page, widgetid, position, size);
							PageManager.updateChildrenInPage( page, widgetid, position, size );
						}
						else
							PageManager.updateChildrenInPage( page, widgetid, position );
						_showSavePageNeeded(true);

						// save also all selected items which moved as well as part of the drag and drop
						var selected = $(_getPageSelector( page )).find(".altui-widget.ui-selected").not("#"+ui.helper.prop('id'));
						$.each(selected, function (idx,elem) {
							widgetid = $(elem).prop('id');
							PageManager.updateChildrenInPage( page, widgetid, $(elem).position() , { width:$(elem).width(), height:$(elem).height() } );
							_showSavePageNeeded(true);
						});
					}
					else
					{
						var parentoffset = $(this).offset();
						position = {
							top:	Math.round(ui.offset.top - parentoffset.top),
							left:	Math.round(ui.offset.left - parentoffset.left)
						};
						// adding from the toolbox
						widgetid = PageManager.insertChildrenInPage( page, tool, position);
						_showSavePageNeeded(true);

						var widget=PageManager.getWidgetByID( page, widgetid );
						var html = _getWidgetHtml( widget , true, page );		// edit mode
						var obj = $(html)
							.appendTo(parent)
							.draggable( _widgetOnCanvasDraggableOptions() );
						if ($.isFunction( tool.onWidgetResize) )
						{
							obj.resizable(
								_widgetOnCanvasResizableOptions(tool)
							);
						}
						if ($.isFunction( tool.onWidgetDisplay) )
						{
							(tool.onWidgetDisplay)(page,widgetid, true);		// edit mode
						}
					}
				}
			})
			.parent().resizable({
				stop: function( event, ui ) {
					var elem = ui.element;
					$(elem).find(".altui-custompage-canvas").width( ui.size.width).height(ui.size.height);
				}
			});
		};

		// draw page & toolbox
		UIManager.clearPage('Edit Pages',_T("Custom Pages Editor"),UIManager.twoColumnLayout);
		PageMessage.message(_T("Drag and Drop to add/move/delete controls. use Ctrl+Click or lasso to select multiple controls"),"info");

		// Get and draw the HTML areas
		var toolboxHtml = _createToolboxHtml();
		$(".altui-leftnav").append( toolboxHtml );
		_displayPages();

		// User interactivity
		$(".altui-widget-delete").droppable({
				accept: ".altui-widget",
				tolerance: "pointer",
				drop: function(event, ui) {
					var pagename = _getActivePageName();
					var page = PageManager.getPageFromName( pagename );
					var dropped = ui.helper;				// clone
					if ( $(dropped).parents(".altui-leftnav").length==0 ) { // not from toolbox
						var selected = $(_getPageSelector( page )).find(".altui-widget.ui-selected").not("#"+ui.helper.prop('id'));
						selected.each( function(idx,elem)
						{
							PageManager.removeChildrenInPage( page, $(elem).prop('id') );
							$(elem).remove();
						});
						PageManager.removeChildrenInPage( page, dropped.prop('id') );
						_showSavePageNeeded(true);
						ui.draggable.remove();
					}
					// var type = ui.helper.data( "type" );	// data-type attr
				}
		});
		$(".altui-leftnav .altui-widget").draggable({
			// containment: ".altui-custompage-canvas",
			grid: [ 5,5 ],
			helper: "clone",
			zIndex: 100,
			cursorAt: { left: 5 },
			// snap: true,
			// snapMode: "inner",
			// snapTolerance: 20,
			revert: "invalid"
		});

		// call backs
		$(".altui-edittools").click( function () {
			var id = $(this).prop('id');
			$.each(edittools, function(idx,tool){
				if (tool.glyph == id) {
					// update on HTML page
					var page = PageManager.getPageFromName( _getActivePageName() );
					var selected = $( _getPageSelector( page ) ).find(".altui-widget.ui-selected");
					(tool.onclick)( selected );

					// update the children position for each selected children
					$.each(selected, function (idx,elem) {
						var widgetid = $(elem).prop('id');
						PageManager.updateChildrenInPage( page, widgetid, $(elem).position() , { width:$(elem).width(), height:$(elem).height() } );
						_showSavePageNeeded(true);
					});
				}
			})
		});

		// $(".altui-mainpanel").off("click",".altui-widget");
		$(".altui-mainpanel").on("click",".altui-widget",function(event){
			if (event.ctrlKey == false ) {
				$(".altui-widget").removeClass("ui-selected");
				var pagename = _getActivePageName();
				var page = PageManager.getPageFromName( pagename );
				var cls = $(this).data( "type" );
				var tool = _getToolByClass( cls );
				var widgetid = $(this).prop('id');
				var widget=PageManager.getWidgetByID( page, widgetid );
				// apply defaults
				widget.properties = $.extend(true,{}, tool.properties, widget.properties);
				(tool.property)( widget );
			}
			else
				$(this).toggleClass("ui-selected");
		});

		// $(".altui-mainpanel").off("click","#altui-page-action-delete");
		$(".altui-mainpanel").on("click","#altui-page-action-delete",function(){
			// find active page
			PageManager.deletePage( _getActivePageName() );
			_displayPages();
		});

		// $(".altui-mainpanel").off("click","#altui-page-action-new");
		$(".altui-mainpanel").on("click","#altui-page-action-new",function(){
			// find active page
			var name = PageManager.addPage( );
			_displayPages();
		});

		// $(".altui-mainpanel").off("click","#altui-page-action-save");
		$(".altui-mainpanel").on("click","#altui-page-action-save",function(){
			// find active page
			PageManager.savePages( );
			_showSavePageNeeded(false);
		});

		// $(".altui-mainpanel").off("click","#altui-page-action-properties");
		$(".altui-mainpanel").on("click","#altui-page-action-properties",function(){
			// find active page
			_pagePageProperty( _getActivePageName() );
		});

	},

	pageWip: function ()
	{
		UIManager.clearPage('Wip',_T("Work In Progress"));
		$(".altui-mainpanel").append("<h3>Sorry this is not yet implemented</h3>");
	},

	getPayPalButtonHtml: function( )
	{
		var language = getQueryStringValue("lang") || window.navigator.userLanguage || window.navigator.language;
		language = language.substring(0, 2).toUpperCase();
		var html = "";
		if (1) {
			html += "<form class='form' action='https://www.paypal.com/cgi-bin/webscr' method='post' target='_blank'>";
			html += "<input type='hidden' name='cmd' value='_xclick'>";
			html += "<input type='hidden' name='business' value='Z5KFCB3VH6MCQ'>";
			html += "<input type='hidden' name='lc' value='"+language+"'>";
			html += "<input type='hidden' name='item_name' value='ALTUI fees'>";
			html += "<input type='hidden' name='item_number' value='ALTUI'>";
			html += "<input type='hidden' name='button_subtype' value='services'>";
			html += "<input type='hidden' name='currency_code' value='EUR'>";
			html += "<input type='hidden' name='bn' value='PP-BuyNowBF:btn_buynowCC_LG_global.gif:NonHosted'>";
			html += "<table>";
			html += "<tr><td><input type='hidden' name='on0' value='Duration'>Duration</td></tr><tr><td><select class='form-control' name='os0'>";
			html += "	<option value='6 months'>6 months €12,00 EUR</option>";
			html += "	<option value='12 months'>12 months €20,00 EUR</option>";
			html += "	<option value='24 months'>24 months €36,00 EUR</option>";
			html += "	<option value='36 months'>36 months €50,00 EUR</option>";
			html += "</select> </td></tr>";
			html += "<tr><td><input type='hidden' name='on1' value='Footer username'>Footer username</td></tr><tr><td><input readonly class='form-control'type='text' name='os1' maxlength='200' value='"+MultiBox.getMainUser().Name+"'></td></tr>";
			html += "</table>";
			html += "<input type='hidden' name='currency_code' value='EUR'>";
			html += "<input type='hidden' name='option_select0' value='6 months'>";
			html += "<input type='hidden' name='option_amount0' value='12.00'>";
			html += "<input type='hidden' name='option_select1' value='12 months'>";
			html += "<input type='hidden' name='option_amount1' value='20.00'>";
			html += "<input type='hidden' name='option_select2' value='24 months'>";
			html += "<input type='hidden' name='option_amount2' value='36.00'>";
			html += "<input type='hidden' name='option_select3' value='36 months'>";
			html += "<input type='hidden' name='option_amount3' value='50.00'>";
			html += "<input type='hidden' name='option_index' value='0'>";
			html += "<hr>"
			html += "<input type='image' src='https://www.paypalobjects.com/en_US/i/btn/btn_buynowCC_LG_global.gif' border='0' name='submit' alt='PayPal – The safer, easier way to pay online!'>";
			html += "<img alt='' border='0' src='https://www.paypalobjects.com/fr_FR/i/scr/pixel.gif' width='1' height='1'>";
			html += "</form>"
		} else {
			html+="<form action='https://www.paypal.com/cgi-bin/webscr' method='post' target='_blank'>";
			html+="<input type='hidden' name='cmd' value='_donations'>";
			html+="<input type='hidden' name='business' value='Z5KFCB3VH6MCQ'>";
			html+= "<input type='hidden' name='lc' value='"+language+"'>";
			html+="<input type='hidden' name='item_name' value='ALTUI by amg0'>";
			html+="<input type='hidden' name='item_number' value='ALTUI'>";
			html+="<input type='hidden' name='currency_code' value='EUR'>";
			html+="<input type='hidden' name='bn' value='PP-DonationsBF:btn_donateCC_LG_global.gif:NonHosted'>";
			html+="<input type='image' src='https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG_global.gif' border='0' name='submit' alt='PayPal – The safer, easier way to pay online.'>";
			html+="<img alt='' border='0' src='https://www.paypalobjects.com/fr_FR/i/scr/pixel.gif' width='1' height='1'>";
			html+="</form>";
		}
		return html;
	},

	pageLicense: function ()
	{
		UIManager.clearPage('License',_T("License Fees"),UIManager.twoColumnLayout);
		$("#altui-pagemessage").remove();
		var html = "";
		html +="<span class='col-12'>{0}</span>".format(
		_T("For non commercial use, ALTUI plugin is free for trial with some limitation on its functionality. To compensate the effort and time spent on regularly improving this project, a registration fee equivalent to <span class='text-info'><mark><b>2€ per month</b></mark></span> is requested for longer term use. You can choose your level of contribution.")+
		_T("Once registered you will get:<ul><li>Access to all the releases and auto update mechanism (not available to non registered users)</li><li>Removal of unregistered welcome message, as well as license message in the footer</li></ul>")+
		"<p>"+_T("Please be patient, registration will become effective after <mark>1 or 2 business days</mark>. Otherwise contact me with a copy of your page footer") + "</p>" +
		"<i>"+_T("Resellers or Integrators are welcome to contact me for eventual commercial agreements.")+"</i>"
		)
		html +="<span class='col-12'><hr>{0}</span>".format( UIManager.getPayPalButtonHtml() );
		$(".altui-mainpanel").append(html);
		$("form input[type='image']").click( function() {
			// capture user submission
			var data = {
				months: parseInt($("form select").val() || 12 ),
				name: $("form input[name='os1']").val() || MultiBox.getMainUser().Name
			};
			$.ajax({
					// url:'https://script.google.com/macros/s/AKfycbyu0Xc8Hd3ruJolJGUsi5Chbq4GUnAl89LeDpky-1_nQA23kHs/exec',	// test
					url:'https://script.google.com/macros/s/AKfycbwWlgs1x0u1OpKKvaVFywb7XY_FfZ2dGcasvnD576RUbBP1OQc/exec',	// prod
					dataType: "json",
					data: $.extend( { appname:'AltUI',command:'newuser' }, data ),
					cache:false
				})
			.done( function (data, textStatus, jqXHR) {
				// alert('success')
			})
			.fail( function() {
				// alert('failure')
			});
		});
	},

	pageEvolutions: function() {

		UIManager.clearPage('Evolutions',_T("Evolutions"),UIManager.oneColumnLayout);

		$.ajax({
				// url:'https://script.google.com/macros/s/AKfycbyu0Xc8Hd3ruJolJGUsi5Chbq4GUnAl89LeDpky-1_nQA23kHs/exec',	// test
				url:'https://script.google.com/macros/s/AKfycbwWlgs1x0u1OpKKvaVFywb7XY_FfZ2dGcasvnD576RUbBP1OQc/exec',	// prod
				method:	"GET",
				data: { appname:'AltUI', command:'history' },
				cache:false,
				dataType: "jsonp",
				// processData: false			// prevent jquery to process data to receive it as pure TEXT
			})
		.done( function (data, textStatus, jqXHR) {
			function _displayFeatures(v,features) {
				var html ="";
				html += "<ul>";
				$.each(features, function(i,f) {
					html += "<li>{0}</li>".format(f)
				});
				html += "<li><a href='https://github.com/amg0/ALTUI/releases/tag/{0}' target='_blank'>See in <span class=''>GitHub</span></a></li>".format(v)
				html += "</ul>";
				return html;
			};
			if ($.isArray( data )==false)
				data = JSON.parse(data);
			var panels = [];
			$.each(data, function(idx,version) {
				panels.push( {id: version.v , title: "V "+version.v, html: _displayFeatures(version.v,version.features) } );
			});
			var html = HTMLUtils.createAccordeon('col-12 altui-evolutions',panels );
			$(".altui-mainpanel").append(html);
		})
		.fail( function( jqxhr, textStatus, errorThrown	 ) {
			$(".altui-mainpanel").append("<pre>{0}</pre>".format( JSON.stringify(jqxhr) ));
		});
	},

	pageCredits: function ()
	{
		UIManager.clearPage('Credits',_T("Credits"),UIManager.twoColumnLayout);
		$("#altui-pagemessage").remove();
		var tbl = [
			["GetVera","http://getvera.com/","the zWave Getaway and backend platform"],
			["Bootstrap","http://getbootstrap.com/","set of css and javascript components for responsive design user interfaces"],
			["jQuery","http://jquery.com/","javascript framework and browser differences abstraction layer"],
			["jQueryUI","http://jqueryui.com/","jQuery User Interface widgets ( like slider )"],
			["Touch Punch","http://touchpunch.furf.com/","jQuery UI fix for touch screen devices"],
			// ["Bootstrap Validator","https://github.com/1000hz/bootstrap-validator","Form validator in Bootstrap 3 style"],
			["D3js","http://d3js.org/","D3 Data Driven Documents & Les Miserables tutorial"],
			["Bootgrid","http://www.jquery-bootgrid.com/","Jquery Bootstrap Grid"],
			["Blockly","https://developers.google.com/blockly/","Blockly Library"],
			["Bootswatch","https://bootswatch.com/","Bootstrap Themes"],
			["ThingSpeak","https://thingspeak.com/","ThingSpeak Data platform for IoT"],
			["jQuery Colorpicker","http://bgrins.github.io/spectrum/","Spectrum Color Picker"],
			["proto io","https://proto.io/freebies/onoff/","switch button"],
			["Bootstrap Multiselect","http://davidstutz.github.io/bootstrap-multiselect/","Bootstrap based Multiselect control"],
			["ACE editor","https://ace.c9.io/","ACE code editor"],
			["JointJS","http://www.jointjs.com/","JointJS graphic library"],
			["JustGage","http://justgage.com/","justGage vectorial gage"],
			["Vis js","http://visjs.org/docs/timeline/","Visual timeline"],
			["amg0","http://forum.micasaverde.com/","reachable as amg0 on this forum "]
		];

		var html = "";
		html += '<nav class="nav nav-pills flex-column">'
		$.each(tbl, function (idx,line) {
			html += '<a class="nav-link" href="#">{0}</a>'.format(line[0])
		});
		html += "</nav>"
		$(".altui-leftnav").append( html );

		var template =
		`<div class="card" >
		  <div class="card-header">{0}</div>
		  <div class="card-body">
			<div data-name="{0}" class="card-title"></div>
			<p class="card-text">{2}</p>
			<a href="{1}" target="_blank" class="card-link">{1}</a>
		  </div>
		</div>`
		html = '<div class="col-12 card-columns">';
		$.each(tbl, function (idx,line) {
			html += template.format(line[0],line[1],line[2])
		});
		html += '</div>'
		$(".altui-mainpanel").append(html);

		$(".altui-leftnav a").on('click', function(e) {
			$(".card-header").removeClass("bg-success text-white")
			$(".card-title[data-name='"+$(this).html()+"']").parents(".card").find(".card-header").addClass("bg-success text-white")
			return false;
		});
	},

	pageEditorForm: function (domparent, htmlid, title,txt,outputarea,button,onClickCB) {
		var supportedModes = {
				ABAP:		 "abap",
				ActionScript:"as",
				ADA:		 "ada|adb",
				Apache_Conf: "^htaccess|^htgroups|^htpasswd|^conf|htaccess|htgroups|htpasswd",
				AsciiDoc:	 "asciidoc",
				Assembly_x86:"asm",
				AutoHotKey:	 "ahk",
				BatchFile:	 "bat|cmd",
				C9Search:	 "c9search_results",
				C_Cpp:		 "cpp|c|cc|cxx|h|hh|hpp",
				Cirru:		 "cirru|cr",
				Clojure:	 "clj|cljs",
				Cobol:		 "CBL|COB",
				coffee:		 "coffee|cf|cson|^Cakefile",
				ColdFusion:	 "cfm",
				CSharp:		 "cs",
				CSS:		 "css",
				Curly:		 "curly",
				D:			 "d|di",
				Dart:		 "dart",
				Diff:		 "diff|patch",
				Dockerfile:	 "^Dockerfile",
				Dot:		 "dot",
				Erlang:		 "erl|hrl",
				EJS:		 "ejs",
				Forth:		 "frt|fs|ldr",
				FTL:		 "ftl",
				Gherkin:	 "feature",
				Gitignore:	 "^.gitignore",
				Glsl:		 "glsl|frag|vert",
				golang:		 "go",
				Groovy:		 "groovy",
				HAML:		 "haml",
				Handlebars:	 "hbs|handlebars|tpl|mustache",
				Haskell:	 "hs",
				haXe:		 "hx",
				HTML:		 "html|htm|xhtml",
				HTML_Ruby:	 "erb|rhtml|html.erb",
				INI:		 "ini|conf|cfg|prefs",
				Jack:		 "jack",
				Jade:		 "jade",
				Java:		 "java",
				JavaScript:	 "js|jsm",
				JSON:		 "json",
				JSONiq:		 "jq",
				JSP:		 "jsp",
				JSX:		 "jsx",
				Julia:		 "jl",
				LaTeX:		 "tex|latex|ltx|bib",
				LESS:		 "less",
				Liquid:		 "liquid",
				Lisp:		 "lisp",
				LiveScript:	 "ls",
				LogiQL:		 "logic|lql",
				LSL:		 "lsl",
				Lua:		 "lua",
				LuaPage:	 "lp",
				Lucene:		 "lucene",
				Makefile:	 "^Makefile|^GNUmakefile|^makefile|^OCamlMakefile|make",
				MATLAB:		 "matlab",
				Markdown:	 "md|markdown",
				MEL:		 "mel",
				MySQL:		 "mysql",
				MUSHCode:	 "mc|mush",
				Nix:		 "nix",
				ObjectiveC:	 "m|mm",
				OCaml:		 "ml|mli",
				Pascal:		 "pas|p",
				Perl:		 "pl|pm",
				pgSQL:		 "pgsql",
				PHP:		 "php|phtml",
				Powershell:	 "ps1",
				Prolog:		 "plg|prolog",
				Properties:	 "properties",
				Protobuf:	 "proto",
				Python:		 "py",
				R:			 "r",
				RDoc:		 "Rd",
				RHTML:		 "Rhtml",
				Ruby:		 "rb|ru|gemspec|rake|^Guardfile|^Rakefile|^Gemfile",
				Rust:		 "rs",
				SASS:		 "sass",
				SCAD:		 "scad",
				Scala:		 "scala",
				Smarty:		 "smarty|tpl",
				Scheme:		 "scm|rkt",
				SCSS:		 "scss",
				SH:			 "sh|bash|^.bashrc",
				SJS:		 "sjs",
				Space:		 "space",
				snippets:	 "snippets",
				Soy_Template:"soy",
				SQL:		 "sql",
				Stylus:		 "styl|stylus",
				SVG:		 "svg",
				Tcl:		 "tcl",
				Tex:		 "tex",
				Text:		 "txt",
				Textile:	 "textile",
				Toml:		 "toml",
				Twig:		 "twig",
				Typescript:	 "ts|typescript|str",
				Vala:		 "vala",
				VBScript:	 "vbs",
				Velocity:	 "vm",
				Verilog:	 "v|vh|sv|svh",
				XML:		 "xml|rdf|rss|wsdl|xslt|atom|mathml|mml|xul|xbl",
				XQuery:		 "xq",
				YAML:		 "yaml|yml"
		};
		var _tools= [
			{id:'altui-copy-clipboard-'+htmlid,	 glyph:"clipboard", label:_T("Copy")},
			{id:'altui-top-'+htmlid, glyph:"fast-backward", label:_T("Top")},
			{id:'altui-pageup-'+htmlid, glyph:"backward", label:_T("Page Up")},
			{id:'altui-pagedown-'+htmlid, glyph:"forward", label:_T("Page Down")},
			{id:'altui-bottom-'+htmlid, glyph:"fast-forward", label:_T("Bottom")},
		];
		// var copybutton = buttonTemplate.format( 'altui-copy-clipboard-'+htmlid, 'altui-copy-clipboard', glyph,'default',_T("Copy"));
		var html = "";
		html +="<form class='altui-editor-form col-sm-11' role='form' action='javascript:void(0);'>";
		html +="  <div class='form-group'>";
		html +="	<label for='altui-editor-text'>"+title+":</label>"
		html += HTMLUtils.drawToolbar(htmlid+'-toolbar',_tools);
		html +="	<div id='altui-editor-text'>"+txt.htmlEncode()+"</div>";
		html +="  </div>";
		if (outputarea!=null) {
			var glyph = glyphTemplate.format('clipboard',_T("Copy to clipboard"), '');
			html +="  <div class='form-group'>";
			html +="	<label for='altui-editor-result'>"+_T("Return Result")+":</label> ";
			html +=	 buttonTemplate.format( 'altui-copyresult-clipboard-'+htmlid, 'altui-copy-clipboard', glyph,'',_T("Copy"));
			html +="	<pre class='border border-secondary bg-light' id='altui-editor-result'> </pre>";
			html +="  </div>";
			html +="  <div class='form-group'>";
			html +="	<label for='altui-editor-output'>"+_T("Console Output")+":</label> ";
			html +=	 buttonTemplate.format( 'altui-copyoutput-clipboard-'+htmlid, 'altui-copy-clipboard', glyph,'',_T("Copy"));
			html +="	<pre class='border border-secondary bg-light' id='altui-editor-output'> </pre>";
			html +="  </div>";
		}
		html +=("  <button id='altui-luaform-button-"+htmlid+"' type='submit' class='btn btn-primary'>"+button+"</button>");
		html +="</form>";
		domparent.append(html);

		// ACE
		var editor = ace.edit( "altui-editor-text" );
		editor.setTheme( "ace/theme/"+ (MyLocalStorage.getSettings("EditorTheme") || "monokai") );
		editor.setFontSize( MyLocalStorage.getSettings("EditorFontSize") );
		var extension = (title.indexOf(".")!=-1) ? ( title.split(".").pop() ) : ''
		var matchmode = null;
		$.each(supportedModes, function(mode,v) {
				$.each(v.split("|"),function(k,tstext) {
					var re = new RegExp(tstext,"gi")
					if (re.test(extension)) {
						// matches
						matchmode = mode
						return false;
					}
				});
				return (matchmode==null)
		});
		matchmode = (matchmode || "lua").toLowerCase()
		editor.session.setMode( "ace/mode/"+matchmode );
		// resize
		$("div#altui-editor-text").resizable({
			stop: function( event, ui ) {
				editor.resize();
			}
		});

		$("#altui-copy-clipboard-"+htmlid).click( function() {
			editor.selectAll();
			$(this).after("<pre id='toto'></pre>")
			$("#toto").text( editor.getCopyText() )
			Altui_SelectText('toto')
			document.execCommand('copy');
			$("#toto").remove()
		});
		$('#altui-top-'+htmlid).click( function() {
			editor.navigateFileStart()
		});
		$('#altui-bottom-'+htmlid).click( function() {
			editor.navigateFileEnd()
		});
		$('#altui-pageup-'+htmlid).click( function() {
			editor.gotoPageUp()
		});
		$('#altui-pagedown-'+htmlid).click( function() {
			editor.gotoPageDown()
		});
		$("#altui-copyresult-clipboard-"+htmlid).click( function() {
			Altui_SelectText( "altui-editor-result" );
			document.execCommand('copy');
		});
		$("#altui-copyoutput-clipboard-"+htmlid).click( function() {
			Altui_SelectText( "altui-editor-output" );
			document.execCommand('copy');
		});
		$("#altui-luaform-button-"+htmlid).click( function() {
			var code = editor.getValue();
			$('#altui-editor-result').text("")
			$('#altui-editor-output').text("")
			onClickCB(code,$(this));
		});
	},

	pageEditor: function (filename,txt,button,cbfunc)
	{
		UIManager.clearPage('Editor', filename,UIManager.oneColumnLayout);
		$(".altui-mainpanel").append("<p> </p>");
		UIManager.pageEditorForm($(".altui-mainpanel"),'altui-page-editor',filename,txt,null,button,function(newtxt) {
			if ($.isFunction(cbfunc))
				cbfunc(newtxt);
		});
	},

	pageLuaTest: function ()
	{
		UIManager.clearPage('LuaTest',_T("Lua Code Test"),UIManager.oneColumnLayout);
		$(".altui-mainpanel").append("<div class='col-12'><p>"+_T("This test code will succeed if it is syntactically correct. It must be the body of a function and can return something. The return object and console output will be displayed)")+"</p></div>");
		var lastOne = MyLocalStorage.getSettings("LastOne_LuaTest") || "return true";
		UIManager.pageEditorForm($(".altui-mainpanel"),'altui-page-editor',_T("Lua Test Code"),lastOne,true,_T("Submit"),function(lua) {
			MyLocalStorage.setSettings("LastOne_LuaTest",lua);
			$("#altui-luaform-button-altui-page-editor").addClass("disabled")
			MultiBox.runLua(0,lua, function(res) {
				res = $.extend({success:false, result:"",output:""},res);
				$("#altui-luaform-button-altui-page-editor").removeClass("disabled")
				$("#altui-editor-result").text(res.result+"\n");
				$("#altui-editor-output").text(res.output+"\n");
				if ( res.success ==true )
					PageMessage.message( _T("Code execution succeeded"), "success");
				else
					PageMessage.message( _T("Code execution failed"), "danger");
			});
		});
	},

	pageOsCommand: function ()
	{
		var defaultCommands = [
			{label:_T("Time"), command:'date' },
			{label:_T("Disk Usage"), command:'du -h' },
			{label:_T("Free Space"), command:'df -h' },
			{label:_T("Plugin Files"), command:'ls -l /etc/cmh-ludl' },
			{label:_T("Log Sizes"), command:'ls -l /var/log/cmh' },
			{label:_T("Errors Warnings"), command:"cat /var/log/cmh/LuaUPnP.log | grep -i -E 'warning\|error\|failed'" },
			{label:_T("Search Logs"), command:"cat /var/log/cmh/LuaUPnP.log | grep '{0}'" },
			{label:_T("Tail Logs"), command:"tail -n 50 /var/log/cmh/LuaUPnP.log" },
			{label:_T("Find Json"), command:"find / -name \"*json*.lua\"" }
		];
		var commands = MyLocalStorage.getSettings("OsCommands") || defaultCommands;
		var actions = [
			{ name:'delete', glyph:deleteGlyph }
		];
		function _drawFrequentCommandBar(commands) {
			var editButtonHtml = buttonTemplate.format( 'altui-editoscmd-0', 'altui-editoscmd', editGlyph+" "+_T("Edit"),'primary',"");
			var html="";
			html+="	 <div id='altui-frequent-commands-bar' class='form-group'>";
			html+="		<label for='altui-btngroup'> {0}</label>".format(_T("Frequent Commands"));
			html+="		<div class='' id='altui-btngroup'>";
			$.each(commands, function(idx,obj) {
				html += "<button id='{0}' type='button' class='border btn btn-light altui-oscommand-button' data-cmd='{2}' '>{1}</button>".format(idx,obj.label,obj.command.replace(/'/g, '&quot;'));
			});
			html += editButtonHtml
			html+="		</div>";
			html+="	 </div>";
			return html;
		};
		function _drawCommandTable(commands) {
			var html="";
			html+= "<table class='table table-responsive-OFF table-sm altui-oscommand-configtbl'>";
			html+= "	<thead>";
			html+= "	  <tr>";
			html+= "<th>"+_T("Actions")+"</th>";
			$.each(defaultCommands[0] ,function(key,val) {
				html+= "<th>"+_T(key)+"</th>";
			})
			html+= "	  </tr>";
			html+= "	</thead>";
			html+= "	<tbody>";
			$.each(commands,function(idxcmd,cmd) {
				html+= "<tr>";
				html+= "<td>";
				$.each(actions,function(idxaction,action) {
					html += smallbuttonTemplate.format( idxcmd, 'altui-oscommand-configtbl-action-'+action.name, action.glyph ,action.name);
				});
				html+= "</td>";
				$.each(cmd,function(key,val) {
					html+= "<td>"+val+"</td>";
				})
				html+= "</tr>";
			})
			html+= "<tr>";
			html+= "<td>";
			html += smallbuttonTemplate.format( commands.length, 'altui-oscommand-configtbl-action-add', plusGlyph ,_T('Add') );
			html+= "</td>";
			$.each(defaultCommands[0],function(key,val) {
				html+= "<td>"+"<input required type='text' class='form-control' id='"+key+"' placeholder='"+key+"'>"+"</td>";
			})
			html+= "</tr>";
			html+= "<tr>";
			html+= "<td>";
			html += smallbuttonTemplate.format( commands.length, 'altui-oscommand-configtbl-action-reset', refreshGlyph ,_T('Default') );
			html+= "</td><td colspan=2></td>";
			html+= "</tr>";
			html+= "	</tbody>";
			html+= "</table>";
			return html;
		};

		function _replaceANSI(str) {
			var re = /\[33;1m(.*)\[0m/g;
			var subst = '<span class=\'altui-orange\'>$1</span>';
			str = str.replace(re, subst);
			re = /\[35;1m(.*)\[0m/g;
			subst = '<span class=\'altui-magenta\'>$1</span>';
			str = str.replace(re, subst);
			re = /\[31;1m(.*)\[0m/g;
			subst = '<span class=\'altui-red\'>$1</span>';
			str = str.replace(re, subst);
			re = /\[36;1m(.*)\[0m/g;
			subst = '<span class=\'altui-cyan\'>$1</span>';
			str = str.replace(re, subst);
			return str;
		};

		function _onExecCommand(e) {
			function _execCmd(cmd) {
				show_loading();
				MultiBox.osCommand( parseInt($("#altui-controller-select").val()), oscmd, false, function(res) {
					hide_loading();
					var html = $("<span></span>").text(res.result).html();	// escape html
					$('#altui-oscommand-result').html( (res.success==true) ? _replaceANSI(html) : _T("failed to execute"));
				});
			};

			var oscmd = $("#oscommand").val();
			if (oscmd.indexOf("{0}") > -1) {
				var dialog = DialogManager.registerDialog('dialogModal',
								defaultDialogModalTemplate.format('dialogModal',
								_T('Command Parameters'),		// title
								"",				// body
								"modal-lg",	// size
								""	// glyph icon
							));
				var lastOne = MyLocalStorage.getSettings("LastOne_param0") || "";
				DialogManager.dlgAddLine(dialog, 'param0', _T('Parameter'), lastOne,"", {required:''} );
				DialogManager.dlgAddDialogButton(dialog, true, _T("Run"));
				$('div#dialogModal').modal();
				$('div#dialogs')
					.off('submit',"div#dialogModal")
					.on( 'submit',"div#dialogModal", function() {
							$('div#dialogModal').modal('hide');
							var val = $("#altui-widget-param0").val();
							MyLocalStorage.setSettings("LastOne_param0",val);
							oscmd = oscmd.format( val );
							$("#oscommand").val( oscmd );
							setTimeout(function() {
								_execCmd(oscmd);
							}, 300 );
						});
			}
			else
				_execCmd(oscmd);
		};

		UIManager.clearPage('OsCommand',_T("OS Command"),UIManager.oneColumnLayout);

		var html = "";
		html+="<div class='col-12'>";
		html+="<form action='javascript:void(0);'>";
		html+=	"<p>"+_T("Enter a Vera OS ( Unix ) command, the stdout will be returned and displayed below")+"</p>";
		html += _drawFrequentCommandBar(commands);
		html+="	 <div class='form-row'>";
		html += _createControllerSelect('altui-controller-select','col-sm-4',"osCommand");
		html+="	 <div class='form-group col-sm-8''>";
		html+="	   <label class='col-form-label' for='oscommand'>"+_T("OS Command")+"</label>";
		html+="	   <input type='text' class='form-control' id='oscommand' placeholder='Type your OS command like: df '>";
		html+="	 </div>";
		html+="	 </div>";
		html+="<button type='button' id='altui-oscommand-exec-button' class='btn btn-primary'>"+_T("Run")+"</button>";
		html+="</form>";
		html+="<hr>";
		html+="<h3>"+_T("Output")+"</h3>";
		html+="<pre id='altui-oscommand-result' class='border border-secondary bg-light pre-scrollable'> </pre>";
		html+="</div>";
		$(".altui-mainpanel").append( html );

		$(".altui-mainpanel").on("click",".altui-oscommand-button",function(e){
			// e.stopPropagation();
			var val = $(this).data("cmd");
			$("#oscommand").val( val );
			setTimeout( function() { $("#altui-oscommand-exec-button").click() } ,100 );
		});

		$("input#oscommand").keypress(function(event) {
			if (event.which == 13) {
				event.preventDefault();
				_onExecCommand(event);
			}
		});

		$(".altui-mainpanel").on("click","#altui-oscommand-exec-button",function(e){
			_onExecCommand(e);
		});

		// SHOW EDIT TABLE
		$(".altui-mainpanel").on("click",".altui-editoscmd",function(e){
			if ( $(".altui-oscommand-configtbl").length == 0 ) {
				$("#altui-frequent-commands-bar").after(   _drawCommandTable(commands) );
			}
			else {
				$(".altui-oscommand-configtbl").remove();
			}
		});

		// DELETE
		$(".altui-mainpanel").on("click",".altui-oscommand-configtbl-action-delete",function(e){
			//delete command
			var index = $(this).prop('id');
			commands.splice(index,1);
			$("div#altui-frequent-commands-bar").replaceWith( _drawFrequentCommandBar(commands) );
			$("table.altui-oscommand-configtbl").replaceWith( _drawCommandTable(commands) );
			MyLocalStorage.setSettings("OsCommands",commands);
		});

		// ADD
		$(".altui-mainpanel").on("click",".altui-oscommand-configtbl-action-add",function(e){
			var tr = $(this).closest("tr");
			var label =tr.find("input#label").val();
			var command = tr.find("input#command").val();
			if ( label && command ) {
				commands.push( {label:label, command:command } );
				$("div#altui-frequent-commands-bar").replaceWith( _drawFrequentCommandBar(commands) );
				$("table.altui-oscommand-configtbl").replaceWith( _drawCommandTable(commands) );
				MyLocalStorage.setSettings("OsCommands",commands);
			}
		});

		// RESET
		$(".altui-mainpanel").on("click",".altui-oscommand-configtbl-action-reset",function(e){
			commands = cloneObject(defaultCommands);
			$("div#altui-frequent-commands-bar").replaceWith( _drawFrequentCommandBar(commands) );
			$("table.altui-oscommand-configtbl").replaceWith( _drawCommandTable(commands) );
			MyLocalStorage.setSettings("OsCommands",commands);
		});
	},

	pageLuaStart: function ()
	{
		function _prepareUI( ctrlid ) {
			var lua = MultiBox.getLuaStartup(ctrlid );
			UIManager.pageEditorForm($(".altui-mainpanel"),'altui-page-editor',_T("Lua Startup Code"),lua,null,"Submit",function(newlua) {
				if (newlua!=lua) {
					DialogManager.confirmDialog(_T("do you want to change Lua startup code ? if yes, it will generate a Lua reload, be patient..."),function(result) {
						if (result==true) {
							MultiBox.setStartupCode(ctrlid,newlua)
								.done( function(){
									PageMessage.message(_T("Lua Startup code has been modified"),"success");
								})
								.fail(function(){
									PageMessage.message(_T("Lua Startup can only be modified on controller 0"),"danger");
								});
						}
					});
				}
			});
		}

		UIManager.clearPage('LuaStart',_T("Lua Startup"),UIManager.oneColumnLayout);
		$(".altui-mainpanel").append( _createControllerSelect('altui-controller-select','col-6',"getLuaStartup"));
		$("#altui-controller-select").change(function(){
			$(".altui-editor-form").remove();
			_prepareUI( parseInt($("#altui-controller-select").val()) );
		});
		_prepareUI( 0 );
	},

	pagePower: function()
	{
		UIManager.clearPage('Power',_T("Power Chart"),UIManager.oneColumnLayout);

		// prepare and load D3 then draw the chart
		$(".altui-mainpanel")
			.append(
				"<style>				\
					.altui-energy-d3chart {			\
						font: 12px sans-serif;	\
					}							\
					.altui-energy-d3chart .axis {			\
						font: 10px sans-serif;	\
					}							\
					.altui-energy-d3chart .axis path, .altui-energy-d3chart .axis line {	\
					  fill: none;				\
					  stroke: "+getCSS('color','bg-info')+";				\
					  shape-rendering: crispEdges;	\
					}							\
					.altui-energy-d3chart rect {				\
						fill: "+getCSS('background-color','bg-info')+";			\
					}							\
					.altui-energy-d3chart text {				\
						fill: "+getCSS('color','bg-info')+";		\
					}							\
				</style>"
			)
			.append("<svg class='altui-energy-d3chart'></svg>");

		var margin = {top: 10, right: 50, bottom: 10, left: 150},
			width = $(".altui-mainpanel").innerWidth() - margin.left - margin.right-30,
			barHeight = 20,
			height = 0; // calculated later

		function _processEnergyData(input)
		{
			// prepare data
			var data = input.trim().split('\n');
			$.each(data, function(i,line) {
					data[i] = line.split('\t');
			});
			return data;
		};

		function _refreshPowerChart() {
			if ($(".altui-energy-d3chart").length==0)
				return;	// stop refreshing
			MultiBox.getPower( function(res) {
				var data = _processEnergyData(res);
				var x = d3.scaleLinear()
						.range([0, width])
						.domain([0, d3.max(data, function(d) { return +d[4]; })]);	// d[4] is watts and is text, must convert to int

				var xAxis = d3.axisTop(x);

				var chart = d3.select(".altui-energy-d3chart");
				chart.selectAll("g.device").data(data);

				var t = chart.transition().duration(1000);
				t.select(".axis").call(xAxis);

				var bar = t.selectAll("g.device");
				bar.select("text.wattage")
						.attr("x", function(d) { return /*Math.max( x(d[4]) - 3, 10 );*/ x(d[4])-3 })
						.attr("y", barHeight / 2)
						.attr("dy", ".35em")
						.attr("text-anchor","end")
						.text(function(d) { return (parseInt(d[4])!=0) ? d[4] : ''; });
				bar.select("rect")
						.attr("width", function(d) { return x(d[4]); })
						.attr("height", barHeight - 1);

				setTimeout( _refreshPowerChart , 5000 );
			});
		};

		function _drawPowerChart() {
			if ($(".altui-energy-d3chart").length==0)
				return;	// stop refreshing

			MultiBox.getPower( function(res) {
				// prepare data
				var data = _processEnergyData(res);

				// async func to draw the chart
				$(".altui-energy-d3chart").replaceWith("<svg class='altui-energy-d3chart'></svg>");
				margin = {top: 10, right: 50, bottom: 10, left: 150};
				width = $(".altui-mainpanel").innerWidth() - margin.left - margin.right-30;
				barHeight = 20;
				height = (1+data.length)*(barHeight +1);

				var x = d3.scaleLinear()
						.range([0, width])
						.domain([0, d3.max(data, function(d) { return +d[4]; })]);	// d[4] is watts and is text, must convert to int

				var xAxis = d3.axisTop(x);

				var chart = d3.select(".altui-energy-d3chart")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
					.append("g")
						.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				chart.append("g")
					.attr("class","axis")
					.attr("transform", "translate(0,"+(barHeight-1)+")")
					.call(xAxis);

				chart.append("text")
					.attr("x",-10)
					.attr("y",barHeight / 2)
					.attr("text-anchor","end")
					.text("Watts");

				var bar = chart.selectAll("g.device")
					.data(data)
					.enter()
						.append("g")
						.attr("class","device")
						.attr("transform", function(d, i) { return "translate(0," + (i+1) * barHeight + ")"; });

				bar.append("rect")
						.attr("width", function(d) { return x(d[4]); })
						.attr("height", barHeight - 1);

				bar.append("text")
						.attr("class","wattage")
						.attr("x", function(d) { return /*Math.max( x(d[4]) - 3, 10 );*/ x(d[4])-3 })
						.attr("y", barHeight / 2)
						.attr("dy", ".35em")
						.attr("text-anchor","end")
						.text(function(d) { return (parseInt(d[4])!=0) ? d[4] : ''; });
				bar.append("text")
						.attr("class","name")
						.attr("x", -5)
						.attr("y", barHeight / 2)
						.attr("dy", ".35em")
						.attr("text-anchor","end")
						.text(function(d) { return "{0}, #{1}".format(d[1],d[0]); });

				setTimeout( _refreshPowerChart , 5000 );
			});
		}

		UIManager.loadD3Script( _drawPowerChart );
	},

	pageZwave: function()
	{
		function _nodename(d)		{ return "{0}, #{1}".format(d.name, d.altuiid); }
		function _commQuality(altuiid) {
			//PollOk/(PollOk+PollNoReply)
			var device = MultiBox.getDeviceByAltuiID(altuiid);
			var service="urn:micasaverde-com:serviceId:ZWaveDevice1"
			var PollNoReply = parseInt(MultiBox.getStatus(device,service,"PollNoReply"));
			var PollOk = parseInt(MultiBox.getStatus(device,service,"PollOk"));
			if ( (isNaN(PollOk)==false) && (isNaN(PollNoReply)==false) && ((PollOk+PollNoReply)>0) )
				return ( PollOk / (PollOk+PollNoReply) );
			return -1;
		};
		function _countNeighbors(device) {
			var n=0;
			$.each( device.states, function(i,s) {
				if (s.variable=="Neighbors") {
					n = s.value.split(',').length;
					return false;
				}
			});
			return n;
		};
		function _NeighborsOf(device)	{
			var result = [];
			var controllerid = MultiBox.controllerOf(device.altuiid).controller;
			$.each( device.states, function(i,s) {
				if (s.variable=="Neighbors") {
					result = s.value.split(',');
					$.each(result, function(i,r) {
						var device = MultiBox.getDeviceByAltID( controllerid, 1, r );	// 1=zWave controller, r=altid
						result[i] = (device) ? device.altuiid : null;
					});
					return false;
				}
			})
			return result;
		};
		var width=0, height=0, chart=null, orders=null;
		var razbdevice = MultiBox.getDeviceByType(0,"urn:schemas-upnp-org:device:razb:1")
		var data = $.grep( MultiBox.getDevicesSync() , function(d) {
				return (d.id_parent==1) || ((razbdevice) && (d.id_parent==razbdevice.id) && (MultiBox.controllerOf(d.altuiid).controller==0))
			}
		);
		orders = {
			id:$.map( data.sort(function(a, b){return parseInt(a.id)-parseInt(b.id)}), function(d) { return d.altuiid; }),
			name: $.map( data.sort( sortByName ), function(d) { return d.altuiid; }),
			mesh:$.map( data.sort(function(a, b){return _countNeighbors(b)-_countNeighbors(a)}), function(d) { return d.altuiid; })
		};

		UIManager.clearPage('ZWave',_T("zWave Network"),UIManager.oneColumnLayout);
		// $("div#dialogs").append(deviceModalTemplate.format( '', '', 0 ));
		DialogManager.registerDialog('deviceModal',deviceModalTemplate.format( '', '', 0 ));
		var html = "";
		html += "<form class='col-12 form-inline'>";
			html += "<div class='form-group'>";
				html += "<label class='col-form-label ' for='altui-zwavechart-order' >"+_T("Order By")+":</label>";
				html += "<select id='altui-zwavechart-order' class='form-control'>";
					html += "<option value='id'>ID</option>";
					html += "<option value='name'>"+_T("Name")+"</option>";
					html += "<option value='mesh'>"+_T("Mesh")+"</option>";
				html += "</select>";
			html += "</div>";
			html += ("<button type='button' id='altui-reset-pollcounters' class='btn btn-light' >"+_T("Reset Poll Counters")+"</button>");
			html += "<div class='form-group altui-quality-color'></div><span class=''>: {0}</span>".format(_T("Poll Success Rate"))
			html += "<div class='form-group altui-quality-grey'></div><span class=''>: {0}</span>".format(_T("No Poll"))
		html += "</form>";
		html += "<div class='col-12 altui-zwavechart-container'>";
			html += "<svg class='d3chart'></svg>";
		html += "</div>";
		$(".altui-mainpanel")
			.append(html)
			.append(
				"<style>				\
					.d3chart {			\
						font: 12px sans-serif;	\
					}							\
					.d3chart .ligne {			\
					}							\
					.d3chart .colonne {			\
					}							\
					.d3chart .cellule {			\
					}							\
					.d3chart line {				\
						stroke-width: 1px;		\
						stroke: "+$("#altui-pagetitle").css("color")+";			\
					}							\
					.d3chart text {				\
						fill: "+$("#altui-pagetitle").css("color")+";			\
					}							\
					.d3chart text.active {		\
						fill: "+getCSS('color','text-danger')+";				\
						font-weight:bold	\
					}							\
				</style>"
			);

		function _drawChart( chart, width, height, orderby	) {
			var x= d3.scaleBand()
				.domain( orders[orderby] )
				.range([0, width]);

			var y = d3.scaleBand()
				.domain( orders[orderby] )
				.range([0, height]);

			var c = d3.scaleQuantize()
				.domain( [0,1] )
				.range(["red","orange","yellow","yellowgreen","green"]);

			var row = chart.selectAll(".ligne").data(data);
			row.enter()
				.append("g")
					.attr("class","ligne")
					.attr("transform",function(d,i) { return "translate(0,"+y(d.altuiid)+")"; } )
					.each(fctcell)
				.append("text")
					.attr("x", -6)
					.attr("y", x.bandwidth() / 2)
					.attr("dy", ".32em")
					.attr("text-anchor", "end")
					.text(function(d) { return _nodename(d); })
				.on("mouseover", function(p) {
					d3.select(this).classed("active", true);
				})
				.on("mouseout", function(p) {
					d3.select(this).classed("active", false);
				})
				.on('click',function(d,i) {
					var device = MultiBox.getDeviceByAltuiID(d.altuiid);
					UIManager.deviceDrawVariables(device);
				});

			row.append("line")
				.attr("x2", width);
			row.exit().remove();

			var col = chart.selectAll(".colonne").data(data);
			col.enter()
				.append("g")
					.attr("class","colonne")
					.attr("transform",function(d,i) { return "translate("+x(d.altuiid)+",0) rotate(-90)"; } )
					.append("text")
					  .attr("x", 6)
					  .attr("y", x.bandwidth() / 2)
					  .attr("dy", ".32em")
					  .attr("text-anchor", "start")
					  .text(function(d) { return _nodename(d); });

			col.append("line")
				.attr("x1", -width);

			col.exit().remove();

			function fctcell(row) {
				var cell = d3.select(this).selectAll(".cellule")
					.data( function(d)	{
						return _NeighborsOf(d);
						} );

				cell.enter()
					.append("rect")
						.attr("class","cellule")
						.attr("x", function(d) {
								return x(d);
								// return x(d.id);
								} )
						.attr("width",x.bandwidth())
						.attr("height",y.bandwidth())
						// .style("fill",c(_commQuality(d)))
						.style("fill",function(d) {
							var cq = _commQuality(d3.select(this.parentNode).datum().altuiid);
							return (cq<0) ? "grey" : c(_commQuality(d3.select(this.parentNode).datum().altuiid));
							})
						.on("mouseover", function(p) {
							var lignedatum = d3.select(this.parentNode).datum();
							d3.selectAll(".ligne text").classed("active", function(d, i) { return d.altuiid == lignedatum.altuiid; });
							d3.selectAll(".colonne text").classed("active", function(d, i) { return d.altuiid == p; });
						})
						.on("mouseout", function(p) {
							d3.selectAll("text").classed("active", false);
						})
						.on('click',function(d,i) {
							var lignedatum = d3.select(this.parentNode).datum();
							var device = MultiBox.getDeviceByAltuiID(lignedatum.altuiid);
							UIManager.deviceDrawVariables(device);
						});

				cell.exit()
					.remove();
			}

		};


		function _drawzWavechart()
		{
			$(".d3chart").replaceWith("<svg class='d3chart'></svg>");
			var available_height = $(window).height() - $("nav#navbar").outerHeight() - $("#altui-pagemessage").outerHeight() - $("#altui-pagetitle").outerHeight() - $("#altui-zwavechart-order").outerHeight() - $("footer").outerHeight();
			var margin = {top: 150, right: 10, bottom: 10, left: 150};
			width = $(".altui-zwavechart-container").innerWidth() - margin.left - margin.right-30;
			height = Math.min(width,available_height - margin.top - margin.bottom);
			width = Math.max( width , data.length*11 )
			height = Math.max( height , data.length*11 )
			if (width<height)
				height = width;
			else
				width = height;


			chart = d3.select(".d3chart")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				// .style("margin-left", -margin.left + "px")
				.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			chart.append("line")
					.attr({
						x1: width-1,
						x2: width-1,
						y1: 0,
						y2: height});
			chart.append("line")
					.attr({
						x1: 0,
						x2: width,
						y1: height,
						y2: height});

			_drawChart( chart, width, height, $("#altui-zwavechart-order").val() );
		};
		UIManager.loadD3Script( _drawzWavechart );

		$("#altui-reset-pollcounters").click(function() {
			MultiBox.resetPollCounters().done(function(){
				PageMessage.message(_T("Counters have been reset properly"),"success");
			});
		});

		$("#altui-zwavechart-order").change( function() {
			var orderby=$(this).val();

			var x = d3.scaleBand()
				.domain( orders[orderby] )
				.range([0, width]);

			var y = d3.scaleBand()
				.domain( orders[orderby] )
				.range([0, height]);
			var t= chart.transition().duration(2000)
			var row = t.selectAll(".ligne")
					.delay(function(d, i) { return y(d.altuiid) * 4; })
					.attr("transform",function(d,i) { return "translate(0,"+y(d.altuiid)+")"; } )
				.selectAll(".cellule")
					.delay(function(d, i) { return x(d) * 4; })
					.attr("x", function(d) { return x(d); } )
			var col = t.selectAll(".colonne")
					.delay(function(d, i) { return x(d.altuiid) * 4; })
					.attr("transform",function(d,i) { return "translate("+x(d.altuiid)+",0) rotate(-90)"; } )
		});
		$( window )
			.off( "resize", _drawzWavechart )
			.on( "resize", _drawzWavechart );
	},

	_findNodeByZwID : function (data,zwid) {
		var found=null;
		$.each(data.nodes,function( idx, node) {
			if (node.zwid==zwid) {
				found=node;
				return false;
			}
		});
		return found;
	},

	pageQuality: function()	 {
		var data = { nodes:[] , links:[] };
		var linkcolor, color, svg;
		var height = null, width = null;
		var margin = {top: 20, right: 10, bottom: 10, left: 20};
		var ygap = 30;
		var filtered = false;
		var devices = null;

		//http://stackoverflow.com/questions/25595387/d3-js-how-to-convert-edges-from-lines-to-curved-paths-in-a-network-visualizatio
		function draw_curve(Ax, Ay, Bx, By, M) {

			// side is either 1 or -1 depending on which side you want the curve to be on.
			// Find midpoint J
			var Jx = Ax + (Bx - Ax) / 2
			var Jy = Ay + (By - Ay) / 2

			// We need a and b to find theta, and we need to know the sign of each to make sure that the orientation is correct.
			var a = Bx - Ax
			var asign = (a < 0 ? -1 : 1)
			var b = By - Ay
			var bsign = (b < 0 ? -1 : 1)
			var theta = Math.atan(b / a)

			// Find the point that's perpendicular to J on side
			var costheta = asign * Math.cos(theta)
			var sintheta = asign * Math.sin(theta)

			// Find c and d
			var c = M * sintheta
			var d = M * costheta

			// Use c and d to find Kx and Ky
			var Kx = Jx - c
			var Ky = Jy + d

			return "M" + Ax + "," + Ay +
				   "Q" + Kx + "," + Ky +
				   " " + Bx + "," + By
		};

		function _drawChart() {
			var data;
			function _prepareDataLinks(data) {
				data.links=[];
				$.each(data.nodes, function(idx,node) {
					var source = null;
					$.each(node.routes, function(idx,route) {
						source = node;
						var split = route.split("-");
						var routequality = (split[1] || '0');
						var nodes = split[0].split(".");
						$.each(nodes, function(idx,zwid) {
							var dest = UIManager._findNodeByZwID(data,zwid);
							if (dest!=null) {
								data.links.push( {
									id:source.zwid+"-"+dest.zwid,
									quality:parseInt(routequality),
									broken:(routequality.slice(-1)=="x"),
									source: source,
									target: dest,
									manual_route: node.manual_routes
								});
								source = dest;	// skip to next segment
							}
						});
					})
				});
				return (data);
			};
			function _prepareDataRoutes2(  ) {
				data = { nodes:[] , links:[] };
				var color = {};
				var nColor = 0;
				if (devices) {
					var zwavenet = MultiBox.getDeviceByType(0,"urn:schemas-micasaverde-com:device:ZWaveNetwork:1");
					if (zwavenet) {
						color[zwavenet.device_type]=nColor++;
						data.nodes.push({
							x:0,
							y:0,
							id:parseInt(zwavenet.id),
							zwid:0,
							name:zwavenet.name,
							color:color[zwavenet.device_type],
							group:0,
							routes: []
							});
						var y=ygap;
						$.each( devices.sort(function(a, b){return parseInt(a.id)-parseInt(b.id)}), function( idx,device ) {
							var ManualRoute = MultiBox.getStatus(device,"urn:micasaverde-com:serviceId:ZWaveDevice1","ManualRoute");
							var AutoRoute = MultiBox.getStatus(device,"urn:micasaverde-com:serviceId:ZWaveDevice1","AutoRoute");
							if ( ManualRoute || AutoRoute)
							{
								var route = "";
								var bManual = false;
								if ( ManualRoute && (ManualRoute!="undefined")) {
									route = ManualRoute; bManual = true;
								}
								else
									route = AutoRoute;
								if (color[device.device_type]==undefined)
									color[device.device_type]=nColor++;
								// like this: "2-20x,7-59x,2.7-78"
								var routes = route.split(",");
								var firstnode = route[0].split("-")
								var group = (firstnode[0]=="0") ? 1 : 2;
								data.nodes.push({
									x: group * width/4,
									y: y,
									id:parseInt(device.id),
									zwid:parseInt(device.altid),
									name:device.name+':'+device.id+'#'+device.altid,
									color:color[device.device_type] ,
									group: group,
									routes: routes,
									manual_routes: bManual
								});
								y+=ygap;
							}
						});
					}
					data=_prepareDataLinks(data);
				}
				return data;
			};
			function sglclick(d) {
				if (d3.event.defaultPrevented) return;
				// console.log('click');
				var selection = d3.select(this);
				if (filtered) {
					filtered = false;
					data = _prepareDataRoutes2(	 );
				}
				else {
					filtered = true;
					// remove from data all nodes and links for nodes not invovled in this routing
					var authorized = [];
					authorized.push( 0 );
					authorized.push( selection.datum().zwid );
					$.each(selection.datum().routes, function(idx,route) {
						var split = route.split("-");
						var nodes = split[0].split(".");
						$.each(nodes, function(idx,zwid) {
							authorized.push( parseInt(zwid) );
						});
					});
					data.nodes=$.grep(data.nodes,function(node) {
						return ( $.inArray(node.zwid , authorized) != -1 );
					});
					$.each(data.nodes, function(idx,node) {
						node.y = idx*ygap;
					})
				}
				_prepareDataLinks(data);
				_updateChartRoutes2(data);
			};
			function _createChartRoutes2(data) {
				linkcolor = d3.scaleQuantize()
					.domain( [d3.max(data.links, function(d) {return d.quality;} ),d3.min(data.links, function(d) {return d.quality;} )] )
					.range(["green","yellow","orange","red"]);
					// .range(["red","orange","yellow","green"]);

				// color = d3.scale.category20();
				color = d3.scaleOrdinal(d3.schemeCategory20);
				height = data.nodes.length*ygap;
				svg = d3.select(".altui-route-d3chart")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
					.append("g")
						.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			};
			function _updateChartRoutes2(data) {
				var links = svg.selectAll(".link").data( data.links , function(d) { return d.id; } );
				links.exit().transition().duration(1000).style("opacity","0").remove();
				links.enter()
					.insert("svg:path", ".node")		// so that node allways hide links
					.attr("class","link")
					.attr("d", function(d) {
						var M = (d.source.group != d.target.group) ? 0 : (60+Math.abs(d.target.y-d.source.y)/ygap*4);
						return draw_curve(d.source.x, d.source.y, d.target.x, d.target.y, M);
					})
					// .style("stroke-opacity", 0)
					.style("stroke-dasharray", function(d) { return (d.manual_route)  ? "10,10" : null; } )
					.style("stroke", function(d) { return d.broken ? "red" : linkcolor(d.quality);} );

				var transition = links.transition().duration(1000)
					.style("stroke-opacity", function(d) { return ((d.source.group != d.target.group) ? 1 : 0.5); })
					.attr("d", function(d) {
						var M = (d.source.group != d.target.group) ? 0 : (60+Math.abs(d.target.y-d.source.y)/ygap*4);
						return draw_curve(d.source.x, d.source.y, d.target.x, d.target.y, M);
					});

				var nodes = svg.selectAll(".node").data( data.nodes , function(d) { return d.id; } );
				nodes.exit().transition().duration(1000).style("opacity","0").remove();

				var groups = nodes.enter()
					.append("g")
					.attr("class", "node")
					.on("click", sglclick );

				groups.append("circle")
					.attr("cx", function (d) { return d.x })
					.attr("cy", function (d) { return d.y })
					.attr("r", 8 )
					// .style("opacity", 0)
					.style("fill", function (d) { return color(d.color); });

				groups.append("text")
					.attr("x", function (d) { return d.x })
					.attr("y", function (d) { return d.y })
					.attr("dx", 15)
					.attr("dy", ".35em")
					// .style("opacity", 0)
					.text(function (d) { return d.name; });

				var transition = nodes.transition().duration(1000);
				transition.select("circle")
					.style("opacity", 1)
					.attr("cx", function (d) { return d.x })
					.attr("cy", function (d) { return d.y });
				transition.select("text")
					.style("opacity", 1)
					.attr("x", function (d) { return d.x })
					.attr("y", function (d) { return d.y });

					};
			data = _prepareDataRoutes2();
			_createChartRoutes2(data);
			_updateChartRoutes2(data);
		};

		UIManager.clearPage('Quality',_T("Network Quality"),UIManager.oneColumnLayout);

		$(".altui-mainpanel").append( _createControllerSelect('altui-controller-select','col-6'));
		$("#altui-controller-select").change(function() {
			$(".altui-route-d3chart").html("");
			MultiBox.getDevices(null,function(d) {	return MultiBox.controllerOf(d.altuiid).controller==parseInt($("#altui-controller-select").val()); },function(arr) {
				devices = arr;
				_drawChart();
			})
		});
		$(".altui-mainpanel")
			.append(
				"<style>					\
				.altui-route-d3chart-container {\
				}							\
				.node {						\
				}							\
				.node circle {		\
					stroke: #fff;			\
					stroke-width: 1.5px;	\
				}							\
				.node text {				\
					fill: gray;				\
					pointer-events: none;	\
					font-size: 10px;		\
				}							\
				.link {						\
					stroke-opacity: .8;		\
					fill: none;				\
				}							\
				</style>" )
			.append("<div class='col-12 altui-route-d3chart-container'><svg class='altui-route-d3chart'></svg></div>")
		var available_height = $(window).height() - $("#altui-pagemessage").outerHeight() - $("#altui-pagetitle").outerHeight() - $("footer").outerHeight();
		width = $(".altui-route-d3chart-container").innerWidth() - margin.left - margin.right;
		height = Math.max(300,Math.min(width,available_height - margin.top - margin.bottom));
		 $(".altui-route-d3chart-container").height(height);
		UIManager.loadD3Script( function() {
			MultiBox.getDevices(null,function(d) {	return MultiBox.controllerOf(d.altuiid).controller==parseInt($("#altui-controller-select").val()); },function(arr) {
				devices = arr;
				_drawChart();
			})
		});
	},

	// Returns a list of all nodes under the root.
	_flatten: function (root) {
		var nodes = [], i = 0;
		function recurse(node) {
			if (node.children) node.children.forEach(recurse);
			// if (!node.id) node.id = ++i;
			nodes.push(node);
		}
		recurse(root);
		return nodes;
	},

	_findNode: function ( root, id ) {
		var found=null;
		if (root.id == id )
			return root;
		if (root.children)
			$.each( root.children, function (i,n) {
				found =	 UIManager._findNode( n, id );
				return ( found==null );
			});
		return found;
	},

	_addChildrenFromWaitList: function ( data, node) {
		// search in wait list
		var children=[]
		// console.log("searching wait list for childs of {0}".format(node.id));
		for ( var i = data.wait.length-1; i>=0 ; i--) {
			if (data.wait[i].id_parent == node.id) {
				var child = data.wait.splice(i,1)[0];
				// console.log("found node :"+child.id);
				node.children.push(child);
				children.push(child);
			}
		}
		$.each(children, function(i,child) {
			UIManager._addChildrenFromWaitList( data, child);
		});
	},

	_addNode: function (data , node ) {
		var parent = UIManager._findNode( data.root, node.id_parent );
		if (parent==null){
			// console.log("could not find parent, putting in wait list");
			data.wait.push(node);
			return;
		}
		parent.children.push( node );
		UIManager._addChildrenFromWaitList(data,node);
	},

	pageChildren: function() {
		var height = null, width = null;
		var data = { root:[], nodes:[] , links:[] , wait:[] };
		var devices = null;

		function _createLinks(nodes) {
			var links=[]
			$.each(nodes, function( idx,n ) {
				if (n.children) {
					$.each(n.children, function (ic,nc) {
						links.push({
							source: n.id,
							target: nc.id
						})
					})
				}
			})
			return links
		};

		function _prepareDataParents( ) {
			data = { root:[], nodes:[] , links:[] , wait:[] };
			var color = { "ctrl": 0 };
			var nColor = 1;
			// var devices = $.grep( MultiBox.getDevicesSync() , function(d) {return (MultiBox.controllerOf(d.altuiid).controller==0) } );
			data.root={ id:"0-0", name:"Main Controller", color:color["ctrl"], children:[] };
			$.each( MultiBox.getControllers(), function (idx,c) {
				if (idx>0) {
					UIManager._addNode(data,{
						id:"{0}-{1}".format(idx,0),
						name:"Controller "+c.ip,
						color:color["ctrl"] ,
						id_parent: "0-0",
						children: []
					});
				}
			});

			if (devices) {
				$.each( devices /*.sort(function(a, b){return parseInt(a.id)-parseInt(b.id)})*/, function( idx,device ) {
					if (color[device.device_type]==undefined)
						color[device.device_type]=nColor++;
					var controllerid = MultiBox.controllerOf(device.altuiid).controller;
					// console.log("device {0},{1} id_parent:{2}-{3}".format(device.name, device.altuiid,controllerid,device.id_parent));
					UIManager._addNode(data,{
						id:device.altuiid,
						name:device.name+", "+device.altuiid,
						color:color[device.device_type] ,
						id_parent: "{0}-{1}".format(controllerid,device.id_parent || 0),
						children: []
						});
				});
				// $.each(data.wait, function(i, node) {
					// console.log( node.id );
				// });
			}
			return data;
		};

		function _drawChartParents() {
			function _updateDataParents( ) {
				data.nodes = UIManager._flatten(data.root);
				data.links = _createLinks(data.nodes);
			};

			// $(".altui-children-d3chart").replaceWith("<svg class='col-12 altui-children-d3chart'></svg>");
			var available_height = $(window).height() - $("#altui-pagemessage").outerHeight() - $("#altui-pagetitle").outerHeight() /*- $("#altui-zwavechart-order").outerHeight() */ - $("footer").outerHeight();
			// var margin = {top: 20, right: 10, bottom: 10, left: 20};
			var margin = {top: 0, right: 0, bottom: 0, left: 0};
			width = $(".altui-children-d3chart-container").innerWidth() - margin.left - margin.right-30;
			// height = Math.max(300,Math.min(width,available_height - margin.top - margin.bottom));
			height = available_height;
			$(".altui-children-d3chart").height(height)

			//Set up the colour scale
			var color = d3.scaleOrdinal(d3.schemeCategory20);
			var svg = d3.select(".altui-children-d3chart")
				.append("g")
					// .attr("transform", "translate(" + (margin.left) + "," + (margin.top) + ")");

			//Set up the force layout
			data = _prepareDataParents( );

			simul = d3.forceSimulation( data.nodes )
						.on("tick", function () {
							// avoid asynchronous tick when the user changed the page
							// this crashed d3
							if ($("#altui-pagetitle").html()==_T("Parent/Child Network")) {
								var radius = 30
								d3.selectAll("circle")
									.attr("cx", function (d) { return d.x=Math.max(radius, Math.min(width - radius, d.x));	})
									.attr("cy", function (d) { return d.y=Math.max(radius, Math.min(height - radius, d.y));; });
								d3.selectAll("text")
									.attr("x", function (d) { return d.x=Math.max(radius, Math.min(width - radius, d.x));  })
									.attr("y", function (d) { return d.y=Math.max(radius, Math.min(height - radius, d.y));; });
								d3.selectAll(".link")
									.attr("x1", function(d) { return d.source.x; })
									.attr("y1", function(d) { return d.source.y; })
									.attr("x2", function(d) { return d.target.x; })
									.attr("y2", function(d) { return d.target.y; });

							}
						});
			// var drag = simul.drag().on("dragstart", dragstart);
			var container = document.querySelector(".altui-children-d3chart")
			var drag = d3.drag()
							.container( container )
							// .subject(dragsubject)
							.on("start", dragstarted)
							.on("drag", dragged)
							.on("end", dragended)

			// function dragsubject() {
				// return simul.find(d3.event.x - width / 2, d3.event.y - height / 2);
			// }
			function dragstarted(d) {
				if (!d3.event.active) simul.alphaTarget(0.3).restart();
				$(d3.event.sourceEvent.currentTarget).toggleClass("fixed",true)
				d3.event.subject.fx = d3.event.subject.x;
				d3.event.subject.fy = d3.event.subject.y;
			};
			function dragged() {
				d3.event.subject.fx = d3.event.x;
				d3.event.subject.fy = d3.event.y;
			}

			function dragended() {
				if (!d3.event.active) simul.alphaTarget(0);
				// d3.event.subject.fx = null;
				// d3.event.subject.fy = null;
			}

			function sglclick(d) {
				if (d3.event.defaultPrevented) return;
				// console.log('click');
				var selection = d3.select(this);
				if (d3.event.shiftKey) {
					d.fixed =  false;
					delete d.fx;
					delete d.fy;
					$(d3.event.currentTarget).toggleClass("fixed",false)
					simul.alphaTarget(0);
				}
				else {
					if (d.children) {
						if (d.children.length==0)
							return;	// non collapsible node
						d._children = d.children;
						d.children = null;
						selection.append("text")
							.text("+")
							.attr("class", "plussign")
							.attr("dx", 0)
							.attr("dy", ".35em")
					} else {
						if (d._children) {
							d.children = d._children;
							d._children = null;
						}
						selection.selectAll(".plussign").remove();
					}
				}
				_updateChart(data);
			};

			function _updateChart(data) {
				function _countChildren(d) {
					var s = 0;
					if (d && d.children)
						$.each(d.children, function(i,child) {
							s += ( 1 + _countChildren(child));
						})
					return s;
				};
				var width = $(".altui-children-d3chart").width();
				var height = $(".altui-children-d3chart").height();
				_updateDataParents();

				simul
					.nodes(data.nodes)
					.velocityDecay(0.2)
					.force("link",d3	.forceLink(data.links)
						.id(function(d) { return d.id; })
						.distance( function(d) { return	35+(d.source.children ? 2*d.source.children.length : 0 ) } ) )
					.force("center", d3.forceCenter(width / 2, height / 2))
					.force("charge", d3.forceManyBody()
						.strength(function(d) { return -50 - (d.children ? 2*d.children.length : 0) })
						.distanceMax(200))

				var link = svg.selectAll(".link").data( data.links , function(d) { return d.target.id; } );
				var node = svg.selectAll(".node").data( data.nodes , function(d) { return d.id; } );

				link.exit().transition().duration(500).style("opacity","0").remove();
				link.enter()
					.insert("line", ".node")		// so that node allways hide links
					.attr("class", "link")
					.style("stroke", function(d) { return (d.broken==true) ? "red": "" ; } )
					.style("stroke-width", 1 )
					.attr("x1", function(d) { return d.source.x; })
					.attr("y1", function(d) { return d.source.y; })
					.attr("x2", function(d) { return d.target.x; })
					.attr("y2", function(d) { return d.target.y; });

				node.exit().transition().duration(1000).style("opacity","0").remove();

				var groups = node.enter().append("g")
							.attr("class", "node")
							.on("click", sglclick )
							.call( drag );
					groups.append("circle")
						.attr("r", function(d) {
							return 8+ ( Math.sqrt(_countChildren(d)) ) ;
							// return 8+ (d.children ? d.children.length/2 : 0);
						} )
						.style("fill", function (d) {
							return color(d._children ? "#3182bd" : d.color);
						});
					groups.append("text")
						.attr("dx", 15)
						.attr("dy", ".35em")
						.text(function (d) { return d.name });
			};
			_updateChart(data);
		};


		// prepare and load D3 then draw the chart
		UIManager.clearPage('Parent/Child',_T("Parent/Child Network"),UIManager.oneColumnLayout);
		PageMessage.message(_T("Drag and Drop to fix the position of a node. Simple Click to open or collapse a parent node, Shift Click to free a fixed node"),"info");
		var html="";
		$(".altui-mainpanel")
			.append(
				"<style>					\
				.node {						\
					cursor: move;			\
				}							\
				.node circle {		\
					stroke: #fff;			\
					stroke-width: 1.5px;	\
				}							\
				.node.fixed circle {		\
					stroke: #f00;			\
					stroke-width: 1.5px;	\
				}							\
				.node.closed circle {		\
					stroke: white;		\
					fill: white !important;			\
				}							\
				.node.closed.fixed circle {		\
					stroke: #f00;		\
					fill: white !important;			\
				}							\
				.node text.plussign {				\
					font-size: 18px;		\
					text-anchor: middle;	\
				}							\
				.node text {				\
					fill: gray;				\
					pointer-events: none;	\
					font-size: 10px;		\
				}							\
				.link {						\
					stroke: #999;			\
					stroke-opacity: .8;		\
				}							\
				</style>" )
			.append(html+"<div class='col-12 p-0 altui-children-d3chart-container'><svg class='w-100 altui-children-d3chart'></svg></div>")
		UIManager.loadD3Script( function() {
			MultiBox.getDevices(null,null,function(arr) {
				// console.log("received {0} devices:".format(arr.length));
				devices = arr;
				_drawChartParents();
			});
		});
	},

	pageRoutes: function() {
		var height = null, width = null;
		var data = { root:[], nodes:[] , links:[] };
		var devices = null;

		function _drawChartRoutes() {

			function _prepareDataRoutes(  ) {
				data = { root:[], nodes:[] , links:[] , wait:[] };
				var color = {};
				var nColor = 0;
				var devices = $.grep( MultiBox.getDevicesSync() , function(d) {return (MultiBox.controllerOf(d.altuiid).controller==$("#altui-controller-select").val());} );

				data.root={ id:0, zwid:0, name:"root", children:[] };
				if (devices) {
					var zwavenet = MultiBox.getDeviceByType(0,"urn:schemas-micasaverde-com:device:ZWaveNetwork:1");
					if (zwavenet) {
						color[zwavenet.device_type]=nColor++;
						data.nodes.push({
							fx:width/2,
							fy:height/2,
							id:parseInt(zwavenet.id),
							zwid:0,
							name:zwavenet.name,
							color:color[zwavenet.device_type] ,
							id_parent:null,
							routes: []
							});
						$.each( devices, function( idx,device ) {
							var ManualRoute = MultiBox.getStatus(device,"urn:micasaverde-com:serviceId:ZWaveDevice1","ManualRoute");
							var AutoRoute = MultiBox.getStatus(device,"urn:micasaverde-com:serviceId:ZWaveDevice1","AutoRoute");
							if ( ManualRoute || AutoRoute)
							{
								var route ="";
								var bManual = false;
								if ( ManualRoute && (ManualRoute!="undefined")) {
									route = ManualRoute; bManual = true;
								}
								else
									route = AutoRoute;
								if (color[device.device_type]==undefined)
									color[device.device_type]=nColor++;
								data.nodes.push({
									x:Math.random()*width,
									y:Math.random()*height,
									id:parseInt(device.id),
									zwid:parseInt(device.altid),
									name:device.name+':'+device.id+'#'+device.altid,
									children: [],
									color:color[device.device_type] ,
									id_parent:device.id_parent || 0,
									routes: route.split(","),
									manual_route: bManual
								});
							}
						});
					}
				}
				return data;
			};
			function _updateDataRoutes(data) {
				// data.nodes = _flatten(data.root);
				// enum devices and create a link per route	 ManualRoute AutoRoute
				// urn:micasaverde-com:serviceId:ZWaveDevice1
				// like this: "2-20x,7-59x,2.7-78"
				$.each(data.nodes,function( idx, node) {
					// insert a link for each route
					if (node.routes) {
						// console.log("node name:{0} zwid:{1} routes:{2}".format(node.name, node.zwid,node.routes));
						$.each(node.routes, function( idx,route) {
							var srcnode = node;
							var splits = route.split("-");
							var linkquality = splits[1] || '0';
							if (splits[0]) {
								var path = splits[0].split(".");
								var nroute = 1;
								$.each(path,function(idx,pathnode) {
									var targetnode = UIManager._findNodeByZwID(data,pathnode);
									if (targetnode) {
										// console.log("adding link {0}-{1}".format(srcnode.zwid,targetnode.zwid));
										// if ((nroute==1)) {
											data.links.push( {
												source: srcnode,
												target: targetnode,
												linkquality: parseInt(linkquality),
												nroute: nroute,
												broken: (linkquality.slice(-1)=="x"),
												manual_route: node.manual_route
											});
											srcnode = targetnode;
											nroute++;
										// }
									}
								});
							}
						});
					}
				});
			};

			$(".altui-children-d3chart").replaceWith("<svg class='altui-children-d3chart'></svg>");
			var available_height = $(window).height() - $("#altui-pagemessage").outerHeight() - $("#altui-pagetitle").outerHeight() - $("footer").outerHeight();
			var margin = {top: 20, right: 10, bottom: 10, left: 20};
			width = $(".altui-children-d3chart-container").innerWidth() - margin.left - margin.right-30;
			height = Math.max(300,Math.min(width,available_height - margin.top - margin.bottom));

			//Set up the colour scale
			// var color = d3.scale.category20();
			var color = d3.scaleOrdinal(d3.schemeCategory20);
			var linkscale = d3.scaleSqrt().domain([0, 500]).range([80, Math.min(width,height)]);

			var svg = d3.select(".altui-children-d3chart")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				// .style("margin-left", -margin.left + "px")
				.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			//Set up the force layout
			data = _prepareDataRoutes( );
			simul = d3.forceSimulation()
				.on("tick", function () {
					// avoid asynchronous tick when the user changed the page
					// this crashed d3
						var radius = 30
						d3.selectAll("circle")
							.attr("cx", function (d) { return d.x=Math.max(radius, Math.min(width - radius, d.x));	})
							.attr("cy", function (d) { return d.y=Math.max(radius, Math.min(height - radius, d.y));; });
						d3.selectAll("text")
							.attr("x", function (d) { return d.x=Math.max(radius, Math.min(width - radius, d.x));  })
							.attr("y", function (d) { return d.y=Math.max(radius, Math.min(height - radius, d.y));; });

						d3.selectAll(".link")
							.attr("x1", function(d) { return d.source.x; })
							.attr("y1", function(d) { return d.source.y; })
							.attr("x2", function(d) { return d.target.x; })
							.attr("y2", function(d) { return d.target.y; });

				});
			// var drag = simul.drag().on("dragstart", dragstart);
			var container = document.querySelector(".altui-children-d3chart")
			var drag = d3.drag()
							.container(container)
							// .subject(dragsubject)
							.on("start", dragstarted)
							.on("drag", dragged)
							.on("end", dragended);


			// function dragsubject() {
				// return simul.find(d3.event.x - width / 2, d3.event.y - height / 2);
			// }
			function dragstarted(d) {
				if (!d3.event.active) simul.alphaTarget(0.3).restart();
				$(d3.event.sourceEvent.currentTarget).toggleClass("fixed",true)
				d3.event.subject.fx = d3.event.subject.x;
				d3.event.subject.fy = d3.event.subject.y;
			};
			function dragged() {
				d3.event.subject.fx = d3.event.x;
				d3.event.subject.fy = d3.event.y;
			}

			function dragended() {
				if (!d3.event.active) simul.alphaTarget(0);
				// d3.event.subject.fx = null;
				// d3.event.subject.fy = null;
			}

			function sglclick(d) {
				if (d3.event.defaultPrevented) return;
				// console.log('click');
				var selection = d3.select(this);
				if (d3.event.shiftKey) {
					d.fixed =  false;
					delete d.fx;
					delete d.fy;
					$(d3.event.currentTarget).toggleClass("fixed",false)
					simul.alphaTarget(0);
				}
				else {
				}
				_updateChart(data);
			};
			function _updateChart(data) {
				var width = $(".altui-children-d3chart").width();
				var height = $(".altui-children-d3chart").height();
				_updateDataRoutes(data);

				simul
					.nodes(data.nodes)
					.velocityDecay(0.2)
					.force("link",d3	.forceLink(data.links)
						.id(function(d) { return d.id; })
						// .distance( function(d) { return	/*linkscale( d.linkquality )*/	Math.min(width/3,height/3) } )
						.strength( function(d) { return	0.05 * 1/(1+d.linkquality/5) } )
						)
					.force("center", d3.forceCenter(width / 2, height / 2))
					.force("charge", d3.forceManyBody()
						.strength(function(d) { return -50 - ( (d.zwid==0) ? 100 : 0) })
						// .distanceMax( Math.min(width/2,height/2) )
						// .distanceMax(200)
						)

				var link = svg.selectAll(".link").data( data.links , function(d) { return d.source.id+'-'+d.target.id; } );
				var node = svg.selectAll(".node").data( data.nodes , function(d) { return d.id; } );

				link.exit().transition().duration(500).style("opacity","0").remove();
				link.enter()
					.insert("line", ".node")		// so that node allways hide links
					.attr("class", "link")
					.style("stroke", function(d) { return (d.broken==true) ? "red": ((d.nroute>1)?"yellow":"") ; } )
					.style("stroke-dasharray", function(d) { return (d.manual_route)  ? "10,10" : null; } )
					.style("stroke-width", 1 )
					.attr("x1", function(d) { return d.source.x; })
					.attr("y1", function(d) { return d.source.y; })
					.attr("x2", function(d) { return d.target.x; })
					.attr("y2", function(d) { return d.target.y; });

				node.exit().transition().duration(1000).style("opacity","0").remove();

				var groups = node.enter().append("g")
							.attr("class", "node")
							.on("click", sglclick )
							.call( drag );
					groups.append("circle")
						.attr("r", function(d) {
							return 6+ 2*d.routes.length;
						} )
						.style("fill", function (d) {
							return color(d._children ? "#3182bd" : d.color);
						});
					groups.append("text")
						.attr("dx", 15)
						.attr("dy", ".35em")
						.text(function (d) { return d.name; });
			};
			_updateChart(data);
		};

		// prepare and load D3 then draw the chart
		UIManager.clearPage('zWaveRoutes',_T("zWave Routes"),UIManager.oneColumnLayout);
		PageMessage.message(_T("Drag and Drop to fix the position of a node. Simple Click to open or collapse a parent node, Shift Click to free a fixed node"),"info");

		$(".altui-mainpanel").append( _createControllerSelect('altui-controller-select','col-6'));
		$("#altui-controller-select").change(function() {
			$(".altui-route-d3chart").html("");
			MultiBox.getDevices(
				null,
				function(d) {	return MultiBox.controllerOf(d.altuiid).controller==parseInt($("#altui-controller-select").val()); },
				function(arr) {
					devices = arr;
					_drawChartRoutes();
				}
			);
		});
		$(".altui-mainpanel")
			.append(
				"<style>					\
				.node {						\
					cursor: move;			\
				}							\
				.node circle {		\
					stroke: #fff;			\
					stroke-width: 1.5px;	\
				}							\
				.node.fixed circle {		\
					stroke: #f00;			\
					stroke-width: 1.5px;	\
				}							\
				.node.closed circle {		\
					stroke: white;		\
					fill: white !important;			\
				}							\
				.node.closed.fixed circle {		\
					stroke: #f00;		\
					fill: white !important;			\
				}							\
				.node text.plussign {				\
					font-size: 18px;		\
					text-anchor: middle;	\
				}							\
				.node text {				\
					fill: gray;				\
					pointer-events: none;	\
					font-size: 10px;		\
				}							\
				.link {						\
					stroke: #999;			\
					stroke-opacity: .8;		\
				}							\
				</style>" )
			.append("<div class='col-12 altui-children-d3chart-container'><svg class='altui-children-d3chart'></svg></div>")
		UIManager.loadD3Script( function() {
			MultiBox.getDevices(
				null,
				function(d) {	return MultiBox.controllerOf(d.altuiid).controller==parseInt($("#altui-controller-select").val()); },
				function(arr) {
					devices = arr;
					_drawChartRoutes();
				}
			);
		});
	},

	drawHouseMode: function ()
	{
		// http://192.168.1.5/cmh/skins/default/img/other/spritemap_640_480_preset_modes_active.png
		// http://192.168.1.5/cmh/skins/default/img/other/spritemap_640_480_preset_modes.png

		UIManager.refreshModes();

		$("div.altui-housemode3").click( function() {
			var id = $(this).prop('id');
			var mode = id.substr("altui-mode".length);
			var that = $(this)
			$(this)
				.find(".altui-housemodeglyph").addClass("text-info")
			$(this)
				.closest(".altui-favorites-device-container")
				.addClass("blur")
				.parent()
				.append("<div class='altui-housemode-countdown d-flex justify-content-center align-items-center '></div>");
			var div = $(".altui-housemode-countdown")
			$(div).html( (mode==1) ? 3 : MultiBox.getHouseModeSwitchDelay() );
			var interval = setInterval( function(div) {
				var val = parseInt( $(div).html() );
				if (val==1) {
					clearInterval(interval);
					$(div).remove()
					$(that).closest(".altui-favorites-device-container").removeClass("blur")
					UIManager.refreshModes(); // force a refresh now
				} else {
					$(div).html( val-1 );
				}
			}, 1000, div);
			MultiBox.setHouseMode(mode);
		});

	},
	pageLocalization: function() {
		UIManager.clearPage('Localize',_T("Localizations"),UIManager.oneColumnLayout);
		Localization.dump();
	},
	pageDebug: function() {
		var actions = [
			{title:_T("All devices"), id:"altui-debug-alldevices", onclick: onClickAllDevices},
			{title:_T("One Device's States"), id:"altui-debug-onedevices", onclick: onClickOneDevice},
			{title:_T("Fix Device States"), id:"altui-debug-fix-device-states", onclick: onClickFixDevice},
			{title:_T("Variable search"), id:"altui-debug-searchvariable", onclick: onClickSearchVariable},
			{title:_T("Javascript code"), id:"altui-debug-javascript", onclick: onClickJavascript}
		];

		function _getParameter(name,label,cbfunc) {
			var dialog = DialogManager.registerDialog('dialogModal',
							defaultDialogModalTemplate.format( 'dialogModal',
							_T('Command Parameters'),		// title
							"",				// body
							"modal-lg",	// size
							""	// glyph icon
						));
			var lastOne = MyLocalStorage.getSettings("LastOne_"+name) || "";
			DialogManager.dlgAddLine(dialog, name, label, lastOne,"", {required:''} );
			DialogManager.dlgAddDialogButton(dialog, true, _T("Run"));
			$('div#dialogModal').modal();
			$('div#dialogs')
				.off('submit',"div#dialogModal")
				.on( 'submit',"div#dialogModal", function() {
					$('div#dialogModal').modal('hide');
					var val = $("#altui-widget-"+name).val();
					MyLocalStorage.setSettings("LastOne_"+name,val);
					if ($.isFunction(cbfunc))
						(cbfunc)( val );
				});
		};

		function onClickJavascript() {
			_getParameter('javascriptcode', _T('Javascript code'),function(code){
				var result =_T("an error happened during the execution");
				try {
					result = eval(code);
				}
				catch(err) { }
				$("#altui-oscommand-result").text(JSON.stringify(result,null,2));
			});
		};

		function onClickSearchVariable() {
			_getParameter('varnamepattern', _T('Variable Name Pattern'),function(name){
				var result=[];
				var pattern = new RegExp(name);
				var devices = MultiBox.getDevicesSync();
				$.each(devices, function(i,device){
					var states	= $.grep( MultiBox.getStatesByAltuiID(device.altuiid),function(state) {
						return pattern.test(state.variable);
					});
					$.each(states,function(i,state) {
						result.push({device:device.altuiid, name:device.name, state:state});
					});
				});
				$("#altui-oscommand-result").text(JSON.stringify(result,null,2));
			});
		};
		function onClickFixDevice() {
			_getParameter('devaltuiid', _T('Altui ID'),function(altuiid){
				var device = MultiBox.getDeviceByAltuiID(altuiid);
				MultiBox.modifyDevice(device , function( result ) {
					$("#altui-oscommand-result").text(JSON.stringify(result,null,2));	// pretty print				} )
				});
			});
		};
		function onClickOneDevice() {
			_getParameter('devaltuiid', _T('Altui ID'),function(altuiid){
				var result = {
					altuiid: altuiid,
					device_type:MultiBox.getDeviceByAltuiID(altuiid).device_type,
					states:MultiBox.getStatesByAltuiID(altuiid),
				};
				$("#altui-oscommand-result").text(JSON.stringify(result,null,2));	// pretty print
			});
		};
		function onClickAllDevices() {
			var devices = MultiBox.getDevicesSync();
			$("#altui-oscommand-result").text(JSON.stringify(devices,null,2));
		};

		UIManager.clearPage('Debug',_T("Debug Tools"),UIManager.oneColumnLayout);
		var html = "";
		html += "<div class='col-12'>";
			html +="<div class='card xxx'>";
				html +="  <div class='card-header'>"+_T("Debug Actions")+"</div>";
				html +="  <div class='card-body'>";
					$.each(actions, function(idx,action) {
						html +="<div class='btn-group' role='group' aria-label='Debug Tools'>";
						html += "<button class='btn btn-light {1}' type='button' >{0}</button>".format(action.title,action.id);
						html += "</div>";
					});
				html += "</div>";
			html +="  </div>";
		html +="</div>";
		html += "<div class='col-12'>";
			html+="<h3>"+_T("Output")+" ";
			var glyph = glyphTemplate.format('clipboard',_T("Copy to clipboard"), '');
			html += buttonTemplate.format( 'altui-debug-clipboard', 'altui-copy-clipboard', glyph,'',_T("Copy"));
				// html += "<button class='btn btn-light altui-json-viewer' type='button' >{0}</button>".format(_T("Json Viewer"));
			html+="</h3>";
			html+="<pre id='altui-oscommand-result' class='pre-scrollable border border-secondary bg-light'> </pre>";
		html +="</div>";

		// append HTML
		$(".altui-mainpanel").append(html);
		$("#altui-debug-clipboard").click( function() {
			Altui_SelectText( "altui-oscommand-result" );
			document.execCommand('copy');
		});

		// register callbacks
		$.each(actions, function(idx,action) {
			$("."+action.id).click( action.onclick );
		});
	},
	pageTblWatches:function() {
		UIManager.clearPage('TblWatches',_T("Table Watches"),UIManager.oneColumnLayout);
		var watches = MultiBox.getWatches(
			"VariablesToWatch",	// watch type
			null);		// no filter

		var model = {
			domcontainer : $(".altui-mainpanel"),
			data : watches,
			default_viscols: [ 'service','variable'],
			cols: [
				{ name:'service', type:'string', identifier:false,	},
				{ name:'variable', type:'string', identifier:false, width:80 },
				{ name:'deviceid', type:'string', formatter:'devicename', identifier:false,	 },
				{ name:'sceneid', type:'string', formatter:'scenename', identifier:false,  },
				{ name:'value', type:'string', formatter:'devicevalue', identifier:false,  },
				// { name:'luaexpr', type:'string', identifier:false, width:120 },
				// { name:'xml', type:'string', identifier:false, width:150 }
			],
			formatters: {
				"devicename": function(column, row) {
					var device = MultiBox.getDeviceByAltuiID(row.deviceid);
					return "#{1}-{0}".format(device.name,device.altuiid);
				},
				"scenename": function(column, row) {
					var scene = MultiBox.getSceneByID(0,row.sceneid);
					return "#{1}-{0}".format(scene.name,scene.altuiid);
				},
				"devicevalue": function( column, row) {
					var device = MultiBox.getDeviceByAltuiID(row.deviceid);
					return MultiBox.getStatus( device, row.service, row.variable )
				}
			},
			commands: {
				'altui-command-edit': {
					glyph:editGlyph,
					onclick: function(grid,e,row,ident) {
						var scene = MultiBox.getSceneByID(0,row.sceneid);
						UIControler.changePage('Scene Edit',[scene.altuiid])
					}
				},
				'altui-command-delete': {
					glyph:deleteGlyph,
					onclick: function(grid,e,row,ident) {
						DialogManager.confirmDialog(_T("Are you sure you want to delete scene watch ({0})").format(ident),function(result) {
							if (result==true) {
								// return	watcha.service == watchb.service &&
								// watcha.variable == watchb.variable &&
								// watcha.deviceid == watchb.deviceid &&
								// watcha.sceneid == watchb.sceneid &&
								// watcha.luaexpr == watchb.luaexpr &&
								// watcha.xml == watchb.xml ;
								// row and watch have same structure
								MultiBox.delWatch( row );
								grid.bootgrid("remove",[ident]);
							}
						});
					}
				},
			},
		};

		UIManager.genericTableDraw('Watches','watch',model);

		watches = MultiBox.getWatches(
			"VariablesToSend",	// watch type
			null);		// no filter

		model = {
			domcontainer : $(".altui-mainpanel"),
			data : watches,
			default_viscols: [ 'service','variable','provider'],
			cols: [
				{ name:'service', type:'string', identifier:false,	},
				{ name:'variable', type:'string', identifier:false, width:80 },
				{ name:'deviceid', type:'string', formatter:'devicename', identifier:false,	 },
				{ name:'provider', type:'string', identifier:false, width:100 },
				{ name:'value', type:'string', formatter:'devicevalue', identifier:false,  },

			],
			formatters: {
				"devicename": function(column, row) {
					var device = MultiBox.getDeviceByAltuiID(row.deviceid);
					return device ? "#{1}-{0}".format(device.name,device.altuiid) : "";
				},
				"devicevalue": function( column, row) {
					var device = MultiBox.getDeviceByAltuiID(row.deviceid);
					return MultiBox.getStatus( device, row.service, row.variable )
				}
			},
			commands: {
				'altui-command-see': {
					glyph:eyeOpenGlyph,
					onclick: function(grid,e,row,ident) {
						UIControler.changePage('WatchDisplay',[e,ident])
					}
				},
				'altui-command-edit': {
					glyph:editGlyph,
					onclick: function(grid,e,row,ident) {
						var altuiid = row.deviceid;
						var device = MultiBox.getDeviceByAltuiID(altuiid);
						UIManager.deviceDrawVariables(device);
					}
				},
				'altui-command-delete': {
					glyph:deleteGlyph,
					onclick: function(grid,e,row,ident) {
						DialogManager.confirmDialog(_T("Are you sure you want to delete data push ({0})").format(ident),function(result) {
							if (result==true) {
								// return	watcha.service == watchb.service &&
								// watcha.variable == watchb.variable &&
								// watcha.deviceid == watchb.deviceid &&
								// watcha.sceneid == watchb.sceneid &&
								// watcha.luaexpr == watchb.luaexpr &&
								// watcha.xml == watchb.xml ;
								// row and watch have same structure
								MultiBox.delWatch( row );
								grid.bootgrid("remove",[ident]);
							}
						});
					}
				},
			},
		};

		UIManager.genericTableDraw('Pushes','push',model);
	},

	pageTblControllers:function() {
		var _buttons = [
			{id:"altui-ctrl-backup", glyph:"floppy-o", label:_T("Backup Controller")},
			{id:"altui-ctrl-heal", glyph:"medkit", label:_T("ZWave Heal")},
			{id:"altui-ctrl-inclusion", glyph:"plus", label:_T("ZWave Inclusion")},
			{id:"altui-ctrl-exclusion", glyph:"minus", label:_T("ZWave Exclusion")},
			{id:"altui-ctrl-support", glyph:"envelope-o", label:_T("Support Ticket")},
		];

		function _getControllerID(obj){
			var panel = $(obj).closest('.altui-controller-panel');
			var id = $(panel).prop('id').substring('altui_ctrl_'.length);
			return id;
		}

		function _displayOneControllerInfo(ctrl) {
			var box_info = ctrl.controller.getBoxFullInfo()
			$.each(box_info, function(k,v) {
				box_info[k]= HTMLUtils.enhanceValue(v);
			});
			var html ="";
			html += "<div class='altui-ctrl-tools'>{0}</div>".format(HTMLUtils.drawToolbar( 'altui-workflow-toolbar', _buttons ));
			var bCorsEnabled = ctrl.controller.candoCORS()
			var sCorsLabel = bCorsEnabled ? _T("Disable") : _T("Enable")
			var bHeal = ctrl.controller.enableNightlyHeal()
			var sHeal = bHeal ? _T("Disable") : _T("Enable")
			var capabilities = [
				{ 	name: "Enable Nightly Heal",
					value: bHeal,
					command: HTMLUtils.drawButton('altui-toggleNightlyHeal','',sHeal,'btn-sm btn-light',sHeal,'cog')
				 },
				{ name: "Can Do CORS", value: bCorsEnabled, command: HTMLUtils.drawButton('altui-togglecors','',sCorsLabel,'btn-sm btn-light',sCorsLabel,'cog') },
				{ name: "Can Do http POST", value: ctrl.controller.candoPost() },
				{ name: "Is Open Luup", value: ctrl.controller.isOpenLuup() },
				{ name: "Is UI5", value: ctrl.controller.isUI5() },
			];
			html +=	 HTMLUtils.array2Table(capabilities,null,[],_T("Info"),null,'altui-controller-info');//"<pre class='pre-scrollable'>{0}</pre>".format( JSON.stringify(box_info,null,2) )
			html +=	 HTMLUtils.array2Table(_buildArrayFromParams(box_info),null,[],_T("Details"),null,'altui-controller-params');//"<pre class='pre-scrollable'>{0}</pre>".format( JSON.stringify(box_info,null,2) )
			return html;
		};

		function _displayControllersHTML(_displayControllerInfo) {
			var html = "<div id='altui-controllers-info' class='col-12'>";
			html += "	 <ul class='nav nav-tabs' role='tablist'>";
			var controllers = MultiBox.getControllers();
			var bFirst = true;
			$.each(controllers, function (idx, controller) {
				var name = controller.name || controller.ip;
				html += "	   <li role='presentation' class='nav-item'><a class='nav-link {2}' href='#altui_ctrl_{0}' aria-controls='home' role='tab' data-toggle='tab'>{1}</a></li>".format(idx, name, (bFirst == true ? 'active' : ''));
				bFirst = false;
			});
			html += "	 </ul>";
			html += "	 <div class='tab-content'>";
			bFirst = true;
			$.each(controllers, function (idx, controller) {
				var name = (controller.ip == "") ? "Main" : controller.ip;
				html += "	   <div role='tabpanel' class='altui-controller-panel tab-pane {2}' id='altui_ctrl_{0}'>{1}</div>".format(idx, _displayOneControllerInfo(controller), (bFirst == true ? 'active' : ''));
				bFirst = false;
			});
			html += "	 </div>";
			html += "</div>";
			return html;
		}

		UIManager.clearPage('TblControllers',_T("Table Controllers"),UIManager.oneColumnLayout);
		var html = _displayControllersHTML();
		$(".altui-mainpanel").append( html );

		// interactivity
		$("#altui-controllers-info").off("click")
			.on("click","#altui-toggleNightlyHeal",function() {
				var id = _getControllerID( $(this) );
				var bCurrent = MultiBox.enableNightlyHeal(id);
				var controllers = MultiBox.getControllers();
				MultiBox.enableNightlyHeal( id, ! bCurrent, function() {
					$("#altui_ctrl_"+id).html( _displayOneControllerInfo(controllers[id]) )
				})
			})
			.on("click","#altui-togglecors",function() {
				var id = _getControllerID( $(this) );
				var bCurrent = MultiBox.candoCORS(id);
				var controllers = MultiBox.getControllers();
				MultiBox.enableCORS( id, ! bCurrent, function() {
					$("#altui_ctrl_"+id).html( _displayOneControllerInfo(controllers[id]) )
				})
			});
		$("#altui-ctrl-support").click(function() {
			window.open( "https://support.getvera.com/hc/en-us/requests/new", '_blank');
		});
		$("#altui-ctrl-backup").click(function() {
			var id = _getControllerID( $(this) );
			MultiBox.RequestBackup( id, function(data) {
				PageMessage.message(_T("Backup competed"));
			});
		});
		$("#altui-ctrl-heal").click(function() {
			var id = _getControllerID( $(this) );
			var zwavenet = MultiBox.getDeviceByType(id,"urn:schemas-micasaverde-com:device:ZWaveNetwork:1");
			if (zwavenet!=null) {
				DialogManager.confirmDialog(_T("Are you sure you want to heal your zwave network"),function(result) {
					if (result==true) {
						// local URN  = "urn:micasaverde-com:serviceId:ZWaveNetwork1"
						// local ACT  = "HealNetwork"
						// local BATT = {BatteryMinutes=30}	 -- Default 30. Nightly 60.
						// local ITR  = {StressCycles=2}	 -- Default probably ample.
						// local START= {StartStage=1}
						// local STOP = {StopStage=3}		 -- Default 7. UI7.10 or greater probably needs to go no further than 3.
						// luup.call_action(URN, ACT, BATT, ITR, START, STOP)
						MultiBox.runAction( zwavenet, "urn:micasaverde-com:serviceId:ZWaveNetwork1", "HealNetwork", {
							BatteryMinutes:30,
							StressCycles:2,
							StartStage:1,
							StopStage:3
						}, function(result) {
							alert(result);
						});
					}
				});
			}
		});
		$("#altui-ctrl-inclusion").click( function() {
			var id = _getControllerID( $(this) );
			var zwavenet = MultiBox.getDeviceByType(id,"urn:schemas-micasaverde-com:device:ZWaveNetwork:1");
			if (zwavenet!=null) {
				DialogManager.confirmDialog(_T("Are you sure you want to enter Inclusion mode"),function(result) {
					if (result==true) {
						MultiBox.runAction( zwavenet, "urn:micasaverde-com:serviceId:ZWaveNetwork1", "AddNodes", {
							InclusionMode:'LowPower',
							NodeType:1,
							Timeout:120,
							Multiple:1,
							ControllerShift:0,
							Reload:0
						}, function(result) {
							alert(result);
						});
					}
				});
			}
		});
		$("#altui-ctrl-exclusion").click( function() {
			var id = _getControllerID( $(this) );
			var zwavenet = MultiBox.getDeviceByType(id,"urn:schemas-micasaverde-com:device:ZWaveNetwork:1");
			if (zwavenet!=null) {
				DialogManager.confirmDialog(_T("Are you sure you want to enter Exclusion mode"),function(result) {
					if (result==true) {
						MultiBox.runAction( zwavenet, "urn:micasaverde-com:serviceId:ZWaveNetwork1", "RemoveNodes", {
							InclusionMode:'LowPower',
							NodeType:1,
							Timeout:120,
							Multiple:1,
							Reload:0
						}, function(result) {
							alert(result);
						});
					}
				});
			}
		});
	},
	pageTblScenes: function() {
		UIManager.clearPage('TblScenes',_T("Table Scenes"),UIManager.oneColumnLayout);
		MultiBox.getScenes(null, null, function (scenes) {
			var model = {
				domcontainer : $(".altui-mainpanel"),
				data : scenes,
				default_viscols: [ 'id','name','last_run'],
				cols: [
					{ name:'id', type:'numeric', identifier:false, width:50 },
					{ name:'altuiid', type:'string', identifier:true, width:80 },
					{ name:'name', type:'string', identifier:false, width:150 },
					{ name:'last_run', type:'numeric', formatter:'HTMLUtils.enhanceValue', identifier:false, width:150 },
					{ name:'next_run', type:'numeric', computer:'next_run',	 formatter:'HTMLUtils.enhanceValue', identifier:false, width:150 },
					{ name:'triggers', type:'numeric', computer:'triggers', identifier:false, width:80 },
					{ name:'watches', type:'numeric', computer:'watches', identifier:false, width:80 },
					{ name:'timers', type:'numeric', computer:'timers', identifier:false, width:80 },
				],
				formatters: {
					"HTMLUtils.enhanceValue": function(column, row) {
						return HTMLUtils.enhanceValue(row[column.id]);
					},
				},
				computers: {
					"next_run": function(row) {
						var scene = MultiBox.getSceneByAltuiID(row.altuiid);
						var next_run = _findSceneNextRun(scene);
						return (next_run==0) ? '' : next_run;
					},
					"triggers": function(row) {
						var scene = MultiBox.getSceneByAltuiID(row.altuiid);
						return scene.triggers ? scene.triggers.length : 0;
					},
					"watches": function(row) {
						var scene = MultiBox.getSceneByAltuiID(row.altuiid);
						return WatchManager.countWatchForScene(scene);
					},
					"timers": function(row) {
						var scene = MultiBox.getSceneByAltuiID(row.altuiid);
						return scene.timers ? scene.timers.length : 0
					},
				},
				commands: {
					'altui-command-edit': {
						glyph:editGlyph,
						onclick: function(grid,e,row,ident) {
							UIControler.changePage('Scene Edit',[ident])
						}
					},
					'altui-command-delete': {
						glyph:deleteGlyph,
						onclick: function(grid,e,row,ident) {
							var scene = MultiBox.getSceneByAltuiID(ident);
							DialogManager.confirmDialog(_T("Are you sure you want to delete scene ({0})").format(ident),function(result) {
								if (result==true) {
									MultiBox.deleteScene( scene );
									grid.bootgrid("remove", [scene.altuiid]);
								}
							});
						}
					},
				},
			};

			UIManager.genericTableDraw('Scenes','scene',model);
		});
	},
	// pageTriggers2: function()
	// {
		// UIManager.clearPage('Triggers'),_T('Triggers',UIManager.oneColumnLayout);
		// $(".altui-mainpanel").empty();
		// var bFirst=true;
		// var bBody=false;
		// var arr = [];
		// MultiBox.getScenes( null , function(s) {return s.triggers!=null}, function(scenes) {
			// $.each(scenes, function(idx,scene) {
				// var controller = MultiBox.controllerOf(scene.altuiid).controller;
				// var triggers = $.grep(scene.triggers,function(t) { return t.last_run!=undefined});
				// $.each(triggers, function(idx,trigger) {
					// var triggerinfo = _formatTrigger(controller,trigger);
					// arr.push( {
						// lastrun: triggerinfo.lastrun,
						// scene: scene.name,
						// trigger: triggerinfo.name,
						// device: triggerinfo.device,
						// condition: "{0} {1}".format(triggerinfo.descr,triggerinfo.condition),
						// id: scene.altuiid+"-"+idx,
						// lua : trigger.lua || ""
					// })
				// });
				// var sceneWatches = WatchManager.getSceneWatches(scene);
				// if (sceneWatches) {
					// $.each(sceneWatches,function(idx,w){
						// var device = MultiBox.getDeviceByAltuiID(w.deviceid);
						// arr.push( {
							// lastrun: scene.last_run ? _toIso(new Date(scene.last_run*1000)," ") : "",
							// scene: scene.name,
							// trigger: w.service,
							// device: device.name,
							// condition: 'watch '+w.variable,
							// id: scene.altuiid+"-"+idx,
							// lua : w.luaexpr
						// })
					// });
				// }
			// });
		// })

		// var viscols = MyLocalStorage.getSettings("TriggersVisibleCols") || [];
		// if (viscols.length==0)
			// viscols = [ 'lastrun','scene','trigger','device','condition','id','lua'];
		// var options = (MyLocalStorage.getSettings('ShowAllRows')==1) ? {rowCount:-1	} : {};

		// $(".altui-mainpanel").append( HTMLUtils.array2Table(arr,'id',viscols) );
		// $("#altui-grid").bootgrid(
			// $.extend({
				// caseSensitive: false,
				// statusMapping: {}
			// },options)
		// ).bootgrid("sort",{
			// lastrun:"desc"
		// })
		// .on("loaded.rs.jquery.bootgrid", function (e) {
			// var settings = $("#altui-grid").bootgrid("getColumnSettings");
			// viscols = $.map($.grep(settings, function (obj) { return obj.visible == true }),function(obj){ return obj.id;});
			// MyLocalStorage.setSettings("TriggersVisibleCols",viscols);
			// /* your code goes here */
		// });
	// },

	pageTriggers: function()
	{
		UIManager.clearPage('Triggers',_T('Triggers'),UIManager.oneColumnLayout);
		$(".altui-mainpanel").empty();
		var arr = [];
		MultiBox.getScenes( null , function(s) {return s.triggers!=null}, function(scenes) {
			$.each(scenes, function(idx,scene) {
				var controller = MultiBox.controllerOf(scene.altuiid).controller;
				var triggers = $.grep(scene.triggers,function(t) { return t.last_run!=undefined});
				$.each(triggers, function(idx,trigger) {
					var triggerinfo = _formatTrigger(controller,trigger);
					arr.push( {
						lastrun: triggerinfo.lastrun,
						scene: scene.name,
						trigger: triggerinfo.name,
						device: triggerinfo.device,
						condition: "{0} {1}".format(triggerinfo.descr,triggerinfo.condition),
						id: scene.altuiid+"-"+idx,
						lua : trigger.lua || ""
					})
				});
				var sceneWatches = WatchManager.getSceneWatches(scene);
				if (sceneWatches) {
					$.each(sceneWatches,function(idx,w){
						var device = MultiBox.getDeviceByAltuiID(w.deviceid);
						arr.push( {
							lastrun: scene.last_run ? _toIso(new Date(scene.last_run*1000)," ") : "",
							scene: scene.name,
							trigger: w.service,
							device: device.name,
							condition: 'watch '+w.variable,
							id: scene.altuiid+"-"+idx,
							lua : w.luaexpr
						})
					});
				}
			});
		})
		var model = {
			domcontainer : $(".altui-mainpanel"),
			data : arr,
			default_viscols: [ 'lastun','scene','trigger','device','condition','id'],
			cols: [
				{ name:'id', type:'string', identifier:false, width:50 },
				{ name:'lastrun', type:'string', formatter:'HTMLUtils.enhanceValue', identifier:false, width:90 },
				{ name:'scene', type:'string', identifier:true, width:100 },
				{ name:'trigger', type:'string', identifier:false, width:90 },
				{ name:'device', type:'string', identifier:false, width:140 },
				{ name:'condition', type:'string', identifier:false, width:240 },
				{ name:'lua', type:'string', identifier:false, width:120 }
			],
			formatters: {
				"HTMLUtils.enhanceValue": function(column, row) {
					return HTMLUtils.enhanceValue(row[column.id]);
				},
			},
			// computers: {
			// },
			// commands: {
			// },
		};
		UIManager.genericTableDraw('Triggers','triggers',model);
	},
	genericTableDraw : function(type,htmlid,model) {
		model.data = cloneObject(model.data );
		if (model.data.length==0)
			return;
		model.cols = model.cols || [];
		var obj = model.data[0];
		var viscols = MyLocalStorage.getSettings(type+"VisibleCols") || [];
		if (viscols.length==0)
			viscols = model.default_viscols

		var identifier = $.grep( model.cols , function(col) { return (col.identifier==true) } );
		var id_specified = (identifier.length>=1);
		if (id_specified==true) {
			identifier = identifier[0].name;
		}
		else {
			model.cols.splice(0, 0, { name:'#', visible:true, type:'numeric', identifier:true, width:35 }) ,
			viscols.push('#');
			$.each(model.data, function(idx, obj) {
				obj['#']=idx;
			});
			identifier = "#";
		}
		$.each(model.cols, function(key,value) {
			value.visible = ($.inArray(value.name,viscols)!=-1);
		});

		$.each( Object.keys(obj), function (idx,key) {
			if ( !$.isArray(obj[key]) && !$.isPlainObject(obj[key]) && (key!='dirty') ) {
				if ($.inArray(key, $.map(model.cols,function(o) { return o.name } ))==-1)
					model.cols.push( { name:key, visible: ($.inArray(key,viscols)!=-1) } );
			}
		});
		var html = "";
		html+="<div class='col-12'>";
		html+=("<table id='"+htmlid+"' class='altui-grid table table-responsive-OFF table-sm table-hover table-striped'>");
		html+="	   <thead>";
		html+="	   <tr>";

		$.each(model.cols, function(idx,col) {
			html += "<th data-column-id='{0}' data-type='{1}' {2} {3} {4} {5}>{0}</th>".format(
				col.name,
				col.type,
				col.identifier ? "data-identifier='true'" : "",
				col.width ? "data-width='{0}'".format(col.width) : "",
				"data-visible='{0}'".format(col.visible),
				col.formatter ? ("data-formatter='{0}'".format(col.formatter) ) : ''
				);
		});
		if (model.commands)		{ // commands
			html += "<th data-column-id='commands' data-formatter='commands' data-sortable='false'>Commands</th>";
			model.formatters = $.extend( {
				"commands": function(column, row)
					{
						var cmds="";
						$.each(model.commands, function(key,cmd) {
							cmds += "<button type=\"button\" class=\"btn btn-sm btn-light {0}\" data-row-id=\"{2}\">{1}</button>".format(
								key,
								cmd.glyph,
								row[identifier]
							);
						});
						return cmds;
					},
				},
				model.formatters
			);
		}
		html+="	   </tr>";
		html+="	   </thead>";
		html+="	   <tbody>";
		$.each(model.data, function(idx, obj) {
			html+="	   <tr>";
			$.each(model.cols, function(i,col) {
				var value = (col.computer && $.isFunction(model.computers[col.computer])) ? model.computers[col.computer](obj) : (obj[col.name] || '')
				html += "<td>{0}</td>".format( value );
			});
			if (model.commands)
				html += "<td></td>";	// commands
			html+="	   </tr>";
		});
		html+="	   </tbody>";
		html+="</table>";
		html+="</div>";
		html+="<div id='altui-aftertable-"+htmlid+"' class='col-12'>";
		html+="</div>";

		(model.domcontainer).append( html );

		var options = (MyLocalStorage.getSettings('ShowAllRows')==1) ? {rowCount:-1	} : {};

		var id = htmlid;
		var grid = $("#"+htmlid).bootgrid(
			$.extend({
				caseSensitive: false,
				statusMapping: {},
				formatters: model.formatters || {},
				// fix for bootstrap 4 new classes
				templates: {
					icon: '<i class="{{css.icon}} {{ctx.iconCss}}"></i>',
					actionDropDown: "<div class=\"{{css.dropDownMenu}}\"><button class=\"btn btn-default dropdown-toggle\" type=\"button\" data-toggle=\"dropdown\"><span class=\"{{css.dropDownMenuText}}\">{{ctx.content}}</span> <span class=\"caret\"></span></button><ul class=\"{{css.dropDownMenuItems}}\" role=\"menu\"></ul></div>",
					actionDropDownItem: "<li><a data-action=\"{{ctx.action}}\" class=\"{{css.dropDownItem}} {{css.dropDownItemButton}}\">{{ctx.text}}</a></li>",
					paginationItem: "<li class=\"page-item {{ctx.css}}\"><a data-page=\"{{ctx.page}}\" class=\"page-link {{css.paginationButton}}\">{{ctx.text}}</a></li>",
					search: "<div class=\"{{css.search}}\"><div class=\"input-group\"><div class=\"input-group-prepend\"><span class=\"{{css.icon}} input-group-text {{css.iconSearch}}\"></span> </div><input type=\"text\" class=\"{{css.searchField}}\" placeholder=\"{{lbl.search}}\" /></div></div>",
				},
				css: {
					icon: "icon fa",
					iconColumns: "fa-table",
					iconDown: "fa-chevron-down",
					iconRefresh: "fa-refresh",
					iconSearch: "fa-search",
					iconUp: "fa-chevron-up",
				}
			},options)
		).on("click.rs.jquery.bootgrid", function(e,columns,row) {
			if (row) {	// click on header does not generate a row
				var dialog = DialogManager.createPropertyDialog(type);
				var model = $.map( Object.keys(row), function(key) {
					return { id:key, label:key, value:row[key], type:"pre", /*opt:{disabled:""}*/ };
				});
				var html = HTMLUtils.drawFormFields(model);
				DialogManager.dlgAddHtml( dialog,html );
				$('div#dialogModal').modal();
			}
		})
		.on("loaded.rs.jquery.bootgrid", function (e){
			var settings = $("#"+htmlid).bootgrid("getColumnSettings");
			viscols = $.map($.grep(settings, function (obj) { return obj.visible == true }),function(obj){ return obj.id;});
			MyLocalStorage.setSettings(type+"VisibleCols",viscols);

			var sortDict = $("#"+htmlid).bootgrid("getSortDictionary");
			MyLocalStorage.setSettings(type+'SortDictionary',sortDict);

			/* your code goes here */
			if (model.commands) {
				$.each(model.commands, function(cmd,descr) {
					grid.find("."+cmd).on('click',function(e){
						e.stopPropagation();
						if ($.isFunction(descr.onclick)) {
							var ident = $(this).data("row-id")
							var rows = $("#"+htmlid).bootgrid("getCurrentRows");
							var row = $.grep(rows, function(row) { return (row[identifier]==ident) })[0];
							(descr.onclick).bind($(this),grid,e,row,ident)();		// bind this then call
						}
					});
				});
			}
		})

		var sortDict = MyLocalStorage.getSettings(type+'SortDictionary')
		$("#"+htmlid).bootgrid("sort",sortDict || {});

		// Add CSV export button
		var glyph = glyphTemplate.format('save',_T("Copy to clipboard"), '');
		var csvButtonHtml = buttonTemplate.format( 'altui-grid-btn-'+htmlid, 'altui-tbl2csv', glyph,'d');
		$('#'+htmlid+'-header').find('.actions.btn-group').append(csvButtonHtml);
		$("#altui-grid-btn-"+htmlid).click( function() {
			if ($('#altui-aftertable-'+htmlid).find('form').length==0) {
				var data = $("#"+htmlid).table2CSV({
					delivery:'direct'
				});
				$(".altui-mainpanel").append("<pre id='altui-temp-txt'>{0}</pre>".format(data));
				Altui_SelectText( "altui-temp-txt" );
				document.execCommand('copy');
				$("#altui-temp-txt").remove();
				PageMessage.message( _T("Data copied in clipboard"), "info");
			}
		});
	},

	pageTblDevices : function() {
		UIManager.clearPage('TblDevices',_T("Table Devices"),UIManager.oneColumnLayout);

		MultiBox.getDevices(
			null,	// per device callback not useful here
			null,	// no filter
			function (devices) {	// all devices are enumarated

				var model = {
					domcontainer : $(".altui-mainpanel"),
					data : devices,
					default_viscols: [ 'id','name','manufacturer'],
					cols: [
						{ name:'id', type:'numeric', identifier:false, width:50 },
						{ name:'altuiid', type:'string', identifier:true, width:80 },
						{ name:'altid', type:'string', identifier:false, width:90 },
						{ name:'id_parent', type:'numeric', identifier:false, width:80 },
						{ name:'manufacturer', type:'string', identifier:false, width:120 },
						{ name:'model', type:'string', identifier:false, width:150 },
						{ name:'name', type:'string', identifier:false, width:150 },
						{ name:'time_created', type:'numeric', formatter:'enhancer', identifier:false, width:150 }
					],
					formatters: {
						"enhancer": function(column, row) {
							return HTMLUtils.enhanceValue(row[column.id]);
						},
					},
					commands: {
						'altui-command-edit': {
							glyph:editGlyph,
							onclick: function(grid,e,row,ident) {
								UIControler.changePage('Control Panel',[ident])
							}
						},
						'altui-command-delete': {
							glyph:deleteGlyph,
							onclick: function(grid,e,row,ident) {
								var device = MultiBox.getDeviceByAltuiID(ident);
								if (device.donotdelete==true)
									return;
								DialogManager.confirmDialog(_T("Are you sure you want to delete device ({0})").format(ident+":"+device.name),function(result) {
									if (result==true) {
										MultiBox.deleteDevice(device);
										grid.bootgrid("remove",[ident]);
									}
								});
							}
						},
					},
				};

				UIManager.genericTableDraw('Devices','dev',model);
			}
		);
	},
	// optional idx in watches VariablesToSend
	pageWatchDisplay: function( event, watchidx ) {
		var ORDER = " "
		var WATCH_ID = "{0}/{1}/{2}/{3}"
		var active_page = null;
		var pages = null;
		var watches = null;
		var providers = null;
		var save_needed = false;
		var mapID2Watch = {};
		var sortable_options = {
			// containment: "parent",
			handle: ".card-title",
			cursor: "move",
			forceHelperSize: true,
			forcePlaceholderSize: true,
			helper: "original",
			items: ".altui-graph-card",
			delay: 150,
			distance: 5,
			opacity: 0.5,
			revert: true,
			tolerance: "pointer",
			stop: function(ui,event) {
				save_needed=true;
				$("#altui-watchpage-save").removeClass('btn-success').addClass('btn-danger')
			}
		};
		var sortable_options_toolbar = {
			cursor: "move",
			containment: "parent",
			forceHelperSize: true,
			forcePlaceholderSize: true,
			helper: "original",
			items: "a.altui-watchpage-page",
			cancel: "button",
			delay: 150,
			distance: 5,
			opacity: 0.5,
			revert: true,
			tolerance: "pointer",
			stop:function(ui,event) {
				save_needed=true;
				$("#altui-watchpage-save").removeClass('btn-success').addClass('btn-danger')
			}
		};
		function isWatchInPage( id , page ) {
			var result = false;
			$.each(page.watches, function( idx, widx) {
				if (id == widx) {
					result = true;
					return false
				}
				// var w = mapID2Watch[widx]
				// if ((w.deviceid == watch.deviceid) && (w.variable==watch.variable) && (w.service==watch.service) && (w.provider==watch.provider)) {
					// result = true;
					// return false;
				// }
			})
			return result;
		};
		function isValidPage( page ) {
			return ( page.id && (page.id != " " ))
		};

		function _calculateLastPageID(pages) {
			var max = 0;
			$.each(pages, function(key,page) {
				if (isValidPage(page))
					max = Math.max( max, parseInt(page.id.substring( "altui-watchpage-page".length )));
			})
			return max
		};
		function _buildWatchUrl(watch,provider) {
			if (provider) {
				var url_param_idx = -1;
				$.each(provider.parameters, function(idx,p) {
					if (p.key=='graphicurl') {
						url_param_idx = idx;
						return false;
					}
				});
				if (url_param_idx>=0) {
					var value = watch.params[url_param_idx] || provider.parameters[url_param_idx].default || '';
					return {
						url:String.prototype.format.apply(value,watch.params),
						height:provider.parameters[url_param_idx].ifheight
					}
				}
			}
			return {
				url:NO_URL,
				height:null
			}
		};

		function _getWatchGraphHtml(entry) {
			var html = ""
			var watch = mapID2Watch[ entry.id ]
			if (entry.url && entry.url!=NO_URL) {
				var style = (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) ? "overflow-y: scroll;" : ""
				html += "<div class='iframe-wrapper' style='{0}'>".format(style)
				html += "<iframe  id='altui-iframe-chart-{2}' class='altui-thingspeak-chart' data-watchidx='{1}'	width='100%' height='{3}' style='border: 1px solid #cccccc;' src='{0}' ></iframe>".format(entry.url,entry.id,entry.id,entry.height);
				html += "</div>"
			} else {
				html +="<p>{0}: {1}</p>".format(watch.provider,_T("No Graphic Url available"))
			}
			return html
		};

		function _getWatchPillsHtml(model) {
			return HTMLUtils.drawToolbar('altui-watch-toolbar',model,'col-12');
		};

		function _getWatchListHtml(model,pageidx) {
			var card_template = `
				<div class="altui-graph-card card col-sm-6 col-xl-4" data-watchidx="{1}">
				  <div class="card-body">
					<h6 class="card-title">{0}<button type="button" id="closeidx_{1}" class="altui-graph-card-close close float-right" aria-label="Close"><span aria-hidden="true">&times;</span></button></h6>
					<small><p class="card-subtitle mb-2 text-muted">{3}{4}</p></small>
					<div class="altui-graph-content">{2}</div>
				  </div>
				</div>
			`
			// var refresh_template = '<button class="btn btn-secondary {0}" id="watchidx_{1}">{2}</button>'
			var refresh_template = '<button class="altui-graph-refresh pull-right" id="watchidx_{0}">'+refreshGlyph+'</button>'
			var editbtn = '<button class="altui-graph-edit float-right">{0}</button>'.format(editGlyph)
			var panels=[];
			if (model.watches.length==0) {
				panels.push( card_template.format(
					_T("No data to display"),
					0, //btn id
					_T("Use Edit button above to set the graphic page parameters"), // body
					"",		// subtitle
					""
				))
			} else {
				// var arr = []
				// if ( model.order ) {
					// $.each(model.order, function(idx,elem) {
						// if (model.watches[elem])
							// arr.push(model.watches[elem])
					// })
				// } else {
					// arr = model.watches
				// }
				$.each(model.watches, function(idx,entry) {
					var watch = mapID2Watch[entry.id]
					if (entry.url && entry.url!=NO_URL) {
						var refreshbtn = refresh_template.format(entry.id);
						panels.push( card_template.format(
							"<span>{0} - {1}</span>".format(entry.devicename,watch.variable),
							entry.id, //btn id
							_getWatchGraphHtml(entry), // body
							watch.service,		// subtitle
							refreshbtn + editbtn
						))
					}
				})
			}
			var html = "<div data-pageidx='{1}' class='col-12 altui-graph-row'><div class='row'>{0}</div></div>"
			return html.format(panels.join(" "),pageidx) ;
		};

		function _prepareToolbarModel(active_page,pages) {
			var model_pills = [];
			var order = ( pages[ORDER] && pages[ORDER].order  ) ?  pages[ORDER].order : Object.keys(pages)
			$.each(order,function(i,idx) {
				var page = pages[idx]
				if (isValidPage(page))	// special case to store the order
					model_pills.push({type: 'a', id:page.id, label:page.name, glyph:"area-chart", cls:'btn-light altui-watchpage-page {0}'.format( (idx==active_page) ? 'active' : '')})
			})
			model_pills.push({id:'altui-watchpage-edit', label:_T("Edit"), glyph:"pencil", cls:"btn-secondary"})
			model_pills.push({id:'altui-watchpage-add', label:_T("Add"), glyph:"plus", cls:"btn-secondary"})
			model_pills.push({id:'altui-watchpage-del', label:_T("Delete"), glyph:"trash-o", cls:"btn-secondary"})
			model_pills.push({id:'altui-watchpage-save', label:_T("Save"), glyph:"floppy-o", cls:"btn-primary {0}".format(save_needed==true ? 'btn-danger' : 'btn-success')})
			return model_pills
		};

		function _prepareWatchListModel(page) {
			var model_watchlist={ watches:[] };
			var todelete = []
			if (page.watches) {
				for (var i = page.watches.length -1 ; i>=0 ; i--) {
					var watchid = page.watches[i]
					var watch = mapID2Watch[watchid]
					if (watch) {
						var device = MultiBox.getDeviceByAltuiID(watch.deviceid);
						if (device && providers[watch.provider] ) {
							var urlinfo = _buildWatchUrl(watch,providers[watch.provider]);
							model_watchlist.watches.push( {
								id: watchid,
								// watch: watch,
								devicename: device.name,
								url:urlinfo.url,
								height:urlinfo.height || 260
							})
						}
					} else {
						// watch must have been deleted
						page.watches.splice(i, 1);
					}
				}
				model_watchlist.watches = model_watchlist.watches.reverse()
			}
			return model_watchlist
		};

		function _refreshWatchPills(active_page,bRedraw){
			var model = _prepareToolbarModel(active_page,pages);
			var html = _getWatchPillsHtml(model)
			if (bRedraw==true)
				$(".altui-watch-toolbar").remove()

			if ($(".altui-watch-toolbar").length==0) {
				$(".altui-mainpanel").prepend( html );
				$(".altui-watch-toolbar > div").sortable( sortable_options_toolbar )
			} else {
				$(".altui-watch-toolbar").replaceWith(  html );
			}
		}

		function _refreshWatchList(active_page,bRedraw) {
			var model_watchlist = _prepareWatchListModel(pages[active_page])
			if (bRedraw==true)
				$(".altui-graph-row[data-pageidx='"+active_page+"']").remove()

			if ($(".altui-graph-row[data-pageidx='"+active_page+"']").length==0) {
				$(".altui-mainpanel").append( _getWatchListHtml(model_watchlist,active_page) );
				$('.altui-graph-row .row').sortable( sortable_options );
			}
			$(".altui-graph-row[data-pageidx!='"+active_page+"']").hide()
			$(".altui-graph-row[data-pageidx='"+active_page+"']").show()
		}

		function _interactivity() {
			function sortByDevice(a,b) {
				var devicea = MultiBox.getDeviceByAltuiID(a.deviceid)
				var deviceb = MultiBox.getDeviceByAltuiID(b.deviceid)
				if (devicea.name == deviceb.name)
					return 0
				return (devicea.name < deviceb.name) ? -1 : 1
			}

			$(".altui-mainpanel")
			.off('click','.altui-graph-refresh')
			.on('click','.altui-graph-refresh',function() {
				var panel = $(this).closest(".altui-graph-card")
				var watchid = $(this).prop('id').substr("watchidx_".length);
				var page = pages[active_page];
				var watch = mapID2Watch[ watchid ]
				var device = MultiBox.getDeviceByAltuiID(watch.deviceid)
				var urlinfo = _buildWatchUrl(watch,providers[watch.provider]);
				$(panel).find(".altui-graph-content").html( _getWatchGraphHtml({
							// watch: watch,
							devicename: device.name,
							url:urlinfo.url,
							height:urlinfo.height || 260
						}) )
			})
			.off('click','.altui-graph-card-close')
			.on('click','.altui-graph-card-close',function() {
				var watchid = $(this).prop('id').substr("closeidx_".length);
				var panel = $(this).closest(".altui-graph-card")
				var page = pages[active_page];
				$(panel).remove()
				DialogManager.confirmDialog(_T("Do you ALSO want to delete the data push configuration for this variable"),function(result) {
					if (result==true) {
						var watch = mapID2Watch[ watchid ]
						MultiBox.delWatch( watch );
						delete mapID2Watch[ watchid ]
					}

					// remove watchid from array
					page.watches = $.grep( page.watches, function(value) { return value != watchid  });
					save_needed = true;
					_refreshWatchPills(active_page,true)
					_refreshWatchList(active_page)
				})
			})
			.off('click','.altui-watchpage-page')
			.on('click','.altui-watchpage-page',function() {
				active_page = $(this).prop('id');
				$('.altui-watchpage-page').removeClass('active')
				$(this).addClass('active')
				_refreshWatchList(active_page)
			})
			.off('click','.altui-graph-edit')
			.on('click','.altui-graph-edit',function() {
				var card = $(this).closest('.altui-graph-card')
				var watchid = card.data('watchidx')
				var page = pages[active_page];
				var watch = mapID2Watch[ watchid ]
				var device = MultiBox.getDeviceByAltuiID( watch.deviceid );
				$.when(UIManager.deviceDrawVariables(device))
				.done(function(txt) {
					$.when( _initGraphPage(active_page) ).done(function (active_page) {
						// Display Page's Watches
						_refreshWatchPills(active_page,true)
						_refreshWatchList(active_page,true)
					})
				})
			})
			.off('click','#altui-watchpage-edit')
			.on('click','#altui-watchpage-edit',function() {
				var page = pages[active_page]
				var model = [
					{ id:'name',		label:_T('Name'),			type:"input",	value:page['name'], pattern:"[^_]+", placeholder:'enter name' , opt:{required:true}, invalidfeedback:_T('Please provide a name without a _ character') },
					// { id:'background',	label:'CSS Background',		type:"input",	value:page['background'], placeholder:'enter css string' , helptext:'any css3 valid background property'},
				];
				var html = HTMLUtils.drawFormFields(  model );
				model = []
				var arrwatch = $.map(mapID2Watch,function(val,key) { return val })
				$.each(arrwatch.sort(sortByDevice), function(key,watch) {
					var id = WATCH_ID.format(watch.provider, watch.deviceid, watch.service, watch.variable)
					var device = MultiBox.getDeviceByAltuiID(watch.deviceid)
					if (device) {
						var urlinfo = _buildWatchUrl(watch,providers[watch.provider])
						if (urlinfo && urlinfo.url && urlinfo.url!=NO_URL) {
							model.push({
								id:'watch_'+id,
								label:"<b>{0}</b> <small>({1})</small> <b>{2}</b> <small>({3})</small>".format(device.name, watch.deviceid, watch.variable, watch.service),
								type:'input',
								inputtype:'checkbox',
								value: isWatchInPage( id, page )
							})
						}
					}
				})
				html += "<div id='watches' class='form-group'>{0}</div>".format( HTMLUtils.drawFormFields(  model ) )
				var dialog = DialogManager.registerDialog('dialogModal', defaultDialogModalTemplate.format( 'dialogModal', 'Page Properties', html, 'modal-lg',''))
				DialogManager.dlgAddCheck(dialog,'CheckAll',false,_T("Check /Uncheck all"));
				DialogManager.dlgAddDialogButton(dialog, true, _T("Save Changes"));
				$('div#dialogModal').modal();
				$("div#dialogModal")
					.on('change','#altui-widget-CheckAll', function() {
						var checked = $(this).prop('checked')
						$("div#dialogModal").find("input[type='checkbox']").prop('checked',checked)
					})
					.off('submit',"form")
					.on( 'submit',"form", function() {
						save_needed = true;
						page.name = $("#name").val();
						// todo : update page watches based on the user selection
						page.watches=[]
						$("#watches input").each(function(idx,elem){
							if ($(elem).prop('checked')==true) {
								var id = $(elem).prop('id').substring( 'watch_'.length )
								page.watches.push( id ) // watch ID in the mapID2Watch
							}
						})
						page.order = null
						$(dialog).modal('hide');

						// redraw page
						_refreshWatchPills(active_page,true)
						_refreshWatchList(active_page,true)
					});
			})
			.off('click','#altui-watchpage-add')
			.on('click','#altui-watchpage-add',function() {
				if (( Object.keys(pages).length>=1) && (ALTUI_registered!=true) ) {
					PageMessage.message( _T("Creating more than one graph page is limited to registered users"), "danger");
					return
				}
				var id = _calculateLastPageID(pages)+1;
				var page = {
					name:'Page'+id,
					id:'altui-watchpage-page'+id,
					watches: []
				}
				pages[page.id]=page;
				if (pages[ORDER] && pages[ORDER].order)
					pages[ORDER].order.push(page.id)
				save_needed = true;
				_refreshWatchPills(active_page)
			})
			.off('click','#altui-watchpage-del')
			.on('click','#altui-watchpage-del',function() {
				if (Object.keys(pages).length> 1 + ((pages[ORDER]!=null) ? 1 : 0) ) {
					if (pages[ORDER] && pages[ORDER].order)
						pages[ORDER].order = pages[ORDER].order.filter( function(item) { return item !== active_page } )
					delete pages[active_page]
					$(".altui-graph-row[data-pageidx='"+active_page+"']").remove()
					active_page = 'altui-watchpage-page'+ _calculateLastPageID(pages)
					save_needed = true;
					_refreshWatchPills(active_page,true)
					_refreshWatchList(active_page,true)
				}
			})
			.off('click','#altui-watchpage-save')
			.on('click','#altui-watchpage-save',function() {
				$(".altui-graph-row").each( function(i,row) {
					var pageidx = $(row).data("pageidx")
					var order = $.map(
						$(row).find(".row").sortable( "toArray" , {attribute:'data-watchidx'} ),
						function(item,i) {return item}
					)
					pages[pageidx].watches = order;
				});
				pages[ORDER]= {
					order:$(".altui-watch-toolbar > div").sortable( "toArray" , {attribute:'id'} )
				}
				MyLocalStorage.setSettings("WatchPages",pages)
				save_needed = false;
				_refreshWatchPills(active_page,true)
			})
		};

		function _initGraphPage(init_active_page) {
			var dfd = $.Deferred();
			MultiBox.getDataProviders(function(result) {
				providers = result
				pages = MyLocalStorage.getSettings("WatchPages") || {}
				watches = MultiBox.getWatches("VariablesToSend", null)
				mapID2Watch = {};
				$.each(watches, function(idx,watch) {
					var id = WATCH_ID.format(watch.provider, watch.deviceid, watch.service, watch.variable)
					var device = MultiBox.getDeviceByAltuiID(watch.deviceid)
					if (device)
						mapID2Watch[id]=watch
				})
				if (Object.keys(pages).length==0) {
					var firstpage = {
						name:'Page1',
						id:'altui-watchpage-page1',
						watches: []
					}
					active_page = firstpage.id;
					pages[active_page] = firstpage
				}

				active_page = (init_active_page!=null) ? init_active_page : (( pages[ORDER] && pages[ORDER].order ) ? pages[ORDER].order[0] : Object.keys(pages)[0]);
				dfd.resolve(active_page);
			})
			return dfd.promise();
		}

		function _refreshScreen() {
			// Display Pages Pills
			_refreshWatchPills(active_page)

			// Display Page's Watches
			_refreshWatchList(active_page)
		}

		UIManager.clearPage('WatchDisplay',_T("Watch Display"),UIManager.oneColumnLayout);
		$.when( _initGraphPage(null) ).done(function (active_page) {
			// Display Page's Watches
			_refreshScreen();
			_interactivity();
		})
	},
	pageThemes: function() {
		UIManager.clearPage('Themes',_T("Themes"),UIManager.oneColumnLayout);
		PageMessage.message( "Select a theme by clicking on it and refresh your browser", "info");
		var resetButton = buttonTemplate.format( "altui-theme-reset", 'btn-secondary', _T("Reset"),"",_T('Reset Theme Override'));
		var html = "";
		html += "<div class='col-12'>";
		html +="<div class='card xxx'>";
		html +="  <div class='card-header'>"+_T("Themes")+" Bootswatch.com "+resetButton+"</div>";
		html +="  <div class='card-body'>";
		html += "<div id='altui-themes' class='row'>";
		html +="</div>";	//row
		html +="</div>";	//body
		html +="</div>";	//panel
		html +="</div>";	//col-12
		$(".altui-mainpanel").append(html);
		$.getJSON( "https://bootswatch.com/api/4.json", function( data ) {
			$.each(data.themes,function(idx,theme) {
				var html ="";
				// theme.cssCdn = theme.cssCdn.replace("maxcdn.bootstrapcdn.com/bootswatch/latest/","bootswatch.com/4/")
				theme.preview = theme.preview.replace("bootswatch.com/","bootswatch.com/")
				theme.thumbnail = theme.thumbnail.replace("bootswatch.com/","bootswatch.com/")
				html += "<div class='altui-theme-thumbnail col-6 col-md-4 col-lg-3 col-xl-2' data-preview='{1}' data-href='{0}'>".format(theme.cssMin,theme.preview);
				html += "<label class='altui-theme-label'>{0} {1}</label>".format(
					theme.description,
					xsbuttonTemplate.format( '', 'altui-theme-preview', eyeOpenGlyph,_T('Preview'))
					);
				html += "<img width='100%' src='{0}'></img>".format(theme.thumbnail);
				html +="</div>";	//col-12
				$("#altui-themes").append(html);
			});
		});
		$(".altui-mainpanel").on('click','.altui-theme-thumbnail',function() {
			var href = $(this).closest('.altui-theme-thumbnail').data('href');
			UIManager.setTheme(href);
		}).on('click','.altui-theme-preview',function(e) {
			var href = $(this).closest('.altui-theme-thumbnail').data('preview');
			window.open(href, '_blank');
			return false;
		}).on('click','#altui-theme-reset',function(e) {
			// UIManager.setTheme("https://drive.google.com/uc?id=0B6TVdm2A9rnNakxEdDdYVWVxMnM&authuser=0&export=download");
			UIManager.setTheme(null);
		});
	},
	pageCheckUpdate:function() {
		UIManager.refreshFooter( true );
	},
	pageOptions: function() {
		function _displayOption(id,check,width) {
			var helpbutton = `
				<small id="{0}" class="form-text text-muted">
					( {1} )
				</small>`.format(
					id,
					_T(check.id+": "+check.help)
				)
			// var helpbutton = xsbuttonTemplate.format( id, 'altui-help-button',	glyphTemplate.format("question","",""), _T(check.id+":"+check.help));
			var html="";
			var init =	(MyLocalStorage.getSettings(check.id)!=null) ? MyLocalStorage.getSettings(check.id) : check._default;
			switch( check.type ) {
				case 'select':
					var htmlOptions="";
					$.each(check.choices.split("|"),function(id,unit){
						htmlOptions += "<option value='{0}' {1}>{0}</option>".format( unit , (unit==init) ? 'selected' : '' );
					})
					html += `
					  <div class="{4} form-group">
						<label for="altui-{0}">{3}</label>
						<select class="form-control" id="altui-{0}">
							{1}
						</select>
						{2}
					  </div>`.format(
						check.id,
						htmlOptions,
						helpbutton,
						check.label,
						width
					  )
					$(".altui-mainpanel")
						.off("change","#altui-"+check.id)
						.on("change","#altui-"+check.id,function(){
							_saveOption(check.id, $("#altui-"+check.id).val());
						});
					break;

				case 'checkbox':
					html += `
					<div class="{5} form-check">
					  <label class="form-check-label">
						<input id='altui-{0}' class="form-check-input" type="checkbox" value="{1}" {2}>
							{3}
					  </label>
					  {4}
					</div>`.format(
						check.id,
						init,
						(init==true) ? 'checked' : '',
						_T(check.label),
						helpbutton,
						width
					)
					// html +="<label title='"+check.id+"' class='checkbox-inline'>";
					// html +=("  <input type='checkbox' id='altui-"+check.id+"' " + ( (init==true) ? 'checked' : '') +" value='"+init+"' title='"+check.id+"'>"+_T(check.label));
					// html +="</label>";
					$(".altui-mainpanel")
						.off("click","#altui-"+check.id)
						.on("click","#altui-"+check.id,function(){
							_saveOption(check.id,$("#altui-"+check.id).is(':checked') ? 1 : 0);
						});
					break;

				case 'number':
					html += `
					  <div class="{6} form-group">
						<label for="altui-{0}">{1}</label>
						<input type="number" min="{3}" max="{4}" class="form-control" id="altui-{0}" value="{2}" placeholder="name@example.com">
						{5}
					  </div>
					`.format(
						check.id,
						_T(check.label),
						init,
						(check.min||0),
						(check.max||999),
						helpbutton,
						width
					);

					// html +="<label title='"+check.id+"' class='' for='altui-"+check.id+"'>"+_T(check.label)+"</label>:";
					// html +=("<input type='number' min='"+(check.min||0) +"' max='"+(check.max||999) +"' id='altui-"+check.id+"' " + ( (init==true) ? 'checked' : '') +" value='"+init+"' title='"+check.id+"'>");
					$(".altui-mainpanel")
						.off("focusout","#altui-"+check.id)
						.on("focusout","#altui-"+check.id,function(){
							_saveOption(check.id,parseInt($("#altui-"+check.id).val()));
						});
					break;

				case 'button':
					html += `
					<div class="{3} form-group">
						<label for="altui-{0}">{1}</label>
						<button id="altui-{0}" class="btn btn-light" >{1}</button>
						{2}
					</div>`.format(check.id,check.label,helpbutton,width)
					$(".altui-mainpanel")
						.off("click","#altui-"+check.id)
						.on("click","#altui-"+check.id,function(){
							window.open( check.url, '_blank');
						});
					break;

				case 'multiline':
					html += `
					<div class="{4} form-group">
						<label for="altui-{0}">{1}</label>
						<textarea id="altui-{0}" class="form-control" rows="{5}">{2}</textarea>
						{3}
					</div>`.format(check.id,check.label,check._default,helpbutton,width,check.rows)
					$(".altui-mainpanel")
						.off("change","#altui-"+check.id)
						.on("change","#altui-"+check.id,function(){
							var val = $("#altui-"+check.id).val();
							if (val.length<5)
								val = check._default;
							_saveOption(check.id,val);
						});
					break;

				default:
					html += JSON.stringify({id:id, check:check, width:width})
					break;
			}
			// html+=helpbutton;
			return html;
		};

		function _saveOption(name,value) {
			MyLocalStorage.setSettings(name, value);
			// var serversideOptions = MyLocalStorage.getSettings("ServerSideOptions")
			// if (serversideOptions==1) {
				// save a copy of the simple options to Vera
				var altuidevice = MultiBox.getDeviceByID( 0, g_ALTUI.g_MyDeviceID );
				var altui_settings = MyLocalStorage.get("ALTUI_Settings");
				var tbl={}
				$.each(altui_settings,function(key,val) {
					if ( (val!=null) && (isObject(val)==false)) {
						tbl[key]=btoa(val.toString())
					}
				});
				var serveroptions_str = MultiBox.getStatus( altuidevice, "urn:upnp-org:serviceId:altui1", "ServerOptions" );
				if (isNullOrEmpty(serveroptions_str))
					serveroptions_str="{}";
				var old_options = JSON.parse(  serveroptions_str );
				old_options = $.extend(true,old_options,tbl);
				MultiBox.setStatus( altuidevice, "urn:upnp-org:serviceId:altui1", "ServerOptions", JSON.stringify(old_options) );
			// }
		};
		UIManager.clearPage('Options',_T("Options"),UIManager.oneColumnLayout);

		var color = IconDB.isDB() ? "text-success" : "text-danger";
		var okGlyph = glyphTemplate.format( "check-circle", "OK" , color );

		color = FileDB.isDB() ? "text-success" : "text-danger";
		var okGlyph2 = glyphTemplate.format( "check-circle", "OK" , color );

		color = MultiBox.isUserDataCached(0) ? "text-success" : "text-danger";
		var okGlyph3 = glyphTemplate.format( "check-circle", "OK" , color );

		color =	 MyLocalStorage.get("Pages")!=null ? "text-success" : "text-danger";
		var okGlyph4 = glyphTemplate.format( "check-circle", "OK" , color );

		var html = "";
		html +="<div class='col-12 mb-2'>";
		html +=" <div class='card border-secondary'>";
		html +="  <div class='card-header'>"+_T("Options")+"</div>";
		html +="  <div class='card-body'><form><div class='row'>";
			$.each(_userOptions, function(id,check) {
				if (check.hidden!=true) {
					// html += "<div class='col-sm-6'>";
					html += _displayOption(id,check,"col-sm-6 col-lg-4");
					// html += "</div>";
				}
			});
		html +="  </div></form></div>";
		html +=" </div>";
		html +="</div>";

		//http://api.github.com/repos/ajaxorg/ace/contents/lib/ace/theme
		html += "<div class='col-12 mb-2'>";
			html +="<div class='card border-secondary'>";
				html +="  <div class='card-header'>"+_T("Editor Control")+"</div>";
				html +="  <div class='card-body'>";
					html += "<div class='row'>";
						html += "<div class='col-sm-4'>";
							html +="<label title='"+_T("Editor Theme")+"' class='' for='altui-ace-theme'>"+_T("Editor Theme")+"</label> :"
							html +="<select class='form-control' id='altui-ace-theme' title='"+_T("Editor Theme")+"'>";
							html +="</select>";
							$.each(_editorOptions, function(id,check) {
								html += _displayOption(id,check,"");
							});
						html += "</div>";
						html += "<div class='col-sm-8'>";
							html += "<div id='altui-editor-sample'>--- Comment sample\nlocal var = 1234\nlocal var2 = { \"abc\", tonumber(4), \"def\", 565 }\nfunction test(a)\n\tlocal i = \"Hello World of ALTUI\"\n\treturn i\nend</div>";
						html += "</div>";
					html += "</div>";
					// <button id='9' type='button' class='altui-help-button btn btn-light btn-sm' aria-label='tbd' title='Unit for temperature'><span class='glyphicon glyphicon-question-sign ' aria-hidden='true' data-toggle='tooltip' data-placement='bottom' title=''></span></button>
				html += "</div>";
			html +="</div>";
		html +="</div>";

		// Weather Widget Control
		html += "<div class='col-12 mb-2'>";
			html +="<div class='card border-secondary'>";
				html +="  <div class='card-header'>"+_T("Weather Widget Control")+"</div>";
				html +="  <div class='card-body'>";
					html += "<div class='row'>";
						$.each(_meteoOptions, function(id,check) {
							html += _displayOption(id,check,"col-sm-6");
						});
					html += "</div>";
				html += "</div>";
			html +="</div>";
		html +="</div>";

		// tags name control
		var dbtags = MyLocalStorage.getSettings('DeviceTags')
		var model = $.map( tagModel, function(key,idx) {
			return {
				id:key,
				glyph: glyphTemplate.format( "tags", _T("Category") , 'text-'+key),
				name:"<input id='altui-tag-name-{0}' class='form-control altui-tag-name' type='text' name='altui-tag-name-{0}' value='{1}'></input>".format(key,dbtags.names[key] || '' )
			}
		});
		var tblBackground = HTMLUtils.array2Table(model,'id',[],"",'altui-tags-tr','altui-tags-opts',false)
		html += "<div class='col-12 mb-2'>";
			html +="<div class='card border-secondary'>";
				html +="  <div class='card-header'>"+_T("Tag Custom Names")+"</div>";
				html +="  <div class='card-body'>";
					html += "<div class='row' id='altui-tags-container'>";
						html += tblBackground;
					html += "</div>";
				html += "</div>";
			html +="</div>";
		html +="</div>";

		// MyRoom background control
		var backgroundSettings = MyLocalStorage.getSettings('MyHomeBackgrounds') || {}
		var model = $.map( Object.keys(backgroundSettings), function(key,idx) {
			return {
				id :"<input class='form-control col-4' type='text' name='altui-roomid-{0}' value='{0}'></input>".format(key),
				url:"<input class='form-control' type='text' name='altui-roombkg-{0}' value='{1}'></input>".format(key,backgroundSettings[key].url),
				cmd: xsbuttonTemplate.format("_","altui-bgmyhome-tr-del",deleteGlyph,"Del")
			}
		});
		var tblBackground = HTMLUtils.array2Table(model,'id',[],"",'altui-bgmyhome-tr','altui-bgmyhome-opts',false)
		html += "<div class='col-12 mb-2'>";
			html +="<div class='card border-secondary'>";
				html +="  <div class='card-header'>"+_T("MyRoom Backgrounds")+"</div>";
				html +="  <div class='card-body'>";
					html += "<div class='row' id='altui-bgmyhome-container'>";
						html += tblBackground;
					html += "</div>";
					html += "<div id='altui-bgmyhome-toolbar' class='btn-group mr-2' role='group' aria-label='Add Background'>";
						html += "<button class='btn btn-light altui-bgmyhome-tr-add' type='button'>"+plusGlyph+" Add Background</button>";
						html += "<button class='btn btn-light altui-bgmyhome-save' type='button'>"+saveGlyph+" Save Backgrounds</button>";
					html += "</div>";
				html += "</div>";
			html +="</div>";
		html +="</div>";

		// cache control
		html += "<div class='col-12 mb-2'>";
			html +="<div class='card border-secondary'>";
				html +="  <div class='card-header'>"+_T("Cache Control")+"</div>";
				html +="  <div class='card-body'>";
					if (MultiBox.isRemoteAccess()) {
						html +="<div class='btn-group mr-2' role='group' aria-label='Icon DB'>";
							html += "<button class='btn btn-light altui-save-IconDB' type='submit'>"+saveGlyph+" Save Icon DB</button>";
							html += "<button class='btn btn-light altui-clear-IconDB' type='submit'>"+okGlyph+" Clear Icon DB</button>";
						html += "</div>";
					}
					html += "<div class='btn-group mr-2' role='group' aria-label='File DB'>";
						html += "<button class='btn btn-light altui-save-FileDB' type='submit'>"+saveGlyph+" Save File DB</button>";
						html += "<button class='btn btn-light altui-clear-FileDB' type='submit'>"+okGlyph2+" Clear File DB</button>";
					html += "</div>";
				html += "</div>";
			html +="</div>";
		html +="</div>";

		// custom page control
		html += "<div class='col-12 mb-2'>";
		html +="<div class='card border-secondary'>";
		html +="  <div class='card-header'>"+_T("Custom Pages Control")+"</div>";
		html +="  <div class='card-body'>";
			// html += "<div class='btn-group' role='group' aria-label='User Pages DB'>";
			html += "<button class='btn btn-light altui-save-userpage' type='submit'>"+saveGlyph+"Save User Pages</button>";
			html += "<button class='btn btn-light altui-restore-userpage' type='submit'>"+loadGlyph+"Restore From User Pages Cache</button>";
			html += "<button class='btn btn-light altui-clear-userpage' type='submit'>"+okGlyph4+" Clear User Pages Cache</button>";
			// html += "</div>";
		html += "</div>";
		html +="  </div>";
		html +="</div>";

		html += "<div class='col-12 mb-2'>";
		html +="<div class='card border-secondary'>";
		html +="  <div class='card-header'>"+_T("Graph Pages Control")+"</div>";
		html +="  <div class='card-body'>";
			// html += "<div class='btn-group' role='group' aria-label='User Pages DB'>";
			html += "<button class='btn btn-light altui-clear-graphpage' type='submit'>"+glyphTemplate.format( "check-circle", "OK" , "text-danger" )+" Clear Graph Pages Settings</button>";
			// html += "</div>";
		html += "</div>";
		html +="  </div>";
		html +="</div>";

		$(".altui-mainpanel").append(html);

		function _delBackground(e) {
			var tr = $(this).closest("tr")
			tr.remove()
		}
		function _addBackground(e) {
			var name = "<input class='form-control' type='text' name='altui-roomkey' value='' placeholder='enter room name'></input>"
			var url = "<input class='form-control' type='text' name='altui-roombkg' value='' placeholder='enter url to background'></input>"
			var del =  xsbuttonTemplate.format("_","altui-bgmyhome-tr-del",deleteGlyph,"Del")
			if ($("#altui-bgmyhome-opts tbody").length >=1) {
				var html ="<tr><td>{0}</td><td>{1}</td><td>{2}</td></tr>".format(
					name,
					url,
					del
				)
				$("#altui-bgmyhome-opts tbody").append(html)
			} else {
				var model = [
					{
					id: name,
					url: url,
					cmd: del
					}
				]
				var tblBackground = HTMLUtils.array2Table(model,'id',[],"",'altui-bgmyhome-tr','altui-bgmyhome-opts',false)
				$("#altui-bgmyhome-container").html(tblBackground)
			}
		}
		function _saveBackground(e) {
			MultiBox.getRooms( null,null,function( rooms ) {
				var roomnames = $.map(rooms, function(r) { return r.name } )
				var settings={}
				$("#altui-bgmyhome-opts tbody tr").each( function(idx,tr) {
					var key = $(tr).find("td:first input").val()
					var url = $(tr).find("td:nth-child(2) input").val()
					if ( roomnames.in_array(key) ) {
						settings[key] = { url:url }
					}
				})
				MyLocalStorage.setSettings('MyHomeBackgrounds', settings)
			});
		}
		// ACE
		var editor = ace.edit( "altui-editor-sample" );
		editor.session.setMode( "ace/mode/lua" );
		var init =	MyLocalStorage.getSettings("EditorTheme") || "monokai";
		editor.setTheme( "ace/theme/"+init );
		editor.setFontSize( MyLocalStorage.getSettings("EditorFontSize") );

		// NOTE : does not work, as we have to logged on to github for this api to work
		// $.getJSON("http://api.github.com/repos/ajaxorg/ace/contents/lib/ace/theme", function(themes){
		var themes=["ambiance.css", "chaos.css", "chrome.css", "clouds.css", "clouds_midnight.css", "cobalt.css", "crimson_editor.css", "dawn.css", "dreamweaver.css", "eclipse.css", "github.css", "gruvbox.css", "idle_fingers.css", "iplastic.css", "katzenmilch.css", "kr_theme.css", "kuroir.css", "merbivore.css", "merbivore_soft.css", "mono_industrial.css", "monokai.css", "pastel_on_dark.css", "solarized_dark.css", "solarized_light.css", "sqlserver.css", "terminal.css", "textmate.css", "tomorrow.css", "tomorrow_night.css", "tomorrow_night_blue.css", "tomorrow_night_bright.css", "tomorrow_night_eighties.css", "twilight.css", "vibrant_ink.css", "xcode.css"];			var init =	MyLocalStorage.getSettings("EditorTheme") || "monokai";
		var html = "";
		$.each(themes, function(idx,theme) {
			html += "<option value='{0}'>{0}</option>".format(theme.slice(0, -4));
		})
		$("#altui-ace-theme").html( html )
		.val(init)
		.change( function() {
			editor.setTheme( "ace/theme/"+$(this).val() );
			_saveOption("EditorTheme",$(this).val())
		});
		$("#altui-EditorFontSize").change( function() {
			editor.setFontSize( parseInt($(this).val()) );
			_saveOption("EditorFontSize",parseInt($(this).val()))
		})

		$(".altui-save-IconDB").click( function() {
			IconDB.saveDB();
			UIControler.changePage('Options',[ ]);
		});
		$(".altui-clear-IconDB").click( function() {
			IconDB.resetDB();
			UIControler.changePage('Options',[ ]);
		});
		$(".altui-save-FileDB").click( function() {
			FileDB.saveDB();
			UIControler.changePage('Options',[ ]);
		});
		$(".altui-clear-FileDB").click( function() {
			FileDB.resetDB();
			UIControler.changePage('Options',[ ]);
		});
		$(".altui-save-userpage").click( function() {
			PageManager.savePages();
		});
		$(".altui-restore-userpage").click( function() {
			PageManager.recoverFromStorage();
			UIControler.changePage('Options',[ ]);
		});
		$(".altui-clear-userpage").click( function() {
			PageManager.clearStorage();
			UIControler.changePage('Options',[ ]);
		});
		$(".altui-clear-graphpage").click( function() {
			DialogManager.confirmDialog(_T("This is not reversible, Are you sure you want to do it?"),function(result) {
				if (result==true) {
					MyLocalStorage.setSettings("WatchPages",null);
					UIControler.changePage('Options',[ ]);
				}
			})
		});
		$("#altui-bgmyhome-toolbar").off()
			.on("click",".altui-bgmyhome-tr-add",_addBackground )
			.on("click",".altui-bgmyhome-save",_saveBackground )

		$("#altui-bgmyhome-container").off()
			.on("click",".altui-bgmyhome-tr-del",_delBackground )

		$(".altui-tag-name").focusout( function() {
			var val = $(this).val();
			var key = $(this).prop('id').substr("altui-tag-name-".length)
			var tags = MyLocalStorage.getSettings('DeviceTags')
			tags.names[key]=val
			MyLocalStorage.setSettings('DeviceTags',tags)
		});
	},
	reloadEngine: function() {
		MultiBox.reloadEngine(0).done(function(){
			PageMessage.message(_T("Reload is done"),"success");
		})
	},
	reboot: function() {
		MultiBox.reboot(0)
	},
	signal: function( eventname ) {

		switch (eventname) {
			case 'on_ui_initFinished':
				bUIReady =true;
				Localization.doBranding();
				$(".imgLogo").show();
				break;
			case 'on_ui_userDataLoaded':
				bEngineReady=true;
				break;
		}
		if ( (bEngineReady==true) && (bUIReady==true) ) {
			bUIReady=false;

			$(window).on('resize', function () {
			  /*if (window.innerWidth > tabletSize) */
			  $(".navbar-collapse").collapse('hide');
			  UIManager.refreshUI( true );
			  UIManager.refreshFooter();
			});

			// $( window ).unload(function() {
			$(window).on("unload", function() {
				// save state to accelerate the launch next time
				// UIManager.saveEngine();
				MultiBox.saveEngine();
				//AltuiDebug.debug("exiting");
			});

			$(".altui-debug-div").toggle(false);

			var pageIDs = UIControler.getPagesIDs().join(",");
			$( document )
				.on ("click", ".navbar-nav a", function() {		// collapse on click on small screens
					//	$(".navbar-toggle").click();
					if ($(this).data("toggle") != "dropdown")	// not for the More... button
						$(".navbar-collapse").collapse('hide');
				} )
				.on ("click touchend", ".imgLogo", function() { UIControler.changePage('Home') })

				.on( "click", "#altui-debug-btn", function() {
					$(".altui-debug-div").toggle();
					$("#altui-debug-btn span.caret").toggleClass( "caret-reversed" );
				})
				.on("click","#altui-device-variables",function(){
					var altuiid = $(this).data('altuiid');
					var device = MultiBox.getDeviceByAltuiID(altuiid);
					UIManager.deviceDrawVariables(device);
				})
				.on("click","#altui-device-actions",function(){
					var altuiid = $(this).data('altuiid');
					var device = MultiBox.getDeviceByAltuiID(altuiid);
					UIManager.deviceDrawActions(device);
				})
				.on("click", pageIDs, function(e) {
					var id = $(this).prop('id')
					UIControler.onClickHtml('#'+id);
				})
				.on("click", "a.altui-dropdown-scene-favorite", function(e) {
					var altuiid = $(this).data("altuiid");
					var scene = MultiBox.getSceneByAltuiID(altuiid);
					if (scene)
							MultiBox.runScene( scene );
				})
				.on("click","button#altui-search",function(e) {
					var map = {
						'Devices':	{goto:'Control Panel'},
						'Scenes':	{goto:'Scene Edit'}
					};
					function _searchText(val) {
						var db = MyLocalStorage.getSettings('DeviceTags')
						var result={}
						var pattern = new RegExp(val,"i");
						var devices = MultiBox.getDevicesSync().filter( function(d) {
							var tags = $.map(db.devicemap['_'+d.altuiid], function(tagname,idx) {
								return db.names[tagname] || tagname
							});
							for(var i=0; i<tags.length; i++) {
								if (pattern.test(tags[i])==true)
									return true;
							}
							return ( (d.name) && ( (pattern.test(d.name)==true) || (pattern.test(d.manufacturer)==true) || (pattern.test(d.model)==true) ) )
						});
						result["Devices"] = devices
						var scenes = MultiBox.getScenesSync().filter( function(d) {
							return (d.name) && (pattern.test(d.name)==true)
						});
						result["Scenes"] = scenes
						return result
					};

					function _prepareBodyMessage(searchResult){
						var lines=[]
						$.each(searchResult, function(key,tbl) {
							lines.push("<div class='col-12 col-lg-6'>")
							lines.push("<h5>{0}</h5>".format(_T(key)))
							lines.push("<ul>");
							$.each(tbl, function(i,res) {
								lines.push("<li>{0}, <small><A href='#' class='altui-search-result' id='{2}_{1}'>({1})</A></small></li>".format(res.name,res.altuiid,key))
							})
							lines.push("</div>")
							lines.push("</ul>");
						});
						return lines.join("\n");
					};
					var val = $("#altui-search-text").val()
					var searchResult = _searchText(val);
					var messageHtml = _prepareBodyMessage(searchResult);
					DialogManager.infoDialog(_T("Search Results"),messageHtml);
					$(".altui-search-result").click( map, function(event) {
						var id = $(this).prop('id')
						var map = event.data
						var parts = id.split("_")
						var params = []
						params.push( parts[1] )
						$("#dialogModal").modal('hide')
						setTimeout(function() {
							UIControler.changePage( map[parts[0]].goto , params )
						} , 300 );
						return false;
					});
					return false;
				});

				UIControler.updateFavoriteScene();
				_refreshFooter();
				UIManager.run();
		}
	},

	run: function( eventname ) {
		var homepage = getQueryStringValue("home") || 'pageHome';
		window["UIManager"][homepage]();	// call function by its name
		UIControler.leanMode();
	}
  };	// end of return
})( window );

// $(document).ready(function() {
$(function() {

	function _onInitLocalization2() {
		// console.log("_initLocalizedGlobals()");
		_HouseModes = [
			{id:1, text:_T("Home"), cls:"preset_home" , glyph:'fa-home'},
			{id:2, text:_T("Away"), cls:"preset_away", glyph:'fa-globe' },
			{id:3, text:_T("Night"), cls:"preset_night", glyph:'fa-moon-o'},
			{id:4, text:_T("Vacation"), cls:"preset_vacation", glyph:'fa-plane'}
		];
		// 0: table	 1: devicename 2: id
		deviceModalTemplate = "<div id='deviceModal' class='modal fade'>";
		deviceModalTemplate += "  <div class='modal-dialog modal-dialog-scrollable modal-lg'>";
		deviceModalTemplate += "	<div class='modal-content'>";
		deviceModalTemplate += "	  <div class='modal-header'>";
		deviceModalTemplate += "		<h5 class='modal-title'>{1} <small>#{2}</small> - Variables</h5>";
		deviceModalTemplate += "		<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>";
		deviceModalTemplate += "	  </div>";
		deviceModalTemplate += "	  <div class='modal-body'>";
		deviceModalTemplate += "	  <div class='row' >";
		deviceModalTemplate += "	  <div class='col-12' style='overflow-x: auto;'>";
		deviceModalTemplate += " <table class='table  table-sm'>";	// -OFF
		deviceModalTemplate += "	   <thead>";
		deviceModalTemplate += "		 <tr>";
		// deviceModalTemplate += "			  <th>#</th>";
		deviceModalTemplate += "		   <th>"+_T("Variable")+"</th>";
		deviceModalTemplate += "		   <th></th>";
		deviceModalTemplate += "		   <th>"+_T("Value")+"</th>";
		deviceModalTemplate += "		 </tr>";
		deviceModalTemplate += "	   </thead>";
		deviceModalTemplate += "	   <tbody>";
		deviceModalTemplate += "	   {0}";					// lines goes here
		deviceModalTemplate += "	   </tbody>";
		deviceModalTemplate += "	 </table>";
		deviceModalTemplate += "	  </div>";	// col
		deviceModalTemplate += "	  </div>";	// row
		deviceModalTemplate += "	  </div>";	// body
		deviceModalTemplate += "	  <div class='modal-footer'>";
		deviceModalTemplate += "		<button type='button' class='btn btn-default' data-dismiss='modal'>"+_T("Close")+"</button>";
		deviceModalTemplate += "		<button type='button' class='btn btn-primary' data-dismiss='modal'>"+_T("Save")+"</button>";
		// deviceModalTemplate += "		   <button type='button' class='btn btn-primary'>Save changes</button>";
		deviceModalTemplate += "	  </div>";
		deviceModalTemplate += "	</div><!-- /.modal-content -->";
		deviceModalTemplate += "  </div><!-- /.modal-dialog -->";
		deviceModalTemplate += "</div><!-- /.modal -->";

		// 0: table	 1: devicename 2: id
		deviceActionModalTemplate = "<div id='deviceActionModal' class='modal fade'>";
		deviceActionModalTemplate += "	<div class='modal-dialog modal-dialog-scrollable modal-lg'>";
		deviceActionModalTemplate += "	  <div class='modal-content'>";
		deviceActionModalTemplate += "		<div class='modal-header'>";
		deviceActionModalTemplate += "		  <h5 class='modal-title'>{1} <small>#{2}</small> - Actions</h5>";
		deviceActionModalTemplate += "		  <button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>";
		deviceActionModalTemplate += "		</div>";
		deviceActionModalTemplate += "		<div class='modal-body'>";
		deviceActionModalTemplate += "	<table class='table table-responsive-OFF table-sm' >";
		deviceActionModalTemplate += "		 <thead>";
		deviceActionModalTemplate += "		   <tr>";
		deviceActionModalTemplate += "			 <th>"+_T("Action")+"</th>";
		deviceActionModalTemplate += "			 <th>"+_T("Parameters")+"</th>";
		deviceActionModalTemplate += "		   </tr>";
		deviceActionModalTemplate += "		 </thead>";
		deviceActionModalTemplate += "		 <tbody>";
		deviceActionModalTemplate += "		 {0}";					// lines goes here
		deviceActionModalTemplate += "		 </tbody>";
		deviceActionModalTemplate += "	   </table>";
		deviceActionModalTemplate += "		</div>";
		deviceActionModalTemplate += "		<div class='modal-footer'>";
		deviceActionModalTemplate += "		  {3}";					// extra buttons
		deviceActionModalTemplate += "		  <button type='button' class='btn btn-primary' data-dismiss='modal'>"+_T("Close")+"</button>";
		deviceActionModalTemplate += "		</div>";
		deviceActionModalTemplate += "	  </div><!-- /.modal-content -->";
		deviceActionModalTemplate += "	</div><!-- /.modal-dialog -->";
		deviceActionModalTemplate += "</div><!-- /.modal -->";

		// 0:id 1: title, 2: body, 3: class size 4:icon
		defaultDialogModalTemplate =`
<div id='{0}' class="modal" tabindex="-1" role="dialog">
  <div class="modal-dialog {3}" role="document">
    <div class="modal-content">
		<form name='{0}' id='form_{0}' class='form' onsubmit='return false;'>
			  <div class="modal-header">
				<div class="modal-title"><div class='altui-dialog-icon pull-left'>{4} </div><h5 class='d-inline-block'>{1}</h5></div>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
				  <span aria-hidden="true">&times;</span>
				</button>
			  </div>
			  <div class="modal-body">
				 <div class='container-fluid'>
					 <div class='altui-dialog-row'>
					 {2}
					 </div>
				 </div>
			  </div>
			  <div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-dismiss="modal">`+_T("Close")+`</button>
			  </div>
		  </form>
    </div>
  </div>
</div>`
		staremtpyGlyph =glyphTemplate.format( "star-o", _T("Favorite"), "altui-favorite text-muted" );
		starGlyph = glyphTemplate.format( "star", _T("Favorite"), "altui-favorite text-warning" );
		questionGlyph=glyphTemplate.format( "question", _T("Question"), "text-warning" );
		searchGlyph=glyphTemplate.format( "search", _T("Search"), "" );
		wrenchGlyph=glyphTemplate.format("wrench", _T("Settings"), "" );
		optHorGlyph=glyphTemplate.format( "option-horizontal", _T("Option"), "pull-left" );
		signalGlyph=glyphTemplate.format( "signal", _T("Graph"), "" );
		calendarGlyph=glyphTemplate.format( "calendar",	 _T("History"), "" );
		refreshGlyph=glyphTemplate.format( "refresh", _T("Refresh"), "text-warning" );
		removeGlyph=glyphTemplate.format( "remove", _T("Remove"), "" );
		loadGlyph = glyphTemplate.format( "folder-open", _T("Load") , "");
		infoGlyph = glyphTemplate.format( "info", _T("Info") , "text-info");
		picGlyph = glyphTemplate.format( "picture-o", _T("Image") , "");
		upGlyph = glyphTemplate.format( "arrow-up", _T("More") , "");
		downGlyph = glyphTemplate.format( "arrow-down", _T("Less") , "");
		uncheckedGlyph= glyphTemplate.format( "square-o", _T("Frame") , "");
		runGlyph = glyphTemplate.format( "play", _T("Run Scene") , "");
		editGlyph = glyphTemplate.format( "pencil", _T("Edit") , "");
		recordGlyph = glyphTemplate.format( "video-camera", _T("Record") , "text-danger");
		eyeOpenGlyph = glyphTemplate.format( "eye", _T("See") , "");
		cameraGlyph = glyphTemplate.format( "video-camera", _T("Camera") , "");
		onoffGlyph = glyphTemplate.format( "power-off", _T("On Off") , "");
		scaleGlyph = glyphTemplate.format( "tachometer", _T("Gauge") , "");
		homeGlyph = glyphTemplate.format( "home", _T("Rooms") , "");
		tagsGlyph = glyphTemplate.format( "tags", _T("Category") , "");
		helpGlyph = glyphTemplate.format( "question", "" , "");

		UIManager.initLocalizedGlobals();

		var body = "";
		body+="<!-- Fixed navbar -->";
		body+="<div id='dialogs'></div>";
		body += UIManager.generateNavBarHTML()
		body+="<div class='container-fluid theme-showcase' role='main'>";
		body+="</div> <!-- /container -->";
		body+="<div id='altui-background'></div>";
		$("#wrap").prepend(body);
		$("#menu_scene_withfavorite").hide();
		$("#menu_scene").show();
		$('[data-toggle="offcanvas"]').on('click', function () {
			$('.offcanvas-collapse').toggleClass('open')
		})

		ALTUI_Templates = ALTUI_Templates_Factory();
		if (g_ALTUI.g_CustomBackground.length>0) {
			$("div#altui-background").css({
				'background-image':'url("{0}")'.format(g_ALTUI.g_CustomBackground),
				// 'background-color': 'lightblue',
				'background-position': 'left top',
				'background-size': 'cover',
				'background-repeat': 'no-repeat',
				'background-attachment': 'fixed',
			})
			$("body").addClass('withBackground')
		}

		$.when( UIManager.initUI(styles.format(window.location.hostname), g_ALTUI.g_DeviceTypes, g_ALTUI.g_CustomTheme, g_ALTUI.g_Options) )
		.done( function() {
			$.when( MultiBox.initEngine(g_ALTUI.g_ExtraController,g_ALTUI.g_FirstUserData,g_ALTUI.g_DeviceTypes.info["controllerType"]) )
			.done( function(result) {
				// prepared defered calls
				var toload = [
					MultiBox.getCustomPages(function(pages) { PageManager.init(pages) }),
					MultiBox.getWorkflows( function(workflows) { WorkflowManager.init(workflows) })
				];

				// when all is done, signal we are ready
				$.when.apply( $, toload)
				.then( function() {
					EventBus.publishEvent("on_ui_initFinished");
				});
			})
		})
	};

	function _onInitLocalization() {
		Localization.setTitle("ALTUI")
		if (isNullOrEmpty(g_ALTUI.g_Options))
			_onInitLocalization2();
		else {
			var reserved = JSON.parse( g_ALTUI.g_Options ).reserved
			reserved = null;	//custom ctrlable
			if (isNullOrEmpty(reserved))
				_onInitLocalization2();
			else {
				var filenames = atob(reserved)
				$.each(filenames.split(","),function(idx,name) {
					name = name.trim();
					var parts = name.split(".");
					switch( parts[1] || 'x' ) {
						case 'css': {
							$("head").append("<link rel='stylesheet' href='"+name+"'>");
							break;
						}
						case 'js': {
							UIManager.loadScript(name, _onInitLocalization2)
							break; // only one file
						}
					}
				});
			}
		}
	};

	AltuiDebug.SetDebug( g_ALTUI.g_DeviceTypes.info["debug"] ) ;
	//AltuiDebug.debug("starting engines");
	//AltuiDebug.debug("Configuration: "+JSON.stringify(g_ALTUI.g_DeviceTypes));

	EventBus.registerEventHandler("on_ui_initFinished",UIManager,UIManager.signal);
	EventBus.registerEventHandler("on_ui_userDataLoaded",UIManager,UIManager.signal);

	// Initialize Speech Engine and add English rules.
	// localized rules are overriden later
	var language = getQueryStringValue("lang") || window.navigator.userLanguage || window.navigator.language;
	SpeechManager.init(language);

	//AltuiDebug.debug("language:"+language);

	if ((language.substring(0, 2) == 'en')) {
		//AltuiDebug.debug("Locale file not needed");
		_onInitLocalization();
		SpeechManager.initRules([
			{r:"(switch on|turn on|open).*\\s+(%name%)", t:"device", a:{service:"urn:upnp-org:serviceId:SwitchPower1", action:"SetTarget", params:"{ \"newTargetValue\":1}"}},
			{r:"(switch off|turn off|close).*\\s+(%name%)", t:"device", a:{service:"urn:upnp-org:serviceId:SwitchPower1", action:"SetTarget", params:"{ \"newTargetValue\":0}"}},
			{r:"(run|launch).*\\s+(%name%)", t:"scene" },
			{r:"(show|open).*\\s+(%name%)", t:"altui" },
			{r:"(show|open).*\\s+(%name%)", t:"room" }
		]);
	} else {
		if (getQueryStringValue("lang")=="") {
			// if lang is NOT on the url, we need to load the language module.
			var scriptLocationAndName = g_ALTUI.g_jspath + 'J_ALTUI_loc_'+ language.substring(0, 2) + '.js' ;
			var head = document.getElementsByTagName('head')[0];
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = scriptLocationAndName;
			//AltuiDebug.debug("loading script :"+scriptLocationAndName);
			// once script is loaded, we can call style function in it
			// $(script).load(	function() {
			$(script).on("load", _onInitLocalization )
			head.appendChild(script);
		} else {
			// if lang is on the url, the js is already loaded by the Lua module.
			//AltuiDebug.debug("Locale file not needed");
			_onInitLocalization();
		}
	}
});

var UIControler = (function(win) {
	var _pages =					{
			'Home':						{ id:0, title:'Home',						htmlid:"#menu_home", onclick:UIManager.pageDefault,	parent:-1},
			'Rooms':					{ id:1, title:'Rooms',						htmlid:"#menu_room", onclick:UIManager.pageRooms,	parent:0 },
			'Devices':					{	id:2, title:'Devices',					htmlid:"#menu_device", onclick:UIManager.pageDevices, parent:0 },
			'Control Panel':		{ id:5, title:'Control Panel',			onclick:UIManager.pageControlPanel, parent:2 },
			'Scenes':						{ id:6, title:'Scenes',						htmlid:"#menu_scene", onclick:UIManager.pageScenes,		parent:0 },
			'Scene Edit':				{ id:7, title:'Scene Edit',					onclick:UIManager.pageSceneEdit, parent:6 },
			'Plugins':					{ id:8, title:'Plugins',					htmlid:"#menu_plugins", onclick:UIManager.pagePlugins, parent:0 },
			'Custom Pages':			{ id:9, title:'Custom Pages',		htmlid:"#altui-pages-see", onclick:UIManager.pageUsePages, parent:0 },
			'Edit Pages':				{ id:10, title:'Edit Pages',			htmlid:"#altui-pages-edit", onclick:UIManager.pageEditPages, parent:0 },
			'Credits':					{ id:11, title:'Credits',				htmlid:"#altui-credits", onclick:UIManager.pageCredits, parent:0 },
			'LuaTest':					{ id:12, title:'LuaTest',				htmlid:"#altui-luatest", onclick:UIManager.pageLuaTest, parent:0 },
			'LuaStart':					{ id:13, title:'LuaStart',				htmlid:"#altui-luastart", onclick:UIManager.pageLuaStart, parent:0 },
			'Options':					{ id:14, title:'Options',				htmlid:"#altui-optimize", onclick:UIManager.pageOptions, parent:0 },
			'Editor':						{ id:15, title:'Editor',						onclick:UIManager.pageEditor, parent:8 },
			'ZWave':						{ id:16, title:'ZWave',						htmlid:"#altui-zwavenetwork", onclick:UIManager.pageZwave, parent:0 },
			'Localize':					{ id:17, title:'Localize',				htmlid:"#altui-localize", onclick:UIManager.pageLocalization, parent:0 },
			'Debug':						{ id:18, title:'Debug',						htmlid:"#altui-debugtools", onclick:UIManager.pageDebug, parent:0 },
			'Power':						{ id:19, title:'Power',						htmlid:"#altui-energy", onclick:UIManager.pagePower, parent:0 },
			'Parent/Child':			{ id:20, title:'Parent/Child',		htmlid:"#altui-childrennetwork", onclick:UIManager.pageChildren, parent:0 },
			'zWaveRoutes':			{ id:21, title:'zWaveRoutes',		htmlid:"#altui-zwaveroutes", onclick:UIManager.pageRoutes, parent:0 },
			'Quality':					{ id:22, title:'Quality',				htmlid:"#altui-quality", onclick:UIManager.pageQuality, parent:0 },
			'TblDevices':				{ id:23, title:'TblDevices',			htmlid:"#altui-tbl-device", onclick:UIManager.pageTblDevices, parent:0 },
			'OsCommand':				{ id:24, title:'OsCommand',				htmlid:"#altui-oscommand", onclick:UIManager.pageOsCommand, parent:0 },
			'Triggers':					{ id:25, title:'Triggers',				htmlid:"#altui-scene-triggers", onclick:UIManager.pageTriggers,		parent:6 },
			'Themes':						{ id:26, title:'Themes',					htmlid:"#altui-theme-selector", onclick:UIManager.pageThemes, parent:0 },
			'TblScenes':				{ id:27, title:'TblScenes',				htmlid:"#altui-tbl-scene", onclick:UIManager.pageTblScenes, parent:0 },
			'TblControllers':		{ id:28, title:'TblControllers',	htmlid:"#altui-tbl-controllers", onclick:UIManager.pageTblControllers, parent:0 },
			'TblWatches':				{ id:29, title:'TblWatches',			htmlid:"#altui-tbl-watches", onclick:UIManager.pageTblWatches, parent:0 },
			'WatchDisplay':			{ id:30, title:'Watch Display',		htmlid:"#altui-graph-watches", onclick:UIManager.pageWatchDisplay, parent:0 },
			'Workflow Pages':		{ id:31, title:'Workflow Pages',	htmlid:"#menu_workflow", onclick:UIManager.pageWorkflows, parent:0 },
			'Workflow':					{ id:32, title:'Workflow',					onclick:UIManager.pageWorkflow, parent:31 },
			'Workflow Report':	{ id:33, title:'Workflow Report',	onclick:UIManager.pageWorkflowReport, parent:31 },
			'License':					{ id:34, title:'License',				htmlid:"#altui-license-page", onclick:UIManager.pageLicense, parent:0 },
			'Evolutions':				{ id:35, title:'Evolutions',			htmlid:"#altui-evolutions", onclick:UIManager.pageEvolutions, parent:0 },
			'App Store':				{ id:36, title:'App Store',				htmlid:"#altui-app-store", onclick:UIManager.pageAppStore, parent:0 },
			'Publish App':			{ id:37, title:'Publish App',			onclick:UIManager.pageAppPublish, parent:36 },
			'Timeline':					{ id:38, title:'Timeline',				htmlid:"#menu_timeline", onclick:UIManager.pageTimeline, parent:0 },
			'My Home':					{ id:39, title:'My Home',				htmlid:"#menu_myhome", onclick:UIManager.pageMyHome, args:[], parent:0 },
			'Clone Workflow':		{ id:43, title:'Clone Workflow',			onclick:UIManager.pageCloneWorkflow, parent:31 },
			'Remote Access':		{ id:44, title:'Remote Access Login', htmlid:"#altui-remoteaccess", onclick:UIManager.pageRemoteAccess, parent:0 },
			'Reload':		{ id:45, title:'Reload Luup Engine', htmlid:"#altui-reload", onclick:UIManager.reloadEngine, parent:0 },
			'Reboot':		{ id:46, title:'Reboot Vera', htmlid:"#altui-reboot", onclick:UIManager.reboot, parent:0 },
			'CheckUpdate':		{ id:47, title:'Check for Updates', htmlid:"#altui-checkupdate", onclick:UIManager.pageCheckUpdate, parent:0 },
			'BirdEye':		{ id:48, title:'BirdEye', htmlid:"#altui-experimental", onclick:UIManager.pageBirdEye, args:[], parent:0 },
	};
	var menu = [
		{id:'menu_myhome_menu' , label:_T("My Home") , child:[
			{id:'menu_myhome' , child:null},
			{id:'altui-experimental' , child:null},
		]},
		{id:'menu_device' , child:null},
		{id:'menu_scene'  , child:null},
		{id:'menu_scene_withfavorite'  , label:_T("Scenes"), child:[
			{id:'menu_scene'  , child:null},
		]},
		{id:'menu_more'	 , label:_T("More") , child:[
			{id:'menu_room' , child:null},
			{id:'menu_plugins' , child:null},
			{id:'altui-app-store' , child:null},
			{id:'menu_timeline' , child:null},
			{id:'menu_workflow' , child:null},
			{id:-1},
			{id:'altui-tbl-watches' , label:_T("Table Watches"), child:null},
			{id:'altui-tbl-device' , label:_T("Table Devices"),child:null},
			{id:'altui-scene-triggers' , child:null},
			{id:'altui-tbl-scene' , label:_T("Table Scenes"),child:null},
			{id:'altui-tbl-controllers' , label:_T("Table Controllers"),child:null},
			{id:-1},
			{id:'altui-graph-watches' , child:null},
			{id:'altui-energy' , child:null},
			{id:'altui-childrennetwork' , child:null},
			{id:'altui-zwavenetwork' , child:null},
			{id:'altui-zwaveroutes' , child:null},
			{id:'altui-quality' , child:null}
		]},
		{id:'menu_panels', label:_T("Panels"), child:[
			{id:'altui-pages-see' , child:null},
			{id:'altui-pages-edit' , child:null},
		]},
		{id:'menu_misc' , label:_T("Misc"), child:[
			{id:'altui-remoteaccess' , child:null},
			{id:-1},
			{id:'altui-reload' , child:null},
			{id:'altui-reboot' , child:null},
			{id:'altui-luastart' , label:_T("Lua Startup"), child:null},
			{id:'altui-luatest' , label:_T("Lua Code Test"), child:null},
			{id:'altui-oscommand' , child:null},
			{id:-1},
			{id:'altui-checkupdate' , child:null},
			{id:'altui-optimize' , child:null},
			{id:'altui-theme-selector' , child:null},
			{id:'altui-localize' , label:_T("Localizations"), child:null},
			{id:'altui-debugtools' , label:_T("Debug Tools"), child:null},
			{id:-1},
			{id:'altui-license-page' , child:null},
			{id:'altui-credits' , child:null},
			{id:'altui-evolutions' , child:null},
			{id:'altui-support' , label:_T("Support"), href:'https://community.getvera.com/c/plugins-and-plugin-development/alternate-ui-to-ui7', child:null}
		]},
	];
	var itemtemplate = `
		<li class="nav-item">
		<a id="{0}" class="nav-link" href="javascript:void(0)">{1}</a>
		</li>`;
	var dropdowntemplate = `
		<li id="{0}" class="nav-item dropdown">
		<a class="nav-link dropdown-toggle" href="javascript:void(0)" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
		{1}
		</a>
		<div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
		{2}
		</div>
		</li>`;
	var dropdownItemTemplate='<a id="{0}" class="dropdown-item {2}" href="javascript:void(0)" {3} >{1}</a>'
	return {

		generateMenu: function() {
			var htmlmenu = "";
			var mapidtopage = {};

			function _generateChildMenu(items) {
				var html="";
				$.each(items, function(idx,menuitem) {
					if (menuitem.id==-1)
						html += '<div class="dropdown-divider"></div>'
					else {
						var label = menuitem.label || mapidtopage[menuitem.id].title
						if (menuitem.href) {
							html += '<a id="{2}" class="dropdown-item" target="_blank" href="{1}">{0}</a>'.format(_T(label),menuitem.href,menuitem.id)
						} else {
							html += dropdownItemTemplate.format(menuitem.id,_T(label),"")
						}
					}
				});
				return html;
			};

			$.each(_pages, function(idx,page) {
				if (page.htmlid) {
					mapidtopage[page.htmlid.substr(1)] = page;
				}
			});

			$.each(menu, function(idx,menuitem) {
				var label = menuitem.label || mapidtopage[menuitem.id].title
				if (menuitem.child==null) {
					htmlmenu += itemtemplate.format( menuitem.id , _T(label) )
				} else {
					htmlmenu += dropdowntemplate.format( menuitem.id, _T(label) , _generateChildMenu(menuitem.child) )
				}
			});
			return htmlmenu
		},

		addPage: function (page) {
			if (page.id!=undefined && page.parent!=undefined && page.title!=undefined && _pages[page.title]==undefined)
			{
				var id = Math.max.apply(null,($.map(_pages, function(p) { return p.id }))) +1;
				page.id = id;
				_pages[ page.title ] = page;
				return page.id
			}
			return null;	// error
		},
		getPage : function(title) {
			return _pages[title]
		},
		getParentPage: function(page) {
			if (page==undefined)
				return null;
			var parent = null;
			$.each(_pages, function(k,p) {
				if (p.id == page.parent) {
					parent = p;
					return false;
				}
			});
			return parent
		},
		leanMode:function() {
			// lean layout if requested
			if ( getQueryStringValue("Layout") == 'lean') {
				$("#altui-pagemessage").remove();
				$("#navbar").remove();
				if ( getQueryStringValue("nPage") != '') {
					$("ul.nav-tabs").remove();
				}
				// $(".container-fluid").css("margin-top","-60px");
				// $(".container-fluid").find(".col-12").first().removeClass('col-sm-push-1').removeClass('col-sm-10');
			}
		},
		displayPage: function( code, args ) {
			if (_pages[code]) {
				var pageargs = [].concat( _pages[code].args || [] );
				pageargs = pageargs.concat( args || [] );
				(_pages[code].onclick).apply(UIManager,pageargs);
			}
			UIControler.leanMode();
		},
		changePage: function(code,args) {
			UIControler.displayPage(code,args);
		},
		getPagesIDs :function() {
			var arr=[];
			$.each(_pages, function(k,v) {
				if (v.htmlid != undefined)
					arr.push(v.htmlid)
			});
			return arr;
		},
		onClickHtml: function(id) {
			$.each(_pages, function(key,val) {
				if (val.htmlid == id ){
					UIControler.changePage(key)
					return false;
				}
			});
			return false;
		},
		updateFavoriteScene: function ( ) {

			var favorites = MyLocalStorage.getSettings("Favorites")
			if (favorites!=null) {
				var map = $.map(favorites.scene, function( bFav ,altuiid ) {
					if (bFav==true) {
						var scene = MultiBox.getSceneByAltuiID(altuiid)
						return {name:scene.name, altuiid:altuiid}
					}
				});
				if (map.length>0) {
					$("#menu_scene_withfavorite").show();
					$("#menu_scene").hide();
					map.sort(function(a, b){
						var a1= a.name.toLowerCase(), b1= b.name.toLowerCase();
						if(a1== b1) return 0;
						return a1> b1? 1: -1;
					});
					$(".altui-dropdown-scene-favorite").remove()
					$.each(map, function( idx,entry) {
						var item = dropdownItemTemplate.format(entry.altuiid,entry.name,'altui-dropdown-scene-favorite','data-altuiid="{0}"'.format(entry.altuiid))
						$("#menu_scene_withfavorite").find("div.dropdown-menu").append(item);
					})
				} else {
					$("#menu_scene_withfavorite").hide();
					$("#menu_scene").show();
				}
			}
		}
	}
})(window);
