$(document).ready(function() {

var textBox = $('input[type="text"]');

textBox.on("keyup", function(e){
	if (e.keyCode === 13) {
		var currentBox = textBox.index(this);
		if (textBox[currentBox + 1] !== null){
		var nextBox = textBox[currentBox + 1];	
		nextBox.focus();
        nextBox.select();
        event.preventDefault();
        return false; 		
		} 
	}
	// var lastBox = textBox.length;
	// console.log(lastBox)
	// if (nextBox = lastBox){
	// lastBox.blur();
	// }
});

var tick1 = $("img.task1Img");
var tick2 = $("img.task2Img");
var tick3 = $("img.task3Img");

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

tick1.on("click", function(){
	$("ul.complete").append("<li>" + $("input.first").val() + "</li>");
	// $('input.first p').wrap("<strike>");
	tick1.fadeOut(500);
});

tick2.on("click", function(){
	$("ul.complete").append("<li>" + $("input.second").val() + "</li>");
	tick2.fadeOut(500);
});

tick3.on("click", function(){
	$("ul.complete").append("<li>" + $("input.third").val() + "</li>");
	tick3.fadeOut(500);
});


$(".scroll").click(function(){
	$('html,body').animate({scrollTop:450});	
});

}); //document ready

$(window).load(function() { 
	
});



// set timeout function to clear inputs after 24 hours

// .val("")
// .empty()

//reward when all 3 ticks are clicked... youtube video+funny slides in 