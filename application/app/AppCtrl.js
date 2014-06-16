'use strict';

angular.module('myhonors').controller('AppCtrl', function ($scope, $rootScope, $route, $location, UserService) {
	$scope.user = UserService;
	$scope.showPanels = false;

	// used to show spinners and "Loading..." messages
	$rootScope.loading = false;

	$rootScope.$on('$routeChangeSuccess', function() {
		$rootScope.loading = false; // clear any loading messages after the route has successfully changed
		$scope.showPanels = ($route.current.$$route && angular.isDefined($route.current.$$route.showPanels))
							? $route.current.$$route.showPanels
							: true;
	});

	$rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
		switch (rejection)
		{
			case 'NO_PROFILE_FOUND':
			case 'NOT_LOGGED_IN':
			default:
				$location.path('login/');
				break;
		}
	});

	$rootScope.$on('$viewContentLoaded', function() {
		// every time the ngView content is reloaded,
		// track page view in Google Analytics
		ga('send', 'pageview', {'page': $location.path()});
	});

	$rootScope.page_title = "";
});