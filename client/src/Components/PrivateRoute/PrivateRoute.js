import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import { adduser } from "../Action/Action";
import Login from "../Login/Login";

export default function PrivateRoute({ exact, path, component }) {
  const state = useSelector((state) => state.UserReducer);
  const dispatch = useDispatch();

  const localstorage = JSON.parse(localStorage.getItem("UserManiac"));

  const display = () => {
    if (state) {
      return <Route exact={exact} path={path} component={component}></Route>;
    } else if (localstorage !== null) {
      dispatch(adduser(localstorage));
      return <Route exact={exact} path={path} component={component}></Route>;
    } else {
      return <Redirect to="/login"></Redirect>;
    }
  };
  return display();
}
