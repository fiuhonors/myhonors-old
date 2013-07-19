'use strict';

angular.module('myhonors').animation('slide-show', ['$rootScope', function($rootScope) {
	return { 
		setup : function(element) {
			jQuery(element).hide();
		},
		start : function(element, done, memo) {
			//this is where the animation is expected to be run
			jQuery(element).slideDown(200, 'linear', function() {
				done();
			});
		},
		cancel : function(element, done) {
			//this is called when another animation is started
			//whilst the previous animation is still chugging away
		}   
	};
}]).animation('slide-hide', ['$rootScope', function($rootScope) {
	return { 
		setup : function() {
			// do nothing
		},
		start : function(element, done, memo) {
			//this is where the animation is expected to be run
			jQuery(element).slideUp(200, function() {
				done();
			});
		},
		cancel : function(element, done) {
			//this is called when another animation is started
			//whilst the previous animation is still chugging away
		}   
	};
}]);