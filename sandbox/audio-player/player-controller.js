const CursorPlayerController = (function() {
    function CursorPlayerController(nativePlayer) {
        this.state = {
            currentTime: 0,
            duration: 0,
            isPlaying: false,
        };

        this.nativePlayer = nativePlayer;

        window.onresize = function() {
            this.updateView({
                percentage: this.state.currentTime / this.state.duration,
            });
        }.bind(this);

        this.nativePlayer.ontimeupdate = function (event) {
            this.updateView({
                currentTime: this.state.currentTime = event.target.currentTime,
                percentage: event.target.currentTime / this.state.duration,
            });
        }.bind(this);
        
        this.nativePlayer.ondurationchange = function (event) {
            this.updateView({
                currentTime: this.state.currentTime = +event.target.currentTime,
                duration: this.state.duration = event.target.duration,
                percentage: this.state.currentTime / this.state.duration,
            })
        }.bind(this);

        this.nativePlayer.onvolumechange = function (event) {
            this.updateView({
                volume: event.target.volume,
            });
        }.bind(this);

        this.nativePlayer.onplay = function (event) {
            this.updateView({
                isPlaying: this.state.isPlaying = true,
            });
        }.bind(this);

        this.nativePlayer.onpause = function (event) {
            this.updateView({
                isPlaying: this.state.isPlaying = false,
            });
        }.bind(this);

        this.nativePlayer.onended = function (event) {
            eventHub.publish(CS_REQUEST_AUTO_NEXT);
            eventHub.publish(CS_SEEK_INTERRUPT);
        }.bind(this);

        // hookup events
        eventHub.subscribe(CS_TOGGLE_PLAY, function(event) {
            if (this.state.isPlaying)
                this.pause();
            else
                this.play();
        }.bind(this));

        eventHub.subscribe(CS_SEEK, this.seek.bind(this));
        eventHub.subscribe(CS_VOLUME_CHANGE, this.volumeChange.bind(this));

        eventHub.subscribe(CS_PLAY_TRACK, this.playTrack.bind(this));
    }

    CursorPlayerController.prototype.updateView = function(delta) {
        eventHub.publish(CS_PLAYER_STATE_CHANGE, delta);
    }

    CursorPlayerController.prototype.setTrack = function(trackSrc) {
        this.nativePlayer.src = trackSrc;
        this.updateView({
            isPlaying: this.state.isPlaying = false,
        });

        this.nativePlayer.load();
    }

    CursorPlayerController.prototype.playTrack = function(trackSrc) {
        this.setTrack(trackSrc);
        this.play();
    }   

    CursorPlayerController.prototype.play = function() {
        this.updateView({
            isPlaying: this.state.isPlaying = true,
        });
        this.nativePlayer.play();
    }
    
    CursorPlayerController.prototype.pause = function() {
        this.updateView({
            isPlaying: this.state.isPlaying = false,
        });
        this.nativePlayer.pause();
    }

    CursorPlayerController.prototype.seek = function(percentage) {
        this.nativePlayer.currentTime = this.state.duration * percentage;
        if (!this.state.isPlaying && percentage < 1) // don't play if seek beyond the end
            this.play();
    }

    CursorPlayerController.prototype.volumeChange = function(volume) {
        this.nativePlayer.volume = Math.max(0, Math.min(volume, 1));
    }

    return CursorPlayerController;
})();
