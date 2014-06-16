'use strict'

angular.module('myhonorsUser').factory('UserService', function($http, $location, $timeout, $q, FirebaseIO, webStorage) {
	var login = function(username, password) {
		// used to show "Loading..." status after clicking Login button
		this.status.loading = true;

		var self = this;
		var defer = $q.defer();	
		var data = 'pid=' + username + '&password=' + password;
		$http.post('auth/auth.php', data, {headers: {'Content-Type' : 'application/x-www-form-urlencoded'}}).success(function(result) {
			var loginSuccess = false;
			if (result.success === true && angular.isDefined(result.token))
			{
				FirebaseIO.auth(result.token, function(error, authObject) {
					// evaluate the status of the login attempt
					if (error) {
						// an error occurred while attempting login, make sure profile object is empty
						$timeout(function() {
							self.profile = null;
						});

						alert(error);
					}
					else if (authObject) {
						// user successfully logged in. save token to localStorage (or cookies if browser doesn't support it)
						// so we can auth on every page load via appResolve
						webStorage.add('auth_token', result.token);
						loginSuccess = true;
						defer.resolve( loginSuccess );

						// then check if the user has a profile. if not, create it
						var ref = FirebaseIO.child('/user_profiles/' + authObject.auth.id);

						ref.once('value', function(snapshot) {
							// If the user profile doesn't exist then that means 
							if (snapshot.val() === null) {
								alert("You must be an Honors student if you wish to login.");
								$timeout(function() {
									self.profile = null;
									self.status.loading = false;
								});
								return;
							}
							// If information has been pre-loaded into their user profile, but the user has never actually logged in before
							else if (snapshot.child('lastActivity').val() === null ||
									  snapshot.child('fname').val() === null ||
									  snapshot.child('lname').val() === null)
							{
								// new user, create profile for them
								ref.child('fname').set(result.fname);
								ref.child('lname').set(result.lname);
								ref.child('pid').set(result.pid);
								ref.child('lastActivity').set(Date.now());
							} else {
								// user has profile. update lastActivity
								ref.child('lastActivity').set(Date.now());

								var profile = snapshot.val();
								profile.id = snapshot.name();

								// save data to object
								$timeout(function() {
									self.profile = profile;
									self.auth = authObject.auth;
									self.ref = ref.ref();
								})

								// redirect to homepage
								//$location.path('');
								self.status.loading = false;
							}
						});

					}
					else {
						// user is logged out, make sure profile object is empty
						$timeout(function() {
							self.profile = null;
							self.status.loading = false;
						});
					}
				});
			}
			else
			{
				alert(result.error);
				self.status.loading = false;
			}
			
		});
		
		return defer.promise;
		
	};

	var logout = function() {
		$http.get('auth/un_auth.php', {headers: {'Content-Type' : 'application/x-www-form-urlencoded'}});
		webStorage.remove('auth_token');
		FirebaseIO.unauth(); 
		this.profile = null;
		$location.path('/login');
	};
	
	/**
	 * Check if a certain userId already exists and executes a callback with the boolean result
	 */
	var exists = function(userId, callback) {
		if (!angular.isString(userId) || userId.length === 0) {
			callback(false);
			return;
		}

		FirebaseIO.child('user_profiles/' + userId).once('value', function(snapshot) {
			if (snapshot.val() === null) {
				callback(false);
			} else {
				callback(true, snapshot.val());
			}
		});
	};

	return {
		profile: null,
		auth: null,
		ref: null,
		status: {loading: false}, // used to show "Loading..." status after clicking Login button
		login: login,
		logout: logout,
		exists: exists
	};
});
