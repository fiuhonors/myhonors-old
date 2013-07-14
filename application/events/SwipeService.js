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
		create: function(eventId, userId) {
			if (!angular.isString(eventId) || !angular.isString(userId)) {
				throw new Error('Invalid input when creating swipe');
				return;
			}

			var now = Date.now();
			var userRef = FirebaseIO.child('events/' + eventId + '/attendance/' + userId);

			userRef.push(now, function() {
				// we can't set the priority of an empty location, so push the data first and
				// then set the priority in this onComplete callback
				userRef.setPriority(now);
			});
		},
		list: function(eventId) {
			var swipeRef = FirebaseIO.child('events/' + eventId + '/attendance');
			return FirebaseCollection(swipeRef, {metaFunction: function(doAdd, swipeSnapshot) {
				FirebaseIO.child('user_profiles/' + swipeSnapshot.name()).once('value', function(userSnapshot) {
					var extraData = {
						fname: userSnapshot.child('fname').val(),
						greeting: getRandomGreeting(userSnapshot.child('fname').val())
					};
					doAdd(swipeSnapshot, extraData);
				});
			}});
		}
	};
});