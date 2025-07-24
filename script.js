// Gameboard Array is inside of a Gameboard Object
/*
3x3 Array
let gameBoard = [
    [
        "Row: 0 Col:0",
        "Row: 0 Col:1",
        "Row: 0 Col:2"
    ],
    [
        "Row: 1 Col:0",
        "Row: 1 Col:1",
        "Row: 1 Col:2"
    ],
    [
        "Row: 2 Col:0",
        "Row: 2 Col:1",
        "Row: 2 Col:2"
    ]
]
or
let gameBoard = [
[{},{},{}]
[{},{},{}]
[{},{},{}]
]
*/
function GameBoard() {
    const gridSize = 3;

    let board = [];

    const initializeBoard = () => {
        board.length = 0; // clear the array

        for (let rowIndex = 0; rowIndex < gridSize; rowIndex++) {
            board.push([]);
            for (let columnIndex = 0; columnIndex < gridSize; columnIndex++) {
                board[rowIndex][columnIndex] = Cell();
            }
        }
    };

    const getBoard = () => board;

    // the printBoard just need to push to the next line after each row
    const printBoard = () => {
        // Print each row with their actual values
        console.log("-------------------------------------------");
        for (let i = 0; i < gridSize; i++) {
            console.log(board[i].map(cell => {
                return cell.getCell();
            }))
        }
        console.log("-------------------------------------------");
    };

    const placeSymbol = (row, column, symbol) => {
        const selectedCell = board[row][column];
        // Check if the cell is empty
        if (selectedCell.getCell() !== undefined) {
            // Invalid move
            console.log("The cell already contains a symbol");
            return false;
        }

        // Place the symbol
        selectedCell.setCell(symbol);
        return true;

    }

    // Immediately Initialize the board
    initializeBoard();

    return {
        printBoard,
        initializeBoard,
        getBoard,
        placeSymbol
    }
}



// Cell Object that contains get and set
function Cell() {
    let cellValue = undefined;

    const getCell = () => cellValue;

    const setCell = (symbol) => {
        cellValue = symbol;
    }

    return {
        getCell,
        setCell,
    }
}

function Player(name, symbol) {
    const getName = () => name;
    const getSymbol = () => symbol;
    let wins = 0;
    const getWins = () => wins;
    const addWins = () => ++wins;

    return {
        getName,
        getSymbol,
        getWins,
        addWins
    };
}

function GameController() {
    // Get the players
    const players = [
        Player('Peter', 'X'),
        Player('Izabelle', 'O'),
    ]

    const gameBoard = GameBoard();

    const checkForWinner = () => {
        // Expecting a board like
        /*
        [
            [
                {}, {}, {}
            ],
            [
                {}, {}, {}
            ],
            [
                {}, {}, {}
            ]
        ]
        */
        // There are 8 possible winning conditions
        const currentBoard = gameBoard.getBoard();
        const gridSize = currentBoard[0].length;
        //console.log(`${currentBoard[0].length}`)

        // Check each row straight
        for (let rowIndex = 0; rowIndex < gridSize; rowIndex++) {
            /* 
            Get the symbol of the first one and it doesn't matter which one
            since if one doesn't match then its time break it
            */

            /* 
            Checking using the first symbol in that row since
            any mismatch of the symbol should be removed
            */
            const symbolToCheck = currentBoard[rowIndex][0].getCell();

            // Make sure the symbol is not undefined, if so move to the next row immediately
            if (symbolToCheck === undefined) {
                continue;
            }

            let rowMismatchFound = false;

            // Check each cell in the row if has the same symbol
            for (let columnIndex = 0; columnIndex < gridSize; columnIndex++) {
                if (symbolToCheck !== currentBoard[rowIndex][columnIndex].getCell()) {
                    rowMismatchFound = true;
                    break;
                }
            }
            // If mismatch is found, move on to the next row
            if (rowMismatchFound === true) {
                continue;
            }
            // If no mismatch is found === all symbol is the same then winning condition is met
            return true;
        }

        // Check each column top-down
        for (let columnIndex = 0; columnIndex < gridSize; columnIndex++) {
            // Loop through using a column index
            // Get the first value in column index first row
            const symbolToCheck = currentBoard[0][columnIndex].getCell();
            // Check if that value is undefined therefore move on to the next column
            if (symbolToCheck === undefined) {
                continue; // Skip the column since it has undefined cell
            }
            // Initialize columnMismatchFound = false
            let columnMismatchFound = false;
            // Loop through using a row index
            for (let rowIndex = 0; rowIndex < gridSize; rowIndex++) {
                // Grab the value in the current column in each rows
                // Check if the value mismatched with the symbolToCheck
                if (symbolToCheck !== currentBoard[rowIndex][columnIndex].getCell()) {
                    // Change the value of the columnMismatchFound = true and break the inner row loop since that column is useless
                    columnMismatchFound = true;
                    break;
                }
            }

            // if the columnMismatch is true then it means that the column does not contain the winning conditions
            if (columnMismatchFound === true) {
                break; // skip to the next column
            }

            return "someone won"; // someone won

        }

        // Check the the two diagonals for checks
        // Start with top left going to the bottom right
        // just hardcode the check in the cross
        // Check if topLeft, middle, bottomRight are equals
        const topLeftToBottomRight = [
            currentBoard[0][0].getCell(),
            currentBoard[1][1].getCell(),
            currentBoard[2][2].getCell(),
        ]


        if (topLeftToBottomRight[0] !== undefined) {
            const checkTopLeftToBottomRight = topLeftToBottomRight.every(cell => cell === topLeftToBottomRight[0]);
            if (checkTopLeftToBottomRight === true) {
                return "Top Left to Bottom Right";
            }
        }

        const topRightToBottomLeft = [
            currentBoard[0][2].getCell(),
            currentBoard[1][1].getCell(),
            currentBoard[2][0].getCell(),
        ]

        if (topRightToBottomLeft[0] !== undefined){
            const checkTopRightToBottomLeft = topRightToBottomLeft.every(cell => cell === topLeftToBottomRight[0]);
            if (checkTopRightToBottomLeft === true) {
                return "Top Right to Bottom Left";
            }
        }

        // No one won yet
        return false;
    }

    const resetGame = () => {
        gameBoard.initializeBoard();
    }

    // Determine who's turn it is at first randomly
    let activePlayer = players[Math.floor(Math.random() * 2)];

    const getActivePlayer = () => activePlayer;

    const playRound = (row, column) => {
        /*
            Create a object that returns the state of the game
            to allow the ScreenController to check for consistent properties
        */
       const result = {
            success: false, // True if its the expected action
            type: 'invalid', // 'Invalid', 'continue', 'win', 'error'
            message: '',
            data: null // either the gameBoard or user data
       }

        if (checkForWinner() !== false) {
            result.type = 'error';
            result.message = 'The game has already won, reset the game'
            return result;
        }

        const isSucess = gameBoard.placeSymbol(row, column, getActivePlayer().getSymbol());

        if (!isSucess) {
            // The game failed to place a symbol due to having already have a symbol placed
            result.message = 'Invalid move';
            return result;
        }

        // Display the board in console after placing
        gameBoard.printBoard();

        // Check for winner after placing the symbol to immediately declare winner
        if (checkForWinner() !== false) {
            // Get the current player and mark them as winner, add it to the user
            activePlayer.addWins();
            const name = activePlayer.getName();
            const winCount = activePlayer.getWins();
            result.message = {name, winCount}
            result.data = gameBoard.getBoard();
            result.type = 'win';
            return result;
        }

        // Switch the player if its success
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
        console.log(`${activePlayer.getName()} turns`);
        result.success = true;
        result.type = 'continue';
        result.message = `${activePlayer.getName()}`;
        result.data = gameBoard.getBoard();

        return result;
    }

    gameBoard.printBoard();

    return {
        getActivePlayer,
        playRound,
        resetGame,
        gameBoardArray: gameBoard.getBoard() 
    }
}

// const controller = GameController();

/*
    ScreenController will have instance of the GameController
    Will manage the displaying in the HTML based on the output in the GameController
*/
function ScreenController() {
    const controller = GameController();
    const container = document.querySelector('.container');

    const buildScreenGameBoard = () => {
        // Build the screen based on the 3x3 Array
        container.innerHTML = '';

        for (let i = 1; i <= 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = `cell-${i}`;

            const rowAndColumn = getCellIdRowColumn(`cell-${i}`);
            if (rowAndColumn === undefined) {
                throw Error('getCellIdRowColumn() fail in getting proper row and column');
            }

            // Get the Symbol in that cell from the array
            const symbol = controller.gameBoardArray[rowAndColumn[0]][rowAndColumn[1]].getCell();
            
            // If the symbol is undefined, don't place anything
            if (symbol === undefined) {
                cell.innerHTML = ' ';
            } else {
                cell.innerHTML = `${symbol}`;
            }

            container.appendChild(cell);
        }
    }

    // Initialize the eventListener
    const initializeScreenListener = () => {
        container.addEventListener('click', (event) => {
            if (event.target.classList.contains('cell')) {
                const cell_id = event.target.id;
                // Trigger playRound
                const rowColumnArray = getCellIdRowColumn(cell_id);

                const result = controller.playRound(rowColumnArray[0], rowColumnArray[1]);
                // Check if it says 'Invalid Placement'
                if (result && result.type === 'invalid') {
                    // If so don't do anything
                    return;
                }
                
                // Check if if says contains 'Winner' get the current player
                if (result && result.type === 'win') {
                    // Update the board & display a dialog who's the winner
                    buildScreenGameBoard();
                    console.log(`Winner: ${result.message.name}`);
                    console.log(`Win count: ${result.message.winCount}`);
                    // TODO: Add a win count display
                    return;
                }
                

                if (result && result.type === 'continue') {
                    buildScreenGameBoard();
                    return;
                }


                throw Error(`Unchecked Data Received: ${result}`);
            }
        })
    }

    const getCellIdRowColumn = (cellId) => {
        // [Row, Column]
        
        switch (cellId) {
            case 'cell-1':
                return [0,0];
            case 'cell-2':
                return [0,1];
            case 'cell-3':
                return [0,2];
            case 'cell-4':
                return [1,0];
            case 'cell-5':
                return [1,1];
            case 'cell-6':
                return [1,2];
            case 'cell-7':
                return [2,0];
            case 'cell-8':
                return [2,1];
            case 'cell-9':
                return [2,2];
            default:
                throw Error(`getCellIdRowColumn invalid cellId: ${cellId}`);
        }
    }

    return {
        buildScreenGameBoard,
        initializeScreenListener
    }
}

const screenController = ScreenController();
// TODO: Change to whne the DOMContentLoaded to initialize the ScreenController
document.addEventListener('DOMContentLoaded', (event) => {
    screenController.buildScreenGameBoard();
    screenController.initializeScreenListener();
})