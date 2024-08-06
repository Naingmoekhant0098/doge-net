import React, { useEffect, useState } from "react";
import { IoEllipsisHorizontal, IoEyeOffOutline } from "react-icons/io5";
import {
  FaAccessibleIcon,
  FaArrowLeft,
  FaBookmark,
  FaInstagram,
  FaLink,
  FaLock,
  FaRegBell,
  FaUniversalAccess,
  FaUserShield,
  FaUserSlash,
} from "react-icons/fa6";
import Posts from "../components/Posts";
import Replies from "../components/Replies";
import Reposts from "../components/Reposts";
import { useDispatch, useSelector } from "react-redux";
import { BsDot, BsThreeDots } from "react-icons/bs";
import { updateFollow } from "../Slice/userSlice";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { TbDotsCircleHorizontal } from "react-icons/tb";
import {
  IoIosArrowBack,
  IoIosHelpCircle,
  IoIosSearch,
  IoMdLogOut,
} from "react-icons/io";
import {
  HiBell,
  HiBookmark,
  HiHeart,
  HiOutlineDotsCircleHorizontal,
  HiUserAdd,
  HiUserCircle,
} from "react-icons/hi";
import { FaExclamationCircle, FaGlobe } from "react-icons/fa";
import { Drawer } from "flowbite-react";
import { GoReport } from "react-icons/go";
import { FiShare } from "react-icons/fi";
import { RiUserForbidLine } from "react-icons/ri";
const Profile = ({ likePost, socket, posts, setPosts }) => {
  const [tab, setTab] = useState("posts");
  const { currentUser } = useSelector((state) => state.user);
  const { name } = useParams();
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenOther, setIsOpenOther] = useState(false);
  const [reposts, setReposts] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const ress = await axios.get(
          `https://doge-net.onrender.com/user/getUser?username=${name?.replace(
            "@",
            ""
          )}`,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        if (ress.status === 200) {
          setUser(ress.data.user);

          // setReposts(res.data.reposts);
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
      <div className=" w-full flex justify-between items-center mb-3">
        {currentUser?._id !== user?._id ? (
          <FaArrowLeft className=" text-xl cursor-pointer" onClick={goBack} />
        ) : (
          <FaGlobe className="text-xl cursor-pointer" />
        )}

        {currentUser?._id !== user?._id ? (
          <div className=" flex items-center gap-3">
            <FaRegBell className=" text-xl cursor-pointer" />
            <TbDotsCircleHorizontal
              className=" text-2xl cursor-pointer"
              onClick={() => setIsOpenOther(true)}
            />
          </div>
        ) : (
          <div
            className=" flex flex-col gap-1 items-end cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            {/* <BsThreeDots className=" text-2xl cursor-pointer" /> */}
            <div className=" w-4 rounded-sm bg-white h-[3px]"></div>
            <div className=" w-3 bg-white rounded-sm h-[3px]"></div>
            <div className=" w-2 bg-white rounded-sm h-[3px]"></div>
          </div>
        )}
      </div>
      <div className=" flex gap-5 w-full items-center mt-3">
        <div className=" flex-1 ">
          <div className=" cursor-pointer">
            <div className=" font-medium text-xl ">{user?.username}</div>
            <div className=" text-[14px] mt-1 opacity-80">{user?.email}</div>
            <div className="  text-[14px] mt-1 ">
              <div className=" opacity-85 pr-32">{user?.bio}</div>
            </div>
          </div>
        </div>
        <div>
          <img
            src={user?.profile}
            className=" rounded-full  w-16 h-16  object-cover z-auto"
            alt=""
          />
        </div>
      </div>

      <div className="w-full mt-2 flex justify-between items-center">
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

      <div className=" mt-4 flex w-full gap-4 ">
        {currentUser?._id === user?._id ? (
          <>
            <Link
              to={`/editProfile`}
              className="flex-1 text-[14px] text-center border py-1 md:py-2 font-medium tracking-wide  cursor-pointer rounded-xl border-white border-opacity-35 transition-all duration-300 text-white hover:text-opacity-70"
            >
              Edit Profile
            </Link>
            <div className=" flex-1 text-center text-[14px] font-medium  border py-1 md:py-2 tracking-wide rounded-xl cursor-pointer border-white border-opacity-35 transition-all duration-300 text-white hover:text-opacity-70">
              Share Profile
            </div>
          </>
        ) : (
          <>
            {currentUser?.followings?.includes(user?._id) ? (
              <div
                className="flex-1 text-[14px] text-center border py-1 md:py-2  font-medium tracking-wide  cursor-pointer rounded-xl border-white border-opacity-35 transition-all duration-300 text-white hover:text-opacity-70"
                onClick={() => handleFollow()}
              >
                Following
              </div>
            ) : (
              <div
                className="flex-1 text-[14px] text-center border py-1 md:py-2 font-medium tracking-wide  cursor-pointer rounded-xl border-white border-opacity-35 transition-all duration-300 text-white hover:text-opacity-70"
                onClick={() => handleFollow()}
              >
                Follow
              </div>
            )}

            <div className=" flex-1 text-center text-[14px] font-medium  border py-1 md:py-2 tracking-wide rounded-xl cursor-pointer border-white border-opacity-35 transition-all duration-300 text-white hover:text-opacity-70">
              Mention
            </div>
          </>
        )}
      </div>

      <div className=" mt-4 flex w-full ">
        <div
          className={` text-[15px] flex-1 text-center cursor-pointer border-b-2 py-1 md:py-2 font-medium  border-white   ${
            tab === "posts"
              ? " opacity-100 border-opacity-100"
              : "opacity-65 border-opacity-35"
          }`}
          onClick={() => setTab("posts")}
        >
          Doges
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
          className={` text-[15px] flex-1 text-center cursor-pointer border-b-2 py-1 md:py-2  font-medium  border-white     ${
            tab === "reposts"
              ? " opacity-100 border-opacity-100"
              : "opacity-65 border-opacity-35"
          }`}
          onClick={() => setTab("reposts")}
        >
          Redoges
        </div>
      </div>

      <div className=" mt-4  ">
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

      <Drawer
        open={isOpen}
        onClose={() => setIsOpen(false)}
        position="right"
        className="   rounded-b bg-[#14161f] text-white z-50"
      >
        <Drawer.Items>
          <div className="flex items-center gap-2 font-semibold text-white py-1   mb-2">
            <FaArrowLeft
              className=" text-lg cursor-pointer opacity-75 "
              onClick={() => setIsOpen(false)}
            />
            <span className=" text-md text-white text-opacity-75 tracking-wide">
              Settings
            </span>
          </div>
          <hr className="  opacity-10" />

          <div className=" flex flex-col gap-4 mt-4">
            <div className=" flex items-center gap-2 opacity-65 cursor-pointer">
              <HiUserAdd className="text-2xl" />
              <span className=" text-[14px]">Follow and invite friends</span>
            </div>
            <div className=" flex items-center gap-2 opacity-65 cursor-pointer">
              <HiBell className="text-2xl" />
              <span className=" text-[14px]">Notifications</span>
            </div>
            <div className=" flex items-center gap-2 opacity-65 cursor-pointer">
              <HiHeart className="text-2xl" />
              <span className=" text-[14px]"> Liked</span>
            </div>
            <div className=" flex items-center gap-2 opacity-65 cursor-pointer">
              <HiBookmark className="text-2xl" />
              <span className=" text-[14px]"> Saved</span>
            </div>
            <div className=" flex items-center gap-2 opacity-65 cursor-pointer">
              <FaLock className="text-xl" />
              <span className=" text-[14px]">Privacy</span>
            </div>
            <div className=" flex items-center gap-2 opacity-65 cursor-pointer">
              <FaUniversalAccess className="text-xl" />
              <span className=" text-[14px]">Accessibility</span>
            </div>
            <div className=" flex items-center gap-2 opacity-65 cursor-pointer">
              <HiUserCircle className="text-2xl" />
              <span className=" text-[14px]">Account</span>
            </div>
            <div className=" flex items-center gap-2 opacity-65 cursor-pointer">
              <IoIosHelpCircle className="text-2xl" />
              <span className=" text-[14px]">Help</span>
            </div>
            <div className=" flex items-center gap-2 opacity-65 cursor-pointer">
              <FaExclamationCircle className="text-2xl" />
              <span className=" text-[14px]"> About</span>
            </div>
            <div className=" flex items-center gap-2 opacity-65 cursor-pointer">
              <IoMdLogOut className="text-2xl" />
              <span className=" text-[14px]"> Log out</span>
            </div>
          </div>
        </Drawer.Items>

    
      </Drawer>

      <Drawer
          open={isOpenOther}
          onClose={() => setIsOpenOther(false)}
          position="bottom"
          className=" p-6  rounded-[30px] rounded-b bg-[#1e1f22] text-white z-50"
        >
          <Drawer.Items className=" text-white text-opacity-80 ">
            <div className=" flex  items-center gap-3 mb-4">
            <div className=" text-sm rounded-xl   transition-all duration-300 flex items-center justify-center flex-col w-full bg-[#313134] hover:bg-[#2f2f30] px-4 py-3   cursor-pointer">
            <FaLink className="text-xl" />
                <div className=" font-medium tracking-wide mt-1">Copy link</div>
               
              </div>
              <div className=" text-sm rounded-xl text-white text-opacity-80   transition-all duration-300 flex items-center justify-center flex-col w-full bg-[#313134] hover:bg-[#2f2f30] px-4 py-3   cursor-pointer">
              <FiShare className="text-xl" />
                <div className=" font-medium  tracking-wide mt-1">Share via</div>
               
              </div>
            </div>
            <div className=" text-sm rounded-xl mb-4  transition-all duration-300 flex items-center justify-between w-full bg-[#313134] hover:bg-[#2f2f30] px-4 py-3   cursor-pointer">
                <div className=" font-medium">About this profile</div>
                <FaExclamationCircle className="text-xl" />
              </div>
            <div
              className=" rounded-xl overflow-hidden mb-4
                    "
            >
              <div className=" text-sm  transition-all duration-300 flex items-center justify-between w-full bg-[#313134] hover:bg-[#2f2f30] px-4 py-3   cursor-pointer">
                <div className=" font-medium">Mute</div>
                <RiUserForbidLine className=" text-xl" />
              </div>

              <hr className=" opacity-15" />
              <div className=" text-sm transition-all duration-300 flex  items-center justify-between w-full bg-[#313134] hover:bg-[#2f2f30] px-4 py-3   cursor-pointer">
                <div className=" font-medium">Restrict</div>
                <FaUserShield className=" text-xl" />
              </div>
            </div>
            <div
              className=" rounded-xl overflow-hidden
                    "
            >
              <div className="  transition-all duration-300 flex text-red-500 items-center justify-between w-full bg-[#313134] hover:bg-[#2f2f30] px-4 py-3   cursor-pointer">
                <div className="text-sm font-medium">Block</div>
                <FaUserSlash className=" text-xl" />
              </div>
              <hr className=" opacity-15" />
              <div className="  transition-all duration-300 flex text-red-500 items-center justify-between w-full bg-[#313134] hover:bg-[#2f2f30] px-4 py-3   cursor-pointer">
                <div className="text-sm font-medium">Report</div>
                <GoReport className=" text-xl" />
              </div>
            </div>
          </Drawer.Items>
        </Drawer>
    </div>
  );
};

export default Profile;
