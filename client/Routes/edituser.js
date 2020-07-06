const Router = require("express").Router();
const UserModel = require("../client/Model/UserModeldel");
const bcrypt = require("bcrypt");

Router.post("/username", async (req, res) => {
  const response = await UserModel.updateOne(
    { username: req.body.oldusername },
    { $set: { username: req.body.newusername } }
  );
  res.json(response);
});

Router.post("/email", async (req, res) => {
  const response = await UserModel.updateOne(
    { username: req.body.username },
    { $set: { email: req.body.email } }
  );
  res.json(response);
});

Router.post("/password", async (req, res) => {
  const hashpassword = await bcrypt.hash(req.body.password, 10);
  const response = await UserModel.updateOne(
    { username: req.body.username },
    { $set: { password: hashpassword } }
  );
  res.json(hashpassword);
});

Router.post("/both", async (req, res) => {
  const response = await UserModel.updateOne(
    { username: req.body.oldusername },
    { $set: { email: req.body.email, username: req.body.newusername } }
  );
  res.json(response);
});

Router.post("/checkpassword", async (req, res) => {
  const response = await UserModel.find({
    username: req.body.username,
  });
  const ispassword = await bcrypt.compare(
    req.body.password,
    response[0].password
  );

  res.json(ispassword);
});

module.exports = Router;
