// GameBoard.js
import React, { useState } from 'react';

const GameBoard = () => {
    const [playerHand, setPlayerHand] = useState([]);
    const [dealerHand, setDealerHand] = useState([]);
    const [message, setMessage] = useState('');

    // Start a new game
    const startGame = async () => {
        const response = await fetch('http://localhost:5000/start-game', {
            method: 'POST',
        });
        const data = await response.json();
        setPlayerHand(data.playerHand);
        setDealerHand(data.dealerHand);
        setMessage(data.message);
    };

    // Handle Hit action
    const hit = async () => {
        const response = await fetch('http://localhost:5000/hit', {
            method: 'POST',
        });
        const data = await response.json();
        setPlayerHand(data.playerHand);
        setMessage(data.message);
    };

    // Handle Stand action
    const stand = async () => {
        const response = await fetch('http://localhost:5000/stand', {
            method: 'POST',
        });
        const data = await response.json();
        setDealerHand(data.dealerHand);
        setMessage(data.message);
    };

    return (
        <div>
            <button className="new-game-btn" onClick={startGame}>New Game</button>
            <h1>Blackjack Game</h1>
            <div className="table">
                <div className="player-hand-section">
                    <h3>Player Hand</h3>
                    <div className="hand-container">
                        {playerHand.map((card, index) => (
                            <span key={index} className="card">
                                {card.value} of {card.suit}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="dealer-hand-section">
                    <h3>Dealer Hand</h3>
                    <div className="hand-container">
                        {dealerHand.map((card, index) => (
                            <span key={index} className="card">
                                {card.value} of {card.suit}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <p>{message}</p>
            <div className="buttons">
                <button onClick={hit}>Hit</button>
                <button onClick={stand}>Stand</button>
            </div>
        </div>
    );
};

export default GameBoard;
