
export default class Timer {
    /**
     * 
     * @param {Function} callback
     * @param {number} delay
     */
    constructor(callback, delay) {
        this.callback = callback;
        this.remaining = delay;
        this.timer = null;
        this.start = 0;
        this.resume();
    }

    pause() {
        clearTimeout(this.timer);
        this.remaining -= (Date.now() - this.start);
    }

    resume() {
        this.start = Date.now();
        this.timer = setTimeout(this.callback, this.remaining);
    }
}