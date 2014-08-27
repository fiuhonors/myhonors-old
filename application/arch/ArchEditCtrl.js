'use strict';

angular.module('myhonorsArch').controller('ArchEditCtrl', ['$scope', '$routeParams', 'FirebaseIO', '$timeout', '$location', function($scope, $routeParams, FirebaseIO, $timeout, $location) {
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

					// store a copy of the original
					$scope.originalProject = angular.copy($scope.project);
				});
			});
		});
	});

	$scope.doSaveChanges = function(theForm) {
		if (theForm.$invalid) {
			// do nothing
			return;
		}

		projectRef.set({
			name: ($scope.project.name || ''),
			student: $scope.project.student.id,
			advisor: $scope.project.advisor.id,
			// otherInfo is data that's only needed for ARCH right now
			otherInfo: {
				studentMajor1: ($scope.project.otherInfo.studentMajor1 || ''),
				studentMajor2: ($scope.project.otherInfo.studentMajor2 || ''),
				studentPhone: ($scope.project.otherInfo.studentPhone || ''),
				studentEmail: ($scope.project.otherInfo.studentEmail || ''),
				advisorEmail: ($scope.project.otherInfo.advisorEmail || '')
			}
		});

		if ($scope.originalProject.student.id !== $scope.project.student.id || $scope.originalProject.advisor.id !== $scope.project.advisor.id) {
			// remove archProject from old student & advisor
			FirebaseIO.child('user_profiles/' + $scope.originalProject.student.id + '/archProjects/' + projectRef.name()).remove();
			FirebaseIO.child('user_profiles/' + $scope.originalProject.advisor.id + '/archProjects/' + projectRef.name()).remove();
			
			// add archProject to new student & advisor
			FirebaseIO.child('user_profiles/' + $scope.project.student.id + '/archProjects/' + projectRef.name()).set(true);
			FirebaseIO.child('user_profiles/' + $scope.project.advisor.id + '/archProjects/' + projectRef.name()).set(true);
		}

		/* TODO: the following code can be removed once we have all the students and advisors in the database.
		 * Ideally, the Arch moderators won't be able to edit user profile info (such a fname, lname, email)
		 * and this information will simply be pre-loaded into the Arch project view panel. */

		// set student info
		FirebaseIO.child('user_profiles/' + $scope.project.student.id + '/fname').set($scope.project.student.fname);
		FirebaseIO.child('user_profiles/' + $scope.project.student.id + '/lname').set($scope.project.student.lname);

		// set advisor info
		FirebaseIO.child('user_profiles/' + $scope.project.advisor.id + '/fname').set($scope.project.advisor.fname);
		FirebaseIO.child('user_profiles/' + $scope.project.advisor.id + '/lname').set($scope.project.advisor.lname);

		/* end todo ------------------------- */

		$location.path('arch/' + $routeParams.projectId);
	};

	$scope.undoChanges = function() {
		$scope.project = angular.copy($scope.originalProject);
	};
}]);