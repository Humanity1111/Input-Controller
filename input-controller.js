class InputController {
    static get ACTION_ACTIVATED() { return 'input-controller:action-activated'; }
    static get ACTION_DEACTIVATED() { return 'input-controller:action-deactivated'; }

    constructor(actions = {}, target = document) {
        this.enabled = true;
        this.focused = true;
        this.target = target;
        this.actions = {};
        this.pressedButtons = new Set();
        this.plugins = [];

        this.bindActions(actions);

        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);

        window.addEventListener('focus', this.handleFocus);
        window.addEventListener('blur', this.handleBlur);
    }

    bindActions(actionsToBind) {
        for (const [name, cfg] of Object.entries(actionsToBind)) {
            if (!this.actions[name]) {
                this.actions[name] = { keys: new Set(cfg.keys || []), enabled: cfg.enabled !== false };
            } else {
                (cfg.keys || []).forEach(k => this.actions[name].keys.add(k));
            }
        }
    }

    enableAction(name) {
        if (this.actions[name]) this.actions[name].enabled = true;
    }

    disableAction(name) {
        if (this.actions[name]) this.actions[name].enabled = false;
    }

    attach(target) {
        if (this.target && this.target !== document) {
            this.plugins.forEach(plugin => plugin.detach());
        }
        this.target = target;
        this.plugins.forEach(plugin => plugin.attach(target));
    }

    detach() {
        this.plugins.forEach(plugin => plugin.detach());
        this.target = null;
    }

    addPlugin(plugin) {
        this.plugins.push(plugin);
        if (this.target) plugin.attach(this.target);
    }

    isActionActive(actionName) {
        if (!this.enabled || !this.focused) return false;
        const action = this.actions[actionName];
        if (!action || !action.enabled) return false;
        for (const key of action.keys) {
            if (this.pressedButtons.has(key)) return true;
        }
        return false;
    }

    isKeyPressed(keyCode) {
        return this.pressedButtons.has(keyCode);
    }

    handleFocus() {
        this.focused = true;
    }

    handleBlur() {
        this.focused = false;
        this.pressedButtons.clear();
    }

    dispatchEvent(eventType, actionName) {
        if (!this.target || !this.enabled) return;
        const event = new CustomEvent(eventType, { detail: { action: actionName } });
        this.target.dispatchEvent(event);
    }

    buttonDown(button) {
        if (this.pressedButtons.has(button)) return;
        this.pressedButtons.add(button);

        for (const [name, action] of Object.entries(this.actions)) {
            if (action.enabled && action.keys.has(button)) {
                const wasActive = [...action.keys].some(k => k !== button && this.pressedButtons.has(k));
                if (!wasActive) {
                    this.dispatchEvent(InputController.ACTION_ACTIVATED, name);
                }
            }
        }
    }

    buttonUp(button) {
        if (!this.pressedButtons.has(button)) return;
        this.pressedButtons.delete(button);

        for (const [name, action] of Object.entries(this.actions)) {
            if (action.enabled && action.keys.has(button)) {
                const stillActive = [...action.keys].some(k => this.pressedButtons.has(k));
                if (!stillActive) {
                    this.dispatchEvent(InputController.ACTION_DEACTIVATED, name);
                }
            }
        }
    }
}
window.InputController = InputController;
