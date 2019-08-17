import _ from 'lodash';
import React from 'react';
import '../styles/Tabs.css';

export class Tab extends React.Component {}

export class Tabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeTab: props.children[0].props.id };
  }

  render() {
    const activeTab = _.find(this.props.children, t => {
      return t.props.id === this.state.activeTab;
    });

    return (
      <div className="tabs">
        <ul className="tabs-toggler">{this._renderTabs()}</ul>
        <div className="active-tab">{activeTab.props.children}</div>
      </div>
    );
  }

  _renderTabs() {
    return this.props.children.map((tab, idx) => {
      const klass = tab.props.id === this.state.activeTab ? 'active' : null;

      return (
        <li key={idx} className={klass} onClick={() => this._handleToggle(tab)}>
          {tab.props.title}
        </li>
      )
    });
  }

  _handleToggle(tab) {
    this.setState(state => ({ ...state, activeTab: tab.props.id }));
  }
}

