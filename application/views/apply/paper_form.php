<div class='grid_12 prefix_6 suffix_6'>
<div class='box-header'>
	<h2>Request a Paper Application</h2>
</div>
<div class='box'>
	<?php if(validation_errors()){
		echo("<div class='indi_error'>".validation_errors()."</div>");
	}?>
	<?php echo(form_open('apply/paper')); ?>
	<p>
		To request a paper application, type in your email address and reason for request below, then submit.
		<br />
		You should receive a copy shortly.
		<br />
		<input name='email' id='email' type='text' placeholder='Email' />
		<br />
		<textarea name='reason' id='reason' placeholder='Reason for Request' style='margin:5px 0;padding:8px;font-family: Verdana, Geneva, sans-serif;width:330px;height:50px'></textarea>
		<br />
		<button class='button'>Submit</button>
	</p>
	</form>
</div>
</div>
