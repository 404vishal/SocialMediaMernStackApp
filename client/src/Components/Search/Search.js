import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Axios from "axios";
import PostImage from "../PostImage/PostImage";
import { useDispatch, useSelector } from "react-redux";
import { follow, unfollow } from "../Action/Action";
import "./Search.css";
import Followlayout from "../followlayout/Followlayout";
import { Redirect } from "react-router-dom";
import Loading from "../loading/Loading";

export default function Search(props) {
  const dispatch = useDispatch();
  const [searchedUser, setSearchedUser] = useState({});
  const [isloading, setisloading] = useState(true);
  const user = useSelector((state) => state.UserReducer);
  const [userfollowed, setuserfollowed] = useState(false);
  const [searchUserFollowed, setSearchUserFollowed] = useState(false);
  const [bothfollowed, setBothfollowed] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [issearchprivate, setIssearchprivate] = useState(true);
  const [check, ischeck] = useState(false);

  useEffect(() => {
    setRedirect(false);
    setisloading(false);
    setuserfollowed(false);
    setSearchUserFollowed(false);
    setBothfollowed(false);
    setIssearchprivate(true);
    fetchdata();
  }, [props.match.params.username]);

  const fetchdata = async () => {
    setisloading(true);
    const username = props.match.params.username;
    if (username === user.username) {
      setRedirect(true);
    } else {
      const response = await Axios.get(
        `http://localhost:5000/search/${username}`
      );
      console.log(response.data[0]);
      console.log(user);
      setIssearchprivate(response.data[0].private);
      setSearchedUser(response.data[0]);

      let statep = {
        ...user,
        following: [...user.following],
        followers: [...user.followers],
      };
      let prox1 = false,
        prox2 = false;
      statep.following.forEach((ele) => {
        if (ele._id === response.data[0]._id) {
          setuserfollowed(true);
          prox1 = true;
        }
      });

      statep.followers.forEach((ele) => {
        if (ele._id === response.data[0]._id) {
          setSearchUserFollowed(true);
          prox2 = true;
        }
      });
      console.log(prox1, prox2);
      if (prox1 && prox2) {
        setBothfollowed(true);
      } else {
        setBothfollowed(false);
      }
    }
    setisloading(false);
    document.body.classList.remove("scrolloff");
  };

  const followhandle = async () => {
    let prox1 = userfollowed;
    if (userfollowed) {
      const response = await Axios.post(
        "http://localhost:5000/search/unfollow",
        {
          user_id: user._id,
          searcheduser_id: searchedUser._id,
        }
      );
      dispatch(unfollow(searchedUser._id));

      let su = { ...searchedUser, followers: [...searchedUser.followers] };

      let sup = su.followers.filter((ele) => ele._id !== user._id);
      su.followers = sup;
      setSearchedUser(su);

      let getfromls = JSON.parse(localStorage.getItem("UserManiac"));
      let statep = {
        ...getfromls,
        following: [...getfromls.following],
      };
      let rep = statep.following.filter((ele) => ele._id !== searchedUser._id);
      statep.following = rep;
      localStorage.setItem("UserManiac", JSON.stringify(statep));
      prox1 = false;
      setuserfollowed(false);
    } else {
      const response = await Axios.post("http://localhost:5000/search/follow", {
        user_id: user._id,
        searcheduser_id: searchedUser._id,
      });
      let obj = {
        _id: user._id,
        username: user.username,
        profilephoto: user.profilephoto,
      };
      let obj2 = {
        _id: searchedUser._id,
        username: searchedUser.username,
        profilephoto: searchedUser.profilephoto,
      };
      let su = { ...searchedUser, followers: [...searchedUser.followers] };
      su.followers.push(obj);
      setSearchedUser(su);
      dispatch(follow(obj2));
      let getfromls = JSON.parse(localStorage.getItem("UserManiac"));
      getfromls = {
        ...getfromls,
        following: [...getfromls.following, obj2],
      };
      localStorage.setItem("UserManiac", JSON.stringify(getfromls));
      setuserfollowed(true);
      prox1 = true;
    }

    if (prox1 && searchUserFollowed) {
      setBothfollowed(true);
    } else {
      setBothfollowed(false);
    }
  };

  const openpostfunc = () => {
    if (bothfollowed || !issearchprivate) {
      return (
        <div className="postsContainer">
          {searchedUser.posts.map((ele) => (
            <PostImage post={ele} key={ele._id}></PostImage>
          ))}
        </div>
      );
    } else {
      return (
        <div className="ficacon">
          <p>User has set profile to private.</p>
          <p> follow each other to view posts.</p>
        </div>
      );
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
            ? searchedUser.following.map((ele) => (
                <Followlayout
                  src={`http://localhost:5000/${ele.profilephoto}`}
                  username={ele.username}
                  key={ele._id}
                ></Followlayout>
              ))
            : searchedUser.followers.map((ele) => (
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
  const display = () => {
    if (isloading == false) {
      return redirect ? (
        <Redirect to="/myprofile"></Redirect>
      ) : (
        <div>
          <Navbar></Navbar>
          <div className="container">
            <div className="profilecontainer">
              <div className="MyProfile">
                <div className="photodiv">
                  <div className="photo">
                    <img
                      src={`http://localhost:5000/${searchedUser.profilephoto}`}
                      alt=""
                      className="img nohover"
                    />
                  </div>
                </div>
                <div className="infodiv">
                  <div className="upinfodiv">
                    <h1 className="ProfileName">{searchedUser.username}</h1>
                    <button className="btnprofile" onClick={followhandle}>
                      {userfollowed ? "Followed ✔" : "Follow"}
                    </button>
                  </div>
                  <div className="belowinfodiv">
                    <p className="infoptags">
                      post - {searchedUser.posts.length}
                    </p>
                    <p
                      className="infoptags clickinfoptags hoverpink"
                      onClick={() => {
                        ischeck(false);
                        document
                          .getElementById("can")
                          .classList.add("disblock");
                        document.body.classList.add("scrolloff");
                      }}
                    >
                      Followers : {searchedUser.followers.length}
                    </p>
                    <p
                      className="infoptags clickinfoptags hoverpink"
                      onClick={() => {
                        ischeck(true);
                        document
                          .getElementById("can")
                          .classList.add("disblock");
                        document.body.classList.add("scrolloff");
                      }}
                    >
                      Following : {searchedUser.following.length}
                    </p>
                  </div>
                  {layoutforfollow()}
                </div>
              </div>
              <div className="postssection">
                <p className="headingposts">Posts</p>
                {openpostfunc()}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <Loading></Loading>;
    }
  };

  return display();
}
