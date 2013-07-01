'use strict'

angular.module('myhonorsEvents').factory('EventService', function($q, FirebaseIO, FirebaseCollection, UserService) {
	return {
		create: function(name, date, location, type, desc) {
			if (!angular.isString(name) &&
				!angular.isObject(date) &&
				!angular.isNumeric(date.starts) &&
				!angular.isNumeric(date.ends) &&
				!angular.isObject(location) &&
				!angular.isString(location.name) &&
				!angular.isString(type)
			) {
				// invalid input, do nothing
				return;
			}

			FirebaseIO.child('events').push({
				name: name,
				date: date,
				location: location,
				type: type,
				desc: desc
			});

		},
		read: function(eventId, onComplete) {
			FirebaseIO.child('events/' + eventId).on('value', function(snapshot) {
				if (snapshot.val() === null) {
					// event was deleted, do nothing
					return;
				}

				var data = snapshot.val();
				data.id = snapshot.name();
				data.rsvps = snapshot.child('rsvps').numChildren();
				data.comments = snapshot.child('comments').numChildren();

				onComplete(data);
			});
		},
		list: function() {
			var eventsRef = FirebaseIO.child('events');
			var self = this;
			return FirebaseCollection(eventsRef, {metaFunction: function(doAdd, data) {
				self.read(data.name(), function(snapshot) {
					doAdd(data, snapshot);
				});
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