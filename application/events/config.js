'use strict';

angular.module('myhonorsEvents').config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/events', {templateUrl: 'application/events/events.html', controller: 'EventBrowseCtrl', requireLogin: true, resolve: appResolve}).
		when('/events/add', {templateUrl: 'application/events/events-add.html', controller: 'EventAddCtrl', requireLogin: true, resolve: appResolve}).
		when('/events/:eventId', {templateUrl: 'application/events/events-view.html', controller: 'EventViewCtrl', requireLogin: true, resolve: appResolve}).
		when('/events/:eventId/edit', {
			templateUrl: 'application/events/events-edit.html',
			controller: 'EventEditCtrl',
			requireLogin: true,
			resolve: appResolve }).
		when('/events/:eventId/swipe', {
			templateUrl: 'application/events/swipe.html',
			controller: 'SwipeCtrl',
			requireLogin: true,
			resolve: appResolve,
			showPanels: false });
}]);