'use strict';

angular.module('myhonors').controller('AppCtrl', function ($scope, $rootScope, $route, $location, UserService) {
	$scope.user = UserService;
	$scope.showPanels = false;

	// used to show spinners and "Loading..." messages
	$rootScope.loading = false;

	$rootScope.$on('$routeChangeSuccess', function() {
		$rootScope.loading = false; // clear any loading messages after the route has successfully changed
		$scope.showPanels = angular.isDefined($route.current.$$route.showPanels) ? $route.current.$$route.showPanels : true;
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