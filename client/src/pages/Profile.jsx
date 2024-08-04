import React, { useEffect, useState } from "react";
import { IoEllipsisHorizontal } from "react-icons/io5";
import { FaArrowLeft, FaInstagram } from "react-icons/fa6";
import Posts from "../components/Posts";
import Replies from "../components/Replies";
import Reposts from "../components/Reposts";
import { useDispatch, useSelector } from "react-redux";
import { BsDot, BsThreeDots } from "react-icons/bs";
import { updateFollow } from "../Slice/userSlice";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { IoIosArrowBack, IoIosSearch } from "react-icons/io";
import { HiOutlineDotsCircleHorizontal } from "react-icons/hi";
const Profile = ({ likePost, socket, posts, setPosts }) => {
  const [tab, setTab] = useState("posts");
  const { currentUser } = useSelector((state) => state.user);
  const { name } = useParams();
  const [user, setUser] = useState(null);

  const [reposts, setReposts] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `https://doge-net.onrender.com/user/getUser?username=${name?.replace(
            "@",
            ""
          )}`,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        if (res.status === 200) {
          setUser(res.data.user);

          setReposts(res.data.reposts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchUser();
  }, [name]);

  const handleFollow = async () => {
    try {
      const ress = await axios.put(
        "https://doge-net.onrender.com/post/followUser",
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
            "https://doge-net.onrender.com/user/updateNotification",
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
  const goBack = () => {
    window.history.back();
  };
  return (
    <div className="px-3 md:px-0">
      <div className=" w-full flex justify-between items-center">
        <FaArrowLeft className=" text-xl cursor-pointer" onClick={goBack} />

        <div>
          <BsThreeDots className=" text-2xl cursor-pointer" />
        </div>
      </div>
      <div className=" flex gap-5 w-full items-center mt-3">
        <div className=" flex-1 ">
          <div className=" cursor-pointer">
            <div className=" font-medium text-xl ">{user?.username}</div>
            <div className=" text-[14px] opacity-80">{user?.email}</div>
          </div>
        </div>
        <div>
          <img
            src={user?.profile}
            className=" rounded-full w-20 h-20  object-cover z-auto"
            alt=""
          />
        </div>
      </div>
      <div className="  text-[14px] ">
        <div className=" opacity-85 pr-32">{user?.bio}</div>
      </div>
      <div className="w-full flex justify-between items-center mt-3">
        <div className=" opacity-50 text-[14px] flex items-center">
          <div>{user?.followers ? user?.followers.length : 0} followers</div>
          <span>
            <BsDot />
          </span>
          <div>{user?.followings ? user?.followings.length : 0} followings</div>
        </div>

        {/* <div>
          <div className=" flex items-center gap-4 cursor-pointer">
            <FaInstagram className=" text-3xl" />
            <IoEllipsisHorizontal className=" text-3xl border-2 rounded-full p-1" />
          </div>
        </div> */}
      </div>

      <div className=" mt-6 flex w-full gap-4 ">
        {currentUser?._id === user?._id ? (
          <>
            <Link
              to={`/editProfile`}
              className="flex-1 text-[14px] text-center border py-2 font-medium tracking-wide  cursor-pointer rounded-xl border-white border-opacity-35 transition-all duration-300 text-white hover:text-opacity-70"
            >
              Edit Profile
            </Link>
            <div className=" flex-1 text-center text-[14px] font-medium  border py-2 tracking-wide rounded-xl cursor-pointer border-white border-opacity-35 transition-all duration-300 text-white hover:text-opacity-70">
              Share Profile
            </div>
          </>
        ) : (
          <>
            {currentUser?.followings?.includes(user?._id) ? (
              <div
                className="flex-1 text-[14px] text-center border py-2 font-medium tracking-wide  cursor-pointer rounded-xl border-white border-opacity-35 transition-all duration-300 text-white hover:text-opacity-70"
                onClick={() => handleFollow()}
              >
                Following
              </div>
            ) : (
              <div
                className="flex-1 text-[14px] text-center border py-2 font-medium tracking-wide  cursor-pointer rounded-xl border-white border-opacity-35 transition-all duration-300 text-white hover:text-opacity-70"
                onClick={() => handleFollow()}
              >
                Follow
              </div>
            )}

            <div className=" flex-1 text-center text-[14px] font-medium  border py-2 tracking-wide rounded-xl cursor-pointer border-white border-opacity-35 transition-all duration-300 text-white hover:text-opacity-70">
              Mention
            </div>
          </>
        )}
      </div>

      <div className=" mt-6 flex w-full ">
        <div
          className={` text-[15px] flex-1 text-center cursor-pointer border-b-2 py-2 font-medium  border-white   ${
            tab === "posts"
              ? " opacity-100 border-opacity-100"
              : "opacity-65 border-opacity-35"
          }`}
          onClick={() => setTab("posts")}
        >
          Posts
        </div>
        {/* <div
          className={` text-[15px] flex-1 text-center cursor-pointer border-b-2 py-2  font-medium border-white  ${
            tab === "replies"
              ? " opacity-100 border-opacity-100"
              : "opacity-65 border-opacity-35"
          }`}
          onClick={() => setTab("replies")}
        >
          Replies
        </div> */}
        <div
          className={` text-[15px] flex-1 text-center cursor-pointer border-b-2 py-2  font-medium  border-white     ${
            tab === "reposts"
              ? " opacity-100 border-opacity-100"
              : "opacity-65 border-opacity-35"
          }`}
          onClick={() => setTab("reposts")}
        >
          Reposts
        </div>
      </div>

      <div className=" mt-6  ">
        {tab === "posts" && (
          <Posts
            posts={posts}
            setPosts={setPosts}
            socket={socket}
            likePost={likePost}
            userId={user?._id}
          />
        )}

        {tab === "reposts" && (
          <Reposts
            posts={posts}
            setPosts={setPosts}
            socket={socket}
            likePost={likePost}
            userId={user?._id}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;
