export class MousePlugin {
    constructor() {
        this.controller = null;
        this.activeButtons = new Set();
        this.buttonMap = { 0: "lmb", 1: "mmb", 2: "rmb" };
    }

    init(target = document) {
        this.mouseDownHandler = e => {
            const id = this.buttonMap[e.button];
            if (!this.activeButtons.has(id)) {
                this.activeButtons.add(id);
                this.controller.pluginInput(id, true);
            }
        };
        this.mouseUpHandler = e => {
            const id = this.buttonMap[e.button];
            this.activeButtons.delete(id);
            this.controller.pluginInput(id, false);
        };

        target.addEventListener("mousedown", this.mouseDownHandler);
        target.addEventListener("mouseup", this.mouseUpHandler);
        target.addEventListener("contextmenu", e => e.preventDefault());
    }

    destroy() {
        document.removeEventListener("mousedown", this.mouseDownHandler);
        document.removeEventListener("mouseup", this.mouseUpHandler);
    }

    isActionActive(actionName) {
        const action = this.controller.actions[actionName];
        if (!action) return false;
        return action.keys.some(key => this.activeButtons.has(key));
    }
}