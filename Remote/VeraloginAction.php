<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	<!-- Latest compiled and minified CSS -->
	<link rel="stylesheet" href="https://code.jquery.com/ui/1.11.3/themes/smoothness/jquery-ui.css">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
    <title>VERA AltUI</title>
		<style>
	body { padding-top: 70px; }
	</style>

</head>

<body role="document">
    <!-- Fixed navbar -->
    <nav class="navbar navbar-default navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>		  
          <a class="navbar-brand" href="#"></a>
        </div>
        <div id="navbar" class="navbar-collapse collapse">
          <ul class="nav navbar-nav">
            <li class="active"><img class="imgLogo" src="https://home.getvera.com/assets/portal_getvera_ui7/images/oem_logo.png"></li>
          </ul>
        </div><!--/.nav-collapse -->
      </div>
    </nav>


    <div class="container-fluid theme-showcase" role="main">
		<div class="row">
			<div class="col-sm-10 col-sm-push-2">
				<h1 id="altui-pagetitle" >Remote Login to VERA Alternate UI</h1>
				<p id="altui-pagemessage"></p>
				<div class="altui-mainpanel row">
					<div class="col-xs-12">
					<?php
					class MyHttpRequest 
					{
			
						function get( $url , $headers = NULL )
						{
						 
							// Tableau contenant les options de téléchargement
							$options=array(
								  CURLOPT_URL            => $url, // Url cible (l'url la page que vous voulez télécharger)
								  CURLOPT_RETURNTRANSFER => true, // Retourner le contenu téléchargé dans une chaine (au lieu de l'afficher directement)
								  CURLOPT_VERBOSE 		 => false,
								  CURLOPT_HEADER         => false // Ne pas inclure l'entête de réponse du serveur dans la chaine retournée
							);
							 
							////////// MAIN
							try {
								// Création d'un nouvelle ressource cURL
								$CURL=curl_init();
								if (FALSE === $CURL)
										throw new Exception('failed to initialize');
							
								// Configuration des options de téléchargement
								curl_setopt_array($CURL,$options);
								if ($headers != NULL)
								{
									curl_setopt($CURL, CURLOPT_HTTPHEADER, $headers);
								}
								
								// Exécution de la requête
								$content=curl_exec($CURL);      // Le contenu téléchargé est enregistré dans la variable $content. Libre à vous de l'afficher.
								if (FALSE === $content)
									throw new Exception(curl_error($CURL), curl_errno($CURL));
								
								// Fermeture de la session cURL
								curl_close($CURL);
							} 
							catch (Exception $e) {
								trigger_error(sprintf(
									'Curl failed with error #%d: %s',
									$e->getCode(), $e->getMessage()),
									E_USER_ERROR);
							}
							
							return $content;
						}
					}

					class VeraTokens
					{
						function getAuthToken( $user, $pwd )
						{
							$pwdSeed = "oZ7QE6LcLJp6fiWzdqZc";
							$SHA1UserPassword = sha1( $user.$pwd.$pwdSeed );
							// new srv to be confirmed => $url = "https://vera-us-oem-autha11.mios.com/autha/auth/username/"."$user"."?SHA1Password="."$SHA1UserPassword"."&PK_Oem=1";
							$url = "https://us-autha11.mios.com/autha/auth/username/"."$user"."?SHA1Password="."$SHA1UserPassword"."&PK_Oem=1&TokenVersion=2";
							//$url="http://www.google.com";

							$req = new MyHttpRequest();
							$response = $req->get( $url );
							// var_dump($response);
							
							$result = json_decode($response);
							// var_dump($result);
							// $AuthToken  	= result.Identity;
							// $AuthSigToken   = result.IdentitySignature;
							// $Server_Account	= result.Server_Account;
							return $result;
						}
						
						function getSessionToken( $authd11Server, $AuthToken, $AuthSigToken )
						{
							$url = "https://".$authd11Server."/info/session/token";
							$headers = array();
							$headers[] = 'MMSAuth: '.$AuthToken;
							$headers[] = 'MMSAuthSig: '.$AuthSigToken;
							$req = new MyHttpRequest();
							$session_token = $req->get( $url ,$headers );
							return $session_token;
						}	
						
						function getAccountDevices($Server_Account,$PK_Account,$SessionToken)
						{
							$url = "https://".$Server_Account."/account/account/account/".$PK_Account."/devices";
							$headers = array();
							$headers[] = 'MMSSession: '.$SessionToken;
							$req = new MyHttpRequest();
							$data = $req->get( $url ,$headers );
							$obj = json_decode($data);
							return $obj->Devices;
						}
						
						function getRelayInfo($ServerDevice, $PK_Device, $SessionToken )
						{			
							$url = "https://".$ServerDevice."/device/device/device/".$PK_Device;
							$headers = array();
							$headers[] = 'MMSSession: '.$SessionToken;
							$req = new MyHttpRequest();
							$data = $req->get( $url ,$headers );
							$obj = json_decode($data);
							return $obj;
						}
					}

					//------------------------------------------------------
					// Main program
					//------------------------------------------------------

					$mms = new VeraTokens();
					$user = $_REQUEST["altui-login-name"];
					$pwd = $_REQUEST["altui-login-pwd"];
					$lang = $_REQUEST["lang"];
					$home = $_REQUEST["home"];
					$AuthTokens = $mms->getAuthToken( $user, $pwd );
					if ($AuthTokens==NULL)
					{
					?>
						<div class="alert alert-danger alert-dismissible" role="alert">
						  <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
						  <strong>Warning!</strong> <A href='/Veralogin.php'> Invalid Login, Try Again please! </A>.
						</div>
					<?php
						die("");
					}

					$authd11Server = "vera-us-oem-authd11.mios.com";
					$SessionToken = $mms->getSessionToken( $authd11Server, $AuthTokens->Identity, $AuthTokens->IdentitySignature );

					$obj = json_decode( base64_decode($AuthTokens->Identity) );
					$PK_Account = $obj->PK_Account;
					$OtherSessionToken = $mms->getSessionToken( $AuthTokens->Server_Account, $AuthTokens->Identity, $AuthTokens->IdentitySignature );
					$DeviceTable = $mms->getAccountDevices($AuthTokens->Server_Account,$PK_Account,$OtherSessionToken);
					foreach( $DeviceTable as $key => $device) {
						// Only include Vera hub types.
						if ("1" === $device->PK_DeviceType) {
							$ServerDeviceToken = $mms->getSessionToken( $device->Server_Device, $AuthTokens->Identity, $AuthTokens->IdentitySignature );
							$RelayInfo = $mms->getRelayInfo( $device->Server_Device , $device->PK_Device , $ServerDeviceToken );
							$device->RelayInfo = $RelayInfo ;
							$ServerRelayToken = $mms->getSessionToken( $device->RelayInfo->Server_Relay, $AuthTokens->Identity, $AuthTokens->IdentitySignature );
							$device->RelayInfo->ServerRelayToken = $ServerRelayToken;
						}
					}
					
					?>
					<table class='table table-striped table-bordered table-hover'>
					<caption>Click on the device you want to reach</caption>
					<thead>
					<tr>	
					<th>Name</th>
					<th>InternalIP</th>
					<th>Platform</th>
					<th>Firmware</th>
					<th>Mac Address</th>
					<th>Relay</th>
					</tr>
					</thead>
					<tbody>
					<?php
					foreach( $DeviceTable as $key => $device) {
						// Only include Vera hub types.
						if ("1" === $device->PK_DeviceType) {
							echo '<tr class="altui-remote-device" id="'.$key.'">';
							echo '<td>'.$device->Name.'</td>';
							echo '<td>'.$device->RelayInfo->InternalIP.'</td>';
							echo '<td>'.$device->RelayInfo->Platform.' #'.$device->PK_Device.'</td>';
							echo '<td>'.$device->RelayInfo->FirmwareVersion.'</td>';
							echo '<td>'.$device->MacAddress.'</td>';
							echo '<td>'.$device->RelayInfo->Server_Relay.'</td>';
							echo '</tr>';
						}
					}
					?>
					</tbody>
					</table>
					<button type="button" class="altui-seemore btn btn-default">Toggle Details</button>
					<pre id='altui-details' class=''>
						<?php
						// var_dump($SessionToken);
						// var_dump($PK_Account);
						// var_dump($OtherSessionToken);
						var_dump($DeviceTable);
						// var_dump($_GET); 		// Element 'foo' is string(1) "a"
						// var_dump($_POST); 		// Element 'bar' is string(1) "b"
						// var_dump($_REQUEST); 	// Does not contain elements 'foo' or 'bar'
						?>
					</pre>
					</div>
				</div>
			</div>
			<div class="col-sm-2 col-sm-pull-10">
				<div class="altui-leftnav btn-group-vertical" role="group" aria-label="...">
					<!--
					<button type="button" class="btn btn-default">One</button>
					<button type="button" class="btn btn-default">Deux</button>
					<button type="button" class="btn btn-default">Trois</button>
					-->
				</div>
			</div>
		</div>
    </div> <!-- /container -->
	
	<form id="altui-veracall" action="Veracall.php">
		<input type="hidden" name="url" id="url">
		<input type="hidden" name="MMSSession" id="MMSSession">
	</form>
	
    <!-- Bootstrap core JavaScript    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
	<!-- Latest compiled and minified JavaScript -->
    <script src="https://code.jquery.com/jquery-1.11.2.min.js"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>
    <script src="https://code.jquery.com/ui/1.11.3/jquery-ui.min.js"></script>

	<script type='text/javascript'>
	if (typeof String.prototype.format == 'undefined') {
		String.prototype.format = function()
		{
		   var content = this;
		   for (var i=0; i < arguments.length; i++)
		   {
				var replacement = new RegExp('\\{' + i + '\\}', 'g');	// regex requires \ and assignment into string requires \\
				content = content.replace(replacement, arguments[i]);  
		   }
		   return content;
		};
	};

	$(document).ready(function() {
		var temp = '<?php echo json_encode($DeviceTable)?>';
		$('#altui-details').hide();
		$('.altui-seemore').click( function() {
			$('#altui-details').toggle();
		});
		$(".altui-remote-device").click( function() {
			var deviceTable = JSON.parse(temp);
			var id= parseInt( $(this).prop('id') );
			var relay = deviceTable[id].RelayInfo["Server_Relay"];
			var PK_Device = deviceTable[id].PK_Device;
			var url  = "https://"+relay+"/relay/relay/relay/device/"+PK_Device+"/port_3480/;" //<Request>;
			var lang = '<?php echo $lang ?>';
			var home = '<?php echo $home ?>';
			
			//http://192.168.1.16/port_3480/data_request?id=lr_ALTUI_Handler&command=home#
			//https:<//<ServerRelay>/relay/relay/relay/device/<PK_Device>/port_3480/<Request>
			
			// option a)
			// var url = "https://"+relay+"/relay/relay/relay/device/"+PK_Device+"/port_3480/data_request?id=lr_ALTUI_Handler&command=home";
			// $("#url").val(url);
			// $("#MMSSession").val(deviceTable[id].RelayInfo["ServerRelayToken"]);
			// $("#altui-veracall").submit();
			
			// option b)
			// https://vera-us-oem-relay11.mios.com/relay/relay/relay/device/CONTROLER_SN/session/SESSION_TOKEN/port_3480/data_request?id=lr_ALTUI_Handler&command=home
			var url = "https://{0}/relay/relay/relay/device/{1}/session/{2}/port_3480/data_request?id=lr_ALTUI_Handler&command=home&lang={3}&home={4}"
						.format( relay, PK_Device, deviceTable[id].RelayInfo["ServerRelayToken"],lang,home );
			window.open(url,'_self');
		});
	});
	</script>



	<hr>
	<footer><p class="text-center"><small id="altui-footer">AltUI, amg0</small></p><span id="debug"></span></footer>
</body>
</html>
