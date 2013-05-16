'use strict';

angular.module('myhonorsUser').config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/login', {templateUrl: 'assets/partials/login.html', controller: 'LoginCtrl', requireLogin: false, resolve: appResolve}).
		when('/signup', {templateUrl: 'assets/partials/signup.html', controller: 'SignupCtrl', requireLogin: false, resolve: appResolve}).
		when('/profile/:userId', {templateUrl: 'assets/partials/profile.html', requireLogin: true, resolve: appResolve}).
		when('/profile/:userId/edit', {templateUrl: 'assets/partials/profile-edit.html', controller: 'ProfileEditCtrl', requireLogin: true, resolve: appResolve});
}]);