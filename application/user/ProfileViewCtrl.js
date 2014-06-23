'use strict';

angular.module('myhonorsUser').controller('ProfileViewCtrl', function EventBrowseCtrl($scope, $rootScope, $routeParams, $location, $timeout, $fileUploader, FirebaseIO, UserService, ProfileService, ProjectService) {
    $scope.pid = $routeParams.userId;
    $scope.isAbleEdit = ($scope.pid == UserService.profile.id || UserService.auth.isStaff) ? true : false; // Boolean that determines whether the user can edit this profile or not
    $scope.projects = ProjectService.list($scope.pid); // Collection of the sudent's projects
    $scope.projectCategories = ProjectService.getCategories();
    $scope.user = {
        profile: {
            phone: "",
            interests: {
                personal: [],
                academic: [],
                research: []
            },
            organizations: []
        }
    };
    $scope.form = {};


	/****** Testing for Croppic ******/
	
	//~ var cropperHeader = new Croppic('cropContainerHeader', cropperOptions);
					//~ 
	//~ var cropperOptions = {
		//~ uploadUrl:'process-crop.php'
	//~ }
	
	/*********************************/
    
    
    /******************* Testing for jCrop *************/
    
    $scope.cropImgCoordinates;
    $scope.setCropImgCoordinates = function( coordinates ) {
        $scope.cropImgCoordinates = coordinates;
        console.log( "Test", $scope.cropImgCoordinates );
    };
    
    $scope.previewImgSrc = "";
    function readURL( input ) {
        if ( input.files && input.files[ 0 ] ) {
            
            $scope.picUpload = input.files[ 0 ];
            
            var reader = new FileReader();
            
            reader.onload = function ( e ) {
                $scope.previewImgSrc = e.target.result;
                $scope.$apply();
            }
            
            reader.readAsDataURL( input.files[ 0 ] );
        }
    }
    
    $scope.showPreviewImg = function( input ) {
        readURL( input );   
    }
    
    $scope.submitCroppedImg = function( form, coordinates ) {
        if ( coordinates == null )
            alert( "Please crop part of the picture" );
        console.log( form );
        console.log( $scope.picUpload );
        
        $scope.uploader.addToQueue( $scope.picUpload, { name: $scope.picUpload.name , size:  $scope.picUpload.size, type:  $scope.picUpload.type } );
        $scope.uploader.formData[ 0 ].coordinates = JSON.stringify( coordinates );
        $scope.updateUploadUrl( "application/user/crop-image.php" );
        $scope.updateUploadPath( $scope.pid + '/profile/picture/' );
        $scope.uploader.uploadAll();
    };
    
    /****************************************************/

    // Load the student's info and profile	
    UserService.exists($routeParams.userId, function(exists, result) {
        $timeout(function() {
            if (exists) {
                $scope.user = jQuery.extend(true, $scope.user, result);
            }
        });
    });


    /**
     * Get the appropiate CSS class for a project depending on its category
     */
    $scope.chooseLabel = function( category ) {
        return ProjectService.getLabel( category )
    };
    
    
    $scope.goToProject = function( project ) {
        $location.path( '/profile/' + $scope.pid + '/projects/' +  project.$id );
    }



	/* Below are methods used to edit the profile. There use is restricted to the appropiate users */

    if ($scope.isAbleEdit) {

        $scope.updateProfile = function() {
            // We pass a copy of the profile object to eliminate the $$hashKey property that cause ng-repeat to stop working
            ProfileService.update($scope.pid, angular.copy($scope.user.profile));
        };

        /* Methods that handle the Interests and Organizations list */

        $scope.addItemToList = function(array) {
            array.push({
                value: "New item"
            });
            $scope.updateProfile();
        };

        $scope.removeItemAtIndex = function(array, index) {
            array.splice(index, 1);
            $scope.updateProfile();
        };


        /* Project functionality and modal settings */

        $scope.currentProject = {}; // Holds the info for the project that is being added or edited

        $scope.modalOpts = {
            backdropFade: true,
            dialogFade: true,
            windowClass: 'dynamic-modal'
        };

        $scope.showModal = function( modalName ) {
			if ( modalName === "project" ) {
				$scope.showProjectModal = true;
			}
        };

        $scope.closeModal = function( modalName ) {
			if ( modalName === "project" ) {
	            $scope.showProjectModal = false;
	            $scope.currentProject = {};
	            $scope.newProject = false
			}
            else if ( modalName === "profilePicture" ) {
                $scope.showProfilePicModal = false;   
            }
        };

        $scope.newProjectModal = function() {
            $scope.newProject = true;
            $scope.showModal( "project" );
        };

        $scope.addProject = function(form) {
            if (form.$invalid) {
                return;
            }

            $scope.currentProject.createdAt = Date.now();
            var projectId = ProjectService.add($scope.pid, $scope.currentProject);
            
            $scope.updateUploadUrl( "application/user/file-upload.php" );
            $scope.updateUploadPath( $scope.pid + '/profile/projects/' + projectId + '/assets/' );
            $scope.uploadSubmittedFiles();
            
            $scope.closeModal( "project" );
        };

        $scope.editProject = function($event, project) {
            $scope.currentProject = project;
            $scope.showModal( "project" );
            
            $event.stopImmediatePropagation();
        };

        $scope.updateProject = function(form) {
            if ( form.$invalid) {
                return;
            }

            var project = JSON.parse( angular.toJson( $scope.currentProject ) );

            var projectId = $scope.currentProject.$id;
            ProjectService.update($scope.pid, projectId, project);
            
            $scope.updateUploadUrl( "application/user/file-upload.php" );
            $scope.updateUploadPath( $scope.pid + '/profile/projects/' + projectId + '/assets/' );
            $scope.uploadSubmittedFiles();

            $scope.closeModal( "project" );
        };
        
        /******** Profile Picture *********/
        
        $scope.editProfilePicture = function() {
            $scope.showProfilePicModal = true;
        };
    
        
        $scope.$watch( 'profile.picture.url', function( newVal, oldVal ) {
           console.log( newVal ); 
        });
    
	    /* File Upload set up */
	    
	    $scope.fileUploadPath = "";
	    $scope.numFilesAllowed = 2;  // The number of total files that a user can upload for a project
	    
	    // Create the file uploader with options
	    var uploader = $scope.uploader = $fileUploader.create({
	            scope: $scope,                          // to automatically update the html. Default: $rootScope
	            url: 'application/user/file-upload.php',
	            formData: [
					{
						userId: $scope.pid,		// Send the user pid along with the file
						path: ''
					}
				],
				removeAfterUpload: true,
	            filters: [
					//We use this filter to determine that the file uploaded is the correct type and file size
	                function (item) {
	                    
	                    $scope.form.error = "";
	                    
	                    if ( $scope.currentProject.hasOwnProperty( "assets" ) && $scope.currentProject.assets.length == $scope.numFilesAllowed ) {
	                        $scope.form.error = "<strong>Sorry!</strong> You can only upload a total of " + $scope.numFilesAllowed + " files per project.";
	                        return false;
	                    }
	                        
	                    
	                    var fileType = item.name.split('.').pop();
	                    
	                    
	                    
	                    //~ if (fileType !== 'doc' && fileType !== 'docx' && fileType !== 'pdf') {
							//~ $scope.form.error = "<strong>Sorry!</strong> You can only upload Word or PDF files.";
							//~ return false;
						//~ }
						//~ 
						//~ else if (item.size > 8388608) {
							//~ $scope.form.error = "<strong>Sorry!</strong> The limit file size is 8 megabytes.";
							//~ return false;
						//~ }
						
						return true;
	                }
	            ]
	        });
	        
	        // If the file upload is sucessful
	        uploader.bind('success', function( event, xhr, item, result ) {
				if (result.success === true) {
						alert("The files has been succesfully submitted.");
                        if ( result.newPath  ) {
                            $scope.user.profile.picture.url = result.newPath;
                            $scope.$apply();
                        }
				} 
				else {
						$scope.form.error = "<strong>Sorry!</strong> " + result.error;
				}
				
				
			}); 
			
			/**
			 * Every item being uploaded keeps track of the formData. Thus, if the formData of the uploader object is changed after the item was added to the queue,
			 * the item's formData will not reflect that change. Therefore, it must updated before upload.'
			 */
            uploader.bind('beforeupload', function( event, item ) {
                item.formData = uploader.formData;
                item.url = uploader.url;
                var itemIndex = ( item.index - 1 );
                itemIndex += ( $scope.currentProject.hasOwnProperty( "assets" ) ) ? $scope.currentProject.assets.length : 0;
                item.formData[0].itemIndex =  itemIndex; 
            }); 
	        
	        
		 $scope.uploadSubmittedFiles = function() {
             if ( $scope.uploader.queue.length > 0 )
                 $scope.uploader.uploadAll();
         };
         
         $scope.updateUploadPath = function( newPath ) {
             $scope.uploader.formData[ 0 ].path = newPath;
         };
        
         $scope.updateUploadUrl = function( newUrl ) {
              $scope.uploader.url = newUrl;
         };
         
         $scope.removeAsset = function( project, assetIndex, pathToAsset ) {
             project.assets.splice( assetIndex, 1 );
             ProjectService.removeAsset( $scope.pid, project.$id, assetIndex, pathToAsset );
         };
         
		}
    
});
