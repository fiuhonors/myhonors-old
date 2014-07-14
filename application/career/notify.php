<?php

/*
 * The following script sends a confirmation email to the specified Honors College staff to accept or decline the newly added internship.
 * This is necessary because the internship-adding page is public facing, meaning that anyone can add an internship.
 */

require_once "../../config.php"; // Include all the necessary Firebase config variables
require_once "../../auth/FirebaseToken.php";

define( "DISABLE_EMAIL", true );	// Enable for testing purposes


if ( $_SERVER[ 'REQUEST_METHOD' ] === 'POST' ) {
	
	// All output after POSTing will be delivered in JSON format
	header( 'Content-Type: application/json' );
	
	if ( !isset( $_POST[ 'companyName' ] ) ||
		 !isset( $_POST[ 'description' ] ) ) 
	{
			
			$result = array( 'success' => false, 'error' => "All the form fields must be completed." );
			echo json_encode( $result );
			die();
	}
	
	
	// email fields: to, from, subject, and so on
	$to = "Isabel Green <igreen@fiu.edu>";
	$from = "fiuhonorstechteam@gmail.com"; 
	$subject ="myHonors: New Intership Added"; 
	$message = '
	<html>
	<head>
	<title>New Internship Added</title>
	</head>
	<body>
	
	<p> The following internship has been added: </p>
	
	<p><b>Company Name: </b>' . $_POST[ 'companyName' ] . '</p>
	<p><b>Description: </b>' . $_POST[ 'description' ] . '</p>
	
	<p> The internship is pending your approval. Please login to myHonors to approve it. </p>
	
	</body>
	</html>
	';
	
	// To send HTML mail, the Content-type header must be set
	$headers  = 'MIME-Version: 1.0' . "\r\n";
	$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
	
	if ( DISABLE_EMAIL ) {
		
		$result = array( 'success' => false, 'error' => "Email has been disabled." );
		echo json_encode( $result );
		
	} 
	else {
		$email_sent = mail( $to, $subject, $message, $headers ); 
		
		if ( !$email_sent ) {
			$result = array( 'success' => false, 'error' => "A problem ocurred when attemtping to submit your application." );
			echo json_encode( $result );
			die();
		}
		
		$result = array( 'success' => true );
		echo json_encode( $result );
	}
	
}

?>
