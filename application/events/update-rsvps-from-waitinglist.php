<?php

/**
 * The following php file is used when some RSVPs and then remove it, or the max number of RSVPs changes. The users in the waiting list are
 * then added to the RSVPs according to however many new opnening were opened.
 */

require_once "../../config.php"; // Include all the necessary Firebase config variables
include_once "../../auth/FirebaseToken.php";
require_once '../lib/firebaseLib/firebaseLib.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	$tokenGen   = new Services_FirebaseTokenGenerator(FIREBASE_SECRET);
    $temp_token = $tokenGen->createToken(array(), array(
        'admin' => true
    ));

    $info = json_decode(file_get_contents("php://input"), true); 
    
    $eventId = $info["eventId"];
    $openings = $info["openings"];	// New openings for users in the waiting list to be added
    $userId = $info["userId"];

    // Get all users in waiting list
    $waitingList = json_decode(file_get_contents(FIREBASE_EVENTS_URL . $eventId . '/waitingList.json?auth=' . $temp_token), true);

    // Sort waiting list by the time the users joined the list
    asort($waitingList);
    
    
    $index = 1;
    foreach ($waitingList as $pantherID => $joinTime) {	// Loop through all the users in the waiting list
		//error_log("Panther ID: " . $pantherID . "   Time: " . $joinTime);
		if ($index <= $openings) {
			// Delete the user's record in the event's waiting list
			$fb = new fireBase(FIREBASE_EVENTS_URL, $temp_token);
			$path = $eventId . "/waitingList/" . $pantherID;
			$fb->delete($path);
			
			// Set the RSVP for the user in the event's profile
			$path = $eventId . "/rsvps/" . $pantherID;
			$fb->set($path, array( "guests" => 0, "time" => $joinTime));			
			
			// Delete the user's record in the user's profile waiting list
			$fb = new fireBase(FIREBASE_USERS_URL, $temp_token);
			$path = $pantherID . "/waitingList/" . $eventId;
			$fb->delete($path);
			
			// Set the RSVP for the user in his profile
			$fb = new fireBase(FIREBASE_USERS_URL, $temp_token);
			$path = $pantherID . "/rsvps/" . $eventId;
			$fb->set($path, array( "guests" => 0, "time" => $joinTime));	

		} 
		
		$index++;
	}
    
    
	/*
	 * The following code is needed as a work around. Due to Sergio's code in application/app.js, the last accessed profile in Firebase 
	 * becomes the current logged in user. So if Alice RSVPs, Bob joins the waiting list and then Alice removes the RSVP, Alice's profile
	 * info is replaced by Bob's for the current session. To avoid this, we set a dummy field in Alice's profile in Firebase and then 
	 * delete it.
	 * 
	 * TODO Talk with Sergio about the code's logic to see if we can remove this ugly workaround
	 */
	$fb = new fireBase(FIREBASE_USERS_URL, $temp_token);
	$path = $userId . "/dummy";
	$fb->set($path, "dummy");
	
	$fb->delete($path);	

}


?>
