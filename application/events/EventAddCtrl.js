'use strict';

angular.module('myhonorsEvents').controller('EventAddCtrl', ['$scope', '$location', 'EventService', 'ClubService', function($scope, $location, EventService, ClubService) {
    $scope.eventTypes = EventService.getTypes();
    $scope.clubs = ClubService.list();

    /**
     * @param   string    time in the format of 'hh:mm A'
     * @returns int       the hour of string as an integer from 0 to 23
     */
    function getHour(string) {
        var hour = parseInt(string.substring(0, 2));
        return ((string.substring(6, 8) === 'PM') && hour !== 12) ? hour + 12 : hour;
    }

    /**
     * @param   string    time in the format of 'hh:mm A'
     * @returns int       the minute of string as an integer
     */
    function getMinute(string) {
        return parseInt(string.substring(3, 5));
    }

    // auto updates the date and time
    $scope.updateEnds = function(timeOrDate) {
        if (timeOrDate === 'time')
        {
            $scope.newItem.date.ends.time = moment($scope.newItem.date.starts.time, 'hh:mm A').add('hours', 1).format('hh:mm A');
        }
        else if (timeOrDate === 'date')
        {
            var startHour = getHour($scope.newItem.date.starts.time);
            var startMin = getMinute($scope.newItem.date.starts.time);
            var newDate = moment($scope.newItem.date.starts.date, 'MM-DD-YYYY').add('hours', startHour + 1).add('minutes', startMin);

            $scope.newItem.date.ends.date = newDate.format('MM/DD/YYYY');
        }
    };

    $scope.doAdd = function(theForm) {
        if (theForm.$invalid) { return; }

        var newItem = angular.copy($scope.newItem);
        newItem.types[0] = newItem.types[0] || "General Event"; 

        /* Check that if the user chose 'Club Meeting' type, he also chose a club */
        if (newItem.types[0] === "Club Meeting" && !newItem.club) {
            alert("This event is a Club Meeting but has no club associated to it. Please choose a club.");
            return;
        }

        newItem.location = {
            name: $scope.newItem.location.name, 
            lat: $scope.newItem.location.lat,
            lng: $scope.newItem.location.lng
        };

        // Ensure that the event type is not empty in case it was not added by the staff

        var startHour = getHour($scope.newItem.date.starts.time);
        var startMin = getMinute($scope.newItem.date.starts.time);
        newItem.date.starts = moment($scope.newItem.date.starts.date, "MM-DD-YYYY").hour(startHour).minute(startMin).valueOf();

        var endHour = getHour($scope.newItem.date.ends.time);
        var endMin = getMinute($scope.newItem.date.ends.time);
        newItem.date.ends = moment($scope.newItem.date.ends.date, "MM-DD-YYYY").hour(endHour).minute(endMin).valueOf();

        var newEventId = EventService.create(newItem);

        $location.path('events/' + newEventId);
    };

    $scope.resetForm = function() {
        var now = moment();
        now.minute(now.minute() + (15 - (now.minute() % 15))).second(0).millisecond(0);

        $scope.newItem = {
            name: '',
            thumbURL: '',
            desc: '',
            date: {
                starts: {
                    date: now.format('MM/DD/YYYY'),
                    time: now.format('hh:mm A')
                },
                ends: {
                    date: now.add('hours', 1).format('MM/DD/YYYY'),
                    time: now.format('hh:mm A')
                }
            },
            types: [],
            location: {
                name: '',
                lat: 25.756237234313733,
                lng: -80.37467569112778,
                // the following properties are just for the visual map, they don't get saved to the database
                draggable: true,
                focus: true,
                zoom: 16
            },
            options: {
                maxRSVPs: '',
                waitingList: false,
                requirePhone: false,
                disableRSVP: false
            }
        };
    };

    $scope.resetForm();
    $scope.defaults = {
        maxZoom: 20
    }
}]);
