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

    const board = [];

    const initializeBoard = () => {
        for (let rowIndex = 0; rowIndex < gridSize; rowIndex++) {
            board.push([]);
            for (let columnIndex = 0; columnIndex < gridSize; columnIndex++) {
                board[rowIndex][columnIndex] = Cell();
            }
        }
        console.log(board);
    };


    // the getBoard just need to push to the next line after each row
    const getBoard = () => {
        // Print each row with their actual values
        console.log("Board:");
        for (let i = 0; i < gridSize; i++) {
            console.log(board[0].map(cell => {
                cell.getCell();
            }))
        }
    };

    const placeSymbol = (symbol, row, column) => {
        const cell = board[row][column];
        // Check if the cell is empty
        if (cell.getCell() !== undefined) {
            // Invalid move
            console.log("The cell already contains a symbol");
            return false;
        }

        // Place the symbol
        cell.setCell(symbol);
        return true;

    }

    // Immediately Initialize the board
    initializeBoard();

    return {
        getBoard,
        initializeBoard,
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
    let wins;
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

    // Determine who's turn it is at first randomly
    let activePlayer = players[Math.floor(Math.random() * 2)];

    const getActivePlayer = () => activePlayer;

    const playRound = (row, column) => {
        const isSucess = gameBoard.placeSymbol(row, column, getActivePlayer().getSymbol());

        if (!isSucess) {
            return "Failed to Move";
        }

        // Switch the player if its success
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
        console.log(`${activePlayer.getName()} turns`);

        // Display the board in console after each round
        gameBoard.getBoard();
    }

    console.log(gameBoard.getBoard());

    return {
        getActivePlayer,
        playRound,
    }
}

const controller = GameController();

// Players are stored in objects

// An Object to control the flow of the game itself