'use strict';

/* App Module */

angular.module('MyHonors', ['myhonorsServices']).

	config(['$routeProvider', function($routeProvider) {
	$routeProvider.		
		when('/events', {templateUrl: 'partials/events.html', controller: EventCtrl}).
		when('/events/:eventId', {templateUrl: 'partials/events-view.html', controller: EventCtrl}).
		when('/events/add', {templateUrl: 'partials/events-add.html', controller: EventCtrl}).
		when('/citizenship', {templateUrl: 'partials/citizenship.html', controller: CitizenshipCtrl}).
		otherwise({redirectTo:'/home', templateUrl: 'partials/home.html'});
	}]);