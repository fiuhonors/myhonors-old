'use strict';

var myhonorsPosts = angular.module('myhonorsPosts', ['ngResource']);

/* Config */

myhonorsPosts.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/posts/:postId', {templateUrl: 'partials/posts.html', controller: 'PostBrowseCtrl'});
}]);

/* Services */

myhonorsPosts.factory('Posts', ['$resource', function($resource) {
	return $resource('posts/:postId');
}]);

/* Controllers */

myhonorsPosts.controller('PostBrowseCtrl', ['$scope', '$routeParams', '$http', '$location', function PostBrowseCtrl($scope, $routeParams, $http, $location) {
	$scope.postId = parseInt($routeParams.postId);
	
	$scope.profile = {
		username: "Sergio Pantoja",
		small_thumb: "img/sergio.jpg"
	};

	$scope.fetch = function() {
		$http.get('/posts/' + $scope.postId).success(function(data) {
			$scope.posts = data;
		});
	};

	$scope.submitPost = function(parent, text) {
		var data = 'content=' + text; // POST data in the header is formatted just like GET data in the URL (e.g. one=1&two=2)
		// todo: consolidate posts/reply and posts/text so it just works based on whether a parent id is given or not
		$http.post('/posts/reply/' + parent, data, {headers: {'Content-Type' : 'application/x-www-form-urlencoded'}}).success(function(data) {
			$scope.fetch();
		});
	};

	$scope.addTag = function(post_id, tag) {
		var data = 'tag=' + tag + '&return_name=true';
		// todo: ajax submit
		$http.post('/tags/add/' + post_id, data, {headers: {'Content-Type' : 'application/x-www-form-urlencoded'}}).success(function(data) {
			$scope.fetch();
		});
	}

	$scope.showMoreReplies = function(parent) {
		$location.path('/posts/' + parent);
	};

	/*
	 * Gets the grid amount based on 960.gs so we can render children comment blocks correctly
	 * The 18 comes from the total grid (24) minus the left sidebar grid (6)
	 * The 11 is the minimum width that we want a grid to be
	 *
	 * @param depth the depth of the comment, probably pulled from the JSON object
	 *
	 * @return the proper grid width, or 0 if it's less than the minimum
	 */
	$scope.getPostGrid = function(depth) {
		var number = 11; // default value
		if (depth < 7) { number = 18 - depth; }
		return number;
	};

	$scope.getContentGrid = function(depth) {
		return $scope.getPostGrid(depth) - 2; // subtracts 2 because the profile pic div is 2 grids wide
	};

	// initializes the page
	$scope.fetch();
}]);