'use strict';

angular.module('myhonorsCourses').controller('CourseDiscussCtrl', ['$scope', '$routeParams', 'FirebaseIO', 'CourseService', 'CommentService', function($scope, $routeParams, FirebaseIO, CourseService, CommentService) {
	$scope.source = CommentService.read($routeParams.discussionId);
}]);