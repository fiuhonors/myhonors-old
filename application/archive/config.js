angular.module('myhonorsArchive').config([ '$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/archive', {
    templateUrl: 'application/archive/archive.html',
    controller: 'ArchiveCtrl',
    requireLogin: true,
    resolve: appResolve}).
    when('/archive/videoplayer/:videolink', {
      templateUrl: 'application/archive/videoplayer.html',
      controller: 'VideoCtrl',
      requireLogin: true,
      resolve: appResolve})
}]);
