'use strict';

var myhonors = angular.module('myhonors', ['myhonorsConfig', 'Firebase', 'myhonorsUser', 'myhonorsEvents']);

/* Config */

myhonors.config(['$routeProvider', function($routeProvider) {
	$routeProvider.otherwise({redirectTo:''});
}]);

/* Controllers */

myhonors.controller('AppCtrl', ['$scope', '$rootScope', '$location', 'Profile', function AppCtrl($scope, $rootScope, $location, Profile) {
	$rootScope.page_title = "";
	$rootScope.profile = Profile;

	$scope.results = function(content) {
		$scope.response = content;
	};
}]);

myhonors.directive('imgRotate', function($timeout) {
		return function(scope, elm, attrs) {
			// make the images sit on top of each other
			elm.addClass('img-rotate');

			var children = elm.children();
			var first = children.first();
			var current = first;
			var previous = null;

			var delay = attrs.delay || 2000;

			children.css('display', 'none');
			current.css('display', 'block');

			// base case: if there are less than two images, we have nothing to rotate
			if (children.length < 2) {
				return;
			}

			// rotate!
			$timeout(function rotate() {
				if (current.next().length === 0) {
					first.css('display', 'block');
					current.fadeOut();
					current = first;
				}
				else {
					previous = current;
					current = current.next();
					current.fadeIn(function() {
						previous.css('display', 'none');
					})
;					}

				// do it again!
				$timeout(rotate, delay, false);
			}, delay, false);
	};
});

myhonors.directive('fileupload', function () {
	return {
		restrict: 'E',
		template: '<input type="file" name="file" onchange="angular.element(this).scope().setFile(this)">',
		replace: true,
		controller: function ($scope) {
			$scope.setFile = function (elem) {
				var fd = new FormData(),
					xhr = new XMLHttpRequest();

				fd.append("file", elem.files[0]);

				xhr.open("POST", "api/upload", true);
				xhr.send(fd);
			};
		}
	};
});