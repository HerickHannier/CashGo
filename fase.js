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

function updateScore() {
    document.getElementById('correct').textContent = score.correct;
    document.getElementById('wrong').textContent = score.wrong;

    const penaltyWarning = document.getElementById('penaltyWarning');
    if (score.wrong % 2 === 1) {
        penaltyWarning.style.display = 'block';
    } else {
        penaltyWarning.style.display = 'none';
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

    setTimeout(() => toast.classList.add('show'), 100);
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
    bubble.appendChild(img);

    const startX = Math.random() * (window.innerWidth - 80);
    bubble.style.left = startX + 'px';
    bubble.style.bottom = '-100px';

    const duration = Math.random() * 4 + 5;
    bubble.style.animation = `bubbleRise ${duration}s linear forwards`;

    bubble.addEventListener('click', handleBubbleClick);

    gameContainer.appendChild(bubble);

    setTimeout(() => {
        if (bubble.parentNode) bubble.remove();
    }, duration * 1000);
}

function handleBubbleClick(event) {
    if (!gameActive || gamePaused) return;

    const bubble = event.currentTarget;
    const isEssential = bubble.dataset.essential === 'true';

    bubble.classList.add('clicked');

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

    setTimeout(() => {
        if (bubble.parentNode) bubble.remove();
    }, 500);
}

function showQuiz4() {
    gameActive = false;
    gamePaused = false;
    clearTimeout(bubbleCreationInterval);

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
        const delay = Math.random() * 1000 + 500;
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

// Inicializa score ao carregar a página
window.addEventListener('load', () => {
    updateScore();
});
