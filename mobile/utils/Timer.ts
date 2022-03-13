
export default class Timer {
    private callback: () => void;
    private remaining: number;
    private timer: NodeJS.Timeout;
    private start: number;

    constructor(callback: () => void, delay: number) {
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