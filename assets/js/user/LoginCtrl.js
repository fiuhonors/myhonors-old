'use strict';

angular.module('myhonorsUser').controller('LoginCtrl', ['$scope', '$rootScope', '$route', '$location', 'FirebaseIO', function($scope, $rootScope, $route, $location, FirebaseIO) {
	$scope.login = $rootScope.login;
	$scope.profile = $rootScope.profile;
	//used for navigating between the Login box and the Forgot Password? box
	$scope.currentPage = 'loginPage';
}]);