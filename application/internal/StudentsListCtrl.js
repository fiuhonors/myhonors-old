'use strict'

angular.module('myhonorsInternal').controller('StudentsListCtrl', function($scope, $timeout, EventService, FirebaseIO, FirebaseCollection) {
	var usersRef = FirebaseIO.child('user_profiles');
	$scope.limit = 15;
	//usersRef = usersRef.startAt().limit($scope.limit);
	
	$scope.students = new FirebaseCollection(usersRef, {metaFunction: function(doAdd, snapshot) {
				var attendance = snapshot.child('attendance').val();
				var honorsHours = 0;
				var colloquia = 0;
				var generalEvents = 0;
				var heartsEvents = 0;

				if (attendance !== null && attendance.length !== 0) {
				angular.forEach(attendance, function(value,key) {
					var eventType = value.eventType[0];
					
					switch (eventType) {
						case "Honors Hour":
							honorsHours++;
							break;
						case "Colloquium":
							colloquia++;
							break;
						case "General Event":
							generalEvents++;
							break;
						case "HEARTS":
							heartsEvents++;
							break;
						default:
							break;
					}
					
					
				});
			}
				
				var volunteerHours = snapshot.child("volunteerHours").val();
				var totalVolunteerHours = 0;
				angular.forEach(volunteerHours, function(value, key) {
					if (value.status != null && value.status == "accepted" && value.hours) {
						totalVolunteerHours += value.hours;
					}
					
				});
				
				var extraData = {
					id: snapshot.name(),
					name: snapshot.child('fname').val() + " " + snapshot.child('lname').val(),
					email: snapshot.child('email').val(),
					honorsHoursNum: honorsHours,
					colloquiaNum: colloquia,
					generalEventsNum: generalEvents,
					heartsEventsNum: heartsEvents,
					volunteerHoursNum: totalVolunteerHours,
					totalPoints: honorsHours*2 + colloquia*3 + heartsEvents*1
					
				};
				

				doAdd(snapshot, extraData);
	}});
	
	
	$scope.exportExcel = function() {
		//Point the window's location to rsvps-export-list.php with the necessary event variables and the export type "Excel"
		window.location = "application/internal/students-list-export.php?exportType=Excel";
	};
	
	$scope.exportCSV = function() {
		//Point the window's location to rsvps-export-list.php with the necessary event variables and the export type "Excel"
		window.location = "application/internal/students-list-export.php?exportType=CSV";
	};
	
	//Used for sorting the table by column
	$scope.columnOrder = "";
	$scope.reverseOrder = false;

});
