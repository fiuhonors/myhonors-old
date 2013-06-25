'use strict';

angular.module('myhonorsArch').controller('ArchAddCtrl', ['$scope', '$rootScope', 'FirebaseIO', '$location', function($scope, $rootScope, FirebaseIO, $location) {
	$scope.doAdd = function(theForm) {
		if (theForm.$invalid) {
			// do nothing
			return;
		}

		var projectRef = FirebaseIO.child('arch').push({
			name: ($scope.newProject.name || ''),
			student: $scope.newProject.studentId,
			advisor: $scope.newProject.advisorId,
			// otherInfo is data that's only needed for ARCH right now
			otherInfo: {
				studentMajor1: ($scope.newProject.studentMajor1 || ''),
				studentMajor2: ($scope.newProject.studentMajor2 || ''),
				studentPhone: ($scope.newProject.studentPhone || ''),
				studentEmail: ($scope.newProject.studentEmail || ''),
				advisorEmail: ($scope.newProject.advisorEmail || '')
			}
		});

		// set student info
		FirebaseIO.child('user_profiles/' + $scope.newProject.studentId + '/archProjects/' + projectRef.name()).set(true);
		FirebaseIO.child('user_profiles/' + $scope.newProject.studentId + '/fname').set($scope.newProject.studentFname);
		FirebaseIO.child('user_profiles/' + $scope.newProject.studentId + '/lname').set($scope.newProject.studentLname);

		// set advisor info
		FirebaseIO.child('user_profiles/' + $scope.newProject.advisorId + '/archProjects/' + projectRef.name()).set(true);
		FirebaseIO.child('user_profiles/' + $scope.newProject.advisorId + '/fname').set($scope.newProject.advisorFname);
		FirebaseIO.child('user_profiles/' + $scope.newProject.advisorId + '/lname').set($scope.newProject.advisorLname);

		$scope.resetForm();

		$location.path('#/arch');
	};

	$scope.resetForm = function() {
		$scope.newProject = {name: '', studentId: '', studentFname: '', studentLname: '', studentEmail: '', studentPhone: '', studentMajor1: '', studentMajor2: '', advisorId: '', advisorFname: '', advisorLname: '', advisorEmail: ''};
	}

	$scope.resetForm();
}]);