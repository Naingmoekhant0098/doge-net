const express = require("express");
const cors = require("cors");
const http = require("http");
const app = express();
const cookieParser = require("cookie-parser");
app.use(express.json());
const connectDb = require("./db/db");
const authRouter = require("./routers/authRouter");
const userRouter = require("./routers/userRouter");
const postRouter = require("./routers/postRouter");
require("dotenv").config();
const path = require('path');

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
const __dir = path.resolve();
const sever = http.createServer(app);

const io = require("socket.io")(sever, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});


const activeUsers = [];

io.on("connection", (socket) => {
  socket.on("new-user-add", (userId) => {
    if (!activeUsers.some((user) => user.userId === userId)) {
      activeUsers.push({
        userId: userId,
        sockedId: socket.id,
      });
    }
    console.log("Connected user", activeUsers);
  });

  socket.on("new-post", (post) => {
    io.emit("new-post-receive", post);
  });
  socket.on("new-comment", (post) => {
    io.emit("new-comment-receive", post);
  });
  socket.on("new-reply", (post) => {
    io.emit("new-reply-receive", post);
  });

  socket.on("send-like", (data) => {
    const isUser = activeUsers?.find((u) => u.userId === data.userId);

    if (isUser) {
      io.emit("receiveLike", data);
    }
  });

  socket.on("like-comment", (data) => {
    const isUser = activeUsers?.find((u) => u.userId === data.userId);

    io.emit("receiveLikeComment", data);
  });

  socket.on("sendNotification", (data) => {
    const isUser = activeUsers?.find((u) => u.userId === data.receiverId);
 
    if (isUser) {
     // console.log("User exist");
      io.to(isUser.sockedId).emit("receiveNotification", data);
    }
  });
  socket.on("like-reply", (data) => {
    const isUser = activeUsers?.find((u) => u.userId === data.userId);

    io.emit("receiveLikeReply", data);

    // io.to(isUser.sockedId).emit("receiveNotification", {...data , type : 'likereplu'});
  });

  socket.on("disconnect", () => {
    activeUsers.filter((u) => u.sockedId != socket.id);
    // activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User disconnected");
  });

  socket.on("error", function (err) {
    console.log("Socket.IO Error");
    console.log(err.stack); // this is changed from your code in last comment
  });
});

app.use(cookieParser());
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/post", postRouter);

app.use(express.static(path.join(__dir,'client/dist')))
app.use('*',(req,res)=>{
    res.sendFile(path.join(__dir,'client','dist','index.html'))
})

sever.listen(3000, (req, res) => {
  console.log("Sever is running at port 3000");
});
