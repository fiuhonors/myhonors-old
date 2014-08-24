'use strict';

angular.module('myhonorsEvents').controller('CitizenshipCtrl', ['$scope', 'FirebaseIO', 'UserService', 'VolunteerService', 'CitizenshipService', function($scope, FirebaseIO, UserService, VolunteerService, CitizenshipService) {
    
	$scope.submissions = VolunteerService.list(UserService.profile.pid);
	
	$scope.submit = function(volunteerHoursForm) {
		if (volunteerHoursForm.$valid) {
			var data = angular.extend($scope.newData, {userId: UserService.profile.id});
			VolunteerService.create(data);
			$scope.newData = {};
		}
	};

	
	$scope.hoursCompleted = 0;	
	$scope.addVolunteerHours = function (submission) {
		if (submission.status == "accepted" && submission.hours) {
			$scope.hoursCompleted += submission.hours;
		}
	};
	
	$scope.removeVolunteerHours = function(volunteerHour) {	
		// We ask the user for a double confirmation before deleting the volunteer hours
		var confirmation1 = confirm("Are you sure you wish to delete this volunteer hour?")	
		var confirmation2 = false;	
		
		if (confirmation1) 
			confirmation2 = confirm("All the information of this volunteer hour will be deleted. Are you sure you wish to proceed?");
			
			
		if (confirmation1 && confirmation2) {
			VolunteerService.remove(volunteerHour, UserService.profile.id);	
		
			$scope.hoursCompleted = 0;	//Reset the total volunteer hours counter
			$scope.submissions = VolunteerService.list(UserService.profile.pid);	//Reload the volunteer hours list
		}
	};

    
    $scope.citizenshipTypes = CitizenshipService.getTypes();
    
    $scope.citizenshipUserPoints = 0;
    $scope.citizenshipUserEventsCount = 0;
    CitizenshipService.getUser().then(function (promise) {
        $scope.citizenshipUserEvents = promise.events;
        $scope.citizenshipUserEventsCount = Object.keys(promise.events).length;
        $scope.citizenshipUserPoints = promise.points;
        $scope.citizenshipRoomswipe= promise.roomswipe;
        $scope.citizenshipRoomswipeCount = Object.keys(promise.roomswipe).length;
    });
    
    
    
}]);
