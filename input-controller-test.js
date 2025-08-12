const controller = new InputController({
    left: { keys: [37, 65] },
    right: { keys: [39, 68] },
    up: { keys: [38, 87] },
    down: { keys: [40, 83] },
    click: { keys:   [1000] },
    scope: { keys: [1002]}
}, document.getElementById('arena'));

const player = document.getElementById('player');
const statusController = document.getElementById('controller-status');
const statusFocus = document.getElementById('focus-status');

const keyboardPlugin = new KeyboardPlugin(controller);
controller.addPlugin(keyboardPlugin);

const mousePlugin = new MousePlugin(controller);
controller.addPlugin(mousePlugin);

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
  if (!controller.enabled) {
    requestAnimationFrame(gameLoop);
    return;
  }
  const speed = 5;
  let x = parseInt(player.style.left) || 225;
  let y = parseInt(player.style.top) || 225;

  if (controller.isActionActive('left')) x -= speed;
  if (controller.isActionActive('right')) x += speed;
  if (controller.isActionActive('up')) y -= speed;
  if (controller.isActionActive('down')) y += speed;

  if (controller.isActionActive('jump')) {
    player.style.backgroundColor = 'cyan';
  } else {
    player.style.backgroundColor = 'green';
  }

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
  controller.bindActions({ jump: { keys: [32] } });
  controller.enableAction('jump');
});

window.addEventListener('focus', updateStatus);
window.addEventListener('blur', updateStatus);

gameLoop();
updateStatus();
