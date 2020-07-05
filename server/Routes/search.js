const UserModel = require("../Model/UserModel");
const Mongoose = require("mongoose");

const Router = require("express").Router();

Router.get("/:username", async (req, res) => {
  try {
    const user = await UserModel.find({ username: req.params.username })
      .select("username profilephoto private ")
      .populate("followers", "username profilephoto")
      .populate("following", "username profilephoto")
      .populate("posts");

    res.json(user);
  } catch (err) {
    console.log(err);
  }
});

Router.post("/follow", async (req, res) => {
  const response1 = await UserModel.findById(req.body.user_id);
  response1.following.push(req.body.searcheduser_id);
  const sav1 = await response1.save();

  const response2 = await UserModel.findById(req.body.searcheduser_id);
  response2.followers.push(req.body.user_id);
  const sav2 = await response2.save();
  res.json(sav2);
});

Router.post("/unfollow", async (req, res) => {
  const response1 = await UserModel.findById(req.body.user_id);
  const resp1 = response1.following.filter(
    (ele) => ele != req.body.searcheduser_id
  );
  response1.following = resp1;
  const sav1 = await response1.save();

  const response2 = await UserModel.findById(req.body.searcheduser_id);
  const resp2 = response2.followers.filter((ele) => ele != req.body.user_id);
  response2.followers = resp2;
  const sav2 = await response2.save();

  res.json(response1);
});

Router.post("/searchbyusername", async (req, res) => {
  const username = req.body.username;
  const response = await UserModel.find({
    username: { $regex: username, $options: "i" },
  })
    .select("username profilephoto")
    .limit(10);
  res.json(response);
});

module.exports = Router;
