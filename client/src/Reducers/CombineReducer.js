import { combineReducers } from "redux";
import { UserReducer } from "./UserReducer";
import { UserPostReducer } from "./UserPostReducer";
export const combine = combineReducers({
  UserReducer: UserReducer,
});
