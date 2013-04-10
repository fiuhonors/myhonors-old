'use strict';

angular.module('Firebase', []).

factory('Database', function() {
	return new Firebase('https://myhonors.firebaseio.com/');
});