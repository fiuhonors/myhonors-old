<div class="box-header"><h2>Essays and Other Documents</h2></div>

<div class="box">
	<div class="content">
		<p><strong>Uploaded Documents</strong></p>
		<ul>
			<div style="border: 1px solid #ccc; padding: 5px 15px; background-color: #f6f6f6">
				<?php
				if (empty($documents)) {
					echo("<p><em>No documents to display</em></p>");
				}else{
					foreach($documents as $document){
					$prompts = array('1' => 'Individual Creativity','2' => 'Current Events','3' => 'Overcoming Adversity','4' => 'Why do you want to join the Honors College?','5' => 'Unofficial Transcript')?>
					<li style="margin: 8px 0"><?php if(empty($document['orig'])){ echo("<em>Unamed Document</em>"); }else{ echo($document['orig']); } ?> - <em><?php echo($prompts[$document['prompt']]); ?></em> <a href="/apply/docu_remove/<?php echo($document['P_KEY']); ?>" class="button-small">Remove</a></li>
				<?php }} ?>
			</div>
		</ul>
		<p><a class="button" href='/apply/docu_upload/'>Upload New Document</a> <a class="button" href='/apply/recommendations'>Continue to Next Section &raquo;</a></p>
	</div>
</div>

<?php if ($transfer == 2) {?>
<h2>Unofficial Transcripts<span class="smalltext">Required for transfer students.</span></h2>
<div class="box">
	<div class="content">
		<p>You've indicated that you're a transfer student. In addition to your essays, we require an unofficial transcript from each of your prior institutions. For each upload, select 'Unofficial Transcript' as the Document Type.</p>
	</div>
</div>
<?php } ?>

<h2>First Essay<span class="smalltext">This essay is required for all applications.</span></h2>
<div class="box">
	<div class="content">
		<p>
			<strong>Why do you want to join the Honors College?</strong><br />
			Please write a brief (300 word) response to why you want to join the Honors College. Please check your grammar, expression, and word choice carefully.
		</p>
	</div>
</div>
<h2>Second Essay<span class="smalltext">This essay is also required for all applications.</span></h2>
<div class="box">
	<div class="content">
		<p><strong><u>Choose one</u></strong> of the following topics below and write a clear, coherent argument. Your essay will be evaluated on your ability to write clearly, think logically, provide evidence for your assertions, and use of proper grammar.</p>
		<ul>
			<li><strong>1. Individual Creativity</strong></li>
			<p>Some scholars say that the highest value in Western civilization today is promoting the many-sided creativity of each individual, rather than training persons to be highly specialized experts.  Do you agree with this perspective?  What could be the negative aspects of promoting individual creativity as the highest value?</p>
			<li><strong>2. Current Events</strong></li>
			<p>Choose a currently controversial topic and discuss it in a factual, clearly argued essay.  Be certain to clearly cite your sources (in-text citations are fine) and attach an appropriate bibliography.</p>
			<li><strong>3. Overcoming Adversity</strong></li>
			<p>Tell us about a time in your life in which you overcame something adverse.  Be sure to detail how you were able to overcome the adversity, what you learned from the challenge, and how you grew.</p>
		</div>
	</div>
</div>

<div class="grid_17" style="height: 20px"></div>
<div class="clear"></div>