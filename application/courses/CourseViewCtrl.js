'use strict';

angular.module('myhonorsCourses').controller('CourseViewCtrl', ['$scope', '$routeParams', 'CourseService', function($scope, $routeParams, CourseService) {
	$scope.course = CourseService.read($routeParams.courseId);
}]);