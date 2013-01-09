'use strict';

var myhonorsEvents = angular.module('myhonorsEvents', ['ngResource']);

/* Config */

myhonorsEvents.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/events', {templateUrl: 'assets/partials/events.html', controller: 'EventBrowseCtrl'}).
		when('/events/:eventId', {templateUrl: 'assets/partials/events-view.html', controller: 'EventViewCtrl'}).
		when('/events/add', {templateUrl: 'assets/partials/events-add.html', controller: 'EventViewCtrl'}).
		when('/citizenship', {templateUrl: 'assets/partials/citizenship.html', controller: 'CitizenshipCtrl'});
}]);

/* Services */

myhonorsEvents.factory('Events', ['$resource', function($resource) {
	return $resource('events/:eventId');
}]);

/* Controllers */

myhonorsEvents.controller('EventBrowseCtrl', ['$scope', 'Events', function EventBrowseCtrl($scope, Events) {
	$scope.searchName = '';
	$scope.searchType = '';
	
	Events.query(function(events) {
		//success
		$scope.events = events;

		for (var i = 0; i < $scope.events.length; i++)
		{
			// format event types
			switch ($scope.events[i].type)
			{
				case "h": $scope.events[i].type = "Honors Hour"; break;
				case "c": $scope.events[i].type = "Colloquia"; break;
				case "e": $scope.events[i].type = "Excellence Lecture"; break;
				case "a": $scope.events[i].type = "Miscellaneous"; break;
			}
		}
	});
}]);

myhonorsEvents.controller('EventViewCtrl', ['$scope', '$routeParams', '$window', 'Events', 'apikey_google', function EventViewCtrl($scope, $routeParams, $window, Events, apikey_google) {
	$window.initializeMap = function() {
		var latLng = new google.maps.LatLng($scope.event.lat, $scope.event.lng);
		var latLngOffset = new google.maps.LatLng($scope.event.lat, parseFloat($scope.event.lng) + 0.002);

		var mapOptions = {
			zoom: 18,
			center: latLngOffset,
			mapTypeId: google.maps.MapTypeId.SATELLITE
		};

		var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

		var buildingsLayer = new google.maps.KmlLayer('http://sites.fiu.edu/emap/layers/Buildings.kmz', 
			{suppressInfoWindows: true, preserveViewport: true}
		);
		buildingsLayer.setMap(map);

		var marker = new google.maps.Marker({
			position: latLng,
			map: map,
			title: $scope.event.location_name
		});
	}

	var eventId = $routeParams.eventId;

	Events.get({eventId: eventId}, function(data) {
		//success
		$scope.event = data;

		// asynchronously load the Google Maps API script
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = "https://maps.googleapis.com/maps/api/js?key=" + apikey_google + "&sensor=false&callback=initializeMap";
		document.body.appendChild(script);

		switch ($scope.event.type)
		{
			case "h": $scope.event.type = "Honors Hour"; break;
			case "c": $scope.event.type = "Colloquia"; break;
			case "e": $scope.event.type = "Excellence Lecture"; break;
			case "a": $scope.event.type = "Miscellaneous"; break;
		}
	});

	$scope.renderMap = function(location) {	
		return '<iframe width="950" height="300" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="' + location + '"></iframe>';
	}
}]);

myhonorsEvents.controller('CitizenshipCtrl', ['$scope', '$http', function CitizenshipCtrl($scope, $http) {
	$scope.userid = '';
	$scope.loading = false; // used to adjust display when waiting for AJAX responses

	var clearRequirements = function() {
		$scope.honorshours = [];
		$scope.colloquia = [];
		$scope.excellence = [];
	}

	// initialize the arrays
	clearRequirements();

	$scope.fetch = function() {
		$scope.loading = true;
		
		$http.get('attendance/' + $scope.userid).success(function(data) {
			// sorts the data into their separate event types
			angular.forEach(data.events, function(e) {
				switch (e.type)
				{
					case "h": $scope.honorshours.push(e); break;
					case "c": $scope.colloquia.push(e); break;
					case "e": $scope.excellence.push(e); break;
				}
			});

			$scope.loading = false;
		});
	};

	$scope.requirementsComplete = function(type) {
		switch (type)
		{
			case "h": return Boolean($scope.honorshours.length >= 3);
			case "c": return Boolean($scope.colloquia.length >= 1);
			case "e": return Boolean($scope.excellence.length >= 1);
		}
	};

	// checks whether we want to fetch the user's info or not, based on whether they've entered a 7-digit number
	$scope.doFetch = function() {
		if ($scope.userid.length === 7) {
			clearRequirements(); // start fresh
			$scope.fetch();
		}
	};
}]);