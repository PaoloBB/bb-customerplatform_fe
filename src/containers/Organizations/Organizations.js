import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { provideHooks } from 'redial';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import reducer, * as organizationActions from 'redux/modules/organizations';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';


const { loadAll: loadOrganizations } = organizationActions;

const hoc = compose(
  provideHooks({
    fetch: ({ store: { dispatch, inject } }) => {
      inject({ organizations: reducer });
      return dispatch(loadOrganizations()).catch(() => null);
    }
  }),
  connect(
    state => ({
      organizations: state.organizations.data,
      error: state.organizations.error,
      loading: state.organizations.loading
    }),
    organizationActions
  )
)


class Organizations extends Component {
  static propTypes = {
    organizations: PropTypes.arrayOf(PropTypes.object),
    error: PropTypes.string,
    loading: PropTypes.bool,
    remove: PropTypes.func.isRequired
  };

  static defaultProps = {
    organizations: null,
    error: null,
    loading: false
  };

  constructor(props) {
    super(props);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

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

    const { organizations, error, loading } = this.props;
    const styles = require('./Organizations.scss');

    return (
      <React.Fragment>
        <div className={`${styles.organizations} container`}>
          <h1>
            Organizations
            <Link to="/add-organization">
              <button className={`${styles.refreshBtn} btn btn-success pull-right`}>
                <i className={`fa fa-plus ${loading ? ' fa-spin' : ''}`} /> Add Organization
              </button>
            </Link>
          </h1>
          <Helmet title="Organizations" />
          {error && (
            <div className="alert alert-danger" role="alert">
              <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true" /> {error}
            </div>
          )}
          {organizations &&
            organizations.length && (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th className={styles.idCol}>ID</th>
                  <th className={styles.nameCol}>Name</th>
                  <th className={styles.buttonCol} />
                </tr>
              </thead>
              <tbody>
                {organizations.map(organization => (
                  <tr key={organization.id}>
                    <td className={styles.idCol}>{organization.id}</td>
                    <td className={styles.colorCol}>{organization.name}</td>

                    <td className={styles.buttonCol}>
                      <div className="pull-right">
                        <Link to={`/edit-organization/${organization.id}`}>
                          <button className="btn btn-primary">
                            <i className="fa fa-pencil" />Edit
                          </button>
                        </Link>
                        <Button id={organization.id} handleClick={this.handleShow} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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

export default hoc(Organizations);
