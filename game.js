// constants
const DEFAULT_BOARD_SIZE = 8;

var size = DEFAULT_BOARD_SIZE;

const BOARD_SIZE = 600;
const CELL_SIZE = BOARD_SIZE / size;
const CELL_SIZE_PX = String(CELL_SIZE) + "px";
const ORD_LOWER_A = 97;
// const GRID_BORDER_STYLE = "silver 2px solid";

// Holds DOM elements that don’t change, to avoid repeatedly querying the DOM
var dom = {};

var selectedCellIds = new Set([]);

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
			console.log("submit")
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

// Creates new board
var createNewBoard = function(rows, cols, img, x, y) {
	var imgPath = "img/" + img;

	var sizeX = 550;
	var sizeY = y / x * sizeX;

	var boardDiv = document.getElementById("boardDiv");
	boardDiv.innerHTML = "";
	boardDiv.style.gridTemplateColumns = "repeat(" + String(cols) + ", 1fr)";
	boardDiv.style.backgroundImage = "url('" + imgPath + "')";
	boardDiv.style.backgroundSize = sizeX + "px " + sizeY + "px";
	boardDiv.style.width = sizeX + "px";
	boardDiv.style.height = sizeY + "px";

	// Create board element
	for (var r = 0; r < rows; r++) {
		for (var c = 0; c < cols; c++) {
			// Create div cell to hold candies - cell is EMPTY
			const cell = document.createElement("div");
			cell.className = "cell";
			cell.id = rowColToCell(r, c);

			cell.addEventListener("click", function(evt) {
				if (selectedCellIds.has(cell.id)) {
					selectedCellIds.delete(cell.id);
					cell.style.backgroundColor = "transparent";
					cell.style.opacity = "1";
				} else {
					selectedCellIds.add(cell.id);
					cell.style.backgroundColor = "green";
					cell.style.opacity = "0.25";
				}
			});

			boardDiv.appendChild(cell);
		}
	}
}

var rowColToCell = function(row, col) {
	return row + "-" + col;
}

// Getting value of specific style property
var findStyle = function(div, property) {
	return getComputedStyle(div).getPropertyValue(property);
}