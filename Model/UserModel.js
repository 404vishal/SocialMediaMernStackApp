const Mongoose = require("mongoose");
// const { schema } = require("./Followtemp");
const Scheme = Mongoose.Schema;

const UserSchema = new Scheme(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },
    email: {
      required: true,
      type: String,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/],
    },
    theme: {
      required: true,
      type: String,
    },
    profilephoto: {
      required: true,
      type: String,
    },
    private: {
      type: Boolean,
      default: true,
    },
    followers: [{ type: Mongoose.Types.ObjectId, ref: "Users" }],
    following: [{ type: Mongoose.Types.ObjectId, ref: "Users" }],
    posts: [{ type: Mongoose.Types.ObjectId, ref: "Posts" }],
  },
  { timestamps: true }
);

module.exports = Mongoose.model("Users", UserSchema);
