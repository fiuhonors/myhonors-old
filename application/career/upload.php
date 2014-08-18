<?php

/* 
 * Overview: this file is called when the student submits an application to a certain internship/job.
 * The following three paramaters are sent to this file when called:
 * 		- Student's id
 * 		- Internship/job ID, called the position ID
 * 		- The student's uploaded resume
 *  This is then used to retrieve the necessary data is and then send an email is sent to the specified Honors College staff contact with all the info
 *  (and resume) included
 */

require_once "../../config.php"; //Include all the necessary Firebase config variables
require_once "../../auth/FirebaseToken.php";

define("DISABLE_EMAIL", true);	//Enable for testing purposes

$formInfo = $_REQUEST;

if (!isset($_REQUEST["userID"] ) ||
	!isset($_REQUEST["positionID"]) ) {
        $result = array('success' => false, 'error' => "All the form fields must be completed.");
        echo json_encode($result);
        die();
}

$userID = $_REQUEST["userID"];
$positionID = $_REQUEST["positionID"];

// We create the temporary Firebase admin token
$tokenGen   = new Services_FirebaseTokenGenerator(FIREBASE_SECRET);
$temp_token = $tokenGen->createToken(array(), array(
	'admin' => true
));

$positionInfo = json_decode((file_get_contents(FIREBASE_CAREERS_URL . $positionID . '.json?auth=' . $temp_token)), true);
$applicationInfo = $positionInfo["applications"][$userID];


// Before sending the email, the list of skills/qualities submitted in the application must be translated into a HTML list
$skills = "<ul>";
foreach($applicationInfo["skills"] as $skill) {
	$skills .= "<li>" . $skill . "</li>";
}
$skills .= "</ul>";
	
// Also, before sending the email, the time availability of the student must also be translated into an HTML table
$timeAvailability = "<table class=\"table table-hover\" style=\"border: 1px solid black;\">
					<thead>
						<tr>
							<td style=\"1px solid black;\"></td>
							<td style=\"text-align:center;border: 1px solid black;\">Morning</td>
							<td style=\"text-align:center;border: 1px solid black;\">Afternoon</td>
							<td style=\"text-align:center;border: 1px solid black;\">Evening</td>
						</tr>
					</thead>
					<tbody>";
$days = array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
$timesName = array("Morning","Afternoon","Evening");
foreach($days as $day) {
	$timeAvailability .= "<tr style=\"border: 1px solid black;\">";
	$timeAvailability .= "<td style=\"border: 1px solid black;\">" . $day ."</td>";

	foreach($timesName as $name) {
			$timeAvailability .= "<td style=\"border: 1px solid black;\">";

		if (array_key_exists($day, $applicationInfo["timeAvailability"])) {
			$times = $applicationInfo["timeAvailability"][$day];
			if (array_key_exists($name, $times))
				$timeAvailability .= "X";
		}
	$timeAvailability .= "</td>";

	}
	
	$timeAvailability .= "</tr>";					
}
$timeAvailability .= "</tbody>
				</table>";

	
// Set up the email fields
$to = "Isabel Green <igreen@fiu.edu>";
$from = "Honors College <honors@fiu.edu>"; 
$subject ="myHonors: Application to Internship/Job"; 
$message = '
<html>
<head>
<title>Application to Internship/Job</title>
</head>
<body>
<p>Dear Honors College Staff,</p>

<p> Please find below the student\'s information and application: </p>

<p><b>Name:</b> ' . $applicationInfo["name"] . ' <br>
<b>PID:</b> ' . $applicationInfo["pid"] . ' <br>
<b>Email:</b> ' . $applicationInfo["email"] . ' <br>
<b>Telephone:</b> ' . $applicationInfo["phone"] . ' <br>
<b>Credits to Date:</b> ' . $applicationInfo["credits"] . ' <br> 
<b>Major/Minor:</b> ' . $applicationInfo["majorMinor"] . ' <br>
<b>Skills and qualities:</b> ' . $skills . '<br>
<b>Time Availability:</b> ' . $timeAvailability . '<br>
<b>Available Start Date:</b> ' . $applicationInfo["availableStart"] . ' <br>
<b>Has own transportation:</b> ' . ((array_key_exists("hasTransportation",$applicationInfo)) ? "Yes" : "No") . ' <br> 
<b>Future interest after college:</b> ' . $applicationInfo["futureInterest"] . ' <br></p>

<p> This student has applied to the following internship/job: </p>

<p><b>Company\'s Name:</b> ' . $positionInfo["companyName"] . ' <br>

<p> The required documents submitted by the student can be found attached to this email.</p>

<p>Sincerely,</p>

<p>myHonors Automated System</p>
</body>
</html>';

$headers = "From: $from";

// Boundary 
$semi_rand = md5(time()); 
$mime_boundary = "==Multipart_Boundary_x{$semi_rand}x"; 

// Headers for attachment 
$headers .= "\nMIME-Version: 1.0\n" . "Content-Type: multipart/mixed;\n" . " boundary=\"{$mime_boundary}\""; 

// Multipart boundary 
$message = "This is a multi-part message in MIME format.\n\n" . "--{$mime_boundary}\n" . "Content-Type: text/html; charset=\"iso-8859-1\"\n" . "Content-Transfer-Encoding: 7bit\n\n" . $message . "\n\n"; 
$message .= "--{$mime_boundary}\n";

// Attachment
$file = $_FILES["file"]["tmp_name"];
$filename = $_FILES["file"]["name"];
$fileReader = fopen($file,"rb");
$data = fread($fileReader,filesize($file));
fclose($fileReader);
$data = chunk_split(base64_encode($data));
$message .= "Content-Type: {\"application/octet-stream\"};\n" . " name=\"$filename\"\n" . 
"Content-Disposition: attachment;\n" . " filename=\"$filename\"\n" . 
"Content-Transfer-Encoding: base64\n\n" . $data . "\n\n";
$message .= "--{$mime_boundary}\n";


/* The code below allows us to attach multiple files to an email. We don't need it right now but we probably will in the future.
 //array with filenames to be sent as attachment
$files = array();


// preparing attachments
for($x=0;$x<count($files);$x++){
	$file = fopen("documents/" . $files[$x],"rb");
	$data = fread($file,filesize("documents/" . $files[$x]));
	fclose($file);
	$data = chunk_split(base64_encode($data));
	$message .= "Content-Type: {\"application/octet-stream\"};\n" . " name=\"$files[$x]\"\n" . 
	"Content-Disposition: attachment;\n" . " filename=\"$files[$x]\"\n" . 
	"Content-Transfer-Encoding: base64\n\n" . $data . "\n\n";
	$message .= "--{$mime_boundary}\n";
} */

if (!DISABLE_EMAIL) {
	$email_sent = mail($to, $subject, $message, $headers, '-f honors@fiu.edu'); 
	
	if (!$email_sent) {
		$result = array('success' => false, 'error' => "A problem ocurred when attemtping to submit your application.");
		echo json_encode($result);
		die();
	}
	
	$result = array('success' => true);
	echo json_encode($result);
} else {
	$result = array('success' => false, 'error' => "Email has been disabled.");
	echo json_encode($result);
}
?>
