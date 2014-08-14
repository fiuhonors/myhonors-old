/*
* jCrop directive taken from: http://stackoverflow.com/questions/14319177/image-crop-with-angularjs
* Some changes were made
*/
'use strict';

angular.module('myhonorsUser').directive('jcrop', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: { src:'@', afterSelection:'&' },
        link: function( scope, element, attrs) {
            var myImg; // Stores the image that is currently being cropped

            // Remove whatever image was passed to jCrop
            var clear = function() {
                if ( myImg ) {
                    myImg.next().remove();
                    myImg.remove();
                    myImg = undefined;
                }
            };

            // Watch if the src property of the jCrop directive changes. If it does, that means a picture was uploaded
            scope.$watch( 'src', function( value ) {        
                clear();

                if ( value ) {
                    element.after('<img />');
                    myImg = element.next();    // Store the newly uploaded image    
                    myImg.attr( 'src', value );

                    $(myImg).Jcrop({
                        trackDocument: true,
                        // Once the user selects a crop section, sent the coordinates to whatever function was passed to afterSelection
                        onSelect: function(x) {            
                          scope.$apply(function() {
                            scope.afterSelection( { cords: x, img: myImg.next() });
                          });
                        },
                        // Minimum size for the cropping must be 140 x 140
                        minSize: [ 140, 140 ],
                        // Mantain the square aspect ratio
                        aspectRatio: 1
                    }); 

                    // If the user passed the following property, center the jCrop div
                    if ( attrs.hasOwnProperty( "jcropCenterImage" ) )
                        centerImage();

                }
            });

            scope.$on('$destroy', clear);

            // Center an image based on the width of the parent div it is enclosed in
            var centerImage = function () {
                var containerWidth = myImg.parent().width();
                var imgWidth = myImg.width();

                /*
                 * Calculate the width of the image is bigger than the container width, then no centering is necessary as the image is taking
                 * as much space as possible. Otherwise, find the difference between the width of the container and the image, divide it by 2 and 
                 * that gives you the number of pixels that must be set for the container's left margin to be horizontally centered.
                 */
                var marginLeft = ( imgWidth > containerWidth ) ? 0 : ( containerWidth - imgWidth ) / 2;
                marginLeft += "px";

                myImg.parent().css( 'margin-left', marginLeft );
            };
        }
    };
});
