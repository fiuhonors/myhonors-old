<div class="box-header"><h2>Essays and Other Documents</h2></div>

<?php echo form_open_multipart('apply/docu_upload');?>

<div class="box">
	<div class="content">
	<?php if(validation_errors()) echo "<div class='indi_error'>".validation_errors()."</div>"; ?>
	<?php if(!empty($error)){echo("<div class='indi_error'>".$error."</div>");} ?>
	<ul>
		<li>What document are you uploading?</li>
		<li>
			<?php if($transfer == 2) { ?>
			<input type="radio" name="prompt" id="trans" value="5">
			<label for="trans">Unofficial Transcript</label>
			<?php } ?>
		</li>
		<li>
			<input type="radio" name="prompt" id="whyjoin" value="4">
			<label for="whyjoin">Essay Response to "Why do you want to join?"</label>
		</li>
		<li>
			<input type="radio" name="prompt" id="creativity" value="1">
			<label for="creativity">Essay Response to "Individual Creativity"</label>
		</li>
		<li>
			<input type="radio" name="prompt" id="events" value="2">
			<label for="events">Essay Response to "Current Events"</label>
		</li>
		<li>
			<input type="radio" name="prompt" id="lunch" value="3">
			<label for="lunch">Essay Response to "Overcoming Adversity"</label>
		</li>
	</ul>

	<p><input type="file" name="userfile" size="20" /></p>
	<input type="hidden" name="l" value="l">
	<p><a href="#" class="button-submit" />Upload</a> (We accept the following filetypes: txt, rtf, doc, docx, pdf)</p>
	</div>
</div>

</form>