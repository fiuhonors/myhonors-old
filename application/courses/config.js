'use strict';

angular.module('myhonorsCourses').config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/courses/:courseId', {
			templateUrl: 'application/courses/course-view.html',
			controller: 'CourseViewCtrl',
			requireLogin: true,
			resolve: appResolve}).
		when('/courses/:courseId/discuss/:discussionId', {
			templateUrl: 'application/courses/discussion-view.html',
			controller: 'CourseDiscussCtrl',
			requireLogin: true,
			resolve: appResolve});
}]);