'use strict';

angular.module('myhonorsEvents').controller('EventAddCtrl', ['$scope', '$location', 'EventService', function($scope, $location, EventService) {
	$scope.minDate = new Date(); // events can't be created before today

	$scope.doAdd = function(theForm) {
		if (theForm.$invalid) { return; }
		EventService.create($scope.newItem);
		$location.path('events');
	};
}]);