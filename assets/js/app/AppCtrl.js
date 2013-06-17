'use strict';

angular.module('myhonors').controller('AppCtrl', ['$scope', '$rootScope', 'FirebaseIO', '$route', '$location', '$http', 'webStorage', function AppCtrl($scope, $rootScope, FirebaseIO, $route, $location, $http, webStorage) {
	// AngularJS workaround for certain callbacks.
	// see https://coderwall.com/p/ngisma
	$rootScope.safeApply = function(fn) {
		var phase = this.$root.$$phase;
		if(phase == '$apply' || phase == '$digest') {
			if(fn && (typeof(fn) === 'function')) {
				fn();
			}
		} else {
			this.$apply(fn);
		}
	};

	// used to show spinners and "Loading..." messages
	$rootScope.loading = false;

	$rootScope.login = {
		pid: '',
		password: '',
		error: ''
	};

	$rootScope.authResponse = {
		'error': ''
	};

	$rootScope.doLogin = function() {
		// change state of the login button (see the HTML of the login page)
		$rootScope.loading = true;

		var data = 'pid=' + $scope.login.pid + '&password=' + $scope.login.password;
		$http.post('auth/auth.php', data, {headers: {'Content-Type' : 'application/x-www-form-urlencoded'}}).success(function(result) {
			if (result.success === true && angular.isDefined(result.token))
			{
				FirebaseIO.auth(result.token, function(error, authObject) {
					// evaluate the status of the login attempt
					if (error) {
						// an error occurred while attempting login, make sure profile object is empty
						$rootScope.safeApply(function() {
							$rootScope.profile = null;
						});

						alert(error);
					}
					else if (authObject) {
						// user successfully logged in. save token to localStorage (or cookies if browser doesn't support it)
						// so we can auth on every page load via appResolve
						webStorage.add('auth_token', result.token);

						// then check if the user has a profile. if not, create it
						var ref = FirebaseIO.child('/user_profiles/' + authObject.auth.id);

						ref.on('value', function(snapshot) {
							if (snapshot.val() === null || snapshot.child('pid').val() === null) {
								// new user, create profile for them
								ref.set({
									fname: result.fname,
									lname: result.lname,
									pid: result.pid
								});
							} else {
								// user has profile, so save profile to scope and redirect to homepage
								var profile = snapshot.val();
								profile.id = snapshot.name();
								profile.auth = authObject.auth;

								$rootScope.safeApply(function() {
									$rootScope.profile = profile;
									$location.path('');
								});
							}
						});

					}
					else {
						// user is logged out, make sure profile object is empty
						$rootScope.safeApply(function() {
							$rootScope.profile = null;
						});
					}
				});
			}
			else
			{
				alert(result.error);
				$scope.authResponse.error = result.error;
			}

			// clear the password after we get a response and evaluate it
			$rootScope.safeApply(function() {
				$rootScope.login.password = '';
			});
		});
	};
	
	$rootScope.doLogout = function() {
		webStorage.remove('auth_token');
		FirebaseIO.unauth(); 
		$rootScope.profile = null;
		$location.path('/login');
	};

	$rootScope.profile = null;

	$rootScope.$on('$routeChangeSuccess', function() {
		// clear any loading messages after the route has successfully changed
		$rootScope.loading = false;
	});

	$rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
		switch (rejection)
		{
			case 'NO_PROFILE_FOUND':
			case 'NOT_LOGGED_IN':
			default:
				console.log(rejection);
				$location.path('login');
				break;
		}
	});

	$rootScope.page_title = "";
}]);