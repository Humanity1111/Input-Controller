import { InputController } from './input-controller.js';
import { KeyboardPlugin } from './keyboard-plugin.js';
import { MousePlugin } from './mouse-plugin.js';

const controller = new InputController({
    left: { keys: ['Key:ArrowLeft', 'Key:KeyA'] },
    right: { keys: ['Key:ArrowRight', 'Key:KeyD'] },
    up: { keys: ['Key:ArrowUp', 'Key:KeyW'] },
    down: { keys: ['Key:ArrowDown', 'Key:KeyS'] },
    click: { keys: ['Mouse:0'] },
    scope: { keys: ['Mouse:2'] }
}, document.getElementById('arena'));

controller.addPlugin(new KeyboardPlugin(controller));
controller.addPlugin(new MousePlugin(controller));

const player = document.getElementById('player');
const statusController = document.getElementById('controller-status');
const statusFocus = document.getElementById('focus-status');

function updateStatus() {
    statusController.textContent = controller.enabled ? 'Enabled' : 'Disabled';
    statusFocus.textContent = document.hasFocus() ? 'Focused' : 'Not focused';
}

controller.target.addEventListener(InputController.ACTION_ACTIVATED, e => {
    console.log('Action activated:', e.detail.action);
});
controller.target.addEventListener(InputController.ACTION_DEACTIVATED, e => {
    console.log('Action deactivated:', e.detail.action);
});

function gameLoop() {
    const speed = 5;
    let x = parseInt(player.style.left) || 225;
    let y = parseInt(player.style.top) || 225;

    if (controller.isActionActive('left')) x -= speed;
    if (controller.isActionActive('right')) x += speed;
    if (controller.isActionActive('up')) y -= speed;
    if (controller.isActionActive('down')) y += speed;
    if (controller.isActionActive('jump')) {
        player.style.backgroundColor = 'red';
    } else {
        player.style.backgroundColor = 'green';
    }
    if (controller.isActionActive('scope')) {
        player.style.backgroundColor = 'yellow';}

    x = Math.max(0, Math.min(450, x));
    y = Math.max(0, Math.min(450, y));

    player.style.left = x + 'px';
    player.style.top = y + 'px';

    requestAnimationFrame(gameLoop);
}

document.getElementById('attach').addEventListener('click', () => {
    controller.attach(document.getElementById('arena'));
    updateStatus();
});
document.getElementById('detach').addEventListener('click', () => {
    controller.detach();
    updateStatus();
});
document.getElementById('enable').addEventListener('click', () => {
    controller.enabled = true;
    updateStatus();
});
document.getElementById('disable').addEventListener('click', () => {
    controller.enabled = false;
    updateStatus();
});
document.getElementById('add-jump').addEventListener('click', () => {
    controller.bindActions({ jump: { keys: ['Key:Space'] } });
    controller.enableAction('jump');
});

window.addEventListener('focus', updateStatus);
window.addEventListener('blur', updateStatus);

gameLoop();
updateStatus();