import React, { Component } from 'react';
import { reduxForm, Field, propTypes, fieldPropTypes } from 'redux-form';
import { compose, withProps } from 'recompose';
import passwordChangeValidation from './passwordChangeValidation';


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
  withProps(({ token }) => ({
    initialValues: {
      token
    }
  })),
  reduxForm({
    form: 'passwordChange',
    validate: passwordChangeValidation
  })
)
class PasswordChangeForm extends Component {
  static propTypes = {
    ...propTypes
  };

  render() {
    const { handleSubmit, error } = this.props;
    return (
      <form className="form-horizontal" onSubmit={handleSubmit}>
        <Field name="password" type="password" component={Input} label="Password" />
        <Field name="token" type="hidden" component={Input} />
        {error && (
          <p className="text-danger">
            <strong>{error}</strong>
          </p>
        )}
        <button className="btn btn-success" type="submit">
          <i className="fa fa-sign-in" />Change
        </button>
      </form>
    );
  }
}

export default hoc(PasswordChangeForm);
