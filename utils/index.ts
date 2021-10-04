export const throttle = function (func: Function, delay: number) {
    let throttleTimer: NodeJS.Timeout | undefined;

    return function () {
        if (throttleTimer) {
            return;
        }

        const context = this as any;
        const args = arguments;
        clearTimeout(throttleTimer);
        throttleTimer = setTimeout(() => {
            func.apply(context, args);
            throttleTimer = undefined;
        }, delay);
    }
}