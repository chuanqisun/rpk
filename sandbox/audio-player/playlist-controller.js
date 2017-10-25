const CursorPlaylistControl = (function () {
    function CursorPlaylistControl(playerController) {
        this.playlist = new rpk.Playlist();
        this.playerController = playerController;

        eventHub.subscribe(CS_REQUEST_NEW_TRACK, this.onPlayNew.bind(this));
        eventHub.subscribe(CS_REQUEST_PREVIOUS_TRACK, this.onPlayPrevious.bind(this));
        eventHub.subscribe(CS_REQUEST_NEXT_TRACK, this.onPlayNext.bind(this));
    }

    CursorPlaylistControl.prototype.onPlayNew = function (track) {
        this.playlist.addToNext(track);
        this.playlist.goToNext();
        eventHub.publish(CS_PLAY_TRACK, track.src);

        this.updateView({
            hasPrevious: this.playlist.hasPrevious(),
            hasCurrent: this.playlist.hasCurrent(),
            hasNext: this.playlist.hasNext(),
            title: track.title,
        });
    };

    CursorPlaylistControl.prototype.onPlayPrevious = function () {
        const track = this.playlist.goToPrevious();
        eventHub.publish(CS_PLAY_TRACK, track.src);

        this.updateView({
            hasPrevious: this.playlist.hasPrevious(),
            hasCurrent: this.playlist.hasCurrent(),
            hasNext: this.playlist.hasNext(),
            title: track.title,
        });
    };

    CursorPlaylistControl.prototype.onPlayNext = function () {
        const track = this.playlist.goToNext();
        eventHub.publish(CS_PLAY_TRACK, track.src);

        this.updateView({
            hasPrevious: this.playlist.hasPrevious(),
            hasCurrent: this.playlist.hasCurrent(),
            hasNext: this.playlist.hasNext(),
            title: track.title,
        });
    };

    CursorPlaylistControl.prototype.updateView = function(delta) {
        eventHub.publish(CS_PLAYER_STATE_CHANGE, delta);
    }

    return CursorPlaylistControl;
}());
