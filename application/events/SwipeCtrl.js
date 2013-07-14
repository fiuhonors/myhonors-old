'use strict';

angular.module('myhonorsEvents').controller('SwipeCtrl', ['$scope', '$timeout', '$routeParams', 'UserService', 'EventService', 'SwipeService', function ($scope, $timeout, $routeParams, UserService, EventService, SwipeService) {
	$scope.data = {userId: ''};
	$scope.event = EventService.read($routeParams.eventId);
	$scope.swipes = SwipeService.list($routeParams.eventId);

	// used in ng-repeat's orderBy to reverse the array
	$scope.nothing = function(val) {return val};
	$scope.reverse = true;

	$scope.doAdd = function() {
		var userId = $scope.data.userId;
		UserService.exists(userId, function(result) {
			if (result === true) {
				SwipeService.create($routeParams.eventId, userId);
				$timeout(function() {
					$scope.error = false;
				});
			} else {
				$timeout(function() {
					$scope.error = true;
				});
			}
		});
		$scope.data.userId = '';
	};
}]);