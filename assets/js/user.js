'use strict';

angular.module('myhonorsUser', []).

config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/login', {templateUrl: 'assets/partials/login.html', controller: 'LoginCtrl', requireLogin: false, resolve: appResolve}).
		when('/signup', {templateUrl: 'assets/partials/signup.html', controller: 'SignupCtrl', requireLogin: false, resolve: appResolve}).
		when('/profile/:userId', {templateUrl: 'assets/partials/profile.html', requireLogin: true, resolve: appResolve}).
		when('/profile/:userId/edit', {templateUrl: 'assets/partials/profile-edit.html', controller: 'ProfileEditCtrl', requireLogin: true, resolve: appResolve});
}]).

controller('LoginCtrl', ['$scope', '$rootScope', '$route', '$location', 'FirebaseIO', function($scope, $rootScope, $route, $location, FirebaseIO) {
	$scope.login = $rootScope.login;
	$scope.profile = $rootScope.profile;
	//used for navigating between the Login box and the Forgot Password? box
	$scope.currentPage = 'loginPage';
}]).

controller('SignupCtrl', ['$scope', '$rootScope', '$http', function($scope, $rootScope, $http) {
	$scope.signup = $rootScope.signup;
	$scope.doRegistration = $rootScope.doRegistration;

	$scope.doVerification = function() {
		var data = 'pid=' + $scope.signup.pantherID + '&password=' + $scope.signup.myAccountsPassword;
		$http.post('auth.php', data, {headers: {'Content-Type' : 'application/x-www-form-urlencoded'}}).success(function(result) {
			if (result.success === true) {
				$scope.signup.verified = true;
				$scope.signup.error = ''; // reset in case user previously made an error, so no error is displayed when verification is successful
			} else {
				$scope.signup.error = result.error;
			}
		})
	};
}]).

controller('ProfileEditCtrl', ['$scope', '$rootScope', '$routeParams', '$location', function EventBrowseCtrl($scope, $rootScope, $routeParams, $location) {
	$scope.profileEdit = Profile.get({id: $routeParams.userId}, function(data) {console.log(data);});

	$scope.profileSave = function() {
		$scope.profileEdit.$save(function(data) {
			$rootScope.profileData = data;
			$location.path('/profile/' + $routeParams.userId);
		});
	};

}]);
