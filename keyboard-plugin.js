class KeyboardPlugin {
    constructor(controller) {
        this.controller = controller;
        this.pressedKeys = new Set();
    }

    init() {
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
    }

    reset() {
        this.pressedKeys.clear();
    }

    onKeyDown = (event) => {
        if (!this.controller.enabled || !this.controller.focused) return;

        const keyCode = event.keyCode;
        if (this.pressedKeys.has(keyCode)) return;
        this.pressedKeys.add(keyCode);

        for (const [actionName, config] of Object.entries(this.controller.actions)) {
            if (config.enabled && config.keys && config.keys.includes(keyCode)) {
                const wasActive = config.keys.some(x => this.pressedKeys.has(x) && x !== keyCode);
                if (!wasActive) {
                    this.controller.dispatchEvent(InputController.ACTION_ACTIVATED, actionName);
                }
            }
        }
    }

    onKeyUp = (event) => {
        if (!this.controller.enabled || !this.controller.focused) return;

        const keyCode = event.keyCode;
        if (!this.pressedKeys.has(keyCode)) return;
        this.pressedKeys.delete(keyCode);

        for (const [actionName, config] of Object.entries(this.controller.actions)) {
            if (config.enabled && config.keys && config.keys.includes(keyCode)) {
                const stillActive = config.keys.some(k => this.pressedKeys.has(k));
                if (!stillActive) {
                    this.controller.dispatchEvent(InputController.ACTION_DEACTIVATED, actionName);
                }
            }
        }
    }
}

window.KeyboardPlugin = KeyboardPlugin;