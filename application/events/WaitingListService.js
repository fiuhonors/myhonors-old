'use strict'

angular.module('myhonorsEvents').factory('WaitingListService', function($http, FirebaseIO, FirebaseCollection, RSVPService, UserService) {
	
	return {
		create: function(eventId) {
			this.update(eventId);
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
		update: function(eventId) {
			//Save the time when the student was added to the waiting list and store them in the event's waitingList child and in the user's profile
			var time = Date.now();
			FirebaseIO.child('events/' + eventId + '/waitingList/' + UserService.profile.id + '/time').set(time);
			UserService.ref.child('waitingList/' + eventId + '/time').set(time);
		},

		delete: function(eid) {
			// Remove waiting list info from event and user's profile
			FirebaseIO.child('/events/' + eid + '/waitingList/' + UserService.profile.id).remove();
			UserService.ref.child('waitingList/' + eid).remove();
		},
		isInWaitingList: function(eid) {
			return UserService.profile && UserService.profile.waitingList && UserService.profile.waitingList[eid];
		},
		
		/**
		 * This function is executed when a student who RSVP'ed deletes his RSVP.
		 * Depending on the amount of guests that student had, we then transfer that same amount of students from the waiting list to
		 * the RSVPs of the event.
		 * 
		 */
		transferFromWaitingListToRSVP: function(eventId, rsvpsNum, userId) {
			var waitingList = {};
			FirebaseIO.child('events/' + eventId + '/waitingList/').once('value', function(snapshot) {				
				angular.forEach(snapshot.val(), function(value,key) {	
					//waitingList.push([key,value.time]); //Key is the panther ID, value.time is the time when the student joined the waiting list
					waitingList[key] = value.time;
				});
			});
			
			waitingList['rsvpsNum'] = rsvpsNum;
			waitingList['eventId'] = eventId;
			waitingList['userId'] = UserService.profile.id;
			
			//waitingList.sort(function(a,b) { return a[1] - b[1] });
			//console.log(waitingList);
			
			
			//console.log(UserService.profile);
			$http.post('application/events/update-rsvps-from-waitinglist.php', waitingList, {headers: {'Content-Type': 'application/json'}});
			/*
			for (var x = 1; x <= rsvpsNum; x++) {
				if (x < waitingList.length) {
					var pantherID = waitingList[x][0];
					FirebaseIO.child('user_profiles/' + pantherID + '/waitingList/' + eventId).remove();
					FirebaseIO.child('events/' + eventId + '/waitingList/' + pantherID).remove();
					
					var options = {guests: 0, time: waitingList[x][1]};
					RSVPService.create(eventId, options, pantherID, function(){});
				}
						
			}*/
		}
	}
});
