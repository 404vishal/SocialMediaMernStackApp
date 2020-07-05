const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const env = require("dotenv").config();
const app = express();
const path = require("path");

const signup = require("./Routes/signup");
const login = require("./Routes/login");
const temp = require("./Routes/temp");
const eds = require("./Routes/edituser");
const setting = require("./Routes/setting");
const post = require("./Routes/post");
const search = require("./Routes/search");

app.use(cors());
app.use(express.json());
app.use("/signup", signup);
app.use("/login", login);
app.use("/temp", temp);
app.use(express.static("./"));
app.use("/edituser", eds);
app.use("/setting", setting);
app.use("/post", post);
app.use("/search", search);

mongoose
  .connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("success"))
  .catch(() => "failure");

if (process.env.NODE_ENV === "production") {
  app.use(express.static("../client/build"));
}

const port = process.env.PORT || 5000;

app.listen(port);
