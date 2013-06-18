'use strict';

angular.module('myhonorsArch').controller('ArchCtrl', ['$scope', '$rootScope', 'FirebaseIO', 'FirebaseCollection', '$timeout', '$location', function($scope, $rootScope, FirebaseIO, FirebaseCollection, $timeout, $location) {
	$scope.projects = [];
	$scope.searchText = '';

	if ($rootScope.profile.auth.isArchMod) {
		var projectsRef = FirebaseIO.child('arch');
		$scope.projects = FirebaseCollection(projectsRef);
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