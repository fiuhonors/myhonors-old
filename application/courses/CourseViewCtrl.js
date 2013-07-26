'use strict';

angular.module('myhonorsCourses').controller('CourseViewCtrl', ['$scope', '$routeParams', 'CourseService', function($scope, $routeParams, CourseService) {
	$scope.course = CourseService.read($routeParams.courseId);

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