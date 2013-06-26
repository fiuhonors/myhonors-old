'use strict';

angular.module('myhonorsArch').controller('ArchContractCtrl', ['$scope', '$routeParams', 'FirebaseIO', '$timeout', function($scope, $routeParams, FirebaseIO, $timeout) {
	$scope.now = Date.now();
	$scope.student = null;
	$scope.advisor = null;
	$scope.project = null;

	var projectRef = FirebaseIO.child('arch/' + $routeParams.projectId);

	projectRef.on('value', function(snapshot) {
		if (snapshot.val() === null) {
			// object was deleted or it doesn't exist, so do nothing
			return;
		}
		
		// get student profile
		FirebaseIO.child('user_profiles/' + snapshot.child('student').val()).once('value', function(studentSnapshot) {
			$timeout(function() {
				$scope.student = studentSnapshot.val();
			})
		});

		// get advisor profile
		FirebaseIO.child('user_profiles/' + snapshot.child('advisor').val()).once('value', function(advisorSnapshot) {
			$timeout(function() {
				$scope.advisor = advisorSnapshot.val();
			});
		});

		$timeout(function() {
			$scope.project = snapshot.val();
			$scope.project.id = snapshot.name();
		});
	});

	$scope.isStudent = function() {
		return $scope.student && $scope.student.pid === $scope.user.profile.id;
	};

	$scope.isAdvisor = function() {
		return $scope.advisor && $scope.advisor.pid === $scope.user.profile.id;
	};

	$scope.signContract = function() {
		if ($scope.isStudent()) {
			projectRef.child('contract/signedByStudent').set(Date.now())
		}

		if ($scope.isAdvisor()) {
			projectRef.child('contract/signedByAdvisor').set(Date.now())
		}
	}
}]);