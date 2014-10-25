$(document).ready(function() {

var textBox = $('input[type="text"]');

textBox.on("keyup", function(e){
	if (e.keyCode === 13) {
		currentBox = textBox.index(this);
		if (textBox[currentBox + 1] != null){
		nextBox = textBox[currentBox + 1];	
		nextBox.focus();
        nextBox.select();
        event.preventDefault();
        return false; 		
		}
	}
});

// textbox.blur() //when leaving input, add tick mark 
	// (if textbox != null) {
	// 	show tick 
	// }
$("h1.arrow").click(function(){
	$('html,body').animate({scrollTop:500});	
})

}); //document ready

$(window).load(function() { 
	
});



// set timeout function to clear inputs after 24 hours

// .val("")
// .empty()

//reward when all 3 ticks are clicked... youtube video+funny slides in 