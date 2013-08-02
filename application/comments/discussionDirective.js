'use strict';

angular.module('myhonorsComments').directive('discussion', function($compile, CommentService) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			collection: '=',
			reference: '@',
			maxDepth: '@'
		},
		templateUrl: 'application/comments/partials/discussion.html',
		link: function(scope, element, attrs) {
			scope.createNewPost = function() {
				CommentService.create(scope.newPostContent, scope.reference);
				scope.newPostContent = '';
			};

			// provides a property to set the orderBy predicate for the comments (.current)
			// and a function to get the value as a text string for the view (.getCurrent())
			scope.sortComments = {
				current: '-date',
				getCurrent: function() {
					switch (this.current) {
						case 'kudos':
							return 'Best';
						case 'date':
							return 'Oldest First';
						case '-date': // a negative sign in front of the predicate will reverse the array
						default:
							return 'Newest First';
					}
				}
			};
		}
	}
});