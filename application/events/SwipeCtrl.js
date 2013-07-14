'use strict';

angular.module('myhonorsEvents').controller('SwipeCtrl', ['$scope', '$routeParams', 'SwipeService', function ($scope, $routeParams, SwipeService) {
	$scope.data = {userId: ''};
	$scope.event = EventService.read($routeParams.eventId);
	$scope.swipes = SwipeService.list($routeParams.eventId);
	$scope.doAdd = function() {
		SwipeService.create($routeParams.eventId, $scope.data.userId);
		$scope.data.userId = '';
	};
}]);