'use strict';

angular.module('myhonorsAdmin').config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/admin', {templateUrl: 'assets/partials/admin.html', controller: 'AdminCtrl', requireLogin: true, resolve: appResolve})
}]);