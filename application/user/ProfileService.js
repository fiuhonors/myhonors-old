'use strict'

angular.module('myhonorsUser').factory('ProfileService', function($q, $http, FirebaseIO, FirebaseCollection) {
	
	
	return {
		addProject: function(userId, projectObject) {
			if ( !angular.isString(projectObject.title) ||
				!angular.isString(projectObject.description)
			) {
				return false;
			}
			
			var ref =  FirebaseIO.child( 'user_profiles/' + userId + '/profile/projects/').push(projectObject);
			ref.setPriority(projectObject.createdAt);
			
			FirebaseIO.child( 'projects/' + userId + "/" + ref.name() ).set( projectObject );
		},
		
		listProjects: function(userId) {
			return FirebaseCollection(FirebaseIO.child('user_profiles/' + userId + '/profile/projects'));
		},
		
		updateProject: function(userId, projectId, projectObject) {
			var id = projectId;
			
			FirebaseIO.child( 'user_profiles/' + userId + '/profile/projects/' + id ).update( projectObject );
			FirebaseIO.child( 'projects/' + userId + "/" + id ).update( projectObject );
		},
	
		update: function(userId, profileObject) {
			//~ if( !isValid(profileObject) ) {
				//~ alert("The form is invalid. Please fix it.");
				//~ return;
			//~ }
			
			FirebaseIO.child('user_profiles/' + userId + '/profile').set(profileObject);
		}
	
	}
});
