<?php

/**
 * The following php file is used when some RSVPs and then remove it, or the max number of RSVPs changes. The users in the waiting list are
 * then added to the RSVPs according to however many new opnening were opened and they are then notified by email.
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
   // $waitingList = json_decode(file_get_contents(FIREBASE_EVENTS_URL . $eventId . '/waitingList.json?auth=' . $temp_token), true);
    $eventInfo = json_decode(file_get_contents(FIREBASE_EVENTS_URL . $eventId . '.json?auth=' . $temp_token), true);
    $waitingList = $eventInfo["waitingList"];

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
			
			// An email notification is sent to the user to inform him that he has been added to the RSVP list
			$userInfo = getUserInfo($pantherID, $temp_token);
            sendEmailNotification($userInfo, $eventInfo);
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

function getUserInfo($pantherId, $temp_token) {
    $userInfo = json_decode((file_get_contents(FIREBASE_USERS_URL . $pantherId . '.json?auth=' . $temp_token)), true);
    return $userInfo;
}

function sendEmailNotification($userInfo, $eventInfo) {
    /* Email variables are set below */
    $to  = $userInfo['email'];
    //$to = 'fiuhonorstechteam@gmail.com';
    
    // subject
    $subject = 'Honors Event RSVP Update';
    
    // message
    $message = '
    <html>
    <head>
    <title>Honors Event RSVP Update</title>
    </head>
    <body>
    <p>Dear ' . $userInfo["fname"] . ' ' . $userInfo["lname"] . ',</p>
    
    <p>Good news! A spot has opened in the event <b>' . $eventInfo["name"] . '</b> and you have been atuomatically moved from the waiting list to the RSVP list.</p>
    
    <p>
    The Honors College at FIU <br>
    <a href="mailto:honors@fiu.edu">honors@fiu.edu</a> <br>
    Phone: (305) 348-4100
    </p>
    </body>
    </html>
    ';
    
    // To send HTML mail, the Content-type header must be set
    $headers  = 'MIME-Version: 1.0' . "\r\n";
    $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
    
    // Additional headers
    $headers .= 'To: ' . $userInfo["fname"] . ' ' . $userInfo["lname"] . ' <' . $userInfo["email"] . '>' . "\r\n";
    //$headers .= 'To: ' . $userInfo['fname'] . ' <fiuhonorstechteam@gmail.com>' . "\r\n";
    $headers .= 'From: The Honors College <honors@fiu.edu>' . "\r\n";
    
    $email_sent = mail($to, $subject, $message, $headers); 
    
    if (!$email_sent) {
        $result = array('success' => false, 'error' => "A problem ocurred when attemtping to submit your application.");
        echo json_encode($result);
        die();
    }
    
    $result = array('success' => true);
    echo json_encode($result);
    
}


?>
