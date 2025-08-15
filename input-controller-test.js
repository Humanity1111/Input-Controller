import { InputController } from "./input-controller.js";
import { KeyboardPlugin } from "./keyboard-plugin.js";
import { MousePlugin } from "./mouse-plugin.js";

const player = document.getElementById("player");
const arena = document.getElementById("arena");
const status = document.getElementById("controller-status");
const focusStatus = document.getElementById("focus-status");


const actions = {
    left: { keys: ["ArrowLeft", "KeyA", "mmb"], enabled: true },
    right: { keys: ["ArrowRight", "KeyD"], enabled: true },
    up: { keys: ["ArrowUp", "KeyW"], enabled: true },
    down: { keys: ["ArrowDown", "KeyS"], enabled: true },
    shoot: { keys: ["lmb"], enabled: true },
    scope: { keys: ["rmb"], enabled: true}
};


const controller = new InputController(actions);
const kbPlugin = new KeyboardPlugin();
const mousePlugin = new MousePlugin();

controller.attachPlugin(kbPlugin);
controller.attachPlugin(mousePlugin);
controller.attach(document);


controller.target.addEventListener(controller.ACTION_ACTIVATED, e => {
    console.log(`Action activated: ${e.detail.action}`);
});

controller.target.addEventListener(controller.ACTION_DEACTIVATED, e => {
    console.log(`Action deactivated: ${e.detail.action}`);
});


function movePlayer() {
    let x = parseInt(player.style.left || 0);
    let y = parseInt(player.style.top || 0);
    const speed = 5;

    if (controller.isActionActive("left")) x -= speed;
    if (controller.isActionActive("right")) x += speed;
    if (controller.isActionActive("up")) y -= speed;
    if (controller.isActionActive("down")) y += speed;

    x = Math.max(0, Math.min(arena.clientWidth - player.clientWidth, x));
    y = Math.max(0, Math.min(arena.clientHeight - player.clientHeight, y));

    player.style.left = x + "px";
    player.style.top = y + "px";

    if (controller.isActionActive("jump")) {
        player.style.backgroundColor = "yellow";
    } else {
        player.style.backgroundColor = "red";
    }

    requestAnimationFrame(movePlayer);
}

requestAnimationFrame(movePlayer);


document.getElementById("attach").onclick = () => controller.attach(document);
document.getElementById("detach").onclick = () => controller.detach();
document.getElementById("enable").onclick = () => controller.enabled = true;
document.getElementById("disable").onclick = () => controller.enabled = false;

document.getElementById("add-jump").onclick = () => {
    controller.bindActions({
        jump: { keys: ["Space"], enabled: true }
    });
};

setInterval(() => {
    status.textContent = controller.enabled ? "enabled" : "disabled";
    focusStatus.textContent = controller.focused ? "focused" : "blurred";
}, 100);