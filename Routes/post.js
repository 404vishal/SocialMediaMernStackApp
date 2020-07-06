const Router = require("express").Router();
const PostModel = require("../Model/PostModel");
const mongoose = require("mongoose");
const CommentModel = require("../Model/CommentModel");
const UserModel = require("../Model/UserModel");

Router.get("/:id", async (req, res) => {
  try {
    const response = await PostModel.findById(req.params.id)
      .populate("postedbyUser likes", "username profilephoto")
      .populate({
        path: "comments",
        populate: { path: "commentByUser", select: "username profilephoto" },
      });
    console.log(response);
    res.json(response);
  } catch (err) {
    console.log(err);
  }
});

Router.post("/unlike", async (req, res) => {
  const post = await PostModel.findById(req.body.postid);
  const likes = post.likes.filter((ele) => ele != req.body.userid);
  post.likes = likes;
  await post.save();
  res.json(true);
});

Router.post("/like", async (req, res) => {
  const post = await PostModel.findById(req.body.postid);
  post.likes.push(req.body.userid);
  await post.save();
  res.json(true);
});

Router.post("/commentadd", async (req, res) => {
  const newcomment = new CommentModel({
    commentByUser: req.body.userid,
    commentText: req.body.commentText,
  });
  const comres = await newcomment.save();

  const post = await PostModel.findById(req.body.postid);
  post.comments.push(comres._id);
  await post.save();

  res.json(comres);
});

module.exports = Router;
