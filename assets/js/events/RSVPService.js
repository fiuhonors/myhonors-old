'use strict'

angular.module('myhonorsEvents').factory('RSVPService', function(FirebaseIO, FirebaseCollection, UserService) {
	return {
		create: function(eid) {
			// add attendance info to event (so we can pull it from event page)
			// and add it to the user's profile (so we can see it on the user's page)
			FirebaseIO.child('/events/' + eid + '/rsvps/' + UserService.profile.id).set(true);
			UserService.ref.child('rsvps/' + eid).set(true);
		},
		read: function(rsvpId) {
			// todo: this can be implemented when we add the "+ guests", phone #, and cover charge features
		},
		list: function(eventId) {
			var rsvpsRef = FirebaseIO.child('events/' + eventId + '/rsvps');
			return FirebaseCollection(rsvpsRef, {metaFunction: function(doAdd, data) {
				FirebaseIO.child('user_profiles/' + data.name()).once('value', function(userSnapshot) {
					doAdd(userSnapshot);
				});
			}});
		},
		update: function(rsvpId) {
			// todo: this can be implemented when we add the "+ guests", phone #, and cover charge features
		},
		delete: function(eid) {
			// remove attendance info from event and user's profile
			FirebaseIO.child('/events/' + eid + '/rsvps/' + UserService.profile.id).remove();
			UserService.ref.child('rsvps/' + eid).remove();
		},
		hasRSVP: function(eid) {
			return UserService.profile && UserService.profile.rsvps && UserService.profile.rsvps[eid] === true;
		}
	}
});