import React from 'react';
import '../styles/Tabs.css';

export class Tab extends React.Component { }

export class Tabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeTab: props.children[0] };
  }

  render() {
    return (
      <div className="tabs">
        <ul className="tabs-toggler">{this._renderTabs()}</ul>
        <div className="active-tab">{this.state.activeTab.props.children}</div>
      </div>
    );
  }

  _renderTabs() {
    return this.props.children.map(tab => {
      const klass = tab === this.state.activeTab ? 'active' : null;

      return (
        <li className={klass} onClick={() => this._handleToggle(tab)}>
          {tab.props.title}
        </li>
      )
    });
  }

  _handleToggle(tab) {
    this.setState(state => ({ ...state, activeTab: tab }));
  }
}

