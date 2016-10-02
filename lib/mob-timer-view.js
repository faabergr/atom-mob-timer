'use babel';

export default class MobTimerView {
    constructor(serializedState, onTogglePause, onReset) {
        // Create root element
        this.element = document.createElement('div');
        this.element.classList.add('mob-timer');

        // Pause button
        this.pauseButton = document.createElement('button');
        this.pauseButton.classList.add('icon', 'icon-playback-pause', 'btn');
        this.pauseButton.title = 'Pause timer';
        this.element.appendChild(this.pauseButton);
        this.pauseButton.onclick = onTogglePause;

        // Reset button
        this.resetButton = document.createElement('button');
        this.resetButton.classList.add('icon', 'icon-clock', 'btn');
        this.resetButton.title = 'Reset timer';
        this.element.appendChild(this.resetButton);
        this.resetButton.onclick = onReset;

        // Create message element
        this.message = document.createElement('div');
        this.message.classList.add('message');
        this.element.appendChild(this.message);
    }

    // Returns an object that can be retrieved when package is activated
    serialize() {}

    // Tear down any state and detach
    destroy() {
        this.element.remove();
    }

    getElement() {
        return this.element;
    }

    showPauseButton() {
        this.pauseButton.classList.add('icon-playback-pause');
        this.pauseButton.classList.remove('icon-playback-play');
    }

    showPlayButton() {
        this.pauseButton.classList.add('icon-playback-play');
        this.pauseButton.classList.remove('icon-playback-pause');
    }

    togglePausePlayButton(showPlay) {
        this.pauseButton.classList.toggle('icon-playback-pause');
        this.pauseButton.classList.toggle('icon-playback-play');
    }

    resetPausePlayButton() {
        this.pauseButton.classList.remove('icon-playback-play');
        this.pauseButton.classList.add('icon-playback-pause');
    }

    setMessage(newMessage) {
        this.message.textContent = newMessage;
    }

}
