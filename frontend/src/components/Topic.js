import React from 'react';
import Toggler from './Toggler';
import Message from './Message';
import '../styles/Topic.css';

export default class Topic extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  render() {
    return (
      <li>
        <Toggler open={this.state.open} onToggle={this._handleToggle.bind(this)} />
        {this.props.topic.join('/')}
        {this._renderDetails()}
      </li>
    );
  }

  _renderDetails() {
    if (!this.state.open) return null;

    return (
      <ul className="messages">
        {this.props.messages.map((message, i) => (<Message {...message} key={i} />))}
      </ul>
    );
  }

  _handleToggle(open) {
    this.setState({ open });
  }
}
