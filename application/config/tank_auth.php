<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

/*
|--------------------------------------------------------------------------
| Website details
|
| These details are used in emails sent by authentication library.
|--------------------------------------------------------------------------
*/
$config['website_name'] = 'Tank Auth';
$config['webmaster_email'] = 'admin@yoursite.com';

/*
|--------------------------------------------------------------------------
| Blacklisted usernames
|
| 'username_blacklist' = Usernames which will be blocked upon registration
| 'username_blacklist_prepend' = Each item will be appended to each element of 'username_blacklist' (increasing the # of blacklisted usernames)
| 'username_exceptions' = Allow these names even if they're in the total list of blacklisted usernames
|
|--------------------------------------------------------------------------
*/
// Blacklisted usernames
$config['username_blacklist'] = array('admin', 'administrator', 'mod', 'moderator', 'root');
$config['username_blacklist_prepend'] = array('the', 'sys', 'system', 'site', 'super');
$config['username_exceptions'] = array();

/*
|--------------------------------------------------------------------------
| Custom registration fields
|
| Add custom fields to your registration page. See full instructions on how to
| properly use this at https://github.com/enchance/Tank-Auth#custom-registration-fields
|
|--------------------------------------------------------------------------
*/
/*
// Sample fields. Add as many as you like and customize as needed. View README.md for more info and how to use.
$config['registration_fields'][] = array('name', 'Full name', 'trim|required', 'text');
$config['registration_fields'][] = array('website', 'Website', 'trim|required', 'text', array('class'=>'something'));

$config['registration_fields'][] = array('gender', 'Gender', 'trim|required|alpha|max_length[1]', 'radio', array('m'=>'Male', 'f'=>'Female'), '<p>', '</p>');
$config['registration_fields'][] = array('checkit', 'Do you want money?', 'trim|numeric', 'checkbox', 'I want money');

$config['registration_fields'][] = array('country', 'Country', 'trim|required|callback__not_zero', 'dropdown', array('0'=>'- choose -', 'US'=>'USA', 'PH'=>'Philippines'));
$config['registration_fields'][] = array('category', 'Categories', 'trim|required|callback__not_zero', 'dropdown', '[table.field1, table.field2]');
*/

/*
|--------------------------------------------------------------------------
| Landing pages
|
| List of landing pages for redirection. I had this separated so you can eventually redirect it
| to your own controller with flashdata to restrict its viewing.
|--------------------------------------------------------------------------
*/
$config['login-success'] = 'welcome';
$config['logout-success'] = FALSE; // Set FALSE for landing page in /views/landing/, '' for home, or 'controller' for your custom controller

/*
|--------------------------------------------------------------------------
| Security settings
|
| The library uses PasswordHash library for operating with hashed passwords.
| 'phpass_hash_portable' = Can passwords be dumped and exported to another server. If set to FALSE then you won't be able to use this database on another server.
| 'phpass_hash_strength' = Password hash strength.
|--------------------------------------------------------------------------
*/
$config['phpass_hash_portable'] = FALSE;
$config['phpass_hash_strength'] = 8;

/*
|--------------------------------------------------------------------------
| Registration settings
|
| 'allow_registration' = Registration is enabled or not
| 'captcha_registration' = Registration uses CAPTCHA
| 'email_activation' = Requires user to activate their account using email after registration.
| 'email_activation_expire' = Time before users who don't activate their account getting deleted from database. Default is 48 hours (60*60*24*2).
| 'email_account_details' = Email with account details is sent after registration (only when 'email_activation' is FALSE).
| 'use_username' = Username is required or not.
|
| 'username_min_length' = Min length of user's username.
| 'username_max_length' = Max length of user's username.
| 'password_min_length' = Min length of user's password.
| 'password_max_length' = Max length of user's password.
|--------------------------------------------------------------------------
*/
$config['allow_registration'] = TRUE;
$config['captcha_registration'] = TRUE;
$config['email_activation'] = TRUE;
$config['email_activation_expire'] = 60*60*24*2;
$config['email_account_details'] = FALSE;
$config['use_username'] = TRUE;

// To manually approve accounts, set this to FALSE
$config['acct_approval'] = TRUE;

$config['username_min_length'] = 4;
$config['username_max_length'] = 20;
$config['password_min_length'] = 4;
$config['password_max_length'] = 20;

/*
|--------------------------------------------------------------------------
| Login settings
|
| 'login_by_username' = Username can be used to login.
| 'login_by_email' = Email can be used to login.
| You have to set at least one of 2 settings above to TRUE.
| 'login_by_username' makes sense only when 'use_username' is TRUE.
|
| 'login_record_ip' = Save in database user IP address on user login.
| 'login_record_time' = Save in database current time on user login.
|
| 'login_count_attempts' = Count failed login attempts.
| 'login_max_attempts' = Number of failed login attempts before CAPTCHA will be shown.
| 'login_attempt_expire' = Time to live for every attempt to login. Default is 24 hours (60*60*24).
|--------------------------------------------------------------------------
*/
$config['login_by_username'] = TRUE;
$config['login_by_email'] = TRUE;
$config['login_record_ip'] = TRUE;
$config['login_record_time'] = TRUE;
$config['login_count_attempts'] = TRUE;
$config['login_max_attempts'] = 5;
$config['login_attempt_expire'] = 60*60*24;

/*
|--------------------------------------------------------------------------
| Auto login settings
|
| 'autologin_cookie_name' = Auto login cookie name.
| 'autologin_cookie_life' = Auto login cookie life before expired. Default is 2 months (60*60*24*31*2).
|--------------------------------------------------------------------------
*/
$config['autologin_cookie_name'] = 'autologin';
$config['autologin_cookie_life'] = 60*60*24*31*2;

/*
|--------------------------------------------------------------------------
| Forgot password settings
|
| 'forgot_password_expire' = Time before forgot password key become invalid. Default is 15 minutes (60*15).
|--------------------------------------------------------------------------
*/
$config['forgot_password_expire'] = 60*15;

/*
|--------------------------------------------------------------------------
| Cool Captcha settings
|
| When upgraidng Cool Captcha, simple replace the contents of the captcha folder
| with the new version. No editing required.
|--------------------------------------------------------------------------
*/
$config['cool_captcha_folder'] = 'captcha';

/*
|--------------------------------------------------------------------------
| reCAPTCHA
|
| 'use_recaptcha' = Use reCAPTCHA instead of common captcha
| You can get reCAPTCHA keys by registering at http://recaptcha.net
|--------------------------------------------------------------------------
*/
$config['use_recaptcha'] = FALSE;
$config['recaptcha_public_key'] = '';
$config['recaptcha_private_key'] = '';

/*
|--------------------------------------------------------------------------
| Database settings
|
| 'db_table_prefix' = Table prefix that will be prepended to every table name used by the library
| (except 'ci_sessions' table).
|--------------------------------------------------------------------------
*/
$config['db_table_prefix'] = '';


/* End of file tank_auth.php */
/* Location: ./application/config/tank_auth.php */