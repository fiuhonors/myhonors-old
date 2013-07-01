'use strict';

angular.module('myhonorsEvents').controller('EventViewCtrl', ['$scope', '$routeParams', '$timeout', '$location', '$window', 'FirebaseIO', 'FirebaseCollection', 'EventService', 'CommentService', 'RSVPService', 'apikey_google', function ($scope, $routeParams, $timeout, $location, $window, FirebaseIO, FirebaseCollection, EventService, CommentService, RSVPService, apikey_google) {
	var mapLoaded = false;
	var discussionRef = FirebaseIO.child('events/' + $routeParams.eventId + '/comments');
	$scope.rsvp = RSVPService;
	$scope.eventRSVPs = RSVPService.list($routeParams.eventId);
	$scope.userComment = '';

	/* MAP FUNCTIONALITY */

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

	$scope.renderMap = function(location) {	
		return '<iframe width="950" height="300" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="' + location + '"></iframe>';
	}

	/* LOAD EVENT DATA AND INITIALIZE MAP */

	EventService.read($routeParams.eventId, function(data) {
		$timeout(function() {
			$scope.event = data;
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

	/* COMMENT FUNCTIONALITY */

	$scope.comments = CommentService.list(discussionRef);

	$scope.addComment = function() {
		CommentService.create($scope.userComment, discussionRef);
		$scope.userComment = '';
	};

	$scope.deleteComment = function(commentId) {
		// todo: show inline "Are you sure?" confirmation before deleting
		CommentService.delete(commentId, discussionRef);
	};

	// provides a property to set the orderBy predicate for the comments (.current)
	// and a function to get the value as a text string for the view (.getCurrent())
	$scope.sortComments = {
		current: '-date',
		getCurrent: function() {
			switch (this.current) {
				case 'kudos':
					return 'Best';
				case 'date':
					return 'Oldest First';
				case '-date': // a negative sign in front of the predicate will reverse the array
				default:
					return 'Newest First';
			}
		}
	};

	/* ADMIN FUNCTIONALITY */

	if ($scope.user.auth.isEventMod) {
		$scope.modalOpts = {
			backdropFade: true,
			dialogFade: true
		};

		$scope.confirmDelete = function() {
			$scope.showDeleteConfirmation = true;
		};

		$scope.cancelDelete = function() {
			$scope.showDeleteConfirmation = false;
		};

		$scope.doDelete = function() {
			EventService.delete($routeParams.eventId); // delete event
			$scope.showDeleteConfirmation = false; // close deletion confirmation modal
			$location.path('dashboard'); // redirect to main page
		};
	}	
}]);