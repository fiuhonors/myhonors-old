<?php
// If they log out of MyHonors, destroy the session site-wide so the user is also logged out of
// other MyHonors domains that are powered by PHP/Laravel
session_name('HonorsAuth_Session');
session_start();
$_SESSION = array();
session_destroy();

session_name('laravel_session');
session_start();
$_SESSION = array();
session_destroy();


?>