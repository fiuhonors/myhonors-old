'use strict';

angular.module('myhonorsDashboard').config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/dashboard', {templateUrl: 'application/dashboard/dashboard.html', controller: 'DashboardCtrl', requireLogin: true, resolve: appResolve});
}]);