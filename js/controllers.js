'use strict';

/* MAIN APP CONTROLLER */

function AppCtrl($scope, $route) {
	$scope.$route = $route;
	$scope.page_title = "";

	$scope.profile = {};
};

AppCtrl.$inject = ['$scope', '$route'];

/* Controllers */

function EventBrowseCtrl($scope, Events) {
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
				case "a": $scope.events[i].type = "Attendance Only"; break;
			}
		}
	});
}

EventBrowseCtrl.$inject = ['$scope', 'Events'];

function EventViewCtrl($scope, $routeParams, Events) {
	$scope.eventId = $routeParams.eventId;
	Events.get({eventId: $scope.eventId}, function(data) {
		//success
		$scope.event = data;

		switch ($scope.event.type)
		{
			case "h": $scope.event.type = "Honors Hour"; break;
			case "c": $scope.event.type = "Colloquia"; break;
			case "e": $scope.event.type = "Excellence Lecture"; break;
			case "a": $scope.event.type = "Attendance Only"; break;
		}
	});

	$scope.renderMap = function(location) {	
		return '<iframe width="950" height="300" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="' + location + '"></iframe>';
	}
};

EventViewCtrl.$inject = ['$scope', '$routeParams', 'Events'];

function CitizenshipCtrl($scope, $http) {
	$scope.pid = null;
	$scope.loading = false; // used to adjust display when waiting for AJAX responses

	$scope.fetch = function() {
		$scope.loading = true;

		var data = 'pid=' + $scope.pid; // POST data in the header is formatted just like GET data in the URL (e.g. one=1&two=2)
		$http.post('http://thc.fiu.edu/myhonors/swipe/lookup/', data, {headers: {'Content-Type' : 'application/x-www-form-urlencoded'}}).success(function(data) {
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
			case "h":	return Boolean($scope.honorshours.length >= 3);
			case "c": return Boolean($scope.colloquia.length >= 1);
			case "e": return Boolean($scope.excellence.length >= 1);
		}
	};

	// checks whether we want to fetch the user's info or not, based on whether they've entered a 7-digit number
	$scope.doFetch = function() {
		if ($scope.pid.length === 7) {
			// initialize and clear the arrays
			$scope.honorshours = new Array();
			$scope.colloquia = new Array();
			$scope.excellence = new Array();

			$scope.fetch();
		}
	};
};

CitizenshipCtrl.$inject = ['$scope', '$http'];