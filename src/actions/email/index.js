import axios from "axios";

import params from './../../auth0-params.json';

import {
  CHANGE_EMAIL,
  CHANGE_EMAIL_IN_PROGRESS,
  CHANGE_EMAIL_ERROR,
  AUTHENTICATED_CLEARDOWN
} from './emailTypes';
import { CHANGE_EMAIL_SUCCESS } from '../home/homeTypes';

import {
  getIdToken,
  getAccessToken,
  getOriginAccessToken,
  getClaimFromToken
} from '../../utils/utils';


export function changeEmail({ newEmail }, callback) {

  return function(dispatch) {

    dispatch({ type: CHANGE_EMAIL_IN_PROGRESS });

    // get auth0 id token
    var idToken = getIdToken();

    var email = getClaimFromToken(idToken, "email");
    console.log(`email: ${email}`);

    console.log(`Performing change email for old email: ${email} and new email: ${newEmail}`);

    // get auth0 access token
    var accessToken = getAccessToken();

    // get the origin access token
    var originAccessToken = getOriginAccessToken();

    var userId = getClaimFromToken(accessToken, "sub");
    console.log(`userid: ${userId}`);

    var sapId = getClaimFromToken(accessToken, "https://originenergy.com.au/uid");
    console.log(`sapId: ${sapId}`);

    const queryParams = `?originAccessToken=${originAccessToken}&oldEmail=${email}&newEmail=${newEmail}&sapId=${sapId}&auth0UserId=${userId}`;

    axios
    .get(`${params.apiUrl}/digital/email/update${queryParams}`)
    .then(() => {
      setTimeout(() => {
        dispatch({
          type: CHANGE_EMAIL_SUCCESS,
          message: "Email successfully updated"
        }, 1000);
      })
      dispatch({
        type: CHANGE_EMAIL
      });
      return callback();
    })
    .catch(error => {
      return dispatch(changeEmailError(error.message || 'Error occurred'));
    });

  }

}

export function cleardown() {
  return {
    type: AUTHENTICATED_CLEARDOWN
  };
}


export function changeEmailError(error) {
  const timestamp = Date.now();
  return {
    type: CHANGE_EMAIL_ERROR,
    error,
    timestamp
  };
}
