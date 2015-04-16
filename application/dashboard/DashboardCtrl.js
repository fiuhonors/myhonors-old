angular.module('myhonorsDashboard').controller('DashboardCtrl', ['$scope', '$location', '$filter', 'FirebaseIO', 'EventService', 'RSVPService', 'VolunteerService', 'WaitingListService', 'CareerService', 'UserService', 'CitizenshipService', 'SwipeService', function ($scope, $location, $filter , FirebaseIO, EventService, RSVPService, VolunteerService, WaitingListService, CareerService, UserService, CitizenshipService, SwipeService) {
    
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


    $scope.rsvps = RSVPService.listByUser(UserService.profile.id, {startAt: undefined});

	$scope.goToEvent = function (eid) {
		$location.path('events/' + eid);
	};
	
	$scope.goToCareer = function (careerID) {
		$location.path('career/' + careerID);
	};

	$scope.numGuests = function (eventId) {
		return RSVPService.read(eventId).guests;
	};
	
	
    $scope.citizenshipPoints = 0;
    var citizenshipTypes = CitizenshipService.getTypes();
    $scope.eventsAttended = SwipeService.listByUser(UserService.profile.id);
    
    $scope.$watchCollection('eventsAttended', function() {
		citizenshipTypes.then( function (promise) {
			$scope.citizenshipPoints = 0;
			// Event Names added here just like $scope.citizenship.events. This checks for duplicate swipes in one event and prevents additional points for such.
			var eventsArray = [];
            var clubsAttendance = {};
            
            /**** calculate the points for BBC and Study Room Swipes *****/
            var labAttendance = 0;
            var bbcLabSwipes = UserService.profile.attendance.bbclabswipe;
            var studyRoomSwipes = UserService.profile.attendance.studyroomswipe;
            for (var k in bbcLabSwipes) if (bbcLabSwipes.hasOwnProperty(k)) labAttendance++;
            for (var k in studyRoomSwipes) if (studyRoomSwipes.hasOwnProperty(k)) labAttendance++;
            labAttendance -= 2; /* to remove the eventType properties in each object */
			var labPoints = labAttendance * promise.enabledTypes["Labs"].points;

            if (labAttendance < promise.enabledTypes["Labs"].minAttendance) labPoints = 0;
            else if (labPoints > promise.enabledTypes["Labs"].maxPoints) labPoints = promise.enabledTypes["Labs"].maxPoints;

            $scope.citizenshipPoints += labPoints;
            /************************************************************/
            
			angular.forEach($scope.eventsAttended, function(eventInfo, key) {
				if (eventInfo.name == undefined || eventInfo.types == undefined){
					return;
				}
				var eventName = eventInfo.name, 
					eventType = eventInfo.types[0],
                    eventHasClub = eventInfo.hasOwnProperty("club") && eventInfo.club.length;
				
				// Event of such a type is enabled on system_settings
				if (promise.enabledTypes.hasOwnProperty(eventType)){
					// Calculate points as necessary
					if (eventsArray.indexOf(eventName) == -1) {
                        var points = 0,
                            pointsForEventType = promise.enabledTypes[eventType].points,
                            maxPointsForEventType = promise.enabledTypes[eventType].maxPoints;

                        if (!eventHasClub) {
                            points = (maxPointsForEventType !== 0 && pointsForEventType > maxPointsForEventType) ? maxPointsForEventType : pointsForEventType;
                        }
                        else {
                            var clubName = eventInfo.club;
                            clubsAttendance[clubName] = (clubsAttendance[clubName] == null) ? 1 : clubsAttendance[clubName] + pointsForEventType;
                            if (clubsAttendance[clubName]*pointsForEventType <= maxPointsForEventType)
                                points = pointsForEventType;
                        }
						$scope.citizenshipPoints += points;
                        eventsArray.push(eventName);
					}
				}
			});
		});
	});
	
}]);


/**
 * This filter is used when listing the events that the user has RSVP'ed in dashboard.html. First, it removes all those events that already ocurred
 * (this situation can occur when a user RSVPs to an event but doesn't go). Second, it sorsts the events according to the starting time from sooner
 * to later.
*/
angular.module( 'myhonorsDashboard' ).filter( 'filterRSVPs', function() {
    return function ( events )
    {
        var upcomings = [];

        for ( var key in events ) {
            var eventItem = events[ key ];
            if ( eventItem.date && eventItem.date.starts > Date.now() )
                upcomings.push( eventItem );
        }
       
        upcomings.sort( function( a, b ) {
            return a.date.starts > b.date.starts ? 1 : -1;
        });

        return upcomings;
    }

});

