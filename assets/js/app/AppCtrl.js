'use strict';

angular.module('myhonors').controller('AppCtrl', ['$scope', '$rootScope', 'FirebaseIO', '$route', '$location', function AppCtrl($scope, $rootScope, FirebaseIO, $route, $location) {
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
		email: '',
		password: '',
		error: ''
	};

	$rootScope.signup = {
		email: '',
		password: '',
		confirmPassword: '',
		pantherID: '',
		myAccountsPassword: '',
		verification: {
			'success': false,
			'fname': '',
			'lname': ''
		},
		error: '' // this will hold signup form errors (e.g. passwords aren't the same) and verification errors
	};

	var authClient = new FirebaseAuthClient(FirebaseIO, function(error, user) {
		// evaluate the status of the login attempt
		if (error) {
			// an error occurred while attempting login
			alert(error);
		}
		else if (user) {
			// user is logged in. we first want to check if the user has a profile. if not, create it
			var ref = FirebaseIO.child(/user_profiles/ + user.id);

			ref.on('value', function(snap) {
				if (snap.val() === null) {
					// new user, create profile for them
					ref.set({
						fname: $rootScope.signup.verification.fname,
						lname: $rootScope.signup.verification.lname,
						pid: $rootScope.signup.pantherID
					});
				} else {
					// user has profile, just redirect to homepage
					$rootScope.safeApply(function() {
						$location.path('');
					});
				}
			});

		}
		else {
			// user is logged out
			// do nothing
		}

		// clear the password and loading message after we get a response and evaluate it
		// (it looks best on the UI to wait until this point)
		$rootScope.safeApply(function() {
			$rootScope.loading = false;
			$rootScope.login.password = '';
		});
	});

	$rootScope.doLogin = function() {
		// change state of the login button (see the HTML of the login page)
		$rootScope.loading = true;

		authClient.login('password', {
			email: $rootScope.login.email,
			password: $rootScope.login.password
		});
	};
	
	$rootScope.doLogout = function() {
		authClient.logout(); 
		$rootScope.profile = null;
		$location.path('/login');
	};

	$rootScope.doRegistration = function() {
		authClient.createUser($rootScope.signup.email, $rootScope.signup.password, function(error, user) {
			if (!error) {
				console.log('Success! User Id: ' + user.id + ', Email: ' + user.email);
				
				// now we want to add the user_profile entry, but we need to be authenicated in order
				// to write to the user_profiles location. since we still have the email/password combination
				// in $rootScope.signup, let's just do it for the user!

				// since this is an asynchronous request, we can only call the login function and place the
				// user_profile logic in the authClient's callback
				authClient.login('password', {
					email: $rootScope.signup.email,
					password: $rootScope.signup.password,
				});
			}
		});
	}

	$rootScope.profile = null;

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