'use strict';

/* Services */

angular.module('myhonorsServices', ['ngResource']).

	factory('Post', function($resource) {
		return $resource('http://thc.fiu.edu/myhonors/posts/discuss/:postId', {}, {
			get: {method:'GET', params:{postId:''}, isArray:true}
		});
	});