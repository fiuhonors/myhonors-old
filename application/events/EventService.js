'use strict'

angular.module('myhonorsEvents').factory('EventService', function($q, FirebaseIO, FirebaseCollection, UserService) {
 	// since we don't need to execute this every time getTypes() is called, we can
 	// create a single collection (that lives with the singleton service) here
 	var typesRef = FirebaseIO.child('system_settings/eventTypes');
 	var eventTypes = FirebaseCollection(typesRef);

	return {
		create: function(eventObject) {
			if (!angular.isString(eventObject.name) ||
				!angular.isObject(eventObject.date) ||
				!angular.isNumber(eventObject.date.starts) ||
				!angular.isNumber(eventObject.date.ends) ||
				!angular.isObject(eventObject.location) ||
				!angular.isString(eventObject.location.name) ||
				!angular.isObject(eventObject.type)
			) {
				// invalid input, do nothing
				return;
			}

			FirebaseIO.child('events').push(eventObject);

		},
		read: function(eventId, onComplete) {
			var deferred = $q.defer();

			FirebaseIO.child('events/' + eventId).on('value', function(snapshot) {
				if (snapshot.val() === null) {
					// event was deleted, do nothing
					return;
				}

				var data = snapshot.val();
				data.id = snapshot.name();
				data.rsvps = snapshot.child('rsvps').numChildren();
				data.comments = snapshot.child('comments').numChildren();

				if (angular.isFunction(onComplete)) {
					onComplete(data);
				}

				deferred.resolve(data);	
			});

			return deferred.promise;
		},

		/**
		 * Returns a FirebaseCollection of events
		 *
		 * @param options Object	Can have limit, startAt, and endAt properties
		 */
		list: function(options) {
			var eventsRef = FirebaseIO.child('events');

			var options = options || {};
			if (options.startAt) eventsRef = eventsRef.startAt(options.startAt);
			if (options.endAt)   eventsRef = eventsRef.endAt(options.endAt);
			if (options.limit)   eventsRef = eventsRef.limit(options.limit);

			var self = this;
			return FirebaseCollection(eventsRef, {metaFunction: function(doAdd, snapshot) {
				var extraData = {
					id: snapshot.name(),
					rsvps: snapshot.child('rsvps').numChildren(),
					comments: snapshot.child('comments').numChildren()
				};
				doAdd(snapshot, extraData);
			}});
		},

		update: function() {
			// ...
		},
		delete: function(eventId) {
			FirebaseIO.child('events/' + eventId).remove();
		},

		/**
		 * Get a list of different event types
		 */
		 getTypes: function() {
			return eventTypes;
		 }
	}
});