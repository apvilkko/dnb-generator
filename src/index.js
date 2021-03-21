import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import init, {actions} from './dnb';
import store from './store';

const isProd = process.env.NODE_ENV === 'production'
init(isProd);
const acts = actions(isProd)

ReactDOM.render(
  <App store={store} actions={acts} />,
  document.getElementById('root')
);
registerServiceWorker();
