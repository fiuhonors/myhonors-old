'use strict';

angular.module('myhonors', [
	// module dependencies
	'LocalStorageModule',
	'myhonorsConfig',
	'Firebase',
	'myhonorsUser',
	'myhonorsDashboard',
	'myhonorsEvents',
	'myhonorsCareer'
]);

angular.module('myhonorsConfig', []);
angular.module('Firebase', []);
angular.module('myhonorsUser', []);
angular.module('myhonorsDashboard', []);
angular.module('myhonorsEvents', []);
angular.module('myhonorsCareer', []);

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
	auth: function ($rootScope, $route, $q, FirebaseIO, localStorageService)
	{
		var deferred = $q.defer();
		var loginPromise = deferred.promise;

		// this value is determined by the requireLogin object property as defined
		// in each module's $routeProvider.when() chain. this allows us to set the
		// privacy of each page individually
		var requireLogin = $route.current.$$route.requireLogin;

		var rejectIt = function(message) {
			// the if/else logic here allows us to conditionally render the template
			// of the page because, if a promise is rejected, the template will not be rendered
			if (requireLogin) {
				deferred.reject(message);
			}
			else {
				deferred.resolve(message);
			}
		};

		var token = localStorageService.get('auth_token');

		if (token) {
			console.log('debug2');
			FirebaseIO.auth(token, function(error, authObject) {
				console.log('debug3');
				if (error) {
					console.log('debug4');
					// an error occurred while attempting login
					rejectIt(error);
				}
				else if (authObject) {
					console.log('debug5');
					// user authenticated with Firebase
					$rootScope.safeApply(function() {
						deferred.resolve(authObject)
					});
				}
				else {
					console.log('debug6');
					// user is logged out
					drejectIt('NOT_LOGGED_IN');
				}
			});
		}
		else {
			console.log('debug7');
			rejectIt('NOT_LOGGED_IN');
		}

		return loginPromise;
	}
};