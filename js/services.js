'use strict';

/* Services */

angular.module('myhonorsServices', ['ngResource']).

	factory('Post', function($resource) {
		return $resource('http://thc.fiu.edu/myhonors/posts/discuss/:postId', {}, {
			get: {method:'GET', params:{postId:''}, isArray:true}
		});
	}).

	factory('Events', function($resource) {
		return $resource('http://thc.fiu.edu/myhonors/events/:action/:eventId/json', {}, {
			get: {method: 'GET', params:{action: 'details'}},
			query: {method:'GET', params:{action: 'browse'}, isArray:true}
		});
	});