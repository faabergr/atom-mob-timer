'use babel';

import MobTimerView from './mob-timer-view';
import { CompositeDisposable } from 'atom';

export default {

  mobTimerView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.mobTimerView = new MobTimerView(state.mobTimerViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.mobTimerView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'mob-timer:toggle': () => this.toggle()
    }));
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
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
