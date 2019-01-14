import React from 'react';
import ReactDOM from 'react-dom';

import { RouteConfig } from './route-config';
import { store } from './createStore';

// Do not change APP_SETTINGS import to react-core,
// we are adding the moduleId for this app
import APP_SETTINGS from './app-settings';

import { EhAppRoot } from 'eh-walls';
import { Logger, Session } from 'eh-mortar';

import localStorageLogStore from './createLocalStorageLogStore';
import * as serviceWorker from './serviceWorker';

Logger.initialize({
  onMessageReceived: entry => {
    localStorageLogStore.log(entry);
  },
});

Session.bootstrap({
  authority: APP_SETTINGS.idpUrl,
  client_id: APP_SETTINGS.idpClientId,
  scope: APP_SETTINGS.idpRequiredScopes,
});

ReactDOM.render(
  <EhAppRoot store={store}>
    <RouteConfig />
  </EhAppRoot>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
