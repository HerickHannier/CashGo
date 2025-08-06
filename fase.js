// Lista de imagens de itens essenciais
const essentialItems = [
    'imagens/imgBolhas/esseciais/pao.jpg',
    'imagens/imgBolhas/esseciais/agua.jpeg',
    'imagens/imgBolhas/esseciais/casa.png',
    'imagens/imgBolhas/esseciais/roupa.jpg',
    'imagens/imgBolhas/esseciais/remedio.png',
    'imagens/imgBolhas/esseciais/fruta.jpg',
    'imagens/imgBolhas/esseciais/leite.png',
    'imagens/imgBolhas/esseciais/cama.png',
];

// Lista de imagens de itens de desejo
const desireItems = [
    'imagens/imgBolhas/desejos/videogame.png',
    'imagens/imgBolhas/desejos/chocolate.png',
    'imagens/imgBolhas/desejos/carroDeLuxo.png',
    'imagens/imgBolhas/desejos/diamante.png',
    'imagens/imgBolhas/desejos/telefone.png',
    'imagens/imgBolhas/desejos/tenis.png',
    'imagens/imgBolhas/desejos/pizza.png',
    'imagens/imgBolhas/desejos/sorvete.png',
];

// Pontuação inicial
let score = {
    correct: 9,
    wrong: 0
};

// Elementos principais do jogo
let gameContainer = document.getElementById('gameContainer');
let toastContainer = document.getElementById('toastContainer');
let gameActive = false;
let gamePaused = false;
let bubbleCreationInterval;
let pauseButton = document.getElementById('pauseButton');

// Cache para elementos de pontuação
const scoreElements = {
    correct: null,
    wrong: null,
    penaltyWarning: null
};

// Inicializa elementos do DOM
function initializeElements() {
    scoreElements.correct = document.getElementById('correct');
    scoreElements.wrong = document.getElementById('wrong');
    scoreElements.penaltyWarning = document.getElementById('penaltyWarning');
    gameContainer = document.getElementById('gameContainer');
    toastContainer = document.getElementById('toastContainer');
    pauseButton = document.getElementById('pauseButton');
}

// Atualiza pontuação na tela
function updateScore() {
    if (!scoreElements.correct) initializeElements();

    scoreElements.correct.textContent = score.correct;
    scoreElements.wrong.textContent = score.wrong;

    // Exibe aviso de penalidade a cada 2 erros
    scoreElements.penaltyWarning.style.display = score.wrong % 2 === 1 ? 'block' : 'none';

    // Avança para o quiz 4 se atingir 10 acertos
    if (score.correct >= 10) showQuiz4();
}

// Inicia o jogo a partir das instruções
function startGameFromInstructions() {
    document.getElementById('instructionsScreen').classList.add('hidden');
    document.getElementById('vlibras').classList.add('hidden');
    document.getElementById('vitaImg').style.display = 'none';
    document.getElementById('vitaSpeech').style.display = 'none';
    gameContainer.classList.remove('hidden');
    toastContainer.classList.remove('hidden');

    gameActive = true;
    gamePaused = false;
    pauseButton.disabled = false;
    pauseButton.textContent = '⏸️ Pausar';

    startGame();
}

// Pausa e continua o jogo
function togglePause() {
    if (!gameActive) return;

    gamePaused = !gamePaused;
    const existingBubbles = gameContainer.querySelectorAll('.bubble');

    if (gamePaused) {
        clearTimeout(bubbleCreationInterval);
        existingBubbles.forEach(b => b.style.animationPlayState = 'paused');
        pauseButton.textContent = '▶️ Continuar';
        showToast('success', 'Jogo Pausado', 'Clique em "Continuar" para retomar', 2000);
    } else {
        existingBubbles.forEach(b => b.style.animationPlayState = 'running');
        pauseButton.textContent = '⏸️ Pausar';
        startGame();
        showToast('success', 'Jogo Retomado', 'Continue clicando nas bolhas!', 2000);
    }
}

// Sorteia um item aleatório
function getRandomItem(isEssential) {
    const items = isEssential ? essentialItems : desireItems;
    return items[Math.floor(Math.random() * items.length)];
}

// Exibe uma notificação toast
function showToast(type, title, message, duration = 3000) {
    const existingToasts = toastContainer.querySelectorAll('.toast');
    if (existingToasts.length >= 2) {
        const oldest = existingToasts[0];
        oldest.classList.remove('show');
        setTimeout(() => oldest.remove(), 400);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = '🎉';
    if (type === 'error') icon = '😅';
    if (type === 'penalty') icon = '⚠️';

    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
    `;

    toastContainer.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, duration);
}

// Cria uma bolha no jogo
function createBubble() {
    if (!gameActive || gamePaused) return;

    const bubble = document.createElement('div');
    bubble.className = 'bubble';

    const isEssential = Math.random() < 0.6;
    const imageSrc = getRandomItem(isEssential);

    bubble.classList.add(isEssential ? 'essential' : 'desire');
    bubble.dataset.essential = isEssential;

    const img = document.createElement('img');
    img.src = imageSrc;
    img.alt = isEssential ? 'Item essencial' : 'Item de desejo';
    img.tabIndex = -1;
    img.draggable = false;
    bubble.appendChild(img);

    const startX = Math.random() * (window.innerWidth - 90);
    bubble.style.left = startX + 'px';
    bubble.style.bottom = '-100px';

    const duration = Math.random() * 3 + 4;
    bubble.style.animation = `bubbleRise ${duration}s linear forwards`;

    bubble.addEventListener('click', handleBubbleClick, { once: true });
    gameContainer.appendChild(bubble);
}

// Quando usuário clica em uma bolha
function handleBubbleClick(event) {
    if (!gameActive || gamePaused) return;

    const bubble = event.currentTarget;
    if (bubble.classList.contains('clicked')) return;
    bubble.classList.add('clicked');

    const isEssential = bubble.dataset.essential === 'true';

    if (isEssential) {
        score.correct++;
        showToast('success', 'Acertou!', 'Isso é essencial para a vida!');
    } else {
        score.wrong++;
        if (score.wrong % 2 === 0 && score.correct > 0) {
            score.correct--;
            showToast('penalty', 'Penalidade!', `2 erros = -1 acerto! Agora você tem ${score.correct} acertos.`);
        } else {
            showToast('error', 'Tente novamente!', 'Isso é só um desejo!');
        }
    }

    updateScore();
    setTimeout(() => { if (bubble.parentNode) bubble.remove(); }, 500);
}

// Mostra instruções do quiz 4
function showQuiz4() {
    gameActive = false;
    gamePaused = false;
    clearTimeout(bubbleCreationInterval);

    const existingBubbles = gameContainer.querySelectorAll('.bubble');
    existingBubbles.forEach(b => b.remove());

    gameContainer.classList.add('hidden');
    toastContainer.classList.add('hidden');

    setTimeout(() => {
        const quiz4Instructions = document.getElementById('quiz4Instructions');
        if (quiz4Instructions) {
            quiz4Instructions.style.display = 'block';
            quiz4Instructions.classList.remove('hidden');
        }
    }, 500);
}

// Reinicia o jogo do começo
function restartGame() {
    score.correct = 0;
    score.wrong = 0;
    gameActive = false;
    gamePaused = false;

    const quiz4 = document.getElementById('quiz4');
    if (quiz4) {
        quiz4.style.display = 'none';
        quiz4.classList.remove('active');
    }

    gameContainer.classList.remove('hidden');
    toastContainer.classList.remove('hidden');
    toastContainer.innerHTML = '';

    pauseButton.disabled = true;
    pauseButton.textContent = '⏸️ Pausar';

    updateScore();
    document.getElementById('instructionsScreen').classList.remove('hidden');
}

// Inicia o jogo com bolhas automáticas
function startGame() {
    if (!gameActive || gamePaused) return;

    function scheduleBubble() {
        if (!gameActive || gamePaused) return;
        createBubble();
        const delay = Math.random() * 800 + 400;
        bubbleCreationInterval = setTimeout(scheduleBubble, delay);
    }

    scheduleBubble();
}

// Passa para próximo quiz
function proximo(proximoId) {
    const atual = document.querySelector('.quiz-item.active');
    if (atual) {
        atual.classList.remove('active');
        atual.style.display = 'none';
    }

    if (proximoId === "quiz5") {
        const instr = document.getElementById("quiz5Instructions");
        instr.style.display = "flex";
        instr.classList.remove("hidden");
    } else {
        const proximo = document.getElementById(proximoId);
        if (proximo) {
            proximo.style.display = 'block';
            proximo.classList.add('active');
        }
    }
}

// Inicia o quiz 4
function iniciarQuiz4() {
    document.getElementById("quiz4Instructions").classList.add("hidden");
    document.getElementById("quiz4").classList.add("active");
    document.getElementById("quiz4").style.display = "block";
}

// Inicia o quiz 5
function iniciarQuiz5() {
    document.getElementById("quiz5Instructions").classList.add("hidden");
    document.getElementById("quiz5").classList.add("active");
    document.getElementById("quiz5").style.display = "block";
}

// Mostra resposta da missão
function aceitarMissao(topou) {
    const resposta = document.getElementById('respostaMissao');
    if (topou) {
        resposta.innerHTML = "🎉 Parabéns! Sua missão começa agora. O valor será mantido em segurança.";
    } else {
        resposta.innerHTML = "😌 Sem problemas! Quando estiver pronto, voltamos com a missão.";
    }
}

// Ao carregar a página
window.addEventListener('load', () => {
    initializeElements();
    updateScore();
});

// Ação ao redimensionar (reserva)
window.addEventListener('resize', () => {
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(() => {
        // ação pós-resize
    }, 250);
});

function aceitarMissao(topou) {
    const resposta = document.getElementById('respostaMissao');
    const qrCard = document.getElementById('qrcodeCard');

    if (topou) {
        resposta.innerHTML = "🎉 Parabéns! Sua missão começa agora. O valor será mantido em segurança.";

        // Mostra o cartão do QR Code
        if (qrCard) {
            qrCard.classList.remove('hidden');
            qrCard.style.display = "flex";
            qrCard.style.flexDirection = "column";
            qrCard.style.alignItems = "center";
            qrCard.style.justifyContent = "center";
        }

    } else {
        resposta.innerHTML = "😌 Sem problemas! Quando estiver pronto, voltamos com a missão.";

        // Garante que o QRCode fique oculto caso o usuário desista
        if (qrCard) {
            qrCard.classList.add('hidden');
        }
    }
}
