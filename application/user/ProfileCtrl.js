'use strict';

angular.module('myhonorsUser').controller('ProfileCtrl', function EventBrowseCtrl($scope, $rootScope, $routeParams, $location, $timeout, FirebaseIO, UserService, ProfileService) {
	$scope.pid = $routeParams.userId;
	$scope.isAbleEdit = ($scope.pid == UserService.profile.id || UserService.auth.isStaff) ? true : false;	// Boolean that determines whether the user can edit this profile or not
	$scope.projects = ProfileService.listProjects($scope.pid); // Collection of the sudent's projects
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
	
	// Load the student's info and profile	
	UserService.exists($routeParams.userId, function(exists, result) {
		$timeout(function() {
			if (exists) {
				$scope.user = jQuery.extend(true, $scope.user, result);
			}
			console.log($scope.user);
		});
		
	});
	
	

	/* Project Categories */
	$scope.projectCategories = [];
	
	FirebaseIO.child('system_settings/projectCategories').once( 'value', function( snapshot ) {
		angular.forEach( snapshot.val(), function( value, key ) {
			$scope.projectCategories.push( value );
		});
	});
	
	$scope.chooseLabel = function( chosenCategory ) {
		var label;
		$scope.projectCategories.forEach( function( category ) { 
			if ( category.name === chosenCategory ) 
				label = category.label;
		});
		
		return "label label-" + label;
	};
	


	
	
	$scope.updateProfile = function() {		
		// We pass a copy of the profile object to eliminate the $$hashKey property that cause ng-repeat to stop working
		ProfileService.update($scope.pid, angular.copy($scope.user.profile));
	};
	
	/* Methods that handle the Interests and Organizations list */

	$scope.addItemToList = function(array) {
		array.push({value: "New item"});
		$scope.updateProfile();
	};
	
	$scope.removeItemAtIndex = function(array,index) {
		array.splice(index,1);
		$scope.updateProfile();
	};
	
	
	/* Project functionality and modal settings */
	
	$scope.currentProject = {};	// Holds the info for the project that is being added or edited

	$scope.modalOpts = {
		backdropFade: true,
		dialogFade: true
	};

	$scope.showModal = function() {
		$scope.showProjectModal = true;
	};

	$scope.closeModal = function() {
		$scope.showProjectModal = false;
		$scope.currentProject = {};
		$scope.newProject = false;
	};

	$scope.newProjectModal = function() {
		$scope.newProject = true;
		$scope.showModal();
	};

	$scope.addProject = function(form) {
		if (form.$invalid) {
			return;
		}
		
		$scope.currentProject.createdAt = Date.now();
		ProfileService.addProject($scope.pid, $scope.currentProject);
		$scope.closeModal();
	};
	
	$scope.editProject = function(project) {
		$scope.currentProject = project;
		$scope.showModal();
	};
	
	$scope.updateProject = function(form) {
		if (form.$invalid) {
			return;
		}

		
		var project = {
			title: $scope.currentProject.title,
			category: $scope.currentProject.category,
			description: $scope.currentProject.description,
			editedAt: Date.now()
		}
		
		var projectId = $scope.currentProject.$id;
		
		ProfileService.updateProject($scope.pid, projectId, project);

		$scope.closeModal();
	};
});
