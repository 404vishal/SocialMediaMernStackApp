const mongoose = require("mongoose");
const schema = mongoose.Schema;

const PostModel = new schema(
  {
    postedbyUser: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    postedimage: {
      type: String,
      required: true,
    },
    posttext: {
      type: String,
    },
    likes: [{ type: mongoose.Types.ObjectId, ref: "Users" }],
    comments: [{ type: mongoose.Types.ObjectId, ref: "Comments" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Posts", PostModel);
