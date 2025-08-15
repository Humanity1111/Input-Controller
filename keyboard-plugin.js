export class KeyboardPlugin {
    constructor() {
        this.controller = null;
        this.pressedKeys = new Set();
    }

    init(target = document) {
        this.keyDownHandler = e => {
            if (!this.pressedKeys.has(e.code)) {
                this.pressedKeys.add(e.code);
                this.controller.pluginInput(e.code, true);
            }
        };
        this.keyUpHandler = e => {
            this.pressedKeys.delete(e.code);
            this.controller.pluginInput(e.code, false);
        };

        target.addEventListener("keydown", this.keyDownHandler);
        target.addEventListener("keyup", this.keyUpHandler);
    }

    destroy() {
        document.removeEventListener("keydown", this.keyDownHandler);
        document.removeEventListener("keyup", this.keyUpHandler);
    }

    isActionActive(actionName) {
        const action = this.controller.actions[actionName];
        if (!action) return false;
        return action.keys.some(key => this.pressedKeys.has(key));
    }
}