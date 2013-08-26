'use strict';

angular.module('myhonorsEvents').controller('CitizenshipCtrl', ['$scope', '$timeout', 'FirebaseIO', 'SwipeService', 'UserService', 'VolunteerService', function($scope, $timeout, FirebaseIO, SwipeService, UserService, VolunteerService) {
	$scope.submissions = VolunteerService.list();
	$scope.submit = function() {
		VolunteerService.create($scope.newData);
		$scope.newData = {};
	};
	$scope.eventTally = {
		// initialize the event types
		'Honors Hour': 0,
		'Colloquium': 0,
		'Excellence Lecture': 0,

		add: function(type) {
			// safely increment an event type
			this[type] = (angular.isNumber(this[type])) ? this[type] + 1 : this[type];
		},
		reset: function() {
			this['Honors Hour'] = 0;
			this['Colloquium'] = 0;
			this['Excellence Lecture'] = 0;
		}
	};

	UserService.ref.child('attendance').on('value', function(snapshot) {
		// clear the current tally ...
		$timeout(function() {
			$scope.eventTally.reset();
		});

		angular.forEach(snapshot.val(), function(value, key)
		{
			// grab the type of the event (key is the eventID) and update the tally
			FirebaseIO.child('events/' + key + '/types').once('value', function(snapshot) {
				$timeout(function() {
					snapshot.forEach(function(child) {
						$scope.eventTally.add(child.val());
					});
				});
			});
		});
	});
}]);