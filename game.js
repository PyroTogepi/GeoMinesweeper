// constants
const DEFAULT_BOARD_SIZE = 8;

var size = DEFAULT_BOARD_SIZE;

const BOARD_SIZE = 400;
const CELL_SIZE = BOARD_SIZE / size;
const CELL_SIZE_PX = String(CELL_SIZE) + "px";
const ORD_LOWER_A = 97;
const GRID_BORDER_STYLE = "silver 2px solid";

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
		createNewBoard(10);

		// Element refs
		dom.controlColumn = Util.one("#controls"); // example

	},

	// Keyboard events arrive here
	"keydown": function(evt) {
	},

	// Click events arrive here
	"click": function(evt) {
	}
});

// Creates new board
var createNewBoard = function(size) {
	var boardDiv = document.getElementById("boardDiv");
	boardDiv.innerHTML = "";
	boardDiv.style.gridTemplateColumns = "repeat(" + String(size) + ", 1fr)";

	// Create board element
	for (var r = 0; r < size; r++) {
		for (var c = 0; c < size; c++) {
			// Create div cell to hold candies - cell is EMPTY
			var cell = document.createElement("div");
			cell.className = "cell";
			cell.id = rowColToCell(r, c);

			if (c == 0) {
				cell.style.borderLeft = GRID_BORDER_STYLE;
			}
			if (c == size - 1) {
				cell.style.borderRight = GRID_BORDER_STYLE;
			}
			if (r == 0) {
				cell.style.borderTop = GRID_BORDER_STYLE;
			}
			if (r == size - 1) {
				cell.style.borderBottom = GRID_BORDER_STYLE;
			}

			boardDiv.appendChild(cell);
		}
	}
}

var rowColToCell = function(row, col) {
	return row + "-" + col;
}
