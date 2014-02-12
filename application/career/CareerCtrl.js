'use strict';

angular.module('myhonorsCareer').controller('CareerCtrl', ['$scope', '$timeout', 'FirebaseIO', 'CareerService', 'UserService', function($scope, $timeout, FirebaseIO, CareerService, UserService) {
	$scope.careers = CareerService.list();
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
	//~ $scope.deactivatePosition = function($event, positionID) {
		//~ $event.stopPropagation();
		//~ FirebaseIO.child('careers/' + positionID + '/status').set("inactive");
	//~ };
	//~ $scope.activatePosition = function($event, positionID) {
		//~ $event.stopPropagation();
		//~ FirebaseIO.child('careers/' + positionID + '/status').set("active");
	//~ };
}]);
