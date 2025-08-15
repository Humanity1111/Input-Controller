export class InputController {
    ACTION_ACTIVATED = "input-controller:action-activated";
    ACTION_DEACTIVATED = "input-controller:action-deactivated";

    constructor(actionsToBind = {}, target = document) {
        this.actions = {};
        this.enabled = true;
        this.focused = true;
        this.target = target;
        this.plugins = [];
        this.activeKeys = new Set();

        this.bindActions(actionsToBind);

        window.addEventListener("blur", () => { this.focused = false; });
        window.addEventListener("focus", () => { this.focused = true; });
    }

    bindActions(actionsToBind) {
        Object.entries(actionsToBind).forEach(([action, info]) => {
            if (!this.actions[action]) {
                this.actions[action] = { keys: info.keys, active: false, enabled: info.enabled !== false };
            } else {
                this.actions[action].keys = Array.from(new Set([...this.actions[action].keys, ...info.keys]));
            }
        });
    }

    attachPlugin(plugin) {
        plugin.controller = this;
        this.plugins.push(plugin);
        if (plugin.init) plugin.init(this.target);
    }

    detachPlugin(plugin) {
        const index = this.plugins.indexOf(plugin);
        if (index >= 0) {
            if (plugin.destroy) plugin.destroy();
            this.plugins.splice(index, 1);
        }
    }

    enableAction(actionName) {
        if (this.actions[actionName]) this.actions[actionName].enabled = true;
    }

    disableAction(actionName) {
        if (this.actions[actionName]) this.actions[actionName].enabled = false;
        if (this.actions[actionName]) this.actions[actionName].active = false;
    }

    attach(target = document) {
        this.target = target;
        if (this.init) this.init(target);
    }

    detach() {
        if (this.destroy) this.destroy();
        this.enabled = false;
    }

    isActionActive(actionName) {
        return this.actions[actionName] ? this.actions[actionName].active : false;
    }

    isKeyPressed(code) {
        return this.activeKeys.has(code);
    }

    isActionHeldByAnyPlugin(actionName) {
        return this.plugins.some(plugin => plugin.isActionActive && plugin.isActionActive(actionName));
    }

    pluginInput(identifier, pressed) {
        if (!this.enabled || !this.focused) return;

        if (pressed) {
            this.activeKeys.add(identifier);
        } else {
            this.activeKeys.delete(identifier);
        }

        Object.entries(this.actions).forEach(([actionName, action]) => {
            if (!action.enabled) return;

            const shouldBeActive = action.keys.some(key => this.activeKeys.has(key));

            if (shouldBeActive && !action.active) {
                action.active = true;
                this.target.dispatchEvent(new CustomEvent(this.ACTION_ACTIVATED, { detail: { action: actionName } }));
            }

            if (!shouldBeActive && action.active) {
                if (!this.isActionHeldByAnyPlugin(actionName)) {
                    action.active = false;
                    this.target.dispatchEvent(new CustomEvent(this.ACTION_DEACTIVATED, { detail: { action: actionName } }));
                }
            }
        });
    }
}