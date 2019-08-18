import React from 'react';

import Toggler from '../../../../ui/Toggler';

import Message from './Topic/Message';

import './Topic.css';

export default class Topic extends React.Component {
  constructor(props) {
    super(props);
    this.state = { modelData: props.model.data, open: false };
    this._setModelData = modelData => this.setState({ modelData });
    props.model.onUpdate(this._setModelData);
  }

  componentWillUnmount() {
    this.props.model.removeOnUpdate(this._setModelData);
  }

  render() {
    return (
      <li className="topic">
        <Toggler open={this.state.open} onToggle={this._handleToggle.bind(this)} />
        {this.state.modelData.topic.join('/')}
        {this._renderDetails()}
      </li>
    );
  }

  _renderDetails() {
    if (!this.state.open) return null;

    return (
      <ul className="messages">
        {this.state.modelData.messages.map((message, i) => (<Message key={i} model={message} />))}
      </ul>
    );
  }

  _handleToggle(open) {
    this.setState({ open });
  }
}
