import _ from 'lodash';
import React from 'react';
import '../styles/Message.css';

export default class Message extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showProperties: false };
  }

  render() {
    console.log(this.props);
    return (
      <li className="message">
        <div className="metadata">
          <time>{this.props.timestamp.toUTCString()}</time>
          {this._renderQos()}
          {this._renderRetain()}
          &nbsp;|&nbsp;{this.props.payloadType}
          {this._renderPropertiesToggler()}
        </div>

        <div className="payload">
          <pre>{this._renderPayload()}</pre>
        </div>

        {this._renderProperties()}
      </li>
    );
  }
  
  _renderQos() {
    if (typeof(this.props.qos) === 'undefined') return null;
    return (<span>&nbsp;|&nbsp;q{this.props.qos}</span>);
  }

  _renderRetain() {
    if (typeof(this.props.retain) === 'undefined') return null;
    const retain = this.props.retain ? 1 : 0;
    return (<span>,&nbsp;r{retain}</span>);
  }

  _renderPropertiesToggler() {
    if (_.isEmpty(this.props.properties)) return null;

    const title = this.state.showProperties ? 'Hide properties' : 'Show properties';
    const onClick = () => this._handlePropertiesToggle(!this.state.showProperties);
    return (<span>&nbsp;|&nbsp;<button onClick={onClick}>{title}</button></span>);
  }

  _renderPayload() {
    switch (this.props.payloadType) {
      case 'svc-agent envelope': return JSON.stringify(this.props.payload, null, 2);
      case 'raw': return this.props.payload;
      default: throw (new Error(`Unknown payload type: ${this.props.payloadType}`));
    }
  }

  _renderProperties() {
    if (!this.state.showProperties || _.isEmpty(this.props.properties)) return null;

    return (
      <div className="properties">
        <strong>Properties:</strong><br />
        {Object.entries(this.props.properties).map(([k, v]) => this._renderProperty(k, v))}
      </div>
    );
  }

  _renderProperty(key, value) {
    return (<React.Fragment key={key}>{key}: {value}<br /></React.Fragment>);
  }

  _handlePropertiesToggle(showProperties) {
    this.setState({ showProperties });
  }
}
