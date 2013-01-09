'use strict';

var myhonorsEvents = angular.module('myhonorsEvents', ['ngResource']);

/* Config */

myhonorsEvents.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/events', {templateUrl: 'assets/partials/events.html', controller: 'EventBrowseCtrl'}).
		when('/events/:eventId', {templateUrl: 'assets/partials/events-view.html', controller: 'EventViewCtrl'}).
		when('/events/add', {templateUrl: 'assets/partials/events-add.html', controller: 'EventViewCtrl'}).
		when('/citizenship', {templateUrl: 'assets/partials/citizenship.html', controller: 'CitizenshipCtrl'});
}]);

/* Services */

myhonorsEvents.factory('Events', ['$resource', function($resource) {
	return $resource('events/:eventId');
}]);

/* Controllers */

myhonorsEvents.controller('EventBrowseCtrl', ['$scope', 'Events', function EventBrowseCtrl($scope, Events) {
	Events.query(function(events) {
		//success
		$scope.events = events;

		for (var i = 0; i < $scope.events.length; i++)
		{
			// format event types
			switch ($scope.events[i].type)
			{
				case "h": $scope.events[i].type = "Honors Hour"; break;
				case "c": $scope.events[i].type = "Colloquia"; break;
				case "e": $scope.events[i].type = "Excellence Lecture"; break;
				case "a": $scope.events[i].type = "Attendance Only"; break;
			}
		}
	});
}]);

myhonorsEvents.controller('EventViewCtrl', ['$scope', '$routeParams', 'Events', function EventViewCtrl($scope, $routeParams, Events) {
	$scope.eventId = $routeParams.eventId;
	Events.get({eventId: $scope.eventId}, function(data) {
		//success
		$scope.event = data;

		switch ($scope.event.type)
		{
			case "h": $scope.event.type = "Honors Hour"; break;
			case "c": $scope.event.type = "Colloquia"; break;
			case "e": $scope.event.type = "Excellence Lecture"; break;
			case "a": $scope.event.type = "Attendance Only"; break;
		}
	});

	$scope.renderMap = function(location) {	
		return '<iframe width="950" height="300" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="' + location + '"></iframe>';
	}
}]);

myhonorsEvents.controller('CitizenshipCtrl', ['$scope', '$http', function CitizenshipCtrl($scope, $http) {
	$scope.userid = '';
	$scope.loading = false; // used to adjust display when waiting for AJAX responses

	var clearRequirements = function() {
		$scope.honorshours = [];
		$scope.colloquia = [];
		$scope.excellence = [];
	}

	// initialize the arrays
	clearRequirements();

	$scope.fetch = function() {
		$scope.loading = true;
		
		$http.get('attendance/' + $scope.userid).success(function(data) {
			// sorts the data into their separate event types
			angular.forEach(data.events, function(e) {
				switch (e.type)
				{
					case "h": $scope.honorshours.push(e); break;
					case "c": $scope.colloquia.push(e); break;
					case "e": $scope.excellence.push(e); break;
				}
			});

			$scope.loading = false;
		});
	};

	$scope.requirementsComplete = function(type) {
		switch (type)
		{
			case "h": return Boolean($scope.honorshours.length >= 3);
			case "c": return Boolean($scope.colloquia.length >= 1);
			case "e": return Boolean($scope.excellence.length >= 1);
		}
	};

	// checks whether we want to fetch the user's info or not, based on whether they've entered a 7-digit number
	$scope.doFetch = function() {
		if ($scope.userid.length === 7) {
			clearRequirements(); // start fresh
			$scope.fetch();
		}
	};
}]);