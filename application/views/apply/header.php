<!DOCTYPE html>
<html xmlns:ng="http://angularjs.org" data-ng-app>
<head>
	<title>FIU Honors College Application</title>
	<link rel="stylesheet" type="text/css" href="http://myhonors.fiu.edu/assets/css/reset.css" />
	<link rel="stylesheet" type="text/css" href="http://myhonors.fiu.edu/assets/css/960_24_col.css" />
	<link rel="stylesheet" type="text/css" href="http://myhonors.fiu.edu/assets/css/style.css" />
	<!-- this is for the Sticky Footer Solution -->
	<!--[if !IE 7]>
	<style type="text/css">
		#wrap {display:table;height:100%}
	</style>
	<![endif]-->
	<script>(function(w,d){'use strict';var script=d.createElement('script');script.type='text/javascript';
	script.async=true; script.src='https://www.kera.io/embed.js'; var entry=d.getElementsByTagName('script')[0];entry.parentNode.insertBefore(script,entry);w.Kera=w.Kera||{};
	w.Kera._ready=[];w.Kera.ready=function(cb){w.Kera._ready.push(cb);};w.Kera.app_id='2g77kml7';
	}(window,document));
	</script>
</head>
<body>

<!-- we use these two div's for the sticky footer -->
<div id="wrap">
<div id="main">

	<!-- header -->
	<div id="head-wrap">
		<div class="container_24">
			<div class="grid_4">
				<a href="http://myhonors.fiu.edu/apply"><img src="http://myhonors.fiu.edu/assets/img/myhonors.png" alt="MyHonors" /></a>
			</div>
			<ul class="grid_8" id="head-nav">
				<li>FIU Honors College Application</li>
			</ul>
			<div class="grid_12" id="head-search">
				<?php if(isset($username) && $username != null) { ?>
					<a href="mailto:honors@fiu.edu" title="Contact an Honors College Representative" class="button">Need Help?</a>
					<a href='./apply/logout' class="button">Logout</a>
				<?php } else { ?>
					<a href="mailto:honors@fiu.edu" title="Contact an Honors College Representative" class="button">Need Help?</a>
				<?php } ?>
			</div>
			<div class="clear"></div>
		</div>
	</div>
	<!-- end header -->

	<div class="container_24">

		<?php if (!isset($hideSidebar)) { ?>

		<div class="grid_7 leftnav" style="margin-top: 45px">
			<div class="box center"><a href="http://myhonors.fiu.edu/apply/"><strong>Application Start Page</strong></a></div>
			<div class="grid_1 number_wrap"><div class="number center">1</div></div><div class="box"><a id='acad_future' href="/apply/general">Academic Information</a></div>
			<div class="grid_1 number_wrap"><div class="number center">2</div></div><div class="box"><a href="/apply/resume">Resume</a></div>
			<div class="grid_1 number_wrap"><div class="number center">3</div></div><div class="box"><a href="/apply/documents">Essays and Other Documents</a></div>
			<div class="grid_1 number_wrap"><div class="number center">4</div></div><div class="box"><a href="/apply/recommendations">Letters of Recommendation</a></div>
			<div class="box center"><a href="/apply/preview"><strong>Preview & Submit Application!</strong></a></div>
		</div>

		<div class="grid_17">

		<?php } else { ?>

		<div class="grid_24">

		<?php } ?>
