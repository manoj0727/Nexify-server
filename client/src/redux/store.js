import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import { tokenMiddleware } from "../middlewares/tokenMiddleware";
import { initializeAuth } from "./actions/authActions";
import { initializeAdminAuth } from "./actions/adminActions";

const createAppStore = async () => {
  try {
    const store = configureStore({
      reducer: rootReducer,
      middleware: [thunk, tokenMiddleware],
    });

    await store.dispatch(initializeAuth());
    await store.dispatch(initializeAdminAuth());

    return store;
  } catch (err) {
    throw new Error("Some error occurred");
  }
};

export default createAppStore;
