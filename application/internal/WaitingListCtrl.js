'use strict'

angular.module('myhonorsInternal').controller('WaitingListCtrl', function($scope, $http, $timeout, $routeParams, WaitingListService, EventService, FirebaseIO) {
	$scope.waitingList = WaitingListService.list($routeParams.eventID);	//Get list of RSVP's
	$scope.eventID = $routeParams.eventID;
	
	EventService.read($routeParams.eventID, function(data) {
		$timeout(function() {
			$scope.event = data;
		});
	});
	
	$scope.exportExcel = function() {
		//Point the window's location to rsvp-list-export.php with the necessary event variables and the export type "Excel"
		//window.location = "application/internal/rsvps-list-export.php?exportType=Excel&eventID=" + $routeParams.eventID + "&eventName=" + $scope.event.name;
	};
	
	$scope.exportCSV = function() {
		//Point the window's location to rsvp-list-export.php with the necessary event variables and the export type "CSV"
		//window.location = "application/internal/rsvps-list-export.php?exportType=CSV&eventID=" + $routeParams.eventID + "&eventName=" + $scope.event.name;
	};
	
	$scope.removeFromWaitingList = function(user) {	
		var confirmation = confirm("Are you sure you wish to delete this user from the waiting list?")	

		if (confirmation) {
			WaitingListService.delete($scope.eventID, user.pid);
		}
		
	}
	
});
