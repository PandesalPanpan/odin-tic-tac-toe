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

function GameController(players = [
        Player('Player 1', 'X'),
        Player('Player 2', 'O'),
    ]) {

    


    const gameBoard = GameBoard();

    const checkForWinner = () => {
        // 'continue' = no winner yet
        // 'win' = has winner
        // 'draw' 
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
            return 'win';
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

            return "win"; // someone won

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
                return "win";
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
                return "win";
            }
        }

        // if the board is all filled up then there's no way to place a symbol again
        // Get the board
        // initialize hasFoundUndefined = false
        let hasFoundUndefined = false;
        // Outer loop in the rows
        outerLoop: for (let rowIndex = 0; rowIndex < gridSize; rowIndex++) {
            // inner loop for each cell in the row
            for (let columnIndex = 0; columnIndex < gridSize; columnIndex++) {
                if (currentBoard[rowIndex][columnIndex].getCell() === undefined) {
                    hasFoundUndefined = true;
                    break outerLoop; // skip immediately since there are still empty cells
                }
            }
        }
        if (hasFoundUndefined === false) {
            return 'draw';
        }

        // No one won yet
        return 'continue';
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
       
       let checkWinner = checkForWinner();

        if (checkWinner === 'win') {
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

        checkWinner = checkForWinner();

        // Display the board in console after placing
        gameBoard.printBoard();

        if (checkWinner === 'draw') {
            result.message = "The game is a draw";
            result.type = 'draw';
            result.data = gameBoard.getBoard();
            return result;
        }


        // Check for winner after placing the symbol to immediately declare winner
        if (checkWinner === 'win') {
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
    let player1 = null;
    do {
        player1 = prompt("Enter X name: ");
    } while (player1 === null || player1.trim() === '');
    
    let player2 = null;
    do {
        player2 = prompt("Enter O name: ");
    } while (player2 === null || player2.trim() === '');

    const players = [
        Player(`${player1}`, 'X'),
        Player(`${player2}`, 'O'),
    ]

    const controller = GameController(players);
    const container = document.querySelector('.tic-tac-toe-container');

    // Select for player container
    const playerOneName = document.querySelector('.player-1-name');
    const playerTwoName = document.querySelector('.player-2-name');
    const playerOneWin = document.querySelector('.player-1-win');
    const playerTwoWin = document.querySelector('.player-2-win');

    playerOneName.textContent = `${player1 ?? 'Player 1'}`;
    playerTwoName.textContent = `${player2 ?? 'Player 2'}`;
    playerOneWin.textContent = 0;
    playerTwoWin.textContent = 0;

    // Add a reset button

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
                
                // Check if there's already a winner
                if (result.success == false && result.type === 'error') {
                    // Trigger a dialog that the game has to be reset
                    const userConfirmed = confirm("Game has ended, reset the game?");
                    if (userConfirmed) {
                        controller.resetGame();
                        buildScreenGameBoard();
                        return;
                    } else {
                        return;
                    }
                }

                // Check if it says 'Invalid Placement'
                if (result && result.type === 'invalid') {
                    // If so don't do anything
                    return;
                }
                
                // Check if if says contains 'Winner' get the current player
                if (result && result.type === 'win') {
                    // Update the board & display a dialog who's the winner
                    buildScreenGameBoard();
                    // Update the win display
                    updatePlayerWins(result.message.name, result.message.winCount);
                    console.log(`Winner: ${result.message.name}`);
                    console.log(`Win count: ${result.message.winCount}`);
                    const userConfirmed = confirm(`Winner: ${result.message.name}\n
                        Win: ${result.message.winCount}`);
                    if (userConfirmed) {
                        controller.resetGame();
                        buildScreenGameBoard();
                        return;
                    }
                    return;
                }

                if (result.type === 'draw') {
                    buildScreenGameBoard();
                    // Show a dialog to reset the game since its a draw
                    const userConfirmed = confirm("Draw: Reset the Game?");
                    if (userConfirmed) {
                        controller.resetGame();
                        buildScreenGameBoard();
                        return;
                    } else {
                        return;
                    }
                }
                

                if (result && result.type === 'continue') {
                    buildScreenGameBoard();
                    return;
                }


                throw Error(`Unchecked Data Received:
                    \nSucess:${result.success}
                    \nType:${result.type}
                    \nMessage:${result.message}
                    \nData:${result.data}`
                );
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

    const updatePlayerWins = (playerName, playerWins) => {
        // Check in the two players which matches
        if (playerName === playerOneName.textContent) {
            // update the player win count
            playerOneWin.textContent = `${playerWins}`;
            return;
        }

        if (playerName === playerTwoName.textContent) {
            // update the player win count
            playerTwoWin.textContent = `${playerWins}`;
            return;
        }

        throw Error(`updatePlayerWins() did not match with any players name from received argument PlayerName: ${playerName}, PlayerWins${playerWins}`)
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