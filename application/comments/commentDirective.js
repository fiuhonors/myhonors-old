'use strict';

angular.module('myhonorsComments').directive('comment', function($compile, $location, CommentService) {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			comment: '=',
			depth: '@',
			maxDepth: '@',
			sortComments: '='
		},
		templateUrl: 'application/comments/partials/comment.html',
		link: function(scope, element, attrs) {
			// local scope variables
			scope.reply = {
				showReply: false,
				replyContent: '',
				addReply: function() {
					CommentService.create({
						content: scope.reply.replyContent,
						parent: scope.comment.id
					});
					scope.reply.showReply = false;
					scope.reply.replyContent = '';
				},
				deleteComment: function() {
					CommentService.delete();
				},
				getPermalink: function() {
					return '#' + $location.path() + '/discuss/' + scope.comment.id;
				}
			};

			// focus the textarea when the reply button is clicked
			scope.$watch('reply.showReply', function(newVal) {
				if (newVal === true) element.find('textarea').focus();
			});

			// recursively generate child comments up to a certain depth
			if (parseInt(scope.depth) < scope.maxDepth) {
				scope.$watch('comment.children.length', function(newVal) {
					if (newVal > 0) {
						var subElement = element.children().eq(1).children().eq(-1);
						subElement.html('<comment ng-repeat="comment in comment.children | orderBy:sortComments.current" comment="comment" depth="' + (parseInt(scope.depth) + 1) + '" max-depth="' + scope.maxDepth + '"></comment>');
						$compile(subElement.contents())(scope);
					}
				});
			}
		}
	}
});