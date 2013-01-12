<div class="box-header"><h2>Preview & Submit Application!</h2></div>

<div class="box">
	<div class="content">

		<!--p>Below is a compilation of your responses:</p Show, don't tell -->

		<p><strong>Academic Information</strong></p>
		<ul>
			<div style="border: 1px solid #ccc; background-color: #f6f6f6; padding: 20px;">

				<?php if((empty($acad['fname'])) || (empty($acad['lname']))){
				echo("<li class='indi_error'><p>You need to give us your name in the <a href='/apply/general'>Academic Information section</a>.</p></li>");
				$ready = false;
				}else{ ?>
				<li><p>My name is <?php echo($acad['fname'].' '.$acad['lname']); ?>.</p></li>
				<?php } ?>
				
				<?php if(empty($acad['pid'])){
				echo("<li class='indi_error'><p>You need to declare a Panther ID in the <a href='/apply/general'>Academic Information section</a>.</p></li>");
				$ready = false;
				}else{ ?>
				<li><p>My Panther ID is <?php echo($acad['pid']); ?>.</p></li>
				<?php } ?>
				<?php if(empty($acad['dobdd']) || empty($acad['dobmm']) || empty($acad['dobyyyy'])){?>
				<li class='indi_error'><p>You need to give us your date of birth in the <a href='/apply/general'>Academic Information section</a>.</p></li>
				<?php 
				$ready = false;
				}else{ ?>
				<?php switch($acad['dobmm']){
					case '01':
						$dobmmm = 'Jan';
						break;
						
					case '02':
						$dobmmm = 'Feb';
						break;
						
					case '03':
						$dobmmm = 'Mar';
						break;
						
					case '04':
						$dobmmm = 'Apr';
						break;
						
					case '05':
						$dobmmm = 'May';
						break;
						
					case '06':
						$dobmmm = 'Jun';
						break;
						
					case '07':
						$dobmmm = 'Jul';
						break;
						
					case '08':
						$dobmmm = 'Aug';
						break;
						
					case '09':
						$dobmmm = 'Sep';
						break;
						
					case '10':
						$dobmmm = 'Oct';
						break;
						
					case '11':
						$dobmmm = 'Nov';
						break;
						
					case '12':
						$dobmmm = 'Dec';
						break;
						
					default:
						$dobmmm = 'ERROR';
						break;
						
				} ?>
				<li><p>My date of birth is <?php echo($acad['dobdd'].'/'.$dobmmm.'/'.$acad['dobyyyy']); ?>.</p></li>
				<?php } ?>

				<?php if(empty($acad['major'])){?>
				<li class='indi_error'><p>You need to declare a major in the <a href='/apply/general'>Academic Information section</a>.</p></li>
				<?php }else{ ?>
				<?php } ?>
				<?php switch($acad['campus']){
					case 'm': 
						echo("<li><p>I plan to spend most of my time at MMC.</p></li>");
						break;
					case 'b': 
						echo("<li><p>I plan to spend most of my time at BBC.</p></li>");
						break;
					case 'o': 
						echo("<li><p>I plan to spend time at both MMC and BBC.</p></li>");
						break;
					default:
						echo("<li class='indi_error'><p>You need to decide which campus you'll spend your time at in the <a href='/apply/general'>Academic Information section</a>.</p></li>");
						$ready = false;
						break;
				}?>
				
				<?php if($acad['grd']) echo("<li><p>I intend to go to Graduate School.</p></li>"); ?>
				<?php if($acad['dnt']) echo("<li><p>I'm on a Pre-Dentistry degree track.</p></li>"); ?>
				<?php if($acad['law']) echo("<li><p>I'm on a Pre-Law degree track.</p></li>"); ?>
				<?php if($acad['med']) echo("<li><p>I'm on a Pre-Medical degree track.</p></li>"); ?>
				<?php if($acad['prm']) echo("<li><p>I'm on a Pre-Pharmaceutical degree track.</p></li>"); ?>
				<?php if($acad['phy']) echo("<li><p>I'm on a Pre-Physical Therapy degree track.</p></li>"); ?>
				<?php if($acad['vet']) echo("<li><p>I'm on a Pre-Veterinary degree track.</p></li>"); ?>
				
				<?php switch($acad['housing']){
					case '2': 
						echo("<li><p>I plan to live on campus.</p></li>");
						break;
					case '1': 
						echo("<li><p>I do not plan to live on campus.</p></li>");
						break;
					default:
						echo("<li class='indi_error'><p>You need to decide whether or not you will live on campus and let us know in the <a href='/apply/general'>Academic Information section</a>.</p></li>");
						$ready = false;
						break;
				}?>
				<?php if(!empty($acad['semester'])){
					switch($acad['semester']){
						case 'F': 
							$acad['semester'] = 'Fall';
							break;
						case 'P': 
							$acad['semester'] = 'Spring';
							break;
						case 'U': 
							$acad['semester'] = 'Summer';
							break;
						default: 
							unset($acad['semester']);
							break;
					}
				}?>
				<?php if((!empty($acad['semester']))&&(!empty($acad['year']))){?>
					<li><p>I intend to graduate in the <?php echo($acad['semester']); ?> of <?php echo($acad['year']); ?>.</p></li>
				<?php }elseif(!empty($acad['year'])){?>
					<li><p>I intend to graduate sometime in <?php echo($acad['year']); ?>.</p></li>
				<?php }else{?>
					<li><p>I'm not sure when I will graduate.</p></li>
				<?php }?>

				<?php if(empty($acad['dualdegree'])) { ?>
					<li class='indi_error'><p>You need to indicate whether you've attended a dual-degree earning program in the <a href='/apply/general'>Academic Information section</a>.</p></li>
				<?php } else if ($acad['dualdegree'] == "n") { ?>
					<li><p>I did not attend a dual-degree earning program while in high school.</p></li>
				<?php } else { ?>
					<li><p>I attended a dual-degree earning program while in high school.</p></li>
				<?php } ?>

				<?php if(empty($acad['transfer'])) { ?>
					<li class='indi_error'><p>You need to indicate whether you're a transfer student in the <a href='/apply/general'>Academic Information section</a>.</p></li>
				<?php } else if ($acad['transfer'] == 1) { ?>
					<li><p>I am not a transfer student.</p></li>
				<?php } else { ?>
					<li><p>I am a transfer student.</p></li>
				<?php } ?>

				<?php if(empty($acad['how'])){
					echo("<li class='indi_error'><p>You need to let us know where you heard about the Honors College from in the <a href='/apply/general'>Academic Information section</a>.</p></li>");
					$ready = false;
				}else{
					switch($acad['how']){
						case '1': 
							$acad['how'] = 'Automatic Admission';
							break;
						case '2': 
							$acad['how'] = 'CAP Advisor';
							break;
						case '3': 
							$acad['how'] = 'College Fair';
							break;
						case '4': 
							$acad['how'] = 'From a Friend';
							break;
						case '5': 
							$acad['how'] = 'Honors College Recruiter';
							break;
						case '6': 
							$acad['how'] = 'Website';
							break;
						case '7': 
							$acad['how'] = 'Information Sessions';
							break;
						case '8': 
							$acad['how'] = 'Invitation from Honors College';
							break;
						case '9': 
							$acad['how'] = 'somewhere we don\'t track';
							break;
						case '10': 
							$acad['how'] = 'Word of Mouth';
							break;
						default:
							unset($acad['how']);
							break;
					}
					echo("<li><p>I learned about the Honors College from ".$acad['how'].".</p></li>");
				}?>
			</div>
		</ul>

		<p><strong>Resume</strong></p>
		<ul>
			<div style="border: 1px solid #ccc; background-color: #f6f6f6; padding: 20px">
				<?php if(empty($extr)){ ?>
					<li class='indi_error'><p>You didn't add any resume items. You need to add something to your resume in the <a href='/apply/resume'>Resume section</a>.</p></li>
					<?php $ready = false; ?>
				<?php }else{ ?>
				<?php
					foreach($extr as $item){
						echo("<p>".$item['name']);
						if(!empty($item['spec'])) echo(" - <em>".$item['spec']."</em></p>");
					}
				} ?>
			</div>
		</ul>

		<p><strong>Documents</strong></p>
		<ul>
			<div style="border: 1px solid #ccc; background-color: #f6f6f6; padding: 20px">
			<?php

				$foundFirst = false;
				$foundSecond = false;

				$requireTranscripts = ($acad['transfer'] == 2) ? true : false;
				$foundTranscripts = false;

				// search to see if required files were uploaded and not deleted
				foreach ($essa as $document) {
					if ($document['prompt'] == 4) {$foundFirst = true;}
					if ($document['prompt'] == 1 || $document['prompt'] == 2 || $document['prompt'] == 3) {$foundSecond = true;}
					if ($document['prompt'] == 5) {$foundTranscripts = true;}
				}

				if (!$foundFirst)
				{
					echo("<li class='indi_error'><p>You're missing the required \"Why do you want to join the Honors College\" essay. Go to the <a href='/apply/documents'>Documents section</a> to upload it.</p></li>");
					$ready = false;
				}

				if (!$foundSecond)
				{
					echo("<li class='indi_error'><p>You're missing your second essay. Choose from any of the three prompts found in the <a href='/apply/documents'>Documents section</a>.</p></li>");
						$ready = false;
				}

				if ($requireTranscripts && !$foundTranscripts)
				{
					echo("<li class='indi_error'><p>You're missing unofficial transcripts. Please upload an unofficial transcript from each of your prior institutions on the <a href='/apply/documents'>Documents section</a>.</p></li>");
					$ready = false;
				}

				foreach ($essa as $upload)
				{
					$prompts = array('1' => 'Individual Creativity','2' => 'Current Events','3' => 'Overcoming Adversity','4' => 'Why do you want to join the Honors College?','5' => 'Unofficial Transcript');
					echo("<li><p>I uploaded \"".$upload['orig']."\" as a response to \"" . $prompts[$upload['prompt']] . "\"</p></li>");
				}
			?>
			</div>
		</ul>

		<p><strong>Letters of Recommendation</strong></p>
		<ul>
			<div style="border: 1px solid #ccc; background-color: #f6f6f6; padding: 20px">
			<?php
				if(empty($reco)){
					echo("<li class='indi_error'><p>You didn't request any letters of recommendation. You need to request two by using the <a href='/apply/recommendations'>Letters of Recomendation section</a>.</p></li>");
					$ready = false;
				}else{
					$i = 0;
					foreach($reco as $letter){
						if($letter['flag'] == 2){
							echo("<li><p>We received a letter of recommendation from ".$letter['email'].".</p></li>");
						}elseif($letter['flag'] == 1){
							echo("<li class='indi_warning'><p>You have an outstanding request for a letter of recommendation from ".$letter['email'].". Check back here when it comes in to finish.</p></li>");
							$ready = false;
						}
						$i++;
					}
					if($i < 2){
						echo("<li class='indi_error'><p>We're still missing a recommendation for you. Request one by using the <a href='/apply/recommendations'>Letters of Recomendation section</a></p></li>");
						$ready = false;
					}
				}
			?>
			</div>
		</ul>
	</div>
</div>

<div class="box">
	<div class="content center">
	<?php
	if($acad['submitted'] == 1){
		echo("<div class='indi_success'><p>It looks like you've already submitted your application. You can't submit your application again this semester. If you need to, you can reapply next term.</p></div>");
	}else{
		if(!$ready){
			echo("<div class='indi_error'><p>Your application is missing required data and can not be submitted yet.</p></div>");
		}else{
			if($acad['transfer'] == 2){
				echo("<div class='indi_warning'><p>You indicated that you are a transfer student. It's very important that you include unofficial transcripts from each institution you previously attended. If you've done that, feel free to submit your application with the button below.</p></div>");
			}elseif($acad['transfer'] == 1){
				echo("<div class='indi_success'><p>Your application is missing only optional data. You can still make changes or you can submit your application with the button below.</p></div>");
			}
			echo(form_open('/apply/preview'));
			echo("<input type='hidden' name='hidden' value='true' />");
			echo("<p><a href='#' class='button-submit' style='margin: 10px; padding: 20px'>Submit your Application</a></p>");
			echo(form_close());
		}
	}
	?>
	</div>
</div>