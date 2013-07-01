'use strict';

angular.module('myhonors').config(['$routeProvider', function($routeProvider) {
	// set global redirect, this is effectively where our users get sent if
	// they try to a access a route that doesn't exist (like a 404 redirect)
	$routeProvider.otherwise({redirectTo:'/arch'});
}]);