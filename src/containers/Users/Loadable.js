import React from 'react';
import Loadable from 'react-loadable';

const UsersLoadable = Loadable({
  loader: () => import('./Users' /* webpackChunkName: 'users' */),
  loading: () => <div>Loading</div>
});

export default UsersLoadable;
