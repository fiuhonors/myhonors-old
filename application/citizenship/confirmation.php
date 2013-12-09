<?php


define("FIREBASE_SECRET", "0TCYdRD79UAKxkaWMl7d16HJqXTyHUUeJEU5q4To");
define("FIREBASE_VOLUNTEER_URL", "https://fiuhonorstechteam.firebaseio.com/volunteerHours/");

include_once "../../auth/FirebaseToken.php";
	
/* After the student submits the volunteer hours information, a POST request with that data is sent to this file. An email is then sent
 * to the person specified by the student in order to confirm the volunteer work
 */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	
	// All output after POSTing will be delivered in JSON format
	header('Content-Type: application/json');
	
	
	if (!isset($_POST['agency']) ||
		!isset($_POST['referenceEmail']) || 
		!isset($_POST['referenceName']) || 
		!isset($_POST['userName']) ||
		!isset($_POST['startDate']) ||
		!isset($_POST['endDate']) ||
		!isset($_POST['activity']) ||
		!isset($_POST['hours']) ) {
			
			$result = array('success' => false, 'error' => "All the form fields must be completed.");
			echo json_encode($result);
			die();
		}
		
		
			
			
	// Format the email message depending wheter the volunteer work was done on one day, or in a range of dates
	$date_message = "";
	if ($_POST['startDate'] == $_POST['endDate']) {
		$date_message = "On " . $_POST['startDate'];
	}
	else {
		$date_message = "Between " . $_POST['startDate'] . " and " . $_POST['endDate'];
	}
	
	
	/* Email variables are set below */
	$to  = $_POST['referenceEmail'];
	
	// subject
	$subject = 'Volunteer Hours Confirmation';
	
	// message
	$message = '
	<html>
	<head>
	<title>Volunteer Hours Confirmation</title>
	</head>
	<body>
	<p>Dear Volunteer Event Supervisor</p>
	
	<p>'. $date_message . ', ' . $_POST['userName'] . ' participated in the following event and specified number of hours as part of their citizen requirement for The Honors College at Florida International University:
	
	<p><b>Agency/Organization:</b> ' . $_POST['agency'] . '</p>
	<p><b>Event description:</b> ' . $_POST['activity'] . '</p>
	
	<p><b>Hours served:</b> ' . $_POST['hours'] . ' </p>
	
	
	<p>Please confirm their attendance claim by clicking on the accept link: <a href="https://myhonors.fiu.edu/application/citizenship/confirmation.php?volunteerHoursID=' . $_POST['volunteerHoursID'] . '">Accept</a></p>
	
	
	<p>If you feel that this Honors College student has not served the claimed hours, please contact me at <a href="mailto:agorelic@fiu.edu">agorelic@fiu.edu</a>.</p>
	
	<p>Sincerely,</p>
	
	<p>Adam Gorelick<br />
	Coordinator of Student Programs<br />
	The Honors College</p>
	</body>
	</html>
	';
	
	// To send HTML mail, the Content-type header must be set
	$headers  = 'MIME-Version: 1.0' . "\r\n";
	$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
	
	// Additional headers
	$headers .= 'To: ' . $_POST['referenceName'] . ' <' . $_POST['referenceEmail'] . '>' . "\r\n";
	$headers .= 'From: Adam Gorelick <agorelic@fiu.edu>' . "\r\n";

	error_log($message);
	
	// Mail it
	$email_sent = mail($to, $subject, $message, $headers);
	
	if (!$email_sent) {
		$result = array('success' => false, 'error' => "A problem ocurred when attemtping to send the confirmation email.");
		echo json_encode($result);
		die();
	}
	
	$result = array('success' => true);
	echo json_encode($result);
}

/* After the recipient of the confirmation email confirms the volunteer work and clicks the link, a GET request is sent here along with
 * the volunteer hours ID. Then, a PATCH request is sent to Firebase utilizing cURL to update the status field of that object from 
 * 'pending' to 'accepted'
 */
else {
	
	if (isset($_GET['volunteerHoursID'])) {
		
		$tokenGen = new Services_FirebaseTokenGenerator(FIREBASE_SECRET);
	
		// create a temporary admin token to access the admin users/roles in the 'settings' area of our Firebase
		$temp_token = $tokenGen->createToken(array(), array('admin' => true));
	
		
		// We now use cURL to send a PATCH (or update) request to Firebase in order to update the status of the volunteerHours object to accepted
		$data = '{"status": "accepted"}';
		$url = FIREBASE_VOLUNTEER_URL . $_GET['volunteerHoursID'] . '.json?auth='. $temp_token;
		$headers = array('Content-Type: application/json');
		$curl = curl_init();
		curl_setopt($curl, CURLOPT_URL, $url);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'PATCH');
		curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
		curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
		$response = curl_exec($curl);
		curl_close($curl);
	?>
	
	
	<html>
<head>
	<title>Volunteer Hours Confirmation | FIU Honors College</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<link rel="stylesheet" type="text/css" href="../../assets/css/bootstrap.css" />
	<link rel="stylesheet" type="text/css" href="../../assets/css/font-awesome.css" />
	<link rel="stylesheet" type="text/css" href="../../assets/css/style.css" />
</head>
<body>
	
<img src="../../assets/img/honors-logo.jpg" style="margin: 5px 0px 0px 5px;"/>

<div class="row">
	<div class="span6 offset4" style="margin-top: 190px;">
		<div class="box" style="width: 500px; height: 200px;">
			<h4 class="pagination-centered" style="padding-top: 15%;">Your response has been recorded. Thank you for your time!</h4>
		</div>
	</div>
</div>
</body>
</html>

<?php
	
	}
}



 ?>
	
	
	
