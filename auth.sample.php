<?php

/* Config settings */

$server_address = "";
$before_username = "";
$after_username = "";
$error_statement = "";
$firebase_secret = "";

/* DO NOT EDIT BELOW THIS LINE */

include_once "FirebaseToken.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST')
{
	// all output after POSTing will be delivered in JSON format
	header('Content-Type: application/json');

	// checks for empty username/password combinations to prevent LDAP from
	// successully binding with an anonymous login
	if (!isset($_POST['pid']) || !isset($_POST['password']) || empty($_POST['pid']) || empty($_POST['password'])) {
		$result = array('success' => false, 'error' => $error_statement);
		echo json_encode($result);
		die();
	}

	$ldaprdn  = $before_username . $_POST['pid'] . $after_username; // ldap rdn or dn
	$ldappass = $_POST['password']; // associated password

	// connect to ldap server
	$ldapconn = ldap_connect($server_address);

	if ($ldapconn)
	{

		// binding to ldap server
		$ldapbind = ldap_bind($ldapconn, $ldaprdn, $ldappass);

		// verify binding
		if ($ldapbind)
		{
			$search = ldap_search($ldapconn, ($before_username . $_POST['pid'] . $after_username), "(objectClass=*)", array("givenName", "sn"));
			$data = ldap_get_entries($ldapconn, $search);

			// generate firebase token
			$tokenGen = new Services_FirebaseTokenGenerator($firebase_secret);
			$token = $tokenGen->createToken(array("id" => $_POST['pid']));

			$result = array('success' => true, 'pid' => $_POST['pid'], "fname" => $data[0]["givenname"][0], "lname" => $data[0]["sn"][0], "token" => $token);

			ldap_unbind($ldapconn);
		}
		else
		{
			$result = array('success' => false, 'error' => $error_statement);
		}

	}
	else
	{
		$result = array('success' => false, 'error' => $error_statement);
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