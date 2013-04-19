<?php

/* Config settings */

$server_address = "";
$before_username = "";
$after_username = "";
$errorStatement = "";

/* DO NOT EDIT BELOW THIS LINE */

if ($_SERVER['REQUEST_METHOD'] === 'POST')
{
	// all output after POSTing will be delivered in JSON format
	header('Content-Type: application/json');

	$ldaprdn  = $before_username . $_POST['pid'] . $after_username; // ldap rdn or dn
	$ldappass = $_POST['password']; // associated password

	// connect to ldap server
	$ldapconn = ldap_connect($server_address);

	if ($ldapconn)
	{

		// binding to ldap server
		$ldapbind = ldap_bind($ldapconn, $ldaprdn, $ldappass);

		// verify binding
		if ($ldapbind) {
			$result = array('success' => true);
		} else {
			$result = array('success' => false, 'error' => $errorStatement);
		}

	}
	else
	{
		$result = array('success' => false, 'error' => $errorStatement);
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