import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { provideHooks } from 'redial';
import Helmet from 'react-helmet';
import { compose } from 'recompose'; 
import UserForm from 'components/UserForm/UserForm';
import * as authActions from 'redux/modules/auth';
import * as notifActions from 'redux/modules/notifs';
import rolesReducer, * as rolesActions from 'redux/modules/roles';
import organizationsReducer, * as organizationsActions from 'redux/modules/organizations';
import { Link } from 'react-router-dom';

const { loadAll: loadOrganizations } = organizationsActions;
const { loadAll: loadRoles } = rolesActions;

const hoc = compose(
  provideHooks({
    defer: async ({ store: { dispatch, inject, getState } }) => {
      inject({ organizations: organizationsReducer, roles: rolesReducer });
      const state = getState();
      const promises = [];
      if (state.online && state.auth.user.permissions.indexOf('manageOrganizations') > -1) {
        promises.push(dispatch(loadOrganizations()).catch(() => null));
      }
      if (state.online && state.auth.user.permissions.indexOf('manageUsers') > -1) {
        promises.push(dispatch(loadRoles()).catch(() => null));
      }
      return Promise.all(promises);
    }
  }),
  connect(
    state => ({
      roles: state.roles.data,
      organizations: state.organizations.data,
      hasManageOrganizations: state.auth.user.permissions.indexOf('manageOrganizations') > -1,
      hasManageUsers: state.auth.user.permissions.indexOf('manageUsers') > -1
    }),
    { ...notifActions, ...authActions }
  )
)

class AddUser extends Component {
  static propTypes = {
    location: PropTypes.shape({
      state: PropTypes.object
    }).isRequired,
    register: PropTypes.func.isRequired,
    notifSend: PropTypes.func.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired,
    organizations: PropTypes.array.isRequired,
    roles: PropTypes.array.isRequired
  };

  getInitialValues = () => {
    const { location } = this.props;
    return location.state && location.state.oauth;
  };

  addUser = async data => {
    const result = await this.props.register(data);
    this.successAddUser();
    return result;
  };

  successAddUser = () => {
    this.props.notifSend({
      message: 'User added successfully !',
      kind: 'success',
      dismissAfter: 2000
    });
    this.props.history.push('/users');
  };

  render() {
    return (
      <div className="container">
        <Helmet title="Add User" />
        <h1>
          Add User<Link to="/users">
            <button className="btn btn-primary pull-right">
              <i className="fa fa fa-angle-left" /> back
            </button>
          </Link>
        </h1>

        <UserForm
          organizations={this.props.organizations}
          roles={this.props.roles}
          hasManageOrganizations={this.props.hasManageOrganizations}
          hasManageUsers={this.props.hasManageUsers}
          onSubmit={this.addUser}
          initialValues={this.getInitialValues()}
        />
      </div>
    );
  }
}

export default hoc(AddUser);
