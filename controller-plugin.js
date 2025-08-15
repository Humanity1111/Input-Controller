import { InputController } from "./input-controller.js";

export class ControllerPlugin extends InputController {
    constructor(actions = {}, target = document) {
        super(actions, target);
    }

    handleInput(code, isDown) {
        if (!this.enabled || !this.focused) return;

        Object.entries(this.actions).forEach(([action, info]) => {
            if (!info.enabled) return;

            if (info.keys.includes(code)) {
                const prevStatus = info.active;

                if (isDown) {
                    info.active = true;
                } else {
                    info.active = info.keys.some(k => this.keyStatus[k] && k !== code);
                }

                this.keyStatus[code] = isDown;

                if (prevStatus !== info.active) {
                    const eventName = info.active ? this.ACTION_ACTIVATED : this.ACTION_DEACTIVATED;
                    this.target.dispatchEvent(new CustomEvent(eventName, { detail: action }));
                    console.log(`${action} ${info.active ? 'pressed' : 'released'}`);
                }
            }
        });
    }
}