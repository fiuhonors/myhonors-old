'use strict'

angular.module('myhonorsEvents').factory('WaitingListService', function($http, FirebaseIO, FirebaseCollection, RSVPService, UserService) {
	
	return {
		create: function(eventId, options, callback) {
			this.update(eventId, options, callback);
		},
		read: function(eventId) {
			return this.isInWaitingList(eventId) ? UserService.profile.waitingList[eventId] : null;
		},

		/**
		 * Returns a FirebaseCollection of students in the waiting list
		 *
		 * @param eventId String	The event ID
		 * @param options Object	Can have limit, startAt, and endAt properties
		 */
		list: function(eventId, options) {
			var waitingListRef = FirebaseIO.child('events/' + eventId + '/waitingList');

			var options = options || {};
			if (options.startAt) waitingListRef = rsvpsRef.startAt(options.startAt);
			if (options.endAt)   waitingListRef = rsvpsRef.endAt(options.endAt);
			if (options.limit)   waitingListRef = rsvpsRef.limit(options.limit);

			return FirebaseCollection(waitingListRef, {metaFunction: function(doAdd, data) {
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
			//Save the time when the student was added to the waiting list and store them in the event's waitingList child and in the user's profile
			var time = Date.now();
			FirebaseIO.child('events/' + eventId + '/waitingList/' + UserService.profile.id + '/time').set(time);
			UserService.ref.child('waitingList/' + eventId + '/time').set(time);
			
			FirebaseIO.child('events/' + eventId + '/waitingList/' + UserService.profile.id + '/phone').set(options.phone);
			UserService.ref.child('waitingList/' + eventId + '/phone').set(options.phone);
			
			callback();
		},

		delete: function(eventId, userId) {
			// Remove waiting list info from event and user's profile
			FirebaseIO.child('/events/' + eventId + '/waitingList/' + userId).remove();
			FirebaseIO.child('/user_profiles/' + userId + '/waitingList/' + eventId).remove();
		},
		isInWaitingList: function(eventId) {
			return UserService.profile && UserService.profile.waitingList && UserService.profile.waitingList.hasOwnProperty(eventId);
		},
		
		/**
		 * This function is executed when a student who RSVP'ed deletes his RSVP.
		 * Depending on the amount of guests that student had, we then transfer that same amount of students from the waiting list to
		 * the RSVPs of the event.
		 * 
		 * @param eventId The event's id
		 * @param opnenings The number of new openings for users in the waiting list to be added
		 */
		transferFromWaitingListToRSVP: function(eventId, openings) {
			var info = {};
			info['openings'] = openings;
			info['eventId'] = eventId;
			info['userId'] = UserService.profile.id;
			
			$http.post('application/events/update-rsvps-from-waitinglist.php', info, {headers: {'Content-Type': 'application/json'}});
		}
	}
});

angular.module("myhonorsEvents").filter('orderWaitingList', function() {
        console.log('hit me harder 2');
        return function(items, field, reverse) {
            items.sort(function (a, b) {
                if(a[field] > b[field]){
                    return 1;
                }else if(a[field] < b[field]){
                    return -1;
                }
                console.log(field);
            });
            if(reverse){
                items.reverse();
            }
            return items;
        };
});