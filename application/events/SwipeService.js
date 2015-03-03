'use strict'

angular.module('myhonorsEvents').factory('SwipeService', function($q, FirebaseIO, FirebaseCollection, UserService) {
	var greetings = [
		'{0} has entered the building',
		'{0} has arrived',
		'{0} swiped in',
		'Ladies and gentlemen, clap your hands for {0}!',
		'Thanks for coming, {0}',
		'What\'s up {0}! Good to see you'
	];

	if (!String.prototype.format) {
		String.prototype.format = function() {
			var args = arguments;
			return this.replace(/{(\d+)}/g, function(match, number) { 
				return typeof args[number] != 'undefined' ? args[number] : match;
			});
		};
	}

	var getRandomGreeting = function(name) {
		// selects a random greeting, then emulates a printf function to format the
		// greeting with the proper name
		return greetings[Math.floor(Math.random() * greetings.length)].format(name);
	};

	return {
		create: function(eventId, userId, eventInfo, callback) {
			if (!angular.isString(eventId) || !angular.isString(userId)) {
				throw new Error('Invalid input when creating swipe');
				return;
			}
            if (!eventInfo.hasOwnProperty("eventType")) {
				throw new Error('The type of the event must be given');
				return;
            }
            if (!eventInfo.hasOwnProperty("clubName")) {
                throw new Error('The name of the club this event belongs to must be given (or null if the event has no club)');
				return;
            }


			var now = Date.now();
			var userRef = FirebaseIO.child('events/' + eventId + '/attendance/' + userId);

			var swipeRef = userRef.push(now, function() {
				// we can't set the priority of an empty location, so push the data first and
				// then set the priority in this onComplete callback
				userRef.setPriority(now);
			});

            var eventType = eventInfo.eventType;
            var clubName = eventInfo.clubName;

			//Push the event type and swipe time to the user's profile record
			FirebaseIO.child('user_profiles/' + userId + '/attendance/' + eventId + "/eventType/0").set(eventType);	
			FirebaseIO.child('user_profiles/' + userId + '/attendance/' + eventId + '/' + swipeRef.name()).set(now);
			
            if (eventInfo.clubName)
			    FirebaseIO.child('user_profiles/' + userId + '/attendance/' + eventId + "/clubName").set(clubName);	

			if (angular.isFunction(callback)) callback(swipeRef);
		},

		/**
		 * Returns a FirebaseCollection of an event's attendance record
		 *
		 * @param eventId String    The event ID
		 * @param options Object    Can have limit, startAt, and endAt properties
		 */
		listByEvent: function(eventId, options) {
			var eventAttendanceRef = FirebaseIO.child('events/' + eventId + '/attendance');
			

			var options = options || {};
			if (options.startAt) eventAttendanceRef = eventAttendanceRef.startAt(options.startAt);
			if (options.endAt)   eventAttendanceRef = eventAttendanceRef.endAt(options.endAt);
			if (options.limit)   eventAttendanceRef = eventAttendanceRef.limit(options.limit);

			return FirebaseCollection(eventAttendanceRef, {metaFunction: function(doAdd, swipeSnapshot) {
				FirebaseIO.child('user_profiles/' + swipeSnapshot.name()).once('value', function(userSnapshot) {
					var extraData = {
						fname: userSnapshot.child('fname').val(),
						lname: userSnapshot.child('lname').val(),
						name: userSnapshot.child('fname').val() + " " + userSnapshot.child('lname').val(),
						pid: userSnapshot.child('pid').val() || userSnapshot.name(),
						email: userSnapshot.child('email').val(),
						greeting: getRandomGreeting(userSnapshot.child('fname').val())
					};
					doAdd(swipeSnapshot, extraData);
				});
			}});
		},

		/**
		 * Returns a FirebaseCollection of a user's attendance record
		 *
		 * @param userId String     The user ID
		 * @param options Object    Can have limit, startAt, and endAt properties
		 */
		listByUser: function(userId, options) {
			var userAttendanceRef = FirebaseIO.child('user_profiles/' + userId + '/attendance');

			var options = options || {};
			if (options.startAt) userAttendanceRef = userAttendanceRef.startAt(options.startAt);
			if (options.endAt)   userAttendanceRef = userAttendanceRef.endAt(options.endAt);
			if (options.limit)   userAttendanceRef = userAttendanceRef.limit(options.limit);

			return FirebaseCollection(userAttendanceRef, {metaFunction: function(doAdd, swipeSnapshot) {
				FirebaseIO.child('events/' + swipeSnapshot.name()).once('value', function(eventSnapshot) {
					doAdd(eventSnapshot);
				});
			}});
		},

		/**
		 * Check to see if the currently logged-in user has attended an event
		 * 
		 * @param eventId String    The event ID
		 * @returns boolean         Whether the user has attended the specified event
		 */
		hasAttended: function(eventId) {
			return UserService.profile && UserService.profile.attendance && UserService.profile.attendance[eventId];
		},
		
		removeAttendance: function(eventId, userId) {
			FirebaseIO.child('events/' + eventId + '/attendance/' + userId).remove();
			FirebaseIO.child('user_profiles/' + userId + '/attendance/' + eventId).remove();
			
		}
	};
});
