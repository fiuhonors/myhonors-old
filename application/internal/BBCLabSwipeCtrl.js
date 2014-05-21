'use strict'

angular.module('myhonorsInternal').controller('BBCLabSwipeCtrl', function($scope, $timeout, FirebaseIO, SwipeService, UserService) {
	$scope.buttons = ['Advising', 'Honors Meeting', 'Use the Computers', 'Study Area', 'Both (computers & study)'];
	$scope.showButtons = false;
	$scope.pageTitle = 'BBC Lab Swipe-In';
	$scope.question = 'What is the PRIMARY reason for your visit?';
	$scope.lastSwipe = false;	// Holds the user profile for the last student who swiped in

	$('input').focus();

	$scope.swipe = function() {
		UserService.exists($scope.data.userId, function(result, userData) {
			if (result === true) {
				$timeout(function() {
					$scope.showButtons = true;
					$scope.error = false;
					$scope.lastSwipe = userData;
				});
			} else {
				$timeout(function() {
					$scope.clear();
					$scope.error = "Swipe failed. Make sure you're using the BLUE STRIP of your FIU card.";
				});
			}
		});
		
	};
	
	

	$scope.save = function(answer) {
		SwipeService.create('bbclabswipe', $scope.data.userId, "bbclabswipe", function(swipeRef) {
			swipeRef.set({time: Date.now(), answer: answer});
		});
		$scope.clear();
		
	};

	$scope.clear = function() {
		$scope.error = $scope.showButtons = $scope.lastSwipe = false;
		$scope.data.userId = '';
		$('input').focus();
	};
});
