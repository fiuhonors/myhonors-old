

angular.module('myhonorsDashboard').controller('DashboardCtrl', ['$scope', '$location', 'FirebaseIO', 'EventService', 'RSVPService', 'VolunteerService', 'WaitingListService', 'CareerService', 'UserService', 'CitizenshipService', 'SwipeService', function ($scope, $location, FirebaseIO, EventService, RSVPService, VolunteerService, WaitingListService, CareerService, UserService, CitizenshipService, SwipeService) {
    
    'use strict';
    
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
    var citizenshipTypes = CitizenshipService.getTypes();
    $scope.eventsAttended = SwipeService.listByUser(UserService.profile.id);
    
    $scope.$watchCollection('eventsAttended', function() {
		citizenshipTypes.then( function (promise) {
			$scope.citizenshipPoints = 0;
			// Event Names added here just like $scope.citizenship.events. This checks for duplicate swipes in one event and prevents additional points for such.
			var eventsArray = [];
			
			angular.forEach($scope.eventsAttended, function(eventInfo, key) {
				if (eventInfo.name == undefined || eventInfo.types == undefined){
					return;
				}
				var eventName = eventInfo.name, 
					eventType = eventInfo.types[0];
				
				// Event of such a type is enabled on system_settings
				if (promise.enabledTypes.hasOwnProperty(eventType)){
					// Calculate points as necessary
					if (eventsArray.indexOf(eventName) == -1) {
						var pointsForEventType = promise.enabledTypes[eventType].points,
							maxPointsForEventType = promise.enabledTypes[eventType].maxPoints;
						$scope.citizenshipPoints += (maxPointsForEventType !== 0 && pointsForEventType > maxPointsForEventType) ? maxPointsForEventType : pointsForEventType;
						eventsArray.push(eventName);
					}
				}
			});
		});
	});
	
}]);