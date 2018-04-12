import { SubmissionError } from 'redux-form';
import cookie from 'js-cookie';

const LOAD = 'auth/LOAD';
const LOAD_SUCCESS = 'auth/LOAD_SUCCESS';
const LOAD_FAIL = 'auth/LOAD_FAIL';
const LOGIN = 'auth/LOGIN';
const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS';
const LOGIN_FAIL = 'auth/LOGIN_FAIL';
const REGISTER = 'auth/REGISTER';
const REGISTER_SUCCESS = 'auth/REGISTER_SUCCESS';
const REGISTER_FAIL = 'auth/REGISTER_FAIL';
const LOGOUT = 'auth/LOGOUT';
const LOGOUT_SUCCESS = 'auth/LOGOUT_SUCCESS';
const LOGOUT_FAIL = 'auth/LOGOUT_FAIL';
const VERIFY = 'auth/VERIFY';
const VERIFY_SUCCESS = 'auth/VERIFY_SUCCESS';
const VERIFY_FAIL = 'auth/VERIFY_FAIL';
const PASSWORD_FORGOTTEN = 'auth/PASSWORD_FORGOTTEN';
const PASSWORD_FORGOTTEN_SUCCESS = 'auth/PASSWORD_FORGOTTEN_SUCCESS';
const PASSWORD_FORGOTTEN_FAIL = 'auth/PASSWORD_FORGOTTEN_FAIL';

const VERIFY_PASSWORD_FORGOTTEN = 'auth/VERIFY_PASSWORD_FORGOTTEN';
const VERIFY_PASSWORD_FORGOTTEN_SUCCESS = 'auth/VERIFY_PASSWORD_FORGOTTEN_SUCCESS';
const VERIFY_PASSWORD_FORGOTTEN_FAIL = 'auth/VERIFY_PASSWORD_FORGOTTEN_FAIL';

const initialState = {
  loaded: false,
  user: null
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
        accessToken: action.result.accessToken,
        user: action.result.user
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case LOGIN:
      return {
        ...state,
        loggingIn: true
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loggingIn: false,
        loaded: true,
        accessToken: action.result.accessToken,
        user: action.result.user
      };
    case LOGIN_FAIL:
      return {
        ...state,
        loggingIn: false,
        loginError: action.error
      };
    case REGISTER:
      return {
        ...state,
        registeringIn: true
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        registeringIn: false
      };
    case REGISTER_FAIL:
      return {
        ...state,
        registeringIn: false,
        registerError: action.error
      };
    case LOGOUT:
      return {
        ...state,
        loggingOut: true
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        loggingOut: false,
        accessToken: null,
        user: null
      };
    case LOGOUT_FAIL:
      return {
        ...state,
        loggingOut: false,
        logoutError: action.error
      };
    case VERIFY:
      return {
        ...state,
        verifying: true
      };
    case VERIFY_SUCCESS:
      return {
        ...state,
        verifying: false,
        verifiedUser: action.result
      };
    case VERIFY_FAIL:
      return {
        ...state,
        verifying: false,
        verifyError: action.error
      };
    case PASSWORD_FORGOTTEN:
      return {
        ...state,
        passwordForgottenSending: true
      };
    case PASSWORD_FORGOTTEN_SUCCESS:
      return {
        ...state,
        passwordForgottenSending: false
      };
    case PASSWORD_FORGOTTEN_FAIL:
      return {
        ...state,
        passwordForgottenSending: false,
        passwordForgottenError: action.error
      };
    default:
      return state;
  }
}

const catchValidation = error => {
  if (error.message) {
    if (error.message === 'Validation failed' && error.data) {
      throw new SubmissionError(error.data);
    }
    throw new SubmissionError({ _error: error.message });
  }
  return Promise.reject(error);
};

function setCookie({ app }) {
  return async response => {
    const payload = await app.passport.verifyJWT(response.accessToken);
    const options = payload.exp ? { expires: new Date(payload.exp * 1000) } : undefined;

    cookie.set('feathers-jwt', response.accessToken, options);
  };
}

function setToken({ client, app, restApp }) {
  return response => {
    const { accessToken } = response;

    app.set('accessToken', accessToken);
    restApp.set('accessToken', accessToken);
    client.setJwtToken(accessToken);
  };
}

function setUser({ app, restApp }) {
  return response => {
    app.set('user', response.user);
    restApp.set('user', response.user);
  };
}

/*
* Actions
* * * * */

export function isLoaded(globalState) {
  return globalState.auth && globalState.auth.loaded;
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: async ({ app, restApp, client }) => {
      const response = await restApp.authenticate();
      await setCookie({ app })(response);
      setToken({ client, app, restApp })(response);
      setUser({ app, restApp })(response);
      return response;
    }
  };
}

export function register(data) {
  return {
    types: [REGISTER, REGISTER_SUCCESS, REGISTER_FAIL],
    promise: ({ app }) =>
      app
        .service('users')
        .create(data)
        .catch(catchValidation)
  };
}

export function login(strategy, data) {
  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: async ({ client, restApp, app }) => {
      try {
        const response = await app.authenticate({
          ...data,
          strategy
        });
        await setCookie({ app })(response);
        setToken({ client, app, restApp })(response);
        setUser({ app, restApp })(response);
        return response;
      } catch (error) {
        if (strategy === 'local') {
          return catchValidation(error);
        }
        throw error;
      }
    }
  };
}

export function logout() {
  return {
    types: [LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAIL],
    promise: async ({ client, app, restApp }) => {
      await app.logout();
      setToken({ client, app, restApp })({ accessToken: null });
      cookie.set('feathers-jwt', '');
    }
  };
}

export function verify(hash) {
  return {
    types: [VERIFY, VERIFY_SUCCESS, VERIFY_FAIL],
    promise: ({ app }) =>
      app
        .service('authManagement')
        .create({
          action: 'verifySignupLong',
          value: hash
        })
        .catch(catchValidation)
  };
}

export function passwordForgotten(email) {
  return {
    types: [PASSWORD_FORGOTTEN, PASSWORD_FORGOTTEN_SUCCESS, PASSWORD_FORGOTTEN_FAIL],
    promise: ({ app }) =>
      app
        .service('authManagement')
        .create({
          action: 'sendResetPwd',
          value: {
            email
          }
        })
        .catch(catchValidation)
  };
}

export function verifyPasswordForgotten({ token, password }) {
  return {
    types: [VERIFY_PASSWORD_FORGOTTEN, VERIFY_PASSWORD_FORGOTTEN_SUCCESS, VERIFY_PASSWORD_FORGOTTEN_FAIL],
    promise: ({ app }) =>
      app
        .service('authManagement')
        .create({
          action: 'resetPwdLong',
          value: {
            token,
            password
          }
        })
        .catch(catchValidation)
  };
}
