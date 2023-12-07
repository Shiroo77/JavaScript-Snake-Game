const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");

// If we declare this width & height in CSS
// They wouldn't be available to us right away.
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;

const boardBackground = "white";
const snakeColor = "lightgreen";
const snakeBorder = "black";
const foodColor = "red";
const unitSize = 25;

let running = false; // Game running or not
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;

// Snake is array of objects.
let snake = [
  // Each object is a body part of the snake
  { x: unitSize * 4, y: 0 },
  { x: unitSize * 3, y: 0 },
  { x: unitSize * 2, y: 0 },
  { x: unitSize, y: 0 },
  { x: 0, y: 0 },
];

// Listen for key events
window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

gameStart();

// Game Start
function gameStart() {
  running = true;
  scoreText.textContent = score;
  // invoke the functions
  createFood();
  drawFood();
  nextTick();
}

// This method is used to:
// sets up a game loop that continuously updates the game state and renders the game
function nextTick() {
  if (running) {
    setTimeout(() => {
      clearBoard();
      drawFood();
      moveSnake();
      drawSnake();
      checkGameOver();
      nextTick();
    }, 90);
  } else {
    displayGameOver();
  }
}

// This method is used to:
// primary purpose of clearBoard() is to erase the previous frame's content from the canvas
function clearBoard() {
  ctx.fillStyle = boardBackground;
  // the rectangle covers the entire canvas.
  ctx.fillRect(0, 0, gameWidth, gameHeight);
}

// Create Food
function createFood() {
  function randomFood(min, max) {
    const randNum =
      Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
    return randNum;
  }

  foodX = randomFood(0, gameWidth - unitSize);
  foodY = randomFood(0, gameWidth - unitSize);
}

// Draw the food
function drawFood() {
  ctx.fillStyle = foodColor;
  ctx.fillRect(foodX, foodY, unitSize, unitSize);
}

// Move the snake
function moveSnake() {
  // Create new head in the direction we're moving
  // Then remove the tail
  const head = {
    x: snake[0].x + xVelocity,
    y: snake[0].y + yVelocity,
  };

  snake.unshift(head);

  // if food is eaten
  if (snake[0].x == foodX && snake[0].y == foodY) {
    score += 1;
    scoreText.textContent = score;
    createFood();
 
  } 
  else {
    // If the snake hasn't eaten food,
    // the last element (tail) of the snake is removed using the pop() method.
    snake.pop();
  }
}

// Draw snake on canvas
function drawSnake() {
  ctx.fillStyle = snakeColor;

  ctx.strokeStyle = snakeBorder;

  snake.forEach((snakePart) => {
    // We begin painting wherever the snake part currently is.
    ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);

    ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
  });
}

// We invoke this function everytime we press a key
function changeDirection(event) {
  const keyPressed = event.keyCode;

  const LEFT = 37;
  const UP = 38;
  const RIGHT = 39;
  const DOWN = 40;

  // This is boolean variables 
  const goingUp = (yVelocity == -unitSize);
  const goingDown = (yVelocity == unitSize);
  const goingRight = (xVelocity == unitSize);
  const goingLeft = (xVelocity == -unitSize);

  // Here, we don't want to move to the left & immediately to the right
  switch (true) {
    case keyPressed == LEFT && !goingRight:
      // If we want to go left then -unitSize
      // yVelocity = 0; we're not going up or down
      xVelocity = -unitSize;
      yVelocity = 0;
      break;

    case keyPressed == UP && !goingDown:
      xVelocity = 0;
      yVelocity = -unitSize;
      break;

    case keyPressed == RIGHT && !goingLeft:
      xVelocity = unitSize;
      yVelocity = 0;
      break;

    case keyPressed == DOWN && !goingUp:
      xVelocity = 0;
      yVelocity = unitSize;
      break;
  }
}

// Game Over
function checkGameOver() {
  switch (true) {
    case snake[0].x < 0:
      running = false;
      break;

    case snake[0].x >= gameWidth:
      running = false;
      break;

    case snake[0].y < 0:
      running = false;
      break;

    case snake[0].y >= gameHeight:
      running = false;
      break;
  }

  // Game over condition 
  // If any bodypart of the snake overlaps 
  // If the head of our snake is == one of our body parts => GAME OVER 
  for (let i = 1; i < snake.length; i += 1) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      running = false;
    }
  }
}

// Display Game Over 
function displayGameOver() {
  ctx.font = "50px MV Boli";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);
  running = false;
}

// Reset the Game 
function resetGame() {
  score = 0;
  xVelocity = unitSize;
  yVelocity = 0;
  snake = [
    { x: unitSize * 4, y: 0 },
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 },
  ];
  // Reset all the values & start the game again 
  gameStart();
}
