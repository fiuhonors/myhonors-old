<?php
function _start_cas(){
	// Load the CAS lib
	$phpcas_path = "./application/helpers/CAS/";
	require_once $phpcas_path . '/CAS.php';

	// Uncomment to enable debugging
	phpCAS::setDebug();

	// Initialize phpCAS
	// phpCAS::client(CAS_VERSION_2_0, $cas_host, $cas_port, $cas_context);
	phpCAS::client(SAML_VERSION_1_1, 'auth.fiu.edu', 443, 'cas', false);
}
function logout(){
	if(phpCAS::isAuthenticated()){
		phpCAS::logout();
	}
}
function cas_version(){
	_start_cas();
	// _start_cas();
	return phpCAS::getVersion();
}
function cas_getUser(){
	_start_cas();
	if(phpCAS::isAuthenticated()){
		return phpCAS::getUser();
	}else{
		return false;
	}
}
function auth(){
	/*
	 * This function is not useful atm because we have not tested whether CI URLs can be whitelisted with FIU CAS
	*/

	// _start_cas();
	// For production use set the CA certificate that is the issuer of the cert
	// on the CAS server and uncomment the line below
	// phpCAS::setCasServerCACert($cas_server_ca_cert_path);

	// For quick testing you can disable SSL validation of the CAS server.
	// THIS SETTING IS NOT RECOMMENDED FOR PRODUCTION.
	// VALIDATING THE CAS SERVER IS CRUCIAL TO THE SECURITY OF THE CAS PROTOCOL!
	// phpCAS::setNoCasServerValidation();
	
	// phpCAS::forceAuthentication();
}
// 
?>
