import React from 'react';
import Loadable from 'react-loadable';

const VerifyLoadable = Loadable({
  loader: () => import('./Verify' /* webpackChunkName: 'verify' */),
  loading: () => <div>Loading</div>
});

export default VerifyLoadable;
