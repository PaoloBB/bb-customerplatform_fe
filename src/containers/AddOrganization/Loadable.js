import React from 'react';
import Loadable from 'react-loadable';

const AddOrganizationLoadable = Loadable({
  loader: () => import('./AddOrganization' /* webpackChunkName: 'addOrganization' */),
  loading: () => <div>Loading</div>
});

export default AddOrganizationLoadable;
