<?php

/*
 * Overview: Retrieves, manipulates and stores all the Honors' students information in either an Excel or CSV file depending on the
 * exportType parameter. The user is then prompted to download the file.
 */

require_once '../../config.php'; // Include all the necessary Firebase config variables
include_once '../../auth/FirebaseToken.php';
require_once '../lib/PHPExcel/PHPExcel.php'; // Include PHPExcel

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
	
	// If export type is not sent in the GET request, we exit. (This should never happen)
	if (!isset($_GET['exportType'])) {
		exit;
	}
	
	//Create the temporary admin token for firebase
	$tokenGen   = new Services_FirebaseTokenGenerator(FIREBASE_SECRET);
	$temp_token = $tokenGen->createToken(array(), array('admin' => true));
	
	
	/*
	 * Below, we get the get the list of all Honors students and decode them into a PHP array. We then use that info
	 * to find the name of the students who RSVP'ed.
	 * This may seem inneficient. It would make more sense to only request the info of the students who RSVP'ed.
	 * After testing both options, however, it became obvious that the first one is much(!!!) faster.
	 * Making a big request is faster that making many smaller requests from Firebase.
	 */
	$studentsInfo = json_decode((file_get_contents(FIREBASE_USERS_URL . '.json?auth=' . $temp_token)), true);
    
    // Contains the info in the system_settings/eventTypes node in Firebase which has the names of all the different event types as well as how much points they are worth and the maximum number of points per student per event type
    $eventsTypesInfo = json_decode((file_get_contents(FIREBASE_SETTINGS_URL . 'eventTypes/.json?auth=' . $temp_token)), true);
    
//    print_r( countEventsTypes($studentsInfo, $eventsTypesInfo) );	
	
	// Depending on the type of the export the user choose, a different function is utilized to create the file 
    if ($_GET['exportType'] === 'Excel') {
		exportExcel($studentsInfo, $eventsTypesInfo);
	} 
	elseif ($_GET['exportType'] === 'CSV') {
		exportCSV($studentsInfo, $eventsTypesInfo);
	}
	
}
	
/**
 * Creates an Excel file with all Honors' students informations.
 * @param studentsInfo  All the user profiles
 * @param eventsTypesInfo All the event types with their respective info
 */
function exportExcel($studentsInfo, $eventsTypesInfo) {
	
	$objPHPExcel = new PHPExcel();
	
	// Set document properties
	$objPHPExcel->getProperties()->setCreator('The Honors College at FIU')
								->setLastModifiedBy('The Honors College at FIU')
								->setTitle('Honors Students List')
								->setSubject('Honors Students List')
								->setDescription('Honors Students List')
								->setKeywords('Honors Students List')
								->setCategory('Honors Students List');
	
	// Create the headers of the table of the Excel file
	$objPHPExcel->setActiveSheetIndex(0)
				->setCellValue('A1', 'Student Name')
				->setCellValue('B1', 'Panther ID')
				->setCellValue('C1', 'Email');
    
    // Iterate through the list of event types and write each one to the file
    $nextColumn = 'D';
    foreach ($eventsTypesInfo as $eventType => $eventInfo){
        $objPHPExcel->setActiveSheetIndex(0)
            ->setCellValue($nextColumn++ . '1', $eventInfo['name']);
    }
    $objPHPExcel->setActiveSheetIndex(0)
            ->setCellValue($nextColumn++ . '1', 'Total Points');
    $objPHPExcel->setActiveSheetIndex(0)
            ->setCellValue($nextColumn++ . '1', 'Volunteer Hours');
    
	// Iterate through each student and write their info in a row
	$index = 2;
	foreach ($studentsInfo as $pantherID => $info) {		//Loop through the attendances
		
		$studentName = $info['fname'] . ' ' . $info['lname'];
        $studentEmail = !isset($info['email']) ? '' : $info['email'];
		
		// Write the student's info to the excel file
		$objPHPExcel->setActiveSheetIndex(0)
				->setCellValue('A' . $index, $studentName)
				->setCellValue('B' . $index, $pantherID)
				->setCellValue('C' . $index, $studentEmail);
        
        // Calculate the how much the student has attended each event types as well the total points he has from all this attendances
		$eventsTypesCount = countEventsTypes($info, $eventsTypesInfo);	
        //Calculate the total number of ACCEPTED volunteer hours	
		$totalVolunteerHours = countTotalVolunteerHours($info);
        
        // Iterate through the all the event types and check whether the student's $eventsTypesCount variable contains a key with that event type
        // If it does that means that the user has attended that event type and that number is written to the cell; otherwise 0 is written.
        $nextColumn = 'D';
        foreach ($eventsTypesInfo as $eventType => $eventInfo) {
            $cellValue = !isset($eventsTypesCount[$eventType]) ? 0 : $eventsTypesCount[$eventType];
            $objPHPExcel->setActiveSheetIndex(0)
                    ->setCellValue($nextColumn++ . $index, $cellValue);
        }
        
        $totalPoints = !isset( $eventsTypesCount['totalPoints'] ) ? 0 : $eventsTypesCount['totalPoints'];
        $objPHPExcel->setActiveSheetIndex(0)
                    ->setCellValue($nextColumn++ . $index, $totalPoints);
        
        $objPHPExcel->setActiveSheetIndex(0)
                    ->setCellValue($nextColumn++ . $index, $totalVolunteerHours);
        
		$index++;
	}
	
	
	// Set active sheet index to the first sheet, so Excel opens this as the first sheet
	$objPHPExcel->setActiveSheetIndex(0);
	
	
	/* Set up all the necessary headers so the user is prompted to download the file */
	// Redirect output to a client’s web browser (Excel5)
	header('Content-Type: application/vnd.ms-excel');
	header('Content-Disposition: attachment;filename="Honors Students List.xls"');
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
 * Creates a CSV file with all Honors' students informations.
 * @param studentsInfo  All the user profiles
 * @param eventsTypesInfo All the event types with their respective info
 */
function exportCSV($studentsInfo, $eventsTypesInfo) {    
	/* Set up all the necessary headers so the user is prompted to download the file */
	header('Content-Type: text/csv');
	header('Content-Disposition: attachment; filename="Honors Students List.csv"');
	// If you're serving to IE 9, then the following may be needed
    header('Cache-Control: max-age=1');
    
    // If you're serving to IE over SSL, then the following may be needed
    header('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
    header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT'); // always modified
    header('Cache-Control: cache, must-revalidate'); // HTTP/1.1
    header('Pragma: public'); // HTTP/1.0
    
    // Open a new file in write mode and write to the output so the user is prompted to download it.
    $csvFile = fopen('php://output', 'w');
    
    // Set up the headers of the table of the CSV file
    $headers = array('Student Name','PID', 'Email');
    foreach ($eventsTypesInfo as $eventType => $eventInfo){
        // Add the name of the event type to end of the array
        $headers[] = $eventType['name'];
    }
        
    // Write the header to the CSV file using a ',' as a delimeter
    fputcsv($csvFile, $headers, ',', chr(0));

	foreach ($studentsInfo as $pantherID => $info) {		//Loop through the list of RSVPs
		
		$studentName = $info['fname'] . ' ' . $info['lname'];
        $studentEmail = !isset($info['email']) ? '' : $info['email'];
		
		// Calculate the how much the student has attended each event types as well the total points he has from all this attendances
		$eventsTypesCount = countEventsTypes($info, $eventsTypesInfo);	
        //Calculate the total number of ACCEPTED volunteer hours	
		$totalVolunteerHours = countTotalVolunteerHours($info);
        
        
        // Iterate through the all the event types and check whether the student's $eventsTypesCount variable contains a key with that event type
        // If it does that means that the user has attended that event type and that number is pushed to the array; otherwise 0 is pushed.
        $studentRow = array($studentName, $pantherID, $studentEmail); // Contains an array with all the students info, attendance, etc.
        foreach ($eventsTypesInfo as $eventType => $eventInfo) {
            $cellValue = !isset($eventsTypesCount[$eventType]) ? 0 : $eventsTypesCount[$eventType];
            $studentRow[] = $cellValue;
        }
        // Push the total number of points the user has from his attendance; otherwise, push 0 if he has not attended anything
        $studentRow[] = !isset( $eventsTypesCount['totalPoints'] ) ? 0 : $eventsTypesCount['totalPoints'];
        $studentRow[] = $totalVolunteerHours;
		
		// Write the student's array to the CSV file
		fputcsv($csvFile, $studentRow);
	}
	
	fclose($csvFile);
}

/**
 * Count the student's attendance to the different types of events (which can be found in the system_settings/eventTypes node in Firebase) as well 
 * as calculate the total points that the user has from that attendance, taking into consideration the worth in points of each event type as well as 
 * the maximum number of points an event types allows.
 * @param studentInfo The student's profile
 * @param eventsTypesInfo All the event types with their respective info
 * @return Array containing the amount of attendances for each event. Also, the last element in the array contains the total points of the students
 * which is calculated from these attendances.
 */ 
function countEventsTypes($studentInfo, $eventsTypesInfo) {
	
    // Associate array where the key is the event type and the value is the number of those events that the user ha attended
	$eventsTypesCount = array();
	
    // First make sure the student has an attendance array in his profile.
	if (!isset($studentInfo['attendance'])) {
		return $eventsTypesCount;
	}
	
    // Iterate through all the events the user has attended
    $totalPoints = 0;
	foreach ($studentInfo['attendance'] as $key => $event) {
        // Get the name of the event type. Due to the way the type of the event is stored, which differs between the BBC lab swipe and the Study Room 
        // Swipe, with the rest of  the other events, the name of the event type can be found in two different places.
		$eventType = is_array($event['eventType']) ? $event['eventType'][0] : $event['eventType'];
        
//        echo 'Event type: ' . $eventType . '<br>';
        
        // Increase the value associated with the event name key in the associative array. 
//		$eventsTypesCount[$eventType] = !isset( $eventsTypesCount[$eventType] ) ? 1 : $eventsTypesCount[$eventType] + 1;
        
        $count = 0;
        if (isset($eventsTypesInfo[$eventType]['singleEventId'])) {
            foreach($studentInfo['attendance'][$key] as $id => $time){
                if ( $id != 'eventType' )
                    $count++;
            }
        }
        else {
            $count = !isset( $eventsTypesCount[$eventType] ) ? 1 : $eventsTypesCount[$eventType] + 1;
        }
        
        $eventsTypesCount[$eventType] = $count;
        
        if (isset($eventsTypesInfo[$eventType]['citizenship']['minimumAttendance']) && $eventsTypesCount[$eventType] % $eventsTypesInfo[$eventType]['citizenship']['minimumAttendance'] != 0 ) {
            continue;        
        }
        
        $minimumAttendance = !isset($eventsTypesInfo[$eventType]['citizenship']['minimumAttendance']) ? 1 : isset($eventsTypesInfo[$eventType]['citizenship']['minimumAttendance']);
        
        // If that event type has a maxPoints property, then it must be checked whether the user has already surpassed that limit
        if (isset($eventsTypesInfo[$eventType]['citizenship']['maxPoints'])) {
            // If the user has gone above the limit, skip the rest of this iteration
            if (($eventsTypesCount[$eventType] / $minimumAttendance) * $eventsTypesInfo[$eventType]['citizenship']['points'] > $eventsTypesInfo[$eventType]['citizenship']['maxPoints'])
                continue;
        }

        $totalPoints += $eventsTypesInfo[$eventType]['citizenship']['points'];
	}
	
    $eventsTypesCount['totalPoints'] = floor($totalPoints);
	
	return $eventsTypesCount;
}

/**
 * Count the student's total accepted volunteer hours.
 * 
 * @param studentInfo The student's profile
 * 
 * @return Total number of accepted volunteer hours
 */
function countTotalVolunteerHours($studentInfo) {
	$totalVolunteerHours = 0;
    
	if (!isset($studentInfo['volunteerHours'])) {
		return $totalVolunteerHours;
	}
	
	foreach ($studentInfo['volunteerHours'] as $key => $volunteerHour) {
		if (isset($volunteerHour['status']) && $volunteerHour['status'] == 'accepted') {
			$totalVolunteerHours += $volunteerHour['hours'];
		}
	}
	
	return $totalVolunteerHours;
}

?>
