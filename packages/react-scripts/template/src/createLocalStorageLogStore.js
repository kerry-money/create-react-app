import { store } from "./createStore";
import { LocalStorageLogging } from "eh-mortar";

const getUserName = () => {
  return store.getState().domain.auth.userProfile.id;
};

const localStorageLogStore = new LocalStorageLogging({
  applicationName: "User Management",
  userNameGetter: getUserName
});

export default localStorageLogStore;
