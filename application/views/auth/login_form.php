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
		<div class="span7" img-rotate>
			<img src="http://placehold.it/414&text=Image+1" class="img-polaroid img-rounded" />
			<img src="http://placehold.it/414&text=Image+2" class="img-polaroid img-rounded" />
			<img src="http://placehold.it/414&text=Image+3" class="img-polaroid img-rounded" />
		</div>

		<div class="span5" style="margin-top: 60px; position: relative;">
			<div class="btn-primary login-header">
				<strong>Login to FIU MyHonors</strong>
			</div>
			<div class="well well-large" style="padding-top: 70px">
				<?php echo form_open($this->uri->uri_string()); ?>

				<?php // this is ugly but this is how errors need to be handled for now ?>
				<?php echo isset($errors[$login['name']]) ? '<div class="alert">' . $errors[$login['name']] . '</div>' : ''; ?>
				<?php echo isset($errors[$password['name']]) ? '<div class="alert">' . $errors[$password['name']] . '</div>' : ''; ?>
				<?php echo validation_errors('<div class="alert">', '</div>'); ?>

				<?php echo form_label($login_label, $login['id']); ?>
				<?php echo form_input($login); ?>

				<?php echo form_label('Password', $password['id']); ?>
				<?php echo form_password($password); ?>

				<?php if ($show_captcha) {
					if ($use_recaptcha) { ?>
						<div id="recaptcha_image"></div>
						<a href="javascript:Recaptcha.reload()">Get another CAPTCHA</a>
						<div class="recaptcha_only_if_image"><a href="javascript:Recaptcha.switch_type('audio')">Get an audio CAPTCHA</a></div>
						<div class="recaptcha_only_if_audio"><a href="javascript:Recaptcha.switch_type('image')">Get an image CAPTCHA</a></div>
						<div class="recaptcha_only_if_image">Enter the words above</div>
						<div class="recaptcha_only_if_audio">Enter the numbers you hear</div>
						<input type="text" id="recaptcha_response_field" name="recaptcha_response_field" />
						<?php echo $recaptcha_html; ?>
					<?php } else { ?>
						<p>Enter the code exactly as it appears:</p>
						<?php echo $captcha_html; ?><br /><br />
						<?php echo form_label('Confirmation Code', $captcha['id']); ?>
						<?php echo form_input($captcha); ?>
				<?php }
				} ?>
				<br /><br />
				<button type="submit" class="btn btn-primary" >Login</button> <?php if ($this->config->item('allow_registration', 'tank_auth')) { ?><a class="btn btn-link" href="auth/forgot_password/">Forgot Password?</a><?php } ?>

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