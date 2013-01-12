<div class="box-header"><h2>Academic Information</h2></div>

<?php echo form_open('apply/general'); ?>

<div class="box">
	<div class="content">
	<?php // echo validation_errors(); ?>
	<input type="hidden" name="hidden" value="true" />
	<input type="hidden" name="hidden2" value="true" />
	<p>
		<strong>What is your first name?</strong><br />
		<input type="text" name="fname" maxlength="25" size="15" value="<?php echo set_value('fname', $fname); ?>" /><br />
	</p>
	<p>
		<strong>What is your last name?</strong><br />
		<input type="text" name="lname" maxlength="25" size="15" value="<?php echo set_value('lname', $lname); ?>" /><br />
	</p>
	<p>
		<strong>What is your date of birth?</strong><br />
		<select name="dobmm">
			<option value="">Month</option>
			<option value="01" <?php if($dobmm == '01') echo("selected='selected'"); ?> >Jan</option>
			<option value="02" <?php if($dobmm == '02') echo("selected='selected'"); ?> >Feb</option>
			<option value="03" <?php if($dobmm == '03') echo("selected='selected'"); ?> >Mar</option>
			<option value="04" <?php if($dobmm == '04') echo("selected='selected'"); ?> >Apr</option>
			<option value="05" <?php if($dobmm == '05') echo("selected='selected'"); ?> >May</option>
			<option value="06" <?php if($dobmm == '06') echo("selected='selected'"); ?> >June</option>
			<option value="07" <?php if($dobmm == '07') echo("selected='selected'"); ?> >Jul</option>
			<option value="08" <?php if($dobmm == '08') echo("selected='selected'"); ?> >Aug</option>
			<option value="09" <?php if($dobmm == '09') echo("selected='selected'"); ?> >Sept</option>
			<option value="10" <?php if($dobmm == '10') echo("selected='selected'"); ?> >Oct</option>
			<option value="11" <?php if($dobmm == '11') echo("selected='selected'"); ?> >Nov</option>
			<option value="12" <?php if($dobmm == '12') echo("selected='selected'"); ?> >Dec</option>
		</select>
		<select name="dobdd">
			<option value="">Day</option>
			<option value="01" <?php if($dobdd == '01') echo("selected='selected'"); ?> >1</option>
			<option value="02" <?php if($dobdd == '02') echo("selected='selected'"); ?> >2</option>
			<option value="03" <?php if($dobdd == '03') echo("selected='selected'"); ?> >3</option>
			<option value="04" <?php if($dobdd == '04') echo("selected='selected'"); ?> >4</option>
			<option value="05" <?php if($dobdd == '05') echo("selected='selected'"); ?> >5</option>
			<option value="06" <?php if($dobdd == '06') echo("selected='selected'"); ?> >6</option>
			<option value="07" <?php if($dobdd == '07') echo("selected='selected'"); ?> >7</option>
			<option value="08" <?php if($dobdd == '08') echo("selected='selected'"); ?> >8</option>
			<option value="09" <?php if($dobdd == '09') echo("selected='selected'"); ?> >9</option>
			<option value="10" <?php if($dobdd == '10') echo("selected='selected'"); ?> >10</option>
			<option value="11" <?php if($dobdd == '11') echo("selected='selected'"); ?> >11</option>
			<option value="12" <?php if($dobdd == '12') echo("selected='selected'"); ?> >12</option>
			<option value="13" <?php if($dobdd == '13') echo("selected='selected'"); ?> >13</option>
			<option value="14" <?php if($dobdd == '14') echo("selected='selected'"); ?> >14</option>
			<option value="15" <?php if($dobdd == '15') echo("selected='selected'"); ?> >15</option>
			<option value="16" <?php if($dobdd == '16') echo("selected='selected'"); ?> >16</option>
			<option value="17" <?php if($dobdd == '17') echo("selected='selected'"); ?> >17</option>
			<option value="18" <?php if($dobdd == '18') echo("selected='selected'"); ?> >18</option>
			<option value="19" <?php if($dobdd == '19') echo("selected='selected'"); ?> >19</option>
			<option value="20" <?php if($dobdd == '20') echo("selected='selected'"); ?> >20</option>
			<option value="21" <?php if($dobdd == '21') echo("selected='selected'"); ?> >21</option>
			<option value="22" <?php if($dobdd == '22') echo("selected='selected'"); ?> >22</option>
			<option value="23" <?php if($dobdd == '23') echo("selected='selected'"); ?> >23</option>
			<option value="24" <?php if($dobdd == '24') echo("selected='selected'"); ?> >24</option>
			<option value="25" <?php if($dobdd == '25') echo("selected='selected'"); ?> >25</option>
			<option value="26" <?php if($dobdd == '26') echo("selected='selected'"); ?> >26</option>
			<option value="27" <?php if($dobdd == '27') echo("selected='selected'"); ?> >27</option>
			<option value="28" <?php if($dobdd == '28') echo("selected='selected'"); ?> >28</option>
			<option value="29" <?php if($dobdd == '29') echo("selected='selected'"); ?> >29</option>
			<option value="30" <?php if($dobdd == '30') echo("selected='selected'"); ?> >30</option>
			<option value="31" <?php if($dobdd == '31') echo("selected='selected'"); ?> >31</option>
		</select>
		<input type="text" name="dobyyyy" maxlength="4" size="4" value="<?php echo set_value('dobyyyy', $dobyyyy); ?>" /><br />
	</p>
	<p>
		<strong>What is your Panther ID?</strong><br />
		<input type="text" name="pid" maxlength="7" size="7" value="<?php echo set_value('pid', $pid); ?>" /><br />
		<span>You should have recieved this number when you applied to FIU.</span>
	</p>
	<p>
		<strong>What is your declared major?</strong><br />
		<input type="text" name="major" maxlength="100" size="50" value="<?php echo set_value('major', $major); ?>" /><br />
		<span>If unsure, write <em>Exploratory</em></span>
	</p>

	<ul>
		<li><strong>Select all that apply:</strong></li>
		<li>
			<input type="checkbox" id="grd" name="grd" value="1" <?php if($grd == 1){echo("checked");} ?> />
			<label for="grd">Graduate School</label>
		</li>
		<li>
			<input type="checkbox" id="dnt" name="dnt" value="1" <?php if($dnt == 1){echo("checked");} ?> />
			<label for="dnt">Pre-Dentistry</label>
		</li>
		<li>
			<input type="checkbox" id="law" name="law" value="1" <?php if($law == 1){echo("checked");} ?> />
			<label for="law">Pre-Law</label>
		</li>
		<li>
			<input type="checkbox" id="med" name="med" value="1" <?php if($med == 1){echo("checked");} ?> />
			<label for="med">Pre-Medical</label>
		</li>
		<li>
			<input type="checkbox" id="prm" name="prm" value="1" <?php if($prm == 1){echo("checked");} ?> />
			<label for="prm">Pre-Pharmacy</label>
		</li>
		<li>
			<input type="checkbox" id="phy" name="phy" value="1" <?php if($phy == 1){echo("checked");} ?> />
			<label for="phy">Pre-Physical Therapy</label>
		</li>
		<li>
			<input type="checkbox" id="vet" name="vet" value="1" <?php if($vet == 1){echo("checked");} ?> />
			<label for="vet">Pre-Veterinary</label>
		</li>
	</ul>
	</div>
</div>
<div class="box">
	<div class="content">
		<ul>
			<li><strong>Do you intend to live on campus?</strong></li>
			<li>
				<input type="radio" name="housing" id="yes" value="2" <?php if($housing == 2){echo("checked");} ?>/>
				<label for="yes">Yes</label>
				<input type="radio" name="housing" id="no" value="1" <?php if($housing == 1){echo("checked");} ?>/>
				<label for="no">No</label>
			</li>
		</ul>
		
		<ul>
			<li><strong>What campus do you intend to frequent?</strong></li>
			<li>
				<input type="radio" name="campus" id="mmc" value="m" <?php if($campus == "m"){echo("checked");} ?>/>
				<label for="mmc">MMC</label>
				<input type="radio" name="campus" id="bbc" value="b" <?php if($campus == "b"){echo("checked");} ?>/>
				<label for="bbc">BBC</label>
				<input type="radio" name="campus" id="both" value="o" <?php if($campus == "o"){echo("checked");} ?>/>
				<label for="both">Both</label>
			</li>
		</ul>
	</div>
</div>
<div class="box">
	<div class="content">
		<ul>
			<li><strong>What semester & year do you intend to graduate?</strong></li>
			<li>
				<select name="semester">
					<option value="">Choose One</option>
					<option value="U" <?php if($semester == 'U') echo("selected='selected'"); ?> >Summer</option>
					<option value="F" <?php if($semester == 'F') echo("selected='selected'"); ?> >Fall</option>
					<option value="P" <?php if($semester == 'P') echo("selected='selected'"); ?> >Spring</option>
					<option value="N" <?php if($semester == 'N') echo("selected='selected'"); ?> >Uncertain</option>
				</select>
				&nbsp;&nbsp;of&nbsp;&nbsp;<input type="text" name="year" size="1" maxlength="4" value="<?php echo set_value('year', $year); ?>" placeholder="20__" />
			</li>
		</ul>
	</div>
</div>
<div class="box">
	<div class="content">
		<ul>
			<li>
			<strong>Did you attend a dual-degree earning program while in high school?</strong></li>
			<li>
				<input type="radio" id="nodual" name="dualdegree" value="n" <?php if($dualdegree == 'n'){echo("checked");} ?> />
				<label for="nodual">No, I did not.</label>
			</li>
			<li>
				<input type="radio" id="sas" name="dualdegree" value="s" <?php if($dualdegree == 's'){echo("checked");} ?> />
				<label for="sas">School for Advanced Studies (SAS)</label>
			</li>
			<li>
				<input type="radio" id="aaa" name="dualdegree" value="a" <?php if($dualdegree == 'a'){echo("checked");} ?> />
				<label for="aaa">Academy for Advanced Academics (AAA)</label>
			</li>
			<li>
				<input type="radio" id="cab" name="dualdegree" value="c" <?php if($dualdegree == 'c'){echo("checked");} ?> />
				<label for="cab">College Academy at Broward College</label>
			</li>
			<li>
				<input type="radio" id="other" name="dualdegree" value="o" <?php if($dualdegree == 'o'){echo("checked");} ?> />
				<label for="other">Other</label>
				<input type="text" name="dualdegree_other" size="25" style="padding: 3px" value="<?php echo set_value('dualdegree_other', $dualdegree_other); ?>" placeholder="Please specify..." />
			</li>
		</ul>
		<ul>
			<li><strong>Have you previously attended a class at FIU?</strong><br/></li>
			<li>
				<input type="radio" name="fiustudent" id="fius_yes" value="2" <?php if($fiustudent == 2){echo("checked");} ?>/>
				<label for="tran_yes">Yes</label>
				<input type="radio" name="fiustudent" id="fius_no" value="1" <?php if($fiustudent == 1){echo("checked");} ?>/>
				<label for="tran_no">No</label>
			</li>
		</ul>
		<ul>
			<li><strong>Are you transferring from another university?</strong><br/>(Note: transfer means students who are not in high school, who previously attended other institutions of higher learning.)</li>
			<li>
				<input type="radio" name="transfer" id="tran_yes" value="2" <?php if($transfer == 2){echo("checked");} ?>/>
				<label for="tran_yes">Yes</label>
				<input type="radio" name="transfer" id="tran_no" value="1" <?php if($transfer == 1){echo("checked");} ?>/>
				<label for="tran_no">No</label>
			</li>
		</ul>
	</div>
</div>

<div class="box">
	<div class="content">
		<strong>How did you hear about and become interested in the Honors College at FIU?</strong><br />
		<select name="how">
		<?php ?>
		<option value="0" <?php if($how == 0) echo("selected='selected'"); ?> >Choose One</option>
		<option value="10" <?php if($how == 10) echo("selected='selected'"); ?> >Word of Mouth</option>
		<option value="1" <?php if($how == 1) echo("selected='selected'"); ?> >Automatic Admission</option>
		<option value="2" <?php if($how == 2) echo("selected='selected'"); ?> >CAP Advisor</option>
		<option value="3" <?php if($how == 3) echo("selected='selected'"); ?> >College Fair</option>
		<option value="4" <?php if($how == 4) echo("selected='selected'"); ?> >From a Friend</option>
		<option value="5" <?php if($how == 5) echo("selected='selected'"); ?> >Honors College Recruiter</option>
		<option value="6" <?php if($how == 6) echo("selected='selected'"); ?> >Website</option>
		<option value="7" <?php if($how == 7) echo("selected='selected'"); ?> >Information Sessions</option>
		<option value="8" <?php if($how == 8) echo("selected='selected'"); ?> >Invitation from Honors College</option>
		<option value="9" <?php if($how == 9) echo("selected='selected'"); ?> >Other</option>
		</select>
	</div>
</div>

<div class="box">
	<div class="content">
		<a href="#" class="button-submit">Save and Continue to Next Section &raquo;</a>
	</div>
</div>

<?= form_close()?>

<div class="grid_17" style="height: 20px"></div>
<div class="clear"></div>