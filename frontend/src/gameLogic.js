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
        this.lastMoveDirection = null;  // Track the last direction the player moved
        this.restrictedDirection = null; // Restrict the next move if hitting a dead end
    }

    move(direction) {
        if (this.movesRemaining <= 0) return false;

        // If restricted, only allow the opposite of the last move direction
        if (this.restrictedDirection && direction !== this.restrictedDirection) {
            console.log(`${this.name} can only move ${this.restrictedDirection} after hitting a dead end.`);
            return false;
        }

        switch (direction) {
            case 'North': this.position.y += 1; break;
            case 'South': this.position.y -= 1; break;
            case 'East': this.position.x += 1; break;
            case 'West': this.position.x -= 1; break;
            default: return false;
        }

        this.movesRemaining -= 1;
        this.lastMoveDirection = direction; // Store the last move direction

        // If they are moving away from a dead end, reset the restriction
        if (this.restrictedDirection && direction === this.restrictedDirection) {
            this.restrictedDirection = null;
        }

        return true;
    }

    restrictNextMove() {
        // Set the restricted direction based on the last move direction
        switch (this.lastMoveDirection) {
            case 'North': this.restrictedDirection = 'South'; break;
            case 'South': this.restrictedDirection = 'North'; break;
            case 'East': this.restrictedDirection = 'West'; break;
            case 'West': this.restrictedDirection = 'East'; break;
            default: this.restrictedDirection = null; break;
        }
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
            player.restrictNextMove();  // Restrict the next move to the opposite direction
            return { message: "Dead End! You must backtrack.", squareType };
        } else {
            return { message: "You found a path!", squareType };
        }
    }
}

module.exports = { GameBoard, Player, Game };
