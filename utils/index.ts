export const debounce = function (func: Function, delay: number) {
    let debounceTimer: NodeJS.Timeout;

    return function () {
        const context = this as any;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    }
}