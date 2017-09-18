import {
  CHANGE_EMAIL,
  CHANGE_EMAIL_IN_PROGRESS,
  CHANGE_EMAIL_ERROR,
  AUTHENTICATED_CLEARDOWN
} from '../actions/email/emailTypes';

const INIT = {
  error: '',
  timestamp: '',
  loading: false
}

export default function(state = {}, action) {
  switch(action.type) {
    case AUTHENTICATED_CLEARDOWN:
      return { ...state, ...INIT };
    case CHANGE_EMAIL:
      return { ...state, ...INIT };
    case CHANGE_EMAIL_IN_PROGRESS:
      return { ...state, ...INIT, loading: true };
    case CHANGE_EMAIL_ERROR:
      return { ...state, ...INIT, error: action.error, timestamp: action.timestamp };
    default:
      return state;
  }
}
