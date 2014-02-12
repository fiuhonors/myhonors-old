'use strict';

angular.module('myhonorsCareer').config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/career', {
			templateUrl: 'application/career/career.html', 
			controller: 'CareerCtrl', 
			requireLogin: true, 
			resolve: appResolve}).
		when('/career/add', {
			templateUrl: 'application/career/careers-form.html',
			controller: 'CareersFormCtrl',
			requireLogin: true,
			resolve: appResolve}).
		when('/career/:positionID/edit', {
			templateUrl: 'application/career/careers-form.html',
			controller: 'CareersFormCtrl',
			requireLogin: true,
			resolve: appResolve}).
		when('/career/:positionID', {
			templateUrl: 'application/career/careers-view.html',
			controller: 'CareersViewCtrl',
			requireLogin: true,
			resolve: appResolve}).
		when('/career/:positionID/apply', {
			templateUrl: 'application/career/careers-apply.html',
			controller: 'CareersApplyCtrl',
			requireLogin: true,
			resolve: appResolve})
}]);
