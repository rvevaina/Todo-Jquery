 <!DOCTYPE html>
 <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>Register</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width">

        <link rel="stylesheet" href="../style/css/main.css">

        <script src="js/vendor/modernizr-2.6.2.min.js"></script>
    </head>
	
<body>

<header>
    <div class="register-menu">
        <div class="wrap">
            <div class="leftBar">
                <div class="logo"></div>
                    <ul class="menu">
                         <li><a href="#" class ="story">The Story</a>
                         <li><a href="#" class ="register">Register</a></li>
                            <ul class="dropdown">
                                 <img src="../img/underline.png" height="15" width="94" alt="">
                                 <li class="history"><a href="../index.php#history">History</a></li>
                                 <li><a href="../index.php#name">Name</a></li>
                                 <li><a href="../index.php#architecture">Architecture</a></li>
                                 <li><a href="../index.php#community">Community</a></li>
                                 <li><a href="../index.php#builder">Builder</a></li>
                            </ul>
                        </li>
                    </ul><!-- ul.menu -->
                </div>
            <div class="rightBar">
                <label for="toggle">☰</label>
                <input type="checkbox" class="toggle" id="toggle">
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
            <div class="slideout">
                <div class="logo"></div>
                <ul class="menu">
                    <li><a href="#" class="story1">The Story</a>
                        <ul class="dropdown">
                            <img src="../img/underline.png" height="25" width="168" alt="">
                            <li class="history1"><a href="../index.php#history">History</a></li>
                            <li class="name1"><a href="../index.php#name">Name</a></li>
                            <li class="architecture1"><a href="../index.php#architecture">Architecture</a></li>
                            <li class="community1"><a href="../index.php#community">Community</a></li>
                            <li class="builder1"><a href="../index.php#builder">Builder</a></li>
                        </ul>
                    <li><a class="register" href="#">Register</a></li>
                    </li>
                </ul>
            </div>
        </div><!-- wrap -->
    </div>
 </header>

<main>
	
	<div class="formwrap clearfix">
        <div class="right">
            <h1>MAKE HISTORY</h1>
            <p>It's where our history happened. And now, it's home. Register to start your story.</p>
            <p class="required">*required field</p>
        </div>
		<form action="javascript:submitContact();" class="contact">
        <div class="input">
            <label class="error" for="name">Required</label>
			<input type="text" class="name required" placeholder="Name*"  name="name">

            <label class="error" for="city">Required</label>
			<input type="text" class="city required" placeholder="City*" name="city">

            <label class="error" for="province">Required</label>
			<input type="text" class="province required" placeholder="Province*" name="province">

            <label class="error" for="postalCode">Required</label>
			<input type="text" class="postalCode required" placeholder="Postal Code*" name="postalCode">

            <label class="error" for="email">Required</label>
			<input type="text" class="email required" placeholder="Email*" name="email">

            <input type="text" class="phone" placeholder="Phone" name="phone">
		</div>
            <div class="questions">
                    <span class="wrap"><select name="unitDrop" class="unitDrop" tabindex="2"></span> 
                        <option class="first">What type of unit are you looking for?</option>
                        <option>1 Bedroom</option>
                        <option>1 Bedroom + Den</option>
                        <option>2 Bedroom</option>
                        <option>2 Bedroom + Den</option>
                        <option>Townhome</option>
                        <option>Penthouse</option>
                    </select>

                <!-- <input type="text" class="price" placeholder="What is your desired price range" name="price"> -->
                    <span class="wrap"><select name="priceDrop" class="priceDrop" tabindex="2"></span> 
                        <option class="first">What is your desired price range?</option>
                        <option>$250,000 - $300,000</option>
                        <option>$300,000 - $350,000</option>
                        <option>$350,000 - $400,000</option>
                        <option>$400,000 - $450,000</option>
                        <option>$450,000 - $500,000</option>
                        <option>$500,000 - $550,000</option>
                        <option>$550,000 - $600,000</option>
                        <option>$600,000 + </option>
                    </select>

                    <span class="wrap"><select name="referedDrop" class="referedDrop" tabindex="2"></span> 
                        <option class="first">How did you hear about us?</option>
                        <option>Newspaper</option>
                        <option>Signs</option>
                        <option>Radio</option>
                        <option>Magazine</option>
                        <option>Referral</option>
                        <option>Internet</option>
                         <option>Mail</option>
                    </select>

                

                <div class="updates">
                    <input type="checkbox" id="checkboxUpdate" name="privacyCheck" checked>
                    <label for="checkboxUpdate"><p>Yes! Please keep me up-to-date on the latest news.</p></label>
                </div>
               
                <span class= "outersubmit"><a href="#thankyou"><input type="submit" class="submit" value="SUBMIT"></span></a>
            
            </div>
        </form>
		
	</div>

    <div id="thankyou">
        <div class="content">
            <h1>THANK<span class="space"></span>YOU</h1>
            <h1>FOR<span class="space"></span>REGISTERING<span class="period">.</span></h1>
            <p>This is only the beginning of the story. Stay tuned to more from The Metalworks.</p>
        </div>
    </div>
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

        <script src="../js/plugins.min.js"></script>
        <script src="../js/jquery.placeholder.js"></script>
         <script src="../js/jquery.placeholder.min.js"></script>
        <script src="../js/min/min/dropkick.min-ck.js"></script>
        <script src="../js/dropkick.js"></script>
           <script src="../js/dropkick.jquery.js"></script>
        <script src="../js/main.js"></script>

        <script>
            var _gaq=[['_setAccount','UA-*******'],['_trackPageview']];
            (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
            g.src='//www.google-analytics.com/ga.js';
            s.parentNode.insertBefore(g,s)}(document,'script'));
        </script>
    </body>
</html>


