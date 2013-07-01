'use strict';

angular.module('myhonorsEvents').config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/events', {templateUrl: 'assets/js/events/events.html', controller: 'EventBrowseCtrl', requireLogin: true, resolve: appResolve}).
		when('/events/:eventId', {templateUrl: 'assets/js/events/events-view.html', controller: 'EventViewCtrl', requireLogin: true, resolve: appResolve}).
		when('/events/add', {templateUrl: 'assets/js/events/events-add.html', controller: 'EventViewCtrl', requireLogin: true, resolve: appResolve}).
		when('/citizenship', {templateUrl: 'assets/js/events/citizenship.html', controller: 'CitizenshipCtrl', requireLogin: true, resolve: appResolve});
}]);