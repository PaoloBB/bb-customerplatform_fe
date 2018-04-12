import React, { Component } from 'react';
import { reduxForm, Field, propTypes, fieldPropTypes } from 'redux-form';
import userValidation from './userValidation';

const Input = ({
  input, label, type, meta: { touched, error }
}) => (
  <div className={`form-group ${error && touched ? 'has-error' : ''}`}>
    <label htmlFor={input.name} className="col-sm-2">
      {label}
    </label>
    <div className="col-sm-10">
      <input {...input} type={type} className="form-control" />
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

const Select = ({
  children, input, label, type, meta: { touched, error }
}) => (
  <div className={`form-group ${error && touched ? 'has-error' : ''}`}>
    <label htmlFor={input.name} className="col-sm-2">
      {label}
    </label>
    <div className="col-sm-10">
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

Input.propTypes = fieldPropTypes;
Select.propTypes = fieldPropTypes;

@reduxForm({
  form: 'userForm',
  validate: userValidation
})
export default class UserForm extends Component {
  static propTypes = {
    ...propTypes
  };

  render() {
    const {
      handleSubmit, error, roles, organizations, hasManageOrganizations, hasManageUsers
    } = this.props;
    return (
      <form className="form-horizontal" onSubmit={handleSubmit}>
        <Field name="name" type="text" component={Input} label="Name" />
        <Field name="email" type="text" component={Input} label="Email" />
        <Field name="password" type="password" component={Input} label="Password" />
        <Field name="password_confirmation" type="password" component={Input} label="Password confirmation" />
        {hasManageOrganizations && (
          <Field name="idOrganization" type="select" component={Select} label="Organization">
            <option value="">Select an organization</option>
            {organizations &&
              organizations.map(organization => (
                <option key={organization.id} value={organization.id}>
                  {organization.name}
                </option>
              ))}
          </Field>
        )}
        {hasManageUsers && (
          <Field name="role" type="select" component={Select} label="Role">
            <option value="">Select a role</option>
            {roles &&
              roles.map(role => (
                <option key={role.id} value={role.role}>
                  {role.role}
                </option>
              ))}
          </Field>
        )}
        {hasManageUsers && <Field name="isEnabled" type="checkbox" component={Input} label="Enabled" />}
        {error && (
          <p className="text-danger">
            <strong>{error}</strong>
          </p>
        )}
        <button className="btn btn-success" type="submit">
          <i className="fa fa-sign-in" /> User
        </button>
      </form>
    );
  }
}
