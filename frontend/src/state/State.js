import _ from 'lodash';
import Session from './Session';

export default class State {
  static build() {
    return { sessions: [] };
  }

  static addSession(state, clientId) {
    if (this._findSessionIndex(state, clientId) !== -1) return state;
    return _.update(state, ['sessions'], s => [...s, Session.build(clientId)]);
  }

  static updateSession(state, clientId, updater) {
    const idx = this._findSessionIndex(state, clientId);
    
    if (idx === -1) {
      return _.update(state, ['sessions'], s => [...s, updater(Session.build(clientId))]);
    } else {
      return _.update(state, ['sessions', idx], updater);
    }
  }

  static _findSessionIndex(state, clientId) {
    return _.findIndex(state.sessions, s => s.clientId === clientId);
  }
}
