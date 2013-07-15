'use strict';

angular.module('myhonorsEvents').controller('EventBrowseCtrl', ['$scope', '$timeout', 'FirebaseIO', '$location', '$filter', 'EventService', 'RSVPService', function ($scope, $timeout, FirebaseIO, $location, $filter, EventService, RSVPService) {
	$scope.searchName = '';
	$scope.searchType = '';
	$scope.searchBy = function(type) {
		$scope.searchType = type;
	}

	$scope.events = EventService.list();
	$scope.eventTypes = EventService.getTypes();
	$scope.nothing = null; // empty model needed for the calendar directive

	$scope.getEvents = function() {
		return $filter('filter')($scope.events, {name: $scope.searchName, type: $scope.searchType});
	}
}]);