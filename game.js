const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.querySelector("#score");
const bestScoreEl = document.querySelector("#bestScore");
const overlay = document.querySelector("#overlay");
const overlayTitle = document.querySelector("#overlayTitle");
const overlayHint = document.querySelector("#overlayHint");
const startButton = document.querySelector("#startButton");
const restartButton = document.querySelector("#restartButton");
const speedSlider = document.querySelector("#speedSlider");
const speedLabel = document.querySelector("#speedLabel");
const statusEl = document.querySelector("#gameStatus");
const foodCountEl = document.querySelector("#foodCount");
const padButtons = document.querySelectorAll("[data-direction]");

const gridSize = 24;
const tileSize = canvas.width / gridSize;
const bestKey = "snake-best-score";
const directions = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

let snake;
let food;
let direction;
let nextDirection;
let score;
let foodEaten;
let bestScore;
let isRunning;
let isGameOver;
let lastFrameTime;
let moveDelay;
let animationId;

function readBestScore() {
  const saved = Number(localStorage.getItem(bestKey));
  return Number.isFinite(saved) ? saved : 0;
}

function resetGame() {
  snake = [
    { x: 11, y: 12 },
    { x: 10, y: 12 },
    { x: 9, y: 12 },
  ];
  direction = directions.right;
  nextDirection = directions.right;
  score = 0;
  foodEaten = 0;
  isRunning = false;
  isGameOver = false;
  lastFrameTime = 0;
  updateSpeed();
  placeFood();
  updateHud();
  setOverlay("\u51c6\u5907\u5f00\u59cb", "\u6309\u7a7a\u683c\u6216\u70b9\u51fb\u5f00\u59cb", true);
  startButton.querySelector("span").textContent = ">";
  draw();
}

function updateSpeed() {
  const speed = Number(speedSlider.value);
  speedLabel.textContent = String(speed);
  moveDelay = 280 - speed * 30;
}

function updateHud() {
  scoreEl.textContent = String(score);
  bestScoreEl.textContent = String(bestScore);
  foodCountEl.textContent = `\u98df\u7269 ${foodEaten}`;

  if (isGameOver) {
    statusEl.textContent = "\u7ed3\u675f";
  } else if (isRunning) {
    statusEl.textContent = "\u8fdb\u884c\u4e2d";
  } else {
    statusEl.textContent = score > 0 ? "\u6682\u505c" : "\u5f85\u673a";
  }
}

function setOverlay(title, hint, visible) {
  overlayTitle.textContent = title;
  overlayHint.textContent = hint;
  overlay.classList.toggle("hidden", !visible);
}

function startGame() {
  if (isGameOver) {
    resetGame();
  }

  isRunning = true;
  setOverlay("", "", false);
  startButton.querySelector("span").textContent = "II";
  updateHud();
  cancelAnimationFrame(animationId);
  animationId = requestAnimationFrame(loop);
}

function pauseGame() {
  isRunning = false;
  setOverlay("\u5df2\u6682\u505c", "\u6309\u7a7a\u683c\u7ee7\u7eed", true);
  startButton.querySelector("span").textContent = ">";
  updateHud();
}

function toggleRunState() {
  if (isRunning) {
    pauseGame();
  } else {
    startGame();
  }
}

function loop(timestamp) {
  if (!isRunning) {
    return;
  }

  if (timestamp - lastFrameTime >= moveDelay) {
    step();
    lastFrameTime = timestamp;
  }

  draw();
  animationId = requestAnimationFrame(loop);
}

function step() {
  direction = nextDirection;
  const head = snake[0];
  const nextHead = {
    x: head.x + direction.x,
    y: head.y + direction.y,
  };

  if (hitWall(nextHead) || hitSnake(nextHead)) {
    endGame();
    return;
  }

  snake.unshift(nextHead);

  if (nextHead.x === food.x && nextHead.y === food.y) {
    score += 10;
    foodEaten += 1;
    if (score > bestScore) {
      bestScore = score;
      localStorage.setItem(bestKey, String(bestScore));
    }
    placeFood();
  } else {
    snake.pop();
  }

  updateHud();
}

function endGame() {
  isRunning = false;
  isGameOver = true;
  setOverlay("\u6e38\u620f\u7ed3\u675f", "\u70b9\u51fb\u91cd\u5f00\u6216\u6309\u7a7a\u683c", true);
  startButton.querySelector("span").textContent = ">";
  updateHud();
}

function hitWall(point) {
  return point.x < 0 || point.x >= gridSize || point.y < 0 || point.y >= gridSize;
}

function hitSnake(point) {
  return snake.some((part) => part.x === point.x && part.y === point.y);
}

function placeFood() {
  do {
    food = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    };
  } while (hitSnake(food));
}

function setDirection(name) {
  const requested = directions[name];
  if (!requested) {
    return;
  }

  const isOpposite =
    requested.x + direction.x === 0 && requested.y + direction.y === 0;

  if (!isOpposite) {
    nextDirection = requested;
  }
}

function draw() {
  drawBoard();
  drawFood();
  drawSnake();
}

function drawBoard() {
  const boardGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  boardGradient.addColorStop(0, "#101717");
  boardGradient.addColorStop(1, "#182222");
  ctx.fillStyle = boardGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(238, 245, 237, 0.045)";
  ctx.lineWidth = 1;
  for (let line = 1; line < gridSize; line += 1) {
    const position = line * tileSize;
    ctx.beginPath();
    ctx.moveTo(position, 0);
    ctx.lineTo(position, canvas.height);
    ctx.moveTo(0, position);
    ctx.lineTo(canvas.width, position);
    ctx.stroke();
  }
}

function drawSnake() {
  snake.forEach((part, index) => {
    const inset = index === 0 ? 2 : 4;
    const x = part.x * tileSize + inset;
    const y = part.y * tileSize + inset;
    const size = tileSize - inset * 2;
    const gradient = ctx.createLinearGradient(x, y, x + size, y + size);
    gradient.addColorStop(0, index === 0 ? "#b8ff6a" : "#6fe37d");
    gradient.addColorStop(1, index === 0 ? "#4fc3c7" : "#2bb46f");

    ctx.fillStyle = gradient;
    roundRect(x, y, size, size, index === 0 ? 7 : 5);
    ctx.fill();

    if (index === 0) {
      drawEyes(part);
    }
  });
}

function drawEyes(head) {
  const cx = head.x * tileSize;
  const cy = head.y * tileSize;
  const eyeOffset = tileSize * 0.22;
  const eyeRadius = 2.5;
  const positions = direction.x !== 0
    ? [
        { x: cx + tileSize * 0.55, y: cy + tileSize * 0.32 },
        { x: cx + tileSize * 0.55, y: cy + tileSize * 0.68 },
      ]
    : [
        { x: cx + tileSize * 0.32, y: cy + tileSize * 0.5 + direction.y * eyeOffset },
        { x: cx + tileSize * 0.68, y: cy + tileSize * 0.5 + direction.y * eyeOffset },
      ];

  if (direction.x < 0) {
    positions[0].x = cx + tileSize * 0.45;
    positions[1].x = cx + tileSize * 0.45;
  }

  ctx.fillStyle = "#092013";
  positions.forEach((eye) => {
    ctx.beginPath();
    ctx.arc(eye.x, eye.y, eyeRadius, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawFood() {
  const centerX = food.x * tileSize + tileSize / 2;
  const centerY = food.y * tileSize + tileSize / 2;
  const pulse = 1 + Math.sin(performance.now() / 140) * 0.08;
  const radius = tileSize * 0.32 * pulse;

  ctx.shadowColor = "rgba(242, 200, 75, 0.65)";
  ctx.shadowBlur = 18;
  ctx.fillStyle = "#f2c84b";
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = "#fff2a8";
  ctx.beginPath();
  ctx.arc(centerX - radius * 0.28, centerY - radius * 0.24, radius * 0.24, 0, Math.PI * 2);
  ctx.fill();
}

function roundRect(x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

document.addEventListener("keydown", (event) => {
  const keyMap = {
    ArrowUp: "up",
    w: "up",
    W: "up",
    ArrowDown: "down",
    s: "down",
    S: "down",
    ArrowLeft: "left",
    a: "left",
    A: "left",
    ArrowRight: "right",
    d: "right",
    D: "right",
  };

  if (event.code === "Space") {
    event.preventDefault();
    toggleRunState();
    return;
  }

  const mappedDirection = keyMap[event.key];
  if (mappedDirection) {
    event.preventDefault();
    setDirection(mappedDirection);
    if (!isRunning && !isGameOver) {
      startGame();
    }
  }
});

startButton.addEventListener("click", toggleRunState);
restartButton.addEventListener("click", resetGame);
speedSlider.addEventListener("input", () => {
  updateSpeed();
  updateHud();
});

padButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setDirection(button.dataset.direction);
    if (!isRunning && !isGameOver) {
      startGame();
    }
  });
});

bestScore = readBestScore();
resetGame();
