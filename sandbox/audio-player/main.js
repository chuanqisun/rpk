/* event tokents */
window.CS_PLAYER_STATE_CHANGE = 'CS_PLAYER_STATE_CHANGE';
window.CS_POINTER_DOWN = 'CS_POINTER_DOWN'; // when pointer down on progress bar
window.CS_SEEK = 'CS_SEEK'; // when view asked control to seek
window.CS_TOGGLE_PLAY = 'CS_TOGGLE_PLAY'; // when user toggled "play/pause"
window.CS_REQUEST_NEW_TRACK = 'CS_REQUEST_NEW_TRACK'; // when user selected a new track
window.CS_REQUEST_PREVIOUS_TRACK = 'CS_REQUEST_PREVIOUS_TRACK'; // when user clicked "prev"
window.CS_REQUEST_NEXT_TRACK = 'CS_REQUEST_NEXT_TRACK'; // when user clicked "next"
window.CS_PLAY_TRACK = 'CS_PLAY_TRACK'; // when playlist requested a track to be played

const eventHub = new rpk.EventHub();
const nativePlayer = document.querySelector('audio')
const playerController = new CursorPlayerController(nativePlayer);
const playerView = new CursorPlayerView('#rendered-player');
const playlistController = new CursorPlaylistControl(playerController);

function load(index) {
    if (index === 1) eventHub.publish(CS_REQUEST_NEW_TRACK, {title: 'title 1', src: './tracks/track-1.mp3'});
    if (index === 2) eventHub.publish(CS_REQUEST_NEW_TRACK, {title: 'title 2', src: './tracks/track-2.mp3'});
}
