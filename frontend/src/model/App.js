import _ from 'lodash';

import Model from './Model';
import Session from './Session';

export default class App extends Model {
  constructor() {
    super({ connected: false, sessions: [] });
  }

  changeConnectionState(connected) {
    this.update({ connected });
  }

  findOrAddSession(clientId) {
    const idx = _.findIndex(this.data.sessions, s => s.data.clientId === clientId);
    
    if (idx === -1) {
      const session = new Session(clientId);
      this.update({ sessions: [...this.data.sessions, session]});
      return session;
    } else {
      return this.data.sessions[idx];
    }
  }
}
