'use strict';

angular.module('myhonorsEvents').controller('EventAddCtrl', ['$scope', '$location', 'EventService', function($scope, $location, EventService) {
	$scope.eventTypes = EventService.getTypes();
	
	$scope.doAdd = function(theForm) {
		if (theForm.$invalid) { return; }

		var newItem = angular.copy($scope.newItem);

		newItem.location = {
			name: $scope.newItem.location.name, 
			lat: $scope.newItem.location.lat,
			lng: $scope.newItem.location.lng
		};

		var startHour = parseInt($scope.newItem.date.starts.time.substring(0, 2)) + (($scope.newItem.date.starts.time.substring(6, 8) === 'PM') ? 12 : 0);
		var startMin = parseInt($scope.newItem.date.starts.time.substring(3, 5));
		newItem.date.starts = moment($scope.newItem.date.starts.date).hour(startHour).minute(startMin).valueOf();

		var endHour = parseInt($scope.newItem.date.ends.time.substring(0, 2)) + (($scope.newItem.date.ends.time.substring(6, 8) === 'PM') ? 12 : 0);
		var endMin = parseInt($scope.newItem.date.ends.time.substring(3, 5));
		newItem.date.ends = moment($scope.newItem.date.ends.date).hour(endHour).minute(endMin).valueOf();

		newItem.type = {};
		angular.forEach($scope.newItem.type, function(value) {
			newItem.type[value] = true;
		});

		EventService.create(newItem);
		$location.path('events');
	};

	$scope.resetForm = function() {
		$scope.newItem = {
			name: '',
			desc: '',
			date: {
				starts: {
					date: new Date(),
					time: moment().format('hh:mm A')
				},
				ends: {
					date: new Date(),
					time: moment().add('hours', 1).format('hh:mm A')
				}
			},
			type: [],
			location: {
				name: '',
				lat: 25.756237234313733,
				lng: -80.37467569112778,
				// the following properties are just for the visual map, they don't get saved to the database
				draggable: true,
				focus: true,
				zoom: 16
			},
			options: {
				maxRSVPs: '',
				waitingList: false,
				requirePhone: false
			}
		}
	};

	$scope.resetForm();
	$scope.defaults = {
		maxZoom: 20
	}
}]);