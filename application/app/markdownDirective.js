/*
 * angular-markdown-directive v0.1.0
 * (c) 2013 Brian Ford http://briantford.com
 * License: MIT
 */

'use strict';

angular.module('myhonors').directive('markdown', function () {
	var converter = new Showdown.converter();
	return {
		restrict: 'AE',
		link: function (scope, element, attrs) {
			if (attrs.markdown) {
				scope.$watch(attrs.markdown, function (newVal) {
					var html = converter.makeHtml(newVal);
					element.html(html);
				});
			} else {
				var html = converter.makeHtml(element.text());
				element.html(html);
			}
		}
	};
});