'use strict';

angular.module('myhonorsEvents').config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/events', {templateUrl: 'assets/partials/events.html', controller: 'EventBrowseCtrl'}).
		when('/events/:eventId', {templateUrl: 'assets/partials/events-view.html', controller: 'EventViewCtrl'}).
		when('/events/add', {templateUrl: 'assets/partials/events-add.html', controller: 'EventViewCtrl'}).
		when('/citizenship', {templateUrl: 'assets/partials/citizenship.html', controller: 'CitizenshipCtrl'});
}]);