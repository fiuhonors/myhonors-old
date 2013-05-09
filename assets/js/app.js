'use strict';

var appResolve = {
	/**
	 * This auth function gets executed on each page load of every route
	 * that has a "resolve: appResolve" property attaced to its
	 * $routeProvider.when() definition.
	 *
	 * It uses AngularJS's $q service ( http://docs.angularjs.org/api/ng.$q )
	 * to first create a deferred object and promise. After this promise is
	 * resolved (via FirebaseAuthClient's callback), the loginPromise.then()
	 * callbacks are executed. These determine the value of the final promise,
	 * which the application is waiting to get resolved before displaying any
	 * content (see http://www.youtube.com/watch?v=Kr1qZ8Ik9G8 ).
	 */
	auth: function ($rootScope, $route, $q, FirebaseIO)
	{
		var deferred = $q.defer();
		var loginPromise = deferred.promise;

		var finalPromise = loginPromise.then(function(user) {
			// grab user profile
			FirebaseIO.child('user_profiles/' + user.id).on('value', function(snapshot) {
				if (snapshot.val() === null) {
					return rejectIt('NO_PROFILE_FOUND');
				}

				$rootScope.safeApply(function() {
					$rootScope.profile = snapshot.val();
				});

				return snapshot.val();
			});

		}, function(error) {
			return rejectIt(error);
		});

		// this value is determined by the requireLogin object property as defined
		// in each module's $routeProvider.when() chain. this allows us to set the
		// privacy of each page individually
		var requireLogin = $route.current.$$route.requireLogin;

		var rejectIt = function(message) {
			// the if/else logic here allows us to conditionally render the template
			// of the page because, if a promise is rejected, the template will not be rendered
			if (requireLogin) {
				return $q.reject(message);
			}
			else {
				return message;
			}
		};

		var authClient = new FirebaseAuthClient(FirebaseIO, function(error, user) {
			if (error) {
				// an error occurred while attempting login
				deferred.reject(error);
			}
			else if (user) {
				// user authenticated with Firebase
				$rootScope.safeApply(function() {deferred.resolve(user)});
			}
			else {
				// user is logged out
				deferred.reject('NOT_LOGGED_IN');
			}
		});

		return finalPromise;
	}
};

angular.module('myhonors', ['myhonorsConfig', 'Firebase', 'myhonorsUser', 'myhonorsEvents', 'myhonorsCareer']).

config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/home', {template: 'Welcome home!', requireLogin: true, resolve: appResolve}).
		otherwise({redirectTo:'/home'});
}]).

controller('AppCtrl', ['$scope', '$rootScope', 'FirebaseIO', '$route', '$location', function AppCtrl($scope, $rootScope, FirebaseIO, $route, $location) {
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
	});

	$rootScope.doLogin = function() {
		authClient.login('password', {
			email: $rootScope.login.email,
			password: $rootScope.login.password
		});

		$rootScope.login.password = '';
		// $rootScope.login.error = '';
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
}]).

directive('imgRotate', function($timeout) {
		return function(scope, elm, attrs) {
			// make the images sit on top of each other
			elm.addClass('img-rotate');

			var children = elm.children();
			var first = children.first();
			var current = first;
			var previous = null;

			var delay = attrs.delay || 2000;

			children.css('display', 'none');
			current.css('display', 'block');

			// base case: if there are less than two images, we have nothing to rotate
			if (children.length < 2) {
				return;
			}

			// rotate!
			$timeout(function rotate() {
				if (current.next().length === 0) {
					first.css('display', 'block');
					current.fadeOut();
					current = first;
				}
				else {
					previous = current;
					current = current.next();
					current.fadeIn(function() {
						previous.css('display', 'none');
					});
				}

				// do it again!
				$timeout(rotate, delay, false);
			}, delay, false);
	};
}).

directive('fileupload', function () {
	return {
		restrict: 'E',
		template: '<input type="file" name="file" onchange="angular.element(this).scope().setFile(this)">',
		replace: true,
		controller: function ($scope) {
			$scope.setFile = function (elem) {
				var fd = new FormData(),
					xhr = new XMLHttpRequest();

				fd.append("file", elem.files[0]);

				xhr.open("POST", "api/upload", true);
				xhr.send(fd);
			};
		}
	};
});