import _ from 'lodash';
import React from 'react';
import './App.css';

const WS_URL = 'ws://localhost:4040';
const INITIAL_STATE = {sessions: []};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;

    const socket = new WebSocket(WS_URL);
    setInterval(() => socket.send("ping"), 10000);
    socket.addEventListener('message', this._handleWebSocketEvent.bind(this));
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
        key={session.client_id}
        onToggle={this._handleSessionToggle.bind(this)}
        onTopicToggle={this._handleTopicToggle.bind(this)}
      />
    );
  }

  _handleWebSocketEvent(event) {
    let message = JSON.parse(event.data);

    switch (message.type) {
      case 'register':
        this._handleRegister(message);
        break;
      case 'register_m5':
        this._handleRegisterM5(message);
        break;
      case 'client_wakeup':
        this._handleClientWakeUp(message);
        break;
      case 'client_offline':
        this._handleClientOffline(message);
        break;
      case 'client_gone':
        this._handleClientGone(message);
        break;
      case 'subscribe':
        this._handleSubscribe(message);
        break;
      case 'subscribe_m5':
        this._handleSubscribeM5(message);
        break;
      case 'unsubscribe':
        this._handleUnsubscribe(message);
        break;
      case 'unsubscribe_m5':
        this._handleUnsubscribeM5(message);
        break;
      case 'publish':
        this._handlePublish(message);
        break;
      case 'publish_m5':
        this._handlePublishM5(message);
        break;
      case 'deliver':
        this._handleDeliver(message);
        break;
      case 'deliver_m5':
        this._handleDeliverM5(message);
        break;
      case 'offline_message':
        this._handleOfflineMessage(message);
        break;
      case 'message_drop':
        this._handleMessageDrop(message);
        break;
      default:
        console.warn(`Unknown message type: '${message.type}'`);
        break;
    }
  }

  _handleRegister(message) {
    this.setState(state => {
      if (_.findIndex(state.sessions, s => s.client_id === message.client_id) !== -1) return;

      let session = {
        client_id: message.client_id,
        publishes: [],
        subscriptions: [],
        online: true,
        open: false
      };

      return {...state, sessions: [...state.sessions, session]};
    });
  }

  _handleRegisterM5(message) {
    this._handleRegister(message);
  }

  _handleClientWakeUp(message) {
    this.setState(state => {
      let idx = _.findIndex(state.sessions, s => s.client_id === message.client_id);
      return _.set(state, ['sessions', idx, 'online'], true);
    });
  }

  _handleClientOffline(message) {
    this.setState(state => {
      let idx = _.findIndex(state.sessions, s => s.client_id === message.client_id);
      return _.set(state, ['sessions', idx, 'online'], false);
    });
  }

  _handleClientGone(message) {
    this._handleClientOffline(message);
  }

  _handleSubscribe(message) {
    this.setState(state => {
      let idx = _.findIndex(state.sessions, session => session.client_id === message.client_id);
      let newSubscriptions = message.topics.map(topic => ({ topic, messages: [], open: false }));

      return _.update(state, ['sessions', idx, 'subscriptions'], subscriptions => {
        return _.concat(subscriptions, newSubscriptions);
      });
    });
  }

  _handleSubscribeM5(message) {
    this._handleSubscribe(message)
  }

  _handleUnsubscribe(message) {
    this.setState(state => {
      let idx = _.findIndex(state.sessions, s => s.client_id === message.client_id);

      return _.update(state, ['sessions', idx, 'subscriptions'], subscriptions => {
        return _.reject(subscriptions, s => _.isEqual(s.topic, message.topic));
      });
    });
  }

  _handleUnsubscribeM5(message) {
    this._handleUnsubscribe(message)
  }

  _handlePublish(message) {
    this.setState(state => {
      let sessionIdx = _.findIndex(state.sessions, s => s.client_id === message.client_id);
      let publishes = state.sessions[sessionIdx].publishes;
      let publishIdx = _.findIndex(publishes, p => _.isEqual(p.topic, message.topic));

      if (publishIdx === -1) {
        return _.update(state, ['sessions', sessionIdx, 'publishes'], publishes => {
          return [...publishes, { topic: message.topic, messages: [message], open: false }];
        });
      } else {
        let path = ['sessions', sessionIdx, 'publishes', publishIdx, 'messages'];
        return _.update(state, path, messages => [message, ...messages]);
      }
    });
  }

  _handlePublishM5(message) {
    this._handlePublish(message);
  }

  _handleDeliver(message) {
    this.setState(state => {
      let sessionIdx = _.findIndex(state.sessions, s => s.client_id === message.client_id);
      let subscriptions = state.sessions[sessionIdx].subscriptions;
      let subscriptionIdx = _.findIndex(subscriptions, s => _.isEqual(s.topic, message.topic));

      if (subscriptionIdx === -1) {
        return _.update(state, ['sessions', sessionIdx, 'subscriptions'], subscriptions => {
          return [...subscriptions, { topic: message.topic, messages: [message], open: false }];
        });
      } else {
        let path = ['sessions', sessionIdx, 'subscriptions', subscriptionIdx, 'messages'];
        return _.update(state, path, messages => [...messages, message]);
      }
    });
  }

  _handleDeliverM5(message) {
    this._handleDeliver(message);
  }

  _handleOfflineMessage(message) {
    this._handleDeliver(message);
  }

  _handleMessageDrop(message) {
    console.warn("Broker dropped a message", message);
  }

  _handleSessionToggle(clientId, value) {
    this.setState(state => {
      let sessionIdx = _.findIndex(state.sessions, s => s.client_id === clientId);
      return _.set(state, ['sessions', sessionIdx, 'open'], value);
    });
  }

  _handleTopicToggle(clientId, pubsub, topic, value) {
    this.setState(state => {
      let sessionIdx = _.findIndex(state.sessions, s => s.client_id === clientId);
      let topicIdx = _.findIndex(state.sessions[sessionIdx][pubsub], t => _.isEqual(t.topic, topic));
      return _.set(state, ['sessions', sessionIdx, pubsub, topicIdx, 'open'], value);
    });
  }
}

class Session extends React.Component {
  render() {
    return (
      <li>
        <Toggler
          open={this.props.open}
          onToggle={value => this.props.onToggle(this.props.client_id, value)}
        />

        {this._renderOnlineIndicator()}
        {this.props.client_id}
        {this._renderDetails()}
      </li>
    );
  }

  _renderOnlineIndicator() {
    const klass = `indicator indicator-${this.props.online ? 'on' : 'off'}`;
    return (<span className={klass}>&#9679;</span>);
  }

  _renderDetails() {
    if (!this.props.open) return false;

    return (
      <div className="session-details">
        {this._renderPublishes()}
        {this._renderSubscriptions()}
        <div className="clear" />
      </div>
    );
  }

  _renderPublishes() {
    if (this.props.publishes.length === 0) return false;

    return (
      <div className="topics-container">
        <h4>Publishes:</h4>
        <ul className="topics">
          {this.props.publishes.map(topic => this._renderTopic('publishes', topic))}
        </ul>
      </div>
    );
  }

  _renderSubscriptions() {
    if (this.props.subscriptions.length === 0) return false;

    return (
      <div className="topics-container">
        <h4>Subscriptions:</h4>
        <ul className="topics">
          {this.props.subscriptions.map(topic => this._renderTopic('subscriptions', topic))}
        </ul>
      </div>
    );
  }

  _renderTopic(pubsub, topic) {
    return (
      <Topic
        {...topic}
        key={topic.topic}
        client_id={this.props.client_id}
        onToggle={value => this.props.onTopicToggle(this.props.client_id, pubsub, topic.topic, value)}
      />
    );
  }
}

class Topic extends React.Component {
  render() {
    return (
      <li>
        <Toggler open={this.props.open} onToggle={value => this.props.onToggle(value)} />
        {this.props.topic.join('/')}
        {this._renderDetails()}
      </li>
    );
    }

  _renderDetails() {
    if (!this.props.open) return false;

    return (
      <ul className="messages">
        {this.props.messages.map((message, i) => (<Message {...message} key={i} />))}
      </ul>
    );
  }
}

class Message extends React.Component {
  render() {
    const envelope = JSON.parse(this.props.payload);
    const payload = JSON.parse(envelope.payload);

    return (
      <li>
        <div className="message-meta">
          <time>[{this.props.timestamp}]</time>
          &nbsp;q{this.props.qos}
          &nbsp;r{this.props.retain ? 1 : 0}
        </div>
        <pre>{JSON.stringify(payload, null, 2)}</pre>
      </li>
    );
  }
}

class Toggler extends React.Component {
  render() {
    if (this.props.open) {
      return (
        <span
          className="toggler"
          onClick={() => this.props.onToggle(false)}>
          &minus;
        </span>);
    } else {
      return (
        <span
          className="toggler"
          onClick={() => this.props.onToggle(true)}>
          +
        </span>);
    }
  }
}

export default App;
