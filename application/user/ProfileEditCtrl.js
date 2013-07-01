'use strict';

angular.module('myhonorsUser').controller('ProfileEditCtrl', ['$scope', '$rootScope', '$routeParams', '$location', function EventBrowseCtrl($scope, $rootScope, $routeParams, $location) {
	$scope.profileEdit = Profile.get({id: $routeParams.userId}, function(data) {console.log(data);});

	$scope.profileSave = function() {
		$scope.profileEdit.$save(function(data) {
			$rootScope.profileData = data;
			$location.path('/profile/' + $routeParams.userId);
		});
	};

}]);