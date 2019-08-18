import React from 'react';

import Topic from './TopicsList/Topic';

import './TopicsList.css';

export default class TopicsList extends React.Component {
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
    const topics = this.state.modelData[this.props.modelDataKey];

    return (
      <ul className="topics">
        {topics.map(topic => <Topic key={topic.data.topic} model={topic} />)}
      </ul>
    );
  }
}
