import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { provideHooks } from 'redial';
import Helmet from 'react-helmet';
import { compose } from 'recompose'; 
import OrganizationForm from 'components/OrganizationForm/OrganizationForm';
import reducer, * as organizationActions from 'redux/modules/organizations';
import * as notifActions from 'redux/modules/notifs';
import { Link } from 'react-router-dom';

const { load: loadOrganization } = organizationActions;

const hoc = compose(
  provideHooks({
    fetch: async ({ store: { dispatch, inject, getState }, params: { id } }) => {
      inject({ organizations: reducer });
      const state = getState();
      if (state.online) {
        return dispatch(loadOrganization(id)).catch(() => null);
      }
    }
  }),
  connect(
    state => ({
      organizations: state.organizations.data
    }),
    { ...notifActions, ...organizationActions }
  )
)



class EditOrganization extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired,
    organizations: PropTypes.array.isRequired,
    notifSend: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired
  };

  getInitialValues = () => this.props.organizations;

  edit = async data => {
    const result = await this.props.save(data);
    this.successEdit();
    return result;
  };

  successEdit = () => {
    this.props.notifSend({
      message: 'Organization edited successfully !',
      kind: 'success',
      dismissAfter: 2000
    });
    this.props.history.push('/organizations');
  };

  render() {
    const { organizations } = this.props;
    return (
      <div className="container">
        <Helmet title="Edit Organization" />
        <h1>
          Edit Organization<Link to="/organizations">
            <button className="btn btn-primary pull-right">
              <i className="fa fa fa-angle-left" /> back
            </button>
          </Link>
        </h1>
        {organizations && <OrganizationForm edit onSubmit={this.edit} initialValues={this.getInitialValues()} />}
      </div>
    );
  }
}

export default hoc(EditOrganization);
