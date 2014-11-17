'use strict';

angular.module( 'myhonorsEvents' ).factory( 'ClubService', [ '$http', '$q', 'FirebaseIO', 'FirebaseCollection', function( $http, $q, FirebaseIO, FirebaseCollection ) {
    return {
        create: function( ) { },
        
        addEventToClub: function( clubId, eventId ) {
            FirebaseIO.child( 'clubs/' + clubId + '/events/' + eventId ).set( eventId );
        },
        
        removeEventFromClub: function( clubId, eventId ) {
            FirebaseIO.child( 'clubs/' + clubId + '/events/' + eventId ).remove();  
        },
        
        /********* THIS METHOD HAS NOT BEEN TESTED ************/ 
		read: function( clubId, onComplete ) {
			var deferred = $q.defer();

			FirebaseIO.child( 'clubs/' + clubId ).on( 'value', function( snapshot ) {
				if ( snapshot.val() === null ) {
					// Club  was deleted, do nothing
					return;
				}

				var data = snapshot.val();

				deferred.resolve( data );	
			});

			return deferred.promise;
		},

        list: function( options ) {
			var clubsRef = FirebaseIO.child( 'clubs' );

			var options = options || {};
			if ( options.startAt ) eventsRef = eventsRef.startAt(options.startAt);
			if ( options.endAt )   eventsRef = eventsRef.endAt(options.endAt);
			if ( options.limit )   eventsRef = eventsRef.limit(options.limit);

			return FirebaseCollection( clubsRef, { metaFunction: function( doAdd, snapshot ) {
				var extraData = {
					id: snapshot.name()
				};
                
				doAdd( snapshot, extraData );
			}});
		},
        
        update: function( ) { },
        
        delete: function( clubdId, eventId ) { 
            
        },

        isClubMod: function( clubId, userId ) {
            var deferred = $q.defer();

            FirebaseIO.child( 'clubs/' + clubId + '/clubMods/' + userId ).once( 'value', function ( snapshot ) {
                var isMod = ( snapshot.val() != null );
                deferred.resolve( isMod );
            });

            return deferred.promise;
        }
    }
}]);
