const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    commentId: {
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
    photo: {
      type: String,
    },
    gif: {
      type: String,
    },
  },
  { timestamps: true }
);

const Reply = mongoose.model("reply", replySchema);
module.exports = Reply;
