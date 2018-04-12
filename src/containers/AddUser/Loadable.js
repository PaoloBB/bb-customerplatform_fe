import React from 'react';
import Loadable from 'react-loadable';

const AddUserLoadable = Loadable({
  loader: () => import('./AddUser' /* webpackChunkName: 'addUser' */),
  loading: () => <div>Loading</div>
});

export default AddUserLoadable;
