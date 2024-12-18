// Gameboard IIFE module
const Gameboard = (function () {
    let gameboard = [
        ['X', 'X', 'O'],
        ['O', ' ', 'X'],
        ['O', 'O', 'X']
    ];

    const clearBoard = () => {
        gameboard = [
            [' ', ' ', ' '],
            [' ', ' ', ' '],
            [' ', ' ', ' ']
        ];
    }

    const logBoard = () => {
        gameboard.forEach(cell => console.log(cell));
    }

    const makeMove = (row, col, symbol) => {
        gameboard[row][col] = symbol;
    }

    const getBoard = () => gameboard;

    const checkForWin = () => {
        // wins in a row
        if (gameboard[0][0] != ' ' && (gameboard[0][0] == gameboard[0][1]) && (gameboard[0][1] == gameboard[0][2])) {
            return gameboard[0][0];
        };
        if (gameboard[1][0] != ' ' && (gameboard[1][0] == gameboard[1][1]) && (gameboard[1][1] == gameboard[1][2])) {
            return gameboard[1][0];
        };
        if (gameboard[2][0] != ' ' && (gameboard[2][0] == gameboard[2][1]) && (gameboard[2][1] == gameboard[2][2])) {
            return gameboard[2][0];
        };
        
        // wins in a column
        if (gameboard[0][0] != ' ' && (gameboard[0][0] == gameboard[1][0]) && (gameboard[1][0] == gameboard[2][0])) {
            return gameboard[0][0];
        };
        if (gameboard[0][1] != ' ' && (gameboard[0][1] == gameboard[1][1]) && (gameboard[1][1] == gameboard[2][1])) {
            return gameboard[0][1];
        };
        if (gameboard[0][2] != ' ' && (gameboard[0][2] == gameboard[1][2]) && (gameboard[1][2] == gameboard[2][2])) {
            return gameboard[0][2];
        };

        // diagonal wins
        if (gameboard[0][0] != ' ' && (gameboard[0][0] == gameboard[1][1]) && (gameboard[1][1] == gameboard[2][2])) {
            return gameboard[1][1];
        }
        if (gameboard[0][2] != ' ' && (gameboard[0][2] == gameboard[1][1]) && (gameboard[1][1] == gameboard[2][0])) {
            return gameboard[1][1];
        }
        return ' ';
    }

    return { logBoard, makeMove, clearBoard, getBoard, checkForWin }
})

// Game controller IIFE module
const GameController = (function () {
    const board = Gameboard();
    board.clearBoard();

    let players = [
        {
            name: "Player 1",
            token: 'X'
        },
        {
            name: "Player 2",
            token: 'O'
        }
    ]

    let activePlayer = players[0];

    const getActivePlayer = () => activePlayer;

    const switchPlayers = () => {
        activePlayer = getActivePlayer().token == 'X' ? players[1] : players[0];
    }

    const makePlayerMove = (row, col, token) => {
        board.makeMove(row, col, token);
    }

    const playTurn = (row, col) => {
        console.log(`${getActivePlayer().name} places an ${getActivePlayer().token} at (${col},${row}).`)
        makePlayerMove(row, col, getActivePlayer().token);

        board.logBoard();

        // check for win conditions
        if (board.checkForWin() != ' ') {
            console.log(`${getActivePlayer().name} wins!`);
            console.log("Let's play again.");
            board.clearBoard();
            board.logBoard();
        }

        switchPlayers();
        console.log(`${getActivePlayer().name}'s turn. Make a move!`);
    }

    return { playTurn };

})();
