class PubSub {
    constructor() {
        this.channels = {};
    }

    subscribe(channel, subscriber) {
        if (this.channels[channel] === undefined) {
            this.channels[channel] = [];
        }
        this.channels[channel].push(subscriber);
    }

    unsubscribe(channel, subscriber) {
        const i = this.channels[channel].indexOf(subscriber);
        if (i > -1) {
            this.channels[channel].splice(i, 1);
        }

        if (this.channels[channel].length === 0) {
            delete this.channels[channel];
        }
    }

    publish(channel, ...arg) {
        if (this.channels[channel] === undefined) {
            return;
        }

        let handlers = []; // save all handlers to prevent one handler deletes another by unsubscribing

        for (let i = 0; i < this.channels[channel].length; i++) {
            handlers.push(this.channels[channel][i]);
        }

        for (let i = 0; i < handlers.length; i++) {
            handlers[i](...arg);
        }
    }
}