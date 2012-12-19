<!DOCTYPE html>
<html xmlns:ng="http://angularjs.org" data-ng-app="MyHonors">
<head>
	<title>MyHonors</title>
	<link rel="stylesheet" type="text/css" href="assets/css/reset.css" />
	<link rel="stylesheet" type="text/css" href="assets/css/960_24_col.css" />
	<link rel="stylesheet" type="text/css" href="assets/css/style.css" />
	<!-- this is for the Sticky Footer Solution -->
	<!--[if !IE 7]>
	<style type="text/css">
		#wrap {display:table;height:100%}
	</style>
	<![endif]-->
</head>
<body data-ng-controller="AppCtrl">

<!-- we use these two div's for the sticky footer -->
<div id="wrap">
<div id="main">

	<!-- header -->
	<div id="head-wrap">
		<div class="container_24">
			<div class="grid_4">
				<a href="#/home"><img src="assets/img/myhonors.png" alt="MyHonors" /></a>
			</div>
			<ul class="grid_13" id="head-nav">
				<li><a href="#/events">Events</a></li>
				<li><a href="#/citizenship">Citizenship</a></li>
			</ul>
			<div class="grid_7" id="head-search">
				<input type="text" placeholder="Search Events" ng-model="searchText" ng-change="toEventsPage()" />
			</div>
			<div class="clear"></div>
		</div>
	</div>
	<!-- end header -->

	<div class="container_24" data-ng-view></div>

</div>
</div>

<!-- footer - we need the extra div wrapper for the sticky footer -->
<div id="footer">
	<div class="container_24">
		<div class="prefix_4 grid_16 suffix_4 center">
			<img src="assets/img/honors-logo.jpg" alt="Honors College - Florida International University" width="430" />
			<p class="smalltext">The Honors College (DM 233), 11200 SW 8th Street, Miami, FL 33199</p>
			<p class="smalltext">Phone: (305) 348-4100 &#8226; Fax: (305) 348-2118 &#8226; Email: <a href="mailto:honors@fiu.edu">honors@fiu.edu</a></p>
		</div>
		<div class="clear"></div>
	</div>
</div>

<script src="assets/lib/jquery.min.js"></script>
<script src="assets/lib/angular.js"></script>
<script src="assets/lib/angular-resource.js"></script>
<script src="assets/js/app.js"></script>
<script src="assets/js/controllers.js"></script>
<script src="assets/js/services.js"></script>

</body>
</html>