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
                            var individualEventDefer = $q.defer();
                            FirebaseIO.child('events/' + eventId).once('value', function (snapshot) {
                                var eventType = snapshot.val().types[0];
                                if (!eventTypes[eventType]) {
                                    return;
                                }
                                if (userEvents[eventType] === undefined) {
                                    userEvents[eventType] = [];
                                }
                                userEvents[eventType].push({
                                    'eventName': snapshot.val().name,
                                    'eventId': eventId
                                });
                                individualEventDefer.resolve();
                            });
                            individualEventsDefer.push(individualEventDefer.promise);
                        });
                        angular.forEach(roomswipeTypes, function (swipeDetails, swipeType) {
                            var individualEventDefer = $q.defer();
                            FirebaseIO.child('events/' + swipeType + '/attendance/' + pantherId).once('value', function (snapshot) {
                                if (snapshot.val() !== null) {
                                    roomswipeEvents[swipeDetails] = snapshot.val();
                                }
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
                            for (var roomswipeType in roomswipeEvents) {
                                if (roomswipeEvents.hasOwnProperty(roomswipeType)){
                                    roomswipePoints += Object.keys(roomswipeEvents[roomswipeType]).length;
                                    if (roomswipePoints >= 10) {
                                        citizenshipPoints += 1;
                                        break;
                                    }
                                }
                            }
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

    angular.module("myhonorsCitizenship").filter('orderCitizenship', function() {
        return function(items, field, reverse) {
            var filtered = [];
            angular.forEach(items, function(item, keys) {
                item.keyValue = keys;
                filtered.push(item);
            });
            filtered.sort(function (a, b) {
                if(a[field] > b[field]){
                    return 1;
                }else if(a[field < b[field]]){
                    return -1;
                }else{
                    if(a.keyValue === "HEARTS" && a[field] >= b[field]){
                        return 1;
                    }
                    if(b.keyValue === "HEARTS" && b[field] >= a[field]){
                        return -1;
                    }
                }
            });
            if(reverse){
                filtered.reverse();
            }
            return filtered;
        };
    });

    
    
    
}(window));