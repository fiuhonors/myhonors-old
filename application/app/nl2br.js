'use strict';

/* Filter used to transform newline characters ( \n ) to <br> tags */

angular.module('myhonorsConfig').filter('nl2br', function(){
      return function(text) {
           return text.replace(/\n/g, '<br/>');
      };
});
