<?php

require_once "../../config.php"; //Include all the necessary Firebase config variables
include_once "../../auth/FirebaseToken.php";
require_once '../lib/firebaseLib/firebaseLib.php';
    

if ( $_SERVER[ 'REQUEST_METHOD' ] !== 'POST' ) {
    $result = array( 'success' => false, 'error' => "A problem ocurred when removing the file." );
    echo json_encode( $result );
    die();
}

if ( !isset( $_POST[ 'pathToFile' ] ) ) {
    $result = array( 'success' => false, 'error' => "The path to the file is not defined." );
    echo json_encode( $result );
    die();
}

$pathToFile = $_POST[ 'pathToFile' ];

if ( !startsWith( $pathToFile, '/uploads/' ) ) {
    $result = array( 'success' => false, 'error' => "The path to the file is not properly formatted." );
    echo json_encode( $result );
    die();
}

$pathToFile = $_SERVER[ 'DOCUMENT_ROOT' ] . $pathToFile;

$file_deleted = NULL;

if ( is_readable( $pathToFile ) ) 
	$file_deleted = unlink( $pathToFile );
	
if ( $file_deleted ) {
	$result = array( 'success' => true );
	echo json_encode( $result );	
}



function startsWith( $word, $sub_word ) {
     $length = strlen( $sub_word );
     return ( substr( $word, 0, $length ) === $sub_word );
}


?>
