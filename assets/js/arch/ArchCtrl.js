'use strict';

angular.module('myhonorsArch').controller('ArchCtrl', ['$scope', '$timeout', '$location', 'FirebaseIO', 'FirebaseCollection', function($scope, $timeout, $location, FirebaseIO, FirebaseCollection) {
	$scope.projects = [];
	$scope.searchText = '';
	$scope.orderBy = '';

	if ($scope.user.auth.isArchMod) {
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
	} else if ($scope.user.profile.archProjects) {
		angular.forEach($scope.user.profile.archProjects, function(value, key) {
			FirebaseIO.child('arch/' + key).once('value', function(snapshot) {
				$timeout(function() {
					var project = snapshot.val();
					project.$id = snapshot.name();

					$scope.projects.push(project);
				});
			})
		});
	}

	// this is just used to flip between ordering by fname or lname. when we update
	// to AngularJS 1.15+, we can replace this with a ternary operator in the ng-click expression
	$scope.rotateOrderBy = function(studentOrAdvisor) {
		$scope.orderBy = ($scope.orderBy === studentOrAdvisor + '.fname') ? studentOrAdvisor + '.lname' : studentOrAdvisor + '.fname';
	}

	$scope.goToProject = function(projectId) {
		$location.path('/arch/' + projectId);
	};

	$scope.goToContract = function(projectId) {
		$location.path('/arch/' + projectId + '/contract');
	};

}]);