const canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');
const ballSpeedSelect = document.getElementById('ball-speed');
const paddleSpeedSelect = document.getElementById('paddle-speed');
const playButton = document.getElementById('play');
const colorSelect = document.getElementById('color');

canvas.width = window.innerWidth - 52;
canvas.height = window.innerHeight - 60;

let speed = ballSpeedSelect.value;
let paddleSpeed = Number(paddleSpeedSelect.value);
const paddleHeight = 10;
const paddleWidth = 75;
const ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = speed;
let dy = -speed;
let paddleX = (canvas.width - paddleWidth) / 2;
let paddleX2 = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
let score1 = 0;
let score2 = 0;

var randomColor = () => `#${Math.floor(Math.random()*16777215).toString(16)}`;
let fillColor = (colorSelect.value === 'random') ? randomColor() : colorSelect.value;

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = fillColor;
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = '#0095dd';
  ctx.fill();
  ctx.closePath();
}

function drawPaddle2() {
  ctx.beginPath();
  ctx.rect(paddleX2, 0, paddleWidth, paddleHeight);
  ctx.fillStyle = '#0095dd';
  ctx.fill();
  ctx.closePath();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawPaddle2();
  drawScore();
  drawScore2();

  if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
    dx = -dx;
    fillColor = randomColor();
  }
  
  if (y + dy < ballRadius + paddleHeight) {
    if ((x > paddleX2) && (x < (paddleX2 + paddleWidth))) {
      dy = -dy;
      fillColor = randomColor();
    } else {
      score2 += 1;
      x = Number(canvas.width / 2);
      y = Number(canvas.height - 30);
      dx = Number(speed);
      dy = Number(-speed);
      paddleX = (canvas.width - paddleWidth) / 2;
    }
  } else if (y + dy > canvas.height - ballRadius - paddleHeight) {
    if ((x > paddleX) && (x < (paddleX + paddleWidth))) {
      dy = -dy;
      fillColor = randomColor();
    } else {
      score1 += 1;
      x = Number(canvas.width / 2);
      y = Number(canvas.height - 30);
      dx = Number(speed);
      dy = Number(-speed);
      paddleX = (canvas.width - paddleWidth) / 2;
    }
  }

  if (rightPressed) {
    paddleX += paddleSpeed;
    if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
    console.log(paddleSpeed)
  } else if (leftPressed) {
    paddleX -= paddleSpeed;
    if (paddleX < 0) {
      paddleX = 0;
    }
    console.log(paddleSpeed)
  }
  
  x += dx;
  y += dy;

  requestAnimationFrame(draw);
}

playButton.addEventListener('click', (e) => {
  ctx = null;
  ctx = canvas.getContext('2d');
  draw();
});

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);
window.addEventListener('resize', resize, false);

function mouseMoveHandler(e) {
  let relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX2 = relativeX - paddleWidth / 2;
    if (paddleX2 + paddleWidth > canvas.width) {
      paddleX2 = canvas.width - paddleWidth;
    }
    if (paddleX2 < 0) {
      paddleX2 = 0;
    }
  }
}

function keyDownHandler (e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true;
  }
}

function keyUpHandler (e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false;
  }
}

function resize () {
  canvas.width = window.innerWidth - 6;
  canvas.height = window.innerHeight - 6;
} 

function drawScore() {
  ctx.font = '20px Arial';
  ctx.fillStyle = fillColor;
  ctx.fillText('mouse: ' + score1, 8, 26);
}

function drawScore2() {
  ctx.font = '20px Arial';
  ctx.fillStyle = fillColor;
  ctx.fillText('keybord: ' + score2, 8, canvas.height - 16);
}

ballSpeedSelect.addEventListener('change', (e) => {
  e.preventDefault();
  speed = ballSpeedSelect.value;
  dx = speed;
  dy = -speed;
});

paddleSpeedSelect.addEventListener('change', (e) => {
  e.preventDefault();
  paddleSpeed = Number(paddleSpeedSelect.value);
});

colorSelect.addEventListener('change', (e) => {
  e.preventDefault();
  fillColor = (colorSelect.value === 'random') ? randomColor() : colorSelect.value;
});
