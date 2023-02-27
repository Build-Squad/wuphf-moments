import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

var W3CWebSocket = require('websocket').w3cwebsocket;

var client = new W3CWebSocket('ws://localhost:8080/', 'echo-protocol');

client.onerror = function () {
  console.log('Connection Error');
};

client.onopen = function () {
  console.log('WebSocket Client Connected');

  if (client.readyState === client.OPEN) {
    client.send('0x231f3c0ba6e496a9');
  }
};

client.onclose = function () {
  console.log('echo-protocol Client Closed');
};

client.onmessage = function (e: any) {
  if (typeof e.data === 'string') {
    console.log('Received: \'' + e.data + '\'');
  }
};

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
