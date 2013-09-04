'use strict';

angular.module('myhonors', [
	// module dependencies
	'webStorageModule',
	'ui.bootstrap',
	'ui.bootstrap.calendar',
	'leaflet-directive',
	'myhonorsConfig',
	'Firebase',
	'myhonorsUser',
	'myhonorsAdmin',
	'myhonorsComments',
	'myhonorsDashboard',
	'myhonorsCitizenship',
	'myhonorsCourses',
	'myhonorsEvents',
	'myhonorsInternal',
	'myhonorsCareer',
	'myhonorsArch'
]);

angular.module('myhonorsConfig', []);
angular.module('Firebase', []);
angular.module('myhonorsUser', []);
angular.module('myhonorsAdmin', []);
angular.module('myhonorsComments', []);
angular.module('myhonorsCourses', []);
angular.module('myhonorsDashboard', []);
angular.module('myhonorsCitizenship', []);
angular.module('myhonorsEvents', []);
angular.module('myhonorsInternal', []);
angular.module('myhonorsCareer', []);
angular.module('myhonorsArch', []);

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
	auth: function ($timeout, $route, $q, FirebaseIO, webStorage, UserService)
	{
		var deferred = $q.defer();
		var loginPromise = deferred.promise;

		// this value is determined by the requireLogin object property as defined
		// in each module's $routeProvider.when() chain. this allows us to set the
		// privacy of each page individually
		var requireLogin = $route.current.$$route.requireLogin;

		var rejectIt = function(message) {
			$timeout(function() {
				// the if/else logic here allows us to conditionally render the template
				// of the page because, if a promise is rejected, the template will not be rendered
				if (requireLogin) {
					deferred.reject(message);
				}
				else {
					deferred.resolve(message);
				}
			});
		};

		var token = webStorage.get('auth_token');

		if (token) {
			FirebaseIO.auth(token, function(error, authObject) {
				if (error) {
					// an error occurred while attempting login
					rejectIt(error.code);
				}
				else if (authObject) {
					// user authenticated with Firebase. since they have a token, we can assume they've already made it
					// past their first login, and a profile has already been created for them
					var ref = FirebaseIO.child('/user_profiles/' + authObject.auth.id);

					// update lastActivity
					ref.child('lastActivity').set(Date.now());

					ref.on('value', function(snapshot) {
						var profile = snapshot.val();
						profile.id = snapshot.name();

						$timeout(function() {
							UserService.profile = profile;
							UserService.auth = authObject.auth;
							UserService.ref = ref.ref();
							deferred.resolve();
						});
					});
				}
				else {
					// user is logged out
					rejectIt('NOT_LOGGED_IN');
				}
			});
		}
		else {
			// no auth token
			rejectIt('NOT_LOGGED_IN');
		}

		return loginPromise;
	}
};