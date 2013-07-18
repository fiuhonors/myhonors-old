'use strict';

angular.module('myhonorsEvents').controller('EventEditCtrl', ['$scope', '$location', '$routeParams', '$timeout', 'EventService', function($scope, $location, $routeParams, $timeout, EventService) {
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
				time: start.format('hh:mm a')
			};

			var ends = moment(data.date.ends);
			$scope.event.date.ends = {
				date: ends.format('MM-DD-YYYY'),
				time: ends.format('hh:mm a')
			};
			
			// store a copy so we can undo changes
			$scope.originalEvent = angular.copy($scope.event);

			// auto updates the date and time
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
	
	$scope.doSaveChanges = function(theForm) {
		if (theForm.$invalid) { return; }

		var startHour = parseInt($scope.event.date.starts.time.substring(0, 2)) + (($scope.event.date.starts.time.substring(6, 8) === 'PM') ? 12 : 0);
		var endHour = parseInt($scope.event.date.ends.time.substring(0, 2)) + (($scope.event.date.ends.time.substring(6, 8) === 'PM') ? 12 : 0);
		var startMin = parseInt($scope.event.date.starts.time.substring(3, 5));
		var endMin = parseInt($scope.event.date.ends.time.substring(3, 5));

		var event = angular.extend({}, {
			name: $scope.event.name,
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
			types: $scope.event.types,
			options: $scope.event.options
		});

		EventService.update($routeParams.eventId, event);
		$location.path('events/' + $routeParams.eventId);
	};

	$scope.undoChanges = function() {
		$scope.event = angular.copy($scope.originalEvent);
	};

	$scope.defaults = {
		maxZoom: 20
	}
}]);