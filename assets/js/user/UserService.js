'use strict'

angular.module('myhonorsUser').factory('UserService', function($http, $location, $timeout, FirebaseIO, webStorage) {
	var login = function(username, password) {
		// used to show "Loading..." status after clicking Login button
		this.status.loading = true;

		var self = this;

		var data = 'pid=' + username + '&password=' + password;
		$http.post('auth/auth.php', data, {headers: {'Content-Type' : 'application/x-www-form-urlencoded'}}).success(function(result) {
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

						// then check if the user has a profile. if not, create it
						var ref = FirebaseIO.child('/user_profiles/' + authObject.auth.id);

						ref.once('value', function(snapshot) {
							// if user profile doesn't exist, OR if information has been pre-loaded into
							// their user profile, but the user has never actually logged in before
							if (snapshot.val() === null || snapshot.child('lastActivity').val() === null) {
								// new user, create profile for them
								ref.set({
									fname: result.fname,
									lname: result.lname,
									pid: result.pid,
									lastActivity: Date.now()
								});
							} else {
								// user has profile. update lastActivity
								ref.child('lastActivity').set(Date.now());

								var profile = snapshot.val();
								profile.id = snapshot.name();

								// save data to object
								$timeout(function() {
									self.profile = profile;
									self.auth = authObject.auth;
								})

								// redirect to homepage
								$location.path('');
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
	};

	var logout = function() {
		webStorage.remove('auth_token');
		FirebaseIO.unauth(); 
		this.profile = null;
		$location.path('/login');
	};

	return {
		profile: null,
		auth: null,
		status: {loading: false}, // used to show "Loading..." status after clicking Login button
		login: login,
		logout: logout
	};
});