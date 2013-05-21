'use strict';

angular.module('myhonorsDashboard').directive('doughnutChart', ['$parse', function($parse) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			var parameters = attrs.doughnutChart.split(',');
			var expression = parameters[0];
			var total = parameters[1];
			var model = $parse(expression);

			scope.$watch(expression, function() {
				var current = model(scope);

				// calculate total value (we don't want negative numbers)
				var adjustedTotal;
				if (total - current >= 0) {
					adjustedTotal = total - current;
				} else {
					adjustedTotal = 0;
				}

				// for more info on how to structure this array of objects
				// see http://www.chartjs.org/docs/
				var data = [
					{
						value: current,
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
}]);