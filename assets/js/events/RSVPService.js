'use strict'

angular.module('myhonorsEvents').factory('RSVPService', function(FirebaseIO, UserService) {
	return {
		hasRSVP: function(eid) {
			return UserService.profile && UserService.profile.rsvps && UserService.profile.rsvps[eid] === true;
		},
		addRSVP: function(eid) {
			// add attendance info to event (so we can pull it from event page)
			// and add it to the user's profile (so we can see it on the user's page)
			FirebaseIO.child('/events/' + eid + '/rsvps/' + UserService.profile.id).set(true);
			UserService.ref.child('rsvps/' + eid).set(true);
		},
		removeRSVP: function(eid) {
			// remove attendance info from event and user's profile
			FirebaseIO.child('/events/' + eid + '/rsvps/' + UserService.profile.id).remove();
			UserService.ref.child('rsvps/' + eid).remove();
		}
	}
});