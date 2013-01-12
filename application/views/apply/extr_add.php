<?= "<h1>$title </h1>"?>
<div class="grid_4">
<?php echo validation_errors(); ?>
<?php echo form_open('app/resume/add'); ?>
<p><h2>What did you do?</h2><input type="text" name="name" /></p>
<h2>When did you do this?</h2>
<p>From
<select name="fmonth">
<option value="Jan" >Jan</option>
<option value="Feb" >Feb</option>
<option value="Mar" >Mar</option>
<option value="Apr" >Apr</option>
<option value="May" >May</option>
<option value="Jun" >Jun</option>
<option value="Jul" >Jul</option>
<option value="Aug" >Aug</option>
<option value="Sep" >Sep</option>
<option value="Oct" >Oct</option>
<option value="Nov" >Nov</option>
<option value="Dec" >Dec</option>
</select>
<select name="fyear">
<option value="2012" >2012</option>
<option value="2011" >2011</option>
<option value="2010" >2010</option>
<option value="2009" >2009</option>
<option value="2008" >2008</option>
</select>
 To
 <select name="emonth">
<option value="Jan" >Jan</option>
<option value="Feb" >Feb</option>
<option value="Mar" >Mar</option>
<option value="Apr" >Apr</option>
<option value="May" >May</option>
<option value="Jun" >Jun</option>
<option value="Jul" >Jul</option>
<option value="Aug" >Aug</option>
<option value="Sep" >Sep</option>
<option value="Oct" >Oct</option>
<option value="Nov" >Nov</option>
<option value="Dec" >Dec</option>
</select>
<select name="eyear">
<option value="2012" >2012</option>
<option value="2011" >2011</option>
<option value="2010" >2010</option>
<option value="2009" >2009</option>
<option value="2008" >2008</option>
</select>
</p>
<p><h2>Specifically, what did you do?</h2><textarea name="spec"></textarea></p>
<h2>Who was your direct superior and how can we contact them?</h2>
<p>Name<input type="text" name="pocname" /> Phone<input type="text" name="pocnum" /> Email<input type="text" name="pocemail" /></p>
<p><h2>How many hours did you volunteer (if applicable)?</h2><input type="text" name="hours" /></p>
<p><h2>What did you learn from this experience?</h2><textarea name="learn"></textarea></p>
<input type="submit" value="Submit" />
<?= form_close()?>
</div>
<div class="clear"></div>