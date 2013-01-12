<div class="box-header"><h2>Letters of Recommendation</h2></div>
<div class="box">
	<div class="content">
		<p>Two letters of recommendation are <strong>required</strong> for your application. You may only add a maximum of <strong>three</strong> email addresses, and at least two letters must be recieved in order for you to submit your application.</p>
		<ul style="border: 1px solid #ccc; background-color: #f6f6f6">
		<?php for($x=0;$x<$count;$x++)
		{ 
			switch ($status[$x])
			{
				case 1:
					echo("<div style='margin: 8px 0' class='indi_warning'><p>Awaiting reply regarding the request sent to $email[$x]. Please make sure they check their spam folder.</p></div>");
					break;
					
				case 2:
					echo("<div style='margin: 8px 0' class='indi_success'><p>Received reply regarding the request sent to $email[$x].</p></div>");
					break;
					
				case 3:
					echo("<div style='margin: 8px 0' class='indi_error'><p>$email[$x] has indicated that they did not wish to receive your request. Your application is under formal review. If you do know $email[$x], speak to them soon and have them email <a href='mailto=cgknowle@fiu.edu'>cgknowle@fiu.edu</a>.</p></div>");
					break;
					
				default :
					echo("<div style='margin: 8px 0' class='indi_error'><p>An error was encountered with the request sent to $email[$x]. Please email <a href='mailto:cgknowle@fiu.edu?subject=FIU Honors Application: Letter of Recommendation Error'>cgknowle@fiu.edu</a></p></div>");
					break;
			}
		}

		if ($count == 0)
		{
			echo("<p><em>No requests to display</em></p>");
		}

		?>
		</ul>
		<br />
		<?php if(empty($acad['fname']) || empty($acad['lname'])){ ?>
			<div class='indi_error'><p>You need to tell us your name before we can request letters of recommendation on your behalf.</p></div> <a class="button" href='/apply/general'>Return to the Academic Information Section &raquo;</a>
		<?php }else{ ?>
			<a class="button" href='/apply/reco_add'>Add New Email</a> <a class="button" href='http://myhonors.fiu.edu/apply/'>Return to Application Home &raquo;</a>
		<?php } ?>
	</div>
</div>
<div class="clear"></div>
