'use strict';

angular.module('myhonorsEvents').controller('EventViewCtrl', ['$scope', '$routeParams', '$timeout', '$location', '$window', 'FirebaseIO', 'FirebaseCollection', 'EventService', 'CommentService', 'RSVPService', 'apikey_google', function ($scope, $routeParams, $timeout, $location, $window, FirebaseIO, FirebaseCollection, EventService, CommentService, RSVPService, apikey_google) {
	var discussionRef = FirebaseIO.child('events/' + $routeParams.eventId + '/comments');
	$scope.rsvp = RSVPService.read($routeParams.eventId) || {guests: 0};
	$scope.eventRSVPs = RSVPService.list($routeParams.eventId);
	$scope.userComment = '';

	/* MAP FUNCTIONALITY */

	$scope.markers = [];
	$scope.center = {
		lat: 51,
		lng: 1,
		zoom: 14
	};
	$scope.defaults = {
		maxZoom: 20
	}

	/* LOAD EVENT DATA AND INITIALIZE MAP */

	EventService.read($routeParams.eventId, function(data) {
		$timeout(function() {
			$scope.event = data;
			$scope.center = {
				lat: data.location.lat,
				lng: parseFloat(data.location.lng) + 0.003,
				zoom: 17
			};
			$scope.markers.push(angular.extend(data.location, {message: data.location.name}));
		});
	});

	/* RSVP FUNCTIONALITY */

	$scope.addRSVP = function() {
		var data = {guests: $scope.rsvp.guests};
		RSVPService.create($routeParams.eventId, data);
	};

	$scope.removeRSVP = function() {
		RSVPService.delete($routeParams.eventId);
	};

	$scope.hasRSVP = function() {
		return RSVPService.hasRSVP($routeParams.eventId);
	};

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