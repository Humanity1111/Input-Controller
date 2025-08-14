import { ControllerPlugin } from "./controller-plugin.js";

export class KeyboardPlugin extends ControllerPlugin {
    init(target) {
        this._keyDownHandler = e => this._handleInput(e.code, true);
        this._keyUpHandler = e => this._handleInput(e.code, false);
        target.addEventListener("keydown", this._keyDownHandler);
        target.addEventListener("keyup", this._keyUpHandler);
    }

    destroy() {
        if (!this.target) return;
        this.target.removeEventListener("keydown", this._keyDownHandler);
        this.target.removeEventListener("keyup", this._keyUpHandler);
    }
}
