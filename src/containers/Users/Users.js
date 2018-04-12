import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { provideHooks } from 'redial';
import { connect } from 'react-redux';
import reducer, * as userActions from 'redux/modules/users';
import { compose } from 'recompose';
import { getUsers } from 'redux/selectors/users';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { reduxForm, Field, propTypes, fieldPropTypes } from 'redux-form';
import SearchForm from './UserSearchForm';
import organizationsReducer, * as organizationsActions from 'redux/modules/organizations';
import rolesReducer, * as rolesActions from 'redux/modules/roles';
import * as filterActions from 'redux/modules/filters';
import userPaginationReducer, * as paginationActions from 'redux/modules/pagination';
import Pagination from 'components/Pagination/Pagination';
const { loadAll: loadUsers } = userActions;
const { loadAll: loadOrganizations } = organizationsActions;
const { loadAll: loadRoles } = rolesActions;

const Select = ({
  children, input, label, type, meta: { touched, error }
}) => (
  <div className={`form-group ${error && touched ? 'has-error' : ''}`}>
    <label htmlFor={input.name}>{label}</label>
    <div>
      <select {...input} type={type} className="form-control">
        {children}
      </select>
      {error && touched && <span className="glyphicon glyphicon-remove form-control-feedback" />}
      {error &&
        touched && (
        <div className="text-danger">
          <strong>{error}</strong>
        </div>
      )}
    </div>
  </div>
);

const hoc = compose(
  provideHooks({
    defer: ({ store: { dispatch, getState, inject } }) => {
      inject({ users: reducer, organizations: organizationsReducer, roles: rolesReducer });
      const state = getState();
      const promises = [dispatch(loadUsers()).catch(() => null)];
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
      users: getUsers(state, 20),
      roles: state.roles.data,
      organizations: state.organizations.data,
      hasManageOrganizations: state.auth.user.permissions.indexOf('manageOrganizations') > -1,
      editing: state.users.editing,
      error: state.users.error,
      loading: state.users.loading,
      filterUser: state.filters.users,
      page: state.pagination.users || 1
    }),
    { ...userActions, ...filterActions, ...paginationActions }
  )
)


class Users extends Component {
  static propTypes = {
    users: PropTypes.arrayOf(PropTypes.object),
    error: PropTypes.string,
    loading: PropTypes.bool,
    remove: PropTypes.func.isRequired,
    organizations: PropTypes.array.isRequired,
    roles: PropTypes.array.isRequired
  };

  static defaultProps = {
    users: [],
    error: null,
    loading: false
  };

  constructor(props) {
    super(props);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);

    this.state = {
      show: false,
      toDelete: null
    };
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleDelete = async () => {
    await this.remove(this.state.toDelete);
    this.handleClose();
  };

  handleShow(toDelete) {
    this.setState({ show: true, toDelete });
  }

  remove = async id => {
    const result = await this.props.remove(id);
    return result;
  };

  changeFilter = filter => {
    this.props.setUsersPage(1);
    this.props.setUsersFilter(filter);
  };

  handleChangePage = page => {
    this.props.setUsersPage(page);
  };

  render() {
    const Button = ({ id, handleClick }) => {
      const _handleClick = () => {
        handleClick(id);
      };
      return (
        <button className="btn btn-danger" onClick={_handleClick}>
          <i className="fa fa-remove" /> Delete
        </button>
      );
    };

    const {
      users, error, loading, organizations, hasManageOrganizations
    } = this.props;

    const styles = require('./Users.scss');

    return (
      <React.Fragment>
        <div className={`${styles.users} container`}>
          <h1>
            Users
            <Link to="/add-user">
              <button className={`${styles.refreshBtn} btn btn-success pull-right`}>
                <i className={`fa fa-user-plus ${loading ? ' fa-spin' : ''}`} /> Add User
              </button>
            </Link>
          </h1>
          <Helmet title="Users" />
          {error && (
            <div className="alert alert-danger" role="alert">
              <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true" /> {error}
            </div>
          )}
          <React.Fragment>
            <SearchForm onChange={this.changeFilter} initialValues={this.props.filterUser}>
              {organizations &&
                hasManageOrganizations && (
                <Field name="organization" type="select" component={Select} label="Organization">
                  <option value="">Select an organization</option>
                  {organizations &&
                      organizations.map(organization => (
                        <option key={organization.id} value={organization.id}>
                          {organization.name}
                        </option>
                      ))}
                </Field>
              )}
            </SearchForm>
            {!users.loading && (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th className={styles.idCol}>ID</th>
                    <th className={styles.nameCol}>Name</th>
                    <th className={styles.buttonCol} />
                  </tr>
                </thead>
                <tbody>
                  {users.data.map(user => (
                    <tr key={user.id}>
                      <td className={styles.idCol}>{user.id}</td>
                      <td className={styles.colorCol}>{user.name}</td>
                      <td className={styles.buttonCol}>
                        <div className="pull-right">
                          <Link to={`/edit-user/${user.id}`}>
                            <button className="btn btn-primary">
                              <i className="fa fa-pencil" />Edit
                            </button>
                          </Link>
                          <Button id={user.id} handleClick={this.handleShow} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <Pagination handleChangePage={this.handleChangePage} pages={users.total_pages} active={this.props.page} />
          </React.Fragment>
        </div>
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Are you sure you want to delete?</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <button className="btn btn-primary" onClick={this.handleClose}>
              NO
            </button>
            <button className="btn btn-danger" onClick={this.handleDelete}>
              YES
            </button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}

export default hoc(Users);
