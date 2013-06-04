angular.module('myhonors').factory('nowTime', ['$timeout', function($timeout) {
	var nowTime;

	(function updateTime() {
		nowTime = Date.now(); 
		$timeout(updateTime, 1000);
	}());

	return function() {
		return nowTime;
	};
}]);

angular.module('myhonors').filter('timeAgo', ['nowTime', function(nowTime) {
	return function(input) {
		return moment(input).from(nowTime());
	};
}]);