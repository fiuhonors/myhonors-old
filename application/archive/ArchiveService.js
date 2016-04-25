'use strict'

angular.module('myhonorsArchive').factory('ArchiveService', function(FirebaseIO, FirebaseCollection){

  function checkInput(video) {
    if(!angular.isString(video.title) ||
       !angular.isString(video.date) ||
       !angular.isString(video.videolink) ||
       !angular.isString(video.desc) ||
       !angular.isString(video.thumbnail) ||
       !angular.isString(video.survey) ){
      return false;
    } else {
      return true;
    }
  }

    return {
      list: function () {
        var ref = FirebaseIO.child('archive');
        return FirebaseCollection(ref , {metaFunction: function(doAdd, snapshot) {
  				var extraData = {
            id: snapshot.name(),
  					title: snapshot.val()['title'],
            date: snapshot.val()['date'],
            desc: snapshot.val()['desc'],
            eventType: snapshot.val()['eventType'],
            numPoints: snapshot.val()['numPoints'],
            thumbnail: snapshot.val()['thumbnail'],
            videolink: snapshot.val()['videolink'],
            survey: snapshot.val()['survey'],
            deadline: snapshot.val()['deadline']
  				};
  				doAdd(snapshot, extraData);
  			}});
      },

      edit: function(video, edit) {
        angular.forEach(edit, function(value, key) {
          if(value.length > 0)
  				    FirebaseIO.child('archive/' + video['createdAt'] + '/' + key).set(value);
  			});
        //FirebaseIO.child('archive/' + video['createdAt'] + '/' + 'survey').set(editSurvey);
      },

      submit: function(video) {
        if(checkInput(video)){
          video.createdAt = Date.now();
          var ref = FirebaseIO.child('archive/' + video.createdAt);
          // Setting the priority to -(current time) causes the list to be ordered from newest added to oldest
          ref.setWithPriority(video, -video.createdAt);
        return ref.name();	// Return the ID of the newly created position
      } else {
        alert('Not all fields have been filled.');
      }
    },

    delete: function(video) {
        FirebaseIO.child('archive/' + video['createdAt']).remove();
    }

    };
});
