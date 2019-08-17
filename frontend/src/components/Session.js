import React from 'react';
import Toggler from './Toggler';
import Topic from './Topic';
import { Tabs, Tab } from './Tabs';
import '../styles/Session.css';

export default class Session extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  render() {
    return (
      <li>
        <Toggler open={this.state.open} onToggle={this._handleToggle.bind(this)} />
        {this._renderOnlineIndicator()}
        {this.props.clientId}
        {this._renderDetails()}
      </li>
    );
  }

  _renderOnlineIndicator() {
    const klass = `indicator indicator-${this.props.online ? 'on' : 'off'}`;
    return (<span className={klass}>&#9679;</span>);
  }

  _renderDetails() {
    if (!this.state.open) return null;

    return (
      <div className="session-details">
        <Tabs>
          <Tab id="publishes" title="Publishes">
            <ul className="topics">
              {this.props.publishes.map(t => this._renderTopic('publishes', t))}
            </ul>
          </Tab>

          <Tab id="delivers" title="Delivers">
            <ul className="topics">
              {this.props.delivers.map(t => this._renderTopic('delivers', t))}
            </ul>
          </Tab>

          <Tab id="subscriptions" title="Subscriptions">
            <ul className="subscriptions">
              {this.props.subscriptions.map(this._renderSubscription.bind(this))}
            </ul>
          </Tab>
        </Tabs>
      </div>
    );
  }

  _renderTopic(key, topic) {
    return (
      <Topic
        {...topic}
        key={topic.topic}
        setState={this.props.setState}
        onToggle={value => this._handleTopicToggle(key, topic.topic, value)}
      />
    );
  }

  _renderSubscription(subscription) {
    return (
      <li key={subscription.topic}>
        {subscription.topic.join('/')}
        &nbsp;
        <span className="subscription-info">q{subscription.qos}</span>
      </li>
    );
  }

  _handleToggle(open) {
    this.setState({ open });
  }
}
