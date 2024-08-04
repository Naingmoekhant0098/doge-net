import axios from "axios";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { FaHeart, FaPlus, FaRegHeart } from "react-icons/fa";
import { GoReport } from "react-icons/go";
import { HiDotsHorizontal } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Controller, FreeMode, Pagination } from "swiper/modules";
import { FiMessageCircle } from "react-icons/fi";
import { AiOutlineRetweet } from "react-icons/ai";
import { CiBookmark, CiShare1 } from "react-icons/ci";
import { IoEyeOffOutline } from "react-icons/io5";
import { BsDot } from "react-icons/bs";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import ImageShow from "./ImageShow";
import { Button, Drawer } from "flowbite-react";
import CommentSection from "../components/CommentSection";

const PostPage = ({ likePost, post, setSinglePost, socket , posts,setPosts }) => {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const swp = useRef(null);
  const [currentImg, setCurrentImg] = useState(null);
  const [isShow, setIsShow] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      const ress = await axios.get(
        `http://localhost:3000/post/getPosts?postId=${id}`,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (ress.status === 200) {
        setSinglePost(ress.data.posts[0]);
      }
    };

    fetchPost();
  }, [id]);
 
  // document.querySelector('.')
  useEffect(() => {
    const fetchUser = async () => {
      const ress = await axios.get(
        `http://localhost:3000/user/getUser?userId=${post?.userId}`,
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

  const parts = post?.content?.split(/(#[a-zA-Z0-9_]+)/g);
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className=" px-2 md:px-0">
      <div className=" w-full">
        <div className="w-full h-auto flex   items-center">
          <div className=" relative   w-full  flex justify-between items-center">
            <div className=" flex group items-center  gap-2 font-semibold">
              <div className=" w-10 h-10 relative cursor-pointe2 mr-1">
                <img
                  src={user?.profile}
                  className=" rounded-full  w-10 h-10 object-cover z-auto"
                  alt=""
                />
                <div className=" bg-white text-black border-2 border-black rounded-full absolute  -bottom-1 -right-1">
                  <FaPlus className=" text-lg p-[3px]" />
                </div>
              </div>
              <div className=" font-medium cursor-pointer   hover:underline">
                {user?.username}
              </div>
              <div className=" opacity-65 text-[13px]  font-normal mt-1">
                {moment(post?.createdAt).fromNow()}
              </div>

              <div
                className=" hidden md:block absolute left-0  transition-all duration-300 top-9 z-50 bg-[#1e1f22]  p-6 px-6 rounded-2xl border border-white border-opacity-25
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
                        This is the test name and test pop up
                      </div>

                      <div className=" mt-3 opacity-50">3456 Followers</div>
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
                onClose={() => setIsOpen(false)}
                position="bottom"
                className=" p-6 pb-24 rounded-[30px] bg-[#1e1f22] text-white"
              >
                <Drawer.Items>
                  <div
                    className=" rounded-xl overflow-hidden mb-4
                    "
                  >
                    <div className="  transition-all duration-300 flex items-center justify-between w-full bg-[#313134] hover:bg-[#2f2f30] px-4 py-3   cursor-pointer">
                      <div className=" font-medium">Save</div>
                      <CiBookmark className=" text-2xl" />
                    </div>
                    <hr className=" opacity-15" />
                    <div className="  transition-all duration-300 flex  items-center justify-between w-full bg-[#313134] hover:bg-[#2f2f30] px-4 py-3   cursor-pointer">
                      <div className=" font-medium">Not interested</div>
                      <IoEyeOffOutline className=" text-2xl" />
                    </div>
                  </div>
                  <div
                    className=" rounded-xl overflow-hidden
                    "
                  >
                    <div className="  transition-all duration-300 flex text-red-500 items-center justify-between w-full bg-[#313134] hover:bg-[#2f2f30] px-4 py-3   cursor-pointer">
                      <div className=" font-medium">Report</div>
                      <GoReport className=" text-2xl" />
                    </div>
                    <hr className=" opacity-15" />
                    <div className="  transition-all duration-300 flex text-red-500 items-center justify-between w-full bg-[#313134] hover:bg-[#2f2f30] px-4 py-3   cursor-pointer">
                      <div className=" font-medium">Report</div>
                      <GoReport className=" text-2xl" />
                    </div>
                  </div>
                </Drawer.Items>
              </Drawer>

              <div
                className={`hidden md:block absolute right-0 w-[250px] transition-all duration-300 top-8 z-50 bg-[#1e1f22]  p-3 rounded-2xl border  border-white border-opacity-25
                  ${open ? "visible opacity-100" : " invisible opacity-0"}  
                `}
              >
                <div className=" flex gap-5 ">
                  <div className="w-full">
                    <div className="  transition-all duration-300 flex text-red-500 items-center justify-between w-full  hover:bg-[#2f2f30] px-4 py-2 rounded-xl cursor-pointer">
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
        </div>
      </div>

      <div className=" h-auto  ">
        <div>
          <div className=" text-md  text-sm mt-3 font-normal opacity-85 tracking-wide md:text-[15px] whitespace-pre">
            {parts?.map((part, index) => {
              if (part.startsWith("#")) {
                return (
                  <Link
                    key={index}
                    className="text-blue-400 "
                    to={`http://localhost:5173/search/${part.substring(1)}`}
                  >
                    {part}
                  </Link>
                );
              } else {
                return part;
              }
            })}
          </div>
        </div>

        {post?.images?.length > 1 ? (
          <div className=" mt-1 flex  w-full  overflow-hidden">
            <div className="w-full  relative  group">
              {post?.images?.length > 2 && (
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
                className="  m-0 mt-2 p-0 w-full h-auto overflow-hidden "
              >
                {post?.images?.map((ptt, index) => {
                  return (
                    <SwiperSlide key={index} className="w-auto cursor-pointer">
                      <img
                        src={ptt}
                        className="max-w-auto min-h-[200px] md:h-[300px] object-cover rounded-lg"
                        alt=""
                        onClick={() => {
                          setIsShow(true);
                          setCurrentImg(ptt);
                        }}
                      />
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </div>
        ) : (
          <div className=" mt-1 flex  w-full  overflow-hidden">
            <div className="     flex gap-2  overflow-x-scroll snap-mandatory   scrollBar scroll-smooth ">
              {post?.images?.map((ptt, index) => {
                return (
                  <img
                    key={index}
                    src={ptt}
                    className="  w-[250px] mt-4 min-h-[300px]   object-cover rounded-lg"
                    alt="not found"
                    onClick={() => {
                      setIsShow(true);
                      setCurrentImg(ptt);
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}
        {post?.gif && (
          <img
            src={post?.gif}
            className=" w-[250px] mt-4 min-h-[300px]  object-cover rounded-lg"
            alt="not found"
            onClick={() => {
              setIsShow(true);
              setCurrentImg(post?.gif);
            }}
          />
        )}

        <div className="w-full gap-2  mt-3 flex items-center   ">
          {post?.likes?.includes(currentUser?._id) ? (
            <div
              className=" flex items-center gap-1  transition-all duration-300 hover:bg-[#1e1f22] cursor-pointer   p-2 rounded-full"
              onClick={() => likePost(post?._id)}
            >
              <FaHeart className=" text-xl  isHeart " />
              <div className=" text-sm">{post?.likes?.length}</div>
            </div>
          ) : (
            <div
              className=" flex items-center gap-1  transition-all duration-300 hover:bg-[#1e1f22] cursor-pointer   p-2 rounded-full"
              onClick={() => likePost(post?._id)}
            >
              <FaRegHeart className=" text-xl " />
              <div className=" text-sm">{post?.likes?.length}</div>
            </div>
          )}
          <Link to={`/post/${post?._id}`}>
            <div className=" flex items-center gap-1 transition-all duration-300 hover:bg-[#1e1f22] cursor-pointer p-2 rounded-full">
              <FiMessageCircle className=" text-xl" />
              <div className=" text-sm">
                {post?.NoOfComments}
                {/* {comments?.length + replies?.length} */}
              </div>
            </div>
          </Link>

          <div className=" flex items-center gap-1 transition-all duration-300 hover:bg-[#1e1f22] cursor-pointer p-2 rounded-full">
            <AiOutlineRetweet className=" text-xl" />
            <div className=" text-sm">12</div>
          </div>

          <div className=" flex items-center gap-1 transition-all duration-300 hover:bg-[#1e1f22] cursor-pointer p-2 rounded-full">
            <CiShare1 className=" text-xl cursor-pointer" />
          </div>
        </div>
      </div>
      {isShow && (
        <ImageShow
          img={currentImg}
          setIsShow={setIsShow}
          setCurrentImg={setCurrentImg}
        />
      )}
      <hr className=" mt-4  opacity-10" />
      <div className=" my-4 text-md">Comments</div>

      <CommentSection
        post={post}
        setPost={setSinglePost}
        socket={socket}
        posts={posts}
        setPosts={setPosts}
      />
    </div>
  );
};

export default PostPage;
