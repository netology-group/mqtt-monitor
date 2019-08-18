import React from 'react';

import './SubscriptionsList.css';

export default class SubscriptionsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { modelData: props.model.data };
    this._setModelData = modelData => this.setState({ modelData });
    props.model.onUpdate(this._setModelData);
  }

  componentWillUnmount() {
    this.props.model.removeOnUpdate(this._setModelData);
  }

  render() {
    return (
      <ul className="subscriptions">
        {this.state.modelData.subscriptions.map(this._renderSubscription.bind(this))}
      </ul>
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
}
