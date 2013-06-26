'use strict';

angular.module('myhonorsCareer').controller('CareerCtrl', ['$scope', '$timeout', 'FirebaseIO', function($scope, $timeout, FirebaseIO) {
	$scope.careers = null;
	$scope.searchText = '';
	$scope.newPosition = {companyName: '', contactName: '', contactEmail: '', description: '', paid: false};

	FirebaseIO.child('careers').on('value', function(snapshot) {
		$timeout(function() {
			$scope.careers = snapshot.val();
			$scope.newPosition = {companyName: '', contactName: '', contactEmail: '', description: '', paid: false};
		});
	});

	$scope.doAdd = function() {
		FirebaseIO.child('careers').push($scope.newPosition);
	}
}]);