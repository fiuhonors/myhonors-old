'use strict';

angular.module('myhonors').directive('imgRotate', function($timeout) {
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
				});
			}

			// do it again!
			$timeout(rotate, delay, false);
		}, delay, false);
	};
});