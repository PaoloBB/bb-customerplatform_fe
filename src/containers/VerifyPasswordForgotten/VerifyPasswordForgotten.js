import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PasswordChangeForm from 'components/PasswordChangeForm/PasswordChangeForm';
import * as authActions from 'redux/modules/auth';
import * as notifActions from 'redux/modules/notifs';

const hoc = compose(
  connect(() => ({}), { ...notifActions, ...authActions })
)


class VerifyPasswordForgotten extends Component {
  static propTypes = {
    location: PropTypes.shape({
      state: PropTypes.object
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        hash: PropTypes.string.isRequired
      })
    }).isRequired,
    verifyPasswordForgotten: PropTypes.func.isRequired,
    notifSend: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { token: 0 };
  }
  componentWillMount() {
    this.setState({
      token: this.props.match.params.hash
    });
  }
  getInitialValues = () => {
    const { location } = this.props;
    return location.state && location.state.oauth;
  };

  changePassword = async data => {
    const result = await this.props.verifyPasswordForgotten(data);
    this.successPasswordForgottenReset();
    return result;
  };

  successPasswordForgottenReset = () => {
    this.props.notifSend({
      message: 'Password changed !',
      kind: 'success',
      dismissAfter: 2000
    });
  };

  render() {
    return (
      <div className="container">
        <Helmet title="Change password" />
        <h1>Insert the new password</h1>
        <PasswordChangeForm
          token={this.state.token}
          onSubmit={this.changePassword}
          initialValues={this.getInitialValues()}
        />
      </div>
    );
  }
}

export default hoc(VerifyPasswordForgotten);
