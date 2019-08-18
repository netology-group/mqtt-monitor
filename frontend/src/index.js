import React from 'react';
import ReactDOM from 'react-dom';

import * as serviceWorker from './serviceWorker';
import App from './components/App';
import AppModel from './model/App';
import WsEventsListener from './WsEventsListener';

import './index.css';

const WS_URL = function () {
  // Custom value from REACT_APP_WS_URL passed through <meta name="ws-url" /> tag.
  const metaWsUrlTag = document.head.querySelector("meta[name~=ws-url][content]");
  if (metaWsUrlTag && metaWsUrlTag.content !== '') return metaWsUrlTag.content;

  // Default value: ws://CURRENT_BASE_URL/ws
  var ws_url = new URL('/ws', window.location.href);
  ws_url.protocol = ws_url.protocol.replace('http', 'ws');
  return ws_url;
}();

const model = new AppModel();
const wsEventsListener = new WsEventsListener(WS_URL, model);

ReactDOM.render(
  <App model={model} wsEventsListener={wsEventsListener} />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
