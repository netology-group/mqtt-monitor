import React from 'react';

import Indicator from '../../ui/Indicator';
import { Tabs, Tab } from '../../ui/Tabs';
import Toggler from '../../ui/Toggler';

import TopicsList from './Session/TopicsList';
import SubscriptionsList from './Session/SubscriptionsList';

import './Session.css';

export default class Session extends React.Component {
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
      <li className="session">
        <Toggler open={this.state.open} onToggle={this._handleToggle.bind(this)} />
        <Indicator on={this.state.modelData.online} />
        {this.state.modelData.clientId}
        {this._renderDetails()}
      </li>
    );
  }

  _renderDetails() {
    if (!this.state.open) return null;

    return (
      <div className="session-details">
        <Tabs>
          <Tab id="publishes" title="Publishes">
            <TopicsList model={this.props.model} modelDataKey='publishes' />
          </Tab>

          <Tab id="delivers" title="Delivers">
            <TopicsList model={this.props.model} modelDataKey='delivers' />
          </Tab>

          <Tab id="subscriptions" title="Subscriptions">
            <SubscriptionsList model={this.props.model} />
          </Tab>
        </Tabs>
      </div>
    );
  }

  _handleToggle(open) {
    this.setState({ open });
  }
}
