<?php 

$name = $_POST['name'];
$city = $_POST['city'];
$province = $_POST['province'];
$postalCode = $_POST['postalCode'];
$email = $_POST['email'];
$phone = $_POST['phone'];
$unit = $_POST['unit'];
$price = $_POST['price'];
$refered = $_POST['refered'];

echo 'test';



$headers = "From: " . strip_tags($email) . "\r\n";
$headers .= "Reply-To: ". strip_tags($email) . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";

//recipient should be: *@*.*
$recipient = 'tnischuk@blackjet.ca';
$subject = $subjectgrab;

// PREPARE THE BODY OF THE MESSAGE

$message = '<html><body>';
$message .= '<table rules="all" style="border-color: #666;" cellpadding="10">';
$message .= "<tr style='background: #eee;'><td><strong>NAME:</strong> </td><td>" . $name . "</td></tr>";
$message .= "<tr><td><strong>EMAIL:</strong> </td><td>" . $email . "</td></tr>";
$message .= "<tr><td><strong>COMMENTS:</strong> </td><td>" . $comments . "</td></tr>";
$message .= "</table>";
$message .= "</body></html>";

// mail($recipient, $subject, $message, $headers);

?>
