import React from "react";
import { Link } from "react-router-dom";

export default function SearchBox(props) {
  return (
    <div>
      <Link to={`/search/${props.name}`}>
        <div className="lr">
          <div>
            <img
              src={`http://localhost:5000/${props.profilephoto}`}
              alt=""
              className="lr_image"
            />
          </div>
          <div className="lr_username">
            <p>{props.name}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
