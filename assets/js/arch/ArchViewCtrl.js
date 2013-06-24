'use strict';

angular.module('myhonorsArch').controller('ArchViewCtrl', ['$scope', '$rootScope', '$routeParams', 'FirebaseIO', '$timeout', '$location', function($scope, $rootScope, $routeParams, FirebaseIO, $timeout, $location) {
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
}]);