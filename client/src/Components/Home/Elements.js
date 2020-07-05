import React, { useState, useEffect } from "react";
import Followlayout from "../followlayout/Followlayout";
import "./Elements.css";
import { Link } from "react-router-dom";

export default function Elements(props) {
  return (
    <div className="divpost">
      <div className="headpost">
        <Link to={`/search/${props.username}`}>
          <img
            src={`http://localhost:5000/${props.profilephoto}`}
            alt=""
            className="imgofposteduser"
          />
        </Link>
        <Link to={`/search/${props.username}`}>
          <p className="postedbyUserName">{props.username}</p>
        </Link>
      </div>
      <Link to={`/post/${props.id}`}>
        <img
          src={`http://localhost:5000/${props.postedimage}`}
          alt=""
          className="imagePosted"
        />
      </Link>
      <div className="poststats">
        <button
          onClick={() => {
            props.likehandle(props.index);
          }}
        >
          <i
            className={
              props.isuserlike ? "like fa fa-heart" : "notlike fa fa-heart"
            }
            aria-hidden="true"
          ></i>
        </button>

        <form
          className="form"
          onSubmit={(e) =>
            props.submithandle(
              e,
              `${props.index}commentbox`,
              props.index,
              `${props.index}commentbtn`
            )
          }
        >
          <input
            type="text"
            name=""
            placeholder="Add a comment...."
            className="commentInputbox"
            id={`${props.index}commentbox`}
            onChange={(e) => {
              props.commentbtnclick(
                `${props.index}commentbox`,
                `${props.index}commentbtn`
              );
            }}
          />
          <button
            className="commentbutton notloadbutton"
            id={`${props.index}commentbtn`}
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
            props.layoutforlikes(props.index);
          }}
          className="likecountspan"
        >
          {props.likes} likes
        </span>
        <Link to={`/post/${props.id}`}>
          <span className="likecountspan">{props.comments} comments</span>
        </Link>
      </div>
    </div>
  );
}
