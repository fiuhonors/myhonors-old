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
				!angular.isArray(eventObject.types)
			) {
				// invalid input, do nothing
				return;
			}

			// setting the priority to the date.ends value allows us to show an event that is currently
			// taking place in any 'Upcoming Events' section
			FirebaseIO.child('events').push(eventObject).setPriority(eventObject.date.ends);
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
				data.comments = snapshot.child('comments').numChildren();
				
				// calculate the total number of RSVPs
				data.rsvps = snapshot.child('rsvps').numChildren();
				snapshot.child('rsvps').forEach(function(snapshot) {
					data.rsvps += snapshot.child('guests').val();
				});

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

			return FirebaseCollection(eventsRef, {metaFunction: function(doAdd, snapshot) {
				var extraData = {
					id: snapshot.name(),
					rsvps: snapshot.child('rsvps').numChildren(),
					comments: snapshot.child('comments').numChildren()
				};

				// add all the guests to the total number of RSVPs
				snapshot.child('rsvps').forEach(function(childSnapshot) {
					extraData.rsvps += childSnapshot.child('guests').val();
				});

				snapshot.child('types').forEach(function(childSnapshot) {
					switch (childSnapshot.val()) {
						case 'Honors Hour':
						case 'Excellence Lecture':
						case 'Colloquium':
							extraData.color = 'gold';
							break;
						default: break;
					}
				});

				doAdd(snapshot, extraData);
			}});
		},

		/**
		 * Updates an event
		 */
		update: function(eventId, eventObject) {
			if (!angular.isString(eventObject.name) ||
				!angular.isObject(eventObject.date) ||
				!angular.isNumber(eventObject.date.starts) ||
				!angular.isNumber(eventObject.date.ends) ||
				!angular.isObject(eventObject.location) ||
				!angular.isString(eventObject.location.name) ||
				!angular.isArray(eventObject.types)
			) {
				// invalid input, do nothing
				return;
			}

			// go through each property in the object and add that specifically, this prevents
			// us from overwriting the entire /events/eventId location (which prevents us from
			// deleting the RSVPs, attendance, comments, etc.)
			angular.forEach(eventObject, function(value, key) {
				FirebaseIO.child('events/' + eventId + '/' + key).set(value);
			});

			// setting the priority to the date.ends value allows us to show an event that is currently
			// taking place in any 'Upcoming Events' section
			FirebaseIO.child('events/' + eventId).setPriority(eventObject.date.ends);
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