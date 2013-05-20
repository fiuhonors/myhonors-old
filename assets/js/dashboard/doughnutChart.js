'use strict';

angular.module('myhonorsDashboard').directive('doughnutChart', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			var parameters = attrs.doughnutChart.split(',');
			var scopeObject = parameters[0];
			var total = parameters[1];

			scope.$watch(scopeObject, function() {
				// calculate total value (we don't want negative numbers)
				var adjustedTotal;
				if (total - scope[scopeObject] >= 0) {
					adjustedTotal = total - scope[scopeObject];
				} else {
					adjustedTotal = 0;
				}

				// for more info on how to structure this array of objects
				// see http://www.chartjs.org/docs/
				var data = [
					{
						value: scope[scopeObject],
						color: '#00baff'
					},
					{
						value: adjustedTotal,
						color: '#dedede'
					}
				];

				var options = {};

				var ctx = element[0].getContext('2d');
				var chart = new Chart(ctx).Doughnut(data, options);
			});
		}
	}
});