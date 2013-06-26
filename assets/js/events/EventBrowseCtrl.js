'use strict';

angular.module('myhonorsEvents').controller('EventBrowseCtrl', ['$scope', '$rootScope', 'FirebaseIO', '$location', 'RSVPService', function ($scope, $rootScope, FirebaseIO, $location, RSVPService) {
	$scope.searchName = '';
	$scope.searchType = '';
	$scope.events = {};
	$scope.rsvp = RSVPService;

	$scope.goToEvent = function(eid) {
		$location.path('/events/' + eid);
	};
	
	var eventsRef = FirebaseIO.child('/events');

	eventsRef.on('child_added', function(snapshot) {
		// save the event object and add a property holding its ID so
		// we can reference it in the scope (like in hasRSVP(eid), for example)
		var e = snapshot.val();
		e.id = snapshot.name();
		e.rsvps = snapshot.child('rsvps').numChildren();

		$rootScope.safeApply(function() {
			$scope.events[e.id] = e;
		});
	});

	eventsRef.on('child_changed', function(snapshot) {
		var e = snapshot.val();
		e.id = snapshot.name();
		e.rsvps = snapshot.child('rsvps').numChildren();

		$rootScope.safeApply(function() {
			$scope.events[e.id] = e;
		});
	});

	eventsRef.on('child_removed', function(snapshot) {
		var e = snapshot.val();
		e.id = snapshot.name();
		e.rsvps = snapshot.child('rsvps').numChildren();

		$rootScope.safeApply(function() {
			$scope.events[e.id] = undefined;
		});
	});
}]);