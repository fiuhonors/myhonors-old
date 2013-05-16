'use strict';

angular.module('myhonorsUser').controller('SignupCtrl', ['$scope', '$rootScope', '$http', function($scope, $rootScope, $http) {
	$scope.signup = $rootScope.signup;
	$scope.doRegistration = $rootScope.doRegistration;

	$scope.doVerification = function() {
		var data = 'pid=' + $scope.signup.pantherID + '&password=' + $scope.signup.myAccountsPassword;
		$http.post('auth.php', data, {headers: {'Content-Type' : 'application/x-www-form-urlencoded'}}).success(function(result) {
			if (result.success === true)
			{
				// the result is in the same form as our verification object
				$scope.signup.verification = result;

				// reset in case user previously made an error, so no error is displayed when verification is successful
				$scope.signup.error = '';
			}
			else
			{
				$scope.signup.error = result.error;
			}
		});
	};
}]);