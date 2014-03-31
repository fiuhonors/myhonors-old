'use strict'

angular.module('myhonorsEvents').factory('RFIDTagService', function($q, FirebaseIO, FirebaseCollection, UserService) {

	return {
		/**
		 * Registers an RFID tag to the specified user
		 */
		register: function(rfid, userId) {
			FirebaseIO.child('rfid/' + rfid).set(userId);
			FirebaseIO.child('user_profiles/' + userId + '/rfid/').set(rfid);
		},
		
		/**
		 * Gets the Panther ID registered to that tag
		 */
		getPID: function(rfid, callback) {
			if (!angular.isString(rfid) || rfid.length === 0) {
				callback(false);
				return;
			}

			FirebaseIO.child('rfid/' + rfid).once('value', function(snapshot) {
				if (snapshot.val() === null) {
					callback(null);
				} else {
					callback(snapshot.val());
				}
			});

		}
		
	};
});
