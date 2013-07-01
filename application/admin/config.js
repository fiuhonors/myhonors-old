'use strict';

angular.module('myhonorsAdmin').config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/admin', {templateUrl: 'application/admin/admin.html', controller: 'AdminCtrl', requireLogin: true, resolve: appResolve})
}]);