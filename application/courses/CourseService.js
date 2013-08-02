'use strict'

angular.module('myhonorsCourses').factory('CourseService', function($q, FirebaseIO, FirebaseCollection, UserService) {
	return {
		/**
		 * Creates a new course
		 */
		create: function() {
			// ...
		},

		/**
		 * Gets all relevant information about a single course
		 */
		read: function(courseId, callback) {
			var deferred = $q.defer();

			FirebaseIO.child('courses/' + courseId).once('value', function(snapshot) {
				var data = snapshot.child('info').val();
				data.id = snapshot.name();
				data.members = snapshot.child('members').numChildren();
				data.announcements = FirebaseCollection(snapshot.child('announcements').ref());
				deferred.resolve(data);
				if (callback) callback(data);
			});

			return deferred.promise;
		},

		/**
		 * Gets a list of courses
		 */
		list: function() {
			// ...
		},

		/**
		 * Updates a single course with new information
		 */
		update: function() {
			// ...
		},

		/**
		 * Deletes a single course
		 */
		delete: function() {
			// ...
		},

		// other functionality below

		announcement: {
			/**
			 * Creates a new announcement
			 */
			create: function(courseId, data) {
				// only check required fields
				if (!angular.isDefined(data) ||
					!angular.isString(data.title) ||
					!angular.isString(data.content) ||
					!angular.isNumber(data.date)) {
					// invalid data, do nothing
					return;
				}

				data.authorId = UserService.profile.id;

				FirebaseIO.child('courses/' + courseId + '/announcements').push(data);
			},

			/**
			 * Deletes an announcement
			 */
			delete: function(courseId, announceId) {
				FirebaseIO.child('courses/' + courseId + '/announcements/' + announceId).remove();
			}
		}
	}
});