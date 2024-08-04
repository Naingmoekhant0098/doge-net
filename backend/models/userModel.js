const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    birthday: {
      type: Date,
      default: new Date(),
    },
    bio: {
      type: String,
    },
    profile: {
      type: String,
      default:
        "https://i.pinimg.com/564x/1c/b3/77/1cb37778107856d56e05d378db46eda9.jpg",
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    notifications: {
      type: Array,
      default: [],
    },
    saves: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);
module.exports = User;
