<?php

require_once "../../config.php"; // Include all the necessary Firebase config variables
include_once "../../auth/FirebaseToken.php";
require_once '..//lib/firebaseLib/firebaseLib.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	//error_log("-----------------------------------------");
	$tokenGen   = new Services_FirebaseTokenGenerator(FIREBASE_SECRET);
    // Create a temporary admin token to access the admin users/roles in the 'settings' area of our Firebase
    $temp_token = $tokenGen->createToken(array(), array(
        'admin' => true
    ));

    $waitingList = json_decode(file_get_contents("php://input"), true); 
    //error_log(print_r($waitingList,true));
    
    $eventId = $waitingList["eventId"];
    $rsvpsNum = $waitingList["rsvpsNum"];
    $userId = $waitingList["userId"];
    //error_log("User id: " . $userId);
    //error_log("RSVPS Num: " . $rsvpsNum);
    
    unset($waitingList["eventId"],$waitingList["rsvpsNum"],$waitingList["userId"]);
    
    asort($waitingList);
    
    //error_log(print_r($waitingList,true));
    
    $index = 1;
    foreach ($waitingList as $pantherID => $joinTime) {
		//error_log("Panther ID: " . $pantherID . "   Time: " . $joinTime);
		if ($index <= $rsvpsNum) {
			$fb = new fireBase(FIREBASE_EVENTS_URL, $temp_token);
			$path = $eventId . "/waitingList/" . $pantherID;
			$fb->delete($path);
			
			$path = $eventId . "/rsvps/" . $pantherID;
			$fb->set($path, array( "guests" => 0, "time" => $joinTime));			
			
			$fb = new fireBase(FIREBASE_USERS_URL, $temp_token);
			$path = $pantherID . "/waitingList/" . $eventId;
			$fb->delete($path);
			
			$fb = new fireBase(FIREBASE_USERS_URL, $temp_token);
			$path = $pantherID . "/rsvps/" . $eventId;
			$fb->set($path, array( "guests" => 0, "time" => $joinTime));	

		} 
		
		$index++;
	}
    
    
			
    			
			$fb = new fireBase(FIREBASE_USERS_URL, $temp_token);
			$path = $userId . "/dummy";
			$fb->set($path, "dummy");
			
			$fb->delete($path);	

}


?>
