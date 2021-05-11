const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const speedSelect = document.getElementById('speed');
const playButton = document.getElementById('play');
const colorSelect = document.getElementById('color');

let speed = speedSelect.value;
let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
let x = canvas.width / 2;
let y = canvas.height - 30;
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
const ballRadius = 10;
let score = 0;
let lives = 3;
let dx = speed;
let dy = -speed;

const randomColor = () => `#${Math.floor(Math.random()*16777215).toString(16)}`;
let fillColor = (colorSelect.value === 'random') ? randomColor() : colorSelect.value;

const bricks = [];
for (let c = 0; c < brickColumnCount; c += 1) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r += 1) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      if (bricks[c][r].status === 1) {
        const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
        const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = '#0095dd';
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

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

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
    dx = -dx;
  }
  
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius - paddleHeight) {
    if ((x > paddleX) && (x < (paddleX + paddleWidth))) {
      dy = -dy;
    } else {
      lives -= 1;
      if (!lives) {
        alert('GAME OVER');
        document.location.reload();
      } else {
        x = Number(canvas.width / 2);
        y = Number(canvas.height - 30);
        dx = Number(speed);
        dy = Number(-speed);
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }
  
  if (rightPressed) {
    paddleX += 5;
    if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
  } else if (leftPressed) {
    paddleX -= 5;
    if (paddleX < 0) {
      paddleX = 0;
    }
  }
  
  x += dx;
  y += dy;

  requestAnimationFrame(draw);
}

playButton.addEventListener('click', (e) => {
  draw();
});

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

function mouseMoveHandler(e) {
  let relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
    if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
    if (paddleX < 0) {
      paddleX = 0;
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

function collisionDetection () {
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      let b = bricks[c][r];
      if (b.status === 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          score += 1;
          if (score === brickRowCount * brickColumnCount) {
            alert('ПОЗДРАВЛЯЕМ, ЧЕМПИОН!!! ТЫ ПОБЕДИЛ!!!');
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = '20px Arial';
  ctx.fillStyle = fillColor;
  ctx.fillText('Score: ' + score, 8, 20);
}

function drawLives() {
  ctx.font = '20px Arial';
  ctx.fillStyle = fillColor;
  ctx.fillText('Lives: ' + lives, canvas.width - 75, 20);
}

speedSelect.addEventListener('change', (e) => {
  e.preventDefault();
  speed = speedSelect.value;
  dx = speed;
  dy = -speed;
});

colorSelect.addEventListener('change', (e) => {
  e.preventDefault();
  fillColor = (colorSelect.value === 'random') ? randomColor() : colorSelect.value;
});
