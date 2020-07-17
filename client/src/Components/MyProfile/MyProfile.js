import React, { useState, useEffect } from "react";
import "./MyProfile.css";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { changeprofilephoto } from "../Action/Action";
import PostImage from "../PostImage/PostImage";
import Navbar from "../Navbar/Navbar";
import Spinner from "../Navbar/images/Spinner.gif";
import Followlayout from "../followlayout/Followlayout";
import { adduser } from "../Action/Action";
import Loading from "../loading/Loading";

export default function MyProfile() {
  let user = useSelector((state) => state.UserReducer);
  const [isloading, setIsloading] = useState(true);
  const [isloadingspinner, setisloadingspinner] = useState(false);
  const dispatch = useDispatch();
  const [check, ischeck] = useState(false);

  useEffect(() => {
    fetchdata();
  }, []);

  const fetchdata = async () => {
    setIsloading(true);
    const response = await axios.post("http://localhost:5000/login/myprofile", {
      username: user.username,
    });
    dispatch(adduser(response.data[0]));
    localStorage.setItem("UserManiac", JSON.stringify(response.data[0]));
    console.log("yessss");
    document.body.classList.remove("scrolloff");
    setIsloading(false);
  };

  const fileonchange = async (e) => {
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
      } else {
        alert("Image File size exceded (max size-1MB)");
      }
    } else {
      alert("not an image file");
    }
  };

  const layoutforfollow = () => {
    return (
      <div className="model" id="can">
        <div className="mod">
          <button
            className="btnprofile"
            onClick={() => {
              document.getElementById("can").classList.remove("disblock");
              document.body.classList.remove("scrolloff");
            }}
          >
            Cancel
          </button>
          {check
            ? user.following.map((ele) => (
                <Followlayout
                  src={`http://localhost:5000/${ele.profilephoto}`}
                  username={ele.username}
                  key={ele._id}
                ></Followlayout>
              ))
            : user.followers.map((ele) => (
                <Followlayout
                  src={`http://localhost:5000/${ele.profilephoto}`}
                  username={ele.username}
                  key={ele._id}
                ></Followlayout>
              ))}
        </div>
      </div>
    );
  };

  return isloading ? (
    <Loading />
  ) : (
    <div>
      <Navbar></Navbar>
      <div className="container">
        <div className="profilecontainer">
          <div className="MyProfile">
            <div className="photodiv">
              <div className="photo">
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
                  className="img"
                  onClick={() => document.getElementById("file").click()}
                />
                <img
                  src={Spinner}
                  alt=""
                  className={isloadingspinner ? "loading" : "displaynone"}
                />
              </div>
            </div>
            <div className="infodiv">
              <div className="upinfodiv">
                <h1 className="ProfileName">{user.username}</h1>
                <Link to="/editprofile">
                  <button className="btnprofile">Edit Profile</button>
                </Link>
                <Link to="/addpost">
                  <button className="btnprofile">Add a Post</button>
                </Link>
              </div>
              <div className="belowinfodiv">
                <p className="infoptags">post : {user.posts.length}</p>
                <p
                  className="infoptags clickinfoptags hoverpink"
                  onClick={() => {
                    ischeck(false);
                    document.getElementById("can").classList.add("disblock");
                    document.body.classList.add("scrolloff");
                  }}
                >
                  Followers : {user.followers.length}
                </p>
                <p
                  className="infoptags clickinfoptags hoverpink"
                  onClick={() => {
                    ischeck(true);
                    document.getElementById("can").classList.add("disblock");
                    document.body.classList.add("scrolloff");
                  }}
                >
                  Following : {user.following.length}
                </p>
              </div>
            </div>
          </div>
          {layoutforfollow()}
          <div className="postssection">
            <p className="headingposts">Your Posts</p>
            <div className="postsContainer">
              {user.posts.map((ele) => (
                <PostImage post={ele} key={ele._id}></PostImage>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
