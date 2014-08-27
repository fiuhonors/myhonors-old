'use strict';

angular.module('myhonorsUser').controller('ProjectViewCtrl', ['$scope', '$routeParams', '$location', '$timeout', 'UserService', 'ProjectService', function EventBrowseCtrl($scope, $routeParams, $location, $timeout, UserService, ProjectService) {
    $scope.projectId = $routeParams.projectId;
    $scope.project = '';
    $scope.pid = '';
    $scope.isAbleEdit = ($scope.pid == UserService.profile.id || UserService.auth.isStaff) ? true : false; // Boolean that determines whether the user can edit this profile or not
    
    // Load the student's info and profile as well as the project's info
    UserService.getPIDFromUsername( $routeParams.username ).then( function( pid ) {
        $scope.pid = pid;
        UserService.exists( pid, function(exists, result) {
            $timeout(function() {
                if (exists) {
                    $scope.user = jQuery.extend(true, $scope.user, result);
                    loadProjectInfo( $scope.pid, $scope.projectId );
                }
            });
        });
    });
    
    
    function loadProjectInfo( pid, projectId ) {
        ProjectService.read( pid, projectId, function( data ) {
            $scope.project = data;

            /*
             * Below a small hack is made so that the uploaded video can be shown with ng-carousel. To do this, a property to the assets object of 
             * the project is added that includes the video url
             */
            if ( $scope.project.video && $scope.project.video.embed.length ) {
                var embedCode = $scope.project.video.embed;

                if ( ! $scope.project.hasOwnProperty( "assets" ) ) // In case there is no assets object, create it
                    $scope.project.assets = {};

                $scope.project.assets[ 'video' ] = { 'embed': embedCode };
            }
        });
    }
    
    
    
    /*
     * Get the appropiate CSS class for a project depending on its category
     */
    $scope.chooseLabel = function( category ) {
        return ProjectService.getLabel( category )
    };
    
    
    $scope.hasAssets = function( project ) {
        if( project && project.hasOwnProperty( "assets" ) )
            return true;
            
        return false;
    };
    
    $scope.hasFiles = function( project ) {
        if( project && project.hasOwnProperty( "files" ) )
            return true;
            
        return false;
    };
    
    
    if ( $scope.isAbleEdit ) {
		$scope.modalOpts = {
			backdropFade: true,
			dialogFade: true
		};

		$scope.confirmDelete = function() {
			$scope.showDeleteConfirmation = true;
		};

		$scope.cancelDelete = function() {
			$scope.showDeleteConfirmation = false;
		};

		$scope.deleteProject = function() {
			$scope.showDeleteConfirmation = false; // Close the deletion confirmation modal
            ProjectService.remove( $scope.pid, $scope.projectId, $scope.project );
			$location.path( 'profiles/' + UserService.profile.username );
		};
	}	

}]);
