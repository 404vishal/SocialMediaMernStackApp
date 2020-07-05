import React, { useState } from "react";
import axios from "axios";
import { Link, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../Navbar/Navbar";
import { changepassword } from "../Action/Action";

export default function ChangePassword() {
  const [currentpassword, setCurrentpassword] = useState("");
  const [newpassword, setNewpassword] = useState("");
  const [retypepassword, setRetypepassword] = useState("");
  const user = useSelector((state) => state.UserReducer);
  const dispatch = useDispatch();
  const [redirect, setredirect] = useState(false);

  const success = (message) => {
    const success_p = document.getElementById("success_p");
    success_p.innerHTML = message;
    success_p.classList.remove("displaynone");
    setTimeout(() => {
      success_p.classList.add("displaynone");
      setredirect(true);
    }, 3000);
  };

  const submitHandle = async (e) => {
    e.preventDefault();
    const currentpassworderror = document.getElementById(
      "currentpassworderror"
    );
    const newpassworderror = document.getElementById("newpassworderror");
    const retypassworderror = document.getElementById("retypassworderror");
    const eightchar = "*password does not contain 8 characters";
    if (await validationPassword()) {
      const response = await axios.post(
        "http://localhost:5000/edituser/password",
        {
          username: user.username,
          password: newpassword,
        }
      );
      console.log(response.data);
      setCurrentpassword("");
      setNewpassword("");
      setRetypepassword("");
      dispatch(changepassword(response.data));
      success("Password has changed");
    }
  };

  const validationPassword = async () => {
    let flag = true;
    const currentpassworderror = document.getElementById(
      "currentpassworderror"
    );
    const newpassworderror = document.getElementById("newpassworderror");
    const retypassworderror = document.getElementById("retypassworderror");
    const eightchar = "*password does not contain 8 characters";
    if (currentpassword.length < 8) {
      currentpassworderror.classList.remove("displaynone");
      currentpassworderror.innerHTML = eightchar;
      flag = false;
    } else {
      currentpassworderror.classList.add("displaynone");
      const response = await axios.post(
        "http://localhost:5000/edituser/checkpassword",
        {
          username: user.username,
          password: currentpassword,
        }
      );
      if (response.data) {
        currentpassworderror.classList.add("displaynone");
      } else {
        //
        flag = false;
        currentpassworderror.classList.remove("displaynone");
        currentpassworderror.innerHTML = "Incorrect password";
      }
    }
    if (newpassword.length < 8) {
      newpassworderror.classList.remove("displaynone");
      flag = false;
    } else {
      newpassworderror.classList.add("displaynone");
    }
    if (retypepassword.length < 8) {
      retypassworderror.classList.remove("displaynone");
      retypassworderror.innerHTML = eightchar;
      flag = false;
    } else {
      retypassworderror.classList.add("displaynone");
      if (retypepassword !== newpassword) {
        flag = false;
        retypassworderror.classList.remove("displaynone");
        retypassworderror.innerHTML = "Password does not match";
      }
    }
    return flag;
  };

  return redirect ? (
    <Redirect to="/myprofile"></Redirect>
  ) : (
    <div>
      <Navbar></Navbar>
      <div className="con">
        <div className="editprofilecontainer">
          <div className="sidebar">
            <Link to="editprofile">
              <button>EditProfile</button>
            </Link>
            <Link to="changepassword">
              <button className="underline">Change Password</button>
            </Link>
          </div>
          <div className="editcontainer">
            <form onSubmit={submitHandle}>
              <div className="row">
                <div className="col col1">
                  <span className="requiredsymbol">*</span>Current Password
                </div>
                <div className="col col2">
                  <input
                    type="password"
                    name="currentpassword"
                    value={currentpassword}
                    className="commentInput"
                    onChange={(e) => setCurrentpassword(e.target.value)}
                  />
                  <p
                    className="error displaynone"
                    id="currentpassworderror"
                  ></p>
                </div>
              </div>
              <div className="row">
                <div className="col col1">
                  <span className="requiredsymbol">*</span>New Password
                </div>
                <div className="col col2">
                  <input
                    type="password"
                    name="newpassword"
                    value={newpassword}
                    className="commentInput"
                    onChange={(e) => setNewpassword(e.target.value)}
                  />
                  <p className="error displaynone" id="newpassworderror">
                    *password does not contain 8 characters
                  </p>
                </div>
              </div>
              <div className="row">
                <div className="col col1">
                  <span className="requiredsymbol">*</span>Re-type Password
                </div>
                <div className="col col2">
                  <input
                    type="password"
                    name="retypepassword"
                    value={retypepassword}
                    className="commentInput"
                    onChange={(e) => setRetypepassword(e.target.value)}
                  />
                  <p className="error displaynone" id="retypassworderror"></p>
                </div>
              </div>
              <div className="row">
                <div className="col col1"></div>
                <div className="col col2 ">
                  <button className="colbtn">Submit</button>
                </div>
                <p className="success_p displaynone" id="success_p"></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
