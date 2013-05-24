'use strict';

angular.module('myhonorsEvents').controller('EventViewCtrl', ['$scope', '$routeParams', '$window', 'FirebaseIO', 'apikey_google', function EventViewCtrl($scope, $routeParams, $window, FirebaseIO, apikey_google) {
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

	var eventRef = FirebaseIO.child('events/' + $routeParams.eventId);

	eventRef.on('value', function(snapshot) {
		$scope.safeApply(function() {
			$scope.event = snapshot.val();
		});

		// asynchronously load the Google Maps API script
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = "https://maps.googleapis.com/maps/api/js?key=" + apikey_google + "&sensor=false&callback=initializeMap";
		document.body.appendChild(script);
	});

	$scope.renderMap = function(location) {	
		return '<iframe width="950" height="300" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="' + location + '"></iframe>';
	}
}]);