// gameLogic.js

class GameBoard {
    constructor() {
        this.board = { '0,0': 'The Four Way Path' };
    }

    flipSquare(x, y) {
        const squareType = Math.random() > 0.5 ? 'Straight Path' : 'Dead End';
        this.board[`${x},${y}`] = squareType;
        return squareType;
    }

    checkSquare(x, y) {
        return this.board[`${x},${y}`];
    }
}

class Player {
    constructor(name) {
        this.name = name;
        this.position = { x: 0, y: 0 };
        this.movesRemaining = 4;
    }

    move(direction) {
        if (this.movesRemaining <= 0) return false;

        switch (direction) {
            case 'North': this.position.y += 1; break;
            case 'South': this.position.y -= 1; break;
            case 'East': this.position.x += 1; break;
            case 'West': this.position.x -= 1; break;
            default: return false;
        }

        this.movesRemaining -= 1;
        return true;
    }

    resetMoves() {
        this.movesRemaining = 4;
    }
}

class Game {
    constructor(players) {
        this.players = players;
        this.board = new GameBoard();
        this.currentPlayerIndex = 0; // Track whose turn it is
    }

    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }

    nextTurn() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        this.getCurrentPlayer().resetMoves();
    }

    playTurn(direction) {
        const player = this.getCurrentPlayer();
        if (!player.move(direction)) return { error: "No moves left or invalid direction" };

        const { x, y } = player.position;
        let squareType = this.board.checkSquare(x, y);

        if (!squareType) {
            squareType = this.board.flipSquare(x, y);
        }

        if (squareType === 'Dead End') {
            return { message: "Dead End! You must backtrack.", squareType };
        } else {
            return { message: "You found a path!", squareType };
        }
    }
}

module.exports = { GameBoard, Player, Game };
