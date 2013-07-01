'use strict';

angular.module('myhonorsEvents').controller('EventBrowseCtrl', ['$scope', '$timeout', 'FirebaseIO', '$location', 'EventService', 'RSVPService', function ($scope, $timeout, FirebaseIO, $location, EventService, RSVPService) {
	$scope.searchName = '';
	$scope.searchType = '';
	$scope.events = EventService.list();

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