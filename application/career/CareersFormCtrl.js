'use strict';

angular.module('myhonorsCareer').controller('CareersFormCtrl', ['$scope', '$timeout', '$location', '$routeParams', 'CareerService', function($scope, $timeout, $location, $routeParams, CareerService) {
		var mode = ""; // Used to keep track whether the user is adding a new position or editing an exisiting one
		
		if ($routeParams.positionID == null) {	//If no paramater ID has been passed, the user is creating a new career
			mode = "Add";
			$scope.newPosition = {};
		} else {								//If a paramter ID is passed, the user is editing an existing career
			mode = "Edit";
			CareerService.read($routeParams.positionID, function(data) {
			$timeout(function() {
				$scope.newPosition = data;	
				});
			});
		}
		
		$scope.doAdd = function() {
			
			if (mode == "Add") {
				$scope.newPosition.status = "active";
				var positionID = CareerService.create($scope.newPosition);
				
				if (positionID != null) // If positionID is not null that means the form was valid and the position was created succesfully
					$location.path('career/' + positionID);
			} else {
				var status = CareerService.update($routeParams.positionID,$scope.newPosition);
				if (status)
					$location.path('career/' + $routeParams.positionID);
			}
			
				
		}
}]);
