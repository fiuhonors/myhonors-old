'use strict';

angular.module('myhonorsEvents').controller('SwipeCtrl', ['$scope', '$timeout', '$routeParams', 'UserService', 'EventService', 'SwipeService', function ($scope, $timeout, $routeParams, UserService, EventService, SwipeService) {
	$scope.data = {userId: ''};
	
	
	$scope.event = EventService.read($routeParams.eventId, function(event) {
		$scope.eventType = event.types;	//Store the event type
	});
	
	$scope.swipes = SwipeService.listByEvent($routeParams.eventId);

	// used in ng-repeat's orderBy to reverse the array
	$scope.nothing = function(val) {return val};
	$scope.reverse = true;

	$scope.doAdd = function() {
		var userId = $scope.data.userId;
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
		$scope.data.userId = '';
	};
}]);
