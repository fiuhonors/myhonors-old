'use strict';

angular.module('myhonorsDashboard').controller('DashboardCtrl', ['$scope', '$location', 'FirebaseIO', 'EventService', 'RSVPService', 'VolunteerService', function($scope, $location, FirebaseIO, EventService, RSVPService, VolunteerService) {
	$scope.events = EventService.list({limit: 3, startAt: Date.now()});
	$scope.submissions = VolunteerService.list();

	$scope.hoursCompleted = 0;	
	$scope.addVolunteerHours = function (submission) {
		if (submission.status == "accepted" && submission.hours) {
			$scope.hoursCompleted += submission.hours;
		}
	}

	$scope.goToEvent = function(eid) {
		$location.path('/events/' + eid);
	};

	$scope.addRSVP = function(eventId, $event) {
		$event.stopPropagation();
		RSVPService.create(eventId, {guests: 0});
	};

	$scope.removeRSVP = function(eventId, $event) {
		$event.stopPropagation();
		RSVPService.delete(eventId);
	};

	$scope.hasRSVP = function(eventId) {
		return RSVPService.hasRSVP(eventId);
	};

	$scope.numGuests = function(eventId) {
		return RSVPService.read(eventId).guests;
	};
}]);
