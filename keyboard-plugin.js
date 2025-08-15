import { ControllerPlugin } from "./controller-plugin.js";

export class KeyboardPlugin extends ControllerPlugin {
    init(target) {
        this.keyDownHandler = e => this.handleInput(e.code, true);
        this.keyUpHandler = e => this.handleInput(e.code, false);
        target.addEventListener("keydown", this.keyDownHandler);
        target.addEventListener("keyup", this.keyUpHandler);
    }

    destroy() {
        if (!this.target) return;
        this.target.removeEventListener("keydown", this.keyDownHandler);
        this.target.removeEventListener("keyup", this.keyUpHandler);
    }
}