// Initialize player and computer scores
let playerScore = 0;
let computerScore = 0;

// Retrieve high score from localStorage or initialize it to 0
let highScore = localStorage.getItem('highScore') || 0;

// Update the high score display on page load
const highScoreSpan = document.getElementById('high-score');
highScoreSpan.textContent = highScore;

// Add event listeners to the buttons
document.querySelectorAll('.choice').forEach(button => {
    button.addEventListener('click', () => {
        const playerChoice = button.getAttribute('data-choice'); // Get player's choice
        const computerChoice = getComputerChoice(); // Get computer's random choice
        const result = determineWinner(playerChoice, computerChoice); // Determine winner

        updateScores(result); // Update scores
        displayResult(playerChoice, computerChoice, result); // Display result
        updateHighScore(); // Update the high score if needed
    });
});

// Reset button event listener
document.getElementById('reset-btn').addEventListener('click', resetGame);

// Function to get a random choice for the computer
function getComputerChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
}

// Function to determine the winner
function determineWinner(player, computer) {
    if (player === computer) return 'tie';
    if (
        (player === 'rock' && computer === 'scissors') ||
        (player === 'scissors' && computer === 'paper') ||
        (player === 'paper' && computer === 'rock')
    ) {
        return 'player';
    }
    return 'computer';
}

// Function to update scores
function updateScores(result) {
    if (result === 'player') {
        playerScore++;
    } else if (result === 'computer') {
        computerScore++;
    }
    document.getElementById('player-score').textContent = playerScore;
    document.getElementById('computer-score').textContent = computerScore;
}

// Function to display the result
function displayResult(player, computer, result) {
    const resultDiv = document.getElementById('result');
    let message = `You chose ${player}, Computer chose ${computer}. `;
    if (result === 'player') {
        message += 'You Win! 🥳';
    } else if (result === 'computer') {
        message += 'Computer Wins! 😔';
    } else {
        message += "It's a Tie! 😐";
    }
    resultDiv.innerHTML = `<p>${message}</p>`;
}

// Function to update the high score
function updateHighScore() {
    if (playerScore > highScore) {
        highScore = playerScore; // Update high score if player beats it
        localStorage.setItem('highScore', highScore); // Save the high score to localStorage
        highScoreSpan.textContent = highScore; // Update the displayed high score
    }
}

// Function to reset the game
function resetGame() {
    playerScore = 0;
    computerScore = 0;
    document.getElementById('player-score').textContent = playerScore;
    document.getElementById('computer-score').textContent = computerScore;
    document.getElementById('result').innerHTML = '<p>Make your move!</p>';
}
