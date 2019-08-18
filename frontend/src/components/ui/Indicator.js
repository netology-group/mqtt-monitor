import React from 'react';

import './Indicator.css';

export default class Indicator extends React.Component {
  render() {
    const klass = `indicator indicator-${this.props.on ? 'on' : 'off'}`;
    return (<span className={klass}>&#9679;</span>);
  }
}
