import { routerReducer } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import auth from './modules/auth';
import notifs from './modules/notifs';
import filters from './modules/filters';
import pagination from './modules/pagination';

import info from './modules/info';

export default function createReducers(asyncReducers) {
  return {
    router: routerReducer,
    online: (v = true) => v,
    form,
    notifs,
    filters,
    pagination,
    auth,
    info,
    ...asyncReducers
  };
}
