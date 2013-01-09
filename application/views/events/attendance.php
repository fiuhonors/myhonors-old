<?php echo validation_errors(); ?>
<?php echo form_open('events/attendance'); ?>

<p><strong>Panther ID:</strong></p>

<input type="text" name="userid" value="" size="7" />
<input type="submit" value="Submit" />

<?=form_close();?>