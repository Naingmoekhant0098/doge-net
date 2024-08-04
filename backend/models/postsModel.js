const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    gif: {
      type: String,
    },

    images: {
      type: Array,
      default: [],
    },
    likes: {
      type: Array,
      default: [],
    },
    comments: {
      type: Array,
      default: [],
    },
    NoOfComments : {
      type : Number,
      default :0,
    },
    isRepost: {
      type: Boolean,
      default: false,
    },
    tweet_id: {
      type: String,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("posts", postSchema);

module.exports = Post;
