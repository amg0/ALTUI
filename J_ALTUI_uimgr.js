//#  sourceURL=J_ALTUI_uimgr.js
// "use strict"; 
// http://192.168.1.16:3480/data_request?id=lr_ALTUI_Handler&command=home
// ALTUI: This program is free software: you can redistribute it and/or modify
// it under the condition that it is for private or home useage and 
// this whole comment is reproduced in the source code file
// Commercial utilisation is not authorized without the appropriate
// written devagreement from amg0 / alexis . mermet @ gmail . com
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 

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

/*
// NOTE FORCE A DEVICE RECONFIGURATION
Request URL:http://192.168.1.16/port_49451/upnp/control/dev_196
Request Method:POST
Status Code:200 OK
<?xml version="1.0"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
<s:Body>
    <u:Reconfigure xmlns:u="urn:schemas-micasaverde-com:service:HaDevice:1"/>
</s:Body>
</s:Envelope>
*/
//
// Blakc iphone6 //drive.google.com/uc?id=0B6TVdm2A9rnNakxEdDdYVWVxMnM&authuser=0&export=download
// Black : //docs.google.com/uc?authuser=0&id=0B6TVdm2A9rnNLWlIeEZDN1ZGU0k&export=download    
// Transparent : //drive.google.com/uc?id=0B6TVdm2A9rnNMkx5M0FsLWk2djg&authuser=0&export=download

// UIManager.loadScript('https://www.google.com/jsapi?autoload={"modules":[{"name":"visualization","version":"1","packages":["corechart","table","gauge"]}]}');
var ALTUI_revision = "$Revision: 1787 $";
var ALTUI_registered = false;
var NULL_DEVICE = "0-0";
var NULL_SCENE = "0-0";
var NULL_ROOM = "0-0";
var _HouseModes = [];
var deviceModalTemplate = "";
var deviceActionModalTemplate = "";
var defaultDialogModalTemplate = "";
var wattTemplate = "<span class='altui-watts '>{0} <small>Watts</small></span>";
// 0:modeid 1:modetext 2:modeclss for bitmap 3:preset_unselected or preset_selected
var houseModeButtonTemplate = "  <button type='button' class='btn btn-default altui-housemode'><div>{1}</div><div id='altui-mode{0}' class='{2} {3} housemode'></div></button>";							
var leftNavButtonTemplate = "<button id='{0}' data-altuiid='{1}' type='button' class='altui-leftbutton btn btn-default'>{2}</button>";
var deleteGlyph = "<span class='glyphicon glyphicon-trash text-danger' aria-hidden='true' data-toggle='tooltip' data-placement='bottom' title='Delete'></span>";
var copyGlyph = "<span class='glyphicon glyphicon-copy' aria-hidden='true' data-toggle='tooltip' data-placement='bottom' title='Copy'></span>";
var glyphTemplate = "<span class='glyphicon glyphicon-{0} {2}' aria-hidden='true' data-toggle='tooltip' data-placement='bottom' title='{1}' ></span>";
var hiddenGlyph = "<span class='glyphicon glyphicon-eye-close' aria-hidden='true' data-toggle='tooltip' data-placement='bottom' title='Hidden'></span>";
var invisibleGlyph = "<span class='glyphicon glyphicon-ban-circle' aria-hidden='true' data-toggle='tooltip' data-placement='bottom' title='Invisible'></span>";
var timeGlyph="<span class='glyphicon glyphicon-time' aria-hidden='true' data-toggle='tooltip' data-placement='bottom' title='time'></span>";
var okGlyph="<span class='glyphicon glyphicon-ok' aria-hidden='true' data-toggle='tooltip' data-placement='bottom' title='OK'></span>";
var plusGlyph="<span class='glyphicon glyphicon-plus' aria-hidden='true' data-toggle='tooltip' data-placement='bottom' title='Add'></span>";
var saveGlyph="<span class='glyphicon glyphicon-save' aria-hidden='true' data-toggle='tooltip' data-placement='bottom' title='Save'></span>";
var labelGlyph="<span class='glyphicon glyphicon-font' aria-hidden='true' data-toggle='tooltip' data-placement='bottom' title='Label'></span>";
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
var glyphList = [
	'adjust',
	'alert',
	'align-center',
	'align-justify',
	'align-left',
	'align-right',
	'apple',
	'arrow-down',
	'arrow-left',
	'arrow-right',
	'arrow-up',
	'asterisk',
	'baby-formula',
	'backward',
	'ban-circle',
	'barcode',
	'bed',
	'bell',
	'bishop',
	'bitcoin',
	'blackboard',
	'bold',
	'book',
	'bookmark',
	'briefcase',
	'btc',
	'bullhorn',
	'calendar',
	'camera',
	'cd',
	'certificate',
	'check',
	'chevron-down',
	'chevron-left',
	'chevron-right',
	'chevron-up',
	'circle-arrow-down',
	'circle-arrow-left',
	'circle-arrow-right',
	'circle-arrow-up',
	'cloud',
	'cloud-download',
	'cloud-upload',
	'cog',
	'collapse-down',
	'collapse-up',
	'comment',
	'compressed',
	'console',
	'copy',
	'copyright-mark',
	'credit-card',
	'cutlery',
	'dashboard',
	'download',
	'download-alt',
	'duplicate',
	'earphone',
	'edit',
	'education',
	'eject',
	'envelope',
	'equalizer',
	'erase',
	'eur',
	'euro',
	'exclamation-sign',
	'expand',
	'export',
	'eye-close',
	'eye-open',
	'facetime-video',
	'fast-backward',
	'fast-forward',
	'file',
	'film',
	'filter',
	'fire',
	'flag',
	'flash',
	'floppy-disk',
	'floppy-open',
	'floppy-remove',
	'floppy-save',
	'floppy-saved',
	'folder-close',
	'folder-open',
	'font',
	'forward',
	'fullscreen',
	'gbp',
	'gift',
	'glass',
	'globe',
	'grain',
	'hand-down',
	'hand-left',
	'hand-right',
	'hand-up',
	'hdd',
	'hd-video',
	'header',
	'headphones',
	'heart',
	'heart-empty',
	'home',
	'hourglass',
	'ice-lolly',
	'ice-lolly-tasted',
	'import',
	'inbox',
	'indent-left',
	'indent-right',
	'info-sign',
	'italic',
	'jpy',
	'king',
	'knight',
	'lamp',
	'leaf',
	'level-up',
	'link',
	'list',
	'list-alt',
	'lock',
	'log-in',
	'log-out',
	'magnet',
	'map-marker',
	'menu-down',
	'menu-hamburger',
	'menu-left',
	'menu-right',
	'menu-up',
	'minus',
	'minus-sign',
	'modal-window',
	'move',
	'music',
	'new-window',
	'object-align-bottom',
	'object-align-horizontal',
	'object-align-left',
	'object-align-right',
	'object-align-top',
	'object-align-vertical',
	'off',
	'oil',
	'ok',
	'ok-circle',
	'ok-sign',
	'open',
	'open-file',
	'option-horizontal',
	'option-vertical',
	'paperclip',
	'paste',
	'pause',
	'pawn',
	'pencil',
	'phone',
	'phone-alt',
	'picture',
	'piggy-bank',
	'plane',
	'play',
	'play-circle',
	'plus',
	'plus-sign',
	'print',
	'pushpin',
	'qrcode',
	'queen',
	'question-sign',
	'random',
	'record',
	'refresh',
	'registration-mark',
	'remove',
	'remove-circle',
	'remove-sign',
	'repeat',
	'resize-full',
	'resize-horizontal',
	'resize-small',
	'resize-vertical',
	'retweet',
	'road',
	'rub',
	'ruble',
	'save',
	'saved',
	'save-file',
	'scale',
	'scissors',
	'screenshot',
	'sd-video',
	'search',
	'send',
	'share',
	'share-alt',
	'shopping-cart',
	'signal',
	'sort',
	'sort-by-alphabet',
	'sort-by-alphabet-alt',
	'sort-by-attributes',
	'sort-by-attributes-alt',
	'sort-by-order',
	'sort-by-order-alt',
	'sound-5-1',
	'sound-6-1',
	'sound-7-1',
	'sound-dolby',
	'sound-stereo',
	'star',
	'star-empty',
	'stats',
	'step-backward',
	'step-forward',
	'stop',
	'subscript',
	'subtitles',
	'sunglasses',
	'superscript',
	'tag',
	'tags',
	'tasks',
	'tent',
	'text-background',
	'text-color',
	'text-height',
	'text-size',
	'text-width',
	'th',
	'th-large',
	'th-list',
	'thumbs-down',
	'thumbs-up',
	'time',
	'tint',
	'tower',
	'transfer',
	'trash',
	'tree-conifer',
	'tree-deciduous',
	'triangle-bottom',
	'triangle-left',
	'triangle-right',
	'triangle-top',
	'unchecked',
	'upload',
	'usd',
	'user',
	'volume-down',
	'volume-off',
	'volume-up',
	'warning-sign',
	'wrench',
	'xbt',
	'yen',
	'zoom-in',
	'zoom-out' 
]
var xsbuttonTemplate = "<button id='{0}' type='button' class='{1} btn btn-default btn-xs' aria-label='tbd' title='{3}'>{2}</button>";
var smallbuttonTemplate = "<button id='{0}' type='button' class='{1} btn btn-default btn-sm' aria-label='tbd' title='{3}'>{2}</button>";
var buttonTemplate 		= "<button id='{0}' type='button' class='{1} btn btn-{3}' aria-label='tbd' title='{4}'>{2}</button>";
var buttonDebugHtml = "<button type='button' class='btn btn-default' id='altui-debug-btn' >Debug<span class='caret'></span></button>";
var cameraURI="data:image/png;base64,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";
var defaultIconSrc="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAASJSURBVHja7Jp7aI5RHMff123CMOYyMmFY5LZYI5umFmHhD2pyyYzYkju5hCWX0jZKM9rEkCy5tJostxWRIteZe5FLyW2Y68z35Pfq9Os8z573eT3vu9fOr76d5zzn8jyf59x+57yvu6amxlWfrIGrnpkG1sAaWANrYA2sgTWwBnbKGnmT2e12/7MHb8vOaYhgEJQA9YN6Qj2g5lCoSFu4eNF1K3V5sx9o5M+vC0jxvCRoKjQOalmnW9gH0BYI5kKLoE5B06Vttug8KBMKqyX7S+g+9Ab6SGHwAAN2MIICqL9BlifQMegcdAHj9X1QtjBAxcy2BNoENWbJ1VARtAO6BMiaoO7SgG2C4AA0SZF8CFoDyMf/xRgGbCsExVA8S3oEzQJomUG5AQgSoSFQNNSZlqZ4q8uS34Hx0s0MYA+KSQsv/pHlD0eQQctTVFC1MDkQRQrYtQDdoOgFa6F0qGmwdun10Fh2Lx2wOxnseAS7ofZGDhP0DHoAVUJvnQB2e+OWcdcSEKMRnGTZlgN2K+sBWdACRZXfoBPQYeg8ytmC9IrBLjB5T+VQFynLXrz0TDZrC5gJrKrv0HYoG/lf+dpq/vKlMxnsbRqbcsuqYC9B0wH6MGi2h4CJRDCfjT+x9HyR7mUpYIXDkRAoWF9aeBXzovIAcUX6IBMVYzYTedZb+JghCCIo+gFl3gV00sILtcalGHchdPsr1B0v9lJaeiqgjlLRXKRnmED2QpAGjYH6iEdJyeJZp6FCEarcUW8Y7HTpKRKssD0eWLLVDPYqbQtVoGFQAX2gZVBfBuuiuoSDUgpdRv4Yf4/haSxewDyodLZZSMUH+a6AFXDCdUxVQBpZrJj0UHamX4DxoDb0UI/dAsw1KZ5KfrDH9iP9pqKe3mLdhSJtvLNY6vbYhfa2hRNZmRKWPoPFtxhMSkehcJb0ArpRi2THJA91DXR6lo5j8dMSSFeacDx2Ea17T1HHQpbPRSccscj/3KR3tUVwl7V0LjTMyRaOZnG5O49gacUGrbtUUe8KM1iyHKgduzcUdSY62cK9pOvXzPftx/JeUJRPUnRl8dEO03L3t8VRd7X0oUYpJkuPpdAxkSPAHaTrpyytG4uXK8onKO7FsAM74YWJQ4EqyWffZfJO8U526VA27mRrK13/NPCQult4xmyUrZLiG6GuJvmjnOzS8oa+QnG6USZ5XyprVkv9wiM7L3XlOOaz+8zgVWYzXxhp+Raq+GSSJjb/K9kEl2/BKfkRkEM8i3bfJC0NH61SioufYdawPJsVK0V5XQY+S742t32ALWU95jWC4+yIKFpRtszx/bAPVqaY3V+RM2Lm0rYkJ0NlhX4707J5eDCHLTPF1PJmNhJKVtwvQU8YW2d/LiXLJydiOMWTDWBqs0oLM3jAu7QYm78QTHb9+UXCromZOcXOzzYB+csDHRiMoMMBb004NMmoo8RfBwD/Cvo57XTWQZ8tFjsi3E6UPeW3My0njDYOU+hMS/jWEZL7egc6Q4cJqu2mcwfx/4Pp/2lpYA2sgTWwBtbAGlgDO2W/BRgADRV6RjlErQoAAAAASUVORK5CYII="
var _timerTypes = [];
var _timerDOW = [];
var _timerRelative = [];
var _timerUnits = [
	{value:'h',text:'h'},
	{value:'m',text:'m'}
];
	
		// margin-left: 14px;		\
		// margin-top: 5px;		\

var styles ="						\
	html {							\
		position: relative;			\
		min-height: 100%;			\
	}				\
	body {				\
	  /* Margin bottom by footer height */		\
	  /* margin-bottom: 140px;	*/				\
	}				\
	#wrap {				\
	}					\
	#filler {			\
		height: 140px;	\
	}					\
	footer {					\
	  position: absolute;		\
	  bottom: 0;				\
	  width: 100%;				\
	  z-index: -1;				\
	}							\
	@-webkit-keyframes blinker {  	\
	  50% { opacity: 0.0; }	\
	}	\
	@keyframes blinker {  	\
	  50% { opacity: 0.0; }	\
	}	\
    @-webkit-keyframes horiz_rotate {	\
		0% {											\
			-webkit-transform: translateX(10px) rotateX(0deg); 			\
			transform: translateX(10px) rotateX(0deg); 					\
		}												\
		50% {											\
			-webkit-transform: translateX(10px) rotateX(180deg); 		\
			transform: translateX(10px) rotateX(180deg); 				\
		}												\
		100% {											\
			-webkit-transform: translateX(10px) rotateX(0deg); 			\
			transform: translateX(10px) rotateX(0deg); 					\
		}												\
	}										\
	@keyframes horiz_rotate	{	\
		0% {											\
			-webkit-transform: translateX(10px) rotateX(0deg); 			\
			transform: translateX(10px) rotateX(0deg); 					\
		}												\
		50% {											\
			-webkit-transform: translateX(10px) rotateX(180deg); 		\
			transform: translateX(10px) rotateX(180deg); 				\
		}												\
		100% {											\
			-webkit-transform: translateX(10px) rotateX(0deg); 			\
			transform: translateX(10px) rotateX(0deg); 					\
		}												\
	}										\
	@-webkit-keyframes spin {							\
		0% {											\
			-webkit-transform: rotate(0deg);			\
			transform: rotate(0deg); 	\
		}												\
		100% {											\
			-webkit-transform: rotate(359deg);			\
			transform: rotate(359deg); 				\
		}												\
	}													\
	@keyframes spin {									\
		0% {											\
			-webkit-transform: rotate(0deg);			\
			transform: rotate(0deg); 					\
		}												\
		100% {											\
			-webkit-transform: rotate(359deg);			\
			transform: rotate(359deg);					\
		}												\
	}													\
	#altui-license {						\
	}										\
	#altui-license.license-rotated {		\
		-webkit-animation: horiz_rotate 3s ease-in-out 0s 5 normal;		\
		animation: horiz_rotate 3s ease-in-out 0s 5 normal;				\
	}										\
	.big-glyph  {				\
		font-size: 22px;		\
		margin: 5px;			\
	}							\
	.glyphicon-spin {									\
		-webkit-animation: spin 1000ms infinite linear; \
		animation: spin 1000ms infinite linear;			\
	}													\
	.onoffswitch { \
		position: relative; width: 55px; 		\
		-webkit-user-select:none; -moz-user-select:none; -ms-user-select: none; \
	} \
	.onoffswitch-checkbox { \
		display: none; \
	} \
	.onoffswitch-label { \
		display: block; overflow: hidden; cursor: pointer; \
		border: 2px solid #ADAAAA; border-radius: 20px; \
		margin-top: 3px;	\
	} \
	.onoffswitch-inner { \
		display: block; width: 200%; margin-left: -100%; \
		height: 20px; \
		transition: margin 0.3s ease-in 0s; \
	} \
	.onoffswitch-inner:before, .onoffswitch-inner:after { \
		display: block; float: left; width: 50%; padding: 0; line-height: 20px; \
		font-size: 14px; color: white; font-family: Trebuchet, Arial, sans-serif; font-weight: bold; \
		box-sizing: border-box; \
	} \
	.onoffswitch-inner:before { \
		content: '\\00a0'; \
		padding-left: 9px; \
		background-color: #34A7C1; color: #FFFFFF; \
	} \
	.onoffswitch-inner:after { \
		content: '\\00a0'; \
		padding-right: 9px; \
		background-color: #D4D4D4; color: #999999; \
		text-align: right; \
	} \
	.onoffswitch-switch { \
		display: block; width: 28px; margin: 0px; margin-top: -1px; margin-bottom: -1px;\
		background: #FFFFFF; \
		position: absolute; top: 0; bottom: 0; \
		right: 27px; \
		border: 2px solid #ADAAAA; border-radius: 20px; \
		transition: all 0.3s ease-in 0s;  \
	} \
	.onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-inner { \
		margin-left: 0; \
	} \
	.onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-switch { \
		right: 0px;  \
	} \
	.on-off-device .glyphicon-spin {		\
		top: 9px;							\
		left: 24px;							\
	}		\
	.blocklyTreeLabel {			\
		color: black;			\
	}							\
	.altui-theme-label{			\
		font-size: 12px;		\
	}							\
	.altui-theme-thumbnail{		\
		padding-bottom: 5px;	\
		padding-top: 5px;	\
	}							\
	.altui-theme-thumbnail:hover {		\
		cursor: pointer;		\
		border-width:2px;		\
		border-color: green;		\
	}							\
	#altui-background {			\
		position:fixed;			\
		top:0;					\
		left:0;					\
		width:100%;				\
		height:100%;			\
		z-index: -1;			\
	}							\
	.altui-store-carousel { margin-bottom:10px; }					\
	.altui-store-categories { width: 100%; overflow: hidden; }					\
	.altui-features-box { height:200px; width: 100%; background:grey; opacity:0.4; }	\
	.altui-store-install-btn , .altui-store-mcvinstall-btn {  margin-left:1px; margin-right:1px; }		\
	.altui-plugin-pageswitch {  font-size: 20px; }					\
	button.altui-plugin-category-btn {  padding-left:4px; padding-right:4px; }					\
	.altui-plugin-publish-btn { width: 100%;  }		\
	.altui-pluginbox , .altui-pageswitchbox, #altui-plugin-name-filter { padding:4px; }				\
	.altui-pluginbox .panel-body { padding-left:5px; padding-right:5px; padding-top:5px; padding-bottom:5px;}	\
	.form-control.altui-version-selector { padding:0px; border:0px; background:darkgrey; }				\
	.altui-plugin-title { height: 21px;  overflow:hidden; }		\
	.altui-plugin-version { font-size:1em;  }		\
	.altui-plugin-version .input-sm { height: 20px;  line-height: 20px; }		\
	.altui-sortable-placeholder { border: 2px solid blue; background-color: blue;  opacity: 0.5; }		\
	.altui-ace-editor .ui-resizable-helper { border: 2px dotted #00F; }		\
	.altui-ace-editor .ui-resizable-handle { background-color: white; }		\
	#altui-editor-text .ui-resizable-helper { border: 2px dotted #00F; }	\
	#altui-editor-text .ui-resizable-handle { background-color: white; }	\
	.altui-editor-area { width:100%; height:100% }	\
	.altui-variable-title {	\
	}					\
	.altui-variable-buttons {	\
	}					\
	.altui-variable-value {	\
		max-width: 200px;			\
		overflow: hidden;		\
		text-overflow: ellipsis;	\
		white-space: nowrap;		\
	}					\
	.altui-variable-value-history td:first-child {	\
		width:170px;	\
	}					\
	button.altui-variable-history,button.altui-variable-push,button.altui-variable-delete {	\
		padding-top: 	1px;	\
		padding-bottom: 1px;	\
	}					\
	.altui-warningicon, .altui-infoicon {	\
		font-size: 25px;\
		padding-left: 5px;		\
		padding-right: 5px;		\
	}					\
	.altui-widget-frame-div , .solid-border {	\
		border:1px solid;\
	}					\
	.altui-widget-iframe {	\
		width:100%;		\
		height:100%;	\
		margin: 0;	\
		padding-top: 10px; \
		padding-left: 0px; \
		padding-right: 10px; \
		padding-bottom: 10px; \
		border: 0; \
	}					\
	.altui-colorpicker-replacer { \
	}	\
	.sp-dd { \
	}	\
	.fill {	\
		min-height:100%;\
		max-height:100%;\
		height:100%;\
	}					\
	#altui-toggle-messages { \
		margin-bottom: 2px;				\
	} \
	div#altui-pagemessage-panel {	\
		max-height:100px;	\
		height:100px;		\
		background-color: #f5f5f5;	\
		overflow-y: auto; 			\
	}						\
	div#altui-pagemessage-panel td {	\
		color:black;	\
	}						\
	.altui-leftnav .altui-edittoolbox { \
		border:1px solid;\
		margin-top: -1px;		\
		padding-top: 4px;		\
		padding-bottom: 4px;	\
		padding-left: 4px;		\
		padding-right: 4px;		\
		font-size: 16px;		\
	}							\
	.altui-leftnav div.altui-widget { \
		border:1px solid;	\
		margin-top: -1px;		\
		padding-top: 4px;		\
		padding-bottom: 4px;	\
	}							\
	.altui-leftnav div.altui-edittools { \
		margin-top: -1px;	\
		display: inline;	\
		padding: 4px;		\
	}						\
	.altui-custompage-canvas div.altui-widget:hover { \
		cursor: move; \
	}		\
	.altui-custompage-canvas *[disabled] { \
		cursor: move; \
	}		\
	.altui-custompage-canvas div.altui-widget.ui-selecting { \
		outline-style: solid;	\
		outline-color: red;		\
		outline-width: 2px;		\
	}							\
	.altui-custompage-canvas div.altui-widget.ui-selected { \
		outline-style: solid;	\
		outline-color: green;		\
		outline-width: 2px;		\
	}							\
	div.altui-gauge-div table { \
	  background-color: transparent;	\
	}							\
	.altui-widget-delete {		\
		margin-top: -1px;		\
		font-size:16px;			\
		border:1px solid; \
		padding-top: 4px;		\
		padding-bottom: 4px;	\
		text-align: center;		\
	}\
	.altui-debug {	\
		border:1px solid;\
		height:100px;\
	}					\
	.altui-custompage-canvas {	\
		position: relative;		\
	}							\
	.altui-tabcontent-fix	{	\
	  padding-top: 15px; \
	  padding-left: 15px; \
	  padding-bottom: 15px; \
	  padding-right: 15px; \
	}	\
	.altui-device-keyvariables {	\
	}							\
	.altui-device-controlpanel .panel-body {	\
		padding-top: 0px;\
		padding-bottom: 0px;\
	}	\
	.altui-devtab-content {				\
		font-size:12px;					\
		font-family:Arial;				\
	}									\
	.altui-device-title {		\
		overflow: hidden;		\
		height: 28px;			\
	}		\
	.altui-device-title-input {		\
		width: 70%;				\
		height: 20px;			\
	}		\
	.altui-scene-title-input {		\
		width: 60%;				\
		height: 20px;			\
	}		\
	.altui-mainpanel , .altui-device-toolbar{		\
		margin-top: 2px;			\
		margin-bottom: 2px;			\
	}		\
	.altui-device-toolbar .btn-group{		\
		margin-left: 2px;			\
		margin-right: 2px;			\
	}		\
	div.altui-device-heading, div.altui-scene-heading {	\
		height:30px;\
		padding-top: 5px;\
		padding-right: 10px;\
		padding-bottom: 5px;\
		padding-left: 10px;\
	}\
	div.altui-device-body {\
		height:52px;\
		padding-top: 0px;\
		padding-right: 5px;\
		padding-bottom: 5px;\
		padding-left: 5px;\
	}\
	div.altui-scene-body {\
		height:85px;\
		padding-top: 3px;\
		padding-right: 5px;\
		padding-bottom: 3px;\
		padding-left: 5px;\
	}\
	#altui-device-filter-form { \
		margin-top:5px;			\
	}\
	div.altui-battery { \
		margin-top:2px;			\
		margin-right:5px;		\
		margin-bottom:0px;		\
	}\
	div.altui-battery .progress-bar { \
		color: black;			\
	}\
	.caret.caret-reversed {				\
		border-top-width: 0;			\
		border-bottom: 4px solid ;	\
	}			\
	.form-inline > * {	\
		margin:5px 3px;	\
	}					\
	div.altui-scene-body button {	\
		margin-left:1px;			\
		margin-right:1px;			\
		margin-top:1px;				\
		margin-bottom:1px;			\
	}\
	.altui-scene-history {	\
		clear: left;	\
	}						\
	.altui-editscene {		\
		clear: left;	\
	}						\
	.altui-runscene {		\
		width: 123px;		\
	}						\
	.altui-hint {		\
		padding-left:10px;\
		padding-right:10px;\
	}						\
	.altui-scene-date{		\
		clear: right;		\
		width: 80px;		\
		text-align: right;	\
	}						\
	.altui-pausescene {		\
		padding-right: 3px;	\
		cursor: pointer;	\
	}				\
	.altui-pauseworkflow {		\
		padding-right: 3px;	\
		cursor: pointer;	\
	}				\
	img.altui-plugin-icon { 			\
		font-size: 1.5em;			\
		height: 35px;				\
	}								\
	div#altui-editor-text, div#altui-luascene {		\
		height:300px;				\
	}								\
	div.altui-ace-editor, div#altui-editor-sample {		\
		height:100px;				\
	}								\
	div.altui-favorites-container	{		\
		padding-left: 0px;		\
		padding-right: 0px;		\
	}		\
	div.altui-favorites-housemode, div.altui-favorites-device, div.altui-favorites-scene {				\
		width: 25%;			\
		padding-bottom: 25%;		/* = width for a square aspect ratio */ \
		position:relative;			/* so child are positioned relatve to it */  \
		margin:0%;				\
		overflow:hidden;			\
		border: 1px solid black;	\
	}		\
	div.altui-favorites-weather {		\
		width: 50%;					\
		padding-bottom: 25%;		/* 1:2 aspect ratio */ \
		position:relative;			/* so child are positioned relatve to it */  \
		margin:0%;					\
		overflow:hidden;			\
		border: 1px solid black;	\
	}\
	div.altui-favorites-device-container { \
		position:absolute;										\
		text-align:center;										\
		height:100%; /* = 100% - 2*0% padding */		\
		width:100%; /* = 100% - 2*0% padding */		\
		padding: 0% 0%;										\
	} \
	.altui-favorites-title { \
		white-space: nowrap; overflow: hidden; text-overflow: ellipsis;		\
		position:absolute; \
		z-index: 99; \
		top: 0px; \
		width: 100%; max-width: 100% \
	} \
	.altui-favorites-smalltext { \
		font-size:0.3em;	\
	} \
	div.altui-favorites-table { \
		position:absolute; \
		top: 0px; \
		display:table;		\
		width:100%;		\
		height:100%;	\
	} \
	div.altui-favorites-table-cell { \
		display:table-cell;		\
		vertical-align:middle;	\
	} \
	.altui-sonos-tile-img {\
		width:100%;	\
	}\
	div.altui-favorites-housemode:hover, div.altui-favorites-weather:hover, div.altui-favorites-device:hover, div.altui-favorites-scene:hover {				\
		cursor: pointer;		\
		border-color: green;		\
	}		\
	.altui-favorites-watts { 	\
		float: right;			\
		text-align: right;		\
		font-size: 14px;		\
		bottom: 0px;			\
		position: absolute;		\
		right: 0px;				\
	}						 	\
	.btn.altui-housemode{		\
		padding-left: 0px;		\
		padding-right: 0px;		\
	}							\
	.altui-housemode2 {			\
		width: 50%;				\
		padding-bottom: 50%;	\
		position:relative;			/* so child are positioned relatve to it */  \
		margin:0%;				\
		overflow:hidden;		\
	}	\
	.altui-housemode2:after  {			\
		content: '';	\
		position: absolute;	\
		top: 0;				\
		left: 50%; 			/* centers the left edge of the sprite */	\
		margin-left: -35px; /* this centers the actual sprite--this is half the sprite-window width. if you don't do this, the left edge will be centered instead of the center of the sprite.  */ \
		width: 70px; 		/* set window to see sprite through */		\
		height: 70px; 		/* set window to see sprite through */	\
		background-image: url('data:image/png;base64,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'); \
		background-repeat: no-repeat ; \
	}	\
	.altui-housemode2-content {			\
		position:absolute;	\
		width: 100%;	\
		height: 100%;	\
		padding: 0%	\
	}	\
	.preset_home.housemode2_unselected:after {			\
		background-position: -18px 0px; \
	}	\
	.preset_away.housemode2_unselected:after {			\
		background-position: -217px 2px;  \
	}	\
	.preset_vacation.housemode2_unselected:after {			\
		background-position: -315px 5px; \
	}	\
	.preset_night.housemode2_unselected:after {			\
		background-position: -115px 5px;  \
	}	\
	.preset_home.housemode2_selected:after {			\
		background-position: -16px -113px \
	}	\
	.preset_away.housemode2_selected:after {			\
		background-position: -215px -115px;  \
	}	\
	.preset_vacation.housemode2_selected:after {			\
		background-position: -315px -109px; \
	}	\
	.preset_night.housemode2_selected:after {			\
		background-position: -115px -112px;  \
	}	\
	.housemode-countdown {\
		font-size: 40px;	\
		z-index: 99;	 	\
		position: relative;	\
	}\
	.housemode {				\
		text-align: center;		\
		cursor: pointer;		\
		width:80px;				\
		height: 60px;			\
		font-size: 40px;		\
		background: url('data:image/png;base64,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') no-repeat;		\
	}		\
	.preset_home.preset_unselected {		\
		background-position: -17px -5px;	\
	}		\
	.preset_home.preset_selected {		\
		background-position: -17px -120px;	\
	}		\
	.preset_away.preset_unselected {		\
		background-position: -213px -5px;	\
	}		\
	.preset_away.preset_selected {		\
		background-position: -213px -120px;	\
	}		\
	.preset_night.preset_unselected {		\
		background-position: -115px -5px;	\
	}		\
	.preset_night.preset_selected {		\
		background-position: -115px -120px;	\
	}		\
	.preset_vacation.preset_unselected {		\
		background-position: -315px -5px;	\
	}		\
	.preset_vacation.preset_selected {		\
		background-position: -315px -120px;	\
	}		\
	.preset_home {		\
	  margin: auto;		\
	}		\
	.preset_away {		\
	  margin: auto;		\
	}		\
	.preset_night {		\
	  margin: auto;		\
	}		\
	.preset_vacation {		\
	  margin: auto;		\
	}		\
	.imgLogo {		\
		display: none;		\
		max-width: 150px;		\
		margin-left: auto;		\
		margin-right: auto;		\
		height: 50px;			\
		width: 50px;			\
		background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAACHDwAAjA8AAP1SAACBQAAAfXkAAOmLAAA85QAAGcxzPIV3AAAACXBIWXMAAA7BAAAOwQG4kWvtAAAAB3RJTUUH3AEJETEi55mf3wAAABh0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC45bDN+TgAAAWFJREFUaEPtmT1uwkAQRt0HKWXKSKRKQVoaCjpIDwdImY4zpEtDlRukyEGoOARnWfazNNZ4veuNZWF9i2akJ+/v7DxjywWVhcVU8eNcEWQjtomRbMQ2MZINvfjXcyYBtejasqEXI4EjAbXo2rKhF5vIDTARUPrLPjs69/rFCWr7twg27A6coDYTYcJE2DARNkyEjdEiD48vbvtx6Yw/PW9qwjGfKcn87bNeh5zS1mAMc9LXZ4wSWe9PdQGL1XdrHMRENLIX13BuchEk9jOt5EJRIn40WVAxIsv3vyYJruHB+pAYNCJIABm0cfUrmjmZpxeRIiQhQF/EQBEiSOhHOujCixDxvdbdB1KYfFPGiKT2huO6P1gk9j4IuFvyTQkPDekTkTP09wltjKUe38EiqZ8dyGFo4wC0Q+TR6BPR85pw7SgRnYgJE2HDRNgwETZMhA0TYWOQyN38P1IEFhYWA6KqrtanevVJxLYxAAAAAElFTkSuQmCC') no-repeat; \
	}		\
	.altui-leftnav {		\
		width: 100%;		\
	}		\
	.altui-breadcrumb {		\
		display: inline-block;	\
		margin-right: 10px;		\
		padding-top: 6px;		\
		padding-bottom: 6px;	\
	}		\
	.altui-controlpanel-button	{	\
		padding: 0px;\
		font-size: 13px;			\
		cursor: pointer; \
		text-align: center; \
	}		\
	.altui-button-onoff		{	\
		margin-top: 2px;	\
	}							\
	.altui-button-stateLabel {	\
	  color: #918f8f;			\
	  text-align: center;		\
	  text-transform: uppercase;	\
	  font-size: 11px;			\
	}							\
	.altui-favorite  {		\
		padding-right: 3px;	\
		cursor: pointer;	\
	}				\
	.paused {		\
	  color: red	\
	}				\
	.activated {	\
	  color: green	\
	}				\
	#altui-grid, .altui-grid {		\
		font-size: 12px;	\
	}				\
	#altui-grid th , .altui-grid th {		\
		font-size: 12px;	\
		text-transform: capitalize;	\
	}				\
	input.altui-plugin-version {		\
		display: inline;	\
		width: 44px; \
		padding-left: 3px;	\
		padding-right: 3px;	\
	}				\
	img.altui-favorite-icon {\
		width:60%;	\
		height:60%;	\
	}\
	.altui-device-icon {			\
		cursor: pointer;	\
		margin-left: 0px;	\
		margin-right: 0px;	\
		height: 50px;		\
		margin-top: 1px;	\
		width: 50px;		\
	}						\
	.altui-oscommand-configtbl th {		\
		text-transform: capitalize;		\
	}									\
	.altui-room-name  {		\
		cursor: pointer;	\
	}						\
	#altui-workflow-canvas { \
		background: lightgrey;	\
		overflow: auto;	\
	}						\
	.altui-help-button  {		\
		margin-left: 5px;	\
	}						\
	.altui-quality-color  {		\
		height: 15px;	\
		width: 30px;	\
		background: linear-gradient(to right, red , green);	\
	}						\
	.altui-quality-grey {		\
		height: 15px;	\
		width: 30px;	\
		background: grey;	\
	}						\
	.table .table {					\
	background-color:transparent;	\
	}								\
	/* JOINTJS port styling */\
	.available-magnet {\
		fill: yellow;\
	}\
	\
	/* element styling */\
	.available-cell rect {\
		stroke-dasharray: 5, 2;\
	}\
	.altui-timers , .altui-timer-instance {\
	}\
	.altui-active-state-name {\
		padding-left: 50px;\
	}\
	.altui-state-name {\
		font-size: 20px;	\
	}\
	.altui-action-kind {\
		font-size: 16px;	\
	}\
	.altui-action-details {\
		font-size: 12px;	\
	}\
	.altui-transition-name {\
		font-size: 15px;	\
	}\
	.altui-workflow-transitiondetails {\
		font-size: 12px;	\
	}\
	.altui-transition-subtitle {\
		font-size: 14px;	\
		font-weight: bold;	\
	}\
	.altui-slider-widgetui {\
		border-style: solid;	\
		border-width: 1px;		\
		border-color: green;	\
	}`\
	.altui-slider-widgetui .ui-slider .ui-slider-handle {	\
	} \
	.altui-record-indicator {	\
		color: red;	\
		float: left;\
		font-size: 32px;	\
		animation: blinker 2s linear infinite;	\
	} \
";		
var HouseModeEditor = (function() {
	function _displayModes2(htmlid,cls,modes) {
		var tmpl = "<button type='button' class='btn btn-default altui-housemode2'><div>{1}</div><div id='altui-mode{0}' class='{2} {3} housemode'></div></button>"
		var html ="<div class='housemode2'>";
				$.each(_HouseModes, function(idx,mode) {
					var select = ($.inArray( mode.id.toString(), modes) == -1) ? "housemode2_unselected" : "housemode2_selected";
					html += "<div id='altui-mode{3}' class='altui-housemode2 pull-left {1} {2}'><div class='altui-housemode2-content'><small class='text-muted'>{0}</small><div class='housemode-countdown'></div></div></div>".format( mode.text, mode.cls, select, mode.id);
				});
		html+="</div>";
		return html;
	};
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
		displayModes2 : _displayModes2,
		runActions : _runActions,					// ( domroot, onclickCB ) 
		getSelectedLabels : _getSelectedLabels,
		getSelectedModes : _getSelectedModes
	}
})();
		
var ALTUI_Templates = null;
var ALTUI_Templates_Factory= function() {
	var _dropdownTemplate =  "";		
	_dropdownTemplate +=  "<div class='btn-group pull-right'>";
	_dropdownTemplate += "<button class='btn btn-default btn-xs dropdown-toggle altui-device-command' type='button' data-toggle='dropdown' aria-expanded='false'>"; 
	_dropdownTemplate += "<span class='caret'></span>";
	_dropdownTemplate += "</button>";
	_dropdownTemplate += "<ul class='dropdown-menu' role='menu'>";
	_dropdownTemplate += "<li><a id='{0}' class='altui-device-variables' href='#' role='menuitem'>Variables</a></li>";
	_dropdownTemplate += "<li><a id='{0}' class='altui-device-actions' href='#' role='menuitem'>Actions</a></li>";
	_dropdownTemplate += "<li><a id='{0}' class='altui-device-controlpanelitem' href='#' role='menuitem'>Control Panel</a></li>";
	_dropdownTemplate += "<li><a id='{0}' class='altui-device-hideshowtoggle' href='#' role='menuitem'>{1}</a></li>";
	_dropdownTemplate += "</ul></div>";
	_dropdownTemplate += "<div class='pull-right text-muted'><small>#{0} </small></div>";
	
	var _batteryHtmlTemplate="";
	_batteryHtmlTemplate+="<div class='altui-battery progress pull-right' style='width: 35px; height: 15px;'>";
	_batteryHtmlTemplate+="  <div class='progress-bar {1}' role='progressbar' aria-valuenow='60' aria-valuemin='0' aria-valuemax='100' style='min-width: 1em; width: {0}%;'>";
	_batteryHtmlTemplate+="    {0}%";
	_batteryHtmlTemplate+="  </div>";
	_batteryHtmlTemplate+="</div>";
	
	var _devicecontainerTemplate	= "<div class='panel panel-{4} altui-device' data-altuiid='{5}' id='{0}'>"
	_devicecontainerTemplate	+=		"<div class='panel-heading altui-device-heading'>{6} {7}<div class='panel-title altui-device-title' data-toggle='tooltip' data-placement='left' title='{2}'>{1}</div></div>";
	_devicecontainerTemplate	+=  	"<div class='panel-body altui-device-body'>";
	_devicecontainerTemplate	+= 	  	"{8}{3}";
	_devicecontainerTemplate	+= 	  "</div>";
	_devicecontainerTemplate	+= 	  "</div>";
	
	var _deviceEmptyContainerTemplate="<div class=' {2} '>";
		_deviceEmptyContainerTemplate	+= 		"<div class='panel panel-default altui-device' data-altuiid='{1}' id='{0}'>"
		_deviceEmptyContainerTemplate	+= 	  	"</div>";
		_deviceEmptyContainerTemplate	+= 	"</div>";		
		
	// 0: variable , 1: value , 2: service , 3: id, 4: push btn color class, 5: watch provider name
	var _deviceVariableLineTemplate = "  <tr>";
		// deviceVariableLineTemplate += "         <th scope='row'>1</th>";
		_deviceVariableLineTemplate += "         <td class='altui-variable-title'><span title='{2}'>{0}</span></td>";
		_deviceVariableLineTemplate += 	("<td class='altui-variable-buttons'>"+
			smallbuttonTemplate.format( '{3}', 'altui-variable-history', glyphTemplate.format( "calendar", _T("History"), "" ),_T('History'))+
			smallbuttonTemplate.format( '{3}', 'altui-variable-push {4}', glyphTemplate.format( "signal", _T("Push to {5}"), "" ),_T("Push to {5}"))+
			smallbuttonTemplate.format( '{3}', 'altui-variable-delete', deleteGlyph,_T('Delete'))+
			"</td>");
		_deviceVariableLineTemplate += "         <td id='{3}' class='altui-variable-value' >{1}</td>";
		_deviceVariableLineTemplate += "     </tr>";

	// 0:bootgrid classes 1:altuiid 2:htmlid 3: name 4:right header buttons 5:panel body 6:left header buttons
	var _workflowContainerTemplate=		"<div class='{0} '>";
		_workflowContainerTemplate	+= 		"<div class='panel panel-default altui-workflow' data-altuiid='{1}' id='{2}'>"
		_workflowContainerTemplate	+= 		"<div class='panel-heading'>{6} <span class='altui-workflow-title-name'>{3}</span>{4}<small class='text-muted pull-right'> #{1} </small>"
		_workflowContainerTemplate	+= 	  	"</div>";
		_workflowContainerTemplate	+= 		"<div class='panel-body'>{5}"
		_workflowContainerTemplate	+= 	  	"<div class='altui-active-state-name'></div>";
		_workflowContainerTemplate	+= 	  	"</div>";
		_workflowContainerTemplate	+= 	  	"</div>";
		_workflowContainerTemplate	+= 	"</div>";		
		
	return {
		deviceVariableLineTemplate : _deviceVariableLineTemplate,
		dropdownTemplate : _dropdownTemplate,
		batteryHtmlTemplate : _batteryHtmlTemplate,
		devicecontainerTemplate : _devicecontainerTemplate,
		deviceEmptyContainerTemplate : _deviceEmptyContainerTemplate,
		workflowContainerTemplate: _workflowContainerTemplate,
	};
};



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
									if  ( (v == value) && (possiblevalue.HumanFriendlyText!=undefined) ) {
										value = possiblevalue.HumanFriendlyText.text.replace("_DEVICE_NAME_","<b>"+device.name+"</b>").replace("_ARGUMENT_VALUE_",value)
									}
								}
							});
						});
					} else if (eventarg.HumanFriendlyText && eventarg.HumanFriendlyText.text)
						line.descr = eventarg.HumanFriendlyText.text.replace("_DEVICE_NAME_","<b>"+device.name+"</b>").replace("_ARGUMENT_VALUE_",value)
					line.condition +="{0} {1} {2}".format(
						eventarg.name,
						eventarg.comparisson,
						value );	
					return false;	// we had a match
				}				
			});
		});
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

var WatchManager = (function() {
	function _sameWatch(watcha,watchb) {
		return 	watcha.service == watchb.service && 
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
			DialogManager.dlgAddLine( dialog , "TimerName", _T("TimerName"), timer.name, "", {required:''} ); 
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
			return $( html ).find(".row-fluid").html();
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
	var xsbuttonTemplate = "<button id='{0}' type='button' class='{1} btn btn-default btn-xs' aria-label='tbd' title='{3}'>{2}</button>";

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
					var user  =  MultiBox.getUserByID(scenecontroller,userid);
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
		html += smallbuttonTemplate.format( idx, 'altui-triggertimerestrict', "<span class='glyphicon glyphicon-time "+(trigger.days_of_week ? 'text-success' : '' ) +"' aria-hidden='true'></span>",_displayTriggerRestrictions(trigger));
		html += smallbuttonTemplate.format( idx, 'altui-trigger-users', "<span class='glyphicon glyphicon-user "+(trigger.users ? 'text-success' : '' ) +"' aria-hidden='true'></span>",_displayTriggerUsers(trigger));
		html +="</td>";
		
		html +="<td>";
		html += smallbuttonTemplate.format( idx, 'altui-luatrigger', "<span class='glyphicon glyphicon-flash' aria-hidden='true'>Lua</span>",trigger.lua);
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
				parent.before(  _displayTrigger(trigger,scene.triggers.length-1) );
			}
			_showSaveNeeded();
		} );
	};
	
	function _editLuaExpression(idxwatch) {
		var watch = scenewatches[idxwatch];
		// hide scene & scene editor accordeon
		$(".altui-scene").toggle(false);
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
		var watch =  (idx!=-1) ? scenewatches[idx] : "";
		var dialog = DialogManager.createPropertyDialog(_T('Watch'));
		var device = NULL_DEVICE;
		if (idx!=-1)
			device = MultiBox.getDeviceByAltuiID(watch.deviceid) || NULL_DEVICE;
		
		DialogManager.dlgAddDevices( dialog , '', device ? device.altuiid : NULL_DEVICE, 
			function() {			// callback
				var widget = {};
				widget.properties ={
					deviceid: 	device.altuiid,
					service:	watch.service,
					variable:	watch.variable
				}
				DialogManager.dlgAddVariables(dialog, null, widget, function() {
					DialogManager.dlgAddBlockly( dialog , "LuaExpression", _T("Lua Expression with new=newvalue and old=oldvalue"), watch.luaexpr, watch.xml, _T("Expression with old new as variables and lua operators like <  >  <= >= == ~="), {required:''} ); 
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
				parent.before(  _displayWatch(idx , newwatch) );
			}
			return idx;
		};
		
		$('div#dialogs')
			.on('click',"#altui-edit-LuaExpression", function(event) {
				if ((typeof Blockly == "undefined") || ($("#altui-select-device").val()==0))
					return;
				var idxwatch = _getWatchDialogValues();
				_editLuaExpression( idxwatch );
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
			$(".altui-trigger-users").find(".glyphicon").toggleClass("text-success",(trigger.users!=undefined));
			_showSaveNeeded();
		});
	};
	
	function _editTriggerRestrict( triggeridx, jqButton ) {
		function _hideShowControls(  ) {
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
						trigger.start_time  =$("#altui-widget-StartTime").val();
						trigger.stop_time  =$("#altui-widget-StopTime").val();
					}
				}
				$(".altui-triggertimerestrict").find(".glyphicon").toggleClass("text-success",(trigger.days_of_week!=undefined));
				$('div#dialogModal').modal('hide');
				_showSaveNeeded();
			});
	};

	function _editTimer( timerid, jqButton ) 	{
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
		html +="<h4>{0}</h4>".format(result);
		// html += "</td>";
		// html +="<td>";
		if (idx>0) {
			// Group IDX 0 : is the "Immediate" group, it cannot be deleted
			html += smallbuttonTemplate.format( idx, 'altui-delgroup', deleteGlyph, 'Delete group');
		}
		html += smallbuttonTemplate.format( idx, 'altui-editgroup', editGlyph, 'Edit group');
		html +="</td>";			
		html += "<td>";
		html +="<table class='table table-condensed altui-scene-group' data-group-idx='"+idx+"'>";
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
							parent.replaceWith( _displayGroup(group,idx) );
						} else {
							// Add 
							scene.groups.push( group );
							parent.before( _displayGroup(group,scene.groups.length-1) );
						}
						_showSaveNeeded();
					});
			$('div#dialogModal').modal();
		};
		
	function _showSaveNeeded( bSaveNeeded ) { // defaults to "save needed"
		if (bSaveNeeded == false)
			$(".altui-scene-editbutton").removeClass("btn-danger").addClass("btn-default");
		else
			$(".altui-scene-editbutton").removeClass("btn-default").addClass("btn-danger");
		_updateAccordeonHeaders();
	};

	function _displayActions() {
		var html="";
		html += UIManager.displayJson( 'Actions', scene.groups );
		try {
			html +="<table class='table table-condensed'>";
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
		// var htmlSceneAddButtonTmpl = "  <button type='submit' class='btn btn-default {0}'>"+plusGlyph+"</button>";
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
					htmlRoomSelect 	  += "<option value='{1}' {2}>{0}</option>".format(_T("No Room"),0,'');
					$.each(rooms, function(idx,room) {
						var selected = (room.id.toString() == scene.room);
						htmlRoomSelect 	  += "<option value='{1}' {2}>{0}</option>".format(room.name,room.id,selected ? 'selected' : '');
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
				html +="<table class='table table-condensed'>";
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
				html += UIManager.displayJson( 'Triggers', scene.triggers);
				html +="<table class='table table-condensed'>";
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
			html += ("    <label for='altui-luascene'>Lua scene code:</label>");
			html +="    <div id='altui-luascene'>"+lua+"</div>";
			html +="  </div>";
			// html +="</form>";
			return html;
		}

		var jsonbutton = {id:'', class:'altui-toggle-json pull-right', label:'json', title:'json' };
		var htmlSceneEditButton = "  <button type='submit' class='btn btn-default altui-scene-editbutton'>"+_T("Submit")+"</button>";
		var html="";
		html += HTMLUtils.createAccordeon('altui-scene-editor',panels,jsonbutton );
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
		$("#altui-hint-Lua").html( (luacode=="") ? "" : plusGlyph );
		$("#altui-hint-Triggers").html( '<span class="badge">{0}</span>'.format( scene.triggers.length + scenewatches.length));
		$("#altui-hint-Timers").html( '<span class="badge">{0}</span>'.format( scene.timers.length));
		$("#altui-hint-Actions").html( '<span class="badge">{0}</span>'.format( _countActions(scene)) );
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
		var sortable_options = {
			axis: "y",
			// containment: ".panel-body",
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
					if (ids[0]  != new_groupid ) {
						$(tbody).find("tr[data-group-idx={0}]".format(new_groupid)).replaceWith( _displayGroup(scene.groups[ new_groupid ],new_groupid) );
						$(tbody).find("tr[data-group-idx={0}]".format(new_groupid)).find(".altui-scene-group tbody").sortable(sortable_options);
					}
					$(tbody).find("tr[data-group-idx={0}]".format(ids[0])).replaceWith( _displayGroup(org_group,ids[0] ) );
					$(tbody).find("tr[data-group-idx={0}]".format(ids[0])).find(".altui-scene-group tbody").sortable(sortable_options);				
				});
				
			}
		};
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
			maxWidth:$("div#altui-luascene").closest(".panel").innerWidth()-30, // ugly but easier, padding 15 on each size
			stop: function( event, ui ) {
				editor.resize();
			}
		});			
		_updateAccordeonHeaders();
		$('#blocklyDiv').data("scenecontroller",scenecontroller);	// indicates to Blockly which scene controller to filter on
		
		$(".altui-json-code").hide();
		$(".altui-mainpanel")
			.off("click")
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
				scene.lua =  editor.getValue();
				scene.name = $("#altui-scene-name-input").val();
				if (scene.paused==undefined)
					scene.paused=0;

				if (UIManager.UI7Check()==true) {
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
				_editWatch( -1 , $(this) );
			})
			.on("click",".altui-pausescene",function(){ 
				scene.paused = (scene.paused==1) ? 0 : 1;
				$(this).toggleClass("activated paused");
				_showSaveNeeded();
			});

			
		$(".altui-toggle-json").click( function() {
			var id = $(this).closest('.panel').prop('id');
			var type = "#altui-json-"+id;
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
		sceneEditDraw 	: _sceneEditDraw,
		runActions 		: _runActions,
		// displayActions  : _displayActions
	}
};

// ===========================
//  Page UI pieces helpers
// ===========================
var PageMessage = (function(window, undefined ) {
	var _badgeTemplate = '<span class="badge">{0}</span>&nbsp;';
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
		var htmlmsg = ("<tr data-idx='{0}' {4} class='{3}'><td>"+close+"</td><td>"+badgehtml+"</td><td>{1}</td><td class='altui-pagemessage-txt'>{2}</td><td>{5}</td></tr>").format( 
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
			button.attr("class","dropdown-toggle btn "+"btn-"+cls);
		};
		var divs = $("div#altui-pagemessage");
		if (divs.has("tr.danger").length>0)
			_setColor('danger');
		else if (divs.has("tr.warning").length>0)
			_setColor('warning');
		else if (divs.has("tr.info").length>0)
		// else if ($("div#altui-pagemessage  tr.info").length>0)
			_setColor('info');
		else if (divs.has("tr.success").length>0)
		// else if ($("div#altui-pagemessage  tr.success").length>0)
			_setColor('success');
		else {
			_setColor('default');
			// $("#altui-toggle-messages").dropdown("toggle");
			button.next(".collapse").removeClass("in");
			button.filter("span").removeClass( "caret-reversed" );
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
		if ((level!="success") &&  (level!="info" ) &&  (level!="warning") &&  (level!="danger"))	{
			level = "info";
		}
		if (bReload==true) {
			if (level=="success")
				level="info";
			html += "<button class='btn btn-default btn-sm altui-savechanges-button' onclick='MultiBox.saveChangeCaches(0,\"{0}\")'>Save Changes</button>";
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
			$("div#altui-pagemessage  tr.success[data-idx='" + idx + "']").each( function(idx,elem) {
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
						jobid : job.id	 	//message for this job, will replace old one
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
						jobid : job.id	 	//message for this job, will replace old one
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

	function _init() {
		var Html="";
		Html+="<div class='' id='altui-pagemessage'>";
		Html+="	<button id='altui-toggle-messages' class='btn btn-default dropdown-toggle' type='button' data-toggle='collapse' data-target='#altui-pagemessage-panel' >";
		Html+=( _T("Messages") + "&nbsp;<span class='caret'></span>");
		Html+="	</button>";
		Html+= SpeechManager.getHtml();
		Html+="	<div class='panel panel-default collapse' id='altui-pagemessage-panel' >";
		Html+="		<div class='panel-body'>";
		Html+="			<table class='table table-condensed table-responsive'>";
		Html+="				<tbody>";
		Html+="				</tbody>";
		Html+="			</table>";
		Html+="		</div>";
		Html+="	</div>";
		Html+="</div>";
		$("#altui-pagetitle").before( Html );
		// close button for pageMessages
		$( document )
			.off( "click", ".altui-pagemessage-close")
			.on( "click", ".altui-pagemessage-close", function() {
				// $(this).closest("tr").remove();
				PageMessage.clearMessage( $(this).closest("tr").data('idx') );
			})
			.off( "click", "#altui-toggle-messages")
			.on( "click", "#altui-toggle-messages", function() {
				$(this).find("span").toggleClass( "caret-reversed" );
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
})();

var UIManager  = ( function( window, undefined ) {  
	// there scripts cannot be loaded by ALTUI and cannot be executed, so if a device uses them, we do not load/use it
	// meaning we lose functionality
	var _forbiddenScripts=["shared.js","interface.js"];
	var _safeScripts=["J_PLC.js","J_VeraAlerts.js"];

	// App Store URLs
	var getlist_url = 'https://script.google.com/macros/s/AKfycbwaJ9s6TyXJimpx09VBkFInO_rTjSfKXdPhZS_1FWdBL8AOmo4/exec'; // PROD
	// var getlist_url = 'https://script.google.com/macros/s/AKfycbz0YqgQ-gxY3YjrxuaLeQKDrLdTT7Ibbs6GAiv8wss/dev'; // DEV

	// in English, we will apply the _T() later, at display time
	var _checkOptions = [
		{ id:'ShowVideoThumbnail', type:'checkbox', label:"Show Video Thumbnail in Local mode", _default:1, help:'In Local access mode, show camera in video stream mode' },
		{ id:'FixedLeftButtonBar', type:'checkbox', label:"Left Buttons are fixed on the page", _default:1, help:'choose whether or not the selection Buttons on the left are scrolling with the page' },
		{ id:'ShowWeather', type:'checkbox', label:"Show Weather on home page", _default:1, help:'display or not the weather widget on home page' },
		{ id:'UseVeraFavorites', type:'checkbox', label:"Use Vera Favorites", _default:0, help:'use the same favorites as set on your VERA box but prevent to have different favorites per client device' },
		{ id:'SyncLastRoom', type:'checkbox', label:"Same Room for Devices/Scenes", _default:1, help:'keep the same last selected room between the device and the scene pages'},
		{ id:'StickyFooter', type:'checkbox', label:"Sticky Footer to bottom", _default:0, help:'Fixes the footer at the bottom of the page but could have performance issues on mobile browsers'},
		{ id:'UseUI7Heater', type:'checkbox', label:"Use new UI7 behavior for Heater devices", _default:0, help:'technical option to trigger the UI7 behavior for heater'},
		{ id:'ShowAllRows', type:'checkbox', label:"Show all rows in grid tables", _default:0, help:'allways show all the lines in the grid tables, or have a row count selector instead'},
		{ id:'LockFavoritePosition', type:'checkbox', label:"Lock favorites position", _default:0, help:'Prevent drag and drop of favorites to reorder them'},
		{ id:'Menu2ColumnLimit', type:'number', label:"2-columns Menu's limit", _default:15, min:2, max:30, help:'if a menu has more entries than this number then show the menu entries in 2 columns'  },
		{ id:'TempUnitOverride', type:'select', label:"Weather Temp Unit (UI5)", _default:'c', choices:'c|f', help:'Unit for temperature'  }
	];
	
	var _editorOptions = [
		{ id:'EditorFontSize', type:'number', label:"Editor Font Size", _default:12, min:8, max:30, help:'Editor font size in pixels'  },
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
			{id:1000, glyph:'object-align-top' , onclick: onAlignTop},
			{id:1010, glyph:'object-align-horizontal', onclick: onAlignHorizontal },
			{id:1020, glyph:'object-align-bottom' , onclick: onAlignBottom },
			{id:1030, glyph:'object-align-left' , onclick: onAlignLeft },
			{id:1040, glyph:'object-align-vertical' , onclick: onAlignVertical},
			{id:1050, glyph:'object-align-right' , onclick: onAlignRight},
			{id:1060, glyph:'option-horizontal' , onclick: onDistribHorizontal, label:_T("Distribute Horizontally")},
			{id:1070, glyph:'option-vertical' , onclick: onDistribVertical, label:_T("Distribute Vertically")},
		];
		tools = [
			{ 	id:10, 
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
			{ 	id:20, 
				cls:'altui-widget-variable', 
				html: _toolHtml(infoGlyph,_T("Variable")),
				property: _onPropertyVariable, 
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
			{ 	id:30, 
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
			{ 	id:35, 
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
			{ 	id:40, 
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
			{ 	id:50, 
				cls:'altui-widget-runscene', 
				no_refresh:true,
				html: _toolHtml(runGlyph,_T("Scene")),
				property: _onPropertyRunscene, 
				onWidgetResize: _onResizeStub,
				widgetdisplay: function(widget,bEdit)	{ 
					var scene = MultiBox.getSceneByAltuiID(widget.properties.sceneid);
					return "<button type='button' class='{1} btn btn-default' aria-label='Run Scene' onclick='{3}' style='{5}'>{4} {2}</button>".format(
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
			{ 	id:60, 
				cls:'altui-widget-upnpaction', 
				no_refresh:true,
				html: _toolHtml(runGlyph,_T("Action")),
				property: _onPropertyUpnpAction, 
				onWidgetResize: _onResizeStub,
				widgetdisplay: function(widget,bEdit)	{ 
					var device = MultiBox.getDeviceByAltuiID(widget.properties.deviceid);
					if (device==null)
						return "";
					return "<button type='button' class='{1} btn btn-default' aria-label='Run Action' onclick='{3}' style='{5}' >{4}{2}</button>".format(
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
			{ 	id:65, 
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
						html = "<button  type='button' style='color:{4};' class='{1} btn btn-default' aria-label='Run Scene' onclick='{3}' >{2}</button>".format(
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
			{ 	id:70, 
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
								"modal-lg"		// size
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
			{ 	id:80, 
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
			{ 	id:90, 
				cls:'altui-widget-slider', 
				defaultSize: { width:50, height:100 },
				html: _toolHtml(glyphTemplate.format( "resize-vertical", _T("Slider") , ""),_T("Slider")),
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
	
	function _loadD3Script( drawfunc ) {
		var altuidevice = MultiBox.getDeviceByID( 0, g_ALTUI.g_MyDeviceID );
		var localcdn = ( MultiBox.getStatus( altuidevice, "urn:upnp-org:serviceId:altui1", "LocalCDN" ).trim() || "");
		var scriptname = (localcdn=="") ? "//cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js" : (localcdn+"/d3.min.js");	//supports https
		var len = $('script[src="'+scriptname+'"]').length;
		if (len==0) {				// not loaded yet
			UIManager.loadScript(scriptname,function() {
				(drawfunc)();
			});
			return;
		}
		(drawfunc)();
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
					_loadScript(obj.ScriptFile, function() {						
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
		||  (watch.variable != push.variable)  
		||  (watch.deviceid != push.deviceid)  
		||  (watch.provider != push.provider) )
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

	// function _getPushLineParams(pushLine) {
		// var key="";
		// var fieldnum=0;
		// var params = pushLine.split('#');
		// var wparams=[];
		// for (var i=4; i< params.length; i++ ) {
			// wparams.push(params[i]);
		// }
		// return {
			// service : params[0] || "",
			// variable : params[1] || "",
			// deviceid : params[2] || "",
			// provider : params[3] || "",
			// params	 : wparams
		// };
	// }
	
	// function _setPushLineParams(push) {
		// return "{0}#{1}#{2}#{3}#{4}#{5}#{6}#{7}#{8}".format( push.service, push.variable, push.deviceid, push.provider, push.channelid, push.readkey, push.key,push.fieldnum,push.graphicurl || "");
	// }
	
	function _displayJson(type,obj) {
		return "<pre id='altui-json-"+type+"' class='altui-json-code'>"+JSON.stringify( obj )+"</pre>";
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
		html +="<b>{0}</b>".format(timer.name);
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
			html += _displayJson( 'Timers', timers);
		try {
			html +="<table class='table table-condensed'>";
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
		function _clickOnValue() {
			var id = $(this).prop('id');	// idx in variable state array
			var state =  MultiBox.getStateByID( device.altuiid, id );
			var tbl = [state.service , state.variable]//atob(id).split('.');
			var value = MultiBox.getStatus(device,tbl[0],tbl[1]);
			$(this).off( "click");
			$(this).html( _enhanceEditorValue(id,value) );
			$(this).find("input#"+id)
				.focus()
				.focusout( function() {
					var id = $(this).prop('id');	
					var state =  MultiBox.getStateByID( device.altuiid, id );
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
		function _pushFormFields(providers,provider, varid, pushData) {
			var tempPushData = (pushData) ? cloneObject(pushData) : [];
			var html ="";
			var parameters = ( provider && providers[ provider ] ) ? providers[ provider ].parameters : [];
			for (var i=0 ; i<parameters.length ; i++) {
				var defvalue = parameters[i].default || "";
				var value = (pushData!=null) ? (pushData.params[i] || defvalue) : '';
				tempPushData.params[i]=value;
				html += "<div class='form-group col-xs-12'>";
					html += "<label for='datapush-{0}-{1}'>{2}-{3}</label>".format(parameters[i].key, varid, i,parameters[i].label);
					html += "<input type='{2}' class='form-control input-sm' id='datapush-{0}-{1}' placeholder='{2}' value='{3}'></input>".format(
						parameters[i].key,
						varid,
						parameters[i].type,
						value
					)
				html += "</div>"
				if (parameters[i].key=="graphicurl") {
					var height = parameters[i].ifheight || 260;
					var url = String.prototype.format.apply(value,tempPushData.params);
					html += "<iframe id='altui-iframe-chart-{2}' class='altui-thingspeak-chart' data-idx='{1}' width='100%' height='{3}' style='border: 1px solid #cccccc;' src='{0}' ></iframe>".format(url,i,varid,height);
				}

			}
			return html;
		};
		function buildPushForm(providers,pushData,device,varid) {
			var altuidevice = MultiBox.getDeviceByID( 0, g_ALTUI.g_MyDeviceID );
			var state = MultiBox.getStateByID( device.altuiid, varid );

			var html = "";
			html += "<div class='panel panel-default'> <div class='panel-body'>";
			html += "<div class='row'>";
				html += "<div class='checkbox col-xs-12 form-inline'>"
					html += "<label><input type='checkbox' id='altui-enablePush-{0}' {1}>Enable Push to : </label>".format(
						varid, 
						(pushData!=null) ? 'checked' : ''
					);
					html += '<select id="altui-provider-{0}" class="form-control">'.format(varid);
					$.each(providers,function(key,provider) {
						html += '<option {1}>{0}</option>'.format(key,((pushData!=null) && (pushData.provider==key)) ? 'selected' : '');
					});
					html += '</select>';
				html += "</div>"
					
				html += "<form id='form-{0}' class='form'>".format(varid);
					html += _pushFormFields(providers, (pushData!=null) ? pushData.provider : null ,varid, pushData );
				html += "</form>"
			html += "</div>";	//row
			html += "</div>";	//panel-body
			html += "</div>";	//panel
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
			$.each(device.states.sort(_sortByVariableName), function(idx,state) {
				var row = model[state.id];
				var str = deviceVariableLineTemplate.format(
						state.variable, 
						row.val, 
						state.service,
						state.id,
						(row.sendWatch!=null) ? 'btn-info' : '',
						(row.sendWatch!=null) ? row.sendWatch.provider : ''
					);
				lines.push(  str );
			});
			return lines.join('');
		};
		
		// 0: variable , 1: value , 2: service
		var deviceVariableLineTemplate = ALTUI_Templates.deviceVariableLineTemplate;
		var model = {};
		if (device!=null) {
			var watches = {};
			var altuidevice = MultiBox.getDeviceByID( 0, g_ALTUI.g_MyDeviceID );
			$.each(MultiBox.getWatches("VariablesToSend",function(watch) { return (watch.deviceid == device.altuiid); }), function(i,watch) {
				watches[watch.service+'_'+watch.variable] = watch;
			});
			$.each(device.states.sort(_sortByVariableName), function(idx,state) {
				model[state.id] = { 	
					val:HTMLUtils.enhanceValue(state.value),
					sendWatch: watches[state.service+'_'+state.variable]
				}
			});
			
			// update modal with new text
			var body = buildDeviceVariableBody(deviceVariableLineTemplate,model);
			DialogManager.registerDialog('deviceModal',deviceModalTemplate.format( body, device.name, device.altuiid ));
			$("button.altui-variable-push").click( function() {
				function _getPushFromDialog(frm) 
				{
					var push = {
						service : state.service,
						variable : state.variable,
						deviceid : device.altuiid,
						provider : $("#altui-provider-"+varid).val(),
						params : []
					};
					// var len="datapush_".length;
					frm.find("input").each(function(idx,elem) {
						// var id = $(elem).prop('id').substring(len);
						// push[id] = $(elem).val();
						push.params.push($(elem).val());
					});
					return push;
				}

				var tr = $(this).closest("tr");
				var varid = tr.find("td.altui-variable-value").prop('id');
				var state = MultiBox.getStateByID( device.altuiid, varid );
				var form = $(this).closest("tbody").find("form#form-"+varid);
				if (form.length==0) {
					var that = $(this);
					// change color
					that.removeClass("btn-default").addClass("btn-danger");
					MultiBox.getDataProviders(function(providers) {
						//
						// get this push parameters if they exist
						//
						var pushes = MultiBox.getWatches("VariablesToSend",function(push) { return ((device.altuiid == push.deviceid) && (state.variable==push.variable) && (state.service==push.service)) });
						console.assert(pushes.length<=1)
						var pushData = (pushes.length==0) ? null : pushes[0];

						var html = buildPushForm(providers,pushData,device,varid);
						tr.after("<tr><td colspan='3'>"+html+"</td></tr>");

						// display form if needed
						var checked = $("#altui-enablePush-"+varid).is(':checked');
						$("#form-"+varid).toggle(checked);
						
						//create a default pushData with a default provider if needed
						pushData = $.extend({
							provider:$("#altui-provider-"+varid).val(),
							params:[]
						},pushData);
						
						
						$("#altui-enablePush-"+varid).change(function() {
							$("#form-"+varid).html( _pushFormFields(providers,pushData.provider,varid,pushData) ) ;
							// display form if needed
							var checked = $("#altui-enablePush-"+varid).is(':checked');
							$("#form-"+varid).toggle(checked);
						});
						
						$("#altui-provider-"+varid).change(function() {
							pushData.provider = $("#altui-provider-"+varid).val();
							pushData.params=[];
							$("#form-"+varid).html( _pushFormFields(providers,pushData.provider,varid,pushData) ) ;
						});

						$("#form-"+varid+" input").change( function() {
							var url = $("#datapush-graphicurl-"+varid).val();
							var push = _getPushFromDialog( $("#form-"+varid) );
							url = String.prototype.format.apply(url,push.params);
							if (url.indexOf("{")==-1)
								$(".altui-thingspeak-chart").attr("src",url);
						});
					});
				} else {
					// CLOSING the form : change color
					var nexttr = tr.next("tr");
					var pushEnabled = nexttr.find("input#altui-enablePush-"+varid).prop('checked');
					$(this).addClass("btn-default").toggleClass("btn-info",pushEnabled).removeClass("btn-danger");
					var push = null;
					var differentWatches=null;
					// find all watches for this device
					var previousWatches = MultiBox.getWatches("VariablesToSend",function(watch) { return (watch.service == state.service) && (watch.variable == state.variable)  && (watch.deviceid == device.altuiid) });


					// add a new one unless it is already there
					if (pushEnabled ==true ) {
						push = _getPushFromDialog(form);
						differentWatches = previousWatches.filter( function(watch) {
							return _differentWatch(watch,push);
						});
						// delete all old ones
						$.each(differentWatches , function(i,w) {
							MultiBox.delWatch( w )
						});
						// add new one if it was not there before
						if (differentWatches.length==previousWatches.length)
							MultiBox.addWatch( push ) ;
					} else {
						// delete all watches that are in the VERA variable and not any more in the scenewatches
						$.each(previousWatches , function(i,w) {
							MultiBox.delWatch( w )
						});
					}
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
						AltuiDebug.debug("getDeviceVariableHistory returned :"+history.result); 
						var html = "<tr><td colspan='3'>";
						html += "<div class='panel panel-default'> <div class='panel-body'>";
						// html += "<div class='table-responsive'>";
						html +="<table id='{0}' class='table table-condensed altui-variable-value-history'>".format(varid);
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
			});
			$(".altui-variable-value").click( _clickOnValue );
			// show the modal
			$('#deviceModal').modal();
		}
	};

	function _deviceCreate() {
		// prepare modal
		// show
		$('#deviceCreateModal button.btn-primary')
			.off('click')
			.on('click', function() {
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
			});
		$('#deviceCreateModal').modal();
	};
	
	function _deviceDrawActions(device) {
		
		// 0:name 1:name
		var deviceActionParamTemplate = "<div class='input-group input-group-sm'>";
		deviceActionParamTemplate +=	"  <span class='input-group-addon' id='sizing-addon3'>{0}</span>";
		deviceActionParamTemplate +=	"  <input type='text' class='form-control' placeholder='{1}' aria-describedby='sizing-addon3'>";
		deviceActionParamTemplate +=	"</div>";

		// 0: action , 1: value , 2: service, 3: devid
		var deviceActionLineTemplate = "  <tr>";
		deviceActionLineTemplate += "         <td><span title='{2}'><button class='btn btn-default btn-sm altui-run-action' data-altuiid='{3}' data-service='{2}' >{0}</button></span></td>";
		deviceActionLineTemplate += "         <td>{1}</td>";
		deviceActionLineTemplate += "     </tr>";

		// for each services for that device type
		// enumerate actions name & parameters		
		// var device = MultiBox.getDeviceByID( devid );

		MultiBox.getDeviceActions(device, function( services ) {
			AltuiDebug.debug("MultiBox.getDeviceActions => returns services:{0}".format( JSON.stringify(services)));
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
				return "active";
			case 2:
			case 3:
				return "danger";
			case 4:
				return "success";
			case -1:
			default:
				return "default";
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
		var html ="";
		var watts = parseFloat(MultiBox.getStatus( device, 'urn:micasaverde-com:serviceId:EnergyMetering1', 'Watts' )); 

		if (isNaN(watts)==false) 
			html += wattTemplate.format(watts);
		else {
			watts = parseFloat(MultiBox.getStatus( device, 'urn:micasaverde-com:serviceId:EnergyMetering1', 'UserSuppliedWattage' )); 
			if (isNaN(watts)==false) 
				html += wattTemplate.format(watts);
		}
		return html;
	};
	function _defaultDeviceDrawAltuiStrings(device) {
		var html ="";
		$.each( ['DisplayLine1','DisplayLine2'],function(i,v) {
			var dl1 = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:altui1', v ); 
			if (dl1 != null) 
				html += $("<div class='altui-"+v+"'></div>").text(dl1).wrap( "<div></div>" ).parent().html()
		});
		return html!="" ? html : optHorGlyph;
	};
	function _defaultDeviceDraw( device ) {
		var html = _defaultDeviceDrawWatts(device);
		html += _defaultDeviceDrawAltuiStrings(device);
		return html;
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
		// var _devicetypesDB = MultiBox.getDeviceTypesDB(controller);
		var icon='';
		switch( device.device_type ) {
			case 'urn:schemas-futzle-com:device:CountdownTimer:1': 
				icon = '//apps.mios.com/plugins/icons/1588.png';
				break;
			default:
				var str = "";
				var src = defaultIconSrc;
				var ui_static_data = MultiBox.getDeviceStaticData(device);
				// var dt = _devicetypesDB[ device.device_type ];
				AltuiDebug.debug("Icon for device altuiid:"+device.altuiid+"  device.type:"+device.device_type);
				if (ui_static_data!=null)
				{
					//dt.ui_static_data.DisplayStatus
					//dt.ui_static_data.state_icons
					
					// check if there are objects in dt.ui_static_data.state_icons
					if (ui_static_data.state_icons !=undefined)	//  some state icons found
					{
						var si = ui_static_data.state_icons;
						if (_hasObjectProperty(si) == true )	// UI7 style
						{
							// enumerate each object until a condition is met true
							var bFound = false;
							$.each( si , function(key,obj) {
								if (isObject(obj) && (obj.img!=undefined) ) {
									// obj.conditions is an array
									// obj.img s the icon
									if (MultiBox.evaluateConditions(device, device.subcategory_num || -1, obj.conditions))
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
								AltuiDebug.debug("UI5 style static baseIconName:"+baseIconName);
								var dot = baseIconName.lastIndexOf('.');
								if (dot >=0)
									baseIconName=baseIconName.substr(0,dot);
								if (baseIconName.substring(0,4)!="http")
								{
									baseIconName = "../../../"+baseIconName;
								}
								AltuiDebug.debug("UI5 style static baseIconName modified :"+baseIconName);
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
							AltuiDebug.debug("Icon for device id:"+id+"  str :"+str);
					}
					else if (ui_static_data.dynamic_icons !=undefined)	//  some dynamic icons found
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
									if (MultiBox.evaluateConditions(device, device.subcategory_num || -1, obj.conditions))
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
						AltuiDebug.debug("Icon for device id:"+id+"  string from json:"+str);
						if (str == undefined) {
							AltuiDebug.debug("Undefined icon in ui_static_data, device.type:"+device.device_type);
							AltuiDebug.debug("ui_static_data:"+JSON.stringify(ui_static_data));
							AltuiDebug.debug("Setting default icon");
							str = "icons/generic_sensor.png";
						}
						str = str.replace(".swf",".png");
						if ( (str == "icons/generic_sensor.png") || (str == "icons/Light_Sensor.png"))
							str = defaultIconSrc;
						else if (str == "icons/Window_Covering.png")
							str = (MultiBox.isUI5( controller ) ? "../../../icons/Window_Covering.png" : "../../icons/Window_Covering.png");
						// //192.168.1.16/cmh/skins/default/img/devices/device_states/../../icons/Window_Covering.png
						else if (str.substr(0,6) == "icons/")
							str = "../../../" +str;
						AltuiDebug.debug("Icon for device id:"+id+"  string after correction:"+str);
					}	
				}
				else {
					AltuiDebug.debug("Icon for device id:"+id+"  DeviceType unknown or not static data");
					str = defaultIconSrc;
				}
				
				//console.log("type:{0} icon:{1}".format(device.device_type,str));
				if( str.substring(0,4)=="http") {
					AltuiDebug.debug("Icon for device id:"+id+"  IconPath:"+str);
					return str;
				}
				
				if (str.substring(0,11)=="data:image/")
					icon = str;
				else 
					icon = MultiBox.getIconPath(controller, str );

				AltuiDebug.debug("Icon for device id:"+id+"  IconPath:"+icon);
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
			return "<img class='altui-device-icon pull-left img-rounded' data-org-src='/err' src='{0}' alt='_todo_' onerror='UIManager.onDeviceIconError(\"{1}\")' {2} ></img>".format(
				defaultIconSrc,
				device.altuiid,
				(zindex ? " style='z-index:{0};' ".format(zindex) : "" )
				);
			// return "<img class='altui-device-icon pull-left img-rounded' data-org-src='/err' src='"+defaultIconSrc+"' alt='_todo_' "+(zindex ? "style='z-index:{0}'" : "")+" onerror='UIManager.onDeviceIconError(\""+device.altuiid+"\")' ></img>";		
		// if there is a custom function, use it
		if (_devicetypesDB[ device.device_type ]!=null && _devicetypesDB[ device.device_type ].DeviceIconFunc!=null) {
			return  Altui_ExecuteFunctionByName(_devicetypesDB[ device.device_type ].DeviceIconFunc, window, device);
		}
		
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
		return "<img class='altui-device-icon pull-left img-rounded' data-org-src='{0}' src='{1}' {3} alt='_todo_' onerror='UIManager.onDeviceIconError(\"{2}\")' ></img>".format(
			iconPath,
			iconDataSrc,
			device.altuiid,
			(isNullOrEmpty(onclick)) ? "" : "onclick='{0}'".format(onclick)
		);
		// return "<img class='altui-device-icon pull-left img-rounded' data-org-src='"+iconPath+"' src='"+iconDataSrc+"' alt='_todo_' onerror='UIManager.onDeviceIconError(\""+device.altuiid+"\")' ></img>";
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
				color = "progress-bar-"+color;
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
				var devicetype = device.device_type;
				if (device.device_type.startsWith('urn:schemas-dcineco-com:device:MSwitch')) {
					// replace MSwitchxxxxx by MSwitch
					var elems = device.device_type.split(':');
					elems[3] = "MSwitch";
					devicetype = elems.join(':');
				} 
				
				var devicebodyHtml = "";
				if (_devicetypesDB[ devicetype ]!=null && _devicetypesDB[ devicetype ].DeviceDrawFunc!=null) {
					devicebodyHtml+= Altui_ExecuteFunctionByName(_devicetypesDB[ devicetype ].DeviceDrawFunc, window, device);
				}
				else {
					devicebodyHtml+= _defaultDeviceDraw(device);
				}
				// $("div.altui-device#"+id+" div.panel-body" ).append(deviceHtml);
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
					iconHtml
					);
				device.dirty=false;
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
		return nextrun;
	};
	
	function _sceneDraw(scene,norefresh) {

		var delButtonHtml = buttonTemplate.format( scene.altuiid, 'btn-xs altui-delscene pull-right', deleteGlyph,'default',_T("Delete"));
		var pauseButtonHtml = glyphTemplate.format( "off", _T("Pause Scene") , 'altui-pausescene ' + ((scene.paused>0) ? 'paused':'activated'));
		var favoriteHtml = (scene.favorite==true) ? starGlyph : staremtpyGlyph;
		var label = ((scene.hidden==true) ? hiddenGlyph+' ' : '') + scene.name;

		var lastrun = (scene.last_run != undefined) ? okGlyph+" "+_toIso(new Date(scene.last_run*1000)) : '';
		lastrun = lastrun.replace('T',' ');
		var nextrun = _findSceneNextRun(scene);
		nextrun = (nextrun==0) ? '' : timeGlyph+" "+_toIso(new Date(nextrun*1000));
		nextrun = nextrun.replace('T',' ');
		
		var idDisplay = "<div class='pull-right text-muted'><small>#"+scene.altuiid+" </small></div>";
				
		var scenecontainerTemplate = "";
		scenecontainerTemplate	+=  "<div class='panel panel-default altui-scene "+((norefresh==true) ? 'altui-norefresh': '') +"' id='{0}' data-altuiid='{0}'>"
		scenecontainerTemplate	+=	"<div class='panel-heading altui-scene-heading'>"+delButtonHtml +idDisplay+" <span class='panel-title altui-scene-title' data-toggle='tooltip' data-placement='left' title='{2}'>"+pauseButtonHtml+favoriteHtml+"<small class='altui-scene-title-name'>{1}</small></span> {9}</div>";
		scenecontainerTemplate	+=  "<div class='panel-body altui-scene-body'>";
		scenecontainerTemplate	+=  "<small class='altui-scene-date text-muted pull-right'>{6}</small><small class='altui-scene-date text-info pull-right'>{7}</small>";
		scenecontainerTemplate	+=  "{3}<div >{4}{8}{5}</div>";
		scenecontainerTemplate	+=  "</div>";
		scenecontainerTemplate	+=  "</div>";

		var tooltip = "";
		var runButtonHtml = buttonTemplate.format( scene.altuiid, 'altui-runscene', _T("Run")+"&nbsp;"+runGlyph,'primary',_T("Run"));
		var editButtonHtml = buttonTemplate.format( scene.altuiid, 'altui-editscene ', wrenchGlyph,'default',_T("Settings"));
		var calendarHtml = buttonTemplate.format( scene.altuiid, 'altui-scene-history ', calendarGlyph,'default',_T("History"));
		var cloneButtonHtml = buttonTemplate.format( scene.altuiid, 'altui-clonescene', copyGlyph,'default',_T("Copy"));
		var active = (scene.active==true) ? glyphTemplate.format( "ok", _T("active") , 'text-success') : '';
		return scenecontainerTemplate.format(scene.altuiid, label, tooltip, runButtonHtml , editButtonHtml , calendarHtml , lastrun, nextrun,cloneButtonHtml,active);
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
				var streamurl = "url(http://{0}{1})".format(
					device.ip,	//ip
					directstreaming	//DirectStreamingURL
				);

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
		// set_set_panel_html_callback(function(html) {
			// $(domparent).html(html);
		// });
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
			var offset={top:0, left:0 };
			// var ctrlgroupid = control.ControlGroup;
			// var ctrlgroup = null;
			// $.each(tab.ControlGroup, function(i,grp) {
				// if (grp.id == ctrlgroupid) {
					// ctrlgroup=grp;
					// return false;
				// }
			// })
			// if (ctrlgroup) {
				// var scenegrpid = ctrlgroup.scenegroup;
				// var scenegrp = null;
				// $.each(tab.SceneGroup, function(i,scn) {
					// if (scn.id==scenegrpid) {
						// scenegrp=scn;
						// offset.top = scn.top || 0;
						// offset.left = scn.left || 0;
						// return false;
					// }
				// });
				
			// }
			// offset = {
				// top:offset.top*24,
				// left:offset.top*80
			// };
			return offset;
		};
		
		function _displayControl( domparent, device, control, idx, groupoffset ) {
			var paddingleft = parseInt($("#altui-device-controlpanel-"+devid).css("padding-left")) + (groupoffset.left || 0);
			var paddingtop = parseInt($("#altui-device-controlpanel-"+devid+" .panel-body ").css("padding-top")) + (groupoffset.top || 0);
			switch(control.ControlType) {
				case "line_break": 
				case "spacer": 
					// no action to do for control panel, only for UI7 dashboard
					break;
				case 'color_picker': {
					var current = MultiBox.getStatus(device,'urn:micasaverde-com:serviceId:Color1','TargetColor') || MultiBox.getStatus(device,'urn:micasaverde-com:serviceId:Color1','CurrentColor');
					if (current!=null) {
						var parts = current.split(",");	// 0=0,1=0,2=0,3=0,4=255
						current = rgbToHex(
							parseInt(parts[2].substring(2)), 
							parseInt(parts[3].substring(2)), 
							parseInt(parts[4].substring(2))
							);		
					} else
						current="#ffffff";
					var top = paddingtop + (control.Display.Top || 0);
					var left = paddingleft  + (control.Display.Left || 0);
					var domobj = $("<div class='' style='top:{2}px; left:{3}px;' ><input title='{4}' id='altui-colorpicker-{0}'  value='{1}'></input></div>"
						.format(device.altuiid,current,top,left,control.Label.text))
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
					var bInverted = (armedValue2>armedValue1);
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
						if (control.Display.Top)
							obj.css( { top: control.Display.Top } );
						obj.css( { left: paddingleft+ (control.Display.Left || 0) } );
					}
					$("div#altui-device-msb-"+uniqid).off('click touchend');
					$("div#altui-device-msb-"+uniqid).on('click touchend',function() {
						var state = (bInverted) ? control.states[1] : control.states[0];
						ALTUI_PluginDisplays.toggleButton(devid, "div#altui-device-msb-"+uniqid, state.Display.Service, state.Display.Variable, function(id,newval) {
							var parameters = {};
							var whichone = (bInverted) ? newval : 1-newval;
							parameters[ control.states[whichone].Command.Parameters[0].Name ] = control.states[whichone].Command.Parameters[0].Value; 
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
						var button = $( "<button type='button' class='btn btn-xs btn-{1} altui-controlpanel-button'>{0}</button>".format(control.Label.text, bActif ? 'primary' : 'default'))
							.appendTo( $(domparent) );
						
						control.Display.Width = Math.max( control.Display.Width || 10 , $(button).outerWidth() );
						if ((control.Display.Top && control.Display.Left) /*|| (groupoffset.top && groupoffset.left)*/){
							button.css({
									top: paddingtop + (control.Display.Top  || 0), 
									left: paddingleft  + (control.Display.Left  || 0), 
									"min-width": control.Display.Width+"px",	// forcing bootstrap
									"max-width": control.Display.Width+"px",	// forcing bootstrap
									"z-index" : "10",
									position:'absolute'
									});
						}
						else {
							button.css({
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
							top: control.Display.Top, 
							left: control.Display.Left, 
							position:'absolute'})
						// .width(control.Display.Width)
						.height(30 /*control.Display.Height*/ );		
						
					var obj = $("<div id='altui-slider-horizontal-"+uniqid+"'></div>")
						.appendTo( $(domparent) )
						.css({
							top: control.Display.Top+30, 
							left: control.Display.Left, 
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
							params[ control.Command.Parameters[0].Name ] = ui.value;
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
								top: control.Display.Top, 
								left: control.Display.Left, 
								position:'absolute'})
							// .width(control.Display.Width)
							.height(20 /*control.Display.Height*/ )		// height given by class on UI5
							.click( {uniqid:uniqid, control:control},_onClickSlider);
						$("<input required id='"+htmlid+"' type='number' step='"+1/10+"' value='' />")
							.appendTo( $(domparent) )
							.css({
								top: control.Display.Top, 
								left: control.Display.Left, 
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
							top: control.Display.Top+30, 
							left: control.Display.Left, 
							position:'absolute'})
						// .width(control.Display.Width)
						.height(65 /*control.Display.Height*/ )		// height given by class on UI5
						.slider( {
						  orientation: "vertical",
						  range: "min",
						  min: 0,
						  max: 1000,
						  step: 1,
						  value: val*10 ,
						  slide: function( event, ui ) {
							$("#altui-slider-vertical-value-"+uniqid).text(ui.value/10);
							// $( "#amount" ).val( ui.value );
						  },
						  change: function( event, ui ) {
							var params={};
							params[ control.Command.Parameters[0].Name ] = ui.value/10;
							MultiBox.runAction( device, control.Command.Service, control.Command.Action, params, null );
						  } 
						});
					break;
				};
				case "image": {
					//{"ControlGroup":"3","ControlType":"image","top":"0","left":"0","Display":{"url":"?id=request_image&cam=","Top":0,"Left":0,"Width":320,"Height":240}}
					var container = $(domparent).parents(".altui-device-controlpanel-container").addClass("altui-norefresh");
					var directstreaming = MultiBox.getStatus( device, "urn:upnp-org:serviceId:altui1", "DirectStreamingURL2" ) || MultiBox.getStatus( device, "urn:micasaverde-com:serviceId:Camera1", "DirectStreamingURL" );
					if (MultiBox.isRemoteAccess() || isNullOrEmpty(directstreaming) || isIE11() ) {
						var img = $("<img></img>")
							.appendTo($(domparent))
							.css({
								top: control.Display.Top, 
								left: control.Display.Left, 
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
						var streamurl = "url(http://{0}{1})".format(
							device.ip,	//ip
							directstreaming	//DirectStreamingURL
						);
						var div = $("<div></div>")
							.appendTo($(domparent))
							.css({
								top: control.Display.Top, 
								left: control.Display.Left, 
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
				default: {
					if (AltuiDebug.IsDebug())
						$(domparent).append("<pre class='altui-err-msg'>Unknown control type:"+control.ControlType+". See Debug</pre>");
				};
			};
		};

		$(domparent).css({position: 'relative'});
		if (tab.TabType=="flash") {
			$.each( tab.Control, function (idx,control) {
				var offset = _prepareSceneGroupOffset( tab, control );
				_displayControl( domparent, device, control, idx, offset );
			});
		}

		// fix height because absolute positioning removes element from the DOM calculations
		_fixHeight( domparent );
	};
	
	function _deviceDrawControlPanelOneTabContent(device, parent, tabidx ) {
		// Allways master controller for customer javascript functions, so 0!
		var _altuitypesDB = MultiBox.getALTUITypesDB();	// Master controller
		var dt = _altuitypesDB[device.device_type];
		if (dt!=null && dt.ControlPanelFunc!=null && (tabidx==0)) {
			Altui_ExecuteFunctionByName(dt.ControlPanelFunc, window, device, parent);
			// _fixHeight( parent );
		}
		else if (tabidx>0) {
			// on the contrary, UI5/7 static definition file is part of the controller specific device type DB 
			// so real controller this time
			var ui_static_data = MultiBox.getDeviceStaticData(device);
			if (ui_static_data!=null) {
				var tab = ui_static_data.Tabs[tabidx-1];
				if ((tab.TabType!="javascript") || ( $.inArray( tab.ScriptName, _forbiddenScripts) == -1))  {
					if ( tab.TabType=="flash") {
						_deviceDrawControlPanelTab( device, tab, parent );		// row for Flash Panel
					} else {
						_deviceDrawControlPanelJSTab( device, tab, parent );
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
		var obj = $("#altui-devtab-tabs li.active");
		if (obj.length ==0)
			return null;
		var pagename = obj.prop('id');
		return pagename.substring( "altui-devtab-".length);
	};	
			
	function _displayActiveDeviceTab(activeTabIdx, device, domparent) {
		if ($(domparent).hasClass("altui-norefresh")==false) {
			$(domparent).html("");
			_deviceDrawControlPanelOneTabContent(device, domparent, activeTabIdx );
		}
	};

	function _findCurrentValue(getelemstbl,varnum) {
		for (var i=0;i<getelemstbl.length;i+=2) {
			if (getelemstbl[i]==varnum)
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
		var sel = $("<select id='altui-deviceconfig-select' class='form-control input-sm'></select>");
		$(options).each(function() {
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
		html += "<div class='col-xs-4'><input required type='number' min='1' class='form-control input-sm' value='{0}'></input></div>".format( m[1] || "" );
		html += smallbuttonTemplate.format( 'altui-deletevar-'+varnum, 'altui-delete-variable', deleteGlyph ,'Delete');
		html += "</td>";
		html += "<td>";
		html += $("<div></div>").append(sel).html();
		html += "</td>";
		html += "<td>";
		html += "<div class='col-xs-6'><input type='number' class='form-control input-sm' value='{0}'></input></div>".format(value || "");
		html += "</td>";
		html += "<td>";
		html += "<div class='col-xs-6'>{0}</div>".format(current || "");
		html += "</td>";
		html += "</tr>";		
		return html;
	};
	function _deviceDrawControlPanel( device, container ) {
		var controller = MultiBox.controllerOf(device.altuiid).controller;

		function _drawDeviceLastUpdateStats( device ) {
			var variables = [
				{ service:"urn:micasaverde-com:serviceId:HaDevice1", name:"FirstConfigured" },
				{ service:"urn:micasaverde-com:serviceId:HaDevice1", name:"LastUpdate" },
				{ service:"urn:micasaverde-com:serviceId:HaDevice1", name:"BatteryDate" },
				{ service:"urn:micasaverde-com:serviceId:ZWaveDevice1", name:"LastWakeup" },
				{ service:"urn:micasaverde-com:serviceId:ZWaveDevice1", name:"LastRouteUpdate" },
				{ service:"urn:micasaverde-com:serviceId:SecuritySensor1", name:"LastTrip" },
			];
			// var html = "<div class='col-xs-12'>";
			var html = "";
			html += "<div class='panel panel-default'><div class='panel-body altui-device-keyvariables'>";
			html += "<div class='row'>";
			$.each(variables, function(idx,variable) {
				var value = MultiBox.getStatus( device, variable.service, variable.name);
				if ((value !=null) && (value !="")) {
					html += "<div class='col-sm-6 col-md-4'><b>{0}</b>: {1}</div>".format(variable.name,HTMLUtils.enhanceValue(value));
				}
			});
			html += "</div>";
			html +="</div></div>";		// panel
			// html += "</div>";			// col
			return html;
		};

		function _deviceDrawDeviceConfig( device, container ) {
			/*
http://192.168.1.16/port_3480/data_request?id=lu_variableset&DeviceNum=208&serviceId=urn%3Amicasaverde-com%3AserviceId%3AZWaveDevice1&Variable=VariablesSet&Value=3%2C1d%2C0&rand=0.9005297843832523
http://192.168.1.16/port_3480/data_request?id=lu_reload&rand=0.7390809273347259&source=devset3
			*/
			if (MultiBox.isDeviceZwave(device)) {
				var html ="";
				var curvariables = MultiBox.getStatus(device, "urn:micasaverde-com:serviceId:ZWaveDevice1", "ConfiguredVariable") || "";
				var setvariables = MultiBox.getStatus(device, "urn:micasaverde-com:serviceId:ZWaveDevice1", "VariablesSet");
				if (isNullOrEmpty(setvariables))
					setvariables = curvariables || "";
				var getvariables = MultiBox.getStatus(device, "urn:micasaverde-com:serviceId:ZWaveDevice1", "VariablesGet") || "";
				html +="<div class='row'>";
				html += "<div id='altui-device-config-"+device.altuiid+"' class='col-xs-12 altui-device-config'>"
				html += _drawDeviceLastUpdateStats( device );
				// if (isNullOrEmpty(setvariables) == false) {
					html += "<form id='myform' data-toggle='validator' role='form' action='javascript:void(0);' >";
					html += "<table class='table table-condensed altui-config-variables'>";
					html +=("<caption>{0} <button id='"+device.altuiid+"' type='submit' class='btn btn-sm btn-primary altui-device-config-save'>{1}</button></caption>").format(_T("Device zWave Parameters"),_T('Save Changes'));
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
				// }	
				html += "</div>";	// device-config
				html += "</div>";	// row
				$(container).append( html );		
				$(".altui-device-config")
					.on('click',".altui-add-variable", function() {
						var tr = $(this).closest('tr');	// remove the line purely
						$(tr).before( _displayConfigVariable( device,'0','m','','' ) );
					})
					.on('click',".altui-delete-variable",function(){
						var id = $(this).prop('id');
						var tr = $(this).closest('tr').remove();	// remove the line purely
					});
					// .on('click',".altui-device-config-save",function() {
						// var result = $('#myform').validator('validate');
						// $("#myform").submit();
					// });
				$("#myform").on('submit', function(e) {
					if (e.isDefaultPrevented()) {
						// handle the invalid form...
					} else {
						// everything looks good!
						e.preventDefault();
						// var result = $('#myform').validator('validate');
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
			}
		};
		
		function _deviceDrawDeviceUsedIn( device, container ) {
			var usedin_objects = MultiBox.getDeviceDependants(device);
			var html ="";
			html +="<div class='row altui-device-usedin'>";
			html += "<div id='altui-device-usedin-"+device.altuiid+"' class='col-xs-12'>"
			html += "<ul>";
			var smallbuttonTemplate ="<button id='{0}' type='button' class='{1} btn btn-default btn-sm' aria-label='tbd' title='{3}'>{2}</button>";;
			if (usedin_objects.length>0)
				$.each(usedin_objects, function(idx,obj) {
					var info=null;
					switch(obj.type) {
						case "action":
							info = _formatAction(controller,obj.action) ;
							html += "<li id='{0}'>Scene #{0} <span class='text-info'>'{1}'</span>, {2} <span class='text-info'>'{3}'</span>  &nbsp;".format(
								obj.scene, 
								obj.name, 
								obj.type, 
								"{0} (<small class='text-muted'>{1}</small>)".format(obj.action.action,info.arguments)
								);
							html += smallbuttonTemplate.format(obj.scene,"btn btn-default btn-sm altui-scene-goto",searchGlyph,_T("See")); // searchGlyph
							html += "</li>";
							break;
						case "trigger":
							info = _formatTrigger(controller,obj.trigger);
							html += "<li id='{0}'>Scene #{0} <span class='text-info'>'{1}'</span>, {2} <span class='text-info'>'{3}'</span>  &nbsp;".format(
								obj.scene, 
								obj.name, 
								obj.type, 
								"{0} {1} (<small class='text-muted'>{2}</small>)".format(info.name, info.descr,info.condition) 
								);
							html += smallbuttonTemplate.format(obj.scene,"btn btn-default btn-sm altui-scene-goto",searchGlyph,_T("See")); // searchGlyph
							html += "</li>";
							break;
						case "actionworkflow":
							info = _formatAction(controller,obj.action) ;
							html +="<li>Workflow #{0} <span class='text-info'>'{1}'</span> in state <span class='text-info'>'{2}'</span> action:{3} {4}</li>".format(
								obj.workflow.altuiid,
								obj.workflow.name,
								obj.state,
								"{0} (<small class='text-muted'>{1}</small>)".format(obj.action.action,info.arguments),
								smallbuttonTemplate.format(obj.workflow.altuiid,"btn btn-default btn-sm altui-wflow-goto",searchGlyph,_T("See"))
							);
							break;
						case "triggerworkflow":
							html +="<li>Workflow #{0} <span class='text-info'>'{1}'</span> in state <span class='text-info'>'{2}'</span> {3} (<small class='text-muted'>{4}</small>)  {5}</li>".format(
								obj.workflow.altuiid,
								obj.workflow.name,
								obj.state,
								obj.cond.variable,
								obj.cond.luaexpr,
								smallbuttonTemplate.format(obj.workflow.altuiid,"btn btn-default btn-sm altui-wflow-goto",searchGlyph,_T("See"))
							);
							break;
					}
				});
			else
				html += "<li>{0}</li>".format(_T("Not used in scenes"));
			html += "</ul>";
			// html +=  "<span><pre>{0}</pre></span>".format( JSON.stringify(usedin_objects) );
			html += "</div>";
			html += "</div>";	// row
			var dom = $(container).find("div.altui-device-usedin");
			if (dom.length==0)
				$(container).append( html );
			else {
				var visible = $( dom ).is( ":visible" );
				dom.replaceWith(html);
				dom = $(container).find("div.altui-device-usedin");
				dom.toggle(visible);
			}
		};
		function _deviceDrawDeviceTriggers( device, container ) {
			var devicecontroller = MultiBox.controllerOf(device.altuiid).controller;
			var users = MultiBox.getUsersSync(devicecontroller);
			var html ="";
			html +="<div class='row altui-device-triggers'>";
			html += "<div id='altui-device-triggers-"+device.altuiid+"' class='col-xs-12'>"
			html += "<ul>";
			var scenes = $.grep(MultiBox.getScenesSync(), function(scene) {
				var scenecontroller = MultiBox.controllerOf(scene.altuiid).controller;
				return (scenecontroller==devicecontroller)&&(scene.notification_only == device.id)
			});
			if (scenes) {
				$.each(scenes, function(idx,scene) {
					var selectedusers = (scene.triggers[0].users || "").toString().split(",");
					var names=[];
					$.each(users, function(idx,user){
						var inarray  = $.inArray(user.id.toString(),selectedusers);
						if (inarray!=-1)
							names.push(user.Name);
					});
					html += "<li>{0}:({1}) {2} {3}</li>".format(
						scene.name,
						names.join(","),
						buttonTemplate.format( scene.altuiid, 'btn-xs altui-scene-goto',searchGlyph,'default',_T("See")),
						buttonTemplate.format( scene.altuiid, 'btn-xs altui-device-deltrigger text-danger', deleteGlyph,'default',_T("Delete"))
						);
				});
			}
			html += "<li>{0}</li>".format(buttonTemplate.format( 'altui-device-createtrigger', 'altui-device-createtrigger', plusGlyph+_T("Create"),'default',_T("Create") ));
			html += "</ul>";
			html += "</div>";
			html += "</div>";	// row			
			var dom = $(container).find("div.altui-device-triggers");
			if (dom.length==0)
				$(container).append( html );
			else {
				var visible = $( dom ).is( ":visible" );
				dom.replaceWith(html);
				dom = $(container).find("div.altui-device-triggers");
				dom.toggle(visible);
			}
		}
		function _deviceDrawControlPanelAttributes(device, container ) {
			var devid = device.altuiid;
			// Draw hidding attribute panel
			var html ="";
			html+="<div class='row'>";
			html += "<div id='altui-device-attributes-"+devid+"' class='col-xs-12 altui-device-attributes'>"
			html += "<form class='form'>";
			$.each( device, function(key,val) {
				if (val!=undefined) {
					var typ = Object.prototype.toString.call(val);
					if ((typ!="[object Object]") && (typ!="[object Array]")){
						html += "<div class='col-sm-6 col-md-4 col-lg-3'>";
						html += "<div class='form-group'>";
						html += "<label for='"+key+"'>"+key+"</label>";
						html += _enhanceEditorValue(key,val,devid)
						// html += "<input id='"+key+"' data-altuiid='"+devid+"' class='form-control' value='"+val+"'></input>";
						html += "</div>"
						html += "</div>"
					}
				}
			});
			html += "</form>";
			html += "</div>";
			html += "</div>";	// row
			$(container).append( html );

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
									PageMessage.message( "Set Attribute succeeded! a LUUP reload will happen now, be patient", "success" );			
								}
							});
						}
						else {
							$(input).val(oldval);
						}
					});
				}
			});
		};
		
		function _deviceDrawWireFrame( device,container) {
			var devicecontroller = MultiBox.controllerOf(device.altuiid).controller;
			MultiBox.getRooms(null, function(room,idx) {
				return ( MultiBox.controllerOf(room.altuiid).controller == devicecontroller );
			},function(rooms) {
				var htmlRoomSelect = "<select id='altui-room-list' class='form-control input-sm'>";
				if (rooms)
						htmlRoomSelect 	  += "<option value='{1}' {2}>{0}</option>".format(_T("No Room"),0,'');
						$.each(rooms, function(idx,room) {
							var selected = (room.id.toString() == device.room);
							htmlRoomSelect 	  += "<option value='{1}' {2}>{0}</option>".format(room.name,room.id,selected ? 'selected' : '');
						});
				htmlRoomSelect 	  += "</select>";
		
				var htmlDeleteButton= (device.donotdelete==true) ? '' : buttonTemplate.format( device.altuiid, 'btn-xs altui-deldevice pull-right', deleteGlyph,'default',_T("Delete"));
				var html ="";
				html+="<div class='row'>";
					html +="<div id='altui-device-controlpanel-"+device.altuiid+"' class='col-xs-12 altui-device-controlpanel' data-altuiid='"+device.altuiid+"'>";
					html +="	<div class='panel panel-default'>";
					html +="		<div class='panel-heading form-inline'>";
					html += htmlDeleteButton;
					html +="			<h1 class='panel-title'>{0} {1} {2} (#{3}) "+htmlRoomSelect+"</h1>";
					html +="		</div>";
					html +="		<div class='panel-body'>";
					html +="		</div>";
					html +="	</div>";
					html +="</div>";
				html += "</div>";	// row
				$(container).append( html.format(device.manufacturer || '', device.model || '', device.name || '', device.id) );	
				$("#altui-room-list").change( function() {
					MultiBox.renameDevice(device, device.name, $(this).val() );
				});
			})
		};
			
		function _defereddisplay(bAsync) {
			function _createDeviceTabs( device, bExtraTab, tabs ) {
				var lines= [];
				lines.push("<ul class='nav nav-tabs' id='altui-devtab-tabs' role='tablist'>");
				if (bExtraTab) {
					lines.push( "<li id='altui-devtab-0' role='presentation' ><a href='#altui-devtab-content-0' aria-controls='{0}' role='tab' data-toggle='tab'>{0}</a></li>".format("AltUI") );
				}
				if (tabs!=undefined)
					$.each( tabs, function( idx,tab) {
						if ((tab.TabType!="javascript") || ( $.inArray( tab.ScriptName, _forbiddenScripts) == -1)) {
							lines.push( "<li id='altui-devtab-{1}' role='presentation' ><a href='#altui-devtab-content-{1}' aria-controls='{0}' role='tab' data-toggle='tab'>{0}</a></li>".format(tab.Label.text,idx+1) );
						}
					});
				lines.push("</ul>");
				var html = "<div class='tab-content {0}'>".format( (UIManager.UI7Check()==true) ? '' : 'altui-tabcontent-fix');
				if (bExtraTab) {
					html += "<div id='altui-devtab-content-0' class='tab-pane bg-info altui-devtab-content'>";
					html += "</div>";
				}
				if (tabs!=undefined)
					$.each( tabs, function( idx,tab) {
						if ((tab.TabType!="javascript") || ( $.inArray( tab.ScriptName, _forbiddenScripts) == -1)) {
							html += "<div id='altui-devtab-content-{0}' class='tab-pane bg-info altui-devtab-content'>".format(idx+1);
							html += "</div>";
						}
					});
				html += "</div>";
				return lines.join('')+html;
			};

			if (_toLoad==0) {
				$(container).append( "<div class='row'><div class='altui-debug-div'></div></div>" );	// Draw hidden debug panel

				var panel_body = container.find(".altui-device-controlpanel .panel-body");	
				var _altuitypesDB = MultiBox.getALTUITypesDB();					// for ALTUI plugin info
				var ui_static_data = MultiBox.getDeviceStaticData(device);
				if (ui_static_data!=null) {
					var bExtraTab = (_altuitypesDB[device.device_type] && _altuitypesDB[device.device_type].ControlPanelFunc!=null);
					$(panel_body).append( "<div class='row'>" + _createDeviceTabs( device, bExtraTab, ui_static_data.Tabs ) + "</div>" );
				}

				$(panel_body).find("li a").first().tab('show');	// activate first tab
				var activeTabIdx = _getActiveDeviceTabIdx();
				var domparent  =  $('div#altui-devtab-content-'+activeTabIdx);
				_displayActiveDeviceTab(activeTabIdx, device, domparent);

				if (bAsync) {
					$("#altui-device-attributes-"+device.altuiid).toggle(false);		// hide them by default;
					// $("#altui-device-usedin-"+device.altuiid).toggle(false);		// hide them by default;
					$(".altui-debug-div").toggle(false);					// hide
				}

				if (ui_static_data && AltuiDebug.IsDebug()) {
					$("div.altui-debug-div").append( "<pre>"+JSON.stringify(ui_static_data.Tabs)+"</pre>" );				
				}
				
			}
		};

		function _deviceRefreshDevicePanel(device, container) {
			_deviceDrawDeviceUsedIn( device, container );							// row for device 'used in' info
			_deviceDrawDeviceTriggers( device, container );							// row for device triggers info
		};
		
		var _toLoad = 0;
		_deviceDrawControlPanelAttributes( device, container ); 				// row for attributes
		_deviceDrawDeviceConfig( device, container );	
		_deviceRefreshDevicePanel(device, container)
		// row for device 'config' info
		_deviceDrawWireFrame(device,container);
		$(".altui-device-controlpanel-container")
			.on('click',".altui-wflow-goto",function(){
				var altuiid = $(this).prop("id");
				UIManager.pageWorkflow(altuiid);
			})
			.on('click',".altui-scene-goto",function(){
				var altuiid = $(this).prop("id");
				UIManager.pageSceneEdit(altuiid);
			})
			.on('click',".altui-device-deltrigger",function(){
				var altuiid = $(this).prop("id");
				var scene = MultiBox.getSceneByAltuiID(altuiid);
				MultiBox.deleteScene(scene);
				_deviceRefreshDevicePanel(device, container)
				//$(this).closest("li").remove();
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
					UIManager.pageSceneEdit(NULL_SCENE,scenetemplate);
				});		
			});
			
		var ui_static_data = MultiBox.getDeviceStaticData(device);		
		if (ui_static_data!=null) {
			// load scripts
			var scripts = {};
			if (ui_static_data.Tabs != undefined) 
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
									data = "//# sourceURL="+scriptname+"\n"+data;
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
		} else 
		{
			ALTUI_registered = false;
			if ($("#wrap #altui-license").length==0) {
				// rotating license message
				var close = "<button class='close altui-pagemessage-close' type='button' aria-label='Close'><span aria-hidden='true'>&times;</span></button>";
				$("body nav").after("<blockquote id='altui-license' class='blockquote'><p class='text-warning'>{0}.({1}){2}</p></blockquote>".format(
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
				$("div#dialogModal .row-fluid").append(html);
			}
		}
		return (res.update && res.update.valid)
	};
	
	function _refreshFooterSize() {
		if ( MyLocalStorage.getSettings('StickyFooter')==1 ) {
			$("#wrap")
					.css("width","100%")
					.css("overflow-y","auto")
					.css("overflow-x","hidden")
					.css("position","absolute")
					.css("top",$(".navbar-fixed-top").outerHeight(true))
					// .css("padding-top",$(".navbar-fixed-top").outerHeight(true)) //$(".navbar-fixed-top").outerHeight(true))
					.css("bottom",$("footer").outerHeight(true))
					// .css("max-height",window.innerHeight-$("footer").height() - $(".navbar-fixed-top").outerHeight(true));
		} else {
			$("body").css("margin-bottom",$("footer").outerHeight(true));
		}		
	};
	function _refreshFooter( bManual) {
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
			var re = /\$Revision:\s*(\d*).*\$/; 
			var m;
			if ((m = re.exec(ALTUI_revision)) !== null) {
				
				function _unregisteredFooter(footerstr) {
					$("small#altui-footer").html( footerstr );
				}
				// prepare data 
				footerMap.luaversion = _version;
				footerMap.jsrevision = m[1];
				var info = MultiBox.getBoxInfo();
				var infotbl=[];
				for( var key in info) { infotbl.push( info[key] || "") };
				footerMap.boxinfo = infotbl.join(", ").replace('\n','');
				var curuser = MultiBox.getMainUser();
				footerMap.curusername = curuser ? curuser.Name : '';
				usdGlyph = glyphTemplate.format( "usd", _T("License") , 'text-warning');
				footerMap.paypal = buttonTemplate.format( "altui-license-page", 'btn-default', "{0} {1}".format(usdGlyph,_T("License")),'default',_T("License"));

				// get template
				var altuidevice = MultiBox.getDeviceByID( 0, g_ALTUI.g_MyDeviceID );
				var footerTemplate =  MultiBox.getStatus( altuidevice, "urn:upnp-org:serviceId:altui1", "FooterBranding" )
					|| "<p>${appname} ${luaversion}.${jsrevision}, ${copyright} 2015 amg0,${boxinfo} User: ${curusername} <span id='registration'></span></p><span>${paypal}</span>";
				var tmpl = _.template(footerTemplate.trim());
				var footerstr =tmpl( footerMap )
				
				// if not confirmed back in 10 sec, consider the user as non registered
				var timer = setTimeout( function() { 
					_unregisteredFooter(footerstr);
					UIManager.googleScript('{"license":{"name":"'+footerMap.curusername+'","valid":false,"date":""},"update":{"valid":false,"forced":false,"newVersion":0,"newTrac":0,"newFeatures":[]}}');
				}, 10000 );
				
				// prepare extra info, remove undeeded info
				footerMap.footerstr = footerstr.replace("<span>"+footerMap.paypal+"</span>",'').replace("<span id='registration'></span>",'')
				delete footerMap.paypal

				// JSONP call that will trigger a response with a call to UIManager.googleScript
				ALTUI_registered = false;
				$.ajax({
					// crossDomain :true,
					// url:'https://script.google.com/macros/s/AKfycbyu0Xc8Hd3ruJolJGUsi5Chbq4GUnAl89LeDpky-1_nQA23kHs/exec',	// test
					url:'https://script.google.com/macros/s/AKfycbwWlgs1x0u1OpKKvaVFywb7XY_FfZ2dGcasvnD576RUbBP1OQc/exec',	// prod
					dataType: "jsonp",
					data: $.extend( { command:'registration' /*prefix:'UIManager.googleScript'*/ }, footerMap),
					cache:false
				}).done( function (data, textStatus, jqXHR) {
					// cancel timer if it exists
					if (timer) clearTimeout( timer );
					// display and update immediately
					_unregisteredFooter(footerstr);
					var bUpgrade = UIManager.googleScript(data);
					if ((bManual==true) && (bUpgrade==false)) {
						DialogManager.infoDialog(_T("Check for Updates"),_T("You already have the latest version"));
					}
				});
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
			$(".altui-favorites-device , .altui-favorites-housemode").css({width:'50%',"padding-bottom":'50%'});
			$(".altui-favorites-weather").css({width:'100%',"padding-bottom":'50%'});
		} else if ( width <500 ) {
			$(".altui-favorites-device , .altui-favorites-housemode").css({width:'30%',"padding-bottom":'30%'});
			$(".altui-favorites-weather").css({width:'60%',"padding-bottom":'30%'});
		} else if ( width <800 ) {
			$(".altui-favorites-device , .altui-favorites-housemode").css({width:'25%',"padding-bottom":'25%'});
			$(".altui-favorites-weather").css({width:'50%',"padding-bottom":'25%'});
		} else if ( width <1200 ){
			$(".altui-favorites-device , .altui-favorites-housemode").css({width:'20%',"padding-bottom":'20%'});
			$(".altui-favorites-weather").css({width:'40%',"padding-bottom":'20%'});
		} else {
			$(".altui-favorites-device , .altui-favorites-housemode").css({width:'10%',"padding-bottom":'10%'});
			$(".altui-favorites-weather").css({width:'20%',"padding-bottom":'10%'});
		}
		
		// console.log(".altui-favorites-device.length="+$(".altui-favorites-device").length);
		if ($(".altui-favorites-device-container").length>0) {
			var width = $(".altui-favorites-device-container").innerWidth();
			$(".altui-favorites-scene-content")
				.css("font-size",Math.floor(width/6))
			$(".altui-favorites-device-content")
				.css("font-size",Math.floor(width/6))
			$(".altui-favorites-smalltext")
				.css("font-size",Math.floor(width/12))
		}
	};

	function _redrawFavorites( bFirst) {
		if ( $(".altui-favorites").length==0 )
			return;
		function _drawFavoriteGauge(device,temp) {
			return '<div class="altui-gauge-favorite" id="altui-gauge-favorite-{0}" data-altuiid="{0}" data-name="{1}" data-temp="{2}"></div>'.format(device.altuiid,device.name,temp);
		}
		function _drawDefaultFavoriteDevice(device) {
			return UIManager.deviceIcon(device).replace('altui-device-icon','altui-device-icon altui-favorite-icon').replace('pull-left','');
		}
		function _drawFavoriteDevice(device) {
			var html="";
			html += "<div class='altui-favorites-device-content' data-altuiid='{0}'>".format(device.altuiid);
			var watts = parseFloat(MultiBox.getStatus( device, 'urn:micasaverde-com:serviceId:EnergyMetering1', 'Watts' )); 
			if (isNaN(watts)==false) 
				html += "<div class='bg-danger altui-favorites-watts'>{0} W</div>".format(watts);
			switch(device.device_type) {
				case "urn:schemas-micasaverde-com:device:Sonos:1":
					var src = MultiBox.getStatus(device, 'urn:upnp-org:serviceId:AVTransport', 'CurrentAlbumArt');
					html += "<img class='altui-sonos-tile-img' src='{0}' ></img>".format(src)
					break;
				case "urn:schemas-micasaverde-com:device:LightSensor:1":
					var level = MultiBox.getStatus( device, 'urn:micasaverde-com:serviceId:LightSensor1', 'CurrentLevel' ); 
					html += "<span>{0}</span> <span class='altui-favorites-smalltext'>lux</span>".format(level/*+ws.tempFormat*/);
					break;
				case "urn:schemas-upnp-org:device:BinaryLight:1":
					var status = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:SwitchPower1', 'Status' ); 
					status = parseInt(status);
					html += "<span class='{1}'>{0}</span>".format(
						status==1 ? "On" : "Off",
						status==1 ? "text-success" : "text-danger"
					);
					break;
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
					var loadLevelStatus = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:Dimming1', 'LoadLevelStatus' ); 
					html += "<span>{0}</span>  <span class='altui-favorites-smalltext'>%</span>".format(loadLevelStatus);				
					break;
				case "urn:schemas-micasaverde-com:device:HumiditySensor:1":
					var level = MultiBox.getStatus( device, 'urn:micasaverde-com:serviceId:HumiditySensor1', 'CurrentLevel' ); 
					html += "<span class='altui-favorites-device-content'>{0}</span> <span class='altui-favorites-smalltext'>%</span>".format(level);				
					break;
				case "urn:schemas-micasaverde-com:device:TemperatureSensor:1":
				case "urn:schemas-upnp-org:device:HVAC_ZoneThermostat:1":
				case "urn:schemas-upnp-org:device:Heater:1":
					var temp = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:TemperatureSensor1', 'CurrentTemperature' ); 
					html += _drawFavoriteGauge(device,temp)
					// html += "<span>{0}</span>".format((temp || "") +"&deg;"/*+ws.tempFormat*/);
					break;			
				case "urn:schemas-micasaverde-com:device:MotionSensor:1":
					var tripped = parseInt(MultiBox.getStatus( device, 'urn:micasaverde-com:serviceId:SecuritySensor1', 'Tripped' )); 
					html += ("<span>{0}</span>".format( (tripped==true) ? "<span class='glyphicon glyphicon-flash text-danger' aria-hidden='true'></span>" : " "));
					break;
				case "urn:schemas-upnp-org:device:VSwitch:1":
					var status = MultiBox.getStatus( device, 'urn:upnp-org:serviceId:VSwitch1', 'Status' ); 
					status = parseInt(status);
					html += "<span class='{1}'>{0}</span>".format(
						status==1 ? "On" : "Off",
						status==1 ? "text-success" : "text-danger"
					);
					break;
				case "urn:schemas-micasaverde-com:device:PowerMeter:1":
					var watts = MultiBox.getStatus( device, 'urn:micasaverde-com:serviceId:EnergyMetering1', 'Watts' );  
					html += "<span>{0}</span> <span class='altui-favorites-smalltext'>W</span>".format(watts || "-");				
					break;
				default:
					var _altuitypesDB = MultiBox.getALTUITypesDB();	// Master controller
					var dt = _altuitypesDB[device.device_type];
					if (dt!=null && dt.FavoriteFunc!=null ) {
						html += Altui_ExecuteFunctionByName(dt.FavoriteFunc, window, device);
					}
					else
						html += _drawDefaultFavoriteDevice(device);
					break;
			}
			html += "</div>";
			return html;
		};
		function _drawFavoriteScene(scenealtuiid) {
			return "<div data-altuiid='{1}' class='altui-favorites-scene-content'>{0}</div>".format(runGlyph,scenealtuiid);
		};
		function _udpateFavoriteDevice(elem,device) {
			switch (device.device_type) {
				case "urn:schemas-micasaverde-com:device:TemperatureSensor:1":
				case "urn:schemas-upnp-org:device:HVAC_ZoneThermostat:1":
				case "urn:schemas-upnp-org:device:Heater:1":
					var temp = parseFloat(MultiBox.getStatus( device, 'urn:upnp-org:serviceId:TemperatureSensor1', 'CurrentTemperature' )); 
					var jg = $(elem).find(".altui-gauge-favorite").data("justgage");
					jg.refresh(temp,Math.max( jg.config.max, temp));
					break;
				default:
					$(elem).replaceWith( _drawFavoriteDevice(device) );
			}
		}
		if (bFirst==true) {
			var favoritesToDraw=[];	// will then be sorted according to last saved preference
			
			// draw meteo
			if ( MyLocalStorage.getSettings('ShowWeather')==1 )
				favoritesToDraw.push({name:"meteo"});

			// draw Housemode
			if (UIManager.UI7Check()==true)
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
						var temp =  favoritesToDraw[posToInsert ];
						favoritesToDraw[posToInsert ] = favoritesToDraw[j];
						favoritesToDraw[j] = temp;
						posToInsert ++;
					}
				}
			}
			// draw them
			// CSS technique of http://stackoverflow.com/questions/20456694/grid-of-responsive-squares
			var favoriteTemplate = "";
			favoriteTemplate += "<div id='{0}' class='altui-favorites-device pull-left' >";
				favoriteTemplate += "<div class='altui-favorites-device-container' >";
						favoriteTemplate += "<div class='altui-favorites-title'>";
							favoriteTemplate += "<small class='text-info'>";
							favoriteTemplate += "{1}";
							favoriteTemplate += "</small>";
						favoriteTemplate += "</div>";
					favoriteTemplate += "<div class='altui-favorites-table'><div class='altui-favorites-table-cell'>";
						favoriteTemplate += "{2}";
					favoriteTemplate += "</div></div>";
				favoriteTemplate += "</div>";
			favoriteTemplate += "</div>";

			var html = "";
			
			html += "<div class='altui-favorites row'>";
			html += "<div class='altui-favorites-sortable col-xs-12'>";
			$.each(favoritesToDraw,function(idx,fav) {
				if (fav.name=="meteo") {
					var meteoTemplate = "";
					meteoTemplate += "<div id='{0}' class='altui-favorites-weather pull-left' >";
						meteoTemplate += "<div class='altui-favorites-device-container' >";
							meteoTemplate += "<div class='altui-favorites-table'><div class='altui-favorites-table-cell'>";
								meteoTemplate += "{1}";
							meteoTemplate += "</div></div>";
						meteoTemplate += "</div>";
					meteoTemplate += "</div>";
					var language = getQueryStringValue("lang") || window.navigator.userLanguage || window.navigator.language;
					var ws = MultiBox.getWeatherSettings();
					if ((ws.tempFormat==undefined) || (ws.tempFormat==""))
						ws.tempFormat=MyLocalStorage.getSettings('TempUnitOverride'); 
					var html_meteo="";
					html_meteo +='<a href="//www.accuweather.com/" class="aw-widget-legal">';
					html_meteo +=('</a><div id="awcc1439296613816" class="aw-widget-current"  data-locationkey="1097583" data-unit="'+ws.tempFormat.toLowerCase()+'" data-language="'+language.substring(0, 2)+'" data-useip="true" data-uid="awcc1439296613816"></div><script type="text/javascript" src="//oap.accuweather.com/launch.js"></script>');
					html +=(meteoTemplate.format("meteo",html_meteo))
					
				} else if (fav.name == "housemode" ) {
					var housemodeTemplate = "";
					housemodeTemplate += "<div id='{0}' class='altui-favorites-housemode pull-left' >";
						housemodeTemplate += "<div class='altui-favorites-device-container' >";
							housemodeTemplate += "<div class='altui-favorites-table'><div class='altui-favorites-table-cell'>";
								housemodeTemplate += "{1}";
							housemodeTemplate += "</div></div>";
						housemodeTemplate += "</div>";
					housemodeTemplate += "</div>";
					html +=(housemodeTemplate.format("housemode", HouseModeEditor.displayModes2('altui-housemode-group','',[]) ))
					
				} else if (fav.name[0]=="d") {
					html +=favoriteTemplate.format(fav.name,fav.device.name,_drawFavoriteDevice(fav.device));
					
				} else if (fav.name[0]=="s") {
					html +=favoriteTemplate.format(fav.name,fav.scene.name,_drawFavoriteScene(fav.scene.altuiid));
					
				}
			});

			// close col & row
			html += "</div>";		
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
				gageCfg.max = Math.max(temp, gageCfg.max);
				gageCfg.min = Math.min(temp, gageCfg.min);			
				var g = new JustGage({
					id: "altui-gauge-favorite-"+altuiid,
					value: temp,
					min: gageCfg.min,
					max: gageCfg.max,
					relativeGaugeSize: true,
					formatNumber: true,
					decimals:1,
					valueFontColor: valueFontColor
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
					_udpateFavoriteDevice(content,device);
					return true;
				}
				var content = $(elem).find(".altui-favorites-scene-content");
				if (content.length>0) {
					var altuiid = content.data("altuiid");
					$(content).replaceWith( _drawFavoriteScene(altuiid) );
				}
			});
			// resize favorite
			_resizeFavorites();
		}
	};

	function _refreshUI( bFull, bFirstTime ) {
		// refresh rooms
		// refresh devices
		// AltuiDebug.debug("_refreshUI( {0}, {1} )".format(bFull,bFirstTime));
		
		// $(".altui-device") which do not have a btngroup in open state
		// to avoid a refresh to erase an opened popup menu
		$(".altui-device:not(.altui-norefresh)").not(":has(div.btn-group.open)").each( function( index, element) {
		// $(".altui-device:not(:has(div.btn-group.open))").not(".altui-norefresh").each( function( index, element) {
			var devid = $(this).data("altuiid");
			var device = MultiBox.getDeviceByAltuiID( devid );
			if ( (device!=null) && (bFull==true || device.dirty==true) ) {
				
				// get HTML for device and draw it
				var Html = _deviceDraw(device);
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
				$(element).replaceWith(  html );
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
			var selector = "#altui-page-content-{0} .altui-widget".format(pagename.replace(' ','_'));
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
					$("div.altui-housemode2").removeClass("housemode2_selected").addClass("housemode2_unselected");
					$("#altui-mode"+mode).removeClass("housemode2_unselected").addClass("housemode2_selected");
				}
				ALTUI_hometimer=setTimeout( _refreshModes, 10000 );		
			});
		};
	};
	
	function _initOptions(serveroptions) {
		if (isNullOrEmpty(serveroptions)) {
			serveroptions="{}";
		}
		var defaults = JSON.parse(serveroptions);
		// option1=val1,option2=val2,...
		// serveroptions = atob(serveroptions);
		// var tbl = serveroptions.split(',');
		// var defaults={};
		// $.each(tbl, function(idx,elem) {
			// var key_vals=elem.split('=');
			// defaults[ key_vals[0] ] =  key_vals[1];
		// });
		$.each( $.merge( $.merge( [], _checkOptions ), _editorOptions ) , function(idx,opt) {
			if (MyLocalStorage.getSettings(opt.id) == null)
				if (defaults[opt.id] != undefined )
					MyLocalStorage.setSettings(opt.id, atob(defaults[opt.id]) );
				else
					MyLocalStorage.setSettings(opt.id, opt._default);
		});
	};
	function _forceOptions(name,value) {
		$.each( _checkOptions, function(idx,opt) {
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
			_loadScript("J_ALTUI_b_blockly_compressed.js",function() {
				_loadScript("J_ALTUI_b_blocks_compressed.js",function() {
					_loadScript("J_ALTUI_b_"+language+".js",function() {
						_loadScript("J_ALTUI_b_javascript_compressed.js",function() {
							_loadScript("J_ALTUI_b_lua_compressed.js",function() {
								if ($.isFunction(callback))
									(callback)();
							});
						});
					});
				});
			});
		}
	}
	function _initACEandJoint() {
		// $("title").before("<link rel='stylesheet' type='text/css' href='//cdnjs.cloudflare.com/ajax/libs/jointjs/0.9.7/joint.css'>");
		$.when( HtmlResourcesDB.loadResourcesAsync([ 
				"https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.2/ace.js",
				"https://cdnjs.cloudflare.com/ajax/libs/jointjs/0.9.7/joint.shapes.devs.min.js"
				// "http://www.jointjs.com/js/vendor/lodash/lodash.min.js",
				// "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.6.1/lodash.min.js",
				]) )
			.done(function(){
			})
	};
	
	function _initMultiSelect() {
		$("title").before("<style type='text/css'>{0}</style>".format(bootstrap_multiselect_css));
	};
	
	function _initUIEngine(css) {
		$("title").before("<style type='text/css'>{0}</style>".format(css));
	};	

	function _setTitle(title) {
		$("title").text(title);
	};
	function _setTheme(themecss) {
		if (isNullOrEmpty(themecss)) {
			themecss = g_ALTUI.g_OrgTheme;
			$("link[href='"+g_ALTUI.g_CustomTheme+"']").attr('href',themecss);
			g_ALTUI.g_CustomTheme = themecss;
			MyLocalStorage.setSettings("Theme",null);
		} else {
			var link = $("link[href='{0}']".format(g_ALTUI.g_CustomTheme));
			if (link.length>0) {
				$(link).attr('href',themecss);					
			} else {
				// if (themecss && (themecss.trim()!="") )
				$("title").after("<link rel='stylesheet' href='"+themecss+"'>");			
			}
			g_ALTUI.g_CustomTheme = themecss;
			MyLocalStorage.setSettings("Theme",themecss);
		}
	};

	function _initEngine(styles, devicetypes, themecss, serveroptions, cbfunc) {
		_initOptions(serveroptions);
		_initUIEngine(styles);
		_initDB(devicetypes,cbfunc);
		_setTheme(themecss);
		_initMultiSelect();
		// _initACEandJoint();
		_initBlockly();
	};

	function _clearScripts() {
	};
	
	//------------------------------------------------------------	
	//  CUSTOM PAGE MENU
	//------------------------------------------------------------	

	var startpos = null;
	var _widgetOnCanvasResizableOptions = function(tool) {
		return {
			aspectRatio: tool.aspectRatio ||false,		// no aspect ratio by default
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
	var _widgetOnCanvasDraggableOptions = function(page) {
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
		$(selector).draggable(_widgetOnCanvasDraggableOptions(page));
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
		propertyline += "      	<div class='form-group'>";
		propertyline += "      		<label for='altui-widget-imgsource'>Image Source</label>";
		propertyline += "      		<input id='altui-widget-imgsource' class='form-control' type='url' value='{0}' placeholder='enter url or data URI here'></input>";
		propertyline += "      	</div>";
		var dialog = DialogManager.registerDialog('dialogModal',
						defaultDialogModalTemplate.format( 'dialogModal',
						'Image Properties',																// title
						"<form>"+propertyline.format( widget.properties.url.htmlEncode() )+"</form>",				// body
						"modal-lg"	// body
					));

		DialogManager.dlgAddDialogButton($('div#dialogModal'), true, _T("Save Changes"));				
		// buttons
		$('div#dialogModal form').off('submit');
		$('div#dialogModal form').on( 'submit', function() {
			real_widget.properties.url = $('#altui-widget-imgsource').val();
			$('div#dialogModal').modal('hide');
			_showSavePageNeeded(true);
			$( _getWidgetSelector(page,real_widget) ).find("img").attr("src",real_widget.properties.url);
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
				DialogManager.dlgAddLine(dialog,'ValueON', _T('Value ON'),widget.properties.onvalue,"",{placeholder:"Leave empty for 1 or true"},"col-xs-6");
				DialogManager.dlgAddLine(dialog,'ValueOFF', _T('Value OFF'),widget.properties.offvalue,"",{placeholder:"Leave empty for 0 or false or null"},"col-xs-6");
				DialogManager.dlgAddLine(dialog,'OnLabel', _T('OnLabel'), widget.properties.labels[1],"",null,"col-xs-6");
				DialogManager.dlgAddLine(dialog,'OffLabel', _T('OffLabel'),widget.properties.labels[0],"",null,"col-xs-6");
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
				greenTo: 	$.isNumeric(widget.properties.orangefrom) ? widget.properties.orangefrom : widget.properties.max
			});
		if ($.isNumeric(widget.properties.orangefrom))
			options = $.extend(options, {
				yellowFrom:	widget.properties.orangefrom, 
				yellowTo: 	$.isNumeric(widget.properties.redfrom) ? widget.properties.redfrom : widget.properties.max
			});
		if ($.isNumeric(widget.properties.redfrom))
			options = $.extend(options, {
				redFrom:	widget.properties.redfrom, 
				redTo: 		widget.properties.max
			});

		if (widget.properties.inverted) {
			function _swap(a,b) { var z=options[a];  options[a]=options[b]; options[b]=z; }
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
		var min = Math.min.apply(null, $.map( $(selected) , function(elem)  {return $(elem).position().top;}) );
		$(selected).each( function(idx,elem) {
			$(elem).css('top',min);
		});
		_showSavePageNeeded(true);
	};
	function onAlignHorizontal(selected)
	{
		var max = Math.max.apply(null, $.map( $(selected) , function(elem)  {return $(elem).position().top+$(elem).height()/2;}) );
		$(selected).each( function(idx,elem) {
			$(elem).css('top',max-$(elem).height()/2);
		});
		_showSavePageNeeded(true);
	};
	function onAlignBottom(selected)
	{
		var max = Math.max.apply(null, $.map( $(selected) , function(elem)  {return $(elem).position().top+$(elem).height();}) );
		$(selected).each( function(idx,elem) {
			$(elem).css('top',max-$(elem).height());
		});
		_showSavePageNeeded(true);
	};
	function onAlignLeft(selected)
	{
		var min = Math.min.apply(null, $.map( $(selected) , function(elem)  {return $(elem).position().left;}) );
		$(selected).each( function(idx,elem) {
			$(elem).css('left',min);
		});
		_showSavePageNeeded(true);
	};
	function onAlignVertical(selected)
	{
		var max = Math.max.apply(null, $.map( $(selected) , function(elem)  {return $(elem).position().left+$(elem).width()/2;}) );
		$(selected).each( function(idx,elem) {
			$(elem).css('left',max-$(elem).width()/2);
		});
		_showSavePageNeeded(true);
	};
	function onAlignRight(selected)
	{
		var max = Math.max.apply(null, $.map( $(selected) , function(elem)  {return $(elem).position().left+$(elem).width();}) );
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
		if  ( ( (widget.properties.offvalue=='') && ((status==undefined) || (status==null) ||(status==false) || (status=='0')) ) ||  (status==widget.properties.offvalue) )
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
		return $("#altui-page-tabs li.active").text();		
		// return pagename != undefined ? pagename.substring( "altui-page-".length) : '';
	};
	
	// one page if specified, all pages otherwise
	function _getPageSelector( page ) {
		if (page == undefined)
				return ".altui-page-content-one";
		return "#altui-page-content-{0}".format(page.name.replace(' ','_'));
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
			if ((idxPage==-1) || (idx==idxPage)) {
				lines.push( "<li id='altui-page-{1}' role='presentation' ><a href='#altui-page-content-{1}' aria-controls='{1}' role='tab' data-toggle='tab'>{0}</a></li>".format(page.name,page.name.replace(' ','_')) ); // no white space in ID
			}
		});
		
		if (bEditMode==true) {
			actions+="<li role='presentation' class='dropdown'>";
			actions+="<a class='dropdown-toggle' data-toggle='dropdown' href='#' role='button' aria-expanded='false'>";
			actions+="Actions <span class='caret'></span>";
			actions+="</a>";
			actions+="<ul class='dropdown-menu' role='menu'>";
			actions+="<li><a id='altui-page-action-new' href='#'>"+_T("New Page")+"</a></li>";
			actions+="<li><a id='altui-page-action-properties' href='#'>"+_T("Page Properties")+"</a></li>";
			actions+="<li><a id='altui-page-action-delete' href='#'>"+_T("Delete this Page")+"</a></li>";
			actions+="</ul>";
			actions+="</li>";
			actions+="<li><a id='altui-page-action-save' href='#'>"+_T("Save All Pages")+"</a></li>";
		}
		return "<ul class='nav nav-tabs {2}' id='altui-page-tabs' role='tablist'>{0}{1}</ul>".format(
			lines.join(''),actions, (idxPage==-1) ? '' : "hidden");
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
		var str = "<div role='tabpanel' class='tab-pane altui-page-content-one' id='altui-page-content-{0}' >{1}</div>".format(page.name.replace(' ','_'),pageelemhtml); // no white space in IDs
		var elem = $(str).css('background',page.background).height(height+1);
		return elem.wrap( "<div></div>" ).parent().html();
	};
	
	function _updateDynamicDisplayTools( bEdit )
	{
		// var pagename = _getActivePageName();
		PageManager.forEachPage( function( idx, page) {
			$.each(tools, function(idx,tool) {
				if ($.isFunction( tool.onWidgetDisplay) )
				{
					var selector = "#altui-page-content-{0} .{1}".format(page.name.replace(' ','_'),tool.cls);
					$(selector).each( function(idx,elem) {
						var widgetid = $(elem).prop('id');
						(tool.onWidgetDisplay)(page,widgetid, bEdit);		// edit mode							
					})
				}
			});	
		});
	};
	
	function _createControllerSelect(htmlid) {
		var html = "";
		html += "<form class='form-inline col-xs-12'>";
			html += "<div class='form-group'>";
				html += "<label class='control-label ' for='altui-controller-select' >"+_T("Controller")+":</label>";
				html += "<select id='"+htmlid+"' class='form-control'>";
				$.each(MultiBox.getControllers(), function( idx, controller) {
					html += "<option value='{0}'>{1}</option>".format( idx , controller.ip=='' ? window.location.hostname : controller.ip  );
				});
				html += "</select>";
			html += "</div>";
		html += "</form>";
		return html;
	};

	var bUIReady = false;
	var bEngineReady = false;

	// explicitly return public methods when this object is instantiated
  return {
	  
	//---------------------------------------------------------
	// PUBLIC  functions
	//---------------------------------------------------------
	initEngine 		: _initEngine, 
	initLocalizedGlobals : _initLocalizedGlobals,
	forceOptions 	: _forceOptions,	// (name,value)
	loadScript 		: _loadScript,	//(scriptLocationAndName) 
	loadD3Script	: _loadD3Script,
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
	onoffOnClick 		: _onoffOnClick,
	
	//drawing functions
	displayJson			: _displayJson,
	displayTimer		: _displayTimer,
	displayTimers		: _displayTimers,
	jobStatusToColor	: _jobStatusToColor,
	defaultDeviceDrawWatts: _defaultDeviceDrawWatts,	// default HTML for Watts & UserSuppliedWattage variable
	deviceIcon			: _deviceIconHtml,				//( device, zindex, onclick )
	deviceDraw 			: _deviceDraw,					// draw the mini device on device page; can be customized by a plugin by ["DeviceDrawFunc"]
	deviceDrawVariables : _deviceDrawVariables,			// draw the device variables
	deviceDrawActions 	: _deviceDrawActions,			// draw the device Upnp Actions
	deviceDrawControlPanel 	: _deviceDrawControlPanel,	// draw the full device control panel page; can be customized by a plugin ["ControlPanelFunc"]
	deviceCreate		: _deviceCreate,
	cameraDraw			: _cameraDraw,
	sceneDraw			: _sceneDraw,
	refreshUI 			: _refreshUI,					// 
	refreshUIPerDevice	: _refreshUIPerDevice,
	refreshFooter		: _refreshFooter,
	
	// breadcumb
	breadCrumb: function( title , param ) {
		var tbl = [
			{ id:0, title:_T('Home'), onclick:'UIManager.pageHome()', 		parent:-1},
			{ id:1, title:_T('Rooms'), onclick:'UIManager.pageRooms()', 	parent:0 },
			{ id:2, title:_T('Devices'), onclick:'UIManager.pageDevices()', parent:0 },
			{ id:5, title:_T('Control Panel'), onclick:'UIManager.pagexxx()', parent:2 },
			{ id:6, title:_T('Scenes'), onclick:'UIManager.pageScenes()', 	parent:0 },
			{ id:7, title:_T('Scene Edit'), onclick:'UIManager.pageSceneEdit()', parent:6 },
			{ id:8, title:_T('Plugins'), onclick:'UIManager.pagePlugins()', parent:0 },
			{ id:9, title:_T('Custom Pages'), onclick:'UIManager.pageUsePages()', parent:0 },
			{ id:10, title:_T('Edit Pages'), onclick:'UIManager.pageEditPages()', parent:0 },
			{ id:11, title:_T('Credits'), onclick:'UIManager.pageCredits()', parent:0 },
			{ id:12, title:_T('LuaTest'), onclick:'UIManager.pageLuaTest()', parent:0 },
			{ id:13, title:_T('LuaStart'), onclick:'UIManager.pageLuaStart()', parent:0 },
			{ id:14, title:_T('Options'), onclick:'UIManager.pageOptions()', parent:0 },
			{ id:15, title:_T('Editor'), onclick:'UIManager.pageEditor()', parent:8 },
			{ id:16, title:_T('ZWave'), onclick:'UIManager.pageZwave()', parent:0 },
			{ id:17, title:_T('Localize'), onclick:'UIManager.pageLocalization()', parent:0 },
			{ id:18, title:_T('Debug'), onclick:'UIManager.pageDebug()', parent:0 },
			{ id:19, title:_T('Power'), onclick:'UIManager.pagePower()', parent:0 },
			{ id:20, title:_T('Parent/Child'), onclick:'UIManager.pageChildren()', parent:0 },
			{ id:21, title:_T('zWaveRoutes'), onclick:'UIManager.pageRoutes()', parent:0 },
			{ id:22, title:_T('Quality'), onclick:'UIManager.pageQuality()', parent:0 },
			{ id:23, title:_T('TblDevices'), onclick:'UIManager.pageTblDevices()', parent:0 },
			{ id:24, title:_T('OsCommand'), onclick:'UIManager.pageOsCommand()', parent:0 },
			{ id:25, title:_T('Triggers'), onclick:'UIManager.pageTriggers()', 	parent:6 },
			{ id:26, title:_T('Themes'), onclick:'UIManager.pageThemes()', parent:0 },
			{ id:27, title:_T('TblScenes'), onclick:'UIManager.pageTblScenes()', parent:0 },
			{ id:28, title:_T('TblControllers'), onclick:'UIManager.pageTblControllers()', parent:0 },
			{ id:29, title:_T('TblWatches'), onclick:'UIManager.pageTblWatches()', parent:0 },
			{ id:30, title:_T('WatchDisplay'), onclick:'UIManager.pageWatchDisplay()', parent:0 },
			{ id:31, title:_T('Workflow Pages'), onclick:'UIManager.pageWorkflows()', parent:0 },
			{ id:32, title:_T('Workflow'), onclick:'UIManager.pageWorkflow()', parent:31 },
			{ id:33, title:_T('Workflow Report'), onclick:'UIManager.pageWorkflowReport()', parent:31 },
			{ id:34, title:_T('License'), onclick:'UIManager.pageLicense()', parent:0 },
			{ id:35, title:_T('Evolutions'), onclick:'UIManager.pageEvolutions()', parent:0 },		
			{ id:36, title:_T('App Store'), onclick:'UIManager.pageAppStore()', parent:0 },
			{ id:37, title:_T('Publish App'), onclick:'UIManager.pageAppPublish()', parent:36 },
		];

		function _parentsOf(child) {
			var html = "";
			$.each(tbl, function( idx,line) {
				if (child.parent==line.id) {
					var thisline = "<li><a href='javascript:void(0);' onclick='"+line.onclick+";return false;' >"+line.title+"</a></li>";
					var parentlines = (line.parent==-1) ? '' :  _parentsOf(line);
					html = parentlines + thisline;
					return false;
				}
			});
			return html;
		};
		
		var html="";
		html+="<ol class='breadcrumb altui-breadcrumb'>";
		// html+="<li><a href='javascript:void(0);' onclick='UIManager.pageHome();return false;' >Home</a></li>";
		// html+="<li><a href='javascript:void(0);' onclick='UIManager.pageDevices();return false;' >Device</a></li>";
		// html+="<li class='active'>Data</li>";
		$.each(tbl, function( idx,line) {
			if (line.title==title) {
				html += _parentsOf(line);
				html += "<li class='active'>{0}</li>".format(line.title);
			}
		});
		html+="</ol>";
		return html;
	},
	
	// pages
	appStoreLayout: function(title)
	{
		var body="";
		body+="	<div class='altui-layout row'>";
		body+="		<div class='col-xs-12 altui-mainpanel'>";
		body+="		</div>";
		body+="	</div>";
		return body;
	},
	oneColumnLayout: function(title)
	{
		var body="";
		body+="	<div class='altui-layout row'>";
		body+="		<div class='col-xs-12 col-sm-push-1 col-sm-10'>";
		body+="			<div class=''><h4 id='altui-pagetitle' >"+title+"</h4></div>";
		body+="			<div class='altui-mainpanel row'>";
		body+="			</div>";
		body+="		</div>";
		body+="	</div>";
		return body;
	},
	twoColumnLayout: function(title)
	{
		var body="";
		body+="	<div class='altui-layout row'>";
		body+="		<div class='col-sm-10 col-sm-push-2'>";
		body+="			<h3 id='altui-pagetitle' >"+title+"</h3>";
		body+="			<div class='altui-mainpanel row'>";
		body+="			</div>";
		body+="		</div>";
		body+="		<div class='col-sm-2 col-sm-pull-10 hidden-xs {0}'>".format( (MyLocalStorage.getSettings('FixedLeftButtonBar') || "")==1 ? 'affix' : '' );
		body+="			<div class='altui-leftnav btn-group-vertical' role='group' aria-label='...'>";
		body+="				<!--";
		body+="				<button type='button' class='btn btn-default'>One</button>";
		body+="				<button type='button' class='btn btn-default'>Deux</button>";
		body+="				<button type='button' class='btn btn-default'>Trois</button>";
		body+="				-->";
		body+="			</div>";
		body+="		</div>";
		body+="	</div>";
		return body;
	},
	
	clearPage : function(breadcrumb,title,layout)
	{
		var layoutfunc = layout || UIManager.twoColumnLayout;
		
		UIManager.stoprefreshModes();
		HTMLUtils.stopAllTimers();
		$(".navbar-collapse").collapse('hide');
		$(".altui-layout").remove();

		var body = (layoutfunc)(title || '' );
		$("div[role=main]").append(body);
		PageMessage.init();
		$("#altui-toggle-messages").before ( UIManager.breadCrumb( breadcrumb ) );


		// elements outside of the layout
		$("#dialogs").off().empty();
		$(".altui-scripts").remove();
		
		// remove Blockly				
		// $(".blocklyWidgetDiv").remove();
		// $(".blocklyTooltipDiv").remove();
		$(".blocklyToolboxDiv").remove();
		$("body").append("<div class='altui-scripts'></div>");
	},
	
	//window.open("data_request?id=lr_ALTUI_Handler&command=home","_self");
	pageHome : function()
	{
		UIManager.clearPage(_T('Home'),_T("Welcome to ALTUI"),UIManager.oneColumnLayout);
		$("#altui-pagetitle").remove();
		//if ( MyLocalStorage.getSettings('ShowWeather')==1 )
		if(0)
		{                                                            
			var language = getQueryStringValue("lang") || window.navigator.userLanguage || window.navigator.language;
			var ws = MultiBox.getWeatherSettings();
			if ((ws.tempFormat==undefined) || (ws.tempFormat==""))
				ws.tempFormat=MyLocalStorage.getSettings('TempUnitOverride'); 
			var html="";
			html ="<div class='altui-weather-widget hidden-xs'>";
			// html +='<a href="//www.accuweather.com/fr/fr/meylan/1097583/weather-forecast/1097583" class="aw-widget-legal">';
			html +='<a href="//www.accuweather.com/" class="aw-widget-legal">';
			html +=('</a><div id="awcc1439296613816" class="aw-widget-current"  data-locationkey="1097583" data-unit="'+ws.tempFormat.toLowerCase()+'" data-language="'+language.substring(0, 2)+'" data-useip="true" data-uid="awcc1439296613816"></div><script type="text/javascript" src="//oap.accuweather.com/launch.js"></script>');
			html +="</div>";
			// console.log(html);
			$(".altui-mainpanel").append(html);
		}
		$(".altui-mainpanel").append("<div class='col-xs-12'><div class='altui-favorites row'></div></div>");
		$(".altui-mainpanel")
			.off("click",".altui-favorites-scene-content")
			.on("click",".altui-favorites-scene-content",function() {
				var altuiid = $(this).data("altuiid");
				MultiBox.runSceneByAltuiID(altuiid);
			})
			.off("click",".altui-favorites-device-content")
			.on("click",".altui-favorites-device-content",function() {
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
						var status = parseInt(MultiBox.getStatus(device,"urn:upnp-org:serviceId:Dimming1","LoadLevelStatus") || 1);
						MultiBox.runAction( device , "urn:upnp-org:serviceId:Dimming1", "SetLoadLevelTarget", {newLoadlevelTarget: ((status>0) ? 0 : 100) } );
						break;
					case "urn:schemas-upnp-org:device:VSwitch:1":
						MultiBox.runAction( device, "urn:upnp-org:serviceId:VSwitch1","ToggleState", {} );
						break;
					case "urn:schemas-upnp-org:device:cplus:1":;
					default:
						UIManager.pageControlPanel(altuiid);
						break;
				}	
			});
		_redrawFavorites( true );
	},
	
	pageRemoteAccess : function ()
	{
		window.open( _remoteAccessUrl, '_blank');
	},
	
	// ===========================
	//  Page UI pieces helpers
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
		if ($.isFunction( clickFunction ))  {
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
	//  Full Pages update Methods
	// ===========================
	pageRooms : function ()
	{
		var _AllDevices = MultiBox.getDevicesSync();
		var _AllScenes= MultiBox.getScenesSync();

		function _roomScenes(room) {
			// devices of the room
			var rcontroller = MultiBox.controllerOf(room.altuiid).controller;
			var selectedscenes=[];
			var scenes =$.grep(_AllScenes,function(s) {
				var scontroller = MultiBox.controllerOf(s.altuiid).controller;
				if ( scontroller==rcontroller ) {
					if (s.room == room.id)
						selectedscenes.push(s.altuiid);	// is in this room
					return true;	// same controller room
				}
				return false;		
			});

			var Html="";
			Html+='<select class="altui-scenes-room" id="{0}" multiple="multiple">'.format(room.altuiid);
			$.each(_AllScenes , function(i,scene){
				Html+='<option value="{0}" {2}>{1}</option>'.format( scene.altuiid,scene.name, ($.inArray(scene.altuiid,selectedscenes)!=-1) ? 'selected':'' );
			});
			Html+='</select>';
			return Html;
		}
		function _roomDevices(room) {
			// devices of the room
			var rcontroller = MultiBox.controllerOf(room.altuiid).controller;
			var selecteddevices=[];
			var devices =$.grep(_AllDevices,function(d) {
				var dcontroller = MultiBox.controllerOf(d.altuiid).controller;
				if ( dcontroller==rcontroller ) {
					if (d.room == room.id)
						selecteddevices.push(d.altuiid);	// is in this room
					return true;	// same controller device
				}
				return false;		
			});
			
			var Html="";
			Html+='<select class="altui-devices-room" id="{0}" multiple="multiple">'.format(room.altuiid);
			$.each(_AllDevices , function(i,device){
				Html+='<option value="{0}" {2}>{1}</option>'.format( device.altuiid,device.name, ($.inArray(device.altuiid,selecteddevices)!=-1) ? 'selected':'' );
			});
			Html+='</select>';
			return Html;
		};
		
		UIManager.clearPage(_T('Rooms'),_T("Rooms"),UIManager.oneColumnLayout);
		var formHtml="";
		formHtml+=" <div class='form-group '>";
		formHtml+=" <div class='input-group '>";
		formHtml+="       <input id='altui-create-room-name' type='text' class='form-control' placeholder='Room name...'>";
		formHtml+="       <span class='input-group-btn'>";
		formHtml+="         <button id='altui-create-room' class='btn btn-default' type='button'>"+plusGlyph+"&nbsp;"+_T("Create")+"</button>";
		// formHtml+="         <button id='altui-save-rooms' class='btn btn-default' type='button'>"+saveGlyph+"&nbsp;"+_T("Save")+"</button>";
		formHtml+="       </span>";
		formHtml+="     </div><!-- /input-group -->";
		formHtml+="     </div><!-- /form-group -->";
	
		// on the left nav
		// nothing
		
		// on the main panel
		// table of rooms
		$(".altui-mainpanel")
			.append( _createControllerSelect('altui-controller-select'))
			.append($("<div class='col-xs-12'><table id='table' class='table table-condensed'><thead><tr><th>ID</th><th>Name</th><th>Devices</th><th>Scenes</th><th>Actions</th></tr></thead><tbody></tbody></table></div>"));
		$("#altui-controller-select").closest(".form-group").append(formHtml);
		
		var roomListTemplate = "<tr data-altuiid='{0}'><td>{0}</td><td><span class='altui-room-name' id='{0}'>{1}</span></td><td>{2}</td><td>{3}</td><td>{4}</td></tr>";	
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
					buttonClass: 'btn btn-default btn-sm',
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
					buttonClass: 'btn btn-default btn-sm',
					onChange: function(element, checked) {
						 // $("#altui-save-rooms").addClass("btn-danger");

						 // if this is a new selection, we need to remove it from other places
						 var device = MultiBox.getDeviceByAltuiID($(element).val());
						 if (checked==false) {
							 // put the device in NO room
							 MultiBox.renameDevice(device, device.name, 0);
						 } else {
							 // put the device in that room
							 var room_altuiid = $(element).closest(".altui-devices-room").prop("id")
							 var roominfo = MultiBox.controllerOf(room_altuiid);
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
						 }
					},
				});
				// install click handler for buttons
				$(".altui-mainpanel")
					.off("click","span.altui-room-name")
					.on("click","span.altui-room-name",function(event) {
						var id = $(this).prop('id');
						var room = MultiBox.getRoomByAltuiID(id);
						$(this).replaceWith("<input class='altui-room-name form-control' id='{0}' value='{1}'></input>".format(room.altuiid, room.name.escapeXml()));
					})
					.off("focusout","input.altui-room-name")
					.on("focusout","input.altui-room-name",function(event) {
						var id = $(this).prop('id');
						var room = MultiBox.getRoomByAltuiID(id);
						var value = $(this).val();
						room.name = value;
						MultiBox.renameRoom(room, room.name );
						$(this).replaceWith("<span class='altui-room-name' id='{0}'>{1}</span>".format(room.altuiid,room.name));
					});
				$("button.altui-viewroom").click( function(event) {
					var id = $(this).prop('id');
					var room = MultiBox.getRoomByAltuiID(id);
					UIManager.pageDevices({ room:[room.name] });
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
		
		// $(".altui-mainpanel").off("click","button#altui-create-room");
		$(".altui-mainpanel").off('click')
		.on("click","button#altui-create-room",function() 
		{
			MultiBox.createRoom(parseInt($("#altui-controller-select").val()),$("#altui-create-room-name").val() );
		})
		// .on("click","button#altui-save-rooms",function() 
		// {
			// $("#altui-save-rooms").removeClass("btn-danger");
		// });
	},

	pageControlPanel: function( altuiid ) 
	{
		// var rooms = MultiBox.getRoomsSync();
		var device = MultiBox.getDeviceByAltuiID( altuiid );
		// var controllerid = MultiBox.controllerOf(altuiid).controller;
		var category = MultiBox.getCategoryTitle( device.category_num );

		UIManager.clearPage(_T('Control Panel'),"{0} {1} <small>#{2}</small>".format( device.name , category ,altuiid),UIManager.oneColumnLayout);
		
		var html = "<div class='form-inline col-xs-12'>";
		html += "<button type='button' class='btn btn-default' id='altui-toggle-attributes' >"+_T("Attributes")+"<span class='caret'></span></button>";
		html += "<button type='button' class='btn btn-default altui-device-variables' id='"+altuiid+"'>"+_T("Variables")+"</button>";
		html += "<button type='button' class='btn btn-default altui-device-actions' id='"+altuiid+"' >"+_T("Actions")+"</button>";
		html += "<button type='button' class='btn btn-default' id='altui-device-config' >"+_T("Configuration")+"<span class='caret'></span></button>";
		html += "<button type='button' class='btn btn-default' id='altui-device-usedin' >"+_T("Used in")+"<span class='caret'></span></button>";
		html += "<button type='button' class='btn btn-default' id='altui-device-triggers' >"+_T("Notification")+"<span class='caret'></span></button>";
		if (AltuiDebug.IsDebug())
			html +=  buttonDebugHtml;
		html += "</div>";
		$(".altui-mainpanel").append( html );

		//
		// Draw device control panel (attributes+panel+debug)
		//
		$(".altui-mainpanel").append( "<div id='altui-device-controlpanel-container-"+altuiid+"' class='col-xs-12 altui-device-controlpanel-container'></div>" );
		var container = $("#altui-device-controlpanel-container-"+altuiid);
		UIManager.deviceDrawControlPanel( device, container ); 	//altuiid, device, domparent
		
		//
		// Manage interactions
		//
		$("#altui-device-attributes-"+altuiid).toggle(false);		// hide them by default;
		$("#altui-device-config-"+altuiid).toggle(false);			// hide them by default;
		$(".altui-device-usedin").toggle(false);		// toggle attribute box
		$(".altui-device-triggers").toggle(false);		// toggle attribute box
		// $("#altui-device-usedin-"+altuiid).toggle(false);			// hide them by default;
		// $("#altui-device-triggers-"+altuiid).toggle(false);			// hide them by default;
		$(".altui-debug-div").toggle(false);						// hide
		$(container).off('click','.altui-deldevice')
					.on('click','.altui-deldevice',  function(e) {
						var id = $(this).prop('id');
						DialogManager.confirmDialog(_T("Are you sure you want to delete device ({0})").format(id),function(result) {
							if (result==true) {
								MultiBox.deleteDevice(device);
							}
						});
					});
					
		$("#altui-toggle-attributes").click( function() {
			$("#altui-device-attributes-"+altuiid).toggle();		// toggle attribute box
			$("#altui-toggle-attributes span.caret").toggleClass( "caret-reversed" );
		});
		
		$("#altui-device-usedin").click( function() {
			// $("#altui-device-usedin-"+altuiid).toggle();		// toggle attribute box
			$(".altui-device-usedin").toggle();		// toggle attribute box
			$("#altui-device-usedin span.caret").toggleClass( "caret-reversed" );
		});
		$("#altui-device-triggers").click( function() {
			// $("#altui-device-triggers-"+altuiid).toggle();		// toggle attribute box
			$(".altui-device-triggers").toggle();		// toggle attribute box
			$("#altui-device-triggers span.caret").toggleClass( "caret-reversed" );
		});
		$("#altui-device-config").click( function() {
			$("#altui-device-config-"+altuiid).toggle();		// toggle attribute box
			$("#altui-device-config span.caret").toggleClass( "caret-reversed" );
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
		$(container).off('shown.bs.tab', 'a[data-toggle="tab"]');
		$(container).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
			var controlpanel = $(e.target).closest(".altui-device-controlpanel");
			var altuiid = $(controlpanel).data("altuiid")
			var device = MultiBox.getDeviceByAltuiID( altuiid );
			var activeTabIdx = _getActiveDeviceTabIdx();
			var domparent  =  $('div#altui-devtab-content-'+activeTabIdx);
			_displayActiveDeviceTab(activeTabIdx, device, domparent);
		});
	},
	
	onDeviceIconError : function( altuiid ) {
		// this.src = defaultIconSrc
		// $(this).attr('src',defaultIconSrc);
		$("div.altui-device[data-altuiid="+altuiid+"] img").attr('src',defaultIconSrc);
	},
	
	pageDevices : function ( filter )
	{
		var _domMainPanel = null;
		var _roomID2Name = {};
		var _deviceID2RoomName = {};
		var _deviceDisplayFilter = $.extend( {
			filterformvisible 	: false,
			room			: MyLocalStorage.getSettings("DeviceRoomFilter") || -1,
			favorites		: (MyLocalStorage.getSettings("ShowFavoriteDevice")==true),
			invisible 		: (MyLocalStorage.getSettings("ShowInvisibleDevice")==true),
			batterydevice	: (MyLocalStorage.getSettings("ShowBatteryDevice")==true),
			zwavedevice		: (MyLocalStorage.getSettings("ShowZWaveDevice")==true),
			zigbee_device	: (MyLocalStorage.getSettings("ShowZigbeeDevice")==true),
			bt_device		: (MyLocalStorage.getSettings("ShowBTDevice")==true),
			category		: MyLocalStorage.getSettings("CategoryFilter") || 0,
			filtername		: MyLocalStorage.getSettings("DeviceFilterName") || "",
			isRoomFilterValid 		: function() {
				return ($.isArray(this.room)) ? (this.room.length>0) : (this.room!=-1);
			},
			isCategoryFilterValid 	: function() {return this.category!=0},
		}, filter );
		
		// filter function
		function deviceFilter(device) {
			var batteryLevel = MultiBox.getDeviceBatteryLevel(device);
			var regexp = new RegExp(RegExp.escape(_deviceDisplayFilter.filtername),"i")

			if ((device.invisible == "1") && (_deviceDisplayFilter.invisible != true))
				return false;

			if ( (_deviceDisplayFilter.category!= 0) && ( device.category_num==undefined || _deviceDisplayFilter.category.in_array(device.category_num)==false) )
				return false;
			
			if ( (_deviceDisplayFilter.favorites != false) && (device.favorite != true) )
				return false;
			
			if ((_deviceDisplayFilter.filtername.length != 0) && (device.name.search( regexp )==-1)  )
				return false;
			
			if ( (_deviceDisplayFilter.batterydevice==true) && (batteryLevel == null) )
				return false;
			
			if (_deviceDisplayFilter.zwavedevice||_deviceDisplayFilter.zigbee_device||_deviceDisplayFilter.bt_device)
				if ( ( _deviceDisplayFilter.zwavedevice && MultiBox.isDeviceZwave(device) == false) ||
					 (_deviceDisplayFilter.zigbee_device && MultiBox.isDeviceZigbee(device) == false) ||
					 (_deviceDisplayFilter.bt_device && MultiBox.isDeviceBT(device) == false) )
					 return false;

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
			deviceCreateModalTemplate += "  <div class='modal-dialog modal-lg'>";
			deviceCreateModalTemplate += "    <div class='modal-content'>";
			deviceCreateModalTemplate += "      <div class='modal-header'>";
			deviceCreateModalTemplate += "        <button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>";
			deviceCreateModalTemplate += "        <h4 class='modal-title'>Create Device</h4>";
			deviceCreateModalTemplate += "      </div>";
			deviceCreateModalTemplate += "      <div class='modal-body'>";
				deviceCreateModalTemplate += "      <div class='row-fluid'>";
						deviceCreateModalTemplate += "<form>";
							deviceCreateModalTemplate += "<div class='form-group'>";
								deviceCreateModalTemplate += "<label for='altui-input-dtitle'>Device Name</label>";
								deviceCreateModalTemplate += "<input type='text' class='form-control' id='altui-input-dtitle' placeholder='Enter the name'>";
							deviceCreateModalTemplate += "</div>";
							deviceCreateModalTemplate += "<div class='form-group'>";
								deviceCreateModalTemplate += "<label for='altui-input-dfile'>D_xxx.xml filename</label>";
								deviceCreateModalTemplate += "<input type='text' class='form-control' id='altui-input-dfile' placeholder='Enter the filename'>";
							deviceCreateModalTemplate += "</div>";
							deviceCreateModalTemplate += "<div class='form-group'>";
								deviceCreateModalTemplate += "<label for='altui-input-ifile'>I_xxx.xml filename</label>";
								deviceCreateModalTemplate += "<input type='text' class='form-control' id='altui-input-ifile' placeholder='Enter the filename'>";
							deviceCreateModalTemplate += "</div>";
							deviceCreateModalTemplate += "<p class='help-block'>Enter the device D_xx and I_xx file name</p>";
						deviceCreateModalTemplate += "</form>";
				deviceCreateModalTemplate += "      </div>";
			deviceCreateModalTemplate += "      </div>";
			deviceCreateModalTemplate += "      <div class='modal-footer'>";
			deviceCreateModalTemplate += "        <button type='button' class='btn btn-default' data-dismiss='modal'>"+_T("Close")+"</button>";
			deviceCreateModalTemplate += "        <button type='button' class='btn btn-primary'>"+_T("Save Changes")+"</button>";
			deviceCreateModalTemplate += "      </div>";
			deviceCreateModalTemplate += "    </div><!-- /.modal-content -->";
			deviceCreateModalTemplate += "  </div><!-- /.modal-dialog -->";
			deviceCreateModalTemplate += "</div><!-- /.modal -->";
			return deviceCreateModalTemplate;
		}
		
		function endDrawDevice(devices) {
			UIManager.refreshUI(true,false);
		};
		
		function drawDeviceEmptyContainer(idx, device) {
			_domMainPanel.append(ALTUI_Templates.deviceEmptyContainerTemplate.format(device.id,device.altuiid,'col-sm-6 col-md-4 col-lg-3'));	
		};

		function _drawDeviceToolbar() {
			var _checks = [	
				{ id:'altui-show-favorites' , filterprop:'favorites', Save:'ShowFavoriteDevice', label:'Favorites' },
				{ id:'altui-show-invisible' , filterprop:'invisible', Save:'ShowInvisibleDevice', label:'Invisible' },
				{ id:'altui-show-battery' 	, filterprop:'batterydevice', Save:'ShowBatteryDevice', label:'Battery' },
				{ id:'altui-show-zwave' 	, filterprop:'zwavedevice', Save:'ShowZWaveDevice', label:'ZWave' },
				{ id:'altui-show-zigbee' 	, filterprop:'zigbee_device', Save:'ShowZigbeeDevice', label:'Zigbee' },
				{ id:'altui-show-bt' 		, filterprop:'bt_device', Save:'ShowBTDevice', label:'Bluetooth' },
			];
			var filterHtml="";
			// filterHtml+="<div class='btn-group'>";
			filterHtml+="<div class='altui-pagefilter'>";
			filterHtml+="<div class='panel panel-default' id='altui-device-filter-form'>";
			filterHtml+="  <div class='panel-body'>";
				filterHtml+="<form class='form-inline'>";
					$.each(_checks, function(idx,check) {
						filterHtml+="<div class='form-group'><div class='checkbox'>";
							filterHtml+="<label><input type='checkbox' value='' id='{0}'>{1}</label>".format(check.id,_T(check.label));
						filterHtml+="</div></div>";
					});
				filterHtml+="</form>";

				filterHtml+="<div id='altui-device-name-filter' class='input-group'>";
				filterHtml+="<span class='input-group-addon' id='altui-device-search-btn'>"+searchGlyph+"</span>";
				filterHtml+="<span class='input-group-addon' id='altui-device-remove-btn'>"+removeGlyph+"</span>";
				filterHtml+="<input type='text' class='form-control' placeholder='Device Name' aria-describedby='sizing-addon2'>";
				filterHtml+="</div>";

			filterHtml+="  </div>";
			filterHtml+="</div>";
			filterHtml+="</div>";
			
			var toolbarHtml="";
			var roomfilterHtml="";    
			var categoryfilterHtml="";
			var dfd = $.Deferred();		
			$.when( _drawRoomFilterButtonAsync(_deviceDisplayFilter.room) )
			.then( function(html) { 
				roomfilterHtml = html; 
				categoryfilterHtml+='<select id="altui-device-category-filter" multiple="multiple">';
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
						categoryfilterHtml+="  <button type='button' class='btn btn-default' id='altui-device-filter' >";
						categoryfilterHtml+=  (searchGlyph + '&nbsp;' +_T('Filter') + "<span class='caret'></span>");
						categoryfilterHtml+="  </button>";			
						categoryfilterHtml+="  <button type='button' class='btn btn-default' id='altui-device-create' >";
						categoryfilterHtml+= (plusGlyph + "&nbsp;" + _T("Create"));
						categoryfilterHtml+="  </button>";	
					}
				))
				.then ( function(categories) {
					function _onChangeRoomFilter() {
						//_roomID2Name[_deviceDisplayFilter.room]
						_deviceDisplayFilter.room =  $.map($('#altui-device-room-filter :selected'),function(e)  { return (e.value); }) 	// array of room names
						UIManager.setLeftnavRoomsActive( _deviceDisplayFilter.room );
						MyLocalStorage.setSettings("DeviceRoomFilter",_deviceDisplayFilter.room);
						if ( MyLocalStorage.getSettings('SyncLastRoom')==1 )
							MyLocalStorage.setSettings("SceneRoomFilter",_deviceDisplayFilter.room);
						$("#altui-device-room-filter").next(".btn-group").children("button").toggleClass("btn-info",_deviceDisplayFilter.isRoomFilterValid());
						_drawDevices(deviceFilter,false);	// do not redraw toolbar
					};
					function _onChangeCategoryFilter() {
						// Get selected options.
						_deviceDisplayFilter.category = $.map($('#altui-device-category-filter :selected'),function(e)  { return parseInt(e.value); }) 	// array of ints
						if (_deviceDisplayFilter.category.length==0)
							_deviceDisplayFilter.category=0;
						MyLocalStorage.setSettings("CategoryFilter",_deviceDisplayFilter.category);
						$("#altui-device-category-filter").next(".btn-group").children("button").toggleClass("btn-info",_deviceDisplayFilter.isCategoryFilterValid());
						_drawDevices(deviceFilter,false);	// do not redraw toolbar
					};
					// Display
					$(".altui-device-toolbar").replaceWith( "<div class='altui-device-toolbar'>"+roomfilterHtml+categoryfilterHtml+filterHtml+"</div>" );
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
					if (categories.length+1>=parseInt(MyLocalStorage.getSettings('Menu2ColumnLimit')))
						$('#altui-device-category-filter').next(".btn-group").children("ul").attr('style','columns: 2; -webkit-columns: 2; -moz-columns: 2;');

					$(".altui-pagefilter").css("display","inline");
					
					// interactivity					
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
								$("#altui-device-name-filter").removeClass("has-error");
								return;
							}
							$("#altui-device-name-filter").addClass("has-error");
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
						$("#altui-device-filter span.caret").toggleClass( "caret-reversed" );
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

					$("#altui-device-room-filter").next(".btn-group").children("button").toggleClass("btn-info",_deviceDisplayFilter.isRoomFilterValid());
					$("#altui-device-category-filter").next(".btn-group").children("button").toggleClass("btn-info",_deviceDisplayFilter.isCategoryFilterValid());
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
			MultiBox.getDevices( drawDeviceEmptyContainer , filterfunc, endDrawDevice);
		};
		
		function _onClickRoomButton(htmlid,altuiid)
		{
			// var roomid = $(this).prop('id');
			_deviceDisplayFilter.room = (altuiid !="") ? [ _roomID2Name[ altuiid ]  ] : htmlid;	
			if (_deviceDisplayFilter.room == "0" )
				_deviceDisplayFilter.room = ["0"]
			UIManager.setLeftnavRoomsActive(_deviceDisplayFilter.room);
			MyLocalStorage.setSettings("DeviceRoomFilter",_deviceDisplayFilter.room);
			if ( MyLocalStorage.getSettings('SyncLastRoom')==1 )
				MyLocalStorage.setSettings("SceneRoomFilter",_deviceDisplayFilter.room);
			_drawDevices(deviceFilter);
		};
		
		// Page Preparation
		UIManager.clearPage(_T('Devices'),_T("Devices"));
		$("#altui-pagetitle").css("display","inline").after("<div class='altui-device-toolbar'></div>");
		
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

		// deletegated event for title click / rename for device
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
				UIManager.pageControlPanel(altuiid);
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
				UIManager.pageControlPanel(altuiid);
			});
	},

	pageScenes: function ()
	{
		var _roomID2Name={};
		var _sceneID2RoomName={};
		var _sceneFilter={
			room: MyLocalStorage.getSettings("SceneRoomFilter") || -1,
			isValid: function() { return ($.isArray(this.room)) ? (this.room.length>0) : (this.room!=-1); }
		};
		function _sceneInThisRoom(scene) {
			if ((_sceneID2RoomName[scene.altuiid]==null)&&(scene.room>0)) {
				var controller = MultiBox.controllerOf(scene.altuiid).controller;
				_sceneID2RoomName[scene.altuiid] = _roomID2Name["{0}-{1}".format(controller,scene.room)];
			}
			if (scene.notification_only && scene.notification_only!=0) 
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
			_sceneFilter.room = (altuiid !="") ? [ _roomID2Name[ altuiid ]  ] : htmlid;
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
			var scenecontainerTemplate="<div class=' col-sm-6 col-md-4'>";
			scenecontainerTemplate	+= 	html;
			scenecontainerTemplate	+= 	"</div>";		
			var domPanel = $(".altui-mainpanel");
			domPanel.append(scenecontainerTemplate.format(scene.id));	
		};
		
		function _onChangeRoomFilter() {
			//_roomID2Name[_deviceDisplayFilter.room]
			_sceneFilter.room =  $.map($('#altui-device-room-filter :selected'),function(e)  { return (e.value); }) 	// array of room names
			UIManager.setLeftnavRoomsActive( _sceneFilter.room );
			MyLocalStorage.setSettings("SceneRoomFilter",_sceneFilter.room);
			if ( MyLocalStorage.getSettings('SyncLastRoom')==1 )
				MyLocalStorage.setSettings("DeviceRoomFilter",_sceneFilter.room);
			$("#altui-device-room-filter").next(".btn-group").children("button").toggleClass("btn-info",_sceneFilter.isValid());
			_drawScenes(_sceneInThisRoom,false);	// do not redraw toolbar
		};
		function _drawSceneToolbar() {
			var toolbarHtml="";
			$.when( _drawRoomFilterButtonAsync( _sceneFilter.room ) )
			.then(function( html) {
				toolbarHtml+= html;	// room filter
				toolbarHtml+="  <button type='button' class='btn btn-default' id='altui-scene-create' >";
				toolbarHtml+=(plusGlyph + "&nbsp;" + _T("Create"));
				toolbarHtml+="  </button>";			
				$(".altui-scene-toolbar").replaceWith( "<div class='altui-scene-toolbar'>"+toolbarHtml+"</div>" );
						
				$("#altui-scene-create").click( function() {
					UIManager.pageSceneEdit(NULL_SCENE);
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
					UIManager.pageSceneEdit( altuiid );
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
												// clone watches
												UIManager.pageScenes();
												
												// try to find the new scene by its name
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
						_T("Scene History"), 			// title
						"",				// body
						"modal-lg"		// size
						));
					MultiBox.getSceneHistory( scene, function(history) {
						var html="";
						html += "<div class='panel panel-default'> <div class='panel-body'>";
						html +="<table id='{0}' class='table table-condensed altui-variable-value-history'>".format(altuiid);
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
						$(dialog).find(".row-fluid").append(html);
						$('div#dialogModal').modal();
					});
				})
				.on("click",".altui-favorite",function(event) { 
					var altuiid = $(this).closest(".altui-scene").data('altuiid');
					var scene = MultiBox.getSceneByAltuiID(altuiid);
					scene.favorite = !scene.favorite;
					Favorites.set('scene', altuiid, scene.favorite );
					$(this).replaceWith( (scene.favorite==true) ? starGlyph : staremtpyGlyph );
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
		};
		
		function _drawScenes( filterfunc,bToolbar )
		{
			$(".altui-mainpanel").empty();
			if (bToolbar != false ) {
				_drawSceneToolbar();  /*.done( function() {}); */
			}
			MultiBox.getScenes( sceneDraw , filterfunc, afterSceneListDraw )
		}
		
		UIManager.clearPage(_T('Scenes'),_T("Scenes"));
		$("#altui-pagetitle").css("display","inline").after("<div class='altui-scene-toolbar'></div>");
		
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
		var orgscene = (altuiid!=NULL_SCENE) ? MultiBox.getSceneByAltuiID( altuiid ) : { 
				name:"New Scene",
				id: newid.id,
				altuiid: newid.altuiid,
				triggers: [],
				groups: [{"delay":0,"actions":[]}],
				timers: [],
				lua:"",
				room:0
		};
		var scene = jQuery.extend(true, {timers:[], triggers:[], groups:[] }, orgscene, newscene_template );

		// clear page
		UIManager.clearPage(_T('Scene Edit'),altuiid!=NULL_SCENE ? "Edit Scene #"+scene.altuiid : "Create Scene",UIManager.oneColumnLayout);

		var editor = SceneEditor( scene );
		var html = "<div class='col-xs-12'>" ;
			html += UIManager.sceneDraw( scene, true);	// draw scene
			html += editor.sceneEditDraw();					// draw editor
		html += "</div>";
		
		$(".altui-mainpanel").append(  html );
		editor.runActions(  );	
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
				html += "{5} device:'<strong>{0}</strong>' ({1}) when {2}-{3} <span class='text-muted'>({4})</span>".format( 
					device.name, 
					cond.device, cond.service, cond.variable, cond.luaexpr,
					cond.triggeronly ? "<mark><span class='glyphicon glyphicon-flash' aria-hidden='true'></span></mark> <span class='text-danger'>Trigger</span>, " : ''
					);
				html += "</li>";					
			});
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
									html += "<blockquote class='altui-workflow-transitiondetails'>";
										html += "<li class='altui-transition-subtitle'>When</li>";
										html += "<ul>";
											if (link.schedule && (link.schedule.length>0) )
												html += "<li>Schedule: {0}</li>".format(UIManager.displayTimers( [ link.schedule ] , { only_text:true, add_button:false, add_json:false }));
											if (link.timer)
												html += "<li>Timer: '{0}' expiration {1}s</li>".format(link.timer.name,link.timer.duration);
											html += _displayConditions(link.conditions)
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
		var workflow = WorkflowManager.getWorkflow(altuiid);
		if (workflow==null)
			return;

		UIManager.clearPage(_T('Workflow Report'),_T("Workflow Report"),UIManager.oneColumnLayout);
		var html = "";
		html += "<div class='col-xs-12'><div id='altui-workflow-report'>";
		html += _displayWorkflowHeader(workflow)
		html += _displayWorkflowStats(WorkflowManager.getWorkflowStats(altuiid))
		html += _displayWorkflowDetails(workflow)
		html += "</div></div>";
		$(".altui-mainpanel").append(html);
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
			{id:"altui-workflow-save", glyph:"glyphicon-save", label:_T("Save")},
			{id:"altui-workflow-reset", glyph:"glyphicon-off", label:_T("Reset")},
			{id:"altui-workflow-newstate", glyph:"glyphicon-unchecked", label:_T("State")},
			{id:"altui-workflow-edit", glyph:"glyphicon-pencil", label:_T("Edit")},
			{id:"altui-workflow-delete", glyph:"glyphicon-remove", label:_T("Delete")},
			{id:"altui-workflow-report", glyph:"glyphicon-list", label:_T("Report")},
			{id:"altui-workflow-history", collapsetarget:"#altui-workflow-history-text", glyph:"glyphicon-calendar", label:_T("History")},
			{id:"altui-workflow-bag", collapsetarget:"#altui-workflow-bag-text", glyph:"glyphicon-compressed", label:_T("Bag")},
			{id:"altui-workflow-export", glyph:"glyphicon-floppy-save", label:_T("Import/Export")},
			{id:"altui-workflow-zoomin", glyph:"glyphicon-plus" },
			{id:"altui-workflow-zoomout", glyph:"glyphicon-minus" },
			{id:"altui-workflow-rotate", glyph:"glyphicon-repeat" },
		];
		var selected = [];
		var graph = new joint.dia.Graph();
		
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
						.on( 'click','.modal-footer .btn-default', function(e) {
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
								.on( 'click','.modal-footer .btn-default', function(e) {
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
				html +="<h4>Lua</h4>"
				html +="<div class='altui-ace-editor' id='{0}'>{1}</div>".format(htmlid,lua)
				return html;
			}
			_clearPage();
			var html = "<div class='col-xs-12'>";
			html += HTMLUtils.drawForm( 'altui-state-form', _T("State Properties"),
				[
					{ id:"altui-form-StateName", label:_T("State Name"), type:"input", value: Model.name, opt:{required:''} },
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
						{ id:"altui-btn-submit", label:_T("Submit"), type:"submit",  },
					]}
				]
			);
			html += "</div>"
			$(".altui-mainpanel").html ( html );

			// ACE editors
			var init =  MyLocalStorage.getSettings("EditorTheme") || "monokai";
			$(".altui-ace-editor").each( function(idx,elem) {
				var editor = ace.edit( $(elem).prop('id') );
				editor.getSession().setMode( "ace/mode/lua" );
				editor.setTheme( "ace/theme/"+init );
				editor.setFontSize( MyLocalStorage.getSettings("EditorFontSize") );
				// resize
				$(elem).resizable({
					// containment: "parent",
					maxWidth:$(elem).closest(".panel").innerWidth()-30, // ugly but easier, padding 15 on 
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
				e.preventDefault();
				var name = $("#altui-form-StateName").val();
				Model.prop.onEnterLua = ace.edit( "altui-onEnterLua" ).getValue();
				Model.prop.onExitLua = ace.edit( "altui-onExitLua" ).getValue();
				if ($.isFunction(callback))
					(callback)({
						name:name,
						prop:Model.prop
					});
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
								// Format needs to be: { "altuiid": "0-57"  }
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
								deviceid: 	NULL_DEVICE,
								service:	"",
								variable:	"",
							}
						} else {
							widget.properties ={
								deviceid: 	condition.device,
								service:	condition.service,
								variable:	condition.variable,
							}
						}
						DialogManager.dlgAddVariables(dialog, null, widget, function() {
							DialogManager.dlgAddLine(dialog, "LuaExpression", _T("Lua Expression with new=newvalue and old=oldvalue"), 
								condition ? condition.luaexpr : "",
								_T("Expression with old new as variables and lua operators like <  >  <= >= == ~="), {required:''})
							DialogManager.dlgAddCheck(dialog,'Trigger', condition ? condition.triggeronly : false, _T("Only when triggered"));
							$('div#dialogModal').modal();
							$('div#dialogs')
								.off('click')
								.on( 'click','.modal-footer .btn-default', function(e) {
									e.stopPropagation();
									$('div#dialogModal').modal('hide');
									(callback)(null);
									return false;
								})
								.on( 'click','#altui-edit-LuaExpression',function(e) {
								})
								.off('submit',"div#dialogModal")
								.on( 'submit',"div#dialogModal", function() {
									var altuiid = $("#altui-select-device").val();
									var state = MultiBox.getStateByID( altuiid,$("#altui-select-variable").val() );
									var condition={
										device:altuiid,
										service:state.service,
										variable:state.variable,
										luaexpr:$("#altui-widget-LuaExpression").val(),
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
					ui.triggeronly = (cond.triggeronly ? "<mark><span class='glyphicon glyphicon-flash' aria-hidden='true'></span></mark>" : '' )
					arr.push($.extend({},ui,{ "-":editButton.format(idx,htmlid)+blocklyButton.format(idx,htmlid)+delButton.format(idx,htmlid) }));
				});
				arr.push({
					device:plusButton.format(htmlid+"-add"),
				});
				return HTMLUtils.array2Table(arr,null,['device','service','triggeronly','variable','luaexpr','-'],_T("All conditions must match ( logical AND ) for the transition to happen"),null,htmlid);
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
			_clearPage();
			var html = "<div class='col-xs-12'>";
			
			html += HTMLUtils.drawForm( 'altui-link-form', _T("Link Properties"),
				[
					{ id:"altui-form-LinkName", label:_T("Link Name"), type:"input", value: Model.name, opt:{required:''} },
					{ id:"altui-form-Conditions", label:_T("Link Conditions"), type:"accordeon", value: [
						{id:'Conditions', title:_T("Conditions"), html:_displayConditions( 'altui-conditions',Model.prop.conditions )+BlocklyArea.createBlocklyArea() },
						{id:'Schedules', title:_T("Schedules"), html: _displaySchedule( 'altui-schedule', Model.prop.schedule ) },
						{id:'Timers', title:_T("Timers"), html:HTMLUtils.drawFormFields( [
							{ id:"altui-timername", label:_T("Timer Name"), type:"input", value: Model.prop.timer, opt:null },
							{ id:"altui-duration", label:_T("Duration (sec or min-max)"), type:"input",  pattern:"(\\d+(\\-\\d+)?)$", value: Model.prop.duration, opt:null },
						])},
					]},
					{ id:"altui-btn-bar", type:"buttonbar", value:[
						{ id:"altui-btn-close", label:_T("Close"), type:"button",  },
						{ id:"altui-btn-submit", label:_T("Submit"), type:"submit",  },
					]}
				]
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
				e.preventDefault();
				Model.prop.timer = $("#altui-timername").val();
				Model.prop.duration = $("#altui-duration").val();
				// Model.prop.schedule already set
				
				if ( isNullOrEmpty(Model.prop.duration) != isNullOrEmpty(Model.prop.timer)) {
					DialogManager.warningDialog(_T("Invalid Timer"),_T("Timer name and duration must not be empty"));
					return false;
				}
				if ((Model.prop.conditions.length==0) && (isNullOrEmpty(Model.prop.duration)) && (isNullOrEmpty(Model.prop.schedule))) {
					DialogManager.warningDialog(_T("Invalid Transition"),_T("Transition appears to be empty, you need at least a condition , a schedule or a timer"));
					return false;
				}
				if ($.isFunction(callback))
					(callback)({
						name:$("#altui-form-LinkName").val(),
						prop: Model.prop,
					});
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
				// show blockly editor
				$(".altui-blockly-editor").toggle(true);

				// inject Blockly if needed
				var that = $(this);
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
			;
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
		function Start() {
			var m1 = new joint.shapes.devs.Model({
				position: { x: 30, y: 30 },
				size: { width: 90, height: 90 },
				outPorts: ['out'],
				attrs: {
					'.label': { text: 'Start', 'ref-x': .4, 'ref-y': .2 },
					rect: { fill: '#2ECC71' },
					'.inPorts circle': { fill: '#16A085', magnet: 'passive', type: 'input' },
					'.outPorts circle': { fill: '#E74C3C', type: 'output' }
				},
				// custom attributes
				prop: WorkflowManager.getNodeProperties( {
					stateinfo : {bStart:true},
				}),
			}).addTo(graph);
			return m1;
		}
		function Node(label,x,y) {
			var m1 = new joint.shapes.devs.Model({
				position: { x: x, y: y },
				size: { width: 90, height: 90 },
				inPorts: ['in1','in2','in3'],
				outPorts: ['out1','out2','out3'],
				attrs: {
					'.port-body': { r: 7 },
					'.label': { text: label, 'ref-x': .5, 'ref-y': .2 },
					rect: { fill: 'lightblue' },
					'.inPorts circle': { fill: '#16A085', magnet: 'passive', type: 'input' },
					'.outPorts circle': { fill: '#E74C3C', type: 'output' }
				},
				// custom attributes
				prop:WorkflowManager.getNodeProperties( {} ),
			}).addTo(graph);					
			return m1;
		}
		function isStartNode(node) {
			var model = node.attributes;
			return model.prop && model.prop.stateinfo && model.prop.stateinfo.bStart && (model.prop.stateinfo.bStart==true)
		}
		// function onDeleteLink(cell) {
			// if the Link has a schedule, we need to kill it
			// if (cell.attributes.prop.schedule) {
					// WorkflowManager.clearLinkScheduleScene(workflow.altuiid,cell)
			// }
		// }
		// function onDeleteNode(cell){
		// }

		workflow = WorkflowManager.getWorkflow(altuiid);
		if (workflow==null) return;
		
		UIManager.clearPage(_T('Workflow'),_T("Workflow Editor")+ (": <span class='text-info'>{0}</span> <small>({1})</small>").format(workflow.name,workflow.altuiid),UIManager.oneColumnLayout);
		$("#altui-pagetitle").css("display","inline").after("<div class='altui-workflow-toolbar'></div>");
		if (MultiBox.isWorkflowEnabled() == false) {
			PageMessage.message( "Workflow mode is not enabled on your ALTUI device", "warning");
		}

		$(".altui-workflow-toolbar").replaceWith( HTMLUtils.drawToolbar( 'altui-workflow-toolbar', _toolsWorkflow ) );	
		
		var bSanitized = WorkflowManager.sanitizeWorkflow(workflow.altuiid);
		if ( bSanitized == true) {
			PageMessage.message( "Workflow had to be adjusted to your vera, save is needed", "info");
		} 

		$(".altui-mainpanel").append("<div class='col-xs-12'><div id='altui-workflow-canvas'></div></div>");
		//
		// Set up Jointjs things
		//
		var paper = new joint.dia.Paper({
			el: $('#altui-workflow-canvas'),
			width: $('#altui-workflow-canvas').parent().innerWidth()-30, height: 600, gridSize: 1,
			model: graph,
			// interactive: { labelMove: true },
			defaultLink: new joint.dia.Link({
				smooth: true,
				attrs: { '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' } },
				labels: [
					{ position: 0.4, attrs: { text: { text: 'label' } } }
				],
				// custom attributes
				prop:WorkflowManager.getLinkProperties( {} ),
			}),	
			validateConnection: function(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
				// Prevent linking from input ports.
				if (magnetS && magnetS.getAttribute('type') === 'input') return false;
				// Prevent linking from output ports to input ports within one element.
				if (cellViewS === cellViewT) return false;
				// Prevent linking to input ports.
				return magnetT && magnetT.getAttribute('type') === 'input';
			},
			// Enable link snapping within 75px lookup radius
			snapLinks: { radius: 75 },
			// Enable marking available cells & magnets
			markAvailable: true,
			// prevent dropping link on the paper
			linkPinning: false,
			// Allowed number of mousemove events after which the pointerclick event will be still triggered.
			//or any number > 0 if you have more specific events there
			// cf http://stackoverflow.com/questions/35443524/jointjs-why-pointerclick-event-doesnt-work-only-pointerdown-gets-fired
			clickThreshold: 1,
		});
		function _rotateCell(cell) {
			var angle = cell.attributes.angle;
			angle = (angle + 90) % 360;
			cell.rotate(angle,true);
			var labelXform = ""
			switch (angle) {
				case 0:
					// labelXform = "translate(45,18) rotate(0,0,0)";
					labelXform = "rotate(0,0,0)";
					cell.attr({
						'.inPorts .port-label' : { transform: 'rotate(0,0,0)' } ,
						'.outPorts .port-label': { transform: 'rotate(0,0,0)' } ,
					});
					break;
				case 90:
					// labelXform = "translate(18,45) rotate(-90,0,0)";
					labelXform = "rotate(-90,0,0)";
					break;
				case 180:
					cell.attr({
						'.inPorts .port-label' : { transform: 'rotate(180,-22,4)' } ,
						'.outPorts .port-label': { transform: 'rotate(180, 27,4)' } ,
					});
					// labelXform = "translate(45,72) rotate(-180,0,0)";
					labelXform = "rotate(-180,0,0)";
					break;
				case 270:
					// labelXform = "translate(72,45) rotate(-270,0,0)";
					labelXform = "rotate(-270,0,0)";
					break;
			}
			cell.attr({
				'.label' : { transform:labelXform }
			})
		};
		//
		// Callbacks / Interactivity
		//

		function handleDblClick(cellView, evt, x, y) {
			var id = cellView.model.id;
			var cell = graph.getCell(id);
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
						// update the graph
						_saveGraph();
					}
					UIManager.pageWorkflow(workflow.altuiid);
					_showSaveNeeded( (Model) ? true : bSave );
				});
			} else {
				//
				// start node is like a global transition
				// any matched transition will reset the workflow to the start state
				//
				if (isStartNode(cell)) {
					var Model = {
						name: cellView.model.attr(".label/text"),
						prop: WorkflowManager.getLinkProperties( cellView.model.attributes.prop ),
					}
					onPropertyLink(workflow,Model,function(Model){
						if (Model) {
							// cannot change name of start state
							// cellView.model.label(0,{ position: 0.5, attrs: { text: { text: Model.name } }});
							cellView.model.attributes.prop = Model.prop;
							_saveGraph();
						}
						UIManager.pageWorkflow(workflow.altuiid);
						_showSaveNeeded( (Model) ? true : bSave );
					});
				} else {
					var Model = {
						name: cellView.model.attr(".label/text"),
						prop: WorkflowManager.getNodeProperties( cellView.model.attributes.prop ),
					}
					onPropertyState(workflow,Model,function(Model){
						if (Model) {
							cellView.model.attr(".label/text",Model.name);
							cellView.model.attributes.prop = Model.prop;
							_saveGraph();
						}
						UIManager.pageWorkflow(workflow.altuiid);
						_showSaveNeeded( (Model) ? true : bSave );
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
				var clickPoint  = { x: event._dx, y: event._dy },
					length1     = event.sourcePoint.distance(clickPoint),
					length2     = event.targetPoint.distance(clickPoint),
					lengthTotal = length1 + length2, //event.sourcePoint.manhattanDistance(event.targetPoint),
					position    = _.round( length1 / lengthTotal, 2);

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
			_.defer(_saveGraph);
			_showSaveNeeded();
		});
		graph.on('remove',function(cell)	{
			// return cell.isLink() ? onDeleteLink(cell) : onDeleteNode(cell) ;
			_showSaveNeeded();
		})
		$("#altui-workflow-zoomin").click(function() {
			var scale = V(paper.viewport).scale(); 
			paper.scale(1.20*scale.sx, 1.20*scale.sy);
			paper.fitToContent({ padding:2 })
		});
		$("#altui-workflow-zoomout").click(function() {
			var scale = V(paper.viewport).scale(); 
			paper.scale(0.80*scale.sx, 0.80*scale.sy)
			paper.fitToContent({ padding:2 })
		});
		$('#altui-workflow-rotate').click(function() {
			if (selected.length>0) {
				$.each(selected, function(k,s) {
					var cell = graph.getCell( s );
					_rotateCell(cell);
				});
				_showSaveNeeded();
				_saveGraph();
			}
		});
		$("#altui-workflow-newstate").click(function() {
			//var elements = workflow.graph.getElements();
			Node("New",0,0);
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
					rect: { fill: isStartNode(cell) ? '#2ECC71' : 'lightblue' },
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
			UIManager.pageWorkflowReport(workflow.altuiid);
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
						rect: { fill: isStartNode(cell) ? '#2ECC71' : 'lightblue'},
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
		
		//
		// draw the graph
		//
		if (workflow.graph_json) {
			graph.fromJSON( JSON.parse(workflow.graph_json) )
			$.each( graph.getElements() , function(idx,cell) {
				cell.attr({
					rect: { fill: isStartNode(cell) ? '#2ECC71' : 'lightblue'},
				});
			})
			_showSaveNeeded(bSanitized);
		}
		else {
			Start();
			var m2 = Node("S1",50,50);
			var m3 = m2.clone().translate(300, 0).attr('.label/text', 'S2').addTo(graph);
		}
		
		// size the paper properly and make the canvas resizable
		// paper.fitToContent({ padding:2 });
		paper.scaleContentToFit({ padding:2 });
		//
		// refresh the graph
		//
		var previous_active = null;
		function _refresh(id,data) {
			if (id!='altui-workflow-timer')	return;
			MultiBox.getWorkflowStatus( function(data) {
				if (!data) {
					HTMLUtils.startTimer('altui-workflow-timer',5000,_refresh,null);
					return;
				}  	
				if ( data.states[workflow.altuiid] && graph) {
					var cell = graph.getCell( data.states[workflow.altuiid] );
					if (previous_active !=null) {
						previous_active.attr({
							rect: { fill: isStartNode(previous_active) ? '#2ECC71' : 'lightblue'},
						});
					}
					if (cell) {
						previous_active = cell;
						cell.attr({
							rect: { fill: '#F78181' },
						});
					}
				}
				var arr=[];
				$.each(data.bags[workflow.altuiid], function(key,val) {
					arr.push({ 'variable':key, 'value':val});
				});
				$("#altui-workflow-bag-text").html( HTMLUtils.array2Table(arr,null,[],_T("Variables Bag"),"","") )
				MultiBox.getWorkflowHistory( workflow.altuiid, function(lines) {
					if ($("#altui-workflow-history-text").length>0)
						$("#altui-workflow-history-text").html( HTMLUtils.array2Table(lines.reverse().slice(0,20),null,[],_T("History")) )
					HTMLUtils.startTimer('altui-workflow-timer',3000,_refresh,null)
				});
			})
		}
		_refresh('altui-workflow-timer',null);
	},
	
	pageWorkflows: function () 
	{
		var _toolsMain = [
			{id:"altui-workflow-create", glyph:"glyphicon-plus", label:_T("Create")},
			{id:"altui-workflow-save", glyph:"glyphicon-floppy-save", label:_T("Save")}
		];

		function _drawWorkflows(workflows) {
			var html = "";
			$("#altui-workflow-save").toggleClass("btn-danger",WorkflowManager.saveNeeded());
			$.each(workflows, function(idx,workflow) {
				// 0:bootgrid classes 1:altuiid 2:htmlid 3: heading 4:panel body
				var body = buttonTemplate.format( workflow.altuiid, 'altui-editworkflow pull-left', wrenchGlyph,'default',_T("Settings"));
				var pauseButtonHtml = glyphTemplate.format( "off", _T("Pause Workflow") , 'altui-pauseworkflow ' + ((workflow.paused>0) ? 'paused':'activated'));
				html += ALTUI_Templates.workflowContainerTemplate.format(
					"col-sm-6 col-md-4 col-lg-3",
					workflow.altuiid,
					workflow.altuiid,
					workflow.name,
					buttonTemplate.format( workflow.altuiid, 'btn-xs altui-delworkflow pull-right', deleteGlyph,'default',_T("Delete")),
					body,
					pauseButtonHtml
					);
			});
			$(".altui-mainpanel").html(html);
		}
		
		UIManager.clearPage(_T('Workflow Pages'),_T("Workflow Pages"),UIManager.oneColumnLayout);
		$("#altui-pagetitle").css("display","inline").after("<div class='altui-workflow-toolbar'></div>");
		
		if (MultiBox.isWorkflowEnabled() == false) {
			PageMessage.message( "Workflow mode is not enabled on your ALTUI device", "warning");
		}
		
		$(".altui-workflow-toolbar").replaceWith( HTMLUtils.drawToolbar( 'altui-workflow-toolbar', _toolsMain ) );	
		_drawWorkflows( WorkflowManager.getWorkflows() )

		$("#altui-workflow-create")
			.on('click',function() {
				WorkflowManager.addWorkflow();
				$(".altui-mainpanel").html( _drawWorkflows( WorkflowManager.getWorkflows() ) );
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
				WorkflowManager.deleteWorkflow(altuiid);
				$(".altui-mainpanel").html( _drawWorkflows( WorkflowManager.getWorkflows() ) );
			})
			.on('click',".altui-editworkflow",function() {
				var altuiid = $(this).prop('id');
				UIManager.pageWorkflow(altuiid);
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
				$(".altui-mainpanel").html( _drawWorkflows( WorkflowManager.getWorkflows() ) );
			})				
		
		// now do the refresh loop 
		function _refresh() {
			MultiBox.getWorkflowStatus( function(data) {
				if (!data) {
					HTMLUtils.startTimer('altui-workflow-page-timer',5000,_refresh,null)
					return;
				}  	
				$(".altui-workflow").each( function(idx, obj) {
					var altuiid = $(obj).data("altuiid");
					var activestate = data.states[altuiid];
					var workflow = WorkflowManager.getWorkflow( altuiid );
					if (workflow.graph_json) {
						var arr = JSON.parse(workflow.graph_json).cells.filter( function(e) {return e.id == activestate} )
						if (arr.length>0) {
							$(obj).find(".altui-active-state-name").text( arr[0].attrs[".label"].text )
						}
					}
				});
				HTMLUtils.startTimer('altui-workflow-page-timer',3000,_refresh,null)
			});
		}
		_refresh();
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
		}
		function _getAuthToken() {
			var url = "data_request?id=lr_ALTUI_Handler&command=get_auth_token";
			return $.ajax({
				url:url,
				type: "GET",
			});
		}
		function _refreshAuthToken() {
			var url = "data_request?id=lr_ALTUI_Handler&command=refresh_auth_token";
			return $.ajax({
				url:url,
				type: "GET",
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
			var repo =  (repositories.length>0) ? repositories[0] : { }
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
			var repo =  (repositories.length>0) ? repositories[0] : {}
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
			model = $.extend( { id:0, Title:"",  Description:"", Icon:"", Instructions:"", AllowMultiple:0, AutoUpdate:0, Devices:[], Versions:{}, Repositories:[] } , model );
			var html="";
			html += "<div id='altui-plugin-div' class='col-xs-12' data-pluginid='{0}'>".format(model.id);
				html += "<div class='row'>"
					html += "<div class='col-xs-6'>"
						html += "<div class='altui-select-app'>"
						html += _drawPluginSelect( _plugins_data, model  )
						html += "</div>"
					html += "</div>"
					html += "<div class='col-xs-6'>"
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
					html += "<div class='col-xs-12'>"
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
									{id:'Vera', title:_T("Vera Store"), html: _drawVeraRepository(model , vkey)  }
								]},
								{ id:"altui-btn-bar", type:"buttonbar", value:[
									{ id:"altui-btn-close", label:_T("Close"), type:"button",  },
									{ id:"altui-btn-create", label:_T("Create"), type:"button",  },
									{ id:"altui-btn-submit", label:_T("Modify"), type:"submit",  },
								]}
							],
							"data-toggle='validator'"
						);
					html += "</div>"
				html += "</div>"
			html += "</div>"
			$(".altui-plugin-msg").html("");
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
				.on("click","#altui-btn-create", function() {
					var plugin = _getPluginFromForm();
					_updatePlugin( plugin ,"create" ) .done( function(data) {
						PageMessage.message( data, "success");
					})
				})
				.on("submit","#altui-publish-form", function(e) {
				// .on("click","#altui-btn-submit", function(e) {
					e.stopPropagation();
					var plugin = _getPluginFromForm();
					_updatePlugin( plugin ) .done( function(data) {
						PageMessage.message( data, "success");
					})
					return false;
				})
			
		}
		
		function _tryAuthToken( n , interval ) {
			$(".altui-plugin-msg2").html(_T("{0} Tentative #{1}/10").format(glyphTemplate.format( "refresh", _T("Refresh"), "text-warning glyphicon-spin" ),n))
			_getAuthToken() 
				.done( function(data, textStatus, jqXHR) {	
					data = JSON.parse(data)
					if (data.access_token != undefined ) {
						_getPluginList()
						.done( function(data) {
							_displayPublishPage();
						});
					} else  if ( n<10 ) {
						setTimeout( function() { _tryAuthToken(n+1,interval)  } , interval*1000 )
					} else {
						$(".altui-plugin-msg").html(_T("Failure after 10 tentatives, try again..."))
						$(".altui-plugin-msg2").html()
					}
				})				
				.fail( function(jqXHR, textStatus, errorThrown) {			
					alert('fail');
				})
		}
		
		function _displayPublishPage() {
			$(".altui-plugin-msg").html(_T("Contacting Server..."))
			_getPluginList().done( function(data) {
				
					if ( typeof data === "string" ) {
						try {_plugins_data= JSON.parse( data ) }
						catch(e) {_plugins_data={result:false}} 
					} else {
						_plugins_data = data;
					}

					if (_plugins_data.result==false) {
					
						// if access was not granted, try to refresh the token					
						$(".altui-plugin-msg").html(_T("Refreshing Token..."))
						_refreshAuthToken() .done( function(data) {
							
								var tokens;
								try { tokens = JSON.parse(data) } 
								catch (e) { tokens = {result:false} }
								if (tokens.result == false) {

									// if refresh failed, try the whole process from the start
									$(".altui-plugin-msg").html(_T("Authenticating client device..."))
									_getDeviceCode().done( function(data, textStatus, jqXHR) {		
											data = JSON.parse(data);
											$(".altui-plugin-msg").html(_T("Please go to this page <a href='{1}' target='_blank'>{1}</a> and enter this code : <mark>{0}</mark> <div class='altui-plugin-msg2'></div>").format(data.user_code,data.verification_url))
											setTimeout( function() { _tryAuthToken( 0 , data.interval )  } , data.interval*1000 ) 
										})
										.fail( function(jqXHR, textStatus, errorThrown) {			
											alert('fail');
										})
								} else {
									// retry from the begining
									$(".altui-plugin-msg").append("<p>{0}</p>".format(_T("Token Refreshed")))
									_displayPublishPage();
								}
							});
					} else {
						// got proper list of plugins
						_plugins_data = _plugins_data.data
						_drawPublishForm()
						_runActions()
					}
			});			
		}
		var publish_url = 'https://script.google.com/macros/s/AKfycbw7ZFJM0EWhYtc1aEm4fWxk2vC6gwO4S4ly6y3g0xCqE_5cRHkO/exec';
		UIManager.clearPage(_T('Publish App'),_T("Publish Application"),UIManager.oneColumnLayout);
		$(".altui-mainpanel").append("<div class='altui-plugin-msg col-xs-12'></div><div id='altui-plugin-div'></div>");
		_displayPublishPage();
	},
	
	pageAppStore: function(params)
	{
		var nMaxPerPage = 20;
		var nPage = 1;
		var arr = ["abc","def","ghi","jkl","mno","pqr","stu","vwx","yz "];
		var installglyph = glyphTemplate.format( "cloud-download", _T("Install"), "" );
		var pageGlyphs = {
			"forward" : glyphTemplate.format( "forward", _T("Next Page"), "" ),
			"backward" : glyphTemplate.format( "backward", _T("Prev Page"), "" ),
			"spinner" : glyphTemplate.format( "refresh", _T("Refresh"), "text-warning glyphicon-spin" )
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
		function _updatePluginReview( data  ) {
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
			html += "<div class='altui-store-categories btn-group-vertical'>"
			
			html += "<button id='*' type='button' class='altui-plugin-category-btn btn btn-default'>{0}</button>".format(_T("All"))
				$.each(arr, function(i,entry) {
					html += "<button id='{0}' type='button' class='altui-plugin-category-btn btn btn-default'>{0} <span class='pull-right hidden-xs badge'>{1}</span></button>"
					.format(entry,_counts[entry] || 0 )
				});
			html += "</div>"
			html += "<button id='altui-publish' type='button' class='altui-plugin-publish-btn btn btn-default'>{0}</button>".format(_T("Publish"))
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
			html += "  <!-- Indicators -->"
			html += "  <ol class='carousel-indicators'>"
			for( var i=0;i<nentries;i++) {
				html += "<li data-target='#carousel-example-generic' data-slide-to='{1}' class='{0}'></li>".format( ((bFirst) ? 'active':'' ),i )
				bFirst = false;
			}
			html += "  </ol>"
			html += "  <!-- Wrapper for slides -->"
			bFirst = true;
			html += "  <div class='carousel-inner'>"
			for (i=0; i<nentries ; i++) {
				var index = (nentries <=nMax) ? i : getRandomInt(0,_plugins_data.plugins.length);
				var plugin = _plugins_data.plugins[index.toString()];
					html += "    <div class='item {0}'>".format( (bFirst) ? 'active':'')
					html += "      <div class='altui-features-box'></div>"
					html += "      <div class='carousel-caption'>"
					html += ( plugin.Icon.startsWith('https') ? "<img src='{0}'></img>"  : "<img class='pull-left' src='//apps.mios.com/{0}'></img>" ) .format(plugin.Icon);
					html += "      	<h3>{0}</h3><p>{1}</p>".format(plugin.Title.htmlEncode(),plugin.Description.htmlEncode() || "")
					html += "      </div>"
					html += "    </div>"
				bFirst = false;
			}
			html += "  </div>"
			html += "  <!-- Controls -->"
			html += "  <a class='left carousel-control' href='#carousel-example-generic' role='button' data-slide='prev'>"
			html += "    <span class='glyphicon glyphicon-chevron-left'></span>"
			html += "  </a>"
			html += "  <a class='right carousel-control' href='#carousel-example-generic' role='button' data-slide='next'>"
			html += "    <span class='glyphicon glyphicon-chevron-right'></span>"
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
						return -1
					if (b.major<a.major)
						return 1
					return b.minor-a.minor
				});
		}
		function _drawVersionSelect(pluginapp,arr) {
			var html = "<select class='input-sm form-control altui-version-selector'>"
			// var arr = _orderVersions(pluginapp);
			$.each(arr, function(key,version) {
					html += "<option value='{0}'>{0}</option>".format(version.label)
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
					html += "<button class='pull-left altui-store-install-btn btn btn-sm btn-info'>{0} {1}</button>".format(installglyph,_T("ALT"))
				if (repo.type=="Vera")
					html += "<button class='pull-left altui-store-mcvinstall-btn btn btn-sm btn-info'>{0} {1}</button>".format(installglyph,_T("Vera"))
			});
			html += "</div>"
			return html;
		}
		function _displayPluginReviews(cls,plugin) {
			var reviews = $.extend({average_rating:0,nb:0},plugin.reviews)
			var html ="";
			var stars = "";
			for( var i=1 ; i<= Math.round(reviews.average_rating); i++) {
				stars += glyphTemplate.format("star",reviews.average_rating,"text-warning")
			}
			for( var i=1+Math.round(reviews.average_rating); i<=5; i++) {
				stars += glyphTemplate.format("star-empty",reviews.average_rating,"")
			}
			html +="<div class='{2}'>{0} <span class='badge'>{1}</span></div>".format(stars, reviews.nb,cls)
			return html;
		}
		function _displayOnePlugin(plugin) {
			var arr = _orderVersions(plugin);
			var firstversionid = arr[0].id;
			var html = "";
				html += "<div id='{0}' class='col-xs-6 col-sm-4 col-md-3 col-lg-2 altui-pluginbox' data-pluginid='{0}'>".format(plugin.id)
					html += "<div class='panel panel-default'>"
						html += "<div class='panel-body'>"
							html += "<div class='altui-plugin-version pull-right'>{0}</div>".format(_drawVersionSelect(plugin,arr))
							html += ( plugin.Icon.startsWith('https') ? "<img {1} class='altui-plugin-icon' src='{0}'></img>"  : "<img {1} class='altui-plugin-icon' src='//apps.mios.com/{0}'></img>" ) .format(plugin.Icon,"onerror='this.src=defaultIconSrc'");
							html += "<div class='altui-plugin-title'>{0}</div>".format(plugin.Title.htmlEncode())
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
				html += "<div class='altui-pageswitchbox col-xs-2'>"
				// buttonTemplate 		= "<button id='{0}' type='button' class='{1} btn btn-{3}' aria-label='tbd' title='{4}'>{2}</button>"
				html += buttonTemplate.format(direction,'altui-plugin-pageswitch',pageGlyphs[direction]+" "+direction,'default',direction)
							// html += "<div class='altui-plugin-pageswitch' data-direction='{1}'>{0}</div>".format(pageGlyphs[direction],direction)
							// html += "<div class='altui-plugin-title'>{0}</div>".format(direction)
				html += "</div>"
				return html;
		}
		function _displayPlugins( filter ) {
			filter = $.extend({},filter)
			$(".altui-store-items").html("<div class='col-xs-12'><div class='jumbotron'><p>{0}</p></div></div>".format(pageGlyphs["spinner"]));
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
				
				html ="";
				if (_plugins_data.details.pagination.page>1)
					html +=_displayPageSwitch("backward")
				if (_plugins_data.details.pagination.page<_plugins_data.details.pagination.nbPage)
					html +=_displayPageSwitch("forward")
				
				$(".altui-store-paging").html( html );
			});
		}
		function _displayStore(  ) {
			var html = "";
			_computeCounts();
			// carousel
			html += "<div class='row'>";
				html += "<div class='col-xs-12'>";
					html += _displayCarousel()
				html += "</div>";
			html += "</div>";


			html += "<div class='row'>";
				// categories
				html += "<div class='col-xs-2'>{0}</div>".format( _displayCategories() )
				// plugins
				html += "<div class='col-xs-10'>"
					html += "<div class='row'>";
						html+="<div id='altui-plugin-name-filter' class='col-xs-12 input-group'>";
							html+="<span class='input-group-addon' id='altui-plugin-search-btn'>"+searchGlyph+"</span>";
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

		UIManager.clearPage(_T('App Store'),_T("Application Store"),UIManager.appStoreLayout);
		$("#altui-pagemessage").remove();

		_getPlugins({ versions:false })
		.done( function (data, textStatus, jqXHR) {
			// var _plugins_data= [{"Version":"7388","AllowMultiple":"1","Title":"Virtual ON/OFF Switches","Icon":"plugins/icons/1408.png","Instructions":"http://forum.micasaverde.com/","Hidden":"0","AutoUpdate":"1","VersionMajor":"1","VersionMinor":"32","SupportedPlatforms":null,"MinimumVersion":null,"DevStatus":null,"Approved":"1","id":1408,"TargetVersion":"0","timestamp":1347116315,"Files":[{"SourceName":"I_VSwitch.xml","SourcePath":null,"DestName":"I_VSwitch.xml","DestPath":"","Compress":"1","Encrypt":"0","Role":"I"},{"SourceName":"D_VSwitch.xml","SourcePath":null,"DestName":"D_VSwitch.xml","DestPath":"","Compress":"1","Encrypt":"0","Role":"D"},{"SourceName":"S_VSwitch.xml","SourcePath":null,"DestName":"S_VSwitch.xml","DestPath":"","Compress":"1","Encrypt":"0","Role":"S"},{"SourceName":"D_VSwitch.json","SourcePath":null,"DestName":"D_VSwitch.json","DestPath":"","Compress":"1","Encrypt":"0","Role":"J"},{"SourceName":"iconVSwitch_100.png","SourcePath":null,"DestName":"iconVSwitch_100.png","DestPath":"/../../www/cmh/skins/default/icons/","Compress":"0","Encrypt":"0","Role":"M"},{"SourceName":"iconVSwitch_0.png","SourcePath":null,"DestName":"iconVSwitch_0.png","DestPath":"/../../www/cmh/skins/default/icons/","Compress":"0","Encrypt":"0","Role":"M"}],"Devices":[{"DeviceFileName":"D_VSwitch.xml","DeviceType":"urn:schemas-upnp-org:device:VSwitch:1","ImplFile":"","Invisible":"0","CategoryNum":null}],"altuiid":"0-0"},{"Version":"25742","AllowMultiple":"0","Title":"Wunderground Weather Plugin","Icon":"plugins/icons/45.png","Instructions":"http://code.mios.com/trac/mios_weather","Hidden":"0","AutoUpdate":"1","VersionMajor":"1","VersionMinor":"58","SupportedPlatforms":null,"MinimumVersion":null,"DevStatus":null,"Approved":"1","id":45,"timestamp":1439229749,"Files":[{"SourceName":"D_Weather.xml","SourcePath":null,"DestName":"D_Weather.xml","DestPath":"","Compress":"1","Encrypt":"0","Role":"D"},{"SourceName":"D_Weather.json","SourcePath":null,"DestName":"D_Weather.json","DestPath":"","Compress":"1","Encrypt":"0","Role":"J"},{"SourceName":"S_Weather.xml","SourcePath":null,"DestName":"S_Weather.xml","DestPath":"","Compress":"1","Encrypt":"0","Role":"S"},{"SourceName":"I_WUIWeather.xml","SourcePath":null,"DestName":"I_WUIWeather.xml","DestPath":"","Compress":"1","Encrypt":"1","Role":"I"}],"Devices":[{"DeviceFileName":"D_Weather.xml","DeviceType":"urn:demo-micasaverde-com:device:weather:1","ImplFile":"I_WUIWeather.xml","Invisible":"0","CategoryNum":null}],"altuiid":"0-1"},{"Version":"11066","AllowMultiple":"0","Title":"Foscam IP Camera","Icon":"plugins/icons/1978.png","Instructions":"http://code.mios.com/trac/mios_foscam-camera","Hidden":"0","AutoUpdate":"1","VersionMajor":"2","VersionMinor":"6","SupportedPlatforms":null,"MinimumVersion":null,"DevStatus":null,"Approved":"1","id":1978,"timestamp":1438418219,"Files":[{"SourceName":"I_FoscamPTZ.xml","SourcePath":null,"DestName":"I_FoscamPTZ.xml","DestPath":"","Compress":"1","Encrypt":"0","Role":"I"}],"altuiid":"0-2"},{"Version":"25988","AllowMultiple":"1","Title":"Day or Night","Icon":"plugins/icons/3166.png","Instructions":"http://RTS-Services.com/Vera/Plugin/DayTime","Hidden":"0","AutoUpdate":"1","VersionMajor":"3","VersionMinor":"5","SupportedPlatforms":null,"MinimumVersion":null,"DevStatus":null,"Approved":"1","id":3166,"timestamp":1426948769,"Files":[{"SourceName":"D_DayTime.xml","SourcePath":null,"DestName":"D_DayTime.xml","DestPath":"","Compress":"1","Encrypt":"0","Role":"D"},{"SourceName":"D_DayTime.json","SourcePath":null,"DestName":"D_DayTime.json","DestPath":"","Compress":"1","Encrypt":"0","Role":"J"},{"SourceName":"I_DayTime.xml","SourcePath":null,"DestName":"I_DayTime.xml","DestPath":"","Compress":"1","Encrypt":"0","Role":"I"},{"SourceName":"J_DayTime.js","SourcePath":null,"DestName":"J_DayTime.js","DestPath":"","Compress":"1","Encrypt":"0","Role":"J"},{"SourceName":"DayTime.png","SourcePath":null,"DestName":"DayTime.png","DestPath":"","Compress":"0","Encrypt":"0","Role":"M"},{"SourceName":"DayTime_0.png","SourcePath":null,"DestName":"DayTime_0.png","DestPath":"","Compress":"0","Encrypt":"0","Role":"M"},{"SourceName":"DayTime_100.png","SourcePath":null,"DestName":"DayTime_100.png","DestPath":"","Compress":"0","Encrypt":"0","Role":"M"},{"SourceName":"dn-install.sh","SourcePath":null,"DestName":"dn-install.sh","DestPath":"","Compress":"0","Encrypt":"0","Role":"M"},{"SourceName":"J_DayTime-UI5.js","SourcePath":null,"DestName":"J_DayTime-UI5.js","DestPath":"","Compress":"1","Encrypt":"0","Role":"J"},{"SourceName":"J_DayTime-UI6.js","SourcePath":null,"DestName":"J_DayTime-UI6.js","DestPath":"","Compress":"1","Encrypt":"0","Role":"J"},{"SourceName":"D_DayTime-UI7.js","SourcePath":null,"DestName":"D_DayTime-UI7.js","DestPath":"","Compress":"1","Encrypt":"0","Role":"J"}],"Devices":[{"DeviceFileName":"D_DayTime.xml","DeviceType":"urn:schemas-rts-services-com:device:DayTime:1","ImplFile":"I_DayTime.xml","Invisible":"0","CategoryNum":null}],"altuiid":"0-3"},{"SupportedPlatforms":{},"MinimumVersion":{},"DevStatus":{},"Version":25106,"AllowMultiple":"1","Title":"Samsung TV Remote","Icon":"plugins/icons/2248.png","Instructions":"http://www.antor.fr/apps/samsung-tv-remote/","Hidden":"0","VersionMajor":"0","VersionMinor":"5","Approved":"1","id":2248,"TargetVersion":"25106","timestamp":1418491117,"AutoUpdate":1,"Files":[{"SourceName":"D_STVR1.json","SourcePath":{},"DestName":"D_STVR1.json","DestPath":"","Compress":"1","Encrypt":"0","Role":"J"},{"SourceName":"D_STVR1.xml","SourcePath":{},"DestName":"D_STVR1.xml","DestPath":"","Compress":"1","Encrypt":"0","Role":"D"},{"SourceName":"I_STVR1.xml","SourcePath":{},"DestName":"I_STVR1.xml","DestPath":"","Compress":"1","Encrypt":"0","Role":"I"},{"SourceName":"S_STVR1.xml","SourcePath":{},"DestName":"S_STVR1.xml","DestPath":"","Compress":"1","Encrypt":"0","Role":"S"}],"Devices":[{"DeviceFileName":"D_STVR1.xml","DeviceType":"urn:antor-fr:device:SamsungTVRemote:1","ImplFile":"I_STVR1.xml","Invisible":"0","CategoryNum":"7"}],"altuiid":"0-4"},{"Version":31718,"AllowMultiple":"1","Title":"IPhone Locator Plugin","Icon":"plugins/icons/4686.png","Instructions":"http://forum.micasaverde.com/index.php/topic,16907.0.html","Hidden":"0","AutoUpdate":"1","Files":[{"SourceName":"L_IPhone.lua","SourcePath":null,"DestName":"L_IPhone.lua","DestPath":"","Compress":"1","Encrypt":"0","Role":"M"},{"SourceName":"J_IPhone.js","SourcePath":null,"DestName":"J_IPhone.js","DestPath":"","Compress":"1","Encrypt":"0","Role":"J"},{"SourceName":"S_IPhone.xml","SourcePath":null,"DestName":"S_IPhone.xml","DestPath":"","Compress":"1","Encrypt":"0","Role":"S"},{"SourceName":"D_IPhone.json","SourcePath":null,"DestName":"D_IPhone.json","DestPath":"","Compress":"1","Encrypt":"0","Role":"J"},{"SourceName":"D_IPhone.xml","SourcePath":null,"DestName":"D_IPhone.xml","DestPath":"","Compress":"1","Encrypt":"0","Role":"D"},{"SourceName":"I_IPhone.xml","SourcePath":null,"DestName":"I_IPhone.xml","DestPath":"","Compress":"1","Encrypt":"0","Role":"I"},{"SourceName":"iconIPhone_0.png","SourcePath":null,"DestName":"iconIPhone_0.png","DestPath":"/../../www/cmh/skins/default/icons/","Compress":"0","Encrypt":"0","Role":"M"},{"SourceName":"iconIPhone_25.png","SourcePath":null,"DestName":"iconIPhone_25.png","DestPath":"/../../www/cmh/skins/default/icons/","Compress":"0","Encrypt":"0","Role":"M"},{"SourceName":"iconIPhone_75.png","SourcePath":null,"DestName":"iconIPhone_75.png","DestPath":"/../../www/cmh/skins/default/icons/","Compress":"0","Encrypt":"0","Role":"M"},{"SourceName":"iconIPhone_100.png","SourcePath":null,"DestName":"iconIPhone_100.png","DestPath":"/../../www/cmh/skins/default/icons/","Compress":"0","Encrypt":"0","Role":"M"},{"SourceName":"L_IPhoneJson.lua","SourcePath":null,"DestName":"L_IPhoneJson.lua","DestPath":"","Compress":"1","Encrypt":"0","Role":"M"},{"SourceName":"iconIPhone.png","SourcePath":null,"DestName":"iconIPhone.png","DestPath":"/../../www/cmh/skins/default/icons/","Compress":"0","Encrypt":"0","Role":"M"},{"SourceName":"iconIPhone_50.png","SourcePath":null,"DestName":"iconIPhone_50.png","DestPath":"/../../www/cmh/skins/default/icons/","Compress":"0","Encrypt":"0","Role":"M"},{"SourceName":"L_IPhoneEnc.lua","SourcePath":null,"DestName":"L_IPhoneEnc.lua","DestPath":"","Compress":"1","Encrypt":"0","Role":"M"},{"SourceName":"newbutton_bg.png","SourcePath":null,"DestName":"newbutton_bg.png","DestPath":"/../../www/cmh/skins/default/images/cpanel/","Compress":"0","Encrypt":"0","Role":"M"},{"SourceName":"D_IPhone_UI7.json","SourcePath":null,"DestName":"D_IPhone_UI7.json","DestPath":"","Compress":"1","Encrypt":"0","Role":"J"}],"Devices":[{"DeviceFileName":"D_IPhone.xml","DeviceType":"urn:schemas-upnp-org:device:IPhoneLocator:1","ImplFile":"I_IPhone.xml","Invisible":"0","CategoryNum":"1"}],"VersionMajor":"2","VersionMinor":"39","SupportedPlatforms":null,"MinimumVersion":null,"DevStatus":null,"Approved":"0","id":4686,"TargetVersion":"31718","timestamp":1465293084,"altuiid":"0-5"},{"Version":28622,"AllowMultiple":"1","Title":"IPX800","Icon":"plugins/icons/7426.png","Instructions":"http://forum.micasaverde.com/index.php/topic,28342.0.html","Hidden":"0","AutoUpdate":"1","VersionMajor":"0","VersionMinor":"51","SupportedPlatforms":null,"MinimumVersion":null,"DevStatus":null,"Approved":"0","id":7426,"TargetVersion":"28622","timestamp":1439995091,"Files":[{"SourceName":"L_IPX800.lua","SourcePath":null,"DestName":"L_IPX800.lua","DestPath":"","Compress":"1","Encrypt":"0","Role":"L"},{"SourceName":"I_IPX800.xml","SourcePath":null,"DestName":"I_IPX800.xml","DestPath":"","Compress":"1","Encrypt":"0","Role":"I"},{"SourceName":"J_IPX800.js","SourcePath":null,"DestName":"J_IPX800.js","DestPath":"","Compress":"1","Encrypt":"0","Role":"J"},{"SourceName":"D_IPX800.json","SourcePath":null,"DestName":"D_IPX800.json","DestPath":"","Compress":"1","Encrypt":"0","Role":"J"},{"SourceName":"D_IPX800.xml","SourcePath":null,"DestName":"D_IPX800.xml","DestPath":"","Compress":"1","Encrypt":"0","Role":"D"},{"SourceName":"S_IPX800.xml","SourcePath":null,"DestName":"S_IPX800.xml","DestPath":"","Compress":"1","Encrypt":"0","Role":"S"},{"SourceName":"xpath.lua","SourcePath":null,"DestName":"xpath.lua","DestPath":"","Compress":"1","Encrypt":"0","Role":"L"},{"SourceName":"iconIPX800.png","SourcePath":null,"DestName":"iconIPX800.png","DestPath":"/../../www/cmh/skins/default/icons/","Compress":"0","Encrypt":"0","Role":"M"},{"SourceName":"iconIPX800_0.png","SourcePath":null,"DestName":"iconIPX800_0.png","DestPath":"/../../www/cmh/skins/default/icons/","Compress":"0","Encrypt":"0","Role":"M"},{"SourceName":"iconIPX800_100.png","SourcePath":null,"DestName":"iconIPX800_100.png","DestPath":"/../../www/cmh/skins/default/icons/","Compress":"0","Encrypt":"0","Role":"M"},{"SourceName":"L_IPX800json.lua","SourcePath":null,"DestName":"L_IPX800json.lua","DestPath":"","Compress":"1","Encrypt":"0","Role":"L"},{"SourceName":"D_IPX800_UI7.json","SourcePath":null,"DestName":"D_IPX800_UI7.json","DestPath":"","Compress":"1","Encrypt":"0","Role":"J"}],"Devices":[{"DeviceFileName":"D_IPX800.xml","DeviceType":"urn:schemas-upnp-org:device:IPX800:1","ImplFile":"I_IPX800.xml","Invisible":"0","CategoryNum":"1"}],"Lua":[{"FileName":"L_IPX800.lua"},{"FileName":"xpath.lua"},{"FileName":"L_IPX800json.lua"}],"altuiid":"0-6"},{"Version":"25502","AllowMultiple":"0","Title":"Freebox Revolution","Icon":"plugins/icons/8108.png","Instructions":"http://code.mios.com/trac/mios_freebox-revolution","Hidden":"0","AutoUpdate":"1","VersionMajor":"1","VersionMinor":"0","SupportedPlatforms":null,"MinimumVersion":null,"DevStatus":null,"Approved":"1","id":8108,"timestamp":1420482583,"Files":[{"SourceName":"D_Freebox.json","SourcePath":null,"DestName":"D_Freebox.json","DestPath":"","Compress":"1","Encrypt":"0","Role":"J"},{"SourceName":"D_Freebox.xml","SourcePath":null,"DestName":"D_Freebox.xml","DestPath":"","Compress":"1","Encrypt":"0","Role":"D"},{"SourceName":"I_Freebox.xml","SourcePath":null,"DestName":"I_Freebox.xml","DestPath":"","Compress":"1","Encrypt":"0","Role":"I"},{"SourceName":"J_Freebox.js","SourcePath":null,"DestName":"J_Freebox.js","DestPath":"","Compress":"1","Encrypt":"0","Role":"J"},{"SourceName":"L_FreeboxTTS.lua","SourcePath":null,"DestName":"L_FreeboxTTS.lua","DestPath":"","Compress":"1","Encrypt":"0","Role":"M"},{"SourceName":"S_Freebox.xml","SourcePath":null,"DestName":"S_Freebox.xml","DestPath":"","Compress":"1","Encrypt":"0","Role":"S"},{"SourceName":"L_Freebox.lua","SourcePath":null,"DestName":"L_Freebox.lua","DestPath":"","Compress":"1","Encrypt":"0","Role":"M"},{"SourceName":"L_FreeboxJSON.lua","SourcePath":null,"DestName":"L_FreeboxJSON.lua","DestPath":"","Compress":"1","Encrypt":"0","Role":"M"},{"SourceName":"L_FreeboxSha1.lua","SourcePath":null,"DestName":"L_FreeboxSha1.lua","DestPath":"","Compress":"1","Encrypt":"0","Role":"M"}],"Devices":[{"DeviceFileName":"D_Freebox.xml","DeviceType":"urn:freebox-fr:device:Freebox:1","ImplFile":"I_Freebox.xml","Invisible":"0","CategoryNum":"1"}],"altuiid":"0-7"},{"Version":"27131","AllowMultiple":"0","Title":"HouseModes Plugin","Icon":"plugins/icons/7246.png","Instructions":"http://code.mios.com/trac/mios_house_modes_plugin","Hidden":"0","AutoUpdate":"1","VersionMajor":"1","VersionMinor":"60","SupportedPlatforms":null,"MinimumVersion":null,"DevStatus":null,"Approved":"1","id":7246,"timestamp":1432297111,"Files":[{"SourceName":"D_HouseModes.json","SourcePath":null,"DestName":"D_HouseModes.json","DestPath":"","Compress":"1","Encrypt":"0","Role":"J"},{"SourceName":"D_HouseModes.xml","SourcePath":null,"DestName":"D_HouseModes.xml","DestPath":"","Compress":"1","Encrypt":"0","Role":"D"},{"SourceName":"I_HouseModes.xml","SourcePath":null,"DestName":"I_HouseModes.xml","DestPath":"","Compress":"1","Encrypt":"0","Role":"I"},{"SourceName":"L_HouseModes.lua","SourcePath":null,"DestName":"L_HouseModes.lua","DestPath":"","Compress":"1","Encrypt":"0","Role":"M"},{"SourceName":"S_HouseModes.xml","SourcePath":null,"DestName":"S_HouseModes.xml","DestPath":"","Compress":"1","Encrypt":"0","Role":"S"}],"Devices":[{"DeviceFileName":"D_HouseModes.xml","DeviceType":"urn:schemas-micasaverde-com:device:HouseModes:1","ImplFile":"I_HouseModes.xml","Invisible":"0","CategoryNum":"1"}],"altuiid":"0-8"},{"Version":31646,"AllowMultiple":"1","Title":"Canal Plus Satellite Decoder","Icon":"plugins/icons/7466.png","Instructions":"http://forum.micasaverde.com/index.php/topic,28633.0.html","Hidden":"0","AutoUpdate":"1","VersionMajor":"2","VersionMinor":"36","SupportedPlatforms":null,"MinimumVersion":null,"DevStatus":null,"Approved":"0","id":7466,"TargetVersion":"31646","timestamp":1464543817,"Files":[{"SourceName":"iconCPLUS_100.png","SourcePath":null,"DestName":"iconCPLUS_100.png","DestPath":"/../../www/cmh/skins/default/icons/","Compress":"0","Encrypt":"0","Role":"M"},{"SourceName":"iconCPLUS_0.png","SourcePath":null,"DestName":"iconCPLUS_0.png","DestPath":"/../../www/cmh/skins/default/icons/","Compress":"0","Encrypt":"0","Role":"M"},{"SourceName":"S_CPLUS.xml","SourcePath":null,"DestName":"S_CPLUS.xml","DestPath":"","Compress":"1","Encrypt":"0","Role":"S"},{"SourceName":"iconCPLUS.png","SourcePath":null,"DestName":"iconCPLUS.png","DestPath":"/../../www/cmh/skins/default/icons/","Compress":"0","Encrypt":"0","Role":"M"},{"SourceName":"L_CPLUS.lua","SourcePath":null,"DestName":"L_CPLUS.lua","DestPath":"","Compress":"1","Encrypt":"0","Role":"L"},{"SourceName":"L_CPLUSjson.lua","SourcePath":null,"DestName":"L_CPLUSjson.lua","DestPath":"","Compress":"1","Encrypt":"0","Role":"L"},{"SourceName":"I_CPLUS.xml","SourcePath":null,"DestName":"I_CPLUS.xml","DestPath":"","Compress":"1","Encrypt":"0","Role":"I"},{"SourceName":"J_CPLUS.js","SourcePath":null,"DestName":"J_CPLUS.js","DestPath":"","Compress":"1","Encrypt":"0","Role":"J"},{"SourceName":"D_CPLUS.xml","SourcePath":null,"DestName":"D_CPLUS.xml","DestPath":"","Compress":"1","Encrypt":"0","Role":"D"},{"SourceName":"D_CPLUS.json","SourcePath":null,"DestName":"D_CPLUS.json","DestPath":"","Compress":"1","Encrypt":"0","Role":"J"},{"SourceName":"D_CPLUS_UI7.json","SourcePath":null,"DestName":"D_CPLUS_UI7.json","DestPath":"","Compress":"1","Encrypt":"0","Role":"J"}],"Devices":[{"DeviceFileName":"D_CPLUS.xml","DeviceType":"urn:schemas-upnp-org:device:cplus:1","ImplFile":"I_CPLUS.xml","Invisible":"0","CategoryNum":"3"}],"Lua":[{"FileName":"L_CPLUS.lua"},{"FileName":"L_CPLUSjson.lua"}],"altuiid":"0-9"},{"Version":"28712","AllowMultiple":"1","Title":"RGB Controller","Icon":"plugins/icons/6686.png","Instructions":"http://forum.micasaverde.com/index.php/topic,32613.0.html","Hidden":"0","AutoUpdate":"1","VersionMajor":"1","VersionMinor":"33","SupportedPlatforms":null,"MinimumVersion":null,"DevStatus":null,"Approved":"1","id":6686,"timestamp":1442568459,"Files":[{"SourceName":"D_RGBController1.xml","SourcePath":null,"DestName":"D_RGBController1.xml","DestPath":"","Compress":"1","Encrypt":"0","Role":"D"},{"SourceName":"D_RGBController1.json","SourcePath":null,"DestName":"D_RGBController1.json","DestPath":"","Compress":"1","Encrypt":"0","Role":"J"},{"SourceName":"I_RGBController1.xml","SourcePath":null,"DestName":"I_RGBController1.xml","DestPath":"","Compress":"1","Encrypt":"0","Role":"I"},{"SourceName":"S_RGBController1.xml","SourcePath":null,"DestName":"S_RGBController1.xml","DestPath":"","Compress":"1","Encrypt":"0","Role":"S"},{"SourceName":"J_RGBController1.js","SourcePath":null,"DestName":"J_RGBController1.js","DestPath":"","Compress":"1","Encrypt":"0","Role":"M"},{"SourceName":"L_RGBController1.lua","SourcePath":null,"DestName":"L_RGBController1.lua","DestPath":"","Compress":"1","Encrypt":"0","Role":"M"},{"SourceName":"D_RGBController1_UI7.json","SourcePath":null,"DestName":"D_RGBController1_UI7.json","DestPath":"","Compress":"1","Encrypt":"0","Role":"J"}],"Devices":[{"DeviceFileName":"D_RGBController1.xml","DeviceType":"urn:schemas-upnp-org:device:RGBController:1","ImplFile":"I_RGBController1.xml","Invisible":"0","CategoryNum":null}],"altuiid":"0-10"},{"Version":31706,"AllowMultiple":"0","Title":"Alternate UI","Icon":"plugins/icons/8246.png","Instructions":"http://forum.micasaverde.com/index.php/board,78.0.html","Hidden":"0","AutoUpdate":"1","Files":[{"SourceName":"iconALTUI.png","SourcePath":null,"DestName":"iconALTUI.png","DestPath":"","Compress":"0","Encrypt":"0","Role":"M"},{"SourceName":"I_ALTUI.xml","SourcePath":null,"DestName":"I_ALTUI.xml","DestPath":"","Compress":"1","Encrypt":"0","Role":"I"},{"SourceName":"S_ALTUI.xml","SourcePath":null,"DestName":"S_ALTUI.xml","DestPath":"","Compress":"1","Encrypt":"0","Role":"S"},{"SourceName":"L_ALTUIjson.lua","SourcePath":null,"DestName":"L_ALTUIjson.lua","DestPath":"","Compress":"1","Encrypt":"0","Role":"M"},{"SourceName":"D_ALTUI.xml","SourcePath":null,"DestName":"D_ALTUI.xml","DestPath":"","Compress":"1","Encrypt":"0","Role":"D"},{"SourceName":"L_ALTUI.lua","SourcePath":null,"DestName":"L_ALTUI.lua","DestPath":"","Compress":"1","Encrypt":"0","Role":"M"},{"SourceName":"D_ALTUI.json","SourcePath":null,"DestName":"D_ALTUI.json","DestPath":"","Compress":"1","Encrypt":"0","Role":"J"},{"SourceName":"D_ALTUI_UI7.json","SourcePath":null,"DestName":"D_ALTUI_UI7.json","DestPath":"","Compress":"1","Encrypt":"0","Role":"J"},{"SourceName":"J_ALTUI_verabox.js","SourcePath":null,"DestName":"J_ALTUI_verabox.js","DestPath":"","Compress":"1","Encrypt":"0","Role":"J"},{"SourceName":"J_ALTUI_utils.js","SourcePath":null,"DestName":"J_ALTUI_utils.js","DestPath":"","Compress":"1","Encrypt":"0","Role":"J"},{"SourceName":"J_ALTUI_plugins.js","SourcePath":null,"DestName":"J_ALTUI_plugins.js","DestPath":"","Compress":"1","Encrypt":"0","Role":"J"},{"SourceName":"J_ALTUI_uimgr.js","SourcePath":null,"DestName":"J_ALTUI_uimgr.js","DestPath":"","Compress":"1","Encrypt":"0","Role":"J"},{"SourceName":"J_ALTUI_jquery.ui.touch-punch.min.js","SourcePath":null,"DestName":"J_ALTUI_jquery.ui.touch-punch.min.js","DestPath":"","Compress":"1","Encrypt":"0","Role":"J"},{"SourceName":"J_ALTUI_iphone.js","SourcePath":null,"DestName":"J_ALTUI_iphone.js","DestPath":"","Compress":"1","Encrypt":"0","Role":"J"},{"SourceName":"J_ALTUI.js","SourcePath":null,"DestName":"J_ALTUI.js","DestPath":"","Compress":"1","Encrypt":"0","Role":"J"},{"SourceName":"J_ALTUI_loc_fr.js","SourcePath":null,"DestName":"J_ALTUI_loc_fr.js","DestPath":"","Compress":"1","Encrypt":"0","Role":"J"},{"SourceName":"J_ALTUI_loc_it.js","SourcePath":null,"DestName":"J_ALTUI_loc_it.js","DestPath":"","Compress":"1","Encrypt":"0","Role":"J"},{"SourceName":"J_ALTUI_multibox.js","SourcePath":null,"DestName":"J_ALTUI_multibox.js","DestPath":"","Compress":"1","Encrypt":"0","Role":"J"},{"SourceName":"J_ALTUI_b_blockly_compressed.js","SourcePath":null,"DestName":"J_ALTUI_b_blockly_compressed.js","DestPath":"","Compress":"1","Encrypt":"0","Role":"J"},{"SourceName":"J_ALTUI_b_fr.js","SourcePath":null,"DestName":"J_ALTUI_b_fr.js","DestPath":"","Compress":"1","Encrypt":"0","Role":"J"},{"SourceName":"J_ALTUI_b_it.js","SourcePath":null,"DestName":"J_ALTUI_b_it.js","DestPath":"","Compress":"1","Encrypt":"0","Role":"J"},{"SourceName":"J_ALTUI_b_blocks_compressed.js","SourcePath":null,"DestName":"J_ALTUI_b_blocks_compressed.js","DestPath":"","Compress":"1","Encrypt":"0","Role":"J"},{"SourceName":"J_ALTUI_b_en.js","SourcePath":null,"DestName":"J_ALTUI_b_en.js","DestPath":"","Compress":"1","Encrypt":"0","Role":"J"},{"SourceName":"J_ALTUI_b_javascript_compressed.js","SourcePath":null,"DestName":"J_ALTUI_b_javascript_compressed.js","DestPath":"","Compress":"1","Encrypt":"0","Role":"J"},{"SourceName":"J_ALTUI_b_lua_compressed.js","SourcePath":null,"DestName":"J_ALTUI_b_lua_compressed.js","DestPath":"","Compress":"1","Encrypt":"0","Role":"J"},{"SourceName":"L_ALTUI_LuaRunHandler.lua","SourcePath":null,"DestName":"L_ALTUI_LuaRunHandler.lua","DestPath":"","Compress":"1","Encrypt":"0","Role":"M"},{"SourceName":"J_ALTUI_api.js","SourcePath":null,"DestName":"J_ALTUI_api.js","DestPath":"","Compress":"1","Encrypt":"0","Role":"J"},{"SourceName":"J_ALTUI_upnp.js","SourcePath":null,"DestName":"J_ALTUI_upnp.js","DestPath":"","Compress":"1","Encrypt":"0","Role":"J"},{"SourceName":"J_ALTUI_loc_es.js","SourcePath":null,"DestName":"J_ALTUI_loc_es.js","DestPath":"","Compress":"1","Encrypt":"0","Role":"J"}],"Devices":[{"DeviceFileName":"D_ALTUI.xml","DeviceType":"urn:schemas-upnp-org:device:altui:1","ImplFile":"I_ALTUI.xml","Invisible":"0","CategoryNum":"1"}],"Lua":[{"FileName":"L_ALTUI.lua"},{"FileName":"L_ALTUIjson.lua"},{"FileName":"L_ALTUI_LuaRunHandler.lua"}],"VersionMajor":"1","VersionMinor":"57","SupportedPlatforms":null,"MinimumVersion":null,"DevStatus":null,"Approved":"0","id":8246,"TargetVersion":"31706","timestamp":1465232963,"altuiid":"0-11"}];
			if ( typeof data === "string" ) {
				try {_plugins_data= JSON.parse( data ) } catch(e) {_plugins_data={ plugins:[] }} 
			} else {
				_plugins_data = data;
			};
			_plugins_data.plugins.sort( function(a,b) {return a.Title.localeCompare(b.Title); } )

			$(".altui-mainpanel").html(_displayStore());
			pluginsFilter = { }
			_displayPlugins( pluginsFilter );			
			$('#altui-plugin-name-filter-input').autocomplete({
				source: $.map(_plugins_data.plugins, function(p) { return p.Title } ),
				select: function( event, ui ) {
					pluginsFilter = { filtername:ui.item.value }
					_displayPlugins( pluginsFilter );			
				}
			});
			// interactivity
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
			.on("click",".altui-plugin-reviews",function() {
				var pluginid= $(this).closest(".altui-pluginbox").data("pluginid");
				var plugin = UIManager._findPlugin(_plugins_data.details.plugins,pluginid)
				var dialog = DialogManager.registerDialog('dialogModal',
									defaultDialogModalTemplate.format( 'dialogModal',
									_T('Plugin Rating for {0}'.format(plugin.Title)),	// title
									_displayPluginReviews("altui-reviews-graph",plugin) ,						// body 
									""		// size
								));
				var choices = $.map( [ "1-poor","2-below avg","3-average","4-above avg","5-excellent" ] , function(e,i) {return { value:i+1,text:_T(e) } } );
				DialogManager.dlgAddSelect(dialog, "Rating", _T("Rating"), 3, choices, null)
				DialogManager.dlgAddLine( dialog , "Comment", _T("Comment"), "", "", null ); 
				DialogManager.dlgAddLine( dialog , "UserName", _T("User Name"), MultiBox.getMainUser().Name, "", null ); 
				DialogManager.dlgAddDialogButton($('div#dialogModal'), true, _T("Save Changes"));		
				$('div#dialogModal').modal();
				_getReviews( pluginid ).done( function(data) {
					data = $.map(data.reviews, function(e,i) {
						return {User:e.user_name, Rate:e.rate, Comment:e.comment}
					})
					var html = HTMLUtils.array2Table(data,'',null,_T("Reviews"),"","altui-reviews-text")
					$(".altui-reviews-graph").after("<div>{0}</div>".format(html))
				});
				$('div#dialogs')
					.off('submit',"div#dialogModal")
					.on( 'submit',"div#dialogModal", function() {
						_updatePluginReview( {
							plugin_id : pluginid, 
							comment : $("#altui-widget-Comment").val(),
							rate : $("#altui-widget-Rating").val(),
							user_name : $("#altui-widget-UserName").val()
							})
						.done( function (data, textStatus, jqXHR) {
							PageMessage.message( _T("Success")+":"+data, "success");
						})
						.always( function() {
							$('div#dialogModal').modal('hide');
						})
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
				pluginsFilter = { filterbtn:filter }
				_displayPlugins( pluginsFilter );
			})
			.on("click",".altui-plugin-publish-btn",function() {
				UIManager.pageAppPublish();
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
				var altuiapp_device = MultiBox.getDeviceByType(0,"urn:schemas-upnp-org:device:AltAppStore:1")
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
										devices: plugin.Devices,					// [{  "DeviceFileName":"D_Netatmo.xml",  "DeviceType":"urn:akbooer-com:device:Netatmo:1",  "ImplFile":"I_Netatmo.xml",  "Invisible":"0"}]
										version: plugin.Versions[ versionid ]	,	//  {"major":15,"minor":"0130"}
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
	
	pagePlugins: function ()
	{
		function _sortBySourceName(a,b)
		{
			if (a.SourceName < b.SourceName)
				return -1;
			if (a.SourceName > b.SourceName)
				return 1;
			return 0;
		};
		
		UIManager.clearPage(_T('Plugins'),_T("Plugins"),UIManager.oneColumnLayout);

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
			html +="<div class='btn-group'>";
			html +="  <button id='{0}' type='button' class='btn btn-default btn-sm dropdown-toggle altui-plugin-files' data-toggle='dropdown' aria-expanded='false'>".format(plugin.id);
			html +=  (_T("Files")+" <span class='caret'></span>");
			html +="  </button>";
			html +="  <ul class='dropdown-menu' role='menu'>";
			if (plugin.Files)
				$.each(plugin.Files.sort(_sortBySourceName), function(idx,file) {
					html +="    <li><a class='altui-plugin-file' href='#' data-plugin='{1}'>{0}</a></li>".format(file.SourceName,plugin.altuiid);
				});
			html +="  </ul>";
			html +="</div>";
			// var filebutton = smallbuttonTemplate.format( plugin.id, 'altui-plugin-icon altui-plugin-files',  glyphTemplate.format("file","Files",""));
			return html;
		};
		
		var pluginTemplate = "<tr data-altuiid='{9}'><td>{6}</td><td>{0}<div><small>{9}</small></div></td><td>{1}.{2}</td><td>{10}</td><td>{7}</td><td>{3} {4}</td><td>{5}</td><td>{8}</td></tr>";
		function drawPlugin(idx, plugin) {
			var iconTemplate = ( plugin.Icon.startsWith('https') ? "<img class='altui-plugin-icon' src='{0}'></img>"  : "<img class='altui-plugin-icon' src='//apps.mios.com/{0}'></img>" ) .format(plugin.Icon);
			var filebutton = _getFileButton(plugin);
			var helpbutton = smallbuttonTemplate.format( plugin.id, 'altui-plugin-icon altui-plugin-question-sign',  glyphTemplate.format("question-sign","Help",""), "Help");
			var infobutton = smallbuttonTemplate.format( plugin.id, 'altui-plugin-icon altui-plugin-info-sign',  glyphTemplate.format("info-sign","Information",""), "Info");
			var updatebutton = smallbuttonTemplate.format( plugin.id, 'altui-plugin-icon altui-plugin-update',  glyphTemplate.format("retweet","Update Now",""), "Update");
			var deletebutton = smallbuttonTemplate.format( plugin.id, 'altui-plugin-icon altui-plugin-uninstall',  glyphTemplate.format("remove","Uninstall",""), "Uninstall");
			var inputbox = "<input class='form-control input-sm altui-plugin-version' id='altui-plugin-version-{0}' title='{1}'></input>".format( plugin.altuiid,_T("Version number or empty for latest official version"));

			var autoupdate = plugin.AltuiSettings ? (plugin.AltuiSettings.AutoUpdate==1) : (parseInt(plugin.AutoUpdate)==1);
			var pluginTxt = pluginTemplate.format(
				plugin.Title,
				plugin.VersionMajor,
				plugin.VersionMinor,
				helpbutton,
				infobutton,
				inputbox+updatebutton,
				iconTemplate,
				filebutton,
				deletebutton,
				plugin.altuiid,
				"<input class='altui-plugin-autoupdate' id='{0}' type='checkbox'  {1} {2} ></input>".format( 
					plugin.id, 
					autoupdate  ? 'checked' : '',
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
					files   : [],
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
					"<img class='altui-plugin-icon' src='//apps.mios.com/images/plugin.png'></img>",
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
					UIManager.pageEditor(name,txt,"Download",function(txt) {
						$(".altui-mainpanel a[download]")[0].click();
					});
					$(".altui-mainpanel").prepend("<div class='hidden' >Download: <a href='"+url+"' download>"+name+"</a></div>");
				});
			});
			$(".altui-plugin-update").click(function() {
				var id = $(this).prop("id");
				var altuiid = $(this).closest("tr").data("altuiid");
				if (id==undefined)	return;
				DialogManager.confirmDialog(_T("are you sure you want to update plugin #{0}").format(id),function(result) {
					if (result==true) {
						var val = $("#altui-plugin-version-"+altuiid).val();
						if ( isNullOrEmpty(val)  == false ) {
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
		
		$(".altui-mainpanel").append($("<table id='table' class='table table-condensed'><thead><tr><th></th><th>"+_T("Name")+"</th><th>"+_T("Version")+"</th><th>"+_T("Update")+"</th><th>"+_T("Files")+"</th><th>Actions</th><th>"+_T("Update")+"</th><th>"+_T("Uninstall")+"</th></tr></thead><tbody></tbody></table>"));
		MultiBox.getPlugins( drawPlugin , endDrawPlugin);
	},
	
	pageUsePages: function ()
	{
		// var pages = g_ALTUI.g_CustomPages;
		// PageManager.init(g_ALTUI.g_CustomPages);
		UIManager.clearPage(_T('Custom Pages'),"",UIManager.oneColumnLayout);
		
		// lean layout if requested
		if ( getQueryStringValue("Layout") == 'lean') {
			$("#altui-pagemessage").remove();
			$(".navbar-fixed-top").remove();
			$(".container-fluid").css("margin-top","-60px");
			$(".container-fluid").find(".col-xs-12").first().removeClass('col-sm-push-1').removeClass('col-sm-10');
		}

		// $("#altui-pagetitle").text("Your Custom Pages");

		var nPage = parseInt(getQueryStringValue("nPage") || -1) ;
		var pageTabs = _createPageTabsHtml( false, nPage ) ;
		var Html = "<div class='tab-content altui-page-contents'>";
		PageManager.forEachPage( function( idx, page) {
				if ( (nPage==-1) || (nPage==idx) ) {
					Html += _getPageHtml(page,false)	;// no edit mode
				}
		});
		Html += "</div>";
		
		$(".altui-mainpanel").html( "<div class='col-xs-12'>"+pageTabs + Html +"</div>");
		$('#altui-page-tabs a:first').tab('show');
		_updateDynamicDisplayTools( false );
	},
	
	pageEditPages: function ()
	{				
		function _pagePageProperty(pagename) {
			var propertyline = "";
			var page = PageManager.getPageFromName(pagename);
			var pageAttributes = [
				{ key:'name', 		label:'Name', 			placeholder:'enter name' },
				{ key:'background',	label:'CSS Background', placeholder:'enter css string' , helptext:'any css3 valid background property'}
			];

			$.each( pageAttributes , function(idx,attributes) {
				var htmlid = 'altui-page-'+attributes.key;
				propertyline += "<div class='form-group'>";
				propertyline += "	<label for='{0}'>{1}</label>".format(htmlid, attributes.label);
				propertyline += "	<input id='{0}' class='form-control' type='text' value='{2}' placeholder='{1}'></input>"
					.format(
						htmlid,
						attributes.placeholder,
						page[ attributes.key ].replace(/'/g, '&quot;')
					);
				if (attributes.helptext)
					propertyline += "<p class='help-block'>{0}</p>".format(attributes.helptext);
				propertyline += "</div>";
			});

			var dialog = DialogManager.registerDialog('dialogModal',
							defaultDialogModalTemplate.format( 'dialogModal',
							'Page Properties',					// title
							"<form>"+propertyline+"</form>",	// body
							"modal-lg"		// size
						));

			DialogManager.dlgAddDialogButton($('div#dialogModal'), true, _T("Save Changes"));							
			// buttons
			$('div#dialogModal button.btn-primary').off('click');
			$('div#dialogModal button.btn-primary').on( 'click', function() {
				$.each( pageAttributes , function(idx,attributes) {
					var htmlid = 'altui-page-'+attributes.key;
					page[ attributes.key ] = $("#"+htmlid).val();
				});
				$('div#dialogModal').modal('hide');
				_displayPages();
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
			return "<div class='col-xs-12'>"+pageTabs + Html+"</div>";
		};
		
		function _createToolboxHtml() {
			function _createToolHtml(tool) {
				var html="";
				html += ("<div class='altui-widget {0} col-xs-11' id='{1}' data-type='{0}' >{2}</div>").format(tool.cls,tool.id,tool.html);
				return html;
			};

			var lines = new Array();
			$.each(tools , function(idx,tool) {
				lines.push( "<div class='row'>"+_createToolHtml(tool)+"</div>" );
			});

			var editBoxTemplate = "<div class='row'><div class='altui-edittoolbox col-xs-11' aria-label=''>{0}</div></div>";
			var editBoxLines = new Array();
			$.each(edittools , function(idx,tool) {
				var glyph = glyphTemplate.format( tool.glyph, tool.glyph,"" );
				editBoxLines.push("<div id='{0}' class='altui-edittools' title='{2}'>{1}</div>".format(tool.glyph,glyph,tool.label || ''));
			});
			lines.push(editBoxTemplate.format( editBoxLines.join('') ) );
			lines.push( "<div class='row'><div class='altui-widget-delete col-xs-11'>"+deleteGlyph+"</div></div>"  );
			return lines.join('');
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
							.draggable( _widgetOnCanvasDraggableOptions(page) );
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
		UIManager.clearPage(_T('Edit Pages'),_T("Custom Pages Editor"),UIManager.twoColumnLayout);
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
		UIManager.clearPage(_T('Wip'),_T("Work In Progress"));
		$(".altui-mainpanel").append("<h3>Sorry this is not yet implemented</h3>");
	},

	getPayPalButtonHtml: function( )
	{
		var language = getQueryStringValue("lang") || window.navigator.userLanguage || window.navigator.language;
		language = language.substring(0, 2).toUpperCase();
		var html = "";
		if (1) {
			html += "<form class='form' action='https://www.paypal.com/cgi-bin/webscr' method='post' target='_top'>";
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
			html += "</select> </td></tr>";
			html += "<tr><td><input type='hidden' name='on1' value='Footer username'>Footer username</td></tr><tr><td><input class='form-control'type='text' name='os1' maxlength='200' value='"+MultiBox.getMainUser().Name+"'></td></tr>";
			html += "</table>";
			html += "<input type='hidden' name='currency_code' value='EUR'>";
			html += "<input type='hidden' name='option_select0' value='6 months'>";
			html += "<input type='hidden' name='option_amount0' value='12.00'>";
			html += "<input type='hidden' name='option_select1' value='12 months'>";
			html += "<input type='hidden' name='option_amount1' value='20.00'>";
			html += "<input type='hidden' name='option_select2' value='24 months'>";
			html += "<input type='hidden' name='option_amount2' value='36.00'>";
			html += "<input type='hidden' name='option_index' value='0'>";
			html += "<hr>"
			html += "<input type='image' src='https://www.paypalobjects.com/en_US/i/btn/btn_buynowCC_LG_global.gif' border='0' name='submit' alt='PayPal – The safer, easier way to pay online.'>";
			html += "<img alt='' border='0' src='https://www.paypalobjects.com/fr_FR/i/scr/pixel.gif' width='1' height='1'>";
			html += "</form>"
		} else {
			html+="<form action='https://www.paypal.com/cgi-bin/webscr' method='post' target='_top'>";
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
		UIManager.clearPage(_T('License'),_T("License Fees"),UIManager.twoColumnLayout);
		$("#altui-pagemessage").remove();
		var html = "";
		html +="<span class='col-xs-12'>{0}</span>".format(
		_T("For non commercial use, ALTUI plugin is free for trial without limitation on its functionality. However, to compensate the effort and time spent on regularly improving this project, a registration fee equivalent to <span class='text-info'><mark><b>2€ per month</b></mark></span> is requested for longer term use. You can choose your level of contribution.")+
		_T("Once registered you will get:<ul><li>Access to all the releases and auto update mechanism (not available to non registered users)</li><li>Removal of unregistered welcome message, as well as license message in the footer</li></ul>")+
		"<i>"+_T("Resellers or Integrators are welcome to contact me for eventual commercial agreements.")+"</i>"
		)
		html +="<span class='col-xs-12'><hr>{0}</span>".format( UIManager.getPayPalButtonHtml() );
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

		UIManager.clearPage(_T('Evolutions'),_T("Evolutions"),UIManager.oneColumnLayout);		
		
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
				if (ALTUI_registered==true)
					html += "<li><a href='https://github.com/amg0/ALTUI/releases/tag/{0}'>See in <span class='text-info'>GitHub</span></a></li>".format(v)
				html += "</ul>";
				return html;
			};
			if ($.isArray( data )==false)
				data = JSON.parse(data);
			var panels = [];
			$.each(data, function(idx,version) {
				panels.push( {id: version.v , title: "V "+version.v, html: _displayFeatures(version.v,version.features) } );
			});
			var html = HTMLUtils.createAccordeon('altui-evolutions',panels );
			$(".altui-mainpanel").append(html);
		})
		.fail( function( jqxhr, textStatus, errorThrown  ) {
			$(".altui-mainpanel").append("<pre>{0}</pre>".format( JSON.stringify(jqxhr) ));
		});
	},
	
	pageCredits: function ()
	{
		UIManager.clearPage(_T('Credits'),_T("Credits"),UIManager.twoColumnLayout);
		$("#altui-pagemessage").remove();
		var tbl = [
			["GetVera","http://getvera.com/","the zWave Getaway and backend platform"],
			["Bootstrap","http://getbootstrap.com/","set of css and javascript components for responsive design user interfaces"],
			["jQuery","http://jquery.com/","javascript framework and browser differences abstraction layer"],
			["jQueryUI","http://jqueryui.com/","jQuery User Interface widgets ( like slider )"],
			["Touch Punch","http://touchpunch.furf.com/","jQuery UI fix for touch screen devices"],
			["Bootstrap Validator","https://github.com/1000hz/bootstrap-validator","Form validator in Bootstrap 3 style"],
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
			["amg0","http://forum.micasaverde.com/","reachable as amg0 on this forum "]
		];
		
		var html = "";
		html += "<nav>"
		html += "<ul class='nav nav-pills nav-stacked' data-spy='affix'>";
        // <li class='active'><a href='#section1'>Section 1</a></li>
		$.each(tbl, function (idx,line) {
			html += "<li><a href='#{0}'>{1}</a></li>".format(line[0].replace(' ','_'),line[0])
		});
		html += "</ul>"
		html += "</nav>"
		$(".altui-leftnav").append( html );
		
		html = "";
		html += "<dl>";
		$.each(tbl, function (idx,line) {
			html +="<dt id='{0}'>{1}</dt>".format(line[0].replace(' ','_'),line[0]);
			html +="<dd>{0}</dd>(<a href='{1}'>{1}</a>)<hr>".format(line[2],line[1]);
		});
		html +="</dl>";

		$(".altui-mainpanel").append(html);
		
		$(".altui-leftnav a").on('click', function(e) {
		   // prevent default anchor click behavior
		   e.preventDefault();

		   // store hash
		   var hash = $(this).attr("href");

		   // animate
		   $('html, body').animate({
			   scrollTop: $(hash).offset().top - $('.navbar-fixed-top').height()
			 }, 300, function(){

			   // when done, add hash to url
			   // (default click behaviour)
			   window.location.hash = hash;
			 });

		   // Highlight
		   $("dt").removeClass("bg-warning");
		   $(hash).addClass("bg-warning");
		});
	},
	
	pageEditorForm: function (domparent, htmlid, title,txt,outputarea,button,onClickCB) {
		var _tools= [
			{id:'altui-copy-clipboard-'+htmlid,  glyph:"glyphicon-copy", label:_T("Copy")},
			{id:'altui-top-'+htmlid, glyph:"glyphicon-fast-backward", label:_T("Top")},
			{id:'altui-pageup-'+htmlid, glyph:"glyphicon-step-backward", label:_T("Page Up")},
			{id:'altui-pagedown-'+htmlid, glyph:"glyphicon-step-forward", label:_T("Page Down")},
			{id:'altui-bottom-'+htmlid, glyph:"glyphicon-fast-forward", label:_T("Bottom")},
		];
		// var copybutton = buttonTemplate.format( 'altui-copy-clipboard-'+htmlid, 'altui-copy-clipboard', glyph,'default',_T("Copy"));
		var html = "";
		html +="<form class='altui-editor-form col-sm-11' role='form' action='javascript:void(0);'>";
		html +="  <div class='form-group'>";
		html +="    <label for='altui-editor-text'>"+title+":</label>"
		html += HTMLUtils.drawToolbar(htmlid+'-toolbar',_tools);
		html +="    <div id='altui-editor-text'>"+txt.htmlEncode()+"</div>";
		html +="  </div>";
		if (outputarea!=null) {
			var glyph = glyphTemplate.format('copy',_T("Copy to clipboard"), '');
			html +="  <div class='form-group'>";
			html +="    <label for='altui-editor-result'>"+_T("Return Result")+":</label>";
			html +=  buttonTemplate.format( 'altui-copyresult-clipboard-'+htmlid, 'altui-copy-clipboard', glyph,'default',_T("Copy"));
			html +="    <pre id='altui-editor-result'></pre>";
			html +="  </div>";			
			html +="  <div class='form-group'>";
			html +="    <label for='altui-editor-output'>"+_T("Console Output")+":</label>";
			html +=  buttonTemplate.format( 'altui-copyoutput-clipboard-'+htmlid, 'altui-copy-clipboard', glyph,'default',_T("Copy"));
			html +="    <pre id='altui-editor-output'></pre>";
			html +="  </div>";			
		}
		html +=("  <button id='altui-luaform-button-"+htmlid+"' type='submit' class='btn btn-default'>"+button+"</button>");
		html +="</form>";
		domparent.append(html);
		
		// ACE
		var editor = ace.edit( "altui-editor-text" );
		editor.setTheme( "ace/theme/"+ (MyLocalStorage.getSettings("EditorTheme") || "monokai") );
		editor.setFontSize( MyLocalStorage.getSettings("EditorFontSize") );
		editor.getSession().setMode( "ace/mode/lua" );
				
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
			onClickCB(code,$(this));
		});
	},
	
	pageEditor: function (filename,txt,button,cbfunc)
	{
		UIManager.clearPage(_T('Editor'), filename,UIManager.oneColumnLayout);
		$(".altui-mainpanel").append("<p> </p>");
		UIManager.pageEditorForm($(".altui-mainpanel"),'altui-page-editor',filename,txt,null,button,function(newtxt) {
			if ($.isFunction(cbfunc)) 
				cbfunc(newtxt);
		});
	},
	
	pageLuaTest: function ()
	{
		UIManager.clearPage(_T('LuaTest'),_T("Lua Code Test"),UIManager.oneColumnLayout);
		$(".altui-mainpanel").append("<div class='col-xs-12'><p>"+_T("This test code will succeed if it is syntactically correct. It must be the body of a function and can return something. The return object and console output will be displayed)")+"</p></div>");
		var lastOne = MyLocalStorage.getSettings("LastOne_LuaTest") || "return true";
		UIManager.pageEditorForm($(".altui-mainpanel"),'altui-page-editor',_T("Lua Test Code"),lastOne,true,_T("Submit"),function(lua) {
			MyLocalStorage.setSettings("LastOne_LuaTest",lua);
			MultiBox.runLua(0,lua, function(res) {
				res = $.extend({success:false, result:"",output:""},res);
				$("#altui-editor-result").text(res.result);
				$("#altui-editor-output").text(res.output);
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
			{label:_T("Disk Usage"), command:'du -h' },
			{label:_T("Free Space"), command:'df -h' },
			{label:_T("Plugin Files"), command:'ls -l /etc/cmh-ludl' },
			{label:_T("Log Sizes"), command:'ls -l /var/log/cmh' },
			{label:_T("Errors Warnings"), command:"cat /var/log/cmh/LuaUPnP.log | grep 'warning:\|error:'" },
			{label:_T("Search Logs"), command:"cat /var/log/cmh/LuaUPnP.log | grep '{0}'" },
			{label:_T("Tail Logs"), command:"tail -n 50 /var/log/cmh/LuaUPnP.log" },
			{label:_T("Find Json"), command:"find / -name *json*.lua" }
		];
		var commands = MyLocalStorage.getSettings("OsCommands") || defaultCommands;
		var actions = [
			{ name:'delete', glyph:deleteGlyph }
		];
		function _drawFrequentCommandBar(commands) {
			var html="";
			html+="  <div id='altui-frequent-commands-bar' class='form-group'>";
			html+="    <label for='altui-btngroup'>"+_T("Frequent Commands")+editButtonHtml+"</label>";
			html+="  	<div class='btn-group' id='altui-btngroup'>";
			$.each(commands, function(idx,obj) {
				html += "<button id='{0}' type='button' class='btn btn-default altui-oscommand-button' data-cmd='{2}' '>{1}</button>".format(idx,obj.label,obj.command.replace(/'/g, '&quot;'));
			});
			html+="  	</div>";
			html+="  </div>";
			return html;
		};
		function _drawCommandTable(commands) {
			var html="";
			html+= "<table class='table table-condensed altui-oscommand-configtbl'>";
			html+= "    <thead>";
			html+= "      <tr>";
			html+= "<th>"+_T("Actions")+"</th>";
			$.each(defaultCommands[0] ,function(key,val) {
				html+= "<th>"+_T(key)+"</th>";
			})
			html+= "      </tr>";
			html+= "    </thead>";
			html+= "    <tbody>";
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
			html+= "    </tbody>";
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
		
		UIManager.clearPage(_T('OsCommand'),_T("OS Command"),UIManager.oneColumnLayout);
		
		var editButtonHtml = buttonTemplate.format( 'altui-editoscmd-0', 'altui-editoscmd', editGlyph,'default',"");

		var html = "";
		html+="<div class='col-xs-12'><form>";
		html+=	"<p>"+_T("Enter a Vera OS ( Unix ) command, the stdout will be returned and displayed below")+"</p>";
		html += _drawFrequentCommandBar(commands);
		html += _createControllerSelect('altui-controller-select');
		html+="  <div class='form-group'>";
		html+="    <label for='oscommand'>"+_T("OS Command")+"</label>";
		html+="    <input type='text' class='form-control' id='oscommand' placeholder='Type your OS command like: df '>";
		html+="  </div>";
		html+="</form>";
		html+="<button type='button' id='altui-oscommand-exec-button' class='btn btn-default'>"+_T("Run")+"</button>";
		html+="<hr>";
		html+="<h3>"+_T("Output")+"</h3>";
		html+="<pre id='altui-oscommand-result' class='pre-scrollable'></pre>";
		html+="</div>";
		$(".altui-mainpanel").append( html );

		$(".altui-mainpanel").on("click",".altui-oscommand-button",function(e){ 
			// e.stopPropagation();
			var val = $(this).data("cmd");
			$("#oscommand").val( val );
			setTimeout( function() { $("#altui-oscommand-exec-button").click() } ,100 );
		});
		
		$(".altui-mainpanel").on("click","#altui-oscommand-exec-button",function(e){ 
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
								"<form></form>",				// body
								"modal-lg"		// size
							));
				var lastOne = MyLocalStorage.getSettings("LastOne_"+'param0') || "";
				DialogManager.dlgAddLine(dialog, 'param0', _T('Parameter'), lastOne,"", {required:''} );
				DialogManager.dlgAddDialogButton(dialog, true, _T("Run"));
				$('div#dialogModal').modal();
				$('div#dialogs')
					.off('submit',"div#dialogModal")
					.on( 'submit',"div#dialogModal", function() {
							$('div#dialogModal').modal('hide');
							var val = $("#altui-widget-param0").val();
							MyLocalStorage.setSettings("LastOne_"+'param0'+name,val);
							oscmd = oscmd.format( val );
							$("#oscommand").val( oscmd );
							setTimeout(function() {
								_execCmd(oscmd);
							}, 300 );
						});
			}
			else
				_execCmd(oscmd);
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

		UIManager.clearPage(_T('LuaStart'),_T("Lua Startup"),UIManager.oneColumnLayout);
		
		// DOES NOT WORK on other ctrl as the url gets too long
		
		$(".altui-mainpanel").append( _createControllerSelect('altui-controller-select'));
		$("#altui-controller-select").change(function(){
			$(".altui-editor-form").remove();
			_prepareUI( parseInt($("#altui-controller-select").val()) );
		});
		_prepareUI( 0 );
	},
	
	pagePower: function() 
	{
		UIManager.clearPage(_T('Power'),_T("Power Chart"),UIManager.oneColumnLayout);
		
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
				var x = d3.scale.linear()
						.range([0, width])
						.domain([0, d3.max(data, function(d) { return +d[4]; })]);	// d[4] is watts and is text, must convert to int
						
				var xAxis = d3.svg.axis()
					.scale(x)
					.orient("top");
					
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
					
				var x = d3.scale.linear()
						.range([0, width])
						.domain([0, d3.max(data, function(d) { return +d[4]; })]);	// d[4] is watts and is text, must convert to int
						
				var xAxis = d3.svg.axis()
					.scale(x)
					.orient("top");
					
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
		var data = $.grep( MultiBox.getDevicesSync() , function(d) {return /*(MultiBox.controllerOf(d.altuiid).controller==0) &&*/ (d.id_parent==1);} );
		orders = {
			id:$.map( data.sort(function(a, b){return parseInt(a.id)-parseInt(b.id)}), function(d) { return d.altuiid; }),
			name: $.map( data.sort( sortByName ), function(d) { return d.altuiid; }),
			mesh:$.map( data.sort(function(a, b){return _countNeighbors(b)-_countNeighbors(a)}), function(d) { return d.altuiid; })
		};

		UIManager.clearPage(_T('ZWave'),_T("zWave Network"),UIManager.oneColumnLayout);
		// $("div#dialogs").append(deviceModalTemplate.format( '', '', 0 ));
		DialogManager.registerDialog('deviceModal',deviceModalTemplate.format( '', '', 0 ));
		var html = "";
		html += "<form class='form-inline'>";
			html += "<div class='form-group'>";
				html += "<label class='control-label ' for='altui-zwavechart-order' >"+_T("Order By")+":</label>";
				html += "<select id='altui-zwavechart-order' class='form-control'>";
					html += "<option value='id'>ID</option>";
					html += "<option value='name'>"+_T("Name")+"</option>";
					html += "<option value='mesh'>"+_T("Mesh")+"</option>";
				html += "</select>";
			html += "</div>";
			html += ("<button type='button' id='altui-reset-pollcounters' class='btn btn-default' >"+_T("Reset Poll Counters")+"</button>");
			html += "<div class='form-group altui-quality-color'></div><span class=''>: {0}</span>".format(_T("Poll Success Rate"))
			html += "<div class='form-group altui-quality-grey'></div><span class=''>: {0}</span>".format(_T("No Poll"))
		html += "</form>";
			html += "<div class='altui-zwavechart-container'>";
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
					}							\
				</style>"
			);

		function _drawChart( chart, width, height, orderby  ) {	
			var x = d3.scale.ordinal()
				.domain( orders[orderby] )
				.rangeBands([0, width]);

			var y = d3.scale.ordinal()
				.domain( orders[orderby] )
				.rangeBands([0, height]);
			
			var c = d3.scale.quantize()
				.domain( [0,1] )
				.range(["red","orange","yellow","yellowgreen","green"]);

			var row = chart.selectAll(".ligne").data(data);
			row.enter()
				.append("g")
					.attr("class","ligne")
					.attr("transform",function(d,i) { return "translate(0,"+y(d.altuiid)+")"; } )
					.append("text")
					  .attr("x", -6)
					  .attr("y", x.rangeBand() / 2)
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
			row.exit()
				.remove();
				
			var cell = row.selectAll(".cellule")
				.data( function(d)  { 
					return _NeighborsOf(d); 
					} );
				
			cell.enter()
				.append("rect")
					.attr("class","cellule")
					.attr("x", function(d) {
							return x(d); 
							// return x(d.id); 
							} )
					.attr("width",x.rangeBand())
					.attr("height",y.rangeBand())
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
			
			var col = chart.selectAll(".colonne").data(data);
			col.enter()
				.append("g")
					.attr("class","colonne")
					.attr("transform",function(d,i) { return "translate("+x(d.altuiid)+",0) rotate(-90)"; } )
					.append("text")
					  .attr("x", 6)
					  .attr("y", x.rangeBand() / 2)
					  .attr("dy", ".32em")
					  .attr("text-anchor", "start")
					  .text(function(d) { return _nodename(d); });

			col.append("line")
				.attr("x1", -width);
				
			col.exit().remove();
		};
		
		
		function _drawzWavechart()
		{
			$(".d3chart").replaceWith("<svg class='d3chart'></svg>");
			var available_height = $(window).height() - $("#altui-pagemessage").outerHeight() - $("#altui-pagetitle").outerHeight() - $("#altui-zwavechart-order").outerHeight() - $("footer").outerHeight();
			var margin = {top: 150, right: 10, bottom: 10, left: 150};
			width = $(".altui-zwavechart-container").innerWidth() - margin.left - margin.right-30;
			height = Math.min(width,available_height - margin.top - margin.bottom);
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
			
			var x = d3.scale.ordinal()
				.domain( orders[orderby] )
				.rangeBands([0, width]);

			var y = d3.scale.ordinal()
				.domain( orders[orderby] )
				.rangeBands([0, height]);
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
	
	pageQuality: function()  {
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
					data = _prepareDataRoutes2(  );
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
				linkcolor = d3.scale.quantize()
					.domain( [d3.max(data.links, function(d) {return d.quality;} ),d3.min(data.links, function(d) {return d.quality;} )] )
					.range(["red","orange","yellow","green"]);

				color = d3.scale.category20();
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
					// .attr("d", function(d) {
						// var M = (d.source.group != d.target.group) ? 0 : (60+Math.abs(d.target.y-d.source.y)/ygap*4);
						// return draw_curve(d.source.x, d.source.y, d.target.x, d.target.y, M);
					// })
					.style("stroke-opacity", 0)
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
					.style("opacity", 0)
					.style("fill", function (d) { return color(d.color); });
					
				groups.append("text")					
					.attr("x", function (d) { return d.x })					
					.attr("y", function (d) { return d.y })
					.attr("dx", 15)
					.attr("dy", ".35em")
					.style("opacity", 0)
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
		
		UIManager.clearPage(_T('Quality'),_T("Network Quality"),UIManager.oneColumnLayout);
		
		$(".altui-mainpanel").append( _createControllerSelect('altui-controller-select'));
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
			.append("<div class='col-xs-12 altui-route-d3chart-container'><svg class='altui-route-d3chart'></svg></div>")
		var available_height = $(window).height() - $("#altui-pagemessage").outerHeight() - $("#altui-pagetitle").outerHeight() - $("#altui-zwavechart-order").outerHeight() - $("footer").outerHeight();
		width = $(".altui-route-d3chart-container").innerWidth() - margin.left - margin.right;
		height = Math.max(300,Math.min(width,available_height - margin.top - margin.bottom));
		UIManager.loadD3Script( function() {
			MultiBox.getDevices(null,function(d) {	return MultiBox.controllerOf(d.altuiid).controller==parseInt($("#altui-controller-select").val()); },function(arr) {
				devices = arr;
				_drawChart();
			})
		});
	},
	
	pageChildren: function() {
		var height = null, width = null;
		var data = { root:[], nodes:[] , links:[] };
		var devices = null;
		
		// Returns a list of all nodes under the root.
		function _flatten(root) {
			var nodes = [], i = 0;
			function recurse(node) {
				if (node.children) node.children.forEach(recurse);
				// if (!node.id) node.id = ++i;
				nodes.push(node);
			}
			recurse(root);
			return nodes;
		};
		
		function _findNode( root, id ) {
			var found=null;
			if (root.id == id )
				return root;
			if (root.children)
				$.each( root.children, function (i,n) {
					found = _findNode( n, id );
					return ( found==null );
				});				
			return found;
		};
		
		function _addChildrenFromWaitList( node) {
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
				_addChildrenFromWaitList( child);
			});
		};
		
		function _addNode( node ) {
			var parent = _findNode( data.root, node.id_parent );
			if (parent==null){	
				// console.log("could not find parent, putting in wait list");
				data.wait.push(node);
				return;
			}
			parent.children.push( node );
			_addChildrenFromWaitList(node);
		};
		
		function _prepareDataParents( ) {
			data = { root:[], nodes:[] , links:[] , wait:[] };
			var color = { "ctrl": 0 };
			var nColor = 1;
			// var devices = $.grep( MultiBox.getDevicesSync() , function(d) {return (MultiBox.controllerOf(d.altuiid).controller==0) } );
			data.root={ id:"0-0", name:"Main Controller", color:color["ctrl"], children:[] };
			$.each( MultiBox.getControllers(), function (idx,c) {
				if (idx>0) {					
					_addNode({ 
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
					_addNode({ 
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
				data.nodes = _flatten(data.root);
				data.links = d3.layout.tree().links(data.nodes);
			};
				
			$(".altui-children-d3chart").replaceWith("<svg class='altui-children-d3chart'></svg>");
			var available_height = $(window).height() - $("#altui-pagemessage").outerHeight() - $("#altui-pagetitle").outerHeight() - $("#altui-zwavechart-order").outerHeight() - $("footer").outerHeight();
			var margin = {top: 20, right: 10, bottom: 10, left: 20};
			width = $(".altui-children-d3chart-container").innerWidth() - margin.left - margin.right-30;
			height = Math.max(300,Math.min(width,available_height - margin.top - margin.bottom));
			
			//Set up the colour scale
			var color = d3.scale.category20();

			var svg = d3.select(".altui-children-d3chart")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				// .style("margin-left", -margin.left + "px")
				.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			//Set up the force layout
			data = _prepareDataParents( );
			var force = d3.layout.force()
						.charge(function(d) { return -120 - (d.children ? 2*d.children.length : 0) } )
						.gravity(0.05)
						.linkDistance(function(d) { return  45+(d.source.children ? 2*d.source.children.length:0 ) })
						.size([width, height])
						.on("tick", function () {
						// avoid asynchronous tick when the user changed the page
						// this crashed d3
						if ($("#altui-pagetitle").html()==_T("Parent/Child Network")) 
						{
							d3.selectAll(".link")
								.attr("x1", function(d) { return d.source.x; })
								.attr("y1", function(d) { return d.source.y; })
								.attr("x2", function(d) { return d.target.x; })
								.attr("y2", function(d) { return d.target.y; });

							d3.selectAll("circle")
								.attr("cx", function (d) { return d.x; })
								.attr("cy", function (d) { return d.y; });
							d3.selectAll("text")
								.attr("x", function (d) { return d.x; })
								.attr("y", function (d) { return d.y; });
						}
					});
			var drag = force.drag().on("dragstart", dragstart);			

			function sglclick(d) {
				if (d3.event.defaultPrevented) return;
				// console.log('click');
				var selection = d3.select(this);
				if (d3.event.shiftKey) {
					d.fixed =  false;
					selection.classed("fixed", false  );
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
					selection.classed("closed", d._children!=null );
				}
				_updateChart(data);
			};
			function dragstart(d) {
				// console.log('dragstart');
				d3.event.sourceEvent.stopPropagation(); // silence other listeners
				d3.select(this).classed("fixed", d.fixed = true);
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
				_updateDataParents();
				force
					.nodes( data.nodes )
					.links( data.links )
					.start();

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
				node.classed("fixed", function(d) { 
						return d.fixed })
					.classed("closed", function(d) { 
						return d._children!=null } );

				var groups = node.enter().append("g")
							.attr("class", "node")
							.classed("fixed", function(d) { return d.fixed } )
							.classed("closed", function(d) { return d._children!=null } )
							// .on("dblclick", dblclick)
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
		UIManager.clearPage(_T('Parent/Child'),_T("Parent/Child Network"),UIManager.oneColumnLayout);
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
			.append(html+"<div class='altui-children-d3chart-container'><svg class='altui-children-d3chart'></svg></div>")
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
		
		// Returns a list of all nodes under the root.
		function _flatten(root) {
			var nodes = [], i = 0;
			function recurse(node) {
				if (node.children) node.children.forEach(recurse);
				// if (!node.id) node.id = ++i;
				nodes.push(node);
			}
			recurse(root);
			return nodes;
		};
		
		function _findNode( root, id ) {
			var found=null;
			if (root.id == id )
				return root;
			if (root.children)
				$.each( root.children, function (i,n) {
					found = _findNode( n, id );
					return ( found==null );
				});				
			return found;
		};
		
		function _addNode( node ) {
			var parent = _findNode( data.root, node.id_parent );
			if (parent==null){	
				PageMessage.message("Error building node hierarchy","warning");
				return;
			}
			parent.children.push( node );
		};
				
		function _drawChartRoutes() {
			function _prepareDataRoutes(  ) {
				data = { root:[], nodes:[] , links:[] };
				var color = {};
				var nColor = 0;
				var devices = $.grep( MultiBox.getDevicesSync() , function(d) {return (MultiBox.controllerOf(d.altuiid).controller==$("#altui-controller-select").val());} );

				data.root={ id:0, zwid:0, name:"root", children:[] };
				if (devices) {
					var zwavenet = MultiBox.getDeviceByType(0,"urn:schemas-micasaverde-com:device:ZWaveNetwork:1");
					if (zwavenet) {
						color[zwavenet.device_type]=nColor++;
						data.nodes.push({ 
							x:width/2,
							y:height/2,
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
				// enum devices and create a link per route  ManualRoute AutoRoute 
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
			var available_height = $(window).height() - $("#altui-pagemessage").outerHeight() - $("#altui-pagetitle").outerHeight() - $("#altui-zwavechart-order").outerHeight() - $("footer").outerHeight();
			var margin = {top: 20, right: 10, bottom: 10, left: 20};
			width = $(".altui-children-d3chart-container").innerWidth() - margin.left - margin.right-30;
			height = Math.max(300,Math.min(width,available_height - margin.top - margin.bottom));
			
			//Set up the colour scale
			var color = d3.scale.category20();
			var linkscale = d3.scale.sqrt().domain([0, 500]).range([80, Math.min(width,height)]);

			var svg = d3.select(".altui-children-d3chart")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				// .style("margin-left", -margin.left + "px")
				.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			//Set up the force layout
			data = _prepareDataRoutes( );
			var force = d3.layout.force()
			force = force
				.charge(function(d) { return (d.zwid==0) ? -300 : -100 } )
				.gravity(0.015)
				.linkDistance(function(d) { 
					var dist = linkscale( d.linkquality );
					return  dist; /*   60+d.linkquality*15; */
					})
				.linkStrength( function(d) { 
					return 1/(1+d.linkquality/10); 
					})
				.size([width, height])
				.on("tick", function () {
					// avoid asynchronous tick when the user changed the page
					// this crashed d3
						d3.selectAll(".link")
							.attr("x1", function(d) { return d.source.x; })
							.attr("y1", function(d) { return d.source.y; })
							.attr("x2", function(d) { return d.target.x; })
							.attr("y2", function(d) { return d.target.y; });

						d3.selectAll("circle")
							.attr("cx", function (d) { return d.x; })
							.attr("cy", function (d) { return d.y; });
						d3.selectAll("text")
							.attr("x", function (d) { return d.x; })
							.attr("y", function (d) { return d.y; });
				});
			var drag = force.drag().on("dragstart", dragstart);			

			function dragstart(d) {
				// console.log('dragstart');
				d3.event.sourceEvent.stopPropagation(); // silence other listeners
				d3.select(this).classed("fixed", d.fixed = true);
			};				
			function sglclick(d) {
				if (d3.event.defaultPrevented) return;
				// console.log('click');
				var selection = d3.select(this);
				if (d3.event.shiftKey) {
					d.fixed =  false;
					selection.classed("fixed", false  );
				}
				else {
				}
				_updateChart(data);
			};
			function _updateChart(data) {			
				_updateDataRoutes(data);
				force
					.nodes( data.nodes )
					.links( data.links )
					.start();

				var link = svg.selectAll(".link");
				var node = svg.selectAll(".node");
				link = link.data( data.links , function(d) { return d.source.id+'-'+d.target.id; } );
				node = node.data( data.nodes , function(d) { return d.id; } );

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
				node.classed("fixed", function(d) { 
						return d.fixed })
					.classed("closed", function(d) { 
						return d._children!=null } );

				var groups = node.enter().append("g")
							.attr("class", "node")
							.classed("fixed", function(d) { return d.fixed } )
							.classed("closed", function(d) { return d._children!=null } )
							// .on("dblclick", dblclick)
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
		UIManager.clearPage(_T('zWaveRoutes'),_T("zWave Routes"),UIManager.oneColumnLayout);
		PageMessage.message(_T("Drag and Drop to fix the position of a node. Simple Click to open or collapse a parent node, Shift Click to free a fixed node"),"info");

		$(".altui-mainpanel").append( _createControllerSelect('altui-controller-select'));
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
			.append("<div class='altui-children-d3chart-container'><svg class='altui-children-d3chart'></svg></div>")
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
		
		$("div.altui-housemode2").click( function() {
			var id = $(this).prop('id');
			var mode = id.substr("altui-mode".length);
			var div = $(this).find(".housemode-countdown");
			$(div).html( (mode==1) ? 3 : MultiBox.getHouseModeSwitchDelay() );
			var interval = setInterval( function(div) {
				var val = parseInt( $(div).html() );
				if (val==1) {
					$(div).html( "" );
					clearInterval(interval);
					UIManager.refreshModes(); // force a refresh now
				} else {
					$(div).html( val-1 );					
				}
			}, 1000, div);
			MultiBox.setHouseMode(mode);
		});

	},
	pageLocalization: function() {
		UIManager.clearPage(_T('Localize'),_T("Localizations"),UIManager.oneColumnLayout);
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
							"<form></form>",				// body
							"modal-lg"		// size
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
					var states  = $.grep( MultiBox.getStatesByAltuiID(device.altuiid),function(state) {
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

		UIManager.clearPage(_T('Debug'),_T("Debug Tools"),UIManager.oneColumnLayout);
		var html = "";
		html += "<div class='col-xs-12'>";
			html +="<div class='panel panel-default'>";
				html +="  <div class='panel-heading'>"+_T("Debug Actions")+"</div>";
				html +="  <div class='panel-body'>";
					$.each(actions, function(idx,action) {
						html +="<div class='btn-group' role='group' aria-label='Debug Tools'>";
						html += "<button class='btn btn-default {1}' type='button' >{0}</button>".format(action.title,action.id);
						html += "</div>";
					});
				html += "</div>";
			html +="  </div>";
		html +="</div>";
		html += "<div class='col-xs-12'>";
			html+="<h3>"+_T("Output");
			var glyph = glyphTemplate.format('save',_T("Copy to clipboard"), '');
			html += buttonTemplate.format( 'altui-debug-clipboard', 'altui-copy-clipboard', glyph,'default',_T("Copy"));
				// html += "<button class='btn btn-default altui-json-viewer' type='button' >{0}</button>".format(_T("Json Viewer"));
			html+="</h3>";
			html+="<pre id='altui-oscommand-result' class='pre-scrollable'></pre>";
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
		UIManager.clearPage(_T('TblWatches'),_T("Table Watches"),UIManager.oneColumnLayout);
		var watches = MultiBox.getWatches( 
			"VariablesToWatch",	// watch type
			null);		// no filter

		var model = {
			domcontainer : $(".altui-mainpanel"),
			data : watches,
			default_viscols: [ 'service','variable'],
			cols: [ 
				{ name:'service', type:'string', identifier:false,  },
				{ name:'variable', type:'string', identifier:false, width:80 },
				{ name:'deviceid', type:'string', formatter:'devicename', identifier:false,  },
				{ name:'sceneid', type:'string', formatter:'scenename', identifier:false,  },
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
			},
			commands: {
				'altui-command-edit': {
					glyph:editGlyph,
					onclick: function(grid,e,row,ident) {
						var scene = MultiBox.getSceneByID(0,row.sceneid);
						UIManager.pageSceneEdit( scene.altuiid );	
					}
				},
				'altui-command-delete': {
					glyph:deleteGlyph,
					onclick: function(grid,e,row,ident) {
						DialogManager.confirmDialog(_T("Are you sure you want to delete scene watch ({0})").format(ident),function(result) {
							if (result==true) {
								// return 	watcha.service == watchb.service && 
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
			default_viscols: [ 'service','variable'],
			cols: [ 
				{ name:'service', type:'string', identifier:false,  },
				{ name:'variable', type:'string', identifier:false, width:80 },
				{ name:'deviceid', type:'string', formatter:'devicename', identifier:false,  },
				{ name:'provider', type:'string', identifier:false, width:100 },
			],
			formatters: {
				"devicename": function(column, row) {
					var device = MultiBox.getDeviceByAltuiID(row.deviceid);
					return device ? "#{1}-{0}".format(device.name,device.altuiid) : "";
				},
			},
			commands: {
				'altui-command-see': {
					glyph:eyeOpenGlyph,
					onclick: function(grid,e,row,ident) {
						UIManager.pageWatchDisplay(e,ident);
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
								// return 	watcha.service == watchb.service && 
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
			{id:"altui-ctrl-backup", glyph:"glyphicon-save", label:_T("Backup Controller")},
			{id:"altui-ctrl-heal", glyph:"glyphicon-heart-empty", label:_T("ZWave Heal")},
			{id:"altui-ctrl-inclusion", glyph:"glyphicon-plus", label:_T("ZWave Inclusion")},
			{id:"altui-ctrl-exclusion", glyph:"glyphicon-minus", label:_T("ZWave Exclusion")},
		];

		function _displayControllerInfo(box_info) {
			$.each(box_info, function(k,v) {
				box_info[k]= HTMLUtils.enhanceValue(v);
			});
			var html ="";
			html += "<div class='altui-ctrl-tools'>{0}</div>".format(HTMLUtils.drawToolbar( 'altui-workflow-toolbar', _buttons ));
			html +=  HTMLUtils.array2Table(_buildArrayFromParams(box_info),null,[],_T("Details"),null,'altui-controller-params');//"<pre class='pre-scrollable'>{0}</pre>".format( JSON.stringify(box_info,null,2) )
			return html;
		};
		
		UIManager.clearPage(_T('TblControllers'),_T("Table Controllers"),UIManager.oneColumnLayout);
		var html="";
		html+="<div>";
		html+="  <ul class='nav nav-tabs' role='tablist'>";
		var controllers = MultiBox.getControllers();
		var bFirst=true;
		$.each(controllers, function( idx, controller) {
			var name  = (controller.ip == "" ) ? "Main" : controller.ip ;
			html+="    <li role='presentation' class='{2}'><a href='#altui_ctrl_{0}' aria-controls='home' role='tab' data-toggle='tab'>{1}</a></li>".format(
				idx,name,
				(bFirst==true ? 'active' : ''));
			bFirst=false;
		});
		html+="  </ul>";
		html+="  <div class='tab-content'>";
		bFirst=true;
		$.each(controllers, function( idx, controller) {
			var name  = (controller.ip == "" ) ? "Main" : controller.ip ;
			html+="    <div role='tabpanel' class='altui-controller-panel tab-pane {2}' id='altui_ctrl_{0}'>{1}</div>".format(
				idx,
				_displayControllerInfo(controller.box_info),
				(bFirst==true ? 'active' : ''));
			bFirst=false;
		});
		html+="  </div>";
		html+="</div>";
		$(".altui-mainpanel").append( html );
		
		// interactivity
		$("#altui-ctrl-backup").click(function() {
			var panel = $(this).closest('.altui-controller-panel');
			var id = $(panel).prop('id').substring('altui_ctrl_'.length);
			MultiBox.RequestBackup( id, function(data) {
				PageMessage.message(_T("Backup competed"));
			});
		});
		$("#altui-ctrl-heal").click(function() {
			var panel = $(this).closest('.altui-controller-panel');
			var id = $(panel).prop('id').substring('altui_ctrl_'.length);
			var zwavenet = MultiBox.getDeviceByType(id,"urn:schemas-micasaverde-com:device:ZWaveNetwork:1");
			if (zwavenet!=null) {
				DialogManager.confirmDialog(_T("Are you sure you want to heal your zwave network"),function(result) {
					if (result==true) {
						// local URN  = "urn:micasaverde-com:serviceId:ZWaveNetwork1"
						// local ACT  = "HealNetwork"
						// local BATT = {BatteryMinutes=30}  -- Default 30. Nightly 60.
						// local ITR  = {StressCycles=2}     -- Default probably ample.
						// local START= {StartStage=1}       
						// local STOP = {StopStage=3}        -- Default 7. UI7.10 or greater probably needs to go no further than 3.
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
			var panel = $(this).closest('.altui-controller-panel');
			var id = $(panel).prop('id').substring('altui_ctrl_'.length);
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
			var panel = $(this).closest('.altui-controller-panel');
			var id = $(panel).prop('id').substring('altui_ctrl_'.length);
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
		UIManager.clearPage(_T('TblScenes'),_T("Table Scenes"),UIManager.oneColumnLayout);
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
					{ name:'next_run', type:'numeric', computer:'next_run',  formatter:'HTMLUtils.enhanceValue', identifier:false, width:150 },
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
							UIManager.pageSceneEdit(ident);
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
		// UIManager.clearPage(_T('Triggers'),_T('Triggers'),UIManager.oneColumnLayout);
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
		UIManager.clearPage(_T('Triggers'),_T('Triggers'),UIManager.oneColumnLayout);
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
		html+="<div class='col-xs-12'>";
		html+=("<table id='"+htmlid+"' class='altui-grid table table-condensed table-hover table-striped'>");
		html+="    <thead>";
		html+="    <tr>";

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
							cmds += "<button type=\"button\" class=\"btn btn-xs btn-default {0}\" data-row-id=\"{2}\">{1}</button>".format(
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
		html+="    </tr>";
		html+="    </thead>";
		html+="    <tbody>";
		$.each(model.data, function(idx, obj) {
			html+="    <tr>";
			$.each(model.cols, function(i,col) {
				var value = (col.computer && $.isFunction(model.computers[col.computer])) ? model.computers[col.computer](obj) : (obj[col.name] || '')
				html += "<td>{0}</td>".format( value );
			});
			if (model.commands)
				html += "<td></td>";	// commands
			html+="    </tr>";
		});
		html+="    </tbody>";
		html+="</table>";
		html+="</div>";
		html+="<div id='altui-aftertable-"+htmlid+"' class='col-xs-12'>";
		html+="</div>";
		
		(model.domcontainer).append( html );
		
		var options = (MyLocalStorage.getSettings('ShowAllRows')==1) ? {rowCount:-1	} : {};
		var id = htmlid;
		var grid = $("#"+htmlid).bootgrid(
			$.extend({
				caseSensitive: false,
				statusMapping: {},
				formatters: model.formatters || {}
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
		});	
		
		// Add CSV export button
		var glyph = glyphTemplate.format('save',_T("Copy to clipboard"), '');
		var csvButtonHtml = buttonTemplate.format( 'altui-grid-btn-'+htmlid, 'altui-tbl2csv', glyph,'default');
		$('#'+htmlid+'-header').find('.actions.btn-group').append(csvButtonHtml);
		$("#altui-grid-btn-"+htmlid).click( function() {
			if ($('#altui-aftertable-'+htmlid).find('form').length==0) {
				$("#"+htmlid).table2CSV({
					delivery : function(data) {
						$(".altui-mainpanel").append("<pre id='altui-temp-txt'>{0}</pre>".format(data));
						Altui_SelectText( "altui-temp-txt" );
						document.execCommand('copy');
						$("#altui-temp-txt").remove();
						PageMessage.message( _T("Data copied in clipboard"), "info");
					}
				});
			}
		});
	},
	
	pageTblDevices : function() {
		UIManager.clearPage(_T('TblDevices'),_T("Table Devices"),UIManager.oneColumnLayout);

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
						{ name:'altid', type:'string', identifier:false, width:50 },
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
								UIManager.pageControlPanel(ident);	
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
				url:'no url',
				height:null
			}
		};
		function _displayWatchGraph(idx,model,force) {
			if ( (force==true) || ($("span#altui-watch-placeholder-"+idx).text() =="loading..." ) ) {
				var watch = model.watches[idx];
				var html = "";
				html += "<div class='col-xs-12'>";
					html += "<iframe id='altui-iframe-chart-{2}' class='altui-thingspeak-chart' data-idx='{1}'  width='100%' height='{3}' style='border: 1px solid #cccccc;' src='{0}' ></iframe>".format(watch.url,idx,idx,watch.height);
				html += "</div>";
				$("span#altui-watch-placeholder-"+idx).html(html);
			}
		};
		function _displayWatchList(domparent, model) {
			function _lastPart(service) {
				var splits = service.split(":");
				return splits[ splits.length-1 ];
			}
			var model = model;
			var panels = [
				// {id:'Header', title:_T("Header"), html:_displayHeader()},
				// {id:'Triggers', title:_T("Triggers"), html:_displayTriggersAndWatches()},
				// {id:'Timers', title:_T("Timers"), html:_displayTimers()},
				// {id:'Lua', title:_T("Lua"), html:_displayLua()},
				// {id:'Actions', title:_T("Actions"), html:_displayActions()},
			];
			$.each(model.watches, function(idx,watch) {
				var html = "";
				html += "<div class='col-xs-12'>";
					html += "<iframe id='altui-iframe-chart-{2}' class='altui-thingspeak-chart' data-idx='{1}'  width='100%' height='{3}' style='border: 1px solid #cccccc;' src='{0}' ></iframe>".format(watch.url,idx,idx,watch.height);
				html += "</div>";
				
				panels.push({
						id:'watchidx_'+idx, 
						title:"<span>{0} - {1} - <small title='{3}'>{2}</small></span>".format(watch.devicename,watch.variable,_lastPart(watch.service),watch.service),
						html: "<span id='altui-watch-placeholder-"+idx+"'>loading...</span>"
				});
			});
			'glyphicon-refresh'
			var refreshbutton = {id:'', class:'altui-graph-refresh pull-right', label:refreshGlyph+' '+_T('Refresh'), title:'refresh' };
			var html = HTMLUtils.createAccordeon('altui-graph-accordion',panels,refreshbutton);	
			$(domparent).append(html);

			// ACE
			// var editor = ace.edit( "altui-luascene" );
			// editor.setTheme( "ace/theme/"+ (MyLocalStorage.getSettings("EditorTheme") || "monokai") );
			// editor.getSession().setMode( "ace/mode/lua" );
			// editor.setFontSize( MyLocalStorage.getSettings("EditorFontSize") );
					
			_displayWatchGraph(0,model);
			$('.panel').on('shown.bs.collapse', function (e) {
				e.stopPropagation();
				var idx = parseInt(e.currentTarget.id.substring("watchidx_".length));
				_displayWatchGraph(idx,model);
			});
			$('.altui-graph-refresh').click( function() {
				var panel = $(this).parent().parent()
				var id = $(panel).prop('id').substr("watchidx_".length);
				// var placeholder = $(panel).find("span#altui-watch-placeholder-"+id);
				_displayWatchGraph(id,model,true);
			})
			
		}

		UIManager.clearPage(_T('WatchDisplay'),_T("Watch Display"),UIManager.oneColumnLayout);
		MultiBox.getDataProviders(function(providers) {
			var model={
				watches:[]
			};
			$.each(MultiBox.getWatches("VariablesToSend",
				function(w,i) {
					return (watchidx==null) || (watchidx==i);
				} ), 
				function(idx,watch) {
					var device = MultiBox.getDeviceByAltuiID(watch.deviceid);
					if (device && providers[watch.provider] ) {
						var urlinfo = _buildWatchUrl(watch,providers[watch.provider]);
						model.watches.push( {
							service:watch.service,
							variable:watch.variable,
							devicename: device.name, 
							url:urlinfo.url,
							height:urlinfo.height || 260
						})
					}
				}
			);
			
			_displayWatchList($(".altui-mainpanel"),model);
		});
	},
	pageThemes: function() {
		UIManager.clearPage(_T('Themes'),_T("Themes"),UIManager.oneColumnLayout);
		PageMessage.message( "Select a theme by clicking on it and refresh your browser", "info");
		var resetButton = buttonTemplate.format( "altui-theme-reset", 'btn-default', _T("Reset"),"default",_T('Reset Theme Override'));
		var html = "";
		html += "<div class='col-xs-12'>";
		html +="<div class='panel panel-default'>";
		html +="  <div class='panel-heading'>"+_T("Themes")+" Bootswatch.com "+resetButton+"</div>";
		html +="  <div class='panel-body'>";
		html += "<div id='altui-themes' class='row'>";
		html +="</div>"; 	//row
		html +="</div>";	//body
		html +="</div>";	//panel
		html +="</div>";	//col-xs-12
		$(".altui-mainpanel").append(html);
		$.getJSON( "https://bootswatch.com/api/3.json", function( data ) {
			$.each(data.themes,function(idx,theme) {
				var html ="";
				html += "<div class='altui-theme-thumbnail col-xs-6 col-md-4 col-lg-3' data-preview='{1}' data-href='{0}'>".format(theme.cssCdn,theme.preview);
				html += "<label class='altui-theme-label'>{0} {1}</label>".format(
					theme.description,
					xsbuttonTemplate.format( '', 'altui-theme-preview', "<span class='glyphicon glyphicon-eye-open' aria-hidden='true'></span>",_T('Preview'))
					);
				html += "<img width='100%' src='{0}'></img>".format(theme.thumbnail);
				html +="</div>";	//col-xs-12
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
			UIManager.setTheme(null);
		});
	},	
	pageCheckUpdate:function() {
		UIManager.refreshFooter( true );
	},
	pageOptions: function() {
		function _displayOption(id,check) {
			var html="";
			var init =  (MyLocalStorage.getSettings(check.id)!=null) ? MyLocalStorage.getSettings(check.id) : check._default;
			switch( check.type ) {
				case 'select':
					html +="<label title='"+_T(check.help)+"' class='' for='altui-"+check.id+"'>"+_T(check.label)+"</label> : ";
					html +="<select id='altui-"+check.id+"' title='"+check.id+"'>";
					$.each(check.choices.split("|"),function(id,unit){
						html += "<option value='{0}' {1}>{0}</option>".format( unit , (unit==init) ? 'selected' : '' );	
					})
					html +="</select>";
					$(".altui-mainpanel").on("change","#altui-"+check.id,function(){ 
						_saveOption(check.id, $("#altui-"+check.id).val());
					});
					break;
				case 'checkbox':
					html +="<label title='"+_T(check.help)+"' class='checkbox-inline'>";
					html +=("  <input type='checkbox' id='altui-"+check.id+"' " + ( (init==true) ? 'checked' : '') +" value='"+init+"' title='"+check.id+"'>"+_T(check.label));
					html +="</label>";
					$(".altui-mainpanel").on("click","#altui-"+check.id,function(){ 
						_saveOption(check.id,$("#altui-"+check.id).is(':checked'));
					});
					break;
				case 'number':
					html +="<label title='"+_T(check.help)+"' class='' for='altui-"+check.id+"'>"+_T(check.label)+"</label>:";
					html +=("<input type='number' min='"+(check.min||0) +"' max='"+(check.max||999) +"' id='altui-"+check.id+"' " + ( (init==true) ? 'checked' : '') +" value='"+init+"' title='"+check.id+"'>");
					$(".altui-mainpanel").on("focusout","#altui-"+check.id,function(){ 
					$("#altui-"+check.id).is(':checked')
						_saveOption(check.id,parseInt($("#altui-"+check.id).val()));
					});
					break;
			}
			var helpbutton = xsbuttonTemplate.format( id, 'altui-help-button',  glyphTemplate.format("question-sign","",""), _T(check.id+":"+check.help));
			html+=helpbutton;
			return html;
		};
		function _saveOption(name,value) {
			MyLocalStorage.setSettings(name, value);
			
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
		};
		UIManager.clearPage(_T('Options'),_T("Options"),UIManager.oneColumnLayout);

		var color = IconDB.isDB() ? "text-success" : "text-danger";
		var okGlyph = glyphTemplate.format( "ok-sign", "OK" , color );
		
		color = FileDB.isDB() ? "text-success" : "text-danger";
		var okGlyph2 = glyphTemplate.format( "ok-sign", "OK" , color );
		
		color = MultiBox.isUserDataCached(0) ? "text-success" : "text-danger";
		var okGlyph3 = glyphTemplate.format( "ok-sign", "OK" , color );
		
		color =  MyLocalStorage.get("Pages")!=null ? "text-success" : "text-danger";
		var okGlyph4 = glyphTemplate.format( "ok-sign", "OK" , color );
		
		var html = "";
		
		html +="<div class='col-xs-12'>";
		html +=" <div class='panel panel-default'>";
		html +="  <div class='panel-heading'>"+_T("Options")+"</div>";
		html +="  <div class='panel-body'>";
		html += "  <div class='row'>";
			$.each(_checkOptions, function(id,check) {
				if (check.hidden!=true) {
					html += "<div class='col-sm-6'>";
					html += _displayOption(id,check);
					html += "</div>";
				}
			});		
		html +="   </div>";
		html +="  </div>";
		html +=" </div>";
		html +="</div>";

		//http://api.github.com/repos/ajaxorg/ace/contents/lib/ace/theme		
		html += "<div class='col-xs-12'>";
			html +="<div class='panel panel-default'>";
				html +="  <div class='panel-heading'>"+_T("Editor Control")+"</div>";
				html +="  <div class='panel-body'>";
					html += "<div class='row'>";
						html += "<div class='col-sm-4'>";
							html +="<label title='"+_T("Editor Theme")+"' class='' for='altui-ace-theme'>"+_T("Editor Theme")+"</label> :"
							html +="<select class='form-control' id='altui-ace-theme' title='"+_T("Editor Theme")+"'>";
							html +="</select>";
							$.each(_editorOptions, function(id,check) {
								html += _displayOption(id,check);
							});		
						html += "</div>";
						html += "<div class='col-sm-8'>";
							html += "<div id='altui-editor-sample'>--- Comment sample\nlocal var = 1234\nlocal var2 = { \"abc\", tonumber(4), \"def\", 565 }\nfunction test(a)\n\tlocal i = \"Hello World of ALTUI\"\n\treturn i\nend</div>";
						html += "</div>";
					html += "</div>";
					// <button id='9' type='button' class='altui-help-button btn btn-default btn-xs' aria-label='tbd' title='Unit for temperature'><span class='glyphicon glyphicon-question-sign ' aria-hidden='true' data-toggle='tooltip' data-placement='bottom' title=''></span></button>
				html += "</div>";
			html +="</div>";
		html +="</div>";

		html += "<div class='col-xs-12'>";
			html +="<div class='panel panel-default'>";
			html +="  <div class='panel-heading'>"+_T("Cache Control")+"</div>";
				html +="  <div class='panel-body'>";
					html +="<div class='btn-group' role='group' aria-label='Icon DB'>";
						html += "<button class='btn btn-default altui-save-IconDB' type='submit'>"+saveGlyph+" Save Icon DB</button>";
						html += "<button class='btn btn-default altui-clear-IconDB' type='submit'>"+okGlyph+" Clear Icon DB</button>";
					html += "</div>";
					html += "<div class='btn-group' role='group' aria-label='File DB'>";
						html += "<button class='btn btn-default altui-save-FileDB' type='submit'>"+saveGlyph+" Save File DB</button>";
						html += "<button class='btn btn-default altui-clear-FileDB' type='submit'>"+okGlyph2+" Clear File DB</button>";
					html += "</div>";
					html += "<div class='btn-group' role='group' aria-label='User Data DB'>";
						html += "<button class='btn btn-default altui-save-userdata' type='submit'>"+saveGlyph+"Save UserData</button>";
						html += "<button class='btn btn-default altui-clear-userdata' type='submit'>"+okGlyph3+" Clear UserData</button>";
					html += "</div>";
				html += "</div>";
			html +="</div>";
		html +="</div>";
		
		html += "<div class='col-xs-12'>";
		html +="<div class='panel panel-default'>";
		html +="  <div class='panel-heading'>"+_T("Custom Pages Control")+"</div>";
		html +="  <div class='panel-body'>";
			html += "<div class='btn-group' role='group' aria-label='User Pages DB'>";
			html += "<button class='btn btn-default altui-save-userpage' type='submit'>"+saveGlyph+"Save User Pages</button>";
			html += "<button class='btn btn-default altui-restore-userpage' type='submit'>"+loadGlyph+"Restore From User Pages Cache</button>";
			html += "<button class='btn btn-default altui-clear-userpage' type='submit'>"+okGlyph4+" Clear User Pages Cache</button>";
			html += "</div>";
		html += "</div>";
		html +="  </div>";
		html +="</div>";

		$(".altui-mainpanel").append(html);
		// ACE
		var editor = ace.edit( "altui-editor-sample" );
		editor.getSession().setMode( "ace/mode/lua" );
		var init =  MyLocalStorage.getSettings("EditorTheme") || "monokai";
		editor.setTheme( "ace/theme/"+init );
		editor.setFontSize( MyLocalStorage.getSettings("EditorFontSize") );
		
		// NOTE : does not work, as we have to logged on to github for this api to work
		// $.getJSON("http://api.github.com/repos/ajaxorg/ace/contents/lib/ace/theme", function(themes){
		var themes=["ambiance.css", "chaos.css", "chrome.css", "clouds.css", "clouds_midnight.css", "cobalt.css", "crimson_editor.css", "dawn.css", "dreamweaver.css", "eclipse.css", "github.css", "gruvbox.css", "idle_fingers.css", "iplastic.css", "katzenmilch.css", "kr_theme.css", "kuroir.css", "merbivore.css", "merbivore_soft.css", "mono_industrial.css", "monokai.css", "pastel_on_dark.css", "solarized_dark.css", "solarized_light.css", "sqlserver.css", "terminal.css", "textmate.css", "tomorrow.css", "tomorrow_night.css", "tomorrow_night_blue.css", "tomorrow_night_bright.css", "tomorrow_night_eighties.css", "twilight.css", "vibrant_ink.css", "xcode.css"];			var init =  MyLocalStorage.getSettings("EditorTheme") || "monokai";
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
		$(".altui-help-button").click( function() {
			var help = $(this).attr("title").split(':'); 
			DialogManager.infoDialog(help[0],_T(help[1]));
		});
		
		$(".altui-save-IconDB").click( function() {
			IconDB.saveDB();
			UIManager.pageOptions();
		});
		$(".altui-clear-IconDB").click( function() {
			IconDB.resetDB();
			UIManager.pageOptions();
		});
		$(".altui-save-FileDB").click( function() {
			FileDB.saveDB();
			UIManager.pageOptions();
		});
		$(".altui-clear-FileDB").click( function() {
			FileDB.resetDB();
			UIManager.pageOptions();
		});
		$(".altui-save-userdata").click( function() {
			MultiBox.saveEngine();
			UIManager.pageOptions();
		});
		$(".altui-clear-userdata").click( function() {
			MultiBox.clearEngine();
			UIManager.pageOptions();
		});
		$(".altui-save-userpage").click( function() {
			PageManager.savePages();
		});
		$(".altui-restore-userpage").click( function() {
			PageManager.recoverFromStorage();
			UIManager.pageOptions();
		});
		$(".altui-clear-userpage").click( function() {
			PageManager.clearStorage();
			UIManager.pageOptions();
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
			  UIManager.refreshUI( true ,false  );	// full but not first time
			  UIManager.refreshFooter();
			});			
			
			// $( window ).unload(function() {
			$(window).on("unload", function() {
				// save state to accelerate the launch next time
				// UIManager.saveEngine();	
				MultiBox.saveEngine();
				AltuiDebug.debug("exiting");
			});
	
			$(".altui-debug-div").toggle(false);
	
			$( document )
				.on ("click", ".navbar-nav a", function() {		// collapse on click on small screens
					//	$(".navbar-toggle").click();
					if ($(this).data("toggle") != "dropdown")	// not for the More... button
						$(".navbar-collapse").collapse('hide');
				} )
				.on ("click touchend", ".imgLogo", UIManager.pageHome )
				// .on ("click", ".altui-savechanges-button", MultiBox.saveChangeCaches )
				.on ("click", "#menu_room", UIManager.pageRooms )
				.on ("click", "#menu_device", UIManager.pageDevices )
				.on ("click", "#menu_scene", UIManager.pageScenes )
				.on ("click", "#altui-scene-triggers", UIManager.pageTriggers )
				.on ("click", "#altui-app-store", UIManager.pageAppStore )
				.on ("click", "#menu_plugins", UIManager.pagePlugins )
				.on ("click", "#menu_workflow", UIManager.pageWorkflows )
				.on ("click", "#altui-pages-see", UIManager.pageUsePages )
				.on ("click", "#altui-pages-edit", UIManager.pageEditPages )
				.on( "click", "#altui-reload", UIManager.reloadEngine )
				.on( "click", "#altui-reboot", UIManager.reboot )
				.on( "click", "#altui-remoteaccess", UIManager.pageRemoteAccess )
				.on( "click", "#altui-license-page", UIManager.pageLicense )
				.on( "click", "#altui-credits", UIManager.pageCredits )
				.on( "click", "#altui-evolutions", UIManager.pageEvolutions)
				.on( "click", "#altui-oscommand", UIManager.pageOsCommand )
				.on( "click", "#altui-luastart", UIManager.pageLuaStart )
				.on( "click", "#altui-luatest", UIManager.pageLuaTest )
				.on( "click", "#altui-zwavenetwork", UIManager.pageZwave )		
				.on( "click", "#altui-childrennetwork", UIManager.pageChildren )		
				.on( "click", "#altui-zwaveroutes", UIManager.pageRoutes )		
				.on( "click", "#altui-quality", UIManager.pageQuality )		
				.on( "click", "#altui-energy", UIManager.pagePower )	
				.on( "click", "#altui-tbl-device", UIManager.pageTblDevices )
				.on( "click", "#altui-tbl-scene", UIManager.pageTblScenes )
				.on( "click", "#altui-tbl-watches", UIManager.pageTblWatches )				
				.on( "click", "#altui-graph-watches", UIManager.pageWatchDisplay )				
				.on( "click", "#altui-tbl-controllers", UIManager.pageTblControllers )				
				.on( "click", "#altui-optimize", UIManager.pageOptions )
				.on( "click", "#altui-checkupdate", UIManager.pageCheckUpdate)
				.on( "click", "#altui-theme-selector", UIManager.pageThemes )
				.on( "click", "#altui-localize", UIManager.pageLocalization  )
				.on( "click", "#altui-debugtools", UIManager.pageDebug  )
				.on( "click", "#altui-debug-btn", function() {
					$(".altui-debug-div").toggle();
					$("#altui-debug-btn span.caret").toggleClass( "caret-reversed" );
				})
				.on("click",".altui-device-variables",function(){ 
					var altuiid = $(this).prop('id');
					var device = MultiBox.getDeviceByAltuiID(altuiid);
					UIManager.deviceDrawVariables(device);
				})
				.on("click",".altui-device-actions",function(){ 
					var altuiid = $(this).prop('id');
					var device = MultiBox.getDeviceByAltuiID(altuiid);
					UIManager.deviceDrawActions(device);
				});
				AltuiDebug.debug("init done");
				// console.log("start UIManager.run()");
				_refreshFooter();
				UIManager.run();
		}
	},
	
	run: function( eventname ) {
		var homepage = getQueryStringValue("home") || 'pageHome';
		// try {
			window["UIManager"][homepage]();	// call function by its name
		// }
		// catch (err) {
			// PageMessage.message("Exception occurred in "+homepage,"warning");
			// AltuiDebug.debug("Exception occurred in "+homepage);
			// AltuiDebug.debug("name: "+err.name);
			// AltuiDebug.debug("message: "+err.message);
			// console.log("Exception occurred in "+homepage);
			// console.log("name: "+err.name);// affiche 'Error'
			// console.log("message: "+err.message); // affiche 'mon message' ou un message d'erreur JavaScript
		// }
	}
  };	// end of return
})( window );

	
// $(document).ready(function() {
$(function() {

	function _onInitLocalization2() {
		// console.log("_initLocalizedGlobals()");
		_HouseModes = [
			{id:1, text:_T("Home"), cls:"preset_home"},
			{id:2, text:_T("Away"), cls:"preset_away"},
			{id:3, text:_T("Night"), cls:"preset_night"},
			{id:4, text:_T("Vacation"), cls:"preset_vacation"}
		];
		// 0: table  1: devicename 2: id
		deviceModalTemplate = "<div id='deviceModal' class='modal fade'>";
		deviceModalTemplate += "  <div class='modal-dialog modal-lg'>";
		deviceModalTemplate += "    <div class='modal-content'>";
		deviceModalTemplate += "      <div class='modal-header'>";
		deviceModalTemplate += "        <button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>";
		deviceModalTemplate += "        <h4 class='modal-title'>{1} <small>#{2}</small> - Variables</h4>";
		deviceModalTemplate += "      </div>";
		deviceModalTemplate += "      <div class='modal-body'>";
		deviceModalTemplate += "      <div class='row' >";
		deviceModalTemplate += "      <div class='col-xs-12' style='overflow-x: auto;'>";
		deviceModalTemplate += " <table class='table table-condensed'>";
		deviceModalTemplate += "       <thead>";
		deviceModalTemplate += "         <tr>";
		// deviceModalTemplate += "           <th>#</th>";
		deviceModalTemplate += "           <th>"+_T("Variable")+"</th>";
		deviceModalTemplate += "           <th></th>";
		deviceModalTemplate += "           <th>"+_T("Value")+"</th>";
		deviceModalTemplate += "         </tr>";
		deviceModalTemplate += "       </thead>";
		deviceModalTemplate += "       <tbody>";
		deviceModalTemplate += "       {0}";					// lines goes here
		deviceModalTemplate += "       </tbody>";
		deviceModalTemplate += "     </table>";
		deviceModalTemplate += "      </div>";	// col
		deviceModalTemplate += "      </div>";	// row
		deviceModalTemplate += "      </div>";	// body
		deviceModalTemplate += "      <div class='modal-footer'>";
		deviceModalTemplate += "        <button type='button' class='btn btn-primary' data-dismiss='modal'>"+_T("Close")+"</button>";
		// deviceModalTemplate += "        <button type='button' class='btn btn-primary'>Save changes</button>";
		deviceModalTemplate += "      </div>";
		deviceModalTemplate += "    </div><!-- /.modal-content -->";
		deviceModalTemplate += "  </div><!-- /.modal-dialog -->";
		deviceModalTemplate += "</div><!-- /.modal -->";

		// 0: table  1: devicename 2: id
		deviceActionModalTemplate = "<div id='deviceActionModal' class='modal fade'>";
		deviceActionModalTemplate += "  <div class='modal-dialog'>";
		deviceActionModalTemplate += "    <div class='modal-content'>";
		deviceActionModalTemplate += "      <div class='modal-header'>";
		deviceActionModalTemplate += "        <button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>";
		deviceActionModalTemplate += "        <h4 class='modal-title'>{1} <small>#{2}</small> - Actions</h4>";
		deviceActionModalTemplate += "      </div>";
		deviceActionModalTemplate += "      <div class='modal-body'>";
		deviceActionModalTemplate += " 	<table class='table table-condensed' >";
		deviceActionModalTemplate += "       <thead>";
		deviceActionModalTemplate += "         <tr>";
		deviceActionModalTemplate += "           <th>"+_T("Action")+"</th>";
		deviceActionModalTemplate += "           <th>"+_T("Parameters")+"</th>";
		deviceActionModalTemplate += "         </tr>";
		deviceActionModalTemplate += "       </thead>";
		deviceActionModalTemplate += "       <tbody>";
		deviceActionModalTemplate += "       {0}";					// lines goes here
		deviceActionModalTemplate += "       </tbody>";
		deviceActionModalTemplate += "     </table>";
		deviceActionModalTemplate += "      </div>";
		deviceActionModalTemplate += "      <div class='modal-footer'>";
		deviceActionModalTemplate += "        {3}";					// extra buttons
		deviceActionModalTemplate += "        <button type='button' class='btn btn-primary' data-dismiss='modal'>"+_T("Close")+"</button>";
		deviceActionModalTemplate += "      </div>";
		deviceActionModalTemplate += "    </div><!-- /.modal-content -->";
		deviceActionModalTemplate += "  </div><!-- /.modal-dialog -->";
		deviceActionModalTemplate += "</div><!-- /.modal -->";

		// 0:id 1: title, 2: body, 3: class size
		defaultDialogModalTemplate = "<div id='{0}' class='modal fade'>";
		defaultDialogModalTemplate += "  <div class='modal-dialog {3}'>";
		defaultDialogModalTemplate += "    <form name='{0}' class='form' data-toggle='validator' onsubmit='return false;'>";
		defaultDialogModalTemplate += "    <div class='modal-content'>";
		defaultDialogModalTemplate += "      <div class='modal-header'>";
		defaultDialogModalTemplate += "        <button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>";
		defaultDialogModalTemplate += "        <h4 class='modal-title'>{1} </h4>";
		defaultDialogModalTemplate += "      </div>";
		defaultDialogModalTemplate += "      <div class='modal-body'>";
		defaultDialogModalTemplate += "      <div class='row-fluid'>";
		defaultDialogModalTemplate += "      {2}";
		defaultDialogModalTemplate += "      </div>";
		defaultDialogModalTemplate += "      </div>";
		defaultDialogModalTemplate += "      <div class='modal-footer'>";
		defaultDialogModalTemplate += "        <button type='button' class='btn btn-default' data-dismiss='modal'>"+_T("Close")+"</button>";
		// defaultDialogModalTemplate += "        <button type='submit' class='btn btn-primary'>{3}</button>";
		defaultDialogModalTemplate += "      </div>";
		defaultDialogModalTemplate += "    </div><!-- /.modal-content -->";
		defaultDialogModalTemplate += "    </form>";
		defaultDialogModalTemplate += "  </div><!-- /.modal-dialog -->";
		defaultDialogModalTemplate += "</div><!-- /.modal -->";

	//"<span class='glyphicon glyphicon-search' aria-hidden='true' data-toggle='tooltip' data-placement='bottom' title='Search'></span>"
		staremtpyGlyph =glyphTemplate.format( "star-empty", _T("Favorite"), "altui-favorite text-muted" );
		starGlyph = glyphTemplate.format( "star", _T("Favorite"), "altui-favorite text-warning" );
		questionGlyph=glyphTemplate.format( "question-sign", _T("Question"), "text-warning" );
		searchGlyph=glyphTemplate.format( "search", _T("Search"), "" );
		wrenchGlyph=glyphTemplate.format("wrench", _T("Settings"), "" );
		optHorGlyph=glyphTemplate.format( "option-horizontal", _T("Option"), "pull-left" );
		signalGlyph=glyphTemplate.format( "signal", _T("Graph"), "" );
		calendarGlyph=glyphTemplate.format( "calendar",  _T("History"), "" );
		refreshGlyph=glyphTemplate.format( "refresh", _T("Refresh"), "text-warning" );
		removeGlyph=glyphTemplate.format( "remove", _T("Remove"), "" );
		loadGlyph = glyphTemplate.format( "open", _T("Load") , "");
		infoGlyph = glyphTemplate.format( "info-sign", _T("Info") , "text-info");
		picGlyph = glyphTemplate.format( "picture", _T("Image") , "");
		upGlyph = glyphTemplate.format( "arrow-up", _T("More") , "");
		downGlyph = glyphTemplate.format( "arrow-down", _T("Less") , "");
		uncheckedGlyph= glyphTemplate.format( "unchecked", _T("Frame") , "");
		runGlyph = glyphTemplate.format( "play", _T("Run Scene") , "");
		editGlyph = glyphTemplate.format( "pencil", _T("Edit") , "");
		recordGlyph = glyphTemplate.format( "record", _T("Record") , "text-danger");
		eyeOpenGlyph = glyphTemplate.format( "eye-open", _T("See") , "");
		cameraGlyph = glyphTemplate.format( "facetime-video", _T("Camera") , "");
		onoffGlyph = glyphTemplate.format( "off", _T("On Off") , "");
		scaleGlyph = glyphTemplate.format( "scale", _T("Gauge") , "");
		homeGlyph = glyphTemplate.format( "home", _T("Rooms") , "");
		tagsGlyph = glyphTemplate.format( "tags", _T("Category") , "");
		helpGlyph = glyphTemplate.format( "question-sign", "" , "");
		
		UIManager.initLocalizedGlobals();
	
		var body = "";
		body+="<!-- Fixed navbar -->";
		body+="<div id='dialogs'></div>";
		body+="<nav class='navbar navbar-default navbar-fixed-top'>";
		body+=" <div class='container'>";
		body+="	<div class='navbar-header'>";
		body+="	  <button type='button' class='navbar-toggle collapsed pull-left' data-toggle='collapse' data-target='#navbar' aria-expanded='false' aria-controls='navbar'>";
		body+="		<span class='sr-only'>Toggle navigation</span>";
		body+="		<span class='icon-bar'></span>";
		body+="		<span class='icon-bar'></span>";
		body+="		<span class='icon-bar'></span>";
		body+="	  </button>		  ";
		body+="	  <a class='navbar-brand' href='#'></a>";
		body+="	</div>";
		body+="	<div id='navbar' class='navbar-collapse collapse'>";
		body+="	  <ul class='nav navbar-nav'>";
		body+="		<li class='active'><div class='imgLogo'></div></li>";
		body+="		<li><a id='menu_device' href='#'  >"+_T("Devices")+"</a></li>";
		body+="		<li><a id='menu_scene' href='#'  >"+_T("Scenes")+"</a></li>";
		body+="		<li class='dropdown'>";
		body+="			<a href='#' class='dropdown-toggle' data-toggle='dropdown' role='button' aria-expanded='false'>"+_T("More")+" <span class='caret'></span></a>";
		body+="			<ul class='dropdown-menu' role='menu'>";
		body+="				<li><a id='menu_room' href='#'  >"+_T("Rooms")+"</a></li>";
		body+="				<li><a id='menu_plugins' href='#'  >"+_T("Plugins")+"</a></li>";
		body+="				<li><a id='altui-app-store' href='#' >"+_T("App Store")+"</a></li>";
		body+="				<li><a id='menu_workflow' href='#'  >"+_T("Workflows")+"</a></li>";
		body+="			<li class='divider'></li>";
		body+="				<li class='dropdown-header'>Tables</li>";
		body+="				<li><a id='altui-tbl-watches' href='#' >"+_T("Watches")+"</a></li>";
		body+="				<li><a id='altui-tbl-device' href='#' >"+_T("Devices")+"</a></li>";
		body+="				<li><a id='altui-scene-triggers' href='#' >"+_T("Triggers")+"</a></li>";
		body+="				<li><a id='altui-tbl-scene' href='#' >"+_T("Scenes")+"</a></li>";
		body+="				<li><a id='altui-tbl-controllers' href='#' >"+_T("Controllers")+"</a></li>";
		body+="			<li class='divider'></li>";
		body+="				<li class='dropdown-header'>Graphic</li>";
		body+="				<li><a id='altui-graph-watches' href='#' >"+_T("Watch Display")+"</a></li>";
		body+="				<li><a id='altui-energy' href='#' >"+_T("Power Chart")+"</a></li>";
		body+="				<li><a id='altui-childrennetwork' href='#' >"+_T("Parent/Child Network")+"</a></li>";
		body+="				<li><a id='altui-zwavenetwork' href='#' >"+_T("zWave Network")+"</a></li>";
		body+="				<li><a id='altui-zwaveroutes' href='#' >"+_T("zWave Routes")+"</a></li>";
		body+="				<li><a id='altui-quality' href='#' >"+_T("Network Quality")+"</a></li>";
		body+="			</ul>";
		body+="		</li>";
		body+="		<li class='dropdown'>";
		body+="			<a href='#' class='dropdown-toggle' data-toggle='dropdown' role='button' aria-expanded='false'>"+_T("Panels")+" <span class='caret'></span></a>";
		body+="			<ul class='dropdown-menu' role='menu'>";
		body+="				<li><a id='altui-pages-see' href='#' >"+_T("Use Custom Pages")+"</a></li>";
		body+="				<li><a id='altui-pages-edit' href='#' >"+_T("Edit Custom Pages")+"</a></li>";
		body+="			</ul>";
		body+="		</li>";
		body+="		<li class='dropdown'>";
		body+="		  <a href='#' class='dropdown-toggle' data-toggle='dropdown' role='button' aria-expanded='false'>"+_T("Misc")+"<span class='caret'></span></a>";
		body+="		  <ul class='dropdown-menu' role='menu'>";
		body+="			<li class='dropdown-header'>Access</li>";
		body+="			<li><a id='altui-remoteaccess' href='#' >"+_T("Remote Access Login")+"</a></li>";
		body+="			<li class='divider'></li>";
		body+="			<li class='dropdown-header'>Lua</li>";
		body+="			<li><a id='altui-reload' href='#' >"+_T("Reload Luup Engine")+"</a></li>";
		body+="			<li><a id='altui-reboot' href='#' >"+_T("Reboot Vera")+"</a></li>";
		body+="			<li><a id='altui-luastart' href='#' >"+_T("Lua Startup Code")+"</a></li>";
		body+="			<li><a id='altui-luatest' href='#' >"+_T("Lua Test Code")+"</a></li>";
		body+="			<li><a id='altui-oscommand' href='#' >"+_T("OS Command")+"</a></li>";
		body+="			<li class='divider'></li>";
		body+="			<li class='dropdown-header'>Admin</li>";
		body+="			<li><a id='altui-checkupdate' href='#'>"+_T("Check for Updates")+"</a></li>";
		body+="			<li><a id='altui-optimize' href='#'>"+_T("Options")+"</a></li>";
		body+="			<li><a id='altui-theme-selector' href='#'>"+_T("Themes")+"</a></li>";
		body+="			<li><a id='altui-localize' href='#'>"+_T("Localization")+"</a></li>";
		body+="			<li><a id='altui-debugtools' href='#'>"+_T("Debug")+"</a></li>";
		body+="			<li class='divider'></li>";
		body+="			<li class='dropdown-header'>About</li>";
		body+="			<li><a id='altui-license-page' href='#'>"+_T("License Fees")+"</a></li>";
		body+="			<li><a id='altui-credits' href='#'>"+_T("Credits")+"</a></li>";
		body+="			<li><a id='altui-evolutions' href='#'>"+_T("Evolutions")+"</a></li>";
		body+="			<li><a id='altui-support' target='_blank' href='http://forum.micasaverde.com/index.php?board=78.0'>"+_T("Support")+"</a></li>";
		body+="		  </ul>";
		body+="		</li>";
		body+="	  </ul>";
		body+="	</div><!--/.nav-collapse -->";
		body+="  </div>";
		body+="</nav>";
		body+="<div class='container-fluid theme-showcase' role='main'>";
		body+="</div> <!-- /container -->";
		body+="<div id='altui-background'></div>";
		$("#wrap").prepend(body);
				
		// client side override of theme if defined
		var clientsideThemecss= MyLocalStorage.getSettings("Theme");
		if (clientsideThemecss != null)
			g_ALTUI.g_CustomTheme = clientsideThemecss;
		
		ALTUI_Templates = ALTUI_Templates_Factory();
		
		UIManager.initEngine(styles.format(window.location.hostname), g_ALTUI.g_DeviceTypes, g_ALTUI.g_CustomTheme, g_ALTUI.g_Options, function() {
			MultiBox.initEngine(g_ALTUI.g_ExtraController,g_ALTUI.g_FirstUserData,g_ALTUI.g_DeviceTypes.info["controllerType"]);

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
		});
	};

	function _onInitLocalization() {
		Localization.setTitle("ALTUI")
		if (isNullOrEmpty(g_ALTUI.g_Options))
			_onInitLocalization2();
		else {
			var reserved = JSON.parse( g_ALTUI.g_Options ).reserved
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
	AltuiDebug.debug("starting engines");
	AltuiDebug.debug("Configuration: "+JSON.stringify(g_ALTUI.g_DeviceTypes));

	EventBus.registerEventHandler("on_ui_initFinished",UIManager,UIManager.signal);
	EventBus.registerEventHandler("on_ui_userDataLoaded",UIManager,UIManager.signal);
	EventBus.registerEventHandler("on_ui_deviceStatusChanged",UIManager,"refreshUIPerDevice");


	// Initialize Speech Engine and add English rules.
	// localized rules are overriden later
	var language = getQueryStringValue("lang") || window.navigator.userLanguage || window.navigator.language;
	SpeechManager.init(language);
	
	AltuiDebug.debug("language:"+language);
	if ((language.substring(0, 2) == 'en')) {
		AltuiDebug.debug("Locale file not needed");
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
			AltuiDebug.debug("loading script :"+scriptLocationAndName);
			// once script is loaded, we can call style function in it
			// $(script).load(  function() {
			$(script).on("load", _onInitLocalization )
			head.appendChild(script);
		} else {
			// if lang is on the url, the js is already loaded by the Lua module. 
			AltuiDebug.debug("Locale file not needed");
			_onInitLocalization();
		}
	}
});
