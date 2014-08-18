'use strict';

angular.module('myhonorsUser').controller('LoginCtrl', ['$scope', '$route', '$location', '$routeParams', 'FirebaseIO', 'UserService', function($scope, $route, $location, $routeParams, FirebaseIO, UserService) {
	//used for navigating between the Login box and the Forgot Password? box
	$scope.currentPage = 'loginPage';
	$scope.redirectOption = $routeParams.redirect;
	$scope.loginForm = {
		pid: '',
		password: ''
	};

	$scope.doLogin = function() {
		UserService.login( $scope.loginForm.pid, $scope.loginForm.password ).then( function( loginSuccess ) {
		console.log($scope.redirectOption + " is the redirect");
			$scope.redirectUser( loginSuccess, $scope.redirectOption );
		});
		
		$scope.loginForm.password = '';
	};

	$scope.status = UserService.status;
	$scope.doLogout = UserService.logout;
	
	$scope.redirectUser = function(loginSuccess, redirectOption) {
		// If option is equal to portfolio && login was successful, then redirect...
		// If options is equal to CRS && login was successful, then redirect....
		// else redirect location('');
		if(!redirectOption){
			$location.path('/');
		}else{
			window.location.href = redirectOption;
		}
	};
}]);