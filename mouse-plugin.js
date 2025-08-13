export class MousePlugin {
    constructor(controller) {
        this.controller = controller;
        this.target = null;

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);
    }

    attach(target) {
        this.detach();

        this.target = target || this.controller.target || document;

        this.target.addEventListener('mousedown', this.onMouseDown);
        this.target.addEventListener('mouseup', this.onMouseUp);
        this.target.addEventListener('contextmenu', this.onContextMenu);
    }

    detach() {
        if (!this.target) return;
        this.target.removeEventListener('mousedown', this.onMouseDown);
        this.target.removeEventListener('mouseup', this.onMouseUp);
        this.target.removeEventListener('contextmenu', this.onContextMenu);
        this.target = null;
    }

    onContextMenu(e) {
        e.preventDefault();
    }

    onMouseDown(e) {
        if (!this.controller.enabled || !this.controller.focused) return;
        this.controller.buttonDown('Mouse:' + e.button);
    }

    onMouseUp(e) {
        if (!this.controller.enabled || !this.controller.focused) return;
        this.controller.buttonUp('Mouse:' + e.button);
    }
}