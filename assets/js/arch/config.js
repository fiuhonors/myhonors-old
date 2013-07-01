'use strict';

angular.module('myhonorsArch').config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/arch', {templateUrl: 'assets/js/arch/arch.html', controller: 'ArchCtrl', requireLogin: true, resolve: appResolve}).
		when('/arch/add', {templateUrl: 'assets/js/arch/arch-add.html', controller: 'ArchAddCtrl', requireLogin: true, resolve: appResolve}).
		when('/arch/:projectId', {templateUrl: 'assets/js/arch/arch-view.html', controller: 'ArchViewCtrl', requireLogin: true, resolve: appResolve}).
		when('/arch/:projectId/edit', {templateUrl: 'assets/js/arch/arch-edit.html', controller: 'ArchEditCtrl', requireLogin: true, resolve: appResolve}).
		when('/arch/:projectId/contract', {templateUrl: 'assets/js/arch/arch-contract.html', controller: 'ArchContractCtrl', requireLogin: true, resolve: appResolve});
}]);