const express = require("express");
const Router = express.Router();
const UserModel = require("../Model/UserModel");
const bcrypt = require("bcrypt");

Router.post("/", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const regex = RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

    if (username.length >= 8 && password.length >= 8 && regex.test(email)) {
      const hashpassword = await bcrypt.hash(password, 10);
      const newUser = new UserModel({
        username: username,
        password: hashpassword,
        email: email,
        theme: "default",
        profilephoto: "uploads/defaultphoto.png",
      });
      const response = await newUser.save();
      const user = await UserModel.find({ username: req.body.username }).select(
        "username theme"
      );
      res.json(user);
    } else {
      throw "password,username should be atleast  8 character each with valid email";
    }
  } catch (err) {
    res.status(302).json("validation error  " + err);
  }
});

Router.post("/checkusername", async (req, res) => {
  const username = req.body.username;
  try {
    const response = await UserModel.exists({ username: username });
    res.json(response);
  } catch (err) {
    res.status(500).send("Internal server error");
  }
});

module.exports = Router;
