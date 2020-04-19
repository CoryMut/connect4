/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])
let gameOver = false;
/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
	// TODO: set "board" to empty HEIGHT x WIDTH matrix array
	for (let i = 0; i < HEIGHT; i++) {
		board.push(Array.from({ length: WIDTH }));
	}
}
/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
	// TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
	const htmlBoard = document.querySelector('#board');
	// TODO: add comment for this code
	const top = document.createElement('tr');
	top.setAttribute('id', 'column-top');
	top.addEventListener('click', handleClick);

	for (var x = 0; x < WIDTH; x++) {
		const headCell = document.createElement('td');
		headCell.setAttribute('id', x);
		top.append(headCell);
	}
	htmlBoard.append(top);

	// TODO: add comment for this code
	for (let y = 0; y < HEIGHT; y++) {
		const row = document.createElement('tr');
		for (let x = 0; x < WIDTH; x++) {
			const cell = document.createElement('td');
			cell.setAttribute('id', `${y}-${x}`);
			row.append(cell);
		}
		htmlBoard.append(row);
	}
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
	// TODO: write the real version of this, rather than always returning 0
	for (let y = HEIGHT - 1; y >= 0; y--) {
		if (!board[y][x]) {
			return y;
		}
	}
	return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
	// TODO: make a div and insert into correct table cell
	const table = document.createElement('div');
	table.classList.add('piece');
	if (currPlayer === 1) {
		table.classList.add('p1');
	}
	if (currPlayer === 2) {
		table.classList.add('p2');
	}
	const selectedColumn = document.getElementById(`${y}-${x}`);
	selectedColumn.append(table);
}

/** endGame: announce game end */

function endGame(msg, currPlayer) {
	// TODO: pop up alert message
	const p = document.querySelector('#playerTurn');
	p.innerText = msg;
	p.style.color = currPlayer === 1 ? 'blue' : 'red';
	p.style.fontSize = 44 + 'px';
	gameOver = true;
}

/** handleClick: handle click of column top to play piece */

const isBoardFilled = (board) => {
	let isFilled = false;
	let temp = [];
	for (let row of board) {
		temp.push(
			row.every(function(value) {
				return value !== undefined;
			})
		);
	}
	if (
		temp.every(function(value) {
			return value === true;
		})
	) {
		isFilled = true;
	}

	return isFilled;
};

function handleClick(event) {
	// get x from ID of clicked cell
	if (isBoardFilled(board)) {
		return;
	}

	if (gameOver === true) {
		return;
	}

	const x = event.target.id;

	// get next spot in column (if none, ignore click)
	const y = findSpotForCol(x);
	if (y === null) {
		return;
	}

	// place piece in board and add to HTML table
	// TODO: add line to update in-memory board
	board[y][x] = currPlayer;
	placeInTable(y, x);

	// check for win
	if (checkForWin()) {
		return endGame(`Player ${currPlayer} won!`, currPlayer);
	}

	// check for tie
	// TODO: check if all cells in board are filled; if so call, call endGame
	if (isBoardFilled(board)) {
		endGame("It's a tie!");
	}

	// switch players
	// TODO: switch currPlayer 1 <-> 2
	currPlayer = currPlayer === 1 ? 2 : 1;
	updateTurnDOM(currPlayer);
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
	function _win(cells) {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match currPlayer

		return cells.every(([ y, x ]) => y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && board[y][x] === currPlayer);
	}

	// TODO: read and understand this code. Add comments to help you.

	let conditions = [];
	for (let y = 0; y < HEIGHT; y++) {
		for (let x = 0; x < WIDTH; x++) {
			// check each possible way to win in connect 4
			// checks for vertical, horizontal, and both diagonal direcitons
			const horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
			const vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
			const diagDR = [ [ y, x ], [ y + 1, x + 1 ], [ y + 2, x + 2 ], [ y + 3, x + 3 ] ];
			const diagDL = [ [ y, x ], [ y + 1, x - 1 ], [ y + 2, x - 2 ], [ y + 3, x - 3 ] ];

			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
				conditions.push(horiz, vert, diagDR, diagDL);
				// grabs the coordinates for each winning piece and adds "grow" animation
				for (let test of conditions) {
					if (_win(test)) {
						test.forEach(function(value) {
							let [ y, x ] = value;
							document.getElementById(`${y}-${x}`).firstChild.classList.add('grow');
						});
					}
				}
				return true;
			}
		}
	}
}

function updateTurnDOM(currPlayer) {
	const p = document.querySelector('#playerTurn');
	const player = document.querySelector('#spanPlayer');
	if (currPlayer === 1) {
		player.style.color = 'blue';
	} else if (currPlayer === 2) {
		player.style.color = 'red';
	} else if (currPlayer === 'reset') {
		player.innerText = "Player 1's turn";
	}
	player.innerText = `Player ${currPlayer}'s`;
}

makeBoard();
makeHtmlBoard();
