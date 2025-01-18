const images = [
  "Assets/cheeseburger.png",
  "Assets/fries.png",
  "Assets/hotdog.png",
  "Assets/ice-cream.png",
  "Assets/milkshake.png",
  "Assets/pizza.png",
];

const blankImage = "Assets/blankk.avif";
const whiteImage = "Assets/whitee.png";

const cardGrid = document.getElementById("card-grid");
const startGameButton = document.getElementById("start-game");
const winMessage = document.getElementById("win-message");
const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const timerPopup = document.getElementById("timer-popup");

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let score = 0;
let timer = 60;
let timerInterval;

function shuffleCards() {
  const doubledImages = [...images, ...images];
  return doubledImages
    .sort(() => Math.random() - 0.5)
    .map((image, index) => ({
      id: index,
      image,
      matched: false,
    }));
}

function renderCards(cards) {
  cardGrid.innerHTML = "";
  cards.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.dataset.id = card.id;

    cardElement.innerHTML = `
      <div class="front"><img src="${blankImage}" alt="Blank Card"></div>
      <div class="back"><img src="${card.image}" alt="Card Image"></div>
    `;

    cardElement.addEventListener("click", () =>
      handleCardClick(card, cardElement)
    );
    cardGrid.appendChild(cardElement);
  });
}

function handleCardClick(card, cardElement) {
  if (flippedCards.length === 2 || card.matched || flippedCards.includes(card)) {
    return;
  }

  cardElement.classList.add("flipped");
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    setTimeout(checkForMatch, 1000);
  }
}

function checkForMatch() {
  const [card1, card2] = flippedCards;

  if (card1.image === card2.image) {
    card1.matched = true;
    card2.matched = true;
    matchedPairs++;
    score += 10;
    updateScore();

    document.querySelectorAll(".flipped").forEach((cardElement) => {
      cardElement.classList.add("matched");
      cardElement.classList.remove("flipped");
      cardElement.querySelector(".front img").src = whiteImage;
    });
  } else {
    document.querySelectorAll(".flipped").forEach((cardElement) => {
      cardElement.classList.remove("flipped");
    });
  }

  flippedCards = [];

  if (matchedPairs === images.length) {
    winMessage.classList.remove("hidden");
    clearInterval(timerInterval);
    startGameButton.disabled = false;
  }
}

function updateScore() {
  scoreElement.textContent = `Score: ${score}`;
}

function startGame() {
  winMessage.classList.add("hidden");
  matchedPairs = 0;
  score = 0;
  updateScore();
  cards = shuffleCards();
  renderCards(cards);

  timer = 60;
  timerElement.textContent = `Time Left: ${timer}s`;
  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 1000);

  startGameButton.disabled = true;
}

function updateTimer() {
  timer--;
  timerElement.textContent = `Time Left: ${timer}s`;

  if (timer === 0) {
    clearInterval(timerInterval);
    document.querySelectorAll(".card").forEach((card) => {
      card.style.pointerEvents = "none";
    });
    showTimerPopup();
    startGameButton.disabled = false;
  }
}

function showTimerPopup() {
  timerPopup.classList.remove("hidden");
  timerPopup.style.display = "block";
}

function closePopup() {
  timerPopup.classList.add("hidden");
  timerPopup.style.display = "none";
  document.querySelectorAll(".card").forEach((card) => {
    card.style.pointerEvents = "auto";
  });
}

startGameButton.addEventListener("click", startGame);
