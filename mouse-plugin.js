class MousePlugin {
    constructor(controller) {
        this.controller = controller;
        this.PressedButtons = new Set();
    }

    init() {
        window.addEventListener('mousedown', this.onMouseDown);
        window.addEventListener('mouseup', this.onMouseUp);
    }

    reset() {
        this.PressedButtons.clear();
    }

    onMouseDown = (event) => {
        if (!this.controller.enabled || !this.controller.focused) return;

        const button = event.button;
        if (this.PressedButtons.has(button)) return;
        this.PressedButtons.add(button);

        for (const [actionName, config] of Object.entries(this.controller.actions)) {
            if (config.enabled && config.mouseButtons && config.mouseButtons.includes(button)) {
                this.controller.dispatchEvent(InputController.ACTION_ACTIVATED, actionName);
            }
        }
    }

    onMouseUp = (event) => {
        if (!this.controller.enabled || !this.controller.focused) return;

        const button = event.button;
        if (!this.PressedButtons.has(button)) return;
        this.PressedButtons.delete(button);

        for (const [actionName, config] of Object.entries(this.controller.actions)) {
            if (config.enabled && config.mouseButtons && config.mouseButtons.includes(button)) {
                this.controller.dispatchEvent(InputController.ACTION_DEACTIVATED, actionName);
            }
        }
    }
}

window.MousePlugin = MousePlugin;
