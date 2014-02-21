'use strict';

angular.module('myhonorsCareer').controller('CareersApplyViewCtrl', ['$scope', '$timeout', '$location', '$routeParams', '$fileUploader', 'FirebaseIO', 'UserService', 'CareerService', function($scope, $timeout, $location, $routeParams, $fileUploader, FirebaseIO, UserService, CareerService) {
	$scope.user = UserService.profile;
	$scope.positionID = $routeParams.positionID;
	$scope.applicationID = $routeParams.applicationID;

	CareerService.read($scope.positionID, function(data) {
		$timeout(function() {
			$scope.position = data;		
		});
	});
	
	CareerService.readApplication($scope.positionID, $scope.applicationID, function(data) {
		$timeout(function() {
			$scope.application = data;		
		});
	});
	
}]);
