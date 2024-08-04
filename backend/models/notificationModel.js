const mongoose = require("mongoose");

const notiSchema = new mongoose.Schema(
  {
    senderId: {
      type: String,
    },
    receiverId: {
      type: String,
    },
    postId: {
      type: String,
     
    },
    type: {
      type: String,
    },
  },
  { timestamps: true }
);

const noti = mongoose.model("notifications", notiSchema);
module.exports = noti;
