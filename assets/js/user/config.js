'use strict';

angular.module('myhonorsUser').config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/login', {templateUrl: 'assets/js/user/login.html', controller: 'LoginCtrl', requireLogin: false, resolve: appResolve}).
		when('/signup', {templateUrl: 'assets/js/user/signup.html', controller: 'SignupCtrl', requireLogin: false, resolve: appResolve}).
		when('/profile/:userId', {templateUrl: 'assets/js/user/profile.html', requireLogin: true, resolve: appResolve}).
		when('/profile/:userId/edit', {templateUrl: 'assets/js/user/profile-edit.html', controller: 'ProfileEditCtrl', requireLogin: true, resolve: appResolve});
}]);