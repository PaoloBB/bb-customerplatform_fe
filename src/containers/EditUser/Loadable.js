import React from 'react';
import Loadable from 'react-loadable';

const EditUserLoadable = Loadable({
  loader: () => import('./EditUser' /* webpackChunkName: 'editUser' */),
  loading: () => <div>Loading</div>
});

export default EditUserLoadable;
