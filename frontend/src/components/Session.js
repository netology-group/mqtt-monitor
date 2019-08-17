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
          <Tab title="Publishes">
            {this._renderTopics('publishes')}
          </Tab>

          <Tab title="Subscriptions">
            {this._renderTopics('subscriptions')}
          </Tab>
        </Tabs>
      </div>
    );
  }

  _renderTopics(key) {
    if (this.props[key].length === 0) return null;

    return (
      <ul className="topics">
        {this.props[key].map(t => this._renderTopic(key, t))}
      </ul>
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

  _handleToggle(open) {
    this.setState(state => ({ ...state, open }));
  }
}
