'use strict';

angular.module('myhonorsEvents').controller('CitizenshipCtrl', ['$scope', '$http', function CitizenshipCtrl($scope, $http) {
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
		
		$http.get('api/attendance?id=' + $scope.userid).success(function(data) {
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