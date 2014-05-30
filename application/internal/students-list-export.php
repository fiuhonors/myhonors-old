<?php

/*
 * Overview: Retrieves, manipulates and stores all the Honors' students information in either an Excel or CSV file depending on the
 * exportType parameter. The user is then prompted to download the file.
 */

require_once "../../config.php"; // Include all the necessary Firebase config variables
include_once "../../auth/FirebaseToken.php";
require_once '../lib/PHPExcel/PHPExcel.php'; // Include PHPExcel

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
	
	// If export type is not sent in the GET request, we exit. (This should never happen)
	if (!isset($_GET['exportType'])) {
		exit;
	}
	
	//Create the temporary admin token for firebase
	$tokenGen   = new Services_FirebaseTokenGenerator(FIREBASE_SECRET);
	$temp_token = $tokenGen->createToken(array(), array(
		'admin' => true
	));
	
	
	/*
	 * Below, we get the get the list of all Honors students and decode them into a PHP array. We then use that info
	 * to find the name of the students who RSVP'ed.
	 * This may seem inneficient. It would make more sense to only request the info of the students who RSVP'ed.
	 * After testing both options, however, it became obvious that the first one is much(!!!) faster.
	 * Making a big request is faster that making many smaller requests from Firebase.
	 */
	$studentsInfo = json_decode((file_get_contents(FIREBASE_USERS_URL . '.json?auth=' . $temp_token)), true);
	
	
	//Depending on the type of the export the user choose, a different function is utilized to create the file 
    if ($_GET['exportType'] === 'Excel') {
		exportExcel($studentsInfo);
	} 
	elseif ($_GET['exportType'] === 'CSV') {
		exportCSV($studentsInfo);
	}
	
}
	
/**
 * Creates an Excel file with all Honors' students informations.
 * 
 * @param studentsInfo  All the user profiles
 * 
 */
function exportExcel($studentsInfo) {
	
	$objPHPExcel = new PHPExcel();
	
	// Set document properties
	$objPHPExcel->getProperties()->setCreator("The Honors College at FIU")
								->setLastModifiedBy("The Honors College at FIU")
								->setTitle("Honors Students List")
								->setSubject("Honors Students List")
								->setDescription("Honors Students List")
								->setKeywords("Honors Students List")
								->setCategory("Honors Students List");
	
	// Add headers of table
	$objPHPExcel->setActiveSheetIndex(0)
				->setCellValue('A1', 'Student Name')
				->setCellValue('B1', 'Panther ID')
				->setCellValue('C1', 'Email')
				->setCellValue('D1', 'Honors Hours')
				->setCellValue('E1', 'Colloquia')
				->setCellValue('F1', 'Excellence Lectures')
				->setCellValue('G1', 'General Events')
				->setCellValue('H1', 'HEARTS Events')
				->setCellValue('I1', 'Volunteer Hours')
				->setCellValue('J1', 'Total Points');
	
	
	$index = 2;
	foreach ($studentsInfo as $pantherID => $info) {		//Loop through the list of RSVPs
		
		$studentName = $info["fname"] . ' ' . $info["lname"];
		
		//Write the student's info to the excel file
		$objPHPExcel->setActiveSheetIndex(0)
				->setCellValue('A' . $index, $studentName)
				->setCellValue('B' . $index, $pantherID)
				->setCellValue('C' . $index, $info["email"]);
		

		$eventTypesCount = countEventsTypes($info);		//Calculate the amount of the different types of events the student has attended
		$totalVolunteerHours = countTotalVolunteerHours($info);	//Calculate the total number of accepte volunteer hours	
		
		
		$objPHPExcel->setActiveSheetIndex(0)
				->setCellValue('D' . $index, $eventTypesCount[0])
				->setCellValue('E' . $index, $eventTypesCount[1])
				->setCellValue('F' . $index, $eventTypesCount[2])
				->setCellValue('G' . $index, $eventTypesCount[3])
				->setCellValue('H' . $index, $eventTypesCount[4])
				->setCellValue('I' . $index, $totalVolunteerHours)
				->setCellValue('J' . $index, $eventTypesCount[5]);	
		
		
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
 * 
 * @param studentsInfo  All the user profiles
 * 
 */
function exportCSV($studentsInfo) {
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
    
    
    $csvFile = fopen('php://output', 'w'); //Open a new file in write mode and write to the output so the user is prompted to download it.
    
    fputcsv($csvFile, array('Student Name','PID', 'Email', 'Honors Hours','Colloquia','Excellence Lectures','General Events','HEARTS Events','Volunteer Hours','Total Points'), ",", chr(0));

	foreach ($studentsInfo as $pantherID => $info) {		//Loop through the list of RSVPs
		
		$studentName = $info["fname"] . ' ' . $info["lname"];
		
		$eventTypesCount = countEventsTypes($info);		//Calculate the amount of the different types of events the student has attended
		$totalVolunteerHours = countTotalVolunteerHours($info);	//Calculate the total number of accepte volunteer hours	
		
		
		// Set up an array with the student's info and write it to the file
		fputcsv($csvFile, array($studentName,      
								$pantherID, 
								$info["email"],
								$eventTypesCount[0],
								$eventTypesCount[1],
								$eventTypesCount[2],
								$eventTypesCount[3],
								$eventTypesCount[4],
								$totalVolunteerHours,
								$eventTypesCount[5]));
	}
	
	
	fclose($csvFile);
	
}

/**
 * Count the student's attendance to the different types of events: Honors Hours, Colloquia, Excellence Lectures, General Events, and HEARTS.
 * It also returns the total points that the student has.
 * 
 * @param studentInfo The student's profile
 * 
 * @return Array containing the amount of attendances for each event. Also, the last element in the array contains the total points of the students
 * which is calculated from these attendances.
 */ 
function countEventsTypes($studentInfo) {
	
	$eventTypesCount = array(0,0,0,0,0,0);
	
	
	if (!array_key_exists('attendance', $studentInfo)) { // First make sure the student has an attendance array in his profile
		return $eventTypesCount;
	}
	
	foreach ($studentInfo["attendance"] as $key => $event) {
		$eventType = $event["eventType"][0];
		switch ($eventType) {
			case "Honors Hour":
				$eventTypesCount[0]++;
				break;
			case "Colloquium":
				$eventTypesCount[1]++;
				break;
			case "Excellence Lecture":
				$eventTypesCount[2]++;
				break;
			case "General Event":
				$eventTypesCount[3]++;
				break;
			case "HEARTS":
				$eventTypesCount[4]++;
				break;
			default:
				break;
		}
	}
				
	
			
	$eventTypesCount[5] = $eventTypesCount[0]*2 + $eventTypesCount[1]*3 + $eventTypesCount[2]*4 + $eventTypesCount[3]*1 + $eventTypesCount[4]*1;
	
	return $eventTypesCount;
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
	if (!array_key_exists('volunteerHours', $studentInfo)) {
		return $totalVolunteerHours;
	}
	
	foreach ($studentInfo["volunteerHours"] as $key => $volunteerHour) {
		if ($volunteerHour["status"] != NULL && $volunteerHour["status"] == "accepted") {
			$totalVolunteerHours += $volunteerHour["hours"];
		}
	}
	
	return $totalVolunteerHours;
}

?>
