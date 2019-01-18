import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Grid, Image } from "semantic-ui-react";
import {
  EhLayoutHeader,
  EhHeaderMenu,
  EhAlertModal,
  showModal
} from "prism-react";
import { Session } from "eh-mortar";

export class LayoutHeader extends React.Component {
  state = {
    signingOut: false
  };

  static propTypes = {
    user: PropTypes.object
  };

  render() {
    let { user } = this.props;

    const logo = (
      <Link to="/">
        <Image
          alt="Identifi User Admin"
          src="images/Identifi_Admin_Tools.svg"
        />
      </Link>
    );

    const appControls = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={9} />
          <Grid.Column width={3} textAlign="left" />
        </Grid.Row>
      </Grid>
    );

    const platformControls = (
      <React.Fragment>
        <EhHeaderMenu
          icon="user circle"
          header={user.firstName + " " + user.lastName}
          items={[
            {
              display: "Sign Out",
              onClick: () => {
                let closeModal = showModal(
                  <EhAlertModal
                    heading="Are you sure you want to sign out?"
                    buttons={[
                      {
                        content: "Cancel",
                        onClick: () => {
                          if (!this.state.signingOut) {
                            closeModal();
                          }
                        }
                      },
                      {
                        content: "Sign out",
                        negative: true,
                        onClick: async () => {
                          if (!this.state.signingOut) {
                            this.setState({ signingOut: true });
                            await Session.end();
                          }
                        }
                      }
                    ]}
                  />
                );
              }
            }
          ]}
        />
      </React.Fragment>
    );

    return (
      <EhLayoutHeader
        logo={logo}
        appControls={appControls}
        platformControls={platformControls}
      />
    );
  }
}

export default connect(
  state => ({ user: state.domain.auth.userProfile }),
  null
)(LayoutHeader);
