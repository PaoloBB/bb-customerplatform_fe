import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import * as authActions from 'redux/modules/auth';

const hoc = compose(
  connect(state => ({ user: state.auth.user }), authActions)
)

 
class LoginSuccess extends Component {
  static propTypes = {
    user: PropTypes.shape({
      email: PropTypes.string
    }).isRequired,
    logout: PropTypes.func.isRequired
  };

  render() {
    const { user, logout } = this.props;
    return (
      user && (
        <div className="container">
          <h1>Login Success</h1>

          <div>
            <p>Welcome, {user.email}.</p>
            <div>
              <button className="btn btn-danger" onClick={logout}>
                <i className="fa fa-sign-out" /> Log Out
              </button>
            </div>
          </div>
        </div>
      )
    );
  }
}

export default hoc(LoginSuccess);