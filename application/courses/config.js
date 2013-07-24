'use strict';

angular.module('myhonorsCourses').config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/courses/:courseId', {
			templateUrl: 'application/courses/course-view.html',
			controller: 'CourseViewCtrl',
			requireLogin: true,
			resolve: appResolve});
}]);