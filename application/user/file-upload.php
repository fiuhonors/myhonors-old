<?php

require_once '../../config.php'; // Include all the necessary Firebase config variables
require_once '../../auth/FirebaseToken.php';
require_once '../lib/firebaseLib/firebaseLib.php';
require_once 'file-validation.php';

// Check that the file was uploaded without errors and all the required data was sent
if ( empty( $_FILES[ 'file' ] ) || $_FILES[ 'file' ][ 'error' ] != UPLOAD_ERR_OK 
    || !isset( $_REQUEST[ 'userId' ] ) 
    || !isset( $_REQUEST[ 'path' ] ) ) {
	$result = array( 'success' => false, 'error' => 'A problem ocurred when uploading the file: ' .  $_FILES[ "file" ][ "name" ] );
	echo json_encode( $result );
	die();
}

$userId = $_REQUEST[ "userId" ];
$path = $_REQUEST[ "path" ] . $_REQUEST[ "itemIndex" ] . '/';

$file_name = $_FILES[ "file" ][ "name" ];
$tmp_name = $_FILES[ "file" ][ "tmp_name" ];
$file_mimetype = $_FILES[ "file" ][ "type" ];

uploadFile( $userId, $path, $file_name, $tmp_name, $file_mimetype );

updateFirebase( FIREBASE_USERS_URL . $path, '/uploads/' . $path , $file_name );

// TODO Fix project's node data
updateFirebase( FIREBASE_PROJECTS_URL . $path, '/uploads/' . $path , $file_name );

function uploadFile( $userId, $path, $file_name, $tmp_name, $file_mimetype ) {

//    $isImgValid = validateImage( $file_name, $file_mimetype );

//    if( ! $isImgValid ) {
//        $result = array( 'success' => false, 'error' => 'Only JPG, GIF and PNG pciture formats are allowed.' );
//        echo json_encode( $result );
//        die();
//    }
    
    // TODO add document file validation

    //$md5_name = md5( $file_name );
    //error_log( $md5_name );

    // Path were the file will be stored in the system
    $upload_path = $_SERVER[ 'DOCUMENT_ROOT' ] . '/uploads/' . $path;

    // If the upload path does not exist, create the necessary folders
    if ( ! file_exists( $upload_path ) && ! is_dir( $upload_path ) ) {
        mkdir( $upload_path, 0777, true );         
    } 

    // Save the file
    $upload_success = move_uploaded_file( $tmp_name, $upload_path . $file_name );

    // Check if the save was succesful or not
    if ( ! $upload_success ) {
        $result = array( 'success' => false, 'error' => 'A problem ocurred when uploading the file: ' . $file_name );
        echo json_encode( $result );
        die();
    }

    //chmod( $path . $file_name , 644); // Set the file permission to not executable

    $result = array( 'success' => true );
    echo json_encode( $result );
}


function updateFirebase( $firebase_path, $upload_path, $file_name ) {
    $tokenGen   = new Services_FirebaseTokenGenerator( FIREBASE_SECRET );
    $temp_token = $tokenGen->createToken( array(), array(
        'admin' => true
    ));
    
    // Store the file's info into an array
    $file_info = array( "filename" => $file_name, "url" => $upload_path . $file_name, "createdAt" => round( microtime( true ) * 1000 ) );
    
//    $fb = new fireBase( FIREBASE_USERS_URL, $temp_token );
//	$fb->update( $firebase_path, $file_info );
    
    $fb = new fireBase( $firebase_path, $temp_token );
	$fb->update( '', $file_info );
    
	//TODO also update projects node in Firebase root
	//$fb = new fireBase( FIREBASE_PROJECTS_URL, $temp_token );
	//$fb->set( $firebase_path, $file_info );
}


?>
