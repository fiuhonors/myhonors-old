'use strict'

angular.module('myhonorsEvents').factory('RSVPService', function(FirebaseIO, FirebaseCollection, UserService) {
	
	return {
		create: function(eventId, options, callback) {		
			this.update(eventId, options, callback);
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
		update: function(eventId, options, callback) {
			angular.forEach(options, function(value, key) {
				FirebaseIO.child('events/' + eventId + '/rsvps/' + UserService.profile.id + '/' + key).set(value);
				UserService.ref.child('rsvps/' + eventId + '/' + key).set(value);
			});
			
			/*
			 * Below we check whether the user's rsvp has a 'time' child. Since this function is called both when the user rsvp's for 
			 * the first time and when the user's updates the guest count, we need to do the following check.
			 * If the user is rsvp'ing for the first time, we add the rsvp time.
			 * If the user is updating the number of guests, there is no need to override the time of rsvp.
			 */
			UserService.ref.child('rsvps/' + eventId + '/time').once('value', function(snapshot) {
				if (snapshot.val() == null) {
					//Save the time when the student RSVP'ed and store them in the event's attendance child and in the user's profile
					var rsvpTime = Date.now();
					FirebaseIO.child('events/' + eventId + '/rsvps/' + UserService.profile.id + '/time').set(rsvpTime);
					UserService.ref.child('rsvps/' + eventId + '/time').set(rsvpTime);
				}
			});
			
			callback();
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
