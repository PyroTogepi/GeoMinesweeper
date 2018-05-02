// Holds DOM elements that don’t change, to avoid repeatedly querying the DOM
var dom = {};

var numClicks = 0;
var boardSize = 500;

// Month/years
var months = ["January", "February","March","April","May","June",
							"July","August","September","October","November","December"]
var monthCounter=0;
var yearCounter = 1847;

// Variables that are used in the game
var money = 0;
var inventory = ["Gold Pan"];
var workers = {};
var goldPanCoordinates = {
	"b2": 1,
	"b3": 2,
	"b5": 4,
	"c5": 1,
	"f3": 1,
	"g5": 7,
	"h1": 3,
	"h2": 3,
};

var goldMineCoordinates = {
	"a1": 5,
	"b1": 5,
	"c2": 30,
	"d4": 5,
	"f2": 2,
	"g1": 2,
	"g2": 20,
	"g3": 10,
	"h3": 10,
};

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
		createImage("tcolormap.png", 1860, 1292, boardSize);

		Util.one("#coordinates").focus();
		Util.one("#inventory").innerHTML = "" + inventory[0];

		// EVENT: input listens for change in input (typing, copy/paste, etc)
		Util.one("#coordinates").addEventListener("input", function(event) {
		  // check if current value is valid (in the form "a1", "h8", "j10", etc.)
			// then change outline color to signify correct/incorrect
			var currentInput = this.value;
			var pattern = new RegExp(this.pattern);
			if (pattern.test(currentInput)){
			    this.setAttribute("style","outline-color: green;"); // green outline (as opposed to red)
			}
			else {
			    this.setAttribute("style","outline-color: red;"); // red outline (as opposed to none)
			}
		});

		Util.one("#buy-mine").onclick = function() {
			if (money >= 50 && inventory.indexOf("Gold Mining Tools") < 0){
				// buy the tools, add to inventory
				money -= 50;
				inventory.push("Gold Mining Tools");
				// refresh inventory text
				var inventoryContents = "";
				for (var i = 0; i < inventory.length; i++) {
					inventoryContents += inventory[i] + ", ";
				}
				Util.one("#inventory").innerHTML = inventoryContents;
			}

		}

		// EVENT: Completes all actions for the current month
		//				Calculates earnings, subtracts spendings, moves forward 1 month
		Util.one("#submit-month").onclick = function() {
			console.log("submit");
			var location = Util.one("#coordinates").value.toLowerCase();
			var actionType;
			if (Util.one("#pan").checked == true) {
				actionType = "pan";
			}
			else if (Util.one("#mine").checked == true) {
				actionType = "mine";
			}

			money += calculateEarnings(location, actionType);
			console.log("You earned: $" + money);
			Util.one("#current-money").innerHTML = "$" + money;

			// increase time 1 month forward
			if (monthCounter==11) { // aka December
				yearCounter += 1;
			}
			monthCounter = (monthCounter+1) % 12;
			Util.one("#date").innerHTML = ""+months[monthCounter]+" "+yearCounter;
		}

	},

	// Keyboard events arrive here
	"keydown": function(evt) {
	},

	// Click events arrive here
	"click": function(evt) {
	}
});


function calculateEarnings(location, actionType) {
	var mapToUse = goldPanCoordinates;
	var earnings = 0;

	// pick the map to use
	if (actionType == "pan") {
		mapToUse = goldPanCoordinates;
	}
	else if (actionType == "mine") {
		mapToUse = goldMineCoordinates;
	}

	// check how much gold is in that location
	if (location in mapToUse) {
		earnings = mapToUse[location];
	}
	else {
		earnings = 0;
	}

	return earnings;
}
