'use strict';

var myhonorsProfile = angular.module('myhonorsProfile', ['ngResource']);

/* Config */

myhonorsProfile.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/login', {templateUrl: 'assets/partials/login.html', controller: 'LoginCtrl'}).
		when('/signup', {templateUrl: 'assets/partials/signup.html', controller: 'SignupCtrl'}).
		when('/profile/:userId', {templateUrl: 'assets/partials/profile.html'}).
		when('/profile/:userId/edit', {templateUrl: 'assets/partials/profile-edit.html', controller: 'ProfileEditCtrl'});

}]);

/* Services */

myhonorsProfile.factory('Profile', function() {
	var profileObject = {};
	return profileObject;
});

myhonorsProfile.factory('Firebase', function() {
	return new Firebase('https://myhonors.firebaseio.com/');
});

myhonorsProfile.factory('FirebaseAuth', function($rootScope, Firebase) {
	var dataObject = {};
	var authClient = new FirebaseAuthClient(Firebase, function(error, user) {
		if (error) {
			// an error occurred while attempting login
			// todo: implement error messages into HTML
			alert('error: ' + error.message);
		}
		else if (user) {
			// user authenticated with Firebase
			console.log('logged in: ', user);
			dataObject.user = user;
			$rootScope.$apply();
		}
		else {
			// user is logged out
			console.log('user logged out');
			dataObject.user = null;
		}
	});
	
	dataObject.login = function(provider, email, password) {
		if (provider === 'password') {
			authClient.login('password', {
				email: email,
				password: password
			});
		}
	};
	
	dataObject.logout = function() {
		authClient.logout();  
	};
	
	return dataObject;
});

/* Controllers */

myhonorsProfile.controller('LoginCtrl', ['$scope', 'Firebase', 'FirebaseAuth', 'Profile', function($scope, Firebase, FirebaseAuth, Profile) {
	$scope.login = {email: '', password: ''};
	$scope.auth = FirebaseAuth;
	$scope.profile = Profile;
	
	$scope.$watch('auth.user', function() {
		if ($scope.auth.user) {
			Firebase.child('user_profiles/' + $scope.auth.user.id).on('value', function(snapshot) {
				$scope.$apply(function() {
					$scope.profile = snapshot.val();
				});
			});
		}
	});
	
	$scope.doLogin = function() {
		FirebaseAuth.login('password', $scope.login.email, $scope.login.password);
		$scope.login.password = '';
	};

	$scope.doLogout = function() {FirebaseAuth.logout()};

	//used for navigating between the Login box and the Forgot Password? box
	$scope.currentPage = 'login';
}]);

myhonorsProfile.controller('SignupCtrl', ['$scope', function($scope) {
	$scope.signup = {email: '', password: '', confirmPassword: '', pantherID: '', myAccountsPassword: ''};
}]);

myhonorsProfile.controller('ProfileEditCtrl', ['$scope', '$rootScope', '$routeParams', '$location', 'Profile', function EventBrowseCtrl($scope, $rootScope, $routeParams, $location, Profile) {
	$scope.profileEdit = Profile.get({id: $routeParams.userId}, function(data) {console.log(data);});

	$scope.profileSave = function() {
		$scope.profileEdit.$save(function(data) {
			$rootScope.profileData = data;
			$location.path('/profile/' + $routeParams.userId);
		});
	};

}]);