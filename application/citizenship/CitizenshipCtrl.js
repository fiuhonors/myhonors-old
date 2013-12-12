'use strict';

angular.module('myhonorsEvents').controller('CitizenshipCtrl', ['$scope', '$timeout', 'FirebaseIO', 'SwipeService', 'UserService', 'VolunteerService', function($scope, $timeout, FirebaseIO, SwipeService, UserService, VolunteerService) {
	$scope.submissions = VolunteerService.list();
	$scope.submit = function(volunteerHoursForm) {
		if (volunteerHoursForm.$valid) {
			var data = angular.extend($scope.newData, {userId: UserService.profile.id});
			VolunteerService.create(data);
			$scope.newData = {};
		}
	};
	
	
	$scope.honorsHours = [];
	$scope.colloquiums = [];
	$scope.excellenceLectures = [];

	
	$scope.hoursCompleted = 0;	
	$scope.addVolunteerHours = function (submission) {
		if (submission.status == "accepted" && submission.hours) {
			$scope.hoursCompleted += submission.hours;
		}
	}
	
	$scope.removeVolunteerHours = function(volunteerHour) {	
		
		// We ask the user for a double confirmation before deleting the volunteer hours
		var confirmation1 = confirm("Are you sure you wish to delete this volunteer hour?")	
		var confirmation2 = false;	
		
		if (confirmation1) 
			confirmation2 = confirm("All the information of this volunteer hour will be deleted. Are you sure you wish to proceed?");
			
			
		if (confirmation1 && confirmation2) {
			VolunteerService.remove(volunteerHour);	
		
			$scope.hoursCompleted = 0;	//Reset the total volunteer hours counter
			$scope.submissions = VolunteerService.list();	//Reload the volunteer hours list
		}
		
	}

	UserService.ref.child('attendance').on('value', function(snapshot) {

		angular.forEach(snapshot.val(), function(value, key)
		{
			// grab the type of the event (key is the eventID)
			FirebaseIO.child('events/' + key).once('value', function(snapshot) {
				$timeout(function() {
					var eventType = snapshot.val().types.toString();
					var eventName = snapshot.val().name;
					
					switch (eventType) {
						case "Honors Hour":
							$scope.honorsHours.push(eventName);
							break;
						case "Colloquium":
							$scope.colloquiums.push(eventName);
							break;
						case "Excellence Lecture":
							$scope.excellenceLectures.push(eventName);
							break;
						default:
							break;
					}
				});
			});
		});
	});
}]);
