import axios from "axios";
import { Button, Drawer, TextInput } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { CiBookmark } from "react-icons/ci";
import { GoReport } from "react-icons/go";
import { IoEyeOffOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import Comment from "./Comment";
import GifPicker from "gif-picker-react";
import { BsFiletypeGif, BsImages } from "react-icons/bs";
import { FaArrowUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

const MbComment = ({
  isOpenm,
  setIsOpenm,
  postId,
  cmt,
  rps,
  postedUser,
  socket,
  setComment,
  setRep,
}) => {
  const [commentData, setCommentData] = useState(null);
  const [tempFiles, setTempFiles] = useState(null);
  const [isOpenGift, setIsOpenGift] = useState(false);
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const [isReply, setIsReply] = useState(false);
  const [commentId, setCommentId] = useState(null);
  const [replyUser, setReplyUser] = useState(null);
  const [reply, setReply] = useState(null);
  const [replyData, setReplyData] = useState(null);
  const navigate = useNavigate();
  const [comments, setComments] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const ress = await axios.get(
        `https://doge-net.onrender.com/post/getComment?postId=${postId}`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (ress.status === 200) {
        setComments(ress.data.comments);
      }
    };

    fetchPost();
  }, [postId]);

  const uploadHandler = (e) => {
    if (e.target.files) {
      const temp_fileLink = URL.createObjectURL(e.target.files[0]);
      setFile(e.target.files[0]);
      setTempFiles(temp_fileLink);
    }
  };
  const fileRef = useRef();
  const uploadImg = () => {
    let toId = toast.loading("Posting...", {
      style: {
        text: "10px",
        padding: "3px",
      },
    });
    const storage = getStorage(app);
    const fileName = new Date().getTime() + "_" + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (err) => {
        console.log(err.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          // uploadComent();
          postSave(downloadUrl, toId);
        });
      }
    );
  };

  const postSave = async (savedFile, toId) => {
    if (savedFile) {
      const resData = await axios.put(
        `https://doge-net.onrender.com/post/addComment`,
        {
          postId: postId,
          comment: content,
          gif: commentData?.gif,
          image: savedFile,
          userId: currentUser?._id,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (resData.status === 200) {
        // setComments((prev) => [resData.data.comment, ...prev]);
        socket.current.emit("new-comment", resData.data.comment);
        //setComment((prev) => [...prev, resData.data.comment]);

        // setPosts(
        //   posts?.map((pt) =>
        //     pt?._id === resData.data.comment?.postId
        //       ? {
        //           ...pt,
        //           NoOfComments: pt.NoOfComments + 1,
        //         }
        //       : pt
        //   )
        // );

        const resNofi = await axios.put(
          "https://doge-net.onrender.com/user/updateNotification",
          {
            senderId: currentUser?._id,
            receiverId: postedUser,
            type: "commented",
            postId: resData.data.comment?.postId,
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        if (resNofi.status === 200) {
          socket.current.emit("sendNotification", resNofi.data);
        }

        setContent("");
        setCommentData(null);
        setIsOpenGift(false);
        setTempFiles(null);
        setFile(null);

        toast(
          "success commented",
          {
            position: "bottom-center",
          },
          {
            style: {
              text: "10px",
              padding: "3px",
            },
          }
        );
        toast.dismiss(toId);
      }
    }
  };

  const commentHandler = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigate("/log-in");
    }
    if (file) {
      uploadImg();
    } else {
      if (content !== "" || commentData?.gif || tempFiles) {
        try {
          const resData = await axios.put(
            `https://doge-net.onrender.com/post/addComment`,
            {
              postId: postId,
              comment: content,
              gif: commentData?.gif,
              userId: currentUser?._id,
            },
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );
          // console.log(resData);

          if (resData.status === 200) {
            setContent("");
            setCommentData(null);
            setIsOpenGift(false);
          
           

            socket.current.emit("new-comment1", resData.data.comment);

           // setComment((prev) => [...prev, resData.data.comment]);

            const resNofi = await axios.put(
              "https://doge-net.onrender.com/user/updateNotification",
              {
                senderId: currentUser?._id,
                receiverId: postedUser,
                type: "commented",
                postId: resData.data.comment?.postId,
              },
              {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
              }
            );

            if (resNofi.status === 200) {
              socket.current.emit("sendNotification", resNofi.data);
            }

            toast(
              "success commented",

              {
                style: {
                  text: "10px",
                  padding: "3px",
                },
              }
            );
          }
        } catch (error) {
          console.log(error.message);
        }
      }
    }
  };

  useEffect(() => {
     
      socket.current.on("new-comment-receive1", (data) => {
 
        if (data) {
          setComments((prev) => [data, ...prev]);
        }
      });
     
  }, []);

  useEffect(() => {
    if (isOpenm) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpenm]);

  const likeComment = async (postId, commentId, userId) => {
    try {
      const rest = await axios.put(
        "https://doge-net.onrender.com/post/likeComment",
        { postId, commentId, userId },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (rest.status === 200) {
        // setLikeComment(rest.data.comment);

        socket.current.emit("like-comment", {
          ...rest.data.comment,
          senderId: currentUser?._id,
        });

        if (
          rest.data.comment?.likes?.includes(currentUser?._id) &&
          currentUser?._id !== rest.data.comment?.userId
        ) {
          const resNofi = await axios.put(
            "https://doge-net.onrender.com/user/updateNotification",
            {
              senderId: currentUser?._id,
              receiverId: rest.data.comment?.userId,
              type: "likeComment",
              postId: rest.data.comment?.postId,
            },
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );

          if (resNofi.status === 200) {
            socket.current.emit("sendNotification", resNofi.data);
          }
        }

        // if (rest.data.comment?.likes.includes(currentUser?._id)) {
        //   socket.current.emit("sendNotification", {
        //     senderId: currentUser?._id,
        //     receiverId: rest.data.comment?.userId,
        //     type: "likeComment",
        //   });
        // }
      }
    } catch (error) {}
  };

  socket.current.on("receiveLikeComment", (like) => {
    if (like) {
      setComments(
        comments?.map((pt) =>
          pt._id === like._id
            ? {
                ...pt,
                likes: like.likes,
              }
            : pt
        )
      );
    }
  });

  const controlReply = (status, commentId, user) => {
    setIsReply(status);
    setCommentId(commentId);
    setReplyUser(user);

    // setReply(`@${user}`);
  };

  const uploadImg1 = () => {
    let toId = toast.loading("Posting...", {
      style: {
        text: "10px",
        padding: "3px",
      },
    });
    const storage = getStorage(app);
    const fileName = new Date().getTime() + "_" + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (err) => {
        console.log(err.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          // uploadComent();
          ReplySave(downloadUrl, toId);
        });
      }
    );
  };
  const ReplySave = async (savedFile, toId) => {
    if (savedFile) {
      const resData = await axios.put(
        `https://doge-net.onrender.com/post/addReply`,
        {
          postId: postId,
          commentId: commentId,
          comment: content,
          gif: replyData?.gif,
          image: savedFile,
          userId: currentUser?._id,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (resData.status === 200) {
        // setComments((prev) => [resData.data.comment, ...prev]);

        setReply("");
        setReplyData(null);
        setIsOpenGift(false);
        setTempFiles(null);
        setFile(null);
        socket.current.emit("new-reply", {
          ...resData.data.reply,
          senderId: currentUser?._id,
        });
        const resNofi = await axios.put(
          "https://doge-net.onrender.com/user/updateNotification",
          {
            senderId: currentUser?._id,
            receiverId: resData.data.reply?.userId,
            type: "replied",
            postId: resData.data.reply?.postId,
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        if (resNofi.status === 200) {
          socket.current.emit("sendNotification", resNofi.data);
        }

        //setRep((prev) => [...prev, resData.data.reply]);

        toast(
          "success commented",
          {
            position: "bottom-center",
          },
          {
            style: {
              text: "10px",
              padding: "3px",
            },
          }
        );
        toast.dismiss(toId);
      }
    }
  };

  const replyHandler = async () => {
    if (!currentUser) {
      navigate("/log-in");
    }
    if (file) {
      uploadImg1();
    } else {
      if (reply !== "" || commentData?.gif || tempFiles) {
        try {
          const resData = await axios.put(
            `https://doge-net.onrender.com/post/addReply`,
            {
              postId: postId,
              commentId: commentId,
              comment: reply,
              gif: replyData?.gif,
              userId: currentUser?._id,
            },
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );

          if (resData.status === 200) {
            setIsReply(false);
            setReply("");
            setReplyData(null);
            setIsOpenGift(false);
            socket.current.emit("new-reply1", {
              ...resData.data.reply,
              senderId: currentUser?._id,
            });

            //setRep([...rps, resData.data.reply]);

            const resNofi = await axios.put(
              "https://doge-net.onrender.com/user/updateNotification",
              {
                senderId: currentUser?._id,
                receiverId: replyUser?._id,
                type: "replied",
                postId: resData.data.reply?.postId,
              },
              {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
              }
            );

            if (resNofi.status === 200) {
              socket.current.emit("sendNotification", resNofi.data);
            }

            toast(
              "success commented",

              {
                style: {
                  text: "10px",
                  padding: "3px",
                },
              }
            );
          }
        } catch (error) {
          console.log(error.message);
        }
      }
    }
  };

  socket.current.on("new-reply-receive1", (data) => {
    if (data && comments) {
      setComments(
        comments?.map((cmt) =>
          cmt?._id === data?.commentId
            ? {
                ...cmt,
                replies: [...cmt?.replies, data._id],
              }
            : cmt
        )
      );

      setRep([...rps, data]);
    }
  });

  return (
    <div className="  z-50    relative">
      <Drawer
        open={isOpenm}
        onClose={() => setIsOpenm(!isOpenm)}
        position="bottom"
        className=" p-6 pt-0 transition-all  pb-28  duration-300  rounded-[20px] rounded-b bg-[#1e1f22] text-white h-[70vh] scrollBar"
      >
        <Drawer.Items className=" relative">
          <div className=" w-full flex justify-between mb-0 sticky top-0 bg-[#1e1f22] py-4 z-10">
            <div>Comments</div>
            <RxCross2
              className=" text-2xl self-end cursor-pointer"
              onClick={() => setIsOpenm(false)}
            />
          </div>

          <div className=" px-5 mb-3">
            <hr className=" opacity-15" />
          </div>

          <div className=" mt-6 flex flex-col  gap-4  overflow-y-auto">
            {comments?.length > 0 ? (
              comments?.map((cmt, index) => {
                return (
                  <Comment
                    key={index}
                    cmt={cmt}
                    likeComment={likeComment}
                    postId={postId}
                    controlReply={controlReply}
                    socket={socket}
                  />
                );
              })
            ) : (
              <h4 className=" ml-3  opacity-55">There's no comments yet !</h4>
            )}
          </div>

          <div className=" w-full flex  flex-col fixed px-4 gap-3 bottom-0 left-0 right-0 bg-[#1e1f22] py-4 z-30">
            {isReply ? (
              <>
                <div className=" flex gap-2    overflow-auto scrollBar">
                  {tempFiles && (
                    <div className=" relative">
                      <RxCross2
                        className=" absolute top-1 text-2xl bg-slate-200 bg-opacity-70 rounded-full p-1   cursor-pointer  font-semibold transition-all duration-300 hover:opacity-80 right-2 text-black"
                        onClick={() => setTempFiles(null)}
                      />
                      <img
                        src={tempFiles}
                        className=" cursor-pointer max-w-[120px] h-[100px] object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {replyData?.gif && (
                    <div className=" relative">
                      <RxCross2
                        className=" absolute top-1 text-2xl bg-slate-200 bg-opacity-70 rounded-full p-1   cursor-pointer  font-semibold transition-all duration-300 hover:opacity-80 right-2 text-black"
                        onClick={() => {
                          setReplyData((replyData.gif = null)),
                            setIsOpenGift(false);
                        }}
                      />
                      <img
                        src={replyData?.gif}
                        className=" cursor-pointer max-w-[250px] max-h-[100px] object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
                <div className=" w-full flex-1 flex justify-between items-center p-3 rounded-md bg-[#343536]">
                  <span className=" text-sm">
                    {" "}
                    Replying to {replyUser?.username}
                  </span>
                  <RxCross2
                    className=" cursor-pointer "
                    onClick={() => {
                      setIsReply(false);
                      setReplyData(null);
                      setTempFiles(null);
                    }}
                  />
                </div>
                <div className=" w-full flex  gap-3">
                  <div className=" flex  gap-6 items-center text-xl">
                    {!tempFiles && !replyData?.gif && (
                      <>
                        <BsImages
                          onClick={() => fileRef.current.click()}
                          className=" cursor-pointer  transition-all duration-300 hover:opacity-60"
                        />

                        <BsFiletypeGif
                          className=" cursor-pointer  transition-all duration-300 hover:opacity-60"
                          onClick={() => setIsOpenGift(true)}
                        />
                      </>
                    )}

                    <input
                      type="file"
                      onChange={uploadHandler}
                      className=" hidden"
                      ref={fileRef}
                    />
                    <div
                      className={`  w-full h-screen bg-black bg-opacity-55 left-0 right-0 bottom-0 top-0 z-50  transition-all duration-300 fixed ${
                        isOpenGift
                          ? "visible opacity-100"
                          : " invisible opacity-0"
                      }`}
                    >
                      <div className="   text-sm h-full w-full flex-col flex items-center justify-center ">
                        <div>
                          <div className=" flex items-center justify-end">
                            <RxCross2
                              className=" text-2xl mb-4 cursor-pointer   font-bold"
                              onClick={() => setIsOpenGift(false)}
                            />
                          </div>
                          <GifPicker
                            tenorApiKey={
                              "AIzaSyBTEXOWGAoVhlpuQw1_oJijFF7hgCTI4Pw"
                            }
                            theme="dark"
                            onGifClick={(e) => {
                              setReplyData({ ...replyData, gif: e.url });
                              setIsOpenGift(false);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className=" flex-1 flex items-center gap-2">
                    <input
                      autoFocus
                      className=" flex-1 px-3 py-3 rounded-lg  focus:border-none focus:outline-none text-sm bg-[#3d3e41]"
                      placeholder={`Replying to ${replyUser}`}
                      onChange={(e) => setReply(e.target.value)}
                      value={reply}
                    />
                    <div
                      className={` bg-white text-black p-3 px-4 rounded-lg   opacity-40 transition duration-300 hover:opacity-100   ${
                        reply !== "" || replyData?.gif || tempFiles
                          ? " cursor-pointer"
                          : " cursor-not-allowed"
                      }`}
                      onClick={replyHandler}
                    >
                      <FaArrowUp />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className=" flex gap-2    overflow-auto scrollBar">
                  {tempFiles && (
                    <div className=" relative">
                      <RxCross2
                        className=" absolute top-1 text-2xl bg-slate-200 bg-opacity-70 rounded-full p-1   cursor-pointer  font-semibold transition-all duration-300 hover:opacity-80 right-2 text-black"
                        onClick={() => setTempFiles(null)}
                      />
                      <img
                        src={tempFiles}
                        className=" cursor-pointer max-w-[120px] h-[100px] object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {commentData?.gif && (
                    <div className=" relative">
                      <RxCross2
                        className=" absolute top-1 text-2xl bg-slate-200 bg-opacity-70 rounded-full p-1   cursor-pointer  font-semibold transition-all duration-300 hover:opacity-80 right-2 text-black"
                        onClick={() => {
                          setCommentData((commentData.gif = null)),
                            setIsOpenGift(false);
                        }}
                      />
                      <img
                        src={commentData?.gif}
                        className=" cursor-pointer max-w-[250px] max-h-[100px] object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div className=" w-full flex  gap-3">
                  <div className=" flex  gap-6 items-center text-xl">
                    {!tempFiles && !commentData?.gif && (
                      <>
                        <BsImages
                          onClick={() => fileRef.current.click()}
                          className=" cursor-pointer  transition-all duration-300 hover:opacity-60"
                        />

                        <BsFiletypeGif
                          className=" cursor-pointer  transition-all duration-300 hover:opacity-60"
                          onClick={() => setIsOpenGift(true)}
                        />
                      </>
                    )}

                    <input
                      type="file"
                      onChange={uploadHandler}
                      className=" hidden"
                      ref={fileRef}
                    />
                    <div
                      className={`  w-full h-screen bg-black bg-opacity-55 left-0 right-0 bottom-0 top-0 z-50  transition-all duration-300 fixed ${
                        isOpenGift
                          ? "visible opacity-100"
                          : " invisible opacity-0"
                      }`}
                    >
                      <div className="   text-sm h-full w-full flex-col flex items-center justify-center ">
                        <div>
                          <div className=" flex items-center justify-end">
                            <RxCross2
                              className=" text-2xl mb-4 cursor-pointer   font-bold"
                              onClick={() => setIsOpenGift(false)}
                            />
                          </div>
                          <GifPicker
                            tenorApiKey={
                              "AIzaSyBTEXOWGAoVhlpuQw1_oJijFF7hgCTI4Pw"
                            }
                            theme="dark"
                            onGifClick={(e) => {
                              setCommentData({ ...commentData, gif: e.url });
                              setIsOpenGift(false);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=" flex-1 flex items-center gap-2">
                    <input
                      className=" flex-1 px-3 py-3 rounded-lg  focus:border-none focus:outline-none text-sm bg-[#3d3e41]"
                      placeholder=" Write comment here !"
                      onChange={(e) => setContent(e.target.value)}
                      value={content}
                    />
                    <div
                      className={` bg-white text-black p-3 px-4 rounded-lg   opacity-40 transition duration-300 hover:opacity-100   ${
                        content !== "" || commentData?.gif || tempFiles
                          ? " cursor-pointer"
                          : " cursor-not-allowed"
                      }`}
                      onClick={commentHandler}
                    >
                      <FaArrowUp />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </Drawer.Items>
      </Drawer>
    </div>
  );
};

export default MbComment;
