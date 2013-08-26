'use strict';

angular.module('myhonorsComments').directive('thread', function($compile, $location, CommentService) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			source: '=',
			comments: '=',
			maxDepth: '@'
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
				},
				addPoint: function() {
					// users can't upvote their own comments
					if (CommentService.isAuthor(scope.source.id)) return;
					CommentService.points(scope.source.id, true);
				},
				removePoint: function() {
					CommentService.points(scope.source.id, false);
				},
				isAuthor: function() {
					return (scope.source && scope.source.id) ? CommentService.isAuthor(scope.source.id) : false;
				},
				hasVoted: function() {
					return (scope.source && scope.source.id) ? CommentService.hasVoted(scope.source.id) : false;
				}
			};

			// provides a property to set the orderBy predicate for the comments (.current)
			// and a function to get the value as a text string for the view (.getCurrent())
			scope.sortComments = {
				current: 'date',
				getCurrent: function() {
					switch (this.current) {
						case 'kudos':
							return 'Best';
						case '-date': // a negative sign in front of the predicate will reverse the array
							return 'Newest First';
						case 'date':
						default:
							return 'Oldest First';
					}
				}
			};
		}
	}
});