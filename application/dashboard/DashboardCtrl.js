'use strict';

angular.module('myhonorsDashboard').controller('DashboardCtrl', ['$scope', '$location', 'FirebaseIO', 'EventService', 'RSVPService', 'VolunteerService', 'WaitingListService', function($scope, $location, FirebaseIO, EventService, RSVPService, VolunteerService, WaitingListService) {
	$scope.events = EventService.list({limit: 3, startAt: Date.now()});
	
	$scope.submissions = VolunteerService.list();
	// Calculate the total amount of volunteer hours completed
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

	$scope.removeRSVP = function(eventId, $event, event) {
		$event.stopPropagation();
		
		$scope.rsvp = RSVPService.read(eventId);
		
		RSVPService.delete(eventId);
		
		if (event.options.waitingList) {
			WaitingListService.transferFromWaitingListToRSVP(eventId, 1 + $scope.rsvp.guests);
		}
	};

	$scope.hasRSVP = function(eventId) {
		return RSVPService.hasRSVP(eventId);
	};

	$scope.numGuests = function(eventId) {
		return RSVPService.read(eventId).guests;
	};
	
	
	/* WAITING LIST FUNCTIONALITY */
	
	$scope.addToWaitingList = function(eventId, $event) {
		$event.stopPropagation();
		WaitingListService.create(eventId);
	};
	
	$scope.isInWaitingList = function(eventId) {
		return WaitingListService.isInWaitingList(eventId);
	};
	
	$scope.removeFromWaitingList = function(eventId, $event) {
		$event.stopPropagation();
		return WaitingListService.delete(eventId);
	};
	
}]);
