'use strict';

angular.module('myhonorsArch').config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/arch', {templateUrl: 'application/arch/arch.html', controller: 'ArchCtrl', requireLogin: true, resolve: appResolve}).
		when('/arch/add', {templateUrl: 'application/arch/arch-add.html', controller: 'ArchAddCtrl', requireLogin: true, resolve: appResolve}).
		when('/arch/:projectId', {templateUrl: 'application/arch/arch-view.html', controller: 'ArchViewCtrl', requireLogin: true, resolve: appResolve}).
		when('/arch/:projectId/edit', {templateUrl: 'application/arch/arch-edit.html', controller: 'ArchEditCtrl', requireLogin: true, resolve: appResolve}).
		when('/arch/:projectId/contract', {templateUrl: 'application/arch/arch-contract.html', controller: 'ArchContractCtrl', requireLogin: true, resolve: appResolve});
}]);