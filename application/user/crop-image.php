<?php

/*
 * The following script crops part of an image by the specified coordinates and saves it to the specified path.
 */

require_once "../../config.php"; // Include all the necessary Firebase config variables
include_once "../../auth/FirebaseToken.php";
require_once '../lib/firebaseLib/firebaseLib.php';
require_once 'file-validation.php';

// Check that the image was uploaded without errors and all the required data was sent
if ( empty( $_FILES[ 'file' ] ) || $_FILES[ 'file' ][ 'error' ] != UPLOAD_ERR_OK 
    || !isset( $_REQUEST[ 'userId' ] ) 
    || !isset( $_REQUEST[ 'path' ] )
    || !isset( $_REQUEST[ 'coordinates' ] ) ) {
    error_log( print_r( $_FILES , true ) );
    error_log( print_r( $_REQUEST, true ) );
	$result = array( 'success' => false, 'error' => 'A problem ocurred when uploading the picture.' );
	echo json_encode( $result );
	die();
}


$userId = $_REQUEST[ 'userId' ];
$path = $_REQUEST[ 'path' ];
$coordinates = json_decode( $_REQUEST[ 'coordinates' ], true );

$file_name = $_FILES[ "file" ][ "name" ];
$tmp_name = $_FILES[ "file" ][ "tmp_name" ];
$file_mimetype = $_FILES[ "file" ][ "type" ];

// Check to see if the image is valid
$isImgValid = validateImage( $file_name, $file_mimetype );
if( ! $isImgValid ) {
    $result = array( 'success' => false, 'error' => 'Only JPG, GIF and PNG pciture formats are allowed.' );
    echo json_encode( $result );
    die();
}


$thumbnail_width = $thumbnail_height = 140; // Set the target width and height for the thumbnail to be created
$jpeg_quality = 80; // Indicates the JPED quality of the thumbnail to be created

// Set the upload path where the thumbnail will be stored
$upload_path = PROJECT_ROOT_PATH . 'uploads/' . $path;

// If the upload path does not exist, create the necessary folders
if ( ! file_exists( $upload_path ) && ! is_dir( $upload_path ) ) {
    mkdir( $upload_path, 0777, true );         
}

// Create a new image from the uploaded image given its mime type
switch ( strtolower( $file_mimetype ) )
{
    case 'image/png':
        $image = imagecreatefrompng( $tmp_name );
		$type = '.png';
        break;
    case 'image/jpeg':
        $image = imagecreatefromjpeg( $tmp_name );
		$type = '.jpeg';
        break;
    case 'image/gif':
        $image = imagecreatefromgif( $tmp_name );
		$type = '.gif';
        break;
    default: die('image type not supported');
}

// Create a new true color image with the specified height and width
$thumbnail = ImageCreateTrueColor( $thumbnail_width, $thumbnail_height );

// Copy the part of the uploaded image specified by the cropping coordinates and store it in our thumbnail image
imagecopyresampled( $thumbnail,
                    $image,
                    0,
                    0,
                    $coordinates['x'],
                    $coordinates['y'],
                    $thumbnail_width,
                    $thumbnail_height,
                    $coordinates['w'],
                    $coordinates['h'] );

// Save the image to the specified upload path
$upload_success = imagejpeg( $thumbnail, $upload_path . $file_name, $jpeg_quality);

// Check if the save was succesful
if ( ! $upload_success ) {
    $result = array( 'success' => false, 'error' => 'A problem ocurred when uploading the picture.' );
    echo json_encode( $result );
    die();
}

// Update Firebase to store the relative path to the thumbnail
updateFirebase( $path, 'uploads/' . $path , $file_name );

$result = array( 'success' => true );
echo json_encode( $result );


function updateFirebase( $firebase_path, $upload_path, $file_name ) {
    $tokenGen   = new Services_FirebaseTokenGenerator( FIREBASE_SECRET );
    $temp_token = $tokenGen->createToken( array(), array(
        'admin' => true
    ));
    
    $file_info = array( "filename" => $file_name, "url" => $upload_path . $file_name, "createdAt" => round( microtime( true ) * 1000 ) );
    
    $fb = new fireBase( FIREBASE_USERS_URL, $temp_token );
	$fb->update( $firebase_path, $file_info );
}

?>