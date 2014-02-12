'use strict';

angular.module('myhonorsCareer').controller('CareersFormCtrl', ['$scope', '$timeout', '$location', '$routeParams', 'CareerService', function($scope, $timeout, $location, $routeParams, CareerService) {

		if ($routeParams.positionID == null) {	//If no paramater ID has been passed, the user is creating a new career
			$scope.newPosition = {};
		} else {								//If a paramter ID is passed, the user is editing an existing career
			CareerService.read($routeParams.positionID, function(data) {
			$timeout(function() {
				$scope.newPosition = data;		
				});
			});
		}
		
		$scope.doAdd = function() {
			
			if ($routeParams.positionID == null) {
				$scope.newPosition.status = "active";
				CareerService.create($scope.newPosition);
			} else {
				CareerService.update($routeParams.positionID,$scope.newPosition);
			}
			
			
			$location.path('career');
		}
}]);
