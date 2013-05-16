'use strict';

angular.module('myhonorsEvents').controller('EventViewCtrl', ['$scope', '$routeParams', '$window', 'Events', 'apikey_google', function EventViewCtrl($scope, $routeParams, $window, Events, apikey_google) {
	$window.initializeMap = function() {
		var latLng = new google.maps.LatLng($scope.event.lat, $scope.event.lng);
		var latLngOffset = new google.maps.LatLng($scope.event.lat, parseFloat($scope.event.lng) + 0.0015);

		var mapOptions = {
			zoom: 18,
			center: latLngOffset,
			mapTypeId: google.maps.MapTypeId.ROADMAP
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