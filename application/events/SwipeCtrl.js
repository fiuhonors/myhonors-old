'use strict';

angular.module('myhonorsEvents').controller('SwipeCtrl', ['$scope', '$timeout', '$routeParams', 'UserService', 'EventService', 'SwipeService', 'RFIDTagService', function ($scope, $timeout, $routeParams, UserService, EventService, SwipeService, RFIDTagService) {
	$scope.data = {id: ''};
	
	$scope.rfid
	
	$scope.event = EventService.read($routeParams.eventId, function(event) {
		$scope.eventType = event.types;	//Store the event type
	});
	
	$scope.swipes = SwipeService.listByEvent($routeParams.eventId);

	// used in ng-repeat's orderBy to reverse the array
	$scope.nothing = function(val) {return val};
	$scope.reverse = true;
	
	/**
	 * Determine whether the ID inputted is a Panther ID or RFID tag. For the latter case, the PID is then retrieved.
	 * Then, the PID is passed to the doAdd function in order to continue the swipping process.
	 */
	$scope.parseId = function() {
		if ($scope.data.id.length == 7)	// The ID is a Panther ID
			 $scope.doAdd($scope.data.id);
		else {								// THE ID is an RFID tag
			RFIDTagService.getPID($scope.data.id, function(pid) {
				$scope.doAdd(pid);
			});
		}
	}

	$scope.doAdd = function(pid) {
		var userId = pid;

		UserService.exists(userId, function(result, userData) {
			if (result === true) {
				SwipeService.create($routeParams.eventId, userId, $scope.eventType);
				$timeout(function() {
					$scope.lastSwipe = userData;
					$scope.error = false;
				});
			} else {
				$timeout(function() {
					$scope.lastSwipe = false;
					$scope.error = true;
				});
			}
		});
		$scope.data.id = '';
	};
}]);
