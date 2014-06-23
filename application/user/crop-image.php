<?php

require_once "../../config.php"; // Include all the necessary Firebase config variables
include_once "../../auth/FirebaseToken.php";
require_once '../lib/firebaseLib/firebaseLib.php';


if ( empty( $_FILES[ 'file' ] ) || $_FILES[ 'file' ][ 'error' ] != UPLOAD_ERR_OK 
    || !isset( $_REQUEST[ 'userId' ] ) 
    || !isset( $_REQUEST[ 'path' ] )
    || !isset( $_REQUEST[ 'coordinates' ] ) ) {
	$result = array( 'success' => false, 'error' => 'A problem ocurred when uploading the picture.' );
	echo json_encode( $result );
	die();
}


$userId = $_REQUEST[ 'userId' ];
$path = $_REQUEST[ 'path' ];
$file = $_FILES[ 'file' ];
$coordinates = json_decode( $_REQUEST[ 'coordinates' ], true );

$targ_w = $targ_h = 140;
$jpeg_quality = 90;

//$filename = $_SERVER[ 'DOCUMENT_ROOT' ] . '/uploads/test.jpg';
$upload_path = $_SERVER[ 'DOCUMENT_ROOT' ] . '/uploads/' . $path . $file[ 'name' ];
error_log( $upload_path );

switch ( strtolower( $file[ 'type' ] ) )
{
    case 'image/png':
        $img_r = imagecreatefrompng( $file[ 'tmp_name' ] );
//		$source_image = imagecreatefrompng($imgUrl);
		$type = '.png';
        break;
    case 'image/jpeg':
        $img_r = imagecreatefromjpeg( $file[ 'tmp_name' ] );
//		$source_image = imagecreatefromjpeg($imgUrl);
		$type = '.jpeg';
        break;
    case 'image/gif':
        $img_r = imagecreatefromgif( $file[ 'tmp_name' ] );
//		$source_image = imagecreatefromgif($imgUrl);
		$type = '.gif';
        break;
    default: die('image type not supported');
}

//$img_r = imagecreatefromjpeg( $file[ 'tmp_name' ] );
$dst_r = ImageCreateTrueColor( $targ_w, $targ_h );

imagecopyresampled( $dst_r,
                    $img_r,
                    0,
                    0,
                    $coordinates['x'],
                    $coordinates['y'],
                    $targ_w,
                    $targ_h,
                    $coordinates['w'],
                    $coordinates['h'] );

//header('Content-type: image/jpeg');
//imagejpeg($dst_r, null, $jpeg_quality);

$upload_success = imagejpeg( $dst_r, $upload_path, $jpeg_quality);

if ( ! $upload_success ) {
    $result = array( 'success' => false, 'error' => 'A problem ocurred when uploading the picture.' );
    echo json_encode( $result );
    die();
}

updateFirebase( $path, '/uploads/' . $path , $file[ 'name' ] );

$result = array( 'success' => true, "newPath" => '/uploads/' . $path . $file[ 'name' ] );
echo json_encode( $result );


function updateFirebase( $firebase_path, $upload_path, $file_name ) {
    error_log( 	$firebase_path . $file_name );
    
    $tokenGen   = new Services_FirebaseTokenGenerator( FIREBASE_SECRET );
    $temp_token = $tokenGen->createToken( array(), array(
        'admin' => true
    ));
    
    
    $file_info = array( "filename" => $file_name, "url" => $upload_path . $file_name, "createdAt" => round( microtime( true ) * 1000 ) );
    
    $fb = new fireBase( FIREBASE_USERS_URL, $temp_token );
	$fb->update( $firebase_path, $file_info );
	
	//TODO also update projects node in Firebase root
	//$fb = new fireBase( FIREBASE_PROJECTS_URL, $temp_token );
	//$fb->set( $firebase_path, $file_info );
}

?>