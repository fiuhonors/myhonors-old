'use strict'

angular.module('myhonorsCitizenship').factory('VolunteerService', function($q, $http, FirebaseIO, FirebaseCollection, UserService) {
	return {
		// crates a new volunteer hour submission
		create: function(data) {
			data['status'] = "pending";
			var volunteerRef = FirebaseIO.child('volunteerHours').push(data);
			
			// Include the status and the hours of the volunteer hours submitted in the user's profile for quick access
			UserService.ref.child('volunteerHours/' + volunteerRef.name() + '/status').set("pending");
			UserService.ref.child('volunteerHours/' + volunteerRef.name() + '/hours').set(data.hours);
			
			data['userID'] = UserService.profile.pid;		
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
		
		list: function(pid) {
			var index = new FirebaseIndex(FirebaseIO.child('user_profiles/' + pid + '/volunteerHours'), FirebaseIO.child('volunteerHours'));
			return FirebaseCollection(index);
		},
		
		remove: function(volunteerHour, pid) {
			volunteerHour.$ref.remove();	//Delete the volunteer hours child from the volunteerHours collection
			FirebaseIO.child('user_profiles/' + pid + '/volunteerHours/' + volunteerHour.$id).remove();	//Delete the volunteer hours from the user_profiles/volunteerHours child
		}
	
	}
});
