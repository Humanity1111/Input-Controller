class MousePlugin {
    constructor(controller) {
        this.controller = controller;
        this.target = null;

        this.mouseDownHandler = this.mouseDownHandler.bind(this);
        this.mouseUpHandler = this.mouseUpHandler.bind(this);
    }

    attach(target) {
        this.target = target;
        target.addEventListener('mousedown', this.mouseDownHandler);
        target.addEventListener('mouseup', this.mouseUpHandler);
    }

    detach() {
        if (!this.target) return;
        this.target.removeEventListener('mousedown', this.mouseDownHandler);
        this.target.removeEventListener('mouseup', this.mouseUpHandler);
        this.target = null;
    }

    mouseDownHandler(event) {
        if (!this.controller.enabled || !this.controller.focused) return;
        this.controller.buttonDown(1000 + event.button);
    }

    mouseUpHandler(event) {
        if (!this.controller.enabled || !this.controller.focused) return;
        this.controller.buttonUp(1000 + event.button);
    }
}