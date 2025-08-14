export function MousePlugin(controller) {
    const handleMouseDown = () => controller._setKeyState(1, true);
    const handleMouseUp = () => controller._setKeyState(1, false);

    return {
        attach() {
            window.addEventListener("mousedown", handleMouseDown);
            window.addEventListener("mouseup", handleMouseUp);
        },
        detach() {
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
        }
    };
}
