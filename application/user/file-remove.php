<?php

/*
 * The following script removes a file from the server given a path
 */

require_once "../../config.php"; //Include all the necessary Firebase config variables
require_once "../../auth/FirebaseToken.php";
require_once '../lib/firebaseLib/firebaseLib.php';
    
// Ensure that a POST request was received
if ( $_SERVER[ 'REQUEST_METHOD' ] !== 'POST' ) {
    $result = array( 'success' => false, 'error' => "A problem ocurred when removing the file." );
    echo json_encode( $result );
    die();
}

// Ensure that the necessary variables were sent along with the request
if ( !isset( $_POST[ 'pathToFile' ] ) ) {
    $result = array( 'success' => false, 'error' => "The path to the file is not defined." );
    echo json_encode( $result );
    die();
}

// The path to the actual file in the server
$pathToFile = $_POST[ 'pathToFile' ];

// For security reasons, ensure that the path of the file starts with 'uploads/' so only files in that folder can be deleted
if ( !startsWith( $pathToFile, '/uploads/' ) ) {
    $result = array( 'success' => false, 'error' => "The path to the file is not properly formatted." );
    echo json_encode( $result );
    die();
}

// Get the absolute path to the file in the server
$pathToFile = $_SERVER[ 'DOCUMENT_ROOT' ] . $pathToFile;

$file_deleted = NULL;

// Check if the file is readable and if so, delete it
if ( is_readable( $pathToFile ) ) 
	$file_deleted = unlink( $pathToFile );
	
if ( $file_deleted ) {
	$result = array( 'success' => true );
	echo json_encode( $result );	
}


/*
 * Function that determines whether a String starts with the specified substring
 */
function startsWith( $word, $sub_word ) {
     $length = strlen( $sub_word );
     return ( substr( $word, 0, $length ) === $sub_word );
}


?>
