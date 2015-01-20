<?php

/*
 * Overview: Exports the list of events into a CSV, making it easier to import
 * in areas like FIU Calendar
 * 
 */

require_once "../../config.php"; // Include all the necessary Firebase config variables
include_once "../../auth/FirebaseToken.php";
require_once '../lib/PHPExcel/PHPExcel.php'; // Include PHPExcel

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    exit;
}

if (!isset($_GET['exportType'])) {
    exit;
}

// We create the temporary Firebase admin token
$tokenGen = new Services_FirebaseTokenGenerator(FIREBASE_SECRET);
$temp_token = $tokenGen->createToken(array(), array(
    'admin' => true
));

$eventsJSON = file_get_contents(FIREBASE_EVENTS_URL . '.json?auth=' . $temp_token);
$events = json_decode($eventsJSON, true);
    
if ($_GET['exportType'] === 'CSV') {
    exportCSV($events);
}


/**
 * Creates an exportable CSV file of all the events
 * 
 * @param events Associative Array structure of events stored
 */
function exportCSV($events) {
    /* Set up all the necessary headers so the user is prompted to download the file */
    header('Content-Type: text/csv');
    header('Content-Disposition: attachment; filename="Events List.csv"');
    // If you're serving to IE 9, then the following may be needed
    header('Cache-Control: max-age=1');
    
    // If you're serving to IE over SSL, then the following may be needed
    header('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
    header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT'); // always modified
    header('Cache-Control: cache, must-revalidate'); // HTTP/1.1
    header('Pragma: public'); // HTTP/1.0
    
    
    $csvFile = fopen('php://output', 'w'); // Open a new file in write mode and write to the output so the user is prompted to download it.
    
    $columnHeaders = array('Title', 'Description', 'Location', 'Contact', 'Email', 'Phone', 'Url', 'Type', 'Category', 'Start_date_time', 'End_date_time', 'Tags');
    fputcsv($csvFile, $columnHeaders, ',', chr(0));

    $eventCategoryLectures = array('Honors Hour', 'Leadership Lecture', 'Colloquium');
    $eventCategoryAcademics = array('ARCH');
    $eventCategoryStudentLife = array('Club Meeting', 'General Event', 'Sponsored Event');
    $eventCategoryArts = array('HEARTS');

    $charsToReplace = array(",","\n"); // These are the characters that should be replaced so that the CSV does not show up messed up
    foreach ($events as $eventID => $event) {
        // Skip Study Room swipes, BBC Lab swipes, and other such "events"
        if(!empty($event['specialSwipe']) && $event['specialSwipe']) {
            continue;
        }

	    $eventTitle = empty($event['name']) ? '': str_replace(",", "", $event['name']);
        $eventDescription = empty($event['desc']) ? '': str_replace($charsToReplace, "", $event['desc']);
        $eventLocation = empty($event['location']) ? '':  str_replace(",", "", $event['location']['name']);
        $eventContact = "Luli Szeinblum";
        $eventEmail = "honors@fiu.edu";
        $eventPhone = "305-348-4100";
        $eventUrl = empty($event['thumbURL']) ? 'http://myhonors.fiu.edu' : $event['thumbURL'];
        $eventTag = empty($event['types'][0]) ? '': $event['types'][0];
        $eventType = 'normal';
        if(!empty($eventTag)){
            if(in_array($eventTag, $eventCategoryLectures)){
                $eventCategory = "Lectures and Conferences";
            }else if(in_array($eventTag, $eventCategoryAcademics)){
                $eventCategory = "Academics";
            }else if(in_array($eventTag, $eventCategoryStudentLife)){
                $eventCategory = "Student Life";
            }else if(in_array($eventTag, $eventCategoryArts)){
                $eventCategory = "Arts and Entertainment";
            }
        }
        $eventStartTime = empty($event['date']['starts']) ? '' : date('m/d/y G:i', $event['date']['starts'] / 1000);
        $eventEndTime = empty($event['date']['ends']) ? '' : date('m/d/y G:i', $event['date']['ends'] / 1000);

	    fputcsv($csvFile, array($eventTitle, $eventDescription, $eventLocation, $eventContact, $eventEmail, $eventPhone, $eventUrl, $eventType, $eventCategory, $eventStartTime, $eventEndTime, $eventTag), ",", chr(0));
		
    }

	fclose($csvFile);
}
	

?>
