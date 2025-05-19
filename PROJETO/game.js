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
let gravity = 0.35; // Gravidade
let velocity = 0; // Velocidade do Mario
const chaoAltura = 90; // Altura do chão verde, onde Mario e canos ficam

// Mario
let mario = {
  x: 50,
  y: canvas.height - 70, // Posição do Mario
  width: 48,
  height: 48,
  jumping: false // Estado de pulo
};

// Variáveis de controle do jogo
let canos = []; // Armazena os canos
let frame = 0; // Contador de frames
let score = 0; // Pontuação atual
let maxScore = localStorage.getItem("maxScore") || 0; // Recorde salvo
let gameSpeed = 1.8; // Velocidade do jogo
let gameRunning = false; // Status do jogo
let animationFrameId = null; // ID do frame da animação

// Função para resetar o jogo
function resetGame() {
  mario.y = canvas.height - mario.height - chaoAltura; // Reinicia a posição do Mario
  velocity = 0; // Reinicia a velocidade
  pipes = []; // Limpa os canos
  frame = 0; // Reseta o contador de frames
  score = 0; // Resetar a pontuação
  gameSpeed = 1.8; // Velocidade inicial do jogo
  gameRunning = true; // Iniciar o jogo
  startBtn.disabled = true; // Desabilita o botão de início
  resetBtn.style.display = "none"; // Esconde o botão de reset

  cancelAnimationFrame(animationFrameId); // Cancela a animação anterior
  animate(); // Inicia o loop de animação
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
  const pipeHeight = 30 + Math.random() * 40; // Altura aleatória do cano
  const pipe = {
    x: canvas.width, // Inicia fora da tela à direita
    y: canvas.height - pipeHeight - chaoAltura, // Posição vertical do cano
    width: 24, // Largura do cano
    height: pipeHeight, // Altura do cano
    passed: false // Flag para ver se o Mario já passou do cano
  };
  pipes.push(pipe); // Adiciona o cano à lista de canos
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
  if (!gameRunning) return; // Se o jogo não estiver rodando, não faz nada

  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas a cada frame
  drawBackground(); // Desenha o fundo
  frame++; // Incrementa o contador de frames

  if (frame % 180 === 0) spawnPipe(); // Gera um novo cano a cada 180 frames

  velocity += gravity; // Aplica a gravidade ao Mario
  mario.y += velocity; // Atualiza a posição vertical do Mario

  // Se o Mario atingir o chão, ele para de cair
  if (mario.y + mario.height > canvas.height - chaoAltura) {
    mario.y = canvas.height - mario.height - chaoAltura;
    velocity = 0; // Reinicia a velocidade
    mario.jumping = false; // O Mario não está mais pulando
  }

  // Atualiza a posição dos canos e verifica a pontuação
  pipes.forEach(pipe => {
    pipe.x -= gameSpeed; // Movimento dos canos para a esquerda

    if (!pipe.passed && pipe.x + pipe.width < mario.x) {
      score++; // Incrementa a pontuação
      pipe.passed = true; // Marca que o Mario passou pelo cano
    }
  });

  // Remove canos que saíram da tela
  pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);

  // Verifica se houve colisão
  for (let pipe of pipes) {
    if (detectCollision(mario, pipe)) {
      gameRunning = false; // Se houver colisão, o jogo para
      cancelAnimationFrame(animationFrameId); // Cancela a animação

      if (score > maxScore) {
        maxScore = score; // Atualiza o recorde
        localStorage.setItem("maxScore", maxScore); // Salva o recorde
      }

      resetBtn.style.display = "inline"; // Exibe o botão de reset
      return;
    }
  }

  // Aumenta a velocidade do jogo a cada 300 frames
  if (frame % 300 === 0) gameSpeed += 0.2;

  drawMario(); // Desenha o Mario
  drawPipes(); // Desenha os canos

  // Exibe a pontuação e o recorde
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Pontuação: " + score, 10, 25);
  ctx.fillText("Recorde: " + maxScore, 10, 50);

  animationFrameId = requestAnimationFrame(animate); // Chama o próximo frame de animação
}

// Evento de tecla pressionada (espaço para pular)
document.addEventListener("keydown", e => {
  if (e.code === "Space" && !mario.jumping && gameRunning) {
    velocity = -13; // Dá um impulso para o Mario pular
    mario.jumping = true; // Marca que o Mario está pulando
  }
});

// Evento para iniciar o jogo ao clicar no botão "Iniciar"
startBtn.addEventListener("click", () => {
  if (!gameRunning) {
    resetGame(); // Reinicia o jogo
  }
});

// Evento para resetar o jogo ao clicar no botão "Resetar"
resetBtn.addEventListener("click", () => {
  resetGame(); // Reinicia o jogo
});


