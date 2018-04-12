import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import Helmet from 'react-helmet';
import PasswordForgottenForm from 'components/PasswordForgottenForm/PasswordForgottenForm';
import * as authActions from 'redux/modules/auth';
import * as notifActions from 'redux/modules/notifs';

const hoc = compose(
  connect(() => ({}), { ...notifActions, ...authActions })
)


class PasswordForgotten extends Component {
  static propTypes = {
    location: PropTypes.shape({
      state: PropTypes.object
    }).isRequired,
    passwordForgotten: PropTypes.func.isRequired,
    notifSend: PropTypes.func.isRequired
  };

  getInitialValues = () => {
    const { location } = this.props;
    return location.state && location.state.oauth;
  };

  sendEmail = async data => {
    const result = await this.props.passwordForgotten(data.email);
    this.successPasswordForgotten();
    return result;
  };

  successPasswordForgotten = () => {
    this.props.notifSend({
      message: 'Email sent !',
      kind: 'success',
      dismissAfter: 2000
    });
  };

  render() {
    return (
      <div className="container">
        <Helmet title="Register" />
        <h1>Password Forgotten</h1>
        <PasswordForgottenForm onSubmit={this.sendEmail} initialValues={this.getInitialValues()} />
      </div>
    );
  }
}

export default hoc(PasswordForgotten);
