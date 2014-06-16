<?php

require_once "../../config.php"; // Include all the necessary Firebase config variables
include_once "../../auth/FirebaseToken.php";
require_once '../lib/firebaseLib/firebaseLib.php';


if ( empty( $_FILES[ "file" ] ) || $_FILES[ "file" ][ "error" ] != UPLOAD_ERR_OK ) {
	$result = array( 'success' => false, 'error' => 'A problem ocurred when uploading the files.' );
	echo json_encode( $result );
	die();
}

$pid = $_REQUEST[ "userId" ];
$path = $_REQUEST[ "path" ] . $_REQUEST[ "itemIndex" ] . '/';


error_log("Path: " . $path);

$file_name = $_FILES[ "file" ][ "name" ];
$tmp_name = $_FILES[ "file" ][ "tmp_name" ];
$file_mimetype = $_FILES[ "file" ][ "type" ]; // Returns the mimetype

/* Check file mimetype and type */

$allowed_mimetypes = array( "image/jpeg", "image/gif", "application/pdf", "image/png" );
$allowed_types = array( ".jpg", ".gif", ".pdf", ".png" );

$valid_type = false;

// Check that the type of the file is allowed using Regex
foreach ( $allowed_types as $type ) {
	if ( preg_match( "/$type\$/i", $file_name ) )
		$valid_type = true;
}

// Check if the mimetype of the file is allowed
if ( in_array( $file_mimetype, $allowed_mimetypes ) )
	$valid_type = true;

if( ! $valid_type ) {
	$result = array( 'success' => false, 'error' => 'Only JPG, GIF, PDF and PNG file formats are allowed.' );
	echo json_encode( $result );
	die();
}

//$md5_name = md5( $file_name );
//error_log( $md5_name );

$upload_path = $_SERVER[ 'DOCUMENT_ROOT' ] . '/uploads/' . $path;

if ( ! file_exists( $upload_path ) && ! is_dir( $upload_path ) ) {
    mkdir( $upload_path, 0777, true );         
} 

$upload_success = move_uploaded_file( $tmp_name, $upload_path . $file_name );

if ( ! $upload_success ) {
	$result = array( 'success' => false, 'error' => 'A problem ocurred when uploading the file.' );
	echo json_encode( $result );
	die();
}


updateFirebase( $path, '/uploads/' . $path , $file_name );

//chmod( $path . $file_name , 644); // Set the file permission to not executable

error_log( $tmp_name . ' was moved to ' . $path );


$result = array( 'success' => true );
echo json_encode( $result );


function updateFirebase( $firebase_path, $upload_path, $file_name ) {
    error_log( 	$firebase_path . $file_name );
    
    $tokenGen   = new Services_FirebaseTokenGenerator( FIREBASE_SECRET );
    $temp_token = $tokenGen->createToken( array(), array(
        'admin' => true
    ));
    
    
    $file_info = array( "filename" => $file_name, "url" => $upload_path . $file_name, "createdAt" => round( microtime( true ) * 1000 ) );
    
    $fb = new fireBase( FIREBASE_USERS_URL, $temp_token );
	$fb->set( $firebase_path, $file_info );
}


?>
