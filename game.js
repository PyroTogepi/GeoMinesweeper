// constants
const DEFAULT_BOARD_SIZE = 8;

var size = DEFAULT_BOARD_SIZE;

const BOARD_SIZE = 600;
const CELL_SIZE = BOARD_SIZE / size;
const CELL_SIZE_PX = String(CELL_SIZE) + "px";
const ORD_LOWER_A = 97;
// const GRID_BORDER_STYLE = "silver 2px solid";

var selectedCellIds = new Set([]);

function createImage(img, x, y, boardSize) {
	var imgPath = "img/" + img;

	var sizeX = boardSize == null ? BOARD_SIZE : boardSize;
	var sizeY = y / x * sizeX;

	var boardDiv = document.getElementById("boardDiv");
	boardDiv.innerHTML = "";
	boardDiv.style.backgroundImage = "url('" + imgPath + "')";
	boardDiv.style.backgroundSize = sizeX + "px " + sizeY + "px";
	boardDiv.style.width = sizeX + "px";
	boardDiv.style.height = sizeY + "px";

}

// Creates new board, x and y are actual dimensions of image
var createNewBoard = function(rows, cols, img, x, y) {
	var imgPath = "img/" + img;

	var sizeX = BOARD_SIZE;
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

// Displays element if display is true, otherwise hides it
function display(eltId, display) {
  Util.one(eltId).style.display = display ? "block" : "none";
}