const controller = new InputController({
    left: {keys: [37,65]},
    right: {keys: [39, 68]},
    up: {keys: [38,87]},
    down: {keys : [40,83]}
});
controller.attach(document.getElementById('arena'));
const player = document.getElementById('player');
const controllerStatus = document.getElementById('controller-status');
const focusStatus = document.getElementById('focus-status');

function updateStatus(){
    controllerStatus.textContent = controller.enabled ? 'Включен' : 'Выключен';
    focusStatus.textContent = document.hasFocus() ? 'В фокусе' : 'Не в фокусе';
}

controller.target.addEventListener(InputController.ACTION_ACTIVATED, function(e){
    console.log('Активировано действие',e.detail.action);
})

controller.target.addEventListener(InputController.ACTION_DEACTIVATED, function(e){
    console.log('Деактивировано действие',e.detail.action);
})

function gameLoop(){
    if (!controller.enabled) return;

    const speed = 5;
    let x = parseInt(player.style.left) || 250;
    let y = parseInt(player.style.top) || 250;

    if (controller.isActionActive('left')) x-=speed;
    if (controller.isActionActive('right')) x+=speed;
    if (controller.isActionActive('up')) y-=speed;
    if (controller.isActionActive('down')) y+=speed;
    player.style.left = Math.max(0, Math.min(458, x)) + 'px';
    player.style.top = Math.max(80,Math.min(530,y)) + 'px';
    requestAnimationFrame(gameLoop);
}



document.getElementById('attach').addEventListener('click', function(){
    controller.attach(document,getElementById('arena'));
    updateStatus();
})

document.getElementById('detach').addEventListener('click', function(){
    controller.detach();
    updateStatus();
})

document.getElementById('enable').addEventListener('click', function(){
    controller.enabled = true;
    updateStatus();
})

document.getElementById('disable').addEventListener('click', function(){
    controller.enabled = false;
    updateStatus();
})


document.getElementById('add-jump').addEventListener('click', function(){
    controller.bindActions({
        jump: {keys: [32] }
    });
    controller.enableAction('jump');
    controller.target.addEventListener(InputController.ACTION_ACTIVATED, function(e){
        if (e.detail.action === 'jump'){
            player.style.backgroundColor = 'cyan';
        }
    });

    controller.target.addEventListener(InputController.ACTION_DEACTIVATED, function(e){
        if (e.detail.action === 'jump'){
            player.style.backgroundColor = 'red';
        }
    });
})
window.addEventListener('focus', updateStatus);
window.addEventListener('blur', updateStatus);
window.onfocus = window.onblur=updateStatus;

gameLoop();
updateStatus();


