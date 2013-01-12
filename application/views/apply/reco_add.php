<div class="box-header"><h2>Letters of Recommendation</h2></div>

<?php echo form_open('apply/reco_add'); ?>

<div class="box">
	<div class="content">
		<?php echo validation_errors(); ?>
		<p>Note: these emails will be sent immediately after you click "Add"</p>
		<ul>
			<li><strong>Email Address: </strong></li>
			<li><input type="text" name="email" id="email" maxlength="50" /></li>
			<li><strong>Confirm Email Address: </strong></li>
			<li><input type="text" name="emailconf" id="emailconf" maxlength="50" /></li>
		</ul>
		<p><a href="#" class="button-submit">Add</a></p>
	</div>
</div>

<?= form_close()?>