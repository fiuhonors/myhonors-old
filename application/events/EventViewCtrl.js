'use strict';

angular.module('myhonorsEvents').controller('EventViewCtrl', ['$scope', '$http', '$routeParams', '$timeout', '$location', '$window', 'FirebaseIO', 'FirebaseCollection', 'EventService', 'WaitingListService', 'CommentService', 'RSVPService', 'SwipeService', 'UserService', 'ClubService', 'apikey_google', function ($scope, $http, $routeParams, $timeout, $location, $window, FirebaseIO, FirebaseCollection, EventService, WaitingListService, CommentService, RSVPService, SwipeService, UserService, ClubService, apikey_google) {
	var discussionRef = FirebaseIO.child('events/' + $routeParams.eventId + '/comments');
	$scope.rsvp = RSVPService.read($routeParams.eventId) || {guests: 0, error: false};
	$scope.originalRSVP = angular.copy($scope.rsvp); // Save an original to compare changes with hasRSVPChanges()
	$scope.waitingList = WaitingListService.read($routeParams.eventId) || {phone:"", error: false}; // Contains the waiting list info, if any, of the current user
	$scope.originalWaitingList = angular.copy($scope.waitingList);
	$scope.showAttendanceLimit = 6;		// Number of attendants that will be displayed
	$scope.eventRSVPs = RSVPService.list($routeParams.eventId);
	$scope.eventWaitingList = WaitingListService.list($routeParams.eventId);
	$scope.attendance = SwipeService.listByEvent($routeParams.eventId, {"limit": $scope.showAttendanceLimit});	// Limit the number of attendants pulled from the database according to the limit
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

            // Determine whether this user is a club moderator for this event (if the event has a club)
            $scope.isClubMod = UserService.auth.isClubMod && ClubService.isClubMod( $scope.event.club, UserService.profile.id ); 
		}, 0, true);
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
        var waitingListInfo = ($scope.event.options.waitingList && $scope.event.waitingList) ? {openings: 1 + $scope.rsvp.guests} : {};
        RSVPService.delete($routeParams.eventId, UserService.profile.id, waitingListInfo);
		
		// If waiting list is being used and there are people in it, we update accordingly now that someone removed his RSVP
		//if ($scope.event.options.waitingList && $scope.event.waitingList)
			//WaitingListService.transferFromWaitingListToRSVP($routeParams.eventId, 1 + $scope.rsvp.guests); // New openings =  user's spot + his guests
		
		
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
	
	$scope.handleJoin = function() {
	    if ($scope.event.options.requirePhone) {
	        $scope.preWaitingList = true;
	        return;
	    }
	    
	    $scope.addToWaitingList();
	};
	
	$scope.addToWaitingList = function() {
		var data = $scope.waitingList;
		
		if ($scope.event.options.requirePhone && !$scope.waitingList.phone) {
			$scope.waitingList.error = '<strong>Woops!</strong> Please include your phone number.';
			return;
		} else {
			$scope.waitingList.error = null;
			data.phone = $scope.waitingList.phone;
		}
		
		WaitingListService.create($routeParams.eventId, data, function() {
			$timeout(function() {
				$scope.preWaitingList = false;
				$scope.waitingList = data;
				$scope.originalWaitingList = angular.copy(data);
			});
		});
	};
	
	$scope.isInWaitingList = function() {
		return WaitingListService.isInWaitingList($routeParams.eventId);
	};
	
	$scope.removeFromWaitingList = function() {
		$scope.waitingList = {phone:"", error: false};
		return WaitingListService.delete($routeParams.eventId, UserService.profile.id);
	};
	
	$scope.hasWaitingListChanges = function() {
		return !angular.equals($scope.waitingList, $scope.originalWaitingList);
	};
	
	/* COMMENT FUNCTIONALITY */

	$scope.comments = CommentService.listClutch2(discussionRef);

	$scope.addComment = function() {
        var currentTime = new Date(),
            serializedData = $.param({
                eventContactEmail: $scope.event.contactEmail,
                eventTitle: $scope.event.name,
                comment: $scope.userComment,
                commenter: UserService.profile.id,
                commentTime: (currentTime.getMonth() + 1) + 
                    "/" + currentTime.getDate() +
                    "/" + currentTime.getFullYear() + 
                    " - " + currentTime.getHours() + 
                    ":" + currentTime.getMinutes() + 
                    ":" + currentTime.getSeconds()
            });
            // Send out a notice that a new comment has been posted to the system
        $http
            .post('application/comments/newComment.php', serializedData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
        // Comment is actually created
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
			EventService.delete( $scope.event ); // delete event
			$scope.showDeleteConfirmation = false; // close deletion confirmation modal
			$location.path('events'); // redirect to main page
		};
	}	

}]);
