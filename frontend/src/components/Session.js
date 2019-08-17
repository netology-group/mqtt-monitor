import React from 'react';
import Toggler from './Toggler';
import Topic from './Topic';

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
        {this._renderTopics('publishes', 'Publishes')}
        {this._renderTopics('subscriptions', 'Subscriptions')}
      </div>
    );
  }

  _renderTopics(key, title) {
    if (this.props[key].length === 0) return null;

    return (
      <div className="topics-container">
        <h4>{title}:</h4>
        <ul className="topics">
          {this.props[key].map(t => this._renderTopic(key, t))}
        </ul>
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

  _handleToggle(open) {
    this.setState(state => ({ ...state, open }));
  }
}
