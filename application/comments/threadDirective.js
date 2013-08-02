'use strict';

angular.module('myhonorsComments').directive('thread', function($compile, $location, CommentService) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			source: '=',
		},
		templateUrl: 'application/comments/partials/thread.html',
		link: function(scope, element, attrs) {
			// local scope variables
			scope.mainReply = {
				showReply: false,
				replyContent: '',
				addReply: function() {
					CommentService.create({
						content: scope.mainReply.replyContent,
						parent: scope.source.id
					});
					scope.mainReply.showReply = false;
					scope.mainReply.replyContent = '';
				},
				deleteComment: function() {
					CommentService.delete();
				},
				getPermalink: function() {
					return (scope.source && scope.source.id) ? '#' + $location.path() + '/discuss/' + scope.source.id : null;
				}
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