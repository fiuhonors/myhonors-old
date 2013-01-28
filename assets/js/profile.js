'use strict';

var myhonorsProfile = angular.module('myhonorsProfile', []);

/* Config */

myhonorsProfile.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/profile', {templateUrl: 'assets/partials/profile.html', controller: 'EventBrowseCtrl'});
}]);