import React, { useState } from "react";
import "../Navbar/Navbar.css";
import Spinner from "./images/Spinner.gif";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../Action/Action";
import axios from "axios";
import SearchBox from "../SearchBox/SearchBox";

export default function Navbar() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.UserReducer);
  const [searchuser, setsearchuser] = useState([]);

  const hamburgerClick = () => {
    const ul = document.getElementById("ul");
    if (ul.classList.contains("displayblock")) {
      ul.classList.remove("displayblock");
    } else {
      ul.classList.add("displayblock");
    }
  };

  const Remove = () => {
    dispatch(removeUser());
    localStorage.removeItem("UserManiac");
    document.body.classList.remove("scrolloff");
  };

  const searchhandle = async () => {
    const searched = document.getElementById("searched");
    const fr = document.querySelector(".fr");
    console.log(searched.value);
    if (searched.value.length > 0) {
      document.getElementById("spinner").classList.add("disblock");
      const response = await axios.post(
        "http://localhost:5000/search/searchbyusername",
        { username: searched.value }
      );
      console.log(response.data);
      setsearchuser(response.data);
      document.getElementById("spinner").classList.remove("disblock");
      if (response.data.length) {
        fr.classList.remove("displaynone");
      } else {
        fr.classList.add("displaynone");
      }
    } else {
      fr.classList.add("displaynone");
    }
  };

  return (
    <div className="navbar">
      <div className="navbarcontainer">
        <h1 className="appname">Maniac</h1>
        <div className="mag">
          <div className="searchboxdiv">
            <input
              type="text"
              className="searchbox"
              placeholder="search user"
              id="searched"
              autoComplete="off"
              onChange={(e) => {
                searchhandle();
              }}
            />
            <img className="spinner" id="spinner" src={Spinner} alt="loading" />
          </div>
          <div className="fr displaynone">
            {searchuser.map((ele) => (
              <SearchBox
                name={ele.username}
                profilephoto={ele.profilephoto}
                key={ele.username}
              ></SearchBox>
            ))}
          </div>
        </div>
        <div className="hamburderdiv">
          <i
            className="fa fa-bars"
            aria-hidden="true"
            onClick={hamburgerClick}
          ></i>
        </div>
        <ul id="ul">
          <li>
            <Link to="/">
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link to="/MyProfile">
              <span>Profile</span>
            </Link>
          </li>
          <li>
            <Link to="/Setting">
              <span>Setting</span>
            </Link>
          </li>
          <li>
            <a
              onClick={() => {
                document.getElementById("model").classList.add("disblock");
                document.body.classList.add("scrolloff");
              }}
            >
              Logout
            </a>
          </li>
        </ul>
      </div>
      <div className="model" id="model">
        <div className="mod">
          <h3 className="modeltext">Do you want to log out ?</h3>
          <button className="modelbtn" onClick={Remove}>
            Yes
          </button>
          <button
            className="modelbtn"
            onClick={() => {
              document.getElementById("model").classList.remove("disblock");
              document.body.classList.remove("scrolloff");
            }}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
