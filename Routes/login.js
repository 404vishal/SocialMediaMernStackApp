const express = require("express");
const Router = express.Router();
const UserModel = require("../Model/UserModel");
const PostModel = require("../Model/PostModel");
const bcrypt = require("bcrypt");

Router.post("/", async (req, res) => {
  try {
    const response = await UserModel.find({
      username: req.body.username,
    });

    const ispassword = await bcrypt.compare(
      req.body.password,
      response[0].password
    );

    if (ispassword) {
      const user = await UserModel.find({ username: req.body.username }).select(
        "username theme"
      );

      res.json({ ispassword, user });
    } else {
      res.json({ ispassword });
    }
  } catch (err) {
    res.json([]);
  }
});

Router.post("/myprofile", async (req, res) => {
  try {
    const user = await UserModel.find({ username: req.body.username })
      .select("username profilephoto private theme")
      .populate("followers", "username profilephoto")
      .populate("following", "username profilephoto")
      .populate({
        path: "posts",
        populate: {
          path: "likes comments",
          select: "username profilephoto commentByUser commentText",
          populate: {
            path: "commentByUser",
            select: "username profilephoto",
          },
        },
      });
    console.log(user);
    res.json(user);
  } catch (err) {
    console.log(err);
  }
});

Router.get("/home/:id", async (req, res) => {
  const user = await UserModel.findById(req.params.id);
  let follow = [...user.following, user._id];
  const response = await PostModel.find({ postedbyUser: follow })
    .populate("likes", "username profilephoto")
    .populate("postedbyUser", "username profilephoto")
    .sort({ createdAt: -1 });
  console.log(response);
  res.json(response);
});

module.exports = Router;
