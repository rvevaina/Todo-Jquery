$(document).ready(function() {

var textBox = $('input[type="text"]');

//Move from one inputbox to the next on enter

textBox.on("keyup", function(e){
	if (e.keyCode === 13) {
		var currentBox = textBox.index(this);
		var nextBox = textBox[currentBox + 1];

		if (!!nextBox){
		// $('input:last-child').blur();

			nextBox.focus();
	        nextBox.select();
        event.preventDefault();
        return false; 		
		}
		else {
			$(this).blur();
		} 
	}
});

// Date and time on top

var today = new Date();

var date = today.getDate();
var month = new Array();
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";
var m = month[today.getMonth()];
var year = today.getFullYear(); 
var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var day = days[today.getDay()];

function suffix(date) {
	var j = date % 10,
	k = date % 100;
	if (j === 1 && k !== 11) {
		return date + "st";
	} else if (j === 2 && k !== 12) {
		return date + "nd";
	} else if (j === 3 && k !== 13) {
		return date + "rd";
	} else {
	return date + "th";
	}
}

$("input.day").val(day + "  " + suffix(date) + " " + m + " " + year);

var tick1 = $("img.task1Img");
var tick2 = $("img.task2Img");
var tick3 = $("img.task3Img");

//Tick animation
$("input.first").on("blur", function(){ //when leaving input, add tick mark 
	if ($("input.first").val() !== "") {
		tick1.fadeIn(1100);
	} else {
		tick1.fadeOut(800);	
	}
});

$("input.second").on("blur", function(){ //when leaving input, add tick mark 
	if ($("input.second").val() !== "") {
		$("img.task2Img").fadeIn(1200);
	} else {
		$("img.task2Img").fadeOut(900);
		
	}
});

$("input.third").on("blur", function(){ //when leaving input, add tick mark 
	if ($("input.third").val() !== "") {
		$("img.task3Img").fadeIn(1200);
	} else {
		$("img.task3Img").fadeOut(900);
		
	}
});
//Adding tasks to completed tasks
tick1.on("click", function(){
	$("ul.complete").append("<li>" + $("input.first").val() + "</li>");
	//Strikethrough completed tasks
  	$('#line1').animateStrikethrough(1200, function () {
  	});
	tick1.fadeOut(500);
	$(".close1").fadeIn(900);
	$("input.first").addClass("hide");
});


tick2.on("click", function(){
	$("ul.complete").append("<li>" + $("input.second").val() + "</li>");
	$('#line2').animateStrikethrough(1200, function () {
  	});
	tick2.fadeOut(500);
	$(".close2").fadeIn(900);
	$("input.second").addClass("hide");
});

tick3.on("click", function(){
	$("ul.complete").append("<li>" + $("input.third").val() + "</li>");
	$('#line3').animateStrikethrough(1200, function () {
  	});
	tick3.fadeOut(500);
	$(".close3").fadeIn(900);
	$("input.third").addClass("hide");
});

//Clearing feilds on x click
$(".close1").on("click", function(){
	$(this).fadeOut(600);
	$("input.first").val('');
	$("input.first").removeClass("hide");
});

$(".close2").on("click", function(){
	$(this).fadeOut(600);
	$("input.second").val('');
	$("input.second").removeClass("hide");
});

$(".close3").on("click", function(){
	$(this).fadeOut(600);
	$("input.third").val('');
	$("input.third").removeClass("hide");
});

//Scroll down on arrow click
$(".scroll").click(function(){
	$('html,body').animate({scrollTop:450});	
});

// tick1.on("click", function(){
// $.jStorage.set('key', $("input.first").val());
// var value = $.jStorage.get('key');
// console.log(value);
// $("ul.complete").append(value)
// });

//video

if ($("input.first, input.second, input.third").click()){
	$(".video").addClass("slide");
}


}); //document ready


$(window).load(function() { 
	
});



// set timeout function to clear inputs after 24 hours

// .val("")
// .empty()

//reward when all 3 ticks are clicked... youtube video+funny slides in 