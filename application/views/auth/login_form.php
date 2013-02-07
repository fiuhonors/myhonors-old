<?php
$login = array(
	'name'	=> 'login',
	'id'	=> 'login',
	'value' => set_value('login'),
	'maxlength'	=> 80,
	'size'	=> 30,
);
if ($login_by_username AND $login_by_email) {
	$login_label = 'Email or login';
} else if ($login_by_username) {
	$login_label = 'Login';
} else {
	$login_label = 'Email';
}
$password = array(
	'name'	=> 'password',
	'id'	=> 'password',
	'size'	=> 30,
);
$remember = array(
	'name'	=> 'remember',
	'id'	=> 'remember',
	'value'	=> 1,
	'checked'	=> set_value('remember'),
	'style' => 'margin:0;padding:0',
);
$captcha = array(
	'name'	=> 'captcha',
	'id'	=> 'captcha',
	'maxlength'	=> 8,
);
?>
<div class="span8 offset2" style="margin-top: 100px">

	<div class="row-fluid" ng-show="!profileData">
		<div class="span7" style="">
			<p><img src="http://placekitten.com/414/414" class="img-polaroid img-rounded" /></p>
		</div>

		<div class="span5" style="margin-top: 60px; position: relative;">
			<div class="btn-primary login-header">
				<strong>Login to FIU MyHonors</strong>
			</div>
			<div class="well well-large" style="padding-top: 70px">
				<?php echo form_open($this->uri->uri_string()); ?>
				<?php echo form_label($login_label, $login['id']); ?>
				<?php echo form_input($login); ?>
				<?php echo form_error($login['name']); ?><?php echo isset($errors[$login['name']])?$errors[$login['name']]:''; ?>
				<?php echo form_label('Password', $password['id']); ?>
				<?php echo form_password($password); ?>
				<?php echo form_error($password['name']); ?><?php echo isset($errors[$password['name']])?$errors[$password['name']]:''; ?>
				<br /><br />
				<button type="submit" class="btn btn-primary" >Login</button> <a class="btn btn-link" href="auth/forgot_password/">Forgot Password?</a>
				<?php echo form_close(); ?>
			</div>

			<?php if ($this->config->item('allow_registration', 'tank_auth')) { ?>
			<div class="pagination-centered">
				<p>Not a member? <a href="auth/register">Sign up now</a></p>
			</div>
			<?php } ?>

		</div>
	</div>

</div>