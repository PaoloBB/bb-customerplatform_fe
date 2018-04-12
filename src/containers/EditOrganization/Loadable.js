import React from 'react';
import Loadable from 'react-loadable';

const RegisterLoadable = Loadable({
  loader: () => import('./EditOrganization' /* webpackChunkName: 'editOrganization' */),
  loading: () => <div>Loading</div>
});

export default RegisterLoadable;
