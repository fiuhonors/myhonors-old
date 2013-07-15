'use strict';

angular.module('myhonorsDashboard').controller('DashboardCtrl', ['$scope', '$location', 'FirebaseIO', 'EventService', 'RSVPService', function($scope, $location, FirebaseIO, EventService, RSVPService) {
	$scope.events = EventService.list();

	$scope.goToEvent = function(eid) {
		$location.path('/events/' + eid);
	};

	$scope.addRSVP = function(eventId, $event) {
		$event.stopPropagation();
		RSVPService.create(eventId);
	};

	$scope.removeRSVP = function(eventId, $event) {
		$event.stopPropagation();
		RSVPService.delete(eventId);
	};

	$scope.hasRSVP = function(eventId) {
		return RSVPService.hasRSVP(eventId);
	};
}]);