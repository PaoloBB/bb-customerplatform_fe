const SET_USERS_PAGINATION = 'users/SET_USERS_PAGINATION';

export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case SET_USERS_PAGINATION: {
      return {
        ...state,
        users: action.page || 1
      };
    }

    default:
      return state;
  }
}

export function setUsersPage(page) {
  return { type: SET_USERS_PAGINATION, page };
}
