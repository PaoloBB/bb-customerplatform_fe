import React from 'react';
import Loadable from 'react-loadable';

const PasswordForgottenLoadable = Loadable({
  loader: () => import('./PasswordForgotten' /* webpackChunkName: 'password-forgotten' */),
  loading: () => <div>Loading</div>
});

export default PasswordForgottenLoadable;
