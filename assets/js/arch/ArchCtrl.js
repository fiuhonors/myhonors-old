'use strict';

angular.module('myhonorsArch').controller('ArchCtrl', ['$scope', '$rootScope', 'FirebaseIO', '$timeout', '$location', function($scope, $rootScope, FirebaseIO, $timeout, $location) {
	$scope.projects = [];

	if ($rootScope.profile.archProjects) {
		angular.forEach($rootScope.profile.archProjects, function(value, key) {
			FirebaseIO.child('arch/' + key).once('value', function(snapshot) {
				$timeout(function() {
					var project = snapshot.val();
					project.id = snapshot.name();

					$scope.projects.push(project);
				});
			})
		});
	}

	$scope.goToProject = function(projectId) {
		$location.path('/arch/' + projectId + '/contract');
	};

}]);