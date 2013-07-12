'use strict'

angular.module('myhonorsEvents').factory('SwipeService', function($q, FirebaseIO, FirebaseCollection, UserService) {
	return {
		create: function(eventId, userId) {
			if (!angular.isString(eventId) || !angular.isString(userId)) {
				throw new Error('Invalid input when creating swipe');
				return;
			}

			FirebaseIO.child('events/' + eventId + '/attendance/' + userId).push(Date.now());
		},
		list: function(eventId) {
			var swipeRef = FirebaseIO.child('events/' + eventId + '/attendance');
			return FirebaseCollection(swipeRef, {metaFunction: function(doAdd, swipeSnapshot) {
				FirebaseIO.child('user_profiles/' + swipeSnapshot.name()).once('value', function(userSnapshot) {
					var extraData = {
						fname: userSnapshot.child('fname').val()
					};
					doAdd(swipeSnapshot, extraData);
				});
			}});
		}
	};
});