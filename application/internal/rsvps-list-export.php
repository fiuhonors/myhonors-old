<?php

/*
 * Overview: Retrieves and stores the RSVP list of students for a particular event in an Excel or CSV file depending on the exportType
 * paramater.
 * 
 */

require_once "../../config.php"; // Include all the necessary Firebase config variables
include_once "../../auth/FirebaseToken.php";
require_once '../lib/PHPExcel/PHPExcel.php'; // Include PHPExcel

date_default_timezone_set('America/New_York');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
	
	// If the event ID, event name or export type is not sent in the GET request, we exit. (This should never happen)
	if (!isset($_GET['eventID']) ||
		!isset($_GET['eventName']) ||
		!isset($_GET['exportType'])) {
			
		exit;
	}
    
        
    // We create the temporary Firebase admin token
    $tokenGen   = new Services_FirebaseTokenGenerator(FIREBASE_SECRET);
    $temp_token = $tokenGen->createToken(array(), array(
        'admin' => true
    ));
    
    
    // Get event variables
    $eventID   = $_GET['eventID'];
    $eventName = $_GET['eventName'];
    
    
    $eventJSON = file_get_contents(FIREBASE_EVENTS_URL . $eventID . '.json?auth=' . $temp_token);	// Get the RSVPs list from Firebase in JSON format
    $event = json_decode($eventJSON, true);
    $rsvps = $event['rsvps'];

    /*
	 * In the line below, we get the get the list of all Honors students and decode them into a PHP array. We then use that info
	 * to find the info of the students who RSVP'ed.
	 * This may seem inneficient. It would make more sense to only request the info of the students who RSVP'ed.
	 * After testing both options, however, it became obvious that the first one is much(!!!) faster.
	 * Making a big request is faster that making many smaller requests from Firebase.
	 */
	$studentsInfo = json_decode((file_get_contents(FIREBASE_USERS_URL . '.json?auth=' . $temp_token)), true);
    
    
    //Depending on the type of the export the user choose, a different function is utilized to create the file 
    if ($_GET['exportType'] === 'Excel') {
		exportExcel($event, $rsvps, $studentsInfo);
	} 
	elseif ($_GET['exportType'] === 'CSV') {
		exportCSV($event, $rsvps, $studentsInfo);
	}	
    
}

/**
 * Creates an Excel file of all the RSVPS of a particular event and sends it to the browser to be downloaded.
 * 
 * @param event The event info
 * @param rsvps The list of students that rsvp'ed to the event
 * @param studentsInfo A list of all Honor students' profiles
 * 
 */
function exportExcel($event, $rsvps, $studentsInfo) {
	$objPHPExcel = new PHPExcel();
    
    // Set document properties
    $objPHPExcel->getProperties()->setCreator("The Honors College at FIU")
								->setLastModifiedBy("The Honors College at FIU")
								->setTitle($event['name'] . " RSVPs List")
								->setSubject($event['name'] . " RSVPs List")
								->setDescription($event['name'] . " RSVPs List")
								->setKeywords($event['name'] . " RSVPs List")
								->setCategory($event['name'] . " RSVPs List");
    
    // Add headers of table
    $objPHPExcel->setActiveSheetIndex(0)
				->setCellValue('A1', 'Student Name')
				->setCellValue('B1', 'PID')
				->setCellValue('C1', 'Email')
				->setCellValue('D1', 'Guests')
				->setCellValue('E1', 'Time of Registration')
				->setCellValue('F1', 'Attended?');
    
    $index = 2;
    foreach ($rsvps as $pantherID => $val) {		//Loop through the list of RSVPs
        
        $studentName = $studentsInfo[$pantherID]['fname'] . ' ' . $studentsInfo[$pantherID]['lname'];
        $studentEmail = $studentsInfo[$pantherID]['email'];
        $guestsNum = $val['guests'];	//Get the number of guests each student will bring
        $timeOfRegistration = isset($val['time']) ? date("n/j/y h:i A", $val['time']/1000) : "N/A";
       
        // Write the student's info to the excel file
        $objPHPExcel->setActiveSheetIndex(0)
				->setCellValue('A' . $index, $studentName)
				->setCellValue('B' . $index, $pantherID)
				->setCellValue('C' . $index, $studentEmail)
				->setCellValue('D' . $index, $guestsNum)
				->setCellValue('E' . $index, $timeOfRegistration);
				
		// Check to see whether the student actually attended the event after rsvp'ing
		if (isset($event['attendance']) && isset($event['attendance'][$pantherID]))
			$objPHPExcel->setActiveSheetIndex(0)->setCellValue('F' . $index, "Yes");
		else
			$objPHPExcel->setActiveSheetIndex(0)->setCellValue('F' . $index, "No");
				
		$index++;
    }
    
    
    // Set active sheet index to the first sheet, so Excel opens this as the first sheet
    $objPHPExcel->setActiveSheetIndex(0);
    
    
	/* Set up all the necessary headers so the user is prompted to download the file */
    // Redirect output to a client’s web browser (Excel5)
    header('Content-Type: application/vnd.ms-excel');
    header('Content-Disposition: attachment;filename="' . $event['name'] . ' RSVPs List.xls"');
    header('Cache-Control: max-age=0');
    // If you're serving to IE 9, then the following may be needed
    header('Cache-Control: max-age=1');
    
    // If you're serving to IE over SSL, then the following may be needed
    header('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
    header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT'); // always modified
    header('Cache-Control: cache, must-revalidate'); // HTTP/1.1
    header('Pragma: public'); // HTTP/1.0
    
    
    
    $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
    $objWriter->save('php://output');	// Write the file to the output so the user is prompted to download it.
    
}


/**
 * Creates a CSV file of all the RSVPS of a particular event and sends it to the browser to be downloaded.
 * 
 * @param event The event info
 * @param rsvps The list of students that rsvp'ed to the event
 * @param studentsInfo A list of all Honor students' profiles
 * 
 */
function exportCSV($event, $rsvps, $studentsInfo) {
	/* Set up all the necessary headers so the user is prompted to download the file */
	header('Content-Type: text/csv');
	header('Content-Disposition: attachment; filename="' . $event['name'] . ' RSVPs List.csv"');
	// If you're serving to IE 9, then the following may be needed
    header('Cache-Control: max-age=1');
    
    // If you're serving to IE over SSL, then the following may be needed
    header('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
    header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT'); // always modified
    header('Cache-Control: cache, must-revalidate'); // HTTP/1.1
    header('Pragma: public'); // HTTP/1.0
    
    
    $csvFile = fopen('php://output', 'w'); //Open a new file in write mode and write to the output so the user is prompted to download it.
    
    fputcsv($csvFile, array('Student Name', 'PID', 'Email', 'Guests', 'Registration','Attended?'));	//Set up the headers of the file
    
    foreach ($rsvps as $pantherID => $val) {		//Loop through the list of RSVPs
		$studentName = $studentsInfo[$pantherID]['fname'] . ' ' . $studentsInfo[$pantherID]['lname'];
        $studentEmail = $studentsInfo[$pantherID]['email'];
        $guestsNum = $val['guests'];	//Get the number of guests each student will bring
        $timeOfRegistration = isset($val['time']) ? date("n/j/y h:i A", $val['time']/1000) : "N/A";

        // Check to see whether the student actually attended the event after rsvp'ing
		if (isset($event['attendance']) && isset($event['attendance'][$pantherID]))
			$attended = "Yes";
		else
			$attended = "No";	
				
		fputcsv($csvFile, array($studentName, $pantherID, $studentEmail, $guestsNum, $timeOfRegistration, $attended), ",", chr(0)); // Set up an array with the student's info and write it to the file
		
    }

	fclose($csvFile);
}
	

?>
 

