//# sourceURL=J_ALTUI_loc_zz.js
// http://192.168.1.16:3480/data_request?id=lr_ALTUI_Handler&command=home
// This program is free software: you can redistribute it and/or modify
// it under the condition that it is for private or home useage and 
// this whole comment is reproduced in the source code file.
// Commercial utilisation is not authorized without the appropriate
// written agreement from amg0 / alexis . mermet @ gmail . com
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 

Localization.init( {
  "Reboot Vera": "Reboot System",
  "Enter a Vera OS ( Unix ) command, the stdout will be returned and displayed below": "Enter a OS ( Unix ) command, the stdout will be returned and displayed below",
  "use the same favorites as set on your VERA box but prevent to have different favorites per client device": "use the same favorites as set on your system box but prevent to have different favorites per client device",
  "Use Vera Favorites": "Use System Favorites",
  "UseVeraFavorites:use the same favorites as set on your VERA box but prevent to have different favorites per client device": "UseBoxFavorites:use the same favorites as set on your System box but prevent to have different favorites per client device",
  "Os Command execution on vera failed.":"Os Command execution on system failed.",
  "Lua Command execution on vera failed.":"Lua Command execution on system failed."
});

Localization.setTitle("my title");
Localization.forceOption("ShowVideoThumbnail",0);
Localization.setBrandingCallback( function() {
	$("#altui-theme-selector").remove();
	$("#altui-support").attr('href','http://www.google.com');
	$("#altui-support").parent().after('<li><a id="altui-ctrlable" href="http://ctrlable.com/">ctrlable.com</a></li>');
});