'use strict';

angular.module('myhonorsArch').controller('ArchCtrl', ['$scope', '$rootScope', 'FirebaseIO', 'FirebaseCollection', '$timeout', '$location', function($scope, $rootScope, FirebaseIO, FirebaseCollection, $timeout, $location) {
	$scope.projects = [];
	$scope.searchText = '';

	if ($rootScope.profile.auth.isArchMod) {
		var projectsRef = FirebaseIO.child('arch');
		$scope.projects = FirebaseCollection(projectsRef, {metaFunction: function(doAdd, data) {
			// get student data
			FirebaseIO.child('user_profiles/' + data.child('student').val()).once('value', function(studentSnapshot) {
				// get advisor data. even though this and the student data call aren't dependent
				// on each other, we still do this in the student data callback so we don't need
				// to mess with multiple asyncronous requests at once. this might be changed later
				FirebaseIO.child('user_profiles/' + data.child('advisor').val()).once('value', function(advisorSnapshot) {
					// now we have everything we want, so execute doAdd() with the final combined data
					doAdd(data, {
						student: angular.extend(studentSnapshot.val(), {pid: studentSnapshot.name()}),
						advisor: angular.extend(advisorSnapshot.val(), {pid: advisorSnapshot.name()})
					});
				});
			});
		}});


		$scope.doAdd = function() {
			var projectRef = FirebaseIO.child('arch').push({
				name: $scope.newProject.name,
				student: $scope.newProject.studentId,
				advisor: $scope.newProject.advisorId
			});

			// set student info
			FirebaseIO.child('user_profiles/' + $scope.newProject.studentId + '/archProjects/' + projectRef.name()).set(true);
			FirebaseIO.child('user_profiles/' + $scope.newProject.studentId + '/fname').set($scope.newProject.studentFname);
			FirebaseIO.child('user_profiles/' + $scope.newProject.studentId + '/lname').set($scope.newProject.studentLname);

			// set advisor info
			FirebaseIO.child('user_profiles/' + $scope.newProject.advisorId + '/archProjects/' + projectRef.name()).set(true);
			FirebaseIO.child('user_profiles/' + $scope.newProject.advisorId + '/fname').set($scope.newProject.advisorFname);
			FirebaseIO.child('user_profiles/' + $scope.newProject.advisorId + '/lname').set($scope.newProject.advisorLname);

			// reset all inputs
			$scope.newProject = {name: '', studentId: '', studentFname: '', studentLname: '', advisorId: '', advisorFname: '', advisorLname: ''}
		}
	} else if ($rootScope.profile.archProjects) {
		angular.forEach($rootScope.profile.archProjects, function(value, key) {
			FirebaseIO.child('arch/' + key).once('value', function(snapshot) {
				$timeout(function() {
					var project = snapshot.val();
					project.$id = snapshot.name();

					$scope.projects.push(project);
				});
			})
		});
	}

	$scope.goToProject = function(projectId) {
		$location.path('/arch/' + projectId + '/contract');
	};

}]);