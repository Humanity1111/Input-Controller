import { ControllerPlugin } from "./controller-plugin.js";

export class MousePlugin extends ControllerPlugin {
    init(target) {
        this._mouseDownHandler = e => {
            const code = e.button === 0 ? "lmb" : e.button === 2 ? "rmb" : null;
            if (code) this._handleInput(code, true);
        };
        this._mouseUpHandler = e => {
            const code = e.button === 0 ? "lmb" : e.button === 2 ? "rmb" : null;
            if (code) this._handleInput(code, false);
        };
        target.addEventListener("mousedown", this._mouseDownHandler);
        target.addEventListener("mouseup", this._mouseUpHandler);
        target.addEventListener("contextmenu", e => e.preventDefault());
    }

    destroy() {
        if (!this.target) return;
        this.target.removeEventListener("mousedown", this._mouseDownHandler);
        this.target.removeEventListener("mouseup", this._mouseUpHandler);
    }
}
