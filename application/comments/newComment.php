<?php
header( 'Content-Type: application/json' );

if ($_SERVER['REQUEST_METHOD'] !== "POST") {
    die("POST REQUESTS ONLY");
}

$comment = $_POST['comment'];
$commenter = $_POST['commenter'];
$commentTime = $_POST['commentTime'];
$eventTitle = $_POST['eventTitle'];
$eventContactEmail = $_POST['eventContactEmail'];

if (!isset($comment) ||
    !isset($commenter) ||
    !isset($commentTime) ||
    !isset($eventContactEmail)) {
    echo json_encode(array(
        'success' => false,
        'error' => 'Only partial details have been filled.'
    ));
    die();
}

$emailTitle = "{$commenter} commented on {$eventTitle}";
$emailMessage = "
    <html>
    <head>
        <title>New Comment: {$eventTitle}</title>
    </head>
    <body>
        <p>Dear Event Contact,</p>
        <br>
        <p>{$commenter} commented on the Honors event, {$eventTitle}. The comment was submitted on {$commentTime}.</p>
        <p>Login to <a href=\"https://myhonors.fiu.edu\">MyHonors</a> to respond to the student.</p>
        
        <p>Sincerely,</p>
        <p>FIU MyHonors Comment Service</p>
    </body>
    </html>
";
$emailHeaders = 
    'MIME-Version: 1.0' . "\r\n" .
    'Content-Type: text/html; charset=iso-8859-1' . "\r\n" .
    'To: ' . $eventContactEmail . "\r\n";

mail($eventContactEmail, $emailTitle, $emailMessage, $emailHeaders);

echo json_encode(array(
        'success' => true
));

?>