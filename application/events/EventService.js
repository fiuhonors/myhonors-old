'use strict'

angular.module('myhonorsEvents').factory('EventService', function($q, FirebaseIO, FirebaseCollection, UserService) {
	return {
		create: function(eventObject) {
			if (!angular.isString(eventObject.name) &&
				!angular.isObject(eventObject.date) &&
				!angular.isNumeric(eventObject.date.starts) &&
				!angular.isNumeric(eventObject.date.ends) &&
				!angular.isObject(eventObject.location) &&
				!angular.isString(eventObject.location.name) &&
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
		list: function() {
			var eventsRef = FirebaseIO.child('events');
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
		}
	}
});