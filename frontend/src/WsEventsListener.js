const RECONNECT_INTERVAL = 10000;
const PING = JSON.stringify({ type: "ping" });

export default class WsEventsListener {
  constructor(url, model) {
    this.url = url;
    this.model = model;
  }

  connect() {
    this.socket = new WebSocket(this.url);
    this.socket.onopen = this._handleOpen.bind(this);
    this.socket.onclose = this._handleClose.bind(this);
    this.socket.onerror = this._handleError.bind(this);
    this.socket.onmessage = this._handleMessage.bind(this);
  }

  _handleOpen() {
    this.model.changeConnectionState(true);
    this.pingInterval = setInterval(() => this.socket.send(PING), 10000);
  }

  _handleClose() {
    this.model.changeConnectionState(false);
    this.pingInterval = clearInterval(this.pingInterval);
    setTimeout(() => this.connect(), RECONNECT_INTERVAL);
  }

  _handleError(event) {
    console.error("WebSocket error: ", event);
    this._handleClose();
  }

  _handleMessage(event) {
    const message = JSON.parse(event.data);

    switch (message.type) {
      case 'pong':
        break;
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
    for (const session of message.sessions) {
      this.model
        .findOrAddSession(session.client_id)
        .addSubscriptions(session.subscriptions);
    }
  }

  _handleRegister(message) {
    this.model.findOrAddSession(message.client_id);
  }

  _handleRegisterM5(message) {
    this._handleRegister(message);
  }

  _handleClientWakeUp(message) {
    this.model
      .findOrAddSession(message.client_id)
      .toggleOnline(true);
  }

  _handleClientOffline(message) {
    this.model
      .findOrAddSession(message.client_id)
      .toggleOnline(false);
  }

  _handleClientGone(message) {
    this._handleClientOffline(message);
  }

  _handleSubscribe(message) {
    this.model
      .findOrAddSession(message.client_id)
      .addSubscriptions(message.subscriptions);
  }

  _handleSubscribeM5(message) {
    this._handleSubscribe(message);
  }

  _handleUnsubscribe(message) {
    this.model
      .findOrAddSession(message.client_id)
      .removeSubscriptions(message.subscriptions);
  }

  _handleUnsubscribeM5(message) {
    this._handleUnsubscribe(message);
  }

  _handlePublish(message) {
    this.model
      .findOrAddSession(message.client_id)
      .findOrAddPublishTopic(message.topic)
      .addMessage(message, false);
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
    this.model
      .findOrAddSession(message.client_id)
      .findOrAddDeliverTopic(message.topic)
      .addMessage(message, offline);
  }

  _handleMessageDrop(message) {
    console.warn("Broker dropped a message", message);
  }
}
