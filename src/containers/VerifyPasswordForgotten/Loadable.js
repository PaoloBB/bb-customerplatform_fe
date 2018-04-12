import React from 'react';
import Loadable from 'react-loadable';

const VerifyPasswordForgottenLoadable = Loadable({
  loader: () => import('./VerifyPasswordForgotten' /* webpackChunkName: 'verify-password-forgotten' */),
  loading: () => <div>Loading</div>
});

export default VerifyPasswordForgottenLoadable;
