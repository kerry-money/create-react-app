import { combineReducers } from "redux";

import auth, { actions as authActions } from "./auth";

export default combineReducers({
  auth
});

export const actions = {
  authActions
};
