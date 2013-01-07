'use strict';

var myhonors = angular.module('myhonors', ['myhonorsEvents']);

/* Config */

myhonors.config(['$routeProvider', function($routeProvider) {
	$routeProvider.otherwise({redirectTo:'/home', templateUrl: 'assets/partials/home.html'});
}]);

/* Controllers */

myhonors.controller('AppCtrl', ['$scope', '$location', function AppCtrl($scope, $location) {
	$scope.page_title = "";
	$scope.profile = {};
}]);