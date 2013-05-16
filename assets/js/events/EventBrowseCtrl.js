'use strict';

angular.module('myhonorsEvents').controller('EventBrowseCtrl', ['$scope', 'Events', function EventBrowseCtrl($scope, Events) {
	$scope.searchName = '';
	$scope.searchType = '';
	
	Events.query(function(events) {
		//success
		$scope.events = events;

		for (var i = 0; i < $scope.events.length; i++)
		{
			// format event types
			switch ($scope.events[i].type)
			{
				case "h": $scope.events[i].type = "Honors Hour"; break;
				case "c": $scope.events[i].type = "Colloquia"; break;
				case "e": $scope.events[i].type = "Excellence Lecture"; break;
				case "a": $scope.events[i].type = "Miscellaneous"; break;
			}
		}
	});
}]);