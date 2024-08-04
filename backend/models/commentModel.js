const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    postId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
    replies : {
      type: Array,
      default: [],
    },
    photo: {
      type: String,
    },
    gif: {
      type: String,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("comment", commentSchema);
module.exports = Comment;
