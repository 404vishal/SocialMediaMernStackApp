import React from "react";
import { Link } from "react-router-dom";

export default function CommentByUsers(props) {
  return (
    <div className="commentbyusers">
      <div>
        <Link to={`/search/${props.username}`}>
          <img
            src={`http://localhost:5000/${props.image}`}
            alt=""
            className="imgofposteduser"
          />
        </Link>
      </div>
      <div className="pyd">
        <Link to={`/search/${props.username}`}>
          <span className=" userspan">{props.username}</span>
        </Link>
        <span className={props.posttext ? "changecolor" : "co"}>
          {props.commenttext}
        </span>
      </div>
    </div>
  );
}
