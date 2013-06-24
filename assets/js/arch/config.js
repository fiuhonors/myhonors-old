'use strict';

angular.module('myhonorsArch').config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/arch', {templateUrl: 'assets/partials/arch.html', controller: 'ArchCtrl', requireLogin: true, resolve: appResolve}).
		when('/arch/add', {templateUrl: 'assets/partials/arch-add.html', controller: 'ArchAddCtrl', requireLogin: true, resolve: appResolve}).
		when('/arch/:projectId', {templateUrl: 'assets/partials/arch-view.html', controller: 'ArchViewCtrl', requireLogin: true, resolve: appResolve}).
		when('/arch/:projectId/contract', {templateUrl: 'assets/partials/arch-contract.html', controller: 'ArchContractCtrl', requireLogin: true, resolve: appResolve});
}]);