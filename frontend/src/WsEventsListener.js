import _ from 'lodash';
import State from './state/State';
import Session from './state/Session';
import Topic from './state/Topic';

const RECONNECT_INTERVAL = 10000;

export default class WsEventsListener {
  constructor(url, setState) {
    this.url = url;
    this.setState = setState;
    this._initWebSocket();
  }

  _initWebSocket() {
    this.socket = new WebSocket(this.url);
    this.socket.onopen = this._handleOpen.bind(this);
    this.socket.onclose = this._handleClose.bind(this);
    this.socket.onerror = this._handleError.bind(this);
    this.socket.onmessage = this._handleMessage.bind(this);
  }

  _handleOpen() {
    setInterval(() => this.socket.send("ping"), 10000);
    this.setState({ connected: true });
  }

  _handleClose() {
    setTimeout(() => this._initWebSocket(), RECONNECT_INTERVAL);
    this.setState({ connected: false });
  }

  _handleError(event) {
    console.error("WebSocket error: ", event);
    setTimeout(() => this._initWebSocket(), RECONNECT_INTERVAL);
    this.setState({ connected: false });
  }

  _handleMessage(event) {
    const message = JSON.parse(event.data);

    switch (message.type) {
      case 'initial_state':
        this._handleInitialState(message);
        break;
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

  _handleInitialState(message) {
    this.setState(state => {
      return _.reduce(message.sessions, (acc, session) => {
        return State.updateSession(acc, session.client_id, s => {
          return Session.addSubscriptions(s, session.subscriptions);
        });
      }, state);
    });
  }

  _handleRegister(message) {
    this.setState(state => {
      return State.addSession(state, message.client_id);
    });
  }

  _handleRegisterM5(message) {
    this._handleRegister(message);
  }

  _handleClientWakeUp(message) {
    this.setState(state => State.updateSession(state, message.client_id, session => {
      return Session.toggleOnline(session, true);
    }));
  }

  _handleClientOffline(message) {
    this.setState(state => State.updateSession(state, message.client_id, session => {
      return Session.toggleOnline(session, false);
    }));
  }

  _handleClientGone(message) {
    this._handleClientOffline(message);
  }

  _handleSubscribe(message) {
    this.setState(state => State.updateSession(state, message.client_id, session => {
      return Session.addSubscriptions(session, message.subscriptions);
    }));
  }

  _handleSubscribeM5(message) {
    this._handleSubscribe(message);
  }

  _handleUnsubscribe(message) {
    this.setState(state => State.updateSession(state, message.client_id, session => {
      return Session.removeSubscriptions(session, message.subscriptions);
    }));
  }

  _handleUnsubscribeM5(message) {
    this._handleUnsubscribe(message);
  }

  _handlePublish(message) {
    this.setState(state => State.updateSession(state, message.client_id, session => {
      return Session.updatePublishTopic(session, message.topic, topic => {
        return Topic.addMessage(topic, message, false);
      });
    }));
  }

  _handlePublishM5(message) {
    this._handlePublish(message);
  }

  _handleDeliver(message) {
    this._handleDeliverImpl(message, false);
  }

  _handleDeliverM5(message) {
    this._handleDeliverImpl(message, false);
  }

  _handleOfflineMessage(message) {
    this._handleDeliverImpl(message, true);
  }

  _handleDeliverImpl(message, offline) {
    this.setState(state => State.updateSession(state, message.client_id, session => {
      return Session.updateDeliverTopic(session, message.topic, topic => {
        return Topic.addMessage(topic, message, offline);
      });
    }));
  }

  _handleMessageDrop(message) {
    console.warn("Broker dropped a message", message);
  }
}
