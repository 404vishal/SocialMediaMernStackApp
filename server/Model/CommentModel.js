const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentModel = new Schema({
  commentByUser: { type: mongoose.Types.ObjectId, ref: "Users" },
  commentText: {
    type: String,
  },
});

module.exports = mongoose.model("Comments", CommentModel);
