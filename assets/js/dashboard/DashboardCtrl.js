'use strict';

angular.module('myhonorsDashboard').controller('DashboardCtrl', ['$scope', '$rootScope', 'FirebaseIO', function($scope, $rootScope,FirebaseIO) {
	$scope.eventTypes = null;

	$scope.$watch('profile', function() {
		if ($rootScope.profile) {
			// used to hold the event types
			var eventTypes = {};

			// get the user's swipes
			var swipeRef = FirebaseIO.child('swipes/' + $rootScope.profile.pid);

			swipeRef.on('child_added', function(snapshot) {
				// for each swipe, get the event information
				var eventRef = FirebaseIO.child('events/' + snapshot.name() + '/type');

				eventRef.on('value', function (snapshot) {
					var type = snapshot.val();

					// if no event of a certain type has been saved yet, intialize it with 0
					// then increment the "number of attendances" for that type of event
					eventTypes[type] = eventTypes[type] || 0;
					eventTypes[type] += 1;

					$rootScope.safeApply(function() {
						$scope.honorshours = eventTypes.honorshour || 0;
						$scope.colloquia = eventTypes.colloquia || 0;
						$scope.excellence = eventTypes.excellence || 0;
					})
				})
			});
		}
	})
}]);