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

mongoose
  .connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("success"))
  .catch(() => "failure");

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

//serve static assets if it production
if (process.env.NODE_ENV === "production") {
  //set  static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port);
