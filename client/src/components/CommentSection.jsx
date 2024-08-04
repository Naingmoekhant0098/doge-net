import { Avatar } from "flowbite-react";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";

import Comment from "./Comment";
import { BsFiletypeGif, BsImages } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import GifPicker from "gif-picker-react";
import axios from "axios";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CommentSection = ({
  post,
  setPost,
  posts,
  setPosts,
  socket
}) => {
  const [commentData, setCommentData] = useState(null);
  const [tempFiles, setTempFiles] = useState(null);
  const [isOpenGift, setIsOpenGift] = useState(false);
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [comments , setComments] = useState(null)

  useEffect(() => {
    const fetchPost = async () => {
      const ress = await axios.get(
        `http://localhost:3000/post/getComment?postId=${post?._id}`,
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
  }, [post]);
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
        `http://localhost:3000/post/addComment`,
        {
          postId: post?._id,
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
        setSendComment(resData.data.comment);
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
    if (!currentUser) {
      navigate("/log-in");
    }
    if (file) {
      uploadImg();
    } else {
      if (content !== "" || commentData?.gif || tempFiles) {
        try {
          const resData = await axios.put(
            `http://localhost:3000/post/addComment`,
            {
              postId: post?._id,
              comment: content,
              gif: commentData?.gif,
              userId: currentUser?._id,
            },
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );

          if (resData.status === 200) {
            setContent("");
            setCommentData(null);
            setIsOpenGift(false);
            socket.current.emit("new-comment", resData.data.comment);
            // setPost({
            //   ...post,
            //   NoOfComments: post.NoOfComments + 1
  
            //  })
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
    try {
      socket.current.on("new-comment-receive", (data) => {
        if (data && post) {
          setComments((prev) => [data, ...prev]);
           setPost({
            ...post,
            NoOfComments: post?.NoOfComments + 1

           })
           
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  useEffect(() => {
    socket.current.on("new-reply-receive", (data) => {
      
      if (data) {
        setComments(
          comments?.map((cmt) =>
            cmt?._id === data?.commentId
              ? {
                  ...cmt,
                  replies: [...cmt?.replies, data?._id],
                }
              : cmt
          )
        );

        setPost({
          ...post,
          NoOfComments: post?.NoOfComments + 1

         })
      }
    });
  },[]);
  socket.current.on("receiveLikeComment", (like) => {
    if (like && comments) {
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
  const likeComment = async (postId, commentId, userId) => {
     
    try {
      const rest = await axios.put(
        "http://localhost:3000/post/likeComment",
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

        if (rest.data.comment?.likes.includes(currentUser?._id)) {
          socket.current.emit("sendNotification", {
            senderId: currentUser?._id,
            receiverId: rest.data.comment?.userId,
            type: "likeComment",
          });
        }
      }
    } catch (error) {}
  };
  return (
    <div className=" ">
      <div className=" border p-4 border-white rounded-xl border-opacity-10">
        <div className=" flex flex-col gap-3">
          <textarea
            type="text"
            autoFocus
            value={content}
            className=" bg-inherit mt-2 min-h-auto focus:outline-black focus:border-black  text-[14px] outline-none rounded-lg w-full "
            placeholder="Write comment !"
            rows={3}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className=" flex  items-center justify-between">
            {tempFiles || commentData?.gif ? (
              <div className=" flex gap-2    overflow-auto scrollBar">
                {tempFiles && (
                  <div className=" relative">
                    <RxCross2
                      className=" absolute top-1 text-2xl bg-slate-200 bg-opacity-70 rounded-full p-1   cursor-pointer  font-semibold transition-all duration-300 hover:opacity-80 right-2 text-black"
                      onClick={() => setTempFiles(null)}
                    />
                    <img
                      src={tempFiles}
                      className=" cursor-pointer max-w-[100px] h-[100px] object-cover rounded-lg"
                    />
                  </div>
                )}

                {commentData?.gif && (
                  <div className=" relative">
                    <RxCross2
                      className=" absolute top-1 text-2xl bg-slate-200 bg-opacity-70 rounded-full p-1   cursor-pointer  font-semibold transition-all duration-300 hover:opacity-80 right-2 text-black"
                      onClick={() => {
                        (commentData.gif = null), setIsOpenGift(false);
                      }}
                    />
                    <img
                      src={commentData?.gif}
                      className=" cursor-pointer max-w-[250px] max-h-[100px] object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className=" flex gap-6 items-center text-xl flex-1">
                <BsImages
                  onClick={() => fileRef.current.click()}
                  className=" cursor-pointer  transition-all duration-300 hover:opacity-60"
                />

                <BsFiletypeGif
                  className=" cursor-pointer  transition-all duration-300 hover:opacity-60"
                  onClick={() => setIsOpenGift(true)}
                />
                <span
                  onClick={() => setContent((prev) => prev + "@")}
                  className=" cursor-pointer  transition-all duration-300 hover:opacity-60"
                >
                  @
                </span>
                <input
                  type="file"
                  onChange={uploadHandler}
                  className=" hidden"
                  ref={fileRef}
                />
                <div
                  className={`  w-full h-screen bg-black bg-opacity-55 left-0 right-0 bottom-0 top-0 z-50  transition-all duration-300 fixed ${
                    isOpenGift ? "visible opacity-100" : " invisible opacity-0"
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
                        tenorApiKey={"AIzaSyBTEXOWGAoVhlpuQw1_oJijFF7hgCTI4Pw"}
                        theme="dark"
                        onGifClick={(e) => {
                          // setGif(e.url);
                          setCommentData({ ...commentData, gif: e.url });
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <button
              onClick={commentHandler}
              className={`  max-w-[80px] max-h-[50px] flex-1 text-[14px] text-center mt-1 border p-2 font-medium tracking-wide bg-white    rounded-lg  transition-all duration-300 text-black hover:text-opacity-70 
                ${
                  content !== "" || commentData?.gif || tempFiles
                    ? " cursor-pointer"
                    : " cursor-not-allowed"
                }
              `}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
      <div className=" mt-6 flex flex-col  gap-4 pb-20">
        {comments?.length > 0 &&
          comments?.map((cmt, index) => {
            return (
              <Comment
                
                key={index}
                cmt={cmt}
                likeComment={likeComment}
                postId={post?._id}
                socket={socket}
              />
            );
          })}
      </div>
    </div>
  );
};

export default CommentSection;
