let acertos = 0;
        function responder(btn, respostaCerta, proximoId) {
            if (btn.innerText.toLowerCase() === respostaCerta) {
                acertos++;
                btn.style.background = '#4fd172';
            }
            setTimeout(() => proximo(proximoId), 700);
        }

        function responder1(btn, respostaCerta, proximoId) {
            if (btn.innerText.toLowerCase() === respostaCerta) {
                acertos++;
                btn.style.background = 'red';
            }
            setTimeout(() => proximo(proximoId), 700);
        }

        function proximo(id) {
            const atuais = document.querySelectorAll('.quiz-item.active');
            atuais.forEach(e => e.classList.remove('active'));
            const prox = document.getElementById(id);
            if (prox) prox.classList.add('active');
        }

        function aceitarMissao(topou) {
            const el = document.getElementById("respostaMissao");
            if (topou) {
                el.innerHTML = "Missão iniciada! R$5 bloqueado simbolicamente. Conclua até amanhã para ganhar o selo 💎 'Controle Ativado'!";
            } else {
                el.innerHTML = "Sem problema! Missões estão sempre disponíveis. Volte quando quiser.";
            }
        }
