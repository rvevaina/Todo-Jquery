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

$("input.first").on("blur", function(){ //when leaving input, add tick mark 
	if ($("input.first").val() !== "") {
		$("img.task1Img").fadeIn(1100);
	} else {
		$("img.task1Img").fadeOut(800);
		
	}
});

$("input.second").on("blur", function(){ //when leaving input, add tick mark 
	if ($("input.second").val() !== "") {
		$("img.task2Img").fadeIn(1200);
	} else {
		$("img.task2Img").fadeOut(900);
		
	}
});

$("input.three").on("blur", function(){ //when leaving input, add tick mark 
	if ($("input.third").val() !== "") {
		$("img.task3Img").fadeIn(1200);
	} else {
		$("img.task3Img").fadeOut(900);
		
	}
});

$("h1.arrow").click(function(){
	$('html,body').animate({scrollTop:500});	
});

}); //document ready

$(window).load(function() { 
	
});



// set timeout function to clear inputs after 24 hours

// .val("")
// .empty()

//reward when all 3 ticks are clicked... youtube video+funny slides in 