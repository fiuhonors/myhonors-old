'use strict';

angular.module('myhonorsEvents').controller('CitizenshipCtrl', ['$scope', '$rootScope', 'FirebaseIO', function($scope, $rootScope, FirebaseIO) {
	$scope.eventTally = {
		// initialize the event types
		honorshour: 0,
		colloquia: 0,
		excellence: 0,

		add: function(type) {
			// safely increment an event type
			this[type] = (angular.isNumber(this[type])) ? this[type] + 1 : this[type];
		},
		reset: function() {
			this.honorshour = 0;
			this.colloquia = 0;
			this.excellence = 0;
		}
	};

	var swipeRef = FirebaseIO.child('swipes/' + $scope.user.profile.id);

	// new data! get all of the user's swipes ...
	swipeRef.on('value', function(snapshot)
	{
		// ... clear the current tally ...
		$rootScope.safeApply(function() {
			$scope.eventTally.reset();
		});

		// ... and then, for each swipe ...
		angular.forEach(snapshot.val(), function(value, key)
		{
			// ... grab the type of the event (key is the eventID) ...
			var eventRef = FirebaseIO.child('events/' + key + '/type');

			// ... and update our scope's tally accordingly
			eventRef.on('value', function(snapshot) {
				$rootScope.safeApply(function() {
					$scope.eventTally.add(snapshot.val());
				});

				eventRef.off();
			});
		});
	});
}]);