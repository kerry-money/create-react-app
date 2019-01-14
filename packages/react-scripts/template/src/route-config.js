import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Layout from './layout/Layout';
import { createUnsavedConfirmation, CompleteAuthentication } from 'eh-walls';

export const RouteConfig = () => {
  return (
    <HashRouter getUserConfirmation={createUnsavedConfirmation()}>
      <Switch>
        <Route
          path="/complete-authentication"
          component={CompleteAuthentication}
        />
        <Route component={Layout} />
      </Switch>
    </HashRouter>
  );
};
