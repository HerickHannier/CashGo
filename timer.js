function countdown() {
        const timerDisplay = document.getElementById('timer');
        const targetDate = new Date('2025-06-22T23:59:59');
        const now = new Date();
        const timeLeft = targetDate - now;

        if (timeLeft <= 0) {
            timerDisplay.textContent = "Tempo Esgotado!";
            return;
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000).toString().padStart(2, '0');
        if (days > 0) {
            timerDisplay.textContent = `${days}dias: ${hours}:${minutes}:${seconds}`;
        } else {
            timerDisplay.textContent = `${hours}:${minutes}:${seconds}`;    
        }

        setTimeout(countdown, 1000);
    }

    countdown();
