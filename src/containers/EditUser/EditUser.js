import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { provideHooks } from 'redial';
import Helmet from 'react-helmet';
import { compose } from 'recompose'; 
import UserForm from 'components/UserForm/UserForm';
import userReducer, * as userActions from 'redux/modules/users';
import rolesReducer, * as rolesActions from 'redux/modules/roles';
import organizationsReducer, * as organizationsActions from 'redux/modules/organizations';
import * as notifActions from 'redux/modules/notifs';
import { Link } from 'react-router-dom';

const { load: loadUser } = userActions;
const { loadAll: loadOrganizations } = organizationsActions;
const { loadAll: loadRoles } = rolesActions;


const hoc = compose(
  provideHooks({
    defer: async ({ store: { dispatch, inject, getState }, params: { id } }) => {
      inject({ users: userReducer, organizations: organizationsReducer, roles: rolesReducer });
      const state = getState();
      const promises = [dispatch(loadUser(id)).catch(() => null)];
      if (state.auth.user.permissions.indexOf('manageOrganizations') > -1) {
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
      users: state.users.user,
      organizations: state.organizations.data,
      hasManageOrganizations: state.auth.user.permissions.indexOf('manageOrganizations') > -1,
      hasManageUsers: state.auth.user.permissions.indexOf('manageUsers') > -1
    }),
    { ...notifActions, ...userActions }
  )
)



class EditUser extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired,
    save: PropTypes.func.isRequired,
    notifSend: PropTypes.func.isRequired,
    users: PropTypes.array.isRequired,
    organizations: PropTypes.array.isRequired,
    roles: PropTypes.array.isRequired
  };

  getInitialValues = () => this.props.users;

  edit = async data => {
    const result = await this.props.save(data);
    this.successEdit();
    return result;
  };

  successEdit = () => {
    this.props.notifSend({
      message: 'User edited successfully !',
      kind: 'success',
      dismissAfter: 2000
    });
    this.props.history.push('/users');
  };

  render() {
    return (
      <div className="container">
        <Helmet title="Edit User" />
        <h1>
          Edit User<Link to="/users">
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
          edit
          onSubmit={this.edit}
          initialValues={this.getInitialValues()}
        />
      </div>
    );
  }
}

export default hoc(EditUser);
