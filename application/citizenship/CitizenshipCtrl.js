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
	
	$scope.removeVolunteerHours = function (volunteerHour) {
		// We ask the user for a double confirmation before deleting the volunteer hours
		var confirmation1 = confirm("Are you sure you wish to delete this volunteer hour?"),
            confirmation2 = false;
		
		if (confirmation1) {
			confirmation2 = confirm("All the information of this volunteer hour will be deleted. Are you sure you wish to proceed?");
        }
			
			
		if (confirmation1 && confirmation2) {
			VolunteerService.remove(volunteerHour, UserService.profile.id);
		
			$scope.hoursCompleted = 0;	//Reset the total volunteer hours counter
			$scope.submissions = VolunteerService.list(UserService.profile.pid);	//Reload the volunteer hours list
		}
	};
    
    var citizenshipTypes = CitizenshipService.getTypes();
    $scope.citizenship = {
        types: citizenshipTypes,
        points: 0,
        events: {},
        eventsCount: 0,
        roomswipe: {},
        roomswipeCount: 0
    };
    CitizenshipService.getUser().then(function (promise) {
        $scope.citizenship = {
            types: citizenshipTypes,
            points: promise.points,
            events: promise.events,
            eventsCount: Object.keys(promise.events).length,
            roomswipe: promise.roomswipe,
            roomswipeCount: Object.keys(promise.roomswipe).length
        };
    });
    
    
    
}]);
