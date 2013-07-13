'use strict';

angular.module('myhonorsEvents').controller('EventBrowseCtrl', ['$scope', '$timeout', 'FirebaseIO', '$location', '$filter', 'EventService', 'RSVPService', function ($scope, $timeout, FirebaseIO, $location, $filter, EventService, RSVPService) {
	$scope.searchName = '';
	$scope.searchType = '';
	$scope.nothing = null; // needed for the calendar directive
	$scope.events = EventService.list();

	$scope.getEvents = function() {
		return $filter('filter')($scope.events, {name: $scope.searchName, type: $scope.searchType});
	}

	$scope.goToEvent = function(eid) {
		$location.path('/events/' + eid);
	};

	$scope.addRSVP = function(eventId, $event) {
		$event.stopPropagation();
		RSVPService.create(eventId);
	}

	$scope.removeRSVP = function(eventId, $event) {
		$event.stopPropagation();
		RSVPService.delete(eventId);
	}

	$scope.hasRSVP = function(eventId) {
		return RSVPService.hasRSVP(eventId);
	}
}]);