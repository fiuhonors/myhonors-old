'use strict'

angular.module('myhonorsInternal').controller('BBCLabSwipeCtrl', function($scope, $timeout, FirebaseIO, SwipeService, UserService) {
	$scope.buttons = ['Advising', 'Honors Meeting', 'Use the Computers', 'Study Area', 'Both (computers & study)'];
	$scope.showButtons = false;
	$scope.pageTitle = 'BBC Lab Swipe-In';
	$scope.question = 'What is the PRIMARY reason for your visit?';

	$scope.swipe = function() {
		FirebaseIO.child('user_profiles/' + $scope.data.userId).once('value', function(snapshot) {
			$timeout(function() {
				if (snapshot.val() !== null) {
					$scope.showButtons = true;
					$scope.error = false;
				} else {
					$scope.clear();
					$scope.error = "Swipe failed. Make sure you're using the BLUE STRIP of your FIU card.";
				}
			});
		});
	};

	$scope.save = function(answer) {
		SwipeService.create('bbclabswipe', $scope.data.userId, "bbclabswipe", function(swipeRef) {
			swipeRef.set({time: Date.now(), answer: answer});
		});
		$scope.clear();
	};

	$scope.clear = function() {
		$scope.error = $scope.showButtons = false;
		$scope.data.userId = '';
		$('input').focus();
	};
});
