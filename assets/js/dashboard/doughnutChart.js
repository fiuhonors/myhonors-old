'use strict';

angular.module('myhonorsDashboard').directive('doughnutChart', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			// for more info, see http://www.chartjs.org/docs/
			var data = [
				{
					value: parseInt(attrs.has, 10),
					color: '#00baff'
				},
				{
					value: parseInt(attrs.needs, 10),
					color: '#dedede'
				}
			];

			var options = {};

			var ctx = element[0].getContext('2d');
			var chart = new Chart(ctx).Doughnut(data, options);
		}
	}
});