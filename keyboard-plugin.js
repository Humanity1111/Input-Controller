export function KeyboardPlugin(controller) {
    const handleKeyDown = (e) => controller._setKeyState(e.keyCode, true);
    const handleKeyUp = (e) => controller._setKeyState(e.keyCode, false);

    return {
        attach() {
            window.addEventListener("keydown", handleKeyDown);
            window.addEventListener("keyup", handleKeyUp);
        },
        detach() {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        }
    };
}
