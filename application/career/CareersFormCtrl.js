'use strict';

angular.module('myhonorsCareer').controller('CareersFormCtrl', ['$scope', '$timeout', '$location', '$routeParams', '$http', 'CareerService', 'UserService', function($scope, $timeout, $location, $routeParams, $http, CareerService, UserService) {
		var mode = ""; // Used to keep track whether the user is adding a new position or editing an exisiting one
		
		if ($routeParams.positionID == null) {	//If no paramater ID has been passed, the user is creating a new career
			mode = "Add";
			$scope.newPosition = {};
		} else {								//If a paramter ID is passed, the user is editing an existing career
			mode = "Edit";
			CareerService.read($routeParams.positionID, function(data) {
				$timeout(function() {
					$scope.newPosition = data;	
				});
			});
		}
		
		$scope.doAdd = function() {
			
			if (mode == "Add") {
				
				if (UserService.auth && UserService.auth.isStaff)
					$scope.newPosition.status = "active";
				else
					$scope.newPosition.status = "pending";
					
				var positionID = CareerService.create($scope.newPosition);
				
				
				
				if (positionID != null) { // If positionID is not null that means the form was valid and the position was created succesfully
					
					if ( $scope.newPosition.status === "pending" ) {
						var serializedData = $.param( $scope.newPosition ); //Serializes the data so we can pass it to the POST request
                        
                        
                        
                        
						sendNotificationEmail( positionID, serializedData );
					}
					
					$location.path('career/' + positionID);
					
				}
			} 
			else {
				var status = CareerService.update($routeParams.positionID,$scope.newPosition);
				if (status)
					$location.path('career/' + $routeParams.positionID);
			}
			
				
		}
		
		function sendNotificationEmail( positionID, positionInfo ) {
			$http.post( 'application/career/notify.php', positionInfo, {headers: {'Content-Type' : 'application/x-www-form-urlencoded'}} ).success( function( result ) {
				if ( result.success === true ) {
					alert( "The internship information has been submitted and is pending approval." );
				}
				else {
					alert( result.error );
				}
			});
		}
}]);
