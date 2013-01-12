<div class="box-header"><h2>Edit Resume Item</h2></div>

<?php echo form_open("/apply/resu_edit/".$id); ?>

<div class="box">
	<div class="content">
		<?php echo validation_errors(); ?>
		<ul>
			<li><strong>Title:</strong></li>
			<li><input type="text" name="name" size="50" maxlength="100" <?php echo("value=\"".set_value('name', $name)."\""); ?> /></li>
			<li><strong>Dates:</strong></li>
			<li>
				From&nbsp;
				<select name="fmonth">
					<option value="1" <?php if($fmonth == '1') echo("selected='selected'"); ?> >Jan</option>
					<option value="2" <?php if($fmonth == '2') echo("selected='selected'"); ?> >Feb</option>
					<option value="3" <?php if($fmonth == '3') echo("selected='selected'"); ?> >Mar</option>
					<option value="4" <?php if($fmonth == '4') echo("selected='selected'"); ?> >Apr</option>
					<option value="5" <?php if($fmonth == '5') echo("selected='selected'"); ?> >May</option>
					<option value="6" <?php if($fmonth == '6') echo("selected='selected'"); ?> >Jun</option>
					<option value="7" <?php if($fmonth == '7') echo("selected='selected'"); ?> >Jul</option>
					<option value="8" <?php if($fmonth == '8') echo("selected='selected'"); ?> >Aug</option>
					<option value="9" <?php if($fmonth == '9') echo("selected='selected'"); ?> >Sep</option>
					<option value="A" <?php if($fmonth == 'A') echo("selected='selected'"); ?> >Oct</option>
					<option value="B" <?php if($fmonth == 'B') echo("selected='selected'"); ?> >Nov</option>
					<option value="C" <?php if($fmonth == 'C') echo("selected='selected'"); ?> >Dec</option>
				</select>
				<select name="fyear">
					<option value="8" <?php if($fyear == '8') echo("selected='selected'"); ?> >2008</option>
					<option value="9" <?php if($fyear == '9') echo("selected='selected'"); ?> >2009</option>
					<option value="A" <?php if($fyear == 'A') echo("selected='selected'"); ?> >2010</option>
					<option value="B" <?php if($fyear == 'B') echo("selected='selected'"); ?> >2011</option>
					<option value="C" <?php if($fyear == 'C') echo("selected='selected'"); ?> >2012</option>
				</select>
				&nbsp;to&nbsp; 
				<select name="emonth">
					<option value="1" <?php if($emonth == '1') echo("selected='selected'"); ?> >Jan</option>
					<option value="2" <?php if($emonth == '2') echo("selected='selected'"); ?> >Feb</option>
					<option value="3" <?php if($emonth == '3') echo("selected='selected'"); ?> >Mar</option>
					<option value="4" <?php if($emonth == '4') echo("selected='selected'"); ?> >Apr</option>
					<option value="5" <?php if($emonth == '5') echo("selected='selected'"); ?> >May</option>
					<option value="6" <?php if($emonth == '6') echo("selected='selected'"); ?> >Jun</option>
					<option value="7" <?php if($emonth == '7') echo("selected='selected'"); ?> >Jul</option>
					<option value="8" <?php if($emonth == '8') echo("selected='selected'"); ?> >Aug</option>
					<option value="9" <?php if($emonth == '9') echo("selected='selected'"); ?> >Sep</option>
					<option value="A" <?php if($emonth == 'A') echo("selected='selected'"); ?> >Oct</option>
					<option value="B" <?php if($emonth == 'B') echo("selected='selected'"); ?> >Nov</option>
					<option value="C" <?php if($emonth == 'C') echo("selected='selected'"); ?> >Dec</option>
				</select>
				<select name="eyear">
					<option value="8" <?php if($eyear == '8') echo("selected='selected'"); ?> >2008</option>
					<option value="9" <?php if($eyear == '9') echo("selected='selected'"); ?> >2009</option>
					<option value="A" <?php if($eyear == 'A') echo("selected='selected'"); ?> >2010</option>
					<option value="B" <?php if($eyear == 'B') echo("selected='selected'"); ?> >2011</option>
					<option value="C" <?php if($eyear == 'C') echo("selected='selected'"); ?> >2012</option>
				</select>
			</li>
			<li><strong>Please briefly describe your experience:</strong></li>
			<li><textarea name="spec" cols="50" rows="5" maxlength="300"><?php echo("$spec"); ?></textarea></li>
			<li>&nbsp;</li>
			<li><strong>Direct Supervisor and Contact Info</strong></li>
			<li>
				<label for="name">Full Name</label><br />
				<input type="text" id="name" name="pocname" maxlength="25" <?php echo("value=\"".set_value('pocname', $pocname)."\""); ?> /><br />
				<label for="phone">Phone</label><br />
				<input type="text" id="phone" name="pocnum" maxlength="10" <?php echo("value=\"".set_value('pocnum', $pocnum)."\""); ?> /><br />
				<label for="email">Email</label><br />
				<input type="text" id="email" name="pocemail" maxlength="35" <?php echo("value=\"".set_value('pocemail', $pocemail)."\""); ?> /><br />
			</li>
			<li>&nbsp;</li>
			<li><strong>On average, how many hours per week did you dedicate to this activity?</strong></li>
			<li><input type="number" name="hours" <?php echo("value='".set_value('hours', $hours)."'"); ?> /></li>
			<li><strong>What did you learn from this experience?</strong></li>
			<li><textarea name="learn" cols="50" rows="5" maxlength="300"><?php echo("$learn"); ?></textarea></li>
		</ul>
	</div>
</div>
<div class="box">
	<div class="content">
		<a href="#" class="button-submit">Save & Return to Resume &raquo;</a>
		or <a href="<?php if (empty($name)) { echo "/apply/resu_remove/" . $id; } else { echo "/apply/resume"; } ?>" class="button-small">Cancel</a>
	</div>
</div>
<?= form_close()?>
<div class="clear"></div>
<div class="grid_17" style="height: 20px"></div>
<div class="clear"></div>