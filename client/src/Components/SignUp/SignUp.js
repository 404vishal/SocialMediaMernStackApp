import React, { useState, useEffect } from "react";
import "./SignUp.css";
import axios from "axios";
import { Redirect, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { adduser } from "../Action/Action";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
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

  const userBlur = async () => {
    const usererror = document.getElementById("usererror");
    if (username.length < 8) {
      usererror.classList.remove("displaynone");
      usererror.innerHTML = "*username doesnot contain 8 characters";
    } else {
      usererror.classList.add("displaynone");
      if (await checkusername()) {
        usererror.classList.remove("displaynone");
        usererror.innerHTML =
          "*username already exist.please use another username";
      }
    }
  };
  const checkusername = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/signup/checkusername",
        { username: username }
      );
      return response.data;
    } catch (err) {
      console.log(err);
    }
  };

  const passBlur = () => {
    const passworderror = document.getElementById("passworderror");
    if (password.length < 8) {
      passworderror.classList.remove("displaynone");
      passworderror.innerHTML = "*Password doesnot contain 8 characters";
    } else {
      passworderror.classList.add("displaynone");
    }
  };

  const emailBlur = () => {
    const emailerror = document.getElementById("emailerror");
    const regex = RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
    if (!regex.test(email)) {
      emailerror.classList.remove("displaynone");
      emailerror.innerHTML = "*Email is not valid";
    } else {
      emailerror.classList.add("displaynone");
    }
  };

  const clickHandle = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/signup/", {
        username: username,
        password: password,
        email: email,
      });
      console.log(response.data);
      dispatch(adduser(response.data[0]));
      localStorage.setItem("UserManiac", JSON.stringify(response.data[0]));
      document.body.className = "default";
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
            <p className="desc">Sign up to see photos from your friends.</p>
            <form className="signupform">
              <div className="inputbox">
                <input
                  type="text"
                  name="username"
                  placeholder="Enter Username (minimum 8 characters)"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  onBlur={userBlur}
                />
                <p className="error displaynone" id="usererror"></p>
              </div>
              <div className="inputbox">
                <input
                  type="password"
                  name="password"
                  placeholder="Enter Password (minimum 8 characters)"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  onBlur={passBlur}
                />
                <p className="error displaynone" id="passworderror"></p>
              </div>
              <div className="inputbox">
                <input
                  type="text"
                  name="email"
                  placeholder="Enter Email (Valid Email Format)"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  onBlur={emailBlur}
                />
                <p className="error displaynone" id="emailerror"></p>
              </div>
              <button
                className={
                  username.length > 8 &&
                  password.length > 8 &&
                  RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(
                    email
                  )
                    ? ""
                    : "notloadbutton"
                }
                id="submitbutton"
                onClick={clickHandle}
              >
                Sign Up
              </button>
              <p className="someinfo">
                By signing up, you agree to our Terms , Data Policy and Cookies
                Policy .
              </p>
            </form>
          </div>
          <div className="redirecttologin">
            <p>
              Have an account?{" "}
              <Link to="/login">
                <span>Log in</span>
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
