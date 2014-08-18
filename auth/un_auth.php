<?php
// If they log out of MyHonors, destroy the session site-wide so the user is also logged out of
// other MyHonors domains that are powered by PHP/Laravel
session_start();
session_name('HonorsAuth_Session');
$_SESSION = array();
session_destroy();

session_start();
session_name('laravel_session');
$_SESSION = array();
session_destroy();


?>