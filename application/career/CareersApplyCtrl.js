'use strict';

angular.module('myhonorsCareer').controller('CareersApplyCtrl', ['$scope', '$timeout', '$location', '$routeParams', '$fileUploader', 'FirebaseIO', 'UserService', 'CareerService', function($scope, $timeout, $location, $routeParams, $fileUploader, FirebaseIO, UserService, CareerService) {
	$scope.user = UserService.profile;
	$scope.positionID = $routeParams.positionID;
	
	//We define the timeAvailability properties because without them we can't use them in the ng-model since they are deeply nested
	$scope.formInfo = { timeAvailability: { Sunday: {}, Monday: {}, Tuesday: {}, Wednesday: {}, Thursday: {}, Friday: {}, Saturday: {}}};

	CareerService.read($scope.positionID, function(data) {
		$timeout(function() {
			$scope.position = data;		
		});
	});
	
	
	$scope.addTime = function(day, time) {
		
		if ($scope.formInfo.timeAvailability[day][time] == null)
			$scope.formInfo.timeAvailability[day][time] = true;
		else
			delete $scope.formInfo.timeAvailability[day][time];
	};
	
	
	// Create the file uploader with options
     var uploader = $scope.uploader = $fileUploader.create({
            scope: $scope,                          // to automatically update the html. Default: $rootScope
            url: 'application/career/upload.php',
            formData: [
				{
					userID: $scope.user.id,		// Send the user pid along with the file
					positionID: $scope.positionID 	// Send the position along with the file
				}
			],
            filters: [
				//We use this filter to determine that the file uploaded is the correct type and file size
                function (item) {
                    var fileType = item.name.split('.').pop();
                    
                    $scope.form.error = "";
                    
                    if (fileType !== 'doc' && fileType !== 'docx' && fileType !== 'pdf') {
						$scope.form.error = "<strong>Sorry!</strong> You can only upload Word or PDF files.";
						return false;
					}
					
					else if (item.size > 8388608) {
						$scope.form.error = "<strong>Sorry!</strong> The limit file size is 8 megabytes.";
						return false;
					}
					
					return true;
                }
            ]
        });
        
        // If the file upload is sucessful
        uploader.bind('success', function( event, xhr, item, result ) {
			if (result.success === true) {
					alert("Your application has been succesfully submitted.");
				} else {
					alert(result.error);
				}
			
			$scope.$apply(function() {
				$location.path('career');
			});
		}); 
        
        
		$scope.submit = function (form) {
			if(form.$invalid) { 
				console.log("Form not valid");
				return;
			}
			
			// The user's info is included in the form info for denomarlization purposes
			$scope.formInfo["name"] = $scope.user.fname + " " + $scope.user.lname;
			$scope.formInfo["email"] = $scope.user.email;
			$scope.formInfo["pid"] = $scope.user.pid;
			
			// Save the uploaded document's name to Firebase
			$scope.formInfo["fileName"] = $scope.uploader.queue[0].file.name;
			
			CareerService.addApplication($scope.formInfo, $scope.positionID);
			
			$scope.uploader.uploadAll();
			
		}
 
}]);
