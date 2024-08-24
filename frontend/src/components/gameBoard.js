// frontend/src/components/GameBoard.js

import React, { useState } from 'react';
import { Game, Player } from '../gameLogic'; // Assuming the gameLogic.js is in the root of your project

const GameBoard = () => {
    const [game] = useState(() => new Game([new Player('Player 1'), new Player('Player 2')]));
    const [status, setStatus] = useState('');
    const [currentPlayer, setCurrentPlayer] = useState(game.getCurrentPlayer().name);

    const handleMove = (direction) => {
        const result = game.playTurn(direction);

        if (result.error) {
            setStatus(result.error);
        } else {
            setStatus(`${currentPlayer}: ${result.message} (${result.squareType})`);
            if (result.squareType === 'Dead End') {
                game.nextTurn();
                setCurrentPlayer(game.getCurrentPlayer().name);
            }
        }

        // Check if the player has moves left, if not, end the turn
        if (game.getCurrentPlayer().movesRemaining <= 0) {
            game.nextTurn();
            setCurrentPlayer(game.getCurrentPlayer().name);
        }
    };

    return (
        <div>
            <h1>Path to the Crown</h1>
            <h2>{`Current Player: ${currentPlayer}`}</h2>
            <p>{status}</p>
            <div>
                <button onClick={() => handleMove('North')}>Move North</button>
                <button onClick={() => handleMove('South')}>Move South</button>
                <button onClick={() => handleMove('East')}>Move East</button>
                <button onClick={() => handleMove('West')}>Move West</button>
            </div>
        </div>
    );
};

export default GameBoard;
