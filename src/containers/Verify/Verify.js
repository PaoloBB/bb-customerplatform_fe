import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { provideHooks } from 'redial';
import Helmet from 'react-helmet';
import { verify } from 'redux/modules/auth';
import * as notifActions from 'redux/modules/notifs';

const hoc = compose(
  provideHooks({
    defer: async ({ store: { dispatch }, params }) => {
      await dispatch(verify(params.hash)).catch(() => null);
    }
  }),
  connect(state => ({ verifiedUser: state.auth.verifiedUser, verifying: state.auth.verifying }), notifActions)
)



class Verify extends Component {
  static propTypes = {
    verifiedUser: PropTypes.func,
    verifying: PropTypes.bool
  };
  static defaultProps = {
    verifiedUser: null,
    verifying: true
  };
  render() {
    const { verifiedUser, verifying } = this.props;
    return (
      <React.Fragment>
        <div className="container">
          <Helmet title="Verify" />
          {!verifying ? (
            <React.Fragment>
              {verifiedUser && verifiedUser.email ? (
                <React.Fragment>
                  <h1>User verified</h1>
                  <p>
                    Thank you for confirming your access through your email <strong>{verifiedUser.email}</strong>
                  </p>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <h1>Error during user verification</h1>
                  <p>
                    We could not find the user who's trying to confirm the account. It might have already been
                    confifmed.
                  </p>
                </React.Fragment>
              )}
            </React.Fragment>
          ) : (
            <div>loading</div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default hoc(Verify);
