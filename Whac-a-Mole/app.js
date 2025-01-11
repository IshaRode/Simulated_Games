const holes = document.querySelectorAll('.hole');
const moles = document.querySelectorAll('.mole');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const startButton = document.getElementById('startButton');

let score = 0;
let timeLeft = 30;
let gameInterval;
let moleInterval;
let isPlaying = false;

function randomHole() {
    const index = Math.floor(Math.random() * holes.length);
    return moles[index];
}

function showMole() {
    const mole = randomHole();
    mole.classList.add('active');
    
    setTimeout(() => {
        mole.classList.remove('active');
        if (isPlaying) showMole();
    }, Math.random() * 1000 + 500);
}

function bonk(e) {
    if (!e.target.classList.contains('active')) return;
    
    score++;
    scoreDisplay.textContent = score;
    
    e.target.classList.remove('active');
    e.target.parentNode.classList.add('bonk');
    
    setTimeout(() => {
        e.target.parentNode.classList.remove('bonk');
    }, 500);
}

function startGame() {
    if (isPlaying) return;
    
    isPlaying = true;
    score = 0;
    timeLeft = 30;
    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;
    startButton.disabled = true;

    showMole();

    gameInterval = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(gameInterval);
            isPlaying = false;
            startButton.disabled = false;
            
            // Hide any remaining active moles
            moles.forEach(mole => mole.classList.remove('active'));
            
            alert(`Game Over! Your score: ${score}`);
        }
    }, 1000);
}

moles.forEach(mole => mole.addEventListener('click', bonk));
startButton.addEventListener('click', startGame);