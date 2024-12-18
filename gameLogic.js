// Gameboard IIFE module
const Gameboard = (function () {
    let gameboard = [
        ['X', 'X', ' '],
        ['O', 'O', 'X'],
        ['X', 'O', 'X']
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

        // checks for any playable spaces
        for (let i = 0; i < gameboard.length; i++) {
            for (let j = 0; j < gameboard[i].length; j++) {
              if (gameboard[i][j] == ' ') {
                return ' ';
              }
            }
          }

        // if all other checks failed, its a dead tie
        return 'tie!';
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

    const setPlayerName = (playerNum, newName) => {
        if (playerNum == 1) {
            players[0].name = newName;
        } else {
            players[1].name = newName;
        }
    }

    const switchPlayers = () => {
        activePlayer = getActivePlayer().token == 'X' ? players[1] : players[0];
    }

    const makePlayerMove = (row, col, token) => {
        board.makeMove(row, col, token);
    }

    const getGameState = () => {
        return {
            activePlayer: getActivePlayer(),
            board: board.getBoard(),
            winner: board.checkForWin()
        }
    }

    const isGameOver = () => {
        return board.checkForWin() != ' ';
    }

    const playTurn = (row, col) => {
        //console.log(`${getActivePlayer().name} places an ${getActivePlayer().token} at (${col},${row}).`)
        makePlayerMove(row, col, getActivePlayer().token);

        //board.logBoard();
        if (!isGameOver()) {
            switchPlayers();
        }
        
        DisplayController.renderGame(getGameState());
        //console.log(`${getActivePlayer().name}'s turn. Make a move!`);
    }

    return { playTurn, getGameState, setPlayerName };

})();

const DisplayController = (function () {
    // cache DOM
    const gameRoot = document.querySelector("#game-root");
    const player1Name = document.querySelector("#p1-name");
    const player2Name = document.querySelector("#p2-name");

    // click handler functions
    player1Name.addEventListener("focusout", () => {
        GameController.setPlayerName(1, player1Name.textContent);
        renderGame(GameController.getGameState()); // re-render info-text with new name
    });

    player2Name.addEventListener("focusout", () => {
        GameController.setPlayerName(2, player2Name.textContent);
        renderGame(GameController.getGameState()); // re-render info-text with new name
    });
    
    // main render function
    const renderGame = ({ activePlayer, board, winner }) => {
        // clear DOM
        gameRoot.innerHTML = '';

        // render the board
        const boardElement = document.createElement('div');
        boardElement.id = "game-board"

        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                const cell = document.createElement('h1');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.textContent = board[row][col];
                if (cell.textContent == " ") {
                    cell.addEventListener("click", () => GameController.playTurn(cell.dataset.row, cell.dataset.col));
                }
                boardElement.appendChild(cell);
            }
        }

        gameRoot.appendChild(boardElement);

        // render some helpful text based on the turn/winner
        const instructionText = document.createElement("h2");
        if (winner == ' ') {
            instructionText.textContent = `${activePlayer.name}'s turn to place an ${activePlayer.token}`;
        } else if (winner == 'tie!') {
            instructionText.textContent = `It's a tie! Let's play again.`;
        } else {
            instructionText.textContent = `${activePlayer.name} wins!`;
        }

        gameRoot.appendChild(instructionText);
    }

    renderGame(GameController.getGameState());

    return { renderGame };
})();