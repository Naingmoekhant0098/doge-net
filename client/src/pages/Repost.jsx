import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import RepostPost from "../components/RepostPost";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

const Repost = ({ setSendPost }) => {
  const location = useLocation();
  const Pid = new URLSearchParams(location.search);
  const { currentUser } = useSelector((state) => state.user);
  const [postId, setPostId] = useState("");
  const [content, setContent] = useState("");
  useEffect(() => {
    setPostId(Pid.get("pId"));
  }, [location.search]);
  const navigate = useNavigate();
  const submitHandler = async () => {
    try {
      const resData = await axios.post(
        "http://localhost:3000/post/createPost",
        {
          content: content,
          tweet_id: postId,
          isRepost: true,
          userId: currentUser?._id,
        }
      );

      if (resData.status === 200) {
        setSendPost(resData.data.post);
        navigate("/");

        toast(
          "Reposted",
          {
            position: "bottom-center",
          },
          {
            style: {
              text: "10px",
            },
          }
        );
      }
    } catch (error) {}
  };
  const goBack = () => {
    window.history.back();
  };
  return (
    <div className="w-full flex flex-col   px-4 md:px-0  ">
      <div className=" flex items-center gap-4">
        <FaArrowLeft className=" text-xl cursor-pointer" onClick={goBack} />
        <div className="  text-xl font-medium">Repost Dogenet</div>
      </div>

      <div className="  w-full flex gap-3 mt-5">
        <div className=" h-auto flex flex-col items-center">
          <div className=" w-10 h-10  relative cursor-pointer">
            <img
              src={currentUser?.profile}
              className=" rounded-full w-full h-10  object-cover z-auto"
              alt=""
            />
          </div>

          <span className=" w-2 h-full   border-l-2 mt-4  opacity-30  z-0"></span>
          <div className=" relative mt-2">
            <img
              src={currentUser?.profile}
              className="w-6 h-6  rounded-full  object-cover "
              alt=""
            />
          </div>
        </div>

        <div className=" h-auto w-full  md:w-[600px] overflow-hidden ">
          <div className="text-[14px]">{currentUser?.username}</div>

          <div className=" mt-2 px-1">
            <textarea
              type="email"
              autoFocus
              required
              value={content}
              className="    text-white    mb-2 text-[14px]    rounded-lg w-full postText"
              placeholder="What's news ?"
              rows={1}
              onChange={(e) => setContent(e.target.value)}
            />
            <RepostPost postId={postId} />

            <div className=" mt-6 flex  justify-between items-center">
              <div className=" text-sm opacity-30">Repost dogenet</div>
              <div
                className="bg-white   text-black px-4 py-2 text-sm font-bold rounded-lg transition-all duration-300 hover:opacity-60 cursor-pointer"
                onClick={submitHandler}
              >
                Post
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Repost;
