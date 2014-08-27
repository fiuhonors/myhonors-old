'use strict';

angular.module('myhonorsDashboard').controller('DashboardCtrl', ['$scope', '$location', 'FirebaseIO', 'EventService', 'RSVPService', 'VolunteerService', 'WaitingListService', 'CareerService', 'UserService', 'CitizenshipService', function ($scope, $location, FirebaseIO, EventService, RSVPService, VolunteerService, WaitingListService, CareerService, UserService, CitizenshipService) {
	$scope.events = EventService.list({limit: 3, startAt: Date.now()});
    // Undefined is passed to 'startAt' so that Firebase's query starting point will be the start of the data. This then returns the newest internships
	$scope.careers = CareerService.list({limit: 3, startAt: undefined});
	
	$scope.submissions = VolunteerService.list(UserService.profile.id);
	// Calculate the total amount of volunteer hours completed
	$scope.hoursCompleted = 0;
	$scope.addVolunteerHours = function (submission) {
		if (submission.status == "accepted" && submission.hours) {
			$scope.hoursCompleted += submission.hours;
		}
	};


	$scope.goToEvent = function (eid) {
		$location.path('events/' + eid);
	};
	
	$scope.goToCareer = function (careerID) {
		$location.path('career/' + careerID);
	};

	$scope.addRSVP = function (eventId, $event) {
		$event.stopPropagation();
		RSVPService.create(eventId, {guests: 0});
	};

	$scope.removeRSVP = function (eventId, $event, event) {
		$event.stopPropagation();
		
		$scope.rsvp = RSVPService.read(eventId);
		
		RSVPService.delete(eventId);
		
		if (event.options.waitingList) {
			WaitingListService.transferFromWaitingListToRSVP(eventId, 1 + $scope.rsvp.guests);
		}
	};

	$scope.hasRSVP = function (eventId) {
		return RSVPService.hasRSVP(eventId);
	};

	$scope.numGuests = function (eventId) {
		return RSVPService.read(eventId).guests;
	};
	
	
	/* WAITING LIST FUNCTIONALITY */
	
	$scope.addToWaitingList = function (eventId, $event) {
		$event.stopPropagation();
		WaitingListService.create(eventId);
	};
	
	$scope.isInWaitingList = function (eventId) {
		return WaitingListService.isInWaitingList(eventId);
	};
	
	$scope.removeFromWaitingList = function (eventId, $event) {
		$event.stopPropagation();
		return WaitingListService.delete(eventId);
	};
    
    $scope.citizenshipPoints = 0;
    CitizenshipService.getUser().then(function (promise) {
         $scope.citizenshipPoints = promise.points; 
    });
	
}]);
