import React, { useState } from "react";
import "./EditProfile.css";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import {
  changeprofilephoto,
  changeusername,
  changeemail,
  both,
} from "../Action/Action";
import Navbar from "../Navbar/Navbar";
import Spinner from "../Navbar/images/Spinner.gif";

export default function EditProfile() {
  const [username, setUsername] = useState("");
  const [email, setemail] = useState("");
  const user = useSelector((state) => state.UserReducer);
  const dispatch = useDispatch();
  const [isloadingspinner, setisloadingspinner] = useState(false);
  const [redirect, setredirect] = useState(false);

  const fileonchange = async (e) => {
    const profilePhotoError = document.getElementById("profilePhotoError");
    const file = e.target.files[0];
    let formdata = new FormData();
    formdata.append("file", file);
    console.log(e.target.files[0]);
    const config = { header: { "content-type": "multipart/form-data" } };
    if (
      file.type === "image/jpeg" ||
      file.type === "image/jpg" ||
      file.type === "image/png"
    ) {
      if (file.size < 1000000) {
        setisloadingspinner(true);
        const response = await axios.post(
          `http://localhost:5000/temp/image/${user._id}`,
          formdata,
          config
        );
        dispatch(changeprofilephoto(response.data.image));
        console.log(response.data.image);
        setisloadingspinner(false);
        let getfromls = JSON.parse(localStorage.getItem("UserManiac"));
        getfromls.profilephoto = response.data.image;
        localStorage.setItem("UserManiac", JSON.stringify(getfromls));
        profilePhotoError.classList.add("displaynone");
      } else {
        profilePhotoError.classList.remove("displaynone");
        profilePhotoError.innerHTML = "image file size exceded (max size-1MB)";
      }
    } else {
      profilePhotoError.classList.remove("displaynone");
      profilePhotoError.innerHTML = "not an image file";
    }
  };

  const checkUsernameInDb = async () => {
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

  const checkvalidusername = async () => {
    const usererror = document.getElementById("usererror");

    if (username.length < 8) {
      usererror.classList.remove("displaynone");
      usererror.innerHTML = "*username doesnot contain 8 characters";
      return false;
    } else {
      if (await checkUsernameInDb()) {
        usererror.classList.remove("displaynone");
        usererror.innerHTML =
          "*username already exist.please use another username";
        return false;
      } else {
        usererror.classList.add("displaynone");

        return true;
      }
    }
  };

  const checkvalidemail = () => {
    const emailerror = document.getElementById("emailerror");

    const regex = RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
    if (!regex.test(email)) {
      emailerror.classList.remove("displaynone");
      emailerror.innerHTML = "*Email is not valid";
      return false;
    } else {
      emailerror.classList.add("displaynone");
      return true;
    }
  };

  const SubmitHandle = async (e) => {
    e.preventDefault();
    let getfromls = JSON.parse(localStorage.getItem("UserManiac"));
    if (username !== "" && email === "") {
      if (await checkvalidusername()) {
        const response = await axios.post(
          "http://localhost:5000/edituser/username",
          {
            oldusername: user.username,
            newusername: username,
          }
        );
        console.log(response.data);
        console.log(username);
        dispatch(changeusername(username));
        getfromls.username = username;
        localStorage.setItem("UserManiac", JSON.stringify(getfromls));
        success("Username has changed ");
      }
    } else if (username === "" && email !== "") {
      if (checkvalidemail()) {
        const response = await axios.post(
          "http://localhost:5000/edituser/email",
          {
            username: user.username,
            email: email,
          }
        );
        console.log(response.data);
        dispatch(changeemail(email));
        getfromls.email = email;
        localStorage.setItem("UserManiac", JSON.stringify(getfromls));
        success("Email has changed ");
      }
    } else if (username !== "" && email !== "") {
      const checkvusername = await checkvalidusername();
      const checkvemail = checkvalidemail();
      if (checkvusername && checkvemail) {
        const response = await axios.post(
          "http://localhost:5000/edituser/both",
          {
            oldusername: user.username,
            newusername: username,
            email: email,
          }
        );
        console.log(response.data);
        dispatch(both({ username: username, email: email }));
        getfromls.username = username;
        getfromls.email = email;
        localStorage.setItem("UserManiac", JSON.stringify(getfromls));
        success("Username and Email has changed ");
      }
    }
  };

  const success = (message) => {
    const success_p = document.getElementById("success_p");
    success_p.innerHTML = message;
    success_p.classList.remove("displaynone");
    setUsername("");
    setemail("");
    setTimeout(() => {
      success_p.classList.add("displaynone");
      setredirect(true);
    }, 3000);
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
              <button className="underline">Edit Profile</button>
            </Link>
            <Link to="changepassword">
              <button>Change Password</button>
            </Link>
          </div>
          <div className="editcontainer">
            <form>
              <div className="row">
                <div className="col col1">
                  <input
                    type="file"
                    name="file"
                    id="file"
                    accept="image/jpeg,image/png,image/jpg"
                    hidden={true}
                    onChange={(e) => {
                      fileonchange(e);
                    }}
                  />
                  <img
                    src={`http://localhost:5000/${user.profilephoto}`}
                    alt=""
                    className="image"
                    onClick={() => document.getElementById("file").click()}
                  />
                </div>
                <div
                  className="col col2 pf"
                  onClick={() => document.getElementById("file").click()}
                >
                  Change Profile Photo
                </div>
                <img
                  src={Spinner}
                  alt=""
                  className={isloadingspinner ? "pfloading" : "displaynone"}
                />
              </div>
              <p className="error displaynone" id="profilePhotoError"></p>
              <div className="row">
                <div className="col col1">Change Username</div>
                <div className="col col2">
                  <input
                    type="text"
                    name="username"
                    value={username}
                    className="commentInput"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <p className="error displaynone" id="usererror"></p>
                </div>
              </div>
              <div className="row">
                <div className="col col1">Change Email</div>
                <div className="col col2">
                  <input
                    type="text"
                    name="email"
                    value={email}
                    className="commentInput"
                    onChange={(e) => setemail(e.target.value)}
                  />
                  <p className="error displaynone" id="emailerror"></p>
                </div>
              </div>
              <div className="row">
                <div className="col col1"></div>
                <div className="col col2 ">
                  <button className="colbtn" onClick={SubmitHandle}>
                    Submit
                  </button>
                </div>
              </div>
            </form>
            <p className="success_p displaynone" id="success_p"></p>
          </div>
        </div>
      </div>
    </div>
  );
}
