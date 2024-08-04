import React, { useEffect, useRef, useState } from "react";
import { AiOutlineRetweet } from "react-icons/ai";
import { CiShare1, CiShare2 } from "react-icons/ci";
import {
  FaPlus,
  FaRegHeart,
  FaCheck,
  FaShare,
  FaBookmark,
} from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import { HiDotsHorizontal } from "react-icons/hi";
// Import Swiper React components
import { FaHeart } from "react-icons/fa";
import { BsDot } from "react-icons/bs";
import ReactTimeAgo from "react-time-ago";

import { GoReport } from "react-icons/go";
import ReactPlayer from "react-player/youtube";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Controller, FreeMode, Pagination } from "swiper/modules";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import ImageShow from "../pages/ImageShow";
import { Drawer } from "flowbite-react";
import { CiBookmark } from "react-icons/ci";
import { IoEyeOffOutline } from "react-icons/io5";
import { updateFollow, updateSaves } from "../Slice/userSlice";
import { useDispatch } from "react-redux";
import MbComment from "./MbComment";
import { FaUserSlash } from "react-icons/fa6";
import RepostPost from "./RepostPost";
import { RiShareBoxLine } from "react-icons/ri";

import {
  EmailShareButton,
  EmailIcon,
  FacebookIcon,
  FacebookMessengerIcon,
  GabIcon,
  HatenaIcon,
  InstapaperIcon,
  LineIcon,
  LinkedinIcon,
  LivejournalIcon,
  MailruIcon,
  OKIcon,
  PinterestIcon,
  PocketIcon,
  RedditIcon,
  TelegramIcon,
  TumblrIcon,
  TwitterIcon,
  ViberIcon,
  VKIcon,
  WeiboIcon,
  WhatsappIcon,
  WorkplaceIcon,
  XIcon,
  FacebookMessengerShareButton,
  TwitterShareButton,
  TelegramShareButton,
  VKShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  PinterestShareButton,
  RedditShareButton,
  ViberShareButton,
} from "react-share";
import toast from "react-hot-toast";
const Dogg = ({
  post,
  likePost,
  setPosts,

  posts,
  socket,
}) => {
  const swp = useRef(null);
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [countRps, setCountRps] = useState(null);
  const [currentImg, setCurrentImg] = useState(null);
  const [isShow, setIsShow] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const parts = post?.content?.split(/(#[a-zA-Z0-9_]+)/g);
  const { currentUser } = useSelector((state) => state.user);
  const [isOpenm, setIsOpenm] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const dispatch = useDispatch();
  const [isShareShow, setIsShareShow] = useState(false);
  useEffect(() => {
    if (isShow) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isShow]);
  useEffect(() => {
    const fetchUser = async () => {
      const ress = await axios.get(
        `https://doge-net.onrender.com/user/getUser?userId=${post?.userId}`,
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
  }, [post]);
  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const fetchPost = async () => {
      const ress = await axios.get(
        `https://doge-net.onrender.com/post/getPosts?postId=${post?._id}`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (ress.status === 200) {
        setCountRps(ress.data.replies);
      }
    };

    fetchPost();
  }, [post?._id]);
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
        if (ress.data.user.followings.includes(user?._id)) {
          // socket.current.emit("sendNotification", {
          //   senderId: currentUser?._id,
          //   receiverId: user?._id,
          //   type: "follow",
          // });
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

  const saveHandler = async (id) => {
    try {
      const ress = await axios.put(
        "https://doge-net.onrender.com/user/savePost",
        { postId: id, userId: currentUser?._id },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (ress.status === 200) {
        dispatch(updateSaves(ress.data.user.saves));
        if (ress.data.user.saves?.includes(post?._id)) {
          toast(
            "Saved",
            {
              position: "bottom-center",
            },
            {
              style: {
                text: "10px",
              },
            }
          );
        } else {
          toast(
            "Unsaved",
            {
              position: "bottom-center",
            },
            {
              style: {
                text: "8px",
              },
            }
          );
        }
      }
    } catch (error) {}
  };
  return (
    <div className="">
      <div className=" w-full flex gap-3">
        <div className=" h-auto flex flex-col items-center">
          <div className=" w-10 h-10 relative cursor-pointer">
            <img
              src={user?.profile}
              className=" rounded-full w-10 h-10 object-cover z-auto"
              alt=""
            />
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

          <span className=" w-2 h-full   border-l-2 mt-4  opacity-30  z-0"></span>
          <div className=" relative mt-3">
            <img
              src="https://images.ctfassets.net/lh3zuq09vnm2/yBDals8aU8RWtb0xLnPkI/19b391bda8f43e16e64d40b55561e5cd/How_tracking_user_behavior_on_your_website_can_improve_customer_experience.png"
              className=" w-5 md:w-7 h-5 md:h-7  rounded-full  object-cover "
              alt=""
            />
            <img
              src="https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg"
              className="w-4 md:w-6 h-4 md:h-6 rounded-full  object-cover absolute -left-1 md:-left-2  top-6 md:top-7 z-10"
              alt=""
            />
            <img
              src="https://media.istockphoto.com/id/1386479313/photo/happy-millennial-afro-american-business-woman-posing-isolated-on-white.webp?b=1&s=170667a&w=0&k=20&c=ahypUC_KTc95VOsBkzLFZiCQ0VJwewfrSV43BOrLETM="
              className="w-4 md:w-5 rounded-full h-4 md:h-5  object-cover absolute top-5 md:top-7  -right-4 z-10"
              alt=""
            />
          </div>
        </div>

        <div className="flex-1 h-auto  ">
          <div className=" relative -mt-1   flex justify-between items-center">
            <div className=" flex group items-center  gap-2 font-semibold">
              <Link to={`/@${user?.username}`}>
                <div className="  cursor-pointer   hover:underline">
                  {user?.username}
                </div>
              </Link>
              <div className=" opacity-65 text-[13px]  font-normal mt-1">
                {/* {moment(post?.createdAt).fromNow()} */}
                <ReactTimeAgo
                  date={post?.createdAt}
                  locale="en-US"
                  timeStyle={"twitter"}
                />
              </div>

              <div
                className=" absolute hidden md:block left-0  transition-all duration-300 top-9 z-50 bg-[#1e1f22]  p-6 px-6 rounded-2xl border  border-slate-500
                 group-hover:visible group-hover:opacity-100 invisible opacity-0  shadow 
                "
              >
                <div className=" flex gap-5 ">
                  <div className=" ">
                    <div className=" cursor-pointer">
                      <div className=" font-medium">{user?.username}</div>
                      <div className=" text-sm opacity-50"></div>
                    </div>

                    <div className=" mt-2  text-sm ">
                      <div className=" max-w-[160px] opacity-75">
                        {user?.bio}
                      </div>

                      <div className=" mt-3 opacity-50">
                        {" "}
                        {user?.followers.length} Followers
                      </div>
                    </div>
                  </div>
                  <img
                    src="https://images.ctfassets.net/lh3zuq09vnm2/yBDals8aU8RWtb0xLnPkI/19b391bda8f43e16e64d40b55561e5cd/How_tracking_user_behavior_on_your_website_can_improve_customer_experience.png"
                    className=" rounded-full w-14 h-14  object-cover z-auto"
                    alt=""
                  />
                </div>
              </div>
            </div>

            <div className=" group">
              <HiDotsHorizontal
                className=" block md:hidden text-3xl cursor-pointer transition-all duration-500 hover:bg-[#1e1f22]  p-1 text-[30px] rounded-full"
                onClick={() => setIsOpen(!isOpen)}
              />
              <HiDotsHorizontal
                className="hidden md:block text-3xl cursor-pointer transition-all duration-500 hover:bg-[#1e1f22]  p-1 text-[30px] rounded-full"
                onClick={() => setOpen(!open)}
              />

              <Drawer
                open={isOpen}
                onClose={handleClose}
                position="bottom"
                className=" p-6 p rounded-[30px] rounded-b bg-[#1e1f22] text-white z-50"
              >
                <Drawer.Items>
                  <div
                    className=" rounded-xl overflow-hidden mb-4
                    "
                  >
                    {currentUser?.saves?.includes(post?._id) ? (
                      <div
                        className=" text-sm  transition-all duration-300 flex items-center justify-between w-full bg-[#313134] hover:bg-[#2f2f30] px-4 py-3   cursor-pointer"
                        onClick={() => saveHandler(post?._id)}
                      >
                        <div className=" font-medium">Unsave</div>
                        <FaBookmark className=" text-xl" />
                      </div>
                    ) : (
                      <div
                        className=" text-sm  transition-all duration-300 flex items-center justify-between w-full bg-[#313134] hover:bg-[#2f2f30] px-4 py-3   cursor-pointer"
                        onClick={() => saveHandler(post?._id)}
                      >
                        <div className=" font-medium">Save</div>
                        <CiBookmark className=" text-xl" />
                      </div>
                    )}

                    <hr className=" opacity-15" />
                    <div className=" text-sm transition-all duration-300 flex  items-center justify-between w-full bg-[#313134] hover:bg-[#2f2f30] px-4 py-3   cursor-pointer">
                      <div className=" font-medium">Not interested</div>
                      <IoEyeOffOutline className=" text-xl" />
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
              <Drawer
                open={isShareShow}
                onClose={() => setIsShareShow(false)}
                position="bottom"
                className=" p-6 pt-4 rounded-[30px] rounded-b bg-[#1e1f22] text-white z-50"
              >
                <Drawer.Items>
                  <div className=" text-lg font-semibold text-white text-opacity-40 mb-2">
                    Share To{" "}
                  </div>
                  <hr className="  opacity-10" />
                  <div className=" flex flex-wrap gap-2 mt-4">
                    <EmailShareButton>
                      <EmailIcon size={45} round={true} />
                    </EmailShareButton>

                    <FacebookMessengerShareButton>
                      <FacebookIcon size={45} round={true} />
                    </FacebookMessengerShareButton>
                    <TwitterShareButton>
                      <TwitterIcon size={45} round={true} />
                    </TwitterShareButton>

                    <TelegramShareButton>
                      <TelegramIcon size={45} round={true} />
                    </TelegramShareButton>

                    <VKShareButton>
                      <VKIcon size={45} round={true} />
                    </VKShareButton>

                    <WhatsappShareButton>
                      <WhatsappIcon size={45} round={true} />
                    </WhatsappShareButton>
                    <LinkedinShareButton>
                      <LinkedinIcon size={45} round={true} />
                    </LinkedinShareButton>

                    <PinterestShareButton>
                      <PinterestIcon size={45} round={true} />
                    </PinterestShareButton>

                    <RedditShareButton>
                      <RedditIcon size={45} round={true} />
                    </RedditShareButton>

                    <ViberShareButton>
                      <ViberIcon size={45} round={true} />
                    </ViberShareButton>
                  </div>
                </Drawer.Items>
              </Drawer>

              <div
                className={` absolute right-0 w-[250px] transition-all duration-300 top-8 z-50 bg-[#1e1f22]  p-3 rounded-2xl border  border-slate-600
                  ${open ? "visible opacity-100" : " invisible opacity-0"}  
                `}
              >
                <div className=" flex gap-5 ">
                  <div className="w-full">
                    <div className="  transition-all duration-300 flex text-red-500 items-center justify-between w-full hover:bg-[#2f2f30] px-4 py-2 rounded-xl cursor-pointer">
                      <div className=" font-medium">Report</div>
                      <GoReport className=" text-2xl" />
                    </div>
                    <div className=" mt-1 transition-all duration-300 flex text-red-500 items-center justify-between w-full hover:bg-[#2f2f30] px-4 py-2 rounded-xl cursor-pointer">
                      <div className=" font-medium">Report</div>
                      <GoReport className=" text-2xl" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            {/* <Link to={`/post/${post?._id}`}> */}
            <div className=" mb-3 text-wrap text-sm  font-normal opacity-85 tracking-wide md:text-[15px] whitespace-pre">
              {parts?.map((part, index) => {
                if (part.startsWith("#")) {
                  return (
                    <Link
                      key={index}
                      className="text-blue-400 "
                      to={`/searchResults?q=${part.substring(1)}`}
                    >
                      {part}
                    </Link>
                  );
                } else {
                  return part;
                }
              })}
            </div>
            {/* </Link> */}
          </div>

          {post?.isRepost ? (
            <RepostPost postId={post?.tweet_id} />
          ) : (
            <>
              {post?.images?.length > 0 && (
                <div className=" mt-2 flex  w-full   pr-0 md:pr-2 ">
                  <div className="  md:hidden flex gap-2  overflow-x-scroll    w-full   px-2 scrollBar scroll-smooth ">
                    {post?.images?.map((ptt, index) => {
                      return (
                        <img
                          key={index}
                          src={ptt}
                          className="w-[250px]  min-h-[250px]  object-cover rounded-lg"
                          alt="not found"
                          onClick={() => {
                            setIsShow(true);

                            setCurrentIndex(index);
                          }}
                        />
                      );
                    })}
                  </div>

                  <div className=" hidden md:block relative  group">
                    {post.images.length > 2 && (
                      <>
                        <MdNavigateNext
                          className=" absolute -right-24 top-[40%] z-30   cursor-pointer transition-all duration-300 opacity-0 invisible group-hover:visible group-hover:opacity-80 bg-[#1e1f22]  p-1 text-[50px] rounded-full"
                          onClick={() => swp?.current?.slideNext()}
                        />
                        <MdNavigateBefore
                          className=" absolute -left-24  top-[40%] z-30   cursor-pointer transition-all duration-300 opacity-0 invisible group-hover:visible group-hover:opacity-80 bg-[#1e1f22]  p-1 text-[50px] rounded-full"
                          onClick={() => swp?.current?.slidePrev()}
                        />
                      </>
                    )}

                    <Swiper
                      slidesPerView={2}
                      spaceBetween={10}
                      freeMode={true}
                      modules={[FreeMode, Controller]}
                      onBeforeInit={(swpp) => {
                        swp.current = swpp;
                      }}
                      className="  m-0 p-0 w-[580px]  hidden md:block  h-auto overflow-hidden "
                    >
                      {post?.images?.map((ptt, index) => {
                        return (
                          <SwiperSlide key={index} className=" cursor-pointer">
                            {/* < ReactPlayer url='https://youtu.be/8m_GMfmAM6U'  className="max-w-[200px] cursor-pointer md:max-w-[300px] h-[400px] object-cover rounded-lg" /> */}

                            <img
                              src={ptt}
                              className="max-w-auto min-h-[300px] object-cover rounded-lg"
                              alt=""
                              onClick={() => {
                                setIsShow(true);

                                setCurrentIndex(index);
                              }}
                            />
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  </div>
                </div>
              )}
              {post?.gif && (
                <img
                  src={post?.gif}
                  className=" w-[250px] mt-2 min-h-[300px]  object-cover rounded-lg"
                  alt="not found"
                  onClick={() => {
                    setIsShow(true);
                    setCurrentImg(post?.gif);
                    setCurrentIndex(0);
                  }}
                />
              )}
            </>
          )}

          <div className=" mt-3 flex items-center ">
            {post?.likes.includes(currentUser?._id) ? (
              <div
                className=" flex items-center gap-1  transition-all duration-300 hover:bg-[#1e1f22] cursor-pointer   p-2 rounded-full"
                onClick={() => likePost(post._id)}
              >
                <FaHeart className=" text-xl  isHeart " />
                {/* <div className=" text-sm">12</div> */}
              </div>
            ) : (
              <div
                className=" flex items-center gap-1  transition-all duration-300 hover:bg-[#1e1f22] cursor-pointer   p-2 rounded-full"
                onClick={() => likePost(post?._id)}
              >
                <FaRegHeart className=" text-xl " />
                {/* <div className=" text-sm">12</div> */}
              </div>
            )}
            <Link to={`/post/${post?._id}`}>
              <div className="hidden md:flex items-center gap-1 transition-all duration-300 hover:bg-[#1e1f22] cursor-pointer p-2 rounded-full">
                <FiMessageCircle className=" text-xl" />
              </div>
            </Link>
            <div
              className=" flex md:hidden items-center gap-1 transition-all duration-300 hover:bg-[#1e1f22] cursor-pointer p-2 rounded-full"
              onClick={() => setIsOpenm(!isOpenm)}
            >
              <FiMessageCircle className=" text-xl" />
            </div>

            <MbComment
              isOpenm={isOpenm}
              setIsOpenm={setIsOpenm}
              postId={post?._id}
              socket={socket}
              posts={posts}
              setPosts={setPosts}
              postedUser={post?.userId}
            />

            <Link
              to={`repost?pId=${post?._id}`}
              className=" flex items-center gap-1 transition-all duration-300 hover:bg-[#1e1f22] cursor-pointer p-2 rounded-full"
            >
              <AiOutlineRetweet className=" text-xl" />
              {/* <div className=" text-sm">12</div> */}
            </Link>

            <div className=" flex items-center gap-1 transition-all duration-300 hover:bg-[#1e1f22] cursor-pointer p-2 rounded-full">
              <RiShareBoxLine
                className=" text-xl cursor-pointer "
                onClick={() => setIsShareShow(!open)}
              />
            </div>
          </div>

          <div className=" flex gap-1 items-center opacity-70 pl-2 ">
            <div
              className=" text-[14px] cursor-pointer"
              onClick={() => setIsOpenm(!isOpenm)}
            >
              {post?.NoOfComments ? post?.NoOfComments : 0}
              {post?.NoOfComments > 1 ? " replies" : " reply"}
            </div>
            <span>
              <BsDot />
            </span>
            <div className=" text-[14px]">
              {post?.likes.length} {post?.likes.length > 1 ? " likes" : "like"}
            </div>
          </div>
        </div>
      </div>

      <hr className=" mt-12  opacity-10" />

      {isShow && (
        <ImageShow
          img={currentImg}
          setIsShow={setIsShow}
          setCurrentImg={setCurrentImg}
          currentIndex={currentIndex}
          images={post?.images}
        />
      )}
    </div>
  );
};

export default Dogg;
