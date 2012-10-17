'use strict';

/* App Module */

angular.module('MyHonors', ['myhonorsServices']).

	config(['$routeProvider', function($routeProvider) {
	$routeProvider.		
		when('/calendar', {templateUrl: 'partials/calendar.html', controller: CalendarCtrl}).
		when('/calendar/:eventId', {templateUrl: 'partials/calendar-event.html', controller: CalendarCtrl}).
		when('/calendar/add', {templateUrl: 'partials/calendar-add.html', controller: CalendarCtrl}).
		when('/citizenship', {templateUrl: 'partials/citizenship.html', controller: CitizenshipCtrl}).
		otherwise({redirectTo:'/home', templateUrl: 'partials/home.html'});
	}]);