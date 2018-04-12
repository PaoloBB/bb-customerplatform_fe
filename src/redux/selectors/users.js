import { createSelector } from 'reselect';
import Paginator from '../helpers/Paginator';

const initialFilter = {
  organization: null,
  keywords: ''
};

const users = state => state.users.all || [];
const userFilter = state => ({
  ...initialFilter,
  ...state.filters.users
});
const userPager = state => state.pagination.users || { page: 1 };

export const getUsersByOrganization = createSelector([users, userFilter], (items, filter) => {
  let i = items;
  if (filter.organization) {
    i = items.filter(item => item.idOrganization === parseInt(filter.organization));
  }
  return i;
});

export const getUsers = (state, qty) => createSelector([getUsersByOrganization, userFilter, userPager], (items, filter, page) => {
  let i = items;
  if (filter.keywords.length > 0) {
    i = items.filter(item =>
      item.name
        .toLowerCase()
        .trim()
        .includes(filter.keywords.toLowerCase().trim()));
  }

  return Paginator(i, page, qty);
})(state);
