class KeyboardPlugin {
    constructor(controller) {
        this.controller = controller;
        this.target = null;

        this.keyDownHandler = this.keyDownHandler.bind(this);
        this.keyUpHandler = this.keyUpHandler.bind(this);
    }

    attach(target) {
        this.target = target;
        window.addEventListener('keydown', this.keyDownHandler);
        window.addEventListener('keyup', this.keyUpHandler);
    }

    detach() {
        if (!this.target) return;
        window.removeEventListener('keydown', this.keyDownHandler);
        window.removeEventListener('keyup', this.keyUpHandler);
        this.target = null;
    }

    keyDownHandler(event) {
        if (!this.controller.enabled || !this.controller.focused) return;
        this.controller.buttonDown(event.keyCode);
    }

    keyUpHandler(event) {
        if (!this.controller.enabled || !this.controller.focused) return;
        this.controller.buttonUp(event.keyCode);
    }
}