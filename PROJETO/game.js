// Seletores
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Variáveis do jogo
let mario, pipes, coins, score, gravity, velocity, gameLoop, isGameRunning = false;
const pipeGap = 150;
let speed = 2;

// Carregar imagens
const bgImg = new Image();
bgImg.src = "img/fundo.jpeg"; // ou o nome correto da imagem de fundo

const marioImg = new Image();
marioImg.src = "img/mario.gif";

const pipeImg = new Image();
pipeImg.src = "img/pipe.png";

const coinImg = new Image();
coinImg.src = "img/moeda.png";

const gameOverImg = new Image();
gameOverImg.src = "img/game-over.png";

// Espera imagens carregarem
let imagesLoaded = 0;
const totalImages = 5;

[marioImg, pipeImg, coinImg, gameOverImg, bgImg].forEach(img => {
  img.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
      document.getElementById("startBtn").addEventListener("click", startGame);
    }
  };
});

function startGame() {
  // Inicializa variáveis
  mario = {
    x: 80,
    y: canvas.height / 2,
    width: 40,
    height: 40,
    vy: 0
  };

  pipes = [];
  coins = [];
  score = 0;
  gravity = 0.5;
  velocity = 0;
  speed = 2;
  isGameRunning = true;

  spawnPipe();

  document.addEventListener("keydown", jump);
  gameLoop = requestAnimationFrame(update);
}

function jump(e) {
  if (e.code === "Space") {
    mario.vy = -8;
  }
}

function spawnPipe() {
  const gapY = Math.floor(Math.random() * (canvas.height - pipeGap - 100)) + 50;

  pipes.push({
    x: canvas.width,
    top: gapY,
    bottom: gapY + pipeGap
  });

  coins.push({
    x: canvas.width + 20,
    y: gapY + pipeGap / 2 - 10,
    collected: false
  });

  setTimeout(spawnPipe, 2000); // Novo obstáculo a cada 2 segundos
}

function update() {
  if (!isGameRunning) return;

  // Atualizar física
  mario.vy += gravity;
  mario.y += mario.vy;

  // Limite do chão e topo
  if (mario.y + mario.height > canvas.height) {
    endGame();
  }

  // Limpar tela
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

  // Mario
  ctx.drawImage(marioImg, mario.x, mario.y, mario.width, mario.height);

  // Canos
  pipes.forEach(pipe => {
    pipe.x -= speed;

    // Topo
    ctx.drawImage(pipeImg, pipe.x, 0, 50, pipe.top);
    // Base
    ctx.drawImage(pipeImg, pipe.x, pipe.bottom, 50, canvas.height - pipe.bottom);

    // Colisão com Mario
    if (
      mario.x < pipe.x + 50 &&
      mario.x + mario.width > pipe.x &&
      (mario.y < pipe.top || mario.y + mario.height > pipe.bottom)
    ) {
      endGame();
    }
  });

  // Moedas
  coins.forEach(coin => {
    coin.x -= speed;

    if (!coin.collected) {
      ctx.drawImage(coinImg, coin.x, coin.y, 20, 20);
      if (
        mario.x < coin.x + 20 &&
        mario.x + mario.width > coin.x &&
        mario.y < coin.y + 20 &&
        mario.y + mario.height > coin.y
      ) {
        coin.collected = true;
        score++;
        if (score % 5 === 0) speed += 0.5; // aumenta a velocidade a cada 5 pontos
      }
    }
  });

  // Pontuação
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Pontos: " + score, 10, 30);

  // Próximo frame
  gameLoop = requestAnimationFrame(update);
}

function endGame() {
  isGameRunning = false;
  cancelAnimationFrame(gameLoop);
  ctx.drawImage(gameOverImg, canvas.width / 2 - 150, canvas.height / 2 - 50, 300, 100);
}
