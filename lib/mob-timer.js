'use babel';

import MobTimerView from './mob-timer-view';
import {
    CompositeDisposable
} from 'atom';

export default {

    mobTimerView: null,
    modalPanel: null,
    subscriptions: null,
    isShown: false,
    timer: null,
    countdownTimeInSeconds: 0,
    remainingTimeInSeconds: 0,
    sound: null,
    intervalId: null,
    timerStopped: true,

    config: {
        rotationTimeInSeconds: {
            type: 'integer',
            default: 300,
            minimum: 5
        },
        playSound: {
            type: 'boolean',
            default: true
        }
    },

    updateTime() {
        if (this.mobTimerView) {
            if (this.remainingTimeInSeconds <= 0) {
                atom.notifications.addInfo('Time to rotate!');
                if (atom.config.get('mob-timer.playSound')) {
                    this.sound.play();
                }
                this.remainingTimeInSeconds = this.countdownTimeInSeconds;
            } else {
                this.remainingTimeInSeconds--;
            }

            this.updateTimerMessage();
        };
    },

    updateTimerMessage() {
        this.mobTimerView.setMessage('Rotate in ' + this.remainingTimeInSeconds + 's');
    },

    activate(state) {
        const path = require("path");
        const fs = require('fs');

        this.sound = new Audio(path.join(__dirname, 'assets/tada.wav'));

        this.countdownTimeInSeconds = atom.config.get('mob-timer.rotationTimeInSeconds');

        atom.config.onDidChange('mob-timer.rotationTimeInSeconds', (function(self) {
            return function({
                newValue
            }) {
                self.countdownTimeInSeconds = newValue;
                self.restartTimer();
            };
        })(this));

        this.remainingTimeInSeconds = this.countdownTimeInSeconds;

        var toggleTimerCallback = (function(self) {
            return function() {
                self.toggleTimer();
            };
        })(this);

        var resetTimerCallback = (function(self) {
            return function() {
                self.resetTimer();
            };
        })(this);

        this.mobTimerView = new MobTimerView(state.mobTimerViewState, toggleTimerCallback, resetTimerCallback);
        this.modalPanel = atom.workspace.addTopPanel({
            item: this.mobTimerView.getElement(),
            visible: false
        });

        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        // Register command that toggles this view
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'mob-timer:toggle': () => this.toggle()
        }));

        this.mobTimerView.setMessage("This is the day your life will surely change");
    },

    resetTimer() {
        this.stopTimer();
        this.remainingTimeInSeconds = this.countdownTimeInSeconds;
        this.mobTimerView.resetPausePlayButton();
        this.updateTimerMessage();
        this.startTimer();
    },

    restartTimer() {
        this.stopTimer();
        this.startTimer();
    },

    toggleTimer() {
        this.mobTimerView.togglePausePlayButton();
        this.timerStopped ? this.startTimer() : this.stopTimer();
    },

    startTimer() {
        this.timerStopped = false;
        this.intervalId = window.setInterval(
            (function(self) {
                return function() {
                    self.updateTime();
                };
            })(this), 1000);
    },

    stopTimer() {
        this.timerStopped = true;
        window.clearInterval(this.intervalId);
    },

    deactivate() {
        this.modalPanel.destroy();
        this.subscriptions.dispose();
        this.mobTimerView.destroy();
    },

    serialize() {
        return {
            mobTimerViewState: this.mobTimerView.serialize()
        };
    },

    toggle() {
        console.log('MobTimer was toggled!');

        if (this.isShown) {
            this.stopTimer(this.intervalId);
            this.mobTimerView.showPlayButton();
            this.isShown = false;
            this.modalPanel.hide();
        } else {
            this.startTimer();
            this.mobTimerView.showPauseButton();
            this.isShown = true;
            this.modalPanel.show();
        }
    }

};
