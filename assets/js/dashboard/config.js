'use strict';

angular.module('myhonorsDashboard').config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/dashboard', {templateUrl: 'assets/partials/dashboard.html', controller: 'DashboardCtrl', requireLogin: true, resolve: appResolve});
}]);