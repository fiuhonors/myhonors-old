'use strict';

angular.module('myhonors', [
	// module dependencies
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
angular.module('myhonorsEvents', ['ngResource']);
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