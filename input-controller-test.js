import { KeyboardPlugin } from "./keyboard-plugin.js";
import { MousePlugin } from "./mouse-plugin.js";

const player = document.getElementById("player");
const arena = document.getElementById("arena");
const status = document.getElementById("controller-status");
const focusStatus = document.getElementById("focus-status");

const actions = {
    left: { keys: ["ArrowLeft", "KeyA"], enabled: true },
    right: { keys: ["ArrowRight", "KeyD"], enabled: true },
    up: { keys: ["ArrowUp", "KeyW"], enabled: true },
    down: { keys: ["ArrowDown", "KeyS"], enabled: true }
};

const kbController = new KeyboardPlugin(actions, document);
const mouseController = new MousePlugin({
    lmb: { keys: ["lmb"], enabled: true },
    rmb: { keys: ["rmb"], enabled: true }
}, arena);

let jumpAdded = false;

kbController.attach(document);
mouseController.attach(arena);

document.getElementById("attach").onclick = () => {
    kbController.attach(document);
    mouseController.attach(arena);
};

document.getElementById("detach").onclick = () => {
    kbController.detach();
    mouseController.detach();
};

document.getElementById("enable").onclick = () => {
    kbController.enabled = true;
    mouseController.enabled = true;
};

document.getElementById("disable").onclick = () => {
    kbController.enabled = false;
    mouseController.enabled = false;
};

document.getElementById("add-jump").onclick = () => {
    if (!jumpAdded) {
        kbController.bindActions({ jump: { keys: ["Space"], enabled: true } });
        jumpAdded = true;
    }
};

function movePlayer() {
    let x = parseInt(player.style.left || 0);
    let y = parseInt(player.style.top || 0);
    const step = 5;

    if (kbController.isActionActive("left")) x -= step;
    if (kbController.isActionActive("right")) x += step;
    if (kbController.isActionActive("up")) y -= step;
    if (kbController.isActionActive("down")) y += step;

    x = Math.max(0, Math.min(arena.clientWidth - player.clientWidth, x));
    y = Math.max(0, Math.min(arena.clientHeight - player.clientHeight, y));

    player.style.left = x + "px";
    player.style.top = y + "px";

    if (jumpAdded && kbController.isActionActive("jump")) {
        player.style.backgroundColor = "yellow";
    } else {
        player.style.backgroundColor = "red";
    }

    requestAnimationFrame(movePlayer);
}

requestAnimationFrame(movePlayer);

setInterval(() => {
    status.textContent = kbController.enabled ? "enabled" : "disabled";
    focusStatus.textContent = kbController.focused ? "focused" : "blurred";
}, 100);