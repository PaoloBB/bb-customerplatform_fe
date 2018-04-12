import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { reduxForm, Field, propTypes, fieldPropTypes } from 'redux-form';
import { provideHooks } from 'redial';

const Input = ({
  input, label, type, meta: { touched, error }
}) => (
  <div className={`form-group ${error && touched ? 'has-error' : ''}`}>
    <label htmlFor={input.name}>{label}</label>
    <div>
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

const hoc = compose(
  reduxForm({
    form: 'searchForm'
  })
)



class SearchForm extends Component {
  render() {
    return (
      <form className="form-inline" onSubmit={this.props.handleSubmit}>
        <Field name="keywords" type="text" component={Input} label="Search" />
        {this.props.children}
      </form>
    );
  }
}

export default hoc(SearchForm);
