const controller = new InputController({
    left: { keys: [37, 65] },   // стрелка влево, A
    right: { keys: [39, 68] },  // стрелка вправо, D
    up: { keys: [38, 87] },     // стрелка вверх, W
    down: { keys: [40, 83] }    // стрелка вниз, S
});
controller.attach(document.getElementById('arena'));

const player = document.getElementById('player');
const controllerStatus = document.getElementById('controller-status');
const focusStatus = document.getElementById('focus-status');

function updateStatus() {
    controllerStatus.textContent = controller.enabled ? 'Включен' : 'Выключен';
    focusStatus.textContent = document.hasFocus() ? 'В фокусе' : 'Не в фокусе';
}

controller.target.addEventListener(InputController.ACTION_ACTIVATED, function (e) {
    console.log('Активировано действие', e.detail.action);
});

controller.target.addEventListener(InputController.ACTION_DEACTIVATED, function (e) {
    console.log('Деактивировано действие', e.detail.action);
});

function gameLoop() {
    if (controller.enabled) {
        const speed = 5;
        let x = parseInt(player.style.left) || 250;
        let y = parseInt(player.style.top) || 250;

        if (controller.isActionActive('left')) x -= speed;
        if (controller.isActionActive('right')) x += speed;
        if (controller.isActionActive('up')) y -= speed;
        if (controller.isActionActive('down')) y += speed;

        if (controller.isActionActive('jump')) {
            player.style.backgroundColor = 'cyan';
        } else {
            player.style.backgroundColor = 'red';
        }

        // Ограничения по полю
        x = Math.max(0, Math.min(450, x));
        y = Math.max(0, Math.min(450, y));

        player.style.left = x + 'px';
        player.style.top = y + 'px';
    }
    requestAnimationFrame(gameLoop);
}

document.getElementById('attach').addEventListener('click', function () {
    controller.attach(document.getElementById('arena'));
    updateStatus();
});

document.getElementById('detach').addEventListener('click', function () {
    controller.detach();
    updateStatus();
});

document.getElementById('enable').addEventListener('click', function () {
    controller.enabled = true;
    updateStatus();
});

document.getElementById('disable').addEventListener('click', function () {
    controller.enabled = false;
    updateStatus();
});

document.getElementById('add-jump').addEventListener('click', function () {
    if (!controller.actions.jump) {
        controller.bindActions({
            jump: { keys: [32] } // Пробел
        });
        controller.enableAction('jump');
    }
});

window.addEventListener('focus', updateStatus);
window.addEventListener('blur', updateStatus);

gameLoop();
updateStatus();
