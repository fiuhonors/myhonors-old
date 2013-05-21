'use strict';

angular.module('myhonorsEvents').controller('CitizenshipCtrl', ['$scope', '$rootScope', 'FirebaseIO', function($scope, $rootScope, FirebaseIO) {
	$scope.eventTally = {
		// initialize the event types
		honorshour: 0,
		colloquia: 0,
		excellence: 0,

		add: function(type, amount) {
			// safely increment or decrement (by passing in a negative amount) an event type
			if (angular.isNumber(this[type])) {
				this[type] += amount;
			}
		},
		processEvent: function(eid, amount) {
			var eventRef = FirebaseIO.child('events/' + eid + '/type');

			eventRef.on('value', function(snapshot)
			{
				// snapshot.val() gives us the event type from Firebase
				$rootScope.safeApply(function() {
					$scope.eventTally.add(snapshot.val(), amount);
				});
			});
		}
	};

	$scope.$watch('profile', function() {
		if ($rootScope.profile) {
			// get the user's swipes
			var swipeRef = FirebaseIO.child('swipes/' + $rootScope.profile.pid);

			swipeRef.on('child_added', function(snapshot)
			{
				$scope.eventTally.processEvent(snapshot.name(), 1);
			});

			swipeRef.on('child_removed', function(snapshot)
			{
				$scope.eventTally.processEvent(snapshot.name(), -1);
			});
		}
	});
}]);