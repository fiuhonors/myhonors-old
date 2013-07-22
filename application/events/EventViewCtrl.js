'use strict';

angular.module('myhonorsEvents').controller('EventViewCtrl', ['$scope', '$routeParams', '$timeout', '$location', '$window', 'FirebaseIO', 'FirebaseCollection', 'EventService', 'CommentService', 'RSVPService', 'SwipeService', 'apikey_google', function ($scope, $routeParams, $timeout, $location, $window, FirebaseIO, FirebaseCollection, EventService, CommentService, RSVPService, SwipeService, apikey_google) {
	var discussionRef = FirebaseIO.child('events/' + $routeParams.eventId + '/comments');
	$scope.rsvp = RSVPService.read($routeParams.eventId) || {guests: 0, error: false};
	$scope.originalRSVP = angular.copy($scope.rsvp); // save an original to compare changes with hasRSVPChanges()
	$scope.eventRSVPs = RSVPService.list($routeParams.eventId);
	$scope.attendance = SwipeService.listByEvent($routeParams.eventId);
	$scope.userAttended = SwipeService.hasAttended($routeParams.eventId);
	$scope.userComment = '';
	$scope.truncateDesc = 200;

	/* MAP FUNCTIONALITY */

	$scope.markers = [];
	$scope.center = {
		lat: 51,
		lng: 1,
		zoom: 14
	};
	$scope.defaults = {
		maxZoom: 20
	};

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
		if ($scope.event && $scope.event.options && $scope.event.options.requirePhone) {
			if (!$scope.rsvp.phone) {
				$scope.rsvp.error = '<strong>Woops!</strong> Please add a phone number to RSVP.';
				return;
			} else {
				$scope.rsvp.error = null;
				data.phone = $scope.rsvp.phone;
			}
		}

		RSVPService.create($routeParams.eventId, data, function() {
			$timeout(function() {
				$scope.preRSVP = false;
				$scope.rsvp = data;
				$scope.originalRSVP = angular.copy(data);
			});
		});
	};

	$scope.removeRSVP = function() {
		$scope.rsvp = $scope.originalRSVP = {guests: 0, error: false};
		RSVPService.delete($routeParams.eventId);
	};

	$scope.hasRSVP = function() {
		return RSVPService.hasRSVP($routeParams.eventId);
	};

	$scope.hasRSVPChanges = function() {
		return !angular.equals($scope.rsvp, $scope.originalRSVP);
	};

	$scope.getRemainingSeats = function() {
		if ($scope.event && $scope.event.options && $scope.event.options.maxRSVPs) {
			var value = $scope.event.options.maxRSVPs - $scope.event.rsvps;
			return (value > 0) ? value : 0;
		}
	}

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