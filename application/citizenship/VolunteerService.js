'use strict'

angular.module('myhonorsCitizenship').factory('VolunteerService', function($q, $http, FirebaseIO, FirebaseCollection, UserService) {
	return {
		// crates a new volunteer hour submission
		create: function(data) {
			data['status'] = "pending";
			var volunteerRef = FirebaseIO.child('volunteerHours').push(data);
			UserService.ref.child('volunteerHours/' + volunteerRef.name()).set(true);
					
			data['userName'] = UserService.profile.fname + " " + 	UserService.profile.lname;	
			data['volunteerHoursID'] = volunteerRef.name();
			
		    
			var serializedData = $.param(data); //Serializes the data so we can pass it to the POST request
			//List of paramaters passed: agency=agency&activity=activity&startDate=startdate&endDate=enddate&hours=hours&referenceName=referencename&referenceTitle=referencetitle&referenceEmail=referenceemail&referencePhone=referencephone&userId=3763428
			
			$http.post('application/citizenship/confirmation.php', serializedData, {headers: {'Content-Type' : 'application/x-www-form-urlencoded'}}).success( function(result) {
				if (result.success === true) {
					alert("A confirmation email has been sent to the specified individual.");
				}
				else {
					alert(result.error);
				}
			});
			
		},
		
		list: function() {
			var index = new FirebaseIndex(FirebaseIO.child('user_profiles/' + UserService.profile.id + '/volunteerHours'), FirebaseIO.child('volunteerHours'));
			return FirebaseCollection(index);
		}
	}
});
