"use strict";

if (window.rpk === undefined) {
    window.rpk = {};
}

window.rpk.EventHub = (function() {
    function EventHub() {
        this.channels = {};
    }

    EventHub.prototype.subscribe = function(channel, subscriber) {
        if (this.channels[channel] === undefined) {
            this.channels[channel] = [];
        }
        this.channels[channel].push(subscriber);
    }

    EventHub.prototype.unsubscribe = function(channel, subscriber) {
        const i = this.channels[channel].indexOf(subscriber);
        if (i > -1) {
            this.channels[channel].splice(i, 1);
        }

        if (this.channels[channel].length === 0) {
            delete this.channels[channel];
        }
    }

    EventHub.prototype.publish = function(channel, event) {
        if (this.channels[channel] === undefined) {
            return;
        }

        for (let i = 0; i < this.channels[channel].length; i++) {
            this.channels[channel][i](event);
        }
    }

    return EventHub;
})();