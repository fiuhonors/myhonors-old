		</div>

</div>

</div>
</div>

<!-- footer - we need the extra div wrapper for the sticky footer -->
<div id="footer">
	<div class="container_24">
		<div class="prefix_4 grid_16 suffix_4 center">
			<img src="http://myhonors.fiu.edu/assets/img/honors-logo.jpg" alt="Honors College - Florida International University" width="430" />
			<p class="smalltext">The Honors College (DM 233), 11200 SW 8th Street, Miami, FL 33199</p>
			<p class="smalltext">Phone: (305) 348-4100 &#8226; Fax: (305) 348-2118 &#8226; Email: <a href="mailto:honors@fiu.edu">honors@fiu.edu</a></p>
		</div>
		<div class="clear"></div>
	</div>
</div>

<script src="http://myhonors.fiu.edu/assets/lib/jquery.min.js"></script>
<script src="http://myhonors.fiu.edu/assets/lib/angular.js"></script>
<script>

$(document).ready(function(){
	var InfiniteRotator =
	    {
	        init: function()
	        {
	            //initial fade-in time (in milliseconds)
	            var initialFadeIn = 100;
	 
	            //interval between items (in milliseconds)
	            var itemInterval = 5000;
	 
	            //cross-fade time (in milliseconds)
	            var fadeTime = 500;
	 
	            //count number of items
	            var numberOfItems = $('.rotating-image').length;
	 
	            //set current item
	            var currentItem = 0;
	 
	            //show first item
	            $('.rotating-image').eq(currentItem).fadeIn(initialFadeIn);
	 
	            //loop through the items
	            var infiniteLoop = setInterval(function(){
	                $('.rotating-image').eq(currentItem).fadeOut(fadeTime);
	 
	                if(currentItem == numberOfItems -1){
	                    currentItem = 0;
	                }else{
	                    currentItem++;
	                }
	                $('.rotating-image').eq(currentItem).fadeIn(fadeTime);
	 
	            }, itemInterval);
	        }
	    };
	 
	    InfiniteRotator.init();

	    $('#applylink').click(function() {
	    	$('#applytext').slideToggle(200);
	    });

		$('.button-submit').click(function(e) {
			e.preventDefault();
			$(this).parents('form:first').submit();
		});
});

</script>

</body>
</html>