'use strict';

angular.module('myhonorsEvents').factory('Events', ['$resource', function($resource) {
	return $resource('api/events?id=:eventId');
}]);