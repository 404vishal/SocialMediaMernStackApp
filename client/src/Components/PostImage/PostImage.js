import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

export default function PostImage(props) {
  const user = useSelector((state) => state.UserReducer);
  return (
    <Link to={`/post/${props.post._id}`}>
      <div className="eachpostcontainer">
        <img src={`http://localhost:5000/${props.post.postedimage}`} alt="" />
        <div className="eachposthover">
          <span>
            <i className="fa fa-heart" aria-hidden="true"></i>{" "}
            {props.post.likes.length}
          </span>
          <span>
            <i className="fa fa-comments" aria-hidden="true"></i>{" "}
            {props.post.comments.length}
          </span>
        </div>
      </div>
    </Link>
  );
}
