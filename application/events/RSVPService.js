'use strict'

angular.module('myhonorsEvents').factory('RSVPService', function(FirebaseIO, FirebaseCollection, UserService) {
	return {
		create: function(eventId, options) {
			this.update(eventId, options);
		},

		/**
		 * Reads the RSVP data of the current user
		 */
		read: function(eventId) {
			return this.hasRSVP(eventId) ? UserService.profile.rsvps[eventId] : null;
		},

		/**
		 * Returns a FirebaseCollection of RSVPs
		 *
		 * @param eventId String	The event ID
		 * @param options Object	Can have limit, startAt, and endAt properties
		 */
		list: function(eventId, options) {
			var rsvpsRef = FirebaseIO.child('events/' + eventId + '/rsvps');

			var options = options || {};
			if (options.startAt) rsvpsRef = rsvpsRef.startAt(options.startAt);
			if (options.endAt)   rsvpsRef = rsvpsRef.endAt(options.endAt);
			if (options.limit)   rsvpsRef = rsvpsRef.limit(options.limit);

			return FirebaseCollection(rsvpsRef, {metaFunction: function(doAdd, data) {
				FirebaseIO.child('user_profiles/' + data.name()).once('value', function(userSnapshot) {
					doAdd(data, userSnapshot.val());
				});
			}});
		},
		
		/**
		 * Updates an RSVP. The information gets saved on the event reference (so we can pull the info from
		 * the event page) and also on the user's reference (so we can pull it from a user profile page).
		 *
		 * @param eventId    The event ID
		 * @param options    An object with the options you want to update
		 */
		update: function(eventId, options) {
			angular.forEach(options, function(value, key) {
				FirebaseIO.child('events/' + eventId + '/rsvps/' + UserService.profile.id + '/' + key).set(value);
				UserService.ref.child('rsvps/' + eventId + '/' + key).set(value);
			});
		},

		delete: function(eid) {
			// remove attendance info from event and user's profile
			FirebaseIO.child('/events/' + eid + '/rsvps/' + UserService.profile.id).remove();
			UserService.ref.child('rsvps/' + eid).remove();
		},
		hasRSVP: function(eid) {
			return UserService.profile && UserService.profile.rsvps && UserService.profile.rsvps[eid];
		}
	}
});