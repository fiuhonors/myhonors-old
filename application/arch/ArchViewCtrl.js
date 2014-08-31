'use strict';

angular.module('myhonorsArch').controller('ArchViewCtrl', ['$scope', '$routeParams', 'FirebaseIO', '$timeout', '$location', function($scope, $routeParams, FirebaseIO, $timeout, $location) {
	var projectRef = FirebaseIO.child('arch/' + $routeParams.projectId);

	projectRef.on('value', function(snapshot) {
		if (snapshot.val() === null) {
			// object was deleted or it doesn't exist, so do nothing
			return;
		}

		// get student profile
		FirebaseIO.child('user_profiles/' + snapshot.child('student').val()).once('value', function(studentSnapshot) {
			// then get advisor profile
			FirebaseIO.child('user_profiles/' + snapshot.child('advisor').val()).once('value', function(advisorSnapshot) {
				// then save everything to scope
				$timeout(function() {
					$scope.project = snapshot.val();
					$scope.project.student = studentSnapshot.val();
					$scope.project.student.id = snapshot.child('student').val();
					$scope.project.advisor = advisorSnapshot.val();
					$scope.project.advisor.id = snapshot.child('advisor').val();
					$scope.project.$id = snapshot.name();
				});
			});
		});
	});

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
		FirebaseIO.child('user_profiles/' + $scope.project.student.id + '/archProjects/' + projectRef.name()).remove();
		FirebaseIO.child('user_profiles/' + $scope.project.advisor.id + '/archProjects/' + projectRef.name()).remove();
		projectRef.remove(); // delete project
		$scope.showDeleteConfirmation = false; // close deletion confirmation modal
		$location.path('arch'); // redirect to main page
	};
}]);