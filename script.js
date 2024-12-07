// Game Variables
const game = document.getElementById("game");
const paddle1 = document.getElementById("paddle1");
const paddle2 = document.getElementById("paddle2");
const ball = document.getElementById("ball");
const player1ScoreElement = document.getElementById("player1-score");
const player2ScoreElement = document.getElementById("player2-score");
const winnerElement = document.getElementById("winner");

let paddle1Y = 150;
let paddle2Y = 150;
let ballX = 390;
let ballY = 190;
let ballSpeedX = 4;
let ballSpeedY = 4;
let player1Score = 0;
let player2Score = 0;

// AI Difficulty Levels
let difficulty = 'medium'; // 'easy', 'medium', 'hard'

// Winning Score
const WINNING_SCORE = 5;

// Paddle Speed for AI (adjustable per difficulty)
let AI_SPEED = 3;

// Move Paddles with Keypress (Player 1)
document.addEventListener("keydown", (e) => {
  if (e.key === "w" && paddle1Y > 0) paddle1Y -= 20; // Paddle 1 Up
  if (e.key === "s" && paddle1Y < 300) paddle1Y += 20; // Paddle 1 Down
  updatePaddles();
});

// Set AI Speed based on difficulty
function setAISpeed() {
  switch (difficulty) {
    case 'easy':
      AI_SPEED = 2; // Slow AI
      break;
    case 'medium':
      AI_SPEED = 4; // Medium speed AI
      break;
    case 'hard':
      AI_SPEED = 6; // Fast AI
      break;
  }
}

// Update Paddles Position
function updatePaddles() {
  paddle1.style.top = paddle1Y + "px";
  paddle2.style.top = paddle2Y + "px";
}

// Update Ball Position
function updateBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Bounce on Top & Bottom Walls
  if (ballY <= 0 || ballY >= 380) ballSpeedY *= -1;

  // Paddle Collisions
  if (ballX <= 30 && ballY >= paddle1Y && ballY <= paddle1Y + 100) ballSpeedX *= -1;
  if (ballX >= 750 && ballY >= paddle2Y && ballY <= paddle2Y + 100) ballSpeedX *= -1;

  // Reset Ball if Out of Bounds and Update Score
  if (ballX <= 0) {
    player2Score++;
    resetBall();
  }
  if (ballX >= 780) {
    player1Score++;
    resetBall();
  }

  ball.style.left = ballX + "px";
  ball.style.top = ballY + "px";

  updateScore();
  checkWinCondition();
}

// AI Logic to Move Paddle 2
function moveAI() {
  setAISpeed(); // Set AI speed based on difficulty level

  // Follow the Ball's Y Position
  if (paddle2Y + 50 < ballY) {
    paddle2Y += AI_SPEED; // Move AI down if ball is below
  } else if (paddle2Y + 50 > ballY) {
    paddle2Y -= AI_SPEED; // Move AI up if ball is above
  }

  // Prevent AI from moving out of bounds
  if (paddle2Y < 0) paddle2Y = 0;
  if (paddle2Y > 300) paddle2Y = 300;

  updatePaddles();
}

// Reset Ball Position
function resetBall() {
  ballX = 390;
  ballY = 190;
  ballSpeedX = ballSpeedX > 0 ? -4 : 4; // Reverse Starting Direction
}

// Update Scoreboard
function updateScore() {
  player1ScoreElement.textContent = player1Score;
  player2ScoreElement.textContent = player2Score;
}

// Check Win Condition
function checkWinCondition() {
  if (player1Score >= WINNING_SCORE) {
    displayWinner("Player 1 Wins!");
  } else if (player2Score >= WINNING_SCORE) {
    displayWinner("AI Wins!");
  }
}

// Display Winner and Reset Game
function displayWinner(message) {
  winnerElement.textContent = message;
  winnerElement.style.display = "block";
  setTimeout(() => {
    player1Score = 0;
    player2Score = 0;
    updateScore();
    winnerElement.style.display = "none";
    resetBall();
  }, 3000);
}

// Game Loop
function gameLoop() {
  updateBall();
  moveAI();  // Move the AI paddle automatically
  requestAnimationFrame(gameLoop);
}

// Start Game
updatePaddles();
gameLoop();
