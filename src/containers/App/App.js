import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { push } from 'react-router-redux';
import { compose } from 'recompose'; 
import { renderRoutes } from 'react-router-config';
import { provideHooks } from 'redial';
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/lib/Navbar';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import Alert from 'react-bootstrap/lib/Alert';
import Helmet from 'react-helmet';
import { isLoaded as isInfoLoaded, load as loadInfo } from 'redux/modules/info';
import { isLoaded as isAuthLoaded, load as loadAuth, logout } from 'redux/modules/auth';
import { Notifs, InfoBar } from 'components';
import config from 'env';

const hoc = compose(
  provideHooks({
    fetch: async ({ store: { dispatch, getState } }) => {
      if (!isAuthLoaded(getState())) {
        await dispatch(loadAuth()).catch(() => null);
      }
      if (!isInfoLoaded(getState())) {
        await dispatch(loadInfo()).catch(() => null);
      }
    }
  }),
  connect(
    state => ({
      notifs: state.notifs,
      user: state.auth.user
    }),
    { logout, pushState: push }
  ),
  withRouter
)


class App extends Component {
  static propTypes = {
    route: PropTypes.objectOf(PropTypes.any).isRequired,
    location: PropTypes.objectOf(PropTypes.any).isRequired,
    user: PropTypes.shape({
      email: PropTypes.string
    }),
    notifs: PropTypes.shape({
      global: PropTypes.array
    }).isRequired,
    logout: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired
  };

  static defaultProps = {
    user: null
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      // login
      const redirect = this.props.location.query && this.props.location.query.redirect;
      this.props.pushState(redirect || '/login-success');
    } else if (this.props.user && !nextProps.user) {
      // logout
      this.props.pushState('/');
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  handleLogout = event => {
    event.preventDefault();
    this.props.logout();
  };

  render() {
    const { user, notifs, route } = this.props;
    const styles = require('./App.scss');
    return (
      <div className={styles.app}>
        <Helmet {...config.app.head} />
        <Navbar fixedTop>
          <Navbar.Header>
            <Navbar.Brand>
              <IndexLinkContainer to="/" activeStyle={{ color: '#33e0ff' }} className={styles.title}>
                <div className={styles.brand}>
                  <span />
                </div>
              </IndexLinkContainer>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>

          <Navbar.Collapse>
            <Nav navbar>
              {!user && (
                <LinkContainer to="/login">
                  <NavItem>Login</NavItem>
                </LinkContainer>
              )}
              {user &&
                user.permissions.indexOf('manageOrganizations') > -1 && (
                <LinkContainer to="/organizations">
                  <NavItem className="logout-link">Organizations</NavItem>
                </LinkContainer>
              )}
              {user &&
                user.permissions.indexOf('manageUsers') > -1 && (
                <LinkContainer to="/users">
                  <NavItem className="logout-link">Users</NavItem>
                </LinkContainer>
              )}
              {user && (
                <LinkContainer to="/reports">
                  <NavItem className="logout-link">Reports</NavItem>
                </LinkContainer>
              )}
              {user && (
                <LinkContainer to="/insights">
                  <NavItem className="logout-link">Insights</NavItem>
                </LinkContainer>
              )}
            </Nav>
            <Nav pullRight>
              {user && (
                <NavDropdown title={user.name} id="basic-nav-dropdown" className="pull-right">
                  <LinkContainer to="/logout">
                    <MenuItem className="logout-link" onClick={this.handleLogout}>
                      Logout
                    </MenuItem>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <div className={styles.appContent}>
          {notifs.global && (
            <div className="container">
              <Notifs
                className={styles.notifs}
                namespace="global"
                NotifComponent={props => <Alert bsStyle={props.kind}>{props.message}</Alert>}
              />
            </div>
          )}

          {renderRoutes(route.routes)}
        </div>
        <InfoBar />
        <div className="well text-center">here's the footer</div>
      </div>
    );
  }
}

export default hoc(App);
