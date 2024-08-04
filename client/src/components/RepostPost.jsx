import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
const RepostPost = ({ postId }) => {
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const ress = await axios.get(
          `http://localhost:3000/post/getPosts?postId=${postId}`,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        if (ress.status === 200) {
          setPost(ress.data.posts[0]);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchPost();
  }, [postId]);

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
  }, [post?._id]);

  
  const parts = post?.content?.split(/(#[a-zA-Z0-9_]+)/g);
  return (
     
      <div className=" w-full  p-4 rounded-lg   border border-white   border-opacity-25">
        <div className="flex-1 h-auto  ">
          <div className=" relative -mt-1   flex justify-between items-center">
            <div className=" flex group items-center  gap-2 font-semibold">
              <div className=" w-auto h-auto relative cursor-pointer">
                <img
                  src={user && user?.profile}
                  className=" rounded-full w-8 h-8 object-cover z-auto"
                  alt=""
                />
              </div>
              <Link to={`/@${user && user?.username}`}>
                <div className="  cursor-pointer   hover:underline">
                  {user?.username}
                </div>
              </Link>
              <div className=" opacity-65 text-[13px]  font-normal mt-1">
                {/* {moment(post?.createdAt).fromNow()} */}
                {post?.createdAt && (
                  <ReactTimeAgo
                    date={post?.createdAt}
                    locale="en-US"
                    timeStyle={"twitter"}
                  />
                )}
              </div>
            </div>
          </div>

          <div>
            {/* <Link to={`/post/${post?._id}`}> */}
            <div className="  mt-2 text-wrap text-sm  font-normal opacity-85 tracking-wide md:text-[15px] whitespace-pre">
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

          {post?.images?.length > 0 && (
            <div className=" mt-4 flex  w-full   pr-0 md:pr-2 ">
              <div className=" flex gap-2  overflow-x-hidden    w-full   px-2 scrollBar scroll-smooth ">
                {post?.images?.map((ptt, index) => {
                  return (
                    <img
                      key={index}
                      src={ptt}
                      className="w-[250px]  min-h-[250px]  object-cover rounded-lg"
                      alt="not found"
                    />
                  );
                })}
              </div>
            </div>
          )}
          {post?.gif && (
            <img
              src={post?.gif}
              className=" w-[200px] md:w-[250px] mt-4 min-h-[250px]  object-cover rounded-lg"
              alt="not found"
            />
          )}
        </div>
      </div>
    
  );
};

export default RepostPost;
