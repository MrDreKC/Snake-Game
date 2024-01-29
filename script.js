const canvasBackgroundColor = "white";
const canvasBorderColor = "black";
const snakeColor = "red";
const snakeBorderColor = "black";
const foodColor = "green";
const foodBorderColor = "black"

let snake = [
  {x:300, y:300}, 
  {x:290, y:300}, 
  {x:280, y:300}, 
  {x:270, y:300}, 
  {x:260, y:300} 
]

let score = 0;
let changingDirection = false;
let dx = 10;
let dy = 0;
let foodX;
let foodY;

const gameCanvas = document.getElementById("gameCanvas");
const ctx = gameCanvas.getContext("2d");


main();

createFood();

document.addEventListener("keydown", changeDirection);

function main() {
  if(didGameEnd()) {
    return;
  }
  changingDirection = false;
  setTimeout(function onTick() {
    clearCanvas();
    drawFood();
    advanceSnake();
    drawSnake();
    main();
  }, 100)
}

function clearCanvas() {
  ctx.fillStyle = canvasBackgroundColor;
  ctx.strokeStyle = canvasBorderColor;
  ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
  ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}

function drawSnake() {
  snake.forEach(drawSnakePart);
}

function drawFood() {
  ctx.fillStyle = foodColor;
  ctx.strokeStyle = foodBorderColor;
  ctx.fillRect(foodX, foodY, 10, 10);
  ctx.strokeRect(foodX, foodY, 10, 10);
}

function drawSnakePart(snakePart) {
  ctx.fillStyle = snakeColor;
  ctx.strokeStyle = snakeBorderColor;
  ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
  ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function didGameEnd() {
  for(let i = 4; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true
    } 
  }       
  const hitTopWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > gameCanvas.height -10;
  const hitRightWall = snake[0].x > gameCanvas.width -10;
  const hitLeftWall = snake[0].x < 0;
  return hitTopWall || hitBottomWall || hitRightWall || hitLeftWall
}

function randomFood(min, max) {
  return Math.round((Math.random() * (max-min) + min) / 10) * 10;
}

function createFood() {
  foodX = randomFood(0, gameCanvas.width - 10);
  foodY = randomFood(0, gameCanvas.height - 10);
  snake.forEach(function isFoodOnSnake(part) {
    const foodIsOnSnake = part.x == foodX && part.y == foodY;
    if(foodIsOnSnake) { 
      createFood();
    }
  });
}

function changeDirection(event) {
  const upKey = 38;
  const downKey = 40;
  const leftKey = 37;
  const rightKey = 39;

  if (changingDirection) {
    return;
  }
  changingDirection = true;
  const keyPressed = event.keyCode;
  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;

  if (keyPressed === upKey && !goingDown) {
    dx = 0;
    dy = -10;
  }
  if (keyPressed === downKey && !goingUp) {
    dx = 0;
    dy = 10;
  }
  if (keyPressed === rightKey && !goingLeft) {
    dx = 10;
    dy = 0;
  }
  if (keyPressed === leftKey && !goingRight) {
    dx = -10;
    dy = 0;
  }
}

function advanceSnake() {
  const head = {x: snake[0].x + dx, y: snake[0].y + dy};
  snake.unshift(head);
  const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
  if(didEatFood) {
    score += 10;
    document.getElementById("score").innerHTML = score;
    createFood();
  } else {
    snake.pop();
  }
}
