'use strict';

angular.module('myhonorsArch').controller('ArchEditCtrl', ['$scope', '$rootScope', '$routeParams', 'FirebaseIO', '$timeout', '$location', function($scope, $rootScope, $routeParams, FirebaseIO, $timeout, $location) {
	var projectRef = FirebaseIO.child('arch/' + $routeParams.projectId);

	projectRef.on('value', function(snapshot) {
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

	$scope.doSaveChanges = function() {
		projectRef.set({
			name: $scope.project.name,
			student: $scope.project.student.id,
			advisor: $scope.project.advisor.id,
			// otherInfo is data that's only needed for ARCH right now
			otherInfo: {
				studentMajor1: $scope.project.otherInfo.studentMajor1,
				studentMajor2: $scope.project.otherInfo.studentMajor2,
				studentPhone: $scope.project.otherInfo.studentPhone,
				studentEmail: $scope.project.otherInfo.studentEmail,
				advisorEmail: $scope.project.otherInfo.advisorEmail
			}
		});

		// remove archProject from old student & advisor
		FirebaseIO.child('user_profiles/' + $scope.originalProject.student.id + '/archProjects/' + projectRef.name()).remove();
		FirebaseIO.child('user_profiles/' + $scope.originalProject.advisor.id + '/archProjects/' + projectRef.name()).remove();

		// set student info
		FirebaseIO.child('user_profiles/' + $scope.project.student.id + '/archProjects/' + projectRef.name()).set(true);
		FirebaseIO.child('user_profiles/' + $scope.project.student.id + '/fname').set($scope.project.student.fname);
		FirebaseIO.child('user_profiles/' + $scope.project.student.id + '/lname').set($scope.project.student.lname);

		// set advisor info
		FirebaseIO.child('user_profiles/' + $scope.project.advisor.id + '/archProjects/' + projectRef.name()).set(true);
		FirebaseIO.child('user_profiles/' + $scope.project.advisor.id + '/fname').set($scope.project.advisor.fname);
		FirebaseIO.child('user_profiles/' + $scope.project.advisor.id + '/lname').set($scope.project.advisor.lname);

		$location.path('#/arch/' + $routeParams.projectId);
	};
}]);