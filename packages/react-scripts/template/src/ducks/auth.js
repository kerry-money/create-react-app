import { combineReducers } from 'redux';
import { simpleReducer, createAction } from './util';

const IDP_USER_PROFILE = 'IDP_USER_PROFILE';

export default combineReducers({
  userProfile: simpleReducer(IDP_USER_PROFILE, {}),
});

export const actions = {
  setIDPUserProfile: createAction(IDP_USER_PROFILE),
};
