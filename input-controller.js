export class InputController {
    ACTION_ACTIVATED = "input-controller:action-activated";
    ACTION_DEACTIVATED = "input-controller:action-deactivated";

    constructor(actionsToBind = {}, target = document) {
        this.actions = {};
        this.keyStatus = {};
        this.enabled = true;
        this.focused = true;
        this.target = target;

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
        return !!this.keyStatus[code];
    }
}
