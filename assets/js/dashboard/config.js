'use strict';

angular.module('myhonorsDashboard').config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/dashboard', {templateUrl: 'assets/js/dashboard/dashboard.html', controller: 'DashboardCtrl', requireLogin: true, resolve: appResolve});
}]);