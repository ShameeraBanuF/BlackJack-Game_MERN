// server.js
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Sample in-memory game data (use MongoDB for production)
let deck = [];
let playerHand = [];
let dealerHand = [];

function initializeDeck() {
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const values = [
        '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'
    ];
    deck = suits.flatMap(suit => values.map(value => ({ suit, value })));
    shuffleDeck();
}

function shuffleDeck() {
    deck.sort(() => Math.random() - 0.5);
}

function dealCard(hand) {
    hand.push(deck.pop());
}

function calculateTotal(hand) {
    let total = 0;
    let aceCount = 0;
    hand.forEach(card => {
        if (['J', 'Q', 'K'].includes(card.value)) total += 10;
        else if (card.value === 'A') {
            total += 11;
            aceCount += 1;
        } else total += parseInt(card.value);
    });
    while (total > 21 && aceCount) {
        total -= 10;
        aceCount -= 1;
    }
    return total;
}

app.post('/start-game', (req, res) => {
    initializeDeck();
    playerHand = [];
    dealerHand = [];
    dealCard(playerHand);
    dealCard(playerHand);
    dealCard(dealerHand);
    res.json({ playerHand, dealerHand, message: "Game started" });
});

app.post('/hit', (req, res) => {
    dealCard(playerHand);
    const total = calculateTotal(playerHand);
    if (total > 21) {
        res.json({ playerHand, message: "Busted!" });
    } else {
        res.json({ playerHand, message: "Hit successful" });
    }
});

app.post('/stand', (req, res) => {
    let dealerTotal = calculateTotal(dealerHand);
    while (dealerTotal < 17) {
        dealCard(dealerHand);
        dealerTotal = calculateTotal(dealerHand);
    }
    const playerTotal = calculateTotal(playerHand);
    let message = "Game Over!";
    if (playerTotal > 21) message = "Player busts, dealer wins!";
    else if (dealerTotal > 21) message = "Dealer busts, player wins!";
    else if (playerTotal > dealerTotal) message = "Player wins!";
    else if (playerTotal < dealerTotal) message = "Dealer wins!";
    else message = "It's a tie!";
    res.json({ dealerHand, message });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
