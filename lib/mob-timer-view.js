'use babel';

export default class MobTimerView {
    constructor(serializedState, onPause) {
        // Create root element
        this.element = document.createElement('div');
        this.element.classList.add('mob-timer');

        // Create message element
        this.message = document.createElement('div');
        this.message.classList.add('message');
        this.element.appendChild(this.message);

        // Pause button

        this.pauseButton = document.createElement('button');
        this.pauseButton.classList.add('icon');
        this.pauseButton.classList.add('icon-playback-pause');
        this.pauseButton.value = 'what is happening';
        this.pauseButton.classList.add('button');
        this.element.appendChild(this.pauseButton);
        this.pauseButton.onclick = function() {
            onPause();
        };
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

    setMessage(newMessage) {
        this.message.textContent = newMessage;
    }

}
