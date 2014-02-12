'use strict';

angular.module('myhonorsCareer').controller('CareersViewCtrl', ['$scope', '$timeout', '$routeParams', '$location', 'FirebaseIO', 'UserService', 'CareerService', function($scope, $timeout, $routeParams, $location, FirebaseIO, UserService, CareerService) {
	$scope.positionID = $routeParams.positionID;
	
	CareerService.read($scope.positionID, function(data) {
		$timeout(function() {
			$scope.position = data;		
			$scope.applications = data.applications;
		});
	});
	
	
	/* ADMIN FUNCTIONALITY */

	if ($scope.user.auth.isStaff || $scope.user.auth.isAdmin) {
		$scope.modalOpts = {
			backdropFade: true,
			dialogFade: true
		};

		$scope.confirmDelete = function() {
			$scope.showDeleteConfirmation = true;
		};

		$scope.cancelDelete = function() {
			$scope.showDeleteConfirmation = false;
		};

		$scope.doDelete = function() {
			CareerService.delete($scope.positionID); // Delete position
			$scope.showDeleteConfirmation = false; // Close the deletion confirmation modal
			$location.path('career');
		};
		
		
		$scope.toggleActivation = function($event, positionID, currentStatus) {
			$event.stopPropagation();
			CareerService.toggleActivation(positionID, currentStatus);
		};
	}	
	
}]);
