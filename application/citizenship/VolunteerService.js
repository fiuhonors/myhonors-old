'use strict'

angular.module('myhonorsCitizenship').factory('VolunteerService', function($q, FirebaseIO, FirebaseCollection, UserService) {
	return {
		// crates a new volunteer hour submission
		create: function(data) {
			var volunteerRef = FirebaseIO.child('volunteerHours').push(data);
			UserService.ref.child('volunteerHours/' + volunteerRef.name()).set(true);
		},
		list: function() {
			var index = new FirebaseIndex(FirebaseIO.child('user_profiles/' + UserService.profile.id + '/volunteerHours'), FirebaseIO.child('volunteerHours'));
			return FirebaseCollection(index);
		}
	}
});