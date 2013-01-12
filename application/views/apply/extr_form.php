<div class="box-header"><h2>Resume</h2></div>
<div class="box">
	<div class="content">
		<p>Please enter all information related to your work and volunteer experiences:</p>
		<ul>
			<div style="border: 1px solid #ccc; padding: 5px 15px; background-color: #f6f6f6">
			<?php if (empty($query)) {
				echo("<p><em>No entries to display</em></p>");
			} ?>
			<?php foreach($query as $row)
			{ ?>
				<li style="margin: 8px 0"><?php if(empty($row['name'])){ echo("<em>Untitled Entry</em>"); }else{ echo($row['name']); } ?> <a href="/apply/resu_edit/<?php echo($row['P_KEY']); ?>" class="button-small">Edit</a> <a href="/apply/resu_remove/<?php echo($row['P_KEY']); ?>" class="button-small">Remove</a></li>
			<?php } ?>
			</div>
		</ul>
		<!--p>This page is automatically saved.</p What does this mean?-->
		<p><a class="button" href='/apply/resu_add'>Add New Item</a> <a href='http://myhonors.fiu.edu/apply/documents' class="button">Continue to Next Section &raquo;</a></p>
	</div>
</div>

<div class="clear"></div>