'use strict';

angular.module('myhonorsUser').controller('ProjectViewCtrl', function EventBrowseCtrl($scope, $rootScope, $routeParams, $location, $timeout, FirebaseIO, UserService, ProjectService) {
    $scope.projectId = $routeParams.projectId;
    $scope.pid = $routeParams.userId;
    
    ProjectService.read( $scope.pid, $scope.projectId, function( data ) {
        $scope.project = data;
    });
    
    // Load the student's info and profile    
    UserService.exists( $routeParams.userId, function( exists, result ) {
        $timeout(function() {
            if ( exists ) {
                $scope.user = jQuery.extend( true, $scope.user, result );
            }
        });
    });
    
    
    /**
     * Get the appropiate CSS class for a project depending on its category
     */
    $scope.chooseLabel = function( category ) {
        return ProjectService.getLabel( category )
    };
    
    
    $scope.hasAssets = function( project ) {
        if( project.hasOwnProperty( "assets" ) )
            return true;
            
        return false;
    };

});