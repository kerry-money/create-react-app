import thunk from 'redux-thunk';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import immutableStateInvariant from 'redux-immutable-state-invariant';
import domain from './ducks';
import { APP_SETTINGS, RequestInterceptor } from 'eh-mortar';

import { createHttpClient } from 'eh-walls';

import app from 'eh-mortar/lib/ducks';

export const reducers = combineReducers({
  app,
  domain,
});

function setupStore() {
  const identifiServicesClient = createHttpClient(
    APP_SETTINGS.identifiServices,
    null,
    RequestInterceptor
  );

  let middlewares = [];

  middlewares.push(
    thunk.withExtraArgument({
      identifiServicesClient,
    })
  );

  let composeEnhancers = compose;
  if (process.env.NODE_ENV === 'development') {
    middlewares.push(immutableStateInvariant());
    composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION__']
      ? window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']
      : compose;
  }

  const enhancer = composeEnhancers(applyMiddleware(...middlewares));

  const store = createStore(reducers, {}, enhancer);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('scripts/ducks', () => {
      let newDuck = require('scripts/ducks').default;
      const nextRootReducer = combineReducers({
        app,
        domain: newDuck,
      });
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}

export const store = setupStore();
