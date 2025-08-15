import { ControllerPlugin } from "./controller-plugin.js";

export class MousePlugin extends ControllerPlugin {
    init(target) {
        this.mouseDownHandler = e => {
            const code = e.button === 0 ? "lmb" : e.button === 2 ? "rmb" : e.button === 1 ? "mmb" : null ;
            if (code) this.handleInput(code, true);
        };
        this.mouseUpHandler = e => {
            const code = e.button === 0 ? "lmb" : e.button === 2 ? "rmb" : e.button === 1 ? "mmb" : null ;
            if (code) this.handleInput(code, false);
        };
        target.addEventListener("mousedown", this.mouseDownHandler);
        target.addEventListener("mouseup", this.mouseUpHandler);
        target.addEventListener("contextmenu", e => e.preventDefault());
    }

    destroy() {
        if (!this.target) return;
        this.target.removeEventListener("mousedown", this.mouseDownHandler);
        this.target.removeEventListener("mouseup", this.mouseUpHandler);
    }
}