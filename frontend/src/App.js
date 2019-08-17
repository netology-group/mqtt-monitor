import React from 'react';
import './styles/App.css';
import WsEventsListener from './WsEventsListener';
import State from './state/State';
import Session from './components/Session';

const WS_URL = 'ws://localhost:4040/ws';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = State.build();
    this.wsEventsListener = new WsEventsListener(WS_URL, this.setState.bind(this));
  }

  render() {
    return (
      <div className="App">
        <ul className="sessions">
          {this.state.sessions.map(s => this._renderSession(s))}
        </ul>
      </div>
    );
  }

  _renderSession(session) {
    return (
      <Session
        {...session}
        key={session.clientId}
        setState={this.setState.bind(this)}
      />
    );
  }
}
