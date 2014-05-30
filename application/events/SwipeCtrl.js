'use strict';

angular.module('myhonorsEvents').controller('SwipeCtrl', ['$scope', '$timeout', '$routeParams', '$fileUploader', 'UserService', 'EventService', 'SwipeService', 'RFIDTagService', function ($scope, $timeout, $routeParams, $fileUploader, UserService, EventService, SwipeService, RFIDTagService) {
	$scope.data = {id: ''};
	
	$scope.rfid
	
	$scope.event = EventService.read($routeParams.eventId, function(event) {
		$scope.eventType = event.types;	//Store the event type
	});
	
	$scope.swipes = SwipeService.listByEvent($routeParams.eventId);

	// used in ng-repeat's orderBy to reverse the array
	$scope.nothing = function(val) {return val};
	$scope.reverse = true;
	
	/**
	 * Determine whether the ID inputted is a Panther ID or RFID tag. For the latter case, the PID is then retrieved.
	 * Then, the PID is passed to the doAdd function in order to continue the swipping process.
	 */
	$scope.parseId = function() {
		if ($scope.data.id.length == 7)	// The ID is a Panther ID
			 $scope.doAdd($scope.data.id);
		else {								// The ID is an RFID tag
			RFIDTagService.getPID($scope.data.id, function(pid) {
				$scope.doAdd(pid);
			});
		}
	}

	$scope.doAdd = function(pid) {
		var userId = pid;

		UserService.exists(userId, function(result, userData) {
			if (result === true) {
				SwipeService.create($routeParams.eventId, userId, $scope.eventType);
				$timeout(function() {
					$scope.lastSwipe = userData;
					$scope.error = false;
				});
			} else {
				$timeout(function() {
					$scope.lastSwipe = false;
					$scope.error = true;
				});
			}
		});
		$scope.data.id = '';
	};
	
	
	/**        Mass attendance uploading             */
	// Create the file uploader with options
     var uploader = $scope.uploader = $fileUploader.create({
            scope: $scope,                          // to automatically update the html. Default: $rootScope
            url: 'application/events/mass-attendance-upload.php',
            formData: [
				{
					eventId: $routeParams.eventId,		// Send the user pid along with the file
				}
			],
            filters: [
				//We use this filter to determine that the file uploaded is the correct type and file size
                function (item) {
                    var fileType = item.name.split('.').pop();
                    
                    $scope.uploadError = "";
                    
                    if (fileType !== 'xls' && fileType !== 'xlsx') {
						$scope.uploadError = "<strong>Sorry!</strong> You can only upload Excel files.";
						return false;
					}
					
					else if (item.size > 8388608) {
						$scope.uploadError = "<strong>Sorry!</strong> The limit file size is 8 megabytes.";
						return false;
					}
					
					return true;
                }
            ]
        });
        
        // If the file upload is sucessful
        uploader.bind('success', function( event, xhr, item, result ) {
			if (result.success === true) {
					alert("The students' attendance has been succesfully updated.");
				} else {
					alert(result.error);
				}
			$scope.uploader.clearQueue();
			$scope.processingFile = false;
		});
		
		$scope.submit = function () {
			$scope.processingFile = true;  // Used to change the disable the button and change its text to "Please Wait"
			$scope.uploader.uploadAll();
		} 
		
}]);
