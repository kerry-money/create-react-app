import React from "react";
import { Route, Switch } from "react-router-dom";
import PropTypes from "prop-types";
import { Forbidden, SecureSession } from "eh-walls";
import { EhGlobalComponents } from "prism-react";
import axios from "axios";
import { connect } from "react-redux";
import { hasAccessSelector, APP_SETTINGS } from "eh-mortar";

import { getUserProfile } from "../logic";
import Header from "./Header";

// top margin is height of header; probably need to revisit header styling later as it
// has not been reviewed by design team

export class Layout extends React.Component {
  constructor() {
    super();

    this.onAuthenticateSuccess = this.onAuthenticateSuccess.bind(this);
    this.setAuthorizationToken = this.setAuthorizationToken.bind(this);
  }
  static propTypes = {
    getUserProfile: PropTypes.func,
    hasAccess: PropTypes.bool
  };

  componentDidUpdate() {
    !this.props.hasAccess &&
      window.location.replace(APP_SETTINGS.loginUrl + "/#/no-access");
  }

  async onAuthenticateSuccess() {
    await this.props.getUserProfile();
  }

  setAuthorizationToken(token) {
    axios.defaults.headers.common["Authorization"] = token;
  }

  render() {
    return (
      <SecureSession
        onSessionStart={this.onAuthenticateSuccess}
        setAuthorizationToken={this.setAuthorizationToken}
      >
        <Header />
        <Switch>
          <Route exact path="/" render={() => <div>Hello World!</div>} />
          <Route exact path="/forbidden" component={Forbidden} />
        </Switch>
        <EhGlobalComponents />
      </SecureSession>
    );
  }
}

export default connect(
  state => ({ hasAccess: hasAccessSelector(state) }),
  { getUserProfile }
)(Layout);
