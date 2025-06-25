function countdown() {
        const timerEl = document.getElementById('timer');
        const barEl = document.querySelector('.progress-fill');

        const endTime = new Date('2025-06-25T20:00:00');
        const now = new Date();

        const total = endTime - now; // tempo total a partir do momento atual
        const duration = endTime - new Date(); // usado para manter total constante

        if (total <= 0) {
            timerEl.textContent = "Tempo Esgotado!";
            barEl.style.width = "0%";
            return;
        }

        const days = Math.floor(total / (1000 * 60 * 60 * 24));
        const hours = String(Math.floor((total / (1000 * 60 * 60)) % 24)).padStart(2, '0');
        const minutes = String(Math.floor((total / (1000 * 60)) % 60)).padStart(2, '0');
        const seconds = String(Math.floor((total / 1000) % 60)).padStart(2, '0');

        timerEl.textContent = days > 0
            ? `${days}dias: ${hours}:${minutes}:${seconds}`
            : `${hours}:${minutes}:${seconds}`;

        const percent = (total / duration) * 100;
        barEl.style.width = `${percent}%`;

        setTimeout(countdown, 1000);
    }

    countdown();
