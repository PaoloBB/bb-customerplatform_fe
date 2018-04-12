import React, { Component } from 'react';
import { compose } from 'recompose';
import { reduxForm, Field, propTypes, fieldPropTypes } from 'redux-form';
import organizationValidation from './organizationValidation';

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

Input.propTypes = fieldPropTypes;

const hoc = compose(
  reduxForm({
    form: 'organizationForm',
    validate: organizationValidation
  })
)


class RegisterForm extends Component {
  static propTypes = {
    ...propTypes
  };

  render() {
    const { handleSubmit, error, edit } = this.props;
    return (
      <form className="form-horizontal" onSubmit={handleSubmit}>
        <Field name="name" type="text" component={Input} label="Name" />
        {error && (
          <p className="text-danger">
            <strong>{error}</strong>
          </p>
        )}
        <button className="btn btn-success" type="submit">
          <i className="fa fa-sign-in" /> {edit ? 'Edit' : 'Add'}
        </button>
      </form>
    );
  }
}

export default hoc(RegisterForm);
