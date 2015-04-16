(function (window) {
    'use strict';
    var angular = window.angular;

    
	angular.module('myhonorsCitizenship').factory('CitizenshipService', ['FirebaseIO', 'UserService', '$q', 'SwipeService', function (FirebaseIO, UserService, $q, SwipeService) {
        
		var types,
			userEvents,
			points;
        
		var citizenshipFactory = {
			
			getTypes: function () {
				var defer = $q.defer();
				if (types != undefined) {
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
							typeMaxPoints = value.citizenship.maxPoints || 0,
                            typeMinAttendance = value.citizenship.minAttendance || 0,
                            typeHide = value.citizenship.hide || false;

						citizenshipTypes[key] = {
							enabled: typeIsEnabled,
							points: typePoints,
							maxPoints: typeMaxPoints,
                            minAttendance: typeMinAttendance
						};
						if (typeIsEnabled) {
							citizenshipTypesEnabled[key] = {
								points: typePoints,
								maxPoints: typeMaxPoints,
                                minAttendance: typeMinAttendance,
                                hide: typeHide
							};
						} else {
							citizenshipTypesDisabled[key] = {
								points: typePoints,
								maxPoints: typeMaxPoints,
                                minAttendance: typeMinAttendance
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
			
			getEvents: function (studentId) {
				if (studentId == undefined) {
					studentId = UserService.profile.id;
				}
				return SwipeService.listByUser(studentId);
			},
			
			getPoints: function(studentId) {
				if (studentId == undefined) {
					studentId = UserService.profile.id;
				}
				var userEvents = citizenshipFactory.getEvents();
				console.log(userEvents);
				angular.forEach(userEvents, function(eventInfo, key) {
					console.log('test');
				});
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
