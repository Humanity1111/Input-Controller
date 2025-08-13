export class InputController {
    static ACTION_ACTIVATED = 'input-controller:action-activated';
    static ACTION_DEACTIVATED = 'input-controller:action-deactivated';

    constructor(actions = {}, target = document) {
        this.enabled = true;
        this.focused = true;
        this.target = target;
        this.actions = {};
        this.pressedButtons = new Set();
        this.plugins = [];

        this.bindActions(actions);

        window.addEventListener('focus', () => this.focused = true);
        window.addEventListener('blur', () => {
            this.focused = false;
            this.pressedButtons.clear();
        });
    }

    bindActions(actionsToBind) {
        for (const [name, config] of Object.entries(actionsToBind)) {
            if (!this.actions[name]) {
                this.actions[name] = { keys: new Set(config.keys), enabled: config.enabled !== false };
            } else {
                (config.keys).forEach(k => this.actions[name].keys.add(k));
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
        this.plugins.forEach(plugin => plugin.detach());
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

    isActionActive(name) {
        if (!this.enabled || !this.focused) return false;
        const action = this.actions[name];
        if (!action || !action.enabled) return false;
        return [...action.keys].some(k => this.pressedButtons.has(k));
    }

    buttonDown(button) {
        if (this.pressedButtons.has(button)) return;
        this.pressedButtons.add(button);

        for (const [name, action] of Object.entries(this.actions)) {
            if (action.enabled && action.keys.has(button)) {
                const Alive = [...action.keys].some(k => k !== button && this.pressedButtons.has(k));
                if (!Alive) {
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
                const Alive = [...action.keys].some(k => this.pressedButtons.has(k));
                if (!Alive) {
                    this.dispatchEvent(InputController.ACTION_DEACTIVATED, name);
                }
            }
        }
    }

    dispatchEvent(type, actionName) {
        if (!this.target || !this.enabled) return;
        this.target.dispatchEvent(new CustomEvent(type, { detail: { action: actionName } }));
    }
}