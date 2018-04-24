// Holds DOM elements that don’t change, to avoid repeatedly querying the DOM
var dom = {};

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
		createNewBoard(5,5,"level-2-original.png", 975, 975);

		// Element refs
		dom.controlColumn = Util.one("#controls"); // example

		Util.one("#submit").onclick = function() {
			console.log("submit");
		}
			//TODO
	},

	// Keyboard events arrive here
	"keydown": function(evt) {
	},

	// Click events arrive here
	"click": function(evt) {
	}
});