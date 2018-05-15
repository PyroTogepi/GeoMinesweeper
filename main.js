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

		Util.one("#story-popup").style.display = "block";

		Util.one("#continue-btn").onclick = function() {
			Util.one("#story-popup").style.display = "none";
		}


	},

	// Keyboard events arrive here
	"keydown": function(evt) {
	},

	// Click events arrive here
	"click": function(evt) {
		// console.log(evt.target);

	}
});
