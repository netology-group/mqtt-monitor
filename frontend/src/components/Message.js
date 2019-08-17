import React from 'react';

export default class Message extends React.Component {
  render() {
    return (
      <li>
        <div className="message-meta">
          <time>[{this.props.timestamp}]</time>
          {this._renderQos()}
          {this._renderRetain()}
        </div>
        <pre>{JSON.stringify(this.props.payload, null, 2)}</pre>
      </li>
    );
  }
  
  _renderQos() {
    if (typeof(this.props.qos) === 'undefined') return null;
    return (<span>&nbsp;q{this.props.qos}</span>);
  }

  _renderRetain() {
    if (typeof(this.props.retain) === 'undefined') return null;
    const retain = this.props.retain ? 1 : 0;
    return (<span>&nbsp;r{retain}</span>);
  }
}
