class InputController {
    static get ACTION_ACTIVATED() { return 'input-controller:action-activated'; }
    static get ACTION_DEACTIVATED() { return 'input-controller:action-deactivated'; }

    constructor(actionsToBind = {}, target = document) {
        this.enabled = true;
        this.focused = true;
        this.target = target;
        this.actions = {};
        this.plugins = [];

        this.bindActions(actionsToBind);

        window.addEventListener('focus', () => this.focused = true);
        window.addEventListener('blur', () => {
            this.focused = false;
            this.plugins.forEach(x => x.reset && x.reset());
        });
    }

    bindActions(actionsToBind) {
        for (const [actionName, config] of Object.entries(actionsToBind)) {
            this.actions[actionName] = {
                ...config,
                enabled: config.enabled !== false
            };
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

    addPlugin(plugin) {
        this.plugins.push(plugin);
        plugin.init();
    }

    attach (target, dontEnable = false) {
        this.target = target;
        this.plugins.forEach(x => x.init());
        if (!dontEnable) this.enabled = true;
    }

    detach() {
        this.enabled = false;
        this.plugins.forEach(x => x.reset());
        this.target = null;
    }

    dispatchEvent(eventType, actionName) {
        if (!this.target || !this.enabled) return;
        this.target.dispatchEvent(new CustomEvent(eventType, { 
            detail: { action: actionName } }));
    }
}

window.InputController = InputController