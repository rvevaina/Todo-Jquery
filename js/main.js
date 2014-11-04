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

var $input1 = $("input.first");
var $input2 = $("input.second");
var $input3 = $("input.third");

var count = 0;
//Tick animation
$input1.on("blur", function(){ //when leaving input, add tick mark 
	if ($input1.val() !== "") {
		tick1.fadeIn(1100);
	} else {
		tick1.fadeOut(700);	
	}
});

$input2.on("blur", function(){ //when leaving input, add tick mark 
	if ($input2.val() !== "") {
		tick2.fadeIn(1200);
	} else {
		tick2.fadeOut(700);
		
	}
});

$input3.on("blur", function(){ //when leaving input, add tick mark 
	if ($input3.val() !== "") {
		tick3.fadeIn(1200);
	} else {
		tick3.fadeOut(700);
		
	}
});
var $closeComplete = $("img.completedClose");

//Adding tasks to completed tasks
tick1.on("click", function(){
	var todo = $("input.first").val();
	$("ul.complete").append("<li>" + todo + "</li>");
	//Strikethrough completed tasks
  	$('#line1').animateStrikethrough(1200, function () {
  	});
	tick1.fadeOut(500);
	$(".close1").fadeIn(900);
	$input1.addClass("hide");
	count++;
	showVideo(); // show video?
	localStorage.completed = localStorage.completed + "," + todo;
	$closeComplete.fadeIn(800);

});


tick2.on("click", function(){
	var todo = $("input.second").val();
	$("ul.complete").append("<li>" + $("input.second").val() + "</li>");
	$('#line2').animateStrikethrough(1200, function () {
  	});
	tick2.fadeOut(500);
	$(".close2").fadeIn(900);
	$input2.addClass("hide");
	count++;
	showVideo(); // show video?
	localStorage.completed = localStorage.completed + "," + todo;
	$closeComplete.fadeIn(800);
});

tick3.on("click", function(){
	var todo = $("input.third").val();
	$("ul.complete").append("<li>" + $("input.third").val() + "</li>");
	$('#line3').animateStrikethrough(1200, function () {
  	});
	tick3.fadeOut(500);
	$(".close3").fadeIn(900);
	$input3.addClass("hide");
	count++;
	showVideo(); // show video?
	localStorage.completed = localStorage.completed + "," + todo;
	$closeComplete.fadeIn(800);
});

//Clearing feilds on x click
$(".close1").on("click", function(){
	$(this).fadeOut(600);
	$input1.val('').removeClass("hide");
});

$(".close2").on("click", function(){
	$(this).fadeOut(600);
	$input2.val('').removeClass("hide");
});

$(".close3").on("click", function(){
	$(this).fadeOut(600);
	$input3.val('').removeClass("hide");
});

//Scroll down on arrow click
$(".scroll").click(function(){
	$('html,body').animate({scrollTop:450});	
});

var showVideo = function() {
	if(count >= 3) {
		$(".overlay").addClass("slide");
	}
};

	var completed = localStorage.completed.split(',');

	for (var i = 1; i < completed.length; i++) {
		$('ul.complete').append('<li>'+completed[i]+'</li>');
	}


//clear completed

$closeComplete.click(function(){
	$("ul.complete").empty();
	$closeComplete.fadeOut(300);
	localStorage.clear();
});

if ($("ul.complete") !== (" ")){
	$closeComplete.fadeIn(800);
} 

//close video
	
	$("img.videoClose").click(function(){
		console.log("click")
		$(".overlay").removeClass("slide");
	});
	

}); //document ready


$(window).load(function() { 
	
});



// set timeout function to clear inputs after 24 hours

// .val("")
// .empty()

//reward when all 3 ticks are clicked... youtube video+funny slides in 