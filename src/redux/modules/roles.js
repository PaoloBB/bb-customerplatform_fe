import { SubmissionError } from 'redux-form';

const LOAD_ALL = 'roles/LOAD_ALL';
const LOAD_ALL_SUCCESS = 'roles/LOAD_ALL_SUCCESS';
const LOAD_ALL_FAIL = 'roles/LOAD_ALL_FAIL';

const initialState = {
  loaded: false
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
        data: action.result,
        error: null
      };
    case LOAD_ALL_FAIL:
      return {
        ...state,
        loadingAll: false,
        loadedAll: false,
        data: null,
        error: typeof action.error === 'string' ? action.error : 'Error'
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.roles && globalState.roles.loaded;
}

export function loadAll() {
  return {
    types: [LOAD_ALL, LOAD_ALL_SUCCESS, LOAD_ALL_FAIL],
    promise: ({ client }) => client.get('/roles') // params not used, just shown as demonstration
  };
}
