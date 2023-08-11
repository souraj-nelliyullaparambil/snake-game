const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let canvasSize;
if (window.innerWidth - 50 <= 712) {
  canvasSize = Math.floor( window.innerWidth - 50);
} else {
  canvasSize = 700;
}
canvas.width = canvasSize;
canvas.height = canvasSize;
const snakeBox = 20;
const totalMove = canvasSize / snakeBox;
const apple = new Image();
apple.src = "images/apple.png";
let dead = new Audio();
let eat = new Audio();
let up = new Audio();
let down = new Audio();
let left = new Audio();
let right = new Audio();
dead.src = "audio/dead.mp3";
eat.src = "audio/eat.mp3";
up.src = "audio/up.mp3";
down.src = "audio/down.mp3";
left.src = "audio/left.mp3";
right.src = "audio/right.mp3";

// define snake//
let snake = [];
snake[0] = {
  x: 9 * snakeBox,
  y: 10 * snakeBox,
};

// create food
let food = {};
getFood();

// score
let score = 0;

// snake direction
let dir = "";

///MOBILE CODE
const upButton = document.getElementById("upButton");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");
const downButton = document.getElementById("downButton");

upButton.addEventListener("click", () => {
  if (dir !== "DOWN") {
    dir = "UP";
    up.play();
  }
});

leftButton.addEventListener("click", () => {
  if (dir !== "RIGHT") {
    dir = "LEFT";
    left.play();
  }
});

rightButton.addEventListener("click", () => {
  if (dir !== "LEFT") {
    dir = "RIGHT";
    right.play();
  }
});

downButton.addEventListener("click", () => {
  if (dir !== "UP") {
    dir = "DOWN";
    down.play();
  }
});

// LAPTOP
document.addEventListener("keydown", direction);

function direction() {
  let key = event.keyCode;
  if (key == 37 && dir != "RIGHT") {
    dir = "LEFT";
    left.play();
  } else if (key == 38 && dir != "DOWN") {
    dir = "UP";
    up.play();
  } else if (key == 39 && dir != "LEFT") {
    dir = "RIGHT";
    right.play();
  } else if (key == 40 && dir != "UP") {
    dir = "DOWN";
    down.play();
  }
}

function getFood() {
  food = {
    x: Math.floor(Math.random() * (totalMove - 2 - 3) + 3) * snakeBox,
    y: Math.floor(Math.random() * (totalMove - 2 - 3) + 3) * snakeBox,
  };
}
//collision detection
function collisionDetection(head, ar) {
  for (i = 0; i < ar.length; ++i) {
    if (ar[i].x == head.x && ar[i].y == head.y) {
      return true;
    }
  }
  return false;
}

// canvas design
function render() {
  ctx.fillStyle = "#dcdcdc";
  ctx.fillRect(0, 0, canvasSize, canvasSize);
  for (let i = 0; i < snake.length; ++i) {
    ctx.fillStyle = i == 0 ? "red" : "white";
    ctx.fillRect(snake[i].x, snake[i].y, snakeBox, snakeBox);
    ctx.strokeRect(snake[i].x, snake[i].y, snakeBox, snakeBox);
  }
  ctx.drawImage(apple, food.x, food.y, snakeBox, snakeBox);

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (dir == "LEFT") snakeX -= snakeBox;
  if (dir == "RIGHT") snakeX += snakeBox;
  if (dir == "UP") snakeY -= snakeBox;
  if (dir == "DOWN") snakeY += snakeBox;

  //IF SNAKE EAT FOOD
  if (snakeX == food.x && snakeY == food.y) {
    score++;
    eat.play();
    getFood();
  } else {
    snake.pop();
  }
  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  if (snakeX < 0 || snakeX >= canvasSize || snakeY < 0 || snakeY >= canvasSize || collisionDetection(newHead, snake)) {
    gameOver();
    return;
  }
  snake.unshift(newHead);
  ctx.fillStyle = "black";
  ctx.font = "40px tahoma";
  ctx.fillText(score, 10, 40);
}
render();
var gm = setInterval(render, 100);

// Game Over Function
function gameOver() {
  clearInterval(gm);
  dead.play();
  ctx.fillStyle = "red";
  ctx.font = `${canvasSize * 0.1}px thahoma`;
  ctx.fillText("Game Over", canvasSize * 0.25, canvasSize * 0.4);
  ctx.fillText(score, canvasSize * 0.5, canvasSize * 0.55);
}

const restartButton = document.getElementById("restartButton");

// Function to update high score
const highScoreElement = document.getElementById("hscore");

function updateHighScore() {
  if (score > parseInt(highScoreElement.textContent)) {
    highScoreElement.textContent = score;
  }
}
setInterval(updateHighScore, 100);

// Function to reset the game
function restartGame() {
  clearInterval(gm);
  snake = [{ x: 9 * snakeBox, y: 10 * snakeBox }];
  dir = "";
  score = 0;
  getFood();
  gm = setInterval(render, 100);
}

//  click event to the restart button
restartButton.addEventListener("click", restartGame);

// Prevent the default scrolling behavior
document.addEventListener("keydown", function (event) {
  if (event.keyCode >= 37 && event.keyCode <= 40) {
    event.preventDefault(); 
  }
});
