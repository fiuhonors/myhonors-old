<div class="box-header"><h2>Upload a Letter of Recommendation</h2></div>

<?php echo form_open_multipart('apply/reco_upload/'.$key);?>

<div class="box">
	<div class="content">
		<p>Please have your letter of recommendation include a description of academic performance and personal characteristics you witnessed in the classroom. Please include your reasons why this student would be a good addition to the Honors College at FIU. </p>
		<p><input type="file" name="userfile" size="20" /><?php if(!empty($error)){echo("<div class='indi_error'>".$error."</div>");} ?></p>
		<p>We accept the following filetypes: txt, rtf, doc, docx, pdf</p>
	</div>
</div>
<div class="box">
	<div class="content">
		<?php if(validation_errors()) echo "<div class='indi_error'>".validation_errors()."</div>"; ?>
		<p>In addition to your letter please answer the following questions:</p>

		<ul>
			<li>Your First Name</li>
			<li><input name='fname' id='fname' type="text"  value="<?php echo set_value('fname'); ?>"/></li>
			<li>Your Last Name</li>
			<li><input name='lname' id='lname' type="text"  value="<?php echo set_value('lname'); ?>"/></li>
			<li>What is your relationship to  <?php echo($acad['fname']." ".$acad['lname']); ?>?</li>
			<li><input name='relation' id='relation' type="text"  value="<?php echo set_value('relation'); ?>"/></li>
			<li>How long have you known  <?php echo($acad['fname']." ".$acad['lname']); ?>?</li>
			<li><input name='howlong' id='howlong' type="text"  value="<?php echo set_value('howlong'); ?>"/></li>
			<li>What are the first two words that come to mind when thinking about  <?php echo($acad['fname']." ".$acad['lname']); ?>?</li>
			<li><input name='word1' id='word1' type="text" value="<?php echo set_value('word1'); ?>" /> and <input name='word2' id='word2' type="text" value="<?php echo set_value('word2'); ?>" /></li>
		
			<li>If <?php echo($acad['fname']." ".$acad['lname']); ?> was your student, what grade level was he/she in when he/she enrolled into your course?</li>
			<li>
				<?php $year = 'x'; ?>
				<select name="year">
					<option value="" <?php echo set_select('year', '', ($year != 2)); ?> >Choose One</option>
					<option value="C" <?php echo set_select('year', 'C', ($year == 'C')); ?> >College</option>
					<option value="12" <?php echo set_select('year', '12', ($year == 12)); ?> >12th</option>
					<option value="11" <?php echo set_select('year', '11', ($year == 11)); ?> >11th</option>
					<option value="10" <?php echo set_select('year', '10', ($year == 10)); ?> >10th</option>
					<option value="9" <?php echo set_select('year', '9', ($year == 9)); ?> >9th</option>
					<option value="M" <?php echo set_select('year', 'M', ($year == 'M')); ?> >Before 9th grade</option>
					<option value="N" <?php echo set_select('year', 'N', ($year == 'N')); ?> >N/A</option>
				</select>
			</li>
			<li>If <?php echo($acad['fname']." ".$acad['lname']); ?> was your student, what grade did he/she earn while in your course?</li>
			<li>
				<?php $grade = 'x'; ?>
				<select name="grade">
					<option value="" <?php echo set_select('grade', '', ($grade != 2)); ?> >Choose One</option>
					<option value="A" <?php echo set_select('grade', 'A', ($grade == 'A')); ?> >A</option>
					<option value="B" <?php echo set_select('grade', 'B', ($grade == 'B')); ?> >B</option>
					<option value="C" <?php echo set_select('grade', 'C', ($grade == 'C')); ?> >C</option>
					<option value="D" <?php echo set_select('grade', 'D', ($grade == 'D')); ?> >D</option>
					<option value="F" <?php echo set_select('grade', 'F', ($grade == 'F')); ?> >F</option>
					<option value="N" <?php echo set_select('grade', 'N', ($grade == 'N')); ?> >N/A</option>
				</select>
			</li>
		</ul>
	</div>
</div>

<div class="box">
	<div class="content">		
		<ul>
			<li>What institution do you represent?</li>
			<li><input name='institution' id='institution' type="text"  value="<?php echo set_value('institution'); ?>"/></li>
			<li>What's the address of this institution?</li>
			<li><input name='st1' id='st1' type="text" placeholder="Address Line 1" value="<?php echo set_value('st1'); ?>"/></li>
			<li><input name='st2' id='st2' type="text" placeholder="Address Line 2" value="<?php echo set_value('st2'); ?>"/></li>
			<li>City</li>
			<li><input name='city' id='city' type="text" placeholder="City" value="<?php echo set_value('city'); ?>"/></li>
			<li>State</li>
			<li><input name='state' id='state' type="text" placeholder="State" value="<?php echo set_value('state'); ?>"/></li>
			<li>Zip Code</li>
			<li><input name='zip' id='zip' type="text" placeholder="Zip Code" value="<?php echo set_value('zip'); ?>"/></li>
			<li>What phone number can we call to verify your recommendation?</li>
			<li><input name='tel' id='tel' type="text" placeholder="XXX-XXX-XXXX" value="<?php echo set_value('tel'); ?>"/></li>
		</ul>
	</div>
</div>

<?php

$rate_Acad = 0;
$rate_Qual = 0;
$rate_Orig = 0;
$rate_Disc = 0;
$rate_Resp = 0;
$rate_Lead = 0;
$rate_Inde = 0;
$rate_Init = 0;
$rate_Comm = 0;
$rate_Inte = 0;

?>

<div class="box">
	<div class="content">
		<table width="100%" class="alternate-colors">
			<thead>
				<tr>
					<th></th>
					<th class="center">Top of Class<br />(top 1%)</th>
					<th class="center">Outstanding<br />(top 5%)</th>
					<th class="center">Excellent<br />(top 10%)</th>
					<th class="center">Very Good</th>
					<th class="center">Good</th>
					<th class="center">Average</th>
					<th class="center">Below Average</th>
					<th class="center">N/A</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td class="right">Academic Achievement</td>
					<td class="center"><input type="radio" name="rate_Acad" id="rate_Acad" value="8" <?php echo set_radio('rate_Acad', '8'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Acad" id="rate_Acad" value="7" <?php echo set_radio('rate_Acad', '7'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Acad" id="rate_Acad" value="6" <?php echo set_radio('rate_Acad', '6'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Acad" id="rate_Acad" value="5" <?php echo set_radio('rate_Acad', '5'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Acad" id="rate_Acad" value="4" <?php echo set_radio('rate_Acad', '4'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Acad" id="rate_Acad" value="3" <?php echo set_radio('rate_Acad', '3'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Acad" id="rate_Acad" value="2" <?php echo set_radio('rate_Acad', '2'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Acad" id="rate_Acad" value="1" <?php echo set_radio('rate_Acad', '1'); ?>/></td>
				</tr>
				<tr>
					<td class="right">Quality of Writing</td>
					<td class="center"><input type="radio" name="rate_Qual" id="rate_Qual" value="8" <?php echo set_radio('rate_Qual', '8'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Qual" id="rate_Qual" value="7" <?php echo set_radio('rate_Qual', '7'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Qual" id="rate_Qual" value="6" <?php echo set_radio('rate_Qual', '6'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Qual" id="rate_Qual" value="5" <?php echo set_radio('rate_Qual', '5'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Qual" id="rate_Qual" value="4" <?php echo set_radio('rate_Qual', '4'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Qual" id="rate_Qual" value="3" <?php echo set_radio('rate_Qual', '3'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Qual" id="rate_Qual" value="2" <?php echo set_radio('rate_Qual', '2'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Qual" id="rate_Qual" value="1" <?php echo set_radio('rate_Qual', '1'); ?>/></td>
				</tr>
				<tr>
					<td class="right">Originality & Creativity</td>
					<td class="center"><input type="radio" name="rate_Orig" id="rate_Orig" value="8" <?php echo set_radio('rate_Orig', '8'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Orig" id="rate_Orig" value="7" <?php echo set_radio('rate_Orig', '7'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Orig" id="rate_Orig" value="6" <?php echo set_radio('rate_Orig', '6'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Orig" id="rate_Orig" value="5" <?php echo set_radio('rate_Orig', '5'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Orig" id="rate_Orig" value="4" <?php echo set_radio('rate_Orig', '4'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Orig" id="rate_Orig" value="3" <?php echo set_radio('rate_Orig', '3'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Orig" id="rate_Orig" value="2" <?php echo set_radio('rate_Orig', '2'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Orig" id="rate_Orig" value="1" <?php echo set_radio('rate_Orig', '1'); ?>/></td>
				</tr>
				<tr>
					<td class="right">Discipline</td>
					<td class="center"><input type="radio" name="rate_Disc" id="rate_Disc" value="8" <?php echo set_radio('rate_Disc', '8'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Disc" id="rate_Disc" value="7" <?php echo set_radio('rate_Disc', '7'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Disc" id="rate_Disc" value="6" <?php echo set_radio('rate_Disc', '6'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Disc" id="rate_Disc" value="5" <?php echo set_radio('rate_Disc', '5'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Disc" id="rate_Disc" value="4" <?php echo set_radio('rate_Disc', '4'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Disc" id="rate_Disc" value="3" <?php echo set_radio('rate_Disc', '3'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Disc" id="rate_Disc" value="2" <?php echo set_radio('rate_Disc', '2'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Disc" id="rate_Disc" value="1" <?php echo set_radio('rate_Disc', '1'); ?>/></td>
				</tr>
				<tr>
					<td class="right">Responsibility & Maturity</td>
					<td class="center"><input type="radio" name="rate_Resp" id="rate_Resp" value="8" <?php echo set_radio('rate_Resp', '8'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Resp" id="rate_Resp" value="7" <?php echo set_radio('rate_Resp', '7'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Resp" id="rate_Resp" value="6" <?php echo set_radio('rate_Resp', '6'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Resp" id="rate_Resp" value="5" <?php echo set_radio('rate_Resp', '5'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Resp" id="rate_Resp" value="4" <?php echo set_radio('rate_Resp', '4'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Resp" id="rate_Resp" value="3" <?php echo set_radio('rate_Resp', '3'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Resp" id="rate_Resp" value="2" <?php echo set_radio('rate_Resp', '2'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Resp" id="rate_Resp" value="1" <?php echo set_radio('rate_Resp', '1'); ?>/></td>
				</tr>
				<tr>
					<td class="right">Leadership</td>
					<td class="center"><input type="radio" name="rate_Lead" id="rate_Lead" value="8" <?php echo set_radio('rate_Lead', '8'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Lead" id="rate_Lead" value="7" <?php echo set_radio('rate_Lead', '7'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Lead" id="rate_Lead" value="6" <?php echo set_radio('rate_Lead', '6'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Lead" id="rate_Lead" value="5" <?php echo set_radio('rate_Lead', '5'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Lead" id="rate_Lead" value="4" <?php echo set_radio('rate_Lead', '4'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Lead" id="rate_Lead" value="3" <?php echo set_radio('rate_Lead', '3'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Lead" id="rate_Lead" value="2" <?php echo set_radio('rate_Lead', '2'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Lead" id="rate_Lead" value="1" <?php echo set_radio('rate_Lead', '1'); ?>/></td>
				</tr>
				<tr>
					<td class="right">Independence</td>
					<td class="center"><input type="radio" name="rate_Inde" id="rate_Inde" value="8" <?php echo set_radio('rate_Inde', '8'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Inde" id="rate_Inde" value="7" <?php echo set_radio('rate_Inde', '7'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Inde" id="rate_Inde" value="6" <?php echo set_radio('rate_Inde', '6'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Inde" id="rate_Inde" value="5" <?php echo set_radio('rate_Inde', '5'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Inde" id="rate_Inde" value="4" <?php echo set_radio('rate_Inde', '4'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Inde" id="rate_Inde" value="3" <?php echo set_radio('rate_Inde', '3'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Inde" id="rate_Inde" value="2" <?php echo set_radio('rate_Inde', '2'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Inde" id="rate_Inde" value="1" <?php echo set_radio('rate_Inde', '1'); ?>/></td>
				</tr>
				<tr>
					<td class="right">Initiative</td>
					<td class="center"><input type="radio" name="rate_Init" id="rate_Init" value="8" <?php echo set_radio('rate_Init', '8'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Init" id="rate_Init" value="7" <?php echo set_radio('rate_Init', '7'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Init" id="rate_Init" value="6" <?php echo set_radio('rate_Init', '6'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Init" id="rate_Init" value="5" <?php echo set_radio('rate_Init', '5'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Init" id="rate_Init" value="4" <?php echo set_radio('rate_Init', '4'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Init" id="rate_Init" value="3" <?php echo set_radio('rate_Init', '3'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Init" id="rate_Init" value="2" <?php echo set_radio('rate_Init', '2'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Init" id="rate_Init" value="1" <?php echo set_radio('rate_Init', '1'); ?>/></td>
				</tr>
				<tr>
					<td class="right">Community Involvement</td>
					<td class="center"><input type="radio" name="rate_Comm" id="rate_Comm" value="8" <?php echo set_radio('rate_Comm', '8'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Comm" id="rate_Comm" value="7" <?php echo set_radio('rate_Comm', '7'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Comm" id="rate_Comm" value="6" <?php echo set_radio('rate_Comm', '6'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Comm" id="rate_Comm" value="5" <?php echo set_radio('rate_Comm', '5'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Comm" id="rate_Comm" value="4" <?php echo set_radio('rate_Comm', '4'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Comm" id="rate_Comm" value="3" <?php echo set_radio('rate_Comm', '3'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Comm" id="rate_Comm" value="2" <?php echo set_radio('rate_Comm', '2'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Comm" id="rate_Comm" value="1" <?php echo set_radio('rate_Comm', '1'); ?>/></td>
				</tr>
				<tr>
					<td class="right">Integrity</td>
					<td class="center"><input type="radio" name="rate_Inte" id="rate_Inte" value="8" <?php echo set_radio('rate_Inte', '8'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Inte" id="rate_Inte" value="7" <?php echo set_radio('rate_Inte', '7'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Inte" id="rate_Inte" value="6" <?php echo set_radio('rate_Inte', '6'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Inte" id="rate_Inte" value="5" <?php echo set_radio('rate_Inte', '5'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Inte" id="rate_Inte" value="4" <?php echo set_radio('rate_Inte', '4'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Inte" id="rate_Inte" value="3" <?php echo set_radio('rate_Inte', '3'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Inte" id="rate_Inte" value="2" <?php echo set_radio('rate_Inte', '2'); ?>/></td>
					<td class="center"><input type="radio" name="rate_Inte" id="rate_Inte" value="1" <?php echo set_radio('rate_Inte', '1'); ?>/></td>
				</tr>
			</tbody>
		</table>
	</div>
</div>

<div class="box">
	<div class="content center">
		<p><a href="#" class="button-submit">Submit Your Recommendation</a></p>
	</div>
</div>

</form>
</div>
