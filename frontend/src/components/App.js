import React from 'react';

import Indicator from './ui/Indicator';
import SessionsList from './App/SessionsList';

import './App.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { modelData: props.model.data };    
    this._setModelData = modelData => this.setState({ modelData });
    props.model.onUpdate(this._setModelData);
  }

  componentDidMount() {
    this.props.wsEventsListener.connect();
  }

  componentWillUnmount() {
    this.props.model.removeOnUpdate(this._setModelData);
  }

  render() {
    return (
      <div className="app">
        <header>
          <h1>
            MQTT Monitor&nbsp;
            <Indicator on={this.state.modelData.connected} />
          </h1>
        </header>
        <main>
          <SessionsList model={this.props.model} />
        </main>
      </div>
    );
  }
}
