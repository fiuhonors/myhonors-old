'use strict'

angular.module('myhonorsComments').factory('CommentService', function($q, FirebaseIO, FirebaseCollection, UserService) {
	return {
		/**
		 * Create a comment
		 *
		 * @param {String}		content		Comment content
		 * @param {FirebaseRef} locationRef	Location to save comment reference
		 * @param {Function}	onComplete	Optional callback
		 */
		create: function(content, locationRef, onComplete) {
			var commentRef = FirebaseIO.child('comments').push({
				author: UserService.profile.id,
				content: content,
				date: Date.now()
			});
			
			var commentId = commentRef.name(),
				q1 = $q.defer(),
				q2 = $q.defer();

			$q.all([q1.promise, q2.promise]).then(function(values) {
				// successly resolved all promises
				if (angular.isFunction(onComplete)) onComplete(false, values);
			}, function(error) {
				// at least one promise was rejected. we are guaranteed to receive an error object
				if (angular.isFunction(onComplete)) onComplete(error);
			});

			locationRef.child(commentId).set(true, function(error) {
				if (error) q1.reject(error);
				else q1.resolve();
			});

			UserService.ref.child('/comments/' + commentId).set(true, function(error) {
				if (error) q2.reject(error);
				else q2.resolve();
			});
		},
		/**
		 * Reads a single comment
		 */
		read: function(commentId, onComplete) {
			FirebaseIO.child('comments/' + commentId).once('value', function(snapshot) {
				var data = snapshot.val();
				data.id = snapshot.name();

				// attach author's profile info to the comment
				var authorId = snapshot.child('author').val();
				FirebaseIO.child('user_profiles/' + authorId).once('value', function(userSnapshot) {
					data.author = (userSnapshot.val() === null) ? {fname: '[deleted]'} : angular.extend(userSnapshot.val(), {id: userSnapshot.name()});
					if (angular.isFunction(onComplete)) onComplete(data, snapshot);
				});
			});
		},

		/**
		 * Returns a collection of comments
		 *
		 * @param commentListRef FirebaseRef A Firebase reference to the list of comments
		 * @param options        Object      Can have limit, startAt, and endAt properties
		 */
		list: function(commentListRef, options) {
			var self = this;
			
			var options = options || {};
			if (options.startAt) commentListRef = commentListRef.startAt(options.startAt);
			if (options.endAt)   commentListRef = commentListRef.endAt(options.endAt);
			if (options.limit)   commentListRef = commentListRef.limit(options.limit);
			
			return new FirebaseCollection(commentListRef, {metaFunction: function(doAdd, data) {
				// read each comment in the list
				self.read(data.name(), function(data, snapshot) {
					doAdd(snapshot, data);
				});
			}});
		},
		
		update: function(commentId) {
			// ...
		},
		delete: function(commentId, secondaryLocationRef) {
			var self = this;
			self.read(commentId, function(data, snapshot) {
				if (UserService.auth.isCommentMod || self.isAuthor(commentId)) {
					snapshot.ref().remove();
					UserService.ref.child('comments/' + commentId).remove();
					if (secondaryLocationRef) secondaryLocationRef.child(commentId).remove();
				}
			});
		},
		isAuthor: function(commentId) {
			return UserService.profile && UserService.profile.comments && UserService.profile.comments[commentId] === true;
		}

	}
});