'use strict';

var myhonorsProfile = angular.module('myhonorsProfile', ['ngResource']);

/* Config */

myhonorsProfile.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/profile/:userId', {templateUrl: 'assets/partials/profile.html'}).
		when('/profile/:userId/edit', {templateUrl: 'assets/partials/profile-edit.html', controller: 'ProfileEditCtrl'});

}]);

/* Services */

myhonorsProfile.factory('Profile', ['$resource', function($resource) {
	return $resource('api/user');
}]);

/* Controllers */

myhonorsProfile.controller('ProfileEditCtrl', ['$scope', '$rootScope', '$routeParams', '$location', 'Profile', function EventBrowseCtrl($scope, $rootScope, $routeParams, $location, Profile) {
	$scope.profileEdit = Profile.get({id: $routeParams.userId}, function(data) {console.log(data);});

	$scope.profileSave = function() {
		$scope.profileEdit.$save(function(data) {
			$rootScope.profileData = data;
			$location.path('/profile/' + $routeParams.userId);
		});
	};

}]);