const express = require("express");
const Router = express.Router();
const mongoose = require("mongoose");
const UserModel = require("../Model/UserModel");

Router.post("/theme", async (req, res) => {
  const data = await UserModel.updateOne(
    { _id: req.body.id },
    { $set: { theme: req.body.theme, private: req.body.private } }
  );

  res.json(data);
});

module.exports = Router;
