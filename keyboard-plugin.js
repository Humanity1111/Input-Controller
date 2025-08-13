export class KeyboardPlugin {
    constructor(controller) {
        this.controller = controller;

        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
    }

    attach(target) {
        this.detach();
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
    }

    detach() {
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);
    }

    onKeyDown(e) {
        if (!this.controller.enabled || !this.controller.focused) return;
        this.controller.buttonDown('Key:' + e.code);
    }

    onKeyUp(e) {
        if (!this.controller.enabled || !this.controller.focused) return;
        this.controller.buttonUp('Key:' + e.code);
    }
}