import React from 'react';
import Loadable from 'react-loadable';

const LoginSuccessLoadable = Loadable({
  loader: () => import('./LoginSuccess' /* webpackChunkName: 'login-success' */),
  loading: () => <div>Loading</div>
});

export default LoginSuccessLoadable;
