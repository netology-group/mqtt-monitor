import _ from 'lodash';
import React from 'react';

import './Message.css';

export default class Message extends React.Component {
  constructor(props) {
    super(props);
    this.state = { modelData: props.model.data, showProperties: false };
    this._setModelData = modelData => this.setState({ modelData });
    props.model.onUpdate(this._setModelData);
  }

  componentWillUnmount() {
    this.props.model.removeOnUpdate(this._setModelData);
  }

  render() {
    return (
      <li className="message">
        <div className="metadata">
          <time>{this.props.model.data.timestamp.toUTCString()}</time>
          {this._renderQos()}
          {this._renderRetain()}
          {this._renderOffline()}
          &nbsp;|&nbsp;{this.props.model.data.payloadType}
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
    if (typeof this.props.model.data.qos === 'undefined') return null;
    return (<span>&nbsp;|&nbsp;q{this.props.model.data.qos}</span>);
  }

  _renderRetain() {
    if (typeof this.props.model.data.retain === 'undefined') return null;
    const retain = this.props.model.data.retain ? 1 : 0;
    return (<span>,&nbsp;r{retain}</span>);
  }

  _renderOffline() {
    if (!this.props.model.data.offline) return null;
    return (<span>,&nbsp;<span className="offline">offline</span></span>);
  }

  _renderPropertiesToggler() {
    if (_.isEmpty(this.props.model.data.properties)) return null;

    const title = this.state.showProperties ? 'Hide properties' : 'Show properties';
    const onClick = () => this._handlePropertiesToggle(!this.state.showProperties);
    return (<span>&nbsp;|&nbsp;<button onClick={onClick}>{title}</button></span>);
  }

  _renderPayload() {
    switch (this.props.model.data.payloadType) {
      case 'svc-agent envelope': return JSON.stringify(this.props.model.data.payload, null, 2);
      case 'raw': return this.props.model.data.payload;
      default: throw (new Error(`Unknown payload type: ${this.props.model.data.payloadType}`));
    }
  }

  _renderProperties() {
    const properties = this.props.model.data.properties;
    if (!this.state.showProperties || _.isEmpty(properties)) return null;

    return (
      <div className="properties">
        <strong>Properties:</strong><br />
        {Object.entries(properties).map(([k, v]) => this._renderProperty(k, v))}
      </div>
    );
  }

  _renderProperty(key, value) {
    return (<React.Fragment key={key}><i>{key}:</i> {value}<br /></React.Fragment>);
  }

  _handlePropertiesToggle(showProperties) {
    this.setState({ showProperties });
  }
}
