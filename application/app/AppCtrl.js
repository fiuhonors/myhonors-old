'use strict';

angular.module('myhonors').controller('AppCtrl', function ($scope, $rootScope, $route, $location, UserService) {
	$scope.user = UserService;

	// used to show spinners and "Loading..." messages
	$rootScope.loading = false;

	$rootScope.$on('$routeChangeSuccess', function() {
		// clear any loading messages after the route has successfully changed
		$rootScope.loading = false;
	});

	$rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
		switch (rejection)
		{
			case 'NO_PROFILE_FOUND':
			case 'NOT_LOGGED_IN':
			default:
				console.log(rejection);
				$location.path('login');
				break;
		}
	});

	$rootScope.page_title = "";
});