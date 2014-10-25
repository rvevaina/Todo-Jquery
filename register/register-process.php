<?php 


//-- grab POST vars

$name = $_POST['name'];
$city = $_POST['city'];
$province = $_POST['province'];
$postalCode = $_POST['postalCode'];
$email = $_POST['email'];
$phone = $_POST['phone'];
$unit = $_POST['unitDrop'];
$price = $_POST['priceDrop'];
$refered = $_POST['referedDrop'];
$privacy = $_POST['privacyCheck'];

if ($privacy == 'on') {
	$privacy = 'yes';
} else {
	$privacy = 'no';
}



//-- email

$headers = "From: " . strip_tags($email) . "\r\n";
$headers .= "Reply-To: ". strip_tags($email) . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";

//recipient should be: *@*.*
$recipient = 'tnischuk@blackjet.ca';
$subject = 'New Registration @ MetalWorks';

// PREPARE THE BODY OF THE MESSAGE

$message = '<html><body>';
$message .= '<table rules="all" style="border-color: #666;" cellpadding="10">';
$message .= "<tr style='background: #eee;'><td><strong>NAME:</strong> </td><td>" . $name . "</td></tr>";
$message .= "<tr><td><strong>CITY:</strong> </td><td>" . $city . "</td></tr>";
$message .= "<tr><td><strong>PROVINCE:</strong> </td><td>" . $province . "</td></tr>";
$message .= "<tr><td><strong>POSTAL CODE:</strong> </td><td>" . $postalCode . "</td></tr>";
$message .= "<tr><td><strong>EMAIL:</strong> </td><td>" . $email . "</td></tr>";
$message .= "<tr><td><strong>PHONE:</strong> </td><td>" . $phone . "</td></tr>";
$message .= "<tr><td><strong>UNIT:</strong> </td><td>" . $unit . "</td></tr>";
$message .= "<tr><td><strong>PRICE:</strong> </td><td>" . $price . "</td></tr>";
$message .= "<tr><td><strong>REFERRED:</strong> </td><td>" . $refered . "</td></tr>";
$message .= "</table>";
$message .= "</body></html>";

mail($recipient, $subject, $message, $headers);



//-- database insert
$con = mysql_connect("localhost","root","root");

if (!$con) {
  die('Could not connect: ' . mysql_error());
}

mysql_select_db("metalworks", $con);


$sql="INSERT INTO registrations (name, city, province, postalCode, email, phone, unit, price, referred, privacy) 
	VALUES('$name','$city','$province','$postalCode','$email','$phone','$unit','$price','$refered', '$privacy')";

if (!mysql_query($sql,$con)) {
  die('Error: ' . mysql_error());
};

mysql_close($con);
?>
