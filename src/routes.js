import { routerActions } from 'react-router-redux';
import { connectedReduxRedirect } from 'redux-auth-wrapper/history4/redirect';
import { App, Home, NotFound } from 'containers';

import Organizations from 'containers/Organizations/Loadable';
import Users from 'containers/Users/Loadable';
import AddUser from 'containers/AddUser/Loadable';
import EditUser from 'containers/EditUser/Loadable';
import AddOrganization from 'containers/AddOrganization/Loadable';
import EditOrganization from 'containers/EditOrganization/Loadable';
import Login from 'containers/Login/Loadable';
import LoginSuccess from 'containers/LoginSuccess/Loadable';
import Verify from 'containers/Verify/Loadable';
import VerifyPasswordForgotten from 'containers/VerifyPasswordForgotten/Loadable';

import PasswordForgotten from 'containers/PasswordForgotten/Loadable';

const isAuthenticated = connectedReduxRedirect({
  redirectPath: '/login',
  authenticatedSelector: state => state.auth.user !== null,
  redirectAction: routerActions.replace,
  wrapperDisplayName: 'UserIsAuthenticated'
});

const isNotAuthenticated = connectedReduxRedirect({
  redirectPath: '/',
  authenticatedSelector: state => state.auth.user === null,
  redirectAction: routerActions.replace,
  wrapperDisplayName: 'UserIsAuthenticated',
  allowRedirectBack: false
});

const hasRole = param => {
  const roles = param.constructor === Array ? param : [param];
  return connectedReduxRedirect({
    redirectPath: '/',
    authenticatedSelector: state => state.auth.user && roles.indexOf(state.auth.user.role) > -1,
    redirectAction: routerActions.replace,
    wrapperDisplayName: 'UserHasRole',
    allowRedirectBack: false
  });
};

const isSuperAdmin = hasRole(['superadmin']);
const isAdmin = hasRole(['superadmin', 'admin']);
const routes = [
  {
    component: App,
    routes: [
      { path: '/', exact: true, component: Home },
      { path: '/login/verify/:hash', component: isNotAuthenticated(Verify) },
      { path: '/login/reset/:hash', component: isNotAuthenticated(VerifyPasswordForgotten) },
      { path: '/login', component: Login },
      { path: '/organizations', component: isSuperAdmin(isAuthenticated(Organizations)) },
      { path: '/add-organization', component: isSuperAdmin(isAuthenticated(AddOrganization)) },
      { path: '/edit-organization/:id', component: isSuperAdmin(isAuthenticated(EditOrganization)) },
      { path: '/users', component: isAdmin(isAuthenticated(Users)) },
      { path: '/add-user', component: isAdmin(isAuthenticated(AddUser)) },
      { path: '/edit-user/:id', component: isAdmin(isAuthenticated(EditUser)) },

      { path: '/login-success', component: isAuthenticated(LoginSuccess) },
      { path: '/password-forgotten', component: isNotAuthenticated(PasswordForgotten) },
      { component: NotFound }
    ]
  }
];

export default routes;
