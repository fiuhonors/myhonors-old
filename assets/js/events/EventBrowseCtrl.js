'use strict';

angular.module('myhonorsEvents').controller('EventBrowseCtrl', ['$scope', '$rootScope', 'FirebaseIO', '$location', function ($scope, $rootScope, FirebaseIO, $location) {
	$scope.searchName = '';
	$scope.searchType = '';

	$scope.events = {};

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

	$scope.hasRSVP = function(eid) {
		return angular.isDefined($rootScope.profile.rsvps) && $rootScope.profile.rsvps[eid] === true;
	};

	$scope.addRSVP = function(eid) {
		// add attendance info to event (so we can pull it from event page)
		var eventRef = FirebaseIO.child('/events/' + eid + '/rsvps/' + $rootScope.profile.id);
		eventRef.set(true);

		// and add it to the user's profile (so we can see it on the user's page)
		var userRef = FirebaseIO.child('/user_profiles/' + $rootScope.profile.id + '/rsvps/' + eid);
		userRef.set(true);
	};

	$scope.removeRSVP = function(eid) {
		// add attendance info to event (so we can pull it from event page)
		var eventRef = FirebaseIO.child('/events/' + eid + '/rsvps/' + $rootScope.profile.id);
		eventRef.remove();

		// and add it to the user's profile (so we can see it on the user's page)
		var userRef = FirebaseIO.child('/user_profiles/' + $rootScope.profile.id + '/rsvps/' + eid);
		userRef.remove();
	};
}]);