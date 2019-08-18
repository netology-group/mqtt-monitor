import React from 'react';

import Session from './SessionsList/Session';

import './SessionsList.css';

export default class SessionsList extends React.Component {
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
      <ul className="sessions">
        {this.state.modelData.sessions.map(s => <Session key={s.data.clientId} model={s} />)}
      </ul>
    );
  }
}
