<?php

include_once "../auth/FirebaseToken.php";
require_once '../application/lib/firebaseLib/firebaseLib.php';

////////////////////////////////////////////////////////////////////////////

define("SERVER_ADDRESS", "");
define("BEFORE_USERNAME", "");
define("AFTER_USERNAME", "");
define("FIREBASE_SECRET", "");
define("FIREBASE_URL", ""); // must use https

$ldaprdn  = "uid=#######,ou=XXXXX,dc=XXXXX,dc=XXXXX"; // ldap rdn or dn
$ldappass = ""; // associated password

////////////////////////////////////////////////////////////////////////////

$tokenGen = new Services_FirebaseTokenGenerator(FIREBASE_SECRET);
$token = $tokenGen->createToken(array(), array('admin' => true));
$users = json_decode(file_get_contents(FIREBASE_URL . '/user_profiles/.json?auth=' . $token), true);

$fb = new fireBase(FIREBASE_URL, $token);

// connect to ldap server
$ldapconn = ldap_connect(SERVER_ADDRESS);
if ($ldapconn)
{
	// binding to ldap server
	$ldapbind = ldap_bind($ldapconn, $ldaprdn, $ldappass);

	// verify binding
	if ($ldapbind)
	{
		foreach($users as $pid => $u)
		{
			if (!array_key_exists("fname", $u) || !array_key_exists("lname", $u) || $u["fname"] == null || $u["lname"] == null) {
				// get the data from LDAP
				$search = ldap_search($ldapconn, (BEFORE_USERNAME . $pid . AFTER_USERNAME), "(objectClass=*)", array("givenName", "sn"));
				$data = ldap_get_entries($ldapconn, $search);

				// save the data to Firebase
				$path = "/user_profiles/" . $pid;
				$fb->set($path . "/fname", $data[0]["givenname"][0]);
				$fb->set($path . "/lname", $data[0]["sn"][0]);
				echo "fixed " . $pid . "<br />";

				// delay so we don't overload the server
				usleep(25000);
			}
			else {
				echo "skipped " . $pid . "<br />";
			}
		}
	}
	else
	{
		echo "Could not bind to LDAP.";
	}

	ldap_unbind($ldapconn);
}
else
{
	echo "Could not connect to server.";
}

?>
