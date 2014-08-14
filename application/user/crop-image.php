<?php

/*
 * The following script crops part of an image by the specified coordinates and saves it to the specified path.
 * 
 * @author Alberto Mizrahi
 * @version 08/14/2014
 */

require_once "../../config.php"; // Include all the necessary Firebase config variables
require_once "../../auth/FirebaseToken.php";
require_once '../lib/firebaseLib/firebaseLib.php';
require_once 'file-validation.php';

error_log( print_r( $_REQUEST, true ) );

// Check that the image was uploaded without errors and all the required data was sent
if ( empty( $_FILES[ 'file' ] ) || $_FILES[ 'file' ][ 'error' ] != UPLOAD_ERR_OK 
    || !isset( $_REQUEST[ 'userId' ] ) 
    || !isset( $_REQUEST[ 'path' ] )
    || !isset( $_REQUEST[ 'coordinates' ] )
    || !isset( $_REQUEST[ 'resizedImgSize' ] ) ) {
    error_log( print_r( $_FILES , true ) );
    error_log( print_r( $_REQUEST, true ) );
	$result = array( 'success' => false, 'error' => 'A problem ocurred when uploading the picture.' );
	echo json_encode( $result );
	die();
}


$userId = $_REQUEST[ 'userId' ];
$path = $_REQUEST[ 'path' ];
$coordinates = json_decode( $_REQUEST[ 'coordinates' ], true ); // Gives us the coordinates, size and height of the cropping area
$resized_img_size = json_decode( $_REQUEST[ 'resizedImgSize' ], true );

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

/*
 * Using jCrop with very big image files causes a problem. When a big image is uploaded to the browser and a preview is shown so that the user can crop 
 * part of it, the preview will be automatically resized by the browser to fir the screen. This throws off the x,y coordinates and the crop section 
 * width and height returned by jCrop. To fix this, the width and height ratio between the original image and the resized image in the browser must 
 * first be obtained. Using this, the true x,y coordinates along with the crop section size can be calculated for the original image and it can then be 
 * processed.
 * This idea was taken from Alastair Paragas' script at: https://gist.github.com/alastairparagas/1e4c229a55ec089f5c38
 */

// Get the original image size
$original_img_size = getimagesize( $tmp_name );

// Find the width and height ratio between the original size of the image and the resized image shwon in the browser
$img_width_ratio = $original_img_size[ 0 ] / $resized_img_size[ 'width' ];
$img_height_ratio = $original_img_size[ 1 ] / $resized_img_size[ 'height' ];

// Using the ratios, calculate the true x and y coordinate of the top left corner of the crop section
$true_x_coordinate = $coordinates[ 'x' ] * $img_width_ratio;
$true_y_coordinate = $coordinates[ 'y' ] * $img_height_ratio;

// Usign the ratios, calculate the true width and height of the crop section
$true_width = $coordinates[ 'w' ] * $img_width_ratio;
$true_height = $coordinates[ 'h' ] * $img_height_ratio;

$thumbnail_width = $thumbnail_height = 140; // Set the target width and height for the thumbnail to be created
$jpeg_quality = 80; // Indicates the JPEG quality of the thumbnail to be created

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
                    $true_x_coordinate,
                    $true_y_coordinate,
                    $thumbnail_width,
                    $thumbnail_height,
                    $true_width,
                    $true_height );

// Save the image to the specified upload path
$upload_success = imagejpeg( $thumbnail, $upload_path . $file_name, $jpeg_quality );

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


/******* Helper functions *******/

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