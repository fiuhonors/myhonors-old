'use strict';

angular.module('myhonorsEvents').controller('EventViewCtrl', ['$scope', '$routeParams', '$timeout', '$location', '$window', 'FirebaseIO', 'FirebaseCollection', 'EventService', 'WaitingListService', 'CommentService', 'RSVPService', 'SwipeService', 'apikey_google', function ($scope, $routeParams, $timeout, $location, $window, FirebaseIO, FirebaseCollection, EventService, WaitingListService, CommentService, RSVPService, SwipeService, apikey_google) {
	var discussionRef = FirebaseIO.child('events/' + $routeParams.eventId + '/comments');
	$scope.rsvp = RSVPService.read($routeParams.eventId) || {guests: 0, error: false};
	$scope.originalRSVP = angular.copy($scope.rsvp); // save an original to compare changes with hasRSVPChanges()
	$scope.showAttendanceLimit = 6;		//Number of attendants that will be displayed
	$scope.eventRSVPs = RSVPService.list($routeParams.eventId);
	$scope.attendance = SwipeService.listByEvent($routeParams.eventId, {"limit": $scope.showAttendanceLimit});	//Limit the number of attendants pulled from the database according to the limit
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
		
		if ($scope.event.options.maxRSVPs != "" && $scope.hasLimitRSVPReached()) {
			$scope.rsvp.error = "<strong>Woops!</strong> You can't add more guests than seats available.";
			return;
		}
		
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
		RSVPService.delete($routeParams.eventId);
		
		if ($scope.event.options.waitingList) {
			WaitingListService.transferFromWaitingListToRSVP($routeParams.eventId, 1 + $scope.rsvp.guests);
		}
		
		$scope.rsvp = $scope.originalRSVP = {guests: 0, error: false};
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
	};
	
	/* Display all attendants of the event if the user clicks 'Show all'
	 * or
	 * Display a limited number of attendants if the user clicks 'Show less'
	 */
	$scope.showAttendants = function() {
		if ($scope.showAttendanceLimit == 6) {	//If attendants being shown is 6, that means the user clicked 'Show all'
			$scope.showAttendanceLimit = $scope.event.attendance;
			$scope.attendance = SwipeService.listByEvent($routeParams.eventId);
		}

		else {
			$scope.showAttendanceLimit = 6;
			$scope.attendance = $scope.attendance.splice($scope.showAttendanceLimit, $scope.event.attendance);
		}

	};
	
	/* Display all RSVPs of the event if the user clicks 'Show all'
	 * or
	 * Display a limited number of RSVPs if the user clicks 'Show less'
	 */
	$scope.showRSVPs = function() {
		if ($scope.showAttendanceLimit == 6) {
			$scope.showAttendanceLimit = $scope.eventRSVPs.length;
		}

		else {
			$scope.showAttendanceLimit = 6;
		}
	};

	/*
	 * This is executed when the student rsvp's or changes the number of guests.
	 * It checks whether the total number of rsvp's (including all the guests) would exceed the limit if the person would rsvp
	 * or if he would change the number og guests
	 */
	$scope.hasLimitRSVPReached = function() {
		var totalRSVPs = $scope.event.rsvps;
		
		if (!$scope.hasRSVP()) {
			totalRSVPs += 1 + $scope.rsvp.guests;	//If this is the student's initial rsvp, we add the student itself and his or her guests
		} else {
			totalRSVPs += $scope.rsvp.guests - $scope.originalRSVP.guests;	//If the user is changing the amount of guests, we substract the new number of guests minus the previous number of guests
		}

		if (totalRSVPs > $scope.event.options.maxRSVPs) { //If the limit is exceeded
			return true;
		}
		
		return false;
	}
		
	
	/* WAITING LIST FUNCTIONALITY */
	
	$scope.addToWaitingList = function() {
		WaitingListService.create($routeParams.eventId);
	};
	
	$scope.isInWaitingList = function() {
		return WaitingListService.isInWaitingList($routeParams.eventId);
	};
	
	$scope.removeFromWaitingList = function() {
		return WaitingListService.delete($routeParams.eventId);
	};
		
	/* COMMENT FUNCTIONALITY */

	$scope.comments = CommentService.listClutch2(discussionRef);

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
