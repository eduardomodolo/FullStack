// Setup do Canvas e Contexto
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");

// Carregamento das imagens do jogo
const imgMario = new Image();
const imgCano = new Image();
const imgFundo = new Image();

imgMario.src = "imagens/mario.png";
imgCano.src = "imagens/cano.png";
imgFundo.src = "imagens/fundo.png";

// Variáveis do jogo
let gravity = 0.35; 
let velocity = 0; 
const chaoAltura = 90; 

// Objeto do Mario
let mario = {
  x: 50,
  y: canvas.height - 70, 
  width: 48,
  height: 48,
  jumping: false 
};

// Variáveis de controle do jogo
let pipes = []; 
let frame = 0; 
let score = 0; 
let maxScore = localStorage.getItem("maxScore") || 0; o
let gameSpeed = 1.8;
let gameRunning = false; 
let animationFrameId = null; 

// Função para resetar o jogo
function resetGame() {
  mario.y = canvas.height - mario.height - chaoAltura; o
  velocity = 0; 
  pipes = []; 
  frame = 0; 
  score = 0;
  gameSpeed = 1.8;
  gameRunning = true; 
  startBtn.disabled = true; 
  resetBtn.style.display = "none"; 

  cancelAnimationFrame(animationFrameId); 
  animate(); 
}

// Função para desenhar o fundo
function drawBackground() {
  ctx.drawImage(imgFundo, 0, 0, canvas.width, canvas.height);
}

// Função para desenhar o Mario
function drawMario() {
  ctx.drawImage(imgMario, mario.x, mario.y, mario.width, mario.height);
}

// Função para desenhar os canos
function drawPipes() {
  pipes.forEach(pipe => {
    ctx.drawImage(imgCano, pipe.x, pipe.y, pipe.width, pipe.height);
  });
}

// Função para gerar novos canos
function spawnPipe() {
  const pipeHeight = 30 + Math.random() * 40; 
  const pipe = {
    x: canvas.width, 
    y: canvas.height - pipeHeight - chaoAltura,
    width: 24,
    height: pipeHeight, 
    passed: false 
  };
  pipes.push(pipe);  
}

// Função para detectar colisões
function detectCollision(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

// Função de animação que é chamada a cada frame
function animate() {
  if (!gameRunning) return; 

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground(); 
  frame++; 

  if (frame % 120 === 0) spawnPipe(); 

  velocity += gravity;
  mario.y += velocity; 

  // Se o Mario atingir o chão, ele para de cair
  if (mario.y + mario.height > canvas.height - chaoAltura) {
    mario.y = canvas.height - mario.height - chaoAltura;
    velocity = 0; 
    mario.jumping = false; 
  }

  // Atualiza a posição dos canos e verifica a pontuação
  pipes.forEach(pipe => {
    pipe.x -= gameSpeed;
    if (!pipe.passed && pipe.x + pipe.width < mario.x) {
      score++; 
      pipe.passed = true; 
    }
  });

  // Remove canos que saíram da tela
  pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);

  // Verifica se houve colisão
  for (let pipe of pipes) {
    if (detectCollision(mario, pipe)) {
      gameRunning = false; a
      cancelAnimationFrame(animationFrameId);

      if (score > maxScore) {
        maxScore = score; 
        localStorage.setItem("maxScore", maxScore); e
      }

      resetBtn.style.display = "inline";
      return;
    }
  }

  // Aumenta a velocidade do jogo a cada 300 frames
  if (frame % 300 === 0) gameSpeed += 0.2;

  drawMario(); 
  drawPipes(); 

  // Exibe a pontuação e o recorde
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Pontuação: " + score, 10, 25);
  ctx.fillText("Recorde: " + maxScore, 10, 50);

  animationFrameId = requestAnimationFrame(animate);
}

// Evento de tecla pressionada (espaço para pular)
document.addEventListener("keydown", e => {
  if (e.code === "Space" && !mario.jumping && gameRunning) {
    velocity = -11; 
    mario.jumping = true; 
  }
});

// Evento para iniciar o jogo ao clicar no botão "Iniciar"
startBtn.addEventListener("click", () => {
  if (!gameRunning) {
    resetGame(); 
  }
});

// Evento para resetar o jogo ao clicar no botão "Resetar"
resetBtn.addEventListener("click", () => {
  resetGame(); 
});


    