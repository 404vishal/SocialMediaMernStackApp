import React from "react";
import "./Loading.css";
import Ripple from "../Navbar/images/Ripple.gif";

export default function Loading() {
  return (
    <div className="loadingdiv">
      <div className="loadingimg">
        <img src={Ripple} alt="" />
        <p>Loading ...</p>
      </div>
    </div>
  );
}
