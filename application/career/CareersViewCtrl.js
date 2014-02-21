'use strict';

angular.module('myhonorsCareer').controller('CareersViewCtrl', ['$scope', '$timeout', '$routeParams', '$location', 'FirebaseIO', 'UserService', 'CareerService', function($scope, $timeout, $routeParams, $location, FirebaseIO, UserService, CareerService) {
	$scope.positionID = $routeParams.positionID;
	
	$scope.alreadyApplied = false; // Flag that tells whether the current student already applied to this position
	CareerService.read($scope.positionID, function(data) {
		$timeout(function() {
			$scope.position = data;		
			$scope.applications = data.applications;
			
			$scope.alreadyApplied = alreadyApplied();
		});
	});
	
	/**
	 * Check if logged user has already applied to this position
	 */
	function alreadyApplied () {
		var userID = UserService.profile.id;
		if ($scope.applications && $scope.applications.hasOwnProperty(userID))	//Check to see if the applications JSON object has a property with logged in user's id
			return true;
			
		return false;
			
	};
	
	
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
