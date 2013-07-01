'use strict';

angular.module('myhonorsEvents').controller('EventBrowseCtrl', ['$scope', '$timeout', 'FirebaseIO', '$location', 'EventService', 'RSVPService', function ($scope, $timeout, FirebaseIO, $location, EventService, RSVPService) {
	$scope.searchName = '';
	$scope.searchType = '';
	$scope.events = EventService.list();
	$scope.rsvp = RSVPService;

	$scope.goToEvent = function(eid) {
		$location.path('/events/' + eid);
	};
}]);