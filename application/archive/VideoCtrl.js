'use strict';

angular.module('myhonorsArchive').controller('VideoCtrl', ['$scope', '$routeParams', '$timeout','FirebaseIO', function($scope, $routeParams, $timeout, FirebaseIO) {

  var ref = FirebaseIO.child('/archive/' + $routeParams.videolink);
  ref.once('value', function(snapshot) {
    $timeout(function () {
      $scope.videolink = snapshot.val()['videolink'];
    });
  });
}]);
