import axios from "axios";

import params from './../../auth0-params.json';

import {
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_IN_PROGRESS,
  CHANGE_PASSWORD_ERROR,
  AUTHENTICATED_CLEARDOWN
} from './passwordTypes';
import { CHANGE_PASSWORD_SUCCESS } from '../home/homeTypes';

import {
  getAccessToken,
  getOriginAccessToken,
  getClaimFromToken
} from '../../utils/utils';


export function changePassword({ password }, callback) {

  return function(dispatch) {

    dispatch({ type: CHANGE_PASSWORD_IN_PROGRESS });

    console.log('Changing password');

    // get auth0 access token
    var accessToken = getAccessToken();

    // get the origin access token
    var originAccessToken = getOriginAccessToken();

    var userId = getClaimFromToken(accessToken, "sub");

    console.log(`userid: ${userId}`);

    var sapId = getClaimFromToken(accessToken, "https://originenergy.com.au/uid");

    console.log(`sapId: ${sapId}`);

    const queryParams = `?originAccessToken=${originAccessToken}&newPassword=${password}&sapId=${sapId}&auth0UserId=${userId}`;

    axios
    .get(`${params.apiUrl}/digital/password/update${queryParams}`)
    .then(() => {
      setTimeout(() => {
        dispatch({
          type: CHANGE_PASSWORD_SUCCESS,
          message: "Password successfully updated"
        }, 1000);
      })
      dispatch({
        type: CHANGE_PASSWORD
      });
      return callback();
    })
    .catch(error => {
      return dispatch(changePasswordError(error.message || 'Error occurred'));
    });

  }

}

export function cleardown() {
  return {
    type: AUTHENTICATED_CLEARDOWN
  };
}


export function changePasswordError(error) {
  const timestamp = Date.now();
  return {
    type: CHANGE_PASSWORD_ERROR,
    error,
    timestamp
  };
}
