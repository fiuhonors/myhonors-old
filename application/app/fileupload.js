'use strict';

angular.module('myhonors').directive('fileupload', function () {
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