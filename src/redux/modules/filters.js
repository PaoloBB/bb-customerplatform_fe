const SET_USERS_FILTER = 'users/SET_USERS_FILTER';

const initialState = {
  filter: {}
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_USERS_FILTER: {
      return {
        ...state,
        users: action.filter
      };
    }

    default:
      return state;
  }
}

export function setUsersFilter(filter) {
  return { type: SET_USERS_FILTER, filter };
}
