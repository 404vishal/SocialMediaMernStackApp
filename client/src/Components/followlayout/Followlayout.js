import React from "react";
import { Redirect, Link } from "react-router-dom";

export default function Followlayout(props) {
  return (
    <div>
      <Link to={`/search/${props.username}`}>
        <div className="eachfoll">
          <img src={props.src}></img>
          <p className="hoverpink">{props.username}</p>
        </div>
      </Link>
    </div>
  );
}
