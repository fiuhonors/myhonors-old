'use strict';

angular.module('myhonorsCitizenship').config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/citizenship', {
			templateUrl: 'application/citizenship/citizenship.html',
			controller: 'CitizenshipCtrl',
			requireLogin: true, 
			resolve: appResolve});
}]);
