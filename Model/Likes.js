const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Likes = new Schema({
  likedToPostId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  likedByUser: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model("likes", Likes);
