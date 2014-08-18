'use strict';

angular.module( 'myhonorsEvents' ).factory( 'ClubService', [ '$http', '$q', 'FirebaseIO', 'FirebaseCollection', function( $http, $q, FirebaseIO, FirebaseCollection ) {
    return {
        create: function( ) { },
        
        addEventToClub: function( clubId, eventId ) {
            FirebaseIO.child( 'clubs/' + clubId + "/events/" ).push( eventId );
        },
        
        read: function( ) { },
        
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
        
        delete: function( ) { }
    }
}]);