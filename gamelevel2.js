// Holds DOM elements that don’t change, to avoid repeatedly querying the DOM
var dom = {};

var numClicks = 0;
var boardSize = 500;

// Mining Tools
var tools = [
	{
		"name": "Pan",
		"description": "Place river gravel into a shallow pan then add water. Swirl the pan around until the gravel spills over the side and the gold dust is sitting at the bottom just waiting for you!",
		"img": "img/tools/pan.jpg",
		"depth": "0-5m",
		"profit": "$20",
		"price": "free",
		"available": "01/1847",
		"locations": "rivers"
	},
	{
		"name": "Rocker",
		"description": "Dump dirt and rock at the top of your Rocker and just rock that baby back and forth until you see gold at the bottom of the box.",
		"img": "img/tools/rocker.jpg",
		"depth": "0-5m",
		"profit": "$40",
		"price": "free",
		"available": "01/1848",
		"locations": "anywhere"
	},
	{
		"name": "Long Tom",
		"description": "Dump your dirt, rocks, and gravel at the top of the Long Tom. Then watch those rocks fall 20 feet down to your cradle. Collect gold, rinse, repeat. You’re gonna need a couple extra hands for this big guy.",
		"img": "img/tools/longtom.jpg",
		"depth": "0-5m",
		"profit": "$60",
		"price": "$300",
		"available": "01/1849",
		"locations": "within 2 squares of a water source, on land or water"
	},
	{
		"name": "Dredger",
		"description": "Get your dredger and you can get all the way to the bottom of the river without your scuba gear. The dredger works best in deeper rivers.",
		"img": "img/tools/dredger.jpg",
		"depth": "0-30m",
		"profit": "$100",
		"price": "$350",
		"available": "01/1850",
		"locations": "rivers"
	},
	{
		"name": "Hydraulic Mining",
		"description": "Hold onto your hats because she’s gonna make a mess! You’ll need to have a lot of water on hand along with a hose. Just aim at anything on land and reap those golden rewards.",
		"img": "img/tools/hydraulic.jpg",
		"depth": "0-15m",
		"profit": "$150",
		"price": "$500",
		"available": "01/1851",
		"locations": "within 5 squares of a water source, but only on land"
	},
	{
		"name": "Hardrock Miner",
		"description": "This piece of equipment is every miner’s dream. Crush any piece of rock, dirt, or gravel and see what goodies lie inside.",
		"img": "img/tools/hardrock.jpg",
		"depth": "0-50m",
		"profit": "$300",
		"price": "$1000",
		"available": "01/1853",
		"locations": "any land"
	},

]

// Month/years
var months = ["January", "February","March","April","May","June",
							"July","August","September","October","November","December"]
var monthCounter=0;
var yearCounter = 1849;

// Variables that are used in the game
var money = 0;
var inventory = ["Gold Rocker"];
var numWorkers = 0;
var workerTimer = 0;
//var miningUnlocked = false; // the hint timer
var heatMapUnlocked = false;
var nextTools = [["Long Tom", 300], ["Dredger",350]];
var nextToolIndex = 0;
var lastMonthLog = [];

// gold mine spots -- [amount, dry-up timer]
var goldRockerCoordinates = {
	"A2": [15,1],
	"A4": [15,1],
	"B2": [15,1],
	"D2": [20,5],
	"D4": [15,1],
	"E2": [15,1],
	"E5": [15,1],
	"F5": [15,1],
};

var goldHeatMapCoordinates = {
	"A2": [2,'none'],
	"A3": [1,'none'],
	"A4": [4,'none'],
	"A5": [1,'none'],
	"B1": [5,'none'],
	"B2": [1,'none'],
	"B3": [1,'none'],
	"B5": [2,'none'],
	"C1": [1,'none'],
	"C3": [4,'none'],
	"C5": [1,'none'],
	"D1": [2,'none'],
	"D2": [4,'none'],
	"D3": [2,'none'],
	"D5": [2,'none'],
	"E1": [1,'none'],
	"E2": [10,'none'],
	"E3": [3,'none'],
	"F2": [3,'none'],
	"F3": [1,'none'],
	"G1": [2,'none'],
	"G2": [1,'none'],
	"G3": [2,'none'],
	"G4": [10,'none'],
	"G5": [1,'none'],
	"H1": [10,'none'],
	"H2": [1,'none'],
	"H4": [17,'none'],
}

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
		// createImage("tcolormap.png", 1860, 1292, boardSize);

		Util.one("#coordinates").focus();
		Util.one("#inventory").innerHTML = "" + inventory[0];

		populateStoreLegend();
		setUpGeneralStore();
		setUpPopups();

		//Util.one("#storyboard-popup").style.display = "block";

		// EVENT: input listens for change in input (typing, copy/paste, etc)
		var coordInput = Util.all(".coordinates");
		for (i of coordInput) {
			i.addEventListener("input", function(event) {
			  // check if current value is valid (in the form "a1", "h8", "j10", etc.)
				// then change outline color to signify correct/incorrect
				var currentInput = this.value;
				var pattern = new RegExp(this.pattern);
				if (pattern.test(currentInput)){
				    this.setAttribute("style","outline-color: green;"); // green outline (as opposed to red)
						display("#hint-valid-coord", false);
						// show a hint if the user is trying to pan in a non-river square
				}
				else {
				    this.setAttribute("style","outline-color: red;"); // red outline (as opposed to none)
						// show a hint if the input is incorrect (but not if user may bein the middle of typing it)
						if (currentInput.length >= 2) {
							display("#hint-valid-coord", true);
						}
						else { display("#hint-valid-coord", false); }
				}
			});
		}

		// EVENT: Completes all actions for the current month
		//				Calculates earnings, subtracts spendings, moves forward 1 month
		Util.one("#submit-month").onclick = function() {
			// turn off previous hints
			var allHintDivs = Util.all(".hint");
			for (i of allHintDivs) {
				i.style.display = "none";
			}
			var earnings = []; // keep track of [location, action, money] to display later

			// find location/action for you and each hired worker (if any), calulate earnings
			var allWorkers = Util.all(".location-action");
			for (i of allWorkers) {
				var location = i.querySelector(".location").querySelector(".coordinates").value.toUpperCase();
				var actionType;
				var actionDiv = i.querySelector(".action");
				if (actionDiv.querySelector(".action-rocker").checked == true) {
					actionType = "rocker";
				}
				else if (actionDiv.querySelector(".action-long-tom").checked == true) {
					actionType = "long-tom";
				}
				else if (actionDiv.querySelector(".action-dredger").checked == true) {
					actionType = "dredger";
				}
				var profit = calculateEarnings(location, actionType)
				money += profit;

				earnings.push([location, actionType, profit]);
			}
			lastMonth = earnings;

			// display new money amount
			console.log("Current money: $" + money);
			Util.one("#current-money").innerHTML = "$" + money;
			// display the last month log (breakdown of location/action/profit)
			var lastMonthDiv = Util.one("#last-month");
			lastMonthDiv.innerHTML = "";
			for (i of lastMonth) {
				// i = [location, actionType, profit]
				var line = document.createElement("p");
				line.innerHTML = "$" + i[2] + " from location " + i[0] + " using " + i[1];
				lastMonthDiv.appendChild(line);
			}
			// reset location coordinate input, refocus
			var coordInput = Util.all(".coordinates");
			Util.one("#coordinates").focus();

			// check if workers are done (finished 12 months)
			// if so, reset number of workers hired. else decrement timer
			if (workerTimer <= 0){
				numWorkers = 0;
				var hiredWorkers = Util.all(".worker-actions");
				while(hiredWorkers.length > 0) {
					// removing location/action selectors of the hired workers
					hiredWorkers[0].parentNode.removeChild(hiredWorkers[0]);
					hiredWorkers = Util.all(".worker-actions");
				}
				Util.one("#num-workers").innerHTML = "0";
				Util.one("#buy-worker").disabled = false;
			}
			else {
				workerTimer -= 1;
			}
			// increase time 1 month forward
			if (monthCounter==11) { // aka December
				yearCounter += 1;
			}
			monthCounter = (monthCounter+1) % 12;
			Util.one("#date").innerHTML = ""+months[monthCounter]+" "+yearCounter;

			// check if it's the right date for new tool
			// Jan 1848 -- add rocker tool
			if (yearCounter == 1849) {
				Util.one("#next-tool-text").hidden = false;
				Util.one("#buy-tool").hidden = false;
				Util.one("#long-tom-option").hidden = false;
			}
			if (yearCounter >= 1850 && nextToolIndex == 1) {
				Util.one("#next-tool-text").innerHTML = "NEW! Dredger Mining Tool: $350, permanent purchase";
				Util.one("#buy-tool").hidden = false;
				Util.one("#buy-tool").disabled = false;
				Util.one("#dredger-option").hidden = false;
			}

			/*
			// check if player bought mining tool
			// if so, decrement timer for hint block
			// remove timer (set to below 0) if player dug in hint spot
			if (miningUnlocked && (c2timer >= 0 || g2timer >= 0) ) {
				if (location == "c2") { c2timer = -1; }
				else { c2timer = c2timer - 1; }
				if (location == "g2") { g2timer = -1; }
				else { g2timer = g2timer - 1;	}

				if (c2timer == 0) {
					display("#hint-faultlines", true);
					c2timer = 5;
				}
				if (g2timer == 0) {
					display("#hint-desert", true);
					g2timer = 5;
				}
			}*/
		}

	},



	// Keyboard events arrive here
	"keydown": function(evt) {
	},

	// Click events arrive here
	"click": function(evt) {

	}
});

function populateStoreLegend() {
	var legend = Util.one("#store-popup");
	var listing = Util.one("#items-list");
	tools.forEach((tool) => {
		var name = document.createElement("div");
		name.innerHTML = tool.name;
		listing.appendChild(name);

		var description = document.createElement("div");
		description.innerHTML = tool.description;
		listing.appendChild(description);

		var depth = document.createElement("div");
		depth.innerHTML = tool.depth;
		listing.appendChild(depth);

		var profit = document.createElement("div");
		profit.innerHTML = tool.profit;
		listing.appendChild(profit);

		var price = document.createElement("div");
		price.innerHTML = tool.price;
		listing.appendChild(price);

		var available = document.createElement("div");
		available.innerHTML = tool.available;
		listing.appendChild(available);

		var locations = document.createElement("div");
		locations.innerHTML = tool.locations;
		listing.appendChild(locations);

		var imageDiv = document.createElement("div");
		var img = document.createElement("img");
		img.src = tool.img;
		img.style.width = "100px";
		imageDiv.appendChild(img);
		listing.appendChild(imageDiv);

	})
}


function setUpGeneralStore() {
		// Button - buying mining tools
	Util.one("#buy-tool").onclick = function() {
		// check if enough money for tool and not in inventory yet
		var toolName = nextTools[nextToolIndex][0];
		var toolPrice = nextTools[nextToolIndex][1];
		console.log(nextTools[nextToolIndex])
		if (money >= toolPrice && inventory.indexOf(toolName) < 0){
			// buy the tools, add to inventory
			money -= toolPrice;
			inventory.push(toolName);
			// refresh inventory text
			var inventoryContents = "";
			for (var i = 0; i < inventory.length; i++) {
				inventoryContents += inventory[i] + ", ";
			}
			Util.one("#inventory").innerHTML = inventoryContents;
			Util.one("#current-money").innerHTML="$"+money;

			// enable all "Mine for Gold" options
			if (toolName == "Long Tom") {
				var mineOptions = Util.all(".action-long-tom");
				console.log(mineOptions);
				for (i of mineOptions) {
					i.disabled = false;
				}
				// set Next Tool
				nextToolIndex = nextToolIndex + 1;
			}
			else if (toolName == "Dredger") {
				var mineOptions = Util.all(".action-dredger");
				for (i of mineOptions) {
					i.disabled = false;
				}
			}

			// disable buy mining tools button
			this.disabled = true;
			// miningUnlocked is true - start timer for hint blocks (see Submit button code)
			//miningUnlocked = true;

		}

	}

// TODO adjust worker prices depending on tool
	// Button - hire a worker
	// adds a new location/action selector for each worker hired
	Util.one("#buy-worker").onclick = function() {
		if (money >= 50){
			// hire worker, update page
			money -= 50;
			numWorkers += 1;
			workerTimer = 12; // workers stay for 12 months
			Util.one("#num-workers").innerHTML = ""+numWorkers;
			Util.one("#current-money").innerHTML="$"+money;

			// add a new location/action selector
			var outerDiv = Util.one("#user-actions");
			var selection = outerDiv.querySelector(".location-action").cloneNode(true);
			selection.classList.add("worker-actions");
			selection.querySelector(".location").children[0].innerHTML = "Worker Location:";
			outerDiv.append(selection);

			this.disabled = true; // for now, only hire 1 worker at a time
			// TODO implement hiring multiple workers correctly
		}

	}
	// Player can buy a heat map that displays underneath the baseic map
	Util.one("#buy-map").onclick = function() {
		var heatmap = Util.one("#heat-map");
		if (money >= 50 && heatmap.hidden == true){
			// update page
			money -= 50;
			Util.one("#current-money").innerHTML="$"+money;
			heatmap.hidden = false;
			this.disabled = true;
			heatMapUnlocked = true;
		}
	}
}


function setUpPopups() {

	// Util.one("#maps-button").onclick = function() {
	// 	Util.one("#map-popup").style.display = "block";
	// }

	// Util.one("#map-popup-close").onclick = function() {
	// 	Util.one("#map-popup").style.display = "none";
	// }

	Util.one("#view-store-button").onclick = function() {
		Util.one("#store-popup").style.display = "block";
	}

	Util.one("#store-popup-close").onclick = function() {
		Util.one("#store-popup").style.display = "none";
	}

    window.onclick = function(event) {
    	// console.log(event)
      var mapPopup = Util.one("#map-popup");
      if (event.target == mapPopup) {
        mapPopup.style.display = "none";
      } else if (event.target == Util.one("#store-popup")) {
      	Util.one("#store-popup").style.display = "none";
      }
    }

}


function calculateEarnings(location, actionType) {
	var mapToUse = goldRockerCoordinates;
	var earnings = 0;
	// TODO adjust for new tools
	// pick the map to use
	if (actionType == "rocker") {
		mapToUse = goldRockerCoordinates;
		if (heatMapUnlocked == true) {
			mapToUse = goldHeatMapCoordinates;
		}
		// check how much gold is in that location
		if (location in mapToUse) {
			// check if the location is "dried up" - user can only dig 12 times total
			var usesLeft = mapToUse[location][1];
			if (usesLeft == "none") {
				earnings = mapToUse[location][0];
			}
			else if (usesLeft > 0){
				earnings = mapToUse[location][0];
				mapToUse[location][1] = mapToUse[location][1]-1; // decrease the "dry-up" counter
			}
			else {
				display("#hint-dry", true); // display hint about drying up
				earnings = 1;
			}
		}
		else {
			// not in map
			earnings = 0;
		}
	}
	else if (actionType == "long-tom") {
		mapToUse = goldHeatMapCoordinates;
		var multiplier = 2;
		if (location in mapToUse) {
			// check if the location is "dried up" - user can only dig 12 times total
			var usesLeft = mapToUse[location][1];
			if (usesLeft == "none") {
				earnings = mapToUse[location][0]*multiplier;
			}
			else if (usesLeft > 0){
				earnings = mapToUse[location][0] * multiplier;
				mapToUse[location][1] = mapToUse[location][1]-1; // decrease the "dry-up" counter
			}
			else {
				display("#hint-dry", true); // display hint about drying up
				earnings = 1;
			}
		}
		else {
			earnings = 0;
		}
	}
	else if (actionType == "dredger") {
		mapToUse = goldHeatMapCoordinates;
		var multiplier = 3;
		if (location in mapToUse) {
			// check if the location is "dried up" - user can only dig 12 times total
			var usesLeft = mapToUse[location][1];
			if (usesLeft == "none") {
				earnings = mapToUse[location][0] * multiplier;
			}
			else if (usesLeft > 0){
				earnings = mapToUse[location][0] * multiplier;
				mapToUse[location][1] = mapToUse[location][1]-1; // decrease the "dry-up" counter
			}
			else {
				display("#hint-dry", true); // display hint about drying up
				earnings = 1;
			}
		}
		else {
			earnings = 0;
		}
	}
	return earnings;
}
