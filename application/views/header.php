<!DOCTYPE html>
<html lang="en" xmlns:ng="http://angularjs.org" data-ng-app="myhonors">
<head>
	<title>MyHonors</title>
	<base href="<?php echo base_url() ?>" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<link rel="stylesheet" type="text/css" href="assets/css/bootstrap.css" />
	<link rel="stylesheet" type="text/css" href="assets/css/style.css" />
	<!-- this is for the Sticky Footer Solution -->
	<!--[if !IE 7]>
	<style type="text/css">
		#wrap {display:table;height:100%}
	</style>
	<![endif]-->
	<script src="assets/lib/jquery.min.js"></script>
	<script src="assets/lib/bootstrap.js"></script>
	<script src="assets/lib/angular.js"></script>
	<script src="assets/lib/angular-resource.js"></script>
	<script type="text/javascript">

	'use strict';

	var myhonors = angular.module('myhonors', ['myhonorsConfig', 'myhonorsProfile', 'myhonorsEvents']);

	/* Config */

	myhonors.config(['$routeProvider', function($routeProvider) {
		$routeProvider.otherwise({redirectTo:''});
	}]);

	/* Controllers */

	myhonors.controller('AppCtrl', ['$scope', '$rootScope', '$location', function AppCtrl($scope, $rootScope, $location) {
		$rootScope.page_title = "";
		$rootScope.profileData = <?php echo(json_encode($profile_data)) ?>;

		$scope.results = function(content) {
			$scope.response = content;
		};
	}]);

	myhonors.directive('imgRotate', function($timeout) {
			return function(scope, elm, attrs) {
				// make the images sit on top of each other
				elm.addClass('img-rotate');

				var children = elm.children();
				var first = children.first();
				var current = first;
				var previous = null;

				var delay = attrs.delay || 2000;

				children.css('display', 'none');
				current.css('display', 'block');

				// base case: if there are less than two images, we have nothing to rotate
				if (children.length < 2) {
					return;
				}

				// rotate!
				$timeout(function rotate() {
					if (current.next().length === 0) {
						first.css('display', 'block');
						current.fadeOut();
						current = first;
					}
					else {
						previous = current;
						current = current.next();
						current.fadeIn(function() {
							previous.css('display', 'none');
						});
					}

					// do it again!
					$timeout(rotate, delay, false);
				}, delay, false);
		};
	});

	myhonors.directive('fileupload', function () {
		return {
			restrict: 'E',
			template: '<input type="file" name="file" onchange="angular.element(this).scope().setFile(this)">',
			replace: true,
			controller: function ($scope) {
				$scope.setFile = function (elem) {
					var fd = new FormData(),
						xhr = new XMLHttpRequest();

					fd.append("file", elem.files[0]);

					xhr.open("POST", "api/upload", true);
					xhr.send(fd);
				};
			}
		};
	});

	</script>
	<script src="assets/js/config.js"></script>
	<script src="assets/js/profile.js"></script>
	<script src="assets/js/events.js"></script>
</head>
<body data-ng-controller="AppCtrl">

<!-- we use these two div's for the sticky footer -->
<div id="wrap">

	<!-- header -->
	<div class="navbar navbar-static-top navbar-inverse" ng-show="profileData">
		<div class="navbar-inner">
			<div class="container-fluid">
				<a class="brand" href="#/home">&nbsp;</a>
				<ul class="nav" ng-show="profileData">
					<li><a href="#/events"><i class="icon-calendar icon-white"></i> Events</a></li>
					<li><a href="#/citizenship"><i class="icon-ok icon-white"></i> Citizenship</a></li>
				</ul>
				<div class="dropdown pull-right" ng-cloak ng-show="profileData">
					<span class="dropdown-text">Logged in as</span> <button class="btn btn-link dropdown-toggle" data-toggle="dropdown"><i class="icon-user icon-white"></i> {{profileData.fname}} {{profileData.lname}}</button>
					<ul class="dropdown-menu pull-right" role="menu">
						<li><a href="#/profile/{{profileData.user_id}}">View Profile</a></li>
						<li><a href="#/profile/{{profileData.user_id}}/edit">Update Profile</a></li>
						<li class="divider"></li>
						<li><a href="auth/logout">Logout</a></li>
					</ul>
				</div>
				<ul class="unstyled inline pull-right" ng-show="!profileData">
					<li><a href="auth/login" class="btn btn-primary">Login</a></li>
					<li><a href="auth/register" class="btn btn-link">Register</a></li>
				</ul>
			</div>
		</div>
	</div>

	<!-- content -->
	<div class="container-fluid">

		<!-- this div gets populated with CodeIngiter's views by default.
			 If $load_angular is true, it will overwrite the contents of this div
			 with whatever is AngularJS template is defined in the $routeProvider -->
		<div class="row-fluid" <?php if(isset($load_angular) && $load_angular) { echo 'data-ng-view';} ?>>