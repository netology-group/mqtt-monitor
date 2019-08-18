import React from 'react';
import Indicator from './components/ui/Indicator';
import Session from './components/Session';
import State from './state/State';
import WsEventsListener from './WsEventsListener';
import './styles/App.css';

const WS_URL = function () {
  // Custom value from REACT_APP_WS_URL passed through <meta name="ws-url" /> tag.
  const metaWsUrlTag = document.head.querySelector("meta[name~=ws-url][content]");
  if (metaWsUrlTag && metaWsUrlTag.content !== '') return metaWsUrlTag.content;

  // Default value: ws://CURRENT_BASE_URL/ws
  var ws_url = new URL('/ws', window.location.href);
  ws_url.protocol = ws_url.protocol.replace('http', 'ws');
  return ws_url;
}();

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = State.build();
    this.wsEventsListener = new WsEventsListener(WS_URL, this.setState.bind(this));
  }

  render() {
    return (
      <div className="app">
        <header>
          <h1>
            MQTT Monitor&nbsp;
            <Indicator on={this.state.connected} />
          </h1>
        </header>
        <main>
          <ul className="sessions">
            {this.state.sessions.map(s => this._renderSession(s))}
          </ul>
        </main>
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
