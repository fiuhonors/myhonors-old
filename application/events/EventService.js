'use strict'

angular.module('myhonorsEvents').factory('EventService', function($q, FirebaseIO, FirebaseCollection, UserService, ClubService) {
 	// since we don't need to execute this every time getTypes() is called, we can
 	// create a single collection (that lives with the singleton service) here
 	var typesRef = FirebaseIO.child('system_settings/eventTypes');
 	var eventTypes = FirebaseCollection(typesRef);

	return {
		create: function(eventObject) {
			if (!angular.isString(eventObject.name) ||
				!angular.isObject(eventObject.date) ||
				!angular.isNumber(eventObject.date.starts) ||
				!angular.isNumber(eventObject.date.ends) ||
				!angular.isObject(eventObject.location) ||
				!angular.isString(eventObject.location.name) ||
				!angular.isArray(eventObject.types)
			) {
				return;
			}
            
			// setting the priority to the date.ends value allows us to show an event that is currently
			// taking place in any 'Upcoming Events' section
			var ref = FirebaseIO.child('events').push(eventObject);
            
                        ref.setPriority(eventObject.date.ends);

                        var eventId = ref.name();

                        // If the event creation was succesful and the event is associated to a club, update the club's node to have this event
                        if ( eventId && eventObject.hasOwnProperty( "club" ) && eventObject.club.length ){
                            ClubService.addEventToClub( eventObject.club, eventId );
                        }
		},
        
		read: function(eventId, onComplete) {
			var deferred = $q.defer();

			FirebaseIO.child('events/' + eventId).on('value', function(snapshot) {
				if (snapshot.val() === null) {
					// event was deleted, do nothing
					return;
				}

				var data = snapshot.val();
				data.id = snapshot.name();
				data.comments = snapshot.child('comments').numChildren();
				data.attendance = snapshot.child('attendance').numChildren();
				data.usersAttended = snapshot.hasChild('attendance') ? snapshot.child('attendance') : null;
				
				// calculate the total number of RSVPs
				data.rsvps = snapshot.child('rsvps').numChildren();
				snapshot.child('rsvps').forEach(function(snapshot) {
					data.rsvps += snapshot.child('guests').val();
				});
				


				if (angular.isFunction(onComplete)) {
					onComplete(data);
				}

				deferred.resolve(data);	
			});

			return deferred.promise;
		},

		/**
		 * Returns a FirebaseCollection of events
		 *
		 * @param options Object	Can have limit, startAt, and endAt properties
		 */
		list: function(options) {
			var eventsRef = FirebaseIO.child('events');

			var options = options || {};
			if (options.startAt) eventsRef = eventsRef.startAt(options.startAt);
			if (options.endAt)   eventsRef = eventsRef.endAt(options.endAt);
			if (options.limit)   eventsRef = eventsRef.limit(options.limit);

			return FirebaseCollection(eventsRef, {metaFunction: function(doAdd, snapshot) {
				var extraData = {
					id: snapshot.name(),
					rsvps: snapshot.child('rsvps').numChildren(),
					attendance: snapshot.child('attendance').numChildren(),
					comments: snapshot.child('comments').numChildren(),
					numWaitingList: snapshot.child('waitingList').numChildren()
				};

				// add all the guests to the total number of RSVPs
				snapshot.child('rsvps').forEach(function(childSnapshot) {
					extraData.rsvps += childSnapshot.child('guests').val();
				});


                // Determines the color of the label for this event when displayed in
                // the calendar. This is done by checking the event type.
                var thisEventType = snapshot.child('types').val();
                thisEventType = (thisEventType != null) ? thisEventType[0] : '';
                for (var i = 0; i < eventTypes.length; ++i) {
                    if (thisEventType === eventTypes[i].name) {
                        extraData.color = eventTypes[i].color;
                        break;
                   }
                }
 
				doAdd(snapshot, extraData);
			}});
		},

		/**
		 * Updates an event
		 */
		update: function(eventId, eventObject) {
			if (!angular.isString(eventObject.name) ||
				!angular.isObject(eventObject.date) ||
				!angular.isNumber(eventObject.date.starts) ||
				!angular.isNumber(eventObject.date.ends) ||
				!angular.isObject(eventObject.location) ||
				!angular.isString(eventObject.location.name) ||
				!angular.isArray(eventObject.types)
			) {
				// invalid input, do nothing
				return;
			}

                        // go through each property in the object and add that specifically, this prevents
                        // us from overwriting the entire /events/eventId location (which prevents us from
                        // deleting the RSVPs, attendance, comments, etc.)
                        angular.forEach(eventObject, function(value, key) {
                            FirebaseIO.child('events/' + eventId + '/' + key).set(value);
                        }); 

			// setting the priority to the date.ends value allows us to show an event that is currently
			// taking place in any 'Upcoming Events' section
			FirebaseIO.child('events/' + eventId).setPriority(eventObject.date.ends);
		},

		delete: function( eventObject ) {
            if ( eventObject.hasOwnProperty( 'club' ) )
                ClubService.removeEventFromClub( eventObject.club, eventObject.id );
            
            if ( eventObject.usersAttended ) {
              // Iterate through the event's attendance and delete the event from each user's attendance node
                angular.forEach( eventObject.usersAttended.val(), function( value, userId ) {
                    FirebaseIO.child( 'user_profiles/' + userId + '/attendance/' + eventObject.id ).remove();
                  });
            }

            FirebaseIO.child( 'events/' + eventObject.id ).remove();
		},

		/**
		 * Get a list of different event types
		 */
		 getTypes: function() {
			return eventTypes;
		 }
	}
});
