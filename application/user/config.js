'use strict';

angular.module('myhonorsUser').config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/login', {
			templateUrl: 'application/user/login.html',
			controller: 'LoginCtrl',
			requireLogin: false,
			resolve: appResolve,
			showPanels: false
		}).
		when('/signup', {
			templateUrl: 'application/user/signup.html', 
			controller: 'SignupCtrl', 
			requireLogin: false, 
			resolve: appResolve
			}).
		when('/profiles/:username', {
			templateUrl: 'application/user/profile-view.html', 
			controller: 'ProfileViewCtrl',
			requireLogin: true, 
			resolve: appResolve
			}).
        when('/profiles/:username/profilepictureedit', {
            templateUrl: 'application/user/profile-picture-edit.html', 
            controller: 'ProfilePictureEditCtrl', 
            requireLogin: true, 
            resolve: appResolve
        }).
		when('/profiles/:username/projects/:projectId', {
            templateUrl: 'application/user/project-view.html', 
            controller: 'ProjectViewCtrl', 
            requireLogin: true, 
            resolve: appResolve
        });
}]);
