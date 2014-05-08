'use strict';

angular.module('Firebase').factory('FirebaseIO', function() {
	// we call this factory 'FirebaseIO' instead of just 'Firebase' to avoid any naming
	// conflicts with the Firebase Javascript library
	return new Firebase('https://fiumyhonors.firebaseio.com/');
});
