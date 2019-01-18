import { createLogic } from "eh-mortar";
import { actions } from "./ducks";

export const getUserProfile = createLogic(
  async ({ identifiServicesClient, dispatch }) => {
    let response = await identifiServicesClient.get(`core/v1/UserProfile`);
    dispatch(actions.authActions.setIDPUserProfile(response.data));
  }
);
