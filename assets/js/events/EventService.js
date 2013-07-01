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
				var data = snapshot.val();
				data.id = snapshot.name();
				onComplete(data);
			});
		},
		list: function() {
			var eventsRef = FirebaseIO.child('events');
			return FirebaseCollection(eventsRef);
		},
		update: function() {
			// ...
		},
		delete: function(eventId) {
			FirebaseIO.child('events/' + eventId).remove();
		}
	}
});