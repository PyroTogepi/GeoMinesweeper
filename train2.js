// Holds DOM elements that don’t change, to avoid repeatedly querying the DOM
var dom = {};

var numClicks = 0;
var boardSize = 500;
// ================================================
// EVENTS
// ================================================

// Attaching events on document because then we can do it without waiting for
// the DOM to be ready (i.e. before DOMContentLoaded fires)
Util.events(document, {
	// Final initalization entry point: the Javascript code inside this block
	// runs at the end of start-up when the DOM is ready
	"DOMContentLoaded": function() {
		var boardDiv = document.getElementById("boardDiv");
		boardDiv.style.setProperty("--size", size);
		createImage("coordinate.png", 1860, 1292, boardSize);

		var correctPlace = document.createElement("div");
		correctPlace.id = "correct-place";
		boardDiv.appendChild(correctPlace);

		// Element refs
		dom.controlColumn = Util.one("#controls"); // example

		// Util.one("#submit").onclick = function() {
		// 	console.log("submit");
		// }
			//TODO
	},

	// Keyboard events arrive here
	"keydown": function(evt) {
	},

	// Click events arrive here
	"click": function(evt) {
	}
});

function checkQ1() {
	var input = Util.one("#q1-input").value;
	var msg = Util.one("#msg-q1");
	if (input == "C7" || input == "c7") {
		msg.style.color = "green";
		msg.innerHTML = "Correct!";
	} else {
		msg.style.color = "red";
		msg.innerHTML = "Try again!";
	}
}

var numTriesQ2 = 0;
function checkQ2() {
	numTriesQ2++;
	var input = Util.one("#q2-input").value;
	var msg = Util.one("#msg-q2");
	if (input == 1440) {
		msg.style.color = "green";
		msg.innerHTML = "Correct!";
	} else {
		msg.style.color = "red";
		msg.innerHTML = "Try again!";
		if (numTriesQ2 == 3) {
			display("#hint-q2", true);
		}

	}
}

function checkQ3() {
	numTriesQ3++;
	var input = Util.one("#q3-input").value;
	var msg = Util.one("#msg-q3");
	if (input == 1540) {
		msg.style.color = "green";
		msg.innerHTML = "Correct!";
	} else if (input <= 1560 && input >= 1520) {
		msg.style.color = "red";
		msg.innerHTML = "You’re close! Count again!";
	} else {
		msg.style.color = "red";
		msg.innerHTML = "Try again!";
		if (numTriesQ3 == 3) {
			var hint = Util.one("#hint-q3");
			hint.innerHTML = "Hint: Here is more information about how to count the heights.";

			var img = document.createElement("img");
			img.src = "img/topo1B.png";
			img.style.width = "550px";
			hint.appendChild(img);
			display("#hint-q3", true);
		}

	}
}

var numTriesQ4 = 0;
function checkQ4() {
	numTriesQ4++;
	var inputN = Util.one("#q4-input-N").value;
	var inputS = Util.one("#q4-input-S").value;
	var inputE = Util.one("#q4-input-E").value;
	var inputW = Util.one("#q4-input-W").value;
	var msg = Util.one("#msg-q4");
	if (inputN == 4 && inputS == 0 && inputE == 7 && inputW == 0) {
		msg.style.color = "green";
		msg.innerHTML = "Correct!";
	} else {
		msg.style.color = "red";
		msg.innerHTML = "Try again!";
		if (numTriesQ4 == 3) {
			display("#hint-q4", true);
		}

	}
}


var numTriesQ5 = 0;
function checkQ5() {
	numTriesQ5++;
	var msg = Util.one("#msg-q5");
	if (Util.one("#correct-q5").checked) {
		msg.style.color = "green";
		msg.innerHTML = "Correct!";
	} else {
		msg.style.color = "red";
		msg.innerHTML = "Try again!";
		if (numTriesQ5 == 3) {
			display("#hint-q5", true);
		}

	}
}


