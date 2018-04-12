import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import Helmet from 'react-helmet';
import OrganizationForm from 'components/OrganizationForm/OrganizationForm';
import * as organizationActions from 'redux/modules/organizations';
import * as notifActions from 'redux/modules/notifs';
import { Link } from 'react-router-dom';



const hoc = compose(
  connect(() => ({}), { ...notifActions, ...organizationActions })
)


class AddOrganization extends Component {
  static propTypes = {
    location: PropTypes.shape({
      state: PropTypes.object
    }).isRequired,
    add: PropTypes.func.isRequired,
    notifSend: PropTypes.func.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired
  };

  getInitialValues = () => {
    const { location } = this.props;
    return location.state && location.state.oauth;
  };

  addOrganization = async data => {
    const result = await this.props.add(data);
    this.successAddOrganization();
    return result;
  };

  successAddOrganization = () => {
    this.props.notifSend({
      message: 'Organization added successfully !',
      kind: 'success',
      dismissAfter: 2000
    });
    this.props.history.push('/organizations');
  };

  render() {
    return (
      <div className="container">
        <Helmet title="Add Organization" />
        <h1>
          Add Organization<Link to="/organizations">
            <button className="btn btn-primary pull-right">
              <i className="fa fa fa-angle-left" /> back
            </button>
          </Link>
        </h1>
        <OrganizationForm onSubmit={this.addOrganization} />
      </div>
    );
  }
}

export default hoc(AddOrganization);
