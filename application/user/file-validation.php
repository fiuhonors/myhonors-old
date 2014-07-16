<?php

function validateImage( $file_name, $file_mimetype ) {
    /* Check file mimetype and type */
    $allowed_mimetypes = array( "image/jpeg", "image/gif", "image/png" );
    $allowed_types = array( ".jpg", ".jpeg", ".gif", ".png" );

    $isValidImage = false;

    // Check that the extension of the file is allowed using Regex
    foreach ( $allowed_types as $type ) {
        if ( preg_match( "/$type\$/i", $file_name ) )
            $isValidImage = true;
    }

    // Check if the mimetype of the file is allowed
    if ( in_array( $file_mimetype, $allowed_mimetypes ) )
        $isValidImage = true;
    
    return $isValidImage;
}

function validateDocument( $file_name, $file_mimetype ) {
    /* Check file mimetype and type */
    $allowed_mimetypes = array( "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/pdf", "application/x-pdf" );
    $allowed_types = array( ".doc", ".docs", ".ppt", ".pptx", ".pdf" );

    $isValidDoc = false;

    // Check that the extension of the file is allowed using Regex
    foreach ( $allowed_types as $type ) {
        if ( preg_match( "/$type\$/i", $file_name ) )
            $isValidDoc = true;
    }

    // Check if the mimetype of the file is allowed
    if ( in_array( $file_mimetype, $allowed_mimetypes ) )
        $isValidDoc = true;
    
    return $isValidDoc;
    
}   

?>