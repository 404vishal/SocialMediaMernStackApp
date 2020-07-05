import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import { useSelector } from "react-redux";
import "./Home.css";
import axios from "axios";
import Elements from "./Elements";
import Followlayout from "../followlayout/Followlayout";
import Loading from "../loading/Loading";

export default function Home() {
  const user = useSelector((state) => state.UserReducer);
  const [isloading, setIsloading] = useState(true);
  const [data, setData] = useState([]);
  const [arrlikes, setArrlikes] = useState([]);
  const [arrcomments, setArrcomments] = useState([]);
  const [arrisuserliked, setArrisuserliked] = useState([]);
  const [likes, setLikes] = useState([]);
  useEffect(() => {
    fetchdata();
  }, []);

  const submithandle = async (e, commentbox, postindex, commentbtton) => {
    e.preventDefault();
    const commentInput = document.getElementById(commentbox);
    if (commentInput.value.length > 0) {
      const response = await axios.post(
        "http://localhost:5000/post/commentadd",
        {
          postid: data[postindex]._id,
          userid: user._id,
          commentText: commentInput.value,
        }
      );
      console.log(response.data);

      let da = [...data];
      let d = da[postindex];
      let p = { ...d, comments: [...d.comments] };
      p.comments.push({
        _id: response.data._id,
        commentText: commentInput.value,
        commentByUser: {
          profilephoto: user.profilephoto,
          _id: user._id,
          username: user.username,
        },
      });
      d = p;
      da[postindex] = d;
      setData(da);
      let temparrcomments = [...arrcomments];
      temparrcomments[postindex] += 1;
      setArrcomments(temparrcomments);
      commentInput.value = "";
      commentbtnclick(commentbox, commentbtton);
    }
  };

  const fetchdata = async () => {
    setIsloading(true);
    const response = await axios.get(
      `http://localhost:5000/login/home/${user._id}`
    );
    console.log(response.data);
    setData(response.data);
    let tempuserlike = [];
    let tempusercomment = [];
    let templikes = response.data.map((ele, index) => {
      tempusercomment.push(ele.comments.length);
      let userlike = false;
      for (let i = 0; i < ele.likes.length; i++) {
        if (ele.likes[i]._id == user._id) {
          userlike = true;
          break;
        }
      }
      tempuserlike.push(userlike);
      return ele.likes.length;
    });
    setArrlikes(templikes);
    setArrcomments(tempusercomment);
    setArrisuserliked(tempuserlike);
    setIsloading(false);
  };

  const commentbtnclick = (ea, commentbtnpar) => {
    const commentInput = document.getElementById(ea).value;
    const commentbtn = document.getElementById(commentbtnpar);
    if (commentInput.length > 0) {
      commentbtn.classList.remove("notloadbutton");
    } else {
      commentbtn.classList.add("notloadbutton");
    }
  };

  const layoutforlikes = (postindex) => {
    setLikes(data[postindex].likes);
  };

  const likehandle = async (postindex) => {
    if (arrisuserliked[postindex]) {
      const response = await axios.post("http://localhost:5000/post/unlike", {
        postid: data[postindex]._id,
        userid: user._id,
      });
      let da = [...data];
      let d = da[postindex];
      let p = { ...d, likes: [...d.likes] };
      let likes = p.likes.filter((ele) => ele._id != user._id);
      p.likes = likes;
      d = p;
      da[postindex] = d;
      setData(da);
      let temparrlikes = [...arrlikes];
      temparrlikes[postindex] -= 1;
      setArrlikes(temparrlikes);
    } else {
      const response = await axios.post("http://localhost:5000/post/like", {
        postid: data[postindex]._id,
        userid: user._id,
      });
      let da = [...data];
      let d = da[postindex];
      let p = { ...d, likes: [...d.likes] };
      p.likes.push({
        _id: user._id,
        username: user.username,
        profilephoto: user.profilephoto,
      });
      d = p;
      da[postindex] = d;
      setData(da);
      let temparrlikes = [...arrlikes];
      temparrlikes[postindex] += 1;
      setArrlikes(temparrlikes);
    }
    let temparrisuserliked = [...arrisuserliked];
    temparrisuserliked[postindex] = !temparrisuserliked[postindex];
    setArrisuserliked(temparrisuserliked);
  };

  return isloading ? (
    <Loading />
  ) : (
    <div>
      <Navbar></Navbar>
      <div className="HomeContainer">
        {data.map((ele, index) => {
          return (
            <Elements
              key={ele._id}
              id={ele._id}
              username={ele.postedbyUser.username}
              profilephoto={ele.postedbyUser.profilephoto}
              postedimage={ele.postedimage}
              likes={arrlikes[index]}
              comments={arrcomments[index]}
              commentbtnclick={commentbtnclick}
              index={index}
              layoutforlikes={layoutforlikes}
              likehandle={likehandle}
              isuserlike={arrisuserliked[index]}
              submithandle={submithandle}
            ></Elements>
          );
        })}
      </div>
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
          {likes.map((ele) => (
            <Followlayout
              src={`http://localhost:5000/${ele.profilephoto}`}
              username={ele.username}
              key={ele._id}
            ></Followlayout>
          ))}
        </div>
      </div>
    </div>
  );
}
