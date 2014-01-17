'use strict'

angular.module('myhonorsInternal').controller('AttendanceListCtrl', function($scope, $http, $timeout, $routeParams, EventService, SwipeService, FirebaseIO) {
	$scope.eventID = $routeParams.eventID;
	$scope.users = SwipeService.listByEvent($routeParams.eventID);
	EventService.read($routeParams.eventID, function(data) {
		$timeout(function() {
			$scope.event = data;		
		});
	});
	
	
	$scope.exportExcel = function() {
		//Point the window's location to rsvp-list-export.php with the necessary event variables and the export type "Excel"
		window.location = "application/internal/attendance-list-export.php?exportType=Excel&eventID=" + $routeParams.eventID + "&eventName=" + $scope.event.name;
	};
	
	$scope.exportCSV = function() {
		//Point the window's location to rsvp-list-export.php with the necessary event variables and the export type "CSV"
		window.location = "application/internal/attendance-list-export.php?exportType=CSV&eventID=" + $routeParams.eventID + "&eventName=" + $scope.event.name;
	};
	
	
	$scope.bbcAttendance = {};
	$scope.getBBCLabAttendance = function(pid) {
		FirebaseIO.child('events/' + $scope.eventID + '/attendance/' + pid).on('value', function(snapshot) {
			$scope.bbcAttendance[pid] = [];
			angular.forEach(snapshot.val(), function(value,key) {
				$scope.bbcAttendance[pid].push(value);
			});
		});
	};
	
});
