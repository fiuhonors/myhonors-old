<?php

/* Config settings */

define("SERVER_ADDRESS", "");
define("BEFORE_USERNAME", "");
define("AFTER_USERNAME", "");
define("ERROR_STATEMENT", "");
define("FIREBASE_SECRET", "");
define("FIREBASE_SETTINGS_URL", ""); // must use https

// Warning: only disable LDAP for development. this is useful when you're developing
// off-site and can't access the LDAP server due to security restrictions
define("DISABLE_LDAP", false);

/* DO NOT EDIT BELOW THIS LINE */

include_once "FirebaseToken.php";

function getData($username, $data) {
	// create token generator
	$tokenGen = new Services_FirebaseTokenGenerator(FIREBASE_SECRET);

	// create a temporary admin token to access the admin users/roles in the 'settings' area of our Firebase
	$temp_token = $tokenGen->createToken(array(), array('admin' => true));
	$access_levels = json_decode(file_get_contents(FIREBASE_SETTINGS_URL . '/accessLevels/.json?auth=' . $temp_token), true);

	$auth_payload = array(
		'id' => $username,
		'isArchMod' => (!empty($access_levels['isArchMod']) && array_key_exists($username, $access_levels['isArchMod'])) ? true : false,
		'isEventMod' => (!empty($access_levels['isEventMod']) && array_key_exists($username, $access_levels['isEventMod'])) ? true : false,
		'isStaff' => (!empty($access_levels['isStaff']) && array_key_exists($username, $access_levels['isStaff'])) ? true : false,
		'isAdmin' => (!empty($access_levels['isAdmin']) && array_key_exists($username, $access_levels['isAdmin'])) ? true : false,
		'isMiddleCircle' => (!empty($access_levels['isMiddleCircle']) && array_key_exists($username, $access_levels['isMiddleCircle'])) ? true : false,
		'isMiddleCircleAdmin' => (!empty($access_levels['isMiddleCircleAdmin']) && array_key_exists($username, $access_levels['isMiddleCircleAdmin'])) ? true : false
	);

	// create firebase token for user and include additional security info
	$user_token = $tokenGen->createToken($auth_payload);

	return array('success' => true, 'pid' => $username, "fname" => $data[0]["givenname"][0], "lname" => $data[0]["sn"][0], "auth" => $auth_payload, "token" => $user_token);
}

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

	if (DISABLE_LDAP == true) {
		// just get user's data from Firebase without checking their LDAP password
		$result = getData($_POST['pid']);
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

			$result = getData($_POST['pid'], $data);

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