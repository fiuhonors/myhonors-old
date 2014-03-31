'use strict';

angular.module('myhonorsEvents').controller('RFIDTagsCtrl', ['$scope', '$timeout', '$routeParams', 'FirebaseIO', 'UserService', 'EventService', 'SwipeService', 'RFIDTagService', function ($scope, $timeout, $routeParams, FirebaseIO, UserService, EventService, SwipeService, RFIDTagService) {
	$scope.data = {userId: '', rfid: ''};
	
	
	$scope.event = EventService.read($routeParams.eventId, function(event) {
		$scope.eventType = event.types;	//Store the event type
	});
	
	$scope.swipes = SwipeService.listByEvent($routeParams.eventId);

	// used in ng-repeat's orderBy to reverse the array
	$scope.nothing = function(val) {return val};
	$scope.reverse = true;
	
	$scope.changeFocus = function() {
		$("#rfidField").focus();
	};


	$scope.registerRFID = function() {
		var userId = $scope.data.userId;
		var rfid = $scope.data.rfid;
		UserService.exists(userId, function(result, userData) {
			if (result === true) {
				    RFIDTagService.register(rfid, userId);			
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
		$scope.data.userId = '';
		$scope.data.rfid = '';
		
		$("#pidField").focus();
	};
}]);
