'use strict';

angular.module('myhonorsEvents').config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/events', {templateUrl: 'assets/partials/events.html', controller: 'EventBrowseCtrl', requireLogin: true, resolve: appResolve}).
		when('/events/:eventId', {templateUrl: 'assets/partials/events-view.html', controller: 'EventViewCtrl', requireLogin: true, resolve: appResolve}).
		when('/events/add', {templateUrl: 'assets/partials/events-add.html', controller: 'EventViewCtrl', requireLogin: true, resolve: appResolve}).
		when('/citizenship', {templateUrl: 'assets/partials/citizenship.html', controller: 'CitizenshipCtrl', requireLogin: true, resolve: appResolve});
}]);