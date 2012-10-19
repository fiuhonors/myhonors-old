'use strict';

/* App Module */

angular.module('MyHonors', ['myhonorsServices']).

	config(['$routeProvider', function($routeProvider) {
	$routeProvider.		
		when('/events', {templateUrl: 'partials/events.html', controller: EventBrowseCtrl}).
		when('/events/:eventId', {templateUrl: 'partials/events-view.html', controller: EventViewCtrl}).
		when('/events/add', {templateUrl: 'partials/events-add.html', controller: EventViewCtrl}).
		when('/citizenship', {templateUrl: 'partials/citizenship.html', controller: CitizenshipCtrl}).
		otherwise({redirectTo:'/home', templateUrl: 'partials/home.html'});
	}]);