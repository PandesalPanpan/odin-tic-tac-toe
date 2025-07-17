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

    // Create a board based on gridSize
    for (let rowIndex = 0; rowIndex < gridSize; rowIndex++) {
        board.push([]);
        for (let columnIndex = 0; columnIndex < gridSize; columnIndex++) {
            board[rowIndex][columnIndex] = Cell();
        }
    }
    const getBoard = () => board;

    const resetBoard = () => board = [];

    return {
        getBoard,
        resetBoard
    }
}



// Cell Object that contains get and set
function Cell() {
    let cell = undefined;

    const getCell = () => cell;

    const setCell = (newCell) => {
        cell = newCell;
    }

    return {
        getCell,
        setCell,
    }
}

function Player(name) {
    const getName = () => name;
    let wins;
    const getWins = () => wins;
    const addWins = () => ++wins;

    return {
        getName,
        getWins,
        addWins
    };
}

function GameController() {
    // Get the players
    const players = [
        Player('Peter'),
        Player('Izabelle'),
    ]    

    const gameBoard = GameBoard();

    // Determine who's turn it is at first randomly
    let activePlayer = players[Math.floor(Math.random() * 2)];
    
    const getActivePlayer = () => activePlayer;

    // Ability to insert in a row x column to change the value of a cell


    return {
        getActivePlayer,
        gameBoard,
    }
}

const controller = GameController();

// Players are stored in objects

// An Object to control the flow of the game itself