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
				data.members = snapshot.child('members').numChildren();
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
		}
	}
});