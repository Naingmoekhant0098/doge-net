import axios from "axios";
import { Avatar, Textarea } from "flowbite-react";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineRetweet } from "react-icons/ai";
import { CiShare1 } from "react-icons/ci";
import { FaCheck, FaHeart, FaPlus, FaRegHeart } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import { HiDotsHorizontal } from "react-icons/hi";
import { BsFiletypeGif, BsImages } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import GifPicker from "gif-picker-react";
import { useDispatch, useSelector } from "react-redux";
import ImageShow from "../pages/ImageShow";
import { Link, useNavigate } from "react-router-dom";
import { getStorage } from "firebase/storage";
import toast from "react-hot-toast";
import { updateFollow } from "../Slice/userSlice";
import ReactTimeAgo from "react-time-ago";
const Reply = ({
  controlReply,
  comment,

  postId,
  cmtId,
  replyHandler,
  setFile,

  socket,
}) => {
  const { currentUser } = useSelector((state) => state.user);
  const [user, setUser] = useState(null);
  const [currentImg, setCurrentImg] = useState(null);
  const [isShow, setIsShow] = useState(false);
  const [isReply, setIsReply] = useState(false);
  const [commentData, setCommentData] = useState(null);
  const [tempFiles, setTempFiles] = useState(null);
  const [isOpenGift, setIsOpenGift] = useState(false);
  const [content, setContent] = useState("");
  const [commentId, setCommentId] = useState(null);
  // const [file, setFile] = useState(null);
  const [replies, setReplies] = useState([]);
  const dispatch = useDispatch()

  useEffect(() => {
    try {
      const fetchUser = async () => {
        const ress = await axios.get(
          `http://localhost:3000/user/getUser?userId=${replies?.userId}`,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        if (ress.status === 200) {
          setUser(ress.data.user);
        }
      };
      fetchUser();
    } catch (error) {
      console.log(error.message);
    }
  }, [replies]);

  useEffect(() => {
    try {
      const fetchRep = async () => {
        const ress = await axios.get(
          `http://localhost:3000/post/getReply?replyId=${comment}&&commentId=${cmtId}`,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        if (ress.status === 200) {
          setReplies(ress.data.reply);
        }
      };
      fetchRep();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  useEffect(() => {
    socket.current.on("receiveLikeReply", (like) => {
      if (like) {
        if (replies?._id === like?._id) {
          setReplies({
            ...replies,
            likes: like?.likes,
          });
        }
      }
    });
  });
  const navigate = useNavigate();
  const uploadHandler = (e) => {
    if (e.target.files) {
      const temp_fileLink = URL.createObjectURL(e.target.files[0]);
      setFile(e.target.files[0]);
      setTempFiles(temp_fileLink);
    }
  };
  const fileRef = useRef();

  const replyLike = async (replyId, userId) => {
    try {
      const rest = await axios.put(
        "http://localhost:3000/post/likeReply",
        { userId, replyId },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (rest.status === 200) {
        // setLikeReply(rest.data.reply);

        socket.current.emit("like-reply", {
          ...rest.data.reply,
          senderId: currentUser?._id,
        });

        if (
          rest.data.reply?.likes?.includes(currentUser?._id) &&
          currentUser?._id !== rest.data.reply?.userId
        ) {
          const resNofi = await axios.put(
            "http://localhost:3000/user/updateNotification",
            {
              senderId: currentUser?._id,
              receiverId: rest.data.reply?.userId,
              type: "likeReply",
              postId: rest.data.reply?.postId,
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

        // if (rest.data.reply?.likes?.includes(currentUser?._id)) {
        //   socket.current.emit("sendNotification", {
        //     senderId: currentUser?._id,
        //     receiverId: rest.data.reply?.userId,
        //     type: "likeReply",
        //   });
        // }
      }
    } catch (error) {}
  };

  const handleFollow = async () => {
    try {
      const ress = await axios.put(
        "http://localhost:3000/post/followUser",
        { followUser: user._id, followedUser: currentUser?._id },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (ress.status === 200) {
        dispatch(updateFollow(ress.data.user));
        if (ress.data.followedUser._id === user?._id) {
          setUser({ ...user, followers: ress.data.followedUser.followers });
        }
        if (ress.data.user.followings.includes(user?._id)) {
          const resNofi = await axios.put(
            "http://localhost:3000/user/updateNotification",
            {
              senderId: currentUser?._id,
              receiverId: user?._id,
              type: "followed",
            },
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );

          if (resNofi.status === 200) {
            socket.current.emit("sendNotification", resNofi.data);
          }
        } else {
          socket.current.emit("sendNotification", {
            senderId: currentUser?._id,
            receiverId: user?._id,
            type: "unfollow",
          });
        }
      }
    } catch (error) {}
  };

  return (
    <div className="">
      <div className="flex h-auto  gap-2 mb-3">
        <div className=" h-auto flex flex-col items-center">
          <div className=" w-10 h-auto relative cursor-pointer">
            <Avatar img={user?.profile} rounded size={"sm"} />
            <div className=" bg-white text-black border-2 border-black rounded-full absolute  bottom-0 -right-1">
              {currentUser?._id != user?._id && (
                <div className=" bg-white text-black border-2 border-black rounded-full absolute  -bottom-1 -right-1">
                  {currentUser?.followings?.includes(user?._id) ? (
                    <FaCheck
                      className="text-md md:text-lg md:p-[3px] p-[4px]"
                      onClick={() => handleFollow()}
                    />
                  ) : (
                    <FaPlus
                      className=" text-md md:text-lg md:p-[3px] p-[4px]"
                      onClick={() => handleFollow()}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
          {/* <span className=" w-2 h-full    border-l-2 mt-2    opacity-15  z-0"></span> */}
        </div>

        <div className="h-auto  flex-1">
          <div className=" flex items-center   justify-between">
            <div className=" flex items-center gap-1  justify-center">
              <div className=" text-sm">{user?.username}</div>
              <div className=" text-[12px] opacity-50 mt-[3px]">
                {/* {moment(replies?.createdAt).fromNow()} */}
               
               {replies?.createdAt && <ReactTimeAgo date={replies?.createdAt} locale="en-US" timeStyle={'twitter'}/>}
              </div>
            </div>

            <div>
              <HiDotsHorizontal />
            </div>
          </div>

          <div className=" text-sm mt-1">{replies?.content}</div>
          {replies?.gif && (
            <img
              src={replies?.gif}
              className=" w-[200px] mt-2 h-[250px]  object-cover rounded-lg"
              alt="not found"
              onClick={() => {
                setIsShow(true);
                setCurrentImg(replies?.gif);
              }}
            />
          )}
          {replies?.photo && (
            <img
              src={replies?.photo}
              className=" w-[200px] mt-2 h-[250px]  object-cover rounded-lg"
              alt="not found"
              onClick={() => {
                setIsShow(true);
                setCurrentImg(replies?.photo);
              }}
            />
          )}

          <div className=" mt-2 flex items-center gap-2">
            {replies?.likes?.includes(currentUser?._id) ? (
              <div
                className=" flex items-cent,er gap-1  transition-all duration-300 hover:bg-[#1e1f22] cursor-pointer   p-2 rounded-full"
                onClick={() => replyLike(replies?._id, currentUser?._id)}
              >
                <FaHeart className=" text-xl  isHeart " />
                <div className=" text-sm">{replies?.likes?.length}</div>
              </div>
            ) : (
              <div
                className=" flex items-center gap-1  transition-all duration-300 hover:bg-[#1e1f22] cursor-pointer   p-2 rounded-full"
                onClick={() => replyLike(replies?._id, currentUser?._id)}
              >
                <FaRegHeart className=" text-xl " />
                <div className=" text-sm">{replies?.likes?.length}</div>
              </div>
            )}
            <div
              className=" md:hidden flex items-center gap-1 transition-all duration-300 hover:bg-[#1e1f22] cursor-pointer p-1 rounded-full"
              onClick={() => {
                controlReply(true, cmtId, user);
              }}
            >
              <FiMessageCircle className=" text-xl" />
            </div>
            <div
              className="hidden md:flex items-center gap-1 transition-all duration-300 hover:bg-[#1e1f22] cursor-pointer p-1 rounded-full"
              onClick={() => {
                setIsReply(!isReply), setCommentId(cmtId);
              }}
            >
              <FiMessageCircle className=" text-xl" />
            </div>
            {/* <div
              className=" flex items-center gap-1 transition-all duration-300 hover:bg-[#1e1f22] cursor-pointer p-1 rounded-full"
              onClick={() => {
                setIsReply(!isReply), setCommentId(replies?._id);
              }}
            >
              <FiMessageCircle className=" text-xl" />
            </div> */}
            <div className=" flex items-center gap-1 transition-all duration-300 hover:bg-[#1e1f22] cursor-pointer p-1 rounded-full">
              <AiOutlineRetweet className=" text-xl" />
              {/* <div className=" text-sm">12</div> */}
            </div>

            <div className=" flex items-center gap-1 transition-all duration-300 hover:bg-[#1e1f22] cursor-pointer p-1 rounded-full">
              <CiShare1 className=" text-xl cursor-pointer" />
            </div>
          </div>

          {isReply && (
            <div className=" mt-2    gap-2 flex flex-col cmtAnn">
              <Textarea
                className=" bg-black text-white "
                placeholder={`Reply to ${user?.username}`}
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
                              // setGif(e.url);
                              setCommentData({ ...commentData, gif: e.url });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    className={`  max-w-[80px] max-h-[40px] flex-1 text-[13px] text-center mt-1 border p-2 font-medium tracking-wide bg-white    rounded-lg  transition-all duration-300 text-black hover:text-opacity-70
                `}
                    onClick={() => setIsReply(false)}
                  >
                    Cancle
                  </button>
                  <button
                    className={`  max-w-[80px] max-h-[40px] flex-1 text-[13px] text-center mt-1 border p-2 font-medium tracking-wide bg-white    rounded-lg  transition-all duration-300 text-black hover:text-opacity-70
                `}
                    onClick={() => {
                      replyHandler(content, commentData, tempFiles);
                      setIsReply(false);
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* <hr className=" opacity-10" /> */}
      {isShow && (
        <ImageShow
          img={currentImg}
          setIsShow={setIsShow}
          setCurrentImg={setCurrentImg}
        />
      )}
    </div>
  );
};

export default Reply;
