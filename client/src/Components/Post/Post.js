import React, { useEffect, useState } from "react";
import "./Post.css";
import Navbar from "../Navbar/Navbar";
import Axios from "axios";
import CommentByUsers from "../CommentByUsers/CommentByUsers";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Followlayout from "../followlayout/Followlayout";
import Loading from "../loading/Loading";

export default function Post(props) {
  const user = useSelector((state) => state.UserReducer);
  const [post, setPost] = useState("");
  const [isuserlike, setIsuserlike] = useState(false);

  const [isloading, setisloading] = useState(true);

  useEffect(() => {
    fetchdata();
  }, []);

  const fetchdata = async () => {
    setisloading(true);
    const id = props.match.params.id;
    const response = await Axios.get(`http://localhost:5000/post/${id}`);
    console.log(response.data);
    setPost(response.data);

    response.data.likes.forEach((ele) => {
      if (ele._id == user._id) {
        setIsuserlike(true);
      }
    });

    setisloading(false);
  };

  const submithandle = async (e) => {
    e.preventDefault();
    console.log("sub");
    const commentInput = document.getElementById("commentInput");
    if (commentInput.value.length > 0) {
      const response = await Axios.post(
        "http://localhost:5000/post/commentadd",
        {
          postid: post._id,
          userid: user._id,
          commentText: commentInput.value,
        }
      );
      console.log(response.data);
      let p = { ...post, comments: [...post.comments] };
      p.comments.push({
        _id: response.data._id,
        commentText: commentInput.value,
        commentByUser: {
          profilephoto: user.profilephoto,
          _id: user._id,
          username: user.username,
        },
      });
      setPost(p);
      commentInput.value = "";
      commentbtnclick();
    }
  };

  const likehandle = async () => {
    if (isuserlike) {
      const response = await Axios.post("http://localhost:5000/post/unlike", {
        postid: post._id,
        userid: user._id,
      });
      let p = { ...post, likes: [...post.likes] };
      let likes = p.likes.filter((ele) => ele._id != user._id);
      p.likes = likes;
      setPost(p);
      setIsuserlike(false);
    } else {
      const response = await Axios.post("http://localhost:5000/post/like", {
        postid: post._id,
        userid: user._id,
      });
      let p = { ...post, likes: [...post.likes] };
      p.likes.push({
        _id: user._id,
        username: user.username,
        profilephoto: user.profilephoto,
      });
      setPost(p);
      setIsuserlike(true);
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
          {post.likes.map((ele) => (
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

  const commentbtnclick = () => {
    const commentInput = document.getElementById("commentInput");
    const commentbtn = document.getElementById("commentbtn");
    if (commentInput.value.length > 0) {
      commentbtn.classList.remove("notloadbutton");
    } else {
      commentbtn.classList.add("notloadbutton");
    }
  };

  const display = () => {
    if (isloading === false) {
      return (
        <div>
          <Navbar></Navbar>
          <div className="Post_Container">
            <div className="postimagediv">
              <img src={`http://localhost:5000/${post.postedimage}`} alt="" />
            </div>
            <div className="postcontainerdiv">
              <div className="headpost headposts">
                <Link to={`/search/${post.postedbyUser.username}`}>
                  <img
                    src={`http://localhost:5000/${post.postedbyUser.profilephoto}`}
                    alt=""
                    className="imgofposteduser"
                  />
                </Link>
                <Link to={`/search/${post.postedbyUser.username}`}>
                  <p className="postedbyUserName">
                    {post.postedbyUser.username}
                  </p>
                </Link>
              </div>
              <div className="commentbox">
                {post.posttext != "" && (
                  <CommentByUsers
                    key={post._id}
                    image={post.postedbyUser.profilephoto}
                    username={post.postedbyUser.username}
                    commenttext={post.posttext}
                    posttext={true}
                  ></CommentByUsers>
                )}
                {post.comments.map((ele) => (
                  <CommentByUsers
                    key={ele._id}
                    image={ele.commentByUser.profilephoto}
                    username={ele.commentByUser.username}
                    commenttext={ele.commentText}
                    posttext={false}
                  ></CommentByUsers>
                ))}
              </div>
              <div className="poststats">
                <button onClick={likehandle}>
                  <i
                    className={
                      isuserlike ? "like fa fa-heart" : "notlike fa fa-heart"
                    }
                    aria-hidden="true"
                  ></i>
                </button>

                <form onSubmit={(e) => submithandle(e)}>
                  <input
                    type="text"
                    name=""
                    id="commentInput"
                    className="commentInput"
                    placeholder="Add a comment...."
                    onChange={() => {
                      commentbtnclick();
                    }}
                  />
                  <button
                    className="commentbutton notloadbutton"
                    id="commentbtn"
                  >
                    post
                  </button>
                </form>
              </div>
              <div className="totalamount">
                <span
                  onClick={() => {
                    document.getElementById("can").classList.add("disblock");
                    document.body.classList.add("scrolloff");
                  }}
                  className="likecountspan"
                >
                  {post.likes.length} likes
                </span>
              </div>
            </div>
          </div>
          {layoutforfollow()}
        </div>
      );
    } else {
      return <Loading></Loading>;
    }
  };
  return display();
}
