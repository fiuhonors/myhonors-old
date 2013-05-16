'use strict';

angular.module('myhonorsDashboard').controller('DashboardCtrl', ['$scope', function($scope) {
	$scope.honorsHours = {
		has: 2,
		needs: 1
	}
	$scope.colloquia = {
		has: 0,
		needs: 1
	}
	$scope.excellence = {
		has: 1,
		needs: 1
	}
}]);