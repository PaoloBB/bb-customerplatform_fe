import { SubmissionError } from 'redux-form';

const LOAD_ALL = 'users/LOAD_ALL';
const LOAD_ALL_SUCCESS = 'users/LOAD_ALL_SUCCESS';
const LOAD_ALL_FAIL = 'users/LOAD_ALL_FAIL';

const LOAD = 'users/LOAD';
const LOAD_SUCCESS = 'users/LOAD_SUCCESS';
const LOAD_FAIL = 'users/LOAD_FAIL';

const EDIT_START = 'users/EDIT_START';
const EDIT_STOP = 'users/EDIT_STOP';
const SAVE = 'users/SAVE';
const SAVE_SUCCESS = 'users/SAVE_SUCCESS';
const SAVE_FAIL = 'users/SAVE_FAIL';

const ADD = 'users/ADD';
const ADD_SUCCESS = 'users/ADD_SUCCESS';
const ADD_FAIL = 'users/ADD_FAIL';

const REMOVE = 'users/REMOVE';
const REMOVE_SUCCESS = 'users/REMOVE_SUCCESS';
const REMOVE_FAIL = 'users/REMOVE_FAIL';

const initialState = {
  loaded: false,
  editing: {},
  saveError: {}
};

const catchValidation = error => {
  if (error.message) {
    if (error.message === 'Validation failed' && error.data) {
      throw new SubmissionError(error.data);
    }
    throw new SubmissionError({ _error: error.message });
  }
  return Promise.reject(error);
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        user: action.result,
        error: null
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        user: null,
        error: typeof action.error === 'string' ? action.error : 'Error'
      };
    case LOAD_ALL:
      return {
        ...state,
        loadingAll: true
      };
    case LOAD_ALL_SUCCESS:
      return {
        ...state,
        loadingAll: false,
        loadedAll: true,
        all: action.result.data,
        error: null
      };
    case LOAD_ALL_FAIL:
      return {
        ...state,
        loadingAll: false,
        loadedAll: false,
        all: null,
        error: typeof action.error === 'string' ? action.error : 'Error'
      };

    case REMOVE:
      return {
        ...state,
        loadingAll: true
      };
    case REMOVE_SUCCESS:
      return {
        ...state,
        loadingAll: false,
        loadedAll: true,
        data: state.data.filter(item => item.id !== action.result.id),
        error: null
      };
    case REMOVE_FAIL:
      return {
        ...state,
        loadingAll: false,
        loadedAll: false,
        data: null,
        error: typeof action.error === 'string' ? action.error : 'Error'
      };

    case EDIT_START:
      return {
        ...state,
        editing: {
          ...state.editing,
          [action.id]: true
        }
      };
    case EDIT_STOP:
      return {
        ...state,
        editing: {
          ...state.editing,
          [action.id]: false
        }
      };
    case SAVE:
      return state; // 'saving' flag handled by redux-form
    case SAVE_SUCCESS: {
      const data = [...state.data];

      data[action.result[0].id - 1] = action.result[0];
      return {
        ...state,
        data,
        editing: {
          ...state.editing,
          [action.id]: false
        },
        saveError: {
          ...state.saveError,
          [action.id]: null
        }
      };
    }
    case SAVE_FAIL:
      return typeof action.error === 'string'
        ? {
          ...state,
          saveError: {
            ...state.saveError,
            [action.id]: action.error
          }
        }
        : state;

    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.users && globalState.users.loaded;
}

export function loadAll() {
  return {
    types: [LOAD_ALL, LOAD_ALL_SUCCESS, LOAD_ALL_FAIL],
    promise: ({ client }) => client.get('/organization-users') // params not used, just shown as demonstration
  };
}

export function load(id) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: ({ app }) =>
      app
        .service('organization-users')
        .get(id)
        .catch(catchValidation)
  };
}

export function remove(id) {
  return {
    types: [REMOVE, REMOVE_SUCCESS, REMOVE_FAIL],
    promise: ({ app }) =>
      app
        .service('organization-users')
        .remove(id)
        .catch(catchValidation)
  };
}

export function add(user) {
  return {
    types: [ADD, ADD_SUCCESS, ADD_FAIL],
    promise: ({ app }) =>
      app
        .service('organization-users')
        .create(user)
        .catch(catchValidation)
  };
}

export function save(user) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: user.id,
    promise: ({ client }) =>
      client.patch('/organization-users', user, {
        params: {
          id: user.id
        }
      })
  };
}
