'use strict';

angular.module('myhonorsUser').directive('xeditable', function($timeout, $compile) {
    return {
        restrict: 'A',
        require: "ngModel",
        link: function(scope, element, attrs, ngModel) {
            var loadXeditable = function() {
                angular.element(element).editable({
					savenochange: true // The save trigger is executed even if the input is blank
				});
                
                angular.element(element).on('shown', function(e, editable) {
					if (editable)
						editable.input.$input.val(ngModel.$viewValue);
				});
                
                // Call when the user saves an edit
                angular.element(element).on('save', function(e, params) {
					ngModel.$setViewValue(params.newValue);	// Set the element value to the new updated value
					scope.$apply(attrs.xeditable); // Call whatever function that updates the profile is passed as parameter
					e.stopImmediatePropagation(); // Prevents the URLs for the icons being show instead of the icons when an edit is made
				});
				
				
            };
            
            $timeout(function() {
				// Only load X-Editable if the user has permission to edit
				if (scope.isAbleEdit) {
					loadXeditable();
				}
            }, 10);
        }
    };
});
