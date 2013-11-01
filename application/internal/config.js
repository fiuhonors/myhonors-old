'use strict';

angular.module('myhonorsInternal').config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/internal', {
			templateUrl: 'application/internal/internal.html',
			requireLogin: true,
			resolve: appResolve }).
		when('/internal/eventstats', {
			templateUrl: 'application/internal/event-stats.html',
			controller: 'EventStatsCtrl',
			requireLogin: true,
			resolve: appResolve }).
		when('/internal/shirtswipe', {
			templateUrl: 'application/internal/swipe.html',
			controller: 'ShirtSwipeCtrl',
			requireLogin: true,
			resolve: appResolve,
			showPanels: false }).
		when('/internal/bbclabswipe', {
			templateUrl: 'application/internal/swipe.html',
			controller: 'BBCLabSwipeCtrl',
			requireLogin: false,
			resolve: appResolve,
			showPanels: false });
}]);