'use strict';

angular.module('myhonorsCourses').controller('CourseViewCtrl', ['$scope', '$routeParams', 'FirebaseIO', 'CourseService', 'CommentService', function($scope, $routeParams, FirebaseIO, CourseService, CommentService) {
	$scope.course = CourseService.read($routeParams.courseId);
	$scope.comments = CommentService.listClutch2('courses/' + $routeParams.courseId + '/comments');

	/* ANNOUNCEMENTS */

	$scope.resetAnnouncement = function() {
		$scope.newAnnounce = {
			title: 'Sample Title',
			content: 'This is some sample content...',
			color: 'info'
		};
	};
	
	$scope.resetAnnouncement();

	$scope.modalOpts = {
		backdropFade: true,
		dialogFade: true
	};

	$scope.showAddAnnouncement = false;

	$scope.doAddAnnouncement = function() {
		$scope.newAnnounce.date = Date.now();
		CourseService.announcement.create($routeParams.courseId, $scope.newAnnounce);
		$scope.showAddAnnouncement = false; // close deletion confirmation modal
		$scope.resetAnnouncement();
	};
}]);