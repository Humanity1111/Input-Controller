import { InputController } from "./input-controller.js";
import { KeyboardPlugin } from "./keyboard-plugin.js";
import { MousePlugin } from "./mouse-plugin.js";

const arena = document.getElementById("arena");
const player = document.getElementById("player");

const controller = new InputController({
    actionsToBind: {
        left: { keys: [37, 65] },
        right: { keys: [39, 68] },
        up: { keys: [38, 87] },
        down: { keys: [40, 83] },
        click: { keys: [1], enabled: true }
    },
    target: arena
});

const keyboard = KeyboardPlugin(controller);
keyboard.attach();

const mouse = MousePlugin(controller);
mouse.attach();

arena.addEventListener(InputController.ACTION_ACTIVATED, (e) => {
    console.log(`Активировано: ${e.detail}`);
});
arena.addEventListener(InputController.ACTION_DEACTIVATED, (e) => {
    console.log(`Деактивировано: ${e.detail}`);
});

document.getElementById("attach").onclick = () => controller.attach(arena);
document.getElementById("detach").onclick = () => controller.detach();
document.getElementById("enable").onclick = () => controller.enabled = true;
document.getElementById("disable").onclick = () => controller.enabled = false;
document.getElementById("add-jump").onclick = () => controller.bindActions({ jump: { keys: [32] } });

function update() {
    let top = parseInt(player.style.top) || 0;
    let left = parseInt(player.style.left) || 0;

    if (controller.isActionActive("left")) left -= 5;
    if (controller.isActionActive("right")) left += 5;
    if (controller.isActionActive("up")) top -= 5;
    if (controller.isActionActive("down")) top += 5;
    if (controller.isActionActive("jump")) player.style.backgroundColor = "red";
    else if (controller.isActionActive("click")) player.style.backgroundColor = "green";
    else player.style.backgroundColor = "blue";

    player.style.top = Math.max(0, Math.min(450, top)) + "px";
    player.style.left = Math.max(0, Math.min(450, left)) + "px";

    document.getElementById("controller-status").textContent = controller.enabled;
    document.getElementById("focus-status").textContent = controller.focused;

    requestAnimationFrame(update);
}

update();
