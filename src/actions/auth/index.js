import axios from "axios";
import {
  AUTH_USER,
  AUTH_IN_PROGRESS,
  UNAUTH_USER,
  AUTH_ERROR,
  CLEARDOWN
} from './authTypes';

import { getAccessToken } from '../../utils/utils';

import params from './../../auth0-params.json';

import Auth from './Auth';

const auth = new Auth();

export function signinUser({ email, password }, callback) {

  return function(dispatch) {

    dispatch({ type: AUTH_IN_PROGRESS });

    auth.signin(email, password, callback)
    .then(() => {

      const auth0AccessToken = getAccessToken();

      axios.get(`${params.apiUrl}/getOriginAccessToken`, {
        headers: {
          Authorization: `Bearer ${auth0AccessToken}`
        }
      })
        .then(res => {

          const { success, originAccessToken } = res.data;

          if (success === 'true') {
            localStorage.setItem('origin_access_token', originAccessToken);
            dispatch({ type: AUTH_USER });
            return callback();
          } else {
            return dispatch(authError('Error fetching Origin Access Token'));
          }

        })
          .catch((error) => {
            const errorMsg = error.description || error.message || 'Unspecified error';
            return dispatch(authError(errorMsg));
         })

    })
    .catch(error => {
      const errorMsg = error.description || error.message || 'Unspecified error';
      return dispatch(authError(errorMsg));
    });

  }
}

export function authError(error) {
  const timestamp = Date.now();
  return {
    type: AUTH_ERROR,
    error,
    timestamp
  };
}

export function signoutUser() {
  auth.signout();
  return { type: UNAUTH_USER };
}

export function cleardown() {
  return {
    type: CLEARDOWN
  };
}

export function handleAuthentication(callback) {
  return function (dispatch) {
    auth.handleAuthentication()
      .then(() => {
        return dispatch({ type: AUTH_USER });
      })
      .catch(err => {
        return dispatch({ type: UNAUTH_USER });
      });
  }
}