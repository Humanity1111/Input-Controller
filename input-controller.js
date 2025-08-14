export class InputController {
    static ACTION_ACTIVATED = "input-controller:action-activated";
    static ACTION_DEACTIVATED = "input-controller:action-deactivated";

    #actions = {};
    #keyStates = {};
    #target = null;
    enabled = false;
    focused = true;

    constructor({ actionsToBind = {}, target = document } = {}) {
        this.bindActions(actionsToBind);
        this.attach(target);
        window.addEventListener("blur", () => { this.focused = false; });
        window.addEventListener("focus", () => { this.focused = true; });
    }

    attach(target, dontEnable = false) {
        this.#target = target;
        if (!dontEnable) this.enabled = true;
    }

    detach() {
        this.enabled = false;
        this.#target = null;
    }

    bindActions(actionsToBind) {
        for (const [action, { keys = [], enabled = true }] of Object.entries(actionsToBind)) {
            if (!this.#actions[action]) {
                this.#actions[action] = { keys, enabled, active: false };
            } else {
                this.#actions[action].keys = Array.from(new Set([...this.#actions[action].keys, ...keys]));
                this.#actions[action].enabled = enabled;
            }
        }
    }

    enableAction(actionName) {
        if (this.#actions[actionName]) this.#actions[actionName].enabled = true;
    }

    disableAction(actionName) {
        if (this.#actions[actionName]) this.#actions[actionName].enabled = false;
        if (this.#actions[actionName].active) {
            this.#actions[actionName].active = false;
            this.#dispatchEvent(InputController.ACTION_DEACTIVATED, actionName);
        }
    }

    isActionActive(actionName) {
        if (!this.enabled || !this.focused) return false;
        const action = this.#actions[actionName];
        if (!action || !action.enabled) return false;
        return action.keys.some(k => this.#keyStates[k]);
    }

    isKeyPressed(keyCode) {
        return !!this.#keyStates[keyCode];
    }

    _setKeyState(keyCode, pressed) {
        this.#keyStates[keyCode] = pressed;
        for (const [actionName, action] of Object.entries(this.#actions)) {
            if (!action.enabled) continue;
            const wasActive = action.active;
            action.active = action.keys.some(k => this.#keyStates[k]);
            if (action.active !== wasActive) {
                this.#dispatchEvent(action.active ? InputController.ACTION_ACTIVATED : InputController.ACTION_DEACTIVATED, actionName);
            }
        }
    }

    #dispatchEvent(type, actionName) {
        if (this.#target && this.enabled && this.focused) {
            const event = new CustomEvent(type, { detail: actionName });
            this.#target.dispatchEvent(event);
        }
    }
}
