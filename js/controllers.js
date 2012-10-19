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
			}
		}
	});
}

EventBrowseCtrl.$inject = ['$scope', 'Events'];

function EventViewCtrl($scope, $routeParams, Post) {
	$scope.eventId = $routeParams.eventId;
	Post.get({postId: $scope.eventId}, function(posts) {
		//success
		$scope.comments = posts[0].children;
		$scope.event = posts[0].content;

		switch ($scope.event.event_type)
		{
			case "h": $scope.event.event_type = "Honors Hour"; break;
			case "c": $scope.event.event_type = "Colloquia"; break;
			case "e": $scope.event.event_type = "Excellence Lecture"; break;
		}
	});

	$scope.renderMap = function(location) {
		return '<iframe width="950" height="300" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?f=d&amp;source=s_d&amp;saddr=' + location + '&amp;daddr=&amp;hl=en&amp;geocode=&amp;sll=25.755411,-80.372983&amp;sspn=0.007508,0.009645&amp;mra=mift&amp;mrsp=0&amp;sz=17&amp;ie=UTF8&amp;t=m&amp;ll=25.756319,-80.369604&amp;spn=0.005798,0.020363&amp;z=16&amp;output=embed"></iframe>';
	}
};

EventViewCtrl.$inject = ['$scope', '$routeParams', 'Post'];

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