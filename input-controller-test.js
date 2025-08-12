const controller = new InputController({
    left: { keys: [37, 65] },
    right: { keys: [39, 68] },
    up: { keys: [38, 87] },
    down: { keys: [40, 83] },
    jump: { keys: [] },
    shoot: { mouseButtons: [0] },
    scope: { mouseButtons: [2] },
    reload: { mouseButtons: [1] } 
},  document.getElementById('arena'));

controller.addPlugin(new KeyboardPlugin(controller));
controller.addPlugin(new MousePlugin(controller));

const player = document.getElementById('player');
const controllerStatus = document.getElementById('controller-status');
const focusStatus = document.getElementById('focus-status');

function updateStatus() {
    controllerStatus.textContent = controller.enabled ? 'Включен' : 'Выключен';
    focusStatus.textContent = document.hasFocus() ? 'В фокусе' : 'Не в фокусе';
}

controller.target.addEventListener(InputController.ACTION_ACTIVATED, function (e) {
    console.log('Активировано действие:', e.detail.action);
});

controller.target.addEventListener(InputController.ACTION_DEACTIVATED, function (e) {
    console.log('Деактивировано действие:', e.detail.action);
});

function gameLoop() {
    if (controller.enabled) {
        const speed = 5;
        let x = parseInt(player.style.left) || 250;
        let y = parseInt(player.style.top) || 250;

        if (controller.actions.left.enabled 
            && controller.actions.left.keys.some(x => controller.plugins[0].pressedKeys.has(x))) x -= speed;
        if (controller.actions.right.enabled 
            && controller.actions.right.keys.some(x => controller.plugins[0].pressedKeys.has(x))) x += speed;
        if (controller.actions.up.enabled 
            && controller.actions.up.keys.some(x => controller.plugins[0].pressedKeys.has(x))) y -= speed;
        if (controller.actions.down.enabled 
            && controller.actions.down.keys.some(x => controller.plugins[0].pressedKeys.has(x))) y += speed;
        if (controller.actions.jump.enabled && controller.actions.jump.keys.some(x => controller.plugins[0].pressedKeys.has(x))) {
            player.style.backgroundColor = 'red';
        } else {
            player.style.backgroundColor = 'beige';
        }

        player.style.left = Math.max(0, Math.min(450, x)) + 'px';
        player.style.top = Math.max(0, Math.min(450, y)) + 'px';
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
    controller.bindActions({ jump: { keys: [32] } });
    controller.enableAction('jump');
});

window.addEventListener('focus', updateStatus);
window.addEventListener('blur', updateStatus);
window.onfocus = window.onblur = updateStatus;

gameLoop();
updateStatus();