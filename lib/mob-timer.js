'use babel';

import MobTimerView from './mob-timer-view';
import { CompositeDisposable } from 'atom';

export default {

  mobTimerView: null,
  modalPanel: null,
  subscriptions: null,
  isShown: false,
  timer: null,
  countdownTimeInSeconds: 0,
  remainingTimeInSeconds: 0,

  config: {
    rotationTimeInSeconds: {
      type: 'integer',
      default: 300,
      minimum: 5
    }
  },

  setTimeMessage(self) {
    if (self.mobTimerView) {
       if (this.remainingTimeInSeconds <= 0) {
         atom.notifications.addInfo('Time to rotate!');
         this.remainingTimeInSeconds = this.countdownTimeInSeconds;
       }
       else {
         this.remainingTimeInSeconds--;
       }
        self.mobTimerView.setMessage('Rotate in ' + this.remainingTimeInSeconds + 's');
    };
  },

  activate(state) {
    this.countdownTimeInSeconds = atom.config.get('mob-timer.rotationTimeInSeconds');
    this.remainingTimeInSeconds = this.countdownTimeInSeconds;

    this.mobTimerView = new MobTimerView(state.mobTimerViewState);
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

    window.setInterval(
        (function(self) {
            return function() { self.setTimeMessage(self); };
        })(this), 1000);

    this.mobTimerView.setMessage("This is the day, that your life will surely change");
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
        this.isShown = false;
        this.modalPanel.hide();
    }
    else {
        this.isShown = true;
        this.modalPanel.show();
    }
  }

};
