'use strict';

angular.module('myhonorsEvents').controller('EventEditCtrl', ['$scope', '$location', '$routeParams', '$timeout', 'EventService', 'WaitingListService', function($scope, $location, $routeParams, $timeout, EventService, WaitingListService) {
	
	// temporary location to initialize the map
	$scope.event = {
		location: {
			lat: 25.756237234313733,
			lng: -80.37467569112778,
			draggable: true,
			focus: true,
			zoom: 16
		}
	};

	EventService.read($routeParams.eventId, function(data) {
		$timeout(function() {
			// the following properties are just for the visual map, they don't get saved to the database
			angular.extend(data, {
				draggable: true,
				focus: true,
				zoom: 16
			});
			
			$scope.event = data;

			// format the starting/ending dates and times
			var start = moment(data.date.starts);
			$scope.event.date.starts = {
				date: start.format('MM-DD-YYYY'),
				time: start.format('hh:mm A')
			};

			var ends = moment(data.date.ends);
			$scope.event.date.ends = {
				date: ends.format('MM-DD-YYYY'),
				time: ends.format('hh:mm A')
			};
			
			// Store a copy so we can undo changes. The usersAttended property must be deleted in order to avoid a circular 
			//reference error when making a copy of the event
			delete $scope.event.usersAttended;
			$scope.originalEvent = angular.copy($scope.event);

			// Auto updates the date and time
			$scope.updateEnds = function(timeOrDate) {
				if (timeOrDate === 'time') {
					$scope.event.date.ends.time = moment($scope.event.date.starts.time, 'hh:mm A').add('hours', 1).format('hh:mm A');
				} else if (timeOrDate === 'date') {
					$scope.event.date.ends.date = moment($scope.event.date.starts.date, 'MM-DD-YYYY').format('MM/DD/YYYY');
				}
			};
		});
	});
	$scope.eventTypes = EventService.getTypes();

	/**
	 * @param   string    time in the format of 'hh:mm A'
	 * @returns int       the hour of string as an integer from 0 to 23
	 */
	function getHour(string) {
		var hour = parseInt(string.substring(0, 2));
		return ((string.substring(6, 8) === 'PM') && hour !== 12) ? hour + 12 : hour;
	}

	/**
	 * @param   string    time in the format of 'hh:mm A'
	 * @returns int       the minute of string as an integer
	 */
	function getMinute(string) {
		return parseInt(string.substring(3, 5));
	}
	
	$scope.doSaveChanges = function(theForm) {
		if (theForm.$invalid) { return; }

		var startHour = getHour($scope.event.date.starts.time),
			startMin = getMinute($scope.event.date.starts.time),
			endHour = getHour($scope.event.date.ends.time),
			endMin = getMinute($scope.event.date.ends.time);

		var event = angular.extend({}, {
			name: $scope.event.name,
			thumbURL: $scope.event.thumbURL || '',
			desc: $scope.event.desc,
			date: {
				starts: moment($scope.event.date.starts.date, "MM-DD-YYYY").hour(startHour).minute(startMin).valueOf(),
				ends: moment($scope.event.date.ends.date, "MM-DD-YYYY").hour(endHour).minute(endMin).valueOf()
			},
			location: {
				name: $scope.event.location.name, 
				lat: $scope.event.location.lat,
				lng: $scope.event.location.lng
			},
			types: $scope.event.types || [],
			options: $scope.event.options
		});

		EventService.update($routeParams.eventId, event);
		
		if ($scope.event.options.waitingList)
			$scope.checkWaitingList();
		
		$location.path('events/' + $routeParams.eventId);
	};

	$scope.undoChanges = function() {
		$scope.event = angular.copy($scope.originalEvent);
	};

	$scope.defaults = {
		maxZoom: 20
	};
	
	/**
	 * Check whether the staff increased the number limit for RSVPs. If so, users in the waiting list are automatically added.
	 */
	$scope.checkWaitingList = function() {
		var newMaxRSVPs = $scope.event.options.maxRSVPs;
		var oldMaxRSVPs = $scope.originalEvent.options.maxRSVPs;
		if ( oldMaxRSVPs !== newMaxRSVPs &&
			$scope.event.options.waitingList && 
			$scope.event.waitingList) {
			WaitingListService.transferFromWaitingListToRSVP($routeParams.eventId, newMaxRSVPs - oldMaxRSVPs);
		}
	};
	

}]);
