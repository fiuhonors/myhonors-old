<?php

/* Config settings */

define("SERVER_ADDRESS", "");
define("BEFORE_USERNAME", "");
define("AFTER_USERNAME", "");
define("ERROR_STATEMENT", "");
define("FIREBASE_SECRET", "");
define("FIREBASE_SETTINGS_URL", ""); // must use https

/* DO NOT EDIT BELOW THIS LINE */

include_once "FirebaseToken.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST')
{
	// all output after POSTing will be delivered in JSON format
	header('Content-Type: application/json');

	// checks for empty username/password combinations to prevent LDAP from
	// successully binding with an anonymous login
	if (!isset($_POST['pid']) || !isset($_POST['password']) || empty($_POST['pid']) || empty($_POST['password'])) {
		$result = array('success' => false, 'error' => ERROR_STATEMENT);
		echo json_encode($result);
		die();
	}

	$ldaprdn  = BEFORE_USERNAME . $_POST['pid'] . AFTER_USERNAME; // ldap rdn or dn
	$ldappass = $_POST['password']; // associated password

	// connect to ldap server
	$ldapconn = ldap_connect(SERVER_ADDRESS);

	if ($ldapconn)
	{

		// binding to ldap server
		$ldapbind = ldap_bind($ldapconn, $ldaprdn, $ldappass);

		// verify binding
		if ($ldapbind)
		{
			$search = ldap_search($ldapconn, (BEFORE_USERNAME . $_POST['pid'] . AFTER_USERNAME), "(objectClass=*)", array("givenName", "sn"));
			$data = ldap_get_entries($ldapconn, $search);

			// create token generator
			$tokenGen = new Services_FirebaseTokenGenerator(FIREBASE_SECRET);

			// create a temporary admin token to access the admin users/roles in the 'settings' area of our Firebase
			$temp_token = $tokenGen->createToken(array(), array('admin' => true));
			$access_levels = json_decode(file_get_contents(FIREBASE_SETTINGS_URL . '/accessLevels/.json?auth=' . $temp_token), true);

			$auth_payload = array(
				'id' => $_POST['pid'],
				'isArchMod' => (array_key_exists($_POST['pid'], $access_levels['isArchMod'])) ? true : false,
				'isEventMod' => (array_key_exists($_POST['pid'], $access_levels['isEventMod'])) ? true : false,
				'isAdmin' => (array_key_exists($_POST['pid'], $access_levels['isAdmin'])) ? true : false
			);

			// create firebase token for user and include additional security info
			$user_token = $tokenGen->createToken($auth_payload);

			$result = array('success' => true, 'pid' => $_POST['pid'], "fname" => $data[0]["givenname"][0], "lname" => $data[0]["sn"][0], "auth" => $auth_payload, "token" => $user_token);

			ldap_unbind($ldapconn);
		}
		else
		{
			$result = array('success' => false, 'error' => ERROR_STATEMENT);
		}

	}
	else
	{
		$result = array('success' => false, 'error' => ERROR_STATEMENT);
	}

	echo json_encode($result);
}
else
{

?>

<html>
<head>
	<title>Verification</title>
</head>
<body>

<form enctype="application/x-www-form-urlencoded" action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post">
	FIU Panther ID: <input type="text" name="pid" /><br />
	FIU MyAccounts Password: <input type="password" name="password" /><br />
	<input type="submit" />
</form>

</body>
</html>

<?php } ?>