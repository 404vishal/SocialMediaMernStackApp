const express = require("express");
const Router = express.Router();
const UserModel = require("../Model/UserModel");
const { Types } = require("mongoose");
const multer = require("multer");
const path = require("path");
const PostModel = require("../Model/PostModel");

Router.post("/", async (req, res) => {
  const newus = new Followtemp({
    followedby: req.body.followedby,
    followedto: req.body.followedto,
  });
  const doc = await newus.save();
  res.json(doc);
});

var storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + file.originalname),
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
      cb(null, true);
    } else {
      return cb(res.status(400).end("only jpg png file allowed"), false);
    }
  },
});

var upload = multer({ storage: storage }).single("file");

Router.post("/image/:id", async (req, res) => {
  const id = req.params.id;
  let img = "";

  upload(req, res, async (err) => {
    if (err) {
      return res.json({ success: false, err });
    }
    img = res.req.file.path;

    const response = await UserModel.updateOne(
      { _id: id },
      { $set: { profilephoto: img } }
    );

    res.json({ image: img });
  });
});

Router.post("/addpost/:dat", async (req, res) => {
  const dat = JSON.parse(req.params.dat);
  upload(req, res, async (err) => {
    if (err) {
      return res.json({ success: false, err });
    }
    img = res.req.file.path;

    const newdata = new PostModel({
      postedbyUser: dat.postedbyUser,
      postedimage: res.req.file.path,
      posttext: dat.posttext,
    });
    const response = await newdata.save();

    const ff = await UserModel.findById(dat.postedbyUser);

    ff.posts.push(response._id);
    const ft = await ff.save();
    console.log(response);
    res.json(response);
  });
});

Router.get("/xxy", async (req, res) => {
  const response = await UserModel.findById("5eeadc304b26681b2ccc3e36")
    .select("_id username profilephoto x_followers")
    .populate("x_followers", "_id username profilephoto");

  res.json(response);
});

module.exports = Router;
