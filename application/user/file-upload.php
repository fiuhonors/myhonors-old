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

function uploadFile( $userId, $path, $file_name, $tmp_name, $file_mimetype ) {

    /*
     * Check whether the uploaded file is a valid image or document. To do this, the file properties are passed to both the image validation 
     * and document validation document. If either one returns OK, upload the file.
     */
    $isFileValid = validateImage( $file_name, $file_mimetype ) || validateDocument( $file_name, $file_mimetype );
    if( ! $isFileValid ) {
        $result = array( 'success' => false, 'error' => 'The file you uploaded is invalid.' );
        echo json_encode( $result );
        die();
    }
    
    // Store the path were the file will be stored in the system
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

    
    // Store the file's info into an array
    $file_info = array( "filename" => $file_name, "url" => '/uploads/' . $path .$file_name, "createdAt" => round( microtime( true ) * 1000 ) );
    $fileObject = json_encode( $file_info );
    
    $result = array( 'success' => true, 'fileObject' => $fileObject, 'fileId' => $_REQUEST[ "itemIndex" ] );
    echo json_encode( $result );
    die();
    
}

?>
