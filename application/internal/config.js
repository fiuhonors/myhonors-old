'use strict';

angular.module('myhonorsInternal').config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/internal', {
			templateUrl: 'application/internal/internal.html',
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
			requireLogin: true,
			resolve: appResolve,
			showPanels: false });
}]);