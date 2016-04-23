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
						<form id ="altui-login-form" class="form-inline" action="VeraloginAction.php" method="post">
							<input id="lang" type="hidden" name="lang" value="" />
							<input id="home" type="hidden" name="home" value="" />
						  <div class="form-group">
							<label class="sr-only" for="altui-login-name">Email address</label>
							<input type="text" class="form-control" id="altui-login-name" name="altui-login-name" placeholder="Enter login">
						  </div>
						  <div class="form-group">
							<label class="sr-only" for="altui-login-pwd">Password</label>
							<input type="password" class="form-control" id="altui-login-pwd" name="altui-login-pwd" placeholder="Password">
						  </div>
						  <div class="checkbox">
							<label>
							  <input type="checkbox"> Remember me
							</label>
						  </div>
						  <button type="submit" class="btn btn-default altui-login-request">Sign in</button>
						</form>
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
	
    <!-- Bootstrap core JavaScript    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
	<!-- Latest compiled and minified JavaScript -->
    <script src="https://code.jquery.com/jquery-1.11.2.min.js"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>
    <script src="https://code.jquery.com/ui/1.11.3/jquery-ui.min.js"></script>

	<script type='text/javascript'>

	function getQueryStringValue (key) {  
	  return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
	}
	
	$(document).ready(function() {

		$("#lang").val( getQueryStringValue("lang") || window.navigator.userLanguage || window.navigator.language );
		$("#home").val( getQueryStringValue("home") || 'pageHome');
		
		// collapse on click on small screens
		$(".navbar-nav a").on("click",function() {
			//	$(".navbar-toggle").click();
			if ($(this).data("toggle") != "dropdown")	// not for the More... button
				$(".navbar-collapse").collapse('hide');
		});

	});
	</script>

	<hr>
	<footer><p class="text-center"><small id="altui-footer">AltUI, amg0</small></p><span id="debug"></span></footer>
</body>
</html>
