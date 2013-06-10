'use strict';

angular.module('myhonorsArch').config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/arch', {templateUrl: 'assets/partials/arch.html', controller: 'ArchCtrl', requireLogin: true, resolve: appResolve})
}]);