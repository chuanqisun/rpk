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
