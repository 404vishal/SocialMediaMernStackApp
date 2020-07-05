import React, { useState, useEffect } from "react";
import "../SignUp/SignUp.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { adduser } from "../Action/Action";
import { Redirect, Link } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.UserReducer);
  const localstorage = JSON.parse(localStorage.getItem("UserManiac"));

  useEffect(() => {
    setuser();
  }, []);
  const setuser = () => {
    if (!user && localstorage) {
      dispatch(adduser(localstorage));
    }
  };

  const clickHandle = async (e) => {
    e.preventDefault();
    const error = document.getElementById("error");
    try {
      const response = await axios.post("http://localhost:5000/login/", {
        username: username,
        password: password,
      });
      if (response.data.length === 0) {
        error.classList.remove("displaynone");
        error.innerHTML = "*Username not found. Invalid Username";
      } else if (response.data.ispassword) {
        error.classList.add("displaynone");
        console.log(response.data.user[0]);
        dispatch(adduser(response.data.user[0]));
        localStorage.setItem(
          "UserManiac",
          JSON.stringify(response.data.user[0])
        );
        document.body.className = response.data.user[0].theme;
      } else {
        error.classList.remove("displaynone");
        error.innerHTML = "*password does not match.";
      }
    } catch (err) {
      console.log(err);
    }
  };

  const display = () => {
    if (!user) {
      return (
        <div className="SignupContainer">
          <div className="SignUpBox">
            <h1 className="title">Maniac</h1>
            <form className="signupform">
              <div className="inputbox">
                <input
                  type="text"
                  name="username"
                  placeholder="Enter Username"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                />
              </div>
              <div className="inputbox">
                <input
                  type="password"
                  name="password"
                  placeholder="Enter Password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </div>
              <button
                className={
                  username.length > 1 && password.length > 1
                    ? ""
                    : "notloadbutton"
                }
                onClick={clickHandle}
              >
                Login
              </button>
              <p className="error displaynone" id="error"></p>
            </form>
          </div>
          <div className="redirecttologin">
            <p>
              Don't have an account?
              <Link to="/signup">
                <span>Sign up</span>
              </Link>
            </p>
          </div>
        </div>
      );
    } else {
      return <Redirect to="/MyProfile"></Redirect>;
    }
  };
  return display();
}
