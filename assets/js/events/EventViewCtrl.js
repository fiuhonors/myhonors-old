'use strict';

angular.module('myhonorsEvents').controller('EventViewCtrl', ['$scope', '$rootScope', '$routeParams', '$window', 'FirebaseIO', 'FirebaseCollection', 'apikey_google', function ($scope, $rootScope, $routeParams, $window, FirebaseIO, FirebaseCollection, apikey_google) {
	var mapLoaded = false;

	$window.initializeMap = function() {
		var latLng = new google.maps.LatLng($scope.event.location.lat, $scope.event.location.long);
		// we use parseFloat() here so we can add the offset (otherwise the offset concatenates since the object is a string)
		var latLngOffset = new google.maps.LatLng($scope.event.location.lat, parseFloat($scope.event.location.long) + 0.0015);

		var mapOptions = {
			zoom: 18,
			center: latLngOffset,
			mapTypeId: google.maps.MapTypeId.SATELLITE
		};

		var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

		// use the FIU map overlays
		var buildingsLayer = new google.maps.KmlLayer('http://sites.fiu.edu/emap/layers/Buildings.kmz', 
			{suppressInfoWindows: true, preserveViewport: true}
		);

		buildingsLayer.setMap(map);

		var marker = new google.maps.Marker({
			position: latLng,
			map: map,
			title: $scope.event.location.name
		});
	}

	var discussionRef = FirebaseIO.child('comments/events/' + $routeParams.eventId);
	$scope.comments = FirebaseCollection(discussionRef);

	$scope.userComment = '';

	$scope.addComment = function() {
		$scope.comments.add({fname: $scope.profile.fname, lname: $scope.profile.lname, content: $scope.userComment});
		$scope.userComment = '';
	};

	$scope.rsvps = [];

	var eventRef = FirebaseIO.child('events/' + $routeParams.eventId);

	eventRef.on('value', function(snapshot) {

		// get the first and last names of everyone who rsvp'd
		if (snapshot.child('rsvps') !== null) {
			// reset
			$scope.safeApply(function() {
				$scope.rsvps = [];
			});

			snapshot.child('rsvps').forEach(function(childSnapshot) {
				var fnameRef = FirebaseIO.child('user_profiles/' + childSnapshot.name() + '/fname');

				fnameRef.on('value', function(nameSnapshot) {
					$scope.safeApply(function() {
						$scope.rsvps.push(nameSnapshot.val());
					});
				});
			});
		}

		$scope.safeApply(function() {
			$scope.event = snapshot.val();
			$scope.event.id = snapshot.name();
			$scope.event.rsvps = snapshot.child('rsvps').numChildren();
		});

		// this way we don't reload the script everytime the event changes
		if (!mapLoaded) {
			// asynchronously load the Google Maps API script
			var script = document.createElement("script");
			script.type = "text/javascript";
			script.src = "https://maps.googleapis.com/maps/api/js?key=" + apikey_google + "&sensor=false&callback=initializeMap";
			document.body.appendChild(script);

			mapLoaded = true;
		}
	});

	// todo: move the repeated code below into a service that's shared between EventViewCtrl and EventBrowseCtrl

	$scope.hasRSVP = function(eid) {
		return $rootScope.profile && $rootScope.profile.rsvps && $rootScope.profile.rsvps[eid] === true;
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

	$scope.renderMap = function(location) {	
		return '<iframe width="950" height="300" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="' + location + '"></iframe>';
	}
}]);