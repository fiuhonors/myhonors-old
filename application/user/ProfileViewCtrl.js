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

        /*
         * Besides creating a new project, this method must make another check: the user is able to upload files to his project before he actually 
         * creates a new project. For this reason, this method must check whether the project has already been created during the 'Add Project' modal.
         * If it has, then simply update the project in Firebase with any changes that the user might have made to the project info after uploading 
         * the file(s). Otherwise, simply create the project.
         */
        $scope.addProject = function( form ) {
            if ( form.$invalid ) {
                return;
            }

            // Transform the project object to JSON and then parse it into an object again to delete files like $id, etc. that cause problems with Firebase
            var project = JSON.parse( angular.toJson( $scope.currentProject ) );
            
            if ( ! $scope.currentProject.hasOwnProperty( "$id" ) ) {
                project.createdAt = Date.now(); // Store the time when the project was created
                var projectId = ProjectService.add( $scope.pid, project ); // Add the project 
            }
            else
                ProjectService.update($scope.pid, $scope.currentProject.$id, project);
            
            $scope.closeModal();
        };

        $scope.editProject = function( $event, projectIndex ) {
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
        
        /*
         * Returns a project' first asset's url. This is used when iterating through the user's projects so that their projects thumbnails 
         * show one of his or her pictures ( if any exists )
         */
        $scope.getFirstAssetUrl = function( project ) {
            if ( ! project.hasOwnProperty( "assets" ) ) 
                return null;
            
            for ( var assetId in project.assets )
                   return project.assets[ assetId ].url;
        };
        
        // The following variables are used to keep track whether the user is uploading a picture, a document or inputting a video URL
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

                        // This code will used to limit the number of files and assets a user can do per project
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
 
            var itemIndex = Date.now();
            item.formData[ 0 ].itemIndex =  itemIndex; 
        } ); 

         /*
          * Check to see whether the PHP upload file was succesful or not by what it returned.
          */
         uploader.bind( 'success', function( event, xhr, item, result ) {
            if ( result.success === true ) {                
                // TODO find better way to determine if the file being added is an asset or a general file
                var fileCategory;
                if ( $scope.showPictureUploadForm )
                    fileCategory = 'assets';
                else if ( $scope.showDocumentUploadForm )
                    fileCategory = 'files';
                
                // Update Firebase so that it holds the reference to this new uploaded file
                ProjectService.addFile( $scope.pid, $scope.currentProject.$id, result.fileId, fileCategory, JSON.parse( result.fileObject ) );
            } 
            else 
                $scope.form.error = "<strong>Sorry!</strong> " + result.error;
         } ); 

         /*
          * Besides uploading all the files in the queue this method must do another check: it is possible that the user uploads a file or asset
          * during the creation of a project. In such a case, the project must first be created in Firebase and the files would then be uploaded.
          */
         $scope.uploadSubmittedFiles = function() {
             if ( ! $scope.currentProject.hasOwnProperty( "$id" ) ) {
                 $scope.currentProject.createdAt = Date.now(); // Store the time when the project was created
                 var projectId = ProjectService.add($scope.pid, $scope.currentProject); // Add the project 

                 $scope.updateUploadPath( $scope.pid + '/profile/projects/' + projectId + '/assets/' );
                 ProjectService.read( $scope.pid, projectId, function( data ) {
                     $scope.currentProject = data;
                 } );
             }

             if ( $scope.uploader.queue.length > 0 )
                 $scope.uploader.uploadAll();
         };

         $scope.updateUploadPath = function( newPath ) {
             $scope.uploader.formData[ 0 ].path = newPath;
         };

         $scope.updateUploadUrl = function( newUrl ) {
              $scope.uploader.url = newUrl;
         };

         $scope.removeAsset = function( project, assetId, pathToAsset ) {
             delete project.assets[ assetId ];
             ProjectService.removeFile( $scope.pid, project.$id, assetId, 'assets', pathToAsset );
         };

        $scope.removeFile = function( project, fileId, pathToFile ) {
             delete project.files[ fileId ];
             ProjectService.removeFile( $scope.pid, project.$id, fileId, 'files', pathToFile );
         };

    }
    
}]);
