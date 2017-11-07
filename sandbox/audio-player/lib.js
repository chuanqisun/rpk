// event hub
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

        let handlers = []; // save all handlers to prevent one handler deletes another by unsubscribing

        for (let i = 0; i < this.channels[channel].length; i++) {
            handlers.push(this.channels[channel][i]);
        }

        for (let i = 0; i < handlers.length; i++) {
            handlers[i](event);
        }
    }

    return EventHub;
})();

//playlist
"use strict";

if (window.rpk === undefined) {
    window.rpk = {};
}

window.rpk.Playlist = (function () {
    function CursorPlaylist() {
        this.previousStack = []; // most rencent item on top
        this.nextStack = []; // most imminent item on top
        this.currentStack = []; // size = 1
    }

    CursorPlaylist.prototype.addToQueue = function (track) {
        this.nextStack.unshift(track);
    };

    CursorPlaylist.prototype.addToNext = function (track) {
        this.nextStack.push(track);
    };

    CursorPlaylist.prototype.hasPrevious = function () {
        return this.previousStack.length > 0;
    };

    CursorPlaylist.prototype.hasCurrent = function () {
        return this.currentStack.length > 0;
    }

    CursorPlaylist.prototype.hasNext = function () {
        return this.nextStack.length > 0;
    };

    CursorPlaylist.prototype.goToNext = function () {
        if (this.hasCurrent()) {
            this.previousStack.push(this.currentStack.pop());
        }

        if (this.hasNext()) {
            this.currentStack.push(this.nextStack.pop());
        }

        return this.getCurrent();
    };

    CursorPlaylist.prototype.goToPrevious = function () {
        if (this.hasCurrent()) {
            this.nextStack.push(this.currentStack.pop());
        }

        if (this.hasPrevious()) {
            this.currentStack.push(this.previousStack.pop());
        }

        return this.getCurrent();
    };

    CursorPlaylist.prototype.getCurrent = function () {
        return this.currentStack[0];
    };
    return CursorPlaylist;
}());

//renderer
"use strict";

if (window.rpk === undefined) {
    window.rpk = {};
}

window.rpk.Renderer = (function() {
    function Renderer() {}

    Renderer.prototype.renderTemplateToSelector = function (selector, templateHTML, dataObj) {
        const renderedHTML = renderTemplate(templateHTML, dataObj);
        setInnerHTMLToSelector(selector, renderedHTML);
    }
    
    Renderer.prototype.renderTemplate = function (templateHTML, dataObj) {
        const replacer = function (substring, offset) {
            const expression = substring.slice(1, -1);
            return eval('dataObj.' + expression);
        };
        const templateVarRegex = /{[^{]+}/gi;
        return templateHTML.replace(templateVarRegex, replacer);   
    }
    
    Renderer.prototype.setInnerHTMLToSelector = function (selector, innerHTML) {
        const anchors = document.querySelectorAll(selector);
        for (let i = 0; i < anchors.length; i++) {
            anchors[i].innerHTML = innerHTML;
        }
    }

    return Renderer
})();
