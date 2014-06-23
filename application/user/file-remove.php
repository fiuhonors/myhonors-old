<?php

require_once "../../config.php"; //Include all the necessary Firebase config variables
include_once "../../auth/FirebaseToken.php";
require_once '../lib/firebaseLib/firebaseLib.php';
    

if ( $_SERVER[ 'REQUEST_METHOD' ] !== 'POST' ) {
    $result = array( 'success' => false, 'error' => "A problem ocurred when removing the file." );
    echo json_encode( $result );
    die();
}

if ( !isset( $_POST[ 'pathToAsset' ] ) ) {
    $result = array( 'success' => false, 'error' => "The path to the file is not defined." );
    echo json_encode( $result );
    die();
}

$pathToAsset = $_POST[ 'pathToAsset' ];

if ( !startsWith( $pathToAsset, '/uploads/' ) ) {
    $result = array( 'success' => false, 'error' => "The path to the file is not properly formatted." );
    echo json_encode( $result );
    die();
}

$pathToAsset = $_SERVER[ 'DOCUMENT_ROOT' ] . $pathToAsset;

if ( is_readable( $pathToAsset ) ) 
	$file_deleted = unlink( $pathToAsset );
	
if ( $file_deleted ) {
	$result = array( 'success' => true );
	echo json_encode( $result );	
}



function startsWith( $word, $sub_word ) {
     $length = strlen( $sub_word );
     return ( substr( $word, 0, $length ) === $sub_word );
}


?>
