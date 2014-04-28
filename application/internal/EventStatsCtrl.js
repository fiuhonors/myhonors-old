'use strict'

angular.module('myhonorsInternal').controller('EventStatsCtrl', function($scope, EventService) {
	$scope.events = EventService.list();	
});
