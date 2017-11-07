const CursorPlayerView = (function() {
    function CursorPlayerView(selector) {
        this.renderer = new rpk.Renderer();
        this._initialRender(selector);
    }

    CursorPlayerView.prototype._initialRender = function(selector) {
        const htmlTemplate =
            '<div class="cs-player">' +
                '<div class="cs-player__buttons-group">' +
                    '<button onclick="eventHub.publish(CS_REQUEST_PREVIOUS_TRACK)" id="prev-button">prev</button>' +
                    '<button onclick="eventHub.publish(CS_TOGGLE_PLAY)" id="play-toggle"></button>' +
                    '<button onclick="eventHub.publish(CS_REQUEST_NEXT_TRACK)" id="next-button">next</button>' +
                '</div>' + 
                '<div class="cs-player__track-display">' +
                    '<div class="cs-player__time" id="cs-progress-current-time"></div>' +
                    '<div class="cs-player__titled-progress-bar">' +
                        '<div id="cs-progress-title"></div>' +
                        '<div class="cs-click-zone" onpointerdown="eventHub.publish(CS_PROGRESS_POINTER_DOWN, event)">' +
                            '<div class="cs-progress-bar cs-range-bar" id="cs-progress-bar">' +
                                '<div class="cs-range-bar__knob" id="cs-progress-bar__knob"></div>' +
                            '</div>' +
                        '</div>'+
                    '</div>' +
                    '<div class="cs-player__time" id="cs-progress-duration"></div>' +
                '</div>' +
                '<div class="cs-click-zone" onpointerdown="eventHub.publish(CS_VOLUME_POINTER_DOWN, event)">' +
                    '<div class="cs-volume-bar cs-range-bar" id="cs-volume-bar"><div>' +
                '</div>'
            '</div>'+
            '</div>';

        this.renderer.setInnerHTMLToSelector(selector, htmlTemplate);
        
        this.rootElement = document.querySelector(selector);
        this.playToggleButton = this.rootElement.querySelector('#play-toggle');
        this.previousButton = this.rootElement.querySelector('#prev-button');
        this.nextButton = this.rootElement.querySelector('#next-button');
        this.currentTime = this.rootElement.querySelector('#cs-progress-current-time');
        this.duration = this.rootElement.querySelector('#cs-progress-duration');
        this.title = this.rootElement.querySelector('#cs-progress-title');
        this.progressBar = this.rootElement.querySelector('#cs-progress-bar');
        this.progressBarKnob = this.rootElement.querySelector('#cs-progress-bar__knob');
        this.volume = this.rootElement.querySelector('#cs-player-volume');
        this.volumeBar = this.rootElement.querySelector('#cs-volume-bar');

        // init view
        this.update({
            isPlaying: false,
            currentTime: 0,
            duration: 0,
            title: '',
            percentage: 0,
            volume: 1,
            hasPrevious: false,
            hasCurrent: false,
            hasNext: false,
        });

        // hookup events
        eventHub.subscribe(CS_PROGRESS_POINTER_DOWN, this.startSeek.bind(this));
        eventHub.subscribe(CS_VOLUME_POINTER_DOWN, this.startVolumeChange.bind(this));
        eventHub.subscribe(CS_PLAYER_STATE_CHANGE, this.update.bind(this));
    }

    CursorPlayerView.prototype.update = function(delta) {
        if (delta.isPlaying !== undefined) {
            this.playToggleButton.innerHTML = delta.isPlaying ? 'pause' : 'play';
        }
        if (delta.currentTime !== undefined) {
            const parsedCurrentTime = this.getMinutesAndSecondsFromTime(delta.currentTime);
            this.currentTime.innerHTML = parsedCurrentTime.minutes + ':' + parsedCurrentTime.seconds;
        }
        if (delta.duration !== undefined) {
            const parsedDuration = this.getMinutesAndSecondsFromTime(delta.duration);
            this.duration.innerHTML = parsedDuration.minutes + ':' + parsedDuration.seconds;
        }
        if (delta.title !== undefined) {
            this.title.innerHTML = delta.title;
        }
        if (delta.percentage !== undefined) {
            this.progressBar.style.backgroundImage = 'linear-gradient(to right, purple, purple ' + 100 * delta.percentage + '%, grey ' + 100 * delta.percentage + '%, grey)';
            this.progressBarKnob.style.transform = 'translate(' + (this.progressBar.offsetWidth * delta.percentage - 8) + 'px, -4px)';
        }
        if (delta.hasPrevious !== undefined) {
            this.previousButton.disabled = !delta.hasPrevious;
        }
        if (delta.hasCurrent !== undefined) {
            this.playToggleButton.disabled = !delta.hasCurrent;
        }
        if (delta.hasNext !== undefined) {
            this.nextButton.disabled = !delta.hasNext;
        }
        if (delta.volume !== undefined) {
            this.volumeBar.style.backgroundImage = 'linear-gradient(to right, purple, purple ' + 100 * delta.volume + '%, grey ' + 100 * delta.volume + '%, grey)';
        }
    }

    CursorPlayerView.prototype.emitSeek = function (event, channelName, element) {
        const length = event.clientX - element.getBoundingClientRect().left;

        const seekPercentage = length / element.offsetWidth;
        eventHub.publish(channelName, seekPercentage);
    }

    CursorPlayerView.prototype.getMinutesAndSecondsFromTime = function (timeInSeconds) {
        const remainder = timeInSeconds % 60;
        const seconds = Math.floor(remainder);
        const paddedSeconds = seconds < 10 ? '0' + seconds : seconds.toString();

        const minutes = (timeInSeconds - remainder) / 60;

        return {
            minutes: minutes.toString(),
            seconds: paddedSeconds,
        };
    }

    CursorPlayerView.prototype.startSeek = function (event) {
        this.emitSeek(event, CS_SEEK, this.progressBar);

        let pointermoveHandler;
        let mouseupHandler;
        let interruptHandler;

        document.addEventListener('pointermove', pointermoveHandler = function(event) {
            this.emitSeek(event, CS_SEEK, this.progressBar);
        }.bind(this));

        document.addEventListener('pointerup', mouseupHandler = function(event) {
            this.emitSeek(event, CS_SEEK, this.progressBar);
            document.removeEventListener('pointermove', pointermoveHandler);
            document.removeEventListener('pointerup', mouseupHandler);
            eventHub.unsubscribe(CS_SEEK_INTERRUPT, interruptHandler);
        }.bind(this));

        eventHub.subscribe(CS_SEEK_INTERRUPT, interruptHandler = function() {
            document.removeEventListener('pointermove', pointermoveHandler);
            document.removeEventListener('pointerup', mouseupHandler);
            eventHub.unsubscribe(CS_SEEK_INTERRUPT, interruptHandler);
        });
    }

    CursorPlayerView.prototype.startVolumeChange = function (event) {
        this.emitSeek(event, CS_VOLUME_CHANGE, this.volumeBar);

        let pointermoveHandler;
        let mouseupHandler;
        let interruptHandler;

        document.addEventListener('pointermove', pointermoveHandler = function(event) {
            this.emitSeek(event, CS_VOLUME_CHANGE, this.volumeBar);
        }.bind(this));


        document.addEventListener('pointerup', mouseupHandler = function(event) {
            this.emitSeek(event, CS_VOLUME_CHANGE, this.volumeBar);
            document.removeEventListener('pointermove', pointermoveHandler);
            document.removeEventListener('pointerup', mouseupHandler);
        }.bind(this));
    }

    return CursorPlayerView;
})();