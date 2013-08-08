'use strict'

angular.module('myhonorsComments').factory('CommentService', function($q, $timeout, FirebaseIO, FirebaseCollection, UserService) {
	return {
		/**
		 * Create a comment
		 *
		 * @param {Object|String}        data         String with the comment content, or an object containing
		 *                                            the following properties:
		 *                                              - content {String} The comment content
		 *                                              - parent: {String} Optional ID of the parent comment
		 * @param {String|FirebaseRef}   locationRef  Optional location to save comment reference
		 * @param {Function}             onComplete   Optional callback
		 */
		create: function(data, locationRef, onComplete) {
			if (!angular.isDefined(data)) return;

			// since we can accept both a string and an object, we normalize the input here
			if (angular.isString(data)) data = {content: data};
			if (angular.isString(locationRef)) locationRef = FirebaseIO.child(locationRef);

			var now = Date.now();
			var commentRef;
			var newCommentData = {
				author: UserService.profile.id,
				content: data.content,
				parent: data.parent || null,
				date: now
			};

			commentRef = FirebaseIO.child('comments').push(newCommentData);
			
			var commentId = commentRef.name(),
				q1 = $q.defer(), q2 = $q.defer(), q3 = $q.defer(), q4 = $q.defer();

			function callback(q) {
				return function(error) {
					if (error) q.reject(error);
					else q.resolve();
				}
			};

			$q.all([q1.promise, q2.promise, q3.promise, q4.promise]).then(function(values) {
				// successly resolved all promises
				if (angular.isFunction(onComplete)) onComplete(false, values);
			}, function(error) {
				// at least one promise was rejected. we are guaranteed to receive an error object
				if (angular.isFunction(onComplete)) onComplete(error);
			});

			if (locationRef) {
				locationRef.child(commentId).setWithPriority(true, now, callback(q1));
			} else {
				q1.resolve();
			}

			UserService.ref.child('/comments/' + commentId).set(true, callback(q2));

			if (data.parent) {
				// we update the priorities so we know there's a new update and our collections can be ordered appropriately
				FirebaseIO.child('comments/' + data.parent + '/children/' + commentId).setWithPriority(true, now, callback(q3));
				FirebaseIO.child('comments/' + data.parent).setPriority(now, callback(q4));
			} else {
				q3.resolve();
				q4.resolve();
			}
		},

		/**
		 * Reads a single comment
		 */
		read: function(commentId, onComplete) {
			var self = this,
			    deferred = $q.defer();

			FirebaseIO.child('comments/' + commentId).once('value', function(snapshot) {
				if (snapshot.val() === null) return;

				var data = snapshot.val();
				data.id = snapshot.name();

				// recursively create a list (i.e. FirebaseCollection) for the children as well
				data.children = self.list(snapshot.child('children').ref());
				data.points = snapshot.child('points').numChildren();

				// attach author's profile info to the comment
				var authorId = snapshot.child('author').val();
				FirebaseIO.child('user_profiles/' + authorId).on('value', function(userSnapshot) {
					data.author = (userSnapshot.val() === null)
						? {fname: '[deleted]'}
						: angular.extend(userSnapshot.val(), {id: userSnapshot.name()})
						;
					if (angular.isFunction(onComplete)) onComplete(data, snapshot);
					deferred.resolve(data);
				});
			});

			return deferred.promise;
		},

		/**
		 * Returns a collection of comments
		 *
		 * @param commentListRef {String|FirebaseRef} A Firebase reference to the list of comments
		 * @param options        Object               Can have limit, startAt, and endAt properties
		 */
		list: function(commentListRef, options) {
			var self = this;

			if (angular.isString(commentListRef)) commentListRef = FirebaseIO.child(commentListRef);

			var options = options || {};
			if (options.startAt) commentListRef = commentListRef.startAt(options.startAt);
			if (options.endAt)   commentListRef = commentListRef.endAt(options.endAt);
			if (options.limit)   commentListRef = commentListRef.limit(options.limit);
			
			return new FirebaseCollection(commentListRef, 'comments', function(extraData, snapshot) {
				if (snapshot.val() === null) return;

				extraData.points = snapshot.child('points').numChildren();

				// attach author's profile info to the comment
				var authorId = snapshot.child('author').val();
				FirebaseIO.child('user_profiles/' + authorId).on('value', function(userSnapshot) {
					extraData.author = (userSnapshot.val() === null)
						? {fname: '[deleted]'}
						: angular.extend(userSnapshot.val(), {id: userSnapshot.name()});
				});
			}, true);
		},

		listClutch: function(pointerListRef) {
			var collection = [];

			if (angular.isString(pointerListRef)) pointerListRef = FirebaseIO.child(pointerListRef);

			pointerListRef.on('value', function(snapshot) {
				collection.splice(0, 0);
				snapshot.forEach(function(mainPost) {
					FirebaseIO.child('comments/' + mainPost.name()).on('value', function(dataSnap) {
						var extraData = dataSnap.val();
						// get extra data
						extraData.points = dataSnap.child('points').numChildren();
						extraData.children = dataSnap.child('children').numChildren();

						// attach author's profile info to the comment
						var authorId = dataSnap.child('author').val();
						FirebaseIO.child('user_profiles/' + authorId).on('value', function(userSnapshot) {
							extraData.author = (userSnapshot.val() === null)
								? {fname: '[deleted]'}
								: angular.extend(userSnapshot.val(), {id: userSnapshot.name()});
							collection.push(extraData);
						});
					});
				});
			});

			return collection;
		},

		listClutch2: function(pointerListRef) {
			if (angular.isString(pointerListRef)) pointerListRef = FirebaseIO.child(pointerListRef);
			var index = new FirebaseIndex(pointerListRef, FirebaseIO.child('comments'));
			return new FirebaseCollection(index, {metaFunction: function(doAdd, data) {
				var extraData = {
					id: data.name(),
					children: data.child('children').numChildren(),
					points: data.child('points').numChildren()
				};

				// attach author's profile info to the comment
				var authorId = data.child('author').val();
				var flag = true;
				FirebaseIO.child('user_profiles/' + authorId).on('value', function(userSnapshot) {
					extraData.author = (userSnapshot.val() === null)
						? {fname: '[deleted]'}
						: angular.extend(userSnapshot.val(), {id: userSnapshot.name()});
					if (flag) {
						doAdd(data, extraData);
						flag = false;
					}
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
					if (data.parent) FirebaseIO.child('comments/' + data.parent + '/children/' + commentId).remove();
				}
			});
		},

		listWithChildren: function(pointerListRef, dataRef, fetchChildren) {
			var self = this;

			var list = {
				list: {}, // holds the actual list
				total: 0 // holds the number of objects in the list
			};

			if (typeof pointerListRef == 'string') pointerListRef = FirebaseIO.child(pointerListRef);
			if (typeof dataRef == 'string') dataRef = FirebaseIO.child(dataRef);

			pointerListRef.on('child_added', function(pointer) {
				console.log('child_added', pointer.name());
				dataRef.child(pointer.name()).on('value', function(dataSnapshot) {
					var result = dataSnapshot.val();

					if (fetchChildren && dataSnapshot.child('children').numChildren() > 0) {
						result.children = self.listWithChildren(dataSnapshot.child('children').ref(), dataRef, true);
					}

					$timeout(function() {
						list[dataSnapshot.name()] = result;
					});
				});
			});

			return ;
		},
    
		points: function(commentId, up) {
			// user's can't upvote their own comments
			if (this.isAuthor(commentId)) return;

			if (up) {
				FirebaseIO.child('comments/' + commentId + '/points/' + UserService.profile.id).set(true);
				UserService.ref.child('points/' + commentId).set(true);
			} else {
				FirebaseIO.child('comments/' + commentId + '/points/' + UserService.profile.id).remove();
				UserService.ref.child('points/' + commentId).remove();
			}
		},

		isAuthor: function(commentId) {
			return UserService.profile && UserService.profile.comments && UserService.profile.comments[commentId] === true;
		},
    
		hasVoted: function(commentId) {
			return UserService.profile && UserService.profile.points && UserService.profile.points[commentId] === true;
		}

	}
});