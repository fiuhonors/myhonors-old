'use strict';

angular.module('myhonorsUser').directive('jcrop', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: { src:'@', afterSelection:'&' },
    link: function( scope, element, attrs) {
      var myImg;
        
      var clear = function() {
        if ( myImg ) {
          myImg.next().remove();
          myImg.remove();
          myImg = undefined;
        }
      };
        
      scope.$watch( 'src', function( value ) {        
        clear();
          
        if ( value ) {
          element.after('<img />');
          myImg = element.next();        
          myImg.attr( 'src', value );
            
          $(myImg).Jcrop({
            trackDocument: true,
            onSelect: function(x) {              
              scope.$apply(function() {
                scope.afterSelection({cords: x});
              });
            },
            minSize: [ 140, 140 ],
            aspectRatio: 1
          });
            
        }
      });
      
      scope.$on('$destroy', clear);
    }
  };
});
