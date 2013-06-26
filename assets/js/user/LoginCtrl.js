'use strict';

angular.module('myhonorsUser').controller('LoginCtrl', ['$scope', '$route', '$location', 'FirebaseIO', 'UserService', function($scope, $route, $location, FirebaseIO, UserService) {
	//used for navigating between the Login box and the Forgot Password? box
	$scope.currentPage = 'loginPage';

	$scope.loginForm = {
		pid: '',
		password: ''
	};

	$scope.doLogin = function() {
		UserService.login($scope.loginForm.pid, $scope.loginForm.password);
		$scope.loginForm.password = '';
	};

	$scope.status = UserService.status;
	$scope.doLogout = UserService.logout;
}]);