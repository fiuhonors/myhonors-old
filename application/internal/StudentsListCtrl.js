'use strict'

angular.module('myhonorsInternal').controller('StudentsListCtrl', function($scope, $timeout, EventService, FirebaseIO, FirebaseCollection, CitizenshipService) {
    var usersRef = FirebaseIO.child('user_profiles');
    $scope.limit = 15;
    //usersRef = usersRef.startAt().limit($scope.limit);

    var citizenshipTypes = CitizenshipService.getTypes();
    citizenshipTypes.then(function(promise) {
        var enabledEventTypes = promise.enabledTypes;


        $scope.students = new FirebaseCollection(usersRef, {metaFunction: function(doAdd, snapshot) {
            var attendance = snapshot.child('attendance').val();
            var eventsAttendance = {};
            var clubsAttendance = {};

            angular.forEach(enabledEventTypes, function(key, eventType) {
                eventsAttendance[eventType] = 0;
            });
    
            if (attendance !== null && attendance.length !== 0) {
                angular.forEach(attendance, function(value,key) {
                    var eventType = value.eventType[0];

                    if (eventType == "Club Meeting") {
                        var clubName = value.clubName;
                        if (clubsAttendance[clubName] == null) 
                            clubsAttendance[clubName] = 0;
                        clubsAttendance[clubName]++;
                    }
                    
                    if (eventsAttendance[eventType] != null) {  /* this is to skip attendances of events whose type is disabled */             
                        eventsAttendance[eventType]++;
                    }
                });
            }

            /* calculate accepted volunteer hours */
            var volunteerHours = snapshot.child("volunteerHours").val();
            var totalVolunteerHours = 0;
            angular.forEach(volunteerHours, function(value, key) {
                if (value.status != null && value.status == "accepted" && value.hours) {
                    totalVolunteerHours += value.hours;
                }

            });

            /* calculate total points */
            var totalPoints = 0;
            angular.forEach(eventsAttendance, function(attendances, eventType) {
                if (eventType != "Club Meeting") {
                    var maxPoints = enabledEventTypes[eventType].maxPoints;
                    var pointsEventType = enabledEventTypes[eventType].points * attendances;
                    if (maxPoints != 0 && pointsEventType > maxPoints)
                        pointsEventType = maxPoints;
                    totalPoints += pointsEventType;
                }
            });

            /* calculate total club points */
            var totalClubPoints = 0;
            angular.forEach(clubsAttendance, function(attendances, clubName) {
                var maxPoints = enabledEventTypes["Club Meeting"].maxPoints;
                var totalPointsForClub = enabledEventTypes["Club Meeting"].points * attendances;
                if (maxPoints != 0 && totalPointsForClub > maxPoints)
                    totalPointsForClub = maxPoints;
                totalClubPoints += totalPointsForClub;
            });

            
            totalPoints += totalClubPoints;

            var extraData = {
                id: snapshot.name(),
                name: snapshot.child('fname').val() + " " + snapshot.child('lname').val(),
                email: snapshot.child('email').val(),
                leadershipLecturesNum: eventsAttendance["Leadership Lecture"],
                colloquiaNum: eventsAttendance["Colloquium"],
                honorsHoursNum: eventsAttendance["Honors Hour"],
                heartsEventsNum: eventsAttendance["HEARTS"],
                sponsoredEventsNum: eventsAttendance["Sponsored Event"],
                clubsTotal: eventsAttendance["Club Meeting"],
                volunteerHoursNum: totalVolunteerHours,
                totalPoints: totalPoints
            };


            doAdd(snapshot, extraData);
        }});

    });


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
