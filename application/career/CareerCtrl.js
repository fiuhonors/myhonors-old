'use strict';

angular.module('myhonorsCareer').controller('CareerCtrl', ['$scope', '$timeout', 'FirebaseIO', 'CareerService', 'UserService', function($scope, $timeout, FirebaseIO, CareerService, UserService) {
	$scope.careers = CareerService.list();
	$scope.pendingCareers = {};
	
	$scope.$watchCollection( 'careers', function( collection ) {
		angular.forEach( collection, function( career, key ) {
			if ( career.status === "pending" )
			{
				$scope.pendingCareers[ key ] = career;
				$scope.showPending = true;
			}
		});
	});
	
	//$scope.newPosition = {companyName: '', contactName: '', contactEmail: '', description: '', startDate: '', endDate: '', hoursPerWeek: '' , workDays: $scope.selectedDays, paid: false};
	$scope.newPosition = {};
	$scope.selectedDays = [];
	

	$scope.doAdd = function() {
		$scope.newPosition.status = "active";
		CareerService.create($scope.newPosition);
		$scope.newPosition = {};

	}
	
	$scope.toggleActivation = function($event, positionID, currentStatus) {
		$event.stopPropagation();
		CareerService.toggleActivation(positionID, currentStatus);
	};

}]);
