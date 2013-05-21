'use strict';

angular.module('myhonorsEvents').controller('EventBrowseCtrl', ['$scope', '$rootScope', 'FirebaseIO', function ($scope, $rootScope, FirebaseIO) {
	$scope.searchName = '';
	$scope.searchType = '';
	$scope.events = [];
	
	var eventsRef = FirebaseIO.child('/events');

	eventsRef.on('child_added', function(snapshot) {
		$rootScope.safeApply(function() {
			$scope.events.push(snapshot.val());
		});
	});
}]);