

angular.module('myhonorsInternal').controller('StudentInfoCtrl', function ($scope, $http, $timeout, $routeParams, FirebaseIO, SwipeService, VolunteerService, UserService) {
    
    'use strict';
    
	$scope.pid = $routeParams.pid;
	$scope.volunteerHours = VolunteerService.list($scope.pid);
	$scope.eventsAttended = SwipeService.listByUser($scope.pid);	// All the events that the user attended
	
	UserService.exists($routeParams.pid, function(exists, result) {
		$timeout(function() {
			if (exists) {
				$scope.user = result;
			}
		});
	});
		
	/******* Events Attendance *********/
	
	// Holds pairs of the form (event type, collection) where collection is the set of events of that type that the user attended
	$scope.eventTypeCollections = {};	
	
	/**
	 * The following watches the eventsAttended collection and executes the function when a change in that variable occurs.
	 * The overall goal of this function is to sort the events by their type so that the view can show them in categories.
	 * 
	 */ 
	$scope.$watch('eventsAttended', function() {
		angular.forEach($scope.eventsAttended, function(eventInfo, key) {
			var eventName = eventInfo.name;
		    var eventType = eventInfo.types[0];
		    
		    // If we don't have a property in the eventTypeCollections object corresponding to that event type, we just add it.
			if (!$scope.eventTypeCollections[eventType])
				$scope.eventTypeCollections[eventType] = {};
				

			/* 
			 * Create a property for the event type object with the name of the current event we are iterating over and set it as the value
			 * the event object which contains all the event's information in Firebase.
			*/
			$scope.eventTypeCollections[eventType][eventName] = eventInfo;
		});
	});
	
	/**
	 * Removes the user's attendance from a particular event
	 * 
	 * @param collection The eventTypeCollections object corresponding to that event type
	 * @param event The event where the user's attenance will be removd
	 * 
	 */
	$scope.removeAttendance = function(collection,event) {	
		var confirmation = confirm("Are you sure you wish to delete this user's attendance from the event?")	

		if (confirmation) {
			SwipeService.removeAttendance(event.$id, $scope.pid);
			delete collection[event.name]	// Remove the event from the collection to keep it updated in the view
		}
		
	}
	
	
	/********* Volunter Hours *******/
	$scope.hoursCompleted = 0;	
	$scope.countVolunteerHours = function (submission) {
		if (submission.status == "accepted" && submission.hours) {
			$scope.hoursCompleted += submission.hours;
		}
	}
	
	$scope.removeVolunteerHours = function(volunteerHour) {	
		// We ask the user for a double confirmation before deleting the volunteer hours
		var confirmation1 = confirm("Are you sure you wish to delete this volunteer hour?")	
		var confirmation2 = false;	
		
		if (confirmation1) 
			confirmation2 = confirm("All the information of this volunteer hour will be deleted. Are you sure you wish to proceed?");
			
			
		if (confirmation1 && confirmation2) {
			VolunteerService.remove(volunteerHour, $scope.pid);	
		
			$scope.hoursCompleted = 0;	//Reset the total volunteer hours counter
			$scope.volunteerHours = VolunteerService.list($scope.pid);	//Reload the volunteer hours list
		}
	}
	
	
});
