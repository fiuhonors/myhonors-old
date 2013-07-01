'use strict';

angular.module('myhonorsCareer').config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/career', {templateUrl: 'application/career/career.html', controller: 'CareerCtrl', requireLogin: false, resolve: appResolve})
}]);