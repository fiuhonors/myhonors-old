(function (window) {
    'use strict';
    var angular = window.angular;

    
    angular.module('myhonorsCitizenship').factory('CitizenshipService', ['FirebaseIO', 'UserService', 'FirebaseCollection', '$q', 'EventService', function (FirebaseIO, UserService, FirebaseCollection, $q, EventService) {
        
        var types = {},
            citizenship = {};
        
        var citizenshipFactory = {
            
            getTypes: function () {
                
                var defer = $q.defer();
                
                if (types.hasOwnProperty('types') && types.hasOwnProperty('enabledTypes') && types.hasOwnProperty('disabledTypes')) {
                    defer.resolve(types);
                    return defer.promise;
                }
                
                FirebaseIO.child('system_settings/eventTypes').once('value', function (snapshot) {
                    var citizenshipTypes = {},
                        citizenshipTypesEnabled = {},
                        citizenshipTypesDisabled = {};
                    angular.forEach(snapshot.val(), function (value, key) {
                        
                        if (value.citizenship == undefined) {
                            return;
                        }
                        
                        var typeIsEnabled = value.citizenship.enabled == undefined ? true : value.citizenship.enabled,
                            typePoints = value.citizenship.points || 0,
                            typeMaxPoints = value.citizenship.maxPoints || 0;

                        citizenshipTypes[key] = {
                            enabled: typeIsEnabled,
                            points: typePoints,
                            maxPoints: typeMaxPoints
                        };
                        if (typeIsEnabled) {
                            citizenshipTypesEnabled[key] = {
                                points: typePoints,
                                maxPoints: typeMaxPoints
                            };
                        } else {
                            citizenshipTypesDisabled[key] = {
                                points: typePoints,
                                maxPoints: typeMaxPoints
                            };
                        }
                    });
                    
                    types = {
                        types: citizenshipTypes,
                        enabledTypes: citizenshipTypesEnabled,
                        disabledTypes: citizenshipTypesDisabled
                    };
                    
                    defer.resolve(types);
                    
                });
                
                return defer.promise;
                
            },
            
            
            
            getUser: function (pantherId) {
                
                if (pantherId == undefined) {
                    pantherId = UserService.profile.id;
                }
                
                var defer = $q.defer();
                
                if (citizenship.hasOwnProperty('points') && citizenship.hasOwnProperty('events')) {
                    defer.resolve(citizenship);
                    return defer.promise;
                }
                
                citizenshipFactory.getTypes().then(function (typesPromise) {
                    
                    FirebaseIO.child('user_profiles/' + pantherId + '/attendance').once('value', function (snapshot) {
                        var individualEventsDefer = [],
                            userEvents = {},
                            eventTypes = typesPromise.enabledTypes,
                            roomswipeEvents = {},
                            roomswipeTypes = {'studyroomswipe': 'Study Room Swipe', 'bbclabswipe': 'BBC Lab Swipe'},
                            citizenshipPoints = 0,
                            roomswipePoints = 0;
                        
                        angular.forEach(snapshot.val(), function (eventDetails, eventId) {
                            var eventType = eventDetails.eventType[0],
                                individualEventDefer = $q.defer();
                            if (!eventTypes[eventType]) {
                                return;
                            }
                            if (userEvents[eventType] === undefined) {
                                userEvents[eventType] = [];
                            }
                            FirebaseIO.child('events/' + eventId + "/name").once('value', function (snapshot) {
                                userEvents[eventType].push({
                                    'eventName': snapshot.val(),
                                    'eventId': eventId
                                });
                                individualEventDefer.resolve();
                            });
                            individualEventsDefer.push(individualEventDefer.promise);
                        });
                        angular.forEach(roomswipeTypes, function (swipeDetails, swipeType) {
                            var individualEventDefer = $q.defer();
                            FirebaseIO.child('events/' + swipeType + '/attendance/' + pantherId).once('value', function (snapshot) {
                                roomswipeEvents[swipeDetails] = snapshot.val() || {};
                                individualEventDefer.resolve();
                            });
                            individualEventsDefer.push(individualEventDefer.promise);
                        });
                        
                        $q.all(individualEventsDefer).then(function () {
                            
                            angular.forEach(userEvents, function (eventId, eventType) {
                                var pointsForEventType = userEvents[eventType].length * eventTypes[eventType].points,
                                    maxPointsForEventType = eventTypes[eventType].maxPoints;
                                citizenshipPoints += (maxPointsForEventType !== 0 && pointsForEventType > maxPointsForEventType) ? maxPointsForEventType : pointsForEventType;
                            });
                            angular.forEach(roomswipeEvents, function (roomswipeId, roomswipeType) {
                                roomswipePoints += Object.keys(roomswipeEvents[roomswipeType]).length * 1;
                                if (roomswipePoints === 10) {
                                    citizenshipPoints += 1;
                                }
                            });
                            citizenship = { points: citizenshipPoints, events: userEvents, roomswipe: roomswipeEvents };
                            defer.resolve(citizenship);
                        });
                        
                    });
                    
                });
                
                return defer.promise;
                
            }
            
        };
        
        
        return citizenshipFactory;
        
    }]);
    
    
    
}(window));