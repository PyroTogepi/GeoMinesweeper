// Holds DOM elements that don’t change, to avoid repeatedly querying the DOM
var dom = {};

var numClicks = 0;
var q1 = true;
var boardSize = 700;
var numTriesQ3 = 0;
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
		createImage("topo1A.jpg", 900, 431, boardSize);

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
		var target = evt.target.id;
		if (!q1) { return; }
		var msg = Util.one("#message");
		if (target == "boardDiv") {
			numClicks++;
			if (numClicks == 3) {showQ1Hint();}
			msg.innerHTML = "Sorry! That is incorrect, please try again!"
			display("#message", true);
		} else if (target == "correct-place") {
			numClicks++;
			msg.innerHTML = "Correct!  Good job!  You solved this in " + numClicks + " clicks!";
			display("#message", true);
			numClicks = 0;
			Util.one("#correct-place").style.border = "2px solid blue";
			q1 = false;
			Util.one("#transition").style.display = "inline";
		}
	}
});

function showQ1Hint() {
	var hints = Util.one("#hints");
	var hint = document.createElement("div");
	hint.classList.add("hint");
	hint.style.display = "block";
	hint.innerHTML = "Usually, the closer the lines are together in the topographical map, the steeper the peak.";
	hints.appendChild(hint);
	display("#hints", true);
}

function setUpQuestions() {
	display("#message", false);
	display("#hints", false);
	display("#transition", false);
	display("#questions", true);
}

function checkQ2() {
	var input = Util.one("#q2-input").value;
	var msg = Util.one("#msg-q2");
	if (input == 1440) {
		msg.style.color = "green";
		msg.innerHTML = "Correct!";
	} else {
		msg.style.color = "red";
		msg.innerHTML = "Try again!";
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


