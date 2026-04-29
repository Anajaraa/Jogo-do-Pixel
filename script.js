const gameArea = document.getElementById('game-area');
const roundEl = document.getElementById('round');
const scoreEl = document.getElementById('score');
const startBtn = document.getElementById('startBtn');
const pixel = document.getElementById('pixel');
const proximityFill = document.getElementById('proximity-fill');
const proximityValue = document.getElementById('proximity-value');
const playerNameInput = document.getElementById('playerName');
const playerRankEl = document.getElementById('playerRank');
const introScreen = document.getElementById('intro-screen');
const resultModal = document.getElementById('result-modal');
const resultMessage = document.getElementById('result-message');
const finalScoreEl = document.getElementById('final-score');
const finalRankEl = document.getElementById('final-rank');
const closeModalBtn = document.getElementById('close-modal');

let targetX;
let targetY;
let score = 0;
let round = 1;
let totalRounds = 10;
let gameActive = false;

// Carregar dados do LocalStorage
window.addEventListener('load', () => {
  const savedName = localStorage.getItem('pixelGame_playerName');
  const savedScore = localStorage.getItem('pixelGame_highscore');
  
  if (savedName) {
    playerNameInput.value = savedName;
  }
  
  if (savedScore) {
    updateRank(parseInt(savedScore));
  }
  
  // Garantir que o modal esteja escondido ao carregar
  resultModal.classList.remove('show');
});

// Salvar nome ao mudar
playerNameInput.addEventListener('change', () => {
  localStorage.setItem('pixelGame_playerName', playerNameInput.value);
});

// Sistema de Ranking
function updateRank(currentScore) {
  let rank = "Bronze";
  let rankClass = "rank-bronze";

  if (currentScore >= 8000) {
    rank = "Mestre";
    rankClass = "rank-mestre";
  } else if (currentScore >= 6000) {
    rank = "Diamante";
    rankClass = "rank-diamante";
  } else if (currentScore >= 4000) {
    rank = "Platina";
    rankClass = "rank-platina";
  } else if (currentScore >= 2000) {
    rank = "Ouro";
    rankClass = "rank-ouro";
  } else if (currentScore >= 1000) {
    rank = "Prata";
    rankClass = "rank-prata";
  }

  playerRankEl.textContent = rank;
  playerRankEl.className = rankClass;
}

// Gerar posição aleatória
function generateRandomPosition() {
  const pixelSize = 8;
  targetX = Math.floor(Math.random() * (gameArea.clientWidth - pixelSize));
  targetY = Math.floor(Math.random() * (gameArea.clientHeight - pixelSize));
}

// Fluxo do pixel
function shufflePixels() {
  pixel.style.display = "block";
  proximityFill.style.width = "0%";
  proximityValue.textContent = "0%";

  let interval = setInterval(() => {
    movePixelRandomly();
  }, 100);

  setTimeout(() => {
    clearInterval(interval);
    generateRandomPosition();
    placePixel(targetX, targetY);
    hidePixelAfterMoment();
    gameActive = true;
  }, 3000);
}

// Movimento do pixel
function movePixelRandomly() {
  const pixelSize = 8;
  const x = Math.random() * (gameArea.clientWidth - pixelSize);
  const y = Math.random() * (gameArea.clientHeight - pixelSize);
  placePixel(x, y);
}

// Posicionamento do pixel
function placePixel(x, y) {
  pixel.style.left = `${x}px`;
  pixel.style.top = `${y}px`;
}

// Esconder pixel
function hidePixelAfterMoment() {
  setTimeout(() => {
    pixel.style.display = 'none';
  }, 1000);
}

// Clique do jogador
gameArea.addEventListener('click', function (e) {
  if (!gameActive) return;

  const clickX = e.offsetX;
  const clickY = e.offsetY;

  calculateScore(clickX, clickY);
});

// Calcular pontuação e proximidade
function calculateScore(clickX, clickY) {
  const maxDistance = Math.sqrt(gameArea.clientWidth ** 2 + gameArea.clientHeight ** 2);
  const distance = Math.sqrt(
    (clickX - targetX) ** 2 +
    (clickY - targetY) ** 2
  );

  // Porcentagem de proximidade
  let proximityPercent = Math.max(0, 100 - (distance / (maxDistance * 0.2)) * 100);
  proximityPercent = Math.round(proximityPercent);
  
  proximityFill.style.width = `${proximityPercent}%`;
  proximityValue.textContent = `${proximityPercent}%`;

  let points = Math.max(0, 1000 - distance * 10);
  score += Math.floor(points);
  scoreEl.textContent = score;

  updateRank(score);
  nextRound();
}

// Próxima rodada
function nextRound() {
  gameActive = false;
  round++;

  if (round > totalRounds) {
    setTimeout(endGame, 500);
    return;
  }

  roundEl.textContent = round;

  setTimeout(() => {
    resetRound();
  }, 1500);
}

// Reset rodada
function resetRound() {
  pixel.style.display = "block";
  shufflePixels();
}

// Fim do jogo
function endGame() {
  const highscore = localStorage.getItem("pixelGame_highscore") || 0;
  const playerName = playerNameInput.value || "Jogador";
  const rank = playerRankEl.textContent;
  const rankClass = playerRankEl.className;

  if (score > highscore) {
    localStorage.setItem("pixelGame_highscore", score);
    resultMessage.innerHTML = `Incrível, <strong>${playerName}</strong>!<br>Você bateu seu recorde pessoal!`;
  } else {
    resultMessage.innerHTML = `Muito bem, <strong>${playerName}</strong>!<br>Você completou o desafio de outono.`;
  }

  finalScoreEl.textContent = score;
  finalRankEl.textContent = rank;
  finalRankEl.className = rankClass;
  
  // Mostrar modal APENAS aqui
  resultModal.classList.add('show');
  gameActive = false;
  startBtn.textContent = "Jogar Novamente";
}

// Fechar modal e resetar para novo jogo
closeModalBtn.addEventListener('click', () => {
  resultModal.classList.remove('show');
});

// Iniciar jogo
startBtn.addEventListener("click", () => {
  // Garantir que o modal esteja fechado ao reiniciar
  resultModal.classList.remove('show');
  
  score = 0;
  round = 1;

  scoreEl.textContent = score;
  roundEl.textContent = round;
  startBtn.textContent = "Reiniciar";
  
  // Esconder a tela de introdução
  introScreen.style.opacity = '0';
  setTimeout(() => {
    introScreen.style.display = 'none';
  }, 500);
  
  updateRank(0);
  shufflePixels();
});
