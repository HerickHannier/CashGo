// ===================
//    FUNCIONALIDADES
// ===================

function redeemReward(rewardType) {
    console.log(`Resgatando recompensa: ${rewardType}`);

    // Feedback visual
    event.target.style.transform = 'scale(0.95)';
    setTimeout(() => {
        event.target.style.transform = '';
    }, 150);

    // Simula resgate da recompensa
    switch (rewardType) {
        case 'conta-gratis':
            alert('🎉 Parabéns! Sua conta grátis foi ativada!');
            // Desabilita o botão após resgate
            event.target.textContent = 'Resgatado';
            event.target.style.background = '#10B981';
            event.target.style.color = 'white';
            event.target.disabled = true;
            break;
    }

    switch (rewardType) {
        case 'presente':
            alert('Você não tem XP suficiente');
            break;
    }

    switch (rewardType) {
        case 'desconto':
            alert('🎉 Parabéns! Você resgatou desconto');
            // Desabilita o botão após resgate
            event.target.textContent = 'Resgatado';
            event.target.style.background = '#10B981';
            event.target.style.color = 'white';
            event.target.disabled = true;
            break;
    }

    switch (rewardType) {
        case 'cashback':
            alert('🎉 Parabéns! Você resgatou desconto');
            // Desabilita o botão após resgate
            event.target.textContent = 'Resgatado';
            event.target.style.background = '#10B981';
            event.target.style.color = 'white';
            event.target.disabled = true;
            break;
    }
}

// Simula verificação de XP suficiente
function checkXPRequirement(requiredXP) {
    const currentXP = 235; // XP atual do usuário
    return currentXP >= requiredXP;
}

// Adiciona efeitos de toque para dispositivos móveis
document.querySelectorAll('.reward-card, .redeem-button').forEach(element => {
    element.addEventListener('touchstart', function () {
        this.style.transform = 'scale(0.98)';
    });

    element.addEventListener('touchend', function () {
        setTimeout(() => {
            this.style.transform = '';
        }, 100);
    });
});

// Verifica XP para cada recompensa ao carregar a página
document.addEventListener('DOMContentLoaded', function () {
    const xpRequirements = {
        'cashback': 200,
        'vale-presente': 300,
        'cupom': 150
    };

    // Aqui você pode implementar lógica para desabilitar 
    // recompensas que o usuário não tem XP suficiente
});