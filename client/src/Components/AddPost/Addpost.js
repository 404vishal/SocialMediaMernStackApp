import React, { useState } from "react";
import "./Addpost.css";
import { useSelector, useDispatch } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import { addpost } from "../Action/Action";

export default function Addpost() {
  const user = useSelector((state) => state.UserReducer);
  const dispatch = useDispatch();
  const [posttext, setPosttext] = useState("");
  const [file, setFile] = useState("");
  const localstorage = JSON.parse(localStorage.getItem("UserManiac"));
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

  const submithandle = async () => {
    const dat = {
      postedbyUser: user._id,
      posttext: posttext,
    };
    const error = document.getElementById("error");
    if (file) {
      error.classList.add("displaynone");
      let formdata = new FormData();
      formdata.append("file", file);
      const config = { header: { "content-type": "multipart/form-data" } };
      if (
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png"
      ) {
        if (file.size < 1000000) {
          const response = await axios.post(
            `http://localhost:5000/temp/addpost/${JSON.stringify(dat)}`,
            formdata,
            config
          );
          console.log(response.data);
          dispatch(addpost(response.data));
          const postadded = { ...localstorage, posts: [...localstorage.posts] };
          postadded.posts.push(response.data);
          localStorage.setItem("UserManiac", JSON.stringify(postadded));
          setPosttext("");
          success("Post has been Uploaded");
        } else {
          console.log("file size exceded");
          error.classList.remove("displaynone");
          error.innerHTML = "*file size exceded";
        }
      } else {
        error.classList.remove("displaynone");
        error.innerHTML = "*not an image file";
        console.log("not an image file");
      }
    } else {
      error.classList.remove("displaynone");
      error.innerHTML = "*Image is Required";
    }
  };

  return redirect ? (
    <Redirect to="/myprofile"></Redirect>
  ) : (
    <div>
      <Navbar></Navbar>
      <div className="con">
        <div className="addpostcontainer">
          <h1 className="Addposttitle">Add a Post</h1>
          <div className="postdiv">
            <div className="raw">
              <div className="cal cal1">
                <span>*Add a photo</span>
              </div>
              <div className="cal cal2">
                <input
                  type="file"
                  name="file"
                  id="file2"
                  hidden={true}
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <button
                  className="buttonadd"
                  onClick={() => document.getElementById("file2").click()}
                >
                  Click To Add
                </button>
                <p className="error displaynone" id="error"></p>
              </div>
            </div>
            <div className="raw">
              <div className="cal cal1">
                <span>Add a post Title</span>
              </div>
              <div className="cal cal2">
                <input
                  type="text"
                  name="posttext"
                  id=""
                  value={posttext}
                  className="commentInput"
                  onChange={(e) => setPosttext(e.target.value)}
                />
              </div>
            </div>
            <div className="raw">
              <div className="cal cal1"></div>
              <div className="cal cal2">
                <button className="submitpost" onClick={submithandle}>
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
