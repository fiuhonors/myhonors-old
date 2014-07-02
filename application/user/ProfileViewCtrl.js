'use strict';

angular.module('myhonorsUser').controller('ProfileViewCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', '$fileUploader', 'UserService', 'ProfileService', 'ProjectService', function EventBrowseCtrl($scope, $rootScope, $routeParams, $location, $timeout, $fileUploader, UserService, ProfileService, ProjectService) {
    $scope.pid = $routeParams.userId;
    $scope.isAbleEdit = ($scope.pid == UserService.profile.id || UserService.auth.isStaff) ? true : false; // Boolean that determines whether the user can edit this profile or not. Only the staff and the owner of the profile can do so
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
            organizations: [],
        }
    };
    $scope.form = {};
    
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
            // Pass a copy of the profile object to eliminate the $$hashKey property that cause ng-repeat to stop working
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

        $scope.currentProject = {}; // Holds the project object that is being added or edited
        $scope.currentProjectIndex = null; // Holds the index of the project's collection that stores the current project being edited

        
        /*
         * Watch the projects collection. If it changes, if the user is currently browsing a project, that project is updated with the new info.
         * This is done so that when the user uploads documents or pictures to a project, they appear on the 'Edit Project' listings in real-time.
         */
        $scope.$watchCollection( 'projects', function() {
            if ( $scope.currentProjectIndex )
                $scope.currentProject = $scope.projects[ $scope.currentProjectIndex ];
        } );

        // Modal options
        $scope.modalOpts = {
            backdropFade: true,
            dialogFade: true,
            windowClass: 'dynamic-modal'
        };

        $scope.showModal = function() {
            $scope.showProjectModal = true;
        };

        // Close the modal and reset the necessary options
        $scope.closeModal = function() {
            $scope.showProjectModal = false;
            $scope.currentProject = {};
            $scope.newProject = false
        };

        $scope.newProjectModal = function() {
            $scope.newProject = true;
            $scope.showModal();
        };

        $scope.addProject = function( form ) {
            if ( form.$invalid ) {
                return;
            }

            $scope.currentProject.createdAt = Date.now(); // Store the time when the project was created
            var projectId = ProjectService.add($scope.pid, $scope.currentProject); // Add the project 
            
//            $scope.updateUploadUrl( "application/user/file-upload.php" );
//            $scope.updateUploadPath( $scope.pid + '/profile/projects/' + projectId + '/assets/' );
            $scope.uploadSubmittedFiles();
            
            $scope.closeModal();
        };

        $scope.editProject = function( $event, projectIndex ) {
//            $scope.currentProject = project;
            $scope.currentProjectIndex = projectIndex;
            $scope.currentProject = $scope.projects[ projectIndex ]; // Get the selected project's info

            $scope.showModal();
            
            // Prevent the user from being taken to the roject's view page. ( This is due to how the ng-clicks are set up in the view )
            $event.stopImmediatePropagation();
        };

        $scope.updateProject = function( form ) {
            if ( form.$invalid ) {
                return;
            }

            // Transform the project object to JSON and then parse it into an object again to delete files like $$hashKey, etc. that cause problems with Firebase
            var project = JSON.parse( angular.toJson( $scope.currentProject ) );
            var projectId = $scope.currentProject.$id;
            ProjectService.update($scope.pid, projectId, project);
            
//            $scope.updateUploadUrl( "application/user/file-upload.php" );
//            $scope.updateUploadPath( $scope.pid + '/profile/projects/' + projectId + '/assets/' );
            $scope.uploadSubmittedFiles();

            $scope.closeModal();
        };
        
        // Determine whether the project has any pictures
        $scope.hasAssets = function( project ) {
            if( project && project.hasOwnProperty( "assets" ) )
                return true;

            return false;
        };
    
        // Determine whether the project has any documents
        $scope.hasFiles = function( project ) {
            if( project && project.hasOwnProperty( "files" ) )
                return true;

            return false;
        };
        
        // The following variables are used to keep track whether the use is uploading a picture, a document or inputting a video URL
        $scope.showPictureUploadForm = false;
        $scope.showDocumentUploadForm = false;
        $scope.showVideoInputForm = false;
        
        $scope.showPictureUpload = function() {
            $scope.showPictureUploadForm = true;  
            $scope.showDocumentUploadForm = false;
            $scope.showVideoInputForm = false;
            $scope.form.error = "";
            $scope.uploader.clearQueue();

            
            $scope.updateUploadUrl( "application/user/file-upload.php" );
            $scope.updateUploadPath( $scope.pid + '/profile/projects/' + $scope.currentProject.$id + '/assets/' );
        };
        
        $scope.showDocumentUpload = function() {
            $scope.showDocumentUploadForm = true;  
            $scope.showPictureUploadForm = false;
            $scope.showVideoInputForm = false;
            $scope.form.error = "";
            $scope.uploader.clearQueue();
            
            $scope.updateUploadUrl( "application/user/file-upload.php" );
            $scope.updateUploadPath( $scope.pid + '/profile/projects/' + $scope.currentProject.$id + '/files/' );
        };
        
        $scope.showVideoInput = function() {
            $scope.showVideoInputForm = true;
            $scope.showPictureUploadForm = false;
            $scope.showDocumentUploadForm = false;
            $scope.form.error = "";
        };
        
        
    
        /*
         * This function is able to parse a variety of different YouTube links and extract the video's id
         * Code taken from: http://stackoverflow.com/questions/3452546/javascript-regex-how-to-get-youtube-video-id-from-url
         */
        $scope.parseYouTubeUrl = function( url ) {
            var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
            var match = url.match(regExp);
            
            if ( match && match[ 7 ].length == 11 )
                return match[ 7 ];
            
            return null;
        };
        
        /*
         * This function creates the HTML embed code for a YouTube video so that it can be shown in the carousel in the project's view page
         */
        $scope.createEmbedCode = function( url ) {
            console.log( "url: " + url );
            var youTubeId = $scope.parseYouTubeUrl( url );
            
            
            var embedCode = "";
            
            if ( youTubeId && youTubeId.length )
                embedCode = '<iframe width="420" height="315" src="//www.youtube.com/embed/' + youTubeId 
                            + '" frameborder="0" allowfullscreen></iframe>';
            
            return embedCode;
        };
        
        
	    /***** File uploader set up as well helper methods for uploading *****/
	    
	    $scope.numFilesAllowed = 2; // The number of total files that a user can upload for a project
	    
	    // Create the file uploader with options
	    var uploader = $scope.uploader = $fileUploader.create({
            scope: $scope,                          
            url: 'application/user/file-upload.php',
            formData: [
                {
                    userId: $scope.pid,		// Send the user pid along with the file
                    path: ''
                }
            ],
            removeAfterUpload: true, // Remove files from the queue after upload
            filters: [
                // Use this filter to determine that the file uploaded is the correct type and file size
                function (item) {

                    $scope.form.error = "";

//	                    if ( $scope.currentProject.hasOwnProperty( "assets" ) && $scope.currentProject.assets.length == $scope.numFilesAllowed ) {
//	                        $scope.form.error = "<strong>Sorry!</strong> You can only upload a total of " + $scope.numFilesAllowed + " files per project.";
//	                        return false;
//	                    }


                    var fileType = item.name.split('.').pop(); // Extract the file extension from the file's name

                    // If the user is currently doing a document upload, do the validation for documents
                    if ( $scope.showDocumentUploadForm ) {
                        if ( fileType !== 'doc' && fileType !== 'docx' && fileType !== 'ppt' && fileType !== 'pptx' && fileType !== 'pdf' ) {
                            $scope.form.error = "<strong>Sorry!</strong> You can only upload Word, Powerpoint or PDF files.";
                            return false;
                        }
                    }
                    // If the user is currently doing a picture upload, do the validation for images
                    else if ( $scope.showPictureUploadForm ) {
                        if ( fileType != "jpg" && fileType != "jpeg" && fileType != "gif" && fileType != "png" ) {
                            $scope.form.error = "<strong>Sorry!</strong> Only JPG, GIF and PNG pciture formats are allowed.";
                            return false;
                        }
                    }

                    if (item.size > 8388608) {
                        $scope.form.error = "<strong>Sorry!</strong> The limit file size is 8 megabytes.";
                        return false;
                    }

                    return true;
                }
            ]
        });
        
        /*
         * Every item being uploaded keeps track of its own seprate formData property. Thus, if the formData of the uploader object 
         * is changed after the item was added to the queue, the item's formData will not reflect that change. 
         * Therefore, since the formData of the uploader is being changed (such as with the 'path' variable), the items' formData must 
         * also be updated before upload.
         */
        uploader.bind( 'beforeupload', function( event, item ) {
            item.formData = uploader.formData; // Set the item's formData to be the same to the 
            item.url = uploader.url;           // Set the item's upload URL to be the same as the uploader's
            var itemIndex = ( item.index - 1 );

            if ( $scope.showPictureUploadForm )
                itemIndex += ( $scope.currentProject.hasOwnProperty( "assets" ) ) ? $scope.currentProject.assets.length : 0;
            else if ( $scope.showDocumentUploadForm )
                itemIndex += ( $scope.currentProject.hasOwnProperty( "files" ) ) ? $scope.currentProject.files.length : 0;

            item.formData[ 0 ].itemIndex =  itemIndex; 
        } ); 

         /*
          * Check to see whether the PHP upload file was succesful or not by what it returned.
          */
         uploader.bind( 'success', function( event, xhr, item, result ) {
            if ( result.success === true ) {
                //alert( "The files has been succesfully submitted." );
            } 
            else {
                $scope.form.error = "<strong>Sorry!</strong> " + result.error;
            }


         } ); 


         uploader.bind( 'completeall', function( event, items ) {
            $scope.uploader._nextIndex = 0;
         } );



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
             ProjectService.removeFile( $scope.pid, project.$id, assetIndex, 'assets', pathToAsset );
         };

        $scope.removeFile = function( project, fileIndex, pathToFile ) {
             project.files.splice( fileIndex, 1 );
             ProjectService.removeFile( $scope.pid, project.$id, fileIndex, 'files', pathToFile );
         };

    }
    
}]);
