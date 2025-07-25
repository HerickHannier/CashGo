// Listas de imagens com caminhos locais
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

let score = {
    correct: 0,
    wrong: 0
};

let gameContainer = document.getElementById('gameContainer');
let toastContainer = document.getElementById('toastContainer');
let gameActive = false;
let gamePaused = false;
let bubbleCreationInterval;
let pauseButton = document.getElementById('pauseButton');

// Cache para elementos DOM
const scoreElements = {
    correct: null,
    wrong: null,
    penaltyWarning: null
};

// Inicializar cache de elementos
function initializeElements() {
    scoreElements.correct = document.getElementById('correct');
    scoreElements.wrong = document.getElementById('wrong');
    scoreElements.penaltyWarning = document.getElementById('penaltyWarning');
    gameContainer = document.getElementById('gameContainer');
    toastContainer = document.getElementById('toastContainer');
    pauseButton = document.getElementById('pauseButton');
}

function updateScore() {
    if (!scoreElements.correct) initializeElements();

    scoreElements.correct.textContent = score.correct;
    scoreElements.wrong.textContent = score.wrong;

    if (score.wrong % 2 === 1) {
        scoreElements.penaltyWarning.style.display = 'block';
    } else {
        scoreElements.penaltyWarning.style.display = 'none';
    }

    if (score.correct >= 10) {
        showQuiz4();
    }
}

function startGameFromInstructions() {
    document.getElementById('instructionsScreen').classList.add('hidden');
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

function getRandomItem(isEssential) {
    const items = isEssential ? essentialItems : desireItems;
    return items[Math.floor(Math.random() * items.length)];
}

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

    // Usar requestAnimationFrame para melhor performance
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, duration);
}

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
    img.tabIndex = -1;      // ❌ impede foco
    img.draggable = false;  // ❌ impede arrastar a imagem

    const startX = Math.random() * (window.innerWidth - 90);
    bubble.style.left = startX + 'px';
    bubble.style.bottom = '-100px';

    const duration = Math.random() * 3 + 4; // Reduzido para mais dinamismo
    bubble.style.animation = `bubbleRise ${duration}s linear forwards`;

    bubble.addEventListener('click', handleBubbleClick, { once: true }); // Usar once: true para melhor performance

    gameContainer.appendChild(bubble);

    // Remover bolha automaticamente após a animação
    setTimeout(() => {
        if (bubble.parentNode && !bubble.classList.contains('clicked')) {
            bubble.remove();
        }
    }, duration * 1000);
}

function handleBubbleClick(event) {
    if (!gameActive || gamePaused) return;

    const bubble = event.currentTarget;

    // ⚠️ Impede múltiplos cliques
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

    // Remove a bolha após animação de clique
    setTimeout(() => {
        if (bubble.parentNode) {
            bubble.remove();
        }
    }, 500);
}


function showQuiz4() {
    gameActive = false;
    gamePaused = false;
    clearTimeout(bubbleCreationInterval);

    // Remover todas as bolhas existentes instantaneamente
    const existingBubbles = gameContainer.querySelectorAll('.bubble');
    existingBubbles.forEach(b => b.remove());

    gameContainer.classList.add('hidden');
    toastContainer.classList.add('hidden');

    setTimeout(() => {
        const quiz4 = document.getElementById('quiz4');
        if (quiz4) {
            quiz4.style.display = 'block';
            quiz4.classList.add('active');
        }
    }, 500);
}

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

function startGame() {
    if (!gameActive || gamePaused) return;

    function scheduleBubble() {
        if (!gameActive || gamePaused) return;
        createBubble();
        const delay = Math.random() * 800 + 400; // Intervalo otimizado
        bubbleCreationInterval = setTimeout(scheduleBubble, delay);
    }

    scheduleBubble();
}

function proximo(proximoId) {
    const atual = document.querySelector('.quiz-item.active');
    if (atual) {
        atual.classList.remove('active');
        atual.style.display = 'none';
    }

    const proximo = document.getElementById(proximoId);
    if (proximo) {
        proximo.style.display = 'block';
        proximo.classList.add('active');
    }
}

// Inicializar quando a página carregar
window.addEventListener('load', () => {
    initializeElements();
    updateScore();
});

// Otimização para dispositivos móveis
window.addEventListener('resize', () => {
    // Debounce para evitar muitas execuções
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(() => {
        // Reposicionar elementos se necessário
    }, 250);
});
