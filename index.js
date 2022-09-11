const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d"); // 2D rendering context
let interval = setInterval(draw, 30);
// 공
let x = canvas.width / 2; // x좌표
let y = canvas.height - 30; // y좌표
let dx = 6;
let dy = -6;
let ballRadius = 10; // 공 반지름
// 패들
const paddileHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2; // 초기값은 패들 시작 위치
// 버튼 감지
let rightPressed = false;
let leftPressed = false;
// 벽돌
let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
const bricks = [];
// 점수
let score = 0;

for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
// document.addEventListener("mousemove", mouseMoveUpHandler);

function keyDownHandler(e) {
  if (e.keyCode === 39) {
    rightPressed = true;
  } else if (e.keyCode === 37) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode === 39) {
    rightPressed = false;
  } else if (e.keyCode === 37) {
    leftPressed = false;
  }
}

function mouseMoveUpHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

// draw되야 할 함수들
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        // 공의 x는 벽돌의 x보다 크다 && 공의 x는 벽돌의 x + 가로 길이보다 작다 &&
        // 공의 y는 벽돌의 y보다 크다 && 공의 y는 벽돌의 y + 세로 길이보다 작다
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score++;
          if (score === brickRowCount * brickColumnCount) {
            alert("승리!");
            document.location.reload();
            clearInterval(interval);
          }
        }
      }
    }
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "green";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddileHeight, paddleWidth, paddileHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`Score: ${score}`, 8, 20);
}

function drawLives() {
  // ctx.font = "16px Arial";
  // ctx.fillStyle = "#0095DD";
  // ctx.fillText(`Score: ${score}`, 8, 20);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // 캔버스 내의 프레임 삭제
  drawBall();
  drawPaddle();
  drawBricks();
  collisionDetection();
  drawScore();

  // 충돌감지해서 음수로 전환해서 역으로 좌표 전환
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    // 현재 x좌표가 캔버스 가로영역 안에 존재
    dx = -dx;
  }

  if (y + dy < ballRadius) {
    // 공이 천장에 닿은 경우
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    // 공이 바닥에 닿은 경우
    if (x > paddleX && x < paddleX + paddleWidth) {
      // 공이 패들에 먼저 닿은 경우
      dy = -dy;
    } else {
      alert("게임오버");
      document.location.reload();
      clearInterval(interval);
    }
  }
  // 패들 이동
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  x += dx;
  y += dy;
}
