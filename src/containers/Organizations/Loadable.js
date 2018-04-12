import React from 'react';
import Loadable from 'react-loadable';

const OrganizationsLoadable = Loadable({
  loader: () => import('./Organizations' /* webpackChunkName: 'organizations' */),
  loading: () => <div>Loading</div>
});

export default OrganizationsLoadable;
