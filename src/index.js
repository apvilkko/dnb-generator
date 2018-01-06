import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import init, {actions} from './dnb';
import store from './store';

init();

ReactDOM.render(
  <App store={store} actions={actions} />,
  document.getElementById('root')
);
registerServiceWorker();
