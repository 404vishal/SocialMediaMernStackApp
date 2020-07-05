import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import { useSelector, useDispatch } from "react-redux";
import "./Setting.css";
import axios from "axios";
import { changetheme } from "../Action/Action";

export default function Setting() {
  const user = useSelector((state) => state.UserReducer);
  const dispatch = useDispatch();
  let th;

  const ChangeTheme = async () => {
    const selecttheme = document.getElementById("selecttheme");
    const profilesecurity = document.getElementById("profilesecurity");
    th = selecttheme.value;
    console.log(th);
    const response = await axios.post("http://localhost:5000/setting/theme", {
      id: user._id,
      theme: th,
      private: profilesecurity.value,
    });
    let u = JSON.parse(localStorage.getItem("UserManiac"));
    u.theme = th;
    u.private = profilesecurity.value;
    localStorage.setItem("UserManiac", JSON.stringify(u));
    dispatch(changetheme(th, profilesecurity.value));
    document.body.className = th;
  };

  return (
    <div>
      <Navbar></Navbar>
      <div className="con">
        <div className="addpostcontainer">
          <h1 className="Addposttitle">Settings</h1>
          <div className="postdiv">
            <div className="raw">
              <div className="cal cal1">
                <span>Select Theme</span>
              </div>
              <div className="cal cal2">
                <select
                  name="theme"
                  id="selecttheme"
                  className="commentInput"
                  defaultValue={user.theme}
                >
                  <option value="default">default</option>
                  <option value="dark">dark</option>
                </select>
              </div>
            </div>
            <div className="raw">
              <div className="cal cal1">
                <span>Set Profile as </span>
              </div>
              <div className="cal cal2">
                <select
                  name="profilesecurity"
                  id="profilesecurity"
                  className="commentInput"
                  defaultValue={user.private}
                >
                  <option value={true}>private</option>
                  <option value={false}>public</option>
                </select>
              </div>
            </div>
            <div className="raw">
              <div className="cal cal1"></div>
              <div className="cal cal2">
                <button className="submitpost" onClick={ChangeTheme}>
                  Submit
                </button>
              </div>
              <p className="success_p displaynone" id="success_p"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
