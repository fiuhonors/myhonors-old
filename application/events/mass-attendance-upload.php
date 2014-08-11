<?php

/**
 * Overview: The following PHP script receives an Excel file with all the PID of students who attended the event. Each PID must be on a
 * separate row.
 * 
 * The script then processes the file using PHPExcel, loops through all the PID and updates the student's and the event's attendance fields
 * 
 */

require_once "../../config.php"; // Include all the necessary Firebase config variables
include_once "../../auth/FirebaseToken.php";
require_once '../lib/firebaseLib/firebaseLib.php';
include_once '../lib/PHPExcel/PHPExcel/IOFactory.php';

set_time_limit(0); // By setting it to 0, no time limit is imposed for this script (i.e. it will run until the script finishes)

if (!isset($_REQUEST["eventId"]) ||
	!isset($_FILES["file"])
	) {
		$result = array('success' => false, 'error' => "An error has oucrred while uploading the file.");
		echo json_encode($result);
		die();
	}
	
$file = $_FILES["file"]["tmp_name"];
$eventId = $_REQUEST["eventId"];


// We create a temporary Firebase admin token
$tokenGen   = new Services_FirebaseTokenGenerator(FIREBASE_SECRET);
$temp_token = $tokenGen->createToken(array(), array(
	'admin' => true
));


$eventInfo = json_decode((file_get_contents(FIREBASE_EVENTS_URL . $eventId . '.json?auth=' . $temp_token)), true);


// Read your Excel workbook
try {
    $inputFileType = PHPExcel_IOFactory::identify($file);
    $objReader = PHPExcel_IOFactory::createReader($inputFileType);
    $objPHPExcel = $objReader->load($file);
} catch(Exception $e) {
    $result = array('success' => false, 'error' => "An error has oucrred while uploading the file.");
	echo json_encode($result);
	die();
}

// Get worksheet dimensions
$sheet = $objPHPExcel->getSheet(0); 
$highestRow = $sheet->getHighestRow(); 
$highestColumn = $sheet->getHighestColumn();

// Loop through each row of the worksheet in turn
for ($row = 1; $row <= $highestRow; $row++){ 
    // Read a row of data into an array
    $rowData = $sheet->rangeToArray('A' . $row . ':' . $highestColumn . $row,
                                    NULL,
                                    TRUE,
                                    FALSE);
     

    $pid = $rowData[0][0];
    
    // Make sure that the data we read from the row is an actual Panther ID
    if (!is_numeric($pid) || strlen($pid) != 7) {
		$result = array('success' => false, 'error' => "The uploaded file is not properly formatted: " . $pid . " is a not a Panther ID");
		echo json_encode($result);
		die();
	}
    
    $now = time()*1000;	// Get Epoch time. Multiplied by 1000 to get milliseconds so it it complies with AngularJS formatting
    
    // Update the student's attendance field
    $fb = new fireBase(FIREBASE_USERS_URL, $temp_token);
	$path = $pid . "/attendance/" . $eventId;
	$fb->push($path, $now);
	$fb->set($path . '/eventType', $eventInfo["types"]);
	
	// Update the event's attendance field
	$fb = new fireBase(FIREBASE_EVENTS_URL, $temp_token);
	$path = $eventId . "/attendance/" . $pid;
	$fb->push($path, $now);
	
}

$result = array('success' => true);
echo json_encode($result);
die();


?>
