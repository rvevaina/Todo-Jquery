 <!DOCTYPE html>
 <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>Register</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width">

        <link rel="stylesheet" href="../style/css/main.css">

        <script src="../js/vendor/modernizr-2.6.2.min.js"></script>
    </head>
	
<body>

<header>
     <div class="wrap">
         <div class="leftBar">
             <div class="logo"></div>
             <ul class="menu">
                 <li><a href="#" class ="story">The Story</a>
                 <li><a href="#">Register</a></li>
                     <ul class="dropdown">
                         <li><a href="#">History</a></li>
                         <li><a href="#">Name</a></li>
                         <li><a href="#">Architecture</a></li>
                         <li><a href="#">Community</a></li>
                         <li><a href="#">Builder</a></li>
                     </ul>
                </li>
             </ul><!-- ul.menu -->
         </div>
          <div class="rightBar">
             <div class="date-stamp">
                       
                <?php 
                date_default_timezone_set("America/New_York");
                echo date('l F jS, Y');
                ?>
                <span class="hour"><?php echo date('H');?></span>: 
                  <span class="min"><?php echo date('i');?></span>: 
                    <span class="sec"><?php echo date('s');?></span>
             </div> <!-- date-stamp -->
                    
         </div> <!-- rightBar -->
     </div><!-- wrap -->
 </header>

<main>
	
	
	<form action="register.php" class="contact">
		<input type="text" class="name" placeholder="Name">
		<input type="text" class="city" placeholder="City">
		<input type="text" class="province" placeholder="Province">
		<input type="text" class="postalCode" placeholder="Postal Code">
		<input type="text" class="email" placeholder="Email">
		<input type="text" class="phone" placeholder="Phone">
		<input type="text" class="unit" placeholder="What type of unit are you looking for?">
		<input type="text" class="price" placeholder="What is your desired price range">
		<input type="text" class="refered" placeholder="How did you hear about us?">
		<input type="submit" class="submit" value="Send">
	</form>

</main>

<footer>

        <div class="footer clearfix">
            <div class="wrapper">
                <div class="left">
                   <img src="../img/fusion.png" class="fusion">
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo. 
                </div>
                <div class="right">
                    <img src="../img/logo-footer.png" a href="#" class="logo"></a>
                </div>
            </div>
        </div>

</footer>

        
        <!-- <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script> -->
        <script>window.jQuery || document.write('<script src="../js/vendor/jquery-1.11.1.min.js"><\/script>')</script>

        <script src="../js/plugins.js"></script>
        <script src="../js/main.js"></script>

        <script>
            var _gaq=[['_setAccount','UA-*******'],['_trackPageview']];
            (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
            g.src='//www.google-analytics.com/ga.js';
            s.parentNode.insertBefore(g,s)}(document,'script'));
        </script>
    </body>
</html>


