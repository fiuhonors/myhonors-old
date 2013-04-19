'use strict';

angular.module('myhonorsCareer', []).

config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/career', {templateUrl: 'assets/partials/career.html', controller: 'CareerCtrl', requireLogin: false, resolve: appResolve})
}]).

controller('CareerCtrl', ['$scope', '$rootScope', 'FirebaseIO', function($scope, $rootScope, FirebaseIO) {
	$scope.careers = null;
	$scope.searchText = '';
	$scope.newPosition = {companyName: '', contactName: '', contactEmail: '', description: '', paid: false};

	FirebaseIO.child('careers').on('value', function(snapshot) {
		$rootScope.safeApply(function() {
			$scope.careers = snapshot.val();
			$scope.newPosition = {companyName: '', contactName: '', contactEmail: '', description: '', paid: false};
		});
	});

	$scope.doAdd = function() {
		FirebaseIO.child('careers').push($scope.newPosition);
	}
}]);