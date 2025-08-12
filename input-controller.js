class InputController {
    static get ACTION_ACTIVATED() {
        return 'input-controller:action-activated';
    }
    static get ACTION_DEACTIVATED() {
        return 'input-controller:action-deactivated';
    }

    constructor(actionsToBind = {}, target = document) {
        this.enabled = true;
        this.focused = true;
        this.target = target;
        this.actions = {};
        this.pressedKeys = new Set();

        this.bindActions(actionsToBind);
        this._setupEventListeners();
    }

    bindActions(actionsToBind) {
        for (const [actionName, config] of Object.entries(actionsToBind)) {
            if (!this.actions[actionName]) {
                this.actions[actionName] = {
                    keys: new Set(config.keys || []),
                    enabled: config.enabled !== false
                };
            } else {
                (config.keys || []).forEach(key => this.actions[actionName].keys.add(key));
                if (typeof config.enabled === 'boolean') {
                    this.actions[actionName].enabled = config.enabled;
                }
            }
        }
    }

    enableAction(actionName) {
        if (this.actions[actionName]) {
            this.actions[actionName].enabled = true;
        }
    }

    disableAction(actionName) {
        if (this.actions[actionName]) {
            this.actions[actionName].enabled = false;
        }
    }

    attach(target, dontEnable = false) {
        this.target = target;
        if (!dontEnable) {
            this.enabled = true;
        }
    }

    detach() {
        this.enabled = false;
        this.target = null;
        this.pressedKeys.clear();
    }

    isActionActive(actionName) {
        if (!this.enabled || !this.focused || !this.actions[actionName] || !this.actions[actionName].enabled) {
            return false;
        }
        for (const key of this.actions[actionName].keys) {
            if (this.pressedKeys.has(key)) {
                return true;
            }
        }
        return false;
    }

    isKeyPressed(keyCode) {
        return this.pressedKeys.has(keyCode);
    }

    _setupEventListeners() {
        window.addEventListener('keydown', this._handleKeyDown.bind(this));
        window.addEventListener('keyup', this._handleKeyUp.bind(this));
        window.addEventListener('focus', this._handleFocus.bind(this));
        window.addEventListener('blur', this._handleBlur.bind(this));
    }

    _handleKeyDown(event) {
        if (!this.enabled || !this.focused) return;
        const keyCode = event.keyCode;
        if (!this.pressedKeys.has(keyCode)) {
            this.pressedKeys.add(keyCode);
            for (const [actionName, action] of Object.entries(this.actions)) {
                if (action.enabled && action.keys.has(keyCode)) {
                    this._dispatchEvent(InputController.ACTION_ACTIVATED, actionName);
                }
            }
        }
    }

    _handleKeyUp(event) {
        if (!this.enabled || !this.focused) return;
        const keyCode = event.keyCode;
        if (this.pressedKeys.has(keyCode)) {
            this.pressedKeys.delete(keyCode);
            for (const [actionName, action] of Object.entries(this.actions)) {
                if (action.enabled && action.keys.has(keyCode)) {
                    this._dispatchEvent(InputController.ACTION_DEACTIVATED, actionName);
                }
            }
        }
    }

    _handleFocus() {
        this.focused = true;
    }

    _handleBlur() {
        this.focused = false;
        this.pressedKeys.clear();
    }

    _dispatchEvent(eventType, actionName) {
        if (!this.target || !this.enabled) return;
        const event = new CustomEvent(eventType, {
            detail: { action: actionName }
        });
        this.target.dispatchEvent(event);
    }
}

window.InputController = InputController;
