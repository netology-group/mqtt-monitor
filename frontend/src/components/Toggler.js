import React from 'react';

export default class Toggler extends React.Component {
  render() {
    if (this.props.open) {
      return (<span className="toggler" onClick={() => this.props.onToggle(false)}>&minus;</span>);
    } else {
      return (<span className="toggler" onClick={() => this.props.onToggle(true)}>+</span>);
    }
  }
}
