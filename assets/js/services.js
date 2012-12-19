'use strict';

/* Services */

angular.module('myhonorsServices', ['ngResource']).

	factory('Post', function($resource) {
		return $resource('posts/discuss/:postId', {}, {
			get: {method:'GET', params:{postId:''}, isArray:true}
		});
	}).

	factory('Events', function($resource) {
		return $resource('events/:action/:eventId/json', {}, {
			get: {method: 'GET', params:{action: 'details'}},
			query: {method:'GET', params:{action: 'browse'}, isArray:true}
		});
	});