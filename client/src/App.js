import React from "react";
import SignUp from "./Components/SignUp/SignUp";
import Login from "./Components/Login/Login";
import Navbar from "./Components/Navbar/Navbar";
import MyProfile from "./Components/MyProfile/MyProfile";
import EditProfile from "./Components/EditProfile/EditProfile";
import ChangePassword from "./Components/ChangePassword/ChangePassword";
import Addpost from "./Components/AddPost/Addpost";
import { BrowserRouter as Router, Link, Switch, Route } from "react-router-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { combine } from "./Reducers/CombineReducer";
import PrivateRoute from "./Components/PrivateRoute/PrivateRoute";
import Setting from "./Components/Setting/Setting";
import Home from "./Components/Home/Home";
import Post from "./Components/Post/Post";
import Search from "./Components/Search/Search";

export default function App() {
  const store = createStore(
    combine,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

  return (
    <div>
      <Provider store={store}>
        <Router>
          <Switch>
            <Route exact path="/signup" component={SignUp}></Route>
            <Route exact path="/login" component={Login}></Route>
            <PrivateRoute exact={true} path="/" component={Home}></PrivateRoute>
            <PrivateRoute
              exact={true}
              path="/post/:id"
              component={Post}
            ></PrivateRoute>
            <PrivateRoute
              exact={true}
              path="/search/:username"
              component={Search}
            ></PrivateRoute>
            <PrivateRoute
              exact={true}
              path="/MyProfile"
              component={MyProfile}
            ></PrivateRoute>
            <PrivateRoute
              exact={true}
              path="/editprofile"
              component={EditProfile}
            ></PrivateRoute>
            <PrivateRoute
              exact={true}
              path="/addpost"
              component={Addpost}
            ></PrivateRoute>
            <PrivateRoute
              exact={true}
              path="/changepassword"
              component={ChangePassword}
            ></PrivateRoute>
            <PrivateRoute
              exact={true}
              path={"/Setting"}
              component={Setting}
            ></PrivateRoute>
          </Switch>
        </Router>
      </Provider>
    </div>
  );
}
