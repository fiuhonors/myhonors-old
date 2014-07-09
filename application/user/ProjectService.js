'use strict'

angular.module('myhonorsUser').factory('ProjectService', ['$q', '$http', '$timeout', 'FirebaseIO', 'FirebaseCollection', function($q, $http, $timeout, FirebaseIO, FirebaseCollection) {
    
    // Fetch all the permitted categories for projects from Firebase
	var categoriesRef = FirebaseIO.child( 'system_settings/projectCategories' );
 	var projectCategories = FirebaseCollection( categoriesRef );
    
    return {
        /*
         * Returns a promise containing the data for a particular user's [roject
         */
        read: function( userId, projectId, onComplete ) {
            var deferred = $q.defer();
    
            FirebaseIO.child( 'user_profiles/' + userId + '/profile/projects/' + projectId ).on('value', function(snapshot) {
                if (snapshot.val() === null) {
                    // The project was deleted, do nothing
                    return;
                }
    
                var data = snapshot.val();
                data.$id = snapshot.name();
                    
                if (angular.isFunction(onComplete)) {
                    onComplete(data);
                }
                    deferred.resolve(data);    
            });
    
            return deferred.promise;
        },
        
        /*
         * Add a project to the specified user's profile
         */
        add: function( userId, projectObject ) {
            // TODO expand projectObject validation
            if ( !angular.isString(projectObject.title) ||
                !angular.isString(projectObject.description)
               ) {
                return false;
            }
            
            var ref =  FirebaseIO.child( 'user_profiles/' + userId + '/profile/projects/').push(projectObject);
            ref.setPriority(projectObject.createdAt);
            
            FirebaseIO.child( 'projects/' + userId + "/" + ref.name() ).push( projectObject );
            
            return ref.name();
        },
        
        /*
         * Return a list of all the projects of a particular user
         */
        list: function( userId ) {
            return FirebaseCollection(FirebaseIO.child('user_profiles/' + userId + '/profile/projects'));
        },
        
        /*
         * Update the specified user's project with the new data passed
         */
        update: function( userId, projectId, projectObject ) {
            // TODO add projectObject validation
            var id = projectId;
            
            FirebaseIO.child( 'user_profiles/' + userId + '/profile/projects/' + id ).update( projectObject );
            FirebaseIO.child( 'projects/' + userId + "/" + id ).update( projectObject );
        },
        
        /*
         * Remove the specified user's project from Firebase along with all the files uploaded to it.
         */
        remove: function( userId, projectId, project ) {
            if ( project.hasOwnProperty( "assets" ) ) 
                for ( var assetId in project.assets ) {
                    var assetObject = project.assets[ assetId ];
                    this.removeFile( userId, projectId, assetId, "assets", assetObject.url );
                }
            
            if ( project.hasOwnProperty( "files" ) ) 
                for ( var fileId in project.files ) {
                    var fileObject = project.files[ fileId ];
                    this.removeFile( userId, projectId, fileId, "files", fileObject.url );
                }
                    
			FirebaseIO.child( 'user_profiles/' + userId + '/profile/projects/' + projectId ).remove();
            FirebaseIO.child( 'projects/' + userId + '/' + projectId ).remove();
		},
        
        /*
         * Returns a FirebaseCollection containing all permitted project categories
         */
        getCategories: function( ) { 
            return projectCategories;
        },
        
        /*
         * Returns the particular label CSS class assigned to each project category
         */
        getLabel: function( chosenCategory ) {

			var label;
			projectCategories.forEach( function( category ) {
				if ( category.name === chosenCategory ) 
					label = category.label;
			});
			
			return "label label-" + label;     
        },
        
        /*
         * ONLY updates Firebase to contain a file's info in the specified user's project. It also updates the general Firebase node containing 
         * all projects.
         * Note that contrary to the removeFile() method below, this method does not handle the actual uploading of the file to the server.
         * This is handled by angular-file-uploader and the file-upload.php.
         */
        addFile: function( userId, projectId, fileId, fileCategory, fileObject ) {
            FirebaseIO.child( 'user_profiles/' + userId + '/profile/projects/' + projectId + '/' + fileCategory + '/' + fileId ).set( fileObject );
            FirebaseIO.child( 'projects/' + userId + '/' + projectId + '/' + fileCategory + '/' + fileId ).set( fileObject );
        },
        
        /*
         * Removes the actual specified file of a user's project from the server as well as removes the reference to it in Firebase
         * @param userId
         * @param projectId
         * @param fileId The file's ID ( which is stored in Firebase )
         * @param fileCategory The type of the file. More specifically, an asset or a general file.
         * @param pathToFile The path to the file in the actual server
         * Precondition: fileCategory is 'assets' or 'files'
         */
        removeFile: function( userId, projectId, fileId, fileCategory, pathToFile ) {
            
            // Serialize the pathTofi
            var data = $.param( { 'userId' : userId, 'pathToFile' : pathToFile } );
            
            $http.post('application/user/file-remove.php', data , { headers: { 'Content-Type' : 'application/x-www-form-urlencoded' } } ).success( function( result ) {
                if ( result.success === true ) {
					FirebaseIO.child( 'user_profiles/' + userId + '/profile/projects/' + projectId + '/' + fileCategory + '/' + fileId ).remove();
					FirebaseIO.child( 'projects/' + userId + "/" + projectId + '/' + fileCategory + '/' + fileId ).remove();
				}
				else {
					alert( result.error );
				}
            });
        }
    }
}]);