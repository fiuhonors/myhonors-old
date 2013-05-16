'use strict';

angular.module('myhonors').config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/home', {templateUrl: 'assets/partials/home.html', requireLogin: true, resolve: appResolve}).
		otherwise({redirectTo:'/home'});
}]);