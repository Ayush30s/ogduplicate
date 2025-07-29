import { persistReducer, persistStore } from "redux-persist";
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";

import authReducer, {
  initialState as authInitialState,
} from "../store/reducer/authReducer";
import blogReducer, {
  initialState as blogInitialState,
} from "../store/reducer/blogReducer";
import profileReducer, {
  initialState as profileInitialState,
} from "./reducer/profileReducer";
import listingReducer, {
  initialState as listingInitialState,
} from "./reducer/listingReducer";
import listingReducerActive, {
  initialState as listingActiveInitialState,
} from "./reducer/listingActiveReducer";
import requestReducer, {
  initialState as requestInitialState,
} from "./reducer/requestReducer";

import activeUserReducer, {
  initialState as activeUserInitialState,
} from "../store/reducer/userActiveReducer";

export const initialState = {
  login: authInitialState,
  blog: blogInitialState,
  profile: profileInitialState,
  listing: listingInitialState,
  listingActive: listingActiveInitialState,
  userActive: activeUserInitialState,
  request: requestInitialState,
};

const rootReducer = combineReducers({
  login: authReducer,
  blog: blogReducer,
  profile: profileReducer,
  listing: listingReducer,
  listingActive: listingReducerActive,
  userActive: activeUserReducer,
  request: requestReducer,
});

const persistConfig = {
  key: "persistData",
  storage,
  whiteList: ["login", "request"],
};

//persist the root reducer
const persistedRootReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedRootReducer,
  preloadedState: initialState,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export const persistedStore = persistStore(store);

export default store;
